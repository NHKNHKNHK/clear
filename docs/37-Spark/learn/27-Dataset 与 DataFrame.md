# Dataset 与 DataFrame

## DataFrame

### 什么是DataFrame

​	Spark SQL的DataFrame API 允许我们使用 DataFrame 而不用必须去注册临时表或者生成 SQL 表达式（即使用DSL风格处理）。**DataFrame API 既有 transformation（转换）操作也有 action（行动） 操作。**

DataFrame有如下特性：

-   分布式的数据集，并且以列的方式组合的，相当于具有schema的RDD
-   相当于关系型数据库中的表，但是底层有优化
-   提供了一些抽象的操作，如select、filter、aggregation、plot
-   它是由于R语言或者Pandas语言处理小数据集的经验应用到处理分布式大数据集上
-   在1.3版本之前，叫SchemaRDD

## Schema信息

在Spark SQL中，Schema是指描述数据结构的元数据信息，它定义了数据集中每个字段的名称、类型和其他属性。Schema可以以编程方式定义，也可以从数据源中自动推断

在Spark SQL中，可以使用以下方法来定义Schema：

**1）使用编程方式定义Schema**：可以使用`StructType`和`StructField`来手动定义Schema。

`StructType`表示一个结构化的数据类型，而`StructField`表示一个字段的元数据信息。

例如，以下代码定义了一个包含两个字段（name和age）的Schema

```scala
import org.apache.spark.sql.types._

val schema = StructType(
  Seq(
    StructField("name", StringType, nullable = false),
    StructField("age", IntegerType, nullable = true)
  )
)
```

**2）从数据源中自动推断Schema**：当读取数据源时，Spark SQL可以自动推断数据的Schema。

例如，可以使用`spark.read.format("csv").option("header", "true").load("data.csv")`来读取CSV文件，并自动推断出每个字段的名称和类型。

**3）使用DDL语句定义Schema**：可以使用DDL（Data Definition Language）语句来定义Schema。

例如，可以使用`CREATE TABLE`语句来定义表的Schema，或使用`CREATE VIEW`语句来定义视图的Schema。

## Row

在Spark中，`Row`是一种表示数据行的数据结构。它是一个不可变的、有序的数据集合，类似于数据库表中的一行数据。

`Row`对象可以包含不同类型的数据，例如字符串、整数、浮点数等。可以通过索引或字段名来访问`Row`中的数据。

`Row`对象在Spark中广泛用于数据的转换、操作和传递。它可以作为DataFrame和Dataset的行数据类型，也可以作为RDD的元素类型。通过使用`Row`，可以方便地处理和操作结构化的数据。

演示：

创建一个`Row`对象

```scala
import org.apache.spark.sql.Row

val row = Row("John", 25, 180.5)
```

访问Row对象中的数据

```scala
// 通过索引访问Row中的数据：下标获取，从0开始，类似数组下标获取
val name = row(0)
val age = row(1)
val height = row(2)

// 通过索引访问Row中的数据：需要指定数据的数据类型
val name = row.getString(0)
val age = row.getInt(1)
val height = row.getDouble(2)

// 通过字段名访问Row中的数据：通过As转换类型
val name = row.getAs[String]("name")
val age = row.getAs[Int]("age")
val height = row.getAs[Double]("height")
```

## DataFrame的创建

在Spark SQL中 `SparkSession` 是创建DataFrame和执行 SQL 的入口，创建DataFrame有三种方式：

-   通过Spark的数据源进行创建
-   从一个存在的RDD进行转换
-   还可以从Hive Table进行查询返回。

### 1）通过Spark的数据源直接创建DataFrame

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



### 2）从一个存在的RDD进行转换创建DataFrame

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

### **3）从Hive Table进行查询返回创建DataFrame**





## DataFrame API编程

### DSL风格

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



### SQL风格

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



## DataSet

-   DataSet 是Spark 1.6 Alpha 版本中引入的一个新的数据抽象结构（是DataFrame API的一个扩展，是Spark最新的数据抽象，结合了RDD和DataFrame的优点），最终在Spark2.0 版本被定义为 Spark 新特性。
-   它提供了特定域对象的**强类型集合**，也就是在RDD的每行数据中添加了类型约束条件，只有满足约束条件的数据类型才能正常运行。
-   DataSet 结合了RDD 和 DataFrame的优点，并且可以调用封装的方法以并行方式进行转换等操作
    -   与RDD相比：保存了更多的描述信息，概念上等同于关系型数据库中的二维表； 
    -   与DataFrame相比：**保存了类型信息，是强类型的**，提供了编译时类型检查，调用Dataset的方法先会生成逻辑计划，然后被Spark的优化器进行优化，最终生成物理计划，然后提交到集群中运行；
