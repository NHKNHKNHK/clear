# 1 Spark 程序编写流程

-   **创建 SparkConf 对象**（Spark程序必须做的第一件事是创建一个JavaSparkContext/SparkContext对象，它告诉Spark如何访问集群。要创建SparkContext，首先需要构建一个包含应用程序信息的SparkConf对象。）
    -   **设置SparkConf参数**，如appName、master等 （**appName参数是应用程序在集群UI上显示的名称**。master是一个Spark、Mesos或YARN集群的URL，或者一个在本地模式下运行的特殊的“local”字符串。在实践中，当在集群上运行时，您不希望在程序中硬编码master，而是希望使用spark-submit启动应用程序并在那里接收它。然而，对于本地测试和单元测试，您可以通过“local”来运行进程中的Spark。）
-   **基于SparkConf 对象 创建 SparkContext 对象**
-   **基于 SparkContext 即上下文环境对象创建RDD**
-   使用**转换算子Transformation对RDD进行转换**，得到新的RDD
-   使用缓存算子将需要重用的RDD进行缓存（可选）
-   **使用 行动算子Action类触发一次并行运算（Spark会对计算进行优化后再执行）**
-   **关闭 SparkContext**

# 2 RDD简介

RDD（Resilient Distributed Dataset）即**弹性分布式数据集**，是一个容错的、并行的数据结构，是Spark中最基本的**数据处理模型**。代码中是一个抽象类，它代表一个弹性的、不可变、可分区、里面的元素可并行计算的集合。

-   弹性
    -   存储的弹性：内存与磁盘的自动切换；
    -   容错的弹性：数据丢失可以自动恢复；
    -   计算的弹性：计算出错重试机制；
    -   分片的弹性：可根据需要重新分片。
-   分布式：数据存储在大数据集群不同节点上
-   数据集：RDD**封装了计算逻辑，并不保存数据**
-   数据抽象：RDD是一个抽象类，需要子类具体实现
-   不可变：**RDD封装了计算逻辑，是不可以改变的，想要改变，只能产生新的RDD**，在新的RDD里面封装计算逻辑
-   可分区、并行计算

说明：

​	RDD的数据处理方式类似于IO流，也有装饰者设计模式

​	RDD的数据只有在调用行动算子（例如，collect()）时，才会真正执行业务逻辑操作。

​	RDD是不保存数据的，但是IO可以临时保存一部分数据

# 3 RDD的创建方式

在Spark中创建RDD的创建方式可以分为四种：

## 1）从集合（内存）中创建RDD

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

RDD.foreach((integer) -> System.out.println(integer));
// 关闭环境
sparkContext.stop();
```

```scala
scala> val lines = sc.parallelize(List("hello", "world"))
val lines: org.apache.spark.rdd.RDD[String] = ParallelCollectionRDD[0] at parallelize at <console>:1
```



## 2）从外部存储（文件）创建RDD

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

// RDD.collect().forEach(s-> System.out.println(s));
RDD.collect().forEach(System.out::println);  // 方法引用

// 关闭环境
sparkContext.stop();
```

```scala
scala> val lines = sc.textFile("README.md");	// 相对路径：相对于$SPARK_HOME
val lines: org.apache.spark.rdd.RDD[String] = README.md MapPartitionsRDD[2] at textFile at <console>:1
```

**2.从HDFS中加载数据创建RDD**

代码与从从Linux本地文件系统加载数据创建RDD相识，只需做出如下修改

```java
JavaRDD<String> RDD = sparkContext.textFile("/opt/temp/test.txt"); 
JavaRDD<String> RDD = sparkContext.textFile("hdfs://localhost:8020/opt/temp/test.txt"); 
// 上面两种写法都是可以的
```



## 3）从其他RDD创建RDD

主要是通过一个RDD运算完后，再产生新的RDD。



## 4）直接创建RDD（new）

使用new的方式直接构造RDD，一般由Spark框架自身使用。



# 3 RDD并行度与分区

默认情况下，Spark可以将一个作业切分多个任务后，发送给Executor节点并行计算，而**能够并行计算的任务数量**我们称之为**并行度**。这个数量可以在构建RDD时指定。记住，**这里的并行执行的任务数量，并不是指的切分任务的数量**，不要混淆了。

-   读取内存数据时，数据可以按照并行度的设定进行数据的分区操作
-   读取文件数据时，数据是按照Hadoop文件读取的规则进行切片分区，而切片规则和数据读取的规则有些差异

在分布式程序中，网络通信开销很大，**Spark程序可以通过控制RDD分区方式来减少通信开销。**Spark中所有的RDD都可以进行分区，系统会根据一个针对键的函数对元素进行分区。虽然**Saprk不能控制每个键具体划分到哪个节点上，但是可以确保相同的键出现在同一个分区上。**

