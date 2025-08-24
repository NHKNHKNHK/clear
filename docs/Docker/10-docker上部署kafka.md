# docker上部署kafka

## **拉取kafka 和zookeeper镜像**

```shell
# 默认拉取的是latest
[root@nhk ~]# docker pull bitnami/kafka:3.0.0
[root@nhk ~]# docker pull zookeeper

[root@nhk ~]# docker network create app-tier

[root@nhk ~]# docker run -d --name kafka-server --network app-tier  -e ALLOW_PLAINTEXT_LISTENER=yes     bitnami/kafka:3.0.0

[root@nhk ~]# docker run --name some-zookeeper --restart always -d zookeeper
```

## **启动zookeeper**

启动kafka之前需要启动zookeeper，如果不启动，kafka没有地方注册消息

```shell
[root@nhk ~]# docker run -it --name zookeeper -p 2181:2181 -d zookeeper
```

## **启动kafka容器**

```shell
[root@nhk ~]# docker run bitnami/kafka -it --name="kafka01" -p 9092:9092 -d -e KAFKA_BROKER_ID=0 -e KAFKA_ZOOKEEPER_CONNECT=192.168.188.150:2181 -e KAFKA_ADVI
```
