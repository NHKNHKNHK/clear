<!-- # Spark SQL 基础知识

​	**Spark SQL是Spark用来处理结构化数据（structured data）的一个模块**，它提供了一个叫 DataFrame 的编程抽象结构数据模型（即带有 Schema 信息的RDD），Spark SQL作为分布式SQL查询引擎，让用户通过SQL、DataFrame API 和 Dataset API 三种方式实现对结构化数据的处理。但无论那种API或编程语言，都是基于同样的执行引擎，因此可以在不同的API之间随意切换

## Hive and SparkSQL

​	SparkSQL的前身是**Shark**，给熟悉RDBMS但又不理解MapReduce的技术人员提供快速上手的工具。

​	Hive是早期唯一运行在Hadoop上的SQL-on-Hadoop工具。但是MapReduce计算过程中大量的中间磁盘落地过程消耗了大量的I/O，降低的运行效率，为了提高SQL-on-Hadoop的效率，大量的SQL-on-Hadoop工具开始产生，其中表现较为突出的是：

-   Drill
-   Impala
-   Shark

​	其中Shark是伯克利实验室Spark生态环境的组件之一，是基于Hive所开发的工具，它运行在Spark系统之上，**Spark重用了 Hive 的工作机制，并且继承了 Hive 的各个组件**，Shark 将SQL语句的转换从 MapReduce 作业替换成了 Spark作业，虽然这样提高了计算效率（Shark的出现，使得SQL-on-Hadoop的性能比Hive有了10-100倍的提高），但是，随着Spark的发展，对于野心勃勃的Spark团队来说，Shark对于Hive的太多依赖（如采用Hive的语法解析器、查询优化器等等），制约了 Spark的One Stack Rule Them All 的既定方针，制约了Spark各个组件的相互集成，所以提出了Spark SQL项目。**SparkSQL抛弃原有Shark的代码**（2014年，伯克利实验室停止了对Shark的维护，转向 Spark SQL 的开发。），**汲取了Shark的一些优点，如内存列存储（In-Memory Columnar Storage）、Hive兼容性等，重新开发了SparkSQL代码**；由于**摆脱了对Hive的依赖性，SparkSQL无论在数据兼容、性能优化、组件扩展方面都得到了极大的方便**，真可谓“退一步，海阔天空”。

-   **数据兼容方面** Spark SQL不但兼容Hive，还可以从各种结构化数据源（如 parquet文件、JSON文件、Hive）中获取数据，未来版本甚至支持获取RDBMS数据以及 cassandra等NOSQL数据；
-   **性能优化方面** 除了采取 In-Memory Columnar Storage、byte-code generation 等优化技术外、将会引进Cost Model对查询进行动态评估、获取最佳物理计划等等；
-   **组件扩展方面** 无论是SQL的语法解析器、分析器还是优化器都可以重新定义，进行扩展。



​	2014年6月1日 Shark 项目和 Spark SQL 项目的主持人Reynold Xin宣布：停止对Shark的开发，团队将所有资源放SparkSQL项目上，至此，Shark的发展画上了句话，但也因此发展出两个支线：SparkSQL和Hive on Spark。

​	其中 Spark SQL 作为 Spark 生态的一员继续发展，而不再受限于Hive，只是兼容Hive；而Hive on Spark是一个Hive的发展计划，该计划将Spark作为Hive的底层引擎之一，也就是说，Hive将不再受限于一个引擎，可以采用Map-Reduce、Tez、Spark等引擎。

​	**对于开发人员来讲，SparkSQL可以简化RDD的开发，提高开发效率**，且执行效率非常快，所以实际工作中，基本上采用的就是SparkSQL。Spark SQL为了简化RDD的开发，提高开发效率，提供了2个编程抽象，类似Spark Core中的RDD

-   ​	DataFrame  	Spark 1.3
-   ​	DataSet            Spark 1.6



## Spark on Hive 和 Hive on Spark

Spark on Hive：Hive只作为储存角色，Spark负责SQL解析优化、执行

Hive on Spark：Hive即作为存储又负责SQL解析优化、Spark负责执行。



## Spark SQL 特点

-   **易整合**

Spark SQL无缝的整合了 SQL 查询和 Spark 编程，它能将结构化数据作为Spark中的分布式数据集（RDD）进行查询，在 Python、Scala、Java中均集成了相关的API，这种紧密的集成方式能够轻松地运行SQL查询以及复杂的分析算法。

-   **统一的数据访问**

使用相同的方式连接不同的数据源，可以从各种结构化数据源（如JOSN、Hive、Parquet 等）中读取数据，进行数据分析。

-   **兼容Hive**

在已有的仓库上直接运行 SQL 或者 HiveQL

-    **标准数据连接**

Spark SQL 包含行业标准 JDBC 或者 ODBC 的连接方式，因此它不限于在 Spark 程序内使用SQL语句进行查询



​	总体来说，Spark SQL 支持多种数据源的查询和加载，兼容 Hive，可以使用 JDBC/ODBC的连接方式来执行SQL语句，它为Saprk 框架在结构化数据分析方面提供了重要的技术支持。



## DataFrame 与 DataSet

**DataSet** 也是一个**分布式数据容器**。与 RDD 类似，然而 DataSet 更像传统数据库的二维表格，除了数据以外，还掌握数据的结构信息，即 Schema。同时，与 Hive 类似，DataSet 也支持嵌套数据类型（Struct、array和 map）。从 API易用性的角度上来看，DataSet API 提供的是一套高层的关系操作，比函数式的RDD API要更加友好，门槛更低。

**DataSet 的底层封装的是 RDD**，当 **RDD 的泛型是 Row类型**时，我们也可以把他称为 **DataFrame**，即：

```
Dataset<Row> = DataFrame
```



## DataFrame 基础

-   **Spark SQL使用的数据抽象**并非是RDD，而**是DataFrame**

-   在Spark 1.3.0 版本之前，DataFrame也被称为 SchemaRDD。

-   DataFrame使Spark 具备了处理大规模结构化数据的能力。

-   在Spark中，**DataFrame是一种以RDD为基础的分布式数据集**，类似于传统数据库中的二维表格。因此DataFrame可以完成RDD的绝大多数功能，在开发时，也可以调用相应方法将RDD和DataFrame进行相互转换。

-   DataFrame与RDD的主要区别在于
    -   前者**带有schema元信息**，即DataFrame所表示的二维表数据集的每一列都带有名称和类型。这使得Spark SQL得以洞察更多的结构信息，从而对于DataFrame背后的数据源以及作用于DataFrame之上的变换进行了针对性的优化，最终达到大幅提升运行时效率的目标。
    -   反观RDD，由于无从得知所存数据元素的具体内部结构，Spark Core只能在stage层面进行简单、通用的流水线优化。
-   最主要区别在于，**前者（DataFrame）面向的是结构化数据，后者（RDD）面向的是非结构化数据**
    
-   同时，与Hive类似，DataFrame也支持嵌套数据类型（struct、array和map）。从 API 易用性的角度上看，**DataFrame API提供的是一套高层的关系操作，比函数式的RDD API 要更加友好，门槛更低。**

-   DataFrame是为数据提供了Schema的视图。可以把它当做数据库中的一张表来对待
-   DataFrame也是**懒执行**的，但**性能上比RDD要高**，主要原因：优化的执行计划，即查询计划通过Spark catalyst optimiser 进行优化。

​	总的来说，DataFrame除了提供比RDD更丰富的算子外，更重要的是提升了 Spark 框架执行效率、减少数据读取时间以及优化执行计划。有了 DataFrame 这个更高层面的抽象后，处理数据就更加简单了，甚至可以直接用 SQL来处理数据，这对于开发者来说，易用性有了很大的提升。不仅如此，**通过DataFrame API 或 SQL 处理数据时，Spark 优化器（Catalyst） 会自带优化代码，即使写的程序 或 SQL不够高效，程序也可以高效地执行**。



由于 Spark SQL 支持多种语言的开发，所以每种语言都定义了 `DataFrame` 的抽象，主要如下：

| 语言   | 主要抽象                                       |
| ------ | ---------------------------------------------- |
| Scala  | Dataset[T]  &  DataFrame (Dataset[Row] 的别名) |
| Java   | Dataset[T]                                     |
| Python | DataFrame                                      |
| R      | DataFrame                                      |



## DataSet 基础

​	DataSet是分布式数据集合。**DataSet是 Spark 1.6中 添加的一个新抽象结构**，是DataFrame的一个扩展，最终在Spark2.0 版本被定义为 Spark 新特性。它提供了RDD的优势（**强类型**，使用强大的lambda函数的能力）以及Spark SQL优化执行引擎的优点。DataSet也可以使用功能性的转换（操作map，flatMap，filter等等）。

-   DataSet是DataFrame API的一个扩展，是Spark SQL最新的数据抽象
-   用户友好的API风格，既具有**类型安全检查**也具有DataFrame的**查询优化特性**；
-   用样例类来对 DataSe t中定义数据的结构信息，**样例类中每个属性的名称直接映射到DataSet中的字段名称**；
-   **DataSet是强类型的**。比如可以有 DataSet[Car]，DataSet[Person]。
-   DataSet提供了特定域对象的强类型集合，也就是在RDD 的每行数据中添加了类型约束条件，只要满足约束条件的数据类型才能正常运行，
-   **DataFrame是DataSet的特列**，**DataFrame=DataSet[Row]** ，所以可以通过 as方法将DataFrame转换为DataSet。Row是一个类型，跟Car、Person这些的类型一样，所有的表结构信息都用Row来表示。获取数据时需要指定顺序
-   DataSet 结合了RDD 和 DataFrame的优点，并且可以调用封装的方法以并行方式进行转换等操作。
    

 

## Spark SQL 底层架构

​	首先拿到 SQL 后**解析**一批**未被解决的逻辑计划**，再经过分析得到**分析后的逻辑计划**，再经过一批优化规则转换成 一批**最佳优化的逻辑计划**，再经过 **SparkPlanner** 的策略转换成一批 **物理计划**，随后经过**消费模型**转换成一个个的 **Spark 任务**执行。



