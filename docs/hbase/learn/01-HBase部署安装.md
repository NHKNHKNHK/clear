# 1 HBase安装部署

## 1.1 部署HBase的前提

HBase部署前提：

-   **保证Hadoop集群的正常部署**
-   **Zookeeper集群的正常部署**

启动zookeeper集群

```shell
# 分别在kk01、kk02、kk03上执行下面命令
zkServer.sh start
```

启动hadoop集群

```shell
start-dfs.sh
start-yarn.sh
```

## 1.2 HBase单机模式

### **1）上传解压**

```shell
# 进入/opt/software目录下
[nhk@kk01 ~]$ cd /opt/software

# 使用rz上传压缩包
[nhk@kk01 software]$ rz
# 解压压缩包
[nhk@kk01 software]$ tar -zxvf hbase-2.3.4-bin.tar.gz -C /opt/software/
# 删除压缩包
[nhk@kk01 software]$ rm -rf hbase-2.3.4-bin.tar.gz

# 更名（我们不做此操作）
[nhk@kk01 software]$ mv -f hbase-2.3.4/ hbase
```

下面是我第一次解压的时候出现的问题，这说明压缩包缺失文件，可以去官网重新下载新的压缩包

```shell
tar: Skipping to next header
gzip: stdin: unexpected end of file
tar: Child returned status 1
tar: Error is not recoverable: exiting now
```

### **2）配置环境变量**

```shell
[nhk@kk01 software]$ sudo vim /etc/profile.d/my_env.sh 
# 在文件末尾添加如下内容

# hbase env
export HBASE_HOME=/opt/software/hbase-2.3.4
export PATH=$PATH:$HBASE_HOME/bin
```

```shell
# 使环境变量生效
[nhk@kk01 software]$ source /etc/profile
```

```shell
# 验证环境变量生效
[nhk@kk01 software]$ hbase version
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/opt/software/hadoop-3.1.3/share/hadoop/common/lib/slf4j-log4j12-1.7.25.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/opt/software/hbase-2.3.4/lib/client-facing-thirdparty/slf4j-log4j12-1.7.30.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.slf4j.impl.Log4jLoggerFactory]
HBase 2.3.4
Source code repository git://aadda66144af/home/hsun/hbase-rm/output/hbase revision=afd5e4fc3cd259257229df3422f2857ed35da4cc
Compiled by hsun on Thu Jan 14 21:32:25 UTC 2021
From source with checksum de952a59df0d460ae3f21c2920ac442609060205620d54474e55195fdfe78c6a4445fd3e0409807c6c71be552d784b027b2021985b14bb5cde711ba429b74783

# 看到形如 HBase 2.3.4 的版本信息则证明环境变量生效

# 说明
SLF4J（日志门面）检测到存在多个SLF4J绑定，即多个SLF4J日志实现。它在以下两个位置找到了绑定：
/opt/software/hadoop-3.1.3/share/hadoop/common/lib/slf4j-log4j12-1.7.25.jar
/opt/software/hbase-2.3.4/lib/client-facing-thirdparty/slf4j-log4j12-1.7.30.jar
SLF4J通过查找org.slf4j.impl.StaticLoggerBinder类来确定绑定的类型。在您的环境中，实际的绑定类型是org.slf4j.impl.Log4jLoggerFactory，它使用Log4j作为日志实现。
总结起来，您正在运行HBase 2.3.4版本，并且使用Log4j作为日志实现
```

说明：

​	对于SLF4J日志门面绑定了多个日志实现这样的一个问题，我们可以通过删除其他一个jar包来解决

​	建议是将Hbase的日志实现（slf4j-log4j12-1.7.30.jar）给注释掉

### 3）修改 hbase-env.sh文件

**配置/opt/software/hbase/hbase-2.3.4/conf 目录下hbase-env.sh文件**

