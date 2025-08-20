# 影评分析

已知文件"影评分析.7z"中有三份数据，相应格式描述如下： 

-   users.dat 相应描述为：用户编号(int)，性别(String)，年龄(int)，职业(String)， 邮政编码(String) 
-   movies.dat 相应描述为：电影编号(int)，电影名字(String)，电影类型(String) 
-   ratings.dat 相应描述为：用户编号(int)，电影编号(int)，评分(Double)，评分时间戳(Timestamped) 

**要求实现如下功能：** 

1、关联 movies.dat 和 ratings.dat 两张表 

2、按照年份进行分组。计算每部电影的平均评分，平均评分保留小数点后一位，并按评分大小进行排序。 

3、评分一样，按照电影名排序。相同年份的输出到一个文件中。 

4、结果展示形式：年份，电影编号，电影名字，平均分。



## 1）环境准备

我们将准备好的数据上传至Hadoop集群

```shell
[root@kk01 temp]# hadoop fs -put /opt/temp/spark/filmAnalysis/ /clear/filmAnalysis
[root@kk01 temp]# hadoop fs -ls /clear/
Found 7 items
drwxr-xr-x   - root supergroup          0 2023-03-27 03:18 /clear/covid
drwxr-xr-x   - root supergroup          0 2023-05-28 03:08 /clear/filmAnalysis
...
```

紧接着我们在idea中创建名为 **film-analysis** 的模块，并在项目中创建了多个子包，以满足面向对象三层架构思想（非MVC）

模块结构如下

```
com
	clear
		application
		bean
		common
		controller
		dao
		service
		util
```

在pom导入如下依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.apache.spark</groupId>
        <artifactId>spark-core_2.13</artifactId>
        <version>3.2.0</version>
    </dependency>
</dependencies>
```



## 2）代码编写思路

-   读取 movies 文件内容   电影编号::电影名字(年份)::电影类型

-   将读取的文件内容进行结构转换，得到需要的列（用于实现需求）
    
-   即 todo ===> 电影编号::电影名字(年份)
    
-   读取 ratings 文件内容   用户编号::电影编号::评分::评分时间戳

-   将读取的文件内容进行结构转换，得到需要的数据
    
-    即 todo ===> 电影编号::评分  (1489,(95.0,37))
    
-   将结构转换后的数据进行聚合操作（aggregateByKey）得到 (电影编号, (电影总评分,评价次数))
-   关联两个RDD （cogroup，根据key对两个RDD进行联立）
    
    -   即 todo ===> (电影编号,([电影名字(年份)],[评价平均分]))
-   将关联后的RDD进行结构转换 （mapToPair）
    
-   即 todo (电影编号,([电影名字(年份)],[评价平均分])) ===> ((评价平均分, 电影名字), (电影编号, 年份))
    
-   将结构化转换后的数据在进行结构化转换 mapToPair
    
-    即 todo ((评价平均分, 电影名字), (电影编号, 年份)) ===>  (年份, (电影编号, 电影名字, 评价平均分))
    
-   将结构转换后的数据进行 分组（groupByKey 按照key进行分组）

-   将分组后的数据进行扁平化处理（ flatMapToPair）

-   将分组后的数据进行再次结构化 即 todo (年份, (电影编号, 电影名字, 评价平均分)) ===> ((评价平均分, 电影名字), (电影编号, 年份))

    -   将结构化的数据按照 (评价平均分, 电影名字) 进行排序（倒序,正序）

    注意：

    ​	**这里分组排序不能使用groupByKey + sortByKey**

    ​	**可以使用 repartitionAndSortWithinPartitions 算子实现**

    ​	不过我们这里采用了 flatMapToPair + Collections.sort 的方式实现

-   将排序以后的数据按照 年份 保存至不同的文件

-   使用 mapToPair 结构转换 即 todo ((评价平均分, 电影名字), (电影编号, 年份)) ===> (年份, (电影编号, 电影名字, 评价平均分))

-   使用 partitionBy 分区

    -   分区数 numPartition = 最大year - 最小year + 1
    -   具体的话可以使用 map+max map+min得到 最大year与 最小year
    -   当然，也可以使用top算子获取最大year、最小year，不过这需要自定义排序规则

-   使用 map 将数据进行结构转换 转换为 年份，电影编号，电影名字，平均分

-   使用 save 算子保存数据



## 3）项目实现

### application

```java
package com.clear.application;

