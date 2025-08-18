# Spark Streaming

在学习Spark Streaming之前先了解一些概念

**数据处理的角度和方式**

-   流式（Streaming）数据处理
-   批量（batch）数据处理

**数据处理延迟的长短**

-   实时数据处理：毫秒级别：针对海量数据进行实时计算
-   离线数据处理：小时、天级别 ：先收集数据，然后将数据存储起来，当需要时再去对数据进行操作 

**常见的实时计算框架**

-   Apache Spark Streaming
-   Apache Strom
-   Apache Flink
-   Yahoo! S4

在传统的数据处理过程中，我们往往先将数据存入数据库中，当需要的时候再去数据库中进行检索查询，将处理的结果返回给请求的用户；另外，MapReduce 这类大数据处理框架，更多应用在离线计算场景中。而对于一些实时性要求较高的场景，我们期望延迟在秒甚至毫秒级别，就需要引出一种新的数据计算结构——流式计算，对无边界的数据进行连续不断的处理、聚合和分析。

在很多实时数据处理的场景中，都需要用到流式处理（Stream Process）框架，Spark也包含了两个完整的流式处理框架 Spark Streaming 和Structured Streaming（Spark 2.0出现）

官方描述：[Spark Structured Streaming](https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html) makes it easy to build streaming applications and pipelines with the same and familiar Spark APIs.（Spark结构化流使得使用相同和熟悉的Spark api构建流应用程序和管道变得容易。）

# SparkStreaming简介

## **Lambda 架构**

Lambda架构是由Storm的作者Nathan Marz提出的一个实时大数据处理框架。Marz在Twitter工作期间开发了著名的实时大数据处理框架Storm，**Lambda架构是其根据多年进行分布式大数据系统的经验总结提炼而成**

Lambda架构的目标是设计出一个能满足实时大数据系统关键特性的架构，包括有：高容错、低延时和可扩展等。**Lambda架构整合离线计算和实时计算，融合不可变性（Immunability），读写分离和复杂性隔离等一系列架构原则**，可集成Hadoop，Kafka，Storm，Spark，Hbase等各类大数据组件。

Lambda架构通过分解的三层架构来解决该问题：批处理层（Batch Layer），速度层（Speed Layer）和服务层（Serving Layer）：

-   **批处理层（Batch Layer）** 

批处理层主用由Hadoop来实现，负责数据的存储和产生随意的视图数据； 

承担了两个职责：存储Master Dataset，这是一个不变的持续增长的数据集；针对这个 Master Dataset进行预运算；

Batch Layer执行的是批量处理，例如Hadoop或者Spark支持的Map-Reduce方式；

-   **速度层（Speed Layer）** 

从对数据的处理来看，speed layer与batch layer非常相似，它们之间最大的区别是前者只处理最近的数据，后者则要处理所有的数据； 

为了满足最小的延迟，speed layer并不会在同一时间读取所有的新数据，相反，它会在接收到新数据时，更新realtime view，而不会像batch layer那样重新运算整个view； 

speed layer是一种增量的计算，而非重新运算（recomputation）； 

Speed Layer的作用包括：对更新到serving layer带来的高延迟的一种补充、快速、增量的算法和最终Batch Layer会覆盖speed layer

-   **服务层（Serving Layer）** 

服务层负责建立索引和呈现视图，以便于它们可以被非常好被查询到； 

Batch Layer通过对master dataset执行查询获得了batch view，而Serving Layer就要负责对batch view进行操作，从而为最终的实时查询提供支撑； 

职责包含：对batch view的随机访问和更新batch view；



总结下来，Lambda架构就是如下的三个等式：

```shell
批处理视图：batch view = function(all data)

实时处理视图：realtime view = function(realtime view, new data)

查询视图：query = function(batch view . realtime view)
```

Lambda架构中各个层常用的组件：

-   数据流存储可选用基于不可变日志的分布式消息系统Kafka； 

-   Batch Layer数据集的存储可选用Hadoop的HDFS，或者是阿里云的ODPS；Batch View的预计算可以选用MapReduce或Spark； 

-   Batch View （属于Serving Layer）自身结果数据的存储可使用MySQL（查询少量的最近结果数据），或HBase（查询大量的历史结果数据）。 

-   Speed Layer 增量数据的处理可选用Storm或Spark Streaming或Flink或StructuredStreaming； 

-   Realtime View（属于Speed Layer ）增量结果数据集为了满足实时更新的效率，可选用Redis等内存NoSQL

随着大数据技术的发展，Lambda架构必备架构衍生出了新的架构，**kapper架构**

## **Streaming 计算模式**

不同的流式处理框架有不同的特点，也适应不同的场景，主要有如下两种模式

-   模式一：**原生流处理（Native）**
    -   所有输入记录会一条接一条地被处理，上面提到的 Storm 和 Flink都是采用这种方式；

-   模式二：**微批处理（Batch）**
    -   将输入的数据以某一时间间隔 T，切分成多个微批量数据，然后对每个批量数据进行处理， 

    -   Spark Streaming 和 StructuredStreaming采用的是这种方式；



## Spark Streaming是什么

Spark Streaming用于**流式数据的处理**。Spark Streaming支持的数据输入源很多，例如：Kafka、Flume、Twitter、ZeroMQ和简单的TCP套接字等等。**数据输入后可以用Spark的高度抽象原语**（这里的原语和RDD的算子类似）如：map、reduce、join、window等进行运算。而结果也能保存在很多地方，如HDFS，数据库等	

和Spark基于RDD的概念很相似，Spark Streaming使用**离散化流(discretized stream)作为抽象表示**，叫做**DStream**

DStream是随时间推移而收到的数据的序列。在内部，每个**时间区间**收到的数据都作为RDD 存在，而DStream是由这些 RDD 所组成的序列(因此得名“离散化”)。所以简单来将，**DStream就是对RDD在实时数据处理场景的一种封装。**

但是，Spark Streaming其实是**准实时**（准实时是因为它无法达到真正的毫秒级别，一般是以秒、分钟为单位）、**微批次**（微批次是因为SparkStreaming不能做到数据来一点处理一点，因为这样会浪费资源，一般以时间为单位）的数据处理框架

## Spark Streaming的特点

​	Spark Streaming 是构建在Spark上的实时计算框架，且**是对Spark Core API 的一个扩展**，它能够实现对流数据进行实时处理，并具有很好的扩展性、**高吞吐量和容错性**。

**Easy to use**（易于使用）

​	Spark Structured Streaming abstracts away complex streaming concepts such as incremental processing, checkpointing, and watermarks so that you can build streaming applications and pipelines without learning any new concepts or tools.（Spark结构化流抽象了复杂的流概念，比如增量处理、检查点和水印，这样你就可以在不学习任何新概念或工具的情况下构建流应用程序和管道。）

```scala
spark
  .readStream
  .select($"value".cast("string").alias("jsonData"))
  .select(from_json($"jsonData",jsonSchema).alias("payload"))
  .writeStream
  .trigger("1 seconds")
  .start()
```

​	Spark Streaming 支持Java、Python、Scala等语言，可以像编写离线程序一样编写实时计算的程序 



**Unified batch and streaming APIs**（统一的批处理和流api）

​	Spark Structured Streaming provides the same structured APIs (DataFrames and Datasets) as Spark so that you don’t need to develop on or maintain two different technology stacks for batch and streaming. In addition, unified APIs make it easy to migrate your existing batch Spark jobs to streaming jobs.（Spark结构化流提供了与Spark相同的结构化api (dataframe和Datasets)，因此您不需要为批处理和流处理开发或维护两种不同的技术堆栈。此外，统一的api可以很容易地将现有的批处理Spark作业迁移到流作业。）



**Low latency and cost effective**（低延迟和成本效益）

​	Spark Structured Streaming uses the same underlying architecture as Spark so that you can take advantage of all the performance and cost optimizations built into the Spark engine. With Spark Structured Streaming, you can build low latency streaming applications and pipelines cost effectively.（Spark结构化流使用与Spark相同的底层架构，因此您可以利用Spark引擎内置的所有性能和成本优化。使用Spark结构化流，您可以高效地构建低延迟流应用程序和管道。）

​	

**Fault tolerance**（容错）

​	Spark Streaming recovers both lost work and operator state(e.g. sliding windows) out of the box, without any extra code on your part（Spark Streaming开箱即用，无需任何额外的代码即可恢复丢失的工作和操作员状态(例如滑动窗口)。）

​	Spark Streaming 在没有额外代码和配置的情况下，可以恢复丢失的数据。对于实时计算来说，容错性至关重要。首先要明确一下 Spark 中的 RDD 容错机制，即每个RDD都是一个不可变的分布式可重算的数据集，它记录着确定性的此操作血缘关系（lineage），所有只要输入数据是可容错的，那么任意一个RDD的分区（Partition）出错或不可用，都可以使用原始输入数据经过转换操作重新计算得到



**Spark Integration**（易整合到Spark体系）

​	By runing on Spark Streaming lets you reuse the same code for batch processing, join streams against historical data, or run ad-hoc queries on stream state. Build powerful interactive applications, not just analytics.（通过在Spark上运行，Spark Streaming允许您重用相同的代码来进行批处理，根据历史数据连接流，或者在流状态上运行临时查询。构建强大的交互式应用程序，而不仅仅是分析）

```scala
stream.join(historiccounts).filter{
	case (word， (curcount, oldcount)) =>
		Curcount > oldcount
}
```

​	实时处理可以与离线处理相结合，实现交互式的查询操作



**对于Spark Streaming来说**，**将流式数据按照时间间隔BatchInterval划分为很多部分**，每一部分 Batch（批次），针对每批次数据Batch当做RDD进行快速分析和处理。 

它的**核心是DStream**，DStream类似于RDD，它实质上一系列的RDD的集合，DStream可以按照秒、分等时间间隔将数据流进行批量的划分。首先从接收到流数据之后，将其划分为多个batch，然后提交给Spark集群进行计算，最后将结果批量输出到HDFS或者数据库以及前端页面展示等等





# 背压机制

-   Spark 1.5以前版本，用户如果要**限制 Receiver的数据接收速率**，可以通过设置静态配制参数**spark.streaming.receiver.maxRate** 的值来实现，此举虽然可以通过限制接收速率，来适配当前的处理能力，防止内存溢出，但也会引入其它问题。
    -   比如：producer数据生产高于maxRate，当前集群处理能力也高于maxRate，这就**会造成资源利用率下降**等问题。
-   为了更好的协调数据接收速率与资源处理能力，**1.5版本**开始 Spark Streaming 可以动态控制数据接收速率来适配集群数据处理能力**。背压机制（即Spark Streaming Backpressure）**: 根据 JobScheduler 反馈作业的执行信息来**动态调整Receiver数据接收率**。
-   通过属性 **spark.streaming.backpressure.enabled** 来控制是否启用backpressure机制，**默认值false**，即不启用。



# Spark Streaming的组件介绍

**Spark Streaming的核心组件有2个：**

-   Streaming Context（在Java中用 **JavaStreamingContext**类来表示）
-   Dstream(离散流) （在Java中用 **JavaDStream**类来表示）

## Streaming Context

回顾SparkCore和SparkSQL及SparkStreaming处理数据时编程： 

-   **SparkCore** 
    -   数据结构：RDD 
    -   **SparkContext**：上下文实例对象 
-   **SparkSQL** 
    -   数据结构：Dataset/DataFrame = RDD + Schema  
    -   **SparkSession**：会话实例对象， 在Spark 1.x中SQLContext/HiveContext 
-   SparkStreaming 
    -   数据结构：DStream = Seq[RDD] 
    -   **StreamingContext**：流式上下文实例对象，==底层还是SparkContext==
    -   参数：划分流式数据时间间隔BatchInterval：1s，5s

​	Streaming Context 是 Spark Streaming 程序的起点，生成Streaming Context之前需要生成 SparkContext，SparkContext 可以理解为申请Spark集群的计算资源，Streaming Context可以理解为申请Spark Streaming的计算资源

​	其中 Streaming Context 在Java中用 `JavaStreamingContext` 类来表示，SparkContext 在Java中用 `JavaSparkContext类`来表示

从官方文档可知，提供两种方式构建StreamingContext实例对象

-   1）**根据SparkConf创建**

