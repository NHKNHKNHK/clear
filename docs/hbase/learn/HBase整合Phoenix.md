# HBase整合Phoenix

## 1 Phoenix简介

### 1.1 phoenix定义

phoenix，由 saleforce.com 开源的一个项目，后又捐给了 Apache。它相当于一个Java中间件，帮助开发者，像使用jdbc访问关系型数据库一样，来访问NoSQL数据库HBase。

phoenix，操作的表及数据，存储在HBase上。phoenix只是需要和HBase进行关联起来，然后再用根据进行一些读写操作。

其实，可以把Phoenix只看成是一种代替HBase的语法的工具。虽然可用用Java与jdbc来连接phoenix，然后操作HBase，但是在生成环境中，不可以用在OLTP（在线事务处理中）。在线事务处理的环境中，需要延迟低，而phoenix在查询HBase时，虽然做了一些优化，但延迟还是不小。所有依然是用在OLAP（联机分析处理）中，再将结果返回存储下来。

**phoenix是一个HBase的开源SQL引擎。我们可以使用标准的JDBC API 代替HBase客户端API来创建，插入数据，查询你的HBase数据。Phoenix是构建在HBase之上的SQL引擎。**

### 1.2 phoenix特点

你也许会有疑问，“phoenix是否会降低HBase的效率”，或者说“phoenix的效率是否很低”。

但事实上，phoenix通过以下的方式实现了和你自己手写的方式相同或者可能是更好的性能（更不用说可以少写了很多代码）：

-   操作简单：DML命令以及通过DDL命令创建和操作表和版本化增量更改
-   编译SQL查询为原生HBase的scan语句
-   检测scan语句最佳的开始和结束的key
-   精心编排你的scan语句让他们并行执行
-   让计算去接近数据通过
-   推送你的where子句的谓词到服务端过滤器处理
-   执行聚合查询通过服务端钩子（称为协同处理器）
-   容易集成：如Spark，Hive，Pig，Flume和Map Reduce；

除此之外，phoenix还做了一些有趣的增强功能来更多地优化性能：

-   实现了**二级索引**来提升非主键字段的查询的性能
    -   原生的HBase只能使用RowKey作为索引，查询其他列需要全表扫描
-   统计相关数据来提高并行化水平，并帮助选择最佳优化方案
-   跳过扫描过滤器来优化IN，LIKE，OR查询
-   优化主键来均匀分布写压力

**phoenix不能干嘛**

-   不支持事务处理
-   不支持复制的条件



### 1.3 为什么要使用Phoenix

​	官方解释：在 Client 和 HBase 之间放一个Phoenix中间层不会减慢速度，因为用户编写的数据代码和 Phoenix编写的没有区别（更不用说你写的垃圾很多），不仅如此 Phoenix 对于用户输入的 SQL 同样会有大量的优化手段。（就像hive自带sql优化器一样）

### 1.4 Phoenix架构

![1698046016109](images\phoenix架构.png)                                          

## 2 Phoenix的安装

Phoenix在 5.0 版本默认有提供两种客户端的使用（瘦客户端和胖客户端），在 5.1.2 版本安装包中删除了瘦客户端，本文也不再使用瘦客户端。胖客户端和用户自己写的 HBase 的 API 代码读取数据之后进行数据处理是完全一样的。

0）官网地址

<http://phoenix.apache.org/>

https://phoenix.apache.org/download.html

我们的Hbase为 2.3.4 根据官网得知，我们可以部署 phoenix 5.1.3，如下：

![1698046613646](images\phoenix与Hbase兼容情况.png)

### 1）上传并解压tar包

https://www.apache.org/dyn/closer.lua/phoenix/phoenix-5.1.3/phoenix-hbase-2.3-5.1.3-bin.tar.gz

```shell
[nhk@kk01 software]$ pwd
/opt/software
[nhk@kk01 software]$ ls | grep phoenix
phoenix-hbase-2.3-5.1.3-bin.tar.gz

[nhk@kk01 software]$ tar -zxvf phoenix-hbase-2.3-5.1.3-bin.tar.gz -C /opt/software/

[nhk@kk01 software]$ mv phoenix-hbase-2.3-5.1.3-bin phoenix-hbase-2.3-5.1.3
```

