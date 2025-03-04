## 什么是Redis？





## Redis为什么那么快？



## Redis的一般使用场景？

-   **统计访问次数**：很多官方网站的首页都需要统计访问次数PV

-   **生成全局ID**：使用incrby命令
    -   区别于雪花算法（因为存在时钟回拨的问题）

-   **分布式锁**：同类还有ZK分布式锁

-   **排行榜**：比如销量排行榜、点赞排行榜、积分排行
    -   通常情况使用sorted set保存排行榜的数据，zdd添加排行榜数据，zrange获取排行榜数据

-   **消息队列**：发布订阅，Redis2.0提供的，利用发布订阅也可以实现消息队列的功能

-   **记录用户登录状态**：保存用户登录信息，好处是可以设置过期时间

-   **限流**：比如限制同一个ip，一分钟之内只能访问10次接口
    -   也可以使用nginx，但使用Redis可以控制得更精细

-   位统计：使用Bitmap统计一周内连续登录的用户

-   缓存：减轻数据库压力



## Redis是单线程还是多线程？



## Redis为什么要设计成单线程？6.0不是变成多线程了吗？



## Redis常见五大数据类型？

**口语化**

redis 的基础数据类型，主要有五种，string ，hash，list，set 和 zset。平时最常用的就是 string，可以缓存内容、做分布式锁等等，其次就是 hash，比如缓存一些对象结构的数据，hash 就比较合理。假设缓存一个个人信息，姓名，年龄，头像这些。传统的 string 需要进行序列化转 json，hash 则可以直接拿到。zset 也用过，主要是做排行榜功能，利用分数的特性进行排序。

>   重点：string 的分布式锁、hash 存储对象、zset 做排行榜



Redis存储的是key-value结构的数据，其中key是字符串类型，value有5种常用的数据类型：

-   字符串(string)：普通字符串，Redis中最简单的数据类型
-   哈希(hash)：也叫散列，类似于Java中的HashMap结构
-   列表(list)：按照插入顺序排序，可以有重复元素，类似于Java中的LinkedList
-   集合(set)：无序集合，没有重复元素，类似于Java中的HashSet
-   有序集合(sorted set/zset)：集合中每个元素关联一个分数(score)，根据分数升序排序，没有重复元素

<img src="assets/image-20221130190150749.png" alt="image-20221130190150749" style="zoom:60%;" />

**字符串(string)**

字符串是 Redis 中最简单和最常用的数据类型。

可以用来存储如字符串、整数、浮点数、图片（图片的base64编码或图片的路径）、序列化后的对象等

每个键（key）对应一个值（value），一个键最大能存储512MB的数据

Redis 中字符串类型常用命令：

-   **SET** key value 					         设置指定key的值
-   **GET** key                                        获取指定key的值
-   **SETEX** key seconds value         设置指定key的值，并将 key 的过期时间设为 seconds 秒
-   **SETNX** key value                        只有在 key    不存在时设置 key 的值

更多命令可以参考Redis中文网：https://www.redis.net.cn

**哈希(hash)**

Redis hash 是一个string类型的 field 和 value 的映射表，类似于Java中的Map<String, Object>。

Hash特别适合用于存储对象，如用户信息、商品详情等

每个Hash可以存储 2^32 - 1个键值对

<img src="assets/image-20221130193121969.png" alt="image-20221130193121969" style="zoom: 67%;" />

常用命令：

-   **HSET** key field value             将哈希表 key 中的字段 field 的值设为 value
-   **HGET** key field                       获取存储在哈希表中指定字段的值
-   **HDEL** key field                       删除存储在哈希表中的指定字段
-   **HKEYS** key                              获取哈希表中所有字段
-   **HVALS** key                              获取哈希表中所有值

示例：

```shell
HSET user:1000 name "John"
HGET user:1000 name
```

**列表(list)**

Redis 列表是一个有序的字符串列表，可以从两端压入或弹出元素，支持在列表的头部或尾部添加元素。

列表最多可存储2^32 - 1个元素

常用命令：

-   **LPUSH** key value1 [value2]         将一个或多个值插入到列表头部
-   **LRANGE** key start stop                获取列表指定范围内的元素
-   **RPOP** key                                       移除并获取列表最后一个元素
-   **LLEN** key                                        获取列表长度
-   **BRPOP** key1 [key2 ] timeout       移出并获取列表的最后一个元素， 如果列表没有元素会阻塞列表直到等待超    时或发现可弹出元素为止

<img src="assets/image-20221130193332666.png" alt="image-20221130193332666" style="zoom: 67%;" />

示例：

```shell
LPUSH mylist "world"
LPUSH mylist "hello"
LRANGE mylist 0 -1
```

**集合(set)**

Redis set 是string类型的无序集合。集合成员是唯一的，这就意味着集合中不能出现重复的数据

集合适用于去重和集合运算（如交集、并集、差集）

