# 0 JMS规范介绍

## 0.1 JMS简介

​	JMS，全称**Java Message Service**，即Java消息服务应用程序接口，是一个Java平台中关于面向消息中间件的API，用于在两个应用程序之间、或者分布式系统中发送消息，进行异步通信。

​	JMS是一种与厂商无关的API，用来访问消息、收发系统消息，它类似于JDBC。

​	JMS可以自己使用Java代码或者别的代码来编写，开源的实现有 Active MQ、阿里的Rocket MQ（已捐献给Apache）、Kafka等

## 0.2 JMS核心组件

| 组件名称  | 作用                                                         |
| --------- | ------------------------------------------------------------ |
| JMS提供者 | 连接面向消息中间件，是JMS接口的一个实现。<br>提供者可以是Java平台的JMS实现，也可以是非Java平台的面向消息中间件的适配器 |
| JMS客户   | 生成或消费基于消息的Java应用程序或对象                       |
| JMS生产者 | 创建并发送消息的JMS客户                                      |
| JMS消费者 | 接收消息的JMS客户                                            |
| JMS消息   | 包含可以在JMS客户之间传递的数据的对象                        |
| JMS队列   | 一个容纳那些被发送的等待阅读的消息的区域。<br>与队列名字所暗示的意义不同，消息的接收顺序并不一定要与消息的发送顺序一致。<br>一旦一个消息被阅读，该消息将被从队列中移走。 |
| JMS主题   | 一种支持发送消息给多个订阅者的机制                           |

## 0.3 JMS对象模型

| 组件              | 功能                                                         |
| ----------------- | ------------------------------------------------------------ |
| ConnectionFactory | 创建Connection对象的工厂，针对两种不同的JMS消息模型，分别有QueueConnectionFactory和TopicConnectionFactory两种。<br>可以通过JNDI来查找ConnectionFactory对象模型。 |
| Connection        | Connection表示在客户端和JMS系统之间建立的连接（针对TCP/IP包的封装）。Connection可以产生一个或多个Session。跟ConnectionFactory一样，Connection也有两种类型：QueueConnection和TopicConnection |
| Session           | Session是操作消息的接口。可以通过Session创建生产者、消费者、消息等。<br>Session提供了事务的功能。<br>当需要使用Session发送/接收多个消息时，可以将这些发送、接收的动作放到一个事务中。同样，也分QueueSession和TopicSesseion |
| MessageProducer   | 消息生产者由Session创建，并用于将消息发送到Destination。同样，消息生产者分两种：QueueSender、TopicPublisher。可以调用消息生产者的方法（send或publish方法）发送消息。 |
| MessageConsumer   | 消息消费者由Session创建，用于接收被发送到Destination的消息。同样，消息消费者分两种：QueueReceiver、TopicSubscriber。<br>可以通过Session的creareReceiver(Queue)或creareSubscriber(Topic)来创建。当然，也可以用Session的createDurableSubscriber方法创建持久化的订阅者。 |
| Destination       | Destination的意思是消息生产者的消息发送目标或消费者消费数据的来源。<br>对于消息生产者来说，它的Destination是某个队列或某个主题。<br>对于消息消费者来说，它的Destination也是某个队列或某个主题。 |

## 0.4 JMS消息传输模型

在JMS标准中，有两种消息模型：P2P、Pub/Sub

### 0.4.1 P2P 点对点模型

​	点对点消息传递模式（Point to Point，P2P），在该模式中，通常是基于拉取或者是轮询的消息传递模式，消息是通过一个虚拟通道进行传递的，**生产者发送一条数据，消息将持久化到队列中**，此时将有一个或多个消费者会在消费队列中的数据，但是**一条消息只能消费一次，且消费后的数据会从消息队列中删除**，因此，即使有多个消费者同时消费数据，数据都可以被有序处理。

​	简单来说，就是**消费者主动拉取（pull）数据，消息收到后清除队列中的消息**

**P2P消息传输模型特点**

-   每一个消息只有一个消费者(Consumer)，即一旦消息被消费，就会从消息队列中移除，不再存储与消费队列中了

-   发送者和消费者之间没有时间上的依赖性，也就是说当生产者发送了消息之后，不管消费者有没有正在运行，都不会影响消息发送到消息队列中。

-   消费者在成功消费消息后，需要向消息队列中发送确认收到通知（acknowlegment）

### 0.4.2 Pub/Sub 发布/订阅模型

​	发布订阅消息传递模式（Publish/Subscribe），是一个基于推送的消息传送模式，在该模式中，**发布者用于发布消息，订阅者用于订阅消息**。发布订阅模式可以有多种不同的订阅者，**发布者发布的消息会被持久化到一个主题中**，与 点对点模式 不同，订阅者可以订阅一个或多个主题，订阅者可以拉取（pull）该主题中的所有数据，同一条数据可以被多个订阅者消费，**消息被消费后也不会被立即删除。**

​	简单来说，就是**可以有多个主题，消费者消费数据后，不删除数据，每个消费者相互独立，都可以消费到相同的数据**

**Pub/Sub消息传输模型特点**

-   每个消息可以有多个消费者

-   **发布者和订阅者之间有时间上的依赖性**。针对某个主题（Topic）的订阅者，它必须创建一个或多个订阅者之后，才能消费发布者的消息，而且为了消费消息，订阅者必须保持运行的状态。	

-   为了缓和这样的严格的时间相关性，JMS允许订阅者创建一个可持久化的订阅者。这样，即便订阅者没有运行，他也能接收到发布者的消息。

## 0.5 消息接收

在JMS中，消息的接收可以使用以下两种方式

-   同步：使用同步方式接收消息的话，消息订阅者调用receive()方法。在receive()方法中，消息未达到或到达指定时间之前，方法会阻塞，直到消息可用。

-   **异步**：使用异步方式接收消息的话，**消息订阅者需要注册一个消息监听者**，类似于事件监听器，只要消息到达，JMS服务提供者会调用监听器的 onMessage() 方法递送消息

## 0.6 JMS消息结构

消息（Message）主要由三部分组成，分别是Header、Properties、Body。

-   Headr：消息头，所有类型的消息这部分都是一样的。

-   Properties：消息属性，按类型可以划分应用设置属性、标准属性、消息中间件定义的属性

-   Body：消息正文，指按我们具体需要消息传输的内容



# 1 Kafka概述

## 1.1 Kafka简介

-   Apache Kafka是一个开源的`消息系统`、一个开源分布式流平台，由Scala编写。		
-   Kafka最初是LinkedIn 开发，并于2011年初开源。2012年10月从Apache LinkedIn毕业。
-   设计目标是：为处理实时数据提供一个**统一、高吞吐、低等待**的平台。
-   Kafka是一个分布式消息队列。它提供了类似于 JMS 的特性，但是设计实现上完全不同，此外它并不是JMS规范的实现。
-   Kafka对消息保存时根据 Topic 进行归类，发送消息者为Producer，消息接收者为Conumser，此外Kafka集群有多个Kafka实例组成，每个实例（Server）称为 broker；
-   无论是Kafka集群，还是 Producer、Conusmer都依赖于Zookeeper集群保存的一些meta信息，来保证系统的可用性。

## 1.2 定义

**Kafka传统定义**

-   Kafka是一个**分布式**的基于**发布/订阅模式**的**消息队列**（Message Queue），主要应用于大数据实时处理领域

**发布/订阅**

-   消息的发布者不会将消息直接发送给特定的订阅者，而是**将发布的消息分为不同的类别**，订阅者**只接收感兴趣的消息。**

**Kafka最新定义**

-   Kafka是一个开源的**分布式事件流平台**（Event Streaming Platfrom），被数千家公司用于高性能数据**流通管道、流分析、数据集成和关键任务应用。**



## 1.3 消息队列

常见的消息队列产品主要有 Kafka、ActiveMQ、RabbitMQ、RocketMQ等

在大数据场景下，主要使用Kafka作为消息队列。在JavaEE开发中主要采用ActiveMQ、RabbitMQ、RocketMQ

### 1.3.1 消息队列应具备的能力

-   存储能力，可以存储信息。也就是一个消息容器，一般采用**队列**的结构。

-   消息的入队能力，即生产消息。

-   消息的出队能力，即消费消息。

### 1.3.2 传统消息队列的应用场景

传统消息队列的应用场景主要包括：**缓存/消峰（消除峰值）、解耦和、异步通信**

**缓存/消峰（消除峰值）**

-   高流量的时候，使用消息队列作为中间件可以将流量的高峰保存在消息队列中，从而防止了系统的高请求，减轻服务器的请求处理压力

**解耦合**

-   耦合的状态表示当你实现某个功能的时候，是直接接入当前接口，而利用消息队列，可以将相应的消息发送到消息队列，这样的话，如果接口出了问题，将不会影响到当前的功能。

**异步通信**

-   异步处理替代了之前的同步处理，异步处理不需要让流程走完就返回结果，**可以将消息发送到消息队列中**，然后返回结果，**剩下让其他业务处理接口从消息队列中拉取消费处理即可**。

    

### 1.3.3 消息队列的两种模式

#### 1.3.3.1 P2P 点对点模式

​	点对点消息传递模式（Point to Point，P2P），在该模式中，通常是基于拉取或者是轮询的消息传递模式，消息是通过一个虚拟通道进行传递的，生产者发送一条数据，消息将持久化到队列中，此时将有一个或多个消费者会在消费队列中的数据，但是**一条消息只能消费一次，且消费后的数据会从消息队列中删除**，因此，即使有多个消费者同时消费数据，数据都可以被有序处理。

​	简单来说，就是**消费者主动拉取数据，消息收到后清除队列中的消息**

#### 1.3.3.2 Pub/Sub 发布/订阅模式

​	发布订阅消息传递模式（Publish/Subscribe），是一个基于推送的消息传送模式，在该模式中，**发布者用于发布消息，订阅者用于订阅消息**。发布订阅模式可以有多种不同的订阅者，**发布者发布的消息会被持久化到一个主题中**，与	点对点模式不同，订阅者可以订阅一个或多个主题，订阅者可以拉取该主题中的所有数据，同一条数据可以被多个订阅者消费，**消息被消费后也不会被立即删除。**（Kafka会默认保留一段时间，然后再删除。）

​	简单来说，就是**可以有多个主题，消费者消费数据后，不删除数据，每个消费者相互独立，都可以消费到相同的数据**



## 1.4 Kafka与Flume的区别与联系

Kafka 与 Flume的很多功能确实是重叠的，二者的联系与区别如下：

-   **Kafka是一个通用型系统，可以有许多生产者和消费者共享多个主题。**相反地，**Flume被设计成特定通途的系统，只向HDFS和HBase发送数据。**Flume为了更好的为HDFS服务而做了特定的优化，并且与Hadoop的安全体系整合在了一起。因此，如果数据需要被多个应用程序消费，推荐使用Kafka；如果数据只是面向Hadoop的，推荐使用Flume

-   Flume拥有各种配置的数据源（Source）和数据槽（Sink），而Kafka拥有的是非常小的生产者和消费者环境体系。**如果数据源已经确定，不需要额外的编码，那么推荐使用Flume提供的数据源和数据槽**。反之，**如果需要准备自己的生产者和消费者，那么就适合使用Kafka。**

-   Flume可以在拦截器里面实时处理数据，这个特性对应过滤数据非常有用。Kafka需要一个外部系统帮助处理数据。

-   无论是Kafka还是Flume，都可以保证不丢失数据。

-   Flume和Kafka可以一起工作。**Kafka是分布式消息中间件，自带存储空间，更适合做日志缓存**。**Flume数据采集部分做得更好，可用于采集日志**，然后把采集到的日志发送到Kafka中，再由Kafka把数据传送给Hadoop、Spark等消费者

    

## 1.5 Kafka基本架构

1、为了方便扩展，并提高吞吐量，**一个topic分为多个partition**

2、配合分区的设计，提出消息者组的概念，组内每个消息者并行消费

3、为提高可用性，为每个partition增加若干副本，类似Hadoop NameNode HA

4、zk中记录谁是leader，Kafka2.8.0以后也可以配置不采用ZK



​	Kafka像其他Mq一样，也有自己的基础架构，主要存在生产者Producer、Kafka集群Broker、消费者Consumer、注册消息Zookeeper.

Kafka系统包含了许多组件，如下

| 组件名称                              | 相关说明                                                     |
| ------------------------------------- | ------------------------------------------------------------ |
| Producer <br>消息生产者               | 生成者即数据的发布者，向Kafka中发布消息的角色                |
| Consumer<br> 消息消费者               | 即从Kafka中拉取消息消费的客户端                              |
| Consumer Group（CG）<br/>消息消费者组 | 消费者组，由多个consumer组成。<br>消费者组内每个消费者负责消费不同分区的数据，**一个分区中的消息只能够一个消费者组中的一个消费者所消费**，消费者消费Broker中当前Topic的不同分区中的消息，**消费者组之间互不影响**，所有的消费者都属于某个消费者组（若未指定消费者组，默认一个消费者就是在一个组中），即**消费者组是逻辑上的一个订阅者**。 |
| Broker <br/> 经纪人                   | **一台Kafka服务器就是一个Broker，一个集群由多个Broker组成，一个Broker可以容纳多个Topic** |
| Topic<br/> 主题                       | 可以理解为一个队列，**生产者和消费者都是面向一个Topic**      |
| Partition 分区                        | 为了实现扩展性，一个非常大的Topic可以分布到多个Broker上，一个Topic可以分不到多个Broker（即服务器）上，**一个topic可以分为多个partition**，每个partition是一个**有序的队列**(分区有序，不能保证全局有序) |
| Replicas 副本Replication              | 为保证集群中某个节点发生故障，节点上的Partition数据不丢失，Kafka可以正常 工作，Kafka提供了副本机制，一个Topic的每个分区有若干个副本，**一个Leader和多个Follower** |
| Segment 分段                          | partition物理上由多个segment组成，每个 Segment存着 message信息。 |
| Leader                                | 每个分区多个**副本的主角色**，生产者发送数据的对象，以及消费者消费数据的对象都是Leader |
| Follower                              | 每个分区多个**副本的从角色**，实时的从Leader中同步数据，保持和Leader数据的同步，Leader发生故障的时候，某个Follower会成为新的Leader。 |





