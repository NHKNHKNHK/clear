<!-- # Spark or Hadoop

Hadoop与Spark都是大数据计算框架，他们有各自的优势，主要区别如下区别：

**编程方式**

Hadoop的MapReduce在计算时，计算过程必须要转化为Map和Reduce两个过程，从而难以描述复杂的数据处理过程；而Spark的计算模型不局限于Map和Reduce操作，还提供了多种数据集的操作类型，编程模型比MapReduce更加灵活。

**数据存储**

Hadoop的MapReduce进行计算时，每次产生的中间结果都是存储在本地磁盘中；而Spark在计算时产生的中间结果存储在内存中。

Spark和Hadoop的**根本差异是多个作业之间的数据通信问题** : **Spark**多个作业之间数据通信是**基于内存**，而**Hadoop是基于磁盘**。

**数据处理**

Hadoop在每次执行数据处理时，都需要从磁盘中加载数据，导致磁盘的IO开销比较大（这也是MapReduce的性能瓶颈）；而Spark在执行数据处理时，只需要将数据加载到内存中，之后直接在内存中加载中间结果数据集即可，减少了磁盘的IO开销。

**数据容错**

MapReduce计算的中间结果数据保存在磁盘中，并且Hadoop框架底层实现了备份机制，从而保证数据的容错；同样 **Spark RDD 实现了基于Lineage的容错机制和设置检查点的容错机制**，弥补了数据在内存中处理时断电丢失的问题。



-   Hadoop MapReduce由于其设计初衷并不是为了满足循环迭代式数据流处理，因此在多并行运行的数据可复用场景（如：机器学习、图挖掘算法、交互式数据挖掘算法）中存在诸多计算效率等问题。所以Spark应运而生，Spark就是在传统的MapReduce 计算框架的基础上，利用其计算过程的优化，从而大大加快了数据分析、挖掘的运行和读写速度，**并将计算单元缩小到更适合并行计算和重复使用的RDD计算模型**。	
-   机器学习中ALS、凸优化梯度下降等。这些都需要基于数据集或者数据集的衍生数据反复查询反复操作。MR这种模式不太合适，即使多MR串行处理，性能和时间也是一个问题。数据的共享依赖于磁盘。另外一种是交互式数据挖掘，MR显然不擅长。而Spark所基于的scala语言恰恰擅长函数的处理。
-   Spark是一个分布式数据快速分析项目。它的核心技术是弹性分布式数据集（Resilient Distributed Datasets），提供了比MapReduce丰富的模型，可以快速在内存中对数据集进行多次迭代，来支持复杂的数据挖掘算法和图形计算算法。
-   Spark Task的启动时间快。Spark采用fork线程的方式，而Hadoop采用创建新的进程的方式。
-   Spark只有在shuffle的时候将数据写入磁盘，而Hadoop中多个MR作业之间的数据交互都要依赖于磁盘交互
-   Spark的缓存机制比HDFS的缓存机制高效。

经过上面的比较，我们可以看出在绝大多数的数据计算场景中，Spark确实会比MapReduce更有优势。但是Spark是基于内存的，所以在实际的生产环境中，由于内存的限制，可能会由于内存资源不够导致Job执行失败，此时，MapReduce其实是一个更好的选择，所以Spark并不能完全替代MR。



# Spark核心模块

**Spark Core**

Spark Core中**提供了Spark最基础与最核心的功能**，Spark其他的功能如：Spark SQL，Spark Streaming，GraphX, MLlib都是在Spark Core的基础上进行扩展的

 **Spark SQL**

Spark SQL是Spark用来操作结构化数据的组件。通过Spark SQL，用户可以使用SQL或者Apache Hive版本的SQL方言（HQL）来查询数据。

**Spark Streaming**

Spark Streaming是Spark平台上针对实时数据进行流式计算的组件，提供了丰富的处理数据流的API。

**Spark MLlib**

MLlib是Spark提供的一个机器学习算法库。MLlib不仅提供了模型评估、数据导入等额外的功能，还提供了一些更底层的机器学习原语。

  **Spark GraphX**

GraphX是Spark面向图计算提供的框架与算法库。



# Spark运行架构

## 基本术语

Master（standalone模式）：资源管理的主节点（进程）

Worker（Standalone模式）：资源管理的从节点（进程），或者说是管理本机资源的进程

**Application（应用）：**

​	Spark上运行的应用。Application中包含了一个**驱动器（Dirver）**进程和集群上的**多个执行器（Executor）**进程

**DriverProgram（驱动器）：**

​	运行main()方法并创建SparkContext的进程

**ClusterManager（集群管理器）：**

​	用于**在集群上申请资源的外部服务**（如独立部署的集群管理器standalone、Mesos或Yarn）

**WorkerNode（工作节点）：**

​	集群上运行应用程序代码的任意节点/

**Executor（执行器）：**

​	是在一个 worker 进程所管理的节点上为某 Application 启动的一个一个进程，这个进程负责运行任务，并且负责将数据存在内存或者磁盘上，每个应用之间都有各自独立的executors

**Task（任务）：**

​	执行器的工作单元（被发送到executors 上的工作单元）

**Job（作业）：**

​	一个并行计算作业，**由一组任务（Task）组成**，并**由Spark的行动**（Action）**算子触发**（如save、collect等）**启动**

**Stage（阶段）**：

​	**一个 job 会被拆分为 很多组任务(task)，每组任务被称为 Stage**（就像MapReduce 分为 MapTask 和 ReduceTask 一样）



## 运行架构

Spark框架的核心是一个计算引擎，整体来说，它采用了**标准 master-slave** 的结构。



## 核心组件

对于Spark框架有两个核心组件：

### Driver

Spark驱动器节点，用于**执行Spark任务中的main方法，负责实际代码的执行工作**。Driver在Spark作业执行时主要负责：

-   将**用户程序转化为作业（job）**
-   **在Executor之间调度任务(task)**
-   跟踪Executor的执行情况
-   通过UI展示查询运行情况

实际上，我们无法准确地描述Driver的定义，因为在整个的编程过程中没有看到任何有关Driver的字眼。所以简单理解，所谓的Driver就是驱使整个应用运行起来的程序，也称之为Driver类。

### Executor

​	Spark **Executor是集群中工作节点（Worker）**中的一个JVM进程，**负责**在 Spark 作业中**运行具体任务**（Task），任务彼此之间相互独立。Spark 应用启动时，Executor节点被同时启动，并且始终伴随着整个 Spark 应用的生命周期而存在。如果有Executor节点发生了故障或崩溃，Spark 应用也可以继续执行，会将出错节点上的任务调度到其他Executor节点上继续运行。

Executor有两个核心功能：

-   负责运行组成Spark应用的任务，并将结果返回给驱动器进程
-   它们通过自身的块管理器（Block Manager）为用户程序中要求缓存的 RDD 提供内存式存储。RDD 是直接缓存在Executor进程内的，因此任务可以在运行时充分利用缓存数据加速运算。

### Master & Worker

​	Spark集群的**独立部署环境（Standalone）中，不需要依赖其他的资源调度框架，自身就实现了资源调度的功能**，所以环境中还有其他两个核心组件：**Master和Worker**，这里的**Master**是一个进程，主要负责**资源的调度和分配**，并进行集群的监控等职责，**类似于Yarn环境中的RM**, 而**Worker**呢，也是进程，一个Worker运行在集群中的一台服务器上，由Master分配资源对数据进行并行的处理和计算，**类似于Yarn环境中NM**。

简单来说，Master类似于 yarn的 RM，Driver类似于 yarn的 AM，Slaves类似于 yarn的 NM

### ApplicationMaster

Hadoop用户向YARN集群提交应用程序时,提交程序中应该包含ApplicationMaster，用于向资源调度器申请执行任务的资源容器Container，运行用户自己的程序任务job，监控整个任务的执行，跟踪整个任务的状态，处理任务失败等异常情况。

说的简单点就是，**ResourceManager（资源）和Driver（计算）之间的解耦合靠的就是ApplicationMaster**。



## 核心概念

### Executor与Core（核）

Spark Executor是集群中运行在工作节点（Worker）中的一个JVM进程，是**整个集群中的专门用于计算的节点**。在提交应用中，可以提供参数指定计算节点的个数，以及对应的资源。这里的资源一般指的是工作节点Executor的内存大小和使用的虚拟CPU核（Core）数量。

应用程序相关启动参数如下：

| 名称              | 说明                               |
| ----------------- | ---------------------------------- |
| --num-executors   | 配置Executor的数量                 |
| --executor-memory | 配置每个Executor的内存大小         |
| --executor-cores  | 配置每个Executor的虚拟CPU core数量 |

### 并行度（Parallelism）

在分布式计算框架中一般都是多个任务同时执行，由于任务分布在不同的计算节点进行计算，所以能够真正地实现多任务并行执行，记住，这里是并行，而不是并发。这里我们将**整个集群并行执行任务的数量称之为并行度**。那么一个作业到底并行度是多少呢？这个取决于框架的默认配置。应用程序也可以在运行过程中动态修改。



### 有向无环图（DAG）

大数据计算引擎框架我们根据使用方式的不同一般会分为四类，其中第一类就是Hadoop所承载的MapReduce,它将计算分为两个阶段，分别为 Map阶段 和 Reduce阶段。对于上层应用来说，就不得不想方设法去拆分算法，甚至于不得不在上层应用实现多个 Job 的串联，以完成一个完整的算法，例如迭代计算。 由于这样的弊端，催生了支持 DAG 框架的产生。因此，支持 DAG 的框架被划分为第二代计算引擎。如 Tez 以及更上层的 Oozie。这里我们不去细究各种 DAG 实现之间的区别，不过对于当时的 Tez 和 Oozie 来说，大多还是批处理的任务。接下来就是以 **Spark 为代表的第三代的计算引擎。第三代计算引擎的特点主要是 Job 内部的 DAG 支持（不跨越 Job），以及实时计算。**

这里所谓的有向无环图，并不是真正意义的图形，而是**由Spark程序直接映射成的数据流的高级抽象模型**。简单理解就是将整个程序计算的执行过程用图形表示出来,这样更直观，更便于理解，可以用于表示程序的拓扑结构。

DAG（Directed Acyclic Graph）有向无环图是由点和线组成的拓扑图形，该图形具有方向，不会闭环。



## 提交流程

​	所谓的提交流程，其实就是我们开发人员根据需求写的**应用程序通过Spark客户端提交给Spark运行环境执行计算的流程。**在不同的部署环境中，这个提交过程基本相同，但是又有细微的区别，我们这里不进行详细的比较，但是因为国内工作中，将Spark引用部署到Yarn环境中会更多一些，所以我们主要学习基于yarn的提交流程。

Spark应用程序提交到Yarn环境中执行的时候，一般会有两种部署执行的方式：

​	Client 和 Cluster

**两种模式主要区别在于：Driver程序的运行节点位置。**



###  Yarn Client模式

Client模式将用于监控和调度的Driver模块在客户端执行，而不是在Yarn中，所以一般用于测试。

1）**Driver在任务提交的本地机器上运行**

2）Driver启动后会和ResourceManager通讯**申请启动ApplicationMaster**

3） ResourceManager分配container，在合适的NodeManager上启动ApplicationMaster，负责向ResourceManager申请Executor内存

3）ResourceManager接到ApplicationMaster的资源申请后会分配container，然后ApplicationMaster在资源分配指定的NodeManager上启动Executor进程

4）Executor进程启动后会向Driver反向注册，Executor全部注册完成后Driver开始执行main函数

5）之后执行到Action算子时，触发一个Job，并根据宽依赖开始划分stage，每个stage生成对应的TaskSet，之后将task分发到各个Executor上执行。



### Yarn Cluster模式

Cluster模式将用于监控和调度的**Driver模块启动在Yarn集群资源中执行**。一般应用于实际生产环境。

1）在YARN Cluster模式下，任务提交后会和ResourceManager通讯申请启动ApplicationMaster，

2）随后ResourceManager分配container，在合适的NodeManager上启动ApplicationMaster，此时的ApplicationMaster就是Driver。

3）Driver启动后向ResourceManager申请Executor内存，ResourceManager接到ApplicationMaster的资源申请后会分配container，然后在合适的NodeManager上启动Executor进程

4）Executor进程启动后会向Driver反向注册，Executor全部注册完成后Driver开始执行main函数，

5）之后执行到Action算子时，触发一个Job，并根据宽依赖开始划分stage，每个stage生成对应的TaskSet，之后将task分发到各个Executor上执行。



# spark资源调度和任务调度

spark资源调度和任务调度的流程

-   启动集群后，**Worker** 节点会向 **Master** 节点汇报资源情况，**Master 掌握了集群资源情况**。

-   当 **Spark 提交一个 Application** 后，**根据 RDD 之间的依赖关系**将 Application 形成一个 **DAG**有向无环图。

-   任务提交后，Spark 会在 **Driver 端创建两个对象 DAGScheduler 和 TaskScheduler**，DAGScheduler 是任务调度的**高层**调度器，是一个对象

-   **DAGScheduler** 的主要作用就是将 DAG 根据 RDD 之间的**宽窄依赖关系划分一个个的Stage**，然后将这些 **Stage 以 TaskSet 的形式提交给 TaskScheduler**（**TaskScheduler** 是任务调度的**低层**调度器，这里 TaskSet 其实就是一个集合，里面封装的就是一个个 task 任务，也就是 stage 中并行的 task 任务）

-   **TaskScheduler 会遍历 TaskSet**集合，拿到每个 task 后会**将 task 发送到 Executor** 中去执行（其实就是发送到 Executor 中的线程池 ThreadPool 去执行）

-   task 在 Executor 线程池中的运行情况会向 TaskScheduler 反馈，当 **task 执行失败**时，则由 **TaskScheduler 负责重试**，将 task 重新发送给 Executor 去执行，默认重试三次。如果**重试3次依然失败**。那么这个 task 所在的 **stage  就失败**了。

-   **stage** 失败了则由 **DAGScheduler 来负责重试**，重新发送 TaskSet 到 TaskScheduler，stage模式重试4次。如果重试4次以后**依然失败**，那么这个 **job 就失败**了。job 失败了，**Application就失败了**。

-   TaskScheduler 不仅重试失败的 task，还会重试 straggling（落后，缓慢）task（也就是执行速度比其他 task 慢太多的task）。如果有运行缓慢的task 那么 TaskScheduler 会启动一个新的 task 来与这个运行缓慢的 task 执行相同的处理逻辑。两个task 哪个先执行完，就以哪个 task 的执行结果为准。这就是 Spark 的**推测执行机制**。在 Saprk 中**推测执行默认是关闭的**。推测执行可以通过 **spark.speculation** 属性来配置

注意：

​	对于 **ETL** 类型要**入数据库**的业务要**关闭推测执行机制**，这样就不会有重复的数据入库

​	如果遇到数据倾斜的情况，开启推测执行则有可能导致一直会有 task 重新启动处理相同的逻辑，任务可能一直处理不完的状态



# 粗粒度资源申请 和 细粒度资源申请

## 粗粒度资源申请

​	在 Application 执行之前，将所有的资源申请完毕，当资源申请成功后，才会进行任务的调度，**当所有的 task 执行完毕后，才会释放这部分资源**

优点：

​	在 Application 执行之前，所以的资源都申请完毕，每一个 **task 直接使用资源**就可以了，**不需要 task 在执行前自己去申请资源**，task 启动就快了，task 执行快了，stage 执行就快了，job 就快了，application 执行就快了

缺点：

​	知道最后一个 task 执行完成后才会释放资源，集群的资源无法充分利用。



## 细粒度资源申请

​	Application 执行之前不需要先去申请资源，而是直接执行，让 job 中的**每一个 task 执行前自己去申请资源**，task 执行完成就释放资源了

优点：

​	集群的资源可以充分利用

缺点：

​	task 自己去申请资源，task 启动变慢，Application 的运行就响应的变慢了



# Spark核心编程

## Spark 代码流程

**1.创建 SparkConf 对象**（Spark程序必须做的第一件事是创建一个JavaSparkContext对象，它告诉Spark如何访问集群。要创建SparkContext，首先需要构建一个包含应用程序信息的SparkConf对象。）

-   **设置SparkConf参数**，如appName、master等 （**appName参数是应用程序在集群UI上显示的名称**。master是一个Spark、Mesos或YARN集群的URL，或者一个在本地模式下运行的特殊的“local”字符串。在实践中，当在集群上运行时，您不希望在程序中硬编码master，而是希望使用spark-submit启动应用程序并在那里接收它。然而，对于本地测试和单元测试，您可以通过“local”来运行进程中的Spark。）

**2.基于SparkConf 创建 SparkContext 对象**

**3.基于 SparkContext 即上下文环境对象创建RDD，对RDD进行处理**

**4.应用程序必须要有 Action类算子触发 Transformation类算子进行**

**5.关闭 SparkContext**



​	Spark计算框架为了能够进行高并发和高吞吐的数据处理，封装了三大数据结构，用于处理不同的应用场景。三大数据结构分别是：

-   RDD : 弹性分布式数据集
-   累加器：分布式共享**只写**变量
-   广播变量：分布式共享**只读**变量

## RDD

RDD（Resilient Distributed Dataset）即**弹性分布式数据集**，是一个容错的、并行的数据结构，是Spark中最基本的**数据处理模型**。代码中是一个抽象类，它代表一个弹性的、不可变、可分区、里面的元素可并行计算的集合。

-   弹性
    -   存储的弹性：内存与磁盘的自动切换；
    -   容错的弹性：数据丢失可以自动恢复；
    -   计算的弹性：计算出错重试机制；
    -    分片的弹性：可根据需要重新分片。
    
-   分布式：数据存储在大数据集群不同节点上

-   数据集：RDD**封装了计算逻辑，并不保存数据**

-   数据抽象：RDD是一个抽象类，需要子类具体实现

-   不可变：**RDD封装了计算逻辑，是不可以改变的，想要改变，只能产生新的RDD**，在新的RDD里面封装计算逻辑

-   可分区、并行计算

    

RDD的数据处理方式类似于IO流，也有装饰者设计模式

RDD的数据只有在调用行动算子（例如，collect()）时，才会真正执行业务逻辑操作。

RDD是不保存数据的，但是IO可以临时保存一部分数据



### RDD五大特征

#### 1 分区列表

​	分区列表（a list of partitions），每个RDD被分为多个分区（partitions），这些分区运行在集群中的不同节点，每个分区都会被一个计算任务处理，**分区数决定了并行数的数量**，创建RDD时可以指定RRD分区的个数。如果不指定分区数量，当RDD从集合创建时，默认分区数量为该程序所分配到的资源的CPU核数（每个Core可以承载2~4个Partition），如果是从HDFS文件创建，默认为文件的Block数。



#### 2 每个分区都有一个计算函数

​	每个分区都有一个计算函数（a function for computing each split），Spark的**RDD的计算函数是以分片为基本单位**的，每个RDD都会实现compute函数，对具体的分片进行计算。

简单来说，Spark在计算时，是使用分区函数对每一个分区进行计算



#### 3 依赖于其他RDD

​	依赖于其他RDD（a list of dependencies on other RDDs），**RDD是计算模型的封装**，当需求中需要将多个计算模型进行组合时，就需要将多个RDD建立依赖关系。**RDD的每次转换都会生成新的RDD**，所以**RDD之间会形成**类似于流水线一样的**前后依赖关系**。**在部分分区数据丢失时，Spark可通过这个依赖关系重新计算丢失的分区数据**，而不是对RDD的所以分区进行重新计算。



#### 4 (Key,Value)数据类型的RDD分区器

​	 (Key,Value)数据类型的RDD分区器（a Partitioner for Key-Value RDDs），当前Spark中实现了两种类型的分区函数，**一个是基于哈希的 HashPartitioner，另外一个是基于范围的 RangePartitioner**。只有对于（Key,Value）的RDD，才会有Partitioner（分区），非于（Key,Value）的RDD的Partitioner 的值是None。**Partitioner函数不但决定了RDD本身的分区数量，也决定了parent RDD Shuffle 输出时的分区数量。**

注意：只要K-V类型的数据才存在分区器的概念



#### 5 每个分区都有一个优先位置列表

​	每个分区都有一个优先位置列表（a list of perferred locations to compute each split on），优先位置列表会存储每个Partition的优先位置，对于一个HDFS文件来说，就是每个Partition块的位置。按照 **“移动数据不如移动计算” 的理念，Spark在进行任务调度时，会尽可能地将计算任务分配到其所要处理数据块的存储位置。**

简单来说，就是判断计算发送到哪个节点，效率最优，数据移动不如移动计算



### 执行原理

​	从计算的角度来讲，数据处理过程中需要**计算资源**（内存 & CPU）和**计算模型**（逻辑）。执行时，需要将计算资源和计算模型进行协调和整合。

Spark框架在执行时，先申请资源，然后将应用程序的数据处理逻辑分解成一个一个的计算任务。然后将任务发到已经分配资源的计算节点上, 按照指定的计算模型进行数据计算。最后得到计算结果。

RDD是Spark框架中用于数据处理的核心模型，下面是在Yarn环境中，RDD的工作原理:

​	1)启动Yarn集群环境

​	2)Spark通过申请资源创建调度节点和计算节点

​	3)Spark框架根据需求将计算逻辑根据分区划分成不同的任务

​	4)调度节点将任务根据计算节点状态发送到对应的计算节点进行计算

从以上流程可以看出**RDD**在整个流程中**主要用于将逻辑进行封装，并生成Task发送给Executor节点执行计算**



### RDD的创建方式

在Spark中创建RDD的创建方式可以分为四种：

#### 1）从集合（内存）中创建RDD

Spark可以通过并行集合创建RDD。即从一个已存在的集合、数组上，**通过 SparkContext 对象调用 parallelize() 方法创建RDD**

```java
parallelize(final List<T> list)
parallelize(final List<T> list, final int numSlices) 
// numSlices表示设置的分区数量
//如果不设置，默认使用scheduler.conf().getInt("spark.default.parallelism", this.totalCores())
//		spark默认从配置对象获取spark.default.parallelism 
// 		如果获取不到，则使用 totalCores 属性，该属性为当前环境最大的可以核数
```

演示：

```java
SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("rdd");
// 构建上下文环境变量
JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
// 创建RDD (从内存中创建，将内存中集合数据作为处理的数据源)
List<Integer> lists = Arrays.asList(1, 2, 3, 4, 5, 6);
JavaRDD<Integer> RDD = sparkContext.parallelize(lists);
/*RDD.foreach(new VoidFunction<Integer>() {
	@Override
    public void call(Integer integer) throws Exception {
    	System.out.println(integer);
    }
});*/
RDD.foreach((integer) -> System.out.println(integer));
// 关闭环境
sparkContext.stop();
```



