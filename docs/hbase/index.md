# HBase

## 什么是HBase、HBase定义

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



## HBase 与 NoSQL

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

    

## HBase特点

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

## **HDFS对比HBase**

**HDFS**

-   HDFS是一个非常适合存储大型文件的分布式文件系统
-   HDFS它不是一个通用的文件系统，也无法在文件中快速查询某个数据

**HBase**

-   HBase构建在HDFS之上，并为大型表提供快速记录查找(和更新)
-   HBase内部将大量数据放在HDFS中名为「StoreFiles」的索引中，以便进行高速查找
-   Hbase比较适合做快速查询等需求，而不适合做大规模的OLAP应用