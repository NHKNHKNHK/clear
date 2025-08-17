# DStream

SparkStreaming模块将流式数据封装的数据结构：DStream（Discretized Stream，离散化数据流，连续不断的数据流），代表持续性的数据流和经过各种Spark算子操作后的结果数据流

## DStream是什么

离散数据流（DStream）是Spark Streaming最基本的抽象。它代表了一种连续的数据流，要么从某种数据源提取数据，要么从其他数据流映射转换而来。

**DStream内部是由一系列连续的RDD组成的**，每个RDD都包含了特定时间间隔内的一批数据。

DStream表示连续的数据流，可以通过Kafka、Flume、Kinesis等数据源创建，也可以通过现有的 DStream的高级操作来创建。

在内部，**DStream由一系列连续的rdd表示**，这是Spark对不可变的分布式数据集的抽象。**DStream中的每个RDD都包含一定时间间隔的数据**

-   Dstream是Spark Streaming的数据抽象，同DataFrame，其实底层依旧是RDD。
-   在DStream上应用的任何操作都转换为在底层rdd上的操作。
-   这些底层RDD转换是由Spark引擎计算的。DStream操作隐藏了大部分细节，并为开发人员提供了更高级的API。

DStream本质上是一个：一系列时间上连续的RDD（Seq[RDD]），**DStream = Seq[RDD]**

```scala
DStream = Seq[RDD]

DStream相当于一个序列（集合），里面存储的数据类型为RDD（Streaming按照时间间隔划分流式数据）
```

对DStream的数据进行操作也是按照RDD为单位进行的。

DStream中每批次数据RDD在处理时，各个RDD之间存在依赖关系，DStream直接也有依赖关系，RDD具有容错性，那么**DStream也具有容错性**

## DStream 编程模型

​	在Spark Streaming中，**将实时的数据分解成一系列很小的批处理任务**（前面我们也说过Spark Straming其实是准实时、微批次的）。批处理引擎 Spark Core 把**输入的数据按照一定的时间片**（比如说1s）**分成一段一段的数据**，**每一段数据都会转换成 RDD** 输入到 Spark Core中，然后将DStream操作转换为 RDD算子的相关操作，即转换操作、窗口操作以及输出操作。RDD算子操作产生的中间结果数据会保存在内存中，也可以将中间的结果数据输出到外部存储系统中进行保存。

## **DStream Operations**

 DStream类似RDD，里面包含很多函数，进行数据处理和输出操作，主要分为两大类： 

-   DStream#**Transformations**：将一个DStream转换为另一个DStream 

http://spark.apache.org/docs/3.2.0/streaming-programming-guide.html#transformations-on-dstreams 

-   DStream#**Output Operations**：将DStream中每批次RDD处理结果resultRDD输出 

http://spark.apache.org/docs/3.2.0/streaming-programming-guide.html#output-operations-on-dstreams

### **函数概述** 

DStream中包含很多函数，大多数与RDD中函数类似，主要分为两种类型： 

-   **转换函数【Transformation函数】**

DStream中的大部分函数都与RDD中的相似

DStream中还有一些特殊函数，针对特定类型应用使用的函数，比如updateStateByKey状态函数、window窗口函数等

-   **输出函数【Output函数】**

DStream中每批次结果RDD输出使用foreachRDD函数，前面使用的print函数底层也是调用foreachRDD函数



在DStream中有两个重要的函数，都是针对每批次数据RDD进行操作的，更加接近底层，性能更好，强烈推荐使用：

-   转换函数transform：将一个DStream转换为另外一个DStream

-   输出函数foreachRDD：将一个DStream输出到外部存储系统

 在SparkStreaming企业实际开发中，**建议：能对RDD操作的就不要对DStream操作，当调用DStream中某个函数在RDD中也存在，使用针对RDD操作**



###  **转换函数：transform**

**map**

```java
public <U> JavaDStream<U> map(final Function<T, U> f)
    
// 将源 DStream 的每个元素，传递到函数 f 中进行转换操作，得到一个新的DStream
```

**flatMap**

```java
public <K2, V2> JavaPairDStream<K2, V2> mapToPair(final PairFunction<T, K2, V2> f)
    
// 与map()相似，对 DStream 中的每个元素应用给定函数 f，返回由各元素输出的迭代器组成的DStream    
```

**mapToPair**

```java
public <K2, V2> JavaPairDStream<K2, V2> mapToPair(final PairFunction<T, K2, V2> f)
```

**flatMapToPair**

```java
public <K2, V2> JavaPairDStream<K2, V2> flatMapToPair(final PairFlatMapFunction<T, K2, V2> f)
    
// 可以看成是先flatMap以后，再进行mapTopair
```

**filter**

```java
public JavaDStream<T> filter(final Function<T, Boolean> f)

// 返回一个新的 DStream，仅包含源 DStream中经过 f 函数计算结果为true的元素
```

**repartition**

```java
public JavaDStream<T> repartition(final int numPartitions)
    
// 用于指定 DStream的分区数 
```

