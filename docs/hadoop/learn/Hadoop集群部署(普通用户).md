# Hadoop集群部署（普通用户）

Hadoop运行模式包括：**本地模式**、**伪分布式模式**以及**完全分布式模式**。

-    **本地模式**：单机运行，只是用来演示一下官方案例。生产环境不用。
-   **伪分布式模式：**也是单机运行，但是具备Hadoop集群的所有功能，一台服务器模拟一个分布式的环境。个别缺钱的公司用来测试，生产环境不用。
-   **完全分布式模式：**多台服务器组成分布式环境。生产环境使用。

下面进行完全分布式安装：

​	1）准备3台客户机（关闭防火墙、静态IP、主机名称、时间同步等）

​	2）安装JDK

​	3）配置环境变量

​	4）安装Hadoop

​	5）配置环境变量

​	6）配置集群

​	7）配置历史服务器

​	8）群起集群

​	9）单点启动

## 环境准备

### **1）准备3台客户机**（关闭防火墙、静态IP、主机名称）

如果这一步已经配置过了，可以忽略

```shell
# 1 关闭防火墙
systemctl stop firewalld.service # 关闭当前防火墙
systemctl disable firewalld.service  # 关闭防火墙开机自启动

# 2.配置静态ip
vim /etc/sysconfig/network-scripts/ifcfg-ens33
# 做出如下修改
BOOTPROTO=static  # 改为静态
# 末尾添加如下内容
IPADDR=192.168.188.128
GATEWAY=192.168.188.2
NETMASK=255.255.255.0
DNS1=192.168.188.2

# 重启网卡
systemctl restart network.service

# 3.修改主机名
vim /etc/hostname
# 配置hosts映射
vim /etc/hosts
192.168.188.128 kk01
192.168.188.129 kk02
192.168.188.130 kk03


# 修改window的主机映射文件（hosts）
# 进入C:\Windows\System32\drivers\etc
# 添加如下内容
192.168.188.128 kk01
192.168.188.129 kk02
192.168.188.130 kk03
```

###  2）安装JDK，并配置JDK环境变量

==注意：安装JDK前，一定确保提前删除了虚拟机自带的JDK==

```shell
# 删除自带JDK
# rpm -qa | grep -i java | xargs -n1 rpm -e --nodeps

# 说明
	rpm -qa：查询所安装的所有rpm软件包
	grep -i：忽略大小写
	xargs -n1：表示每次只传递一个参数
	rpm -e –nodeps：强制卸载软件
```

**扩展部分（可选）**

```shell
# 如果安装的linux是最小版的，则需要安装net-tool工具包、vim编辑器等
yum install -y net-tools   # 工具包中包含ifconfig等命令
yum install -y vim

# 安装epel-release(Extra Packages for Enterprise Linux)与rpm相似，但是可以下载到官方repository中是找不到的rpm包
yum install -y epel-release
```

### **3）创建普通用户，并让其具有root权限**

配置nhk用户具有root权限，**方便后期加sudo执行root权限的命令**（如果使用root用户可以忽略该步骤）

```shell
# 创建用户 （如果安装Linux时已经创建了，这一步骤可以忽略）
useradd nhk
passwd 123456

# 配置普通用户(nhk)具有root权限，方便后期加sudo执行root权限的命令
vim /etc/sudoers

# 在%wheel这行下面添加一行 (大概是在100行左右位置)

## Allow root to run any commands anywhere 
root    ALL=(ALL)       ALL 

## Allows members of the 'sys' group to run networking, software, 
## service management apps and more.
# %sys ALL = NETWORKING, SOFTWARE, SERVICES, STORAGE, DELEGATING, PROCESSES, LOCATE, DRIVERS

## Allows people in group wheel to run all commands
%wheel  ALL=(ALL)       ALL 

## Same thing without a password
# %wheel        ALL=(ALL)       NOPASSWD: ALL
nhk ALL=(ALL) NOPASSWD: ALL 
```

注意：

​	nhk ALL=(ALL) NOPASSWD: ALL 这一行不要直接放到root行下面，因为所有用户都属于wheel组，你先配置了nhk具有免密功能，但是程序执行到%wheel行时，该功能又被覆盖回需要密码。所以nhk要放到%wheel这行下面。

### **4）创建统一工作目录**

