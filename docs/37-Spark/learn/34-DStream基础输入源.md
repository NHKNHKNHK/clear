# 输入DStream 和 Receiver

​	输入DStream代表了来自数据源的输入数据流。比如从文件读取、从TCP、从HDFS读取等。**每个DSteam都会绑定一个Receiver对象**，该对象是一个关键的核心组件，用来从我们的各种数据源接受数据，并将其存储在Spark的内存当中，这个内存的StorageLevel，我们可以自己进行指定

Spark Streaming提供了两种内置的数据源支持：

-   **基础数据源**：SSC API中直接提供了对这些数据源的支持，比如文件、tcp socket、Akka Actor等。
-   **高级数据源**：比如Kafka、Flume、Kinesis和Twitter等数据源，要引入第三方的JAR来完成我们的工作。
-   **自定义数据源**：比如我们的ZMQ、RabbitMQ、ActiveMQ等任何格式的自定义数据源。



## DStream 基础数据源

### File Source

下面是WordCount案例

1）环境准备

在pom导入依赖

```xml
 <dependencies>
        <!-- spark-core依赖-->
        <dependency>
            <groupId>org.apache.spark</groupId>
            <artifactId>spark-core_2.13</artifactId>
            <version>3.2.0</version>
        </dependency>
        <!-- spark-sql分析-->
        <dependency>
            <groupId>org.apache.spark</groupId>
            <artifactId>spark-sql_2.13</artifactId>
            <version>3.2.0</version>
        </dependency>

        <dependency>
            <groupId>org.apache.spark</groupId>
            <artifactId>spark-streaming_2.13</artifactId>
            <version>3.2.0</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- windows 入口配置-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>2.4</version>
                <configuration>
                    <archive>
                        <manifest>
                            <!-- mainClass标签填写主程序入口-->
                            <mainClass>com.clear.wordcount.CreateFile</mainClass>
                            <addClasspath>true</addClasspath>
                            <classpathPrefix>lib/</classpathPrefix>
                        </manifest>
                    </archive>
                    <classesDirectory>
                    </classesDirectory>
                </configuration>
            </plugin>
        </plugins>
    </build>

```

2）编写代码

```java
// 编写代码思路
// 1、首先我们导入StreamingContext（在Java中为 JavaStreamingContext），它是所有流功能的主要入口点。我们创建一个具有两个执行线程的本地StreamingContext，批处理间隔为10秒。
// 2、appName参数是应用程序在集群UI上显示的名称。
//	 master是Spark、Mesos或YARN集群的URL，或者是一个特殊的local[*]字符串，在本地模式下运行。
//   实际上，当在集群上运行时，您不希望在程序中硬编码master，而是使用spark-submit启动应用程序并在那里接收它。但是，对于本地测试和单元测试，可以通过local[*]来运行Spark Streaming in-process(检测本地系统中的核数)。

// 3.在定义了上下文之后，必须执行以下操作:
//		1）通过创建输入 DStreams 来定义输入源。
//		2）通过对DStreams应用转换和输出操作来定义流计算。
//		3）开始接收数据并使用streamingContext.start()处理它。

// 		4）使用streamingContext.awaitTermination()等待处理停止(手动或由于任何错误)。
// 		可以使用streamingContext.stop()手动停止处理。(不推荐这种方式)
```

具体代码实现如下

