# 1 函数分类

对于 Spark 处理的大量数据而言，会将数据切分后放入RDD作为Spark 的基本数据结构，开发者可以在 RDD 上进行丰富的操作，之后 Spark 会根据操作调度集群资源进行计算。总结起来，RDD 的操作主要可以分为 Transformation 和 Action 两种

此外，还要控制相关的操作（如：持久化算子）

官方文档：http://spark.apache.org/docs/3.2.0/rdd-programming-guide.html#rdd-operations 

**RDD中操作（函数、算子）分为两类：** 

-   1）**Transformation**转换操作：返回一个新的RDD 
    -   which create a new dataset from an existing one 
    -   所有Transformation函数都是**Lazy**（懒加载），不会立即执行，需要Action函数触发

-   2）**Action**动作操作：返回值不是RDD(无返回值或返回其他的) 
    -   which return a value to the driver program after running a computation on the datase 
    -   所有Action函数立即执行（Eager），比如count、first、collect、take等

此外注意RDD中函数**细节：** 

-   第一点：**RDD不实际存储真正要计算的数据**，而是记录了数据的位置在哪里，数据的转换关系(调用了什么方法，传入什么函数)
    -   RDD中封装的是计算逻辑，而不是真正的数据
-   第二点：**RDD中的所有转换都是惰性求值/延迟执行的**，也就是说并不会直接计算。只有当发生一个要求返回结果给Driver的Action动作时，这些转换才会真正运行。之所以使用惰性求值/延迟执行，是因为这样可以在Action时对RDD操作形成DAG有向无环图进行Stage的划分和并行优化，这种设计让Spark更加有效率地运行

## Transformation函数

在Spark中Transformation操作表示将一个RDD通过一系列操作变为另一个RDD的过程，这个操作可能是简单的加减操作，也可能是某个函数或某一系列函数。值得注意的是**Transformation操作并不会触发真正的计算，只会建立RDD间的关系图**

## Action函数

不同于Transformation操作，Action操作代表一次计算的结束，不再产生新的 RDD，将结果返回到Driver程序或者输出到外部。所以**Transformation操作只是建立计算关系，而Action 操作才是实际的执行者**。

**每个Action操作都会调用SparkContext的runJob 方法向集群正式提交请求，所以每个Action操作对应一个Job。**

# 2 常用RDD

## **2.1 基本函数** 

RDD中 map、filter、flatMap及 foreach 等函数为最基本函数，都是都RDD中每个元素进行操作，将元素传递到函数中进行转换。

### map

```scala
// 通过对这个RDD的所有元素应用一个函数f返回一个新的RDD。
def map[U: ClassTag](f: T => U): RDD[U]
```

### flatMap

```scala
// 表示将 RDD 经由某一函数 f 后，转变为一个新的 RDD，但是与 map 不同，RDD 中的每一个元素会被映射成新的 0到多个元素（f 函数返回的是一个序列 Seq）
def flatMap[U: ClassTag](f: T => TraversableOnce[U]): RDD[U]
```

### filter

```scala
// 表示将 RDD 经由某一函数 f 后，只保留 f 返回为 true 的数据，组成新的 RDD
def filter(f: T => Boolean): RDD[T] 
```

### foreach 

```scala
// 将函数 f 应用于此 RDD 的所有元
def foreach(f: T => Unit): Unit
```

### saveAsTextFile 

```scala
// 数据集内部的元素会调用其 toString 方法，转换为字符串形式，然后根据传入的路径保存成文本文件，既可以是本地文件系统，也可以是HDFS 等
def saveAsTextFile(path: String): Unit
```



## 2.2 分区操作函数

每个RDD由多分区组成的，实际开发建议对每个分区数据的进行操作。尤其是创建对象时，建议使用

-   map函数使用 mapPartitions代替

-   foreache函数使用 foreachPartition代替

### mapPartitions

```scala
def mapPartitions[U: ClassTag](
    f: Iterator[T] => Iterator[U],
    preservesPartitioning: Boolean = false): RDD[U]
```

### foreachPartition

```scala
def foreachPartition(f: Iterator[T] => Unit): Unit
```



## 2.3 重分区函数

对RDD中分区数目进行调整（增加分区或减少分区），在RDD函数中主要有如下三个函数

-   1）增加分区函数 
    
    -   函数名称：repartition，此函数使用的谨慎，**会产生Shuffle**。 
    
    -   ```scala
        // 用于增加RDD的分区数
        def foreachPartition(f: Iterator[T] => Unit): Unit
        ```
-   2）减少分区函数 
    -   函数名称：coalesce，此函数不会产生Shuffle，当且仅当降低RDD分区数目。 
        -   增加分区时需要让第二个参数为ture，否则毫无意义，会产生shuffle
    -   比如RDD的分区数目为10个分区，此时调用rdd.coalesce(12)，不会对RDD进行任何操作。 
-   3）调整分区函数 
    
    -   在PairRDDFunctions（此类专门针对RDD中数据类型为KeyValue对提供函数）工具类中 
    
        partitionBy函数： 
    
        ```scala
        // 此函数通过传递分区器partitioner改变RDD的分区数目
        def partitionBy(partitioner: Partitioner): RDD[(K, V)]
        ```
    

### 分区的选择

在实际开发中，什么时候适当调整RDD的分区数目呢？让程序性能更好好呢

-   增加分区数目 

    -   当处理的数据很多的时候，可以考虑增加RDD的分区数目

    -   ```
        比如读取HBase表中的数据，默认的情况下一个table中有多个region，对应数据封装的RDD就有多少个分区
        	Table-Region-Numbers = RDD-Partition-Numbers
        HBase表中每个Region的数据非常多（比如每个Region存储的数据为8GB），此时RDD的每个数据为8G，此时需要考虑增加分区数目
        	rdd.repartition(32)
        ```

