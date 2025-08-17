# 自定义UDF函数

## Spark SQL函数

### Spark SQL内置函数

无论Hive还是SparkSQL分析处理数据时，往往需要使用函数，SparkSQL模块本身自带很多实现公共功能的函数，在 `org.apache.spark.sql.functions `中这些函数主要分为10类：UDF函数、聚合函数、日期函数、排序函数、非聚合函数、数学函数、混杂函数、窗口函数、字符串函数、集合函数，大部分函数与Hive中相同。

使用内置函数有两种方式：

-   一种是通过编程的方式（DSL）使用

-   另一种是在SQL语句中使用


SparkSQL与Hive一样支持定义函数：UDF和UDAF，尤其是UDF函数在实际项目中使用最为广泛。

回顾Hive中自定义函数有三种类型： 

-   第一种：UDF（User-Defined-Function） 函数 
    -   一对一的关系，输入一个值经过函数以后输出一个值； 
    -   在Hive中继承UDF类，方法名称为evaluate，返回值不能为void，其实就是实现一个方法； 
-   第二种：UDAF（User-Defined Aggregation Function） 聚合函数 
    -   多对一的关系，输入多个值输出一个值，通常与groupBy联合使用； 
-   第三种：UDTF（User-Defined Table-Generating Functions） 函数 
    -   一对多的关系，输入一个值输出多个值（一行变为多行）； 
    -   用户自定义生成函数，有点像flatMap； 

在SparkSQL中，目前仅仅支持UDF函数和UDAF函数:

-   UDF函数：一对一关系； 
-   UDAF函数：聚合函数，通常与group by 分组函数连用，多对一关系； 

由于SparkSQL数据分析有两种方式：DSL编程和SQL编程，所以定义UDF函数也有两种方式， 不同方式可以在不同分析中使用。 

#### 注意

Scala版本中，如果需要使用内置函数，必须引用

```scala
// 隐射转换函数库
import org.apache.spark.sql.functions._
```

Java版本，如果使用内置函数的话，必须引用

```java
// todo 必须引入，否则无法使用内置函数
import static org.apache.spark.sql.functions.*;
```

必须为static 静态的  才可以使用其中的方法！

下面是官方API文档中的使用样例：

```java
public Dataset<Row> join(Dataset<?> right,
                         Column joinExprs,
                         String joinType)
Join with another DataFrame, using the given join expression. The following performs a full outer join between df1 and df2.

   // Scala:
   import org.apache.spark.sql.functions._
   df1.join(df2, $"df1Key" === $"df2Key", "outer")

   // Java:
   import static org.apache.spark.sql.functions.*;
   df1.join(df2, col("df1Key").equalTo(col("df2Key")), "outer");
```



### 用户自定义函数

-   在 Spark 处理数据的过程中，虽然 DataSet 下的算子不多，但已经可以处理大多数的数据需求，但仍有少数需求需要自定义函数。**UDF**(User Defined Functions) 是普通的**不会产生 Shuffle** 不会划分新的阶段的用户自定义函数，UDAF(User Defined Aggregator Functions) 则会打乱分区，用户自定义聚合函数。
-   因为 **UDF 不需要打乱分区**，直接对 RDD 每个分区中的数据进行处理并返回当前分区，所以可以直接注册 UDF 函数，甚至可以传入匿名函数。
-   相比较 UDF 而言因为 **UDAF 是聚合函数所以要打乱分区**，所以也就比较复杂，并且需要重写指定的方法来定义。需要注意的是针对**弱类型的 UserDefinedAggregateFunction 已经弃用**，**普遍使用强类型的 Aggregator** ，同时若想在 Spark3.0 版本之前使用强类型 UDAF 和 Spark3.0 版本之后的定义方式略有不同。

数据准备

在HDFS的/datas目录下，有user.json文件，内容如下

```json
{"username":"zhangsan","age":20}
{"username":"lisi","age":29}
{"username":"wangwu","age":25}
{"username":"zhaoliu","age":30}
{"username":"tianqi","age":35}
{"username":"jerry","age":40}
```



#### UDF 用户自定义函数

