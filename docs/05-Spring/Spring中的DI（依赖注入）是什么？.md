# Spring中的DI（依赖注入）是什么？

依赖注入（Dependency Injection，简称DI）是Spring框架实现控制反转（IoC）的主要手段。

依赖注入是 Spring 框架的核心特性之一，它是一种设计模式，通过将对象的依赖关系由外部容器（如 Spring 容器）管理并注入到对象中，而不是由对象自己创建或查找这些依赖。这种方式可以显著降低代码的耦合度，提高代码的可测试性和灵活性。

**DI 的核心思想**

-   **控制反转（IoC）**：传统应用程序中，对象自己负责管理和创建其依赖的对象。而在使用依赖注入后，对象不再直接创建依赖对象，而是由外部容器负责创建并注入这些依赖。
-   **解耦合**：依赖注入使得类之间的依赖关系更加松散，减少了类之间的直接耦合，提高了代码的可维护性和复用性。

**DI 的实现方式**

Spring框架主要提供了三种依赖注入的方式：

**依赖注入是实现控制反转的一种具体方式**，Spring 支持以下几种注入方式：

-   构造器注入：通过构造函数传递依赖。
-   Setter方法注入（Setter Injection）：通过 Setter 方法传递依赖。
-   字段注入：直接在字段上使用 @Autowired 注解注入依赖。

**构造器注入**：通过构造函数传递依赖。

```java
public class Service {
    private final Repository repository;

    public Service(Repository repository) {
        this.repository = repository;
    }
}
```

**Setter方法注入**（Setter Injection）：通过 Setter 方法传递依赖。

```java
public class Service {
    private Repository repository;

    public void setRepository(Repository repository) {
        this.repository = repository;
    }
}
```

**字段注入**：直接在字段上使用 @Autowired 注解注入依赖。

```java
public class Service {
    @Autowired
    private Repository repository;
}
```

