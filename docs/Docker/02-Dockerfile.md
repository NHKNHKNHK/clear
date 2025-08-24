# Dockerfile

## 1 Dockerfile简介

### 1.1 Dockerfile是什么？

-   镜像包含了应用程序、程序运行的系统函数库、运行配置等文件的文件包。

-   Dockerfile是用来构建Docker镜像的文本文件，是由一条条构建镜像所需的指令和参数构成的脚本
    -   通过这个脚本文件可以生成镜像，镜像是一层一层的，脚本是一个一个的命令，每个命令都是一层

### 1.2 Dockerfile官网

https://docs.docker.com/engine/reference/builder/

### 1.3 Dockerfile构建三步曲

-   编写Dockerfile文件
-   docker build 命令构建镜像
-   docker run 依照新编写的镜像，运行容器实例
-   docker push 发布镜像，例如：DockerHub、阿里云镜像仓库（可选步骤）


## 2 Dockerfile构建过程

### 2.1 Dokcerfile基础知识

**1）每条保留字指令都必须为`大写字母`且后面要跟随至少一个参数**

**2）指令按照按照从上到下，顺序执行**

**3）# 表示注释**

**4）每条指令都会创建一个新的镜像层并对镜像进行提交**



### 2.2 Docker执行Dockerfile的大致流程

1）docker从基础镜像运行一个容器

2）执行一条指令并对容器做出修改

3）执行类似docker commit 的操作提交一个新的镜像层

4）docker再基于刚提交的镜像运行一个新容器

5）执行dockerfile中的下一条指令直到所有的指令都执行完 



### 2.3 Dockerfile小总结

从应用软件的角度来看，Dockerfile、Docker镜像与Docker容器分别代表软件的三个不同阶段

-   Dockerfile是软件的原材料
-   DockerImages是软件的交付品
-   Docker容器则可以认为是软件镜像的运行态，也即依照镜像运行的容器实例

Dockerfile面向开发，Docker镜像成为交付标准，Docker容器则涉及部署与运维，三者缺一不可，合力充当Docker体系的基石。

-   Dockerfile，需要定义一个Dockerfile，Dockerfile定义了进程需要的一切东西。Dockerfile涉及的内容包括执行代码或者是文件、环境变量、依赖包、运行时环境、动态链接库、操作系统的发行版、服务进程和内核进程（当应用进程需要和系统服务和内核进程打交道，这时需要考虑如何设计namespace的权限控制）等等
-   DockerImages，在用Docker定义一个文件之后，docker build 时会产生一个Docker镜像，当运行 Docker镜像时会真正开始提供服务
-   Docker 容器，容器是直接提供服务的



在学习Dockerfile常用保留字之前，我们先复习以下镜像的结构

-   入口（Entrypoint）：镜像运行入口，一般是程序启动的脚本和参数
-   层（Layer）：在BaseImage基础上添加安装包、依赖、配置等，每一次操作都形参一个新的层
-   基础镜像（BaseImage）：系统依赖的系统函数库、环境、配置、文件等

## 3 Dockerfile常用保留字

### FROM

**指定基础镜像**，当前新镜像是基于哪一个镜像的，指定一个已存在的镜像作为模板，**第一条必须为FROM**

例如：FREOM centos:7

### MAINTAINER

镜像维护者的名字和邮箱地址

### RUN

执行Linux的shell命令，一般是安装过程的命令

容器构建时需要运行的命令

**两种格式：**

-   shell格式

```shell
RUN <命令行命令>
# <命令行命令> 等同于在终端操作的 shell 命令

# 例如
RUN yum -y install vim 		相当于在build的时候下载一个vim
```

-   exec格式

```shell
RUN ["可执行文件", "参数1", "参数2"]

# 例如
RUN ["./test.php", "dev", "offline"] 	 等价于 RUN ./test.php dev offline
```

**RUN是在 docker build 时运行的**

### EXPOSE

当前容器对外暴露的端口

例如：EXPOSE 9200

### WORKDIR

指定在创建容器后，**终端默认登录的进来工作目录**，一个落脚点

简单来说：就是镜像的工作目录

### USER

指定该镜像以什么样的用户去执行，如果不指定，**默认为root**

### ENV

用来在构建镜像过程中**设置环境变量**，可在后续的命令中使用

```shell
ENV MY_PATH /usr/mytest 
这个环境变量可以在后续的任何 RUN 指令中使用，这就如同在命令前面指定了环境变量前缀一样
也可以在其他指定中直接使用这些环境变量

例如：ENV WORKDIR $MY_PATH
```

### ADD

将宿主机目录下的文件拷贝进镜像，且**会自动处理URL和解压tar压缩包**