### 2）复制server包并拷贝到各个节点的hbase/lib

将phoenix中所有的jar包添加到所有HBase  RegionServer 和 Master（即所有节点的lib目录中）

```shell
[nhk@kk01 software]$ cd phoenix-hbase-2.3-5.1.3/
[nhk@kk01 phoenix-hbase-2.3-5.1.3]$ ll
total 367688
drwxr-xr-x. 3 nhk nhk      4096 Jan 22  2020 bin
drwxr-xr-x. 2 nhk nhk        25 Jan 22  2020 docs
drwxr-xr-x. 2 nhk nhk       122 Jan 22  2020 examples
drwxrwxr-x. 2 nhk nhk       113 Oct 23 23:17 lib
-rw-r--r--. 1 nhk nhk    144911 Jan 22  2020 LICENSE
-rw-r--r--. 1 nhk nhk     10564 Jan 22  2020 NOTICE
-rw-r--r--. 1 nhk nhk 147898015 Jan 22  2020 phoenix-client-embedded-hbase-2.3-5.1.3.jar
lrwxrwxrwx. 1 nhk nhk        43 Jan 22  2020 phoenix-client-embedded-hbase-2.3.jar -> phoenix-client-embedded-hbase-2.3-5.1.3.jar
-rw-r--r--. 1 nhk nhk 151119563 Jan 22  2020 phoenix-client-hbase-2.3-5.1.3.jar
lrwxrwxrwx. 1 nhk nhk        34 Jan 22  2020 phoenix-client-hbase-2.3.jar -> phoenix-client-hbase-2.3-5.1.3.jar
-rw-r--r--. 1 nhk nhk  11135535 Jan 22  2020 phoenix-pherf-5.1.3.jar
lrwxrwxrwx. 1 nhk nhk        23 Jan 22  2020 phoenix-pherf.jar -> phoenix-pherf-5.1.3.jar
-rw-r--r--. 1 nhk nhk  66189863 Jan 22  2020 phoenix-server-hbase-2.3-5.1.3.jar
lrwxrwxrwx. 1 nhk nhk        34 Jan 22  2020 phoenix-server-hbase-2.3.jar -> phoenix-server-hbase-2.3-5.1.3.jar
[nhk@kk01 phoenix-hbase-2.3-5.1.3]$ cp phoenix-server-hbase-2.3-5.1.3.jar /opt/software/hbase-2.3.4/lib/

# 同步至集群其他HBase节点
[nhk@kk01 phoenix-hbase-2.3-5.1.3]$ xsync /opt/software/hbase-2.3.4/lib/phoenix-server-hbase-2.3-5.1.3.jar 
```



### 3）配置环境变量

```shell
[nhk@kk01 phoenix-hbase-2.3-5.1.3]$ sudo vim /etc/profile.d/my_env.sh 
# 添加如下

# phoenix
export PHOENIX_HOME=/opt/software/phoenix-hbase-2.3-5.1.3
export PHOENIX_CLASSPATH=$PHOENIX_HOME
export PATH=$PATH:$PHOENIX_HOME/bin
```

注意：

​	phoenix的环境变量不需要分发，因为phoenix就是一个皮肤

### 4）重启HBase

```shell
[nhk@kk01 ~]$ stop-hbase.sh 
[nhk@kk01 ~]$ start-hbase.sh 
```

### 5) 连接Phoenix

```shell
[nhk@kk01 ~]$ /opt/software/phoenix-hbase-2.3-5.1.3/bin/sqlline.py kk01,kk02,kk03:2181
Setting property: [incremental, false]
Setting property: [isolation, TRANSACTION_READ_COMMITTED]
issuing: !connect -p driver org.apache.phoenix.jdbc.PhoenixDriver -p user "none" -p password "none" "jdbc:phoenix:kk01,kk02,kk03:2181"
Connecting to jdbc:phoenix:kk01,kk02,kk03:2181
23/10/24 10:05:02 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
Connected to: Phoenix (version 5.1)
Driver: PhoenixEmbeddedDriver (version 5.1)
Autocommit status: true
Transaction isolation: TRANSACTION_READ_COMMITTED
sqlline version 1.9.0
0: jdbc:phoenix:kk01,kk02,kk03:2181> 
```

