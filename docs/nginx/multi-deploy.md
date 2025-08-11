# 单服务器如何部署多个网站？

:::tip
在没有域名情况下，在一个nginx中部署多个网站，我们可以通过端口号来区分

当然也可以通过配置不同目录来访问（使用同一端口号）
:::

## 通过端口号区分

```txt{3,12,21}
# 项目一
server {
    listen 81;
    server_name 192.168.188.150;
	location / {
      root /www/wwwroot/mobile-fluid;
	  index index.html index.htm;
    }
}
# 项目二
server {
    listen 82;
    server_name 192.168.188.150;
	location / {
      root /www/wwwroot/mobile-rem-vw;
	  index index.html index.htm;
    }
}
# 项目三
server {
    listen 83;
    server_name 192.168.188.150;
	location / {
      root /www/wwwroot/mobile-responsive;
	  index index.html index.htm;
    }
}
```

在浏览器中访问不同的项目，只需要带上端口号即可，如下：

- 项目一：http://192.168.188.150:81/
- 项目二：http://192.168.188.150:82/
- 项目三：http://192.168.188.150:83/

## 通过配置不同目录来区分

将需要部署的项目全部放在`/www/wwwroot/project`目录中

```txt{5}
server {
    listen 80;
    server_name 192.168.188.150;
	location / {
      root /www/wwwroot/project;
	  index index.html index.htm;
    }
}
```


按不同目录单独存放静态网站源文件，访问不同项目时需要加上目录名称，如下：

- 项目一：http://192.168.188.150/mobile-fluid
- 项目二：http://192.168.188.150/mobile-rem-vw
- 项目三：http://192.168.188.150/mobile-responsive
