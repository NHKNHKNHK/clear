# Spring都用到哪些设计模式？

## 口语化

Spring 框架广泛使用了多种设计模式来实现其功能和特性，这些设计模式不仅提高了代码的可维护性和扩展性，还简化了开发人员

单例模式——Bean实例

简单工厂——BeanFactory、ApplicationContext

工厂方法——FactoryBean

代理模式——AOP底层

责任链模式——AOP的方法调用

模板方法模式——Spring几乎所有的外层扩展都采用了这种模式，如JdbcTemplate

适配器模式——Spring MVC的HanderApatper

装饰器模式——BeanWrapper

观察者模式——Spring的事件机制

策略模式——excludeFilters、includeFilters

依赖注入模式——（这不属于经典23种设计模式）



## **单例模式（Singleton Pattern）**

-   描述：确保一个类只有一个实例，并提供一个全局访问点。
-   应用：Spring 容器中的 Bean 默认是单例的。每个 Bean 在整个应用程序中只有一个实例，除非显式配置为其他作用域（如原型、会话等）。

## **简单工厂（Simple Factory）**

一般情况下，工厂模式分为三种更加细分的类型：简单工厂、工厂方法和抽象工厂。

在 GoF 的《设计模式》一书中，**它将简单工厂模式看作是工厂方法模式的一种特例**，所以工厂模式只被分成了工厂方法和抽象工厂两类。

简单工厂又叫作**静态工厂方法模式**（Static Factory Method Pattern）

-   应用：
    -   BeanFactory 和 ApplicationContext 是 Spring 的核心接口，用于创建和管理 Bean 实例。

```java
beanFactory.getBean("userService");
```

## **工厂方法（Factory Method）**

-   应用：FactoryBean 

FactoryBean 接口允许自定义 Bean 的创建逻辑。FactoryBean提供了三个方法，其中getObject就是一个典型的工厂方法，FactoryBean定制bean的创建过程，我们将FactoryBean（一种特殊的bean）注入容器，由容器统一管理工厂对象，再有工厂对象创建具体的bean

```java
public interface FactoryBean<T> {

	@Nullable
	T getObject() throws Exception;

	Class<?> getObjectType();

	default boolean isSingleton() {
		return true;
	}
}
```

## **代理模式（Proxy Pattern）**

-   描述：通过代理对象控制对目标对象的访问。
-   应用：
    -   **AOP**（面向切面编程） 使用代理模式来拦截方法调用并添加额外的行为（如事务管理、日志记录等）。
    -   CGLIB 和 JDK 动态代理 是 Spring AOP 的两种实现方式。

```java
@Aspect
public class LoggingAspect {
    @Before("execution(* com.example.service.*.*(..))")
    public void logBeforeMethod(JoinPoint joinPoint) {
        System.out.println("Executing method: " + joinPoint.getSignature().getName());
    }
}
```

## **责任链模式（Chain of Responsibility Pattern）**

-   描述：多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合。
-   应用：
    -   **Interceptor（拦截器）** 和 Filter 链在 Spring MVC 和 Web 应用中用于处理请求前后的各种操作（如权限验证、日志记录等）。

**模板方法模式（Template Method Pattern）**

-   描述：定义一个操作中的算法骨架，而将一些步骤延迟到子类中实现。
-   应用：
    -   **JdbcTemplate、JmsTemplate** 等模板类封装了底层资源的访问细节，提供了统一的操作接口，开发者只需实现具体的业务逻辑。

>   补充：Spring 提供了很多 Template 类，比如，RedisTemplate、RestTemplate。尽管都叫作 xxxTemplate，但它们**并非基于模板模式来实现的**，而是**基于回调**来实现的，确切地说应该是同步回调。而**同步回调从应用场景上很像模板模式**，所以，在命名上，这些类使用 Template（模板）这个单词作为后缀

## **适配器模式（Adapter Pattern）**

-   描述：将一个类的接口转换成客户希望的另一个接口。
-   应用：
    -   **ViewResolver** 和 **HandlerAdapter** 是 Spring MVC 中的适配器模式应用，用于处理不同类型的视图和请求处理器。

## **装饰器模式（Decorator Pattern）**

-   描述：动态地给一个对象添加一些额外的职责。
-   应用：
    -   BeanPostProcessor 和 BeanFactoryPostProcessor 允许在 Bean 创建前后对其进行装饰或修改。
    -   BeanWrapper
    -   AOP 切面 可以看作是对目标对象的装饰，添加额外的行为而不改变其原有结构

## **观察者模式（Observer Pattern）**——Spring的事件机制

-   描述：定义了一种一对多的依赖关系，当一个对象状态改变时，所有依赖于它的对象都会得到通知并自动更新。
-   应用：
    -   事件驱动模型：Spring 提供了 **ApplicationEvent** 和 **ApplicationListener** 来实现事件发布和监听机制。

## **策略模式（Strategy Pattern）**——excludeFilters、includeFilters

-   描述：定义一系列算法，把它们一个个封装起来，并且使它们可以互相替换。
-   应用：
    -   **TransactionManager** 接口定义了事务管理的策略，不同的实现类（如 DataSourceTransactionManager、JtaTransactionManager）提供了不同的事务管理方式。
    -   **Spring中的Resource接口**：在Spring框架中，`org.springframework.core.io.Resource`接口用于抽象不同类型的资源，例如文件系统资源、类路径资源、URL资源等。Resource接口就像策略模式中的策略接口，而不同类型的资源类（如`ClassPathResource`、`FileSystemResource`等）就像具体策略。客户端可以根据需要选择和使用不同的资源类。
    -   **Spring中的AOP代理**：在Spring AOP中，代理类的创建使用了策略模式。`org.springframework.aop.framework.ProxyFactory`中的`AopProxy`接口定义了创建代理对象的策略接口，而`JdkDynamicAopProxy`和`CglibAopProxy`这两个类分别为基于JDK动态代理和CGLIB动态代理的具体策略。客户端可以根据需要选择使用哪种代理方式。
    -   Spring MVC中的`HandlerMapping`接口：在Spring MVC框架中，`HandlerMapping`接口定义了映射请求到处理器的策略接口。Spring MVC提供了多种`HandlerMapping`实现，例如`BeanNameUrlHandlerMapping`、`RequestMappingHandlerMapping`等，分别表示不同的映射策略。客户端可以通过配置选择使用哪种映射策略。

## **依赖注入（Dependency Injection, DI）**

-   描述：将依赖关系从代码中分离出来，通过外部配置或容器进行管理。
-   应用：
    -   构造器注入、设值注入 和 接口注入 是 Spring 中常用的依赖注入方式。
    -   通过依赖注入，Spring 容器可以自动管理和组装对象之间的依赖关系，减少了耦合度。



todo ✅Spring中用到了哪些设计模式