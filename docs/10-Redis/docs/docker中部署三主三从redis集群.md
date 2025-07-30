# Redis相关理论

如果有 1~2亿条数据需要缓存，请问如何设计这个存储案例？

-   如果是单台机器的话100%是不可能的，肯定是分布式存储

这种问题一般业界有三种解决方式：

## **哈希取余分区**

2亿条记录也就是2亿个K,V，所以这里必须部署分布式才能缓存下来，假设我们3台机器构成集群，用户每次读写都是依据公式 hash(key)  % N台机器 ，计算出哈希值，用来决定数据将要映射到哪一个节点



## **一致性哈希算法**

一致性hash算法在1997年由麻省理工学院提出，设计目标就是为了：

​	**解决分布式缓存数据变成和映射的问题**，某台机器宕机了，分母数量改变了，自然取余数不OK了

一致性哈希算法实现的3大步骤：

**1）算法构建一致性哈希环**

​	一致性哈希算法必然有个hash函数，并按照算法产生hash值，这个算法的所有可能，哈希值会构成一个全量集，这个集合可以成为一个hash空间 [0, 2^32-1]，这个是一个线性空间，我们通过适当的逻辑控制将它们首尾相连（0 = 2^32-1），这样让它逻辑上形成了一个环形空间。

**2）服务器IP节点映射**

​	将集群中各个IP节点隐射到环上的某一个位置

​	将各个服务器使用Hash进行一个哈希，具体可以选择服务器的IP或主机名作为关键字进行哈希，这样每台机器就能确定其在哈希环上的位置。

**3）key落到服务器的落键规则**

​	当我们需要存储一个kv键值对时，首先计算key的hash值，hash(key)，将这个key使用相同的函数Hash计算出哈希值并确定此数据在环上的位置，从此位置沿环顺时针“行走”，第一台遇到的服务器就是其应该定位到的服务器，并将该键值对存储在该节点上。

**一致性哈希算法的优点**

容错性、扩展性

加入和删除节点只影响哈希环中顺时针方向的相邻的节点，对其他节点无影响。

**一致性哈希算法的缺点**

数据倾斜问题

数据的分布和节点的位置有关，因为这些节点不是均匀的分布在哈希环上的，所以数据在进行存储时，达不到均匀分布的效果。

**小总结**

为了在节点数目发生变化时尽可能少的迁移数据

将所有的存储节点排列在首尾相连的Hash环上，每个Key的计算Hash会顺时针周到临近的存储节点存放。

而当有节点加入或退出时仅影响该节点在Hash环上顺时针相邻的后续节点



## **哈希槽分区**

**为什么会出现哈希槽分区？**

​	为了解决一致性哈希算法的**数据倾斜**问题。

哈希槽实质就是一个数组，数组[0, 2^14-1] 形成 hash slot 空间

**哈希槽分区能干什么？**

​	解决均匀分配的问题，**在数据和节点之间又加上了一层，把这层称为 哈希槽（slot）**，用于管理数据和节点之间的关系，现在就相当于节点上放的是操，槽里放的是数据。

**槽解决的是粒度问题**，相当于把粒度变大了，这样便于数据移动。

哈希解决的是映射问题，使用key的哈希值来计算所在的槽，便于分配数据。

**有多少个哈希槽呢？**

​	一个集群只能有16384个槽，编号为0\~16383（0~2^14-1）。这些槽会分配给集群中的所有主节点，分配策略没有要求。可以指定哪些编号的槽分配给哪个主节点。集群会记录节点和槽的对应关系。解决了节点和槽的关系后，接下来就是 key求哈希值，然后对16384取余。余数是几key就落入到对应的槽。solt = CRC16(key) % 16384。以槽为单位进行数据移动，因为槽的数目是固定的，处理起来比较容易，这样数据移动的问题就解决了。





# 集群规划

|      |              |              |              |
| ---- | ------------ | ------------ | ------------ |
| 主   | Master1 6381 | Master2 6382 | Master3 6383 |
| 从   | Slave1 6385  | Slave2 6386  | Slave3 6384  |

# 三主三从配置

## 关闭防火墙、启动docker后台服务

```shell
# 查看防火墙状态
[root@nhk ~]# systemctl status firewalld.service 
● firewalld.service - firewalld - dynamic firewall daemon
   Loaded: loaded (/usr/lib/systemd/system/firewalld.service; disabled; vendor preset: enabled)
   Active: inactive (dead)
     Docs: man:firewalld(1)

# 查看docker状态
[root@nhk ~]# systemctl status docker
● docker.service - Docker Application Container Engine
   Loaded: loaded (/usr/lib/systemd/system/docker.service; enabled; vendor preset: disabled)
   Active: active (running) since Fri 2023-06-02 23:24:43 EDT; 4h 9min ago
     Docs: https://docs.docker.com
 Main PID: 1283 (dockerd)
    Tasks: 38
   	....
```

## 新建6个docker容器实例

