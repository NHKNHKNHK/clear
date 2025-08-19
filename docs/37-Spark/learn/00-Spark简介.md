# Spark简述

Spark 是加州大学伯克利分校AMP实验室（Algorithms Machines and People Lab）开发的通用大数据出来框架。Spark生态栈也称为BDAS，是伯克利AMP实验室所开发的，力图在算法（Algorithms）、机器（Machines）和人（Person）三种之间通过大规模集成来展现大数据应用的一个开源平台。AMP实验室运用大数据、云计算等各种资源以及各种灵活的技术方案，对海量数据进行分析并转化为有用的信息，让人们更好地了解世界。

Spark 是一种快速、通用、可扩展的大数据分析引擎

2009 年诞生于加州大学伯克利分校AMPLab

2010 年开源

2013年6月成为Apache孵化项目

2014年2月成为 Apache 顶级项目，用 Scala进行编写项目框架

## Spark 与 Hadoop对比

Hadoop与Spark都是大数据计算框架，它们有各自的优势，主要区别如下：

### **编程方式**

-   Hadoop的MapReduce在计算时，计算过程必须要转化为Map和Reduce两个过程，从而难以描述复杂的数据处理过程
-   而Spark的计算模型不局限于Map和Reduce操作，还提供了多种数据集的操作类型，编程模型比MapReduce更加灵活。

### **数据存储**

-   Hadoop的MapReduce进行计算时，每次产生的中间结果都是存储在本地磁盘中
-   而Spark在计算时产生的中间结果存储在内存中。
-   Spark和Hadoop的**根本差异是多个作业之间的数据通信问题** : **Spark**多个作业之间数据通信是**基于内存**，而**Hadoop是基于磁盘**。

### **数据处理**

-   Hadoop在每次执行数据处理时，都需要从磁盘中加载数据，导致磁盘的IO开销比较大（这也是MapReduce的性能瓶颈）
-   而Spark在执行数据处理时，只需要将数据加载到内存中，之后直接在内存中加载中间结果数据集即可，减少了磁盘的IO开销。

### **数据容错**

-   MapReduce计算的中间结果数据保存在磁盘中，并且Hadoop框架底层实现了备份机制，从而保证数据的容错
-   同样 **Spark RDD 实现了基于Lineage（血统）的容错机制和设置检查点的容错机制**，弥补了数据在内存中处理时断电丢失的问题。

### 总结

-   Hadoop MapReduce由于其设计初衷并不是为了满足循环迭代式数据流处理，因此在多并行运行的数据可复用场景（如：机器学习、图挖掘算法、交互式数据挖掘算法）中存在诸多计算效率等问题。所以Spark应运而生，Spark就是在传统的MapReduce 计算框架的基础上，利用其计算过程的优化，从而大大加快了数据分析、挖掘的运行和读写速度，**并将计算单元缩小到更适合并行计算和重复使用的RDD计算模型**。	
-   机器学习中ALS、凸优化梯度下降等。这些都需要基于数据集或者数据集的衍生数据反复查询反复操作。MR这种模式不太合适，即使多MR串行处理，性能和时间也是一个问题。数据的共享依赖于磁盘。另外一种是交互式数据挖掘，MR显然不擅长。而Spark所基于的scala语言恰恰擅长函数的处理。
-   Spark是一个分布式数据快速分析项目。它的核心技术是弹性分布式数据集（Resilient Distributed Datasets），提供了比MapReduce丰富的模型，可以快速在内存中对数据集进行多次迭代，来支持复杂的数据挖掘算法和图形计算算法。
-   Spark Task的启动时间快。Spark采用fork线程的方式，而Hadoop采用创建新的进程的方式。
-   **Spark只有在shuffle的时候将数据写入磁盘**，而Hadoop中多个MR作业之间的数据交互都要依赖于磁盘交互
-   Spark的缓存机制比HDFS的缓存机制高效。

经过上面的比较，我们可以看出在绝大多数的数据计算场景中，Spark确实会比MapReduce更有优势。但是Spark是基于内存的，所以在实际的生产环境中，由于内存的限制，可能会由于内存资源不够导致Job执行失败，此时，MapReduce其实是一个更好的选择，所以Spark并不能完全替代MR。

## Spark核心模块

### **Spark Core**