#### 2）从外部存储（文件）创建RDD

Spark可以从Hadoop支持的任何存储源中加载数据去创建RDD，包括本地文件系统和HDFS（所有Hadoop支持的数据集，比如HDFS、HBase等）等文件系统

通过Spark中的**SparkContext对象调用textFile()方法加载数据创建RDD**。

注意：

-   JavaSparkContext对象能够直接读取的文件类型有 txt 、sequence、object
    -   文本文件（Text File）：可以使用`JavaSparkContext.textFile()`方法读取文本文件，每一行作为一个RDD的元素。
    -   序列化文件（Sequence File）：可以使用`JavaSparkContext.sequenceFile()`方法读取序列化文件，序列化文件是Hadoop中的一种文件格式，可以将多个小文件合并成一个大文件，提高文件读取效率。
    -   对象文件（Object File）：可以使用`JavaSparkContext.objectFile()`方法读取对象文件，对象文件是将Java对象序列化后存储的文件。

-   其他文件类型，如csv、json、parquet、avro等都需要使用**SparkSession**对象来读取，或者是利用第三方库读取

```java
textFile(final String path)  // 以行为单位来读取数据，读取的数据都是字符串
textFile(final String path, final int minPartitions)  // minPartitions设置最小分区数量
    												// 注意：分区数量可能大于 minPartitions
// spark读取文件时，底层其实使用的就是Hadoop的读取方式，所以是一行一行读取
// 数据读取是以偏移量为单位，偏移量不会被重复读取
    // totalSize
    // goalSize = totalSize/minPartitions

// 如果数据源为多个文件，那么计算分区时以文件为单位进行分区
    
wholeTextFiles(final String path)  // 以文件为单位读取数据，读取的结果是一个元组
				 				 // 第一个元素表示文件路径，第二个元素表示文件内容
wholeTextFiles(final String path, final int minPartitions)
```

**1.从Linux本地文件系统加载数据创建RDD**

```java
// 假设在linux本地有文件 test.txt

SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("rdd");
// 构建上下文环境变量
JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
// 创建RDD (从Linux本地文件中创建，将文件中数据作为处理的数据源)
// path路径默认以当前环境的根路径为基准。可以写绝对路径，也可以写相对路径
// path路径可以是文件的具体路径，也可以是目录名称（当有多个文件时）
// path路径还可以写通配符 * （例如：file:///opt/temp/test*.txt）
JavaRDD<String> RDD = sparkContext.textFile("file:///opt/temp/test.txt");  
// file:// 表示从本地(linux)文件系统读取
// 从文件 test.txt 读取出来的每一行文本内容，都是RDD中的一个元素

/*  RDD.collect().forEach(new Consumer<String>() {
            @Override
            public void accept(String s) {
                System.out.println(s);
            }
});*/
// RDD.collect().forEach(s-> System.out.println(s));
RDD.collect().forEach(System.out::println);  // 方法引用

// 关闭环境
sparkContext.stop();
```

**2.从HDFS中加载数据创建RDD**

代码与从从Linux本地文件系统加载数据创建RDD相识，只需做出如下修改

```java
JavaRDD<String> RDD = sparkContext.textFile("/opt/temp/test.txt"); 
JavaRDD<String> RDD = sparkContext.textFile("hdfs://localhost:8020/opt/temp/test.txt"); 
// 上面两种写法都是可以的
```



#### 3）从其他RDD创建RDD

主要是通过一个RDD运算完后，再产生新的RDD。



#### 4）直接创建RDD（new）

使用new的方式直接构造RDD，一般由Spark框架自身使用。

例如：

```scala
def wholeTextFiles(path: String): JavaPairRDD[String, String] =
	new JavaPairRDD(sc.wholeTextFiles(path))
```



### RDD并行度与分区

默认情况下，Spark可以将一个作业切分多个任务后，发送给Executor节点并行计算，而**能够并行计算的任务数量**我们称之为**并行度**。这个数量可以在构建RDD时指定。记住，**这里的并行执行的任务数量，并不是指的切分任务的数量**，不要混淆了。

-   读取内存数据时，数据可以按照并行度的设定进行数据的分区操作

-   读取文件数据时，数据是按照Hadoop文件读取的规则进行切片分区，而切片规则和数据读取的规则有些差异

在分布式程序中，网络通信开销很大，**Spark程序可以通过控制RDD分区方式来减少通信开销。**Spark中所有的RDD都可以进行分区，系统会根据一个针对键的函数对元素进行分区。虽然**Saprk不能控制每个键具体划分到哪个节点上，但是可以确保相同的键出现在同一个分区上。**

RDD的分区原则：

​	**分区的个数尽量等于集群中CPU核心（core）的数目******。对于不同的Spark部署模式而言，可通过设置 spark.default.parallelism 这个参数来配置默认的分区数目。各种模式下默认分区数目如下：

-   Local模式：默认为本地机器的cpu数目，若设置了local[n]，则默认为n
-   Standalone或Yarn模式：在 集群中所有cpu核数总和 与 2 这两者之间取较大者为默认值
-   Mesos模式：默认分区数为8

**Spark为RDD提供的两种分区方式：**

-   ​	哈希分区（HashPartitioner）：是根据哈希值来分区
-   ​	范围分区（RangePartitioner）：将一定范围的数据映射到一个分区中

此外，**Spark还支持自定义分区方式：**

-   即通过自定义的Partitioner对象来控制RDD的分区

    -   让自定义的类继承自org.apache.spark.Partitioner

    -   并实现其中抽象方法

    -   ```java
        public abstract int numPartitions()  // 用于返回创建的分区个数
            
        // 用于对输入的key做处理，并返回给key对应的分区ID
        // 分区ID范围 0 ~ numPartitions-1
        public abstract int getPartition(final Object key)  
        ```



### 什么是算子

-   算子：Operator（操作）算子的本质就是函数
-   RDD的方法和Scala集合对象的方法不一样
-   集合对象的方法都是在同一个节点的内存中完成的
-   RDD的方法可以将计算逻辑发送到 Executor 端（分布式节点）执行
-   为了区分不同的处理效果，所以将RDD的方法称之为算子
-   **RDD的方法外部的操作都是在Driver端执行**的，而**方法内部的逻辑代码是在Executor端执行**

算子主要有如下两种：

​	Transformation 转换算子： 对RDD进行相互转换，返回一个新的RDD，**懒加载**

​	Action 行动算子 ：**启动job**（runJob）



### 转换算子 Transformation

RDD处理过程中的 转换 操作主要是**根据已有的RDD创建新的RDD**，**每一次**通过Transformation算子计算后都会**返回一个一个新的RDD**，供给下一个转换算子使用。

简单来说，**转换就是功能的补充和封装，将旧的RDD包装成新的RDD**

RDD根据数据处理方式的不同将算子整体上分为Value类型、双Value类型和Key-Value类型

下面是一些常用的转换算子的API

#### Value型

##### 1）map（窄）

**方法签名**

```java
public <R> JavaRDD<R> map(final Function<T, R> f)
```

**方法说明**

-   将处理的数据**逐条**进行映射转换，这里的转换可以是类型的转换，也可以是值的转换。
-   数据集中的每个元素经过用户自定义的函数转换形成一个新的RDD，新的RDD叫MappedRDD
-   将函数应用于RDD中的每个元素，将返回值构成新的RDD

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("map").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        // 从集合中提取数据创建RDD
        JavaRDD<Integer> rdd = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4, 5, 6));

       /* JavaRDD<Integer> mapRDD = rdd.map(new Function<Integer, Integer>() {
            @Override
            public Integer call(Integer x) throws Exception {
                return x * x;
            }
        });
        List<Integer> collectRDD = mapRDD.collect();
        // System.out.println(collectRDD);
        collectRDD.forEach(System.out::println);  // 方法引用*/

        List<Integer> result = rdd.map(x -> x * x).collect();
        result.forEach(System.out::println);

}
```

**总结**

-   rdd的计算一个分区内的数据是一个一个执行逻辑
-   前面一个的数据全部是逻辑执行完毕后，才会执行下一个数据
-   分区内的数据的执行是有序的
-   不同分区数据计算是无序的



##### 2）mapPartitions

**方法签名**

```java
public <U> JavaRDD<U> mapPartitions(final FlatMapFunction<Iterator<T>, U> f)
 					// 可以以分区为单位进行数据转换操作
    				// 但是会将整个分区的数据加载到内存中进行引用
    				// 如果处理完的数据是不会被释放掉的，存在对象的引用
    				// 在内存较小，数据量较大的场合下，容易出现内存溢出
public <U> JavaRDD<U> mapPartitions(final FlatMapFunction<Iterator<T>, U> f, final boolean preservesPartitioning)
    
// 第一个函数是基于第二个函数实现的，使用的是preservesPartitioning为false。而第二个函数我们可以指定preservesPartitioning，preservesPartitioning表示是否保留父RDD的partitioner分区信息；FlatMapFunction中的Iterator是这个rdd的一个分区的所有element组成的Iterator。

```

**方法说明**

-   将待处理的数据**以分区为单位**发送到计算节点（将整个分区数据加载到内存中）进行处理，这里的处理是指可以进行任意的处理，哪怕是过滤数据。
-   mapPartitions函数**会对每个分区依次调用分区函数处理**，然后将处理的结果(若干个Iterator)生成新的RDDs。
    mapPartitions与map类似，但是**如果在映射的过程中需要频繁创建额外的对象，使用mapPartitions要比map高效的过**。比如，将RDD中的所有数据通过JDBC连接写入数据库，如果使用map函数，可能要为每一个元素都创建一个connection，这样开销很大，如果使用mapPartitions，那么只需要针对每一个分区建立一个connection。
-   这个算子效率显然是比map高，但是可能会存在OOM（因为该算子会将整个分区数据加载到内存中）
-   两者的主要区别是**调用的粒度**不一样：map的输入变换函数是应用于RDD中每个元素，而**mapPartitions的输入函数是应用于每个分区。**


 假设一个rdd有10个元素，分成3个分区。如果使用map方法，map中的输入函数会被调用10次；而使用mapPartitions方法的话，其输入函数会只会被调用3次，每个分区调用1次。

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("获取每个分区的最大数").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4, 5, 6, 7),2);

        JavaRDD<Integer> mapPartitionsRDD = RDD.mapPartitions(new FlatMapFunction<Iterator<Integer>, Integer>() {
            @Override
            public Iterator<Integer> call(Iterator<Integer> integerIterator) throws Exception {
                ArrayList<Integer> list = new ArrayList<>();
                while (integerIterator.hasNext()){
                    list.add(integerIterator.next());
                }
                return Arrays.asList(Collections.max(list)).iterator();
            }
        });
        mapPartitionsRDD.collect().forEach(System.out::println);
}
```

结果如下

```
3
7
```

下面是模拟数据库连接的伪代码

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("mapPartitions").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        sparkContext.setLogLevel("ERROR");
        JavaRDD<Integer> rdd = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4), 3);

        System.out.println("下面是演示mapPartitions算子~~~~~");
        rdd.mapPartitions(new FlatMapFunction<Iterator<Integer>, Integer>() {
            @Override
            public Iterator<Integer> call(Iterator<Integer> iterator) throws Exception {
                System.out.println("创建数据库连接");
                while (iterator.hasNext()) {
                    Integer next = iterator.next();
                    System.out.println("查询到数据库中数据" + next);
                }
                System.out.println("关闭数据库连接");
                return iterator;
            }
        }).count();
        System.out.println("下面是演示map算子~~~~~");
        rdd.map(new Function<Integer, Integer>() {
            @Override
            public Integer call(Integer v1) throws Exception {
                System.out.println("创建数据库连接");
                System.out.println("查询到数据库中数据" + v1);
                System.out.println("关闭数据库连接");
                return v1;
            }
        }).count();
    }
```

结果如下

```diff
下面是演示mapPartitions算子~~~~~
创建数据库连接
查询到数据库中数据1
关闭数据库连接
创建数据库连接
查询到数据库中数据2
关闭数据库连接
创建数据库连接
查询到数据库中数据3      	# 这里连续打印了两次
查询到数据库中数据4
关闭数据库连接
下面是演示map算子~~~~~
创建数据库连接
查询到数据库中数据1
关闭数据库连接
创建数据库连接
查询到数据库中数据2
关闭数据库连接
创建数据库连接
查询到数据库中数据3
关闭数据库连接
创建数据库连接
查询到数据库中数据4
关闭数据库连接
```



##### **map和mapPartitions的区别？**

**数据处理角度**

map算子是**分区内**一个数据一个数据的执行，类似于串行操作。而mapPartitions算子是**以分区**为单位进行**批处理**操作。

**功能的角度**

map算子主要目的将数据源中的数据进行转换和改变。但是不会减少或增多数据。**mapPartitions算子**需要传递一个迭代器，**返回一个迭代器**，没有要求的元素的个数保持不变，所以可以增加或减少数据

**性能的角度**

map算子因为类似于串行操作，所以性能比较低，而是**mapPartitions算子类似于批处理，所以性能较高。但是mapPartitions算子会长时间占用内存，那么这样会导致内存可能不够用，出现内存溢出的错误（OOM）**。所以在内存有限的情况下，不推荐使用。而是使用map操作。

**完成比完美更重要**



##### 3）mapPartitionsWithIndex

**方法签名**

```java
public <R> JavaRDD<R> mapPartitionsWithIndex(final Function2<Integer, Iterator<T>, Iterator<R>> f, final boolean preservesPartitioning)
```

**方法说明**

-   将待处理的数据**以分区为单位发送到计算节点进行处理**，这里的处理是指可以进行任意的处理，哪怕是过滤数据，在处理时同时**可以获取当前分区索引**。
-   mapPartitionsWithIndex与mapPartitions基本相同，只是在处理函数的参数是一个二元元组，**元组的第一个元素是当前处理的分区的index**（简单说就是分区号），元组的第二个元素是当前处理的分区元素组成的Iterator
-   mapPartitions已经获得了当前处理的分区的index，只是没有传入分区处理函数，而mapPartitionsWithIndex将其传入分区处理函数。

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("获取每个分区的最大数").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        sparkContext.setLogLevel("WARN");

        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4), 3);
        /**
         * 该算子主要优点是携带了分区的索引值
         */
        JavaRDD<Integer> mapPartitionsWithIndexRDD = RDD.mapPartitionsWithIndex(new Function2<Integer, Iterator<Integer>, Iterator<Integer>>() {
            @Override
            public Iterator<Integer> call(Integer index, Iterator<Integer> iterator) throws Exception {
                List<Integer> list = new ArrayList<>();
                while (iterator.hasNext()) {
                    Integer i = iterator.next();
                    list.add(i + 1);
                    System.out.println("partition id is " + index + ",value is " + i);
                }
                return list.iterator();
            }
        }, true);
        mapPartitionsWithIndexRDD.collect();

        sparkContext.stop();
    }
```

结果

```diff
	partition id is 0,value is 1
partition id is 1,value is 2
partition id is 2,value is 3
partition id is 2,value is 4
```



##### 4）mapToPair（窄）

**方法签名**

```java
public <K2, V2> JavaPairRDD<K2, V2> mapToPair(final PairFunction<T, K2, V2> f)
```

**方法说明**

-   将数据转为K-V类型，例如，wordcount案例中将word 转换为 (word,1)、也可以交换K-V的位置
-   需要注意的是，**mapToPair是Java中特有的RDD**，scala没有mapToPair，使用map就能完成

```java
public static void main(String[] args) {
        // 获取配置对象
        SparkConf sparkConf = new SparkConf().setMaster("local").setAppName("mapToPair");
        // 获取 SparkContext上下文对象
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        JavaRDD<String> RDD = jsc.parallelize(Arrays.asList("hello", "world", "spark"));
        JavaPairRDD<String, Integer> pairRDD = RDD.mapToPair(new PairFunction<String, String, Integer>() {
            @Override
            public Tuple2<String, Integer> call(String word) throws Exception {
                return new Tuple2<>(word, 1);
            }
        });
        List<Tuple2<String, Integer>> collect = pairRDD.collect();
        System.out.println(collect);  // [(hello,1), (world,1), (spark,1)]
    }
```



##### 5）flatMapToPair（窄）

**方法签名**

```java
public <K2, V2> JavaPairRDD<K2, V2> flatMapToPair(final PairFlatMapFunction<T, K2, V2> f)
```

**方法说明**

-   mapToPair是一对一，一个元素返回一个元素，而flatMapToPair可以一个元素返回多个，**相当于先flatMap,在mapToPair**
-   例如，在wordcount案例中，我们需要先flatMap，在mapToPair得到(word, 1)，使用flatMapToPair相当于在flatMap的基础上直接得到 (word, 1)
-   在spark 2.0版本以上，faltaMapToPair也做了一些改动，主要是主要是**iterator和iteratable**的一些区别

```java
public static void main(String[] args) {
        // 获取配置对象
        SparkConf sparkConf = new SparkConf().setMaster("local").setAppName("flatMapToPair");
        // 获取 SparkContext上下文对象
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        JavaRDD<String> RDD = jsc.parallelize(Arrays.asList("hello world", "hello hadoop", "spark core"));
        JavaPairRDD<String, Integer> pairRDD = RDD.flatMapToPair(new PairFlatMapFunction<String, String, Integer>() {
            
            @Override
            public Iterator<Tuple2<String, Integer>> call(String word) throws Exception {
                // 注意：集合容器需要放在重写方法内部，否则会出现一些错误
                // 如，我第一次写带代码时，将集合容器放在重写方法外面，出现了统计的单词数变多了，简直是无中生有，错误如下
                // [(hello,1), (world,1), (hello,1), (world,1), (hello,1), (hadoop,1), (hello,1), (world,1), (hello,1), (hadoop,1), (spark,1), (core,1)]
                // 虽然程序为报错，但是可以看到外面只有六个单词，但是结果有12个，显然是错误的
                List<Tuple2<String, Integer>> list = new ArrayList<>();
                String[] split = word.split(" ");

                for (String w : split) {
                    Tuple2<String, Integer> tuple2 = new Tuple2<>(w, 1);
                    list.add(tuple2);
                }
                return list.iterator();
            }
        });

        List<Tuple2<String, Integer>> collect = pairRDD.collect();
        System.out.println(collect);  // [(hello,1), (world,1), (hello,1), (hadoop,1), (spark,1), (core,1)]
    }
```



##### 6）flatMap（窄）

**方法签名**

```java
public <U> JavaRDD<U> flatMap(final FlatMapFunction<T, U> f)

```

**方法说明**

-   将处理的数据进行扁平化后再进行映射处理，所以算子也称之为**扁平映射**（将整体拆分成个体的操作）

-   **将方法应用于RDD中的每个元素**，将返回的迭代器的所有内容构成新的RDD，通常用来切分单词。与map的区别是：这个函数返回的值是list的一个，去除原有的格式

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("flatmap");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<String> RDD = sparkContext.parallelize(Arrays.asList("hello spark", "hello hadoop"));
        JavaRDD<String> flatMapRDD = RDD.flatMap(new FlatMapFunction<String, String>() {
            @Override
            public Iterator<String> call(String s) throws Exception {
                String[] s1 = s.split(" ");
                return Arrays.asList(s1).iterator();
            }
        });
        
        flatMapRDD.collect().forEach(s -> System.out.println(s));
    	//flatMapRDD.collect().forEach(System.out::println); // 方法引用
    }
```

结果

```
hello
spark
hello
hadoop
```



##### 7）glom

**方法签名**

```java
public JavaRDD<List<T>> glom() 
```

**方法说明**

-   **将同一个分区的数据直接转换为相同类型的内存数组**进行处理，分区不变

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("glom").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaDoubleRDD RDD = sparkContext.parallelizeDoubles(Arrays.asList(1.0, 2.5, 3.5));
        JavaRDD<List<Double>> glomRDD = RDD.glom();
        glomRDD.foreach(data-> System.out.println(data+","));
       
    }
```

结果

```
[1.0],
[],
[2.5],
[3.5],
```



##### 8）groupBy（宽）

**方法签名**

```java
public <U> JavaPairRDD<U, Iterable<T>> groupBy(final Function<T, U> f)
    
public <U> JavaPairRDD<U, Iterable<T>> groupBy(final Function<T, U> f, final int numPartitions)  
```

**方法说明**

-   将数据根据指定的规则进行分组, 分区默认不变，但是数据会被**打乱重新组合**，我们将这样的操作称之为**shuffle**。极限情况下，数据可能被分在同一个分区中
-   **一个组的数据在一个分区中，但是并不是说一个分区中只有一个组**
-   分组和分区没有必然的关系

```java
 public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("groupBy").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<String> RDD = sparkContext.parallelize(Arrays.asList("hello","hadoop","spark","scala","zookeeper"), 2);
        // groupBy会将数据源中的每一个数据进行分组判断，根据返回的分组key进行分组
        // 相同的Key值的数据会放在同一组
        JavaPairRDD<Character, Iterable<String>> groupByRDD = RDD.groupBy(new Function<String, Character>() {
            @Override
            public Character call(String v1) throws Exception {
                // 根据元素首字符排序
                return v1.charAt(0);
            }
        });
        groupByRDD.collect().forEach(System.out::println);
    }
```

输出结果

```
(z,[zookeeper]) 
(h,[hello, hadoop])
(s,[spark, scala])
```



##### 9）filter（窄）

**方法签名**

```java
public JavaRDD<T> filter(final Function<T, Boolean> f)
```

**方法说明**

-   将数据根据指定的规则进行**筛选过滤，符合规则的数据保留，不符合规则的数据丢弃**。
-   当数据进行筛选过滤后，分区不变，但是分区内的数据可能不均衡，生产环境下，可能会出现**数据倾斜**。
-   filter不会改变数据的整体结构

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("filter");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8));

        // 过滤出 不被2整除的数
        // RDD.filter(x -> x%2!=0).collect().forEach(x-> System.out.println(x));
        JavaRDD<Integer> filterRDD = RDD.filter(new Function<Integer, Boolean>() {
            @Override
            public Boolean call(Integer v1) throws Exception {
                return v1 % 2 != 0;
            }
        });
        filterRDD.collect().forEach(System.out::println);
    }
```



##### 10）sample 随机抽样

**方法签名**

```java
public JavaRDD<T> sample(final boolean withReplacement, final double fraction)
    
public JavaRDD<T> sample(final boolean withReplacement, final double fraction, final long seed)
    
// 参数说明
//	withReplacement 表示抽取后是否将数据放回 	true表放回，false表不放回
//	fraction 表示数据源中每条数据被抽取的概率
    			基准值的概念