```shell
docker run -d --name redis-node-1 --net host --privileged=true -v /data/redis/share/redis-node-1:/data redis:6.0.8 --cluster-enabled yes --appendonly yes --port 6381 

docker run -d --name redis-node-2 --net host --privileged=true -v /data/redis/share/redis-node-2:/data redis:6.0.8 --cluster-enabled yes --appendonly yes --port 6382

docker run -d --name redis-node-3 --net host --privileged=true -v /data/redis/share/redis-node-3:/data redis:6.0.8 --cluster-enabled yes --appendonly yes --port 6383 

docker run -d --name redis-node-4 --net host --privileged=true -v /data/redis/share/redis-node-4:/data redis:6.0.8 --cluster-enabled yes --appendonly yes --port 6384 

docker run -d --name redis-node-5 --net host --privileged=true -v /data/redis/share/redis-node-5:/data redis:6.0.8 --cluster-enabled yes --appendonly yes --port 6385 

docker run -d --name redis-node-6 --net host --privileged=true -v /data/redis/share/redis-node-6:/data redis:6.0.8 --cluster-enabled yes --appendonly yes --port 6386 

# 参数说明
docker run 						创建并运行docker容器实例
--name redis-node-1				指定容器名称
--net host						使用宿主机的ip和端口
--privileged=true 				获取宿主机root用户权限
 -v /data/redis/share/redis-node-1:/data 	容器卷，宿主机目录:docker容器目录
redis:6.0.8						表示使用的redis镜像和版本号
--cluster-enabled yes  			表示是否开启redis集群
--appendonly yes 				开启持久化
--port 6381 					redis端口号
```

输入上面命令后，查看正在运行的容器实例

```shell
CONTAINER ID   IMAGE         COMMAND                  CREATED         STATUS         PORTS     NAMES
a5947070df2d   redis:6.0.8   "docker-entrypoint.s…"   6 seconds ago   Up 5 seconds             redis-node-6
140116b8514c   redis:6.0.8   "docker-entrypoint.s…"   8 seconds ago   Up 8 seconds             redis-node-5
4c6a6a674ad1   redis:6.0.8   "docker-entrypoint.s…"   9 seconds ago   Up 8 seconds             redis-node-4
2c474930a34b   redis:6.0.8   "docker-entrypoint.s…"   9 seconds ago   Up 8 seconds             redis-node-3
cbe9768a92c3   redis:6.0.8   "docker-entrypoint.s…"   9 seconds ago   Up 8 seconds             redis-node-2
7363c859da61   redis:6.0.8   "docker-entrypoint.s…"   9 seconds ago   Up 8 seconds             redis-node-1
```



## 进入容器redis-node-1 并为6台机器构建机器关系

### 进入容器

```shell
[root@nhk ~]# docker exec -it redis-node-1 /bin/bash  
root@nhk:/data# 
```

### 构建主从关系

先打开另外一个终端，查看宿主机的ip

```shell
[root@nhk ~]# ifconfig 
....
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.188.150  netmask 255.255.255.0  broadcast 192.168.188.255
        inet6 fe80::382f:4868:f511:276f  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:65:d3:21  txqueuelen 1000  (Ethernet)
        RX packets 6248  bytes 566055 (552.7 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 4278  bytes 627974 (613.2 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
...
```

可以查看到**宿主机ip为 192.168.188.150**

切记，**下面命令要填的是宿主机的ip**

```shell
root@nhk:/data# redis-cli --cluster create 192.168.188.150:6381 192.168.188.150:6382 192.168.188.150:6383 192.168.188.150:6384 192.168.188.150:6385 192.168.188.150:6386 --cluster-replicas 
1>>> Performing hash slots allocation on 6 nodes...
Master[0] -> Slots 0 - 5460
Master[1] -> Slots 5461 - 10922
Master[2] -> Slots 10923 - 16383    # 这里显示的是hash槽的分配情况
Adding replica 192.168.188.150:6385 to 192.168.188.150:6381
Adding replica 192.168.188.150:6386 to 192.168.188.150:6382
Adding replica 192.168.188.150:6384 to 192.168.188.150:6383
>>> Trying to optimize slaves allocation for anti-affinity
[WARNING] Some slaves are in the same host as their master
M: 4c5f71512103da61902dd8dce1b0985ad9b8fc2d 192.168.188.150:6381
   slots:[0-5460] (5461 slots) master
M: 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3 192.168.188.150:6382
   slots:[5461-10922] (5462 slots) master
M: 740da642f3018c97fa141d73978270bea26fb545 192.168.188.150:6383
   slots:[10923-16383] (5461 slots) master
S: bbdaea50a233021cfdf43e5f8b7ca0b8ab36e1f6 192.168.188.150:6384
   replicates 4c5f71512103da61902dd8dce1b0985ad9b8fc2d
S: 8e8c56e02cc34a7ea8186c225727b7366e36057d 192.168.188.150:6385
   replicates 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3
S: 347332cdd66d6dfcc2d43bb20ed8f2d62ed79f50 192.168.188.150:6386
   replicates 740da642f3018c97fa141d73978270bea26fb545
Can I set the above configuration? (type 'yes' to accept): yes  #这里是如果接收上面的分配就yes
>>> Nodes configuration updated
>>> Assign a different config epoch to each node
>>> Sending CLUSTER MEET messages to join the cluster
Waiting for the cluster to join
.
>>> Performing Cluster Check (using node 192.168.188.150:6381)
M: 4c5f71512103da61902dd8dce1b0985ad9b8fc2d 192.168.188.150:6381
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
M: 740da642f3018c97fa141d73978270bea26fb545 192.168.188.150:6383
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
M: 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3 192.168.188.150:6382
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
S: 347332cdd66d6dfcc2d43bb20ed8f2d62ed79f50 192.168.188.150:6386
   slots: (0 slots) slave
   replicates 740da642f3018c97fa141d73978270bea26fb545
S: 8e8c56e02cc34a7ea8186c225727b7366e36057d 192.168.188.150:6385
   slots: (0 slots) slave
   replicates 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3
S: bbdaea50a233021cfdf43e5f8b7ca0b8ab36e1f6 192.168.188.150:6384
   slots: (0 slots) slave
   replicates 4c5f71512103da61902dd8dce1b0985ad9b8fc2d
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
root@nhk:/data# 

# 参数说明 
 --cluster-replicas 1   表示为每个master 创建一个slave节点
```