Spark Core中**提供了Spark最基础与最核心的功能**，包含RDD、任务调度、内存管理、错误恢复、与存储系统交互等模块

Spark其他的功能如：Spark SQL，Spark Streaming，GraphX, MLlib都是在Spark Core的基础上进行扩展的

**数据结构：`RDD`**

### **Spark SQL**

Spark SQL是Spark用来操作结构化数据的组件。通过Spark SQL，用户可以使用SQL或者Apache Hive版本的SQL方言（HQL）来查询数据。

**数据结构：`Dataset/DataFrame = RDD + Schema`**

> 官网：http://spark.apache.org/sql/

### **Spark Streaming**

Spark Streaming是Spark平台上针对实时数据进行流式计算的组件，提供了丰富的处理数据流的API。

**数据结构：`DStream = Seq[RDD]`**

> 官网：http://spark.apache.org/streaming/

### Structured Streaming

Structured Streaming结构化流处理模块针对，流式结构化数据封装到DataFrame中进行分析

Structured Streaming是建立在Spark SQL引擎之上的可伸缩和高容错的流式处理引擎，可以向操作静态数据的批量计算一样来执行流式计算。当流式数据不断的到达的过程中Spark SQL的引擎会连续不断的执行计算并更新结果。

简单来说，Structured Streaming属于Spark SQL的一个功能，可以使用结构化方式处理流式计算。

> 官网：http://spark.apache.org/docs/3.2.0/structured-streaming-programming-guide.html

### **Spark MLlib**

MLlib是Spark提供的一个机器学习算法库。提供常见的机器学习(ML)功能的程序库。包括分类、回归、聚类、协同过滤等，还提供了模型评估、数据导入等额外的支持功能。

MLlib不仅提供了模型评估、数据导入等额外的功能，还提供了一些更底层的机器学习原语。

**数据结构：`RDD`或者`DataFrame`**

> 官网：http://spark.apache.org/mllib/

### **Spark GraphX**

GraphX是Spark中用于图计算的API，性能良好，拥有丰富的功能和运算符，能在海量数据上自如地运行复杂的图算法。

**数据结构：`RDD`或者`DataFrame`**

> 官网：http://spark.apache.org/graphx/

在Full Stack 理想的指引下，Spark 中的Spark SQL 、SparkStreaming 、MLLib 、GraphX 几大子框架和库之间可以无缝地共享数据和操作，这不仅打造了Spark 在当今大数据计算领域其他计算框架都无可匹敌的优势，而且使得Spark 正在加速成为大数据处理中心首选通用计算平台。 

## Spark 特点

Spark使用Scala语言实现的，它是一种面向对象、函数式变成语言，能够像操作本地集合中的数据一样操作分布式数据集。

Spark具有运行速度快、易用性好、通用性强、随处运行等特点

### 速度快

Spark支持内存计算，通过DAG执行引擎支持无环数据流，所以官方宣称其在内存在的运行速度比Hadoop的MR快100倍，在硬盘中快10倍

Spark处理数据与MR处理数据相对比：

-   Spark处理数据时，可以将中间结果数据存储在内存中
-   Spark Job调度以DAG方式，并且每个任务Task执行以线程Thread方式，并不像MR一样以进程方式进行

|              | MapReduce                                      | Spark                               |
| ------------ | ---------------------------------------------- | ----------------------------------- |
| 数据存储结构 | 磁盘HDFS                                       | 使用内存构建RDD对数据进行运行和缓存 |
| 编程范式     | Map+Reduce                                     | DAG；Transformation+action          |
| 中间结果存储 | 中间结果落盘在磁盘，IO及序列化反序列化代价很大 | 中间结果大部分存储在内存中          |
| 运行方式     | Task以进程方式维护，任务启动慢                 | Task以线程方式维护，任务启动快      |

### 易于使用

Spark支持了包括 Java、Scala、Python 、R和SQL语言在内的多种语言

### 通用性强

在 Spark 的基础上，Spark 还提供了包括Spark SQL、Spark Streaming、MLib 及GraphX在内的多个工具库，我们可以在一个应用中无缝地使用这些工具库。其中，Spark SQL 提供了结构化的数据处理方式，Spark Streaming 主要针对流式处理任务，MLlib提供了很多有用的机器学习算法库，GraphX提供图形和图形并行化计算

