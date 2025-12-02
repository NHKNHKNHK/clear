# MongoDB集群和安全

## 1 副本集-Replica Sets

**1.1** **简介**

MongoDB中的副本集（Replica Set）是一组维护相同数据集的mongod服务。 **副本集可提供冗余和高可用性**，是所有生产部署的基础。 

也可以说，副本集类似于有==自动故障恢复==功能的主从集群。通俗的讲就是用多台机器进行同一数据的异步同步，从而使多台机器拥有同一数据的多个副本，并且当主库当掉时在不需要用户干预的情况下自动切换其他备份服务器做主库。而且还可以利用副本服务器做只读服务器，实现读写分离，提高负载。 

（1）冗余和数据可用性 

复制提供冗余并提高数据可用性。 通过在不同数据库服务器上提供多个数据副本，复制可提供一定级别的容错功能，以防止丢失单个数据库服务器。 

在某些情况下，复制可以提供增加的读取性能，因为客户端可以将读取操作发送到不同的服务上， 在不同数据中心维护数据副本可以增加分布式应用程序的数据位置和可用性。 您还可以为专用目的维护其他副本，例如灾难恢复，报告或备份。 

（2）MongoDB中的复制 

副本集是一组维护相同数据集的mongod实例。 副本集包含多个数据承载节点和可选的一个仲裁节点。在承载数据的节点中，一个且仅一个成员被视为主节点，而其他节点被视为次要（从）节点。 

主节点接收所有写操作。 副本集只能有一个主要能够确认具有{w：“most”}写入关注的写入; 虽然在某些情况下，另一个mongod实例可能暂时认为自己也是主要的。主要记录其操作日志中的数据集的所有更改，即oplog。

辅助(副本)节点复制主节点的oplog并将操作应用于其数据集，以使辅助节点的数据集反映主节点的数据集。 如果主要人员不在，则符合条件的中学将举行选举以选出新的主要人员

（3）主从复制和副本集区别 

主从集群和副本集最大的区别就是**副本集没有固定的“主节点”**；整个集群会选出一个**“主节点”，当其挂掉后**，**又在剩下的从节点中选中其他节点为“主节点”**，副本集总有一个活跃点(主、primary)和一个或多个备份节点(从、secondary)。	

## 2 **副本集的三个角色** 

副本集有两种类型三种角色 

两种类型： 

-   主节点（Primary）类型：数据操作的主要连接点，可读写。 
-   次要（辅助、从）节点（Secondaries）类型：数据冗余备份节点，可以读或选举。 

三种角色： 

-   主要成员（Primary）：主要接收所有写操作。就是主节点。 
-   副本成员（Replicate）：从主节点通过复制操作以维护相同的数据集，即备份数据，**不可写操作**，但可以读操作（但需要配置）。是默认的一种从节点类型
-   仲裁者（Arbiter）：不保留任何数据的副本，只具有投票选举作用。当然也可以将仲裁服务器维护为副本集的一部分，即**副本成员同时也可以是仲裁者。也是一种从节点类型**。

关于仲裁者的额外说明： 

-   您可以将额外的mongod实例添加到副本集作为仲裁者。 仲裁者不维护数据集。 仲裁者的目的是通过响应其他副本集成员的心跳和选举请求来维护副本集中的仲裁。 因为它们不存储数据集，所以仲裁器可以是提供副本集仲裁功能的好方法，其资源成本比具有数据集的全功能副本集成员更便宜。 
-   如果您的副本集具有偶数个成员，请添加仲裁者以获得主要选举中的“大多数”投票。 仲裁者不需要专用硬件。 
-   仲裁者将永远是仲裁者，而主要人员可能会退出并成为次要人员，而次要人员可能成为选举期间的主要人员。 
-   如果你的副本+主节点的个数是偶数，建议加一个仲裁者，形成奇数，容易满足大多数的投票。 
-   如果你的副本+主节点的个数是奇数，可以不加仲裁者

## **3 副本集的创建**

### 1）副本集架构目标 

一主一副本一仲裁

| 主要成员（Primary）           | 副本成员（Secondaries）       | 仲裁（Arbiter）               |
| ----------------------------- | ----------------------------- | ----------------------------- |
| （kk01）192.168.188.128:27017 | （kk02）192.168.188.129:27017 | （kk03）192.168.188.130:27017 |

### 2）上传压缩包到kk01

mongo下载链接：https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel70-5.0.7.tgz

```shell
[nhk@kk01 software]$ ll | grep mongodb
lrwxrwxrwx.  1 nhk nhk        34 Sep 12 23:21 mongodb -> mongodb-linux-x86_64-rhel70-5.0.21
drwxrwxr-x.  4 nhk nhk       114 Sep 12 23:24 mongodb-linux-x86_64-rhel70-5.0.21 # 前面部署的mongodb单机版
-rw-rw-r--.  1 nhk nhk  87614958 Sep 12 23:18 mongodb-linux-x86_64-rhel70-5.0.21.tgz
-rw-r--r--.  1 nhk nhk  86216696 Sep 13 21:22 mongodb-linux-x86_64-rhel70-5.0.7.tgz
```

### 3）解压压缩包并创建软链接

```shell
[nhk@kk01 software]$ tar -zxvf mongodb-linux-x86_64-rhel70-5.0.7.tgz -C /opt/software/

# 取消链接到mongodb单机版的链接
[nhk@kk01 software]$ unlink mongodb

[nhk@kk01 software]$ ln -s mongodb-linux-x86_64-rhel70-5.0.7 mongodb
```

### 4）将解压后的mongo同步至kk02、kk03，方便后续

```shell
[nhk@kk01 software]$ scp -r /opt/software/mongodb-linux-x86_64-rhel70-5.0.7 kk02:/opt/software/

[nhk@kk01 software]$ scp -r /opt/software/mongodb-linux-x86_64-rhel70-5.0.7 kk03:/opt/software/
```

### 5）创建主节点（kk01）

建立存放数据和日志的目录：