### 6）解决报错

如果出现了如下错误

```shell
警告：Failedtoload histonye
java.lang.IllegalArgumentException:Bad history file syntax! The history file syntax!  The history file `/home/nhk/.sqlline/history` may be an order history:please remove it or use a different history file.
```

 解决方法：在/home/nhk目录下删除.sqlline文件夹

## 3 Phoenix Shell操作

关于 phoenix 语法使用时，建议查询官网：https://phoenix.apache.org/language/index.html

#### 1. schema的操作

1）创建schema

默认情况下，在phoenix中不能直接创建schema。需要将如下的参数添加到Hbase中conf目录下的hbase-site.xml   和  phoenix中bin目录下的 hbase-site.xml中

```xml
<property>
    <name>phoenix.schema.isNamespaceMappingEnabled</name>
    <value>true</value>
</property>
```

重新启动Hbase和连接phoenix客户端

```shell
[nhk@kk01 ~]$ stop-hbase.sh 
[nhk@kk01 ~]$ start-hbase.sh 
[nhk@kk01 ~]$ /opt/software/phoenix-hbase-2.3-5.1.3/bin/sqlline.py kk01,kk02,kk03:2181
```

创建schema

```shell
create schema bigdata;
```

注意:

​	**在phoenix中，schema名，表名，字段名等会自动转换为大写，若要小写，使用双引号，如"student"。**

#### 2.表的操作

##### 1）显示所有表

```shell
!table 或 !tables
```

##### 2）创建表

说明：

​	phoenix中创建的表底层是存储在HBase中的，因此**必须指定rowkey**

```sql
-- 直接指定单个列作为RowKey 

CREATE TABLE IF NOT EXISTS student(
id VARCHAR primary key,
name VARCHAR,
addr VARCHAR);

-- 这里的 VARCHAR 类似于 String，与mysql中的varchar不一样，它没有长度限制
```

```sql
-- 指定多个列的联合作为RowKey

CREATE TABLE IF NOT EXISTS us_population (
State CHAR(2) NOT NULL,
City VARCHAR NOT NULL,
Population BIGINT
CONSTRAINT my_pk PRIMARY KEY (state, city));
```

注意：

​	在phoenix中创建表，会在HBase中创建一张对应的表。为了减少数据对磁盘空间的占用，**Phoenix默认会对HBase中的列名做编码处理。**

​	具体规则可参考官网：https://phoenix.apache.org/columnencoding.html，若不想对列名编码，可在建表语句末加上 **COLUMN_ENCODED_BYTES = 0;** 该值默认为2

##### 3）插入数据

```sql
upsert into student values('1001','zhangsan','beijing');
```

##### 4）查询记录

```sql
select * from student;
select * from student where id='1001';
```

##### 5）删除记录

```sql
delete from student where id='1001';
```

##### 6）删除表

```sql
drop table student;
```

##### 7）退出命令行

```sql
!quit
```

#### 3.表的映射

##### 1）表的关系

默认情况下，直接在HBase中创建的表，通过Phoenix是查看不到的。如果要在Phoenix中操作直接在HBase中创建的表，则需要在Phoenix中进行表的映射。映射方式有两种：**视图映射**和**表映射**。

##### 2）命令行中创建表test

HBase 中test的表结构如下，两个列族info1、info2

| Rowkey | info1 | info2   |
| ------ | ----- | ------- |
| id     | name  | address |

启动HBase Shell

```shell
[nhk@kk01 ~]$ hbase shell
```

创建HBase表test

```shell
hbase(main):001:0> create 'test','info1','info2'
```

##### 3）视图映射

Phoenix创建的视图是**只读**的，所以只能用来做查询，无法通过视图对源数据进行修改等操作。

例如：在phoenix中创建关联test表的视图

