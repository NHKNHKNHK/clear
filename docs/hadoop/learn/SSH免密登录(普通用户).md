# SSH免密登录

说明：

​	假设我们在 NameNode节点部署在kk01 SecondNameNode节点部署在kk03，ResourceManager 部署在 kk02

​	kk01上的 NameNode 需要分别到kk01、kk02、kk03上启动DataNode，因此需要配置ssh免密到其他机器

​	kk02上的 ResourceManager 需要分别到kk01、kk02、kk03上启动NodeManager，因此需要配置ssh免密到其他机器

​	kk03上的SecondNameNode是通过网络通信开启的，因此kk03不需要配置ssh免密到其他机器

​	所以，我们这里面只**配置了kk01、kk02 到其他主机的无密登录**；因为kk01配置的是NameNode，kk02配置的是ResourceManager，都要求对其他节点无密访问。

## 1）kk01上生成公钥和私钥

注意：

​		如果我们使用的是普通用户 nhk，则除了**配置 普通用户 nhk  kk01 kk02 到 集群其他节点的免密**，**还需要配置 root 用户 kk01 到集群其他节点的免密**

```shell
[nhk@kk01 ~]$ pwd
/home/nhk
[nhk@kk01 ~]$ ssh-keygen -t rsa     # 输入这个命令以后，连按3下回车
Generating public/private rsa key pair.
Enter file in which to save the key (/home/nhk/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/nhk/.ssh/id_rsa.
Your public key has been saved in /home/nhk/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:IyZWRTpgC/Tw3sRDas2z8C5ohz9+bn3zbcYsjpiXVk0 nhk@kk01
The key's randomart image is:
+---[RSA 2048]----+
| .+ o ..o        |
|   * O o         |
|    B @          |
|   o * =      E  |
|    + * S    o   |
|   + + . .  . .  |
|  + o ..   o o   |
| . o..o .o*...=  |
|   .o=. o+.+o+.  |
+----[SHA256]-----+
[nhk@kk01 ~]$ ls -la
....
drwxr-xr-x.  2 nhk  nhk     6 Jun 16 15:29 Public
drwx------.  2 nhk  nhk    57 Jun 16 16:47 .ssh
[nhk@kk01 ~]$ cd .ssh/
[nhk@kk01 .ssh]$ ll
total 12
-rw-------. 1 nhk nhk 1679 Jun 16 16:47 id_rsa		# 生成的私钥
-rw-r--r--. 1 nhk nhk  390 Jun 16 16:47 id_rsa.pub	# 生成的公钥
-rw-r--r--. 1 nhk nhk  182 Jun 16 16:13 known_hosts
```

然后敲（三个回车），就会生成两个文件id_rsa（私钥）、id_rsa.pub（公钥）

## 2）将kk01公钥拷贝到要免密登录的目标机器上

现在，我们需要将kk01机器上 /home/nhk/.ssh 目录下的 id_rsa.pub 公钥分发到kk01、kk02、kk03，只有这样，kk01才能免密登录到 kk01、kk02、kk03

```shell
[nhk@kk01 .ssh]$ ssh-copy-id kk01
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/nhk/.ssh/id_rsa.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
nhk@kk01's password: 

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh 'kk01'"
and check to make sure that only the key(s) you wanted were added.

[nhk@kk01 .ssh]$ ll
total 16
-rw-------. 1 nhk nhk  390 Jun 16 16:51 authorized_keys # 存放授权过的无密登录服务器公钥
-rw-------. 1 nhk nhk 1679 Jun 16 16:47 id_rsa
-rw-r--r--. 1 nhk nhk  390 Jun 16 16:47 id_rsa.pub
-rw-r--r--. 1 nhk nhk  364 Jun 16 16:51 known_hosts#记录ssh访问过计算机的公钥(public key) 

[nhk@kk01 .ssh]$ ssh-copy-id kk02

[nhk@kk01 .ssh]$ ssh-copy-id kk03
```

​	其中，authorized_keys是一个文件，用于存储该用户允许登录的公钥。当用户使用SSH协议登录到远程主机时，系统会检查该用户的authorized_keys文件，如果该用户的公钥在该文件中，则允许该用户登录。

