# 文件与磁盘管理

## 1、文件简介

在linux中，任何软件、硬件都被视为文件。即**万物皆文件**

linux中文件名最大为256字符 （支持a-z A-Z 0-9等）

Linux中有五种不同类型的文件：

- 普通文件 -
- 目录文件 d：目录文件可以简称为目录
- 链接文件 l：它是一个特殊的文件，它指向一个真实存在的文件的链接。
- 管道文件 s：主要用于不同进程间信息的传递。
- 设备文件 b：linux系统通常将设备文件放置于 /dev 下

## 2、目录简介

**Linux分区：**

- /boot 分区（配置256m、512m、1G等）
- swap分区（一般配置为内存2倍）
- 其他空间都分到 /




Linux系统中采用级层式的**树状目录结构**。

- Linux系统默认目录
- / 根目录
- /boot **引导分区**，操作系统启动时的所需的文件
- /bin binary的缩写，该目录沿袭unix的结构，**存放用户常用的命令**。如cp、mv、cat等
- /etc 存储系统管理所需的**配置文件**及子目录
- /dev 设备文件目录
- /media 媒体目录，识别可移动媒体设备（如u盘、光驱等）相当于可移动媒体设备的挂载点
- /mnt  文件系统加载点（和media差不多）
- /proc 一个虚拟目录，它是系统内存的映射（相当于系统内存中进程的映射）
- run 运行目录，存放当前系统运行以来的所以实时信息（临时的，重启就没了）
- /sbin s是System的意思，存放系统启动时所需执行的程序
- /home 用户家目录或ftp站点目录
- /opt 一般存放自己安装的第三方应用等
- /root 管理员目录
- srv 存放与系统服务的信息
- sys 是system的缩写，存放系统硬件信息的相关文件
- /tmp 临时文件
- /usr 存放用户使用的系统变量、应用程序等信息
- /lib 动态链接共享库。几乎所有的程序都需要用到这些
- /lib64 
- /var 可变目录，存放经常被修改的文件（如日志）
- /lost+found 这目录一般情况为空，系统非正常关闭后，存放恢复文件的

## 3、文件的基本操作

### 1)显示当前工作目录的绝对路径 pwd

基本语法

```shell
pwd    # 显示当前工作目录的绝对路径
```

| 参数 | 说明                                                 |
| ---- | ---------------------------------------------------- |
| -P   | 抛开软链接等的影响，直接查看真实路径（输出物理路径） |
| -L   | 目录链接时，输出链接路径                             |

```shell
[root@basenode ~]# pwd
/root
[root@basenode ~]# cd /opt/
[root@basenode opt]# pwd
/opt
```

```shell
# 我们知道 /目录下有个bin目录，其实它是软链接到 /usr/bin目录的
[root@basenode bin]# pwd		# 该目录是软链接，所有看到的是当前路径
/bin
[root@basenode bin]# pwd -P		# -P 参数可以看到软链接的真实路径
/usr/bin
```

### 2)切换当前目录 cd

基本用法

```shell
cd [选项] [路径]
```

| 选项 | 说明                                       |
| ---- | ------------------------------------------ |
| -P   | 如果是链接路径，则进入链接路径的源物理路径 |

演示

```shell
[root@basenode /]# pwd
/
[root@basenode /]# cd /opt		# 切换到指定目录
[root@basenode opt]# cd -		# 切换上一次的目录（该命令方便在两个路径之间跳转）
/
[root@basenode /]# cd ~			# 回到用户家目录
[root@basenode ~]# pwd			# 当前用户为root，所以回到 /root
/root
```

### 3)列出目录的内容 ls

ls：list 列出目录内容

基本语法

```
ls [选项] [目录或是文件]
```

| 参数 | 说明                                                  |
| ---- | ----------------------------------------------------- |
| -a   | 显示全部的文件,包括隐藏文件(开头为 . 的文件)          |
| -l   | 长数据串列出，包含文件的属性与权限等数据（等价于 ll） |
| -h   | 人性化显示（就是将文件大小以kb、Mb等方式展示）        |

演示

```shell
[root@basenode ~]# ls -al
total 28
dr-xr-x---.  2 root root  135 Dec  1 14:15 .		# 表示当前目录
dr-xr-xr-x. 17 root root  224 Dec  1 14:11 ..		# 表示上一级目录
-rw-------.  1 root root 1535 Dec  1 14:11 anaconda-ks.cfg
-rw-------.  1 root root  768 Apr 11 12:57 .bash_history	# 隐藏文件
-rw-r--r--.  1 root root   18 Dec 29  2013 .bash_logout
-rw-r--r--.  1 root root  176 Dec 29  2013 .bash_profile
-rw-r--r--.  1 root root  176 Dec 29  2013 .bashrc
-rw-r--r--.  1 root root  100 Dec 29  2013 .cshrc
-rw-r--r--.  1 root root  129 Dec 29  2013 .tcshrc

# 每行列出的信息依次是：
# 文件类型与权限 链接数 文件属主 文件属组 文件大小(byte) 建立或最近修改的时间 名字 

[root@basenode ~]# ls /    # 显示/目录下的文件
bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var

```



### 2)新建和删除文件 

