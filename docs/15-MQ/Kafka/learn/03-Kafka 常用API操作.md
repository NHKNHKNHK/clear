# Kafka常用API操作

## 0 Kakfa核心 API 介绍

通过调用 Kafka API 操作 Kafka集群，其核心API主要包括一下5种：

- Producer API（生产者API）：构建应用程序发送数据流到 Kafka 集群中的主题
- Consumer API（消费者API）：构建应用程序从 Kafka集群 中的主题读取数据流
- Streams API：构建流处理程序的库，能够处理流式数据
- Connect API：实现连接器，用于在 Kafka 和其他系统之间可扩展的、可靠的流式传输数据的工具。
- AdminClient API：构建集群**管理**工具，查看 Kafka 集群组件信息

要想使用这些API，就需要在pom中导入相关依赖

```xml
<dependencies>
	<!--2.13为scala版本，3.0.0为Kafka版本-->
    <dependency>
    	<groupId>org.apache.kafka</groupId>
        <artifactId>kafka_2.13</artifactId>
        <version>3.0.0</version>
    </dependency>
    
    <!--
	<dependency>
         <groupId>org.apache.kafka</groupId>
         <artifactId>kafka_clients</artifactId>
         <version>3.0.0</version>
    </dependency>
	-->
</dependencies>
```

## 1 Producer API

Producer API是Apache Kafka提供的一组API，用于向Kafka集群发送消息。

通过Producer API，可以将消息发送到指定的topic中，并且可以指定消息的 key 和 value。

Producer API**支持异步和同步发送消息**，同时**还支持消息的压缩和批量发送**等功能。

使用Producer API发送消息的**基本流程**如下：

- 创建一个 Producer 实例
    - 配置Producer的属性，如Kafka集群地址、序列化器等。
- 创建一个 ProducerRecord 对象
    - 指定要发送的消息的topic、key和value。
- 调用 Producer 的 send() 方法发送消息
    - 可以选择同步或异步发送。
    - 如果选择异步发送，可以注册一个回调函数，用于处理发送结果
- 关闭Producer实例，释放资源。

#### Scala演示

```scala
package com.clear.kafka.producer

import org.apache.kafka.clients.producer.{Callback, KafkaProducer, ProducerConfig, ProducerRecord, RecordMetadata}
// ProducerConfig：将我们常用的属性以常量的形式定义好了，方便使用

import java.util.Properties

object ProducerLearning 
    def main(args: Array[String]): Unit = {
        // todo 实例化一个Properties对象
        val prop = new Properties()
        // 设置 key-value 序列化类型
        prop.setProperty("key.serializer", "org.apache.kafka.common.serialization.StringSerializer")
        prop.setProperty(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer")
        // 设置broker列表
        prop.setProperty(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "kk01:9092,kk02:9092,kk03:9092")

        // 非必要参数
        // 指定ack应答机制
        //  0 => 生产者不等待分区的ack应答，直接发送下一条数据（即数据发送至内存，还未落盘）
        //  1 => 生产者等待Leader将数据落盘以后，Leader就会向生产者发送ack应答（即数据落盘至Leader）
        //  -1(all) => 分区所有的副本都将数据落盘以后，由Leader向生产者发送ack应答（即Leader、Follower全部落盘）
        prop.setProperty("acks", "all")

        // 指定消息发送失败后重试次数
        prop.setProperty("reties", "3")

        // 设置一个分区的缓存大小
        prop.setProperty("batch.size", "1024")
        // 设置缓冲区总大小
        prop.setProperty("buffer.memory", "10240")
        // 超时等待时间
        prop.setProperty("linger.ms", "10")


        // todo 实例化一个生产者对象：需要设置消息的 Key 和 Value 类型
        // 在Kafka中，一条消息包括三部分：Key、Value、TimeStamp
        val producer: KafkaProducer[String, String] = new KafkaProducer[String, String](prop)

        // todo 发送消息到指定主题
        for (i <- 1 to 100) {
            // 需要发送的消息，需要被封装到 ProducerRecord 对象中
            // topic若不存在，他会自动创建，但是Kafka自动帮我们创建的topic默认只有 一个分区一个副本
            val record: ProducerRecord[String, String] = new ProducerRecord[String, String]("topic-api", s"this is a test message $i ")
            // 异步发送消息的方法
            // 该方法其实没有立即发送消息至Kafka，而是将消息放到了缓冲区。当缓冲区满了以后，或者到达了超时时间，才会将缓冲区中的消息，批量发送至Kafka
            // 批量处理，可以降低网络IO开销

            producer.send(record, new Callback {
                override def onCompletion(metadata: RecordMetadata, exception: Exception): Unit = {
                    if (exception != null) {
                        // 消息发送异常
                        exception.printStackTrace()
                    } else {

                        println("消息发送成功至 " + metadata.topic() + "\t" + metadata.partition() + "\t" + metadata.offset())
                    }
                }
            })
            Thread.sleep(10)
        }

    }
}
```

#### Java演示

```

```


## Consumer API

​	Consumer API是Kafka提供的一个Java API，用于从Kafka集群中消费消息。通过Consumer API，可以订阅一个或多个topic，并从中消费消息。Consumer API支持**多线程消费**、消息的**批量拉取**、消息的**自动提交和手动提交**等功能。

使用Consumer API消费消息的基本流程如下：

- 创建一个Consumer实例，配置Consumer的属性，如Kafka集群地址、消费者组ID等。
- 订阅一个或多个topic，可以使用正则表达式订阅多个topic。
- 调用Consumer的poll()方法拉取消息，可以指定拉取的最大记录数和超时时间。
- 处理拉取到的消息，可以使用多线程处理消息。
- 提交消费位移，可以选择自动提交或手动提交。
- 关闭Consumer实例，释放资源。

```scala
package com.clear.kafka.consumer

import org.apache.kafka.clients.consumer.{ConsumerConfig, ConsumerRecord, ConsumerRecords, KafkaConsumer}

import java.time.Duration
import java.util
import java.util.{Collections, Properties}

object ConsumerLearning {
  def main(args: Array[String]): Unit = {
    // todo 实例化一个Properties对象
    val prop = new Properties()
    // 设置key value反序列化类型
    prop.setProperty(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer")
    prop.setProperty(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer")
    // 设置broker列表
    prop.setProperty(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "kk01:9092,kk02:9092,kk03:9092")
    // todo 必须设置消费者组
    prop.setProperty(ConsumerConfig.GROUP_ID_CONFIG, "api-group")

    // todo 构造一个Consumer对象，需要去指定消费的 Key Value 的类型，需要指定消费者属性
    val consumer: KafkaConsumer[String, String] = new KafkaConsumer[String, String](prop)
    // 订阅主题
    consumer.subscribe(Collections.singletonList("topic-api"))

    // todo 开始循环消费消息
    while (true) {
      // 从kafka中拉取消息
      val records: ConsumerRecords[String, String] = consumer.poll(Duration.ofSeconds(1))
      // 获取迭代器
      val iterator: util.Iterator[ConsumerRecord[String, String]] = records.iterator()
      // 遍历拉取到的所有消息
      while (iterator.hasNext) {
        // 获取到一个消息对象
        val record = iterator.next()
        println(s"topic: ${record.topic()}\tpartition: ${record.partition()}\toffset:${record.offset()}\tkey:${record.key()}\tvalue:${record.value()}")
      }
    }
  }
}
```

### 自定义Offset消费

```scala
package com.clear.kafka.consumer

import org.apache.kafka.clients.consumer.{ConsumerConfig, ConsumerRecords, KafkaConsumer}
import org.apache.kafka.common.TopicPartition

import java.time.Duration
import java.util
import java.util.{Collections, Properties}

object ConsumerLearning2 {
  def main(args: Array[String]): Unit = {
    // todo 实例化一个Properties对象
    val prop = new Properties()
    // 设置key value反序列化类型
    prop.setProperty(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer")
    prop.setProperty(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer")
    // 设置broker列表
    prop.setProperty(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "kk01:9092,kk02:9092,kk03:9092")
    // todo 必须设置消费者组
    prop.setProperty(ConsumerConfig.GROUP_ID_CONFIG, "api-group")

    // 当没有初始的offset（即消费者组中的第一个消费者第一次开始消费数据），或者记录的offset不存在了（消息已经过期被清除了），设置应该从什么位置开始消费
    // 误区：如果你设置为 earliest，并不是每次都从头开始消费
    prop.setProperty(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest")

    // todo 构造一个Consumer对象，需要去指定消费的 Key Value 的类型，需要指定消费者属性
    val consumer: KafkaConsumer[String, String] = new KafkaConsumer[String, String](prop)
    // 订阅主题(订阅的是需要消费的什么主题什么分区)
    // 如果想每次消费都从自己指定的offset开始消费，则使用 assign 方法 而非 subscribe 方法
    consumer.assign(util.Arrays.asList(
      new TopicPartition("topic-api", 0),
      new TopicPartition("topic-api", 1),
      new TopicPartition("topic-api", 2)
    ))
    // 设置消费的位置
    //consumer.seek(new TopicPartition("topic-api", 0), 3)
    //consumer.seek(new TopicPartition("topic-api", 1), 7)
    //consumer.seek(new TopicPartition("topic-api", 1), 11)

    // 设置从头开始消费的主题、分区
    consumer.seekToBeginning(util.Arrays.asList(
      new TopicPartition("topic-api", 0),
      new TopicPartition("topic-api", 1),
      new TopicPartition("topic-api", 2)
    ))
    // 设置从最新位置开始消费的主题、分区
    // consumer.seekToEnd()

    // todo 开始循环消费消息
    while (true) {
      // 从kafka中拉取消息
      val records: ConsumerRecords[String, String] = consumer.poll(Duration.ofSeconds(1))
      // 获取迭代器
      val iterator = records.iterator()
      // 遍历拉取到的所有消息
      while (iterator.hasNext) {
        // 获取到一个消息对象
        val record = iterator.next()
        println(s"topic: ${record.topic()}\tpartition: ${record.partition()}\toffset:${record.offset()}\tkey:${record.key()}\tvalue:${record.value()}")
      }
    }
  }
}
```

