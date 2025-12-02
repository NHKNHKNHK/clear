# 如何在 Spring MVC 中实现跨域资源共享（CORS）

## **口语化**

跨域指的是浏览器在执行网页在JavaScript代码时由于浏览器的**同源策略**的限制，只能访问同源的资源。

同源策略是一种浏览器安全策略。同源指的是要求网页中的所有资源必须来源于同一个域名、协议和端口，否则浏览器会阻止跨域的资源请求。

所以，如果在浏览器访问过程中发现域名、端口或者协议不同的时候，就会出现跨域问题。

而解决跨域问题的方法就是在不破坏同源策略的情况下，能够安全的实现数据的共享与交互。

常见的解决跨域问题的方案有CORS、JSONP、前端代理服务器等

其中CORS是一种在服务器后端解决跨域的方案，它的工作原理非常简单，如果一个网站需要访问另一个网站的资源，浏览器会先发出一个`OPTION`请求（预检请求），根据服务端返回的`Access-Control-Allow-Orgin`等响应头信息，来决定是否允许跨域请求，如果允许才会真正发起请求。所以只需要在服务端配置这类响应头即可。

还是就是JSONP，它是早期解决跨域的方案，不过只能处理GET请求，现在已经不常用了。

::: tip

补充一下，除了在后端解决跨域，还可以在前端解决。例如：

- 使用Nginx配置代理服务器

- 使用前端脚手架工具，如Vite、Webpack等搭建前端代理服务器（需要注意的是，这种方式只在开发阶段有效）

:::

在Spring项目中，配置CORS常见的有两种方案

- 方案一，局部配置：通过使用`@CrossOrigin`注解，这个注解可以用在控制器类上或控制器方法上。
- 方案二，全局配置：实现 `WebMvcConfigurer` 接口并重写 `addCorsMappings` 方法，这是一个全局处理的方案

> 此外还可以通过过滤器、Spring Security等配置CORS

## **什么是跨域**

前端跨域问题是一个很常见的网络安全策略问题，主要是由于浏览器的**同源策略**（Same-origin policy）的限制。

同源策略限制了一个源（域名、协议、端口）的文档或脚本与另一个源的资源进行交互。这是为了防止恶意文档窃取数据或进行其他危害行为。

> **同源**：协议、域名和端口号都相同。
>
> 1. **不同协议**：`http://example.com` 和 `https://example.com`
> 2. **不同域名**：`http://example1.com` 和 `http://example2.com`
> 3. **不同端口**：`http://example.com:8080` 和 `http://example.com:9090`

解决接口跨域问题的方案主要有：

- **CORS**（主流的解决方案，推荐使用）
- JSONP（有缺陷的解决方案：只支持 GET 请求）
- 配置代理服务器
  - 使用Nginx搭建代理服务器
  - 借助脚手架搭建（例如：Vite、Webpack等）

## **CORS 跨域资源共享**

核心思路：在服务端设置 `Access-Control-Allow-Origin` 等响应头，来声明允许哪些域进行资源共享

:::warning 扩展

**什么是 CORS？**

CORS （Cross-Origin Resource Sharing，跨域资源共享）由一系列 **HTTP 响应头**组成，**这些 HTTP 响应头决定浏览器是否阻止跨域获取资源**。

浏览器的**同源安全策略**默认会阻止网页“跨域”获取资源。但如果接口服务器**配置了 CORS 相关的 HTTP 响应头**， 就可以**解除浏览器端的跨域访问限制**。

:::

## **CORS请求的分类**

客户端在请求 CORS 接口时，根据请求方式和请求头的不同，可以将 CORS 的请求分为两大类，分别是：

- 简单请求
- 预检请求

- **简单请求**：**同时满足**以下两大条件的请求，就属于简单请求：

  - ① **请求方式**：GET、POST、HEAD 三者之一

  - ② **HTTP 头部信息**不超过以下几种字段：无自定义头部字段、Accept、Accept-Language、Content-Language、DPR、Downlink、Save-Data、Viewport-Width、Width 
    - 简单来说：只要不手动修改请求头，一般都能符合该规范，一般都为简单请求
  - Content-Type（只有三个值application/x-www-form-urlencoded、multipart/form-data、text/plain）