**union**

```java
public JavaDStream<T> union(final JavaDStream<T> that)

// 返回一个新的 DStream，包含源DStream和其他DStream中的所有元素
```

**count**

```java
public JavaDStream<Long> count()

// 统计源DStream 中每个RDD包含的元素个数，返回一个新的DStream
```

**reduce**

```java
public JavaDStream<T> reduce(final Function2<T, T, T> f)

// 使用函数 f 将源DStream中的每个RDD的元素进行聚合操作，返回一个新DStream
```

**countByValue**

```java
public JavaPairDStream<T, Long> countByValue()
public JavaPairDStream<T, Long> countByValue(final int numPartitions)

// 计算 DStream 中每个RDD内的元素出现的频次，并返回一个新的 DStream<T, Long>
// 其中T是RDD中每个元素的类型，Long是元素出现的频次
```

**reduceByKey**

```java
public JavaPairDStream<K, V> reduceByKey(final Function2<V, V, V> func)
    
public JavaPairDStream<K, V> reduceByKey(final Function2<V, V, V> func, final int numPartitions)
    
public JavaPairDStream<K, V> reduceByKey(final Function2<V, V, V> func, final Partitioner partitioner)

// 当一个类型为K-V的DStream被调用时，返回一个类型为K-V的新的 DStream（简单来说，就是将每个批次中键相同的记录进行规约）
// 其中，每个键的值V都是使用聚合函数 func 汇总得到的。
// 注意：
// 		默认情况下，使用Spark的默认并行度提交任务（本地模式下并行度为2，集群模式下并行度为8）
//		可以通过配置参数 来设置不同的并行任务数    
```

**groupByKey**

```java
public JavaPairDStream<K, Iterable<V>> groupByKey()
public JavaPairDStream<K, Iterable<V>> groupByKey(final int numPartitions) 
public JavaPairDStream<K, Iterable<V>> groupByKey(final Partitioner partitioner)

// 简单来说，就是将每个批次中的记录根据键进行分组
```

**join**

```java
public <W> JavaPairDStream<K, Tuple2<V, W>> join(final JavaPairDStream<K, W> other)
public <W> JavaPairDStream<K, Tuple2<V, W>> join(final JavaPairDStream<K, W> other, final int numPartitions)
public <W> JavaPairDStream<K, Tuple2<V, W>> join(final JavaPairDStream<K, W> other, final Partitioner partitioner)
    
// 当被调用类型分别为(K,V)和(K,W)键值对的两个DStream时，返回类型为(K,(V,W))键值对的DStream    
// 注意：两个流之间的join需要两个流的批次大小一致（即采集周期一致）**，这样才能做到同时触发计算    
```

**cogroup**

```java
public <W> JavaPairDStream<K, Tuple2<Iterable<V>, Iterable<W>>> cogroup(final JavaPairDStream<K, W> other)

public <W> JavaPairDStream<K, Tuple2<Iterable<V>, Iterable<W>>> cogroup(final JavaPairDStream<K, W> other, final int numPartitions)

public <W> JavaPairDStream<K, Tuple2<Iterable<V>, Iterable<W>>> cogroup(final JavaPairDStream<K, W> other, final Partitioner partitioner)

// 当被调用的两个DStream 类型为(K,V)和(K,W)键值对的两个DStream时，则返回类型为(K,(Iterable(V),Iterable(W))的新的DStream
```

**transform**

```java
public <U> JavaDStream<U> transform(final Function<R, JavaRDD<U>> transformFunc)
public <U> JavaDStream<U> transform(final Function2<R, Time, JavaRDD<U>> transformFunc)

// 通过对源DStream 中的每个RDD应用 RDD-to-RDD 函数返回一个新DStream，这样就可以在DStream中做任意RDD的操作
// 什么时候使用transform
//     1.DStream功能不完善
//     2.需要代码周期性执行
```

​	需要记住的是，尽管这些函数看起来像作用在整个流上一样，但**事实上每个DStream在内部是由许多RDD（批次）组成，且无状态转化操作是分别应用到每个RDD上的。**

例如：reduceByKey()会归约每个时间区间中的数据，但不会归约不同区间之间的数据。

此外，DStream中还有一些特殊函数，针对特定类型应用使用的函数，比如updateStateByKey状态函数、window窗口函数等

#### 无状态转化操作

​	无状态转化操作就是**把简单的RDD转化操作应用到每个批次上**，也就是**转化DStream中的每一个RDD**。部分无状态转化操作列在了下表中。

​	注意，针对键值对的DStream转化操作(比如 reduceByKey())要添加import StreamingContext._才能在Scala中使用，但是**在Java中不存在隐式转换**。	

##### Transform演示

​	通过对源 DStream中的每个RDD应用 RDD-to-RDD 函数返回一个新 DStream，这样就**可以在DStream 中做任意的RDD操作。**

下面是一段伪代码，简述一下transform()方法