Run Everywhere：Spark 程序无处不在的运行，包含如下两种含义：

-   数据来源：
    -   任意地方都可以，Spark可以从任意地方读取数据，Spark1.3 开始提供一套外部数据源接口
    -   比如HDFS、JSON、CSV、Parquet、RDBMS、ES、Redis、Kafka等

-   应用程序运行在哪里：
    -   本地模式 Local
    -   集群模式：YARN、Standalone、Mesos
    -   容器中：K8s（Spark2.3支持）、Spark 1.x 支持Docker

### 运行方式

Spark编写的应用程序可以在本地模式（Local Mode）、集群模式（Cluster Mode）和云服务（Cloud），方便开发测试和生产部署。

-   **本地模式**

将Spark应用程序中每个Task运行在一个本地JVM Process进程中，通常开发测试使用。

启动一个JVM进程，运行所有Task任务，每个Task运行需要1 Core CPU。

建议：在本地运行时，最好设置2个CPU Core，即  local[2]

-   **集群模式**

将Spark应用程序运行在YARN集群或Spark自身的Standalone集群及Apache Mesos集群

> 网址：http://spark.apache.org/docs/3.2.0/

在集群模式下，会启动多个JVM进程

管理者：AppMaster（MR）、Driver Program（Spark）、JobManager（Flink）

真正干活的：JVM进程中运行的Task任务，MapTask和ReduceTask（MR）、Executor（Spark）、TaskManager（Flink）

**1）Hadoop YARN集群**

运行在yarn集群之上，由 yarn 负责资源管理，Spark负责任务调度和计算。

好处：计算资源按需伸缩，集群资源利用率高，共享底层存储，避免数据跨集群迁移

**2）Spark Standalone集群**

类似与Hadoop YARN架构，典型的Master/Slaves架构，使用Zookeeper搭建高可用，避免Master的单点故障

**3）Apache Mesos集群**

运行在 mesos 资源管理器框架之上，由 mesos 负责资源管理，Spark 负责任务调度和计算

-   **云服务：Kubernetes**

Spark 2.3开始支持将Spark应用运行到K8s上


## Spark运行架构

### 基本术语

Master（standalone模式）：资源管理的主节点（进程），管理所有的资源

Worker（Standalone模式）：资源管理的从节点（进程），或者说是管理本机资源的进程

#### **Application（应用）**

​Spark上运行的应用。Application中包含了一个**驱动器（Dirver）**进程和集群上的**多个执行器（Executor）**进程

#### **Driver Program（驱动器）**

​运行`main()`方法并创建`SparkContext`的进程

#### **ClusterManager（集群管理器）**

​用于**在集群上申请资源的外部服务**（如独立部署的集群管理器standalone、Mesos或Yarn）

#### **WorkerNode（工作节点）**

​集群上运行应用程序代码的任意节点

#### **Executor（执行器）**

​是在一个 worker 进程所管理的节点上为某 Application 启动的一个一个进程，这个进程负责运行任务，并且负责将数据存在内存或者磁盘上，每个应用之间都有各自独立的executors

#### **Task（任务）**

​执行器的工作单元（被发送到executors 上的工作单元）

#### **Job（作业）**

​一个并行计算作业，**由一组任务（Task）组成**，并**由Spark的行动**（Action）**算子触发**（如save、collect等）**启动**

#### **Stage（阶段）**

​**一个 job 会被拆分为 很多组任务(task)，每组任务被称为 Stage**（就像MapReduce 分为 MapTask 和 ReduceTask 一样）


### 运行架构

Spark框架的核心是一个计算引擎，整体来说，它采用了**标准 master-slave** 的结构。

### 核心组件

对于Spark框架有两个核心组件：

#### Driver

Spark驱动器节点，用于**执行Spark任务中的main方法，负责实际代码的执行工作**。Driver在Spark作业执行时主要负责：

-   将**用户程序转化为作业（job）**
-   **在Executor之间调度任务(task)**
-   跟踪Executor的执行情况
-   通过UI展示查询运行情况

实际上，我们无法准确地描述Driver的定义，因为在整个的编程过程中没有看到任何有关Driver的字眼。所以简单理解，所谓的Driver就是驱使整个应用运行起来的程序，也称之为Driver类。

#### Executor