A [JavaStreamingContext](https://spark.apache.org/docs/3.2.0/api/java/index.html?org/apache/spark/streaming/api/java/JavaStreamingContext.html) object can be created from a [SparkConf](https://spark.apache.org/docs/3.2.0/api/java/index.html?org/apache/spark/SparkConf.html) object.

```java
public JavaStreamingContext(final SparkConf conf, 
                            final Duration batchDuration) 
```

官方示例

Scala

```scala
import org.apache.spark._
import org.apache.spark.streaming._

val conf = new SparkConf().setAppName(appName).setMaster(master)
val ssc = new StreamingContext(conf, Seconds(1))
```

Java

```java
import org.apache.spark.*;
import org.apache.spark.streaming.api.java.*;

SparkConf conf = new SparkConf().setAppName(appName).setMaster(master);
JavaStreamingContext ssc = new JavaStreamingContext(conf, new Duration(1000));
```

-   2）**根据SparkContext创建**

A `JavaStreamingContext` object can also be created from an existing `JavaSparkContext`.

```java
public JavaStreamingContext(final JavaSparkContext sparkContext,
                            final Duration batchDuration)
```

官方示例

Scala

```scala
import org.apache.spark.streaming._

val sc = ...                // existing SparkContext
val ssc = new StreamingContext(sc, Seconds(1))
```

Java

```java
import org.apache.spark.streaming.api.java.*;

JavaSparkContext sc = ...   //existing JavaSparkContext
JavaStreamingContext ssc = new JavaStreamingContext(sc, Durations.seconds(1));
```

定义了上下文（StreamingContext）之后，须执行以下操作：

1.  通过创建input DStreams来定义 input sources。

2.  通过对 DStreams 应用转换（**transformation**）和输出（**output**）操作来定义流计算。

3.  使用 streamingContext.start() 开始接收数据并处理它。

4.  使用streamingContext 等待处理被停止(手动或由于任何错误)。awaitTermination()。

5.  可以使用streamingContext.stop()手动停止处理。


个人理解后的解释如下：

**StreamingContext的创建、启动和销毁**

**一个StreamingContext定义之后，必须执行以下程序进行实时计算的执行**

1、创建输入DStream来创建输入不同的数据源。

2、对DStream定义**transformation和output等**各种算子操作，来定义我们需要的各种**实时计算逻辑**。

3、调用StreamingContext的 **start()** 方法，进行**启动我们的实时处理数据**。

4、调用StreamingContext的**awaitTermination()**方法，来**等待应用程序的终止**。可以使用CTRL+C手动停止，或者就是让它持续不断的运行进行计算。

5、也可以通过调用StreamingContext的stop()方法，来停止应用程序。（这种方式不太好，一般不使用）

注意:

-   只要我们一个**StreamingContext启动之后，我们就不能再往这个Application其中添加任何计算逻辑了**。比如执行start()方法之后，还给某个DStream执行一个算子，这是不允许的

-   一个StreamingContext停止之后，是肯定不能够重启的。调用stop()之后，不能再调用start()，否则程序报错

    ```diff
     org.apache.spark.SparkException: Only one SparkContext should be running in this JVM (see SPARK-2243).The currently running SparkContext was created at:
    org.apache.spark.api.java.JavaSparkContext.<init>(JavaSparkContext.scala:58)
    ```

-   **必须保证一个JVM同时只能有一个StreamingContext启动。在你的应用程序中，不能创建两个StreamingContext。**

-   调用 StreamingContext上的 stop()  同时停止内部的SparkContext，如果不希望如此，还希望后面继续使用SparkContext 创建其他类型的Context（比如SQLContex）。那么要只需要在StreamingContext 的 stop()方法的可选参数stopSparkContext设置为false。

    ```java
     public void stop()
     public void stop(final boolean stopSparkContext)
    ```

-   **一个SparkContext可以被重用来创建多个StreamingContext，但是需要在创建下一个StreamingContext之前停止前一个StreamingContext(**不停止SparkContext)。

-   ==一个JVM中只能有一个 SparkContext 对象==，否则程序报错

    ```diff
    org.apache.spark.SparkException: Only one SparkContext should be running in this JVM (see SPARK-2243).The currently running SparkContext was created at:
    ```

    

## DStream

离散数据流（DStream）是Spark Streaming最基本的抽象。它代表了一种连续的数据流，要么从某种数据源提取数据，要么从其他数据流映射转换而来。

**DStream内部是由一系列连续的RDD组成的**，每个RDD都包含了特定时间间隔内的一批数据。

DStream表示连续的数据流，可以通过Kafka、Flume、Kinesis等数据源创建，也可以通过现有的 DStream的高级操作来创建。

在内部，**DStream由一系列连续的rdd表示**，这是Spark对不可变的分布式数据集的抽象。**DStream中的每个RDD都包含一定时间间隔的数据**

-   Dstream是Spark Streaming的数据抽象，同DataFrame，其实底层依旧是RDD。

-   在DStream上应用的任何操作都转换为在底层rdd上的操作。

-   这些底层RDD转换是由Spark引擎计算的。DStream操作隐藏了大部分细节，并为开发人员提供了更高级的API。



# DStream 编程模型

​	在Spark Streaming中，**将实时的数据分解成一系列很小的批处理任务**（前面我们也说过Spark Straming其实是准实时、微批次的）。批处理引擎 Spark Core 把**输入的数据按照一定的时间片**（比如说1s）**分成一段一段的数据**，**每一段数据都会转换成 RDD** 输入到 Spark Core中，然后将DStream操作转换为 RDD算子的相关操作，即转换操作、窗口操作以及输出操作。RDD算子操作产生的中间结果数据会保存在内存中，也可以将中间的结果数据输出到外部存储系统中进行保存。



# 输入DStream 和 Receiver

​	输入DStream代表了来自数据源的输入数据流。比如从文件读取、从TCP、从HDFS读取等。**每个DSteam都会绑定一个Receiver对象**，该对象是一个关键的核心组件，用来从我们的各种数据源接受数据，并将其存储在Spark的内存当中，这个内存的StorageLevel，我们可以自己进行指定

Spark Streaming提供了两种内置的数据源支持：

-   **基础数据源**：SSC API中直接提供了对这些数据源的支持，比如文件、tcp socket、Akka Actor等。
-   **高级数据源**：比如Kafka、Flume、Kinesis和Twitter等数据源，要引入第三方的JAR来完成我们的工作。
-   **自定义数据源**：比如我们的ZMQ、RabbitMQ、ActiveMQ等任何格式的自定义数据源。



## DStream 基础数据源

### File Source

下面是WordCount案例

1）环境准备

在pom导入依赖

```xml
 <dependencies>
        <!-- spark-core依赖-->
        <dependency>
            <groupId>org.apache.spark</groupId>
            <artifactId>spark-core_2.13</artifactId>
            <version>3.2.0</version>
        </dependency>
        <!-- spark-sql分析-->
        <dependency>
            <groupId>org.apache.spark</groupId>
            <artifactId>spark-sql_2.13</artifactId>
            <version>3.2.0</version>
        </dependency>

        <dependency>
            <groupId>org.apache.spark</groupId>
            <artifactId>spark-streaming_2.13</artifactId>
            <version>3.2.0</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- windows 入口配置-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>2.4</version>
                <configuration>
                    <archive>
                        <manifest>
                            <!-- mainClass标签填写主程序入口-->
                            <mainClass>com.clear.wordcount.CreateFile</mainClass>
                            <addClasspath>true</addClasspath>
                            <classpathPrefix>lib/</classpathPrefix>
                        </manifest>
                    </archive>
                    <classesDirectory>
                    </classesDirectory>
                </configuration>
            </plugin>
        </plugins>
    </build>

```

2）编写代码

```java
// 编写代码思路
// 1、首先我们导入StreamingContext（在Java中为 JavaStreamingContext），它是所有流功能的主要入口点。我们创建一个具有两个执行线程的本地StreamingContext，批处理间隔为10秒。
// 2、appName参数是应用程序在集群UI上显示的名称。
//	 master是Spark、Mesos或YARN集群的URL，或者是一个特殊的local[*]字符串，在本地模式下运行。
//   实际上，当在集群上运行时，您不希望在程序中硬编码master，而是使用spark-submit启动应用程序并在那里接收它。但是，对于本地测试和单元测试，可以通过local[*]来运行Spark Streaming in-process(检测本地系统中的核数)。

// 3.在定义了上下文之后，必须执行以下操作:
//		1）通过创建输入 DStreams 来定义输入源。
//		2）通过对DStreams应用转换和输出操作来定义流计算。
//		3）开始接收数据并使用streamingContext.start()处理它。

// 		4）使用streamingContext.awaitTermination()等待处理停止(手动或由于任何错误)。
// 		可以使用streamingContext.stop()手动停止处理。(不推荐这种方式)
```

具体代码实现如下

```java
/**
 * /opt/software/spark-local/bin/spark-submit --class com.clear.wordcount.SparkStreaming01_WordCount --master local /opt/temp/spark-streaming-demo-1.0.jar
 */
public class SparkStreaming01_WordCount {
    public static void main(String[] args) throws InterruptedException {
        SparkConf sparkConf = new SparkConf().setMaster("local[2]").setAppName("SparkStreaming wordCount");
        // todo 创建环境对象
        // 创建SparkStreamingContext (在Java中为 JavaStreamingContext)
        // 创建时需要传入两个参数 第一个表示环境配置
        // 第二个(batchDuration)译为批处理持续时间，表示批量处理的周期，即 采集周期
        JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(10));
        jssc.sparkContext().setLogLevel("ERROR");

        // 读取数据（读取该目录中的文件）
        JavaDStream<String> line = jssc.textFileStream("/opt/temp/txt/");

        // 分析数据（这里我们是完成词频统计需求）
        JavaDStream<String> word = line.flatMap(s -> Arrays.asList(s.split(" ")).iterator());
        JavaPairDStream<String, Integer> pairDStream = word.mapToPair(new PairFunction<String, String, Integer>() {
            @Override
            public Tuple2<String, Integer> call(String word) throws Exception {
                return new Tuple2<>(word, 1);
            }
        });
        JavaPairDStream<String, Integer> resultDStream = pairDStream.reduceByKey((x, y) -> x + y);

        // 仅仅输出本轮结果(因为我们是每10s统计一次，只考虑前10s的数据)
        resultDStream.print();

        // todo 关闭环境
        //jssc.stop();
        // 但是由于Spark Streaming采集器是长期执行的任务，所以不能关闭
        // 如果main方法执行完毕，应用程序也会自动结束，所以不能让main执行完毕
        // 使用Driver开始执行
        // 1.启动采集器
        jssc.start();
        // 2.等待采集器的关闭
        jssc.awaitTermination();
    }
}
```

```java
/**
 * /opt/software/spark-local/bin/spark-submit --class com.clear.wordcount.SparkStreaming01_WordCount --master local /opt/temp/spark-streaming-demo-1.0.jar
 */
public class SparkStreaming01_WordCount {
    public static void main(String[] args) throws InterruptedException {
        SparkConf sparkConf = new SparkConf().setMaster("local[2]").setAppName("SparkStreaming wordCount");
        // todo 创建环境对象
        // 创建SparkStreamingContext (在Java中为 JavaStreamingContext)
        // 创建时需要传入两个参数 第一个表示环境配置
        // 第二个(batchDuration)译为批处理持续时间，表示批量处理的周期，即 采集周期
        JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(10));
        jssc.sparkContext().setLogLevel("ERROR");

        // 读取数据（读取该目录中的文件）
        JavaDStream<String> line = jssc.textFileStream("/opt/temp/txt/");

        // 分析数据（这里我们是完成词频统计需求）
        JavaDStream<String> word = line.flatMap(s -> Arrays.asList(s.split(" ")).iterator());
        JavaPairDStream<String, Integer> pairDStream = word.mapToPair(new PairFunction<String, String, Integer>() {
            @Override
            public Tuple2<String, Integer> call(String word) throws Exception {
                return new Tuple2<>(word, 1);
            }
        });
        JavaPairDStream<String, Integer> resultDStream = pairDStream.reduceByKey((x, y) -> x + y);

        // 仅仅输出本轮结果(因为我们是每10s统计一次，只考虑前10s的数据)
        resultDStream.print();

        // todo 关闭环境
        //jssc.stop();
        // 但是由于Spark Streaming采集器是长期执行的任务，所以不能关闭
        // 如果main方法执行完毕，应用程序也会自动结束，所以不能让main执行完毕
        // 使用Driver开始执行
        // 1.启动采集器
        jssc.start();
        // 2.等待采集器的关闭
        jssc.awaitTermination();
    }
}
```

打包上次至服务器

依次执行下面命令

```shell
# 先执行spark程序
/opt/software/spark-local/bin/spark-submit --class com.clear.wordcount.SparkStreaming01_WordCount --master local /opt/temp/spark-streaming-demo-1.0.jar 
# 再执行jar
java -jar /opt/temp/spark-streaming-demo-1.0.jar 
```

结果如下

```
-------------------------------------------
Time: 1683803630000 ms
-------------------------------------------
(Flink,1)
(Dataset,1)
(Hive,2)
(J2EE,1)
(Spark,4)
(JavaScript,1)
(hadoop,3)
(HBase,3)
(JavaWeb,1)
(Java,1)
...

-------------------------------------------
Time: 1683803640000 ms
-------------------------------------------
(Hive,4)
(J2EE,1)
(Spark,4)
(JavaScript,1)
(hadoop,4)
(HBase,4)
(com,1)
(JavaWeb,1)
(Java,3)
(Streaming,2)
...
```

**WordCount解析**

-   **Discretized Stream**是Spark Streaming的基础抽象，代表持续性的数据流和经过各种Spark原语操作后的结果数据流。在**内部实现上，DStream是一系列连续的RDD来表示**。**每个RDD含有一段时间间隔内的数据**。
-   对数据的操作也是按照RDD为单位来进行的
-   计算过程由Spark Engine来完成。DStream操作隐藏了大部分细节，并为开发人员提供了更高级的API。



### TCP Source

需求：使用netcat工具向9999端口不断的发送数据，通过SparkStreaming读取端口数据并统计不同单词出现的次数

```java
/**
 * 需求: 使用netcat工具向9999端口不断的发送数据
 * 通过SparkStreaming读取端口数据
 * <p>
 * 开启服务-发送消息  nc -l -p 9999  linux: nc -lk 9999
 * <p>
 * 监听服务-消费数据  nc IP 9999
 * <p>
 * TODO 通过读取 TCP 创建DStream
 *

 * /opt/software/spark-local/bin/spark-submit --class com.clear.inputDStream.SparkStreaming_TCPSource --master local /opt/temp/spark-streaming-demo-1.0.jar
 */
public class SparkStreaming_TCPSource {
    public static void main(String[] args) throws InterruptedException {
        // 1.初始化 Spark配置信息
        SparkConf sparkConf = new SparkConf().setMaster("local[2]").setAppName("ReadTCP");
        // 2.初始化 SparkStreamingContext，采集周期4s
        JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(4));
        jssc.sparkContext().setLogLevel("ERROR");

        // todo 3.通过监控socket端口创建DStream
        // 监听 window平台192.168.43.2:9999
        /**
         * public JavaReceiverInputDStream<String> socketTextStream(
         *      final String hostname, 接收数据要连接的主机名
         *      final int port, 接收数据要连接到的端口
         *      final StorageLevel storageLevel 存储级别
         *      )
         */
        JavaReceiverInputDStream<String> ds = jssc.socketTextStream(
                "192.168.43.2", 9999, StorageLevel.MEMORY_ONLY());

        JavaDStream<String> wordDStream = ds.flatMap(line -> Arrays.asList(line.split(" ")).iterator());
        JavaPairDStream<String, Integer> wordToOneDStream = wordDStream.mapToPair(word -> new Tuple2<>(word, 1));
        JavaPairDStream<String, Integer> resultDStream = wordToOneDStream.reduceByKey((x, y) -> (x + y));

        // 4.打印
        resultDStream.print();

        // 启动 SparkStreamingContext （启动采集器）
        jssc.start();
        // 等待采集器的关闭（在执行过程中 任何的异常都会触发程序结束）
        jssc.awaitTermination();
    }
}
```

打包上传至服务器

在服务器执行如下命令

```
[root@kk01 temp]# /opt/software/spark-local/bin/spark-submit --class com.clear.inputDStream.SparkStreaming_TCPSource --master local /opt/temp/spark-streaming
-demo-1.0.jar
```

在window本机使用necat工具向9999端口不断的发送数据（前提：在windows已经配置好了necat环境）

```shell
C:\Users\没事我很好>nc -lp 9999
hello world
spark
hadoop
```

结果如下

```diff
-------------------------------------------
Time: 1683897216000 ms
-------------------------------------------
(hello,1)
(world,1)
(spark,1)

-------------------------------------------
Time: 1683897220000 ms
-------------------------------------------
(hadoop,1)
```



### HDFS Source

需求：监听hdfs的某一个目录的变化（新增文件）

```java
/**
 * SparkStreaming监听hdfs的某一个目录的变化（新增文件）
 * 相关HDFS命令
 * 上传文件(文件存在 则报错)  hadoop fs -put hello.txt /clear/spark_test/hello.txt
 * 追加文件 hadoop fs -appendToFile hello.txt /clear/spark_test/hello.txt
 * 覆盖文件 hadoop fs -copyFromLocal -f hello.txt /clear/spark_test/hello.txt
 *
 * /opt/software/spark-yarn/bin/spark-submit --class com.clear.inputDStream.SparkStreaming_HDFSSource --master yarn --deploy-mode client /opt/temp/spark-streaming-demo-1.0.jar
 */
public class SparkStreaming_HDFSSource {
    public static void main(String[] args) throws InterruptedException {
        // 1.初始化 Spark配置信息
        SparkConf sparkConf = new SparkConf().setMaster("yarn").setAppName("ReadTCP");
        // 2.初始化 SparkStreamingContext，采集周期4s
        JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(4));
        jssc.sparkContext().setLogLevel("ERROR");  // 设置日志级别

        String inputPath = "hdfs://clear/spark_test";
        // TODO 通过读取 HDFS目录下文件变化 创建DStream
        /**
         * public JavaDStream<String> textFileStream(final String directory)
         *  监控的文件格式 必须是 文本文件
         *  文件追加操作后,获取的是整个文件的内容
         */
        JavaDStream<String> lineDStream = jssc.textFileStream(inputPath);

        // wordCount
        JavaDStream<String> wordDStream = lineDStream.flatMap(line -> Arrays.asList(line.split(" ")).iterator());
        JavaPairDStream<String, Integer> wordToOneDStream = wordDStream.mapToPair(word -> new Tuple2<>(word, 1));
        JavaPairDStream<String, Integer> resultDStream = wordToOneDStream.reduceByKey((x, y) -> (x + y));

        // 4.打印
        resultDStream.print();

        // 启动 SparkStreamingContext （启动采集器）
        jssc.start();
        // 等待采集器的关闭（在执行过程中 任何的异常都会触发程序结束）
        jssc.awaitTermination();

    }
}
```

打包上次至服务器

需要确保hdfs集群、yarn集群启动

```
start-dfs.sh  # 启动dfs集群
start-yarn.sh  # 启动yarn集群
```

提前在hdfs中创建文件夹/clear/spark_test/

```shell
[root@kk01 software]# hadoop fs -mkdir /clear/spark_test
```

运行spark 程序

```shell
[root@kk01 spark-yarn]# /opt/software/spark-yarn/bin/spark-submit --class com.clear.inputDStream.SparkStreaming_HDFSSource --master yarn --deploy-mode client
 /opt/temp/spark-streaming-demo-1.0.jar
```

将linux本地的hello.txt文件上次至hdfs

```shell
[root@kk01 temp]# pwd
/opt/temp
[root@kk01 temp]# hadoop fs -put hello.txt /clear/spark_test/hello.txt
```

hello.txt文件内容如下

```
hello spark java

....

i love hadoop
this is for java

```

随后依次执行如下命令

```shell
[root@kk01 temp]# hadoop fs -appendToFile hello.txt /clear/spark_test/hello.txt
[root@kk01 temp]# hadoop fs -copyFromLocal -f hello.txt /clear/spark_test/hello.txt
```

结果如下

```
Time: 1683884408000 ms
-------------------------------------------

-------------------------------------------
Time: 1683884412000 ms
-------------------------------------------

-------------------------------------------
Time: 1683884416000 ms
-------------------------------------------
```



### Queue Source

​	可以使用streamingContext.queueStream(queueofrdd)基于rdd队列创建DStream。推送到队列中的每个RDD将被视为DStream中的一批数据，并像流一样处理。





## DStream 高级数据源

### Spark与Kafka集成的方式

​	Kafka 是一个分布式流处理平台，主要用于处理实时流数据。而 SparkStreaming 是基于 Spark 的流式处理框架，可以处理实时数据流。SparkStreaming 可以集成 Kafka，实现对 Kafka 消息的实时处理。

​	在 SparkStreaming 中，我们可以**通过 KafkaUtils 来整合 Kafka**。KafkaUtils 提供了两种方式来创建数据流：KafkaUtils.createStream 和 KafkaUtils.createDirectStream。

-   利用 Kafka 的Receiver方式进行集成（ **KafkaUtils.createStream**）

-   利用 Kafka 的Direct方式进行集成（ **KafkaUtils.createDirectDstream**）

    

Spark Streaming获取kafka数据的两种方式 Receiver 与Direct 的方式，可以从代码中简单理解成**Receiver方式是通过zookeeper来连接kafka队列**，**Direct方式是直接连接到kafka的节点上获取数据**了。

-   **Receiver API**：需要一个专门的Executor去接收数据，然后发送给其他的Executor做计算。存在的问题，接收数据的Executor和计算的Executor速度会有所不同，特别在接收数据的Executor速度大于计算的Executor速度，会导致计算数据的节点内存溢出。**早期版本中提供此方式，当前版本不适用**

-   **Direct API**：是由计算的Executor 来主动消费Kafka的数据，速度由自身控制。

    

#### Kafka0.8 Receiver模式（sparkstreaming2.2以前）

需要注意：当前版本不适用

1）导入依赖（需要注意，0-8版本的依赖与0-10是不一样的，如果需要使用0-10则需要另外导入）

```xml
<dependency>
	<groupId>org.apache.spark</groupId>
    <artifactId>spark-streaming-kafka-0-8_2.11</artifactId>
    <version>2.3.2</version>
</dependency>
```

2）编写代码

```java
package com.clear.kafka;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.spark.streaming.api.java.JavaPairInputDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import kafka.serializer.StringDecoder;
import org.apache.spark.SparkConf;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.kafka.HasOffsetRanges;
import org.apache.spark.streaming.kafka.KafkaUtils;
import org.apache.spark.streaming.kafka.OffsetRange;
import org.apache.spark.streaming.kafka010.CanCommitOffsets;

import java.util.*;

/**
 * 基于Kafka 0-8 Receiver 模式和 SparkStreaming集成
 */
    // fixme 代码编译不通过
public class SparkStreaming_Kafka_createStream {
    public static void main(String[] args) throws InterruptedException {
        String brokers = "kk01:9092,kk02:9092,kk03:9092";
        String topics = "test";
        String group = "spark-streaming";

        SparkConf sparkConf = new SparkConf()
                .setAppName("SparkStreaming_Kafka_createStream")
                .setMaster("local[2]")
                .set("spark.streaming.receiver.writeAheadLog.enable", "true");
        // 创建 Spark Streaming 上下文
        JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(5));

        // 设置 Kafka 参数
        Map<String, String> kafkaParams = new HashMap<>();
        kafkaParams.put("metadata.broker.list", brokers);
        // key-value序列胡
        kafkaParams.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        kafkaParams.put("value.deserializer","org.apache.kafka.common.serialization.StringSerializer");
        kafkaParams.put("group.id", group);

        // 创建 Kafka 数据流
        JavaPairInputDStream<String, String> kafkaStream = KafkaUtils.createStream(
                jssc,
                String.class,
                String.class,
                StringDecoder.class,
                StringDecoder.class,
                kafkaParams,
                Collections.singleton(topics));
        // 处理数据流
        kafkaStream.foreachRDD(rdd -> {
            // 处理消息
            // 读取 Kafka 数据创建 DStream(基于Receive方式)
            rdd.foreach(msg -> System.out.println(msg._2));

            // 提交偏移量
            OffsetRange[] offsetRanges = ((HasOffsetRanges) rdd.rdd()).offsetRanges();
            ((CanCommitOffsets) kafkaStream.inputDStream()).commitAsync(offsetRanges);
        });

        // 启动 Spark Streaming
        jssc.start();
        jssc.awaitTermination();
    }
}

```



#### 基于Kafka 0-8 Direct模式（弃用）

需要注意：当前版本不适用

1）导入依赖（需要注意，0-8版本的依赖与0-10是不一样的，如果需要使用0-10则需要另外导入）

```xml
<dependency>
	<groupId>org.apache.spark</groupId>
    <artifactId>spark-streaming-kafka-0-8_2.11</artifactId>
    <version>2.3.2</version>
</dependency>
```

2）编写代码

```java
/**
 * 基于Kafka 0-8 Direct 模式和 SparkStreaming集成
 */
// fixme 代码编译不通过
public class SparkStreaming_Kafka_createDirectStream {
    public static void main(String[] args) throws InterruptedException {
        String brokers = "kk01:9092,kk02:9092,kk03:9092";
        String topics = "test";
        String group = "spark-streaming";

        SparkConf sparkConf = new SparkConf()
                .setAppName("SparkStreaming_Kafka_createStream")
                .setMaster("local[2]")
                .set("spark.streaming.receiver.writeAheadLog.enable", "true");
        // 创建 Spark Streaming 上下文
        JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(5));

        // 设置 Kafka 参数
        Map<String, Object> kafkaParams = new HashMap<>();
        kafkaParams.put("metadata.broker.list", brokers);
        // key-value序列化
        kafkaParams.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        kafkaParams.put("value.deserializer", "org.apache.kafka.common.serialization.StringSerializer");
        // 设置消费者组
        kafkaParams.put("group.id", group);

        // 获取 Kafka 分区偏移量
        Map<TopicAndPartition, Long> offsets = getOffsetFromExternalStorage();
        
        // 创建 Kafka 数据流
        KafkaUtils.createDirectStream(
                jssc,
                String.class,
                String.class,
                StringDecoder.class,
                StringDecoder.class,
                kafkaParams,
                offsets,
                rdd -> {
                    // 获取当前 RDD 的分区偏移量
                    OffsetRange[] offsetRanges = ((HasOffsetRanges) rdd.rdd()).offsetRanges();

                    // 处理消息
                    rdd.foreach(msg -> {
                        System.out.println(msg._2());
                    });

                    // 提交偏移量
                    ((CanCommitOffsets) kafkaStream.inputDStream()).commitAsync(offsetRanges);
                });
        
        // 启动 Spark Streaming
        jssc.start();
        jssc.awaitTermination();
    }

    // 从外部存储获取分区偏移量
    private static Map<TopicAndPartition, Long> getOffsetFromExternalStorage() {
        // todo 从外部存储获取分区偏移量
        return new HashMap<>();
    }
}
```



####  Kafka 0-10 Direct模式（推荐使用）

​	Kafka 0.10的Spark Streaming集成提供了简单的并行性，Kafka分区和Spark分区之间的1:1对应，以及对偏移量和元数据的访问。然而，由于新的集成使用了新的Kafka消费者API而不是简单的API，所以在使用上有明显的差异。

1）导入pom依赖

```xml
<dependency>
	<groupId>org.apache.spark</groupId>
    <artifactId>spark-streaming-kafka-0-10_2.13</artifactId>
    <version>3.2.0</version>
</dependency>
```

注意：

​	不要手动添加org.apache.kafka工件(例如kafka-clients)的依赖项。**spark-streaming-kafka-0-10工件已经具有适当的传递依赖关系**，并且不同版本可能以难以诊断的方式不兼容。

2）编写代码

Kafka生成数据代码

```java
import org.apache.kafka.clients.producer.*;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Arrays;
import java.util.List;
import java.util.Properties;
import java.util.Random;

/**
 * 通过该类不断地向Kafka中生成数据
 */
public class KafkaWordCountProducer {
    public static String topic = "kafka_spark";  //定义主题

    public static void main(String[] args) throws Exception {
        Properties properties = new Properties();
        // todo 配置 Kafka 服务器信息
        // 设置Kafka集群的ip地址和端口号
        properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "kk01:9092,kk02:9092,kk03:9092");
        // 设置key序列化方式（key是用来存放数据对应地offset）
        properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        // 设置value序列化方式
        properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        // 指定响应的方式
        properties.put("acks", "all");
        // 指定失败重试的次数
        properties.put(ProducerConfig.RETRIES_CONFIG, 3);
        // todo 创建 KafkaProducer 对象
        // 创建Kafka生产者对象
        KafkaProducer<String, String> kafkaProducer = new KafkaProducer<>(properties);

        // todo 提供数据
        // 创建一个容器，存放一些数据
        List<String> list = Arrays.asList("hello world", "hello hadoop", "hello spark", "spark streaming");
        // 提供一个随机数，随机获取list容器中的数据发送至Kafka
        Random random = new Random();
        try {
            while (true) {
                // 数据
                String message = list.get(random.nextInt(list.size()));

                ProducerRecord<String, String> record = new ProducerRecord<>(topic, message);
                // todo 向kafka中发送数据
                kafkaProducer.send(
                        record,
                        // 回调函数
                        new Callback() {
                            @Override
                            public void onCompletion(RecordMetadata recordMetadata, Exception exception) {
                                if (exception != null) {
                                    // 出现异常
                                    exception.printStackTrace();
                                } else {
                                    // 未出现异常 发送成功
                                    // 在控制台打印当前数据发送到了哪个主题，哪个分区的第几条数据
                                    System.out.println("消息发送成功:" + message);
                                }
                            }
                        });
                Thread.sleep(1000);
            }
        } finally {
            kafkaProducer.close();
        }
    }
}
```

SparkStreaming消费Kafka代码

```java
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.spark.api.java.function.*;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.spark.SparkConf;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaDStream;
import org.apache.spark.streaming.api.java.JavaInputDStream;
import org.apache.spark.streaming.api.java.JavaPairDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.apache.spark.streaming.kafka010.ConsumerStrategies;
import org.apache.spark.streaming.kafka010.KafkaUtils;
import org.apache.spark.streaming.kafka010.LocationStrategies;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import scala.Tuple2;

import java.util.*;

// fixme 程序报错 java.lang.ClassNotFoundException: scala.Serializable
// fixme Exception in thread "main" java.lang.NoClassDefFoundError: org/apache/spark/streaming/kafka010/LocationStrategies 此类报错可能是spark、Kafka、scala版本不兼容导致
public class SparkStreaming_KafkaToWordCount_createDirectStream {
    public static void main(String[] args) throws Exception {
        // 创建 SparkConf 对象 setMaster中 提供的核数必须 >=2 或 *
        SparkConf sparkConf = new SparkConf().setAppName("SparkStreamToKafka").setMaster("local[*]");
        // 创建 StreamingContext 对象，采集周期5s
        JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(5));

        // todo 提供 Kafka 配置
        Map<String, Object> kafkaParams = new HashMap<>();
        // 设置连接的 Kafka Broker 主机名称和端口号
        kafkaParams.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "kk01:9092,kk02:9092,kk03:9092");
        // 设置 消费者组，不设置会报错
        kafkaParams.put(ConsumerConfig.GROUP_ID_CONFIG, "test");
        // 设置key反序列化
        kafkaParams.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");
        // 设置value反序列化
        kafkaParams.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");

        kafkaParams.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest");

        // 配置topic，可以是数组
        //Collection<String> topics = Arrays.asList("kafka_spark");
        List<String> topics = Arrays.asList("kafka_spark");

        // todo 读取Kafka中的数据创建 DStream
        // 注意，KafkaUtils 是在 org.apache.spark.streaming.kafka010.KafkaUtils 包下
        JavaInputDStream<ConsumerRecord<String, String>> inputDStream = KafkaUtils.createDirectStream(
                jssc,
                // 本地化策略：将Kafka中的数据均与的分配到各个Executor中
                // 注意  org.apache.spark.streaming.kafka010.LocationStrategies
                LocationStrategies.PreferConsistent(),
                // 表示要从Kafka进行消费数据（offset谁来管理，从哪个位置开始消费数据）
                // 注意 org.apache.spark.streaming.kafka010.ConsumerStrategies
                ConsumerStrategies.<String, String>Subscribe(topics, kafkaParams)
        );

        // 将每条数据读取出来
        JavaDStream<String> wordsDStream = inputDStream.flatMap(new FlatMapFunction<ConsumerRecord<String, String>, String>() {
            @Override
            public Iterator<String> call(ConsumerRecord<String, String> record) throws Exception {
                return Arrays.asList(record.value().split(" ")).iterator();
            }
        });

//        wordsDStream.foreachRDD(new VoidFunction<JavaRDD<String>>() {
//            @Override
//            public void call(JavaRDD<String> stringJavaRDD) throws Exception {
//                stringJavaRDD.foreach(
//                        new VoidFunction<String>() {
//                            @Override
//                            public void call(String s) throws Exception {
//                                System.out.println(s);
//                            }
//                        }
//                );
//            }
//        });

        // 开始计算操作（进行wordCount）
        JavaPairDStream<String, Integer> wordToOneDStream = wordsDStream.mapToPair(new PairFunction<String, String, Integer>() {
            private static final long serialVersionUID = 1L;

            @Override
            public Tuple2<String, Integer> call(String word) throws Exception {
                return new Tuple2<>(word, 1);
            }
        });
        JavaPairDStream<String, Integer> wordCountDStream = wordToOneDStream.reduceByKey(new Function2<Integer, Integer, Integer>() {
            private static final long serialVersionUID = 1L;

            @Override
            public Integer call(Integer v1, Integer v2) throws Exception {
                return v1 + v2;
            }
        });

        wordCountDStream.print();

        // 开启任务
        jssc.start();
        jssc.awaitTermination();
    }
}
```

​	如果您的Spark批处理持续时间大于默认的Kafka心跳会话超时(30秒)，请适当增加 **heartbeat.interval.ms 和session.timeout.ms**。对于大于5分钟的批处理，这将需要在代理上更改 group.max.session.timeout.ms。



```java
// API说明
package org.apache.spark.streaming.kafka010;

public static <K, V> JavaInputDStream<ConsumerRecord<K, V>> createDirectStream(
JavaStreamingContext var0,
// JavaStreamingContext对象
    
LocationStrategy var1, 
// 新的Kafka消费者API将把消息预取到缓冲区中。因此，出于性能考虑，Spark集成将缓存的消费者保留在执行器上(而不是为每个批处理重新创建它们)是很重要的，并且更倾向于在具有适当消费者的主机位置上调度分区。 
// 在大多数情况下，您应该使用LocationStrategies。
// 如上所示。这将在可用的执行器之间均匀地分配分区。如果你的执行者和你的Kafka代理在同一个主机上，使用PreferBrokers，它会优先在Kafka leader上为该分区调度分区。
// 最后，如果分区之间的负载有明显的倾斜，请使用PreferFixed。这允许您指定分区到主机的显式映射(任何未指定的分区将使用一致的位置)。 
// 消费者缓存的默认最大大小为64。如果你希望处理超过(64 *执行器数量)的Kafka分区，你可以通过spark.streaming.kafka.consumer.cache.maxCapacity来改变这个设置。 
// 如果你想禁用Kafka消费者的缓存，你可以将spark.streaming.kafka.consumer.cache.enabled设置为false。 
//缓存由topicpartition和group键控制。Id，所以使用单独的组。每个调用createDirectStream。
    
ConsumerStrategy<K, V> var2
// 新的Kafka消费者API有许多不同的方式来指定主题，其中一些需要大量的对象实例化后设置。ConsumerStrategies提供了一个抽象，允许Spark即使在从检查点重新启动后也能获得正确配置的消费者。 
// ConsumerStrategies。如上所示，订阅允许您订阅固定的主题集合。SubscribePattern允许您使用正则表达式来指定感兴趣的主题。
// 注意，与0.8集成不同，使用Subscribe或SubscribePattern应该在运行流期间响应添加分区。最后，Assign允许您指定一个固定的分区集合。这三种策略都有重载的构造函数，允许您为特定分区指定起始偏移量。 
// 如果您有上述选项无法满足的特定消费者设置需求，那么ConsumerStrategy是一个您可以扩展的公共类。
)
```



#### 总结 Receiver 与 Direct 方式

**Receiver 方式**

-   receiver模式采用了Received接收器模式，需要一个线程一直接收数据，将数据接收到Executor中默认存储级别为 **MEMORY_AND_DISK_SER_2。**

-   receiver模式自动使用zookeeper管理消费数据offset

-   receiver模式底层读取Kafka 采用 **High Lever Consumer API**实现，这种模式不关心offset，只要数据

-   receiver模式当Driver挂掉时，有丢失数据的风险，可以开启 **WAL 机制**避免丢失数据，但是开启后加大了数据处理延迟，并且存在数据重复消费的风险。

-   receiver模式**并行度由 spark.streaming.blockInterval = 200ms** ,可以减少这个参数增大并行度，最小不能低于50ms

缺点：

**（1）receiver内存溢出问题**：

　　使用kafka高层次的consumer API来实现，使用receiver 从kafka中获取的数据都保存在spark excutor的内存中，然后由Spark Streaming启动的job来处理数据。因此一旦数据量暴增，很容易造成内存溢出。

**（2）数据丢失**：

　　并且，在默认配置下，这种方式可能会因为底层失败而造成数据丢失，如果要启用高可靠机制，确保零数据丢失，要启用Spark Streaming的**预写日志机制（Write Ahead Log**，（已引入）在Spark 1.2）。该机制会同步地将接收到的Kafka数据保存到分布式文件系统（比如HDFS）上的预写日志中，以便底层节点在发生故障时也可以使用预写日志中的数据进行恢复。

**（3）数据重复消费**：

​	使用Kafka的高阶API来在ZooKeeper中保存消费过的 offset的。这是消费Kafka数据的传统方式。这种方式配合着**WAL机制可以保证数据零丢失的高可靠性，但是却无法保证数据被处理一次且仅一次**，可能会处理两次。因为 Spark和ZooKeeper之间可能是不同步的。

小结：

-   被动将数据接收到 Executor，当有任务堆积时，数据存储问题
-   这种模式不能手动维护消费者offset
-   开启WAL机制之后，流计算性能会下降，并且还有可能导致数据的重复消费问题，但是不开启的话又可能出现数据丢失的问题



**Direct 方式**

-   周期性地查询kafka，来获得每个topic+partition的最新的offset，并且主动的进行数据获取。（因为direct模式没有使用receiver接收器模式，每批次处理数据直接获取当前批次数据处理）


-   可以简化并行读取：spark会创建跟kafka partition一样多的RDD partition，并且会并行从kafka中读取数据。（即**direct模式并行度与读取的topic的partition一一对应**）


-   高性能：kafka中做了数据复制，可以通过kafka的副本进行恢复。


-   缺点是成本提高且无法通过zookeeper来监控消费者消费情况。


-   这种新的不基于 Receiver 的直接方式，**是在 Spark 1.3 中引入的**。替代掉使用 Receiver 来接收数据后，这种方式会周期性地查询 Kafka，来获得每个 topic + partition 的最新的 offset，从而定义每个 batch 的 offset 的范围。当处理数据的 job 启动时，就会**使用 Kafka 的 Simple Consumer API**来获取 Kafka指定offset范围的数据，**可以手动维护消费者offset**。


-   使用 kafka 的简单 API，**Spark Streaming 自己就负责追踪消费的offset，并保存在checkpoint中**。Spark自己一定是同步的，因此**可以保证数据是消费一次且仅消费一次**。
-   可以使用设置checkpoint的方式管理消费offset，使用 StreamingContext.getOrCreate(ckDIR, CreateStreamingContext) 恢复

**这种方法相较于Receiver方式的优势在于：**

**简化的并行(Simplified Parallelism)**：

​	在Receiver的方式中我们提到创建多个Receiver之后利用union来合并成一个Dstream的方式提高数据传输并行度。而在Diret方式中，**Kafka中的partition与RDD中的partition是一一对应的并行读取Kafka数据**，这种映射关系也更利于理解和优化。

**高效(Efficiency)：**

​	在Receiver的方式中，为了达到0数据丢失需要将数据存入Write Ahead Log(WAL)中，这样在Kafka和日志中就保存了两份数据，浪费！而第二种方式不存在这个问题，只要我们Kafka的数据保留时间足够长，我们都能够从Kafka进行数据恢复。

**正好一次（Exactly-once semantics）**

​	在Receiver的方式中，使用的是Kafka的 High Lever Consumer API 从Zookeeper中获取offset值，这也是传统的从Kafka中读取数据的方式，但由于Spark Streaming消费的数据和Zookeeper中记录的offset不同步，这种方式偶尔会造成数据重复消费。而**第二种方式（dircet方式），直接使用了 Kafka 的 Simple Consumer API，Offsets则利用Spark Streaming的checkpoints进行记录，消除了这种不一致性。**

**请注意**，此方法的一个缺点是它不会更新Zookeeper中的偏移量，因此基于Zookeeper的Kafka监视工具将不会显示进度。但是，您可以在每个批处理中访问此方法处理的偏移量，并自行更新Zookeeper。





## DStream与Kafka集成（基于Direct方式）

### Spark和Kafka集成Direct的特点

（1）Direct的方式是会直接操作kafka底层的元数据信息，这样如果计算失败了，可以把数据重新读一下，重新处理。即数据一定会被处理。拉数据，是RDD在执行的时候直接去拉数据。

（2）由于直接操作的是kafka，kafka就相当于你底层的文件系统。这个时候能保证严格的事务一致性，即一定会被处理，而且只会被处理一次。而Receiver的方式则不能保证，因为Receiver和ZK中的数据可能不同步，Spark Streaming可能会重复消费数据，这个调优可以解决，但显然没有Direct方便。**而Direct api直接是操作kafka的，spark streaming自己负责追踪消费这个数据的偏移量或者offset，并且自己保存到checkpoint，所以它的数据一定是同步的，一定不会被重复**。即使重启也不会重复，因为checkpoint了，但是程序升级的时候，不能读取原先的checkpoint，面对升级checkpoint无效这个问题，怎么解决呢?升级的时候读取我指定的备份就可以了，即手动的指定checkpoint也是可以的，这就再次完美的确保了事务性，有且仅有一次的事务机制。那么怎么手动checkpoint呢？构建SparkStreaming的时候，有getorCreate这个api，它就会获取checkpoint的内容，具体指定下这个checkpoint在哪就好了。

（3）由于底层是直接读数据，没有所谓的Receiver，直接是周期性(Batch Intervel)的查询kafka，处理数据的时候，我们会使用基于kafka原生的Consumer api来获取kafka中特定范围(offset范围)中的数据。这个时候，Direct Api访问kafka带来的一个显而易见的性能上的好处就是，如果你要读取多个partition，Spark也会创建RDD的partition，这个时候RDD的partition和kafka的partition是一致的。而Receiver的方式，这2个partition是没任何关系的。这个优势是你的RDD，其实本质上讲在底层读取kafka的时候，kafka的partition就相当于原先hdfs上的一个block。这就符合了数据本地性。RDD和kafka数据都在这边。所以读数据的地方，处理数据的地方和驱动数据处理的程序都在同样的机器上，这样就可以极大的提高性能。不足之处是由于RDD和kafka的patition是一对一的，想提高并行度就会比较麻烦。提高并行度还是repartition，即重新分区，因为产生shuffle，很耗时。这个问题，以后也许新版本可以自由配置比例，不是一对一。因为提高并行度，可以更好的利用集群的计算资源，这是很有意义的。

（4）不需要开启wal机制，从数据零丢失的角度来看，极大的提升了效率，还至少能节省一倍的磁盘空间。从kafka获取数据，比从hdfs获取数据，因为zero copy的方式，速度肯定更快。

### Kafka Direct VS Receiver

从高层次的角度看，之前的和Kafka集成方案（reciever方法）使用WAL工作方式如下：

1）运行在Spark workers/executors上的Kafka Receivers连续不断地从Kafka中读取数据，其中用到了Kafka中高层次的消费者API。

2）接收到的数据被存储在Spark workers/executors中的内存，同时也被写入到WAL中。只有接收到的数据被持久化到log中，Kafka Receivers才会去更新Zookeeper中Kafka的偏移量。

3）接收到的数据和WAL存储位置信息被可靠地存储，如果期间出现故障，这些信息被用来从错误中恢复，并继续处理数据。





-   这个方法可以保证从Kafka接收的数据不被丢失。但是在失败的情况下，有些数据很有可能会被处理不止一次！这种情况在一些接收到的数据被可靠地保存到WAL中，但是还没有来得及更新Zookeeper中Kafka偏移量，系统出现故障的情况下发生。这导致数据出现不一致性：**Spark Streaming知道数据被接收，但是Kafka那边认为数据还没有被接收，这样在系统恢复正常时，Kafka会再一次发送这些数据**。
-   这种不一致产生的原因是因为两个系统无法对那些已经接收到的数据信息保存进行原子操作。为了解决这个问题，只需要一个系统来维护那些已经发送或接收的一致性视图，而且，这个系统需要拥有从失败中恢复的一切控制权利。基于这些考虑，**社区决定将所有的消费偏移量信息只存储在Spark Streaming中，并且使用Kafka的低层次消费者API来从任意位置恢复数据**。

为了构建这个系统，新引入的Direct API采用完全不同于Receivers和WALs的处理方式。它不是启动一个Receivers来连续不断地从Kafka中接收数据并写入到WAL中，而是简单地给出每个batch区间需要读取的偏移量位置，最后，每个batch的Job被运行，那些对应偏移量的数据在Kafka中已经准备好了。这些偏移量信息也被可靠地存储（checkpoint），在从失败中恢复



-   需要注意的是，Spark Streaming可以在失败以后重新从Kafka中读取并处理那些数据段。然而，由于仅处理一次的语义，最后重新处理的结果和没有失败处理的结果是一致的。
-   因此，Direct API消除了需要使用WAL和Receivers的情况，而且确保每个Kafka记录仅被接收一次并被高效地接收。这就使得我们可以将Spark Streaming和Kafka很好地整合在一起。总体来说，这些特性使得流处理管道拥有高容错性，高效性，而且很容易地被使用。













## DStream 自定义Receiver

自定义Receiver步骤如下：

-   需要继承Receiver
-   定义泛型
-   实现onStart、onStop方法来自定义数据源采集。

演示1：

```java
import org.apache.spark.SparkConf;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaReceiverInputDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.apache.spark.streaming.receiver.Receiver;

import java.util.Random;

/**
 * 实现自定义Receiver
 */
public class SparkStreaming03_DIY {
    public static void main(String[] args) throws InterruptedException {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("SparkStreaming wordCount");
        // todo 创建环境对象
        // 创建SparkStreamingContext (在Java中为 JavaStreamingContext)
        // 创建时需要传入两个参数 第一个表示环境配置
        // 第二个(batchDuration)译为批处理持续时间，表示批量处理的周期，即 采集周期
        JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(10));
        jssc.sparkContext().setLogLevel("ERROR");


        JavaReceiverInputDStream<String> messageDS = jssc.receiverStream(new MyReceiver(StorageLevel.MEMORY_AND_DISK_2()));
        messageDS.print();

        // 1.启动 SparkStreaming
        jssc.start();
        // 2.等待采集器的关闭
        jssc.awaitTermination();
    }

    /**
     * 自定义数据采集器Receiver
     * 1.继承org.apache.spark.streaming.receiver.Receiver类
     * 2.定义泛型
     * 3.重写抽象方法
     */
    static class MyReceiver extends Receiver<String> {

        private boolean flg = true;

        public MyReceiver(StorageLevel storageLevel) {
            super(storageLevel);
        }

        @Override
        public void onStart() {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    while (flg) {
                        String message = "采集的数据为：" + new Random().nextInt(10);
                        store(message);
                        try {
                            Thread.sleep(2000);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }).start();
        }

        @Override
        public void onStop() {
            flg = false;
        }
    }
}
```

结果如下

```diff
-------------------------------------------
Time: 1683895990000 ms
-------------------------------------------
采集的数据为：5

-------------------------------------------
Time: 1683896000000 ms
-------------------------------------------
采集的数据为：5
采集的数据为：8
采集的数据为：7
采集的数据为：0
采集的数据为：6

```

演示2：

```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.ConnectException;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.receiver.Receiver;


/**
 * 自定义数据采集器Receiver
 * 这个类继承自Spark中的Receiver类，我们覆盖了onStart()和onStop()方法。
 * 在onStart()方法中，我们启动一个新线程来接收数据，数据来源于一个socket连接。
 * 在onStop()方法中，我们什么也不做。
 */
public class MyCustomReceiver extends Receiver<String> {
    private static final long serialVersionUID = 1L;

    private String host;
    private int port;

    public MyCustomReceiver(String host, int port) {
        super(StorageLevel.MEMORY_AND_DISK_2());
        this.host = host;
        this.port = port;
    }

    @Override
    public void onStart() {
        new Thread(this::receive).start();
    }

    @Override
    public void onStop() {
        // do nothing
    }

    private void receive() {
        try {
            Socket socket = new Socket(host, port);

            BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
            String line;
            while (!isStopped() && (line = reader.readLine()) != null) {
                store(line);
            }
            reader.close();
            socket.close();
            restart("Trying to connect again");
        } catch (ConnectException ce) {
            restart("Could not connect", ce);
        } catch (Throwable t) {
            restart("Error receiving data", t);
        }
    }
}
```

```java
import org.apache.spark.SparkConf;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaReceiverInputDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;

public class MyStreamingApp {
    public static void main(String[] args) throws InterruptedException {
        SparkConf conf = new SparkConf().setAppName("MyStreamingApp").setMaster("local[2]");
        // 创建了一个JavaStreamingContext对象，采集周期为5s
        JavaStreamingContext jssc = new JavaStreamingContext(conf, Durations.seconds(5));
        // 设置日志打印级别
        jssc.sparkContext().setLogLevel("ERROR");

        // 定义一个自定义的Receiver
        // 通过receiverStream()方法将其转换为一个JavaReceiverInputDStream对象。
        JavaReceiverInputDStream<String> lines = jssc.receiverStream(new MyCustomReceiver("localhost", 9999));

        // 处理数据
        lines.print();

        // 启动Streaming应用程序
        jssc.start();

        // 等待程序结束
        jssc.awaitTermination();
    }
}
```

要测试这个应用程序，我们需要启动一个socket服务器来模拟数据源。可以使用necat工具

可以在命令行中输入以下命令：

```shell
nc -lp 9999
# 如果是Linux，就是下面这个
nc -lk 9999
```

这将启动一个socket服务器，并监听9999端口。现在，我们可以在命令行中输入一些文本

```shell
C:\Users\没事我很好>nc -lp 9999
1
2
3
4
```

然后在应用程序中看到它们被打印出来。如下

```diff
-------------------------------------------
Time: 1683896435000 ms
-------------------------------------------
1
2
3
4
```





# 可靠性

根据数据源的可靠性，可以有两种数据源。源(如Kafka)允许传输的数据被确认。如果从这些可靠来源接收数据的系统正确地确认了接收的数据，就可以确保不会由于任何类型的故障而丢失数据。这就产生了两种接收者:
1). 可靠的接收端—当数据被接收到并存储在Spark中并进行复制时，一个可靠的接收端会正确地向一个可靠的源发送确认。
2), 不可靠的接收者——不可靠的接收者不向源发送确认。这可以用于不支持确认的来源，甚至当一个人不想或需要进入确认的复杂性时，用于可靠的来源。