```java
// transform方法可以将底层RDD获取到后进行操作
        // 何时使用transform
        //     1.DStream功能不完善
        //     2.需要代码周期性执行

        // Code：Driver端
        JavaDStream<Object> newDS = lines.transform(
                rdd -> {
                    // Code：Driver端（周期性执行）
                    rdd.map(
                            str -> {
                                // Code：Executor端
                            }
                    )
                }
        );
        
        // Code：Driver端
        JavaDStream<Object> newDS2 = lines.map(
                data -> {
                    // Code：Executor端
                }
        );；
```

下面演示使用transform()方法将一行语句分割成多个单词

```java
/**
 * 使用transform()方法将一行语句分割成多个单词
 */
public class SparkStreaming_Transform {
    public static void main(String[] args) throws InterruptedException {
        // 创建 SparkCon 对象
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("transform");
        // 创建 SparkContext 对象，它是所有任务计算的源头
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        // 设置日志输出级别
        jsc.setLogLevel("ERROR");
      
        // 创建 StreamingContext 对象，采集周期5s
        JavaStreamingContext jssc = new JavaStreamingContext(jsc, Durations.seconds(5));
        // 连接socket服务，参数 socket服务地址、端口、存储级别(我们这里使用默认的)
        JavaReceiverInputDStream<String> lines = jssc.socketTextStream("192.168.43.2", 9999);

        // 使用 RDD-to-RDD 函数，返回新的DStream对象（即words）
        JavaDStream<String> words = lines.transform(
                rdd -> rdd.flatMap(
                        line -> Arrays.asList(line.split(" ")).iterator()
                )
        );

        // 打印输出结果
        words.print();

        // 开启流式计算
        jssc.start();
        jssc.awaitTermination();
    }
}
```

执行如下命令启动服务端且监听socket服务，并输入如下内容

```shell
C:\Users\没事我很好>nc -lp 9999
I am learing Spark Streaming now
```

结果如下

```
-------------------------------------------
Time: 1684044560000 ms
-------------------------------------------

-------------------------------------------
Time: 1684044565000 ms
-------------------------------------------
I
am
learing
Spark
Streaming
now
```



##### join演示

​	**两个流之间的join需要两个流的批次大小一致（即采集周期一致）**，这样才能做到同时触发计算。计算过程就是对当前批次的两个流中各自的RDD进行join，**与两个RDD的join效果相同**

```java
/**
 * 使用join()方法将两个DStream中各自的RDD进行join
 */
public class SparkStreaming_join {
    public static void main(String[] args) throws InterruptedException {
        // 创建 SparkCon 对象
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("transform");
        // 创建 SparkContext 对象，它是所有任务计算的源头
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        // 设置日志输出级别
        jsc.setLogLevel("ERROR");

        // 创建 StreamingContext 对象，采集周期5s
        JavaStreamingContext jssc = new JavaStreamingContext(jsc, Durations.seconds(5));
        // 连接socket服务，参数 socket服务地址、端口、存储级别(我们这里使用默认的)
        JavaReceiverInputDStream<String> data9999 = jssc.socketTextStream("192.168.43.2", 9999);
        JavaReceiverInputDStream<String> data8888 = jssc.socketTextStream("192.168.43.2", 8888);

        // 将两个流转换为K-V类型
        JavaPairDStream<String, Integer> pairDStream9999 = data9999.mapToPair(word -> new Tuple2<>(word, 9));
        JavaPairDStream<String, Integer> pairDStream8888 = data8888.mapToPair(word -> new Tuple2<>(word, 8));

        // 流的JOIN操作 所谓的DStream的join操作，其实就是两个RDD的join
        JavaPairDStream<String, Tuple2<Integer, Integer>> joinDS = pairDStream9999.join(pairDStream8888);

        // 打印输出结果
        joinDS.print();

        // 开启流式计算
        jssc.start();
        jssc.awaitTermination();
    }
}
```

执行如下命令启动服务端且监听socket服务，并输入如下内容(注意需要同时输入)

```
C:\Users\没事我很好>nc -lp 9999
a
a
a

C:\Users\没事我很好>nc -lp 8888
a
a
a
```

结果如下

```
-------------------------------------------
Time: 1684045595000 ms
-------------------------------------------
(a,(9,8))
(a,(9,8))
(a,(9,8))
```



#### 有状态转换操作

-   使用有状态操作时，并行设置检查点

```java
public void checkpoint(final String directory)
```



##### updateStateByKey演示

```java
public <S> JavaPairDStream<K, S> updateStateByKey(final Function2<List<V>, Optional<S>, Optional<S>> updateFunc)
    
public <S> JavaPairDStream<K, S> updateStateByKey(final Function2<List<V>, Optional<S>, Optional<S>> updateFunc, final int numPartitions)
    
public <S> JavaPairDStream<K, S> updateStateByKey(final Function2<List<V>, Optional<S>, Optional<S>> updateFunc, final Partitioner partitioner)
    
public <S> JavaPairDStream<K, S> updateStateByKey(final Function2<List<V>, Optional<S>, Optional<S>> updateFunc, final Partitioner partitioner, final JavaPairRDD<K, S> initialRDD)
    
// 返回一个新状态的DStream，其中通过在键的 先前状态 和键的 新值上应用给定函数updateFunc 来更新每一个键的状态。
// 该操作方法主要被用于维护每一个键的任意状态数据    
```