## SaprkSession对象

-   Spark Core中，如果想要执行应用程序，需要首先构建上下文环境对象**SparkContext**，**Spark SQL其实可以理解为对Spark Core的一种封装，不仅仅在模型上进行了封装，上下文环境对象也进行了封装。**

-   在老的版本（Spark 2.0 之前）中，Spark SQL提供两种SQL查询起始点：
    -   一个叫SQLContext，用于Spark自己提供的SQL查询；
    -   一个叫HiveContext，用于连接Hive的查询。

-   **SparkSession 是Spark最新（Spark 2.0之后）的 SQL 查询起始点，实质上是SQLContext和HiveContext的组合**，所以在 SQLContext 和HiveContext 上可用的API在SparkSession上同样是可以使用的。**SparkSession内部封装了SparkContext，所以计算实际上是由sparkContext完成的**。

    注意：在Java中需要额外创建JavaSparkContext对象，如下

    ```java
    // 这里的spark 即 SparkSession对象
    SparkContext sc = spark.sparkContext();
    JavaSparkContext jsc = new JavaSparkContext(sc);
    ```

-   创建SparkSession对象可以通过 **SparkSession.builder().getOrCreate()** 方法获取。但当我们使用 spark-shell 的时候, spark框架默认会自动的创建一个名称叫做 spark 的 SparkSession 对象, 就像我们以前可以自动获取到一个 sc 来表示 SparkContext 对象一样，因此可以直接使用，不需要自行创建

启动 Spark-shell 命令如下

```shell
spark-shell --master[2]
```

```shell
# 启动 Spark-shell 完成后，如下所示，可以看出Sparkcontext、SparkSession对象均已创建完成
[root@kk01 bin]# ./spark-shell
Using Spark's default log4j profile: org/apache/spark/log4j-defaults.properties
Setting default log level to "WARN".
To adjust logging level use sc.setLogLevel(newLevel). For SparkR, use setLogLevel(newLevel).
Welcome to
      ____              __
     / __/__  ___ _____/ /__
    _\ \/ _ \/ _ `/ __/  '_/
   /___/ .__/\_,_/_/ /_/\_\   version 3.2.0
      /_/
         
Using Scala version 2.13.5 (Java HotSpot(TM) 64-Bit Server VM, Java 1.8.0_152)
Type in expressions to have them evaluated.
Type :help for more information.
23/05/06 06:51:50 WARN NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
Spark context Web UI available at http://kk01:4040
Spark context available as 'sc' (master = local[*], app id = local-1683370311215).
Spark session available as 'spark'.   # Spark session

scala>
```



# DataFrame

​	Spark SQL的DataFrame API 允许我们使用 DataFrame 而不用必须去注册临时表或者生成 SQL 表达式（即使用DSL风格处理）。**DataFrame API 既有 transformation（转换）操作也有 action（行动） 操作。**

## DataFrame的创建

在Spark SQL中SparkSession 是创建DataFrame和执行 SQL 的入口，创建DataFrame有三种方式：

-   ​	通过Spark的数据源进行创建；
-   ​	从一个存在的RDD进行转换；
-   ​	还可以从Hive Table进行查询返回。

**1）通过Spark的数据源直接创建DataFrame**

-   查看Spark支持创建文件的数据源格式

```shell
scala> spark.read.

# 常用的数据源格式有 
# csv   format   jdbc   json   load   option   options   orc   parquet   schema   table   text   textFile
```

使用SparkSession 方式创建 DataFrame，可以使用spark.read 操作，从不同的文件中加载数据创建DataFrame，具体操作API如下表

| 代码示例                           | 描述                                   |
| ---------------------------------- | -------------------------------------- |
| spark.read.text("user.txt")        | 读取 txt 格式的文件，创建DataFrame     |
| spark.read.csv("user.csv")         | 读取 csv 格式的文件，创建DataFrame     |
| spark.read.json("user.json")       | 读取 json 格式的文件，创建DataFrame    |
| spark.read.parquet("user.parquet") | 读取 parquet 格式的文件，创建DataFrame |

-   在/opt/temp/spark目录（Linux环境）中创建user.json文件（数据准备）

```json
{"username":"zhangsan","age":20}
{"username":"lisi","age":29}
{"username":"wangwu","age":25}
{"username":"zhaoliu","age":30}
{"username":"tianqi","age":35}
{"username":"jerry","age":40}
```

-   通过Spark读取数据源 （json文件）创建DataFrame

```shell
scala> val df = spark.read.json("/opt/temp/spark/user.json")
val df: org.apache.spark.sql.DataFrame = [age: bigint, username: string]        

scala> df.printSchema
warning: 1 deprecation (since 2.13.3); for details, enable `:setting -deprecation` or `:replay -deprecation`
root
 |-- age: long (nullable = true)
 |-- username: string (nullable = true)

```

从上述返回结果df 的属性可以看出，DataFrame对象创建完成，之后调用DataFrame的 printSchema()方法可以打印当前对象的 Schema 元数据信息。从返回信息看，当前value字段是String类型，并且还可以为 Null

注意：

​	**如果从内存中获取数据，spark可以知道数据类型具体是什么。如果是数字，默认作为Int处理；但是从文件中读取的数字，不能确定是什么类型，所以用bigint接收，可以和Long类型转换，但是和Int不能进行转换**

-   展示结果：show()

使用DataFrame 的show() 方法可以查看当前DataFrame的结果数据，如下

```shell
scala> df.show()
+---+--------+
|age|username|
+---+--------+
| 20|zhangsan|
| 29|    lisi|
| 25|  wangwu|
| 30| zhaoliu|
| 35|  tianqi|
| 40|   jerry|
+---+--------+
```

从上述返回结果可以看出，当前 df 对象中的6条记录就对应了 user.json文件中的数据



**2）从一个存在的RDD进行转换创建DataFrame**

在/opt/temp/spark目录（Linux环境）中创建user.text文件（数据准备）

```
zhangsan 20
lisi 29
wangwu 25
zhaoliu 30
tianqi 35
jerry 40
```

从一个已存在的 RDD**调用 toDF() 方法进行转换得到 DataFrame**，代码如下

```scala
// 将文本转换为RDD
scala> val lineRDD = sc.textFile("/opt/temp/spark/user.txt").map(_.split(" "))
val lineRDD: org.apache.spark.rdd.RDD[Array[String]] = MapPartitionsRDD[6] at map at <console>:1

// 定义User样例类（相当于定义表的Schema元数据信息）
scala> case class User(username:String,age:Int)
class User

// 将RDD中的数组数据与样例类中进行关联   
// 最终 RDD[Array[String]]  ===> RDD[User] 
scala> var df = userRDD.toDF()
var df: org.apache.spark.sql.DataFrame = [username: string, age: int]

// 调用 RDD的toDF()方法将RDD转换为DataFrame
scala> var df = userRDD.toDF()
var df: org.apache.spark.sql.DataFrame = [username: string, age: int]

scala> df.show
warning: 1 deprecation (since 2.13.3); for details, enable `:setting -deprecation` or `:replay -deprecation`
+--------+---+
|username|age|
+--------+---+
|zhangsan| 20|
|    lisi| 29|
|  wangwu| 25|
| zhaoliu| 30|
|  tianqi| 35|
|   jerry| 40|
+--------+---+
```



**3）从Hive Table进行查询返回创建DataFrame**





## DSL风格

​	DataFrame 提供了两种语法风格，即 DSL风格 和 SQL风格语法，两者在**功能上并无差别**，仅仅是根据用户习惯，自定义选择操作方式。

​	DataFrame提供一个特定领域语言(domain-specific language,DSL)去管理结构化的数据。可以在 Scala, Java, Python 和 R 中使用 DSL，**使用 DSL 语法风格不必去创建临时视图了**

| 方法          | 描述                                             |
| ------------- | ------------------------------------------------ |
| show()        | 查看DataFrame中的具体内容的信息（即查询指定列）  |
| printSchema() | 查看DataFrame中的 Schema信息（即打印元数据信息） |
| select()      | 查看DataFrame中 选取的部分列的信息               |
| filter()      | 实现条件查询，过滤出想要的结果                   |
| groupby()     | 对记录进行分组                                   |
| sort()        | 对特定字段进行排序操作                           |

1）下面演示查看df 对象的Schema信息

```shell
# 创建DataFrame
scala> val df = spark.read.json("/opt/temp/spark/user.json")
val df: org.apache.spark.sql.DataFrame = [age: bigint, username: string]

# 打印 Schema信息
scala> df.printSchema
warning: 1 deprecation (since 2.13.3); for details, enable `:setting -deprecation` or `:replay -deprecation`
root
 |-- age: long (nullable = true)
 |-- username: string (nullable = true)

```

2）下面演示查看 df对象的 username字段数据

```shell
scala> df.select(df.col("username")).show()
+--------+
|username|
+--------+
|zhangsan|
|    lisi|
|  wangwu|
| zhaoliu|
|  tianqi|
|   jerry|
+--------+
```

上面代码中，查询 username字段数据还可以直接使用 df.select("username").show() 代码查询

```shell
scala> df.select("username").show() 
+--------+
|username|
+--------+
|zhangsan|
|    lisi|
|  wangwu|
| zhaoliu|
|  tianqi|
|   jerry|
+--------+
```

select() 操作还可以对列名实现重命名（取别名），如下

```shell
scala> df.select(df("username").as("name"),df("age")).show()
+--------+---+
|    name|age|
+--------+---+
|zhangsan| 20|
|    lisi| 29|
|  wangwu| 25|
| zhaoliu| 30|
|  tianqi| 35|
|   jerry| 40|
+--------+---+
```

从返回结果来看，原 username字段重命名为了 name字段

总结一下

```shell
# 查看 df对象的 username字段数据有如下几种方式
# 1）
df.select(df.col("username")).show()
# 2）
df.select(df("username")).show()
# 3）
df.select("username").show() 

