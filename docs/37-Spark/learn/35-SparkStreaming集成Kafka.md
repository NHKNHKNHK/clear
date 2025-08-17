# SparkStreaming集成Kafka

## Kafka核心概念回顾

Kafka 是一个分布式的基于发布/订阅模式的消息队列（Message Queue），主要应用与大数据实时处理领域。 

-   消息队列：Kafka 本质上是一个 MQ（Message Queue），使用消息队列的好处？（面试会问）： 
    -   解耦：允许我们独立的扩展或修改队列两边的处理过程； 

    -   可恢复性：即使一个处理消息的进程挂掉，加入队列中的消息仍可以在系统恢复后被处理； 

    -   缓冲：有助于解决生产消息和消费消息的处理速度不一致的情况； 

    -   灵活性&峰值处理能力：不会因为突发的超负荷的请求而完全崩溃，消息队列能够使关键组件顶住突发的访问压力； 

    -   异步通信：消息队列允许用户把消息放入队列但不立即处理它； 

-   发布/订阅模式

    一对多，生产者将消息发布到 Topic 中，有多个消费者订阅该主题，发布到 Topic 的消息会被所有订阅者消费，被消费的数据不会立即从 Topic 清除

Kafka 存储的消息来自任意多被称为 Producer 生产者的进程，数据从而可以被发布到不同的 Topic 主题下的不同 Partition 分区。在一个分区内，这些消息被索引并连同时间戳存储在一起。 其它被称为 Consumer 消费者的进程可以从分区订阅消息。

Kafka 运行在一个由一台或多台服务器组成的集群上，并且分区可以跨集群结点分布。

Kafka 一些重要概念：

-   1）Producer： 消息生产者，向 Kafka Broker 发消息的客户端； 

-   2）Consumer：消息消费者，从 Kafka Broker 取消息的客户端； 
-   3）Consumer Group：消费者组（CG），消费者组内每个消费者负责消费不同分区的数据，提高消费能力。一个分区只能由组内一个消费者消费，消费者组之间互不影响。所有的消费者都属于某个消费者组，即消费者组是逻辑上的一个订阅者； 
-   4）Broker：一台 Kafka 机器就是一个 Broker。一个集群由多个 Broker 组成。一个 Broker 可以容纳多个 Topic； 
-   5）Topic：可以理解为一个队列，Topic 将消息分类，生产者和消费者面向的是同一个 Topic； 
-   6）Partition：为了实现扩展性，提高并发能力，一个非常大的 Topic 可以分布到多个 Broker  （即服务器）上，一个 Topic 可以分为多个 Partition，每个 Partition 是一个 有序的队列； 
-   7）Replica：副本，为实现备份的功能，保证集群中的某个节点发生故障时，该节点上的 Partition 数据不丢失，且 Kafka 仍然能够继续工作，Kafka 提供了副本机制，一个 Topic 的每个分区都有若干个副本，一个 Leader 和若干个 Follower；
-   8）Leader：每个分区多个副本的“主”副本，生产者发送数据的对象，以及消费者消费数据的对象，都是 Leader； 
-   9）Follower：每个分区多个副本的“从”副本，实时从 Leader 中同步数据，保持和 Leader 数据的同步。Leader 发生故障时，某个 Follower 还会成为新的 Leader； 
-   10）Offset：消费者消费的位置信息，监控数据消费到什么位置，当消费者挂掉再重新恢复的时候，可以从消费位置继续消费； 
-   11）Zookeeper：Kafka 集群能够正常工作，需要依赖于 Zookeeper，Zookeeper 帮助 Kafka 存储和管理集群信息；



## 集成的方式

​	Kafka 是一个分布式流处理平台，主要用于处理实时流数据。而 SparkStreaming 是基于 Spark 的流式处理框架，可以处理实时数据流。SparkStreaming 可以集成 Kafka，实现对 Kafka 消息的实时处理。

Spark Streaming与Kafka集成，有两套API，原因在于Kafka Consumer API有两套，文档： 

http://spark.apache.org/docs/2.4.5/streaming-kafka-integration.html

