# MR程序运行模式

## 1 MapReduce程序运行模式

运行模式指的是单机运行还是分布式运行

- ​运行模式取决于参数 **mapreduce.framework.name**
  - 参数value：
    - ​yarn：YARN集群模式
    - ocal：本地模式（**默认**方式）

- ​若在Hadoop配置文件mapred-default.xml中为定义，在代码中（conf.set()）也未定义，则默认是local模式

- ​如果在任意位置设置了，都会覆盖默认方式

### 1.1 YARN集群模式

MapReduce程序提交给yarn集群，分发到多个节点上分布式并发执行。数据通常位于HDFS

yarn集群所需配置参数:

```shell
mapred-default.xml 定义 mapreduce.framework.name=yarn
或在代码中conf.set("mapreduce.framework.name","yarn")
yarn.resourcemanager.hostname 
```

MapReduce程序提交给yarn集群实现步骤：

​	1、确保Hadoop集群启动（HDFS集群、YARN集群）

​	2、将程序打包成jar包，上传jar包到Hadoop集群上任意节点

​	3、执行命令启动，命令如下：

```
hadoop jar XXXX.jar XXX...主类 agrs
或者使用下面命令提交程序也可以
yarn jar  XXXX.jar XXX...主类 agrs

其中
	如果在 mainClass标签填写主程序入口 ，则  XXX...主类 可以省略
	args 参数数组也是按照情况传入的
```

### 1.2 Local本地模式

MapReduce程序提交给LocalJobRunner在本地单进程形式运行，是单击程序

- 在本地模式情况下，输入输出的数据可以在本地文件系统，也可以在HDFS上。
- 本地模式非常便于进行业务逻辑的debug
- 在idea右键直接运行main方法所在主类即可

注意：

​	想要在本地运行，要保证mapreduce.framework.name=local

​	在idea中运行时记得要去 Eidt Configuration 给 args数组传入相应参数

## 2 如何区分MapReduce运行模式

**方法一：登录YARN集群查看**，是否有程序执行过的记录，这是最准确可靠的方法

**方法二：通过查看执行日志**

​	如果执行的job作业编号有local关键字，就说明处于本地模式
