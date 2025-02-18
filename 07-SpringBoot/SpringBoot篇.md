## 什么是SpringBoot？



## SpringBoot的核心特性？



## 什么是Spring Initializr？



## SpringBoot启动过程？

1、引导类初始化：应用从main方法开始，调用SpringApplication.run()方法，创建一个SpringApplication实例

2、环境准备：SpringApplication通过prepareEnvironment()方法加载配置文件（如application.propertire或application.yml），并创建Environment对象，设置系统变量和属性源

3、上下文创建：createApplicationContext()创建应用上下文（如）

4、启动监听器

5、Bean加载与注册

6、嵌入式服务启动

7、运行启动器与命名行运行器

8、启动完成



## SpringBoot是如何通过main方法启动web项目的？



## @SpringBootApplication注解

@SpringBootApplication注解是作用于SpringBoot程序的启动类上

它是@SpringBootConfiguration、@EnableAutoConfiguration、@ComponentScan三个注解的复合注解

-   `@SpringBootConfiguration`：表示当前类是一个配置类。
-   `@EnableAutoConfiguration`：启用 Spring Boot 的自动配置机制，根据类路径中的依赖自动配置 Spring 应用程序。
-   `@ComponentScan`：自动扫描并注册带有 `@Component` 注解的类为 Spring Bean，通常会扫描当前包及其子包下的所有组件



## @ConfigurationProperties注解的作用？





## SpringBoot支持嵌入哪些Web容器？



## SpringBoot中application.properties、application.yaml、application.yml的区别？



## 如何在SpringBoot在定义和读取自定义配置？



## SpringBoot配置文件加载优先级？



## SpringBoot打成的jar包与普通jar的区别？



## SpringBoot是否可以使用xml配置？



## 如何处理SpringBoot中的全局异常？



## SpringBoot默认同时可以处理的最大连接数？



## 如何理解SpringBoot中的starter？



## 如何自定义SpringBoot中的starter？



## SpringBoot处理处理跨域请求（CORS）？



## 在SpringBoot中你是怎么使用拦截器的？





## SpringBoot中如何实现定时任务？



## 如何在SpringBoot应用中实现国际化（i18n）？



## 什么是Spring Actuator？它有什么优势？



## SpringBoot1.x、2.x、3.x版本有哪些改进与区别？



## SpringBoot中的条件注解@Conditional有什么用？



## 说说你对SpringBoot事件机制的理解？



## 在SpringBoot中如何实现多数据源配置？

ruoyi就实现了，可以参考



## SpringBoot中如何实现异步处理？



## 如何在SpringBoot启动时执行特定代码？有哪些方式？



## SpringBoot中为什么不推荐使用@Autowrited



## SpringBoot的自动配置？

Spring Boot 的自动配置,能够根据项目中的依赖和配置自动地为你配置 Spring 应用程序，而无需手动编写大量的配置代码。这个特性极大地简化了 Spring 应用程序的开发过程

Spring Boot 的自动配置原理主要依赖于以下几个关键点：

-   **@SpringBootApplication 注解**：这个注解是 Spring Boot **应用的入口**，它实际上包含了 `@Configuration`、`@EnableAutoConfiguration` 和 `@ComponentScan` 三个注解。
-   **@EnableAutoConfiguration 注解**：这是自动配置的**核心注解**，它会根据类路径中的依赖和配置文件中的配置项，自动装配对应的 Bean。它的实现依赖于 `spring.factories` 文件中定义的一系列 `AutoConfiguration` 类。
-   **spring.factories 文件**：位于 `META-INF` 目录下，里面定义了所有符合条件的自动配置类。Spring Boot 启动时会读取这些类，并根据条件判断是否需要创建相应的 Bean。
-   **条件注解**：如 `@ConditionalOnClass`、`@ConditionalOnMissingBean` 等，用于控制自动配置类中的 Bean 是否会被创建。例如，只有当类路径中存在某个类时，才会创建特定的 Bean。
-   **属性绑定**：通过 `@ConfigurationProperties` 或者直接在 `application.properties` 中定义的属性，可以对自动配置进行定制化调整。

**条件注解**

Spring Boot 使用了一系列的条件注解（Conditional Annotations）来实现自动配置。这些注解包括：

`@ConditionalOnClass`：当类路径上存在指定的类时，配置才会生效。

`@ConditionalOnMissingClass`：当类路径上不存在指定的类时，配置才会生效。

`@ConditionalOnBean`：当 Spring 容器中存在指定的 Bean 时，配置才会生效。

`@ConditionalOnMissingBean`：当 Spring 容器中不存在指定的 Bean 时，配置才会生效。

`@ConditionalOnProperty`：当指定的属性存在或具有特定值时，配置才会生效。

`@ConditionalOnResource`：当类路径下存在指定的资源时，配置才会生效。

`@ConditionalOnWebApplication`：当当前应用是 Web 应用时，配置才会生效。

`@ConditionalOnNotWebApplication`：当当前应用不是 Web 应用时，配置才会生效。

**`@EnableAutoConfiguration`注解**

`@EnableAutoConfiguration`是 Spring Boot 自动配置的核心注解，它通常与`@SpringBootApplication`一起使用。`@SpringBootApplication`是一个组合注解，包含了`@EnableAutoConfiguration`、`@ComponentScan`和`@Configuration`。

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

```
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration,\
org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,\
org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration
```

**自动配置的工作流程**

Spring Boot 自动配置的工作流程可以分为以下几个步骤：

1.  **扫描**`**spring.factories**`**文件**：Spring Boot 启动时，会扫描所有依赖中的`spring.factories`文件，找到所有列出的自动配置类。
2.  **加载自动配置类**：Spring Boot 会尝试加载这些自动配置类。
3.  **评估条件注解**：对于每个自动配置类，Spring Boot 会评估其上的条件注解。如果所有条件都满足，则该自动配置类会被应用。
4.  **应用自动配置**：自动配置类中的配置会被应用到 Spring 容器中，注册相应的 Bean。

**示例：自动配置 DataSource**

1、`spring.factories`文件

在`spring-boot-autoconfigure`模块的`META-INF/spring.factories`文件中，列出了`DataSourceAutoConfiguration`：

```
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
```

2、`DataSourceAutoConfiguration`类

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

```java
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
```

```yml
spring:
  autoconfigure:
    exclude:
      - org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
```



SpringBoot

SpringBoot



SpringBoot

SpringBoot



SpringBoot

SpringBoot