# Nginx配置文件结构？

Nginx配置文件（conf/nginx.conf）整体分三部分：

-   **全局块**
-   **events块**
-   **http块**
    -   http全局块
    -   server块
        -   server全局块
        -   location块

注意：

-   http块包含http全局块、server块

-   http块可以配置多个server块，每个server块可以配置多个location块

## **全局块**

从配置文件开始到 events块之间的内容，主要会设置一些影响nginx服务器整体运行的配置指令

主要包括配置运行nginx服务器的用户（组）、运行生成的worker process数，进程PID存放路径、日志存放路径和类型以及配置文件的引入等

例如：worker_processes  1; worker_processes的值越大，可以处理的并发处理量也就越多

## **events块**

events块涉及到的指令主要影响nginx服务器与用户的网络连接

例如：worker_connections  1024; 表示支持的最大连接数为1024

## **http块**

这是nginx服务器配置中最频繁的部分，代理、缓存、日志定义等绝大多数的功能和第三方模块的配置都在这里配置。

注意：

-   http块包含http全局块、server块

-   http块可以配置多个server块，每个server块可以配置多个location块

### **http全局块**

http全局块配置的指令包括文件引入、MIME-TYPE定义、日志自定义、连接超时时间、单链接请求数上限等

### server块

server块与虚拟主机有密切关系，虚拟主机从用户的角度看，和一台独立的硬件主机是完全一样的，该技术的产生主要是为了节省互联网服务器硬件成本。

-   http块可以配置多个server块，而每个server块就相当于一个虚拟主机
-   每个server块又可以分为全局server块和location块
    -   其中location块可以同时包含多个

#### 全局server块

全局server块中最常见的配置是配置本虚拟主机的监听配置和本虚拟主机的名称或IP地址

#### location块

一个server块中可以同时包含多个location块

location块的主要作用是基于nginx服务器接收到的请求字符串（例如：server_name/uri-string），对虚拟主机名称（也可以是IP别名）之外的字符串（例如：前面的/uri-string ）进行匹配，对特点的请求进行处理。如地址定向、数据缓存、应答控制等。

此外，还有许多第三方模块的配置也是在location块中配置

```shell
# 全局块
worker_processes  1;

# events块
events {
    worker_connections  1024;
}

# http块
http {
	# http全局块
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
  
    keepalive_timeout  65;
	
	# server块，server块可以有很多个
	# 每个server块下可以包含多个location块
    server {
    	# 全局server块
        listen       80;
        server_name  localhost;

 
        location / {
            root   html;
            index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }

}
```