## 链接进入6381作为切入点，查看集群状态

命令

```shell
cluster info
cluster nodes
```

```shell
root@nhk:/data# redis-cli -p 6381
127.0.0.1:6381> keys *
(empty array)
127.0.0.1:6381> cluster info
cluster_state:ok
cluster_slots_assigned:16384
cluster_slots_ok:16384
cluster_slots_pfail:0
cluster_slots_fail:0
cluster_known_nodes:6
cluster_size:3
cluster_current_epoch:6
cluster_my_epoch:1
cluster_stats_messages_ping_sent:181
cluster_stats_messages_pong_sent:177
cluster_stats_messages_sent:358
cluster_stats_messages_ping_received:172
cluster_stats_messages_pong_received:181
cluster_stats_messages_meet_received:5
cluster_stats_messages_received:358
127.0.0.1:6381> 
127.0.0.1:6381> cluster nodes
740da642f3018c97fa141d73978270bea26fb545 192.168.188.150:6383@16383 master - 0 1685779666600 3 connected 10923-16383
3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3 192.168.188.150:6382@16382 master - 0 1685779665000 2 connected 5461-10922
347332cdd66d6dfcc2d43bb20ed8f2d62ed79f50 192.168.188.150:6386@16386 slave 740da642f3018c97fa141d73978270bea26fb545 0 1685779666000 3 connected
8e8c56e02cc34a7ea8186c225727b7366e36057d 192.168.188.150:6385@16385 slave 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3 0 1685779665000 2 connected
bbdaea50a233021cfdf43e5f8b7ca0b8ab36e1f6 192.168.188.150:6384@16384 slave 4c5f71512103da61902dd8dce1b0985ad9b8fc2d 0 1685779665583 1 connected
4c5f71512103da61902dd8dce1b0985ad9b8fc2d 192.168.188.150:6381@16381 myself,master - 0 1685779664000 1 connected 0-5460
127.0.0.1:6381> 

# 从cluster nodes命令可以看出挂载信息（挂载的情况，可能每次搭建集群都可能不一样）
Master			Slave
6381			6384
6382			6385
6383			6386
```



# 主从容错切换迁移

## 数据读写存储

### 启动6机构成的集群并通过exec进入

```shell
[root@nhk opt]# docker exec -it redis-node-1 /bin/bash
```

### 对6381新增key

```shell
root@nhk:/data# redis-cli -p 6381
127.0.0.1:6381> keys *
(empty array)
127.0.0.1:6381> set k1 v1
(error) MOVED 12706 192.168.188.150:6383
127.0.0.1:6381> set k2 v2
OK
127.0.0.1:6381> set k3 v3
OK
127.0.0.1:6381> set k4 v4
(error) MOVED 8455 192.168.188.150:6382
127.0.0.1:6381>

# 看到上面报错信息，原因是 master1分配到了哈希槽 0-5460 ，大于这个的范围就会报错
```

### 防止路由失效加参数 -c 并新增key

```shell
[root@nhk ~]# docker exec -it redis-node-1 /bin/bash
root@nhk:/data# redis-cli -p 3381 -c
Could not connect to Redis at 127.0.0.1:3381: Connection refused
not connected> exit
root@nhk:/data# redis-cli -p 6381 -c		# -c 参数优化路由，意思是以集群方式进入
127.0.0.1:6381> FLUSHALL
OK
127.0.0.1:6381> set k1 v1				# 此时，不报错了，并跳转到了 6383
-> Redirected to slot [12706] located at 192.168.188.150:6383
OK
192.168.188.150:6383> set k2 v2     # 跳转到了 6381
-> Redirected to slot [449] located at 192.168.188.150:6381
OK
192.168.188.150:6381> set k3 v3
OK
192.168.188.150:6381> set k4 v4
-> Redirected to slot [8455] located at 192.168.188.150:6382
OK
192.168.188.150:6382> 
```

### 查看集群信息

```shell
# 注意这里的ip为宿主机的真实ip
root@nhk:/data# redis-cli --cluster check 192.168.188.150:6381
192.168.188.150:6381 (4c5f7151...) -> 2 keys | 5461 slots | 1 slaves.
192.168.188.150:6382 (3b3e9e22...) -> 1 keys | 5462 slots | 1 slaves.
192.168.188.150:6383 (740da642...) -> 1 keys | 5461 slots | 1 slaves.
[OK] 4 keys in 3 masters.
0.00 keys per slot on average.
>>> Performing Cluster Check (using node 192.168.188.150:6381)
M: 4c5f71512103da61902dd8dce1b0985ad9b8fc2d 192.168.188.150:6381
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
M: 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3 192.168.188.150:6382
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
S: 347332cdd66d6dfcc2d43bb20ed8f2d62ed79f50 192.168.188.150:6386
   slots: (0 slots) slave
   replicates 740da642f3018c97fa141d73978270bea26fb545
S: 8e8c56e02cc34a7ea8186c225727b7366e36057d 192.168.188.150:6385
   slots: (0 slots) slave
   replicates 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3
M: 740da642f3018c97fa141d73978270bea26fb545 192.168.188.150:6383
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
S: bbdaea50a233021cfdf43e5f8b7ca0b8ab36e1f6 192.168.188.150:6384
   slots: (0 slots) slave
   replicates 4c5f71512103da61902dd8dce1b0985ad9b8fc2d
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
root@nhk:/data# 
```