对于不可靠的接收者，Spark streaming有自己的可靠机制，来保证数据的可靠性。



# Caching / Persistence 缓存/持久化

​	与rdd类似，DStreams也允许开发人员在内存中持久化流的数据。也就是说，在DStream上使用persist()方法将自动在内存中持久化该DStream的每个RDD。如果DStream中的数据将被多次计算(例如，对同一数据进行多次操作)，这是有用的。对于基于窗口的操作，如reduceByWindow和reduceByKeyAndWindow，以及基于状态的操作，如updateStateByKey，这是隐式正确的。因此，由基于**窗口的操作生成的DStreams会自动保存在内存中，而不需要开发人员调用persist()。**

对于通过网络接收数据的输入流(例如，Kafka, sockets等)，默认的持久化级别设置为将数据复制到两个节点以实现容错。

请注意，与rdd不同，DStreams的默认持久化级别将数据序列化在内存中。

# Checkpointing 检查点

​	流应用程序必须全天候运行，因此必须能够适应与应用程序逻辑无关的故障(例如，系统故障、JVM崩溃等)。为了实现这一点，Spark Streaming需要将足够的信息检查点到容错存储系统，以便它可以从故障中恢复。有两种类型的数据被检查点。

-   元数据检查点——将定义流计算的信息保存到容错存储中，如HDFS。这用于从运行流应用程序驱动程序的节点的故障中恢复(稍后将详细讨论)。元数据包括:
    -   配置——用于创建流应用程序的配置。
    -   DStream操作——定义流应用程序的一组DStream操作。
    -   未完成批—作业已进入队列但尚未完成的批。