### COPY

类似ADD，拷贝文件和目录到镜像中（拷贝本地文件到镜像的指定目录）

将从构建上下文目录中 <源路径>的文件/复制到新的一层的镜像内的<目标路径>位置

```shell
COPY src dest
COPY ["src", "dest"]
<src源路径>：源文件或源路径
<dest目标路径>：容器内的指定路径，该路径不用事先创建好，会自动创建

例如： COPY ./mysql-5.7-rpm /tmp
```

### VOLUME

容器数据卷，用于数据保存和持久化工作

### CMD

指定容器启动后要干的事情

CMD 指令与 RUN类似，也有两种格式：

-   shell格式

```shell
CMD <命令行命令>
# <命令行命令> 等同于在终端操作的 shell 命令
```

-   exec格式

```shell
CMD ["可执行文件", "参数1", "参数2",...]

CMD [参数1", "参数2",...] 在指定了 ENTRYPOINT 指令后，用 CMD 指定具体的参数
```

注意：

-   **Dockerfile中可以有多条CMD指令，但只有最后一条生效，CMD 会被docker run 之后的参数替换**

CMD 与 RUN 的区别：

-   CMD是在docker run 时运行的
-   RUN是在docker build 时运行的

### ENTRYPOINT

也是用来指定一个容器启动时要运行的命令（镜像中应用的启动命令，容器运行时调用）

类似于 CMD 指令，**但是ENTEYPOINT 不会被docker run 后面的命令覆盖**，而且这些命令行参数**会被当作参数传递给 ENTEYPOINT 指令指定的程序**

CMD 与 ENTRYPOINT的区别:

-   CMD是替换命令
-   ENTRYPOINT是追加命令

命令格式

```shell
ENTRYPOINT ["executable", "param1", "param2"]

# ENTEYPOINT 可以与 CMD 一起用，一般是 变参 才会使用 CMD，这里的CMD等于是给ENTEYPOINT 传参
# 当指定了ENTEYPOINT后，CMD的含义就发生了变化，不再是直接运行其命令，而是将CMD的内容作为参数传递给ENTEYPOINT 指令，它两组合会变为
					<ENTEYPOINT	> "<CMD>"
```

案例

假设已通过Dockerfile 构建了 nginx:test 镜像：

```shell
FROM nginx

ENTEYPOINT ["nginx","-c"] # 定参
CMD ["/etc/nginx/nginx.conf"] # 形参
```