```shell
[nhk@kk01 software]$ cd /opt/software/hbase-2.3.4/conf
[nhk@kk01 conf]$ vim hbase-env.sh

# 做出如下修改
将注释中的 
	# export JAVA_HOME=/usr/java/jdk1.8.0/
修改为以下
	export JAVA_HOME=/opt/software/jdk1.8.0_152/

# zk 为true使用集成zk false使用集群zk
将注释中的 
	# export HBASE_MANAGES_ZK=true
修改为以下
	export HBASE_MANAGES_ZK=true
```

### 4）修改 hbase-site.xml 文件

**修改**/opt/software/hbase/hbase-2.3.4/conf 目录下**hbase-site.xml文件**

```shell
[nhk@kk01 conf]$ vim hbase-site.xml
```

参考配置文件如下：

```xml
<property>
    <!-- 指定HBase数据的存放目录 -->
    <name>hbase.rootdir</name>
    <!-- 需要确保/opt/software/hbase-2.3.4/datas目录存在 -->
    <!-- 如果是搭建的是集群，这里value填 hdfs://kk01:8020/hbase -->
    <value>file:///opt/software/hbase-2.3.4/datas</value>    
</property>

<!-- Hbase的运行模式。false是单机模式，true是分布式模式。若为false,Hbase和Zookeeper会运行在同一个JVM里面 -->
<property>
    <name>hbase.cluster.distributed</name>
    <value>false</value>
</property>

<property>
    <!-- 指定zookeeper集群存放数据的目录 -->
    <!--zk快照的存储位置-->
    <name>hbase.zookeeper.property.dataDir</name>
    <!-- 需要确保/opt/software/zookeeper-3.6.1/zkData目录存在 -->
    <value>/opt/software/zookeeper-3.6.1/zkData</value>  
</property>

<!--  V2.1版本，在分布式情况下, 设置为false -->
<property>
    <name>hbase.unsafe.stream.capability.enforce</name>
    <value>false</value>
</property>

<property>
    <name>hbase.master.maxclockskew</name>
    <value>180000</value> 
    <description> time difference of regionserver from(区域服务器的时间差)，如果集群之间的服务器时间不同步，则需要配置</description>
</property>
```

接下来需要确保 /opt/software/hbase-2.3.4/datas 和 /opt/software/zookeeper-3.6.1/zkData 目录的存在

 /opt/software/zookeeper-3.6.1/zkData 目录在搭建zookeeper集群时已经存在了

```shell
# 创建 /opt/software/hbase-2.3.4/datas
[nhk@kk01 conf]$ mkdir /opt/software/hbase-2.3.4/datas
```

### 5）测试单机模式HBase

**注意：因为HBase内置了Zookeeper，所有我们在测试单击模式的HBase是时需要先关闭zookeeper**，如下

```shell
zkServer.sh stop   # 在所有节点执行该命令
```

**启动HBase单击模式**

```shell
[nhk@kk01 hbase-2.3.4]$ start-hbase.sh 	# 下面是SLF4J绑定了多个日志实现，我们现在先不管它
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/opt/software/hadoop-3.1.3/share/hadoop/common/lib/slf4j-log4j12-1.7.25.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/opt/software/hbase-2.3.4/lib/client-facing-thirdparty/slf4j-log4j12-1.7.30.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.slf4j.impl.Log4jLoggerFactory]
running master, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-master-kk01.out
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/opt/software/hadoop-3.1.3/share/hadoop/common/lib/slf4j-log4j12-1.7.25.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/opt/software/hbase-2.3.4/lib/client-facing-thirdparty/slf4j-log4j12-1.7.30.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
```

**使用JPS查看HBase进程**