-   **数据检查点—将生成的rdd保存到可靠的存储中**。这在跨多个批合并数据的一些有状态转换中是必要的。在这样的转换中，生成的rdd依赖于以前批次的rdd，这导致依赖链的长度随着时间的推移而不断增加。为了避免恢复时间的无限增加(与依赖链成正比)，有状态转换的中间rdd定期检查点到可靠的存储(例如HDFS)以切断依赖链。

总而言之，元数据检查点主要用于从驱动程序故障中恢复，而如果使用有状态转换，则数据或RDD检查点甚至对于基本功能也是必要的。

**1）何时启用检查点**

对于具有以下任何要求的应用程序，必须启用检查点:

-   有状态转换的使用——如果在应用程序中使用updateStateByKey或reduceByKeyAndWindow(带逆函数)，则必须提供检查点目录以允许定期的RDD检查点。
-   从运行应用程序的驱动程序的故障中恢复-元数据检查点用于使用进度信息进行恢复。

注意，没有上述有状态转换的简单流应用程序可以在不启用检查点的情况下运行。在这种情况下，从驱动程序故障中恢复也将是部分的(一些接收到但未处理的数据可能会丢失)。这通常是可以接受的，许多Spark Streaming应用程序都是以这种方式运行的。对非hadoop环境的支持有望在未来得到改进。

