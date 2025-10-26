---
permalink: /spring/transaction-failure
---

# Spring事务的失效场景？

>   参考：https://juejin.cn/post/7003949263281455112?searchId=202503072108394D5311941DDE7910231C#heading-4

在Spring中我们可以通过编程式或声明式来实现事务

- 编程式事务的开启、提交、回滚都由我们手动控制，不在这个问题的考虑范围内

- 对于声明式即使用`@Transactional`注解来实现事务，是Spring给我们提供的一个环绕通知，通过AOP生成动态代理类才实现的事务，其事务的开启、提交、回滚由代理类负责

>   重点就在于这个代理，在spring中，默认会通过cglib为目标类生成一个代理对象，如果代理失效，那么事务也就失效了。

因此，Spring事务失效的场景主要有以下几种

**代理失效**：

- **非public方法使用@Transactional**
- **被final或static关键字修饰的方法**
- **在同类中的非事务方法调用事务方法（同类内部方法调用问题）** | **this直接调用**
    - 原因：不触发代理机制
- **Bean没有被Spring管理**

**@Transactional 注解使用不当引发的常见事务失效场景**：

- **抛出的是受检异常（异常类型不匹配）**
    - 原因：默认只对非受检（运行时）异常回滚
- 事务传播行为设置错误（`@Transactional` 注解属性 `propagation` 设置错误）
- 事务回滚设置错误（`@Transactional` 注解属性 `rollbackFor` 设置错误）
- **事务拦截器配置错误**
- **事务超时配置错误**   
- 用错注解，注解不是spring中的，比如用的是`javax.transaction.Transactional`
- **吞并异常（即异常被方法内部吞并，并未抛出）**
    - 异常被catch捕获导致`@Transactional`失效

**事务中使用了多线程**：

- **事务中使用了多线程 或 异步线程调用**
    - 原因：异步任务在不同线程

**数据库本身不支持事务**：

- **数据库引擎本身不支持事务**，例如使用MyISAM引擎
- **操作跨越多个数据源**

:::tip
代理失效

- 1、类内部自调用
- 2、私有方法调用
- 3、内部类方法调用
- 4、`static`静态方法调用（原因：类方法属于类本身，代理机制无法对类方法进行代理或拦截）
- 5、`final`方法调用（原因：`final`修饰的方法无法被重写，代理机制无法对 `final` 方法进行拦截或增强）

[Spring AOP在什么场景下会失效？](./Spring AOP在什么场景下会失效？.md)
:::

## 代理失效

### 非public方法使用@Transactional

Spring事务管理是基于AOP实现的，而AOP通过JDK动态代理或CGLib动态代理，**只会代理`public`方法**。如果事务方法的访问修饰符为非`public`，Spring AOP无法正确地代理该方法，从而导致事务失效。

错误示例：事务方法的访问修饰符被设置为private、default或protected。

```java
@Service
public class UserService {
    
    @Transactional
    private void add(UserModel userModel) {
         saveData(userModel);
         updateData(userModel);
    }
}
```

private修饰的方法，只对在当前对象中被其他方法调用，也就是**对象的自调用**，也就是**this调用**，走不到代理对象，不走代理逻辑。


解决方案：将需要事务管理的方法设置为public。

:::details 为什么非public方法使用@Transactional会失效？
说白了，在`AbstractFallbackTransactionAttributeSource`类的`computeTransactionAttribute`方法中有个判断，如果目标方法不是`public`，则`TransactionAttribute`返回null，即不支持事务

