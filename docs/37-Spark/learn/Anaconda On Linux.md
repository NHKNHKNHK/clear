# Anaconda On Linux安装

## 简述

-   Anaconda 是Python语言的一个发行版
-   内置了非常多的数据科学相关的Python类库，同时可以提供虚拟环境来供不同的程序使用

清华开源软件镜像

https://mirrors.tuna.tsinghua.edu.cn/anaconda/archive/?C=S&O=A

## 准备

我们使用的版本

-   python 推荐 3.0
-   JDK 1.8
-   Spark 3.x

## 1）上传安装包

```shell
[root@kk01 software]# pwd
/opt/software
[root@kk01 software]# ll
total 1262396
-rw-r--r--.  1 root root 570853747 Jun  1 07:17 Anaconda3-2021.05-Linux-x86_64.sh
...
```

## 2）安装Anaconda 

``` shell
[root@kk01 software]# sh ./Anaconda3-2021.05-Linux-x86_64.sh 

Welcome to Anaconda3 2021.05

In order to continue the installation process, please review the license
agreement.
Please, press ENTER to continue
>>> 		# 直接回车
===================================
End User License Agreement - Anaconda Individual Edition
===================================

Copyright 2015-2021, Anaconda, Inc.
.....

  * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/o
r other materials provided with the distribution.
--More--      # 这里按多按几次空格
....

Do you accept the license terms? [yes|no]
[no] >>> yes   # 直接yes

Anaconda3 will now be installed into this location:
/root/anaconda3

  - Press ENTER to confirm the location
  - Press CTRL-C to abort the installation
  - Or specify a different location below

[/root/anaconda3] >>> /opt/software/anaconda3   # 这里选择anaconda的安装位置
.....
# 经过几分钟的等待，出现如下信息

Preparing transaction: done
Executing transaction: done
installation finished.
Do you wish the installer to initialize Anaconda3   # 这里是询问是否需要初始化  Anaconda3 
by running conda init? [yes|no]
[no] >>> yes  # yes

===========================================================================

Working with Python and Jupyter notebooks is a breeze with PyCharm Pro,
designed to be used with Anaconda. Download now and have the best data
tools at your fingertips.

PyCharm Pro for Anaconda is available at: https://www.anaconda.com/pycharm

[root@kk01 software]# 
# 此致，我们就初始化完成了
```

安装完成后，我们需要重新连接

```shell
[root@kk01 software]# exit
logout
....

Last login: Thu Jun  1 07:16:51 2023 from 192.168.188.1
(base) [root@kk01 ~]# 
```

当我们看见 Base 开头就表明安装好了

**base 是默认的虚拟环境**

如果anaconda 安装完之后，没有成功启动（即没有显示 （base） 等字眼）
代表没有成功启动，不代表安装失败了。

解决方法：
	source ~/.bashrc z即可

如果安装过程中写入bash的过程填了否，那就需要自己手动添加内容，然后再输入上面命令即可



## 3）配置国内源

```shell
(base) [root@kk01 ~]# vim ~/.condarc    # 这个文件刚开始是不存在的
```

文件内容如下（清华大学开源软件镜像站）

```diff
channels:
  - defaults
show_channel_urls: true
channel_alias: https://mirrors.tuna.tsinghua.edu.cn/anaconda
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/pro
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  msys2: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  bioconda: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  menpo: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  simpleitk: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
```

## 4）验证环境

简单验证以下我们的python是否可用

```shell
(base) [root@kk01 ~]# python
Python 3.8.8 (default, Apr 13 2021, 19:58:26) 
[GCC 7.3.0] :: Anaconda, Inc. on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> 

```

看到上述信息，则证明上述安装是成功的

## 5）配置虚拟环境

```shell
>>> exit()
(base) [root@kk01 ~]# # pyspark
(base) [root@kk01 ~]# conda create -n pyspark python=3.8
....

Proceed ([y]/n)? y  # 直接y
....
# To activate this environment, use
#
#     $ conda activate pyspark    进入虚拟环境命令
#
# To deactivate an active environment, use
#
#     $ conda deactivate        停用虚拟环境

# 经过痛苦的等待以后

# 进入虚拟环境
(base) [root@kk01 ~]# conda activate pyspark
(pyspark) [root@kk01 ~]# 
```



## 6）配置PYSPARK_PYTHON环境

该环境变量表示，spark想要运行Python程序，那么需要去哪里找Python执行器

```shell
(pyspark) [root@kk01 ~]# vim /etc/profile.d/my_env.sh
```

添加如下内容（即需要配置虚拟环境中的python解析器目录）

```shell
# PySpark
export PYSPARK_PYTHON=/opt/software/anaconda3/envs/pyspark/bin/python3.8
```

