# @RequestParam

## 口语化

`@RequestParam` 注解是 Spring MVC 中用于**将请求参数绑定到处理方法的参数上**的注解。

可以用于从 URL查询参数（query参数）、表单数据或其他请求参数中提取值，并将这些值传递给控制器方法参数上

通常用于处理简单的键值对参数

## **特点**

-   从 URL 查询参数（`?key=value`）或表单数据中获取值。
-   可以设置 `required = false` 来允许参数为空。
-   支持默认值：`@RequestParam(defaultValue = "zs")`。

## **`@RequestParam` 的基本用法**

### **绑定单个请求参数**

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

### **指定请求参数名称**

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

### **设置请求参数的默认值**

可以通过 defaultValue 属性设置请求参数的默认值：

```java
@GetMapping("/greet")
@ResponseBody
public String greetUser(@RequestParam(value = "name", defaultValue = "Guest") String name) {
    return "Hello, " + name;
}
```

  如果请求 URL 中没有 `name` 参数，那么 `name` 参数的默认值将是 `Guest`

### **请求参数为可选**

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

### **绑定多个请求参数**

```java
@GetMapping("/user")
@ResponseBody
public String getUserInfo(@RequestParam String name, @RequestParam int age) {
    return "User: " + name + ", Age: " + age;
}
```

`name` 和 `age` 请求参数将分别绑定到方法参数 `name` 和 `age` 上。

如果请求 URL 是 `/user?name=John&age=30`，那么方法参数 `name` 的值将是 `John`，`age` 的值将是 `30`。

### **绑定到集合类型**

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