```java
protected TransactionAttribute computeTransactionAttribute(Method method, @Nullable Class<?> targetClass) {
    // Don't allow no-public methods as required.
    if (allowPublicMethodsOnly() && !Modifier.isPublic(method.getModifiers())) {
        return null;
    }

    // The method may be on an interface, but we need attributes from the target class.
    // If the target class is null, the method will be unchanged.
    Method specificMethod = AopUtils.getMostSpecificMethod(method, targetClass);

    // First try is the method in the target class.
    TransactionAttribute txAttr = findTransactionAttribute(specificMethod);
    if (txAttr != null) {
        return txAttr;
    }

    // Second try is the transaction attribute on the target class.
    txAttr = findTransactionAttribute(specificMethod.getDeclaringClass());
    if (txAttr != null && ClassUtils.isUserLevelMethod(method)) {
        return txAttr;
    }

    if (specificMethod != method) {
        // Fallback is to look at the original method.
        txAttr = findTransactionAttribute(method);
        if (txAttr != null) {
        return txAttr;
        }
        // Last fallback is the class of the original method.
        txAttr = findTransactionAttribute(method.getDeclaringClass());
        if (txAttr != null && ClassUtils.isUserLevelMethod(method)) {
        return txAttr;
        }
    }
    return null;
}
```

简单总结一下，如果方法的访问修饰符为非`public`，则Spring不会提供事务功能

:::

### 被final、static关键字修饰的方法

和上边的原因类似，在对 `final` 、`static` 修饰的方法上加 `@Transactional` 事务也不会生效。

- `static` 静态方法属于类本身的而非实例，因此代理机制是无法对静态方法进行代理或拦截的
- `final` 修饰的方法不能被子类重写，事务相关的逻辑无法插入到 `final` 方法中，因此代理机制无法对 `final` 方法进行拦截或增强

> 这些都是java基础概念了，使用时要注意

```java
// 反例
@Transactional
public static void b() {
    // 事务管理不会生效
}

@Transactional
public final void b() {
    // 事务管理不会生效
}
```


### **在同类中的非事务方法调用事务方法（同类内部方法调用问题）** | **this直接调用**

>   重点在于：确保调用的方法是代理对象的方法，而非原始对象的方法。

Spring的事务管理是通过动态代理实现的，只有通过代理对象调用的方法才能享受到Spring的事务管理。如果在同一个类中，一个没有标记为`@Transactional`的方法内部调用了一个标记为`@Transactional`的方法，那么事务是不会起作用的。

**注意了**，这种情况经常发生啊！

同类内部方法间的调用是 @Transactional 注解失效的重灾区，网上你总能看到方法内部调用另一个同类的方法时，**这种调用是不会经过代理的**，因此事务管理不会生效。但这说法比较片面，要分具体情况。

比如：如果 testMerge() 方法未开启事务，并且在同类中调用了非事务方法 a() 和事务方法 b()，当 b() 抛出异常时，a() 和 b() 的事务都不会生效。因为这种调用直接通过 `this` 对象进行，未经过代理，因此事务管理无法生效。这经常出问题的！

```java
public String testMerge() {

    a();

    b();

    return "ok";
}

public void a() {
    standardBakService.save(testAService.buildEntity());
}

@Transactional
public void b() {
    standardBak2Service.save(testBService.buildEntity2());
    throw new RuntimeException("b error");
}
```

解决方案：

- **独立的 Service 类**：尽量将事务方法放在不同的类中
- **自注入方式**：通过自己注入自己的方式解决，尽管解决了问题，逻辑看起来很奇怪，它破坏了依赖注入的原则，虽然 spring 支持我们这样用，还是要注意下循环依赖的问题。（补充：Spring内部的三级缓存保证了它不会出现循环依赖的问题，但是不建议这样做）
- **手动获取代理对象**：使用Spring的`AopContext.currentProxy()`来获取当前类的代理对象，然后通过代理对象调用事务方法。


### Bean没有被Spring管理

比如说你的Bean没有被Spring管理，也就是说没有通过@Service等注解把他标注成一个Bean，而是自己new了一个的话，那里面的方法就也会事务失效。

```java
// 此处忘记加@Service注解了，add方法事务失效
public class UserService {

    @Transactional
    public void add(UserModel userModel) {
         saveData(userModel);
         updateData(userModel);
    }    
}

```


## **抛出的是受检异常（异常类型不匹配）**

Spring 的事务默认会回滚`RuntimeException` 及其子类，以及 `Error` 类型的异常。

