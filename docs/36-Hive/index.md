# 什么是Hive

## Hive简介

Hive是由Facebook开源，基于Hadoop的一个**数据仓库工具**，可以**将结构化的数据文件映射为一张表**，并提供类SQL查询功能。

那为什么会有Hive呢？它是为了解决什么问题而诞生的呢？

下面通过一个案例，来快速了解一下Hive。

例如：需求，统计单词出现个数。

（1）在Hadoop中我们用MapReduce程序实现的，当时需要写Mapper、Reducer和Driver三个类，并实现对应逻辑，相对繁琐。

```
test表
id列

hello
hello
ss
ss
jiao
banzhang
xue
hadoop
```

（2）如果通过Hive SQL实现，一行就搞定了，简单方便，容易理解

```shell
select count(*) from test group by id;
```

## Hive本质

Hive是一个Hadoop客户端，用于将HQL（Hive SQL）转化成MapReduce程序。

（1）Hive中每张表的数据存储在HDFS

（2）Hive分析数据底层的实现是MapReduce（也可配置为Spark或者Tez） 

（3）执行程序运行在Yarn上