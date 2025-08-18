# Hbase Java API 

### 1  **需求与数据集**

某某自来水公司，需要存储大量的缴费明细数据。以下截取了缴费明细的一部分内容。

| 用户id  | 姓名   | 用户地址                     | 性别 | 缴费时间   | 表示数（本次） | 表示数（上次） | 用量（立方） | 合计金额 | 查表日期   | 最迟缴费日期 |
| ------- | ------ | ---------------------------- | ---- | ---------- | -------------- | -------------- | ------------ | -------- | ---------- | ------------ |
| 4944191 | 登卫红 | 贵州省铜仁市德江县7单元267室 | 男   | 2020-05-10 | 308.1          | 283.1          | 25           | 150      | 2020-04-25 | 2020-06-09   |

​	因为缴费明细的数据记录非常庞大，该公司的信息部门决定使用HBase来存储这些数据。并且，他们希望能够通过Java程序来访问这些数据。

### 2  准备工作

#### 2.1  创建IDEA Maven项目

| groupId   | artifactId |
| --------- | ---------- |
| com.clear | hbase_op   |

#### 2.2  导入pom依赖

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <hbase.version>2.3.4</hbase.version>
</properties>

<repositories>
    <repository>
        <id>aliyun</id>
        <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
        <releases>
            <enabled>true</enabled>
        </releases>
        <snapshots>
            <enabled>false</enabled>
            <updatePolicy>never</updatePolicy>
        </snapshots>
    </repository>
</repositories>

<dependencies>
    <dependency>
        <groupId>org.apache.hbase</groupId>
        <artifactId>hbase-client</artifactId>
        <version>${hbase.version}</version>
    </dependency>
    <dependency>
        <groupId>commons-io</groupId>
        <artifactId>commons-io</artifactId>
        <version>2.6</version>
    </dependency>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testng</groupId>
        <artifactId>testng</artifactId>
        <version>6.14.3</version>
        <scope>test</scope>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.1</version>
            <configuration>
                <target>1.8</target>
                <source>1.8</source>
            </configuration>
        </plugin>
    </plugins>
</build>
```

#### 2.3  复制HBase和Hadoop配置文件

将以下三个配置文件复制到resource目录中

-   hbase-site.xml

从Linux中下载到本地Window：sz /opt/software/hbase-2.3.4/conf/hbase-site.xml

-   core-site.xml

从Linux中下载到本地Window：sz /opt/software/hadoop-3.1.3/etc/hadoop/core-site.xml

-   log4j.properties

 注意：

​	需要确认配置文件中的服务器节点hostname/ip地址配置正确

#### 2.4   **创建包结构和类**

在**test**目录创建 `com.clear.hbase.admin.api_test` 包结构

创建`TableAmdinTest`类

#### 2.5  **创建Hbase连接以及admin管理对象**

要操作Hbase也需要建立Hbase的连接。此处我们仍然使用 **TestNG** 来编写测试。

-   **使用==@BeforeTest==初始化HBase连接，创建admin对象**
-   **==@AfterTest==关闭连接**

 步骤：

​	1）使用HbaseConfiguration.create()创建Hbase配置

​	2）使用ConnectionFactory.createConnection()创建Hbase连接

​	3）要创建表，需要基于Hbase连接获取admin管理对象

​	4）使用admin.close、connection.close关闭连接

参考代码：

```java
package com.clear.hbase.admin.api_test;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import java.io.IOException;

public class TableAdminTest {
    private Configuration configuration;
    private Connection connection;
    private Admin admin;