Spark **Executor是集群中工作节点（Worker）**中的一个JVM进程，**负责**在 Spark 作业中**运行具体任务**（Task），任务彼此之间相互独立。

Spark 应用启动时，Executor节点被同时启动，并且始终伴随着整个 Spark 应用的生命周期而存在。

如果有Executor节点发生了故障或崩溃，Spark 应用也可以继续执行，会将出错节点上的任务调度到其他Executor节点上继续运行。

Executor有两个核心功能：

-   负责运行组成Spark应用的任务，并将结果返回给驱动器进程
-   它们通过自身的块管理器（Block Manager）为用户程序中要求缓存的 RDD 提供内存式存储。RDD 是直接缓存在Executor进程内的，因此任务可以在运行时充分利用缓存数据加速运算。

#### Master & Worker

​Spark集群的**独立部署环境（Standalone）中，不需要依赖其他的资源调度框架，自身就实现了资源调度的功能**

所以环境中还有其他两个核心组件：
- **Master和Worker**，这里的**Master**是一个进程，主要负责**资源的调度和分配**，并进行集群的监控等职责，**类似于Yarn环境中的RM**
- 而**Worker**呢，也是进程，一个Worker运行在集群中的一台服务器上，由Master分配资源对数据进行并行的处理和计算，**类似于Yarn环境中NM**。

简单来说，Master类似于 yarn的 RM，Driver类似于 yarn的 AM，Slaves类似于 yarn的 NM

#### ApplicationMaster

Hadoop用户向YARN集群提交应用程序时,提交程序中应该包含ApplicationMaster，用于向资源调度器申请执行任务的资源容器Container，运行用户自己的程序任务job，监控整个任务的执行，跟踪整个任务的状态，处理任务失败等异常情况。

说的简单点就是，**ResourceManager（资源）和Driver（计算）之间的解耦合靠的就是ApplicationMaster**。

### 核心概念

#### Executor 与 Core（核）

Spark Executor是集群中运行在工作节点（Worker）中的一个JVM进程，是**整个集群中的专门用于计算的节点**。在提交应用中，可以提供参数指定计算节点的个数，以及对应的资源。这里的资源一般指的是工作节点Executor的内存大小和使用的虚拟CPU核（Core）数量。

应用程序相关启动参数如下：

| 名称              | 说明                               |
| ----------------- | ---------------------------------- |
| --num-executors   | 配置Executor的数量                 |
| --executor-memory | 配置每个Executor的内存大小         |
| --executor-cores  | 配置每个Executor的虚拟CPU core数量 |

#### 并行度（Parallelism）

在分布式计算框架中一般都是多个任务同时执行，由于任务分布在不同的计算节点进行计算，所以能够真正地实现多任务并行执行，记住，这里是并行，而不是并发。这里我们将**整个集群并行执行任务的数量称之为并行度**。那么一个作业到底并行度是多少呢？这个取决于框架的默认配置。应用程序也可以在运行过程中动态修改。

#### 有向无环图（DAG）

大数据计算引擎框架我们根据使用方式的不同一般会分为四类，其中第一类就是Hadoop所承载的MapReduce,它将计算分为两个阶段，分别为 Map阶段 和 Reduce阶段。

对于上层应用来说，就不得不想方设法去拆分算法，甚至于不得不在上层应用实现多个 Job 的串联，以完成一个完整的算法，例如迭代计算。

由于这样的弊端，催生了支持 DAG 框架的产生。

因此，支持 DAG 的框架被划分为第二代计算引擎。如 Tez 以及更上层的 Oozie。

这里我们不去细究各种 DAG 实现之间的区别，不过对于当时的 Tez 和 Oozie 来说，大多还是批处理的任务。

接下来就是以 **Spark 为代表的第三代的计算引擎。第三代计算引擎的特点主要是 Job 内部的 DAG 支持（不跨越 Job），以及实时计算。**

这里所谓的有向无环图，并不是真正意义的图形，而是**由Spark程序直接映射成的数据流的高级抽象模型**。简单理解就是将整个程序计算的执行过程用图形表示出来,这样更直观，更便于理解，可以用于表示程序的拓扑结构。

DAG（Directed Acyclic Graph）有向无环图是由点和线组成的拓扑图形，该图形具有方向，不会闭环。

## Spark Application应用架构