```shell
# 进程信息如下  查看到HMaster说明Hbase单击模式启动成功
[nhk@kk01 hbase-2.3.4]$ jps
5249 NameNode
5395 DataNode
6803 Jps
5960 JobHistoryServer	
6298 HMaster
5756 NodeManager
[nhk@kk01 hbase-2.3.4]$ jps -ml
5249 org.apache.hadoop.hdfs.server.namenode.NameNode
5395 org.apache.hadoop.hdfs.server.datanode.DataNode
5960 org.apache.hadoop.mapreduce.v2.hs.JobHistoryServer
6298 org.apache.hadoop.hbase.master.HMaster start
5756 org.apache.hadoop.yarn.server.nodemanager.NodeManager
6831 sun.tools.jps.Jps -ml
```

### **6）验证HBase部署是否成功**

```shell
[nhk@kk01 hbase-2.3.4]$ hbase shell

# 出现下面信息说明部署成功
....

HBase Shell
Use "help" to get list of supported commands.
Use "exit" to quit this interactive shell.
For Reference, please visit: http://hbase.apache.org/2.0/book.html#shell
Version 2.3.4, rafd5e4fc3cd259257229df3422f2857ed35da4cc, Thu Jan 14 21:32:25 UTC 2021
Took 0.0025 seconds                                                                                                                                          
hbase(main):001:0> 
```

ctrl+d退出hbase shell

### **7）关闭HBase**

```shell
[nhk@kk01 hbase-2.3.4]$ stop-hbase.sh 
stopping hbase..........
...
```

## 1.3 HBase集群搭建

### 0）集群规划

| kk01                       | kk02          | kk03          |
| -------------------------- | ------------- | ------------- |
| **HMaster**、HRegionServer | HRegionServer | HRegionServer |

为了避免一些比不要的错误，在部署HBase集群之前，我们先将单机模式的HBase删除

```shell
[nhk@kk01 software]$ rm -rf hbase-2.3.4	
```

### 1）上传压缩包并解压

```shell
[nhk@kk01 software]$ ll | grep hbase
-rw-rw-r--.  1 nhk nhk 272069378 Aug  3 11:47 hbase-2.3.4-bin.tar.gz
        
[nhk@kk01 software]$ tar -zxvf hbase-2.3.4-bin.tar.gz -C /opt/software/
```

### 2）修改 hbase-env.sh文件

**修改/opt/software/hbase/hbase-2.3.4/conf 目录下hbase-env.sh文件**

```shell
[nhk@kk01 software]$ cd /opt/software/hbase-2.3.4/conf
[nhk@kk01 conf]$ vim hbase-env.sh
```

```shell
# 做出如下修改
将注释中的 
	# export JAVA_HOME=/usr/java/jdk1.8.0/
修改为以下
	export JAVA_HOME=/opt/software/jdk1.8.0_152/

# zk 为true使用集成zk false使用集群zk
将注释中的 
	# export HBASE_MANAGES_ZK=true
修改为以下
	export HBASE_MANAGES_ZK=false
```

说明：

​	HBASE_MANAGES_ZK=false 目的是设置HBase不使用内置的zookeeper，而是使用外部安装的zookeeper集群

### 3）修改 hbase-site.xml 文件

**修改/opt/software/hbase/hbase-2.3.4/conf 目录下hbase-site.xml文件**

```shell
[nhk@kk01 conf]$ vim hbase-site.xml 
```

参考配置文件如下：

```xml
<configuration>
    <property>
        <!-- hbase的运行模式，false为单击，true为分布式，若为false，hbase和zk会运行在同一个jvm里面 -->
        <!-- 开启HBase完全分布式-->
        <name>hbase.cluster.distributed</name>
        <value>true</value>
    </property>

    <property>  
        <!-- 指定HBase数据的存放目录,这里我们选择存放在HDFS中 -->
        <name>hbase.rootdir</name>
        <value>hdfs://kk01:8020/hbase</value>
    </property>

    <property>
        <!-- 指定HBase需要连接的ZOokeeper集群,也就是zk集群的地址 -->
        <name>hbase.zookeeper.quorum</name>
        <value>kk01,kk02,kk03</value>
    </property>

    <property>    
        <!-- zk快照的存储位置 -->
        <!-- 指定zookeeper集群存放数据的目录 -->
        <name>hbase.zookeeper.property.dataDir</name>
        <!-- 需要确保/opt/software/zookeeper-3.6.1/zkData目录存在 -->
        <value>/opt/software/zookeeper-3.6.1/zkData</value>  
    </property>	

</configuration>
```