### 手动offset管理

为了使我们能够专注于自己的业务逻辑，**Kafka提供了自动提交 offset 的功能**，自动提交 offset的相关参数：

```shell
enable.auto.commit		 是否开启自动提交 offset 的功能（默认开启）
auto.commit.interval.ms 	自动提交 offset 的时间的间隔
```

```scala
prop.setProperty(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG,"true") //该参数默认为true
prop.setProperty(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG,"100")
```

​	虽然自动提交 offset 十分简洁便利，但由于其是基于时间提交的，开发人员很难把握 offset 提交的时机。因此Kafka 还提供了手动提交 offset 的API。

手动提交需要将如下参数设置为false

```shell
prop.setProperty(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG,"false") 
```

手动提交 offset 的方式有两种：

- **commitSync**（同步提交）
- **commitAsync**（异步提交）

两者的相同点是，都会将 **本次 poll 的一批数据最高的偏移量提交**。

不同点是，commitSync 阻塞当前线程，一直提交成功，并且会自动失败重试（由不可控因素导致，也会出现提交失败）；而 commitAsync 则没有失败重试机制，故有可能提交失败

推荐方式：

​	**选用异步提交的方式，效率更高。**

```scala
package com.clear.kafka.consumer

import org.apache.kafka.clients.consumer.{ConsumerConfig, ConsumerRecords, KafkaConsumer}
import org.apache.kafka.common.TopicPartition

import java.time.Duration
import java.util
import java.util.{Collections, Properties}

object ConsumerLearning2 {
  def main(args: Array[String]): Unit = {
    // todo 实例化一个Properties对象
    val prop = new Properties()
    // 设置key value反序列化类型
    prop.setProperty(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer")
    prop.setProperty(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer")
    // 设置broker列表
    prop.setProperty(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "kk01:9092,kk02:9092,kk03:9092")
    // todo 必须设置消费者组
    prop.setProperty(ConsumerConfig.GROUP_ID_CONFIG, "api-group")

    // 当没有初始的offset（即消费者组中的第一个消费者第一次开始消费数据），或者记录的offset不存在了（消息已经过期被清除了），设置应该从什么位置开始消费
    // 误区：如果你设置为 earliest，并不是每次都从头开始消费
    prop.setProperty(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest")

    // todo 关闭自动提交offset
    prop.setProperty(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG,"false")

    // todo 构造一个Consumer对象，需要去指定消费的 Key Value 的类型，需要指定消费者属性
    val consumer: KafkaConsumer[String, String] = new KafkaConsumer[String, String](prop)
    // 订阅主题(订阅的是需要消费的什么主题什么分区)
    // 如果想每次消费都从自己指定的offset开始消费，则使用 assign 方法 而非 subscribe 方法
    consumer.assign(util.Arrays.asList(
      new TopicPartition("topic-api", 0),
      new TopicPartition("topic-api", 1),
      new TopicPartition("topic-api", 2)
    ))
    // 设置消费的位置
//    consumer.seek(new TopicPartition("topic-api", 0), 3)
//    consumer.seek(new TopicPartition("topic-api", 1), 7)
//    consumer.seek(new TopicPartition("topic-api", 1), 11)

    // 设置从头开始消费的主题、分区
    consumer.seekToBeginning(util.Arrays.asList(
      new TopicPartition("topic-api", 0),
      new TopicPartition("topic-api", 1),
      new TopicPartition("topic-api", 2)
    ))
    // 设置从最新位置开始消费的主题、分区
    // consumer.seekToEnd()

    // todo 开始循环消费消息
    while (true) {
      // 从kafka中拉取消息
      val records: ConsumerRecords[String, String] = consumer.poll(Duration.ofSeconds(1))
      // 获取迭代器
      val iterator = records.iterator()
      // 遍历拉取到的所有消息
      while (iterator.hasNext) {
        // 获取到一个消息对象
        val record = iterator.next()
        println(s"topic: ${record.topic()}\tpartition: ${record.partition()}\toffset:${record.offset()}\tkey:${record.key()}\tvalue:${record.value()}")
      }
      // todo 手动提交offset
      consumer.commitAsync()
    }
  }
}
```

## KafkaHelper工具类

在 src/main/sources目录添加两个配置文件

**producer.properties**

```properties
key.serializer=org.apache.kafka.common.serialization.StringSerializer
value.serializer=org.apache.kafka.common.serialization.StringSerializer
bootstrap.servers=kk01:9092,kk02:9092,kk03:9092
# ack应答机制
acks=all
# 指定消息发送失败后重试次数
reties=3
# 设置一个分区的缓存大小
batch.size=1024
# 设置缓冲区总大小
buffer.memory=10240
# 超时等待时间
linger.ms=10
```

**consumer.properties**

```properties
key.deserializer=org.apache.kafka.common.serialization.StringDeserializer
value.deserializer=org.apache.kafka.common.serialization.StringDeserializer
bootstrap.servers=kk01:9092,kk02:9092,kk03:9092
# 消费者组
group.id=api-group
# 当没有初始的offset（即消费者组中的第一个消费者第一次开始消费数据），或者记录的offset不存在了（消息已经过期被清除了），设置应该从什么位置开始消费
# 误区：如果你设置为 earliest，并不是每次都从头开始消费
auto.offset.reset=earliest
```

KafkaHelper工具类

```scala
package com.clear.kafka.util

import org.apache.kafka.clients.consumer.KafkaConsumer
import org.apache.kafka.clients.producer.KafkaProducer

import java.util.Properties
import scala.collection.JavaConverters._

/**
 * Kafka生产者、消费者对象的构建工具类，可以快速构建生产者对象 或 消费者对象
 */
object KafkaHelper {
  // 生产者的通用属性列表文件
  private val PATH_PROPERTIES_PRODUCER: String = "producer.properties"
  // 消费者的通用属性列表文件
  private val PATH_PROPERTIES_CONSUMER: String = "consumer.properties"

  // 获取一个生产者对象，这个生产者对象应该具有一些通用属性
  def getProducer: KafkaProducer[String, String] = new KafkaProducer[String, String](
    loadProperties(PATH_PROPERTIES_PRODUCER))

  /**
   * 让用户根据自己的需求，个性化定制生产者对象
   *
   * @param config 用户传入的配置属性
   * @return 生产者对象
   */
  def getProducer(config: Map[String, String]): KafkaProducer[String, String] = {
    // 1.读取默认的通用配置信息
    val properties: Properties = loadProperties(PATH_PROPERTIES_PRODUCER)
    // 2.使用用户传入的配置属性，对默认通用配置属性做覆盖
    properties.putAll(config.asJava)
    // 3.实例化生产者对象
    new KafkaProducer[String, String](properties)
  }

  // 获取一个具有通用配置属性的消费者对象
  def getConsumer: KafkaConsumer[String, String] = new KafkaConsumer[String, String](
    loadProperties(PATH_PROPERTIES_CONSUMER))

  def getConsumer(config: Map[String, String]): KafkaConsumer[String, String] = {
    // 1.读取默认的通用配置信息
    val properties: Properties = loadProperties(PATH_PROPERTIES_CONSUMER)
    // 2.使用用户传入的配置属性，对默认通用配置属性做覆盖
    properties.putAll(config.asJava)
    // 3.实例化生产者对象
    new KafkaConsumer[String, String](properties)
  }

  /**
   * 通过一个指定的文件路径，加载属性，获得一个Properties对象
   *
   * @param url 需要读取的文件路径
   * @return 返回Properties对象
   */
  private def loadProperties(url: String): Properties = {
    val properties: Properties = new Properties()
    properties.load(KafkaHelper.getClass.getClassLoader.getResourceAsStream(url))
    properties
  }
}
```

测试类

```scala
package com.clear.kafka.util

import org.apache.kafka.clients.consumer.{ConsumerConfig, KafkaConsumer}
import org.apache.kafka.clients.producer.{KafkaProducer, ProducerRecord}

object Test {
  def main(args: Array[String]): Unit = {
    // 使用工具类获取生产者对象
    val producer: KafkaProducer[String, String] = KafkaHelper.getProducer

    producer.send(new ProducerRecord[String, String]("topic-api", "hello"))

    // 使用工具类获取消费者对象
    val consumer: KafkaConsumer[String, String] = KafkaHelper.getConsumer

    val consumer2: KafkaConsumer[String, String] = KafkaHelper.getConsumer(Map[String, String](ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG -> "false")
    )
  }
}
```

## 自定义分区

### Scala实现

自定义分区器的步骤：

1. 继承 Partitioner 
2. 实现抽象方法（partition、close、configure）
3. 编写partition方法，返回分区号

#### 自定义分区器

