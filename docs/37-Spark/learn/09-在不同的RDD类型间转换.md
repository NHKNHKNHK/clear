有些函数只能用于特定类型的RDD，比如，maen() 、variance() 等RDD只能用于数值RDD上，而 join() 只能用与 键值对RDD上。

在Scala、Java中，这些函数没有定义在标准的RDD类中，所以要访问这些函数，必须确保获取了正确的专用RDD类。

# Scala

在Scala中，将RDD转为有特定函数的RDD是通过**隐式转换**来自动处理的。

隐式转换可以将一个RDD转为各种封装类，比如 DoubleRDDFunctions（数值RDD）、PairRDDFunctions（键值对RDD），这样我们就可以调用额外的函数了，诸如maen() 、variance() 等

隐式转换虽然强大，但是会让我们阅读代码变得困难。



# Java

在Java中，各种RDD的特殊类型间的转换更为明确。Java中有两个专门的类 `JavaDoubleRDD`和`JavaPairRDD`

它们都在 `org.apache.spark.api.java`包下，如下是它们的类声明

```scala
class JavaPairRDD[K, V](val rdd: RDD[(K, V)])
(implicit val kClassTag: ClassTag[K], implicit val vClassTag: ClassTag[V])
extends AbstractJavaRDDLike[(K, V), JavaPairRDD[K, V]]
```

```scala
class JavaDoubleRDD(val srdd: RDD[scala.Double])
extends AbstractJavaRDDLike[JDouble, JavaDoubleRDD]
```

它们可以用来处理特殊类型的RDD，并且针对这两个类，还提供了额外的函数。可以让我们清楚的知道发生的一切，但这样有些累赘。

要构建出这些特殊类型的RDD，需要使用特殊版本的类来替代一般使用的Function类。

如下是针对于这些特殊的RDD类型所提供的函数接口：

| 函数名                     | 等价函数                          | 用途                                      |
| -------------------------- | --------------------------------- | ----------------------------------------- |
| DoubleFlatMapFunction<T>   | Function<T,Iterable<Double>>      | 用于flatMapToDouble，以生成JavaDoubleRDD  |
| DoubleFunction<T>          | Function<T,Double>                | 用于mapToDouble，以生成JavaDoubleRDD      |
| PairFlatMapFunction<T,K,V> | Function<T,Iterable<Tuple2<K,V>>> | 用于flatMapToPair，以生成JavaPairRDD<K,V> |
| PairFunction<T,K,V>        | Function<T,Tuple2<K,V>>           | 用于mapToPair，以生成JavaPairRDD<K,V>     |

## 声明

Java代码无法直接调用Scala代码中使用了隐式转换、默认参数、和某些Scala反射机制的代码，这些特性在Scala中广泛的使用。这就有必要为Java语言提供相应的类了。

例如：

​	SparkContext 的Java版本 JavaSparkContext

​	RDD 的Java版本 JavaRDD

# Python

Python的API结构和Java、Scala有所不同。在Python中，所有的函数都实现在了基本的RDD类中（都在rdd.py文件中）。

但是如果操作对应的RDD数据类型不正确，就会导致运行错误



