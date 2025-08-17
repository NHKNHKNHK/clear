# **Spark 内核调度** 

Spark的核心是根据RDD来实现的，Spark Scheduler则为Spark核心实现的重要一环，其作用就是==任务调度==。Spark的任务调度就是如何组织任务去处理RDD中每个分区的数据，根据RDD的依 

赖关系构建DAG，基于DAG划分Stage，将每个Stage中的任务发到指定节点运行。基于Spark的任 

务调度原理，可以合理规划资源利用，做到尽可能用最少的资源高效地完成任务计算。



## RDD依赖





## DAG 与 Stage





## Spark Shuffle



## Job调度流程



## Spark基本概念

Spark Application运行时，涵盖很多概念，主要如下：

官方文档：http://spark.apache.org/docs/3.2.0/cluster-overview.html#glossary

-   Application：指的是用户编写的Spark应用程序/代码，包含了Driver功能代码和分布在集群中多个节点上运行的Executor代码； 
-   Application jar：Application jar一个包含用户的Spark应用程序的jar。在某些情况下，用户希望创建一个“uber jar”，其中包含他们的应用程序及其依赖项。用户的jar不应该包含Hadoop或Spark库，但是，这些将在运行时添加。

-   Driver：Spark中的Driver即运行上述Application的Main()函数并且创建SparkContext，SparkContext负责和ClusterManager通信，进行资源的申请、任务的分配和监控等； 

-   Cluster Manager：指的是在集群上获取资源的外部服务，Standalone模式下由Master负责，Yarn模式下ResourceManager负责; 

-   Executor：是运行在工作节点Worker上的进程，负责运行任务，并为应用程序存储数据，是执行分区计算任务的进程； 

-   RDD：Resilient Distributed Dataset弹性分布式数据集，是分布式内存的一个抽象概念； 

-   DAG：Directed Acyclic Graph有向无环图，反映RDD之间的依赖关系和执行流程； 

-   Job：作业，按照DAG执行就是一个作业，Job==DAG； 

-   Stage：阶段，是作业的基本调度单位，同一个Stage中的Task可以并行执行，多个Task组成TaskSet任务集； 

-   Task：任务，运行在Executor上的工作单元，1个Task计算1个分区，包括pipline上的一系列操作；

## Spark并行度

Spark作业中，各个stage的task数量，代表了Spark作业在各个阶段stage的并行度！

### 资源并行度与数据并行度



### 设置Task数量





### 设置Application的并行度

