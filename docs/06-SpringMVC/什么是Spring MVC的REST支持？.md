# 什么是Spring MVC的REST支持？

Spring MVC的REST支持是指Spring MVC框架提供的一系列特性和工具，用于简化构建RESTful Web服务的过程。REST（Representational State Transfer）是**一种架构风格**，用于设计网络应用程序，特别是Web应用程序。它基于HTTP协议，使用标准的HTTP方法（如GET、POST、PUT、DELETE）来操作资源。

## **主要特点**

-   **资源导向设计**：RESTful Web服务围绕资源进行设计，每个资源通过唯一的URL标识，并使用标准的HTTP方法（如GET、POST、PUT、DELETE等）来操作这些资源。
-   **无状态通信**：客户端与服务器之间的每次交互都是独立的，服务器不会保存客户端的状态信息。
-   **统一接口**：通过一致的API设计，简化了客户端和服务端的交互模式。

## **Spring MVC的几个REST支持特性**

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

