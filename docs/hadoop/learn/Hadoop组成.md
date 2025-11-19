# Hadoop组成

**Hadoop1.x阶段**

HDFS（数据存储）、MapReduce（计算+资源调度）、Common（辅助工具）

1.x时期，mr需要同时处理业务逻辑运算又要资源调度，压力大，耦合度大。

**Hadoop2.x阶段**

HDFS（数据存储）、MapReduce（计算）、**YARN（资源调度）**、Common（辅助工具）

**Hadoop3.x阶段无变化**

- Hadoop集群包括两个：HDFS集群、YARN集群
- 两个集群逻辑上分离、通常物理上是在一起的
- 两个集群都是标准的主从架构的集群
