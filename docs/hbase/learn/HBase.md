# HBase简介

## HBase定义

​	Apache Hbase是**以hdfs为数据存储**的，一种**分布式**、可扩展的NoSQL数据库。是**面向列**的开源数据库，对大数据实现了**随机定位和实时读写**。

​	Hbase是基于Goole的BigTable技术实现的，Goole BigTable利用GFS作为其文件系统，HBase利用Hadoop的HDFS作为其文件系统

​	Goole运用MapReduce来处理BigTable中的海量数据，HBase同样运用Hadoop的MapReduce来处理BigTable中的海量数据

​	Goole BigTable利用Cubby来进行协同服务，HBase运用Zookeeper进行协同服务。

HBase具有以下特点：

-   1）读取数据实时性强：可以实现对大数据的**随机访问**和**实时读写**
-   2）存储空间大：可以**存储十亿行、百万列、上千个版本的数据**。
-   3）具有可伸缩性：可以通过增删节点实现数据的伸缩性存储
-   4）靠可行强：HBase的**RegionServer之间可以实现自动故障转移**

-   5）面向列：面向列（簇）的存储和权限控制，列（簇）独立检索

-   6）数据类型单一：HBase中的数据都是字符串，没有其他类型



## HBase数据模型

HBase的涉及理论依据Goole的BigTable论文，论文中对于数据库模型的首局介绍为：

​		BigTable是一个**稀疏的、分布式的、持久的**多维排序的map

对于映射的解释如下：

**该映射由行键、列键和时间戳索引；映射中的每个值都是一个未解释的字节数组。**

最终的HBase关于数据模型和BigTable的对应关系如下：

​	HBase 使用与 BigTable 非常相识的数据模型。用户将数据行存储在带标签的表中。数据行具有可排序的键和任意数量的列。该表存储稀疏，因为如果用户喜欢，同一表的行可以具有疯狂变化的列

​	最终理解HBase数据模型的关键在于**稀疏、分布式、多维、排序**的映射。其中映射map指代非关系型数据库的key-value结构。

### HBase逻辑结构

HBase 是一个分布式的、面向列的 NoSQL 数据库，其逻辑结构主要由以下几个部分组成：

1.  命名空间（Namespace）：命名空间是 HBase 中的顶层容器，用于将表分组管理。每个命名空间下可以包含多个表，命名空间的名称必须是唯一的。

2.  表（Table）：表是 HBase 中的基本数据单元，由多个行和列族组成。每个表都有一个唯一的名称，表中的数据按照行键（Row Key）排序存储。

3.  行（Row）：行是表中的一个数据单元，由行键、列族和列组成。行键是一个字节数组，用于唯一标识一行数据。

4.  列族（Column Family）：列族是表中的一个逻辑分组，包含多个列。每个列族都有一个唯一的名称，列族中的列共享相同的前缀，用于区分不同的列族。

5.  列（Column）：列是表中的一个数据单元，由列族、列限定符和时间戳组成。列限定符是一个字节数组，用于唯一标识一个列，时间戳用于标识数据的版本。

    HBase 的逻辑结构可以看作是一个三维的表格，其中**行键为第一维，列族为第二维，列限定符和时间戳为第三维**。通过这种结构，HBase 可以支持高效的数据存储和查询，适用于大规模数据的存储和处理。

### HBase物理存储结构

HBase 的物理存储结构主要由以下几个部分组成：

1.  Region：Region 是 HBase 中的数据分片单元，每个 Region 包含一段连续的行键范围。当表中的数据量增加时，HBase 会自动将一个 Region 分裂成两个或多个 Region，以实现数据的水平扩展。
2.  HFile：HFile 是 HBase 中的数据存储文件，用于存储一个或多个列族的数据。每个 HFile 包含多个数据块（Data Block）和索引块（Index Block），用于支持高效的数据读取和查询。
3.  MemStore：MemStore 是 HBase 中的内存数据缓存，用于缓存写入的数据。当 MemStore 中的数据量达到一定阈值时，HBase 会将其转换为一个 HFile，并将其写入磁盘。
4.  WAL：**WAL**（Write-Ahead Log）是 HBase 中的写前日志，用于记录所有的写操作。WAL 可以保证数据的一致性和可靠性，即使在节点故障或宕机的情况下也能够恢复数据。

HBase 的物理存储结构采用了 LSM（Log-Structured Merge）树的设计思想，即将数据写入内存缓存（MemStore），当缓存满时将其转换为一个 HFile，并将其写入磁盘。同时，HBase 还采用了数据分片和数据副本的技术，以实现高可用性和高性能的数据存储和查询。

### 数据模型

​	在HBase中，数据存储在具有行和列的表中。这看起来像关系型数据库（RDBMS）一样，但是HBase表看作是多维的map结构更易于理解

​	HBase是一个**面向列**的数据库，数据模型主要有命名空间（Namespace）、表（Table）、行键（Roekey）、列簇（Column Family）、列（Column）、时间戳（Timestamp）、单元格（cell）

**1）NameSpace**

命名空间可以对表进行逻辑分组，类似于关系型数据库的database概念，每个命名空间下有多个表。HBase两个自带的命名空间，分别是hbase、default，hbase中存放的是HBase内置的表（默认情况下是过滤掉的），default表是用户默认使用的命名空间

**2）Table**

- HBase中的数据都是以表的形式来组织架构的。

- HBAse的表由多个行组成

类似于关系型数据的表概念。不同的是，该表由行键和列簇组成，按行键的字节序排序。HBase**定义表时只需要声明列簇即可，不需要声明具体的列**。因为数据存储是稀疏的，所有往HBase写入数据时，字段可以动态、按需指定。因此，和关系型数据库对比时，HBase能够轻松应对字段变更的场景。

**3）Row**

- HBase中行由rowKey（行键）和一个或多个列组成

- 行存储时按行键字典序排序

- 行键的设计非常重要，尽量让相关的行存储在一起

HBase表中的每行数据都由一个RowKey和多个Column（列）组成，数据是按照Rowkey的字典序存储，并且查询数据时**只能根据RowKey进行检索**，所以RowKey的设计十分重要。因为行键是每一行数据的**唯一标识**，可以使用任意字符串表示。行键的最大长度为64KB,实际应用中一般为10~1000byte，**行键保存为字节数组**

**列（Column）**

HBase中的列由列族（Column Family）和列限定符（Column Qualifier）组成

**4）Column Family**

HBase中的每一列都有**Column Family（列簇）和Column Qualifier（列限定符）**进行限定，例如 info: age 。

**建表时，必须声明列簇**，而列限定符无需预先定义。

HBase官方建议所以的列族保持一样的列，并将同一类的列放在一个列族中

**5）Column  Qualifier**

列以键值对的形式进行存储。列的值都是字节数组，没有类型和长度限定。列的格式通常为Column Family（列簇）：Column Qualifier（列限定符）例如name:tom列和name:jcak列都是列簇的成员。

**6）Time Stamp**

用于标识数据的不同版本（version），每条数据写入时，**系统会自动为其加上该字段**，其值为写入HBase的时间。

**每个单元格cell通常保存这同一份数据的多个版本（Version）**，它们用时间戳（64位的整型数据）来区分。

时间戳可以被自动赋值（HBase自动对**时间戳**赋值，该值是**精确到毫秒的当前系统时间**）和显示赋值（客户手动显示指定）

为了方便管理数据的版本管理，HBase提供了两种数据的版本回收方式：

- ​	保存数据的最后n个版本
- ​	保存最近一段时间内的版本（比如，最近7天的版本）

**7）cell**

**单元格由{rowkey, colum Family, column Qualifier, timestamp}唯一确定**。cell中的数据全部都是字节码形式存储的。

## HBase基本架构

​	HBase主要涉及4个模块：Client（客户端）、Zookeeper、HMaster（主服务）、HRegionServer（区域服务器）。其中HRegionServer包括HRegion、Store、MenStore、Store、HFile、HLong等组件。

**架构角色：**

**1、Master：**

​	主要进程，通常部署在namenode上。具体实现类位**HMaster**，负责监控集群中所有RegionServer的实例。HMaster负责维护表和HRegion的元数据信息，表的元数据保存在Zookeeper上，**HBase一般有多个HMaster，以便实现自动故障转移。**

主要作用：

​	1）**管理元数据**表格hbase:meta，接收用户对表格创建修改删除的命令并执行

​	2）监控region是否需要进行负载均衡，故障转移和region拆分。

​	3）发现离线的HRgeionServer，并为其重新分配HRgion

​	4）负责HDFS上的垃圾文件回收

通过启动多个后台线程监控实现上述功能：

- LoadBalancer负载均衡器

周期性监控region分布在regionServer上面是否均衡，由参数hbase.balancer.period控制周期时间，默认5分钟

- CatalogJanitor 元数据管理器

定期检查和清理hbase:meta中的数据。

- MasterProcWAL master 预写日志处理器

把master需要执行的任务记录到 预写日志WAL中，如果master宕机，让backupMaster读取日志继续干

**2、RegionServer：**

主要进程，通常部署在datenode上。具体实现类位HRegionServer，是HBase中的核心模块，一个HRegionServer一般会有多个HRegion和一个HLog，用户可根据需要添加或删除HRegionServer。

主要作用：

1）维护HMaster分配的HRegion，处理对这些HRegion的IO请求

2）拆分合并region的实际执行者，有master监控，有regionServer执行

3）负责数据cell的处理，例如写入数据put、查询数据get等

功能：主要负责数据cell的处理。同时在执行区域的拆分和合并时，由RegionServer来实际执行

**3、Zookeeper**

zookeeper在HBase中的主要作用：

1）HRegionServer主动向zookeeper集群注册，使得HMaster可以随时感知各个HRegionServer的运行状态（是否在线），避免HMaster出现单点故障问题。

2）HMaster启动时会将HBase系统表加载到Zookeeper集群中，通过Zookeeper集群可以获取当前系统表hbase:meta的存储所对应的HRegionServer信息。其中，系统表指命名空间hbase下的表namespace和meta

**4、HDFS**

HDFS为HBase提供最终的底层数据存储服务，同时为HBase提供高容错的支持。



# HBase快速入门

## HBase安装部署

HBase部署前提，保证Hadoop集群的正常部署，Zookeeper集群的正常部署

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

## HBase单机模式

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
# 进入/etc/profile
[nhk@kk01 software]$ vi /etc/profile
# 在文件末尾添加如下内容

# hbase env
export HBASE_HOME=/opt/software/hbase-2.3.4
export PATH=$PATH:$HBASE_HOME/bin

# 使环境变量生效
[nhk@kk01 software]$ source /etc/profile

# 验证环境变量生效
[nhk@kk01 software]$ hbase version
HBase 2.3.4
....

# 看到形如 HBase 2.3.4 的版本信息则证明环境变量生效
```

### 3）修改 hbase-env.sh文件

**配置/opt/software/hbase/hbase-2.3.4/conf 目录下hbase-env.sh文件**

```shell
[nhk@kk01 software]$ cd /opt/software/hbase-2.3.4/conf
[nhk@kk01 conf]$ vim hbase-env.sh

# 做出如下修改
将注释中的 # export JAVA_HOME=/usr/java/jdk1.8.0/
修改为以下
export JAVA_HOME=/opt/software/jdk1.8.0_152/