​	authorized_keys文件的格式为每行一个公钥，可以通过将本地公钥添加到远程主机的authorized_keys文件中，实现无密码登录远程主机的功能。这种方式可以提高系统的安全性，因为只有拥有私钥的用户才能登录到远程主机，而且不需要输入密码，避免了密码泄露的风险。

```shell
[nhk@kk01 .ssh]$ cat authorized_keys 	
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCvjE4ZqmxANCAde45dySr/j3UnqUsJtusprflas1YsHD3OngNcklRtnfWQQDoD0dQucfLy5TMDNl4GmsCbiWMTtVTuBo8kv5PxNRr5JMC7ePifpfSHTdISa
pwYKGPsby6rphEv5G/r1QNiFGn7JRGW5yaQW8A0xTR/pMUs9UJJ/8uwrE5syWmpFFqTQoFT/iIfkk8NhQ9sKXmsv4uYxDou7Dt2B7WXqPmJCY2A6JtBFocUJzu3oqhdRbaAplXuM1meCTRUK/skzr3hsf5HBOu7LooeIR/Z6N/O3gls8QRDEcWqs22gIikxZR8WQHY4no2A78h9JeFxjBjCP7gj4Jl/ nhk@kk01  # 表示kk01上的nhk用户可以拿着密钥对当前机器进行免密登录
```



## 3）kk02上生成公钥和私钥

```shell
[nhk@kk02 .ssh]$ pwd
/home/nhk/.ssh
[nhk@kk02 .ssh]$ ssh-keygen -t rsa
Generating public/private rsa key pair.
Enter file in which to save the key (/home/nhk/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/nhk/.ssh/id_rsa.
Your public key has been saved in /home/nhk/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:crY+RiZ9sqIBnB6gE6m7pUtyuQo71FJC1mVJnA3h4nk nhk@kk02
The key's randomart image is:
+---[RSA 2048]----+
|  . +**          |
| + .o+ .         |
|*  . .           |
|o=.oo            |
|+ Oo E..S        |
| * =. .+=..      |
|=.* .  +.+       |
|=* . ...+        |
|*+. .. o..       |
+----[SHA256]-----+
```

然后敲（三个回车），就会生成两个文件id_rsa（私钥）、id_rsa.pub（公钥）

## 4）将kk01公钥拷贝到要免密登录的目标机器上

```shell
[nhk@kk02 .ssh]$ ssh-copy-id kk01

[nhk@kk02 .ssh]$ ssh-copy-id kk02

[nhk@kk02 .ssh]$ ssh-copy-id kk03
```

## 5）配置root 用户 kk01 到集群其他节点的免密

我们使用普通用户nhk搭建Hadoop集群了，并且已经配置了普通用户nhk的免密登录，为什么还需要配置root用户的免密登录呢？

因为我们后续可能会需要用到采用root用户进行ssh，比如：

我们使用 xsync自定义分发脚本时，有时我们需要分发root用户所属的目录，比如 /etc/profile.d/my_env.sh ，此时我们就需要用到 sudo命令，用于以超级用户（root）的身份执行命令，此时会将权限切换到了root目录下，以root用户分发文件，因此root用户也需要免密到 kk02、kk03

```shell
[nhk@kk01 software]$ su root
Password: 
[root@kk01 software]# whoami
root
[root@kk01 software]# cd 
[root@kk01 ~]# pwd
/root
[root@kk01 ~]# ssh-keygen -t rsa
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): 
Created directory '/root/.ssh'.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /root/.ssh/id_rsa.
Your public key has been saved in /root/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:oyaCNry6CqIUaXg1Bp1IEtAuWuTPa7YKgQtMZaf0Qq0 root@kk01
The key's randomart image is:
+---[RSA 2048]----+
|=+oB.o           |
| .O.*.           |
| = o=.           |
|* =E..           |
|*B.o    S        |
|==. o  . .       |
|*=. ..o          |
|*.o.+o           |
|Bo.+..           |
+----[SHA256]-----+
[root@kk01 ~]# ssh-copy-id kk01

[root@kk01 ~]# ssh-copy-id kk02

[root@kk01 ~]# ssh-copy-id kk03
```

此致，基于普通用户搭建Hadoop的SSH免密配置完成

