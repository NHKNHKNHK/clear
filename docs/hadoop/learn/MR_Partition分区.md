# MapReduce Partition分区

MapReduce输出结果文件个数探究

-   默认情况下

不管map阶段有多少个文件并发执行Task，到reduce阶段，所有的结果都将有一个task来处理

并且最终结果输出到一个文件中，part-r-00000

-   改变ReduceTask个数

在MapReduce中，通过Job提供的方法(job.setNumReduceTasks())，可以修改reducetask的个数。

默认情况下不设置，reducetask个数为1

setNumReduceTasks()方法源码如下：

```java
public void setNumReduceTasks(int tasks) throws IllegalStateException {
	this.ensureState(Job.JobState.DEFINE);
    this.conf.setNumReduceTasks(tasks);
}

```

**注意：**

​	修改reducetask个数要在job工作提交之前完成，即书写在 job.waitForCompletion(true) 方法之前

-   输出结果文件个数与ReduceTask个数的关系

通过修改不同的reducetask个数值，得出输出结果文件个数与ReduceTask个数是一种对等关系。也就是说有有几个reducestack，最终程序就输出几个文件

思考：

​		当MapReduce中有多个reducetask执行的时候，此时maptask的输出就面临一个问题，就是将自己的输出数据交给哪一个reducetask来处理呢？这就是所谓数据分区（partition）的问题

## partition概念

-   默认情况下，MapReduce只有一个reducetask来进行数据的处理。这就使得不管输入的数据量有多大，最终的结果就是输出到一个文件中。
-   当改变reducetask个数时，作为maptask就会涉及到分区的问题，即**maptask将自己的输出的结果如何分配给reducetask来处理**

## partition默认规则

-   MapReduce默认分区规则是 HashPartitioner
-   分区的结果和map输出的key有关（key相同的会分到同一个区）

如下是 HashPartitioner 源码

```Java
public class HashPartitioner<K, V> extends Partitioner<K, V> {
    public HashPartitioner() {
    }

    public int getPartition(K key, V value, int numReduceTasks) {
        return (key.hashCode() & 2147483647) % numReduceTasks;
    }
}

```

## partition注意事项

-   **reducetask个数的改变导致了数据分区的产生**，而不是有了数据分区才导致了reducetask个数的改变
-   数据分区的核心是分区规则。即如何分配数据给各个reducetask
-   默认的规则可以保证只要**map阶段输出的key一样，数据就一定可以分到同一个reducetask**，但是不能保证数据平均分区（因为分区规则更map输出的key大hash值有关）
-   reducetask个数的改变还会导致输出结果文件不再是一个整体，而是输出到多个文件中