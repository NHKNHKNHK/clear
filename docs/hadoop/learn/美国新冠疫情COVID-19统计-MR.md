# 美国新冠疫情COVID-19统计

## 1 需求说明

现有美国2021-1-28号，每个州各个县county的新冠疫情累计案例信息，包括确诊病例和死亡病例等

数据格式如下所示：

```
2021-01-28,Juneau City and Borough,Alaska,02110,1108,3
2021-01-28,Kenai Peninsula Borough,Alaska,02122,3866,18
2021-01-28,Ketchikan Gateway Borough,Alaska,02130,272,1
2021-01-28,Kodiak Island Borough,Alaska,02150,1021,5
2021-01-28,Kusilvak Census Area,Alaska,02158,1099,3
2021-01-28,Lake and Peninsula Borough,Alaska,02164,5,0
2021-01-28,Matanuska-Susitna Borough,Alaska,02170,7406,27
2021-01-28,Nome Census Area,Alaska,02180,307,0
2021-01-28,North Slope Borough,Alaska,02185,973,3
2021-01-28,Northwest Arctic Borough,Alaska,02188,567,1
2021-01-28,Petersburg Borough,Alaska,02195,43,0
...
```

​	字段含义如下：date（日期）,county（县）,state（州）,fips（县编码code）,cases（累计确诊病例）,deaths（累计死亡病例）。

需求：

​	使用MapReduce对疫情数据进行各种分析统计。

意义：

学会自定义MapReduce各个组件。包括自定义对象、序列化、排序、分区、分组。

-    MapReduce自定义对象序列化
-   MapReduce自定义排序
-   MapReduce自定义分区
-   MapReduce自定义分组
-   MapReduce自定义分组扩展：TOPN



## 2 环境准备

**pom.xml**

```xml
<dependencies>
    <dependency>
        <groupId>org.apache.hadoop</groupId>
        <artifactId>hadoop-common</artifactId>
        <version>3.2.2</version>
    </dependency>
    
    <dependency>
        <groupId>org.apache.hadoop</groupId>
        <artifactId>hadoop-client</artifactId>
        <version>3.2.2</version>
    </dependency>
    <!-- HDFS-->
    <dependency>
        <groupId>org.apache.hadoop</groupId>
        <artifactId>hadoop-hdfs</artifactId>
        <version>3.2.2</version>
    </dependency>

    <!-- mapreduce-->
    <dependency>
        <groupId>org.apache.hadoop</groupId>
        <artifactId>hadoop-mapreduce-client-core</artifactId>
        <version>3.2.2</version>
    </dependency>
</dependencies>


<build>
    <plugins>
        <!-- windows 入口配置-->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-jar-plugin</artifactId>
            <version>2.4</version>
            <configuration>
                <archive>
                    <manifest>
                        <!-- mainClass标签填写主程序入口 -->
                        <!-- 后续需要根据不同的需求进行修改 -->
                     <mainClass>com.clear.mapreduce.covid.sum.CovidSumDriver</mainClass>
                        <addClasspath>true</addClasspath>
                        <classpathPrefix>lib/</classpathPrefix>
                    </manifest>
                </archive>
                <classesDirectory>
                </classesDirectory>
            </configuration>
        </plugin>

        <!-- 中文乱码问题 -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.3</version>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
                <encoding>utf-8</encoding>
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



## 3 需求一：统计各个州确诊病例和死亡病例

需求：

​	统计美国2021-1-28，各个州state累计确诊病例数、累计死亡死亡病例数。

思路：

-   自定义一个对象**CovidCountBean**，用于**封装每个州的确诊病例数和死亡病例数**。
    -   注意：需要实现hadoop的序列化机制（因为对象需要在MR中进行传递）。
    -   如果对象作为key，则还需要实现Compareable接口（这个需求中我们将对象作为value，因此不需要）
-   **以州 state 作为 map 阶段输出的key, 以CovidCountBean作为value**，这样经过MapReduce的默认排序分组规则，属于同一个州的数据就会变成一组进行reduce处理，进行累加即可得出每个州累计确诊病例和死亡数。

### **自定义的JavaBean—— CovidCountBean**

自定义bean对象CovidCountBean实现序列化接口（Writable）

```java
package com.clear.mapreduce.covid.beans;

import org.apache.hadoop.io.Writable;
import org.jetbrains.annotations.NotNull;

import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;


/**
 * 用于记录累计确诊病例和累计死亡病例的Bean
 * 注：自定义对象作为数据类型在MapReduce中传递，记得要实现Hadoop的序列化机制
 */
public class CovidCountBean implements Writable { { // 实现Hadoop序列化机制
    private long cases;  // 累计确诊病例数
    private long deaths;  // 累计死亡病例数

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
     * 序列化：可以控制将哪些字段写出去
     */
    @Override
    public void write(DataOutput dataOutput) throws IOException {
        dataOutput.writeLong(cases);
        dataOutput.writeLong(deaths);
    }

    /**
     * 反序列化：可以控制读取哪些字段
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

### Mapper类

```java
package com.clear.mapreduce.covid.sum;


import com.clear.mapreduce.covid.beans.CovidCountBean;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;

public class CovidSumMapper extends Mapper<LongWritable, Text, Text, CovidCountBean> {  // <输入k:偏移量,输入v:内容,输出k:州,输出v:CovidCountBean>
    Text outKey = new Text();
    CovidCountBean outValue = new CovidCountBean();

    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        // 读取一行数据，进行分割
        String[] fields = value.toString().split(",");

        // 将提取到的数据（州  确诊数 死亡数）赋给k-v
        outKey.set(fields[2]);
        //outValue.set(Long.parseLong(fields[4]), Long.parseLong(fields[5]));
        // fixme 因为疫情数据中，美国有些县没有编码，导致数据缺失一个字段 程序运行会报错ArrayIndexOutOfBoundsException
        // 所以需要进行倒序索引
        outValue.set(Long.parseLong(fields[fields.length-2]), Long.parseLong(fields[fields.length-1]));

        context.write(outKey, outValue);
    }
}
```

### Reduce类

```java
package com.clear.mapreduce.covid.sum;

import com.clear.mapreduce.covid.beans.CovidCountBean;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;


import java.io.IOException;

/**
 * 统计美国疫情 各个州的 总确诊数 总死亡数
 */
public class CovidSumReducer extends Reducer<Text, CovidCountBean, Text, CovidCountBean> {  // <输入k:州,输入v:CovidCountBean,输出k:州,输出v:CovidCountBean,>
    CovidCountBean outValue = new CovidCountBean();

