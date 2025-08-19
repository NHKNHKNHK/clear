# 1 RDD的创建方式

在Spark中将数据封装到RDD中的方式可以分为四种

而我们常用的两种方式：并行化本地集合（Driver Program中）和引用加载外部存储系统（如HDFS、Hive、HBase、Kafka、Elasticsearch等）数据集

## 1.1 Parallelized Collections（并行化集合）

由一个已经存在的 Scala 集合创建，集合并行化，集合必须时`Seq`本身或者子类对象。

Spark可以通过并行集合创建RDD。即从一个已存在的集合、数组上，**通过 SparkContext 对象调用 `parallelize()` 方法创建RDD**

**方法说明**

:::code-group

```scala
// Scala
def parallelize[T: ClassTag](
    seq: Seq[T],
    numSlices: Int = defaultParallelism): RDD[T]
```

```java
// Java
parallelize(final List<T> list)
parallelize(final List<T> list, final int numSlices) 
// numSlices表示设置的分区数量
// 如果不设置，默认使用scheduler.conf().getInt("spark.default.parallelism", this.totalCores())
//  spark默认从配置对象获取spark.default.parallelism 
// 	如果获取不到，则使用 totalCores 属性，该属性为当前环境最大的可以核数
    
    
    
// 如果数据源为多个文件，那么计算分区时以文件为单位进行分区
wholeTextFiles(final String path)  // 以文件为单位读取数据，读取的结果是一个元组
				 				 // 第一个元素表示文件路径，第二个元素表示文件内容
wholeTextFiles(final String path, final int minPartitions)
```

:::

### 演示

:::code-group

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

```scala [scala shell]
scala> val lines = sc.parallelize(List("hello", "world"))
val lines: org.apache.spark.rdd.RDD[String] = ParallelCollectionRDD[0] at parallelize at <console>:1
```

```scala
/**
 * 采用并行化的方式构建Scala集合Seq中的数据为RDD
 * - 将Scala集合转换为RDD
 */
object _01_ParallelizedCollections {
  def main(args: Array[String]): Unit = {
    // todo 创建应用程序入口 SparkContext 对象

    val sc: SparkContext = {
      // 创建 SparkConf 对象，设置应用的配置信息
      val sparkConf: SparkConf = new SparkConf()
        .setMaster(this.getClass.getSimpleName)
        .setMaster("local[2]")
      // 传递 SparkConf 对象，构建Context实例
      new SparkContext(sparkConf)
    }
    sc.setLogLevel("WARN")

    // Scala中集合Seq序列存储数据
    val linesSeq: Seq[String] = Seq(
      "hadoop scala hive spark scala sql sql",
      "hadoop scala spark hdfs hive spark",
      "spark hdfs spark hdfs scala hive spark"
    )
    // TODO 并行化集合创建RDD数据集
    val inputRDD: RDD[String] = sc.parallelize(linesSeq, numSlices = 2)

    // TODO 调用集合RDD中函数处理分析数据
    val resultRDD: RDD[(String, Int)] = inputRDD
      .flatMap(_.split("\\s+"))
      .map((_, 1))
      .reduceByKey(_ + _)

    // TODO 保存结果RDD到外部存储系统（HDFS、MySQL、HBase。。。。）
    resultRDD.foreach(println)
    
    // todo 应用程序结束，关闭资源
    sc.stop()
  }
}
```

:::

:::tip
`JavaRDD`是RDD的一层封装，本质还是RDD
:::

## 1.2 External Datasets（外部数据集）

Spark可以从Hadoop支持的任何存储源中加载数据去创建RDD，包括**本地文件系统和HDFS（所有Hadoop支持的数据集，比如HDFS、HBase等）等文件系统**

实际使用最多的方法：`textFile()`，读取HDFS或LocalFS上文本文件，指定文件路径和RDD分区数目

通过Spark中的**SparkContext对象调用`textFile()`方法加载数据创建RDD**。

:::tip

-   **`JavaSparkContext`对象能够直接读取的文件类型有 txt 、sequence、object**
    -   文本文件（Text File）：可以使用`JavaSparkContext.textFile()`方法读取文本文件，每一行作为一个RDD的元素。
    -   序列化文件（Sequence File）：可以使用`JavaSparkContext.sequenceFile()`方法读取序列化文件，序列化文件是Hadoop中的一种文件格式，可以将多个小文件合并成一个大文件，提高文件读取效率。
    -   对象文件（Object File）：可以使用`JavaSparkContext.objectFile()`方法读取对象文件，对象文件是将Java对象序列化后存储的文件。