### **4）修改regionservers内容**

```shell
[nhk@kk01 conf]$ vim regionservers
```

```shell
# 将文件内容替换为如下

kk01
kk02
kk03
```

### 5）配置环境变量

```shell
[nhk@kk01 conf]$ sudo vim /etc/profile.d/my_env.sh 
# 添加如下配置

# hbase env
export HBASE_HOME=/opt/software/hbase-2.3.4
export PATH=$PATH:${HBASE_HOME}/bin:${HBASE_HOME}/sbin
```

重新加载环境变量

```shell
[nhk@kk01 conf]$ source /etc/profile
```

### 6）复制htrace-core4-4.2.0-incubating.jar包到lib

```shell
[nhk@kk01 hbase-2.3.4]$ cp $HBASE_HOME/lib/client-facing-thirdparty/htrace-core4-4.2.0-incubating.jar $HBASE_HOME/lib/
```

说明：

​	在HBase中，`htrace-core4-4.2.0-incubating.jar`是一个用于分布式跟踪的库。它提供了在分布式系统中跟踪请求和调试的功能。



### 7）core-site.xml 和 hdfs-site.xml

方式一：（不推荐）

​	将Hadoop的配置文件目录（/opt/software/hadoop-3.1.3/etc/hadoop）下的core-site.xml和hdfs-site.xml复制到/opt/software/hbase/hbase-2.3.4/conf目录下

```shell
[nhk@kk01 conf]$ cd /opt/software/hadoop-3.1.3/etc/hadoop
[nhk@kk01 hadoop]$ cp core-site.xml hdfs-site.xml /opt/software/hbase/hbase-2.3.4/conf 
```

方式二：

**软链接Hadoop配置文件到HBase**(和上一步操作类似，主不过这样灵活性更高)

主要是软链接Hadoop配置文件 core-site.xml和hdfs-site.xml

```shell
[nhk@kk01 conf]$ ln -s /opt/software/hadoop-3.2.2/etc/hadoop/core-site.xml /opt/software/hbase-2.3.4/conf/core-site.xml

[nhk@kk01 conf]$ ln -s /opt/software/hadoop-3.2.2/etc/hadoop/hdfs-site.xml /opt/software/hbase-2.3.4/conf/hdfs-site.xml

# 查看软链接后的效果
[nhk@kk01 conf]$ ll
total 48
-rw-r--r--. 1 nhk nhk    5 Apr  6 01:38 backup-masters
lrwxrwxrwx. 1 nhk nhk   51 Apr  6 01:37 core-site.xml -> /opt/software/hadoop-3.2.2/etc/hadoop/core-site.xml
-rw-r--r--. 1 nhk nhk 1811 Jan 22  2020 hadoop-metrics2-hbase.properties
-rw-r--r--. 1 nhk nhk 4284 Jan 22  2020 hbase-env.cmd
-rw-r--r--. 1 nhk nhk 7677 Apr  6 02:22 hbase-env.sh
-rw-r--r--. 1 nhk nhk 2257 Jan 22  2020 hbase-policy.xml
-rw-r--r--. 1 nhk nhk 2900 Apr 14 03:03 hbase-site.xml
lrwxrwxrwx. 1 nhk nhk   51 Apr  6 01:37 hdfs-site.xml -> /opt/software/hadoop-3.2.2/etc/hadoop/hdfs-site.xml
-rw-r--r--. 1 nhk nhk 1169 Jan 22  2020 log4j-hbtop.properties
-rw-r--r--. 1 nhk nhk 5735 Jan 22  2020 log4j.properties
-rw-r--r--. 1 nhk nhk   15 Apr  6 01:37 regionservers
```