    @Override
    protected void reduce(Text key, Iterable<CovidCountBean> values, Context context) throws IOException, InterruptedException {
        // 统计变量：用于记录各个州的 总确诊数 总死亡数
        long totalCases = 0;
        long totalDeaths = 0;

        // 遍历该州的各个县的数据
        for (CovidCountBean value : values) {   // values参数实现了Iterable接口，可以使用增强for
            totalCases += value.getCases();
            totalDeaths += value.getDeaths();
        }
        // 赋值：将统计结果封装到CovidCountBean，以便在MR中传递
        outValue.set(totalCases, totalDeaths);
        // 输出结果
        context.write(key,outValue);
    }
}
```

### 程序驱动类

```java
package com.clear.mapreduce.covid.sum;

import com.clear.mapreduce.covid.beans.CovidCountBean;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.Text;

import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.IOException;

public class CovidSumDriver {
    public static void main(String[] args) throws IOException, ClassNotFoundException, InterruptedException {
        // 配置文件对象
        Configuration conf = new Configuration();
        // 创建作业实例
        Job job = Job.getInstance(conf, CovidSumDriver.class.getSimpleName());
        // 创建mr程序运行主类
        job.setJarByClass(CovidSumDriver.class);

        // 设置本次mr程序的 mapper类  reducer类
        job.setMapperClass(CovidSumMapper.class);
        job.setReducerClass(CovidSumReducer.class);

        // 设置mapper阶段输出kv类型
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(CovidCountBean.class);
        // 设置reducer阶段输出kv类型
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(CovidCountBean.class);

        // 配置本次作业的输入数据路径 和输出数据路径
        Path input = new Path(args[0]);
        Path output = new Path(args[1]);
        FileInputFormat.addInputPath(job, input);
        FileOutputFormat.setOutputPath(job, output);

        // 判断输出路径是否存在，存在则删除（不删除会报错）
        FileSystem fs = FileSystem.get(conf);
        if(fs.exists(output)){
            fs.delete(output, true);
        }
        // 提交作业
        int status = job.waitForCompletion(true)? 0:1;
        System.exit(status);
    }
}
```

### 代码执行及结果

数据准备

```shell
[nhk@kk01 covid]$ pwd
/opt/data/covid
[nhk@kk01 covid]$ ll
total 188
-rw-r--r--. 1 nhk nhk  44242 Jul  8 15:47 mapreduce-1.0.jar


# 上传至Hadoop集群
[nhk@kk01 covid]$ hadoop fs -mkdir -p /opt/data/covid
[nhk@kk01 covid]$ hadoop fs -put us-covid19-counties.dat /opt/data/covid/
[nhk@kk01 covid]$ hadoop fs -ls /opt/data/covid
Found 1 items
-rw-r--r--   3 nhk supergroup     136795 2023-07-08 19:50 /opt/data/covid/us-covid19-counties.dat
```

将模块打成jar包，上传至Linux服务器

```shell
[nhk@kk01 covid]$ pwd
/opt/data/covid
[nhk@kk01 covid]$ ll
total 188
-rw-r--r--. 1 nhk nhk  44252 Jul  8 20:01 mapreduce-1.0.jar
-rw-r--r--. 1 nhk nhk 136795 Feb 20  2021 us-covid19-counties.dat
```

执行任务

```shell
[nhk@kk01 covid]$ hadoop jar /opt/data/covid/mapreduce-1.0.jar  /opt/data/covid /opt/data/covidout
```

查看结果

```java
[nhk@kk01 covid]$ hadoop fs -ls /opt/data/covidout/part-r-00000
-rw-r--r--   3 nhk supergroup       1201 2023-07-08 20:01 /opt/data/covidout/part-r-00000
[nhk@kk01 covid]$ hadoop fs -head /opt/data/covidout/part-r-00000
2023-07-08 20:09:41,582 INFO sasl.SaslDataTransferClient: SASL encryption trust check: localHostTrusted = false, remoteHostTrusted = false
Alabama	452734	7340
Alaska	53524	253
Arizona	745976	12861
Arkansas	290856	4784
California	3272207	39521
Colorado	394668	5670
Connecticut	248765	7020
Delaware	76495	1075
District of Columbia	36132	902
Florida	1687586	26034
Georgia	869165	13404
Guam	8541	130
Hawaii	25460	403
Idaho	161863	1724
Illinois	1119004	21074
Indiana	623094	9879
Iowa	317127	4532
```



## 4 需求二：统计各州病例数倒序排序

说明：

​	为了简单，我们可以将需求一，的结果直接应用于需求二作为输入

需求：

​	将美国2021-01-28，每个州state的确诊案例数进行**倒序排序**

思路：

​	如果你的需求中**需要根据某个属性进行排序 ，不妨把这个属性作为key**。因为MapReduce中**key有默认排序行为**的。但是需要进行如下考虑：

​	1）如果你的需求是正序，并且数据类型是Hadoop封装好的基本类型。这种情况下不需要任何修改，直接使用基本类型作为key即可。因为Hadoop封装好的类型已经实现了排序规则。

​	2）如果你的需求是**倒序**，或者数据类型是自定义对象。**需要重写排序规则。需要对象实现Comparable接口，重写ComparTo方法**。

​	compareTo方法用于将当前对象与方法的参数进行比较。

​		如果指定的数与参数相等返回0。

​		如果指定的数小于参数返回 -1。

​		如果指定的数大于参数返回 1。

​		例如：o1.compareTo(o2);

​		返回正数的话，当前对象（调用compareTo方法的对象o1）要排在比较对象（compareTo传参对象o2）后面，返回负数的话，放在前面。

### 自定义对象排序—— CovidCountBean

为 CovidCountBean 实现 Comparable接口，重写compareTo方法，以满足自定义排序功能。

说明：

​	由于序列化（Writable）和 比较器（Comparable）需要经常使用，所有Hadoop为我们提供了WritableComparable接口，封装了Writable、Comparable这两个接口，源码如下：

```java
@InterfaceAudience.Public
@InterfaceStability.Stable
public interface WritableComparable<T> extends Writable, Comparable<T> {
}
```

CovidCountBean 改进如下

```java
package com.clear.mapreduce.covid.beans;


import org.apache.hadoop.io.WritableComparable;
import org.jetbrains.annotations.NotNull;

import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;

/**
 * 用于记录累计确诊病例和累计死亡病例的Bean
 * 注：自定义对象作为数据类型在MapReduce中传递，记得要实现Hadoop的序列化机制
 */
public class CovidCountBean implements WritableComparable<CovidCountBean> { // 实现Hadoop序列化机制
    private long cases;  // 累计确诊病例数
    private long deaths;  // 累计死亡病例数

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
     * 序列化：可以控制将哪些字段写出去
     */
    @Override
    public void write(DataOutput dataOutput) throws IOException {
        dataOutput.writeLong(cases);
        dataOutput.writeLong(deaths);
    }

