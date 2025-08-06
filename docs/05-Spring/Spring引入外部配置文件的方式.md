# Spring引入外部配置文件的方式

Spring引入外部配置文件的方式主要有：

XML配置方式

-   使用PropertyPlaceholderConfigurer Bean，在XML中配置，指定location。

-   使用context命名空间的property-placeholder元素，在XML中配置，指定location

Java注解方式

-   在Java配置中使用@PropertySource注解，结合Environment或@Value使用。

-   Spring Boot中的默认配置文件，自动加载

在微服务的情况下，可以配合spring cloud config 或者是 nacos 来引入相关的配置属性



## **使用 PropertyPlaceholderConfigurer**

在XML中显式配置一个Bean，加载外部属性文件

```xml
<bean class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
    <property name="location" value="classpath:config.properties"/>
    <!-- 加载多个文件 -->
    <!-- <property name="locations">
        <list>
            <value>classpath:db.properties</value>
            <value>classpath:app.properties</value>
        </list>
    </property> -->
</bean>
```



## **使用 context:property-placeholder 命名空间**

通过Spring的`context`命名空间简化配置

这种方式通常用于传统Spring项目中，它允许开发者在XML配置文件中指定外部属性文件的路径，并在其他配置中通过${propertyKey}的形式引用这些属性。

```xml
<!-- 加载单个文件 -->
<context:property-placeholder location="classpath:config.properties"/>

<!-- 加载多个文件或通配符 -->
<!-- <context:property-placeholder location="classpath:*.properties, file:/opt/config/app.properties"/> -->

<!-- 数据源示例 -->
<bean id="dataSource" class="org.apache.commons.dbcp2.BasicDataSource">
    <property name="url" value="${jdbc.url}"/>
    <property name="username" value="${jdbc.username}"/>
    <property name="password" value="${jdbc.password}"/>
</bean>
```


## **使用 @PropertySource 注解**

这种方式适用于Spring 3.1及以上版本，它使得配置更加灵活和模块化

```java
@Configuration
@PropertySource("classpath:config.properties")
// 加载多个文件或忽略未找到的文件
// @PropertySource({"classpath:db.properties", "file:/opt/config/app.properties"})
// @PropertySource(value = "classpath:optional.properties", ignoreResourceNotFound = true)
public class AppConfig {
    
    @Autowired
    private Environment env; // 通过Environment获取属性
    
    @Bean
    public DataSource dataSource() {
        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setUrl(env.getProperty("jdbc.url"));
        dataSource.setUsername(env.getProperty("jdbc.username"));
        dataSource.setPassword(env.getProperty("jdbc.password"));
        return dataSource;
    }
    
    // 若使用@Value，需启用占位符解析
    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }
}
```



## **Spring Boot自动配置**

Spring Boot默认加载`application.properties`或`application.yml`文件（位于`src/main/resources`或类路径根目录），无需显式配置。

此外，还可以在启动时通过命令行参数、环境变量或配置文件外部化配置（如--spring.config.location）来指定外部配置文件的路径。

```properties
# application.properties
jdbc.url=jdbc:mysql://localhost:3306/mydb
jdbc.username=root
jdbc.password=secret
```

在代码中通过`@Value`或`@ConfigurationProperties`注入属性：

```java
@Component
public class DatabaseConfig {
    
    @Value("${jdbc.url}")
    private String url;
    
    @Value("${jdbc.username}")
    private String username;
    
    // Getters and setters
}

// 或使用类型安全绑定
@ConfigurationProperties(prefix = "jdbc")
public class JdbcProperties {
    private String url;
    private String username;
    // Getters and setters
}
```



## **多环境配置**

结合`Profile`按环境加载不同配置文件：

1）**XML方式**

```xml
<beans profile="dev">
    <context:property-placeholder location="classpath:dev.properties"/>
</beans>
<beans profile="prod">
    <context:property-placeholder location="classpath:prod.properties"/>
</beans>
```

2）**Spring Boot方式**

创建`application-dev.properties`和`application-prod.properties`，通过启动参数激活：

```
java -jar app.jar --spring.profiles.active=prod
```



## **使用Spring Cloud Config**

对于分布式系统，Spring Cloud Config提供了一种集中管理配置的方式。它允许开发者将配置信息存储在Git、SVN等版本控制系统中，并通过一个配置服务器来提供配置信息给客户端。

客户端在启动时会从配置服务器拉取配置信息，并根据需要更新自己的配置。这种方式非常适合于微服务架构下的配置管理。