```shell
#主节点
[nhk@kk01 software]$ mkdir -p /opt/software/mongodb/replica_sets/log \ &
[1] 2742
[nhk@kk01 software]$ mkdir -p /opt/software/mongodb/replica_sets/data/db
[1]+  Done                    mkdir -p /opt/software/mongodb/replica_sets/log \ 
```

新建或修改配置文件：

```shell
[nhk@kk01 software]$ vim /opt/software/mongodb/replica_sets/mongod.conf
```

参考如下：

```shell
systemLog:
  #MongoDB发送所有日志输出的目标指定为文件
  destination: file
  #mongod或mongos应向其发送所有诊断日志记录信息的日志文件的路径
  path: "/opt/software/mongodb/replica_sets/log/mongod.log"
  #当mongos或mongod实例重新启动时，mongos或mongod会将新条目附加到现有日志文件的末尾。
  logAppend: true
storage:
#mongod实例存储其数据的目录。storage.dbPath设置仅适用于mongod。
  dbPath: "/opt/software/mongodb/replica_sets/data/db"
  journal:
    #启用或禁用持久性日志以确保数据文件保持有效和可恢复。
    enabled: true
processManagement:
  #启用在后台运行mongos或mongod进程的守护进程模式。
  fork: true
  #指定用于保存mongos或mongod进程的进程ID的文件位置，其中mongos或mongod将写入其PID
  pidFilePath: "/opt/software/mongodb/replica_sets/log/mongod.pid"
net:
  #服务实例绑定所有IP，有副作用，副本集初始化的时候，节点名字会自动设置为本地域名，而不是ip
  #bindIpAll: true
  #服务实例绑定的IP
  bindIp: localhost,192.168.188.128
  #bindIp
  #绑定的端口
  port: 27017
replication:
  #副本集的名称
  replSetName: myrs
```

启动节点服务：

```shell
[nhk@kk01 software]$ /opt/software/mongodb/bin/mongod -f /opt/software/mongodb/replica_sets/mongod.conf 
about to fork child process, waiting until server is ready for connections.
forked process: 2957
child process started successfully, parent exiting
```

### 6）创建副本节点（kk02）

创建软链接：

```shell
[nhk@kk02 software]$ ln -s mongodb-linux-x86_64-rhel70-5.0.7 mongodb

[nhk@kk02 software]$ ll | grep mongodb
lrwxrwxrwx.  1 nhk nhk  33 Sep 13 22:31 mongodb -> mongodb-linux-x86_64-rhel70-5.0.7
drwxrwxr-x.  4 nhk nhk 120 Sep 13 22:25 mongodb-linux-x86_64-rhel70-5.0.7
```

建立存放数据和日志的目录：

```shell
[nhk@kk02 software]$ mkdir -p /opt/software/mongodb/replica_sets/log \ &
[1] 3142
[nhk@kk02 software]$ mkdir -p /opt/software/mongodb/replica_sets/data/db
[1]+  Done                    mkdir -p /opt/software/mongodb/replica_sets/log \ 
```

新建或修改配置文件：

```shell
[nhk@kk02 software]$ vim /opt/software/mongodb/replica_sets/mongod.conf
```

参考如下：

```shell
systemLog:
  #MongoDB发送所有日志输出的目标指定为文件
  destination: file
  #mongod或mongos应向其发送所有诊断日志记录信息的日志文件的路径
  path: "/opt/software/mongodb/replica_sets/log/mongod.log"
  #当mongos或mongod实例重新启动时，mongos或mongod会将新条目附加到现有日志文件的末尾。
  logAppend: true
storage:
#mongod实例存储其数据的目录。storage.dbPath设置仅适用于mongod。
  dbPath: "/opt/software/mongodb/replica_sets/data/db"
  journal:
    #启用或禁用持久性日志以确保数据文件保持有效和可恢复。
    enabled: true
processManagement:
  #启用在后台运行mongos或mongod进程的守护进程模式。
  fork: true
  #指定用于保存mongos或mongod进程的进程ID的文件位置，其中mongos或mongod将写入其PID
  pidFilePath: "/opt/software/mongodb/replica_sets/log/mongod.pid"
net:
  #服务实例绑定所有IP，有副作用，副本集初始化的时候，节点名字会自动设置为本地域名，而不是ip
  #bindIpAll: true
  #服务实例绑定的IP
  bindIp: localhost,192.168.188.129
  #bindIp
  #绑定的端口
  port: 27017
replication:
  #副本集的名称
  replSetName: myrs
```

启动节点服务：

```shell
[nhk@kk02 software]$ /opt/software/mongodb/bin/mongod -f /opt/software/mongodb/replica_sets/mongod.conf 
about to fork child process, waiting until server is ready for connections.
forked process: 3156
child process started successfully, parent exiting
```

### 7）创建仲裁节点（kk03）

创建软链接：

```shell
[nhk@kk03 software]$ ln -s mongodb-linux-x86_64-rhel70-5.0.7 mongodb
[nhk@kk03 software]$ ll | grep mongo
lrwxrwxrwx.  1 nhk nhk  33 Sep 13 22:52 mongodb -> mongodb-linux-x86_64-rhel70-5.0.7
drwxrwxr-x.  3 nhk nhk 100 Sep 13 22:52 mongodb-linux-x86_64-rhel70-5.0.7
```

建立存放数据和日志的目录：

```shell
[nhk@kk03 software]$ mkdir -p /opt/software/mongodb/replica_sets/log \ &
[1] 3087
[nhk@kk03 software]$ mkdir -p /opt/software/mongodb/replica_sets/data/db
[1]+  Done                    mkdir -p /opt/software/mongodb/replica_sets/log \ 
```

新建或修改配置文件：

```shell
[nhk@kk03 software]$ vim /opt/software/mongodb/replica_sets/mongod.conf
```

参考如下：