// 	seed 表随机种子（抽取数据时随机算法的种子）
				如果不传入该参数，那么默认使用当前系统时间
```

**方法说明**

-   根据指定的规则从数据集中抽取数据

**作用**：数据倾斜的时候用sample；
分区时的数据是均衡的，但是**shuffle时会打乱重新组合**，极限情况下所有数在一个分区中，就产生**数据倾斜**；
使用sample抽取查看，如1000条抽取100条，如果抽出来大部分都是某个数据，则针对这个数据进行处理，改善数据倾斜

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("sample").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9));
        // 抽取数据不放回（伯努利算法）
        // 伯努利算法：又叫0、1分布。例如扔硬币，要么正面，要么反面。
        // 具体实现：根据种子和随机算法算出一个数和第二个参数设置几率比较，小于第二个参数要，大于不要
        // 第一个参数：抽取的数据是否放回，false：不放回
        // 第二个参数：抽取的几率，范围在[0,1]之间,0：全不取；1：全取；
        //      数据源中每条数据被抽取的概率
        // 第三个参数：随机数种子
        List<Integer> collect = RDD.sample(false, 0.4, 1).collect();
        System.out.println(collect);

        // 抽取数据放回（泊松算法）
        // 第一个参数：抽取的数据是否放回，true：放回；false：不放回
        // 第二个参数：重复数据的几率，范围大于等于0.表示每一个元素被期望抽取到的次数
        //      数据源中的每条数据被抽取的可能次数
        // 第三个参数：随机数种子
        List<Integer> collect2 = RDD.sample(true, 2, 1).collect();
        System.out.println(collect2);
    }
```



##### 11）distinct（宽） 去重

**方法签名**

```java
public JavaRDD<T> distinct()
    
public JavaRDD<T> distinct(final int numPartitions)
// 第一个方法是基于方法函数实现的，只是numPartitions默认为partitions.length，partitions为parent RDD的分区。

```

**方法说明**

-   将RDD数据集中重复的数据去重

-   **由于重复数据可能分散在不同的 partition 里面**，**因此需要 shuffle** 来进行 aggregate(聚合) 后再去重。然而，shuffle 要求数据类型是 <K, V> 。如果原始数据只有 Key（比如例子中 record 只有一个整数），那么需要补充成 <K, null> 。这个补充过程由 **map()** 操作完成，生成 MappedRDD。然后调用上面的 **reduceByKey()** 来进行 shuffle，在 map 端进行 combine，然后 reduce 进一步去重，生成 MapPartitionsRDD。最后，将 <K, null> 还原成 K，仍然由 **map()** 完成，生成 MappedRDD。

-   **distinct算子相当于 map + reduceByKey + map**(在Java中实现需要 mapToPair -> reduceByKet -> map)

-   例如：下面是Scala的伪代码

    ```scala
    map(x => (x,null)).reduceByKey((x,y) => x,numpartitions).map((x,null) -> x)
    ```

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("distinct");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4, 1, 2, 3));
        List<Integer> collect = RDD.distinct().collect();
        System.out.println(collect);
    }
```



##### 12）coalesce（缩窄增宽） 缩减分区

**方法签名**

```java
public JavaRDD<T> coalesce(final int numPartitions)
// 缩减分区为窄依赖
// 扩大分区需要使用参数shuffle为true的，为宽依赖
    
public JavaRDD<T> coalesce(final int numPartitions, final boolean shuffle)
// coalesce方法默认情况下不会将分区的数据打乱重新组合
// 这种情况下的缩减分区可能会导致数据不均衡，出现数据倾斜
// 如果想让数据均衡，可以令 shuffle == true
```

**方法说明**

-   该算子常用于**缩减分区**，用于大数据集过滤后，提高小数据集的执行效率

-   算子的第二个参数 shuffle 表示缩减分区时过程是否产生 shuffle （true为产生shuffle，false表示不产生shuffle）

-   当spark程序中，**存在过多的小任务的时候，可以通过coalesce方法，收缩合并分区，减少分区的个数，减小任务调度成本**

-   coalesce算子是可以扩大分区的，但是如果不进行shuffle操作（即如果第二个参数设置为false的话，这个算子将不产生作用），是没有意义的，不起作用

-   如果想要扩大分区，可以使用shuffle操作（即第二参数为true），此外，还有另一个算子**repartition用来扩大分区**，如下

    ```
    coalesce(numPartitions,true) = repartition(numPartition)
    ```

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("coalesce");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4,5,6,7,8),3);
        JavaRDD<Integer> coalesceRDD = RDD.coalesce(2);

        coalesceRDD.saveAsTextFile("file:///opt/temp/coalesce");
    }
```

结果

```
[root@kk01 coalesce]# pwd
/opt/temp/coalesce
[root@kk01 coalesce]# cat part-00000
1
2
[root@kk01 coalesce]# cat part-00001
3
4
5
6
7
8
```

我们发现两个分区文件，可能会存在数据倾斜的可能，可以指定shuffle为true避免

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("coalesce");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4,5,6,7,8),3);
    	// 第二个参数shuffle为true，会将分区的数据打乱重新组合
        JavaRDD<Integer> coalesceRDD = RDD.coalesce(2,true); 

        coalesceRDD.saveAsTextFile("file:///opt/temp/coalesce");
    }
```

结果如下

```
[root@kk01 coalesce]# pwd
/opt/temp/coalesce
[root@kk01 coalesce]# cat part-00000
1
4
6
8
[root@kk01 coalesce]# cat part-00001
2
3
5
7
```



##### 13）repartition（宽） 增加分区

**方法签名**

```javascript
public JavaRDD<T> repartition(final int numPartitions)
```

**方法说明**

-   增加分区

-   repartition方法的操作内部其实执行的是**coalesce操作，参数shuffle的默认值为true**。无论是将分区数多的RDD转换为分区数少的RDD，还是将分区数少的RDD转换为分区数多的RDD，repartition操作都可以完成，因为无论如何都会经shuffle过程。

    ```scala
    // Scala源码中可以看到
    def repartition(numPartitions: Int)(implicit ord: Ordering[T]=null):RDD[T]= withScope{
    coalesce(numPartition, shuffle = true)
    }
    ```

-   无论**增加 或 减少分区都会产生shuffle**

-   所以**减少分区时，为了避免shuffle，可以使用 coalesce 算子**

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("repartition");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8), 2);
        JavaRDD<Integer> repartitionRDD = RDD.repartition(3);

        repartitionRDD.saveAsTextFile("file:///opt/temp/repartition");
    }
```

结果

```
[root@kk01 repartition]# ll
total 12
-rw-r--r--. 1 root root 4 Apr 28 01:51 part-00000
-rw-r--r--. 1 root root 6 Apr 28 01:51 part-00001
-rw-r--r--. 1 root root 6 Apr 28 01:51 part-00002
-rw-r--r--. 1 root root 0 Apr 28 01:51 _SUCCESS
[root@kk01 repartition]# 
[root@kk01 repartition]# 
[root@kk01 repartition]# 
[root@kk01 repartition]# cat part-00000
3
6
[root@kk01 repartition]# cat part-00001
1
4
7
[root@kk01 repartition]# cat part-00002
2
5
8
```

##### **coalesce和repartition区别**

-   coalesce可以用于扩大分区和缩小分区，扩大分区时需指定shuffle参数为true，否则毫无意义
-   repartition方法底层调用的是就是shuffle参数为true的coalesce的方法

```scala
def repartition(numPartitions: Int)(implicit ord: Ordering[T]=null):RDD[T]= withScope{
coalesce(numPartition, shuffle = true)
}
```

总结：

​	**缩减分区首选 coalesce 算子（不产生shuffle）。**

​	如果要**扩大分区**，可以令 shuffle参数为true。但是这样还不如直接**使用repartition算子（会产生shuffle）**

​	repartition 无论增大、缩减分区都会产生shuffle

下面进行测试

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("test");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        sparkContext.setLogLevel("WARN");
        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4), 3);
        
        JavaRDD<Integer> rdd2 = RDD.repartition(2);  // 会产生shuffle，底层相当于coalesce(2,true)
//        JavaRDD<Integer> rdd2 = RDD.repartition(4);  // 会产生shuffle，底层相当于coalesce(4,true)
//        JavaRDD<Integer> rdd2 = RDD.coalesce(2);  // 不产生shuffle
//        JavaRDD<Integer> rdd2 = RDD.coalesce(2,true);  // 产生shuffle
//        JavaRDD<Integer> rdd2 = RDD.coalesce(4);  // 没有第二个参数，毫无意义

        rdd2.mapPartitionsWithIndex(new Function2<Integer, Iterator<Integer>, Iterator<Integer>>() {
            @Override
            public Iterator<Integer> call(Integer index, Iterator<Integer> iterator) throws Exception {
                List<Integer> list = new ArrayList<>();
                while (iterator.hasNext()) {
                    Integer i = iterator.next();
                    System.out.println("分区号 " + index + ", 数据值 " + i);
                    list.add(i + 1);
                }
                return list.iterator();
            }
        }, true).collect();
        sparkContext.stop();
    }
```

结果

```
分区号 1, 数据值 2
分区号 0, 数据值 1
分区号 1, 数据值 4
分区号 0, 数据值 3
```

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("test");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        sparkContext.setLogLevel("WARN");
        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4), 3);

//        JavaRDD<Integer> rdd2 = RDD.repartition(2);  // 会产生shuffle，底层相当于coalesce(2,true)
        JavaRDD<Integer> rdd2 = RDD.repartition(4);  // 会产生shuffle，底层相当于coalesce(4,true)
//        JavaRDD<Integer> rdd2 = RDD.coalesce(2);  // 不产生shuffle
//        JavaRDD<Integer> rdd2 = RDD.coalesce(2,true);  // 产生shuffle
//        JavaRDD<Integer> rdd2 = RDD.coalesce(4);  // 没有第二个参数，毫无意义

        rdd2.mapPartitionsWithIndex(new Function2<Integer, Iterator<Integer>, Iterator<Integer>>() {
            @Override
            public Iterator<Integer> call(Integer index, Iterator<Integer> iterator) throws Exception {
                List<Integer> list = new ArrayList<>();
                while (iterator.hasNext()) {
                    Integer i = iterator.next();
                    System.out.println("分区号 " + index + ", 数据值 " + i);
                    list.add(i + 1);
                }
                return list.iterator();
            }
        }, true).collect();
        sparkContext.stop();
    }
```

结果

```
分区号 1, 数据值 2
分区号 0, 数据值 3
分区号 3, 数据值 1
分区号 1, 数据值 4
```

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("test");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        sparkContext.setLogLevel("WARN");
        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4), 3);

//        JavaRDD<Integer> rdd2 = RDD.repartition(2);  // 会产生shuffle，底层相当于coalesce(2,true)
//        JavaRDD<Integer> rdd2 = RDD.repartition(4);  // 会产生shuffle，底层相当于coalesce(4,true)
        JavaRDD<Integer> rdd2 = RDD.coalesce(2);  // 不产生shuffle
//        JavaRDD<Integer> rdd2 = RDD.coalesce(2,true);  // 产生shuffle
//        JavaRDD<Integer> rdd2 = RDD.coalesce(4);  // 没有第二个参数，毫无意义

        rdd2.mapPartitionsWithIndex(new Function2<Integer, Iterator<Integer>, Iterator<Integer>>() {
            @Override
            public Iterator<Integer> call(Integer index, Iterator<Integer> iterator) throws Exception {
                List<Integer> list = new ArrayList<>();
                while (iterator.hasNext()) {
                    Integer i = iterator.next();
                    System.out.println("分区号 " + index + ", 数据值 " + i);
                    list.add(i + 1);
                }
                return list.iterator();
            }
        }, true).collect();
        sparkContext.stop();
    }
```

结果 

```
分区号 1, 数据值 2
分区号 0, 数据值 1
分区号 1, 数据值 3
分区号 1, 数据值 4
```

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("test");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        sparkContext.setLogLevel("WARN");
        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4), 3);

//        JavaRDD<Integer> rdd2 = RDD.repartition(2);  // 会产生shuffle，底层相当于coalesce(2,true)
//        JavaRDD<Integer> rdd2 = RDD.repartition(4);  // 会产生shuffle，底层相当于coalesce(4,true)
//        JavaRDD<Integer> rdd2 = RDD.coalesce(2);  // 不产生shuffle
        JavaRDD<Integer> rdd2 = RDD.coalesce(2,true);  // 产生shuffle
//        JavaRDD<Integer> rdd2 = RDD.coalesce(4);  // 没有第二个参数，毫无意义

        rdd2.mapPartitionsWithIndex(new Function2<Integer, Iterator<Integer>, Iterator<Integer>>() {
            @Override
            public Iterator<Integer> call(Integer index, Iterator<Integer> iterator) throws Exception {
                List<Integer> list = new ArrayList<>();
                while (iterator.hasNext()) {
                    Integer i = iterator.next();
                    System.out.println("分区号 " + index + ", 数据值 " + i);
                    list.add(i + 1);
                }
                return list.iterator();
            }
        }, true).collect();
        sparkContext.stop();
    }
```

结果（产生了shuffle，数据被打乱了）

```
分区号 1, 数据值 2
分区号 0, 数据值 1
分区号 1, 数据值 4
分区号 0, 数据值 3
```

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("test");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        sparkContext.setLogLevel("WARN");
        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4), 3);

//        JavaRDD<Integer> rdd2 = RDD.repartition(2);  // 会产生shuffle，底层相当于coalesce(2,true)
//        JavaRDD<Integer> rdd2 = RDD.repartition(4);  // 会产生shuffle，底层相当于coalesce(4,true)
//        JavaRDD<Integer> rdd2 = RDD.coalesce(2);  // 不产生shuffle
//        JavaRDD<Integer> rdd2 = RDD.coalesce(2,true);  // 产生shuffle
        JavaRDD<Integer> rdd2 = RDD.coalesce(4);  // 没有第二个参数，毫无意义

        rdd2.mapPartitionsWithIndex(new Function2<Integer, Iterator<Integer>, Iterator<Integer>>() {
            @Override
            public Iterator<Integer> call(Integer index, Iterator<Integer> iterator) throws Exception {
                List<Integer> list = new ArrayList<>();
                while (iterator.hasNext()) {
                    Integer i = iterator.next();
                    System.out.println("分区号 " + index + ", 数据值 " + i);
                    list.add(i + 1);
                }
                return list.iterator();
            }
        }, true).collect();
        sparkContext.stop();
    }
```

结果（数据的分区没有变化）

```
分区号 0, 数据值 1
分区号 1, 数据值 2
分区号 2, 数据值 3
分区号 2, 数据值 4
```



##### 14）sortBy（宽）

**方法签名**

```java
public <S> JavaRDD<T> sortBy(final Function<T, S> f, final boolean ascending, final int numPartitions)
// 参数说明
// ascending  true表示升序排序，false表示降序排序
```

**方法说明**

-   sortBy**根据给定的 f函数 将RDD中的元素进行排序**。
-   该操作用于排序数据。在排序之前，可以将数据通过f函数进行处理，之后按照f函数处理的结果进行排序，默认为升序排列。
-   排序后新产生的RDD的分区数与原RDD的分区数一致（不改变分区）。**中间存在shuffle的过程**


```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("sortBy");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<String> RDD = sparkContext.parallelize(Arrays.asList("hello_2", "spark_1", "hadoop_3"));
    	 // 根据指定的规则对数据源中的数据进行排序，默认升序，ascending参数可以改变排序方式
        // sortBy默认情况下不会改变分区，但中间存在shuffle操作
        JavaRDD<String> sortByRDD = RDD.sortBy(new Function<String, String>() {
            @Override
            public String call(String v1) throws Exception {
                // 根据 _后面的数字排序
                return v1.split("_")[1];
            }
        }, false, 1);
        sortByRDD.collect().forEach(System.out::println);
    }
```

结果

```
hadoop_3
hello_2
spark_1
```



##### 15）keyBy（窄）

**方法签名**

```java
public <U> JavaPairRDD<U, T> keyBy(final Function<T, U> f)
```

**方法说明**

-   该算子将 value 类型的RDD 转变为 Key-Value 类型的RDD
-   原RDD中的数据变为了Key-Value类型中的value ，f 函数操作的结果变为了Key-Value类型中的key

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("keyBy").setMaster("local");
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        jsc.setLogLevel("WARN");
        JavaRDD<String> RDD = jsc.parallelize(Arrays.asList("hello", "world", "spark", "hadoop"));
        
        JavaPairRDD<Object, String> keyByRDD = RDD.keyBy(new Function<String, Object>() {
            @Override
            public Object call(String value) throws Exception {
                return value.length();
            }
        });
        System.out.println(keyByRDD.toDebugString());
        System.out.println(keyByRDD.collect());
    }
```

结果

```java
(1) MapPartitionsRDD[1] at keyBy at SparkRDD_keyBy.java:19 []
 |  ParallelCollectionRDD[0] at parallelize at SparkRDD_keyBy.java:16 []
[(5,hello), (5,world), (5,spark), (6,hadoop)]
```



##### 16）cartesian

**方法签名**

```java
public <U> JavaPairRDD<T, U> cartesian(final JavaRDDLike<U, ?> other)
```

**方法说明**

-   计算两个RDD的笛卡尔积，开发中一般不使用

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("cartesain").setMaster("local");
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        jsc.setLogLevel("WARN");
        JavaRDD<Integer> RDD1 = jsc.parallelize(Arrays.asList(1, 2, 3),2);
        JavaRDD<Integer> RDD2 = jsc.parallelize(Arrays.asList(4, 5, 6),2);

        JavaPairRDD<Integer, Integer> cartesian = RDD1.cartesian(RDD2);
        System.out.println(cartesian.toDebugString());
        System.out.println(cartesian.collect());
    }
```

结果

```diff
(4) CartesianRDD[2] at cartesian at SparkRDD_cartesian.java:18 []
 |  ParallelCollectionRDD[0] at parallelize at SparkRDD_cartesian.java:15 []
 |  ParallelCollectionRDD[1] at parallelize at SparkRDD_cartesian.java:16 []
[(1,4), (1,5), (1,6), (2,4), (3,4), (2,5), (2,6), (3,5), (3,6)]
```



##### 17）pipe

**方法签名**

```java
public JavaRDD<String> pipe(final String command)
public JavaRDD<String> pipe(final List<String> command)
public JavaRDD<String> pipe(final List<String> command, final Map<String, String> env)
public JavaRDD<String> pipe(final List<String> command, final Map<String, String> env, final boolean separateWorkingDir, final int bufferSize)
public JavaRDD<String> pipe(final List<String> command, final Map<String, String> env, final boolean separateWorkingDir, final int bufferSize, final String encoding)
```

**方法说明**

-   管道，针对每个分区，都去执行一个shell脚本，返回输出的RDD

注意：

​	**脚本需要放在 worker节点可用访问到的位置**







#### 双Value型

##### 18）intersection 交集

**方法签名**

```java
public JavaRDD<T> intersection(final JavaRDD<T> other)
```

**方法说明**

-   对源RDD和参数RDD求**交集**后返回一个新的RDD
-   子RDD并行度为父RDD中并行度大的那个

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("intersection");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD1 = sparkContext.parallelize(Arrays.asList(1,2,3,4));
        JavaRDD<Integer> RDD2 = sparkContext.parallelize(Arrays.asList(3,4,5,6));
        // 交集
        JavaRDD<Integer> intersection = RDD1.intersection(RDD2);
        List<Integer> collect = intersection.collect();
        System.out.println(collect);
    }
```

结果

```
[3, 4]
```

**如果两个RDD数据类型不一致怎么办？**

-   交集（intersection）、并集（union）和差集（subtract）要求两个数据源数据类型保持一致



##### 19）union 并集

**方法签名**

```java
public JavaRDD<T> union(final JavaRDD<T> other)
```

**方法说明**

-   对源RDD和参数RDD求**并集**后返回一个新的RDD
-   子RDD并行度为 父RDD并行度之和

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("union");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD1 = sparkContext.parallelize(Arrays.asList(1,2,3,4));
        JavaRDD<Integer> RDD2 = sparkContext.parallelize(Arrays.asList(3,4,5,6));
        // 并集
        JavaRDD<Integer> union = RDD1.union(RDD2);
        List<Integer> collect = union.collect();
        System.out.println(collect);
    }
```

结果

```
[1, 2, 3, 4, 3, 4, 5, 6]
```

**如果两个RDD数据类型不一致怎么办？**

-   交集（intersection）、并集（union）和差集（subtract）要求两个数据源数据类型保持一致

    

##### 20）subtract 差集

**方法签名**

```java
public JavaRDD<T> subtract(final JavaRDD<T> other) 

public JavaRDD<T> subtract(final JavaRDD<T> other, final int numPartitions)

public JavaRDD<T> subtract(final JavaRDD<T> other, final Partitioner p)
```

**方法说明**

-   以一个RDD元素为主，去除两个RDD中重复元素，将其他元素保留下来。**求差集**
-   子RDD的并行度为父RDD中并行度大的那个

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("subtract");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD1 = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4));
        JavaRDD<Integer> RDD2 = sparkContext.parallelize(Arrays.asList(3, 4, 5, 6));
        // 差集
        JavaRDD<Integer> subtract = RDD1.subtract(RDD2);
        List<Integer> collect = subtract.collect();
        System.out.println(collect);
    }
```

结果

```
[1, 2]
```

**如果两个RDD数据类型不一致怎么办？**

-   交集（intersection）、并集（union）和差集（subtract）**要求两个数据源数据类型保持一致**



##### 21）zip 拉链

**方法签名**

```java
public <U> JavaPairRDD<T, U> zip(final JavaRDDLike<U, ?> other) 
```

**方法说明**

-   将两个RDD中的元素，**以键值对的形式进行合并**。其中，键值对中的Key为第1个RDD中的元素，Value为第2个RDD中的相同位置的元素。

-   这两个RDD的中元素的类型可以是KV类型、也开始是非KV类型

