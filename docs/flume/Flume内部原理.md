
# Flume内部原理

-   1**）Source从外部接收数据，交给Channel Processor**（channel处理器）进行处理event
-   2）Channel Processor将 event传递给**拦截器链**，通过拦截器对event进行过滤清洗：比如时间拦截，分类等
-   3）**经过拦截器处理的数据经过channel选择器**，发往不同的channel；channel选择器有两种：
    -   一类Replicating Channel Selector，会将source中的event发往所有channel，能够冗余副本，提高可用性
    -   另一类Multiplexing Channel Selector：会根据event中header中的某个value将数据发到对应的channel
-   4）最后sink处理器处理每个channel中的事件

重要组件：

-   ChannelSelector


ChannelSelector 的作用就是选出 Event 将要被发往哪个 Channel。其共有两种类型，分别是 **Replicating（复制）和 Multiplexing（多路复用）**。

ReplicatingSelector 会将同一个 Event 发往所有的 Channel， Multiplexing 会根据相应的原则，将不同的 Event 发往不同的 Channel。

-   SinkProcessor（很少使用，了解即可）


SinkProcessor 共 有 三 种 类 型 ， 分 别 是 DefaultSinkProcessor（**默认一对一**） 、LoadBalancingSinkProcessor（**负载均衡**） 和 FailoverSinkProcessor（**故障转移**）

DefaultSinkProcessor 对 应 的 是 单 个 的 Sink ， LoadBalancingSinkProcessor 和FailoverSinkProcessor 对应的是 Sink Group， LoadBalancingSinkProcessor 可以实现**负载均衡**的功能， FailoverSinkProcessor 可以实现**故障转移**的功能。

## 复制 Replicating 演示

需求：flume1 使用 TailDirSource监控本地目录，使用Replicating Channel Selector生成两个Channel，一个用于flume2将其采集到HDFS、另一个用于flume3采集到本地的其他目录

1）在flume根目录的job目录下创建group1目录

```shell
[nhk@kk01 job]$ pwd
/opt/software/flume/job
[nhk@kk01 job]$ mkdir group1
[nhk@kk01 job]$ cd group1/
```

2）在group1目录创建三个flume配置文件

```shell
[nhk@kk01 group1]$ touch flume1.conf
[nhk@kk01 group1]$ touch flume2.conf
[nhk@kk01 group1]$ touch flume3.conf
```

flume1.conf 配置文件如下

```shell
# 1.定义组件
a1.sources = r1
a1.sinks = k1 k2
a1.channels = c1 c2 

# 2.配置sources
a1.sources.r1.type = TAILDIR
a1.sources.r1.filegroups = f1 f2
a1.sources.r1.filegroups.f1 = /opt/software/flume/files1/.*files.* 
a1.sources.r1.filegroups.f2 = /opt/software/flume/files2/.*log.* 
a1.sources.r1.positionFile = /opt/software/flume/taildir_position.json

# 将数据流复制给所有 channel（默认参数，可以不写）
a1.sources.r1.selector.type = replicating

# 3.配置channels
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

a1.channels.c2.type = memory
a1.channels.c2.capacity = 1000
a1.channels.c2.transactionCapacity = 100

# 4.配置sinks
a1.sinks.k1.type = avro
a1.sinks.k1.hostname = kk01
a1.sinks.k1.port = 4141

a1.sinks.k2.type = avro
a1.sinks.k2.hostname = kk01
a1.sinks.k2.port = 4142

# 5.组装
a1.sources.r1.channels = c1 c2
a1.sinks.k1.channel = c1
a1.sinks.k2.channel = c2
```

flume2.conf 配置文件如下

