# HBase简介

## 1.1  **Hadoop的局限**

-   Hadoop主要是实现批量数据的处理，并且通过顺序方式访问数据

-   要查找数据必须搜索整个数据集， 如果要进行随机读取数据，效率较低

## 1.2  HBase 与 NoSQL

-   NoSQL是一个通用术语，泛指一个数据库并不是使用SQL作为主要语言的非关系型数据库
-   HBase是 BigTable（goole） 的开源 Java 版本。是**建立在HDFS之上**，提供高可靠性、高性能、列存储、可伸缩、实时读写NoSQL的**数据库系统**
-   HBase仅能通过主键(row key)和主键的 range 来检索数据，仅支持单行事务
-   主要用来存储结构化和半结构化的松散数据
-   Hbase查询数据功能很简单，不支持 join 等复杂操作，不支持复杂的事务（行级的事务），从技术上来说，HBase更像是一个「数据存储」而不是「数据库」，因为HBase缺少RDBMS中的许多特性，例如带类型的列、二级索引以及高级查询语言等
-   Hbase中支持的数据类型：byte[] 即字节数组
-   与Hadoop一样，Hbase目标主要依靠**横向扩展**，通过不断增加廉价的商用服务器，来增加存储和处理能力，例如，把集群从10个节点扩展到20个节点，存储能力和处理能力都会加倍
-   HBase中的表一般有这样的特点：
    -   大：一个表可以有上十亿行，上百万列
    -   面向列：面向列(族)的存储和权限控制，列(族)独立检索
    -   稀疏：对于为空(null)的列，并不占用存储空间，因此，表可以设计的非常稀疏

## 1.3 HBase定义

​	Apache Hbase是**以hdfs为数据存储**的，一种**分布式**、可扩展的NoSQL数据库。是**面向列**的开源数据库，对大数据实现了**随机定位和实时读写**。

​	Hbase是基于Goole的BigTable 技术实现的，Goole BigTable利用GFS作为其文件系统，HBase利用Hadoop的HDFS作为其文件系统

​	Goole运用MapReduce来处理BigTable中的海量数据，HBase同样运用Hadoop的MapReduce来处理BigTable中的海量数据

​	Goole BigTable利用Cubby来进行协同服务，HBase运用Zookeeper进行协同服务。

HBase具有以下特点：

-   1）读取数据实时性强：可以实现对大数据的**随机访问**和**实时读写**
-   2）存储空间大：可以**存储十亿行、百万列、上千个版本的数据**。
-   3）具有可伸缩性：可以通过增删节点实现数据的伸缩性存储
-   4）靠可行强：HBase的**RegionServer之间可以实现自动故障转移**
-   5）面向列：面向列（簇）的存储和权限控制，列（簇）独立检索
-   6）数据类型单一：HBase中的数据都是字符串（底层支持的是字节数组），没有其他类型



## 1.4  HBase应用场景

**对象存储**

不少的头条类、新闻类的的新闻、网页、图片存储在HBase之中，一些病毒公司的病毒库也是存储在HBase之中

**时序数据**

HBase之上有OpenTSDB模块，可以满足时序类场景的需求

**推荐画像**

用户画像，是一个比较大的稀疏矩阵，蚂蚁金服的风控就是构建在HBase之上

**时空数据**

主要是轨迹、气象网格之类，滴滴打车的轨迹数据主要存在HBase之中，另外在技术所有大一点的数据量的车联网企业，数据都是存在HBase之中

**CubeDB OLAP**

Kylin一个cube分析工具，底层的数据就是存储在HBase之中，不少客户自己基于离线计算构建cube存储在hbase之中，满足在线报表查询的需求

**消息/订单**

在电信领域、银行领域，不少的订单查询底层的存储，另外不少通信、消息同步的应用构建在HBase之上

**Feeds流**

典型的应用就是xx朋友圈类似的应用，用户可以随时发布新内容，评论、点赞。

**NewSQL**

之上有Phoenix的插件，可以满足二级索引、SQL的需求，对接传统数据需要SQL非事务的需求

**其他**

存储爬虫数据

海量数据备份

短网址

…

## 1.5  **发展历程**

| 年份       | 重大事件                                     |
| ---------- | -------------------------------------------- |
| 2006年11月 | Google发布BigTable论文.                      |
| 2007年10月 | 发布第一个可用的HBase版本，基于Hadoop 0.15.0 |
| 2008年1月  | HBase成为Hadoop的一个子项目                  |
| 2010年5月  | HBase成为Apache的顶级项目                    |

## 1.6  HBase特点

-   强一致性读/写
    -   HBASE不是“最终一致的”数据存储
    -   它非常适合于诸如高速计数器聚合等任务