-   注意：

    -   两个RDD中的**每个分区中的元素个数必须相同**，否则报错

    ```diff
    SparkException: Can only zip RDDs with same number of elements in each partition
    ```

    -   两个的RDD的分区数也必须相同，否则报错

    ```diff
    IllegalArgumentException: Can't zip RDDs with unequal numbers of partitions: List(2, 4)
    无法压缩RDDs和不相等的分区数量:列表(2,4)
    ```

    演示两个RDD都为非KV类型

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("zip");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<String> RDD1 = sparkContext.parallelize(Arrays.asList("zhangsan", "lisi", "wangwu", "zhaoliu"));
        JavaRDD<Integer> RDD2 = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4));
        // 拉链
        // 每个rdd的每个分区中的元素数量必须相同，否则报错
        // SparkException: Can only zip RDDs with same number of elements in each partition
        // 每个rdd的分区数必须相同，否则报错
        // IllegalArgumentException: Can't zip RDDs with unequal numbers of partitions: List(2, 4)
        JavaPairRDD<String, Integer> zip = RDD1.zip(RDD2);
        zip.foreach(new VoidFunction<Tuple2<String, Integer>>() {
            @Override
            public void call(Tuple2<String, Integer> stringIntegerTuple2) throws Exception {
                System.out.println(stringIntegerTuple2);
            }
        });
    }
```

结果

```
(zhangsan,1)
(lisi,2)
(zhaoliu,4)
(wangwu,3)
```

演示两个RDD，其中一个为KV类型，一个非KV类型

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("zip");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaPairRDD<String, Integer> RDD = sparkContext.parallelizePairs(Arrays.asList(
                new Tuple2("hello", 2),
                new Tuple2("spark", 3),
                new Tuple2("spark", 4),
                new Tuple2("hadoop", 5)
        ));
        JavaRDD<Integer> RDD2 = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4));
        // 拉链
        // 每个rdd的每个分区中的元素数量必须相同，否则报错
        // SparkException: Can only zip RDDs with same number of elements in each partition
        // 每个rdd的分区数必须相同，否则报错
        // IllegalArgumentException: Can't zip RDDs with unequal numbers of partitions: List(2, 4)
        JavaPairRDD<Tuple2<String, Integer>, Integer> zip = RDD.zip(RDD2);
        zip.foreach(new VoidFunction<Tuple2<Tuple2<String, Integer>, Integer>>() {
            @Override
            public void call(Tuple2<Tuple2<String, Integer>, Integer> tuple2IntegerTuple2) throws Exception {
                System.out.println(tuple2IntegerTuple2);
            }
        });
    }
```

结果

```
((hello,2),1)
((hadoop,5),4)
((spark,4),3)
((spark,3),2)
```

**如果两个RDD数据类型不一致怎么办？**

-   拉链（zip）操作两个数据源的类型可以不一致

**如果两个RDD数据分区不一致怎么办？**

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("zip");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD1 = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4),2);
        JavaRDD<Integer> RDD2 = sparkContext.parallelize(Arrays.asList(3, 4, 5, 6),4);
        // 拉链
        // IllegalArgumentException: 
        //         Can't zip RDDs with unequal numbers of partitions: List(2, 4)
        JavaPairRDD<Integer, Integer> zip = RDD1.zip(RDD2);
        List<Tuple2<Integer, Integer>> collect = zip.collect();
        System.out.println(collect);
    }
```

-   会报错IllegalArgumentException: Can't zip RDDs with unequal numbers of partitions: List(2, 4)
-   两个数据源要求分区数量要保持一致

**如果两个RDD分区数据数量不一致怎么办？**

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("zip");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD1 = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4),2);
        JavaRDD<Integer> RDD2 = sparkContext.parallelize(Arrays.asList(3, 4, 5, 6,7,8),2);
        // 拉链
        // SparkException: 
        //      Can only zip RDDs with same number of elements in each partition
        JavaPairRDD<Integer, Integer> zip = RDD1.zip(RDD2);
        List<Tuple2<Integer, Integer>> collect = zip.collect();
        System.out.println(collect);
    }
```

-   会报错SparkException: Can only zip RDDs with same number of elements in each partition

-   两个数据源要求分区中数据数量保持一致

    

##### 22）zipWithIndex

**方法签名**

```java
public JavaPairRDD<T, Long> zipWithIndex()
```

**方法说明**

-   ​	该算子将 RDD中的元素和这个元素在RDD中的索引号（从0开始）组合成（K，V）对

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("zipWithIndex");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD2 = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4), 3);
        /**
         *  public JavaPairRDD<T, Long> zipWithIndex()
         *  该算子返回<K,V>类型数据，K为父RDD中的数据，V为这个元素在RDD中的索引号（从0开始）
         */
        JavaPairRDD<Integer, Long> zipWithIndexRDD = RDD2.zipWithIndex();

        zipWithIndexRDD.foreach(x -> System.out.println(x));
        sparkContext.stop();
    }
```

结果

```
(1,0)   （RDD数据，RDD索引号）
(2,1)
(3,2)
(4,3)
```



#### Key-Value型

Key-Value型的算子**要求数据源是K-V类型**



##### 23）mapValues

**方法签名**

```java
public <U> JavaPairRDD<K, U> mapValues(final Function<V, U> f)
```

```scala
def mapValues[U](f: JFunction[V, U]): JavaPairRDD[K, U]
```

**方法说明**

-   当key-value类型的数据，key保持不变，只对value做转换
-   mapValues算子可以用于对 JavaPairRDD 中的value进行操作，而不改变key。

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("mapValues");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<String> RDD = sparkContext.parallelize(Arrays.asList("hello", "world", "spark"));
        JavaPairRDD<String, Integer> pairRDD = RDD.mapToPair(word -> new Tuple2<String, Integer>(word, 1));
        // 对所以 k-v类型的数据的value加上2
        JavaPairRDD<String, Integer> mapValuesRDD = pairRDD.mapValues(new Function<Integer, Integer>() {
            @Override
            public Integer call(Integer v1) throws Exception {
                return v1 + 2;
            }
        });
        System.out.println(mapValuesRDD.collect());
    }
```

结果

```
[(hello,3), (world,3), (spark,3)]
```



##### 24）flatMapValues（窄）

**方法签名**

```java
public <U> JavaPairRDD<K, U> flatMapValues(final FlatMapFunction<V, U> f) 
```

**方法说明**

-   对对偶元组中的value进行扁平化操作

```java
public static void main(String[] args) {
        // 获取配置对象
        SparkConf sparkConf = new SparkConf().setMaster("local").setAppName("flatMapValues");
        // 获取 SparkContext上下文对象
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        jsc.setLogLevel("WARN");
        JavaPairRDD<String, String> pairRDD = jsc.parallelizePairs(
                Arrays.asList(
                        new Tuple2<>("a", "1 2"),
                        new Tuple2<>("b", "3 4"),
                        new Tuple2<>("c", "5 6")
                ));
        JavaPairRDD<String, String> flatMapValuesRDD = pairRDD.flatMapValues(new FlatMapFunction<String, String>() {
            @Override
            public Iterator<String> call(String value) throws Exception {
                String[] split = value.split(" ");
                return Arrays.asList(split).iterator();
            }
        });
        System.out.println(flatMapValuesRDD.toDebugString());
        System.out.println(flatMapValuesRDD.collect());
    }
```

结果

```
(1) MapPartitionsRDD[1] at flatMapValues at SparkRDD_flatMapValues.java:29 []
 |  ParallelCollectionRDD[0] at parallelizePairs at SparkRDD_flatMapValues.java:23 []
[(a,1), (a,2), (b,3), (b,4), (c,5), (c,6)]
```





##### 25）partitionBy（宽） 分区

**方法签名**

```java
public JavaPairRDD<K, V> partitionBy(final Partitioner partitioner)
```

**方法说明**

-   将数据按照指定规则Partitioner重新进行分区。Spark默认的分区器是HashPartitioner

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("partitionBy");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        Tuple2<String, Integer> tuple2_1 = new Tuple2<>("spark", 1);
        Tuple2<String, Integer> tuple2_2 = new Tuple2<>("java", 3);
        Tuple2<String, Integer> tuple2_3= new Tuple2<>("hadoop", 2);

        JavaPairRDD<String , Integer> pairRDD = sparkContext
                .parallelizePairs(Arrays.asList(tuple2_1,tuple2_2,tuple2_3));

        JavaPairRDD<String, Integer> partitionByRDD = pairRDD
                .partitionBy(new HashPartitioner(2));
       
        partitionByRDD.saveAsTextFile("file:///opt/temp/partitionBy");
    }
```

结果

```
[root@kk01 partitionBy]# ll
total 8
-rw-r--r--. 1 root root  9 Apr 28 04:08 part-00000
-rw-r--r--. 1 root root 21 Apr 28 04:08 part-00001
-rw-r--r--. 1 root root  0 Apr 28 04:08 _SUCCESS
[root@kk01 partitionBy]# cat part-00000
(java,3)
[root@kk01 partitionBy]# cat part-00001
(spark,1)
(hadoop,2)

```

**如果重分区的分区器和当前RDD的分区器一样怎么办？**

-   当分区的类型与分区数量与当前的分区器一样，则不会重分区，因为这样毫无意义

**Spark还有其他分区器吗？**

-   Spark为RDD提供的分区方式：
    -   哈希分区（HashPartitioner）：是根据哈希值来分区
    -   范围分区（RangePartitioner）：将一定范围的数据映射到一个分区中
    -   python分区（PythonPartitioner）

**如果想按照自己的方法进行数据分区怎么办？**

-   除了Spark为RDD提供的分区方式，我们还可以自定义分区规则：

    -   通过自定义的Partitioner对象来控制RDD的分区
    -   让自定义的类继承自org.apache.spark.Partitioner
    -   并实现其中抽象方法

    ```java
    public abstract int numPartitions()  // 用于返回创建的分区个数
        
    // 用于对输入的key做处理，并返回给key对应的分区ID
    // 分区ID范围 0 ~ numPartitions-1
    public abstract int getPartition(final Object key)  
    ```



##### 26）reduceByKey（宽） 分组 聚合

**方法签名**

```java
public JavaPairRDD<K, V> reduceByKey(final Function2<V, V, V> func)

public JavaPairRDD<K, V> reduceByKey(final Function2<V, V, V> func, final int numPartitions)

public JavaPairRDD<K, V> reduceByKey(final Partitioner partitioner, final Function2<V, V, V> func)
    
// 其中
// func是一个函数，用于将相同键的值进行聚合操作
// 在聚合过程中，Spark会将RDD中的元素分成多个分区，然后在每个分区内部进行聚合操作，最后将各个分区的聚合结果再进行一次聚合，得到最终的结果。所以存在shuffle    
```

**方法说明**

-   根据相同的key的数据进行value数据的聚合操作
-   聚合方式：**两两聚合**
-   reduceByKey这**如果key的数据只有一个，则不会参与运算**
-   reduceByKey存在**map端的预聚合**（类似与mapreduce中的map端 combine）

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("reduceByKey").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        sparkContext.setLogLevel("ERROR");

        JavaRDD<String> RDD = sparkContext.parallelize(Arrays.asList("hello", "hello", "hello", "spark", "spark", "hadoop"));
        JavaPairRDD<String, Integer> mapToPairRDD = RDD.mapToPair(x -> new Tuple2<>(x, 1));
        JavaPairRDD<String, Integer> reduceByKeyRDD = mapToPairRDD.reduceByKey(new Function2<Integer, Integer, Integer>() {
            @Override
            public Integer call(Integer v1, Integer v2) throws Exception {
                // 这里打印是为了看到两两聚合的效果
                System.out.println(v1 + ":" + v2);
                return v1 + v1;
            }
        });
        List<Tuple2<String, Integer>> collect = reduceByKeyRDD.collect();
        System.out.println(collect);

        sparkContext.stop();
    }
```

结果

```
1:1
1:1
2:1
[(hello,4), (hadoop,1), (spark,2)]
```



##### 27）groupByKey （宽）分组

**方法签名**

```java
public JavaPairRDD<K, Iterable<V>> groupByKey()

public JavaPairRDD<K, Iterable<V>> groupByKey(final int numPartitions)
    
public JavaPairRDD<K, Iterable<V>> groupByKey(final Partitioner partitioner)
```

**方法说明**

-   将数据源中的数据，相同的key的数据分为同一个组，形成一个**对偶元组**
-   即 (K,V)  ===> (K, Iterable<V>)
-   元组的第一个元素是key
-   元组的第二个元素是相同key的value集合

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("groupByKey").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        sparkContext.setLogLevel("WARN");

        JavaPairRDD<String, Integer> RDD = sparkContext.parallelizePairs(Arrays.asList(
                new Tuple2("hello", 2),
                new Tuple2("spark", 3),
                new Tuple2("spark", 4),
                new Tuple2("hadoop", 5)
        ));
        JavaPairRDD<String, Iterable<Integer>> groupByKeyRDD = RDD.groupByKey();
        groupByKeyRDD.foreach(new VoidFunction<Tuple2<String, Iterable<Integer>>>() {
            @Override
            public void call(Tuple2<String, Iterable<Integer>> stringIterableTuple2) throws Exception {
                System.out.println("当前tuple数据为 " + stringIterableTuple2);
                Iterable<Integer> integers = stringIterableTuple2._2;
                Iterator<Integer> iterator = integers.iterator();
                while (iterator.hasNext()) {
                    System.out.println(iterator.next() + "~~~~");
                }
            }
        });

    }
```

结果

```
当前tuple数据为 (hadoop,[5])
当前tuple数据为 (hello,[2])
当前tuple数据为 (spark,[3, 4])
2~~~~
5~~~~
3~~~~
4~~~~
```

##### **groupBy 与 groupByKey的区别**

```java
 public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("groupByKey").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<String> RDD = sparkContext.parallelize(Arrays.asList("hello", "spark", "spark", "hadoop"));
        JavaPairRDD<String, Integer> mapToPairRDD = RDD.mapToPair(x -> new Tuple2<>(x, 1));
        JavaPairRDD<String, Iterable<Integer>> groupByKeyRDD = mapToPairRDD.groupByKey();
        List<Tuple2<String, Iterable<Integer>>> collect = groupByKeyRDD.collect();
        System.out.println(collect);
     
        // 下面是groupBy
        List<Tuple2<Object, Iterable<Tuple2<String, Integer>>>> collect2 = mapToPairRDD.groupBy(new Function<Tuple2<String, Integer>, Object>() {
            @Override
            public Object call(Tuple2<String, Integer> v1) throws Exception {
                return null;
            }
        }).collect();
        System.out.println(collect2);
    }

// 结果如下
[(hello,[1]), (hadoop,[1]), (spark,[1, 1])]

[(null,[(hello,1), (spark,1), (spark,1), (hadoop,1)])]
```

**reduceByKey与groupByKey的区别**

-   Spark中，shuffle操作必须落盘操作，不能在内存中数据等待，否则会导致内存溢出。因此shuffle操作性能很低。

-   从shuffle的角度：reduceByKey和groupByKey都存在shuffle**的操作**，但是**reduceByKey可以在shuffle前**对**分区内**相同key的数据进行**预聚合**（combine）功能，这样**会减少落盘的数据量**，而groupByKey只是进行分组，不存在数据量减少的问题，**reduceByKey性能比较高**。

-   从功能的角度：**reduceByKey**其实包含**分组和聚合**的功能。**groupByKey只能分组，不能聚合**，所以在分组聚合的场合下，推荐使用reduceByKey，如果仅仅是分组而不需要聚合。那么还是只能使用groupByKey

 


##### 28）aggregateByKey（窄） 聚合

**方法签名**

```java
public <U> JavaPairRDD<K, U> aggregateByKey(final U zeroValue, final Function2<U, V, U> seqFunc, final Function2<U, U, U> combFunc)
    
        // aggregateByKey方法存在函数柯里化，有两个参数列表
        // 第一个参数列表，需要传递一个参数，表示初始值
        //  	主要用于当碰见第一个key时，与value进行分区内计算
        // 第二个参数列表需要传递两个参数
        //  	第一个参数表示分区内计算规则
        //  	第二个参数表示分区间计算规则
public <U> JavaPairRDD<K, U> aggregateByKey(final U zeroValue, final int numPartitions, final Function2<U, V, U> seqFunc, final Function2<U, U, U> combFunc)

public <U> JavaPairRDD<K, U> aggregateByKey(final U zeroValue, final Partitioner partitioner, final Function2<U, V, U> seqFunc, final Function2<U, U, U> combFunc)
```

**方法说明**

-   将数据根据不同的规则进行**分区内**计算和**分区间**计算（即分区内与分区间可以定义不同的分区规则）
-   **aggregateByKey最终的返回数据结果需要与初始值zeroValue类型一致** （即 aggregateByKey的最终结果应该与初始值的类型保持一致）

```java
  /**
     * 计算相同key的数据的平均值
     * 期望结果 ==> (a,3) (b,4)
     */
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("aggregateByKey").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        Tuple2<String, Integer> tuple2_1 = new Tuple2<>("a", 1);
        Tuple2<String, Integer> tuple2_2 = new Tuple2<>("a", 2);
        Tuple2<String, Integer> tuple2_3 = new Tuple2<>("b", 3);
        Tuple2<String, Integer> tuple2_4 = new Tuple2<>("b", 4);
        Tuple2<String, Integer> tuple2_5 = new Tuple2<>("b", 5);
        Tuple2<String, Integer> tuple2_6 = new Tuple2<>("a", 6);
        JavaPairRDD<String, Integer> pairRDD = sparkContext
                .parallelizePairs(Arrays.asList(tuple2_1, tuple2_2, tuple2_3,
                        tuple2_4, tuple2_5, tuple2_6), 2);
        
        JavaPairRDD<String, Tuple2<Integer, Integer>> aggregateByKeyRDD = pairRDD.aggregateByKey(
                // 初始值（aggregateByKey的最终结果应该与初始值的类型保持一致）
                new Tuple2<Integer, Integer>(0, 0),
                // 分区内规则
                new Function2<Tuple2<Integer, Integer>, Integer, Tuple2<Integer, Integer>>() {
                    @Override
                    public Tuple2<Integer, Integer> call(Tuple2<Integer, Integer> v1, Integer v2) throws Exception {
                        // v1._1 + v2表示key对应的value总和  
                        // v1._2 + 1 表示相同key的个数
                        return new Tuple2<>(v1._1 + v2, v1._2 + 1); 
                    }
                },
                // 分区间规则
                new Function2<Tuple2<Integer, Integer>, Tuple2<Integer, Integer>, Tuple2<Integer, Integer>>() {
                    @Override
                    public Tuple2<Integer, Integer> call(Tuple2<Integer, Integer> v1, Tuple2<Integer, Integer> v2) throws Exception {
                        return new Tuple2<>(v1._1 + v2._1, v1._2 + v2._2);
                    }
                });
        
        JavaPairRDD<String, Integer> result = aggregateByKeyRDD.mapValues(new Function<Tuple2<Integer, Integer>, Integer>() {
            @Override
            public Integer call(Tuple2<Integer, Integer> v1) throws Exception {
                // 计算平均值
                return v1._1 / v1._2;
            }
        });

        System.out.println(result.collect());  // [(b,4), (a,3)]

    }
```

结果

```
[(b,4), (a,3)]
```



**aggregateByKey与reudceByKey的区别**

-   reduceByKey的**分区内与分区间的计算规则是相同的**

-   aggregateByKey可以分别定义**分区内的计算规则**和**分区间的计算规则**



##### aggregateByKey、groupByKey、reduceByKey联系

-   根据Scala源码中介绍，groupByKey 与 reduceByKey 都有分组的操作，但是**reduceByKey存在map端预聚合操作，效率更高**（本地聚合，减少网络IO）

-   groupBykey 是根据key进行分组，如果分组以后是为了做 aggregateByKey聚合操作（例如 sum、avg），不如直接使用 reduceByKey



##### 29）foldByKey

**方法签名**

```java
public JavaPairRDD<K, V> foldByKey(final V zeroValue, final Function2<V, V, V> func)

public JavaPairRDD<K, V> foldByKey(final V zeroValue, final int numPartitions, final Function2<V, V, V> func)

public JavaPairRDD<K, V> foldByKey(final V zeroValue, final Partitioner partitioner, final Function2<V, V, V> func)
```

**方法说明**

-   当**分区内计算规则和分区间计算规则相同**时，aggregateByKey就可以简化为foldByKey

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("foldByKey").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        Tuple2<String, Integer> tuple2_1 = new Tuple2<>("a", 1);
        Tuple2<String, Integer> tuple2_2 = new Tuple2<>("a", 2);
        Tuple2<String, Integer> tuple2_3 = new Tuple2<>("a", 3);
        Tuple2<String, Integer> tuple2_4 = new Tuple2<>("a", 4);
        JavaPairRDD<String, Integer> pairRDD = sparkContext
                .parallelizePairs(Arrays.asList(tuple2_1, tuple2_2, tuple2_3, tuple2_4), 2);
        // 如果聚合计算时，分区内与分区间计算规则相同，spark提供了简化的方法foldByKey
        List<Tuple2<String, Integer>> collect = pairRDD.foldByKey(0, new Function2<Integer, Integer, Integer>() {
            @Override
            public Integer call(Integer v1, Integer v2) throws Exception {
                return v1 + v2;
            }
        }).collect();
        System.out.println(collect);
    }
```

结果

```
[(a,10)]
```



##### 30）combineByKey

**方法签名**

```java
public <C> JavaPairRDD<K, C> combineByKey(final Function<V, C> createCombiner, final Function2<C, V, C> mergeValue, final Function2<C, C, C> mergeCombiners)

public <C> JavaPairRDD<K, C> combineByKey(final Function<V, C> createCombiner, final Function2<C, V, C> mergeValue, final Function2<C, C, C> mergeCombiners, final int numPartitions)

public <C> JavaPairRDD<K, C> combineByKey(final Function<V, C> createCombiner, final Function2<C, V, C> mergeValue, final Function2<C, C, C> mergeCombiners, final Partitioner partitioner)
 
public <C> JavaPairRDD<K, C> combineByKey(final Function<V, C> createCombiner, final Function2<C, V, C> mergeValue, final Function2<C, C, C> mergeCombiners, final Partitioner partitioner, final boolean mapSideCombine, final Serializer serializer)
```

**方法说明**

-   与aggregateByKey相似，不过它不需要初始值zeroValue，**采用相同key的第一个数据进行结构转换替换**

-   最通用的对key-value型rdd进行聚集操作的聚集函数（aggregation function）。类似于aggregate()，combineByKey()允许用户返回值的类型与输入不一致。


