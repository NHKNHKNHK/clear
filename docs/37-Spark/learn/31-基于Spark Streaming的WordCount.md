# WordCount词频统计

## 需求

功能描述：从TCP Socket数据源实时消费数据，对每批次Batch数据进行词频统计WordCount

## 编写代码

针对SparkStreaming流式应用来说，代码逻辑大致如下五个步骤：

-   1）Define the input sources by creating input DStreams. 
    -    定义从哪个数据源接收流式数据，封装到DStream中 
-   2）Define the streaming computations by applying transformation and output operations to DStreams. 
    -    针对业务调用DStream中函数，进行数据处理和输出 
-   3）Start receiving data and processing it using **streamingContext.start()**. 
-   4 ） Wait for the processing to be stopped (manually or due to any error) using **streamingContext.awaitTermination().** 
-   5）The processing can be manually stopped using streamingContext.stop(). 
    -    启动流式应用，并且一直等待程序终止（人为或异常），最后停止运行

### Scala实现

```scala
import org.apache.spark.SparkConf
import org.apache.spark.streaming.dstream.{DStream, ReceiverInputDStream}
import org.apache.spark.streaming.{Seconds, StreamingContext}

/**
 * 基于IDEA集成开发环境，编程实现从TCP Socket实时读取流式数据，对每批次中数据进行词频统计
 */
object SparkStreamingWordCount {
  def main(args: Array[String]): Unit = {
    // 1.构建StreamingContext流式上下文实例对象
    val ssc: StreamingContext = {
      // a.创建SparkConf对象，设置应用配置信息
      val sparkConf: SparkConf = new SparkConf()
        .setAppName(this.getClass.getSimpleName.stripSuffix("$"))
        .setMaster("local[2]")
      // b.创建流式上下文对象, 传递SparkConf对象，TODO: 时间间隔 -> 用于划分流式数据为很多批次Batch
      val context = new StreamingContext(sparkConf, Seconds(5))
      // c.返回
      context
    }
    // 调整日志级别，便于看到输出结果
    ssc.sparkContext.setLogLevel("WARN")

    //  2. 从数据源端读取数据，此处是TCP Socket读取数据
    val inputDStream: ReceiverInputDStream[String] = ssc.socketTextStream(
      "localhost", 9999)

    // 3. 对每批次的数据进行词频统计
    val resultDStream: DStream[(String, Int)] = inputDStream
      // 过滤不符合规则的数据
      .filter(line => null != line && line.trim.length > 0)
      // 按照分隔符划分单词
      .flatMap(line => line.trim.split("\\s+"))
      // 转换数据为二元组，表示每个单词出现一次
      .map(word => (word, 1))
      // 按照单词分组，聚合统计
      .reduceByKey((tmp, item) => tmp + item)

    // 4. 将结果数据输出 -> 将每批次的数据处理以后输出
    resultDStream.print(10)

    // 5. 对于流式应用来说，需要启动应用
    ssc.start()
    // 流式应用启动以后，正常情况一直运行（接收数据、处理数据和输出数据），除非人为终止程序或者程序异常停止
    ssc.awaitTermination()
    // 关闭流式应用(参数一：是否关闭SparkContext，参数二：是否优雅的关闭）
    ssc.stop(stopSparkContext = true, stopGracefully = true)
  }
}
```

启动程序使用netcat工具输入如下：

```
C:\Users\没事我很好>nc -lp 9999
hello scala
hello world
hello
```

结果如下

```shell
-------------------------------------------
Time: 1695006010000 ms
-------------------------------------------
(scala,1)
(hello,2)
(world,1)

23/09/18 11:00:10 WARN RandomBlockReplicationPolicy: Expecting 1 replicas with only 0 peer/s.
23/09/18 11:00:10 WARN BlockManager: Block input-0-1695006010000 replicated to only 0 peer(s) instead of 1 peers
23/09/18 11:00:13 WARN ProcfsMetricsGetter: Exception when trying to compute pagesize, as a result reporting of ProcessTree metrics is stopped
-------------------------------------------
Time: 1695006015000 ms
-------------------------------------------
(hello,1)
```

### Java实现

```java
import org.apache.spark.SparkConf;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaPairDStream;
import org.apache.spark.streaming.api.java.JavaReceiverInputDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import scala.Tuple2;

import java.util.Arrays;

public class SparkStreamingWordCount2 {
    public static void main(String[] args) {
        // 1.构建StreamingContext流式上下文实例对象
        // a.创建SparkConf对象，设置应用配置信息
        SparkConf sparkConf = new SparkConf()
                .setAppName(SparkStreamingWordCount2.class.getSimpleName())
                .setMaster("local[4]");
        // b.创建流式上下文对象, 传递SparkConf对象，TODO: 时间间隔 -> 用于划分流式数据为很多批次Batch
        JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(5));
        // 调整日志级别，便于看到输出结果
        jssc.sparkContext().setLogLevel("WARN");

        //  2. 从数据源端读取数据，此处是TCP Socket读取数据
        JavaReceiverInputDStream<String> inputDStream = jssc.socketTextStream("localhost", 9999);

        // 3. 对每批次的数据进行词频统计
        JavaPairDStream<String, Integer> resultDStream = inputDStream
                // 过滤不符合规则的数据
                .filter(line -> line != null && line.trim().length() > 0)
                // 按照分隔符划分单词
                .flatMap(line -> Arrays.asList(line.split("\\s+")).iterator())
                // 转换数据为二元组，表示每个单词出现一次
                .mapToPair(word -> new Tuple2<>(word, 1))
                // 按照单词分组，聚合统计
                .reduceByKey((tmp, item) -> tmp + item);

        // 4. 将结果数据输出 -> 将每批次的数据处理以后输出
        resultDStream.print(10);

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

