# 第一个MR案例——WordCount

## 1 Mapper经典入门案例——WordCount

### 1.1 编程思路

- map阶段的核心：把输入的数据进行切割，全部标记为1。因此输出就是<单词, 1>。

    shuffle核心：经过默认的排序分区分组，key相同的单词会作为一组数据构成新的k-v对。

- reduce阶段的核心：处理shuffle完的一组数据，该数据就是单词所有的键值对。

### 1.2 编程实现

#### 1.2.1 开发环境搭建

IEDA下创建Maven工程，引入开发MapReduce依赖和打jar包的插件

resource添加log4j配置(Hadoop中集成了log4j的依赖，只需导入配置文件log4j.properties

主要依赖如下（放在dependencies下）：

```xml
<!-- 通用核心包 -->
<dependency>
    <groupId>org.apache.hadoop</groupId>
    <artifactId>hadoop-common</artifactId>
    <version>3.2.2</version>  <!--这里的版本需要与Hadoop的版本一致-->
</dependency>       
<dependency>
    <groupId>org.apache.hadoop</groupId>
    <artifactId>hadoop-client</artifactId>
    <version>3.2.2</version>
</dependency>
<!-- HDFS文档-->
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
```

插件如下（放入build标签下的子标签plugins下）：

```xml
<!-- windows 入口配置-->      
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>2.4</version>
    <configuration>
        <archive>
            <manifest>
                <!-- mainClass标签填写主程序入口  填写全限定名-->
                <mainClass>com.clear.mapreduce.wordcount.WordCountDriver</mainClass>
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
```

#### 1.2.2 Mapper类的编写

下面是Hadoop官方源代码中提供的示例代码：

```java
 public class TokenCounterMapper
            extends Mapper<Object, Text, Text, IntWritable> {

        private final static IntWritable one = new IntWritable(1);
        private Text word = new Text();

        public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
            StringTokenizer itr = new StringTokenizer(value.toString());
            while (itr.hasMoreTokens()) {
                word.set(itr.nextToken());
                context.write(word, one);
            }
        }
    }
```

下面是我们编写的WordCountMapper类

```java
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;


/**
 * Mapper<KEYIN, VALUEIN, KEYOUT, VALUEOUT>
 *     KEYIN：表示map阶段输入kv中的k类型     在默认组件下  是起始位置位移量  因此是LongWritable
 *     VALUEIN：表示map阶段输入kv中的v类型   在默认组件下  是每一行的内容   因此是Text
 *          todo MapReduce有默认的读取数据组件    叫做TextInputFormat
 *          todo 读数据的行为是：一行一行的读取数据  返回kv键值对
 *              k：每一行的起始位置的偏移量  通常无意义
 *              v: 这一行的文本内容
 *
 *     KEYOUT：表示map阶段输出kv中的k类型     跟业务相关  本需求输出的是单词       因此是Text
 *     VALUEOUT：表示map阶段输出kv中的v类型   根业务相关  本需求输出的是单词个数1   因此是IntWritable
 */
public class WordCountMapper extends Mapper<LongWritable, Text,Text, IntWritable> {
    private Text outKey = new Text();
    private final static IntWritable outValue = new IntWritable(1);
    /**
     * map方法是mapper阶段的核心方法，也是具体业务逻辑实现的方法
     * 注意：该方法被调用的次数和输入的kv键值对有关，每当TextInputFormat读取返回kv键值对，就调用一次map方法进行业务处理
     *
     */
    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        // 拿去一行数据转为String
        String line = value.toString();  // 假设读取的一行数据为 hello tom hello allen hello tom
        // 根据分隔符进行切割
        String[] words = line.split(" ");  // 切割后的数组 [hello, tom, hello, allen, hello, tom]
        // 遍历数据
        for (String word : words) {
            // 输出数据 把每个单词标记为1  输出结果为 <单词, 1>
            // 使用上下文对象，将数据输出
            outKey.set(word);
            context.write(outKey, outValue);  // <hello,1> <tom,1>....
        }
    }
}

```

#### 1.2.3 Reduce类编写

```java
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;

/**
 * Reducer<KEYIN, VALUEIN, KEYOUT, VALUEOUT>
 *     KEYIN：表示reduce阶段输入kv中的k类型     对应map的输出key    因此在本需求中 就是单词 Text
 *     VALUEIN：表示reduce阶段输入kv中的v类型   对应map的输出value  在本需求中就是单词的个数1  IntWritable

 *     KEYOUT：表示reduce阶段输出kv中的k类型     跟业务相关  本需求输出的是单词       因此是Text
 *     VALUEOUT：表示reduce阶段输出kv中的v类型   根业务相关  本需求输出的是单词总个数  这个数可能很大，因此是LongWritable
 */
public class WordCountReduce extends Reducer<Text, IntWritable, Text, LongWritable> {
    private static LongWritable outValue = new LongWritable(); 
    /**
     * KEYIN key, Iterable<VALUEIN> values, Reducer<KEYIN, VALUEIN, KEYOUT, VALUEOUT
     * todo 当map的所有输出数据来到reduce之后，该如何调用reduce方法进行处理呢？
     *  <hello,1> <tom,1> <hello,1> <allen,1> <hello,1> <tom,1>
     *      
     *  1.排序    规则：默认根据key的字典序进行排序（a~z）
     *      <allen,1> <hello,1><hello,1><hello,1> <tom,1><tom,1>
     *  2.分组    规则：key相应的分为一组
     *      <allen,1>
     *      <hello,1><hello,1><hello,1>
     *      <tom,1><tom,1>
     *  3.分组之后，同一组的数据组成一个新的kv键值对，调用一次reduce方法       reduce方法基于分组调用的 一个分组调用一次
     *      todo 同一组中数据组成一个新的kv键值对
     *          新的key：该组共同的key
     *          新的value：该组所有的value组成的一个迭代器Iterable
     *          <allen,1> ---> <allen,Iterable[1]>
     *          <hello,1><hello,1><hello,1> ---> <hello,Iterable[1,1,1]>
     *          <tom,1><tom,1> ---> <tom,Iterable[1,1]>
     */
    @Override
    protected void reduce(Text key, Iterable<IntWritable> values, Context context) throws IOException, InterruptedException {
        // 定义一个统计变量(这个数可能很大，因此采用long型)
        long count = 0;
        // 遍历该组的values
        for (IntWritable value : values) {  // <allen,Iterable[1]>
            // 累加计算单词总个数
            count += value.get();
        }
        outValue.set(count);
        context.write(key, outValue);
    }
}
```

#### 1.2.4 客户端驱动类Driver编写——方式1

```java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.IOException;

/**
 * 该类就是MapReduce程序客户端驱动类 主要是构造Job对象实例
 * 指定各种组件属性  包括：mapper reduce类、输入输出的数据类型、输入输出的数据路径
 */
public class WordCountDriver_v1 {
    public static void main(String[] args) throws IOException, ClassNotFoundException, InterruptedException {
        // 创建配置对象
        Configuration conf = new Configuration();

        // 构建Job作业的实例 参数(配置对象，job名字)
        //Job job = Job.getInstance(conf,"WordCountDriver_v1");
        Job job = Job.getInstance(conf,WordCountDriver_v1.class.getSimpleName());
        // 设置mr程序运行的主类
        job.setJarByClass(WordCountDriver_v1.class);

        // 设置本次mr程序的mapper类型 reduce类型
        job.setMapperClass(WordCountMapper.class);
        job.setReducerClass(WordCountReduce.class);

        // 指定mapper阶段输出的 key-value类型
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(IntWritable.class);

        // 指定reduce阶段输出的 key-value类型 也是mr程序最终输出的类型
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(LongWritable.class);

        // 配置本次作业的输入数据路径 和输出数据路径
        // todo 默认组件 TextInputFormat TextOutputFormat
        FileInputFormat.setInputPaths(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));

        // 判断输出路径是否存在，如果存在则删除
        FileSystem fs = FileSystem.get(conf);
        if (fs.exists(new Path(args[1]))) {
            fs.delete(new Path(args[1]), true);
        }

        // 最终提交本次job作业
        //job.submit();  // 不推荐的提交方式
        // 采用 提交job 参数表示是否开启实时监视追踪作业的执行情况
        boolean resultFlag = job.waitForCompletion(true);
        // 退出程序 和job结果进行绑定
        System.exit(resultFlag ? 0 : 1);
    }
}
```

#### 1.2.5 客户端驱动类Driver编写——方式2

```java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

/**
 * 使用工具类ToolRunner提交mapreduce作业（Hadoop官方推荐的方式）
 */
public class WordCountDriver_v2 extends Configured implements Tool {

    @Override
    public int run(String[] args) throws Exception {
        // 构建Job作业的实例 参数(配置对象，job名字)
        //Job job = Job.getInstance(getConf(), String.valueOf(this.getClass()));
        Job job = Job.getInstance(getConf(), WordCountDriver_v2.class.getSimpleName());
        // 设置mr程序运行的主类
        job.setJarByClass(WordCountDriver_v2.class);

        // 设置本次mr程序的mapper类型 reduce类型
        job.setMapperClass(WordCountMapper.class);
        job.setReducerClass(WordCountReduce.class);

        // 指定mapper阶段输出的 key-value类型;
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(IntWritable.class);

        // 指定reduce阶段输出的 key-value类型 也是mr程序最终输出的类型
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(LongWritable.class);

        // 配置本次作业的输入数据路径 和输出数据路径
        // todo 默认组件 TextInputFormat TextOutputFormat
        FileInputFormat.addInputPath(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));

        //判断输出路径是否存在 如果存在删除
        FileSystem fs = FileSystem.get(getConf());
        if(fs.exists(new Path(args[1]))){
            fs.delete(new Path(args[1]),true);
        }

        return job.waitForCompletion(true) ? 0 : 1;
    }
    public static void main(String[] args) throws Exception {
        // 创建配置对象
        Configuration conf = new Configuration();
        // todo 使用工具类ToolRunner提交程序
        int status = ToolRunner.run(conf, new WordCountDriver_v2(), args);
        // 退出客户端
        System.exit(status);
    }
}
```

### 1.3 测试运行

将工程使用maven打成jar包后传入到Linux

- maven compile 编译
- maven package 打包

命令如下（与java执行jar包相似）

```
hadoop jar xxxxx.jar [工程主类入口] args参数
```

MapReduce程序也可以选择在本地运行，需要确保参数 mapreduce.framework.name == local

在本地运行时记得传入 agrs参数



## 2 MapReduce输入输出梳理

**MapReduce框架运行在<key, value>键值对上**，也就是说，框架把作业的输入看作是一组<key, value>键值对，同样也产生一组<key, value>键值对为作业的输出（这两对键值对可能是不同的）

### 2.1 输入梳理

默认**读取数据的组件**叫做**TextInputFormat**

关于输入路径：

- ​	如果指向的是一个文件，处理该文件
- ​	如果指向的是一个文件夹(目录)，就处理该目录所有的文件，把所有文件当成整体来处理

### 2.2 输出梳理

默认**输出数据的组件**叫做**TextOutputFormat**

输出路径不能提前存在，必须是一个不存在的目录，否则执行报错，因为底层会对输出路径进行检测判断

可以在程序中编写代码进行判断，如果输出路径存在，先删除，再提交执行，下面是片段代码：

```java
// 配置本次作业的输入数据路径 和输出数据路径
// todo 默认组件 TextInputFormat TextOutputFormat
FileInputFormat.setInputPaths(job, new Path(args[0]));
FileOutputFormat.setOutputPath(job, new Path(args[1]));

// 判断输出路径是否存在，如果存在则删除
FileSystem fs = FileSystem.get(conf);
if (fs.exists(new Path(args[1]))) {
    fs.delete(new Path(args[1]), true);  // true 参数表示递归删除
}
```

## 3 MapReduce流程梳理

以WordCount案例为例，对MapReduce流程梳理

### 3.1 Map阶段执行过程

- 第一阶段：把输入目录下文件按照一定的标准逐个进行**逻辑切片**，形成切片规则。

默认是Spilt size = Block size，每一个切片由一个MapTask处理。（getSplits）

- 第二阶段：对切片中的数据按照一定的规则读取解析返回<key, value>对。

默认是**按行读取数据**。key是每一行是起始位置偏移量，value是本行的文本内容。（TextInputForamt）

- 第三阶段：调用Mapper类中的**map方法处理数据。**

每读取解析出来的一个<key, value>，调用一次map方法（Mapper中）

- 第四阶段：按照一定的规则对Map输出的键值对进行**分区partition**。默认不分区，因为只有一个reduceTask

分区的数量就是reducetask运行的数量（HashPartition）

- 第五阶段：Map输出写入**内存缓冲区**，达到比例溢出到磁盘上。**溢出spill**的时候根据key进行**排序sort**

默认根据key字典序排序（WritableComparable.compareTo）

- 第六阶段：对所有溢出文件进行最终的**merge合并**，成为一个文件


### 3.2 Reduce阶段执行过程

- 第一阶段：ReduceTask会自动从MapTask**复制拉取**其输出的键值对
- 第二阶段：把复制到Reducer本地数据，全部进行**合并merge**，即把分散的数据合并成一个大的数据。再对合并后的数据**排序**。
- 第三阶段：对排序后的键值对**调用reduce方法**

键值对相对的调用一次reduce方法。最后把这些输出的键值对写入到HDFS文件中
