# SpringBoot加载配置application.yml的过程与原理

Spring Boot在启动时会加载`application.yml`文件，这个过程涉及到几个关键组件和步骤。下面详细解释这一过程及其背后的原理：

### 1. Spring Boot的自动配置机制

Spring Boot的核心特性之一是其自动配置（Auto-configuration）。当项目包含特定的库依赖时，Spring Boot能够根据这些依赖自动配置相应的功能。例如，如果项目中包含了spring-boot-starter-web依赖，Spring Boot会自动配置嵌入式Tomcat服务器、默认的Servlet等Web相关的设置。

### 2. YamlPropertySourceLoader

Spring Boot使用YamlPropertySourceLoader来加载YAML格式的配置文件。这个类是org.springframework.boot.env包下的一个内部工具类，它负责将YAML文件的内容转换为Properties对象，以便后续处理。

### 3. Environment接口

Spring框架中的Environment接口用于封装应用程序的环境信息，包括但不限于属性值。Spring Boot通过实现该接口的ConfigurableEnvironment子类来管理环境变量和配置源。

### 4. PropertySourcesPlaceholderConfigurer

这是一个BeanPostProcessor的实现，它在bean初始化前后调用后置处理器以替换@Value注解中占位符的值。这对于从环境中解析


## SpringBoot何时加载配置文件


## SpringBoot加载配置文件时，不同位置及不同格式的配置文件是如何加载

## SpringBoot的profile文件是如何加载的（如application-dev.yml）

## 不同位置的配置文件配置了相同的属性时，如何加载

## 不同位置的配置文件，设置了不同属性时，后加载的文件是否会生效