- **预检请求** ：只要符合以下**任何一个**条件的请求，都需要进行预检请求：
  - ① 请求方式为 **GET、POST、HEAD 之外的请求 Method 类型**
  - ② 请求头中**包含自定义头部字段** 的请求，比如说自定义header头token
  - ③ 向服务器发送了 **application/json 格式** 的数据

在浏览器与服务器正式通信之前，浏览器**会先发送 OPTION 请求进行预检，以获知服务器是否允许该实际请求**，所以这一次的 OPTION 请求称为“预检请求”。**服务器成功响应预检请求后，才会发送真正的请求，并且携带真实数据。**

## **简单请求和预检请求的区别**

- **简单请求的特点**：客户端与服务器之间只会发生一次请求。

- **预检请求的特点**：客户端与服务器之间会发生两次请求，**OPTION 预检请求成功之后，才会发起真正的请求**

## **常用响应头**

- Access-Control-Allow-Origin：指定哪些源可以访问资源。可以是具体的一个URL（如`http://example.com`），或者`*`表示允许任何源。

- Access-Control-Allow-Methods：指定允许的HTTP方法，如GET, POST, DELETE等。
  - 默认情况下，CORS 仅支持客户端发起 GET、POST、HEAD 请求。如果要支持其他类型则需在此请求头在配置

- Access-Control-Allow-Headers：指定允许的请求头列表，浏览器会在预检请求中使用此头部告知服务器实际请求中会使用哪些头部。否则这次请求会失败
  - 默认情况下，CORS **仅**支持客户端向服务器发送如下的 9 个请求头： Accept、Accept-Language、Content-Language、DPR、Downlink、Save-Data、Viewport-Width、Width  、Content-Type （值仅限于 text/plain、multipart/form-data、application/x-www-form-urlencoded 三者之一）

- Access-Control-Allow-Credentials：指示是否允许发送Cookie。如果这个值是true，Access-Control-Allow-Origin就不能设置为\*，必须指定明确的、与请求网页一致的域名。

- Access-Control-Max-Age：指定预检请求的结果能够被缓存多长时间。

- Access-Control-Expose-Headers：指定允许浏览器访问的服务器响应头。默认情况下，只有6个基本响应头是可以读的：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma

---

**示例**：

```js
res.setHeader('Access-Control-Allow-Origin','*')
res.setHeader('Access-Control-Allow-Methods','POST, GET, DELETE, HEAD')
res.setHeader('Access-Control-Allow-Headers','*')
// 允许客户端额外向服务器发送 Content-Type请求头 和 X-custom-Header请求头
res.setHeader('Access-Control-Allow-Methods','Content-Type, X-custom-Header')
```

## **CORS 的注意事项**

- CORS 主要在**服务器端进行配置**。客户端浏览器**无须做任何额外的配置**，即可请求开启了 CORS 的接口

- CORS 在浏览器中有兼容性。只有支持 XMLHttpRequest Level2 的浏览器，才能正常访问开启了 CORS 的服 

    务端接口（例如：IE10+、Chrome4+、FireFox3.5+）

## **JSONP 接口**

浏览器端通过利用`<script>` 标签的 src 属性，可以跨域加载脚本，请求服务器上的数据，同时，服务器返回一个函数的调用（且不受严格限制的特性）。这种请求数据的方式叫做 JSONP。

:::tip
早期一些浏览器不支持 CORS 的时，可以靠 JSONP 解决跨域。
:::

特点：

- JSONP 不属于真正的 Ajax 请求，因为它没有使用 XMLHttpRequest 这个对象。 
- JSONP **仅支持 GET 请求**，不支持 POST、PUT、DELETE 等请求。

### **实现 JSONP 接口的步骤**

基本流程：

- **第一步**：客户端创建一个`<script>`标签，并将其`src`属性设置为包含跨域请求的 URL，同时准备一个回调函数，这个回调函数用于处理返回的数据。
- **第二步**：服务端接收到请求后，将数据封装在回调函数中并返回。
- **第三步**：客户端的回调函数被调用，数据以参数的形势传入回调函数。