# zk 为true使用集成zk false使用集群zk
export HBASE_MANAGES_ZK=true
```

### 4）修改 hbase-site.xml 文件

**修改**/opt/software/hbase/hbase-2.3.4/conf 目录下**hbase-site.xml文件**

```shell
[nhk@kk01 conf]$ vim hbase-site.xml
```

```xml
# 在configuration标签下添加如下
# 如果是搭建的是集群，这里value填 hdfs://kk01:8020/hbase
<property>
<!--指定HBase数据的存放目录-->
    <name>hbase.rootdir</name>
    <value>file:///opt/software/hbase-2.3.4/datas</value>    # 需要确保/opt/software/hbase-2.3.4/datas目录存在
 </property>

 <property>
 <!-- 指定zookeeper集群存放数据的目录-->
 <!--zk快照的存储位置-->
    <name>hbase.zookeeper.property.dataDir</name>
     <value>/opt/software/zookeeper-3.6.1/zkData</value>  # 需要确保/opt/software/zookeeper-3.6.1/zkData目录存在
 </property>
 
 <property>
    <name>hbase.master.maxclockskew</name>
    <value>180000</value> 
    <description> time difference of regionserver from(区域服务器的时间差)，如果集群之间的服务器时间不同步，则需要配置</description>
 </property>



# 分别创建hbase、zookeeper目录
mkdir hbase
mkdir zookeeper
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
start-hbase.sh
```

**使用JPS查看HBase进程**

```shell
jps

# 进程信息如下  查看到HMaster说明Hbase单击模式启动成功
[root@kk01 conf]# jps
9296 HMaster
3106 ResourceManager
2644 DataNode
2469 NameNode
9509 Jps
3292 NodeManager
```

### **6）验证HBase部署是否成功**

```shell
hbase shell
# 出现下面信息说明部署成功
# hbase(main):001:0>
```

### **7）关闭HBase**

```shell
stop-hbase.sh
```

  

## HBase集群搭建

### 1）修改 hbase-env.sh文件

**修改/opt/software/hbase/hbase-2.3.4/conf 目录下hbase-env.sh文件**

```shell
# 改为false 目的是设置HBase不使用内置的zookeeper，而是使用外部安装的zookeeper集群
export HBASE_MANAGES_ZK=false
```

### 2）修改 hbase-site.xml 文件

**修改/opt/software/hbase/hbase-2.3.4/conf 目录下hbase-site.xml文件**

```xml
# 将configuration标签下内容替换为如下

<property>
	<!--hbase的运行模式，false为单击，true为分布式，若为false，hbase和zk会运行在同一个jvm里面-->
 	<!-- 开启HBase完全分布式-->
    <name>hbase.cluster.distributed</name>
    <value>true</value>
</property>

<property>
	<!-- 指定HBase需要连接的ZOokeeper集群,也就是zk集群的地址-->
    <name>hbase.zookeeper.quorum</name>
    <value>kk01,kk02,kk03</value>
</property>

<property>    
 <!-- 指定zookeeper集群存放数据的目录-->
 <!--zk快照的存储位置-->
    <name>hbase.zookeeper.property.dataDir</name>
    <value>/opt/software/zookeeper-3.6.1/zkData</value>  # 需要确保/opt/software/zookeeper-3.6.1/zkData目录存在
</property>	

<property>  
<!--指定HBase数据的存放目录,这里我们选择存放在HDFS中-->
    <name>hbase.rootdir</name>
    <value>hdfs://kk01:8020/hbase</value>
</property>

```

### **3）修改regionservers内容**

```shell
[nhk@kk01 conf]$ vim regionservers
```

```shell
# 将文件内容替换为如下

kk01
kk02
kk03
```

### 4）core-site.xml 和 hdfs-site.xml

方式一：

​	将Hadoop的配置文件目录（/opt/software/hadoop-3.2.2/etc/hadoop）下的core-site.xml和hdfs-site.xml复制到/opt/software/hbase/hbase-2.3.4/conf目录下

```shell
[nhk@kk01 conf]$ cd /opt/software/hadoop-3.2.2/etc/hadoop
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

​	如需HBase的**HA模式**，则在/opt/software/base-2.3.4/conf 目录下新建**backup-masters**文件，用于备份HBase主节点kk01（HA模式可选）

```shell
# 单主节点崩溃时，HBase自动启动备份节点
[nhk@kk01 conf]$ vim backup-masters 

# backup-masters 文件内容如下：
kk02
```

### **5）解决hbase与Hadoop的log4j兼容问题**

```shell
# 修改HBase的jar包，使用Hadoop的jar包
# 将HBase的相应jar包重命名
[nhk@kk01 conf]$ mv /opt/software/hbase-2.3.4/lib/client-facing-thirdparty/slf4j-log4j12-1.7.30.jar /opt/software/hbase-2.3.4/lib/client-facing-thirdparty/slf4j-log4j12-1.7.30.jar.bak

[nhk@kk01 client-facing-thirdparty]$ ll
total 2092
-rw-r--r--. 1 nhk nhk   20437 Jan 22  2020 audience-annotations-0.5.0.jar
-rw-r--r--. 1 nhk nhk   61829 Jan 22  2020 commons-logging-1.2.jar
-rw-r--r--. 1 nhk nhk 1506370 Jan 22  2020 htrace-core4-4.2.0-incubating.jar
-rw-r--r--. 1 nhk nhk  489884 Jan 22  2020 log4j-1.2.17.jar
-rw-r--r--. 1 nhk nhk   41472 Jan 22  2020 slf4j-api-1.7.30.jar
-rw-r--r--. 1 nhk nhk   12211 Jan 22  2020 slf4j-log4j12-1.7.30.jar.bak
```

### **6）分发HBase到集群的其他节点**

```shell
[nhk@kk01 ~]$ scp -r /opt/software/hbase-2.3.4/ kk02:/opt/software/hbase-2.3.4
[nhk@kk01 ~]$ scp -r /opt/software/hbase-2.3.4/ kk03:/opt/software/hbase-2.3.4

# 或 (使用下面命令先要进入hbase-2.3.4目录)
scp -r /opt/software/hbase-2.3.4/ kk02:$PWD
scp -r /opt/software/hbase-2.3.4/ kk03:$PWD
```

### **7）分发配置文件**

```shell
[nhk@kk01 ~]$ scp -r /etc/profile kk02:/etc/profile
[nhk@kk01 ~]$ scp -r /etc/profile kk03:/etc/profile

# 在kk02、kk03节点重新加载配置文件，命令如下
source /etc/profile
```

### 8）启动测试

**注意：如果搭建的是HA模式的HBase，启动HBase前需要先启动Zookeeper集群和Hadoop集群**

启动hadoop与zk（如果已经启动了可以忽略此步骤）

```shell
zkServer.sh start  # 每台集群都要输入
start-dfs.sh
start-yarn.sh

[nhk@kk01 ~]$ jpsall
=========kk01=========
6805 ResourceManager
7429 JobHistoryServer
5992 QuorumPeerMain
6248 NameNode
6377 DataNode
6937 NodeManager
7533 Jps
=========kk02=========
5218 Jps
4900 SecondaryNameNode
4665 QuorumPeerMain
5037 NodeManager
4798 DataNode
=========kk03=========
5104 NodeManager
5284 Jps
4965 DataNode
4840 QuorumPeerMain
```

**单点启动、停止**

```shell
[nhk@kk01 ~]$ hbase-daemon.sh start master
[nhk@kk01 ~]$ hbase-daemon.sh start regionserver

[nhk@kk02 ~]$ hbase-daemon.sh start master
[nhk@kk02 ~]$ hbase-daemon.sh start regionserver

[nhk@kk03 ~]$ hbase-daemon.sh start regionserver

[nhk@kk01 ~]$ jpsall
=========kk01=========
8194 Jps
6805 ResourceManager
7429 JobHistoryServer
5992 QuorumPeerMain
6248 NameNode
7928 HRegionServer
6377 DataNode
6937 NodeManager
7646 HMaster
=========kk02=========
5522 HRegionServer
4900 SecondaryNameNode
4665 QuorumPeerMain
5724 Jps
5037 NodeManager
4798 DataNode
5326 HMaster
=========kk03=========
5104 NodeManager
5600 Jps
4965 DataNode
4840 QuorumPeerMain
5407 HRegionServer


# 停止命令
hbase-daemon.sh stop master
hbase-daemon.sh stop regionserver
```

**shell脚本一键启停hbase集群**

```shell
[nhk@kk01 ~]$ start-hbase.sh 

[nhk@kk01 ~]$ stop-hbase.sh
```

**验证HBase集群是否启动成功**

```shell
[nhk@kk01 ~]$ hbase shell
                                                                                         ...                                               
hbase(main):001:0> 
```

**查看HBase Web UI界面**

```
http://kk01:16010
```

最后看到如下信息则说明HBase HA 启动成功

```shell
[nhk@kk01 conf]$ start-hbase.sh 
running master, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-master-kk01.out
kk01: running regionserver, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-regionserver-kk01.out
kk02: running regionserver, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-regionserver-kk02.out
kk03: running regionserver, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-regionserver-kk03.out
kk02: running master, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-master-kk02.out
```

照着上述步骤部署Hbase集群，但是还是遇见下面两个问题

### 解决start-hbase.sh 的log4j问题

```shell
[root@kk01 ~]# start-hbase.sh 
running master, logging to /opt/software/hbase/hbase-2.3.4/logs/hbase-root-master-kk01.out
kk02: running regionserver, logging to /opt/software/hbase/hbase-2.3.4/bin/../logs/hbase-root-reg
ionserver-kk02.outkk03: running regionserver, logging to /opt/software/hbase/hbase-2.3.4/bin/../logs/hbase-root-reg
ionserver-kk03.outkk01: running regionserver, logging to /opt/software/hbase/hbase-2.3.4/bin/../logs/hbase-root-reg
ionserver-kk01.outkk01: SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
kk01: SLF4J: Defaulting to no-operation (NOP) logger implementation
kk01: SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
...
```

产生的原因：

Hadoop的jar包与Hbase的jar包发生冲突

解决方法：

​	我们直接使用Hadoop的jar即可

```shell
# 以下操作三台机器都要做

# 进入/opt/software/hbase-2.3.4/lib/client-facing-thirdparty目录
# 将前面重命名的jar包改回来
cd /opt/software/hbase-2.3.4/lib/client-facing-thirdparty
mv slf4j-log4j12-1.7.30.jar.bak slf4j-log4j12-1.7.30.jar

# 进入/opt/software/hbase-2.3.4/conf目录
cd /opt/software/hbase-2.3.4/conf
vim hbase-env.sh
# 将注释的内容解开，做出如下修改。直接使用Hadoop的jar包即可解决
export HBASE_DISABLE_HADOOP_CLASSPATH_LOOKUP="true"
```

### Hbase HA模式备份节点Hmaster 启动问题

​	可能是conf目录下的**backup-masters**文件名写错了，我一开始就写成了backup_masters，导致备份节点的HMaster进程未启动的

解决方法：

​	修改正确文件名为backup-masters即可（修改前记得将集群关闭）

