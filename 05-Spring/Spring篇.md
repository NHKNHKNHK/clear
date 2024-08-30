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





## 什么是循环依赖？:star:



## Spring如何解决循环依赖？



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