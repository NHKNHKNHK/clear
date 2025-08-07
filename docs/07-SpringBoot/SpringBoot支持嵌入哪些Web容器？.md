# SpringBoot支持嵌入哪些Web容器？

Spring Boot 支持嵌入式的 Web 容器，总的分为 **Servlet Web 容器** 和 **Reactive Web 容器** 两大类：


## **Servlet Web 容器**

这些容器基于传统的 Servlet 规范（如 Servlet 3.1+），适用于阻塞式 I/O 模型。

Servlet Web 容器又可以细分为：

-   **Tomcat**（默认）
    -   广泛使用，适合大多数企业级应用。
    -   版本支持：Spring Boot 默认集成最新稳定版 Tomcat。
    -   但，负载了若干较重的组件
-   **Jetty**
    -   轻量级容器，适合嵌入式和 IoT 应用。（**更轻量级**，负载性能远不及tomcat）
    -   支持异步 HTTP、WebSocket 和 HTTP/2。
-   **Undertow**
    -   Red Hat 提供的高性能容器。（负载性能勉强跑赢tomcat）
    -   适合需要高并发处理的应用场景。

说明： Jetty比Tomcat更轻量级，可扩展性更强（相较于Tomcat），谷歌应用引擎（GAE）已经全面切换为Jetty SpringBoot内置服务器



## **Reactive Web 容器**

这些容器基于响应式编程模型，适用于非阻塞式 I/O 模型。

-   Netty
    -   Spring Boot 的 Reactive 编程模型（如 `WebFlux`）默认使用的容器。
    -   轻量级，专注于高性能和低延迟。



## **如何选择容器？**

-   如果使用传统的 Spring MVC（基于 Servlet），可以选择 **Tomcat**、**Jetty** 或 **Undertow**。
-   如果使用响应式编程模型（如 `WebFlux`），推荐使用 **Netty**。



## **配置方式**

可以通过 `pom.xml`更改默认容器，示例：

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <!-- web起步依赖环境中，排除tomcat起步依赖-->
        <exclusions>
            <exclusion>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-tomcat</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
    <!-- 添加Jetty起步依赖，版本由SpringBoot的starter控制 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-jetty</artifactId>
    </dependency>
</dependencies>
```



## **总结**

Spring Boot 默认使用 **Tomcat** 作为嵌入式 Web 容器，但也支持 **Jetty**、**Undertow** 和 **Netty**，开发者可以根据具体需求选择合适的容器。

