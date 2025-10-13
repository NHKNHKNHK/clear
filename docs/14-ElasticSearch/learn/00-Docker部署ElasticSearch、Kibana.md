# Docker部署单机版ES

## **1）拉取镜像**

```shell
# 存储和检索数据
[root@nhk ~]# docker pull elasticsearch:7.4.2

# 可视化检索数据
[root@nhk ~]# docker pull kibana:7.4.2
```

```shell
# 查看镜像
[root@nhk ~]# docker images | grep elasticsearch
elasticsearch          7.4.2          b1179d41a7b4   3 years ago     855MB

[root@nhk ~]# docker images | grep kibana
kibana                 7.4.2          230d3ded1abc   3 years ago     1.1GB


# 查看内存使用情况
[root@nhk ~]# free -m
              total        used        free      shared  buff/cache   available
Mem:           1819        1142          77          10         598         483
Swap:          2047          45        2002
```

## **2）创建ES实例**

```shell
# 配置文件挂载的容器卷
[root@nhk ~]# mkdir -p /opt/software/elasticsearch/config
# es中数据挂载的容器卷
[root@nhk ~]# mkdir -p /opt/software/elasticsearch/data

# 写入配置文件
[root@nhk ~]# echo "http.host: 0.0.0.0" >> /opt/software/elasticsearch/config/elasticsearch.yml
[root@nhk ~]# cat /opt/software/elasticsearch/config/elasticsearch.yml 
http.host: 0.0.0.0		# 注意 :之后需要加空格
```

```shell
[root@nhk ~]# docker run --name elasticsearch -p 9200:9200 -p 9300:9300 \
-e discovery.type=single-node \
-e ES_JAVA_OPTS="-Xms64m -Xmx128m" \
-v /opt/software/elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml \
-v /opt/software/elasticsearch/data:/usr/share/elasticsearch/data \
-v /opt/software/elasticsearch/plugins:/usr/share/elasticsearch/plugins \
-d elasticsearch:7.4.2


# 说明
--name elasticsearch	为该容器实例命名为 elasticsearch
-p 9200:9200 -p 9300:9300	端口映射	暴露端口:容器实例端口
-e discovery.type=single-node 	es以单节点运行
-e ES_JAVA_OPTS="-Xms64m -Xmx128m" 	执行es占用的内存，生产环境中可以配置成32G
-v 		挂载容器卷
-d		后台启动

# 特别强调
-e ES_JAVA_OPTS="-Xms64m -Xmx128m" 在测试环境下设置ES的初始内存和最大内存，否则会导致内存占用过大无法正常启动
```

## **3）纠错**

如果ES启动失败，可以查看该容器实例的日志信息进行纠错

```shell
[root@nhk ~]# docker logs elasticsearch

# 可能会出现如下报错信息
Caused by: java.nio.file.AccessDeniedException: /usr/share/elasticsearch/data/nodes

# 只需要将挂载的容器卷的访问权限做出修改即可（让任何用于都有访问权限）
[root@nhk elasticsearch]# chmod -R 777 /opt/software/elasticsearch/
[root@nhk elasticsearch]# ll
total 0
drwxrwxrwx. 2 root root 31 Sep  6 03:13 config
drwxrwxrwx. 2 root root  6 Sep  6 02:46 data
drwxrwxrwx. 2 root root  6 Sep  6 02:47 plugins
```

说明：

​	上面遇到的这个问题可以在创建容器实例时加上  --privileged=true 解决

​	一般使用**--privileged=true**命令，扩大容器的权限解决挂载目录没有权限的问题，也即使用该参数，container内的root拥有真正的root权限，否则，container内的root之上外部的一个普通用户权限。

## 4）重启容器

```shell
[root@nhk elasticsearch]# docker start elasticsearch 
elasticsearch
#  查看容器实例
[root@nhk elasticsearch]# docker ps | grep elastic
77d4fb852324   elasticsearch:7.4.2   "/usr/local/bin/dock…"   7 minutes ago   Up 10 second
s   0.0.0.0:9200->9200/tcp, :::9200->9200/tcp, 0.0.0.0:9300->9300/tcp, :::9300->9300/tcp  elasticsearch
```

## 5）打开浏览器查看

格式：宿主机IP:9200

例如：http://192.168.188.150:9200

看到如下信息，则证明ES部署成功

```json
{
  "name" : "77d4fb852324",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "aqDGrs-4SxeJ96-4s3wQuw",
  "version" : {
    "number" : "7.4.2",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "2f90bbf7b93631e52bafb59b3b049cb44ec25e96",
    "build_date" : "2019-10-28T20:40:44.881551Z",
    "build_snapshot" : false,
    "lucene_version" : "8.2.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

## 6）安装Kibana

```shell
[root@nhk ~]# docker run --name kibana -e ELASTICSEARCH_HOSTS=http://192.168.188.150:9200/ -p 5601:5601 -d kibana:7.4.2

