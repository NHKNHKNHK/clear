# Linux部署ES(单节点、集群)

> 下载地址：https://www.elastic.co/cn/downloads/past-releases/elasticsearch-7-8-0

## 单机部署

### 1）上传压缩包

```shell
[nhk@kk01 software]$ pwd
/opt/software
[nhk@kk01 software]$ ll | grep -i elastic
-rw-rw-r--.  1 nhk nhk 319112561 Sep 10 13:42 elasticsearch-7.8.0-linux-x86_64.tar.gz
```

### 2）解压

解压到 /opt/software 目录

```shell
[nhk@kk01 software]$ tar -zxvf elasticsearch-7.8.0-linux-x86_64.tar.gz -C /opt/software/

[nhk@kk01 software]$ ll | grep elasticsearch-7.8.0
drwxr-xr-x.  9 nhk nhk       155 Jun 15  2020 elasticsearch-7.8.0
-rw-rw-r--.  1 nhk nhk 319112561 Sep 10 13:42 elasticsearch-7.8.0-linux-x86_64.tar.gz

[nhk@kk01 elasticsearch-7.8.0]$ ll
total 568
drwxr-xr-x.  2 nhk nhk   4096 Jun 15  2020 bin
drwxr-xr-x.  3 nhk nhk    169 Sep 10 13:45 config
drwxr-xr-x.  9 nhk nhk    107 Jun 15  2020 jdk	# ES内置的JDK
drwxr-xr-x.  3 nhk nhk   4096 Jun 15  2020 lib
-rw-r--r--.  1 nhk nhk  13675 Jun 15  2020 LICENSE.txt
drwxr-xr-x.  2 nhk nhk      6 Jun 15  2020 logs
drwxr-xr-x. 47 nhk nhk   4096 Jun 15  2020 modules
-rw-r--r--.  1 nhk nhk 544318 Jun 15  2020 NOTICE.txt
drwxr-xr-x.  2 nhk nhk      6 Jun 15  2020 plugins
-rw-r--r--.  1 nhk nhk   8165 Jun 15  2020 README.asciidoc
```

### 3）创建用户

因为安全问题， Elasticsearch 不允许 root 用户直接运行，所以要创建新用户，在 root 用户中创建新用户

注意：我们使用的nhk用户就是普通用户，所以可以跳过此步骤

```shell
# useradd es #新增 es 用户
# passwd es #为 es 用户设置密码
# userdel -r es #如果错了，可以删除再加
# chown -R es:es /opt/software/es #文件夹所有者
```

### 4）修改配置文件

#### elasticsearch.yml

修改/opt/software/elasticsearch-7.8.0/config/elasticsearch.yml文件

```shell
[nhk@kk01 config]$ pwd
/opt/software/elasticsearch-7.8.0/config
[nhk@kk01 config]$ vim elasticsearch.yml 
```

文件末尾加入如下配置

```yaml
cluster.name: elasticsearch
node.name: node-1
network.host: 0.0.0.0
http.port: 9200
cluster.initial_master_nodes: ["node-1"]
```

说明：

- `cluster.name: elasticsearch` 表示集群名称为 elasticsearch
- `node.name: node-1` 表示节点名称为 node-1

#### limits.conf

修改/etc/security/limits.conf

```shell
[nhk@kk01 config]$ sudo vim /etc/security/limits.conf 
```

在文件末尾中增加下面内容

```shell
# 每个进程可以打开的文件数的限制
es soft nofile 65536
es hard nofile 65536
```

#### 20-nproc.conf

修改/etc/security/limits.d/20-nproc.conf

```shell
[nhk@kk01 config]$ sudo vim /etc/security/limits.d/20-nproc.conf
```

在文件末尾中增加下面内容

```shell
# 每个进程可以打开的文件数的限制
es soft nofile 65536
es hard nofile 65536
# 操作系统级别对每个用户创建的进程数的限制
* hard nproc 4096
# 注： * 带表 Linux 所有用户名称
```

#### sysctl.conf

修改/etc/sysctl.conf

```shell
[nhk@kk01 config]$ sudo vim /etc/sysctl.conf 
```

在文件中增加下面内容

```shell
# 一个进程可以拥有的 VMA(虚拟内存区域)的数量,默认值为 65536
vm.max_map_count=655360
```

重新加载

```shell
[nhk@kk01 config]$ sudo sysctl -p
vm.max_map_count = 655360
```

### 5）确保防火墙关闭

```shell
#暂时关闭防火墙
# systemctl stop firewalld
#永久关闭防火墙
# systemctl enable firewalld.service #打开防火墙永久性生效，重启后不会复原
# systemctl disable firewalld.service #关闭防火墙，永久性生效，重启后不会复原
```

### 6）启动ES

```shell
#启动
$ bin/elasticsearch
#后台启动
$ bin/elasticsearch -d
```

### 7）测试

浏览器输入 `http://kk01:9200/`

看到如下信息：

