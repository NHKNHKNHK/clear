

## 1）准备一台虚拟机



## **2）安装 JDK**

（1）卸载现有 OpenJDK 

```shell
$ sudo rpm -qa | grep -i java | xargs - n1 sudo rpm -e --nodeps 
```

（2）将 JDK 上传到虚拟机的/opt/software 文件夹下面 

（3）解压 JDK 到/opt/software 目录下 

```shell
$ tar -zxvf jdk-8u152-linux-x64.tar.gz -C /opt/software/
```

（4）配置 JDK 环境变量 

新建/etc/profile.d/my_env.sh 文件 

```shell
$ sudo vim /etc/profile.d/my_env.sh 
```

添加如下内容，然后保存（:wq）退出 

```shell
# 配置JDK环境
export JAVA_HOME=/opt/software/jdk1.8.0_152
export PATH=$PATH:$JAVA_HOME/bin
```

（5）让环境变量生效 

```shell
$ source /etc/profile.d/my_env.sh 
```

（6）测试 JDK 是否安装成功 

```shell
[nhk@kk01 software]$ java -version
java version "1.8.0_152"
Java(TM) SE Runtime Environment (build 1.8.0_152-b16)
Java HotSpot(TM) 64-Bit Server VM (build 25.152-b16, mixed mode)
```

## 3）安装 Maven 

（1）将 Maven 安装包上传到虚拟机/opt/software 目录 

```shell
[nhk@kk01 software]$ ll
total 9820
-rw-r--r--.  1 nhk nhk 9063587 Jul 29 13:46 apache-maven-3.6.0-bin.tar.gz
```

1）将Maven 安装包上传到虚拟机 /opt/software 目录

（2）解压 Maven到/opt/software 目录下 

```shell
[nhk@kk01 software]$ tar -zxvf apache-maven-3.6.0-bin.tar.gz -C /opt/software/
```

（3）配置 Maven 环境变量 

编辑/etc/profile.d/my_env.sh 文件

```shell
[nhk@kk01 software]$ sudo vim /etc/profile.d/my_env.sh 
```

 追加以下内容 

```shell
# MAVEN_HOME 
export MAVEN_HOME=/opt/software/apache-maven-3.6.0
export PATH=$PATH:$MAVEN_HOME/bin
```

让环境变量生效 

```shell
[nhk@kk01 software]$ source /etc/profile.d/my_env.sh 
```

（4）检测 Maven 是否安装成功 

```shell
[nhk@kk01 software]$ mvn -version
Apache Maven 3.6.0 (97c98ec64a1fdfee7767ce5ffb20918da4f719f3; 2018-10-25T02:41:47+08:00)
Maven home: /opt/software/apache-maven-3.6.0
Java version: 1.8.0_152, vendor: Oracle Corporation, runtime: /opt/software/jdk1.8.0_152/jre
Default locale: en_US, platform encoding: UTF-8
OS name: "linux", version: "3.10.0-1160.el7.x86_64", arch: "amd64", family: "unix"
```

（5）配置仓库镜像 

修改 Maven 配置文件 

```shell
[nhk@kk01 software]$ vim /opt/software/apache-maven-3.6.0/conf/settings.xml
```

在\<mirrors>\</mirrors>节点中增加以下内容  

```xml
<mirror>
    <id>aliyunmaven</id>
    <mirrorOf>central</mirrorOf>
    <name>阿里云公共仓库</name>
    <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```

 （6）配置本地仓库

```xml
<localRepository>/opt/software/apache-maven-3.6.0/mvn_resp</localRepository>
```



## 4）安装 Git 

（1）安装第三方仓库

```shell
[nhk@kk01 software]$ sudo yum install -y https://repo.ius.io/ius-release-el7.rpm
[nhk@kk01 software]$ sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
```

（2）安装 Git

安装第三方仓库

```shell
[nhk@kk01 software]$ sudo yum install -y git236 
```

## 5）安装 IDEA 

（1）将 IDEA 安装包上传到虚拟机/opt/software 目录 

```shell
[nhk@kk01 software]$ ll

-rw-r--r--.  1 nhk nhk 941417519 Jul 29 15:45 ideaIU-2021.1.3.tar.gz
```

（2）解压 IDEA 到/opt/software 目录下 

```shell
[nhk@kk01 software]$ tar -zxvf ideaIU-2021.1.3.tar.gz -C /opt/software/
```

（3）启动 IDEA（在图形化界面启动） 

```shell
[root@kk01 ~]# nohup /opt/software/idea-IU-231.9392.1/bin/idea.sh 1>/dev/null 2>&1 
```

（4）配置IDEA

-   idea的基本配置
-   配置 Maven
-   修改JDK的环境配置
-   修改idea中的maven的内存配置和使用的jdk： -Xmx2048m