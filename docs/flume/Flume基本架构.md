
# Flume基本架构

Flume的基本组件包括 Event 和 Agent

## Event

- **Event** 是Flume中具有有效负载的字节数据流和可选的字符串属性集，是**Flume传送数据的基本单位**
- Event由 Header 和 Body 组成。
  - Header是一个**Map<String, Stirng>** ，**存储字符串属性集**，为K-V结构
  - Body是一个**字节数组**，存储字节数据

简单来说，Event其实就是Flume框架作者写的一个类似于类的东西



## Agent

Flume运行的核心是 Agent。Flume 已 **Agent 为最小的独立运行单位**，**一个Agent 就是一个JVM**（java虚拟机，Java Virtual Machine），它是一个完整的数据采集工具，包含三个核心组件，分别是

- Source（数据源）
- Channel（数据通道）
- Sink（数据槽）

Agent主要功能：以事件的形式将数据从源头送至目的地



### Source

- Source 是负责接收数据到Flume Agent 的组件，即 Source是数据的接收端，将数据捕获后进行特殊的格式化，将数据封装到 Event 里，然后将Event推入到 Channel。

- Source组件可以处理各种类型、各种格式的日志数据，如下

| 类型                     | 简介                                                                                                                                               |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Netcat Source            | 监控某个端口，读取流经端口的每一个文本行数据                                                                                                       |
| Exec Source              | Source启动的时候会运行一个设置好的Linux命令，该命令不断往标准输出（stdout）中输出数据，这些数据被打包成Event进行处理**（该source不支持断点续传）** |
| Spooling Directoy Source | 监听指定目录，当该目录有新文件出现时，把文件的数据打包成 Event进行处理**（该source支持断点续传，但是时效性不太好）**                               |
| Syslog Source            | 读取 Sylog数据，产生Event，支持UDP和TCP两种协议                                                                                                    |
| Stress Source            | 用于可以配置要发送的事件总数以及要传递的最大事件数，多用于负载测试                                                                                 |
| HTTP Source              | 基于 HTTP POST或 GET方式的数据源，支持JSON、BLOB表示形式                                                                                           |
| Avro Source              | 支持Avro RPC协议，提供了一个 Avro的接口，往设置的地址和端口发送Avro消息，Source就能接收到，例如，Log4j Appender通过Avro Source 将消息发送到Agent   |
| Taildir Source           | **监听实时追加内容的文件**                                                                                                                         |
| Thrift Souce             | 支持 Thrift 协议，提供一个 Thrift接口，类似Avro                                                                                                    |
| JMS Source               | 从Java消息服务读取数据                                                                                                                             |
| Kafka Source             | 从Kafka消息队列中读取中数据，官方描述：Kafka Source 其实就是一个 Kafka Consumer                                                                    |

- 每个Source 可以发送Event到多个Channel中



### Sink

- Sink 是**不断地轮询 Channel 中事件(Event)并且批量地移除它们**，并将这些事件(Event)批量写入到存储或索引系统、或者被发送到另一个 Flume Agent
- Sink常见类型如下

| 类型               | 简介                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------ |
| HDFS Sink          | 将数据写入HDFS，默认格式为 SequenceFile                                                    |
| Logger Sink        | 将数据写入日志文件                                                                         |
| Hive Sink          | 将数据写入Hive                                                                             |
| File Roll Sink     | 将数据存储到本地文件系统，多用作数据收集                                                   |
| HBase Sink         | 将数据写入到HBase                                                                          |
| Thrift Sink        | 将数据转换到Thrift Event后，发送到配置的RPC端口上                                          |
| Avro Sink          | 将数据转换到Avro Event后，发送到配置的RPC端口上                                            |
| Null Sink          | 丢弃所有的数据                                                                             |
| ElasticSearch Sink | 将数据发送到 ElasticSearch 集群上                                                          |
| Kite Dataset Sink  | 写数据到 Kite Dataset，试验性质                                                            |
| Kafka Sink         | 官方描述：Kafka Sink 能向Kafka 的topic 写入数据（Kafka Sink其实就是Kafka Producer 的实现） |

- 每个Sink只能从一个Channel中获取数据



### Channel

- Channel 是位于 Source 和 Sink 之间的组件，可以看做是数据的缓冲区（数据队列），它可以将事件暂存到内存中，也可以将事件持久化到本地磁盘上，直到 Sink处理完该事件。
- Channel **允许 Source 和 Sink运作在不同的速率上**。
- Channel 是**线程安全**的，可以同时处理几个 Source 的写入操作和几个Sink 的读取操作

- Channel的常见类型如下 （其中 Memory、File是Flume自带的）

| 类型           | 简介                                                                                                                                                 |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Memory Channel | 数据存储到内存的队列中，可以实现高速的数据吞吐，**Flume出现故障时，数据会丢失**                                                                      |
| File Channel   | 数据存储到磁盘文件中，可以持久化所有的Event，Flume出现故障时，数据不会丢失**（该File在内存中有索引机制，加快读取速率，并且索引会在磁盘做两次备份）** |
| JDBC Channel   | 数据持久化到数据库中                                                                                                                                 |
| Kafka Channel  | 数据存储到Kafka集群中                                                                                                                                |
| Custom Channel | 自定义Channel                                                                                                                                        |

### 小结

​	Flume 提供了大量内置的 Source、Channel、Sink 类型。不同类型的 Source、Channel、Sink 可以自由组合。组合方式基于用户设置的配置文件，非常灵活。例如，Channel可以把Event（事件）暂存在内存里，也可以将Event（事件）持久化到本地磁盘上；Channel 可以把日志写入HDFS、HBase，甚至另外一个 Source。


