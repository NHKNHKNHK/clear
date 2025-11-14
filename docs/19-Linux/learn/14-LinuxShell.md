# Linux Shell

Shell可以看作是一个**命令行解释器**，为我们提供了交互式的文本控制台界面它接收应用程序/用户命令，然后调用操作系统内核。即Shell是用户与操作系统内核之间的接口。

Shell还是一个功能相当强大的编程语言，易编写、易调试、灵活性强。

**查看Linux提供的shell解释器**

```shell
[root@basenode opt]# cat /etc/shells 
/bin/sh
/bin/bash
/usr/bin/sh
/usr/bin/bash

```

 查看系统当前默认shell

```shell
ls -l /bin/ | grep sh

[root@basenode ~]# ls -l /bin/ | grep bash
-rwxr-xr-x. 1 root root    964608 Oct 31  2018 bash
lrwxrwxrwx. 1 root root        10 Dec  1 14:08 bashbug -> bashbug-64
-rwxr-xr-x. 1 root root      6964 Oct 31  2018 bashbug-64
lrwxrwxrwx. 1 root root         4 Dec  1 14:08 sh -> bash   # sh链接到bash，所以我们编写shell时，#!/bin/bash  或 #!/bin/sh 都可以

echo $SHELL
```

## shell脚本入门

### 1）脚本格式

脚本以 **#!/bin/bash** 开头（宣告解释器名称）



### **2）编写自己的第一个shell**

```shell
cd /opt
mkdir scripts
touch hello.sh  

vim hello.sh 
# 内容如下

#!/bin/bash
echo "hello world"

```

### 3）执行shell脚本

第一种方式（**不要赋予脚本+x权限**）

即被执行的脚本没有可执行权限时，只能使用该方式调用

```shell
sh 脚本相对路径
sh 脚本绝对路径
bash 脚本相对路径
bash 脚本绝对路径
```

演示

```shell
[root@basenode scripts]# sh ./hello.sh 
hello world
[root@basenode scripts]# sh /opt/scripts/hello.sh 
hello world
[root@basenode scripts]# bash ./hello.sh 
hello world
[root@basenode scripts]# bash /opt/scripts/hello.sh 
hello world

```

第二种方式**（必须赋予可执行权限）**

先将需要执行的脚本文件赋予可执行权限，然后再直接调用

```shell
[root@basenode scripts]# chmod +x hello.sh 
[root@basenode scripts]# 
[root@basenode scripts]# ./hello.sh
hello world

[root@basenode scripts]# hello.sh     # 使用这种方式，系统会去调用命令，而系统没有该命令会报错
-bash: hello.sh: command not found
# 通过如下方式解决
[root@basenode scripts]# PATH=$PATH:$PWD
[root@basenode scripts]# hello.sh
hello world

```

第三种方式（**使用这种方式不启动子shell**）

在脚本的路径前面加上"." 或者 source

```shell
[root@basenode scripts]# source hello.sh 
hello world
[root@basenode scripts]# . hello.sh 
hello world

```

**注意：**

- 第一种执行方法，本质是bash解释器帮你执行脚本，所以脚本本身不需要执行权限。
- 第二种执行方法，本质是脚本需要自己执行，所以需要执行权限。
- 前两种方式都是在当前shell中打开一个子shell来执行脚本内容，当脚本内容结束，则子shell关闭，回到父shell中
- 第三种，也就是在脚本路径前加“.” 或者source的方式，可以使脚本内容在当前shell里执行，而无需打开子shell  这也是为什么我们每次修改完/etc/profile文件以后，需要source一下的原因
- 开了子shell与不开子shell的区别在于，环境变量的继承关系，如在**子shell中设置的当前变量，父shell是不可见的**

## 变量

### 系统预定义变量

#### 常见系统变量

\$HOME、\$PWD、\$SHELL、​\$USER等

演示

```shell
# 查看系统变量的值
[root@basenode scripts]# echo $HOME
/root

# 显示当前shell中所有的变量
[root@basenode scripts]# set
BASH=/bin/bash
BASHOPTS=checkwinsize:cmdhist:expand_aliases:extquote:force_fignore:histappend:hostcomplete:interactive_comments:login_shell:progcomp:promptvars:sourcepath
BASH_ALIASES=()
BASH_ARGC=()
BASH_ARGV=()
BASH_CMDS=()
BASH_LINENO=()
BASH_SOURCE=()
。。。。。。

```

