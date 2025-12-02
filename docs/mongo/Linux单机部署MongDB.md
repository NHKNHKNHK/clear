# Linux单机部署MongDB

## 1）下载安装包 

MongoDB 提供了可用于 32 位和 64 位系统的预编译二进制包，你可以从MongoDB官网下载安装，MongoDB 预编译二进制包下载地址： 

https://www.mongodb.com/download-center#community

https://www.mongodb.com/try/download/community

提示：版本的选择： 

- MongoDB的版本命名规范如：x.y.z；
  - y为奇数时表示当前版本为开发版，如：1.5.2、4.1.13；
  - y为偶数时表示当前版本为稳定版，如：1.6.3、4.0.10；
  - z是修正版本号，数字越大越好。

详情：http://docs.mongodb.org/manual/release-notes/#release-version-numbers 

## 2）上传压缩包

```shell
[nhk@kk01 software]$ ll | grep mongodb-linux-x86_64-rhel70-5.0.21.tgz 
-rw-rw-r--.  1 nhk nhk  87614958 Sep 12 23:18 mongodb-linux-x86_64-rhel70-5.0.21.tgz
```

## 3）解压

```shell
[nhk@kk01 software]$ tar -zxvf mongodb-linux-x86_64-rhel70-5.0.21.tgz -C /opt/software/
```

## 4）软链接

软链接就是为了后续好操作目录

```shell
[nhk@kk01 software]$ ln -s mongodb-linux-x86_64-rhel70-5.0.21 mongodb

[nhk@kk01 software]$ ll | grep mongodb
lrwxrwxrwx.  1 nhk nhk        34 Sep 12 23:21 mongodb -> mongodb-linux-x86_64-rhel70-5.0.21
drwxrwxr-x.  3 nhk nhk       100 Sep 12 23:19 mongodb-linux-x86_64-rhel70-5.0.21
-rw-rw-r--.  1 nhk nhk  87614958 Sep 12 23:18 mongodb-linux-x86_64-rhel70-5.0.21.tgz
```

# 5）新建目录，分别用来存储数据和日志

```shell
# 数据存储目录  
[nhk@kk01 software]$ mkdir -p mongodb/single/data/db
# 日志存储目录
[nhk@kk01 software]$ mkdir -p mongodb/single/log
```

## 6）新建并修改配置文件mongod.conf

```shell
[nhk@kk01 software]$ vim mongodb/single/mongod.conf
```

参考内容如下：

```shell
systemLog:
  #MongoDB发送所有日志输出的目标指定为文件
  # #The path of the log file to which mongod or mongos should send all diagnostic logging information
  destination: file
  #mongod或mongos应向其发送所有诊断日志记录信息的日志文件的路径
  path: "/opt/software/mongodb/single/log/mongod.log"
  #当mongos或mongod实例重新启动时，mongos或mongod会将新条目附加到现有日志文件的末尾。
  logAppend: true
storage:
  #mongod实例存储其数据的目录。storage.dbPath设置仅适用于mongod。
  ##The directory where the mongod instance stores its data.Default Value is "/data/db".
  dbPath: "/opt/software/mongodb/single/data/db"
  journal:
  #启用或禁用持久性日志以确保数据文件保持有效和可恢复。（64位系统默认就是true）
  	enabled: true
processManagement:
  #启用在后台运行mongos或mongod进程的守护进程模式。
  fork: true
  net:
  #服务实例绑定的IP，默认是localhost
  bindIp: localhost,192.168.188.128
  #bindIp
  #绑定的端口，默认是27017
  port: 27017
```

## 7）启动MongoDB服务

```shell
[nhk@kk01 software]$ /opt/software/mongodb/bin/mongod -f /opt/software/mongodb/single/mongod.conf 
about to fork child process, waiting until server is ready for connections.
forked process: 2960
child process started successfully, parent exiting
```

注意： 

​	如果启动后不是 successfully ，则是启动失败了。原因基本上就是配置文件有问题。 

## 8）查看进程

通过进程来查看服务是否启动了：

```shell
[nhk@kk01 ~]$ ps -ef |grep mongod
nhk        2960      1  1 23:45 ?        00:00:00 /opt/software/mongodb/bin/mongod -f /opt/software/mongodb/single/mongod.conf	# 这个就是mongodb的进程
nhk        3103   3042  0 23:45 pts/0    00:00:00 grep --color=auto mongod
```

## 9）停止关闭服务 

停止服务的方式有两种：快速关闭和标准关闭，下面依次说明： 

**（一）快速关闭方法**（快速，简单，数据可能会出错） 

目标：通过系统的kill命令直接杀死进程： 

杀完要检查一下，避免有的没有杀掉。 

```shell
#通过进程编号关闭节点
kill -2 2960
```

**（二）标准的关闭方法**（数据不容易出错，但麻烦）： 

目标：通过mongo客户端中的shutdownServer命令来关闭服务 

主要的操作步骤参考如下： 

```shell
# 客户端登录服务，注意，这里通过localhost登录，如果需要远程登录，必须先登录认证才行。
[nhk@kk01 mongodb]$ pwd
/opt/software/mongodb
[nhk@kk01 mongodb]$ bin/mongo --port 27017

#切换到admin库
> use admin
switched to db admin

# 关闭服务
> db.shutdownServer()
server should be down...
```

补充说明：

如果一旦是因为数据损坏（一般是第一种方式关闭导致），则需要进行如下操作

1）删除lock文件：

```shell
rm -f /mongodb/single/data/db/*.lock
```

2）修复数据：

```shell
/usr/local/mongdb/bin/mongod --repair --dbpath=/mongodb/single/data/db
```
