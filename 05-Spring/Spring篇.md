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



## Spring事务在哪几种情况下会失效？为什么？



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