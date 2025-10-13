# Linux部署ES集群(改进版)

## Elasticsearch 部署

**下载地址**  https://www.elastic.co/cn/downloads/past-releases/elasticsearch-7-8-0

### 1 修改操作系统参数

**因为默认 elasticsearch 是单机访问模式**，就是只能自己访问自己。但是我们会设置成允许应用服务器通过网络方式访问，而且生产环境也是这种方式。这时，Elasticsearch 就会因为嫌弃单机版的低端默认配置而报错，甚至无法启动。所以我们在这里就要把服务器的一些限制打开，能支持更多并发。

#### limits.conf

**问题：max file descriptors [4096] for elasticsearch process likely too low, increase to at least**  

**[65536] elasticsearch**

修改系统允许 Elasticsearch 打开的最大文件数需要修改成 65536

```shell
[nhk@kk01 config]$ sudo vim /etc/security/limits.conf 
```

在文件末尾中增加下面内容

```shell
# 每个进程可以打开的文件数的限制
* soft nofile 65536
* hard nofile 131072
* soft nproc 2048
* hard nproc 65536
```

分发修改的文件

```shell
[nhk@kk01 ~]$ scp -r /etc/security/limits.conf root@kk02:/etc/security/
[nhk@kk01 ~]$ scp -r /etc/security/limits.conf root@kk03:/etc/security/

# 或者使用自定义分发脚本
[nhk@kk01 ~]$ sudo ~/bin/xsync /etc/security/limits.conf
```

#### sysctl.conf

**问题：max virtual memory areas vm.max_map_count [65530] likely too low, increase to** 

**at least [262144]** 

修改一个进程可以拥有的虚拟内存区域的数量

```shell
[nhk@kk01 config]$ sudo vim /etc/sysctl.conf 
```

在文件中增加下面内容

```shell
# 一个进程可以拥有的 VMA(虚拟内存区域)的数量,默认值为 65536
vm.max_map_count=262144
```

分发文件

```shell
[nhk@kk01 ~]$ scp -r /etc/sysctl.conf root@kk02:/etc/
[nhk@kk01 ~]$ scp -r /etc/sysctl.conf root@kk03:/etc/

# 或者使用自定义分发脚本
[nhk@kk01 ~]$ sudo ~/bin/xsync /etc/sysctl.conf
```

重新加载

```shell
[nhk@kk01 config]$ sudo sysctl -p
vm.max_map_count = 655360
```

#### 20-nproc.conf

**问题：max number of threads [1024] for user [judy2] likely too low, increase to at least**  

**[4096] （CentOS7.x 不用改）**

修改允许最大线程数为 4096

```shell
[nhk@kk01 config]$ sudo vim /etc/security/limits.d/20-nproc.conf
```

在文件末尾中增加下面内容

```shell
# 操作系统级别对每个用户创建的进程数的限制
* soft nproc 4096
# 注： * 带表 Linux 所有用户名称
```

分发文件

```shell
[nhk@kk01 ~]$  scp -r /etc/security/limits.d/20-nproc.conf root@kk02:/etc/security/
[nhk@kk01 ~]$  scp -r /etc/security/limits.d/20-nproc.conf root@kk03:/etc/security/

# 或者使用自定义分发脚本
[nhk@kk01 ~]$ sudo ~/bin/xsync /etc/security/limits.d/20-nproc.conf
```

:::warning
重启Linux使配置生效（三个节点都要重启）
:::

### 2 确保防火墙关闭

```shell
#暂时关闭防火墙
# systemctl stop firewalld
#永久关闭防火墙
# systemctl enable firewalld.service #打开防火墙永久性生效，重启后不会复原
# systemctl disable firewalld.service #关闭防火墙，永久性生效，重启后不会复原
```

### 3 集群部署

#### 1）上传压缩包

```shell
[nhk@kk01 software]$ pwd
/opt/software
[nhk@kk01 software]$ ll | grep -i elastic
-rw-rw-r--.  1 nhk nhk 319112561 Sep 10 13:42 elasticsearch-7.8.0-linux-x86_64.tar.gz
```

#### 2）解压

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

#### 3）创建用户（普通用户忽略）

因为安全问题， Elasticsearch 不允许 root 用户直接运行，所以要创建新用户，在 root 用户中创建新用户