    /**
     * 反序列化：可以控制读取哪些字段
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

### Mapper类

```java
package com.clear.mapreduce.covid.sortSum;

import com.clear.mapreduce.covid.beans.CovidCountBean;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;

public class CovidSortSumMapper extends Mapper<LongWritable, Text, CovidCountBean, Text> {
    CovidCountBean outKey = new CovidCountBean();
    Text outValue = new Text();

    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        // 读取一行数据，按制表符进行分割
        String[] fields = value.toString().split("\t");

        // 将数据赋值给map输出的kv
        outKey.set(Long.parseLong(fields[1]),Long.parseLong(fields[2]));  // k:CovidCountBean
        outValue.set(fields[0]);  // v:州

        context.write(outKey,outValue);  // k-v: <CovidCountBean,州>
    }
}
```

### Reducer类

```java
package com.clear.mapreduce.covid.sortSum;

import com.clear.mapreduce.covid.beans.CovidCountBean;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;

public class CovidSortSumReducer extends Reducer<CovidCountBean, Text, Text, CovidCountBean> {

    @Override
    protected void reduce(CovidCountBean key, Iterable<Text> values, Context context) throws IOException, InterruptedException {
        // todo 排序好之后 reduce会进行分组操作  分组规则是判断key是否相等
        // 本业务中，使用自定义对象作为key，并没有重写分组规则，默认会比较对象的地址，导致每一个kv就是一组

        Text outKey = values.iterator().next();  // 州
        context.write(outKey,key);
    }
}
```

### 程序驱动类

```java
package com.clear.mapreduce.covid.sortSum;

import com.clear.mapreduce.covid.beans.CovidCountBean;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.IOException;

/**
 * 各州累计病例数量倒排统计
 */
public class CovidSortSumDriver {
    public static void main(String[] args) throws IOException, ClassNotFoundException, InterruptedException {
        Configuration conf = new Configuration();
        FileSystem fs = FileSystem.get(conf);

        // 获取Job实例
        Job job = Job.getInstance(conf,CovidSortSumDriver.class.getSimpleName());
        // 定义mr程序运行主类
        job.setJarByClass(CovidSortSumDriver.class);

        // 定义本mr程序运行时的 mapper类 reducer类
        job.setMapperClass(CovidSortSumMapper.class);
        job.setReducerClass(CovidSortSumReducer.class);

        // 定义mapper阶段输出的kv类型
        job.setMapOutputKeyClass(CovidCountBean.class);
        job.setMapOutputValueClass(Text.class);
        // 定义reducer阶段输出的kv类型 程序最终输出的kv
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(CovidCountBean.class);

        // 配置本次作业的输入路径 输出路径
        Path input = new Path(args[0]);
        Path output = new Path(args[1]);
        FileInputFormat.addInputPath(job,input);
        FileOutputFormat.setOutputPath(job, output);

        // 判断输出路径是否存在，存在则删除
        if(fs.exists(output)){
            fs.delete(output,true);
        }
        // 提交作业
        int status = job.waitForCompletion(true)?0:1;
        // 关闭客户端
        System.exit(status);

    }
}
```

### 代码执行及结果

修改POM

```xml
<archive>
    <manifest>
        <!-- mainClass标签填写主程序入口-->
        <mainClass>com.clear.mapreduce.covid.sortSum.CovidSortSumDriver</mainClass>
        <addClasspath>true</addClasspath>
        <classpathPrefix>lib/</classpathPrefix>
    </manifest>
</archive>
```

将模块打成jar包，上传至Linux服务器

```shell
[nhk@kk01 covid]$ pwd
/opt/data/covid
[nhk@kk01 covid]$ ll
total 188
-rw-r--r--. 1 nhk nhk  44252 Jul  8 20:01 mapreduce-1.0.jar
-rw-r--r--. 1 nhk nhk 136795 Feb 20  2021 us-covid19-counties.dat
```

执行任务

```shell
# 我们这里的输入数据是需求一的结果
[nhk@kk01 covid]$ hadoop jar /opt/data/covid/mapreduce-1.0.jar /opt/data/covidout /opt/data/covidout2
```

查看结果

```shell
[nhk@kk01 covid]$ hadoop fs -ls /opt/data/covidout2
Found 2 items
-rw-r--r--   3 nhk supergroup          0 2023-08-02 11:09 /opt/data/covidout2/_SUCCESS
-rw-r--r--   3 nhk supergroup       1201 2023-08-02 11:09 /opt/data/covidout2/part-r-00000
[nhk@kk01 covid]$ hadoop fs -head /opt/data/covidout2/part-r-00000
2023-08-02 11:10:49,523 INFO sasl.SaslDataTransferClient: SASL encryption trust check: localHostTrusted = false, remoteHostTrusted = false
Puerto Rico	5626240	123700
California	3272207	39521
Texas	2330107	36434
Florida	1687586	26034
New York	1383112	42639
Illinois	1119004	21074
Ohio	883716	11006
Georgia	869165	13404
Pennsylvania	830295	21350
Arizona	745976	12861
North Carolina	741583	9099
Tennessee	704464	9332
New Jersey	681283	21301
Indiana	623094	9879
Michigan	605152	15393
Wisconsin	587580	6339
Massachusetts	514134	14348
```

## 5 需求三：各州累计病例分区统计

需求：

​	将美国每个州的疫情数据输出到各自不同的文件中，即**一个州的数据在一个结果文件中**。

思路：

​	输出到不同文件中-->reducetask有多个（>2）-->默认只有1个，如何有多个？--->可以设置，job.setNumReduceTasks(N)--->当有多个reducetask 意味着数据分区---->默认分区规则是什么？ hashPartitioner--->默认分区规则符合你的业务需求么？---->符合，直接使用--->不符合，自定义分区。

### 自定义分区器——StatePartitioner

```java
package com.clear.mapreduce.covid.partition;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Partitioner;	// 新版API

import java.util.HashMap;

public class StatePartitioner extends Partitioner<Text, Text> {

    // 模拟美国各州的数据字典（实际中可以从redis进行读取加载 如果数据量不大 也可以创建集合保存）
    public static HashMap<String,Integer> stateMap = new HashMap<>();

    static{
        stateMap.put("Alabama",0);
        stateMap.put("Alaska",1);
        stateMap.put("Arizona",2);
        stateMap.put("Arkansas",3);
        stateMap.put("California",4);
        stateMap.put("Colorado",5);
        stateMap.put("Connecticut",6);
        stateMap.put("Delaware",7);
        stateMap.put("District of Columbia",8);
        stateMap.put("Florida",9);
        stateMap.put("Georgia",10);
        stateMap.put("Guam",11);
        stateMap.put("Hawaii",12);
        stateMap.put("Idaho",13);
        stateMap.put("Illinois",14);
        stateMap.put("Indiana",15);
        stateMap.put("Iowa",16);
        stateMap.put("Kansas",17);
        stateMap.put("Kentucky",18);
        stateMap.put("Louisiana",19);
        stateMap.put("Maine",20);
        stateMap.put("Maryland",21);
        stateMap.put("Massachusetts",22);
        stateMap.put("Michigan",23);
        stateMap.put("Minnesota",24);
        stateMap.put("Mississippi",25);
        stateMap.put("Missouri",26);
        stateMap.put("Montana",27);
        stateMap.put("Nebraska",28);
        stateMap.put("Nevada",29);
        stateMap.put("New Hampshire",30);
        stateMap.put("New Jersey",31);
        stateMap.put("New Mexico",32);
        stateMap.put("New York",33);
        stateMap.put("North Carolina",34);
        stateMap.put("North Dakota",35);
        stateMap.put("Northern Mariana Islands",36);
        stateMap.put("Ohio",37);
        stateMap.put("Oklahoma",38);
        stateMap.put("Oregon",39);
        stateMap.put("Pennsylvania",40);
        stateMap.put("Puerto Rico",41);
        stateMap.put("Rhode Island",42);
        stateMap.put("South Carolina",43);
        stateMap.put("South Dakota",44);
        stateMap.put("Tennessee",45);
        stateMap.put("Texas",46);
        stateMap.put("Utah",47);
        stateMap.put("Vermont",48);
        stateMap.put("Virgin Islands",49);
        stateMap.put("Virginia",50);
        stateMap.put("Washington",51);
        stateMap.put("West Virginia",52);
        stateMap.put("Wisconsin",53);
        stateMap.put("Wyoming",54);
    }