```shell
# 1.定义组件
a1.sources = r1
a1.sinks = k1 
a1.channels = c1  

# 2.配置sources
a1.sources.r1.type = avro
a1.sources.r1.bind = kk01
a1.sources.r1.port = 4141

# 3.配置channels
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# 4.配置sinks
a1.sinks.k1.type = hdfs
a1.sinks.k1.hdfs.path = /flume1/%Y%m%d/%H
a1.sinks.k1.hdfs.filePrefix = log-
# 实际开发使用时间需要调整为1h，学习使用10s
a1.sinks.k1.hdfs.rollInterval = 10
a1.sinks.k1.hdfs.rollSize = 134217728
a1.sinks.k1.hdfs.rollCount = 0

# 是否使用本地时间戳	
a1.sinks.k1.hdfs.useLocalTimeStamp = true 

# 5.组装
a1.sources.r1.channels = c1 
a1.sinks.k1.channel = c1
```

flume3.conf 配置文件如下

```shell
# 1.定义组件
a1.sources = r1
a1.sinks = k1 
a1.channels = c1  

# 2.配置sources
a1.sources.r1.type = avro
a1.sources.r1.bind = kk01
a1.sources.r1.port = 4142

# 3.配置channels
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# 4.配置sinks
a1.sinks.k1.type = file_roll
a1.sinks.k1.sink.directory = /opt/software/flume/flume3datas

# 5.组装
a1.sources.r1.channels = c1 
a1.sinks.k1.channel = c1
```

注意：

​	需要确保目录存在，否则会报错

```shell
[nhk@kk01 flume]$ mkdir files1
[nhk@kk01 flume]$ mkdir files2
[nhk@kk01 flume]$ mkdir flume3datas
```

3）启动3个kk01的终端，分别代表 flume1、flume2、flume3，并启动

```shell
[nhk@kk01 flume]$ bin/flume-ng agent -n a1 -c conf/ -f job/group1/flume1.conf
```

```shell
[nhk@kk01 flume]$ bin/flume-ng agent -n a1 -c conf/ -f job/group1/flume2.conf
```

```shell
[nhk@kk01 flume]$ bin/flume-ng agent -n a1 -c conf/ -f job/group1/flume3.conf
```

4）往flies1目录写数据

```shell
[nhk@kk01 files1]$ pwd
/opt/software/flume/files1
[nhk@kk01 files1]$ echo hello >> files1

```

5）查看变化情况

flume1打印日志

```shell
2023-06-23 03:43:08,537 (PollableSourceRunner-TaildirSource-r1) [INFO - org.apache.flume.source.taildir.ReliableTaildirEventReader.openFile(ReliableTaildirEv
entReader.java:290)] Opening file: /opt/software/flume/files1/files1, inode: 210532613, pos: 0
```

flume2打印日志

```shell
2023-06-23 03:43:21,598 (hdfs-k1-roll-timer-0) [INFO - org.apache.flume.sink.hdfs.BucketWriter.doClose(BucketWriter.java:438)] Closing /flume1/20230623/03/lo
g-.1687506191543.tmp2023-06-23 03:43:21,623 (hdfs-k1-call-runner-9) [INFO - org.apache.flume.sink.hdfs.BucketWriter$7.call(BucketWriter.java:681)] Renaming /flume1/20230623/03/l
og-.1687506191543.tmp to /flume1/20230623/03/log-.1687506191543
```

flume3打印日志

```shell
2023-06-23 03:43:15,657 (New I/O worker #1) [INFO - org.apache.avro.ipc.NettyServer$NettyServerAvroHandler.handleUpstream(NettyServer.java:171)] [id: 0xe4313
927, /192.168.188.128:40568 => /192.168.188.128:4142] CONNECTED: /192.168.188.128:40568
```

查看 flume3datas目录

```shell
[nhk@kk01 flume]$ cd flume3datas/
[nhk@kk01 flume3datas]$ ll
total 4
-rw-rw-r--. 1 nhk nhk 0 Jun 23 03:42 1687506137550-1
-rw-rw-r--. 1 nhk nhk 0 Jun 23 03:42 1687506137550-2
-rw-rw-r--. 1 nhk nhk 6 Jun 23 03:43 1687506137550-3
```

此致，该演示完成

## 多路复用 Multiplexing 及 拦截器 演示

需求：使用flume采集服务器本地日志，需要按照日志类型的不同，将不同类型的日志发往不同的分析系统