### 自定义变量

**基本语法**

系统定义的变量一般都是大写，而我们自定义的变量可以小写

1）定义变量： 变量名=变量值   注意：**=号前不能有空格**

2）撤销变量： unset 变量名

3）声明静态变量：	readonly 变量（只读变量） 	 ，注意：不能unset

**变量定义规则**

1）变量名称可以由字母、数字和下划线组成，但是不能以数字开头，**环境变量名建议大写**。

2）等号两则不能有空格

3）在bash中，变量默认类型都是字符串类型，无法直接进行数值运算

4）变量的值如果有空格，需要使用双引号或单引号括起来



演示

```shell
# 定义变量
[root@basenode scripts]# a=10
[root@basenode scripts]# echo a
a
[root@basenode scripts]# a=2  	# 给变量重新复制
[root@basenode scripts]# echo a
a
[root@basenode ~]# unset a   # 撤销变量a
[root@basenode ~]# echo $a

[root@basenode ~]# readonly B=2
[root@basenode ~]# echo $B
2
[root@basenode ~]# unset B        # 静态变量，不能unset
-bash: unset: B: cannot unset: readonly variable
[root@basenode ~]# B=8            # 静态变量，也不能重新赋值（相当于常量）
-bash: B: readonly variable

# 在bash中，变量的默认类型都是字符串类型，无法直接进行数值运算
[root@basenode ~]# echo $C
1+1
# 如果需要进行复制运算，可以用两个括号括起来，或者中括号括起来
[root@basenode ~]# D=$((1+1))
[root@basenode ~]# echo $D
2
[root@basenode ~]# E=$[1+1]
[root@basenode ~]# echo $E
2

# 遇到空格需要用引号引起来，（单引号、双引号都可以）
[root@basenode scripts]# my_var=hello world
-bash: world: command not found
[root@basenode scripts]# my_var="hello world"  
[root@basenode scripts]# echo my_var
my_var
[root@basenode scripts]# env|grep my_var        # 查看环境变量，查询不到
[root@basenode scripts]# set|grep my_var        # 查询当前
my_var='hello world'
[root@basenode scripts]# bash				# 进入子shell
[root@basenode scripts]# set|grep my_var    # 查询变量，查询不到说明my_var是一个局部变量
[root@basenode scripts]# 

# 可将变量提升为全局变量，可供其他shell使用，语法如：export 变量名
C=10
#!/bin/bash
echo "hello world"
echo $B    

# 这里并没有打印出C的值，因为这种方式运行脚本会启动子shell运行，而C属于局部变量，子shell访问不到
[root@basenode scripts]# ./hello.sh   
hello world      

[root@basenode scripts]# export C    # 将C提升为全局变量
[root@basenode scripts]# ./hello.sh     # 此时子shell可以访问到变量C
hello world
10
```

**注意：**

**子shell的修改不会影响父shell**

演示如下

```shell
[root@basenode scripts]# set|grep my_var   # 查看当前变量
my_var='hello world'
[root@basenode scripts]# env|grep my_var   # 查看当前全局变量，查询不到，说明变量为局部变量
[root@basenode scripts]# ps -f       # 确认当前shell为父shell
UID         PID   PPID  C STIME TTY          TIME CMD
root       7105   7103  0 19:53 pts/0    00:00:00 -bash
root       7191   7105  0 20:10 pts/0    00:00:00 tail -10
root       7239   7105  0 20:41 pts/0    00:00:00 ps -f
[root@basenode scripts]# export my_var    # 修改变量为全局变量
[root@basenode scripts]# env|grep my_var     # 查看当前全局变量
my_var=hello world
[root@basenode scripts]# bash      # 进入子shell
[root@basenode scripts]# set|grep my_var   
my_var='hello world'
[root@basenode scripts]# my_var=hh   # 修改子shell的变量
[root@basenode scripts]# set|grep my_var 
my_var=hh
[root@basenode scripts]# exit
exit
[root@basenode scripts]# env|grep my_var  # 查看全局变量，发现子shell的修改不会影响父shell
my_var=hello world
[root@basenode scripts]# 

```

