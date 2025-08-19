# RDD简介

> A Resilient Distributed Dataset (RDD), the basic abstraction in Spark. Represents an immutable, partitioned collection of elements that can be operated on in parallel. 

:::tip 翻译
弹性分布式数据集（RDD）是Spark中的基本抽象概念。它表示一个不可变的，可并行操作的元素的分区集合。
:::

RDD（Resilient Distributed Dataset）即**弹性分布式数据集**，是一个容错的、并行的数据结构，是Spark中最基本的**数据处理模型**。

RDD在代码中是一个`抽象类`，它代表一个弹性的、**不可变**、**可分区**、里面的元素可**并行**计算的集合。

-   弹性
    -   存储的弹性：内存与磁盘的自动切换；
    -   容错的弹性：数据丢失可以自动恢复；
    -   计算的弹性：计算出错重试机制；
    -   分片的弹性：可根据需要重新分片。
-   分布式：数据存储在大数据集群不同节点上
-   数据集：RDD**封装了计算逻辑，并不保存数据**
-   数据抽象：RDD是一个抽象类，需要子类具体实现
-   不可变 immutable：**RDD封装了计算逻辑，是不可以改变的，想要改变，只能产生新的RDD**，在新的RDD里面封装计算逻辑
-   可分区 partitioned：RDD中的数据被划分为很多部分，每部分称为分区 partition
-   并行计算 parallel：RDD中的数据可以被并行计算的处理，每个分区的数据被一个Task处理

**类比**

- RDD的数据处理方式类似于Java IO流，也采用装饰者设计模式来实现功能。
- RDD的数据只有在调用行动算子（例如，`collect()`）时，才会真正执行业务逻辑操作。
- RDD是不保存数据的，但是IO可以临时保存一部分数据
- 可以认为RDD是分布式的列表List或数组Array，抽象的数据结构，**RDD是一个`抽象类Abstract`**  

**Class和泛型Generic Type**

```scala
// RDD类声明
abstract class RDD[T: ClassTag](
    @transient private var _sc: SparkContext,
    @transient private var deps: Seq[Dependency[_]]
  ) extends Serializable with Logging
```

**RDD将Spark的底层的细节都隐藏起来**（自动容错、位置感知、任务调度执行，失败重试等）， 让开发者可以像操作本地集合一样以函数式编程的方式操作RDD这个分布式数据集，进行各种并行计算，RDD中很多处理数据函数与列表List中相同与类似。

## 对于RDD的简单理解

-   RDD是Spark框架中的核心数据结构
-   Spark处理数据时，将数据封装到RDD中（但是RDD不保存数据）
-   RDD中有很多的Partition（分区），每个Partition被一个Task处理
    -   对于Spark、Flink这类计算框架，每个Task任务以线程Thread的方式运行
    -   但是Hadoop的MR在每个Task（MapTask或ReduceTask）以进程Process方式运行



## RDD五大特征

RDD 数据结构内部有五个特性（摘录RDD 源码）：

```java
Internally, each RDD is characterized by five main properties:

  - A list of partitions
  - A function for computing each split
  - A list of dependencies on other RDDs
  - Optionally, a Partitioner for key-value RDDs (e.g. to say that the RDD is hash-partitioned)
  - Optionally, a list of preferred locations to compute each split on (e.g. block locations for an HDFS file)
```

前三个特征每个RDD都具备的，后两个特征可选的。

A list of partitions

-   分区列表（a list of partitions）
-   每个RDD被分为多个分区（partitions），这些分区运行在集群中的不同节点，每个分区都会被一个计算任务处理，**分区数决定了并行数的数量**
-   创建RDD时可以指定RRD分区的个数。如果不指定分区数量，当RDD从集合创建时，**默认分区数量为该程序所分配到的资源的CPU核数**（每个Core可以承载2~4个Partition），如果是从HDFS文件创建，默认为文件的Block数。

```scala
/**
* Implemented by subclasses to return the set of partitions in this RDD. This method will only
* be called once, so it is safe to implement a time-consuming computation in it.
*
* The partitions in this array must satisfy the following property:
*   `rdd.partitions.zipWithIndex.forall { case (partition, index) => partition.index == index }`
*/
protected def getPartitions: Array[Partition]
```

### A function for computing each split