```shell
systemLog:
  #MongoDB发送所有日志输出的目标指定为文件
  destination: file
  #mongod或mongos应向其发送所有诊断日志记录信息的日志文件的路径
  path: "/opt/software/mongodb/replica_sets/log/mongod.log"
  #当mongos或mongod实例重新启动时，mongos或mongod会将新条目附加到现有日志文件的末尾。
  logAppend: true
storage:
#mongod实例存储其数据的目录。storage.dbPath设置仅适用于mongod。
  dbPath: "/opt/software/mongodb/replica_sets/data/db"
  journal:
    #启用或禁用持久性日志以确保数据文件保持有效和可恢复。
    enabled: true
processManagement:
  #启用在后台运行mongos或mongod进程的守护进程模式。
  fork: true
  #指定用于保存mongos或mongod进程的进程ID的文件位置，其中mongos或mongod将写入其PID
  pidFilePath: "/opt/software/mongodb/replica_sets/log/mongod.pid"
net:
  #服务实例绑定所有IP，有副作用，副本集初始化的时候，节点名字会自动设置为本地域名，而不是ip
  #bindIpAll: true
  #服务实例绑定的IP
  bindIp: localhost,192.168.188.130
  #bindIp
  #绑定的端口
  port: 27017
replication:
  #副本集的名称
  replSetName: myrs
```

启动节点服务：

```shell
[nhk@kk03 software]$ /opt/software/mongodb/bin/mongod -f /opt/software/mongodb/replica_sets/mongod.conf 
about to fork child process, waiting until server is ready for connections.
forked process: 3100
child process started successfully, parent exiting
```

## 4 初始化副本集

### 8）初始主节点

使用客户端命令连接任意一个节点，但这里尽量要连接主节点(kk01)：

```shell
[nhk@kk01 software]$ /opt/software/mongodb/bin/mongo --host=192.168.188.128 --port=27017
MongoDB shell version v5.0.7
connecting to: mongodb://192.168.188.128:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("b0c3bdbc-bded-4752-9261-8555032eb238") }
MongoDB server version: 5.0.7
================
...

> 
```

结果，连接上之后，很多命令无法使用，，比如 show dbs 等，必须初始化副本集才行

**初始化说明：**

基本语法

```shell
rs.initiate(configuration)
```

选项：

| **Parameter** | **Type** | **Description**                                              |
| ------------- | -------- | ------------------------------------------------------------ |
| configuration | document | Optional. A document that specifies configuration for the new replica set. If a configuration is not specified, |

```shell
# 使用默认的配置来初始化副本集
> rs.initiate()
{
	"info2" : "no configuration specified. Using a default configuration for the set",
	"me" : "192.168.188.128:27017",
	"ok" : 1
}
myrs:SECONDARY> 
myrs:PRIMARY> 

```

说明：

​	1）“ok”的值为1，说明创建成功。 

​	2）命令行提示符发生变化，变成了一个从节点角色，此时默认不能读写。稍等片刻，回车，变成主节点。 

### **9）查看副本集的配置内容**

说明： 

​	返回包含当前副本集配置的文档

基本语法：

```shell
rs.conf(configuration)
```

说明：

​	rs.config() 是该方法的别名。 

​	configuration：可选，如果没有配置，则使用默认主节点配置。 

在kk01节点上执行副本集中当前节点的默认节点配置

```shell
myrs:PRIMARY> rs.conf()
{
	"_id" : "myrs",
	"version" : 1,
	"term" : 1,
	"members" : [
		{
			"_id" : 0,
			"host" : "192.168.188.128:27017",
			"arbiterOnly" : false,
			"buildIndexes" : true,
			"hidden" : false,
			"priority" : 1,
			"tags" : {
				
			},
			"secondaryDelaySecs" : NumberLong(0),
			"votes" : 1
		}
	],
	"protocolVersion" : NumberLong(1),
	"writeConcernMajorityJournalDefault" : true,
	"settings" : {
		"chainingAllowed" : true,
		"heartbeatIntervalMillis" : 2000,
		"heartbeatTimeoutSecs" : 10,
		"electionTimeoutMillis" : 10000,
		"catchUpTimeoutMillis" : -1,
		"catchUpTakeoverDelayMillis" : 30000,
		"getLastErrorModes" : {
			
		},
		"getLastErrorDefaults" : {
			"w" : 1,
			"wtimeout" : 0
		},
		"replicaSetId" : ObjectId("6501d61c9d2c863a2fa9a080")
	}
}
```

说明： 

​	1） "_id" : "myrs" ：副本集的配置数据存储的主键值，默认就是副本集的名字 

​	2） "members" ：副本集成员数组，此时只有一个： "host" : "192.168.188.128:27017" ，该成员不是仲裁节点： "arbiterOnly" : false ，优先级（权重值）： "priority" : 1, 

​	3） "settings" ：副本集的参数配置

提示：副本集配置的查看命令，本质是查询的是 system.replset 的表中的数据：

```shell
myrs:PRIMARY> use local
switched to db local
myrs:PRIMARY> show collections
oplog.rs
replset.election
replset.initialSyncId
replset.minvalid
replset.oplogTruncateAfterPoint
startup_log
system.replset
system.rollback.id
system.tenantMigration.oplogView
system.views
myrs:PRIMARY> db.system.replset.find()
{ "_id" : "myrs", "version" : 1, "term" : 1, "members" : [ { "_id" : 0, "host" : "192.168.188.128:27017", "arbiterOnly" : false, "buildIndexes" : true, "hidd
en" : false, "priority" : 1, "tags" : {  }, "secondaryDelaySecs" : NumberLong(0), "votes" : 1 } ], "protocolVersion" : NumberLong(1), "writeConcernMajorityJournalDefault" : true, "settings" : { "chainingAllowed" : true, "heartbeatIntervalMillis" : 2000, "heartbeatTimeoutSecs" : 10, "electionTimeoutMillis" : 10000, "catchUpTimeoutMillis" : -1, "catchUpTakeoverDelayMillis" : 30000, "getLastErrorModes" : {  }, "getLastErrorDefaults" : { "w" : 1, "wtimeout" : 0 }, "replicaSetId" : ObjectId("6501d61c9d2c863a2fa9a080") } }myrs:PRIMARY> 
```

### 10）查看副本集状态

