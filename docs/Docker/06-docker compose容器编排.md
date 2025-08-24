# Docker Compose容器编排

## Docker Compose简介

### Docker Compose是什么

​	Compose 是Docker公司推出的一个工具软件，可以管理多个Dokcer容器组成一个应用。你需要定义一个YAML格式的配置文件 `docker-compose.yml`，**写好多个容器之间的调用关系**。然后，只要一个命令，就能同时启动/关闭这些容器

简单来说，Docker Compose 是Docker官方的开源项目，通过一个 `docker-compose.yml`配置文件来定义一组相关联的容器，**负责实现Docker容器集群的快速编排**。

### Docker Compose能干嘛

​	Docker建议我们每一个容器实例只运行一个服务，业务docker容器本身占用资源极少，所以最好是将每个服务单独的分隔开来，但是这样我们又面临了一个问题：

如果我们需要同时部署好多服务，难道要每个服务单独写Dockerfile，然后构建镜像、构建容器吗？这样岂不累死，所以Docker官方给我们提供了docker-compose多服务部署的工具

​	Compose允许用户通过一个单独的 docker-compose.yml 模板（YAML格式）来定义一组相关联的应用容器为一个项目（project）

可以很容易地用一个配置文件定义一个多容器的应用，然后使用一条指令安装这个应用所以的依赖，完成构建。**docker-compose 解决了容器与容器之间如何管理编排的问题**



## Docker Compose 下载安装

::: tip
Docker Compose 官方文档  	https://docs.docker.com/compose/compose-file/compose-file-v3/

Docker Compose  下载地址 	https://docs.docker.com/compose/install/
:::

```shell
[root@nhk ~]# sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 或者
[root@nhk ~]# sudo wget https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -O /usr/local/bin/docker-compose



# 授予执行权限
[root@nhk ~]# chmod +x /usr/local/bin/docker-compose 
[root@nhk ~]# 

验证安装是否成功
[root@nhk bin]# docker-compose --version	 # 您应该能够看到 Docker Compose 的版本信息
Docker Compose version v2.23.3
```

​	

## 卸载步骤

如果您无法成功下载 Docker Compose 或者想要卸载 Docker Compose，可以使用如下步骤：

如果你是使用 curl 安装的，则使用下面命令卸载

1）删除 Docker Compose 的二进制文件

```shell
sudo rm /usr/local/bin/docker-compose
```

2）验证 Docker Compose 是否已成功卸载

```shell
docker-compose --version
```

如果您看到类似 "command not found" 的错误消息，则表示 Docker Compose 已成功卸载。



## Compose 核心概念

-   一文件

**docker-compose.yml**

-   两要素

服务（service）：一个个应用容器实例，比如订单微服务、库存微服务、MySQL容器、nginx容器、redis容器等

工程（project）：由一组关联应用容器组成的一个**完整业务单元**，在docker-compose.yml 文件中定义

## Compose使用三步骤

-   **编写Dockerfile** 定义各个微服务应用并构建出对应的镜像文件
-   **使用 docker-compose.yml** 定义一个完整业务单元，安排好整体应用中的各个容器服务。
-   最后，**执行docker-compose.yml up 命令**，启动并运行整个应用程序，完成一键部署上线

## Compose 常用命令

查看帮助

```shell
docker-compose -h 
```

启动所有docker-compose服务。启动容器。如果不存在，将会构建镜像

```shell
docker-compose up
```

**启动所有docker-compose服务并后台运行**

```shell
docker-compose up -d
```

**停止并删除容器、网络、卷、镜像**

```shell
docker-compose down
```

进入容器实例内部 docker-compose exec docker-compose.yml 文件中写的服务id /bin/bash

```shell
docker-compose exec yml里面的服务id
```

展示当前docker-compose编排过的运行的所有容器

```shell
docker-compose ps
```

展示当前docker-compose编排过的容器进程

```shell
docker-compose top
```

查看容器输出日志

```shell
docker-compose logs yml里的服务id 
```

**检查配置**

```shell
docker-compose config
```

**检查配置，有问题才输出**（若无输出，则证明docker compose文件基本编写正确）

```shell
docker-compose config -q
```

重启服务

```shell
docker-compose restart
```

启动服务

```shell
docker-compose start
```

停止服务

```shell
docker-compose stop
```

以下是一个简单的 Docker Compose 示例文件 `docker-compose.yml`，用于启动一个包含 Web 应用和数据库的容器：

```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - 8080:80
    depends_on:
      - db
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: myapp
```

​	在上面的示例中，定义了两个服务：`web` 和 `db`。`web` 服务使用当前目录中的 Dockerfile 构建镜像，并将容器的 80 端口映射到主机的 8080 端口。`web` 服务还依赖于 `db` 服务，即 `web` 服务会在 `db` 服务启动之后才启动。

​	要使用 Docker Compose 启动这个应用程序，只需在包含 `docker-compose.yml` 文件的目录中运行 `docker-compose up` 命令即可。**Docker Compose 将会自动创建和启动这两个容器，并将它们连接在一起**。

## docker-compose.yml文件实例解读

```yaml
version: '3'  #  Docker Compose 文件格式的版本 3

services:
	microService:	# 服务名，可随意定义
		image: nhk_docker:1.6	# 镜像名:TAG
    	container_name: ms01	# 容器名称（相当于命令 --name ms01）
    	ports:
     	 	- "6001:6001"
   	 	volumes:	# 容器数据卷
      		- namenode:/hadoop/dfs/name
    	networks:
    		- clear_net
    	depends_on:	# 定义服务之间的依赖关系,当一个服务依赖于其他服务时，Docker Compose 会按照 depends_on 中定义的顺序来启动服务。只有在所依赖的服务都已经启动并且健康时，才会启动当前的服务,需要注意的是，depends_on 并不能保证依赖的服务一定会在当前服务之前启动完成。它只是定义了启动顺序，并不能检查服务的健康状态或等待服务完全启动。
    		- redis
    		- mysql 
   
   reids:
   		image: reids:6.0.8	# 镜像名:TAG
   		container_name: redis01
    	ports:
     	 	- "6379:6379"
   	 	volumes:	# 容器数据卷
      		- /app/redis/redis.conf:/etc/redis/redis.conf
      		- /app/redis/data:/data
    	networks:
    		- clear_net
    	command: redis-server /etc/redis/redis.conf	
   		
   	mysql:
   		image: mysql:5.7	# 镜像名:TAG
    	container_name: ms01	# 容器名称
    	environment:
    		MYSQL_ROOT_PASSWORD: '123456'
    		MYSQL_ALLOW_EMPTY_PASSWORD: 'on'
    		MYSQL_DATABASE: 'db01'
    		MYSQL_USER: 'nhk'
    		MYSQL_PASSWORD: '123456'
    	ports:
     	 	- "3306:3306"
   	 	volumes:	# 容器数据卷
      		- /app/mysql/db:/var/lib/mysql	
      		- /app/mysql/conf/my.cnf:/etc/my.cnf
      		- /app/mysql/init:/docker-entrypoint-initdb.d
    	networks:
    		- clear_net
    	command: --defalut-authentication-plugin=mysql_native_password  # 解决外部无法访问	
    	
	networks: 
		clear_net:
```




