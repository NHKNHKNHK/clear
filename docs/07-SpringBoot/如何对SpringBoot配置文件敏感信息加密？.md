# 如何对SpringBoot配置文件敏感信息加密？

 在 Spring Boot 中对配置文件中的敏感信息（如数据库密码、API 密钥等）进行加密，可以通过以下常用方案实现

## Jasypt 库

方案一：**使用 Jasypt 库（推荐）**

**Jasypt** 是一个成熟的加密库，支持与 Spring Boot 无缝集成，直接对配置文件中的敏感信息加密。这是最常用的方案。

1、添加依赖

```xml
<!-- pom.xml -->
<dependency>
    <groupId>com.github.ulisesbocchio</groupId>
    <artifactId>jasypt-spring-boot-starter</artifactId>
    <version>3.0.5</version>
</dependency>
```

2、**生成加密后的值**：

-   使用 Jasypt 命令行工具或代码生成加密值。


命令行示例（需先下载 Jasypt JAR）：

```java
java -cp jasypt-1.9.3.jar org.jasypt.intf.cli.JasyptPBEStringEncryptionCLI \
     input="your_password" \
     password=your_secret_key \
     algorithm=PBEWithMD5AndDES
```

输出结果类似：

```
ENC(4tN4jF4wE2J6Xo5J7ZqKZw==)
```

3、**修改配置文件**：

-   将明文替换为加密值，格式为 `ENC(加密后字符串)`：

```yml
# application.yml
spring:
  datasource:
    password: ENC(4tN4jF4wE2J6Xo5J7ZqKZw==)
```

4、**设置加密密钥**：

-   通过环境变量、启动参数或配置文件传递密钥：

    ```
    # 启动命令
    java -jar app.jar -Djasypt.encryptor.password=your_secret_key
    ```

-   或配置文件配置密钥（不推荐，仅测试用）：

    ```yml
    jasypt:
      encryptor:
        password: your_secret_key
    ```

5、**自动解密**：

-   Jasypt 会自动解密 `ENC(...)` 包裹的值，无需额外代码。


## Spring Cloud Config Server 加密

方案二：**Spring Cloud Config Server 加密**

适用于微服务架构，通过配置中心统一管理加密配置


## 自定义加解密

方案三：**自定义加解密（硬核方案）**

完全手动控制加解密逻辑，适合高度定制场景

在SpringBoot项目中，我们可以**基于Spring提供的扩展点**进行手动的自动加解密。

例如：实现BeanFactoryPostProcessor（Bean工厂后置处理器），它的调用实际在所有的beanDefinition都已经放入到了map中，此时可以手动的干预进行属性的加解密

```java
@Component
public class DecryptPropertyProcessor implements BeanFactoryPostProcessor {
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) {
        ConfigurableEnvironment env = beanFactory.getBean(ConfigurableEnvironment.class);
        String encryptedPassword = env.getProperty("spring.datasource.password");
        String decryptedPassword = decrypt(encryptedPassword); // 自定义解密逻辑
        Properties props = new Properties();
        props.put("spring.datasource.password", decryptedPassword);
        env.getPropertySources().addFirst(new PropertiesPropertySource("custom", props));
    }
}
```

 