public class FilmAnalysisApplication {
    public static void main(String[] args) {
        TApplicationImpl tApplication = new TApplicationImpl();
        // 启动Spark程序
        tApplication.start("yarn", "影评分析");
    }
}
```

```java
package com.clear.application;

import com.clear.common.TApplication;
import com.clear.controller.FilmAnalysisController;
import com.clear.util.EnvUtil;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaSparkContext;

public class TApplicationImpl implements TApplication {
    @Override
    public void start(String master,String appName) {
        SparkConf sparkConf = new SparkConf().setMaster(master).setAppName(appName);
        //SparkConf sparkConf = new SparkConf().setAppName("影片分析");
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        jsc.setLogLevel("WARN");

        // 将 JavaSparkContext 保存至 ThreadLocalMap 供持久层读取数据时使用
        EnvUtil.put(jsc);

        FilmAnalysisController filmAnalysisController = new FilmAnalysisController();
        filmAnalysisController.execute();

        // 删除 ThreadLocalMap 中的 JavaSparkContext
        EnvUtil.clear();
    }
}
```

### bean

```java
package com.clear.bean;

import java.io.Serializable;
import java.util.Comparator;

/**
 * 年份比较器
 */
public class YearComparator implements Comparator<Integer>, Serializable {
    @Override
    public int compare(Integer o1, Integer o2) {
        return o1.compareTo(o2);
    }
}
```

### common

```java
package com.clear.common;

public interface TApplication {
    /**
     * 启动spark程序
     */
    void start(String master,String appName);
}
```

```java
package com.clear.common;

public interface TController {
    /**
     * 驱动执行计算逻辑
     */
    void execute();
}
```

```java
package com.clear.common;

public interface TService {
    /**
     * 影评分析
     *
     * @return 返回分析后的结果数据
     */
    Object filmAnalysis();
}
```

```java
package com.clear.common;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.spark.api.java.JavaPairRDD;

public interface TDao {
    /**
     * 读取数据
     */
    JavaPairRDD<LongWritable, Text> readMoviesData(String path);

    JavaPairRDD<LongWritable, Text> readRatingsData(String path);
}
```

### controller

```java
package com.clear.controller;

import com.clear.common.TController;
import com.clear.service.FilmAnalysisService;
import org.apache.spark.api.java.JavaRDD;

/**
 * 控制层
 */
public class FilmAnalysisController implements TController {
    private FilmAnalysisService filmAnalysisService = new FilmAnalysisService();

    // 调度
    @Override
    public void execute() {
        // 调用服务层，执行影评分析逻辑
        JavaRDD<String> resultRDD = filmAnalysisService.filmAnalysis();
        // 将分析结果持久化到HDFS
        resultRDD.saveAsTextFile("hdfs://kk01:8020/clear/filmAnalysisOutPut/");
    }
}
```

### service

```java
package com.clear.service;

import com.clear.bean.YearComparator;
import com.clear.common.TService;
import com.clear.dao.FilmAnalysisDao;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;	
import org.apache.spark.HashPartitioner;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.api.java.function.Function2;
import org.apache.spark.api.java.function.PairFlatMapFunction;
import org.apache.spark.api.java.function.PairFunction;
import scala.Tuple2;
import scala.Tuple3;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.*;

/**
 * 服务层
 */
public class FilmAnalysisService implements TService, Serializable {
    private FilmAnalysisDao filmAnalysisDao = new FilmAnalysisDao();

