# 1 RDD持久化

-   在Spark中，RDD是采用**惰性求值**的，即**每次调用行动算子时，都会从头开始计算**。然而，每次调用行动算子操作，都会触发一次从头开始的计算，这对于迭代计算来说，代价是很大的
-   因为迭代计算经常需要多次重复地使用同一组数据集，所以，**为了避免重复计算的开销，可以让spark对数据集进行持久化。**
-   如果我们不希望节点故障会拖累我们的执行速度，也可以将数据备份到多个节点上。

-   将RDD持久化，持久化单位是 **partition**

-   控制算子主要有三种 cache、persist、checkpoint。
    -   cache和 persist都是懒执行的。必须有action触发执行。
    -   **checkpoint算子不仅能将 RDD 持久化到磁盘，还能切断 RDD之间的依赖关系。**

简单记忆：cache、persist 算子主要是用于优化代码的、checkpoint算子是用来做容错的

注意：

​	持久化RDD时，计算出RDD的节点会分别保存它们所求出的数据。如果有一个持久化数据的节点发生故障，Spark会在需要用到缓存的数据的时候重新计算丢失的分区数据（而不是数据丢失时就去重新计算）。

## RDD cache\persist

​	RDD通过 **Cache()** 方法或者**Persist()** 方法将前面的计算结果缓存，**默认情况下会把数据以缓存在JVM的堆内存**中。但是**并不是这两个方法被调用时立即缓存**，而是**触发后面的action算子时，该RDD将会被缓存在计算节点的内存中，并供后面重用。**

### cache

**方法签名**

```java
public JavaPairRDD<K, V> cache()
```

```scala
// scala
def cache(): this.type = persist()
```

**方法说明**

-   默认将 RDD 的数据持久化到内存中

-   cache是懒执行的

-   注意

    -   ```java
        cache() = persist() = persist(StroageLevel.MEMORY_ONLY)
        // 说明
        //	cache底层调用的就是 persist()
        //	而 persist() 默认就是 MEMORY_ONLY     
        ```

### persist

**方法签名**

```java
public JavaPairRDD<K, V> persist(final StorageLevel newLevel)    
```

```scala
// scala
// 默认的存储级别为 MEMORY_ONLY
def persist(): this.type = persist(StorageLevel.MEMORY_ONLY)
// 开发中，数据量很大，一般会使用下面这个函数手动指定持久化级别
def persist(newLevel: StorageLevel)
```

**方法说明**

-   可以指定持久化的级别。常用的是 DISK_ONLY 、  MEMORY_AND_DISK

注意：

​	persist算子是懒执行的，使用该算子必须有action算子触发，否则不执行

### cache与persist

 cache与persist的注意事项：

-   cache和persist 都是**懒执行**，必须有 action类算子触发执行
-   cache和persist 算子的返回值可以**赋值给变量**，在其他job 中直接**使用这个变量就是使用持久化的数据**了。持久化的单位是 partition(RDD组成)
-   cache和persist 算子之后不能紧跟 action算子

cache与persist的关系，Scala源码解析：

```scala
// cache()函数调用的就是 persist()
/**
 * Persist this RDD with the default storage level (`MEMORY_ONLY`).
 */
def cache(): this.type = persist()

/**
 * Persist this RDD with the default storage level (`MEMORY_ONLY`).
 */
def persist(): this.type = persist(StorageLevel.MEMORY_ONLY)
```



### unpersist

**函数声明**

```scala
// 将RDD标记为非持久性，并从内存和磁盘中删除它的所有块。
def unpersist(blocking: Boolean = false): this.type

// 参数说明
blocking 是否阻塞直到所有块被删除(默认值:false)
```

**函数说明**

-   当缓存的RDD数据，不再被使用时，考虑释资源
-   此函数属于eager，立即执行



### 演示未持久化

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
		// 再次使用 wordOneRDD ：此时会重新计算 
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

