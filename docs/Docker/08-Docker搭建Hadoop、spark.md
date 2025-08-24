# Docker搭建Hadoop、spark

## 搭建

### 1、安装容器

#### 1）拉取镜像

```shell
[root@nhk opt]# docker pull centos:centos7
centos7: Pulling from library/centos
2d473b07cdd5: Pull complete 
Digest: sha256:9d4bcbbb213dfd745b58be38b13b996ebb5ac315fe75711bd618426a630e0987
Status: Downloaded newer image for centos:centos7
docker.io/library/centos:centos7
```

#### 2）查看镜像

```shell
[root@nhk opt]# docker images
REPOSITORY                   TAG       IMAGE ID       CREATED         SIZE
......

centos                       centos7   eeb6ee3f44bd   20 months ago   204MB
```

#### 3）启动一个名为 centos7 的容器

```shell
[root@nhk opt]# docker run --name centos7  --privileged=true -itd centos:centos7 /bin/bash
ead8f10db14dd280f0dafc4f424fd8ee9d9716a78df8c4641ff11772be0a8cbc


```

参数说明

- 使用 `--privileged=true`命令，令container内的root拥有真正的root权限，否则，container内的root之上外部的一个普通用户权限


#### 4）进入该容器

```shell
[root@nhk opt]# docker attach centos7
[root@ead8f10db14d /]# 
```

#### 5）安装一些工具

如果没有则安装，有则忽略

```shell
[root@ead8f10db14d /]# yum install -y net-tools which openssh-clients openssh-server iproute.x86_64 wget passwd vim
```

#### 6）修改 centos7容器的root用户密码

为了简单，我们将密码设置为 123456

```shell
[root@ead8f10db14d /]# passwd
Changing password for user root.
New password: 
BAD PASSWORD: The password is shorter than 8 characters
Retype new password: 
passwd: all authentication tokens updated successfully.


[root@ead8f10db14d /]# sed -i 's/UsePAM yes/UsePAM no/g' /etc/ssh/sshd_config
[root@ead8f10db14d /]# 
[root@ead8f10db14d /]# mkdir /var/run/sshd
[root@ead8f10db14d /]# 
[root@ead8f10db14d /]# systemctl start sshd.service      #开启ssh服务
Failed to get D-Bus connection: Operation not permitted
# 这里会报错，我们先不管他

# 这里 exit 退回到宿主机
[root@ead8f10db14d /]# exit
exit
[root@nhk opt]# 
```

#### 7）打包镜像

回到 Linux主机（宿主机）上，生成新镜像，此处取名为 centos7:ssh

```shell
# 查看容器id
[root@nhk opt]# docker ps -a
CONTAINER ID   IMAGE                      COMMAND                   CREATED         STATUS                      PORTS     NAMES
ead8f10db14d   centos:centos7             "/bin/bash"               9 minutes ago   Exited (1) 59 seconds ago             centos7
.....

# 打包容器重新发布为镜像（即 根据刚刚的容器centos7 制作新的镜像文件）
[root@nhk opt]# docker commit  centos7 centos7:ssh
sha256:f3dafce5fe48efdff7f064672759080043ca60d290b633ca90a4c43e3e489246

# 解释
centos7 为容器名称
centos7:ssh 表示 镜像名:标签名
```

#### 8）查看创建好的新镜像

```shell
[root@nhk opt]# docker images
REPOSITORY                   TAG       IMAGE ID       CREATED         SIZE
centos7                      ssh       f3dafce5fe48   2 minutes ago   478MB
....
centos                       centos7   eeb6ee3f44bd   20 months ago   204MB
```

#### 9）启动刚刚打包的镜像

```shell
# 启动容器(--privileged=true 和后面的 /sbin/init 必须要有，以特权模式启动容器，否则无法使用 systemctl 启动服务)
[root@nhk opt]# docker run -itd --privileged=true --name centos7-ssh -P centos7:ssh /usr/sbin/init
29b8d764ebdaa483f059c217c832119583ee4e78713ec553ea5c61799ecd82bf

# 进入容器
[root@nhk opt]# docker exec -it centos7-ssh /bin/bash
[root@29b8d764ebda /]# 
```

#### 10）ssh免密

