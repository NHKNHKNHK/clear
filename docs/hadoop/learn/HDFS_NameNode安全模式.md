# HDFS NameNode安全模式

- hdoop中的**安全模式safe mode**是NameNode的维护状态，在此**状态下NameNode不允许对文件系统进行任何更改，可以接受读数据的请求**。
- 在NameNode启动过程中，首先会从fsimage和edits日志文件加载系统状态。然后，等待DataNode汇报可用的block信息。在此期间，NameNode保持在安全模式。随着DataNode的block汇报持续进行，当整个系统达到安全标准时，HDFS自动离开安全模式。在NameNode Web主页上会显示安全模式是打开还是关闭。
- 如果HDFS处于安全模式，不允许HDFS客户端进行任何修改文件的操作，包括上传文件，删除文件，重命名，创建文件夹，修改副本数等操作。

## 安全模式自动进入离开

### **自动进入时间**

HDFS集群启动时，当**NameNode启动成功之后**，此时集群**自动进入安全模式**。

换句话说，就是我们的HDFS集群启动后不能立即操作，因为它还处于安全模式中

### **自动离开条件**

（hdfs-site.xml 、hdfs-default.xml）

```shell
dfs.replication  # hdfs block的副本数据，默认为3
dfs.replication.max  # 最大块副本数，默认512
dfs.namenode.replication.min  # 最小块副本数，默认1
dfs.namenode.safemode.threshold-pct  # 已汇报可用数据块数量占整体块数量的百分比阈值。默认值0.999f
						  			 # 小于或等于0，则表示退出安全模式之前，不要等待特定百分比的块
						  			 # 大于1的值将使安全模式永久生效
dfs.namenode.safemode.min.datanodes  # 指在退出安全模式之前必须存活的DataNode数量，默认为0
dfs.namenode.safemode.extension      # 达到阈值条件后持续扩展的时间。倒计时结束如果依然满足阈值条件
									 # 自动离开安全模式。默认30000毫秒
```

## 安全模式手动进入离开

### **手动获取安全模式状态信息**

```shell
hdfs dfsadmin -safemode get
```

演示

```shell
[root@kk01 ~]# hdfs dfsadmin -safemode get
Safe mode is OFF
```

### **手动进入命令**

手动进入安全模式对于**集群维护或者升级**的时候非常有用，因为这个时候HDFS上的数据是只读的。

```shell
hdfs dfsadmin -safemode enter
```

### **手动离开命令**

```shell
hdfs dfsadmin -safemode leave
```

演示

```shell
[root@kk01 ~]# hdfs dfsadmin -safemode get  # 查询安全模式状态信息
Safe mode is OFF
[root@kk01 ~]# hdfs dfsadmin -safemode enter  # 手动开启安全模式
Safe mode is ON
[root@kk01 ~]# hadoop fs -mkdir /test    # 开启安全模式后，创建目录，发现失败了
mkdir: Cannot create directory /test. Name node is in safe mode.
[root@kk01 ~]# hdfs dfsadmin -safemode leave  # 手动关闭安全模式
Safe mode is OFF
[root@kk01 ~]# hadoop fs -mkdir /test  # 此时目录创建成功
```

**注意：**

​web 页面上显示如下信息，大意为 安全模式开启。它是手动开启的，需要使用 hdfs dfsadmin -safemode leave命令手动关闭

Safe mode is ON. It was turned on manually. Use "hdfs dfsadmin -safemode leave" to turn safe mode off.