​	**UpdateStateByKey原语用于记录历史记录**，有时，我们需要在DStream中跨批次维护状态(例如流计算中累加wordcount)。针对这种情况，updateStateByKey()为我们提供了对一个状态变量的访问，用于键值对形式的DStream。给定一个由(键，事件)对构成的 DStream，并传递一个指定如何根据新的事件更新每个键对应状态的函数，它可以构建出一个新的 DStream，其内部数据为(键，状态) 对。

updateStateByKey() 的结果会是一个新的DStream，其内部的RDD 序列是由每个时间区间对应的(键，状态)对组成的。

updateStateByKey操作使得我们可以在用新信息进行更新时保持任意的状态。为使用这个功能，需要做下面两步：

1.  定义状态，状态可以是一个任意的数据类型。
2.  定义状态更新函数，用此函数阐明如何使用之前的状态和来自输入流的新值对状态进行更新。

注意：**使用**updateStateByKey**（有状态操作）需要对检查点目录进行配置**，会使用检查点来保存状态

```java
/**
 * 有状态操作wordCount
 * /opt/software/spark-local/bin/spark-submit --class com.clear.dstream.SparkStreaming_updateStateByKey --master local /opt/temp/spark-streaming-demo-1.0.jar
 */
public class SparkStreaming_updateStateByKey {
    public static void main(String[] args) throws InterruptedException {
        // 创建 SparkCon 对象
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("updateStateByKey");
        // 创建 SparkContext 对象，它是所有任务计算的源头
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        // 设置日志输出级别
        jsc.setLogLevel("ERROR");
        // 初始化 StreamingContext，采集周期5s
        JavaStreamingContext jssc = new JavaStreamingContext(jsc, Durations.seconds(5));
        // todo 设置检查点目录，使用有状态操作（updateStateByKey）必须配置检查点目录
        // 否则报错 java.lang.IllegalArgumentException: requirement failed: The checkpoint directory has not been set. Please set it by StreamingContext.checkpoint().
        //jssc.checkpoint("./");

        // 无状态数据操作，只对当前的采集周期数据进行出来
        // 在某些场合，需要保留数据统计结果（状态），实现数据汇总
        //
        // 连接socket服务，参数 socket服务地址、端口、存储级别(我们这里使用默认的)
        JavaReceiverInputDStream<String> dStream = jssc.socketTextStream("192.168.43.2", 9999);

        // 进行计算任务
        JavaDStream<String> wordDStream = dStream.flatMap(line -> Arrays.asList(line.split(" ")).iterator());
        JavaPairDStream<String, Integer> wordToOneDStream = wordDStream.mapToPair(word -> new Tuple2<>(word, 1));
        //JavaPairDStream<String, Integer> wordCountDStream = wordToOneDStream.reduceByKey((x, y) -> (x + y));
        // todo 调用updateStateByKey：根据key对数据的状态进行更新
        // public <S> JavaPairDStream<K, S> updateStateByKey(
        //      final Function2<List<V>, Optional<S>, Optional<S>> updateFunc)
        //          List<V>
        //          Optional<S>
        //          Optional<S>
        JavaPairDStream<String, Integer> wordCountDStream = wordToOneDStream.updateStateByKey(
                // 统计全局的word count
                new Function2<List<Integer>, Optional<Integer>, Optional<Integer>>() {
                  //  private static final long serialVersionUID = -7837221857493546768L;

                    // 参数valueList:相当于这个batch,这个key新的值，可能有多个,比如（hadoop,1）(hadoop,1)传入的可能是(1,1)
                    // 参数oldState:就是指这个key之前的状态
                    public Optional<Integer> call(List<Integer> valueList, Optional<Integer> oldState) throws Exception {
                        Integer newState = 0;
                        // 如果oldState之前已经存在，那么这个key可能之前已经被统计过，否则说明这个key第一次出现
                        if (oldState.isPresent()) {
                            newState = oldState.get();
                        }
                        // 更新state
                        for (Integer value : valueList) {
                            newState += value;
                        }
                        return Optional.of(newState);
                    }
                });

        // 打印输出结果
        wordCountDStream.print();

        // 开启流式计算
        jssc.start();
        // 用于保持程序运行，除非被干预停止
        jssc.awaitTermination();
    }
}
```

打包上次至服务器运行，监听window平台9999端口

```diff
[root@kk01 temp]# /opt/software/spark-local/bin/spark-submit --class com.clear.dstream.SparkStreaming_updateStateByKey --master local /opt/temp/spark-streami
ng-demo-1.0.jar

.....
-------------------------------------------
Time: 1683985595000 ms
-------------------------------------------
(hello,1)

-------------------------------------------
Time: 1683985600000 ms
-------------------------------------------
(hello,2)

-------------------------------------------
Time: 1683985605000 ms
-------------------------------------------
(a,5)
(hello,2)

-------------------------------------------
Time: 1683985610000 ms
-------------------------------------------
(a,5)
(hello,2)
```

