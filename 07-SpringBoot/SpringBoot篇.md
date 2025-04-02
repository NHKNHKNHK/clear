## 什么是SpringBoot？

SpringBoot是由Pivotal团队提供的全新框架，其设计的目的是用来**简化Spring应用的初始搭建以及开发过程**

**Spring程序的缺点**

-   依赖设置繁琐（还可能会遇到依赖冲突，SpringBoot中维护着一套自己的依赖版本）
-   配置繁琐（SpringBoot中存在大量的默认配置）

**SpringBoot程序的优点**

-   **起步依赖**（简化依赖配置，它帮我们同一管理了依赖的版本）
-   **自动配置**（简化常用工程相关配置）
-   **辅助功能**（内置服务器，.......）

## SpringBoot优点的体现

### parent

-   开发SpringBoot程序要继承spring-boot-starter-parent
-   spring-boot-starter-parent中定义了若干个依赖管理（简单来说就是所有依赖的version）
-   继承parent模块可以**避免**多个依赖使用相同技术时出现**依赖版本冲突**
-   继承parent的形式也可以采用引入依赖的形式实现效果
    -   采用阿里云的SpringBoot模板创建就是引入依赖 spring-boot-starter-parent 来实现的

### starter

-   开发SpringBoot程序需要导入坐标时通常导入对应的starter
-   每个不同的starter根据功能不同，通常包含多个依赖坐标
-   使用starter可以实现快速配置的效果，达到**简化配置**的目的

**辨析 starter 与 parent**

-   starter
    -   SpringBoot中常见项目名称，定义了当前项目使用的所有依赖坐标，以达到**减少依赖配置**的目的
-   parent
    -   所有SpringBoot项目要继承的项目，定义了若干个坐标版本号（依赖管理，而非依赖），以达到**减少依赖冲突** 的目的spring-boot-starter-parent各版本间存在着诸多坐标版本不同
-   实际开发
    -   使用任意坐标时，仅书写GAV中的G和A，V由SpringBoot提供，除非SpringBoot未提供对应版本V
    -   如发生坐标错误，再指定Version（要小心版本冲突）

### 内嵌tomcat

-   内嵌Tomcat服务器是SpringBoot辅助功能之一
-   内嵌Tomcat工作原理是将Tomcat服务器作为对象运行，并将该对象交给Spring容器管理
-   变更内嵌服务器思想是去除现有服务器，添加全新的服务器

如何更改SpringBoot程序的服务器，举例如下：

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

说明： Jetty比Tomcat更轻量级，可扩展性更强（相较于Tomcat），谷歌应用引擎（GAE）已经全面切换为Jetty SpringBoot内置服务器

-   Tomcat（默认）
    -   apache出品，粉丝多，应用面广，负载了若干较重的组件
-   Jetty
    -   **更轻量级**，负载性能远不及tomcat
-   undertow
    -   负载性能勉强跑赢tomcat



## SpringBoot特点

-   遵 “**约定优于配置** 的原则，只需要很少的配置或使用默认的配置。
-   能够使用内嵌的Tomcat、Jetty等服务器，不需要部署war文件。
-   提供定制化的启动器Starters，简化Maven配置，开箱即用。
-   纯Java配置，没有代码生成，也不需要XML配置。
-   提供了生产级的服务监控方案，如安全监控、应用监控、健康检测等



## SpringBoot的核心特性？



## 什么是Spring Initializr？



## SpringBoot启动过程？

1、引导类初始化：应用从main方法开始，调用SpringApplication.run()方法，创建一个SpringApplication实例

2、环境准备：SpringApplication通过prepareEnvironment()方法加载配置文件（如application.properties或application.yml），并创建Environment对象，设置系统变量和属性源

3、上下文创建：createApplicationContext()创建应用上下文（如）

4、启动监听器

5、Bean加载与注册

6、嵌入式服务启动

7、运行启动器与命名行运行器

8、启动完成



## 你在使用SpringBoot时如何固定版本的？

在 Spring Boot 项目中，固定版本主要是为了确保项目依赖的库版本一致，避免因版本不一致导致的兼容性问题。



**使用`spring-boot-starter-parent`** 

使用spring-boot-starter-parent是最常见的方法之一。它不仅提供了一组默认的依赖版本，还包括了一些有用的插件配置。