set的添加、删除、查找操作的复杂度都是O(1)。

常用命令：

-   **SADD** key member1 [member2]            向集合添加一个或多个成员
-   **SMEMBERS** key                                         返回集合中的所有成员
-   **SCARD** key                                                  获取集合的成员数
-   **SINTER** key1 [key2]                                   返回给定所有集合的交集
-   **SUNION** key1 [key2]                                 返回所有给定集合的并集
-   **SREM** key member1 [member2]            移除集合中一个或多个成员

<img src="assets/image-20221130193532735.png" alt="image-20221130193532735" style="zoom: 67%;" />

示例：

```shell
SADD myset "hello"
SADD myset "world"
SMEMBERS myset
```

**有序集合(sorted set/zset)**

zset和Set一样也是string类型元素的集合，且不允许重复的成员。有序集合类似于集合，但每个元素都会关联一个double类型的分数（score），redis正是通过分数来为集合中的成员进行从小到大的排序

常用命令：

-   **ZADD** key score1 member1 [score2 member2]     向有序集合添加一个或多个成员
-   **ZRANGE** key start stop [WITHSCORES]                     通过索引区间返回有序集合中指定区间内的成员
-   **ZINCRBY** key increment member                              有序集合中对指定成员的分数加上增量 increment
-   **ZREM** key member [member ...]                                移除有序集合中的一个或多个成员

<img src="assets/image-20221130193951036.png" alt="image-20221130193951036" style="zoom: 67%;" /> 

**通用命令**

Redis的通用命令是不分数据类型的，都可以使用的命令：

-   KEYS pattern 		查找所有符合给定模式( pattern)的 key 
-   EXISTS key 		检查给定 key 是否存在
-   TYPE key 		返回 key 所储存的值的类型
-   DEL key 		该命令用于在 key 存在是删除 key





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

**口语化回答**

​	这个问题主要是涉及到哈希槽（slot）的概念。Redis集群会将键划分成16384（2^14-1）个槽。每个槽分配一个或多个节点。比如一个集群，三个节点，每个节点负责一定范围的槽。当 key 来了的时候，首先做 hash 算法获得数值后，与 16384 进行取模。得到的值就是槽的位置，然后再根据槽的编号，就可以找到对应的节点。

**要点**

slot 机制，取模 hash 槽，16384，节点范围（0~16383）机制

**哈希槽机制**

Redis集群将整个键空间划分为16384个哈希槽。每个键根据其哈希值被映射到其中一个哈希槽上，每个哈希槽被分配给一个节点或多个节点（主从复制的场景）。计算过程如下：

1.  **计算哈希值**：Redis使用MurmurHash算法**对键进行哈希计算**，得到一个整数哈希值。
2.  **映射到哈希槽**：将哈希值对16384取模（即`hash(key) % 16384）`，得到对应的哈希槽编号。
3.  **定位节点**：根据哈希槽编号找到负责该哈希槽的节点。

![1724051471829](assets/哈希槽定位.png)

看了上面的图，你对 slot 有了解了，那么你会产生疑问，slot 又是如何和 redis 节点进行关联的呢？

**哈希槽分配**

集群的配置时，哈希槽会被分配给不同的节点。每个节点负责一定范围的哈希槽。例如，节点A可能负责哈希槽0-5000，节点B负责哈希槽5001-10000，节点C负责哈希槽10001-16383。这样就实现了集群、节点、slot 三者联动。

如下是使用Docker部署Redis三主三从集群的案例，让你更加理解哈希槽的分配情况：

[docker中部署三主三从redis集群](./docs/docker中部署三主三从redis集群.md)

**客户端需要查找某个键的实现**

当客户端需要查找某个键时，流程如下：

1.  **计算哈希槽**：客户端根据键计算出对应的哈希槽编号。
2.  **查找节点**：客户端查询集群的哈希槽分配表，找到负责该哈希槽的节点。
3.  **发送请求**：客户端将请求发送到对应的节点，获取或存储数据。

一般这种都需要我们操心，很多都帮我们封装好了，如下：

```java
import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.JedisCluster;
import java.util.HashSet;
import java.util.Set;

public class RedisClusterExample {
    public static void main(String[] args) {
        // 定义集群节点
        Set<HostAndPort> nodes = new HashSet<>();
        nodes.add(newHostAndPort("127.0.0.1", 7000));
        nodes.add(newHostAndPort("127.0.0.1", 7001));
        nodes.add(newHostAndPort("127.0.0.1", 7002));

        // 创建JedisCluster对象
        JedisCluster jedisCluster=new JedisCluster(nodes);

        // 存储键值对
        jedisCluster.set("mykey", "myvalue");

        // 获取键值对
        String value= jedisCluster.get("mykey");
        System.out.println("Value for 'mykey': " + value);

        // 关闭JedisCluster连接
        jedisCluster.close();
    }
}
```



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