```scala
package com.clear.kafka.partitioner

import org.apache.kafka.clients.producer.Partitioner
import org.apache.kafka.common.Cluster

import java.util

// 自定义分区器
class MyPartitioner extends Partitioner {
  /**
   * 分区器中最核心的方法：由该方法决定消息属于哪一个分区
   *
   * @param topic      生产者生成消息保存到的主题
   * @param key        消息的key
   * @param keyBytes   消息的key序列化之后的字节序列
   * @param value      消息的value
   * @param valueBytes 消息的value序列化之后的字节序列
   * @param cluster    集群信息
   * @return
   */
  override def partition(topic: String, key: Any, keyBytes: Array[Byte], value: Any, valueBytes: Array[Byte], cluster: Cluster): Int = {
    // 需求：我们这里实现一个简单的分区器逻辑
    //    消息的value如果是大写字母开头，存入 0 分区
    //    消息的value如果是小写字母开头，存入 1 分区
    //    消息的value如果其他情况，存入 2 分区
    val valStr = value.toString
    val firstLetter: Char = valStr.charAt(0)

    if (Character.isUpperCase(firstLetter)) {
      0
    } else if (Character.isLowerCase(firstLetter)) {
      1
    } else {
      2
    }
  }

  override def close(): Unit = {

  }

  override def configure(configs: util.Map[String, _]): Unit = {

  }
}
```

测试

```scala
package com.clear.kafka.partitioner

import org.apache.kafka.clients.producer.{Callback, KafkaProducer, ProducerConfig, ProducerRecord, RecordMetadata}
import com.clear.kafka.util.KafkaHelper

import scala.io.StdIn

// 测试
object PartitionerProducerTest {
  def main(args: Array[String]): Unit = {
    // 使用前面写的Kafka工具类，获取生产者对象
    // 因为要使用自定义的分区器，所以要传入定制参数
    val producer: KafkaProducer[String, String] = KafkaHelper.getProducer(
      Map[String, String](ProducerConfig.PARTITIONER_CLASS_CONFIG -> "com.clear.kafka.partitioner.MyPartitioner"))

    // 生产消息发送到主题
    while (true) {
      val msg: String = StdIn.readLine("请输入要发送的消息：")
      producer.send(new ProducerRecord[String, String]("topic-api2", msg),
        new Callback {
          override def onCompletion(metadata: RecordMetadata, exception: Exception): Unit = {
            if (exception != null) {
              exception.printStackTrace()
            } else {
              println(s"消息发送成功，发到了 ${metadata.partition()} 分区");
            }
          }
        })
      Thread.sleep(500)
    }
  }
}
```

测试结果

```
请输入要发送的消息：666
消息发送成功，发到了 2 分区
请输入要发送的消息：777
消息发送成功，发到了 2 分区
请输入要发送的消息：hello
消息发送成功，发到了 1 分区
请输入要发送的消息：world
消息发送成功，发到了 1 分区
请输入要发送的消息：Spark
消息发送成功，发到了 0 分区
请输入要发送的消息：Scala
消息发送成功，发到了 0 分区
```

#### 自定义随机分区器

```scala
package com.clear.kafka.partitioner

import org.apache.kafka.clients.producer.Partitioner
import org.apache.kafka.common.Cluster

import java.util
import scala.util.Random

// 自定义随机分区器
class RandomPartitioner extends Partitioner {
  override def partition(topic: String, key: Any, keyBytes: Array[Byte], value: Any, valueBytes: Array[Byte], cluster: Cluster): Int = {
    // 1.获取所有的分区数量
    val partitions = cluster.partitionCountForTopic("topic-api2")
    // 2.返回一个随机分区
    Random.nextInt(partitions)
  }

  override def close(): Unit = {}

  override def configure(configs: util.Map[String, _]): Unit = {}
}
```

测试

```scala
package com.clear.kafka.partitioner

import org.apache.kafka.clients.producer.{Callback, KafkaProducer, ProducerConfig, ProducerRecord, RecordMetadata}
import com.clear.kafka.util.KafkaHelper

import scala.io.StdIn

// 测试
object PartitionerProducerTest {
  def main(args: Array[String]): Unit = {
    // 使用前面写的Kafka工具类，获取生产者对象
    // 因为要使用自定义的分区器，所以要传入定制参数
    val producer: KafkaProducer[String, String] = KafkaHelper.getProducer(
      Map[String, String](ProducerConfig.PARTITIONER_CLASS_CONFIG -> "com.clear.kafka.partitioner.RandomPartitioner"))

    // 生产消息发送到主题
    while (true) {
      val msg: String = StdIn.readLine("请输入要发送的消息：")
      producer.send(new ProducerRecord[String, String]("topic-api2", msg),
        new Callback {
          override def onCompletion(metadata: RecordMetadata, exception: Exception): Unit = {
            if (exception != null) {
              exception.printStackTrace()
            } else {
              println(s"消息发送成功，发到了 ${metadata.partition()} 分区");
            }
          }
        })
      Thread.sleep(500)
    }
  }
}
```

测试结果

我们发现， 555 这条消息，我们发送了两次，却发送到了不同的分区，因此自定义随机分区器完成

```
请输入要发送的消息：hello
消息发送成功，发到了 1 分区
请输入要发送的消息：world
消息发送成功，发到了 2 分区
请输入要发送的消息：555
消息发送成功，发到了 0 分区
请输入要发送的消息：555
消息发送成功，发到了 2 分区
```

#### 自定义Hash分区器

```scala
package com.clear.kafka.partitioner

import org.apache.kafka.clients.producer.Partitioner
import org.apache.kafka.common.Cluster

import java.util
import scala.util.Random

// 自定义Hash分区器
class HashPartitioner extends Partitioner {
  override def partition(topic: String, key: Any, keyBytes: Array[Byte], value: Any, valueBytes: Array[Byte], cluster: Cluster): Int = {
    // 1.获取所有的分区数量
    val partitions = cluster.partitionCountForTopic("topic-api2")
    // 2.通过HashCode计算分区
    if (key == null) 0 else math.abs(key.hashCode()) % partitions
  }

  override def close(): Unit = {}

  override def configure(configs: util.Map[String, _]): Unit = {}
}
```

#### 自定义轮询分区器

```scala
package com.clear.kafka.partitioner

import org.apache.kafka.clients.producer.Partitioner
import org.apache.kafka.common.Cluster

import java.util
import java.util.concurrent.atomic.AtomicInteger
import scala.util.Random

// 自定义轮询分区器：可以最大限度保证所有消息平均分配到一个分区
// 这也是Kafka当前版本默认的分区模式
class RoundRobinPartitioner extends Partitioner {
  // 用来统计累加的数量
  private val count: AtomicInteger = new AtomicInteger()

  override def partition(topic: String, key: Any, keyBytes: Array[Byte], value: Any, valueBytes: Array[Byte], cluster: Cluster): Int = {
    // 1.获取所有的分区数量
    val partitions = cluster.partitionCountForTopic("topic-api2")
    // 2.计算分区
    count.getAndIncrement() % partitions
  }

  override def close(): Unit = {}

  override def configure(configs: util.Map[String, _]): Unit = {}
}
```

### Java实现

自定义分区器的步骤：

1.  实现接口 Partitioner 
2.  实现接口的抽象方法（partition、close、configure）
3.  编写partition方法，返回分区号

#### 1）自定义分区器

```java
public class MyPartitioner implements Partitioner {
    /**
     * @param topic      主题
     * @param key        消息的key
     * @param keyBytes   消息的key序列化后的字节数组
     * @param value      消息的value
     * @param valueBytes 消息的value序列化后的字节数组
     * @param cluster    集群元数据可以查看分区信息
     * @return 返回分区号
     */
    @Override
    public int partition(String topic, Object key, byte[] keyBytes, Object value, byte[] valueBytes, Cluster cluster) {
        // 书写分区的业务逻辑
        return 0;
    }

    /**
     * 关闭资源（该方法只执行一次）
     */
    @Override
    public void close() {

    }

    /**
     * 配置方法（该方法只执行一次）
     *
     * @param configs
     */
    @Override
    public void configure(Map<String, ?> configs) {

    }
}
```

#### 2）使用分区器的方法

在生产者的配置中添加分区器参数

```java
// 1.创建配置对象
Properties properties = new Properties();
        
// 添加自定义分区器 （这里需要添加自定义分区器的全限定名）
properties.put(ProducerConfig.PARTITIONER_CLASS_CONFIG,"这里填写自定义分区器的全限定名");
```

#### 3）演示如下