```



3）查看"username"列数据以及"age+1"数据 

注意:

​	**涉及到运算的时候, 每列都必须使用$, 或者采用引号表达式：单引号+字段名**

```shell
# 会报错  会把 "age"+1  看成是 "age+1"
scala> df.select("username","age"+1).show()
org.apache.spark.sql.AnalysisException: cannot resolve 'age1' given input columns: [age, username];
'Project [username#75, 'age1]
+- Relation [age#74L,username#75] json

# 下面两种是正确演示
scala> df.select($"username",$"age"+1).show()
+--------+---------+
|username|(age + 1)|
+--------+---------+
|zhangsan|       21|
|    lisi|       30|
|  wangwu|       26|
| zhaoliu|       31|
|  tianqi|       36|
|   jerry|       41|
+--------+---------+


scala> df.select('username,'age+1).show()
warning: 2 deprecations (since 2.13.0); for details, enable `:setting -deprecation` or `:replay -deprecation`
+--------+---------+
|username|(age + 1)|
+--------+---------+
|zhangsan|       21|
|    lisi|       30|
|  wangwu|       26|
| zhaoliu|       31|
|  tianqi|       36|
|   jerry|       41|
+--------+---------+

```



4）下面演示过滤  age>=25的数据

```shell
scala> df.filter(df("age")>=25).show()
+---+--------+
|age|username|
+---+--------+
| 29|    lisi|
| 25|  wangwu|
| 30| zhaoliu|
| 35|  tianqi|
| 40|   jerry|
+---+--------+
```

从返回结果来看，成功过滤出 age大于等于25的数据



5）下面演示分组 按照年龄进行分组，并统计相同年龄的人数

```shell
scala> df.groupBy(df("age")).count().show()
+---+-----+
|age|count|
+---+-----+
| 29|    1|
| 25|    1|
| 35|    1|
| 30|    1|
| 20|    1|
| 40|    1|
+---+-----+
```

从结果来看，成功统计出相同年龄的人数信息



6）下面演示排序 按照年龄降序排序

```shell
scala> df.sort(("age").desc).show()
                       ^
       error: value desc is not a member of String

# 注意:涉及到运算的时候, 每列都必须使用$, 或者采用引号表达式：单引号+字段名
scala> df.sort(($"age").desc).show()  
+---+--------+
|age|username|
+---+--------+
| 40|   jerry|
| 35|  tianqi|
| 30| zhaoliu|
| 29|    lisi|
| 25|  wangwu|
| 20|zhangsan|
+---+--------+
```

从上述返回结果来看，数据成功按照age降序排序



## SQL风格

-   DataFrame的强大之处就是**可以将它看做是一个关系型数据表**，然后可以在程序中直接使用 **spark.sql()** 的方式执行SQL 查询，结果将作为一个 DataFrame 返回。
-   SQL语法风格是指我们查询数据的时候使用SQL语句来查询，这种风格的查询**前提是要有临时视图或者全局视图来辅助（即需要将DataFrame注册成临时表）**

| 方法                               | 描述                                           |
| ---------------------------------- | ---------------------------------------------- |
| df.registerTempTable()             | 将 DataFrame注册成一个临时表                   |
| df.createTempView()                | 将 DataFrame创建一个临时表(视图)               |
| df.createOrReplaceTempView()       | 将 DataFrame创建或取代一个临时表(视图)         |
| df.createGlobalTempView()          | 将 DataFrame创建一个**全局**临时表(视图)       |
| df.createOrReplaceGlobalTempView() | 将 DataFrame创建或取代一个**全局**临时表(视图) |
| spark.sql()                        | 执行sql                                        |

1）读取JSON文件创建DataFrame

```shell
scala> var df = spark.read.json("/opt/temp/spark/user.json")
var df: org.apache.spark.sql.DataFrame = [age: bigint, username: string]
```

2）对DataFrame创建一个临时表(视图)

```shell
scala> df.createOrReplaceTempView("people")
```

3）通过SQL语句实现查询全表

使用 spark.sql() 查询全表（spark即 SparkSession）

```shell
scala> val sqlDF = spark.sql("select * from people")
val sqlDF: org.apache.spark.sql.DataFrame = [age: bigint, username: string]
```

4）结果展示

使用show()展示

```shell
scala> sqlDF.show()
+---+--------+
|age|username|
+---+--------+
| 20|zhangsan|
| 29|    lisi|
| 25|  wangwu|
| 30| zhaoliu|
| 35|  tianqi|
| 40|   jerry|
+---+--------+
```

5）演示查询年龄最大的两个人的信息，并展示

```shell
scala> spark.sql("select * from people order by age desc limit 2 ").show()
+---+--------+
|age|username|
+---+--------+
| 40|   jerry|
| 35|  tianqi|
+---+--------+
```

6）演示查询年龄>= 25 的人的信息，并展示

```shell
scala> spark.sql("select * from people where age >= 25").show()
+---+--------+
|age|username|
+---+--------+
| 29|    lisi|
| 25|  wangwu|
| 30| zhaoliu|
| 35|  tianqi|
| 40|   jerry|
+---+--------+
```

注意：

​	**普通临时表是Session范围内的**，**如果想应用范围内有效，可以使用全局临时表**。使用全局临时表时需要全路径访问，如：global_temp.people

7）演示全局临时表

```shell
# 创建的普通表
scala> df.createOrReplaceTempView("people")

# 在新session中查询，会报错
scala> spark.newSession().sql("select * from people").show()
23/05/06 08:56:53 WARN HiveConf: HiveConf of name hive.stats.jdbc.timeout does not exist
23/05/06 08:56:53 WARN HiveConf: HiveConf of name hive.stats.retries.wait does not exist
......

# 创建全局临时表
scala> df.createGlobalTempView("people_global")
23/05/06 08:58:58 WARN ObjectStore: Failed to get database global_temp, returning NoSuchObjectException

# 查询全局表，但是为加上  global_temp
# 会报错
scala> spark.newSession().sql("select * from people_global").show()
org.apache.spark.sql.AnalysisException: Table or view not found: people_global; line 1 pos 14;
'Project [*]
+- 'UnresolvedRelation [people_global], [], false
......

# 查询全局表，但是加上了 global_temp （成功查询）
scala> spark.newSession().sql("select * from global_temp.people_global").show()
+---+--------+
|age|username|
+---+--------+
| 20|zhangsan|
| 29|    lisi|
| 25|  wangwu|
| 30| zhaoliu|
| 35|  tianqi|
| 40|   jerry|
+---+--------+
```



# DataSet

-   DataSet 是Spark 1.6 Alpha 版本中引入的一个新的一个新的数据抽象结构，最终在Spark2.0 版本被定义为 Spark 新特性。
-   它提供了特定域对象的**强类型集合**，也就是在RDD的每行数据中添加了类型约束条件，只有满足约束条件的数据类型才能正常运行。
-   DataSet 结合了RDD 和 DataFrame的优点，并且可以调用封装的方法以并行方式进行转换等操作
-   **Dataset 和DataFrame拥有完全相同的成员函数**

## DataSet的创建

**1）从已存在的RDD中创建DataSet**

创建DataSet可以通过SparkSession中的createDataset创建DataSet

```shell
scala> val ds = spark.createDataset(sc.textFile("/opt/temp/spark/user.txt"))
val ds: org.apache.spark.sql.Dataset[String] = [value: string]

scala> ds.show()
+-----------+
|      value|
+-----------+
|zhangsan 20|
|    lisi 29|
|  wangwu 25|
| zhaoliu 30|
|  tianqi 35|
|   jerry 40|
+-----------+
```

从返回的结果 ds 的属性来看，Dataset 从已存在的RDD中构建成功，并且赋予 value 为String类型。Dataset 和DataFrame拥有完全相同的成员函数，通过show() 方法可以展示 ds 中数据的具体内容

**2）使用样例类序列创建DataSet**

```shell
scala> case class Person(name: String, age: Long)
class Person

scala> val caseClassDS = Seq(Person("zhangsan",2)).toDS()
val caseClassDS: org.apache.spark.sql.Dataset[Person] = [name: string, age: bigint]

scala> caseClassDS.show()
+--------+---+
|    name|age|
+--------+---+
|zhangsan|  2|
+--------+---+
```

**3）使用基本类型的序列创建DataSet**

注意：

​	**在实际使用的时候，很少用到把序列转换成DataSet，更多的是通过RDD来得到DataSet**

```shell
scala> val ds = Seq(1,2,3,4,5).toDS
warning: 1 deprecation (since 2.13.3); for details, enable `:setting -deprecation` or `:replay -deprecation`
val ds: org.apache.spark.sql.Dataset[Int] = [value: int]

scala> ds.show
warning: 1 deprecation (since 2.13.3); for details, enable `:setting -deprecation` or `:replay -deprecation`
+-----+
|value|
+-----+
|    1|
|    2|
|    3|
|    4|
|    5|
+-----+
```



# RDD、DataFrame、DataSet三者之间的相互转换

RDD、DataFrame、DataSet 三种相互转换

```shell
### RDD 转换为 DataFrame
	toDF(列名1,列名2,....) 		将RDD 转换为 DaraFrame对象
	rdd.toDF() 		通过样例类 将rdd 转换为 DataFrame对象

### RDD 转换为 DataSet
	RDD[样例类].toDS()
	spark.createDataset(已存在的RDD)  将已存在的RDD 转换为 Dataset对象
	

### DataFrame 转换为 RDD
	rdd 	通过 DataFrame对象的 rdd方法 将 DataFrame对象 转换为 RDD


### DataFrame 转换为 DataSet
	as[ElementType] 即 as[样例类]
	

### DataSet 转换为 RDD 
	rdd


### DataSet 转换为 DataFrame
	toDF()
```



## RDD 转换为 DataFrame

​	在IDEA中开发程序时，如果需要RDD与DF或者DS之间互相操作，那么需要引入 import **spark.implicits._（启用隐式转换）**

**注意：Scala中的隐射转换在Java中是不存在的**

​	这里的**spark**不是Scala中的包名，而**是创建的sparkSession对象的变量名称**，所以必须先创建SparkSession对象再导入。这里的spark对象不能使用var声明，因为Scala只支持val修饰的对象的引入。

**1）调用rdd对象的 toDF() 方法将rdd转换为了 DataFrame对象**

spark-shell中无需导入，因为spark-shell默认自动完成此操作。

```shell
# 调用rdd对象的 toDF() 方法 将，rdd转换为了 DataFrame对象
scala> val rdd = sc.textFile("/opt/temp/spark/user.txt")
val rdd: org.apache.spark.rdd.RDD[String] = /opt/temp/spark/user.txt MapPartitionsRDD[18] at textFile at <console>:1

scala> rdd.toDF("age").show()
+-----------+
|        age|
+-----------+
|zhangsan 20|
|    lisi 29|
|  wangwu 25|
| zhaoliu 30|
|  tianqi 35|
|   jerry 40|
+-----------+
```

2）通过样例类将RDD转换为DataFrame

**实际开发中，一般通过样例类将RDD转换为DataFrame**

```shell
# 样例类
scala> case class User(username:String, age:Int)
class User

# rdd
scala> var rdd = sc.makeRDD(List(("zhangsan",30),("lisi",40)))
var rdd: org.apache.spark.rdd.RDD[(String, Int)] = ParallelCollectionRDD[0] at makeRDD at <console>:1

# 通过样例类 将rdd 转换为 DataFrame对象
scala> var df = rdd.map(t => User(t._1,t._2)).toDF
warning: 1 deprecation (since 2.13.3); for details, enable `:setting -deprecation` or `:replay -deprecation`
var df: org.apache.spark.sql.DataFrame = [username: string, age: int]

scala> df.show
warning: 1 deprecation (since 2.13.3); for details, enable `:setting -deprecation` or `:replay -deprecation`
+--------+---+
|username|age|
+--------+---+
|zhangsan| 30|
|    lisi| 40|
+--------+---+
```

## RDD 转换为 DataSet

​	Spark SQL能够自动将包含有 case类的 RDD 转换成 DataSet，case类定义了table的结构，case类 属性通过反射变成了表的列名。Case类可以包含诸如Seq或者Array等复杂的结构。

```shell
# 样例类
scala> case class User(username:String, age:Int)
class User

# 将RDD对象 转换为 Dataset对象
scala> val ds = sc.makeRDD(List(("zhangsan",30), ("lisi",49))).map(t=>User(t._1, t._2)).toDS
warning: 1 deprecation (since 2.13.3); for details, enable `:setting -deprecation` or `:replay -deprecation`
val ds: org.apache.spark.sql.Dataset[User] = [username: string, age: int]

scala> ds.show
warning: 1 deprecation (since 2.13.3); for details, enable `:setting -deprecation` or `:replay -deprecation`
+--------+---+
|username|age|
+--------+---+
|zhangsan| 30|
|    lisi| 49|
+--------+---+
```

## DataFrame 转换为 RDD

DataFrame其实就是对RDD的封装，所以可以直接获取内部的RDD

```shell
# 样例类
scala> case class User(username:String, age:Int)
class User

# DataFrame对象 （将rdd通过样例类的方式转换为了DataFrame对象）
scala> val df = sc.makeRDD(List(("zhangsan",30), ("lisi",40))).map(t=>User(t._1, t._2)).toDF
warning: 1 deprecation (since 2.13.3); for details, enable `:setting -deprecation` or `:replay -deprecation`
val df: org.apache.spark.sql.DataFrame = [username: string, age: int]

# 将 DataFrame对象 转换为 RDD对象
scala> var rdd = df.rdd
var rdd: org.apache.spark.rdd.RDD[org.apache.spark.sql.Row] = MapPartitionsRDD[8] at rdd at <console>:1

scala> var array = rdd.collect
warning: 1 deprecation (since 2.13.3); for details, enable `:setting -deprecation` or `:replay -deprecation`
var array: Array[org.apache.spark.sql.Row] = Array([zhangsan,30], [lisi,40])  
```

注意：

​	**此时得到的RDD存储类型为Row**

```shell
scala> array(0)
val res0: org.apache.spark.sql.Row = [zhangsan,30]

scala> array(0)(0)
val res1: Any = zhangsan

scala> array(0).getAs[String]("username")
val res5: String = zhangsan
```

## DataFrame 转换为 DataSet

​	DataFrame其实是DataSet的特例，所以它们之间是可以互相转换的

```shell
# 样例类
scala> case class User(username:String, age:Int)
class User

# 将RDD对象 通过toDF(列名) 的方式转换为 DataFrame对象
scala> val df = sc.makeRDD(List(("zhangsan",30), ("lisi",49))).toDF("username","age")
val df: org.apache.spark.sql.DataFrame = [username: string, age: int]

# 将 DataFrame对象 转换为 Dataset对象
scala> val ds = df.as[User]
val ds: org.apache.spark.sql.Dataset[User] = [username: string, age: int]

scala> ds.show
warning: 1 deprecation (since 2.13.3); for details, enable `:setting -deprecation` or `:replay -deprecation`
+--------+---+
|username|age|
+--------+---+
|zhangsan| 30|
|    lisi| 49|
+--------+---+
```

## DataSet 转换为 RDD 

​	DataSet其实也是对RDD的封装，所以可以直接获取内部的RDD

```shell
# 样例类
scala> case class User(username:String, age:Int)
class User

# Dataset对象
scala> var ds = sc.makeRDD(List(("zhangsan",30), ("lisi",49))).map(t=>User(t._1, t._2)).toDS
warning: 1 deprecation (since 2.13.3); for details, enable `:setting -deprecation` or `:replay -deprecation`
var ds: org.apache.spark.sql.Dataset[User] = [username: string, age: int]

# 将 Dataset对象 通过rdd方法 转换为 RDD对象
scala> val rdd = ds.rdd
val rdd: org.apache.spark.rdd.RDD[User] = MapPartitionsRDD[26] at rdd at <console>:1

scala> rdd.collect
warning: 1 deprecation (since 2.13.3); for details, enable `:setting -deprecation` or `:replay -deprecation`
val res20: Array[User] = Array(User(zhangsan,30), User(lisi,49))
```

## DataSet 转换为 DataFrame

​	DataFrame其实是DataSet的特例，所以它们之间是可以互相转换的。

```shell
# 样例类
scala> case class User(username:String, age:Int)
class User

# DataFrame对象
scala> val df = sc.makeRDD(List(("zhangsan",30), ("lisi",49))).toDF("username","age")
val df: org.apache.spark.sql.DataFrame = [username: string, age: int]

# Dataset对象
scala> val ds = df.as[User]
val ds: org.apache.spark.sql.Dataset[User] = [username: string, age: int]

# 将 Dataset对象  通过toDF转换为 DataFrame对象
scala> var dataframe = ds.toDF()
var dataframe: org.apache.spark.sql.DataFrame = [username: string, age: int]

scala> dataframe.show
warning: 1 deprecation (since 2.13.3); for details, enable `:setting -deprecation` or `:replay -deprecation`
+--------+---+
|username|age|
+--------+---+
|zhangsan| 30|
|    lisi| 49|
+--------+---+
```



# RDD、DataFrame、DataSet三者之间的关系

​	在Spark SQL中Spark为我们提供了两个新的抽象，分别是**DataFrame和DataSet**。他们和RDD有什么区别呢？首先从版本的产生上来看：

-   ​	Spark1.0 => RDD 
-   ​	Spark1.3 => DataFrame
-   ​	Spark1.6 => Dataset

如果**同样的数据都给到这三个数据结构，他们分别计算之后，都会给出相同的结果**。不同是的他们的执行效率和执行方式。在后期的Spark版本中，DataSet有可能会逐步取代RDD和DataFrame成为唯一的API接口。

## 三者的共性

-   RDD、DataFrame、DataSet全都是spark平台下的分布式弹性数据集，为处理超大型数据提供便利;
-   三者都有**惰性机制**，在进行创建、转换，如map方法时，不会立即执行，只有在遇到Action如foreach时，三者才会开始遍历运算;
-   三者有许多共同的函数，如filter，排序等;
-   在对DataFrame和Dataset进行操作许多操作都需要这个包:**import spark.implicits._**（在创建好SparkSession对象后尽量直接导入 这里的spark其实是SparkSession的对象）
-   三者都会根据 Spark 的内存情况自动缓存运算，这样即使数据量很大，也不用担心会内存溢出
-   三者都有partition（分区）的概念
-   DataFrame和DataSet均可使用模式匹配获取各个字段的值和类型



## 三者的区别

**1）RDD**

-   RDD一般和spark mllib同时使用
-   RDD不支持spark sql操作

**2）DataFrame**

-   与RDD和Dataset不同，DataFrame**每一行的类型固定为Row**，每一列的值没法直接访问，只有通过解析才能获取各个字段的值
-   DataFrame 与 DataSet一般不与 spark mllib 同时使用
-   DataFrame 与 DataSet均**支持 Spark SQL 的操作**，比如select，groupby之类，还能注册临时表/视窗，进行 sql 语句操作
-   DataFrame 与DataSet 支持一些特别方便的保存方式，比如保存成csv，可以带上表头，这样每一列的字段名一目了然

**3）DataSet**

-   **Dataset 和DataFrame 拥有完全相同的成员函数**，区别只是每一行的数据类型不同。 DataFrame其实就是DataSet的一个特例  **type DataFrame = Dataset[Row]**

-   DataFrame也可以叫 Dataset[Row] ,每一行的类型是Row，不解析，每一行究竟有哪些字段，各个字段又是什么类型都无从得知，只能用上面提到的 getAS方法或者 模式匹配拿出特定字段。而Dataset中，每一行是什么类型是不一定的，在自定义了case class之后可以很自由的获得每一行的信息

    

以下是AI生成的总结

-   RDD（Resilient Distributed Datasets）是Spark中**最基本的抽象**，它是一个不可变的分布式数据集合，可以在集群中进行并行处理。RDD提供了一些转换（Transformation）操作和动作（Action）操作，例如map、reduce等。RDD是强类型的，可以存储任何类型的数据。
-   DataFrame是一种以**列**为中心的数据结构，类似于关系型数据库中的表，可以处理结构化数据。DataFrame是由多个有名称的列组成的，每个列都有一个数据类型。它也提供了一些转换操作和动作操作，例如select、filter、groupBy等。DataFrame是弱类型的，即可以使用任何类型的数据。
-   Dataset是Spark中最新的API（Spark 1.6），它是DataFrame的扩展，提供了类型安全和面向对象的编程接口。Dataset可以存储任何类型的数据，同时提供了与RDD相似的转换和动作操作，也提供了与DataFrame相似的SQL操作。

三者之间的区别在于数据类型和编程接口的不同。RDD是**强类型**的，DataFrame是**弱类型**的，Dataset是**类型安全的**。RDD可以存储任何类型的数据，**DataFrame和Dataset主要用于结构化数据**。DataFrame提供了类似于SQL的API，Dataset提供了面向对象的API。



# Java 开发Spark SQL

添加依赖

```xml
<!-- spark-core-->
<dependency>
    <groupId>org.apache.spark</groupId>
    <artifactId>spark-core_2.13</artifactId>
    <version>3.2.0</version>
</dependency>
<!-- spark-sql-->
<dependency>
    <groupId>org.apache.spark</groupId>
    <!-- 2.13是Scala的版本，3.2.0是spark的版本-->
    <artifactId>spark-sql_2.13</artifactId>
    <version>3.2.0</version>
</dependency>
```

代码的实现

## RDD、DataFrame、DataSet间相互转换

-   **在java中，DataFrame其实就是 Dataset<Row>，在后续的代码中可以体现出来**

1）数据准备

准备数据person.json、person.txt，将person.json、person.txt文件放置在 /opt/temp/spark/目录下，文件内容如下

person.json文件内容

```json
{"id": "1","name": "zhangsan","scroe": 90}
{"id": "2","name": "lishi","score": 100}
{"id": "3","name": "wanwu","score": 800}
```

person.txt文件内容

```
1 zhangsan 90
2 lishi 100
3 wanwu 20
```

### DataFrame基本使用

java代码如下

```java
/**
 * bin/spark-submit --class com.clear.SparkSQL_DataFrame_start --master local /opt/temp/spark-sql-demo-1.0.jar
 */
public class SparkSQL_DataFrame_start {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("DataFrame的基本使用").setMaster("local[*]");
        SparkSession spark = SparkSession
                .builder()
                .config(sparkConf)
                .appName("java Spark SQL 简单演示")
                .getOrCreate();

        Dataset<Row> df = spark.read().json("/opt/temp/spark/person.json");
        // 打印元数据信息
        df.printSchema();
        // 查询数据
        df.show();
        // 查询指定列 ===>  DSL风格
        df.select(df.col("name")).show();
        // 对查询的结果进行加一显示，并对列其别名
        df.select(df.col("score").plus(1).alias("score+1")).show();
        // 使用下面的方式会报错
        // AnalysisException: cannot resolve 'age1' given input columns: [age, username];
        // df.select("$score" + 1, "username").show();
        // df.select("score" + 1, "username").show();

    }
}
```

打包jar上次至服务器，执行结果如下

```
+---+--------+-----+
| id|    name|score|
+---+--------+-----+
|  1|zhangsan|   90|
|  2|   lishi|  100|
|  3|   wanwu|  800|
+---+--------+-----+
+--------+
|    name|
+--------+
|zhangsan|
|   lishi|
|   wanwu|
+--------+
+-------+
|score+1|
+-------+
|     91|
|    101|
|    801|
+-------+

