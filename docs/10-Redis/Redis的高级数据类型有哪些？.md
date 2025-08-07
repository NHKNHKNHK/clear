# Redis的高级数据类型有哪些？

## **口语化**

面对一些复杂的场景，redis提供了一些高级数据类型，来进行了功能的扩展。

主要有四种，bitmaps，hyperloglog，geo，stream。

stream 不是非常常用，主要是用来实现消息队列功能。

常用的就是 bitmap，bitmap 的 0、1 特性，非常适用于签到，或者存在、不存在这种类型判断，以及在大量数据下，快速统计是否结果。bitmap 非常节省空间，相比于传统的存储数据后，在 mysql 等层面统计，bitmap 更加适用。

其次就是hyperloglog 主要是用于一些数量的统计，不过要允许误差，他不会存具体的内容，会帮助我们进行数据的统计，像常见的网站访问统计，就非常适合这个数据结构。

geo 主要是做地理位置的计算，通过经度和纬度来定位位置，经过运算可以得到距离，附近范围的坐标等等。像比如美团外卖的附近商家，地图的距离测算，都可以通过 geo 的结构来进行实现

>   重点 bitmap，其次是hyperloglog，geo

关键点：

-   bitmap，二进制位统计，签到功能
-   hyperloglog，大数据量统计
-   geo，地理位置，经纬度，附近的人



## **BitMap**

-   Redis 提供了 Bitmaps 这个 “数据类型” 可以实现对**位**的操作
-   **Bitmaps 本身不是一种数据类型**， 实际上它就是字符串（key-value） ， 但是它可以==对字符串的位进行操作==。
-   Bitmaps 单独提供了一套命令， 所以在 Redis 中使用 Bitmaps 和使用字符串的方法不太相同。
    -   可以把 Bitmaps 想象成一个以位为单位的数组， 数组的每个单元只能存储 0 和 1， 数组的下标在 Bitmaps 中叫做偏移量（从左到右），如下图所示。

![1702114603490](assets/bitmaps-1.png)

>   **Redis中是利用string类型数据结构实现BitMap**，因此最大上限是512M，转换为bit则是 2^32个bit位。

BitMap的操作命令有：

-   SETBIT：向指定位置（offset）存入一个0或1
-   GETBIT ：获取指定位置（offset）的bit值
-   BITCOUNT ：统计BitMap中值为1的bit位的数量
-   BITFIELD ：操作（查询、修改、自增）BitMap中bit数组中的指定位置（offset）的值
    -   它的修改比较繁琐，因此直接用SETBIT修改即可
    -   查询，可以批量查询。GETBIT只能单个查询
-   BITFIELD_RO ：获取BitMap中bit数组，并以十进制形式返回
-   BITOP ：将多个BitMap的结果做位运算（与 、或、异或）
-   BITPOS ：查找bit数组中指定范围内第一个0或1出现的位置

```sh
# 1.模拟用户一周7天的签到情况，其中星期4未签到
127.0.0.1:6379> SETBIT bm1 0 1		# 0 表示bitmap中第一位，相当于星期一； 1表示签到
(integer) 0
127.0.0.1:6379> SETBIT bm1 1 1		# 1 表示bitmap中第二位，相当于星期二； 1表示签到
(integer) 0
127.0.0.1:6379> SETBIT bm1 2 1
(integer) 0
127.0.0.1:6379> SETBIT bm1 5 1
(integer) 0
127.0.0.1:6379> SETBIT bm1 6 1
(integer) 0

# 2.查询用户星期三、星期四是否签到
127.0.0.1:6379> GETBIT bm1 2
(integer) 1
127.0.0.1:6379> GETBIT bm1 3
(integer) 0			# 表示未签到

# 3.统计用户一周内的签到天数（即：统计BitMap中值为1的bit位的数量）
127.0.0.1:6379> BITCOUNT bm1 
(integer) 5

# 4.查询用户星期一到星期三三天的签到情况
127.0.0.1:6379> BITFIELD bm1 get u3 0		# u3表示无符号，显示3位； 0表示offset偏移量
1) (integer) 7	# 7（十进制）==> 111（二进制）

# 5.查询用户一周内第一次未签到是在哪一天
127.0.0.1:6379> BITPOS bm1 0
(integer) 3		# 3表示bitmap中第四位，即星期四
# 5.查询用户一周内第一次签到是在哪一天
127.0.0.1:6379> BITPOS bm1 1
(integer) 0		# 0表示bitmap中第一位，即星期一
```



## **HyperLogLog**

首先我们搞懂两个概念：