## 主从容错切换迁移

### 主6381和从机切换，先停止主机6381

```shell
 [root@nhk ~]# docker ps
CONTAINER ID   IMAGE         COMMAND                  CREATED        STATUS          PORTS     NAMES
a5947070df2d   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago   Up 19 minutes             redis-node-6
140116b8514c   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago   Up 19 minutes             redis-node-5
4c6a6a674ad1   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago   Up 19 minutes             redis-node-4
2c474930a34b   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago   Up 19 minutes             redis-node-3
cbe9768a92c3   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago   Up 19 minutes             redis-node-2
7363c859da61   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago   Up 19 minutes             redis-node-1
[root@nhk ~]# docker stop redis-node-1
redis-node-1
[root@nhk ~]# docker ps
CONTAINER ID   IMAGE         COMMAND                  CREATED        STATUS          PORTS     NAMES
a5947070df2d   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago   Up 20 minutes             redis-node-6
140116b8514c   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago   Up 20 minutes             redis-node-5
4c6a6a674ad1   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago   Up 20 minutes             redis-node-4
2c474930a34b   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago   Up 20 minutes             redis-node-3
cbe9768a92c3   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago   Up 20 minutes             redis-node-2
[root@nhk ~]# 
```



### 再次查看集群信息

```shell
[root@nhk ~]# docker exec -it redis-node-2 /bin/bash
root@nhk:/data# redis-cli -p 6382 -c
127.0.0.1:6382> cluster nodes
4c5f71512103da61902dd8dce1b0985ad9b8fc2d 192.168.188.150:6381@16381 master,fail - 1685852851610 1685852847000 1 disconnected
bbdaea50a233021cfdf43e5f8b7ca0b8ab36e1f6 192.168.188.150:6384@16384 master - 0 1685852927000 7 connected 0-5460
3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3 192.168.188.150:6382@16382 myself,master - 0 1685852928000 2 connected 5461-10922
8e8c56e02cc34a7ea8186c225727b7366e36057d 192.168.188.150:6385@16385 slave 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3 0 1685852928190 2 connected
740da642f3018c97fa141d73978270bea26fb545 192.168.188.150:6383@16383 master - 0 1685852929218 3 connected 10923-16383
347332cdd66d6dfcc2d43bb20ed8f2d62ed79f50 192.168.188.150:6386@16386 slave 740da642f3018c97fa141d73978270bea26fb545 0 1685852927167 3 connected
127.0.0.1:6382> 

# 可以看到 6381已经 fail    
		6384已经上位成master了
```



### 先还原之前的三主三从

让 redis-node-1 （6381）恢复工作了

```shell
[root@nhk opt]# docker start redis-node-1 
redis-node-1
[root@nhk opt]# docker ps
CONTAINER ID   IMAGE         COMMAND                  CREATED        STATUS          PORTS     NAMES
a5947070df2d   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago   Up 24 minutes             redis-node-6
140116b8514c   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago   Up 24 minutes             redis-node-5
4c6a6a674ad1   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago   Up 24 minutes             redis-node-4
2c474930a34b   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago   Up 24 minutes             redis-node-3
cbe9768a92c3   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago   Up 24 minutes             redis-node-2
7363c859da61   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago   Up 3 seconds              redis-node-1
[root@nhk opt]# 
```

查看集群状态

```shell
[root@nhk opt]# docker exec -it redis-node-2 /bin/bash
root@nhk:/data# redis-cli -p 6382 -c
127.0.0.1:6382> cluster nodes
4c5f71512103da61902dd8dce1b0985ad9b8fc2d 192.168.188.150:6381@16381 slave bbdaea50a233021cfdf43e5f8b7ca0b8ab36e1f6 0 1685853192141 7 connected
bbdaea50a233021cfdf43e5f8b7ca0b8ab36e1f6 192.168.188.150:6384@16384 master - 0 1685853192000 7 connected 0-5460
3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3 192.168.188.150:6382@16382 myself,master - 0 1685853192000 2 connected 5461-10922
8e8c56e02cc34a7ea8186c225727b7366e36057d 192.168.188.150:6385@16385 slave 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3 0 1685853194189 2 connected
740da642f3018c97fa141d73978270bea26fb545 192.168.188.150:6383@16383 master - 0 1685853189081 3 connected 10923-16383
347332cdd66d6dfcc2d43bb20ed8f2d62ed79f50 192.168.188.150:6386@16386 slave 740da642f3018c97fa141d73978270bea26fb545 0 1685853194000 3 connected
127.0.0.1:6382> 

# 我们发现，即使 6381 恢复以后，6384也不会让位
```

接下来我们先停止 6384 等待一段时间后再重启 6384 ，让6381 恢复为 master

```shell
[root@nhk ~]# docker stop redis-node-4
redis-node-4
[root@nhk ~]# 
[root@nhk ~]# docker start redis-node-4 
redis-node-4
```



### 查看集群状态

