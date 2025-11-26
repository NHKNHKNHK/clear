# 集群JDK安装

## 机器部署

### 集群规划

我们准备三台服务器kk01、kk02、kk03，内存4G、硬盘50G、处理器4核心2内核（总8）

kk01使用 192.168.188.128

kk02使用 192.168.188.129

kk03使用 192.168.188.130

### 模板机准备

我们先创建一台作为模板机，后续的两台采用完整克隆的方式

1）我们配置了模块机kk01的主机名为 kk01

2）配置了root用户的密码123456、创建了普通用户nhk、密码123456

### 使用vim 配置了模板机ip地址、网关、DNS等信息

```shell
# 2.配置静态ip  （注意，我们这里刚开始需要使用root用户来修改）
[nhk@kk01 ~]$ su root
Password: 
[root@kk01 nhk]# vim /etc/sysconfig/network-scripts/ifcfg-ens33
# 做出如下修改

BOOTPROTO=static  # 改为静态
# 末尾添加如下内容
IPADDR=192.168.188.128
GATEWAY=192.168.188.2
NETMASK=255.255.255.0
DNS1=192.168.188.2
```

```shell
# 重启网卡
[root@kk01 nhk]# systemctl restart network.service
# 查看当前ip地址
[root@kk01 nhk]# ifconfig
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.188.128  netmask 255.255.255.0  broadcast 192.168.188.255
        inet6 fe80::517f:78e:56fc:d924  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:61:40:47  txqueuelen 1000  (Ethernet)
...
```

### 关闭模板机 kk01的防火墙

```shell
[root@kk01 nhk]# systemctl stop firewalld.service  # 关闭当前防火墙
[root@kk01 nhk]# systemctl disable firewalld.service  # 关闭防火墙开机自启动
Removed symlink /etc/systemd/system/multi-user.target.wants/firewalld.service.
Removed symlink /etc/systemd/system/dbus-org.fedoraproject.FirewallD1.service.

# 查看防火墙状态，看到 inactive (dead) 则证明防火墙成功关闭
[root@kk01 nhk]# systemctl status firewalld.service
● firewalld.service - firewalld - dynamic firewall daemon
   Loaded: loaded (/usr/lib/systemd/system/firewalld.service; disabled; vendor preset: enabled)
   Active: inactive (dead)
....
```

### 修改模板机kk01主机名

```shell
# 修改主机名
[root@kk01 nhk]# vim /etc/hostname   # 这种修改方式需要重启系统，才生效

[root@kk01 nhk]# cat /etc/hostname 
kk01
```

### 修改hosts文件

```shell
[root@kk01 nhk]# vim /etc/hosts

192.168.188.128 kk01
192.168.188.129 kk02
192.168.188.130 kk03
```

### 配置普通用户（nhk）具有root权限

修改/etc/sudoers文件，在100多行左右，在%wheel下面添加一行内容，如下操作所示

```shell
# 配置普通用户(nhk)具有root权限，方便后期加sudo执行root权限的命令
# 注意：修改这个文件，即使是root用户也需要 :wq! 强制保存退出
[root@kk01 nhk]# vim /etc/sudoers
# 在%wheel这行下面添加一行 (大概是在100行左右位置)


## Allow root to run any commands anywhere 
root    ALL=(ALL)       ALL

## Allows members of the 'sys' group to run networking, software, 
## service management apps and more.
# %sys ALL = NETWORKING, SOFTWARE, SERVICES, STORAGE, DELEGATING, PROCESSES, LOCATE, DRIVERS

## Allows people in group wheel to run all commands
%wheel  ALL=(ALL)       ALL

nhk 	ALL=(ALL) 	NOPASSWD: ALL 
## Same thing without a password
# %wheel        ALL=(ALL)       NOPASSWD: ALL
```

::: warning 注意

`nhk ALL=(ALL)	 NOPASSWD: ALL` 这一行不要直接放到root行下面，因为所有用户都属于wheel组，你先配置了nhk具有免密功能，但是程序执行到%wheel行时，该功能又被覆盖回需要密码。所以nhk要放到%wheel这行下面。

:::

### 创建统一工作目录

```shell
[root@kk01 nhk]# mkdir -p /opt/software/  		 # 软件安装目录、安装包存放目录
[root@kk01 nhk]# mkdir -p /opt/data/			 # 数据存储路径
[root@kk01 nhk]# 
[root@kk01 nhk]# ll /opt
total 0
drwxr-xr-x. 2 root root 6 Jun 16 15:51 data
drwxr-xr-x. 2 root root 6 Oct 31  2018 rh
drwxr-xr-x. 2 root root 6 Jun 16 15:51 software


# 修改文件夹所有者和所属组 （如果是使用root用户搭建集群可以忽略）
[root@kk01 nhk]# chown nhk:nhk /opt/software
[root@kk01 nhk]# chown nhk:nhk /opt/data
[root@kk01 nhk]# ll /opt
total 0
drwxr-xr-x. 2 nhk  nhk  6 Jun 16 15:51 data
drwxr-xr-x. 2 root root 6 Oct 31  2018 rh
drwxr-xr-x. 2 nhk  nhk  6 Jun 16 15:51 software
```


