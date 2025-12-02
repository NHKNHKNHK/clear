# Nginx如何实现跨域访问

跨域问题通常发生在浏览器出于安全考虑实施了同源策略（Same-origin policy），当从一个源加载的文档或脚本尝试与另一个源请求资源时，就会触发这种限制。

> 补充：跨域问题只会发生在客户端，服务器之间不存在跨域问题

可以通过在响应头中添加Access-Control-Allow-Origin等相关的跨域头信息来实现跨域访问。

下面是如何在 Nginx 中配置以支持跨域访问的例子：

1. 打开 Nginx 配置文件，通常是 `/etc/nginx/nginx.conf` 或者在 `/etc/nginx/conf.d/` 目录下的某个文件。
2. 在 server 块中针对需要处理跨域请求的服务配置 location 块，添加适当的 CORS (Cross-Origin Resource Sharing) 相关头信息。例如：

```shell
server {
    listen 80;
    server_name yourdomain.com;

    location /api/ {
        if ($request_method = 'OPTIONS') { # 处理预检请求
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';

            return 204;
        }

        add_header 'Access-Control-Allow-Origin' '*'; # 允许任何来源
        # 如果需要限制特定来源，可以改为: add_header 'Access-Control-Allow-Origin' 'http://example.com';
        add_header 'Access-Control-Allow-Credentials' 'true'; # 是否允许发送凭证
        add_header 'Access-Control-Expose-Headers' 'Content-Length,X-JSON'; # 暴露哪些头部给API调用者

        # 你的其他配置...
    }
}
```
