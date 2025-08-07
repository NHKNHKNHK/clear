# 如何在SpringMVC中处理JSON数据？


处理 JSON 数据主要涉及两个方面：接收 JSON 数据和返回 JSON 数据

## **接收JSON数据**

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

## **返回JSON数据**

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
