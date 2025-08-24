# Docker中部署主从复制的MySQL

## 1、新建主服务器容器实例 3307

```shell
# 命令
docker run -p 3307:3306 --name mysql-master \
-v /mydata/mysql-master/log:/var/log/mysql \
-v /mydata/mysql-master/data:/var/lib/mysql \
-v /mydata/mysql-master/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=root \
-d mysql:5.7

# 参数说明
 -p 3307:3306  3307表映射到宿主机的端口 3306表容器内真正运行MySQL的端口
 --name mysql-master	表容器实例名称为 mysql-master
 -v /mydata/mysql-master/log:/var/log/mysql 	容器数据卷
 -e MYSQL_ROOT_PASSWORD=root 	root用户密码为root
 -d mysql:5.7  mysql版本
```

```shell
[root@nhk opt]# docker run -p 3307:3306 --name mysql-master \
> -v /mydata/mysql-master/log:/var/log/mysql \
> -v /mydata/mysql-master/data:/var/lib/mysql \
> -v /mydata/mysql-master/conf:/etc/mysql \
> -e MYSQL_ROOT_PASSWORD=root \
> -d mysql:5.7
14e2fb24fc6db36dac4327dc91d8af716794754027cb58374f6213cc08546029
[root@nhk opt]# docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED          STATUS          PORTS                                                  NAMES
14e2fb24fc6d   mysql:5.7   "docker-entrypoint.s…"   11 seconds ago   Up 10 seconds   33060/tcp, 0.0.0.0:3307->3306/tcp, :::3307->3306/tcp   mysql-master
```



## 2、进入/mydata/mysql-master/conf目录下新建my.cnf

因为挂载了数据容器卷，所以这里直接修改宿主机即可同步修改容器实例

```shell
[root@nhk conf]# cd /mydata/mysql-master/conf/
[root@nhk conf]# ll
total 0
[root@nhk conf]# vim my.cnf
```

my.cnf文件参考内容如下

```shell
[mysqld]
## 设置server_id，同一局域网中需要唯一
server_id=101
## 指定不需要异步的数据库名称
binlog-ignore-db=mysql
## 开启二进制日志功能
log-bin=mall-mysql-bin
## 设置二进制日志使用内存大小(事务)
binlog_cache_size=1M
## 设置使用的二进制日志格式（mixd,statement,row）
binlog_format=mixed
## 二进制日志过期清除时间。默认值为0，表示不自动清理
expire_logs_days=7
## 跳过主从复制中遇到的所有错误或指定类型的错误，避免slave端复制中断
## 如：1062错误是指一些主键重复，1032错误是因为主从数据库数据不一致
slave_skip_errors=1062
```



## 3、修改完配置后重启master容器实例

```shell
[root@nhk conf]# docker restart mysql-master 
mysql-master
```

查看容器是否重启成功

```shell
[root@nhk conf]# docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED          STATUS         PORTS                                                  NAMES
14e2fb24fc6d   mysql:5.7   "docker-entrypoint.s…"   25 minutes ago   Up 2 seconds   33060/tcp, 0.0.0.0:3307->3306/tcp, :::3307->3306/tcp   mysql-masterxxxxxxxxxx docker [root@nhk conf]# docker restart mysql-master mysql-master[root@nhk conf]# docker psCONTAINER ID   IMAGE       COMMAND                  CREATED          STATUS         PORTS                                                  NAMES14e2fb24fc6d   mysql:5.7   "docker-entrypoint.s…"   25 minutes ago   Up 2 seconds   33060/tcp, 0.0.0.0:3307->3306/tcp, :::3307->3306/tcp   mysql-master
```

注意：如果容器实例重启不成功，可以使用下面命令查看是什么情况（可以发现报错情况）

```
docker logs mysql-master      # 其中 mysql-master 为容器实例名称
```



## 4、进入mysql-master容器实例

```shell
[root@nhk conf]# docker exec -it mysql-master /bin/bash
root@14e2fb24fc6d:/# mysql -uroot -p 
Enter password: 
...

mysql> 
```



## 5、master容器实例内创建数据同步用户

```sql
mysql>  CREATE USER 'slave'@'%' IDENTIFIED BY '123456';   -- 创建用户
Query OK, 0 rows affected (0.01 sec)

mysql>  GRANT REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'slave'@'%';    -- 授权
Query OK, 0 rows affected (0.00 sec)

mysql> 
```

 

