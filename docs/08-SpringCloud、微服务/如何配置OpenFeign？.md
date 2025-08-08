# 如何配置OpenFeign？

配置 OpenFeign主要涉及以下几个方面：基础配置、自定义配置、日志配置、超时配置、编码器和解码器配置、错误处理配置等。

**1、基础配置**

-   1）添加依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

-   2）启用 Feign 客户端

在主应用程序类上添加 `@EnableFeignClients` 注解，启用 Feign 客户端功能：

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MyApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

##  自定义配置

OpenFeign除了基本的服务远程调用和负载均衡以为，还支持请求和响应数据的压缩、日志增强、超时控制等

### 编码器和解码器

可以自定义编码器和解码器，来处理请求和响应的序列化和反序列化。

-   **编码器（Encoder）**：编码器负责将Java对象转换为可以在HTTP请求中发送的数据格式。例如，如果你有一个Java对象需要作为请求体发送给远程服务，编码器会将这个对象序列化为JSON或其他格式的数据，然后将其设置为HTTP请求的请求体。
-   **解码器（Decoder）**：解码器则负责将HTTP响应体中的数据转换回Java对象。当远程服务返回一个HTTP响应时，解码器会读取响应体中的数据，并将其反序列化为相应的Java对象

```java
import feign.codec.Encoder;
import feign.codec.Decoder;
import feign.jackson.JacksonEncoder;
import feign.jackson.JacksonDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

    @Bean
    public Encoder feignEncoder() {
        return new JacksonEncoder();
    }

    @Bean
    public Decoder feignDecoder() {
        return new JacksonDecoder();
    }
}
```

在 Feign 客户端接口上引用这个配置：

```java
@FeignClient(name = "remote-service", configuration = FeignConfig.class)
public interface RemoteServiceClient {
    // 方法定义
}
```

## # 请求压缩和响应压缩

OpenFeign支持对请求和响应进行gzip压缩，以减少通信过程中的性能损耗

```yaml
feign:
  compression:
    request:
      enabled: true  # 默认不开启
      mime-types: text/html,application/xml,application/json  # 设置压缩的数据类型
      min-request-size: 2048  # 设置触发压缩的下限值，默认2048
    response:
      enabled: true  # 默认不开启
```

### 日志增强

OpenFeign提供日志打印功能，可用通过配置调整日志级别，方便开发是了解请求的细节

Feign为每个FeigenClient提供了一个feign.Logger实例，通过它可用对OpenFeign服务绑定接口的调用情况进行监控

```yaml
logging:
  level:
    com.clear: DEBUG	# 知道FeignClient所在包的日志级别
```

>   补充：
>
>   ​	OpenFeign的日志配置可用单独对某个FeignClient设置（局部配置），也可以为对所有FeignClient统一设置（全局配置）
>
>   ​	配置可以基于配置文件配置，也可以基于Bean配置，上述示例就是基于配置文件

### 超时配置

OpenFeign客户端的默认超时时间为1s，如果服务端处理请求超过1s就会报错。为了避免这种情况，你可以配置 Feign 客户端的连接和读取超时。

```yaml
feign:
  client:
    config:
      default:	# 设置默认的超时时间
        connectTimeout: 2000
        readTimeout: 2000
      微服务名称:	# 设置具体微服务响应超时时间
        connectTimeout: 5000
        readTimeout: 5000
```

###  错误处理

可以自定义错误处理器来处理 Feign 调用中的错误。

```java
import feign.Response;
import feign.codec.ErrorDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignErrorConfig {

    @Bean
    public ErrorDecoder errorDecoder() {
        return new CustomErrorDecoder();
    }

    public class CustomErrorDecoder implements ErrorDecoder {
        @Override
        public Exception decode(String methodKey, Response response) {
            // 自定义错误处理逻辑
            return new RuntimeException("Feign Error: " + response.status());
        }
    }
}
```

在 FeignClient接口上引用这个配置：

```java
@FeignClient(name = "remote-service", configuration = FeignErrorConfig.class)
public interface RemoteServiceClient {
    // 方法定义
}
```

##  高级配置

### 负载均衡

Feign 可以与 Ribbon 集成，提供客户端负载均衡功能。默认情况下，Feign 会使用 Ribbon 进行负载均衡。可以通过配置 Ribbon 来定制负载均衡策略。

```yaml
ribbon:
  eureka:
    enabled: true
  MaxAutoRetries: 1
  MaxAutoRetriesNextServer: 1
  OkToRetryOnAllOperations: true
  ServerListRefreshInterval: 2000
```

>   补充：
>
>   ​	新版的OpenFeign 支持的是loadbalancer

### 断路器

Feign 可以与 Hystrix 集成，实现断路器模式。可以通过配置 Hystrix 来定制断路器行为。

```yaml
feign:
  hystrix:
    enabled: true

hystrix:
  command:
    default:
      execution:
        isolation:
          thread:
            timeoutInMilliseconds: 1000
```