```java
import org.apache.kafka.clients.producer.*;

import java.util.Properties;
import java.util.concurrent.ExecutionException;

/**
 * 演示自定义分区器
 */
public class PartitionWithCallBack {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 1.创建配置对象
        Properties properties = new Properties();

        // 2.给配置对象添加参数
        properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "kk01:9092,kk02:9092,kk03:9092");

        // 注册使用自定义分区器   (填写全限定名)
        properties.put(ProducerConfig.PARTITIONER_CLASS_CONFIG,"com.clear.partition.CustomPartitioner");
        // 设置key序列化
        properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        // 设置value序列化
        properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");

        // 下面设置非必要的参数
        // ack机制 指定等待所有副本节点的应答
        properties.put(ProducerConfig.ACKS_CONFIG, "all");
        // 重试次数 指定消息发送最大尝试次数
        properties.put(ProducerConfig.RETRIES_CONFIG, 1);
        // 批次大小:默认消息大小为16384（16k）才发送消息
        properties.put("batch.size", 16384);
        // 等待时间:如果消息大小迟迟不为batch.size大小，则等待linger.ms时间后直接发送
        properties.put(ProducerConfig.LINGER_MS_CONFIG, 1);
        // 指定ReadAccumulator缓冲区大小 默认32M
        properties.put(ProducerConfig.BUFFER_MEMORY_CONFIG, 33554432);

        // 3.创建Kafka生产者对象
        // 泛型<String, String>表示最终发送消息的 key和value 的类型
        // 下面是模拟消息源，向名为 first的主题发送消息
        KafkaProducer<String, String> producer = new KafkaProducer<String, String>(properties);

        // 4.调用send方法发送生产的数据
        for (int i = 0; i < 10; i++) {

            producer.send(new ProducerRecord<>("first","hello world - " + i),
                    // 回调函数（这是个接口，直接实现其匿名子类即可）
                    new Callback() {
                        @Override
                        public void onCompletion(RecordMetadata metadata, Exception exception) {
                            // 当前的生产者发送消息成功收到回复的ack，进行异步调用
                            // 发送的消息出现异常，也会调用该方法
                            if (exception != null) {
                                // 出现异常
                                exception.printStackTrace();
                            } else {
                                // 未出现异常 发送成功
                                // 在控制台打印当前数据发送到了哪个主题，哪个分区的第几条数据
                                System.out.println(metadata.topic() + ":" + metadata.partition() + ":" + metadata.offset());
                            }
                        }
                    });
        }
        // 5.关闭连接
        // flush机制
        producer.close();
    }
}


import org.apache.kafka.clients.producer.Partitioner;
import org.apache.kafka.common.Cluster;

import java.util.Map;

/**
 * 1.实现分区器接口
 * 2.重写抽象方法
 */
public class CustomPartitioner implements Partitioner {
    @Override
    public int partition(String topic, Object key, byte[] keyBytes, Object value, byte[] valueBytes, Cluster cluster) {
        // 根据传入的各个参数，判断发送到不同的分区   直接返回分区号即可
        // 演示：将消息中含 hello 的发送到0号分区
        if (value.toString().contains("hello")){
            return 0;  // 返回分区号
        } else {
            return 1;
        }
    }

    @Override
    public void close() {

    }

    @Override
    public void configure(Map<String, ?> configs) {

    }
}
```

查看idea控制台打印（回调函数打印的）的数据，可以看出自定义分区成功

```
first:0:38
first:0:39
first:0:40
first:0:41
first:0:42
first:0:43
first:0:44
first:0:45
first:0:46
first:0:47
```

### 生产者分区写入策略

**1）什么是分区**

​	从整体上来说，一个 Kafka 集群有多个机器（一个机器就是一个 Broker），创建一个 Topic 是针对集群创建的，也就是说一个集群共享一个 Topic。**一个 Topic 可以有多个分区**，如果机器数量够用的话，多个分区会在不同的 Broker 上，当然如果 Broker 不够用，那么一个 Broker 就可能保存一个 Topic 的多个分区。

那么分区是什么呢？

​	简单来说就是，生产者会源源不断的发送数据给Topic，如果生产者没有指定发送到哪个分区的话，那么这些数据会按照一定的策略分发到这个Topic的几个分区，即多个分区中都有数据，这样就无法保证数据整体的有序性存储。

**2）为什么分区？**

- **方便在集群中扩展**，每个 Partition 可以通过调整以适应它所在的机器，而一个 topic 又可以有多个 Partition 组成，因此整个集群就可以适应任意大小的数据了；
- **可以提高并发**，因为可以以 Partition 为单位读写了

**3）分区的原则**

我们需要将 producer 发送的消息封装成一个 **ProducerRecord** 对象

```java
// 如下是ProducerRecord的构造器（参数最多的一个）
public ProducerRecord(String topic, Integer partition, Long timestamp, K key, V value, Iterable<Header> headers)
// 用指定的时间戳创建一条记录，发送到指定的 topic 和 partition
// 参数说明
//		topic	记录将被追加到的主题
// 		partition	记录要发送到的分区
//		timestamp	记录的时间戳，单位为ms。（一般情况下，不使用这个参数）
//					如果为空，生产者将赋值使用System.currentTimeMillis()获取时间戳。
    
//		key		将包含在记录中的键
//		value	记录内容
//		headers	将包含在记录中的标头
    
// 上面 ProducerRecord 中的 partition 参数即为指定的分区(分区是有编号的，这是指定分区中的某一个，实际应该为一个分区编号)
    
   
public ProducerRecord(String topic, K key, V value)
    
// 只填写value 自身的粘性机制 先向一个批次中写数据，达到一批了统一发送，之后切换一个分区 再写一个批次   
public ProducerRecord(String topic, V value)
    
   
// 注意:
    如果指定特定分区的话，消息是会发送到这个编号的特定分区，但是注意如果你的Topic分区只有默认的1个，而你却要发送到分区1号，此时发送会失败！因为你只有1个分区，即0号分区。所以在构建的topic的时候需要注意。
```

- **指明partition**（这里的指明是指第几个分区）的情况下，直接将指明的值作为partition的值

- **没有指明partition**的情况下，但是**存在值key**，此时将 **key 的 hash 值与 topic 的 partition总数进行取余**得到partition值

- **即没有 partition值又没有key**的情况下，**Kafka采用 Sticky Partition（黏性分区器**），会随机选择一个分区，并尽可能一直使用该分区，待该分区的batch已满或者已完成，Kafka再随机一个分区进行使用

- ```java
    org.apache.kafka.clients.producer.UniformStickyPartitioner
    
    public class UniformStickyPartitioner implements Partitioner  //均匀粘性分区器
    // 均匀粘性分区器，将消息均匀地分配到每个分区中，并且保证相同 key 的消息总是被分配到同一个分区中。这个分区器可以提高消息的局部性，从而提高消费者的性能。
    ```

    

    ```java
    // 下面是演示的部分代码片段
    
     // 4.调用send方法发送生产的数据
            for (int i = 0; i < 10; i++) {
                // 1)直接填写分区号 0  ==> 数据不需要走分区器  方法直接返回分区号即可
                producer.send(new ProducerRecord<>("first", 0,"","hello world - " + i));
                Thread.sleep(2);
            }
    
    
    // 4.调用send方法发送生产的数据
            for (int i = 0; i < 10; i++) {
                // 控制消息发送到不同的分区
                // 2)不填写分区号，填写key 按照key进行分区（使用Hash）
                producer.send(new ProducerRecord<>("first", "abc","hello world - " + i));
                // 线程睡眠，避免全部发送到一个分区
                Thread.sleep(2);
            }
    
    
    // 4.调用send方法发送生产的数据
            for (int i = 0; i < 10; i++) {
                // 控制消息发送到不同的分区
                // 3)只填写value 自身的黏性机制 先向一个批次中写数据，达到一批了统一发送，之后切换一个分区 再写一个批次
                producer.send(new ProducerRecord<>("first", "hello world - " + i));
                // 线程睡眠，避免全部发送到一个分区
                Thread.sleep(2);
            }
    ```


#### 1 轮询分区

**默认的策略**，也是使用最多的策略，可以**最大限度保证所有消息平均分配到一个分区**

```java
org.apache.kafka.clients.producer.internals.DefaultPartitioner

public class DefaultPartitioner implements Partitioner // 默认分区器
```

如果在**生产消息时，key为 null，则使用轮询算法均衡地分配分区**

```java
org.apache.kafka.clients.producer.RoundRobinPartitioner

public class RoundRobinPartitioner implements Partitioner  // 轮询分区器
//默认分区器，根据消息的 key 进行哈希计算，将相同 key 的消息分配到同一个分区中。如果消息没有 key，那么使用轮询的方式将消息分配到分区中。
```


#### 2 随机策略

​	随机策略，每次都随机地将消息分配到每个分区。在较早的版本，默认的分区策略就是随机策略，也是为了将消息均衡地写入到每个分区。但后续轮询策略表现更佳，所以基本上很少会使用随机策略。


#### 3 按key分配策略

​	按key分配策略，有可能会出现「数据倾斜」，例如：某个 key 包含了大量的数据，因为key值一样，所有所有的数据将都分配到一个分区中，造成该分区的消息数量远大于其他的分区。

**轮询策略、随机策略**都会导致一个问题，生产到 Kafka 中的数据是 **乱序存储** 的。而按 key 分区可以一定程度上实现数据有序存储——也就是局部有序，但这又可能会导致数据倾斜，所以在实际生产环境中要结合实际情况来做取舍。


#### 4 自定义分区策略

自定义分区器的步骤：

1. 实现接口 Partitioner 
2. 实现接口的抽象方法（partition、close、configure）
3. 编写partition方法，返回分区号

1）自定义分区器

```java
public class MyPartitioner implements Partitioner {
    /**
     * @param topic      主题
     * @param key        消息的key
     * @param keyBytes   消息的key序列化后的字节数组
     * @param value      消息的value
     * @param valueBytes 消息的value序列化后的字节数组
     * @param cluster    集群元数据可以查看分区信息
     * @return 返回分区号
     */
    @Override
    public int partition(String topic, Object key, byte[] keyBytes, Object value, byte[] valueBytes, Cluster cluster) {
        // 书写分区的业务逻辑
        return 0;
    }

    /**
     * 关闭资源（该方法只执行一次）
     */
    @Override
    public void close() {

    }

    /**
     * 配置方法（该方法只执行一次）
     *
     * @param configs
     */
    @Override
    public void configure(Map<String, ?> configs) {

    }
}
```

2）使用分区器的方法

在生产者的配置中添加分区器参数

```java
// 1.创建配置对象
Properties properties = new Properties();
        
// 添加自定义分区器 （这里需要添加自定义分区器的全限定名）
properties.put(ProducerConfig.PARTITIONER_CLASS_CONFIG,"这里填写自定义分区器的全限定名");
```

## Kafka拦截器

所谓“拦截器”，就是在消息传输的过程中将其拦截，然后可以对消息进行一些处理。

Kafka的拦截器是在 0.10 版本中添加到，Kafka的**拦截器可以作用在生产阶段**，也可以作用在**消费阶段**。