-   自动分块
    -   HBase表通过Region分布在集群上，随着数据的增长，区域被自动拆分和重新分布
-   自动RegionServer故障转移
-   Hadoop/HDFS集成
    -   HBase支持HDFS开箱即用作为其分布式文件系统
-   MapReduce
    -   HBase通过MapReduce支持大规模并行处理，将HBase用作源和接收器
-   Java Client API
    -   HBase支持易于使用的 Java API 进行编程访问
-   Thrift/REST API
-   块缓存和布隆过滤器
    -   HBase支持块Cache和Bloom过滤器进行大容量查询优化
-   运行管理
    -   HBase为业务洞察和JMX度量提供内置网页。

## 1.7 **RDBMS与HBase的对比**

### 1.7.1  **关系型数据库**

**结构**

数据库以表的形式存在

支持FAT、NTFS、EXT、文件系统

使用主键（PK）

通过外部中间件可以支持分库分表，但底层还是单机引擎

使用行、列、单元格

**功能**

-   支持向上扩展（买更好的服务器）
-   使用SQL查询
-   面向行，即每一行都是一个连续单元
-   数据总量依赖于服务器配置
-   具有ACID支持
-   适合结构化数据
-   传统关系型数据库一般都是中心化的
-   支持事务
-   支持Join

### 1.7.2  HBase

**结构**

-   以表形式存在
-   支持HDFS文件系统
-   使用行键（row key）
-   原生支持分布式存储、计算引擎
-   使用行、列、列蔟和单元格

**功能**

-   支持向外扩展
-   使用API和MapReduce、Spark、Flink来访问HBase表数据
-   面向列蔟，即每一个列蔟都是一个连续的单元
-   数据总量不依赖具体某台机器，而取决于机器数量
-   HBase不支持ACID（Atomicity、Consistency、Isolation、Durability）
-   适合结构化数据和非结构化数据
-   一般都是分布式的
-   HBase不支持事务，支持的是单行数据的事务操作
-   不支持Join

## 1.8 **HDFS对比HBase**

### 1.8.1  **HDFS**

-   HDFS是一个非常适合存储大型文件的分布式文件系统
-   HDFS它不是一个通用的文件系统，也无法在文件中快速查询某个数据

### 1.8.2  **HBase**

-   HBase构建在HDFS之上，并为大型表提供快速记录查找(和更新)
-   HBase内部将大量数据放在HDFS中名为「StoreFiles」的索引中，以便进行高速查找
-   Hbase比较适合做快速查询等需求，而不适合做大规模的OLAP应用

## 1.9  Hive对比Hbase

### 1.9.1  Hive

-   数据仓库工具

Hive的本质其实就相当于将HDFS中已经存储的文件在Mysql中做了一个双射关系，以方便使用HQL去管理查询

-   用于数据分析、清洗

Hive适用于离线的数据分析和清洗，延迟较高

-   基于HDFS、MapReduce

Hive存储的数据依旧在DataNode上，编写的HQL语句终将是转换为MapReduce代码执行

### 1.9.2  HBase

-   NoSQL数据库

是一种面向列存储的非关系型数据库。

-   用于存储结构化和非结构化的数据

适用于单表非关系型数据的存储，不适合做关联查询，类似JOIN等操作。

-   基于HDFS

数据持久化存储的体现形式是Hfile，存放于DataNode中，被ResionServer以region的形式进行管理

-   延迟较低，接入在线业务使用

面对大量的企业数据，HBase可以直线单表大量数据的存储，同时提供了高效的数据访问速度

### 1.9.3  总结Hive与HBase

-   Hive和Hbase是两种基于Hadoop的不同技术
-   Hive是一种类SQL的引擎，并且运行MapReduce任务
-   Hbase是一种在Hadoop之上的NoSQL 的Key/value数据库
-   这两种工具是可以同时使用的。就像用Google来搜索，用FaceBook进行社交一样，Hive可以用来进行统计查询，HBase可以用来进行实时查询，数据也可以从Hive写到HBase，或者从HBase写回Hive



## 1.10 HBase数据模型

HBase的涉及理论依据Goole的BigTable论文，论文中对于数据库模型的首局介绍为：

​		BigTable是一个**稀疏的、分布式的、持久的**多维排序的map

对于映射的解释如下：

**该映射由行键、列键和时间戳索引；映射中的每个值都是一个未解释的字节数组。**

最终的HBase关于数据模型和BigTable的对应关系如下：

​	HBase 使用与 BigTable 非常相识的数据模型。用户将数据行存储在带标签的表中。数据行具有可排序的键和任意数量的列。该表存储稀疏，因为如果用户喜欢，同一表的行可以具有疯狂变化的列

