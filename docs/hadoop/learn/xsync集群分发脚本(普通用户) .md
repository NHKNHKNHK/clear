# xsync集群分发脚本(普通用户)

**为什么需要集群分发脚本？**

​	当我们在集群中一台机器上配置好服务以后，不想重复的在集群中的其他机器重复配置是，可以循环复制文件到所有节点的相同目录下

**原始的远程同步命令 rsync**

```shell
rsync -av /opt/software nhk@kk01:/opt/software
```

## xsync集群分发脚本编写

### 1）在使用脚本的家目录下创建bin文件夹

说明：

​	在/home/nhk/bin这个目录下存放的脚本，nhk用户可以在系统任何地方直接执行

​	当然你也可以不放在/home/nhk/bin目录下，但是放在/home/nhk/bin目录下有个好处，它自带环境变量，如下查看

```shell
[nhk@kk01 bin]$ echo $PATH     # 可以看到/home/nhk/bin 这个目录它默认就会在PATH
/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/nhk/.local/bin:/home/nhk/bin
```

```shell
[nhk@kk01 ~]$ pwd
/home/nhk
[nhk@kk01 ~]$ mkdir bin
```

### 2）家目录的bin目录下创建 xsync 脚本，以便全局调用

```shell
[nhk@kk01 bin]$ pwd
/home/nhk/bin
[nhk@kk01 bin]$ vim xsync
```

脚本内容如下

```shell
#!/bin/bash

#1. 判断参数个数
if [ $# -lt 1 ]
then
  echo Not Enough Arguement!
  exit;
fi
#2. 遍历集群所有机器
for host in kk01 kk02 kk03
do
  echo ====================  $host  ====================
  #3. 遍历所有目录，挨个发送
  for file in $@
  do
    #4 判断文件是否存在
    if [ -e $file ]
    then
      #5. 获取父目录
  pdir=$(cd -P $(dirname $file); pwd)
      #6. 获取当前文件的名称
      fname=$(basename $file)
      ssh $host "mkdir -p $pdir"
      rsync -av $pdir/$fname $host:$pdir
    else
      echo $file does not exists!
    fi
  done
done
```

### 3）修改 xsync 脚本权限

修改脚本xsync具有执行权限，使它具备执行权限

```shell
[nhk@kk01 bin]$ chmod 777 xsync 
[nhk@kk01 bin]$ ll
total 4
-rwxrwxrwx. 1 nhk nhk 604 Jun 16 16:16 xsync
```

### 4）测试脚本

我们测试分发 xsync脚本本身

```shell
# 可以看到，我们写的脚本是可以正常使用的，只不过因为我们集群之间还没有配置SSH免密登录，所以提示我们输入密码
[nhk@kk01 bin]$ xsync xsync
==================== kk01 ====================
The authenticity of host 'kk01 (192.168.188.128)' can't be established.
ECDSA key fingerprint is SHA256:44NhNFrhE/a4+fD+jcuJBrxdygq6CtHhxWQ9J45PBm4.
ECDSA key fingerprint is MD5:fe:37:0a:8d:89:93:19:e7:8f:bb:12:c0:a4:9d:af:0d.
Are you sure you want to continue connecting (yes/no)? 
```

下面这个是我们之前采用root用户搭建集群时，测试的xsync脚本，因为我们配置了ssh免密，所以可以正常分发xxync文件

```shell
[root@kk01 bin]# xsync xsync 
==================== kk01 ====================
sending incremental file list

sent 43 bytes  received 12 bytes  110.00 bytes/sec
total size is 603  speedup is 10.96
==================== kk02 ====================
sending incremental file list
xsync

sent 693 bytes  received 35 bytes  485.33 bytes/sec
total size is 603  speedup is 0.83
==================== kk03 ====================
sending incremental file list
xsync

sent 693 bytes  received 35 bytes  1,456.00 bytes/sec
total size is 603  speedup is 0.83
[root@kk01 bin]# 
```
