什么是Restful风格？

## Spring MVC 与 Spring Boot 有什么区别？

**SpringMVC**

SpringMVC是一个基于模型-视图-控制器（MVC）设计模式的 Web 应用程序框架。它提供了一种灵活的方式来构建 Web 应用程序，主要关注于处理 HTTP 请求和生成响应。Spring MVC 的核心是 DispatcherServlet，它负责将请求路由到相应的控制器，并将控制器返回的视图转换为适当的响应格式。

特点：

-   提供了一个清晰的分层结构，明确区分了模型、视图和控制器的职责。

-   支持多种视图技术，包括 JSP、FreeMarker、Velocity 和 Thymeleaf 等。

-   允许使用注解来简化控制器的编写，例如 @Controller、@RequestMapping 和 @RequestParam 等。

-   可以与其他 Spring Framework 组件无缝集成，例如 Spring Security 和 Spring Data。

**SpringBoot**

Spring Boot 是一个开箱即用的框架，旨在简化新 Spring 基于应用程序的初始搭建和开发。它提供了一系列的默认配置和自动化机制，帮助开发者更快速地创建生产级别的 Spring 应用程序。Spring Boot 不仅包含了 Spring MVC，还包括了许多其他的 Spring Framework 组件和第三方库。

特点：

-   内置了一个 Tomcat 服务器，可以轻松地启动和运行应用程序。

-   通过 starter 依赖项简化了配置和依赖管理，例如 spring-boot-starter-web。

-   提供了许多自动化配置和约定优于配置的特性，使得开发者可以专注于业务逻辑而不是基础设施。

-   支持多种开发工具和 IDE，例如 Spring Initializr 和 Spring Tool Suite。

-   可以生成可执行的 JAR 文件，方便部署和运行

**区别**

-   **范围不同**：Spring MVC 是一个专门的 Web 框架，而 Spring Boot 是一个更广泛的应用程序框架，涵盖了多个领域，包括 Web、数据访问、安全性等。

-   **配置方式不同**：Spring MVC 需要手动配置许多组件和依赖项，而 Spring Boot 提供了默认配置和自动化机制，减少了配置工作。

-   **项目结构不同**：Spring Boot 项目通常有一个更简单的结构，所有的组件和依赖项都集中在一起。

-   **目标不同**：Spring MVC 主要关注于构建 Web 应用程序的核心功能，而 Spring Boot 旨在简化整个应用程序的开发和部署过程

Spring MVC 是一个专注于 Web 开发的框架，而 Spring Boot 是一个更全面的框架，旨在简化整个应用程序的开发和部署



## 说说你对SpringMVC的理解？



## 简述SpringMVC核心组件？

**组件**

Spring MVC是一个基于Java的实现了MVC设计模式的**请求驱动**类型的轻量级Web框架，它大量使用了Spring框架中提供的设计模式。Spring MVC框架的核心组件包括：

1.  DispatcherServlet：前端控制器，负责接收请求并根据映射关系调用相应的控制器。
2.  HandlerMapping：负责根据请求的URL到HandlerMapping中找到映射的处理器（Controller）。
3.  HandlerAdapter：负责根据处理器，生成处理器适配器，通过适配器调用实际的处理器。
4.  Controller：处理器，执行相应的业务逻辑操作，并返回ModelAndView对象。
5.  ModelAndView：包含了视图逻辑名和模型数据的对象，是连接控制器和视图的桥梁。
6.  ViewResolver：负责解析视图名到具体视图实现类的映射，根据视图名称找到对应的视图实现类。
7.  View：视图，负责渲染数据并展示给用户。



## SpringMVC具体的工作原理和执行流程？

![](./assets/SpringMVC工作流程.png)

**组件**

Spring MVC是一个基于Java的实现了MVC设计模式的**请求驱动**类型的轻量级Web框架，它大量使用了Spring框架中提供的设计模式。Spring MVC框架的核心组件包括：

1.  DispatcherServlet：前端控制器，负责接收请求并根据映射关系调用相应的控制器。
2.  HandlerMapping：负责根据请求的URL到HandlerMapping中找到映射的处理器（Controller）。
3.  HandlerAdapter：负责根据处理器，生成处理器适配器，通过适配器调用实际的处理器。
4.  Controller：处理器，执行相应的业务逻辑操作，并返回ModelAndView对象。
5.  ModelAndView：包含了视图逻辑名和模型数据的对象，是连接控制器和视图的桥梁。
6.  ViewResolver：负责解析视图名到具体视图实现类的映射，根据视图名称找到对应的视图实现类。
7.  View：视图，负责渲染数据并展示给用户。

**执行流程**

Spring MVC 的**执行流程**大致可以分为以下几个步骤：

-   1、发送请求到DispatcherServlet：用户向服务器发送请求，请求被DispatcherServlet捕获。

-   2、查找Handler：DispatcherServlet根据请求URL到**HandlerMapping中查找映射的处理器**（Controller）
    -   HandlerMapping找到具体的处理器（可以根据xml配置、注解进行查找），生成处理器及处理器拦截器（如果有则生成）一并返回给DispatcherServlet

-   3、调用HandlerAdapter：DispatcherServlet根据处理器，到HandlerAdapter中找到对应的处理器适配器。

-   4、执行Controller：处理器适配器（HandlerAdapter）调用实际的处理器（Controller）执行业务逻辑操作，并返回ModelAndView对象。

-   5、处理ModelAndView：DispatcherServlet根据ModelAndView中的视图名称，到ViewResolver中找到对应的视图实现类。

-   6、渲染视图：视图实现类根据ModelAndView中的数据和视图模板渲染视图。

-   7、返回响应到客户端：DispatcherServlet将渲染后的视图返回给客户端。



## 解释 Spring MVC 的工作原理？

Spring MVC 的工作原理基于 Model-View-Controller（MVC）设计模式，旨在将应用程序的业务逻辑、用户界面和数据分离开来。

-   **用户请求**

用户通过浏览器发送 HTTP 请求到服务器。例如，用户访问 `http://example.com/hello`。

-   **前端控制器（DispatcherServlet）**

Spring MVC 的核心组件 `DispatcherServlet` 充当前端控制器，它拦截所有进入的 HTTP 请求。`DispatcherServlet` 在 `web.xml` 文件中配置，负责初始化 Spring MVC 的上下文环境

```xml
<servlet>
    <servlet-name>dispatcher</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <load-on-startup>1</load-on-startup>
</servlet>
<servlet-mapping>
    <servlet-name>dispatcher</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>
```

-   **处理器映射（Handler Mapping）**

`DispatcherServlet` 接收到请求后，会根据请求 URL 通过处理器映射（Handler Mapping）找到相应的控制器（Controller）。处理器映射是由 `HandlerMapping` 接口实现的，常见的实现包括 `RequestMappingHandlerMapping`，它会扫描控制器中的 `@RequestMapping` 注解。

```java
@Controller
public class HelloController {
    @RequestMapping("/hello")
    public ModelAndView helloWorld() {
        String message = "Hello, Spring MVC!";
        return new ModelAndView("hello", "message", message);
    }
}
```

-   **控制器处理**

找到相应的控制器后，`DispatcherServlet` 调用控制器的方法处理请求。控制器执行业务逻辑，通常会调用服务层或数据访问层获取数据，并将数据封装到模型中。

```java
@Controller
public class HelloController {
    @RequestMapping("/hello")
    public ModelAndView helloWorld() {
        String message = "Hello, Spring MVC!";
        return new ModelAndView("hello", "message", message);
    }
}
```

-   **视图解析器（View Resolver）**

控制器处理完请求后，会返回一个 `ModelAndView` 对象，其中包含视图名称和模型数据。`DispatcherServlet` 使用视图解析器（View Resolver）将视图名称解析为实际的视图对象。常见的视图解析器包括 `InternalResourceViewResolver`、`ThymeleafViewResolver` 等。

```java
@Bean
public InternalResourceViewResolver viewResolver() {
    InternalResourceViewResolver resolver = new InternalResourceViewResolver();
    resolver.setPrefix("/WEB-INF/views/");
    resolver.setSuffix(".jsp");
    return resolver;
}
```

-   **视图渲染**

  视图解析器将视图名称解析为实际的视图对象后，视图对象负责将模型数据渲染为用户界面，通常是 HTML 页面。视图对象可以是 JSP、Thymeleaf 模板、FreeMarker 模板等。

```jsp
<!-- hello.jsp -->
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<body>
    <h2>${message}</h2>
</body>
</html>
```

-   **响应返回**

渲染后的视图返回给 `DispatcherServlet`，`DispatcherServlet` 将最终的响应发送回用户浏览器。用户在浏览器中看到渲染后的页面。


## 什么是 Spring MVC 的生命周期？

Spring MVC 的生命周期主要分为这几个阶段：

**初始化阶段**

Spring 容器初始化，包括加载和解析配置文件、创建 Bean 对象等。对于 Spring MVC 应用，通常需要配置 DispatcherServlet，它是 Spring MVC 的核心组件，负责接收请求、处理请求和生成响应。

**处理阶段**

当一个请求到达服务器时，`DispatcherServlet` 会根据请求的 URL 找到对应的处理器（Controller）。涉及：

- **URL匹配**：`DispatcherServlet` 会遍历所有的 `HandlerMapping`，找到能够处理当前请求的 Handler（即 Controller）。
- **解析请求参数**：如果请求中包含参数，Spring MVC 会自动将其绑定到 `@RequestParam` 或 `@PathVariable` 注解的方法参数中。
- **执行业务逻辑**：`DispatcherServlet` 会调用 Controller 的方法，执行相应的业务逻辑。
- **视图解析**：如果 Controller 方法返回一个视图名，DispatcherServlet 会根据视图名找到对应的视图解析器，并将模型数据传递给视图

**渲染阶段**

视图会根据模型数据生成最终的响应内容。Spring MVC 支持多种视图技术，包括 JSP、Thymeleaf、Freemarker 等。

**错误处理阶段**

如果在处理阶段或渲染阶段发生了错误，Spring MVC 会跳转到错误处理阶段。在这个阶段，`DispatcherServlet` 会查找并调用 `@ExceptionHandler` 注解的方法来处理异常。

