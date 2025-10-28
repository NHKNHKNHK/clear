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

    

### DStream

离散数据流（DStream）是Spark Streaming最基本的抽象。它代表了一种连续的数据流，要么从某种数据源提取数据，要么从其他数据流映射转换而来。

**DStream内部是由一系列连续的RDD组成的**，每个RDD都包含了特定时间间隔内的一批数据。

DStream表示连续的数据流，可以通过Kafka、Flume、Kinesis等数据源创建，也可以通过现有的 DStream的高级操作来创建。

在内部，**DStream由一系列连续的rdd表示**，这是Spark对不可变的分布式数据集的抽象。**DStream中的每个RDD都包含一定时间间隔的数据**

-   Dstream是Spark Streaming的数据抽象，同DataFrame，其实底层依旧是RDD。

-   在DStream上应用的任何操作都转换为在底层rdd上的操作。

-   这些底层RDD转换是由Spark引擎计算的。DStream操作隐藏了大部分细节，并为开发人员提供了更高级的API。



## DStream 编程模型

​	在Spark Streaming中，**将实时的数据分解成一系列很小的批处理任务**（前面我们也说过Spark Straming其实是准实时、微批次的）。批处理引擎 Spark Core 把**输入的数据按照一定的时间片**（比如说1s）**分成一段一段的数据**，**每一段数据都会转换成 RDD** 输入到 Spark Core中，然后将DStream操作转换为 RDD算子的相关操作，即转换操作、窗口操作以及输出操作。RDD算子操作产生的中间结果数据会保存在内存中，也可以将中间的结果数据输出到外部存储系统中进行保存。

