# HDFS Java API

HDFS在生产应用中主要是Java客户端开发，其核心步骤是

- 从HDFS提供的API中**构造一个HDFS的访问客户端对象**，
- 然后**通过该客户端对象操作（增删改查）HDFS**上的文件。

## 客户端核心类

**Configuration**：配置对象类，用于加载或设置参数属性（该类的对象封转了客户端或者服务器的配置）

**FileSystem**：文件系统对象基类。针对不同文件系统有不同具体实现。该类封装了文件系统的相关操作方法，l 通过FileSystem的静态方法get获得该对象。

```java
FileSystem fs = FileSystem.get(conf);
```

get方法从conf中的一个参数 `fs.defaultFS`的配置值判断具体是什么类型的文件系统。如果我们的代码中没有指定fs.defaultFS，并且工程classpath下也没有给定相应的配置，conf中的默认值就来自于hadoop的jar包中的core-default.xml，默认值为： file:///，则获取的将不是一个DistributedFileSystem的实例，而是一个本地文件系统的客户端对象

**获取FileSystem类的方式**

方式一：

```java
@Test
public void getFileSystem1() throws IOException {
    Configuration configuration = new Configuration();
    //指定我们使用的文件系统类型
    configuration.set("fs.defaultFS", "hdfs://kk01:8020/");
    //获取指定的文件系统
    FileSystem fileSystem = FileSystem.get(configuration);
    System.out.println(fileSystem.toString());
}
```

方式二：

```java
@Test
public void getFileSystem2() throws  Exception{
    FileSystem fileSystem = FileSystem.get(new URI("hdfs://kk01:8020"), new       Configuration());
    System.out.println("fileSystem:"+fileSystem);
}
```

## 准备

### POM

**添加maven依赖和编译打包插件**

```xml
<!-- 通用核心包 -->
<dependency>
    <groupId>org.apache.hadoop</groupId>
    <artifactId>hadoop-common</artifactId>
    <version>3.2.2</version>
</dependency>
<dependency>
    <groupId>org.apache.hadoop</groupId>
    <artifactId>hadoop-client</artifactId>
    <version>3.2.2</version>
</dependency>
<!-- HDFS文档-->
<dependency>
    <groupId>org.apache.hadoop</groupId>
    <artifactId>hadoop-hdfs</artifactId>
    <version>3.2.2</version>
</dependency>
<!-- 单元测试 -->
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.10</version>
</dependency>

<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>2.4</version>
    <configuration>
        <archive>
            <manifest>
                <!-- mainClass标签填写主程序入口-->
                <mainClass>com.clear.hdfss.HDFSClientDemo2</mainClass>
                <addClasspath>true</addClasspath>
                <classpathPrefix>lib/</classpathPrefix>
            </manifest>
        </archive>
        <classesDirectory>
        </classesDirectory>
    </configuration>
</plugin>

<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.3</version>
    <configuration>
        <source>1.8</source>
        <target>1.8</target>
        <encoding>utf-8</encoding>
    </configuration>
</plugin>
```

### log4j.properties

在模块的src/main/resources目录下，新建文件 log4j.properties ，文件内容如下

```properties
log4j.rootLogger=INFO, stdout  
log4j.appender.stdout=org.apache.log4j.ConsoleAppender  
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout  
log4j.appender.stdout.layout.ConversionPattern=%d %p [%c] - %m%n  
log4j.appender.logfile=org.apache.log4j.FileAppender  
log4j.appender.logfile.File=target/spring.log  
log4j.appender.logfile.layout=org.apache.log4j.PatternLayout  
log4j.appender.logfile.layout.ConversionPattern=%d %p [%c] - %m%n
```

## 创建连接开闭

```java
public class HDFSClientDemo2 {
    public static FileSystem fs;
    public static Configuration conf;

    /**
     * 初始化 用于和HDFS集群建立连接
     */
    public static void connect2HDFS()  {
        conf = new Configuration();
        // 设置客户端连接到HDFS的默认入口
        conf.set("df.defaultFs","hdfs://192.168.188.128:8020");
        // 进行客户端身份设置，即客户端已什么身份去访问HDFS
        System.setProperty("HADOOP_USER_NAME","root");
        try {
            fs = FileSystem.get(conf);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 关闭客户端与HDFS连接
     */
    public static void close() {
        // 关闭之前判断fs是否存在，存在则关闭
        if (fs!=null){
            try {
                fs.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void main(String[] args) {

    }
}
```

说明：

- 客户端去操作HDFS时，是有一个用户身份的。默认情况下，HDFS客户端API会从采用Windows默认用户访问HDFS，会报权限异常错误。所以在访问HDFS时，一定要配置用户。

```
org.apache.hadoop.security.AccessControlException: Permission denied: user=56576,
```

## 创建文件夹

```java
/**
     * 创建文件夹
     */
public static void mkdir() throws IOException {
    // 创建文件夹之前判断是否存在，不存在则创建
    if (!fs.exists(new Path("/test"))) {
        try {
            // fs.create(new Path("/test")); 这是创建文件
            fs.mkdirs(new Path("/test"));
            System.out.println("文件夹创建成功~~~");
        } catch (IOException e) {
            System.out.println("文件夹创建失败~~~");
            e.printStackTrace();
        }
    }
}
```