# 2 Kafka集群部署

Kafka集群部署依赖于 Java环境 和 Zookeeper服务

## 集群规划

| kk01       | kk02       | kk03       |
| ---------- | ---------- | ---------- |
| zk、broker | zk、broker | zk、broker |

## 1）下载、解压安装包

访问Kafka官网下载安装包即可（为了方便Kafka与Spark整合，因此选择**Kafka版本时要与Scala版本保持一致**）

下载完成后，上传安装包至 /opt/software/目录下，并**解压至/opt/software目录下**

```shell
[nhk@kk01 software]$ tar -zxvf kafka_2.13-3.0.0.tgz -C /opt/software/

# 说明 
# 2.13 表示Scala版本
# 3.0.0 表示Kafka版本
```

## 2）修改解压后的文件名称（可选） 

为了区分版本，我们就不做此操作

```shell
[nhk@kk01 software]$ mv kafka_2.13-3.0.0 kafka-3.0.0
```

## 3）修改配置文件server.properties

进入/opt/software/kafka_2.13-3.0.0/config目录下，**修改配置文件server.properties**

```shell
[nhk@kk01 config]$ pwd
/opt/software/kafka_2.13-3.0.0/config
[nhk@kk01 config]$ vim server.properties 
```

参考配置文件如下

```properties
# broker的全局唯一编号，不可重复,且必须为数字
broker.id=0

# 用来监听链接的端口，producer 或 consumer 将在此端口建立连接
port=9092
# 处理网络请求的线程数量
num.network.threads=3
# 用来处理磁盘IO的线程数量
num.io.threads=8
# 发送套接字的缓冲区大小
socket.send.buffer.bytes=102400
# 接收套接字的缓冲区大小
socket.receive.buffer.bytes=102400
# 请求套接字的缓冲区大小
socket.request.max.bytes=104857600

# kafka运行日志（数据）存放的路径，路径不需要提前创建，kafka会自动创建
# 且可以配置多个磁盘路径，路径与路径之间可以用“, ”分隔
log.dirs=/opt/software/kafka_2.13-3.0.0/datas

# topic在当前 broker 上的分区个数
num.partitions=1
# 用来恢复和清理 data 下数据的线程数量
num.recovery.threads.per.data.dir=1
# 每个topic创建时的副本数，默认是1个副本
offsets.topic.replication.factor=1
# segment 文件保留的最长时间，超时将被删除
#log.retention.hours=168
log.retention.hours=1
# 滚动生成新的 segment 文件的最大时间
log.roll.hours=1
# 日志文件中每个 segment 文件的大小，默认最大1G
log.segment.bytes=1073741824
# 检查过期数据的时间（周期性检查文件大小的时间），默认5分钟检查一次是否数据过期
log.retention.check.interval.ms=300000
# 日志清理是否打开
log.cleaner.enable=true

# broker需要使用zookeeper保存meta数据
# 配置连接 zookeeper 集群地址(在zk根目录下创建/kafka，方便管理)
zookeeper.connect=kk01:2181,kk02:2181,kk03:2181/kafka

# zookeeper链接超时时间（默认 6000ms）
zookeeper.connection.timeout.ms=6000
# partion buffer中，消息的条数达到阈值时，将触发flush到磁盘的操作
log.flush.interval.messages=10000
# 消息缓冲的时间，达到阈值时，将触发flush到磁盘的操作
log.flush.interval.ms=3000

# 删除topic （一般不设置）
delete.topic.enable=true

# 设置本机主机（可以不配置）
host.name=kk01
```

关于server.properties文件核心参数介绍如下：

-   **broker.id**：集群中每个节点的唯一且永久的名称，**该值必须大于等于0**，我们有三台机器kk01、kk02、kk03，我们将此参数依次设置为 0、1、2
-   **log.dirs**：指定运行日志（数据）存放的地址，**可以指定多个目录，并以逗号分隔**
-   **zookeeper.connect**：指定zookeeper集群中的IP与端口号
-   **delete.topic.enable**：是否允许删除topic，如果设置为true，表示允许删除，**默认为false**，则删除topic时，会标记为delete
-   **host.name**：设置本机ip地址。
    -   若设置错误，则客户端会抛出Producer connection to localhost:9092 unsuccessful 的异常信息

## 4）分发安装包

```shell
[nhk@kk01 software]$ pwd
/opt/software
[nhk@kk01 software]$ scp -r kafka_2.13-3.0.0/ kk02:/opt/software/

[nhk@kk01 software]$ scp -r kafka_2.13-3.0.0/ kk03:/opt/software/
```

## **5）**修改broker.id

分发完成后，分别在kk02、kk03上修改配置文件 /opt/software/kafka_2.13-3.0.0/config/server.properties中的

​	broker.id、host.name参数

**注意：broker.id不得重复，在整个集群中唯一**

```shell
[nhk@kk02 ~]$ cd /opt/software/kafka_2.13-3.0.0/config/
[nhk@kk02 config]$ vim server.properties 
# 修改内容如下

broker.id=1
# 本机ip
host.name=kk02


[nhk@kk03 ~]$ cd /opt/software/kafka_2.13-3.0.0/config/
[nhk@kk03 config]$ vim server.properties 
# 修改内容如下

broker.id=2
# 本机ip
host.name=kk03
```

## 6）修改环境变量

在/etc/profile 文件中新增kafka环境变量配置

```shell
[nhk@kk01 config]$ vim /etc/profile
# 在文件末尾添加如下内容

# kafka环境变量
export KAFKA_HOME=/opt/software/kafka_2.13-3.0.0
export PATH=$PATH:$KAFKA_HOME/bin

# 刷新环境变量
[nhk@kk01 config]$ source /etc/profile
```

## 7）分发环境变量到其他节点，并source

```shell
[nhk@kk01 config]$ scp /etc/profile kk02:/etc/profile
[nhk@kk01 config]$ scp /etc/profile kk03:/etc/profile

[nhk@kk02 config]$ source /etc/profile
[nhk@kk03 config]$ source /etc/profile
```

至此，Kafka集群配置完成

## 8）启动Kafka服务

启动Kafka服务之前，需要**先启动Zookeeper集群服务**。

```shell
# 在三台机器上依次输入 zkServer.sh start 启动zk服务

# 也可以一键脚本启动 zk集群（因为我们在部署zk集群时，编写了zk.sh脚本）
[nhk@kk01 config]$ zk.sh start
----------------zookeeper kk01 start------------------------
ZooKeeper JMX enabled by default
Using config: /opt/software/zookeeper-3.6.1/bin/../conf/zoo.cfg
Starting zookeeper ... STARTED
----------------zookeeper kk02 start------------------------
ZooKeeper JMX enabled by default
Using config: /opt/software/zookeeper-3.6.1/bin/../conf/zoo.cfg
Starting zookeeper ... STARTED
----------------zookeeper kk03 start------------------------
ZooKeeper JMX enabled by default
Using config: /opt/software/zookeeper-3.6.1/bin/../conf/zoo.cfg
Starting zookeeper ... STARTED
```

zk服务启动后，就可以**通过Kafka根目录下bin/kafka-server-start.sh 脚本启动Kafka服务**

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-server-start.sh config/server.properties 

[nhk@kk02 kafka_2.13-3.0.0]$ bin/kafka-server-start.sh config/server.properties

[nhk@kk03 kafka_2.13-3.0.0]$ bin/kafka-server-start.sh config/server.properties

#  执行上述命令后，若控制台输出的消息没有异常，则表示Kafka服务启动成功

# 另外打开一个终端，查看Kafka服务进程
[nhk@kk01 bin]$ jps
3143 QuorumPeerMain
3642 Jps
3230 Kafka
```

注意：

-   **Kafka服务启动后，当前终端不能关闭，因为如果一旦关闭了，Kafka服务就停止了**
-   如果Kafka集群无法正常开启，有一个简单粗暴的方法，就是删除所有及其下的datas目录、logs目录、及其zookeeper中的 /kafka目录，再重启启动



## 集群启停脚本

1）在/home/nhk/bin目录下（用户家目录的bin目录下，我们以nhk用户为例）**创建文件kafka.sh脚本文件**

```shell
[nhk@kk01 bin]$ pwd
/home/nhk/bin
[nhk@kk01 bin]$ vim kafka.sh
```

脚本如下

```shell
#！/bin/bash

case $1 in
"start"){
	for host in kk01 kk02 kk03
	do
		echo "--------启动 $host KafKa--------"
		ssh $host "/opt/software/kafka_2.13-3.0.0/bin/kafka-server-start.sh -daemon /opt/software/kafka_2.13-3.0.0/config/server.properties"
	done
	
};;
"stop"){
	for host in kk01 kk02 kk03
	do
		echo "--------停止 $host KafKa--------"
		ssh $host "/opt/software/kafka_2.13-3.0.0/bin/kafka-server-stop.sh "
	done
};;
*)
        echo '输入参数有误(请输入:start|stop)!'
esac
```

**2）为脚本添加执行权限**

```shell
[nhk@kk01 bin]$ chmod +x kafka.sh 
[nhk@kk01 bin]$ ll
total 8
-rwxr-xr-x. 1 nhk nhk 457 May  4 21:32 kafka.sh
```

3）启动集群命令

```shell
kafka.sh start
```

4）停止集群命令

```shell
kafka.sh stop
```

注意：

-   ​	停止Kafka集群时，一**定要等Kafka所有节点进程全部停止以后，再停止Zookeeper集群**。因为Zookeeper集群中记录者Kafka集群相关信息，Zookeeper集群一旦先停止了，Kafka集群就没有办法在获取停止的信息，此时就只能手动杀手Kafka进程了



# 3 Kafka 命令行操作

## 3.1 主题命令行操作

在kafka解压包的bin目录下，有一个 kafka-topics.sh 文件，通过该脚本文件就可以操作与主题组件相关的功能（前面配置了环境变量，所以可以在任何目录下访问bin目录下的所有文件）

**1）查看操作主题命令参数**

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-topics.sh
```

常用参数

| 参数                                                  | 描述                                                         |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| **--bootstrap-server <String: server to connect to>** | 连接的Kafka Broker主机名称和端口号<br>（即指定kafka的broker服务器列表） |
| --topic <String: topic>                               | 操作的topic名称                                              |
| --topics-with-overrides                               | 如果设置，查看主题描述时，仅仅显示被覆盖的配置               |
| **--create**                                          | 创建主题                                                     |
| **--delete**                                          | 删除主题                                                     |
| **--alter**                                           | **修改主题的分区数量、副本、配置等**                         |
| --list                                                | 查看所有主题                                                 |
| --describe                                            | 查看主题详细描述                                             |
| --partitions <Integer: # of partitions>               | 设置分区数                                                   |
| --replication-factor <Integer: replication factor>    | 设置分区副本                                                 |
| --config <String: name=value>                         | 更新系统默认的配置                                           |
| --disable-rack-aware                                  | 关闭机架感知副本分配                                         |
| --force                                               | 强制执行                                                     |
| --if-exists                                           | 当更新或删除topic时，这些操作当且仅当topic存在时才会执行     |
| --if-not-exists                                       | 如果创建topic，这些操作当且仅当topic不存在时才会执行         |
| --zookeeper <String: hosts>                           | zookeeper的连接地址，格式：host:port。该参数不推荐使用，已经使用 --bootstrap-server 代替了 |

**2）查看当前服务器中的所有topic（主题）**

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-topics.sh --bootstrap-server kk01:9092 --list

