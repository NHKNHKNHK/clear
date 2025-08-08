# OpenFeign的拦截器是做什么的？

Feign的拦截器主要用于在**请求发送**到远程服务**之前**或**之后**执行一些额外的逻辑。这些逻辑可以包括但不限于：

-   **添加请求头**：可以在请求发送之前添加必要的请求头
    -    比如添加认证信息（如OAuth Token）、用户代理、跟踪ID等。

-   **修改请求参数**：

-   -   可以在请求发送之前修改请求参数，例如对参数进行加密或签名。

-   **修改请求体**：根据业务需求修改请求体的内容。

-   **处理响应**：

-   -   可以在接收到响应之后对响应进行处理，例如检查响应状态码、解析响应体等

-   **日志记录**：记录请求和响应的信息，便于调试和监控。
-   **错误处理**：处理请求过程中的异常情况。
-   **性能监控**：收集请求的耗时等性能指标。

通过使用拦截器，可以灵活地扩展Feign客户端的功能，而无需修改其核心逻辑。这有助于保持代码的整洁，并使功能更容易维护。



## **实现 Feign 拦截器**

Feign中提供的一个拦截器接口：`feign.RequestInterceptor`

```java
public interface RequestInterceptor {

    /**
     * Called for every request. 
     * Add data using methods on the supplied {@link RequestTemplate}.
     */
    void apply(RequestTemplate template);
}
```

我们只需要实现这个接口，然后实现apply方法，利用RequestTemplate类来添加请求头

示例：

```java
import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate template) {
                // 添加请求头
                template.header("Authorization", "Bearer " + getAccessToken());

                // 记录请求日志
                System.out.println("Request: " + template.request());
            }

            private String getAccessToken() {
                // 获取访问令牌的逻辑
                return "your-access-token";
            }
        };
    }
}
```

## **使用 Feign 拦截器**

要使用自定义的 Feign 拦截器，只需要在 FeignClient配置中引用这个配置类即可。例如：

```java
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "example-client", url = "https://api.example.com", configuration = FeignConfig.class)
public interface ExampleClient {

    @GetMapping("/data")
    String getData(@RequestParam("param") String param);
}
```