```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("combineByKey").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        Tuple2<String, Integer> tuple2_1 = new Tuple2<>("a", 1);
        Tuple2<String, Integer> tuple2_2 = new Tuple2<>("a", 2);
        Tuple2<String, Integer> tuple2_3 = new Tuple2<>("b", 3);
        Tuple2<String, Integer> tuple2_4 = new Tuple2<>("b", 4);
        Tuple2<String, Integer> tuple2_5 = new Tuple2<>("b", 5);
        Tuple2<String, Integer> tuple2_6 = new Tuple2<>("a", 6);
        JavaPairRDD<String, Integer> pairRDD = sparkContext
                .parallelizePairs(Arrays.asList(tuple2_1, tuple2_2, tuple2_3,
                        tuple2_4, tuple2_5, tuple2_6), 2);

        // 计算相同key的数据的平均值
        JavaPairRDD<String, Tuple2<Integer, Integer>> combineByKeyRDD = pairRDD.combineByKey(
                // combineByKey方法的三个参数：
                //      第一个参数 createCombiner 将相同的key的第一个数据进行结构的转换
                //          （类似于aggregateByKey 方法的参数 zeroValue）
                //      第二个参数 mergeValue 分区内的计算规则
                //      第三个参数 mergeCombiners 分区间的计算规则
                
                new Function<Integer, Tuple2<Integer, Integer>>() {
                    @Override
                    public Tuple2<Integer, Integer> call(Integer v1) throws Exception {
                        return new Tuple2<>(v1,1);
                    }
                },
                // 分区内规则
                new Function2<Tuple2<Integer, Integer>, Integer, Tuple2<Integer, Integer>>() {
                    @Override
                    public Tuple2<Integer, Integer> call(Tuple2<Integer, Integer> v1, Integer v2) throws Exception {
                        return new Tuple2<>(v1._1 + v2, v1._2 + 1);
                    }
                },
                // 分区间规则
                new Function2<Tuple2<Integer, Integer>, Tuple2<Integer, Integer>, Tuple2<Integer, Integer>>() {
                    @Override
                    public Tuple2<Integer, Integer> call(Tuple2<Integer, Integer> v1, Tuple2<Integer, Integer> v2) throws Exception {
                        return new Tuple2<>(v1._1 + v2._1, v1._2 + v2._2);
                    }
                });

        JavaPairRDD<String, Integer> result = combineByKeyRDD.mapValues(new Function<Tuple2<Integer, Integer>, Integer>() {
            @Override
            public Integer call(Tuple2<Integer, Integer> v1) throws Exception {
                return v1._1 / v1._2;
            }
        });

        System.out.println(result.collect());  // [(b,4), (a,3)]
    }
```

结果

```
[(b,4), (a,3)]
```



##### reduceByKey、foldByKey、aggregateByKey、combineByKey的区别

-   reduceByKey: 相同key的第一个数据不进行任何计算，分区内和分区间计算规则相同

-   foldByKey: 相同key的第一个数据和初始值进行分区内计算，分区内和分区间计算规则相同

-   aggregateByKey：相同key的第一个数据和初始值进行分区内计算，分区内和分区间计算规则可以不相同

-   combineByKey:当计算时，发现数据结构不满足要求时，可以让第一个数据转换结构。分区内和分区间计算规则不相同。



##### 31）sortByKey（宽）

**方法签名**

```java
public JavaPairRDD<K, V> sortByKey()

public JavaPairRDD<K, V> sortByKey(final boolean ascending)

public JavaPairRDD<K, V> sortByKey(final boolean ascending, final int numPartitions)

public JavaPairRDD<K, V> sortByKey(final Comparator<K> comp)

public JavaPairRDD<K, V> sortByKey(final Comparator<K> comp, final boolean ascending)

public JavaPairRDD<K, V> sortByKey(final Comparator<K> comp, final boolean ascending, final int numPartitions)
    
// 参数说明
// ascending  true表示升序排序，false表示降序排序
// Comparator<K> comp 表示自定义排序规则
```

**方法说明**

-   在一个(K,V)的RDD上调用，K必须实现Ordered特质（`Comparable` 接口），返回一个按照key进行排序的

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("sortByKey").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<String> RDD = sparkContext.parallelize(Arrays.asList("hello","world","spark","apache"));
        JavaPairRDD<String, Integer> pairRDD = RDD.mapToPair(word -> new Tuple2<>(word, 1));
        JavaPairRDD<String, Integer> sortByKeyRDD = pairRDD.sortByKey();
        System.out.println(sortByKeyRDD.collect());
    }
```

结果

```
[(apache,1), (hello,1), (spark,1), (world,1)]
```



##### 32）join（宽）

**方法签名**

```java
public <W> JavaPairRDD<K, Tuple2<V, W>> join(final JavaPairRDD<K, W> other)

public <W> JavaPairRDD<K, Tuple2<V, W>> join(final JavaPairRDD<K, W> other, final int numPartitions)

public <W> JavaPairRDD<K, Tuple2<V, W>> join(final JavaPairRDD<K, W> other, final Partitioner partitioner)
```

**方法说明**

-   在类型为(K,V)和(K,W)的RDD上调用，返回一个相同key对应的所有元素连接在一起的 (K,(V,W)) tuple 的RDD，(V,W)的类型为tuple（即 **(k, v) 与 (k, w) ===> (k, (v, w))** ）
-   即**两个不同的数据源的数据，相同的key的value会连接在一起，形成元组tuple**
-   如果两个数据源中的key没有匹配上，那么数据不会出现在结果中（**如果有相同的key会合并在一起，没有相同的key就舍弃**）
    -   例如 rdd1 = List(("a", 1), ("b", 2), ("c", 3))   rdd2 = List(("d", 5), ("c", 6), ("a", 4))  
    -   结果为(a,(1,4))  (c,(3,4))   其中  ("b", 2) ("d", 5) 均未匹配上
-   如果两个数据源中有多个相同的key，会依次匹配，可能会产生笛卡尔乘积，数据量会几何性增长
-   该算子得出一个结论 ： **并行度 = partition的个数 = task的个数**

```java
// 两个不同的数据源的数据，相同的key的value会连接在一起，形成元组tuple
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("join").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<String> RDD1 = sparkContext.parallelize(Arrays.asList("a","b","c"));
        JavaRDD<String> RDD2 = sparkContext.parallelize(Arrays.asList("b","c","a"));
        JavaPairRDD<String, Integer> pairRDD1 = RDD1.mapToPair(w -> new Tuple2<>(w, 1));
        System.out.println(pairRDD1.collect());  // [(a,1), (b,1), (c,1)]
        JavaPairRDD<String, Integer> pairRDD2 = RDD2.mapToPair(w -> new Tuple2<>(w, 2));
        System.out.println(pairRDD2.collect());  // [(b,2), (c,2), (a,2)]
    
        JavaPairRDD<String, Tuple2<Integer, Integer>> joinRDD = pairRDD1.join(pairRDD2);
        System.out.println(joinRDD.collect());  // 结果 [(a,(1,2)), (b,(1,2)), (c,(1,2))]
    }
```

```java
// 如果两个数据源中的key没有匹配上，那么数据不会出现在结果中
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("join").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<String> RDD1 = sparkContext.parallelize(Arrays.asList("a","b","c"));
        JavaRDD<String> RDD2 = sparkContext.parallelize(Arrays.asList("d","c","a"));
        JavaPairRDD<String, Integer> pairRDD1 = RDD1.mapToPair(w -> new Tuple2<>(w, 1));
        System.out.println(pairRDD1.collect());  // [(a,1), (b,1), (c,1)]
        JavaPairRDD<String, Integer> pairRDD2 = RDD2.mapToPair(w -> new Tuple2<>(w, 2));
        System.out.println(pairRDD2.collect());  // [(d,2), (c,2), (a,2)]
        
        JavaPairRDD<String, Tuple2<Integer, Integer>> joinRDD = pairRDD1.join(pairRDD2);
        System.out.println(joinRDD.collect());  // 结果 [(a,(1,2)), (c,(1,2))]
    } 

```

```java
 // 如果两个数据源中有多个相同的key，会依次匹配
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("join").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
    
        JavaRDD<String> RDD1 = sparkContext.parallelize(Arrays.asList("a","b","c"));
        JavaRDD<String> RDD2 = sparkContext.parallelize(Arrays.asList("a","b","a"));
        JavaPairRDD<String, Integer> pairRDD1 = RDD1.mapToPair(w -> new Tuple2<>(w, 1));
        System.out.println(pairRDD1.collect());  // [(a,1), (b,1), (c,1)]
        JavaPairRDD<String, Integer> pairRDD2 = RDD2.mapToPair(w -> new Tuple2<>(w, 2));
        System.out.println(pairRDD2.collect());  // [(a,2), (b,2), (a,2)]
        
        JavaPairRDD<String, Tuple2<Integer, Integer>> joinRDD = pairRDD1.join(pairRDD2);
        System.out.println(joinRDD.collect());  // 结果 [(a,(1,2)), (a,(1,2)), (b,(1,2))]
    }
```



##### 33）leftOuterJoin

**方法签名**

```java
public <W> JavaPairRDD<K, Tuple2<V, Optional<W>>> leftOuterJoin(final JavaPairRDD<K, W> other)

public <W> JavaPairRDD<K, Tuple2<V, Optional<W>>> leftOuterJoin(final JavaPairRDD<K, W> other, final int numPartitions)

public <W> JavaPairRDD<K, Tuple2<V, Optional<W>>> leftOuterJoin(final JavaPairRDD<K, W> other, final Partitioner partitioner)
```

**方法说明**

-   类似于SQL语句的左外连接

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("leftOuterJoin").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
       
        JavaRDD<String> RDD1 = sparkContext.parallelize(Arrays.asList("a","b","c"));
        JavaRDD<String> RDD2 = sparkContext.parallelize(Arrays.asList("b","a"));
        JavaPairRDD<String, Integer> pairRDD1 = RDD1.mapToPair(w -> new Tuple2<>(w, 1));
        System.out.println(pairRDD1.collect());  // [(a,1), (b,1), (c,1)]
        JavaPairRDD<String, Integer> pairRDD2 = RDD2.mapToPair(w -> new Tuple2<>(w, 2));
        System.out.println(pairRDD2.collect());  // [(b,2), (a,2)]
    
        JavaPairRDD<String, Tuple2<Integer, Optional<Integer>>> leftOuterJoinRDD = pairRDD1.leftOuterJoin(pairRDD2);
        System.out.println(leftOuterJoinRDD.collect());
        // 结果 [(a,(1,Optional[2])), (b,(1,Optional[2])), (c,(1,Optional.empty))]
    }
```

#####  34）rightOuterJoin

**方法签名**

```java
public <W> JavaPairRDD<K, Tuple2<Optional<V>, W>> rightOuterJoin(final JavaPairRDD<K, W> other)

public <W> JavaPairRDD<K, Tuple2<Optional<V>, W>> rightOuterJoin(final JavaPairRDD<K, W> other, final int numPartitions)

public <W> JavaPairRDD<K, Tuple2<Optional<V>, W>> rightOuterJoin(final JavaPairRDD<K, W> other, final Partitioner partitioner) 
```

**方法说明**

-   类似与SQL的右外连接

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("rightOuterJoin").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
     
        JavaRDD<String> RDD1 = sparkContext.parallelize(Arrays.asList("b","a"));
        JavaRDD<String> RDD2 = sparkContext.parallelize(Arrays.asList("a","b","c"));
        JavaPairRDD<String, Integer> pairRDD1 = RDD1.mapToPair(w -> new Tuple2<>(w, 1));
        System.out.println(pairRDD1.collect());  // [(b,1), (a,1)]
        JavaPairRDD<String, Integer> pairRDD2 = RDD2.mapToPair(w -> new Tuple2<>(w, 2));
        System.out.println(pairRDD2.collect());  // [(a,2), (b,2), (c,2)]

        JavaPairRDD<String, Tuple2<Optional<Integer>, Integer>> rightOuterJoinRDD = pairRDD1.rightOuterJoin(pairRDD2);
        System.out.println(rightOuterJoinRDD.collect());
        // 结果 [(a,(Optional[1],2)), (b,(Optional[1],2)), (c,(Optional.empty,2))]
    }
```



##### 35）cogroup

**方法签名**

```java
public <W> JavaPairRDD<K, Tuple2<Iterable<V>, Iterable<W>>> cogroup(final JavaPairRDD<K, W> other)

public <W> JavaPairRDD<K, Tuple2<Iterable<V>, Iterable<W>>> cogroup(final JavaPairRDD<K, W> other, final int numPartitions)

public <W> JavaPairRDD<K, Tuple2<Iterable<V>, Iterable<W>>> cogroup(final JavaPairRDD<K, W> other, final Partitioner partitioner)

public <W1, W2> JavaPairRDD<K, Tuple3<Iterable<V>, Iterable<W1>, Iterable<W2>>> cogroup(final JavaPairRDD<K, W1> other1, final JavaPairRDD<K, W2> other2)

public <W1, W2> JavaPairRDD<K, Tuple3<Iterable<V>, Iterable<W1>, Iterable<W2>>> cogroup(final JavaPairRDD<K, W1> other1, final JavaPairRDD<K, W2> other2, final int numPartitions)

public <W1, W2, W3> JavaPairRDD<K, Tuple4<Iterable<V>, Iterable<W1>, Iterable<W2>, Iterable<W3>>> cogroup(final JavaPairRDD<K, W1> other1, final JavaPairRDD<K, W2> other2, final JavaPairRDD<K, W3> other3)

public <W1, W2, W3> JavaPairRDD<K, Tuple4<Iterable<V>, Iterable<W1>, Iterable<W2>, Iterable<W3>>> cogroup(final JavaPairRDD<K, W1> other1, final JavaPairRDD<K, W2> other2, final JavaPairRDD<K, W3> other3, final int numPartitions)

public <W1, W2, W3> JavaPairRDD<K, Tuple4<Iterable<V>, Iterable<W1>, Iterable<W2>, Iterable<W3>>> cogroup(final JavaPairRDD<K, W1> other1, final JavaPairRDD<K, W2> other2, final JavaPairRDD<K, W3> other3, final Partitioner partitioner)

public <W1, W2> JavaPairRDD<K, Tuple3<Iterable<V>, Iterable<W1>, Iterable<W2>>> cogroup(final JavaPairRDD<K, W1> other1, final JavaPairRDD<K, W2> other2, final Partitioner partitioner)
```

**方法说明**

-   cogroup可以简单理解为 connect + group
-   当对类型为(K, V)和(K, W)的数据集调用时，返回(K， (Iterable<V>， Iterable<W>)元组的数据集。此操作也称为groupwith。
-   提高操作分组必须是一个**对偶元组**才可以


```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("cogroup").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<String> RDD1 = sparkContext.parallelize(Arrays.asList("a","b","c"));
        JavaRDD<String> RDD2 = sparkContext.parallelize(Arrays.asList("b","c","a"));
        JavaPairRDD<String, Integer> pairRDD1 = RDD1.mapToPair(w -> new Tuple2<>(w, 1));
        System.out.println(pairRDD1.collect());  // [(a,1), (b,1), (c,1)]
        JavaPairRDD<String, Integer> pairRDD2 = RDD2.mapToPair(w -> new Tuple2<>(w, 2));
        System.out.println(pairRDD2.collect());  // [(b,2), (c,2), (a,2)]
        JavaPairRDD<String, Tuple2<Iterable<Integer>, Iterable<Integer>>> cogroupRDD =pairRDD1.cogroup(pairRDD2);
        System.out.println(cogroupRDD.collect());  // 结果 [(a,([1],[2])), (b,([1],[2])), (c,([1],[2]))]
    }
```

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("cogroup").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        sparkContext.setLogLevel("error");
        JavaRDD<String> RDD1 = sparkContext.parallelize(Arrays.asList("a","b","c"));
        JavaRDD<String> RDD2 = sparkContext.parallelize(Arrays.asList("b","a"));
        JavaPairRDD<String, Integer> pairRDD1 = RDD1.mapToPair(w -> new Tuple2<>(w, 1));
        System.out.println(pairRDD1.collect());  // [(a,1), (b,1), (c,1)]
        JavaPairRDD<String, Integer> pairRDD2 = RDD2.mapToPair(w -> new Tuple2<>(w, 2));
        System.out.println(pairRDD2.collect());  // [(b,2), (a,2)]
        JavaPairRDD<String, Tuple2<Iterable<Integer>, Iterable<Integer>>> cogroupRDD =pairRDD1.cogroup(pairRDD2);
        System.out.println(cogroupRDD.collect());  // 结果 [(a,([1],[2])), (b,([1],[2])), (c,([1],[]))]
    }
```

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("cogroup").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        sparkContext.setLogLevel("error");
        JavaRDD<String> RDD1 = sparkContext.parallelize(Arrays.asList("a","b","c"));
        JavaRDD<String> RDD2 = sparkContext.parallelize(Arrays.asList("b","a","a"));
        JavaPairRDD<String, Integer> pairRDD1 = RDD1.mapToPair(w -> new Tuple2<>(w, 1));
        System.out.println(pairRDD1.collect());  // [(a,1), (b,1), (c,1)]
        JavaPairRDD<String, Integer> pairRDD2 = RDD2.mapToPair(w -> new Tuple2<>(w, 2));
        System.out.println(pairRDD2.collect());  // [(b,2), (a,2), (a,2)]
        JavaPairRDD<String, Tuple2<Iterable<Integer>, Iterable<Integer>>> cogroupRDD =pairRDD1.cogroup(pairRDD2);
        System.out.println(cogroupRDD.collect());  // 结果 [(a,([1],[2, 2])), (b,([1],[2])), (c,([1],[]))]
    }
```



##### 36）repartitionAndSortWithinPartitions（宽）

**方法签名**

```java
public JavaPairRDD<K, V> repartitionAndSortWithinPartitions(final Partitioner partitioner)

public JavaPairRDD<K, V> repartitionAndSortWithinPartitions(final Partitioner partitioner, final Comparator<K> comp) 
    
// 该算子默认是按照key升序
// Comparator<K> comp 表示自定义排序规则
```

**方法说明**

-   repartitionAndSortWithinPartitions 是 reparation 的一个变种
-   该算子相当于是对集合进行**分区且排序**，这个算子只能对对偶（二）元组使用
-   会根据 key 的值进行排序，因为方法底层实现进行排序操作
-   如果**需要在分区之后排序**，就可以使用这个算子完成
-   如果有一个需求，想先按照某种规则分区，分区以后再排序的话，使用 repartition() 与 sortByKey() 算子完成不了该需求，因为如果先使用 repartition() 分区以后，想对分区以后的数据进行sortByKey() 排序，sortByKey() 算子存在shuffle ，会打乱分区以后的数据，所以此时可用改用 repartitionAndSortWithinPartitions 算子完成

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("repartitionAndSortWithinPartitions").setMaster("local[*]");
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        jsc.setLogLevel("WARN");
        JavaPairRDD javaPairRDD = jsc.parallelizePairs(
                Arrays.asList(
                        new Tuple2("e", 5),
                        new Tuple2<>("c", 3),
                        new Tuple2<>("d", 4),
                        new Tuple2<>("a", 2),
                        new Tuple2<>("b", 1)));
        JavaPairRDD result = javaPairRDD.repartitionAndSortWithinPartitions(new HashPartitioner(2));
        System.out.println(result.toDebugString());
        result.mapPartitionsWithIndex(new Function2<Integer, Iterator, Iterator>() {
            @Override
            public Iterator call(Integer index, Iterator v2) throws Exception {
                List<Integer> list = new ArrayList<>();  // 无意义的集合
                while (v2.hasNext()){
                    System.out.println("分区: " + index+ "value: "+v2.next() );
                    list.add(index);
                }
                return list.iterator();
            }
        },false).collect();
    }
```

结果

```diff
(2) ShuffledRDD[1] at repartitionAndSortWithinPartitions at SparkRDD_repartitionAndSortwithinPartitions.java:25 []
 +-(16) ParallelCollectionRDD[0] at parallelizePairs at SparkRDD_repartitionAndSortwithinPartitions.java:18 []
分区: 0value: (b,1)
分区: 1value: (a,2)
分区: 0value: (d,4)
分区: 1value: (c,3)
分区: 1value: (e,5)
```



##### 37）keys（窄）获取k-v中的k

**方法签名**

```java
public JavaRDD<K> keys()
```

**方法说明**

-   用于从一个键值对 RDD 中提取出所有的key，返回一个只包含key的 RDD。
-   `keys` 算子常用于需要对 RDD 中的键进行操作的场景，例如对键进行去重、排序、分组等操作。

```java
 public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("keys").setMaster("local");
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        jsc.setLogLevel("WARN");
        JavaPairRDD<String, String> pairRDD = jsc.parallelizePairs(
                Arrays.asList(
                        new Tuple2<>("a", "1 2"),
                        new Tuple2<>("b", "3 4"),
                        new Tuple2<>("c", "5 6")
                ));

        JavaRDD<String> keys = pairRDD.keys();
        System.out.println(keys.toDebugString());
        System.out.println(keys.collect());
    }
```

结果

```diff
(1) MapPartitionsRDD[1] at keys at SparkRDD_keys.java:24 []
 |  ParallelCollectionRDD[0] at parallelizePairs at SparkRDD_keys.java:17 []
[a, b, c]
```

##### 38）values（窄）获取k-v中的v

**方法签名**

```
public JavaRDD<V> values()
```

**方法说明**

-   获取对偶元组RDD中的所有value值

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("values").setMaster("local");
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        jsc.setLogLevel("WARN");
        JavaPairRDD<String, String> pairRDD = jsc.parallelizePairs(
                Arrays.asList(
                        new Tuple2<>("a", "1 2"),
                        new Tuple2<>("b", "3 4"),
                        new Tuple2<>("c", "5 6")
                ));

        JavaRDD<String> values = pairRDD.values();
        System.out.println(values.toDebugString());
        System.out.println(values.collect());
    }
```

结果

```diff
(1) MapPartitionsRDD[1] at values at SparkRDD_values.java:23 []
 |  ParallelCollectionRDD[0] at parallelizePairs at SparkRDD_values.java:16 []
[1 2, 3 4, 5 6]
```







### 行动算子 Action

行动算子主要是将在数据集上运行计算后的数值返回到驱动程序，从而**触发真正的计算**（惰性执行）。

简单来说，**行动就是触发任务的调度和作业的执行**

#### 1）reduce

**方法签名**

```java
public T reduce(final Function2<T, T, T> f)
```

**方法说明**

-   聚集RDD中的所有元素，先聚合分区内数据，再聚合分区间数据（**两两聚合**）
-   reduce算子接收一个函数作为参数，这个函数接收两个参数，返回一个值，用于将RDD中的元素**两两聚合**。reduce算子会将RDD中的元素两两聚合，**直到最后只剩下一个元素，这个元素就是reduce算子的返回值**。
-   reduce算子可以用于对RDD中的元素进行任何类型的聚合操作，例如求最大值、最小值、平均值等等。
-   在reduce算子的过程中，每次聚合操作都会将两个元素合并成一个新的元素，直到最后只剩下一个元素。因此，**最后一个元素也会参与运算，只不过它是最终的结果**

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("reduce").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 5));
        Integer reduce = RDD.reduce(new Function2<Integer, Integer, Integer>() {
            @Override
            public Integer call(Integer v1, Integer v2) throws Exception {
                System.out.println("当前v1为" + v1 + "，当前v2为 " + v2);
                return v1 + v2;
            }
        });
        System.out.println(reduce);
    }
```