```
C:\Users\没事我很好>nc -lp 9999
hello
hello
a
a
a
a
a
```



##### WindowOperations 窗口操作

​	在Spark Streaming中，为DStream提供了窗口操作，即在DStream上，将一个可配置的长度设置为窗口，以一个可配置的速率向前移动窗口。

​	根据窗口操作，对窗口内的数据进行计算，每次落在窗口内的RDD数据都会被聚合起来计算，生成的RDD会作为windowDStream的一个RDD。

​	Window Operations可以设置窗口的大小和滑动窗口的间隔来动态的获取当前Steaming的允许状态。所有基于窗口的操作都需要两个参数，分别为 **窗口时长** 以及 **滑动步长**。

-   窗口时长：计算内容的时间范围；
-   滑动步长：隔多久触发一次计算。

注意：**这两者都必须为采集周期大小的整数倍。**

###### window()演示

下面是基于窗口操作的WordCount：3秒一个批次，窗口12秒，滑步6秒。

```java
public class SparkStreaming_window_wordCount {
    public static void main(String[] args) throws InterruptedException {
        // 创建 SparkCon 对象
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("transform");
        // 创建 SparkContext 对象，它是所有任务计算的源头
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        // 设置日志输出级别
        jsc.setLogLevel("ERROR");

        // 创建 StreamingContext 对象，采集周期5s
        JavaStreamingContext jssc = new JavaStreamingContext(jsc, Durations.seconds(3));
        // 连接socket服务，参数 socket服务地址、端口、存储级别(我们这里使用默认的)
        JavaReceiverInputDStream<String> dStream = jssc.socketTextStream("192.168.43.2", 9999);


        JavaDStream<String> wordDS = dStream.flatMap(
                line -> Arrays.asList(line.split(" ")).iterator());
        JavaPairDStream<String, Integer> wordToOneDS = wordDS.mapToPair(
                word -> new Tuple2<>(word, 1));

        // 窗口的范围应该是采集周期的整数倍
        // 窗口是可以滑动的，但是默认情况下，按照一个采集周期进行滑动
        // 这样的话，可能会出现重复数据的计算，为了避免这种情况，可以改变滑动的步长
        // public JavaPairDStream<K, V> window(
        //      final Duration windowDuration,  window的宽度,必须是采集周期的整数倍
        //      final Duration slideDuration)   window滑动间隔,必须是采集周期的整数倍
        JavaPairDStream<String, Integer> windowDS = wordToOneDS.window(
                Durations.seconds(12),
                Durations.seconds(6));

        JavaPairDStream<String, Integer> wordCountDS = windowDS.reduceByKey(
                ((v1, v2) -> (v1 + v2)));


        // 打印输出结果
        wordCountDS.print();

        // 开启流式计算
        jssc.start();
        jssc.awaitTermination();
    }
}
```

输入如下命令，并输入如下内容

```shell
C:\Users\没事我很好>nc -lp 9999
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
```

结果如下

```diff
-------------------------------------------
Time: 1684046916000 ms
-------------------------------------------
(hello,2)

-------------------------------------------
Time: 1684046922000 ms
-------------------------------------------
(hello,6)

-------------------------------------------
Time: 1684046928000 ms
-------------------------------------------
(hello,8)

-------------------------------------------
Time: 1684046934000 ms
-------------------------------------------
(hello,5)

-------------------------------------------
Time: 1684046940000 ms
-------------------------------------------
(hello,1)

-------------------------------------------
Time: 1684046946000 ms
-------------------------------------------
```



###### rudeceByKeyAndWindow()演示

演示使用 reduceByKeyAndWindow()方法统计3个时间内不同字母出现的次数

