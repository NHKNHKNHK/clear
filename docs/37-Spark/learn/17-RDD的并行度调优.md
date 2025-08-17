# 并行度调优

Spark是如何分隔工作的呢？

​	每个RDD都有固定数据的分区，分区数决定了RDD上执行操作时的并行度。

在执行聚合或者分组操作时，可以给RDD指定指定数目的分区数。Spark始终会尝试根据集群的大小推断出一个有意义的默认值。有时我们需要对并行度来调整以获得最佳性能。

绝大多数的RDD算子都能接收第二个参数，这个参数用来**指定分组结果或聚合结果的RDD的分区数。**

例如：

```scala
// 第二个参数便是指定分区数
def join[W](other: JavaPairRDD[K, W], numPartitions: Int): JavaPairRDD[K, (V, W)]
```

有时候，我们希望除了分组操作和聚合操作以外的其他算子也能改变RDD的分区。对应这种情况，Spark为我们提供了repartition 和 coalesce 算子。

# 专用于改变分区的算子

Spark提供的 repartition 算子将数据通过网络shuffle，并创建出新的分区集合。

切记，对数据进行重新分区的代价是很大的。

Spark也提供了 repartition 算子的优化版 calesce 算子。

## repartition（宽） 增加分区

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

## coalesce（缩窄增宽） 缩减分区

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

-   **该算子常用于缩减分区**，用于大数据集过滤后，提高小数据集的执行效率

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







## **coalesce和repartition区别**

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

##  查看分区数

在Java、Scala中，我们可以通过 rdd.partitions.size 的方式查看RDD的分区数

在Python中，我们可以通过 rdd.getNumPartitions 查看RDD的分区数