**销毁阶段**

当应用程序关闭或者 Spring 容器被销毁时，所有的 Bean 对象也会被销毁。对于 Spring MVC 应用，这意味着 `DispatcherServlet` 和所有的 Controller 对象都会被销毁。



## 什么是DispatcherServlet？

`DispatcherServlet`充当前端控制器（Front Controller），负责接收所有进入的 HTTP 请求并将它们分派给适当的处理器进行处理。`DispatcherServlet` 是实现 MVC 模式的关键部分，负责协调整个请求处理流程。

**主要职责**

1.  **请求接收和分派**：拦截所有进入的 HTTP 请求并将它们分派给适当的控制器（Controller）。
2.  **处理器映射**：根据请求 URL，查找相应的处理器（通常是控制器方法）。
3.  **视图解析**：将控制器返回的视图名称解析为实际的视图对象。
4.  **请求处理**：调用处理器进行请求处理，并将处理结果封装到模型中。
5.  **视图渲染**：将模型数据传递给视图对象进行渲染，并生成最终的响应。

**工作流程**

  1. **初始化**：

在应用程序启动时，`DispatcherServlet` 被初始化。它加载 Spring 应用程序上下文，配置处理器映射、视图解析器等组件。

  2. **接收请求**：

用户通过浏览器发送 HTTP 请求到服务器。`DispatcherServlet` 拦截所有符合配置的 URL 模式的请求。

  3. **处理器映射**：

`DispatcherServlet` 使用处理器映射器（Handler Mapping）根据请求 URL 查找相应的处理器（Controller）。

  4. **调用处理器**：

找到处理器后，`DispatcherServlet` 调用处理器的方法进行请求处理。处理器执行业务逻辑，通常会调用服务层或数据访问层获取数据，并将数据封装到模型中。

  5. **视图解析**：

处理器处理完请求后，返回一个包含视图名称和模型数据的 `ModelAndView` 对象。`DispatcherServlet` 使用视图解析器（View Resolver）将视图名称解析为实际的视图对象。

  6. **视图渲染**：

视图对象负责将模型数据渲染为用户界面，通常是 HTML 页面。

  7. **响应返回**：

渲染后的视图返回给 `DispatcherServlet`，`DispatcherServlet` 将最终的响应发送回用户浏览器。



## **如何在 Spring MVC 中配置DispatcherServlet？**

配置 `DispatcherServlet` 通常有两种方式：基于 XML 配置和基于 Java 配置（也称为 Java Config 或 Java-based Configuration）。

**基于XML配置**

-   **web.xml 配置**

在传统的 Spring MVC 应用中，`DispatcherServlet` 通常是在 `web.xml` 文件中配置的

```xml
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee 
                             http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd" 
         version="3.1">
    
    <servlet>
        <servlet-name>dispatcher</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <load-on-startup>1</load-on-startup>
    </servlet>
    
    <servlet-mapping>
        <servlet-name>dispatcher</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
    
</web-app>
```

`<servlet>` 元素定义了一个名为 `dispatcher` 的 `DispatcherServlet` 实例。

`<load-on-startup>` 元素指定了 `DispatcherServlet` 应该在应用启动时加载。

`<servlet-mapping>` 元素将所有请求（`/`）映射到 `DispatcherServlet`。

-   **Spring 配置文件（如 spring-servlet.xml）**

`DispatcherServlet` 会加载一个 Spring 配置文件，该文件的名称通常是 `[servlet-name]-servlet.xml`，例如 `dispatcher-servlet.xml`。这个文件包含 Spring MVC 的具体配置，如视图解析器、控制器扫描等：

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans 
                           http://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <!-- 启用注解驱动的控制器 -->
    <context:component-scan base-package="com.example" />
    <mvc:annotation-driven />
    
    <!-- 配置视图解析器 -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/views/" />
        <property name="suffix" value=".jsp" />
    </bean>
    
</beans>
```

**基于Java配置**

Spring 提供了基于 Java 配置的方式来配置 `DispatcherServlet`，这通常是在不使用 `web.xml` 的情况下进行的（例如，使用 Spring Boot 或者 Spring 的 Java Config）。

-   **Web 应用初始化类**

创建一个类来替代 web.xml，实现 WebApplicationInitializer 接口：

```java
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

public class MyWebAppInitializer implements WebApplicationInitializer {

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        context.register(WebConfig.class);
        
        DispatcherServlet dispatcherServlet = new DispatcherServlet(context);
        ServletRegistration.Dynamic registration = servletContext.addServlet("dispatcher", dispatcherServlet);
        registration.setLoadOnStartup(1);
        registration.addMapping("/");
    }
}
```

-   **Spring 配置类**

创建一个 Java 配置类来替代 XML 配置文件：

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "com.example")
public class WebConfig implements WebMvcConfigurer {

    @Bean
    public InternalResourceViewResolver viewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/views/");
        resolver.setSuffix(".jsp");
        return resolver;
    }
}
```



## 什么是 Handler Mapping？

`Handler Mapping` 负责将 HTTP 请求映射到相应的处理器（通常是控制器方法）。当 `DispatcherServlet` 接收到一个请求时，它会使用 `Handler Mapping` 来确定哪个处理器应该处理这个请求

**主要职责**

1.  **请求映射**：根据请求的 URL、HTTP 方法、请求参数等信息，查找并确定相应的处理器。
2.  **处理器返回**：返回一个包含处理器对象和处理器拦截器链的 `HandlerExecutionChain` 对象。

**工作流程**

1.  **请求到达** `**DispatcherServlet**`：当一个 HTTP 请求到达 `DispatcherServlet` 时，它会首先交给 `Handler Mapping` 进行处理。
2.  **查找处理器**：`Handler Mapping` 根据请求的 URL、HTTP 方法等信息查找匹配的处理器。
3.  **返回处理器**：`Handler Mapping` 返回一个 `HandlerExecutionChain` 对象，其中包含处理器（通常是控制器方法）和处理器拦截器链。
4.  **处理请求**：`DispatcherServlet` 使用找到的处理器来处理请求，并生成响应。

**常见的 `Handler Mapping` 实现**

-   **`BeanNameUrlHandlerMapping`**

通过 bean 的名称来映射处理器。例如，bean 名称为 `/hello` 的处理器会处理 `/hello` 请求。

-   **`SimpleUrlHandlerMapping`**

通过显式配置的 URL 路径来映射处理器。可以在 Spring 配置文件中指定 URL 到处理器的映射关系。

-   **`DefaultAnnotationHandlerMapping`**（过时）：

通过注解（如 `@RequestMapping`）来映射处理器。在较新的 Spring 版本中被 `RequestMappingHandlerMapping` 取代。

-   **`RequestMappingHandlerMapping`**：

这是最常用的 `Handler Mapping` 实现。通过注解（如 `@RequestMapping`、`@GetMapping`、`@PostMapping` 等）来映射处理器。支持复杂的请求映射规则，包括路径变量、请求参数、请求头等。

**示例**

```java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Controller
@RequestMapping("/hello")
public class HelloController {

    @GetMapping
    public String helloWorld() {
        return "hello";
    }
}

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "com.example")
public class WebConfig implements WebMvcConfigurer {
    // 可以在这里添加其他配置
}
```

`HelloController` 类使用 `@RequestMapping` 和 `@GetMapping` 注解来定义请求映射。

`/hello` URL 会被映射到 `helloWorld` 方法。



## 什么是 Handler Adapter？

`Handler Adapter`负责将处理器（Handler）适配为具体的处理方法。`Handler Adapter` 的主要作用是根据处理器的类型和具体实现，执行相应的处理逻辑。`Handler Adapter` 是 `DispatcherServlet` 和具体处理器之间的桥梁。

**主要职责**

1.  **处理器执行**：调用处理器的方法来处理请求。
2.  **返回模型和视图**：处理完请求后，返回一个 `ModelAndView` 对象，包含视图名称和模型数据

**工作流程**

1.  **请求到达 `DispatcherServlet`**：当一个 HTTP 请求到达 `DispatcherServlet` 时，它会先通过 `Handler Mapping` 找到对应的处理器。
2.  **选择`Handler Adapter`：**`DispatcherServlet` 根据处理器的类型选择合适的 `Handler Adapter`。
3.  **执行处理器**：`Handler Adapter` 调用处理器的方法来处理请求。
4.  **返回结果**：处理完请求后，`Handler Adapter` 返回一个 `ModelAndView` 对象，`DispatcherServlet` 再根据这个对象生成最终的响应。

**常见的 `Handler Adapter` 实现**

-   **`HttpRequestHandlerAdapter`**：

用于处理实现 `HttpRequestHandler` 接口的处理器。例如实现了 `HttpRequestHandler` 接口的处理器。

-   **`SimpleControllerHandlerAdapter`**：

用于处理实现 `Controller` 接口的处理器。例如实现了 `Controller` 接口的处理器。

-   **`RequestMappingHandlerAdapter`**：

最常用的 `Handler Adapter` 实现。用于处理使用 `@RequestMapping` 注解的控制器方法。支持复杂的请求映射规则和数据绑定。

**示例**

```java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Controller
@RequestMapping("/hello")
public class HelloController {

    @GetMapping
    public ModelAndView helloWorld() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("hello");
        modelAndView.addObject("message", "Hello, World!");
        return modelAndView;
    }
}

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "com.example")
public class WebConfig implements WebMvcConfigurer {
    // 可以在这里添加其他配置
}
```

-   `HelloController` 类使用 `@RequestMapping` 和 `@GetMapping` 注解来定义请求映射。
-   `RequestMappingHandlerAdapter` 会根据注解找到 `helloWorld` 方法并执行它。
-   `helloWorld` 方法返回一个 `ModelAndView` 对象，包含视图名称和模型数据。



## 什么是 View Resolver？

`View Resolver` 负责将逻辑视图名称解析为具体的视图对象（如 JSP、Thymeleaf 模板等）。`View Resolver` 的主要作用是**根据控制器返回的视图名称，找到相应的视图资源，并将其渲染成最终的 HTML 响应。**

**主要职责**

