# @SpringBootApplication注解

@SpringBootApplication注解是作用于SpringBoot程序的启动类上

它是@SpringBootConfiguration、@EnableAutoConfiguration、@ComponentScan三个注解的复合注解

-   `@SpringBootConfiguration`：表示当前类是一个配置类。
-   `@EnableAutoConfiguration`：启用 Spring Boot 的自动配置机制，根据类路径中的依赖自动配置 Spring 应用程序。
-   `@ComponentScan`：自动扫描并注册带有 `@Component` 注解的类为 Spring Bean，通常会扫描当前包及其子包下的所有组件