```java
public class SparkStreaming_reduceByKeyAndWindow {
    public static void main(String[] args) throws InterruptedException {
        // 创建 SparkCon 对象
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("transform");
        // 创建 SparkContext 对象，它是所有任务计算的源头
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        // 设置日志输出级别
        jsc.setLogLevel("ERROR");

        // 创建 StreamingContext 对象，采集周期1s
        JavaStreamingContext jssc = new JavaStreamingContext(jsc, Durations.seconds(1));
        // 连接socket服务，参数 socket服务地址、端口、存储级别(我们这里使用默认的)
        JavaReceiverInputDStream<String> dStream = jssc.socketTextStream("192.168.43.2", 9999);

        //  todo 设置检查点目录，使用有状态操作（reduceByKeyAndWindow 中参数 final Function2<V, V, V> invReduceFunc）必须配置检查点目录
        jssc.checkpoint("/opt/temp/cp");

        JavaDStream<String> wordDS = dStream.flatMap(
                line -> Arrays.asList(line.split(" ")).iterator());
        JavaPairDStream<String, Integer> wordToOneDS = wordDS.mapToPair(
                word -> new Tuple2<>(word, 1));

        // 调用 reduceByKeyAndWindow 操作
        // 当窗口范围比较大，但是滑动幅度比较小，那么可以采取增加和删除数据的方式
        // 无需重复计算，提升性能
        /**
         * public JavaPairDStream<K, V> reduceByKeyAndWindow(
         *      final Function2<V, V, V> reduceFunc,    加上新进入窗口的批次中的元素
         *      final Function2<V, V, V> invReduceFunc, 移除离开窗口的老批次中的元素
         *      final Duration windowDuration,  窗口宽度
         *      final Duration slideDuration)   滑动幅度
         */
        JavaPairDStream<String, Integer> windowWordsDS = wordToOneDS.reduceByKeyAndWindow(
                new Function2<Integer, Integer, Integer>() {
                    @Override
                    public Integer call(Integer v1, Integer v2) throws Exception {
                        return v1 + v2;
                    }
                },
                new Function2<Integer, Integer, Integer>() {
                    @Override
                    public Integer call(Integer v1, Integer v2) throws Exception {
                        return v1 - v2;
                    }
                },
                Durations.seconds(3),
                Durations.seconds(1)
        );

        // 打印输出结果
        windowWordsDS.print();

        // 开启流式计算
        jssc.start();
        jssc.awaitTermination();
    }
}
```

打包上传至服务器运行

```
[root@kk01 temp]# /opt/software/spark-local/bin/spark-submit --class com.clear.dstream.SparkStreaming_reduceByKeyAndWindow --master local /opt/temp/spark-str
eaming-demo-1.0.jar
```

使用如下命令，每秒输入一个字符，具体如下

```shell
C:\Users\没事我很好>nc -lp 9999
a
a
b
b
c
```

结果如下

```diff
-------------------------------------------
Time: 1684049366000 ms
-------------------------------------------
(a,1)

-------------------------------------------
Time: 1684049367000 ms
-------------------------------------------
(a,2)

-------------------------------------------
Time: 1684049368000 ms
-------------------------------------------
(a,2)
(b,1)

-------------------------------------------      # 可以看出，第四秒时，只剩下一个a
Time: 1684049369000 ms
-------------------------------------------
(a,1)
(b,2)

-------------------------------------------		# 第五秒时，a已经不见了
Time: 1684049370000 ms
-------------------------------------------
(a,0)
(b,2)
(c,1)

-------------------------------------------
Time: 1684049371000 ms
-------------------------------------------
(a,0)
(b,1)
(c,1)

-------------------------------------------
Time: 1684049372000 ms
-------------------------------------------
(a,0)
(b,0)
(c,1)

-------------------------------------------
Time: 1684049373000 ms
-------------------------------------------
(a,0)
(b,0)
(c,0)
```



###### 常用窗口操作方法

常用的DStream API 与 WindowOperations 方法如下

```java
public JavaPairDStream<K, V> window(final Duration windowDuration)

public JavaPairDStream<K, V> window(final Duration windowDuration, final Duration slideDuration)
    
// 基于对源DStream窗化的批次进行计算返回一个新的Dstream
// 参数说明
// 		windowDuration: window 的宽度(时间长度),必须是采集周期的整数倍
//      slideDuration:  window 滑动间隔(时间长度),必须是采集周期的整数倍
```

```java
public JavaDStream<Long> countByWindow(final Duration windowDuration, final Duration slideDuration)
    
//  返回一个滑动窗口计数流中的元素个数
// 参数说明
// 		windowDuration: window 的宽度(时间长度),必须是采集周期的整数倍
//      slideDuration:  window 滑动间隔(时间长度),必须是采集周期的整数倍
```

```java
public JavaDStream<T> reduceByWindow(final Function2<T, T, T> reduceFunc, final Duration windowDuration, final Duration slideDuration)

public JavaDStream<T> reduceByWindow(final Function2<T, T, T> reduceFunc, final Function2<T, T, T> invReduceFunc, final Duration windowDuration, final Duration slideDuration)
    
// 通过使用自定义函数整合滑动区间流元素来创建一个新的单元素流；
// 参数说明
// 		reduceFunc	当前窗口元素聚合规则
//		invReduceFunc 与要离开窗口元素聚合规则
// 		windowDuration: window 的宽度(时间长度),必须是采集周期的整数倍
//      slideDuration:  window 滑动间隔(时间长度),必须是采集周期的整数倍
```

```java
public JavaPairDStream<K, V> reduceByKeyAndWindow(final Function2<V, V, V> reduceFunc, final Duration windowDuration)

public JavaPairDStream<K, V> reduceByKeyAndWindow(final Function2<V, V, V> reduceFunc, final Duration windowDuration, final Duration slideDuration)

public JavaPairDStream<K, V> reduceByKeyAndWindow(final Function2<V, V, V> reduceFunc, final Duration windowDuration, final Duration slideDuration, final int numPartitions)

public JavaPairDStream<K, V> reduceByKeyAndWindow(final Function2<V, V, V> reduceFunc, final Duration windowDuration, final Duration slideDuration, final Partitioner partitioner)
    
// 基于滑动窗口对(K,V)类型的DStream中的值，按照K应用聚合函数 reduceFunc 进行聚合操作，返回一个新DStream

```



