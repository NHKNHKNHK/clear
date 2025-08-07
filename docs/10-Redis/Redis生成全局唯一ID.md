# Redis生成全局唯一ID

全局唯一ID生成策略：

UUID：可以使用JDK自带工具类生成，显示是以16进制字符串形式，无单调递增特性，不够友好

-   优点
    -   全球唯一性：UUID由128位二进制数字组成，可以生成全球唯一的ID，避免了重复的可能性。
    -   无需中心化管理：UUID的生成不依赖于中心化的ID生成器，每个节点可以独立生成，方便分布式系统的使用。
    -   无需数据库查询：生成UUID的过程不需要查询数据库或访问网络，可以在本地生成，提高了生成ID的效率。
    -   安全性：UUID采用随机算法生成，具有很高的安全性，不易被猜测或破解。
-   缺点
    -   长度较长：UUID的长度为128位，以字符串形式表示时会比较长，占用更多的存储空间。
    -   可读性差：由于UUID是以二进制形式表示的，其字符串形式的可读性较差，不易于人类理解和识别。
    -   无序性：UUID是采用随机算法生成的，生成的ID是无序的，不适合作为有序序列号使用。
    -   不支持自增特性：与自增ID相比，UUID无法实现自增特性，不适用于需要连续递增的场景。

## **Redis自增**

-   优点
    -   自增特性：Redis提供了INCR命令，可以实现自增功能，方便生成全局唯一ID。
    -   高效性：Redis是基于内存的高性能键值存储系统，INCR命令在内存中执行，速度较快，适用于高并发场景。
-   缺点
    -   单点故障：如果使用单个Redis实例来生成全局唯一ID，当Redis实例发生故障或停机时，会导致无法生成ID，影响系统的正常运行。
    -   不支持分布式：Redis的自增功能是针对单个实例的，无法直接实现分布式环境下的全局唯一ID生成。

## **Snowflake算法（雪花算法）**

-   特点
    -   核心思想：使用41bit作为毫秒数，10bit作为机器的ID（5个bit是数据中心，5个bit的机器ID），12bit作为毫秒内的流水号（意味着每个节点在每毫秒可以产生4096个ID），最后还有一个符号位，永远是0。
-   优点
    -   生成的ID全局唯一且趋势递增，满足多数应用的需求。
    -   支持分布式系统，通过机器ID来区分不同的节点。
-   缺点
    -   需要对算法有一定的理解，并且需要自定义实现。
    -   如果机器ID或数据中心ID分配不当，可能会导致ID生成冲突
    -   对于时钟依赖比较高，如果时间不准确，可以会出现异常

## 数据库自增长序列或字段（专门搞一张表来实现）

-   优点
    -   非常简单：利用现有数据库系统的功能实现，成本小，代码简单，性能可以接受。
    -   ID号单调递增：可以实现一些对ID有特殊要求的业务，比如对分页或者排序结果这类需求有帮助。
-   缺点
    -   强依赖DB：不同数据库语法和实现不同，数据库迁移的时候、多数据库版本支持的时候、或分表分库的时候需要处理，会比较麻烦。
    -   单点故障：在单个数据库或读写分离或一主多从的情况下，只有一个主库可以生成，有单点故障的风险。
    -   数据一致性问题：在分布式系统中，可能存在数据一致性的问题。

```java
@Component
public class RedisIdWorker {
    /**
     * 开始时间戳
     */
    private static final long BEGIN_TIMESTAMP = 1640995200L;
    /**
     * 序列号的位数
     */
    private static final int COUNT_BITS = 32;

    private StringRedisTemplate stringRedisTemplate;

    public RedisIdWorker(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    public long nextId(String keyPrefix) {
        // 1.生成时间戳
        LocalDateTime now = LocalDateTime.now();
        long nowSecond = now.toEpochSecond(ZoneOffset.UTC);
        long timestamp = nowSecond - BEGIN_TIMESTAMP;

        // 2.生成序列号
        // 2.1.获取当前日期，精确到天
        String date = now.format(DateTimeFormatter.ofPattern("yyyy:MM:dd"));
        // 2.2.自增长
        long count = stringRedisTemplate.opsForValue().increment("icr:" + keyPrefix + ":" + date);

        // 3.拼接并返回
        return timestamp << COUNT_BITS | count;
    }
}
```