-   UV：全称**U**nique **V**isitor，也叫**独立访客量**，是指通过互联网访问、浏览这个网页的自然人（独立 IP 数、搜索记录数等）。1天内同一个用户多次访问该网站，只记录1次。
-   PV：全称**P**age **V**iew，也叫页面访问量或点击量，用户每访问网站的一个页面，记录1次PV，用户多次打开页面，则记录多次PV。往往用来衡量网站的流量。
    -   PV可以使用 Redis 的 incr、incrby 轻松实现

通常来说UV会比PV大很多，所以衡量同一个网站的访问量，我们需要综合考虑很多因素，所以我们只是单纯的把这两个值作为一个参考值。

UV统计在服务端做会比较麻烦，因为要判断该用户是否已经统计过了，需要将统计过的用户信息保存。但是如果每个访问的用户都保存到Redis中，数据量会非常恐怖，那怎么处理呢？

这里提一下解决UV统计的思路：

-   （1）数据存储在 MySQL 表中，使用 distinct count 计算不重复个数。
-   （2）使用 Redis 提供的 hash、set、bitmaps 等数据结构来处理。

以上的方案结果精确，但随着数据不断增加，导致占用空间越来越大，对于非常大的数据集是不切实际的。能否能够降低一定的精度来平衡存储空间？Redis 推出了 **HyperLogLog**。