1.  **视图名称解析**：将控制器返回的逻辑视图名称解析为具体的视图对象。
2.  **视图对象返回**：返回一个 `View` 对象，该对象可以用来渲染模型数据。

**工作流程**

1.  **控制器处理请求**：当一个 HTTP 请求到达 `DispatcherServlet` 时，它会通过 `Handler Adapter` 调用控制器的方法来处理请求。
2.  **返回视图名称**：控制器方法处理完请求后，会返回一个包含视图名称和模型数据的 `ModelAndView` 对象。
3.  **视图名称解析**：`DispatcherServlet` 使用 `View Resolver` 将逻辑视图名称解析为具体的视图对象。
4.  **渲染视图**：`View` 对象使用模型数据来渲染最终的 HTML 响应。

**常见的 `View Resolver` 实现**

-   **`InternalResourceViewResolver`**：

最常用的 `View Resolver` 实现。用于解析 JSP 文件。通过配置前缀和后缀来确定视图的实际路径。

-   **`ThymeleafViewResolver`**：

用于解析 Thymeleaf 模板文件。需要配合 Thymeleaf 模板引擎使用。

-   **`BeanNameViewResolver`**：

通过视图名称作为 bean 名称来查找视图对象。适用于视图对象作为 Spring bean 定义的情况。

-   **`XmlViewResolver`**：

通过 XML 文件配置视图名称和视图对象的映射关系。

**示例**

使用 `InternalResourceViewResolver` ：

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Bean
    public ViewResolver viewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/views/");
        resolver.setSuffix(".jsp");
        return resolver;
    }
}
```

`InternalResourceViewResolver` 被配置为视图解析器。

视图的前缀被设置为 `/WEB-INF/views/`，后缀被设置为 `.jsp`。

例如，当控制器返回视图名称 `home` 时，`InternalResourceViewResolver` 会将其解析为 `/WEB-INF/views/home.jsp`。

```java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HomeController {

    @GetMapping("/home")
    public ModelAndView home() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("home");
        modelAndView.addObject("message", "Welcome to the home page!");
        return modelAndView;
    }
}
```

-   `HomeController` 类定义了一个处理 `/home` 请求的方法。
-   该方法返回一个 `ModelAndView` 对象，其中视图名称为 `home`。
-   `InternalResourceViewResolver` 会将视图名称 `home` 解析为 `/WEB-INF/views/home.jsp`。



## SpringMVC中的视图解析器有什么用？

在SpringMVC框架中，视图解析器（View Resolver）的作用如下：

-   **视图名称解析**：控制器（Controller）处理完用户请求后，通常会返回一个逻辑视图名称。视图解析器负责将这个逻辑名称转换为实际的视图对象（如JSP、Thymeleaf模板等）。
-   **视图渲染**：根据解析出的视图对象，结合模型数据（Model），生成最终的HTML页面或其他格式的响应内容返回给客户端。
-   **支持多种视图技术**：通过配置不同的视图解析器，可以灵活地支持多种视图技术，例如JSP、FreeMarker、Velocity、Thymeleaf等。

视图解析器是SpringMVC中实现MVC设计模式的关键组件之一，它使得应用程序的视图层更加模块化和易于维护。



## Spring MVC 中的 @Controller 注解有什么作用？

`@Controller` 注解用于标记一个类作为控制器组件。控制器是处理 HTTP 请求的核心组件，它负责接收请求、处理业务逻辑并返回视图或数据响应。

**主要作用**

1.  **标识控制器类**：`@Controller` 注解告诉 Spring 该类是一个控制器，应该由 Spring 容器管理。
2.  **处理请求**：控制器类中的方法通过映射注解（如 `@RequestMapping`、`@GetMapping`、`@PostMapping` 等）处理 HTTP 请求。

**相关注解**

在 Spring MVC 中，除了 `@Controller`，还有一些常用的注解用于处理请求：

-   **`@RequestMapping`**：用于定义请求 URL 和 HTTP 方法的映射。可以应用于类级别和方法级别。

-   **`@GetMapping`、`@PostMapping`、`@PutMapping`、`@DeleteMapping`**：分别用于处理 `GET`、`POST`、`PUT`、`DELETE` 请求。是 `@RequestMapping` 的快捷方式。

-   **@RequestParam**`：用于绑定请求参数到方法参数。可以指定参数名称、是否必需以及默认值。

-   **`@PathVariable`**：用于绑定 URL 路径中的变量到方法参数。

-   **`@ModelAttribute`**：用于将请求参数绑定到模型对象，并将模型对象添加到模型中。

-   **`@ResponseBody`**：用于将方法的返回值直接作为 HTTP 响应体。常用于返回 JSON 或 XML 数据



## @RequestMapping

`@RequestMapping` 注解用于映射 HTTP 请求到处理器方法（控制器方法）上。它可以应用于类级别和方法级别，用于定义请求 URL 和 HTTP 方法的映射关系

**主要作用**

1.  **URL 映射**：将特定的 URL 映射到控制器类或方法上。
2.  **HTTP 方法映射**：指定处理请求的 HTTP 方法（如 GET、POST、PUT、DELETE 等）。
3.  **请求参数和头信息映射**：可以根据请求参数、头信息等进一步细化映射条件。

**详细用法**

-   **类级别和方法级别的结合**

`@RequestMapping` 可以同时应用于类级别和方法级别，用于构建更复杂的 URL 映射结构。

```java
@Controller
@RequestMapping("/api")
public class ApiController {

    @RequestMapping("/users")
    public String getUsers() {
        // 处理 /api/users 请求
        return "users";
    }

    @RequestMapping("/products")
    public String getProducts() {
        // 处理 /api/products 请求
        return "products";
    }
}
```

-   **指定 HTTP 方法**

可以通过 `method` 属性指定处理请求的 HTTP 方法

```java
@RequestMapping(value = "/submit", method = RequestMethod.POST)
public String handleSubmit() {
    // 处理 POST 请求 /submit
    return "submitSuccess";
}
```

-   **请求参数和头信息**

可以通过 `params` 和 `headers` 属性进一步细化映射条件。

```java
@RequestMapping(value = "/filter", params = "type=admin")
public String filterAdmin() {
    // 处理包含参数 type=admin 的请求
    return "adminPage";
}

@RequestMapping(value = "/filter", headers = "User-Agent=Mozilla/5.0")
public String filterByUserAgent() {
    // 处理包含特定 User-Agent 头信息的请求
    return "mozillaPage";
}
```

-   **消息体和内容类型**

可以通过 `consumes` 和 `produces` 属性指定请求和响应的内容类型

```java
@RequestMapping(value = "/json", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
@ResponseBody
public ResponseEntity<String> handleJsonRequest(@RequestBody String jsonData) {
    // 处理 JSON 请求并返回 JSON 响应
    return ResponseEntity.ok("{\"status\":\"success\"}");
}
```



## 如何处理 Spring MVC 中的表单数据？

1.  **创建表单页面**：使用 HTML 表单元素。
2.  **创建数据模型**：定义一个 Java 类来接收表单数据。
3.  **创建控制器方法**：处理表单提交请求。
4.  **数据绑定和验证**：使用 Spring 提供的验证机制来验证表单数据

**创建表单页面**

首先，创建一个 HTML 表单页面来收集用户输入。一个简单的用户注册表单：

```html
<!DOCTYPE html>
<html>
<head>
    <title>Register</title>
</head>
<body>
    <h2>Register</h2>
    <form action="/register" method="post">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username"><br><br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password"><br><br>
        <input type="submit" value="Register">
    </form>
</body>
</html>
```

**创建数据模型**

创建一个 Java 类来表示表单数据。一个用户类：

```java
public class User {
    private String username;
    private String password;

    // Getters and Setters

}
```

**创建控制器方法**

在控制器类中创建方法来处理表单提交请求

```java
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class UserController {

    @GetMapping("/register")
    public String showForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String submitForm(@ModelAttribute("user") User user, Model model) {
        // 处理表单数据
        model.addAttribute("message", "User registered successfully");
        return "result";
    }
}
```

-   `@GetMapping("/register")` 方法用于显示注册表单。
-   `@PostMapping("/register")` 方法用于处理表单提交。通过 `@ModelAttribute` 注解，Spring MVC 会自动将表单数据绑定到 `User` 对象。

**数据绑定和验证**

为了确保表单数据的有效性，可以使用 Spring 的验证机制。首先，在数据模型类上使用注解进行验证：

```java
import javax.validation.constraints.NotEmpty;

public class User {
    @NotEmpty(message = "Username is required")
    private String username;

    @NotEmpty(message = "Password is required")
    private String password;

    // Getters and Setters
}
```

  在控制器方法中添加验证逻辑：

```java
import org.springframework.validation.BindingResult;
import javax.validation.Valid;

@Controller
public class UserController {

    @GetMapping("/register")
    public String showForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String submitForm(@Valid @ModelAttribute("user") User user, BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            return "register";
        }
        // 处理表单数据
        model.addAttribute("message", "User registered successfully");
        return "result";
    }
}
```

-   `@Valid` 注解用于触发验证。
-   `BindingResult` 参数用于检查验证结果。如果有验证错误，返回到表单页面并显示错误信息。

**显示验证错误信息**

在表单页面上显示验证错误信息：

```html
<!DOCTYPE html>
<html>
<head>
    <title>Register</title>
</head>
<body>
    <h2>Register</h2>
    <form action="/register" method="post">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" value="${user.username}"><br>
        <span style="color:red">${#fields.hasErrors('username')} ? ${#fields.errors('username')} : ''</span><br><br>
        
        <label for="password">Password:</label>
        <input type="password" id="password" name="password"><br>
        <span style="color:red">${#fields.hasErrors('password')} ? ${#fields.errors('password')} : ''</span><br><br>
        
        <input type="submit" value="Register">
    </form>
</body>
</html>
```



## 如何在 Spring MVC 中进行表单验证？

1.  **定义数据模型并添加验证注解**。
2.  **在控制器中处理表单提交并进行验证**。
3.  **在视图中显示验证错误信息**。

**定义数据模型并添加验证注解**

