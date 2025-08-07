# 如何在 Spring MVC 中配置静态资源？

## 描述

在 Spring MVC 中，配置**静态资源**可以让应用程序直接提供静态文件（如 HTML、CSS、JavaScript、图片等），而**不必通过控制器来处理这些请求**。

## WebMvcConfigurer接口

**方法一：使用 WebMvcConfigurer 配置静态资源路径**

Spring Boot 和 Spring MVC 提供了 WebMvcConfigurer 接口，允许你自定义静态资源的映射路径。这是最常用的方式

**1、创建配置类**

创建一个配置类并实现 WebMvcConfigurer 接口，重写 addResourceHandlers 方法来添加静态资源路径。

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 映射 /static/** 到 classpath:/static/
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
        
        // 映射 /images/** 到 file:uploads/
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:uploads/");
        
        // 可以根据需要添加更多静态资源路径
    }
}
```

**2、放置静态资源文件**

将静态资源文件放置在 src/main/resources/static/ 目录下，或者根据配置的路径放置文件。例如：

```
src/main/resources/static/css/style.css
src/main/resources/static/js/app.js
src/main/resources/static/images/logo.png
```

**3、访问静态资源**

现在你可以通过以下 URL 访问静态资源：

```
http://localhost:8080/static/css/style.css
http://localhost:8080/static/js/app.js
http://localhost:8080/images/logo.png
```


## application.properties|yml配置方式

**方法二：使用 application.properties 或 application.yml 配置**

Spring Boot 提供了内置的静态资源路径映射，可以在 application.properties 或 application.yml 文件中进行配置。

使用 application.properties

```properties
# 默认静态资源路径
spring.mvc.static-path-pattern=/static/**

# 自定义静态资源位置
spring.resources.static-locations=classpath:/static/,file:uploads/
```

使用application.yml 

```yml
spring:
  mvc:
    static-path-pattern: /static/**
  resources:
    static-locations: classpath:/static/,file:uploads/
```

## 默认静态资源路径

**方法三：使用默认静态资源路径**

Spring Boot 默认会自动扫描以下目录中的静态资源文件，并将其映射到 / 路径下：

```txt
src/main/resources/static/
src/main/resources/public/
src/main/resources/resources/
src/main/resources/META-INF/resources/
```

这意味着你可以直接将静态资源文件放在这些目录中，而无需额外配置。例如：

```txt
src/main/resources/static/css/style.css 可以通过 http://localhost:8080/css/style.css 访问。
src/main/resources/static/images/logo.png 可以通过 http://localhost:8080/images/logo.png 访问。
```


## 使用 XML配置

**方式四：使用 XML配置（适用于传统Spring MVC）**

**1、将静态资源放置在正确的位置**

首先，需要将静态资源文件放置在 Spring MVC 可以访问的目录下。通常，这些文件会被放置在 `src/main/resources/static` 或 `src/main/webapp` 目录中

**2、在 Spring MVC 配置中启用静态资源处理**

-   在 Spring MVC 的配置文件中（例如 `spring-mvc.xml`），添加以下配置来启用静态资源处理：

```xml
<mvc:resources mapping="/resources/**" location="/resources/" />
```

这段代码告诉 Spring MVC，将所有以 `/resources/` 开头的请求映射到 `src/main/resources/static` 目录下的文件。

-   在Spring Boot，可以在 `application.properties` 或 `application.yml` 文件中添加以下配置：

```properties
spring.mvc.static-path-pattern=/resources/**
```

这将启用同样的静态资源处理功能。

**3、访问静态资源**

现在可以通过在浏览器中输入 `http://localhost:8080/resources/your-static-file.html` 来访问静态资源文件。其中，`your-static-file.html` 是你放置在 `src/main/resources/static` 目录下的实际文件名

**4、自定义静态资源路径**

如果你想使用自定义的路径来访问静态资源，可以在配置中修改 `mapping` 和 `location` 属性。例如：

```xml
<mvc:resources mapping="/my-resources/**" location="/my-resources/" />
```

这将使得所有以 `/my-resources/` 开头的请求都被映射到 `src/main/resources/static/my-resources` 目录下的文件