结果（元素 1 2 为同一分区，元素 3 5 为同一分区，因此先聚合了分区内数据，再聚合分区间的数据）

```
当前v1为1，当前v2为 2
当前v1为3，当前v2为 5
当前v1为8，当前v2为 3
11
```



#### 2）collect 采集

**方法签名**

```java
public List<T> collect()
```

**方法说明**

-   在驱动程序（Driver）中，以集合 List 的形式返回数据集的所有元素
-   collect方法会将不同分区的数据**按照分区顺序采集到Driver端内存中**，形成数组
-   **结果会被收集到 Driver 端的内存中**
-   使用collect算子，必须实现序列化，因为涉及到了executor端到Driver端

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("collect").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        List<String> data = Arrays.asList("5", "1", "1", "3");
        JavaRDD<String> RDD = sparkContext.parallelize(data);
        List<String> collect = RDD.collect();
        System.out.println(collect);  // [5, 1, 1, 3]
    }
```



#### 3）collectAsMap

**方法签名**

```java
public Map<K, V> collectAsMap() 
```

**方法说明**

-   将RDD中的对偶元组转换为一个Map集合

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("collectAsMap").setMaster("local");
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        jsc.setLogLevel("WARN");
        JavaPairRDD<String, String> pairRDD = jsc.parallelizePairs(
                Arrays.asList(
                        new Tuple2<>("a", "1 2"),
                        new Tuple2<>("b", "3 4"),
                        new Tuple2<>("c", "5 6")
                ));

        Map<String, String> map = pairRDD.collectAsMap();
        System.out.println(map);
    }
```

结果

```
{a=1 2, b=3 4, c=5 6}
```



#### 4）count

**方法签名**

```java
public long count()
```

**方法说明**

-   返回RDD中元素的个数，会在结果计算完后回收到 Driver 端

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("reduce").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 5));
        long count = RDD.count();
        System.out.println(count);  // 4
    }
```



#### 5）top

**方法签名**

```java
public List<T> top(final int num)
public List<T> top(final int num, final Comparator<T> comp)

// top算子返回num个数据，会将数据先进行排序，再返回（默认降序）
// Comparator<T> comp 可以调整它的排序规则   
```

**方法说明**

-   返回num个数据，但是top会针对数据提供排序的操作（**默认降序**）
-   top算子的返回值是数组

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("top").setMaster("local[*]");
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        jsc.setLogLevel("WARN");
        JavaRDD<Integer> RDD = jsc.parallelize(Arrays.asList(2,5,4,7,8,3),2);
        List<Integer> top = RDD.top(2);
        System.out.println(top);
    }
```

结果

```diff
[8, 7]
```



#### 6）first

**方法签名**

```java
public T first()
```

**方法说明**

-   返回RDD中的第一个元素，效果等同于 take(1)

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("first").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 5));
        Integer first = RDD.first();  // 获取数据源中数据的第一个
        System.out.println(first);  // 1
    }
```



#### 7）take

**方法签名**

```java
public List<T> take(final int num)
```

**方法说明**

-   返回一个由RDD的前n个元素组成的数组

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("take").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 5));
        List<Integer> take = RDD.take(2);  // 获取N个数据
        System.out.println(take);  // [1, 2]
    }
```

**注意**

​	在 Java 中，`take` 算子返回的是一个 `List`，而 `List` 是 Java 集合框架中的一种数据结构，不是 Spark 中的 RDD。因此，对于 `take` 算子返回的 `List`，不能直接使用 RDD 上的转换算子，如 `map`、`filter` 等。

​	如果需要对 `take` 算子返回的 `List` 进行进一步的操作，可以将其转换成 Java 中的流（Stream）或者使用 Java 8 中的 Lambda 表达式进行操作。例如，可以使用 `stream()` 方法将 `List` 转换成流，然后使用流的 `map`、`filter` 等方法进行操作。

如下所示

```java
List<Integer> list = rdd.take(10);
List<Integer> result = list.stream()
                            .map(x -> x * 2)
                            .filter(x -> x > 10)
                            .collect(Collectors.toList());
```



#### 8）takeOrdered

**方法签名**

```java
public List<T> takeOrdered(final int num)

public List<T> takeOrdered(final int num, final Comparator<T> comp)
```

**方法说明**

-   返回该RDD**排序后的前n个元素组成的数组**

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("takeOrdered").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<String> RDD = sparkContext.parallelize(Arrays.asList("hello_2", "spark_1", "hadoop_3"));
        JavaRDD<String> sortByRDD = RDD.sortBy(new Function<String, String>() {
            @Override
            public String call(String v1) throws Exception {
                // 根据 _后面的数字排序
                return v1.split("_")[1];
            }
        }, false, 1);
        List<String> list = sortByRDD.takeOrdered(2);  // 数据排序后，取N个数据
        System.out.println(list);  // [hadoop_3, hello_2]
    }
```



#### 9）takeSample

**方法签名**

```java
public List<T> takeSample(final boolean withReplacement, final int num)

public List<T> takeSample(final boolean withReplacement, final int num, final long seed)
    
// 参数说明
// withReplacement 表示采样数据是否放回 true表放回 false表不放回
// num 表示采用数据的个数
// seed 表示随机种子
```

**方法说明**

-   takeSample方法返回一个数组，在数据集中**随机采样 num 个元素**组成。
-   takeSample方法类似于sample函数，该函数接受三个参数
    -   第一个参数withReplacement ，**表示采样是否放回**，true表示有放回的采样，false表示无放回采样；
    -   第二个参数num，表示返回的采样数据的个数，这个也是takeSample方法和sample方法的区别；
    -   第三个参数seed，表示用于指定的随机数生成器种子。
    -   另外，takeSample方法**先是计算fraction，也就是采样比例**，**然后调用sample方法进行采样**，并对采样后的数据进行**collect()**，**最后调用take()方法**返回num个元素。注意，如果采样个数大于RDD的元素个数，且选择的无放回采样，则返回RDD的元素的个数。

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("takeSample").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 5));

        List<Integer> list = RDD.takeSample(false,2);
        System.out.println(list);  // [3, 2]
    }
```



#### 10）aggregate

**方法签名**

```java
public <U> U aggregate(final U zeroValue,
                       final Function2<U, T, U> seqOp,
                       final Function2<U, U, U> combOp)
    
// 其中
// zeroValue是初始值
// seqOp是一个函数，用于将每个元素加到中间值上
// combOp是一个函数，用于将多个中间值相加。
// 在聚合过程中，Spark会将RDD中的元素分成多个分区，然后在每个分区内部进行聚合操作，最后将各个分区的聚合结果再进行一次聚合，得到最终的结果。
  
// 参数说明
// seqOp 表示分区内计算规则
// combOp 表示分区间计算规则  
```

**方法说明**

-   分区的数据通过**初始值**和分区内的数据进行聚合，然后再和**初始值**进行分区间的数据聚合
-   aggregate算子是Spark中的一个转换算子，它可以对RDD中的元素进行聚合操作，并返回一个聚合后的结果。
-   aggregate函数将每个分区里面的元素进行聚合，然后用combine函数将每个分区的结果和初始值(zeroValue)进行combine操作。 这个函数最终返回U的类型不需要和RDD的T中元素类型一致。 这样，我们需要一个函数将T中元素合并到U中，另一个函数将两个U进行合并。 其中，参数1是初值元素；参数2是seq函数是与初值进行比较；参数3是comb函数是进行合并 。  注意：如果没有指定分区，aggregate是计算每个分区的，空值则用初始值替换。
    

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("aggregate").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 5), 2);
		
        Integer aggregate = RDD.aggregate(
                // 初始值
                0,
                // 分区内计算规则
                new Function2<Integer, Integer, Integer>() {
                    @Override
                    public Integer call(Integer v1, Integer v2) throws Exception {
                        return v1 + v2;
                    }
                },
                // 分区间计算规则
                new Function2<Integer, Integer, Integer>() {
                    @Override
                    public Integer call(Integer v1, Integer v2) throws Exception {
                        return v1 + v2;
                    }
                });
        // (1+2)+(3+5) = 11
        System.out.println(aggregate);  // 11
    }
```

**aggregate与aggregateByKey的区别**

-   aggregateByKey：初始值只会参与分区内的计算

-   aggregate：初始值会参与分区内的计算，并且还参与分区将的计算



#### 10）fold

**方法签名**

```java
public T fold(final T zeroValue, final Function2<T, T, T> f)
```

**方法说明**

-   **fold是aggregate的简化**，**将aggregate中的seqOp和combOp使用同一个函数op**。
-   fold 的分区内和分区间计算逻辑都是一样的

-    从源码中可以看出，先是将zeroValue赋值给jobResult，然后针对每个分区利用op函数与zeroValue进行计算，再利用op函数将taskResult和jobResult合并计算， 同时更新jobResult，最后，将jobResult的结果返回。

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("fold").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 5), 2);

        Integer foldRDD = RDD.fold(
                // 初始值
                0,
                new Function2<Integer, Integer, Integer>() {
                    @Override
                    public Integer call(Integer v1, Integer v2) throws Exception {
                        return v1 + v2;
                    }
                });
        sparkContext.stop();
        // (1+2)+(3+5) = 11
        System.out.println(foldRDD);  // 11
    }
```



#### 11）countByKey

**方法签名**

```java
public Map<K, Long> countByKey()
```

**方法说明**

-   作用在KV类型的RDD上，统计每种key的个数，返回一个Map集合

-   原理是：先是进行map操作转化为(key,1)键值对，再进行reduce聚合操作，最后利用collect函数将数据加载到driver，并转化为map类型。

    ```
    Scala源码体现
    要处理非常大的结果,请考虑使用 rdd.mapValue(_ => 1L).reduceByKey(_ + _),返回一个 RDD[T,Long]
    代替一个map
    ```

-   countByKey操作**将数据全部加载到driver端的内存，如果数据量比较大，可能出现OOM**。

该算子的Scala源码

```scala
def countByKey(): Map[K,Long] = self.withScope{
	self.mapValues(_ => 1L).reduceBykey(_ + _).collect().toMap
}
```

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("countByKey").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        JavaPairRDD<String, Integer> RDD = sparkContext.parallelizePairs(Arrays.asList(
                new Tuple2("a", 2),
                new Tuple2("a", 3),
                new Tuple2("b", 4),
                new Tuple2("b", 5),
                new Tuple2("b", 6),
                new Tuple2("c", 7)
        ));
       /**
         * public Map<K, Long> countByKey()
         * 作用在kv类型的RDD上，根据key相同的元素计数，返回Map集合
         * todo 注意源码，集合数据将返回driver端需要注意大小，如果太大，可能会造成OOM。可以考虑继续以RDD的形式处理
         */
        Map<String, Long> map = RDD.countByKey();
        for (Map.Entry<String, Long> entry : map.entrySet()) {
            System.out.println("当前的key为" + entry.getKey() + " ，当前的value为 " + entry.getValue());
        }
        sparkContext.stop();

    }
```

结果

```
当前的key为a ，当前的value为 2
当前的key为b ，当前的value为 3
当前的key为c ，当前的value为 1
```



#### 12）countByValue

**方法签名**

```java
public Map<T, Long> countByValue()
```

**方法说明**

-   根据数据集每个元素相同的内容来计数，返回相同内的的元素对应的条数


```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("countByValue").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        JavaPairRDD<String, Integer> RDD = sparkContext.parallelizePairs(Arrays.asList(
                new Tuple2("a", 2),
                new Tuple2("a", 3),
                new Tuple2("b", 4),
                new Tuple2("b", 4),
                new Tuple2("b", 6),
                new Tuple2("c", 7)
        ));
        /**
         * public Map<T, Long> countByValue()
         * 当前的value描述的是完整的pair
         */
        Map<Tuple2<String, Integer>, Long> map = RDD.countByValue();
        for (Map.Entry<Tuple2<String, Integer>, Long> entry : map.entrySet()) {
            System.out.println("当前的key为" + entry.getKey() + " ，当前的value为 " + entry.getValue());
        }
        sparkContext.stop();
    }
```

结果

```
当前的key为(b,4) ，当前的value为 2
当前的key为(a,2) ，当前的value为 1
当前的key为(c,7) ，当前的value为 1
当前的key为(b,6) ，当前的value为 1
当前的key为(a,3) ，当前的value为 1
```

#### **countByKey 与 countByValue 的区别**

countByKey 和 countByValue都是对RDD中的元素进行统计，前者必须是键值对RDD，根据键统计。后者直接统计值



#### 13）save相关算子

**saveAsTextFile**

**saveAsObjectFile**

```java
// saveAsTextFile  保存成Text文件
public void saveAsTextFile(final String path)

public void saveAsTextFile(final String path, final Class<? extends CompressionCodec> codec)
// 将数据集的元素作为文本文件(或文本文件集)写入本地文件系统、HDFS或任何其他hadoop支持的文件系统的给定目录中。Spark将对每个元素调用toString，将其转换为文件中的一行文本。    
    
// saveAsObjectFile  序列化成对象保存到文件
public void saveAsObjectFile(final String path) 
    
// saveAsSequenceFile  保存成SequenceFile文件  此方法要求数据格式必须为 K-V 类型

// 注意：在Java中保存 SequenceFile 文件比较复杂，因为JavaPairRDD上没有提供saveAsSequenceFile算子。所以我们要使用Spark保存自定义Hadoop格式的功能来实现。   
```

**方法说明**

-   saveAsTextFile用于将RDD以文本文件的格式存储到文件系统中。

-   从源码中可以看到，**saveAsTextFile函数是依赖于saveAsHadoopFile函数**，由于saveAsHadoopFile函数接受PairRDD，所以在saveAsTextFile函数中利用rddToPairRDDFunctions函数转化为(NullWritable,Text)类型的RDD，然后通过saveAsHadoopFile函数实现相应的写操作。
-   saveAsObjectFile用于将RDD中的元素序列化成对象，存储到文件中。

-   从源码中可以看出，saveAsObjectFile函数是依赖于saveAsSequenceFile函数实现的，将RDD转化为类型为

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("save").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1, 2, 3, 4));
        RDD.saveAsTextFile("file:///opt/out");
        RDD.saveAsObjectFile("file:///opt/out");
    }
```



#### 14）foreach

**方法签名**

```java
public void foreach(final VoidFunction<T> f)
```

**方法说明**

-   **分布式遍历**RDD中的每一个元素，调用指定函数（即运行相应的逻辑）

-   foreach用于遍历RDD,将函数f应用于每一个元素。


```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("foreach").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1,2,3,4));
        sparkContext.setLogLevel("ERROR");
        // foreach 其实是Driver端内存集合的循环遍历方法
        RDD.collect().forEach(new Consumer<Integer>() {
            @Override
            public void accept(Integer integer) {
                System.out.println(integer);
            }
        });
        System.out.println("---------------------");
        // foreach 其实是Executor端内存数据打印
         RDD.foreach(s -> System.out.println(s));
    }
```

结果

```
1
2
3
4
---------------------
2
1
3
4

```



#### 15）foreachPartition

**方法签名**

```java
public void foreachPartition(final VoidFunction<Iterator<T>> f)
```

**方法说明**

-   foreachPartition和foreach类似，只不过是对每一个分区使用f

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("foreachPartition").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        sparkContext.setLogLevel("ERROR");
        JavaRDD<Integer> javaRDD = sparkContext.parallelize(Arrays.asList(5, 1, 1, 4, 4, 2, 2), 3);

        javaRDD.foreach(new VoidFunction<Integer>() {
            @Override
            public void call(Integer integer) throws Exception {
                System.out.println("___________begin_______________");

                System.out.print(integer + "     ");
                System.out.println("\n___________end_________________");
            }
        });
        System.out.println("~~~~~~~~~~~~~~~~~~~~~~~");
        javaRDD.foreachPartition(new VoidFunction<Iterator<Integer>>() {
            @Override
            public void call(Iterator<Integer> integerIterator) throws Exception {
                System.out.println("___________begin_______________");
                while (integerIterator.hasNext())
                    System.out.print(integerIterator.next() + "      ");
                System.out.println("\n___________end_________________");
            }
        });
    }
```

结果如下（可以看到foreach是以每个元素打印的，foreachPartition是以每个分区打印的）

```java
___________begin_______________
___________begin_______________
___________begin_______________
1     

___________end_________________
4     

___________end_________________
___________begin_______________
2     

___________end_________________
___________begin_______________
2     

___________end_________________
___________begin_______________
4     

___________end_________________
5     

___________end_________________
___________begin_______________
1     

___________end_________________
~~~~~~~~~~~~~~~~~~~~~~~
___________begin_______________
___________begin_______________
1      4      
___________end_________________
5      ___________begin_______________
1      
___________end_________________
4      2      2      
___________end_________________
```



#### 16）lookup

# 17）treeAggregate



### 控制算子 

​	将RDD持久化，持久化单位是 **partition**

​	控制算子有三种 cache、persist、checkpoint。cache和 persist都是懒执行的。必须有action触发执行。**checkpoint算子不仅能将 RDD 持久化到磁盘，还能切断 RDD之间的依赖关系。**

简单记忆：cache、persist 算子主要是用于优化代码的、checkpoint算子是用来做容错的

#### 1）cache

**方法签名**

```java
public JavaPairRDD<K, V> cache()
```

**方法说明**

-   默认将 RDD 的数据持久化到内存中
-   cache是懒执行的
-   注意

```java
cache() = persist() = persist(StroageLevel.MEMORY_ONLY)
```



#### 2）persist

**方法签名**

```java
public JavaPairRDD<K, V> persist(final StorageLevel newLevel)
```

**方法说明**

可以指定持久化的级别。常用的是 DISK_ONLY 、  MEMORY_AND_DISK



####  cache与persist

 cache与persist的注意事项：

-    cache和persist 都是**懒执行**，必须有 action类算子触发执行

-    cache和persist 算子的返回值可以**赋值给变量**，在其他job 中直接**使用这个变量就是使用持久化的数据**了。持久化的单位是 partition(RDD组成)

-    cache和persist 算子之后不能紧跟 action算子



#### 3）checkpoint

**方法签名**

```java
public void checkpoint() 
```

**方法说明**

-   将RDD持久化到磁盘，还可以**切断 RDD之间的依赖关系**，也是懒执行
-   执行原理：
    -   当 RDD 的job执行完毕后，会从 finalRDD往前回溯
    -   当回溯到某一个RDD调用了checkpoint方法，会对当前RDD做一个标记
    -   spark框架会自动启动一个job，程序计算这个RDD的数据，将数据持久化到HDFS上

-   基于上述原理，所以我们**使用checkpoint是最好是对这个RDD进行cache**（优化的一种手段，避免这个RDD从头计算），这样新启动的job只需要将内存中的数据拷贝到 HDFS上，省去了重新计算这一步。

```java
SparkConf sparkConf = new SparkConf().setAppName("单词统计").setMaster("local");
JavaSparkContext sc = new JavaSparkContext(sparkConf);
// checkpoint的使用需要设置检查点路径(一般情况下为分布式存储系统：HDFS)
sc.setCheckpointDir("./checkpoint1");

JavaRDD<String> lineRDD = sparkContext.parallelize("/opt/temp/hello.txt");
JavaRDD<String> wordRDD = lineRDD.flatMap(s -> Arrays.asList(s.split(" ")).iterator());
JavaPairRDD<String, Integer> wordOneRDD = wordRDD.mapToPair(word -> new Tuple(word,1));

// 增加缓存,避免再重新跑一个job做checkpoint
wordOneRDD.cache();
wordOneRDD.checkpoint();

sparkContext.stop();
```



### RDD序列化

问题导出

foreach算子演示

```java
public class SparkRDD_foreach2 {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("foreach").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1,2,3,4));
        sparkContext.setLogLevel("ERROR");

        User user = new User();  // RDD算子外部的操作，由Driver端执行

        RDD.foreach(new VoidFunction<Integer>() {  // RDD算子，由Executor端执行
            @Override
            public void call(Integer integer) throws Exception {
                // Task not serializable
                // java.io.NotSerializableException: com.clear.rdd.action.User

                // 使用了外部的user.age，因此需要网络进行传输过来
                System.out.println(integer+ user.age);  
            }
        });
    }
}

class User{
    int age=30;
}
```

改进

```java
public class SparkRDD_foreach2 {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("foreach").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1,2,3,4));
        sparkContext.setLogLevel("ERROR");

        User user = new User();  // RDD算子外部的操作，由Driver端执行
        // RDD算子中传递的函数是会包含闭包操作，那么就会进行检测功能
        RDD.foreach(new VoidFunction<Integer>() {  // RDD算子，由Executor端执行
            @Override
            public void call(Integer integer) throws Exception {
                // Task not serializable
                // java.io.NotSerializableException: com.clear.rdd.action.User

                // 使用了外部的user.age，因此需要网络进行传输过来
                
                System.out.println(integer+ user.age);
            }
        });
    }
}
// 因为需要在网络中传输，所有User类需要实现Serializable接口
// 在scala中，样例类(在class 前面加上 case)在编译时，会自动混入序列化特质（实现可序列化接口）
class User implements Serializable {
    int age=30;
}
```

#### 1）闭包检查

​	从计算的角度, **算子以外的代码都是在Driver端执行, 算子里面的代码都是在Executor端执行**。那么在scala的函数式编程中，就会导致**算子内经常会用到算子外的数据**，这样就形成了闭包的效果，如果使用的算子外的数据无法序列化，就意味着无法传值给Executor端执行，就会发生错误，所以需要在执行任务计算前，检测闭包内的对象是否可以进行序列化，这个操作我们称之为**闭包检测**。**Scala2.12版本后闭包编译方式发生了改变**



#### 2）序列化方法和属性

​	**从计算的角度, 算子以外的代码都是在Driver端执行, 算子里面的代码都是在Executor端执行**，代码如下

```java
public class SparkRDD_Serializable {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("序列化");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        JavaRDD<String> RDD = sparkContext.parallelize(Arrays.asList("hello world", "hello spark","nhk"));

        // 查询有 h 的rdd
        Search search = new Search("h");
        // 方法传递，打印SparkException: Task not serializable
       // System.out.println(search.getMatch1(RDD).collect());
        // 属性传递，打印SparkException: Task not serializable
        System.out.println(search.getMatch2(RDD).collect());
        sparkContext.stop();
    }

}