```shell
0: jdbc:phoenix:kk01,kk02,kk03:2181> create view "test"(
. . . . . . . . . . . . . . . . . )> id varchar primary key,
. . . . . . . . . . . . . . . . . )> "info1"."name" varchar,
. . . . . . . . . . . . . . . . . )> "info2"."address" varchar);
```

注意：	

​	视图映射的表必须在HBase中提取存在，否则报错`org.apache.phoenix.schema.TableNotFoundException`

删除视图

```shell
0: jdbc:phoenix:kk01,kk02,kk03:2181> drop view "test";
```

##### 4）表映射

使用Apache Phoenix创建对HBase的表映射，有两种方法：

（**1）HBase中不存在表时**，可以直接使用create table指令创建需要的表,系统将会自动在Phoenix和HBase中创建person_infomation的表，并会根据指令内的参数对表结构进行初始化。

**（2）当HBase中已经存在表时**，可以以类似创建视图的方式创建关联表，只需要将create view改为create table即可。

注意：

​	进行表映射时，不能使用列名编码，需要将 **COLUMN_ENCODED_BYTES = 0;**

```shell
0: jdbc:phoenix:kk01,kk02,kk03:2181>  create table "test"(
. . . . . . . . . . . . . . . . . )> id varchar primary key,
. . . . . . . . . . . . . . . . . )> "info1"."name" varchar,
. . . . . . . . . . . . . . . . . )> "info2"."address" varchar)
. . . . . . . . . . . . . semicolon> column_encoded_bytes=0;
```

```shell
# 删除表，HBase底层对应的表也会删除
0: jdbc:phoenix:kk01,kk02,kk03:2181> drop table "test";
```



#### 4 表映射中数值类型的问题

**Hbase中存储数值类型**的值(如int,long等)会按照正常数字的**补码**进行存储。

而phoenix对数字的存储做了特殊的处理. phoenix 为了解决遇到正负数同时存在时，导致负数排到了正数的后面（负数高位为1，正数高位为0，字典序0 < 1）的问题。 phoenix在存储数字时会对高位进行转换.原来为1,转换为0， 原来为0，转换为1。（**phoenix中的数字，底层存储为补码的基础上，将符号位反转**）

因此，如果hbase表中的数据的写是由phoenix写入的,不会出现问题，因为对数字的编解码都是phoenix来负责。如果hbase表中的数据不是由phoenix写入的，数字的编码由hbase负责。而phoenix读数据时要对数字进行解码。 因为编解码方式不一致。导致数字出错。

 演示：

1）  在hbase中创建表，并插入数值类型的数据

```shell
hbase(main):001:0> create 'person','info'
hbase(main):002:0> put 'person','1001', 'info:salary',Bytes.toBytes(123456)

# 在HBase中查询，发现是编码后的数值（正常）
hbase(main):008:0> scan 'person'
ROW                                      COLUMN+CELL                                                                                                         
 1001                                    column=info:salary, timestamp=2023-10-24T10:49:00.781, value=\x00\x00\x00\x00\x00\x01\xE2@                          
1 row(s)
Took 0.0563 seconds                                                                       
```

注意: 

​	如果要插入数字类型，需要通过Bytes.toBytes(123456)来实现。

2）在phoenix中创建映射表并查询数据

```shell
0: jdbc:phoenix:kk01,kk02,kk03:2181> create view "person"(id varchar primary key,"info"."salary" integer );


0: jdbc:phoenix:kk01,kk02,kk03:2181> select * from "person";
+------+-------------+
|  ID  |   salary    |
+------+-------------+
| 1001 | -2147483648 |
+------+-------------+


# 会发现数字显示有问题
```

 3）  解决办法（两种）  

方式一：

​	在phoenix中创建表时使用无符号的数值类型. unsigned_long、unsigned_int 等类型，其对数字的编解码方式与HBase中是相同的

​	在无需考虑负数的情况下是可以这么使用的。

```shell
# 先删除前面创建的视图
0: jdbc:phoenix:kk01,kk02,kk03:2181> drop view "person";


0: jdbc:phoenix:kk01,kk02,kk03:2181> create view "person"(id varchar primary 
key,"info"."salary" unsigned_long );

0: jdbc:phoenix:kk01,kk02,kk03:2181> select * from "person";
+------+--------+
|  ID  | salary |
+------+--------+
| 1001 | 123456 |
+------+--------+
```

 方式二：