-   用户可以通过**spark.udf**功能添加自定义函数，**实现自定义功能。**（简单来说，就是对功能的扩展）
-   **Spark官方为java语言提供了0-22 UDF接口**，UDF0代表无参数输入只有返回参数，UDF1接口表示有一个入参，含义以此类推

已UDF2为例说明

```java
package org.apache.spark.sql.api.java;

import java.io.Serializable;

import org.apache.spark.annotation.Stable;

/**
 * A Spark SQL UDF that has 2 arguments.
 */
@Stable
public interface UDF2<T1, T2, R> extends Serializable {
  R call(T1 t1, T2 t2) throws Exception;
}

// T1表示第一个输入的参数类型
// T2表示第二个输入的参数类型
// R代表返回参数类型
```

##### SQL中使用用户自定义函数

使用SparkSession中udf方法定义和注册函数，在SQL中使用，使用如下方式定义：

```scala
spark.udf.register(
	"xxx", 	// 函数名称
    （param01: Type, ...） => {	// 匿名函数
        ....
    }
)
```

演示：

​	将姓名转换为大写，调用String中toUpperCase方法

```scala
import org.apache.spark.sql.{DataFrame, SparkSession}

object SparkSQLUDFSQL {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName(this.getClass.getSimpleName.stripSuffix("$"))
      .master("local[2]")
      .getOrCreate()
    // 导入隐式转换函数库
    import spark.implicits._

    val userDF: DataFrame = spark.read.json("/datas/user.json")
    // todo 定义UDF函数，在SQL中使用
    spark.udf.register(
      "upper_name", // 函数名称
      (username: String) => username.toUpperCase
    )
    // 注册DataFrame为临时试图
    userDF.createOrReplaceTempView("tmp_view_user")
    // todo 在SQL中使用UDF
    val resultDF: DataFrame = spark.sql(
      """
        |SELECT
        | username, upper_name(username) as new_name
        |FROM
        | tmp_view_user
        |""".stripMargin)
    resultDF.printSchema()
    resultDF.show()
  }
}
```

结果

```
+--------+--------+
|username|new_name|
+--------+--------+
|zhangsan|ZHANGSAN|
|    lisi|    LISI|
|  wangwu|  WANGWU|
| zhaoliu| ZHAOLIU|
|  tianqi|  TIANQI|
|   jerry|   JERRY|
+--------+--------+
```



##### DSL中使用用户自定义函数

使用 `org.apache.sql.functions.udf`函数定义和注册函数，在DSL中使用，如下方式

```scala
import org.apache.spark.sql.funcitons._

// 定义UDF
val xx_udf = udf(
	(param01: Type, ...) => {	// 匿名函数
        .......
    }
)
```

演示：

​	将姓名转换为大写，调用String中toUpperCase方法

```scala
import org.apache.spark.sql.expressions.UserDefinedFunction
import org.apache.spark.sql.{DataFrame, SparkSession}

object SparkSQLUDFDSL {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName(this.getClass.getSimpleName.stripSuffix("$"))
      .master("local[2]")
      .getOrCreate()
    // 导入隐式转换
    import spark.implicits._
    // 导入函数库
    import org.apache.spark.sql.functions._
    val userDF: DataFrame = spark.read.json("/datas/user.json")

    // todo 定义UDF函数，在DSL中使用
    val upper_udf: UserDefinedFunction = udf(
      (username: String) => username.toUpperCase()
    )
    // 使用UDF函数
    val resultDF: DataFrame = userDF.select(
      $"username",
      upper_udf($"username").as("new_name"))
    resultDF.printSchema()
    resultDF.show()
  }
}
```

结果

```
+--------+--------+
|username|new_name|
+--------+--------+
|zhangsan|ZHANGSAN|
|    lisi|    LISI|
|  wangwu|  WANGWU|
| zhaoliu| ZHAOLIU|
|  tianqi|  TIANQI|
|   jerry|   JERRY|
+--------+--------+
```



##### spark-shell 实现UDF

1）创建DataFrame

```scala
scala> var df = spark.read.json("/opt/temp/spark/user.json")
var df: org.apache.spark.sql.DataFrame = [age: bigint, username: string]      
```

