# Hadoop2、3新特性

## 1 Hadoop2.0新特性

Hadoop1.0与Hadoop2.0的区别

| 组件      | Hadoop1.0的局限与不足                      | Hadoop2.0的改进                |
| :-------- | ------------------------------------------ | ------------------------------ |
| HDFS      | NameNode存在单点故障的风险                 | HDFS引入了高可用机制           |
| MapReduce | JobTracker存在断电故障风险，且内存扩展受限 | 引入了一个资源管理调度框架YARN |

### 1.1 HDFS存在的问题

1.  NameNode单点故障使其难以应用于在线场景
2.  NameNode压力过大，且内存受限，影响系统扩展性

### 1.2 MapReduce存在在问题

1.  JobTracker单点故障
2.  JobTracker访问压力大，影响系统扩张性
3.  难以支持除MapReduce之外的计算框架，如Spark、Strom、Tez等

### 1.3 HDFS2.0解决HDFS1.0中的问题

-   解决单点故障。HDFS HA有两个NameNode，如果活跃的NameNode发生故障，则切换到备用NameNode。
-   解决内存受限问题。HDFS Federation（联邦）水平扩展方案支持多个NameNode，每个NameNode分管一部分目录，所有NameNode共享所有DataNode存储资源
-   仅是架构上发生了变化，使用方式不变，对HDFS使用者透明



## 2 Hadoop 3.0新特性

Hadoop 3.0在功能和性能方面，对hadoop内核进行了多项重大改进，主要包括：

 **通用性**

1.精简Hadoop内核，包括剔除过期的API和实现，将默认组件实现替换成最高效的实现。

2.Classpath isolation：以防止不同版本jar包冲突

3.Shell脚本重构： Hadoop 3.0对Hadoop的管理脚本进行了重构，修复了大量bug，增加了新特性。

**HDFS**

Hadoop3.x中Hdfs在可靠性和支持能力上作出很大改观：

1.HDFS支持数据的擦除编码，这使得HDFS在不降低可靠性的前提下，节省一半存储空间。

2.多NameNode支持，即支持一个集群中，一个active、多个standby namenode部署方式。注：多ResourceManager特性在hadoop 2.0中已经支持。

**HDFS纠删码**

-   在Hadoop3.X中，HDFS实现了Erasure Coding这个新功能。Erasure coding纠删码技术简称EC，是一种数据保护技术.最早用于通信行业中数据传输中的数据恢复，是一种编码容错技术。
-   它通过在原始数据中加入新的校验数据，使得各个部分的数据产生关联性。在一定范围的数据出错情况下，通过纠删码技术都可以进行恢复。
-   hadoop-3.0之前，HDFS存储方式为每一份数据存储3份，这也使得存储利用率仅为1/3，hadoop-3.0引入纠删码技术(EC技术)，实现1份数据+0.5份冗余校验数据存储方式。
-   与副本相比纠删码是一种更节省空间的数据持久化存储方法。标准编码(比如Reed-Solomon(10,4))会有1.4 倍的空间开销；然而HDFS副本则会有3倍的空间开销。

**支持多个NameNodes** 

-   ​     最初的HDFS NameNode high-availability实现仅仅提供了一个active NameNode和一个Standby NameNode；并且通过将编辑日志复制到三个JournalNodes上，这种架构能够容忍系统中的任何一个节点的失败。
-   ​    然而，一些部署需要更高的容错度。我们可以通过这个新特性来实现，其允许用户运行多个Standby NameNode。比如通过配置三个NameNode和五个JournalNodes，这个系统可以容忍2个节点的故障，而不是仅仅一个节点。

**MapReduce**

Hadoop3.X中的MapReduce较之前的版本作出以下更改：

1.Tasknative优化：为MapReduce增加了C/C++的map output collector实现（包括Spill，Sort和IFile等），通过作业级别参数调整就可切换到该实现上。对于shuffle密集型应用，其性能可提高约30%。

