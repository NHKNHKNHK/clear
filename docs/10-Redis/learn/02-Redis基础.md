# Redis基础知识

- redis默认有16个数据库

`redis.conf`

```shell
# Set the number of databases. The default database is DB 0, you can select
# a different one on a per-connection basis using SELECT <dbid> where
# dbid is a number between 0 and 'databases'-1
databases 16
```

- redis默认使用的是第0个数据库，使用select可以切换数据库

```shell
127.0.0.1:6379> select 3
OK
127.0.0.1:6379[3]> DBSIZE    # 查看3号数据库大小
(integer) 0
```

## 查看当前库所有的key

```shell
keys * 

# 例如
127.0.0.1:6379> keys *
(empty array)
127.0.0.1:6379> set k1 zhangsan    # 这里先添加两个k-v 用于测试
OK
127.0.0.1:6379> set k2 lisi
OK
127.0.0.1:6379> keys *
1) "k2"
2) "k1"
```

## 判断某个key是否存在

```shell
exists key    # 存在返回1，不存在返回0

# 例如：
127.0.0.1:6379> EXISTS k1
(integer) 1
127.0.0.1:6379> EXISTS k3    # 查看不存在的key，返回0
(integer) 0
```

（匹配：key * 1）

## 查看key的类型 TYPE

```shell
type key

# 例如
127.0.0.1:6379> TYPE k1
string
```

## 删除指定的key的数据 DEL

```shell
del key

# 例如
127.0.0.1:6379> del k2
(integer) 1
127.0.0.1:6379> KEYS *
1) "k1"
```

## 根据value选择**非阻塞删除** UNLINK

说明：仅将keys从keyspace元数据删除，真正的删除会在后续操作异步删除

```shell
unlink key

# 例如：
127.0.0.1:6379> UNLINK k1
(integer) 1
```

## 为给定key设置过期时间（单位为 s） EXPIRE

```shell
expire key 10     # 表示10s后key过期
```

## 查看指定的key的过期时间 TTL

```shell
ttl key    # -1 表示永不过期，-2表示已过期

# 例如
127.0.0.1:6379> set k3 xiaomi
OK
127.0.0.1:6379> EXPIRE k3 20
(integer) 1
127.0.0.1:6379> ttl k3    # 查看k3的过期时间
(integer) 15
127.0.0.1:6379> ttl k3
(integer) 12
127.0.0.1:6379> ttl k3
(integer) 5
127.0.0.1:6379> ttl k3
(integer) -2
127.0.0.1:6379> ttl k3
(integer) -2
```

## 切换数据库（redis中默认有16个库

```shell
select n

# 例如
127.0.0.1:6379> SELECT 0
OK
127.0.0.1:6379> SELECT 10
OK
127.0.0.1:6379[10]> SELECT 15
OK
127.0.0.1:6379[15]> SELECT 16
(error) ERR DB index is out of range
```

## 查看当前数据库的key的数量

```shell
dbsize

# 例如
127.0.0.1:6379[15]> SELECT 0
OK
127.0.0.1:6379> DBSIZE
(integer) 0
```

## 清空当前库

```shell
flushdb

# 例如
127.0.0.1:6379> FLUSHDB
OK
```

## 通杀全部库

清空所有的数据库

```shell
flushall

# 例如
127.0.0.1:6379> FLUSHALL
OK
```