-   减少分区数目

    -   当对RDD数据进行过滤操作（filter函数）后，考虑是否降低RDD分区数目

    -   ```
        比如读取HBase表中的数据，总共有20个分区：20亿条数据 -> 每个分区1亿条数据
        	经过filter过滤之后
        RDD数据，分区数量为20分区，8亿条数据
        	分区数量的数量很少，可以降低分区数目
        	rdd.coalesce(10)	
        ```

    -   当对结果RDD存储到外部系统

        ```
        应用场景：	
        	处理网址日志数据，数据量为10，统计各个省份PV和UV
        假设10GB日志数据，从HDFS上读取，此时RDD的分区数目：80个分区
        	
        但是结果数据只有34条，存储在80个分区，这显然不合理，降低分区数目（降低为1个分区）	
        	此时数据存储到MySQL表中，对分区数目操作，仅仅获取一个数据库连接即可
        ```

        

## **2.4 聚合函数**

在数据分析领域中，对数据聚合操作是最为关键的，在Spark框架中各个模块使用时，主要就是其中聚合函数的使用

### 集合中的聚合函数

查看列表List中聚合函数reduce和fold源码如下：

```scala
def reduce[B >: A](op: (B, B) => B): B = reduceLeft(op)

def fold[A1 >: A](z: A1)(op: (A1, A1) => A1): A1 = foldLeft(z)(op)
// z表示聚合中间临时变量的初始值，fold聚合函数比reduce聚合函数：可以设置聚合中间变量初始值
```

###  RDD 中聚合函数

在RDD中提供类似列表List中聚合函数reduce和fold，查看如下：

```scala
def reduce(f: (T, T) => T): T
	
// zeroValue表示自定义的聚合中间临时变量的初始值
def fold(zeroValue: T)(op: (T, T) => T): T
```

### PairRDDFunctions 聚合函数

在Spark中有一个object对象PairRDDFunctions，主要针对RDD的数据类型是Key/Value对的数据提供函数，方便数据分析处理。比如使用过的函数：reduceByKey、groupByKey等。

*ByKey函数：将相同Key的Value进行聚合操作的，省去先分组再聚合。 

#### 分组 groupByKey

```scala
// 相同的key的value合在一起，所有的value存储在迭代器Iterable中
def groupByKey(): RDD[(K, Iterable[V])]

def groupByKey(numPartitions: Int): RDD[(K, Iterable[V])]

def groupByKey(partitioner: Partitioner): RDD[(K, Iterable[V])]

/**
	此函数出现的性能问题：
		1.数据倾斜
			当某个key对应的value非常多时，迭代器中的value将会非常多
		2.OOM
			内存溢出
		在开发中，原则上能不使用groupByKey就尽量不要使用
*/
```

#### 分组聚合 reduceByKey和foldByKey

```scala
// 将相同key中的value进行聚合操作，类似于RDD中的reduce函数
def reduceByKey(func: (V, V) => V): RDD[(K, V)]
def reduceByKey(func: (V, V) => V, numPartitions: Int): RDD[(K, V)]
def reduceByKey(partitioner: Partitioner, func: (V, V) => V): RDD[(K, V)]


// 该函数与reduceByKey类型，只不过可以设置聚合中间临时变量初始值，类似于RDD中的fold函数	
def foldByKey(zeroValue: V)(func: (V, V) => V): RDD[(K, V)]
def foldByKey(zeroValue: V, numPartitions: Int)(func: (V, V) => V): RDD[(K, V)]
def foldByKey(
    zeroValue: V,
    partitioner: Partitioner)(func: (V, V) => V): RDD[(K, V)]


/**
	reduceByKey和foldByKey聚合以后的结果数据类型与RDD中Value的数据类型是一样的
	开发中，建议使用reduceByKey
*/
```

#### 分组聚合 aggregateByKey

```scala
def aggregateByKey[U: ClassTag](zeroValue: U)
								(seqOp: (U, V) => U, combOp: (U, U) => U): RDD[(K, U)]

def aggregateByKey[U: ClassTag](zeroValue: U, numPartitions: Int)
								(seqOp: (U, V) => U, combOp: (U, U) => U): RDD[(K, U)]

def aggregateByKey[U: ClassTag](zeroValue: U, partitioner: Partitioner)
								(seqOp: (U, V) => U, combOp: (U, U) => U): RDD[(K, U)]

/**
	在企业中如果对数据聚合使用，不能使用reduceByKey完成时，考虑使用aggregateByKey函数,基本上都能完成任意聚合功能
*/
```

#### groupByKey和reduceByKey区别

-   reduceByKey函数：在一个(K,V)的RDD上调用，返回一个(K,V)的RDD，使用指定的reduce函数，将相同key的值聚合到一起，reduce任务的个数可以通过第二个可选的参数来设置
-   groupByKey函数：在一个(K,V)的RDD上调用，返回一个(K,V)的RDD，使用指定的函数，将相同 key的值聚合到一起，与reduceByKey的区别是只生成一个sequence



## 2.5 关联函数

当两个RDD的数据类型为二元组Key/Value对时，可以依据Key进行关联Join	

-   在SQL中JOIN时：
    -   指定 关联字段 a join b on a.xx = b.yy
-   在RDD中JOIN数据时，要求RDD中数据类型必须是二元组：
    -   依据key进行关联

```scala
def join[W](other: RDD[(K, W)]): RDD[(K, (V, W))]

def leftOuterJoin[W](other: RDD[(K, W)]): RDD[(K, (V, Option[W]))]	

def rightOuterJoin[W](other: RDD[(K, W)]): RDD[(K, (Option[V], W))] 
```