**2）如何配置检查点**

检查点可以通过在容错、可靠的文件系统(例如HDFS、S3等)中设置一个目录来启用，检查点信息将保存到该目录中。这是通过使用 **streamingContext.checkpoint(checkpointDirectory)**完成的。这将允许您使用前面提到的有状态转换。此外，如果您想让应用程序从驱动程序故障中恢复，您应该重写您的流应用程序，使其具有以下行为。

-   当程序第一次启动时，它将创建一个新的StreamingContext，设置所有的流，然后调用start()。

-   当程序在失败后重新启动时，它将从检查点目录中的检查点数据重新创建StreamingContext。

这个行为通过使用JavaStreamingContext.getOrCreate变得简单。它的用法如下。

```java
// 创建一个可以创建和设置新的JavaStreamingContext的工厂对象
JavaStreamingContextFactory contextFactory = new JavaStreamingContextFactory() {
  @Override public JavaStreamingContext create() {
    JavaStreamingContext jssc = new JavaStreamingContext(...);  // new context
    JavaDStream<String> lines = jssc.socketTextStream(...);     // create DStreams
    ...
    jssc.checkpoint(checkpointDirectory);          // set checkpoint directory
    return jssc;
  }
};

// 从检查点数据中获取JavaStreamingContext或创建一个新的
JavaStreamingContext context = JavaStreamingContext.getOrCreate(checkpointDirectory, contextFactory);

//在上下文上做额外的设置，
//不管正在启动还是重新启动
context. ...

// Start the context
context.start();
context.awaitTermination();
```

​	如果checkpointDirectory存在，那么将根据检查点数据重新创建上下文。如果目录不存在(即，第一次运行)，则调用contextFactory函数来创建一个新的上下文并设置DStreams。

​	除了使用getOrCreate之外，还需要确保驱动程序进程在出现故障时自动重新启动。这只能由用于运行应用程序的部署基础设施完成。这将在部署一节中进一步讨论。 

​	注意，rdd的检查点会产生节省可靠存储的成本。这可能会导致rdd检查点所在批次的处理时间增加。因此，检查点的间隔需要仔细设置。对于小批处理(比如1秒)，每批检查点可以显著降低操作吞吐量。相反，检查点过少会导致沿袭和任务大小的增长，这可能会产生有害的影响。对于需要RDD检查点的有状态转换，默认间隔是批处理间隔的倍数，至少为10秒。它可以通过使用 dstream.checkpoint(checkpointInterval)来设置。通常，检查点间隔为5 - 10个DStream滑动间隔是一个很好的尝试设置。




# DStream 转换

​	DStream上的操作与 RDD 的类似（可以简单理解为，在不引入窗口时，DStream与RDD是很像的），分为Transformations（转换）和Output Operations（输出）两种，此外转换操作中还有一些比较特殊的原语，如：updateStateByKey()、transform()以及各种Window相关的原语。

## 怎样理解 DStream算子的无状态与有状态

**无状态的 转换算子**

-   在每个采集周期内,都会将采集的数据生成一个RDD

*         无状态是指 只操作采集当前周期内的RDD
*         示例:
          *           map、flatmap、filter、repartition、groupByKey等

**有状态的 转换算子**

-   有状态是指 会将之前采集周期内采集的数据 与当前采集周期的数据做聚合操作

​    

## 常用状态转换操作

### map

```java
public <U> JavaDStream<U> map(final Function<T, U> f)
    
// 将源 DStream 的每个元素，传递到函数 f 中进行转换操作，得到一个新的DStream
```

### flatMap

```java
public <K2, V2> JavaPairDStream<K2, V2> mapToPair(final PairFunction<T, K2, V2> f)
    
// 与map()相似，对 DStream 中的每个元素应用给定函数 f，返回由各元素输出的迭代器组成的DStream    
```

### mapToPair

```java
public <K2, V2> JavaPairDStream<K2, V2> mapToPair(final PairFunction<T, K2, V2> f)
```

### flatMapToPair

```java
public <K2, V2> JavaPairDStream<K2, V2> flatMapToPair(final PairFlatMapFunction<T, K2, V2> f)
    
// 可以看成是先flatMap以后，再进行mapTopair
```

### filter

```java
public JavaDStream<T> filter(final Function<T, Boolean> f)

// 返回一个新的 DStream，仅包含源 DStream中经过 f 函数计算结果为true的元素
```

### repartition

```java
public JavaDStream<T> repartition(final int numPartitions)
    
// 用于指定 DStream的分区数 
```

### union

```java
public JavaDStream<T> union(final JavaDStream<T> that)

// 返回一个新的 DStream，包含源DStream和其他DStream中的所有元素
```

### count

```java
public JavaDStream<Long> count()

// 统计源DStream 中每个RDD包含的元素个数，返回一个新的DStream
```

### reduce

```java
public JavaDStream<T> reduce(final Function2<T, T, T> f)

// 使用函数 f 将源DStream中的每个RDD的元素进行聚合操作，返回一个新DStream
```

### countByValue

```java
public JavaPairDStream<T, Long> countByValue()
public JavaPairDStream<T, Long> countByValue(final int numPartitions)

// 计算 DStream 中每个RDD内的元素出现的频次，并返回一个新的 DStream<T, Long>
// 其中T是RDD中每个元素的类型，Long是元素出现的频次
```

### reduceByKey

```java
public JavaPairDStream<K, V> reduceByKey(final Function2<V, V, V> func)
    
public JavaPairDStream<K, V> reduceByKey(final Function2<V, V, V> func, final int numPartitions)
    
public JavaPairDStream<K, V> reduceByKey(final Function2<V, V, V> func, final Partitioner partitioner)

// 当一个类型为K-V的DStream被调用时，返回一个类型为K-V的新的 DStream（简单来说，就是将每个批次中键相同的记录进行规约）
// 其中，每个键的值V都是使用聚合函数 func 汇总得到的。
// 注意：
// 		默认情况下，使用Spark的默认并行度提交任务（本地模式下并行度为2，集群模式下并行度为8）
//		可以通过配置参数 来设置不同的并行任务数    
```