```json
{
  "name" : "node-1",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "E4UBBiJcRBy7pGwNKM4dLg",
  "version" : {
    "number" : "7.8.0",
    "build_flavor" : "default",
    "build_type" : "tar",
    "build_hash" : "757314695644ea9a1dc2fecd26d1a43856725e65",
    "build_date" : "2020-06-14T19:35:50.234439Z",
    "build_snapshot" : false,
    "lucene_version" : "8.5.1",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

## 集群部署

### 1）上传压缩包

```shell
[nhk@kk01 software]$ pwd
/opt/software
[nhk@kk01 software]$ ll | grep -i elastic
-rw-rw-r--.  1 nhk nhk 319112561 Sep 10 13:42 elasticsearch-7.8.0-linux-x86_64.tar.gz
```

### 2）解压

解压到 /opt/software 目录

```shell
[nhk@kk01 software]$ tar -zxvf elasticsearch-7.8.0-linux-x86_64.tar.gz -C /opt/software/

[nhk@kk01 software]$ ll | grep elasticsearch-7.8.0
drwxr-xr-x.  9 nhk nhk       155 Jun 15  2020 elasticsearch-7.8.0
-rw-rw-r--.  1 nhk nhk 319112561 Sep 10 13:42 elasticsearch-7.8.0-linux-x86_64.tar.gz

[nhk@kk01 elasticsearch-7.8.0]$ ll
total 568
drwxr-xr-x.  2 nhk nhk   4096 Jun 15  2020 bin
drwxr-xr-x.  3 nhk nhk    169 Sep 10 13:45 config
drwxr-xr-x.  9 nhk nhk    107 Jun 15  2020 jdk	# ES内置的JDK
drwxr-xr-x.  3 nhk nhk   4096 Jun 15  2020 lib
-rw-r--r--.  1 nhk nhk  13675 Jun 15  2020 LICENSE.txt
drwxr-xr-x.  2 nhk nhk      6 Jun 15  2020 logs
drwxr-xr-x. 47 nhk nhk   4096 Jun 15  2020 modules
-rw-r--r--.  1 nhk nhk 544318 Jun 15  2020 NOTICE.txt
drwxr-xr-x.  2 nhk nhk      6 Jun 15  2020 plugins
-rw-r--r--.  1 nhk nhk   8165 Jun 15  2020 README.asciidoc
```

### 3）创建用户

因为安全问题， Elasticsearch 不允许 root 用户直接运行，所以要创建新用户，在 root 用户中创建新用户

注意：我们使用的nhk用户就是普通用户，所以可以跳过此步骤

```shell
# useradd es #新增 es 用户
# passwd es #为 es 用户设置密码
# userdel -r es #如果错了，可以删除再加
# chown -R es:es /opt/software/es #文件夹所有者
```

### 4）修改配置文件

#### elasticsearch.yml

修改/opt/software/elasticsearch-7.8.0/config/elasticsearch.yml文件

```shell
[nhk@kk01 config]$ pwd
/opt/software/elasticsearch-7.8.0/config
[nhk@kk01 config]$ vim elasticsearch.yml 
```

文件末尾加入如下配置

```yaml
#集群名称
cluster.name: cluster-es
#节点名称， 每个节点的名称不能重复
node.name: node-1
#ip 地址， 每个节点的地址不能重复
network.host: kk01
#是不是有资格主节点
node.master: true
node.data: true
http.port: 9200
# head 插件需要这打开这两个配置
http.cors.allow-origin: "*"
http.cors.enabled: true
http.max_content_length: 200mb
#es7.x 之后新增的配置，初始化一个新的集群时需要此配置来选举 master
cluster.initial_master_nodes: ["node-1"]
#es7.x 之后新增的配置，节点发现
discovery.seed_hosts: ["kk01:9300","kk02:9300","kk03:9300"]
gateway.recover_after_nodes: 2
network.tcp.keep_alive: true
network.tcp.no_delay: true
transport.tcp.compress: true
#集群内同时启动的数据任务个数，默认是 2 个
cluster.routing.allocation.cluster_concurrent_rebalance: 16
#添加或删除节点及负载均衡时并发恢复的线程个数，默认 4 个
cluster.routing.allocation.node_concurrent_recoveries: 16
#初始化数据恢复时，并发恢复线程的个数，默认 4 个
cluster.routing.allocation.node_initial_primaries_recoveries: 16
```

#### limits.conf

修改/etc/security/limits.conf

```shell
[nhk@kk01 config]$ sudo vim /etc/security/limits.conf 
```

在文件末尾中增加下面内容

```shell
# 每个进程可以打开的文件数的限制
es soft nofile 65536
es hard nofile 65536
```

#### 20-nproc.conf

修改/etc/security/limits.d/20-nproc.conf

```shell
[nhk@kk01 config]$ sudo vim /etc/security/limits.d/20-nproc.conf
```

在文件末尾中增加下面内容

```shell
# 每个进程可以打开的文件数的限制
es soft nofile 65536
es hard nofile 65536
# 操作系统级别对每个用户创建的进程数的限制
* hard nproc 4096
# 注： * 带表 Linux 所有用户名称
```

#### sysctl.conf

修改/etc/sysctl.conf

```shell
[nhk@kk01 config]$ sudo vim /etc/sysctl.conf 
```

在文件中增加下面内容

```shell
# 一个进程可以拥有的 VMA(虚拟内存区域)的数量,默认值为 65536
vm.max_map_count=655360
```

重新加载

```shell
[nhk@kk01 config]$ sudo sysctl -p
vm.max_map_count = 655360
```

### 5）确保防火墙关闭

```shell
#暂时关闭防火墙
# systemctl stop firewalld
#永久关闭防火墙
# systemctl enable firewalld.service #打开防火墙永久性生效，重启后不会复原
# systemctl disable firewalld.service #关闭防火墙，永久性生效，重启后不会复原
```

### 6）分发ES

```shell
[nhk@kk01 software]$ scp -r elasticsearch-7.8.0 kk02:/opt/software/
[nhk@kk01 software]$ scp -r elasticsearch-7.8.0 kk03:/opt/software/
```

修改kk02上的/opt/software/elasticsearch-7.8.0/config/elasticsearch.yml文件

```shell
[nhk@kk02 elasticsearch-7.8.0]$ vim config/elasticsearch.yml 
```

参考如下：

```yaml
#节点名称， 每个节点的名称不能重复
node.name: node-2
#ip 地址， 每个节点的地址不能重复
network.host: kk02
```

修改kk03上的/opt/software/elasticsearch-7.8.0/config/elasticsearch.yml文件

```shell
[nhk@kk03 elasticsearch-7.8.0]$ vim config/elasticsearch.yml 
```

参考如下：

```yaml
#节点名称， 每个节点的名称不能重复
node.name: node-3
#ip 地址， 每个节点的地址不能重复
network.host: kk03
```

### 7）分发系统文件 limits.conf  sysctl.conf    20-nproc.conf

为了简单，我们使用自定义分发脚本

```shell
[nhk@kk01 ~]$ sudo ~/bin/xsync /etc/security/limits.conf

