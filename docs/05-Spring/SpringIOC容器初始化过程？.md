# SpringIOC容器初始化过程？

Spring 的 IOC 容器初始化过程是一个复杂但有序的过程，涉及到多个步骤和内部机制。



>   SpringIOC的加载是从new一个`ApplicationContext` 开始的，而`ApplicationContext` 是一个接口，所以我们常常new的是它的实现类。
>
>   IOC容器的加载过程，也可以看作是bean的创建过程，而bean的创建过程有四种形态：概念态、定义态、纯静态、成熟态
>
>   概念态：IOC还未加载，此时还没new Spring的上下文容器。只是通过\<bean/> 、@Bean、@Lazy...等等定义了一个个bean
>
>   定义态：当我们new Spring的上下文容器时，概念态的bean会注册成为定义态的bean，即BeanDefinition，它存储了bean的元信息。
>
>   纯静态：所有的bean都注册未BeanDefinition之后，就会通过反射机制创建bean，早期暴力的bean，此时还没进行属性赋值等操作。
>
>   成熟态：此时的bean可以在应用中直接使用

以下是 Spring IOC 容器（特别是 ApplicationContext）的初始化流程：

1.  **创建容器实例**

首先，通过调用 ApplicationContext 的构造函数或静态方法来创建**容器实例**。

常用的实现类包括 `AnnotationConfigApplicationContext `和 `ClassPathXmlApplicationContext`。

```java
// 使用注解配置
AnnotationConfigApplicationContext context = 
    			new AnnotationConfigApplicationContext(MyConfig.class);

// 使用 XML 配置
ClassPathXmlApplicationContext context = 
    			new ClassPathXmlApplicationContext("applicationContext.xml");
```

2.  **加载配置元数据**

容器会根据提供的配置文件或注解加载配置元数据。这一步骤包括解析 XML 文件、注解配置类等。

-   XML 配置：解析 XML 文件中的 `<bean> `定义。
-   注解配置：扫描带有 `@Configuration`, `@Component`, `@Service`, `@Repository` 等注解的类，并注册为 Bean。

3.  **注册 BeanDefinition**

在解析配置后，Spring 会将每个 Bean 的定义信息（如类名、依赖关系、作用域等）注册到 `BeanDefinitionRegistry` 中。这是容器内部的一个注册表，用于存储所有 Bean 的定义信息。

4.  **准备 BeanFactoryPostProcessors**（bean工厂后置处理器）

Spring 容器会提前准备并执行 `BeanFactoryPostProcessor`。这类处理器可以在 Bean 实例化之前修改 Bean 定义，例如 PropertyPlaceholderConfigurer 可以**解析占位符**。

```java
@Configuration
public class MyConfig {
    @Bean
    public static PropertySourcesPlaceholderConfigurer propertyConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }
}
```

6.  **实例化单例 Beans**

对于所有被标记为单例的 Bean，Spring 会在容器启动时预先实例化它们。这个过程包括：

-   **实例化**：根据 BeanDefinition 创建 Bean 实例。
-   **属性填充**：通过依赖注入（DI）设置 Bean 的属性值。
-   **Aware 接口回调**：如果 Bean 实现了某些 Aware 接口（如 BeanFactoryAware, ApplicationContextAware），则在此阶段调用相应的回调方法。

6.  **初始化 Bean**

在 Bean 实例化和属性填充完成后，Spring 会调用 Bean 的初始化方法：

-   自定义初始化方法：通过 `@PostConstruct` 注解或 **init-method** 属性指定的方法。
-   InitializingBean 接口：如果 Bean 实现了 `InitializingBean` 接口，则调用 afterPro**pertiesSet()** 方法。

```java
@Component
public class MyService implements InitializingBean {
    @Override
    public void afterPropertiesSet() throws Exception {
        // 初始化逻辑
    }

    @PostConstruct
    public void init() {
        // 初始化逻辑
    }
}
```

7.  **应用 BeanPostProcessors**

Spring 容器会调用所有已注册的 BeanPostProcessor。这些处理器可以对 Bean 进行进一步的处理，例如 AOP 代理的创建。

```java
@Component
public class MyBeanPostProcessor implements BeanPostProcessor {
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        // 在初始化前处理
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        // 在初始化后处理
        return bean;
    }
}
```

8.  **完成容器初始化**

当所有单例 Bean 都被成功初始化后，Spring 容器的初始化过程结束。此时，应用程序可以开始使用容器中的 Bean。

9.  **销毁 Bean**

当容器关闭时（例如应用程序关闭），Spring 会调用 Bean 的销毁方法：

-   自定义销毁方法：通过 `@PreDestroy` 注解或 **destroy-method** 属性指定的方法。
-   DisposableBean 接口：如果 Bean 实现了 `DisposableBean` 接口，则调用 **destroy()** 方法。

```java
@Component
public class MyService implements DisposableBean {
    @Override
    public void destroy() throws Exception {
        // 清理逻辑
    }

    @PreDestroy
    public void cleanup() {
        // 清理逻辑
    }
}
```