2）注册临时表

```scala
scala> df.createOrReplaceTempView("user")
```

3）查询

```scala
scala> spark.sql("select age, 'name:'+username from user").show()
+---+------------------+
|age|(name: + username)|
+---+------------------+
| 20|              null|
| 29|              null|
| 25|              null|
| 30|              null|
| 35|              null|
| 40|              null|
+---+------------------+
```

上述结果，显然不是我们想要的效果，这时就需要用到用户自定义函数**UDF**了

-   自定义函数UDF的使用

​	1）注册UDF

​	2）使用UDF

**3）注册UDF**

```scala
scala> spark.udf.register("addName",(x:String)=> "name:"+x)
val res8: org.apache.spark.sql.expressions.UserDefinedFunction = SparkUserDefinedFunction($Lambda$3883/328913558@509ab3b0,StringType,List(Some(class[value[0]
: string])),Some(class[value[0]: string]),Some(addName),true,true)
```

**4）使用UDF**

```scala
scala> spark.sql("select age, addName(username) from user").show()
+---+-----------------+
|age|addName(username)|
+---+-----------------+
| 20|    name:zhangsan|
| 29|        name:lisi|
| 25|      name:wangwu|
| 30|     name:zhaoliu|
| 35|      name:tianqi|
| 40|       name:jerry|
+---+-----------------+
```

​	如上，就实现了用户自定义函数UDF



##### Java 实现UDF（SQL风格）

未使用UDF的情况

```java
/**
 * bin/spark-submit --class com.clear.udf.SparkSQL_UDF --master local /opt/temp/spark-sql-demo-1.0.jar
 */
public class SparkSQL_UDF {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("UDF的基本使用").setMaster("local[*]");
        SparkSession spark = SparkSession
                .builder()
                .config(sparkConf)
                .getOrCreate();
        SQLContext sqlContext = new SQLContext(spark);

        Dataset<Row> df = spark.read().json("/opt/temp/spark/user.json");
       
        df.createOrReplaceTempView("user");
        // 想给查询结果的姓名列加上一些前缀  形如 name:username
        sqlContext.sql("select age,'name:'+username from user").show();
    }
}
```

上传至服务器运行结果如下

```
+---+------------------+
|age|(name: + username)|
+---+------------------+
| 20|              null|
| 29|              null|
| 25|              null|
| 30|              null|
| 35|              null|
| 40|              null|
+---+------------------+
```

上面结果，显然不是我们想要的效果，这就需要用到自定义函数UDF了

使用UDF后改进的代码如下

```java
/**
 * bin/spark-submit --class com.clear.udf.SparkSQL_UDF2 --master local /opt/temp/spark-sql-demo-1.0.jar
 */
public class SparkSQL_UDF2 {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("UDF的基本使用").setMaster("local[*]");
        SparkSession spark = SparkSession
                .builder()
                .config(sparkConf)
                .getOrCreate();
        SQLContext sqlContext = new SQLContext(spark);

        Dataset<Row> df = spark.read().json("/opt/temp/spark/user.json");

        // 注册UDF
        // 根据UDF函数参数的个数来决定是实现哪一个UDF  UDF1，UDF2。。。。UDF1xxx
        /**
         * public void register(final String name, final UDF1<?, ?> f, final DataType returnType)
         *      参数说明
         *      final String name 为 UDF方法的名称
         *      final UDF1<?, ?> f 为我们用的哪一个UDF接口
         *      final DataType returnType 返回值类型
         */
        spark.udf().register("PrefixName", new UDF1<String, String>() {
            // 为查询结果的年龄列加上一些前缀  形如 age name:username
            @Override
            public String call(String s) throws Exception {
                return "name:" + s;
            }
        }, DataTypes.StringType);

        // 注册临时表
        df.createOrReplaceTempView("user");
        // 查询（使用UDF）
        sqlContext.sql("select age, PreFixName(username) from user").show();

        spark.stop();
    }
}
```

上传至服务器运行结果如下

```
+---+--------------------+
|age|PrefixName(username)|
+---+--------------------+
| 20|       name:zhangsan|
| 29|           name:lisi|
| 25|         name:wangwu|
| 30|        name:zhaoliu|
| 35|         name:tianqi|
| 40|          name:jerry|
+---+--------------------+
```