当Spark Application运行到Standalone集群时，由两部分组成：

-   Driver Program（类似于Hadoop AppMaster）
    -   整个应用管理者，负责应用中所有Job的调度执行
    -   运行JVM Process，运行程序的main函数，必须创建SparkContext上下文对象
    -   一个Spark Application有且仅有一个 Driver Program
-   Executors（类似与Hadoop的 MapTask、ReduceTask）
    -   每个Executors节点会启动一个 JVM Process，其中有很多线程，其中运行了Task任务，每个Task以线程的方式运行
    -   这么说Executors就相对于一个线程池
    -   一个Task的运行需要1 Core CPU，所以可以认为Executor在线程数就等于CPU Core核数
    -   一个Spark Application可以有很多，可以设置个数和资源信息
    -   **所有的Executor必须运行在Worker上**

Driver Program 是用于编写的数据处理逻辑（一般是我们写的代码），这个逻辑在包含用户创建的SparkContext。

SparkContext 是用户逻辑与Spark集群主要的交互接口，它会和 Cluster Manager 交互，包括向它申请资源计算等。

Cluster Manager负责集群的资源管理和调度，现在支持Standalone、Apache Mesos和 Hadoop YARN。Worker Node是集群在可以执行计算任务的节点。

Executor 是在一个Worker Node上为某应用程序启动的一个进程，该进程负责运行任务，并且负责将数据存在内存或磁盘上。

Task是被发送到某个Executor 上的计算单元，每个应用程序都有各自独立的Executor，计算最终在计算节点的 Executor 中执行。


### Spark应用程序提交流程

​所谓的提交流程，其实就是我们开发人员根据需求写的**应用程序通过Spark客户端提交给Spark运行环境执行计算的流程。**

应用程序从最开始的提交到最多的计算执行，需要经历以下几个阶段：

-   1）用户程序创建 SparkContext 时，新创建的 Spark Context 实例会连接到 ClusterManager。Cluster Manager 会根据用户提交时设置的 CPU 和 内存等信息为本次提交分配计算资源，启动Executor
-   2）Driver会将用户程序划分为不同的执行阶段（stage），每个阶段由一组完全相同Task组成，这些Task分别作用于待处理数据的不同分区。在阶段划分完成和Task创建后，Driver会向Executor发送Task。
-   3）Executor在接收到Task以后，会下载Task的运行时依赖，在准备好Task的执行环境后，会开始执行Task，并且将Task的运行的运行状态汇报给Driver
-   4）Driver会根据收到的Task的运行状态来处理不同的状态更新。Task分为两种：
    -   一种是ShuffleMap Task，它实现数据的重新洗牌，洗牌的结果保存到Executor所在节点的文件系统中
    -   另一种是Result Task，它负责生成结果数据
-   5）Driver 会不断地调用Task，将Task发送到Executor 执行，在所有的 Task都正确执行或超过执行的次数的限制仍然没有执行超过时执行

在不同的部署环境中，这个提交过程基本相同，但是又有细微的区别，我们这里不进行详细的比较，但是因为国内工作中，将Spark引用部署到Yarn环境中会更多一些，所以我们主要学习基于yarn的提交流程。

Spark应用程序提交到Yarn环境中执行的时候，一般会有两种部署执行的方式：`Client` 和 `Cluster`

**两种模式主要区别在于：Driver程序的运行节点位置。**

#### Yarn Client模式

Client模式将用于监控和调度的Driver模块在客户端执行，而不是在Yarn中，所以一般用于测试。

1）**Driver在任务提交的本地机器上运行**

2）Driver启动后会和ResourceManager通讯**申请启动ApplicationMaster**

3） ResourceManager分配 container，在合适的NodeManager上启动ApplicationMaster，负责向ResourceManager申请Executor内存

3）ResourceManager接到ApplicationMaster的资源申请后会分配container，然后ApplicationMaster在资源分配指定的NodeManager上启动Executor进程

4）Executor进程启动后会向Driver反向注册，Executor全部注册完成后Driver开始执行main函数

5）之后执行到Action算子时，触发一个Job，并根据宽依赖开始划分stage，每个stage生成对应的TaskSet，之后将task分发到各个Executor上执行。

#### Yarn Cluster模式

Cluster模式将用于监控和调度的**Driver模块启动在Yarn集群资源中执行**。一般应用于实际生产环境。