### 克隆出其他机器

上述配置完以后，将模板机kk01关机，使用VMware的完整克隆方式，克隆出 kk02、kk03，并依次开机，修改kk02、kk03上的ip地址

kk02

```shell
# 修改ip
[nhk@kk01 ~]$ sudo vim /etc/sysconfig/network-scripts/ifcfg-ens33
做出如下修改

IPADDR=192.168.188.129

# 重启网卡服务
[nhk@kk01 ~]$ sudo systemctl restart network
[nhk@kk01 ~]$ ifconfig		# 查看ip
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.188.129  netmask 255.255.255.0  broadcast 192.168.188.255
...

# 修改主机名
[nhk@kk01 ~]$ sudo hostnamectl set-hostname kk02		# 这种方式修改主机名无需重启即可生效
[nhk@kk01 ~]$ hostname		# [nhk@kk01 ~]$ 这里还显示kk01是这个bash的原因，重新打开bash即可
kk02
```

kk03

```shell
# 修改ip
[nhk@kk01 ~]$ sudo vim /etc/sysconfig/network-scripts/ifcfg-ens33
做出如下修改

IPADDR=192.168.188.130

# 重启网卡服务
[nhk@kk01 ~]$ sudo systemctl restart network
[nhk@kk01 ~]$ ifconfig		# 查看ip
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.188.130  netmask 255.255.255.0  broadcast 192.168.188.255
...

# 修改主机名
[nhk@kk01 ~]$ sudo hostnamectl set-hostname kk03		# 这种方式修改主机名无需重启即可生效
[nhk@kk01 ~]$ hostname		# [nhk@kk01 ~]$ 这里还显示kk01是这个bash的原因，重新打开bash即可
kk03
```

此致，3台机器准备完成

## 集群安装JDK

### 1）删除Linux系统自带JDK

如果安装的是最小化版本的Linux，则不需要执行此操作

```shell
# 需要在所有节点删除（我们使用的是nhk用户，必须加sudo）
[nhk@kk01 .ssh]$ sudo rpm -qa | grep -i java
java-1.8.0-openjdk-1.8.0.262.b10-1.el7.x86_64
javapackages-tools-3.4.1-11.el7.noarch
tzdata-java-2020a-1.el7.noarch
python-javapackages-3.4.1-11.el7.noarch
java-1.8.0-openjdk-headless-1.8.0.262.b10-1.el7.x86_64

[nhk@kk01 .ssh]$ sudo rpm -qa | grep -i java | xargs -n1 sudo rpm -e --nodeps

# 在kk02上删除
[nhk@kk02 .ssh]$ sudo rpm -qa | grep -i java | xargs -n1 sudo rpm -e --nodeps
# 在kk03上删除
[nhk@kk03 ~]$ sudo rpm -qa | grep -i java | xargs -n1 sudo rpm -e --nodeps


# 参数说明(rpm -qa | grep -i java | xargs -n1 rpm -e --nodeps)
（1）rpm -qa：表示查询所有已经安装的软件包
（2）grep -i：表示过滤时不区分大小写
（3）xargs -n1：表示一次获取上次执行结果的一个值
	xargs 将 sudo rpm -qa | grep -i java 的结果传递给 sudo rpm -e --nodeps
	-n1 表示将 sudo rpm -qa | grep -i java 的结果传递 一个一个传递给 sudo rpm -e --nodeps
（4）rpm -e --nodeps：表示卸载软件
```

### 2）上传压缩包

将 jdk压缩包 kk01 的 /opt/software 文件夹下面

```shell
[nhk@kk01 software]$ pwd
/opt/software
[nhk@kk01 software]$ rz

[nhk@kk01 software]$ ll
total 185340
-rw-r--r--. 1 nhk nhk 189784266 Dec 25  2017 jdk-8u152-linux-x64.tar.gz
```

### 3）解压压缩包

解压 jdk 到指定目录 /opt/software

```shell
[nhk@kk01 software]$ tar -zxvf jdk-8u152-linux-x64.tar.gz -C /opt/software

[nhk@kk01 software]$ ll
total 185340
drwxr-xr-x. 8 nhk nhk       255 Sep 14  2017 jdk1.8.0_152
-rw-r--r--. 1 nhk nhk 189784266 Dec 25  2017 jdk-8u152-linux-x64.tar.gz	
```

### 4）配置普通用户环境变量

```shell
[nhk@kk01 software]$ sudo vim /etc/profile.d/my_env.sh
```

添加如下内容

