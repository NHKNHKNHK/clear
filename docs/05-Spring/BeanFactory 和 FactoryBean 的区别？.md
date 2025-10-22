---
permalink: /25/10/22/spring/factoryBean-beanFactory
---

# BeanFactory 和 FactoryBean 的区别？

:::tip
`BeanFactory`是Spring IoC容器的一个接口，用来获取Bean以及管理Bean的依赖注入和生命周期

`FactoryBean`是一种特殊的bean，也是由`BeanFactory`所管理的

`FactoryBean`通常用于创建很复杂的对象，比如需要通过某种特定的创建过程才能得到的对象
:::

## 口语化

BeanFactory顾名思义就是Bean工厂，它是Spring IOC容器的一部分，也就是一个容器，是用来管理和生成Bean的；

FactoryBean是一个bean，但它是一个特殊的bean，所以也是由BeanFactory所管理的，不过FactoryBean不是一个普通的Bean，他会表现出工厂模式的样子，是一个能产生或者修饰对象生成的**工厂Bean**，里面的`getObject()`就是用来获取FactoryBean产生的对象。所以在BeanFactory中使用 "&" 来得到FactoryBean本身，用来区分通过容器获取FactoryBean产生的对象还是获取FactoryBean本身。

## BeanFactory

-   定义：BeanFactory 是 Spring 中最基本的 IoC 容器接口，用于管理 Bean 的生命周期和依赖注入。
-   作用：它负责根据配置（如 XML、注解或 Java 配置类）创建和管理 Bean 实例，并提供获取这些 Bean 的方法（如 getBean()）。

-   适用场景：适用于需要基本的 IoC 容器功能的应用程序，特别是资源受限的环境（如 Applet 或移动设备）。它提供了轻量级的 Bean 管理功能。
-   接口主要方法
    -   `Object getBean(String name)`：根据名称获取 Bean 实例。
    -   `Object getBean(String name, Class<T> requiredType)`：根据名称和类型获取 Bean 实例。
    -   `boolean containsBean(String name)`：检查容器中是否存在指定名称的 Bean。
    -   `String[] getBeanDefinitionNames()`：获取所有已注册的 Bean 名称。
-   BeanFactory
    可以通过 XML 配置文件、注解或 Java 配置类来配置和管理 Bean。
    FactoryBean
    通常在 XML 配置文件或 Java 配置类中声明为普通的 Bean，Spring 容器会自动识别并调用其 getObject() 方法来创建实际的 Bean。

## FactoryBean

-   定义：FactoryBean 是一个特殊的接口，允许开发者自定义 Bean 的创建逻辑。它不是容器本身，而是一个由容器管理的 Bean，通过实现特定的方法来生成其他对象。
-   作用：主要用于在容器中创建复杂的对象或需要特殊初始化逻辑的对象。它可以通过 `getObject()` 方法返回最终的 Bean 实例。
-   适用场景：当你需要更灵活地控制 Bean 的创建过程时使用。例如，创建第三方库的对象、处理复杂初始化逻辑、或者需要在运行时动态决定返回哪个对象。
-   接口的方法
    -   `Object getObject()`：返回由 FactoryBean 创建的对象实例。
    -   `Class<?> getObjectType()`：返回 getObject() 方法返回的对象类型。
    -   `boolean isSingleton()`：指示 FactoryBean 创建的对象是否为单例。

::::tip
`FactoryBean`我们在业务开发中很少用到，但是很多框架底层都会使用，如Kafka、Dubbo等各种框架中都会用他来和Spring做集成

以Dubbo为例，当我们定义一个远程的提供者提供的的Bean的时候，可以用`@DubboReference`或者`<dubbo:reference>`。这两种定义方式的最终实现都是一个Dubbo中的`ReferenceBean` ，它负责创建并管理远程服务代理对象。而这个`ReferenceBean`就是一个`FactoryBean`的实现，如下：

```java
public class ReferenceBean<T> implements FactoryBean<T>,
        ApplicationContextAware, BeanClassLoaderAware, BeanNameAware, InitializingBean, DisposableBean {

}
```

:::details 扩展——ReferenceBean
`ReferenceBean`的主要作用是创建并配置Dubbo服务的代理对象。这些代理对象允许客户端像调用本地方法一样调用远程服务。创建Dubbo服务代理通常涉及复杂的配置和初始化过程，包括网络通信设置、序列化配置等。通过`ReferenceBean`将这些复杂性封装起来，对于使用者来说，只需要通过简单的Spring配置即可使用服务。

`ReferenceBean` 实现了 `FactoryBean` 接口并实现了`getObject`方法。在`getObject()`方法中，`ReferenceBean`会给要调用的服务创建一个动态代理对象。这个代理对象负责与远程服务进行通信，封装了网络调用的细节，使得远程方法调用对于开发者来说是透明的。

通过 `FactoryBean` 实现，ReferenceBean 还可以延迟创建代理对象直到真正需要时，这样可以提升启动速度并减少资源消耗。此外，它还可以实现更复杂的加载策略和优化。

通过实现 `FactoryBean`，`ReferenceBean` 能够很好地与Spring框架集成。这意味着它可以利用Spring的依赖注入、生命周期管理等特性，并且能够被Spring容器所管理。

所以，**FactoryBean通常用于创建很复杂的对象，比如需要通过某种特定的创建过程才能得到的对象。例如，创建与JNDI资源的连接或与代理对象的创建。就如我们的Dubbo中的ReferenceBean。**
:::

::::

## 使用 BeanFactory

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class BeanFactoryExample {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
        MyService myService = (MyService) context.getBean("myService");
        myService.doSomething();
    }
}
```

## 使用 FactoryBean

```java
import org.springframework.beans.factory.FactoryBean;
import org.springframework.stereotype.Component;

@Component
public class MyServiceFactoryBean implements FactoryBean<MyService> {

    @Override
    public MyService getObject() throws Exception {
        // 自定义创建逻辑
        return new MyServiceImpl();
    }

    @Override
    public Class<?> getObjectType() {
        return MyService.class;
    }

    @Override
    public boolean isSingleton() {
        return true; // 返回的对象是单例
    }
}
```

## 总结

| 特性     | BeanFactory                  | FactoryBean                                 |
| -------- | ---------------------------- | ------------------------------------------- |
| 定义     | 基本的 IoC 容器接口          | 允许自定义 Bean 创建逻辑的接口              |
| 作用     | 管理 Bean 生命周期和依赖注入 | **创建复杂的对象或需要特殊初始化逻辑的对象**    |
| 适用场景 | 资源受限环境、简单应用       | 需要灵活控制 Bean 创建过程的场景            |
| 主要方法 | getBean()、containsBean() 等 | getObject()、getObjectType()、isSingleton() |
| 配置方式 | XML、注解、Java 配置类       | 在 XML 或 Java 配置类中声明为普通 Bean      |

结论：

- 如果你需要更灵活地控制 Bean 的创建过程，特别是当 Bean 的创建逻辑较为复杂时，可以选择实现 `FactoryBean` 接口
- 但是这个接口绝大多数情况下我们都不会主动的去使用，它存在意义主要作用是方便三方框架集成Spring使用。这意味着它可以利用Spring的依赖注入、生命周期管理等特性，并且能够被Spring容器所管理