​	关闭顺序：先关闭 habse集群，再关闭Hadoop集群，最后关闭zookeeper集群



## HA 高可用模式

​	在HBase中HMaster负责监控HRegionServer的生命周期，均衡RegionServer的负载，如果Hmaster挂掉了，那么整个HBase集群就将陷入不健康的状态，并且此时的工作状态并不会持续太久。所以HBase支持对HMaster的高可用配置。（生产环境中，建议使用HA模式，如果不使用可能会遇到单点故障问题）

上面搭建集群已经详细描述了，这里至概括一下大概步骤

**1）确保配置HA时关闭HBase集群**（如果是关闭状态则跳过该步骤）

```shell
[nhk@kk01 ~]$ stop-hbase.sh
stopping hbase..........
```

**2）在conf目录下创建backup-master文件**

```shell
[nhk@kk01 conf]$ touch conf/backup-master
```

**3）在backup-master文件中配置高可用HMster节点**

```shell
[nhk@kk01 conf]$ echo kk02 > conf/backup-master
```

**4)将整个conf目录scp到其他节点**

```shell
[nhk@kk01 conf]$ xsync conf  # 注 xsync是自定义脚本
```

**5）重启hbase，打开web ui页面测试查看或者是使用jsp查看kk02的进程**



## HBase集群遇到的问题

**hbase shell 的log4j问题**

```shell
[root@kk01 hbase]# hbase shell
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/opt/software/hadoop-3.2.2/share/hadoop/common/lib/slf4j-log4j12-1.7.25.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/opt/software/hbase/hbase-2.3.4/lib/client-facing-thirdparty/slf4j-log4j12-1.7.30.jar!/org/slf4j/impl/StaticLoggerBinder.cl
ass]SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.slf4j.impl.Log4jLoggerFactory]
HBase Shell
Use "help" to get list of supported commands.
Use "exit" to quit this interactive shell.
For Reference, please visit: http://hbase.apache.org/2.0/book.html#shell
Version 2.3.4, rafd5e4fc3cd259257229df3422f2857ed35da4cc, Thu Jan 14 21:32:25 UTC 2021
Took 0.0008 seconds                                                                                                                                     
hbase(main):001:0> 
```

解决：

​	只需要删除或者重命名/opt/software/hbase-2.3.4/lib/client-facing-thirdparty目录下的slf4j-log4j12-1.7.30.jar.bak 为 slf4j-log4j12-1.7.30.jar即可

# HBase Shell

## 基本操作

**1）进入HBase客户端命令行**（如下是正常进入hbase shell显示的一些信息）

```shell
[nhk@kk01 ~]$ hbase shell
2023-04-06 07:54:50,135 WARN  [main] util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applic
ableHBase Shell
Use "help" to get list of supported commands.
Use "exit" to quit this interactive shell.
For Reference, please visit: http://hbase.apache.org/2.0/book.html#shell
Version 2.3.4, rafd5e4fc3cd259257229df3422f2857ed35da4cc, Thu Jan 14 21:32:25 UTC 2021
Took 0.0010 seconds                                                                                                                                          
hbase(main):001:0> 
```

**2）查看帮助**

​	展示Hbase中所有能使用的命令，主要使用的命令有namespace命名空间相关、DDL创建修改表格、DML写入读取数据

```shell
hbase(main):002:0> help
```

## namespace

### **1）查看当前HBase中有哪些namespace**

```shell
hbase(main):003:0> list_namespace
NAMESPACE                                                                                 default                                                                                   hbase                                                                                     2 row(s)
Took 0.5280 seconds             

# 其中有以下两个系统创建的namespace
default(创建表时未指定命名空间的话默认在default下)                                             hbase(系统使用的，用来存放系统相关的元数据信息等，勿随便操作)
```

### **2）创建命名空间**

```shell
hbase(main):004:0> create_namespace 'bigdata'  # 创建命名空间
Took 0.1992 seconds       
# 或者
hbase(main):005:0> create_namespace "bigdata", {"author"=>"wyh", "create_time"=>"2023-04-06 08:08:08"}
```

### **3）查看namespace**

```shell
hbase(main):023:0> describe_namespace 'bigdata'
DESCRIPTION                                                                                                                                                  
{NAME => 'bigdata'}                                                                                                                                          
Quota is disabled
Took 0.0543 seconds        	
```

### **4）修改namespace的信息（添加或者修改属性）**

```shell
hbase(main):025:0> alter_namespace 'bigdata',{METHOD => 'set', 'author' => 'weiyunhui'}
Took 0.1735 seconds      
```

添加或者修改属性

```shell
hbase(main):027:0> alter_namespace 'bigdata', {METHOD => 'set', 'PROPERTY_NAME' => 'PROPERTY_VALUE'}
Took 0.1364 seconds      
```

删除属性    

```shell
hbase(main):028:0> alter_namespace 'bigdata', {METHOD => 'unset', NAME => ' PROPERTY_NAME '} 
Took 0.1297 seconds    
```

### **5）删除namespace**

```shell
hbase(main):037:1' drop namespace 'bigdata'
```

注意: 要删除的namespace必须是空的，其下没有表。

## DDL	

### **查看当前数据库有哪些表**

```shell
hbase(main):001:0> list  		# 查看数据库中的表
TABLE                                                                                     0 row(s)
Took 0.5210 seconds                                                                       => []
```

### **1）创建表**

在创建表时，若**不指定命名空间，则默认namespace=default**

```shell
# 不指定namespace，默认namespace=default
create 't1', 'f1'  	# 创建表t1，列族 f1

create 'ns1:t1', {NAME => 'f1', VERSIONS => 5}   # 在指定namespace ns1中创建表 t1

create 't1', {NAME => 'f1'}, {NAME => 'f2'}, {NAME => 'f3'}  # 创建表t1，列族 f1、f2、f3
```

```shell
hbase(main):012:0* create 'bigdata:person', {NAME => 'info', VERSIONS => 5}, {NAME => 'msg', VERSIONS => 5}
Created table bigdata:person
Took 1.2765 seconds                                                                       => Hbase::Table - bigdata:person

hbase(main):020:0> list      # 查看是否创建成功
TABLE                                                                                     bigdata:person                                                                           1 row(s)
Took 0.0116 seconds                                                                       => ["bigdata:person"]
```

### **2）查看表结构**

```shell
describe 't1'			# 不指定nemespace，默认查看default中的 t1表	
describe 'ns1:t1'

desc 't1'		
desc 'ns1:t1'
```

```shell
hbase(main):014:0> describe 'bigdata:person'	# 查看 bigdata 中的 person 表
Table bigdata:person is ENABLED                                                           bigdata:person                                                                           COLUMN FAMILIES DESCRIPTION                                                                                                                                 
{NAME => 'info', BLOOMFILTER => 'ROW', IN_MEMORY => 'false', VERSIONS => '5', KEEP_DELETED_CELLS => 'FALSE', DATA_BLOCK_ENCODING => 'NONE', COMPRESSION => 'N
ONE', TTL => 'FOREVER', MIN_VERSIONS => '0', BLOCKCACHE => 'true', BLOCKSIZE => '65536', REPLICATION_SCOPE => '0'}                                           

{NAME => 'msg', BLOOMFILTER => 'ROW', IN_MEMORY => 'false', VERSIONS => '5', KEEP_DELETED_CELLS => 'FALSE', DATA_BLOCK_ENCODING => 'NONE', COMPRESSION => 'NO
NE', TTL => 'FOREVER', MIN_VERSIONS => '0', BLOCKCACHE => 'true', BLOCKSIZE => '65536', REPLICATION_SCOPE => '0'}        

# 说明
NAME			表示列族名
BLOOMFILTER		表示为列族级别的类型
IN_MEMORY		表示是否存入内存
VERSIONS		表示版本数
KEEP_DELETED_CELLS	设置被删除的数据，在基于时间的历史数据查询中是否依然可见
DATA_BLOCK_ENCODING	表示数据块的算法
COMPRESSION		表示设置压缩算法
TTL				表示版本存活时间
MIN_VERSIONS	表示最小版本数
BLOCKCACHE		表示是否设置读缓存
BLOCKSIZE		
```

### **3）修改表**

表名创建时写的所有和列族相关的信息，都可以后续通过alter修改，包括增加删除列族

（1）**增加列族和修改信息都会使用覆盖的方法**

```shell
# 修改表
hbase(main):043:0> alter 'bigdata:person', {NAME => 'info', VERSIONS => 3}

# 查看表，查看是否修改成功
hbase(main):022:0> desc 'bigdata:person'        # 查看发现 VERSIONS => '3'，证明修改成功
Table bigdata:person is ENABLED                                                           bigdata:person                                                                           COLUMN FAMILIES DESCRIPTION                                                               {NAME => 'info', BLOOMFILTER => 'ROW', IN_MEMORY => 'false', VERSIONS => '3', KEEP_DELETED_CELLS => 'FALSE', DATA_BLOCK_ENCODING => 'NONE', COMPRESSION => 'N
ONE', TTL => 'FOREVER', MIN_VERSIONS => '0', BLOCKCACHE => 'true', BLOCKSIZE => '65536', REPLICATION_SCOPE => '0'}                                           

{NAME => 'msg', BLOOMFILTER => 'ROW', IN_MEMORY => 'false', VERSIONS => '5', KEEP_DELETED_CELLS => 'FALSE', DATA_BLOCK_ENCODING => 'NONE', COMPRESSION => 'NO
NE', TTL => 'FOREVER', MIN_VERSIONS => '0', BLOCKCACHE => 'true', BLOCKSIZE => '65536', REPLICATION_SCOPE => '0'}        
```

**（2）删除信息使用特殊的语法**

```shell
hbase> alter 'ns1:t1', NAME => 'f1', METHOD => 'delete'
hbase> alter 'ns1:t1', 'delete' => 'f1'
```

```shell
# 删除列族的特殊语法
hbase(main):045:0> alter 'bigdata:person', NAME => 'info',METHOD => 'delete'
hbase(main):047:0> alter 'bigdata:person', 'delete' => 'msg'
```

注意：

​	**表中至少有一个列族**，当删除最后一个列族的时候会报错 org.apache.hadoop.hbase.DoNotRetryIOException	

### **4）删除表**

hbase shell中删除表格，需要先将表格状态设置为不可用

```shell
hbase(main):001:0> disable 'bigdata:person'         # 禁用表                                                                                                 
hbase(main):002:0> drop 'bigdata:person'            # 删除表
```

注意：如果直接drop表，会报错：ERROR:Table student is enabled. Disable it first.

## DML

### **1）写入数据**

​	在HBase中如果想要写入数据，只能添加结构中最底层的cell。可以手动写入时间戳指定cell版本，推荐不写**默认使用当前的系统时间。**

```shell
hbase> put 'ns1:t1', 'r1', 'c1', 'value'   # r1为行键、c1为列族与列名、value为插入的值
hbase> put 't1', 'r1', 'c1', 'value'
hbase> put 't1', 'r1', 'c1', 'value', ts1	# ts1为时间戳，不推荐这种写法
hbase> put 't1', 'r1', 'c1', 'value', {ATTRIBUTES=>{'mykey'=>'myvalue'}} #ATTRIBUTES 属性
hbase> put 't1', 'r1', 'c1', 'value', ts1, {ATTRIBUTES=>{'mykey'=>'myvalue'}}
hbase> put 't1', 'r1', 'c1', 'value', ts1, {VISIBILITY=>'PRIVATE|SECRET'}
```