```shell
# 执行下列操作，设置 ssh 免密登录
# 依次执行下面命令
cd ~
ssh-keygen -t rsa -P '' -f ~/.ssh/id_dsa
cd .ssh
cat id_dsa.pub >> authorized_keys

# 如下
[root@29b8d764ebda /]# cd ~
[root@29b8d764ebda ~]# pwd
/root
[root@29b8d764ebda ~]# ssh-keygen -t rsa -P '' -f ~/.ssh/id_dsa
Generating public/private rsa key pair.
Created directory '/root/.ssh'.
Your identification has been saved in /root/.ssh/id_dsa.
Your public key has been saved in /root/.ssh/id_dsa.pub.
The key fingerprint is:
SHA256:g+037YkuODOflePyYRvB0hpamd3bC0T7iKsRcq1nCTM root@29b8d764ebda
The key's randomart image is:
+---[RSA 2048]----+
|                 |
|                 |
|            .    |
|       o B o .   |
|      o E * +    |
|       * @ B =   |
|      ..= # = o  |
|      = oX X o . |
|       =+*B o .  |
+----[SHA256]-----+
[root@29b8d764ebda ~]# cd .ssh
[root@29b8d764ebda .ssh]# pwd
/root/.ssh
[root@29b8d764ebda .ssh]# cat id_dsa.pub >> authorized_keys
```

#### 11）做hosts主机名映射

注意：

​	known_hosts文件类似与hosts文件

```shell
# 在 vi ~/.ssh/known_hosts 里面把 localhost 加上
[root@29b8d764ebda .ssh]# vi ~/.ssh/known_hosts
[root@29b8d764ebda .ssh]# cat ~/.ssh/known_hosts 
localhost
master 172.17.0.2
slave01 172.17.0.3
slave02 172.17.0.4
```



### 2、在容器内部署jdk、Hadoop、Scala、Spark

#### 1）复制压缩包

将Linux中压缩包复制到 docker容器，命令如下

```shell
docker cp 宿主机路径(压缩包所在目录)   容器名称:/路径
```

我们在宿主机上先准备好了压缩包

```shell
[root@nhk opt]# pwd
/opt
[root@nhk opt]# ll
total 2088456
drwx--x--x. 4 root root         28 Apr 12 02:38 containerd
drwxr-xr-x. 4 root root         32 Apr 18 21:23 data
-rw-r--r--. 1 root root  395448622 May 23 01:17 hadoop-3.2.2.tar.gz
-rw-r--r--. 1 root root  189784266 May 23 01:17 jdk-8u152-linux-x64.tar.gz
-rw-r--r--. 1 root root   19760624 May 23 01:09 scala-2.12.3.tgz
-rw-r--r--. 1 root root  307175560 May 23 01:17 spark-3.2.0-bin-hadoop3.2-scala2.13.tgz
```

在容器内创建目录，用于接收复制过来的压缩包

```shell
[root@29b8d764ebda .ssh]# mkdir /opt/software
[root@29b8d764ebda .ssh]# cd /opt/software/
[root@29b8d764ebda software]# ll
total 0
```

在宿主机上有以上压缩包以后，我们使用 docker cp 命令，将压缩包复制到容器内

```shell
# 命令说明 
# docker cp 宿主机路径 容器名称:容器内路径
[root@nhk opt]# docker cp /opt/jdk-8u152-linux-x64.tar.gz centos7-ssh:/opt/software

[root@nhk opt]# docker cp /opt/hadoop-3.2.2.tar.gz centos7-ssh:/opt/software

[root@nhk opt]# docker cp /opt/scala-2.12.3.tgz centos7-ssh:/opt/software

[root@nhk opt]# docker cp /opt/spark-3.2.0-bin-hadoop3.2-scala2.13.tgz centos7-ssh:/opt/software
```

#### 2）安装Java、Scala、Hadoop、spark

##### 分别创建好安装目录

```shell
[root@29b8d764ebda opt]# mkdir /usr/local/java/
[root@29b8d764ebda opt]#                       
[root@29b8d764ebda opt]# mkdir /usr/local/scala/
[root@29b8d764ebda opt]# 
[root@29b8d764ebda opt]# mkdir /usr/local/hadoop/
[root@29b8d764ebda opt]# 
[root@29b8d764ebda opt]# mkdir /usr/local/spark/ 
[root@29b8d764ebda opt]# 
```

