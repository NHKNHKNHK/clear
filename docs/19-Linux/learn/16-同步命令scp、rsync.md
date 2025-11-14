# lrzsz

**安装命令**

```shell
$ sudo apt-get install lrzsz  # Ubuntu/Debian
$ sudo yum install lrzsz      # CentOS/RHEL
```

##  rz 将文件从window上传到Linux（从远程主机接收文件到本地）

基本格式

```shell
rz
```

##  sz 将文件从linux传输到window（从本地发送文件到远程主机）

基本格式

```
sz /path/to/file
```

# scp

基本格式：

```shell
scp [选项] 源地址(source) 目标地址(target)
```

scp 源地址(source) 目标地址(target)

常用选项

| 选项               | 说明                               |
| ------------------ | ---------------------------------- |
| `-r`                 | 递归复制整个目录                   |
| `-P <port>`          | 指定远程主机的 SSH 端口，默认为 22 |
| `-i <identity_file>` | 指定用于身份验证的私钥文件         |
| `-v`                 | 显示详细的复制过程                 |

演示：

从本地复制文件到远程主机：

```shell
# 将本地apache-tomcat-7.0.61.tar.gz 文件发送到远端 root@192.168.188.102 
scp apache-tomcat-7.0.61.tar.gz root@192.168.188.102:/opt
```

从远程主机复制文件到本地：

```shell
# 从远程主机 root@192.168.188.102 将 apache-tomcat-7.0.61.tar.gz文件复制到本地主机
scp root@192.168.188.102:/opt/apache-tomcat-7.0.61.tar.gz ./
```

递归复制整个目录：

```shell
# 将本地 apache-tomcat-7.0.61 目录 发送到远端 root@192.168.188.102 
scp -r apache-tomcat-7.0.61 root@192.168.188.102:/opt
```



# rsync 远程同步命令

rsync命令是一个用于文件同步和备份的工具，它可以在本地或远程系统之间同步文件和目录。rsync命令使用rsync协议来传输和更新文件，它可以通过SSH进行安全的远程传输

特点：

-   具有速度快
-   避免复制相同内容（只拷贝差异文件）
-   支持符号链接

rsync 和 scp 的区别：

-   rsync 做文件的复制比 scp 的速度快
-   rsync 只对差异文件做更新，scp是把所有文件都复制过去

**基本语法**

```shell
rsync	-av		$pdir/$fname					$user@$host:$pdir/$fname
命令	  选项参数	要拷贝的文件路径/名称				  目的地用户@主机:目的地路径/名称
```

**选项参数**

| 选项 | 说明         |
| ---- | ------------ |
| -a   | 归档拷贝     |
| -v   | 显示复制过程 |