```shell
hbase(main):006:0> create 'bigdata:student',{NAME => 'info'}	# 创建表
# 写入数据 
hbase(main):010:0> put 'bigdata:student','1001','info:name','zhangsan'                   hbase(main):011:0> put 'bigdata:student','1001','info:name','lisi'
hbase(main):012:0> put 'bigdata:student','1001','info:age','18'
```

注意：

​	如果重复写入相同的rowKey，相同的列，会写入多个版本的数据进行覆盖

​	可以修改cell的 version，以维护多个版本的数据

### **2）读取数据**

读取数的方法有两个：**get** 和 **scan**

**get最大范围是一行数据**，也可以进行列的过滤，读取数据的结果为多行cell

```shell
hbase> get 'ns1:t1', 'r1'		# 读取某一行键
hbase> get 't1', 'r1'		
hbase> get 't1', 'r1', {TIMERANGE => [ts1, ts2]}	
hbase> get 't1', 'r1', {COLUMN => 'c1'}		#读取某一行键的某几列
hbase> get 't1', 'r1', {COLUMN => ['c1', 'c2', 'c3']}
hbase> get 't1', 'r1', {COLUMN => 'c1', TIMESTAMP => ts1}
hbase> get 't1', 'r1', {COLUMN => 'c1', TIMERANGE => [ts1, ts2], VERSIONS => 4}
hbase> get 't1', 'r1', {COLUMN => 'c1', TIMESTAMP => ts1, VERSIONS => 4}
hbase> get 't1', 'r1', {FILTER => "ValueFilter(=, 'binary:abc')"}
hbase> get 't1', 'r1', 'c1'
hbase> get 't1', 'r1', 'c1', 'c2'
hbase> get 't1', 'r1', ['c1', 'c2']
hbase> get 't1', 'r1', {COLUMN => 'c1', ATTRIBUTES => {'mykey'=>'myvalue'}}
hbase> get 't1', 'r1', {COLUMN => 'c1', AUTHORIZATIONS => ['PRIVATE','SECRET']}
hbase> get 't1', 'r1', {CONSISTENCY => 'TIMELINE'}
hbase> get 't1', 'r1', {CONSISTENCY => 'TIMELINE', REGION_REPLICA_ID => 1}

hbase> get 't1', 'r1', {FORMATTER => 'toString'}
hbase> get 't1', 'r1', {FORMATTER_CLASS => 'org.apache.hadoop.hbase.util.Bytes', FORMATTER => 'toString'}
```

```shell
hbase(main):013:0> get 'bigdata:student','1001'   # 注意观察，上一步写入的 zhangsan 已被覆盖了
COLUMN                                   CELL                                             info:age                                timestamp=2023-04-06T08:27:26.272, value=18        info:name                               timestamp=2023-04-06T08:27:18.713, value=lisi  
```

也可以修改读取cell的版本数，默认读取一个。最多能读取当前列族设置的维护版本数

```shell
hbase(main):019:0> get 'bigdata:student','1001',{COLUMN => 'info:name'}
COLUMN                                   CELL                                              info:name                               timestamp=2023-04-06T08:27:18.713, value=lisi 

# 这里我们想要读取6个版本的数据，但是这个列族只保留一个版本的数据，所有只显示一个cell
hbase(main):020:0> get 'bigdata:student','1001',{COLUMN => 'info:name', VERSIONS => 6}
COLUMN                                   CELL                                             info:name                               timestamp=2023-04-06T08:27:18.713, value=lisi                                        
```

**scan是扫描数据，能够读取多行数据**，不建议扫描过多的数据，推荐使用 startRow 和 stopRow 来控制读取的数据，默认范围**左闭右开**

```shell
hbase(main):047:0> scan 'bigdata:student',{STARTROW => '1001',STOPROW => '1002'}
ROW                                      COLUMN+CELL                                                                                                         
 1001                                    column=info:age, timestamp=2023-06-25T01:05:44.443, value=18                                                        
 1001                                    column=info:name, timestamp=2023-06-25T01:05:37.818, value=lisi   
```

### **3）删除数据**

删除数据的方法有两个：delete 和 deleteall

**delete表示删除一个版本**的数据，即为一个cell，不填写版本**默认删除最新的一个版本**

```shell
hbase(main):030:0* delete 'bigdata:student','1001','info:name'

# 我们删除一个版本的数据以后，zhangsan就出来了
hbase(main):055:0> scan 'bigdata:student',{STARTROW => '1001',STOPROW => '1002'}
ROW                                      COLUMN+CELL                                                                                                         
 1001                                    column=info:age, timestamp=2023-06-25T01:05:44.443, value=18                                                        
 1001                                    column=info:name, timestamp=2023-06-25T01:05:19.183, value=zhangsan    
```

**deleteall表示删除所有版本**的数据，即为当前行当前列的多个cell，（**执行命名会标记数据为删除，不会直接将数据彻底删除，删除数据只在特定时期清理磁盘时进行）**

```shell
hbase(main):056:0> deleteall 'bigdata:student','1001','info:name'
```

### **4）清空表数据**

```shell
hbase(main):065:0* truncate 'bigdata:student'
```

注意：清空表的操作顺序为先disable，然后再truncate。

### **5）统计表数据行数**

```shell
count 't1'
count 'ns1:t1'
```



# HBase Java API

​	HBase是由Java语言开发的，他对外提供了Java API接口。通过Java API来操作HBase分布式数据库，包括增、删、改、查等对数据表的操作，如下

| 类或接口           | 说明                                            | 归属                           |
| ------------------ | ----------------------------------------------- | ------------------------------ |
| Admin              | 是一个类，**用于建立客户端和HBase数据库的连接** | org.apache.hadoop.hbase.client |
| HBaseConfiguration | 是一个类，用于将HBase配置添加到配置文件中       | org.apache.hadoop.hbase        |
| HTableDescriptor   | 是一个接口，用于表示表的信息                    | org.apache.hadoop.hbase        |
| HColumnDescriptor  | 是一个类，用于描述列族的信息                    | org.apache.hadoop.hbase        |
| Table              | 是一个接口，**用于实现HBase表的通信**           | org.apache.hadoop.hbase.client |
| Put                | 是一个类，用于插入数据操作                      | org.apache.hadoop.hbase.client |
| Get                | 是一个类，用于查询单条记录                      | org.apache.hadoop.hbase.client |
| Delete             | 是一个类，用于删除数据                          | org.apache.hadoop.hbase.client |
| Scan               | 是一个类，用于查询所有记录                      | org.apache.hadoop.hbase.client |
| Result             | 是一个类，用于查询返回的单条记录的结果          | org.apache.hadoop.hbase.client |

**HBase API 使用步骤：**

1）获取Configuration实例

2）在Configuration中设置 zk 和 master 的相关信息。如果 haase 的配置文件在环境变量中则不需要配置

3）获取Connection实例连接到zk

4）通过Connection 实例获得 Admin 和Table 实例调用其方法进行操作

## 环境准备

在pom.xml中添加依赖

注意：会报错java.el包不存在，是一个测试用的依赖，不影响使用

```xml
<dependencies>
    	<!-- Hbase客户端依赖-->
        <dependency>
            <groupId>org.apache.hbase</groupId>
            <artifactId>hbase-client</artifactId>
            <version>2.3.4</version>
            <exclusions>
                <exclusion>
                    <groupId>org.glassfish</groupId>
                    <artifactId>javax.el</artifactId> <!--会报错但不影响使用-->
                </exclusion>
            </exclusions>
        </dependency>
        <dependency>
            <groupId>org.glassfish</groupId>
            <artifactId>javax.el</artifactId>
            <version>3.0.1-b06</version>
        </dependency>
    	<!-- hbase核心依赖-->
        <dependency>
            <groupId>org.apache.hbase</groupId>
            <artifactId>hbase-common</artifactId>
            <version>2.3.4</version>
        </dependency>
</dependencies>
```

## 创建连接

​	根据官方API介绍，HBase的**客户端连接由ConnectionFactory类来创建**，用户使用完成之后**手动关闭连接**。同时连接是一个**重量级**的，推荐一个进程使用一个连接，对HBase的命令通过连接中的两个属性 Admin 和 Table 来实现。

### 单线程创建连接

**同步创建连接**  （默认的连接方式）

```java
Configuration conf = new Configuration();
conf.set("hbase.zookeeper.quorum","kk01,kk02,kk03");

Connection connection = ConnectionFactory.createConnection(conf);
```

**异步创建连接** （hbase2.3版本后的，不推荐使用）

```java
CompletableFuture<AsyncConnection> asyncConnection = 				       ConnectionFactory.createAsyncConnection(conf);
```

### 多线程创建连接

使用类**单例**的模式，确保使用一个连接，可以同时用于多个线程（这个是官方推荐的使用方式）

```java
public class HBaseConnection {
    //  声明一个静态属性
    public static Connection connection = null;
    static {
        // conf.set("hbase.zookeeper.quorum", "kk01,kk02,kk03"); 生产中，用src/main/sources目录下的文件代替
        try {
            // 创建连接
            // 使用读取本地文件的形式添加参数
            connection = ConnectionFactory.createConnection();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void closeConnection() throws IOException {
        if(connection != null){
            connection.close();
        }
    }

    public static void main(String[] args) throws IOException {
        // 直接使用创建好的连接
        // 不要在main线程里单独创建
        System.out.println(HBaseConnection.connection);
        
        //  在main线程的最后记得释放连接
        HBaseConnection.closeConnection();
    }
}
```

​	ConnectionFactory.createConnection()读取的参数在hbase-site.xml中，如下（与HBase服务器的一致，可以去复制修改）

```xml
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>

<configuration>

 <property>
    <name>hbase.zookeeper.quorum</name>
    <value>kk01:2181,kk02:2181,kk03:2181</value>
  </property>

</configuration>
```

## DDL

### 创建命名空间

```java
public class HBaseDDL {

    // 声明一个静态属性
    public static Connection connection = HBaseConnection.connection;

    /**
     * 创建命名空间
     * @param namespace 命名空间名称
     */
    public static void createNamespace(String namespace) throws IOException {
        // 1.获取admin(表管理对象)
        // 此处的异常先不抛出，等待方法写完，在进行统一处理
        // admin的连接是轻量级的，不是线程安全的，不推荐池化或者缓存这个连接
        Admin admin = connection.getAdmin();

        // 2.调用方法创建命名空间
        // 代码相对shell更加底层，所以shell能够实现的功能，代码一定能实现
        // 所以需要填写完整的命名空间描述

        // 2.1.创建命名空间描述的建造者 => 设计师
        NamespaceDescriptor.Builder builder = NamespaceDescriptor.create(namespace);

        // 2.2.给命名空间添加需求
        builder.addConfiguration("user","nhk");

        // 2.3.使用builder构造出对应的添加完参数的对象，完成创建
        // 创建命名空间出现的问题，都属于方法本身的问题，不应该抛出
        try {
            admin.createNamespace(builder.build());
        } catch (IOException e) {
            System.out.println("命名空间已存在");
            e.printStackTrace();
        }
        // 3.关闭admin
        admin.close();

    }
    public static void main(String[] args) throws IOException {
        // 测试创建命名空间
        createNamespace("clear");

        // 其他业务代码
        System.out.println("其他业务代码");

        // 关闭HBase连接（重量级，须在main最后关闭）
        HBaseConnection.closeConnection();
    }
}	

```