注意：我们使用的nhk用户就是普通用户，所以可以跳过此步骤

```shell
# useradd es #新增 es 用户
# passwd es #为 es 用户设置密码
# userdel -r es #如果错了，可以删除再加
# chown -R es:es /opt/software/es #文件夹所有者
```

#### 4）修改配置文件 elasticsearch.yml

修改/opt/software/elasticsearch-7.8.0/config/elasticsearch.yml文件

```shell
[nhk@kk01 config]$ pwd
/opt/software/elasticsearch-7.8.0/config
[nhk@kk01 config]$ vim elasticsearch.yml 
```

文件末尾加入如下配置

```yaml
# ---------------------------------- Cluster -----------------------------------
#集群名称，同一集群名称必须相同
cluster.name: cluster-es

# ------------------------------------ Node ------------------------------------
#节点名称， 每个节点的名称不能重复。例如:node-1,node-2,node-3
node.name: node-1

# ----------------------------------- Memory -----------------------------------
# 把 bootstrap 自检程序关掉
bootstrap.memory_lock: false

# ---------------------------------- Network -----------------------------------
# 允许任意 ip 访问
network.host: 0.0.0.0
# 数据服务端口
http.port: 9200 
# 集群间通信端口
transport.tcp.port: 9300


#是不是有资格主节点
# node.master: true
# node.data: true
# http.port: 9200

# head 插件需要这打开这两个配置
# http.cors.allow-origin: "*"
# http.cors.enabled: true
# http.max_content_length: 200mb

# --------------------------------- Discovery ----------------------------------
#es7.x 之后新增的配置，节点发现（自发现配置：新节点向集群报到的主机名）
discovery.seed_hosts: ["kk01:9300","kk02:9300","kk03:9300"]
#es7.x 之后新增的配置，初始化一个新的集群时需要此配置来选举 master（默认候选 master 节点）
cluster.initial_master_nodes: ["node-1", "node-2", "node-3"]
#集群检测的超时时间（1分钟）和次数（5次）
discovery.zen.fd.ping_timeout: 1m
discovery.zen.fd.ping_retries: 5

#gateway.recover_after_nodes: 2
#network.tcp.keep_alive: true
#network.tcp.no_delay: true
#transport.tcp.compress: true
#集群内同时启动的数据任务个数，默认是 2 个
#cluster.routing.allocation.cluster_concurrent_rebalance: 16
#添加或删除节点及负载均衡时并发恢复的线程个数，默认 4 个
#cluster.routing.allocation.node_concurrent_recoveries: 16
#初始化数据恢复时，并发恢复线程的个数，默认 4 个
#cluster.routing.allocation.node_initial_primaries_recoveries: 16
```

修改 yml 配置的注意事项: 

​	**每行必须顶格，不能有空格** 

​	**“:” 后面必须有一个空格**

#### 5）确保防火墙关闭

```shell
#暂时关闭防火墙
# systemctl stop firewalld
#永久关闭防火墙
# systemctl enable firewalld.service #打开防火墙永久性生效，重启后不会复原
# systemctl disable firewalld.service #关闭防火墙，永久性生效，重启后不会复原
```

#### 学习阶段优化

ES 是用在 Java 虚拟机中运行的，虚拟机默认启动占用 1G 内存。但是如果是装在 PC 机学习用，实际用不了 1 个 G。所以可以改小一点内存；但生产环境一般 31G 内存是标配，这个时候需要将这个内存调大。

```shell
[nhk@kk01 config]$ pwd
/opt/software/elasticsearch-7.8.0/config
[nhk@kk01 config]$ vim jvm.options


-Xms512m
-Xmx512m
```

#### 6）分发ES

```shell
[nhk@kk01 software]$ scp -r elasticsearch-7.8.0 kk02:/opt/software/
[nhk@kk01 software]$ scp -r elasticsearch-7.8.0 kk03:/opt/software/
```

#### 7）修改其他节点的node.name

修改kk02上的/opt/software/elasticsearch-7.8.0/config/elasticsearch.yml文件

```shell
[nhk@kk02 elasticsearch-7.8.0]$ vim config/elasticsearch.yml 
```

参考如下：

```yaml
#节点名称， 每个节点的名称不能重复
node.name: node-2
```

