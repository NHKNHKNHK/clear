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