```shell
[root@nhk ~]# docker exec -it redis-node-1 /bin/bash
root@nhk:/data# redis-cli -p 6381 -c
127.0.0.1:6381> cluster nodes
740da642f3018c97fa141d73978270bea26fb545 192.168.188.150:6383@16383 master - 0 1685853645000 3 connected 10923-16383
3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3 192.168.188.150:6382@16382 master - 0 1685853648456 2 connected 5461-10922
347332cdd66d6dfcc2d43bb20ed8f2d62ed79f50 192.168.188.150:6386@16386 slave 740da642f3018c97fa141d73978270bea26fb545 0 1685853647439 3 connected
8e8c56e02cc34a7ea8186c225727b7366e36057d 192.168.188.150:6385@16385 slave 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3 0 1685853649473 2 connected
bbdaea50a233021cfdf43e5f8b7ca0b8ab36e1f6 192.168.188.150:6384@16384 slave 4c5f71512103da61902dd8dce1b0985ad9b8fc2d 0 1685853646000 8 connected
4c5f71512103da61902dd8dce1b0985ad9b8fc2d 192.168.188.150:6381@16381 myself,master - 0 1685853648000 8 connected 0-5460
127.0.0.1:6381> 

# 我们发现 6381 已经恢复成了master  6384 又变成了 slave
```



# 主从扩容

## 新建 6387、6387两个节点并启动

```shell
[root@nhk ~]# docker run -d --name redis-node-7 --net host --privileged=true -v /data/redis/share/redis-node-7:/data redis:6.0.8 --cluster-enabled yes --appe
ndonly yes --port 6387e5103da9c57dcd19cdf6c453b2f085fffdc07f4bc819fd2a0b6c6017c51b242b
[root@nhk ~]# 
[root@nhk ~]# docker run -d --name redis-node-8 --net host --privileged=true -v /data/redis/share/redis-node-8:/data redis:6.0.8 --cluster-enabled yes --appe
ndonly yes --port 63881a64c62eed59ab5861d1fe24d0c2872d02a10ba61a4253bc0dd49acf1d6cdded
[root@nhk ~]# 
[root@nhk ~]# docker ps
CONTAINER ID   IMAGE         COMMAND                  CREATED          STATUS          PORTS     NAMES
1a64c62eed59   redis:6.0.8   "docker-entrypoint.s…"   4 seconds ago    Up 4 seconds              redis-node-8
e5103da9c57d   redis:6.0.8   "docker-entrypoint.s…"   23 seconds ago   Up 22 seconds             redis-node-7
a5947070df2d   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago     Up 47 minutes             redis-node-6
140116b8514c   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago     Up 47 minutes             redis-node-5
4c6a6a674ad1   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago     Up 15 minutes             redis-node-4
2c474930a34b   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago     Up 47 minutes             redis-node-3
cbe9768a92c3   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago     Up 47 minutes             redis-node-2
7363c859da61   redis:6.0.8   "docker-entrypoint.s…"   21 hours ago     Up 22 minutes             redis-node-1
[root@nhk ~]# 
```



## 进入 6387容器实例

```shell
[root@nhk ~]# docker exec -it redis-node-7 /bin/bash
root@nhk:/data# 
```



## 将新增的节点6387（空槽号）作为master加入集群

将新增的 6387 节点加入集群

使用命令     redis-cli --cluster **add-node** 宿主机ip:**6387**  宿主机ip:**6381** 

其中，6387 就是要作为master 新增的节点，6381 就是原来集群中的领路人，相当于6387拜拜6381的码头从而找到组织加入集群

```shell
# 注意，下面这条命令是进入 6387 以后执行的
root@nhk:/data# redis-cli --cluster add-node 192.168.188.150:6387  192.168.188.150:6381 
>>> Adding node 192.168.188.150:6387 to cluster 192.168.188.150:6381
>>> Performing Cluster Check (using node 192.168.188.150:6381)
M: 4c5f71512103da61902dd8dce1b0985ad9b8fc2d 192.168.188.150:6381
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
M: 740da642f3018c97fa141d73978270bea26fb545 192.168.188.150:6383
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
M: 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3 192.168.188.150:6382
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
S: 347332cdd66d6dfcc2d43bb20ed8f2d62ed79f50 192.168.188.150:6386
   slots: (0 slots) slave
   replicates 740da642f3018c97fa141d73978270bea26fb545
S: 8e8c56e02cc34a7ea8186c225727b7366e36057d 192.168.188.150:6385
   slots: (0 slots) slave
   replicates 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3
S: bbdaea50a233021cfdf43e5f8b7ca0b8ab36e1f6 192.168.188.150:6384
   slots: (0 slots) slave
   replicates 4c5f71512103da61902dd8dce1b0985ad9b8fc2d
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
>>> Send CLUSTER MEET to node 192.168.188.150:6387 to make it join the cluster.
[OK] New node added correctly.
root@nhk:/data# 
```



## 检查集群情况第一次