（后续在集群的多台机器之间都需要创建）

```shell
# 个人习惯
mkdir -p /opt/software/ # 软件安装目录、安装包存放目录
mkdir -p /opt/data/   # 数据存储路径

# 修改文件夹所有者和所属组 （如果是使用root用户搭建集群可以忽略）
chown nhk:nhk /opt/software
chown nhk:nhk /opt/data

# 黑马推荐
mkdir -p /export/server/   # 软件安装目录
mkdir -p /export/data/  # 数据存储路径
mkdir -p /export/software/ # 安装包存放目录

# 尚硅谷推荐
mkdir /opt/module
mkdir /opt/software
```

### **5）集群时间同步**

```shell
# 在集群的每台集群
yum -y install ntpdate 

$ sudo ntpdate ntp4.aliyun.com
16 Jun 20:04:19 ntpdate[3549]: adjust time server 203.107.6.88 offset 0.213857 sec
# 或
$ sudo ntpdate ntp5.aliyum.com

# 查看时间
date
```

## 集群部署

### 1）集群部署规划

注意：NameNode 和 SecondaryNameNode 不要安装在同一台服务器

注意：ResourceManager 也很消耗内存，不要和 NameNode、SecondaryNameNode 配置在同一台机器上。

|      | kk01              | kk02                        | kk03                       |
| ---- | ----------------- | --------------------------- | -------------------------- |
| HDFS | NameNode DataNode | DataNode                    | SecondaryNameNode DataNode |
| YARN | NodeManager       | ResourceManager NodeManager | NodeManager                |

### 2）上传Hadoop压缩包

上传压缩包至 /opt/software目录下

```shell
[nhk@kk01 software]$ ll
total 849736
-rw-rw-r--. 1 nhk nhk 338075860 Jun 16 20:10 hadoop-3.1.3.tar.gz
drwxr-xr-x. 8 nhk nhk       255 Sep 14  2017 jdk1.8.0_152
-rw-rw-r--. 1 nhk nhk 531056640 Jun 16 19:27 mysql-5.7.27-1.el7.x86_64.rpm-bundle.tar
-rw-r--r--. 1 nhk nhk    985600 Apr 28  2022 mysql-connector-java-5.1.37.jar
drwxrwxr-x. 2 nhk nhk      4096 Jun 16 19:30 mysql_lib
```

### 3）解压压缩包

```shell
[nhk@kk01 software]$ tar -zxvf hadoop-3.1.3.tar.gz -C /opt/software/
```

### 4）配置环境变量

进入 /etc/profile.d/my_env.sh 文件

```shell
[nhk@kk01 software]$ sudo vim /etc/profile.d/my_env.sh
```

在profile文件末尾添加JDK路径：（shitf+g）

```shell
#HADOOP_HOME
export HADOOP_HOME=/opt/software/hadoop-3.1.3
export PATH=$PATH:$JAVA_HOME/bin:$HADOOP_HOME/bin:$HADOOP_HOME/sbin
```

刷新环境变量

```shell
[nhk@kk01 software]$ source /etc/profile.d/my_env.sh
```

## 配置集群

### 1）core配置文件

配置core-site.xml

```shell
[nhk@kk01 hadoop]$ pwd
/opt/software/hadoop-3.1.3/etc/hadoop
[nhk@kk01 hadoop]$ vim core-site.xml
```

参考的配置文件如下

```xml
<configuration>
	<!-- 指定NameNode的地址 -->
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://kk01:8020</value>
    </property>
    <!-- 指定hadoop数据的存储目录（默认存储在/tmp，这会导致数据丢失） -->
    <property>
        <name>hadoop.tmp.dir</name>
        <value>/opt/software/hadoop-3.1.3/data</value>
    </property>

    <!-- 配置HDFS网页登录使用的静态用户为nhk(用哪个用户启动Hadoop就配置哪个用户) -->
    <property>
        <name>hadoop.http.staticuser.user</name>
        <value>nhk</value>
    </property>

    <!-- 下面三个参数在Hadoop与 hive 整合时会用到 -->
    <!-- 配置该nhk(superUser)允许通过代理访问的主机节点 -->
    <property>
        <name>hadoop.proxyuser.nhk.hosts</name>
        <value>*</value>
    </property>
    <!-- 配置该nhk(superUser)允许通过代理用户所属组 -->
    <property>
        <name>hadoop.proxyuser.nhk.groups</name>
        <value>*</value>
    </property>
    <!-- 配置该nhk(superUser)允许通过代理的用户-->
    <property>
        <name>hadoop.proxyuser.nhk.users</name>
       <value>*</value>
    </property>
    
    <!--  缓冲区大小，实际工作中根据服务器性能动态调整 -->
    <property>
        <name>io.file.buffer.size</name>
        <value>4096</value>
    </property>

</configuration>
```

