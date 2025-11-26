

# HDFS集群

```shell
hadoop-daemon.sh start namenode		# 这两条命令在Hadoop3已经deprecated
hadoop-daemon.sh start datanode
```



```shell
hdfs --daemon start namenode|datanode|secondarynamenode

hdfs --daemon stop namenode|datanode|secondarynamenode
```

# YARN集群

```shell
yarn --daemon start resourcemanager|nodemanager

yarn --daemon stop resourcemanager|nodemanager
```

# **shell脚本一键启停**

使用Hadoop自带的shell脚本一键启动

前提：配置好机器之间的ssh免密登录和workers文件

## HDFS集群

```shell
start-dfs.sh
stop-dfs.sh
```

## YARN集群

```
start-yarn.sh
stop-yarn.sh
```

## Hadoop集群

```
start-all.sh
stop-all.sh
```

