# Bean的作用范围（域）和生命周期？:star:

## 口语化

**Bean 的作用范围**

Bean 的作用范围（域）主要有以下几种：

-   **singleton**：默认的作用域，整个应用中只有一个实例。
-   **prototype**：每次请求都会创建一个新的实例。
-   request：每个 HTTP 请求创建一个新的实例（仅限 Web 应用）。
-   session：每个 HTTP 会话创建一个新的实例（仅限 Web 应用）。
-   application：每个 ServletContext 创建一个新的实例（仅限 Web 应用）。
-   globalSession：用于 Portlet 应用中的全局会话（较少使用）。

常用的是 **singleton** 和 **prototype**。singleton 是单例的，当 Bean 是无状态的时候，singleton 是最好的选择。如果 Bean 涉及共享数据或有状态信息，singleton 可能不够安全，这时应该使用 prototype 来确保每个请求都有独立的实例。

**Bean 的生命周期**

Bean 的生命周期是指bean从创建到销毁的过程，总体上分为4大步，**实例化、属性赋值、初始化、销毁**：

-   1、**实例化**：Spring 容器根据配置创建 Bean 实例。
    -   通过反射去推断构造器进行实例化
    -   实例工厂、静态工厂
-   2、**属性设置**：为 Bean 设置属性值，包括依赖注入。
    -   解析自动装配（DI的体现）
    -   循环依赖（Spring底层已经处理了）
-   3、**初始化**：调用初始化方法（如果有），例如通过 **init-method** 属性指定的方法，或者实现 **InitializingBean** 接口的 **afterPropertiesSet** 方法。
    -   调用xxxAware相关接口回调
    -   调用初始化生命周期回调（三种）
    -   如果bean实现了AOP，还会创建动态代理
-   4、**可用**：Bean 已经完全初始化，可以被应用程序使用。
-   5、**销毁**：当容器关闭时，调用销毁方法（如果有），例如通过 **destroy-method** 属性指定的方法，或者实现 **DisposableBean** 接口的 **destroy** 方法。
    -   调用初始化生命周期回调



### Bean的作用范围（Scope）

**singleton**

-   在整个应用程序上下文中，只有一个Bean实例，所有对该Bean的引用都指向同一个实例
-   这个实例在容器启动时创建，并且在整个上下文生命周期中一直存在。
-   默认情况下，所有的Spring Beans都是单例的（**默认作用范围**）
-   适用于**无状态**的Bean。

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

**globalSession**

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

## Bean的生命周期（Lifecycle）

Bean的生命周期是指从Bean实例从被创建开始，直到它被销毁为止的整个过程。

Spring允许开发者通过不同的方法来控制这个过程

![](assets/Bean-Lifecycle.png)



1、**实例化（Instantiation）**

-   Spring通过**反射**机制创建Bean的实例，但此时还没有进行任何的依赖注入（属性设置）

>   补充：Bean通过构造器、静态工厂方法或者实例工厂方法被创建出来。

2、**属性设置|赋值（Property Population）**

-   在Bean实例化之后，Spring容器会设置Bean的属性值
-   会解析自动装配（DI的体现）。即 如果Bean有@Autowrited、@Value等注解设置的属性，这一步将进行相关依赖的注入
-   会处理循环依赖问题

3、**初始化（Initialization）**

**调用Aware接口的回调方法**

-   如果Bean实现了`BeanNameAware`、`BeanFactoryAware`、`ApplicationContextAware`等接口，Spring将回调这些接口的方法，把相关信息传递给Bean。

这里列举一下这些Aware接口：

1）BeanNameAware——invokeAwareMethods

2）BeanClassLoaderAware——setBeanClassLoader

3）BeanFactoryAware——setBeanFactory

**BeanPostProcess 前置处理**

-   在依赖注入和Aware回调之后，Spring容器会调用所有`BeanPostProcessor`的postProcessBeforeInitialization（前置处理方法），对Bean进行进一步的处理

Bean实例化并且其属性被设置后，可以调用**初始化方法**进行额外的设置。

-   初始化方法，也叫**生命周期回调**（如果有的话就调用）
    -   通过`@PostConstruct`注解指定的方法
    -   通过实现`InitializingBean`接口的`afterPropertiesSet()`方法
    -   通过`<bean>`标签的`init-method`属性来指定的方法 或 通过 `@Bean`注解的`initMethod`属性指定的方法

-   如果bean实现了AOP，还会创建动态代理

**BeanPostProcess 后置处理**

-   初始化完成以后，Spring容器会调用所有`BeanPostProcessor`的postProcessAfterInitialization（后置处理方法），对Bean进行进一步的处理

4、**Bean的使用（Usage）**

经过上述一系列的处理后，Bean处于就绪状态，可以被应用程序使用

5、**销毁（Destruction）**

-   当Spring容器关闭时
-   销毁方法，也叫**生命周期回调**（如果有的话就调用）
    -   通过`@PreDestroy`注解指定的方法
    -   通过实现`DisposableBean`接口的`destroy()`方法
    -   通过`<bean>`标签的`destroy-method`属性指定的销毁方法 或 通过 `@Bean`注解的`destoryMethod`属性指定的方法

**容器销毁**

-   最后，Spring容器关闭，Bean生命周期结束



## 生命周期回调接口和注解

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

todo ✅Spring中的Bean作用域有哪些？