注意

```xml
<property>
	<name>fs.defaultFS</name>
	<value>hdfs://kk01:8020</value>
</property>

在 Hadoop 1.x 版本 为 8020
在 Hadoop 2.x 版本 为 9000
在 Hadoop 3.0.x 版本 为 9020
在 Hadoop 3.1.x 版本 为 8020
```

### 2）HDFS配置文件

配置hdfs-site.xml

```shell
[nhk@kk01 hadoop]$ pwd
/opt/software/hadoop-3.1.3/etc/hadoop
[nhk@kk01 hadoop]$ vim hdfs-site.xml
```

参考的配置文件如下

```xml
<configuration>
	<!-- nn web端访问地址-->
	<property>
        <name>dfs.namenode.http-address</name>
        <value>kk01:9870</value>
    </property>
    
	<!-- 2nn web端访问地址-->
    <property>
        <name>dfs.namenode.secondary.http-address</name>
        <value>kk03:9868</value>
    </property>
    
    <!-- 测试环境指定HDFS副本的数量1，生成环境一定要配置成3 -->
    <property>
        <name>dfs.replication</name>
        <value>3</value>
    </property>
    
    <!-- 关闭 hdfs 文件权限检查，方便学习使用 -->
    <property>
        <name>dfs.permissions</name>
        <value>false</value>
    </property>
</configuration>
```

注意

```xml
<!-- nn web端访问地址-->
<property>
    <name>dfs.namenode.http-address</name>
    <value>kk01:9870</value>
</property>

在 Hadoop 1.x 版本 为 50070
在 Hadoop 2.x 版本 为 50070
在 Hadoop 3.x 版本 为 9780

<!-- 2nn web端访问地址-->
<property>
    <name>dfs.namenode.secondary.http-address</name>
    <value>kk03:9868</value>
</property>

在 Hadoop 2.x 版本 为 50090
```

### 3）YARN配置文件

配置yarn-site.xml

```shell
[nhk@kk01 hadoop]$ pwd
/opt/software/hadoop-3.1.3/etc/hadoop
[nhk@kk01 hadoop]$ vim yarn-site.xml
```

参考的配置文件如下

```xml
<configuration>
	<!-- 指定MR走shuffle -->
    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>
    
    <!-- 指定ResourceManager的地址-->
    <property>
        <name>yarn.resourcemanager.hostname</name>
        <value>kk02</value>
    </property>
    
    <!-- 环境变量的继承 （在2.x版本不需要显式配置）-->
    <property>
        <name>yarn.nodemanager.env-whitelist</name>
<value>JAVA_HOME,HADOOP_COMMON_HOME,HADOOP_HDFS_HOME,HADOOP_CONF_DIR,CLASSPATH_PREPEND_DISTCACHE,HADOOP_YARN_HOME,HADOOP_MAPRED_HOME</value>
    </property>
    
    <!-- 以下三个参数，在生产环境中需要每台单独配置，以契合机器的内存大小-->
    <!--yarn单个容器允许分配的最大最小内存（默认8g）-->
    <property>
        <name>yarn.scheduler.minimum-allocation-mb</name>
        <value>512</value>
    </property>
    <property>
        <name>yarn.scheduler.maximum-allocation-mb</name>
        <value>4096</value>
    </property>
    
    <!-- yarn容器允许管理的物理内存大小（默认8g） -->
    <property>
        <name>yarn.nodemanager.resource.memory-mb</name>
        <value>4096</value>
    </property>
    
    <!-- 关闭yarn对虚拟内存的限制检查 -->
    <!-- 以下两个参数默认都为 true -->
    <property>
        <name>yarn.nodemanager.pmem-check-enabled</name>
        <value>true</value>
    </property>
    <property>
        <name>yarn.nodemanager.vmem-check-enabled</name>
        <value>false</value>
    </property>
</configuration>
```