```shell
root@nhk:/data# redis-cli --cluster check 192.168.188.150:6381
192.168.188.150:6381 (4c5f7151...) -> 2 keys | 5461 slots | 1 slaves.
192.168.188.150:6383 (740da642...) -> 1 keys | 5461 slots | 1 slaves.
192.168.188.150:6382 (3b3e9e22...) -> 1 keys | 5462 slots | 1 slaves.
192.168.188.150:6387 (367170d0...) -> 0 keys | 0 slots | 0 slaves.
[OK] 4 keys in 4 masters.
0.00 keys per slot on average.
>>> Performing Cluster Check (using node 192.168.188.150:6381)
M: 4c5f71512103da61902dd8dce1b0985ad9b8fc2d 192.168.188.150:6381
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
M: 740da642f3018c97fa141d73978270bea26fb545 192.168.188.150:6383
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
M: 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3 192.168.188.150:6382
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
S: 347332cdd66d6dfcc2d43bb20ed8f2d62ed79f50 192.168.188.150:6386
   slots: (0 slots) slave
   replicates 740da642f3018c97fa141d73978270bea26fb545
S: 8e8c56e02cc34a7ea8186c225727b7366e36057d 192.168.188.150:6385
   slots: (0 slots) slave
   replicates 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3
S: bbdaea50a233021cfdf43e5f8b7ca0b8ab36e1f6 192.168.188.150:6384
   slots: (0 slots) slave
   replicates 4c5f71512103da61902dd8dce1b0985ad9b8fc2d
M: 367170d0514ceee5780db24d37a825122b8c0129 192.168.188.150:6387
   slots: (0 slots) master
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
root@nhk:/data# 

# 从上面信息发现，现在已经有了4个Master了，注意看 6387 中的 slots: (0 slots)  为0
```



## 重新分配槽位号

重新分配槽的命令

```
redis-cli --cluster reshard ip地址:端口号
```

```shell
root@nhk:/data# redis-cli --cluster reshard 192.168.188.150:6381
>>> Performing Cluster Check (using node 192.168.188.150:6381)
M: 4c5f71512103da61902dd8dce1b0985ad9b8fc2d 192.168.188.150:6381
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
M: 740da642f3018c97fa141d73978270bea26fb545 192.168.188.150:6383
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
M: 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3 192.168.188.150:6382
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
S: 347332cdd66d6dfcc2d43bb20ed8f2d62ed79f50 192.168.188.150:6386
   slots: (0 slots) slave
   replicates 740da642f3018c97fa141d73978270bea26fb545
S: 8e8c56e02cc34a7ea8186c225727b7366e36057d 192.168.188.150:6385
   slots: (0 slots) slave
   replicates 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3
S: bbdaea50a233021cfdf43e5f8b7ca0b8ab36e1f6 192.168.188.150:6384
   slots: (0 slots) slave
   replicates 4c5f71512103da61902dd8dce1b0985ad9b8fc2d
M: 367170d0514ceee5780db24d37a825122b8c0129 192.168.188.150:6387
   slots: (0 slots) master
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
How many slots do you want to move (from 1 to 16384)? 4096  # 16384 % 4 = 4096(4为master数量)
What is the receiving node ID? 367170d0514ceee5780db24d37a825122b8c0129 # id填 6387的
Please enter all the source node IDs.
  Type 'all' to use all the nodes as source nodes for the hash slots.
  Type 'done' once you entered all the source nodes IDs.
Source node #1: all
	...
	
    Moving slot 12285 from 740da642f3018c97fa141d73978270bea26fb545
    Moving slot 12286 from 740da642f3018c97fa141d73978270bea26fb545
    Moving slot 12287 from 740da642f3018c97fa141d73978270bea26fb545
Do you want to proceed with the proposed reshard plan (yes/no)? yes
...

root@nhk:/data#
```



## 检查集群情况第二次

```shell
root@nhk:/data# redis-cli --cluster check 192.168.188.150:6381
192.168.188.150:6381 (4c5f7151...) -> 1 keys | 4096 slots | 1 slaves.
192.168.188.150:6383 (740da642...) -> 1 keys | 4096 slots | 1 slaves.
192.168.188.150:6382 (3b3e9e22...) -> 1 keys | 4096 slots | 1 slaves.
192.168.188.150:6387 (367170d0...) -> 1 keys | 4096 slots | 0 slaves.
[OK] 4 keys in 4 masters.
0.00 keys per slot on average.
>>> Performing Cluster Check (using node 192.168.188.150:6381)
M: 4c5f71512103da61902dd8dce1b0985ad9b8fc2d 192.168.188.150:6381
   slots:[1365-5460] (4096 slots) master
   1 additional replica(s)
M: 740da642f3018c97fa141d73978270bea26fb545 192.168.188.150:6383
   slots:[12288-16383] (4096 slots) master
   1 additional replica(s)
M: 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3 192.168.188.150:6382
   slots:[6827-10922] (4096 slots) master
   1 additional replica(s)
S: 347332cdd66d6dfcc2d43bb20ed8f2d62ed79f50 192.168.188.150:6386
   slots: (0 slots) slave
   replicates 740da642f3018c97fa141d73978270bea26fb545
S: 8e8c56e02cc34a7ea8186c225727b7366e36057d 192.168.188.150:6385
   slots: (0 slots) slave
   replicates 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3
S: bbdaea50a233021cfdf43e5f8b7ca0b8ab36e1f6 192.168.188.150:6384
   slots: (0 slots) slave
   replicates 4c5f71512103da61902dd8dce1b0985ad9b8fc2d
M: 367170d0514ceee5780db24d37a825122b8c0129 192.168.188.150:6387
   slots:[0-1364],[5461-6826],[10923-12287] (4096 slots) master
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
root@nhk:/data# 

# slots:[0-1364],[5461-6826],[10923-12287] (4096 slots) master
# 我们发现，6387的哈希槽是从原来集群中三个master中分别抽出了一部分共计4096个槽
```

**为什么分配的槽不是连续的？**

重新分配成本太高了，所以是从原来的master中各自均匀分配一点出来，共计 4096个槽



## 为6387master分配从节点6388

命令如下

```shell
redis-cli --cluster add-node ip:新slave端口  ip:新master端口 --cluster-slave --cluster-master-id 新主机节点ID 
```