### groupByKey

```java
public JavaPairDStream<K, Iterable<V>> groupByKey()
public JavaPairDStream<K, Iterable<V>> groupByKey(final int numPartitions) 
public JavaPairDStream<K, Iterable<V>> groupByKey(final Partitioner partitioner)

// 简单来说，就是将每个批次中的记录根据键进行分组
```

### join

```java
public <W> JavaPairDStream<K, Tuple2<V, W>> join(final JavaPairDStream<K, W> other)
public <W> JavaPairDStream<K, Tuple2<V, W>> join(final JavaPairDStream<K, W> other, final int numPartitions)
public <W> JavaPairDStream<K, Tuple2<V, W>> join(final JavaPairDStream<K, W> other, final Partitioner partitioner)
    
// 当被调用类型分别为(K,V)和(K,W)键值对的两个DStream时，返回类型为(K,(V,W))键值对的DStream    
// 注意：两个流之间的join需要两个流的批次大小一致（即采集周期一致）**，这样才能做到同时触发计算    
```

### cogroup

```java
public <W> JavaPairDStream<K, Tuple2<Iterable<V>, Iterable<W>>> cogroup(final JavaPairDStream<K, W> other)

public <W> JavaPairDStream<K, Tuple2<Iterable<V>, Iterable<W>>> cogroup(final JavaPairDStream<K, W> other, final int numPartitions)

public <W> JavaPairDStream<K, Tuple2<Iterable<V>, Iterable<W>>> cogroup(final JavaPairDStream<K, W> other, final Partitioner partitioner)

// 当被调用的两个DStream 类型为(K,V)和(K,W)键值对的两个DStream时，则返回类型为(K,(Iterable(V),Iterable(W))的新的DStream
```

### transform

```java
public <U> JavaDStream<U> transform(final Function<R, JavaRDD<U>> transformFunc)
public <U> JavaDStream<U> transform(final Function2<R, Time, JavaRDD<U>> transformFunc)

// 通过对源DStream 中的每个RDD应用 RDD-to-RDD 函数返回一个新DStream，这样就可以在DStream中做任意RDD的操作
// 什么时候使用transform
//     1.DStream功能不完善
//     2.需要代码周期性执行
```

### updateStateByKey

```java
public <S> JavaPairDStream<K, S> updateStateByKey(final Function2<List<V>, Optional<S>, Optional<S>> updateFunc)
    
public <S> JavaPairDStream<K, S> updateStateByKey(final Function2<List<V>, Optional<S>, Optional<S>> updateFunc, final int numPartitions)
    
public <S> JavaPairDStream<K, S> updateStateByKey(final Function2<List<V>, Optional<S>, Optional<S>> updateFunc, final Partitioner partitioner)
    
public <S> JavaPairDStream<K, S> updateStateByKey(final Function2<List<V>, Optional<S>, Optional<S>> updateFunc, final Partitioner partitioner, final JavaPairRDD<K, S> initialRDD)
    
// 返回一个新状态的DStream，其中通过在键的 先前状态 和键的 新值上应用给定函数updateFunc 来更新每一个键的状态。
// 该操作方法主要被用于维护每一个键的任意状态数据    
```



​	需要记住的是，尽管这些函数看起来像作用在整个流上一样，但**事实上每个DStream在内部是由许多RDD（批次）组成，且无状态转化操作是分别应用到每个RDD上的。**

例如：reduceByKey()会归约每个时间区间中的数据，但不会归约不同区间之间的数据。

## 无状态转化操作

​	无状态转化操作就是**把简单的RDD转化操作应用到每个批次上**，也就是**转化DStream中的每一个RDD**。部分无状态转化操作列在了下表中。

​	注意，针对键值对的DStream转化操作(比如 reduceByKey())要添加import StreamingContext._才能在Scala中使用，但是**在Java中不存在隐式转换**。	

#### Transform演示

​	通过对源 DStream中的每个RDD应用 RDD-to-RDD 函数返回一个新 DStream，这样就**可以在DStream 中做任意的RDD操作。**

下面是一段伪代码，简述一下transform()方法

```java
// transform方法可以将底层RDD获取到后进行操作
        // 何时使用transform
        //     1.DStream功能不完善
        //     2.需要代码周期性执行

        // Code：Driver端
        JavaDStream<Object> newDS = lines.transform(
                rdd -> {
                    // Code：Driver端（周期性执行）
                    rdd.map(
                            str -> {
                                // Code：Executor端
                            }
                    )
                }
        );
        
        // Code：Driver端
        JavaDStream<Object> newDS2 = lines.map(
                data -> {
                    // Code：Executor端
                }
        );；
```

下面演示使用transform()方法将一行语句分割成多个单词

```java
/**
 * 使用transform()方法将一行语句分割成多个单词
 */
public class SparkStreaming_Transform {
    public static void main(String[] args) throws InterruptedException {
        // 创建 SparkCon 对象
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("transform");
        // 创建 SparkContext 对象，它是所有任务计算的源头
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        // 设置日志输出级别
        jsc.setLogLevel("ERROR");
      
        // 创建 StreamingContext 对象，采集周期5s
        JavaStreamingContext jssc = new JavaStreamingContext(jsc, Durations.seconds(5));
        // 连接socket服务，参数 socket服务地址、端口、存储级别(我们这里使用默认的)
        JavaReceiverInputDStream<String> lines = jssc.socketTextStream("192.168.43.2", 9999);

        // 使用 RDD-to-RDD 函数，返回新的DStream对象（即words）
        JavaDStream<String> words = lines.transform(
                rdd -> rdd.flatMap(
                        line -> Arrays.asList(line.split(" ")).iterator()
                )
        );

        // 打印输出结果
        words.print();

        // 开启流式计算
        jssc.start();
        jssc.awaitTermination();
    }
}
```

执行如下命令启动服务端且监听socket服务，并输入如下内容

```shell
C:\Users\没事我很好>nc -lp 9999
I am learing Spark Streaming now
```

结果如下

```
-------------------------------------------
Time: 1684044560000 ms
-------------------------------------------

-------------------------------------------
Time: 1684044565000 ms
-------------------------------------------
I
am
learing
Spark
Streaming
now
```



#### join演示

​	**两个流之间的join需要两个流的批次大小一致（即采集周期一致）**，这样才能做到同时触发计算。计算过程就是对当前批次的两个流中各自的RDD进行join，**与两个RDD的join效果相同**

```java
/**
 * 使用join()方法将两个DStream中各自的RDD进行join
 */
public class SparkStreaming_join {
    public static void main(String[] args) throws InterruptedException {
        // 创建 SparkCon 对象
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("transform");
        // 创建 SparkContext 对象，它是所有任务计算的源头
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        // 设置日志输出级别
        jsc.setLogLevel("ERROR");

        // 创建 StreamingContext 对象，采集周期5s
        JavaStreamingContext jssc = new JavaStreamingContext(jsc, Durations.seconds(5));
        // 连接socket服务，参数 socket服务地址、端口、存储级别(我们这里使用默认的)
        JavaReceiverInputDStream<String> data9999 = jssc.socketTextStream("192.168.43.2", 9999);
        JavaReceiverInputDStream<String> data8888 = jssc.socketTextStream("192.168.43.2", 8888);

        // 将两个流转换为K-V类型
        JavaPairDStream<String, Integer> pairDStream9999 = data9999.mapToPair(word -> new Tuple2<>(word, 9));
        JavaPairDStream<String, Integer> pairDStream8888 = data8888.mapToPair(word -> new Tuple2<>(word, 8));

        // 流的JOIN操作 所谓的DStream的join操作，其实就是两个RDD的join
        JavaPairDStream<String, Tuple2<Integer, Integer>> joinDS = pairDStream9999.join(pairDStream8888);

        // 打印输出结果
        joinDS.print();

        // 开启流式计算
        jssc.start();
        jssc.awaitTermination();
    }
}
```

执行如下命令启动服务端且监听socket服务，并输入如下内容(注意需要同时输入)

```
C:\Users\没事我很好>nc -lp 9999
a
a
a

C:\Users\没事我很好>nc -lp 8888
a
a
a
```

结果如下

```
-------------------------------------------
Time: 1684045595000 ms
-------------------------------------------
(a,(9,8))
(a,(9,8))
(a,(9,8))
```



## 有状态转换操作

-   使用有状态操作时，并行设置检查点

```java
public void checkpoint(final String directory)
```



### updateStateByKey演示

​	**UpdateStateByKey原语用于记录历史记录**，有时，我们需要在DStream中跨批次维护状态(例如流计算中累加wordcount)。针对这种情况，updateStateByKey()为我们提供了对一个状态变量的访问，用于键值对形式的DStream。给定一个由(键，事件)对构成的 DStream，并传递一个指定如何根据新的事件更新每个键对应状态的函数，它可以构建出一个新的 DStream，其内部数据为(键，状态) 对。

updateStateByKey() 的结果会是一个新的DStream，其内部的RDD 序列是由每个时间区间对应的(键，状态)对组成的。

updateStateByKey操作使得我们可以在用新信息进行更新时保持任意的状态。为使用这个功能，需要做下面两步：

1.  定义状态，状态可以是一个任意的数据类型。

2.  定义状态更新函数，用此函数阐明如何使用之前的状态和来自输入流的新值对状态进行更新。

注意：**使用**updateStateByKey**（有状态操作）需要对检查点目录进行配置**，会使用检查点来保存状态

```java
/**
 * 有状态操作wordCount
 * /opt/software/spark-local/bin/spark-submit --class com.clear.dstream.SparkStreaming_updateStateByKey --master local /opt/temp/spark-streaming-demo-1.0.jar
 */
public class SparkStreaming_updateStateByKey {
    public static void main(String[] args) throws InterruptedException {
        // 创建 SparkCon 对象
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("updateStateByKey");
        // 创建 SparkContext 对象，它是所有任务计算的源头
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        // 设置日志输出级别
        jsc.setLogLevel("ERROR");
        // 初始化 StreamingContext，采集周期5s
        JavaStreamingContext jssc = new JavaStreamingContext(jsc, Durations.seconds(5));
        // todo 设置检查点目录，使用有状态操作（updateStateByKey）必须配置检查点目录
        // 否则报错 java.lang.IllegalArgumentException: requirement failed: The checkpoint directory has not been set. Please set it by StreamingContext.checkpoint().
        //jssc.checkpoint("./");

        // 无状态数据操作，只对当前的采集周期数据进行出来
        // 在某些场合，需要保留数据统计结果（状态），实现数据汇总
        //
        // 连接socket服务，参数 socket服务地址、端口、存储级别(我们这里使用默认的)
        JavaReceiverInputDStream<String> dStream = jssc.socketTextStream("192.168.43.2", 9999);

        // 进行计算任务
        JavaDStream<String> wordDStream = dStream.flatMap(line -> Arrays.asList(line.split(" ")).iterator());
        JavaPairDStream<String, Integer> wordToOneDStream = wordDStream.mapToPair(word -> new Tuple2<>(word, 1));
        //JavaPairDStream<String, Integer> wordCountDStream = wordToOneDStream.reduceByKey((x, y) -> (x + y));
        // todo 调用updateStateByKey：根据key对数据的状态进行更新
        // public <S> JavaPairDStream<K, S> updateStateByKey(
        //      final Function2<List<V>, Optional<S>, Optional<S>> updateFunc)
        //          List<V>
        //          Optional<S>
        //          Optional<S>
        JavaPairDStream<String, Integer> wordCountDStream = wordToOneDStream.updateStateByKey(
                // 统计全局的word count
                new Function2<List<Integer>, Optional<Integer>, Optional<Integer>>() {
                  //  private static final long serialVersionUID = -7837221857493546768L;

                    // 参数valueList:相当于这个batch,这个key新的值，可能有多个,比如（hadoop,1）(hadoop,1)传入的可能是(1,1)
                    // 参数oldState:就是指这个key之前的状态
                    public Optional<Integer> call(List<Integer> valueList, Optional<Integer> oldState) throws Exception {
                        Integer newState = 0;
                        // 如果oldState之前已经存在，那么这个key可能之前已经被统计过，否则说明这个key第一次出现
                        if (oldState.isPresent()) {
                            newState = oldState.get();
                        }
                        // 更新state
                        for (Integer value : valueList) {
                            newState += value;
                        }
                        return Optional.of(newState);
                    }
                });

        // 打印输出结果
        wordCountDStream.print();

        // 开启流式计算
        jssc.start();
        // 用于保持程序运行，除非被干预停止
        jssc.awaitTermination();
    }
}
```

打包上次至服务器运行，监听window平台9999端口

```diff
[root@kk01 temp]# /opt/software/spark-local/bin/spark-submit --class com.clear.dstream.SparkStreaming_updateStateByKey --master local /opt/temp/spark-streami
ng-demo-1.0.jar

.....
-------------------------------------------
Time: 1683985595000 ms
-------------------------------------------
(hello,1)

-------------------------------------------
Time: 1683985600000 ms
-------------------------------------------
(hello,2)

-------------------------------------------
Time: 1683985605000 ms
-------------------------------------------
(a,5)
(hello,2)

-------------------------------------------
Time: 1683985610000 ms
-------------------------------------------
(a,5)
(hello,2)
```

```
C:\Users\没事我很好>nc -lp 9999
hello
hello
a
a
a
a
a
```



### WindowOperations 窗口操作

​	在Spark Streaming中，为DStream提供了窗口操作，即在DStream上，将一个可配置的长度设置为窗口，以一个可配置的速率向前移动窗口。

​	根据窗口操作，对窗口内的数据进行计算，每次落在窗口内的RDD数据都会被聚合起来计算，生成的RDD会作为windowDStream的一个RDD。

​	Window Operations可以设置窗口的大小和滑动窗口的间隔来动态的获取当前Steaming的允许状态。所有基于窗口的操作都需要两个参数，分别为 **窗口时长** 以及 **滑动步长**。

-   窗口时长：计算内容的时间范围；
-   滑动步长：隔多久触发一次计算。

注意：**这两者都必须为采集周期大小的整数倍。**

#### window()演示

下面是基于窗口操作的WordCount：3秒一个批次，窗口12秒，滑步6秒。

