# Zookeeper

## 1 Zookeeper概念

Zookeeper是Apache Hadoop项目下的一个子项目，是一个**树形目录服务**。

zookeeper翻译过来就是 动物园管理员，它是用来管理Hadoop（大象）、Hive（蜜蜂）、Pig（小猪）的管理员。简称**ZK**

Zookeeper是一个**分布式**的、开源的**分布式	应用程序的协调服务**的Apache项目。

Zookeeper提供的主要功能包括：

- ​	配置管理 （作为配置中心）
- ​	分布式锁
- ​	集群管理（作为注册中心）

**Zookeeper数据结构**

Zookeeper数据模型的结构与Unix文件系统很类似，整体上可以看做是一棵树，每个节点称作一个ZNode。每个**ZNode默认能够存储1MB**的数据，**每个ZNode都可以通过其路径唯一标识。**

### 1.1 zookeeper应用场景

提供的服务包括：统一命名服务、统一配置管理、统一集群管理、服务器节点动态上下线、软负载均衡等

**1）统一命名服务**

在分布式环境下，经常需要对应用/服务进行统一命名，便于识别

例如：ip不容易记住，而域名容易记住

**2）统一配置管理**

（1）分布式环境下，配置文件同步非常常见

​	1、一般要求一个集群中，所有的节点的配置信息是一致的，比如kafka集群

​	2、对配置文件修改后，希望能够快速同步到各个节点上。

（2）配置管理可交由zookeeper实现	

​	1、可将配置信息写入zookeeper上的一个ZNode

​	2、各个客户端服务器监听这个ZNode

​	3、一旦ZNode中的数据被修改，Zookeeper将通知各个客户端服务器

**3）统一集群管理**

​	（1）分布式环境中，实时掌握每个节点的状态是必要的

​			1、可根据节点实时状态做出一些调整

​	（2）zookeeper可以实现监控节点状态变化

​			1、可将节点信息写入Zookeeper上的一个ZNode

​			2、监听这个ZNode可获取它的实时状态变化

**4）服务器动态上下线**

客户端能实时洞察到服务器上下行的变化

​	（1）服务端启动时去注册信息（创建的都是临时节点）

​	（2）获取到当前在线服务器列表，并注册监听

​	（3）若服务器节点下线

​	（4）服务器节点上下线的通知

​	（5）重新再去获取服务器列表，并注册监听

**5）软负载均衡**

在Zookeeper中记录每台服务器的访问数，让访问数最少的服务器去处理最新的客户端请求



### 1.2 Zookeeper工作机制3

Zookeeper从设计模式角度来理解：是一个基于**观察者模式**设计的分布式服务管理框架，它**负责存储和管理大家都关心的数据，**然后**接受观察者的注册**，一旦这些数据的状态发生了变化，zookeeper就将**负责通知已经在zookeeper上注册的哪些观察者**做出相应的反应。

### 1.3 Zookeeper的设计目的

设计目的主要体现在以下几个方面：

1）一致性：客户不论连接到哪个服务器，看到的都是相同的视图

2）实时性：Zookeeper的数据存放在内存中，可以做到高吞吐，低延迟

3）可靠性：组成zookeeper服务的服务器必须相互知道其他服务器的存在

4）有序性：例如，zookeeper为每次更新操作赋予了一个版本号，此版本号是唯一的、有序的

5）原子性：zookeeper的客户端在读取数据时，只有成功或失败两种状态，不会出现只读取部分数据的情况（就是说操作不会被打断，要么成功，要么失败）



### 1.4 Zookeeper的系统模型

Zookeeper的系统模型包含服务器（Server）和客户端（Client）

1）客户端可以连接到Zookeeper集群的任意服务器。客户端和服务器通过TCP建立连接，主要负责发送请求和心跳消息，获取响应和监听事件。

2）如果客户端和服务器的TCP连接中断，客户端自动尝试连接到其他服务器

3）客户端第一次连接到一台服务器时，该服务器会为客户端建立一个会话。当该客户端连接到其他服务器时，新的服务器会为客户端重新建立一个会话



### 1.5 Zookeeper集群角色

在zookeeper集群服务中有三个角色

默认有一个领导者（Leader），多个跟随者（Follower）组成的集群

**Leader 领导者：**

​			1、处理事务请求

​			2、集群内部各服务器的调度者

**Follower 跟随者：**

​			1、处理客户端非事务请求，转发事务请求给leader服务器

​			2、参与leader选举投票（根据服务器id大小选举）

**Observer 观察者：**

​			1、处理客户端非事务请求，准发事务请求非leader

​			2、**不参与leader选举投票**

Observer是从zookeeper3.3.0版本开始的新角色。单zookeeper集群节点增多时，为了支持更多的客户端，需要增加服务器，然而服务器的增多后，投票阶段耗费时间过多，影响集群性能。为了增强集群的扩展性，保证数据的高吞吐量，引入Observer



### 1.6 Zookeeper特点

-   集群中只要有**半数以上**节点存活，Zookeeper集群就能正常服务。所以zookeeper适合安装奇数台服务器

-   全局数据一致性**：每个Server保存一份相同的数据副本**，Client无论连接到哪个Server，数据都是一致的。

-   **更新请求顺序执行**，来自同一个Client的更新请求按其发生顺序依次执行。

-   **数据更新原子性**：一次数据更新要么成功，要么失败。

-   **实时性**，在一定时间范围内，Client能读到最新的数据

    

## 2 Zookeeper服务搭建

官网

```
https://zookeeper.apache.org
```

### 2.1 Zookeeper单机模式

**1）环境准备**

Zookeeper服务器是用Java创建的，它运行在JVM之上，需要安装在JDK7或更高版本。

**2）上传、解压**

将下载的Zookeeper压缩包上传至/opt/software目录下**(以下所有操作基于root用户**)

```shell
[root@kk01 software]# cd /opt/software/
# 上传 
[root@kk01 software]# rz
# 解压
[root@kk01 software]# tar -zxvf apache-zookeeper-3.6.1-bin.tar.gz
# 删除压缩包
[root@kk01 software]# rm -rf apache-zookeeper-3.6.1-bin.tar.gz 
# 将解压后的目录重命名
[root@kk01 software]# mv  apache-zookeeper-3.6.1-bin zookeeper-3.6.1
```

**3）配置zoo.cfg**

在/opt/software/zookeeper/apache-zookeeper-3.6.1-bin/conf 目录下**将 zoo_sample.cfg文件更名为zoo.cfg**

```shell
[root@kk01 software]# cd zookeeper-3.6.1/conf/
# mv重命名 也可以使用拷贝更名（cp）
[root@kk01 conf]# mv zoo_sample.cfg zoo.cfg

# 在/opt/softeware/ zookeeper-3.6.1 目录下创建zookeeper存储目录zkData
[root@kk01 conf]# cd /opt/software/zookeeper-3.6.1
[root@kk01 zookeeper-3.6.1]# mkdir zkData

# 进入zoo.cfg文件进行修改存储目录
[root@kk01 zookeeper-3.6.1]# cd /opt/software/zookeeper-3.6.1/conf
[root@kk01 conf]# vim zoo.cfg

# 做出如下修改
dataDir=/opt/software/zookeeper-3.6.1/zkData
```

**4）配置Zookeeper环境变量**

```shell
[root@kk01 conf]# vim /etc/profile

# 在文件末尾添加以下内容

# zookeeper env
export ZOOKEEPER_HOME=/opt/software/zookeeper-3.6.1
export PATH=$PATH:$ZOOKEEPER_HOME/bin
     
# 使环境变量生效
[root@kk01 conf]# source /etc/profile

```

**5）启动Zookeeper**

配置了Zookeeper的环境变量，因此不需要进入zookeeper的bin目录