- 如果需要定义生产阶段的拦截器，就要定义一个类，实现`ProducerInterceptor`接口，并实现其中方法。

    ```java
    org.apache.kafka.clients.producer.ProducerInterceptor
    
    public interface ProducerInterceptor<K, V> extends Configurable
    ```

- 如果需要定义消费阶段的拦截器，就要定义一个类，实现`ConusmerInterceptor`接口，并实现其中方法。

    ```java
    org.apache.kafka.clients.consumer.ConsumerInterceptor
    
    public interface ConsumerInterceptor<K, V> extends Configurable, AutoCloseable
    ```

那类定义完成后，如何应用拦截器呢？

​	只需要在创建生产者对象 或 消费者对象 时，在配置中添加 `interceptor.classes`属性即可，属性的value需要填写 `全限定名`

我们也可以将多个拦截器一起使用，组成 拦截器链，这时 `interceptor.classes`属性的value需要填写 一个拦截器集合

### 生产阶段的拦截器

#### Producer拦截器模板

```scala
import org.apache.kafka.clients.producer.{ProducerInterceptor, ProducerRecord, RecordMetadata}

import java.util

class MyProducerInterceptor extends ProducerInterceptor[String, String]{
  /**
   * 在消息被序列化之后，选择发送分区之前触发（但最后不要修改原来隶属的分区，否则会影响后续的处理）
   * @param record 拦截到的消息对象
   * @return 处理之后的消息对象
   */
  override def onSend(record: ProducerRecord[String, String]): ProducerRecord[String, String] = ???

  /**
   * 消息发送成功或者失败时候调用
   * 注意：这个方法的触发，于onSend的触发不在同一个线程，因此如果两个方法中使用到了同一个资源，需要注意线程安全问题
   * @param metadata  消息的元数据信息
   * @param exception 失败时候的异常信息
   */
  override def onAcknowledgement(metadata: RecordMetadata, exception: Exception): Unit = ???

  override def close(): Unit = ???

  /**
   * 获取配置信息、初始化数据
   * @param configs 配置信息
   */
  override def configure(configs: util.Map[String, _]): Unit = ???
}
```

#### 演示

需求：

​	将发送到Kafka中的每一条消息都变成小写，如果消息中有_ 下划线，将其修改为 -

​	将修改后的消息中的key，修改为当前的时间戳

```scala
package com.clear.kafka.interceptor

import org.apache.kafka.clients.producer.{ProducerInterceptor, ProducerRecord, RecordMetadata}

import java.time.Instant
import java.util

class MyProducerInterceptor extends ProducerInterceptor[String, String] {
  /**
   * 在消息被序列化之后，选择发送分区之前触发（但最后不要修改原来隶属的分区，否则会影响后续的处理）
   *
   * @param record 拦截到的消息对象
   * @return 处理之后的消息对象
   */
  override def onSend(record: ProducerRecord[String, String]): ProducerRecord[String, String] = {
    // 1.获取消息中的value
    val value: String = record.value()
    // 2.对消息的value进行处理
    val fixedValue: String = value.toLowerCase().replace('_', '-')
    // 3.添加当前时间戳
    new ProducerRecord[String, String](record.topic(), record.partition(), Instant.now().toEpochMilli.toString, fixedValue)
  }

  /**
   * 消息发送成功或者失败时候调用
   * 注意：这个方法的触发，于onSend的触发不在同一个线程，因此如果两个方法中使用到了同一个资源，需要注意线程安全问题
   *
   * @param metadata  消息的元数据信息
   * @param exception 失败时候的异常信息
   */
  override def onAcknowledgement(metadata: RecordMetadata, exception: Exception): Unit = {
    println(s"topic: ${metadata.topic()}, partition: ${metadata.partition()}, offset: ${metadata.offset()} ${if (exception == null) "SUCCEED" else "FAILED"}")
  }

  override def close(): Unit = {}

  /**
   * 获取配置信息、初始化数据
   *
   * @param configs 配置信息
   */
  override def configure(configs: util.Map[String, _]): Unit = {}
}
```

生产者对象测试

```scala
package com.clear.kafka.interceptor

import com.clear.kafka.util.KafkaHelper
import org.apache.kafka.clients.producer.{KafkaProducer, ProducerConfig, ProducerRecord}

object ProducerInterceptorTest {
  def main(args: Array[String]): Unit = {
    // 使用KafkaHelper工具类实例化一个生产者对象
    val producer: KafkaProducer[String,String] = KafkaHelper.getProducer(Map[String,String](ProducerConfig.INTERCEPTOR_CLASSES_CONFIG -> "com.clear.kafka.interceptor.MyProducerInterceptor"))

    // 生产消息
    for(i <- 1 to 10){
      producer.send(new ProducerRecord[String,String]("topic-api2",s"HELLO_WORLD_$i"))
      Thread.sleep(500)
    }
  }
}
```

结果如下

```
topic: topic-api2, partition: 1, offset: 3 SUCCEED
topic: topic-api2, partition: 0, offset: 3 SUCCEED
topic: topic-api2, partition: 1, offset: 4 SUCCEED
topic: topic-api2, partition: 2, offset: 4 SUCCEED
topic: topic-api2, partition: 2, offset: 5 SUCCEED
topic: topic-api2, partition: 2, offset: 6 SUCCEED
topic: topic-api2, partition: 0, offset: 4 SUCCEED
topic: topic-api2, partition: 1, offset: 5 SUCCEED
topic: topic-api2, partition: 2, offset: 7 SUCCEED
topic: topic-api2, partition: 1, offset: 6 SUCCEED
```

### 消费阶段的拦截器

#### Consumer拦截器模板

```scala
import org.apache.kafka.clients.consumer.{ConsumerInterceptor, ConsumerRecords, OffsetAndMetadata}
import org.apache.kafka.common.TopicPartition

import java.util

class MyConsumerInterceptor extends ConsumerInterceptor[String,String]{
  /**
   * 消息从Kafka中提出，被发送给消费者应用程序之前调用
   * @param records 拦截到的消息对象
   * @return
   */
  override def onConsume(records: ConsumerRecords[String, String]): ConsumerRecords[String, String] = ???

  /**
   * offset提交之前调用
   * @param offsets 分区消息的元数据信息
   */
  override def onCommit(offsets: util.Map[TopicPartition, OffsetAndMetadata]): Unit = ???

  override def close(): Unit = ???

  override def configure(configs: util.Map[String, _]): Unit = ???
}
```

#### 演示

需求：

​	解析消息的key，将时间戳转换为 年 月 日

```scala
package com.clear.kafka.interceptor

import org.apache.kafka.clients.consumer.{ConsumerInterceptor, ConsumerRecord, ConsumerRecords, OffsetAndMetadata}
import org.apache.kafka.common.TopicPartition

import java.time.format.DateTimeFormatter
import java.time.{Instant, ZoneOffset}
import java.util

class MyConsumerInterceptor extends ConsumerInterceptor[String, String] {
  /**
   * 消息从Kafka中提出，经过这个方法的处理，才会发送给消费者进行消费
   *
   * @param records 拦截到的一批消息对象
   * @return
   */
  override def onConsume(records: ConsumerRecords[String, String]): ConsumerRecords[String, String] = {
    // 存放被处理过的消息的容器
    val map: util.HashMap[TopicPartition, util.List[ConsumerRecord[String, String]]] = new util.HashMap[TopicPartition, util.List[ConsumerRecord[String, String]]]()

    val iterator: util.Iterator[ConsumerRecord[String, String]] = records.iterator()
    // 遍历拦截到的每一条消息
    while (iterator.hasNext) {
      // 提取拦截到的一条消息
      val record: ConsumerRecord[String, String] = iterator.next()
      // 提取消息的主题
      val topic: String = record.topic()
      // 提取消息的分区
      val partition: Int = record.partition()
      // 创建TopicPartition对象，用来作为map的 key
      val topicPartition: TopicPartition = new TopicPartition(topic, partition)

      // 当 topicPartition 在map中不存在时，才会添加
      map.putIfAbsent(topicPartition, new util.ArrayList[ConsumerRecord[String, String]]())

      // 对消息进行处理
      val fixeKey: String = Instant.ofEpochMilli(record.key().toLong).atZone(ZoneOffset.ofHours(8)).toLocalDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
      // 获取topicPartition这对应的消息集合
      val list: util.List[ConsumerRecord[String, String]] = map.get(topicPartition)
      // 将一条消息存入map集合容器
      list.add(new ConsumerRecord[String, String](topic, partition, record.offset(), fixeKey, record.value()))
    }
    new ConsumerRecords[String, String](map)
  }

  /**
   * offset提交之前调用
   *
   * @param offsets 分区消息的元数据信息
   */
  override def onCommit(offsets: util.Map[TopicPartition, OffsetAndMetadata]): Unit = {}

  override def close(): Unit = {}

  override def configure(configs: util.Map[String, _]): Unit = {}
}
```

消费者对象测试

```scala
package com.clear.kafka.interceptor

import com.clear.kafka.util.KafkaHelper
import org.apache.kafka.clients.consumer.{ConsumerConfig, ConsumerRecord, ConsumerRecords, KafkaConsumer}

import java.time.Duration
import java.util
import java.util.Collections

object ConsumerInterceptorTest {
  def main(args: Array[String]): Unit = {
    // 1.获取一个消费者对象
    val consumer: KafkaConsumer[String, String] = KafkaHelper.getConsumer(Map[String, String](ConsumerConfig.INTERCEPTOR_CLASSES_CONFIG -> "com.clear.kafka.interceptor.MyConsumerInterceptor"))

    // 2.消费数据
    // 2.1 订阅主题
    consumer.subscribe(util.Arrays.asList("topic-api2"))
    while (true) {
      // 2.2 消费数据
      val records: ConsumerRecords[String, String] = consumer.poll(Duration.ofSeconds(1))
      val iterator: util.Iterator[ConsumerRecord[String, String]] = records.iterator()
      while (iterator.hasNext) {
        val record: ConsumerRecord[String, String] = iterator.next()
        println(s"topic: ${record.topic()}, partition: ${record.partition()}, offset: ${record.offset()}, key: ${record.key()}, value: ${record.value()}")
      }
    }
  }
}
```