// 查询对象
// 在Scala中，类构造参数其实是类的属性，构造参数需要进行闭包检查，其实就等同于类进行闭包检测
// 若未实现Serializable，则报错如下
// SparkException: Task not serializable
// object not serializable (class: com.clear.rdd.serial.Search, value: com.clear.rdd.serial.Search@2ab2710)
class Search implements Serializable {  // 实现序列化接口
    private String query;

    public Search(String query) {
        this.query = query;
    }

    public Boolean isMatch(String s) {
        return s.contains(query);
    }

    // 方法序列化案例
    public JavaRDD<String> getMatch1(JavaRDD<String> rdd) {
        return rdd.filter(this::isMatch);
    }

    // 属性序列化案例
    public JavaRDD<String> getMatch2(JavaRDD<String> rdd) {
        return rdd.filter(x -> x.contains(query));
    }
}
```



#### 3）Kryo序列化框架

​	Java的序列化能够序列化任何的类。但是**比较重**（字节多），序列化后，对象的提交也比较大。Spark出于性能的考虑，**Spark2.0开始支持另外一种Kryo序列化机制。Kryo速度是Serializable的10倍**。当RDD在Shuffle数据的时候，简单数据类型、数组和字符串类型已经在Spark内部使用Kryo来序列化。

​	Kryo 是一个快速、高效的 Java 序列化框架，适用于大规模数据的序列化和反序列化操作。**在 Spark 中，可以使用 Kryo 替代 Java 自带的序列化框架，提高性能**。

**注意：即使使用Kryo序列化，也要实现Serializable接口。**

```java
// 首先，需要在 SparkConf 中启用 Kryo 序列化器
// 用set方法替换默认的序列化机制
public SparkConf set(final String key, final String value)
// set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
    
// 使用 SparkConf对象的 registerKryoClasses 方法注册需要使用 Kryo 序列化的自定义类
public SparkConf registerKryoClasses(final Class<?>[] classes)
// registerKryoClasses(new Class[] { MyClass.class })
```

演示

```java
public class SparkRDD_serializable_Kryo {
    public static void main(String[] args) throws ClassNotFoundException {
        SparkConf sparkConf = new SparkConf()
                .setAppName("serializable_Kryo")
                .setMaster("local[*]")
                // 替换默认的序列化机制，启用 Kryo 序列化器
                .set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
                // 注册需要使用 Kryo 序列化的自定义类
                // 因为Spark需要知道哪些类需要使用 Kryo 进行序列化。如果需要序列化多个类，可以将它们一起注册。
                .registerKryoClasses(new Class[]{MyClass.class});
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<MyClass> rdd = sparkContext.parallelize(Arrays.asList(
                new MyClass(1, "foo"),
                new MyClass(2, "bar"),
                new MyClass(3, "baz")));

        List<MyClass> collect = rdd.collect();
        System.out.println(collect);
    }
}

// 定义一个需要序列化的类 MyClass
class MyClass implements Serializable {
    private int value;
    private String text;

    public MyClass(int value, String text) {
        this.value = value;
        this.text = text;
    }

    public int getValue() {
        return value;
    }

    public String getText() {
        return text;
    }
}
```

结果

因为，MyClass类没有实现toString方法

```
[com.clear.rdd.serial.MyClass@290aeb20, com.clear.rdd.serial.MyClass@73ad4ecc, com.clear.rdd.serial.MyClass@69da0b12]
```



### RDD lineage 依赖关系

-   相邻的两个RDD的关系称为**依赖关系**

-   新的RDD依赖于旧的RDD

-   多个连续的RDD的依赖关系，称之为**血缘关系**（在Maven中叫做间接依赖）

-   每个RDD都会保存血缘关系（lineage）

-   **RDD不会保存数据**

-   RDD为了提供容错性，需要将RDD间的关系保存下来

-   **一旦出现错误，可以根据血缘关系将数据源重新读取进行计算**

-   新的RDD的一个分区的数据依赖于旧的RDD的一个分区的数据，这称为**OneToOne依赖（即 窄依赖）**

```java
public class OneToOneDependency<T> extends NarrowDependency<T> 

public abstract class NarrowDependency<T> extends Dependency<T> 
```

-   新的RDD的一个分区的数据依赖于旧的RDD的多个分区的数据，这个称为**Shuffle依赖（即 宽依赖）**

```java
public class ShuffleDependency<K, V, C> extends Dependency<Product2<K, V>> implements Logging 

public abstract class Dependency<T> implements Serializable
```



#### 1）RDD 血缘关系

​	RDD只支持粗粒度转换，即在大量记录上执行的单个操作。将创建RDD的一系列Lineage（血统）记录下来，以便恢复丢失的分区。**RDD的Lineage会记录RDD的元数据信息和转换行为**，**当该RDD的部分分区数据丢失时，它可以根据这些信息来重新运算和恢复丢失的数据分区。**

```java
public class SparkRDD_Dependency {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("单词统计").setMaster("local");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        sparkContext.setLogLevel("ERROR");

        JavaRDD<String> lineRDD = sparkContext.parallelize(Arrays.asList("hello world", "hello spark"));
        System.out.println(lineRDD.toDebugString());
        System.out.println("----------------------------------");
        JavaRDD<String> wordRDD = lineRDD.flatMap(s -> Arrays.asList(s.split(" ")).iterator());
        System.out.println(wordRDD.toDebugString());
        System.out.println("----------------------------------");
        JavaPairRDD<String, Integer> wordOneRDD = wordRDD.mapToPair(word -> new Tuple2<>(word, 1));
        System.out.println(wordOneRDD.toDebugString());
        System.out.println("----------------------------------");
        JavaPairRDD<String, Integer> wordCountRDD = wordOneRDD.reduceByKey((x, y) -> x + y);
        System.out.println(wordCountRDD.toDebugString());
        System.out.println("----------------------------------");
        System.out.println(wordCountRDD.collect());
        sparkContext.close();
    }
}

```

结果（打印了RDD之间的学院关系）

正是因为每个RDD都会保存自己的血缘关系，一旦出现错误，可以根据血缘关系将数据源重新读取进行计算

```shell
(1) ParallelCollectionRDD[0] at parallelize at SparkRDD_Dependency.java:17 []
----------------------------------
(1) MapPartitionsRDD[1] at flatMap at SparkRDD_Dependency.java:20 []
 |  ParallelCollectionRDD[0] at parallelize at SparkRDD_Dependency.java:17 []
----------------------------------
(1) MapPartitionsRDD[2] at mapToPair at SparkRDD_Dependency.java:23 []
 |  MapPartitionsRDD[1] at flatMap at SparkRDD_Dependency.java:20 []
 |  ParallelCollectionRDD[0] at parallelize at SparkRDD_Dependency.java:17 []
----------------------------------
(1) ShuffledRDD[3] at reduceByKey at SparkRDD_Dependency.java:26 []
 +-(1) MapPartitionsRDD[2] at mapToPair at SparkRDD_Dependency.java:23 []
    |  MapPartitionsRDD[1] at flatMap at SparkRDD_Dependency.java:20 []
    |  ParallelCollectionRDD[0] at parallelize at SparkRDD_Dependency.java:17 []
----------------------------------
[(spark,1), (hello,2), (world,1)]

```

#### 2）RDD 依赖关系

这里所谓的依赖关系，其实就是**两个相邻RDD之间的关系**

```java

```



#### 3）RDD 窄依赖

窄依赖表示每一个父(上游)RDD的Partition**最多**被子（下游）RDD的一个Partition使用，窄依赖我们形象的比喻为独生子女。

大白话就是， **父RDD 和 子RDD** 的 partition 之间关系是**一对一**的。或者 **父RDD 和 子RDD** 的partition 关系是 **多对 一**的。**不会产生shuffle**。

```java
public class OneToOneDependency<T> extends NarrowDependency<T> 

public abstract class NarrowDependency<T> extends Dependency<T> 
```



#### 4）RDD 宽依赖

宽依赖表示同一个父（上游）RDD的Partition被多个子（下游）RDD的Partition依赖，**会引起Shuffle**，总结：宽依赖我们形象的比喻为多生。

大白话就是，**父RDD 和 子RDD** 的partition 之间的关系是 **一对多**的。**会产生shuffle**

```javascript
public class ShuffleDependency<K, V, C> extends Dependency<Product2<K, V>> implements Logging 

public abstract class Dependency<T> implements Serializable
```

小结：

​	所谓的**宽窄依赖，其实就是会影响 stage**



#### 5）RDD 阶段划分 stage划分

DAG（Directed Acyclic Graph）有向无环图是由点和线组成的拓扑图形，该图形具有方向，不会闭环。例如，DAG记录了RDD的转换过程和任务的阶段。

Spark 任务会**根据RDD之间的依赖关系**，**形成一个 DAG** 有向无环图，**DAG会提交给 DAGScheduler**（DGA调度器）。

DAGScheduler 会把 DAG 划分成相互依赖的多个 stage，**划分stage** 的**依据就是RDD 之间的 宽窄依赖**。遇到 宽依赖 就划分 stage，**每个stage 包含一个或多个 task任务**。然后将这些 **task 以taskSet 的形式提交给 TaskScheduler运行**

stage 是由一组并行的 task组成。



#### 6）RDD 阶段划分源码

下面是Scala部分源码

```scala
try {
  // New stage creation may throw an exception if, for example, jobs are run on a
  // HadoopRDD whose underlying HDFS files have been deleted.
  finalStage = createResultStage(finalRDD, func, partitions, jobId, callSite)
} catch {
  case e: Exception =>
    logWarning("Creating new stage failed due to exception - job: " + jobId, e)
    listener.jobFailed(e)
    return
}

……

private def createResultStage(
  rdd: RDD[_],
  func: (TaskContext, Iterator[_]) => _,
  partitions: Array[Int],
  jobId: Int,
  callSite: CallSite): ResultStage = {
val parents = getOrCreateParentStages(rdd, jobId)
val id = nextStageId.getAndIncrement()
val stage = new ResultStage(id, rdd, func, partitions, parents, jobId, callSite)
stageIdToStage(id) = stage
updateJobIdStageIdMaps(jobId, stage)
stage
}

……

private def getOrCreateParentStages(rdd: RDD[_], firstJobId: Int): List[Stage] = {
getShuffleDependencies(rdd).map { shuffleDep =>
  getOrCreateShuffleMapStage(shuffleDep, firstJobId)
}.toList
}

……

private[scheduler] def getShuffleDependencies(
  rdd: RDD[_]): HashSet[ShuffleDependency[_, _, _]] = {
val parents = new HashSet[ShuffleDependency[_, _, _]]
val visited = new HashSet[RDD[_]]
val waitingForVisit = new Stack[RDD[_]]
waitingForVisit.push(rdd)
while (waitingForVisit.nonEmpty) {
  val toVisit = waitingForVisit.pop()
  if (!visited(toVisit)) {
    visited += toVisit
    toVisit.dependencies.foreach {
      case shuffleDep: ShuffleDependency[_, _, _] =>
        parents += shuffleDep
      case dependency =>
        waitingForVisit.push(dependency.rdd)
    }
  }
}
parents
}
```

 

#### 7）stage 计算模式

pipeline 管道计算模式，pipeline 只是一种计算思想、模式

**注意：**

-   数据一直在管道里面什么时候数据会落地？
    -   对RDD进行**持久化**（cache、persist）
    -   **shuffle write** 的时候

-   **Stage 的 task 并行度**是由 stage 的**最后一个 RDD 的分区数**来决定的。

-   如何改变RDD的分区数？

例如：

```
reduceByKey(xxx,3)  groupByKey(4)   sc.textFile(path,numpartition)
```

**使用算子时传递** 分区**num**参数 就是分区 partition 的数量

-   验证 pipeline 计算模式

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("验证pipeline管道计算模式").setMaster("local[*]");
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        jsc.setLogLevel("ERROR");
        JavaRDD<Integer> rdd = jsc.parallelize(Arrays.asList(1, 2, 3));
        JavaRDD<Integer> rdd1 = rdd.map(x -> {
            System.out.println("map~~~~" + x);
            return x;
        });
        JavaRDD<Integer> rdd2 = rdd1.filter(x -> {
            System.out.println("filter~~~" + x);
            return true;
        });
        rdd2.collect();
        jsc.stop();
    }
```

结果如下（结果不是先执行完map，再执行完filter，所以验证了pipeline）

```
map~~~~1
map~~~~3
filter~~~1
filter~~~3
map~~~~2
filter~~~2
```



#### 8）RDD 任务划分

RDD任务切分中间分为：Application、Job、Stage 和 Task

-   Application：初始化一个SparkContext即生成一个Application；
-   Job：**一个Action算子**就会生成**一个Job**；
-   Stage：**Stage等于宽依赖(ShuffleDependency)的个数加1**；
-   Task：**一个Stage阶段中，最后一个RDD的分区个数就是Task的个数**。

注意：**Application->Job->Stage->Task每一层都是1对n的关系**。 



### RDD持久化

在Spark中，RDD是采用**惰性求值**的，即**每次调用行动算子时，都会从头开始计算**。然而，每次调用行动算子操作，都会触发一次从头开始的计算，这对于迭代计算来说，代价是很大的，因为迭代计算经常需要多次重复地使用同一组数据集，所以，**为了避免重复计算的开销，可以让spark对数据集进行持久化。**

#### 1）RDD cache\persist

​	RDD通过 **Cache()** 方法或者**Persist()** 方法将前面的计算结果缓存，**默认情况下会把数据以缓存在JVM的堆内存**中。但是并不是这两个方法被调用时立即缓存，而是**触发后面的action算子时，该RDD将会被缓存在计算节点的内存中，并供后面重用。**

```java
/**
 * 未使用缓存机制的情况下
 */
public class SparkRDD_persist {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("单词统计").setMaster("local");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        sparkContext.setLogLevel("ERROR");

        JavaRDD<String> lineRDD = sparkContext.parallelize(Arrays.asList("hello world", "hello spark"));
        JavaRDD<String> wordRDD = lineRDD.flatMap(s -> Arrays.asList(s.split(" ")).iterator());
        JavaPairRDD<String, Integer> wordOneRDD = wordRDD.mapToPair(word -> new Tuple2<>(word, 1));

        JavaPairRDD<String, Integer> wordCountRDD = wordOneRDD.reduceByKey((x, y) -> x + y);
        System.out.println(wordCountRDD.collect());
        System.out.println("----------------------------------");
		// 再次使用 wordOneRDD 
        JavaPairRDD<String, Iterable<Integer>> groupByKeyRDD = wordOneRDD.groupByKey();
        System.out.println(groupByKeyRDD.collect());
        sparkContext.stop();
    }
}
```

结果

```shell
[(spark,1), (hello,2), (world,1)]
----------------------------------
[(spark,[1]), (hello,[1, 1]), (world,[1])]
```

但是我们需要特别注意，我们知道**RDD中不会存储数据**，这意味着，我**们重复使用wordOneRDD 时，里面并没有存储数据，那么 wordOneRDD 会根据自己存储的血缘关系去重新获取数据，造成了我们在代码层面看似重用了这个RDD对象（wordOneRDD），但底层执行代码时并没有重用**

总结：

-   **RDD中不会存储数据**

-   **如果一个RDD需要重复使用，那么需要从头再次执行来获取数据**

-   **RDD的对象可以重用，但是数据无法重用**

为了验证RDD的对象可以重用，但是数据无法重用，我们在mapTopair算子中打印一下标记 ####

```java
/**
 * 未使用缓存机制的情况下
 */
public class SparkRDD_persist {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("单词统计").setMaster("local");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        sparkContext.setLogLevel("ERROR");

        JavaRDD<String> lineRDD = sparkContext.parallelize(Arrays.asList("hello world", "hello spark"));
        JavaRDD<String> wordRDD = lineRDD.flatMap(s -> Arrays.asList(s.split(" ")).iterator());
        JavaPairRDD<String, Integer> wordOneRDD = wordRDD.mapToPair(new PairFunction<String, String, Integer>() {
            @Override
            public Tuple2<String, Integer> call(String word) throws Exception {
                System.out.println("############");
                return new Tuple2<>(word, 1);
            }
        });
        JavaPairRDD<String, Integer> wordCountRDD = wordOneRDD.reduceByKey((x, y) -> x + y);
        System.out.println(wordCountRDD.collect());
        System.out.println("----------------------------------");
		// 再次使用 wordOneRDD 
        JavaPairRDD<String, Iterable<Integer>> groupByKeyRDD = wordOneRDD.groupByKey();
        System.out.println(groupByKeyRDD.collect());
        sparkContext.stop();
    }
}

```

结果（我们发现##### 打印了8次，这点就证明了再次使用 wordOneRDD（mapToPair算子的对象）时， wordOneRDD重新去获取了数据）

```shell
############
############
############
############
[(spark,1), (hello,2), (world,1)]
----------------------------------       
############
############
############
############
[(spark,[1]), (hello,[1, 1]), (world,[1])]
```



###### 存储级别

persist()方法的存储级别是通过 StorageLevel 对象（Scala、Java、Python）设置的。

cache()方法的存储级别是使用默认的存储级别（即 StorageLevel.MEMORY_ONLY()  将分序列化的对象存入内存 ）

| 存储级别                          | 使用的空间 | cpu时间 | 是否在内存中 | 是否在磁盘中 | 备注                                                         |
| --------------------------------- | ---------- | ------- | ------------ | ------------ | ------------------------------------------------------------ |
| MEMORY_ONLY                       | 高         | 低      | 是           | 否           | **默认存储级别**。将RDD作为反序列化的java对象，缓存在jvm中，若数据在内存中放不下（内存已满的情况下），则某些分区将不会被缓存（被丢弃），并且每次需要时都会重新计算 |
| MEMORY_ONLY_SER                   | 低         | 高      | 是           | 否           | 将RDD作为序列化的java对象（每个分区序列化为一个字节数组），**比反序列化的Java对象节省空间，但读取时，更占cpu** |
| MEMORY_AND_DISK                   | 高         | 中等    | 部分         | 部分         | 将RDD作为反序列化的java对象，缓存在jvm中，若数据在**内存中放不下**（内存已满的情况下），则将剩余分区**溢写到磁盘上**，并在需要时从磁盘上读取 |
| MEMORY_AND_DISK_SER               | 低         | 高      | 部分         | 部分         | 与MEMORY_ONLY_SER类似，但是当数据在**内存中放不下**（内存已满的情况下），则将剩余分区**溢写到磁盘上**。在内存中存放序列化后的数据 |
| DISK_ONLY                         | 低         | 高      | 否           | 是           | 仅将RDD分区的全部存储到磁盘上                                |
| MEMORY_ONLY_2   MEMORY_AND_DISK_2 |            |         |              |              | 与上面的级别相同。若**加上后缀 _2** ，代表的是**将每个持久化的数据都复制一份副本**，并将副本保存到其他节点上。 |
| OFF_HEAP                          |            |         |              |              | 与 MEMORY_ONLY_SER类似，但是将数据存储在堆外内存中（这需要启用堆外内存） |

部分源码如下

```java
public static final StorageLevel$ MODULE$ = new StorageLevel$();
    private static final StorageLevel NONE;
    private static final StorageLevel DISK_ONLY;
    private static final StorageLevel DISK_ONLY_2;
    private static final StorageLevel DISK_ONLY_3;
    private static final StorageLevel MEMORY_ONLY;
    private static final StorageLevel MEMORY_ONLY_2;
    private static final StorageLevel MEMORY_ONLY_SER;
    private static final StorageLevel MEMORY_ONLY_SER_2;
    private static final StorageLevel MEMORY_AND_DISK;
    private static final StorageLevel MEMORY_AND_DISK_2;
    private static final StorageLevel MEMORY_AND_DISK_SER;
    private static final StorageLevel MEMORY_AND_DISK_SER_2;
    private static final StorageLevel OFF_HEAP;
    private static final ConcurrentHashMap<StorageLevel, StorageLevel> storageLevelCache;
	
// 五个参数分别是 _useDisk _useMemory _useOffHeap _deserialized _replication
    static {
        NONE = new StorageLevel(false, false, false, false, MODULE$.org$apache$spark$storage$StorageLevel$$$lessinit$greater$default$5());
        DISK_ONLY = new StorageLevel(true, false, false, false, MODULE$.org$apache$spark$storage$StorageLevel$$$lessinit$greater$default$5());
        DISK_ONLY_2 = new StorageLevel(true, false, false, false, 2);
        DISK_ONLY_3 = new StorageLevel(true, false, false, false, 3);
        MEMORY_ONLY = new StorageLevel(false, true, false, true, MODULE$.org$apache$spark$storage$StorageLevel$$$lessinit$greater$default$5());
        MEMORY_ONLY_2 = new StorageLevel(false, true, false, true, 2);
        MEMORY_ONLY_SER = new StorageLevel(false, true, false, false, MODULE$.org$apache$spark$storage$StorageLevel$$$lessinit$greater$default$5());
        MEMORY_ONLY_SER_2 = new StorageLevel(false, true, false, false, 2);
        MEMORY_AND_DISK = new StorageLevel(true, true, false, true, MODULE$.org$apache$spark$storage$StorageLevel$$$lessinit$greater$default$5());
        MEMORY_AND_DISK_2 = new StorageLevel(true, true, false, true, 2);
        MEMORY_AND_DISK_SER = new StorageLevel(true, true, false, false, MODULE$.org$apache$spark$storage$StorageLevel$$$lessinit$greater$default$5());
        MEMORY_AND_DISK_SER_2 = new StorageLevel(true, true, false, false, 2);
        OFF_HEAP = new StorageLevel(true, true, true, false, 1);
        storageLevelCache = new ConcurrentHashMap();
    }
```

​	缓存有可能丢失，或者存储于内存的数据由于内存不足而被删除，RDD的**缓存容错机制**保证了即使缓存丢失也能保证计算的正确执行。通过基于RDD的一系列转换，丢失的数据会被重算，**由于RDD的各个Partition是相对独立的，因此只需要计算丢失的部分即可，并不需要重算全部Partition**。

-   **RDD对象的持久化操作不一定是为了重用**

-   **在数据执行较长，或数据比较重要的场合也可以采用持久化操作**

​	**Spark会自动对一些Shuffle操作的中间数据做持久化操作**(比如：reduceByKey)。这样做的目的是为了当一个节点Shuffle失败了避免重新计算整个输入。但是，**在实际使用的时候，如果想重用数据，仍然建议调用persist或cache。**

演示持久化