说明：

​	在HBase中，软链接`core-site.xml`和`hdfs-site.xml`文件是为了共享Hadoop的配置信息。HBase是构建在Hadoop之上的分布式数据库，它需要访问Hadoop的HDFS（分布式文件系统）和其他组件。

​	软链接`core-site.xml`和`hdfs-site.xml`文件可以实现HBase和Hadoop之间的配置共享和一致性，简化了配置管理的工作。	



如需HBase的**HA模式**，则在/opt/software/base-2.3.4/conf 目录下新建**backup-masters**文件，用于备份HBase主节点kk01（HA模式可选）

```shell
# 单主节点崩溃时，HBase自动启动备份节点
[nhk@kk01 conf]$ vim backup-masters 

# backup-masters 文件内容如下：
kk02
```



### **8）分发HBase到集群的其他节点**

```shell
[nhk@kk01 software]$ scp -r /opt/software/hbase-2.3.4 kk02:/opt/software/
[nhk@kk01 software]$ scp -r /opt/software/hbase-2.3.4 kk03:/opt/software/
```

### **9）分发配置文件**

```shell
[nhk@kk01 software]$ scp -r /etc/profile.d/my_env.sh kk02:/etc/profile.d/
[nhk@kk01 software]$ scp -r /etc/profile.d/my_env.sh kk03:/etc/profile.d/


# 在kk01、kk02、kk03节点重新加载环境，命令如下
source /etc/profile
```

### 10）启停测试

**注意：如果搭建的是HA模式的HBase，启动HBase前需要先启动Zookeeper集群和Hadoop集群**

启动hadoop与zk（如果已经启动了可以忽略此步骤）

```shell
 # 每台集群都要输入（如果我们编写了Hadoop集群、Zookeeper集群启停脚本，那就直接用脚本，更方便）
$ zkServer.sh start 
$ start-dfs.sh
$ start-yarn.sh

[nhk@kk01 software]$ jpsall 	# jpsall为自定义脚本
=========kk01=========
5249 NameNode
5395 DataNode
5960 JobHistoryServer
8490 QuorumPeerMain
5756 NodeManager
8685 Jps
=========kk02=========
2294 DataNode
2506 ResourceManager
3994 QuorumPeerMain
2651 NodeManager
4143 Jps
=========kk03=========
3699 QuorumPeerMain
3844 Jps
2294 DataNode
2395 SecondaryNameNode
2539 NodeManager
```

#### **单点启动、停止**

kk01

```shell
[nhk@kk01 ~]$ hbase-daemon.sh start master
running master, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-master-kk01.out

[nhk@kk01 ~]$ hbase-daemon.sh start regionserver
running regionserver, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-regionserver-kk01.out
```

kk02

```shell
[nhk@kk02 ~]$ hbase-daemon.sh start regionserver
running regionserver, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-regionserver-kk02.out
```

kk03

```shell
[nhk@kk03 ~]$ hbase-daemon.sh start regionserver
running regionserver, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-regionserver-kk03.out
```

查看所有进程

```shell
[nhk@kk01 ~]$ jpsall 
=========kk01=========
5249 NameNode
5395 DataNode
8755 HMaster
9156 HRegionServer
5960 JobHistoryServer
9560 Jps
8490 QuorumPeerMain
5756 NodeManager
=========kk02=========
4293 HRegionServer
2294 DataNode
2506 ResourceManager
3994 QuorumPeerMain
2651 NodeManager
4604 Jps
=========kk03=========
4001 HRegionServer
4306 Jps
3699 QuorumPeerMain
2294 DataNode
2395 SecondaryNameNode
2539 NodeManager
```

```shell
# 停止命令
hbase-daemon.sh stop master
hbase-daemon.sh stop regionserver
```

#### **shell脚本一键启停hbase集群**

```shell
[nhk@kk01 ~]$ stop-hbase.sh
stopping hbase...........
```

