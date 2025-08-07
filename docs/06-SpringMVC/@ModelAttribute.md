# @ModelAttribute

## 口语化

`@ModelAttribute` 注解是 Spring MVC 中用于**绑定请求参数或表单数据到模型对象（Java对象）**的注解。

它能够自动将请求的多个参数（例如 `name=John&email=john@example.com`）映射到对象的字段中。

它可以用于方法参数、方法和控制器类中，以便将请求中的数据绑定到模型对象，并将该对象添加到模型中，以便在视图中使用。


## **适用场景**

-   **表单提交**涉及多个字段的绑定（如用户注册、更新）。
-   需要一次性绑定复杂数据结构

**`@ModelAttribute` 的使用场景**

-   **方法参数**：用于绑定请求参数或表单数据到方法参数，并将该参数添加到模型中。
-   **方法**：用于在处理请求之前准备模型数据。通常用于在处理请求之前初始化一些公共数据。
-   **控制器类**：用于在所有请求处理方法之前初始化模型数据。

### **用于方法参数**

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

### **用于方法**

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

### **用于控制器类**

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