修改kk03上的/opt/software/elasticsearch-7.8.0/config/elasticsearch.yml文件

```shell
[nhk@kk03 elasticsearch-7.8.0]$ vim config/elasticsearch.yml 
```

参考如下：

```yaml
#节点名称， 每个节点的名称不能重复
node.name: node-3
```

#### 8）启动ES

##### 单点启动测试

在kk01上启动ES

```shell
[nhk@kk01 elasticsearch-7.8.0]$ bin/elasticsearch

# 看到如下日志的话ES应该启动成功了
[2023-09-12T13:49:29,378][INFO ][o.e.n.Node               ] [node-1] starting ...
```

查看进程

```shell
[nhk@kk01 ~]$ jps
2469 Elasticsearch
2792 Jps
[nhk@kk01 ~]$ jps -ml
2469 org.elasticsearch.bootstrap.Elasticsearch
2807 sun.tools.jps.Jps -ml
```

**命令行进行测试**（当然也可以使用浏览器）

```shell
[nhk@kk01 ~]$ curl http://kk01:9200
{
  "name" : "node-1",
  "cluster_name" : "cluster-es",
  "cluster_uuid" : "_na_",
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

##### 集群启动测试

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
2469 Elasticsearch
2875 Jps
=========kk02=========
2528 Elasticsearch
2794 Jps
=========kk03=========
2880 Jps
2621 Elasticsearch
```

测试集群

浏览器输入：http://kk01:9200/_cat/nodes

查看到如下结果：

```
192.168.188.129 32 76  0 0.20 0.09 0.08 dilmrt - node-2
192.168.188.130 24 73 34 0.44 0.15 0.11 dilmrt - node-3
192.168.188.128 19 71  1 0.23 0.11 0.08 dilmrt * node-1
```

或者使用命令行

```shell
[nhk@kk01 ~]$ curl http://kk01:9200/_cat/nodes
192.168.188.128 43 75 1 0.04 0.08 0.07 dilmrt * node-1
192.168.188.129 35 59 1 0.08 0.10 0.08 dilmrt - node-2
192.168.188.130 39 59 2 0.17 0.13 0.09 dilmrt - node-3
[nhk@kk01 ~]$ curl http://kk01:9200/_cat/nodes?v
ip              heap.percent ram.percent cpu load_1m load_5m load_15m node.role master name
192.168.188.128           16          75   1    0.04    0.08     0.07 dilmrt    *      node-1
192.168.188.129           35          59   0    0.08    0.10     0.08 dilmrt    -      node-2
192.168.188.130           39          59   0    0.16    0.13     0.09 dilmrt    -      node-3
```

### 4 编写ES集群启停脚本

**1）在/home/nhk/bin** **目录下创建** **es.sh** 

```shell
#!/bin/bash 

ES_HOME=/opt/software/elasticsearch-7.8.0

if [ $# -lt 1 ]
then
	echo "USAGE:es.sh {start|stop}"
	exit
fi
case $1 in
"start") 
	#启动 ES
	for i in kk01 kk02 kk03
	do
		ssh $i "source /etc/profile;nohup ${ES_HOME}/bin/elasticsearch >/dev/null 2>&1 &"
	done
;;
"stop") 
	#停止 ES
	for i in kk01 kk02 kk03
	do
		ssh $i "ps -ef|grep $ES_HOME |grep -v grep|awk '{print \$2}'|xargs kill" >/dev/null 2>&1
	done
;;
*)
	echo "USAGE:es.sh {start|stop}"
	exit
;;
esac
```

2）授予脚本可执行权限

```shell
[nhk@kk01 bin]$ chmod +x es.sh 
[nhk@kk01 bin]$ ll | grep es.sh 
-rwxrwxr-x.  1 nhk nhk  475 Sep 12 14:08 es.sh
```

3）执行脚本关闭ES 集群

```shell
[nhk@kk01 bin]$ jpsall 
=========kk01=========
2469 Elasticsearch
3205 Jps
=========kk02=========
2528 Elasticsearch
3068 Jps
=========kk03=========
3152 Jps
2621 Elasticsearch
[nhk@kk01 bin]$ es.sh stop
[nhk@kk01 bin]$ jpsall 
=========kk01=========
3288 Jps
=========kk02=========
3174 Jps
=========kk03=========
3256 Jps
```