## 上传文件

```java
/**
     * 从本地文件系统上传文件至HDFS
     * 本地文件系统：客户端所在集群的文件系统，因为我们要将项目打成jar包在Linux上运行，所以指的是Linux文件系统
     */
public static void putFile2HDFS(){
    configuration.set("dfs.replication", "2");
    FileSystem fs = FileSystem.get(new URI("hdfs://kk01:8020"), configuration, "nhk");
    // 本地文件路径
    Path src = new Path("/opt/temp/1.txt");
    // HDFS目录路径
    Path dst = new Path("/test");
    // 上传文件
    try {
        // local --> hdfs
        fs.copyFromLocalFile(src,dst);
        System.out.println("文件上传成功~~~");
    } catch (IOException e) {
        System.out.println("文件上传失败~~~");
        e.printStackTrace();
    }
}

```

**参数优先级**

参数优先级排序：（1）客户端代码中设置的值 >（2）ClassPath下的用户自定义配置文件 >（3）然后是服务器的自定义配置（xxx-site.xml） >（4）服务器的默认配置（xxx-default.xml）

## 下载文件

```java
 /**
     * 下载文件
     */
    public static void getFile2Local(){
        // 源路径：hdfs路径
        Path src = new Path("/test/1.txt");
        // 目标路径：local本地路径
        Path dst = new Path("/opt/temp/2.txt");
        // 下载文件
        try {
            // hdfs --> linux local
            fs.copyToLocalFile(src,dst);
            System.out.println("文件下载成功~~~~");
        } catch (IOException e) {
             System.out.println("文件下载失败~~~~");
            e.printStackTrace();
        }
    }
```

注意：如果执行上面代码，下载不了文件，有可能是你电脑的微软支持的运行库少，需要安装一下微软运行库

## 修改目录(文件)名称

```java
/**
     * 修改HDFS文件系统的 目录(文件)名称
     */
    public static void alter() throws IOException {
        Path src = new Path("/test/1.txt");
        Path det = new Path("/test/2.txt");
        // 如果src存在，则修改
        if (fs.exists(src)) {
            try {
                fs.rename(src, det);
            } catch (IOException e) {
                e.printStackTrace();
            }
            System.out.println("文件(目录)名修改成功~~~");
            return;
        }
        System.out.println("文件(目录)不存在~~~");
    }
```

## 查询当前路径下信息(文件+目录)

```java
/**
 * 查询当前路径的信息(文件+文件夹)
 */
public static void show() {
    Path cur = new Path("/test");
    try {
        FileStatus[] fileStatuses = fs.listStatus(cur); // recursive==true则递归查询当前目录下所以文件

        for (FileStatus fs : fileStatuses) {
            System.out.println("=================================");
            System.out.println("获取数据的路径：" + fs.getPath());
            System.out.println("获取block大小：" + fs.getBlockSize());
            System.out.println("获取数据的实际大小：" + fs.getLen());
            System.out.println("获取数据的上传时间：" + fs.getModificationTime());
            System.out.println("获取数据的副本数：" + fs.getReplication());
        }
    } catch (IOException e) {
        System.out.println("查询失败~~~~");
        e.printStackTrace();
    }
}

```

## 删除

```java
/**
 * 删除
 */
public static void delete() throws IOException {
    Path dst = new Path("/test/2.txt");
    // 如果目标文件存在则删除
    if(fs.exists(dst)){
        try {
            fs.delete(dst,true);  // true表示若目标文件是文件夹则递归删除，很危险的一个参数
            System.out.println("删除成功~~~");
        } catch (IOException e) {
            System.out.println("删除失败~~~~");
            e.printStackTrace();
        }
    }
}
```

```java
 public static void main(String[] args) throws IOException {
        // 连接
        connect2HDFS();
        // 测试创建文件夹
        mkdir();
        // 测试上传文件
        putFile2HDFS();
        // 测试下载文件
        getFile2Local();
        // 测试修改文件名
        alter();
        // 测试查询
        show();
        // 测试删除
        delete();
        // 关闭
        close();
        
    }
```

## **测试**

将项目达成jar包并上传至linux

```shell
# 编译
mvn compile
# 打包
mvn package
    
# 上传jar包至/opt/temp
rz
# 运行jar包
# hadoop jar 打包后的文件名(*.jar) 入口类名称(com/clear/hdfss/**)
hadoop jar hdfs-demo-1.0.jar

# 运行结果如下
[root@kk01 temp]# hadoop jar hdfs-demo-1.0.jar 
文件夹创建成功~~~
文件上传成功~~~
文件下载成功~~~~
文件(目录)名修改成功~~~
=================================
获取数据的路径：hdfs://kk01:8020/test/2.txt
获取block大小：134217728
获取数据的实际大小：12
获取数据的上传时间：1680413320113
获取数据的副本数：3
删除成功~~~

```

测试完记得删除/test目录，命令如下

```shell
hadoop fs -rm -r -f /test

# 查看是否删除
hadoop fs -ls /
```