##### 将压缩包解压缩

```shell
# 解压jdk
[root@29b8d764ebda opt]# tar -zxvf /opt/software/jdk-8u152-linux-x64.tar.gz -C /usr/local/java/

# 解压scala 
[root@29b8d764ebda opt]# tar -zxvf /opt/software/scala-2.12.3.tgz -C /usr/local/scala/

# 解压 Hadoop
[root@29b8d764ebda opt]# tar -zxvf /opt/software/hadoop-3.2.2.tar.gz -C /usr/local/hadoop/

# 解压 spark
[root@29b8d764ebda opt]# tar -zxvf /opt/software/spark-3.2.0-bin-hadoop3.2-scala2.13.tgz -C /usr/local/spark/ 

```

#### 3）配置环境变量

```shell
[root@29b8d764ebda opt]# vim ~/.bashrc 

# 参考的配置文件如下

# JAVA
export JAVA_HOME=/usr/local/java/jdk1.8.0_152
export JRE_HOME=$JAVA_HOME/jre
export PATH=$JAVA_HOME/bin:$PATH:$JRE_HOME/bin
# scala
export SCALA_HOME=/usr/local/scala/scala-2.12.3
export PATH=$PATH:$SCALA_HOME/bin
# hadoop
export HADOOP_HOME=/usr/local/hadoop/hadoop-3.2.2
export HADOOP_CONFIG_HOME=$HADOOP_HOME/etc/hadoop
export PATH=$PATH:$HADOOP_HOME/bin
export PATH=$PATH:$HADOOP_HOME/sbin
export SPARK_DIST_CLASSPATH=$(hadoop classpath)
```

使环境变量生效

```shell
[root@29b8d764ebda /]# source ~/.bashrc 
[root@29b8d764ebda /]# 
```

#### 4）安装PySpark

在容器内安装python3

```shell
[root@29b8d764ebda /]# yum install python3 -y
```

接着在安装pyspark

```shell
[root@29b8d764ebda /]#  pip3 install pyspark==3.2.2 -i https://pypi.tuna.tsinghua.edu.cn/simple
```

上面命令可能会遇见 ReadTimeoutError 异常，可以试试如下命令

```shell
[root@29b8d764ebda /]# pip3 --default-timeout=100 install install pyspark -i http://pypi.douban.com/simple/ --trusted-host pypi.douban.com

# 成功以后可以看到如下信息

Successfully installed install-1.3.5 py4j-0.10.9.5 pyspark-3.2.4
```

#### 5）创建Hadoop集群相关目录

```shell
[root@29b8d764ebda /]# cd $HADOOP_HOME
[root@29b8d764ebda hadoop-3.2.2]# pwd
/usr/local/hadoop/hadoop-3.2.2
[root@29b8d764ebda hadoop-3.2.2]# mkdir tmp
[root@29b8d764ebda hadoop-3.2.2]# mkdir namenode
[root@29b8d764ebda hadoop-3.2.2]# mkdir datanode
[root@29b8d764ebda hadoop-3.2.2]# ll
total 184
-rw-rw-r--. 1 1000 1000 150569 Dec  5  2020 LICENSE.txt
-rw-rw-r--. 1 1000 1000  21943 Dec  5  2020 NOTICE.txt
-rw-rw-r--. 1 1000 1000   1361 Dec  5  2020 README.txt
drwxr-xr-x. 2 1000 1000    203 Jan  3  2021 bin
drwxr-xr-x. 2 root root      6 May 23 08:27 datanode
drwxr-xr-x. 3 1000 1000     20 Jan  3  2021 etc
drwxr-xr-x. 2 1000 1000    106 Jan  3  2021 include
drwxr-xr-x. 3 1000 1000     20 Jan  3  2021 lib
drwxr-xr-x. 4 1000 1000   4096 Jan  3  2021 libexec
drwxr-xr-x. 2 root root      6 May 23 08:27 namenode
drwxr-xr-x. 3 1000 1000   4096 Jan  3  2021 sbin
drwxr-xr-x. 4 1000 1000     31 Jan  3  2021 share
drwxr-xr-x. 2 root root      6 May 23 08:27 tmp
```

