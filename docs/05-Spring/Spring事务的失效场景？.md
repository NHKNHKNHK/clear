# Spring事务的失效场景？

>   参考：https://juejin.cn/post/7003949263281455112?searchId=202503072108394D5311941DDE7910231C#heading-4

在Spring中我们可以通过编程式或声明式来实现事务

-   编程式事务的开启、提交、回滚都由我们手动控制，不在这个问题的考虑范围内

-   对于声明式即使用`@Transactional`注解来实现事务，是Spring给我们提供的一个环绕通知，通过AOP生成代理类才实现的事务，其事务的开启、提交、回滚由代理类负责

>   重点就在于这个代理，在spring中，会通过cglib为目标类生成一个代理对象

因此，Spring事务失效的场景主要有以下几种

-   **非public方法使用@Transactional**
-   **被final或static关键字修饰的方法**
-   **在同类中的非事务方法调用事务方法（同类内部方法调用问题）** | **this直接调用**
    -   原因：不触发代理机制
-   **抛出的是受检异常（异常类型不匹配）**
    -   原因：默认只对非受检（运行时）异常回滚
-   **吞并异常（即异常被方法内部吞并，并未抛出）**
-   **事务拦截器配置错误**
-   **事务超时配置错误**
-   **异步线程调用**
    -   原因：异步任务在不同线程
-   **数据库本身不支持事务**，例如使用MyISAM引擎
-   **操作跨越多个数据源**
-   **Bean没有被Spring管理**



## 1、**非public方法使用@Transactional**

场景描述：Spring事务管理是基于AOP实现的，而AOP对于JDK动态代理或CGLib动态代理**只会代理public方法**。如果事务方法的访问修饰符为非public，SpringAOP无法正确地代理该方法，从而导致事务失效。

错误示例：事务方法的访问修饰符被设置为private、default或protected。

解决方案：将需要事务管理的方法设置为public。



## 2、**被final、static关键字修饰的方法**

和上边的原因类似，在对 `final` 、`static` 修饰的方法上加 `@Transactional` 事务也不会生效。

-   static 静态方法属于类本身的而非实例，因此代理机制是无法对静态方法进行代理或拦截的
-   final 修饰的方法不能被子类重写，事务相关的逻辑无法插入到 final 方法中，因此代理机制无法对 final 方法进行拦截或增强

>   这些都是java基础概念了，使用时要注意
>

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



## 3、**在同类中的非事务方法调用事务方法（同类内部方法调用问题）** | **this直接调用**

>   重点在于：确保调用的方法是代理对象的方法，而非原始对象的方法。

场景描述：Spring的事务管理是通过动态代理实现的，只有通过代理对象调用的方法才能享受到Spring的事务管理。如果在同一个类中，一个没有标记为@Transactional的方法内部调用了一个标记为@Transactional的方法，那么事务是不会起作用的。

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

-   **独立的 Service 类**：尽量将事务方法放在不同的类中
-   **自注入方式**：通过自己注入自己的方式解决，尽管解决了问题，逻辑看起来很奇怪，它破坏了依赖注入的原则，虽然 spring 支持我们这样用，还是要注意下循环依赖的问题。
-   **手动获取代理对象**：使用Spring的AopContext.currentProxy()来获取当前类的代理对象，然后通过代理对象调用事务方法。



## 4、**抛出的是受检异常（异常类型不匹配）**

场景描述：Spring 的事务默认会回滚` RuntimeException` 及其子类，以及 `Error` 类型的异常。

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



## 5、**吞并异常（即异常被方法内部吞并，并未抛出）**

场景描述：当异常在方法内部被捕获并处理时，Spring 的事务管理器无法感知到异常的发生，因此不会触发事务回滚。这会导致预期的事务行为无法正常工作。

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



## 6、**事务拦截器配置错误**

场景描述：如果没有正确地配置事务拦截器，例如没有指定切入点或指定了错误的切入点，就会导致Spring事务失效。

例如：事务传播参数配置错误也会导致事务的不回滚。



##7、**事务超时配置错误**

场景描述：如果事务超时时间设置得太短，就有可能在事务执行过程中出现超时，从而导致Spring事务失效



## 8、**异步线程调用**

在spring中，事务和线程是绑定关系，一个线程绑定一个连接。如果在一个事务中使用了线程池或多线程（或异步线程）的方式去调用另一个被调用者的方法，此时此刻，事务的传播行为会失效，事务也会失效。

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

