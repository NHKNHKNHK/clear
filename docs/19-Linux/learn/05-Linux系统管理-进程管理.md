# 系统管理与进程管理

## 系统管理常用

### **Linux中进程和服务**

计算机中，一个正在进行的程序或命令，被叫做“进程”（process）

启动之后一直存在、常驻内存的进程，一般被叫做“服务”（service）

在Linux中，可以简答的将守护进程理解为服务

### service服务管理

#### **centos6基本语法**

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

#### **centos7基本语法**

```shell
systemctl start|stop|restart|staut 服务名
```

**查看服务的方法**

```
ls /usr/lib/systemd/system
```

### 系统运行级别

运行级别：

开机 ==>  BIOS ==> /boot ==> init进程 ==> 运行级别 ==> 运行级别对应的服务

查看默认的运行级别

```shell
vi /etc/inittab
```

Linux系统的7种运行级别（runlevel）**常用的是级别3和5**

-   运行级别0：系统停机状态，系统默认运行级别不能设为0，否则不能正常启动
-   运行级别1：单用户工作状态，root权限，用于系统维护，禁止远程登录（该级别有点像window的安全模式）
-   运行级别2：多用户状态（没有NFS），不支持网络
-   运行级别3：完全的多用户状态（有NFS），登录后进入控制台命令行模式
-   运行级别4：系统未使用，保留
-   运行级别5：X11控制台，登录后进入图形GUI模式
-   运行级别6：系统正常关闭并重启，默认运行级别不能设为6，否则不能正常启动



**CentOS7的运行级别简化为**：

multi-user.target  		等价与原运行级别3（多用户有网，无图形化界面）

graphical.target 		   等价与原运行级别3（多用户有网，无图形化界面）

#### **查看当前运行级别**

```shell
systemctl get-default
```

#### **修改当前运行级别**

```shell
systemctl set-default TARGET.target
# 其中TARGET.target 取 multi-user.target 或 graphical.target 
```

切换运行级别的快捷键

RedHat

-   ​	ctrl+alt+f1  转为GUI界面
-   ​	ctrl+alt+f2~f6  转为shell

Ubutu

-   ctrl+alt+f1~f6  转为GUI界面
-   ctrl+alt+f7       转为shell

### 防火墙 firewalld

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

### 关机、重启命令

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



### 显示计算机及操作系统相关信息uname

​	使用 uname命令可以显示计算机以及操作系统的相关信息，比如 内核发行号、计算机硬件架构、操作系统名称、计算机主机名称等

基本语法

```shell
uname [选项]
```

| 选项 | 说明                     |
| ---- | ------------------------ |
| -a   | 显示全部信息             |
| -m   | 显示计算机硬件架构名称   |
| -n   | 显示在网络上的主机名称   |
| -r   | 显示操作系统的内核版本号 |
| -s   | 显示操作系统名称         |

```shell
[root@basenode ~]# uname
Linux
[root@basenode ~]# uname -m
x86_64
[root@basenode ~]# uname -n
basenode
[root@basenode ~]# uname -r
3.10.0-1160.el7.x86_64
[root@basenode ~]# uname -s
Linux
```

### 显示、修改主机名 hostname

基本语法

```shell
hostname [选项] [主机名|-F 文件]   # 设置主机名
hostname [选项]	# 显示格式化主机名
```

| 选项 | 说明         |
| ---- | ------------ |
| -s   | 显示短主机名 |
| -i   | 显示IP地址   |
| -f   | 显示长主机名 |
| -d   | 显示DNS域名  |

```shell
[root@basenode ~]# hostname
basenode
[root@basenode ~]# hostname -s
basenode
[root@basenode ~]# hostname -i
fe80::12a5:9211:648c:ab95%ens33 192.168.188.100 192.168.122.1
[root@basenode ~]# hostname -f
basenode
[root@basenode ~]# hostname allbase   # 修改主机名
[root@basenode ~]# hostname
allbase
```

注意：

​	使用hostname命令修改的主机名在系统重启后失效，如果需要永久的修改主机名，那么需要取修改 /etc/hostname文件



## 进程管理