-   方式一：Kafka 0.8.x版本 
    -   老的 Old Kafka Consumer API 
    -   文档：http://spark.apache.org/docs/2.4.5/streaming-kafka-0-8-integration.html 
    -   老的Old消费者API，有两种方式： 
        -   第一种：高级消费API（Consumer High Level API），**Receiver** 接收器接收数据 
        -   第二种：简单消费者API(Consumer Simple Level API) ，**Direct** 直接拉取数据 
-   方式二：Kafka 0.10.x版本  （**从 0.10 开始稳定被使用**）
    -   新的 New Kafka Consumer API 
    -   文档：http://spark.apache.org/docs/2.4.5/streaming-kafka-0-10-integration.html 
    -   核心API：KafkaConsumer、ConsumerRecorder





​	在 SparkStreaming 中，我们可以**通过 KafkaUtils 来整合 Kafka**。KafkaUtils 提供了两种方式来创建数据流：KafkaUtils.createStream 和 KafkaUtils.createDirectStream。

-   利用 Kafka 的Receiver方式进行集成（ **KafkaUtils.createStream**）

-   利用 Kafka 的Direct方式进行集成（ **KafkaUtils.createDirectDstream**）

    

Spark Streaming获取kafka数据的两种方式 Receiver 与Direct 的方式，可以从代码中简单理解成**Receiver方式是通过zookeeper来连接kafka队列**，**Direct方式是直接连接到kafka的节点上获取数据**了。

-   **Receiver API**：需要一个专门的Executor去接收数据，然后发送给其他的Executor做计算。存在的问题，接收数据的Executor和计算的Executor速度会有所不同，特别在接收数据的Executor速度大于计算的Executor速度，会导致计算数据的节点内存溢出。**早期版本中提供此方式，当前版本不适用**
-   **Direct API**：是由计算的Executor 来主动消费Kafka的数据，速度由自身控制。



## 两种集成方式区别 

使用 **Kafka Old Consumer API**集成两种方式，虽然实际生产环境使用Direct方式获取数据，但是在面试的时候常常问到两者区别。 

文档：http://spark.apache.org/docs/2.4.5/streaming-kafka-0-8-integration.html 

-   Receiver-based Approach： 

    -   基于接收器方式，消费Kafka Topic数据，但是企业中**基本上不再使用；** 

    -   Receiver作为常驻的Task运行在Executor等待数据，但是一个Receiver效率低，需要开启多个，再手动合并数据(union)，再进行处理，很麻烦； 
    -   Receiver那台机器挂了，可能会丢失数据，所以需要开启WAL(预写日志)保证数据安全，那么效率又会降低； 
    -   Receiver方式是通过zookeeper来连接kafka队列，调用Kafka高阶API，offset存储在zookeeper，由Receiver维护； 
    -   Spark在消费的时候为了保证数据不丢也会在Checkpoint中存一份offset，可能会出现数据不一致； 

-   Direct Approach (No Receivers)： 
    -   直接方式，Streaming中每批次的每个job直接调用Simple Consumer API获取对应Topic 数据，此种方式使用最多，面试时被问的最多； 

    -   Direct方式是直接连接kafka分区来获取数据，从每个分区直接读取数据大大提高并行能力 

    -   **Direct方式调用 Kafka低阶API(底层API)，offset自己存储和维护**，默认由Spark维护在 checkpoint中，消除了与zk不一致的情况； 

    -   当然也可以自己手动维护，把offset存在MySQL、Redis和Zookeeper中；



## 集成Kafka 0.8.x

### Kafka 0.8 Receiver模式（sparkstreaming2.2以前）

KafkaUtils.createStream 方式（即基于 Receiver 的方式），主要是通过Zookeeper 连接 Kafka，receiver 接收器从Kafka中读取数据，并且所有 receivees 获取得到的数据都会保存在Spark executors中，然后通过Spark Streaming 启动 job来处理这些数据。

当Driver处理Spark executors中的job时，默认是会出现数据丢失的情况，此时如果启动 WAL 日志将接收到的数据同步地保存在分布式文件系统上（如HDFS），当数据由于某种原因丢失时，丢失的数据就能够及时恢复。

