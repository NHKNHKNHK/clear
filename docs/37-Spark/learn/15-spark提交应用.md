# Spark提交应用

## 简单回顾在集群上运行Spark应用的过程

1）用户通过 spark-submit 脚本提交应用

2）spark-submit 脚本启动驱动器程序（Driver Program），调用用户定义的main() 方法

3）驱动器程序与集群管理器（Cluster Manager）通信，申请资源以启动执行器节点（在Stand alone模式下成为Worker）。

4）集群管理器为驱动器程序启动执行器节点。

5）驱动器进程执行用户应用中的操作（即我们编写的代码）。根据应用程序中定义的对RDD的转换操作和行动操作，驱动器节点把工作以任务（Task）的形式发送到执行器进程（Executor）

6）任务在执行器程序中进行计算并保存结果

7）如果驱动器程序的 main() 方法退出，或者调用了 sc.stop()，驱动器程序会终止执行器进程，并且通过集群管理器释放资源。

 

## Spark应用提交

我们需要将我们编写的程序（Scala或Java编写的）打成jar包，提交至服务器进行执行（本地模式、Standalone集群或YARN集群等），类似于MapReduce程序开发流程

无论我们使用哪一种方式提交任务，都会使用Spark为我们提供的统一脚本用于提交任务：

```shell
$SPARK_HOME/bin/spark-submit 
```

### spark-submit提交应用的格式

```shell
Usage: spark-submit [options] <app jar | python file | R file> [app arguments]
```

-   `[options]`	表示要传给spark-submit的标记列表，可以使用 spark-submit --help 查看所有可接收的标记
-   `<app jar | python file | R file>`	表示包含应用入口的 Jar包 或 Python脚本 或 R语言脚本
-   `[app arguments]`	表示要传给应用的选项

```shell
[nhk@kk01 ~]$ $SPARK_HOME/bin/spark-submit --help
Usage: spark-submit [options] <app jar | python file | R file> [app arguments]
Usage: spark-submit --kill [submission ID] --master [spark://...]
Usage: spark-submit --status [submission ID] --master [spark://...]
Usage: spark-submit run-example [options] example-class [example args]

Options:
  --master MASTER_URL         spark://host:port, mesos://host:port, yarn,
                              k8s://https://host:port, or local (Default: local[*]).
  --deploy-mode DEPLOY_MODE   Whether to launch the driver program locally ("client") or
                              on one of the worker machines inside the cluster ("cluster")
                              (Default: client).
  --class CLASS_NAME          Your application's main class (for Java / Scala apps).
  --name NAME                 A name of your application.
  --jars JARS                 Comma-separated list of jars to include on the driver
                              and executor classpaths.
  --packages                  Comma-separated list of maven coordinates of jars to include
                              on the driver and executor classpaths. Will search the local
                              maven repo, then maven central and any additional remote
                              repositories given by --repositories. The format for the
                              coordinates should be groupId:artifactId:version.
  --exclude-packages          Comma-separated list of groupId:artifactId, to exclude while
                              resolving the dependencies provided in --packages to avoid
                              dependency conflicts.
  --repositories              Comma-separated list of additional remote repositories to
                              search for the maven coordinates given with --packages.
  --py-files PY_FILES         Comma-separated list of .zip, .egg, or .py files to place
                              on the PYTHONPATH for Python apps.
  --files FILES               Comma-separated list of files to be placed in the working
                              directory of each executor. File paths of these files
                              in executors can be accessed via SparkFiles.get(fileName).
  --archives ARCHIVES         Comma-separated list of archives to be extracted into the
                              working directory of each executor.

  --conf, -c PROP=VALUE       Arbitrary Spark configuration property.
  --properties-file FILE      Path to a file from which to load extra properties. If not
                              specified, this will look for conf/spark-defaults.conf.

  --driver-memory MEM         Memory for driver (e.g. 1000M, 2G) (Default: 1024M).
  --driver-java-options       Extra Java options to pass to the driver.
  --driver-library-path       Extra library path entries to pass to the driver.
  --driver-class-path         Extra class path entries to pass to the driver. Note that
                              jars added with --jars are automatically included in the
                              classpath.

  --executor-memory MEM       Memory per executor (e.g. 1000M, 2G) (Default: 1G).

  --proxy-user NAME           User to impersonate when submitting the application.
                              This argument does not work with --principal / --keytab.

  --help, -h                  Show this help message and exit.
  --verbose, -v               Print additional debug output.
  --version,                  Print the version of current Spark.

 Cluster deploy mode only:
  --driver-cores NUM          Number of cores used by the driver, only in cluster mode
                              (Default: 1).

 Spark standalone or Mesos with cluster deploy mode only:
  --supervise                 If given, restarts the driver on failure.

 Spark standalone, Mesos or K8s with cluster deploy mode only:
  --kill SUBMISSION_ID        If given, kills the driver specified.
  --status SUBMISSION_ID      If given, requests the status of the driver specified.

 Spark standalone, Mesos and Kubernetes only:
  --total-executor-cores NUM  Total cores for all executors.

 Spark standalone, YARN and Kubernetes only:
  --executor-cores NUM        Number of cores used by each executor. (Default: 1 in
                              YARN and K8S modes, or all available cores on the worker
                              in standalone mode).

 Spark on YARN and Kubernetes only:
  --num-executors NUM         Number of executors to launch (Default: 2).
                              If dynamic allocation is enabled, the initial number of
                              executors will be at least NUM.
  --principal PRINCIPAL       Principal to be used to login to KDC.
  --keytab KEYTAB             The full path to the file that contains the keytab for the
                              principal specified above.

 Spark on YARN only:
  --queue QUEUE_NAME          The YARN queue to submit to (Default: "default").
```