从结果来看，我们的UDF函数注册、使用成功



#### UDAF 用户自定义聚合函数

-   实现 **UDAF** 函数，如果要自定义类，**要实现UserDefinedAggregateFunction类。**
-   强类型的 Dataset 和 弱类型的 DataFrame 都提供了相关的聚合函数， 如 count()，countDistinct()，avg()，max()，min()。
-   除此之外，用户可以设定自己的**自定义聚合函数**。通过**实现UserDefinedAggregateFunction来实现用户自定义弱类型聚合函数**。
-   从Spark3.0版本后，UserDefinedAggregateFunction已经不推荐使用了。可以统一采用强类型聚合函数**Aggregator**

##### UDAF 弱类型实现

```java
package com.clear.udaf;

import org.apache.spark.SparkConf;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SQLContext;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.api.java.UDF1;
import org.apache.spark.sql.expressions.MutableAggregationBuffer;
import org.apache.spark.sql.expressions.UserDefinedAggregateFunction;
import org.apache.spark.sql.expressions.UserDefinedAggregator;
import org.apache.spark.sql.types.DataType;
import org.apache.spark.sql.types.DataTypes;
import org.apache.spark.sql.types.StructType;

import javax.xml.crypto.Data;
import java.util.Arrays;

/**
 * bin/spark-submit --class com.clear.udaf.SparkSQL_UDAF --master local /opt/temp/spark-sql-demo-1.0.jar
 */
public class SparkSQL_UDAF {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("UDAF的基本使用").setMaster("local[*]");
        SparkSession spark = SparkSession
                .builder()
                .config(sparkConf)
                .getOrCreate();
        SQLContext sqlContext = new SQLContext(spark);

        Dataset<Row> df = spark.read().json("/opt/temp/spark/user.json");

        // 注册UDAF函数，实现统计年龄平均值
        // todo 注意：可以使用自定义类继承UserDefinedAggregateFunction类，也可以使用匿名类的方式，下面我们演示的是通过继承的方式
        /**
         * public UserDefinedAggregateFunction register(final String name, final UserDefinedAggregateFunction udaf)
         *      参数说明
         *      final String name 为 UDAF 函数的名称
         *      final UserDefinedAggregateFunction udaf 为我们自定义的udaf类
         */
        spark.udf().register("ageAvg", new MyAvgUDAF());

        // 注册临时表
        df.createOrReplaceTempView("user");
        // 查询（使用UDAF）
        sqlContext.sql("select ageAvg(age) from user").show();


        spark.stop();
    }

    /**
     * 用户自定义聚合函数类：实现计算年龄平均值
     * 注意：这里除了自定义一个类继承UserDefinedAggregateFunction类以外，还可以在register方法中采用匿名子类的方式实现
     * 1.继承UserDefinedAggregateFunction类
     * 2.重写抽象方法
     */
    static class MyAvgUDAF extends UserDefinedAggregateFunction {

        /**
         * 指定输入字段的结构（字段及类型） INPUT
         */
        @Override
        public StructType inputSchema() {
            return DataTypes.createStructType(Arrays.asList(
                    DataTypes.createStructField("age", DataTypes.IntegerType, true)));
        }

        /**
         * 缓冲区数据的结构 BUFFER
         * 在进行聚合操作的时候所要处理的数据的结果的类型
         */
        @Override
        public StructType bufferSchema() {
            return DataTypes.createStructType(Arrays.asList(
                    DataTypes.createStructField("total", DataTypes.LongType, true),
                    DataTypes.createStructField("count", DataTypes.LongType, true)
            ));
        }

        /**
         * 函数计算结构的数据类型  OUT
         * 即 指定UDAF函数计算后返回的结果类型
         *
         * @return
         */
        @Override
        public DataType dataType() {
            return DataTypes.DoubleType;
        }

        /**
         * 函数的稳定性
         * 即 确保一致性 一般用true,用以标记针对给定的一组输入，UDAF是否总是生成相同的结果。
         */
        @Override
        public boolean deterministic() {
            return true;
        }

        /**
         * 缓冲区的初始化
         * 初始化一个内部的自己定义的值,在Aggregate之前每组数据的初始化结果
         */
        @Override
        public void initialize(MutableAggregationBuffer buffer) {
            buffer.update(0, 0L);   // i==0表示年龄总和
            buffer.update(1, 0L);   // i==1表示总人数
            // 这里输出一句话，用来检查初始化
            System.out.println("init ....." + buffer.get(0) + "\t" + buffer.get(1));
        }

        /**
         * 根据输入的值，来更新缓冲区的数据
         * 更新 可以认为一个一个地将组内的字段值传递进来 实现拼接的逻辑
         * buffer.getLong(0)获取的是上一次聚合后的值
         * 相当于map端的combiner，combiner就是对每一个map task的处理结果进行一次小聚合
         * 大聚和发生在reduce端.
         * 这里即是:在进行聚合的时候，每当有新的值进来，对分组后的聚合如何进行计算
         */
        @Override
        public void update(MutableAggregationBuffer buffer, Row input) {
            // buffer.getLong(0)获取的是上一次聚合后的年龄总和
            // input.getInt(0)获取的是输入的年龄
            buffer.update(0, buffer.getLong(0) + input.getInt(0));  // i==0表示年龄总和
            // buffer.getLong(1)获取的是上一次聚合后的总人数
            buffer.update(1, buffer.getLong(1) + 1);  // i==1总表示人数
        }

        /**
         * 缓冲区数据的合并
         * 合并 update操作，可能是针对一个分组内的部分数据，在某个节点上发生的 但是可能一个分组内的数据，会分布在多个节点上处理
         * 此时就要用merge操作，将各个节点上分布式拼接好的串，合并起来
         * buffer1.getLong(0) buffer1.getLong(1): 大聚合的时候 上一次聚合后的值
         * buffer2.getLong(0) buffer2.getLong(1) : 这次计算传入进来的update的结果
         * 这里即是：最后在分布式节点完成后需要进行全局级别的Merge操作
         */
        @Override
        public void merge(MutableAggregationBuffer buffer1, Row buffer2) {
            buffer1.update(0, buffer1.getLong(0) + buffer2.getLong(0));  // i==0表示年龄总和
            buffer1.update(1, buffer1.getLong(1) + buffer2.getLong(1));  // i==1总表示人数
        }

        /**
         * 最后返回一个和 DataType 的类型要一致的类型，返回UDAF最后的计算结果
         * 在我们这个UDAF函数中是 计算平均值
         */
        @Override
        public Object evaluate(Row buffer) {
            return Double.valueOf(buffer.getLong(0)) / Double.valueOf(buffer.getLong(1));
        }
    }
}
```