-   **Dataset 和DataFrame拥有完全相同的成员函数**

## Dataset是什么

Dataset是一个**强类型**的特定领域的对象，这种对象可以函数式或者关系操作并行地转换。

**从Spark 2.0开始，DataFrame 与 Dataset 合并**，每个Dataset也有一个被称为一个DataFrame的类型化视图，这种DataFrame是Row类型的Dataset，即Dataset[Row]。

```scala
type DataFrame = Dataset[Row];
```

**Dataset API是DataFrame的扩展，它提供了一种类型安全的，面向对象的编程接口**。它是一个强类型，不可变的对象集合，映射到关系模式。在数据集的核心 API是一个称为编码器的新概念，它负责在JVM对象和表格表示之间进行转换。表格表示使用Spark内部Tungsten二进制格式存储，允许对序列化数据进行操作并提高内存利用率。Spark 1.6支持自动生成各种类型的编码器，包括基本类型（例如String，Integer，Long），Scala样例类和Java Bean。 

针对Dataset数据结构来说，可以简单的从如下四个要点记忆与理解：

-   Dataset = DataFrame + 泛型
-   Dataset = => RDD + Schema + 方便的SQL操作 + 优化
-   Dataset是特殊的DataFrame、DataFrame是特殊的RDD
-   Dataset是一个分布式数据集

Spark 框架从最初的数据结构RDD、到SparkSQL中针对结构化数据封装的数据结构DataFrame， 最终使用Dataset数据集进行封装

所以在实际项目中**建议使用Dataset进行数据封装，数据分析性能和数据存储更加好**

## 对比 DataFrame

Spark在Spark 1.3版本中引入了DataFrame，DataFrame是组织到命名列中的分布式数据集合， 但是有如下几点限制： 

-   编译时类型安全： 
    -   **Dataframe API不支持编译时安全性**，这限制了在结构不知道时操纵数据。 

    -   以下示例在编译期间有效。但是，执行此代码时将出现运行时异常。 

        -   ```scala
            case class Person(name: String, age: Int)
            val dataframe = sqlContext.read.json("people.json")
            dataframe.filter("salary > 10000").show()
            // 运行时异常 throws Execption : cannot resolve 'salary' given input age , name
            ```

-   无法对域对象（丢失域对象）进行操作： 

    -   将域对象转换为DataFrame 后，无法从中重新生成它； 

    -   下面的示例中，一旦我们从personRDD创建personDF，将不会恢复Person类的原始RDD （RDD [Person]）； 

        -   ```scala
            case class Person(name: String, age: Int)
            val personRDD = sc.makeRDD(Seq(Person("A", 10), Person("B", 20)))
            val personDF = sqlContext.createDataframe(personRDD)
            
            // returns RDD[Row], does not returns RDD[Person]
            personDF.rdd
            ```

基于上述的两点，**从Spark 1.6开始出现Dataset，至Spark 2.0中将DataFrame与Dataset合并，其中DataFrame为Dataset特殊类型，类型为Row。**

针对RDD、DataFrame与Dataset三者编程比较来说，**Dataset API无论语法错误和分析错误在编译时都能发现**，然而RDD和DataFrame有的需要在运行时才能发现。

此外RDD与Dataset相比较而言，由于**Dataset数据使用特殊编码，所以在存储数据时更加节省内存**。

## DataSet的创建

### 1）从已存在的RDD中创建DataSet

创建DataSet可以通过SparkSession中的createDataset创建DataSet

```scala
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

### 2）使用样例类序列创建DataSet

```scala
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

### 3）使用基本类型的序列创建DataSet

注意：

​	**在实际使用的时候，很少用到把序列转换成DataSet，更多的是通过RDD来得到DataSet**

```scala
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

## RDD、DF 与 DS转换 

实际项目开发中，常常需要对RDD、DataFrame及Dataset之间相互转换，其中要点就是Schema 约束结构信息。

-   1）RDD 转换 DataFrame 或者 Dataset 
    -   转换 DataFrame 时，定义Schema信息，两种方式（反射、自定义schema、toDF等） 
    -   转换为Dataset时，不仅需要Schema信息，还需要**RDD数据类型为CaseClass类型** 
-   2）Dataset 或 DataFrame 转换 RDD 
    -   由于Dataset 或 DataFrame 底层就是RDD，所以直接**调用rdd函数**即可转换 
    -   dataframe.rdd 或者dataset.rdd 
-   3）DataFrame 与 Dataset 之间转换
    -   由于DataFrame 为 Dataset 特例，所以Dataset直接**调用toDF函数**转换为DataFrame 
    -   当将DataFrame转换为Dataset时，**使用函数as[Type]，指定CaseClass类型**即可。 

注意：

​	RDD与DataFrame或者DataSet进行操作，都需要引入**隐式转换import spark.implicits._**，其中的spark是SparkSession对象的名称

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

### DataSet 转换为 RDD 
	rdd

### DataSet 转换为 DataFrame
	toDF()
	
### DataFrame 转换为 DataSet
	as[ElementType] 即 as[样例类]	
```