​	我们以端口数据模拟日志，以数字(单个)和字母(单个)模拟不同类型的日志，我们需要自定义 interceptor 区分数字和字母，将其发往不同的分析系统（channel）

 **Multiplexing 的原理：**

​	**根据 event中Header的某个key的值，将不同的event发送到不同的channel中，所以我们需要自定义一个  interceptor ，为不同类型的event的 Header中的key赋予不同的值。**

### 1）编写flume拦截器

创建flume-interceptor 模块，在pom.xml中导入依赖

```xml
<dependencies>
	<dependency>
		<groupId>org.apache.flume</groupId>
		<artifactId>flume-ng-core</artifactId>
		<version>1.9.0</version>
	</dependency>
</dependencies>
```

### 2）创建 MyInterceptor类

在 com.clear.flume中创建 MyInterceptor类，并实现Interceptor 接口

```java
package com.clear.flume;

import org.apache.flume.Context;
import org.apache.flume.Event;
import org.apache.flume.interceptor.Interceptor;

import java.util.List;
import java.util.Map;

/**
 * 1.继承flume拦截器接口
 * 2.重写4个抽象方法
 * 3.编写静态内部类 builder
 */
public class MyInterceptor implements Interceptor {

    // 初始化方法
    @Override
    public void initialize() {

    }

    // 处理方法：处理单个event
    @Override
    public Event intercept(Event event) {
        // 需求：在 event 的头添加标记
        // 提供给 channel selector 选择发送到不同的channel
        Map<String, String> headers = event.getHeaders();
        String log = new String(event.getBody());

        // 判断log的开头第一个字符
        // 如果是字母发送到 channel1
        // 如果是数字发送到 channel2
        char c = log.charAt(0);
        if (c >= '0' && c <= '9') {
            // c为数字
            headers.put("type", "number");
        } else if (c >= 'A' && c <= 'Z' || c >= 'a' && c <= 'z') {
            // c为字母
            headers.put("type", "letter");
        }
        // 因为头信息属性是一个引用类型，直接修改对象即可
        // 也可以不调用set方法
        // event.setHeaders(headers);
        return event;
    }

    // 处理方法：处理多个event
    // 系统会调用这个方法
    @Override
    public List<Event> intercept(List<Event> events) {
        for (Event event : events) {
            intercept(event);
        }
        return events;
    }

    // 关闭
    @Override
    public void close() {

    }

    public static class Builder implements Interceptor.Builder{

        // 创建一个拦截器对象
        @Override
        public Interceptor build() {
            return new MyInterceptor();
        }

        // 配置方法
        @Override
        public void configure(Context context) {
        }
    }
}
```

### 3）打包模块并上传至服务器

将打包好的jar包上传至 flume根目录下的lib目录

```shell
[nhk@kk01 lib]$ pwd
/opt/software/flume/lib
[nhk@kk01 lib]$ ll | grep flume-interceptor
-rw-r--r--. 1 nhk nhk    3511 Jun 23 04:15 flume-interceptor-1.0-SNAPSHOT.jar
```

### 4）编写配置文件

在${FLUME_HOME}/job目录下创建group2目录，创建flume1.conf、flume3.conf、flume3.conf

```shell
[nhk@kk01 job]$ mkdir group2
[nhk@kk01 job]$ cd group2
[nhk@kk01 group2]$ touch flume1.conf
[nhk@kk01 group2]$ touch flume2.conf
[nhk@kk01 group2]$ touch flume3.conf
```

flume1.conf 配置文件如下

