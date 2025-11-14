# **管道与重定向** 

## 管道 

将前面命令的结果作为参数传递给后面的命令 

例如

```shell
[root@basenode ~]# ls | grep bin
bin
```

## 重定向 

重定向有4种方式：输出重定向、输入重定向、错误重定向，以及同时实现输出和错误重定向

### 输出重定向

输出重定向，即将某一命令执行的输出保存到文件中，如果文件存在相同时，则覆盖源文件内容

基本语法

```
[命令] > [文件]
```

例如：

```shell
# 将 /boot目录的内容保存至 /root/test文件中
[root@basenode ~]# ls /boot/ > /root/test

[root@basenode ~]# cat test 	# 查看test文件内容
config-3.10.0-1160.el7.x86_64
efi
grub
grub2
initramfs-0-rescue-7da7d3aac3ae4b43a6d16022d84eb4d9.img
initramfs-3.10.0-1160.el7.x86_64.img
initramfs-3.10.0-1160.el7.x86_64kdump.img
symvers-3.10.0-1160.el7.x86_64.gz
System.map-3.10.0-1160.el7.x86_64
vmlinuz-0-rescue-7da7d3aac3ae4b43a6d16022d84eb4d9
vmlinuz-3.10.0-1160.el7.x86_64

# 将在 ”hello“ 重定向到 /root/test文件中
[root@basenode ~]# echo "hello" > /root/test 
[root@basenode ~]# cat test 	# 再次查看，test文件，发现将原来的内容覆盖了
hello
```

### 追加输出重定向

追加输出重定向是特殊的输出重定向，即将某一命令执行的结果输出添加到已存在的文件中

基本语法

```
[命令] >> [文件]
```

例如：

```shell
[root@basenode ~]# cat test 
hello
[root@basenode ~]# echo "world" >> /root/test 
[root@basenode ~]# cat test 
hello
world
```

### 输入重定向

输入重定向，即将某一文件的内容作为命令的输入

基本语法

```
[命令] < [文件]
```

例如：

```shell
[root@basenode ~]# cat test 
hello
world
# 将test文件的内容作为输入让 cat命令执行
[root@basenode ~]# cat < test
hello
world
```

### 输入追加重定向

追加输入重定向是特殊的输入重定向，这种输入重定向告诉 Shell，当前标准输入来自命令行的一堆分隔符之间的内容。

基本语法

```shell
[命令] << [分隔符]
> [文本内容]
> [分隔符]
```

例如：

```shell
# 使用输入追加重定向创建/root/abc文件
[root@basenode ~]# cat > /root/abc << EOF
> HELLO LINUX
> EOF			# 一般采用 EOF 作为分隔符
[root@basenode ~]# cat abc 
HELLO LINUX
```

### 错误重定向

错误重定向，即将某一命令执行的出错信息输出到指定的文件中

基本语法

```
[命令] 2> [文件]
```

例如：

```shell
# 查看不存在的文件 java，出现报错信息重定向至 log文件
[root@basenode ~]# cat /root/java 2> /root/log
[root@basenode ~]# cat log 
cat: /root/java: No such file or directory
```

### 错误追加重定向

错误追加重定向是一种特殊的重定向，即将某一命令执行的出错信息添加到已经存在的文件中

基本语法

```
[命令] 2>> [文件]
```

例如：

```shell
[root@basenode ~]# cat /root/java 2>> /root/log
[root@basenode ~]# cat /root/python 2>> /root/log
[root@basenode ~]# cat log 
cat: /root/java: No such file or directory
cat: /root/java: No such file or directory
cat: /root/python: No such file or directory
```

### 同时实现输出和错误重定向

同时实现输出和错误重定向，即可以同时实现输出重定向和错误重定向的功能。

基本语法

```
[命令] &> [文件]
```

例如：

```shell
# 使用输出和错误重定向列出 /boot目录的内容到 /root/kk文件
[root@basenode ~]# ls /boot &> /root/kk
```