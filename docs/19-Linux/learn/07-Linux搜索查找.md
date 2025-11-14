# Linux搜索查找

## 查找文件或目录 find

find 指令将从指定目录向下递归地遍历其各个子目录，将满足条件的文件显示在终端。

基本格式

```shell
find [搜索范围] [选项]
```

注意：

​	默认情况下，如果不输入搜索范围，**默认情况下就是当前路径**

| 选项            | 说明                                                         |
| --------------- | ------------------------------------------------------------ |
| -name<文件名>   | 按照指定的文件名查找模式查找文件                             |
| -user<用户名>   | 查找属于指定用户名的所有文件                                 |
| -size<文件大小> | 按照指定的文件大小查看文件，单位为：b（块 512字节） c（字节）w（字 2字节）k（千字节）M（兆字节）G（吉字节） |

演示

```shell
# 查找 /etc目录下 以 profile 开头的文件或目录
[root@basenode ~]# find /etc -name "profile*"
/etc/lvm/profile
/etc/profile
/etc/profile.d
/etc/tuned/profile_mode

# 查找 nhk用户 在 /opt目录的文件或目录
[root@basenode ~]# find /opt -user nhk
/opt/kk
/opt/test
[root@basenode ~]# ll /opt
total 12
-rw-r--r-- 1 root root 4328 May  7 15:05 1.txt
-rw-r--r-- 1 root root    0 May  7 14:59 hello.txt
drwxr-xr-x 2 nhk  root    6 Jun 11 13:53 kk
-rw-r--r-- 1 root root 1819 May  7 15:03 profile
-rw-r--r-- 1 nhk  nhk     0 Jun 11 20:48 test

# 查找 /opt目录下 大于2k的文件
[root@basenode ~]# find /opt -size +2k
/opt/1.txt
[root@basenode ~]# ls -lh /opt
total 12K
-rw-r--r-- 1 root root 4.3K May  7 15:05 1.txt
-rw-r--r-- 1 root root    0 May  7 14:59 hello.txt
drwxr-xr-x 2 nhk  root    6 Jun 11 13:53 kk
-rw-r--r-- 1 root root 1.8K May  7 15:03 profile
-rw-r--r-- 1 nhk  nhk     0 Jun 11 20:48 test
```

## 快速定位文件路径 locate

locate 指令利用事先建立的系统中所有文件名称及路径的 locate 数据库实现快速定位给定的文件。locate 指令无需遍历整个文件系统，查询速度较快。为了保证查询结果的准确度，管理员必须定期更新 locate 时刻。

基本语法

```shell
locat 搜索文件
```

经验之谈：

​	由于 locate 指令基于数据库查询，所以**第一次运行前，必须使用 updatedb 指令创建 locate 数据库**

如果你没有 locate 指令，需要先下载

```
[root@basenode ~]# yum install -y mlocate
```

演示

```shell
[root@basenode ~]# updatedb
# 查看包含 profile.d 的所有文件及目录
[root@basenode ~]# locate profile.d
/etc/profile.d
/etc/profile.d/256term.csh
/etc/profile.d/256term.sh
/etc/profile.d/colorgrep.csh
/etc/profile.d/colorgrep.sh
/etc/profile.d/colorls.csh
/etc/profile.d/colorls.sh
/etc/profile.d/csh.local
/etc/profile.d/lang.csh
/etc/profile.d/lang.sh
/etc/profile.d/less.csh
/etc/profile.d/less.sh
/etc/profile.d/sh.local
/etc/profile.d/which2.csh
/etc/profile.d/which2.sh
```

## 过滤查找 grep 及 “|”管道符

grep 全拼：Global search REgular expression and Print out the line（全局搜索正则表达式并打印）

功能是从文本文件或管道数据流中筛选匹配的行和数据，如果再配合正则表达式

语法格式

```shell
grep [options] [pattern] file

# pattern匹配模式就是你想要找的东西，可以是普通的文字符号，也可以是正则表达式

# 参数options说明
#	-v	
```

-   可以对文本进行搜索 

-   同时搜索多个文件 

    -   从文档中查询指定的数据 

        grep adm passwd 

        grep school passwd lucky 

-   显示匹配的行号 

grep **-n** school passwd 

-   显示不匹配的忽略大小写 

grep **-nvi** root passwd --color=auto 

-   使用正则表达式匹配 

grep -E "[1-9]+" passwd --color=auto 



管道符 “|” ，表示将前一个命令的处理结果输出传递给后面的命令处理

基本语法

```shell
gerp [选项] [查找内容] [源文件]
```

| 选项 | 说明                                                 |
| ---- | ---------------------------------------------------- |
| -n   | **显示匹配行及行号**                                 |
| -v   | 只显示不包含匹配字符的行（即列出不包含该关键字的行） |
| -c   | 对匹配的行计数                                       |
| -l   | 只显示包含匹配模式的文件名                           |
| -h   | 抑制包含匹配模式的文件名的显示                       |
| -i   | **对匹配模式不区分大小写**                           |

演示

```shell
# 查询 anaconda-ks.cfg 文件中含有 boot 内容的行，-n是显示行号
[root@basenode ~]# grep -n boot anaconda-ks.cfg 
8:# Run the Setup Agent on first boot
9:firstboot --enable
17:network  --bootproto=dhcp --device=ens33 --onboot=off --ipv6=auto --no-activate
26:# System bootloader configuration
27:bootloader --append=" crashkernel=auto" --location=mbr --boot-drive=sda
32:part /boot --fstype="xfs" --ondisk=sda --size=256

# 将使用 grep 查找到的内容追加到文件 test
[root@basenode ~]# grep boot anaconda-ks.cfg | cat >> test
[root@basenode ~]# cat test 
# Run the Setup Agent on first boot
firstboot --enable
network  --bootproto=dhcp --device=ens33 --onboot=off --ipv6=auto --no-activate
# System bootloader configuration
bootloader --append=" crashkernel=auto" --location=mbr --boot-drive=sda
part /boot --fstype="xfs" --ondisk=sda --size=256

# 在当前目录查找后缀名为 .cfg 的文件或目录
[root@basenode ~]# ls | grep .cfg 
anaconda-ks.cfg

```

### **grep 与 find 的差别**

-   grep是在文件中查找满足条件的行（grep是找文件中的内容）
-   find是在指定目录下根据文件的相关信息找到满足指定条件的文件（find是找文件）

## which命令

`which`命令用于查找指定命令的可执行文件的路径

当您在终端中输入一个命令时，系统会根据环境变量`$PATH`中定义的路径来查找该命令的可执行文件。`which`命令可以帮助您确定系统将要执行的是哪个可执行文件。

使用`which`命令的语法如下：

```shell
which [options] command
```

常用选项

| 选项 | 参数                                                         |
| ---- | ------------------------------------------------------------ |
| -a   | 显示所有匹配的可执行文件路径，而不仅仅是第一个匹配的路径     |
| -s   | 仅显示找到的可执行文件的路径，不显示其他信息                 |
| -p   | 使用`$PATH`环境变量中定义的路径来查找命令，而不是使用默认的路径 |

演示：

```shell
[nhk@kk01 ~]$ which java
/opt/software/jdk1.8.0_152/bin/java
[nhk@kk01 ~]$ which vim
/usr/bin/vim
[nhk@kk01 ~]$ which ls
alias ls='ls --color=auto'
	/usr/bin/ls
```

