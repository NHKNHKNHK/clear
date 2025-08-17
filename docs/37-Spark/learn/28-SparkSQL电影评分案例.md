# **电影评分数据分析** 

使用电影评分数据进行数据分析，分别使用DSL编程和SQL编程，熟悉数据处理函数及SQL使用，业务需求说明： 

对电影评分数据进行统计分析，获取Top10电影（电影评分平均值最高，并且每个电影被评分的次数大于2000)。 

数据集ratings.dat总共100万条数据，数据格式如下，每行数据各个字段之间使用双冒号分开： 

```
1::1193::5::978300760
1::661::3::978302109
1::914::3::978301968
1::3408::4::978300275
1::2355::5::978824291
1::1197::3::978302268
1::1287::5::978302039
1::2804::5::978300719
1::594::4::978302268
1::919::4::978301368
...
```

字段说明：

​	用户ID，电影ID，评分，时间戳



数据处理分析步骤如下： 

-   1）读取电影评分数据，从本地文件系统读取 

-   2）转换数据，指定Schema信息，封装到DataFrame 

-   3）基于SQL方式分析 / 基于DSL方式分析

## SQL编程风格

```scala
package com.clear.spark.movie

import org.apache.spark.rdd.RDD
import org.apache.spark.sql.{DataFrame, SaveMode, SparkSession}

import java.util.Properties

/**
 * 需求：对电影评分数据进行统计分析，获取Top10电影评分平均值，并且每个电影被评分的次数大于2000
 */
object SparkTop10Movie {
    def main(args: Array[String]): Unit = {
        // 获取SparkSession实例
        val spark: SparkSession = SparkSession.builder()
          .master("local[2]")
          .appName(this.getClass.getSimpleName.stripSuffix("$"))
          // todo 配置shuffle时的分区数目
          // 在SparkSQL中当Job中产生Shuffle时，默认的分区数（spark.sql.shuffle.partitions ）为200，在实际项目中要合理的设置
          // 在Spark3 中不需要手动设置
          .config("spark.sql.shuffle.partitions", "4")
          .getOrCreate()
        // 导入隐式转换函数库
        import spark.implicits._

        // todo 读取电影评分数据
        val linesRDD: RDD[String] = spark.sparkContext.textFile("hdfs://kk01:8020/datas/ml-1m", minPartitions = 2)

        // todo 转换数据得到DataFrame：通过指定schema获取
        val etlRDD: RDD[(String, String, Double, Long)] = linesRDD
          // 过滤数据
          .filter(line => null != line && line.trim.split("::").length == 4)
          // 转换数据
          .mapPartitions { iter =>
              iter.map {
                  line =>
                      // 按照分割符分割，拆箱到变量中
                      val Array(userId, movieId, rating, timestamp) = line.split("::")
                      // 返回四元组
                      (userId, movieId, rating.toDouble, timestamp.toLong)
              }
          }
        
        val ratingDF = etlRDD.toDF("userId", "movieId", "rating", "timestamp")
        /*
        root
            |-- userId: string (nullable = true)
            |-- movieId: string (nullable = true)
            |-- rating: double (nullable = false)
            |-- timestamp: long (nullable = false)
        */

        // todo 基于SQL方式分析
        // 1）注册为临时试图
        ratingDF.createOrReplaceTempView("tmp_view_ratings")
        // 2）编写SQL执行
        /**
         * 按照电影进行分组，计算每个电影平均评分和评分人数
         * 过滤获取评分人数大于2000的电影
         * 按照电影评分降序排序，再按照评分人数排序
         */
        val top10Movie: DataFrame = spark.sql(
            """
              |SELECT
              |     movieId,
              |     ROUND(AVG(rating), 2) AS avg_rating,
              |     COUNT(movieId) AS cnt_rating
              |FROM
              |     tmp_view_ratings
              |GROUP BY
              |     movieId
              |HAVING
              |     cnt_rating >= 2000
              |ORDER BY
              |     avg_rating DESC,
              |     cnt_rating DESC
              |LIMIT 10
              |""".stripMargin)

        // todo 将分析结果保存至MySQL表和CSV文件
        top10Movie.cache() // 结果数据比较少，直接放入内存

        // 保存至MySQL表
        top10Movie
          .write
          .mode(SaveMode.Overwrite) // 保存模式
          .option("driver", "com.mysql.jdbc.Driver") // mysql8： com.mysql.cj.jdbc.Driver
          .option("user", "root")
          .option("password", "123456")
          .jdbc(
              "jdbc:mysql://kk01:3306/?serverTimezone=UTC&characterEncoding=utf8&useUnicode=true",
              "db_test.tb_top10_movies",
              new Properties()
          )
        // 保存到CSV文件：每个字段之间使用 , 分割
        top10Movie
          .coalesce(1) // 缩减分区：让所有数据保存至一个文件
          .write
          .mode(SaveMode.Overwrite)
          .option("header", "true")
          .option("seq", ",") // 默认就是逗号
          .csv("hdfs://kk01:8020/datas/top10-movies")


        // 释放缓存数据
        top10Movie.unpersist()

        // Thread.sleep(10000000)
        // 程序结束，关闭资源
        spark.stop()
    }
}
```

