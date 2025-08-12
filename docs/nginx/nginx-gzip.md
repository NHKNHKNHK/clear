# Nginx配置Gzip压缩

:::tip
Gzip 是一种用于文件压缩与解压缩的文件格式。

它基于 Deflate 算法，可将文件压缩地更小，从而实现更快的网络传输。

Web服务器与现代浏览器普遍地支持 Gzip，这意味着服务器可以在发送文件之前自动使用 Gzip 压缩文件，而浏览器可以在接收文件时自行解压缩文件。

而对于我们而言，开启 Gzip，不仅能提高网站打开速度，还能节约网站流量，如果购买的服务器是按照使用流量付费，开启 Gzip 就是在为自己省钱。
:::

## 开启 Gzip

Nginx 内置了 `ngx_http_gzip_module` 模块，该模块会拦截请求，并对需要做 Gzip 压缩的文件做压缩

我们只需要在 Nginx 配置文件中开启 Gzip 功能即可

在 nginx 的默认主配置文件`nginx.conf`中，配置如下

（或者在`/etc/nginx/conf.d/`下任意一个配置文件中）

```txt
events {
    use epoll;
    worker_connections 51200;
    multi_accept on;
}

http {
    gzip on;
    gzip_min_length  1k;
    gzip_buffers     4 16k;
    gzip_http_version 1.1;
    gzip_comp_level 6;
    gzip_types application/atom+xml application/geo+json application/javascript application/x-javascript application/json application/ld+json application/manifest+json application/rdf+xml application/rss+xml application/xhtml+xml application/xml font/eot font/otf font/ttf image/svg+xml image/jpeg image/gif image/png text/css text/javascript text/plain text/xml;
    gzip_vary on;
    gzip_disable   "MSIE [1-6]\.";
}
```

::: 注意
修改完 nginx 配置文件后, 需要重启 nginx 服务(`nginx -s reload`)
:::

### 配置文件说明

```txt
# 开启压缩功能，on 表示开启 off 表示关闭，默认是 off
gzip on;

# 表示允许压缩的页面最小字节数，页面字节数从header头的Content-Length中获取。默认值是0，表示不管页面多大都进行压缩，建议设置成大于1K。如果小于1K可能会越压越大。即：小于设置值的文件将不会压缩
gzip_min_length  1k;

# 设置存储压缩结果的缓冲区大小和数量。默认 32 4k/8K，表示32个4K或8K的缓冲区
gzip_buffers 4 32k;

# 设置gzip压缩针对的HTTP协议版本，默认是1.1。因为HTTP1.0可能不完全支持gzip
gzip_http_version 1.1;

# gzip 压缩级别，1-9，数字越大压缩的越好（一般选择4-6），也越占用CPU时间
gzip_comp_level 6;

gzip_types text/css text/xml application/javascript;

# 是否在http header中添加Vary: Accept-Encoding，建议开启
gzip_vary on;

```

## 验证 Gzip 是否成功

方式一：

直接查看网络请求，打开浏览器的调试工具，查看 Network 请求，如果请求响应头的`Content-Encoding`字段为 `gzip`，就表示成功开启了 Gzip

方式二：

通过站长工具验证，打开网页 GZIP 压缩检测 (opens new window)，输入网站，进行查询

https://tool.chinaz.com/gzips/


## 扩展——Nginx 事件处理模型优化

nginx 的连接处理机制在于不同的操作系统会采用不同的 I/O 模型。

- Linux 下，nginx 使用 epoll 的 IO 多路复用模型；
- 在 freebsd 使用 kqueue 的 IO 多路复用模型；
- 在 solaris 使用/dev/pool 方式的 IO 多路复用模型；
- 在 windows 使用的 icop 等等。

```txt
# 事件模型
events {
    # 使用epoll内核模型
    # 说明：在不指定事件处理模型时，nginx默认会自动的选择最佳的事件处理模型服务。
    use epoll;
    # 每一个进程可以处理多少个连接，如果是多核可以将连接数调高 worker_processes * 1024
    worker_connections 51200;
}
```