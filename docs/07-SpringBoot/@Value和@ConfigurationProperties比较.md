# @Value和@ConfigurationProperties比较


`@Value`和`@ConfigurationProperties`是 Spring Boot 中两种常用的注入配置属性的方法。它们各自有不同的使用场景和优缺点。

## `@Value`注解

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

## `@ConfigurationProperties`注解

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

## 使用场景

**使用**`@Value`：

需要注入单个或少量的配置属性。

需要使用 Spring 表达式语言进行复杂的计算或操作。

快速简单的配置注入。

**使用**`@ConfigurationProperties`：

需要注入一组相关的配置属性。

需要类型安全性和自动类型转换。

需要使用嵌套属性和复杂的配置结构。

需要更好的可测试性。