```java
/**
 * /opt/software/spark-local/bin/spark-submit --class com.clear.wordcount.SparkStreaming01_WordCount --master local /opt/temp/spark-streaming-demo-1.0.jar
 */
public class SparkStreaming01_WordCount {
    public static void main(String[] args) throws InterruptedException {
        SparkConf sparkConf = new SparkConf().setMaster("local[2]").setAppName("SparkStreaming wordCount");
        // todo 创建环境对象
        // 创建SparkStreamingContext (在Java中为 JavaStreamingContext)
        // 创建时需要传入两个参数 第一个表示环境配置
        // 第二个(batchDuration)译为批处理持续时间，表示批量处理的周期，即 采集周期
        JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(10));
        jssc.sparkContext().setLogLevel("ERROR");

        // 读取数据（读取该目录中的文件）
        JavaDStream<String> line = jssc.textFileStream("/opt/temp/txt/");

        // 分析数据（这里我们是完成词频统计需求）
        JavaDStream<String> word = line.flatMap(s -> Arrays.asList(s.split(" ")).iterator());
        JavaPairDStream<String, Integer> pairDStream = word.mapToPair(new PairFunction<String, String, Integer>() {
            @Override
            public Tuple2<String, Integer> call(String word) throws Exception {
                return new Tuple2<>(word, 1);
            }
        });
        JavaPairDStream<String, Integer> resultDStream = pairDStream.reduceByKey((x, y) -> x + y);

        // 仅仅输出本轮结果(因为我们是每10s统计一次，只考虑前10s的数据)
        resultDStream.print();

        // todo 关闭环境
        //jssc.stop();
        // 但是由于Spark Streaming采集器是长期执行的任务，所以不能关闭
        // 如果main方法执行完毕，应用程序也会自动结束，所以不能让main执行完毕
        // 使用Driver开始执行
        // 1.启动采集器
        jssc.start();
        // 2.等待采集器的关闭
        jssc.awaitTermination();
    }
}
```

```java
/**
 * /opt/software/spark-local/bin/spark-submit --class com.clear.wordcount.SparkStreaming01_WordCount --master local /opt/temp/spark-streaming-demo-1.0.jar
 */
public class SparkStreaming01_WordCount {
    public static void main(String[] args) throws InterruptedException {
        SparkConf sparkConf = new SparkConf().setMaster("local[2]").setAppName("SparkStreaming wordCount");
        // todo 创建环境对象
        // 创建SparkStreamingContext (在Java中为 JavaStreamingContext)
        // 创建时需要传入两个参数 第一个表示环境配置
        // 第二个(batchDuration)译为批处理持续时间，表示批量处理的周期，即 采集周期
        JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(10));
        jssc.sparkContext().setLogLevel("ERROR");

        // 读取数据（读取该目录中的文件）
        JavaDStream<String> line = jssc.textFileStream("/opt/temp/txt/");

        // 分析数据（这里我们是完成词频统计需求）
        JavaDStream<String> word = line.flatMap(s -> Arrays.asList(s.split(" ")).iterator());
        JavaPairDStream<String, Integer> pairDStream = word.mapToPair(new PairFunction<String, String, Integer>() {
            @Override
            public Tuple2<String, Integer> call(String word) throws Exception {
                return new Tuple2<>(word, 1);
            }
        });
        JavaPairDStream<String, Integer> resultDStream = pairDStream.reduceByKey((x, y) -> x + y);

        // 仅仅输出本轮结果(因为我们是每10s统计一次，只考虑前10s的数据)
        resultDStream.print();

        // todo 关闭环境
        //jssc.stop();
        // 但是由于Spark Streaming采集器是长期执行的任务，所以不能关闭
        // 如果main方法执行完毕，应用程序也会自动结束，所以不能让main执行完毕
        // 使用Driver开始执行
        // 1.启动采集器
        jssc.start();
        // 2.等待采集器的关闭
        jssc.awaitTermination();
    }
}
```

打包上次至服务器

依次执行下面命令

```shell
# 先执行spark程序
/opt/software/spark-local/bin/spark-submit --class com.clear.wordcount.SparkStreaming01_WordCount --master local /opt/temp/spark-streaming-demo-1.0.jar 
# 再执行jar
java -jar /opt/temp/spark-streaming-demo-1.0.jar 
```

结果如下

```
-------------------------------------------
Time: 1683803630000 ms
-------------------------------------------
(Flink,1)
(Dataset,1)
(Hive,2)
(J2EE,1)
(Spark,4)
(JavaScript,1)
(hadoop,3)
(HBase,3)
(JavaWeb,1)
(Java,1)
...

-------------------------------------------
Time: 1683803640000 ms
-------------------------------------------
(Hive,4)
(J2EE,1)
(Spark,4)
(JavaScript,1)
(hadoop,4)
(HBase,4)
(com,1)
(JavaWeb,1)
(Java,3)
(Streaming,2)
...
```

