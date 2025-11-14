### man获取帮助信息

基本语法

```
man [命令或配置文件]      
```

```shell
[root@basenode ~]# man yum  # 使用man手册查询命令用法（外置命令）
```

man查看内置命令

```
man -f 命令
```

查看某外部命令的帮助信息

```shell
命令 --help 
# 如 
[root@basenode ~]# yum --help  # 使用--help查看外置命令 
```

显示说明

| 信息        | 功能                     |
| ----------- | ------------------------ |
| NAME        | 命令的名称和单行描述     |
| SYNOPSIS    | 怎样使用命令             |
| DESCRIPTION | 命令功能的深入讨论       |
| EXAMPLES    | 怎样使用命令的例子       |
| SEE ALSO    | 相关主题（通常是手册页） |

### help获得shell内置命令的帮助信息

一部分基础功能的系统命令是直接内嵌在shell中，系统加载启动之后会随着shell一起被加载，常驻系统内存中。这部分命令被称为“内置（built-in）命令”；相应的的其他命令被称为“外部命令”

基本语法

```
help 命令    # 获取shell内置命令的帮助信息
```

 如：cd、exit、history等都是内置命令，他们是直接写在bash源码里的

### 查看命令类型

基本语法

```
type 命令
```

演示

```shell
[root@basenode ~]# type cd
cd is a shell builtin
[root@basenode ~]# type ls
ls is aliased to `ls --color=auto'
[root@basenode ~]# type useradd
useradd is /usr/sbin/useradd

```

### 常用快捷键

| 常用快捷键 | 功能                               |
| ---------- | ---------------------------------- |
| ctrl+c     | 停止进程                           |
| ctrl+l     | 清屏，等同于clear；彻底清屏是reset |
| tab        | 提示、补全                         |
| 上下键     | 查找使用过的命令                   |



### 修改网卡

```shell
vim /etc/sysconfig/network-scripts/ifcfg-ens33
```

配置静态ip

```shell
BOOTPROTO=static

ONBOOT=yes
IPADDR=192.168.188.100 # IP
NETMASK=255.255.255.0  
GATEWAY=192.168.188.2  # 网关
DNS1=192.168.188.2   # 域名服务器（可以填网关，也可填电信服务器114.114.114.114）

```

### **重启网络服务**

```shell
service network restart  # centos6
# 或
systemctl restart network.service  # centos7
```

**修改IP地址后的常见问题**

1）物理机能ping通虚拟机，但虚拟机ping不通物理机，一般为物理机防火墙问题，关闭物理机防火墙即可

2）虚拟机能ping通物理机，但虚拟机ping不通外网，一般是DNS设置错误

3）虚拟机ping www.baidu.com，显示域名服务未知，一般查看gateway网卡和dns设置是否正确

4）如果上述设置完还不行，需要关闭NetworkManager服务

```shell
systemctl stop NetworkManager  # 关闭
systemctl disable NetworkManager  # 禁用
```

5）如果发现systemctl status network 有问题，需要检查ifcfg-ens33

**总结**

centos7有两个网络服务，分别是**network和NetWorkManager**，只保留其中一个即可拥有上网服务

```shell
systemctl start NetworkManager  # 启动NetworkManager
systemctl start network    # 启动network
```



### **修改主机名**

```shell
vim /etc/hostname
```

查询一些跟主机名有关的信息

```shell
hostnamectl   # centos7
```

修改主机名（不要重启）**centos7**

```shell
hostnamectl set-hostname 主机名
```

注意：这种方式修改主机名以后，不需要进行重启即可生效

### **hosts映射**

添加主机名与IP地址的映射

```shell
vim /etc/hosts
```

### 系统管理常用

**Linux中进程和服务**

计算机中，一个正在进行的程序或命令，被叫做“进程”（process）

启动之后一直存在、常驻内存的进程，一般被叫做“服务”（service）

在Linux中，可以简答的将守护进程理解为服务

#### service服务管理

**centos6基本语法**

```shell
service 服务名 start|stop|restart|status
```

查看服务的方法

```shell
ls /etc/init.d/服务名    # 发现只有两个服务保留在service
```

```shell
root@basenode ~]# ls /etc/init.d
functions  netconsole  network  README
```

**centos7基本语法**

```shell
systemctl start|stop|restart|staut 服务名
```

查看服务的方法

```
ls /usr/lib/systemd/system
```

#### 系统运行级别

运行级别：

开机 ==>  BIOS ==> /boot ==> init进程 ==> 运行级别 ==> 运行级别对应的服务

查看默认的运行级别

```shell
vi /etc/inittab
```

Linux系统的7种运行级别（runlevel）**常用的是级别3和5**

- 运行级别0：系统停机状态，系统默认运行级别不能设为0，否则不能正常启动
- 运行级别1：单用户工作状态，root权限，用于系统维护，禁止远程登录（该级别有点像window的安全模式）
- 运行级别2：多用户状态（没有NFS），不支持网络
- 运行级别3：完全的多用户状态（有NFS），登录后进入控制台命令行模式
- 运行级别4：系统未使用，保留
- 运行级别5：X11控制台，登录后进入图形GUI模式
- 运行级别6：系统正常关闭并重启，默认运行级别不能设为6，否则不能正常启动



**CentOS7的运行级别简化为**：

multi-user.target  		等价与原运行级别3（多用户有网，无图形化界面）

graphical.target 		   等价与原运行级别3（多用户有网，无图形化界面）

**查看当前运行级别**

```shell
systemctl get-default
```

**修改当前运行级别**

```shell
systemctl set-default TARGET.target
# 其中TARGET.target 取 multi-user.target 或 graphical.target 
```

切换运行级别的快捷键

RedHat

- ​	ctrl+alt+f1  转为GUI界面

- ​	ctrl+alt+f2~f6  转为shell

Ubutu

- ctrl+alt+f1~f6  转为GUI界面
- ctrl+alt+f7       转为shell

#### 防火墙

**查看防火墙状态**

```shell
service firewalld status  # centos6 不推荐