使用 Java Bean Validation (JSR-380) 注解来定义数据模型的验证规则。例如，创建一个 `User` 类，并在其字段上添加验证注解：

```java
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

public class User {
    @NotEmpty(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;

    @NotEmpty(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
```

**在控制器中处理表单提交并进行验证**

在控制器中使用 `@Valid` 注解和 `BindingResult` 参数来处理表单验证

```java
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import javax.validation.Valid;

@Controller
public class UserController {

    @GetMapping("/register")
    public String showForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String submitForm(@Valid @ModelAttribute("user") User user, BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            return "register";
        }
        // 处理表单数据
        model.addAttribute("message", "User registered successfully");
        return "result";
    }
}
```

`@Valid` 注解用于触发验证。

`BindingResult` 参数用于检查验证结果。如果有验证错误，将返回到表单页面并显示错误信息

**在视图中显示验证错误信息**

在视图模板中显示验证错误信息。例如，使用 Thymeleaf 模板引擎：

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Register</title>
</head>
<body>
    <h2>Register</h2>
    <form action="#" th:action="@{/register}" th:object="${user}" method="post">
        <label for="username">Username:</label>
        <input type="text" id="username" th:field="*{username}">
        <div th:if="${#fields.hasErrors('username')}" th:errors="*{username}">Username Error</div>
        <br><br>
        
        <label for="password">Password:</label>
        <input type="password" id="password" th:field="*{password}">
        <div th:if="${#fields.hasErrors('password')}" th:errors="*{password}">Password Error</div>
        <br><br>
        
        <input type="submit" value="Register">
    </form>
</body>
</html>
```

`th:object="${user}"` 绑定表单对象。

`th:field="*{username}"` 和 `th:field="*{password}"` 绑定表单字段。

`th:if="${#fields.hasErrors('username')}"` 和 `th:errors="*{username}"` 用于显示验证错误信息。



## 什么是 ModelAndView？

`ModelAndView`用于封装模型数据和视图信息。它允许控制器方法返回一个对象，该对象包含视图名称和模型数据，从而将数据传递给视图进行渲染。

**`ModelAndView` 的组成部分**

-   **视图名称**：表示要渲染的视图的名称，通常对应于某个 JSP、Thymeleaf 模板或其他视图模板。

-   **模型数据**：一个 `Map` 或者 `Model` 对象，包含要传递给视图的数据

```java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class MyController {

    @GetMapping("/welcome")
    public ModelAndView welcome() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("welcome"); // 设置视图名称
        modelAndView.addObject("message", "Welcome to Spring MVC!"); // 添加模型数据

        return modelAndView;
    }
}
```

`ModelAndView` 对象被创建。

`setViewName("welcome")` 设置视图名称为 `welcome`，表示将使用名为 `welcome` 的视图模板来渲染响应。

`addObject("message", "Welcome to Spring MVC!")` 添加模型数据，键为 `message`，值为 `"Welcome to Spring MVC!"`。

**在视图模板中使用模型数据（假设使用 Thymeleaf）**

```java
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Welcome</title>
</head>
<body>
    <h1 th:text="${message}">Welcome Message</h1>
</body>
</html>
```

`${message}` 表达式将被替换为模型数据中 `message` 键对应的值。

**`ModelAndView` 的常用方法**

-   **构造函数**：
    -   `ModelAndView()`：创建一个空的 `ModelAndView` 对象。
    -   `ModelAndView(String viewName)`：创建一个带有视图名称的 `ModelAndView` 对象。
    -   `ModelAndView(String viewName, String modelName, Object modelObject)`：创建一个带有视图名称和单个模型数据的 `ModelAndView` 对象。
    -   `ModelAndView(String viewName, Map<String, ?> model)`：创建一个带有视图名称和模型数据的 `ModelAndView` 对象。

-   **设置视图名称**：
    -   `void setViewName(String viewName)`：设置视图名称。

-   **添加模型数据**：
    -   `ModelAndView addObject(String attributeName, Object attributeValue)`：添加单个模型数据。
    -   `ModelAndView addObject(Object attributeValue)`：添加单个模型数据，属性名为对象的类名。
    -   `ModelAndView addAllObjects(Map<String, ?> modelMap)`：添加多个模型数据。

-   **获取模型数据**：
    -   `Map<String, Object> getModel()`：获取模型数据。

-   **获取视图名称**：
    -   `String getViewName()`：获取视图名称。

**使用 `ModelAndView` 的优点**

1.  **清晰分离模型和视图**：将模型数据和视图信息封装在一个对象中，使得控制器方法的返回值更加清晰和结构化。
2.  **灵活性**：可以在一个地方设置视图和模型数据，便于维护和修改。
3.  **简化代码**：通过返回 `ModelAndView` 对象，可以避免在控制器方法中显式设置模型和视图。



## @RequestParam

`@RequestParam` 注解是 Spring MVC 中用于**将请求参数绑定到处理方法的参数上**的注解。

可以用于从 URL查询参数（query参数）、表单数据或其他请求参数中提取值，并将这些值传递给控制器方法参数上

通常用于处理简单的键值对参数

**特点**

-   从 URL 查询参数（`?key=value`）或表单数据中获取值。
-   可以设置 `required = false` 来允许参数为空。
-   支持默认值：`@RequestParam(defaultValue = "zs")`。

**`@RequestParam` 的基本用法**

-   **绑定单个请求参数**

```java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class UserController {

    @GetMapping("/greet")
    @ResponseBody
    public String greetUser(@RequestParam String name) {
        return "Hello, " + name;
    }
}
```

`@RequestParam` 注解用于将请求参数 `name` 的值绑定到方法参数 `name` 上。

如果请求 URL 是 `/greet?name=John`，那么方法参数 `name` 的值将是 `John`

-   **指定请求参数名称**

可以通过 `value` 属性指定请求参数的名称：

```java
@GetMapping("/greet")
@ResponseBody
public String greetUser(@RequestParam("username") String name) {
    return "Hello, " + name;
}
```

`@RequestParam("username")` 表示将请求参数 `username` 的值绑定到方法参数 `name` 上。

如果请求 URL 是 `/greet?username=John`，那么方法参数 `name` 的值将是 `John`。

-   **设置请求参数的默认值**

可以通过 defaultValue 属性设置请求参数的默认值：

```java
@GetMapping("/greet")
@ResponseBody
public String greetUser(@RequestParam(value = "name", defaultValue = "Guest") String name) {
    return "Hello, " + name;
}
```

  如果请求 URL 中没有 `name` 参数，那么 `name` 参数的默认值将是 `Guest`

-   **请求参数为可选**

可以通过 `required` 属性指定请求参数是否是必需的：

```java
@GetMapping("/greet")
@ResponseBody
public String greetUser(@RequestParam(value = "name", required = false) String name) {
    if (name == null) {
        name = "Guest";
    }
    return "Hello, " + name;
}
```

`@RequestParam(value = "name", required = false)` 表示 `name` 参数是可选的。如果请求 URL 中没有 `name` 参数，那么 `name` 参数的值将是 `null`

**`@RequestParam` 的高级用法**

-   **绑定多个请求参数**

```java
@GetMapping("/user")
@ResponseBody
public String getUserInfo(@RequestParam String name, @RequestParam int age) {
    return "User: " + name + ", Age: " + age;
}
```

`name` 和 `age` 请求参数将分别绑定到方法参数 `name` 和 `age` 上。

如果请求 URL 是 `/user?name=John&age=30`，那么方法参数 `name` 的值将是 `John`，`age` 的值将是 `30`。

-   **绑定到集合类型**

```java
@GetMapping("/numbers")
@ResponseBody
public String getNumbers(@RequestParam List<Integer> nums) {
    return "Numbers: " + nums;
}
```

`nums` 请求参数将绑定到方法参数 `nums` 上。

如果请求 URL 是 `/numbers?nums=1&nums=2&nums=3`，那么方法参数 `nums` 的值将是 `[1, 2, 3]`。

如果请求 URL 是 `/numbers?nums=1,2,3`，那么方法参数 `nums` 的值将是 `[1, 2, 3]`。



## **@PathVariable** 

`@PathVariable` 注解是 Spring MVC 中用于**将 URL 路径中的变量绑定到处理方法的参数上**的注解。常用于 RESTful 风格的 API。

它允许你从 URL 路径中提取参数，并将这些参数传递给控制器方法，从而实现更加动态和灵活的 URL 路由。

**特点**

-   从 URL 路径中提取值（例如 `/users/{id}` 中的 `{id}`）。
-   用于构建 RESTful API，清晰表达资源路径。

**`@PathVariable` 的基本用法**

-   **绑定单个路径变量**

可以将 URL 路径中的变量绑定到方法参数上：

```java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class UserController {

    @GetMapping("/users/{id}")
    @ResponseBody
    public String getUserById(@PathVariable String id) {
        return "User ID: " + id;
    }
}
```

`@PathVariable` 注解用于将 URL 路径中的 `id` 变量绑定到方法参数 `id` 上。

如果请求 URL 是 `/users/123`，那么方法参数 `id` 的值将是 `123`。

-   **指定路径变量名称**

可以通过 `value` 属性指定路径变量的名称：

```java
@GetMapping("/users/{userId}")
@ResponseBody
public String getUserById(@PathVariable("userId") String id) {
    return "User ID: " + id;
}
```

`@PathVariable("userId")` 表示将 URL 路径中的 `userId` 变量绑定到方法参数 `id` 上。

如果请求 URL 是 `/users/123`，那么方法参数 `id` 的值将是 `123`。

**`@PathVariable` 的高级用法**

-   **绑定多个路径变量**

可以绑定多个路径变量到方法参数上：

```java
@GetMapping("/users/{userId}/orders/{orderId}")
@ResponseBody
public String getUserOrder(@PathVariable String userId, @PathVariable String orderId) {
    return "User ID: " + userId + ", Order ID: " + orderId;
}
```

`userId` 和 `orderId` 路径变量将分别绑定到方法参数 `userId` 和 `orderId` 上。

如果请求 URL 是 `/users/123/orders/456`，那么方法参数 `userId` 的值将是 `123`，`orderId` 的值将是 `456`。

-   **绑定到特定类型**

可以将路径变量绑定到特定类型的参数上：

```java
@GetMapping("/products/{productId}")
@ResponseBody
public String getProductById(@PathVariable int productId) {
    return "Product ID: " + productId;
}
```

`productId` 路径变量将绑定到方法参数 `productId` 上，并自动转换为 `int` 类型。

如果请求 URL 是 `/products/789`，那么方法参数 `productId` 的值将是 `789`。



## @RequestBody

| 名称 | @RequestBody                                                 |
| ---- | ------------------------------------------------------------ |
| 类型 | ==形参注解==                                                 |
| 位置 | SpringMVC控制器方法形参定义前面                              |
| 作用 | **将请求中请求体所包含的数据传递给控制器方法参数上**，此注解一个处理器方法只能使用一次 |



## @RequestBody、@RequestParam、@PathVariable的区别

| 名称 | @RequestBody                                                 |
| ---- | ------------------------------------------------------------ |
| 类型 | ==形参注解==                                                 |
| 位置 | SpringMVC控制器方法形参定义前面                              |
| 作用 | **将请求中请求体所包含的数据传递给请求参数**，此注解一个处理器方法只能使用一次 |

| 名称     | @RequestParam                                       |
| -------- | --------------------------------------------------- |
| 类型     | ==形参注解==                                        |
| 位置     | SpringMVC控制器方法形参定义前面                     |
| 作用     | 绑定请求参数与处理器方法形参间的关系                |
| 相关参数 | required：是否为必传参数   defaultValue：参数默认值 |

| 名称 | @PathVariable                                                |
| ---- | ------------------------------------------------------------ |
| 类型 | ==形参注解==                                                 |
| 位置 | SpringMVC控制器方法形参定义前面                              |
| 作用 | 绑定路径参数与处理器方法形参间的关系，要求路径参数名与形参名一一对应 |

三个注解之间的区别和应用分别是什么?

区别

-   @RequestParam用于**接收url地址传参（**query参数），**表单传参**【application/x-www-form-urlencoded】
    -   qeury参数：`/users?search=John`
-   @RequestBody用于接收**json**数据【application/json】
-   @PathVariable**用于接收路径参数**，使用{参数名称}描述路径参数
    -   例如：`/users/1`

应用

-   后期开发中，发送请求参数超过1个时，以json格式为主，@RequestBody应用较广
-   如果发送非json格式数据，选用@RequestParam接收请求参数
-   采用RESTful进行开发，当参数数量较少时，例如1个，可以采用@PathVariable接收请求路径变量，通常用于传递id值



## @ModelAttribute

`@ModelAttribute` 注解是 Spring MVC 中用于**绑定请求参数或表单数据到模型对象（Java对象）**的注解。

它能够自动将请求的多个参数（例如 `name=John&email=john@example.com`）映射到对象的字段中。

它可以用于方法参数、方法和控制器类中，以便将请求中的数据绑定到模型对象，并将该对象添加到模型中，以便在视图中使用。

**适用场景**

-   **表单提交**涉及多个字段的绑定（如用户注册、更新）。
-   需要一次性绑定复杂数据结构

**`@ModelAttribute` 的使用场景**

-   **方法参数**：用于绑定请求参数或表单数据到方法参数，并将该参数添加到模型中。
-   **方法**：用于在处理请求之前准备模型数据。通常用于在处理请求之前初始化一些公共数据。
-   **控制器类**：用于在所有请求处理方法之前初始化模型数据。

**用于方法参数**

当 `@ModelAttribute` 注解用于控制器方法参数时，它会自动将请求参数绑定到该参数对象中，并将该对象添加到模型中

```java
@Controller
public class UserController {

