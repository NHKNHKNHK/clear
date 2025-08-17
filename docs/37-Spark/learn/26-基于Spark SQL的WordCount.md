# SparkSession 应用入口

Spark 2.0开始，应用程序入口为`SparkSession`（底层依旧是SparkContext），加载不同数据源的数据，封装到 DataFrame/Dataset集合数据结构中，使得编程更加简单，程序运行更加快速高效。 

SparkSession：这是一个新入口，取代了原本的SQLContext与HiveContext。对于DataFrameAPI的用户来说，Spark常见的混乱源头来自于使用哪个“context”。现在使用SparkSession，它作为单个入口可以兼容两者，注意原本的SQLContext与HiveContext仍然保留，以支持向下兼容。 

1）要使用SparkSession，需要在pom中添加如下依赖

```xml
<dependency>
    <groupId>org.apache.spark</groupId>
    <artifactId>spark-sql_2.13</artifactId>
    <version>3.2.0</version>
</dependency>
```

2）SparkSession对象实例通过建造者模式构建，如下：

```scala
import org.apache.spark.sql.SparkSession	// 1.导入SparkSession所在的包

object SparkSessionDemo {
    def main(args: Array[String]): Unit = {
        val spark: SparkSession = SparkSession.builder()	// 2.建造者模式构建对象
        .appName("实例化SparkSession")	// 3.设置属性
        .config("spark.some.config.option", "some-value")
        .getOrCreate()

        import spark.implicits._	// 导入SparkSession类中implicits对象的object中隐式转换函数
    }
}
```

说明：

使用SparkSession加载数据源数据，将其封装到DataFrame或Dataset中，直接使用show函数就可以显示样本数据（默认显示前20条）。 

Spark2.0使用全新的 SparkSession 接口替代Spark1.6中的 SQLContext 及 HiveContext 接口来实现其对数据加载、转换、处理等功能。SparkSession实现了SQLContext及HiveContext所有功能。 

SparkSession支持从不同的数据源加载数据，并把数据转换成DataFrame，并且支持把DataFrame 转换成SQLContext自身中的表，然后使用SQL语句来操作数据。

SparkSession亦提供了HiveQL以及其他依赖于Hive的功能的支持。

# WordCount 词频统计 

在SparkCore中，我们使用RDD封装数据，实现词频统计WordCount功能，从Spark 1.0开始，一直到Spark 2.0，建立在RDD之上的一种新的数据结构DataFrame/Dataset发展而来，更好的实现数据处理分析。 

DataFrame 数据结构相当于给RDD加上约束Schema，知道数据内部结构（字段名称、字段类型），提供两种方式分析处理数据：**DataFrame API（DSL编程）和SQL（类似HiveQL编程）**，下面以WordCount程序为例编程实现，体验DataFrame使用

## 基于DSL编程

使用SparkSession加载文本数据，封装到Dataset/DataFrame中，调用API函数处理分析数据（类似RDD中API函数，如flatMap、map、filter等），编程步骤： 

-   1）构建SparkSession实例对象，设置应用名称和运行模式（开发中，运行模式一般不在代码中设置，而是使用spark-submit设置）
-   2）读取HDFS上文本文件数据
-   3）使用 DSL （Dataset API），类似RDD API处理分析数据
-   4）控制台打印结果数据和关闭SparkSession

演示如下：

```scala
package com.clear.spark.wc

import org.apache.spark.sql.{DataFrame, Dataset, SparkSession}

/**
 * 使用DSL风格编写WordCount
 */
object SparkDSLWordCount {
  def main(args: Array[String]): Unit = {
    // todo 1.通过建造者模式创建SparkSession实例
    val spark: SparkSession = SparkSession.builder()
      .appName("wordCount")
      .master("local[3]")
      .getOrCreate()
    import spark.implicits._
    // todo 2.读取HDFS上文本数据
    val inputDS: Dataset[String] = spark.read.textFile("/opt/data/wc/README.md")
    // todo 3.使用DSL（Dataset API）分析数据
    val resultDF: DataFrame = inputDS
      // 过滤不合格数据
      .filter(line => line != null && line.trim.length > 0)
      // 将每行数据进行分割
      .flatMap(line => line.split("\\s+"))
      // 按照单词进行分组  SELECT word, count(1) FROM tb_words GROUP BY word
      .groupBy("value")
      // 使用count函数，获取值类型Long类型 => 对应数据库中类型为BigInt类型
      .count()
    resultDF.show(10)

    // todo 关闭资源
    spark.close()
  }
}
```

运行结果如下：

```shell
+-------------+-----+
|        value|count|
+-------------+-----+
|   [![PySpark|    1|
|       online|    1|
|       graphs|    1|
|   ["Building|    1|
|documentation|    3|
|     command,|    2|
|  abbreviated|    1|
|     overview|    1|
|         rich|    1|
|          set|    2|
+-------------+-----+
only showing top 10 rows
```

## 基于SQL编程 

也可以实现类似HiveQL方式进行词频统计，直接对单词分组group by，再进行count即可，步骤如下： 

-   1）构建SparkSession对象，加载文件数据，分割每行数据为单词； 
-   2）将DataFrame/Dataset注册为临时视图（Spark 1.x中为临时表）； 
-   3）编写SQL语句，使用SparkSession执行获取结果； 
-   4）控制台打印结果数据和关闭SparkSession； 

演示如下：

```scala
package com.clear.spark.wc

import org.apache.spark.sql.{DataFrame, Dataset, SparkSession}


/**
 * 使用SQL风格编写WordCount
 */
object SparkSQLWordCount {
  def main(args: Array[String]): Unit = {
    // todo 1.通过建造者模式创建SparkSession实例
    val spark: SparkSession = SparkSession.builder()
      .appName("wordCount")
      .master("local[3]")
      .getOrCreate()
    import spark.implicits._
    // todo 2.读取HDFS上文本数据
    val inputDS: Dataset[String] = spark.read.textFile("/opt/data/wc/README.md")
    // todo 3.使用DSL（Dataset API）
    val wordsDS: Dataset[String] = inputDS
      // 过滤不合格数据
      .filter(line => line != null && line.trim.length > 0)
      // 将每行数据进行分割
      .flatMap(line => line.split("\\s+"))

    // select value, count(1) as cnt from tb_words
    // todo 4.将Dataset注册为临时视图
    wordsDS.createOrReplaceTempView("view_tmp_words")
    // todo 5.编写SQL执行分析
    val resultDF: DataFrame = spark.sql(
      """
        |select value, count(1) as cnt
        |from view_tmp_words
        |group by value
        |order by cnt desc
        |""".stripMargin
    )
    resultDF.show(10)

    // todo 关闭资源
    spark.close()
  }
}
```

运行结果如下：

```shell
+-----+---+
|value|cnt|
+-----+---+
|  the| 23|
|   to| 16|
|Spark| 14|
|  for| 12|
|    a|  9|
|  and|  9|
|   ##|  9|
|     |  8|
|  run|  7|
|   is|  7|
+-----+---+
only showing top 10 rows
```



## 说明

无论使用DSL还是SQL编程方式，底层转换为RDD操作都是一样，性能一致（我们可以根据自己的编程风格进行选择）

我们可以通过查看WEB UI监控中Job运行对应的DAG图也可以验证最终将会转换成RDD