### 4）MapReduce配置文件

配置mapred-site.xml

```shell
[nhk@kk01 hadoop]$ pwd
/opt/software/hadoop-3.1.3/etc/hadoop
[nhk@kk01 hadoop]$ vim mapred-site.xml 
```

参考的配置文件如下

```xml
<configuration>
	<!-- 指定MapReduce程序运行在Yarn上 -->
    <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
    </property>
</configuration>
```

### 5）workers

该文件用于指定 NodeManage、DataNode启动的节点

```shell
[nhk@kk01 hadoop]$ pwd
[nhk@kk01 hadoop]$ vim workers 
[nhk@kk01 hadoop]$ cat workers 
kk01
kk02
kk03
```

注意：

​	**该文件中添加的内容结尾不允许有空格，文件中不允许有空行。**



## 配置历史服务器

为了查看程序的历史运行情况，需要配置一下历史服务器。具体配置步骤如下：

### 1）配置 mapred-site.xml

```shell
[nhk@kk01 hadoop]$ pwd
/opt/software/hadoop-3.1.3/etc/hadoop
[nhk@kk01 hadoop]$ vim mapred-site.xml
```

在文件中增加如下配置

```xml
<!-- MR程序历史服务地址-->
<property>
    <name>mapreduce.jobhistory.address</name>
    <value>kk01:10020</value>
</property>
<!-- MR程序历史服务器web端地址-->
<property>
    <name>mapreduce.jobhistory.webapp.address</name>
    <value>kk01:19888</value>
</property>
```

## 配置日志的聚集

日志聚集概念：应用运行完成以后，将程序运行日志信息上传到HDFS系统上。

日志聚集功能好处：可以方便的查看到程序运行详情，方便开发调试。

注意：

​	**开启日志聚集功能，需要重新启动NodeManager 、ResourceManager和HistoryManager。**

开启日志聚集功能具体步骤如下：

### 1）配置 yarn-site.xml

```shell
[nhk@kk01 hadoop]$ pwd
/opt/software/hadoop-3.1.3/etc/hadoop
[nhk@kk01 hadoop]$ vim yarn-site.xml
```

在文件中增加如下配置

```xml
<!-- 开启日志聚集功能 -->
<property>
    <name>yarn.log-aggregation-enable</name>
    <value>true</value>
</property>

<!-- 设置日志聚集服务器地址 -->
<!-- 设置yarn历史服务器地址-->
<property>  
    <name>yarn.log.server.url</name>  
    <value>http://kk01:19888/jobhistory/logs</value>
</property>

<!-- 设置日志保留时间为7天 -->
<!-- 历史日志保存的时间 7天-->
<property>
    <name>yarn.log-aggregation.retain-seconds</name>
    <value>604800</value>
</property>
```

## 分发Hadoop及其环境变量

### 1）分发Hadoop

```shell
# 使用自定义分发脚本
[nhk@kk01 hadoop-3.1.3]$ xsync /opt/software/hadoop-3.1.3/

# 如果没有脚本，也可以使用 scp 或 rsync 命令
scp -r /opt/software/hadoop-3.1.3/ nhk@kk02:/opt/software/
scp -r /opt/software/hadoop-3.1.3/ nhk@kk03:/opt/software/
```

### 2）分发环境变量

```shell
# 使用自定义分发脚本（分发环境变量xsync必须使用绝对路径）
[nhk@kk01 hadoop-3.1.3]$ sudo /home/nhk/bin/xsync /etc/profile.d/my_env.sh

# 如果没有脚本，也可以使用 scp 或 rsync 命令
scp -r /etc/profile.d/my_env.sh nhk@kk02:/etc/profile.d/my_env.sh
scp -r /etc/profile.d/my_env.sh nhk@kk03:/etc/profile.d/my_env.sh
```

### 3）刷新环境变量

```shell
[nhk@kk01 hadoop-3.1.3]$ source /etc/profile.d/my_env.sh
[nhk@kk02 hadoop-3.1.3]$ source /etc/profile.d/my_env.sh
[nhk@kk03 hadoop-3.1.3]$ source /etc/profile.d/my_env.sh
```

## 群起集群

### 1）格式化