    @PostMapping("/register")
    public String registerUser(@ModelAttribute User user) {
        // user 对象已经绑定了请求参数
        // 可以在这里处理业务逻辑
        return "result";
    }
}
```

在`@ModelAttribute` 注解用于 `User` 对象的参数。这意味着 Spring MVC 会自动将请求参数绑定到 `User` 对象的属性中，并将该对象添加到模型中。

-   **工作原理：**
    1.  Spring 会从请求参数中获取所有与对象字段名匹配的值。
    2.  将这些值自动填充到对象的对应字段中。
    3.  如果对象中有嵌套对象，Spring 也会递

**用于方法**

当 `@ModelAttribute` 注解用于控制器方法时，该方法会在每个处理请求的方法之前执行，用于准备模型数据

```java
@Controller
public class UserController {

    @ModelAttribute
    public void addAttributes(Model model) {
        model.addAttribute("commonAttribute", "This is a common attribute");
    }

    @GetMapping("/register")
    public String showForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }
}
```

`addAttributes` 方法会在 `showForm` 方法之前执行，并将一个公共属性添加到模型中。这样，`commonAttribute` 可以在视图中使用。

**用于控制器类**

当 `@ModelAttribute` 注解用于控制器类时，它会在所有请求处理方法之前执行，用于初始化模型数据。

```java
@Controller
@RequestMapping("/users")
public class UserController {

    @ModelAttribute
    public void addCommonAttributes(Model model) {
        model.addAttribute("appName", "User Management System");
    }

    @GetMapping("/register")
    public String showForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(@ModelAttribute User user) {
        // user 对象已经绑定了请求参数
        // 可以在这里处理业务逻辑
        return "result";
    }
}
```

`addCommonAttributes` 方法会在所有请求处理方法之前执行，并将一个公共属性添加到模型中。这样，`appName` 可以在所有视图中使用



## @RequestParam 与 @ModelAttribute 的区别？

| 特性             | @RequestParam        | @ModelAttribute        |
| ---------------- | -------------------- | ---------------------- |
| 绑定目标         | 单个请求参数         | Java 对象              |
| 绑定来源         | Query 参数或表单数据 | 表单数据或 Query 参数  |
| 适用场景         | 可选参数、搜索条件   | 表单提交、复杂对象绑定 |
| 是否支持嵌套绑定 | 否                   | 是                     |
| RESTful API 支持 | 不常见               | 不常见                 |



## @EnableWebMvc

| 名称 | @EnableWebMvc                                             |
| ---- | --------------------------------------------------------- |
| 类型 | ==配置类注解==                                            |
| 位置 | SpringMVC配置类定义上方                                   |
| 作用 | 开启SpringMVC多项辅助功能（包含开启json数据类型自动转换） |





## 如何处理 Spring MVC 中的文件上传？

>   实现文件上传服务，需要有存储的支持，那么我们的解决方案将以下几种：
>
>   1.  直接将文件保存到服务的硬盘（springmvc中的文件上传）
>       1.  优点：开发便捷，成本低
>       2.  缺点：扩容困难
>   2.  使用分布式文件系统进行存储
>       1.  优点：容易实现扩容
>       2.  缺点：开发复杂度稍大（有成熟的产品可以使用，比如：FastDFS,MinIO）
>   3.  使用第三方的存储服务（例如OSS）
>       1.  优点：开发简单，拥有强大功能，免维护
>       2.  缺点：付费

**1、配置 Spring MVC 以支持文件上传**

首先，需要在 Spring 配置文件中添加对文件上传的支持。你可以在 Spring 的 Java 配置类或 XML 配置文件中进行配置。

-   **Java 配置类方式**

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

@Configuration
public class AppConfig {

    @Bean
    public CommonsMultipartResolver multipartResolver() {
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
        multipartResolver.setMaxUploadSize(50000000); // 设置最大上传文件大小为 50MB
        return multipartResolver;
    }
}
```

-   XML 配置文件方式

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
        <property name="maxUploadSize" value="50000000"/> <!-- 设置最大上传文件大小为 50MB -->
    </bean>

</beans>
```

**2、创建一个表单用于文件上传**

创建一个包含文件上传字段的 HTML 表单。注意，表单的 `enctype` 属性必须设置为 `multipart/form-data`

```html
<!DOCTYPE html>
<html>
<head>
    <title>File Upload</title>
</head>
<body>
    <form method="post" action="/upload" enctype="multipart/form-data">
        <input type="file" name="file" />
        <input type="submit" value="Upload" />
    </form>
</body>
</html>
```

**3、编写控制器方法来处理文件上传请求**

在控制器中编写处理文件上传请求的方法。使用 `@RequestParam` 注解将上传的文件绑定到方法参数上。

```java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.File;
import java.io.IOException;

@Controller
public class FileUploadController {

    @PostMapping("/upload")
    @ResponseBody
    public String handleFileUpload(@RequestParam("file") MultipartFile file) {
        if (!file.isEmpty()) {
            try {
                // 获取文件名
                String fileName = file.getOriginalFilename();
                // 将文件保存到指定路径
                String filePath = "C:/uploads/" + fileName;
                File dest = new File(filePath);
                file.transferTo(dest);
                return "File uploaded successfully: " + fileName;
            } catch (IOException e) {
                e.printStackTrace();
                return "Failed to upload file: " + e.getMessage();
            }
        } else {
            return "Failed to upload file: File is empty.";
        }
    }
}
```



## SpringMVC父子容器是什么？





## SpringMVC中的Controller是什么？如何定义应该Controller?



## 简述请求是如何找到对应Controller的？





## SpringMVC中如何处理表单提交？







## SpringMVC中的拦截器是什么？

在 Spring MVC 中，拦截器（Interceptor）是一种用于**对 HTTP 请求进行预处理和后处理的机制**。拦截器可以在请求到达控制器之前、控制器处理请求之后以及视图渲染之前执行特定的逻辑。它们类似于 Servlet 中的过滤器（Filter），但提供了更细粒度的控制和更强大的功能。

**拦截器的主要用途**

-   **请求日志记录**：记录每个请求的详细信息，如请求 URL、请求参数、处理时间等。

-   **权限验证**：在请求到达控制器之前检查用户是否有权限访问特定的资源。

- **性能监控**：测量请求的处理时间，帮助优化性能。

-   **通用处理**：在请求处理之前或之后执行一些通用的逻辑，如设置公共属性、国际化处理等

**拦截器的生命周期方法**

Spring MVC 的拦截器通过实现 `HandlerInterceptor` 接口来定义。这个接口包含三个主要方法：

-   **`preHandle`**：在请求处理之前执行。返回 `true` 表示继续处理请求，返回 `false` 表示中止请求。

-   **`postHandle`**：在请求处理之后、视图渲染之前执行。可以修改视图模型数据。

-   **`afterCompletion`**：在整个请求完成之后（包括视图渲染之后）执行。**通常用于资源清理**



## 如何在 Spring MVC 中配置拦截器？|如何定义一个拦截器？

在 Spring MVC 中配置拦截器有两种常见方式：使用 Java 配置类和使用 XML 配置文件

-   **使用 Java 配置类**

通过 Java 配置类来配置拦截器是一种更现代和推荐的方式。需要实现 `WebMvcConfigurer` 接口，并在其中注册你的拦截器。

1.  **创建一个拦截器类**：实现 `HandlerInterceptor` 接口。
2.  **创建一个配置类**：实现 `WebMvcConfigurer` 接口，并在其中注册拦截器

**拦截器类：**

```java
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class MyInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("Pre Handle method is Calling");
        return true; // 返回 true 继续处理请求，返回 false 中止请求
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("Post Handle method is Calling");
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception exception) throws Exception {
        System.out.println("Request and Response is completed");
    }
}
```

**配置类：**

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private MyInterceptor myInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(myInterceptor).addPathPatterns("/**"); // 拦截所有请求
    }
}
```