```shell
[nhk@kk01 ~]$ start-hbase.sh 
```

#### **验证HBase集群是否启动成功**

```shell
[nhk@kk01 ~]$ hbase shell
                                                                                         ...                                               
hbase(main):001:0> 
```

#### **查看HBase Web UI界面**

http://kk01:16010



## 1.4 解决SLF4J绑定多个日志实现的问题

我们在使用   start-hbase.sh  、 stop-hbase.sh 、hbase shell 等时都遇到了如下日志信息：

```shell
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/opt/software/hadoop-3.1.3/share/hadoop/common/lib/slf4j-log4j12-1.7.25.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/opt/software/hbase-2.3.4/lib/client-facing-thirdparty/slf4j-log4j12-1.7.30.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.slf4j.impl.Log4jLoggerFactory]
```

出现上述这种日志是原因是因为SLF4J日志门面绑定了多个日志实现，从日志信息来看，绑定了：

/opt/software/hadoop-3.1.3/share/hadoop/common/lib/slf4j-log4j12-1.7.25.jar

/opt/software/hbase-2.3.4/lib/client-facing-thirdparty/slf4j-log4j12-1.7.30.jar

发生了冲突

解决思路：

​	我们可以将habse中的日志实现中jar包注释掉

​		slf4j-log4j12-1.7.30.jar ==> slf4j-log4j12-1.7.30.jar.bak

我们现在kk01机器上进行修改，然后在kk01使用rsync命令进行远程同步

```shell
# 进入/opt/software/hbase-2.3.4/lib/client-facing-thirdparty目录
[nhk@kk01 ~]$ cd /opt/software/hbase-2.3.4/lib/client-facing-thirdparty
[nhk@kk01 client-facing-thirdparty]$ ll
total 2092
-rw-r--r--. 1 nhk nhk   20437 Jan 22  2020 audience-annotations-0.5.0.jar
-rw-r--r--. 1 nhk nhk   61829 Jan 22  2020 commons-logging-1.2.jar
-rw-r--r--. 1 nhk nhk 1506370 Jan 22  2020 htrace-core4-4.2.0-incubating.jar
-rw-r--r--. 1 nhk nhk  489884 Jan 22  2020 log4j-1.2.17.jar
-rw-r--r--. 1 nhk nhk   41472 Jan 22  2020 slf4j-api-1.7.30.jar
-rw-r--r--. 1 nhk nhk   12211 Jan 22  2020 slf4j-log4j12-1.7.30.jar	# 就是这个

# 我们将这个jar包注释掉
[nhk@kk01 client-facing-thirdparty]$ mv slf4j-log4j12-1.7.30.jar slf4j-log4j12-1.7.30.jar.bak
[nhk@kk01 client-facing-thirdparty]$ ll
total 2092
-rw-r--r--. 1 nhk nhk   20437 Jan 22  2020 audience-annotations-0.5.0.jar
-rw-r--r--. 1 nhk nhk   61829 Jan 22  2020 commons-logging-1.2.jar
-rw-r--r--. 1 nhk nhk 1506370 Jan 22  2020 htrace-core4-4.2.0-incubating.jar
-rw-r--r--. 1 nhk nhk  489884 Jan 22  2020 log4j-1.2.17.jar
-rw-r--r--. 1 nhk nhk   41472 Jan 22  2020 slf4j-api-1.7.30.jar
-rw-r--r--. 1 nhk nhk   12211 Jan 22  2020 slf4j-log4j12-1.7.30.jar.bak	# 已经注释掉了
```

```shell
# 将修改内容同步至kk02、kk03
[nhk@kk01 client-facing-thirdparty]$ rsync -av /opt/software/hbase-2.3.4/lib/client-facing-thirdparty/ kk02:$PWD

[nhk@kk01 client-facing-thirdparty]$ rsync -av /opt/software/hbase-2.3.4/lib/client-facing-thirdparty/ kk03:$PWD
```