你可以在pom.xml中指定 Spring Boot 的版本：

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.5</version> <!-- 这里指定了Spring Boot的版本 -->
    <relativePath/> <!-- lookup parent from repository -->
</parent>
```

这样，所有 Spring Boot 相关的依赖都会使用这个版本中定义的版本号。



**使用`dependencyManagement`管理依赖版本**

如果你不想使用`spring-boot-starter-parent`作为父 POM，或者你的项目已经有了其他的父 POM，你可以使用`dependencyManagement`来管理依赖版本。这样可以手动指定各个依赖的版本：

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>2.7.5</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

  然后在你的`dependencies`部分添加具体的依赖时，不需要再指定版本号：

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <!-- 其他依赖 -->
</dependencies>
```



**手动指定依赖版本**

如果你希望完全控制所有依赖的版本，可以手动在`dependencies`部分指定每个依赖的版本号：

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <version>2.7.5</version>
    </dependency>
    <!-- 其他依赖 -->
</dependencies>
```

这种方法虽然灵活，但需要手动管理每个依赖的版本，比较繁琐，且容易出错。



**使用 BOM**

Spring Boot 提供了一个 BOM（Bill of Materials），可以用来统一管理依赖的版本。

你可以在`dependencyManagement`中引入 Spring Boot 的 BOM：

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>2.7.5</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

然后在`dependencies`部分添加具体的依赖时，不需要再指定版本号：

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <!-- 其他依赖 -->
</dependencies>
```



**结论**

最推荐的方法是使用`spring-boot-starter-parent`或者`dependencyManagement`来管理依赖版本，这样可以减少手动管理版本的工作量，并且更容易保持依赖的一致性



## SpringBoot是如何通过main方法启动web项目的？



## @SpringBootApplication注解

@SpringBootApplication注解是作用于SpringBoot程序的启动类上

它是@SpringBootConfiguration、@EnableAutoConfiguration、@ComponentScan三个注解的复合注解

-   `@SpringBootConfiguration`：表示当前类是一个配置类。
-   `@EnableAutoConfiguration`：启用 Spring Boot 的自动配置机制，根据类路径中的依赖自动配置 Spring 应用程序。
-   `@ComponentScan`：自动扫描并注册带有 `@Component` 注解的类为 Spring Bean，通常会扫描当前包及其子包下的所有组件



## @ConfigurationProperties注解的作用？





## SpringBoot支持嵌入哪些Web容器？

Spring Boot 支持嵌入式的 Web 容器，总的分为 **Servlet Web 容器** 和 **Reactive Web 容器** 两大类：

**Servlet Web 容器**

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



**Reactive Web 容器**

这些容器基于响应式编程模型，适用于非阻塞式 I/O 模型。

-   Netty
    -   Spring Boot 的 Reactive 编程模型（如 `WebFlux`）默认使用的容器。
    -   轻量级，专注于高性能和低延迟。



**如何选择容器？**

-   如果使用传统的 Spring MVC（基于 Servlet），可以选择 **Tomcat**、**Jetty** 或 **Undertow**。
-   如果使用响应式编程模型（如 `WebFlux`），推荐使用 **Netty**。



**配置方式**

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



**总结**

Spring Boot 默认使用 **Tomcat** 作为嵌入式 Web 容器，但也支持 **Jetty**、**Undertow** 和 **Netty**，开发者可以根据具体需求选择合适的容器。





## SpringBoot中application.properties、application.yaml、application.yml的区别？

在 Spring Boot 中，`application.properties` 和 `application.yaml`（或 `application.yml`）都是用于配置应用程序属性的文件，但它们在语法和使用方式上有一些区别。

-   **application.properties**
    -   使用键值对的形式，每行一个配置项。
    -   格式简单，适合快速编写和阅读。
-   **application.yaml / application.yml**
    -   使用 YAML 格式，支持嵌套结构。
    -   更加直观地表达层级关系，适合复杂的配置场景。



**配置文件加载的优先级从高到低**：

-   **application.properties**（传统格式/默认格式）

例如：

```properties
server.port=80
```

-   **application.yml**（主流格式）

例如：

```yml
server:
  port: 80
```

-   **application.yaml**

例如：