2.MapReduce内存参数自动推断。在Hadoop 2.0中，为MapReduce作业设置内存参数非常繁琐，一旦设置不合理，则会使得内存资源浪费严重，在Hadoop3.0中避免了这种情况。

Hadoop3.x中的MapReduce添加了Map输出collector的本地实现，对于shuffle密集型的作业来说，这将会有30%以上的性能提升。

 **其他**

**默认端口更改**

-   ​    在hadoop3.x之前，多个Hadoop服务的默认端口都属于Linux的临时端口范围（32768-61000）。这就意味着用户的服务在启动的时候可能因为和其他应用程序产生端口冲突而无法启动。
-   ​    现在这些可能会产生冲突的端口已经不再属于临时端口的范围，这些端口的改变会影响NameNode, Secondary NameNode, DataNode以及KMS。与此同时，官方文档也进行了相应的改变，具体可以参见 HDFS-9427以及HADOOP-12811。 

Namenode ports: 50470 --> 9871, 50070--> 9870, 8020 --> 9820

Secondary NN ports: 50091 --> 9869,50090 --> 9868

Datanode ports: 50020 --> 9867, 50010--> 9866, 50475 --> 9865, 50075 --> 9864

Kms server ports: 16000 --> 9600 (原先的16000与HMaster端口冲突) 

**YARN** **资源类型**

YARN 资源模型（YARN resource model）已被推广为支持用户自定义的可数资源类型（support user-defined countable resource types），不仅仅支持 CPU 和内存。

比如集群管理员可以定义诸如 GPUs、软件许可证（software licenses）或本地附加存储器（locally-attached storage）之类的资源。YARN 任务可以根据这些资源的可用性进行调度。

### 2.1 短路本地读取（Short Circuit Local Reads）

-   在HDFS中，不管是Local Reads（DFSClient和DataNode在同一个节点）还是Remtoe Reads（DFSClient和DataNode不在同一个节点），底层处理方式都是先有DataNode读取数据，然后再通过PRC（基于TCP）把数据传给DFSClient。这个处理是比较简单的，但是需要DataNode在中间做一次中转，性能会受到影响。
-   尤其**Local Reads的时候，既然DFSClient和数据是在一个机器上面，那么很自然的想法，就是让DFSClient绕开Datanode自己去读取数据**。所谓的“短路”读取绕过了DataNode，从而允许客户端直接读取文件。显然，这仅在客户端与数据位于同一机器的情况下才可行。短路读取为许多应用提供了显着的性能提升。

#### 2.1.1 老版本的实现

-   lHDFS-2246这个JIRA中，工程师们的想法是既然读取数据DFSClient和数据在同一台机器上，那么Datanode就**把数据在文件系统中的路径，从什么地方开始读(offset)和需要读取多少(length)等信息告诉DFSClient，然后DFSClient去打开文件自己读取**。
-   想法很好，问题在于配置复杂以及安全问题
-   首先是配置问题，因为是让DFSClient自己打开文件读取数据，那么就需要配置一个白名单，定义哪些用户拥有访问Datanode的数据目录权限。
-   如果有新用户加入，那么就得修改白名单。需要注意的是，这里是允许客户端访问Datanode的数据目录，也就意味着，任何用户拥有了这个权限，就可以访问目录下其他数据，从而导致了安全漏洞。
-   因此，**这个实现已经不建议使用了**。

#### 2.1.2 安全性改进版的实现

-   在HDFS-347中，提出了一种新的解决方案，让短路本地读取数据更加安全
-   在Linux中，有个技术叫做**Unix Domain Socket**。Unix Domain Socket是一种**进程间的通讯方式**，它使得同一个机器上的两个进程能以Socket的方式通讯。
-   它带来的另一大好处是，利用它两个进程除了可以传递普通数据外，还可以**在进程间传递文件描述符**

1）假设机器上的两个用户A和B，A拥有访问某个文件的权限而B没有，而B又需要访问这个文件

2）借助Unix Domain Socket，可以让A打开文件得到一个文件描述符，然后把文件描述符传递给B，B就能读取文件里面的内容了即使它没有相应的权限。

