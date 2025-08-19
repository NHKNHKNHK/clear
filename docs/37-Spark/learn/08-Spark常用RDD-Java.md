# Spark常用RDD（Java版）

## 1 Spark 程序编写流程

-   **创建 SparkConf 对象**（Spark程序必须做的第一件事是创建一个（JavaSparkContext）/SparkContext对象，它告诉Spark如何访问集群。要创建SparkContext，首先需要构建一个包含应用程序信息的SparkConf对象。）
    -   **设置`SparkConf`参数**，如appName、master等 （**appName参数是应用程序在集群UI上显示的名称**。master是一个Spark、Mesos或YARN集群的URL，或者一个在本地模式下运行的特殊的`local`字符串。在实践中，当在集群上运行时，您不希望在程序中硬编码master，而是希望使用spark-submit启动应用程序并在那里接收它。然而，对于本地测试和单元测试，您可以通过`local`来运行进程中的Spark。）
-   **基于`SparkConf` 对象 创建 `SparkContext` 对象**
-   **基于 `SparkContext` 即上下文环境对象创建RDD**
-   使用**转换算子Transformation对RDD进行转换**，得到新的RDD
-   使用缓存算子将需要重用的RDD进行缓存（可选）
-   **使用 行动算子Action类触发一次并行运算（Spark会对计算进行优化后再执行）**
-   **关闭 `SparkContext`**

## 2 RDD简介

RDD（Resilient Distributed Dataset）即**弹性分布式数据集**，是一个容错的、并行的数据结构，是Spark中最基本的**数据处理模型**。代码中是一个抽象类，它代表一个弹性的、不可变、可分区、里面的元素可并行计算的集合。

-   弹性
    -   存储的弹性：内存与磁盘的自动切换；
    -   容错的弹性：数据丢失可以自动恢复；
    -   计算的弹性：计算出错重试机制；
    -   分片的弹性：可根据需要重新分片。
-   分布式：数据存储在大数据集群不同节点上
-   数据集：RDD**封装了计算逻辑，并不保存数据**
-   数据抽象：RDD是一个抽象类，需要子类具体实现
-   不可变：**RDD封装了计算逻辑，是不可以改变的，想要改变，只能产生新的RDD**，在新的RDD里面封装计算逻辑
-   可分区、并行计算

说明：

​	RDD的数据处理方式类似于IO流，也有装饰者设计模式

​	RDD的数据只有在调用行动算子（例如，`collect()`）时，才会真正执行业务逻辑操作。

​	RDD是不保存数据的，但是IO可以临时保存一部分数据

## 3 对于RDD的简单理解

-   RDD是Spark框架中的核心数据结构
-   Spark处理数据时，将数据封装到RDD中（但是RDD不保存数据）
-   RDD中有很多的Partition（分区），每个Partition被一个Task处理
    -   对于Spark、Flink这类计算框架，每个Task任务以线程Thread的方式运行
    -   但是Hadoop的MR在每个Task（MapTask或ReduceTask）以进程Process方式运行



## 3 RDD的创建方式

在Spark中创建RDD的创建方式可以分为四种：

### 1）从集合（内存）中创建RDD

Spark可以通过并行集合创建RDD。即从一个已存在的集合、数组上，**通过 SparkContext 对象调用 `parallelize()` 方法创建RDD**

```java
parallelize(final List<T> list)
parallelize(final List<T> list, final int numSlices) 
// numSlices表示设置的分区数量
//如果不设置，默认使用scheduler.conf().getInt("spark.default.parallelism", this.totalCores())
//		spark默认从配置对象获取spark.default.parallelism 
// 		如果获取不到，则使用 totalCores 属性，该属性为当前环境最大的可以核数
```

演示：

```java
SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("rdd");
// 构建上下文环境变量
JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
// 创建RDD (从内存中创建，将内存中集合数据作为处理的数据源)
List<Integer> lists = Arrays.asList(1, 2, 3, 4, 5, 6);
JavaRDD<Integer> RDD = sparkContext.parallelize(lists);

RDD.foreach((integer) -> System.out.println(integer));
// 关闭环境
sparkContext.stop();
```

```scala
scala> val lines = sc.parallelize(List("hello", "world"))
val lines: org.apache.spark.rdd.RDD[String] = ParallelCollectionRDD[0] at parallelize at <console>:1
```

### 2）从外部存储（文件）创建RDD

Spark可以从Hadoop支持的任何存储源中加载数据去创建RDD，包括本地文件系统和HDFS（所有Hadoop支持的数据集，比如HDFS、HBase等）等文件系统

通过Spark中的**SparkContext对象调用textFile()方法加载数据创建RDD**。

注意：

-   JavaSparkContext对象能够直接读取的文件类型有 txt 、sequence、object
    -   文本文件（Text File）：可以使用`JavaSparkContext.textFile()`方法读取文本文件，每一行作为一个RDD的元素。
    -   序列化文件（Sequence File）：可以使用`JavaSparkContext.sequenceFile()`方法读取序列化文件，序列化文件是Hadoop中的一种文件格式，可以将多个小文件合并成一个大文件，提高文件读取效率。
    -   对象文件（Object File）：可以使用`JavaSparkContext.objectFile()`方法读取对象文件，对象文件是将Java对象序列化后存储的文件。