### 判断表格是否存在

```java
public class HBaseDDL {

    // 声明一个静态属性
    public static Connection connection = HBaseConnection.connection;

    /**
     * 创建命名空间
     *
     * @param namespace 命名空间名称
     */
    public static void createNamespace(String namespace) throws IOException {
        // 1.获取admin
        // 此处的异常先不抛出，等待方法写完，在进行统一处理
        // admin的连接是轻量级的，不是线程安全的，不推荐池化或者缓存这个连接
        Admin admin = connection.getAdmin();

        // 2.调用方法创建命名空间
        // 代码相对shell更加底层，所以shell能够实现的功能，代码一定能实现
        // 所以需要填写完整的命名空间描述

        // 2.1.创建命名空间描述的建造者 => 设计师
        NamespaceDescriptor.Builder builder = NamespaceDescriptor.create(namespace);

        // 2.2.给命名空间添加需求
        builder.addConfiguration("user", "nhk");

        // 2.3.使用builder构造出对应的添加完参数的对象，完成创建
        // 创建命名空间出现的问题，都属于方法本身的问题，不应该抛出
        try {
            admin.createNamespace(builder.build());
        } catch (IOException e) {
            System.out.println("命名空间已存在");
            e.printStackTrace();
        }
        // 3.关闭admin
        admin.close();

    }

    /**
     * 判断表格是否已存在，需要提供参数 名称空间和表名
     *
     * @param namespace
     * @param tableName
     * @return true表示表格已存在
     */
    public static boolean isTableExists(String namespace, String tableName) throws IOException {
        // 1.获取admin
        Admin admin = connection.getAdmin();

        // 2.使用方法判断表格是否存在
        boolean flag = false;
        try {
            flag = admin.tableExists(TableName.valueOf(namespace, tableName));
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 3.关闭admin
        admin.close();

        // 4.返回结果
        return flag;
    }

    public static void main(String[] args) throws IOException {
        // 测试创建命名空间
        //createNamespace("clear");

        // 测试判断表格是否存在
        System.out.println(isTableExists("nhk666", "person"));

        // 其他业务代码
        System.out.println("其他业务代码");

        // 关闭HBase连接（重量级，须在main最后关闭）
        HBaseConnection.closeConnection();
    }
}

```

### 创建表

```java
public class HBaseDDL {

    // 声明一个静态属性
    public static Connection connection = HBaseConnection.connection;

    /**
     * 创建命名空间
     *
     * @param namespace 命名空间名称
     */
    public static void createNamespace(String namespace) throws IOException {
        // 1.获取admin
        // 此处的异常先不抛出，等待方法写完，在进行统一处理
        // admin的连接是轻量级的，不是线程安全的，不推荐池化或者缓存这个连接
        Admin admin = connection.getAdmin();

        // 2.调用方法创建命名空间
        // 代码相对shell更加底层，所以shell能够实现的功能，代码一定能实现
        // 所以需要填写完整的命名空间描述

        // 2.1.创建命名空间描述的建造者 => 设计师
        NamespaceDescriptor.Builder builder = NamespaceDescriptor.create(namespace);

        // 2.2.给命名空间添加需求
        builder.addConfiguration("user", "nhk");

        // 2.3.使用builder构造出对应的添加完参数的对象，完成创建
        // 创建命名空间出现的问题，都属于方法本身的问题，不应该抛出
        try {
            admin.createNamespace(builder.build());
        } catch (IOException e) {
            System.out.println("命名空间已存在");
            e.printStackTrace();
        }
        // 3.关闭admin
        admin.close();

    }

    /**
     * 判断表格是否已存在，需要提供参数 名称空间和表名
     *
     * @param namespace
     * @param tableName
     * @return true表示表格已存在
     */
    public static boolean isTableExists(String namespace, String tableName) throws IOException {
        // 1.获取admin
        Admin admin = connection.getAdmin();

        // 2.使用方法判断表格是否存在
        boolean flag = false;
        try {
            flag = admin.tableExists(TableName.valueOf(namespace, tableName));
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 3.关闭admin
        admin.close();

        // 4.返回结果
        return flag;
    }

    /**
     * 创建表格
     * @param namespace
     * @param tableName
     * @param columnFamilies 列族名称 可以有多个
     */
    public static void createTable(String namespace, String tableName, String... columnFamilies) throws IOException {
        // 判断是否至少有一个列族
        if(columnFamilies.length == 0){
            System.out.println("创建表格至少应该有一个列族");
            return;
        }
        // 判断表格是否存在
        if(isTableExists(namespace,tableName)){
            System.out.println("表格已存在");
            return;
        }

        // 1.获取admin
        Admin admin = connection.getAdmin();

        // 2.调用方法创建表格
        // 2.1.创建表格描述的建造者
        TableDescriptorBuilder tableDescriptorBuilder = TableDescriptorBuilder.newBuilder(TableName.valueOf(namespace, tableName));

        // 2.2.添加参数
        for (String columnFamily: columnFamilies){
            // 2.2.创建列族描述的构造者
            ColumnFamilyDescriptorBuilder columnFamilyDescriptorBuilder = ColumnFamilyDescriptorBuilder.newBuilder(Bytes.toBytes(columnFamily));

            // 2.4.对应当前的列族添加参数
            // 添加版本参数（我们当前演示的信息）
            columnFamilyDescriptorBuilder.setMaxVersions(5);

            // 2.5.创建添加完参数的列族描述
            tableDescriptorBuilder.setColumnFamily(columnFamilyDescriptorBuilder.build());
        }
        // 2.6.创建对应的表格描述
        try {
            admin.createTable(tableDescriptorBuilder.build());
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 3.关闭admin
        admin.close();
    }

    public static void main(String[] args) throws IOException {
        // 测试创建命名空间
        //createNamespace("clear");

        // 测试判断表格是否存在
        //System.out.println(isTableExists("nhk666", "person"));

        // 测试创建表格
        createTable("clear","zjh","info","msg");

        // 其他业务代码
        System.out.println("其他业务代码");

        // 关闭HBase连接（重量级，须在main最后关闭）
        HBaseConnection.closeConnection();
    }
}

```

### 修改表

```java
import java.io.IOException;

public class HBaseDDL {

    // 声明一个静态属性
    public static Connection connection = HBaseConnection.connection;

    /**
     * 创建命名空间
     *
     * @param namespace 命名空间名称
     */
    public static void createNamespace(String namespace) throws IOException {
        // 1.获取admin
        // 此处的异常先不抛出，等待方法写完，在进行统一处理
        // admin的连接是轻量级的，不是线程安全的，不推荐池化或者缓存这个连接
        Admin admin = connection.getAdmin();

        // 2.调用方法创建命名空间
        // 代码相对shell更加底层，所以shell能够实现的功能，代码一定能实现
        // 所以需要填写完整的命名空间描述

        // 2.1.创建命名空间描述的建造者 => 设计师
        NamespaceDescriptor.Builder builder = NamespaceDescriptor.create(namespace);

        // 2.2.给命名空间添加需求
        builder.addConfiguration("user", "nhk");

        // 2.3.使用builder构造出对应的添加完参数的对象，完成创建
        // 创建命名空间出现的问题，都属于方法本身的问题，不应该抛出
        try {
            admin.createNamespace(builder.build());
        } catch (IOException e) {
            System.out.println("命名空间已存在");
            e.printStackTrace();
        }
        // 3.关闭admin
        admin.close();

    }

    /**
     * 判断表格是否已存在，需要提供参数 名称空间和表名
     *
     * @param namespace
     * @param tableName
     * @return true表示表格已存在
     */
    public static boolean isTableExists(String namespace, String tableName) throws IOException {
        // 1.获取admin
        Admin admin = connection.getAdmin();

        // 2.使用方法判断表格是否存在
        boolean flag = false;
        try {
            flag = admin.tableExists(TableName.valueOf(namespace, tableName));
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 3.关闭admin
        admin.close();

        // 4.返回结果
        return flag;
    }

    /**
     * 创建表格
     *
     * @param namespace
     * @param tableName
     * @param columnFamilies 列族名称 可以有多个
     */
    public static void createTable(String namespace, String tableName, String... columnFamilies) throws IOException {
        // 判断是否至少有一个列族
        if (columnFamilies.length == 0) {
            System.out.println("创建表格至少应该有一个列族");
            return;
        }
        // 判断表格是否存在
        if (isTableExists(namespace, tableName)) {
            System.out.println("表格已存在");
            return;
        }

        // 1.获取admin
        Admin admin = connection.getAdmin();

        // 2.调用方法创建表格
        // 2.1.创建表格描述的建造者
        TableDescriptorBuilder tableDescriptorBuilder = TableDescriptorBuilder.
                newBuilder(TableName.valueOf(namespace, tableName));

        // 2.2.添加参数
        for (String columnFamily : columnFamilies) {
            // 2.2.创建列族描述的构造者
            ColumnFamilyDescriptorBuilder columnFamilyDescriptorBuilder = ColumnFamilyDescriptorBuilder.
                    newBuilder(Bytes.toBytes(columnFamily));

            // 2.4.对应当前的列族添加参数
            // 添加版本参数（我们当前演示的信息）
            columnFamilyDescriptorBuilder.setMaxVersions(5);

            // 2.5.创建添加完参数的列族描述
            tableDescriptorBuilder.setColumnFamily(columnFamilyDescriptorBuilder.build());
        }
        // 2.6.创建对应的表格描述
        try {
            admin.createTable(tableDescriptorBuilder.build());
        } catch (IOException e) {
            System.out.println("表格已经存在");
            e.printStackTrace();
        }

        // 3.关闭admin
        admin.close();
    }

    /**
     * 修改表格，修改表格中一个列族的版本
     *
     * @param namespace
     * @param tableName
     * @param columnFamily
     * @param version
     * @return
     */
    public static void modifyTable(String namespace, String tableName, String columnFamily, int version) throws IOException {
        // 判断表格是否存在
        if(!isTableExists(namespace,tableName)){
            return;
        }

        // 1.获取admin
        Admin admin = connection.getAdmin();

        try {
            // 2.调用方法修改表格
            // 2.0.获取之前的表格描述
            TableDescriptor tableDescriptor = admin.getDescriptor(TableName.valueOf(namespace, tableName));

            // 2.1.创建一个表格描述建造者
            // 如果使用填写tableName的方法 相当于创建了一个新的表格描述者 没有之前的信息
            // 如果想要修改之前的信息 必须调用方法填写一个旧的表格描述
        /*TableDescriptorBuilder tableDescriptorBuilder = TableDescriptorBuilder.
                newBuilder(TableName.valueOf(namespace, tableName));*/
            TableDescriptorBuilder tableDescriptorBuilder = TableDescriptorBuilder.newBuilder(tableDescriptor);

            // 2.2.对应建造者进行表格数据修改
            ColumnFamilyDescriptor columnFamily1 = tableDescriptor.getColumnFamily(Bytes.toBytes(columnFamily));

            // 创建列族描述建造者
            // 需要填写记得列族描述
        /*ColumnFamilyDescriptorBuilder columnFamilyDescriptorBuilder = ColumnFamilyDescriptorBuilder.
                newBuilder(Bytes.toBytes(columnFamily));*/
            ColumnFamilyDescriptorBuilder columnFamilyDescriptorBuilder = ColumnFamilyDescriptorBuilder.newBuilder(columnFamily1);

            // 修改对应的版本
            columnFamilyDescriptorBuilder.setMaxVersions(version);

            // 此处修改的时候 如果填写的新创建 那么别的参数会被初始化
            tableDescriptorBuilder.modifyColumnFamily(columnFamilyDescriptorBuilder.build());


            admin.modifyTable(tableDescriptorBuilder.build());
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭admin
        admin.close();
    }

    public static void main(String[] args) throws IOException {
        // 测试创建命名空间
        //createNamespace("clear");

        // 测试判断表格是否存在
        //System.out.println(isTableExists("nhk666", "person"));

        // 测试创建表格
        //createTable("clear","zjh","info","msg");

        // 测试修改表格
        modifyTable("clear", "zjh", "info", 3);

        // 其他业务代码
        System.out.println("其他业务代码");

        // 关闭HBase连接（重量级，须在main最后关闭）
        HBaseConnection.closeConnection();
    }
}

```