    /**
     * todo 自定义分区器中分区规则的实现方法  只要getPartition返回一样的int值，数据就会被分到同一个区
     * @param key state 州
     * @param value 一行数据（2021-01-28,Pendleton,Kentucky,21191,825,1）
     * @param numReduceTasks
     * @return
     */
    @Override
    public int getPartition(Text key, Text value, int numReduceTasks){
        Integer code = stateMap.get(key.toString());
        if(code != null){
            return code;
        }
        return 55;
    }

}
```

### Mapper类

```java
ackage com.clear.mapreduce.covid.partition;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;

public class CovidPartitionMapper extends Mapper<LongWritable, Text,Text, Text>{
    Text outKey = new Text();
    @Override
    protected void map(LongWritable key, Text value,Context context) throws IOException, InterruptedException {
        // 读取一行数据
        String[] fields = value.toString().split(",");
        // 以州作为key，参与分区  通过自定义分区 同一个州的数据到同一个分区被同一个reducetask处理
        outKey.set(fields[2]);  // 州

        context.write(outKey, value);
    }
}
```

### Reducer类

```java
package com.clear.mapreduce.covid.partition;

import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;

/**
 * 注意输出value的类型，在MapReduce中，如果实在 在业务中找不到什么数据进行输出 可以使用NullWritable
 */
public class CovidPartitionReducer extends Reducer<Text, Text, Text, NullWritable> {
    @Override
    protected void reduce(Text key,Iterable<Text> values, Context context) throws IOException, InterruptedException {
        for(Text value:values){
            context.write(value, NullWritable.get());
        }
    }
}
```

### 驱动程序类

```java
package com.clear.mapreduce.covid.partition;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

import java.io.IOException;

/**
 * 将美国疫情数据不同州的输出到不同文件中（属于同一个州的各个县输出到同一个文件中）
 */
public class CovidPartitionDriver extends Configured implements Tool {
    @Override
    public int run(String[] args) throws IOException, ClassNotFoundException, InterruptedException {
        // 获取Job实例
        Job job = Job.getInstance(getConf(), CovidPartitionDriver.class.getSimpleName());
        // 设置mr程序运行主类
        job.setJarByClass(CovidPartitionDriver.class);

        // 设置mr程序运行时的 mapper类 reducer类
        job.setMapperClass(CovidPartitionMapper.class);
        job.setReducerClass(CovidPartitionReducer.class);
        // 设置mapper阶段输出的kv类型
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(Text.class);
        // 设置reducer阶段输出的kv类型
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(NullWritable.class);

        // todo 设置程序Partition类    注意：分区组件能够生效的前提是MapReduce程序中rudecetask的个数 >= 2
        // 探究：reducetask个数和partition分区个数的关系
        //  reducetask > partition  程序可以运行，但是会产生空文件，浪费性能
        //  reducetask < partition  程序直接报错 报错信息 Illegal partition 非法分区
        //  reducetask == partition  正常情况

        job.setNumReduceTasks(56);
        job.setPartitionerClass(StatePartitioner.class);
        // 设置作业的 输入输出路径
        Path input = new Path(args[0]);
        Path output = new Path(args[1]);
        FileInputFormat.addInputPath(job, input);
        FileOutputFormat.setOutputPath(job,output);
        // todo 判断输出路径是否存在，存在则删除
        FileSystem fs = FileSystem.get(getConf());
        if (fs.exists(output)) {
            fs.delete(output, true);
        }

        // 提交作业
        return job.waitForCompletion(true) ? 0 : 1;
    }

    public static void main(String[] args) throws Exception {
        // 创建配置对象
        Configuration conf = new Configuration();
        // todo 使用工具类ToolRunner提交程序
        int status = ToolRunner.run(conf,new CovidPartitionDriver(),args);
        // 退出客户端
        System.exit(status);
    }

}
```

### 代码执行及结果

修改POM

```xml
<archive>
    <manifest>
        <!-- mainClass标签填写主程序入口-->
        <mainClass>com.clear.mapreduce.covid.partition.CovidPartitionDriver</mainClass>
        <addClasspath>true</addClasspath>
        <classpathPrefix>lib/</classpathPrefix>
    </manifest>
</archive>
```

将模块打成jar包，上传至Linux服务器

```shell
[nhk@kk01 covid]$ pwd
/opt/data/covid
[nhk@kk01 covid]$ ll
total 188
-rw-r--r--. 1 nhk nhk  45048 Aug  2 11:28 mapreduce-1.0.jar
-rw-r--r--. 1 nhk nhk 136795 Feb 20  2021 us-covid19-counties.dat
```

执行任务

```shell
[nhk@kk01 covid]$ hadoop jar /opt/data/covid/mapreduce-1.0.jar /opt/data/covid /opt/data/covidout3
```

查看结果

如果最终的数据写入了多个文件中，那么说明我们的代码编写是成功的

```shell
[nhk@kk01 covid]$ hadoop fs -ls /opt/data/covidout3
Found 57 items
-rw-r--r--   3 nhk supergroup          0 2023-08-02 11:30 /opt/data/covidout3/_SUCCESS
-rw-r--r--   3 nhk supergroup       2765 2023-08-02 11:30 /opt/data/covidout3/part-r-00000
-rw-r--r--   3 nhk supergroup       1469 2023-08-02 11:30 /opt/data/covidout3/part-r-00001
-rw-r--r--   3 nhk supergroup        627 2023-08-02 11:30 /opt/data/covidout3/part-r-00002
-rw-r--r--   3 nhk supergroup       3175 2023-08-02 11:30 /opt/data/covidout3/part-r-00003
-rw-r--r--   3 nhk supergroup       2640 2023-08-02 11:30 /opt/data/covidout3/part-r-00004
-rw-r--r--   3 nhk supergroup       2642 2023-08-02 11:30 /opt/data/covidout3/part-r-00005
-rw-r--r--   3 nhk supergroup        426 2023-08-02 11:30 /opt/data/covidout3/part-r-00006
-rw-r--r--   3 nhk supergroup        166 2023-08-02 11:30 /opt/data/covidout3/part-r-00007
-rw-r--r--   3 nhk supergroup         69 2023-08-02 11:30 /opt/data/covidout3/part-r-00008
-rw-r--r--   3 nhk supergroup       2854 2023-08-02 11:30 /opt/data/covidout3/part-r-00009
-rw-r--r--   3 nhk supergroup       6480 2023-08-02 11:30 /opt/data/covidout3/part-r-00010
-rw-r--r--   3 nhk supergroup         34 2023-08-02 11:30 /opt/data/covidout3/part-r-00011
-rw-r--r--   3 nhk supergroup        191 2023-08-02 11:30 /opt/data/covidout3/part-r-00012
-rw-r--r--   3 nhk supergroup       1670 2023-08-02 11:30 /opt/data/covidout3/part-r-00013
-rw-r--r--   3 nhk supergroup       4273 2023-08-02 11:30 /opt/data/covidout3/part-r-00014
-rw-r--r--   3 nhk supergroup       3759 2023-08-02 11:30 /opt/data/covidout3/part-r-00015
-rw-r--r--   3 nhk supergroup       3752 2023-08-02 11:30 /opt/data/covidout3/part-r-00016
-rw-r--r--   3 nhk supergroup       4078 2023-08-02 11:30 /opt/data/covidout3/part-r-00017
-rw-r--r--   3 nhk supergroup       4932 2023-08-02 11:30 /opt/data/covidout3/part-r-00018
-rw-r--r--   3 nhk supergroup       2958 2023-08-02 11:30 /opt/data/covidout3/part-r-00019
-rw-r--r--   3 nhk supergroup        657 2023-08-02 11:30 /opt/data/covidout3/part-r-00020
-rw-r--r--   3 nhk supergroup       1109 2023-08-02 11:30 /opt/data/covidout3/part-r-00021
-rw-r--r--   3 nhk supergroup        736 2023-08-02 11:30 /opt/data/covidout3/part-r-00022
-rw-r--r--   3 nhk supergroup       3541 2023-08-02 11:30 /opt/data/covidout3/part-r-00023
....
```



### 分区个数和reducetask个数关系

-   正常情况下： 分区的个数 =  reducetask个数。

-   分区的个数 >  reducetask个数  程序执行报错

```shell
 // 探究：reducetask个数和partition分区个数的关系
        //  reducetask > partition  程序可以运行，但是会产生空文件，浪费性能
        //  reducetask < partition  程序直接报错 报错信息 Illegal partition 非法分区
        //  reducetask == partition  正常情况
```



## 6 需求四：各州累计病例最多的县，即top1

需求：

​	找出美国2021-01-28，每个州state的确诊案例数最多的县county是哪一个。该问题也是俗称的TopN问题。

思路：

​	自定义对象，在**map阶段将州state和累计确诊病例数cases作为key输出**，重写对象的排序规则，首先根据州的正序排序，如果州相等，按照确诊病例数cases倒序排序，发送到reduce。

​	在reduce端利用自定义分组规则，将州state相同的分为一组，然后取第一个即是最大值。

### 自定义对象——CovidBean

```java
package com.clear.mapreduce.covid.beans;

import org.apache.hadoop.io.WritableComparable;
import org.jetbrains.annotations.NotNull;

import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;

public class CovidBean implements WritableComparable<CovidBean> {
    private String state;  // 州
    private String county;  // 县
    private long cases;  // 确诊病例数

