# Docker容器监控CIG


通过 `docker stats` 命令可以很方便的看到当前宿主机上所有容器的CPU、内存以及网络流量等数据，但是 `docker stats`统计的结果只能是当前宿主机的全部容器，数据资料是实时的，没有地方存储、没有健康指标过线预警等功能。

## **容器监控3剑客**

> 一句话：CAdvisor监控收集 + InfluxDB存储数据 + Granfana展示图表

### **CAdvisor**

​	CAdvisor是一个容器资源监控工具，包括容器的内存，CPU，网络IO，磁盘IO等监控，同时提供一个WEB页面用于查看容器的实时运行状态。CAdvisor默认存储2分钟的数据，而且只是针对单物理机。不过，CAdvisor提供了很多数据集成接口，支持 InfluxDB、Redis、Kafka、Elasticsearch等集成，可以加上对于配置将监控数据发往这些数据库存储起来。

CAdvisor功能主要有两点：

-   展示Host和容器两个层次的监控数据
-   展示历史变化数据

### **InfluxDB**

​	InfluxDB是用go语言编写的一个开源分布式时序、事件和指标数据库，无需外部依赖。

CAdvisor默认只在本机保存最近2分钟的数据，为了持久化存储数据和统一收集展示监控数据，需要将数据存储到InfluxDB中。InfluxDB是一个时序数据库，专门用于存储时序相关数据，很适合存储CAdvisor的数据。而且，CAdvisor本身已经提供了InfluxDB的集成方法，启动容器时指定配置即可。

InfluxDB主要功能：

-   基于时间序列，支持与时间有关的相关函数（如最大、最小、求和等）
-   可度量性：你可以实时对大量数据进行计算
-   基于事件：它支持任意的事件数据

### **Granfana**

Granfana是一个开源的数据监控分析可视化平台，支持多种数据源配置（支持的数据源包括InfluxDB、MySQL、Elasticsearch、OpenTSDB、Graphite等）和丰富的插件及模板功能，支持图表权限控制和报警。

Granfana主要特性：

-   灵活丰富的图形化选项
-   可以混合多种风格
-   支持白天和夜间模式
-   多个数据源

## Docker Compose容器编排

### 新建目录

```shell
[root@nhk /]# mkdir -p /mydocker/cig
[root@nhk /]# cd mydocker/cig/
[root@nhk cig]# pwd
/mydocker/cig
```

### 新建3件组合的docker-compose.yml

```shell
[root@nhk cig]# vim docker-compose.yml
```

docker-compose.yml 参考内容如下

```yaml
version: '3'

volumes:
  grafana_data:

services:
  influxdb:
    image: tutum/influxdb:0.9
    restart: always
    ports:
      - "8083:8083"
      - "8086:8086"
    volumes:
      - ./data/influxdb:/var/lib/influxdb
    environment:
      - PRE_CREATE_DB=cadvisor

  cadvisor:
    image: google/cadvisor
    links:
      - influxdb:influxsrv
    command: -storage_driver=influxdb -storage_driver_db=cadvisor -storage_driver_host=influxsrv:8086
    restart: always
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro

  grafana:
    image: grafana/grafana
    restart: always
    links:
      - influxdb:influxsrv
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    environment:
      - HTTP_USER=admin
      - HTTP_PASS=admin
      - INFLUXDB_HOST=influxsrv
      - INFLUXDB_PORT=8086
      - INFLUXDB_NAME=cadvisor
      - INFLUXDB_USER=root
      - INFLUXDB_PASS=root
```

### 启动docker-compose文件

```shell
[root@nhk cig]# docker-compose config -q # 检查语法是否正确，如果没有任何输出，证明正确
```

```shell
[root@nhk cig]# docker-compose up  # 建议使用 -d 后台启动
```

### 查看三个服务容器是否启动成功

```shell
[root@nhk cig]# docker ps
CONTAINER ID   IMAGE                 COMMAND                  CREATED              STATUS              PORTS                                                 
                                 NAMES5d4c8232ff47   grafana/grafana       "/run.sh"                About a minute ago   Up About a minute   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp             
                                 cig-grafana-1f8df3f8255be   google/cadvisor       "/usr/bin/cadvisor -…"   About a minute ago   Up About a minute   0.0.0.0:8080->8080/tcp, :::8080->8080/tcp            
                                  cig-cadvisor-17d0fbe83875e   tutum/influxdb:0.9    "/run.sh"                About a minute ago   Up About a minute   0.0.0.0:8083->8083/tcp, :::8083->8083/tcp, 0.0.0.0:808
6->8086/tcp, :::8086->8086/tcp   cig-influxdb-137d56afafd29   portainer/portainer   "/portainer"             39 hours ago         Up 26 minutes       0.0.0.0:8000->8000/tcp, :::8000->8000/tcp, 0.0.0.0:900
0->9000/tcp, :::9000->9000/tcp   portainer
```

### 测试

测试CAdvisor**收集**服务，http://ip:8080

​	第一次访问比较慢，请稍等

​	CAdvisor也有基础的图像展现功能，这里主要用它来做收集采集

测试InfluxDB**存储**服务，http://ip:8083

测试Granfana**展现**服务，http://ip:3000

​	ip+3000端口的方式默认访问，默认账户密码（admin/admin）

```
​	配置步骤：

​		1）配置数据源

​		2）选择influxdb数据源

​		3）配置细节

​			Name ： InfluxDB

​			URL：http://InfluxDB:8086

​			Database:	cadvisor

​			User:	root

​			PassWord:	root

​		配置完成看到 Data Source is working则设置成功

​		4）配置面板panel

​			创建新的 Dashborad	==> Add an empty panel ==> Search for（选择Graph） ==> Save  ==> Dasgboard name: cig01，Folder: General ==> Save
```
​		到这里cAdvisor + InfluxDB + Grafana 容器监控系统就