3）在HDFS的场景里面，A就是Datanode，B就是DFSClient，需要读取的文件就是Datanode数据目录中的某个文件

#### **2.1. 3短路本地读取的实现**

**1）配置 libhadoop.so**

应为Java不能直接操作Unix Domain Socket，所以需要安装Hadoop的native包 libhadoop.so。在编译Hadoop源码的时候可用通过编译native模块获取。使用如下命令可以检测native包是否安装好

```shell
hadoop checknative

# 输出的部分内容
Native library checking:
hadoop:  true /opt/software/hadoop-3.2.2/lib/native/libhadoop.so.1.0.0
zlib:    true /lib64/libz.so.1
zstd  :  false 
snappy:  true /lib64/libsnappy.so.1
lz4:     true revision:10301
bzip2:   true /lib64/libbz2.so.1
openssl: false Cannot load libcrypto.so (libcrypto.so: cannot open shared object file: No such fi
le or directory)!ISA-L:   false libhadoop was built without ISA-L support
PMDK:    false The native code was built without PMDK support.
```

​	**2）配置 hdfs-site.xml**

-   dfs.client.read.shortcircuit 是打开短路本地读取功能的开关
-   dfs.domain.socket.path 是DataNode和DFSClient之间沟通的Socket的本地路径

```xml
<property>
	<name>dfs.client.read.shortcircuit</name> 
	<value>true</value></property>
<property> 
	<name>dfs.domain.socket.path</name>
	<value>/var/lib/hadoop-hdfs/dn_socket</value>
</property>
```

-   还需要确保Socket本地路径提前创建好

```shell
mkdir -p /var/lib/hadoop-hdfs
```

**注意：这里创建的hadoop-hdfs是文件夹，而上述配置中dn_socket是datanome自己创建的文件**

**3）查看配置生效的方式**

**方式1**：查看DataNode日志

在DataNode的启动日志中，看到如下相关信息的日志表明Unix Domain Socket被启用

```shell
# 进入logs目录，查看
[root@kk01 logs]# pwd
/opt/software/hadoop-3.2.2/logs
[root@kk01 logs]# cat hadoop-root-datanode-kk01.log|grep dn_socket

# 看到如下信息，说明Unix Domain Socket被启用
2023-04-04 11:35:20,258 INFO org.apache.hadoop.hdfs.server.datanode.DataNode: Listening on UNIX domain socket: /var/lib/hadoop-hdfs/dn_socket
```

**方式2**：读取一个文件到本地

使用命令找出文件的数据块位置信息，到对应的机器上进行本地下载操作

下载完毕，打开DataNode日志。日志中的下面信息表明读取的时候用到了Short Circuit Local Reads

形式 REQUEST_SHORT_CIRCUIT_FDS 这种字样

```shell
hdfs fsck /zookeeper.out -files -blocks
hadoop fs -get /zookeeper.out /tmp/

INFO DataNode.clienttrace，(DataXceiver.java:requestShortCircuitFds(334)) - src: 127.0.0.1, dest: 127.0.0.1, op: REQUEST_SHORT_CIRCUIT_FDS, blockid: 1073741962, srvID: 4ff4d539-1bca-480d-91e3-e5dc8c6bc4a8, success: true

```

**方式3**：ReadStatistics API

通过HdfsDataInputStream的getReadReadStatistics API来获取读取数据的统计信息

```java
public class FileSystemCat {    
	public static void main(String[] args) throws IOException {
    	String uri = args[0];
        Configuration conf = new Configuration();
        FileSystem fs = FileSystem.get(URI.create(uri), conf);
        OutputStream out = new FileOutputStream("/tmp/out");
        FSDataInputStream in = null;
        try {
        	in = fs.open(new Path(uri));
            IOUtils.copy(in, out);
            if (in instanceof HdfsDataInputStream) {
            	HdfsDataInputStream hdfsIn = (HdfsDataInputStream) in;
                DFSInputStream.ReadStatistics readStatistics =hdfsIn.getReadStatistics();
                System.out.println("Total Bytes Read Bytes: " + readStatistics.getTotalBytesRead());
                System.out.println("Short Circuit Read Bytes: " + readStatistics.getTotalShortCircuitBytesRead());
                System.out.println("Local Read Bytes:" + readStatistics.getTotalLocalBytesRead());
                }
            } finally {
                IOUtils.closeQuietly(in);
                IOUtils.closeQuietly(out);
            }
    }
}

```