    /**
     * 影评分析
     */
    @Override
    public JavaRDD<String> filmAnalysis() {
        // 调用持久层方法，获取数据
        JavaPairRDD<LongWritable, Text> movies = filmAnalysisDao.readMoviesData("hdfs://kk01:8020/clear/filmAnalysis/movies.dat");
        JavaPairRDD<LongWritable, Text> ratings = filmAnalysisDao.readRatingsData("hdfs://kk01:8020/clear/filmAnalysis/ratings.dat");

        // todo 下面是执行分析逻辑
        JavaPairRDD<Integer, String> filmNumberTOFilmTitleRDD = movies.mapToPair(new PairFunction<Tuple2<LongWritable, Text>, Integer, String>() {
            @Override
            public Tuple2<Integer, String> call(Tuple2<LongWritable, Text> longWritableTextTuple2) throws Exception {
                String text = longWritableTextTuple2._2.toString();
                String[] fields = text.split("::");
                Integer filmNumber = Integer.valueOf(fields[0]);  // 电影编号
                String filmTitle = fields[1];  // 电影名称

                return new Tuple2<>(filmNumber, filmTitle);
            }
        });
        // filmNumberTOFilmTitleRDD.foreach(s-> System.out.println(s));
        // (3940,Slumber Party Massacre III, The (1990))

        JavaPairRDD<Integer, Double> filmNumberTOFilmRatingRDD = ratings.mapToPair(new PairFunction<Tuple2<LongWritable, Text>, Integer, Double>() {
            @Override
            public Tuple2<Integer, Double> call(Tuple2<LongWritable, Text> longWritableTextTuple2) throws Exception {
                String text = longWritableTextTuple2._2.toString();
                String[] fields = text.split("::");
                Integer filmNumber = Integer.valueOf(fields[1]);  // 电影编号
                Double filmRating = Double.parseDouble(fields[2]);  // 评分

                return new Tuple2<>(filmNumber, filmRating);
            }
        });

        //filmNumberTOFilmRatingGroupByKeyRDD.foreach(s -> System.out.println(s));
        // filmNumberTOFilmTotalRatingAndCountRDD 表示电影总评分与评价次数
        JavaPairRDD<Integer, Tuple2<Double, Integer>> filmNumberTOFilmTotalRatingAndCountRDD = filmNumberTOFilmRatingRDD.aggregateByKey(
                // 初始值
                new Tuple2<Double, Integer>(0.0, 0),
                // 分区内计算规则
                new Function2<Tuple2<Double, Integer>, Double, Tuple2<Double, Integer>>() {
                    @Override
                    public Tuple2<Double, Integer> call(Tuple2<Double, Integer> v1, Double v2) throws Exception {
                        // Tuple2<Double, Integer> v1 表示 (电影总评分,评分次数)
                        // Double v2 表示一个人对该电影的评分
                        return new Tuple2<>(v1._1 + v2, v1._2 + 1);
                    }
                },
                // 分区间计算规则
                new Function2<Tuple2<Double, Integer>, Tuple2<Double, Integer>, Tuple2<Double, Integer>>() {
                    @Override
                    public Tuple2<Double, Integer> call(Tuple2<Double, Integer> v1, Tuple2<Double, Integer> v2) throws Exception {
                        return new Tuple2<>(v1._1 + v2._1, v1._2 + v2._2);  // (电影总评分,总评分次数)
                    }
                }
        );
        // filmTotalRatingAndCountRDD.foreach(s-> System.out.println(s));
        // (1489,(95.0,37))

        // 计算每部电影的评价平均分
        JavaPairRDD<Integer, Double> filmNumberTOFilmRatingAvgRDD = filmNumberTOFilmTotalRatingAndCountRDD.mapValues(new Function<Tuple2<Double, Integer>, Double>() {
            @Override
            public Double call(Tuple2<Double, Integer> v1) throws Exception {
                double ratingAvg = v1._1 / v1._2;
                // 利用BigDecimal来实现四舍五入.保留一位小数
                // 1代表保留1位小数,保留两位小数就是2,依此累推
                // BigDecimal.ROUND_HALF_UP 代表使用四舍五入的方式
                double ratingAvg_1 = new BigDecimal(ratingAvg).setScale(1, BigDecimal.ROUND_HALF_UP).doubleValue();

                return ratingAvg_1;  // 电影评价平均分
            }
        });
        // filmNumberTOFilmRatingAvgRDD.foreach(s -> System.out.println(s));
        // (3203,3.7)

        // 关联
        JavaPairRDD<Integer, Tuple2<Iterable<String>, Iterable<Double>>> cogroupRDD = filmNumberTOFilmTitleRDD.cogroup(filmNumberTOFilmRatingAvgRDD);
        // cogroupRDD.foreach(s -> System.out.println(s));
        // (2390,([Little Voice (1998)],[3.7]))
        // (1557,([Squeeze (1996)],[]))

        // 将关联后的RDD进行结构转换
        // 即 todo (电影编号,([电影名字(年份)],[评价平均分])) ===> ((评价平均分, 电影名字), (电影编号, 年份))
        JavaPairRDD<Tuple2<Double, String>, Tuple2<Integer, Integer>> ratingAvgANDFilmTitleTOFilmNumberANDYearRDD = cogroupRDD.mapToPair(new PairFunction<Tuple2<Integer, Tuple2<Iterable<String>, Iterable<Double>>>, Tuple2<Double, String>, Tuple2<Integer, Integer>>() {
            @Override
            public Tuple2<Tuple2<Double, String>, Tuple2<Integer, Integer>> call(Tuple2<Integer, Tuple2<Iterable<String>, Iterable<Double>>> integerTuple2Tuple2) throws Exception {
                Integer filmNumber = integerTuple2Tuple2._1;  // 电影编号
                Tuple2<Iterable<String>, Iterable<Double>> iterableIterableTuple2 = integerTuple2Tuple2._2;  // ([电影名字(年份)],[评价平均分])
                Iterable<String> iterable1 = iterableIterableTuple2._1;  // [电影名字(年份)]
                Iterator<String> iterator1 = iterable1.iterator();
                String filmTitle = "";  // 电影名字
                Integer year = -1;  // 年份
                while (iterator1.hasNext()) {
                    String next = iterator1.next();
                    // String[] fields = next.split("\\(");
                    // filmTitle = fields[0];
                    // year = Integer.valueOf(fields[1].replaceFirst("\\)", ""));
                    // 避坑 java.lang.NumberFormatException: For input string: "Le Legge "
                    // 数据中会出现  The (Le Legge) (1958) 内容的情况下，不能按照 ( 进行分割字符串
                    filmTitle = next.substring(0, next.lastIndexOf("(")).trim();
                    year = Integer.valueOf(next.substring(next.lastIndexOf("(") + 1, next.lastIndexOf(")")));
                }
                Iterable<Double> iterable2 = iterableIterableTuple2._2;  // [评价平均分]
                Iterator<Double> iterator2 = iterable2.iterator();
                Double ratingAvg = 0.0;  // 评价平均分
                while (iterator2.hasNext()) {
                    ratingAvg = iterator2.next();
                }

                return new Tuple2<>(new Tuple2<>(ratingAvg, filmTitle), new Tuple2<>(filmNumber, year));   // ((评价平均分, 电影名), (电影编号, 年份))
            }
        });

        // 将数据再次进行结构化转换
        // 1)先将排序后的数据进行结构转换 即 todo ((评价平均分, 电影名字), (电影编号, 年份)) ===> (年份, (电影编号, 电影名字, 评价平均分))
        JavaPairRDD<Integer, Tuple3<Integer, String, Double>> yearTOFilmNumberANDFilmTitleANDRatingAVgRDD = ratingAvgANDFilmTitleTOFilmNumberANDYearRDD.mapToPair(new PairFunction<Tuple2<Tuple2<Double, String>, Tuple2<Integer, Integer>>, Integer, Tuple3<Integer, String, Double>>() {
            @Override
            public Tuple2<Integer, Tuple3<Integer, String, Double>> call(Tuple2<Tuple2<Double, String>, Tuple2<Integer, Integer>> tuple2Tuple2Tuple2) throws Exception {
                Double ratingAvg = tuple2Tuple2Tuple2._1._1;  // 评价平均分
                String filmTitle = tuple2Tuple2Tuple2._1._2;  // 电影名称
                Integer filmNumber = tuple2Tuple2Tuple2._2._1;  // 电影编号
                Integer year = tuple2Tuple2Tuple2._2._2;  // 年份
                return new Tuple2<>(year, new Tuple3<>(filmNumber, filmTitle, ratingAvg));  // (年份, (电影编号, 电影名字, 评价平均分))
            }
        });

        // 2)再将结构化转换后的数据按照年份进行 分组
        JavaPairRDD<Integer, Iterable<Tuple3<Integer, String, Double>>> groupByYearRDD = yearTOFilmNumberANDFilmTitleANDRatingAVgRDD.groupByKey();

        // 做缓存
        groupByYearRDD.cache();

        // 这里是用于实现计算分区数
        JavaRDD<Integer> years = groupByYearRDD.map(s -> s._1);
        Integer maxYear = years.max(new YearComparator());
        Integer minYear = years.min(new YearComparator());
        int numPartitions = maxYear - minYear + 1;


        // 将分组以后的数据再进行结构转换
        // todo  (年份, (电影编号, 电影名字, 评价平均分)) ===> ((评价平均分, 电影名字), (电影编号, 年份))
        JavaPairRDD<Tuple2<Double, String>, Tuple2<Integer, Integer>> ratingAvgANDFilmTitleTOFilmNumberANDYearRDD2 = groupByYearRDD.flatMapToPair(new PairFlatMapFunction<Tuple2<Integer, Iterable<Tuple3<Integer, String, Double>>>, Tuple2<Double, String>, Tuple2<Integer, Integer>>() {
            @Override
            public Iterator<Tuple2<Tuple2<Double, String>, Tuple2<Integer, Integer>>> call(Tuple2<Integer, Iterable<Tuple3<Integer, String, Double>>> integerIterableTuple2) throws Exception {
                List<Tuple2<Tuple2<Double, String>, Tuple2<Integer, Integer>>> result = new ArrayList<>();
                for (Tuple3<Integer, String, Double> tuple3 : integerIterableTuple2._2) {  // [(电影编号, 电影名字, 评价平均分),...]
                    Integer year = integerIterableTuple2._1;  // 年份
                    Integer filmNumber = tuple3._1();  // 电影编号
                    String filmTitle = tuple3._2();  // 电影名字
                    Double ratingAvg = tuple3._3();  // 评价平均分

                    Tuple2<Tuple2<Double, String>, Tuple2<Integer, Integer>> newTuple = new Tuple2<>(
                            new Tuple2<>(ratingAvg, filmTitle),
                            new Tuple2<>(filmNumber, year)
                    );  // ((评价平均分, 电影名), (电影编号, 年份))
                    result.add(newTuple);
                }
                // 排序，Collections.reverseOrder 表示倒排
                Collections.sort(result, Collections.reverseOrder(new Comparator<Tuple2<Tuple2<Double, String>, Tuple2<Integer, Integer>>>() {
                    @Override
                    public int compare(Tuple2<Tuple2<Double, String>, Tuple2<Integer, Integer>> o1, Tuple2<Tuple2<Double, String>, Tuple2<Integer, Integer>> o2) {
                        Double thisDouble = o1._1._1;  // 评价平均分
                        String thisString = o1._1._2;  // 电影名字
                        Double thatDouble = o2._1._1;  // 评价平均分
                        String thatString = o2._1._2;  // 电影名字

                        int cmp = thisDouble.compareTo(thatDouble);  // 按照 评价平均分 从小到大排序
                        // 如果 评价平均分 一致，则按照 电影名字 排序
                        if (cmp == 0) {
                            cmp = thatString.compareTo(thisString);  // 如果评价平均分一样，按电影名字 倒序排序
                        }

                        return cmp;
                    }
                }));
                return result.iterator();
            }
        });

        //  ratingAvgANDFilmTitleTOFilmNumberANDYearRDD2.cache();
        // ratingAvgANDFilmTitleTOFilmNumberANDYearRDD2.foreach(s -> System.out.println(s));
        //   System.out.println(ratingAvgANDFilmTitleTOFilmNumberANDYearRDD2.toDebugString());

        JavaRDD<String> resultRDD = ratingAvgANDFilmTitleTOFilmNumberANDYearRDD2.mapToPair(new PairFunction<Tuple2<Tuple2<Double, String>, Tuple2<Integer, Integer>>, Integer, Tuple3<Integer, String, Double>>() {
            @Override
            public Tuple2<Integer, Tuple3<Integer, String, Double>> call(Tuple2<Tuple2<Double, String>, Tuple2<Integer, Integer>> tuple2Tuple2Tuple2) throws Exception {
                Double ratingAvg = tuple2Tuple2Tuple2._1._1;  // 评价平均分
                String filmTitle = tuple2Tuple2Tuple2._1._2;  // 电影名称
                Integer filmNumber = tuple2Tuple2Tuple2._2._1;  // 电影编号
                Integer year = tuple2Tuple2Tuple2._2._2;  // 年份
                return new Tuple2<>(year, new Tuple3<>(filmNumber, filmTitle, ratingAvg));  // (年份, (电影编号, 电影名字, 评价平均分))
            }
        }).partitionBy(new HashPartitioner(numPartitions)).map(new Function<Tuple2<Integer, Tuple3<Integer, String, Double>>, String>() {
            @Override
            public String call(Tuple2<Integer, Tuple3<Integer, String, Double>> integerTuple3Tuple2) throws Exception {
                Integer year = integerTuple3Tuple2._1;  // 年份
                Integer filmNumber = integerTuple3Tuple2._2._1();  // 电影编号
                String filmTitle = integerTuple3Tuple2._2._2();  // 电影名称
                Double ratingAvg = integerTuple3Tuple2._2._3();  // 评价平均分
                // 年份，电影编号，电影名字，平均分
                return year + ", " + filmNumber + ", " + filmTitle + ", " + ratingAvg;
            }
        });

        return resultRDD;
    }
}
```

### dao

```java
package com.clear.dao;