进程是正在执行的一个程序或命令，每一个进程都是一块独立运行的实体，都有自己的地址空间，并占用一定的系统资源

###查看当前系统进程状态 ps

ps即 process  status 进程状态

基本语法

```shell
ps aux | grep XXX 	# 查看系统中 所有进程
ps -ef | grep XXX   # 可以查看 父子进程之间的关系

ps -aux  # 可以用，但是不严谨，官方不推荐使用
```

| 选项 | 说明                                       |
| ---- | ------------------------------------------ |
| a    | 列出带有终端的所有用户的进程               |
| x    | 列出当前用户的所有进程，包括没有终端的进程 |
| u    | 面向用于友好的显示风格                     |
| -e   | 列出所有进程                               |
| -u   | 列出 某个用户关联的所有进程                |
| -f   | 显示完整格式的进程列表                     |

其中，加 - 表示 Unix风格 ，不加  - 表示 BSD风格

```shell
[root@basenode ~]# ps aux
USER        PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root          1  0.0  0.3 193980  7168 ?        Ss   01:40   0:01 /usr/lib/systemd/systemd --switched-root --system --deserialize 22
root          2  0.0  0.0      0     0 ?        S    01:40   0:00 [kthreadd]
root          4  0.0  0.0      0     0 ?        S<   01:40   0:00 [kworker/0:0H]
root          6  0.0  0.0      0     0 ?        S    01:40   0:00 [ksoftirqd/0]
root          7  0.0  0.0      0     0 ?        S    01:40   0:00 [migration/0]
root          8  0.0  0.0      0     0 ?        S    01:40   0:00 [rcu_bh]
....

```

### **ps aux 说明**

-   USER：该进程是由那个用户产生的
-   PID：进程的ID号
-   %CPU：该进程占用CPU资源的百分比，占用越高，进程越耗费资源
-   %MEM ：该进程占用CPU物理内存的百分比，占用越高，进程越耗费资源
-   VSZ：该进程**所占用的虚拟内存**，单位KB（采用LRU算法将最近一段时间最少使用的放入了虚拟内存）
-   RSS：该进程**所占用的实际物理内存**，单位KB	 
-   TTY：该进程或命令使用那个终端调用的 。对于CentOS来说：
    -   tty1 是图形化终端
    -   tty2-6 是本地的字符界面终端。
    -   pst/0-255 代表虚拟终端   
-   STAT：进程状态。常见状态有：
    -   R：运行状态、S：睡眠状态、T：暂停状态、Z：僵尸状态、s：包含子进程、l：多线程、+：前台显示
-   START：该进程的启动时间
-   TIME：该进程占用cpu的运算时间，注意不是系统时间

-   COMMAND：产生此进程的命令名

```shell
[root@basenode ~]# ps -ef
UID         PID   PPID  C STIME TTY          TIME CMD
root          1      0  0 05:02 ?        00:00:01 /usr/lib/systemd/systemd --switched-root --system --deserialize 22
root          2      0  0 05:02 ?        00:00:00 [kthreadd]
root          4      2  0 05:02 ?        00:00:00 [kworker/0:0H]
root          5      2  0 05:02 ?        00:00:00 [kworker/u256:0]
root          6      2  0 05:02 ?        00:00:00 [ksoftirqd/0]
root          7      2  0 05:02 ?        00:00:00 [migration/0]
root          8      2  0 05:02 ?        00:00:00 [rcu_bh]
root          9      2  0 05:02 ?        00:00:00 [rcu_sched]
root         10      2  0 05:02 ?        00:00:00 [lru-add-drain]
root         11      2  0 05:02 ?        00:00:00 [watchdog/0]
...
```

### **ps -ef 说明**

-   UID：用户ID
-   **PID：进程ID**   
-   **PPID：父进程ID**  
-   C：CPU用于计算执行优先级的因子。数值越大，表示进程是CPU密集型运算，执行优先级会降低；数值越小，表明进程是I/O密集型运算，执行优先级会提高	
-   STIME：进程启动的时间
-   TTY：完整的终端名称          
-   TIME：CPU时间 
-   CMD：启动进程所用的命令和参数	

经验之谈：

​	**如果想要查看进程的CPU占用率和内存占用率，可以使用 ps aux**