打包上传至服务器运行结果如下

```diff
init .....0	0
init .....0	0

+------------------+
|       ageavg(age)|
+------------------+
|29.833333333333332|
+------------------+
```

##### UDAF 强类型实现(推荐方式)

从Spark3.0版本后，UserDefinedAggregateFunction已经不推荐使用了。可以统一采用强类型聚合函数**Aggregator**

-   Spark3.0版本可以采用**强类型的Aggregate**方式代替UserDefinedAggregateFunction

```java
/**
 * bin/spark-submit --class com.clear.udaf.SparkSQL_UDAF2 --master local /opt/temp/spark-sql-demo-1.0.jar
 */
public class SparkSQL_UDAF2 {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("UDAF的基本使用").setMaster("local[*]");
        SparkSession spark = SparkSession
                .builder()
                .config(sparkConf)
                .getOrCreate();
        SQLContext sqlContext = new SQLContext(spark);

        Dataset<Row> df = spark.read().json("/opt/temp/spark/user.json");

        // 注册聚合函数 UDAF
        /**
         * public UserDefinedFunction register(final String name, final UserDefinedFunction udf)
         *      参数说明
         *      final String name 为聚合函数的名称
         *      final UserDefinedFunction udf 为我们自定义的聚合函数udaf类
         *              todo 注意，自定义udaf类需要是静态类
         */
        AvgAgeAggregator avgAgeAggregator = new AvgAgeAggregator();
        /**
         * public static <IN, BUF, OUT> UserDefinedFunction udaf(
         *      final Aggregator<IN, BUF, OUT> agg, 表示自定义聚合函数类
         *      final Encoder<IN> inputEncoder)  表示自定义聚合函数输入的类型
         */
        spark.udf().register("avgAge", functions.udaf(avgAgeAggregator, Encoders.INT()));
        // 注册临时表
        df.createOrReplaceTempView("user");
        // 查询（使用UDAF）
        sqlContext.sql("select avgAge(age) from user").show();
        
        spark.stop();
    }

    /**
     * 用户自定义聚合函数类：实现计算年龄平均值
     * 1.继承org.apache.spark.sql.expressions.Aggregator
     * 2.定义泛型
     * IN  输入的数据类型 Integer
     * BUF 缓冲区的数据类型 Tuple2<Long,Long>
     * OUT 输出的数据类型 Long
     * 2.重写抽象方法(6个)
     */
    static class AvgAgeAggregator extends Aggregator<Integer, Tuple2<Long, Long>, Long> {

        /**
         * 初始值 或 零值
         */
        @Override
        public Tuple2<Long, Long> zero() {
            return new Tuple2<>(0L, 0L);
        }

        /**
         * 根据输入的数据更新缓冲区的数据
         */
        @Override
        public Tuple2<Long, Long> reduce(Tuple2<Long, Long> buffer, Integer in) {
            return new Tuple2<>(buffer._1() + in, buffer._2() + 1L);
            // 其中
            // buffer._1() + in 表示年龄总和
            // buffer._2() + 1L 总人数
        }

        /**
         * 合并缓冲区
         */
        @Override
        public Tuple2<Long, Long> merge(Tuple2<Long, Long> buff1, Tuple2<Long, Long> buff2) {
            return new Tuple2<>(buff1._1() + buff2._1(), buff1._2() + buff2._2());
        }

        /**
         * 计算结果
         */
        @Override
        public Long finish(Tuple2<Long, Long> reduction) {
            return reduction._1() / reduction._2();
        }

        /**
         * 缓冲区的编码操作
         */
        @Override
        public Encoder<Tuple2<Long, Long>> bufferEncoder() {
            return Encoders.tuple(Encoders.LONG(), Encoders.LONG());
        }

        /**
         * 初始的编码操作
         */
        @Override
        public Encoder<Long> outputEncoder() {
            return Encoders.LONG();
        }
    }
}
```