此致，我们解决了SLF4J绑定多个日志实现的问题了

下面我们现在重新启动hbase进行验证

```shell
[nhk@kk01 client-facing-thirdparty]$ stop-hbase.sh 	# 关闭Hbase集群
stopping hbase...........
[nhk@kk01 client-facing-thirdparty]$ start-hbase.sh # 启动Hbase集群，发现没有打印SLFJ相关日志了
running master, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-master-kk01.out
kk01: running regionserver, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-regionserver-kk01.out
kk03: running regionserver, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-regionserver-kk03.out
kk02: running regionserver, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-regionserver-kk02.out
[nhk@kk01 client-facing-thirdparty]$ jpsall 
=========kk01=========
2753 DataNode
5282 HMaster
2359 QuorumPeerMain
3303 JobHistoryServer
5543 HRegionServer
2603 NameNode
6029 Jps
3119 NodeManager
=========kk02=========
2643 ResourceManager
3766 HRegionServer
2792 NodeManager
2298 QuorumPeerMain
2430 DataNode
4094 Jps
=========kk03=========
2665 NodeManager
3785 Jps
2301 QuorumPeerMain
2430 DataNode
2526 SecondaryNameNode
3438 HRegionServer
[nhk@kk01 client-facing-thirdparty]$ 
```





## 1.5 HA 高可用模式

在HBase中HMaster负责监控HRegionServer的生命周期，均衡RegionServer的负载，如果Hmaster挂掉了，那么整个HBase集群就将陷入不健康的状态，并且此时的工作状态并不会持续太久。

所以HBase支持对HMaster的高可用配置。（生产环境中，建议使用HA模式，如果不使用可能会遇到单点故障问题）

上面搭建集群已经详细描述了，这里至概括一下大概步骤

### **1）确保配置HA时关闭HBase集群**

（如果是关闭状态则跳过该步骤）

```shell
[nhk@kk01 ~]$ stop-hbase.sh
stopping hbase..........
```

### **2）在conf目录下创建backup-masters文件**

如需HBase的**HA模式**，则在/opt/software/base-2.3.4/conf 目录下新建**backup-masters**文件，用于备份HBase主节点kk01

```shell
[nhk@kk01 conf]$ pwd
/opt/software/hbase-2.3.4/conf
[nhk@kk01 conf]$ touch backup-masters
```

### **3）在backup-masters文件中配置高可用HMster节点**

```shell
# 将 kk02 作为备份HMaster节点
[nhk@kk01 conf]$ echo kk02 > backup-masters
[nhk@kk01 conf]$ cat backup-masters 
kk02
```

### **4）将整个conf目录rsync到其他节点**

```shell
[nhk@kk01 conf]$ rsync -av /opt/software/hbase-2.3.4/conf/ kk02:$PWD
[nhk@kk01 conf]$ rsync -av /opt/software/hbase-2.3.4/conf/ kk03:$PWD
```

### **5）重启hbase测试**

```shell
[nhk@kk01 bin]$ start-hbase.sh 
running master, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-master-kk01.out
kk02: running regionserver, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-regionserver-kk02.out
kk01: running regionserver, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-regionserver-kk01.out
kk03: running regionserver, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-regionserver-kk03.out
kk02: running master, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-master-kk02.out
```

打开web ui页面测试查看

http://kk01:16010/master-status  我们可以看到有备份Hmaster

http://kk02:16010/master-status 我们可以看到kk02上显示 Current Active Master: kk01

或者是使用jsp查看kk02的进程

```shell
[nhk@kk01 conf]$ jpsall 
=========kk01=========
15216 HMaster
2753 DataNode
16097 Jps
2359 QuorumPeerMain
3303 JobHistoryServer
15481 HRegionServer
2603 NameNode
3119 NodeManager
=========kk02=========
8993 HRegionServer
9730 Jps
2643 ResourceManager
2792 NodeManager
2298 QuorumPeerMain
2430 DataNode
9231 HMaster	# 备份HMaster
=========kk03=========
2665 NodeManager
7227 HRegionServer
2301 QuorumPeerMain
2430 DataNode
2526 SecondaryNameNode
7631 Jps
```