    // 初始化HBase连接
    @BeforeTest
    public void beforeTest() {
        try {
            configuration = HBaseConfiguration.create();
            connection = ConnectionFactory.createConnection(configuration);
            admin = connection.getAdmin();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 关闭HBase连接
    @AfterTest
    public void afterTest() {
        try {
            if (admin != null) {
                admin.close();
            }
            if (connection != null) {
                connection.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```



### 3  需求一：使用Java API创建表

创建一个名为WATER_BILL的表，包含一个列蔟C1。

实现步骤：

​	1）判断表是否存在

​		存在，则退出

​	2）使用TableDescriptorBuilder.newBuilder构建表描述构建器

​	3）使用ColumnFamilyDescriptorBuilder.newBuilder构建列蔟描述构建器

​	4）构建列蔟描述，构建表描述

​	5）创建表

参考代码：

```java
/**
     * 创建一个名为WATER_BILL的表，包含一个列簇C1
     */
@Test
public void createTableTest() throws IOException {
    final String TABLE_NAME = "WATER_BILL";  // 表名
    final String COLUMN_FAMILY = "C1";  // 列簇

    TableName tableName = TableName.valueOf(TABLE_NAME);
    // 1. 判断表是否存在
    if (admin.tableExists(tableName)) {
        // 存在，退出方法
        return;
    }
    // 2. 构建表描述构建器
    //  使用 TableDescriptorBuilder.newBuilder 构建表描述构建器
    //  TableDescriptor：表描述器，描述这个表有几个列簇，其他的信息都是可以在这里配置的
    TableDescriptorBuilder tableDescriptorBuilder =
        TableDescriptorBuilder.newBuilder(tableName);

    // 3. 构建列蔟描述构建器
    //  使用 ColumnFamilyDescriptorBuilder.newBuilder 构建列蔟描述构建器
    //  创建列簇也需要列簇描述器，需要用一个构建器来构建 ColumnFamilyDescriptor
    //      这里经常会使用包 Bytes 工具类（可以将字符串、long、double等类型转换为byte[]，反之亦然）
    //
    ColumnFamilyDescriptorBuilder columnFamilyDescriptorBuilder =
        ColumnFamilyDescriptorBuilder.newBuilder(Bytes.toBytes(COLUMN_FAMILY));

    // 4. 构建列蔟描述
    ColumnFamilyDescriptor columnFamilyDescriptor = columnFamilyDescriptorBuilder.build();

    // 添加列蔟（向表中添加列簇，即建立表和列簇的关联）
    tableDescriptorBuilder.setColumnFamily(columnFamilyDescriptor);
    // 5. 构建表描述
    TableDescriptor tableDescriptor = tableDescriptorBuilder.build();

    // 6. 创建表
    admin.createTable(tableDescriptor);
}
```



### 4  **需求二：使用Java API删除表**

实现步骤：

-   1）判断表是否存在

-   2）如果存在，则禁用表

-   3）再删除表

参考代码：

```java
/**
     * 删除表：注意在删除表之前需要先禁用表
     */
@Test
public void dropTable() throws IOException {
    // 表名
    TableName tableName = TableName.valueOf("WATER_BILL");

    // 1. 判断表是否存在
    if(admin.tableExists(tableName)) {
        // 2. 禁用表
        admin.disableTable(tableName);
        // 3. 删除表
        admin.deleteTable(tableName);
    }
}
```



### 5  **需求三：往表中插入一条数据**

#### 5.1  **创建包**

-   在 test 目录中创建 `com.clear.hbase.data.api_test` 包

-   创建`DataOpTest`类

#### 5.2  **初始化Hbase连接**

在@BeforeTest中初始化HBase连接，在@AfterTest中关闭Hbase连接。

参考代码：

```java
package com.clear.hbase.data.api_test;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.client.ConnectionFactory;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;

import java.io.IOException;

public class DataOpTest {
    private Configuration configuration;
    // Connection是一个重量集的对象，不能频繁去创建
    // Connection是线程安全的
    private Connection connection;

    @BeforeTest
    public void beforeTest() throws IOException {
        configuration = HBaseConfiguration.create();
        connection = ConnectionFactory.createConnection(configuration);
    }

    
    @AfterTest
    public void afterTest() throws IOException {
        connection.close();
    }
}
```



#### 5.3  **插入姓名列数据**

在表中插入一个行，该行只包含一个列。

| ROWKEY  | 姓名（列名：NAME） |
| ------- | ------------------ |
| 4944191 | 登卫红             |

实现步骤：

​	1）使用Hbase连接获取Htable

​	2）构建ROWKEY、列蔟名、列名

​	3）构建Put对象（对应put命令）

​	4）添加姓名列

​	5）使用Htable表对象执行put操作

​	6）关闭Htable表对象

参考代码：

```java
/**
 * 插入数据
 * @throws IOException
 */
@Test
public void addTest() throws IOException {
    // 1.使用Hbase连接获取Htable
    TableName waterBillTableName = TableName.valueOf("WATER_BILL");
    Table waterBillTable = connection.getTable(waterBillTableName);

    // 2.构建ROWKEY、列蔟名、列名
    String rowkey = "4944191";
    String columnFamily = "C1";
    String columnName = "NAME";

    // 3.构建Put对象（对应put命令）
    Put put = new Put(Bytes.toBytes(rowkey));

    // 4.添加姓名列
    put.addColumn(
        Bytes.toBytes(columnFamily),  // 列簇
        Bytes.toBytes(columnName), // 列
        Bytes.toBytes("登卫红"));  // value

    // 5.使用 Htable表对象执行put操作
    waterBillTable.put(put);

    // 6. 关闭表
    //  Htable是一个轻量级对象，可以经常创建
    //  HTable 非线程安全的API
    waterBillTable.close();
}
```

总结（插入数据时）：

​	1）首先要获取一个Table对象，这个对象是要和RegionServer节点连接，所以RegionServer节点负载比较高，需要比较大的内存

​	2）Hbase的Connection对象是一个重量级对象，在编写代码时，避免频繁创建

​	3）Table对象是轻量级对象，用完Table及时close，因为它非线程安全		

#### 5.4  **查看HBase中的数据**

get 'WATER_BILL','4944191',{FORMATTER => 'toString'}

```shell
hbase(main):001:0> get 'WATER_BILL','4944191',{FORMATTER => 'toString'}
COLUMN                                   CELL                                                                                                                
 C1:NAME                                 timestamp=2023-10-19T16:27:50.791, value=登卫红                                                                     
   1 row(s)
Took 0.6511 seconds             
```



#### 5.5  **插入其他列**

| **列名**     | **说明**       | **值**                       |
| ------------ | -------------- | ---------------------------- |
| ADDRESS      | 用户地址       | 贵州省铜仁市德江县7单元267室 |
| SEX          | 性别           | 男                           |
| PAY_DATE     | 缴费时间       | 2020-05-10                   |
| NUM_CURRENT  | 表示数（本次） | 308.1                        |
| NUM_PREVIOUS | 表示数（上次） | 283.1                        |
| NUM_USAGE    | 用量（立方）   | 25                           |
| TOTAL_MONEY  | 合计金额       | 150                          |
| RECORD_DATE  | 查表日期       | 2020-04-25                   |
| LATEST_DATE  | 最迟缴费日期   | 2020-06-09                   |

参考代码：

```java
@Test
public void addTest2() throws IOException {
    // 1.使用Hbase连接获取Htable
    TableName waterBillTableName = TableName.valueOf("WATER_BILL");
    Table waterBillTable = connection.getTable(waterBillTableName);

    // 2.构建ROWKEY、列蔟名、列名
    String rowkey = "4944191";
    String columnumnFamilyName = "C1";
    String columnName = "NAME";
    String columnADDRESS = "ADDRESS";
    String columnSEX = "SEX";
    String columnPAY_DATE = "PAY_DATE";
    String columnNUM_CURRENT = "NUM_CURRENT";
    String columnNUM_PREVIOUS = "NUM_PREVIOUS";
    String columnNUM_USAGE = "NUM_USAGE";
    String columnTOTAL_MONEY = "TOTAL_MONEY";
    String columnRECORD_DATE = "RECORD_DATE";
    String columnLATEST_DATE = "LATEST_DATE";

    // 3.构建Put对象（对应put命令）
    Put put = new Put(Bytes.toBytes(rowkey));

    // 4.添加姓名列
    put.addColumn(Bytes.toBytes(columnumnFamilyName)
                  , Bytes.toBytes(columnName)
                  , Bytes.toBytes("登卫红"));
    put.addColumn(Bytes.toBytes(columnumnFamilyName)
                  , Bytes.toBytes(columnADDRESS)
                  , Bytes.toBytes("贵州省铜仁市德江县7单元267室"));
    put.addColumn(Bytes.toBytes(columnumnFamilyName)
                  , Bytes.toBytes(columnSEX)
                  , Bytes.toBytes("男"));
    put.addColumn(Bytes.toBytes(columnumnFamilyName)
                  , Bytes.toBytes(columnPAY_DATE)
                  , Bytes.toBytes("2020-05-10"));
    put.addColumn(Bytes.toBytes(columnumnFamilyName)
                  , Bytes.toBytes(columnNUM_CURRENT)
                  , Bytes.toBytes("308.1"));
    put.addColumn(Bytes.toBytes(columnumnFamilyName)
                  , Bytes.toBytes(columnNUM_PREVIOUS)
                  , Bytes.toBytes("283.1"));
    put.addColumn(Bytes.toBytes(columnumnFamilyName)
                  , Bytes.toBytes(columnNUM_USAGE)
                  , Bytes.toBytes("25"));
    put.addColumn(Bytes.toBytes(columnumnFamilyName)
                  , Bytes.toBytes(columnTOTAL_MONEY)
                  , Bytes.toBytes("150"));
    put.addColumn(Bytes.toBytes(columnumnFamilyName)
                  , Bytes.toBytes(columnRECORD_DATE)
                  , Bytes.toBytes("2020-04-25"));
    put.addColumn(Bytes.toBytes(columnumnFamilyName)
                  , Bytes.toBytes(columnLATEST_DATE)
                  , Bytes.toBytes("2020-06-09"));

    // 5.使用Htable表对象执行put操作
    waterBillTable.put(put);

    // 6. 关闭表
    waterBillTable.close();
}
```



### 6  **需求三：查看一条数据**

查询rowkey为4944191的所有列的数据，并打印出来。

 实现步骤：

​	1）获取HTable

​	2）使用rowkey构建Get对象

​	3）执行get请求

​	4）获取所有单元格

​	5）打印rowkey

​	6）迭代单元格列表

​	7）关闭表

参考代码：

```java
/**
     * 查询一条数据
     */
@Test
public void getOneTest() throws IOException {
    // 1. 获取HTable
    TableName waterBillTableName = TableName.valueOf("WATER_BILL");
    Table waterBilltable = connection.getTable(waterBillTableName);

    // 2. 使用rowkey构建Get对象
    Get get = new Get(Bytes.toBytes("4944191"));

    // 3. 执行get请求
    Result result = waterBilltable.get(get);

    // 4. 获取所有单元格
    List<Cell> cellList = result.listCells();

    // 打印rowkey
    System.out.println("rowkey => " + Bytes.toString(result.getRow()));

    // 5. 迭代单元格列表
    for (Cell cell : cellList) {
        // 打印列蔟名（要打印需要将字节数组转换为String）
        System.out.print(Bytes.toString(
            cell.getQualifierArray(),
            cell.getQualifierOffset(),
            cell.getQualifierLength()));    // 打印列
        System.out.println(" => " + Bytes.toString(
            cell.getValueArray(),
            cell.getValueOffset(),
            cell.getValueLength()));    // 打印值
    }

    // 6. 关闭表
    waterBilltable.close();
}
```



### 7  **需求四：删除一条数据**

删除rowkey为4944191的整条数据。

 实现步骤：

​	1）获取HTable对象

​	2）根据rowkey构建delete对象

​	3）执行delete请求

​	4）关闭表 

参考代码：

```java
/**
     * 删除rowkey为4944191的整条数据
     * @throws IOException
     */
@Test
public void deleteOneTest() throws IOException {
    // 1. 获取HTable对象
    TableName waterBillTableName = TableName.valueOf("WATER_BILL");
    Table waterBillTable = connection.getTable(waterBillTableName);

    // 2. 根据rowkey构建delete对象
    Delete delete = new Delete(Bytes.toBytes("4944191"));

    // 3. 执行delete请求
    waterBillTable.delete(delete);

    // 4. 关闭表
    waterBillTable.close();
}
```



### 8  **需求五：导入数据**

#### 8.1  **需求**

在资料中，有一份10W的抄表数据文件，我们需要将这里面的数据导入到HBase中。

#### 8.2  **Import JOB**

在HBase中，有一个Import的MapReduce作业，可以专门用来将数据文件导入到HBase中。

**用法**

```
hbase org.apache.hadoop.hbase.mapreduce.Import 表名 HDFS数据文件路径
```



#### 8.3  **导入数据**

1）将资料中数据文件上传到Linux中

2）再将文件上传到hdfs中

```shell
[nhk@kk01 data]$ ll | grep part
-rw-r--r--. 1 nhk nhk  51483241 Oct 20  2020 part-m-00000_10w

[nhk@kk01 data]$ hadoop fs -mkdir -p /water_bill/output_ept_10W
[nhk@kk01 data]$ hadoop fs -put part-m-00000_10w /water_bill/output_ept_10W
```

3）启动YARN集群

```shell
start-yarn.sh
```

4）使用以下方式来进行数据导入

```shell
[nhk@kk01 data]$ hbase org.apache.hadoop.hbase.mapreduce.Import WATER_BILL /water_bill/output_ept_10W
```



#### 8.4  **导出数据**

**用法**

```shell
hbase org.apache.hadoop.hbase.mapreduce.Export 表名 HDFS数据文件路径（最后一层目录应该不存在，由HDFS自动创建）
```

将hbase中表的数据导出

```shell
hbase org.apache.hadoop.hbase.mapreduce.Export WATER_BILL /water_bill/output_ept_10W_export
```



### 9  需求六：查询2020年6月份所有用户的用水量

#### 9.1  **需求分析**

在Java API中，我们也是使用scan + filter来实现过滤查询。2020年6月份其实就是从2020年6月1日到2020年6月30日的所有抄表数据。

#### 9.2  **准备工作**

1）在`com.clear.hbase.data.api_test`包下创建`ScanFilterTest`类

2）使用@BeforeTest、@AfterTest构建HBase连接、以及关闭HBase连接

#### 9.3  **实现**

实现步骤：

​	1）获取表

​	2）构建scan请求对象

​	3）构建两个过滤器

​		a) 构建两个日期范围过滤器（注意此处请使用RECORD_DATE——抄表日期比较

​		b) 构建过滤器列表

​	4）执行scan扫描请求

​	5）迭代打印result

​	6）迭代单元格列表

​	7）关闭ResultScanner（这玩意把转换成一个个的类似get的操作，注意要关闭释放资源）

​	8）关闭表

参考代码：

```java
package com.clear.hbase.data.api_test;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.CompareOperator;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.filter.CompareFilter;
import org.apache.hadoop.hbase.filter.FilterList;
import org.apache.hadoop.hbase.filter.SingleColumnValueFilter;
import org.apache.hadoop.hbase.util.Bytes;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import java.io.IOException;
import java.util.List;

public class ScanFilterTest {
    private Configuration configuration;
    // Connection是一个重量集的对象，不能频繁去创建
    // Connection是线程安全的
    private Connection connection;

    @BeforeTest
    public void beforeTest() throws IOException {
        configuration = HBaseConfiguration.create();
        connection = ConnectionFactory.createConnection(configuration);
    }


    /**
     * 查询2020年6月份所有用户的用水量数据
     */
    @Test
    public void queryTest1() throws IOException {
        // 1. 获取表
        TableName waterBillTableName = TableName.valueOf("WATER_BILL");
        Table waterBillTable = connection.getTable(waterBillTableName);

        // 2. 构建scan请求对象
        Scan scan = new Scan();

        // 3. 构建两个过滤器
        //  3.1 构建日期范围过滤器（注意此处请使用RECORD_DATE——抄表日期比较
        SingleColumnValueFilter startDateFilter = new SingleColumnValueFilter(
                Bytes.toBytes("C1"),
                Bytes.toBytes("RECORD_DATE"),
                CompareOperator.GREATER_OR_EQUAL,
                Bytes.toBytes("2020-06-01"));
        SingleColumnValueFilter endDateFilter = new SingleColumnValueFilter(
                Bytes.toBytes("C1"),
                Bytes.toBytes("RECORD_DATE"),
                CompareOperator.LESS_OR_EQUAL,
                Bytes.toBytes("2020-06-01"));
        //  3.2 构建过滤器列表
        FilterList filterList = new FilterList(FilterList.Operator.MUST_PASS_ALL,
                startDateFilter,
                endDateFilter);

        // 将scan与filter关联起来
        scan.setFilter(filterList);

        // 4. 执行 scan 扫描请求
        ResultScanner resultScanner = waterBillTable.getScanner(scan);

        // 5. 迭代打印result
        for (Result result : resultScanner) {
            System.out.println("rowkey ->" + Bytes.toString(result.getRow()));
            System.out.println("------");

            List<Cell> cellList = result.listCells();

            // 6. 迭代单元格列表
            for (Cell cell : cellList) {
                // 打印列蔟名
                System.out.print(Bytes.toString(cell.getQualifierArray(), cell.getQualifierOffset(), cell.getQualifierLength()));
                System.out.println(" => " + Bytes.toString(cell.getValueArray(), cell.getValueOffset(), cell.getValueLength()));
            }
            System.out.println("------");
        }
        // 关闭ResultScanner（这玩意儿把转换为一个个类似get的操作，注意要关闭释放资源）
        resultScanner.close();

        // 7. 关闭表
        waterBillTable.close();
    }


    @AfterTest
    public void afterTest() throws IOException {
        connection.close();
    }

}
```



#### 9.4  **解决乱码问题**

因为前面我们的代码，在打印所有的列时，都是使用字符串打印的，Hbase中如果存储的是int、double，那么有可能就会乱码了。

```java
System.out.print(Bytes.toString(cell.getQualifierArray(), cell.getQualifierOffset(), cell.getQualifierLength()));
System.out.println(" => " + Bytes.toString(cell.getValueArray(), cell.getValueOffset(), cell.getValueLength()));
```

要解决的话，我们可以根据列来判断，使用哪种方式转换字节码。如下：

​	1）NUM_CURRENT

​	2）NUM_PREVIOUS

​	3）NUM_USAGE

​	4）TOTAL_MONEY

这4列使用double类型展示，其他的使用string类型展示。

参考代码：

```java
/**
     * 查询2020年6月份所有用户的用水量数据
     * todo 解决中文了乱码问题
     */
@Test
public void queryTest2() throws IOException {
    // 1. 获取表
    TableName waterBillTableName = TableName.valueOf("WATER_BILL");
    Table waterBillTable = connection.getTable(waterBillTableName);

    // 2. 构建scan请求对象
    Scan scan = new Scan();

    // 3. 构建两个过滤器
    //  3.1 构建日期范围过滤器（注意此处请使用RECORD_DATE——抄表日期比较
    SingleColumnValueFilter startDateFilter = new SingleColumnValueFilter(
        Bytes.toBytes("C1"),
        Bytes.toBytes("RECORD_DATE"),
        CompareOperator.GREATER_OR_EQUAL,
        Bytes.toBytes("2020-06-01"));
    SingleColumnValueFilter endDateFilter = new SingleColumnValueFilter(
        Bytes.toBytes("C1"),
        Bytes.toBytes("RECORD_DATE"),
        CompareOperator.LESS_OR_EQUAL,
        Bytes.toBytes("2020-06-01"));
    //  3.2 构建过滤器列表
    FilterList filterList = new FilterList(FilterList.Operator.MUST_PASS_ALL,
                                           startDateFilter,
                                           endDateFilter);

    // 将scan与filter关联起来
    scan.setFilter(filterList);

    // 4. 执行 scan 扫描请求
    ResultScanner resultScanner = waterBillTable.getScanner(scan);

    // 5. 迭代打印result
    for (Result result : resultScanner) {
        System.out.println("rowkey ->" + Bytes.toString(result.getRow()));
        System.out.println("------");

        List<Cell> cellList = result.listCells();

        // 6. 迭代单元格列表
        for (Cell cell : cellList) {
            // 打印列蔟名
            String colName = Bytes.toString(cell.getQualifierArray(), cell.getQualifierOffset(), cell.getQualifierLength());
            System.out.print(colName);

            // 解决中文乱码问题：如果是这几个列中的一个，则特殊处理
            if (colName.equals("NUM_CURRENT")
                || colName.equals("NUM_PREVIOUS")
                || colName.equals("NUM_USAGE")
                || colName.equals("TOTAL_MONEY")) {
                System.out.println(" => " + Bytes.toDouble(cell.getValueArray(), cell.getValueOffset()));
            } else {
                System.out.println(" => " + Bytes.toString(cell.getValueArray(), cell.getValueOffset(), cell.getValueLength()));
            }
        }
        System.out.println("------");
    }
    // 关闭ResultScanner（这玩意儿把转换为一个个类似get的操作，注意要关闭释放资源）
    resultScanner.close();

    // 7. 关闭表
    waterBillTable.close();
}
```