## DSL编程风格

```scala
package com.clear.spark.movie

import org.apache.spark.rdd.RDD
import org.apache.spark.sql.{DataFrame, Dataset, Row, SaveMode, SparkSession}

import java.util.Properties

/**
 * 需求：对电影评分数据进行统计分析，获取Top10电影评分平均值，并且每个电影被评分的次数大于2000
 */
object SparkTop10Movie2 {
    def main(args: Array[String]): Unit = {
        // 获取SparkSession实例
        val spark: SparkSession = SparkSession.builder()
          .master("local[2]")
          .appName(this.getClass.getSimpleName.stripSuffix("$"))
          // todo 配置shuffle时的分区数目
          // 在SparkSQL中当Job中产生Shuffle时，默认的分区数（spark.sql.shuffle.partitions ）为200，在实际项目中要合理的设置
          // 在Spark3 中不需要手动设置
          .config("spark.sql.shuffle.partitions", "4")
          .getOrCreate()
        // 导入隐式转换函数库
        import spark.implicits._

        // todo 读取电影评分数据
        val linesRDD: RDD[String] = spark.sparkContext.textFile("file:///D:/video/workspace/spark_2.13/bigdata-spark_2.13/spark-sql/src/datas/ml-1m/ratings.dat", minPartitions = 2)

        // todo 转换数据得到DataFrame：通过指定schema获取
        val etlRDD: RDD[(String, String, Double, Long)] = linesRDD
          // 过滤数据
          .filter(line => null != line && line.trim.split("::").length == 4)
          // 转换数据
          .mapPartitions { iter =>
              iter.map {
                  line =>
                      // 按照分割符分割，拆箱到变量中
                      val Array(userId, movieId, rating, timestamp) = line.split("::")
                      // 返回四元组
                      (userId, movieId, rating.toDouble, timestamp.toLong)
              }
          }

        val ratingDF: DataFrame = etlRDD.toDF("userId", "movieId", "rating", "timestamp")
        /*
        root
            |-- userId: string (nullable = true)
            |-- movieId: string (nullable = true)
            |-- rating: double (nullable = false)
            |-- timestamp: long (nullable = false)
        */

        // todo 基于DSL方式分析
        // 注意：基于DSL方式记得导入函数库

        import org.apache.spark.sql.functions._

        val top10Movie: Dataset[Row] = ratingDF
          // 1)按照电影分组
          .groupBy($"movieId") // fixme 可以传String或Column，建议传入Column对象
          // 2)聚合操作：平均评分、评分人数
          .agg(
              round(avg($"rating"), 2) as ("avg_rating"),
              count($"movieId") as ("cnt_rating")
          )
          // 3)过滤：评分人数>=2000
          .where($"cnt_rating" >= 2000)
          // 4)排序：按照电影评分降序排序，再按照评分人数排序
          .orderBy($"avg_rating".desc, $"cnt_rating".desc)
          .limit(10)

        top10Movie.printSchema()
        top10Movie.show()

        // todo 将分析结果保存至MySQL表和CSV文件
        top10Movie.cache() // 结果数据比较少，直接放入内存

        // 保存至MySQL表
        top10Movie
          .write
          .mode(SaveMode.Overwrite) // 保存模式
          .option("driver", "com.mysql.jdbc.Driver") // mysql8： com.mysql.cj.jdbc.Driver
          .option("user", "root")
          .option("password", "123456")
          .jdbc(
              "jdbc:mysql://kk01:3306/?serverTimezone=UTC&characterEncoding=utf8&useUnicode=true",
              "db_test.tb_top10_movies",
              new Properties()
          )
        // 保存到CSV文件：每个字段之间使用 , 分割
        top10Movie
          .coalesce(1) // 缩减分区：让所有数据保存至一个文件
          .write
          .mode(SaveMode.Overwrite)
          .option("header", "true")
          .option("seq", ",") // 默认就是逗号
          .csv("hdfs://kk01:8020/datas/top10-movies")


        // 释放缓存数据
        top10Movie.unpersist()

        Thread.sleep(10000000)
        // 程序结束，关闭资源
        spark.stop()
    }

}
```

