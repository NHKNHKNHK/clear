# HDFS入门及shell命令

## 文件系统

- 是一种存储和组织数据的方法，它使得文件访问和查询变得容易
- 使得文件和树形目录的抽象逻辑概念代替了磁盘等物理设备使用数据块的概念，用户使用文件系统来保存数据不必关心数据底层存在硬盘哪里，只需记住这个文件的所属目录和文件名
- 文件系统通常使用磁盘和光盘这样的存储设备，并维护文件在设备中的物理位置。
- 文件系统是一套实现了数据的存储、分级组织、访问和获取等操作的抽象数据类型（Abstract data type）

### **文件名**

​	DOS操作系统中文件名由文件主名和扩展名组成，之间以一个小圆点隔开

​	文件名可用于用于定位存储位置、区分不同文件，计算机实行按名存取的操作方式

​	某些符号因其有特殊含义，一般不允许出现在文件名中

### **元数据**

​	元素据（metadata）又称为解释性数据，记录数据的数据

​	文件系统元数据一般指文件大小、最后修改时间、底层存储位置、属性、所属用户、权限等信息

### **文件系统分类**

- 基于磁盘的文件系统

是在非易失介质上（磁盘、光盘）存储文档的经典方式。用以在多次会话之间保持文件的内容。包括ext2/3/4、xfs、ntfs、iso9660等众所周知的文件系统。Linux系统可以使用df -Th查看

- 虚拟文件系统

在内核中生成的文件系统，比如proc

proc文件系统是一个虚拟文件系统，通过它可以使用一种新的方法在Linux内核空间和用户间之间进行通信

- 网络文件系统

网络文件系统（NFS，network file system）是一种将远程主机上的分区（目录）经网络挂载到本地系统的一种机制

允许本地计算机访问另一台计算机上的数据，对此类文件系统中文件的操作都通过网络连接进行

## 分布式文件系统HDFS

### HDFS简介

- HDFS（Hadoop Distributed File System）**Hadoop分布式文件系统**。是Apache Hadoop核心组件之一，作为大数据生态圈最底层的分布式存储服务而存在。
- 分布式文件系统**解决大数据如何存储的问题**。分布式意味着是**横跨在多台计算机**上的存储系统。
- HDFS是一种能够在普通硬件上运行的分布式文件系统，它是**高度容错**，适用于具有大数据集的应用程序，它非常适于存储大型数据（比如 TB PB）
- HDFS使用多台计算机存储文件，并且提供**统一的访问接口**，像是访问一个普通的文件系统一样使用分布式文件系统

### HDFS设计目标

- **硬件故障（Hardware Failure）**是常态，HDFS可能有成百上千的服务器组成，每一个组件都有可能出现故障。因此故障检测和自动快速恢复是HDFS的核心架构目标。
- HDFS上的应用主要是以**流式读取数据（Streaming Data Access）**。HDFS被设计成**用于批处理**，而不是用户交互式的。相较于数据访问的反应时间，更注重数据访问的高吞吐量。
- 典型的HDFS文件大小是GB到TB级别的。所有，HDFS被调整成支持**大文件（Large Data Sets**）。他应该提供很高的聚合数据带宽，一个集群中支持数百个节点，一个集群中还应该支持千万级别的文件。
- 大部分HDFS应用对文件要求是**write-one-read-many**访问模型（一次写入多次读取）。一个文件一旦创建、写入、关闭之后就不需要修改了。这一假设简化了数据一致性问题，使高吞吐量的数据访问成为可能。
- **移动计算的代价比之移动数据的代价低**。一个应用请求的计算，离它操作的数据越近就越高效。将计算移动到数据附件，比之移动数据到应用所在显然更好。
- HDFS被设计为可从一个平台轻松移植到另一个平台。这有利于将HDFS广泛用作大量应用程序的首选平台。

### HDFS应用场景

**适用场景**

- 大文件
- 数据流式访问
- 一次写入多次读取
- 低成本部署，廉价pc
- 高容错

**不适用场景**

- 小文件
- 数据交互式访问
- 频繁任意修改
- 低延迟处理

### HDFS重要特性

#### **1、主从架构**

HDFS采用master/slave架构。一般一个HDFS集群是有一个NameNode和一定数目的DataNode组成。