### 基本参数配置

提交运行 Spark Application时，有些基本参数需要传递，如下：

```shell
# 表示应用运行的模式
# 可以是local，也可以是集群，例如：
#	spark://host:port	连接到指定端口的spark独立集群（standalone）默认spark独立主节点使用7070端口
#	mesos://host:port	连接到指定端口的Mesos集群上。默认情况下Mesos主节点监听5050端口
#	yarn	连接到yarn集群。当在yarn上运行时，需要设置环境变量HADOOP_CONF_DIR指向Hadoop配置目录，以获取集群信息
#	k8s://https://host:port	
#	local		运行本地模式，使用单核
#	local[k]	运行本地模式，使用N个核心
# 	local[*]	运行本地模式，使用尽可能多的核心
--master MASTER_URL

# 表示Driver Program（驱动管理器）运行的地方（也叫做应用部署模式）
# 可填：本地启动驱动程序(“client”)或在集群(“cluster")，默认值:client)
--deploy-mode DEPLOY_MODE

# 表示运行Spark Application的类名称（即运行Java或Spark程序时应用的主类），注意为类的全限定名
--class CLASS_NAME

# 表示应用程序的名称，我们通常会在代码中指定
--name NAME

# 表示应用的类所依赖的第三方的jar包指定路径，通常在本地文件系统中，多个jar包使用逗号分隔
--jars JARS

# 需要放到应用工作目录中的文件列表。该参数一般用来放需要分到各节点的数据文件
--files FILES 

# 需要添加到PYTHONPATH在的文件的列表。其中可以包含 .py、.egg以及 .zip文件
--py-files PY_FILES

# 表示应用运行时指定的某些参数配置
--conf PROP=VALUE

# 当value中值有空格组成的时候，使用双引号将key=value引起来
--conf "PROP=VALUE"
```

动态加载Spark Application运行时的参数，通过--conf进行指定，使用方式如下：

```shell
# 第一种方式：属性的值中没有空格	
--conf spark.eventLog.enabled=false

# 当value中值有空格组成的时候，使用双引号将key=value引起来
--conf "spark.executors.extraJavaOptions=-XX:+PrintGCDetails -XX:+PrintGCTimeStamps"
```

### Driver Program 参数配置

每个Spark Application运行时都会有一个Driver Program，属于一个JVM Process，可以设置Memory 和 CPU Core

```shell
# 指定Driver Program JVM进程内存大小  (e.g. 1000M, 2G) (Default: 1024M)
--driver-memory MEM

# 表示Driver运行CLASS PATH路径，使用的不多
--driver-class-path

# Spark standalone with cluster deploye mode：运行在standalone中cluster deploy mode，默认值为1 
--driver-cors NUM

# 运行在YARN in cluster mode，默认值为1
--driver-cores NUM 

# 运行在standalone的中的cluster Deploy Mode下，表示当Driver运行异常失败，可以自己重启
--supervise
```

### Executor 参数配置(难点)

每个Spark Application运行时，需要启动Executor运行Task，需要指定Executor个数及每个Executor资源信息（Memory 和 CPU Core）

