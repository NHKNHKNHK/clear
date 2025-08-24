# Docker私有仓库

## 0 为什么需要私有仓库

1、官方 Docker Hub地址，但是中国大陆访问太慢了，已经有被阿里云取代的趋势，不太主流

https://hub.docker.com/

2、Docker Hub、阿里云这样的公共镜像仓库可能不太方法，涉及机密的公司不可能提供镜像给公网，所以需要创建一个本地私人仓库供给团队使用，基于公司内部项目构建镜像

:::info
**Docker Registry是官方提供的工具，可以用于构建私有镜像仓库**
:::

## 1 私有仓库的搭建

1）下载镜像Docker Registry（私有仓库镜像）

```shell
# 拉取私有仓库镜像
[root@nhk opt]# docker pull registry
# 查看镜像
[root@nhk opt]# docker images | grep re
registry               latest         b8604a3fe854   20 months ago   26.2MB
redis                  6.0.8          16ecd2772934   2 years ago     104MB
```

2）运行私有库Registry，相当于本地有个私有Docker hub

```shell
# 默认情况，仓库被创建在容器的/var/lib/registry目录下，建议自行用容器卷映射，方便宿主机联调

[root@nhk opt]# docker run -d --name=registery -p 5000:5000 -v /nhk/myregistry/:/tmp/registry --privileged=true registry
52b9e172bf9051d0703985a2ef10b9d5b5a474a060484a78b350c88d0432fa52
											# /nhk/myregistry/表示本地路径
										 	# /tmp/registry表示容器路径

# 说明
#	 -v /nhk/myregistry/:/tmp/registry 为挂载容器卷
#								本地的/nhk/myregistry/目录挂载到容器的/tmp/registry目录
# 	--privileged=true 参数用于给容器赋予特权

[root@nhk opt]# docker ps 
52b9e172bf90   registry              "/entrypoint.sh /etc…"   41 seconds ago   Up 41 seconds   0.0.0.0:5000->5000/tcp, :::5000->5000/tcp                    
                          registery
```

3）验证私有仓库是否搭建成功

方式一：

​	在浏览器输入 http://192.168.188.150:5000/v2/_catalog

​	如果看到 	{"repositories":[]}   等字样，说明私有仓库搭建成功

方式二：

​	curl验证私服库上有什么镜像

```shell
[root@nhk ~]# curl -XGET http://192.168.188.150:5000/v2/_catalog
{"repositories":[]}   # 目前私服库没有任何镜像
```

4）修改 daemon.json

修改配置文件使之支持http

**docker默认不允许http方式推送镜像，通过配置选项来取消这个限制（若修改完配置不生效，建议重启docker）**

```shell
[root@nhk ~]# vim /etc/docker/daemon.json
# 添加如下内容

{
  "registry-mirrors": ["https://8azymw96.mirror.aliyuncs.com"],       
  "insecure-registries": ["192.168.188.150:5000"]

}

# registry-mirrors配置的是国内阿里提供的镜像加速地址
# 注意：一定要加两个配置之间的逗号
```

5）重启 docker

```shell
[root@nhk opt]# systemctl restart docker
[root@nhk opt]# docker start registery 
registery
[root@nhk opt]# docker ps
CONTAINER ID   IMAGE                 COMMAND                  CREATED         STATUS          PORTS                                                          
                        NAMES52b9e172bf90   registry              "/entrypoint.sh /etc…"   7 minutes ago   Up 4 seconds    0.0.0.0:5000->5000/tcp, :::5000->5000/tcp                     
                         registery
```

## 2 将本地镜像推送到私有仓库

### 常用命令

```shell
# 标记镜像为私有仓库的镜像(修改镜像以符合私服规范的Tag)
docker tag 镜像名:TAG	私有仓库服务器IP:5000/镜像名:TAG

# push镜像到私有仓库
docker push 私有仓库服务器IP:5000/镜像名:TAG
```

### 演示

案例演示：

​	创建一个新镜像，ubuntu安装ifcofig命令

1）原始的ubuntu镜像是不带着ifconfig命令的，

```shell
[root@nhk opt]# docker run -it --name=ubuntu-test  ubuntu /bin/bash
root@d4ecde7c6484:/# ifconfig
bash: ifconfig: command not found		# 现在不能使用ifconfig命令
```