**如果集群是第一次启动**，需要在kk01节点**格式化NameNode**（注意格式化之前，一定要先停止上次启动的所有namenode 和 datanode进程，然后再删除 data 和 log 数据，后续如果集群出错，也是这样重新进行格式化）

```shell
[nhk@kk01 hadoop-3.1.3]$ bin/hdfs namenode -format

# 若出现 successfully formatted 字样则说明格式化成功
```

### 2）启动HDFS

```shell
[nhk@kk01 hadoop-3.1.3]$ sbin/start-dfs.sh   # 第一次启动，有这些警告是正常的
Starting namenodes on [kk01]
Starting datanodes
kk02: WARNING: /opt/software/hadoop-3.1.3/logs does not exist. Creating.
kk03: WARNING: /opt/software/hadoop-3.1.3/logs does not exist. Creating.
Starting secondary namenodes [kk03]
```

### 3）启动 yarn

需要在配置了**ResourceManager**的节点（kk02）启动YARN

```shell
[nhk@kk02 hadoop-3.1.3]$ sbin/start-yarn.sh
Starting resourcemanager
Starting nodemanagers

```

在kk01上查看集群进程

```shell
[nhk@kk01 hadoop-3.1.3]$ xcall jps
------------ kk01 ------------
5125 Jps
4648 DataNode
4987 NodeManager
4477 NameNode
------------ kk02 ------------
3578 DataNode
4330 Jps
3820 ResourceManager
3950 NodeManager
------------ kk03 ------------
3890 NodeManager
4025 Jps
3724 SecondaryNameNode
3630 DataNode
```

### 4）web端查看HDFS

Web端查看HDFS的Web页面：<http://kk01:9870/>

### 5）web端查看 SecondaryNameNode

Web端查看SecondaryNameNode的Web页面：<http://kk03:9868/status.html>

我们发现查看了，但是啥也不显示，查看浏览器开发者页面发现如下报错

```diff
Uncaught ReferenceError: moment is not defined
    at Object.date_tostring (dfs-dust.js:61:7)
....
```

下面来解决这个bug

（1）进入SNN节点所在的机器

```shell
[nhk@kk03 static]$ pwd
/opt/software/hadoop-3.1.3/share/hadoop/hdfs/webapps/static
[nhk@kk03 static]$ vim dfs-dust.js
```

将如下函数

```javascript
'date_tostring' : function (v) {
    return moment(Number(v)).format('ddd MMM DD HH:mm:ss ZZ YYYY');
},
```

修改为

```javascript
'date_tostring' : function (v) {
	return Number(v).toLocaleString();
},
```

接着，我们删除浏览器缓存，再次查看SecondaryNameNode的Web页面即可正常查看



## Hadoop群起脚本

如果我们每次要启动Hadoop都要现在kk01节点上启动hdfs、在kk02上启动yarn，这样岂不是很麻烦，所有我们编写了Hadoop群起停的脚本，如下

```shell
[nhk@kk01 bin]$ pwd
/home/nhk/bin
[nhk@kk01 bin]$ vim hdp.sh	
```

脚本内容如下

```shell
#!/bin/bash
if [ $# -lt 1 ]
then
    echo "No Args Input..."
    exit ;
fi
case $1 in
"start")
        echo " =================== 启动 hadoop集群 ==================="

        echo " --------------- 启动 hdfs ---------------"
        ssh kk01 "/opt/software/hadoop-3.1.3/sbin/start-dfs.sh"
        echo " --------------- 启动 yarn ---------------"
        ssh kk02 "/opt/software/hadoop-3.1.3/sbin/start-yarn.sh"
        echo " --------------- 启动 historyserver ---------------"
        ssh kk01 "/opt/software/hadoop-3.1.3/bin/mapred --daemon start historyserver"
;;
"stop")
        echo " =================== 关闭 hadoop集群 ==================="

        echo " --------------- 关闭 historyserver ---------------"
        ssh kk01 "/opt/software/hadoop-3.1.3/bin/mapred --daemon stop historyserver"
        echo " --------------- 关闭 yarn ---------------"
        ssh kk02 "/opt/software/hadoop-3.1.3/sbin/stop-yarn.sh"
   echo " --------------- 关闭 hdfs ---------------"
        ssh kk01 "/opt/software/hadoop-3.1.3/sbin/stop-dfs.sh"
;;
*)
    echo "Input Args Error..."
;;
esac
```

