# Portainer安装

## Portainer简介

Portainer是一款轻量级的应用，它提供了**图形化界面**，用于方便地管理Docker环境，包括单机环境和集群环境。

::: tip
官网

https://www.portainer.io/

https://docs.portainer.io/v/ce-2.9/start/install/server/docker/linux

:::

## Portainer安装

1）搜索portainer镜像

```shell
docker search portainer
```

2）拉取portainer镜像

```shell
docker pull portainer/portainer    
```

3）启动portainer容器

```shell
[root@nhk ~]# docker run -d -p 8000:8000 -p 9000:9000 --name portainer --restart=always \
-v /var/run/docker.sock:/var/run/docker.sock \
-v portainer_data:/data portainer/portainer

Unable to find image 'portainer/portainer:latest' locally
latest: Pulling from portainer/portainer
94cfa856b2b1: Pull complete 
49d59ee0881a: Pull complete 
a2300fd28637: Pull complete 
Digest: sha256:fb45b43738646048a0a0cc74fcee2865b69efde857e710126084ee5de9be0f3f
Status: Downloaded newer image for portainer/portainer:latest
37d56afafd29b6c96d566ac1bde33d073192ada70eebbe6cfa81e5f3e24dfa87

# 说明
# --restart=always 确保容器永远启动，docker启动该容器就会启动


[root@nhk ~]# docker ps
CONTAINER ID   IMAGE                 COMMAND        CREATED              STATUS              PORTS                                                           
                       NAMES37d56afafd29   portainer/portainer   "/portainer"   About a minute ago   Up About a minute   0.0.0.0:8000->8000/tcp, :::8000->8000/tcp, 0.0.0.0:9000->9000/tc
p, :::9000->9000/tcp   portainer

# 查看日志
[root@nhk ~]# docker logs -f portainer
```

4）第一次登录需要创建admin，访问地址：xxxx.xxxx.xxx:9000

​	浏览器中ip+端口访问，例如：http://192.168.188.150:9000

​	首次登录，需要你创建管理员admin的密码，用户名默认写 admin，密码写一个8位数

5）设置admin用户和密码以后，首次登录

6）选择local选项卡后本地docker详细信息展示