检查副本集状态。 

说明： 

​	返回包含状态信息的文档。此输出使用从副本集的其他成员发送的心跳包中获得的数据反映副本集的当前状态。

基本语法

```shell
rs.status()
```

在kk01上查看副本集状态：

```shell
myrs:PRIMARY> rs.status()
{
	"set" : "myrs",
	"date" : ISODate("2023-09-13T15:42:06.993Z"),
	"myState" : 1,
	"term" : NumberLong(1),
	"syncSourceHost" : "",
	"syncSourceId" : -1,
	"heartbeatIntervalMillis" : NumberLong(2000),
	"majorityVoteCount" : 1,
	"writeMajorityCount" : 1,
	"votingMembersCount" : 1,
	"writableVotingMembersCount" : 1,
	"optimes" : {
		"lastCommittedOpTime" : {
			"ts" : Timestamp(1694619724, 1),
			"t" : NumberLong(1)
		},
		"lastCommittedWallTime" : ISODate("2023-09-13T15:42:04.788Z"),
		"readConcernMajorityOpTime" : {
			"ts" : Timestamp(1694619724, 1),
			"t" : NumberLong(1)
		},
		"appliedOpTime" : {
			"ts" : Timestamp(1694619724, 1),
			"t" : NumberLong(1)
		},
		"durableOpTime" : {
			"ts" : Timestamp(1694619724, 1),
			"t" : NumberLong(1)
		},
		"lastAppliedWallTime" : ISODate("2023-09-13T15:42:04.788Z"),
		"lastDurableWallTime" : ISODate("2023-09-13T15:42:04.788Z")
	},
	"lastStableRecoveryTimestamp" : Timestamp(1694619694, 1),
	"electionCandidateMetrics" : {
		"lastElectionReason" : "electionTimeout",
		"lastElectionDate" : ISODate("2023-09-13T15:32:44.633Z"),
		"electionTerm" : NumberLong(1),
		"lastCommittedOpTimeAtElection" : {
			"ts" : Timestamp(1694619164, 1),
			"t" : NumberLong(-1)
		},
		"lastSeenOpTimeAtElection" : {
			"ts" : Timestamp(1694619164, 1),
			"t" : NumberLong(-1)
		},
		"numVotesNeeded" : 1,
		"priorityAtElection" : 1,
		"electionTimeoutMillis" : NumberLong(10000),
		"newTermStartDate" : ISODate("2023-09-13T15:32:44.657Z"),
		"wMajorityWriteAvailabilityDate" : ISODate("2023-09-13T15:32:44.668Z")
	},
	"members" : [
		{
			"_id" : 0,
			"name" : "192.168.188.128:27017",
			"health" : 1,
			"state" : 1,
			"stateStr" : "PRIMARY",
			"uptime" : 4846,
			"optime" : {
				"ts" : Timestamp(1694619724, 1),
				"t" : NumberLong(1)
			},
			"optimeDate" : ISODate("2023-09-13T15:42:04Z"),
			"lastAppliedWallTime" : ISODate("2023-09-13T15:42:04.788Z"),
			"lastDurableWallTime" : ISODate("2023-09-13T15:42:04.788Z"),
			"syncSourceHost" : "",
			"syncSourceId" : -1,
			"infoMessage" : "",
			"electionTime" : Timestamp(1694619164, 2),
			"electionDate" : ISODate("2023-09-13T15:32:44Z"),
			"configVersion" : 1,
			"configTerm" : 1,
			"self" : true,
			"lastHeartbeatMessage" : ""
		}
	],
	"ok" : 1,
	"$clusterTime" : {
		"clusterTime" : Timestamp(1694619724, 1),
		"signature" : {
			"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
			"keyId" : NumberLong(0)
		}
	},
	"operationTime" : Timestamp(1694619724, 1)
}
myrs:PRIMARY> 
```

说明： 

​	1） "set" : "myrs" ：副本集的名字 

​	2） "myState" : 1：说明状态正常 

​	3） "members" ：副本集成员数组，此时只有一个： "name" : "192.168.188.128:27017" ，该成员的角色是 "stateStr" : "PRIMARY", 该节点是健康的： "health" : 1 。

### 11）添加副本从节点

在主节点添加从节点，将其他成员加入到副本集

基本语法：

```
在主节点添加从节点，将其他成员加入到副本集
```

选项

| **Parameter** | **Type**           | **Description**                                              |
| ------------- | ------------------ | ------------------------------------------------------------ |
| host          | string or document | 要添加到副本集的新成员。 指定为字符串或配置文档：1）如果是一个字符串，则需要指定新成员的主机名和可选的端口号；2）如果是一个文档，请指定在members数组中找到的副本集成员配置文档。 您必须在成员配置文档中指定主机字段。有关文档配置字段的说明，详见下方文档：“主机成员的配置文档” |
| arbiterOnly   | boolean            | 可选的。 仅在 `<host>` 值为字符串时适用。 如果为true，则添加的主机是仲裁者。 |

主机成员的配置文档：

```json
{
	_id: <int>,
	host: <string>, // required
	arbiterOnly: <boolean>,
	buildIndexes: <boolean>,
	hidden: <boolean>,
	priority: <number>,
	tags: <document>,
	slaveDelay: <int>,
	votes: <number>
}
```

**将kk02的副本节点添加到副本集中：**

```shell
myrs:PRIMARY> rs.add("192.168.188.129:27017")
{
	"ok" : 1,
	"$clusterTime" : {
		"clusterTime" : Timestamp(1694620054, 1),
		"signature" : {
			"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
			"keyId" : NumberLong(0)
		}
	},
	"operationTime" : Timestamp(1694620054, 1)
}
```

说明：

​	1） "ok" : 1 ：说明添加成功。

查看副本集状态：