## RDD 转换为 DataFrame

​	在IDEA中开发程序时，如果需要RDD与DF或者DS之间互相操作，那么需要引入 import **spark.implicits._（启用隐式转换）**

**注意：**

​	**Scala中的隐射转换在Java中是不存在的**

​	这里的**spark**不是Scala中的包名，而**是创建的SparkSession对象的变量名称**，所以必须先创建SparkSession对象再导入。	

​	这里的spark对象不能使用var声明，因为**Scala只支持val修饰的对象的引入**。

**1）调用rdd对象的 toDF() 方法将rdd转换为了 DataFrame对象**

SparkSQL中提供一个函数：toDF，通过指定列名称，**将**数据类型为**元组的RDD 或 Seq集合 转换为 DataFrame**

```scala
// 将 RDD 或 Seq集合 转换为 DataFrame
def toDF(colNames: String*): DataFrame

// 注意：只有当RDD中数据类型为元组（元组其实就是CaseClass）时，才可以直接调用toDF函数
//		当Seq中数据类型为元组时，也可以调用toDF
```

spark-shell中无需导入，因为spark-shell默认自动完成此操作。

演示：

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

```scala
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.{DataFrame, SparkSession}

/**
 * 隐式调用 toDF 函数，将数据类型为元组的Seq和RDD集合转换为 DataFrame
 */
object SparkSQLToDF {
    def main(args: Array[String]): Unit = {
        // todo 构建SparkSession实例对象，通过建造者模式创建
        val spark: SparkSession = SparkSession.builder()
          .appName("演示使用toDF函数将RDD转换为DataFrame")
          .master("local[3]")
          .getOrCreate()
        // 导入隐式转换函数库
        import spark.implicits._

        // 构建RDD，数据类型为三元组形式
        val usersRDD: RDD[(Int, String, Int)] = spark.sparkContext.parallelize(
            Seq(
                (10001, "zhangsan", 20),
                (10002, "lisi", 29),
                (10003, "wangwu", 25),
                (10004, "zhaoliu", 30),
                (10005, "tianqi", 35),
                (10006, "jerry", 40)
            )
        )
        // todo 调用toDF函数将 RDD 转换为 DataFrame
        val usersDF: DataFrame = usersRDD.toDF("id", "name", "age")
        usersDF.printSchema()
        usersDF.show(10, truncate = false)


        println("========================================================")
        // todo 调用toDF函数将 Seq集合 转换为 DataFrame
        val df: DataFrame = Seq(
            (10001, "zhangsan", 23),
            (10002, "lisi", 22),
            (10003, "wangwu", 23),
            (10004, "zhaoliu", 24)
        ).toDF("id", "name", "age")
        df.printSchema()
        df.show(10, truncate = false)
        
        // todo 应用结束，关闭资源
        spark.stop()
    }
}
```

运行结果：

```diff
root
 |-- id: integer (nullable = false)
 |-- name: string (nullable = true)
 |-- age: integer (nullable = false)
 
+-----+--------+---+
|id   |name    |age|
+-----+--------+---+
|10001|zhangsan|20 |
|10002|lisi    |29 |
|10003|wangwu  |25 |
|10004|zhaoliu |30 |
|10005|tianqi  |35 |
|10006|jerry   |40 |
+-----+--------+---+

========================================================

root
 |-- id: integer (nullable = false)
 |-- name: string (nullable = true)
 |-- age: integer (nullable = false)

+-----+--------+---+
|id   |name    |age|
+-----+--------+---+
|10001|zhangsan|23 |
|10002|lisi    |22 |
|10003|wangwu  |23 |
|10004|zhaoliu |24 |
+-----+--------+---+
```



**2）通过样例类将RDD转换为DataFrame**

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
-   ​	Spark1.3 => DataFrame（它的前身是ShcemaRDD）
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



## **如何理解RDD、DataFrame和Dataset** 

 SparkSQL中常见面试题：如何理解Spark中三种数据结构RDD、DataFrame和Dataset关系？ 