```yaml
server:
  port: 80
```

说明：

​	不同配置文件中**相同的配置按照加载优先级相互覆盖，不同配置文件中不同配置完全保留**

| 特性           | `application.properties`   | `application.yaml` / `application.yml` |
| :------------- | :------------------------- | :------------------------------------- |
| **语法简洁性** | 简单易用，适合小型项目     | 层级结构清晰，适合复杂配置             |
| **可读性**     | 平坦结构，可能显得冗长     | 嵌套结构，更直观                       |
| **维护成本**   | 修改方便，但层级关系不明显 | 层级关系明确，但需要注意缩进           |
| **兼容性**     | 被广泛支持                 | 需要解析器支持                         |

>   扩展
>
>   **属性提示失效解决方案**
>
>   在IDEA中，在配置文件中编写属性时会智能提示，这是IDEA为我们做的，但是在yaml中编写属性是智能提示会失效，因为IDEA认为yaml不是配置文件 
>
>   解决思路： 让IDEA识别出 yaml 格式的文件是配置文件
>
>   解决方案： 点击File ==> Project Structure.. ==> Facets ==> 找到相应工程 ==> 点击SpringBoot的图标(一般是小绿叶) ==> 点击加号➕ ==> 在src/main/resources目录中将想要识别为配置文件的文件选择（这里是yaml） ==> 点击OK
>
>   新版IDEA不必这么麻烦，它直接会自动使用 yaml 格式的文件为配置文件



## 如何在SpringBoot在定义和读取自定义配置？



## SpringBoot配置文件加载优先级？



## SpringBoot打成的jar包与普通jar的区别？



## SpringBoot是否可以使用xml配置？



## 如何处理SpringBoot中的全局异常？



## SpringBoot默认同时可以处理的最大连接数？



## 如何理解SpringBoot中的starter？



## 如何自定义SpringBoot中的starter？



## SpringBoot处理处理跨域请求（CORS）？

>   参考
>
>   ​	[如何在 Spring MVC 中实现跨域资源共享（CORS）](../06-SpringMVC/SpringMVC篇.md)
>



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





## SpringBoot配置文件注入？

在 Spring Boot 配置文件用于定义应用程序的各种配置参数。Spring Boot 支持多种配置文件格式，包括`application.properties`和`application.yml`。通过配置文件注入，可以方便地将配置参数注入到 Spring Bean 中，从而使应用程序更加灵活和易于管理。（**避免硬编码**）

**使用`@Value`注解注入配置**

`@Value`注解可以直接将配置文件中的值注入到 Spring Bean 的字段中

```properties
app.name=MyApp
app.version=1.0.0
```

```java
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AppConfig {

    @Value("${app.name}")
    private String appName;

    @Value("${app.version}")
    private String appVersion;

    // Getters and setters
}
```

**使用`@ConfigurationProperties`注解注入配置**

`@ConfigurationProperties`注解可以将配置文件中的属性映射到一个 Java Bean 中。

通常与`@EnableConfigurationProperties`注解配合使用（可以将使用@ConfigurationProperties注解对应的类加入Spring容器）

-   @ConfigurationProperties 本质就是属性注入
-   @ConfigurationProperties 可以为**自定义bean绑定属性**，也可以为**第三方bean绑定属性**

```yml
app:
  name: MyApp
  version: 1.0.0
```

```java
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app") // 指定配置项的前缀
public class AppProperties {

    private String name;
    private String version;

    // Getters and setters
}
```

启用@ConfigurationProperties

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

**使用`Environment`接口获取配置**

Spring 的`Environment`接口可以用来访问配置文件中的属性

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class AppConfig {

    @Autowired
    private Environment env;

    public String getAppName() {
        return env.getProperty("app.name");
    }

    public String getAppVersion() {
        return env.getProperty("app.version");
    }
}
```

**使用`@PropertySource`注解加载外部配置文件**

如果需要**加载外部**的配置文件，可以使用`@PropertySource`注解。

```properties
外部配置文件external.properties

external.property=value
```

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.beans.factory.annotation.Value;

@Configuration
@PropertySource("classpath:external.properties")
public class ExternalConfig {

    @Value("${external.property}")
    private String externalProperty;

    // Getter
}
```



## @Value和@ConfigurationProperties比较