4）执行脚本启动ES 集群

```shell
[nhk@kk01 bin]$ es.sh start
[nhk@kk01 bin]$ jpsall 
=========kk01=========
3542 Jps
3359 Elasticsearch
=========kk02=========
3474 Jps
3239 Elasticsearch
=========kk03=========
3555 Jps
3321 Elasticsearch
```

## Kibana 部署

Elasticsearch 提供了一套全面和强大的 REST API，我们可以通过这套 API 与 ES 集群进行交互。

例如：我们可以通过 API: `GET /_cat/nodes?v`获取ES集群节点情况，要想访问这个API，我们需要使用 curl 命令工具来访问 Elasticsearch 服务：`curl http://hdp1:9200/_cat/nodes?v`

当然也可以使用任何其他 HTTP/REST 调试工具，例如浏览器、POSTMAN 等

Kibana 是为 Elasticsearch 设计的开源分析和可视化平台。你可以使用 Kibana 来搜索，查看存储在 Elasticsearch 索引中的数据并与之交互。你可以很容易实现高级的数据分析和可视化，以图表的形式展现出来

### Kibana部署

#### 1）上传压缩包

```shell
[nhk@kk01 software]$ pwd
/opt/software
[nhk@kk01 software]$ ll | grep kibana
-rw-rw-r--.  1 nhk nhk 334236568 Sep 12 14:12 kibana-7.8.0-linux-x86_64.tar.gz
```

#### 2）解压并重命名

```shell
[nhk@kk01 software]$ tar -zxvf kibana-7.8.0-linux-x86_64.tar.gz -C /opt/software/

[nhk@kk01 software]$ mv kibana-7.8.0-linux-x86_64 kibana-7.8.0
```

#### 3）修改Kibana配置文件

```shell
[nhk@kk01 config]$ pwd
/opt/software/kibana-7.8.0/config
[nhk@kk01 config]$ vim kibana.yml 
```

参考配置

```shell
# 访问端口（默认就是5601，可以不配）
server.port: 5601

# 授权远程访问
server.host: "0.0.0.0"

# 指定 ElasticSearch 地址（可以指定多个，多个地之间用逗号分隔）
elasticsearch.hosts: ["http://kk01:9200", "http://kk02:9200"]
```

说明：

​	**Kibana** **本身只是一个工具，不需要分发，不涉及集群，访问并发量也不会很大**

### Kibana测试

1）启动Kibana

```shell
[nhk@kk01 kibana-7.8.0]$ bin/kibana
```

:::warning
​Kibana的启动比较慢，第一次启动会打印一些 warn级别的日志，不用管他
:::

2）查看Kibana进程

```shell
[nhk@kk01 kibana-7.8.0]$ sudo netstat -nltp  | grep 5601
tcp        0      0 0.0.0.0:5601            0.0.0.0:*               LISTEN      2821/./../node/bin/ 
```

3）浏览器访问

浏览器输入 `http://kk01:5601` 即可看到Kibana

## ES集群与Kibana的启停脚本

```shell
#!/bin/bash 

ES_HOME=/opt/software/elasticsearch-7.8.0
KIBANA_HOME=/opt/software/kibana-7.8.0

if [ $# -lt 1 ]
then
	echo "USAGE:es.sh {start|stop}"
	exit
fi
case $1 in
"start") 
	#启动 ES
	for i in kk01 kk02 kk03
	do
		ssh $i "source /etc/profile;nohup ${ES_HOME}/bin/elasticsearch >/dev/null 2>&1 &"
	done
	#启动 Kibana
 	ssh kk01 nohup ${KIBANA_HOME}/bin/kibana >/dev/null 2>&1 &
;;
"stop") 
	#停止 Kibana
 	sudo netstat -nltp | grep 5601 |awk '{print $7}' | awk -F / '{print $1}'| xargs kill
	#停止 ES
	for i in kk01 kk02 kk03
	do
		ssh $i "ps -ef|grep $ES_HOME |grep -v grep|awk '{print \$2}'|xargs kill" >/dev/null 2>&1
	done
;;
*)
	echo "USAGE:es.sh {start|stop}"
	exit
;;
esac
```