-   其他文件类型，如csv、json、parquet、avro等都需要使用**SparkSession**对象来读取，或者是利用第三方库读取

```java
textFile(final String path)  // 以行为单位来读取数据，读取的数据都是字符串
textFile(final String path, final int minPartitions)  // minPartitions设置最小分区数量
    												// 注意：分区数量可能大于 minPartitions
// spark读取文件时，底层其实使用的就是Hadoop的读取方式，所以是一行一行读取
// 数据读取是以偏移量为单位，偏移量不会被重复读取
    // totalSize
    // goalSize = totalSize/minPartitions

// 如果数据源为多个文件，那么计算分区时以文件为单位进行分区
    
wholeTextFiles(final String path)  // 以文件为单位读取数据，读取的结果是一个元组
				 				 // 第一个元素表示文件路径，第二个元素表示文件内容
wholeTextFiles(final String path, final int minPartitions)
```

**1.从Linux本地文件系统加载数据创建RDD**

```java
// 假设在linux本地有文件 test.txt

SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("rdd");
// 构建上下文环境变量
JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
// 创建RDD (从Linux本地文件中创建，将文件中数据作为处理的数据源)
// path路径默认以当前环境的根路径为基准。可以写绝对路径，也可以写相对路径
// path路径可以是文件的具体路径，也可以是目录名称（当有多个文件时）
// path路径还可以写通配符 * （例如：file:///opt/temp/test*.txt）
JavaRDD<String> RDD = sparkContext.textFile("file:///opt/temp/test.txt");  
// file:// 表示从本地(linux)文件系统读取
// 从文件 test.txt 读取出来的每一行文本内容，都是RDD中的一个元素

// RDD.collect().forEach(s-> System.out.println(s));
RDD.collect().forEach(System.out::println);  // 方法引用

// 关闭环境
sparkContext.stop();
```

```scala
scala> val lines = sc.textFile("README.md");	// 相对路径：相对于$SPARK_HOME
val lines: org.apache.spark.rdd.RDD[String] = README.md MapPartitionsRDD[2] at textFile at <console>:1
```

**2.从HDFS中加载数据创建RDD**

代码与从从Linux本地文件系统加载数据创建RDD相识，只需做出如下修改

```java
JavaRDD<String> RDD = sparkContext.textFile("/opt/temp/test.txt"); 
JavaRDD<String> RDD = sparkContext.textFile("hdfs://localhost:8020/opt/temp/test.txt"); 
// 上面两种写法都是可以的
```

### 3）从其他RDD创建RDD

主要是通过一个RDD运算完后，再产生新的RDD。

### 4）直接创建RDD（new）

使用new的方式直接构造RDD，一般由Spark框架自身使用。


默认情况下，Spark可以将一个作业切分多个任务后，发送给Executor节点并行计算，而**能够并行计算的任务数量**我们称之为**并行度**。这个数量可以在构建RDD时指定。记住，**这里的并行执行的任务数量，并不是指的切分任务的数量**，不要混淆了。

-   读取内存数据时，数据可以按照并行度的设定进行数据的分区操作
-   读取文件数据时，数据是按照Hadoop文件读取的规则进行切片分区，而切片规则和数据读取的规则有些差异

在分布式程序中，网络通信开销很大，**Spark程序可以通过控制RDD分区方式来减少通信开销。**Spark中所有的RDD都可以进行分区，系统会根据一个针对键的函数对元素进行分区。虽然**Saprk不能控制每个键具体划分到哪个节点上，但是可以确保相同的键出现在同一个分区上。**

RDD的分区原则：

​	**分区的个数尽量等于集群中CPU核心（core）的数目**。对于不同的Spark部署模式而言，可通过设置 `spark.default.parallelism` 这个参数来配置默认的分区数目。各种模式下默认分区数目如下：

-   Local模式：默认为本地机器的cpu数目，若设置了`local[n]`，则默认为`n`
-   Standalone或Yarn模式：在 集群中所有cpu核数总和 与 2 这两者之间取较大者为默认值
-   Mesos模式：默认分区数为`8`

**Spark为RDD提供的两种分区方式：**

-   哈希分区（HashPartitioner）：是根据哈希值来分区
-   范围分区（RangePartitioner）：将一定范围的数据映射到一个分区中

此外，**Spark还支持自定义分区方式：**

-   即通过自定义的Partitioner对象来控制RDD的分区

    -   让自定义的类继承自`org.apache.spark.Partitioner`

    -   并实现其中抽象方法

    -   ```java
        public abstract int numPartitions()  // 用于返回创建的分区个数
            
        // 用于对输入的key做处理，并返回给key对应的分区ID
        // 分区ID范围 0 ~ numPartitions-1
        public abstract int getPartition(final Object key)  
        ```