```



### RDD 和 DataFrame互相装换

Spark官方提供了两种方式实现**从 RDD 转换得到 DataFrame**

-   第一种方式是利用**反射机制**来**推断包含特定类型对象的Schema**，这种方式适合对已知数据结构的RDD转换。
-   第二种方式是通过**编程接口构造一个 Schema**，并将其应用在已知的RDD数据中。

#### 反射机制推断 Schema

由于计算机无法像人一样直观感受字段的实际含义，因此**需要通过反射机制来推断特定类型对象的 Schema信息**

```java
/**
 * RDD 与 DataFrame 的相互转换
 *  todo    RDD ==> DataFame 反射机制推断Schema
 * bin/spark-submit --class com.clear.SparkSQL_JavaRDDtoDataFrame --master local[*] /opt/temp/spark-sql-demo-1.0.jar
 */
public class SparkSQL_JavaRDDtoDataFrame {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("演示JavaRDD与DataFrame的相互转换");
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        jsc.setLogLevel("ERROR");  // 设置日志打印级别

        // 获取SparkSession对象
        // SparkSession 是Spark最新（Spark 2.0之后）的 SQL 查询起始点
        // 实质上是 SQLContext和 HiveContext的组合
        // 所以在 SQLContext 和HiveContext 上可用的API在SparkSession上同样是可以使用的。
        // SparkSession内部封装了SparkContext，所以计算实际上是由sparkContext完成的
        SparkSession spark = SparkSession
                .builder()
                .config(sparkConf)
                .appName("演示使用 反射机制推断Schema  RDD 转换为 DataFrame")
                .getOrCreate();