### **特殊变量**

#### **$n**

​	功能描述：n为数字，$0代表该脚本名称，$1~$9代表第一到第九个参数，十以上的参数需要使用大括号包含，如${10}

代码演示

```shell
[root@basenode scripts]# touch parameter.sh
[root@basenode scripts]# vim parameter.sh
#!/bin/bash
echo '=======$n========='
echo $0
echo $1
echo $2

[root@basenode scripts]# chmod +x parameter.sh    # 需要赋予可执行权限才能使用以下方式运行脚本
[root@basenode scripts]# ./parameter.sh abc hello
=======$n=========
./parameter.sh
abc
hello

```

#### **$#**

​	功能描述：获取所有**输入参数个数**，常用于循环，判断参数的个数是否正确以及加强脚本的健壮性

代码演示

```shell
#!/bin/bash
echo '=======$n========='
echo $0
echo $1
echo $2
echo '=======$#========='
echo $#


[root@basenode scripts]# ./parameter.sh   # 一个参数都不输入的情况下，显示0
=======$n=========
./parameter.sh


=======$#=========
0
[root@basenode scripts]# ./parameter.sh abc hello     # 输入两个参数的情况下，显示2
=======$n=========
./parameter.sh
abc
hello
=======$#=========
2

```

#### $* $@

功能描述：

​	$*：这个变量代表命令行中所有的参数，$\*把所有的参数看成是一个整体

​	$@：这个变量也代表命令行中所有的参数，$@把每一个参数区分对待

代码演示

```shell
#!/bin/bash
echo '=======$n========='
echo $0
echo $1
echo $2
echo '=======$#========='
echo $#
echo '=======$*========='
echo $*
echo '=======$@========='
echo $@

[root@basenode scripts]# ./parameter.sh def functions
=======$n=========
./parameter.sh
def
functions
=======$#=========
2
=======$*=========
def functions
=======$@=========
def functions      

```

#### $?

​	功能描述：最后一次执行的命令的返回状态，如果这个变量的值为0，证明上一次的命令执行正确；如果这个变量的值非0（具体哪个数，由命令决定），则证明上一个命令执行不正确

代码演示

```shell
[root@basenode scripts]# ./hello.sh 
hello world
10
[root@basenode scripts]# echo $?     # 上一次命令执行成功，所有这里返回0
0
[root@basenode scripts]# hello.sh 
-bash: hello.sh: command not found
[root@basenode scripts]# echo $?      # 上一次命令执行失败，所有这里返回非0的数
127

```

## 运算符

shell提供了一个函数 expr 用来运算，但是使用起来不是很方便，所有又提供了以下方式

基本用法：

​	**$((运算式))**   或 **$[运算式]**

代码演示

```shell
[root@basenode scripts]# a= 1 + 2   # =号两边不能加空格，所有报错
-bash: 1: command not found
[root@basenode scripts]# a= 1+2
-bash: 1+2: command not found
[root@basenode scripts]# a=1+2 
[root@basenode scripts]# echo $a
1+2
[root@basenode scripts]# expr 1+2  # 这种方式，相当于传入了三个参数1、+、2给expr
1+2
[root@basenode scripts]# expr 1 + 2
3
[root@basenode scripts]# expr 2 - 1
1
[root@basenode scripts]# expr 2 * 1   # *在Linux中有特殊含义，所有需要加\进行转义
expr: syntax error
[root@basenode scripts]# expr 2 \* 1
2
[root@basenode scripts]# echo $[5 * 2]   # 使用中括号括起来以后，表达式可以有空格了
10
[root@basenode scripts]# echo $[5*2]
10
[root@basenode scripts]# echo $((5*2))
10
[root@basenode scripts]# a=$[3+4]
[root@basenode scripts]# echo $a
7
[root@basenode scripts]# a=expr 5 \* 2
-bash: 5: command not found
[root@basenode scripts]# a="expr 5 \* 2"    # 这种方式相当于给变量a赋值了一个字符串
[root@basenode scripts]# echo $a
expr 5 \* 2
[root@basenode scripts]# a=$(expr 5 \* 2)
[root@basenode scripts]# echo $a
10
[root@basenode scripts]# a=`expr 5 \* 2`     # 使用反引号`
[root@basenode scripts]# echo $a
10
[root@basenode scripts]# a=$[(2+3)+4]
[root@basenode scripts]# echo $a
9

