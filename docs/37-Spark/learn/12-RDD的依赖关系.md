# RDD lineage 依赖关系

-   相邻的两个RDD的关系称为**依赖关系**
-   新的RDD依赖于旧的RDD
-   多个连续的RDD的依赖关系，称之为**血缘关系**（在Maven中叫做间接依赖）
-   每个RDD都会保存血缘关系（lineage）
-   **RDD不会保存数据**
-   RDD为了提供容错性，需要将RDD间的关系保存下来
-   **一旦出现错误，可以根据血缘关系将数据源重新读取进行计算**
-   新的RDD的一个分区的数据依赖于旧的RDD的一个分区的数据，这称为**OneToOne依赖（即 窄依赖）**

```java
public class OneToOneDependency<T> extends NarrowDependency<T> 

public abstract class NarrowDependency<T> extends Dependency<T> 
```

-   新的RDD的一个分区的数据依赖于旧的RDD的多个分区的数据，这个称为**Shuffle依赖（即 宽依赖）**

```java
public class ShuffleDependency<K, V, C> extends Dependency<Product2<K, V>> implements Logging 

public abstract class Dependency<T> implements Serializable
```



## 1）RDD 血缘关系

​	RDD只支持粗粒度转换，即在大量记录上执行的单个操作。将创建RDD的一系列Lineage（血统）记录下来，以便恢复丢失的分区。**RDD的Lineage会记录RDD的元数据信息和转换行为**，**当该RDD的部分分区数据丢失时，它可以根据这些信息来重新运算和恢复丢失的数据分区。**

```java
public class SparkRDD_Dependency {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("单词统计").setMaster("local");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        sparkContext.setLogLevel("ERROR");

        JavaRDD<String> lineRDD = sparkContext.parallelize(Arrays.asList("hello world", "hello spark"));
        System.out.println(lineRDD.toDebugString());
        System.out.println("----------------------------------");
        JavaRDD<String> wordRDD = lineRDD.flatMap(s -> Arrays.asList(s.split(" ")).iterator());
        System.out.println(wordRDD.toDebugString());
        System.out.println("----------------------------------");
        JavaPairRDD<String, Integer> wordOneRDD = wordRDD.mapToPair(word -> new Tuple2<>(word, 1));
        System.out.println(wordOneRDD.toDebugString());
        System.out.println("----------------------------------");
        JavaPairRDD<String, Integer> wordCountRDD = wordOneRDD.reduceByKey((x, y) -> x + y);
        System.out.println(wordCountRDD.toDebugString());
        System.out.println("----------------------------------");
        System.out.println(wordCountRDD.collect());
        sparkContext.close();
    }
}

```

结果（打印了RDD之间的学院关系）

正是因为每个RDD都会保存自己的血缘关系，一旦出现错误，可以根据血缘关系将数据源重新读取进行计算

```shell
(1) ParallelCollectionRDD[0] at parallelize at SparkRDD_Dependency.java:17 []
----------------------------------
(1) MapPartitionsRDD[1] at flatMap at SparkRDD_Dependency.java:20 []
 |  ParallelCollectionRDD[0] at parallelize at SparkRDD_Dependency.java:17 []
----------------------------------
(1) MapPartitionsRDD[2] at mapToPair at SparkRDD_Dependency.java:23 []
 |  MapPartitionsRDD[1] at flatMap at SparkRDD_Dependency.java:20 []
 |  ParallelCollectionRDD[0] at parallelize at SparkRDD_Dependency.java:17 []
----------------------------------
(1) ShuffledRDD[3] at reduceByKey at SparkRDD_Dependency.java:26 []
 +-(1) MapPartitionsRDD[2] at mapToPair at SparkRDD_Dependency.java:23 []
    |  MapPartitionsRDD[1] at flatMap at SparkRDD_Dependency.java:20 []
    |  ParallelCollectionRDD[0] at parallelize at SparkRDD_Dependency.java:17 []
----------------------------------
[(spark,1), (hello,2), (world,1)]

```

## 2）RDD 依赖关系

这里所谓的依赖关系，其实就是**两个相邻RDD之间的关系**

```java
val sc: SparkContext = new SparkContext(conf)

val fileRDD: RDD[String] = sc.textFile("input/1.txt")
println(fileRDD.dependencies)
println("----------------------")

val wordRDD: RDD[String] = fileRDD.flatMap(_.split(" "))
println(wordRDD.dependencies)
println("----------------------")

val mapRDD: RDD[(String, Int)] = wordRDD.map((_,1))
println(mapRDD.dependencies)
println("----------------------")

val resultRDD: RDD[(String, Int)] = mapRDD.reduceByKey(_+_)
println(resultRDD.dependencies)

resultRDD.collect()
```



## 3）RDD 窄依赖

窄依赖表示每一个父(上游)RDD的Partition**最多**被子（下游）RDD的一个Partition使用，窄依赖我们形象的比喻为独生子女。

大白话就是， **父RDD 和 子RDD** 的 partition 之间关系是**一对一**的。或者 **父RDD 和 子RDD** 的partition 关系是 **多对 一**的。**不会产生shuffle**。

```java
public class OneToOneDependency<T> extends NarrowDependency<T> 

public abstract class NarrowDependency<T> extends Dependency<T> 
```



