
# Flume案例

官方文档 https://flume.apache.org/releases/content/1.9.0/FlumeUserGuide.html

## 演示 Netcat Source

1）安装netcat

```shell
[root@kk01 ~]# yum install -y nc
```

2）测试netcat

打开两个终端，第一个用于向9999端口发送消息，开启后终端会卡住，表示进入了等待输入消息的状态。

```shell
[root@kk01 ~]# nc -lk 9999

```

查看端口9999是否被占用（可选）

```shell
[root@kk01 ~]# netstat -nlp | grep 9999
```

第二个用于接收9999端口收到的消息

```shell
[root@kk01 ~]# nc localhost 9999

```

第一个终端发送消息

```shell
[root@kk01 ~]# nc -lk 9999
hello
world
```

第二个终端收到了消息

```shell
[root@kk01 ~]# nc localhost 9999
hello
world
```

此致，就验证了nc的可用性，说明它可以进行双向通信

按 `ctrl+z` 退出

**3）创建 Flume Agent 文件 nc-flume-log.conf**

​为方便之后的执行，该配置文件需要放在flume根目录的job（自己创建）的文件夹下，其他位置也行，后面命令相应变更即可。

```shell
[root@kk01 flume]# pwd
/opt/software/flume
[root@kk01 flume]# mkdir job
[root@kk01 flume]# cd job/
[root@kk01 job]# vim nc-flume-log.conf
```

 nc-flume-log.conf 文件内容如下

```shell
# example.conf: A single-node Flume configuration

# Name the components on this agent
a1.sources = r1
a1.sinks = k1
a1.channels = c1

# Describe/configure the source
a1.sources.r1.type = netcat
a1.sources.r1.bind = localhost
a1.sources.r1.port = 9999

# Describe the sink
a1.sinks.k1.type = logger

# Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# Bind the source and sink to the channel
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
```

conf文件说明

```shell
a1 即agent，当前flume进程的名字
a1.sources.r1.type = netcat		表示 source 的类型
a1.sinks.k1.type = logger		表示 sink 类型
a1.channels.c1.type = memory	表示 channel 类型
a1.channels.c1.capacity = 1000	表示 1000条数据
a1.channels.c1.transactionCapacity = 100	表示当个事务的容量
```

### **4）启动 flume**

```shell
# 方式一
bin/flume-ng agent --conf conf --conf-file example.conf --name a1 -Dflume.root.logger=INFO,console

# 方式二
bin/flume-ng agent -n $agent_name -c conf -f conf/flume-conf.properties.template

# 参数说明
--conf / -c 表示配置文件存储在conf/目录下
--name / -n 表示给 agent 起名为 a1
--conf-file / -f flume本次启动读取的配置文件是在 conf目录下的 flume-conf.properties.template 文件
-Dflume.root.logger=INFO,console 	
	-D 表示flume运行时动态修改flume.root.logger参数属性值，并将控制台日志打印级别设置为INFO。
		（日志级别包括 log、info、warn、error）
```

```shell
[root@kk01 flume]# 
[root@kk01 flume]# 
[root@kk01 flume]# pwd
/opt/software/flume
[root@kk01 flume]# bin/flume-ng agent -c conf/ -f job/nc-flume-log.conf -n a1 

# 此时如果没有报错信息的话，证明flume已经启动成功了
```

接下来可使用nc命令开启一个客户端，向9999端口号发送消息（需另外开一个终端）

```shell
[root@kk01 applog]# nc localhost 9999
hello
OK			# 这里的ok是由netcat source返回的
world
OK
```

向flume发送消息成功，flume会返回一个OK

Flume采集到消息并打印到控制台

```shell
2023-06-07 08:05:35,840 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - org.apache.flume.sink.LoggerSink.process(LoggerSink.java:95)] Event: { header
s:{} body: 68 65 6C 6C 6F                                  hello }2023-06-07 08:05:35,841 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - org.apache.flume.sink.LoggerSink.process(LoggerSink.java:95)] Event: { header
s:{} body: 77 6F 72 6C 64                                  world }
```