[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-topics.sh --bootstrap-server kk01:9092,kk02:9092,kk03:9092 --list
```

**3）创建 first topic**

即创建名为 first 的主题

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-topics.sh --bootstrap-server kk01:9092 --create --partitions 1 --replication-factor 3 --topic first
Created topic first.

 
# 参数说明
#	--topic	定义topic名
#	--replication-factor 副本因子，定义副本数（副本因子不能大于 broker的数量）
# 	--partitions 定义分区数
```

​	主题创建成功后，就可以创建生产者生成消息，用来模拟生成环境中源源不断的消息，**bin目录中的kafka-console-producer.sh 文件，可以使用生产者组件相关的功能**，如向主题发送消息数据的功

**4）查看 first主题的详情**

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-topics.sh --bootstrap-server kk01:9092 --topic first --describe
Topic: first	TopicId: o8-iZDWFTimnBAdYVjga3A	PartitionCount: 1	ReplicationFactor: 3	Configs: flush.ms=3000,segment.bytes=1073741824,flush.message
s=10000	Topic: first	Partition: 0	Leader: 1	Replicas: 1,2,0	Isr: 2,1,0
```

**5）修改分区数**

**注意：**

​	可以修改主题分区、配置信息等，**不能修改副本因子**

​	**分区数只能增加，不能减少**

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-topics.sh --bootstrap-server kk01:9092 --alter --topic first --partitions 3
```

创建成功的 topic保存在 server.properties 文件配置的参数指定的路径，如下

```shell
log.dirs=/opt/software/kafka_2.13-3.0.0/datas	
```

```shell
[nhk@kk01 datas]$ pwd
/opt/software/kafka_2.13-3.0.0/datas    # 我们创建的topic保存的路径
[nhk@kk01 datas]$ ll
total 16
-rw-rw-r--. 1 nhk nhk   0 Jun 20 04:27 cleaner-offset-checkpoint
drwxrwxr-x  2 nhk nhk 167 Jun 24 03:40 first-0	# first-0 first-1 first-2表示分区数为3
drwxrwxr-x  2 nhk nhk 167 Jun 24 04:27 first-1
drwxrwxr-x  2 nhk nhk 167 Jun 24 04:27 first-2
-rw-rw-r--  1 nhk nhk   4 Jun 24 04:28 log-start-offset-checkpoint
-rw-rw-r--  1 nhk nhk  88 Jun 24 04:22 meta.properties
-rw-rw-r--  1 nhk nhk  34 Jun 24 04:28 recovery-point-offset-checkpoint
-rw-rw-r--  1 nhk nhk  34 Jun 24 04:29 replication-offset-checkpoint
```

6）再次查看 first主题的详情

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-topics.sh --bootstrap-server kk01:9092 --describe --topic first
Topic: first	TopicId: o8-iZDWFTimnBAdYVjga3A	PartitionCount: 3	ReplicationFactor: 3	Configs: flush.ms=3000,segment.bytes=1073741824,flush.message
s=10000	
	Topic: first	Partition: 0	Leader: 1	Replicas: 1,2,0	Isr: 2,1,0
	Topic: first	Partition: 1	Leader: 2	Replicas: 2,1,0	Isr: 2,1,0
	Topic: first	Partition: 2	Leader: 0	Replicas: 0,2,1	Isr: 0,2,1

# 说明
# Topic: first 表示topic名称为first
# PartitionCount: 3 表示分区数为3
# ReplicationFactor: 3 副本因子为3，即当前topic的分区数据有3份副本
# segment.bytes=1073741824 segment为1g

# Replicas: 1,2,0 表示当前分区的副本部署在了 1,2,0 这3个节点 （1，2，0表示的是broker.id）
# Isr: 2,1,0 表示 2,1,0 这3个节点都是存活的
# Leader: 1 表示该分区中哪一个副本为leader
```

**7）删除topic**

删除topic删除，在生产环境中，切记请勿使用

​	删除的时候只是被**标记为删除marked for deletion并没有真正的删除**，如果需要真正的删除，需要再config/server.properties 中设置 delete.topic.enable=true

```shell
# 使用删除命令后，仅仅是在first-0 first-1 first-1 分区文件后面标记为了delete
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-topics.sh --bootstrap-server kk01:9092 --delete --topic first
[nhk@kk01 kafka_2.13-3.0.0]$ ll ./datas/
total 20
....
drwxr-xr-x. 2 nhk nhk 204 May  5 07:59 first-0.b783d24ceb284889a24db1827faa2442-delete
drwxr-xr-x. 2 nhk nhk 204 May  5 07:59 first-1.f4520b48723c46b39fc3e04eaf9aea02-delete
drwxr-xr-x. 2 nhk nhk 204 May  5 07:59 first-2.9372cb93fb68472fad9c5c7b86eaa0a4-delete
-rw-r--r--. 1 nhk nhk   4 May  5 08:04 log-start-offset-checkpoint
-rw-r--r--. 1 nhk nhk  88 May  5 07:59 meta.properties
-rw-r--r--. 1 nhk nhk 409 May  5 08:04 recovery-point-offset-checkpoint
-rw-r--r--. 1 nhk nhk 409 May  5 08:04 replication-offset-checkpoint
```



## 3.2 生产者命令行操作

在kafka解压包的bin目录下，有一个 kafka-console-producer.sh 文件，通过该脚本文件就可以操作与生产者组件相关的功能，如向主题发送消息数据的功能

### 1）查看操作生产者命令参数

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-console-producer.sh
```

常用参数

| 参数                                            | 描述                               |
| ----------------------------------------------- | ---------------------------------- |
| -bootstrap-server <String: server toconnect to> | 连接的Kafka Broker主机名称和端口号 |
| --topic <String: topic>                         | 操作的topic名称                    |

### 2）发送消息

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-console-producer.sh --bootstrap-server kk01:9092 --topic first         # 下面这些都是输入的信息
>hello world
>spark
>1
>2
>3
>4
```

​	执行命令行，无信息输出，并且光标一致保持等待输入状态（**输入的信息需要消费者来消费，在消费者启动之前输入的消息叫历史消息，消费者消费历史消息时需要使用参数--from-beginning**）

## 3.3 消费者命令行操作

​	在kafka解压包的bin目录下，有一个 kafka-console-consumer.sh 文件，通过该脚本文件就可以操作与消费者组件相关的功能，如消费主题中的消息数据的功能

在了解消费者命令之前，我们需要先了解以下什么是 offset：

-   **offset**是Kafka的topic的每个partition中的每一条消息的标识，如何区分该条消息在Kafka对应的partition的位置，就是用偏移量offset。

-   offset的数据类型就是Long，8个字节长度。offset在分区内是有序的，分区间不一定有序。

-   如果想让Kafka中的数据全局有序，那就只能 partition = 1	

注：

​	**消费者消费的位置信息，在Kafka 0.9版本之前是存储在Zookeeper中的。从0.9版本开始，存储在本地主题__comuser_offsets-* 中 。**

### 1）查看操作消费者命令参数

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ pwd
/opt/software/kafka_2.13-3.0.0
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-console-consumer.sh
```

常用参数

| 参数                                            | 描述                                                         |
| ----------------------------------------------- | ------------------------------------------------------------ |
| -bootstrap-server <String: server toconnect to> | 连接的Kafka Broker主机名称和端口号                           |
| --topic <String: topic>                         | 操作的topic名称                                              |
| --from-beginning                                | **从头开始消费**                                             |
| --group <Stirng: consumer group id>             | **指定消费者组名称**                                         |
| --offset <Stirng: consumer offset>              | 指定消费的offset，例：latest(默认)、earliest、整型数字，**使用该参数要去指定分区参数连用** |
| --partition <Integer: partition>                | 指定消费的分区                                               |

### 2）消费消息

消费first主题中的数据

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-console-consumer.sh --bootstrap-server kk01:9092 --topic first
1
2
3
4
```

把主题中所有的数据都读取出来（**包括历史数据**，要读取历史数据，**需要使用参数--from-beginning**）

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ pwd
/opt/software/kafka_2.13-3.0.0
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-console-consumer.sh --bootstrap-server kk01:9092 --from-beginning --topic first
spark
3
4
hello world
1
2
```

### 3）创建消费者组

消费者组其实就是一个容器，可以容纳若干个消费者。**每一个消费者都必须被包含在某一个消费者组里面。**

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-console-consumer.sh --bootstrap-server kk01:9092 --from-beginning --topic first --group my-group1	# 指定了消费者组，并消费到了历史数据
hello spark
4
2
3
spark
1

# 在使用 --group 指定分组的时候，如果分组存在，则将当前消费者加入到这个分组中
# 如果分组不存在，则会自动创建分组，并将当前消费者加入到这个分组
# 如果消费者在启动的时候没有指定分组，则会自动创建一个带有序号的分组，将消费者加入到这个分组中
```

### 4）消费者组列表

列出当前所以的消费者组

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-consumer-groups.sh --bootstrap-server kk01:9092 --list
my-group1
console-consumer-2443
console-consumer-24662
```

### 5）删除消费者组

注意：

​	被删除的消费者组需要确保组内的用户都停止了

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-consumer-groups.sh --bootstrap-server kk01:9092 --delete --group my-group1		# 删除指定消费者组
Deletion of requested consumer groups ('my-group1') was successful.

[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-consumer-groups.sh --bootstrap-server kk01:9092 --list			# 再次查看消费者组列表
console-consumer-2443
console-consumer-24662
```

### 6）查看消费位置offset

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-consumer-groups.sh --bootstrap-server kk01:9092 --describe --group my-group1

Consumer group 'my-group1' has no active members.

GROUP           TOPIC           PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG             CONSUMER-ID     HOST            CLIENT-ID
my-group1       first           0          2               2               0               -               -               -
my-group1       first           1          2               2               0               -               -               -
my-group1       first           2          2               2               0               -               -               -

# 说明
# GROUP 表示组名称
# TOPOIC 表示消费的主题
# PARTITION 表示消费的分区
# CURRENT-OFFSET  表示当前消费到的offset位置
# LOG-END-OFFSET  表示最新的offset的位置
# LAG 表示偏移量
```

### 7）消费数据详情

​	Kafka消费者在消费数据的时候，都是分组别的。**不同组的消费不受影响，相同组内的消费，需要注意的是，如果有3个分区，消费者有3个，那么便是一个消费者消费其中的一个分区的数据，如果有2个消费者，那么一个消费者消费一个分区的数据，另一个消费者消费两个分区的数据。如果有超过3个消费者，同一时间最多只能有3个消费者得到数据。**（即对于同一个消费者组内，一个分区在同一时间最多只能由一个消费者消费，一个消费者在同一时间可以消费多个分区）

```shell
# 开启一个消费者，消费指定分区的数据
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-console-consumer.sh --bootstrap-server kk01:9092,kk02:9092,kk03:9092 --topic first --group my-group1 --offset earliest
 --partition 1
 
# 在组内，kafka的topic的partition数量，代表了Kafka的topic的并行度，同一时间可以有多个线程来消费topic中的数据
# 所以如果想要提高Kafka的topic的消费能力，应该增大partition的数量 
```

## 3.4 平衡Leader

### 3.4.1 手动平衡Leader

```shell
bin/kafka-leader-election.sh --bootstrap-server kk01:9092,kk02:9092,kk03:9092 --election-type preferred --all-topic-partition

# 必要参数
--bootstrap-server：指定服务器列表
--election-type：选举的类型，默认选择preferred即可
# 三选一参数
--all-topic-partition：平衡所有的主题、所有的分区
--topic：平衡指定的主题。如果选择该参数，必须使用 --partition 指定分区
--path-to-json-file：将需要平衡的主题、分区信息写入到一个json文件，指定这个json文件
		json格式：{"partitions":[{"topic":"first","partition":1},{"topic":"first","partition":2}]}
```

### 3.4.2 自动平衡Leader

```shell
# 如果不想每次都去手动平衡Leader，那么可以修改 server.properites 配置文件，实现Leader的自动平衡

auto.leader.rebalance.enable=true

# 但是一般我们不会去做自动平衡Leader，真的出现了倾斜的情况，我们一般会设计定时任务，周期性的去调用手动平衡的方式去实现Leader平衡
```

## 3.5 Kafka自动压测命令

**压力测试的意义**

​	验证每台服务器上的Kafka写入消息、消费消息的能力，根据测试结果，评估当前Kafka集群是否满足上亿级别消费处理的能力。

**测试的方法**

​	在服务器上使用Kafka自带的测试脚本，分别模拟10w、100w、1000w的消息写入请求，查看Kafka处理不同数据级的消息时的处理能力，包括每秒生成消息数、吞吐量、消息延迟时间。

**测试命令**

**写入消息测试**

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-producer-perf-test.sh --topic perf-test --num-records 1000000 --record-size 1000 --throughput -1 --producer-props boot
strap.servers=kk01:9092,kk02:9092,kk03:9092

63409 records sent, 12679.3 records/sec (12.09 MB/sec), 1611.6 ms avg latency, 2249.0 ms max latency.
116576 records sent, 23245.5 records/sec (22.17 MB/sec), 1470.3 ms avg latency, 1733.0 ms max latency.
143008 records sent, 28595.9 records/sec (27.27 MB/sec), 1163.3 ms avg latency, 1307.0 ms max latency.
148464 records sent, 29675.0 records/sec (28.30 MB/sec), 1104.3 ms avg latency, 1231.0 ms max latency.
156432 records sent, 31286.4 records/sec (29.84 MB/sec), 1063.1 ms avg latency, 1127.0 ms max latency.
162096 records sent, 32302.9 records/sec (30.81 MB/sec), 1008.2 ms avg latency, 1065.0 ms max latency.
159968 records sent, 31993.6 records/sec (30.51 MB/sec), 1017.6 ms avg latency, 1116.0 ms max latency.
1000000 records sent, 27324.644097 records/sec (26.06 MB/sec), 1148.05 ms avg latency, 2249.00 ms max latency, 1072 ms 50th, 1696 ms 95th, 2042 ms 99th, 2223
 ms 99.9th.

# 参数解释
--topic 指定测试数据写入的topic
--num-records 指定测试数据写入的消息数量
--record-size 指定每条消息的字节数
--throughput 每秒钟发送的消息的数量，-1表示不限制
--producer-props 发送端的配置信息
```

**消费消息测试**

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-consumer-perf-test.sh --broker-list kk01:9092,kk02:9092,kk03:9092 --topic perf-test --fetch-size 1048576 --messages 10
00000 --threads 1

start.time, end.time, data.consumed.in.MB, MB.sec, data.consumed.in.nMsg, nMsg.sec, rebalance.time.ms, fetch.time.ms, fetch.MB.sec, fetch.nMsg.sec
2023-06-24 07:08:34:335, 2023-06-24 07:08:43:627, 953.6743, 102.6339, 1000000, 107619.4576, 578, 8714, 109.4416, 114757.8609

# 参数解释 
--broker-list 指定Kafka的broker信息
--topic 指定消费的主题
--fetch-size 指定每次 fetch 的数据大小（单位：字节）
--messages 一共需要消费的消息数量
```



# 4 Kafka架构

## 4.1 Kafka分布式模型

​	在一个Kafka集群中，生产者生成的消息被写入到指定的主题中（有些Topic是多个分区的，我们这里举例就以一个分区来说），为了保证数据的完整性，Kafka会将这些主题中的消息在其他broker进行备份，最终生成由创建主题时通过 --replication-factor 指定的副本数量。

​	这些副本存在这Leader、Follower的角色，也就是老大、小弟的角色，老大负责处理数据，小弟负责同步数据。

​	在某些情况下，小弟也可以变成老大（例如老大宕机了）。这就是一个分布式模型。

​	在**消息写入的主题的时候，会找到Leader进行数据的写入**，Follower被动的与Leader进行数据的同步。

​	当有**消息消费时，也是找到Leader进行消息的查找**。如果Leader宕机了，会从Follower中选举一个新的Leader出来，继续提供服务。

​	因此每一个broker都能作为一个分区的Leader和其他分区的Follower，因此Kafka集群能很好的平衡

## 4.2 Topic中的分区

**什么是分区**

​	Kafka的生产者生成的消息发送到了指定的Topic中进行存储，而在消息存储的时候，会被发送到不同的分区进行存储。

那什么是分区呢？

​	分区其实就是将一个Topic分成了若干个部分，每一条消息在进入到Topic的时候都会选择一个分区进行存储。也就是说消息会被存储到Topic的不同分区。每一条消息只能选择一个分区进行存储，那么一条消息该发往哪一个分区呢？这就涉及到分区器了。后面再说

**为什么要分区**

​	Kafka是一个基于发布/订阅的分布式消息队列，既然是分布式，那必然就存在分区的概念。

​	Kafka是一个高吞吐量的消息队列。假如Producer的消息生成能力远远大于Conusmer的消息消费能力，就会造成数据的堆积。堆积满了以后就需要扩展，有了分区后，就方便扩展了。

​	有了分区以后，就可以启用多个Consumer同时消费多个分区的数据，这就提高了消费的能力

​	**Kafka消费的并行度就是Kafka Topic分区的个数，或者说是分区的个数决定了同一时间、同一消费者组内最多可以有多少个消费者消费数据。**

**分区的好处**

-   **方便在集群中进行扩展。**因为一个Topic由一个或多个partition构成，而每个节点通常可以存储多个partition，这样就方便存储和移动了，也就增加了其扩展性。同时也可以增加其Topic的数量
-   **可以提高并发度。**因为一个topic有多个partition。而每个topic在读写数据时，其实就是在读写不同的partition，所以增加了其并发。

**单节点partition的存储分布**

​	单节点，也就是Kafka集群只有一个broker，消息存储在 server.properties 文件中指定的 logs.dirs 参数指定的路径下：

```shell
log.dirs=/opt/software/kafka_2.13-3.0.0/datas
```

​	当一个topic有多个分区时，它都会存储在该路径下

**多节点partition的存储分布**

​	在Kafka集群中有多台节点的时候**，partition会被均匀的分布到不同的节点上**。

​	同时，如果设置了**副本的数量大于1**，那么**每一个分区也都会在其他的节点上生成副本**以保障消息的完整性。

​	在一个分区的多个副本中，会有Leader、Follower的角色存在，形成一个分布式的架构，Leader负责处理该分区的消息的读写请求，Follower与Leader进行消息的同步工作。





## 4.3 Kafka工作流程及文件存储机制

### 4.3.1 工作流程

1 生产者生产消息过程

生产者向 Kafka 集群生产消息。Producer是消息的生产者，通常情况下，数据消息源可以是服务器日志、业务数据以及web服务数据等，生产者采用推送的方式将数据消息发布到 Kafka 的主题中，主题的本质就是一个目录，而主题是由 Partition Logs 组成的。每条消息都被追加到分区中。

1）Producer 先读取 Zookeeper 的 “/brokers/.../state” 节点中找到该Partition 的Leader。

2）Producer 将消息发送给 Leader

3）Leader 负责将消息写入本地分区Log文件中。

4）Follwer 从 Leader 中读取消息，完成备份操作。

5）Follwer 写入本地 Log文件后，会向 Leader 发送ack，每次发送消息都会有一个确认反馈机制，以确保消息正常送达。

6）Leader收到所有 Follwer 发送的 ack后，向 Producer 发送 ack，生产消息完成。

2 消费者消费消息过程

Kafka采用 **拉取模型**，由消费者记录消费状态，根据 **topic、Zookeeper集群地址、消费消息偏移量offset**，每个消费者互相独立的按顺序读取每个分区的消息。



-   Kafka 中的消息是以**topic**进行分类中，生产者生产消息，消费者消费消息，都是**面向topic**的
-   **一个topic下的每一个分区都单独维护一个offset**，所以分发到不同的分区的数据是不同的数据。消费者的分区维护是**一个消费者组一个主题的一个分区维护一个offset**

topic是逻辑上的概念，而partition是物理上的概念，每个partition对应与一个log文件，该log文件中存储的就是producer生产的数据。（可以简单理解为 **topic=N*partition；partition=log**）

producer生产的数据会被不断追加到该log文件的末端，且每条数据都有自己的offset，消费者组中的每个消费者，都会实时记录自己消费到了哪个offset，以便出错恢复时，从上次的位置继续消费（可以理解为断点续传）。

### 4.3.2 Kafka文件存储机制

Kafka文件存储也是通过本地落盘的方式存储的，主要是通过相应的 **log与index** 等文件保存具体的消息文件。

-   一个topic分为多个partition（每个分区为一个目录）

-   **一个partition分为多个segment**（即 分段）（在每个分区目录中可能有多个segment）

-   一个segment对应两个文件（.log文件 .index文件）

-   （为什么partition要划分成多个segment）由于生产者不断的向log文件追加消息文件，为了防止log文件过大导致定位效率低下，Kafka采取了**分片和索引**的机制，将每个partition分为多个segment。

-   **每个segment对应两个文件——".index文件 和 .log文件"**，这些文件位于一个文件夹下，这文件夹的命名规则：topic名称+分区序号 （例如，first主题，有三个分区，则其对应的文件夹为 first-0 first-1 first-2），**以1G为一个分界点**，当.log文件大小超过1G的时候，此时会创建一个新的.log文件

-   在kafka的存储log的地方，即文件的地方，**会存在消费的偏移量以及具体的分区信息**，分区信息的话主要包括.index和.log文件组成

    ```shell
    [nhk@kk01 datas]$ cd first-0
    [nhk@kk01 first-0]$ ll   
    total 20                			# segment（.index + .log）
    -rw-rw-r-- 1 nhk nhk 10485760 Jun 24 07:03 00000000000000000000.index 
    -rw-rw-r-- 1 nhk nhk       82 Jun 24 05:29 00000000000000000000.log
    -rw-rw-r-- 1 nhk nhk 10485756 Jun 24 07:03 00000000000000000000.timeindex
    -rw-rw-r-- 1 nhk nhk       10 Jun 24 06:03 00000000000000000002.snapshot
    -rw-rw-r-- 1 nhk nhk        9 Jun 24 07:03 leader-epoch-checkpoint
    -rw-rw-r-- 1 nhk nhk       43 Jun 24 03:40 partition.metadata
    ```
    
    ​	分区目的是为了备份，所以同一个分区存储在不同的broker上，即当 first-0存在当前机器 kk01上，实际上再 kk02、kk03中也有这个分区的文件（副本），分区中包含副本，即**一个分区可以设置多个副本，副本中有一个是leader，其余为follower。**

```shell
# 查看主题详情
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-topics.sh --bootstrap-server kk01:9092 --topic first --describe
Topic: first	TopicId: KPht7RLSTX2BdFDyhGWT4w	PartitionCount: 3	ReplicationFactor: 3	Configs: flush.ms=3000,segment.bytes=1073741824,flush.message
s=10000	
	Topic: first	Partition: 0	Leader: 2	Replicas: 1,2,0	Isr: 2,0,1
	Topic: first	Partition: 1	Leader: 2	Replicas: 2,1,0	Isr: 2,0,1
	Topic: first	Partition: 2	Leader: 2	Replicas: 0,2,1	Isr: 2,0,1
```

如果 .log 文件超出大小，则会产生新的 .log 文件。如下所示

```shell
00000000000000000000.index	  # 这个segment的文件命名是以它记录的第一条数据的 offset
00000000000000000000.log
00000000000000170410.index     # 尾数170410 是指offset 即第多少条数据
00000000000000170410.log
00000000000000239430.index
00000000000000239430.log

# 说明
# .index 文件中存储大量的 索引信息，索引信息按照数组（该文件采用的数据结构）的逻辑排列
# .log 文件存储大量的生产者生成的数据，数据直接紧密排列
# 索引文件中的元数据指向对应数据文件中 message的物理偏移地址

# 如何快速定位数据，步骤：
#	.index文件存储的消息的 offset+真实的起始偏移量。   .log中存放的是真实的数据。

#	1.首先通过二分查找 .index文件到查找到当前消息具体的偏移
#	2.然后通过第一个 .index文件通过seek定位元素的位置，定位到之后获取 起始偏移量+当前文件大小=总的偏移量
#	3.获取到总的偏移量之后，直接定位到 .log文件即可快速获得当前消息大小。
```

## 4.4 Kafka的Log Compaction

**Log Compaction简介**
	Compaction单词的意思是压缩，但是这里的压缩并不是指的将Kafka的Log文件进行类似于gzip之类的压缩。Kafka中的Log Compaction是指在**默认的日志删除 (Log Deletion）规则之外提供的一种清理过时数据的方式**。

-   在默认的删除规则Log Deletion模式下，消息会在Kafka中保存一段时间。过了这个时间之后，以前的消息就会被删除掉。

-   可以通过配置log.retention.hours属性来调整过期的时间。

Log Compaction对于有相同key的的不同value值，只保留最后一个版本。如果应用只关心key对应的最新value值，可以开启Katka的日志消理功能，Kafka会定期将相同key的消息进行合并，只保留最新的value值。

-   Katka中用来存储消费位置的主题 __consumer_offsets 就是采用的Log Compaction策略

-   例如一个应用程序采用Kafka来保存数据消费的状态，每当有状态变更的时候，都会将新的变更写入到kafka中。如果某一个时问点，这个应用程序失败了，重启之后需要读取Kafka中记录的消息来恢复宕机之前的状态。那么这个时候，我们关注的是宕机之前的圾新状态，而不是历史中的每一个状态。如果采用的是Kafka的Log Deletion的方式，那就需要读取Kafka中的所有的历史数据来恢复，但如果启用了Compaction， 就可以减少数据的加载量，从而达到快速恢复状态的效果。


日志的压缩是分区进行的，一个日志被分为了两个部分：完成压缩的部分、未完成压缩的部分

日志的头部与传统的Kafka日志相同，它具有密集的顺序偏移并保存所有消息。

日志的尾部添加了日志压缩的处理，消息保留了第一次写入时分配的Offset。

在日志压缩的过程中，消费者仍然可以读取这个log中的数据，如果该取的是未完成压缩的部分，那么依然可以该取到Key的每一个状态的。

**压缩日志前后**

​	日志压缩主要是后台独立线程去定期清理log segment， 将相同的key的值保留一个最新版本，压缩将不会阻塞读，并且可以进行节流，最多使用可配置的 I/O吞吐量，以避免影响生产者和消费者。

**Log Compaction保障**

日志压缩保障如下：

1、被写在日志头部的任何一条消息对于任何一个消费者都能获取。这些消息都有一个连续的offset。主题的 min.compaction.lag.ms 是消息被写进来后，日志压缩的最小时间。比如，消息被写进来后，时长小于该属性的值，那么该日志不会被压缩。

2、消息总是被维持有序，压缩将绝不会对消息进行重排序，仅仅是移除。

3、消息的offset将绝不会被改变，这个在日志中是一个永久的标识。

4、消费者能够看到日志头部的所有记录的最终状态，另外，所有被删除记录的删除标记都会被看见，前提是，被提供给消费者的记录是小于主题 delete.retention.ms 设置的时长的所有删除标记才能被看见(默认是24小时)。换句话说：由于删除标记的删除与读取同时进行，因此，如果附除标记的延迟超过了 delte.retention.ms，消费者就有可能遗漏删除标记。

**Log Compaction流程**

日志cleaner(清理器)处理日志压缩，它是一个后台线程池，用于重新复制segment文件，删除其键出现在日志头部的记录。每个压缩线程的工作流程如下：

1、它选择具有极高比例从日志头到日志尾的日志。

2、为日志头的每一个key创建一个偏移量汇总。

3、重新负责从头到尾记录日志，刪除日志中靠后出现的键。新的、干净的segmnent会立即交换到日志中，因此所需的额外磁盛空间只是一个额外的segement(而不是日志的完整副本)。

4、头部日志的汇总实质上只是一个空间紧凑的哈希表。它每个日志准确地使用24个字节。因此，若使用8GB的cleaner级冲区，大约可以清理366 GB的头部日志(假设1k一条消息)。

**Log的清空器**

日志清理器默认是开启的。这将开启一个清理器线程池。对于特定主体开启日志清理，你能添加指定的属性，该属性当主题被创建或者主题被修改的时候所使用上。具体属性如下：

```
log.cleanup.policy=compact
```

日志清理器能配置头部日志不被压缩的最小时间。这可以通过配置compaction time lag来开启，具体属性如下：

```
log.cleaner.min.compaction.lag.ms
```

这个可以用于阻止新消息被更早的压缩，如果不设置，所有的1og segment将都会被压缩，除最后一个log segment外。
如果一个segment正在被写，那么该激活的segment将不被压缩尽管它的所有消息时长都超过咯压缩的最小时间



## 4.5 Conusmer Group架构

​	Consumer Group是Kafka提供的可扩展的具有容错型的消费者机制。既然是一个组，那么组内必然可以有多个消费者或消费者实例（consumer instance），它们共享一个公共的ID，即Group ID。组内的所有消费者协调在一起来消费订阅主题（subscribed topics）的所有分区（partition）。当然，每个分区只能由同一消费者组内的一个消费者消费。

-   Consumer Group下可以有一个或多个consumer instance，consumer instance可以是一个进程，也可以是一个线程

-   group.id是一个字符串，唯一表示一个Consumer Group

-   Consumer Group下订阅的topic下的每个分区只能分配给某个group下的一个consumer（当然该该分区还可以被分配给其他的group）



# 5 Kakfa核心API

通过调用 Kafka API 操作 Kafka集群，其核心API主要包括一下5种：

-   Producer API（生产者API）：构建应用程序发送数据流到 Kafka 集群中的主题
-   Consumer API（消费者API）：构建应用程序从 Kafka集群 中的主题读取数据流
-   Streams API：构建流处理程序的库，能够处理流式数据
-   Connect API：实现连接器，用于在 Kafka 和其他系统之间可扩展的、可靠的流式传输数据的工具。
-   AdminClient API：构建集群**管理**工具，查看 Kafka 集群组件信息

Kafka作为流数据处理平台，在开发生产者客户端时，Producer API 提供了 KafkaProducer 类，该类的实例化对象用来代表一个生产者进程，生产者发送消息时，并不是直接发送给服务端，而是先在客户端中把消息存入队列，然后由一个发送线程从队列中消费消息，并以批量的方式发送消息给服务端，KafkaProducer 类常用方法如下：

| 方法                                  | 说明                     |
| ------------------------------------- | ------------------------ |
| abortTransaction()                    | 终止正在进行的事物       |
| close()                               | 关闭生产者               |
| flush()                               | 将所有缓冲的记录立即发送 |
| partitionsFor(java.lang.String topic) | 获取给定主题的分区元数据 |
| send(ProducerRecord<K, V> record)     | 异步发送记录到主题       |

消费者客户端则是从 Kafka集群中消费消息。作为分布式消息系统，Kafka支持多个生产者和多个消费者，生产者可以将消磁发布到集群中的不同节点的不同分区上，消费者也可以消费集群中多个节点的多个分区上的消息，消费者应用程序是由 KafkaConusmer 对象代表的一个消费者客户端进程，KafkaConsumer类常用方法如下：

| 方法                                                     | 说明                                         |
| -------------------------------------------------------- | -------------------------------------------- |
| subscribe(java.util.Collection<java.lang.String> topics) | 订阅给定的主题列表以获取动态分区             |
| close()                                                  | 关闭消费者                                   |
| wakeup()                                                 | 唤醒消费者                                   |
| metrics()                                                | 获取消费者保留的指标                         |
| listTopics()                                             | 获取有关用户有权查看的所有主题的分区的元数据 |



## 5.1 Kafka生产者

### 5.1.1 消息发送流程

Kafka 的 Producer 发送消息采用的是**异步发送**的方式。在消息发送的过程中，涉及到了**两个线程（main线程和 Sender 线程），以及一个线程共享变量 RecordAccumulator**。main 线程将消息发送给 RecordAccumulator（中间涉及到了 Interceptors、Serializer、Partitioner），Sender 线程不断从RecordAccumulator 中拉取消息发送到 Kafka broker。



### 5.1.2 异步发送 Java API实现

1）导入依赖

注意版本与自己的Kafka版本一致

```xml
<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka-clients</artifactId>
    <version>3.0.0</version>
</dependency>
```

2）编写代码

####  异步发送 普通生产者

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;

import java.util.Properties;

/**
 *  异步发送 普通生产者
 */
public class CustomProducer {
    public static void main(String[] args) {
        // 1.创建配置对象
        Properties properties = new Properties();

        // 2.给配置对象添加参数
        // 配置可以使用具体的字符串，也可以使用ProducerConfig中配置的常量
        // 推荐使用ProducerConfig中配置的常量
         //properties.put("bootstrap.servers","kk01:9092,kk02:9092,kk03:9092");
        // 设置Kafka集群的ip地址和端口号
        properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "kk01:9092,kk02:9092,kk03:9092");

        // 设置key序列化
        // 否则报错 ConfigException: Missing required configuration "key.serializer" which has no default value.
        properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        // 设置value序列化
        // 否则报错 ConfigException: Missing required configuration "value.serializer" which has no default value.
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
        KafkaProducer<String, String> producer = new KafkaProducer<String, String>(properties);

        // 4.调用send方法发送生产的数据
        for (int i = 0; i < 10; i++) {
            producer.send(new ProducerRecord<>("first", "hello world - " + i));
        }

        // 5.关闭连接
        // flush机制
        producer.close();
    }
}

```

上述代码在，具体的参数功能如下

-   **bootstrap.servers** 设置Kafka集群的ip地址和端口号

-   **acks** 消息确认机制，该值设置为all，这种策略会保证只要有一个备份存活就不会丢失数据，这种方案是最安全可靠的，但同时效率也是最低的

-   **retries** 如果当前请求失败，则生产者可以自动重新连接，但是设置retries=0，则意味着失败不会重复连接，这样可以避免消息重复发送的可能

-   **batch.size** 生产者为每个分区维护了未发生的数据的**内存缓冲区**，该缓冲区设置的越大，吞吐量和效率就越高，但也会浪费更多的内存。并且**只有当数据累积到batch.size之后，sender才会发送数据。**

-   **lingers.ms** 指定请求延时，意味着如果缓冲区没有被填满的情况下，会增加1ms的延迟，等待更多的数据进入缓冲区从而增加内存利用率。在默认情况下，即使缓冲区中有其它未使用的空间，也会立即发送缓冲区。

    简单来说，如果数据迟迟未到达batch.size。sender等待lingers.ms 之后就会发送数据

-   **buffer.memory** 指定缓冲区大小

-   **key.serializer value.serializer 数据在网络中传输必须进过序列化**

    

使用消费者终端消费数据，如下，可以看出生产者生产的消息被消费终端成功消费

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-console-consumer.sh --bootstrap-server kk01:9092 --topic first
hello world - 0
hello world - 1
hello world - 2
hello world - 3
hello world - 4
hello world - 5
hello world - 6
hello world - 7
hello world - 8
hello world - 9
```

#### 异步发送 带回调函数的生产者

**回调函数会在 producer 收到 ack 时调用，为异步调用**，该方法有两个参数，分别为 RecordMetaData 和Exception，如果Exception为null，说明消息发送成功，如果Exception不为null，说明消息发送失败。

**注意：**

​	**消息发送失败会自动启动重试机制，不需要在回调函数中手动重试**

```java
import org.apache.kafka.clients.producer.*;

import java.util.Properties;
import java.util.concurrent.ExecutionException;

/**
 * 异步发送 带回调函数的生产者
 */
public class CustomProducerWithCallBack {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 1.创建配置对象
        Properties properties = new Properties();

        // 2.给配置对象添加参数
        // 配置可以使用具体的字符串，也可以使用ProducerConfig中配置的常量
        // 推荐使用ProducerConfig中配置的常量
        //properties.put("bootstrap.servers","kk01:9092,kk02:9092,kk03:9092");
        // 设置Kafka集群的ip地址和端口号
        properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "kk01:9092,kk02:9092,kk03:9092");

        // 设置key序列化
        // 否则报错 ConfigException: Missing required configuration "key.serializer" which has no default value.
        properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        // 设置value序列化
        // 否则报错 ConfigException: Missing required configuration "value.serializer" which has no default value.
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
            producer.send(new ProducerRecord<>("first", "hello world - " + i),
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
```

使用消费者终端消费数据，如下，可以看出生产者生产的消息被消费终端成功消费

```shell
[nhk@kk01 kafka_2.13-3.0.0]$ bin/kafka-console-consumer.sh --bootstrap-server kk01:9092 --topic first
hello world - 0
hello world - 1
hello world - 2
hello world - 3
hello world - 4
hello world - 5
hello world - 6
hello world - 7
hello world - 8
hello world - 9
```

```
# 下面是idea控制台打印的信息
first:2:10
first:2:11
first:2:12
first:2:13
first:2:14
first:2:15
first:2:16
first:2:17
first:2:18
first:2:19
```



### 5.1.3 同步发送 Java API实现(生产不建议使用)

同步发送的意思就是，一条消息发送后，会阻塞当前线程，直至返回ack

由于send方法返回的是一个 Futrue 对象，根据 Futrue 对象的特点，我们可以实现同步发送的效果，只需在**调用 Futrue 对象的get()方法即可**

```java
import org.apache.kafka.clients.producer.*;

import java.util.Properties;
import java.util.concurrent.ExecutionException;

/**
 * 同步发送 带回调函数的生产者
 */
public class CustomProducer2 {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 1.创建配置对象
        Properties properties = new Properties();

        // 2.给配置对象添加参数
        // 配置可以使用具体的字符串，也可以使用ProducerConfig中配置的常量
        // 推荐使用ProducerConfig中配置的常量
        //properties.put("bootstrap.servers","kk01:9092,kk02:9092,kk03:9092");
        // 设置Kafka集群的ip地址和端口号
        properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "kk01:9092,kk02:9092,kk03:9092");

        // 设置key序列化
        // 否则报错 ConfigException: Missing required configuration "key.serializer" which has no default value.
        properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        // 设置value序列化
        // 否则报错 ConfigException: Missing required configuration "value.serializer" which has no default value.
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
            producer.send(new ProducerRecord<>("first", "hello world - " + i),
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
                        // 添加get之后，会编程同步发送，发送成功一条，接收到ack后再发生下一条
                        // 同步发送速度比较慢，推荐使用异步发送
                    }).get();

            System.out.println("发送完成" + ": " + i + "条数据");
        }

        // 5.关闭连接
        // flush机制
        producer.close();
    }
}
```

```diff
# 下面是idea控制台打印的信息
first:0:13
发送完成: 0条数据
first:1:33
发送完成: 1条数据
first:0:14
发送完成: 2条数据
first:2:20
发送完成: 3条数据
first:0:15
发送完成: 4条数据
first:1:34
发送完成: 5条数据
first:0:16
发送完成: 6条数据
first:2:21
发送完成: 7条数据
first:0:17
发送完成: 8条数据
first:1:35
发送完成: 9条数据

```



### 5.1.4 生产者分区写入策略

**1）什么是分区**

​	从整体上来说，一个 Kafka 集群有多个机器（一个机器就是一个 Broker），创建一个 Topic 是针对集群创建的，也就是说一个集群共享一个 Topic。一个 Topic 可以有多个分区，如果机器数量够用的话，多个分区会在不同的 Broker 上，当然如果 Broker 不够用，那么一个 Broker 就可能保存一个 Topic 的多个分区。

那么分区是什么呢？

​	简单来说就是，生产者会源源不断的发送数据给Topic，如果生产者没有指定发送到哪个分区的话，那么这些数据会按照一定的策略分发到这个Topic的几个分区，即多个分区中都有数据，这样就无法保证数据整体的有序性存储。

**2）为什么分区？**

-   **方便在集群中扩展**，每个 Partition 可以通过调整以适应它所在的机器，而一个 topic 又可以有多个 Partition 组成，因此整个集群就可以适应任意大小的数据了；
-   **可以提高并发**，因为可以以 Partition 为单位读写了



**3）分区的原则**

我们需要将 producer 发送的消息封装成一个 **ProducerRecord** 对象

```java
// 如下是ProducerRecord的构造器（参数最多的一个）
public ProducerRecord(String topic, Integer partition, Long timestamp, K key, V value, Iterable<Header> headers)
// 用指定的时间戳创建一条记录，发送到指定的 topic 和 partition
// 参数说明
//		topic	记录将被追加到的主题
// 		partition	记录要发送到的分区
//		timestamp	记录的时间戳，单位为ms。
//					如果为空，生产者将赋值使用System.currentTimeMillis()获取时间戳。
//		key		将包含在记录中的键
//		value	记录内容
//		headers	将包含在记录中的标头
    
 // 直接填写分区号
public ProducerRecord(String topic, K key, V value)
    
// 只填写value 自身的粘性机制 先向一个批次中写数据，达到一批了统一发送，之后切换一个分区 再写一个批次   
public ProducerRecord(String topic, V value)
    
// 上面 ProducerRecord 中的 partition 参数即为指定的分区(分区是有编号的，这是指定分区中的某一个，实际应该为一个分区编号)。
// 这里要注意，如果指定特定分区的话，消息是会发送到这个编号的特定分区，但是注意如果你的Topic分区只有默认的1个，而你却要发送到分区1号，此时发送会失败！因为你只有1个分区，即0号分区。所以在构建的topic的时候需要注意。
```

-   **指明partition**（这里的指明是指第几个分区）的情况下，直接将指明的值作为partition的值

-   **没有指明partition**的情况下，但是**存在值key**，此时将 key 的 hash 值与 topic 的partition总数进行取余得到partition值

-   **即没有 partition值又没有key**的情况下，**Kafka采用 Sticky Partition（黏性分区器**），会随机选择一个分区，并尽可能一直使用该分区，待该分区的batch已满或者已完成，Kafka再随机一个分区进行使用

    ```java
    // 下面是演示的部分代码片段
    
    // 4.调用send方法发送生产的数据
    for (int i = 0; i < 10; i++) {
        // 1)直接填写分区号 0  ==> 数据不需要走分区器  方法直接返回分区号即可
        producer.send(new ProducerRecord<>("first", 0,"","hello world - " + i));
        // 线程睡眠，避免全部发送到一个分区
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

如果在**生产消息时，key为 null，则使用轮询算法均衡地分配分区**

```java
org.apache.kafka.clients.producer.RoundRobinPartitioner

public class RoundRobinPartitioner implements Partitioner
```



#### 2 随机策略

随机策略，每次都随机地将消息分配到每个分区。在较早的版本，默认的分区策略就是随机策略，也是为了将消息均衡地写入到每个分区。但后续轮询策略表现更佳，所以基本上很少会使用随机策略。




#### 3 按key分配策略

按key分配策略，有可能会出现「数据倾斜」，例如：某个 key 包含了大量的数据，因为key值一样，所有所有的数据将都分配到一个分区中，造成该分区的消息数量远大于其他的分区。

轮询策略、随机策略都会导致一个问题，生产到 Kafka 中的数据是 **乱序存储** 的。而按 key 分区可以一定程度上实现数据有序存储——也就是局部有序，但这又可能会导致数据倾斜，所以在实际生产环境中要结合实际情况来做取舍。



#### 4 自定义分区策略

自定义分区器的步骤：

1.  实现接口 Partitioner 
2.  实现接口的抽象方法（partition、close、configure）
3.  编写partition方法，返回分区号

-   1）自定义分区器

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

-   2）使用分区器的方法

在生产者的配置中添加分区器参数

```java
// 1.创建配置对象
Properties properties = new Properties();
        
// 添加自定义分区器 （这里需要添加自定义分区器的全限定名）
properties.put(ProducerConfig.PARTITIONER_CLASS_CONFIG,"这里填写自定义分区器的全限定名");
```

演示如下

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



### 5.1.5 数据可靠性保证（ack）

#### **1）生产者发送数据到topic partition 的可靠性保证**

​	为保证producer 发送的数据，能可靠的发送到指定的topic，**topic的每个partition 收到producer 发送的数据后，都需要向 producer 发送 `ack`**（acknowledgement 确认收到），如果producer 收到 ack，就会进行下一轮的发送，否则重新发送数据。

**发送ack的时机**

-   确保有follower与leader同步完成，leader再发送ack，这样可以保证在leader挂掉之后，follower中可以选出新的leader（主要是确保follower中数据不丢失）

**follower同步完成多少才发送ack？**

现有的两种方案：

-   半数以上的follower同步完成，即可发送ack
-   全部follwer同步完成，才可以发送ack（==Kafka采取的方案==）

#### **2）topic partition 存储数据的可靠性保证**

#### （1**）副本数据同步策略**

| 方案                        | 优点                                             | 缺点                                              |
| --------------------------- | ------------------------------------------------ | ------------------------------------------------- |
| 半数以上完成同步，就发送ack | 延迟低                                           | 选举新的Leader时，容忍n台节点故障，需要2n+1个副本 |
| 全部完成同步，才发送ack     | 选举新的Leader时，容忍n台节点故障，需要n+1个副本 | **延迟高**                                        |

`Kafka选择了第二种方案`，原因如下：

-   同样为了容忍n台节点的故障，第一种方案需要2n+1个副本，而第二章方案只需要n+1个副本。因为Kafka的每个分区都有大量的数据，第一种方案会造成大量数据的冗余。
-   虽然第二种网络延迟较高，但是网络延迟对于Kafka的影响较小（因为Kafka服务器之间通信依靠的是内网）。

#### **（2）ISR**

问题：

​	采用第二种方案之后，如果 Leader 收到数据，所有的 Follower开始同步数据，但有一个 Follower因为某种故障，迟迟不能够与 Leader进行同步，那么 Leader就要一直等待下去，直到它同步完成，才可以发送ack，此时需要如何解决这个问题呢？

解决方案：

​	Leader中维护了一个动态的**ISR（in-sync replica set）（副本同步队列）**，即与 Leader 保持同步的 follower集合，`当 ISR 中的follower完成数据的同步之后，给 Leader 发送 ack`，**如果follower长时间没有向leader同步数据，则该follower将从ISR中被踢出**，该之间阈值由**replica.lag.time.max.ms（10s）**参数设定。**当 Leader发生故障之后，会从ISR中选举出新的Leader。**

#### **（3）ack应答级别**

​	对于某些不太重要的数据，**对数据的可靠性要求不是很高，能够容忍数据的少量丢失，所以没有必要等到ISR中所有的Follower全部接受成功。**

​	所以**Kafka为用户提供了三种可靠性级别**，用户根据可靠性和延迟的要求进行权衡选择不同的配置

**acks参数配置：**

producer返ack，`0 无落盘直接返`，`1 只leader落盘然后返`，`-1 全部落盘然后返`

-   **0**：producer不等待broker的ack，这一操作提供了**最低的延迟**，broker接收到消息还没有写入磁盘（在内存中）就已经返回，**当broker故障时有可能丢失数据**
-   **1**：producer等待broker的ack，**partition的Leader落盘成功后返回ack**，如果在follower同步成功之前Leader故障，那么将**丢失数据**。（**只是Leader落盘**）
-   **-1（all）**：producer等待broker的ack，**partition的leader和 ISR 中的follower全部落盘成功才返回ack**，但是如果在follower同步完成后，`broker发送ack之前，如果leader发生故障，会造成数据重复`。(这里的数据重复是因为producer没有收到ack，所以继续重发导致的**数据重复**)

#### 3）数据一致性问题（水位线）

​	数据一致性问题 即 leader与follower故障处理细节

​	在Topic中，每个分区都会有多个副本，副本之间又分为 Leader 和 Follower 角色。Leader负责处理消息的读写操作，Follwer需要和Leader进行消息的同步。

​	在这个过程中，就会设计到两个概念，即 **HW、LEO**

Log文件中的HW和LEO

-   **LEO(Log End Offset)**：日志末端位移。记录的是日志中最后一条消息的 `offset + 1`
    -   例如，一个副本中记录的最大offset是100，那么LEO的值即为 101
-   **HW(High Watermark)**：**高水位**，HW的值一定是小于等于LEO的值，同时HW也限制了消费者可以读取到的消息范围（指代消费者能见到的最大的offset，ISR队列中最小的LEO）
    -   消费者只能读取HW之前的数据，无法读取HW之后的数据。（HW之前的数据才对Consumer可见）

**工作流程**

-   Follwer向Leader请求数据同步，Leader会记录所有Follower的LEO值，并以`最小的LEO作为自己的HW的值`。

-   Leader在更新了自己的HW之后，会比较HW和Follower的LEO值，选取较小的值作为Follwer的HW，并发送给指的Follwer。`Follwer收到之后，修改自己的HW`。

**follower故障和leader故障**

在进行消息同步的过程中，有可能会遇到如下异常情况：

（1）follower故障

-   **follower发生故障后会被临时踢出ISR**，待该follower**恢复后**，follower会读取本地磁盘记录的上次的HW，并**将 log 文件高于HW的部分截取掉**，从HW开始向leader进行同步，等待该**follower的LEO大于等于该partition的HW**，即follower追上leader之后，就可以**重新加入ISR**了。

（2）leader故障

-   **leader发生故障之后，会从ISR中选出一个新的leader**，为了保证多个副本之间的数据的一致性，其余的follower会先将各自的log文件**高于HW的部分截掉**，然后从新的leader中同步数据

注意：

​	在使用HW进行副本的同步的时候，并不能保证`数据的丢失`、`数据的一致性`

### 5.1.6 Leader Epoch

出现 数据丢失、数据不一致的根本原因就在于：HW值被用于衡量备份的成功与否，在出现失败重启的时候作为日志截断的依据。

为了解决这样的问题，Kafka在 0.11 版本引入了 Leader Epoch，用于取代HW的值。Leader端使用内存保存Leader的Epoch信息。

其实所谓的Leader Epoch，实际上就是一个键值对：\<Epoch Offset>

-   ​	Epoch，表示朝代，Leader的版本号，从数字0开始。每当Leader变更一次，Epoch 都会+ 1
-   ​	Offset：对应于该Epoch版本的Leader写入的第一条消息的Offset。
    -   ​	例如：
    -   ​		<0,0>   	表示第一个Leader，从 Offset=0 的位置开始写入消息
    -   ​		<1,120>	第二个Leader，从 Offset=120的位置开始写入消息

Leader broker 中会保存这样的一个缓存，并定期地写入到一个 checkpoint 文件中。

当Leader写Log时他会尝试更新整个缓存：如果这个Leader首次写入消息，则会在缓存增加一个条目；否则就不会做更新

每次副本变为Leader时会查询这部分缓存，获取出对应Leader版本的位移，则不会发生数据不一致和丢失的情况。

**如何规避数据丢失**

只需要知道每个副本都引入了新状态来保存自己当Leader时开始写入的第一条消息的offset及leader版本。这样在恢复的时候完全使用这些信息而非HW来判断是否需要截断日志。

**如何规避数据不一致**



### 5.1.7 Exactly Once语义

-   将服务器的**ACK级别设置为-1（all）**，可以保证 Producer 到 Server 之间不会丢失数据，即At Least Once语义。相对的，将服务器ACK级别设置为0，可以保证生产者每条消息只会被发送一次，即At Most Once至多一次。

-   **At Least Once可以保证数据不丢失，但是不能保证数据不重复**；相对的，**At Most Once可以保证数据不重复，但是不能保证数据不丢失**，对于重要的数据，则要求数据不重复也不丢失，即Exactly Once即精确的一次。

-   在0.11版本之前的Kafka，对此是无能为力的，只能保证数据不丢失，再去下游对数据的重复进行去重操作，对于多个下游应用的情况，则分别进行全局去重，对性能有很大影响。


-   0.11版本的kafka，引入了一项重大特性：**幂等性**，幂等性指代 **Producer不论向 Server 发送了多少次重复数据，Server端都只会持久化一条数据**。幂等性结合 At Least Once 语义，就构成了Kafka的Exactly Once语义。即 **At Least Once + 幂等性 = Exactly Once**


-   要启用幂等性，只需要在Producer的参数中设置**enable.idempotence=true**即可（启用幂等性后，Kafka会自动将acks = -1），Kafka的幂等性实现其实就是将之前下游需要做的去重操作放在了数据上游来做，开启幂等性的Producer在初始化的时候会被分配一个 PID （producer ID），发往同一个 Partition 的消息会附带Sequence Number，而Broker端会对**<PID,Partition,SeqNumber>**做缓存，当具有相同主键的消息的时候，Broker只会持久化一条。


-   但PID在重启之后会发生变化，同时不同的Partition也具有不同的主键，所以**幂等性无法保证跨分区跨会话的Exactly Once。**
    

### 5.1.8 Producer事务

-   kafka从0.11版本开始引入了事务的特性，事务可以保证Kafka在Exactly Once语义的基础上，生产和消费可以跨分区的会话，要么全部成功，要么全部失败。
-   为了按**跨分区**跨会话的事务，需要**引入一个全局唯一的Transaction ID**，并将**Producer获得的 PID(可以理解为Producer ID)和 Transaction ID 进行绑定**，这样当Producer重启之后就可以通过正在进行的Transaction ID获得原来的PID。
-   为了管理Transaction，Kafka引入了一个新的组件Transaction Coordinator，Producer就是通过有和Transaction Coordinator交互获得 Transaction ID 对应的任务状态，Transaction Coordinator还负责将事务信息写入Kafka的一个内部Topic中，这样即使整个服务重启，由于事务状态得到保存，进行中的事务状态可以恢复，从而继续进行。



## 5.2 Kafka消费者

### 5.2.1 Kafka的 生产者 Push 与 消费者 Pull（消费方式）

​	一个较早问题是我们应该考虑是消费者从broker在pull数据，还是 broker将数据push给消费者。Kafka遵守传统设计和借鉴了很多消息系统，这里**Kafka选择producer 向broker去push数据，并由consumer 从broker pull消息。**一些ogging-centric system，比如FaceBook的Scribe和Cloudera的Flume，采用采用非常不同的push模式。事实上，push模式和pull模式各有优势。（**consumer 采用 pull（拉）的方式来从 broker 中读取数据。**）

​	**push（推）的模式很难适应消费速率不同的消费者，因为消息发送率是由broker决定的**。它的目标是尽可能以最快的速度传递消息，但是这样容易造成 consumer 来不及处理消息，典型的表现就是拒绝服务以及网络拥塞。而pull 方式则可以让 consumer 根据自己的消费处理能力以适当的速度消费消息。

​	**pull 模式不足之处在于，如果 Kafka 没有数据，消费者可能会陷入循环中，一直返回空数据**。针对这一点，Kafka 的消息者在传入消费数据时会传入一个时长参数 timeout，`如果当前没有数据可供消费，consumer 会等待一段时间之后再返回，这段时长即为 timeout`。

ps：timeout官方案例是100ms



### 5.2.2 基础消费者 Java API实现

注意：

-   在**消费者代码中必须配置消费者组**，否则程序报错，如下

```
Consumer is not subscribed to any topics or assigned any partitions
```

-   命令行启动消费者不填写消费者组会被自动填写随机的消费者组

```java
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import java.time.Duration;
import java.util.Arrays;
import java.util.Collection;
import java.util.Properties;

public class CustomConsumer {
    public static void main(String[] args) {
        // todo 1.创建配置对象
        Properties properties = new Properties();

        // todo 2.添加配置参数
        // 必要参数
        // 这里可以只写一台kafka服务的地址，目的是连接上kafka集群，标准的做法是应该写整个集群的地址
        properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "kk01:9092");
        // 反序列化
        properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
                "org.apache.kafka.common.serialization.StringDeserializer");
        properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
                "org.apache.kafka.common.serialization.StringDeserializer");
        // 消费者组
        properties.put(ConsumerConfig.GROUP_ID_CONFIG, "group_1");

        // todo 3.创建 Kafka 消费者
        KafkaConsumer<String, String> kafkaConsumer = new KafkaConsumer<>(properties);
        // 注册主题 否则报错 Consumer is not subscribed to any topics or assigned any partitions
        Collection<String> topics = Arrays.asList("first");
        kafkaConsumer.subscribe(topics);

        // todo 4.调用方法消费数据
        // 消费者消费数据字段死循环的逻辑
        // 拉取到数据
        while (true) {
            // 参数 Duration timeout 表示超时时间，表示没有拉取到数据的时候，睡眠线程1s
            ConsumerRecords<String, String> consumerRecords = kafkaConsumer.poll(Duration.ofSeconds(1));

            // 处理数据
            for (ConsumerRecord<String, String> consumerRecord : consumerRecords) {
                System.out.println(consumerRecord);
            }
        }

        // todo 5.关闭连接
        //kafkaConsumer.close();
    }
}
```

### 5.2.3 消费者组Rebalance机制

​	Kafka 中的 **Rebalance** 称之为**再均衡**，是 Kafka 中确保 Consumer group 下所有的 consumer 如何达成一致，分配订阅的 topic 的每个分区的机制。

Rebalance 触发的时机有：

1、**消费者组中 consumer 的个数发生变化。**

例如：有新的 consumer 加入到消费者组，或者是某个 consumer 停止了。

2、**订阅的 topic 个数发生变化**
消费者可以订阅多个主题，假设当前的消费者组订阅了三个主题，但有一个主题突然被删除了，此时也需要发生再均衡。

3、订阅的 topic 分区数发生变化

**Rebalance的不良影响：**

-   发生 Rebalance 时，consumer group 下的所有 consumer 都会协调在一起共同参与，Kafka 使用分配策略尽可能达到最公平的分配
-   Rebalance 过程会对 consumer group 产生非常严重的影响，Rebalance 的过程中**所有的消费者都将停止工作，直到 Rebalance 完成**



### 5.2.4 消费者分区分配策略

​	一个 consumer group 中有多个 consumer，一个topic 有多个 partition ，所以必然会涉及到 partition 分配的问题，即确定 那个 partition 由哪个 consumer 来消费。

​	Kafka 有三种分配策略：

​		Range ：在Java中用 RangeAssignor 类表示

​		RoundRobin ：在Java中用 RoundRobinAssignor 类表示

​		Sticky ：中Java中可以有 StickyAssignor   CooperativeStickyAssignor 来表示

#### 1 Range范围分配策略

Range 范围分配策略是 Kafka **默认的分配策略**，它可以确保每个消费者消费的分区数量是均衡的。

注意：

​	Rangle 范围分配策略是针对每个 Topic 的。

配置：

​	配置消费者的 **partition.assignment.strategy** 为 **org.apache.kafka.clients.consumer.RangeAssignor**

```java
// 修改分区分配策略
properties.put(ConsumerConfig.PARTITION_ASSIGNMENT_STRATEGY_CONFIG,"org.apache.kafka.clients.consumer.RoundRobinAssignor");