```java
public JavaPairDStream<K, V> reduceByKeyAndWindow(final Function2<V, V, V> reduceFunc, final Function2<V, V, V> invReduceFunc, final Duration windowDuration, final Duration slideDuration)
    
public JavaPairDStream<K, V> reduceByKeyAndWindow(final Function2<V, V, V> reduceFunc, final Function2<V, V, V> invReduceFunc, final Duration windowDuration, final Duration slideDuration, final int numPartitions, final Function<Tuple2<K, V>, Boolean> filterFunc)
    
public JavaPairDStream<K, V> reduceByKeyAndWindow(final Function2<V, V, V> reduceFunc, final Function2<V, V, V> invReduceFunc, final Duration windowDuration, final Duration slideDuration, final Partitioner partitioner, final Function<Tuple2<K, V>, Boolean> filterFunc)
    
// 更高效的 reduceByKeyAndWindow()实现版本。每个窗口的聚合值，都是基于先前窗口的聚合值进行增量计算得到的。该操作会对进入滑动窗口的新数据进行聚合操作，并对离开窗口的历史数据进行逆向聚合操作（即以 invReduceFunc 参数传入）
```

```java
public JavaPairDStream<T, Long> countByValueAndWindow(final Duration windowDuration, final Duration slideDuration)

public JavaPairDStream<T, Long> countByValueAndWindow(final Duration windowDuration, final Duration slideDuration, final int numPartitions)

// 基于滑动窗口计算源DStream中每个RDD内元素出现的频次，返回一个由(K,V)组成的新的DStream
// 其中，K为RDD中的元素类型，V为元素在滑动窗口出现的次数
```



### 输出函数 output 

​	在Spark Streaming中，**DStream输出操作是真正触发DStream上所有转换操作进行计算**（与RDD中的惰性求值类似，类似于RDD中的Action算子操作）**的操作**，然后进过输出操作，DStream 中的数据才会进行交互，如将数据写入到分布式文件系统、数据库以及其他应用中。

​	**如果StreamingContext中没有设定输出操作，整个context就都不会启动。**

注意：如果SparkStreaming程序中没有 **输出操作**，会报错，如下

```diff
java.lang.IllegalArgumentException: requirement failed: No output operations registered, so nothing to execute
```



#### 常用输出操作方法

##### print

```java
public void print()
public void print(final int num)
// 在 Driver 中打印DStream中每一批次数据的最开始10个元素。这用于开发和调试。在Python API中，同样的操作叫print()。
```

```
	saveAsTextFiles(prefix, [suffix])：以text文件形式存储这个DStream的内容。每一批次的存储文件名基于参数中的prefix和suffix。”prefix-Time_IN_MS[.suffix]”。
	saveAsObjectFiles(prefix, [suffix])：以Java对象序列化的方式将Stream中的数据保存为 SequenceFiles . 每一批次的存储文件名基于参数中的为"prefix-TIME_IN_MS[.suffix]". Python中目前不可用。


 TODO saveAsTextFiles|saveAsObjectFiles|saveAsHadoopFiles 算子
*       功能:
*           将每个RDD 保存为 text格式的文件
*           将每个RDD 保存为 Java对象序列化格式的文件
*           将每个RDD 保存为 Hadoop files格式的文件
*       参数:
*           def saveAsTextFiles(prefix: String, suffix: String = ""): Unit
*               prefix: 文件名称_前缀
*               suffix: 文件名称_后缀
*               最终格式: prefix-time.suffix
*
*    TODO 保存到 HDFS
*       使用 foreachRDD 将每个RDD保存到HDFS
```

##### saveAsHadoopFiles

```java
public void saveAsHadoopFiles(final String prefix, final String suffix)

public <F extends OutputFormat<?, ?>> void saveAsHadoopFiles(final String prefix, final String suffix, final Class<?> keyClass, final Class<?> valueClass, final Class<F> outputFormatClass)

public <F extends OutputFormat<?, ?>> void saveAsHadoopFiles(final String prefix, final String suffix, final Class<?> keyClass, final Class<?> valueClass, final Class<F> outputFormatClass, final JobConf conf)
    
// 将DStream 中的数据保存为 Hadoop files. 
// 其中，每一批次的存储文件名基于参数中的为"prefix-TIME_IN_MS[.suffix]"。Python API 中目前不可用。
```

##### foreachRDD