    public CovidBean() {
    }

    public CovidBean(String state, String county, long cases) {
        this.state = state;
        this.county = county;
        this.cases = cases;
    }

    public void set(String state, String county, long cases) {
        this.state = state;
        this.county = county;
        this.cases = cases;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCounty() {
        return county;
    }

    public void setCounty(String county) {
        this.county = county;
    }

    public long getCases() {
        return cases;
    }

    public void setCases(long cases) {
        this.cases = cases;
    }

    @Override
    public String toString() {
        return "state = " + state + "\tcounty = " + county + "\tcases = " + cases;
    }
	
    // 自定义排序规则
    @Override
    public int compareTo(@NotNull CovidBean o) {
        int result;
        // 首先比较州
        String thisState = this.state;
        String thatState = o.state;
        int i = thisState.compareTo(thatState);
        if (i > 0) {
            result = 1;
        } else if (i < 0) {
            result = -1;
        } else {
            // 如果进入了这里，意味着两个州一样，此时需要根据确诊病例数倒序排序
            long thisCases = this.cases;
            long thatCases = o.cases;
            result = thisCases > thatCases ? -1 : (thisCases == thatCases ? 0 : 1);
        }
        return result;
    }

    /**
     * 序列化
     */
    @Override
    public void write(DataOutput dataOutput) throws IOException {
        dataOutput.writeUTF(state);
        dataOutput.writeUTF(county);
        dataOutput.writeLong(cases);
    }

    /**
     * 反序列化
     */
    @Override
    public void readFields(DataInput dataInput) throws IOException {
        this.state = dataInput.readUTF();
        this.county = dataInput.readUTF();
        this.cases = dataInput.readLong();
    }
}
```

### Mapper类

```java
package com.clear.mapreduce.covid.top.one;

import com.clear.mapreduce.covid.beans.CovidBean;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;

public class CovidTopOneMapper extends Mapper<LongWritable, Text, CovidBean, NullWritable> {
    CovidBean outKey = new CovidBean();
    NullWritable outValue = NullWritable.get();

    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        String[] fields = value.toString().split(",");
        // 设置输出的key
        outKey.set(fields[2], fields[1], Long.parseLong(fields[fields.length - 1]));

        context.write(outKey,outValue);
    }
}

```

### Reducer类

```java
package com.clear.mapreduce.covid.top.one;

import com.clear.mapreduce.covid.beans.CovidBean;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;

public class CovidTopOneReducer extends Reducer<CovidBean, NullWritable,CovidBean,NullWritable> {

    @Override
    protected void reduce(CovidBean key, Iterable<NullWritable> values, Context context) throws IOException, InterruptedException {
        // todo 不遍历迭代器，因为此时的key就是分组中的第一个kv键值对的key，也就是该州确诊病例数最多的top1
        context.write(key,NullWritable.get());
    }
}
```

### 自定义分组—— CovidGroupingComparator

```java
package com.clear.mapreduce.covid.top.one;

import com.clear.mapreduce.covid.beans.CovidBean;
import org.apache.hadoop.io.WritableComparable;
import org.apache.hadoop.io.WritableComparator;


public class CovidGroupingComparator extends WritableComparator {
    public CovidGroupingComparator() {
        super(CovidBean.class, true);  // 允许创建对象实例
    }