```shell
[root@kk01 ~]# hadoop FileSystemCat /zookeeper.out
Total Bytes Read Bytes: 109028097
Short Circuit Read Bytes: 109028097
Local Read Bytes:109028097

```

### 1.3 HDFS Block负载平衡器 Balancer（hadoop3.0）

-   HDFS数据可能并不总是在DataNode之间均匀分布。一个常见的原因是向现有群集中添加了新的DataNode。HDFS提供了一个**Balancer程序**，分析block放置信息并且**在整个DataNode节点之间平衡数据**，直到被视为平衡为止。
-   所谓的平衡指的是**每个DataNode的利用率**（本机已用空间与本机总容量之比）与**集群的利用率**（HDFS整体已用空间与HDFS集群总容量的比）之间相差不超过给定阈值百分比。 
-   平衡器无法在单个DataNode上的各个卷（磁盘）之间进行平衡。

**命令行配置**

```shell
# 查看帮助信息
hdfs balancer --help

-threshold  10    # 集群平衡的条件,datanode间磁盘使用率相差阈值,区间择:0~100
-policy datanode  # 平衡策略,默认为datanode, 如果datanode平衡,则集群已平衡.
-exclude  -f  /tmp/ip1.txt   # 默认为空,指定该部分ip不参与balance, -f:指定输入为文件
-include  -f  /tmp/ip2.txt   # 默认为空,只允许该部分ip参与balance,-f:指定输入为文件
-idleiterations  5      # 迭代 5

```

**如何运行Balancer**

1）配置平衡数据传输带宽

```shell
hdfs dfsadmin -setBalancerBandwidth   newbandwidth

# 其中newbandwidth是每个DataNode在平衡操作期间可以使用的最大网络带宽量，以每秒字节数为单位。
# 比如：hdfs dfsadmin -setBalancerBandwidth 104857600（100M）

```

2）运行Balancer

-   默认参数运行：

    ```shell
    hdfs balancer
    
    ```

-   指定阈值运行：

    ```shell
    hdfs balancer -threshold 5     # Balancer将以阈值5％运行（默认值10%）。
    
    ```

-   这意味着程序将确保**每个DataNode上的磁盘使用量与群集中的总体使用量相差不超过5％**。例如，如果集群中所有DataNode的总体使用率是集群磁盘总存储容量的40％，则程序将确保每个DataNode的磁盘使用率在该DataNode磁盘存储容量的35％至45％之间。

    

### 1.4 磁盘均衡器 HDFS Disk Balancer（hadoop3.0）

-   相比较于个人PC，服务器一般可以通过挂载多块磁盘来扩大单机的存储能力。
-   在Hadoop HDFS中，DataNode负责最终数据block的存储，在所在机器上的磁盘之间分配数据块。当写入新block时，DataNode将根据选择策略（**循环策略**或**可用空间策略**）来选择block的磁盘（卷）。
-   **循环策略**：他将新block均匀分布在可用磁盘上。**默认此策略**。
-   **可用空间策略**：此策略将数据写入具有更多可用空间（按百分比）的磁盘。
-   在长期运行的群集中**采用循环策略**时，DataNode**有时会不均匀地填充其存储目录**（磁盘/卷），从而导致某些磁盘已满而其他磁盘却很少使用的情况。发生这种情况的原因可能是由于大量的写入和删除操作，也可能是由于更换了磁盘。
-   另外，如果我们使用**基于可用空间的选择策略**，则每个新写入将进入新添加的空磁盘，从而使该期间的其他磁盘处于空闲状态。这将**在新磁盘上创建瓶颈**。
-   因此，需要一种**Intra DataNode Balancing（DataNode内数据块的均匀分布）来解决Intra-DataNode偏斜**（磁盘上块的不均匀分布），这种偏斜是由于磁盘更换或随机写入和删除而发生的。
-   因此，**Hadoop 3.0中引入了一个名为Disk Balancer**的工具，该工具专注于在DataNode内分发数据。