import com.clear.common.TDao;
import com.clear.util.EnvUtil;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapred.TextInputFormat;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaSparkContext;

import java.io.Serializable;

/**
 * 持久层：主要作用是从HDFS读取数据
 */
public class FilmAnalysisDao implements TDao, Serializable {

    public JavaPairRDD<LongWritable, Text> readMoviesData(String path) {
        JavaSparkContext jsc = EnvUtil.take();

        JavaPairRDD<LongWritable, Text> movies = jsc.hadoopFile(path,
                TextInputFormat.class, LongWritable.class, Text.class);
        
        return movies;
    }

    public JavaPairRDD<LongWritable, Text> readRatingsData(String path) {
        JavaSparkContext jsc = EnvUtil.take();

        JavaPairRDD<LongWritable, Text> ratings = jsc.hadoopFile(path,
                TextInputFormat.class, LongWritable.class, Text.class);
     
        return ratings;
    }
}   
```

### util

```java
package com.clear.util;

import org.apache.spark.api.java.JavaSparkContext;

/**
 * 主要实现将 JavaSparkContext 对象保存到ThreadLocalMap，方便dao层使用
 */
public class EnvUtil {
    private static ThreadLocal<JavaSparkContext> jscLocal = new ThreadLocal<JavaSparkContext>();