**WordCount解析**

-   **Discretized Stream**是Spark Streaming的基础抽象，代表持续性的数据流和经过各种Spark原语操作后的结果数据流。在**内部实现上，DStream是一系列连续的RDD来表示**。**每个RDD含有一段时间间隔内的数据**。
-   对数据的操作也是按照RDD为单位来进行的
-   计算过程由Spark Engine来完成。DStream操作隐藏了大部分细节，并为开发人员提供了更高级的API。



### TCP Source

需求：使用netcat工具向9999端口不断的发送数据，通过SparkStreaming读取端口数据并统计不同单词出现的次数

```java
/**
 * 需求: 使用netcat工具向9999端口不断的发送数据
 * 通过SparkStreaming读取端口数据
 * <p>
 * 开启服务-发送消息  nc -l -p 9999  linux: nc -lk 9999
 * <p>
 * 监听服务-消费数据  nc IP 9999
 * <p>
 * TODO 通过读取 TCP 创建DStream
 *

 * /opt/software/spark-local/bin/spark-submit --class com.clear.inputDStream.SparkStreaming_TCPSource --master local /opt/temp/spark-streaming-demo-1.0.jar
 */
public class SparkStreaming_TCPSource {
    public static void main(String[] args) throws InterruptedException {
        // 1.初始化 Spark配置信息
        SparkConf sparkConf = new SparkConf().setMaster("local[2]").setAppName("ReadTCP");
        // 2.初始化 SparkStreamingContext，采集周期4s
        JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(4));
        jssc.sparkContext().setLogLevel("ERROR");

        // todo 3.通过监控socket端口创建DStream
        // 监听 window平台192.168.43.2:9999
        /**
         * public JavaReceiverInputDStream<String> socketTextStream(
         *      final String hostname, 接收数据要连接的主机名
         *      final int port, 接收数据要连接到的端口
         *      final StorageLevel storageLevel 存储级别
         *      )
         */
        JavaReceiverInputDStream<String> ds = jssc.socketTextStream(
                "192.168.43.2", 9999, StorageLevel.MEMORY_ONLY());

        JavaDStream<String> wordDStream = ds.flatMap(line -> Arrays.asList(line.split(" ")).iterator());
        JavaPairDStream<String, Integer> wordToOneDStream = wordDStream.mapToPair(word -> new Tuple2<>(word, 1));
        JavaPairDStream<String, Integer> resultDStream = wordToOneDStream.reduceByKey((x, y) -> (x + y));

        // 4.打印
        resultDStream.print();

        // 启动 SparkStreamingContext （启动采集器）
        jssc.start();
        // 等待采集器的关闭（在执行过程中 任何的异常都会触发程序结束）
        jssc.awaitTermination();
    }
}
```

打包上传至服务器

在服务器执行如下命令

```
[root@kk01 temp]# /opt/software/spark-local/bin/spark-submit --class com.clear.inputDStream.SparkStreaming_TCPSource --master local /opt/temp/spark-streaming
-demo-1.0.jar
```

在window本机使用necat工具向9999端口不断的发送数据（前提：在windows已经配置好了necat环境）

```shell
C:\Users\没事我很好>nc -lp 9999
hello world
spark
hadoop
```

结果如下

```diff
-------------------------------------------
Time: 1683897216000 ms
-------------------------------------------
(hello,1)
(world,1)
(spark,1)

-------------------------------------------
Time: 1683897220000 ms
-------------------------------------------
(hadoop,1)
```



### HDFS Source

需求：监听hdfs的某一个目录的变化（新增文件）