## 4）RDD 宽依赖

宽依赖表示同一个父（上游）RDD的Partition被多个子（下游）RDD的Partition依赖，**会引起Shuffle**，总结：宽依赖我们形象的比喻为多生。

大白话就是，**父RDD 和 子RDD** 的partition 之间的关系是 **一对多**的。**会产生shuffle**

```javascript
public class ShuffleDependency<K, V, C> extends Dependency<Product2<K, V>> implements Logging 

public abstract class Dependency<T> implements Serializable

```

小结：

​	所谓的**宽窄依赖，其实就是会影响 stage**



## 5）RDD 阶段划分 stage划分

DAG（Directed Acyclic Graph）有向无环图是由点和线组成的拓扑图形，该图形具有方向，不会闭环。例如，DAG记录了RDD的转换过程和任务的阶段。

Spark 任务会**根据RDD之间的依赖关系**，**形成一个 DAG** 有向无环图，**DAG会提交给 DAGScheduler**（DGA调度器）。

DAGScheduler 会把 DAG 划分成相互依赖的多个 stage，**划分stage** 的**依据就是RDD 之间的 宽窄依赖**。遇到 宽依赖 就划分 stage，**每个stage 包含一个或多个 task任务**。然后将这些 **task 以taskSet 的形式提交给 TaskScheduler运行**

stage 是由一组并行的 task组成。



## 6）RDD 阶段划分源码

下面是Scala部分源码

```scala
try {
  // New stage creation may throw an exception if, for example, jobs are run on a
  // HadoopRDD whose underlying HDFS files have been deleted.
  finalStage = createResultStage(finalRDD, func, partitions, jobId, callSite)
} catch {
  case e: Exception =>
    logWarning("Creating new stage failed due to exception - job: " + jobId, e)
    listener.jobFailed(e)
    return
}

……

private def createResultStage(
  rdd: RDD[_],
  func: (TaskContext, Iterator[_]) => _,
  partitions: Array[Int],
  jobId: Int,
  callSite: CallSite): ResultStage = {
val parents = getOrCreateParentStages(rdd, jobId)
val id = nextStageId.getAndIncrement()
val stage = new ResultStage(id, rdd, func, partitions, parents, jobId, callSite)
stageIdToStage(id) = stage
updateJobIdStageIdMaps(jobId, stage)
stage
}

……

private def getOrCreateParentStages(rdd: RDD[_], firstJobId: Int): List[Stage] = {
getShuffleDependencies(rdd).map { shuffleDep =>
  getOrCreateShuffleMapStage(shuffleDep, firstJobId)
}.toList
}

……

private[scheduler] def getShuffleDependencies(
  rdd: RDD[_]): HashSet[ShuffleDependency[_, _, _]] = {
val parents = new HashSet[ShuffleDependency[_, _, _]]
val visited = new HashSet[RDD[_]]
val waitingForVisit = new Stack[RDD[_]]
waitingForVisit.push(rdd)
while (waitingForVisit.nonEmpty) {
  val toVisit = waitingForVisit.pop()
  if (!visited(toVisit)) {
    visited += toVisit
    toVisit.dependencies.foreach {
      case shuffleDep: ShuffleDependency[_, _, _] =>
        parents += shuffleDep
      case dependency =>
        waitingForVisit.push(dependency.rdd)
    }
  }
}
parents
}
```

 

## 7）stage 计算模式

pipeline 管道计算模式，pipeline 只是一种计算思想、模式

**注意：**

-   数据一直在管道里面什么时候数据会落地？
    -   对RDD进行**持久化**（cache、persist）
    -   **shuffle write** 的时候
-   **Stage 的 task 并行度**是由 stage 的**最后一个 RDD 的分区数**来决定的。
-   如何改变RDD的分区数？

例如：

```
reduceByKey(xxx,3)  groupByKey(4)   sc.textFile(path,numpartition)
```

**使用算子时传递** 分区**num**参数 就是分区 partition 的数量

-   验证 pipeline 计算模式

```java
public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("验证pipeline管道计算模式").setMaster("local[*]");
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        jsc.setLogLevel("ERROR");
        JavaRDD<Integer> rdd = jsc.parallelize(Arrays.asList(1, 2, 3));
        JavaRDD<Integer> rdd1 = rdd.map(x -> {
            System.out.println("map~~~~" + x);
            return x;
        });
        JavaRDD<Integer> rdd2 = rdd1.filter(x -> {
            System.out.println("filter~~~" + x);
            return true;
        });
        rdd2.collect();
        jsc.stop();
    }
```

结果如下（结果不是先执行完map，再执行完filter，所以验证了pipeline）

```
map~~~~1
map~~~~3
filter~~~1
filter~~~3
map~~~~2
filter~~~2
```



## 8）RDD 任务划分

RDD任务切分中间分为：Application、Job、Stage 和 Task

-   Application：初始化一个SparkContext即生成一个Application；
-   Job：**一个Action算子**就会生成**一个Job**；
-   Stage：**Stage等于宽依赖(ShuffleDependency)的个数加1**；
-   Task：**一个Stage阶段中，最后一个RDD的分区个数就是Task的个数**。

注意：**Application->Job->Stage->Task每一层都是1对n的关系**。 

