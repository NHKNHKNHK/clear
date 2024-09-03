## Bean的作用范围和生命周期？

Bean的作用范围（Scope）和生命周期（Lifecycle）决定了Bean的创建、使用和销毁方式

### Bean的作用范围（Scope）

**singleton**

-   在整个应用程序上下文中，只有一个Bean实例，所有对该Bean的引用都指向同一个实例
-   这个实例在容器启动时创建，并且在整个上下文生命周期中一直存在。
-   默认情况下，所有的Spring Beans都是单例的（**默认作用范围**）
-   适用于无状态的Bean。

```xml
<bean id="myBean" class="com.example.MyBean" scope="singleton"/>
```

**prototype：**

-   每次请求该Bean时都会创建一个新的实例。这种模式适合那些需要为每个客户端请求创建新对象的情况。
-   适用于有状态的Bean。

```xml
<bean id="myBean" class="com.example.MyBean" scope="prototype"/>
```

**Request**

-   在Web环境中，为每一个HTTP**请求**创建一个新的Bean实例。
    -   仅适用于Web应用
-   这个Bean的生命周期与一个HTTP请求的生命周期相同。

```xml
<bean id="myBean" class="com.example.MyBean" scope="request"/>
```

**Session**

-   在Web环境中，为每一个用户**会话**创建一个新的Bean实例。
    -   仅适用于Web应用
-   这个Bean的生命周期与用户的会话生命周期相同。

```xml
<bean id="myBean" class="com.example.MyBean" scope="session"/>
```

**GlobalSession**

-   类似于Session作用域，每个全局HTTP会话都会创建一个新的实例
    -   但是用于portlet环境。
-   在portlet环境中，全局会话可以在portlet之间共享。

```xml
<bean id="myBean" class="com.example.MyBean" scope="globalSession"/>
```

**application**

-   每个ServletContext会创建一个新的实例，适用于Web应用

```xml
<bean id="myBean" class="com.example.MyBean" scope="application"/>
```

### Bean的生命周期（Lifecycle）

Bean的生命周期是指从Bean的实例被创建开始，直到它被销毁为止的整个过程。Spring允许开发者通过不同的方法来控制这个过程

![](./assets/bean-Lifecycle.png)



1、**实例化（Instantiation）**

-   Spring通过反射机制创建Bean的实例，但此时还没有进行任何的依赖注入（属性设置）

>   补充：Bean通过构造器、静态工厂方法或者实例工厂方法被创建出来。

2、**依赖注入（属性设置（Property Population））**

-   在Bean实例化之后，Spring容器会设置Bean的属性值，即依赖注入。
-   如果Bean有@Autowrited、@Value等注解设置的属性，这一步将进行相关依赖的注入

3、**调用Aware接口的回调方法**

-   如果Bean实现了`BeanNameAware`、`BeanFactoryAware`、`ApplicationContextAware`等接口，Spring将回调这些接口的方法，把相关信息传递给Bean。

4、**BeanPostProcess 前置处理**

-   在依赖注入和Aware回调之后，Spring容器会调用所有`BeanPostProcessor`的postProcessBeforeInitialization（前置处理方法），对Bean进行进一步的处理

5、**初始化（Initialization）**

-   Bean实例化并且其属性被设置后，可以调用初始化方法进行额外的设置。
-   初始化方法（如果有的话就调用）
    -   可以通过实现`InitializingBean`接口的`afterPropertiesSet()`方法
    -   或者通过`<bean>`标签的`init-method`属性来指定。
    -   再者说通过调用`@PostConstruct`注解指定的方法

6、**BeanPostProcess 后置处理**

-   初始化完成以后，Spring容器会调用所有`BeanPostProcessor`的postProcessAfterInitialization（后置处理方法），对Bean进行进一步的处理

7、**Bean的使用（Usage）**

经过上述一系列的处理后，Bean处于就绪状态，可以被应用程序使用

9、**销毁（Destruction）**

-   当Spring容器关闭时
-   初始化方法（如果有的话就调用）
    -   如果Bean实现了`DisposableBean`接口的`destroy()`方法，则会调用该方法来进行清理工作。
    -   或者通过`<bean>`标签的`destroy-method`属性指定了销毁方法，则会调用该方法来进行清理工作。
    -   再者说通过调用`@PreDestroy`注解指定的方法来进行清理工作。

10、**容器销毁**

-   最后，Spring容器关闭，Bean生命周期结束



### 生命周期回调接口和注解

如下是比较常用的生命周期回调接口

**InitializingBean接口**

方法：afterPropertiesSet()

```java
public class MyBean implements InitializingBean {
    @Override
    public void afterPropertiesSet() throws Exception {
        // 初始化逻辑
    }
}
```

**DisposableBean接口**

方法：destroy()

```java
public class MyBean implements DisposableBean {
    @Override
    public void destroy() throws Exception {
        // 销毁逻辑
    }
}
```

**@PostConstruct注解**

用于标注初始化方法。

```java
public class MyBean {
    @PostConstruct
    public void init() {
        // 初始化逻辑
    }
}
```

**@PreDestroy注解**

用于标注销毁方法。

```java
public class MyBean {
    @PreDestroy
    public void cleanup() {
        // 销毁逻辑
    }
}
```