​	**如果想看进程的父进程ID，可以使用 ps -ef**

演示

查看远程登录进程

```shell
# 在执行下面命令前，我们使用xshell远程连接了 root用户 和 nhk用户
[root@basenode ~]# ps -ef | grep sshd
root       1160      1  0 05:02 ?        00:00:00 /usr/sbin/sshd -D
root       8878   1160  0 05:04 ?        00:00:00 sshd: root@pts/0
root       9139   1160  1 05:24 ?        00:00:00 sshd: nhk [priv]  # 这个进程主要是为了权限分离，当nhk用户使用 sudo 时，使用的就是这个进程
nhk        9146   9139  0 05:24 ?        00:00:00 sshd: nhk@pts/1
root       9192   8888  0 05:24 pts/0    00:00:00 grep --color=auto sshd
```



### 终止进程 kill

基本格式

```shell
kill [选项] 进程号		# 通过进程号杀死进程
killall 进程名称		# 通过进程名称杀死进程，也支持通配符，这在系统因负载过大而变得很慢的时候很有用
```

| 选项 | 参数                 |
| ---- | -------------------- |
| -9   | 表示强迫进程立即停止 |

```shell
[root@basenode ~]# kill -l
 1) SIGHUP	 2) SIGINT	 3) SIGQUIT	 4) SIGILL	 5) SIGTRAP
 6) SIGABRT	 7) SIGBUS	 8) SIGFPE	 9) SIGKILL	10) SIGUSR1
11) SIGSEGV	12) SIGUSR2	13) SIGPIPE	14) SIGALRM	15) SIGTERM
16) SIGSTKFLT	17) SIGCHLD	18) SIGCONT	19) SIGSTOP	20) SIGTSTP
21) SIGTTIN	22) SIGTTOU	23) SIGURG	24) SIGXCPU	25) SIGXFSZ
26) SIGVTALRM	27) SIGPROF	28) SIGWINCH	29) SIGIO	30) SIGPWR
31) SIGSYS	34) SIGRTMIN	35) SIGRTMIN+1	36) SIGRTMIN+2	37) SIGRTMIN+3
38) SIGRTMIN+4	39) SIGRTMIN+5	40) SIGRTMIN+6	41) SIGRTMIN+7	42) SIGRTMIN+8
43) SIGRTMIN+9	44) SIGRTMIN+10	45) SIGRTMIN+11	46) SIGRTMIN+12	47) SIGRTMIN+13
48) SIGRTMIN+14	49) SIGRTMIN+15	50) SIGRTMAX-14	51) SIGRTMAX-13	52) SIGRTMAX-12
53) SIGRTMAX-11	54) SIGRTMAX-10	55) SIGRTMAX-9	56) SIGRTMAX-8	57) SIGRTMAX-7
58) SIGRTMAX-6	59) SIGRTMAX-5	60) SIGRTMAX-4	61) SIGRTMAX-3	62) SIGRTMAX-2
63) SIGRTMAX-1	64) SIGRTMAX	
```

演示

演示关闭nhk用户的远程连接

```shell
[root@basenode ~]# ps -ef | grep sshd
root       1160      1  0 05:02 ?        00:00:00 /usr/sbin/sshd -D
root       8878   1160  0 05:04 ?        00:00:00 sshd: root@pts/0
root       9139   1160  0 05:24 ?        00:00:00 sshd: nhk [priv]
nhk        9146   9139  0 05:24 ?        00:00:00 sshd: nhk@pts/1
root       9282   8888  0 05:32 pts/0    00:00:00 grep --color=auto sshd
[root@basenode ~]# kill 9139  # 这里的进程号可以填写 9146  或 9139
[root@basenode ~]# ps -ef | grep sshd
root       1160      1  0 05:02 ?        00:00:00 /usr/sbin/sshd -D
root       8878   1160  0 05:04 ?        00:00:00 sshd: root@pts/0
root       9290   8888  0 05:33 pts/0    00:00:00 grep --color=auto sshd
```

### 查看进程树 pstree

基本语法

```shell
pstree [选项]
```

| 选项 | 说明               |
| ---- | ------------------ |
| -p   | 显示进程的PID      |
| -u   | 显示进程的所属用户 |