​	最终理解HBase数据模型的关键在于**稀疏、分布式、多维、排序**的映射。其中映射map指代非关系型数据库的key-value结构。

### 1.10.1 HBase逻辑结构

HBase 是一个分布式的、面向列的 NoSQL 数据库，其逻辑结构主要由以下几个部分组成：

1.  命名空间（Namespace）：命名空间是 HBase 中的顶层容器，用于将表分组管理。每个命名空间下可以包含多个表，命名空间的名称必须是唯一的。

2.  表（Table）：表是 HBase 中的基本数据单元，由多个行和列族组成。每个表都有一个唯一的名称，表中的数据按照行键（Row Key）排序存储。

3.  行（Row）：行是表中的一个数据单元，由行键、列族和列组成。行键是一个字节数组，用于唯一标识一行数据。

4.  列族（Column Family）：列族是表中的一个逻辑分组，包含多个列。每个列族都有一个唯一的名称，列族中的列共享相同的前缀，用于区分不同的列族。

5.  列（Column）：列是表中的一个数据单元，由列族、列限定符和时间戳组成。列限定符是一个字节数组，用于唯一标识一个列，时间戳用于标识数据的版本。

    HBase 的逻辑结构可以看作是一个三维的表格，其中**行键为第一维，列族为第二维，列限定符和时间戳为第三维**。通过这种结构，HBase 可以支持高效的数据存储和查询，适用于大规模数据的存储和处理。

### 1.10.2 HBase物理存储结构

HBase 的物理存储结构主要由以下几个部分组成：

-   Region：Region 是 HBase 中的数据分片单元，每个 Region 包含一段连续的行键范围。当表中的数据量增加时，HBase 会自动将一个 Region 分裂成两个或多个 Region，以实现数据的水平扩展。
    -   一张表由多个Region所组成
-   HFile：HFile 是 HBase 中的数据存储文件，用于存储一个或多个列族的数据。每个 HFile 包含多个数据块（Data Block）和索引块（Index Block），用于支持高效的数据读取和查询。
-   MemStore：MemStore 是 HBase 中的内存数据缓存，用于缓存写入的数据。当 MemStore 中的数据量达到一定阈值时，HBase 会将其转换为一个 HFile，并将其写入磁盘。
-   WAL：**WAL**（Write-Ahead Log）是 HBase 中的写前日志，用于记录所有的写操作。WAL 可以保证数据的一致性和可靠性，即使在节点故障或宕机的情况下也能够恢复数据。

HBase 的物理存储结构采用了 LSM（Log-Structured Merge）树的设计思想，即将数据写入内存缓存（MemStore），当缓存满时将其转换为一个 HFile，并将其写入磁盘。同时，HBase 还采用了数据分片和数据副本的技术，以实现高可用性和高性能的数据存储和查询。

### 1.10.3 数据模型

​	在HBase中，数据存储在具有行和列的表中。这看起来像关系型数据库（RDBMS）一样，但是HBase表看作是多维的map结构更易于理解

​	HBase是一个**面向列**的数据库，数据模型主要有命名空间（Namespace）、表（Table）、行键（Roekey）、列簇（Column Family）、列（Column）、时间戳（Timestamp）、单元格（cell）

**1）NameSpace**

命名空间可以对表进行逻辑分组，类似于关系型数据库的database概念，每个命名空间下有多个表。HBase两个自带的命名空间，分别是hbase、default，hbase中存放的是HBase内置的表（默认情况下是过滤掉的），default表是用户默认使用的命名空间

**2）Table**

-   HBase中的数据都是以表的形式来组织架构的。
-   HBAse的表由多个行组成

类似于关系型数据的表概念。不同的是，该表由行键和列簇组成，按行键的字节序排序。HBase**定义表时只需要声明列簇即可，不需要声明具体的列**。因为数据存储是稀疏的，所有往HBase写入数据时，字段可以动态、按需指定。因此，和关系型数据库对比时，HBase能够轻松应对字段变更的场景。

**3）Row**

-   HBase中行由rowKey（行键）和一个或多个列组成
-   行存储时按行键字典序排序
-   行键的设计非常重要，尽量让相关的行存储在一起

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

-   ​	保存数据的最后n个版本
-   ​	保存最近一段时间内的版本（比如，最近7天的版本）

**7）cell**

**单元格由{rowkey, colum Family, column Qualifier, timestamp}唯一确定**。cell中的数据全部都是字节码形式存储的。

## 1.11 HBase基本架构

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

-   LoadBalancer负载均衡器

周期性监控region分布在regionServer上面是否均衡，由参数hbase.balancer.period控制周期时间，默认5分钟

-   CatalogJanitor 元数据管理器

定期检查和清理hbase:meta中的数据。

-   MasterProcWAL master 预写日志处理器

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