[nhk@kk01 ~]$ sudo ~/bin/xsync /etc/sysctl.conf

[nhk@kk01 ~]$ sudo ~/bin/xsync /etc/security/limits.d/20-nproc.conf
```

分发完以后，为kk01、kk02、kk03重新打开新的终端

### 8）启动ES

三台服务器都要执行如下命令

```shell
#启动
$ bin/elasticsearch
#后台启动
$ bin/elasticsearch -d
```

kk01、kk02、kk03都已经启动后，查看ES进程

```shell
[nhk@kk01 ~]$ jpsall 
=========kk01=========
6265 Jps
6027 Elasticsearch
=========kk02=========
5237 Jps
4970 Elasticsearch
=========kk03=========
4613 Jps
4344 Elasticsearch
```

### 7）查看集群

浏览器输入：`http://kk01:9200/_cat/nodes`

查看到如下结果：

```
192.168.188.129 32 76  0 0.20 0.09 0.08 dilmrt - node-2
192.168.188.130 24 73 34 0.44 0.15 0.11 dilmrt - node-3
192.168.188.128 19 71  1 0.23 0.11 0.08 dilmrt * node-1
```

## 可能会出现的问题

报错：`java.lang.RuntimeException: can not run elasticsearch as root`
原因：

​	不能以root用户启动es，需要创建并切换到es用户：

```shell
# useradd es #新增 es 用户
# passwd es #为 es 用户设置密码
# userdel -r es #如果错了，可以删除再加
# chown -R es:es /opt/software/es #文件夹所有者
```

报错：**max file descriptors [4096] for elasticsearch process is too low, increase to at least [65535]**

原因：

​	ElasticSearch进程的最大文件描述大小需要65535，而当前是4096，解决办法是修改 /etc/security/limits.conf 文件，在末尾加上（存在则修改，数值不能比要求的小）：

```shell
[nhk@kk01 elasticsearch-7.8.0]$ sudo vim /etc/security/limits.conf
```

```shell
#添加配置
* soft nofile 65535
* hard nofile 65535
```

配置完以后，重新启动终端即可

报错：**ERROR: [1] bootstrap checks failed**
**[1]: max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]**
ERROR: Elasticsearch did not exit normally - check the logs at /opt/software/elasticsearch-7.8.0/logs/cluster-es.log

原因：

​	es最大虚拟内存太低

​	最大虚拟内存太小（vm.max_map_count配置），至少需要262144，当前为65530，解决办法是修改 /etc/sysctl.conf 文件，在末尾加上（存在则修改，数值不能比要求的小）：

```shell
[nhk@kk01 elasticsearch-7.8.0]$ sudo vim /etc/sysctl.conf 
```

```shell
# 添加配置
vm.max_map_count=262144
```

执行sudo sysctl -p 立即生效。



集群无法启动的问题

报错：**"is a different node instance"**

解决：

​	1）确保每个节点的配置文件中的 `node.name` 和 `node.id` 参数应该是不同的，以确保每个节点都有唯一的标识符

​	2）确保所有节点的数据目录（/opt/software/elasticsearch-7.8.0/data/）在集群正常启动之前是干净的，并且不包含其他节点的数据