# 说明 
http:192.168.188.150:9200 	这里填的是Docker宿主机的IP地址
```

```shell
[root@nhk ~]# docker ps | grep kibana
90b1a08df74c   kibana:7.4.2          "/usr/local/bin/dumb…"   18 seconds ago   Up 17 seconds   0.0.0.0:5601->5601/tcp, :::5601->5601/tcp                    
                          kibana
```

## 7）访问Kibana

格式：宿主机IP:5601

例如：http://192.168.188.150:5601





# Docker部署ES集群

## ES集群节点说明

**集群节点** 

ELasticsearch的集群是由多个节点组成的，通过cluster.name设置集群名称，并且用于区分其它的集群，每个节 

点通过node.name指定节点的名称。 

在Elasticsearch中，节点的类型主要有4种： 

-   master节点 

    -   配置文件中node.master属性为true(默认为true)，就有资格被选为master节点。 

    -   master节点用于控制整个集群的操作。比如创建或删除索引，管理其它非master节点等。 

-   data节点 

    -   配置文件中node.data属性为true(默认为true)，就有资格被设置成data节点。 

    -   data节点主要用于执行数据相关的操作。比如文档的CRUD。 

-   客户端节点 

    -   配置文件中node.master属性和node.data属性均为false。 

    -   该节点不能作为master节点，也不能作为data节点。 

    -   可以作为客户端节点，用于响应用户的请求，把请求转发到其他节点 

-   部落节点 

    -   当一个节点配置tribe.*的时候，它是一个特殊的客户端，它可以连接多个集群，在所有连接的集群上执行搜索和其他操作。

## 1）创建目录

```shell
[root@nhk software]# pwd
/opt/software
[root@nhk software]# mkdir es-cluster
[root@nhk software]#  mkdir -p es-cluster/node01/config
[root@nhk software]#  mkdir -p es-cluster/node02/config
[root@nhk software]#  mkdir -p es-cluster/node03/config
```

## 2）创建网络

```shell
[root@nhk software]# docker network create es_network
fc8184d28230df80e58e9848cd24ddc84ff1c9c4f7bc12f19ee91b256cc803af
```

## 3）在config目录下新建 elasticsearch.yml

node01/config/elasticsearch.yml

```shell
cluster.name: cluster-es

node.name: node01

bootstrap.memory_lock: false

# 允许任意 ip 访问
network.host: 0.0.0.0
# 数据服务端口
http.port: 9201
# 集群间通信端口
transport.tcp.port: 9300

#es7.x 之后新增的配置，初始化一个新的集群时需要此配置来选举 master（默认候选 master 节点）
cluster.initial_master_nodes: ["node01", "node02", "node03"]
#集群检测的超时时间（1分钟）和次数（5次）
discovery.zen.fd.ping_timeout: 1m
discovery.zen.fd.ping_retries: 5
```

node02/config/elasticsearch.yml

```shell
cluster.name: cluster-es

node.name: node02

bootstrap.memory_lock: false

# 允许任意 ip 访问
network.host: 0.0.0.0
# 数据服务端口
http.port: 9202
# 集群间通信端口
transport.tcp.port: 9300

#es7.x 之后新增的配置，初始化一个新的集群时需要此配置来选举 master（默认候选 master 节点）
cluster.initial_master_nodes: ["node01", "node02", "node03"]
#集群检测的超时时间（1分钟）和次数（5次）
discovery.zen.fd.ping_timeout: 1m
discovery.zen.fd.ping_retries: 5
```

node03/config/elasticsearch.yml

```shell
cluster.name: cluster-es

node.name: node03

bootstrap.memory_lock: false

# 允许任意 ip 访问
network.host: 0.0.0.0
# 数据服务端口
http.port: 9203
# 集群间通信端口
transport.tcp.port: 9300

#es7.x 之后新增的配置，初始化一个新的集群时需要此配置来选举 master（默认候选 master 节点）
cluster.initial_master_nodes: ["node01", "node02", "node03"]
#集群检测的超时时间（1分钟）和次数（5次）
discovery.zen.fd.ping_timeout: 1m
discovery.zen.fd.ping_retries: 5
```

## 4）在config目录下新建 jvm.options文件

在node01/config/   node02/config/    node03/config/ 下

参考jvm.options

```shell
## JVM configuration

################################################################
## IMPORTANT: JVM heap size
################################################################
##
## You should always set the min and max JVM heap
## size to the same value. For example, to set
## the heap to 4 GB, set:
##
## -Xms4g
## -Xmx4g
##
## See https://www.elastic.co/guide/en/elasticsearch/reference/current/heap-size.html
## for more information
##
################################################################

# Xms represents the initial size of total heap space
# Xmx represents the maximum size of total heap space

-Xms512m
-Xmx512m

################################################################
## Expert settings
################################################################
##
## All settings below this section are considered
## expert settings. Don't tamper with them unless
## you understand what you are doing
##
################################################################

## GC configuration
8-13:-XX:+UseConcMarkSweepGC
8-13:-XX:CMSInitiatingOccupancyFraction=75
8-13:-XX:+UseCMSInitiatingOccupancyOnly