        // 创建SparkSQL上下文
        // 以下两种方式都行，只不过第一种方式被标记为deprecated，不推荐使用
        SQLContext sqlContext = new SQLContext(jsc);
        //SQLContext sqlContext = new SQLContext(spark);

        JavaRDD<String> javaRDD = jsc.textFile("/opt/temp/spark/person.txt");
        // 1)将String变成Student对象
        JavaRDD<Student> studentRDD = javaRDD.map(new Function<String, Student>() {
            @Override
            public Student call(String s) throws Exception {
                String[] split = s.split(" ");
                Student student = new Student();
                student.setId(Integer.parseInt(split[0]));
                student.setName(split[1]);
                student.setScore(Double.parseDouble(split[2]));

                return student;
            }
        });

        System.out.println("-----javaRDD 转换为 DataFrame-----");
        // 将 javaRDD 转换为DataFrame 这里是通过反射的方式，返回的RDD数据要和对应类的属性名对应
        // 在Java中 DataFrame ==> Dataset<Row>
        // 2)再将RDD（Student对象）变成DataFrame对象
        Dataset<Row> df = sqlContext.createDataFrame(studentRDD, Student.class);

        System.out.println("-----------DSL风格-------------");
        // 1.DSL风格
        // DSL风格不需要注册临时表
        df.select(df.col("id"), df.col("name"), df.col("score")).show();

        System.out.println("-----------SQL风格-------------");
        // 2.SQL风格 (不推荐)
        // 对DataFrame数据创建一张临时表 或 临时视图
        df.createOrReplaceTempView("student");
        // 对创建的临时表执行sql操作
        sqlContext.sql("select * from student").show();


        System.out.println("-----DataFrame 转换为 javaRDD-----");
        // 将 DataFrame 转换为 javaRDD
        JavaRDD<Row> rowJavaRDD = df.javaRDD();
        JavaRDD<Student> resultRDD = rowJavaRDD.map(new Function<Row, Student>() {
            @Override
            public Student call(Row rowData) throws Exception {
                Student student = new Student();
                // student.setId(rowData.getInt(0));
                // student.setName(rowData.getString(1));
                // student.setScore(rowData.getDouble(2));
                // 通过下标获取值，在不清楚数据类型的情况下，慎用。
                // 上面是不推荐的写法，推荐写法如下
                student.setId(rowData.getAs("id"));
                student.setName(rowData.getAs("name"));
                student.setScore(rowData.getAs("score"));
                return student;
            }
        });
        resultRDD.foreach(new VoidFunction<Student>() {
            @Override
            public void call(Student student) throws Exception {
                System.out.println(student.getId() + "\t" + student.getName() + "\t" + student.getScore());
            }
        });

        // 释放资源
        spark.stop();
        jsc.stop();
    }
}


// 这里必须实现序列化
public class Student implements Serializable {
    private int id;
    private String name;
    private double score;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }
}
```

上传至服务器运行结果如下

```
-----javaRDD 转换为 DataFrame-----
-----------DSL风格-------------
+---+--------+-----+
| id|    name|score|
+---+--------+-----+
|  1|zhangsan| 90.0|
|  2|   lishi|100.0|
|  3|   wanwu| 20.0|
+---+--------+-----+

-----------SQL风格-------------
+---+--------+-----+
| id|    name|score|
+---+--------+-----+
|  1|zhangsan| 90.0|
|  2|   lishi|100.0|
|  3|   wanwu| 20.0|
+---+--------+-----+

-----DataFrame 转换为 javaRDD-----
3	wanwu	20.0
1	zhangsan	90.0
2	lishi	100.0

```



#### 编程方式动态定义 Schema

**当case类(scala中的说法)不能提前定义时**，就需要采用编程方式定义 Schema信息，定义 DataFrame主要包含3个步骤：

1）创建一个Row对象结果的RDD（即将数据加载成 **JavaRDD<Row>** 类型返回）

2）基于StructType类型创建Schema（先通过 DataTypes.createStructType创建 **StructType**，跟根据DataTypes.createStructField 创建 **StructField**）

3）通过SparkSession（**实际上是SQLContext对象提供的方法，因为SparkSession就是对SQLContext的封装**） 提供的 createDataFrame() 方法来拼接Schema

```java
/**
 * RDD 与 DataFrame 的相互转换
 * todo    RDD ==> DataFame 编程方式定义Schema
 * bin/spark-submit --class com.clear.SparkSQL_JavaRDDtoDataFrame2 --master local[*] /opt/temp/spark-sql-demo-1.0.jar
 */
public class SparkSQL_JavaRDDtoDataFrame2 {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("演示JavaRDD与DataFrame的相互转换");
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        jsc.setLogLevel("ERROR");

        SparkSession spark = SparkSession
                .builder()
                .config(sparkConf)
                .appName("演示使用 编程方式定义Schema RDD 转换为 DataFrame")
                .getOrCreate();

        // 创建SparkSQL上下文
        // 以下两种方式都行，只不过第一种方式被标记为deprecated，不推荐使用
        SQLContext sqlContext = new SQLContext(jsc);
        //SQLContext sqlContext = new SQLContext(spark);