```java
public class SparkStreaming_window_wordCount {
    public static void main(String[] args) throws InterruptedException {
        // 创建 SparkCon 对象
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("transform");
        // 创建 SparkContext 对象，它是所有任务计算的源头
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        // 设置日志输出级别
        jsc.setLogLevel("ERROR");

        // 创建 StreamingContext 对象，采集周期5s
        JavaStreamingContext jssc = new JavaStreamingContext(jsc, Durations.seconds(3));
        // 连接socket服务，参数 socket服务地址、端口、存储级别(我们这里使用默认的)
        JavaReceiverInputDStream<String> dStream = jssc.socketTextStream("192.168.43.2", 9999);


        JavaDStream<String> wordDS = dStream.flatMap(
                line -> Arrays.asList(line.split(" ")).iterator());
        JavaPairDStream<String, Integer> wordToOneDS = wordDS.mapToPair(
                word -> new Tuple2<>(word, 1));

        // 窗口的范围应该是采集周期的整数倍
        // 窗口是可以滑动的，但是默认情况下，按照一个采集周期进行滑动
        // 这样的话，可能会出现重复数据的计算，为了避免这种情况，可以改变滑动的步长
        // public JavaPairDStream<K, V> window(
        //      final Duration windowDuration,  window的宽度,必须是采集周期的整数倍
        //      final Duration slideDuration)   window滑动间隔,必须是采集周期的整数倍
        JavaPairDStream<String, Integer> windowDS = wordToOneDS.window(
                Durations.seconds(12),
                Durations.seconds(6));

        JavaPairDStream<String, Integer> wordCountDS = windowDS.reduceByKey(
                ((v1, v2) -> (v1 + v2)));


        // 打印输出结果
        wordCountDS.print();

        // 开启流式计算
        jssc.start();
        jssc.awaitTermination();
    }
}
```

输入如下命令，并输入如下内容

```shell
C:\Users\没事我很好>nc -lp 9999
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
```

结果如下

```diff
-------------------------------------------
Time: 1684046916000 ms
-------------------------------------------
(hello,2)

-------------------------------------------
Time: 1684046922000 ms
-------------------------------------------
(hello,6)

-------------------------------------------
Time: 1684046928000 ms
-------------------------------------------
(hello,8)

-------------------------------------------
Time: 1684046934000 ms
-------------------------------------------
(hello,5)

-------------------------------------------
Time: 1684046940000 ms
-------------------------------------------
(hello,1)

-------------------------------------------
Time: 1684046946000 ms
-------------------------------------------
```



#### rudeceByKeyAndWindow()演示

演示使用 reduceByKeyAndWindow()方法统计3个时间内不同字母出现的次数

```java
public class SparkStreaming_reduceByKeyAndWindow {
    public static void main(String[] args) throws InterruptedException {
        // 创建 SparkCon 对象
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("transform");
        // 创建 SparkContext 对象，它是所有任务计算的源头
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        // 设置日志输出级别
        jsc.setLogLevel("ERROR");

        // 创建 StreamingContext 对象，采集周期1s
        JavaStreamingContext jssc = new JavaStreamingContext(jsc, Durations.seconds(1));
        // 连接socket服务，参数 socket服务地址、端口、存储级别(我们这里使用默认的)
        JavaReceiverInputDStream<String> dStream = jssc.socketTextStream("192.168.43.2", 9999);

        //  todo 设置检查点目录，使用有状态操作（reduceByKeyAndWindow 中参数 final Function2<V, V, V> invReduceFunc）必须配置检查点目录
        jssc.checkpoint("/opt/temp/cp");

        JavaDStream<String> wordDS = dStream.flatMap(
                line -> Arrays.asList(line.split(" ")).iterator());
        JavaPairDStream<String, Integer> wordToOneDS = wordDS.mapToPair(
                word -> new Tuple2<>(word, 1));

        // 调用 reduceByKeyAndWindow 操作
        // 当窗口范围比较大，但是滑动幅度比较小，那么可以采取增加和删除数据的方式
        // 无需重复计算，提升性能
        /**
         * public JavaPairDStream<K, V> reduceByKeyAndWindow(
         *      final Function2<V, V, V> reduceFunc,    加上新进入窗口的批次中的元素
         *      final Function2<V, V, V> invReduceFunc, 移除离开窗口的老批次中的元素
         *      final Duration windowDuration,  窗口宽度
         *      final Duration slideDuration)   滑动幅度
         */
        JavaPairDStream<String, Integer> windowWordsDS = wordToOneDS.reduceByKeyAndWindow(
                new Function2<Integer, Integer, Integer>() {
                    @Override
                    public Integer call(Integer v1, Integer v2) throws Exception {
                        return v1 + v2;
                    }
                },
                new Function2<Integer, Integer, Integer>() {
                    @Override
                    public Integer call(Integer v1, Integer v2) throws Exception {
                        return v1 - v2;
                    }
                },
                Durations.seconds(3),
                Durations.seconds(1)
        );

        // 打印输出结果
        windowWordsDS.print();

        // 开启流式计算
        jssc.start();
        jssc.awaitTermination();
    }
}
```

打包上传至服务器运行

```
[root@kk01 temp]# /opt/software/spark-local/bin/spark-submit --class com.clear.dstream.SparkStreaming_reduceByKeyAndWindow --master local /opt/temp/spark-str
eaming-demo-1.0.jar
```

使用如下命令，每秒输入一个字符，具体如下

```shell
C:\Users\没事我很好>nc -lp 9999
a
a
b
b
c
```

结果如下

```diff
-------------------------------------------
Time: 1684049366000 ms
-------------------------------------------
(a,1)

-------------------------------------------
Time: 1684049367000 ms
-------------------------------------------
(a,2)

-------------------------------------------
Time: 1684049368000 ms
-------------------------------------------
(a,2)
(b,1)

-------------------------------------------      # 可以看出，第四秒时，只剩下一个a
Time: 1684049369000 ms
-------------------------------------------
(a,1)
(b,2)

-------------------------------------------		# 第五秒时，a已经不见了
Time: 1684049370000 ms
-------------------------------------------
(a,0)
(b,2)
(c,1)

-------------------------------------------
Time: 1684049371000 ms
-------------------------------------------
(a,0)
(b,1)
(c,1)

-------------------------------------------
Time: 1684049372000 ms
-------------------------------------------
(a,0)
(b,0)
(c,1)

-------------------------------------------
Time: 1684049373000 ms
-------------------------------------------
(a,0)
(b,0)
(c,0)
```



#### 常用窗口操作方法

常用的DStream API 与 WindowOperations 方法如下

```java
public JavaPairDStream<K, V> window(final Duration windowDuration)

public JavaPairDStream<K, V> window(final Duration windowDuration, final Duration slideDuration)
    
// 基于对源DStream窗化的批次进行计算返回一个新的Dstream
// 参数说明
// 		windowDuration: window 的宽度(时间长度),必须是采集周期的整数倍
//      slideDuration:  window 滑动间隔(时间长度),必须是采集周期的整数倍
```

```java
public JavaDStream<Long> countByWindow(final Duration windowDuration, final Duration slideDuration)
    
//  返回一个滑动窗口计数流中的元素个数
// 参数说明
// 		windowDuration: window 的宽度(时间长度),必须是采集周期的整数倍
//      slideDuration:  window 滑动间隔(时间长度),必须是采集周期的整数倍
```

```java
public JavaDStream<T> reduceByWindow(final Function2<T, T, T> reduceFunc, final Duration windowDuration, final Duration slideDuration)

public JavaDStream<T> reduceByWindow(final Function2<T, T, T> reduceFunc, final Function2<T, T, T> invReduceFunc, final Duration windowDuration, final Duration slideDuration)
    
// 通过使用自定义函数整合滑动区间流元素来创建一个新的单元素流；
// 参数说明
// 		reduceFunc	当前窗口元素聚合规则
//		invReduceFunc 与要离开窗口元素聚合规则
// 		windowDuration: window 的宽度(时间长度),必须是采集周期的整数倍
//      slideDuration:  window 滑动间隔(时间长度),必须是采集周期的整数倍
```

```java
public JavaPairDStream<K, V> reduceByKeyAndWindow(final Function2<V, V, V> reduceFunc, final Duration windowDuration)

public JavaPairDStream<K, V> reduceByKeyAndWindow(final Function2<V, V, V> reduceFunc, final Duration windowDuration, final Duration slideDuration)

public JavaPairDStream<K, V> reduceByKeyAndWindow(final Function2<V, V, V> reduceFunc, final Duration windowDuration, final Duration slideDuration, final int numPartitions)

public JavaPairDStream<K, V> reduceByKeyAndWindow(final Function2<V, V, V> reduceFunc, final Duration windowDuration, final Duration slideDuration, final Partitioner partitioner)
    
// 基于滑动窗口对(K,V)类型的DStream中的值，按照K应用聚合函数 reduceFunc 进行聚合操作，返回一个新DStream

```



```java
public JavaPairDStream<K, V> reduceByKeyAndWindow(final Function2<V, V, V> reduceFunc, final Function2<V, V, V> invReduceFunc, final Duration windowDuration, final Duration slideDuration)
    
public JavaPairDStream<K, V> reduceByKeyAndWindow(final Function2<V, V, V> reduceFunc, final Function2<V, V, V> invReduceFunc, final Duration windowDuration, final Duration slideDuration, final int numPartitions, final Function<Tuple2<K, V>, Boolean> filterFunc)
    
public JavaPairDStream<K, V> reduceByKeyAndWindow(final Function2<V, V, V> reduceFunc, final Function2<V, V, V> invReduceFunc, final Duration windowDuration, final Duration slideDuration, final Partitioner partitioner, final Function<Tuple2<K, V>, Boolean> filterFunc)
    
// 更高效的 reduceByKeyAndWindow()实现版本。每个窗口的聚合值，都是基于先前窗口的聚合值进行增量计算得到的。该操作会对进入滑动窗口的新数据进行聚合操作，并对离开窗口的历史数据进行逆向聚合操作（即以 invReduceFunc 参数传入）
```

```java
public JavaPairDStream<T, Long> countByValueAndWindow(final Duration windowDuration, final Duration slideDuration)

public JavaPairDStream<T, Long> countByValueAndWindow(final Duration windowDuration, final Duration slideDuration, final int numPartitions)

// 基于滑动窗口计算源DStream中每个RDD内元素出现的频次，返回一个由(K,V)组成的新的DStream
// 其中，K为RDD中的元素类型，V为元素在滑动窗口出现的次数
```





# DStream 输出

​	在Spark Streaming中，**DStream输出操作是真正触发DStream上所有转换操作进行计算**（与RDD中的惰性求值类似，类似于RDD中的Action算子操作）**的操作**，然后进过输出操作，DStream 中的数据才会进行交互，如将数据写入到分布式文件系统、数据库以及其他应用中。

​	**如果StreamingContext中没有设定输出操作，整个context就都不会启动。**

注意：如果SparkStreaming程序中没有 **输出操作**，会报错，如下

```diff
java.lang.IllegalArgumentException: requirement failed: No output operations registered, so nothing to execute
```



## 常用输出操作方法

### print

```java
public void print()
public void print(final int num)
// 在 Driver 中打印DStream中每一批次数据的最开始10个元素。这用于开发和调试。在Python API中，同样的操作叫print()。
```

```
	saveAsTextFiles(prefix, [suffix])：以text文件形式存储这个DStream的内容。每一批次的存储文件名基于参数中的prefix和suffix。”prefix-Time_IN_MS[.suffix]”。
	saveAsObjectFiles(prefix, [suffix])：以Java对象序列化的方式将Stream中的数据保存为 SequenceFiles . 每一批次的存储文件名基于参数中的为"prefix-TIME_IN_MS[.suffix]". Python中目前不可用。


 TODO saveAsTextFiles|saveAsObjectFiles|saveAsHadoopFiles 算子
*       功能:
*           将每个RDD 保存为 text格式的文件
*           将每个RDD 保存为 Java对象序列化格式的文件
*           将每个RDD 保存为 Hadoop files格式的文件
*       参数:
*           def saveAsTextFiles(prefix: String, suffix: String = ""): Unit
*               prefix: 文件名称_前缀
*               suffix: 文件名称_后缀
*               最终格式: prefix-time.suffix
*
*    TODO 保存到 HDFS
*       使用 foreachRDD 将每个RDD保存到HDFS
```

### saveAsHadoopFiles

```java
public void saveAsHadoopFiles(final String prefix, final String suffix)

public <F extends OutputFormat<?, ?>> void saveAsHadoopFiles(final String prefix, final String suffix, final Class<?> keyClass, final Class<?> valueClass, final Class<F> outputFormatClass)

public <F extends OutputFormat<?, ?>> void saveAsHadoopFiles(final String prefix, final String suffix, final Class<?> keyClass, final Class<?> valueClass, final Class<F> outputFormatClass, final JobConf conf)
    
// 将DStream 中的数据保存为 Hadoop files. 
// 其中，每一批次的存储文件名基于参数中的为"prefix-TIME_IN_MS[.suffix]"。
//    Python API 中目前不可用
```

### foreachRDD

```java
public void foreachRDD(final VoidFunction<R> foreachFunc)

public void foreachRDD(final VoidFunction2<R, Time> foreachFunc)

// 这是最通用(最基本)的输出操作，即将函数 foreachFunc 用于产生于 DStream 的每一个RDD。
// 其中参数传入的函数 foreachFunc 应该实现将每一个RDD中数据推送到外部系统，如将RDD存入文件或者通过网络将其写入数据库
// 换句话来说，就是遍历处理 DStream 中的批次对应的 RDD，可以将每个RDD的数据写入到外部的存储系统，如数据库、Redis等

// 注意：使用foreachRDD时，不会出现时间戳
    
// 注意：
1)	连接不能写在driver层面（序列化）
2)	如果写在foreach则每个RDD中的每一条数据都创建，得不偿失；
3)	增加foreachPartition，在分区创建（获取）。
```

方法说明：

-   简单来说，就是对当前 DStream对象中的RDD进行操作

注意：

​	**必须对抽取出来的rdd执行 action类算子，代码才能执行**



# 优雅的关闭

​	流式任务需要 7*24 小时执行，但是有时涉及到 **升级代码需要主动停止程序**，但是分布式程序，没办法做到一个个进程去杀死，所有配置优雅的关闭就显得至关重要了。

## 1）为什么需要优雅关闭

​	基于前面提到的，当我们的场景需要**保证数据准确，不允许数据丢失**，那么这个时候我们就得考虑优雅关闭了。说到关闭，那么非优雅关闭就是通过 kill -9 processId 的方式或者 yarn -kill applicationId 的方式进行暴力关闭，为什么说这种方式是属于暴力关闭呢？由于Spark Streaming是基于**micro-batch机制**工作的，按照间隔时间生成RDD，如果在间隔期间执行了暴力关闭，那么就会导致这段时间的数据丢失，虽然提供了checkpoin机制，可以使程序启动的时候进行恢复，但是当出现程序发生变更的场景，必须要删除掉checkpoint，因此这里就会有丢失的风险。