#### 6）修改Hadoop配置文件

```shell
[root@29b8d764ebda hadoop-3.2.2]# cd $HADOOP_CONFIG_HOME/
[root@29b8d764ebda hadoop]# pwd
/usr/local/hadoop/hadoop-3.2.2/etc/hadoop
```

##### 核心配置文件

```shell
[root@29b8d764ebda hadoop]# vi core-site.xml 
```

 在 configuration 标签下添加如下内容

```xml
<property>
        <name>hadoop.tmp.dir</name>
        <value>/usr/local/hadoop/hadoop-3.2.2/tmp</value>
        <description>A base for other temporary directories.</description>
    </property>
    <property>
        <name>fs.default.name</name>
        <value>hdfs://master:9000</value>
        <final>true</final>
        <description>The name of the default file system. A URI whose scheme and authority determine the
            FileSystem implementation. The uri's scheme
            determines the config property (fs.SCHEME.impl)
            naming the FileSystem implementation class. The
            uri's authority is used to determine the host, port, etc. for a filesystem.
        </description>
    </property>
```

##### HDFS配置文件

设置副本数和 NameNode、DataNode 的目录路径

```shell
[root@29b8d764ebda hadoop]# vi hdfs-site.xml 
```

 在 configuration 标签下添加如下内容

```xml
<property>
        <name>dfs.replication</name>
        <value>2</value>
        <final>true</final>
        <description>Default block replication. The actual number of replications can be specified when the file is
            created. The default is used if replication is not specified in create time.
        </description>
    </property>
    <property>
        <name>dfs.namenode.name.dir</name>
        <value>/usr/local/hadoop/hadoop-3.2.2/namenode</value>
        <final>true</final>
    </property>
    <property>
        <name>dfs.datanode.data.dir</name>
        <value>/usr/local/hadoop/hadoop-3.2.2/datanode</value>
        <final>true</final>
    </property>
    <property>
        <name>dfs.http.address</name>
        <value>0.0.0.0:50070</value>
    </property>
```



##### YARN配置文件

```shell
[root@29b8d764ebda hadoop]# vi yarn-site.xml 

```

 在 configuration 标签下添加如下内容

```xml
 <property>
        <name>yarn.nodemanager.vmem-check-enabled</name>
        <value>false</value>
        <description>Whether virtual memory limits will be enforced for containers </description>
    </property>

    <property>
        <name>yarn.resourcemanager.webapp.address</name>
        <value>0.0.0.0:8088</value>
    </property>

    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>
    <property>
        <name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
        <value>org.apache.hadoop.mapred.ShuffleHandler</value>
    </property>
    <property>
        <name>yarn.resourcemanager.scheduler.address</name>
        <value>master:8030</value>
    </property>
    <property>
        <name>yarn.resourcemanager.resource-tracker.address</name>
        <value>master:8031</value>
    </property>

```

##### MapReduce配置文件

```shell
[root@29b8d764ebda hadoop]# vi mapred-site.xml 
```

 在 configuration 标签下添加如下内容

```xml
<property>
        <name>mapred.job.tracker</name>
        <value>master:9001</value>
        <description>The host and port that the MapReduce job tracker runs at. If "local", then jobs are run in-process
            as a single map and reduce task.
        </description>
    </property>
```


##### Hadoop运行环境

只有在Hadoop使用root用户使需要配置

```sh
[root@29b8d764ebda hadoop]# vi hadoop-env.sh 
```

在文件末尾加上如下内容

```sh
export HDFS_NAMENODE_USER="root"
export HDFS_DATANODE_USER="root"
export HDFS_SECONDARYNAMENODE_USER="root" 
export YARN_RESOURCEMANAGER_USER="root" 
export YARN_NODEMANAGER_USER="root"
```

#### 7）格式化 Hadoop

```shell
[root@29b8d764ebda hadoop]# hadoop namenode -format
```

在打印出的日志信息中看到如下内容则说明Hadoop格式化成功

```
 Storage directory /usr/local/hadoop/hadoop-3.2.2/namenode has been successfully formatted.
```

#### 8）安装spark