```shell
# 若未配置zookeeper环境变量，先切换目录
[root@kk01 conf]# cd /opt/software/zookeeper-3.6.1/bin/
# 启动
./zkServer.sh start
[root@kk01 bin]# ./zkServer.sh start


# 配置了环境变量直接使用以下命令
zkServer.sh start  #全局可用

# 见到如下信息则说明zookeeper启动成功
Using config: /opt/software/zookeeper-3.6.1/bin/../conf/zoo.cfg
Starting zookeeper ... STARTED

# 查看进程
[root@kk01 bin]# jps
2835 Jps
2764 QuorumPeerMain
```

**查看Zookeeper启动**

查看Zookeeper启动是否启动成功有两种方法

1、查看Zookeeper启动状态

```shell
[root@kk01 bin]# zkServer.sh status   # 看到如下信息说明启动成功
ZooKeeper JMX enabled by default
Using config: /opt/software/zookeeper-3.6.1/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: standalone

# 看到如下信息说明没有启动成功
ZooKeeper JMX enabled by default
Using config: /opt/software/zookeeper/zookeeper-3.6.1/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Error contacting service. It is probably not running.
```

2、使用**jps命令查看zookeeper服务进程QuorumPeerMain**（该进程是Zookeeper集群的启动入口）

```shell
# 看到如下信息说明启动成功
[root@kk01 bin]# jps
2835 Jps
2764 QuorumPeerMain
```

#### 2.1.1 配置参数解读

Zookeeper中的配置文件zoo.cfg	中参数含义如下

```shell
# 通信心跳时间，zookeeper服务器与客户端心跳时间，单位毫秒 
tickTime=2000	
# LF初始通信时限，即Leader和Follwer初始连接时能容忍的最多心跳数（tickTime的数量）
initLimit=10	
# LF同步通信时限，即Leader和Follwer之间通信时间如果超过 syncLimit*tickTime,Leader认为Follwer死掉，从服务器列表中删除Follwer
syncLimit=5
# 保存zookeeper中的数据（默认为tmp目录，容易被Linux系统定期删除，所以一把不使用默认的tmp目录）
dataDir=/opt/software/zookeeper-3.6.1/zkdata
# 客户端连接端口，通常不做修改
clientPort=2181
```



### 2.2 Zookeeper全分布式

**zookeeper集群介绍**

- **Leader选举**：

Serverid：服务器ID

比如有三台服务器，编号分别是1，2，3。编号越大在选择算法中的权重越大。

- **Zxid：数据ID**

服务器中存放的最大数据ID。值越大说明数据 越新 

- **在Leader选举的过程中，如果某台Zookeeper获得了超过半数的选票，则此Zookeeper就可以成为Leader了**

**搭建需知**

真实的集群是部署在不同的服务器上的，我们这里采用虚拟机模拟出三台服务器，模拟出**全分布式**。当然也可以采用一台虚拟机搭建**伪分布集群**。然后**根据端口区分**。

全分布式和伪分布的区别在于：全分布式是在多台机器上搭建，根据ip进行区分，伪分布是搭建在一台机器上，根据ip和端口进行区分

**集群规划**

​	因为集群中只要有**半数以上**节点存活，Zookeeper集群就能正常服务，所以我们这里采用三台服务器演示

```
kk01	192.168.188.128
kk02	192.168.188.129
kk03    192.168.188.130
```

**1）准备工作**

安装jdk、zookeeper上传至服务器（这些都在单机模式上实现过了，在此省略）



**2）在/opt/software/zookeeper-3.6.1/zkData创建一个myid文件，内容为1。**

这个文件就是**记录每个服务器的ID**（myid要求是1~255的整数，要求myid中内容在集群中唯一）

```shell
[root@kk01 zkData]# cd /opt/software/zookeeper-3.6.1/zkData
[root@kk01 zkData]# echo 1 > ./myid
```

**3）修改/opt/software/zookeeper-3.6.1/conf目录下的zoo.cfg文件**

```shell
[root@kk01 zkData]# vi /opt/software/zookeeper-3.6.1/conf/zoo.cfg

# 在文件末尾添加如下内容
server.1=192.168.188.128:2881:3881
server.2=192.168.188.129:2881:3881
server.3=192.168.188.130:2881:3881

# 2881是Leader端口，负责和Follower进行通信。3881是Follower端口，进行推选Leader

# 配置参数解读
# 	server.服务器ID=服务器IP地址:服务器之间通信端口:服务器之间投票选举端口
# 	服务器ID，即配置在zkData目录下myid文件里的值
#		zk启动时读取此文件，拿到里面的数据与zoo.cfg里的配置信息对比，从而判断到底是哪个server
#	服务器IP地址
#	服务器之间通信端口，服务器Follwer与集群中的Leader服务器交换信息的端口
#	服务器之间投票选举端口，是万一集群中的Leader服务器挂掉了，需要一个端口来重新选举出新的Leader，这个端口就是用来执行选举时服务器相互通信的端口
```

**4）将/opt/software/zookeeper-3.6.1/ 分发到虚拟机kk02、kk03**

```shell
[root@kk01 zkData]# scp -r /opt/software/zookeeper-3.6.1/ root@kk03:/opt/software/zookeeper-3.6.1

[root@kk01 zkData]# scp -r /opt/software/zookeeper-3.6.1/ root@kk03:/opt/software/zookeeper-3.6.1
```

**5）分别修改虚拟机kk02、kk03的/opt/software/zookeeper-3.6.1/zkData 目录下的 myid文件，内容分别为 2、3**

```shell
# kk02
[root@kk02 ~]# cd /opt/software/zookeeper-3.6.1/zkData/
[root@kk02 zkData]# vi myid 

#kk03
[root@kk03 ~]# cd /opt/software/zookeeper-3.6.1/zkData/
[root@kk03 zkData]# vi myid 

```

**6）将虚拟机kk01的环境配置文件分发到kk02、kk03**

```shell
[root@kk01 zkData]# scp -r /etc/profile root@kk02:/etc/profile
[root@kk01 zkData]# scp -r /etc/profile root@kk03:/etc/profile

# 分别在kk02、kk03下使用下面命令使环境变量生效
source /etc/profile
```

**3）分别在kk01、kk02、kk03使用下述命令启动Zookeeper服务器**

```shell
[root@kk01 zkData]# zkServer.sh  start
[root@kk02 zkData]# zkServer.sh  start
[root@kk03 zkData]# zkServer.sh  start

```

**3）查看三台虚拟机的Zookeeper服务器状态**，命令如下

```shell
# 查看进程
[root@kk01 zkData]# jps
3440 QuorumPeerMain
3495 Jps

[root@kk02 zkData]# jps
2898 Jps
2844 QuorumPeerMain

[root@kk03 zkData]# jps
2855 Jps
2794 QuorumPeerMain


# 查看状态
[root@kk01 zkData]# zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /opt/software/zookeeper-3.6.1/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: leader

[root@kk02 zkData]# zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /opt/software/zookeeper-3.6.1/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: follower

[root@kk03 zkData]# zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /opt/software/zookeeper-3.6.1/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: follower
```

查看启动状态返回上述结果，出现了Mode: follower  Mode: leader，表明zookeeper集群搭建成功

#### 2.2.1 shell脚本一键启停zookeeper集群

启动和关闭zookeeper集群需要在每台虚拟机上启动和关闭，效率不高。在实际工作中，使用的服务器较多，为了方便管理Zookeeper服务器，可以编写xzk.sh脚本，一键启停zookeeper服务器集群

**在虚拟机kk01的/usr/local/bin目录下，编写xzk.sh脚本文件**，文件内容如下：