# 编写一个做加法运算的脚本
[root@basenode scripts]# vim add.sh
#/bin/bash
sum=$[$1 + $2]
echo $sum

[root@basenode scripts]# chmod +x add.sh 
[root@basenode scripts]# ./add.sh 3 4
7
```

## 条件判断

### 1）基本语法

（1）test condition

（2）[condition] （**注意 condition前后要有空格**）

注意：条件非空即为true      [ clear] 返回true   [] 返回false

演示

```shell
[root@basenode scripts]# a=hello
[root@basenode scripts]# test $a = Hello    # 注意=号两边的空格
[root@basenode scripts]# echo $?     # 返回1表示判断失败
1
[root@basenode scripts]# test $a = hello
[root@basenode scripts]# echo $?     # 返回0表示判断成功
0
[root@basenode scripts]# [ $a = Hello ]     # 注意中括号两边的空格
[root@basenode scripts]# echo $?
1
[root@basenode scripts]# [ $a = hello ]
[root@basenode scripts]# echo $?
0
```

### 2）常用判断条件

因为在Linux中，>(输入重定向) <(输出重定向) 这些符号都有特殊的意义，所有不能直接使用，因此有了如下的比较运算符

#### （1）两个整数之间的比较

| 比较运算符 | 描述                      |
| ---------- | ------------------------- |
| -eq        | 等于（equal）             |
| -ne        | 不等于（not equal）       |
| -lt        | 小于（less than）         |
| -le        | 小于等于（less equal）    |
| -gt        | 大于（greater than）      |
| -ge        | 大于等于（greater equal） |

演示

```shell
[root@basenode scripts]# [ 4 -eq 4 ]   # 判断 4=4
[root@basenode scripts]# echo $?
0
[root@basenode scripts]# [ 4 -ne 4 ]   # 判断 4 != 4
[root@basenode scripts]# echo $?
1
[root@basenode scripts]# [ 4 -ne 3 ]   # 判断 4 != 3
[root@basenode scripts]# echo $?
0
[root@basenode scripts]# [ 3 -lt 4 ]   # 判断 3 < 4
[root@basenode scripts]# echo $?
0
[root@basenode scripts]# [ 3 -le 3 ]   # 判断 3 <= 3
[root@basenode scripts]# echo $?
0
[root@basenode scripts]# [ 5 -gt 3 ]   # 判断 5 > 3
[root@basenode scripts]# echo $?
0
[root@basenode scripts]# [ 5 -ge 5 ]   # 判断 5 >= 5 
[root@basenode scripts]# echo $?
0

```

#### （2）按照文件权限进行判断

| 文件权限 | 说明                    |
| -------- | ----------------------- |
| -r       | 有读的权限（read）      |
| -w       | 有写的权限（write）     |
| -x       | 有执行的权限（execute） |

演示

```shell
-rw-r--r-- 1 root root   0 Apr  5 20:48 test
[root@basenode scripts]# [ -r test ]	# 判断当前用户是否有该文件的读权限
[root@basenode scripts]# echo $?
0
[root@basenode scripts]# [ -w test ]	# 判断当前用户是否有该文件的写权限
[root@basenode scripts]# echo $?
0
[root@basenode scripts]# [ -x test ]	# 判断当前用户是否有该文件的执行权限
[root@basenode scripts]# echo $?
1