需要注意：

​	**当前版本不适用**

1）导入依赖（需要注意，0-8版本的依赖与0-10是不一样的，如果需要使用0-10则需要另外导入）

```xml
<!-- Spark Streaming 集成Kafka 0.8.2.1 -->
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
import org.apache.spark.streaming.api.java.JavaPairReceiverInputDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.apache.spark.SparkConf;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.kafka.KafkaUtils;

import scala.Tuple2;

import java.util.*;

/**
 * 基于Kafka 0-8 Receiver 模式和 SparkStreaming集成
 */
// fixme 代码编译不通过
public class SparkStreaming_Kafka_createStream {
    public static void main(String[] args) throws InterruptedException {
        SparkConf sparkConf = new SparkConf()
                .setAppName("SparkStreaming_Kafka_createStream")
                .setMaster("local[2]")
                // 开启 WAL 预写日志，用与保存数据源，数据丢失时，可以用户数据恢复
                .set("spark.streaming.receiver.writeAheadLog.enable", "true");
        // 创建 Spark Streaming 上下文
        JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(5));

        jssc.sparkContext().setLogLevel("WARN");
        // 设置 checkpoint
        jssc.checkpoint("./kafka_receiver");

        String broker = "kk01:9092,kk02:9092,kk03:9092";
        String groupId = "spark-receiver";
        // 定义topic相关信息
        Map<String, Integer> topics = new HashMap<>();
        // todo 这里的 1 不是topic分区数，而是topic中每个分区被 1 个线程消费
        topics.put("kafka_spark", 1);

        // 创建 Kafka 数据流
        // todo 通过 High Lever API 将 kafka与  spark streaming 整合
        /**
         * 官方文档：
         *  JavaPairReceiverInputDStream<String, String> kafkaStream =
         *      KafkaUtils.createStream(streamingContext,
         *      [ZK quorum], [consumer group id], [per-topic number of Kafka partitions to consume]);
         */
        JavaPairReceiverInputDStream<String, String> receiverDStream = KafkaUtils.createStream(
                jssc,
                broker,
                groupId, topics
        );

        // 手动合并所有receiver中的数据
//        jssc.union(receiverDStream);
        // 处理数据流
        receiverDStream.foreachRDD(rdd -> {
                    // 处理消息
                    // 读取 Kafka 数据创建 DStream(基于Receive方式)
                    rdd.flatMap(msg -> {
                                String[] words = msg._2.split(" ");
                                return Arrays.asList(words).iterator();
                            }
                    ).mapToPair(word ->
                            new Tuple2<>(word, 1)
                    ).reduceByKey((item, tmp) ->
                            item + tmp
                    ).foreach(System.out::println);
                }
        );

        // 启动 Spark Streaming
        jssc.start();
        jssc.awaitTermination();
    }
}
```

不推荐使用说明：

​	如果我们使用 KafkaUtils.createStream 这种方式时，一开始系统可以正常运行，没有任何问题，但是如果系统出现异常，重启 SparkStreaming 程序后，则**发现程序重复消费已经消费过的数据**。

​	这是由于这种方式使用的是 High Level  Consumer API，topic 的 offset 由 zookeeper管理。虽然配合着 WAL 可以实现数据的零丢失的高可靠性，但是却无法保证数据只被处理过一次

​	例如：sparkstreaming程序处理过了一条数据，系统出现异常还未来得及更新zookeeper中报错的offset，系统恢复正常以后，kafka认为这条消息没有被消费过，因此再次发送这条消息，这样该条消息就被消费了两次。

### 基于Kafka 0-8 Direct模式（弃用）

KafkaUtils.createDirectStream 方式不同与 KafkaUtils.createStream 方式，**当接收数据时，Direct方式会定期地从 kafka topic 对应 partition 中查询最新的 offset，再根据 offset范围，在每个batch 里面处理数据，然后spark 通过调用 kafka 的 Simple Level  Consumer API 来读取一定范围的数据**。