## Spring循环依赖问题是什么？（什么是循环依赖？）:star:

Spring循环依赖问题是指在Spring容器中，两个或多个Bean之间存在直接的或间接的依赖关系，导致在创建和初始化这些Bean时形成了一个**闭环**，使得无法正确地创建和初始化这些Bean。

主要有两种形式：

-   **构造器循环依赖**：这种循环依赖发生在Bean之间的构造器相互引用

-   **setter 方式的循环依赖**：这种循环依赖发生在Bean实例化后进行依赖注入的过程中

构造器循环依赖主要是 Bean A的构造器需要Bean B作为参数，而Bean B的构造器又需要Bean A作为参数。由于构造器是在Bean实例化时调用的，所以Spring容器无法先创建其中一个Bean，因为这样会导致另一个Bean无法实例化，从而形成死循环。

setter 循环依赖发生在Bean的setter注入方法中。与构造器循环依赖不同，setter注入是在Bean实例化之后进行的。如果循环依赖关系复杂或配置不当，也可能导致Spring容器无法正确初始化Bean。

示例：

```java
@Service
public class A{
	@Autowired
    private B b;
}

@Service
public class B{
	@Autowired
    private A a;
}

// 或自己依赖于自己
@Service
public class A{
	@Autowired
    private A a;
}
```

为了解决循环依赖问题，Spring容器采用了**三级缓存机制来处理setter注入的循环依赖**。在Bean实例化过程中，Spring容器会将Bean的实例和ObjectFactory放入不同的缓存中，以便在后续的依赖注入过程中使用。如果Spring容器检测到循环依赖，它会从缓存中获取Bean的实例或ObjectFactory来完成注入，从而解决循环依赖问题。

然而，对于**构造器循环依赖**，**Spring容器无法通过缓存机制来解决**，因为它需要在Bean实例化之前注入依赖。因此，如果应用程序中存在构造器循环依赖，Spring容器将无法正确创建和初始化Bean，并抛出相应的异常。

为了避免循环依赖问题，最佳的做法是重新设计代码结构，确保Bean之间的依赖关系是单向的，并尽量减少Bean之间的直接依赖。这可以通过引入接口、使用依赖注入框架的特定功能（如@Autowired注解的按类型自动装配）、或者利用设计模式（如工厂模式、代理模式等）来实现。



## Spring如何解决循环依赖？

循环依赖问题的解决主要是靠**三级缓存机制**来解决的。

其中一级缓存用于存储完全初始化好的单例 Bean，二级缓存用于存储早期暴露的 Bean 实例，部分初始化的 Bean。三级缓存用于存储 Bean 工厂，主要用于创建 Bean 的代理对象。

假设现在有两个对象 A 依赖 B，B 依赖 A。那么在A创建过程中发现需要属性 B，查找发现 B 还没有在一级缓存中，于是先将 A 放到三级缓存中，此时的 A 不完整，没有属性，但是可以引用。接下来就去实例化B。B 开始创建，此时发现需要A，于是B先查一级缓存寻找A，如果没有，再查二级缓存，如果还没有，再查三级缓存，找到了A，然后把三级缓存里面的这个A放到二级缓存里面，并删除三级缓存里面的A。B顺利初始化完毕，将自己放到一级缓存里面（此时B里面的A依然是创建中的状态）。然后回来接着创建A，此时B已经创建结束，可以直接从一级缓存里面拿到B，这样 A 就完成了创建，并将A放到一级缓存



**循环依赖的两种情况**

1、构造器注入的循环依赖

Spring 无法直接解决通过构造器注入引起的循环依赖，因为在这种情况下，Spring 无法创建任何一个 Bean 实例而不先创建另一个 Bean 实例。这会导致一个无限循环。因此，通常建议避免在构造器注入中引入循环依赖。

```java
public class ClassA {
    private ClassB b;
    public ClassA() {
    }
    public ClassA(ClassB b) {
        this.b = b;
    }
}

public class ClassB {
    private ClassC c;
    public ClassB() {
    }
    public ClassB(ClassC c) {
        this.c = c;
    }
}

public class ClassC {
    private ClassA a;
    public ClassC() {
    }
    public ClassC(ClassA a) {
        this.a = a;
    }
}
```

```xml
<!--声明A-->
<bean id="a" class="com.clear.ClassA">
	<!--构造注入b依赖-->
	<constructor-arg name="b" ref="b"></constructor-arg>
</bean>
<!--声明B-->
<bean id="b" class="com.clear.ClassB">
    <!--构造注入c依赖-->
    <constructor-arg name="c" ref="c"></constructor-arg>
</bean>
<!--声明C-->	
<bean id="c" class="com.clear.ClassC">
    <!--构造注入a依赖-->
    <constructor-arg name="a" ref="a"></constructor-arg>
</bean>
```

2、Setter 注入的循环依赖

对于通过 setter 方法注入引起的循环依赖，Spring 采用三级缓存机制来解决问题

**三级缓存机制**

-   1、**一级缓存（singletonObjects）**：用于存储完全初始化好的单例 Bean。类型：Map<String, Object>