​	可以看到，Flume将收集的消息封装成了**Event** 对象，其中**包含 headers 和 body 两个部分**，而信息的内容包含在body里。

## 演示（taildir source）实时监控目录下的多个追加文件

Taildir Source 适用于**监听多个实时追加的文件**，并能够实现**断点续传**功能。

下面演示的需求是：使用Flume 监听整个目录的实时追加的文件，并上传至HDFS

**1）在conf 目录下创建配置文件 tailder-flume-hdfs.conf** 

我们在flume根目录下的job目录（我们自己创建的目录）下创建  tailder-flume-hdfs.conf 

```shell
[root@kk01 job]# pwd
/opt/software/flume/job
[root@kk01 job]# touch file-flume-hdfs.conf
[root@kk01 job]# ll
total 4
-rw-r--r--. 1 root root   0 Jun  7 08:18 file-flume-hdfs.conf
-rw-r--r--. 1 root root 567 May 28 01:59 nc-flume-log.conf
```

 tailder-flume-hdfs.conf 文件参考配置如下

```shell
# Name the components on this agent
a1.sources = r1
a1.sinks = k1
a1.channels = c1

# Describe/configure the source
a1.sources.r1.type = TAILDIR
a1.sources.r1.filegroups = f1 
a1.sources.r1.filegroups.f1 = /opt/software/flume/files/.* 
a1.sources.r1.positionFile = /opt/software/flume/taildir_position.json

# Describe the sink
a1.sinks.k1.type = logger

# Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# Bind the source and sink to the channel
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
```

注意：

​	必须保证 taildir source 监控的目录是存在的，否则报错 Directory does not exist

**2）创建被监控的目录**

```shell
[root@kk01 flume]# mkdir files
```

**3）测试**

先开启flume

```shell
[root@kk01 flume]# bin/flume-ng agent -c conf/ -f job/file-flume-hdfs.conf -n a1
```

然后再打开一个终端，并在 files目录下创建了一些文件，并在文件内追加了一些内容

```shell
[root@kk01 flume]# cd files/
[root@kk01 files]# ll
total 0
[root@kk01 files]# echo hi >> 1.txt
[root@kk01 files]# echo hello >> 1.txt
```

我们可用看到flume将文件里的内容打印到了控制台

```shell
2023-06-07 08:30:58,729 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - org.apache.flume.sink.LoggerSink.process(LoggerSink.java:95)] Event: { header
s:{} body: 68 69                                           hi }2023-06-07 08:31:13,746 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - org.apache.flume.sink.LoggerSink.process(LoggerSink.java:95)] Event: { header
s:{} body: 68 65 6C 6C 6F                                  hello }
```

此时我们停止flume（ctrt + c）

接着在files目录下创建了文件，并追加了内容

```shell
[root@kk01 files]# echo flume >> 2.txt
[root@kk01 files]# echo hadoop >> 1.txt
[root@kk01 files]# 
```

再次开启 flume，我们发现flume在控制台打印了刚刚关闭flume之后在 files目录下新增的内容，这**说明flume 的 taildir source 拥有断点续传功能**

```shell
[root@kk01 flume]# bin/flume-ng agent -c conf/ -f job/file-flume-hdfs.conf -n a1
....
2023-06-07 08:31:49,692 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - org.apache.flume.sink.LoggerSink.process(LoggerSink.java:95)] Event: { header
s:{} body: 66 6C 75 6D 65                                  flume }2023-06-07 08:31:49,693 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - org.apache.flume.sink.LoggerSink.process(LoggerSink.java:95)] Event: { header
s:{} body: 68 61 64 6F 6F 70                               hadoop }2023-06-07 
```

它是如何实现断点续传功能的呢？答案显然是在 positionFile = /opt/software/flume/taildir_position.json