```shell
#!/bin/bash
cmd=$1
if [ $# -gt 1 ] ; then echo param must be 1 ; exit ; fi
for (( i=1 ; i <= 3; i++ )) ; do
        tput setaf 5
        echo ============ kk0$i $@ ============
        tput setaf 9
        ssh kk0$i "source /etc/profile ; zkServer.sh $cmd"
done
```

**为xzk.sh脚本拥有者添加执行权限**

```shell
chmod u+x xzk.sh
# 或
chmod 744 xzk.sh
```

通过xzk.sh脚本的start和stop命令，在kk01上同时关闭kk02、kk03

```shell
xzk.sh start
xzk.sh stop
```

更为易于理解的脚本

```shell
# 在虚拟机kk01的/usr/local/bin目录下 创建名为zk.sh的脚本

[root@kk01 ~]# cd /usr/local/bin/
[root@kk01 bin]# vim zk.sh

# 内容如下

#!/bin/bash

case $1 in
"start")
        for i in kk01 kk02 kk03
        do
                echo "----------------zookeeper $i start------------------------"
                ssh $i "/opt/software/zookeeper-3.6.1/bin/zkServer.sh $1"
        done
;;
"stop")
        for i in kk01 kk02 kk03
        do
                echo "----------------zookeeper $i stop------------------------"
                ssh $i "/opt/software/zookeeper-3.6.1/bin/zkServer.sh $1"
        done
;;
"status")
        for i in kk01 kk02 kk03
        do
                echo "----------------zookeeper $i status------------------------"
                ssh $i "/opt/software/zookeeper-3.6.1/bin/zkServer.sh $1"
        done
;;
*)
        echo "输入参数有误(请输入:start|stop|status)!"
esac



# 赋予文件可执行权限
[root@kk01 bin]# chmod u+x zk.sh 
```

上面的脚本可能会遇到如下错误

```shell
[root@kk01 bin]# pwd
/usr/local/bin   # 因为我们脚本放在该目录下，可能会遇到如下错误

[root@kk01 bin]# zk.sh status
----------------zookeeper kk01 status------------------------
Error: JAVA_HOME is not set and java could not be found in PATH.
----------------zookeeper kk02 status------------------------
Error: JAVA_HOME is not set and java could not be found in PATH.
----------------zookeeper kk03 status------------------------
Error: JAVA_HOME is not set and java could not be found in PATH.


# 解决方法
# 方法一：将自定义脚本放在家目录的bin目录下（我们采用root用户，所以需要放在 /root/bin/目录下）
[root@kk01 ~]# mkdir -p /root/bin
[root@kk01 ~]# cp /usr/local/bin/zk.sh /root/bin/
[root@kk01 bin]# ll
total 4
-rwxr--r--. 1 root root 615 Apr 20 00:17 zk.sh
# /root/bin目录添加到环境变量
[root@kk01 ~]# vim /etc/profile
# 内容如下

# 将root的bin目录添加到环境
export PATH=$PATH:/root/bin

[root@kk01 ~]# source /etc/profile


# 尽力了九九八十一难，最终脚本如下（上面脚本，错误的原因：我们再/etc/profile中配置了zookeeper环境变量，因此启动zkServer.sh 不再需要加路径）

#!/bin/bash

case $1 in
"start")
        for i in kk01 kk02 kk03
        do
                echo "----------------zookeeper $i start------------------------"
                ssh $i " source /etc/profile;  zkServer.sh $1"
        done
;;
"stop")
        for i in kk01 kk02 kk03
        do
                echo "----------------zookeeper $i stop------------------------"
                ssh $i " source /etc/profile; zkServer.sh $1"
        done
;;
"status")
        for i in kk01 kk02 kk03
        do
                echo "----------------zookeeper $i status------------------------"
                ssh $i " source /etc/profile; zkServer.sh $1"
        done
;;
*)
                echo '输入参数有误(请输入:start|stop|status)!'
esac

```



### 2.3 集群异常模拟（选举模拟）

1）首先测试如果服务器挂掉，会怎么样

把kk03上服务器停掉，观察kk01、kk02，发现并没有什么变化

```shell
# 在kk03上关闭zk
zkServer.sh stop

# 查看kk01   还是follower，无变化
[root@kk01 ~]# zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /opt/software/zookeeper/apache-zookeeper-3.6.1-bin/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: follower

# 查看kk02   还是leader，无变化
[root@kk02 ~]# zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /opt/software/zookeeper/apache-zookeeper-3.6.1-bin/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: leader

```

由此得出结论，3个节点的集群，**从服务器挂掉，集群正常**

2）在把kk01上服务器也挂掉，查看kk02（主服务器所在位置），发现也停止运行了

```shell
# 在kk01上关闭zk
zkServer.sh stop

# 查看kk02   服务已停止
[root@kk02 ~]# zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /opt/software/zookeeper/apache-zookeeper-3.6.1-bin/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Error contacting service. It is probably not running.

```

由此得出结论，**3个节点的集群，2个从服务器都挂掉，主服务也无法运行**。因为可运行的机器没有超过集群数量的一半。

3）我们再次把kk01上的服务器启动，发现kk02上的服务器又开始正常工作了，而且依然是领导者Leader

```shell
# 在kk01上开启zk
zkServer.sh start

# 查看kk02 	发现他又开始运行了，而且依然是领导者leader
[root@kk02 ~]# zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /opt/software/zookeeper/apache-zookeeper-3.6.1-bin/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: leader

```

4）我们把kk03上的服务器启动起来，把kk02上的服务器关掉，查看kk01、kk03的状态

```shell
# 在kk03上开启zk
zkServer.sh start
# 在kk02上关闭zk
zkServer.sh stop

# 查看kk01	依然是follower
[root@kk01 ~]# zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /opt/software/zookeeper/apache-zookeeper-3.6.1-bin/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: follower

# 查看kk03   变为了leader
[root@kk03 ~]# zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /opt/software/zookeeper/apache-zookeeper-3.6.1-bin/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: leader
```

发现新的leader产生了

由此我们得出结论，当**集群中的主服务器挂掉了，集群中的其他服务器会自动进行选择状态，然后产生新的leader**

5）再次启动kk02上的服务器，会发生什么，kk02上的服务器会再次成为新的领导者吗？

```shell
# 在kk02上启动zk
zkServer.sh start

# 查看kk02
[root@kk02 ~]# zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /opt/software/zookeeper/apache-zookeeper-3.6.1-bin/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.

# 查看kk03  依然是leader
[root@kk03 ~]# zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /opt/software/zookeeper/apache-zookeeper-3.6.1-bin/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: leader

```

kk02上的服务器会再次启动，kk03上的服务器依然是leader

由此得出结论，zk集群上的leader不会存在让位行为

## 3 Zookeeper选举机制

Zookeeper选举机制，半数机制，超过半数的投票通过，即通过。

1）第一次启动选举规则：

-   投票过半数时，服务器ID大的胜出

2）第二次启动选举规则：

-   EPOCH（时期）大的直接胜出
-   EPOCH相同，事务ID大的胜出
-   事务ID相同，服务器ID大的胜出

具体如下：

### 3.1 Zookeeper选举机制（第一次启动）

Client的每次写操作都会有事务id（ZXID）

SID：**服务器ID**。用来唯一标识一台Zookeeper集群在的机器，每台机器不能重复，**和myid一致。**

ZXID：事务ID。**ZXID是一个事务ID，用来标识一次服务器状态的变更**。在某一时刻，集群中的每台机器的ZXID至不一定完全一致，这和Zookeeper服务器对于客户端“更新请求”的处理逻辑有关。

Epoch：**每个Leader任期的代号**。没有Leader时同一轮投票过程中的逻辑时钟值是相同的。每投完一次票这个数据就会增加

```
假设zookeeper services有五台机器

Server1		Server2 	Server3 	Server4 	Server5
myid1		myid2		myid3		myid4		myid5

```