-   每个分区都有一个计算函数（A function for computing each split）：一个函数会被作用在每一个分区
-   Spark的**RDD的计算函数是以分片为基本单位**的，每个RDD都会实现compute函数，对具体的分片进行计算。
-   简单来说，Spark在计算时，是使用分区函数对每一个分区进行计算

```scala
/**
 * :: DeveloperApi ::
 * Implemented by subclasses to compute a given partition.
 */
@DeveloperApi
def compute(split: Partition, context: TaskContext): Iterator[T]
```

### A list of dependencies on other RDDs

一个RDD会依赖于其他多个RDD（A list of dependencies on other RDDs）

**RDD是计算模型的封装**，当需求中需要将多个计算模型进行组合时，就需要将多个RDD建立依赖关系。

**RDD的每次转换都会生成新的RDD**，所以**RDD之间会形成**类似于流水线一样的**前后依赖关系**。**在部分分区数据丢失时，Spark可通过这个依赖关系重新计算丢失的分区数据**，而不是对RDD的所以分区进行重新计算。（Spark的容错机制）

```scala
/**
 * Implemented by subclasses to return how this RDD depends on parent RDDs. This method will only
 * be called once, so it is safe to implement a time-consuming computation in it.
 */
protected def getDependencies: Seq[Dependency[_]] = deps
```

### Optionally, a Partitioner for key-value RDDs (e.g. to say that the RDD is  hash-partitioned) 

 (Key,Value)数据类型的RDD分区器（a Partitioner for Key-Value RDDs）

当前Spark中实现了两种类型的分区函数，**一个是基于哈希的 HashPartitioner，另外一个是基于范围的 RangePartitioner**。

只有对于（Key,Value）的RDD，才会有Partitioner（分区），非于（Key,Value）的RDD的Partitioner 的值是None。

**Partitioner函数不但决定了RDD本身的分区数量，也决定了parent RDD Shuffle 输出时的分区数量。**

注意：只要K-V类型的数据才存在分区器的概念

```scala
/** Optionally overridden by subclasses to specify how they are partitioned. */
@transient val partitioner: Option[Partitioner] = None
```

### Optionally, a list of preferred locations to compute each split on (e.g. block locations  for an HDFS file)

每个分区都有一个优先位置列表（a list of perferred locations to compute each split on）

优先位置列表会存储每个Partition的优先位置

对于一个HDFS文件来说，就是每个Partition块的位置。

按照 **“移动数据不如移动计算” 的理念，Spark在进行任务调度时，会尽可能地将计算任务分配到其所要处理数据块的存储位置。**（数据本地性）

简单来说，就是判断计算发送到哪个节点，效率最优，数据移动不如移动计算

```scala
/**
 * Optionally overridden by subclasses to specify placement preferences.
 */
protected def getPreferredLocations(split: Partition): Seq[String] = Nil
```



RDD 是一个数据集的表示，不仅表示了数据集，还表示了这个数据集从哪来、如何计算，主要属性包括五个方面（必须牢记，通过编码加深理解，面试常问）：

-   数据集怎么来的：
    -   计算函数
    -   依赖关系
-   数据集在哪，在哪计算更合适，如何分区：
    -   分区列表
    -   分区函数
    -   最佳位置

RDD 设计的一个重要优势是能够记录 RDD 间的依赖关系，即所谓血统（lineage）。 通过丰富的转移操作（Transformation），可以构建一个复杂的有向无环图，并通过这个图来一步步进行计算。

## RDD执行原理

​	从计算的角度来讲，数据处理过程中需要**计算资源**（内存 & CPU）和**计算模型**（逻辑）。执行时，需要将计算资源和计算模型进行协调和整合。

Spark框架在执行时，先申请资源，然后将应用程序的数据处理逻辑分解成一个一个的计算任务。然后将任务发到已经分配资源的计算节点上, 按照指定的计算模型进行数据计算。最后得到计算结果。

RDD是Spark框架中用于数据处理的核心模型，下面是在Yarn环境中，RDD的工作原理:

-   ​	1)启动Yarn集群环境
-   ​	2)Spark通过申请资源创建调度节点和计算节点
-   ​	3)Spark框架根据需求将计算逻辑根据分区划分成不同的任务
-   ​	4)调度节点将任务根据计算节点状态发送到对应的计算节点进行计算

从以上流程可以看出**RDD**在整个流程中**主要用于将逻辑进行封装，并生成Task发送给Executor节点执行计算**