RDD的分区原则：

​	**分区的个数尽量等于集群中CPU核心（core）的数目**。对于不同的Spark部署模式而言，可通过设置 `spark.default.parallelism` 这个参数来配置默认的分区数目。各种模式下默认分区数目如下：

-   Local模式：默认为本地机器的cpu数目，若设置了local[n]，则默认为n
-   Standalone或Yarn模式：在 集群中所有cpu核数总和 与 2 这两者之间取较大者为默认值
-   Mesos模式：默认分区数为8

**Spark为RDD提供的两种分区方式：**

-   哈希分区（HashPartitioner）：是根据哈希值来分区
-   范围分区（RangePartitioner）：将一定范围的数据映射到一个分区中

此外，**Spark还支持自定义分区方式：**

-   即通过自定义的Partitioner对象来控制RDD的分区

    -   让自定义的类继承自`org.apache.spark.Partitioner`

    -   并实现其中抽象方法

    -   ```java
        public abstract int numPartitions()  // 用于返回创建的分区个数
            
        // 用于对输入的key做处理，并返回给key对应的分区ID
        // 分区ID范围 0 ~ numPartitions-1
        public abstract int getPartition(final Object key)  
        ```

# 4 常用RDD

## 4.1 什么是算子

-   算子：Operator（操作）算子的本质就是函数
-   RDD的方法和Scala集合对象的方法不一样
-   集合对象的方法都是在同一个节点的内存中完成的
-   **RDD的方法可以将计算逻辑发送到 Executor 端（分布式节点）执行**
-   为了区分不同的处理效果，所以将RDD的方法称之为算子
-   **RDD的方法外部的操作都是在Driver端执行**的，而**方法内部的逻辑代码是在Executor端执行**

算子主要有如下几种：

-   Transformation 转换算子： 对RDD进行相互转换，返回一个新的RDD，**懒加载**

-   Action 行动算子 ：**启动job**（runJob）

-   控制算子

## 4.2 惰性求值

RDD的转换算子都是惰性求值的，意味着我们在调用行动算子之前Spark不对开始进行计算任务。

相反，Spark会在内部记录下所有要求执行的操作的相关信息。

把数据读取到RDD的操作也是惰性执行的。例如，我们调用sc.textFile()时并没有立刻将数据读取进来，而是我们需要使用时才会读取。与转换算子一样，数据的读取也可能会多次执行。

Spark使用惰性求值，就可以把一些操作优化合并到一起减少计算数据的步骤，提高性能。



## 4.2 转换算子 Transformation

RDD处理过程中的 **转换** 操作主要是**根据已有的RDD创建新的RDD**，**每一次**通过Transformation算子计算后都会**返回一个一个新的RDD**，供给下一个转换算子使用。

简单来说，**转换就是功能的补充和封装，将旧的RDD包装成新的RDD**

RDD根据数据处理方式的不同将算子整体上分为Value类型、双Value类型和 Key-Value类型

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

注意：

​	在Scala中，可以使用该算子**将普通RDD转换为键值对RDD**

​	在Java中，需要有专门的算子来将普通RDD转换为键值对RDD。**mapToPair()算子即是map()算子的替代**

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
-   **将方法应用于RDD中的每个元素**，将返回的迭代器的所有内容构成新的RDD。
-   通常用来切分单词。与map的区别是：这个函数返回的值是list的一个，去除原有的格式

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

**Scala函数签名**

```scala
def filter(f: T => Boolean): RDD[T] = withScope
```

演示：

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

-   键值对RDD是Spark中许多操作常见的数据类型。键值对RDD常用于聚合计算。

-   Spark为包含键值对类型的RDD提供了一些专有的操作。这些RDD被称为 **Pair RDD。在Java中，通常用JavaPairRDD类表示。**

-   在Spark中有很多创建 pair RDD的方式。例如 map()算子，将普通RDD转换为键值对类型RDD。

    -   注意：在Java中，提供了专门创建pair RDD 的算子mapToPair（）

-   在Scala中，为了让提取键之后的数据能够在函数中使用，需要返回二元组。**隐式转换可以让二元组RDD支持附加的键值对函数。**

    -   注意：Java没有自带的二元组类型，**因此Java API让用户直接调用scala.Tuple2 类创建二元组。**

-   **在Scala、Java中，需要从内存中的数据集（例如：集合）创建Pair RDD时。**

    -   **在Scala中，需要调用 SparkContext.parallelize()** 。

        -   ```scala
            val tuple = new Tuple2[String, String]("1", "1")
            val value: RDD[(String, String)] = sc.parallelize(Seq(tuple))
            ```

    -   **在Java中，需要调用 JavaSparkContext.parallelizePairs()**

        -   ```java
            Tuple2<String,String> tuple2 = new Tuple2<>("1","1");
            final JavaPairRDD<String, String> JavaPairRDD = 
                jsc.parallelizePairs(Arrays.asList(tuple2));
            ```

