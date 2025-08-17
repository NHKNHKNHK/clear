# Kafka Eagle

​	Kafka Eagle 为了简化开发者和服务工程师维护Kafka集群的工作。这个监控根据可以很容易的发现分布在集群中的哪些topic分布不均匀，或者是分区在整个集群中分布不均匀的情况。

​	它支持管理多个集群、选择副本、副本重新分配已经创建topic。同时，它也是一个非常好的快速浏览查看集群的工具。

## 1）官网、开源地址

官网：    https://www.kafka-eagle.org/

开源地址：	https://github.com/smartloli/kafka-eagle

## **2）上传压缩包**

上传压缩包 到服务器 kk01的 /opt/software目录

```shell
[nhk@kk01 software]$ pwd
/opt/software
[nhk@kk01 software]$ ll
.....
-rw-r--r--.  1 nhk nhk 89962364 May 20 23:09 kafka-eagle-bin-3.0.1.tar.gz
```

## **3）解压压缩包**

解压压缩包至目录 /opt/software下

```shell
[nhk@kk01 software]$ tar -zxvf kafka-eagle-bin-3.0.1.tar.gz -C /opt/software/
```

## **4）进入刚刚解压的压缩包**

这款工具比较特殊，压缩包下还有压缩包，所有我们需要进入再解压（解压到指定目录/opt/software）

```shell
[nhk@kk01 software]$ cd kafka-eagle-bin-3.0.1/
[nhk@kk01 kafka-eagle-bin-3.0.1]$ ll
total 87840
-rw-rw-r--. 1 nhk nhk 89947836 Sep  6  2022 efak-web-3.0.1-bin.tar.gz
[nhk@kk01 kafka-eagle-bin-3.0.1]$ tar -zxvf efak-web-3.0.1-bin.tar.gz -C /opt/software/
```

## **5）修改名称**

```shell
[nhk@kk01 software]$ mv efak-web-3.0.1/ efak-3.0.1
```

## **6）修改配置文件**

进入 eaka-3.0.01/conf 目录

```shell
[nhk@kk01 conf]$ pwd
/opt/software/efak-3.0.1/conf
[nhk@kk01 conf]$ vim system-config.properties 
```

参考的配置文件如下

```properties
######################################
# multi zookeeper & kafka cluster list
# Settings prefixed with 'kafka.eagle.' will be deprecated, use 'efak.' instead
######################################
efak.zk.cluster.alias=cluster1
cluster1.zk.list=kk01:2181,kk02:2181,kk03:2181/kafka
#cluster2.zk.list=xdn10:2181,xdn11:2181,xdn12:2181

........

######################################
# kafka offset storage
######################################
# offset保存在kafka
cluster1.efak.offset.storage=kafka
#cluster2.efak.offset.storage=zk

.......

######################################
# kafka sqlite jdbc driver address
######################################
#efak.driver=org.sqlite.JDBC
#efak.url=jdbc:sqlite:/hadoop/kafka-eagle/db/ke.db
#efak.username=root
#efak.password=www.kafka-eagle.org

# 配置mysql连接
efak.driver=com.mysql.jdbc.Driver
efak.url=jdbc:mysql://kk01:3306/ke?useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull
efak.username=root
efak.password=123456

######################################
# kafka mysql jdbc driver address
######################################
#efak.driver=com.mysql.cj.jdbc.Driver
#efak.url=jdbc:mysql://127.0.0.1:3306/ke?useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull
#efak.username=root
#efak.password=123456

```

## **7）添加到环境变量**

注意：

​	**必须配置环境变量，否则 ke.sh 脚本运行不了**

```shell
[nhk@kk01 efak-3.0.1]$ sudo vim /etc/profile.d/my_env.sh 

# KafkaEFAK
export KE_HOME=/opt/software/efak-3.0.1
export PATH=$PATH:$KE_HOME/bin
```

注意：更新环境变量

```shell
[nhk@kk01 efak-3.0.1]$ source /etc/profile    

# 更新/etc/profile即可以更新/etc/profile.d/my_env.sh 
```

由于这只是个监控Kafka的工具，因此只需要在一台服务器安装即可，不需要分发

## 8）修改Kafka启动命令

我们需要先关闭Kafka集群，再进行修改

```
[nhk@kk01 ~]$ kafka.sh stop			# 使用的是我们自定义的Kafka集群启停脚本
```

修改/opt/software/kafka_2.13-3.0.0/bin/kafka-server-start.sh命令中

```shell
[nhk@kk01 bin]$ pwd
/opt/software/kafka_2.13-3.0.0/bin
[nhk@kk01 bin]$ vim kafka-server-start.sh 
```

修改如下参数值：

```shell
if [ "x$KAFKA_HEAP_OPTS" = "x" ]; then
    export KAFKA_HEAP_OPTS="-Xmx1G -Xms1G"
fi
```

为

```shell
if [ "x$KAFKA_HEAP_OPTS" = "x" ]; then
    export KAFKA_HEAP_OPTS="-server -Xms2G -Xmx2G -XX:PermSize=128m -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:ParallelGCThreads=8 -XX:ConcGCThreads=5 -XX:InitiatingHeapOccupancyPercent=70"
    # 端口可以不是9999，任意用一个可用端口也行
    export JMX_PORT="9999"
    #export KAFKA_HEAP_OPTS="-Xmx1G -Xms1G"
fi
```

注意：

​	**修改之后在启动Kafka之前要分发之其他节点**

```shell
[nhk@kk01 bin]$ pwd
/opt/software/kafka_2.13-3.0.0/bin
[nhk@kk01 bin]$ scp kafka-server-start.sh kk02:$PWD

[nhk@kk01 bin]$ scp kafka-server-start.sh kk03:$PWD
```

## **9）启动efak**

注意：启动之前需要先启动 zookeeper 与 Kafka

**ke.sh 脚本传参说明**

-   start	启动服务
-   stop	停止服务
-   restart	重启服务
-   status	查看服务状态
-   stats	查看资源占用

```shell
[nhk@kk01 bin]$ pwd
/opt/software/efak-3.0.1/bin
[nhk@kk01 bin]$ ke.sh start
...

[2023-06-05 22:59:37] INFO: [Job done!]
Welcome to
    ______    ______    ___     __ __
   / ____/   / ____/   /   |   / //_/
  / __/     / /_      / /| |  / ,<   
 / /___    / __/     / ___ | / /| |  
/_____/   /_/       /_/  |_|/_/ |_|  
( Eagle For Apache Kafka® )

Version v3.0.1 -- Copyright 2016-2022
*******************************************************************
* EFAK Service has started success.
* Welcome, Now you can visit 'http://192.168.188.128:8048'
* Account:admin ,Password:123456
*******************************************************************
* <Usage> ke.sh [start|status|stop|restart|stats] </Usage>
* <Usage> https://www.kafka-eagle.org/ </Usage>
*******************************************************************
```

## **10）查看efka进程**

```shell
[nhk@kk01 bin]$ jps
15617 Jps
15426 KafkaEagle
15173 Kafka
2364 QuorumPeerMain
```

## **11）登录网页查看监控数据**

```
    http://192.168.188.128:8048/
或
http:kk01:8048/
```

## **12）关闭efak**

```shell
[nhk@kk01 bin]$ ke.sh stop
[2023-06-05 23:04:19] INFO: EFAK-192.168.188.128 Stop Success.
```