// 需要注意的是，如果修改，需要修改 consumer group 内所有的 consumer 的分配策略，避免出现错误
// 如果修改后的 consumer 重启失败，则需停止 consumer group 内所有的 consumer  等一会再重新启动
```

算法公式：
	n = 分区数量 / 消费者数量
	m = 分区数量 % 消费者数量
	前m个消费者消费n+1个
	剩余消费者消费n个

例如，

>   consumer group：3个消费者 共同消费 8个分区
>
>   n = 8 / 3 = 2
>
>   m =  8 % 3 = 2
>
>   前2个消费者 消费 2+1，即3个分区
>
>   最后 1个消费者 消费 2个分区	



#### 2 RoundRobin轮询策略

RoundRobinAssignor 轮询策略是将消费组内所有消费者以及消费者所订阅的所有 topic 的 **partition 按照字典序排序（topic 和分区的 hashcode 进行排序），然后通过轮询方式逐个将分区以此分配给每个消费者**。

配置：

配置消费者的 **partition.assignment.strategy** 为 org.apache.kafka.clients.consumer.RoundRobinAssignor。

```java
// 修改分区分配策略
properties.put(ConsumerConfig.PARTITION_ASSIGNMENT_STRATEGY_CONFIG,"org.apache.kafka.clients.consumer.RoundRobinAssignor");