```shell
# Executor运行所需的内存大小 (e.g. 1000M, 2G) (Default: 1G).
--executor-memory MEM       

# Executor运行的CPU Cores
# 默认情况下，在Standalone集群下为worker节点所有可用的CPU Cores
# 在YARN集群下，默认为1
--executor-cores NUM  

# 表示运行在Standalone集群下，所有Executor的CPU Cores。结合 --executor-cores计算出Executor个数
--total-executor-cores NUM 


# 表示在YARN集群下，Executor的个数，默认值为2
--num-executors NUM    

# 表示Executor运行的队列  (Default: "default").
--queue QUEUE_NAME        
```



## Local模式

### Local模式提交应用

```shell
[root@kk01 bin]# ./spark-submit \
--class org.apache.spark.examples.SparkPi \
--master local[2] \
./examples/jars/spark-examples_2.13-3.2.0.jar \
10

# --class 表示要执行的程序的主类（可以可以根据我们自己编写的程序做出相应修改）
# --master local[2] 部署模式，默认为本地模式，数字表示分配的虚拟cpu核数量
# spark-examples_2.13-3.2.0.jar 运行的应用类所在的jar包（实际使用时可设定为我们自己打的jar报）
# 数字10表示程序的入口参数，用于设定当前应用的任务数量
```



## Standalone模式

### Standalone任务执行原理

这种模式下， Driver 和 Worker 是启动在节点上的进程，运行在JVM 中的进程

-   Driver 与集群节点之间有**频繁的通信**。
-   Driver 负责**任务（task）的分发和结果的回收** 即任务的调度。如果task的计算结果非常大就不要回收了。会造成OOM
-   **Worker** 是 Standalone 资源调度框架里面资源管理的从节点，也是**JVM进程**
-   **Master** 是 Standalone 资源调度框架里面资源管理的主节点，也是**JVM进程**

简单来说，

​	Master类似于 yarn的 RM，Driver类似于 yarn的 AM，Slaves类似于 yarn的 NM

​	Worker、Master是常驻进程、Driver是当有任务来时才会启动	

### Standalone 架构

Standalone集群在进程上主要有三类进程：

-   **主节点 Master 进程：**

Master角色，**管理整个集群资源**，并托管运行各个任务的Driver

-   **从节点 Workers 进程：**

Worker角色，**管理它所在机器的资源**，分配对应的资源来运行 Executor（Task）

每个从节点分配资源信息给Worker管理，资源信息包含内存Memory 和 CPU Cores核数

-   **历史服务器HistoryServer（可选）**

Spark Application 运行完成以后，保存事件日志数据至HDFS，启动HistoryServer 可以查看运行相关信息



Standalone是完整的 spark运行环境，其中

-   Master角色以**Master进程**存在，Worker角色以**Worker进程**存在
-   Driver角色在运行时存在于 Master进程内，负责某任务的资源管理，**Executor 运行于 Worker进程内**（以线程的方式运行在Worker中），负责某任务的执行



### client 模式提交

```shell
[root@kk01 spark-standalone]# bin/spark-submit \
--class org.apache.spark.examples.SparkPi \
--master spark://kk01:7077 \
./examples/jars/spark-examples_2.13-3.2.0.jar \
10


# --class 表示要执行的程序的主类（可以可以根据我们自己编写的程序做出相应修改）
# --master spark://kk01:7077 独立部署模式，连接到Spark集群
# spark-examples_2.13-3.2.0.jar 运行的应用类所在的jar包
# 数字10表示程序的入口参数，用于设定当前应用的任务数量
```

-   执行任务时，会产生多个Java进程

    ​	**CoarseGrainedExecutorBackend  执行节点进程**

    ​	**SparkSumbit 提交节点进程**

-   执行任务时，默认采用服务器集群节点的总核数，每个节点内存1024M。



#### standalone client 任务执行流程

1.  **client** 模式提交任务后，会在客户端**启动 Driver进程**
2.  **Driver** 会向 **Master** 申请启动 **Application** 启动的资源
3.  资源申请成功，Driver 端将 task 分发到worker 端执行，启动 executor进程（任务的分发）
4.  Worker 端(executor进程) 将task 执行结果返回到 Driver 端（任务结果的回收）

**总结：**

​	**client模式适用于测试调试程序。**Driver进程是在客户端启动的，这里的客户端指的是提交应用程序的当前节点。在Driver端可以看到 task执行的情况

​	**生成环境中不能使用client模式。**因为：假设要提交100个application 到集群运行，Driver每次都会在 client端启动，那么就会导致客户端100网卡流量暴增的问题。



