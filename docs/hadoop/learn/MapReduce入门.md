# MapReduce入门

## MapReduce简介

MapReduce是一个**分布式运算程序**的编程框架，是用户开发“基于Hadoop的数据分析应用”的核心框架。

MapReduce核心功能是将**用户编写的业务逻辑代码**和**自带默认组件**整合成一个完整的**分布式运算程序**，并发运行在一个Hadoop集群上。

**MapReduce将计算过程分为两个阶段：Map和Reduce**

1）Map阶段进行并行处理输入数据

- 第一阶段的MapTask并发实例，完全并发运行，互不相干。

2）Reduce阶段对Map阶段的结果进行汇总

- 第二阶段的ReduceTask并发实例互不相干，但是它们的数据依赖于上一个阶段的所有MapTask并发实例的输出

总结：

​	MapReduce编程模型只能包含一个Map阶段和一个Reduce阶段，如果用户的业务逻辑非常复杂，那么就只能多个MapReduce程序串行运行。

## MapReduce优缺点

**优点**

**1）MapReduce易于编程**

**它简单的实现了一些接口，就可以完成一个分布式程序**，这个分布式程序可以分布到大量廉价的PC机器上运行。也就是说你写一个分布式程序，跟写一个简单的串行程序是一模一样的。就是因为这个特点使得MapReduce编程变得非常流行。

**2）良好的扩展性**

当你的计算资源不能得到满足的时候，你可以通过**简单的增加机器**来扩展它的计算能力。

**3）高容错性**

MapReduce设计的初衷就是使程序能够部署在廉价的PC机器上，这就要求它具有很高的容错性。比如**其中一台机器挂了，它可以把上面的计算任务转移到另外一个节点上运行，不至于这个任务运行失败**，而且这个过程不需要人工参与，而完全是由Hadoop内部完成的。

**4）适合PB级以上海量数据的离线处理**

可以实现上千台服务器集群并发工作，提供数据处理能力。

**缺点**

**1）不擅长实时计算**

MapRedeuce无法像MySQL一样，在毫秒或者在秒级内返回结构

**2）不擅长流式计算**

流式计算的输入数据是动态的，而MapReduce的**输入数据集是动态**，不能动态变化。这是因为MapReduce自身的设计特点决定了数据源必须是静态的

**3）不擅长DAG（有向无环图）计算**

多个应用存在依赖关系，后一个应用程序的输入作为为前一个的输出。在这种情况下，MapReduce并不是不能做，而是使用后，**每个MapReduce作业的输出结果都会写入到磁盘，会造成大量的磁盘IO，导致性能非常的底下。**

相反，Spark非常适合DAG的计算

## MapReduce架构体系

一个完整的mr程序（MapReduce）在分布式运行时有三类**实例进程**

- ​	MRAppMaster：负责整个程序的过程调度及状态协调
- ​	MapTask：负责map阶段的整个数据处理流程
- ​	ReduceTask：负责reduce阶段的整个数据处理流程

MapReduce**编程模型只能包含一个map阶段和一个reduce阶段**

如果用户的**业务逻辑非常复杂**，那就只能多个MapReduce程序**串行**运行

即 ：

​		mapper ---> reduce --->..... ---> mapper ---> reduce 

## MapReduce进程

一个完整的MapReduce程序在分布式运行时有三个实例进程：

1）**MrAppMaster**：负责整个程序的过程调度及状态协调

2）**MapTask**：负责Map阶段的整个数据处理流程

3）**ReduceTask**：负责Reduce阶段的整个数据处理流程

## MapReduce编程规范

- ​	用户编写的**程序代码**分三个部分：**Mapper、Reduce、Driver**(客户端提交作业的驱动程序)

- ​	用户自定义的Mapper和Reduce都要**继承各自的父类**（hadoop官方提供的）

    ​		Mapper中的业务逻辑写在map()方法中  **MapTask进程对每个<K,V>调用一次map**

    ​		Reduce中的业务逻辑写在reduce()方法中 **ReduceTask进程对每一组相同的<K,V>调用一次reduce**

    ​		整个程序都需要一个Driver来进行提交（提交方式有手动提交和使用工具类ToolRunner提交），提交的是一个描述了各种必要信息的Job对象

如下：

```java
public class WordCountMapper extends Mapper<KEYIN, VALUEIN, KEYOUT, VALUEOUT> {
	@Override
    protected void map(KEYIN key, VALUEIN value, Context context) throws IOException, InterruptedException {
       
    }   
}

public class WordCountReduce extends Reducer<KEYIN, VALUEIN, KEYOUT, VALUEOUT> {
    @Override
    protected void reduce(KEYIN key, Iterable<VALUEIN> values, Context context) throws IOException, InterruptedException {
     
    }
}
```

注意：在整个MapReduce程序中，数据都是以**k-v键值对的形式流转**的

在实际编程解决业务问题中，需要考虑每个阶段的输入输出kv分别是什么

MapReduce内置了许多默认属性，比如排序、分组等，都和数据的k有关

------

MapReduce从表面看起来就两个阶段Map和Reduce，但是内部却包含了很多默认组件和默认行为。

​	组件：读取数据组件（**InputFormat**）、输出数据组件（**OutputFormat**）

​	行为：**排序**（key的字典序排序）、**分组**（reduce阶段key相同的分为一组，一组调用一次reduce）