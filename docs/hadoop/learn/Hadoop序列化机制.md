# 1 Hadoop序列化机制

序列化(serialization)是将在内存中的**结构化对象**转换为**字节序列**以便于进行网络传输或写入持久存储的过程。

反序列化(Deserialization)是将字节续写转为一系列内存中的结构化对象的过程，重新创建该对象。

## 1.1 Java序列化

-   在Java中，万物皆对象。在开发程序中，经常会遇到以下场景：

    ​	跨进程、跨网络传递对象

    ​	将对象数据持久化存储

-   这就需要又一种可以在两端传输数据的协议

-   Java序列化就是为了解决这个问题而产生

Java对象序列化机制，就是**把对象表示成一个二进制的字节数组**，里面包含了对象的数据，对象的类型，对象内部的数据的类型信息等等。通过保存或者转移这些二进制数组**达到持久化、传递的目的**。

要实现序列化，需要实现java.io.**Serializable**接口。反序列化和序列化相反的过程，就是把二进制数组转为对象的过程。

Serializable接口如下：

```java
package java.io;

public interface Serializable {
}
```

## 1.2 Hadoop序列化

**Hadoop**序列化没有采用Java的序列化机制，而是**实现了自己的序列化机制`Writable`。**

因为java序列化机制比较臃肿，重量级，是一种不断的创建对象的机制，并且会额外附带很多信息（校验、继承关系系统等），不便在网络中进行高效传输

**Hadoop序列化的特点：**

-   紧凑：高效使用存储空间
-   快速：读写数据的额外开销小
-   互操作：支持多语言的互操作

Hadoop通过**Writable接口实现序列化机制**，接口提供了两个方法**write**和**readToFields**

-   ​	write叫序列化方法，用于把对象指定的字段写出去
-   ​	readTofields叫反序列化，用于从字节流中读取字段重构对象

```java
public interface Writable {
    void write(DataOutput var1) throws IOException;

    void readFields(DataInput var1) throws IOException;
}
```

在**Hadoop序列化机制**中，**用户可以复用对象**，这样就减少了java对象的分配和回收，提高了应用效率。

**Hadoop没有提供对象比较功能**，所以和Java中的Comparable接口合并，**提供**了一个**接口WritableComparable**。

WritableComparable接口可用于用户自定义对象的比较规则。

WritableComparable接口如下：

```Java
@Public
@Stable
public interface WritableComparable<T> extends Writable, Comparable<T> {
}
```

## 1.3 Hadoop封装的数据类型

Hadoop提供了如下内容的数据类型，**这些数据类型都实现了WritableComparable接口**，以便用这些类型定义的数据可以被序列化进行网络传输和文件存储，以及进行大小比较。

| Hadoop数据类型   | Java数据类型 |
| ---------------- | ------------ |
| BooleanWritable  | boolean      |
| ByteWritable     | byte         |
| IntWritable      | int          |
| FloatWritable    | float        |
| LongWritable     | long         |
| DoubleWritable   | double       |
| **Text**         | String       |
| MapWritable      | map          |
| ArrayWritable    | array        |
| **NullWritable** | null         |

## 1.4 自定义bean对象实现序列化接口（Writable）

在开发中，常用的基本序列化类型不能满足要求时，需要自定义对象并实现序列化接口（如：在Hadoop框架内部传递一个bean对象）

**自定义bean对象序列化步骤：**

1）必须实现Writable接口

2）反序列化时，需要反射调用空参构造函数，所以必须有空参构造

3）重写序列化方法	

4）重写反序列化方法

**5）注意反序列化的顺序要与序列化一致**

6）要想把结果显示在文件中，需要重写toString()，可用"\t"分开，方便后续用。

7）如果需要将自定义的bean放在key中传输，则还需要实现Comparable接口，因为Shuffle过程需要对key进行排序，而Hadoop封装的数据类型实现了Comparable接口，所有我们的bean也需要实现Comparable接口才能进行排序。

演示：

```java
import org.apache.hadoop.io.WritableComparable;
import org.jetbrains.annotations.NotNull;

import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;

/**
 * 用于记录累计确诊病例和累计死亡病例的Bean
 * 注：自定义对象作为数据类型在MapReduce中传递，记得要实现Hadoop的序列化机制
 */
public class CovidCountBean implements WritableComparable<CovidCountBean> {
    private long cases;  // 累计确诊病例
    private long deaths;  // 累计死亡病例

    public CovidCountBean() {
    }

    public CovidCountBean(long cases, long deaths) {
        this.cases = cases;
        this.deaths = deaths;
    }

    // 自己封装的set方法，用于给对象属性赋值
    public void set(long cases, long deaths) {
        this.cases = cases;
        this.deaths = deaths;
    }

    public long getCases() {
        return cases;
    }

    public void setCases(long cases) {
        this.cases = cases;
    }

    public long getDeaths() {
        return deaths;
    }

    public void setDeaths(long deaths) {
        this.deaths = deaths;
    }

    @Override
    public String toString() {
        return cases + "\t" + deaths;
    }

    /**
     * 序列化
     */
    @Override
    public void write(DataOutput dataOutput) throws IOException {
        dataOutput.writeLong(cases);
        dataOutput.writeLong(deaths);
    }

    /**
     * 反序列化
     * todo 注意反序列化顺序要与序列化一致
     */
    @Override
    public void readFields(DataInput dataInput) throws IOException {
        this.cases = dataInput.readLong();
        this.deaths = dataInput.readLong();
    }

    /**
     * 自定义对象的排序方法
     * 按照确诊数 倒序排序
     * todo > 强制返回-1， < 强制返回1
     */
    @Override
    public int compareTo(@NotNull CovidCountBean o) {
        long thisValue = this.cases;
        long thatValue = o.cases;
        return thisValue > thatValue ? -1 : (thisValue == thatValue ? 0 : 1);
    }
}
```