    // 重写分组规则
    @Override
    public int compare(WritableComparable a, WritableComparable b) {
        // 类型转化
        CovidBean aBean = (CovidBean) a;
        CovidBean bBean = (CovidBean) b;

        // 本需求中，分组规则是：只要前后两个数据的state一样 就应该分到同一组
        // 只要compareTo 返回0 mapreduce框架就认为两个一样
        return aBean.getState().compareTo(bBean.getState());
    }
}
```

### 程序驱动类

```java
package com.clear.mapreduce.covid.top.one;

import com.clear.mapreduce.covid.beans.CovidBean;
import com.clear.mapreduce.covid.partition.CovidPartitionDriver;
import com.clear.mapreduce.covid.partition.CovidPartitionMapper;
import com.clear.mapreduce.covid.partition.CovidPartitionReducer;
import com.clear.mapreduce.covid.partition.StatePartitioner;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

import java.io.IOException;

public class CovidTopOneDriver extends Configured implements Tool {
    @Override
    public int run(String[] args) throws IOException, ClassNotFoundException, InterruptedException {
        // 获取Job实例
        Job job = Job.getInstance(getConf(), CovidTopOneDriver.class.getSimpleName());
        // 设置mr程序运行主类
        job.setJarByClass(CovidTopOneDriver.class);

        // 设置mr程序运行时的 mapper类 reducer类
        job.setMapperClass(CovidTopOneMapper.class);
        job.setReducerClass(CovidTopOneReducer.class);
        // 设置mapper阶段输出的kv类型
        job.setMapOutputKeyClass(CovidBean.class);
        job.setMapOutputValueClass(NullWritable.class);
        // 设置reducer阶段输出的kv类型
        job.setOutputKeyClass(CovidBean.class);
        job.setOutputValueClass(NullWritable.class);

        // todo 如果重写了分组规则 还需要在job中进行设置才能生效
        job.setGroupingComparatorClass(CovidGroupingComparator.class);

        // 设置作业的 输入输出路径
        Path input = new Path(args[0]);
        Path output = new Path(args[1]);
        FileInputFormat.addInputPath(job, input);
        FileOutputFormat.setOutputPath(job,output);
        // todo 判断输出路径是否存在，存在则删除
        FileSystem fs = FileSystem.get(getConf());
        if (fs.exists(output)) {
            fs.delete(output, true);
        }

        // 提交作业
        return job.waitForCompletion(true) ? 0 : 1;
    }

    public static void main(String[] args) throws Exception {
        // 创建配置对象
        Configuration conf = new Configuration();
        // todo 使用工具类ToolRunner提交程序
        int status = ToolRunner.run(conf,new CovidTopOneDriver(),args);
        // 退出客户端
        System.exit(status);
    }
}
```

### 代码执行及结果

修改POM

```xml
<archive>
    <manifest>
        <!-- mainClass标签填写主程序入口-->
        <mainClass>com.clear.mapreduce.covid.top.one.CovidTopOneDriver</mainClass>
        <addClasspath>true</addClasspath>
        <classpathPrefix>lib/</classpathPrefix>
    </manifest>
</archive>
```

将模块打成jar包，上传至Linux服务器

```shell
[nhk@kk01 covid]$ pwd
/opt/data/covid
[nhk@kk01 covid]$ ll
total 188
-rw-r--r--. 1 nhk nhk  45053 Aug  2 11:42 mapreduce-1.0.jar
-rw-r--r--. 1 nhk nhk 136795 Feb 20  2021 us-covid19-counties.dat
```

执行任务

```shell
[nhk@kk01 covid]$ hadoop jar /opt/data/covid/mapreduce-1.0.jar /opt/data/covid /opt/data/covidout4
```

查看结果

```shell
[nhk@kk01 covid]$ hadoop fs -cat /opt/data/covidout4/part-r-00000
2023-08-02 11:44:51,208 INFO sasl.SaslDataTransferClient: SASL encryption trust check: localHostTrusted = false, remoteHostTrusted = false
state = Alabama	county = Jefferson	cases = 1101
state = Alaska	county = Anchorage	cases = 139
state = Arizona	county = Maricopa	cases = 7313
state = Arkansas	county = Pulaski	cases = 496
state = California	county = Los Angeles	cases = 16107
state = Colorado	county = Denver	cases = 739
state = Connecticut	county = Hartford	cases = 2099
state = Delaware	county = New Castle	cases = 536
state = District of Columbia	county = District of Columbia	cases = 902
state = Florida	county = Miami-Dade	cases = 4797
state = Georgia	county = Fulton	cases = 933
state = Guam	county = Unknown	cases = 130
state = Hawaii	county = Honolulu	cases = 324
state = Idaho	county = Ada	cases = 410
state = Illinois	county = Cook	cases = 9363
state = Indiana	county = Marion	cases = 1409
state = Iowa	county = Polk	cases = 468
state = Kansas	county = Unknown	cases = 678
state = Kentucky	county = Jefferson	cases = 793
state = Louisiana	county = Jefferson	cases = 782
state = Maine	county = Cumberland	cases = 151
state = Maryland	county = Montgomery	cases = 1294
state = Massachusetts	county = Middlesex	cases = 3074
state = Michigan	county = Wayne	cases = 3966
state = Minnesota	county = Hennepin	cases = 1513
state = Mississippi	county = Hinds	cases = 346
state = Missouri	county = St. Louis	cases = 1675
state = Montana	county = Yellowstone	cases = 177
state = Nebraska	county = Douglas	cases = 591
state = Nevada	county = Clark	cases = 3207
state = New Hampshire	county = Hillsborough	cases = 535
state = New Jersey	county = Essex	cases = 2530
state = New Mexico	county = Bernalillo	cases = 755
state = New York	county = New York City	cases = 26856
state = North Carolina	county = Mecklenburg	cases = 766
state = North Dakota	county = Cass	cases = 188
state = Northern Mariana Islands	county = Saipan	cases = 2
state = Ohio	county = Cuyahoga	cases = 1162
state = Oklahoma	county = Oklahoma	cases = 565
state = Oregon	county = Multnomah	cases = 480
state = Pennsylvania	county = Philadelphia	cases = 2879
state = Puerto Rico	county = San Juan	cases = 17161
state = Rhode Island	county = Providence	cases = 1581
state = South Carolina	county = Greenville	cases = 697
state = South Dakota	county = Minnehaha	cases = 310
state = Tennessee	county = Shelby	cases = 1241
state = Texas	county = Harris	cases = 4152
state = Utah	county = Salt Lake	cases = 660
state = Vermont	county = Chittenden	cases = 80
state = Virgin Islands	county = St. Thomas	cases = 15
state = Virginia	county = Fairfax	cases = 772
state = Washington	county = King	cases = 1235
state = West Virginia	county = Kanawha	cases = 258
state = Wisconsin	county = Milwaukee	cases = 1154
state = Wyoming	county = Natrona	cases = 117
```



## 7 需求五：各州累计病例最多的几个县，即topN

需求：

​	找出美国2021-01-28，每个州state的确诊案例数最多的县county前3个。Top3问题

思路：

​	自定义对象，在**map阶段将州state和累计确诊病例数cases作为key输出**，重写对象的排序规则，首先**根据州的正序排序，如果州相等，按照确诊病例数cases倒序排序，发送到reduce。

在reduce端利用自定义分组规则，将州state相同的分为一组，然后遍历取值，取出每组中的前3个即可。

为了验证验证结果方便，可以在输出的时候以cases作为value，实际上为空即可，value并不实际意义。

### **自定义对象、自定义分组类**

这两个和上述的Top1一样，此处就不再重复编写。可以直接使用。



### Mapper类

```java
package com.clear.mapreduce.covid.top.N;

import com.clear.mapreduce.covid.beans.CovidBean;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;

/**
 * 各州累计病例数最多TopN县
 * 为了验证验证结果，可以在输出的时候以cases作为value，实际上为空即可，value并无实际意义
 */
public class CovidTopNMapper extends Mapper<LongWritable, Text, CovidBean, LongWritable> {
    CovidBean outKey = new CovidBean();
    LongWritable outValue = new LongWritable();
    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        String[] fields = value.toString().split(",");