```json
myrs:PRIMARY> rs.status()
{
	"set" : "myrs",
	"date" : ISODate("2023-09-13T15:48:36.188Z"),
	"myState" : 1,
	"term" : NumberLong(1),
	"syncSourceHost" : "",
	"syncSourceId" : -1,
	"heartbeatIntervalMillis" : NumberLong(2000),
	"majorityVoteCount" : 2,
	"writeMajorityCount" : 2,
	"votingMembersCount" : 2,
	"writableVotingMembersCount" : 2,
	"optimes" : {
		"lastCommittedOpTime" : {
			"ts" : Timestamp(1694620114, 1),
			"t" : NumberLong(1)
		},
		"lastCommittedWallTime" : ISODate("2023-09-13T15:48:34.891Z"),
		"readConcernMajorityOpTime" : {
			"ts" : Timestamp(1694620114, 1),
			"t" : NumberLong(1)
		},
		"appliedOpTime" : {
			"ts" : Timestamp(1694620114, 1),
			"t" : NumberLong(1)
		},
		"durableOpTime" : {
			"ts" : Timestamp(1694620114, 1),
			"t" : NumberLong(1)
		},
		"lastAppliedWallTime" : ISODate("2023-09-13T15:48:34.891Z"),
		"lastDurableWallTime" : ISODate("2023-09-13T15:48:34.891Z")
	},
	"lastStableRecoveryTimestamp" : Timestamp(1694620056, 1),
	"electionCandidateMetrics" : {
		"lastElectionReason" : "electionTimeout",
		"lastElectionDate" : ISODate("2023-09-13T15:32:44.633Z"),
		"electionTerm" : NumberLong(1),
		"lastCommittedOpTimeAtElection" : {
			"ts" : Timestamp(1694619164, 1),
			"t" : NumberLong(-1)
		},
		"lastSeenOpTimeAtElection" : {
			"ts" : Timestamp(1694619164, 1),
			"t" : NumberLong(-1)
		},
		"numVotesNeeded" : 1,
		"priorityAtElection" : 1,
		"electionTimeoutMillis" : NumberLong(10000),
		"newTermStartDate" : ISODate("2023-09-13T15:32:44.657Z"),
		"wMajorityWriteAvailabilityDate" : ISODate("2023-09-13T15:32:44.668Z")
	},
	"members" : [
		{
			"_id" : 0,
			"name" : "192.168.188.128:27017",
			"health" : 1,
			"state" : 1,
			"stateStr" : "PRIMARY",
			"uptime" : 5236,
			"optime" : {
				"ts" : Timestamp(1694620114, 1),
				"t" : NumberLong(1)
			},
			"optimeDate" : ISODate("2023-09-13T15:48:34Z"),
			"lastAppliedWallTime" : ISODate("2023-09-13T15:48:34.891Z"),
			"lastDurableWallTime" : ISODate("2023-09-13T15:48:34.891Z"),
			"syncSourceHost" : "",
			"syncSourceId" : -1,
			"infoMessage" : "",
			"electionTime" : Timestamp(1694619164, 2),
			"electionDate" : ISODate("2023-09-13T15:32:44Z"),
			"configVersion" : 3,
			"configTerm" : 1,
			"self" : true,
			"lastHeartbeatMessage" : ""
		},
		{
			"_id" : 1,
			"name" : "192.168.188.129:27017",
			"health" : 1,
			"state" : 2,
			"stateStr" : "SECONDARY",
			"uptime" : 61,
			"optime" : {
				"ts" : Timestamp(1694620104, 1),
				"t" : NumberLong(1)
			},
			"optimeDurable" : {
				"ts" : Timestamp(1694620104, 1),
				"t" : NumberLong(1)
			},
			"optimeDate" : ISODate("2023-09-13T15:48:24Z"),
			"optimeDurableDate" : ISODate("2023-09-13T15:48:24Z"),
			"lastAppliedWallTime" : ISODate("2023-09-13T15:48:34.891Z"),
			"lastDurableWallTime" : ISODate("2023-09-13T15:48:34.891Z"),
			"lastHeartbeat" : ISODate("2023-09-13T15:48:34.406Z"),
			"lastHeartbeatRecv" : ISODate("2023-09-13T15:48:34.923Z"),
			"pingMs" : NumberLong(0),
			"lastHeartbeatMessage" : "",
			"syncSourceHost" : "192.168.188.128:27017",
			"syncSourceId" : 0,
			"infoMessage" : "",
			"configVersion" : 3,
			"configTerm" : 1
		}
	],
	"ok" : 1,
	"$clusterTime" : {
		"clusterTime" : Timestamp(1694620114, 1),
		"signature" : {
			"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
			"keyId" : NumberLong(0)
		}
	},
	"operationTime" : Timestamp(1694620114, 1)
}
```

说明：

​	1） "name" : "192.168.188.129:27017" 是第二个节点的名字，其角色是 "stateStr" : "SECONDARY" 

### 12）添加仲裁从节点

添加一个仲裁节点到副本集 

基本语法： 

```shell
rs.addArb(host)
```

**将kk03的仲裁节点添加到副本集中：**

```shell
myrs:PRIMARY> rs.addArb("192.168.188.130:27017")
{
	"ok" : 1,
	"$clusterTime" : {
		"clusterTime" : Timestamp(1694651825, 1),
		"signature" : {
			"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
			"keyId" : NumberLong(0)
		}
	},
	"operationTime" : Timestamp(1694651825, 1)
}
```

说明： 

​	1） "ok" : 1 ：说明添加成功

查看副本集状态：