```shell
root@nhk:/data# redis-cli --cluster add-node 192.168.188.150:6388  192.168.188.150:6387 --cluster-slave --cluster-master-id 367170d0514ceee5780db24d37a825122 # 注意，这里是6787的编号
b8c0129>>> Adding node 192.168.188.150:6388 to cluster 192.168.188.150:6387
>>> Performing Cluster Check (using node 192.168.188.150:6387)
M: 367170d0514ceee5780db24d37a825122b8c0129 192.168.188.150:6387
   slots:[0-1364],[5461-6826],[10923-12287] (4096 slots) master
M: 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3 192.168.188.150:6382
   slots:[6827-10922] (4096 slots) master
   1 additional replica(s)
S: 8e8c56e02cc34a7ea8186c225727b7366e36057d 192.168.188.150:6385
   slots: (0 slots) slave
   replicates 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3
M: 740da642f3018c97fa141d73978270bea26fb545 192.168.188.150:6383
   slots:[12288-16383] (4096 slots) master
   1 additional replica(s)
M: 4c5f71512103da61902dd8dce1b0985ad9b8fc2d 192.168.188.150:6381
   slots:[1365-5460] (4096 slots) master
   1 additional replica(s)
S: 347332cdd66d6dfcc2d43bb20ed8f2d62ed79f50 192.168.188.150:6386
   slots: (0 slots) slave
   replicates 740da642f3018c97fa141d73978270bea26fb545
S: bbdaea50a233021cfdf43e5f8b7ca0b8ab36e1f6 192.168.188.150:6384
   slots: (0 slots) slave
   replicates 4c5f71512103da61902dd8dce1b0985ad9b8fc2d
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
>>> Send CLUSTER MEET to node 192.168.188.150:6388 to make it join the cluster.
Waiting for the cluster to join

>>> Configure node as replica of 192.168.188.150:6387.
[OK] New node added correctly.
root@nhk:/data# 
```



## 检查集群情况第一次

```shell
root@nhk:/data#  redis-cli --cluster check 192.168.188.150:6382
192.168.188.150:6382 (3b3e9e22...) -> 1 keys | 4096 slots | 1 slaves.
192.168.188.150:6387 (367170d0...) -> 1 keys | 4096 slots | 1 slaves.
192.168.188.150:6381 (4c5f7151...) -> 1 keys | 4096 slots | 1 slaves.
192.168.188.150:6383 (740da642...) -> 1 keys | 4096 slots | 1 slaves.
[OK] 4 keys in 4 masters.
0.00 keys per slot on average.
>>> Performing Cluster Check (using node 192.168.188.150:6382)
M: 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3 192.168.188.150:6382
   slots:[6827-10922] (4096 slots) master
   1 additional replica(s)
S: 73d2a57ad602bc338c782217c7484ea31b760124 192.168.188.150:6388
   slots: (0 slots) slave
   replicates 367170d0514ceee5780db24d37a825122b8c0129
M: 367170d0514ceee5780db24d37a825122b8c0129 192.168.188.150:6387
   slots:[0-1364],[5461-6826],[10923-12287] (4096 slots) master
   1 additional replica(s)
M: 4c5f71512103da61902dd8dce1b0985ad9b8fc2d 192.168.188.150:6381
   slots:[1365-5460] (4096 slots) master
   1 additional replica(s)
S: bbdaea50a233021cfdf43e5f8b7ca0b8ab36e1f6 192.168.188.150:6384
   slots: (0 slots) slave
   replicates 4c5f71512103da61902dd8dce1b0985ad9b8fc2d
S: 8e8c56e02cc34a7ea8186c225727b7366e36057d 192.168.188.150:6385
   slots: (0 slots) slave
   replicates 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3
M: 740da642f3018c97fa141d73978270bea26fb545 192.168.188.150:6383
   slots:[12288-16383] (4096 slots) master
   1 additional replica(s)
S: 347332cdd66d6dfcc2d43bb20ed8f2d62ed79f50 192.168.188.150:6386
   slots: (0 slots) slave
   replicates 740da642f3018c97fa141d73978270bea26fb545
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
root@nhk:/data# 
```

至此，四主四从扩容完成



# 主从缩容

## 检查集群情况，并获取6388的节点ID

```shell
root@nhk:/data# redis-cli --cluster check 192.168.188.150:6382
192.168.188.150:6382 (3b3e9e22...) -> 1 keys | 4096 slots | 1 slaves.
192.168.188.150:6387 (367170d0...) -> 1 keys | 4096 slots | 1 slaves.
192.168.188.150:6381 (4c5f7151...) -> 1 keys | 4096 slots | 1 slaves.
192.168.188.150:6383 (740da642...) -> 1 keys | 4096 slots | 1 slaves.
[OK] 4 keys in 4 masters.
0.00 keys per slot on average.
>>> Performing Cluster Check (using node 192.168.188.150:6382)
M: 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3 192.168.188.150:6382
   slots:[6827-10922] (4096 slots) master
   1 additional replica(s)
S: 73d2a57ad602bc338c782217c7484ea31b760124 192.168.188.150:6388
   slots: (0 slots) slave
   replicates 367170d0514ceee5780db24d37a825122b8c0129
M: 367170d0514ceee5780db24d37a825122b8c0129 192.168.188.150:6387
   slots:[0-1364],[5461-6826],[10923-12287] (4096 slots) master
   1 additional replica(s)
M: 4c5f71512103da61902dd8dce1b0985ad9b8fc2d 192.168.188.150:6381
   slots:[1365-5460] (4096 slots) master
   1 additional replica(s)
S: bbdaea50a233021cfdf43e5f8b7ca0b8ab36e1f6 192.168.188.150:6384
   slots: (0 slots) slave
   replicates 4c5f71512103da61902dd8dce1b0985ad9b8fc2d
S: 8e8c56e02cc34a7ea8186c225727b7366e36057d 192.168.188.150:6385
   slots: (0 slots) slave
   replicates 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3
M: 740da642f3018c97fa141d73978270bea26fb545 192.168.188.150:6383
   slots:[12288-16383] (4096 slots) master
   1 additional replica(s)
S: 347332cdd66d6dfcc2d43bb20ed8f2d62ed79f50 192.168.188.150:6386
   slots: (0 slots) slave
   replicates 740da642f3018c97fa141d73978270bea26fb545
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
root@nhk:/data# 

# 由上可知 6388 编号为 73d2a57ad602bc338c782217c7484ea31b760124
```