-   注意：由于 Pair RDD中包含二元组，所以需要传递的函数应当操作的也是二元组（简单来说就是Pair RDD类的算子只能传入二元组，即数据源必须为Key-Value型）。



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
-   对pair RDD中的每个值应用一个返回迭代器函数，然后对返回的每个元素都生成一个对应原键的键值对记录。通常用于符号化

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

-   根据相同的key的数据进行value数据的**聚合操作**（合并具有相同键的值）
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

-   将数据源中的数据，相同的key的数据分为同一个组，形成一个**对偶元组**（对具有相同间的值进行分组）
    -   若具体相同键的二元组在不同分区，则会产生shuffle操作
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

-   在一个(K,V)的RDD上调用，K必须实现Ordered特质（`Comparable` 接口），**返回一个按照key进行排序的RDD**

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

##### subtractByKey

**方法签名**

```scala
def subtractByKey[W](other: JavaPairRDD[K, W]): JavaPairRDD[K, V]
def subtractByKey[W](other: JavaPairRDD[K, W], numPartitions: Int): JavaPairRDD[K, V]
def partitionBy(partitioner: Partitioner): JavaPairRDD[K, V]
```

**方法说明**

-   删掉RDD中键与other RDD中的键相同的元素

演示：

```java
public class SparkRDD_subtractByKey {
    public static void main(String[] args) {
        final SparkConf sparkConf = new SparkConf().setAppName("subtractByKey").setMaster("local[*]");
        final JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        final Tuple2<String, Integer> tuple1 = new Tuple2<>("hello", 1);
        final Tuple2<String, Integer> tuple2 = new Tuple2<>("world", 2);
        final Tuple2<String, Integer> tuple3 = new Tuple2<>("spark", 3);
        final Tuple2<String, Integer> tuple4 = new Tuple2<>("hello", 4);
        final Tuple2<String, Integer> tuple5 = new Tuple2<>("word", 5);
        final JavaPairRDD<String, Integer> pairRDD1 = jsc.parallelizePairs(Arrays.asList(tuple1, tuple2, tuple3));
        final JavaPairRDD<String, Integer> pairRDD2 = jsc.parallelizePairs(Arrays.asList(tuple4, tuple5));
        // 删除pairRDD1中 与 pairRDD2中的键相同的元素
        final JavaPairRDD<String, Integer> pairRDD = pairRDD1.subtractByKey(pairRDD2);
        final List<Tuple2<String, Integer>> result = pairRDD.collect();
        System.out.println(result);  //
    }
}
```

结果：

```
[spark,3)]
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
-   对两个RDD进行连接操作，确定第二 rdd.leftOuterJoin(other) 个RDD的键必须存在

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

##### 34）rightOuterJoin

**方法签名**

```java
public <W> JavaPairRDD<K, Tuple2<Optional<V>, W>> rightOuterJoin(final JavaPairRDD<K, W> other)

public <W> JavaPairRDD<K, Tuple2<Optional<V>, W>> rightOuterJoin(final JavaPairRDD<K, W> other, final int numPartitions)

public <W> JavaPairRDD<K, Tuple2<Optional<V>, W>> rightOuterJoin(final JavaPairRDD<K, W> other, final Partitioner partitioner) 
```

**方法说明**

-   类似与SQL的右外连接
-   对两个RDD进行连接操作，确定第一 rdd.rightOuterJoin(other) 个RDD的键必须存在

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
-   即将两个RDD中拥有相同的键的数据分组，如果没有的的填空
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

-   用于从一个键值对 RDD 中提取出所有的key，**返回一个只包含key的 RDD**。
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

-   获取对偶元组RDD中的所有value值，**返回一个只包含value的RDD**

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

每次调用新的行动算子，整个RDD都会重头开始计算（为了避免这种行为，有时候我们可以将中间结果进行持久化）

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
-   该算子要求输入的RDD类型与返回的RDD类型一致

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

Scala函数签名：

```scala
def collect(): Array[T] = withScope
```

注意：

​	collect算子不能用于大规模数据集上

演示：

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

Scala函数签名：

```scala
def count(): Long
```

演示：

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

Scala函数签名：

```scala
def take(num: Int): Array[T]
```

演示：

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
-   从源码中可以看出，先是将zeroValue赋值给jobResult，然后针对每个分区利用op函数与zeroValue进行计算，再利用op函数将taskResult和jobResult合并计算， 同时更新jobResult，最后，将jobResult的结果返回。

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



### 控制算子（持久化算子） 

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

#### cache与persist

 cache与persist的注意事项：

-   cache和persist 都是**懒执行**，必须有 action类算子触发执行
-   cache和persist 算子的返回值可以**赋值给变量**，在其他job 中直接**使用这个变量就是使用持久化的数据**了。持久化的单位是 partition(RDD组成)
-   cache和persist 算子之后不能紧跟 action算子

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



# 5 向Spark传递函数/方法

Spark的大部分转换算子和一部分的行动算子，都需要依赖用户传递的函数来计算。

## 5.1 python

在python中，我们有三种方式将函数传递给Spark。

传递较短的函数，我们可以通过Lambda表达式。

除了lambda表达式，我们还可以定义传递顶层函数或是定义的局部函数。

**在Python中传递函数：**

```python
# Lambda表达式传递函数
word = rdd.filter(lambda s: "error" in s)


