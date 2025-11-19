# Flume数据流监控

## Ganglia 的部署与安装

Ganglia 由 gmond、gmetad 和 gweb 三部分组成。

-   gmond：Ganglia 监听守护进程，负责收集本地节点的系统信息，并将其发送到 gmetad 或其他 gmond 节点。（每个节点安装）
-   gmetad：Ganglia 元数据守护进程，负责收集所有 gmond 节点发送的系统信息，并将其存储在 RRD 数据库中，以便后续查询和分析。（主节点安装即可）
-   gweb：Ganglia Web 界面，提供了一个基于 Web 的用户界面，用于查询和可视化系统信息。（PHP语言所写）

通过这三个组件的协作，Ganglia 可以实现对分布式系统的实时监控和分析，帮助用户快速发现和解决系统问题。

注意：

​	Ganglia 是由PHP语言所编写。而非JVM框架

### 1）规划

| kk01              | kk02 | kk03 |
| ----------------- | ---- | ---- |
| web、gmated、gmod | gmod | gmod |

### 2）在所有节点安装epel-release

该操作是为了更新yum源

```shell
[nhk@kk01 flume]$ sudo yum -y install epel-release 

[nhk@kk02 flume]$ sudo yum -y install epel-release 

[nhk@kk03 flume]$ sudo yum -y install epel-release 
```

### 3）在kk01上安装

```shell
[nhk@kk01 flume]$ sudo yum -y install ganglia-gmetad

[nhk@kk01 flume]$ sudo yum -y install ganglia-web

[nhk@kk01 flume]$ sudo yum -y install ganglia-gmond
```

### 4）在kk02、kk03上安装

```shell
[nhk@kk02 flume]$ sudo yum -y install ganglia-gmond
	
[nhk@kk03 flume]$ sudo yum -y install ganglia-gmond	
```

### 5）在kk01修改配置文件/etc/httpd/conf.d/ganglia.conf

```shell
[nhk@kk01 flume]$ sudo vim /etc/httpd/conf.d/ganglia.conf
```

参考修改内容如下

```shell
Alias /ganglia /usr/share/ganglia

<Location /ganglia>
  # Require local
  # Require ip 10.1.2.3
  # Require host example.org
  Requeire all granted
</Location>
```

### 6）在kk01修改配置文件 /etc/ganglia/gmetad.conf

```shell
[nhk@kk01 flume]$ sudo vim /etc/ganglia/gmetad.conf
```

参考修改内容如下

```shell
data_source "kk01" kk01
```

### 7）在所有节点修改配置文件 /etc/ganglia/gmond.conf

```shell
[nhk@kk01 flume]$ sudo vim /etc/ganglia/gmond.conf
```

参考修改内容如下

```shell
cluster {
  name = "kk01"
  owner = "unspecified"
  latlong = "unspecified"
  url = "unspecified"
}


# mcast_join = 239.2.11.71
# 数据发送给kk01
host = kk01
port = 8649
ttl = 1

udp_recv_channel {
  mcast_join = 239.2.11.71
  port = 8649
  # 接收来自任意连接的数据
  bind = 0.0.0.0
  retry_bind = true
  # Size of the UDP buffer. If you are handling lots of metrics you really
  # should bump it up to e.g. 10MB or even higher.
  # buffer = 10485760
}

```

我们以kk01为例，kk02、kk03重复上述操作



### 8）在kk01修改配置文件 /etc/selinux/config

```shell
[nhk@kk01 flume]$ sudo vim /etc/selinux/config
```

参考配置如下

```shell
# This file controls the state of SELinux on the system.
# SELINUX= can take one of these three values:
#     enforcing - SELinux security policy is enforced.
#     permissive - SELinux prints warnings instead of enforcing.
#     disabled - No SELinux policy is loaded.
SELINUX=disabled
# SELINUXTYPE= can take one of three values:
#     targeted - Targeted processes are protected,
#     minimum - Modification of targeted policy. Only selected processes are protected. 
#     mls - Multi Level Security protection.
SELINUXTYPE=targeted
```

提示：selinux本次生效关闭必须重启，如果此时不想重启，可以使用如下命令临时生效

```shell
[nhk@kk01 flume]$ sudo setenforce 0
```

### 9）启动ganglia

在 kk01、kk02、kk03启动

```shell
[nhk@kk01 flume]$ sudo systemctl start gmond

[nhk@kk02 flume]$ sudo systemctl start gmond

[nhk@kk03 flume]$ sudo systemctl start gmond
```

在 kk01 启动

```shell
[nhk@kk01 flume]$ sudo systemctl start httpd

[nhk@kk01 flume]$ sudo systemctl start gmetad
```

##  10）打开网页浏览 ganglia 页面

```
http://kk01/ganglia
```

提示：

​	如果完成上述操作以后，依然出现权限不足错误，可以修改 /var/lib/ganglia 目录的权限

```shell
sudo chmod -R 777 /var/lib/ganglia
```

## 操作Flume 测试监控

### 1）启动flume任务

```shell
[nhk@kk01 flume]$ bin/flume-ng agent -n a1 -c conf/ -f job/nc-flume-log.conf -Dflume.monitoring.type=ganglia -Dflume.monitoring.hosts=kk01:8649

```

### 2）使用nc工具发送数据观察 ganglia 监控图

```shell
[nhk@kk01 ~]$ nc localhost 44444
```