```

#### （3）按照文件类型进行判断

|      |                                      |
| ---- | ------------------------------------ |
| -e   | 文件存在（existence）                |
| -f   | 文件存在并且是一个常规的文件（file） |
| -d   | 文件存在并且是一个目录（directory）  |

演示

```shell
[root@basenode scripts]# ll
total 12
-rwxr-xr-x 1 root root  37 Apr  4 21:00 add.sh
drwxr-xr-x 2 root root   6 Apr  5 20:50 dir
-rwxr-xr-x 1 root root  39 Apr  4 19:48 hello.sh
-rwxr-xr-x 1 root root 164 Apr  4 20:42 parameter.sh
-rw-r--r-- 1 root root   0 Apr  5 20:48 test
[root@basenode scripts]# 
[root@basenode scripts]# [ -e file ]	# 判断该文件是否存在
[root@basenode scripts]# echo $?
1
[root@basenode scripts]# [ -f test ]	# 判断该文件是否是文件
[root@basenode scripts]# echo $?
0
[root@basenode scripts]# [ -d file ]	# 判断该文件是否是目录
[root@basenode scripts]# echo $?
1
```

### 3）多条件判断

多条件判断（&& 表示前面一条命令执行成功，才执行后一条命令， || 表示上一条命令执行失败后，才执行后一条命令）

该语法可以完成类似于Java等语言的三目运算

演示

```shell
[root@basenode scripts]# a=15
[root@basenode scripts]# [ $a -lt 20 ] && echo "$a < 20" || echo "$a >= 20"
15 < 20
[root@basenode scripts]# a=27
[root@basenode scripts]# [ $a -lt 20 ] && echo "$a < 20" || echo "$a >= 20"
27 >= 20
# 这里需要注意区分单引号和双引号的区别，单引号原样输出，双引号会把里面的变量转为字面量输出
[root@basenode scripts]# [ $a -lt 20 ] && echo '$a < 20' || echo '$a >= 20'
$a >= 20
```

## 流程控制

### if判断

1）单分支

```shell
if [ 条件判断式 ];then # 注意：条件表达式与 [] 之前必须要有空格
	程序
fi

# 或

if [ 条件判断式 ]
then
	程序
fi
```

演示

```shell
[root@basenode scripts]# a=25
[root@basenode scripts]# if [ $a -gt 20 ]; then echo OK; fi
OK
[root@basenode scripts]# a=15
[root@basenode scripts]# if [ $a -gt 20 ]; then echo OK; fi
[root@basenode scripts]#            # 无输出，因为不满足条件

[root@basenode scripts]# vim if_test.sh
#/bin/bash

if [ $1 = nhk ]
then
        echo "welcome, $1"
fi

[root@basenode scripts]# chmod +x if_test.sh
[root@basenode scripts]# ./if_test.sh 
./if_test.sh: line 3: [: =: unary operator expected   # 报错

# 将shell脚本修改为如下
#/bin/bash

if [ "$1"x = "nhk"x ]
then
        echo "welcome, $1"
fi

# 继续执行脚本，虽然不满足判断条件，但是此时不报错。这也是提升脚本健壮性的一种手段
[root@basenode scripts]# ./if_test.sh 
[root@basenode scripts]# 

# 多条件判断 可以使用 && || 连接多个条件
[root@basenode scripts]# a=25
[root@basenode scripts]# if [ $a -gt 18 ] && [ $a -lt 35 ]; then echo OK; fi 
OK
[root@basenode scripts]# if [ $a -gt 18 && $a -lt 35 ]; then echo OK; fi 
-bash: [: missing `]'
# 也可以使用 -a（and） -o（or）来连接多个条件
[root@basenode scripts]# if [ $a -gt 18 -a $a -lt 35 ]; then echo OK; fi 
OK

```

2）多分支

```shell
if [ 条件判断式 ]
then
	程序
elif [ 条件判断式 ]
then
	程序
fi
```

注意事项：

- [  条件判断式  ] ：**中括号与条件判断式之间必须有空格**
- if 后面要有空格

演示

```shell
[root@basenode scripts]# vim if_test2.sh

#!/bin/bash
# 输入参数，表示年龄,判断属于哪个年龄段
if [ $1 -lt 18 ]
then
        echo '未成年人'
elif [ $1 -lt 35 ]
then    
        echo '青年人'
elif [ $1 -lt 60 ]
then    
        echo '中年人'
else
        echo '老年人'
fi

[root@basenode scripts]# chmod +x if_test2.sh 
[root@basenode scripts]# ./if_test2.sh 10
未成年人
[root@basenode scripts]# ./if_test2.sh 20
青年人
[root@basenode scripts]# ./if_test2.sh 50
中年人
[root@basenode scripts]# ./if_test2.sh 66
老年人

```

### case语句

基本语法

```shell
case $变量名 in
"值1")
	如果变量的值等于值1，则执行程序1
;;
"值2")
	如果变量的值等于值2，则执行程序2
;;
	....省略
*)
	如果变量的值不等于上面任何一个，则执行该程序
;;
esac
```

注意：

- case行尾必须为单词 in ，每一个模式匹配必须以右括号 ) 结束
- 双分号 ;; 表示命令序列结束。相当于Java语言的break
- 最后的 *) 表示默认模式，相当于Java语言的default