**HDFS Disk Balancer简介**

-   **HDFS disk balancer**是Hadoop 3中引入的命令行工具，用于平衡DataNode中的数据在磁盘之间分布不均匀问题。 这里要特别注意，HDFS disk balancer与HDFS Balancer是不同的： 
-   HDFS disk balancer针对给定的DataNode进行操作，并将块从一个磁盘移动到另一个磁盘,是DataNode内部数据在不同磁盘间平衡；
-   HDFS Balancer平衡了DataNode节点之间的分布。

**HDFS Disk Balancer功能** ——**数据传播报告**

​    为了衡量集群中哪些计算机遭受数据分布不均的影响，磁盘平衡器定义了**Volume Data Density metric**（卷/磁盘数据密度度量标准）和**Node Data Density metric**（节点数据密度度量标准）。

-   卷（磁盘）数据密度：比较同台机器上不同卷之间的数据分布情况。
-   节点数据密度：比较的是不同机器之间的。

**1）Volume data density metric（卷数据密度）计算**

volume Data Density的**正值表示磁盘未充分利用**，而**负值**表示磁盘相对于当前理想存储目标的**利用率过高**。

假设有一台具有四个卷/磁盘的计算机-Disk1，Disk2，Disk3，Disk4，各个磁盘使用情况：

|                     | Disk1 | Disk2 | Disk3 | DIsk4 |
| ------------------- | ----- | ----- | ----- | ----- |
| capacity            | 200GB | 300GB | 350GB | 500GB |
| dfsUsed             | 100GB | 76GB  | 300GB | 475GB |
| dfsUsedRatio        | 0.5   | 0.25  | 0.85  | 0.95  |
| Volume Data Density | 0.2   | 0.45  | -0.15 | -0.25 |

Total Capcity = 200+300+350+500 = 1350GB

Total Used = 100+76+300+475 = 951GB

因此，每个卷/磁盘上的理想存储空间为

Ideal Storage = Total Used / Total Capcity = 951/1350 = 0.70 ，也就是每个磁盘应该保持70%的理想存储容量

Volume Data Density = Ideal Storage - dfsUsedRatio ，例如 Disk1的卷数据密度=0.7-0.5=0.2

**2）Node Data Density 计算过程**

Node Data Density（节点数据密度）= **该节点上所以的volume data density卷（磁盘）数据密度绝对值的总和**。

如上述例子中的节点数据密度=|0.2|+|0.45|+|-0.15|+|-0.25|=1.05

-   ​    较低的node Data Density值表示该机器节点具有较好的扩展性，而较高的值表示节点具有更倾斜的数据分布。
-   一旦有了volume Data Density和node Data Density，就可以找到集群中数据分布倾斜的节点和机器上数据分步倾斜的磁盘。

**HDFS Disk Balancer功能** ——**磁盘平衡**

-   当指定某个DataNode节点进行disk数据平衡，就可以先计算或读取当前的volume Data Density（磁卷数据密度）。
-   有了这些信息，我们可以轻松地确定哪些卷已超量配置，哪些卷已不足。
-   为了将数据从一个卷移动到DataNode中的另一个卷，Hadoop开发实现了基于RPC协议的Disk Balancer。

**HDFS Disk Balancer开启**

-   HDFS Disk Balancer通过创建计划进行操作，该计划是一组语句，描述应在两个磁盘之间移动多少数据，然后在DataNode上执行该组语句。计划包含多个移动步骤。计划中的每个移动步骤都具有目标磁盘，源磁盘的地址。移动步骤还具有要移动的字节数。该计划是针对可操作的DataNode执行的。
-   默认情况下，Hadoop群集上已经启用了Disk Balancer功能。通过在hdfs-site.xml中调整**dfs.disk.balancer.enabled**参数值，选择在Hadoop中是否启用磁盘平衡器。

