# wc

wc命令可以统计指定文件的行数、单词数、字节数和字符数

基本语法

```shell
wc [选项] [文件]
```

| 选项                  | 含义                   |
| --------------------- | ---------------------- |
| -l, --lines           | 统计行数               |
| -w, --words           | 统计单词数             |
| -c, --bytes           | 统计字节数             |
| -m, --chars           | 统计字符数             |
| -L, --max-line-length | 统计文件中最长行的长度 |

```shell
[nhk@kk01 ~]$ wc users.dat 
  6040   6040 134368 users.dat	
# 行数    单词数 字节数
[nhk@kk01 ~]$ wc -l users.dat 	# 统计行数
6040 users.dat
[nhk@kk01 ~]$ wc -w users.dat 	# 统计单词数
6040 users.dat
[nhk@kk01 ~]$ wc -c users.dat 	# 统计字节数
134368 users.dat
[nhk@kk01 ~]$ wc -m users.dat 	# 统计字符数
134368 users.dat
[nhk@kk01 ~]$ wc -L users.dat 	# 统计文件中最长行的长度
27 users.dat
```



# cut

​	cut的工作就是“剪”，具体的说就是在文件中负责剪切数据的。cut 命令从文件的每一行剪切字节、字符和字段并将这些字节、字符和字段输出

基本语法

```shell
cut [选项] filename
```

说明：**默认分隔符就是制表符\t**

| 选项 | 说明                                           |
| ---- | ---------------------------------------------- |
| -f   | 列号，提取第几列                               |
| -d   | 分隔符，按照指定分隔符分隔列，默认分隔符 "\t"  |
| -c   | 按字符进行切割，后加 n 表示取第几列，比如 -c 1 |

```shell
# 切割第一列
[root@basenode ~]# cat /etc/passwd | grep bash$ 
root:x:0:0:root:/root:/bin/bash
nhk:x:1000:1000:nhk:/home/nhk:/bin/bash
ninghk:x:1001:1001::/home/ninghk:/bin/bash
[root@basenode ~]# 
[root@basenode ~]# cat /etc/passwd | grep bash$ | cut -d ":" -f 1 
root
nhk
ninghk

# 切割第1、第6、第7列
[root@basenode ~]# cat /etc/passwd | grep bash$ | cut -d ":" -f 1,6,7
root:/root:/bin/bash
nhk:/home/nhk:/bin/bash
ninghk:/home/ninghk:/bin/bash

# 切割第2列以后所有的
[root@basenode ~]# echo $PATH
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin
[root@basenode ~]# echo $PATH | cut -d ":" -f 2-
/usr/local/bin:/usr/sbin:/usr/bin:/root/bin

# 切割 ifconfig 获取当前ip
[root@basenode ~]# ifconfig ens33
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.188.100  netmask 255.255.255.0  broadcast 192.168.188.255
        inet6 fe80::12a5:9211:648c:ab95  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:83:10:95  txqueuelen 1000  (Ethernet)
        RX packets 476  bytes 41931 (40.9 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 354  bytes 40443 (39.4 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

[root@basenode ~]# ifconfig ens33 | grep netmask
        inet 192.168.188.100  netmask 255.255.255.0  broadcast 192.168.188.255
[root@basenode ~]# ifconfig ens33 | grep netmask | cut -d " " -f 10
192.168.188.100
```

# awk

​	一个强大的文本分析工具，把文件逐行读入，**以空格为默认分隔符**将每行进行切片，切开的部分再进行分析处理

基本语法

```shell
awk [选项参数] '/pattern1/{action1} /pattern2/{action2} ...' filename

# pattern 表示 awk 在数据中查找内容，就是模式匹配
# action 在找到匹配内容时所执行的一系列命令
```

注意：

​	**只有匹配了pattern，才会执行action**

| 选项 | 说明                 |
| ---- | -------------------- |
| -F   | 指定输入文件的分隔符 |
| -v   | 赋值一个用户定义变量 |

```shell
# 搜索 passwd文件以 root关键字开头的所有行，并输出该行的第7列
[root@basenode ~]# cat /etc/passwd | grep root | cut -d ":" -f 7
/bin/bash
/sbin/nologin
[root@basenode ~]# cat /etc/passwd | awk -F ":" '/^root/ {print $7}'
/bin/bash

# 搜索 passwd文件以 root关键字开头的所有行，并输出该行的第1列，第7列，中间以 , 分隔
[root@basenode ~]# cat /etc/passwd | awk -F ":" '/^root/ {print $1","$7}'
root,/bin/bash
```

```shell
# 显示 passwd文件所有行，并输出该行的第1列，第7列，中间以 , 分隔
# 并且在第一行显示user,shell 最后以后显示 end of file
[root@basenode ~]# cat /etc/passwd | awk -F ":" 'BEGIN{print "user,shell"}{print $1","$7}EN
D{print "end of file"}'user,shell
root,/bin/bash
bin,/sbin/nologin
daemon,/sbin/nologin
....

ninghk,/bin/bash
end of file
```

注意：

​	BEGIN 在所有的数据行读取之前执行，END在所有的数据行读取之后执行

```shell
# 把passwd文件的用户id输出，并全部+1
[root@basenode ~]# cat /etc/passwd | awk -F ":" '{print $3+1}'
1
2
3
4
5
6	
...
[root@basenode ~]# cat /etc/passwd | awk -v i=1 -F ":" '{print $3+i}'
1
2
3
4
5
...
```

## awk内置变量

| 变量     | 说明                                   |
| -------- | -------------------------------------- |
| FILENAME | 文件名                                 |
| NR       | 已读的记录数（行号）                   |
| NF       | 浏览记录的域的个数（切割后，列的个数） |

```shell
[root@basenode ~]# cat /etc/passwd | awk -F ":" '{print "文件名："FILENAME "行号："NR "列数
："NF}' /etc/passwd文件名：/etc/passwd行号：1列数：7
文件名：/etc/passwd行号：2列数：7
文件名：/etc/passwd行号：3列数：7
文件名：/etc/passwd行号：4列数：7
文件名：/etc/passwd行号：5列数：7
文件名：/etc/passwd行号：6列数：7
...

# 显示 ifconfig 的空行
[root@basenode ~]# ifconfig | grep -n ^$
9:
18:
26:
[root@basenode ~]# ifconfig | awk '/^$/ {print NR}'
9
18
26

# 使用awk显示ip
[root@basenode ~]# ifconfig ens33 | grep netmask | cut -d " " -f 10
192.168.188.100
[root@basenode ~]# ifconfig ens33 | awk '/netmask/ {print $2}'
192.168.188.100
```