当Driver处理Spark executors中的job时，系统突然出现异常，重启 SparkStreaming 程序后。程序会重复处理已经处理过的数据，无法保证数据只被处理过一次，此时，如果通过spark中streamingContext对象将 offset 保存到 CheckPoint 中，就可以避免因 Spark Streaming 和 Zookeeper 不同步（即二者保存的 offset 不一致）导致的数据重复消费了。

使用Kafka Old Consumer API方式集成Streaming，采用Direct方式，调用Old Simple  Consumer API，文档：

http://spark.apache.org/docs/2.4.5/streaming-kafka-0-8-integration.html#approach-2-direct-approach-no-receivers

Direct方式没有receiver层，其会周期性的获取Kafka中每个topic的每个partition中的最新 offsets，再根据设定的maxRatePerPartition来处理每个batch。较于Receiver方式的优势： 

-   其一 **简化的并行**：Kafka中的partition与RDD中的partition是一一对应的并行读取Kafka数据； 

-   其二 **高效**：no need for Write Ahead Logs； 

-   其三 **精确一次**：直接使用simple Kafka API，Offsets则利用Spark Streaming的checkpoints进行记录。

**需要注意：当前版本不适用**

1）导入依赖（需要注意，0-8版本的依赖与0-10是不一样的，如果需要使用0-10则需要另外导入）

```xml
<!-- Spark Streaming 集成Kafka 0.8.2.1 -->
<dependency>
	<groupId>org.apache.spark</groupId>
    <artifactId>spark-streaming-kafka-0-8_2.11</artifactId>
    <version>2.3.2</version>
</dependency>
```

2）Scala API 说明

```scala
def createDirectStream[
    // 表示 kafka topic中每条消息中key value的类型，都为 String
    K: ClassTag,
    V: ClassTag,
    // 在Kafka中将数据保存在文件中，需要编码操作针对字符串编码：StringDecoder
    KD <: Decoder[K]: ClassTag,
    VD <: Decoder[V]: ClassTag] (
    ssc: StreamingContext,
    kafkaParams: Map[String, String],	// Kafka Consumer 属性配置
    topics: Set[String]	// 消费的topic名称
): InputDStream[(K, V)]
```

3）编写代码

