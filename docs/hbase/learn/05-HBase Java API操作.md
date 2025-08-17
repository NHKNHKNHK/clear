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