```shell
[root@basenode scripts]# vim case_test.sh
#!/bin/bash
case $1 in
"1")
        echo "one"
;;
"2")
        echo "two"
;;
"3")    
        echo "three"
;;
*)
        echo "else number"
;;
[root@basenode scripts]# chmod +x case_test.sh 
[root@basenode scripts]# ./case_test.sh 1
one
[root@basenode scripts]# ./case_test.sh 2
two
[root@basenode scripts]# ./case_test.sh 3
three
[root@basenode scripts]# ./case_test.sh 4
else number
```

### for循环

基本语法

```shell
for (( 初始值;循环控制条件;变量变化 ))
do
	程序
done

# 或
for 变量 in 值1 值2 值3...
do
	程序
done

```

演示

```shell
# 下面是1~100的和
[root@basenode scripts]# vim for_test.sh
#!/bin/bash
for (( i=0;i<=100;i++ ))   # 注意：这里使用了(()) 或者是 [],所有可以使用数学符号<=
do
        sum=$[ $sum + $i ]
done
echo $sum

[root@basenode scripts]# chmod +x for_test.sh 
[root@basenode scripts]# ./for_test.sh 
5050

# 打印所有的参数
[root@basenode scripts]# vim for_test2.sh 
#!/bin/bash
for i in linux mysql hadoop
do      
        echo "this is $i"
done

[root@basenode scripts]# chmod +x for_test2.sh 
[root@basenode scripts]# ./for_test2.sh 
this is linux
this is mysql
this is hadoop

# 下面是使用循环打印1~100的和    {1..100}相当于python的range(1,101)
[root@basenode scripts]# for i in {1..100};do sum=$[$sum+$i];done; echo $sum
5050

```

#### 采用循环比较$* 与 $@的区别

$*与$@都表传递函数或脚本的所有参数，不被双引号包含时，都是以$1,$2...$n的形式输出

```shell
[root@basenode scripts]# vim for_test3.sh 
#!/bin/bash
echo '===============$*================='
for i in $*
do
        echo "this is $i"
done

echo '===============$@================='
for i in $@
do
        echo "this is $i"
done

[root@basenode scripts]# chmod +x for_test3.sh 
[root@basenode scripts]# ./for_test3.sh a b c d e 
===============$*=================
this is a
this is b
this is c
this is d
this is e
===============$@=================
this is a
this is b
this is c
this is d
this is e

# 当将 $*与$@都用双引号包含时，如下
#!/bin/bash
echo '===============$*================='
for i in "$*"
do
        echo "this is $i"
done

echo '===============$@================='
for i in "$@"
do
        echo "this is $i"
done

[root@basenode scripts]# ./for_test3.sh a b c d e 
===============$*=================
this is a b c d e
===============$@=================
this is a
this is b
this is c
this is d
this is e

```

### while循环

基本语法

```shell
while [ 条件判断式 ]
do
	程序
done
```

演示

```shell
[root@basenode scripts]# vim while_test.sh
#!/bin/bash
a=1
while [ $a -le $1 ]
do
        sum=$[ $sum + $a ]
        a=$[$a + 1]
done
echo $sum


[root@basenode scripts]# chmod +x while_test.sh 
[root@basenode scripts]# ./while_test.sh 100
5050

# 在新版本的Linux中，也可以使用如下方式书写
#!/bin/bash
a=1
while [ $a -le $1 ]
do
        #sum=$[ $sum + $a ]
        #a=$[$a + 1]
        let sum+=a
        let a++
done
echo $sum

```

### read读取控制台输入

基本语法

```shell
read (选项) (参数)
# 选项
	-p 指定读取值时的提示符
	-t	指定读取值时等待的时间（秒） 如果不加-t则表示一直等待
	
# 参数
	变量：指定读取值的变量名
```

演示