-   2、**二级缓存（earlySingletonObjects）**：用于存储早期暴露的 Bean 实例，部分初始化的 Bean。Map<String, Object>

-   3、**三级缓存（singletonFactories）**：用于存储 Bean 工厂，主要用于创建 Bean 的代理对象。Map<String, ObjectFactory<?>>

**解决循环依赖的过程**

我们拿 A 依赖 B，B 依赖 A 来进行举例

1、在创建 A 对象放入到 spring 容器的过程，先看一级缓存，能否可以直接获取到 A，如果可以，直接获取，如果不可以，则开始创建 A 对象，A创建过程中发现需要属性 B，查找发现 B 还没有在一级缓存中，于是先将 A 放到三级缓存中，此时的 A 不完整，没有属性，但是可以引用。接下来就去实例化B。

2、B 实例化的过程，也是先从一级缓存，看自己有没有，没有的话，开始创建，此时发现需要A，于是B先查一级缓存寻找A，如果没有，再查二级缓存，如果还没有，再查三级缓存，找到了A，然后把三级缓存里面的这个A放到二级缓存里面，并删除三级缓存里面的A。

3、B顺利初始化完毕，将自己放到一级缓存里面（此时B里面的A依然是创建中的状态）。然后回来接着创建A，此时B已经创建结束，可以直接从一级缓存里面拿到B，去完成A的创建，并将A放到一级缓存。

#### 假设我们没有三级缓存，只有一级缓存，那么我们会怎样进行处理呢？

首先A对象进行实例化，A要进行属性填充B。但是B还没有创建，于是开始B进行实例化，同样的B也要进行属性填充，发现他需要A。然而我们的一级缓存的Map里面还没有A，所以他有创建A，于是就产生了死循环。循环往复，最后栈溢出。那么小伙伴们会问，我的A我不进行属性填充，我直接扔一级缓存里面，那不就可以了吗？这样就会造成map里面存的A是个假A，缺胳膊少腿，当你真正用到他的时候，啪一个空指针异常。而且我们的一级缓存规定是完全初始化好的bean。给我们的程序进行使用。那么大家这会都理解了，一级缓存行不通

#### 二级缓存解决了什么问题？

首先我们还是实例化A开始，注意这个地方，我们实例化后，还没有进行属性填充的时候，就把A对象的引用放入到了map2备用。然后进行属性填充，A去填充B，发现B没有实例化，于是B同样实例化后，把自己的半成品放入到map2。B开始进行填充，发现Map1中没有A，又去Map2中进行寻找，发现map2里面有。于是B直接拿到map2中的A使自己变得非常完整。这个时候B就把自己放入Map1。并把Map2的半成品删除了。回到刚才A的阶段，A发现Map1中已经有B了。那么A也就完成了属性的创建。于是双方都完成了自己的创建。这就是二级缓存解决的问题。

#### 不需要三级缓存可以吗？

主要是因为Spring的Aop机制所产生的代理对象问题。首先要了解一个前置就是Spring的代理对象产生阶段是在填充属性后才进行的，原理通过后置处理器BeanPostProcessor来实现。如果说我们用二级缓存来解决，那么就要在属性填充的时候，将代理对象生成好，放入二级缓存。那么就与我们spring的对象生命周期相悖。所以这种方式不好，于是我们引入了三级缓存



## 为什么Spring循环依赖需要三级缓存，二级不够吗？



## 看过源码吗？说说Spring由哪些重要的模块组成？



## Spring的优点？



## 什么是SpringIOC？



## SpringIOC容器初始化过程？



## SpringIOC有什么好处？



## Spring中的DI是什么？



## Spring中的BeanFactory是什么？



## Spring中的FactoryBean是什么？



## Spring中的ObjectFactory是什么？



## Spring中的ApplicationContext是什么？



## Spring Bean一共有几种作用域？



## Spring一共有几种注入方式？



## 什么是AOP？



## Spring AOP相关术语有哪些？



## Spring AOP默认用的是什么代理？两者区别？



## 简述Spring拦截链的实现？



## Spring AOP和AspectJ有什么区别？



## Spring Bean的生命周期？



## Spring都用到哪些设计模式？



## Spring事务有几个隔离级别？





## Spring有哪几种事务传播行为？



## Spring事务传播行为有什么用？



## Spring事务在哪几种情况下会失效？（事务失效场景）

在Spring中我们可以通过编程式或声明式或使用@Transactional注解来实现是事务。

编程式事务的开启、提交、回滚都由我们手动控制，不在这个问题的考虑范围内

对于声明式或使用@Transactional注解来实现是事务，都是Spring给我们提供的一个环绕通知，通过AOP生成代理类才实现的事务，其事务的开启、提交、回滚由代理类负责。

>   重点就在于这个代理，在spring中，会通过cglib为目标类生成一个代理对象

因此，Spring事务失效的场景主要有以下几种

1、**非public方法使用@Transactional**

场景描述：Spring事务管理是基于AOP实现的，而AOP对于JDK动态代理或CGLib动态代理**只会代理public方法**。如果事务方法的访问修饰符为非public，SpringAOP无法正确地代理该方法，从而导致事务失效。

示例代码：事务方法的访问修饰符被设置为private、default或protected。

解决方案：将需要事务管理的方法设置为public。