​	因此我们需要优雅关闭，将剩余未处理的数据或者正在处理的数据能够全部执行完成后，这样才不会出现数据丢失的情况。



## 2）什么时候触发关闭

​	既然我们知道了需要优雅关闭，那么就需要知道什么会触发关闭，这样才能有针对性的策略实现优雅关闭。

首先我们先来了解一下整体流程：

1.  首先StreamContext在做初始化的时候，会增加Shutdown hook方法 ，放入到一个钩子队列中，并设置优先级为51
2.  当程序jvm退出时，会启动一个线程从钩子队列中按照优先级取出执行，然后就会执行Shutdown钩子方法
3.  当执行Shutdown钩子方法时，首先会将receiver进行关闭，即不再接收数据
4.  然后停止生成BatchRDD
5.  等待task全部完成，停止Executor
6.  最后释放所有资源，即整个关闭流程结束

接下来看源码（scala）的具体实现

**StreamingContext.scala：调用start方法会调用ShutdownHookManager注册stopOnShutdown函数**

```scala
def start(): Unit = synchronized {
    state match {
      case INITIALIZED =>
        startSite.set(DStream.getCreationSite())
        ......
        /**
         * StreamContext启动时会增加Shutdown钩子函数，优先级为51
         */
        shutdownHookRef = ShutdownHookManager.addShutdownHook(
          StreamingContext.SHUTDOWN_HOOK_PRIORITY)(() => stopOnShutdown())
       ....
      case ACTIVE =>
        logWarning("StreamingContext has already been started")
      case STOPPED =>
        throw new IllegalStateException("StreamingContext has already been stopped")
    }
  }

```

**ShutdownHookManager.scala:在增加钩子函数的时候底层调用了SparkShutdownHookManager内部类**

```scala
def addShutdownHook(priority: Int)(hook: () => Unit): AnyRef = {
    shutdownHooks.add(priority, hook)
} 
private lazy val shutdownHooks = {
    val manager = new SparkShutdownHookManager()
    manager.install()
    manager
  }

private [util] class SparkShutdownHookManager {
  def install(): Unit = {
    val hookTask = new Runnable() {
      override def run(): Unit = runAll()
    }
    org.apache.hadoop.util.ShutdownHookManager.get().addShutdownHook(
      hookTask, FileSystem.SHUTDOWN_HOOK_PRIORITY + 30)
  }

  /**
   * jvm退出的时候会开启一个线程按照优先级逐个调用钩子函数
   */
  def runAll(): Unit = {
    shuttingDown = true
    var nextHook: SparkShutdownHook = null
    while ({ nextHook = hooks.synchronized { hooks.poll() }; nextHook != null }) {
      Try(Utils.logUncaughtExceptions(nextHook.run()))
    }
  }

  def add(priority: Int, hook: () => Unit): AnyRef = {
    hooks.synchronized {
      if (shuttingDown) {
        throw new IllegalStateException("Shutdown hooks cannot be modified during shutdown.")
      }
      val hookRef = new SparkShutdownHook(priority, hook)
      hooks.add(hookRef)
      hookRef
    }
  }
}

private class SparkShutdownHook(private val priority: Int, hook: () => Unit)
  extends Comparable[SparkShutdownHook] {
  //这里真正调用注册的函数
  def run(): Unit = hook()
}
```

**那么接下来看下真正执行关闭的逻辑，即StreamingContext#stopOnShutdown方法**

```scala
 private def stopOnShutdown(): Unit = {
    val stopGracefully = conf.getBoolean("spark.streaming.stopGracefullyOnShutdown", false)
    stop(stopSparkContext = false, stopGracefully = stopGracefully)
  }
 def stop(stopSparkContext: Boolean, stopGracefully: Boolean): Unit = {
    synchronized {
      state match {
        case ACTIVE =>
          //调度相关的关闭
          Utils.tryLogNonFatalError {
            scheduler.stop(stopGracefully)
          }
         
          //监控
          Utils.tryLogNonFatalError {
            env.metricsSystem.removeSource(streamingSource)
          }
          
          //ui
          Utils.tryLogNonFatalError {
            uiTab.foreach(_.detach())
          }
          Utils.tryLogNonFatalError {
            unregisterProgressListener()
          }
          StreamingContext.setActiveContext(null)
          //设置状态为停止
          state = STOPPED
      }
    }
    if (shutdownHookRefToRemove != null) {
      ShutdownHookManager.removeShutdownHook(shutdownHookRefToRemove)
    }
     // a user might stop(stopSparkContext = false) and then call stop(stopSparkContext = true).
    if (stopSparkContext) sc.stop()
  }
```

可以看到这里有一个**spark.streaming.stopGracefullyOnShutdown**参数来传给底层的stop方法，即调用Jobscheduler#stop方法

**JobScheduler#stop**

```scala
 def stop(processAllReceivedData: Boolean): Unit = synchronized {
    //1.首先停止接收数据
    if (receiverTracker != null) {
      receiverTracker.stop(processAllReceivedData)
    }

    if (executorAllocationManager != null) {
      executorAllocationManager.foreach(_.stop())
    }

    //2.停止生成BatchRdd，处理剩余的数据
    jobGenerator.stop(processAllReceivedData)

    //3.停止Exectuor
    jobExecutor.shutdown()

    val terminated = if (processAllReceivedData) {
      jobExecutor.awaitTermination(1, TimeUnit.HOURS)  // just a very large period of time
    } else {
      jobExecutor.awaitTermination(2, TimeUnit.SECONDS)
    }
    if (!terminated) {
      jobExecutor.shutdownNow()
    }
  
    // Stop everything else
    listenerBus.stop()
    eventLoop.stop()
    eventLoop = null
    logInfo("Stopped JobScheduler")
  }
```



## 3）采用什么策略关闭？

### 配置策略

​	根据刚才梳理的触发关闭流程中，其实可以通过配置**spark.streaming.stopGracefullyOnShutdown=true**来实现优雅关闭，但是需要发送 SIGTERM 信号给driver端，这里有两种方案

方案一，具体步骤如下：

​	1、通过Spark UI找到driver所在节点。

​	2、登录driver节点，执行 ps -ef |grep java |grep ApplicationMaster命令找到对应的pid

​	3、执行**kill -SIGTERM ** 发送SIGTERM信号

​	4、当spark driver收到该信号时，在日志中会有以下信息

```
ERROR yarn.ApplicationMaster: RECEIVED SIGNAL 15: SIGTERM
INFO streaming.StreamingContext: Invoking stop(stopGracefully=true) from shutdown hook
INFO streaming.StreamingContext: StreamingContext stopped successfully
INFO spark.SparkContext: Invoking stop() from shutdown hook
INFO spark.SparkContext: Successfully stopped SparkContext
INFO util.ShutdownHookManager: Shutdown hook called

```

注意：

注意：

​	这里有一个坑，默认情况下在yarn模式下，**spark.yarn.maxAppAttempts**参数值和

**yarn.resourcemanager.am.max-attempts**是同一个值，即为2。当通过Kill命令杀掉AM时，Yarn会自动重新启动一个AM,因此需要再发送一次Kill命令。当然也可以通过spark-submit命令提交的时候指定spark.yarn.maxAppAttempts=1这个配置参数；但这里也会有容灾风险，比如出现网络问题的时候，这里就无法自动重启了，程序就会以失败而告终。

方案二：

​	通过**yarn application -kill < applicationid >**命令来kill掉job(**不建议使用**)

该命令会发送SIGTERM信号给container,同时也会立即发送 SIGKILL 命令。虽然可以通过**yarn.nodemanager.sleep-delay-before-sigkill.ms**参数来调整SIGTERM和SIGKILL之间的间隔，但是好像没什么作用。具体日志信息如下:

```
ERROR yarn.ApplicationMaster: RECEIVED SIGNAL 15: SIGTERM
INFO streaming.StreamingContext: Invoking stop(stopGracefully=true) from shutdown hook
```



### 标记策略（常用）

​	该种策略通过**借助于三方系统来标记状态**， 一种方法是将标记HDFS文件，如果标记文件存在，则调用jscc.stop(true,true); 或者是借助于redis的key是否存在等方式，此外，还可以借助比mysql、zookeeper等

下面演示监控hdfs的目录来判断是否关闭SparkStreaming

```java
public class MonitorStop implements Runnable {
    private static Configuration conf = new Configuration();
    private static FileSystem fs;

    JavaStreamingContext jssc;

    // 如果HDFS中存在该目录，则关闭SparkStreaming
    String shutdownMarker = "/clear/stop_sparkStreaming";

    // 停止 Spark Streaming Service 的标志
    boolean bool = false;

    public MonitorStop(JavaStreamingContext jssc) {
        this.jssc = jssc;
    }

    @Override
    public void run() {
        try {
            // 获取文件系统实例
            fs = FileSystem.get(new URI("hdfs://192.168.188.128:8020"), conf, "root");
        } catch (IOException | InterruptedException | URISyntaxException e) {
            e.printStackTrace();
        }
        while (true) {
            try {
                // 每5秒监听一次
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            // 获取 SparkStreaming状态
            StreamingContextState state = jssc.getState();

            // 检查是否要停止 Spark Streaming Service
            // 如果shutdownMarker目录存在，则停止服务
            try {
                bool = fs.exists(new Path(shutdownMarker));
            } catch (IOException e) {
                e.printStackTrace();
            }
            if (bool) {
                if (state == StreamingContextState.ACTIVE) {
                    // 优雅的关闭
                    // 计算节点将不在接收新数据，而是将现有的数据处理完毕，然后关闭
                    jssc.stop(true, true);
                }
            }

        }
    }
}
```

```java
/**
 * /opt/software/spark-local/bin/spark-submit --class com.clear.close.SparkStreamingWordCount --master local /opt/temp/spark-streaming-demo-1.0.jar
 */
public class SparkStreamingWordCount {
    private static JavaStreamingContext createJssc() {
        SparkConf sparkConf = new SparkConf().setMaster("local[2]").setAppName("SparkStreaming");
        // 创建 StreamingContext 对象，采集周期5s
        JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(3));

        return jssc;
    }

    public static void main(String[] args) throws InterruptedException {

        JavaStreamingContext jssc = JavaStreamingContext.getOrCreate(
                // 待获取的检查点路径，从中恢复数据，如果获取不到则创建SparkStreaming
                "/opt/temp/ck",
                // 方法引用 类::类方法
                SparkStreamingWordCount::createJssc);
        // 设置日志输出级别
        jssc.sparkContext().setLogLevel("ERROR");

        // 设置检查点
        jssc.checkpoint("/opt/temp/ck");


        // 连接socket服务，参数 socket服务地址、端口、存储级别(我们这里使用默认的)
        JavaReceiverInputDStream<String> dStream = jssc.socketTextStream("192.168.43.2", 9999);

        JavaDStream<String> wordsDS = dStream.flatMap(
                line -> Arrays.asList(line.split(" ")).iterator());
        JavaPairDStream<String, Integer> wordToOneDS = wordsDS.mapToPair(
                word -> new Tuple2<>(word, 1));
        JavaPairDStream<String, Integer> wordCountDS = wordToOneDS.reduceByKey((x, y) -> (x + y));

        wordCountDS.print();

        // 如果想要关闭采集器，那么需要创建一个新线程
        // 而且需要第三方程序增加关闭状态
        new Thread(new MonitorStop(jssc)).start();
        jssc.start();
        jssc.awaitTermination();  // block 阻塞main线程
    }
}
```

打包上传至服务器运行

```shell
[root@kk01 temp]# /opt/software/spark-local/bin/spark-submit --class com.clear.close.SparkStreamingWordCount --master local /opt/temp/spark-streaming-demo-1.
0.jar
```

监听端口，输入如下命令

```shell
C:\Users\没事我很好>nc -lp 9999
hello
hello
hello
hello
hello
hello
```

结果如下（SparkStreaming程序正常运行）

```diff
-------------------------------------------
Time: 1684069851000 ms
-------------------------------------------
(hello,2)

-------------------------------------------
Time: 1684069854000 ms
-------------------------------------------
(hello,3)

-------------------------------------------
Time: 1684069857000 ms
-------------------------------------------
(hello,1)

-------------------------------------------
Time: 1684069860000 ms
-------------------------------------------

```

接着我们在Hadoop上创建目录，如下

```shell
[root@kk02 ~]# hadoop fs -mkdir /clear/stop_sparkStreaming
```

程序就终止了

```shell
-------------------------------------------
Time: 1684069881000 ms
-------------------------------------------

23/05/14 09:11:21 ERROR ReceiverTracker: Deregistered receiver for stream 0: 
Stopped by driver
```

如果程序运行报错如下

```diff
Exception in thread "main" org.apache.spark.SparkException: org.apache.spark.streaming.dstream.ShuffledDStream@7c8c70d6 has not been initialized
```

这就说明hdfs/本地已经有 /opt/temp/ck 这个文件了，删除或换个名字再重新运行即可。若 creatingFunc 函数中也有checkpoint定义，则也需要一并删除或更名。



### 服务策略

即提供一个restful服务，暴露出一个接口提供关闭功能。

```scala
def httpServer(port:Int,ssc:StreamingContext)={
    val server = new Server(port)
    val context = new ContextHandler()
    context.setContextPath("/shutdown")
    context.setHandler( new CloseStreamHandler(ssc) )
    server.setHandler(context)
    server.start()
}
class CloseStreamHandler(ssc:StreamingContext) extends AbstractHandler {
    override def handle(s: String, baseRequest: Request, req: HttpServletRequest, response: HttpServletResponse): Unit ={
      ssc.stop(true,true)
      response.setContentType("text/html; charset=utf-8");
      response.setStatus(HttpServletResponse.SC_OK);
      val out = response.getWriter();
      baseRequest.setHandled(true);
    }
  }
```



# Spark Streaming性能调优 

-   对于receiver模式的处理，可以调高receiver的数量，提高并行度

-   对于每一批的RDD进行调优，因为RDD的分区和每一个batch里面的block有关，比如batch的间隔是2s,也就是JavaStreamingContext(sparkConf, Durations.seconds(2))，这里就是设置拉去batch的时间，每一批batch里面有若干的block，每一个block产生的时间是200毫秒，每一个block对应RDD的一个分区，这里调优的地方就是如果你的CPU有8核，但是如果你每一批的数据就是5个block的话，那么就是没有充分的利用cpu我们这个时候就可以对于block产生的时间减少

-   对于Kafka的Direct模式的话，我们只要设置的并行度和分区一样就可以了
    -   使用CMS垃圾回收器，减少gc的时间，提高batch的处理速度
        