        outKey.set(fields[2],fields[1],Long.parseLong(fields[fields.length-2]));
        outValue.set(Long.parseLong(fields[fields.length-2]));

        context.write(outKey, outValue);

    }
}
```

### Reducer类

```java
ackage com.clear.mapreduce.covid.top.N;

import com.clear.mapreduce.covid.beans.CovidBean;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.mapreduce.Reducer;
import org.checkerframework.checker.units.qual.C;

import java.io.IOException;

public class CovidTopNReducer extends Reducer<CovidBean, LongWritable, CovidBean, LongWritable> {
    CovidBean outKey = new CovidBean();

    @Override
    protected void reduce(CovidBean key, Iterable<LongWritable> values, Context context) throws IOException, InterruptedException {
        int num = 0;
        for (LongWritable value : values) {
            if (num < 3) {
                context.write(key, value);
                num++;
            } else {
                return;
            }

        }
    }
}
```

### 程序驱动类

```java
package com.clear.mapreduce.covid.top.N;

import com.clear.mapreduce.covid.beans.CovidBean;
import com.clear.mapreduce.covid.top.one.CovidGroupingComparator;
import com.clear.mapreduce.covid.top.one.CovidTopOneMapper;
import com.clear.mapreduce.covid.top.one.CovidTopOneReducer;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

import java.io.IOException;

public class CovidTopNDriver extends Configured implements Tool {
    @Override
    public int run(String[] args) throws IOException, ClassNotFoundException, InterruptedException {
        // 获取Job实例
        Job job = Job.getInstance(getConf(), CovidTopNDriver.class.getSimpleName());
        // 设置mr程序运行主类
        job.setJarByClass(CovidTopNDriver.class);

        // 设置mr程序运行时的 mapper类 reducer类
        job.setMapperClass(CovidTopNMapper.class);
        job.setReducerClass(CovidTopNReducer.class);
        // 设置mapper阶段输出的kv类型
        job.setMapOutputKeyClass(CovidBean.class);
        job.setMapOutputValueClass(LongWritable.class);
        // 设置reducer阶段输出的kv类型
        job.setOutputKeyClass(CovidBean.class);
        job.setOutputValueClass(LongWritable.class);

        // todo 如果重写了分组规则 还需要在job中进行设置才能生效
        job.setGroupingComparatorClass(CovidGroupingComparator.class);

        // 设置作业的 输入输出路径
        Path input = new Path(args[0]);
        Path output = new Path(args[1]);
        FileInputFormat.addInputPath(job, input);
        FileOutputFormat.setOutputPath(job,output);
        // todo 判断输出路径是否存在，存在则删除
        FileSystem fs = FileSystem.get(getConf());
        if (fs.exists(output)) {
            fs.delete(output, true);
        }

        // 提交作业
        return job.waitForCompletion(true) ? 0 : 1;
    }