测试结果

从结果可知，key已经转化为 年月日了，所以我们消费者的拦截器也编写成功

```
opic: topic-api2, partition: 2, offset: 8, key: 2023-06-26, value: hello-world-1
topic: topic-api2, partition: 2, offset: 9, key: 2023-06-26, value: hello-world-2
topic: topic-api2, partition: 1, offset: 7, key: 2023-06-26, value: hello-world-3
topic: topic-api2, partition: 1, offset: 8, key: 2023-06-26, value: hello-world-4
topic: topic-api2, partition: 1, offset: 9, key: 2023-06-26, value: hello-world-5
topic: topic-api2, partition: 1, offset: 10, key: 2023-06-26, value: hello-world-6
topic: topic-api2, partition: 0, offset: 5, key: 2023-06-26, value: hello-world-7
topic: topic-api2, partition: 0, offset: 6, key: 2023-06-26, value: hello-world-8
topic: topic-api2, partition: 2, offset: 10, key: 2023-06-26, value: hello-world-9
topic: topic-api2, partition: 2, offset: 11, key: 2023-06-26, value: hello-world-10
```



## AdminClient API

​	AdminClient API是Kafka提供的一个Java API，用于管理Kafka集群的元数据信息，包括创建、删除、修改topic、broker、ACL等。通过AdminClient API，可以方便地进行Kafka集群的管理和维护。

### AdminClient 常用API

AdminClient API提供了以下几个主要的方法：

- createTopics()：创建一个或多个topic。
- deleteTopics()：删除一个或多个topic。
- describeTopics()：获取一个或多个topic的元数据信息。
- describeCluster()：获取Kafka集群的元数据信息。
- createPartitions()：增加一个或多个topic的分区数。
- alterConfigs()：修改一个或多个broker或topic的配置信息。
- describeConfigs()：获取一个或多个broker或topic的配置信息。
- listTopics()：获取Kafka集群中所有的topic列表。
- listConsumerGroups()：获取Kafka集群中所有的consumer group列表。
- describeConsumerGroups()：获取一个或多个consumer group的元数据信息。
- deleteConsumerGroups()：删除一个或多个consumer group。
- listOffsets()：获取一个或多个partition的offset信息。
- alterPartitionReassignments()：修改一个或多个partition的reassignment信息。
- describeLogDirs()：获取一个或多个broker的log directory信息。
- describeReplicaLogDirs()：获取一个或多个broker的replica log directory信息。
- describeAcls()：获取一个或多个ACL的元数据信息。
- createAcls()：创建一个或多个ACL。
- deleteAcls()：删除一个或多个ACL。

通过AdminClient API，可以方便地进行Kafka集群的管理和维护，提高了Kafka集群的可靠性和可维护性。

### AdminClientAPI实操

```scala
package com.clear.kafka.admin

import kafka.admin.TopicCommand.TopicDescription
import org.apache.kafka.clients.admin
import org.apache.kafka.clients.admin.{AdminClient, AdminClientConfig, CreateTopicsResult, DescribeTopicsResult, ListTopicsOptions, ListTopicsResult, NewPartitions, NewTopic}
import org.apache.kafka.common.TopicPartitionInfo

import java.util
import java.util.Properties

object AdminClientAPI {

  def main(args: Array[String]): Unit = {
    // todo 1.实例化一个集合容器，用来存储客户端对象的属性
    val properties: Properties = new Properties()
    // 设置连接到的Kafka Broker列表
    properties.setProperty(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, "kk01:9092,kk02:9092,kk03:9092")
    // 设置连接对象闲置指定的时间之后，断开连接
    properties.setProperty(AdminClientConfig.CONNECTIONS_MAX_IDLE_MS_CONFIG, "10000")
    // 单次操作的超时时间
    properties.setProperty(AdminClientConfig.REQUEST_TIMEOUT_MS_CONFIG, "5000")
    // todo 2.创建一个 AdminClient 对象
    val client: AdminClient = AdminClient.create(properties)

    // todo 创建主题
    //createTopics(client, "client-topic", 3, 3)

    // todo 列举主题
    //listTopics(client)

    // todo 查看主题的描述信息
    //describeTopics(client, "client-topic")

    // todo 扩大分区数量
    //addPartitions(client, "client-topic", 5)

    // todo 删除主题
    deleteTopic(client, "client-topic")
  }

  /**
   * 创建主题
   *
   * @param client            AdminClient 对象
   * @param topic             要创建的主题名称
   * @param numPartitions     主题分区数量
   * @param replicationFactor 副本因子
   */
  def createTopics(client: AdminClient, topic: String, numPartitions: Int, replicationFactor: Int): Unit = {
    // 将需要创建的主题信息，封装成 NewTopic 对象
    val _topic: NewTopic = new NewTopic(topic, numPartitions, replicationFactor.toShort)

    val result: CreateTopicsResult = client.createTopics(util.Arrays.asList(_topic))
    println(result.all().get())
  }

  /**
   * 列出当前所有的主题：默认不包含内部主题，例如：kafka自动创建的，用于维护消费位置的 __consumer_offsets
   * @param client
   */
  def listTopics(client: AdminClient): Unit = {
    // 设置需要列举主题的选项
    val options: ListTopicsOptions = new ListTopicsOptions()
    options.listInternal(true) // 该参数为 ture  __consumer_offsets等Kafka自己创建的主题也会列举出来

    // 列举出所有主题
    val topicsResult: ListTopicsResult = client.listTopics()
    // 获取所有topic的名字
    val topicsName: util.Set[String] = topicsResult.names().get()
    println(topicsName)
  }

  /**
   * 查看主题详情
   *
   * @param client
   */
  def describeTopics(client: AdminClient, topics: String*): Unit = {
    // 我们首先使用java.util.Arrays.asList方法将可变参数topics转换为List
    val topicList: java.util.List[String] = util.Arrays.asList(topics: _*)
    // 将 List转换为Collection
    val topicNames: util.Collection[String] = topicList
    // 这样就可以将String *转换为Collection<String>，并将其作为参数传递给describeTopics方法。

    // 获取一些主题的描述信息，如果主题不存在，会有异常
    val result: DescribeTopicsResult = client.describeTopics(topicNames)
    // 提取描述信息的集合
    val topicDescriptions: util.Map[String, admin.TopicDescription] = result.all().get()
    // 遍历集合
    topicDescriptions.forEach((k, v) => {
      println(s"topic name: $k") // 获取主题名称
      println(s"\tis isInternal: ${v.isInternal}") // 是否有内部主题
      println(s"\tpartitions:")
      val partitions: util.List[TopicPartitionInfo] = v.partitions() // 获取当前主题的所有分区信息
      partitions.forEach(info => {
        println(s"\t\tPartition: ${info.partition()}") // 获取当前分区的分区号
        println(s"\t\t\tReplicas: ${info.replicas()}") // 获取该分区的所有副本
        println(s"\t\t\tISR: ${info.isr()}") // 获取该分区的ISR列表
        println(s"\t\t\tLeader: ${info.leader()}") // 查看当前分区的Leader
      })
      println()
    })
  }

  /**
   * 增大一个topic的分区数量
   *
   * @param client
   */
  def addPartitions(client: AdminClient, topic: String, newPartition: Int): Unit = {
    // 实例化一个集合容器，存放需要修改分区的topic 与 修改分区数量的映射关系
    val fixedPartitions: util.HashMap[String, NewPartitions] = new util.HashMap[String, NewPartitions]()
    // 设置新的分区数量
    val newPartitions: NewPartitions = NewPartitions.increaseTo(newPartition)
    // 设置topic与 分区数量的映射关系
    fixedPartitions.put(topic, newPartitions)
    // 修改分区数量
    client.createPartitions(fixedPartitions)
  }

  /**
   * 删除主题
   *
   * @param client
   * @param topic 将要删除的主题
   */
  def deleteTopic(client: AdminClient, topics: String*): Unit = {
    val topicList: util.List[String] = util.Arrays.asList(topics: _*)
    val topicNames: util.Collection[String] = topicList
    client.deleteTopics(topicNames)
  }
}
```



## Kafka Connect 

### Kafka Connect简介

​	  **Kafka Connect**是一种用于Apache Kafka 和其他外部系统之间以可伸缩的方式可靠地流式传输工具。它可以通过定义Connectors来**使得向Kafka中移动大量数据或者 Kafka中导出大量数据变得更加简单**。Kafka Connect可以读取数据库中的数据或者应用程序服务器的日志数据，并将其导入到指定的Topic中。可以使得对这些数据做低延迟的流式处理。导出数据的Job可以将Kafka的Topic中的数据递送到辅助存储系统、查询系统或者批处理系统，以便进行脱机处理。

Kafka Connect的特征如下：
- 提供了一套通用的连接器框架：

  Kafka Connect 标准化了其他数据系统与Kafka的集成，简化了连接器的开发、部署和管理分布式和独立模式，向上扩展到支持整个组织的大型集中管理服务，或向下扩展到开发、测试和小型生成部署。