**HDFS Disk Balancer相关命令**

**plan计划**

```shell
hdfs diskbalancer -plan <datanode>

-out		# 控制计划文件的输出位置
-bandwith   # 设置用于运行Disk Banlancer的最大带宽，默认带宽为10MB/s
-thresholdPercentage #定义磁盘开始参与数据重新分配或平衡操作的值.默认的thresholdPercentage值10％,
				     #这意味着仅当磁盘包含的数据比理想存储值多10％或更少时,磁盘才用于平衡操作
-maxerror	# 它允许用户在中止移动步骤之前为两个磁盘之间的移动操作指定要忽略的错误数.
-v          # 详细模式,指定此选项将强制plan命令在stdout上显示计划的摘要
-fs			# 此选项指定要使用的NameNode.如果未指定,则Disk Balancer将使用配置中的默认NameNode

```

**Execute执行**

```shell
hdfs diskbalancer -execute <JSON file path>
# execute命令针对为其生成计划的DataNode执行计划

```

**Query查询**

```shell
hdfs diskbalancer -query <datanode>
# query命令从运行计划的DataNode获取HDFS磁盘平衡器的当前状态

```

**Cancel取消**

```shell
hdfs diskbalancer -cancel <JSON file path>
hdfs diskbalancer -cancel planID node <nodename>

```

**Report汇报**

```shell
hdfs diskbalancer -fs hdfs://nn_host:8020 -report

```

演示

```shell
[root@kk01 ~]# hdfs diskbalancer -plan kk01
2023-04-05 01:31:55,987 INFO balancer.NameNodeConnector: getBlocks calls for hdfs://kk01:8020 will be rate-limited to 20 per second
2023-04-05 01:31:58,009 INFO planner.GreedyPlanner: Starting plan for Node : kk01:9867
2023-04-05 01:31:58,009 INFO planner.GreedyPlanner: Compute Plan for Node : kk01:9867 took 15 ms 
2023-04-05 01:31:58,009 INFO command.Command: No plan generated. DiskBalancing not needed for node: kk01 threshold used: 10.0
No plan generated. DiskBalancing not needed for node: kk01 threshold used: 10.0

```


### 1.5 纠删码技术 Erasure Coding（hadoop3.0）

**背景：3副本策略的弊端**

-   为了提供容错能力，HDFS会根据replication factor（复制因子）在不同的DataNode上复制文件块。
-   默认复制因子为3（注意这里的3指的是1+2=3，不是额外3个），则原始块除外，还将有额外两个副本。每个副本使用100％的存储开销，因此导致200％的存储开销。这些副本也消耗其他资源，例如网络带宽。
-   在复制因子为N时，存在N-1个容错能力，但存储效率仅为1/N。

**Erasure Coding（EC）简介**

-   **纠删码技术（Erasure coding）简称EC**，是一种编码容错技术。最早用于通信行业，数据传输中的数据恢复。它通过**对数据进行分块，然后计算出校验数据，使得各个部分的数据产生关联性**。当一部分数据块丢失时，可以通过剩余的数据块和校验块计算出丢失的数据块。
-   Hadoop 3.0 之后引入了纠删码技术（Erasure Coding），它可以提高50%以上的存储利用率，并且保证数据的可靠性。

**Reed-Solomon（RS）码**

-   Reed-Solomon（RS）码是常用的一种纠删码，它有两个参数k和m，记为RS(k，m)。
-   k个数据块组成一个向量被乘上一个生成矩阵（Generator Matrix）GT从而得到一个码字（codeword）向量，该向量由k个数据块（d0,d1..d3）和m个校验块（c0,c1）构成。
-   如果数据块丢失，可以用GT逆矩阵乘以码字向量来恢复出丢失的数据块。