# 传递函数
def containsError(s):
    return "error" in s
word = rdd.filter(containsError)
```

传递函数时需要小心，python会不经意间把函数所在的对象也序列化传出去。

**传递一个带字段引用的函数：（请不要怎么做）**

```python
class SearchFunctions(object):
    def __init__(self, query):
        self.query = query

    def isMatch(self, s):
        return self.query in s
    
    def getMatchesFunctionReference(self,rdd):
        return rdd.filter(self, isMatch)

    def getMatchesMeemberReference(self, rdd):
        return rdd.filter(lambda x:self.query in x)
```

替代方案：把所需的字段从对象中拿出来放入到局部变量中，然后传递局部变量

例如：

```python
# 传递不带字段引用的python函数
class WordFunctions(object):
    ...
    
    def getMatchesNoReference(self,rdd):
        # 安全：只把需要的字段提取到局部变量中
        query = self.query
        return rdd.filter(lambda x: query in x)
```



## 5.2 Scala

在Scala中，我们可以把定义的内联函数、方法的引用或静态方法（Scala没有static关键字，定义在伴生对象中的方法可以理解为静态方法）传递给Spark

**Scala中的函数传递方式：**

```scala
class SearchFunctions(val query: String) {
  def isMatch(s: String): Boolean = {
    s.contains(query)
  }

  def getMatchesFunctionReference(rdd: RDD[String]): RDD[String] = {
    rdd.map(isMatch)
  }

  def getMatchesFieldReference(rdd: RDD[String]) = {
    rdd.map(x => x.split(query))
  }

  def getMatchesNoReference(rdd: RDD[String]) = {
    val query_ = this.query
    rdd.map(x => x.split(query))
  }
}
```

说明：

​	如果在Scala中出现了 `NotSerializableException`，通常的问题在于我们传递了一个不可序列化的类中的函数或字段

记住：

​	传递局部可序列化变量或顶级对象中的函数始终是最安全的



## 5.3 Java

在Java中，函数(方法)需要实现了Spark的`org.apache.spark.api.java.function`包中任一接口的对象来传递。

下面是一些常用的函数接口

```java
package org.apache.spark.api.java.function;

import java.io.Serializable;

@FunctionalInterface
public interface Function<T1, R> extends Serializable {
  R call(T1 v1) throws Exception;
}

@FunctionalInterface
public interface Function2<T1, T2, R> extends Serializable {
  R call(T1 v1, T2 v2) throws Exception;
}

@FunctionalInterface
public interface FlatMapFunction<T, R> extends Serializable {
  Iterator<R> call(T t) throws Exception;
}
```

Java中常见的向Spark传递函数的方式：

-   **使用匿名内部类进行函数传递**

```java
// 向Spark中传递一个匿名内部类，本质上就是想要传递一个函数
// 但是这样写，代码比较笨拙，建议采用Lambda
JavaRDD<String> errors = lines.filter(new Function<String, Boolean>() {
    @Override
    public Boolean call(String s) throws Exception {
        return "error".contains(s);
    }
});
```

-   **使用具名类进行函数传递**

```java
// 向Spark传递一个类，本质上就是想传递类中的一个方法
// 笨拙的方式
class ContainsError implements Function<String, Boolean> {
    @Override
    public Boolean call(String s) throws Exception {
        return "error".contains(s);
    }
}

JavaRDD<String> errors = lines.filter(new ContainsError());
```

-   **带参数的Java函数类**

```java
class Contains implements Function<String,Boolean>{
    private String query;

    public Contains(String query) {
        this.query = query;
    }

    @Override
    public Boolean call(String x) throws Exception {
        return x.contains("error");
    }
}

JavaRDD<String> errors = lines.filter(new Contains("error"));
```

-   **Java8中使用Lambda表达式进行函数传递**

```java
// 使用Lambda表达式向Spark传递一个函数
// 优雅，代码可读性高
JavaRDD<String> errors = lines.filter((s) -> "error".contains(s));
```

说明：

​	匿名内部类和Lambda表达式都可以引用方法中封装的任意 final 变量，因此可以像在python、Scala一样把这写变量传递给Spark





