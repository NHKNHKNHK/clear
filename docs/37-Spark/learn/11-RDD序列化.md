# RDD序列化

在实际开发中我们往往需要自己定义一些对于RDD的操作，那么此时需要注意的是，初始化工作是在Driver端进行的，而实际运行程序是在Executor端进行的，这就涉及到了跨进程通信，是需要序列化的。

## 问题导出

foreach算子演示

```java
public class SparkRDD_foreach2 {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("foreach").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1,2,3,4));
        sparkContext.setLogLevel("ERROR");

        User user = new User();  // RDD算子外部的操作，由Driver端执行

        RDD.foreach(new VoidFunction<Integer>() {  // RDD算子，由Executor端执行
            @Override
            public void call(Integer integer) throws Exception {
                // Task not serializable
                // java.io.NotSerializableException: com.clear.rdd.action.User

                // 使用了外部的user.age，因此需要网络进行传输过来
                System.out.println(integer+ user.age);  
            }
        });
    }
}


class User{
    int age=30;
}
```

### 改进

```java
public class SparkRDD_foreach2 {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setAppName("foreach").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        JavaRDD<Integer> RDD = sparkContext.parallelize(Arrays.asList(1,2,3,4));
        sparkContext.setLogLevel("ERROR");

        User user = new User();  // RDD算子外部的操作，由Driver端执行
        // RDD算子中传递的函数是会包含闭包操作，那么就会进行检测功能
        RDD.foreach(new VoidFunction<Integer>() {  // RDD算子，由Executor端执行
            @Override
            public void call(Integer integer) throws Exception {
                // Task not serializable
                // java.io.NotSerializableException: com.clear.rdd.action.User

                // 使用了外部的user.age，因此需要网络进行传输过来
                
                System.out.println(integer+ user.age);
            }
        });
    }
}


// 因为需要在网络中传输，所有User类需要实现Serializable接口
// 在scala中，样例类(在class 前面加上 case)在编译时，会自动混入序列化特质（实现可序列化接口）
class User implements Serializable {
    int age=30;
}
```

### 1）闭包检查

​	从计算的角度, **算子以外的代码都是在Driver端执行, 算子里面的代码都是在Executor端执行**。那么在scala的函数式编程中，就会导致**算子内经常会用到算子外的数据**，这样就形成了闭包的效果，如果使用的算子外的数据无法序列化，就意味着无法传值给Executor端执行，就会发生错误，所以需要在执行任务计算前，检测闭包内的对象是否可以进行序列化，这个操作我们称之为**闭包检测**。**Scala2.12版本后闭包编译方式发生了改变**



### 2）序列化方法和属性

​	**从计算的角度, 算子以外的代码都是在Driver端执行, 算子里面的代码都是在Executor端执行**，代码如下

```java
public class SparkRDD_Serializable {
    public static void main(String[] args) {
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("序列化");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        JavaRDD<String> RDD = sparkContext.parallelize(Arrays.asList("hello world", "hello spark","nhk"));

        // 查询有 h 的rdd
        Search search = new Search("h");
        // 方法传递，打印SparkException: Task not serializable
       // System.out.println(search.getMatch1(RDD).collect());
        // 属性传递，打印SparkException: Task not serializable
        System.out.println(search.getMatch2(RDD).collect());
        sparkContext.stop();
    }

}

// 查询对象
// 在Scala中，类构造参数其实是类的属性，构造参数需要进行闭包检查，其实就等同于类进行闭包检测
// 若未实现Serializable，则报错如下
// SparkException: Task not serializable
// object not serializable (class: com.clear.rdd.serial.Search, value: com.clear.rdd.serial.Search@2ab2710)
class Search implements Serializable {  // 实现序列化接口
    private String query;

    public Search(String query) {
        this.query = query;
    }

    public Boolean isMatch(String s) {
        return s.contains(query);
    }

    // 方法序列化案例
    public JavaRDD<String> getMatch1(JavaRDD<String> rdd) {
        return rdd.filter(this::isMatch);
    }

    // 属性序列化案例
    public JavaRDD<String> getMatch2(JavaRDD<String> rdd) {
        return rdd.filter(x -> x.contains(query));
    }
}
```


### 3）Kryo序列化框架

​Java的序列化能够序列化任何的类。但是**比较重**（字节多），序列化后，对象的提交也比较大。

Spark出于性能的考虑，**Spark2.0开始支持另外一种Kryo序列化机制。Kryo速度是Serializable的10倍**。

当RDD在Shuffle数据的时候，简单数据类型、数组和字符串类型已经在Spark内部使用Kryo来序列化。

​Kryo 是一个快速、高效的 Java 序列化框架，适用于大规模数据的序列化和反序列化操作。**在 Spark 中，可以使用 Kryo 替代 Java 自带的序列化框架，提高性能**。

:::warning
即使使用Kryo序列化，也要实现`Serializable`接口。
:::

```java
// 首先，需要在 SparkConf 中启用 Kryo 序列化器
// 用set方法替换默认的序列化机制
public SparkConf set(final String key, final String value)
// set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
    
// 使用 SparkConf对象的 registerKryoClasses 方法注册需要使用 Kryo 序列化的自定义类
public SparkConf registerKryoClasses(final Class<?>[] classes)
// registerKryoClasses(new Class[] { MyClass.class })
```

演示

```java
public class SparkRDD_serializable_Kryo {
    public static void main(String[] args) throws ClassNotFoundException {
        SparkConf sparkConf = new SparkConf()
                .setAppName("serializable_Kryo")
                .setMaster("local[*]")
                // 替换默认的序列化机制，启用 Kryo 序列化器
                .set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
                // 注册需要使用 Kryo 序列化的自定义类
                // 因为Spark需要知道哪些类需要使用 Kryo 进行序列化。如果需要序列化多个类，可以将它们一起注册。
                .registerKryoClasses(new Class[]{MyClass.class});
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        JavaRDD<MyClass> rdd = sparkContext.parallelize(Arrays.asList(
                new MyClass(1, "foo"),
                new MyClass(2, "bar"),
                new MyClass(3, "baz")));

        List<MyClass> collect = rdd.collect();
        System.out.println(collect);
    }
}

// 定义一个需要序列化的类 MyClass
class MyClass implements Serializable {
    private int value;
    private String text;

    public MyClass(int value, String text) {
        this.value = value;
        this.text = text;
    }

    public int getValue() {
        return value;
    }

    public String getText() {
        return text;
    }
}
```

结果

因为，MyClass类没有实现toString方法

```txt
[com.clear.rdd.serial.MyClass@290aeb20, com.clear.rdd.serial.MyClass@73ad4ecc, com.clear.rdd.serial.MyClass@69da0b12]
```