-   使用 XML 配置文件

如果你使用的是 XML 配置文件，可以通过 `<mvc:interceptors>` 元素来配置拦截器。

1.  **创建一个拦截器类**：实现 `HandlerInterceptor` 接口。
2.  **在 XML 配置文件中注册拦截器**。

**拦截器类：**

```java
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class MyInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("Pre Handle method is Calling");
        return true; // 返回 true 继续处理请求，返回 false 中止请求
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("Post Handle method is Calling");
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception exception) throws Exception {
        System.out.println("Request and Response is completed");
    }
}
```

**XML 配置文件：**

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/mvc
                           http://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <mvc:interceptors>
        <mvc:interceptor>
            <mvc:mapping path="/**"/>
            <bean class="com.example.MyInterceptor"/>
        </mvc:interceptor>
    </mvc:interceptors>

</beans>
```



## 拦截器和过滤器的区别？



## SpringMVC中如何处理异常（异常处理机制）？

**异常处理机制概述**

在 Spring MVC 中，无论是 DAO 层、Service 层还是 Controller 层，都有可能抛出异常。这些异常可以通过 `throws Exception` 向上抛出，并最终由 Spring MVC 的前端控制器（DispatcherServlet）交给异常处理器进行处理。Spring MVC 提供了多种异常处理机制，以便开发者能够根据自己的需求选择最适合的方式。

**异常处理的主要方式**

-   **使用 SimpleMappingExceptionResolver**

`SimpleMappingExceptionResolver` 是 Spring MVC 提供的一个**简单异常处理器**，它实现了 `HandlerExceptionResolver` 接口。通过配置该处理器，开发者可以定义异常类型与视图之间的映射关系，从而指定当特定类型的异常发生时应该渲染哪个视图。



配置方式：在 Spring MVC 的配置文件中（如 XML 配置文件或 Java 配置类）配置 `SimpleMappingExceptionResolver`，并设置其属性，如 `defaultErrorView`（默认错误视图）、`exceptionMappings`（异常类型与视图的映射关系）等。



-   **实现 HandlerExceptionResolver 接口**

如果 SimpleMappingExceptionResolver 不能满足需求，开发者可以实现 `HandlerExceptionResolver` 接口来创建自定义的异常处理器。这种方式提供了更高的灵活性，允许开发者在异常处理过程中执行更复杂的逻辑。



实现方式：创建一个类实现 HandlerExceptionResolver 接口，并重写 `resolveException` 方法。在该方法中，可以根据异常类型决定如何处理异常，并返回一个 ModelAndView 对象，该对象指定了要渲染的视图和要传递给视图的模型数据。



-   **使用 @ControllerAdvice + @ExceptionHandler**

从 Spring 3.2 开始，Spring MVC 引入了 `@ControllerAdvice` 和 `@ExceptionHandler` 注解，提供了一种基于注解的异常处理机制。这种方式允许开发者将异常处理逻辑与具体的 Controller 分离，从而实现更加模块化和可重用的异常处理代码。



实现方式：首先，使用 `@ControllerAdvice` 注解标记一个类，该类将作为全局的异常处理类。然后，在该类中使用 `@ExceptionHandler` 注解标记方法，并指定该方法用于处理哪种类型的异常。当指定的异常发生时，Spring MVC 将自动调用该方法进行处理。

**异常处理机制的优势**

-   统一处理：能够将所有类型的异常处理从各处理过程解耦出来，既保证了相关处理过程的功能较单一，也实现了异常信息的统一处理和维护。

-   灵活性：提供了多种异常处理方式，允许开发者根据自己的需求选择最适合的方式。

-   用户体验：通过友好的错误页面或错误信息提示，可以提升用户体验



## 如何在 Spring MVC 中使@ExceptionHandler 注解？

在 Spring MVC 中，`@ExceptionHandler` 注解用于定义全局异常处理器。它允许你在一个地方集中处理应用程序中的异常，而不是在每个控制器方法中都编写重复的代码。

-   **创建全局异常处理器**

1、创建一个类并使用 @ControllerAdvice 注解，这使得该类可以处理所有控制器中抛出的异常。
2、在该类的方法上使用 @ExceptionHandler 注解，指定要捕获的异常类型。

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    // 捕获特定类型的异常
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse("NOT_FOUND", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // 捕获所有未处理的异常
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex) {
        ErrorResponse error = new ErrorResponse("INTERNAL_SERVER_ERROR", "An unexpected error occurred");
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

```

-   **局部异常处理**

如果只想为某个特定的控制器处理异常，则不需要使用 @ControllerAdvice，而是在该控制器内部定义带有 @ExceptionHandler 的方法。

```java
@Controller
public class MyController {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ModelAndView handleResourceNotFoundException(ResourceNotFoundException ex) {
        ModelAndView modelAndView = new ModelAndView("errorPage");
        modelAndView.addObject("errorMessage", ex.getMessage());
        return modelAndView;
    }
}
```

-   返回自定义错误响应

可以根据需求返回不同的视图或 REST API 响应。上述示例展示了如何返回一个 ResponseEntity 对象，其中包含状态码和自定义的错误信息。



## SpringMVC中的国际化（i18n）支持是如何实现的？

**1、创建资源文件**

首先，你需要创建多个资源文件来存储不同语言的文本信息。这些文件通常以 `.properties` 扩展名结尾，并且每个文件都对应一个特定的语言和国家代码（如 `messages_en_US.properties`）。在这些文件中，你可以定义 key-value 对，其中 key 是一个唯一的标识符，value 是相应语言的翻译文本

**2、配置消息源**

在 Spring MVC 中，你需要配置一个 `MessageSource` bean 来加载这些资源文件。最常用的实现是 `ReloadableResourceBundleMessageSource`，它允许你在不重新启动应用程序的情况下更新资源文件。

```xml
<bean id="messageSource" class="org.springframework.context.support.ReloadableResourceBundleMessageSource">
    <property name="basenames" value="com.example.i18n.messages"/>
    <property name="defaultEncoding" value="UTF-8"/>
    <property name="fallbackToSystemLocale" value="true"/>
</bean>
```

`basenames` 属性指向了你的资源文件的基本名称（不包括语言和国家代码部分），`defaultEncoding` 属性指定了文件的编码方式，`fallbackToSystemLocale` 属性决定了当请求的语言没有对应的资源文件时是否使用系统默认的语言。

**3、使用** `@SessionAttribute` **或** `@RequestAttribute` **注解获取当前语言**

为了在处理器方法中获取当前的语言环境，你可以使用 `@SessionAttribute` 或 `@RequestAttribute` 注解来注入当前的 `Locale` 对象。

```java
@Controller
public class MyController {
    @GetMapping("/greeting")
    public String greeting(@RequestAttribute("locale") Locale locale) {
        // 使用 locale 对象来获取相应语言的文本信息
    }
}
```

**4、在视图中使用国际化文本**

在 JSP、Thymeleaf 或其他视图技术中，你可以使用 Spring 提供的国际化标签或函数来显示相应语言的文本信息。例如，在 JSP 中，你可以使用 `<spring:message>` 标签：

```jsp
<spring:message code="greeting.message" text="Hello, World!" />
```

**5、处理请求的语言**

最后，你需要在应用程序中处理请求的语言。通常情况下，这可以通过在请求头中设置 `Accept-Language` 来实现。Spring MVC 提供了一个 `LocaleChangeInterceptor` 来自动检测和处理这种情况。你只需要将其添加到你的拦截器链中即可：

```xml
<mvc:interceptors>
    <bean class="org.springframework.web.servlet.i18n.LocaleChangeInterceptor"/>
</mvc:interceptors>
```



## 什么是Spring MVC的REST支持？

Spring MVC的REST支持是指Spring MVC框架提供的一系列特性和工具，用于简化构建RESTful Web服务的过程。REST（Representational State Transfer）是**一种架构风格**，用于设计网络应用程序，特别是Web应用程序。它基于HTTP协议，使用标准的HTTP方法（如GET、POST、PUT、DELETE）来操作资源。

**主要特点**

-   **资源导向设计**：RESTful Web服务围绕资源进行设计，每个资源通过唯一的URL标识，并使用标准的HTTP方法（如GET、POST、PUT、DELETE等）来操作这些资源。
-   **无状态通信**：客户端与服务器之间的每次交互都是独立的，服务器不会保存客户端的状态信息。
-   **统一接口**：通过一致的API设计，简化了客户端和服务端的交互模式。

**Spring MVC的几个REST支持特性**

-   **@RestController**注解：这个注解是专门为REST控制器设计的。它相当于同时使用@Controller和@ResponseBody注解，表示该控制器返回的对象会被自动序列化为JSON或XML等格式。
-   @RequestMapping注解：这个注解用来映射HTTP请求到特定的处理方法。可以指定请求的方法、路径、参数等信息。
    -    `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping` 等注解明确指定HTTP请求方法