## G1GC Configuration
# NOTE: G1 GC is only supported on JDK version 10 or later
# to use G1GC, uncomment the next two lines and update the version on the
# following three lines to your version of the JDK
# 10-13:-XX:-UseConcMarkSweepGC
# 10-13:-XX:-UseCMSInitiatingOccupancyOnly
14-:-XX:+UseG1GC
14-:-XX:G1ReservePercent=25
14-:-XX:InitiatingHeapOccupancyPercent=30

## JVM temporary directory
-Djava.io.tmpdir=${ES_TMPDIR}

## heap dumps

# generate a heap dump when an allocation from the Java heap fails
# heap dumps are created in the working directory of the JVM
-XX:+HeapDumpOnOutOfMemoryError

# specify an alternative path for heap dumps; ensure the directory exists and
# has sufficient space
-XX:HeapDumpPath=data

# specify an alternative path for JVM fatal error logs
-XX:ErrorFile=logs/hs_err_pid%p.log

## JDK 8 GC logging
8:-XX:+PrintGCDetails
8:-XX:+PrintGCDateStamps
8:-XX:+PrintTenuringDistribution
8:-XX:+PrintGCApplicationStoppedTime
8:-Xloggc:logs/gc.log
8:-XX:+UseGCLogFileRotation
8:-XX:NumberOfGCLogFiles=32
8:-XX:GCLogFileSize=64m

# JDK 9+ GC logging
9-:-Xlog:gc*,gc+age=trace,safepoint:file=logs/gc.log:utctime,pid,tags:filecount=32,filesize=64m
```

## 5）创建容器实例

```shell
[root@nhk software]# docker create --name es-node01 --network es_network --privileged=true -v /opt/software/es-cluster/node01/config/elasticsearch.yml:/usr/s
hare/elasticsearch/config/elasticsearch.yml -v /opt/software/es-cluster/node01/config/jvm.options:/usr/share/elasticsearch/config/jvm.options -v /opt/software/es-cluster/node01/data:/usr/share/elasticsearch/data elasticsearch:7.4.2

[root@nhk software]# docker create --name es-node02 --network es_network --privileged=true -v /opt/software/es-cluster/node02/config/elasticsearch.yml:/usr/s
hare/elasticsearch/config/elasticsearch.yml -v /opt/software/es-cluster/node02/config/jvm.options:/usr/share/elasticsearch/config/jvm.options -v /opt/software/es-cluster/node02/data:/usr/share/elasticsearch/data elasticsearch:7.4.2

[root@nhk software]# docker create --name es-node03 --network es_network --privileged=true -v /opt/software/es-cluster/node03/config/elasticsearch.yml:/usr/s
hare/elasticsearch/config/elasticsearch.yml -v /opt/software/es-cluster/node03/config/jvm.options:/usr/share/elasticsearch/config/jvm.options -v /opt/software/es-cluster/node03/data:/usr/share/elasticsearch/data elasticsearch:7.4.2
```

## 6）启动容器

```shell
[root@nhk software]# docker start es-node01 && docker logs -f es-node01
[root@nhk software]# docker start es-node02 && docker logs -f es-node02
[root@nhk software]# docker start es-node03 && docker logs -f es-node03
```

## 7）如果容器无法正常启动则操作此步骤

启动时会报文件无权限操作的错误（java.security.AccessControlException），需要对node01 node02 node03 进行chmod 777 的操作

```shell
[root@nhk software]# chmod -R 777 es-cluster/node01
[root@nhk software]# chmod -R 777 es-cluster/node02
[root@nhk software]# chmod -R 777 es-cluster/node03
```



```shell
mkdir /haoke/es-cluster
cd /haoke/es-cluster
mkdir node01
mkdir node02
#复制安装目录下的elasticsearch.yml、jvm.options文件，做如下修改
#node01的配置：
cluster.name: es-itcast-cluster
node.name: node01
node.master: true
node.data: true
network.host: 172.16.55.185
http.port: 9200
discovery.zen.ping.unicast.hosts: ["172.16.55.185"]
discovery.zen.minimum_master_nodes: 1
http.cors.enabled: true
http.cors.allow-origin: "*"
#node02的配置：
cluster.name: es-itcast-cluster
node.name: node02
node.master: false
node.data: true
network.host: 172.16.55.185
http.port: 9201
discovery.zen.ping.unicast.hosts: ["172.16.55.185"]
discovery.zen.minimum_master_nodes: 1
http.cors.enabled: true
http.cors.allow-origin: "*"
#创建容器
docker create --name es-node01 --net host -v /haoke/es-cluster/node01/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
-v /haoke/es-cluster/node01/jvm.options:/usr/share/elasticsearch/config/jvm.options
-v /haoke/es-cluster/node01/data:/usr/share/elasticsearch/data elasticsearch:6.5.4
docker create --name es-node02 --net host -v /haoke/es-cluster/node02/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
-v /haoke/es-cluster/node02/jvm.options:/usr/share/elasticsearch/config/jvm.options
-v /haoke/es-cluster/node02/data:/usr/share/elasticsearch/data elasticsearch:6.5.4
#启动容器
docker start es-node01 && docker logs -f es-node01
docker start es-node02 && docker logs -f es-node02
#提示
```