**RS码通俗解释**

比如有7、8、9三个原始数据，通过矩阵乘法，计算出两个校验数据50、122

这时原始数据加上校验数据，一个有五个数据7、8、9、50、122，任意两个丢弃，可用通过算法进行恢复

```
GT矩阵       Data矩阵         parity
1 2 3   *   7            =   50
4 5 6       8                122  
			9

```

**Hadoop EC 架构**

为了支持纠错码，HDFS体系结构进行了一些更改调整。

**1）NameNode扩展**

​    条带化的HDFS文件在**逻辑**上由**block group（块组）**组成，每个块组包含一定数量的内部块。这允许在块组级别而不是块级别进行文件管理

**2）客户端扩展**

​    客户端的读写路径得到了增强，可以并行处理块组中的多个内部块

**3）DataNode扩展**

​	DataNode运行一个附加的ErasureCodingWorker（**ECWorker**）任务，以对失败的纠删编码块进行**后台恢复**。 NameNode检测到失败的EC块，然后NameNode选择一个DataNode进行恢复工作。

**4）纠删码策略**

​	为了适应异构的工作负载，允许HDFS群集中的文件和目录具有不同的复制和纠删码策略。纠删码策略封装了如何对文件进行编码/解码。**默认情况下启用RS-6-3-1024k策略**， RS表示编码器算法Reed-Solomon，6 、3中表示数据块和奇偶校验块的数量，1024k表示条带化单元的大小。

​    目录上还支持默认的REPLICATION方案。它只能在目录上设置，以强制目录采用3倍复制方案，而不继承其祖先的纠删码策略。此策略可以使3x复制方案目录与纠删码目录交错。REPLICATION始终处于启用状态。

​    此外也支持用户通过XML文件定义自己的EC策略，Hadoop conf目录中有一个名为user_ec_policies.xml.template的示例EC策略XML文件，用户可以参考该文件

**5）Intel ISA-L**

​    英特尔ISA-L代表**英特尔智能存储加速库**。 ISA-L是针对存储应用程序而优化的低级功能的开源集合。它包括针对Intel AVX和AVX2指令集优化的快速块Reed-Solomon类型擦除代码。 HDFS纠删码可以利用ISA-L加速编码和解码计算。

**Erasure Coding部署方式**

**1）集群和硬件配置**

-   ​    编码和解码工作会消耗HDFS客户端和DataNode上的额外**CPU**。
-   ​    纠删码文件也分布在整个机架上，以实现机架容错。这意味着在读写条带化文件时，大多数操作都是在机架上进行的。因此，**网络带宽**也非常重要。
-   ​    对于机架容错，拥有**足够数量的机架**也很重要，每个机架所容纳的块数不超过EC奇偶校验块的数。机架数量=（数据块+奇偶校验块）/奇偶校验块后取整。

​    比如对于EC策略RS（6,3），这意味着最少3个机架（由（6 + 3）/ 3 = 3计算），理想情况下为9个或更多，以处理计划内和计划外的停机。对于机架数少于奇偶校验单元数的群集，HDFS无法维持机架容错能力，但仍将尝试在多个节点之间分布条带化文件以保留节点级容错能力。因此，建议设置具有类似数量的DataNode的机架。

**2）纠删码策略设置**

-   ​    纠删码策略由参数dfs.namenode.ec.system.default.policy指定，默认是**RS-6-3-1024k**，其他策略默认是禁用的。

​    可以通过以下命令启用策略集

```shell
hdfs ec [-enablePolicy -policy <policyName>]

```

**3）启用英特尔ISA-L(智能存储加速库)**

默认RS编解码器在HDFS本机实现利用Intel ISA-L库来改善编码和解码的计算。要启用和使用Intel ISA-L，需要执行三个步骤。

1.  建立ISA-L库
2.  使用ISA-L支持构建Hadoop
3.  使用-Dbundle.isal将isal.lib目录的内容复制到最终的tar文件中。使用tar文件部署Hadoop。确保ISA-L在HDFS客户端和DataNode上可用。