`@Value`和`@ConfigurationProperties`是 Spring Boot 中两种常用的注入配置属性的方法。它们各自有不同的使用场景和优缺点。

`@Value`注解

优点：

-   **简单直接**：`@Value`注解非常简单，适合注入单个属性
-   **灵活性高**：可以直接在字段、方法参数或构造函数参数上使用

-   **支持 SpEL**：`@Value`注解支持 Spring 表达式语言（SpEL），可以进行复杂的表达式计算

缺点：

-   **不支持批量注入**：对于一组相关的配置属性，需要逐个使用`@Value`注解，代码会显得冗长
-   **类型安全性差**：`@Value`注解注入的属性是字符串，需要手动进行类型转换，容易出错

```properties
app.name=MyApp
app.version=1.0.0
```

```java
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AppConfig {

    @Value("${app.name}")
    private String appName;

    @Value("${app.version}")
    private String appVersion;

    // Getters and setters
}
```

`@ConfigurationProperties`注解

优点

-   **支持批量注入**：可以将一组相关的配置属性映射到一个 Java Bean 中，代码更加整洁。
-   **支持属性名宽松绑定**：配置文件中属性名支持驼峰模式、下划线模式、全小写模式、常量模式、中划线默认（**SpringBoot官方推荐的模式**）

-   **类型安全**：`@ConfigurationProperties`注解会自动进行类型转换，提供更好的类型安全性。

-   **易于测试**：配置类是普通的 POJO，更加容易进行单元测试。

-   **支持嵌套属性**：可以将复杂的配置结构映射到嵌套的 Java Bean 中。例如Map、List、Set以及对象等
    -   @Value：只支持基本数据类型的封装，例如：字符串、布尔值、整数等类型

缺点：

-   **需要更多的配置**：相比@Value注解，@ConfigurationProperties需要更多的配置和初始化步骤。
-   **不支持 SpEL**：不能直接使用 Spring 表达式语言进行复杂的表达式计算。

```yml
app:
  name: MyApp
  version: 1.0.0
```

```java
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private String name;
    private String version;

    // Getters and setters
}
```

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

使用场景：

**使用**`@Value`：

需要注入单个或少量的配置属性。

需要使用 Spring 表达式语言进行复杂的计算或操作。

快速简单的配置注入。

**使用**`@ConfigurationProperties`：

需要注入一组相关的配置属性。

需要类型安全性和自动类型转换。

需要使用嵌套属性和复杂的配置结构。

需要更好的可测试性。





## 谈谈你对SpringBoot约定优于配置的理解？

>   大白话就是在SpringBoot中通过约定优于配置这个思想，可以让我们少写很多的配置，然后就只需要关注业务代码的编写就行。

首先， 约定优于配置是一种软件设计的范式，它的核心思想是减少软件开发人员对于配置项的维护，从而让开发人员更加聚焦在业务逻辑上

Spring Boot就是约定优于配置这一理念下的产物，它类似于Spring框架下的一个脚手架，通过Spring Boot，我们可以快速开发基于Spring生态下的应用程序。

基于传统的Spring框架开发web应用，我们需要做很多和业务开发无关并且只需要做一次的配置，比如

1.  管理jar包依赖
2.  web.xml维护
3.  Dispatch-Servlet.xml配置项维护
4.  应用部署到Web容器
5.  第三方组件集成到Spring IOC容器中的配置项维护

而在Spring Boot中，我们不需要再去做这些繁琐的配置，Spring Boot已经自动帮我们完成了，这就是约定由于配置思想的体现。

Spring Boot约定优于配置的体现有很多，比如

1.  Spring Boot Starter启动依赖，它能帮我们管理所有jar包版本
2.  如果当前应用依赖了spring mvc相关的jar，那么Spring Boot会自动内置Tomcat容器来运行web应用，我们不需要再去单独做应用部署。
3.  Spring Boot的自动装配机制的实现中，通过扫描约定路径下的spring.factories文件来识别配置类，实现Bean的自动装配。
4.  默认加载的配置文件application.properties、application.yml等等。

总的来说，约定优于配置是一个比较常见的软件设计思想，它的核心本质都是为了更高效以及更便捷的实现软件系统的开发和维护。



SpringBoot



SpringBoot

SpringBoot