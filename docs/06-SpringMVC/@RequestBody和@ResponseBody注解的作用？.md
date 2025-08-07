# @RequestBody和@ResponseBody注解的作用？

`@RequestBody` 和 `@ResponseBody` 是 Spring MVC 中用于处理 HTTP 请求和响应体的注解

## **@RequestBody**

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

## **@ResponseBody**

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
