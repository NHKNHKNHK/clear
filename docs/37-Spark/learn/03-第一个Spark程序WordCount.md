# WordCount

## Scala版

### 1）创建项目

#### 增加 Scala 插件  

Spark 由 Scala 语言开发的，咱们当前使用的 Spark 版本为 3.2.0，默认采用的 Scala 编译版本为 2.13，所以后续开发时。我们依然采用这个版本。开发前请保证 IDEA 开发工具中含有 **Scala 开发插件**

#### 创建Maven工程

创建Maven Project工程，**GAV**如下：

| GroupId         | ArtifactId         | Version |
| --------------- | ------------------ | ------- |
| com.clear.spark | bigdata-spark_2.13 | 1.0     |

创建Maven Module工程，**GAV**如下：

| GroupId         | ArtifactId | Version |
| --------------- | ---------- | ------- |
| com.clear.spark | spark-core | 1.0     |

#### POM

```xml
<repositories>
    <!-- 指定仓库的位置，依次为aliyun、cloudera、jboss -->
    <repository>
        <id>aliyun</id>
        <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    </repository>
    <repository>
        <id>cloudera</id>
        <url>https://repository.cloudera.com/artifactory/cloudera-repos/</url>
    </repository>
    <repository>
        <id>jboss</id>
        <url>https://repository.jboss.com/nexus/content/groups/public/</url>
    </repository>
</repositories>

<properties>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <scala.version>2.13.5</scala.version>
    <scala.binary.version>2.13</scala.binary.version>
    <spark.version>3.2.0</spark.version>
    <hadoop.version>3.1.3</hadoop.version>
</properties>

<dependencies>
    <!-- 依赖Scala语言-->
    <dependency>
        <groupId>org.scala-lang</groupId>
        <artifactId>scala-library</artifactId>
        <version>${scala.version}</version>
    </dependency>
    <!-- Spark Core 依赖 -->
    <dependency>
        <groupId>org.apache.spark</groupId>
        <artifactId>spark-core_${scala.binary.version}</artifactId>
        <version>${spark.version}</version>
    </dependency>
    <!-- Hadoop Client 依赖 -->
    <dependency>
        <groupId>org.apache.hadoop</groupId>
        <artifactId>hadoop-client</artifactId>
        <version>${hadoop.version}</version>
    </dependency>
</dependencies>

<build>
    <outputDirectory>target/classes</outputDirectory>
    <testOutputDirectory>target/test-classes</testOutputDirectory>
    <resources>
        <resource>
            <directory>${project.basedir}/src/main/resources</directory>
        </resource>
    </resources>

    <plugins>
        <!-- maven 编译插件-->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.10.1</version>
            <configuration>
                <source>${maven.compiler.source}</source>
                <target>${maven.compiler.target}</target>
                <encoding>UTF-8</encoding>
            </configuration>
        </plugin>

        <!-- 该插件用于将 Scala 代码编译成 class 文件 -->
        <plugin>
            <groupId>net.alchim31.maven</groupId>
            <artifactId>scala-maven-plugin</artifactId>
            <version>3.2.2</version>
            <executions>
                <execution>
                    <!-- 声明绑定到 maven 的 compile 阶段 -->
                    <goals>
                        <goal>compile</goal>
                        <goal>testCompile</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```



```xml
<dependencies>

    <!-- spark-core依赖-->
    <dependency>
        <groupId>org.apache.spark</groupId>
        <artifactId>spark-core_2.13</artifactId>
        <version>3.2.0</version>
    </dependency>
</dependencies>
<build>
    <plugins>
        <!-- 该插件用于将 Scala 代码编译成 class 文件 -->
        <plugin>
            <groupId>net.alchim31.maven</groupId>
            <artifactId>scala-maven-plugin</artifactId>
            <version>3.2.2</version>
            <executions>
                <execution>
                    <!-- 声明绑定到 maven 的 compile 阶段 -->
                    <goals>
                         <goal>compile</goal>
                        <goal>testCompile</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>

        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-assembly-plugin</artifactId>
            <version>3.1.0</version>
            <configuration>
                <descriptorRefs>
                    <descriptorRef>jar-with-dependencies</descriptorRef>
                </descriptorRefs>
            </configuration>
            <executions>
                <execution>
                    <id>make-assembly</id>
                    <phase>package</phase>
                    <goals>
                        <goal>single</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

#### 配置文件

在src/main/resources目录下放置如下三个文件，可以从服务器中拷贝：

-   `core-site.xml`
-   `hdfs-site.xml`
-   `log4j.properties`

### 3）代码编写

```scala
package com.clear.spark

import org.apache.spark.{SparkConf, SparkContext}

