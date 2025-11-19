# Flume安装部署

**1）上次压缩包**

将 apache-flume-1.9.0-bin.tar.gz 压缩包上传至Linux 的 /opt/software目录下

**2）解压压缩包**

将 apache-flume-1.9.0-bin.tar.gz 解压到 /opt/software目录下

```shell
[root@kk01 software]# pwd
/opt/software
[root@kk01 software]# tar -zxvf apache-flume-1.9.0-bin.tar.gz -C /opt/software/
```

**3）将apache-flume-1.9.0-bin 重命名为 flume**

因为flume只是一个工具，它的版本没有那么重要，因此我们可以改名

```shell
[root@kk01 software]# mv apache-flume-1.9.0-bin flume
```

**4）将 lib 目录下的 guava-11.0.2.jar 删除以兼容 Hadoop 3.2.2**

```shell
[root@kk01 software]# rm /opt/software/flume/lib/guava-11.0.2.jar
```

注意：删除guava-11.0.2.jar的服务器节点，一定要配置hadoop环境变量。否则会报如下异常。

```shell
Caused by: java.lang.ClassNotFoundException: com.google.common.collect.Lists
        at java.net.URLClassLoader.findClass(URLClassLoader.java:382)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:424)
        at sun.misc.Launcher$AppClassLoader.loadClass(Launcher.java:349)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:357)
        ... 1 more
```

**5）修改 conf 目录下的 log4j.properties 确定日志打印的位置**

```shell
[root@kk01 software]# cd /opt/software/flume/conf/
[root@kk01 conf]# vim log4j.properties 

# 修改内容如下

# console表示同时将日志输出到控制台
flume.root.logger=INFO,LOGFILE,console
# 固定日志输出的位置
flume.log.dir=/opt/software/flume/logs
# 日志文件的名称
flume.log.file=flume.log
```

**6）配置flume环境变量**

```shell
[root@kk01 conf]# vim /etc/profile

# 在文件末尾加上如下内容

# flume环境变量
export FLUME_HOME=/opt/software/flume
export PATH=$PATH:$FLUME_HOME/bin

# 使环境变量生效
[root@kk01 conf]# source /etc/profile
```

**7）将flume-env.ps1.template 重命名为 flume-env.ps1**

在flume安装目录下的conf目录下有个 flume-env.ps1.template文件，需要将它重命名为flume-env.ps1，有两种做法：

- （保守做法）将flume-env.ps1.template 文件 复制出 flume-env.ps1

- （常规做法）将flume-env.ps1.template 文件 重命名为 flume-env.ps1

```shell
# 下面我们采取保守做法
/opt/software/flume/conf
[root@kk01 conf]# cp flume-env.ps1.template flume-env.ps1
[root@kk01 conf]# ll
total 20
-rw-r--r--. 1 nhk  nhk  1661 Nov 16  2017 flume-conf.properties.template
-rw-r--r--. 1 root root 1455 May 11 23:10 flume-env.ps1    # 我们复制出来的文件
-rw-r--r--. 1 nhk  nhk  1455 Nov 16  2017 flume-env.ps1.template
-rw-r--r--. 1 nhk  nhk  1568 Aug 30  2018 flume-env.sh.template
-rw-rw-r--. 1 nhk  nhk  3237 May 11 22:57 log4j.properties
```

**8）将 flume-env.sh.template 重命名为 flume-env.sh**

在flume安装目录下的conf目录下有个 flume-env.sh.template文件，需要将它重命名为flume-env.sh，有两种做法：

- （保守做法）将flume-env.sh.template 文件 复制出 flume-env.sh

- （常规做法）将flume-env.sh.template 文件 重命名为 flume-env.sh

```shell
# 下面我们采取保守做法
[root@kk01 conf]# cp flume-env.sh.template flume-env.sh
[root@kk01 conf]# ll
total 24
-rw-r--r--. 1 nhk  nhk  1661 Nov 16  2017 flume-conf.properties.template
-rw-r--r--. 1 root root 1455 May 11 23:10 flume-env.ps1
-rw-r--r--. 1 nhk  nhk  1455 Nov 16  2017 flume-env.ps1.template
-rw-r--r--. 1 root root 1568 May 11 23:12 flume-env.sh
-rw-r--r--. 1 nhk  nhk  1568 Aug 30  2018 flume-env.sh.template
-rw-rw-r--. 1 nhk  nhk  3237 May 11 22:57 log4j.properties
```

**9）修改 flume-env.sh**

```shell
[root@kk01 conf]# vim flume-env.sh

# 在文件内添加如下内容

export JAVA_HOME=/opt/software/jdk1.8.0_152
```

10）查看Flume版本信息

```shell
[root@kk01 conf]# flume-ng version
Flume 1.9.0
Source code repository: https://git-wip-us.apache.org/repos/asf/flume.git
Revision: d4fcab4f501d41597bc616921329a4339f73585e
Compiled by fszabo on Mon Dec 17 20:45:25 CET 2018
From source with checksum 35db629a3bda49d23e9b3690c80737f9
```

至此，Flume部署完成