// 需要注意的是，如果修改，需要修改 consumer group 内所有的 consumer 的分配策略，避免出现错误
// 如果修改后的 consumer 重启失败，则需停止 consumer group 内所有的 consumer  等一会再重新启动
```



#### 3 Stricky粘性分配策略

​	从 Kafka 0.11.x 开始，引入此类分配策略。首先会尽量均衡的放置分区到 consumer 上面，在出现同一 **consumer group 内 consumer 出现问题**时（即会发生rebalance ），会**尽量保持原有分配的分区不变化**。

​	没有发生 rebalance 时，Striky 粘性分配策略和 RoundRobin 分配策略类似。

​	在发生 rebalance时，如果是 Range 分配和 RoundBobin轮询分配都会重新进行分配分区

配置：

​	配置消费者的 **partition.assignment.strategy** 为 org.apache.kafka.clients.consumer.StickyAssignor

```java
// 修改分区分配策略
properties.put(ConsumerConfig.PARTITION_ASSIGNMENT_STRATEGY_CONFIG,"org.apache.kafka.clients.consumer.StickyAssignor");
```



### 5.2.5 offset的维护

​	生产者生成的消息，在topic中存储的时候，每条消息都会有自己的唯一位置标记，称为offset。

​	消费者在消费数据的时候可以从头开始消费，可以从最新的位置消费，也可以从指定的offset进行消费。

​	但是由于 consumer 在消费过程中可能会出现断电宕机等故障，consumer 恢复以后，需要从故障前的位置继续消费，所以 **consumer 需要实时记录**自己消费到了哪个 **offset，以便在故障恢复后继续消费。**（就是为了实现“断电续传"功能）

​	**Kafka默认是会定期自动提交offset的**

​				**（`enable.auto.commit=true`  ` auto.commit.interval.ms=5000`）**

​	**consumer 是按照消费者组来保存offset的（保存起来，做成一个offset map）**，不是按照消费者单独保存的，如果某个消费者挂掉了，按消费者保存就无法获取上之前消费到的offset

所以Kafka采用  **consumer group +Topic + Partition** 来**确定唯一的一个offset**

​	在 **Kafka 0.9 版本之前**，consumer 默认将 **offset 保存在 zookeeper**中（/consumers/[group.id]/offsets/[topic]/partitionID）

​	**从0.9版本开始**，consumer 默认将 **offset 保存中 Kafka 内置的 topic** 中，该 topic 为 **__consuemr_offsets**。 

如下

```shell
[root@kk01 kafka_2.13-3.0.0]# cd datas/
[root@kk01 datas]# pwd
/opt/software/kafka_2.13-3.0.0/datas
[root@kk01 datas]# ll    # 下面以 __consumer_offsets开头的都是Kafka内置的topic
total 16
-rw-r--r--. 1 nhk nhk   0 May 11 23:39 cleaner-offset-checkpoint
drwxr-xr-x. 2 nhk nhk 204 May 19 02:47 __consumer_offsets-0
drwxr-xr-x. 2 nhk nhk 167 May 19 02:47 __consumer_offsets-12
drwxr-xr-x. 2 nhk nhk 167 May 19 02:47 __consumer_offsets-15
........