1）在YARN Cluster模式下，任务提交后会和ResourceManager通讯申请启动ApplicationMaster，

2）随后ResourceManager分配container，在合适的NodeManager上启动ApplicationMaster，此时的ApplicationMaster就是Driver。

3）Driver启动后向ResourceManager申请Executor内存，ResourceManager接到ApplicationMaster的资源申请后会分配container，然后在合适的NodeManager上启动Executor进程

4）Executor进程启动后会向Driver反向注册，Executor全部注册完成后Driver开始执行main函数，

5）之后执行到Action算子时，触发一个Job，并根据宽依赖开始划分stage，每个stage生成对应的TaskSet，之后将task分发到各个Executor上执行。

## spark资源调度和任务调度

spark资源调度和任务调度的流程

-   启动集群后，**Worker** 节点会向 **Master** 节点汇报资源情况，**Master 掌握了集群资源情况**。
-   当 **Spark 提交一个 Application** 后，**根据 RDD 之间的依赖关系**将 Application 形成一个 **DAG**有向无环图。
-   任务提交后，Spark 会在 **Driver 端创建两个对象 DAGScheduler 和 TaskScheduler**，DAGScheduler 是任务调度的**高层**调度器，是一个对象
-   **DAGScheduler** 的主要作用就是将 DAG 根据 RDD 之间的**宽窄依赖关系划分一个个的Stage**，然后将这些 **Stage 以 TaskSet 的形式提交给 TaskScheduler**（**TaskScheduler** 是任务调度的**低层**调度器，这里 TaskSet 其实就是一个集合，里面封装的就是一个个 task 任务，也就是 stage 中并行的 task 任务）
-   **TaskScheduler 会遍历 TaskSet**集合，拿到每个 task 后会**将 task 发送到 Executor** 中去执行（其实就是发送到 Executor 中的线程池 ThreadPool 去执行）
-   task 在 Executor 线程池中的运行情况会向 TaskScheduler 反馈，当 **task 执行失败**时，则由 **TaskScheduler 负责重试**，将 task 重新发送给 Executor 去执行，默认重试三次。如果**重试3次依然失败**。那么这个 task 所在的 **stage  就失败**了。
-   **stage** 失败了则由 **DAGScheduler 来负责重试**，重新发送 TaskSet 到 TaskScheduler，stage模式重试4次。如果重试4次以后**依然失败**，那么这个 **job 就失败**了。job 失败了，**Application就失败了**。
-   TaskScheduler 不仅重试失败的 task，还会重试 straggling（落后，缓慢）task（也就是执行速度比其他 task 慢太多的task）。如果有运行缓慢的task 那么 TaskScheduler 会启动一个新的 task 来与这个运行缓慢的 task 执行相同的处理逻辑。两个task 哪个先执行完，就以哪个 task 的执行结果为准。这就是 Spark 的**推测执行机制**。在 Saprk 中**推测执行默认是关闭的**。推测执行可以通过 **spark.speculation** 属性来配置

:::warning 注意
对于 **ETL** 类型要**入数据库**的业务要**关闭推测执行机制**，这样就不会有重复的数据入库

​如果遇到数据倾斜的情况，开启推测执行则有可能导致一直会有 task 重新启动处理相同的逻辑，任务可能一直处理不完的状态
:::


## 粗粒度资源申请 和 细粒度资源申请

### 粗粒度资源申请

​在 Application 执行之前，将所有的资源申请完毕，当资源申请成功后，才会进行任务的调度，**当所有的 task 执行完毕后，才会释放这部分资源**

优点：

​	在 Application 执行之前，所以的资源都申请完毕，每一个 **task 直接使用资源**就可以了，**不需要 task 在执行前自己去申请资源**，task 启动就快了，task 执行快了，stage 执行就快了，job 就快了，application 执行就快了

缺点：

​	知道最后一个 task 执行完成后才会释放资源，集群的资源无法充分利用。



### 细粒度资源申请

​Application 执行之前不需要先去申请资源，而是直接执行，让 job 中的**每一个 task 执行前自己去申请资源**，task 执行完成就释放资源了

优点：

​	集群的资源可以充分利用

缺点：

​	task 自己去申请资源，task 启动变慢，Application 的运行就响应的变慢了