```shell
[root@basenode scripts]# vim read_test.sh
#!/bin/bash
read -t 10 -p "请输入你的大名: " name
echo "欢迎, $name"

[root@basenode scripts]# chmod +x read_test.sh 
[root@basenode scripts]# ./read_test.sh 
请输入你的大名: nhk
欢迎, nhk
[root@basenode scripts]# ./read_test.sh    # 没有输入参数，10秒后自动退出
请输入你的大名: 欢迎, 
[root@basenode scripts]# 

```

## 函数

### 系统函数

**basename**  （可以简单理解为取路径里的文件名称）

基本用法

```shell
basename [string / pathname] [shuffix]
```

选项：

​	 shuffix 为后缀，如果shuffix被指定了，basename会将pathname或string中的shuffix去掉

功能描述：

​	basename命令会删除掉所有的前缀包括最后一个“/”字符，然后将字符串显示出来

演示

```shell
[root@basenode shirenlibai]# basename /opt/shirenlibai/libai.txt 
libai.txt
[root@basenode shirenlibai]# basename /opt/shirenlibai/libai.txt .txt
libai
```

**dirname**

基本语法

```
dirname 文件绝对路径   （可以理解为取文件路径的绝对路径名称）
```

功能描述：

​	从给定的包含决定路径的文件名中去除文件名（非目录部分），然后返剩下的路径（目录的部分）

演示

```shell
[root@basenode shirenlibai]# dirname /opt/shirenlibai/libai.txt
/opt/shirenlibai

```

### 自定义函数

基本语法

```shell
[function] funname[()]
{
	action;
	[return int;]
}

# [function]  [()]  [return int;] 这些中括号代表的是可选
```

小结：

​	必须在调用函数之前，先声明函数，因为shell脚本是逐行执行的。不会像其他语言一样先编译

​	函数返回值，只能通过$?系统变量获得，可以显示加：return 返回。如果不加，将以最后一条命令运行结果，作为返回值。return后跟的数值n（0~255）

演示

```shell
[root@basenode scripts]# vim fun.sh
#!/bin/bash
function sum(){
        s=$[$1 + $2]
        echo $s
}

read -p "请输入第一个数：" a
read -p "请输入第二个数：" b

sums=$(sum $a $b)
echo "两数之和为: $sums"

[root@basenode scripts]# chmod +x fun.sh 
[root@basenode scripts]# ./fun.sh
请输入第一个数：3
请输入第二个数：4
两数之和为: 7

```


## 正则表达式

在Linux中，grep、sed、wak等文本处理工具都支持通过正则表达式进行模式匹配

### 常规匹配

一串不包括特殊字符的正则表达式匹配它自己，例如：

```shell
[root@basenode ~]# cat /etc/passwd | grep nhk
nhk:x:1000:1000:nhk:/home/nhk:/bin/bash
```

### 常用特殊字符串

#### ^ 匹配一行的开头

```shell
[root@basenode ~]# cat /etc/passwd | grep ^nhk
nhk:x:1000:1000:nhk:/home/nhk:/bin/bash
```

#### $ 匹配一行的结束

```shell
[root@basenode ~]# cat /etc/passwd | grep /bin/bash$
root:x:0:0:root:/root:/bin/bash
nhk:x:1000:1000:nhk:/home/nhk:/bin/bash
ninghk:x:1001:1001::/home/ninghk:/bin/bash
```

```shell
# 匹配空行
[root@basenode ~]# cat /etc/passwd | grep ^$
```

#### \. 匹配任意一个字符

```shell
# 匹配 rXXt 
[root@basenode ~]# cat /etc/passwd | grep r..t
root:x:0:0:root:/root:/bin/bash
operator:x:11:0:operator:/root:/sbin/nologin
ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin
```

#### \* 匹配上一个字符出现n次

\* 一般不单独使用，他和上一次字符连用，表示匹配上一个字符0次或多次

```shell
[root@basenode ~]# cat /etc/passwd | grep r*
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
...
```

注意：

​		**.* 表示任意字符出现任意次数**

#### 字符区间

**[] 表示匹配某个范围内的一个字符**，例如：

[6,8]	匹配6或8

[6-8]	匹配6到8

[0-9]* 	匹配任意长度的数字字符串

[a-z]	匹配一个a-z之间的字符

[a-z]*	匹配任意长度的字母字符串	

[a-c,e-f]	匹配a-c或 e-f 之间的任意字符