```shell
# 在前面我们已经将spark安装包解压过了
# 因此这里只需要配置环境变量即可
[root@29b8d764ebda ~]# vi ~/.bashrc

# Spark
SPARK_MASTER_IP=master
SPARK_LOCAL_DIR=/usr/local/spark/spark-3.2.0-bin-hadoop3.2-scala2.13
SPACK_DRIVER_MEMORY=1G
```

#### 8）slaves文件

在 ~目录下创建slaves文件

```shell
[root@29b8d764ebda ~]# vi ~/slaves
[root@29b8d764ebda ~]# cat ~/slaves 
slave01
slave02
```

#### 9）再次打包镜像

```shell
# 退出容器
[root@29b8d764ebda /]# exit
exit
# 打包镜像
[root@nhk /]# docker commit -m "Hadoop and saprk env based on centos7"  -a "nhk" centos7-ssh centos7:spark-hadoop
sha256:58762d4c4d47a696f84d155bc9c7efd62922666b4ce31a7dccc5bdee9dde41e9

# 参数说明
centos7-ssh 为容器名称
centos7:spark-hadoop 为 镜像名称:TA

[root@nhk /]# docker images
REPOSITORY                   TAG            IMAGE ID       CREATED         SIZE
centos7                      spark-hadoop   58762d4c4d47   6 seconds ago   3.03GB
centos7                      ssh            f3dafce5fe48   8 days ago      478MB
...
```

#### 10）配置集群

```shell
[root@nhk /]# docker run -itd -P -p 50070:50070 -p 8088:8088 -p 8080:8080 \ 
--privileged=true --name master -h master --add-host slave01:172.17.0.3 --add-host \
slave02:172.17.0.4 centos7:spark-hadoop /usr/sbin/init
c9bb4a52d8c544ca3874eec42d3770e846f07f1c896956bab8923210e580e229

[root@nhk /]# docker run -itd -P --privileged=true --name slave01 -h slave01 \
--add-host master:172.17.0.2 --add-host slave02:172.17.0.4 centos7:spark-hadoop \ /usr/sbin/init
6e88e5927e6c7a4b133a25d0680f5a0b5dc7d8361ac45497555dbf6dee3ba6bd

[root@nhk /]# docker run -itd -P --privileged=true --name slave02 -h slave02 \
--add-host master:172.17.0.2 --add-host slave01:172.17.0.3 centos7:spark-hadoop \
/usr/sbin/init
8fc8d9a4a5caad273e3b9b54d51fa0a1673da506bbc0022e9ddcfa6a32d0dddf

# 参数说明
-h slave01 表示容器主机名称为 slave01
-p 将容器的端口发布到主机
-P 将所有公开的端口发布到随机端口
--add-host 添加自定义主机到ip映射(host:ip)


[root@nhk /]# docker ps
CONTAINER ID   IMAGE                  COMMAND            CREATED          STATUS          PORTS                                                              
                                                                   NAMES8fc8d9a4a5ca   centos7:spark-hadoop   "/usr/sbin/init"   17 seconds ago   Up 16 seconds                                                                      
                                                                   slave026e88e5927e6c   centos7:spark-hadoop   "/usr/sbin/init"   2 minutes ago    Up 2 minutes                                                                       
                                                                   slave01c9bb4a52d8c5   centos7:spark-hadoop   "/usr/sbin/init"   3 minutes ago    Up 3 minutes    0.0.0.0:8080->8080/tcp, :::8080->8080/tcp, 0.0.0.0:8088->8088/tcp, 
:::8088->8088/tcp, 0.0.0.0:50070->50070/tcp, :::50070->50070/tcp   master
```

注意：

​	**使用这种自动分配ip的方式需要注意ip是否正确，因为ip可能会被其他的容器所占用**

​	解决方法：可以使用容器固定ip或者是关闭占用ip的哪个容器


#### 11）进入 master 节点

```shell
[root@nhk /]# docker exec -it master /bin/bash
[root@master /]# 
```

#### 12）启动Hadoop

```shell
[root@master /]# cd /usr/local/hadoop/hadoop-3.2.2/sbin/;bash start-all.sh
...

# 查看jvm进程
[root@master sbin]# jps
1184 ResourceManager
609 DataNode
419 NameNode
903 SecondaryNameNode
1370 NodeManager
1711 Jps
```

