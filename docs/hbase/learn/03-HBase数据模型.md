# 1 HBase数据模型

## 1.1  **简介**

在HBASE中，数据存储在具有行和列的表中。这是看起来关系数据库(RDBMS)一样，但将HBASE表看成是多个维度的Map结构更容易理解。

### **HBase逻辑结构**

![img](images\wps4.png)



### HBase物理结构

![img](images\wps5.png)

## 1.2 数据模型

### Name Space 命名空间

-   命名空间，类似于关系型数据库的database概念，每个命名空间下有多个表。
-   HBase有两个自带的命名空间，分别是hbase和default，hbase中存放的是HBase内置的表，default表是用户默认使用的命名空间。

### Table 表

-   在HBase WebUI（http://kk01:16010中可以查看到目前HBase中的表）
-   Tabele类似于关系型数据库的表概念。不同的是，**HBase定义表时只需要声明列族即可，不需要声明具体的列**。
-   这意味着，往HBase写入数据时，字段可以动态、按需指定。因此，和关系型数据库相比，HBase能够轻松应对字段变更的场景。
-   HBase中数据都是以表形式来组织的，HBase中的表由多个行组成

### Row 行

-   HBase表中的每行数据都由一个**RowKey**（行键）和一个或多个**Column**（列）组成，数据是按照RowKey的字典顺序存储的，并且查询数据时只能根据RowKey进行检索，所以RowKey的设计十分重要
-   行在存储时按行键按字典顺序排序
-   行键的设计非常重要，尽量让相关的行存储在一起
-   例如：存储网站域。如行键是域，则应该将域名反转后存储(org.apache.www、org.apache.mail、org.apache.jira)。这样，所有Apache域都在表中存储在一起，而不是根据子域的第一个字母展开

### Column 列

-   HBase中的每个列都由 **Column Family**(列族) 和 **Column Qualifier**（列限定符）进行限定
-   例如info：name，info：age。**建表时，只需指明列族，而列限定符无需预先定义。**

### 列蔟（Column Family）

-   一个Table 可以有很多个列族
-   出于性能原因，列蔟将一组列及其值组织在一起
-   每个列蔟都有一组存储属性，例如：
    -   是否应该缓存在内存中
    -   数据如何被压缩或行键如何编码等
-   表中的每一行都有相同的列蔟，但在列蔟中不存储任何内容
-   所有的列蔟的数据全部都存储在一块（文件系统HDFS）
-   HBase官方建议所有的列蔟保持一样的列，并且将同一类的列放在一个列蔟中

### 列标识符（Column Qualifier）

-   列蔟中包含一个个的列限定符，这样可以为存储的数据提供索引
-   列蔟在创建表的时候是固定的，但列限定符是不作限制的
-   不同的行可能会存在不同的列标识符

### Time Stamp 

用于标识数据的不同版本（version），每条数据写入时，系统会自动为其加上该字段，其值为写入HBase的时间。

### Cell 单元格

-   单元格是行、列系列和列限定符的组合
-   包含一个值和一个时间戳（表示该值的版本）
-   单元格中的内容是以二进制存储的

由` {rowkey, column Family：column Qualifier, time Stamp}` 唯一确定的单元。cell中的数据全部是字节码形式存贮。

例如：

| ROW     | COLUMN+CELL                                                  |
| ------- | ------------------------------------------------------------ |
| 1250995 | column=C1:ADDRESS, **timestamp**=1588591604729, value=\xC9\xBD\xCE\xF7\xCA |
| 1250995 | column=C1:LATEST_DATE, **timestamp**=1588591604729, value=2019-03-28 |
| 1250995 | column=C1:NAME, **timestamp**=1588591604729, value=\xB7\xBD\xBA\xC6\xD0\xF9 |
| 1250995 | column=C1:NUM_CURRENT, **timestamp**=1588591604729, value=398.5 |
| 1250995 | column=C1:NUM_PREVIOUS, **timestamp**=1588591604729, value=379.5 |
| 1250995 | column=C1:NUM_USEAGE, **timestamp**=1588591604729, value=19  |
| 1250995 | column=C1:PAY_DATE, **timestamp**=1588591604729, value=2019-02-26 |
| 1250995 | column=C1:RECORD_DATE, **timestamp**=1588591604729, value=2019-02-11 |
| 1250995 | column=C1:SEX, **timestamp**=1588591604729, value=\xC5\xAE   |
| 1250995 | column=C1:TOTAL_MONEY, **timestamp**=1588591604729, value=114 |

## 1.3  概念模型

| **Row Key**       | **Time Stamp** | **ColumnFamily** **contents** | **ColumnFamily** **anchor**   | **ColumnFamily** **people** |
| ----------------- | -------------- | ----------------------------- | ----------------------------- | --------------------------- |
| "com.cnn.www"     | t9             |                               | anchor:cnnsi.com = "CNN"      |                             |
| "com.cnn.www"     | t8             |                               | anchor:my.look.ca = "CNN.com" |                             |
| "com.cnn.www"     | t6             | contents:html = "<html>…"     |                               |                             |
| "com.cnn.www"     | t5             | contents:html = "<html>…"     |                               |                             |
| "com.cnn.www"     | t3             | contents:html = "<html>…"     |                               |                             |
| "com.example.www" | t5             | contents:html = "<html>…"     |                               | people:author = "John Doe"  |

-   上述表格有两行、三个列蔟（contens、ancho、people）
-   “com.cnn.www”这一行anchor列蔟两个列（`anchor:cssnsi.com、anchor:my.look.ca`）、contents列蔟有个1个列（html）
-   “com.cnn.www”在HBase中有 t3、t5、t6、t8、t9 5个版本的数据
-   HBase中如果某一行的列被更新的，那么最新的数据会排在最前面，换句话说同一个rowkey的数据是按照倒序排序的