2、**被final、static这样的关键字修饰**

和上边的原因类似，被用 `final` 、`static` 修饰的方法上加 @Transactional 也不会生效。

-   static 静态方法属于类本身的而非实例，因此代理机制是无法对静态方法进行代理或拦截的
-   final 修饰的方法不能被子类重写，事务相关的逻辑无法插入到 final 方法中，代理机制无法对 final 方法进行拦截或增强。

这些都是java基础概念了，使用时要注意。

```java
// 反例
@Transactional
public static void b() {
}

@Transactional
public final void b() {
}
```

3、**在同类中的非事务方法调用事务方法（同类内部方法调用问题）**

>   重点在于：确保调用的方法是代理对象的方法，而非原始对象的方法。

场景描述：Spring的事务管理是通过动态代理实现的，只有通过代理对象调用的方法才能享受到Spring的事务管理。如果在同一个类中，一个没有标记为@Transactional的方法内部调用了一个标记为@Transactional的方法，那么事务是不会起作用的。

**注意了**，这种情况经常发生啊！

同类内部方法间的调用是 @Transactional 注解失效的重灾区，网上你总能看到方法内部调用另一个同类的方法时，**这种调用是不会经过代理的**，因此事务管理不会生效。但这说法比较片面，要分具体情况。

比如：testMerge() 方法开启事务，调用同类非事务的方法 a() 和 b() ，此时 b() 抛异常，根据事务的传播性 a()、b() 事务均生效。

```java
@Transactional
public String testMerge() {

    a();

    b();

    return "ok";
}

public void a() {
    standardBakService.save(testAService.buildEntity());
}

public void b() {
    standardBak2Service.save(testBService.buildEntity2());
    throw new RuntimeException("b error");
}
```

如果 testMerge() 方法未开启事务，并且在同类中调用了非事务方法 a() 和事务方法 b()，当 b() 抛出异常时，a() 和 b() 的事务都不会生效。因为这种调用直接通过 `this` 对象进行，未经过代理，因此事务管理无法生效。这经常出问题的！

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

4、**异常类型不匹配**

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

5、**事务拦截器配置错误**

场景描述：如果没有正确地配置事务拦截器，例如没有指定切入点或指定了错误的切入点，就会导致Spring事务失效。

6、**事务超时配置错误**

场景描述：如果事务超时时间设置得太短，就有可能在事务执行过程中出现超时，从而导致Spring事务失效

7、**异步线程调用**

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



## Spring通知类型有哪些？



## Spring Bean注册到容器有哪些方式？



## Spring自动装配的方式有哪些？



## @PropertySource注解的作用？



## @Qualifier注解有什么用？



## @ComponentScan注解的作用？



## @Bean和@Component有什么区别？



## @Component、@Controller、@Repository和@Service的区别？



## 说说Spring启动过程？



## Spring单例Bean使用有并发安全问题？



## Spring Bean如何保证并发安全问题？





## @Transactional 注解失效场景

@Transactional 注解虽然用起来简单，但这货总是能在一些你意想不到的情况下失效，防不胜防！

我把这些事务问题归结成了三类：`不必要`、`不生效`、`不回滚`，接下用一些demo演示下各自的场景。

### 不必要

1、**无需事务的业务**

在没有事务操作的业务方法上使用 @Transactional 注解，比如：用在仅有查询或者一些 HTTP 请求的方法，虽然加上影响不大，但从编码规范的角度来看还是不够严谨，建议去掉。

```java
// 反例：查询不需要事务
@Transactional
public String testQuery() {
    standardBak2Service.getById(1L);
    return "testB";
}
```

2、 **事务范围过大**

为了省事直接将 @Transactional 注解加在了类上或者抽象类上，这样做导致的问题就是**类内的方法或抽象类的实现类中所有方法全部都被事务管理**。增加了不必要的性能开销或复杂性，建议按需使用，只在有事务逻辑的方法上加@Transactional

```java
// 反例
@Transactional
public abstract class BaseService {
}

@Slf4j
@Service
public class TestMergeService extends BaseService{

    private final TestAService testAService;

    public String testMerge() {

        testAService.testA();

        return "ok";
    }
}
```

如果在类中的方法上添加 @Transactional 注解，它将覆盖类级别的事务配置。例如，类级别上配置了只读事务，方法级别上的 @Transactional 注解也会覆盖该配置，从而启用读写事务。

```java
@Transactional(readOnly = true)
public class TestMergeService {

    private final TestBService testBService;

    private final TestAService testAService;

    @Transactional
    public String testMerge() {

        testAService.testA();

        testBService.testB();
        return "ok";
    }
}    
```

### 不生效

3、**方法权限问题**

**不要把 @Transactional注解加在 private 级别的方法上！**

我们知道 @Transactional 注解依赖于Spring AOP切面来增强事务行为，这个 AOP 是通过代理来实现的，而 private 方法恰恰不能被代理的，所以 AOP 对 private 方法的增强是无效的，@Transactional也就不会生效

```java
@Transactional
private String testMerge() {

    testAService.testA();

    testBService.testB();

    return "ok";
}
```

那如果我在 testMerge() 方法内调用 private 的方法事务会生效吗？