        JavaRDD<String> javaRDD = jsc.textFile("/opt/temp/spark/person.txt");
        // 加载数据到 Row对象
        JavaRDD<Row> studentRDD = javaRDD.map(new Function<String, Row>() {
            @Override
            public Row call(String s) throws Exception {
                String[] split = s.split(" ");
                //使用动态类型构建的时候，要保证返回的数据类型和后面的structFields类型一致
                return RowFactory.create(Integer.parseInt(split[0]),
                        split[1],
                        Double.parseDouble(split[2]));
            }
        });

    /*    // 创建 Schema  对于上面返回的RDD匹配字段元数据
        ArrayList<StructField> structFields = new ArrayList<>();
        structFields.add(DataTypes.createStructField("id", DataTypes.IntegerType, true));
        structFields.add(DataTypes.createStructField("name", DataTypes.StringType, true));
        structFields.add(DataTypes.createStructField("score", DataTypes.DoubleType, true));
        // 生成元数据
        StructType schema = DataTypes.createStructType(structFields);*/

        // 向创建 schema信息 StructType 中再去描述具体的字段信息StructField
        StructType schema = DataTypes.createStructType(Arrays.asList(
                // createStructField三个参数分别为：字段名、字段类型、是否可以为null
                DataTypes.createStructField("id", DataTypes.IntegerType, true),
                DataTypes.createStructField("name", DataTypes.StringType, true),
                DataTypes.createStructField("score", DataTypes.DoubleType, true)
        ));

        System.out.println("-----javaRDD 转换为 DataFrame-----");
        //构建RDD和 schema 的关系得到dataFrame，注意Dataset<Row>的别名就是DataFrame
        // 将javaRDD转换为 DataFrame
		//Dataset<Row> df = sqlContext.createDataFrame(studentRDD, schema);
        Dataset<Row> df = spark.createDataFrame(studentRDD, schema);
        System.out.println("-----------DSL风格-------------");
        // 1.DSL风格
        // DSL风格不需要注册临时表
        df.select(df.col("id"), df.col("name"), df.col("score")).show();

        System.out.println("-----------SQL风格-------------");
        // 2.SQL风格 (不推荐)
        // 对DataFrame数据创建一张临时表 或 临时视图
        df.createOrReplaceTempView("student");
        // 对创建的临时表执行sql操作
        Dataset<Row> targetDataFrame = sqlContext.sql("select * from student");
        targetDataFrame.show();

        System.out.println("-----DataFrame 转换为 javaRDD-----");
        // 将 DataFrame 转换为 javaRDD
        JavaRDD<Row> rowJavaRDD = targetDataFrame.javaRDD();
        rowJavaRDD.foreach(new VoidFunction<Row>() {
            @Override
            public void call(Row row) throws Exception {
                System.out.println(row);
            }
        });

        // 释放资源
        spark.stop();
        jsc.stop();
    }

}
```

上传至服务器运行结果如下

```
-----javaRDD 转换为 DataFrame-----
-----------DSL风格-------------
+---+--------+-----+
| id|    name|score|
+---+--------+-----+
|  1|zhangsan| 90.0|
|  2|   lishi|100.0|
|  3|   wanwu| 20.0|
+---+--------+-----+

-----------SQL风格-------------
+---+--------+-----+
| id|    name|score|
+---+--------+-----+
|  1|zhangsan| 90.0|
|  2|   lishi|100.0|
|  3|   wanwu| 20.0|
+---+--------+-----+

-----DataFrame 转换为 javaRDD-----
[1,zhangsan,90.0]
[2,lishi,100.0]
[3,wanwu,20.0]

```



# Spark SQL函数

## Spark SQL内置函数

Spark SQL内置了大量的函数，位于API **org.apache.spark.sql.functions**中。这些函数主要分为10类：UDF函数、聚合函数、日期函数、排序函数、非聚合函数、数学函数、混杂函数、窗口函数、字符串函数、集合函数，大部分函数与Hive中相同。

使用内置函数有两种方式：

​	一种是通过编程的方式（DSL）使用

​	另一种是在SQL语句中使用。



## 用户自定义函数

-   在 Spark 处理数据的过程中，虽然 DataSet 下的算子不多，但已经可以处理大多数的数据需求，但仍有少数需求需要自定义函数。UDF(User Defined Functions) 是普通的不会产生 Shuffle 不会划分新的阶段的用户自定义函数，UDAF(User Defined Aggregator Functions) 则会打乱分区，用户自定义聚合函数。

-   因为 **UDF 不需要打乱分区**，直接对 RDD 每个分区中的数据进行处理并返回当前分区，所以可以直接注册 UDF 函数，甚至可以传入匿名函数。

-   相比较 UDF 而言因为 **UDAF 是聚合函数所以要打乱分区**，所以也就比较复杂，并且需要重写指定的方法来定义。需要注意的是针对**弱类型的 UserDefinedAggregateFunction 已经弃用**，**普遍使用强类型的 Aggregator** ，同时若想在 Spark3.0 版本之前使用强类型 UDAF 和 Spark3.0 版本之后的定义方式略有不同。
    

数据准备

在/opt/temp/spark目录下，有user.json文件，内容如下

```json
{"username":"zhangsan","age":20}
{"username":"lisi","age":29}
{"username":"wangwu","age":25}
{"username":"zhaoliu","age":30}
{"username":"tianqi","age":35}
{"username":"jerry","age":40}
```



### UDF 用户自定义函数

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



#### spark-shell 实现UDF

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



#### Java 实现UDF

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



### UDAF 用户自定义聚合函数

-   实现 **UDAF** 函数，如果要自定义类，**要实现UserDefinedAggregateFunction类。**
-   强类型的 Dataset 和 弱类型的 DataFrame 都提供了相关的聚合函数， 如 count()，countDistinct()，avg()，max()，min()。
-   除此之外，用户可以设定自己的**自定义聚合函数**。通过**实现UserDefinedAggregateFunction来实现用户自定义弱类型聚合函数**。
-   从Spark3.0版本后，UserDefinedAggregateFunction已经不推荐使用了。可以统一采用强类型聚合函数**Aggregator**

#### UDAF 弱类型实现

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

#### UDAF 强类型实现(推荐方式)

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



#### Spark早期版本使用强类型UDAF

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



**累加器方式实现**

```

```



## 开窗函数

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



# Spark SQL操作数据源

Spark SQL 的数据源可以是 JSON、JDBC、Parquet、Hive、HDFS等

## 数据的加载与保存

​	SparkSQL提供了通用的保存数据和数据加载的方式。这里的通用指的是使用相同的API，根据不同的参数读取和保存不同格式的数据，SparkSQL**默认读取和保存的文件格式为parquet**

### 1）加载数据

**读数据格式**

**spark.read.load** 是加载数据的通用方法

```scala
scala> spark.read.

csv   format   jdbc   json   load   option   options   orc   parquet   schema   table   text   textFile

// load是加载(读取)数据的通用方法
// 其他的则是读取不同格式数据的特定方法（其中 parquet是SparkSQL默认的读取和保存格式）
```

所有读取 API 遵循以下调用格式：

```scala
// 格式
DataFrameReader.format("...").option("key", "value").schema(...).load("...")
// 说明
// format("...") 指定加载的数据类型
// 				包括"csv"、"jdbc"、"json"、"orc"、"parquet"和"textFile"等

// option("key", "value")	例如，在"jdbc"格式下需要传入JDBC相应参数，url、user、password和dbtable

// load("...")	在"csv"、"jdbc"、"json"、"orc"、"parquet"和"textFile"格式下需要传入加载数据的路径。

 
// 示例  spark.read.load 是加载数据的通用方法
spark.read.format("csv")
.option("mode", "FAILFAST")          // 读取模式
.option("inferSchema", "true")       // 是否自动推断 schema
.option("path", "path/to/file(s)")   // 文件路径
.schema(someSchema)                  // 使用预定义的 schema      
.load()
```

如果读取不同格式的数据，可以对不同的数据格式进行设定

```scala
scala> spark.read.format("…")[.option("…")].load("…")
```

我们前面都是使用read API 先把文件加载到 DataFrame然后再查询，其实，我们也可以直接在文件上进行查询:  **文件格式.`文件路径`**(其中`是飘号)

```scala
scala> 
       spark.sql("select * from json.`/opt/temp/spark/user.json`").show
warning: 1 deprecation (since 2.13.3); for details, enable `:setting -deprecation` or `:replay -deprecation`
23/05/09 01:25:52 WARN ObjectStore: Failed to get database json, returning NoSuchObjectException
+---+--------+                                                                  
|age|username|
+---+--------+
| 20|zhangsan|
| 29|    lisi|
| 25|  wangwu|
| 30| zhaoliu|
| 35|  tianqi|
| 40|   jerry|
+---+--------+
```

##### 读取模式

读取模式有以下几种

| mode          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| permissive    | 当遇到损坏的记录时，将其所有字段设置为 null，并将所有损坏的记录放在名为 _corruption t_record 的字符串列中 |
| dropMalformed | 删除格式不正确的行                                           |
| failFast      | 遇到格式不正确的数据时立即失败                               |



### 2）保存数据

**写数据格式**

**df.write.save** 是保存数据的通用方法

```scala
scala>df.write.
csv  jdbc   json  orc   parquet textFile… …
```

所有保存 API 遵循以下调用格式：

```scala
// 格式
DataFrameWriter.format(...).option(...).partitionBy(...).bucketBy(...).sortBy(...).save()
 
//示例
dataframe.write.format("csv")
.option("mode", "OVERWRITE")         //写模式
.option("dateFormat", "yyyy-MM-dd")  //日期格式
.option("path", "path/to/file(s)")
.save()
```

如果读取不同格式的数据，可以对不同的数据格式进行设定

```scala
scala>df.write.format("…")[.option("…")].save("…")

// 说明
// format("…")：指定保存的数据类型，包括"csv"、"jdbc"、"json"、"orc"、"parquet"和"textFile"

// save ("…")：在"csv"、"orc"、"parquet"和"textFile"格式下需要传入 保存数据的路径

// option("…")：例如，在"jdbc"格式下需要传入JDBC相应参数，url、user、password和dbtable
```