## 6、新建从服务器容器实例 3308

```shell
# 命令
docker run -p 3308:3306 --name mysql-slave \
-v /mydata/mysql-slave/log:/var/log/mysql \
-v /mydata/mysql-slave/data:/var/lib/mysql \
-v /mydata/mysql-slave/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=root \
-d mysql:5.7

# 参数说明
-p 3308:3306  3308表映射到宿主机的端口 3306表容器内真正运行MySQL的端口
--name mysql-slave	表容器实例名称为 mysql-slave
 -v /mydata/mysql-slave/log:/var/log/mysql 	容器数据卷
 -e MYSQL_ROOT_PASSWORD=root 	root用户密码为root
 -d mysql:5.7  mysql版本
```

另外打开一个终端，如下

```shell
[root@nhk ~]# docker run -p 3308:3306 --name mysql-slave \
> -v /mydata/mysql-slave/log:/var/log/mysql \
> -v /mydata/mysql-slave/data:/var/lib/mysql \
> -v /mydata/mysql-slave/conf:/etc/mysql \
> -e MYSQL_ROOT_PASSWORD=root \
> -d mysql:5.7
6f85d3611cf91f5680f161b537c2331bad4529273f64834fbe3821dfdd90033d
[root@nhk ~]# docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED         STATUS             PORTS                                                  NAMES
6f85d3611cf9   mysql:5.7   "docker-entrypoint.s…"   4 seconds ago   Up 3 seconds       33060/tcp, 0.0.0.0:3308->3306/tcp, :::3308->3306/tcp   mysql-slave
14e2fb24fc6d   mysql:5.7   "docker-entrypoint.s…"   2 hours ago     Up About an hour   33060/tcp, 0.0.0.0:3307->3306/tcp, :::3307->3306/tcp   mysql-master
[root@nhk ~]# 
```



## 7、进入/mydata/mysql-slave/conf目录下新建my.cnf

因为挂载了数据容器卷，所以这里直接修改宿主机即可同步修改容器实例

```shell
[root@nhk ~]# cd /mydata/mysql-slave/conf/
[root@nhk conf]# ll
total 0
[root@nhk conf]# vim my.cnf
```

my.cnf文件参考内容如下

```shell
[mysqld]
## 设置server_id，同一局域网中需要唯一
server_id=102
## 指定不需要异步的数据库名称
binlog-ignore-db=mysql
## 开启二进制日志功能，以备Slave作为其它数据库实例的Master时使用
log-bin=mall-mysql-slave1-bin
## 设置二进制日志使用内存大小(事务)
binlog_cache_size=1M
## 设置使用的二进制日志格式（mixd,statement,row）
binlog_format=mixed
## 二进制日志过期清除时间。默认值为0，表示不自动清理
expire_logs_days=7
## 跳过主从复制中遇到的所有错误或指定类型的错误，避免slave端复制中断
## 如：1062错误是指一些主键重复，1032错误是因为主从数据库数据不一致
slave_skip_errors=1062
## relay_log配置中继日志
relay_log=mall-mysql-relay-bin
## log_slave_updates表示slave将复制事件写到自己的二进制日志
log_slave_updates=1
## slave设置为只读（具有super权限的用户除外）
read_only=1
```



## 8、修改完配置后重启slave容器实例

```shell
[root@nhk conf]# docker restart mysql-slave 
mysql-slave
```

查看容器是否重启成功

```shell
[root@nhk conf]# docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED         STATUS             PORTS                                                  NAMES
6f85d3611cf9   mysql:5.7   "docker-entrypoint.s…"   9 minutes ago   Up 4 seconds       33060/tcp, 0.0.0.0:3308->3306/tcp, :::3308->3306/tcp   mysql-slave
14e2fb24fc6d   mysql:5.7   "docker-entrypoint.s…"   2 hours ago     Up About an hour   33060/tcp, 0.0.0.0:3307->3306/tcp, :::3307->3306/tcp   mysql-master
```



## 9、在主数据库中查看主从同步状态

回到主服务器容器所在的终端

```shell
mysql> show master status;
+-----------------------+----------+--------------+------------------+-------------------+
| File                  | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+-----------------------+----------+--------------+------------------+-------------------+
| mall-mysql-bin.000001 |      617 |              | mysql            |                   |
+-----------------------+----------+--------------+------------------+-------------------+
1 row in set (0.00 sec)
```



