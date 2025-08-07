# 如何在 Spring MVC 中使用模板引擎（如 Thymeleaf）？

## **1、添加依赖**

在项目的 `pom.xml` 文件中添加 Thymeleaf 的依赖项：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

## **2、配置 Thymeleaf**

Spring Boot 自动配置了 Thymeleaf，但你可以通过修改 `application.properties` 或 `application.yml` 来调整默认设置。例如：

```properties
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html
spring.thymeleaf.mode=HTML
spring.thymeleaf.encoding=UTF-8
spring.thymeleaf.cache=false # 开发阶段禁用缓存
```

## **3、创建控制器**

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

## **4、创建模板文件**

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