版本

| 软件                                                        | 版本    |
| ----------------------------------------------------------- | ------- |
| Hadoop                                                      | 3.1.4   |
| [isa-l](https://github.com/intel/isa-l/releases)            | 2.28.0  |
| [nasm](https://www.nasm.us/pub/nasm/releasebuilds/2.14.02/) | 2.14.02 |
| yasm                                                        | 1.2.0   |

------

1、安装yasm和nasm

```shell
#在Hadoop集群所有节点上安装yasm和nasm。
yum install -y yasm
yum install -y nasm


#注意：isa-l-2.28.0对nasm和yasm有版本要求，低版本在安装时会报错。

```

------

2、编译安装isa-l-2.28.0

```shell
#在Hadoop集群所有节点上编译安装isa-l-2.28.0。
tar -zxvf isa-l-2.28.0.tar.gz
cd isa-l-2.28.0
./autogen.sh
./configure --prefix=/usr --libdir=/usr/lib64
make
make install
 
make -f Makefile.unx


#检查libisal.so*是否成功
ll /lib64/libisal.so*
 
############如果有，则跳过##############
############如果没有有，则复制##############
cp bin/libisal.so bin/libisal.so.2 /lib64

```

------

3、Hadoop上检查是否启用isa-l

```shell
Native library checking:
hadoop:  true /usr/hdp/3.0.0.0-1634/hadoop/lib/native/libhadoop.so.1.0.0
zlib:    true /lib64/libz.so.1
zstd  :  false
snappy:  true /usr/hdp/3.0.0.0-1634/hadoop/lib/native/libsnappy.so.1
lz4:     true revision:10301
bzip2:   true /lib64/libbz2.so.1
openssl: true /lib64/libcrypto.so
ISA-L:   true /lib64/libisal.so.2     ------------->  Shows that ISA-L is loaded.

```



**4）EC命令**

```shell
[root@kk01 ~]# 
[root@kk01 ~]# hdfs ec
Usage: bin/hdfs ec [COMMAND]
          [-listPolicies]
          [-addPolicies -policyFile <file>]
          [-getPolicy -path <path>]
          [-removePolicy -policy <policy>]
          [-setPolicy -path <path> [-policy <policy>] [-replicate]]
          [-unsetPolicy -path <path>]
          [-listCodecs]
          [-enablePolicy -policy <policy>]
          [-disablePolicy -policy <policy>]
          [-verifyClusterSetup [-policy <policy>...<policy>]]
          [-help <command-name>]


```

```shell
[-listPolicies]  # 列出在HDFS中注册的所有（启用、禁用和删除）擦除编码策略。只有启用的策略才适合与setPolicy命令一起使用
[-addPolicies -policyFile <file>]  # 添加用户定义的擦除编码策略列表
[-getPolicy -path <path>]          # 获取指定路径下文件或目录的擦除编码策略的详细信息
[-removePolicy -policy <policy>]   # 删除用户定义的擦除编码策略列表
[-setPolicy -path <path> [-policy <policy>] [-replicate]]
			# 在指定路径的目录上设置擦除编码策略
			# path：在HDFS中的目录。这是必填参数。设置策略仅影响新创建的文件，而不影响现有文件
			# policy：用于此目录下文件的擦除编码策略。默认RS-6-3-1024k策略。
			# replicate：在目录上应用默认的REPLICATION方案，强制目录采用3x复制方案。replicate和-policy <policy>是可选参数。不能同时指定它们。
[-unsetPolicy -path <path>]        # 取消设置先前对目录上的setPolicy的调用所设置的擦除编码策略。如果该目录从祖先目录继承了擦除编码策略	，则unsetPolicy是no-op。在没有显式策略集的目录上取消策略将不会返回错误。
[-listCodecs]  # 获取系统中支持的擦除编码编解码器和编码器的列表
[-enablePolicy -policy <policy>]  # 启用擦除编码策略。
[-disablePolicy -policy <policy>]  # 禁用擦除编码策略

```