答案：事务会生效

```java
@Transactional
public String testMerge() throws Exception {

    ccc();
    
    return "ok";
}

private void ccc() {
    testAService.testA();

    testBService.testB();
}
```

4、**被用 final 、static 修饰方法**

和上边的原因类似，被用 `final` 、`static` 修饰的方法上加 @Transactional 也不会生效。

-   static 静态方法属于类本身的而非实例，因此代理机制是无法对静态方法进行代理或拦截的
-   final 修饰的方法不能被子类重写，事务相关的逻辑无法插入到 final 方法中，代理机制无法对 final 方法进行拦截或增强。

这些都是java基础概念了，使用时要注意。

```java
// 反例
@Transactional
public static void b() {
}

@Transactional
public final void b() {
}
```

5、**同类内部方法调用问题**

**注意了**，这种情况经常发生啊！

同类内部方法间的调用是 @Transactional 注解失效的重灾区，网上你总能看到方法内部调用另一个同类的方法时，**这种调用是不会经过代理的**，因此事务管理不会生效。但这说法比较片面，要分具体情况。

比如：testMerge() 方法开启事务，调用同类非事务的方法 a() 和 b() ，此时 b() 抛异常，根据事务的传播性 a()、b() 事务均生效。

```java
@Transactional
public String testMerge() {

    a();

    b();

    return "ok";
}

public void a() {
    standardBakService.save(testAService.buildEntity());
}

public void b() {
    standardBak2Service.save(testBService.buildEntity2());
    throw new RuntimeException("b error");
}
```

如果 testMerge() 方法未开启事务，并且在同类中调用了非事务方法 a() 和事务方法 b()，当 b() 抛出异常时，a() 和 b() 的事务都不会生效。因为这种调用直接通过 `this` 对象进行，未经过代理，因此事务管理无法生效。这经常出问题的！

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

5.1、**独立的 Service 类**

要想 b() 方法的事务生效也容易，最简单的方法将它剥离放在独立的Service类注入使用，交给spring管理就行了。不过，这种方式会创建很多类。

```java
@Slf4j
@Service
public class TestBService {

      @Transactional
      public void b() {
          standardBak2Service.save(testBService.buildEntity2());
          throw new RuntimeException("b error");
      }
}
```

5.2、**自注入方式**

或者通过自己注入自己的方式解决，尽管解决了问题，逻辑看起来很奇怪，它破坏了依赖注入的原则，虽然 spring 支持我们这样用，还是要注意下循环依赖的问题。

```java
@Slf4j
@Service
public class TestMergeService {
      @Autowired
      private TestMergeService testMergeService;

      public String testMerge() {

          a();

          testMergeService.b();

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
}
```

5.3、**手动获取代理对象**

b() 方法它不是没被代理嘛，那我们手动获取代理对象调用 b() 方法也可以。通过 `AopContext.currentProxy()` 方法返回当前的代理对象实例，这样调用代理的方法时，就会经过 AOP 的切面，@Transactional注解就会生效了。

```java
@Slf4j
@Service
public class TestMergeService {

      public String testMerge() {

          a();

         ((TestMergeService) AopContext.currentProxy()).b();

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
}
```

6、**Bean 未被 spring 管理**

上边我们知道 @Transactional 注解通过 AOP 来管理事务，而 AOP 依赖于代理机制。因此，**Bean 必须由Spring管理实例！** 要确保为类加上如 `@Controller`、`@Service` 或 `@Component`注解，让其被Spring所管理，这很容易忽视。

```java
@Service
public class TestBService {

    @Transactional
    public String testB() {
        standardBak2Service.save(entity2);
        return "testB";
    }
}
```

7、**异步线程调用**

如果我们在 testMerge() 方法中使用异步线程执行事务操作，通常也是无法成功回滚的，来个具体的例子。

testMerge() 方法在事务中调用了 testA()，testA() 方法中开启了事务。接着，在 testMerge() 方法中，我们通过一个新线程调用了 testB()，testB() 中也开启了事务，并且在 testB() 中抛出了异常。

此时的回滚情况是怎样的呢？

```java
@Transactional
public String testMerge() {

    testAService.testA();

    new Thread(() -> {
        try {
            testBService.testB();
        } catch (Exception e) {
//                e.printStackTrace();
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

8、**不支持事务的引擎**

不支持事务的数据库引擎不在此次 `Review` 范围内，只做了解就好。我们通常使用的关系型数据库，如 MySQL，默认使用支持事务的 `InnoDB` 引擎，而非事务的 `MyISAM` 引擎则使用较少。

以前开启启用 MyISAM 引擎是为了提高查询效率。不过，现在非关系型数据库如 `Redis`、`MongoDB` 和 `Elasticsearch` 等中间件提供了更高性价比的解决方案

### 不回滚

9、 **用错传播属性**

`@Transactional`注解有个关键的参数`propagation`，它控制着事务的传播行为，有时事务传播参数配置错误也会导致事务的不回滚。

propagation 支持 7 种事务传播特性：

-   `REQUIRED`：**默认的传播行为**，如果当前没有事务，则创建一个新事务；如果存在事务，则加入当前事务。
-   `MANDATORY`：支持当前事务，如果不存在则抛出异常
-   `NEVER`：非事务性执行，如果存在事务，则抛出异常
-   `REQUIRES_NEW`：无论当前是否存在事务，都会创建一个新事务，原有事务被挂起。
-   `NESTED`：嵌套事务，被调用方法在一个嵌套的事务中运行，这个事务依赖于当前的事务。
-   `SUPPORTS`：如果当前存在事务，则加入；如果没有，就以非事务方式执行。
-   `NOT_SUPPORTED`：以非事务方式执行，如果当前存在事务，将其挂起。

为了加深印象，我用案例来模拟下每种特性的使用场景。

**REQUIRED**

REQUIRED 是默认的事务传播行为。如果 testMerge() 方法开启了事务，那么其内部调用的 testA() 和 testB() 方法也将加入这个事务。如果 testMerge() 没有开启事务，而 testA() 和 testB() 方法上使用了 @Transactional 注解，这些方法将各自创建新的事务，只控制自身的回滚。

```java
@Component
@RequiredArgsConstructor
@Slf4j
@Service
public class TestMergeService {