但是我们需要特别注意，我们知道**RDD中不会存储数据**，这意味着，我们**重复使用wordOneRDD 时，里面并没有存储数据，那么 wordOneRDD 会根据自己存储的血缘关系去重新获取数据，造成了我们在代码层面看似重用了这个RDD对象（wordOneRDD），但底层执行代码时并没有重用**

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



## 存储级别

-   出于不同的目的，我们可以为RDD选择不同级别的存储级别。
    -   在Scala、Java中，默认情况下 persist() 会把数据以序列化的形式缓存到JVM的堆空间中。
    -   在python中，我们会始终序列化要持久化存储的数据，持久化级别默认为 以序列化后的对象存储在JVM的堆空间中。
    -   当我们把数据写到磁盘或是堆外存储时，总是使用序列化后的数据。

-   persist()方法的存储级别是通过 `StorageLevel` 对象（Scala、Java、Python）设置的。

-   cache()方法的存储级别是使用默认的存储级别（即 StorageLevel.MEMORY_ONLY()  将分序列化的对象存入内存 ）

注意：

​	如果缓存的数据过多，内存放不下，Spark会自动利用最近最少使用（LRU）的缓存策略把最老的分区从内存中移除。

​	对于只缓存在内存中的缓存级别，下一次需要用到已经被移除的分区时，这些分区就需要重新计算。

​	对于使用内存和磁盘的存储级别的分区来说，被移除的分区都会写入磁盘。不论哪一种情况，都不必担心我们的作业因为缓存数据过多而被打断。

​	缓存不必要的数据会导致有用的数据会被移出内存，带来更多的重算开销。

​	最后，RDD还有一个 `unpersist()`方法，可以**手动把持久化的RDD从缓存中移除。**

`org.apache.spark.storage.StorageLevel`

| 存储级别                          | 使用的空间 | cpu时间 | 是否在内存中 | 是否在磁盘中 | 备注                                                         |
| --------------------------------- | ---------- | ------- | ------------ | ------------ | ------------------------------------------------------------ |
| MEMORY_ONLY                       | 高         | 低      | 是           | 否           | **默认存储级别**。将RDD作为反序列化的java对象，缓存在jvm中，若数据在内存中放不下（内存已满的情况下），则某些分区将不会被缓存（被丢弃），并且每次需要时都会重新计算 |
| MEMORY_ONLY_SER                   | 低         | 高      | 是           | 否           | 将RDD作为序列化的java对象（每个分区序列化为一个字节数组），**比反序列化的Java对象节省空间，但读取时，更占cpu** |
| MEMORY_AND_DISK                   | 高         | 中等    | 部分         | 部分         | 将RDD作为反序列化的java对象，缓存在jvm中，若数据在**内存中放不下**（内存已满的情况下），则将剩余分区**溢写到磁盘上**，并在需要时从磁盘上读取 |
| MEMORY_AND_DISK_SER               | 低         | 高      | 部分         | 部分         | 与MEMORY_ONLY_SER类似，但是当数据在**内存中放不下**（内存已满的情况下），则将剩余分区**溢写到磁盘上**。**在内存中存放序列化后的数据** |
| DISK_ONLY                         | 低         | 高      | 否           | 是           | 仅将RDD分区的全部存储到磁盘上                                |
| MEMORY_ONLY_2   MEMORY_AND_DISK_2 |            |         |              |              | 与上面的级别相同。若**加上后缀 _2** ，代表的是**将每个持久化的数据都复制一份副本**，并将副本保存到其他节点上。 |
| OFF_HEAP                          |            |         |              |              | 与 MEMORY_ONLY_SER类似，但是将数据存储在堆外内存中（这需要启用堆外内存） |

StorageLevels.java源码如下：