给脚本赋予执行权限

```shell
[nhk@kk01 bin]$ chmod 777 hdp.sh
```



##  集群时间同步

​	时间同步的方式：找一个机器，作为时间服务器，所有的机器与这台集群时间进行定时的同步，比如，每隔十分钟，同步一次时间。

###  1）时间服务器配置（必须root用户）

#### （0）查看所有节点ntpd服务状态和开机自启动状态

```shell
[nhk@kk01 ~]$ sudo systemctl status ntpd
[nhk@kk01 ~]$ sudo systemctl is-enabled ntpd

[nhk@kk02 ~]$ sudo systemctl status ntpd
[nhk@kk02 ~]$ sudo systemctl is-enabled ntpd

[nhk@kk03 ~]$ sudo systemctl status ntpd
[nhk@kk03 ~]$ sudo systemctl is-enabled ntpd
```

#### （1）在所有节点关闭ntp服务和自启动

```shell
[nhk@kk01 ~]$ sudo systemctl stop ntpd
[nhk@kk01 ~]$ sudo systemctl disable ntpd

[nhk@kk02 ~]$ sudo systemctl stop ntpd
[nhk@kk02 ~]$ sudo systemctl disable ntpd

[nhk@kk03 ~]$ sudo systemctl stop ntpd
[nhk@kk03 ~]$ sudo systemctl disable ntpd
```

#### （2）修改hadoop102的ntp.conf配置文件

```shell
[nhk@kk01 ~]$ sudo vim /etc/ntp.conf
```

修改内容如下

修改1（授权192.168.188.0-192.168.188.255网段上的所有机器可以从这台机器上查询和同步时间）

```
#restrict 192.168.188.0 mask 255.255.255.0 nomodify notrap
```

为

```conf
restrict 192.168.188.0 mask 255.255.255.0 nomodify notrap
```

修改2（集群在局域网中，不使用其他互联网上的时间）

```conf
server 0.centos.pool.ntp.org iburst
server 1.centos.pool.ntp.org iburst
server 2.centos.pool.ntp.org iburst
server 3.centos.pool.ntp.org iburst
```

为

```
#server 0.centos.pool.ntp.org iburst
#server 1.centos.pool.ntp.org iburst
#server 2.centos.pool.ntp.org iburst
#server 3.centos.pool.ntp.org iburst
```

c）添加3（当该节点丢失网络连接，依然可以采用本地时间作为时间服务器为集群中的其他节点提供时间同步）

```
server 127.127.1.0
fudge 127.127.1.0 stratum 10
```

#### （3）修改kk01的/etc/sysconfig/ntpd 文件

```shell
[nhk@kk01 ~]$ sudo vim /etc/sysconfig/ntpd
```

增加内容如下（让硬件时间与系统时间一起同步）

```
SYNC_HWCLOCK=yes
```

#### （4）重新启动ntpd服务

```
[nhk@kk01 ~]$ sudo systemctl start ntpd
```

#### （5）设置ntpd服务开机启动

```
[nhk@kk01 ~]$ sudo systemctl enable ntpd
```

### 2）其他机器配置（必须root用户）

#### （1）在其他机器配置10分钟与时间服务器同步一次

```shell
[nhk@kk02 ~]$ sudo crontab -e

[nhk@kk03 ~]$ sudo crontab -e
```

编写定时任务如下：

```
*/10 * * * * /usr/sbin/ntpdate kk01
```

#### （2）修改任意机器时间

```shell
[nhk@kk02 ~]$ sudo date -s "2017-9-11 11:11:11"
```

#### （3）十分钟后查看机器是否与时间服务器同步

```shell
[nhk@kk02 ~]$ sudo date
```

说明：测试的时候可以将10分钟调整为1分钟，节省时间。



## **常用端口号说明**

| 端口名称                  | Hadoop2.x   | Hadoop3.x          |
| ------------------------- | ----------- | ------------------ |
| NameNode内部通信端口      | 8020 / 9000 | 8020 / 9000 / 9820 |
| NameNode HTTP UI          | 50070       | **9870**           |
| MapReduce查看执行任务端口 | 8088        | 8088               |
| 历史服务器通信端口        | 19888       | 19888              |



