# 向Spark传递函数/方法

Spark的大部分转换算子和一部分的行动算子，都需要依赖用户传递的函数来计算。

## python

在python中，我们有三种方式将函数传递给Spark。

传递较短的函数，我们可以通过Lambda表达式。

除了lambda表达式，我们还可以定义传递顶层函数或是定义的局部函数。

### **在Python中传递函数**

```python
# Lambda表达式传递函数
word = rdd.filter(lambda s: "error" in s)


# 传递函数
def containsError(s):
    return "error" in s
word = rdd.filter(containsError)
```

传递函数时需要小心，python会不经意间把函数所在的对象也序列化传出去。

### **传递一个带字段引用的函数（请不要怎么做）**

```python
class SearchFunctions(object):
    def __init__(self, query):
        self.query = query

    def isMatch(self, s):
        return self.query in s
    
    def getMatchesFunctionReference(self,rdd):
        return rdd.filter(self, isMatch)

    def getMatchesMeemberReference(self, rdd):
        return rdd.filter(lambda x:self.query in x)
```

替代方案：把所需的字段从对象中拿出来放入到局部变量中，然后传递局部变量

例如：

```python
# 传递不带字段引用的python函数
class WordFunctions(object):
    ...
    
    def getMatchesNoReference(self,rdd):
        # 安全：只把需要的字段提取到局部变量中
        query = self.query
        return rdd.filter(lambda x: query in x)
```

## Scala

在Scala中，我们可以把定义的内联函数、方法的引用或静态方法（Scala没有`static`关键字，定义在伴生对象中的方法可以理解为静态方法）传递给Spark

**Scala中的函数传递方式**

```scala
class SearchFunctions(val query: String) {
  def isMatch(s: String): Boolean = {
    s.contains(query)
  }

  def getMatchesFunctionReference(rdd: RDD[String]): RDD[String] = {
    rdd.map(isMatch)
  }

  def getMatchesFieldReference(rdd: RDD[String]) = {
    rdd.map(x => x.split(query))
  }

  def getMatchesNoReference(rdd: RDD[String]) = {
    val query_ = this.query
    rdd.map(x => x.split(query))
  }
}
```

说明：

​	如果在Scala中出现了 `NotSerializableException`，通常的问题在于我们传递了一个不可序列化的类中的函数或字段

记住：

​	传递局部可序列化变量或顶级对象中的函数始终是最安全的



## Java

在Java中，函数(方法)需要实现了Spark的`org.apache.spark.api.java.function`包中任一接口的对象来传递。

下面是一些常用的函数接口

```java
package org.apache.spark.api.java.function;

import java.io.Serializable;

@FunctionalInterface
public interface Function<T1, R> extends Serializable {
  R call(T1 v1) throws Exception;
}

@FunctionalInterface
public interface Function2<T1, T2, R> extends Serializable {
  R call(T1 v1, T2 v2) throws Exception;
}

@FunctionalInterface
public interface FlatMapFunction<T, R> extends Serializable {
  Iterator<R> call(T t) throws Exception;
}
```

Java中常见的向Spark传递函数的方式：

### **使用匿名内部类进行函数传递**

```java
// 向Spark中传递一个匿名内部类，本质上就是想要传递一个函数
// 但是这样写，代码比较笨拙，建议采用Lambda
JavaRDD<String> errors = lines.filter(new Function<String, Boolean>() {
    @Override
    public Boolean call(String s) throws Exception {
        return "error".contains(s);
    }
});
```

### **使用具名类进行函数传递**

```java
// 向Spark传递一个类，本质上就是想传递类中的一个方法
// 笨拙的方式
class ContainsError implements Function<String, Boolean> {
    @Override
    public Boolean call(String s) throws Exception {
        return "error".contains(s);
    }
}

JavaRDD<String> errors = lines.filter(new ContainsError());
```

### **带参数的Java函数类**

```java
class Contains implements Function<String,Boolean>{
    private String query;

    public Contains(String query) {
        this.query = query;
    }

    @Override
    public Boolean call(String x) throws Exception {
        return x.contains("error");
    }
}

JavaRDD<String> errors = lines.filter(new Contains("error"));
```

### **Java8中使用Lambda表达式进行函数传递**

```java
// 使用Lambda表达式向Spark传递一个函数
// 优雅，代码可读性高
JavaRDD<String> errors = lines.filter((s) -> "error".contains(s));
```

说明：

​	匿名内部类和Lambda表达式都可以引用方法中封装的任意 `final` 变量，因此可以像在python、Scala一样把这写变量传递给Spark





