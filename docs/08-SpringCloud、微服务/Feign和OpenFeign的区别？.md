# Feign和OpenFeign的区别？


## **发展历程**

-   Feign最初是Netflix公司开发的一款声明式HTTP客户端，后来随着Netflix套件的逐渐停止维护，Spring Cloud团队推出了OpenFeign作为替代方案。
-   OpenFeign是在Feign的基础上进行了改进和发展，更好地适应了Spring Cloud生态系统的需求。

OpenFeign 和 Feign 是两种用于微服务架构中服务间通信的工具，它们都提供了**声明式的HTTP客户端**，使得调用HTTP服务像调用本地方法一样简单。

## **相同点**

-   Feign和OpenFeign都是Spring Cloud下远程服务调用和负载均衡的组件
-   Feign和OpenFeign作用一致，都是用来实现服务的远程调用的和负载均衡的
-   Feign和OpenFeign都对Ribbon进行了集成，都是利用Ribbon维护了一个可用的服务清单列表，然后通过Ribbon实现了客户端的负载均衡
    -   新版的OpenFeign不再支持Ribbon，而是使用**Loadbalance**
-   Feign和OpenFeign都是在服务者的消费者端定义服务来绑定接口的，也就是说在客户端来定义接口绑定服务，并且是通过注解的方式来进行配置的

## **不同点**

-   **依赖包**：
    -   **Feign**：使用的是 `spring-cloud-starter-feign` 依赖包。
    -   **OpenFeign**：使用的是 `spring-cloud-starter-openfeign` 依赖包。

-   **支持的注解不同**：
    -   **Feign**：Feign通过注解来定义接口，支持Feign自身的注解和JAX-RS的注解，但是不支持Spring MVC的注解。
    -   **OpenFeign**：OpenFeign不仅支持Feign原有的注解，还支持JAX-RS、Spring MVC的注解，如`@RequestMapping`、`@GetMapping`、`@PostMapping`等，使得定义接口更加灵活和方便。

-   **@FeignClient**注解：
    -   **Feign**：使用`@FeignClient`注解定义一个Feign客户端，但是它不能解析Spring MVC注解下的接口。
    -   **OpenFeign**：同样使用`@FeignClient`注解，但它可以解析Spring MVC注解下的接口，并通过**动态代理**的方式**产生实现类**，实现类中做负载均衡并调用其他服务。

**特性**：

-   相对于Feign而言，OpenFeign提供了更多高级特性和灵活性，例如支持更丰富的配置选项、更好的集成Spring Boot生态等。

## 总结

-   如果你正在使用Spring Cloud，并且希望在定义Feign客户端时能够使用Spring MVC的注解，那么OpenFeign是一个更好的选择。
-   如果你的项目已经使用了Feign，并且没有计划迁移到Spring MVC的注解，那么继续使用Feign也是可行的。

总的来说，OpenFeign是对Feign的一种增强版本，它提供了更多的功能和更好的兼容性，特别是对于那些希望在微服务架构中充分利用Spring MVC特性的开发者来说。
