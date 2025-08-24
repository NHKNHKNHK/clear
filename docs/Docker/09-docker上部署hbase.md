# Docker部署HBase


## 拉取镜像到本地

```shell
sudo docker pull harisekhon/hbase-dev:2.1

# pull 拉取
# harisekhon/hbase-dev 镜像名
# 2.1	TAG版本
```

## 列出本地主机上的镜像

```shell
sudo docker images
```

## 新建容器并启动

```shell
sudo docker run -d --name="hbase001" -P harisekhon/hbase-dev:2.1

# -d 以守护式的方式（即容器在后台运行）
# --name="hbase001" 指定容器名称，不指定则由docker随机生成
# -P 随机端口映射
# harisekhon/hbase-dev 镜像名
# 2.1 TAG版本
```

## 在浏览器查看是否启动成功

```shell
http://192.168.188.150:32770/master-status
# 注意：因为创建容器时使用了-P参数，因此会有端口映射，可以使用下面命令查看容器进程，来查看端口映射
sudo docker ps 

# 查询看到如下内容
 0.0.0.0:32770->16010/tcp
```

## 进入HBase容器

```shell
sudo docker exec -it 578c223d68df /bin/bash

# 以exec方式进入容器，在容器中打开新的终端，并且可以启动新的进程，用exit退出，不会导致容器停止
# -i 以交互式方式操作
# -t 为容器重新分配一个伪输入终端
# 578c223d68df 容器ID
```

## 进入hbase shell

```shell
bash-4.4# hbase shell

# 成功进入的信息
2023-04-12 13:49:10,363 WARN  [main] util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applic
ableHBase Shell
Use "help" to get list of supported commands.
Use "exit" to quit this interactive shell.
For Reference, please visit: http://hbase.apache.org/2.0/book.html#shell
Version 2.1.3, rda5ec9e4c06c537213883cca8f3cc9a7c19daf67, Mon Feb 11 15:45:33 CST 2019

```

## 停止容器

```shell
sudo docker stop 578c223d68df
```