Hyperloglog(HLL)是从Loglog算法派生的概率算法，用于确定非常大的集合的基数，而不需要存储其所有值。相关算法原理大家可以参考：[https://juejin.cn/post/6844903785744056333#heading-0](https://gitee.com/link?target=https%3A%2F%2Fjuejin.cn%2Fpost%2F6844903785744056333%23heading-0) 

Redis中的**HLL是基于string**结构实现的，**每个 HyperLogLog 键只需要花费 12 KB 内存，就可以计算接近 2^64 个不同元素的基数！**作为代价，其测量结果是概率性的，**有小于0.81％的误差**。不过对于UV统计来说，这完全可以忽略。

>   什么是基数？
>
>   ​	比如数据集 {1, 3, 5, 7, 5, 7, 8}，那么这个数据集的基数集为 {1, 3, 5 ,7, 8}，基数 (不重复元素) 为 5。 基数估计就是在误差可接受的范围内，快速计算基数。

**常用命令**

-   PFADD

```sh
# 添加指定元素到HyperLogLog中
PFADD key element [element ...]
```

-   PFCOUNT

```shell
# 计算HLL的近似基础，可以计算多个HLL。比如用HLL存储每天的UV，计算一周的UV可以使用7天的UV合并进行计算
PFCOUNT key [key ...]
```

-   PFMERGE

```shell
# 将一个或多个 HLL 合并后的结果存储到另一个 HLL中，比如每月活跃用户可以使用没有的活跃用户合并计算得到
PFMERGE destkey sourcekey [sourcekey ...]
```

**应用场景**

凡是大量的数据下，统计不同数据的数量的情况都可以使用，非常的方便，同时要接受误差的场景。比如

- **网站访问统计**：估算鸡翅 club 网站每天有多少独立访客。

-   **日志分析**：估算日志文件中有多少不同的错误类型。

演示

```shell
# 插入
127.0.0.1:6379> PFADD hl1 e1 e2 e3 e4 e5
(integer) 1
# 查看
127.0.0.1:6379> PFCOUNT hl1
(integer) 5
# 再次插入重复
127.0.0.1:6379> PFADD hl1 e1 e2 e3 e4 e5
(integer) 0
# 再次查看
127.0.0.1:6379> PFCOUNT hl1
(integer) 5		# 结构还是5，说明hyperloglog这种数据结构天生就适合统计UV
```

## GEO

>   GEO的底层其实是ZSET

GEO就是Geolocation的简写形式，代表地理坐标。Redis在3.2版本中加入了对GEO的支持，允许存储地理坐标信息，帮助我们根据经纬度来检索数据。

该类型，就是元素的 2 维坐标，在地图上就是经纬度。

redis 基于该类型，提供了经纬度设置，查询，范围查询，距离查询，经纬度 Hash 等常见操作

常见的命令有：

-   GEOADD：添加一个地理空间信息，包含：经度（longitude）、纬度（latitude）、值（member）
-   GEODIST：计算指定的两个点之间的距离并返回
-   GEOHASH：将指定member的坐标转为hash字符串形式并返回
-   GEOPOS：返回指定member的坐标
-   GEORADIUS：指定圆心、半径，找到该圆内包含的所有member，并按照与圆心之间的距离排序后返回。**6.以后已废弃**
-   GEOSEARCH：在指定范围内搜索member，并按照与指定点之间的距离排序后返回。范围可以是圆形或矩形。**6.2.新功能**
-   GEOSEARCHSTORE：与GEOSEARCH功能一致，不过可以把结果存储到一个指定的key。 **6.2.新功能**

**应用场景**

-   附近的人：比如类似微信的附近的人，以自己为中心，找其他的人，这种场景，就可以使用GEORADIUS 。

-   基于地理位置推荐：比如推荐某个位置附近的餐厅，都可以实现

-   计算距离：大家会遇到这种场景，比如当你购物的时候，美团外卖会告诉你商家距您多远，也可以通过 geo 来进行实现。

示例：

```shell
# 有如下数据
-	北京南站（116.378248 39.865275）
-	北京站（116.42803 39.903738）
-	北京西站（116.322287 39.893729）
127.0.0.1:6379> GEOADD g1 116.378248 39.865275 bjnz 116.42803 39.903738 bjz 116.322287 39.893729 bjxz
(integer) 3

# 1.计算北京西站到北京站的距离
127.0.0.1:6379> GEODIST g1 bjxz bjz m
"9091.5648"
127.0.0.1:6379> GEODIST g1 bjxz bjz km
"9.0916"

# 2.搜索北京天安门（116.397904 39.909005）福建10km的所有火车站，并按照升序排序
127.0.0.1:6379> GEORADIUS g1 116.397904 39.909005 10 km
1) "bjz"
2) "bjnz"
3) "bjxz"
127.0.0.1:6379> GEORADIUS g1 116.397904 39.909005 10 km WITHDIST
1) 1) "bjz"
   2) "2.6361"
2) 1) "bjnz"
   2) "5.1452"
3) 1) "bjxz"
   2) "6.6723"
127.0.0.1:6379> GEOSEARCH g1 FROMLONLAT 116.397904 39.909005 BYRADIUS 10 km
1) "bjz"
2) "bjnz"
3) "bjxz"
127.0.0.1:6379> GEOSEARCH g1 FROMLONLAT 116.397904 39.909005 BYRADIUS 10 km WITHDIST
1) 1) "bjz"
   2) "2.6361"
2) 1) "bjnz"
   2) "5.1452"
3) 1) "bjxz"
   2) "6.6723"
```



## **Stream（非重点）**

stream 是 redis5.0 版本后面加入的。比较新，以至于很多老八股题目，都没有提到这个类型。还有就是本身应用度的场景真的不多，类似 mq，但是如果 mq 的场景，大家一般会选择正宗的 rokcetmq 或者 rabbit 或者 kafka，所以这种类型，大家稍微知道即可。

Redis中的流结构用来处理**连续不断到达的数据**。你可以把它想象成一条流水线，数据像流水一样源源不断地流过来，我们可以在流水线的不同位置对这些数据进行处理。

主要目的是做消息队列，在此之前 redis 曾经使用发布订阅模式来做，但是发布订阅有一个缺点就是消息无法持久化。非常脆弱，redis 宕机，断开这些，都会产生造成丢失。stream 提供了持久化和主备同步机制

**核心概念**

-   **消息（Message）**：流中的每一条数据。每条消息都有一个唯一的ID和一组字段和值。

-   **流（Stream）**：存储消息的地方。可以把它看作一个消息队列。

-   **消费者组（Consumer Group）**：一个或多个消费者组成的组，用来处理流中的消息。

-   **消费者（Consumer）**：处理消息的终端，可以是应用程序或服务。

**应用场景**

如果需要轻量级，很轻很轻，没有 mq 的情况下，可以使用 redis 来做，适合处理需要**实时处理**和**快速响应**的数据。比如做成用户消息实时发送和接收、服务器日志实时记录和分析、传感器数据实时收集和处理。

不过需要注意的是，正常来说 mq，mqtt 等等在各自场景有比较好的应用。

**常用命令**

-   **添加消息到流**

```shell
XADD stream-name * field1 value1 [field2 value2 ...]

XADD mystream * user jichi message "Hello, world!"
#他会向流mystream添加一条消息，消息内容是user: jichi, message: "Hello, world!"。
```

-   **读取消息**

```shell
XREAD COUNT count STREAMS stream-name ID

XREAD COUNT 2 STREAMS mystream 0
# 会从流mystream中读取前两条消息，也就是读取到jichi 的hello world
```

-   **创建消费者组**

```shell
XGROUP CREATE stream-name group-name ID

XGROUP CREATE mystream mygroup 0
#会为流mystream创建一个名为mygroup的消费者组。
```

-   **消费者组读取消息**

```shell
XREADGROUP GROUP group-name consumer-name COUNT count STREAMS stream-name ID

XREADGROUP GROUP mygroup consumer1 COUNT 2 STREAMS mystream >
#会让消费者组mygroup中的消费者consumer1读取流mystream中的前两条消息。
```

-   **确认消息处理完成**

消费者处理完成，应该进行 ack。

```shell
XACK stream-name group-name ID

XACK mystream mygroup 1526569495631-0
#确认消费者组mygroup已经处理完了ID为1526569495631-0的消息。
```