    public static void main(String[] args) throws Exception {
        // 创建配置对象
        Configuration conf = new Configuration();
        // todo 使用工具类ToolRunner提交程序
        int status = ToolRunner.run(conf,new CovidTopNDriver(),args);
        // 退出客户端
        System.exit(status);
    }
}
```

### 代码执行及结果

修改POM

```xml
<archive>
    <manifest>
        <!-- mainClass标签填写主程序入口-->
        <mainClass>com.clear.mapreduce.covid.top.N.CovidTopNDriver</mainClass>
        <addClasspath>true</addClasspath>
        <classpathPrefix>lib/</classpathPrefix>
    </manifest>
</archive>
```

将模块打成jar包，上传至Linux服务器

```shell
[nhk@kk01 covid]$ pwd
/opt/data/covid
[nhk@kk01 covid]$ ll
total 188
-rw-r--r--. 1 nhk nhk  45051 Aug  2 11:49 mapreduce-1.0.jar
-rw-r--r--. 1 nhk nhk 136795 Feb 20  2021 us-covid19-counties.dat
```

执行任务

```shell
[nhk@kk01 covid]$ hadoop jar /opt/data/covid/mapreduce-1.0.jar /opt/data/covid /opt/data/covidout5
```

查看结果

```shell
[nhk@kk01 covid]$ hadoop fs -cat /opt/data/covidout5/part-r-00000
2023-08-02 11:50:29,767 INFO sasl.SaslDataTransferClient: SASL encryption trust check: localHostTrusted = false, remoteHostTrusted = false
state = Alabama	county = Jefferson	cases = 65992	65992
state = Alabama	county = Mobile	cases = 32552	32552
state = Alabama	county = Madison	cases = 29098	29098
state = Alaska	county = Anchorage	cases = 25157	25157
state = Alaska	county = Matanuska-Susitna Borough	cases = 7406	7406
state = Alaska	county = Fairbanks North Star Borough	cases = 5795	5795
state = Arizona	county = Maricopa	cases = 465009	465009
state = Arizona	county = Pima	cases = 99441	99441
state = Arizona	county = Pinal	cases = 41829	41829
state = Arkansas	county = Pulaski	cases = 33125	33125
state = Arkansas	county = Washington	cases = 27378	27378
state = Arkansas	county = Benton	cases = 24738	24738
state = California	county = Los Angeles	cases = 1098363	1098363
state = California	county = San Bernardino	cases = 271189	271189
state = California	county = Riverside	cases = 270105	270105
state = Colorado	county = Denver	cases = 55907	55907
state = Colorado	county = El Paso	cases = 47432	47432
state = Colorado	county = Adams	cases = 46101	46101
state = Connecticut	county = Fairfield	cases = 71697	71697
state = Connecticut	county = Hartford	cases = 62913	62913
state = Connecticut	county = New Haven	cases = 62757	62757
state = Delaware	county = New Castle	cases = 43541	43541
state = Delaware	county = Sussex	cases = 20256	20256
state = Delaware	county = Kent	cases = 12521	12521
state = District of Columbia	county = District of Columbia	cases = 36132	36132
state = Florida	county = Miami-Dade	cases = 366126	366126
state = Florida	county = Broward	cases = 169691	169691
state = Florida	county = Palm Beach	cases = 104691	104691
state = Georgia	county = Gwinnett	cases = 81908	81908
state = Georgia	county = Fulton	cases = 76097	76097
state = Georgia	county = Cobb	cases = 61597	61597
state = Guam	county = Unknown	cases = 8541	8541
state = Hawaii	county = Honolulu	cases = 20878	20878
state = Hawaii	county = Maui	cases = 2236	2236
state = Hawaii	county = Hawaii	cases = 2166	2166
state = Idaho	county = Ada	cases = 44182	44182
state = Idaho	county = Canyon	cases = 23631	23631
state = Idaho	county = Kootenai	cases = 15634	15634
state = Illinois	county = Cook	cases = 450116	450116
state = Illinois	county = DuPage	cases = 71819	71819
state = Illinois	county = Will	cases = 60614	60614
state = Indiana	county = Marion	cases = 85741	85741
state = Indiana	county = Lake	cases = 46132	46132
state = Indiana	county = Allen	cases = 33417	33417
state = Iowa	county = Polk	cases = 47537	47537
state = Iowa	county = Linn	cases = 18326	18326
state = Iowa	county = Scott	cases = 16096	16096
state = Kansas	county = Sedgwick	cases = 49435	49435
state = Kansas	county = Johnson	cases = 49248	49248
state = Kansas	county = Wyandotte	cases = 18044	18044
state = Kentucky	county = Jefferson	cases = 66549	66549
state = Kentucky	county = Fayette	cases = 29241	29241
state = Kentucky	county = Warren	cases = 13119	13119
state = Louisiana	county = Jefferson	cases = 40450	40450
state = Louisiana	county = East Baton Rouge	cases = 32101	32101
state = Louisiana	county = Orleans	cases = 26039	26039
state = Maine	county = Cumberland	cases = 10993	10993
state = Maine	county = York	cases = 8259	8259
state = Maine	county = Androscoggin	cases = 4208	4208
state = Maryland	county = Prince George's	cases = 66915	66915
state = Maryland	county = Montgomery	cases = 58055	58055
state = Maryland	county = Baltimore	cases = 46651	46651
state = Massachusetts	county = Middlesex	cases = 100273	100273
state = Massachusetts	county = Essex	cases = 76259	76259
state = Massachusetts	county = Suffolk	cases = 70398	70398
state = Michigan	county = Wayne	cases = 96178	96178
state = Michigan	county = Oakland	cases = 70023	70023
state = Michigan	county = Macomb	cases = 55946	55946
state = Minnesota	county = Hennepin	cases = 95126	95126
state = Minnesota	county = Ramsey	cases = 40916	40916
state = Minnesota	county = Dakota	cases = 33846	33846
state = Mississippi	county = DeSoto	cases = 18119	18119
state = Mississippi	county = Hinds	cases = 17286	17286
state = Mississippi	county = Harrison	cases = 14829	14829
state = Missouri	county = St. Louis	cases = 82831	82831
state = Missouri	county = Kansas City	cases = 35059	35059
state = Missouri	county = St. Charles	cases = 33879	33879
state = Montana	county = Yellowstone	cases = 15225	15225
state = Montana	county = Gallatin	cases = 11334	11334
state = Montana	county = Flathead	cases = 10022	10022
state = Nebraska	county = Douglas	cases = 60854	60854
state = Nebraska	county = Lancaster	cases = 26509	26509
state = Nebraska	county = Sarpy	cases = 18208	18208
state = Nevada	county = Clark	cases = 211453	211453
state = Nevada	county = Washoe	cases = 40938	40938
state = Nevada	county = Carson City	cases = 5677	5677
state = New Hampshire	county = Hillsborough	cases = 25073	25073
state = New Hampshire	county = Rockingham	cases = 15671	15671
state = New Hampshire	county = Merrimack	cases = 6526	6526
state = New Jersey	county = Bergen	cases = 65850	65850
state = New Jersey	county = Essex	cases = 63524	63524
state = New Jersey	county = Middlesex	cases = 62445	62445
state = New Mexico	county = Bernalillo	cases = 48364	48364
state = New Mexico	county = Doña Ana	cases = 21086	21086
state = New Mexico	county = San Juan	cases = 12807	12807
state = New York	county = New York City	cases = 591160	591160
state = New York	county = Suffolk	cases = 140113	140113
state = New York	county = Nassau	cases = 125370	125370
state = North Carolina	county = Mecklenburg	cases = 84444	84444
state = North Carolina	county = Wake	cases = 64476	64476
state = North Carolina	county = Guilford	cases = 34165	34165
state = North Dakota	county = Cass	cases = 20888	20888
state = North Dakota	county = Burleigh	cases = 14215	14215
state = North Dakota	county = Grand Forks	cases = 9624	9624
state = Northern Mariana Islands	county = Saipan	cases = 129	129
state = Northern Mariana Islands	county = Tinian	cases = 2	2
state = Ohio	county = Franklin	cases = 103578	103578
state = Ohio	county = Cuyahoga	cases = 87999	87999
state = Ohio	county = Hamilton	cases = 66124	66124
state = Oklahoma	county = Oklahoma	cases = 73876	73876
state = Oklahoma	county = Tulsa	cases = 62739	62739
state = Oklahoma	county = Cleveland	cases = 25763	25763
state = Oregon	county = Multnomah	cases = 29676	29676
state = Oregon	county = Washington	cases = 19550	19550
state = Oregon	county = Marion	cases = 17036	17036
state = Pennsylvania	county = Philadelphia	cases = 108760	108760
state = Pennsylvania	county = Allegheny	cases = 68445	68445
state = Pennsylvania	county = Montgomery	cases = 47100	47100
state = Puerto Rico	county = Yauco	cases = 72153	72153
state = Puerto Rico	county = Yabucoa	cases = 72151	72151
state = Puerto Rico	county = Villalba	cases = 72149	72149
state = Rhode Island	county = Providence	cases = 74238	74238
state = Rhode Island	county = Kent	cases = 13459	13459
state = Rhode Island	county = Unknown	cases = 11708	11708
state = South Carolina	county = Greenville	cases = 54521	54521
state = South Carolina	county = Richland	cases = 34928	34928
state = South Carolina	county = Charleston	cases = 31844	31844
state = South Dakota	county = Minnehaha	cases = 26895	26895
state = South Dakota	county = Pennington	cases = 12310	12310
state = South Dakota	county = Lincoln	cases = 7422	7422
state = Tennessee	county = Davidson	cases = 83768	83768
state = Tennessee	county = Shelby	cases = 81657	81657
state = Tennessee	county = Knox	cases = 42299	42299
state = Texas	county = Harris	cases = 308902	308902
state = Texas	county = Dallas	cases = 253684	253684
state = Texas	county = Tarrant	cases = 213611	213611
state = Utah	county = Salt Lake	cases = 128589	128589
state = Utah	county = Utah	cases = 83457	83457
state = Utah	county = Davis	cases = 31599	31599
state = Vermont	county = Chittenden	cases = 3976	3976
state = Vermont	county = Washington	cases = 1183	1183
state = Vermont	county = Bennington	cases = 1004	1004
state = Virgin Islands	county = St. Thomas	cases = 1175	1175
state = Virgin Islands	county = St. Croix	cases = 1007	1007
state = Virgin Islands	county = St. John	cases = 202	202
state = Virginia	county = Fairfax	cases = 58501	58501
state = Virginia	county = Prince William	cases = 34545	34545
state = Virginia	county = Virginia Beach city	cases = 25529	25529
state = Washington	county = King	cases = 77069	77069
state = Washington	county = Pierce	cases = 34590	34590
state = Washington	county = Spokane	cases = 33979	33979
state = West Virginia	county = Kanawha	cases = 10920	10920
state = West Virginia	county = Berkeley	cases = 8762	8762
state = West Virginia	county = Monongalia	cases = 6944	6944
state = Wisconsin	county = Milwaukee	cases = 102528	102528
state = Wisconsin	county = Waukesha	cases = 42626	42626
state = Wisconsin	county = Dane	cases = 39091	39091
state = Wyoming	county = Laramie	cases = 7959	7959
state = Wyoming	county = Natrona	cases = 7439	7439
state = Wyoming	county = Campbell	cases = 4592	4592
```