```java
/**
 * 使用缓存机制的情况下
 */
public class SparkRDD_persist2 {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("单词统计").setMaster("local");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        sparkContext.setLogLevel("ERROR");

        JavaRDD<String> lineRDD = sparkContext.parallelize(Arrays.asList("hello world", "hello spark"));
        JavaRDD<String> wordRDD = lineRDD.flatMap(s -> Arrays.asList(s.split(" ")).iterator());
        JavaPairRDD<String, Integer> wordOneRDD = wordRDD.mapToPair(new PairFunction<String, String, Integer>() {
            @Override
            public Tuple2<String, Integer> call(String word) throws Exception {
                System.out.println("############");
                return new Tuple2<>(word, 1);
            }
        });
        // 打印血缘关系
        System.out.println(wordOneRDD.toDebugString());

        // cache默认持久化操作，只能将数据保存到内存中，如果想要保存到磁盘文件，需要更改存储级别
        wordOneRDD.cache();
        // 更改存储级别
        // 持久化操作必须在行动算子执行时完成
        //wordOneRDD.persist(StorageLevel.DISK_ONLY());

        // cache 操作会增加血缘关系，不改变原有的血缘关系
        System.out.println("持久化操作后的血缘关系：");
        System.out.println(wordOneRDD.toDebugString());

        JavaPairRDD<String, Integer> wordCountRDD = wordOneRDD.reduceByKey((x, y) -> x + y);
        System.out.println(wordCountRDD.collect());
        System.out.println("----------------------------------");

        JavaPairRDD<String, Iterable<Integer>> groupByKeyRDD = wordOneRDD.groupByKey();
        System.out.println(groupByKeyRDD.collect());
        sparkContext.stop();
    }
}

```

结果（我们发现##### 只打印了4次，这点就证明了再次使用 wordOneRDD（mapToPair算子的对象）时， wordOneRDD不再需要去重新获取了数据，直接使用了我们持久化在内存中的数据）

```shell
(1) MapPartitionsRDD[2] at mapToPair at SparkRDD_persist2.java:24 []
 |  MapPartitionsRDD[1] at flatMap at SparkRDD_persist2.java:23 []
 |  ParallelCollectionRDD[0] at parallelize at SparkRDD_persist2.java:22 []
持久化操作后的血缘关系：
(1) MapPartitionsRDD[2] at mapToPair at SparkRDD_persist2.java:24 [Memory Deserialized 1x Replicated]
 |  MapPartitionsRDD[1] at flatMap at SparkRDD_persist2.java:23 [Memory Deserialized 1x Replicated]
 |  ParallelCollectionRDD[0] at parallelize at SparkRDD_persist2.java:22 [Memory Deserialized 1x Replicated]
############
############
############
############
[(spark,1), (hello,2), (world,1)]
----------------------------------
[(spark,[1]), (hello,[1, 1]), (world,[1])]
```



#### 2）RDD CheckPoint检查点

在Spark集群中的某个节点由于宕机导致数据丢失，可以通过Spark中的容错机制恢复已丢失的数据。RDD提供了两种**故障恢复方式**，分别是**血统（lineage）方式**和设置 **检查点（checkpoint）方式**。

血统（lineage）方式

​	主要是根据RDD直接的依赖关系（保存的血缘关系）对丢失的数据进行恢复。如果丢失数据的子RDD在进行窄依赖计算，则只需要把丢失的数据的父EDD的对应分区进行重新计算即可，不需要依赖于其他的节点，并且在计算的过程中不会存在冗余计算。若**丢失数据的子RDD在进行宽依赖计算，则需要父EDD的所以分区进行重新计算，在计算的过程中会存在冗余计算。**为了解决宽依赖计算中出现的冗余计算问题，Spark又提供了另一种数据容错的方式，即检查点方式。

-   所谓的检查点本质上就是通过将**RDD中间结果写入磁盘**。当RDD在进行宽依赖计算时，只需要在中间阶段设置一个检查点进行容错，即通过SparkContext对象调用 setCheckpoint()方法，设置容错文件系统目录（例如，HDFS）作为检查点checkpoint，将checkpoint的数据写入之前设置的容错系统中进行高可用的持久化存储。

-   由于血缘依赖过长会造成容错成本过高，这样就不如在中间阶段做检查点容错，**如果检查点之后有节点出现问题，可以从检查点开始重做血缘，减少了开销。**

-   对RDD进行checkpoint操作并不会马上被执行，必须执行Action操作才能触发。

```java
/**
 * checkpoint检查点演示
 */
public class SparkRDD_checkpoint {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("单词统计").setMaster("local");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        // 设置检查点路径(一般情况下为分布式存储系统：HDFS)
        sparkContext.setCheckpointDir("./checkpoint1");
        sparkContext.setLogLevel("ERROR");

        JavaRDD<String> lineRDD = sparkContext.parallelize(Arrays.asList("hello world", "hello spark"));
        JavaRDD<String> wordRDD = lineRDD.flatMap(s -> Arrays.asList(s.split(" ")).iterator());
        JavaPairRDD<String, Integer> wordOneRDD = wordRDD.mapToPair(new PairFunction<String, String, Integer>() {
            @Override
            public Tuple2<String, Integer> call(String word) throws Exception {
                System.out.println("############");
                return new Tuple2<>(word, 1);
            }
        });
        // 增加缓存,避免再重新跑一个job做checkpoint
        wordOneRDD.cache();
        // 数据检查点：针对wordToOneRdd做检查点计算
        // checkpoint 需要进行落盘操作，因此需要指定检查点保存路径
        // 若不设置，会报错 SparkException: Checkpoint directory has not been set in the SparkContext
        // 检查点路径保存的文件，当作业执行完毕时，不会被删除
        // 一般情况下，保存路径都是分布式存储系统：HDFS
        wordOneRDD.checkpoint();

        JavaPairRDD<String, Integer> wordCountRDD = wordOneRDD.reduceByKey((x, y) -> x + y);
        System.out.println(wordCountRDD.collect());
        sparkContext.stop();
    }
}
```

结果

使用如下命令执行saprk程序

```
bin/spark-submit --class com.clear.rdd.persist.SparkRDD_checkpoint --master local[*] /opt/temp/spark-core-demo-1.0.jar
```

```shell
# 在当前目录下出现了  checkpoint1 目录，说明我们检查点设置成功
[root@kk01 spark-local]# ll
total 132
drwxr-xr-x. 2 nhk  nhk   4096 Oct  6  2021 bin
drwxr-xr-x. 3 root root    50 May  6 02:20 checkpoint1
drwxr-xr-x. 2 nhk  nhk    197 Apr 19 23:00 conf
......

[root@kk01 checkpoint1]# pwd
/opt/software/spark-local/checkpoint1
[root@kk01 checkpoint1]# ll
total 0
drwxr-xr-x. 3 root root 19 May  6 02:20 a2981451-621f-4ed4-a658-6785488ceff4

```



##### 缓存和检查点区别 （面试题）

-   Cache缓存只是将数据保存起来，不切断血缘依赖。**Checkpoint检查点切断血缘依赖**。

-   Cache缓存的数据通常存储在磁盘、内存等地方，可靠性低。**Checkpoint的数据通常存储在HDFS等容错、高可用的文件系统，可靠性高。**（cache、persist算子用于优化、checkpoint算子用于容错）

-   建议对checkpoint()的RDD使用Cache缓存，这样checkpoint的job只需从Cache缓存中读取数据即可，否则需要再从头计算一次RDD（会多一个job，影响性能），原因是为了保证数据安全，一般情况下，会独立执行作业。

```java
        // cache：可以简单理解为将数据临时存储在内存中进行数据重用
        //         会在血缘关系中添加新的依赖。一旦出现问题，可以重头读取数据

        // persist：将数据临时存储在磁盘文件中进行数据重用
        //          涉及到磁盘IO，性能较低，但是数据安全
        //          如果作业执行完毕，临时保存的数据文件就会丢失

        // checkpoint：将数据长久保存在磁盘文件中进行数据重用
        //          涉及到磁盘IO，性能较低，但是数据安全
        //          为了保证数据安全，所以一般情况下，会独立执行作业
        //          为了提高效率，一般情况下，是需要联合cache一起使用
        //          执行过程中，会切断血缘关系。重新建立新的血缘关系
        //          checkpoint 等同于改变数据源（检查点以后的rdd出现问题，直接可以来检查点读取数据，不要再重头开始）
```

 

### RDD分区器

​	Spark目前支持**Hash分区**和**Range分区**，和**用户自定义分区**。Hash分区为当前的默认分区。分区器直接决定了RDD中分区的个数、RDD中每条数据经过Shuffle后进入哪个分区，进而决定了Reduce的个数。

-   ​	**只有Key-Value类型的RDD才有分区器**，非Key-Value类型的RDD分区的值是None
-   ​	每个RDD的分区ID范围：0 ~ (numPartitions - 1)，决定这个值是属于那个分区的。

1）**Hash分区**：对于给定的key，计算其hashCode,并除以分区个数取余

```java
// Hash分区Java源码如下
public class HashPartitioner extends Partitioner {
    private final int partitions;

    public int numPartitions() {
        return this.partitions;
    }

    public int getPartition(final Object key) {
        int var2;
        if (key == null) {
            var2 = 0;
        } else {
            var2 = .MODULE$.nonNegativeMod(key.hashCode(), this.numPartitions());
        }

        return var2;
    }

    public boolean equals(final Object other) {
        boolean var2;
        if (other instanceof HashPartitioner) {
            HashPartitioner var4 = (HashPartitioner)other;
            var2 = var4.numPartitions() == this.numPartitions();
        } else {
            var2 = false;
        }

        return var2;
    }

    public int hashCode() {
        return this.numPartitions();
    }

    public HashPartitioner(final int partitions) {
        this.partitions = partitions;
        scala.Predef..MODULE$.require(partitions >= 0, () -> {
            return (new StringBuilder(43)).append("Number of partitions (").append(this.partitions).append(") cannot be negative.").toString();
        });
    }
}
```

**2）Range分区**：将一定范围内的数据映射到一个分区中，尽量保证每个分区数据均匀，而且分区间有序

```
// Range分区源码太多了，这里就不放了
```

**3）自定义分区**

自定义分区步骤：

1.  自定义分区类，让自定义的类继承自org.apache.spark.Partitioner
2.  并实现其中抽象方法

```java
public class SparkRDD_Partitioner {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("演示自定义分区").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        JavaRDD<String> RDD = sparkContext.parallelize(Arrays.asList("nba", "cba", "wnba"));
        JavaPairRDD<String, Integer> pairRDD = RDD.mapToPair(n -> new Tuple2<>(n, 666));

        JavaPairRDD<String, Integer> result = pairRDD.partitionBy(new MyPartitioner());
        result.saveAsTextFile("file:///opt/temp/qiu");

        sparkContext.stop();
    }
}


/**
 * 自定义分区器
 * 1.继承 Partitioner
 * 2.重写方法
 */
class MyPartitioner extends Partitioner {

    /**
     * 分区数量
     *
     * @return
     */
    @Override
    public int numPartitions() {
        return 4;
    }

    /**
     * @param key
     * @return 根据数据的key值返回数据所在的分区索引（从0开始）
     */
    @Override
    public int getPartition(Object key) {
        if ("nba".equals(key)) {
            return 0;
        } else if ("cba".equals(key)) {
            return 1;
        } else if ("wnba".equals(key)) {
            return 2;
        } else {
            return 3;
        }
    }
}
```

结果

```shell
[root@kk01 qiu]# pwd
/opt/temp/qiu
[root@kk01 qiu]# ll
total 12
-rw-r--r--. 1 root root 10 May  5 10:20 part-00000
-rw-r--r--. 1 root root 10 May  5 10:20 part-00001
-rw-r--r--. 1 root root 11 May  5 10:20 part-00002
-rw-r--r--. 1 root root  0 May  5 10:20 part-00003
-rw-r--r--. 1 root root  0 May  5 10:20 _SUCCESS
[root@kk01 qiu]# cat part-00000
(nba,666)
[root@kk01 qiu]# cat part-00001
(cba,666)
[root@kk01 qiu]# cat part-00002
(wnba,666)
[root@kk01 qiu]# cat part-00003

```



### RDD文件读取与保存

Spark的数据读取及数据保存可以从两个维度来作区分：文件格式以及文件系统。

-   文件格式分为：text文件、csv文件、sequence文件以及Object文件；如果需要读取其他格式的数据，可以使用SparkSession对象来读取

-   文件系统分为：本地文件系统、HDFS、HBASE以及数据库。

**text文件**

```java
public void saveAsTextFile(final String path)
public void saveAsTextFile(final String path, final Class<? extends CompressionCodec> codec) 
```

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("text文件");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        // 读取输入文件
        JavaRDD<String> javaRDD = sparkContext.textFile("file:///opt/temp/hello.txt");
        // 保存数据
        javaRDD.saveAsTextFile("file:///opt/output");
    }
```

**sequence文件**

SequenceFile文件是hadoop用来存储二进制形式的key-value对而设计的一种平面文件(Flat File)。

在SparkContext中，可以调用如下方法

```java
public <K, V> JavaPairRDD<K, V> sequenceFile(final String path, final Class<K> keyClass, final Class<V> valueClass, final int minPartitions)
    
public <K, V> JavaPairRDD<K, V> sequenceFile(final String path, final Class<K> keyClass, final Class<V> valueClass)
```

**Object文件**

对象文件是将对象序列化后保存的文件，采用Java的序列化机制。可以通过objectFile方法接收一个路径，读取对象文件，返回对应的RDD，也可以通过调用saveAsObjectFile()实现对对象文件的输出。因为是序列化所以要指定类型。

```java
public <T> JavaRDD<T> objectFile(final String path) 
public <T> JavaRDD<T> objectFile(final String path, final int minPartitions) 
```

```java
public void saveAsObjectFile(final String path)
```



## 累加器

前面介绍过：累计器是分布式共享**只写**变量（全局共享）**Executor和Executor之间不能读数据**

**为什么要使用累加器？**

​	如果我们在Driver端定义一个变量，然后将该变量发送Executor端进行累加赋值操作，那么Driver端的变量值会发生改变吗？答案是不会，因为Executor端操作的是变量的副本，并不能影响Driver端的变量值。如何在这样的分布式系统中实现变量的共写呢？这就要用到累加器

### 实现原理

​	**累加器用来把Executor端变量信息聚合到Driver端**。在Driver程序中定义的变量，在Executor端的每个Task都会得到这个变量的一份新的副本，每个task更新这些副本的值后，传回Driver端进行merge。

### 基础编程

#### 系统累加器

**1）使用RDD的方式**

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("rdd实现方式");
        JavaSparkContext sc = new JavaSparkContext(sparkConf);
        JavaRDD<Integer> rdd = sc.parallelize(Arrays.asList(1, 2, 3, 4),2);

        Integer reduce = rdd.reduce((x, y) -> x + y);
        System.out.println(reduce);  // 10
    }
```

使用reduce算子可以完成我们的需求，但是该算子存在shuffle操作

​	在很多场合我们都可以巧妙利用**累加器替代转换算子实现一些功能**，**避免**转换算子带来的**shuffle操作，从而提升程序性能**

**2）使用累加器的方式**

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("ACC实现方式");
        JavaSparkContext sc = new JavaSparkContext(sparkConf);
        JavaRDD<Integer> rdd = sc.parallelize(Arrays.asList(1, 2, 3, 4),2);

        // spark默认提供了简单数据聚合的累加器
    	// 使用累加器，能够将executor端执行结果回收到driver端
        LongAccumulator sumAcc = sc.sc().longAccumulator();

        // 使用foreach算子完成功能，避免使用reduce算子，从而避免shuffle操作
        rdd.foreach(
                // 使用累加器
                num -> sumAcc.add(num)
           		 // Executor端的任务不能读取累加器的值，因为累加器是一个分布式共享只写变量。
        );
        // 获取累加器的值
        System.out.println(sumAcc.value());
        sc.stop();
    }

// 下面是使用累加器可能会遇到的一些问题
// 少加：转换算子中调用累加器，如果没有行动算子的话，那么不会执行
// 多加：转换算子中调用累加器，如果没有行动算子的话，那么不会执行
//  所以，一般情况下，累加器会放置在行动算子进行操作
```

**小结**

​	累加器要放在行动算子中，因为转换算子执行的次数取决于job的数量，如果一个spark应用有多个行动算子，那么转换算子中的累加器可能会发生不止一次更新，导致结果错误。所以，如果想要一个无论在失败还是重复计算时都绝对可靠的累加器，我们必须把它放在foreach()这样的行动算子中。

注意：

​	累加器在 Driver 端定义赋初始值，**累加器只能在 Driver端读取，在 Executor端更新**

**3）常用的累加器**

```java
package org.apache.spark;
public LongAccumulator longAccumulator()
public LongAccumulator longAccumulator(final String name)

package org.apache.spark.util;    
CollectionAccumulator
```

需要先使用 JavaSparkContext 对象调用 sc()方法获取SparkContext对象，再调用上述相应方法获得spark提供的累加器

```java
// 使用JavaSparkContext对象调用该方法获取 SparkContext对象，再去使用累加器
public SparkContext sc() {
        return this.sc;
}

private final SparkContext sc;
```



#### 自定义累加器

```java
/**
 * 自定义累加器
 */
public class SparkACC_demo3 {
    public static void main(String[] args) {
        //环境准备
        SparkConf sparkConf = new SparkConf().setAppName("词频统计，演示自定义累加器").setMaster("local[*]");
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);

        List<String> strings = Arrays.asList("hello java", "hello world", "hello spark");
        JavaRDD<String> javaRDD = jsc.parallelize(strings);
        // 创建累加器对象
        MyAccumulator myAccumulator = new MyAccumulator();
        // 向Spark进行注册累加器
        jsc.sc().register(myAccumulator, "wordCountAcc");

        javaRDD.foreach(word -> {
            //使用累加器(进行词频统计)
            myAccumulator.add(word);
        });

        // 获取累加器结果
        Map<String, Integer> value = myAccumulator.value();
        value.forEach((k,v) -> {
            System.out.println(k + ":" + v);
        });
    }
}

/**
 * 自定义累加器类
 * 1.继承AccumulatorV2
 * 2.定义泛型AccumulatorV2<IN, OUT>
 * IN 累加器输入的数据类型
 * OUT 累加器返回的数据类型
 * 3.重写方法
 */
class MyAccumulator extends AccumulatorV2<String, Map<String, Integer>> {

    //定义输出类型变量
    private Map<String, Integer> output = new HashMap<>();

    // 判断是否为初始状态
    @Override
    public boolean isZero() {
        return this.output.isEmpty();
    }

    // 复制累加器
    @Override
    public AccumulatorV2<String, Map<String, Integer>> copy() {
        MyAccumulator myAccumulator = new MyAccumulator();
        //将此累加器中的数据赋值给新创建的累加器
        myAccumulator.output = this.output;
        return myAccumulator;
    }

    // 重置累加器
    @Override
    public void reset() {
        this.output.clear();
    }

    // 累加器添加元素
    @Override
    public void add(String v) {
        String[] split = v.split(" ");
        for (String s : split) {
            // 存在则加一，不存在则为一
            int value = this.output.getOrDefault(s, 0) + 1;
            this.output.put(s, value);
        }
    }

    // 合并累加器元素（Driver端合并多个累加器）
    @Override
    public void merge(AccumulatorV2<String, Map<String, Integer>> other) {
        other.value().forEach((K, V) -> {
            if (this.output.containsKey(K)) {
                Integer i1 = this.output.get(K);
                Integer i2 = other.value().get(K);
                this.output.put(K, i1 + i2);
            } else {
                this.output.put(K, V);
            }
        });
    }

    // 输出（累加器结果）
    @Override
    public Map<String, Integer> value() {
        return this.out
}
```

结果

```
world:1
java:1
spark:1
hello:3
```



## 广播变量	

前面介绍过：广播变量是分布式共享**只读**变量

​	广播变量用来高效分发较大的对象。向所有工作节点发送一个较大的只读值，以供一个或多个Spark操作使用。比如，如果你的应用需要向所有节点发送一个较大的只读查询表，广播变量用起来都很顺手。在多个并行操作中使用同一个变量，但是 Spark会为每个任务分别发送。

**spark官方介绍**

​	广播变量是Spark中另一种共享变量，允许程序将一个只读的变量发送到Executor，一个Executor只需要在第一个Task启动时，获得一份Broadcast数据，之后的Task都从本节点的BlockManager中获取相关数据。

​	广播变量是通过调用SparkContext.broadcast(v)从变量v创建的。广播变量是v的包装器，它的值可以通过调用value方法来访问。

**广播变量演示**

```java
/**
* 不使用广播变量，每个task都会获得一个变量副本（数据量大，并行度高，可能导致性能较差）
* 广播变量使用方式
* 广播变量将变量的复制次数，从task的数量减少到进程executor个数，达到资源公用的目的
*/
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local").setAppName("broadcast");
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        jsc.setLogLevel("WARN");

        JavaRDD<String> rdd = jsc.parallelize(Arrays.asList("hello", "hello", "world", "java", "spark", "spark"), 3);

        // 定义广播变量
        List<String> list = Arrays.asList("hello", "spark");
        Broadcast<List<String>> broadcast = jsc.broadcast(list);

        // 演示使用广播变量用来过滤
        JavaRDD<String> filter = rdd.filter(new Function<String, Boolean>() {
            @Override
            public Boolean call(String word) throws Exception {
                List<String> value = broadcast.value();
                return value.contains(word);
            }
        });
        filter.foreach(new VoidFunction<String>() {
            @Override
            public void call(String s) throws Exception {
                System.out.println(s);
            }
        });
    }
```

结果

```
hello
hello
spark
spark
```

**小结**

-   **广播变量只能在 Driver 端定义，不能在 Executor端定义**
    
-   在 Driver 端可以修改广播变量的值，**在Executor 端无法修改广播变量的值**
    
-   闭包数据，都是以Task为单位发送的，每个任务中包含闭包数据
    
-   这样可能会导致，一个Executor中含有大量重复的数据，并且占用大量的内存
    
-   Executor其实就是一个JVM，所以在启动时，会自动分配内存
    
    -   完成可以将任务中的闭包数据放置在Executor的内存中，达到共享的目的
    
-   Spark的广播变量就可以将闭包的数据保存到Executor的内存中

-   Spark中的广播变量不能够更改：分布式共享**只读**变量，如下源码所示

    ```scala
    /**
    * 广播一个只读变量到集群，返回一个 [[org.apache.spark.broadcast.Broadcast]] 对象用于在分布式函* 数中读取它，该变量将只发送到每个集群一次
    */
    def broadcast[T](value: T): Broadcast[T] = sc.broadcast(value)(fokeClassTag)
    ```


 -->