```shell
# 配置JDK环境
export JAVA_HOME=/opt/software/jdk1.8.0_152				# 导入环境变量
export PATH=$PATH:$JAVA_HOME/bin						# 将环境变量拼接到PATH中
```

让环境变量生效（重新载入环境变量）

```shell
[nhk@kk01 software]$ source /etc/profile.d/my_env.sh 
```

### 5）测试jdk是否安装成功

能看到jdk相关的版本信息，则说明jdk安装成功

```shell
[nhk@kk01 software]$ java -version
java version "1.8.0_152"
Java(TM) SE Runtime Environment (build 1.8.0_152-b16)
Java HotSpot(TM) 64-Bit Server VM (build 25.152-b16, mixed mode)
```

### 6）分发JDK、分发环境

使用我们自定义的分发脚本 xsync

```shell
# 分发jdk
[nhk@kk01 software]$ xsync /opt/software/jdk1.8.0_152/

# 普通用户使用 xsync 脚本分发环境变量时，必须加上脚本路径
#（分发环境时，需要使用sudo，因为/etc目录只有root用户才能操作，并且使用xsync脚本还需要加上绝对路径，因为我们使用sudo命令将权限切换到了root目录下，而root目录下没有xsync脚本）
# 如果不加会报错 failed: Permission denied (13)
[nhk@kk01 software]$ sudo /home/nhk/bin/xsync /etc/profile.d/my_env.sh 
```

在集群的其他机器（kk02、kk03）刷新环境变量

```shell
[nhk@kk02 ~]$ source /etc/profile.d/my_env.sh 
[nhk@kk03 ~]$ source /etc/profile.d/my_env.sh 
```

如果我们没有自定义分发脚本，也可以使用 scp 或 rsync 命令代替，如下

```shell
scp -r /opt/software/jdk1.8.0_152/ kk02/opt/software/
scp -r /opt/software/jdk1.8.0_152/ kk03/opt/software/
```



### 7）注意事项

​	无论是基于root用户，还是基于普通用户nhk，大体上的命令都是相似的，只是在某些情况下普通用户权限不够，需要加上sudo来暂时提升权限



### 8）环境变量说明

​	Linux的环境变量可在多个文件中配置，如/etc/profile，/etc/profile.d/*.sh，~/.bashrc，~/.bash_profile等，下面说明上述几个文件之间的关系和区别。

​	bash的运行模式可分为 **login shell** 和 **non-login shell** 。

​	例如，我们通过终端，输入用户名、密码，登录系统之后，得到就是一个login shell。而当我们执行以下命令**ssh kk01 command，在kk01执行command的就是一个non-login shell。**

### 登录 shell 与 非登录 shell 区别

登录shell

```
环境变量加载顺序
/etc/profile	~/.bash_profile		~/.bashrc ==> /etc/bashrc ==> /etc/profile.d/*.sh	
```

非登录shell

```
环境变量加载顺序
									~/.bashrc ==> /etc/bashrc ==> /etc/profile.d/*.sh	
```

注意：

​	**如果把环境变量只放到 /etc/profile 中，non-login shell 模式会获取不到环境变量**

​	这两种shell的主要区别在于，它们启动时会加载不同的配置文件，**login shell**启动时会加载**/etc/profile，~/.bash_profile，~/.bashrc**。**non-login shell**启动时会加载**~/.bashrc**。

而在加载~/.bashrc（实际是~/.bashrc中加载的/etc/bashrc）或/etc/profile时，都会执行如下代码片段，

```shell
[nhk@kk03 etc]$ pwd
/etc
[nhk@kk03 etc]$ vim /etc/bashrc
```

```shell
  # Only display echos from profile.d scripts if we are no login shell
    # and interactive - otherwise just process them to set envvars
    for i in /etc/profile.d/*.sh; do
        if [ -r "$i" ]; then
            if [ "$PS1" ]; then
                . "$i"
            else
                . "$i" >/dev/null
            fi
        fi
    done
```

因此不管是login shell还是non-login shell，启动时都会加载/etc/profile.d/*.sh中的环境变量。

并且，**/etc/profile文件中也告诉我们最好自己在 /etc/profile.d/ 创建一个自定义的环境变量**，如下查看

```shell
[nhk@kk03 etc]$ vim /etc/profile

# /etc/profile

# System wide environment and startup programs, for login setup
# Functions and aliases go in /etc/bashrc

# It's NOT a good idea to change this file unless you know what you
# are doing. It's much better to create a custom.sh shell script in
# /etc/profile.d/ to make custom changes to your environment, as this
# will prevent the need for merging in future updates.

系统范围的环境和启动程序，用于登录设置
函数和别名放在/etc/bashrc中

修改这个文件不是一个好主意，除非你知道你要做什么
正在做什么。创建一个自定义对环境的更改脚本要好得多
/etc/profile.对您的环境进行自定义更改，如下所示
将防止在未来的更新中合并。
```