-   1）数据结构RDD： 
    -   **RDD（Resilient Distributed Datasets）叫做弹性分布式数据集**，是Spark中最基本的数据抽象，源码中是一个抽象类，代表一个**不可变、可分区**、里面的元素可**并行**计算的集合。 
    -   **编译时类型安全**，但是无论是集群间的通信，还是IO操作都需要对对象的结构和数据进行序列化和反序列化，还**存在较大的GC的性能开销**，会频繁的创建和销毁对象。 

-   2）数据结构DataFrame：  
-   与RDD类似，**DataFrame是一个分布式数据容器**，不过它更像数据库中的二维表格，除了数据之外，还记录这数据的结构信息（即schema）。 
    -   DataFrame也是**懒执行**的，**性能上要比RDD高**（主要因为执行计划得到了优化）。 
    
-   由于DataFrame每一行的数据结构一样，且存在schema中，Spark通过schema就能读懂数据，因此在通信和IO时只需要序列化和反序列化数据，而结构部分不用。 
    -   Spark能够以二进制的形式序列化数据到JVM堆以外（off-heap：非堆）的内存，这些内存直接受操作系统管理，也就不再受JVM的限制和GC的困扰了。但是**DataFrame不是类型安全的**
    
-   3）数据结构Dataset： 
    -   Dataset是DataFrame API的一个扩展，是Spark最新的数据抽象，结合了RDD和DataFrame的优点。 
    -   DataFrame=Dataset[Row]（Row表示表结构信息的类型），DataFrame只知道字段，但是不知道字段类型，而**Dataset是强类型的，不仅仅知道字段，而且知道字段类型**。 
    -   **样例类CaseClass被用来在Dataset中定义数据的结构信息**，样例类中的每个属性名称直接对应到Dataset中的字段名称。 
    -   **Dataset具有类型安全检查**，也具有DataFrame的查询优化特性，还支持编解码器，当需要访问非堆上的数据时可以避免反序列化整个对象，提高了效率

RDD、DataFrame和DataSet之间的转换如下，假设有个样例类：case class Emp(name: String)，相互转换

```scala
RDD转换到DataFrame：rdd.toDF(“name”)

RDD转换到Dataset：rdd.map(x => Emp(x)).toDS

DataFrame转换到Dataset：df.as[Emp]

DataFrame转换到RDD：df.rdd

Dataset转换到DataFrame：ds.toDF

Dataset转换到RDD：ds.rdd
```

注意：

​	**RDD与DataFrame或者DataSet进行操作，都需要引入隐式转换import spark.implicits._**，其中的spark是SparkSession对象的名称



# Java、Scala API实现 RDD 转换为 DataFrame

实际项目开发中，往往需要将RDD数据集转换为DataFrame，本质上就是给RDD加上Schema信息，官方提供两种方式：**类型推断**和**自定义Schema**。

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

-   **在java中，`DataFrame`其实就是 `Dataset<Row>`，在后续的代码中可以体现出来**
-   在Scala中，`DataFrame` 是 `Dataset`的特例，`DataFrame=Dataset[Row]`

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

## DataFrame基本使用

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

## RDD 和 DataFrame互相装换

Spark官方提供了两种方式实现**从 RDD 转换得到 DataFrame**

-   第一种方式是利用**反射机制**来**推断包含特定类型对象的Schema**，这种方式适合对已知数据结构的RDD转换。
-   第二种方式是通过**编程接口构造一个 Schema**，并将其应用在已知的RDD数据中。

### 反射机制推断 Schema（元数据信息）

由于计算机无法像人一样直观感受字段的实际含义，因此**需要通过反射机制来推断特定类型对象的 Schema信息**

#### Java代码

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


// 这里必须实现序列化：因为需要在网络中传输
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

#### Scala代码

当RDD中数据类型CaseClass样例类时，通过反射Reflecttion获取属性名称和类型，构建Schema，应用到RDD数据集，将其转换为DataFrame。 

1）定义CaseClass样例类，封装student学生信息

```scala
/**
 * 封装学习信息
 * @param id 学生id
 * @param name 姓名
 * @param score 成绩
 */
case class Student(id: Int,
                   name: String,
                   score: Double)
```

2）SparkContext读取学生数据封装到RDD中，转换数据类型