**NameNode是HDFS主节点，DataNode是HDFS从节点**，两种角色各司其职，共同协调完成分布式的文件存储服务

#### **2、分块存储机制**

HDFS中的文件在**物理上分块存储（block）**的，块的大小通过配置参数来规则，参数位于hdfs-default.xml中`dfs.blocksize`。**默认大小是128M**（134217728）

#### **3、副本机制**

文件的所有block都会有副本。每个文件的block大小（dfs.blocksize）和副本系数（dfs.replication）都是可配置的。副本系数可以在文件创建时指定，也可以在之后通过命令改变。

**默认 dfs.replication   的值是3**，也就是额外再复制两份，连同本身共3副本。

#### **4、namespace**

HDFS支持传统的**层次型文件组织结构**。用户可以创建目录，然后将文件保存在这些目录里。文件系统名字空间的层次结构和大多数现有的文件系统类似：用户可以创建、删除、、移动或重命名文件。

NameNode负责维护文件系统的namespace名称空间，任何对文件系统名称空间或属性的修改都将被NameNode记录下来

HDFS会给客户端提供一个统一的**抽象目录树**，客户端提供路径来访问文件。

形如：hdfs://namenode:port/dir-a/dir-b/dir-c/file.data

#### **5、元数据管理**

在HDFS中，NameNode管理的元数据具有两种类型：

- 文件自身属性信息

文件名称、权限、修改时间、文件大小、复制因子、数据块大小

- 文件块位置映射信息

记录块和DataNode之间的映射信息，即哪个块位于哪个节点上

#### **6、数据块存储**

文件的各个block的具体**存储管理由DataNode节点承担**。每一个block都可以在多个DataNode上存储。

#### **7、HDFS的块大小**

HDFS中的文件在物理上是分块存储（Block），块的大小可以通过配置参数（dfs.blocksize）来设置，默认大小在Hadoop2.x/3.x版本是128M，3.x版本是64M

例如：

​	如果寻址时间为10ms，传输时间=10ms/0.01=1s（寻址时间为传输时间的1%为最佳），若目前磁盘传输速率为100MB/s，则block块大小 = 1s * 100MB/s = 100MB，所有块大小设置为128M比较合适

- HDFS的块设置**太小，会增大寻址时间**（寻址时间大于传输时间），程序一直在找块的开始位置
- HDFS的块设置**太大，从磁盘传输数据的时间会明显大于定位这个块开始位置所需的时间**（传输时间远大于寻址时间），会导致处理数据非常慢
- **寻址时间与传输时间的比例为1%时，为最佳状态**
- HDFS的块大小设置主要取决于磁盘传输速率

## HDFS shell CLI

Hadoop提供了文件系统的shell命令行客户端，使用方法如下：

```shell
hdfs [options] subcommand [subcommand options] 
	
subcommand: admin commands / client command / daemon commands
```

跟文件系统读写相关的命令是    **hdfs dfs [generic options]**

- HDFS Shell CLI支持操作多种文件系统，包括本地文件系统（file:////）、分布式文件系统（hdfs://nn:8020）等
- 操作的是什么文件系统取决于**URL中的前缀协议**
- 如果没有指定前缀，则将会读取环境变量中的**fs.defaultFS属性**，以该属性值作为默认文件系统

```shell
hdfs dfs -ls file:///      # 操作本地文件系统（客户端所在的机器）
hdfs dfs -ls hdfs://node1:8020/    # 操作HDFS分布式文件系统
hdfs dfs -ls /     # 直接跟目录，没有指定协议，将加载读取fs.defaultFS属性默认值
```

### HDFS Shell CLI客户端

**hadoop dfs、hdfs dfs、hadoop fs 三者区别**

- hadoop dfs 只能操作HDFS文件系统（包括与Local FS间的操作），不过已经Deprecated
- hdfs dfs  	 只能操作HDFS文件系统（包括与Local FS间的操作），**常用**
- hadoop fs   可操作任意操作系统（不仅仅是hdfs文件系统，适用范围更广）

目前版本官方推荐使用**hadoop fs**

### HDFS Shell 常用命令

#### -mkdir创建目录

```shell
hadoop fs -mkdir [-p] <path>
# path 为待创建目录
# -p 表示沿着路径创建父目录
```

