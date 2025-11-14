# 环境变量说明

​	Linux的环境变量可在多个文件中配置，如/etc/profile，/etc/profile.d/*.sh，~/.bashrc，~/.bash_profile等，下面说明上述几个文件之间的关系和区别。

​	bash的运行模式可分为 **login shell** 和 **non-login shell** 。

​	例如，我们通过终端，输入用户名、密码，登录系统之后，得到就是一个login shell。而当我们执行以下命令ssh kk01 command，在kk01执行command的就是一个non-login shell。

## 登录 shell 与 非登录 shell 区别

登录shell

```
环境变量加载顺序
/etc/profile	~/.bash_profile		~/.bashrc ==> /etc/bashrc ==> /etc/profile.d/*.sh	
```

非登录shell

```
环境变量加载顺序
									~/.bashrc ==> /etc/bashrc ==> /etc/profile.d/*.sh	
```

注意：

​	**如果把环境变量只放到 /etc/profile 中，non-login shell 模式会获取不到环境变量**

​	这两种shell的主要区别在于，它们启动时会加载不同的配置文件，**login shell**启动时会加载**/etc/profile，~/.bash_profile，~/.bashrc**。**non-login shell**启动时会加载**~/.bashrc**。

而在加载~/.bashrc（实际是~/.bashrc中加载的/etc/bashrc）或/etc/profile时，都会执行如下代码片段，

```shell
[root@kk03 etc]# pwd
/etc
[root@kk03 etc]# vim /etc/bashrc

```

```shell
  # Only display echos from profile.d scripts if we are no login shell
    # and interactive - otherwise just process them to set envvars
    for i in /etc/profile.d/*.sh; do
        if [ -r "$i" ]; then
            if [ "$PS1" ]; then
                . "$i"
            else
                . "$i" >/dev/null
            fi
        fi
    done
```

因此不管是login shell还是non-login shell，启动时都会加载/etc/profile.d/*.sh中的环境变量。

## /etc/profile 与/etc/profile.d/的区别

### /etc/profile

​	这是系统级别的**全局配置文件**，它**包含了系统中所有用户的环境变量和系统级别的配置信息**。**当用户登录时，系统会自动读取**该文件，并将其中的环境变量和配置信息加载到用户的环境中。

### /etc/profile.d/

​	这是一个目录，它**包含了一系列的脚本文件**，每个脚本文件都可以定义一些环境变量和配置信息。**当用户登录时，系统会自动读取该目录下的所有脚本文件，并将其中的环境变量和配置信息加载到用户的环境中**。

因此，/etc/profile和/etc/profile.d/的区别在于：

1.  /etc/profile是一个文件，而/etc/profile.d/是一个目录。
2.  /etc/profile包含了系统级别的所有环境变量和配置信息，而/etc/profile.d/中的每个脚本文件只包含了一部分环境变量和配置信息。
3.  /etc/profile是必须存在的，而/etc/profile.d/是可选的，系统可以正常运行即使没有/etc/profile.d/目录。



## 环境变量配置的不同而导致的自定义脚本不同

-   **环境变量配置在 /etc/profile 中**

此时我们编写自定义脚本时，经常需要加上 source /etc/profile 或者使用绝对路径，例如：

下面是我们编写的查看JVM进程的脚本，需要加上 source /etc/profile;

```shell
#!/bin/bash
for host in kk01 kk02 kk03
do
        echo "=========$host========="
        ssh $host 'source /etc/profile; jps'
done
```



**环境变量配置在 /etc/profile.d/*.sh 中**

当我们编写自定义脚本时，不需要加上 source ,例如：

下面是我们编写的查看JVM进程的脚本，我们环境变量配置在  /etc/profile.d/*.sh ，因此不需要加上 source

```shell
#!/bin/bash
for host in kk01 kk02 kk03
do
        echo "=========$host========="
        ssh $host 'jps'
done
```

## 环境变量 profile 与 bashrc 的区别

在Linux中，有多个配置环境相关的文件，它们的作用和区别如下:

### /etc/profile 

​	/etc/profile：这是系统级别的**全局配置文件**，它包含了系统中所有用户的环境变量和系统级别的配置信息。当用户登录时，系统会自动读取该文件，并将其中的环境变量和配置信息加载到用户的环境中

-   用户设置系统环境变量参数
    -   比如 $PATH：这里的环境变量是**对系统内所有的用户生效**
-   重新载入配置文件 source /etc/profile

### /etc/bashrc

​	/etc/bashrc：这是系统级别的**全局配置文件**，它包含了系统中所有用户的环境变量和系统级别的配置信息。与~/.bashrc类似，它也是**在每次打开终端时都会被读取**，因此它通常用于定义系统级别的别名和函数等。

-   这个文件设置系统 bash shell 相关的内容，**对系统内所有的用户都其作用**
-   只要用户运行了 bash 命令（可以简单的理解为打开终端），那么bash配置文件就被加载

### ~/.bash_profile  

​	~/.bash_profile：这是**用户级别的配置文件**，它包含了用户的个人环境变量和个人级别的配置信息。当用户登录时，系统会自动读取该文件，并将其中的环境变量和配置信息加载到用户的环境中。

-   如果通过 cd ~ 或 cd 回到家目录下，通过 ls -al，发现的 .bash_profile 就是**针对于当前用户**来设定的

    -   root —— /root —— .bash_profile ——针对root用户其作用

    -   nhk —— /home/nhk —— .bash_profile ——针对nhk用户其作用

### ~/.bashrc 

​	~/.bashrc：这也是**用户级别的配置文件**，它包含了用户的个人环境变量和个人级别的配置信息。与~/.bash_profile不同的是，**~/.bashrc是在每次打开终端时都会被读取**，因此它通常用于定义用户的别名和函数等

-   作用类似于 /etc/bashrc，**只是针对当前用户而言**，不对其他用户生效。
-   这里的 .bashrc 中设定的（局部）变量，和 /etc/bashrc 是父子关系


