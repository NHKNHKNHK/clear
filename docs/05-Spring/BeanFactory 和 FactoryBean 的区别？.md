---
permalink: /25/8/6/spring/factoryBean-beanFactory
---

# BeanFactory 和 FactoryBean 的区别？

## 口语化

BeanFactory是一个工厂，也就是一个容器，是用来管理和生成Bean的；

FactoryBean是一个bean，但它是一个特殊的bean，所以也是由BeanFactory所管理的，不过FactoryBean不是一个普通的Bean，他会表现出工厂模式的样子，是一个能产生或者修饰对象生成的工厂Bean，里面的`getObject()`就是用来获取FactoryBean产生的对象。所以在BeanFactory中使用 "&" 来得到FactoryBean本身，用来区分通过容器获取FactoryBean产生的对象还是获取FactoryBean本身。

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
| 作用     | 管理 Bean 生命周期和依赖注入 | 创建复杂的对象或需要特殊初始化逻辑的对象    |
| 适用场景 | 资源受限环境、简单应用       | 需要灵活控制 Bean 创建过程的场景            |
| 主要方法 | getBean()、containsBean() 等 | getObject()、getObjectType()、isSingleton() |
| 配置方式 | XML、注解、Java 配置类       | 在 XML 或 Java 配置类中声明为普通 Bean      |

-   如果你需要更灵活地控制 Bean 的创建过程，特别是当 Bean 的创建逻辑较为复杂时，可以选择实现 `FactoryBean` 接口