### 删除表

```java
package com.clear;

import org.apache.hadoop.hbase.NamespaceDescriptor;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;

import java.io.IOException;

public class HBaseDDL {

    // 声明一个静态属性
    public static Connection connection = HBaseConnection.connection;

    /**
     * 创建命名空间
     *
     * @param namespace 命名空间名称
     */
    public static void createNamespace(String namespace) throws IOException {
        // 1.获取admin
        // 此处的异常先不抛出，等待方法写完，在进行统一处理
        // admin的连接是轻量级的，不是线程安全的，不推荐池化或者缓存这个连接
        Admin admin = connection.getAdmin();

        // 2.调用方法创建命名空间
        // 代码相对shell更加底层，所以shell能够实现的功能，代码一定能实现
        // 所以需要填写完整的命名空间描述

        // 2.1.创建命名空间描述的建造者 => 设计师
        NamespaceDescriptor.Builder builder = NamespaceDescriptor.create(namespace);

        // 2.2.给命名空间添加需求
        builder.addConfiguration("user", "nhk");

        // 2.3.使用builder构造出对应的添加完参数的对象，完成创建
        // 创建命名空间出现的问题，都属于方法本身的问题，不应该抛出
        try {
            admin.createNamespace(builder.build());
        } catch (IOException e) {
            System.out.println("命名空间已存在");
            e.printStackTrace();
        }
        // 3.关闭admin
        admin.close();

    }

    /**
     * 判断表格是否已存在，需要提供参数 名称空间和表名
     *
     * @param namespace
     * @param tableName
     * @return true表示表格已存在
     */
    public static boolean isTableExists(String namespace, String tableName) throws IOException {
        // 1.获取admin
        Admin admin = connection.getAdmin();

        // 2.使用方法判断表格是否存在
        boolean flag = false;
        try {
            flag = admin.tableExists(TableName.valueOf(namespace, tableName));
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 3.关闭admin
        admin.close();

        // 4.返回结果
        return flag;
    }

    /**
     * 创建表格
     *
     * @param namespace
     * @param tableName
     * @param columnFamilies 列族名称 可以有多个
     */
    public static void createTable(String namespace, String tableName, String... columnFamilies) throws IOException {
        // 判断是否至少有一个列族
        if (columnFamilies.length == 0) {
            System.out.println("创建表格至少应该有一个列族");
            return;
        }
        // 判断表格是否存在
        if (isTableExists(namespace, tableName)) {
            System.out.println("表格已存在");
            return;
        }

        // 1.获取admin
        Admin admin = connection.getAdmin();

        // 2.调用方法创建表格
        // 2.1.创建表格描述的建造者
        TableDescriptorBuilder tableDescriptorBuilder = TableDescriptorBuilder.
                newBuilder(TableName.valueOf(namespace, tableName));

        // 2.2.添加参数
        for (String columnFamily : columnFamilies) {
            // 2.2.创建列族描述的构造者
            ColumnFamilyDescriptorBuilder columnFamilyDescriptorBuilder = ColumnFamilyDescriptorBuilder.
                    newBuilder(Bytes.toBytes(columnFamily));

            // 2.4.对应当前的列族添加参数
            // 添加版本参数（我们当前演示的信息）
            columnFamilyDescriptorBuilder.setMaxVersions(5);

            // 2.5.创建添加完参数的列族描述
            tableDescriptorBuilder.setColumnFamily(columnFamilyDescriptorBuilder.build());
        }
        // 2.6.创建对应的表格描述
        try {
            admin.createTable(tableDescriptorBuilder.build());
        } catch (IOException e) {
            System.out.println("表格已经存在");
            e.printStackTrace();
        }

        // 3.关闭admin
        admin.close();
    }

    /**
     * 修改表格，修改表格中一个列族的版本
     *
     * @param namespace
     * @param tableName
     * @param columnFamily
     * @param version
     * @return
     */
    public static void modifyTable(String namespace, String tableName, String columnFamily, int version) throws IOException {
        // 判断表格是否存在
        if (!isTableExists(namespace, tableName)) {
            return;
        }

        // 1.获取admin
        Admin admin = connection.getAdmin();

        try {
            // 2.调用方法修改表格
            // 2.0.获取之前的表格描述
            TableDescriptor tableDescriptor = admin.getDescriptor(TableName.valueOf(namespace, tableName));

            // 2.1.创建一个表格描述建造者
            // 如果使用填写tableName的方法 相当于创建了一个新的表格描述者 没有之前的信息
            // 如果想要修改之前的信息 必须调用方法填写一个旧的表格描述
        /*TableDescriptorBuilder tableDescriptorBuilder = TableDescriptorBuilder.
                newBuilder(TableName.valueOf(namespace, tableName));*/
            TableDescriptorBuilder tableDescriptorBuilder = TableDescriptorBuilder.newBuilder(tableDescriptor);

            // 2.2.对应建造者进行表格数据修改
            ColumnFamilyDescriptor columnFamily1 = tableDescriptor.getColumnFamily(Bytes.toBytes(columnFamily));

            // 创建列族描述建造者
            // 需要填写记得列族描述
        /*ColumnFamilyDescriptorBuilder columnFamilyDescriptorBuilder = ColumnFamilyDescriptorBuilder.
                newBuilder(Bytes.toBytes(columnFamily));*/
            ColumnFamilyDescriptorBuilder columnFamilyDescriptorBuilder = ColumnFamilyDescriptorBuilder.newBuilder(columnFamily1);

            // 修改对应的版本
            columnFamilyDescriptorBuilder.setMaxVersions(version);

            // 此处修改的时候 如果填写的新创建 那么别的参数会被初始化
            tableDescriptorBuilder.modifyColumnFamily(columnFamilyDescriptorBuilder.build());

            admin.modifyTable(tableDescriptorBuilder.build());
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭admin
        admin.close();
    }

    /**
     * 删除表格
     *
     * @param namespace
     * @param tableName
     * @return
     */
    public static boolean deleteTable(String namespace, String tableName) throws IOException {
        if (!isTableExists(namespace, tableName)) {
            System.out.println("表格不存在 无法删除");
            return false;
        }
        // 1.获取admin
        Admin admin = connection.getAdmin();

        // 2.调用相关方法删除表格
        try {
            // HBase删除表格之前 一定要将先禁用表格 否则报错 TableNotDisabledException
            TableName tableName1 = TableName.valueOf(namespace, tableName);
            admin.disableTable(tableName1);
            admin.deleteTable(tableName1);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 3.关闭admin
        admin.close();
        return true;
    }

    public static void main(String[] args) throws IOException {
        // 测试创建命名空间
        //createNamespace("clear");

        // 测试判断表格是否存在
        //System.out.println(isTableExists("nhk666", "person"));

        // 测试创建表格
        //createTable("clear","zjh","info","msg");

        // 测试修改表格
        //modifyTable("clear", "zjh", "info", 3);

        // 测试删除表格
        deleteTable("nhk666","person");
        // 其他业务代码
        System.out.println("其他业务代码");

        // 关闭HBase连接（重量级，须在main最后关闭）
        HBaseConnection.closeConnection();
    }
}

```



## DML

### 插入数据

```java
public class HBaseDML {

    // 静态属性
    public static Connection connection = HBaseConnection.connection;

    /**
     * 插入数据
     * @param namespace
     * @param tableName
     * @param rowKey  相当于关系型数据库的主键
     * @param columnFamily 列族
     * @param columnName  列名
     * @param value 值
     */
    public static void putCell(String namespace, String tableName, String rowKey,
                               String columnFamily, String columnName, String value) throws IOException {
        // 1.获取table
        Table table = connection.getTable(TableName.valueOf(namespace, tableName));

        // 2.调用相关方法插入数据
        // 2.1.创建put对象
        Put put = new Put(Bytes.toBytes(rowKey));

        // 2.2.给put对象添加参数
        put.addColumn(Bytes.toBytes(columnFamily),Bytes.toBytes(columnName),Bytes.toBytes(value));

        // 2.3.将对象写入对应的方法
        try {
            table.put(put);
        } catch (IOException e) {
            e.printStackTrace();
        }
        // 3.关闭table
        table.close();
    }

    public static void main(String[] args) throws IOException {
        // 测试插入数据
        putCell("clear","zjh","1000","info","name","zjh");
        putCell("clear","zjh","1000","info","name","zjh2");

        // 其他业务代码
        System.out.println("其他业务代码");
        // 关闭连接
        HBaseConnection.closeConnection();
    }
}

```

### 查询数据