1）服务器1启动，发起一次选举。服务器1投自己一票。此时服务器1票数一票。不够半数以上（3票），选举无法完成，服务器1状态保持LOOKING

2）服务器2启动，再发起一次选举。服务器1和2分别投自己一票并交换选票信息**：此时服务器1发现服务器2的myid比自己目前投票选举的（服务器1）大，更改选票为推举服务器2**。此时服务器1票数0票，服务器2票数2票，没有半数以上，选举无法完成，服务器1、2状态保持LOOKING

3）服务器3启动，发起一次选举，此时服务器1和2都会更改选票为服务器3。此次投票结果：服务器1为0票、服务器2为0票、服务器3为3票。此时**服务器3的票数已超过半数，服务器当选为Leader**。**服务器1、2状态改为FOLLWERING、服务器3的状态为LEADERING**

4）服务器4启动，发起一次选举，此时服务器1、2、3已经部署LOOKING状态栏，不会再更改选票信息。交换选票信息结果：服务器3为3票、服务器4为1票。此时服务器4服从多少，更改选票结果为服务器3，并更改状态为FOLLWERING

5）服务器5启动，同4一样当小弟。

### 3.2 Zookeeper选举机制（非第一次启动）

```shell
假设zookeeper services有五台机器

Server1		Server2 	Server3 	Server4 	Server5
myid1		myid2		myid3		myid4		myid5

follwer		follwer 	leadr		follwer		follwer
```

1）当zookeeper集群中的一台服务器出现以下两种情况，就会开始进入选举：

-   服务器初始化启动
-   服务器运行期间无法和Leader保持连接	

2）而当一台服务器进入Leader选举流程时，当前集群也可能会处于以下两种状态：

-   集群中本来就已经存在一个Leader

对于这种存在Leader的情况，机器试图去选举Leader时，会被告知当前服务器的Leader信息，对于该机器来说，仅仅需要和Leader机器建立连接，并进行状态同步即可

-   **集群中确实不存在Leader**

```shell
假设zookeeper services有五台服务器组成
SID分别为1、2、3、4、5
ZXID分别为8、8、8、7、7  并且此时SID为3的服务器是Leader
某一时刻，服务器3和5出现故障，因此需要重新进行Leader选举：
							(EPOCH,ZXID,SID)	(EPOCH,ZXID,SID)	(EPOCH,ZXID,SID)
SID为1、2、4的机器投票情况	 (1,8,7)			 (1,8,2)			 (1,7,4)

		选举Leader规则：
				1）EPOCH大的直接胜出
				2）EPOCH相同，事务ID(ZXID)大的胜出
				3)事务ID相同，服务器ID(SID)大的胜出
				
# 最终结果
服务器4当选Leader，服务器1、2为Follwer
```

## 4 客户端向服务器写数据流程

**写流程之写入请求直接给Leader**

```shell

					1 write								 2 write
Client ------------------------------>  ZK Server1 Leader ---------->ZK Server2 Follwer 
					3 ack 
ZK Server2 Follwer ---------->ZK Server1 Leader  

(因此该集群中只有三台机器，数据写入了两台，超过半数了,zk Server Leader回应Client)
 					4 ack
ZK Server1 Leader  ------> Client 
 				   5 write
ZK Server1 Leader ------> ZK Server3 Follwer
 				   6 ack
ZK Server3 Follwer ------> ZK Server1 Leader

```

写流程之写入请求发送给Follwer

```shell
			1 write								2 write请求
Client -------------------> ZK Server2 Follwer ----------> ZK Server1 Leader
					3 write
ZK Server1 Leader  ----------> ZK Server2 Follwer 
					4 ack
ZK Server2 Follwer ----------> ZK Server1 Leader

(因此该集群中只有三台机器，数据写入了两台，超过半数了,zk Server Leader回应ZK Server2 Follwer )
				  5 ack
ZK Server1 Leader ----------> ZK Server2 Follwer 
(接着ZK Server2 Follwer 回应Client)
					6 ack
ZK Server2 Follwer ----------------> Client
					7 write 
ZK Server1 Leader ---------> ZK Server3 Follwer
					8 ack
ZK Server3 Follwer ----------> ZK Server1 Leader

```



## 5 Zookeeper命令操作

### 5.1 Zookeeper数据模型

Zookeeper是一个树形目录服务，其数据模型和Unix的文件系统目录树很相似，拥有一个层次化结构，

这里面的每一个节点都被称为**ZNode**，每个节点上都会保存自己的**数据**和节点信息，节点信息包括：**数据长度、创建时间、修改时间、子节点数等。**

节点可以拥有子节点，同时也允许少量（1MB）的数据存储在该节点之下。

### 5.2 zk节点类型

节点可以分为四大类：

- ​	PERSISTENT **持久化**节点、永久节点
- ​	EPHEMERAL 临时节点 **-e**
- ​	PERSISTENT_SEQUENTIAL 持久化顺序节点： **-s**
- ​	EPHEMERAL_SEQUENTIAL 临时顺序节点： **-es**

持久化节点：

​	在**Zookeeper客户端退出后，不会自动删除的节点**。Zookeeper客户端**默认**创建持久化节点。

临时节点：

​	在Zookeeper**客户端退出后，会自动删除的节点**。临时节点不能有子节点。使用者可以通过临时节点判断分布式服务的打开或者关闭。

顺序节点：

​	节点名称末尾会自动附加一个10位的序列号节点。

持久化顺序节点：

​	客户端与zk断开连接后，节点依然存在，只是zk给该节点进行了顺序编号

临时顺序节点：

​	客户端与zk断开连接后，该节点会被自动删除，只是zk给该节点进行了顺序编号

演示

```shell
[root@kk01 ~]# zkCli.sh -server 192.168.188.128:2181
# 1、创建 永久节点（不带序号） 默认
[zk: 192.168.188.128:2181(CONNECTED) 0] create /nhk "ninghongkang"   
Created /nhk
[zk: 192.168.188.128:2181(CONNECTED) 6] ls /    # 查看
[nhk, zookeeper]
[zk: 192.168.188.128:2181(CONNECTED) 7] get /nhk    # 查看节点值
ninghongkang

# 2.创建带序号永久节点 （带序号的节点好处在与可以重复创建，他会在后面默认拼接10位的序列号）
[zk: 192.168.188.128:2181(CONNECTED) 9] create -s /nhk/app1 "test1"
Created /nhk/app10000000000
[zk: 192.168.188.128:2181(CONNECTED) 17] ls /nhk
[app10000000000]
[zk: 192.168.188.128:2181(CONNECTED) 18] get /nhk/app10000000000
test1
[zk: 192.168.188.128:2181(CONNECTED) 19] create -s /nhk/app1 "test1"
Created /nhk/app10000000001
[zk: 192.168.188.128:2181(CONNECTED) 20] ls /nhk
[app10000000000, app10000000001]

# 3.创建临时节点
[zk: 192.168.188.128:2181(CONNECTED) 21] create -e /nhk/app2    # 创建临时节点
Created /nhk/app2
[zk: 192.168.188.128:2181(CONNECTED) 22] create -e /nhk/app2    # 重复创建显示节点已存在
Node already exists: /nhk/app2
# 4.创建临时顺序节点（可重复创建）
[zk: 192.168.188.128:2181(CONNECTED) 23] create -e -s /nhk/app2
Created /nhk/app20000000003
[zk: 192.168.188.128:2181(CONNECTED) 24] create -e -s /nhk/app2
Created /nhk/app20000000004
[zk: 192.168.188.128:2181(CONNECTED) 27] ls /nhk
[app10000000000, app10000000001, app2, app20000000003, app20000000004]

# 重启zk客户端
[zk: 192.168.188.128:2181(CONNECTED) 28] quit

[root@kk01 ~]# zkCli.sh -server 192.168.188.128:2181
[zk: 192.168.188.128:2181(CONNECTED) 1] ls /nhk   # 查看发现临时节点已经被自动删除了
[app10000000000, app10000000001]
```