    private final TestBService testBService;

    private final TestAService testAService;

    @Transactional
    public String testMerge() {

        testAService.testA();

        testBService.testB();

        return "ok";
    }
}

@Transactional
public String testA() {
    log.info("testA");
    DeepzeroStandardBak entity = buildEntity();
    standardBakService.save(entity);
    return "ok";
}

@Transactional
public String testB() {
    log.info("testB");
    DeepzeroStandardBak2 entity2 = buildEntity2();
    standardBak2Service.save(entity2);
    throw new RuntimeException("testB");
}
```

**MANDATORY**

MANDATORY 传播特性简单来说就是只能被开启事务的上层方法调用，例如 testMerge() 方法未开启事务调用 testB() 方法，那么将抛出异常；testMerge() 开启事务调用 testB() 方法，则加入当前事务。

```java
@Component
@RequiredArgsConstructor
@Slf4j
@Service
public class TestMergeService {

    private final TestBService testBService;

    private final TestAService testAService;

    public String testMerge() {

        testAService.testA();

        testBService.testB();

        return "ok";
    }
}

@Transactional
public String testA() {
    log.info("testA");
    DeepzeroStandardBak entity = buildEntity();
    standardBakService.save(entity);
    return "ok";
}

@Transactional(propagation = Propagation.MANDATORY)
public String testB() {
    log.info("testB");
    DeepzeroStandardBak2 entity2 = buildEntity2();
    standardBak2Service.save(entity2);
    throw new RuntimeException("testB");
}
```

抛出的异常信息

>   org.springframework.transaction.IllegalTransactionStateException: No existing transaction found for transaction marked with propagation 'mandatory'

**NEVER**

NEVER 传播特性是强制你的方法只能以非事务方式运行，如果方法存在事务操作会抛出异常，我实在是没想到有什么使用场景。

```java
@Transactional(propagation = Propagation.NEVER)
public String testB() {
    log.info("testB");
    DeepzeroStandardBak2 entity2 = buildEntity2();
    standardBak2Service.save(entity2);
//        throw new RuntimeException("testB");
    return "ok";
}
```

抛出的异常信息

>   org.springframework.transaction.IllegalTransactionStateException: Existing transaction found for transaction marked with propagation 'never'

**REQUIRES_NEW**

我们在使用 Propagation.REQUIRES_NEW 传播特性时，不论当前事务的状态如何，调用该方法都会创建一个新的事务。

例如，testMerge() 方法开始一个事务，调用 testB() 方法时，它会暂停 testMerge() 的事务，并启动一个新的事务。如果 testB() 方法内部发生异常，新事务会回滚，但原先挂起的事务不会受影响。这意味着，挂起的事务不会因为新事务的回滚而受到影响，也不会因为新事务的失败而回滚。

```java
@Transactional
public String testMerge() {

    testAService.testA();

    testBService.testB();

    return "ok";
}

@Transactional
public String testA() {
    log.info("testA");
    DeepzeroStandardBak entity = buildEntity();
    standardBakService.save(entity);
    return "ok";
}

@Transactional(propagation = Propagation.REQUIRES_NEW)
public String testB() {
    log.info("testB");
    DeepzeroStandardBak2 entity2 = buildEntity2();
    standardBak2Service.save(entity2);
    throw new RuntimeException("testB");
}
```

**NESTED**

方法的传播行为设置为 NESTED，其内部方法会开启一个新的嵌套事务（子事务）。在没有外部事务的情况下 `NESTED` 与 `REQUIRED` 效果相同；存在外部事务的情况下，一旦外部事务回滚，它会创建一个嵌套事务（子事务）。

也就是说外部事务回滚时，子事务会跟着回滚；但子事务的回滚不会对外部事务和其他同级事务造成影响

```java
@Component
@RequiredArgsConstructor
@Slf4j
@Service
public class TestMergeService {

    private final TestBService testBService;

    private final TestAService testAService;

    @Transactional
    public String testMerge() {

        testAService.testA();

        testBService.testB();

        throw new RuntimeException("testMerge");
        return "ok";
    }
}