#### -ls	查看指定目录下内容

```shell
hadoop fs -ls [-h] [-R] [<path> ... ]
# path 指定目录路径
# -h 人性化显示文件size
# -R 递归查看指定目录及其子目录 
```

#### -put上传文件至指定目录下

```shell
hadoop fs -put [-f] [-p] <localsrc>... <dst>
# -f 覆盖目录文件（如果目标文件存在，则覆盖）
# -p 保留访问和修改时间，所有权和权限
# localsrc 本地文件系统（客户端所在机器）
# dst 目标文件系统（HDFS）
```

#### -copyFromLocal从本地文件系统拷贝文件至HDFS

（等同于put，习惯上使用put）

```shell
hadoop fs -copyFromLocal <localsrc>... <dst>
```

#### -moveFromLocal剪切本地文件系统文件至HDFS

（即从本地剪切文件至HDFS）

```shell
hadoop fs -moveFromLocal <localsrc>... <dst>
# 和-put功能相似，只不过上传结束会删除源数据
```

#### -appendToFile追加文件至一个已存在的文件中

```shell
hadoop fs -appendToFile <localsrc> ... <dst> 
```

#### -cat\\-head\\-tail查看HDFS文件内容

```shell
hadoop fs -cat <src> ...
# 对于大文件内容读取，慎重
```

```shell
hadoop fs -head <file>
# 查看文件前1kB的内容
```

```shell
hadoop fs -tail [-f] <file>
# 查看文件最后1kB的内容
# -f 选择可以动态显示文件中追加的内容
```

#### -get\\coptToLocal\\-getmerge下载HDFS文件

(从HDFS拷贝文件至本地)

```shell
hadoop fs -get [-f] [-p] <src>... <localdst>
# 下载文件至本地文件系统指定目录，localdst必须是目录
# -f 覆盖目标文件（如果本地文件系统存在该文件，则覆盖） 
# -p 保留访问和修改时间，所有权和权限

hadoop fs -copyToLocal [-f] [-p] [-ignoreCrc] [-crc] <src> ... <localdst> 
# 等同于get，习惯上使用get
```

```shell
hadoop fs -getmerge [-n1] [-skip-empty-file] <src> <localdst>
# 下载多个文件合并到本地文件系统的一个文件中
# -n1 表示在每个文件的末尾添加换行符
```

#### -cp拷贝HDFS文件

```shell
hadoop fs -cp [-f] <src> ... <dst>
# -f 覆盖目标文件（若目标文件存在，则覆盖）
```

#### -appendToFile追加数据到HDFS文件中

```shell
hadoop fs -appendToFile <localsrc>... <dst>
# 将所给给定的本地文件的内容追加到给定的dst文件
# 若dst文件不存在，将创建文件
# 如果<localsrc>为-，则输入为从标准输入中读取
```

#### -df查看HDFS磁盘空间

```shell
hadoop fs -df [-h] [<path>...]
# 显示文件系统的容量，可以空间和已用空间
```

#### -du查看HDFS文件使用的空间量

```shell
hadoop fs -du [-s] [-h] <path>...
# -s 表示显示指定路径文件长度的汇总摘要，而部署单个文件的摘要
# -h 表示人性化显示
```

#### -mvHDFS数据移动

```shell
hadoop fs -mv <src> ... <dst>
# 移动文件至指定文件夹
# 可以使用该命令移动数据、重命名文件
```

#### -rm -r删除文件/文件夹

```shell
hadoop fs -rm -r 路径
# -r 表示递归
```

#### -setrep修改HDFS文件副本个数

```shell
hadoop fs -setrep [-R] [-w] <rep> <path>...
# 修改指定文件的副本个数
# -R 表示递归，修改文件夹及其下所有
# -w 客户端是否等待副本修改完毕
```

说明：

​	这里设置的副本数只是记录在NameNode的元数据中，是否真的会有这么多副本，还得看DataNode的数量。因为目前只有3台设备，最多也就3个副本，只有节点数的增加到10台时，副本数才能达到10。

#### -chgrp\\-chmod\\-chown修改文件权限

 -chgrp、-chmod、-chown：Linux文件系统中的用法一样

```shell
hadoop fs  -chmod 666 文件所在路径
hadoop fs  -chown  nhk:nhk 文件所在路径
```