#### 13）启动spark

```shell
[root@master sbin]# cd /usr/local/spark/spark-3.2.0-bin-hadoop3.2-scala2.13/sbin/; bash start-all.sh

# 查看jvm进程
[root@master sbin]# jps 
1184 ResourceManager
609 DataNode
419 NameNode
1829 Worker
1894 Jps
903 SecondaryNameNode
1370 NodeManager
1740 Master
```

此致Hadoop 、spark等都搭建完成

## 测试Hadoop集群

数据准备

```shell
[root@master opt]# pwd
/opt
[root@master opt]# mkdir temp
[root@master opt]# cd temp/
[root@master temp]# vim test.txt
[root@master temp]# cat test.txt 
hello hadoop
hello spark
hello flink
```

将数据上传至HDFS

```shell
[root@master temp]# hadoop fs -mkdir -p /user/root/
[root@master temp]# hadoop fs -put /opt/temp/test.txt /user/root/
[root@master temp]# hadoop fs -ls /user/root
Found 1 items
-rw-r--r--   2 root supergroup         37 2023-06-01 03:14 /user/root/test.txt
[root@master temp]# 
```

运行Hadoop自带的MR例子，验证mr

```shell
root@master temp]# cd /usr/local/hadoop/hadoop-3.2.2/share/hadoop/mapreduce/
[root@master mapreduce]#
[root@master mapreduce]# hadoop jar hadoop-mapreduce-examples-3.2.2.jar wordcount /user/root/test.txt /user/root/out
......
```

查看MR运行结果

```shell
[root@master mapreduce]# hadoop fs -ls /user/root/out
Found 2 items
-rw-r--r--   2 root supergroup          0 2023-06-01 03:17 /user/root/out/_SUCCESS
-rw-r--r--   2 root supergroup         33 2023-06-01 03:17 /user/root/out/part-r-00000
[root@master mapreduce]# hadoop fs -cat /user/root/out/part-r-00000 
flink	1
hadoop	1
hello	3
spark	1
```

## 测试Spark

进入 spark-shell 

```shell
[root@master mapreduce]# cd /usr/local/spark/spark-3.2.0-bin-hadoop3.2-scala2.13/bin/
[root@master bin]# pwd
/usr/local/spark/spark-3.2.0-bin-hadoop3.2-scala2.13/bin
[root@master bin]# ./spark-shell 
....
To adjust logging level use sc.setLogLevel(newLevel). For SparkR, use setLogLevel(newLevel).
Welcome to
      ____              __
     / __/__  ___ _____/ /__
    _\ \/ _ \/ _ `/ __/  '_/
   /___/ .__/\_,_/_/ /_/\_\   version 3.2.0
      /_/
         
Using Scala version 2.13.5 (Java HotSpot(TM) 64-Bit Server VM, Java 1.8.0_152)
Type in expressions to have them evaluated.
Type :help for more information.
2023-06-01 03:21:15,322 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
Spark context Web UI available at http://slave01:4040
Spark context available as 'sc' (master = local[*], app id = local-1685589677174).
Spark session available as 'spark'.

scala> 
```

运行 Scala 代码

```scala
scala> var rdd = sc.parallelize(Array(1,2,3,4,5))

scala> rdd.collect()
val res1: Array[Int] = Array(1, 2, 3, 4, 5)        
```

## 测试PySpark

```sh
[root@master sbin]# pyspark
Python 3.6.8 (default, Nov 16 2020, 16:55:22) 
...

Welcome to
      ____              __
     / __/__  ___ _____/ /__
    _\ \/ _ \/ _ `/ __/  '_/
   /__ / .__/\_,_/_/ /_/\_\   version 3.2.4
      /_/

Using Python version 3.6.8 (default, Nov 16 2020 16:55:22)
Spark context Web UI available at http://master:4040
Spark context available as 'sc' (master = local[*], app id = local-1685592449208).
SparkSession available as 'spark'.
>>>
```

运行Python代码

```python
# Python 的 Spark 依赖库
>>> from pyspark import SparkConf, SparkContext

>>> count = sc.parallelize((1,2,3,4,5)).filter(lambda x:x > 3)
>>> print(count.collect())
[4, 5]
```