    public static void put(JavaSparkContext jsc) {
        jscLocal.set(jsc);
    }

    public static JavaSparkContext take() {
        return jscLocal.get();
    }

    public static void clear() {
        jscLocal.remove();
    }
}
```



## 4）结果展示

**将模块打包上传至Linux服务器**

```shell
D:\code\hadoop\film-analysis>mvn compile
...

[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  6.455 s
[INFO] Finished at: 2023-06-04T17:13:10+08:00
[INFO] ------------------------------------------------------------------------

D:\code\hadoop\film-analysis>
D:\code\hadoop\film-analysis>mvn package
...

[INFO] --- maven-jar-plugin:2.4:jar (default-jar) @ film-analysis ---
[INFO] Building jar: D:\code\hadoop\film-analysis\target\film-analysis-1.0.jar
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  6.770 s
[INFO] Finished at: 2023-06-04T17:19:18+08:00
[INFO] ------------------------------------------------------------------------

D:\code\hadoop\film-analysis>
```

```shell
(pyspark) [root@kk01 temp]# ls film-analysis-1.0.jar 
film-analysis-1.0.jar
```

**启动Hadoop集群**

```shell
(pyspark) [root@kk01 temp]# hdp.sh start   # 使用的是自定义脚本
```

**确保Hadoop集群启动成功**

```shell
(pyspark) [root@kk01 temp]# jpsall    # 使用自定义脚本查看JVM进程
=========kk01=========
3381 NodeManager
3798 JobHistoryServer
2472 NameNode
2666 DataNode
3947 Jps
3182 ResourceManager
=========kk02=========
2563 NodeManager
2755 Jps
2300 DataNode
2415 SecondaryNameNode
=========kk03=========
2640 Jps
2449 NodeManager
2297 DataNode
```

**提交Spark任务**

```shell
(pyspark) [root@kk01 temp]# /opt/software/spark-yarn/bin/spark-submit --master yarn --deploy-mode cluster --class com.clear.application.FilmAnalysisApplicati
on /opt/temp/film-analysis-1.0.jar 
```

**查看输出结果**

```shell
(pyspark) [root@kk01 temp]# hadoop fs -ls /clear/filmAnalysisOutPut
Found 83 items
-rw-r--r--   3 root supergroup          0 2023-06-04 05:27 /clear/filmAnalysisOutPut/_SUCCESS
-rw-r--r--   3 root supergroup        796 2023-06-04 05:27 /clear/filmAnalysisOutPut/part-00000
-rw-r--r--   3 root supergroup        703 2023-06-04 05:27 /clear/filmAnalysisOutPut/part-00001
-rw-r--r--   3 root supergroup        625 2023-06-04 05:27 
...

-rw-r--r--   3 root supergroup        504 2023-06-04 05:27 /clear/filmAnalysisOutPut/part-00080
-rw-r--r--   3 root supergroup        893 2023-06-04 05:27 /clear/filmAnalysisOutPut/part-00081
(pyspark) [root@kk01 temp]# 
(pyspark) [root@kk01 temp]# hadoop fs -cat /clear/filmAnalysisOutPut/part-00000
1968, 924, 2001: A Space Odyssey, 4.1
1968, 2300, Producers, The, 4.1
1968, 3164, Alley Cats, The, 4.0
1968, 3507, Odd Couple, The, 4.0
1968, 1023, Winnie the Pooh and the Blustery Day, 4.0
1968, 2285, If...., 3.9
1968, 3668, Romeo and Juliet, 3.9
1968, 2160, Rosemary's Baby, 3.8
1968, 702, Faces, 3.7
1968, 3143, Hell in the Pacific, 3.7
1968, 968, Night of the Living Dead, 3.7
1968, 1951, Oliver!, 3.7
1968, 2529, Planet of the Apes, 3.7
1968, 2857, Yellow Submarine, 3.7
1968, 2764, Thomas Crown Affair, The, 3.6
1968, 3333, Killing of Sister George, The, 3.5
1968, 3367, Devil's Brigade, The, 3.4
1968, 3427, Coogan's Bluff, 3.3
1968, 775, Spirits of the Dead (Tre Passi nel Delirio), 3.2
1968, 2035, Blackbeard's Ghost, 3.1
1968, 674, Barbarella, 3.0
1968, 3875, Devil Rides Out, The, 2.8
(pyspark) [root@kk01 temp]# hadoop fs -cat /clear/filmAnalysisOutPut/part-00081
1967, 3233, Smashing Time, 5.0
1967, 1276, Cool Hand Luke, 4.3
1967, 1247, Graduate, The, 4.2
1967, 1084, Bonnie and Clyde, 4.1
1967, 1950, In the Heat of the Night, 4.1
1967, 2944, Dirty Dozen, The, 4.0
1967, 3451, Guess Who's Coming to Dinner, 3.9
1967, 2078, Jungle Book, The, 3.8
1967, 3028, Taming of the Shrew, The, 3.8
1967, 3296, To Sir with Love, 3.8
1967, 154, Belle de jour, 3.7
1967, 3487, Dorado, El, 3.7
1967, 2922, Hang 'em High, 3.7
1967, 3658, Quatermass and the Pit, 3.7
1967, 2870, Barefoot in the Park, 3.6
1967, 3337, I'll Never Forget What's 'is Name, 3.5
1967, 823, Collectionneuse, La, 3.3
1967, 2049, Happiest Millionaire, The, 3.3
1967, 3025, Rough Night in Jericho, 3.3
1967, 2135, Doctor Dolittle, 3.2
1967, 2047, Gnome-Mobile, The, 3.2
1967, 3049, How I Won the War, 3.2
1967, 3345, Charlie, the Lonesome Cougar, 3.1
1967, 3460, Hillbillys in a Haunted House, 1.0
```