Zookeeper Server可以通过Zookeeper client 和 Zookeeper Java API交互

### 5.3 ZooKeeper服务端常用命令

| 服务           | 命令                  |
| :------------- | --------------------- |
| 启动zk服务     | ./zkServer.sh start   |
| 查看zk服务状态 | ./zkServer.sh start   |
| 停止zk服务     | ./zkServer.sh stop    |
| 重启zk服务     | ./zkServer.sh restart |



### 5.4 Zookeeper客户端常用命令

**Zookeeper的节点的权限控制**

在实际生产中，多个应用常使用相同的zookeeper，但是不同应用系统很少使用共同的数据.

鉴于这种情况，zookeeper采用ACL（Access Control List，访问控制列表）策略来进行权限控制，类似于Linux文件系统的权限控制。Zookeeper的节点定义了5种权限。

- ​	create	创建子节点的权限
- ​	read	获取子节点数据和子节点列表的权限
- ​	write	更新节点数据的权限
- ​	delete	删除子节点的权限
- ​	andin	设置节点的权限

| 服务                                   | 命令                                                         |
| -------------------------------------- | ------------------------------------------------------------ |
| 连接zk本地客户端                       | zkCli.sh (连接本地的客户端)                                  |
| 连接zookeeper服务端                    | ./zkCli.sh -server [ip:port]  当连接远程的服务器是需要指定ip和port |
| 断开连接                               | quit                                                         |
| 查看命令帮助                           | help                                                         |
| 显示指定目录下的节点                   | ls /path                                                     |
| 监听子节点变化                         | ls -w /path                                                  |
| 附加次级信息                           | ls -s /path                                                  |
| 创建节点                               | create /节点path [value]                                     |
| 创建顺序节点                           | create -s /节点path [value]                                  |
| 创建临时节点                           | create -e /节点path [value]（zk客户端重启或超时会自动被删除） |
| 获取节点值                             | get /节点path                                                |
| 监听节点内容（即节点内存放的数据）变化 | get -w /path                                                 |
| 附加次级信息                           | get -s /path                                                 |
| 设置节点值                             | set /节点path value                                          |
| 删除单个节点                           | delete /节点path                                             |
| 删除带有子节点的节点（递归删除）       | deleteall /节点path                                          |
| 查看节点状态                           | stat /path                                                   |
| 查看节点详细信息                       | ls2 /节点path （不推荐）      **ls -s /节点path**            |

**注意：Zookeeper客户端中操作节点的命令必须使用绝对路径**

一些参数详情：

- czxid：创建节点的事务ID
- ctime：创建时间（znode被创建的毫秒数，从1970年开始）
- mzxid：最后一次被更新的事务ID（znode最后更新的事务的zxid）
- mtime：修改时间（znode最后修改的毫秒数，从1970年开始）
- pzxid：子节点列表最后一次被更新的事务ID（znode最后更新的子节点的zxid）
- cversion：子节点的版本号（znode子节点变化号，zonde子节点修改次数）
- dataversion：数据版本号（zonde数据变化号）
- aclversion：权限版本号（zonde访问控制列表的变化号）
- epheralOwner：用于临时节点，代表临时节点的事务ID，如果为持久节点则为0（如果是临时节点，这个zonde拥有者的session id。如果不是临时节点则是0）
- datalength：节点存储的数据的长度（znode的数据长度）
- numChildren：当前节点的子节点个数（znode子节点数量）

### 5.5 监听器原理

**监听原理详解**

1）首先要有一个main()线程

2）在main线程创建zookeeper客户端，这时就会创建两个线程，一个负责网络连接（connect），一个负责监听（listener）

3）通过connect线程将注册的监听事件发送给zookeeper

4）zookeeper的监听器列表中将注册的监听事件添加到列表中。

5）zookeeper监听到有数据变化或路径变化时，就会将这个消息发送给listener线程

6）listener线程内部调用了process()方法

```
		zk客户端											zk服务端
	1 Main()线程
	2 创建zkClient				5"/"路径数据发生变化      注册的监听器列表
			|-- Listener     <---------------------  	  4 Client:ip:port:/path
								3 getChildren("/",true)
			|--connect       --------------------->     
            
	6 listener线程调用process()

```

**场景的监听**

```
1）监听节点数据的变化
get path [watch]

2）监听子节点增减的变化
ls path [watch] 
```

演示

```shell
# 1.节点的值变化监听
# 1）在kk01上注册监听/nhk节点 数据变化
[zk: localhost:2181(CONNECTED) 0] get -w /nhk
ninghongkang

# 2）在kk02主机上修改/nhk节点的数据
[zk: localhost:2181(CONNECTED) 2] set /nhk nhk666
[zk: localhost:2181(CONNECTED) 3] 

# 3）观察kk01主机收到的数据变化的监听
WATCHER::

WatchedEvent state:SyncConnected type:NodeDataChanged path:/nhk

# 注意：在kk02上多次修改/nhk节点的值，kk01不会再继续监听。因为注册一次，只能监听一次。如果想再次监听，需要再次注册


# 2.节点的子节点变化监听（路径变化）
# 1）在kk01上注册监听/nhk节点 子节点变化
[zk: localhost:2181(CONNECTED) 2] ls -w /nhk
[app10000000000, app10000000001]

# 2）在kk02主机上/nhk节点上创建新节点app2
[zk: localhost:2181(CONNECTED) 4] create /nhk/app2 "test2"
Created /nhk/app2

# 3）观察kk01主机收到的子节点变化的监听
WATCHER::

WatchedEvent state:SyncConnected type:NodeChildrenChanged path:/nhk

# 注意：节点的路径变化，也是注册一次，生效一次。想多次生效。就需要多次注册
```

注意：

-   节点数据的变化监听，注册一次，只能监听一次。如果想再次监听，需要再次注册

-   节点的路径变化，也是注册一次，生效一次。想多次生效。就需要多次注册

    

## 6 ZooKeeper Java API操作

### 6.1 Zookeeper原生API

#### 1）创建准备

在确保kk01、kk02、kk03服务器上的zookeeper集群服务端启动

在pom添加相关依赖

```xml
<dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>RELEASE</version>
        </dependency>

        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
            <version>2.8.2</version>
        </dependency>

        <dependency>
            <groupId>org.apache.zookeeper</groupId>
            <artifactId>zookeeper</artifactId>
            <version>3.6.1</version>
        </dependency>
    </dependencies>
```

在src/main/sources目录下新建log4j.properties文件，内容如下

```properties
#############
# 输出到控制台
#############
# log4j.rootLogger日志输出类别和级别：只输出不低于该级别的日志信息DEBUG < INFO < WARN < ERROR < FATAL
# INFO：日志级别     CONSOLE：输出位置自己定义的一个名字     
log4j.rootLogger=INFO,CONSOLE
# 配置CONSOLE输出到控制台
log4j.appender.CONSOLE=org.apache.log4j.ConsoleAppender
# 配置CONSOLE设置为自定义布局模式
log4j.appender.CONSOLE.layout=org.apache.log4j.PatternLayout
# 配置CONSOLE日志的输出格式  [frame] 2019-08-22 22:52:12,000  %r耗费毫秒数 %p日志的优先级 %t线程名 %C所属类名通常为全类名 %L代码中的行号 %x线程相关联的NDC %m日志 %n换行
log4j.appender.CONSOLE.layout.ConversionPattern=[frame] %d{yyyy-MM-dd HH:mm:ss,SSS} - %-4r %-5p [%t] %C:%L %x - %m%n
```