```shell
myrs:PRIMARY> rs.status()
{
	"set" : "myrs",
	"date" : ISODate("2023-09-14T00:39:34.228Z"),
	"myState" : 1,
	"term" : NumberLong(3),
	"syncSourceHost" : "",
	"syncSourceId" : -1,
	"heartbeatIntervalMillis" : NumberLong(2000),
	"majorityVoteCount" : 2,
	"writeMajorityCount" : 2,
	"votingMembersCount" : 3,
	"writableVotingMembersCount" : 2,
	"optimes" : {
		"lastCommittedOpTime" : {
			"ts" : Timestamp(1694651967, 1),
			"t" : NumberLong(3)
		},
		"lastCommittedWallTime" : ISODate("2023-09-14T00:39:27.235Z"),
		"readConcernMajorityOpTime" : {
			"ts" : Timestamp(1694651967, 1),
			"t" : NumberLong(3)
		},
		"appliedOpTime" : {
			"ts" : Timestamp(1694651967, 1),
			"t" : NumberLong(3)
		},
		"durableOpTime" : {
			"ts" : Timestamp(1694651967, 1),
			"t" : NumberLong(3)
		},
		"lastAppliedWallTime" : ISODate("2023-09-14T00:39:27.235Z"),
		"lastDurableWallTime" : ISODate("2023-09-14T00:39:27.235Z")
	},
	"lastStableRecoveryTimestamp" : Timestamp(1694651931, 2),
	"electionCandidateMetrics" : {
		"lastElectionReason" : "electionTimeout",
		"lastElectionDate" : ISODate("2023-09-14T00:29:07.049Z"),
		"electionTerm" : NumberLong(3),
		"lastCommittedOpTimeAtElection" : {
			"ts" : Timestamp(0, 0),
			"t" : NumberLong(-1)
		},
		"lastSeenOpTimeAtElection" : {
			"ts" : Timestamp(1694620575, 1),
			"t" : NumberLong(1)
		},
		"numVotesNeeded" : 2,
		"priorityAtElection" : 1,
		"electionTimeoutMillis" : NumberLong(10000),
		"numCatchUpOps" : NumberLong(0),
		"newTermStartDate" : ISODate("2023-09-14T00:29:07.057Z"),
		"wMajorityWriteAvailabilityDate" : ISODate("2023-09-14T00:29:07.942Z")
	},
	"members" : [
		{
			"_id" : 0,
			"name" : "192.168.188.128:27017",
			"health" : 1,
			"state" : 1,
			"stateStr" : "PRIMARY",
			"uptime" : 645,
			"optime" : {
				"ts" : Timestamp(1694651967, 1),
				"t" : NumberLong(3)
			},
			"optimeDate" : ISODate("2023-09-14T00:39:27Z"),
			"lastAppliedWallTime" : ISODate("2023-09-14T00:39:27.235Z"),
			"lastDurableWallTime" : ISODate("2023-09-14T00:39:27.235Z"),
			"syncSourceHost" : "",
			"syncSourceId" : -1,
			"infoMessage" : "",
			"electionTime" : Timestamp(1694651347, 1),
			"electionDate" : ISODate("2023-09-14T00:29:07Z"),
			"configVersion" : 4,
			"configTerm" : 3,
			"self" : true,
			"lastHeartbeatMessage" : ""
		},
		{
			"_id" : 1,
			"name" : "192.168.188.129:27017",
			"health" : 1,
			"state" : 2,
			"stateStr" : "SECONDARY",
			"uptime" : 638,
			"optime" : {
				"ts" : Timestamp(1694651967, 1),
				"t" : NumberLong(3)
			},
			"optimeDurable" : {
				"ts" : Timestamp(1694651967, 1),
				"t" : NumberLong(3)
			},
			"optimeDate" : ISODate("2023-09-14T00:39:27Z"),
			"optimeDurableDate" : ISODate("2023-09-14T00:39:27Z"),
			"lastAppliedWallTime" : ISODate("2023-09-14T00:39:27.235Z"),
			"lastDurableWallTime" : ISODate("2023-09-14T00:39:27.235Z"),
			"lastHeartbeat" : ISODate("2023-09-14T00:39:32.229Z"),
			"lastHeartbeatRecv" : ISODate("2023-09-14T00:39:32.224Z"),
			"pingMs" : NumberLong(0),
			"lastHeartbeatMessage" : "",
			"syncSourceHost" : "192.168.188.128:27017",
			"syncSourceId" : 0,
			"infoMessage" : "",
			"configVersion" : 4,
			"configTerm" : 3
		},
		{
			"_id" : 2,
			"name" : "192.168.188.130:27017",
			"health" : 1,
			"state" : 7,
			"stateStr" : "ARBITER",
			"uptime" : 148,
			"lastHeartbeat" : ISODate("2023-09-14T00:39:34.196Z"),
			"lastHeartbeatRecv" : ISODate("2023-09-14T00:39:34.226Z"),
			"pingMs" : NumberLong(0),
			"lastHeartbeatMessage" : "",
			"syncSourceHost" : "",
			"syncSourceId" : -1,
			"infoMessage" : "",
			"configVersion" : 4,
			"configTerm" : 3
		}
	],
	"ok" : 1,
	"$clusterTime" : {
		"clusterTime" : Timestamp(1694651967, 1),
		"signature" : {
			"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
			"keyId" : NumberLong(0)
		}
	},
	"operationTime" : Timestamp(1694651967, 1)
}
```

说明： 

​	1） "name" : "180.76.159.126:27019" 是第二个节点的名字，其角色是 "stateStr" : "ARBITER" 

​	2）如果添加仲裁点执行  rs.addArb("192.168.188.130:27017") 后无反应，则退出客户端输入db.adminCommand({"setDefaultRWConcern" : 1,"defaultWriteConcern" : {"w" : 2}}) 后重试即可 

## **5 副本集的数据读写操作**

目标：测试三个不同角色的节点的数据读写情况

登录主节点kk01，写入和读取数据：

```shell
[nhk@kk01 ~]$ /opt/software/mongodb/bin/mongo --host 192.168.188.128 --port 27017

myrs:PRIMARY> use articledb		# 切换数据库
switched to db articledb
myrs:PRIMARY> db		# 查看当前数据库
articledb
myrs:PRIMARY> db.comment.insert({"articleid":"100000","content":"今天天气真好，阳光明媚","userid":"1001","nickname":"Rose","createdatetime":new Date()}) 
WriteResult({ "nInserted" : 1 })
myrs:PRIMARY> db.comment.find()	
{ "_id" : ObjectId("65025799bdfa1624571c7313"), "articleid" : "100000", "content" : "今天天气真好，阳光明媚", "userid" : "1001", "nickname" : "Rose", "create
datetime" : ISODate("2023-09-14T00:45:13.158Z") }myrs:PRIMARY> 
```

