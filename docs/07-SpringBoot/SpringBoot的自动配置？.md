# SpringBoot的自动配置（原理）？


Spring Boot 的自动配置是其核心特性之一，它通过一系列的**条件注解**和**约定优先（convention over configuration）**的方式

Spring Boot 的自动配置极大地简化了开发者的配置工作，但同时也提供了灵活的扩展机制，允许开发者根据需求自定义或覆盖默认行为。



Spring Boot 的自动配置原理主要依赖于以下几个关键点：

-   **@SpringBootApplication 注解**：这个注解是 Spring Boot **应用的入口**
    -   它实际上包含了 `@Configuration`、`@EnableAutoConfiguration` 和 `@ComponentScan` 三个注解。
-   **@EnableAutoConfiguration 注解**：这是自动配置的**核心注解**，它会根据类路径中的依赖和配置文件中的配置项，自动装配对应的 Bean。
    -   它的实现依赖于 `spring.factories` 文件中定义的一系列 `AutoConfiguration` 类。
-   **spring.factories 文件**：位于 `META-INF` 目录下，里面定义了所有符合条件的**自动配置类**。Spring Boot 启动时会读取这些类，并根据条件判断是否需要创建相应的 Bean。
-   **条件注解**：如 `@ConditionalOnClass`、`@ConditionalOnMissingBean` 等，用于控制自动配置类中的 Bean 是否会被创建。例如，如果类路径中存在 `DataSource` 类，则会自动配置数据库连接池。
-   **属性绑定**：通过 `@ConfigurationProperties` 或者直接在 `application.properties` 中定义的属性，可以对自动配置进行定制化调整。



**条件注解**

-   Spring Boot 使用了一系列的条件注解（Conditional Annotations）来实现自动配置，确保只有在满足特定条件时才会应用某些配置。

-   例如：如果类路径中存在 `DataSource` 类，则会自动配置数据库连接池

这些注解包括：

`@ConditionalOnClass`：当类路径上存在指定的类时，配置才会生效。

`@ConditionalOnMissingClass`：当类路径上不存在指定的类时，配置才会生效。

`@ConditionalOnBean`：当 Spring 容器中存在指定的 Bean 时，配置才会生效。

`@ConditionalOnMissingBean`：当 Spring 容器中不存在指定的 Bean 时，配置才会生效。

`@ConditionalOnProperty`：当指定的属性存在或具有特定值时，配置才会生效。

`@ConditionalOnResource`：当类路径下存在指定的资源时，配置才会生效。

`@ConditionalOnWebApplication`：当当前应用是 Web 应用时，配置才会生效。

`@ConditionalOnNotWebApplication`：当当前应用不是 Web 应用时，配置才会生效。

**`@EnableAutoConfiguration`注解**

-   默认情况下，Spring Boot 项目中会自动引入 `@EnableAutoConfiguration` 注解（通常由 `@SpringBootApplication` 带来）。
-   它会扫描类路径中的依赖，并根据这些依赖自动配置 Spring 应用上下文。
-   `@SpringBootApplication`是一个组合注解，包含了`@EnableAutoConfiguration`、`@ComponentScan`和`@Configuration`。

```java
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

**`spring.factories`文件**

Spring Boot 使用`spring.factories`文件来列出所有的自动配置类。这个文件位于每个自动配置模块的`META-INF`目录下。Spring Boot 在启动时会扫描这些文件，并加载其中列出的自动配置类。

`spring.factories`文件的内容示例如下：

```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration,\
org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,\
org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration
```



**自动配置的工作流程**

Spring Boot 自动配置的工作流程可以分为以下几个步骤：

1.  **扫描`spring.factories`文件**：Spring Boot 启动时，会扫描所有依赖中的`spring.factories`文件，找到所有列出的自动配置类（通常是 `*AutoConfiguration` 类）。
2.  **加载自动配置类**：Spring Boot 会尝试加载这些自动配置类。
3.  **评估条件注解**：对于每个自动配置类，Spring Boot 会评估其上的条件注解。如果所有条件都满足，则该自动配置类会被应用。
4.  **应用自动配置**：自动配置类中的配置会被应用到 Spring 容器中，**注册相应的 Bean**。



**常见的自动配置场景**

| 依赖                           | 自动配置内容                       |
| :----------------------------- | :--------------------------------- |
| `spring-boot-starter-data-jpa` | 数据源、JPA 实体管理器、事务管理器 |
| `spring-boot-starter-web`      | 嵌入式 Tomcat、Spring MVC 配置     |
| `spring-boot-starter-security` | Spring Security 过滤器链           |
| `spring-boot-starter-mail`     | JavaMailSender 配置                |
| `spring-boot-starter-cache`    | 缓存管理器（如 Redis、Ehcache）    |



**示例：自动配置 DataSource**

1、`spring.factories`文件

在`spring-boot-autoconfigure`模块的`META-INF/spring.factories`文件中，列出了`DataSourceAutoConfiguration`：

```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
```

2、自动配置类`DataSourceAutoConfiguration`

`DataSourceAutoConfiguration`类使用了条件注解来判断是否需要自动配置 DataSource：

```java
@Configuration
@ConditionalOnClass(DataSource.class)
@EnableConfigurationProperties(DataSourceProperties.class)
@Import({DataSourceConfiguration.Hikari.class, DataSourceConfiguration.Tomcat.class})
public class DataSourceAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    @ConditionalOnSingleCandidate(DataSource.class)
    public DataSourceInitializer dataSourceInitializer(DataSource dataSource, DataSourceProperties properties) {
        return new DataSourceInitializer(dataSource, properties);
    }

    // 其他配置
}
```

3、条件注解的评估

在应用启动时，Spring Boot 会评估`DataSourceAutoConfiguration`类上的条件注解：

`@ConditionalOnClass(DataSource.class)`：确保类路径上存在`javax.sql.DataSource`类。

`@ConditionalOnMissingBean`：确保 Spring 容器中不存在其他类型为`DataSource`的 Bean。

如果这些条件都满足，Spring Boot 会应用`DataSourceAutoConfiguration`中的配置，注册相应的 DataSource Bean。



**禁用自动配置**

在某些情况下，你可能希望禁用某些自动配置。可以通过以下方式实现：

-   使用`@SpringBootApplication`注解的`exclude`属性

```java
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

-   使用`application.properties`文件 或 `application.yml`文件 

```properties
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
```

```yml
spring:
  autoconfigure:
    exclude:
      - org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
```



**如何查看自动配置的内容**

-   **启用调试日志**

在 `application.properties` 或 `application.yml` 中添加以下配置：

```properties
logging.level.org.springframework.boot.autoconfigure=DEBUG
```

启动应用时，Spring Boot 会打印出所有匹配和未匹配的自动配置类。


todo ✅Springboot是如何实现自动配置的？