### 实时监控系统进程状态 top

基本语法

```shell
top [选项]
```

| 选项    | 说明                                                         |
| ------- | ------------------------------------------------------------ |
| -d 秒数 | 指定top命令每隔几秒更新。**默认是3秒**在top 命令的交互模式当中可以执行的命令 |
| -i      | 使top 不显示任何闲置或者僵尸进程                             |
| -p      | 监控指定pid 来监控指定进程状态                               |

操作说明

| 操作 | 说明                          |
| ---- | ----------------------------- |
| P    | 以CPU使用率排序，默认就是此项 |
| M    | 以内存的使用率排序            |
| N    | 以PID排序                     |
| h    | 显示top下的帮助信息           |
| q    | 退出top                       |

```shell
top - 07:11:04 up 16 min,  1 user,  load average: 0.00, 0.01, 0.05
Tasks: 177 total,   1 running, 176 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.0 us,  0.2 sy,  0.0 ni, 99.8 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem :  1863032 total,  1017328 free,   454160 used,   391544 buff/cache
KiB Swap:  4194300 total,  4194300 free,        0 used.  1245476 avail Mem 
   PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND                                                                 
    50 root      20   0       0      0      0 S   0.3  0.0   0:00.78 kworker/0:1                                                                            
   428 root      20   0       0      0      0 S   0.3  0.0   0:00.76 xfsaild/dm-0                                                                           
....

# 说明
第一行 
07:11:04	表示当前时间
up 16 min	系统启动时长
1 user		当前正在使用的用户数量
load average: 0.00, 0.01, 0.05	当前平均负载，分别为过去1、5、15分钟之内整个系统的平均负载
第二行
Tasks: 177 total	表示当前正在执行的任务
	1 running	1个run状态
	176 sleeping 176个sleep状态
    0 stopped	0个停止
    0 zombie	0个僵尸状态
第三行
%Cpu(s)		表示cpu的占用情况
	0.0 us	表示用户进程占用cpu时间比
    0.2 sy	系统进程占用cpu时间比
    0.0 ni	被nice命令修改过优先级的进程占用cpu时间比
    99.8 id	空间
    0.0 wa	等待
    0.0 hi	硬件中断请求服务时间占比
    0.0 si	软中断请求服务时间占比
    0.0 st	被虚拟化占用的时间占比
第四行
KiB Mem  当前内存情况
	1863032 total		总共内存
	1017328 free		空闲
	454160 used			已使用
	391544 buff/cache	缓存
第五行
KiB Swap	当前虚拟内存情况
	4194300 total	总共内存
    4194300 free 
    0 used.  
    1245476 avail Mem 
```

### 显示网络状态和端口号占用信息 netstat

基本语法

```shell
netstat -anp | grep 进程号			# 查看该进程网络信息
netstat -nlp | grep 端口号			# 查看网络端口号占用情况
```

| 选项 | 说明                                                 |
| ---- | ---------------------------------------------------- |
| -a   | 显示所有正在监听（listen）和未监听的套接字（scoket） |
| -n   | 拒绝显示别名，能显示数字的全部转化为数字             |
| -l   | 仅列出在监听的服务状态                               |
| -p   | 表示显示哪个进程在调用                               |

```shell
[root@basenode ~]# netstat -anp
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN      772/rpcbind         
tcp        0      0 192.168.122.1:53        0.0.0.0:*               LISTEN      1642/dnsmasq        
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1165/sshd           
tcp        0      0 127.0.0.1:631           0.0.0.0:*               LISTEN      1162/cupsd          
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      1520/master         
tcp        0      0 192.168.188.100:22      192.168.188.1:11175     ESTABLISHED 8891/sshd: root@pts 
tcp6       0      0 :::111                  :::*                    LISTEN      772/rpcbind         
.....

# 说明
Proto 	协议
Recv-Q	连接到当前scoket的用户程序还未拷贝的字节数
Send-Q 	已发送出去，但是远程主机还未收到的字节数
Local Address   	本地地址
Foreign Address		远程地址     
State     			状态
PID/Program name    进程ID/程序名称
```