登录从节点kk02

```shell
[nhk@kk02 ~]$ /opt/software/mongodb/bin/mongo --host 192.168.188.128 --port 27017

myrs:PRIMARY> show dbs
admin      0.000GB
articledb  0.000GB
config     0.000GB
local      0.000GB
```

说明：

​	如果发现，不能读取集合的数据。当前从节点只是一个备份，不是奴隶节点，无法读取数据，写当然更不行。 

​	因为默认情况下，从节点是没有读写权限的，可以增加读的权限，但需要进行设置

**设置读操作权限：** 

说明： 

​	设置为奴隶节点，允许在从成员上运行读的操作 

基本语法：

```shell
rs.slaveOk()
#或
rs.slaveOk(true)

#提示：
	该命令是 db.getMongo().setSlaveOk() 的简化命令
```

在kk02上设置作为奴隶节点权限，具备读权限：

```shell
myrs:PRIMARY> rs.slaveOk()
```

此时，在执行查询命令，运行成功！ 

但仍然不允许插入

```shell
myrs:PRIMARY> show dbs
admin      0.000GB
articledb  0.000GB
config     0.000GB
local      0.000GB
myrs:PRIMARY>  use articledb
switched to db articledb
myrs:PRIMARY> show collections
comment
myrs:PRIMARY> db.comment.find()
{ "_id" : ObjectId("65025799bdfa1624571c7313"), "articleid" : "100000", "content" : "今天天气真好，阳光明媚", "userid" : "1001", "nickname" : "Rose", "create
datetime" : ISODate("2023-09-14T00:45:13.158Z") }myrs:PRIMARY> 
```

现在可实现了读写分离，让主插入数据，让从来读取数据。 

如果要取消作为奴隶节点的读权限：

```shell
myrs:PRIMARY> rs.slaveOk(false)

myrs:PRIMARY> db.comment.find()
{ "_id" : ObjectId("65025799bdfa1624571c7313"), "articleid" : "100000", "content" : "今天天气真好，阳光明媚", "userid" : "1001", "nickname" : "Rose", "create
datetime" : ISODate("2023-09-14T00:45:13.158Z") }
```

仲裁者节点，不存放任何业务数据的，可以登录查看

```shell
[nhk@kk03 ~]$ /opt/software/mongodb/bin/mongo --host 192.168.188.130 --port 27017

```

发现，只存放副本集配置等数据



##  **6 主节点的选举原则**

MongoDB在副本集中，会自动进行主节点的选举，主节点选举的触发条件： 

-   1） 主节点故障 
-   2） 主节点网络不可达（默认心跳信息为10秒） 
-   3） 人工干预（rs.stepDown(600)） 

一旦触发选举，就要根据一定规则来选主节点

选举规则是根据票数来决定谁获胜： 

-   票数最高，且获得了“大多数”成员的投票支持的节点获胜。 
    -   “大多数”的定义为：假设复制集内投票成员数量为N，则大多数为 N/2 + 1。例如：3个投票成员，则大多数的值是2。当复制集内存活成员数量不足大多数时，整个复制集将无法选举出Primary，复制集将无法提供写服务，处于只读状态。 
-   若票数相同，且都获得了“大多数”成员的投票支持的，数据新的节点获胜。 
    -   数据的新旧是通过操作日志oplog来对比的。 

在获得票数的时候，优先级（priority）参数影响重大。 

可以通过设置优先级（priority）来设置额外票数。优先级即权重，取值为0-1000，相当于可额外增加 0-1000的票数，优先级的值越大，就越可能获得多数成员的投票（votes）数。指定较高的值可使成员 

更有资格成为主要成员，更低的值可使成员更不符合条件。 

默认情况下，优先级的值是1 

```shell
myrs:PRIMARY> rs.conf()
{
	"_id" : "myrs",
	"version" : 4,
	"term" : 3,
	"members" : [
		{
			"_id" : 0,
			"host" : "192.168.188.128:27017",
			"arbiterOnly" : false,
			"buildIndexes" : true,
			"hidden" : false,
			"priority" : 1,
			"tags" : {
				
			},
			"secondaryDelaySecs" : NumberLong(0),
			"votes" : 1
		},
		{
			"_id" : 1,
			"host" : "192.168.188.129:27017",
			"arbiterOnly" : false,
			"buildIndexes" : true,
			"hidden" : false,
			"priority" : 1,
			"tags" : {
				
			},
			"secondaryDelaySecs" : NumberLong(0),
			"votes" : 1
		},
		{
			"_id" : 2,
			"host" : "192.168.188.130:27017",
			"arbiterOnly" : true,
			"buildIndexes" : true,
			"hidden" : false,
			"priority" : 0,
			"tags" : {
				
			},
			"secondaryDelaySecs" : NumberLong(0),
			"votes" : 1
		}
	],
	"protocolVersion" : NumberLong(1),
	"writeConcernMajorityJournalDefault" : true,
	"settings" : {
		"chainingAllowed" : true,
		"heartbeatIntervalMillis" : 2000,
		"heartbeatTimeoutSecs" : 10,
		"electionTimeoutMillis" : 10000,
		"catchUpTimeoutMillis" : -1,
		"catchUpTakeoverDelayMillis" : 30000,
		"getLastErrorModes" : {
			
		},
		"getLastErrorDefaults" : {
			"w" : 1,
			"wtimeout" : 0
		},
		"replicaSetId" : ObjectId("6501d61c9d2c863a2fa9a080")
	}
}
```

可以看出，主节点和副本节点的优先级各为1，即，默认可以认为都已经有了一票。但选举节点，优先级是0，（要注意是，官方说了，**选举节点的优先级必须是0，不能是别的值。即不具备选举权，但具有投票权**）

修改优先级 

比如，下面提升从节点的优先级： 

1）先将配置导入cfg变量

```shell
myrs:SECONDARY> cfg=rs.conf()
```

2）然后修改值（ID号默认从0开始）：

```shell
myrs:SECONDARY> cfg.members[1].priority=2
2
```