```java
/**
 * SparkStreaming监听hdfs的某一个目录的变化（新增文件）
 * 相关HDFS命令
 * 上传文件(文件存在 则报错)  hadoop fs -put hello.txt /clear/spark_test/hello.txt
 * 追加文件 hadoop fs -appendToFile hello.txt /clear/spark_test/hello.txt
 * 覆盖文件 hadoop fs -copyFromLocal -f hello.txt /clear/spark_test/hello.txt
 *
 * /opt/software/spark-yarn/bin/spark-submit --class com.clear.inputDStream.SparkStreaming_HDFSSource --master yarn --deploy-mode client /opt/temp/spark-streaming-demo-1.0.jar
 */
public class SparkStreaming_HDFSSource {
    public static void main(String[] args) throws InterruptedException {
        // 1.初始化 Spark配置信息
        SparkConf sparkConf = new SparkConf().setMaster("yarn").setAppName("ReadTCP");
        // 2.初始化 SparkStreamingContext，采集周期4s
        JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(4));
        jssc.sparkContext().setLogLevel("ERROR");  // 设置日志级别

        String inputPath = "hdfs://clear/spark_test";
        // TODO 通过读取 HDFS目录下文件变化 创建DStream
        /**
         * public JavaDStream<String> textFileStream(final String directory)
         *  监控的文件格式 必须是 文本文件
         *  文件追加操作后,获取的是整个文件的内容
         */
        JavaDStream<String> lineDStream = jssc.textFileStream(inputPath);

        // wordCount
        JavaDStream<String> wordDStream = lineDStream.flatMap(line -> Arrays.asList(line.split(" ")).iterator());
        JavaPairDStream<String, Integer> wordToOneDStream = wordDStream.mapToPair(word -> new Tuple2<>(word, 1));
        JavaPairDStream<String, Integer> resultDStream = wordToOneDStream.reduceByKey((x, y) -> (x + y));

        // 4.打印
        resultDStream.print();

        // 启动 SparkStreamingContext （启动采集器）
        jssc.start();
        // 等待采集器的关闭（在执行过程中 任何的异常都会触发程序结束）
        jssc.awaitTermination();

    }
}
```

打包上次至服务器

需要确保hdfs集群、yarn集群启动

```
start-dfs.sh  # 启动dfs集群
start-yarn.sh  # 启动yarn集群
```

提前在hdfs中创建文件夹/clear/spark_test/

```shell
[root@kk01 software]# hadoop fs -mkdir /clear/spark_test
```

运行spark 程序

```shell
[root@kk01 spark-yarn]# /opt/software/spark-yarn/bin/spark-submit --class com.clear.inputDStream.SparkStreaming_HDFSSource --master yarn --deploy-mode client
 /opt/temp/spark-streaming-demo-1.0.jar
```

将linux本地的hello.txt文件上次至hdfs

```shell
[root@kk01 temp]# pwd
/opt/temp
[root@kk01 temp]# hadoop fs -put hello.txt /clear/spark_test/hello.txt
```

hello.txt文件内容如下

```
hello spark java

....

i love hadoop
this is for java

```

随后依次执行如下命令

```shell
[root@kk01 temp]# hadoop fs -appendToFile hello.txt /clear/spark_test/hello.txt
[root@kk01 temp]# hadoop fs -copyFromLocal -f hello.txt /clear/spark_test/hello.txt
```

结果如下

```
Time: 1683884408000 ms
-------------------------------------------

-------------------------------------------
Time: 1683884412000 ms
-------------------------------------------

-------------------------------------------
Time: 1683884416000 ms
-------------------------------------------
```



### Queue Source

​	可以使用streamingContext.queueStream(queueofrdd)基于rdd队列创建DStream。推送到队列中的每个RDD将被视为DStream中的一批数据，并像流一样处理。



## DStream 高级数据源

请见 sparkstreaming整合kafka





## DStream 自定义Receiver

自定义Receiver步骤如下：

-   需要继承Receiver
-   定义泛型
-   实现onStart、onStop方法来自定义数据源采集。

演示1：