## **在 Spring MVC 中实现跨域资源共享（CORS）**

在 Spring MVC 中实现跨域资源共享（CORS，Cross-Origin Resource Sharing）可以通过多种方式来配置。以下是几种常见的方法：

### 使用`@CrossOrigin`注解

`@CrossOrigin` 是 Spring Framework 提供的一个注解，用于在控制器方法或整个控制器上指定允许的跨域请求。

这是最简单的方法之一，适用于细粒度的跨域控制，可以应用于类或方法级别。

**方法级别**：

```java
@RestController
public class MyController {

    @GetMapping("/api/data")
    @CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
    public List<Data> getData() {
        // 返回数据
    }
}
```

说明：`@CrossOrigin` 注解指定了来自 `http://localhost:3000` 的跨域请求是被允许的，并且设置了预检请求的缓存时间为 3600 秒（1 小时）。

---

**类级别**：

```java
@RestController
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class MyController {

    @GetMapping("/api/data")
    public List<Data> getData() {
        // 返回数据
    }
}
```

说明：所有在 `MyController` 中的方法都将允许来自 `http://localhost:3000` 的跨域请求。

### **配置全局 CORS 支持**

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

说明：创建一个 `CorsConfig` 类，实现了 `WebMvcConfigurer` 接口，并在 `addCorsMappings` 方法中添加了一个全局的 CORS 配置，允许来自 `http://localhost:3000` 的跨域请求。

## **使用过滤器（Filter）**

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

##  **使用 Spring Security 配置 CORS**

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

## **总结**

- **@CrossOrigin 注解**：适合简单的、细粒度的跨域配置。
- **全局配置**：通过 `WebMvcConfigurer` 实现，适用于整个应用程序级别的跨域设置。
- **过滤器**：提供更灵活的配置选项，适用于复杂场景。
- **Spring Security 配置**：当使用 Spring Security 时，确保 CORS 和安全配置一致。

选择合适的方式取决于你的具体需求和应用架构。通常情况下，推荐优先使用 `@CrossOrigin` 或**全局配置**，因为它们更加简洁且易于维护。

## 扩展

### Nginx实现跨域访问

> [Nginx如何实现跨域访问](../nginx/Nginx如何实现跨域访问.md)

### 二级域名跨域吗

二级域名是否跨域，核心取决于 **浏览器的同源策略判定规则**，结论先明确：**默认情况下，不同二级域名属于跨域**，但可通过配置实现跨域互通。

---

**同源策略的判定标准**

浏览器同源策略要求「协议、域名、端口」三者完全一致才视为 “同源”，否则属于跨域。其中 “域名” 的判定是精确匹配（含二级域名）：

- 示例 1：`a.example.com` 与 `b.example.com`

二级域名不同（`a` vs `b`），即使主域名相同，仍属于跨域。

- 示例 2：`example.com` 与 `www.example.com`

前者是主域名，后者是二级域名（`www`是常见二级域名），也属于跨域。

- 示例 3：`https://a.example.com:8080` 与 `http://a.example.com:80`

协议（`https` vs `http`）或端口（`8080` vs `80`）不同，即使二级域名相同，仍跨域。

#### 二级域名跨域的解决方案

设置 `document.domain`（仅适用于二级域名，简单高效）

原理：让不同二级域名的页面共享同一个 “主域名” 上下文，从而突破同源限制。

在所有需要互通的页面中添加代码：

```js
document.domain = "example.com"; // 统一设置为主域名
```

适用场景：

- 仅支持二级域名（如 `a.example.com` ↔ `b.example.com`），不支持跨主域名；
- 需解决 iframe 跨域通信、共享 cookie 等场景。

注意事项：
- 所有页面必须显式设置 `document.domain`，不能只在部分页面设置；
- 仅适用于客户端（浏览器），无法解决 AJAX 跨域请求（仍需配合 CORS 或代理）

> 解决二级跨域问题的其他方式，如代理、CORS、JSONP等，前面都可以说过，这里不再赘述