@Transactional
public String testA() {
    log.info("testA");
    DeepzeroStandardBak entity = buildEntity();
    standardBakService.save(entity);
    return "ok";
}

@Transactional(propagation = Propagation.NESTED)
public String testB() {
    log.info("testB");
    DeepzeroStandardBak2 entity2 = buildEntity2();
    standardBak2Service.save(entity2);
    throw new RuntimeException("testB");
}
```

**NOT_SUPPORTED**

`NOT_SUPPORTED` 事务传播特性表示该方法必须以非事务方式运行。当方法 testMerge() 开启事务并调用事务方法 testA() 和 testB() 时，如果 testA() 和 testB() 的事务传播特性为 NOT_SUPPORTED，那么 testB() 将以非事务方式运行，并挂起当前的事务。

默认传播特性的情况下 testB() 异常事务加入会导致 testA() 回滚，而挂起的意思是说，testB() 其内部一旦抛出异常，不会影响 testMerge() 中其他 testA() 方法的回滚。

```java
@Component
@RequiredArgsConstructor
@Slf4j
@Service
public class TestMergeService {

    private final TestBService testBService;

    private final TestAService testAService;

    @Transactional
    public String testMerge() {

        testAService.testA();

        testBService.testB();

        return "ok";
    }
}

@Transactional
public String testA() {
    log.info("testA");
    DeepzeroStandardBak entity = buildEntity();
    standardBakService.save(entity);
    return "ok";
}

@Transactional(propagation = Propagation.NOT_SUPPORTED)
public String testB() {
    log.info("testB");
    DeepzeroStandardBak2 entity2 = buildEntity2();
    standardBak2Service.save(entity2);
    throw new RuntimeException("testB");
}
```

**SUPPORTS**

如果当前方法的事务传播特性是 `SUPPORTS`，那么只有在调用该方法的上层方法开启了事务的情况下，该方法的事务才会有效。如果上层方法没有开启事务，那么该方法的事务特性将无效。

例如，如果入口方法 testMerge() 没有开启事务，而 testMerge() 调用的方法 testA() 和 testB() 的事务传播特性为 SUPPORTS，那么由于 testMerge() 没有事务，testA() 和 testB() 将以非事务方式执行。即使在这些方法上加上 `@Transactional` 注解，也不会回滚异常。

```java
@Component
@RequiredArgsConstructor
@Slf4j
@Service
public class TestMergeService {

    private final TestBService testBService;

    private final TestAService testAService;

    public String testMerge() {

        testAService.testA();

        testBService.testB();

        return "ok";
    }
}

@Transactional(propagation = Propagation.SUPPORTS)
public String testA() {
    log.info("testA");
    DeepzeroStandardBak entity = buildEntity();
    standardBakService.save(entity);
    return "ok";
}

@Transactional(propagation = Propagation.SUPPORTS)
public String testB() {
    log.info("testB");
    DeepzeroStandardBak2 entity2 = buildEntity2();
    standardBak2Service.save(entity2);
    throw new RuntimeException("testB");
}
```

10、**自己吞了异常**

在整个 review 的过程中我发现导致事务不回滚的场景，多数是开发同学在业务代码中手动 try...catch 捕获了异常，然后又没抛出异常....

比如：testMerge() 方法开启了事务，并调用了非事务方法 testA() 和 testB()，同时在 testMerge() 中捕获了异常。如果 testB() 中发生了异常并抛出，但 testMerge() 捕获了这个异常而没有继续抛出，Spring 事务将无法捕获到异常，从而无法进行回滚。

```java
@RequiredArgsConstructor
@Slf4j
@Service
public class TestMergeService {

    private final TestBService testBService;

    private final TestAService testAService;
    @Transactional
    public String testMerge() {

        try {
            testAService.testA();

            testBService.testB();

        } catch (Exception e) {
            log.error("testMerge error:{}", e);
        }
        return "ok";
    }
}

@Service
public class TestAService {

    public String testA() {
        standardBakService.save(entity);
        return "ok";
    }
}

@Service
public class TestBService {