保存操作可以使用 **SaveMode**, 用来指明如何处理数据，使用**mode()方法来设置**。例如，

```scala
df.write.mode("append").json("/opt/temp/output")
```

有一点很重要: 这些 **SaveMode 都是没有加锁的, 也不是原子操作**。

##### 保存模式

SaveMode是一个枚举类，其中的常量包括：

| Scala/Java                          | Any Language        | 描述                       |
| ----------------------------------- | ------------------- | -------------------------- |
| SaveMode.ErrorIfExists    (default) | "error"   (default) | 如果文件已经存在则抛出异常 |
| SaveMode.Append                     | "append"            | 如果文件已经存在则追加     |
| SaveMode.Overwrite                  | "overwrite"         | 如果文件已经存在则覆盖     |
| SaveMode.Ignore                     | "ignore"            | 如果文件已经存在则忽略     |



## 操作Parquet

-   **Spark SQL的默认数据源为Parquet格式**。Parquet是一种能够有效存储嵌套数据的列式存储格式。
-   **数据源为Parquet文件时**，Spark SQL可以方便的执行所有的操作，**不需要使用forma**t。
-   修改配置项spark.sql.sources.default，可修改默认数据源格式。

### 1）加载数据

数据准备

在 /opt/software/spark-local/examples/src/main/resources 目录下有个users.parquet 文件，我们先将它拷贝到/opt/temp/saprk目录下

```shell
[root@kk01 resources]# cp /opt/software/spark-local/examples/src/main/resources/users.parquet /opt/temp/spark/
```

```scala
// 加载数据，parquet格式数据是SparkSQL默认的数据源格式，因此不需要使用format()
scala> var df = spark.read.load("/opt/temp/spark/users.parquet")
var df: org.apache.spark.sql.DataFrame = [name: string, favorite_color: string ... 1 more field]

scala> df.show
warning: 1 deprecation (since 2.13.3); for details, enable `:setting -deprecation` or `:replay -deprecation`
+------+--------------+----------------+
|  name|favorite_color|favorite_numbers|
+------+--------------+----------------+
|Alyssa|          null|  [3, 9, 15, 20]|
|   Ben|           red|              []|
+------+--------------+----------------+
```



### 2）保存数据

```scala
// 也可以使用 spark.read.json("/opt/temp/spark/user.json") 代替下面命令
scala> var df = spark.read.format("json").load("/opt/temp/spark/user.json")
var df: org.apache.spark.sql.DataFrame = [age: bigint, username: string]

// 保存为parquet格式
scala> df.write.mode("append").save("/opt/temp/output")

// 查看
[root@kk01 output]# pwd
/opt/temp/output
[root@kk01 output]# ll
total 4
-rw-r--r--. 1 root root 809 May  9 02:13 part-00000-6a0b7dfc-25eb-4014-a442-146fb4e83df9-c000.snappy.parquet
-rw-r--r--. 1 root root   0 May  9 02:13 _SUCCESS

```



## 操作JSON

-   **Spark SQL 能够自动推测 JSON** 数据集的结构，并将它**加载为一个Dataset[Row]**
-   可以通过SparkSession.read.json()去加载JSON 文件。

注意：

​	**Spark读取的JSON文件不是传统的JSON文件，每一行都应该是一个JSON串**。格式如下：

```json
{"name":"Michael"}
{"name":"Andy"， "age":30}
[{"name":"Justin"， "age":19},{"name":"Justin"， "age":19}]
```

​	**Spark读取JSON文件默认不支持一条数据记录跨越多行** (如下)，可以通过**配置 multiLine 为 true 来进行更改**，其默认值为 false。

```json
// 默认支持单行
{"DEPTNO": 10,"DNAME": "ACCOUNTING","LOC": "NEW YORK"}
 
//默认不支持多行
{
  "DEPTNO": 10,
  "DNAME": "ACCOUNTING",
  "LOC": "NEW YORK"
}
```

### 1）加载JSON文件

导入隐式转换

隐射转换在spark-shell中默认已经导入了，在Scala中需要手动导入，但是在Java中，不存在隐式转换

```scala
import spark.implicits._
```

加载JSON文件

```scala
// 加载json文件，加载模式 FAILFAST
scala> var df = spark.read.format("json").option("mode","FAILFAST").load("/opt/temp/spark/user.json")
var df: org.apache.spark.sql.DataFrame = [age: bigint, username: string]

// 查询数据
scala> df.show()
+---+--------+
|age|username|
+---+--------+
| 20|zhangsan|
| 29|    lisi|
| 25|  wangwu|
| 30| zhaoliu|
| 35|  tianqi|
| 40|   jerry|
+---+--------+

// 创建临时表（用于SQL风格的数据操作）
scala> df.createOrReplaceTempView("user")

// 数据查询
scala> var result = spark.sql("select * from user where age >= 29")
var result: org.apache.spark.sql.DataFrame = [age: bigint, username: string]

scala> result.show()
+---+--------+
|age|username|
+---+--------+
| 29|    lisi|
| 30| zhaoliu|
| 35|  tianqi|
| 40|   jerry|
+---+--------+
```

### 2）写入JSON文件

```scala
// 将查询出来的结果保存成新的json文件
// 保存模式：若已存在则忽略
scala> result.write.format("json").mode("ignore").save("/opt/temp/user_out")

// 查看
[root@kk01 user_out]# pwd
/opt/temp/user_out
[root@kk01 user_out]# ll
total 4
-rw-r--r--. 1 root root 122 May 13 05:02 part-00000-70077ee1-fae8-4444-98f1-3a8c755be89c-c000.json
-rw-r--r--. 1 root root   0 May 13 05:02 _SUCCESS
[root@kk01 user_out]# cat part-00000-70077ee1-fae8-4444-98f1-3a8c755be89c-c000.json 
{"age":29,"username":"lisi"}
{"age":30,"username":"zhaoliu"}
{"age":35,"username":"tianqi"}
{"age":40,"username":"jerry"}
```

### 3）Java API 

思路：

​	1、注意json文件中的json数据不能是嵌套格式

​	2、Dataset是一个个 Row 类型的RDD

​	3、如果使用SQL风格需要注册临时表

```java
public class SparkSQL_Json {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("加载JSON文件~~~").setMaster("local[*]");
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        jsc.setLogLevel("ERROR");  // 设置日志打印级别
        SparkSession spark = SparkSession
                .builder()
                .config(sparkConf)
                .getOrCreate();
        SQLContext sqlContext = new SQLContext(spark);

        // 加载json文件
        Dataset<Row> df = spark.read().json("/opt/temp/spark/user.json");
        // 或
        Dataset<Row> df2 = spark.read().format("json").load("/opt/temp/spark/user.json");

        df.cache();
        // 展示加载的数据
        df.show();

        // 将 DataFrame对象的数据保存成 JSON文件
        // 保存模式：如果文件已经存在则忽略
        df.write().format("json").mode(SaveMode.Ignore).save("/opt/temp/user_test");

        spark.stop();
        jsc.stop();
    }
}
```

打包上传至服务器运行结果如下

```shell
[root@kk01 temp]# /opt/software/spark-local/bin/spark-submit --class com.clear.io.SparkSQL_Json --master local /opt/temp/spark-sql-demo-1.0.jar

+---+--------+
|age|username|
+---+--------+
| 20|zhangsan|
| 29|    lisi|
| 25|  wangwu|
| 30| zhaoliu|
| 35|  tianqi|
| 40|   jerry|
+---+--------+
```

```shell
# 查看生成的json文件
[root@kk01 user_test]# pwd
/opt/temp/user_test
[root@kk01 user_test]# ll
total 4
-rw-r--r--. 1 root root 186 May 13 05:08 part-00000-c260a869-f56a-4aab-9afe-05412f795f98-c000.json
-rw-r--r--. 1 root root   0 May 13 05:08 _SUCCESS
[root@kk01 user_test]# cat part-00000-c260a869-f56a-4aab-9afe-05412f795f98-c000.json 
{"age":20,"username":"zhangsan"}
{"age":29,"username":"lisi"}
{"age":25,"username":"wangwu"}
{"age":30,"username":"zhaoliu"}
{"age":35,"username":"tianqi"}
{"age":40,"username":"jerry"}
```



## 操作CSV

-   Spark SQL可以配置CSV文件的列表信息，读取CSV文件,**CSV文件的第一行设置为数据列**

### 1）加载CSV文件

数据准备

在 Linux的/opt/temp/spark目录下，有 user.csv文件

```
id,name,age
1,zhangsan,18
2,lisi,19
3,wnagwu,20
```

加载CSV文件

```scala
scala> val df = spark.read.csv("/opt/temp/spark/user.csv")
val df: org.apache.spark.sql.DataFrame = [_c0: string, _c1: string ... 1 more field]

scala> df.show()
+---+--------+---+
|_c0|     _c1|_c2|
+---+--------+---+
| id|    name|age|
|  1|zhangsan| 18|
|  2|    lisi| 19|
|  3|  wnagwu| 20|
+---+--------+---+
```



### 2）保存CSV文件

```shell
// 将查询出来的结果保存成新的csv文件
// 保存模式：若已存在则忽略
scala> df.write.format("csv").mode("ignore").save("/opt/temp/csvout")

// 查看
[root@kk01 temp]# pwd
/opt/temp
[root@kk01 temp]# cd csvout/
[root@kk01 csvout]# ll
total 4
-rw-r--r--. 1 root root 48 May 13 05:19 part-00000-70c37b99-e9ec-4005-abe6-90759ceed9ea-c000.csv
-rw-r--r--. 1 root root  0 May 13 05:19 _SUCCESS
[root@kk01 csvout]# cat part-00000-70c37b99-e9ec-4005-abe6-90759ceed9ea-c000.csv 
id,name,age
1,zhangsan,18
2,lisi,19
3,wnagwu,20
```



## 操作MySQL