2）需要在外网连通的情况下，使用apt-get命令安装，并测试ifconfig

```shell
# 以下命令在容器内执行
root@d4ecde7c6484:/# apt-get update 

root@d4ecde7c6484:/# apt-get install net-tools

root@d4ecde7c6484:/# ifconfig           # 现在可以使用ifconfig命令了      
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.4  netmask 255.255.0.0  broadcast 172.17.255.255
        ether 02:42:ac:11:00:04  txqueuelen 0  (Ethernet)
        RX packets 3051  bytes 28048669 (28.0 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2509  bytes 140556 (140.5 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

3）打开新的shell（终端），将容器commit成的新的镜像（以便将镜像打包到私有仓库）

```shell
# 说明 d4ecde7c6484 为 我们要打成镜像的容器的容器ID，可以通过docker ps查看
[root@nhk ~]# docker commit -m="add ifconfig ok" -a="nhk" d4ecde7c6484 clear/myubnutu:1.2
sha256:2a0aab226f3644be559d507f175457cd72bcc6ef4fb20a04e66b4fa42a2c5602

[root@nhk ~]# docker images		# 查看我们打包好的镜像
REPOSITORY             TAG            IMAGE ID       CREATED          SIZE
clear/myubnutu         1.2            2a0aab226f36   14 seconds ago   119MB
```

4）curl验证私服库上有什么镜像

```shell
[root@nhk ~]# curl -XGET http://192.168.188.150:5000/v2/_catalog
{"repositories":[]}   # 目前私服库没有任何镜像
```

5）将新镜像myubuntu:1.2 修改符合 私服规范的Tag

```shell
# docker tag 镜像:Tag Host:Port/Repository:Tag

[root@nhk ~]# docker tag clear/myubnutu:1.2 192.168.188.150:5000/nhkubuntu:1.2
[root@nhk ~]# docker images
REPOSITORY                       TAG            IMAGE ID       CREATED          SIZE
clear/myubnutu                   1.2            2a0aab226f36   16 minutes ago   119MB
192.168.188.150:5000/nhkubuntu   1.2            2a0aab226f36   16 minutes ago   119MB
```

6）push推送到私服库

```shell
[root@nhk ~]# docker push 192.168.188.150:5000/nhkubuntu:1.2
The push refers to repository [192.168.188.150:5000/nhkubuntu]
2687cbb37d59: Pushed 
9f54eef41275: Pushed 
1.2: digest: sha256:214a6882f769a366495e0cdbf2702c08cc9674f684cad41edf496fdc5b4d80c8 size: 741
```

7）再次curl验证私服库上有什么镜像

```shell
[root@nhk ~]# curl -XGET http://192.168.188.150:5000/v2/_catalog
{"repositories":["nhkubuntu"]}
```

## 3 从私服仓库拉取镜像

### 常用命令

```shell
# 拉取私有仓库中的镜像（私有仓库中的镜像实际上是存储在本地主机上的，只是通过私有仓库进行管理和访问。使用docker pull 命令从私有仓库中拉取镜像时，实际上是将镜像下载到本地主机上的Docker守护进程中）
docker pull 私有仓库服务器IP:5000/镜像名:TAG
```

### 演示

1）pull到本地运行

```shell
[root@nhk ~]# docker pull 192.168.188.150:5000/nhkubuntu:1.2
1.2: Pulling from nhkubuntu
Digest: sha256:214a6882f769a366495e0cdbf2702c08cc9674f684cad41edf496fdc5b4d80c8
Status: Image is up to date for 192.168.188.150:5000/nhkubuntu:1.2
192.168.188.150:5000/nhkubuntu:1.2

# 查看镜像
[root@nhk ~]# docker images
REPOSITORY                       TAG            IMAGE ID       CREATED          SIZE
192.168.188.150:5000/nhkubuntu   1.2            2a0aab226f36   19 minutes ago   119MB
```

说明：

​	使用`docker images`命令查看镜像列表时，它默认显示的是本地主机上的镜像列表，包括私有仓库中的镜像。私有仓库中的镜像实际上是存储在本地主机上的，只是通过私有仓库进行管理和访问。

​	使用`docker pull`命令从私有仓库中拉取镜像时，实际上是将镜像下载到本地主机上的Docker守护进程中。然后，您可以使用`docker images`命令查看本地主机上的镜像列表，包括从私有仓库中拉取的镜像。