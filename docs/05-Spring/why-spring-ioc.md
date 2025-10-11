# 什么是SpringIOC？

## 口语化

IOC是一种思想，不是具体的技术。它让对象的创建和管理交给Spring容器来完成（反转的体现），而不是我们自己手动创建对象。容器根据配置或注解来创建对象，并管理对象的依赖关系、生命周期，我们就不需要在代码中手动的new对象了。

IOC的主要实现是依赖注入，也就是DI（Dependency Injection，依赖注入）。我们可以通过setter注入、字段注入、构造器注入等方式，将对象注入到另一个对象的属性中。 这样Spring容器能够自动管理对象的依赖关系，使得应用程序代码更加简洁

:::tip
要点：

- IOC是一种思想，不是具体的技术。
- DI是实现
- 核心是控制对象创建，反转创建动作

目的：解耦和简化管理
:::

Spring IoC（Inversion of Control，控制反转）是Spring框架中的一个核心概念。

## 什么是IOC（控制反转）

在传统的编程模型中，应用程序代码通常直接控制对象的创建和依赖关系。例如，一个对象需要依赖另一个对象时，通常会在代码中直接创建依赖对象。这种方式使得代码紧密耦合，不利于测试和维护。
控制反转的理念是将这种控制权从应用程序代码中移除，转而交给一个容器来管理。这个容器就是Spring IoC容器。通过这种方式，对象的创建和依赖关系的管理被反转了，应用程序代码不再负责这些任务，而是由容器来处理。

## 什么是DI（依赖注入）

依赖注入是实现控制反转的一种方式（或者说主要方式）

它主要有以下几种形式：

- **构造函数注入**：通过构造函数将依赖对象传递给被依赖对象。

```java
public class Service {
    private final Repository repository;

    public Service(Repository repository) {
        this.repository = repository;
    }
}
```

:::tip
Spring官方推荐使用构造器来注入依赖对象，这样做的好处是可以将循环依赖问题暴露在开发阶段

开发中构造器注入常常是配合Lombok的`@RequiredArgsConstructor`注解使用，这样可以简化构造函数的书写。

:::

- **Setter方法注入**：通过Setter方法将依赖对象注入到被依赖对象中。

```java
public class Service {
    private Repository repository;

    public void setRepository(Repository repository) {
        this.repository = repository;
    }
}
```

- **字段注入**：直接在字段上使用注解进行注入

```java
public class Service {
    @Autowired
    private Repository repository;
}
```

## Spring IoC 容器

Spring IoC容器负责管理应用程序中对象的生命周期和依赖关系。它的主要职责包括：

- 对象的创建：根据配置文件或注解创建对象。
- 依赖注入：将对象的依赖注入到相应的对象中。
- 对象的销毁：在适当的时候销毁对象，释放资源。

Spring IoC容器可以通过多种方式进行配置

- **XML配置**：通过XML文件定义Bean及其依赖关系

```xml
<beans>
    <bean id="repository" class="com.example.Repository"/>
    <bean id="service" class="com.example.Service">
        <constructor-arg ref="repository"/>
    </bean>
</beans>
```

- **Java配置**：通过Java类和注解定义Bean及其依赖关系

```java
@Configuration
public class AppConfig {
    @Bean
    public Repository repository() {
        return new Repository();
    }

    @Bean
    public Service service() {
        return new Service(repository());
    }
}
```

- **注解配置**：通过注解（如`@Component`、`@Autowired`）自动扫描和注入Bean。

```java
@Component
public class Repository {
}

@Component
public class Service {
    @Autowired
    private Repository repository;
}
```