-   其他文件类型，如csv、json、parquet、avro等都需要使用`SparkSession`对象来读取
-   或者是利用第三方库读取（比如jsc配合fastjson解析读取JSON数据）

:::


**方法说明**

:::code-group

```scala
// Scala
def textFile(
      path: String,		// 文件路径
      minPartitions: Int = defaultMinPartitions		// RDD分区数目
): RDD[String]	
```

```java
// Java
textFile(final String path)  // 以行为单位来读取数据，读取的数据都是字符串
textFile(final String path, final int minPartitions)  // minPartitions设置最小分区数量
    												// 注意：分区数量可能大于 minPartitions
// spark读取文件时，底层其实使用的就是Hadoop的读取方式，所以是一行一行读取
// 数据读取是以偏移量为单位，偏移量不会被重复读取
    // totalSize
    // goalSize = totalSize/minPartitions

// 其中文件路径：
// 		最好是全路径，可以指定文件名称，可以指定文件目录，可以使用通配符指定。 
// 实际项目中如果从HDFS读取海量数据，应用运行在YARN上，默认情况下，RDD分区数目等于HDFS 上Block块数目。
```

:::

### 从Linux本地文件系统加载数据创建RDD

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

### 从HDFS中加载数据创建RDD

代码与从Linux本地文件系统加载数据创建RDD相似，只需做出如下修改

```java
JavaRDD<String> RDD = sparkContext.textFile("/opt/temp/test.txt"); 
// 或
JavaRDD<String> RDD = sparkContext.textFile("hdfs://localhost:8020/opt/temp/test.txt"); 
// 上面两种写法都是可以的
```

### 小文件读取

在实际项目中，有时往往处理的数据文件属于小文件（每个文件数据数据量很小，比如KB，几十MB等），文件数量又很大，如果一个个文件读取为RDD的一个个分区，计算数据时很耗时性能低下，使用SparkContext中提供：`wholeTextFiles`类，专门读取小文件数据。

**方法说明**

:::code-group

```scala
// Scala
def wholeTextFiles(
      path: String,		// 文件存储目录
      minPartitions: Int = defaultMinPartitions		// RDD分区数目
): RDD[(String, String)]
```

```java
// Java
// 如果数据源为多个文件，那么计算分区时以文件为单位进行分区
    
wholeTextFiles(final String path)  // 以文件为单位读取数据，读取的结果是一个元组
				 				 // 第一个元素表示文件路径，第二个元素表示文件内容
wholeTextFiles(final String path, final int minPartitions)
```

:::

:::warning 经验

​实际项目中，可以先使用`wholeTextFiles`方法读取数据，设置适当RDD分区，再将数据保存到文件系统，以便后续应用读取处理，大大提升性能

:::

**演示**

读取100个小文件数据，每个文件大小小于1MB，设置RDD分区数目为2

```scala
import org.apache.spark.{SparkConf, SparkContext}
import org.apache.spark.rdd.RDD

/**
 * 采用 sc.wholeTextFiles() 方法读取小文件
 */
object _01_SparkWholeTextFileTest {
  def main(args: Array[String]): Unit = {
    // todo 创建应用程序入口 SparkContext 对象
    val sc: SparkContext = {
      // 创建 SparkConf 对象，设置应用的配置信息
      val sparkConf: SparkConf = new SparkConf()
        .setAppName(this.getClass.getSimpleName)
        .setMaster("local[2]")
      // 传递 SparkConf 对象，构建Context实例
      new SparkContext(sparkConf)
    }
    sc.setLogLevel("WARN")

    // TODO 使用wholeTextFiles方法读取多个文件
    val inputRDD: RDD[String] = sc.wholeTextFiles("/datas/ratings100/", 2)
      // 以文件为单位读取数据，读取的结果是一个元组
      //	(文件路径，文件内容)
      .flatMap(tuple => tuple._2.split("\\n")) // 我们只提取文件内容

    println(s"Partitions Number = ${inputRDD.getNumPartitions}")
    println(s"Count = ${inputRDD.count()}")

    // todo 应用程序结束，关闭资源
    sc.stop()
  }
}
```

## 1.3 从其他RDD创建RDD

主要是通过一个RDD运算完后，再产生新的RDD。

## 1.4 直接创建RDD（new）

使用new的方式直接构造RDD，一般由Spark框架自身使用。