drwxr-xr-x. 2 nhk nhk 167 May 19 02:47 __consumer_offsets-36
drwxr-xr-x. 2 nhk nhk 167 May 19 02:47 __consumer_offsets-39
drwxr-xr-x. 2 nhk nhk 167 May 19 02:47 __consumer_offsets-42
drwxr-xr-x. 2 nhk nhk 167 May 19 02:47 __consumer_offsets-45
drwxr-xr-x. 2 nhk nhk 167 May 19 02:47 __consumer_offsets-48
drwxr-xr-x. 2 nhk nhk 167 May 19 02:47 __consumer_offsets-6
drwxr-xr-x. 2 nhk nhk 167 May 19 02:47 __consumer_offsets-9
drwxr-xr-x. 2 nhk nhk 204 May 19 02:47 first-0
drwxr-xr-x. 2 nhk nhk 204 May 19 02:47 first-1
drwxr-xr-x. 2 nhk nhk 204 May 19 02:47 first-2
-rw-r--r--. 1 nhk nhk   4 May 18 23:59 log-start-offset-checkpoint
-rw-r--r--. 1 nhk nhk  88 May 19 02:47 meta.properties
-rw-r--r--. 1 nhk nhk 454 May 18 23:59 recovery-point-offset-checkpoint
-rw-r--r--. 1 nhk nhk 454 May 19 02:48 replication-offset-checkpoint
```

默认情况下，Kafka内置的topic是排除在外的，我们是消费不到的

可以修改 kafka配置文件consumer.properties（在Kafka按照目录的config目录下） 不排除内部的topic

```properties
# 添加上如下参数，我们就可以消费Kafka内置的topic了
exclude.internal.topics=false
```

在我们书写代码的时候也可以加上配置参数来消费 Kafka内置的topic

```java
// 设置不排除内部 offset，否则看不到 __consumer_offsets
properties.put(ConsumerConfig.EXCLUDE_INTERNAL_TOPICS_CONFIG,"false");
```

#### 自动提交offset

1）编写代码

需要用到的类：

​	KafkaConsumer：需要创建一个消费者对象，用来消费数据

​	ConsumerConfig：获取所需的一些列配置参数

​	ConsumerRecord：每条数据都要封装成 ConsumerRecord 对象

为了使我们能够专注于自己的业务逻辑，**Kafka提供了自动提交 offset 的功能**，自动提交 offset的相关参数：

```shell
enable.auto.commit		 是否开启自动提交 offset 的功能（默认开启）
auto.commit.interval.ms 	自动提交 offset 的时间的间隔
```

```java
// 是否自动提交 offset(默认就是自动提交)
properties.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "true");
// 提交 offset 的时间周期
properties.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, "1000");
```

2）编写代码，消费者自动提交offset

```java
// 自动提交offset
public class CustomConsumerAuto {
    public static void main(String[] args) {
        // todo 1.创建配置对象
        Properties properties = new Properties();

        // todo 2.添加配置参数
        // 必要参数
        // 这里可以只写一台kafka服务的地址，目的是连接上kafka集群，标准的做法是应该写整个集群的地址
        properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "kk01:9092");
        // 反序列化
        properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
                "org.apache.kafka.common.serialization.StringDeserializer");
        properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
                "org.apache.kafka.common.serialization.StringDeserializer");
        // 消费者组
        properties.put(ConsumerConfig.GROUP_ID_CONFIG, "group_1");
        // 是否自动提交 offset(默认就是自动提交)
        properties.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "true");
        // 提交 offset 的时间周期
        properties.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, "1000");

        // todo 3.创建 Kafka 消费者
        KafkaConsumer<String, String> kafkaConsumer = new KafkaConsumer<>(properties);
        // 注册主题 否则报错 Consumer is not subscribed to any topics or assigned any partitions
        Collection<String> topics = Arrays.asList("first");
        kafkaConsumer.subscribe(topics);

        // todo 4.调用方法消费数据
        // 消费者消费数据字段死循环的逻辑
        // 拉取到数据
        while (true) {
            // 参数 Duration timeout 表示超时时间，表示没有拉取到数据的时候，睡眠线程1s
            ConsumerRecords<String, String> consumerRecords = kafkaConsumer.poll(Duration.ofSeconds(1));

            // 处理数据
            for (ConsumerRecord<String, String> consumerRecord : consumerRecords) {
                System.out.println(consumerRecord);
            }
        }

        // todo 5.关闭连接
        //kafkaConsumer.close();
    }
}
```

#### 重置offset

```
auto.offset.reset = earliest | latest | none
```

​	当 Kafka 中没有初始偏移量（消费者组第一次消费）或 服务器上不再存在当前偏移量时（例如该数据已被删除），该怎么办：

-   **earliest**：自动将偏移量重置为最早的偏移量

-   **latest（默认值）**：自动将偏移量重置为最新偏移量

-   **none**：如果未找到消费者组的先前偏移量，则**向消费者抛出异常**

```java
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import java.time.Duration;
import java.util.Arrays;
import java.util.Collection;
import java.util.Properties;