```scala
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.{DataFrame, SparkSession}

/**
 * 采用反射机制将 RDD 转换为 DataFrame/Dataset
 */
object SparkSQLRDDtoDataFrame {
    def main(args: Array[String]): Unit = {
        // todo 构建SparkSession实例对象，通过建造者模式创建
        val spark: SparkSession = SparkSession.builder()
          .appName("演示使用toDF函数将RDD转换为DataFrame")
          .master("local[3]")
          .getOrCreate()
        import spark.implicits._

        // 读取数据
        val inputRDD: RDD[String] = spark.sparkContext.textFile("/opt/temp/spark/person.txt", 2)
        // 转换数据
        val studentRDD: RDD[Student] = inputRDD
          .filter(line => line != null && line.trim.split(" ").length == 3)
          .mapPartitions { iter =>
              iter.map { line =>
                  // 拆箱操作，python中常用
                  val Array(id, name, score) = line.trim.split(" ")
                  // 返回Student实例对象
                  Student(id.toInt, name, score.toDouble)
              }
          }
        // todo 将 RDD 转换为 DataFrame/Dataset
        val studentDF: DataFrame = studentRDD.toDF()
        studentDF.printSchema()
        studentDF.show(10)

        // 应用结束，关闭资源
        spark.stop()
    }
}
```

注意：

​	此种方式要求RDD数据类型必须为CaseClass，转换的DataFrame中字段名称就是CaseClass中属性名称。

运行结果：

```
root
 |-- id: integer (nullable = false)
 |-- name: string (nullable = true)
 |-- score: double (nullable = false)
 
 +---+--------+-----+
| id|    name|score|
+---+--------+-----+
|  1|zhangsan| 90.0|
|  2|   lishi|100.0|
|  3|   wanwu| 20.0|
+---+--------+-----+
```



### 编程方式动态定义 Schema

**当case类(scala中的说法)不能提前定义时**，就需要采用编程方式定义 Schema信息，定义 DataFrame主要包含3个步骤：

-   1）创建一个Row对象结果的RDD（即将数据加载成 **`JavaRDD<Row>`** 类型返回）
-   2）基于StructType类型创建Schema（先通过 DataTypes.createStructType创建 **StructType**，跟根据DataTypes.createStructField 创建 **StructField**）
-   3）通过SparkSession（**实际上是SQLContext对象提供的方法，因为SparkSession就是对SQLContext的封装**） 提供的 createDataFrame() 方法来拼接Schema

#### Java代码

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

#### Scala代码

依据RDD中数据自定义Schema，类型为StructType，每个字段的约束使用StructField定义，具体步骤如下： 

-   1）RDD中数据类型为Row：RDD[Row]
-   2）针对Row中数据定义Schema：StructType
-   3）使用SparkSession中方法将定义的Schema应用到RDD[Row]上

```scala
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.types.{DoubleType, IntegerType, StringType, StructField, StructType}
import org.apache.spark.sql.{DataFrame, Row, SparkSession}

/**
 * 编程方式自定义Schema转换 RDD 为 DataFrame
 */
object SparkSQLRDDtoDataFrame2 {
    def main(args: Array[String]): Unit = {
        // todo 构建SparkSession实例对象，通过建造者模式创建
        val spark: SparkSession = SparkSession.builder()
          .appName("演示使用toDF函数将RDD转换为DataFrame")
          .master("local[3]")
          .getOrCreate()
        import spark.implicits._

        // 读取数据
        val inputRDD: RDD[String] = spark.sparkContext.textFile("/opt/temp/spark/person.txt", 2)
        // todo 转换数据得到 RDD[Row]
        val rowRDD: RDD[Row] = inputRDD
          .filter(line => line != null && line.trim.split(" ").length == 3)
          .mapPartitions { iter =>
              iter.map { line =>
                  // 拆箱操作，python中常用
                  val Array(id, name, score) = line.trim.split(" ")
                  // 返回Student实例对象
                  Row(id.toInt, name, score.toDouble)
              }
          }
        // todo 定义Schema
        val schema: StructType = StructType(
            Array(
                StructField("id", IntegerType, nullable = true),
                StructField("name", StringType, nullable = true),
                StructField("score", DoubleType, nullable = true)
            ))
        // todo 应用函数createDataFrame，将 RDD 转换为 DataFrame
        val dataFrame:DataFrame = spark.createDataFrame(rowRDD, schema)

        dataFrame.printSchema()
        dataFrame.show(10)

        // todo 应用结束，关闭资源
        spark.stop()
    }
}
```

说明：

​	此种方式可以更加体会到DataFrame = RDD[Row] + Schema组成，在实际项目开发中灵活的选择方式将RDD转换为DataFrame

运行结果：

```
root
 |-- id: integer (nullable = true)
 |-- name: string (nullable = true)
 |-- score: double (nullable = true)
 
 +---+--------+-----+
| id|    name|score|
+---+--------+-----+
|  1|zhangsan| 90.0|
|  2|   lishi|100.0|
|  3|   wanwu| 20.0|
+---+--------+-----+
```