-   Spark SQL可以**通过 JDBC 从关系型数据库中读取数据的方式创建 DataFrame**，通过对DataFrame 一系列的计算后，还可以将数据再写回关系型数据库中。
-   如果**使用spark-shell**操作，可在**启动shell时指定相关的数据库驱动路径或者将相关的数据库驱动放到spark的类路径下**。

```shell
bin/spark-shell --jars  mysql-connector-java-5.1.47.jar
```

导入pom依赖

```xml
<dependency>
	<groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.47</version>
</dependency>
```



### 1）加载数据

加载数据，即读取 MySQL数据库数据

```scala
[root@kk01 spark-local]# pwd
/opt/software/spark-local
[root@kk01 spark-local]# bin/spark-shell --jars /opt/temp/mysql-connector-java-5.1.47.jar 
// 我们连接的是宿主机（window平台）的mysql   
// 参数 useSSL=false 表示关闭安全连接
scala> var df = spark.read.format("jdbc").option("url","jdbc:mysql://192.168.43.2:3306/company?useSSL=false").option("driver","com.mysql.jdbc.Driver").option
("user","root").option("password","123456").option("dbtable","account").load()
var df: org.apache.spark.sql.DataFrame = [acc_no: int, acc_name: string ... 1 more field]

scala> df.show()
+------+--------+-------+
|acc_no|acc_name|balance|
+------+--------+-------+
|     1|    李三|    200|
|     2|    王五|   1800|
|     3|    王五|   1900|
|    10|    赵六|   3000|
|    20|    马七|   5000|
+------+--------+-------+
```

**如果报错：java.sql.SQLException: null,  message from server: "Host 'YOU' is not allowed to connect to this MySQL server"**

则说明宿主机的MySQL不允许远程访问，可以采用如下方式解决

```mysql
# 我们采取的是最简单暴力的方法，修改数据库权限
mysql> use mysql;
Database changed
mysql> select user,host from user;
+---------------+-----------+
| user          | host      |
+---------------+-----------+
| column_user   | localhost |
| mysql.session | localhost |
| mysql.sys     | localhost |
| root          | localhost |
| server_user   | localhost |
| st_01         | localhost |
+---------------+-----------+
6 rows in set (0.00 sec)

mysql> update user set host='%' where user='root';
Query OK, 1 row affected (0.01 sec)
Rows matched: 1  Changed: 1  Warnings: 0

# flush privileges是为了将权限更新操作刷新到内存中，而不用下次启动时生效。不用这句话的话重启mysql服务也行。
mysql> flush privileges;  
Query OK, 0 rows affected (0.01 sec)

mysql> select user,host from user;
+---------------+-----------+
| user          | host      |
+---------------+-----------+
| root          | %         |
| column_user   | localhost |
| mysql.session | localhost |
| mysql.sys     | localhost |
| server_user   | localhost |
| st_01         | localhost |
+---------------+-----------+
6 rows in set (0.00 sec)

mysql>
```



### 2）保存数据

保存数据，即 将DataFrame对象数据保存至MySQL数据库

```scala
// 将DataFrame对象数据保存至MySQL数据库，保存模式为：如果文件已经存在则忽略
scala> df.write.format("jdbc").option("url","jdbc:mysql://192.188.43.2:3306/company?useSSL=false").option("driver","com.mysql.jdbc.Driver").option("user","ro
ot").option("password","123456").option("dbtable","account").mode("ignore").save()
```



### 3）Java API

```java
/**
 * 通过JDBC从关系型数据库读取数据
 */
public class SparkSQL_JDBC {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("加载JSON文件~~~").setMaster("local[*]");
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);
        jsc.setLogLevel("ERROR");  // 设置日志打印级别
        SparkSession spark = SparkSession
                .builder()
                .config(sparkConf)
                .getOrCreate();
        SQLContext sqlContext = new SQLContext(spark);

        // 读取MySQL数据
        Dataset<Row> df = spark.read()
                .format("jdbc")  
                .option("url","jdbc:mysql://localhost:3306/company")
                .option("driver","com.mysql.jdbc.Driver")
                .option("user","root")
                .option("password","123456")
                .option("dbtable","account")
                .load();

        df.cache();

        // 展示加载的数据
        df.show();

        // 保存 df 到MySQL
        df.write().format("jdbc")
                .option("url","jdbc:mysql://localhost:3306/company")
                .option("driver","com.mysql.jdbc.Driver")
                .option("user","root")
                .option("password","123456")
                .option("dbtable","account2")  // 保存为account2表
                .mode(SaveMode.Append)   // 如果文件已经存在则追加
                .save();
        
        spark.stop();
        jsc.stop();
    }
}
```

结果如下

读取的数据为

```diff
+------+--------+-------+
|acc_no|acc_name|balance|
+------+--------+-------+
|     1|    李三|    200|
|     2|    王五|   1800|
|     3|    王五|   1900|
|    10|    赵六|   3000|
|    20|    马七|   5000|
+------+--------+-------+
```

查看MySQL数据库

```mysql
mysql> use company;
Database changed
mysql> select * from account2;
+--------+----------+---------+
| acc_no | acc_name | balance |
+--------+----------+---------+
|      1 | 李三     |     200 |
|      2 | 王五     |    1800 |
|      3 | 王五     |    1900 |
|     10 | 赵六     |    3000 |
|     20 | 马七     |    5000 |
+--------+----------+---------+
5 rows in set (0.00 sec)

mysql>
```



## 操作Hive数据集

Apache Hive 是 Hadoop 上的 SQL 引擎，Spark SQL编译时可以包含 Hive 支持，也可以不包含。包含 Hive 支持的 Spark SQL 可以支持 Hive 表访问、UDF (用户自定义函数)以及 Hive 查询语言(HiveQL/HQL)等。需要强调的一点是，如果要在 Spark SQL 中包含Hive 的库，并不需要事先安装 Hive。

一般来说，最好还是在编译Spark SQL时引入Hive支持，这样就可以使用这些特性了。如果你下载的是二进制版本的 Spark，它应该已经在编译时添加了 Hive 支持。

若要把 Spark SQL 连接到一个部署好的 Hive 上，你必须把 hive-site.xml 复制到 Spark的配置文件目录中($SPARK_HOME/conf)。

即使没有部署好 Hive，Spark SQL 也可以运行。

 需要注意的是，如果你没有部署好Hive，Spark SQL 会在当前的工作目录中创建出自己的 Hive 元数据仓库，叫作 metastore_db。

此外，如果你尝试使用 HiveQL 中的 CREATE TABLE (并非 CREATE EXTERNAL TABLE)语句来创建表，这些表会被放在你默认的文件系统中的 /user/hive/warehouse 目录中(如果你的 classpath 中有配好的 hdfs-site.xml，默认的文件系统就是 HDFS，否则就是本地文件系统)。

**spark-shell默认是Hive支持的；代码中是默认不支持的，需要手动指定（加一个参数即可）。**

### 1）内嵌的Hive（不推荐使用）

如果使用 Spark 内嵌的 Hive, 则什么都不用做, 直接使用即可.

Hive 的元数据存储在 derby 中, 默认仓库地址:$SPARK_HOME/spark-warehouse

数据准备

在/opt/temp目录下有 ids.txt 文件，内容如下

```
1
2
3
```

操作内嵌Hive

```scala
scala> spark.sql("show tables").show()
+---------+---------+-----------+
|namespace|tableName|isTemporary|
+---------+---------+-----------+
+---------+---------+-----------+

scala> spark.sql("create table test1(id int)")

scala> spark.sql("show tables").show()
+---------+---------+-----------+
|namespace|tableName|isTemporary|
+---------+---------+-----------+
|  default|    test1|      false|
+---------+---------+-----------+
```

向表加载本地数据

```scala
scala> spark.sql("load data local inpath '/opt/temp/ids.txt' into table test1")
val res61: org.apache.spark.sql.DataFrame = []

scala> spark.sql("select * from test1").show()
+---+
| id|
+---+
|  1|
|  2|
|  3|
+---+
```

**在实际使用中, 几乎没有任何人会使用内置的 Hive**

### 2）外部的Hive

如果想连接外部已经部署好的Hive，需要通过以下几个步骤：

-   要把Spark SQL连接到一个已经部署好的Hive时， 就必须把hive-site.xml 拷贝到Spark的配置目录conf下（采用软链接的方式会更好一点）

    ```shell
    ln -s hive安装目录/conf/hive.site.xml spark安装目录/conf/hive.site.xml
    ```

-   Hive采用MySQL数据库存放Hive元数据信息，因此为了能够让Spark访问Hive，就需要把MySQL的驱动copy到jars/目录下

-   如果访问不到hdfs，则需要把core-site.xml和hdfs-site.xml拷贝到conf/目录下（采用软链接的方式会更好一点）

-   重启spark-shell







以下是Java代码实现RDD、DataFrame、Dataset之间的相互转换：

```java
// 创建SparkSession
SparkSession spark = SparkSession.builder()        
	.appName("Java Spark SQL Example")       
    .config("spark.master", "local")       
    .getOrCreate();
    // 创建JavaRDD
    JavaRDD<String> rdd = spark.sparkContext().textFile("data.txt", 1).toJavaRDD();
    // 将JavaRDD转换为DataFrameJavaRDD<Row> rowRDD = rdd.map(line -> RowFactory.create(line.split(",")));
    StructType schema = new StructType(new StructField[]{    
    new StructField("name", DataTypes.StringType, false, Metadata.empty()),
    new StructField("age", DataTypes.IntegerType, false, Metadata.empty())});
    DataFrame df = spark.createDataFrame(rowRDD, schema);
    // 将DataFrame转换为Dataset
    Encoder<Person> personEncoder = Encoders.bean(Person.class);
    Dataset<Person> ds = df.as(personEncoder);
    // 将Dataset转换为DataFrameDataFrame df2 = ds.toDF();
    // 将DataFrame转换为JavaRDDJavaRDD<Row> rowRDD2 = df2.javaRDD();
    JavaRDD<String> rdd2 = rowRDD2.map(row -> row.mkString(","));
```


 -->