### cluster 模式提交

```shell
[root@kk01 spark-standalone]# bin/spark-submit \
--class org.apache.spark.examples.SparkPi \
--master spark://kk01:7077 \
--deploy-mode cluster 
./examples/jars/spark-examples_2.13-3.2.0.jar \
10
```

#### standalone cluster 任务执行流程

1.  **cluster** 模式提交应用程序后，会向 **Master** 请求启动 **Driver**
2.  **Master** 接受请求，**随机**在**集群的一台节点启动 Driver 进程**
3.  **Driver** 启动后为当前的应用程序**申请资源**
4.  Driver 端发送 task 到 worker节点上执行（任务的分发）
5.  worker 上的 executors 进程将 执行的情况和执行结果返回到 Driver 端（任务结果的回收）

注意：

-   **Driver 进程是在集群某一台 Worker上启动的**，在提交 application 的**客户端是无法查看 task 的执行情况**的
-   假设要提交100个application 到集群运行，每次 Driver 都会在集群中随机某一台 Worker 上启动，那么这100次网卡流量暴增的问题就不会散布在集群的单个节点上。

### 总结

standalone 两种方式提交任务，**Driver** 与集群的通信（即所谓功能）包括：

-   应用程序资源的申请
-   任务的分发
-   结果的回收
-   监控 task 执行情况

### 提交到HA 集群

```shell
[root@kk01 spark-standalone]# bin/spark-submit \
--class org.apache.spark.examples.SparkPi \
--master spark://kk01:7077,kk02:7077 \
./examples/jars/spark-examples_2.13-3.2.0.jar \
10
```



## Spark on YARN 

当Spark Application连接到yarn集群上运行时，需要设置环境变量HADOOP_CONF_DIR指向Hadoop配置目录，以获取集群信息

### client 模式提交

```shell
[root@kk01 spark-yarn]# bin/spark-submit \
--class org.apache.spark.examples.SparkPi \
--master yarn \
./examples/jars/spark-examples_2.13-3.2.0.jar \
10

# 或

[root@kk01 spark-yarn]# bin/spark-submit \
--class org.apache.spark.examples.SparkPi \
--master yarn-client \
./examples/jars/spark-examples_2.13-3.2.0.jar \
10

# 或 

[root@kk01 spark-yarn]# bin/spark-submit \
--class org.apache.spark.examples.SparkPi \
--master yarn \
--deploy-mode client \
./examples/jars/spark-examples_2.13-3.2.0.jar \
10
```

#### yarn client 任务执行流程

1.  客户端提交一个 Application，在客户端会启动一个 Driver进程
2.  应用程序启动后会向 RM(ResourceMananger)（相当于 standalone模式下的master进程）发送请求，启动AM(ApplicationMaster)
3.  RM收到请求，随机选择一台 NM(NodeManager)启动AM。这里的NM相当于standalone中的Worker进程
4.  AM 启动后，会向 RM 请求一批 container资源，用于启动Executor
5.  RM会找到一批 NM(包含container)返回给AM，用于启动Executor
6.  AM 会向 NM发送命令启动 Executor
7.  **Executor**启动后，会**方向注册**给 **Driver**，Driver发送 task 到 Executor ，执行情况和结果返回给Driver端

**总结：**

​	**yarn-client模式同样是适用于测试**，**因为Driver 运行在本地**，Driver会与yarn集群中的Executor 进行大量的通信，提交的 application 过多同样会造成客户机网卡流量的大量增加（网卡流量激增问题）



ApplicationMaster（executorLauncher）在此模式中的作用：

-   为当前的 Application 申请资源
-   给 NodeManager 发送消息启动 Executor

注意：**ApplicationMaster** 在此模式下有 **launchExecutor** 和 **申请资源**的功能，**没有作业调度的功能**



### cluster 模式提交

```shell
[root@kk01 spark-yarn]# pwd
/opt/software/spark-yarn
[root@kk01 spark-yarn]# bin/spark-submit \
--class org.apache.spark.examples.SparkPi \
--master yarn \
--deploy-mode cluster \
./examples/jars/spark-examples_2.13-3.2.0.jar \
10

# 或者

[root@kk01 spark-yarn]# pwd
/opt/software/spark-yarn
[root@kk01 spark-yarn]# bin/spark-submit \
--class org.apache.spark.examples.SparkPi \
--master yarn-cluster \
./examples/jars/spark-examples_2.13-3.2.0.jar \
10
```