```shell
# 1.定义组件
a1.sources = r1
a1.sinks = k1 k2
a1.channels = c1 c2 

# 2.配置sources
a1.sources.r1.type = netcat
a1.sources.r1.bind = localhost
a1.sources.r1.port = 44444

a1.sources.r1.selector.type = multiplexing
# 填写标记的key
a1.sources.r1.selector.header = type
# 为数字发往flume3（即value对应的channel）
a1.sources.r1.selector.mapping.number = c2
# 为字母发往flume2
a1.sources.r1.selector.mapping.letter = c1
# 如果匹配不上走的channel
a1.sources.r1.selector.default = c2

a1.sources.r1.interceptors = i1
a1.sources.r1.interceptors.i1.type = com.clear.flume.MyInterceptor$Builder

# 3.配置channels
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

a1.channels.c2.type = memory
a1.channels.c2.capacity = 1000
a1.channels.c2.transactionCapacity = 100

# 4.配置sinks
a1.sinks.k1.type = avro
a1.sinks.k1.hostname = kk01
a1.sinks.k1.port = 4141

a1.sinks.k2.type = avro
a1.sinks.k2.hostname = kk01
a1.sinks.k2.port = 4142

# 5.组装
a1.sources.r1.channels = c1 c2
a1.sinks.k1.channel = c1
a1.sinks.k2.channel = c2
```

flume2.conf 配置文件如下

```shell
# 1.定义组件
a1.sources = r1
a1.sinks = k1 
a1.channels = c1  

# 2.配置sources
a1.sources.r1.type = avro
a1.sources.r1.bind = kk01
a1.sources.r1.port = 4141

# 3.配置channels
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# 4.配置sinks
a1.sinks.k1.type = logger

# 5.组装
a1.sources.r1.channels = c1 
a1.sinks.k1.channel = c1
```

flume3.conf 配置文件如下

```shell
# 1.定义组件
a1.sources = r1
a1.sinks = k1 
a1.channels = c1  

# 2.配置sources
a1.sources.r1.type = avro
a1.sources.r1.bind = kk01
a1.sources.r1.port = 4142

# 3.配置channels
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# 4.配置sinks
a1.sinks.k1.type = logger

# 5.组装
a1.sources.r1.channels = c1 
a1.sinks.k1.channel = c1
```

### 5）启动flume

启动3个kk01的终端，分别代表 flume1、flume2、flume3，并启动

```shell
[nhk@kk01 flume]$ bin/flume-ng agent -n a1 -c conf/ -f job/group2/flume3.conf 
```

```shell
[nhk@kk01 flume]$ bin/flume-ng agent -n a1 -c conf/ -f job/group2/flume2.conf 
```

```shell
[nhk@kk01 flume]$ bin/flume-ng agent -n a1 -c conf/ -f job/group2/flume1.conf
```

### 6）启动nc工具并输入内容

在打开一个kk01的终端，启动nc

```shell
[nhk@kk01 flume]$ nc localhost 44444
abs
OK
ssf
OK
123
OK
344
OK
244
OK
hhe
OK
```

### 7）观察flume2、flume3

flume2打印日志

```shell
2023-06-23 04:50:31,589 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - org.apache.flume.sink.LoggerSink.process(LoggerSink.java:95)] Event: { header
s:{type=letter} body: 61 62 73                                        abs }2023-06-23 04:50:31,590 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - org.apache.flume.sink.LoggerSink.process(LoggerSink.java:95)] Event: { header
s:{type=letter} body: 73 73 66                                        ssf }2023-06-23 04:50:33,499 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - org.apache.flume.sink.LoggerSink.process(LoggerSink.java:95)] Event: { header
s:{type=letter} body: 68 68 65                                        hhe }
```

flume3打印日志

```shell
2023-06-23 04:50:33,854 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - org.apache.flume.sink.LoggerSink.process(LoggerSink.java:95)] Event: { header
s:{type=number} body: 31 32 33                                        123 }2023-06-23 04:50:33,854 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - org.apache.flume.sink.LoggerSink.process(LoggerSink.java:95)] Event: { header
s:{type=number} body: 33 34 34                                        344 }2023-06-23 04:50:33,854 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - org.apache.flume.sink.LoggerSink.process(LoggerSink.java:95)] Event: { header
s:{type=number} body: 32 34 34                                        244 }
```

通过观察得知，nc工具输入的字母都发往了flume2、输入的数字都发往了flume3

## 聚合 演示

需求：

