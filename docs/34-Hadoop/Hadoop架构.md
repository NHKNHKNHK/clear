# Hadoop架构

## **HDFS 集群**

**NameNode**

​	主角色：NameNode（NN）是Master，它是管理者

-   存储文件**元数据**，如文件名、文件目录结构、文件属性，以及每个文件块列表、块所在DataNode等
-   管理HDFS的名称空间
-   配置副本策略
-   处理客户端读写请求

**MapReduce**

​	从角色：DataNode（DN） 是Slave，DataNode执行实际的操作

-   在本地文件系统**存储文件块数据**和读写数据块，以及**数据的校验和**

**Secondary NameNode**

主角色辅助角色：SecondaryNameNode（SNN）	相当于主角色的秘书

-   该节点**并非NameNode的热备节点**。当NameNode挂掉时，它并不能马上替换NameNode并提供服务
-   它只辅助NameNode，分担NameNode工作量，比如定期合并Fsimage和Edits，并推送给NameNode
-   **每个一段时间对NameNode元数据做备份**
-   紧急情况下，可辅助恢复NameNode

**Client客户端**

1）文件切片。文件上传HDFS时，Client将文件分成一个一个block，然后进行上传；

2）与NameNode交互，获取文件的位置信息；

3）与DataNode交互，读取或写入信息；

4）Client提供了一些命名来管理HDFS，比如NameNode格式化；

5）Client可以通过一些命名来访问HDFS，比如对HDFS增删改查等操作

## **YARN集群**

​	主角色：ResourceManager（RM）

-   整个集群资源（cpu、内存等）的老大

​	从角色：NodeManager（NM）

-   单个节点服务器资源的老大

​	ApplicationMaster（AM）

-   单个任务运行的老大

​	Container

-   容器，相当于一台独立的服务器，里面封装了任务运行时所需资源，内存、cpu、磁盘、网络等

注：集群上可以有很多ApplicationMaster，每个NodeManager上可以有多个Container
