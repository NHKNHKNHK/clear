# HDFS动态节点管理

## 动态扩容、节点上线

- 节点上线：已有HDFS集群容量已不能满足存储数据的需求，需要在原有的集群基础上**动态添加新的DataNode节点**
- 动态扩容、节点服役

**1）新机器基础环境准备**

主机名、规划静态IP

Hosts映射

防火墙、时间同步

jdk

ssh免密

```shell
# 进入/etc/hostname文件设置主机名
vim /etc/hostname

# 进入/etc/sysconfig/network-scripts/ifcfg-ens32文件设置静态IP
vim /etc/sysconfig/network-scripts/ifcfg-ens32
# 重启网卡
systemctl restart network.service

# 将新主机加入/etc/hosts文件
vim /etc/hosts

# 时间同步
yum -y install ntpdate  #(如果没有就安装)
ntpdate ntp4.aliyun.com

# 关闭防火墙
# 查看防火墙状态
firewall-cmd --state
systemctl stop firewalld.service # 关闭当前防火墙
systemctl disable firewalld.service  # 关闭防火墙开机自启动

# ssh免密
# 将主节点的密码复制到新节点
ssh-copy-id 新节点主机名
```

**2）Hadoop配置**

修改NameNode节点workers文件，增加新节点主机名，便于shell脚本一键启停

从namenode节点复制Hadoop安装包至新节点，（不包括Hadoop.tmp.dir指定的数据目录）

新节点上配置Hadoop的环境变量

**3）手动启动DataNode进程**

```shell
hdfs --daemon start datanode
```

4）web页面查看新节点使用情况（可选）

**5）DataNode负载均衡服务**

新加入的节点，没有数据块的存储，使得集群整体来看负载不均衡。因此最后还需要对hdfs负载设置均衡。首先设置数据传输带宽。

```shell
hdfs dfsadmin -setBalancerBandwidth 104857600
```

然后启动Balancer，等待集群自均衡完成即可。

```shell
hdfs balancer -threshold 5  
```

## 动态缩容、节点下线

- 节点下线：服务器需要进行退役跟换，需要在当下的进群中停止某些机器上的DateNode的服务
- 动态缩容、节点退役

**1）添加退役节点**

在NameNode机器的hdfs-site.xml配置文件中需要提前配置**dfs.hosts.exclude**属性，该属性指向的文件就是所谓的黑名单列表，会被namenode排除在集群之外。如果文件内容为空，则意味着不禁止任何机器。

提前配置好的目的是让NameNode启动的时候就能加载到该属性，**默认不指定任何机器**。否则就需要重启NameNode才能加载，因此这样的操作我们称之为具有**前瞻性的操作**。

```xml
<property>  
	<name>dfs.hosts.exclude</name>
	<value>/opt/software/hadoop-3.2.2/etc/hadoop/excludes</value>
</property>

```

编辑dfs.hosts.exclude属性指向excludes文件，添加需要退役的主机名称。

```shell
vim /opt/software/hadoop-3.2.2/etc/hadoop/excludes
# 假设我们需要退役的DataNode节点所在的主机名为kk04

# 那么就在excludes下添加如下内容
kk04
```

注意：

​	**如果副本数是3，服役的节点<=3，是不能退役成功的，需要修改副本数以后才能退役**

**2）刷新集群**

在NameNode所在的机器刷新节点

```shell
hdfs dfsadmin -refreshNodes
```

等待退役节点状态为decommissioned（所有块已经复制完成）

**3）手动关闭DataNode进程**

```shell
hdfs --daemon stop datanode
```

4）DataNode负载均衡服务

如果需要可以对已有的HDFS集群进行负载均衡服务。

```shell
hdfs balancer -threshold 5 
```

## 黑白名单

### **黑名单**

黑名单是指禁止哪些机器加入到当前的HDFS集群中，是一种**禁入机制**

黑名单由dfs.hosts.exclude参数指定，该参数位于hdfs-site.xml。默认为空

dfs.hosts.exclude指向文件，该文件包含不允许连接到NameNode的主机列表。必须指定文件的完整路径名。如果该值为空，则不禁止任何主机加入

```xml
<property>  
	<name>dfs.hosts.exclude</name>
	<value>/opt/software/hadoop-3.2.2/etc/hadoop/excludes</value>
</property>
```

### **白名单**

白名单指的是允许哪些机器加入到当前的HDFS集群中，是一种**准入机制**

白名单由dfs.hosts参数指定，该参数位于hdfs-site.xml。默认值为空

dfs.hosts指向文件，该文件包含允许连接到NameNode的主机列表。必须指定文件的完整路径名。如果该值为空，则允许所有主机准入

