# Docker部署ElasticSearch、Kibana

## **1）拉取镜像**

```shell
# 存储和检索数据
[root@nhk ~]# docker pull elasticsearch:7.4.2

# 可视化检索数据
[root@nhk ~]# docker pull kibana:7.4.2
```

```shell
# 查看镜像
[root@nhk ~]# docker images | grep elasticsearch
elasticsearch          7.4.2          b1179d41a7b4   3 years ago     855MB

[root@nhk ~]# docker images | grep kibana
kibana                 7.4.2          230d3ded1abc   3 years ago     1.1GB


# 查看内存使用情况
[root@nhk ~]# free -m
              total        used        free      shared  buff/cache   available
Mem:           1819        1142          77          10         598         483
Swap:          2047          45        2002
```

## **2）创建ES实例**

```shell
# 配置文件挂载的容器卷
[root@nhk ~]# mkdir -p /opt/software/elasticsearch/config
# es中数据挂载的容器卷
[root@nhk ~]# mkdir -p /opt/software/elasticsearch/data

# 写入配置文件
[root@nhk ~]# echo "http.host: 0.0.0.0" >> /opt/software/elasticsearch/config/elasticsearch.yml
[root@nhk ~]# cat /opt/software/elasticsearch/config/elasticsearch.yml 
http.host: 0.0.0.0		# 注意 :之后需要加空格
```

```shell
[root@nhk ~]# docker run --name elasticsearch -p 9200:9200 -p 9300:9300 \
-e discovery.type=single-node \
-e ES_JAVA_OPTS="-Xms64m -Xmx128m" \
-v /opt/software/elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml \
-v /opt/software/elasticsearch/data:/usr/share/elasticsearch/data \
-v /opt/software/elasticsearch/plugins:/usr/share/elasticsearch/plugins \
-d elasticsearch:7.4.2


# 说明
--name elasticsearch	为该容器实例命名为 elasticsearch
-p 9200:9200 -p 9300:9300	端口映射	暴露端口:容器实例端口
-e discovery.type=single-node 	es以单节点运行
-e ES_JAVA_OPTS="-Xms64m -Xmx128m" 	执行es占用的内存，生产环境中可以配置成32G
-v 		挂载容器卷
-d		后台启动

# 特别强调
-e ES_JAVA_OPTS="-Xms64m -Xmx128m" 在测试环境下设置ES的初始内存和最大内存，否则会导致内存占用过大无法正常启动
```

## **3）纠错**

如果ES启动失败，可以查看该容器实例的日志信息进行纠错

```shell
[root@nhk ~]# docker logs elasticsearch

# 可能会出现如下报错信息
Caused by: java.nio.file.AccessDeniedException: /usr/share/elasticsearch/data/nodes

# 只需要将挂载的容器卷的访问权限做出修改即可（让任何用于都有访问权限）
[root@nhk elasticsearch]# chmod -R 777 /opt/software/elasticsearch/
[root@nhk elasticsearch]# ll
total 0
drwxrwxrwx. 2 root root 31 Sep  6 03:13 config
drwxrwxrwx. 2 root root  6 Sep  6 02:46 data
drwxrwxrwx. 2 root root  6 Sep  6 02:47 plugins
```

## 4）重启容器

```shell
[root@nhk elasticsearch]# docker start elasticsearch 
elasticsearch
#  查看容器实例
[root@nhk elasticsearch]# docker ps | grep elastic
77d4fb852324   elasticsearch:7.4.2   "/usr/local/bin/dock…"   7 minutes ago   Up 10 second
s   0.0.0.0:9200->9200/tcp, :::9200->9200/tcp, 0.0.0.0:9300->9300/tcp, :::9300->9300/tcp  elasticsearch
```

## 5）打开浏览器查看

格式：宿主机IP:9200

例如：http://192.168.188.150:9200

看到如下信息，则证明ES部署成功

```json
{
  "name" : "77d4fb852324",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "aqDGrs-4SxeJ96-4s3wQuw",
  "version" : {
    "number" : "7.4.2",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "2f90bbf7b93631e52bafb59b3b049cb44ec25e96",
    "build_date" : "2019-10-28T20:40:44.881551Z",
    "build_snapshot" : false,
    "lucene_version" : "8.2.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

## 6）安装Kibana

```shell
[root@nhk ~]# docker run --name kibana -e ELASTICSEARCH_HOSTS=http://192.168.188.150:9200/ -p 5601:5601 -d kibana:7.4.2

# 说明 
http:192.168.188.150:9200 	这里填的是Docker宿主机的IP地址
```

```shell
[root@nhk ~]# docker ps | grep kibana
90b1a08df74c   kibana:7.4.2          "/usr/local/bin/dumb…"   18 seconds ago   Up 17 seconds   0.0.0.0:5601->5601/tcp, :::5601->5601/tcp                    
                          kibana
```

## 7）访问Kibana

格式：宿主机IP:5601

例如：http://192.168.188.150:5601