```java
package com.clear.kafka;

import kafka.serializer.StringDecoder;
import org.apache.commons.lang3.time.FastDateFormat;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.*;
import org.apache.spark.streaming.kafka.KafkaUtils;
import scala.Tuple2;

import java.util.*;

/**
 * 基于Kafka 0-8 Direct 模式和 SparkStreaming集成
 */
// fixme 代码编译不通过
public class SparkStreaming_Kafka_createDirectStream {
    public static void main(String[] args) throws InterruptedException {
        SparkConf sparkConf = new SparkConf()
                .setAppName(SparkStreaming_Kafka_createDirectStream.class.getSimpleName())
                .setMaster("local[2]");

        // 创建 Spark Streaming 上下文
        JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(5));

        jssc.sparkContext().setLogLevel("WARN");
        // 设置 checkpoint
        jssc.checkpoint("./kafka_receiver");

        String brokers = "kk01:9092,kk02:9092,kk03:9092";
        String groupId = "spark-receiver";

        // 设置 Kafka 相关参数参数
        Map<String, String> kafkaParams = new HashMap<>();
        kafkaParams.put("metadata.broker.list", brokers);
        // key-value序列化
        kafkaParams.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
                "org.apache.kafka.common.serialization.StringSerializer");
        kafkaParams.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
                "org.apache.kafka.common.serialization.StringSerializer");
        // 设置消费者组
        kafkaParams.put("group.id", groupId);

        // 定义 topic
        Set<String> topics = new HashSet<>();
        topics.add("kafka_spark");


        // 创建 Kafka 数据流
        // todo 通过 Simple Lever API 将 kafka与  spark streaming 整合
        /**
         * 官方文档：
         * JavaPairInputDStream<String, String> directKafkaStream =
         *      KafkaUtils.createDirectStream(streamingContext,
         *          [key class], [value class], [key decoder class], [value decoder class],
         *          [map of Kafka parameters], [set of topics to consume]);
         */
        /**
         *   def createDirectStream[K, V, KD <: Decoder[K], VD <: Decoder[V]](
         *       jssc: JavaStreamingContext,
         *       keyClass: Class[K],
         *       valueClass: Class[V],
         *       keyDecoderClass: Class[KD],
         *       valueDecoderClass: Class[VD],
         *       kafkaParams: JMap[String, String],
         *       topics: JSet[String]
         *     ): JavaPairInputDStream[K, V]
         */
        JavaPairInputDStream<String, String> directStream = KafkaUtils.createDirectStream(
                jssc,
                String.class,
                String.class,
                StringDecoder.class,
                StringDecoder.class,
                kafkaParams,
                topics
        );

        // 获取 Kafka 中 topic 的数据：对接收每批次流式数据，进行词频统计WordCount
        JavaPairDStream<String, Integer> resultDStream = directStream.transformToPair(rdd -> {
                    // 处理消息
                    // 读取 Kafka 数据创建 DStream
                    JavaPairRDD<String, Integer> wordCountRDD = rdd.flatMap(msg -> {
                                String[] words = msg._2.split(" ");
                                return Arrays.asList(words).iterator();
                            }
                    ).mapToPair(word ->
                            new Tuple2<>(word, 1)
                    ).reduceByKey((item, tmp) ->
                            item + tmp
                    );
                    return wordCountRDD;
                }
        );


        resultDStream.foreachRDD((resultRDD, batchTime) -> {    // batchTime 表示每批次时间
            // 使用lang3包下FastDateFormat日期格式类，属于线程安全的
            // 将 batchTime进行转换，转换为 yyyy-MM-dd HH:mm:ss
            String formatted = FastDateFormat.getInstance("yyyy-MM-dd HH:mm:ss").format(batchTime.milliseconds());
            System.out.println("-------------------------------------------");
            System.out.println("Time: " + formatted);
            System.out.println("-------------------------------------------");
            // 判断结果RDD是否有数据，没有数据则不打印
            if (!resultRDD.isEmpty()) {
                // todo 针对RDD数据进行输出，在SparkCore在如何操作，此处就如何操作
                resultRDD.coalesce(1).foreachPartition(iter ->
                        // 遍历输出
                        iter.forEachRemaining(System.out::println));
                // 等同于
                // iter.forEachRemaining(item -> System.out.println(item)));
            }
        });

        // 启动 Spark Streaming
        jssc.start();  // 启动接收器Receivers，作为Long Running Task（线程） 运行在Executor
        jssc.awaitTermination();
    }
}
```



### 总结 Receiver 与 Direct 方式

#### **Receiver 方式**

-   ==数据是从Kafka 推送（push）到Receiver==

-   receiver模式采用了Received接收器模式，需要一个线程一直接收数据，将数据接收到Executor中默认存储级别为 **MEMORY_AND_DISK_SER_2。**

-   receiver模式自动**使用zookeeper管理消费数据offset**

-   receiver模式底层读取Kafka 采用 **High Lever Consumer API**实现，这种模式不关心offset，只要数据

-   receiver模式当Driver挂掉时，**有丢失数据的风险**，可以**开启 WAL 机制避免丢失数据**，但是开启后加大了数据处理延迟，并且**存在数据重复消费的风险**。

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



#### **Direct 方式**

-   ==直接从topic的各个分区拉取（pull）数据==

-   周期性地查询kafka，来获得每个 topic + partition的最新的offset，并且**主动的进行拉取数据**。（因为direct模式没有使用receiver接收器模式，每批次处理数据直接获取当前批次数据处理）

-   可以简化并行读取：spark会创建跟kafka partition一样多的RDD partition，并且会并行从kafka中读取数据。（即**direct模式并行度与读取的topic的partition一一对应**）

-   高性能：kafka中做了数据复制，可以通过kafka的副本进行恢复。

-   缺点是成本提高且无法通过zookeeper来监控消费者消费情况。