## 常见错误及解决方案

如果使用root用户操作的话，需要在hadoop-env.sh文件下加入以下配置

```sh
在hadoop-env.sh文件下添加一下信息
export HDFS_NAMENODE_USER="root"
export HDFS_DATANODE_USER="root"
export HDFS_SECONDARYNAMENODE_USER="root"
export YARN_RESOURCEMANAGER_USER="root"
export YARN_NODEMANAGER_USER="root"
```

使用root操作，需要再core-site.xml文件，修改以下配置

```xml
<!-- Web UI访问HDFS的用户名-->
<!-- 配置HDFS登录使用的静态用户为root -->
<property>
	<name>hadoop.http.staticuser.user</name>
	<value>root</value>
</property>
```



**1）防火墙没关闭、或者没有启动YARN**

```shell
INFO client.RMProxy: Connecting to ResourceManager at kk02/192.168.188.129:8032
```

解决：

​	在/etc/hosts文件中添加192.168.188.129 kk02

**2）主机名称配置错误**

解决：

​	更改主机名，主机名称不要起hadoop  hadoop000等特殊名称

3）IP地址配置错误

4）ssh没有配置好

5）root用户和nhk两个用户启动集群不统一

6）配置文件修改不细心

**7）不识别主机名称**

```java
java.net.UnknownHostException: kk01: kk01
        at java.net.InetAddress.getLocalHost(InetAddress.java:1475)
        at org.apache.hadoop.mapreduce.JobSubmitter.submitJobInternal(JobSubmitter.java:146)
        at org.apache.hadoop.mapreduce.Job$10.run(Job.java:1290)
        at org.apache.hadoop.mapreduce.Job$10.run(Job.java:1287)
        at java.security.AccessController.doPrivileged(Native Method)
at javax.security.auth.Subject.doAs(Subject.java:415)
```

**8）DataNode和NameNode进程同时只能工作一个**

原因：

​	NameNode在format初始化后生成clusterId（集群ID）

​	DataNode在启动后也会生成和NameNode一样的clusterId（集群ID）

​	再次格式化NameNode，生成新的clusterId（集群ID），与未删除的DataNode的ClusterId不一致

解决：

​	在格式化之前，先删除DataNode里面的信息（默认在/tmp目录，如果配置了该目录，那就去配置的目录下删除数据）

**9）jps发现进程已经没有，但是重新启动集群，提示进程已经开启。**

原因是在Linux的根目录下/tmp目录中存在启动的进程临时文件，将集群相关进程删除掉，再重新启动集群。

**10）jps不生效**

原因：全局变量hadoop java没有生效。

解决：

​	需要source /etc/profile文件。

**11）8088端口连接不上**

[nhk@kk01 ~]$ cat /etc/hosts

解决：

​	注释掉如下代码

```shell
#127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
#::1         hadoop102
```

## Hadoop集群总结

-   ​	format操作只在hadoop集群初次启动时执行一次

-   ​	format多次会造成我们数据的丢失，还可能会造成Hadoop集群主从角色之间相互不识别（解决方法：将所以节点的hadoop.tmp.dir目录删除，删除所有机器的data和logs目录删除，后重新格式化）

## Hadoop集群启动关闭

## **每台机器手动逐个开启/关闭进程**

优点：利于精准的控制每一个进程的开启和关闭

HDFS集群

```shell
hdfs --daemon start namenode|datanode|secondarynamenode

hdfs --daemon stop namenode|datanode|secondarynamenode
```

YARN集群

```shell
yarn --daemon start resourcemanager|nodemanager

yarn --daemon stop resourcemanager|nodemanager
```

## **shell脚本一键启停**

使用Hadoop自带的shell脚本一键启动

前提：配置好机器之间的ssh免密登录和workers文件

HDFS集群

```shell
start-dfs.sh
stop-dfs.sh
```

YARN集群

```
start-yarn.sh
stop-yarn.sh
```

Hadoop集群

```
start-all.sh
stop-all.sh
```



**Hadoop集群启动日志**

启动完成后，可以使用jps命令查看进程是否启动

若发现某些进程无法正常启动或者是启动后又闪退，可以查看logs目录下的日志文件(.log)查看

hadoop启动日志：日志路径：在Hadoop安装目录下的logs目录下