#### yarn cluster 任务执行流程

1.  客户机提交 Application 应用程序，发送请求到 RS（ResourceManager），请求启动AM（ApplicationMaster）
2.  RS 收到请求后随机在一台 NM（NodeManager）上启动AM（相当于Driver端）
3.  AM 启动，AS 发送请求到 RS，请求一批 contains 用于启动 Excutor
4.  RS 返回一批 NM 给 AN
5.  AM 连接到 NM，发送请求到 NM 启动 Executor
6.  Executor 反向注册到 AM 所在的节点的 Driver。Driver 发送 task 到 Executor

**总结：**

​	Yarn-Cluster 主要用于生产环境中，因为 Driver 运行在 Yarn 集群中某一台NodeManager 中，每次提交任务的 Driver 所在的机器都是不再是是提交任务的客户端机器，而是多个 NM 节点中的一台，不会产生某一台机器网卡流量激增的现象。

​	但同样也有缺点，**任务提交后不能看到日志。只能通过 yarn查看日志**



ApplicationMaster（executorLauncher）在此模式中的作用：

-   为当前的 Application 申请资源
-   给 NodeManager 发送消息启动 Executor
-   **任务调度**



停止集群任务命令(这条命令了解即可，少用)

```shell
yarn application -kill applicationID
```

查看application 对应日志

```shell
yarn logs --applicationId applicationID
```

查看对应日志需要在 yarn-site.xml 中添加如下内容，开启日志聚合

```xml
<!-- 开启日志聚集-->
        <property>
                <name>yarn.log-aggregation-enable</name>
                <value>true</value>
        </property>
        <!-- 设置yarn历史服务器地址-->
        <property>
                <name>yarn.log.server.url</name>
                <value>http://kk01:19888/jobhistory/logs</value>
        </property>
 		<property>
                <name>yarn.nodemanager.remote-app-log-dir</name>
                <value>/tmp/logs</value>
        </property>	
        <!-- 历史日志保存的时间 7天-->
        <property>
                <name>yarn.log-aggregation.retain-seconds</name>
                <value>604800</value>
        </property>

```

### 总结

Spark On YARN 由两种运行模式，Client、Cluster

这两种模式的区别在于 Driver运行的位置

-   Client模式：**Driver运行在客户端进程中（集群的通信成本高）**，比如Driver运行在spark-submit程序的进程中
-   Cluster模式：即**Driver运行在YARN容器内部（集群的通信成本低）**，和 ApplicationMaster在同一个容器内
    -    Driver的输出结果不能显示在客户端

**Spark On Yarn的本质**

-   Master 角色由YARN的 ResourceManager 担任
-   Worker 角色由YARN的NodeManager 担任
-   Dricer 角色运行在**YARN容器**内 或 **提交任务的客户端进程**中
-   真正干活的**Executor运行在YARN提供的容器**内



## spark-submit提交应参数

```
Usage: spark-submit [options] <app jar | python file | R file> [app arguments]
```

```shell
--master MASTER_URL
可以是 spark://host:port, mesos://host:port, yarn，k8s://https://host:port，或local(默认:local[*])。 

--deploy-mode DEPLOY_MODE
是否在本地启动驱动程序(“client”)或在集群(“cluster”)中的一个工作机器上(默认值:client)

--class CLASS_NAME
应用程序的主类(用于Java / Scala应用程序)。

--name NAME
应用程序的名称。

--jars JARS
逗号分隔本地的JARS Driver和Executor依赖的第三方jar包

--files FILES 
用逗号分隔列表的目录。会放置在每个 Executor工作目录中

--conf, -c PROP=VALUE
spakr的配置属性

--driver-memory MEM
Driver程序使用的内存大小 (e.g. 1000M, 2G) (Default: 1024M).

--executor-memory MEM       
每个 executor 的内存大小 (e.g. 1000M, 2G) (Default: 1G).

```



## 榨干集群性能

查看cpu有几核的命令

```shell
cat /proc/cpuinfo | grep processor | wc -l
```

查看内存

```shell
free -g
```

例子

​	假设通过命令查看，经过计算得知，我们集群有3台机器，总共 16G内存，6核心CPU的计算资源

所有我们可以使用如下方式榨干集群性能

```
bin/spark-submit --master yarn \
--executor-memory 2g \
--executor-cores 1 \
--num-executors 6 

# 即让 6个executor干活，每个executor分配一个核cpu 2g内存，当然实际中还应该考虑集群中是否有其他进程消耗内存
```