#### 2）创建zookeeper客户端

```java
public class ZKClient {
    //  注意：逗号左右不能有空格，否则会连接不成功
    private static String connectString = "kk01:2181,kk02:2181,kk03:2181";
    private int sessionTimeout = 2000;
    private ZooKeeper zkClient = null;

    @Before
    public void init() throws IOException, InterruptedException {
        zkClient = new ZooKeeper(connectString, sessionTimeout, new Watcher() {
            @Override
            public void process(WatchedEvent event) {

            }
        });
    }

    @After
    public void close(){
        try {
            zkClient.close();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

#### 3）创建子节点

```java
    @Test
    public void create() {
        try {
            //   final String path, 要创建的节点的路径
            //   byte[] data, 节点数据
            //   List<ACL> acl,  节点权限
            //   CreateMode createMode  节点的类型
            zkClient.create("/test", "666".getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
        } catch (KeeperException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
```

测试：在kk01的zk客户端查看节点的创建情况

```shell
[zk: localhost:2181(CONNECTED) 3] ls /
[nhk, test, zookeeper]

```



#### 4）获取子节点并监听子节点变化

```java
@Before
    public void init() throws IOException, InterruptedException {
        zkClient = new ZooKeeper(connectString, sessionTimeout, new Watcher() {
            @Override
            public void process(WatchedEvent event) {
                List<String> children = null;
                try {
                    children = zkClient.getChildren("/test", true);
                } catch (KeeperException e) {
                    e.printStackTrace();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("------------------");
                for (String child : children) {
                    System.out.println(child);
                }
            }
        });
    }

@Test
    public void getChildren() throws InterruptedException {
        List<String> children = null;
        try {
            children = zkClient.getChildren("/test", true);
        } catch (KeeperException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("------------------");
        for (String child:children) {
            System.out.println(child);
        }

        // 为了让程序不那么快结束，我们让程序睡起来
        Thread.sleep(Integer.MAX_VALUE);
    }
```

测试：在kk01的zk客户端查看修改/test节点下创建子节点app1、app2

```shell
[zk: localhost:2181(CONNECTED) 7] create /test/app1 "t1"
Created /test/app1
[zk: localhost:2181(CONNECTED) 8] create /test/app2 "t2"
Created /test/app2

```

idea控制台打印如下信息

```
------------------
------------------
------------------
app1
------------------
app2
app1

```



#### 5）判断ZNode是否存在

```java
   @Test
    public void exist(){
        Stat status = null;
        try {
            status = zkClient.exists("/test", false);
        } catch (KeeperException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(status == null? "节点不存在":"节点存在");
        
    }
```



### 6.2 Curator API

Zookeeper提供了Java API 来方便开发者进行客户端编程，并根据需求操作服务器上的数据

配置开发环境

在IDEA中修改pom.xml文件内容如下：

```xml
<!-- 导入以下依赖坐标 zk依赖记得要与zk版本一致-->
<dependency>
	<groupId>org.apache.zookeeper</groupId>
    <artifactId>zookeeper</artifactId>
    <version>3.6.1</version> 
</dependency>
 <!-- 单元测试 -->
<dependency>
	<groupId>junit</groupId>
	<artifactId>junit</artifactId>
	<version>4.10</version>
	<scope>test</scope>
 </dependency>
```

#### 6.2.1 Curator介绍

Curator是Apache Zookeeper的Java客户端库

常见的Zookeeper Java API：

- ​	原生Java API
- ​	ZKClient
- ​	Curator

Curator项目的目标是**简化Zookeeper客户端的使用**

Curator最初是Netfix研发的，后来捐献给了Apache基金会，目前是Apache的顶级项目

#### 6.2.2 Curator API常用操作

##### 准备工作

**在pom导入相关依赖**

```xml
    <!-- curator-->
        <dependency>
            <groupId>org.apache.curator</groupId>
            <artifactId>curator-framework</artifactId>
            <version>4.0.0</version>
        </dependency>
        <dependency>
            <groupId>org.apache.curator</groupId>
            <artifactId>curator-recipes</artifactId>
            <version>4.0.0</version>
        </dependency>

        <!-- 单元测试 -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.10</version>
            <scope>test</scope>
        </dependency>

        <!--log4j相关jar-->
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>1.7.21</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
            <version>1.7.21</version>
        </dependency>
        
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

**log.properties文件**

```properties
log4j.rootLogger=DEBUG,console
#----------------输出为控制台-------------------#
log4j.appender.console=org.apache.log4j.ConsoleAppender
log4j.appender.console.Target=System.out
log4j.appender.console.Threshold=DEBUG
log4j.appender.console.ImmediateFlush=true
log4j.appender.console.layout=org.apache.log4j.PatternLayout
log4j.appender.console.layout.ConversionPattern=[%p][%d{yyyy-MM-dd HH:mm:ss}][%c]%m%n
```



##### 建立连接

推荐使用第二种连接方式

```java
public class CuratorTest {
    private static CuratorFramework client;

    /**
     * 建立连接
     */
    @Before
    public void testConnect() {
        /**
         * String connectString,  连接字符串
         * int sessionTimeoutMs,  会话超时时间 单位ms
         * int connectionTimeoutMs,  连接超时时间 单位ms
         * RetryPolicy retryPolicy  重试策略
         */
        // 重试策略
        RetryPolicy retryPolicy = new ExponentialBackoffRetry(3000, 10);

        // 第一种连接方式
        //CuratorFramework curator = CuratorFrameworkFactory.newClient("192.168.188.128:2181", 60 * 1000, 15 * 1000, retryPolicy);
        // 开启连接
        //curator.start();

        // 第二种连接
        client = CuratorFrameworkFactory.builder().connectString("192.168.188.128:2181").
                sessionTimeoutMs(60 * 1000).
                connectionTimeoutMs(15 * 1000).
                retryPolicy(retryPolicy).namespace("clear").build(); // 在根节点指定命名空间
        		// 注：使用该方式创建的命名空间，当其下无节点时，断开链接会自动将命名空间删除

        // 开启连接
        client.start();
    }

    /**
     * 关闭连接
     */
    @After
    public void close() {
        if (client != null) {
            client.close();
        }
    }
}

```

##### 添加节点

**基本创建**

```java
 /**
     * 创建节点：create 持久 临时 顺序 数据
     * 1.基本创建
     * 2.创建节点 带有数据
     * 3.设置节点的类型
     * 4.创建多级节点 /app1/p1
     */
    @Test
    public void testCreate(){
        // 1.基本创建
        // 如果创建节点，没有指明数据，则默认将当前客户端的ip作为数据存储
        try {
            String path = client.create().forPath("/app1");
            System.out.println(path);
        } catch (Exception e) {
            System.out.println("创建失败~~~");
            e.printStackTrace();
        }
 }
    
```

**测试**

在idea中运行测试后，在zkclient看到如下信息

```shell
[zk: localhost:2181(CONNECTED) 11] get /clear/app1
192.168.56.1
```

**创建带数据的节点**

```java
 /**
     * 创建节点：create 持久 临时 顺序 数据
     * 1.基本创建
     * 2.创建节点 带有数据
     * 3.设置节点的类型
     * 4.创建多级节点 /app1/p1
     */
    @Test
    public void testCreate2(){
        // 2.创建节点 带有数据
        try {
            // 如果创建节点，没有指明数据，则默认将当前客户端的ip作为数据存储
            String path = client.create().forPath("/app2","zjh".getBytes());
            System.out.println(path);
        } catch (Exception e) {
            System.out.println("创建失败~~~");
            e.printStackTrace();
        }
    }
```

**测试**

在idea中运行测试后，在zkclient看到如下信息

```shell
[zk: localhost:2181(CONNECTED) 12] get /clear/app2
zjh

```

**创建节点并设置类型**

```
  /**
     * 创建节点：create 持久 临时 顺序 数据
     * 1.基本创建
     * 2.创建节点 带有数据
     * 3.设置节点的类型
     * 4.创建多级节点 /app1/p1
     */
    @Test
    public void testCreate3(){
        // 3.设置节点的类型
        // 默认类型：持久化
        try {
         // 创建临时节点
            String path = client.create().withMode(CreateMode.EPHEMERAL).forPath("/app3","zjh".getBytes());
            System.out.println(path);
            
        } catch (Exception e) {
            System.out.println("创建失败~~~");
            e.printStackTrace();
        }
        
        while (true){
            // 因为是测试，所以弄个死循环保持客户端不断开连接
        }
}
```

**测试**

在idea中运行测试后，在zkclient看到如下信息

```
[zk: localhost:2181(CONNECTED) 29] ls /clear
[app1, app2, app3]
```

接着，我们中断idea，在zkclient看到如下信息，app3消失了

```shell
[zk: localhost:2181(CONNECTED) 29] ls /clear
[app1, app2, app3]
[zk: localhost:2181(CONNECTED) 30] ls /clear
[app1, app2]

```

**创建多级节点**

```java
/**
     * 创建节点：create 持久 临时 顺序 数据
     * 1.基本创建
     * 2.创建节点 带有数据
     * 3.设置节点的类型
     * 4.创建多级节点 /app1/p1
     */
    @Test
    public void testCreate4(){
        // 4.创建多级节点 /app4/p1
        try {
            // 创建临时节点
            String path = client.create().creatingParentContainersIfNeeded().forPath("/app4/p1","zjh".getBytes());
            System.out.println(path);
        } catch (Exception e) {
            System.out.println("创建失败~~~");
            e.printStackTrace();
        }
        while (true){
            // 因为是测试，所以弄个死循环保持客户端不断开连接
        }
    }
```

**测试**

在idea中运行测试后，在zkclient看到如下信息，说明多级目录创建成功

```
[zk: localhost:2181(CONNECTED) 17] ls /clear/app4
[p1]
```

**总结**

- 创建节点：create().forPath(" ")
- 创建带数据的节点：create().forPath("",data)
- 设置节点的类型：create().withMode().forPath("",data)
- 创建多级节点：create().creatingParentContainersIfNeeded().forPath("",data)



##### 删除节点

**删除单个节点**

```Java
 /**
     * 删除节点
     */
    @Test
    public void testDelete(){
        try {
             // 删除单个节点
            client.delete().forPath("/app1");
        } catch (Exception e) {
            System.out.println("删除失败~~~");
            e.printStackTrace();
        }
    }
```

**测试**

在idea中运行测试后，在zkclient查询不到对应的节点app1，则说明删除成功

```
[zk: localhost:2181(CONNECTED) 5] ls /clear
[app2, app4]

```

**删除带有子节点的节点**

```java
/**
     * 删除节点
     */
    @Test
    public void testDelete2(){
        // 删除带子节点的节点
        try {
            client.delete().deletingChildrenIfNeeded().forPath("/app4");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
```

**测试**

在idea中运行测试后，在zkclient查询不到对应的节点app4，则说明删除成功

```
[zk: localhost:2181(CONNECTED) 14] ls /clear
[app2]
```

**必须成功的删除**

为了防止网络抖动。本质就是未成功删除就重试	

```
    /**
     * 删除节点
     */
    @Test
    public void testDelete3(){
        // 必须成功删除节点
        try {
            client.delete().guaranteed().forPath("/app2");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

```

**测试**

在idea中运行测试后，在zkclient查询不到对应的节点app2，则说明删除成功

```shell
[zk: localhost:2181(CONNECTED) 17] ls /clear
[]
```

**回调**

```java
/**
     * 删除节点
     */
    @Test
    public void testDelete4(){
        try{
            // 回调
            client.delete().guaranteed().inBackground(new BackgroundCallback() {
                @Override
                public void processResult(CuratorFramework client, CuratorEvent event) throws Exception {
                    System.out.println("我被删除了~");
                    System.out.println(event);
                }
            }).forPath("/app1");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
```

**测试**

在idea中运行测试后，在控制台打印了相关信息，在zkclient查询不到对应的节点app1，则说明删除成功，当namespace中无节点时，namespace也会被删除

```
[zk: localhost:2181(CONNECTED) 28] ls /
[hbase, zookeeper]
```

**总结**

* 删除节点：dlete deleteall
* 1.删除单个节点：delete().forPath("")
* 2.删除带子节点的节点：delete().deletingChildrenIfNeeded().forPath("")
* 3.必须成功删除节点：为了防止网络抖动。本质就是重试：delete().guaranteed().forPath("");
* 4.回调：inBackground



##### 修改节点

**修改数据**

```java
   /**
     * 修改数据
     * 1.修改数据
     * 2.根据版本修改
     */
    @Test
    public void testSet(){
        try {
            // 修改数据
            client.setData().forPath("/app1","miss you".getBytes());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
```

**测试**

在idea中运行测试后，在zkclient看到如下信息，说明修改成功

```
[zk: localhost:2181(CONNECTED) 25] get /clear/app1
miss you

```

**根据版本修改**

```
    /**
     * 修改数据
     * 1.修改数据
     * 2.根据版本修改
     */
    @Test
    public void testSeForVersion() throws Exception {
        Stat status = new Stat();
        // 查询节点状态信息
        client.getData().storingStatIn(status).forPath("/app1");

        int version = status.getVersion(); // 查询出来的结果
        System.out.println(version);
        // 根据版本修改
        try {
            client.setData().withVersion(version).forPath("/app1","dont".getBytes());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
```

**测试**

在idea中运行测试后，在zkclient看到如下信息，说明修改成功

```
[zk: localhost:2181(CONNECTED) 29] get /clear/app1
dont
```

**总结**

修改数据
   * 修改数据   		setData().forPath(“”，data);

   * 根据版本修改   setData().withVersion(版本信息).forPath(“”，data);

        

##### 查询节点

**查询节点数据**

```java
   /**
     * 查询节点：
     * 1.查询数据：get
     * 2.查询子节点：ls
     * 3.查询节点状态信息：ls -s
     */
    @Test
    public void testGet1() {
        try {
            // 查询节点数据
            byte[] data = client.getData().forPath("/app1");  // 路径前必须加/ 否则报错 Path must start with / character
            System.out.println(new String(data));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

```

**查询子节点**

```java
 /**
     * 查询节点：
     * 1.查询数据：get
     * 2.查询子节点：ls
     * 3.查询节点状态信息：ls -s
     */
    @Test
    public void testGet2() {
        List<String> path = null;
        try {
            // 查询子节点 ls
            path = client.getChildren().forPath("/app4");
        } catch (Exception e) {
            e.printStackTrace();
        }
        for (String p :path) {
            System.out.println(p);
        }
    }
```

**查询节点状态信息**

```java
  /**
     * 查询节点：
     * 1.查询数据：get
     * 2.查询子节点：ls
     * 3.查询节点状态信息：ls -s
     */
    @Test
    public void testGet3() {
        Stat status = new Stat();
        /**
         * 如下是各种状态信息，需要时直接调用 get set方法即可
         * public class Stat implements Record {
         *     private long czxid;
         *     private long mzxid;
         *     private long ctime;
         *     private long mtime;
         *     private int version;
         *     private int cversion;
         *     private int aversion;
         *     private long ephemeralOwner;
         *     private int dataLength;
         *     private int numChildren;
         *     private long pzxid;
         */
        System.out.println(status);
        // 查询节点状态信息：ls -s
        try {
            client.getData().storingStatIn(status).forPath("/app1");
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(status);  // 仅用于测试，真实项目中不会是这个用发
    }

```

**总结**

* 1.查询数据：get  	getData().forPath("")
* 2.查询子节点：ls     getChildren().forPath("")
* 3.查询节点状态信息：ls -s      getData().storingStatIn(状态对象).forPath("");

## 7 Watch事件监听

- zookeeper允许用户在指定节点上注册一些Watcher，并且在一些特定事件触发时，Zookeeper服务端会将事件通知到感兴趣的客户端上去，该机制是zookeeper实训分布式协调服务的重要特性。

- Zookeeper中引入Watcher机制来实现发布/订阅功能，能够让多个订阅者同时监听某一个对象，当一个对象自身状态变化时，会通知所有订阅者

- zookeeper原生支持通过注册Watcher来进行事件监听，但是其使用并不是特别方便，，需要开发人员自己反复注册Watcher，比较繁琐

- Curator引入了Cache来实现对Zookeeper服务端事件的监听
- Zookeeper提供了三种Watcher：

​	1）NodeCache：只是监听某一个特定的节点

​	2）PathChildrenCache：监控一个ZNode的子节点

​	3）TreeCache：可以监控整个树上的所有节点，类似于PathChildrenCache和PathChildrenCache的组合

### 7.1 NodeCache演示

建立连接与关闭连接的操作与上面一样，这里不在赘述

```java
/**
 * 演示 NodeCache：给指定的节点注册监听器
 */
@Test
public void testNodeCache() {
    // 1.创建NodeCache对象
    NodeCache nodeCache = new NodeCache(client, "/app1");
    // 2.注册监听
    /*    nodeCache.getListenable().addListener(new NodeCacheListener() {
            @Override
            public void nodeChanged() throws Exception {
                System.out.println("节点变化了~");
            }
        });*/
    nodeCache.getListenable().addListener(() -> System.out.print("节点变化了~"));
    // 3.开启监听 如果设置为true，则开启监听，加载缓冲数据
    try {
        nodeCache.start(true);
    } catch (Exception e) {
        e.printStackTrace();
    }

    while (true) {
        // 因为是测试，所以弄个死循环保持客户端不断开连接
    }
}
```

**测试**

当我们在zookeeper的客户端，对/clear/app1节点进行改变时（增加、删除、修改节点），会看到IEDA控制台打印出  节点变化了~

### 7.2 PathChildrenCache演示

```java
/**
 * 演示 PathChildrenCache 监听某个节点的所有孩子节点们
 */
@Test
public void testPathChildrenCache() throws Exception {
    // 1.创建监听对象
    PathChildrenCache pathChildrenCache = new PathChildrenCache(client, "/app2",true);
    // 2.判断监听器
    pathChildrenCache.getListenable().addListener(new PathChildrenCacheListener() {
        @Override  // 可用lambda表达式简化
        public void childEvent(CuratorFramework client, PathChildrenCacheEvent event) throws Exception {
            System.out.println("子节点变化了~");
            System.out.println(event);
            // 监听子节点的数据变更，并且拿到变更后的数据
            // 1)获取类型
            PathChildrenCacheEvent.Type type = event.getType();
            // 2)判断类型是否是update
            if(type.equals(PathChildrenCacheEvent.Type.CHILD_UPDATED)){
                System.out.println("子节点的数据变更了~");
                // 第一个getData()应该是获取子节点
                // 第二格getData()应该是获取子节点的数据
                byte[] data = event.getData().getData();
                System.out.println(new String(data));  // 字节数组以ASCII码形式输出

            }
        }
    });
    // 3.开启监听
    pathChildrenCache.start();
    while (true) {
        // 因为是测试，所以弄个死循环保持客户端不断开连接
    }
}
```

### 7.3 TreeCache演示

```java
 /**
     * 演示 TreeCache 监听某个节点自己和其子节点们
     */
    @Test
    public void testTreeCache() {
        // 1.创建监听器
        TreeCache treeCache = new TreeCache(client, "/app2");
        // 2.注册监听
        treeCache.getListenable().addListener(new TreeCacheListener() {
            @Override
            public void childEvent(CuratorFramework client, TreeCacheEvent event) throws Exception {
                System.out.println("节点变化了~~");
                System.out.println(event);
            }
        });
        // 3.开启监听
        try {
            treeCache.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
        while (true) {
            // 因为是测试，所以弄个死循环保持客户端不断开连接
        }
    }
```

## 8 分布式锁

- 在我们进行单机应用开发，涉及同步时，我们玩玩采用synchronized 或者 Lock的方式解决多线程间代码同步问题，这时多线程运行都是运行在同一个JVM之下，没有任何问题
- 但当我们的应用是分布式集群工作的情况下，属于**多JVM之下的工作环境，跨JVM之间无法通过多线程的锁解决同步问题。**
- 因此需要一种更加高级的锁机制，来处理**跨机器的进程之间的数据的同步问题**——即分布式锁

### 8.1 Zookeeper分布式锁原理

**核心思想**：当客户端要获取锁，则创建节点，使用完锁，则删除该节点。

当我们假设根节点/ 下有/lock节点时

1）客户端获取锁时，在lock节点下创建**临时顺序**节点。

2）然后获取lock下面的所有子节点，客户端获取到所有的子节点之后，如果**发现自己创建的子节点序号最小，那么就认为该客户端获取到了锁。**（即需要小的优先）使用完锁后，将删除该结点。

3）如果发现自己创建的节点并非lock所有子节点中最小的，说明自己还没获取到锁，此时客户端需要**找到比自己小的那个节点，同时对其注册事件监听器，监听删除事件。**

4）如果发现比自己小的那个节点被删除，则客户端的Watcher会收到相应通知，此时再次判断自己创建的节点是否是lock子节点中序号最小的，如果是则获取到了锁，如果不是则重复以上步骤继续获取到比自己小的一个节点并注册监听。

### 8.2 Curator实现分布式锁API

在Curator中有五种锁方案：

```java
InterProcessMultiLock   分布式排它锁（非可重入锁）
InterProcessMutex       分布式可重入锁排它锁
InterProcessReadWriteLock   分布式读写锁
InterProcessMultiLock		将多个锁作为单个实体管理的容器
InterProcessSemaphoreV2		共享信号量
```

### 8.3 分布式锁案例

模拟12306抢票系统

```java
public class SaleTickets12306 implements Runnable {
    private int tickets = 10;  // 模拟的票数
    private InterProcessMutex lock;

    public SaleTickets12306(){
        // 重试策略
        RetryPolicy retryPolicy = new ExponentialBackoffRetry(3000,10);
        CuratorFramework client = CuratorFrameworkFactory.builder()
                .connectString("192.168.188.128:2181")
                .sessionTimeoutMs(60*1000)
                .connectionTimeoutMs(15*1000)
                .retryPolicy(retryPolicy)
                .namespace("nhk")  // 程序临时创建的命名空间
                .build();
        // 开启连接
        client.start();

        lock = new InterProcessMutex(client,"/lock");

    }

    @Override
    public void run() {
        while (true) {
            // 获得锁
            try {
                lock.acquire(3, TimeUnit.SECONDS);
                if (tickets > 0) {
                    System.out.println(Thread.currentThread().getName() + ":" + tickets--);
                    Thread.sleep(100);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                // 释放锁
                try {
                    lock.release();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        }
    }
}

```

```java
public class LookTest {
    public static void main(String[] args) {
        SaleTickets12306 saleTickets12306 = new SaleTickets12306();

        // 创建售票平台
        Thread t1 = new Thread(saleTickets12306,"携程");
        Thread t2 = new Thread(saleTickets12306,"铁友");

        t1.start();
        t2.start();
    }
}

```