/**
 * 使用Scala语言使用SparkCore编程实现词频统计：WordCount
 * 从HDFS上读取文件，统计WordCount，将结果保存在HDFS上
 */
object SparkWordCount {
  def main(args: Array[String]): Unit = {
    // todo 创建SparkContext对象，需要传递SparkConf对象，设置应用配置信息
    val conf = new SparkConf()
      .setAppName("词频统计")
      .setMaster("local[2]")
    val sc = new SparkContext(conf)

    // todo 读取数据，封装数据到RDD
    val inputRDD = sc.textFile("/opt/data/wc/README.md")

    // 分析数据，调用RDD算子
    val resultRDD = inputRDD.flatMap(line => line.split("\\s+"))
      .map(word => (word, 1))
      .reduceByKey((tmp, item) => tmp + item)
    // 保存数据，将最终RDD结果数据保存至外部存储系统
    resultRDD.foreach(tuple => println(tuple))
    resultRDD.saveAsTextFile(s"/opt/data/wc-${System.nanoTime()}")

    // 应用程序结束，关闭资源
    sc.stop()
  }
}
```

### 4）测试

```shell
[nhk@kk01 wordcount]$ $SPARK_HOME/bin/spark-submit --class com.clear.WordCount /opt/data/wordcount/spark-core-scala-1.0.jar 
```

## Java版

### 1）**POM**

```xml
<dependencies>
    <!-- spark-core依赖-->
    <dependency>
        <groupId>org.apache.spark</groupId>
        <artifactId>spark-core_2.13</artifactId>
        <version>3.2.0</version>
        <scope>provided</scope>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-jar-plugin</artifactId>
            <version>2.4</version>
            <configuration>
                <archive>
                    <manifest>
                        <!-- mainClass标签填写主程序入口-->
                        <mainClass>com.clear.demo1.CreateFileUtil</mainClass>
                        <addClasspath>true</addClasspath>
                        <classpathPrefix>lib/</classpathPrefix>
                    </manifest>
                </archive>
                <classesDirectory>
                </classesDirectory>
            </configuration>
        </plugin>

        <!-- 复制依赖文件到编译目录中 -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-dependency-plugin</artifactId>
            <version>3.1.1</version>
            <executions>
                <execution>
                    <id>copy-dependencies</id>
                    <phase>package</phase>
                    <goals>
                        <goal>copy-dependencies</goal>
                    </goals>
                    <configuration>
                        <outputDirectory>${project.build.directory}/lib</outputDirectory>
                    </configuration>
                </execution>
            </executions>
        </plugin>

    </plugins>
</build>
```

### 2）代码

```java
package com.clear.wordcount;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import scala.Tuple2;

import java.util.Arrays;


public class JavaSparkWordCount {
    public static void main(String[] args) {
        // 创建 SparkConf 对象配置应用
        SparkConf conf = new SparkConf().setAppName("JavaSparkWordCount").setMaster("local");

        // 基于 SparkConf 创建 JavaSparkContext 对象
        JavaSparkContext jsc = new JavaSparkContext(conf);

        // 加载文件内容
        JavaRDD<String> lines = jsc.textFile("file:///opt/data/wordcount/README.md");

        // 转换为单词 RDD
        JavaRDD<String> words = lines.flatMap(line ->
                Arrays.asList(line.split(" ")).iterator());

        // 统计每个单词出现的次数
        // 在Java中，各种RDD的特殊类型间的转换更为明确，spark为pair RDD 提供了专门的java版本JavaPairRDD
        JavaPairRDD<String, Integer> counts = words.mapToPair(word -> new Tuple2<>(word, 1))
                .reduceByKey((x, y) -> (x + y));

        // 输出结果
        counts.saveAsTextFile("file:///opt/data/wordcount/wc");

        // 关闭 JavaSparkContext 对象
        jsc.stop();
    }
}
```

### 3）测试

运行：

```shell
[nhk@kk01 wordcount]$ $SPARK_HOME/bin/spark-submit --class com.clear.wordcount.JavaSparkWordCount /opt/data/wordcount/spark-core-demo-1.0.jar 
```

查看结果：

```shell
[nhk@kk01 wc]$ pwd
/opt/data/wordcount/wc
[nhk@kk01 wc]$ ll
total 8
-rw-r--r--. 1 nhk nhk 4591 Jul 30 17:48 part-00000
-rw-r--r--. 1 nhk nhk    0 Jul 30 17:49 _SUCCESS
[nhk@kk01 wc]$ head part-00000 
(package,1)
(For,3)
(Programs,1)
(processing.,2)
(Because,1)
(The,1)
(cluster.,1)
(its,1)
([run,1)
(APIs,1)
```