```java
package com.clear;

import javafx.scene.control.Tab;
import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.CellUtil;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;

import java.io.IOException;

public class HBaseDML {

    // 静态属性
    public static Connection connection = HBaseConnection.connection;

    /**
     * 插入数据
     * @param namespace
     * @param tableName
     * @param rowKey  相当于关系型数据库的主键
     * @param columnFamily 列族
     * @param columnName  列名
     * @param value 值
     */
    public static void putCell(String namespace, String tableName, String rowKey,
                               String columnFamily, String columnName, String value) throws IOException {
        // 1.获取table
        Table table = connection.getTable(TableName.valueOf(namespace, tableName));

        // 2.调用相关方法插入数据
        // 2.1.创建put对象
        Put put = new Put(Bytes.toBytes(rowKey));

        // 2.2.给put对象添加参数
        put.addColumn(Bytes.toBytes(columnFamily),Bytes.toBytes(columnName),Bytes.toBytes(value));

        // 2.3.将对象写入对应的方法
        try {
            table.put(put);
        } catch (IOException e) {
            e.printStackTrace();
        }
        // 3.关闭table
        table.close();
    }

    /**
     * 读取数据 读取对应的一行中的某一列
     * @param namespace
     * @param tableName
     * @param rowKey
     * @param columnFamily
     * @param columnName
     */
    public static void getCells(String namespace, String tableName, String rowKey,
                                String columnFamily, String columnName) throws IOException {
        // 1.获取table
        Table table = connection.getTable(TableName.valueOf(namespace,tableName));
        // 2.创建get对象
        Get get = new Get(Bytes.toBytes(rowKey));

        //  如果直接调用get方法读取数据 此时读取整一行的数据
        // 如果想读取某一列的数据 需要添加对应的参数
        get.addColumn(Bytes.toBytes(columnFamily),Bytes.toBytes(columnName));

        // 设置读取数据的版本
        get.readAllVersions();

        try {
            // 读取数据 得到result对象
            Result result = table.get(get);

            // 处理数据
            Cell[] cells = result.rawCells();

            // 测试方法：直接把读取的数据打印到控制台
            // 如果是实际开发  需要在额外定义方法 对应处理数据
            for (Cell cell:cells) {
                // cell存储数据比较底层
                String value = new String(CellUtil.cloneValue(cell));
                System.out.println(value);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭table
        table.close();

    }

    public static void main(String[] args) throws IOException {
        // 测试插入数据
        putCell("clear","zjh","1000","info","name","zjh");
        putCell("clear","zjh","1000","info","name","zjh2");

        // 测试读取数据
        getCells("clear","zjh","1000","info","name");

        // 其他业务代码
        System.out.println("其他业务代码");
        // 关闭连接
        HBaseConnection.closeConnection();
    }
}

```



### 扫描数据

```java
public class HBaseDML {

    // 静态属性
    public static Connection connection = HBaseConnection.connection;

    /**
     * 插入数据
     *
     * @param namespace
     * @param tableName
     * @param rowKey       相当于关系型数据库的主键
     * @param columnFamily 列族
     * @param columnName   列名
     * @param value        值
     */
    public static void putCell(String namespace, String tableName, String rowKey,
                               String columnFamily, String columnName, String value) throws IOException {
        // 1.获取table
        Table table = connection.getTable(TableName.valueOf(namespace, tableName));

        // 2.调用相关方法插入数据
        // 2.1.创建put对象
        Put put = new Put(Bytes.toBytes(rowKey));

        // 2.2.给put对象添加参数
        put.addColumn(Bytes.toBytes(columnFamily), Bytes.toBytes(columnName), Bytes.toBytes(value));

        // 2.3.将对象写入对应的方法
        try {
            table.put(put);
        } catch (IOException e) {
            e.printStackTrace();
        }
        // 3.关闭table
        table.close();
    }

    /**
     * 读取数据 读取对应的一行中的某一列
     *
     * @param namespace
     * @param tableName
     * @param rowKey
     * @param columnFamily
     * @param columnName
     */
    public static void getCells(String namespace, String tableName, String rowKey,
                                String columnFamily, String columnName) throws IOException {
        // 1.获取table
        Table table = connection.getTable(TableName.valueOf(namespace, tableName));
        // 2.创建get对象
        Get get = new Get(Bytes.toBytes(rowKey));

        //  如果直接调用get方法读取数据 此时读取整一行的数据
        // 如果想读取某一列的数据 需要添加对应的参数
        get.addColumn(Bytes.toBytes(columnFamily), Bytes.toBytes(columnName));

        // 设置读取数据的版本
        get.readAllVersions();

        try {
            // 读取数据 得到result对象
            Result result = table.get(get);

            // 处理数据
            Cell[] cells = result.rawCells();

            // 测试方法：直接把读取的数据打印到控制台
            // 如果是实际开发  需要在额外定义方法 对应处理数据
            for (Cell cell : cells) {
                // cell存储数据比较底层
                String value = new String(CellUtil.cloneValue(cell));
                System.out.println(value);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭table
        table.close();
    }

    /**
     * 扫描数据
     *
     * @param namespace
     * @param tableName
     * @param startRow  开始的row 包含
     * @param stopRow   结束的row 不包含
     */
    public static void scanRows(String namespace, String tableName, String startRow, String stopRow) {
        // 1.获取table
        Table table = connection.getTable(TableName.valueOf(namespace, tableName);
        // 2.创建scan对象
        Scan scan = new Scan();
        // 此时如果直接调用 会直接扫描整张表

        // 添加参数 来控制扫描的数据
        // 默认包含
        scan.withStartRow(Bytes.toBytes(startRow));
        // 默认不包含
        scan.withStopRow(Bytes.toBytes(stopRow));

        // 读取多行数据 获得scanner
        ResultScanner scanner = null;
        try {
            scanner = table.getScanner(scan);
            // result来记录一行数据         cell数组
            // ResultScanner来记录多行数据  result的数组
            for (Result result : scanner) {
                Cell[] cells = result.rawCells();

                for (Cell cell : cells) {
                    System.out.print(new String(CellUtil.cloneRow(cell)) + "-" +
                            new String(CellUtil.cloneFamily(cell)) + "-" +
                            new String(CellUtil.cloneQualifier(cell)) + "-" +
                            new String(CellUtil.cloneValue(cell)) + "\t");
                }
                System.out.println();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        table.close();
    }

    public static void main(String[] args) throws IOException {
        // 测试插入数据
        //putCell("clear", "zjh", "1000", "info", "name", "zjh");
        //putCell("clear", "zjh", "1000", "info", "name", "zjh2");

        // 测试读取数据
        //getCells("clear", "zjh", "1000", "info", "name");

        // 测试扫描数据
        scanRows("clear", "zjh", "1000", "1002");

        // 其他业务代码
        System.out.println("其他业务代码");
        // 关闭连接
        HBaseConnection.closeConnection();
    }
}

```



### 带过滤器

```java
public class HBaseDML {

    // 静态属性
    public static Connection connection = HBaseConnection.connection;

    /**
     * 插入数据
     *
     * @param namespace
     * @param tableName
     * @param rowKey       相当于关系型数据库的主键
     * @param columnFamily 列族
     * @param columnName   列名
     * @param value        值
     */
    public static void putCell(String namespace, String tableName, String rowKey,
                               String columnFamily, String columnName, String value) throws IOException {
        // 1.获取table
        Table table = connection.getTable(TableName.valueOf(namespace, tableName));

        // 2.调用相关方法插入数据
        // 2.1.创建put对象
        Put put = new Put(Bytes.toBytes(rowKey));

        // 2.2.给put对象添加参数
        put.addColumn(Bytes.toBytes(columnFamily), Bytes.toBytes(columnName), Bytes.toBytes(value));

        // 2.3.将对象写入对应的方法
        try {
            table.put(put);
        } catch (IOException e) {
            e.printStackTrace();
        }
        // 3.关闭table
        table.close();
    }

    /**
     * 读取数据 读取对应的一行中的某一列
     *
     * @param namespace
     * @param tableName
     * @param rowKey
     * @param columnFamily
     * @param columnName
     */
    public static void getCells(String namespace, String tableName, String rowKey,
                                String columnFamily, String columnName) throws IOException {
        // 1.获取table
        Table table = connection.getTable(TableName.valueOf(namespace, tableName));
        // 2.创建get对象
        Get get = new Get(Bytes.toBytes(rowKey));

        //  如果直接调用get方法读取数据 此时读取整一行的数据
        // 如果想读取某一列的数据 需要添加对应的参数
        get.addColumn(Bytes.toBytes(columnFamily), Bytes.toBytes(columnName));

        // 设置读取数据的版本
        get.readAllVersions();

        try {
            // 读取数据 得到result对象
            Result result = table.get(get);

            // 处理数据
            Cell[] cells = result.rawCells();

            // 测试方法：直接把读取的数据打印到控制台
            // 如果是实际开发  需要在额外定义方法 对应处理数据
            for (Cell cell : cells) {
                // cell存储数据比较底层
                String value = new String(CellUtil.cloneValue(cell));
                System.out.println(value);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭table
        table.close();
    }

    /**
     * 扫描数据
     *
     * @param namespace
     * @param tableName
     * @param startRow  开始的row 包含
     * @param stopRow   结束的row 不包含
     */
    public static void scanRows(String namespace, String tableName, String startRow, String stopRow) throws IOException {
        // 1.获取table
        Table table = connection.getTable(TableName.valueOf(namespace, tableName);
        // 2.创建scan对象
        Scan scan = new Scan();
        // 此时如果直接调用 会直接扫描整张表

        // 添加参数 来控制扫描的数据
        // 默认包含
        scan.withStartRow(Bytes.toBytes(startRow));
        // 默认不包含
        scan.withStopRow(Bytes.toBytes(stopRow));

        // 读取多行数据 获得scanner
        ResultScanner scanner = null;
        try {
            scanner = table.getScanner(scan);
            // result来记录一行数据         cell数组
            // ResultScanner来记录多行数据  result的数组
            for (Result result : scanner) {
                Cell[] cells = result.rawCells();

                for (Cell cell : cells) {
                    System.out.print(new String(CellUtil.cloneRow(cell)) + "-" +
                            new String(CellUtil.cloneFamily(cell)) + "-" +
                            new String(CellUtil.cloneQualifier(cell)) + "-" +
                            new String(CellUtil.cloneValue(cell)) + "\t");
                }
                System.out.println();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        table.close();
    }

    /**
     * 带过滤器扫描
     *
     * @param namespace
     * @param tableName
     * @param startRow     开始的row 包含
     * @param stopRow      结束的row 不包含
     * @param columnFamily
     * @param columnName
     * @param value
     */
    public static void filterScan(String namespace, String tableName, String startRow, String stopRow,
                                  String columnFamily, String columnName, String value) throws IOException {
        // 1.获取table
        Table table = connection.getTable(TableName.valueOf(namespace, tableName);
        // 2.创建scan对象
        Scan scan = new Scan();
        // 此时如果直接调用 会直接扫描整张表

        // 添加参数 来控制扫描的数据
        // 默认包含
        scan.withStartRow(Bytes.toBytes(startRow));
        // 默认不包含
        scan.withStopRow(Bytes.toBytes(stopRow));

        // 可以添加多个过滤
        FilterList filterList = new FilterList();

        // 创建过滤器
        // (1) 结果只保留当前列的数据
        ColumnValueFilter columnValueFilter = new ColumnValueFilter(
                // 列族名称
                Bytes.toBytes(columnFamily),
                // 列名
                Bytes.toBytes(columnName),
                // 比较关系
                CompareOperator.EQUAL,
                // 值s
                Bytes.toBytes(value)
        );

        // (2) 结果保留整行数据
        SingleColumnValueFilter singleColumnValueFilter = new SingleColumnValueFilter(
                // 列族名称
                Bytes.toBytes(columnFamily),
                // 列名
                Bytes.toBytes(columnName),
                // 比较关系
                CompareOperator.EQUAL,
                // 值
                Bytes.toBytes(value)
        );

        // 本身可以添加多个过滤器
        filterList.addFilter(columnValueFilter);
        filterList.addFilter(singleColumnValueFilter);

        // 添加过滤
        scan.setFilter(filterList);

        try {
            // 读取多行数据 获得scanner
            ResultScanner scanner = table.getScanner(scan);
            // result来记录一行数据         cell数组
            // ResultScanner来记录多行数据  result的数组
            for (Result result : scanner) {
                Cell[] cells = result.rawCells();

                for (Cell cell : cells) {
                    System.out.print(new String(CellUtil.cloneRow(cell)) + "-" +
                            new String(CellUtil.cloneFamily(cell)) + "-" +
                            new String(CellUtil.cloneQualifier(cell)) + "-" +
                            new String(CellUtil.cloneValue(cell)) + "\t");
                }
                System.out.println();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        table.close();
    }

    public static void main(String[] args) throws IOException {
        // 测试插入数据
        //putCell("clear", "zjh", "1000", "info", "name", "zjh");
        //putCell("clear", "zjh", "1000", "info", "name", "zjh2");

        // 测试读取数据
        //getCells("clear", "zjh", "1000", "info", "name");

        // 测试扫描数据
        scanRows("clear", "zjh", "1000", "1002");

        filterScan("clear", "zjh", "1000", "1002",
                "info","name","zjh");

        // 其他业务代码
        System.out.println("其他业务代码");
        // 关闭连接
        HBaseConnection.closeConnection();
    }
}

```