```java
import org.apache.spark.SparkConf;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaReceiverInputDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.apache.spark.streaming.receiver.Receiver;

import java.util.Random;

/**
 * 实现自定义Receiver
 */
public class SparkStreaming03_DIY {
    public static void main(String[] args) throws InterruptedException {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("SparkStreaming wordCount");
        // todo 创建环境对象
        // 创建SparkStreamingContext (在Java中为 JavaStreamingContext)
        // 创建时需要传入两个参数 第一个表示环境配置
        // 第二个(batchDuration)译为批处理持续时间，表示批量处理的周期，即 采集周期
        JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(10));
        jssc.sparkContext().setLogLevel("ERROR");


        JavaReceiverInputDStream<String> messageDS = jssc.receiverStream(new MyReceiver(StorageLevel.MEMORY_AND_DISK_2()));
        messageDS.print();

        // 1.启动 SparkStreaming
        jssc.start();
        // 2.等待采集器的关闭
        jssc.awaitTermination();
    }

    /**
     * 自定义数据采集器Receiver
     * 1.继承org.apache.spark.streaming.receiver.Receiver类
     * 2.定义泛型
     * 3.重写抽象方法
     */
    static class MyReceiver extends Receiver<String> {

        private boolean flg = true;

        public MyReceiver(StorageLevel storageLevel) {
            super(storageLevel);
        }

        @Override
        public void onStart() {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    while (flg) {
                        String message = "采集的数据为：" + new Random().nextInt(10);
                        store(message);
                        try {
                            Thread.sleep(2000);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }).start();
        }

        @Override
        public void onStop() {
            flg = false;
        }
    }
}
```

结果如下

```diff
-------------------------------------------
Time: 1683895990000 ms
-------------------------------------------
采集的数据为：5

-------------------------------------------
Time: 1683896000000 ms
-------------------------------------------
采集的数据为：5
采集的数据为：8
采集的数据为：7
采集的数据为：0
采集的数据为：6

```

演示2：

```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.ConnectException;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.receiver.Receiver;


/**
 * 自定义数据采集器Receiver
 * 这个类继承自Spark中的Receiver类，我们覆盖了onStart()和onStop()方法。
 * 在onStart()方法中，我们启动一个新线程来接收数据，数据来源于一个socket连接。
 * 在onStop()方法中，我们什么也不做。
 */
public class MyCustomReceiver extends Receiver<String> {
    private static final long serialVersionUID = 1L;

    private String host;
    private int port;

    public MyCustomReceiver(String host, int port) {
        super(StorageLevel.MEMORY_AND_DISK_2());
        this.host = host;
        this.port = port;
    }

    @Override
    public void onStart() {
        new Thread(this::receive).start();
    }

    @Override
    public void onStop() {
        // do nothing
    }

    private void receive() {
        try {
            Socket socket = new Socket(host, port);

            BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
            String line;
            while (!isStopped() && (line = reader.readLine()) != null) {
                store(line);
            }
            reader.close();
            socket.close();
            restart("Trying to connect again");
        } catch (ConnectException ce) {
            restart("Could not connect", ce);
        } catch (Throwable t) {
            restart("Error receiving data", t);
        }
    }
}
```

```java
import org.apache.spark.SparkConf;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaReceiverInputDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;

public class MyStreamingApp {
    public static void main(String[] args) throws InterruptedException {
        SparkConf conf = new SparkConf().setAppName("MyStreamingApp").setMaster("local[2]");
        // 创建了一个JavaStreamingContext对象，采集周期为5s
        JavaStreamingContext jssc = new JavaStreamingContext(conf, Durations.seconds(5));
        // 设置日志打印级别
        jssc.sparkContext().setLogLevel("ERROR");

        // 定义一个自定义的Receiver
        // 通过receiverStream()方法将其转换为一个JavaReceiverInputDStream对象。
        JavaReceiverInputDStream<String> lines = jssc.receiverStream(new MyCustomReceiver("localhost", 9999));

        // 处理数据
        lines.print();

        // 启动Streaming应用程序
        jssc.start();

        // 等待程序结束
        jssc.awaitTermination();
    }
}
```

要测试这个应用程序，我们需要启动一个socket服务器来模拟数据源。可以使用necat工具

可以在命令行中输入以下命令：

```shell
nc -lp 9999
# 如果是Linux，就是下面这个
nc -lk 9999
```

这将启动一个socket服务器，并监听9999端口。现在，我们可以在命令行中输入一些文本

```shell
C:\Users\没事我很好>nc -lp 9999
1
2
3
4
```

然后在应用程序中看到它们被打印出来。如下

```diff
-------------------------------------------
Time: 1683896435000 ms
-------------------------------------------
1
2
3
4
```