// 重置offset
public class CustomConsumerReset {
    public static void main(String[] args) {
        // todo 1.创建配置对象
        Properties properties = new Properties();

        // todo 2.添加配置参数
        // 必要参数
        // 这里可以只写一台kafka服务的地址，目的是连接上kafka集群，标准的做法是应该写整个集群的地址
        properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "kk01:9092");
        // 反序列化
        properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
                "org.apache.kafka.common.serialization.StringDeserializer");
        properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
                "org.apache.kafka.common.serialization.StringDeserializer");
        // 消费者组
        properties.put(ConsumerConfig.GROUP_ID_CONFIG, "group_2");

        // 如果是一直使用同一个消费者组，会触发 断点续传 能够消费到之前的数据
        // 如果是一个新的消费者组来消费 会触发offset重置
        // earliest：表示重置之后会从最开始的数据进行消费
        //      todo 一般需要同时修改新的 consumer group 才会生效
        // latest：默认值，表示新的消费者组不会消费之前的数据
        properties.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG,"earliest");

        // todo 3.创建 Kafka 消费者
        KafkaConsumer<String, String> kafkaConsumer = new KafkaConsumer<>(properties);
        // 注册主题 否则报错 Consumer is not subscribed to any topics or assigned any partitions
        Collection<String> topics = Arrays.asList("first");
        kafkaConsumer.subscribe(topics);

        // todo 4.调用方法消费数据
        // 消费者消费数据字段死循环的逻辑
        // 拉取到数据
        while (true) {
            // 参数 Duration timeout 表示超时时间，表示没有拉取到数据的时候，睡眠线程1s
            ConsumerRecords<String, String> consumerRecords = kafkaConsumer.poll(Duration.ofSeconds(1));

            // 处理数据
            for (ConsumerRecord<String, String> consumerRecord : consumerRecords) {
                System.out.println(consumerRecord);
            }
        }

        // todo 5.关闭连接
        //kafkaConsumer.close();
    }
}
```

#### 手动提交offset

​	虽然自动提交 offset 十分简洁便利，但由于其是基于时间提交的，开发人员很难把握 offset 提交的时机。因此Kafka 还提供了手动提交 offset 的API。

手动提交 offset 的方式有两种：

-   **commitSync**（同步提交）
-   **commitAsync**（异步提交）

两者的相同点是，都会将 **本次 poll 的一批数据最高的偏移量提交**。

不同点是，commitSync 阻塞当前线程，一直提交成功，并且会自动失败重试（由不可控因素导致，也会出现提交失败）；而 commitAsync 则没有失败重试机制，故有可能提交失败。

推荐方式：

​	**选用异步提交的方式，效率更高。**

```java
import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.common.TopicPartition;

import java.time.Duration;
import java.util.Arrays;
import java.util.Collection;
import java.util.Map;
import java.util.Properties;