```java
package org.apache.spark.api.java;

import org.apache.spark.storage.StorageLevel;

/**
 * Expose some commonly useful storage level constants.
 */
public class StorageLevels {
  public static final StorageLevel NONE = create(false, false, false, false, 1);
  public static final StorageLevel DISK_ONLY = create(true, false, false, false, 1);
  public static final StorageLevel DISK_ONLY_2 = create(true, false, false, false, 2);
  public static final StorageLevel DISK_ONLY_3 = create(true, false, false, false, 3);
  public static final StorageLevel MEMORY_ONLY = create(false, true, false, true, 1);
  public static final StorageLevel MEMORY_ONLY_2 = create(false, true, false, true, 2);
  public static final StorageLevel MEMORY_ONLY_SER = create(false, true, false, false, 1);
  public static final StorageLevel MEMORY_ONLY_SER_2 = create(false, true, false, false, 2);
  public static final StorageLevel MEMORY_AND_DISK = create(true, true, false, true, 1);
  public static final StorageLevel MEMORY_AND_DISK_2 = create(true, true, false, true, 2);
  public static final StorageLevel MEMORY_AND_DISK_SER = create(true, true, false, false, 1);
  public static final StorageLevel MEMORY_AND_DISK_SER_2 = create(true, true, false, false, 2);
  public static final StorageLevel OFF_HEAP = create(true, true, true, false, 1);

  /**
   * Create a new StorageLevel object.
   * @param useDisk saved to disk, if true
   * @param useMemory saved to on-heap memory, if true
   * @param useOffHeap saved to off-heap memory, if true
   * @param deserialized saved as deserialized objects, if true
   * @param replication replication factor
   */
  public static StorageLevel create(
    boolean useDisk,
    boolean useMemory,
    boolean useOffHeap,
    boolean deserialized,
    int replication) {
    // 调用 Scala中StorageLevel伴生对象的apply方法
    return StorageLevel.apply(useDisk, useMemory, useOffHeap, deserialized, replication);
  }
}
```

说明：

​	 StorageLevels 类（java类）底层调用的是Scala中  StorageLevels 类的伴生对象的apply方法

Scala源码：

```scala
object StorageLevel {
	// 表示不缓存
    val NONE = new StorageLevel(false, false, false, false)
    // 表示缓存数据到磁盘中
    val DISK_ONLY = new StorageLevel(true, false, false, false)
    val DISK_ONLY_2 = new StorageLevel(true, false, false, false, 2) // 副本2份
    val DISK_ONLY_3 = new StorageLevel(true, false, false, false, 3)
    // 表示缓存数据到内存中（Executor内存中）
    val MEMORY_ONLY = new StorageLevel(false, true, false, true)
    val MEMORY_ONLY_2 = new StorageLevel(false, true, false, true, 2)
    val MEMORY_ONLY_SER = new StorageLevel(false, true, false, false)	// 是否序列化
    val MEMORY_ONLY_SER_2 = new StorageLevel(false, true, false, false, 2)
    // 表示缓存数据到内存中（Executor内存中），如果内存不足溢写到磁盘
    val MEMORY_AND_DISK = new StorageLevel(true, true, false, true)	
    val MEMORY_AND_DISK_2 = new StorageLevel(true, true, false, true, 2)
    val MEMORY_AND_DISK_SER = new StorageLevel(true, true, false, false)
    val MEMORY_AND_DISK_SER_2 = new StorageLevel(true, true, false, false, 2)
    // 表示缓存数据到系统内存中
    val OFF_HEAP = new StorageLevel(true, true, true, false, 1)
    ...
```

缓存有可能丢失，或者存储于内存的数据由于内存不足而被删除，RDD的**缓存容错机制**保证了即使缓存丢失也能保证计算的正确执行。通过基于RDD的一系列转换，丢失的数据会被重算，**由于RDD的各个Partition是相对独立的，因此只需要计算丢失的部分即可，并不需要重算全部Partition**。

-   **RDD对象的持久化操作不一定是为了重用**
-   **在数据执行较长，或数据比较重要的场合也可以采用持久化操作**

​	**Spark会自动对一些Shuffle操作的中间数据做持久化操作**(比如：reduceByKey)。这样做的目的是为了当一个节点Shuffle失败了避免重新计算整个输入。但是，**在实际使用的时候，如果想重用数据，仍然建议调用persist或cache。**