### 6）验证备份HMaster

```shell
# 我们手动kill掉kk01的HMaster模拟故障问题
[nhk@kk01 conf]$ kill -9 15216
[nhk@kk01 conf]$ jps
2753 DataNode
2359 QuorumPeerMain
3303 JobHistoryServer
16615 Jps
15481 HRegionServer
2603 NameNode
3119 NodeManager
```

打开web ui页面测试查看

http://kk01:16010	页面已经无法访问

http://kk02:16010 	我们可以看到kk02上的Hmaster已经成功上位了

```shell
# 手动重启kk01上的hmaster
[nhk@kk01 hbase-2.3.4]$ bin/hbase-daemon.sh start master
running master, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-master-kk01.out
[nhk@kk01 hbase-2.3.4]$ jps
2753 DataNode
2359 QuorumPeerMain
3303 JobHistoryServer
15481 HRegionServer
2603 NameNode
16891 Jps
16700 HMaster
3119 NodeManager
```

打开web ui页面测试查看

http://kk01:16010	可以看到 Current Active Master: kk02

http://kk02:16010 	kk02上的HMaster依然是主Master



## 1.6 Hbase HA模式备份节点Hmaster 启动问题

如果我们kk02上的HMaster备份节点不能正常启动，没有其他问题的话，大概率就是conf目录下的**backup-masters**文件名写错了，我一开始就写成了backup_masters，导致备份节点的HMaster进程未启动的

解决方法：

​	修改正确文件名为backup-masters即可（修改前记得将集群关闭）

​	关闭顺序：先关闭 habse集群，再关闭Hadoop集群，最后关闭zookeeper集群

我们从 $HBASE_HOME/bin/master-backup.sh 脚本中看到如下信息

```shell
export HOSTLIST="${HBASE_CONF_DIR}/backup-masters"
```

该脚本启动时会加载 $HBASE_HOME/conf/backup-masters 文件，如果文件名写错了，就加载不到



# 1.7 **参考硬件配置**

针对大概800TB存储空间的集群中每个Java进程的典型内存配置：

| 进程               | 堆   | 描述                                                        |
| ------------------ | ---- | ----------------------------------------------------------- |
| NameNode           | 8 GB | 每100TB数据或每100W个文件大约占用NameNode堆1GB的内存        |
| SecondaryNameNode  | 8GB  | 在内存中重做主NameNode的EditLog，因此配置需要与NameNode一样 |
| DataNode           | 1GB  | 适度即可                                                    |
| ResourceManager    | 4GB  | 适度即可（注意此处是MapReduce的推荐配置）                   |
| NodeManager        | 2GB  | 适当即可（注意此处是MapReduce的推荐配置）                   |
| HBase HMaster      | 4GB  | 轻量级负载，适当即可                                        |
| HBase RegionServer | 12GB | 大部分可用内存、同时为操作系统缓存、任务进程留下足够的空间  |
| ZooKeeper          | 1GB  | 适度                                                        |

推荐：

-   Master机器要运行NameNode、ResourceManager、以及HBase HMaster，推荐24GB左右

-   Slave机器需要运行DataNode、NodeManager和HBase RegionServer，推荐24GB（及以上）

-   根据CPU的核数来选择在某个节点上运行的进程数，例如：两个4核CPU=8核，每个Java进程都可以独立占有一个核（推荐：8核CPU）

-   内存不是越多越好，在使用过程中会产生较多碎片，Java堆内存越大， 会导致整理内存需要耗费的时间越大。例如：给RegionServer的堆内存设置为64GB就不是很好的选择，一旦FullGC就会造成较长时间的等待，而等待较长，Master可能就认为该节点已经挂了，然后移除掉该节点