## 将从节点6388 删除

删除节点命令

```shell
redis-cli --cluster del-node ip:从节点端口 从节点ID
```

```shell
root@nhk:/data# redis-cli --cluster del-node 192.168.188.150:6388 73d2a57ad602bc338c782217c7484ea31b760124
>>> Removing node 73d2a57ad602bc338c782217c7484ea31b760124 from cluster 192.168.188.150:6388
>>> Sending CLUSTER FORGET messages to the cluster...
>>> Sending CLUSTER RESET SOFT to the deleted node.
root@nhk:/data# 

# 查看集群情况
root@nhk:/data# redis-cli --cluster check 192.168.188.150:6382
192.168.188.150:6382 (3b3e9e22...) -> 1 keys | 4096 slots | 1 slaves.
192.168.188.150:6387 (367170d0...) -> 1 keys | 4096 slots | 0 slaves.  # slave 为0了
192.168.188.150:6381 (4c5f7151...) -> 1 keys | 4096 slots | 1 slaves.
192.168.188.150:6383 (740da642...) -> 1 keys | 4096 slots | 1 slaves.
[OK] 4 keys in 4 masters.
....

```



## 将 6387槽号清空，重新分配，为了简单我们将槽都给6381

```shell
root@nhk:/data# redis-cli --cluster reshard 192.168.188.150:6381
>>> Performing Cluster Check (using node 192.168.188.150:6381)
M: 4c5f71512103da61902dd8dce1b0985ad9b8fc2d 192.168.188.150:6381
   slots:[1365-5460] (4096 slots) master
   1 additional replica(s)
M: 740da642f3018c97fa141d73978270bea26fb545 192.168.188.150:6383
   slots:[12288-16383] (4096 slots) master
   1 additional replica(s)
M: 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3 192.168.188.150:6382
   slots:[6827-10922] (4096 slots) master
   1 additional replica(s)
S: 347332cdd66d6dfcc2d43bb20ed8f2d62ed79f50 192.168.188.150:6386
   slots: (0 slots) slave
   replicates 740da642f3018c97fa141d73978270bea26fb545
S: 8e8c56e02cc34a7ea8186c225727b7366e36057d 192.168.188.150:6385
   slots: (0 slots) slave
   replicates 3b3e9e22edfa6c40fa51cd9c06b9f754c516a2d3
S: bbdaea50a233021cfdf43e5f8b7ca0b8ab36e1f6 192.168.188.150:6384
   slots: (0 slots) slave
   replicates 4c5f71512103da61902dd8dce1b0985ad9b8fc2d
M: 367170d0514ceee5780db24d37a825122b8c0129 192.168.188.150:6387
   slots:[0-1364],[5461-6826],[10923-12287] (4096 slots) master
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
How many slots do you want to move (from 1 to 16384)? 4096
What is the receiving node ID? 4c5f71512103da61902dd8dce1b0985ad9b8fc2d  # 接收槽的ID（这里我们让6381接收）
Please enter all the source node IDs.
  Type 'all' to use all the nodes as source nodes for the hash slots.
  Type 'done' once you entered all the source nodes IDs.
Source node #1: 367170d0514ceee5780db24d37a825122b8c0129  # 将槽让出的ID（这里为6387的ID）
Source node #2: done
...

Do you want to proceed with the proposed reshard plan (yes/no)? yes 
...

```



## 再次检查集群情况

```shell
root@nhk:/data# redis-cli --cluster check 192.168.188.150:6382
192.168.188.150:6382 (3b3e9e22...) -> 1 keys | 4096 slots | 1 slaves.
192.168.188.150:6387 (367170d0...) -> 0 keys | 0 slots 	  |  0 slaves.  
192.168.188.150:6381 (4c5f7151...) -> 2 keys | 8192 slots | 1 slaves.  	# 这里有8192个槽了
192.168.188.150:6383 (740da642...) -> 1 keys | 4096 slots | 1 slaves.
[OK] 4 keys in 4 masters.
...
```



## 将 6387 删除

删除命令

```shell
redis-cli --cluster del-node ip:从节点端口 从节点ID
```

```shell
root@nhk:/data# redis-cli --cluster del-node 192.168.188.150:6387 367170d0514ceee5780db24d37a825122b8c0129
>>> Removing node 367170d0514ceee5780db24d37a825122b8c0129 from cluster 192.168.188.150:6387
>>> Sending CLUSTER FORGET messages to the cluster...
>>> Sending CLUSTER RESET SOFT to the deleted node.
root@nhk:/data# 
```