### 演示持久化

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



# 2 RDD CheckPoint检查点

-   RDD 数据可以持久化，但是持久化/缓存可以把数据放在内存中，虽然是快速的，但是也是最不可靠的；也可以把数据放在磁盘上，也不是完全可靠的！例如磁盘会损坏等。
-   Checkpoint的产生就是为了更加可靠的数据持久化，**在Checkpoint的时候一般把数据放在在HDFS上**，这就天然的借助了HDFS天生的高容错、高可靠来实现数据最大程度上的安全，实现了RDD的容错和高可用。 
-   在Spark Core中对RDD做checkpoint，可以切断做checkpoint RDD的依赖关系，将RDD数据保存到可靠存储（如HDFS）以便数据恢复
    -   说白了就是checkpoint会切断RDD的血缘关系



-   在Spark集群中的某个节点由于宕机导致数据丢失，可以通过Spark中的容错机制恢复已丢失的数据。RDD提供了两种**故障恢复方式**，分别是**血统（lineage）方式**和设置 **检查点（checkpoint）方式**。

-   血统（lineage）方式
    -   主要是根据RDD直接的依赖关系（保存的血缘关系）对丢失的数据进行恢复。如果丢失数据的子RDD在进行窄依赖计算，则只需要把丢失的数据的父EDD的对应分区进行重新计算即可，不需要依赖于其他的节点，并且在计算的过程中不会存在冗余计算。若**丢失数据的子RDD在进行宽依赖计算，则需要父EDD的所以分区进行重新计算，在计算的过程中会存在冗余计算。**
    -   为了解决宽依赖计算中出现的冗余计算问题，Spark又提供了另一种数据容错的方式，即检查点checkpoint方式。

-   所谓的检查点本质上就是通过将**RDD中间结果写入磁盘**。当RDD在进行宽依赖计算时，只需要在中间阶段设置一个检查点进行容错，即通过SparkContext对象调用 setCheckpoint()方法，设置容错文件系统目录（例如，HDFS）作为检查点checkpoint，将checkpoint的数据写入之前设置的容错系统中进行高可用的持久化存储。
-   由于血缘依赖过长会造成容错成本过高，这样就不如在中间阶段做检查点容错，**如果检查点之后有节点出现问题，可以从检查点开始重做血缘，减少了开销。**
-   对RDD进行checkpoint操作并不会马上被执行，必须执行Action操作才能触发。

### checkpoint

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

例如：

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



### 演示检查点

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



# 3 缓存(持久化)和检查点区别 （面试题）

-   Lineage(血统、依赖链、依赖关系)

    -   Persist和Cache只是将数据保存起来，==**不切断血缘依赖**==。因为这种缓存是不可靠的，如果出 

        现了一些错误(例如 Executor 宕机)，需要通过回溯依赖链重新计算出来

        -   数据一般存储在内存或磁盘

    -   **Checkpoint检查点==切断血缘依赖==**。因为Checkpoint会把结果保存在HDFS这类存储中，更加的安 

        全可靠，一般不需要回溯依赖链；
        
        -   数据一般存储至第三方（例如HDFS）

-   存储位置
    -   Persist 和 Cache 只能保存在本地的磁盘和内存中(或者堆外内存)等地方，可靠性低。
    -   **Checkpoint的数据通常存储在HDFS等容错、高可用的文件系统，可靠性高。**
    -   （cache、persist算子用于优化、checkpoint算子用于容错）

-   生命周期
    -   Cache和Persist的RDD会在程序结束后会被清除或者手动调用unpersist方法；
    -   Checkpoint的RDD在程序结束后依然存在，不会被删除；



# 4 生产建议

**建议对使用了checkpoint()的RDD使用Cache缓存**，这样checkpoint的job只需从Cache缓存中读取数据即可，否则需要再从头计算一次RDD（会多一个job，影响性能），原因是为了保证数据安全，一般情况下，会独立执行作业。

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

 