-   这种新的不基于 Receiver 的直接方式，**是在 Spark 1.3 中引入的**。替代掉使用 Receiver 来接收数据后，这种方式会周期性地查询 Kafka，来获得每个 topic + partition 的最新的 offset，从而定义每个 batch 的 offset 的范围。当处理数据的 job 启动时，就会**使用 Kafka 的 Simple Consumer API**来获取 Kafka指定offset范围的数据，**可以手动维护消费者offset**。

-   使用 kafka 的简单 API，**Spark Streaming 自己就负责追踪消费的offset，并保存在checkpoint中**。Spark自己一定是同步的，因此**可以保证数据是消费一次且仅消费一次**。
-   可以使用设置checkpoint的方式管理消费offset，使用 StreamingContext.getOrCreate(ckDIR, CreateStreamingContext) 恢复

注意：

采用Direct方式消费数据时，需要设置每批次处理数据的最大量，防止【波峰】时数据太多，导致批次数据处理有性能问题：

```java
spark.streaming.kafka.maxRatePerPartition

// 含义：Topic中每个分区每秒中消费数据的最大值

举例说明：
	BatchInterval：5s、Topic-Partition：3、maxRatePerPartition： 10000
	最大消费数据量：10000 * 3 * 5 = 150000 条
```

**这种方法相较于Receiver方式的优势在于：**

-   **1）简化的并行度(Simplified Parallelism)**：
    -   在Receiver的方式中我们提到创建多个Receiver之后利用union来合并成一个Dstream的方式提高数据传输并行度。
    -   而在Diret方式中，**Kafka中的partition与RDD中的partition是一一对应的并行读取Kafka数据**，这种映射关系也更利于理解和优化。
        -   读取topics的总的分区数目 = 每批次RDD中分区数目； 
        -   topic中每个分区数据 被读取到 RDD中每个分区进行处理

*   **2）高效(Efficiency)**
    *   在Receiver的方式中，为了达到0数据丢失需要将数据存入Write Ahead Log(WAL)中，这样在Kafka和日志中就保存了两份数据，浪费！
    *   而Direct方式不存在这个W问题，只要我们Kafka的数据保留时间足够长，我们都能够从Kafka进行数据恢复。
    *   因此，no need for Write Ahead Logs（不需要WAL）

-   **3）正好一次（Exactly-once semantics）**
    -   在Receiver的方式中，使用的是Kafka的 High Lever Consumer API 从Zookeeper中获取offset值，这也是传统的从Kafka中读取数据的方式，但由于Spark Streaming消费的数据和Zookeeper中记录的offset不同步，这种方式偶尔会造成数据重复消费。
    -   而**第二种方式（dircet方式），直接使用了 Kafka 的 Simple Consumer API，Offsets则利用Spark Streaming的checkpoints进行记录，消除了这种不一致性。**
    -   第二种方式能保证一次性语义，从Kafka消费数据仅仅被消费一次，不会重复消费或者不消费 
    -   在Streaming数据处理分析中，需要考虑数据是否被处理及被处理次数，称为消费语义 
        -   At most once：最多一次，比如从Kafka Topic读取数据最多消费一次，可能出现不消费，此时数据丢失； 
        -   At least once：至少一次，比如从Kafka Topic读取数据至少消费一次，可能出现多次消费数据； 
        -   Exactly once：精确一次，比如从Kafka topic读取数据当且仅当消费一次，不多不少，最好的状态 

| 实现方式          | 消息语义      | 存在的问题                                     |
| ----------------- | ------------- | ---------------------------------------------- |
| Receiver          | At most once  | 会丢失数据                                     |
| Receiver + WAL    | At least once | 不会丢失数据，但可能重复消费数据，且效率低     |
| Direct + 手动操作 | Exactly once  | **不会丢失数据，也不会重复消费数据，且效率高** |

请注意，Direct方式的一个缺点是它不会更新Zookeeper中的偏移量，因此基于Zookeeper的Kafka监视工具将不会显示进度。但是，您可以在每个批处理中访问此方法处理的偏移量，并自行更新Zookeeper

## 集成Kafka 0.10.x