- REST接口：

  通过易于使用的REST API将连接器管理Kafka Connect群集。

- 自动的Offset管理：

  Kafka Connect只需从连接器获得一点信息，就可以自动管理偏移提交过程，因此连接器开发人员无需担心连接器开发中容易出错的部分。
- 分布式、可扩展：

  Kafka Connect以现有的组管理协议为基础，可以添加更多Worker以扩展 Kafka Connect群集。

- 流/批集成：

  利用Kafka现有的功能，Kafka Connect是连接流媒体和批量数据系统的理想解决方案。  

### Kafka Connect中的核心概念

​	Kafka Connect的核心概念是Connector和Task。Connector是一个独立的Java进程，它负责将数据从外部系统导入到Kafka或将数据从Kafka导出到外部系统。每个Connector都包含一个或多个Task，每个Task负责处理一个特定的数据流。Connector和Task都是可插拔的，可以根据需要添加或删除。

​	Kafka Connect提供了许多现成的Connector，包括JDBC Connector、HDFS Connector、Elasticsearch Connector等。此外，Kafka Connect还提供了REST API，可以通过API管理Connector和Task。

- Source：负责将外部的数据导入到Kafka的指定Topic中，例如：文件、关系型数据库等

- Sink：负责将Kafka的指定主题的数据导出到外部，例如：文件、关系型数据库等

- Task：数据导入到Kafka，或者从Kafka导出数据的具体实现，Source和Sink工作的时候都是一个个的Task

- Connectors：通过管理任务来协调数据流

- Workers：运行Connectors和Task的进程

- Converters：Kafka Connect和其他存储系统进行数据的导入导出之前转换数据

- Transforms：轻量级的数据调整工具


### Kafka Connect的优点

- 可扩展性：Kafka Connect支持分布式部署，可以轻松地扩展到多个节点。
- 可靠性：Kafka Connect提供了故障转移和恢复机制，确保数据的可靠传输。
- 简单性：Kafka Connect提供了现成的Connector，可以轻松地将数据导入到Kafka或导出到外部系统中，无需编写复杂的代码。

总之，Kafka Connect是一个非常有用的工具，可以帮助我们轻松地将数据从外部系统导入到Kafka或将数据从Kafka导



### Kafka Connect的工作模式

Kafka Connect有两种工作模式：

- Standalone模式
- Distributed模式

#### Standalone模式

​	在这种模式下，所有的Worker都在一个进程中执行。这种模式的配置更加简单，比较容易入门、上手使用。适用于只有一个Worker的情况（例如：收集日志文件）。但是这种模式不能享有Kafka Connect的一些高级功能，例如：容错等。

**启动命令**

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/connect-standalone.sh config/connect-standalone.properties connector1.properties [connector2.properties ...]

# 说明
第一个参数：Worker的配置，包括Kafka的连接参数、序列化格式以及提交offset的频率等
后续的参数：Connectors的配置，包括Souces的配置和sink的配置
```

参考 config/connect-standalone 如下

```properties
# 设置需要连接到的Kafka节点（写 kk01:9092 也行，因为是单机版的）
bootstrap.servers=localhost:9092
# key的转换器，读取到数据后，将数据转换为JSON存入Kafka
key.converter=org.apache.kafka.connect.json.JsonConverter
# value的转换器，对应于key.converter，将Kafka在存储的JSON数据解析并读取value输出
value.converter=org.apache.kafka.connect.json.JsonConverter
# Converter-specific settings can be passed in by prefixing the Converter's setting with the converter we want to apply
# it to
key.converter.schemas.enable=true
value.converter.schemas.enable=true
# Kafka Connect会自动的保存Offset，Standalone模式下，将offset保存到了某一个文件中，这里设置保存的文件
offset.storage.file.filename=/tmp/connect.offsets
# 自动刷新offset的时间，单位ms
offset.flush.interval.ms=10000
```

参考 config/connect-file-source.properties 如下

```properties
# Source的名称（可随意取）
name=local-file-source
# Source对应的类型
connector.class=FileStreamSource
# Task的数量
tasks.max=1
# 需要读取的文件	
file=test.txt
# 读取消息后存入的主题（这个主题最好手动提取创建出来，可以更好的规划分区数量和副本因子）
topic=connect-test
```

 参考 config/connect-file-sink.properties 如下

```properties
# Sink的名称（可随意取)
name=local-file-sink
# Sink对应的类型
connector.class=FileStreamSink
# Task的数量
tasks.max=1
# Sink最终保存数据的路径	
file=test.sink.txt
# 从哪个topic消费数据
topics=connect-test
```

#### Distributed模式

​	Distributed模式也就是分布式模式，在这种模式下，Connect可以以集群的方式运行在不同的节点上。不同节点上的Worker需要具有相同的 group.id，并且这个 group.id 不能与消费者组的名字起冲突。在这种集群模式下，Kafka Connect 具有良好的扩展性和容错性。如果一个新的Worker上线，或者一个现有的Worker宕机，则其他的Worker会自动地分配Worker内运行的Connector 和 Task，以动态平衡集群压力。

**启动命令**

集群模式的启动命令，比起单机版的要简单，只需要带上必要的集群配置文件即可

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/connect-distributed.sh -daemon config/connect-distributed.properties 

# 注意，这里的命令命令需要在组成集群的每一个节点上依次启动才可以

# 说明
connect-distributed.properties  存储的是集群模式下的配置，不一定非要是这个名字
```

参考 config/connect-distributed.properties 如下

```properties
# 设置活跃的broker
bootstrap.servers=kk01:9092,kk02:9092,kk03:9092

# 集群的唯一名称，用于形成Connect集群组。注意，这不能与消费者组id冲突
group.id=connect-cluster

# key的转换器，读取到数据后，将数据转换为JSON存入Kafka
key.converter=org.apache.kafka.connect.json.JsonConverter
# value的转换器，对应于key.converter，将Kafka在存储的JSON数据解析并读取value输出
value.converter=org.apache.kafka.connect.json.JsonConverter
# 是否需要显示JSON中的其他结构，true表示显示完整的JSON，false表示只有一个payload
key.converter.schemas.enable=true
# 是否需要显示JSON中的其他结构，true表示显示完整的JSON，false表示只有一个payload
value.converter.schemas.enable=true

# 在集群模式下，消费到的offset是保存在Kafka主题中的，这里可以设置主题的名字
# 这个主题会自动创建，也可以自己提取手动创建
offset.storage.topic=connect-offsets
# 保存offset的主题的副本因子
offset.storage.replication.factor=3
#offset.storage.partitions=25

# 保存配置信息的主题的名字
# 这个主题会自动创建，也可以自己提取手动创建
config.storage.topic=connect-configs
# 保存offset的主题的副本因子
config.storage.replication.factor=3

# 保存运行状态的主题名字
# 这个主题会自动创建，也可以自己提取手动创建
status.storage.topic=connect-status
# 保存offset的主题副本因子
status.storage.replication.factor=3
#status.storage.partitions=5

# 自动刷新offset的时间，单位ms
offset.flush.interval.ms=10000

# 第三方插件的位置，Kafka内置的只有一个文件的导入导出的类，如果需要实现其他的数据源，例如关系型数据库、HDFS、ES、HBASE等需要自己自定义，或者使用开源的第三方
plugin.path=/opt/software/kafka_2.13-3.0.0/plugins
```

创建出 plugins 目录

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ pwd
/opt/software/kafka_2.13-3.0.0
[nhk@kk01 kafka_2.13-3.0.0]$ mkdir plugins
```

记得需要分发到需要组成集群的节点上

```shell
[nhk@kk01 config]$ scp connect-distributed.properties kk02:$PWD
[nhk@kk01 config]$ scp connect-distributed.properties kk03:$PWD

