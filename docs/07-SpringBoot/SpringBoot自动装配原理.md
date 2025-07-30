# SpringBoot自动装配原理？

## **口语化**

SpringBoot的自动配置核心靠的是一个注解**`@EnableAutoConfiguration`**，它其实就是导入了一个类，`AutoConfigurationImportSelector`。这个类会通过`SpringFactoriesLoader`去扫描项目中所有依赖包下的`META-INF/spring.factories`文件。

这个文件里一般会列了一大堆配置类，如DataSourceAutoConfiguration、WebMvcAutoConfiguration之类的

SpringBoot启动时，会将这些类**按需加载**进来

>   **为什么是按需？**
>
>   因为这些类通常都配了各种条件注解
>
>   比如
>
>   `@ConditionalOnClass`，会根据你依赖中是否有这个类决定是否加载。
>
>   `@ConditionalOnMissingBean`，如果没有配置，才会加载
>
>   `@ConditionalOnProperty`，配置文件里配置了特定的属性，才加载

我们可以理解为，SpringBoot启动时一边查阅`META-INF/spring.factories`文件，一边像一个私家侦探一样，查阅条件是否符合，符合才配置。这就是SpringBoot开箱即用，但灵活可控的核心逻辑。

说到底，SpringBoot不是全自动，而是有条件的自动。

总结一下，SpringBoot的自配装配原理就是：`@EnableAutoConfiguration`注解+`META-INF/spring.factories`文件+一堆Conditional条件注解共同实现。



## **源码**

在我们编写的SpringBoot启动类上的`@SpringBootApplication`注解其实是一个组合注解，里面包含了`@EnableAutoConfiguration`注解，而`@EnableAutoConfiguration`注解里面就import了`AutoConfigurationImportSelector`。如下：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {
    
}
```

而`AutoConfigurationImportSelector`类中有500多行代码，它的核心作用就是通过`SpringFactoriesLoader`从`META-INF/spring.factories`文件中加载配置类

```java
/**
 * 返回应考虑的自动配置类名称。默认情况下，该方法会使用
 * {@link SpringFactoriesLoader} 和 {@link #getSpringFactoriesLoaderFactoryClass()}
 * 来加载候选配置。
 * 
 * @param metadata 源元数据
 * @param attributes 注解属性（来自 {@link #getAttributes(AnnotationMetadata)}）
 * @return 候选配置的列表
 */
protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, AnnotationAttributes attributes) {
    List<String> configurations = SpringFactoriesLoader.loadFactoryNames(getSpringFactoriesLoaderFactoryClass(),
				getBeanClassLoader());
    Assert.notEmpty(configurations, "No auto configuration classes found in META-INF/spring.factories. If you "
				+ "are using a custom packaging, make sure that file is correct.");
    return configurations;
}
```

而`META-INF/spring.factories`文件也比较简单，以MybatisPlus的`META-INF/spring.factories`文件举例：

```
# Auto Configure
org.springframework.boot.env.EnvironmentPostProcessor=\
  com.baomidou.mybatisplus.autoconfigure.SafetyEncryptProcessor
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
  com.baomidou.mybatisplus.autoconfigure.MybatisPlusInnerInterceptorAutoConfiguration,\
  com.baomidou.mybatisplus.autoconfigure.IdentifierGeneratorAutoConfiguration,\
  com.baomidou.mybatisplus.autoconfigure.MybatisPlusLanguageDriverAutoConfiguration,\
  com.baomidou.mybatisplus.autoconfigure.MybatisPlusAutoConfiguration,\
  com.baomidou.mybatisplus.autoconfigure.DdlAutoConfiguration
# Depends On Database Initialization Detectors
org.springframework.boot.sql.init.dependency.DependsOnDatabaseInitializationDetector=\
com.baomidou.mybatisplus.autoconfigure.MybatisDependsOnDatabaseInitializationDetector

```

它其实就是一堆的k-v结构，随便查看一个，如`DdlAutoConfiguration`，就可以看到各种的条件注解，控制bean的加载时机，如何配置bean等

```java
@ConditionalOnClass({IDdl.class})
@Configuration(
    proxyBeanMethods = false
)
public class DdlAutoConfiguration {
    public DdlAutoConfiguration() {
    }

    @Bean
    @Order
    @ConditionalOnBean({IDdl.class})
    @ConditionalOnMissingBean({DdlApplicationRunner.class})
    public DdlApplicationRunner ddlApplicationRunner(List<IDdl> ddlList) {
        return new DdlApplicationRunner(ddlList);
    }
}
```



## **SpringBoot 3.x**