## 10、进入mysql-slave容器实例

注意切换到另一个终端

```shell
[root@nhk conf]# docker exec -it mysql-slave /bin/bash
root@6f85d3611cf9:/# mysql -uroot -p
Enter password: 
...

mysql> 
```



## 11、在从数据库中配置主从复制

命令如下

```sql
change master to master_host='宿主机ip',master_user='slave',master_password='123456',master_port=3307,master_log_file='mall-mysql-bin.000001',master_log_pos=617,master_connect_retry=30;

# 参数说明
master_host='宿主机ip' 	表示主数据库的ip地址
master_port=3307 		表示主数据库的运行端口
master_user='slave'		表示主数据库创建的用于同步数据的用户账号
master_password='123456'	表示主数据库创建的用于同步数据的用户密码
master_connect_retry=30;	表示失败重试的时间间隔，单位为秒

master_log_file='mall-mysql-bin.000001'		指定从数据库要复制数据的日志文件，通过查看主数据库的状态，可获取File参数
master_log_pos=617		指定从数据库要从哪个位置开始复制数据，通过查看主数据库的状态，可获取Position参数
等这些参数都可以在主数据库中使用 show master status; 命令查看
```

```sql
-- 我们已预先知道了宿主机ip为 192.168.188.150
-- 切记下面命令是在从数据库中执行
mysql> change master to master_host='192.168.188.150',master_user='slave',master_password='123456',master_port=3307,master_log_file='mall-mysql-bin.000001',m
aster_log_pos=617,master_connect_retry=30;Query OK, 0 rows affected, 2 warnings (0.01 sec)
```



## 12、在从数据库中查看主从状态同步

```sql
mysql> show slave status \G;
*************************** 1. row ***************************
               Slave_IO_State: 
                  Master_Host: 192.168.188.150
                  Master_User: slave
                  Master_Port: 3307
                Connect_Retry: 30
              Master_Log_File: mall-mysql-bin.000001
          Read_Master_Log_Pos: 617
               Relay_Log_File: mall-mysql-relay-bin.000001
                Relay_Log_Pos: 4
        Relay_Master_Log_File: mall-mysql-bin.000001
             Slave_IO_Running: No		-- 看到这两个参数说明还未开始同步
            Slave_SQL_Running: No
          .....
          
          
1 row in set (0.00 sec)

ERROR: 
No query specified

mysql> 
```



## 13、在从数据库中开启主从同步状态

```sql
mysql> start slave;
Query OK, 0 rows affected (0.01 sec)
```



## 14、查看从数据库状态发现已经同步

```sql
mysql> show slave status \G;
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: 192.168.188.150
                  Master_User: slave
                  Master_Port: 3307
                Connect_Retry: 30
              Master_Log_File: mall-mysql-bin.000001
          Read_Master_Log_Pos: 617
               Relay_Log_File: mall-mysql-relay-bin.000002
                Relay_Log_Pos: 325
        Relay_Master_Log_File: mall-mysql-bin.000001
             Slave_IO_Running: Yes	-- 都是yes表示同步打开了
            Slave_SQL_Running: Yes
			...
			
1 row in set (0.00 sec)

ERROR: 
No query specified

mysql> 
```



## 15、主从复制测试

在主机新建库，使用库，新建表，插入数据

```sql
-- 切记这里操作的是主数据库
mysql> create database db01;
Query OK, 1 row affected (0.00 sec)

mysql> use db01;
Database changed
mysql> create table t1(id int,name varchar(20));
Query OK, 0 rows affected (0.02 sec)

mysql> insert into t1 values(1,"libai");
Query OK, 1 row affected (0.01 sec)

mysql> select * from t1;
+------+-------+
| id   | name  |
+------+-------+
|    1 | libai |
+------+-------+
1 row in set (0.00 sec)

mysql> 
```

从机使用库，查看记录

```sql
-- 切记，这里是在从数据库查看
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| db01               |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.00 sec)

mysql> use db01;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> select * from t1;
+------+-------+
| id   | name  |
+------+-------+
|    1 | libai |
+------+-------+
1 row in set (0.00 sec)

mysql> 
```

此致，MySQL数据库主从复制配置完成