kk01上的flume1监控文件/opt/software/flume/files1/.\*files.*

kk02上的flume2监控某个端口的数据流

flume1、flume2的数据都发送给kk03上的flume3，flume3将数据打印至控制台

### 1）kk01上编写配置文件

在${FLUME_HOME}/job目录下创建group3目录，创建flume1.conf

```shell
[nhk@kk01 job]$ mkdir group3
[nhk@kk01 job]$ cd group3
[nhk@kk01 group3]$ touch flume1.conf
```

flume1.conf配置文件内容如下

```shell
# 1.定义组件
a1.sources = r1
a1.sinks = k1
a1.channels = c1 

# 2.配置sources
a1.sources.r1.type = TAILDIR
a1.sources.r1.filegroups = f1
a1.sources.r1.filegroups.f1 = /opt/software/flume/files1/.*files.*  
a1.sources.r1.positionFile = /opt/software/flume/taildir_position3.json

# 3.配置channels
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# 4.配置sinks
a1.sinks.k1.type = avro
a1.sinks.k1.hostname = kk03
a1.sinks.k1.port = 4141

# 5.组装
a1.sources.r1.channels = c1 
a1.sinks.k1.channel = c1
```

### 2）kk02上编写配置文件

在${FLUME_HOME}/job目录下创建group3目录，创建flume2.conf

```shell
[nhk@kk02 job]$ mkdir group3
[nhk@kk02 job]$ cd group3/
[nhk@kk02 group3]$ touch flume2.conf
```

flume2.conf配置文件内容如下

```shell
# 1.定义组件
a1.sources = r1
a1.sinks = k1
a1.channels = c1

# 2.配置sources
a1.sources.r1.type = netcat
a1.sources.r1.bind = localhost
a1.sources.r1.port = 44444

# 3.配置channels
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# 4.配置sinks
a1.sinks.k1.type = avro
a1.sinks.k1.hostname = kk03
a1.sinks.k1.port = 4141

# 5.组装
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
```

### 3）kk03上编写配置文件

在${FLUME_HOME}/job目录下创建group3目录，创建flume3.conf

```shell
[nhk@kk03 job]$ mkdir group3
[nhk@kk03 job]$ cd group3/
[nhk@kk03 group3]$ touch flume3.conf
```

flume2.conf配置文件内容如下

```shell
# 1.定义组件
a1.sources = r1
a1.sinks = k1 
a1.channels = c1 

# 2.配置sources
a1.sources.r1.type = avro
a1.sources.r1.bind = kk03
a1.sources.r1.port = 4141	

# 3.配置channels
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# 4.配置sinks
a1.sinks.k1.type = logger

# 5.组装
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
```

### 4）启动flume

在kk03启动flume3

```shell
[nhk@kk03 flume]$ bin/flume-ng agent -n a1 -c conf/ -f job/group3/flume3.conf
```

在kk01启动flume1

```shell
[nhk@kk01 flume]$ bin/flume-ng agent -n a1 -c conf/ -f job/group3/flume1.conf 
```

在kk02启动flume2

```shell
[nhk@kk02 flume]$ bin/flume-ng agent -n a1 -c conf/ -f job/group3/flume2.conf 
```

### 5）测试

在kk02启动nc工具，并发送数据

```shell
[nhk@kk02 ~]$ nc localhost 44444
hello world
OK
```

结果在kk03上的flume3打印了如下日志

```shell
2023-06-23 05:14:32,423 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - org.apache.flume.sink.LoggerSink.process(LoggerSink.java:95)] Event: { header
s:{} body: 68 65 6C 6C 6F 20 77 6F 72 6C 64                hello world }
```

在kk01上的 /opt/software/flume/files1目录追加内容

```shell
[nhk@kk01 files1]$ echo 666 >> files1 
```

结果在kk03上的flume3打印了如下日志

```shell
2023-06-23 05:16:30,483 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - org.apache.flume.sink.LoggerSink.process(LoggerSink.java:95)] Event: { header
s:{} body: 36 36 36                                        666 }
```

此致，该演示完成