打包上传至服务器运行结果如下

```
+-----------+
|avgage(age)|
+-----------+
|         29|
+-----------+
```



##### Spark早期版本使用强类型UDAF

-   在早期版本（3.0以前）中，spark不能在 SQL 中使用强类型UDAF操作
-   早期的UDAF强类型聚合函数必须使用 DSL 语法风格操作



上面的计算平均年龄需求，也可以使用RDD、累加器的方式实现

**RDD 方式实现**

```java
/**
 * 使用RDD的方式实现计算年龄平均值
 * bin/spark-submit --class com.clear.udaf.SparkSQL_RDD --master local /opt/temp/spark-sql-demo-1.0.jar
 */
public class SparkSQL_RDD {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("计算平均值");
        SparkSession spark = SparkSession
                .builder()
                .config(sparkConf)
                .getOrCreate();
        SQLContext sqlContext = new SQLContext(spark);
        Dataset<Row> df = spark.read().json("/opt/temp/spark/user.json");

        // 将DataFrame对象 转换为 javaRDD
        JavaRDD<Row> rowJavaRDD = df.javaRDD();

        JavaPairRDD<Long, Integer> javaPairRDD = rowJavaRDD.mapToPair(new PairFunction<Row, Long, Integer>() {
            @Override
            public Tuple2<Long, Integer> call(Row row) throws Exception {
                Long age = row.getAs("age");
                return new Tuple2<>(age, 1);
            }
        });
        Tuple2<Long, Integer> reduceRDD = javaPairRDD.reduce(new Function2<Tuple2<Long, Integer>, Tuple2<Long, Integer>, Tuple2<Long, Integer>>() {
            @Override
            public Tuple2<Long, Integer> call(Tuple2<Long, Integer> v1, Tuple2<Long, Integer> v2) throws Exception {
                return new Tuple2<>(v1._1 + v2._1, v1._2 + v2._2);  // 返回值为 Tuple2<年龄总和,总人数>
            }
        });
        System.out.println("年龄平均值: " + reduceRDD._1 / reduceRDD._2);
    }
}
```