-   @PathVariable注解：用于从URL中提取变量并将其作为方法参数传递。
-   @RequestParam注解：用于从HTTP请求参数中获取值并将其作为方法参数传递。
-   @RequestBody注解：用于将HTTP请求体转换为方法参数的对象。
-   @ResponseBody注解：用于将方法返回的对象序列化为HTTP响应体。
-   ResponseEntity类：提供了一个可以直接返回HTTP响应的对象，包括状态码、响应头和响应体。
-   @ExceptionHandler注解：用于处理控制器方法中可能抛出的异常，并返回适当的HTTP响应。
-   HTTP Message Converters：Spring MVC内置了多个消息转换器，支持将各种对象类型转换为JSON、XML、Form Data等格式。
-   Content Negotiation：Spring MVC支持根据客户端请求的Accept头自动选择合适的消息转换器
-   HATEOAS（Hypermedia as the Engine of Application State）：Spring HATEOAS提供了一组工具和注解，帮助你在RESTful API中实现HATEOAS原则，例如生成链接和描述资源的关系。



## 如何在SpringMVC中处理JSON数据？

处理 JSON 数据主要涉及两个方面：接收 JSON 数据和返回 JSON 数据

**接收JSON数据**

-   **使用 `@RequestBody` 注解**：在控制器方法的参数上使用 `@RequestBody` 注解可以将 HTTP 请求体中的 JSON 数据自动解析为对应的 Java 对象

```java
@PostMapping("/api/users")
public ResponseEntity<String> createUser(@RequestBody User user) {
    // 处理 user 对象
}
```

在上面的例子中，`User` 是一个普通的 Java 对象，Spring MVC 会自动将请求体中的 JSON 数据转换为 `User` 对象

-   **手动解析 JSON**：如果你需要更多的控制权，可以使用 Jackson 或 Gson 等库手动解析 JSON 数据。首先，你需要将请求体读取到一个字符串中，然后使用 JSON 解析器将其转换为 Java 对象。例如，使用 Jackson：

```java
@PostMapping("/api/users")
public ResponseEntity<String> createUser(@RequestBody String json) {
    ObjectMapper mapper = new ObjectMapper();
    User user = mapper.readValue(json, User.class);
    // 处理 user 对象
}
```

**返回JSON数据**

-   **使用 `ResponseBody` 注解**：在控制器方法上使用 `@ResponseBody` 注解可以将方法返回的对象自动序列化为 JSON 数据并写入到 HTTP 响应体中。例如：

```java
@GetMapping("/api/users/{id}")
@ResponseBody
public User getUser(@PathVariable Long id) {
    // 从数据库中获取用户
    return user;
}
```

-   **手动序列化 JSON**：如果你需要更多的控制权，可以使用 Jackson 或 Gson 等库手动将Java对象序列化为 JSON 数据。例如，使用 Jackson：

```java
@GetMapping("/api/users/{id}")
public ResponseEntity<String> getUser(@PathVariable Long id) {
    // 从数据库中获取用户
    User user =...
    ObjectMapper mapper = new ObjectMapper();
    String json = mapper.writeValueAsString(user);
    return ResponseEntity.ok(json);
}
```



## 如何在 Spring MVC 中实现跨域资源共享（CORS）

**口语化**

跨域指的是浏览器在执行网页在JavaScript代码时由于浏览器的同源策略的限制，只能访问同源的资源。同源就是协议名、域名、端口号都要一致。例如：http://example.com:8080

而解决跨域问题的方法就是在不破坏同源策略的情况下，能够安全的实现数据的共享与交互。

常见的解决跨域问题的方案有CORS、JSONP、前端代理服务器等

其中CORS是一种在服务器后端解决跨域的方案，它的工作原理非常简单，如果一个网站需要访问另一个网站的资源，浏览器会先发出一个OPTION请求（预检请求），根据服务端返回的Access-Control-Allow-Orgin等响应头信息，来决定是否允许跨域请求，如果允许才会真正发起请求。所以只需要在服务端配置这类响应头即可。

还是就是JSONP，它是早期解决跨域的方案，不过只能处理GET请求，现在已经不常用了。

补充一下，除了在后端解决跨域，还可以在前端解决。比如使用Nginx配置代理服务器、使用前端脚手架工具，如vite。

在Spring项目中，配置CORS常见的有两种方案

​	方案一：通过使用`@CrossOrigin`注解，这个注解可以用在控制器类上或控制器方法上。

​	方案二：实现 `WebMvcConfigurer` 接口并重写 `addCorsMappings` 方法，这是一个全局处理的方案



此外还可以通过过滤器、Spring Security等配置CORS



**什么是跨域**

前端跨域问题是一个很常见的网络安全策略问题，主要是由于浏览器的**同源策略（Same-origin policy）**的限制。同源策略限制了一个源（域名、协议、端口）的文档或脚本与另一个源的资源进行交互。这是为了防止恶意文档窃取数据或进行其他危害行为。

>   **同源**：协议、域名和端口号都相同。
>
>   1.  **不同协议**：`http://example.com` 和 `https://example.com`
>   2.  **不同域名**：`http://example1.com` 和 `http://example2.com`
>   3.  **不同端口**：`http://example.com:8080` 和 `http://example.com:9090`

解决接口跨域问题的方案主要有： 

-   **CORS**（主流的解决方案，推荐使用） 
-   JSONP（有缺陷的解决方案：只支持 GET 请求）
-   配置代理服务器
    -   使用Nginx搭建代理服务器
    -   借助脚手架搭建（例如：Vite）



**CORS 跨域资源共享**

核心思路：在服务端设置 `Access-Control-Allow-Origin` 等响应头，来声明允许哪些域进行资源共享

>   **什么是 CORS**
>
>   CORS （Cross-Origin Resource Sharing，跨域资源共享）由一系列 **HTTP 响应头**组成，**这些 HTTP 响应头决定** 
>
>   **浏览器是否阻止跨域获取资源**。
>
>   浏览器的**同源安全策略**默认会阻止网页“跨域”获取资源。但如果接口服务器**配置了 CORS 相关的 HTTP 响应头**， 就可以**解除浏览器端的跨域访问限制**。

**CORS请求的分类**

客户端在请求 CORS 接口时，根据请求方式和请求头的不同，可以将 CORS 的请求分为两大类，分别是： 

-   简单请求 
-   预检请求

-   **简单请求**：**同时满足**以下两大条件的请求，就属于简单请求： 

    -   ① **请求方式**：GET、POST、HEAD 三者之一 

    -   ② **HTTP 头部信息**不超过以下几种字段：无自定义头部字段、Accept、Accept-Language、Content-Language、DPR、Downlink、Save-Data、Viewport-Width、Width 
        -   简单来说：只要不手动修改请求头，一般都能符合该规范，一般都为简单请求
    -   Content-Type（只有三个值application/x-www-form-urlencoded、multipart/form-data、text/plain）

-   **预检请求** ：只要符合以下**任何一个**条件的请求，都需要进行预检请求： 
    -   ① 请求方式为 **GET、POST、HEAD 之外的请求 Method 类型** 
    -   ② 请求头中**包含自定义头部字段** 的请求，比如说自定义header头token
    -   ③ 向服务器发送了 **application/json 格式**的数据 

在浏览器与服务器正式通信之前，浏览器**会先发送 OPTION 请求进行预检，以获知服务器是否允许该实际请求**，所以这一次的 OPTION 请求称为“预检请求”。**服务器成功响应预检请求后，才会发送真正的请求，并且携带真实数据。**

**简单请求和预检请求的区别** 

-   **简单请求的特点**：客户端与服务器之间只会发生一次请求。 

-   **预检请求的特点**：客户端与服务器之间会发生两次请求，**OPTION 预检请求成功之后，才会发起真正的请求**



**常用响应头**

-   Access-Control-Allow-Origin：指定哪些源可以访问资源。可以是具体的一个URL（如http://example.com），或者\*表示允许任何源。

-   Access-Control-Allow-Methods：指定允许的HTTP方法，如GET, POST, DELETE等。
    -   默认情况下，CORS 仅支持客户端发起 GET、POST、HEAD 请求。如果要支持其他类型则需在此请求头在配置

-   Access-Control-Allow-Headers：指定允许的请求头列表，浏览器会在预检请求中使用此头部告知服务器实际请求中会使用哪些头部。否则这次请求会失败
-   -   默认情况下，CORS **仅**支持客户端向服务器发送如下的 9 个请求头： Accept、Accept-Language、Content-Language、DPR、Downlink、Save-Data、Viewport-Width、Width  、Content-Type （值仅限于 text/plain、multipart/form-data、application/x-www-form-urlencoded 三者之一）

-   Access-Control-Allow-Credentials：指示是否允许发送Cookie。如果这个值是true，Access-Control-Allow-Origin就不能设置为\*，必须指定明确的、与请求网页一致的域名。

-   Access-Control-Max-Age：指定预检请求的结果能够被缓存多长时间。

-   Access-Control-Expose-Headers：指定允许浏览器访问的服务器响应头。默认情况下，只有6个基本响应头是可以读的：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma

示例：

```js
res.setHeader('Access-Control-Allow-Origin','*')
res.setHeader('Access-Control-Allow-Methods','POST, GET, DELETE, HEAD')
res.setHeader('Access-Control-Allow-Headers','*')
// 允许客户端额外向服务器发送 Content-Type请求头 和 X-custom-Header请求头
res.setHeader('Access-Control-Allow-Methods','Content-Type, X-custom-Header')
```



**CORS 的注意事项**

-   CORS 主要在**服务器端进行配置**。客户端浏览器**无须做任何额外的配置**，即可请求开启了 CORS 的接口

-   CORS 在浏览器中有兼容性。只有支持 XMLHttpRequest Level2 的浏览器，才能正常访问开启了 CORS 的服 

    务端接口（例如：IE10+、Chrome4+、FireFox3.5+）



**JSONP 接口**

