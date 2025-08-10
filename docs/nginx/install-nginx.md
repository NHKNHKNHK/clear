# 通过 yum 方式安装 Nginx

- 1、安装先决条件

```shell
# 升级所有包同时也升级软件和系统内核
yum update
# 安装yum依赖
yum install yum-utils
```

- 2、添加 yum 源文件

```shell
cd /etc/yum.repos.d/
# 添加nginx的yum源码
vim nginx.repo

# 或 直接新建 nginx.repo 文件
vim /etc/yum.repos.d/nginx.repo
```
- 3、添加配置信息到 nginx.repo 文件中

```shell
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true

[nginx-mainline]
name=nginx mainline repo
baseurl=http://nginx.org/packages/mainline/centos/$releasever/$basearch/
gpgcheck=1
enabled=0
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
```
:::tip
一般在阿里云等ECS服务器中可以省略以上步骤

从步骤 4 开始，云厂商已经具备相关依赖并默认已经指定 yum 源，可直接执行 `yum install nginx` 一键安装即可
:::

- 4、安装 Nginx

```shell
yum install -y nginx
# yum install nginx
# 如果使用yum install xxxx，会找到安装包之后，询问你Is this OK[y/d/N]，需要你手动进行选择。
# 但是如果加上参数-y，就会自动选择y，不需要你再手动选择！
```

- 5、查看 Nginx 的版本号

```shell
nginx -v

# 显示nginx的版本号和编译信息
nginx -V
```

- 6、查看 Nginx 安装相关的文件位置信息

```shell
whereis nginx
```

- 7、启动 Nginx

```shell
cd /usr/sbin/
./nginx

# 或
/usr/sbin/nginx
```

- 8、判断 Nginx 是否运行成功

:::tip
在 linux 系统中运行的每个应用程序都会产生一个进程，可通过查看 nginx 进程是否存在来判断 nginx 是否运行成功。

或者查看 Nginx 是否正在运行中 ！
:::

```shell
ps -ef  | grep nginx
```

**查看 nginx 的进程id**

```shell
ps -C nginx -o pid
```

## nignx 目录结构

Nginx 目录结构

```txt
# Nginx终端管理理命令
/usr/sbin/
# 启动 Nginx
/usr/sbin/nginx

# Nginx 配置
/etc/nginx
/etc/nginx/nginx.conf
/etc/nginx/conf.d
/etc/nginx/conf.d/default.conf

# Nginx模块目录
/usr/lib64/nginx

# 默认站点目录
/usr/share/nginx
```

具体说明

| 路径                                                         | 类型     | 作用                         |
| :----------------------------------------------------------- | :------- |:---------------------------|
| /etc/nginx /etc/nginx/nginx.conf /etc/nginx/conf.d /etc/nginx/conf.d/default.conf | 配置文件 | Nginx 主配置文件                |
| /etc/nginx/fastcgi_params /etc/nginx/scgi_params /etc/nginx/uwsgi_params | 配置文件 | Cgi、Fastcgi、Uwcgi 配置文件     |
| /etc/nginx/win-utf /etc/nginx/koi-utf /etc/nginx/koi-win     | 配置文件 | Nginx 编码转换映射文件             |
| /etc/nginx/mime.types                                        | 配置文件 | http 协议的 Content-Type 与扩展名 |
| /usr/lib/systemd/system/nginx.service                        | 配置文件 | 配置系统守护进程管理器                |
| /etc/logrotate.d/nginx                                       | 配置文件 | Nginx 日志轮询,日志切割            |
| /usr/sbin/nginx /usr/sbin/nginx-debug                        | 命令     | Nginx 终端管理理命令              |
| /etc/nginx/modules /usr/lib64/nginx /usr/lib64/nginx/modules | 目录     | Nginx 模块目录                |
| /usr/share/nginx /usr/share/nginx/html /usr/share/nginx/html/50x.html /usr/share/nginx/html/index.html | 目录     | 默认站点目录                     |
| /usr/share/doc/nginx-1.12.2 /usr/share/man/man8/nginx.8.gz   | 目录     | Nginx 的帮助手册                |
| /var/cache/nginx                                             | 目录     | Nginx 的缓存目录                |
| /var/log/nginx                                               | 目录     | Nginx 的日志目录                |


## Nginx 常用命令

```shell
# 修改配置文件后重新加载生效
nginx -s reload

# 快速停止或关闭Nginx服务
nginx -s stop  # 或 杀掉Nginx进程

# 完整有序的停止Nginx
nginx -s quit

# 查询运行文件所在路径
which nginx

# 检查 nginx 配置文件的正确性
nginx -t
```

## 完全卸载 Nginx

:::tip
卸载 Nginx 前，需要先停止 Nginx 服务器
:::

- 停止 Nginx 服务

```shell
## 方式一
# 查看 nginx 的运行进程
ps -ef  | grep nginx
# 直接停止或关闭 nginx
nginx -s stop
# 再次查看 nginx 的运行进程
ps -ef  | grep nginx


## 方式二
# 查看 nginx 的运行进程
ps -ef | grep nginx
# 杀掉 nginx的进程 注：19075 19076 进程的PID值 每次启动都会不一样
kill -9 19075 19076
# 再次查看 nginx 的运行进程
ps -ef | grep nginx
```

- 查找根下所有名字包含 nginx 的文件

```shell
find / -name nginx
```

- 执行命令 `rm -rf *` 删除 nginx 安装的相关文件

```shell
rm -rf 文件路径*

# 为保证准确无误的删除每一个目录和文件，建议逐个删除
```

- 其他

:::tip
如果设置了 Nginx 开机自启动的话，可能还需要下面两步
:::

```shell
chkconfig nginx off
rm -rf /etc/init.d/nginx
```

- yum 清理相关依赖和软件包

```shell
yum remove nginx
```

## Nginx 静态网站部署

使用nginx部署静态网站很简单，分为 简单部署 和 企业级项目部署 两种方式

简单部署，直接进入 Nginx 的默认站点静态文件目录`/usr/share/nginx/html` 将项目文件上传记得访问

但是不建议这么做，生成环境不建议