​	如果需要考虑负数，则可以通过phoenix的 **自定义函数**，将数字类型的最高位（即符号位）反转即可。

​	自定义函数参考：https://phoenix.apache.org/udf.html

**建议：**

​	**这种数值类型类型的解析异常我们一般是不会遇到的，因为我们通常会将数值类型以 String类型存入HBase中，取出来的时候再进行解析即可**

## 3 Phoenix JDBC操作

这里演示的是标准的JDBC连接操作，实际开发中更多的是使用其他框架内嵌的Phoenix连接。

### 1.Thin Client

1）启动query server

```shell
queryserver.py start
```

[atguigu@hadoop102 ~]$ 

2）创建项目并导入依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.apache.phoenix</groupId>
        <artifactId>phoenix-queryserver-client</artifactId>
        <version>5.0.0-HBase-2.0</version>
    </dependency>
</dependencies>
```



3）编写代码

```java
import java.sql.*;
import org.apache.phoenix.queryserver.client.ThinClientUtil;

public class PhoenixTest {
public static void main(String[] args) throws SQLException {

        String connectionUrl = ThinClientUtil.getConnectionUrl("hadoop102", 8765);
        
        Connection connection = DriverManager.getConnection(connectionUrl);
        PreparedStatement preparedStatement = connection.prepareStatement("select * from student");

        ResultSet resultSet = preparedStatement.executeQuery();

        while (resultSet.next()) {
            System.out.println(resultSet.getString(1) + "\t" + resultSet.getString(2));
        }

        //关闭
        connection.close();

}
}

```

### 2.Thick Client

1）在pom中加入依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.apache.phoenix</groupId>
        <artifactId>phoenix-core</artifactId>
        <version>5.0.0-HBase-2.0</version>
        <exclusions>
            <exclusion>
                <groupId>org.glassfish</groupId>
                <artifactId>javax.el</artifactId>
            </exclusion>
        </exclusions>
    </dependency>

    <dependency>
        <groupId>org.glassfish</groupId>
        <artifactId>javax.el</artifactId>
        <version>3.0.1-b06</version>
    </dependency>
</dependencies>

```

2）编写代码

```java
package com.clear.phoenix;

import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import java.sql.SQLException;
import java.util.Properties;

/**
 * Phoenix 胖客户端 测试
 */
public class TestThick {
    public static void main(String[] args) throws SQLException {
        // 标准的JDBC连接
        // 1.url
        String url = "jdbc:phoenix:kk01,kk02,kk03:2181";
        // 2.实例化配置对象
        // 说明：在很多大数据的框架中，都不存在账号和密码，因为只在内部使用
        Properties props = new Properties();
        props.put("phoenix.schema.isNamespaceMappingEnabled", "true");
        // 3.获取连接
        Connection connection = DriverManager.getConnection(url, props);
        // 4.编译sql
        // 注意：phoenix的语法在这里结尾不能加 ; ，否则抛出PhoenixParserException，其他sql是无所谓的
        PreparedStatement ps = connection.prepareStatement("select * from \"test\"");
        // 5.执行sql
        ResultSet rs = ps.executeQuery();
        // 6.处理查询结果
        while (rs.next()) {
            System.out.println(rs.getString(1) + ":" + rs.getString(2));
        }
        // 7.关闭连接
        connection.close();
        // 说明：我们这里close了，但是我们在控制台可以看到进程并没有关闭
        // 是因为内嵌了HBase的连接，需要等待一段时间才会关闭（实际开发中不需要考虑这个问题，因为在开发中phoenix一般也不会关闭）
    }
}
```

 

## 4 Phoenix二级索引

### 4.1 二级索引配置文件

添加如下配置到HBase的HRegionserver节点的hbase-site.xml

```shell
[nhk@kk01 ~]$ vim /opt/software/hbase-2.3.4/conf/hbase-site.xml 
```

参考如下：