    public String testB() {
        standardBakService.save(entity2);
        
        throw new RuntimeException("test2");
    }
}
```

为了确保 Spring 事务能够正常回滚，需要我们在 catch 块中主动重新抛出它能够处理的 RuntimeException 或者 Error 类型的异常。

```java
@Transactional
public String testMerge() {

    try {
        testAService.testA();

        testBService.testB();

    } catch (Exception e) {
        log.error("testMerge error:{}", e);
        throw new RuntimeException(e);
    }
    return "ok";
}
```

**捕获异常并不意味着一定不会回滚**，这取决于具体情况。

例如，当 testB() 方法上也加上了 @Transactional 注解时，如果在该方法中发生异常，事务会捕获到这个异常。由于事务传播的特性，testB() 的事务会合并到上层方法的事务中。因此，即使在 testMerge() 中捕获了异常而未抛出，事务仍然可以成功回滚。

```java
@Transactional
public String testB() {

    DeepzeroStandardBak2 entity2 = buildEntity2();

    dataImportJob2Service.save(entity2);

    throw new RuntimeException("test2");
    // return "ok";
}
```

>   但这有个提前，必须在 testMerge() 方法上添加 @Transactional 注解以启用事务。如果 testMerge() 方法没有开启事务，不论其内部是否使用 try 块，都只能部分回滚 testB()，而 testA() 将无法回滚。

11、**事务无法捕获的异常**

Spring 的事务默认会回滚` RuntimeException` 及其子类，以及 `Error` 类型的异常。

如果抛出的是其他类型的异常，例如 `checked exceptions`（检查型异常），即继承自 Exception 但不继承自 RuntimeException 的异常，比如 `SQLException`、`DuplicateKeyException`，事务将不会回滚。

所以，我们在主动抛出异常时，要确保该异常是事务能够捕获的类型。

```java
@Transactional
public String testMerge() throws Exception {
    try {
        testAService.testA();

        testBService.testB();
    } catch (Exception e) {
        log.error("testMerge error:{}", e);
//            throw new RuntimeException(e);
        throw new Exception(e);
    }
    return "ok";
}
```

如果你非要抛出默认情况下不会导致事务回滚的异常，务必要在 `@Transactional` 注解的 `rollbackFor` 参数中明确指定该异常，这样才能进行回滚。

```java
@Transactional(rollbackFor = Exception.class)
public String testMerge() throws Exception {
    try {
        testAService.testA();

        testBService.testB();
    } catch (Exception e) {
        log.error("testMerge error:{}", e);
//            throw new RuntimeException(e);
        throw new Exception(e);
    }
    return "ok";
}
```

问问你身边的同学，哪些异常属于运行时异常，哪些属于检查型异常，十有八九他们可能无法给出准确的回答！

所以减少出现 bug 的风险，我建议使用 @Transactional 注解时，将 rollbackFor 参数设置为 `Exception` 或 `Throwable`，这样可以扩大事务回滚的范围。

12、**自定义异常范围问题**

针对不同业务定制异常类型是比较常见的做法，@Transactional 注解的 rollbackFor 参数支持自定义的异常，但我们往往习惯于将这些自定义异常继承自 RuntimeException。

那么这就出现和上边同样的问题，事务的范围不足，许多异常类型仍然无法触发事务回滚。

```java
@Transactional(rollbackFor = CustomException.class)
public String testMerge() throws Exception {
    try {
        testAService.testA();

        testBService.testB();
    } catch (Exception e) {
        log.error("testMerge error:{}", e);
//            throw new RuntimeException(e);
        throw new Exception(e);
    }
    return "ok";
}
```

想要解决这个问题，可以在 catch 中主动抛出我们自定义的异常。

```java
@Transactional(rollbackFor = CustomException.class)
public String testMerge() throws Exception {
    try {
        testAService.testA();

        testBService.testB();
    } catch (Exception e) {
        log.error("testMerge error:{}", e);
        throw new CustomException(e);
    }
    return "ok";
}
```

13、**嵌套事务问题**

还有一种场景就是嵌套事务问题，比如，我们在 testMerge() 方法中调用了事务方法 testA() 和事务方法 testB()，此时不希望 testB() 抛出异常让整个 testMerge() 都跟着回滚；这就需要单独 try catch 处理 testB() 的异常，不让异常在向上抛。

```java
@RequiredArgsConstructor
@Slf4j
@Service
public class TestMergeService {

    private final TestBService testBService;

    private final TestAService testAService;
    @Transactional
    public String testMerge() {
    
        testAService.testA();

        try {
            testBService.testB();
        } catch (Exception e) {
            log.error("testMerge error:{}", e);
        }
        return "ok";
    }
}

@Service
public class TestAService {

    @Transactional
    public String testA() {
        standardBakService.save(entity);
        return "ok";
    }
}

@Service
public class TestBService {

    @Transactional
    public String testB() {
        standardBakService.save(entity2);
        
        throw new RuntimeException("test2");
    }
}
```



# 注解篇



## @Component与@Bean的区别？

**用途不同**

-   @Component是一个通用组件，可用于普通的Java类，业务逻辑组件，持久化对象等

-   @Bean通常用于配置类上的方法上面，表示将该方法的返回对象注册到SpringIOC容器中

**使用方式不同**

-   @Component是一个类级别的注解，Spring通过@ComponentScan注解扫描@Component注解修饰的类，并将该类的实例对象到注册到SpringIOC容器中

-   @Bean用于配置类在的方法上面，用于在配置类中声明和配置Bean

**控制权不同**

-   @Component修饰的类是由Spring框架来创建和初始化的

-   @Bean允许开发者自定义Bean的创建和配置过程，包括指定Bean的名称、作用域、依赖关系等
    -   所以Bean注解更加的灵活



## @Autowrited注解的作用？它与@Resource的区别？



## @Scope注解的作用？



## @Primary注解的作用？



## @Value注解的作用？







## @Profile注解的作用？



## @PostConstruct和@PreDestory注解的作用？



## @ExceptionHandler注解的作用？





## @ResponseStatus注解的作用？







## @Validated和@Valid注解的作用？





## @Scheduled注解的作用？





## @Cacheable和@CacheEvict注解的作用？



## @Conditional注解的作用？



## @Lazy注解的作用？



## @PropertySource注解的作用？



## @EventListener注解的作用？



## Spring和SpringMVC的关系？



## Spring中的JPA和Hibernate有什么区别？