### 删除数据

```java

public class HBaseDML {

    // 静态属性
    public static Connection connection = HBaseConnection.connection;

    /**
     * 插入数据
     *
     * @param namespace
     * @param tableName
     * @param rowKey       相当于关系型数据库的主键
     * @param columnFamily 列族
     * @param columnName   列名
     * @param value        值
     */
    public static void putCell(String namespace, String tableName, String rowKey,
                               String columnFamily, String columnName, String value) throws IOException {
        // 1.获取table
        Table table = connection.getTable(TableName.valueOf(namespace, tableName));

        // 2.调用相关方法插入数据
        // 2.1.创建put对象
        Put put = new Put(Bytes.toBytes(rowKey));

        // 2.2.给put对象添加参数
        put.addColumn(Bytes.toBytes(columnFamily), Bytes.toBytes(columnName), Bytes.toBytes(value));

        // 2.3.将对象写入对应的方法
        try {
            table.put(put);
        } catch (IOException e) {
            e.printStackTrace();
        }
        // 3.关闭table
        table.close();
    }

    /**
     * 读取数据 读取对应的一行中的某一列
     *
     * @param namespace
     * @param tableName
     * @param rowKey
     * @param columnFamily
     * @param columnName
     */
    public static void getCells(String namespace, String tableName, String rowKey,
                                String columnFamily, String columnName) throws IOException {
        // 1.获取table
        Table table = connection.getTable(TableName.valueOf(namespace, tableName));
        // 2.创建get对象
        Get get = new Get(Bytes.toBytes(rowKey));

        //  如果直接调用get方法读取数据 此时读取整一行的数据
        // 如果想读取某一列的数据 需要添加对应的参数
        get.addColumn(Bytes.toBytes(columnFamily), Bytes.toBytes(columnName));

        // 设置读取数据的版本
        get.readAllVersions();

        try {
            // 读取数据 得到result对象
            Result result = table.get(get);

            // 处理数据
            Cell[] cells = result.rawCells();

            // 测试方法：直接把读取的数据打印到控制台
            // 如果是实际开发  需要在额外定义方法 对应处理数据
            for (Cell cell : cells) {
                // cell存储数据比较底层
                String value = new String(CellUtil.cloneValue(cell));
                System.out.println(value);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭table
        table.close();
    }

    /**
     * 扫描数据
     *
     * @param namespace
     * @param tableName
     * @param startRow  开始的row 包含
     * @param stopRow   结束的row 不包含
     */
    public static void scanRows(String namespace, String tableName, String startRow, String stopRow) throws IOException {
        // 1.获取table
        Table table = connection.getTable(TableName.valueOf(namespace, tableName));
        // 2.创建scan对象
        Scan scan = new Scan();
        // 此时如果直接调用 会直接扫描整张表

        // 添加参数 来控制扫描的数据
        // 默认包含
        scan.withStartRow(Bytes.toBytes(startRow));
        // 默认不包含
        scan.withStopRow(Bytes.toBytes(stopRow));

        // 读取多行数据 获得scanner
        ResultScanner scanner = null;
        try {
            scanner = table.getScanner(scan);
            // result来记录一行数据         cell数组
            // ResultScanner来记录多行数据  result的数组
            for (Result result : scanner) {
                Cell[] cells = result.rawCells();

                for (Cell cell : cells) {
                    System.out.print(new String(CellUtil.cloneRow(cell)) + "-" +
                            new String(CellUtil.cloneFamily(cell)) + "-" +
                            new String(CellUtil.cloneQualifier(cell)) + "-" +
                            new String(CellUtil.cloneValue(cell)) + "\t");
                }
                System.out.println();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        table.close();
    }

    /**
     * 带过滤器扫描
     *
     * @param namespace
     * @param tableName
     * @param startRow     开始的row 包含
     * @param stopRow      结束的row 不包含
     * @param columnFamily
     * @param columnName
     * @param value
     */
    public static void filterScan(String namespace, String tableName, String startRow, String stopRow,
                                  String columnFamily, String columnName, String value) throws IOException {
        // 1.获取table
        Table table = connection.getTable(TableName.valueOf(namespace, tableName));
        // 2.创建scan对象
        Scan scan = new Scan();
        // 此时如果直接调用 会直接扫描整张表

        // 添加参数 来控制扫描的数据
        // 默认包含
        scan.withStartRow(Bytes.toBytes(startRow));
        // 默认不包含
        scan.withStopRow(Bytes.toBytes(stopRow));

        // 可以添加多个过滤
        FilterList filterList = new FilterList();

        // 创建过滤器
        // (1) 结果只保留当前列的数据
        ColumnValueFilter columnValueFilter = new ColumnValueFilter(
                // 列族名称
                Bytes.toBytes(columnFamily),
                // 列名
                Bytes.toBytes(columnName),
                // 比较关系
                CompareOperator.EQUAL,
                // 值
                Bytes.toBytes(value)
        );

        // (2) 结果保留整行数据
        SingleColumnValueFilter singleColumnValueFilter = new SingleColumnValueFilter(
                // 列族名称
                Bytes.toBytes(columnFamily),
                // 列名
                Bytes.toBytes(columnName),
                // 比较关系
                CompareOperator.EQUAL,
                // 值
                Bytes.toBytes(value)
        );

        // 本身可以添加多个过滤器
        filterList.addFilter(columnValueFilter);
        filterList.addFilter(singleColumnValueFilter);

        // 添加过滤
        scan.setFilter(filterList);

        try {
            // 读取多行数据 获得scanner
            ResultScanner scanner = table.getScanner(scan);
            // result来记录一行数据         cell数组
            // ResultScanner来记录多行数据  result的数组
            for (Result result : scanner) {
                Cell[] cells = result.rawCells();

                for (Cell cell : cells) {
                    System.out.print(new String(CellUtil.cloneRow(cell)) + "-" +
                            new String(CellUtil.cloneFamily(cell)) + "-" +
                            new String(CellUtil.cloneQualifier(cell)) + "-" +
                            new String(CellUtil.cloneValue(cell)) + "\t");
                }
                System.out.println();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        table.close();
    }

    /**
     * 删除一行中的一列数据
     *
     * @param namespace
     * @param tableName
     * @param rowKey
     * @param columnFamily
     * @param columnName
     */
    public static void deleteColumn(String namespace, String tableName, String rowKey,
                                    String columnFamily, String columnName) throws IOException {
        // 1.获取table
        Table table = connection.getTable(TableName.valueOf(namespace, tableName));
        // 2.创建delete对象
        Delete delete = new Delete(Bytes.toBytes(rowKey));

        // 添加列信息
        // addColumn删除一个版本
        //delete.addColumn(Bytes.toBytes(columnFamily),Bytes.toBytes(columnName));
        // addColumns删除所以版本
        // 按照逻辑需要删除所以版本的数据
        delete.addColumns(Bytes.toBytes(columnFamily), Bytes.toBytes(columnName));

        try {
            table.delete(delete);
        } catch (IOException e) {
            e.printStackTrace();
        }

        //3.关闭table
        table.close();

    }

    public static void main(String[] args) throws IOException {
        // 测试插入数据
        //putCell("clear", "zjh", "1000", "info", "name", "zjh");
        //putCell("clear", "zjh", "1000", "info", "name", "zjh2");

        // 测试读取数据
        //getCells("clear", "zjh", "1000", "info", "name");

        // 测试扫描数据
        scanRows("clear", "zjh", "1000", "1002");

        filterScan("clear", "zjh", "1000", "1002",
                "info", "name", "zjh");

        // 测试删除数据
        deleteColumn("clear", "zjh", "1000", "name", "zjh");

        // 其他业务代码
        System.out.println("其他业务代码");
        // 关闭连接
        HBaseConnection.closeConnection();
    }
}

```

## **UnknownHostException**

Hbase报错：UnknownHostException: can not resolve kk02,16020,1680856333257

原因：

​	在window平台IDEA中写的HBase程序，直接在window本地运行报错

 hbase客户端连接时提示找不到主机，意思是就未认到配置文件中指定hostsname的主机，此时需要修改client主机上的hosts文件。

解决方法：

直接win+r以管理员身份打开cmd，切换目录至C:\WINDOWS\system32\drivers\etc，打开hosts文件修改

```shell
cd C:\WINDOWS\system32\drivers\etc
notepad hosts
```



# HBase进阶

## Master架构

Master 主要进程，具体实现类为 HMaster，通常部署在NameNode上。

Master服务端通过Zookeeper管理若干个 RegoinServer

​	Master服务端的 **负载均衡器** 通过读取meta表了解Region的分配，通过连接zookeeper了解RS（RegionServer）的启动情况。5分钟调控一次分配平衡。

​	Master服务端的 **元数据表管理器** 定期去清理 元数据表meta中的数据

​	Master服务端的 **MasterProcWAL预写日志管理器** 管理master自己的预写日志，如果宕机，让backUpMaster读取日志数据。本质上写数据到HDFS，32M文件或1h滚动，当操作执行到meta表之后删除WAL

**1）Meta表**（警告：不要去改这张表）

​	全称 hbase: meta，只是在 list 命令中被过滤掉了，本质和 HBase中其他的表一样。

RowKey：

​	([table],[region start key],[region id]) 即 表名，region起始位置 和 regionID

列：

​	info：regioninfo 为 region 信息，存储一个 HRegionInfo 对象

​	info：server 当前 region 所处在 RegionServer 信息，包括端口号

​	info：serverstartcode 当前 region 被分到 RegionServer 的起始时间

​	如果一个表处于切分的过程中，即 region 切分，还会多出两列 info:splitA 和 info:splitB，存储值也是HRegionInfo对象，拆分结束后，删除这两列

**注意：**

​	在客户端对元数据进行操作的时候才会连接master，如果对数据进行读写，直接连接zookeeper来读取目录 /hbase/meta-region-server 的节点信息，会记录 meta 表格的位置。直接读取即可，不需要访问 master，这样可以减轻 master 压力，相当于 master 专注于 meta 表的操作，客户端可直接读取meta表。

​	在 Hbase 的2.3版本更新了一种新模式，Master Registry。客户端可以访问 master 来读取 meta表的信息。加大了 master 压力，减轻了zookeeper的压力。



# HBase架构





## HBase物理存储







# 寻址机制





# HBase读写流程