#### 删除文件 rm

rm即remove的缩写，该命令可以删除文件或目录

基本语法

```shell
rm [选项] deleteFile     #递归删除目录中所以的内容
```

```shell
[root@redhat01 opt]# rm -rf file1
```

| 选项 | 说明                               |
| ---- | ---------------------------------- |
| -r   | 递归删除，用于删除目录及内容       |
| -f   | 强制，不提示是否确认               |
| -i   | 交互式删除，删除前需要确认是否删除 |
| -v   | 显示指令的详细执行过程             |

说明：

​	Linux中最大的笑话： rm -rf /*   ==切记不能使用==



#### 新建目录 mkdir

基本语法

```shell
mkdir [选项] [目录]
```

| 选项          | 说明                                            |
| ------------- | ----------------------------------------------- |
| `-p`            | 递归创建目录                                    |
| `-v`            | 每次创建新目录都显示信息                        |
| `-m <权限模式>` | 对新创建的目录设置权限，没有 -m选项时，默认 755 |

```shell
[root@redhat01 opt]# mkdir linux
```



#### 删除空目录 rmdir

rmdir: Remove Directory 移除目录

rmdir 只能删除空目录 ，**如果目录下有文件或子目录，则需使用 rm -rf**

基本语法

```shell
rmdir [选项] 要删除的空目录
```

| 选项 | 说明                                                     |
| ---- | -------------------------------------------------------- |
| -P   | 递归删除目录，当子目录删除后其父目录为空时，也一同被删除 |
| -v   | 输出处理的目录详情                                       |

演示

```shell
[root@redhat01 opt]# rmdir linux
```

#### 新建链接文件 ln

```
[root@redhat01 opt]# ln -s ./file1 file1.ln
[root@redhat01 opt]# ll
total 0
drwxr-xr-x. 2 root root 6 Mar 10 07:22 file1
lrwxrwxrwx. 1 root root 7 Mar 10 07:22 file1.ln -> ./file1
drwxr-xr-x. 2 root root 6 Mar  9  2015 rh

```

#### 创建空文件/更新文件日期 touch

**文件不存在则创建文件**，存在则修改文件日期

格式

```shell
touch [参数] 文件或路径 
```

| 参数           | 描述                                                |
| -------------- | --------------------------------------------------- |
| `-d  <yyyymmdd>` | 把文件存取或修改时间改为yyyy年mm月dd日              |
| `-a`             | 只更改访问时间（atime）                             |
| `-m`             | 更改文件的修改时间（mtime）                         |
| `-r <文件>`      | 使用指定文件的时间属性，而非当前时间                |
| `-t <日期时间>`  | 使用 [[CC]YY]MMDDhhmm.[ss] 格式的时间，而非当前时间 |

```shell
# 在指定路径下创建文件
[root@basenode opt]# touch /opt/hello.txt
[root@basenode opt]# 
[root@basenode opt]# ll /opt
total 4
-rw-r--r-- 1 root root 404 Apr 16 11:06 1.txt
-rw-r--r-- 1 root root   0 May  7 14:57 hello.txt

# 修改文件存储或存取时间
[root@basenode opt]# ll
total 4
-rw-r--r-- 1 root root 404 Apr 16 11:06 1.txt
-rw-r--r-- 1 root root   0 May  7 14:57 hello.txt
[root@basenode opt]# touch -d 20201111 hello.txt 
[root@basenode opt]# ll
total 4
-rw-r--r-- 1 root root 404 Apr 16 11:06 1.txt
-rw-r--r-- 1 root root   0 Nov 11  2020 hello.txt

# 把文件修改时间改为当前时间
[root@basenode opt]# ll
total 4
-rw-r--r-- 1 root root 404 Apr 16 11:06 1.txt
-rw-r--r-- 1 root root   0 Nov 11  2020 hello.txt
[root@basenode opt]# touch -m hello.txt 
[root@basenode opt]# ll
total 4
-rw-r--r-- 1 root root 404 Apr 16 11:06 1.txt
-rw-r--r-- 1 root root   0 May  7 14:59 hello.txt
```

**创建文件方式（扩展）**

如下所示

```shell
[root@basenode /]# echo hello >> 1.txt    # 方式一：使用echo
[root@basenode /]# cat 1.txt 
hello

[root@basenode /]# cat > ./2.txt		 # 方式二：使用cat
helloworld
^C
[root@basenode /]# cat 2.txt
helloworld
```



### 3)复制和移动文件

#### 文件复制 cp

格式

```
cp [参数] src dst   # 复制src文件到dst
```

| 参数 | 描述                                                         |
| ---- | ------------------------------------------------------------ |
| -a   | 尽可能将文件状态、权限等属性原样复制，等同于 -dpr 选项       |
| -f   | 强制复制，不提示，若目的文件存在则覆盖                       |
| -i   | 若目的文件存在，则提示                                       |
| -r   | 递归（resursive），如果源文件是目录，递归复制整个文件夹      |
| -d   | 复制时保留链接                                               |
| -p   | 除复制源文件的内容外，还把其修改时间和访问权限也复制到新文件中 |
| -l   | 不做复制，只是链接文件                                       |

```shell
\cp src dst    # 也是强制复制不提示  （这种方式使用linux原生命令）
# 查看Linux原生命令
[root@basenode /]# alias
alias cp='cp -i'
alias egrep='egrep --color=auto'
alias fgrep='fgrep --color=auto'
alias grep='grep --color=auto'
alias l.='ls -d .* --color=auto'
alias ll='ls -l --color=auto'
alias ls='ls --color=auto'
alias mv='mv -i'
alias rm='rm -i'
alias which='alias | /usr/bin/which --tty-only --read-alias --show-dot --show-tilde'

# 利用Linux原生命令 将 /etc目录下的profile文件 复制到/opt目录下
[root@basenode opt]# \cp /etc/profile /opt/
[root@basenode opt]# ll
total 8
-rw-r--r-- 1 root root  404 Apr 16 11:06 1.txt
-rw-r--r-- 1 root root    0 May  7 14:59 hello.txt
-rw-r--r-- 1 root root 1819 May  7 15:03 profile
```

```shell
[root@redhat01 opt]# cp ./test1 ./test2
```

```shell
[root@basenode opt]# ll
total 8
-rw-r--r-- 1 root root  404 Apr 16 11:06 1.txt
-rw-r--r-- 1 root root    0 May  7 14:59 hello.txt
-rw-r--r-- 1 root root 1819 May  7 15:03 profile
# 将/etc目录下sudoers文件 复制到/opt目录下，并替换原来的1.txt文件
[root@basenode opt]# cp /etc/sudoers /opt/1.txt
cp: overwrite ‘/opt/1.txt’? y  		# 询问是否替换
[root@basenode opt]# ll
total 12
-rw-r--r-- 1 root root 4328 May  7 15:05 1.txt
-rw-r--r-- 1 root root    0 May  7 14:59 hello.txt
-rw-r--r-- 1 root root 1819 May  7 15:03 profile
```



#### 文件移动/重命名 mv

格式

```shell
mv [选项] src des           	# 重命名或移动文件
```

| 选项 | 说明                                               |
| ---- | -------------------------------------------------- |
| -i   | 若目的文件存在，覆盖前则提示                       |
| -f   | 强制复制，不提示，若目的文件存在则覆盖             |
| -n   | 不覆盖已存在的文件                                 |
| -u   | 只有源文件比目标文件新，或目标文件不存在时才会移动 |
| -T   | 将目标文件视作普通文件处理                         |
|      |                                                    |

```shell
[root@redhat01 opt]# mv ./test2 ./file1/test3
[root@redhat01 opt]# ll 
total 0
drwxr-xr-x. 2 root root 19 Mar 10 07:27 file1
lrwxrwxrwx. 1 root root  7 Mar 10 07:22 file1.ln -> ./file1
drwxr-xr-x. 2 root root  6 Mar  9  2015 rh
-rw-r--r--. 1 root root  0 Mar 10 07:25 test1
[root@redhat01 opt]# ll ./file1
total 0
-rw-r--r--. 1 root root 0 Mar 10 07:25 test3
[root@redhat01 opt]# 
```




### 4)查看和创建文件 cat

#### 查看文件内容 cat

cat可查看**文件内容、创建文件、将多个文件合并**等

| 参数  | 说明                             |
| ----- | -------------------------------- |
| -b/-n | 展示行号  文件内容展示并携带行号 |

查看文件内容

```
[root@redhat01 opt]# cat ./test1
```

```shell
[root@basenode opt]# cat -b 1.txt 
     1	123
     2	123
     3	123
     4	123
     5	123
     6	123
     7	123
     8	123
```

##### **cat 创建文件**

```shell
[root@redhat01 opt]# cat > ./test2
hello
^C
[root@redhat01 opt]# cat test2
hello
[root@redhat01 opt]# 
```

> 注意：
>
> 使用cat创建文件，写入内容后，一定要按enter，否则最后一行不会显示出来。
>
> 使用ctrl+c 结束写入				
>
> #### 

##### **cat 将文件内容合并展示**

```shell
[root@redhat01 opt]# cat test2
hello
[root@redhat01 opt]# cat test3
world
[root@redhat01 opt]# cat ./test2 ./test3
hello
world
[root@redhat01 opt]# 
```

##### **cat 将多个文件合并**

```shell
[root@redhat01 opt]# cat ./test2 ./test3 > ./test4
[root@redhat01 opt]# cat test4
hello
world
```

#### 分页显示文件内容 more

```shell
[root@redhat01 opt]# more +2 test1
```

-   单击enter	向下翻一行
-   空格键(space)	向下翻一页
-   q	离开more，不在显示该文件内容
-   ctrl+F 向下滚动一屏
-   ctrl+B 向上滚动一屏
-   = 输出当前行号
-   :f 输出文件名和当前行的行号
-   参数 
-   +行数 从第几行开始显示
-   +/字符串 从第一个出现该字符串的行开始显示

#### 交互式操作显示文件内容 less

less命令与more很相似。

-   方向键控制上下左右，
-   q退出，
-   b返回，
-   空格	往下翻一页
-   pagedown 往下翻一页
-   pageup 往上翻一页
-   /字符串	向下搜寻 字符串   n:向下查找  N：向上查找
-   ?字符串   向上搜寻 字符串   n:向上查找  N：向下查找

```shell
[root@redhat01 opt]# less test1
```

#### 查看文件开头部分 head

用于显示文件开头部分，默认显示显示前10行

格式

```
head [参数] 文件
```

> 参数
>
> -n num 显示前num行
>
> -c num 显示前num个字符

```
[root@redhat01 opt]# head -n 2 shulanshi 
1hello
2
[root@redhat01 opt]# head -c 2 shulanshi 
1h[root@redhat01 opt]# 
	
```

#### 查看文件末尾部分 tail

用于显示文件末尾部分，**默认显示显示末尾10行**

格式

```
tail [参数] 文件
```

> 参数
>
> -n num 显示末尾num行
>
> -c num 显示末尾num个字符
>
> +num 从第num显示指定文件内容
>
> **-f   持续刷新文件（可用于查看实时日志）**

查看最后一行内容

```shell
[root@redhat01 opt]# tail -1 shulanshi 
16
```

head与tail结合查看指定一行的内容

```shell
[root@redhat01 opt]# head -10 shulanshi |tail -1 
10
```

#### 输出内容到控制台 echo

格式

```shell
echo [选项] [输出内容]
```

| 参数 | 说明                      |
| ---- | ------------------------- |
| -e   | 支持 反斜线控制的字符转换 |

演示

```shell
[root@basenode ~]# echo "hello\nworld"
hello\nworld
[root@basenode ~]# echo -e "hello\nworld"			# 加上 -e 参数，\n才会其作用
hello
world
```

### 5) > 输出重定向 >> 追加

基本语法

```shell
ls -l > 文件				将列表的内容写入到文件（覆盖写）

ls -al >> 追加			将列表的内容追加到文件（追加在末尾）

cat 文件1 > 文件2		   将文件1的内容覆盖到文件2

echo "内容" >> 文件 
```

演示

```shell
[root@basenode ~]# ls
anaconda-ks.cfg
[root@basenode ~]# ls > a.txt		# 将查看到的内容重定向到 a.txt
[root@basenode ~]# cat a.txt 
anaconda-ks.cfg
a.txt
[root@basenode ~]# echo hello >> a.txt 	# 把 hello 追加到文件 a.txt
[root@basenode ~]# cat a.txt 
anaconda-ks.cfg
a.txt
hello
```

### 6) 软链接 ln

软链接也称为**符号链接**，类似于 windows 里的快捷方式，**有自己的数据块**，主要是存放了链接其他文件的路径。

Linux根目录下的bin目录就是一个软链接

```shell
[root@basenode /]# ll
total 16
lrwxrwxrwx.   1 root root    7 Dec  1  2022 bin -> usr/bin	# bin目录链接到了 usr/bin
dr-xr-xr-x.   5 root root 4096 Dec  1  2022 boot
drwxr-xr-x   21 root root 3500 Jun 10 15:03 dev
drwxr-xr-x.  75 root root 8192 Jun 10 15:02 etc
drwxr-xr-x.   2 root root    6 Apr 11  2018 home
lrwxrwxrwx.   1 root root    7 Dec  1  2022 lib -> usr/lib
lrwxrwxrwx.   1 root root    9 Dec  1  2022 lib64 -> usr/lib64
drwxr-xr-x.   2 root root    6 Apr 11  2018 media
drwxr-xr-x.   5 root root   44 Apr 24 17:35 mnt
drwxr-xr-x.   2 root root   51 May  7 15:03 opt
dr-xr-xr-x  113 root root    0 Jun 10 15:02 proc
dr-xr-x---.   2 root root  164 Jun 10 15:24 root
drwxr-xr-x   23 root root  640 Jun 10 15:02 run
lrwxrwxrwx.   1 root root    8 Dec  1  2022 sbin -> usr/sbin
drwxr-xr-x.   2 root root    6 Apr 11  2018 srv
dr-xr-xr-x   13 root root    0 Jun 10 15:02 sys
drwxrwxrwt.   8 root root  182 Jun 10 15:03 tmp
drwxr-xr-x.  13 root root  155 Dec  1  2022 usr
drwxr-xr-x.  19 root root  267 Dec  1  2022 var
```

基本格式

```shell
ln -s [原文件或目录] [软链接名]   	# 给原文件创建一个软连接
```

经验之谈：

-   删除软链接：rm -rf 软链接名，而不是rm -rf 软链接名/
-   如果使用 **rm -rf 软链接名/ 删除**，**会把软链接对应的真实目录下的内容删除掉**
    -   如果链接的是一个文件，那么即使 rm -rf 软链接名/  的方式也不会将源文件删除
-   查询：通过ll 就可以查看，列表属性第一位是 l ，尾部会有位置指向

演示

```shell
[root@basenode ~]# ll
total 8
-rw-------. 1 root root 1535 Dec  1  2022 anaconda-ks.cfg
-rw-r--r--  1 root root   28 Jun 10 15:24 a.txt
[root@basenode ~]# pwd 
/root
# 从上可知，在我们/root目录下有个 a.txt文件，我们想在 /opt目录下访问它，可以创建一个软链接
[root@basenode ~]# cd /opt
[root@basenode opt]# ln -s /root/a.txt a.txt
[root@basenode opt]# ll
total 12
-rw-r--r-- 1 root root 4328 May  7 15:05 1.txt
lrwxrwxrwx 1 root root   11 Jun 10 15:37 a.txt -> /root/a.txt  # 这就是我们创建的软链接
# 删除软链接
[root@basenode opt]# rm -rf a.txt	# 这样只是删除软链接
```



## 4、文件的压缩与解压

### zip压缩文件

基本格式

```
zip [选项] XXX.zip 将要压缩的内容
```

注意：

​	**zip 可以压缩文件或目录**

​	zip命令在window linux都可以使用，可以压缩目录保留源文件

| 选项 | 说明                                                       |
| ---- | ---------------------------------------------------------- |
| -m   | 删除源文件（当被压缩的内容为单个文件时，可以使用gzip代替） |
| -r   | **级联压缩（递归压缩）**                                   |
| -j   | 忽略子目录内容（即压缩当前目录下文件，但不包括子目录）     |
| -n   | 排除没必要压缩的文件，文件之间用 : 分割                    |
| -t   | 压缩某一日之后的文件                                       |
| -y   | 压缩原文件的链接，而不是压缩源文件                         |
| -5   | 指定压缩率 范围（-1~-9   -9最高）                          |
| -@   | 批量压缩，压缩完成按 ctrl+d结束                            |

演示

```shell
# 将当前目录下的所有文件直接压缩成 .zip形式
[root@redhat01 file1]# zip file.zip *
```

```shell
# 将当前目录下的所有文件直接压缩成 .zip形式，并删除源文件
[root@redhat01 file1]# zip -m file.zip *
```

### uzip解压文件

解压文件，将压缩文件file.zip 中，除了file13中的其他文件都解压出来

```shell
[root@redhat01 opt]# unzip file.zip -x file13
```

| 选项     | 说明                         |
| -------- | ---------------------------- |
| -x       | 排除不需要解压的文件         |
| -d<目录> | 指定**解压后文件的存放路径** |



### gzip 压缩文件

gzip 用于压缩文件，只能将文件**压缩为 *.gz** 的文件

注意：

-   gzip 只能压缩文件，**不能压缩目录**
-   不保留原来的文件
-   同时多个文件会产生多个压缩包（即不会把多个文件压缩在一起，而是各自是压缩包）

使用gzip简单压缩

```shell
[root@basenode file]# ll
total 0
-rw-r--r-- 1 root root 0 Jun 11 21:22 file1
-rw-r--r-- 1 root root 0 Jun 11 21:22 file2
-rw-r--r-- 1 root root 0 Jun 11 21:22 file3
drwxr-xr-x 2 root root 6 Jun 11 21:22 file4
[root@basenode file]# gzip file1
[root@basenode file]# ll		# 压缩以后，原文件不见了
total 4
-rw-r--r-- 1 root root 26 Jun 11 21:22 file1.gz
-rw-r--r-- 1 root root  0 Jun 11 21:22 file2
-rw-r--r-- 1 root root  0 Jun 11 21:22 file3
drwxr-xr-x 2 root root  6 Jun 11 21:22 file4
# 同时压缩多个文件
[root@basenode file]# gzip file2 file3
[root@basenode file]# ll		# 压缩以后的文件，并没有压缩成一个
total 12
-rw-r--r-- 1 root root 26 Jun 11 21:22 file1.gz
-rw-r--r-- 1 root root 26 Jun 11 21:22 file2.gz
-rw-r--r-- 1 root root 26 Jun 11 21:22 file3.gz
drwxr-xr-x 2 root root  6 Jun 11 21:22 file4

[root@basenode file]# gzip file4
gzip: file4 is a directory -- ignored	#  提示file4是目录，被忽略，即不能压缩目录
```

### gunzip 解压缩文件

解压 .gz文件

```shell
[root@basenode file]# gunzip file1
[root@basenode file]# ll
total 8
-rw-r--r-- 1 root root  0 Jun 11 21:22 file1
-rw-r--r-- 1 root root 26 Jun 11 21:22 file2.gz
-rw-r--r-- 1 root root 26 Jun 11 21:22 file3.gz
drwxr-xr-x 2 root root  6 Jun 11 21:22 file4
[root@basenode file]# gunzip file2.gz file3.gz 
[root@basenode file]# ll
total 0
-rw-r--r-- 1 root root 0 Jun 11 21:22 file1
-rw-r--r-- 1 root root 0 Jun 11 21:22 file2
-rw-r--r-- 1 root root 0 Jun 11 21:22 file3
drwxr-xr-x 2 root root 6 Jun 11 21:22 file4
```

### 文件打包 tar

tar是一个**打包程序**，它能将指定的文件或目录打包成一个文件，但是它并不能压缩。

tar默认情况下，只是做打包归档的

**gzip无法将多个文件压缩成一个文件**。所以我们可**以使用tar将多个文件打包成一个文件**，然后在使用gzip压缩

拓展名为 **.tar.gz 或 .tgz**的文件都属于这类文件

基本格式

```
tar [选项] 打包后的文件名.tar.gz 要打包的文件
```

打包

```
tar -cvf file.tar
```

再打包

```
tar -hcvf file.tar
```

| 选项 | 说明                                       |
| ---- | ------------------------------------------ |
| -z   | 用gzip压缩（**打包的同时还需要进行压缩**） |
| -c   | 创建新文件（产生.tar文件，即**打包**）     |
| -C   | **解压缩到指定目录**                       |
| -v   | 显示命令执行的信息                         |
| -f   | 指定压缩后的文件名                         |
| -x   | 解开tar文件（**解包**）                    |
| -h   | 重新打包                                   |
| -r   | 将一个新文件加入到打包的文件中             |

演示

```shell
# 将 file目录 test文件 打包 成temp.tar.gz 
[root@basenode opt]# tar -zcvf temp.tar.gz file/ test 
file/			# 压缩过程
file/file4/
file/file1
file/file2
file/file3
test
[root@basenode opt]# ll
total 16
-rw-r--r-- 1 root root 4328 May  7 15:05 1.txt
drwxr-xr-x 3 root root   58 Jun 11 21:26 file
-rw-r--r-- 1 root root    0 May  7 14:59 hello.txt
drwxr-xr-x 2 nhk  root    6 Jun 11 13:53 kk
-rw-r--r-- 1 root root 1819 May  7 15:03 profile
-rw-r--r-- 1 root root  217 Jun 11 21:47 temp.tar.gz	# 压缩后的文件
-rw-r--r-- 1 nhk  nhk     0 Jun 11 20:48 test
[root@basenode opt]# 

# 将 temp.tar.gz 解压至 /root
[root@basenode opt]# tar -zxvf temp.tar.gz -C /root
file/
file/file4/
file/file1
file/file2
file/file3
test
[root@basenode opt]# ll /root
total 4
-rw-------. 1 root root 1535 Dec  1  2022 anaconda-ks.cfg
drwxr-xr-x  3 root root   58 Jun 11 21:26 file
-rw-r--r--  1 nhk  nhk     0 Jun 11 20:48 test
```



## 5、设置文件/目录访问权限

### 使用chmod修改文件/目录的访问权限

用户可使用“**chmod**”命令修改文件权限，权限通常有两种表示方法，数字表示法，文字表示法

```
原始权限           转为数字  	      数字表示法

rwxrwxrwx       421 421 421	  777

rwxr-xr-x          421 401 401	  755

rw-rw-rw-         420 420 420	  666

rw-r--r--     	   420 400 400	   644
```

#### 数字表示法777

使用chmod改变权限，格式如下

```
chmod xxx 文件名    其中xxx表示数字
```

#### 字符表示法rwx

格式如下：

```
chmod [who] [+ / - / = ] [mode] 文件名

who表示四种不同用户：

u 表示user（用户）

g 表示group（同组用户）

o 表示others （其他用户）

a 表示all （所有用户），系统默认值

 [+ / - / = ]

+表示增加权限

-表示减少权限

=表示重新设定权限

[mode] 表示三种权限

r 可读 	w 可写 	x 可执行
```

下面为将file1权限由 -rw-r--r-- 改为 -rwxrw----

```
chmod u+x,g+w,o-r ./file

或

[root@redhat01 file1]# chmod u=rwx,g=rw ./file1
```

注意：命令中的逗号前后不能加空格，否则命令错误

#### 目录权限的修改

目录权限的修改与文件权限的修改类似，只需要再目录后加上 “*”即可

修改file1目录的权限

```
[root@redhat01 opt]# chmod u=rwx,g=rw,o=r ./file1/*

或

[root@redhat01 opt]# chmod 764 ./file1/*
```

如果改文件中还有其他子目录，则需要使用 “-R”参数

```
[root@redhat01 opt]# chmod -R 764 ./file1/*
```

### 使用chown改变目录/文件所有权

一般文件的创建者便是文件拥有者，可使用root权限修改其拥有者。

命令格式

```
chown 变更后的拥有者:变更后的组 文件

chown 变更后的拥有者 文件
```

```
[root@redhat01 opt]# chown nhk file1
[root@redhat01 opt]# ll
total 4
drwxr-xr-x. 2 nhk  root  82 Mar 11 03:55 file1
-rw-r--r--. 1 root root   0 Mar 11 02:50 file12
-rw-r--r--. 1 root root   0 Mar 11 02:50 file13
lrwxrwxrwx. 1 root root   7 Mar 10 07:22 file1.ln -> ./file1
-rw-r--r--. 1 root root 440 Mar 11 02:54 file.zip
drwxr-xr-x. 2 root root   6 Mar  9  2015 rh
[root@redhat01 opt]# chown nhk:nhk file1
[root@redhat01 opt]# ll
total 4
drwxr-xr-x. 2 nhk  nhk   82 Mar 11 03:55 file1
-rw-r--r--. 1 root root   0 Mar 11 02:50 file12
-rw-r--r--. 1 root root   0 Mar 11 02:50 file13
lrwxrwxrwx. 1 root root   7 Mar 10 07:22 file1.ln -> ./file1
-rw-r--r--. 1 root root 440 Mar 11 02:54 file.zip
drwxr-xr-x. 2 root root   6 Mar  9  2015 rh

```

## 6、管理磁盘存储器

### 查看目录结构 tree

基本格式

```shell
tree 路径
```

默认的Linux没有该命令，需要先安装

```shell
yum install tree
```

演示

```shell
[root@basenode opt]# pwd
/opt
[root@basenode opt]# 
[root@basenode opt]# tree ./
./
├── 1.txt
├── hello.txt
└── profile
```



### 查看磁盘使用情况

#### 查看磁盘空间使用情况 df

df：disk free	空余磁盘

基本格式

```shell
df 参数   # 列出文件系统的整体磁盘使用量，检查文件系统的磁盘空间占用情况
```

| 参数 | 描述                                               |
| ---- | -------------------------------------------------- |
| -h   | 可以将字节数转换为MB、GB，方便阅读。（人性化显示） |

演示

```shell
# 显示文件系统的有效空间
[root@nhk /]# df -h
Filesystem               Size  Used Avail Use% Mounted on
devtmpfs                 894M     0  894M   0% /dev	  
tmpfs                    910M     0  910M   0% /dev/shm
tmpfs                    910M   11M  900M   2% /run
tmpfs                    910M     0  910M   0% /sys/fs/cgroup
/dev/mapper/centos-root   20G  4.3G   16G  22% /
/dev/sda1                253M  166M   88M  66% /boot
tmpfs                    182M   20K  182M   1% /run/user/0
/dev/sr0                 4.4G  4.4G     0 100% /run/media/root/CentOS 7 x86_64

# 解释
devtmpfs 	管理所有的设备
tmpfs 临时文件系统，是基于内存
/dev/shm  即 share memory 所有系统进程都能访问的，共享
```



#### 查看文件和目录占用磁盘情况 du

du：disk usage 磁盘占用情况

基本格式

```shell
du [参数] 目录/文件		# 显示目录下每个子目录的磁盘使用情况
```

参数说明

| 参数          | 描述                                            |
| ------------- | ----------------------------------------------- |
| -h            | 以人性化的方式显示 （GBytes、MBytes、KBytes等） |
| -a            | **不仅查看子目录大小，还要包括文件**            |
| -c            | 显示所有的文件和子目录大小后，**显示总和**      |
| -s            | 只显示总和                                      |
| --max-depth=n | 指定统计子目录的深度为第n层                     |

```shell
[nhk@redhat01 ~]$ du -sh /home   # 查看/home目录磁盘占用情况
4.2M	/home
```

```shell
[root@basenode etc]# du --max-depth=1 -ah  # 只显示当前下面一级的子目录或文件
4.0K	./fstab
0	./crypttab
0	./mtab
4.0K	./resolv.conf
.......

4.0K	./.updated
4.0K	./resolv.conf.save
12K	./aliases.db
4.0K	./libreport
31M	.
```



### 查看设备挂载情况 lsblk

基本格式

```shell
lsblk 	# 查看设备挂载情况
```

| 参数 | 描述                                         |
| ---- | -------------------------------------------- |
| -f   | 查看详细的设备挂载情况，**显示文件系统信息** |

```shell
[root@basenode ~]# lsblk 
NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda               8:0    0   20G  0 disk 
├─sda1            8:1    0  256M  0 part /boot
└─sda2            8:2    0 19.8G  0 part    # part即分区
  ├─centos-root 253:0    0 15.8G  0 lvm  /
  └─centos-swap 253:1    0    4G  0 lvm  [SWAP]
sr0              11:0    1 1024M  0 rom   # 光驱
[root@basenode ~]# lsblk -f
NAME            FSTYPE      LABEL UUID                                   MOUNTPOINT
sda                                                                      
├─sda1          xfs               c5124c42-573f-47d8-a85f-9b37ab2cc49e   /boot
└─sda2          LVM2_member       po0RG1-HdPO-P0IA-nCwF-XRsh-7coD-7f2wpS 
  ├─centos-root xfs               4ee993cd-d35b-4b12-b052-29f12e869314   /
  └─centos-swap swap              eea3db01-752f-4451-a702-808aab31b709   [SWAP]
sr0                               

# sda、sdb 分别表示第一块硬盘、第二块硬盘，依此类推
# sda1、sda2 分别表示磁盘的第一个分区、第二个分区，依此类推
# 说明
sda、sdb、....    ===> 表示使用的硬盘类型为 SATA（容量大、成本低）或SCSI（性能高）
hda、hdb.....     ===> 表示使用的磁盘类型为 IDE
vda              ===> 表示使用的是虚拟磁盘
```

​	

### fdisk 硬盘分区

基本语法

```
fdisk -l 	# 查看磁盘分区详情
fdisk 硬盘设备名		# 对新增硬盘进行分区操作
```

| 选项 | 说明                   |
| ---- | ---------------------- |
| -l   | 显示所有硬盘的分区列表 |

注意：

​	**该命令只有 root用户才能使用**

```shell
[root@basenode ~]# fdisk -l

Disk /dev/sda: 21.5 GB, 21474836480 bytes, 41943040 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk label type: dos
Disk identifier: 0x000a98ca

   Device Boot      Start         End      Blocks   Id  System
/dev/sda1   *        2048      526335      262144   83  Linux 
/dev/sda2          526336    41943039    20708352   8e  Linux LVM
 # sda1表示 sda的第一块分区
 # Start         End 开始结束位置
 # Blocks  表示当前分区容量大小	
 # id 分区类型的id
Disk /dev/mapper/centos-root: 16.9 GB, 16907239424 bytes, 33021952 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes


Disk /dev/mapper/centos-swap: 4294 MB, 4294967296 bytes, 8388608 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
```



## 7、使用光盘

### 挂载和卸载光盘 u/mount

对于Linux用户来讲，不论有几个分区，分别给哪几个目录使用，它总归就是一个根目录，一个独立且唯一的文件结构。

Linux中每个分区都是用来组成整个文件系统的一部分，它在用一种叫“挂载”的处理方法，它整个文件系统包含一整套的文件和目录，并**将一个分区和一个目录联系起来，要载入的那个分区将使用它存储空间在这个目录下获得。**

**mount命令基本语法**

```shell
mount [-t vfstype] [-o options] device dir 	# 挂载设备
```

**umount命令基本语法**

```shell
umount 设备文件路径或挂载点路径	# 挂载设备
```

挂载光盘 mount

```
[root@redhat01 nhk]# mount /mnt/cdrom
```

卸载光盘 umount

```
[root@redhat01 nhk]# umount /mnt/cdrom
```

演示

```shell
[root@basenode ~]# lsblk 
NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda               8:0    0   20G  0 disk 
├─sda1            8:1    0  256M  0 part /boot
└─sda2            8:2    0 19.8G  0 part 
  ├─centos-root 253:0    0 15.8G  0 lvm  /
  └─centos-swap 253:1    0    4G  0 lvm  [SWAP]
sr0              11:0    1  4.4G  0 rom  /run/media/nhk/CentOS 7 x86_64 # 我们挂载的光盘
[root@basenode ~]# ls /run/media/nhk/CentOS\ 7\ x86_64/   # 查看光盘内容
CentOS_BuildTag  GPL       LiveOS    RPM-GPG-KEY-CentOS-7
EFI              images    Packages  RPM-GPG-KEY-CentOS-Testing-7
EULA             isolinux  repodata  TRANS.TBL

```

演示手动挂载

```shell
[root@basenode ~]# ll /dev | grep rom
lrwxrwxrwx. 1 root root           3 Jun 12 01:45 cdrom -> sr0
crw-rw----+ 1 root cdrom    21,   1 Jun 12 01:40 sg1
brw-rw----+ 1 root cdrom    11,   0 Jun 12 01:45 sr0
[root@basenode ~]# mkdir /mnt/cdrom
[root@basenode ~]# mount /dev/cdorm /mnt/cdrom
mount: special device /dev/cdrom does not exist # 提示找不到挂载设备，原因可能是我们使用的是带gui的Linux，它会帮我们自动挂载，解决方法：
我们可以去vmware注销掉用户，重新在vmware上设置我们的光盘状态为 已连接
# 再次尝试
[root@basenode ~]# mount /dev/cdrom /mnt/cdrom
mount: /dev/sr0 is write-protected, mounting read-only
[root@basenode ~]# lsblk
NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda               8:0    0   20G  0 disk 
├─sda1            8:1    0  256M  0 part /boot
└─sda2            8:2    0 19.8G  0 part 
  ├─centos-root 253:0    0 15.8G  0 lvm  /
  └─centos-swap 253:1    0    4G  0 lvm  [SWAP]
sr0              11:0    1  4.4G  0 rom  /mnt/cdrom
[root@basenode ~]# ls /mnt/cdrom/    # 查看光盘内容
CentOS_BuildTag  GPL       LiveOS    RPM-GPG-KEY-CentOS-7
EFI              images    Packages  RPM-GPG-KEY-CentOS-Testing-7
EULA             isolinux  repodata  TRANS.TBL

# 卸载光盘
[root@basenode ~]# umount /dev/cdrom   # 这里可以填挂载点路径或设备路径
[root@basenode ~]# lsblk
NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda               8:0    0   20G  0 disk 
├─sda1            8:1    0  256M  0 part /boot
└─sda2            8:2    0 19.8G  0 part 
  ├─centos-root 253:0    0 15.8G  0 lvm  /
  └─centos-swap 253:1    0    4G  0 lvm  [SWAP]
sr0              11:0    1  4.4G  0 rom  

```

#### 设置开机自动挂载

需要修改 **/etc/fstab** 文件

演示开启自动挂载

```shell
vim /etc/fstab 
```

修改如下

在文件末尾加上如下

```shell
/dev/cdrom                                  /mnt/cdrom      iso9660 defaults        0 0
```

解释

```
/dev/cdrom  表示挂载设备，这里可以直接填挂载设备路径，也可以填挂载设备的UUID（使用lsblk -f 可查看）
/mnt/cdrom 表示挂载点
iso9660 	表示文件系统类型
0 0 	第一个0 dump：是否做备份，0表示忽略，1表示做备份   
		第二个0 文件系统优先级：1为最高，0为不检查
```