使用Kafka 0.10.+ 提供新版本Consumer API集成Streaming，实时消费Topic数据，进行处理

文档：http://spark.apache.org/docs/2.2.0/streaming-kafka-0-10-integration.html

### Kafka 0-10 Direct模式（推荐使用）

​	Kafka 0.10 的Spark Streaming集成提供了简单的并行性，Kafka分区和Spark分区之间的1:1对应，以及对偏移量和元数据的访问。然而，由于新的集成使用了新的Kafka消费者API而不是简单的API，所以在使用上有明显的差异。

**1）导入pom依赖**

```xml
<!-- Spark Streaming 与 Kafka 0.10.0 集成依赖-->
<dependency>
	<groupId>org.apache.spark</groupId>
    <artifactId>spark-streaming-kafka-0-10_2.13</artifactId>
    <version>3.2.0</version>
</dependency>
```

注意：

​	不要手动添加org.apache.kafka工件(例如kafka-clients)的依赖项。**spark-streaming-kafka-0-10工件已经具有适当的传递依赖关系**，并且不同版本可能以难以诊断的方式不兼容。

目前企业中基本都使用New Consumer API集成，优势如下： 

-   **1）类似 Old Consumer API中Direct方式** 

    -   直接到Kafka Topic中依据偏移量范围获取数据，进行处理分析； 

    -   The Spark Streaming integration for Kafka 0.10 is similar in design to the 0.8 Direct  Stream approach； 

-   **2）简单并行度1:1** 
    -   每批次中RDD的分区与Topic分区一对一关系； 
    -   It provides simple parallelism, 1:1 correspondence between Kafka partitions and Spark  partitions, and access to offsets and metadata； 
    -   获取Topic中数据的同时，还可以获取偏移量和元数据信息； 

**2）编写代码**

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
package com.clear.kafka;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.commons.lang3.time.FastDateFormat;
import org.apache.spark.api.java.JavaPairRDD;
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


public class SparkStreaming_KafkaToWordCount_createDirectStream {
    public static void main(String[] args) throws Exception {
        // 创建 SparkConf 对象 setMaster中 提供的核数必须 >=2 或 *
        SparkConf sparkConf = new SparkConf().setAppName("SparkStreamToKafka").setMaster("local[*]");
        // 创建 StreamingContext 对象，采集周期5s
        JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(5));

        jssc.sparkContext().setLogLevel("WARN");  // 调整日志输出级别，方便看到结果

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
        List<String> topics = Arrays.asList("kafka_spark");

        // todo 读取Kafka中的数据创建 DStream
        // 注意，KafkaUtils 是在 org.apache.spark.streaming.kafka010.KafkaUtils 包下
        JavaInputDStream<ConsumerRecord<String, String>> inputDStream = KafkaUtils.createDirectStream(
                jssc,
                // 本地化策略：将Kafka中的数据均与的分配到各个Executor中
                // 注意  org.apache.spark.streaming.kafka010.LocationStrategies
                LocationStrategies.PreferConsistent(),
                // 消费策略：表示要从Kafka进行消费数据（offset谁来管理，从哪个位置开始消费数据）
                // 注意 org.apache.spark.streaming.kafka010.ConsumerStrategies
                ConsumerStrategies.<String, String>Subscribe(topics, kafkaParams)
        );

        // 对源数据进行处理：计算wordCount
        JavaPairDStream<String, Integer> resultDStream = inputDStream.transformToPair(rdd -> {
            JavaPairRDD<String, Integer> resultRDD = rdd.flatMap(new FlatMapFunction<ConsumerRecord<String, String>, String>() {
                        @Override
                        public Iterator<String> call(ConsumerRecord<String, String> record) throws Exception {
                            return Arrays.asList(record.value().split("\\s+")).iterator();
                        }
                    }).mapToPair(word -> new Tuple2<>(word, 1))
                    .reduceByKey((item, tmp) -> item + tmp);
            return resultRDD;
        });

