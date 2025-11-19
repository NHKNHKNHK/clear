# Flume数据流模型

​	Flume 常见的数据流模型有 单Agent数据流模型、多Agent串行数据流模型、多Agent汇聚数据流模型、单Agent多路数据流模型

**1） 单Agent数据流模型**

​	单Agent数据流模型，一个Agent由一个Source、一个Channel、一个Sink组成



**2）多Agent串行数据流模型**

​	假设有两个Agent，Agent1、Agent2，为了使数据在多个Agent（我们以两个为例）中流通，Agent1中的Sink 和 Agent2 中的 Source 需要是Avro类型，Agent1中的Sink 指向 Agent2 这的 Source的主机名（或IP地址）和端口



**3）多Agent汇聚数据流模型**

​	**多Agent汇聚数据流模型是采集大量日志时常用的数据流模型**。例如，将从数百个web服务器采集的日志数据发送给写入HDFS集群中的十几个Agent，此时就可以采用此模型。



4）单Agent多路数据流模型

单Agent多路数据流模型，一个Agent由一个Source、多个Channel、一个Sink组成。

一个Source接收Event，将 Event 发送到 多个Channel中，Channel对应的Sink处理各自Channel 内的 Event，然后将数据分别存储到指定的位置。



Source 将 Event 发送到 Channel 中可以采取两种不同的策略：

- **Replicating（复制通道选择器）**：即Source将每个Event发送到每个与它连接的 Channel 中，也就是将 Event复制多份发送到不同的 Channel 中

- **Multiplexing（多路复用通道选择器）**：即Source根据Hader中的一个键决定将 Event 发送到哪个Channel中
