## 什么是Redis？





## Redis为什么那么快？



## Redis的一般使用场景？



## Redis是单线程还是多线程？



## Redis为什么要设计成单线程？6.0不是变成多线程了吗？



## Redis常见五大数据类型？



string类型最大512M



## Redis的list类型常见的命令？





## Redis的Geo类型？



## Redis的HyperLogLog类型？



## Redis的Bitmap类型？



## 为什么EMBSTR的阈值是44？为什么以前是39？







## Redis可以实现事务吗？

Redis 事务是一个单独的隔离操作：**事务中的所有命令都会序列化、按顺序地执行**。事务在执行的过程中，不会被其他客户端发送来的命令请求所打断。

Redis 事务的主要作用就是**串联多个命令**防止别的命令插队。

注意：

​	**==Redis单条命令保证原子性，但是事务不保证原子性==**



## Redis的事务和关系型数据库有何不同？



## Redis中如何实现队列和栈的功能？





## Redis的复制延迟有哪些可能的原因？



## 简述Redis的Ziplist和Quicklist？



## Redis的VM机制是什么？

## 什么是Redis的ListPack？



## Redis的内存碎片化是什么？如何解决？



## Redis字符串的值最大能存多少？



## 如何保证缓存与数据库的一致性？



## 什么是缓存击穿？



## 什么是缓存雪崩？



## 什么是缓存穿透？



## 缓存击穿、雪崩、穿透的区别？



## Redis的发布订阅功能？



## 如何实现分布式锁？



## Redis实现分布式锁有什么问题吗？



## 分布式锁在未执行完逻辑之前就过期了怎么办？



## Redis的持久化机制？



## Redis生成rdb的时候，是如何处理正常请求的？



## Redis的red lock？



## Redis主从有哪几种常见的拓扑结构？



## 原生批处理命令(mset、mget)与Pipeline的区别？



## 如果Redis扛不住了怎么办？





## Redis的Cluster模式和Sentinel模式的区别是什么？



## Redis集群脑裂？



## 使用Redis集群时，通过key如何定位到对应节点？



## Redis为什么不复用c语言的字符串？



## 如何快速实现一个布隆过滤器？



## 如何快速实现一个排行榜？



## 如何用Redis统计海量UV？



## 如何使用Redis记录用户连续登录多少天？



## 如何解决热点key？



## 什么是redis bigKey？如何解决？



## redis哨兵机制？



## Redis的lua脚本？



## Redis的pipeline？



## Redis的过期策略？



## Redis的内存淘汰策略？



## Redis和memached的区别？



## 什么是Redis跳表？



## Redis存在线程安全吗？为什么？



## RDB和AOF的实现原理？以及优缺点？



## Redis和MySQL如何保证数据一致性？