systemctl status firewalld
systemctl status firewalld.service    # .service 加与不加影响不大
```

**关闭防火墙**

```shell
systemctl stop firewalld
systemctl disable firewalld  # 关闭开机自启
```

#### 关机重启命令

在Linux领域内绝大多数服务器上，很少遇到关机情况，毕竟服务器上跑服务是不能停的，除非特殊情况才会不得已关机

基本语法

```shell
sync					# 将数据由内存同步到硬盘
halt					# 停机，关闭系统，但不断电
poweroff				# 关机断电
reboot					# 重启，等同于 shutdown -r now
shutdown [选项] 时间
	# 选项
		-H 相当于halt，停机
        -h或 -P 关机，相当于poweroff
        -r 重启，相当于reboot
    # 时间
    	now 即可
    	时间 等待多久后关机（单位为分钟）
```

​	Linux系统为了提高磁盘的读写效率，对磁盘采取了“预读迟写”操作方式。当用户保存文件时，Linux核心并不一定立刻将保存数据写入到物理磁盘中，而是将数据保存在缓冲区中，等待缓存区满时再写入磁盘，这种方式可以极大提高磁盘写入数据的效率。但是，也带来了安全隐患，如果数据还未写入磁盘时，系统掉电或则出现其他严重问题，则会导致数据丢失，使用sync指令可以立即将缓冲区的数据写入到磁盘

其中shutdown操作默认包含了sync同步，只有在同步完以后才会关机

演示

```shell
[root@basenode ~]# shutdown		# 默认计划在1分钟后关机
[root@basenode ~]# shutdown -c  # 取消关机计划
[root@basenode ~]# shutdown 3   # 计划在3分钟后关机
[root@basenode ~]# shutdown -c
[root@basenode ~]# shutdown 14:30  # 计划在14:30关机
[root@basenode ~]# shutdown -c

[root@basenode ~]# shutdown -h 1 "我将在一分钟后关机"    # 计划在1分钟后关机，并显示“”中的内容

[root@basenode ~]# shutdown -h now   # 关机（等同于poweroff）

[root@basenode ~]# shutdown -r now   # 重启（等同于reboot）
```



### **scp（secure copy）安全拷贝**

scp可以实现服务器与服务器之间的数据拷贝。（from server1 to server2）

基本语法

```shell
scp 	-r    $pdir/$fname			$user@$host:$pdir/$fname
命令 	  递归    要拷贝的文件的路径/路径	目的地用户@主机:目的地路径/名称
```

演示

```shell
# 现在三台服务器kk01、kk02、kk03
# ssh免密 kk01->kk01、kk02、kk03

# 在kk01，将kk01的指定目录复制到kk02
[root@kk01 software]# scp -r /opt/software/ root@kk01:/opt/software/

# 在kk02，将kk01的指定目录复制到kk03  因为没有ssh免密，因此需要知道kk01、kk02的相应用户的密码
[root@kk02 ~]# scp -r root@kk01:/opt/software/ root@kk03:/opt/software/

# 在kk03，将kk01的指定目录复制到kk03  因为没有ssh免密，因此需要知道kk01的密码
[root@kk03 ~]# scp -r root@kk01:opt/software/ root@kk03:/opt/software/

```

### rsync远程同步命令

rsync主要用于**备份和镜像**。具有速度快、避免复制相同内容和支持符号链接的优点。

rsync和scp区别：

​	用rsync做文件的复制要比scp的速度快，**rsync只对差异文件做更新**。scp是把所有文件都复制过去。

基本语法

```shell
rsync    -av       $pdir/$fname             $user@$host:$pdir/$fname
命令   选项参数   要拷贝的文件路径/名称   		目的地用户@主机:目的地路径/名称
```

选项参数说明

| 参数 | 说明         |
| ---- | ------------ |
| -a   | 归档拷贝     |
| -v   | 显示复制过程 |

演示

```shell
[root@kk01 software]# rsync -r /opt/software/hadoop-3.2.2/conf root@kk01:/opt/software/hadoop-3.2.2/conf
```