浏览器端通过利用`<script>` 标签的 src 属性，可以跨域加载脚本，请求服务器上的数据，同时，服务器返回一个函数的调用（且不受严格限制的特性）。这种请求数据的方式叫做 JSONP。

早期一些浏览器不支持 CORS 的时，可以靠 JSONP 解决跨域。

特点：

-   JSONP 不属于真正的 Ajax 请求，因为它没有使用 XMLHttpRequest 这个对象。 
-   JSONP **仅支持 GET 请求**，不支持 POST、PUT、DELETE 等请求。



**实现 JSONP 接口的步骤**

基本流程：

-   -   **第一步：**客户端创建一个`<script>`标签，并将其`src`属性设置为包含跨域请求的 URL，同时准备一个回调函数，这个回调函数用于处理返回的数据。
    -   **第二步：**服务端接收到请求后，将数据封装在回调函数中并返回。
    -   **第三步：**客户端的回调函数被调用，数据以参数的形势传入回调函数。





**在 Spring MVC 中实现跨域资源共享（CORS）**

在 Spring MVC 中实现跨域资源共享（CORS，Cross-Origin Resource Sharing）可以通过多种方式来配置。以下是几种常见的方法：

-   使用`@CrossOrigin`注解

`@CrossOrigin` 是 Spring Framework 提供的一个注解，用于在控制器方法或整个控制器上指定允许的跨域请求。

这是最简单的方法之一，适用于细粒度的跨域控制，可以应用于类或方法级别。

```java
// 方法级别

@RestController
public class MyController {

    @GetMapping("/api/data")
    @CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
    public List<Data> getData() {
        // 返回数据
    }
}
```

`@CrossOrigin` 注解指定了来自 `http://localhost:3000` 的跨域请求是被允许的，并且设置了预检请求的缓存时间为 3600 秒（1 小时）。

```java
// 类级别

@RestController
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class MyController {

    @GetMapping("/api/data")
    public List<Data> getData() {
        // 返回数据
    }
}
```

所有在 `MyController` 中的方法都将允许来自 `http://localhost:3000` 的跨域请求。

-   **配置全局 CORS 支持**

如果你需要在全局范围内配置 CORS 策略，可以实现 `WebMvcConfigurer` 接口并重写 `addCorsMappings` 方法

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 指定允许跨域访问的路径
            .allowedOrigins("http://localhost:3000") // 允许的源
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 允许的HTTP方法
            .allowedHeaders("*") // 允许的请求头
            .allowCredentials(true) // 是否允许发送Cookie
            .maxAge(3600); // 预检请求的有效期（秒）
    }
}
```

创建一个 `CorsConfig` 类，实现了 `WebMvcConfigurer` 接口，并在 `addCorsMappings` 方法中添加了一个全局的 CORS 配置，允许来自 `http://localhost:3000` 的跨域请求。

-   **使用过滤器（Filter）**

如果需要更灵活的跨域配置，或者使用的是较旧版本的Spring框架，可以通过自定义过滤器来实现CORS支持。

```java
@Component
public class CorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            chain.doFilter(req, res);
        }
    }

    @Override
    public void init(FilterConfig filterConfig) {}

    @Override
    public void destroy() {}
}
```

-   **使用 Spring Security 配置 CORS**

如果你的应用程序使用了 Spring Security，可以通过配置 `SecurityConfig` 来启用 CORS 支持。

```java
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and()
            .csrf().disable(); // 如果不需要CSRF保护，可以禁用它

        // 其他安全配置...
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

**总结**

-   **@CrossOrigin 注解**：适合简单的、细粒度的跨域配置。
-   **全局配置**：通过 `WebMvcConfigurer` 实现，适用于整个应用程序级别的跨域设置。
-   **过滤器**：提供更灵活的配置选项，适用于复杂场景。
-   **Spring Security 配置**：当使用 Spring Security 时，确保 CORS 和安全配置一致。

选择合适的方式取决于你的具体需求和应用架构。通常情况下，推荐优先使用 `@CrossOrigin` 或**全局配置**，因为它们更加简洁且易于维护。



## 如何在 Spring MVC 中使用模板引擎（如 Thymeleaf）？

**1、添加依赖**

在项目的 `pom.xml` 文件中添加 Thymeleaf 的依赖项：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

**2、配置 Thymeleaf**

Spring Boot 自动配置了 Thymeleaf，但你可以通过修改 `application.properties` 或 `application.yml` 来调整默认设置。例如：

```properties
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html
spring.thymeleaf.mode=HTML
spring.thymeleaf.encoding=UTF-8
spring.thymeleaf.cache=false # 开发阶段禁用缓存
```

**3、创建控制器**

创建一个控制器类来处理HTTP请求，并返回视图名称。Thymeleaf 会根据视图名称自动查找对应的模板文件

```java
@Controller
public class MyController {

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("message", "Welcome to Thymeleaf!");
        return "index"; // 返回视图名称
    }
}
```

我们将一个名为 `message` 的模型属性添加到模型中，并将其传递给 Thymeleaf 模板。然后，控制器返回 `index` 视图名，Spring MVC 会自动选择并渲染 `index.html` 模板文件。当访问应用程序的根路径时，应该能看到一个带有欢迎消息的网页。

**4、创建模板文件**

在项目的 src/main/resources/templates 目录下创建一个名为 index.html 的模板文件。这个文件将作为我们的视图模板：

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Thymeleaf Example</title>
</head>
<body>
    <h1 th:text="${message}">Hello World!</h1>
</body>
</html>
```

使用 Thymeleaf 的语法，`th:text` 属性将显示传入的 `message` 变量的值。



## 如何在 Spring MVC 中配置静态资源？

在 Spring MVC 中，配置**静态资源**可以让应用程序直接提供静态文件（如 HTML、CSS、JavaScript、图片等），而**不必通过控制器来处理这些请求**。

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



**方法三：使用默认静态资源路径**

Spring Boot 默认会自动扫描以下目录中的静态资源文件，并将其映射到 / 路径下：

```
src/main/resources/static/
src/main/resources/public/
src/main/resources/resources/
src/main/resources/META-INF/resources/
```

这意味着你可以直接将静态资源文件放在这些目录中，而无需额外配置。例如：

```
src/main/resources/static/css/style.css 可以通过 http://localhost:8080/css/style.css 访问。
src/main/resources/static/images/logo.png 可以通过 http://localhost:8080/images/logo.png 访问。
```



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





## @RequestBody和@ResponseBody注解的作用？

`@RequestBody` 和 `@ResponseBody` 是 Spring MVC 中用于处理 HTTP 请求和响应体的注解

**@RequestBody**

-   **作用**：用于将 HTTP 请求体中的内容绑定到方法参数上，通常与 POST、PUT 等请求一起使用。
-   工作原理
    -   Spring 使用消息转换器（HttpMessageConverter）**将请求体的内容（如 JSON 或 XML）转换为 Java 对象。**
    -   常见的消息转换器包括 `MappingJackson2HttpMessageConverter`（用于 JSON）、`MappingJackson2XmlHttpMessageConverter`（用于 XML）等。

```java
@PostMapping("/users")
public User createUser(@RequestBody User user) {
    // 将请求体中的 JSON/XML 数据自动转换为 User 对象
    return userService.save(user);
}
```

注意事项

-   请求体必须符合指定的格式（如 JSON 或 XML），否则会抛出 `HttpMessageNotReadableException`。
-   需要确保配置了适当的消息转换器以支持所需的数据格式。

**@ResponseBody**

-   **作用**：用于将方法返回值直接写入 HTTP 响应体中，通常与 GET、POST 等请求一起使用。
-   工作原理
    -   Spring 使用消息转换器**将返回的 Java 对象转换为指定格式（如 JSON 或 XML）**，然后将其作为响应体发送给客户端。

```java
@GetMapping("/users/{id}")
@ResponseBody
public User getUser(@PathVariable Long id) {
    // 返回的 User 对象将被自动转换为 JSON/XML 并写入响应体
    return userService.findById(id);
}
```

注意事项

-   如果返回的是复杂对象或集合，确保对象结构适合序列化为 JSON 或 XML。
-   可以通过 `produces` 属性指定响应的内容类型（如 `application/json` 或 `application/xml`）



## @RestController

`@RestController` 是 用于标记一个类作为 RESTful 控制器。这个注解实际上是 `@Controller` 和 `@ResponseBody` 注解的组合。

如果一个控制器的所有方法都需要返回响应体，则可以使用 `@RestController` 注解替代每个方法上的 `@ResponseBody`。

**`@Controller` 注解**

`@Controller` 是 Spring MVC 中的一个基本注解，用于标记一个类作为控制器。控制器负责处理 HTTP 请求，并将结果返回给客户端。通常，控制器中的方法会返回一个视图名或一个 View 对象，用于渲染 HTML 页面。

**`@ResponseBody` 注解**

`@ResponseBody` 是另一个重要的注解，用于标记方法的返回值将被写入到 HTTP 响应体中，而不是用来选择一个视图进行渲染。如果一个方法没有使用 `@ResponseBody` 注解，则其返回值通常会被解释为视图名。

**`@RestController` 注解**

`@RestController` 注解是这两个注解的结合体。它不仅标记了一个类作为控制器，还指示了该控制器的所有方法都应该将其返回值写入到 HTTP 响应体中，而不是用来选择一个视图进行渲染。这意味着，使用 `@RestController` 注解的控制器非常适合用于构建 RESTful API

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        // 自动应用 @ResponseBody
        return userService.findById(id);
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        // 自动应用 @RequestBody 和 @ResponseBody
        return userService.save(user);
    }
}
```

`UserController` 被标记为一个 RESTful 控制器。`getUser()` 、`createUser`方法都返回一个 `User` 对象，Spring MVC 会自动将其序列化为 JSON 或 XML 等格式，并写入到 HTTP 响应体中。

**总结**

`@RestController` 注解使得开发者可以更方便地构建 RESTful API，简化了代码并提高了开发效率。





## @PathVariable注解的作用？



## @ModelAttribute注解的作用？



## @RequestHeader和@CookieValue注解的作用？



## @SessionAttribute注解的作用？



## Spring WebFlux是什么？它与Spring MVC有何不同？	