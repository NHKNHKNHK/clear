# map 与 mapPartitions 区别

**数据处理角度**

-   map算子是**分区内**一个数据一个数据的执行，类似于串行操作。
-   而mapPartitions算子是**以分区**为单位进行**批处理**操作。

**功能的角度**

-   map算子主要目的将数据源中的数据进行转换和改变。但是不会减少或增多数据。
-   **mapPartitions算子**需要传递一个迭代器，**返回一个迭代器**，没有要求的元素的个数保持不变，所以可以增加或减少数据

**性能的角度**

-   map算子因为类似于串行操作，所以性能比较低，
-   而是**mapPartitions算子类似于批处理，所以性能较高。但是mapPartitions算子会长时间占用内存，那么这样会导致内存可能不够用，出现内存溢出的错误（OOM）**。所以在内存有限的情况下，不推荐使用。而是使用map操作。

**完成比完美更重要**



# partitionBy 、coalesce 与 reparation 区别

## coalesce

```java
public JavaRDD<T> coalesce(final int numPartitions)
// 缩减分区为窄依赖
// 扩大分区需要使用参数shuffle为true的，为宽依赖
    
public JavaRDD<T> coalesce(final int numPartitions, final boolean shuffle)
```

coalesce可以用于扩大分区和缩小分区，扩大分区时需指定shuffle参数为true，否则毫无意义

**缩小分区时使用 coalesce 可以避免 shuffle**

## repatriation

```java
public JavaRDD<T> repartition(final int numPartitions)
```

repartition方法底层调用的是就是shuffle参数为true的coalesce的方法

```scala
def repartition(numPartitions: Int)(implicit ord: Ordering[T]=null):RDD[T]= withScope{
coalesce(numPartition, shuffle = true)
}
```

reparation 默认就**存在 shuffle** 操作，保证了数据在分区时数据均匀。

## 小结

-   ​	**缩减分区首选 coalesce 算子（不产生shuffle）。**
-   ​	如果要**扩大分区**，可以令 shuffle参数为true。但是这样还不如直接**使用repartition算子（会产生shuffle）**
-   ​	repartition 无论增大、缩减分区都会产生shuffle

## partitionBy

```java
public JavaPairRDD<K, V> partitionBy(final Partitioner partitioner)
```

partitionBy针对的是 key-value类型，如果分区数等于原来的分区数，则该算子不会执行

如果分区数与原来分区数不一致，则会根据指定的分区规则对数据进行重新分区，**存在 shuffle**



# reduceByKey 与 groupByKey

**从shuffle的角度**

-   reduceByKey 与 groupBykey **都存在 shuffle 操作**
-   但是reduceByKey可以在 shuffle 前对分区内的数据进行**map端预聚合（combine）**操作，这样会减少落盘的数据量（本地聚合，减少网络IO）
-   groupBykey只是进行分组操作，不存在数据量减少的问题
-   因此reduceByKey的性能较高

**从功能的角度**

-   reduceByKey 包含**分组和聚合**功能
-   grouoByKey 只能**分组**，不能聚合
-   reduceByKey 的性能远远大于 ：groupByKey + 聚合
-   所以在需要分组聚合的场景下，推荐使用reduceByKey，如果仅仅只需要分组那么只能使用groupBykey



# reduceByKey、foldByKey、aggregateByKey、combineByKey

**reduceByKey**

-   **相同key的第一个数据不进行任何计算**，分区内和分区间计算规则相同

**foldByKey**

-   相同key的第一个数据和初始值进行分区内计算，分区内和分区间计算规则相同

**aggregateByKey**

-   相同key的第一个数据和初始值进行分区内计算，分区内和分区间计算规则可以不相同

**combineByKey**

-   当计算时，发现数据结构不满足要求时，可以让第一个数据转换结构。分区内和分区间计算规则不相同。