```shell
[root@kk01 flume]# ll
total 172
....

-rw-r--r--.  1 root root   140 Jun  7 08:41 taildir_position.json
drwxr-xr-x.  2 root root    68 May 11 22:44 tools
[root@kk01 flume]# cat taildir_position.json 
[{"inode":214408104,"pos":6,"file":"/opt/software/flume/files/2.txt"},{"inode":214408106,"pos":16,"file":"/opt/software/flume/files/1.txt"}]
```

显然 taildir_position.json 文件中就存储了关于断点续传的信息， **pos表示的显然就是字节偏移量了**

**4）再次修改 tailder-flume-hdfs.conf 文件**

修改后如下

```shell
# Describe/configure the source
a1.sources.r1.type = TAILDIR
a1.sources.r1.filegroups = f1 f2
a1.sources.r1.filegroups.f1 = /opt/software/flume/files/.* 
a1.sources.r1.filegroups.f2 = /opt/software/flume/files2/.* 
a1.sources.r1.positionFile = /opt/software/flume/taildir_position.json

# Describe the sink
a1.sinks.k1.type = hdfs
a1.sinks.k1.hdfs.path = /flume/%Y%m%d/%H
a1.sinks.k1.hdfs.filePrefix = log-
a1.sinks.k1.hdfs.rollInterval = 10
a1.sinks.k1.hdfs.rollSize = 134217728
a1.sinks.k1.hdfs.rollCount = 0

a1.sinks.k1.hdfs.useLocalTimeStamp = true 

# Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# Bind the source and sink to the channel
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
```

参数说明

```shell
a1.sinks.k1.hdfs.filePrefix = log-		表示文件前缀名
a1.sinks.k1.hdfs.rollInterval = 10		表示没10s将 .tmp文件 转为正式文件
a1.sinks.k1.hdfs.rollSize = 134217728	表示每个文件大小为最大为 134217728byte即 128MB
a1.sinks.k1.hdfs.rollCount = 0			表示每个文件最多存储多少条数据，0表示不启用该参数
```

**5）再次启动Flume测试**

启动Flume之前，先启动 Hadoop集群，因为我们这里演示的是Hadoop发送文件

```shell
[root@kk01 flume]# bin/flume-ng agent -c conf/ -f job/file-flume-hdfs.conf -n a1
```

再另一个终端，输入一些内容

```shell
[root@kk01 files]# echo hello666 >> 1.txt
[root@kk01 files]# echo hello666 >> 1.txt
```

查看Hadoop，发现生成了文件

```shell
[root@kk01 flume]# hadoop fs -ls /flume
Found 1 items
drwxr-xr-x   - root supergroup          0 2023-06-07 09:18 /flume/20230607
[root@kk01 flume]# hadoop fs -ls /flume/20230607
Found 1 items
drwxr-xr-x   - root supergroup          0 2023-06-07 09:18 /flume/20230607/09
[root@kk01 flume]# hadoop fs -ls /flume/20230607/09
Found 2 items
-rw-r--r--   3 root supergroup        143 2023-06-07 09:18 /flume/20230607/09/log-.1686143881090
-rw-r--r--   3 root supergroup        143 2023-06-07 09:18 /flume/20230607/09/log-.1686143925185
```

### Taildir 说明

Taildir source 维护了一个 json 格式的 position File，其会定期的往  position File 中更新每个文件读取到的最新位置，因此能够实现**断点续传**功能。 position File 的格式如下

```json
[{"inode":214408104,"pos":6,"file":"/opt/software/flume/files/2.txt"},{"inode":214408106,"pos":34,"file":"/opt/software/flume/files/1.txt"},{"inode":5672023,
"pos":6,"file":"/opt/software/flume/files2/1.txt"}]
```

注：

​	Linux 中存储文件元数据的区域就叫做 inode，每个 inode 都有一个号码，操作系统用 inode 号码来识别不同的文件，Unix/Linux 系统内部不使用文件名，而使用inode号码来识别文件。**Taildir Source 使用 inode 和文件的全路径一起识别同一个文件名，所以修改文件名之后如果表达式也能匹配得上，会重新读取一份文件得数据。**