如果抛出的是其他类型的异常，例如 `checked exceptions`（检查型异常），即继承自 Exception 但不继承自 RuntimeException 的异常，比如 `SQLException`、`DuplicateKeyException`，事务将不会回滚。

对于检查性异常，即使你在方法中抛出了，Spring也不会回滚事务，除非你在@Transactional注解中显式地指定需要回滚哪些检查性异常。

解决方案：了解Spring事务管理对异常的处理，必要时在@Transactional注解中指定需要回滚的异常类型。

```java
@Transactional(rollbackFor = Exception.class)	// 指定回滚的异常
public String testMerge() throws Exception {
    try {
       	// ..
        
    } catch (Exception e) {
        log.error("testMerge error:{}", e);
        throw new Exception(e);
    }
    return "ok";
}
```

:::warning 注意
`@Transactional` 注解属性 `rollbackFor` 设置错误，也会导致事务失效，发生异常不会滚
:::


## **吞并异常（即异常被方法内部吞并，并未抛出）**

当异常在方法内部被捕获并处理时，Spring 的事务管理器无法感知到异常的发生，因此不会触发事务回滚。这会导致预期的事务行为无法正常工作。

```java
@Transactional
public String testMerge()  {
    try {
       	// ..
        
    } catch (Exception e) {
        log.error("testMerge error:{}", e);
        // 方法内部捕获了异常，但是未抛出
    }
    return "ok";
}
```

因为异常被捕获，所以就没办法基于异常进行rollback了，所以事务会失效


## **事务拦截器配置错误**

如果没有正确地配置事务拦截器，例如没有指定切入点或指定了错误的切入点，就会导致Spring事务失效。

例如：事务传播参数配置错误也会导致事务的不回滚。



## **事务超时配置错误**

如果事务超时时间设置得太短，就有可能在事务执行过程中出现超时，从而导致Spring事务失效



## **异步线程调用**

在Spring中，事务和线程是绑定关系，一个线程绑定一个连接。如果在一个事务中使用了线程池或多线程（或异步线程）的方式去调用另一个被调用者的方法，此时此刻，事务的传播行为会失效，事务也会失效。

深层原因是因为`@Transactional` 的事务管理使用的是 ThreadLocal 机制来存储事务上下文，而**ThreadLocal 变量是线程隔离的**，即每个线程都有自己的事务上下文副本。因此，在多线程环境下，Spring 的声明式事务会失效，即新线程中的操作不会被包含在原有的事务中。


例如，testMerge() 方法在事务中调用了 testA()，testA() 方法中开启了事务。接着，在 testMerge() 方法中，我们通过一个新线程调用了 testB()，testB() 中也开启了事务，并且在 testB() 中抛出了异常。

此时的回滚情况是怎样的呢？

```java
@Transactional
public String testMerge() {

    testAService.testA();

    new Thread(() -> {
        try {
            testBService.testB();
        } catch (Exception e) {
            throw new RuntimeException();
        }
    }).start();

    return "ok";
}

@Transactional
public String testB() {
    DeepzeroStandardBak2 entity2 = buildEntity2();

    dataImportJob2Service.save(entity2);

    throw new RuntimeException("test2");
}

@Transactional
public String testA() {
    DeepzeroStandardBak entity = buildEntity();
    standardBakService.save(entity);
    return "ok";
}
```

答案是：testA() 和 testB() 中的事务都不会回滚。

testA() 无法回滚是因为没有捕获到新线程中 testB()抛出的异常；testB()方法无法回滚，是因为事务管理器只对当前线程中的事务有效，因此在新线程中执行的事务不会回滚。

由于在多线程环境下，Spring 的事务管理器不会跨线程传播事务，事务的状态（如事务是否已开启）是存储在线程本地的 `ThreadLocal` 来存储和管理事务上下文信息。这意味着每个线程都有一个独立的事务上下文，事务信息在不同线程之间不会共享。



## 数据库引擎本身不支持事务

如myisam引擎，不支持事务