[nhk@kk01 kafka_2.13-3.0.0]$ scp -r plugins/ kk02:$PWD
[nhk@kk01 kafka_2.13-3.0.0]$ scp -r plugins/ kk03:$PWD
```

### Kafka REST API

​	KafKa Connect在集群模式下的启动，并没有设置输入、输出的属性，而这些Connector都是需要我们后面手动维护的

1）添加一个Connector

```shell
curl -X POST -H 'Content-Type: application/json' -i 'http://kk01:8083/connectors' \
--data \
'{
	"name":"test-file-source",
	"config":{
		"connector.class":"FileStreamSource",
		"tasks.max":3,
		"file":"/home/nhk/test",
		"topic":"connect-cluster-test"
	}
}'
```

2）查看所有的Connector

```shell
curl -X GET 'http://kk01:8083/connectors'
```

3）删除指定的Connector

```sh
curl -X DELETE 'http://kk01:8083/connectors/test-file-source'
```

4）查看指定的Connector的运行状态

```shell
curl -X GET 'http://kk01:8083/connectors/test-file-source/status'
```

5）暂停指定的Connector

```shell
curl -X PUT 'http://kk01:8083/connectors/test-file-source/pause'
```

6）恢复指定的Connector

```shell
curl -X PUT 'http://kk01:8083/connectors/test-file-source/resume'
```

7）重启指定的Connector

```shell
curl -X POST 'http://kk01:8083/connectors/test-file-source/restart'
```

8）查看所有的Task

```shell
curl -X GET 'http://kk01:8083/connectors/test-file-source/tasks'
```

9）查看指定Task的运行状态

```shell
curl -X GET 'http://kk01:8083/connectors/test-file-source/tasks/0/status'
```

10）获取所有Kafka Connect环境中存在的Connector Plugins

```shell
curl -X GET 'http://kk01:8083/connector-plugins'
```

### 第三方插件

​	Kafka原生只有从本地文件读取数据和将数据导出到本地文件，如果需要更加丰富的第三方功能，可以使用第三方查看来实现。

​	现有的第三方插件在CONFLUENT网址可以下载 https://www.confluent.io/hub/



## Streams API

​	Kafka 在0.10 版本之前，仅作为消息的存储系统，开发者如果要对Kafka集群中的数据进行流式计算，需要借助第三方的流计算框架，在 **0.10 版本之后**，**Kafka内置了一个流式处理框架的客户端 Kafka Stream**，开发者可以直接使用以Kafka 为核心构建流式计算系统。

​	Kafka Streams API是Apache Kafka提供的一个用于构建实时流处理应用程序的库。它基于Kafka的消息传递系统，提供了一种简单而强大的方式来处理和分析实时数据流。

​	**Kafka Streams API允许开发人员使用 Java 或 Scala 编写流处理应用程序**，这些应用程序可以从一个或多个Kafka主题中读取数据，并将处理结果写回到一个或多个Kafka主题中。它提供了丰富的操作和转换，可以进行数据转换、过滤、聚合、窗口操作等。

Kafka Streams API的核心概念包括：

1.  流（Stream）：表示一个无界的、有序的数据记录序列。
2.  处理器（Processor）：表示对流进行处理的组件，可以进行数据转换、过滤、聚合等操作。
3.  拓扑（Topology）：表示流处理应用程序的处理逻辑，由多个处理器组成的有向无环图。
4.  状态存储（State Store）：用于存储和访问处理器的状态数据。
5.  时间窗口（Time Window）：用于对流数据进行时间窗口操作，如滑动窗口、会话窗口等。

使用Kafka Streams API可以构建各种实时流处理应用程序，如实时数据分析、实时报表生成、实时推荐系统等。它提供了高度可扩展、容错性强的特性，可以处理大规模的数据流，并保证数据的一致性和可靠性。

需要导入如下依赖

```xml
<dependency>
	<groupId>org.apache.kafka</groupId>
    <artifactId>kafka-streams</artifactId>
    <version>3.0.0</version>
</dependency>
```

### 低级Processor API

需求：词频统计

### 编写代码

```java
package com.clear.kafka.streams;

import org.apache.kafka.streams.processor.Processor;
import org.apache.kafka.streams.processor.ProcessorContext;

import java.util.HashMap;

/**
 * 低级 Peocess API
 * 词频统计
 * 定义 LogProcessor 实现 Processor接口
 */
public class LogProcessor implements Processor<byte[], byte[]> {
    private ProcessorContext processorContext;

    // 初始化上下文对象
    @Override
    public void init(ProcessorContext processorContext) {
        this.processorContext = processorContext;
    }

    // 每接收一条消息时，都会调用该方法处理并更新状态进行存储
    @Override
    public void process(byte[] key, byte[] value) {
        String inputOri = new String(value);
        HashMap<String, Integer> map = new HashMap<>();
        int times = 1;
        if (inputOri.contains("")) {
            // 截取字段
            String[] words = inputOri.split(" ");
            for (String word : words) {
                if (map.containsKey(word)){
                    map.put(word,map.get(word)+1);
                } else {
                    map.put(word,times);
                }
            }
        }
        inputOri = map.toString();
        processorContext.forward(key,inputOri.getBytes());
    }
    // 关闭处理器，这里可以做一些资源清理工作
    @Override
    public void close() {

    }
}
```

测试类

```java
package com.clear.kafka.streams;

import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.processor.Processor;
import org.apache.kafka.streams.processor.ProcessorSupplier;


import java.util.Properties;

// 测试
public class App {
    public static void main(String[] args) {
        // 声明主题来源
        String fromTopic = "test-stream";
        // 声明目标主题
        String toTopic = "test-stream-2";
        // todo 配置 KafkaStreams 参数
        Properties properties = new Properties();
        properties.put(StreamsConfig.APPLICATION_ID_CONFIG,"logProcessor");
        properties.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG,"kk01:9092,kk02:9092,kk03:9092");

        // todo 实例化 StreamsConfig 对象
        StreamsConfig streamsConfig = new StreamsConfig(properties);
        // todo 构建拓扑结构
        Topology topology = new Topology();
        // 添加源处理节点，为源处理节点指定名称和它订阅的主题
        topology.addSource("SOURCE",fromTopic)
                // 添加自定义处理节点，指定处理器类型和上一节点名称
                .addProcessor("PROCESSOR", new ProcessorSupplier() {
                    @Override
                    public Processor get() {
                        return new LogProcessor();
                    }
                },"SOURCE").
                // 添加目标处理节点，需要指定目标处理节点和上一节点的名称
                addSink("SINK",toTopic,"PROCESSOR");
        // todo 实例化 KafkaStreams 对象
        KafkaStreams kafkaStreams = new KafkaStreams(topology, streamsConfig);
        kafkaStreams.start();
    }
}
```

#### 测试

代码编写完成后，在 kk01 节点上创建 test-stream、test-stream-2 主题，命令如下

```shell
[nhk@kk01 ~]$ kafka-topics.sh --bootstrap-server kk01:9092,kk02:9092,kk03:9092 --create --topic test-stream --partitions 3 --replication-factor 3

[nhk@kk01 ~]$ kafka-topics.sh --bootstrap-server kk01:9092,kk02:9092,kk03:9092 --create --topic test-stream-2 --partitions 3 --replication-factor 3
```

创建好主题以后，分别在kk01、kk02上启动生产者、消费者，命令如下

生产者

```shell
[nhk@kk01 ~]$ kafka-console-producer.sh --bootstrap-server kk01:9092,kk02:9092,kk03:9092 --topic test-stream
```

消费者

```shell
[nhk@kk02 ~]$ kafka-console-consumer.sh --bootstrap-server kk01:9092,kk02:9092,kk03:9092 --topic test-stream-2
```

最后，执行App 主程序。此致Kafka所需测试环境准备完成

我们在kk01（生产者）输入 hello world spark scala hello 

如果在kk02（消费者）上看到输出 {spark=1, world=1, scala=1, hello=2}，则说明Kafka Streams成功完成了词频统计需求。

### 高级DSL API

需求：过滤出前缀为a的消息，并删除前缀

#### 编写代码

```scala
package com.clear.kafkastreaming;

import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.*;
import org.apache.kafka.streams.kstream.KStream;

import java.util.Properties;

import java.util.concurrent.CountDownLatch;

/**
 * 高级 DSL API
 */
public class MyStream {
    // 声明输入topic
    private final static String FROM_TOPIC = "test-stream";
    // 声明输出topic
    private final static String TO_TOPIC = "test-stream-2";

    private final static String BOOTSTRAP_SERVERS = "kk01:9092,kk02:9092,kk03:9092";

    // 前缀信息
//    public final static String PREFIX_MSG = "MOVIE_RATING_PREFIX:";
    public final static String PREFIX_MSG = "a";

    public static void main(String[] args) {
        //  提供 Kafka Streams 配置参数
        Properties config = new Properties();
        config.put(StreamsConfig.APPLICATION_ID_CONFIG, "log_App");
        config.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP_SERVERS);
        config.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        config.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());

        // 创建Kafka Streams构建器
        StreamsBuilder builder = new StreamsBuilder();

        // 创建输入主题的KStream
        KStream<String, String> input = builder.stream(FROM_TOPIC);

        // 过滤消息
        KStream<String, String> filtered = input.filter((key, value) -> value.startsWith(PREFIX_MSG))
                .mapValues(value -> value.substring(PREFIX_MSG.length()));

        // 将过滤后的消息发送到输出主题
        filtered.to(TO_TOPIC);

        final Topology topo = builder.build();
        final KafkaStreams streams = new KafkaStreams(topo, config);

        // 启动Kafka Streams应用程序
        streams.start();

        // 添加关闭钩子，以便在应用程序关闭时优雅地关闭Kafka Streams
        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));

//        final CountDownLatch latch = new CountDownLatch(1);
//        Runtime.getRuntime().addShutdownHook(new Thread("stream") {
//            @Override
//            public void run() {
//                streams.close();
//                latch.countDown();
//            }
//        });
//        try {
//            streams.start();
//            latch.await();
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }
//        System.exit(0);
    }
}
```

#### 测试



代码编写完成后，在 kk01 节点上创建 test-stream、test-stream-2 主题，命令如下

```shell
# 创建topic
[nhk@kk01 ~]$ kafka-topics.sh --bootstrap-server kk01:9092 --topic test-stream --partitions 3 --replication-factor 1 --createCreated topic test-stream.

[nhk@kk01 ~]$ kafka-topics.sh --bootstrap-server kk01:9092 --topic test-stream-2 --partitions 3 --replication-factor 1 --create
```

创建好主题以后，分别在kk01、kk02上启动生产者、消费者，命令如下

生产者

```shell
[nhk@kk01 ~]$ kafka-console-producer.sh --bootstrap-server kk01:9092,kk02:9092,kk03:9092 --topic test-stream
```

消费者

```shell
[nhk@kk02 ~]$ kafka-console-consumer.sh --bootstrap-server kk01:9092,kk02:9092,kk03:9092 --topic test-stream-2
```

最后，执行App 主程序。此致Kafka所需测试环境准备完成

我们在kk01（生产者）依次输入 hello world  apche

我们在kk02（消费者中只能看到 pche），如下：

```shell
[nhk@kk01 ~]$ kafka-console-producer.sh --bootstrap-server kk01:9092 --topic 
test-stream>hello
>world
>apache

[nhk@kk02 ~]$ kafka-console-consumer.sh --bootstrap-server kk01:9092 --topic 
test-stream-2
pache
```