```xml
<property>
    <name>hbase.regionserver.wal.codec</name>
    <value>org.apache.hadoop.hbase.regionserver.wal.IndexedWALEditCodec</value>
</property>
<!-- 指定了Phoenix RPC调度器的工厂类。RPC调度器用于管理HBase和Phoenix之间的远程过程调用（RPC） -->
<property>
    <name>hbase.region.server.rpc.scheduler.factory.class</name>
    <value>org.apache.hadoop.hbase.ipc.PhoenixRpcSchedulerFactory</value>
    <description>Factory to create the Phoenix RPC Scheduler that uses separate queues for index and metadata updates</description>
</property>

<!-- 指定了Phoenix RPC控制器的工厂类。RPC控制器用于管理RPC请求的处理。org.apache.hadoop.hbase.ipc.controller.ServerRpcControllerFactory是Phoenix RPC控制器的工厂类，它使用单独的队列来处理索引和元数据更新。 -->
<property>
    <name>hbase.rpc.controllerfactory.class</name>
    <value>org.apache.hadoop.hbase.ipc.controller.ServerRpcControllerFactory</value>
    <description>Factory to create the Phoenix RPC Scheduler that uses separate queues for index and metadata updates</description>
</property>
```

修改完记得分发到所有的RegionServer所在的节点

```shell
[nhk@kk01 ~]$ xsync /opt/software/hbase-2.3.4/conf/hbase-site.xml 
```

说明：

​	在修改了HBase配置文件后，需要重启Hbase

### 4.2 全局索引（global index）

Global Index是**默认的索引格式**，创建全局索引时，**会在HBase中建立一张新表**。也就是说索引数据和数据表是存放在不同的表中的，因此**全局索引适用于多读少写的业务场景**。

写数据的时候会消耗大量开销，因为索引表也要更新，而索引表是分布在不同的数据节点上的，跨节点的数据传输带来了较大的性能消耗。

在读数据的时候Phoenix会选择索引表来降低查询消耗的时间。

**1.创建单个字段的全局索引**

```sql
CREATE INDEX my_index ON my_table (my_col);
```

演示：

```shell
# 数据准备
0: jdbc:phoenix:kk01,kk02,kk03:2181> CREATE TABLE IF NOT EXISTS student2(
. . . . . . . . . . . . . . . . . )> id VARCHAR primary key,
. . . . . . . . . . . . . . . . . )> name VARCHAR,
. . . . . . . . . . . . . . . . . )> addr VARCHAR);

0: jdbc:phoenix:kk01,kk02,kk03:2181> upsert into student values('1001','zhangsan','beijing');

0: jdbc:phoenix:kk01,kk02,kk03:2181> upsert into student values('1002','lisi','shanghai');
```

查询数据（使用explainPlan执行计划，查看是否有走索引）

![1698126501378](images\二级索引_无索引.png)

```shell
# 创建索引
CREATE INDEX my_index ON student2 (name);
```

再次查询数据



```shell
# 删除索引
0: jdbc:phoenix:kk01,kk02,kk03:2181> DROP INDEX my_index ON student2;
```

**如果想查询的字段不是索引字段的话，索引表不会被使用**，也就是说不会带来查询速度的提升

解决这类问题有以下两个方式：

-   包含索引
-   本地索引

### 包含索引（covered index）

创建携带其他字段的全局索引（本质还是全局索引）

如下包含索引来解决：

```shell
CREATE INDEX my_index ON my_table(my_col) INCLUDE(col2);
```

查看执行计划



创建索引



再次查看执行计划



删除索引



### 本地索引（Local index）

**Local Index适用于写操作频繁的场景**。

**索引数据和数据表的数据是存放在同一张表中（**且是同一个Region），避免了在写操作的时候往不同服务器的索引表中写索引带来的额外开销。

```sql
CREATE LOCAL INDEX my_index ON my_table (my_column);

 -- my_column可以是多个
```

**本地索引会将所有的信息存储在一个影子列簇中**，虽然扫描的时候也是**范围扫描**，但是没有全表索引快，优点在于不用写多个表了

演示：

创建本地索引



查看执行计划



删除索引