        resultDStream.foreachRDD((resultRDD, batchTime) -> {    // batchTime 表示每批次时间
            // 使用lang3包下FastDateFormat日期格式类，属于线程安全的
            // 将 batchTime进行转换，转换为 yyyy-MM-dd HH:mm:ss
            String formatted = FastDateFormat.getInstance("yyyy-MM-dd HH:mm:ss").format(batchTime.milliseconds());
            System.out.println("-------------------------------------------");
            System.out.println("Time: " + formatted);
            System.out.println("-------------------------------------------");
            // 判断结果RDD是否有数据，没有数据则不打印
            if (!resultRDD.isEmpty()) {
                // todo 针对RDD数据进行输出，在SparkCore在如何操作，此处就如何操作
                resultRDD.coalesce(1).foreachPartition(iter ->
                        // 遍历输出
                        iter.forEachRemaining(System.out::println));
                // 等同于
                // iter.forEachRemaining(item -> System.out.println(item)));
            }
        });

        // 开启任务
        jssc.start();
        jssc.awaitTermination();
    }
}
```

注意：

​	如果您的Spark批处理持续时间大于默认的Kafka心跳会话超时(30秒)，请适当增加 **heartbeat.interval.ms 和session.timeout.ms**。对于大于5分钟的批处理，这将需要在代理上更改 group.max.session.timeout.ms。

工具类KafkaUtils中createDirectStream函数API使用说明（函数声明）：

```scala
package org.apache.spark.streaming.kafka010


def createDirectStream[K, V](	// Java调用的
    jssc: JavaStreamingContext,
    locationStrategy: LocationStrategy,
    consumerStrategy: ConsumerStrategy[K, V]
): JavaInputDStream[ConsumerRecord[K, V]] = {
    new JavaInputDStream(
        createDirectStream[K, V](
            jssc.ssc, locationStrategy, consumerStrategy))
}

// Scala
def createDirectStream[K, V](	
    ssc: StreamingContext,
    locationStrategy: LocationStrategy,
    consumerStrategy: ConsumerStrategy[K, V]
): InputDStream[ConsumerRecord[K, V]]



ssc: StreamingContext
//  StreamingContext对象


locationStrategy: LocationStrategy	// 位置策略
// 新的Kafka消费者API将把消息预取到缓冲区中。因此，出于性能考虑，Spark集成将缓存的消费者保留在执行器上(而不是为每个批处理重新创建它们)是很重要的，并且更倾向于在具有适当消费者的主机位置上调度分区。 
// 在大多数情况下，您应该使用LocationStrategies。
// 如上所示。这将在可用的执行器之间均匀地分配分区。如果你的执行者和你的Kafka代理在同一个主机上，使用PreferBrokers，它会优先在Kafka leader上为该分区调度分区。
// 最后，如果分区之间的负载有明显的倾斜，请使用PreferFixed。这允许您指定分区到主机的显式映射(任何未指定的分区将使用一致的位置)。 
// 消费者缓存的默认最大大小为64。如果你希望处理超过(64 *执行器数量)的Kafka分区，你可以通过spark.streaming.kafka.consumer.cache.maxCapacity来改变这个设置。 
// 如果你想禁用Kafka消费者的缓存，你可以将spark.streaming.kafka.consumer.cache.enabled设置为false。 
//缓存由topicpartition和group键控制。Id，所以使用单独的组。每个调用createDirectStream。
    
    
consumerStrategy: ConsumerStrategy[K, V]   	// 消费策略
// 新的Kafka消费者API有许多不同的方式来指定主题，其中一些需要大量的对象实例化后设置。ConsumerStrategies提供了一个抽象，允许Spark即使在从检查点重新启动后也能获得正确配置的消费者。 
// ConsumerStrategies。如上所示，订阅允许您订阅固定的主题集合。SubscribePattern允许您使用正则表达式来指定感兴趣的主题。
// 注意，与0.8集成不同，使用Subscribe或SubscribePattern应该在运行流期间响应添加分区。最后，Assign允许您指定一个固定的分区集合。这三种策略都有重载的构造函数，允许您为特定分区指定起始偏移量。 
// 如果您有上述选项无法满足的特定消费者设置需求，那么ConsumerStrategy是一个您可以扩展的公共类。
```