```java
public void foreachRDD(final VoidFunction<R> foreachFunc)

public void foreachRDD(final VoidFunction2<R, Time> foreachFunc)

// 这是最通用(最基本)的输出操作，即将函数 foreachFunc 用于产生于 DStream 的每一个RDD。
// 其中参数传入的函数 foreachFunc 应该实现将每一个RDD中数据推送到外部系统，如将RDD存入文件或者通过网络将其写入数据库
// 换句话来说，就是遍历处理 DStream 中的每批次对应的 RDD，可以将每个RDD的数据写入到外部的存储系统，如数据库、Redis等

// 注意：使用foreachRDD时，不会出现时间戳
    
// 注意：
1)	连接不能写在driver层面（序列化）
2)	如果写在foreach则每个RDD中的每一条数据都创建，得不偿失；
3)	增加foreachPartition，在分区创建（获取）。
```

方法说明：

-   简单来说，就是对当前 DStream对象中的RDD进行操作

注意：

​	**必须对抽取出来的rdd执行 action类算子，代码才能执行**

演示：

```java
package com.clear.spark.dstream;

import com.clear.spark.wc.SparkStreamingWordCount2;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaPairDStream;
import org.apache.spark.streaming.api.java.JavaReceiverInputDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.apache.commons.lang3.time.FastDateFormat;
import scala.Tuple2;

import java.util.Arrays;

public class SparkStreaming_foreachRDD {
    public static void main(String[] args) {
        // 1.构建StreamingContext流式上下文实例对象
        // a.创建SparkConf对象，设置应用配置信息
        SparkConf sparkConf = new SparkConf()
                .setAppName(SparkStreaming_foreachRDD.class.getSimpleName())
                .setMaster("local[4]");
        // b.创建流式上下文对象, 传递SparkConf对象，TODO: 时间间隔 -> 用于划分流式数据为很多批次Batch
        JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(5));
        // 调整日志级别，便于看到输出结果
        jssc.sparkContext().setLogLevel("WARN");

        //  2. 从数据源端读取数据，此处是TCP Socket读取数据
        JavaReceiverInputDStream<String> inputDStream = jssc.socketTextStream("192.168.188.128", 9999);

        // 3. 对每批次的数据进行词频统计
        // TODO: 在DStream中，能对RDD操作的不要对DStream操作。
        JavaPairDStream<String, Integer> resultDStream = inputDStream.transformToPair(
                rdd -> {
                    JavaPairRDD<String, Integer> resultRDD = rdd
                            // 过滤不符合规则的数据
                            .filter(line -> line != null && line.trim().length() > 0)
                            // 按照分隔符划分单词
                            .flatMap(line -> Arrays.asList(line.split("\\s+")).iterator())
                            // 转换数据为二元组，表示每个单词出现一次
                            .mapToPair(word -> new Tuple2<>(word, 1))
                            // 按照单词分组，聚合统计
                            .reduceByKey((tmp, item) -> tmp + item);
                    return resultRDD;
                }
        );

        // 4. 将结果数据输出
        // todo 针对每批次结果RDD进行操作
        resultDStream.foreachRDD((resultRDD, batchTime) -> {    // batchTime 表示每批次时间
            // 使用lang3包下FastDateFormat日期格式类，属于线程安全的
            // 将 batchTime进行转换，转换为 yyyy-MM-dd HH:mm:ss
            String formatted = FastDateFormat.getInstance("yyyy-MM-dd HH:mm:ss").format(batchTime.milliseconds());
            System.out.println("-------------------------------------------");
            System.out.println("Time: " + formatted);
            System.out.println("-------------------------------------------");
            // 判断结果RDD是否有数据，没有数据则不打印
            if (!resultRDD.isEmpty()) {
                // todo 针对RDD数据进行输出，在SparkCore在如何操作，此处就如何操作
                resultRDD.coalesce(1).foreachPartition(iter ->
                        // 遍历输出
                        iter.forEachRemaining(System.out::println));
                // 等同于
                // iter.forEachRemaining(item -> System.out.println(item)));
            }
        });

        // 5. 对于流式应用来说，需要启动应用
        jssc.start();
        // 流式应用启动以后，正常情况一直运行（接收数据、处理数据和输出数据），除非人为终止程序或者程序异常停止
        try {
            jssc.awaitTermination();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        // 关闭流式应用(参数一：是否关闭SparkContext，参数二：是否优雅的关闭）
//        jssc.stop(true, true);
    }
}
```



## 怎样理解 DStream算子的应用状态

使用SparkStreaming处理实际实时应用业务时，针对不同业务需求，需要使用不同的函数。 SparkStreaming流式计算框架，针对具体业务主要分为三类，使用不同函数进行处理：



**无状态Stateless**

-   在每个采集周期内,都会将采集的数据生成一个RDD

-   无状态是指 只操作采集当前周期内的RDD
-   示例:
    -   map、flatmap、filter、repartition、groupByKey等
    -   使用 **transform 和 foreachRDD** 函数

**有状态 State**

-   有状态是指 会将之前采集周期内采集的数据 与当前采集周期的数据做聚合操作
-   示例：
    -   函数：**updateStateByKey、mapWithState**

**窗口统计**

-   每隔多久时间统计最近一段时间内数据