3）重新加载配置

```shell
myrs:SECONDARY> rs.reconfig(cfg)
{ "ok" : 1 }
```

稍等片刻会重新开始选举

## **7 故障测试**

### **副本节点故障测试**

关闭kk02副本节点： 

发现，主节点和仲裁节点对kk02的心跳失败。因为主节点还在，因此，没有触发投票选举。 

如果此时，在主节点写入数据

```shell
db.comment.insert({"_id":"1","articleid":"100001","content":"我们不应该把清晨浪费在
手机上，健康很重要，一杯温水幸福你我他。","userid":"1002","nickname":"相忘于江湖","createdatetime":new Date("2019-08-
05T22:08:15.522Z"),"likenum":NumberInt(1000),"state":"1"})
```

再启动从节点，会发现，主节点写入的数据，会自动同步给从节点。

### **主节点故障测试**

关闭kk01节点 

发现，从节点和仲裁节点对kk01的心跳失败，当失败超过10秒，此时因为没有主节点了，会自动发起投票。 

而副本节点只有kk02，因此，候选人只有一个就是kk02，开始投票。 

kk03向kk02投了一票，kk02本身自带一票，因此共两票，超过了“大多数” 

kk03是仲裁节点，没有选举权，kk02不向其投票，其票数是0. 

最终结果，kk02成为主节点。具备读写功能。 

在kk02写入数据查看。 

```shell
db.comment.insert({"_id":"2","articleid":"100001","content":"我夏天空腹喝凉开水，冬
天喝温开水","userid":"1005","nickname":"伊人憔悴","createdatetime":new Date("2019-
08-05T23:58:51.485Z"),"likenum":NumberInt(888),"state":"1"})
```

再启动kk01节点，发现kk01变成了从节点，kk02仍保持主节点。 

登录kk01节点，发现是从节点了，数据自动从kk02同步。 

从而实现了高可用。 

### **仲裁节点和主节点故障**

先关掉仲裁节点kk03， 

关掉现在的主节点kk02

登录kk01后，发现，kk01仍然是从节点，副本集中没有主节点了，导致此时，副本集是只读状态，无法写入。 

为啥不选举了？因为kk01的票数，没有获得大多数，即没有大于等于2，它只有默认的一票（优先级是1） 

如果要触发选举，随便加入一个成员即可。 

-   如果只加入kk03仲裁节点成员，则主节点一定是kk01，因为没得选了，仲裁节点不参与选举，但参与投票。
-   如果只加入kk02节点，会发起选举。因为kk01和kk01都是两票，则按照谁数据新，谁当主节点。

### **仲裁节点和从节点故障** 

先关掉仲裁节点kk03， 

关掉现在的副本节点kk02

10秒后，kk01主节点自动降级为副本节点。（服务降级） 

副本集不可写数据了，已经故障了。



## 8 mongo副本集启停脚本

创建mongodb副本集启停脚本

```shell
[nhk@kk01 bin]$ pwd
/home/nhk/bin
[nhk@kk01 bin]$ vim mongo_replica_set.sh 
```

参考脚本如下

```shell
#!/bin/bash
if [ $# -lt 1 ]
then
    echo "No Args Input..."
    exit ;
fi
case $1 in
"start")
    echo "=================== 启动 mongodb副本集 ==================="
    for host in kk01 kk02 kk03
    do		
		echo "=========$host starts mongo========="
		ssh $host "/opt/software/mongodb/bin/mongod -f /opt/software/mongodb/replica_sets/mongod.conf"
    done
;;
"stop")
    echo "=================== 关闭 mongodb副本集 ==================="
    for host in kk03 kk02 kk01
    do		
    	echo "=========$host stop mongo========="
    	# 这种关闭方式不安全，可能会照成数据丢失，安全做法是通过mongo客户端中的shutdownServer命令来关闭服务 
        # use admin
        # db.shutdownServer()
		ssh $host "sudo netstat -nltp | grep mongo | awk '{print \$7}' | awk -F / '{print \$1}' | head -n 1 | xargs kill -2"
    done
;;
"status")
    echo "===================  mongodb副本集 ==================="
    for host in kk01 kk02 kk03
    do		
    	echo "=========$host========="
   	ssh $host "sudo ps -ef | grep mongo | head -n 1"
    done
;;
*)
    echo "Input Args Error..."
;;
esac
```

赋予脚本可执行权限

```shell
[nhk@kk01 bin]$ chmod +x mongo_replica_set.sh 
```

测试脚本

```shell
# 启动mongodb副本集
[nhk@kk01 bin]$ mongo_replica_set.sh start
=================== 启动 mongodb副本集 ===================
=========kk01 starts mongo=========
about to fork child process, waiting until server is ready for connections.
forked process: 9939
child process started successfully, parent exiting
=========kk02 starts mongo=========
about to fork child process, waiting until server is ready for connections.
forked process: 8467
child process started successfully, parent exiting
=========kk03 starts mongo=========
about to fork child process, waiting until server is ready for connections.
forked process: 8269
child process started successfully, parent exiting

# 查看副本集启动状态（进程）
[nhk@kk01 bin]$ mongo_replica_set.sh status
===================  mongodb副本集 ===================
=========kk01=========
nhk        9939      1  7 16:43 ?        00:00:01 /opt/software/mongodb/bin/mongod -f /opt/software/mongodb/replica_sets/mongod.conf
=========kk02=========
nhk        8467      1  6 16:43 ?        00:00:00 /opt/software/mongodb/bin/mongod -f /opt/software/mongodb/replica_sets/mongod.conf
=========kk03=========
nhk        8269      1  6 16:43 ?        00:00:00 /opt/software/mongodb/bin/mongod -f /opt/software/mongodb/replica_sets/mongod.conf

# 关闭mongodb副本集
[nhk@kk01 bin]$ mongo_replica_set.sh stop
=================== 关闭 mongodb副本集 ===================
=========kk01 stop mongo=========
=========kk02 stop mongo=========
=========kk03 stop mongo=========
```

