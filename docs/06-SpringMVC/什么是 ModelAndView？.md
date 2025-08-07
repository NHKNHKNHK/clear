# 什么是 ModelAndView？

`ModelAndView`用于封装模型数据和视图信息。它允许控制器方法返回一个对象，该对象包含视图名称和模型数据，从而将数据传递给视图进行渲染。

## **`ModelAndView` 的组成部分**

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

## **在视图模板中使用模型数据（假设使用 Thymeleaf）**

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

## **`ModelAndView` 的常用方法**

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

