# SpringBoot读取配置有哪些方式？

## **口语化**

Spring Boot 读取配置的方式很多，但最常用的就这三种：

-   **@Value**（适合单个属性）
-   **@ConfigurationProperties**（适用于批量绑定）
-   **Environment**（Spring提供的，灵活但手动）

其他像 **@PropertySource**（加载外部properties文件）、**手动加载YAML**（麻烦但能救急）、**IO流硬刚**（一般不推荐）属于“备用方案”，特定场景才会用。

## @Value


**使用`@Value`注解注入配置**

-   **定位**：最常用的“单个属性注入”，适合简单场景。
-   **特点**：
    -   必须被Spring扫描（比如类上加 `@Component`）。
    -   属性不存在时可设置默认值（`@Value("${不存在:默认值}")`）。
    -   不能用在 `static` 或 `final` 字段（注入失败不报错，但值不变）。
    -   属性多时得一个个写，麻烦！

```properties
app.name=MyApp
app.version=1.0.0
```

```java
@Component // 不加注解 @Value 无效
public class AppConfig {

    @Value("${app.name:defauleName}") // 属性不存在时用默认值
    private String appName;

    @Value("${app.version}")
    private String appVersion;

    // Getters and setters
}
```

## @ConfigurationProperties

**使用`@ConfigurationProperties`注解注入配置**

-   **定位**：批量绑定配置，适合和“配置类”搭配，**开发标配**！
-   **特点**：
    -   通过 `prefix` 指定前缀，自动匹配子属性。
    -   支持类型安全（比如自动转成对象、List）。
    -   需要配合 `@EnableConfigurationProperties` 或类上加 `@Component`。

>   通常与`@EnableConfigurationProperties`注解配合使用（可以将使用@ConfigurationProperties注解对应的类加入Spring容器）
>
>   -   @ConfigurationProperties 本质就是属性注入
>   -   @ConfigurationProperties 可以为**自定义bean绑定属性**，也可以为**第三方bean绑定属性**

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

启用`@ConfigurationProperties`，不启用不生效

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

## Environment

**使用`Environment`接口获取配置**

Spring 的`Environment`接口可以用来访问配置文件中的属性

-   **定位**：通过编程方式灵活获取属性，适合动态读取。
-   **特点**：
    -   能访问所有属性源（系统变量、配置文件等）。
    -   需要手动处理类型转换（比如 `getProperty("port", Integer.class, 8080)`）

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

## @PropertySource

**使用`@PropertySource`注解加载外部配置文件**

如果需要**加载外部**的配置文件！！！

-   **定位**：加载自定义的 `properties` 文件，**不支持YAML**！
-   **特点**：
    -   默认只能加载 `.properties`，加载YAML需要魔改（后面讲）。
    -   通常和 `@Configuration` 类搭配使用

```properties
# 外部配置文件external.properties
external.property=value
```

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.beans.factory.annotation.Value;

@Configuration
@PropertySource("classpath:external.properties") // 文件放resources目录下
public class ExternalConfig {

    @Value("${external.property}")
    private String externalProperty;

    // Getter
}
```

## 手动加载YAML文件

**手动加载YAML文件**（`@PropertySource`的救急版）

-   **定位**：解决 `@PropertySource` 不能加载YAML的痛点，但步骤繁琐。
-   **步骤**：
    1.  创建 `YamlPropertiesFactoryBean` 解析YAML。
    2.  将解析结果塞进Spring环境。

```java
@Configuration
public class YamlConfig {
    @Bean
    public static PropertySourcesPlaceholderConfigurer yamlLoader() {
        YamlPropertiesFactoryBean yaml = new YamlPropertiesFactoryBean();
        yaml.setResources(new ClassPathResource("config.yml")); // 加载YAML
        Properties props = yaml.getObject();
        
        PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();
        configurer.setProperties(props);
        return configurer;
    }
}
// 之后就可以用@Value("${yaml.key}")获取了
```

## IO流

**IO流暴力读取**：最底层的方式

-   **定位**：完全脱离Spring机制，适合“非Spring环境”或特殊需求。
-   **特点**：
    -   直接用 `ClassPathResource` + `Properties` 加载。
    -   没有自动刷新，没有类型绑定，**不推荐**！

```java
public class ReadByIO {
    public void read() throws IOException {
        ClassPathResource resource = new ClassPathResource("app.properties");
        Properties props = new Properties();
        props.load(resource.getInputStream());
        String value = props.getProperty("key");
    }
}
```

## **总结：怎么选？**

-   优先用 **@ConfigurationProperties**（批量） + **@Value**（单个）。
-   动态读取用 **Environment**。
-   需要加载外部properties用 **@PropertySource**。
-   非要加载外部YAML？上 **手动解析** 或考虑把配置合并到 `application.yml`。
-   **IO流** 除非万不得已，否则别碰！