打包上次至服务器运行结果如下

```
年龄平均值: 29
```



### 开窗函数

**row_number()** 开窗函数是按照某个字段分组，然后取另一个字段的前几个的值，相当于分组取topN。

开窗函数格式：

```sql
row_mumber() over (paartition by XXX order by XXX)
```

需求：统计每一个产品类别的销售额前3名（相当于分组求TOPN）

```java
public class WindowFun {
    public static void main(String[] args) {
        SparkSession spark = SparkSession.builder()
                .master("local")
                .appName("window_row_number")
                .getOrCreate();
        // 创建测试数据（字段：日期、产品类别、销售额）
        List<String> list = Arrays.asList(
                "2022-05-10,A,710",
                "2022-05-10,B,530",
                "2022-05-10,C,670",
                "2022-05-11,A,520",
                "2022-05-11,B,730",
                "2022-05-11,C,610",
                "2022-05-12,A,500",
                "2022-05-12,B,700",
                "2022-05-12,C,650",
                "2022-05-13,A,620",
                "2022-05-13,B,690",
                "2022-05-13,C,700",
                "2022-05-14,A,720",
                "2022-05-14,B,680",
                "2022-05-14,C,590");
        // todo 将String类型的数据 转为 JavaRDD<Row>
        // 1.获取 SparkContext 对象
        SparkContext sc = spark.sparkContext();
        // 2.获取 JavaSparkContext 对象
        JavaSparkContext jsc = new JavaSparkContext(sc);
        // 3.将String类型的数据转为 JavaRDD<String>
        JavaRDD<String> javaRDD = jsc.parallelize(list);
        // 4.将 JavaRDD<String>类型转为 JavaRDD<Row>
        JavaRDD<Row> rowJavaRDD = javaRDD.map(new Function<String, Row>() {
            @Override
            public Row call(String line) throws Exception {
                String[] split = line.split(",");
                return RowFactory.create(
                        split[0],
                        split[1],
                        Integer.valueOf(split[2]));
            }
        });

        // todo 将 JavaRDD<Row>转为 DataFrame
        // 1.创建schema
        StructType schema = DataTypes.createStructType(Arrays.asList(
                DataTypes.createStructField("date", DataTypes.StringType, false),
                DataTypes.createStructField("type", DataTypes.StringType, false),
                DataTypes.createStructField("money", DataTypes.IntegerType, false)
        ));
        // 2.将Row转换为DataFrame
        Dataset<Row> dataFrame = spark.createDataFrame(rowJavaRDD, schema);

        // todo 使用开窗函数取每个类别的金额前3名
        // 1.创建临时视图
        dataFrame.createOrReplaceTempView("tb_sales");
        // 2.执行sql
//        spark.sqlContext().sql("select date, type, money, "
//                + "row_number() over (partition by type order by money desc) as rank "
//                + " from tb_sales").show();
        spark.sqlContext().sql("select date, type, money, rank "
                + "from ("
                + " select date, type, money, "
                + " row_number() over (partition by type order by money desc) as rank "
                + " from tb_sales) t"
                + " where t.rank <= 3").show();

        sc.stop();
        jsc.stop();
        spark.stop();
    }
}
```

结果如下

```
+----------+----+-----+----+
|      date|type|money|rank|
+----------+----+-----+----+
|2022-05-14|   A|  720|   1|
|2022-05-10|   A|  710|   2|
|2022-05-13|   A|  620|   3|
|2022-05-11|   B|  730|   1|
|2022-05-12|   B|  700|   2|
|2022-05-13|   B|  690|   3|
|2022-05-13|   C|  700|   1|
|2022-05-10|   C|  670|   2|
|2022-05-12|   C|  650|   3|
+----------+----+-----+----+
```

