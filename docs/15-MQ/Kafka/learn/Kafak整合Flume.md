# Kafka 整合 Flume

## 部署实现方式

Kafka整合Flume有两种实现方式：

-   从Flume采集数据到Kafka中进行传输
-   从Kafka中获取数据，使用Flume进行消费数据的方式

## 创建整合的Topic

```shell
# 创建第一个flume整合Kafka的topic
[nhk@kk01 ~]$ kafka-topics.sh --bootstrap-server kk01:9092,kk02:9092,kk03:9092 --topic flume-kafka --create --partitions 3 --replication-factor 1

# 创建第二个flume整合Kafka的topic
[nhk@kk01 ~]$ kafka-topics.sh --bootstrap-server kk01:9092,kk02:9092,kk03:9092 --topic kafka-flume --create --partitions 3 --replication-factor 1
```

## 配置Flume-Agent

### 配置文件 flume-kafka-sink.conf

在 ${FLUME_HOME}/job目录下创建 flume-kafka-sink.conf 配置文件

```shell
[nhk@kk01 job]$ pwd
/opt/software/flume/job
[nhk@kk01 job]$ vim flume-kafka-sink.conf 
```

flume-kafka-sink.conf 配置文件内容如下

```shell
# 1.定义组件
a1.sources = r1
a1.channels = c1
a1.sinks = k1

# 2.配置sources
a1.sources.r1.type = netcat
a1.sources.r1.bind = kk01
a1.sources.r1.port = 44444

# 3.配置channels
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 20

# 4.配置sinks
a1.sinks.k1.type = org.apache.flume.sink.kafka.KafkaSink
a1.sinks.k1.kafka.bootstrap.servers = kk01:9092,kk02:9092,kk03:9092
a1.sinks.k1.kafka.topic = flume-kafka
a1.sinks.k1.kafka.producer.acks = 1
a1.sinks.k1.kafka.producer.linger.ms = 10
k1.sinks.sinks.kafka.batchSize = 50

# 5.组装
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
```



### 配置文件 kafka-flume-sink.conf

在 ${FLUME_HOME}/job目录下创建 kafka-flume-sink.conf 配置文件

```shell
[nhk@kk01 job]$ pwd
/opt/software/flume/job
[nhk@kk01 job]$ vim kafka-flume-sink.conf
```

kafka-flume-sink.conf 配置文件内容如下

```shell
# 1.定义组件
a1.sources = r1
a1.channels = c1
a1.sinks = k1

# 2.配置sources
a1.sources.r1.type = org.apache.flume.source.kafka.KafkaSource
a1.sources.r1.batchSize = 1000
a1.sources.r1.batchDurationMillis = 2000
a1.sources.r1.kafka.bootstrap.servers = kk01:9092,kk02:9092,kk03:9092
a1.sources.r1.kafka.topics = kafka-flume
a1.sources.r1.kafka.consumer.group.id = test

# 3.配置channels
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 500

# 4.配置sinks
a1.sinks.k1.type = logger
a1.sinks.k1.maxBytesToLog = 128

# 5.组装
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
```



## 测试

测试通过flume将 44444端口的数据采集到Kafka 

```shell
[nhk@kk01 flume]$ bin/flume-ng agent -n a1 -c conf/ -f job/flume-kafka-sink.conf -Dflume.root.logger=INFO,console
```

启动nc

```shell
[nhk@kk01 ~]$ nc kk01 44444
```

再启动一个Kafka消费者

```shell
[nhk@kk01 ~]$ kafka-console-consumer.sh --bootstrap-server kk01:9092,kk02:9092,kk03:9092 --topic flume-kafka
```

在44444 端口发送消息，如果Kafka消费者能消费到数据，则说明 nc --> flume --> Kafka(topic flume-kafka) 这条通道打通了



测试通过flume将 Kafka中的数据打印到log

```shell
[nhk@kk01 flume]$ bin/flume-ng agent -n a1 -c conf/ -f job/kafka-flume-sink.conf -Dflume.root.logger=INFO,console
```

启动Kafka生产者

```shell
[nhk@kk01 ~]$ kafka-console-producer.sh --bootstrap-server kk01:9092,kk02:9092,kk03:9092 --topic kafka-flume 
```

生产者生产消息，如果能在flume的控制台看到打印出日志，说明 kafka(topic kafka-flume) --> flume --> log 这条通道打通了