PYSPARK_PYTHON 和 JAVA_HOME 需要同样配置在 ~/.bashrc 下

```
(pyspark) [root@kk01 ~]# vim /root/.bashrc 
```

```shell
export JAVA_HOME=/opt/software/jdk1.8.0_152
export PYSPARK_PYTHON=/opt/software/anaconda3/envs/pyspark/bin/python3.8
```

 注意：需要保证 etc/profile.d/my_env.sh 有如下配置

-   JAVA_HOME
-   HADOOP_HOME
-   HADOOP_CONF_DIR
-   SPARK_HOME
-   PYSPARK_PYTHON

## 7）测试bin/pyspark

```python
(pyspark) [root@kk01 bin]# pwd
/opt/software/spark-local/bin
(pyspark) [root@kk01 bin]# ./pyspark 
.....

Welcome to
      ____              __
     / __/__  ___ _____/ /__
    _\ \/ _ \/ _ `/ __/  '_/
   /__ / .__/\_,_/_/ /_/\_\   version 3.2.0
      /_/

Using Python version 3.8.16 (default, Mar  2 2023 03:21:46)
Spark context Web UI available at http://kk01:4040
Spark context available as 'sc' (master = local[*], app id = local-1685622476630).
SparkSession available as 'spark'.
>>> 
>>> print("hello world")   # 验证python代码是否可运行
hello world  		
>>> sc.parallelize([1,2,3,4,5]).map(lambda x: x*10).collect()  # 验证spark代码是否可运行
[10, 20, 30, 40, 50]                                                            
>>> 
```

## 8）在集群所有机器安装anaconda

将第一台机器 kk01 上的 anaconda 通过 scp 分发到 kk02、kk03

```shell
(pyspark) [root@kk01 software]# scp /opt/software/Anaconda3-2021.05-Linux-x86_64.sh root@kk02:/opt/software/

(pyspark) [root@kk01 software]# scp /opt/software/Anaconda3-2021.05-Linux-x86_64.sh root@kk03:/opt/software/
```

接着在kk02、kk03进行安装，安装步骤与kk01一致

安装完以后也记得使用下面命令**创建虚拟环境，并进入虚拟环境**

```
conda create -n pyspark python=3.8

conda activate pyspark
```



## 9）分发环境变量

需要在kk01 分发  /etc/profile.d/my_env.sh 及用户家目录的 /root/.bashrc 

```shell
(pyspark) [root@kk01 software]# scp  /etc/profile.d/my_env.sh root@kk02: /etc/profile.d/my_env.sh
(pyspark) [root@kk01 software]# scp  /etc/profile.d/my_env.sh root@kk02: /etc/profile.d/my_env.sh

(pyspark) [root@kk01 software]# scp /root/.bashrc root@kk02:/root/.bashrc
(pyspark) [root@kk01 software]# scp /root/.bashrc root@kk03:/root/.bashrc
```



## 9）PySpark 安装

PySpark是Python标准类库，可以通过python自动的 pip 程序进行安装 或者 Anaconda 的库安装（conda）

这里我们基于上述创建的**虚拟环境 pyspark 进行安装**

```shell
# 我们未指定版本的话，默认安装是最新版本
(pyspark) [root@kk01 ~]# pip3 --default-timeout=100 install install pyspark -i http://pypi.douban.com/simple/ --trusted-host pypi.douban.com
Looking in indexes: http://pypi.douban.com/simple/

# 成功以后可以看到如下信息

Successfully installed install-1.3.5 py4j-0.10.9.7 pyspark-3.4.0
```

当然你也可以使用 pip 安装，不过我们还是推荐使用 pip 

```
conda install pyspark
```

验证PySpark是否安装成功

```shell
(pyspark) [root@kk01 software]# python
Python 3.8.16 (default, Mar  2 2023, 03:21:46) 
[GCC 11.2.0] :: Anaconda, Inc. on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import pyspark
>>> 
>>> exit()
(pyspark) [root@kk01 software]# 

# 如果未出现报错信息，则证明安装成功
```

除了kk01安装pyspark以外，kk02、kk03 也需要重复上述步骤安装 pyspark

```shell
(pyspark) [root@kk02 ~]# pip3 --default-timeout=100 install install pyspark -i http://pypi.douban.com/simple/ --trusted-host pypi.douban.com
Looking in indexes: http://pypi.douban.com/simple/

(pyspark) [root@kk03 ~]# pip3 --default-timeout=100 install install pyspark -i http://pypi.douban.com/simple/ --trusted-host pypi.douban.com
Looking in indexes: http://pypi.douban.com/simple/
```

