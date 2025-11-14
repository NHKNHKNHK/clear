# RPM

## RPM概述

​	RPM（RedHat Package Manager），RedHat 软件包管理工具，类似window里面的setup.exe 是Linux 这系列操作系统里面的打包安装工具，它虽然是RedHat 的标志，但理念是相通的。

**RPM包的名称格式**

-   Apache-1.3.23-11.i386.rpm
    -   “Apache” 软件名称
    -   “ 1.3.23-11 ” 软件的版本号，主版本和此版本
    -   “ i386 ” 是软件所运行的硬件平台，Inter 32位处理器的统称
    -   “ rpm ”文件扩展名，代表RPM包

## RPM查询命令（rpm -qa）

基本语法

```shell
rpm -qa 		# 查询所安装的所有 rpm 软件包
```

注意：

​	由于软件包比较多，一般都会采取过滤。**rpm -qa | grep rpm软件包**

## RPM卸载命令（rpm -e）

基本语法

```shell
rpm -e RPM软件包 		
rpm -e --nodeps 软件包
```

| 选项     | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| -e       | 卸载软件包                                                   |
| --nodeps | 卸载软件时，不检查依赖。这样的话，那些使用该软件包的软件在此之后可能就不能正常工作了 |

演示

```shell
[root@basenode ~]# rpm -qa | grep -i java | xargs -n1 rpm -e --nodeps 

# 说明
rpm -qa：查询所安装的所有rpm软件包
grep -i：忽略大小写
xargs -n1：表示每次只传递一个参数
rpm -e –nodeps：强制卸载软件，不做依赖检查
```



## RPM安装命令（rpm -ivh）

基本语法

```shell
rpm -ivh RPM包全名
```

| 选项     | 功能                    |
| -------- | ----------------------- |
| -i       | install，安装           |
| -v       | --verbose，显示详细信息 |
| -h       | --hash，进度条          |
| --nodeps | 安装前不检查依赖        |

注意：

​	rpm包安装的使用可能会遇到当前安装包会依赖于其他安装包，因此安装时会报错

# YUM 仓库配置

## YUM 简述

​	YUM（全称Yellow dog Updater，Modified）是一个Fedora 和  RedHat 以及CentOS 中的 Shell 前端软件管理器。**基于 RPM包管理，能够从指定的服务器自动下载 RPM包并且安装，可以自动处理依赖关系**，并且一次安装所有依赖的软件包，无需频繁的一次次下载、安装。

话句话说，YUM类似于我们java开发中的maven工具

## YUM常用命令

基本语法

```shell
yum [选项] [参数]
```

| 选项 | 说明                 |
| ---- | -------------------- |
| -y   | 对所有提问都回答 yes |

| 参数         | 功能                           |
| ------------ | ------------------------------ |
| install      | 安装 rpm软件包                 |
| update       | 更新 rpm软件包                 |
| check-update | 检查是否有可用的更新 rpm软件包 |
| remove       | 删除指定的 rpm软件包           |

## 修改网络YUM源

​	默认的系统 YUM 源，需要连接国外 apache 网址，网速比较慢，可以修改关联的网络YUM源为国内镜像的网址，比如 网易 163、aliyun等

1）安装 wget，**wget用来指定从指定的 URL 下载文件**

```shell
[root@basenode ~]# yum install wget
```

2）在 /etc/yum.repos.d/ 目录下，备份默认的 repos 文件

```shell
[root@basenode yum.repos.d]# pwd
/etc/yum.repos.d
[root@basenode yum.repos.d]# cp CentOS-Base.repo CentOS-Base.repo.backup
```

3）下载 网易 或者是 aliyun 的repos 文件

```
wget http://mirrors.aliyun.com/repo/Centos-7.repo	# 阿里云
wget http://mirrors.163.com/repo/CentOs-7-Base-163.repo	# 网易 163
```

```shell
[root@basenode yum.repos.d]# wget http://mirrors.aliyun.com/repo/Centos-7.repo

[root@basenode yum.repos.d]# ll
total 48
-rw-r--r--. 1 root root 2523 Aug  4  2022 CentOs-7.repo
-rw-r--r--. 1 root root 1664 Oct 23  2020 CentOS-Base.repo
-rw-r--r--. 1 root root 1664 Jun 13 16:17 CentOS-Base.repo.backup
-rw-r--r--. 1 root root 1309 Oct 23  2020 CentOS-CR.repo
-rw-r--r--. 1 root root  649 Oct 23  2020 CentOS-Debuginfo.repo
-rw-r--r--. 1 root root  314 Oct 23  2020 CentOS-fasttrack.repo
-rw-r--r--. 1 root root  630 Oct 23  2020 CentOS-Media.repo
-rw-r--r--. 1 root root 1331 Oct 23  2020 CentOS-Sources.repo
-rw-r--r--. 1 root root 8515 Oct 23  2020 CentOS-Vault.repo
-rw-r--r--. 1 root root  616 Oct 23  2020 CentOS-x86_64-kernel.repo
```

4）使用下载好的 repos 文件替换默认的 repos文件

```shell
# 例如：用 Centos-7.repo 替换 CentOS-Base.repo
[root@basenode yum.repos.d]# mv Centos-7.repo CentOs-Base.repo
```

5）清理旧缓存数据，缓存新数据

```shell
[root@basenode yum.repos.d]# yum clean all

[root@basenode yum.repos.d]# yum makecache
```

yum makecache 就是把服务器的包信息下载到本地电脑缓存起来

6）测试

```shell
yum list | grep firefox
```



# 安装epel-release

​	Extra Packages for Enterprise Linux是为“红帽系”的操作系统提供额外的软件包，适用于RHEL、CentOS和Scientific Linux。**相当于是一个软件仓库，大多数rpm包在官方 repository 中是找不到的**

```shell
# 安装epel-release(Extra Packages for Enterprise Linux)与rpm相似，但是可以下载到官方repository中是找不到的rpm包
yum install -y epel-release
```

