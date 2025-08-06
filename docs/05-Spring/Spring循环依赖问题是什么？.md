# Spring循环依赖问题是什么？（什么是循环依赖？）:star:

Spring循环依赖问题是指在Spring容器中，两个或多个Bean之间存在直接的或间接的依赖关系，导致在创建和初始化这些Bean时形成了一个**闭环**，使得无法正确地创建和初始化这些Bean。

主要有两种形式：

-   **构造器循环依赖**：这种循环依赖发生在Bean之间的构造器相互引用
-   **setter 方式的循环依赖**：这种循环依赖发生在Bean实例化后进行依赖注入的过程中

构造器循环依赖主要是 Bean A的构造器需要Bean B作为参数，而Bean B的构造器又需要Bean A作为参数。由于构造器是在Bean实例化时调用的，所以Spring容器无法先创建其中一个Bean，因为这样会导致另一个Bean无法实例化，从而形成死循环。

setter 循环依赖发生在Bean的setter注入方法中。与构造器循环依赖不同，setter注入是在Bean实例化之后进行的。如果循环依赖关系复杂或配置不当，也可能导致Spring容器无法正确初始化Bean。

>   其实是有三种表现形式：
>
>   1、互相依赖
>
>   2、间接依赖
>
>   3、自我依赖

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
