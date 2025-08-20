# Anaconda与PySpark安装

下面我们为 Windows平台安装Anaconda 与 PySpark标准类库

1、双击Anaconda安装包

![](./assets/conda-1.png)

2、点击 Next

![](./assets/conda-2.png)

3、点击 I Agree

![](./assets/conda-3.png)

4、选择安装类型，并点击Next

![](./assets/conda-4.png)

5、选择安装路径，并点击 Next

![](./assets/conda-5.png)

6、点击Install

![](./assets/conda-6.png)

7、点击Next

![](./assets/conda-7.png)

8、再次点击Next

![](./assets/conda-8.png)

9、Next （可以去掉打勾项）

![](./assets/conda-9.png)

9、配置国内源

找到 Anaconda Prompt，并双击打开它

![](./assets/conda-10.png)
![](./assets/conda-11.png)

找到当前用户的家目录，并在下面创建 `.condarc` 文件

![](./assets/conda-12.png)

将国内源粘贴到 `.condarc`文件下

```txt
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

10、创建虚拟环境
重新打开 Anaconda Prompt ，并输入如下命令s

![](./assets/conda-13.png)


该命令的目的是为了创建一个名为 pyspark的虚拟环境

安装成功就是以下画面

![](./assets/conda-14.png)

如果出现了如下错误，只需要去anaconda安装目录修改用户对该目录有完全控制权限即可

![](./assets/conda-15.png)

![](./assets/conda-16.png)

10、切换虚拟环境
使用下面命令切换虚拟环境

![](./assets/conda-17.png)

11、安装PySpark、以及后续可能用的的包

![](./assets/conda-18.png)

看到 Successfully等信息说明安装成功