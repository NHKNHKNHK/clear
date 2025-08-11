# Nginx 配置文件解读

nginx的核心配置文件为`nginx.conf`，一般存在于`/etc/nginx/nginx.conf`

```txt
# Nginx 全局块，配置影响nginx全局的指令。
#   一般有运行nginx服务器的用户组，nginx进程pid存放路径，日志存放路径，配置文件引入，允许生成worker process数等。
# 每个指令必须有分号结束

# Nginx的worker进程运行用户以及用户组
user  nginx;
# Nginx开启的进程数，通常应该为当前主机的CPU物理核数;
# auto 表示 和 CPU内核相关，有几个内核，就会开启几个进程
worker_processes  auto;

# 制定日志路径，级别。这个设置可以放入全局块，http块，server块，级别以此为：debug|info|notice|warn|error|crit|alert|emerg
error_log  /var/log/nginx/error.log notice;
# 指定nginx进程运行文件存放地址
pid        /var/run/nginx.pid;

# events块（事件配置）
# 配置影响nginx服务器或与用户的网络连接。有每个进程的最大连接数，选取哪种事件驱动模型处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化等。
events {
    # 每一个进程可以处理多少个连接，如果是多核可以将连接数调高 worker_processes * 1024
    worker_connections  1024;

    # 设置网路连接序列化，防止惊群现象发生，默认为 on
    # accept_mutex on;
    # 设置一个进程是否同时接受多个网络连接，默认为 off
    # multi_accept on;
    # 事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
    # use epoll;
}

# http块
http {
    # 文件扩展名与文件类型映射表
    include       /etc/nginx/mime.types;
    # 默认文件类型，默认为text/plain
    default_type  application/octet-stream;
    # 自定义日志格式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    # 用了log_format 指令设置了日志格式之后，需要用access_log指令指定日志文件的存放路径；
    access_log  /var/log/nginx/access.log  main;

    # 允许sendfile方式传输文件，默认为off，可以在http块，server块，location块
    sendfile        on;
    # 防止网络阻塞
    #tcp_nopush     on;

    # 连接超时时间，可以在http，server，location块
    keepalive_timeout  65;

    # gzip模块设置
    #gzip  on;

    # 引入系统默认的配置文件
    include /etc/nginx/conf.d/*.conf;
}
```

## Nginx 日志格式 `log_format` 

Nginx 的 log_format 有很多可选的参数用于标示服务器的活动状态，默认的是：

`'$remote_addr - $remote_user [$time_local] "$request" ' '$status $body_bytes_sent "$http_referer" ' '"$http_user_agent" "$http_x_forwarded_for"';`

我们可以根据需要进行修改，具体可设置的参数格式及说明如下：

| 参数                      | 描述                                           | 示例                                                         |
| :------------------------ | :--------------------------------------------- | :----------------------------------------------------------- |
| `$remote_addr`            | 客户端地址                                     | 117.131.64.226                                               |
| `$remote_user`            | 客户端用户名称                                 | - -                                                          |
| `$time_local`             | 访问时间和时区                                 | 24/Aug/2022:09:46:53 +0800                                   |
| `$request`                | 请求的 URI 和 HTTP 协议                        | "GET /./assets/js/48.e1244895.js HTTP/1.1"                   |
| `$http_host`              | 请求地址，即浏览器中你输入的地址（IP 或域名）  | https://www.arryblog.com/guide/css3/css-30-case.html         |
| `$status`                 | HTTP 请求状态                                  | 200                                                          |
| `$upstream_status`        | upstream 状态                                  | 200                                                          |
| `$body_bytes_sent`        | 发送给客户端文件内容大小                       | 3618                                                         |
| `$http_referer`           | url 跳转来源                                   | https://www.baidu.com/                                       |
| `$http_user_agent`        | 用户终端浏览器等信息                           | "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36" |
| `$ssl_protocol`           | SSL 协议版本                                   | TLSv1                                                        |
| `$ssl_cipher`             | 交换数据中的算法                               | RC4-SHA                                                      |
| `$upstream_addr`          | 后台 upstream 的地址，即真正提供服务的主机地址 | 13.27.68.35:80                                               |
| `$request_time`           | 整个请求的总时间                               | 0.165                                                        |
| `$upstream_response_time` | 请求过程中，upstream 响应时间                  | 0.002                                                        |


## 自定义 Nginx 配置文件

自定义 Nginx 配置文件，此操作一般也是用于部署网站，但是我们又不想污染 `nginx.conf` 文件，因此
通过自定义配置文件，然后在 `nginx.conf` 中引入的方式进行

- 1、 在 `/etc/nginx/`目录下新建文件夹 `vhosts`

```shell
cd /etc/nginx/

ls
mkdir vhosts
cd vhosts
```

- 2、新建自定义配置文件`192.168.188.150.conf`

注：现阶段如果还没有域名就可以先使用自己服务器的 IP 代替即可

```shell
# 与域名保持同名，是为了在部署多个项目时，容易区分和管理
vim 192.168.188.150.conf
```

文件内容如下

```txt
server {
    listen 80;
    server_name 192.168.188.150;
	location / {
      # 网站主页路径，依据自己的情况来决定
      # 例如，您的网站运行目录在/workspace/icoding下，则填写/workspace/icoding
      root /workspace/icoding;
	  index index.html index.htm;
    }
}
```

- 3、在`/etc/nginx/nginx.conf`的底部引入这个自定义的配置文件

:::tip 经验
在linux中修改一些配置文件，我们一般会先进行备份

```shell
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
```
:::

在 `nginx.conf` 文件中的引入自定义配置文件

```txt
user  nginx;
worker_processes  auto;

# ...

    # 添加自定义配置文件，用于配置我们自己的域名（导入的自定义配置文件是有先后顺序的）
	include /etc/nginx/vhosts/*.conf;

    include /etc/nginx/conf.d/*.conf;
}
```

引入自定义配置文件，会通过如下命令检查配置文件的语法错误

```shell
nginx -t
```