| 是否传参         | 按照dockerfile编写执行         | 传参执行                                         |
| ---------------- | ------------------------------ | ------------------------------------------------ |
| Docker 命令      | docker run nginx:test          | docker run nginx:test -c /etc/nginx/**new.conf** |
| 衍生出的实际命令 | nginx -c /etc/nginx/nginx.conf | nginx -c /etc/nginx/**new.conf**                 |

### ONBUILD

当构建一个被继承 DockerFile 这个时候就会运行ONBUILD 的指令。**触发指令**



## 案例演示

### 自定义镜像mycentos

1）准备Dockerfile文件

```shell
[root@nhk ~]# mkdir dockerfile
[root@nhk ~]# cd dockerfile/
[root@nhk dockerfile]# 
[root@nhk dockerfile]# vim mydockerfile-centos
```

Dockerfile参考内容如下

```dockerfile
FROM centos:7
MAINTAINER nhk<13605975424@163.com>

ENV MYPATH /usr/local
WORKDIR $MYPATH

RUN yum -y install vim
RUN yum -y install net-tools

EXPOSE 80

CMD echo $MYPATH
CMD echo "-----end-----"
CMD /bin/bash
```

2）构建镜像

```shell
# 命令 docker build -f dockerfile文件路径 -t 镜像名[:TAG]
[root@nhk dockerfile]# docker build -f mydockerfile-centos -t mycentos:0.1 .
```

3）测试，使用镜像

```shell
[root@nhk dockerfile]# docker images | grep mycentos
mycentos              0.1            f31b5715c530   4 minutes ago   687MB


[root@nhk dockerfile]# docker run -it mycentos:0.1 /bin/bash
[root@1bcdcaa6e94f local]# pwd
/usr/local
[root@1bcdcaa6e94f local]# vim
[root@1bcdcaa6e94f local]# ifconfig 
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.5  netmask 255.255.0.0  broadcast 172.17.255.255
        ether 02:42:ac:11:00:05  txqueuelen 0  (Ethernet)
        RX packets 8  bytes 656 (656.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

除此之外，我们还可以看到镜像的变更历史

```shell
[root@nhk dockerfile]# docker history f31b5715c530
IMAGE          CREATED         CREATED BY                                      SIZE      COMMENT
f31b5715c530   6 minutes ago   CMD ["/bin/sh" "-c" "/bin/bash"]                0B        buildkit.dockerfile.v0
<missing>      6 minutes ago   CMD ["/bin/sh" "-c" "echo \"-----end-----\""]   0B        buildkit.dockerfile.v0
<missing>      6 minutes ago   CMD ["/bin/sh" "-c" "echo $MYPATH"]             0B        buildkit.dockerfile.v0
<missing>      6 minutes ago   EXPOSE map[80/tcp:{}]                           0B        buildkit.dockerfile.v0
<missing>      6 minutes ago   RUN /bin/sh -c yum -y install net-tools # bu…   198MB     buildkit.dockerfile.v0
<missing>      6 minutes ago   RUN /bin/sh -c yum -y install vim # buildkit    285MB     buildkit.dockerfile.v0
<missing>      5 months ago    WORKDIR /usr/local                              0B        buildkit.dockerfile.v0
<missing>      5 months ago    ENV MYPATH=/usr/local                           0B        buildkit.dockerfile.v0
<missing>      5 months ago    MAINTAINER nhk<13605975424@163.com>             0B        buildkit.dockerfile.v0
<missing>      2 years ago     /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B        
<missing>      2 years ago     /bin/sh -c #(nop)  LABEL org.label-schema.sc…   0B        
<missing>      2 years ago     /bin/sh -c #(nop) ADD file:b3ebbe8bd304723d4…   204MB     

```


### 自定义镜像mycentosjava8

#### 需求

要求centos7镜像具备 vim +  ifconfig + jdk8

jdk下载地址： https://mirrors.yangxingzhen.com/jdk/

#### 编写

1）准备Dockerfile文件（注意Dockerfile中的**D一定要大写**）

```shell
[root@nhk myfile]# pwd
/myfile
[root@nhk myfile]# ll
total 185340
-rw-r--r--. 1 root root 189784266 Jun  4 03:25 jdk-8u152-linux-x64.tar.gz  # 准备好的jdk
[root@nhk myfile]# docker images centos
REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
centos       centos7   eeb6ee3f44bd   20 months ago   204MB   # 准备好的cnetos镜像
[root@nhk myfile]# vim Dockerfile
```

Dockerfile参考内容如下

```dockerfile
FROM centos
MAINTAINER nhk<13605975424@163.com>

ENV MY_PATH /usr/local
WORKDIR $MY_PATH

# 安装vim编辑器
RUN yum -y install vim
# 安装ifconfig命令查看网络IP
RUN yum -y install net-tools
# 安装java8及lib库
RUN yum -y install glibc.i686
RUN mkdir /usr/local/java
# ADD 是相对路径jar，把 jdk-8u152-linux-x64.tar.gz 添加到容器中，安装包必须要和Dockerfile文件在同一位置
ADD jdk-8u152-linux-x64.tar.gz /usr/local/java/
# 配置Java环境变量
ENV JAVA_HOME /usr/local/java/jdk1.8.0_152
ENV JRE_HOME $JAVA_HOME/jre
ENV CLASSPATH $JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar:$JRE_HOME/lib:$CLASSPATH
ENV PATH $JAVA_HOME/bin:$PATH

EXPOSE 80

CMD echo $MYPATH
CMD echo "success-------------------ok"
CMD /bin/bash
```

#### 构建

```shell
docker build -t 新镜像名字:TAG .   # 需要注意TAG 后面有个 .
```

```shell
[root@nhk myfile]# docker build -t mycentosjava8:1.5 .
[+] Building 160.4s (12/12) FINISHED                                                                                                                         
 => [internal] load .dockerignore                                                                                                                       0.0s
 => => transferring context: 2B                                                           
 ...
```

如果构建过程中遇到如下报错

```shell
 => ERROR [3/7] RUN yum -y install vim                                                                                                                  1.8s
------
 > [3/7] RUN yum -y install vim:
#0 1.696 CentOS Linux 8 - AppStream                       34  B/s |  38  B     00:01    
#0 1.698 Error: Failed to download metadata for repo 'appstream': Cannot prepare internal mirrorlist: No URLs in mirrorlist
------
Dockerfile:8
--------------------
   6 |     
   7 |     # 安装vim编辑器
   8 | >>> RUN yum -y install vim
   9 |     # 安装ifconfig命令查看网络IP
  10 |     RUN yum -y install net-tools
--------------------
ERROR: failed to solve: process "/bin/sh -c yum -y install vim" did not complete successfully: exit code: 1
```

我们修改Dockerfile文件中镜像版本信息即可解决

```dockerfile
FROM centos:centos7  # 添加版本
MAINTAINER nhk<13605975424@163.com>

ENV MY_PATH /usr/local
WORKDIR $MY_PATH
....

```

#### 运行

```shell

[root@nhk myfile]# docker run -it --name mycnentos7test mycentosjava8:1.5
[root@e7d8ce7b2d37 local]# pwd     # 尽量工作目录直接就是 /usr/local 说明我们WORKDIR配置成功
/usr/local
[root@e7d8ce7b2d37 local]# vim
[root@e7d8ce7b2d37 local]# java -version
java version "1.8.0_152"
Java(TM) SE Runtime Environment (build 1.8.0_152-b16)
Java HotSpot(TM) 64-Bit Server VM (build 25.152-b16, mixed mode)
[root@e7d8ce7b2d37 local]# 
```

#### 再次体会 Unionfs（联合文件系统）

​	UnionFS（联合文件系统）：UnionFS文件系统（UnionFS）是一种分层、轻量级并且高性能的文件系统，它支持**对文件系统的修改作为一次提交来一层层的叠加**，同时可以将不同目录挂载到同一个虚拟文件系统下（unite several directories into a singls virtual filesystem）。**Union文件系统是 Docker 镜像的基础。镜像通过分层来进行继承**，基于基础镜像（没有父镜像），可以制作各自具体的应用镜像。



### 虚悬镜像

什么是虚悬镜像？

仓库名、标签都是 <none> 的镜像，俗称 dangling image

查看虚悬镜像的命令

```shell
docker image ls -f dangling=true
```

用Dockerfile制作一个虚悬镜像

#### 1）编写Dockerfile文件

```shell
[root@nhk myfile]# mkdir test
[root@nhk myfile]# cd test/
[root@nhk test]# pwd
/myfile/test
[root@nhk test]# vim Dockerfile
[root@nhk test]# 
```

Dockerfile参考内容如下

```dockerfile
FROM ubuntu
CMD echo 'action is success'
```

#### 2）docker build构建镜像

```shell
[root@nhk test]# docker build .
[+] Building 0.1s (5/5) FINISHED                                                                                                                             
 => [internal] load build definition from Dockerfile                                                                                                    0.0s
 => => transferring dockerfile: 135B                                                                                                                    0.0s
 => [internal] load .dockerignore                                                                                                                       0.0s
 => => transferring context: 2B                                                                                                                         0.0s
 => [internal] load metadata for docker.io/library/ubuntu:latest                                                                                        0.0s
 => [1/1] FROM docker.io/library/ubuntu                                                                                                                 0.0s
 => exporting to image                                                                                                                                  0.0s
 => => exporting layers                                                                                                                                 0.0s
 => => writing image sha256:e39580f94507868694e52fb093f68d5e7f146199a46c1b0e4cf28c2c05c4bf12                                                            0.0s
[root@nhk test]# 
```

#### 3）查看镜像

```shell
[root@nhk test]# docker image ls -f dangling=true
REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
<none>       <none>    e39580f94507   19 months ago   72.8MB
```

#### 4）删除虚悬镜像

虚悬镜像已经失去了存在的价值，可以删除

```shell
[root@nhk test]# docker image prune
WARNING! This will remove all dangling images.
Are you sure you want to continue? [y/N] y
Deleted Images:
deleted: sha256:e39580f94507868694e52fb093f68d5e7f146199a46c1b0e4cf28c2c05c4bf12

Total reclaimed space: 0B
[root@nhk test]# 
```



### 自定义镜像myubuntu

#### 1）编写Dockerfile文件

```shell
[root@nhk myfile]# mkdir myubuntu
[root@nhk myfile]# cd myubuntu/
[root@nhk myubuntu]# pwd
/myfile/myubuntu
[root@nhk myubuntu]# vim Dockerfile
```

Dockerfile文件内容如下

```dockerfile
FROM ubuntu
MAINTAINER nhk<13606975424@163.com>

ENV MYPATH /usr/local
WORKDIR $MYPATH

RUN apt-get update
# RUN apt-get install net-tools

EXPOSE 80

CMD echo $MYPATH
CMD echo "install inconfig cmd into ubuntu success... ok"
CMD /bin/bash
```

#### 2）docker build 构建镜像

```shell
[root@nhk myubuntu]# docker build -t myubuntu:6.6 .
...

[root@nhk myubuntu]# docker images
REPOSITORY                   TAG            IMAGE ID       CREATED         SIZE
myubuntu                     6.6            519211dbf26a   6 minutes ago   72.8MB
```

#### 3）运行新镜像

```shell
[root@nhk myubuntu]# docker run -it myubuntu:6.6 
root@b94a506968bf:/usr/local#    
```

