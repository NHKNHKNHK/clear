# Docker容器固定IP

## Docker的网络类型

Docker中，容器的网络有四种模式，分别是None、Bridge、Container和Host。

### None类型网络

-   None类型的网络，即**没有网络**，Docker容器不会设置容器内网络的任何信息，不会对网络进行任何配置，但是我们自己可以给该容器添加配置，给予其网络环境。

-   我们有时需要为容器网络分配一个静态的IP，使Docker容器处于和物理机同一个网段，这时我们可以先使用None类型的网络，然后自己选择网络信息。

-   在创建Docker容器时，我们可以使用**–net=none**来指定Docker容器处于None类型的网络中。

-   简单来说，启动容器时，可以**通过–net = none 使 docker容器不会分配局域网ip**

    
### Bridge类型网络

-   Bridge类型的网络是**Docker容器默认的网络类型**，在这种模式下，Docker会为容器虚拟出一个网络，所有的Container容器都会分配一个处于这个网络的IP地址，不同的Container之间可以互相通信。
-   简单来说，**每次 docker容器重启时会按照顺序获取对应ip地址，这就导致容器每次重启，ip 都发生变化**，生产环境中不适用

Docker容器的Brdige虚拟网络如下所示：

```shell
[root@nhk ~]# ifconfig 
docker0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255
       	....   

ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.188.150  netmask 255.255.255.0  broadcast 192.168.188.255
       	....

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        ...

virbr0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
   		...

[root@nhk ~]# 

# 其中  172.17.0.1  即为Docker容器的Bridge虚拟网络
#	   192.168.188.150 为 我们CentOS的IP地址
```

:::warning 注意
​**Docker的 “Bridge” 与 VmWare的 “Bridge” 根本不是一个类型的网络！** 实际上，Docker中的 “Bridge” 更类似于 VmWare中 的 Nat类型的网络模式。并且，Docker容器对外网（互联网）的访问也是基于物理机的Nat机制实现的。在创建Docker容器时，我们可以使用**–net=bridge指定Docker容器处于Bridge类型的网络**中。

​**Bridge 是Docker的默认网络类型，因此，即使我们不使用`–net=bridge`参数，该Docker容器的网络类型依然是Brdige**
:::

### Container类型网络

-   在 Container 类型的网络中，多个Docker容器共享网络设备。我们在一个Docker容器运行之后，再运行其他的Docker容器时，可以使该容器与之前已经运行的Docker容器共享网络，即拥有同样的IP地址、网卡设备。
-   两个容器之间可以通过环回地址网卡进行通信，并且在文件系统、进程表等方面实现隔离。处于同一个Container网络中的容器，**对于端口的占用机制是先来先占用的模式**，哪个容器占用该端口，该容器就可以使用该端口。
-   在创建Docker容器时，我们可以使用 **–net=container** 指定Docker容器处于Container类型的网络中。
    

### Host类型网络

-   与 Container 类型的网络类似，在Host类型的网络中，**Docker容器于物理机共享网络，拥有物理机的IP地址和网卡信息。**同样的，在 Host 类型的网络模式中，Docker容器与物理机在文件系统、进程等方面是隔离的。
-   例如，假如一个开启 Web80 端口服务的Docker容器处于Host类型的网络中（前提是该物理机没有先占用80端口），那么访问该容器只需要访问物理机 IP地址即可。
-   在创建Docker容器时，我们可以使用 **–net=host** 指定Docker容器处于Host类型的网络中。
-   简单来说，**docker容器的网络会附属在主机上，两者是互通的**。

## 创建固定IP

### 1）指定网段

创建自定义网络类型，并且指定网段

```shell
[root@nhk ~]# sudo docker network create --subnet=172.18.0.0/16 shareWithDocker
17ae739a37ed60c344c569934324b2c55904bd8f75302409fecb3b503cca1515
```

通过 **docker network ls** 可以查看到网络类型中多了一个staticnet

```
[root@nhk ~]# docker network ls
NETWORK ID     NAME              DRIVER    SCOPE
63a4d1a8683b   bridge            bridge    local
079c5936358a   host              host      local
b10eb48a66f7   none              null      local
17ae739a37ed   shareWithDocker   bridge    local  # 刚刚创建的
```

### 2）使用创建的网段

使用新的网络类型创建并启动容器

```shell
[root@nhk ~]# sudo docker run -it --name test2 --net shareWithDocker --ip 127.18.0.2 centos:centos7 /bin/bash

```

### 3）查看容器ip

```shell
docker inspect <containtor_id>
```

### 测试

将容器停止，并重新启懂，发现容器ip并未发生改变，测试成功。

```sh
[root@nhk ~]# sudo docker network --help
```

## docker network 相关命令

使用方式

```sh
dokcer network [creater/ls ....] ....
```

```shell
Manage networks

Commands: 
  connect     Connect a container to a network  将容器连接到网络
  create      Create a network		创建网络
  disconnect  Disconnect a container from a network	 断开容器与网络的连接
  inspect     Display detailed information on one or more networks显示一个或多个网络的详细信息
  ls          List networks 	
  prune       Remove all unused networks   删除所有未使用的网络
  rm          Remove one or more networks  删除一个或多个网络
```

具体的命令使用使按需查询

```sh
# 查询命令
docker network <命令> --help
```