// 手动提交 offset
public class CustomConsumerManual {
    public static void main(String[] args) {
        // todo 1.创建配置对象
        Properties properties = new Properties();

        // todo 2.添加配置参数
        // 必要参数
        // 这里可以只写一台kafka服务的地址，目的是连接上kafka集群，标准的做法是应该写整个集群的地址
        properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "kk01:9092");
        // 反序列化
        properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
                "org.apache.kafka.common.serialization.StringDeserializer");
        properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
                "org.apache.kafka.common.serialization.StringDeserializer");
        // 消费者组
        properties.put(ConsumerConfig.GROUP_ID_CONFIG, "group_1");

        // todo 是否自动提交 offset
        //      默认自动提交 ，如果要手动提交，需要修改参数为 false
        properties.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");

        // todo 3.创建 Kafka 消费者
        KafkaConsumer<String, String> kafkaConsumer = new KafkaConsumer<>(properties);
        // 注册主题 否则报错 Consumer is not subscribed to any topics or assigned any partitions
        Collection<String> topics = Arrays.asList("first");
        kafkaConsumer.subscribe(topics);

        // todo 4.调用方法消费数据
        // 消费者消费数据字段死循环的逻辑
        // 拉取到数据
        while (true) {
            // 参数 Duration timeout 表示超时时间，表示没有拉取到数据的时候，睡眠线程1s
            // todo 如果是自动提交 offset，会在内存中拉取到数据的时候就完成offset的提交
            //      这种方式相当于 ack = 0
            ConsumerRecords<String, String> consumerRecords = kafkaConsumer.poll(Duration.ofSeconds(1));

            // 处理数据
            for (ConsumerRecord<String, String> consumerRecord : consumerRecords) {
                System.out.println(consumerRecord);
            }
            // todo 处理完数据以后，手动提交 offset
            // 例如，如果处理数据包含容错的落盘，数据就不会丢失， 比如 上传至hdfs
            // 同步提交
            kafkaConsumer.commitSync();

            // 异步提交（效率更高）
            kafkaConsumer.commitAsync(new OffsetCommitCallback() {
                // 提交offset 后的回调函数
                @Override
                public void onComplete(Map<TopicPartition, OffsetAndMetadata> offsets, Exception exception) {
                    if (exception!=null){
                        exception.printStackTrace();
                    }else {
                        System.out.println(offsets);
                    }
                }
            });
        }

        // todo 5.关闭连接
        //kafkaConsumer.close();
    }
}
```

数据漏消费和重复消费的问题

-   无论是同步提交还是异步提交 offset，都有可能 会造成数据的漏消费 或重复消费。

-   先提交 offset 后消费，有可能造成数据的漏消费；

-   而先消费后提交 offset，有可能造成数据的重复消费；



### 5.2.6 Consumer事务

​	上述事务机制主要是从 Producer 方面考虑，对于 Consumer 而已，事务的保证就会相对较弱，尤其是无法保证 Commit 的信息 被精确消费。这是由于 Conusmer 可以通过 offset 访问任意信息，而且不同的 Segment File 生命周期不同，同一事务的消息可能会出现重启后删除的情况。

如果想完成 Consumer 端的精准一次性消费，那么需要 **Kafka 消费端将消费过程和提交 offset 过程做原子绑定**。此时我们需要将 Kafka 的 offset 保存到支持事务的自定义介质（比如MySQL）。



# 6 Kafka 高效读写数据

## 6.1 顺序写磁盘

​	Kafka 的 producer 生产数据，要写入到 log 文件，写的过程是一直追加到文件末端，为顺序写。官网有数据表明，同样的磁盘，顺序读写能到 600M/s，而随机读写只有 100K/s。这与磁盘的机械结构有关。顺序写一所以快，是因为省去了大量磁头寻址的时间。

## 6.2 零拷贝技术

**Kafka 数据持久化是直接持久化到 Pagecache 中**，这样会产生以下几个好处：

-   ​	I/O Scheduler 会将连续的小块写组装成大块的物理写从而提高性能
-   ​	I/O Scheduler 会尝试将一些写操作重新按顺序排号，从而减少磁盘头的一段时间
-   ​	充分利用所有的空间内存（非JVM内存）。如果使用应用层 Cache（即 JVM 堆内存），会增加 Gc 负担。
-   ​	**读操作可直接在 Page Cache 内进行。如果消费和生产速度相对，甚至不需要通过物理磁盘（直接通过 Page Cache）交换数据**
-   ​	如果进程重启，JVM 内的Cache 会失效，但 Page Cache 仍然可用 

尽管持久化到 Page Cache 上可能会造成宕机丢失数的情况，但这可以被 Kafka 的 Replication 机制解决。如果为了保证这种情况下数据不丢失而强制将 Page Cache 中的数据 Flush 到磁盘，反而会降低性能。



​	传统的数据传输方式需要将数据从内核空间复制到用户空间，然后再从用户空间复制到网络缓冲区，最后再从网络缓冲区复制到目标主机的网络缓冲区，这样就需要进行多次数据复制，效率较低。

​	而**采用零拷贝技术，可以避免多次数据复制，提高数据传输的效率**。具体来说，零拷贝技术通过将数据从磁盘或内存映射文件直接传输到网络缓冲区，避免了数据在内核空间和用户空间之间的复制，从而减少了数据传输的开销。

​	在 Kafka 中，**零拷贝技术主要应用在生产者和消费者的数据传输过程中**。生产者将消息写入磁盘或内存映射文件时，可以直接将数据传输到网络缓冲区，消费者从网络缓冲区读取消息时，也可以直接将数据传输到内存或磁盘中，避免了多次数据复制，提高了数据传输的效率。



# 7 Zookeeper在 Kafka 中的作用

## 7.1 Kafka在zookeeper中目录说明

说明：

​	我们不是Kafka集群时在 server.properties 配置文件有如下参数

```shell
zookeeper.connect=kk01:2181,kk02:2181,kk03:2181/kafka
```

所以我们Kafka都在zookeeper中的 /kafka 目录

```shell
[zk: localhost:2181(CONNECTED) 1] ls /
[kafka, zookeeper]
[zk: localhost:2181(CONNECTED) 2] ls /kafka
[admin, brokers, cluster, config, consumers, controller, controller_epoch, feature, isr_change_notification, latest_producer_id_block, log_dir_event_notifica
tion]
```

### **/kafka/cluster**

```shell
[zk: localhost:2181(CONNECTED) 3] ls /kafka/cluster
[id]
[zk: localhost:2181(CONNECTED) 4] ls /kafka/cluster/id
[]
[zk: localhost:2181(CONNECTED) 5] get /kafka/cluster/id
{"version":"1","id":"2qf2nPviRZy4F859KOYwzw"}   # 表示的是一个Kafka集群包含集群的版本，和集群的id
```

### /kafka/controller

```shell
[zk: localhost:2181(CONNECTED) 6] ls /kafka/controller
[]
[zk: localhost:2181(CONNECTED) 7] get /kafka/controller
{"version":1,"brokerid":0,"timestamp":"1687591476077"}

# controller是Kafka中非常重要的一个角色，可以控制partition的leader选举，topic的crud操作
# brokerid意为由其id对于的broker承担controller角色
```

### /kafka/controller_epoch

```shell
[zk: localhost:2181(CONNECTED) 8] get /kafka/controller_epoch
6

# 代表 controller 的纪元，换句话说代表 controller的更迭，每当controller的brokerid更换一次，controller_epoch就 +1
```

### /kafka/brokers/ids

​	**Broker是分布式部署并且相互之间相互独立，但是需要有一个注册系统能够将整个集群中的Broker管理起来**，此时就使用到了Zookeeper。在Zookeeper上会有一个专门**用来进行Broker服务器列表记录**的节点：

```
/kafka/brokers/ids
```

​	**每个Broker在启动时，都会到Zookeeper上进行注册，即到/brokers/ids下创建属于自己的节点**，如/brokers/ids/[0...N]。

```shell
[zk: localhost:2181(CONNECTED) 9] ls /kafka/brokers
[ids, seqid, topics]
[zk: localhost:2181(CONNECTED) 10] ls /kafka/brokers/ids
[0, 1, 2]		# 存放当前kafka的broker实例列表
[zk: localhost:2181(CONNECTED) 14] get /kafka/brokers/ids/1
{"features":{},"listener_security_protocol_map":{"PLAINTEXT":"PLAINTEXT"},"endpoints":["PLAINTEXT://kk02:9092"],"jmx_port":-1,"port":9092,"host":"kk02","vers
ion":5,"timestamp":"1687591477370"}
```

​	Kafka使用了全局唯一的数字来指代每个Broker服务器，不同的Broker必须使用不同的Broker ID进行注册，创建完节点后，**每个Broker就会将自己的IP地址和端口信息记录**到该节点中去。其中，Broker创建的节点类型是临时节点，一旦Broker宕机，则对应的临时节点也会被自动删除。

### /kafka/brokers/topics

​	在Kafka中，同一个**Topic的消息会被分成多个分区**并将其分布在多个Broker上，**这些分区信息及与Broker的对应关系**也都是由Zookeeper在维护，由专门的节点来记录，如：

```
/kafka/brokers/topics
```

​	Kafka中每个Topic都会以/brokers/topics/[topic]的形式被记录，如/brokers/topics/login和/brokers/topics/search等。Broker服务器启动后，会到对应Topic节点（/brokers/topics）上注册自己的Broker ID并写入针对该Topic的分区总数，如/brokers/topics/login/3->2，这个节点表示Broker ID为3的一个Broker服务器，对于"login"这个Topic的消息，提供了2个分区进行消息存储，同样，这个分区节点也是临时节点。

```shell
[zk: localhost:2181(CONNECTED) 17] ls /kafka/brokers/topics
[first]   # 当前Kafka中topic列表
```

### /kafka/brokers/seqid

```shell
[zk: localhost:2181(CONNECTED) 18] ls /kafka/brokers/seqid
[]
[zk: localhost:2181(CONNECTED) 19] get /kafka/brokers/seqid
null

# 系统的序列id
```

### /kafka/consumers

​	老版本用于存储kafka消费者的信息，主要保存对应的offset，新版本基本不用，此时用户的消息，保存在一个系统的topic中：__conumser_offsets

```shell
[zk: localhost:2181(CONNECTED) 21] ls /kafka/consumers
[]
```

### /kafka/config

主要存放配置信息

```shell
[zk: localhost:2181(CONNECTED) 23] ls /kafka/config
[brokers, changes, clients, ips, topics, users]
```



## 7.2 生产者负载均衡

​	由于同一个Topic消息会被分区并将其分布在多个Broker上，因此，**生产者需要将消息合理地发送到这些分布式的Broker上**，那么如何实现生产者的负载均衡，Kafka支持传统的四层负载均衡，也支持Zookeeper方式实现负载均衡。

(1) 四层负载均衡，根据生产者的IP地址和端口来为其确定一个相关联的Broker。通常，一个生产者只会对应单个Broker，然后该生产者产生的消息都发往该Broker。这种方式逻辑简单，每个生产者不需要同其他系统建立额外的TCP连接，只需要和Broker维护单个TCP连接即可。但是，其无法做到真正的负载均衡，因为实际系统中的每个生产者产生的消息量及每个Broker的消息存储量都是不一样的，如果有些生产者产生的消息远多于其他生产者的话，那么会导致不同的Broker接收到的消息总数差异巨大，同时，生产者也无法实时感知到Broker的新增和删除。

(2) 使用Zookeeper进行负载均衡，由于每个Broker启动时，都会完成Broker注册过程，生产者会通过该节点的变化来动态地感知到Broker服务器列表的变更，这样就可以实现动态的负载均衡机制。

## 7.3 消费者负载均衡

​	与生产者类似，Kafka中的消费者同样需要进行负载均衡来实现多个消费者合理地从对应的Broker服务器上接收消息，每个消费者分组包含若干消费者，**每条消息都只会发送给分组中的一个消费者**，不同的消费者分组消费自己特定的Topic下面的消息，互不干扰。



## 7.4 分区 与 消费者 的关系

**消费组 (Consumer Group)：**
consumer group 下有多个 Consumer（消费者）。
对于每个消费者组 (Consumer Group)，Kafka都会为其分配一个全局唯一的Group ID，Group 内部的所有消费者共享该 ID。订阅的topic下的每个分区只能分配给某个 group 下的一个consumer(当然该分区还可以被分配给其他group)。
同时，Kafka为每个消费者分配一个Consumer ID，通常采用"Hostname:UUID"形式表示。

​	在Kafka中，规定了**每个消息分区 只能被同组的一个消费者进行消费**，因此，需要在 Zookeeper 上记录 消息分区 与 Consumer 之间的关系，每个消费者一旦确定了对一个消息分区的消费权力，需要将其Consumer ID 写入到 Zookeeper 对应消息分区的临时节点上，例如：

```shell
/consumers/[group_id]/owners/[topic]/[broker_id-partition_id]
```

其中，[broker_id-partition_id]就是一个 消息分区 的标识，节点内容就是该 消息分区 上 消费者的Consumer ID。

### 消息消费进度Offset 记录

​	在消费者对指定消息分区进行消息消费的过程中，**需要定时地将分区消息的消费进度Offset记录到Zookeeper上**，以便在该消费者进行重启或者其他消费者重新接管该消息分区的消息消费后，能够从之前的进度开始继续进行消息消费。Offset在Zookeeper中由一个专门节点进行记录，其节点路径为:

```shell
/consumers/[group_id]/offsets/[topic]/[broker_id-partition_id]
```

节点内容就是Offset的值。

### 消费者注册

​	消费者服务器在初始化启动时加入消费者分组的步骤如下

​	注册到消费者分组。每个消费者服务器启动时，都会到Zookeeper的指定节点下创建一个属于自己的消费者节点，例如/consumers/[group_id]/ids/[consumer_id]，完成节点创建后，消费者就会将自己订阅的Topic信息写入该临时节点。

**对 消费者分组 中的 消费者 的变化注册监听**。每个 消费者 都需要关注所属 消费者分组 中其他消费者服务器的变化情况，即对/consumers/[group_id]/ids节点注册子节点变化的Watcher监听，一旦发现消费者新增或减少，就触发消费者的负载均衡。

**对Broker服务器变化注册监听**。消费者需要对/broker/ids/[0-N]中的节点进行监听，如果发现Broker服务器列表发生变化，那么就根据具体情况来决定是否需要进行消费者负载均衡。

**进行消费者负载均衡**。为了让同一个Topic下不同分区的消息尽量均衡地被多个 消费者 消费而进行 消费者 与 消息 分区分配的过程，通常，对于一个消费者分组，如果组内的消费者服务器发生变更或Broker服务器发生变更，会发出消费者负载均衡。

### 补充

​	早期版本的 kafka 用 zk 做 meta 信息存储，consumer 的消费状态，group 的管理以及 offse t的值。考虑到zk本身的一些因素以及整个架构较大概率存在单点问题，新版本中确实逐渐弱化了zookeeper的作用。新的consumer使用了kafka内部的group coordination协议，也减少了对zookeeper的依赖



