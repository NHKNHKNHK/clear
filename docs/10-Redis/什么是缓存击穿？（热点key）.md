# 什么是缓存击穿？（热点key）

## **口语化**

在高并发情况下，某个**热点key突然失效或者未被缓存**，导致大量请求直接穿透到后端数据库，从而使得数据库负载过高，甚至崩溃的问题。

解决这个问题，一般常见的两种方案，一个是**互斥锁**，在多请求情况下，只有一个请求会去构建缓存，其他的进行等待，这种主要是要考虑好死锁的问题和请求阻塞的问题。另一种就是设置一个**逻辑过期时间**，去进行异步的缓存更新，缓存本身永远不会过期，这样也就避免了击穿的问题。

但是复杂性和逻辑时间的设置就比较考验设计。一般情况下互斥锁方案即可



产生原因：在同一时间内，大量并发请求访问一个**热点key**，**恰好key此时过期**，又因为热点key缓存重建时间比较久，此时所有的请求都打到了数据库

## 解决方案

-   互斥锁
    -   思路：给缓存重建的过程加锁，确保重建过程只有一个线程执行，其他线程等待并重试查询
    -   优点：1）实现简单；2）没有额外内存消耗；3）一致性好
    -   缺点：1）等待导致性能下降；2）有死锁风险，因此可以给锁设置有效时间

-   逻辑过期
    -   思路：给热点key缓存永不过期，而是设置逻辑过期。每次请求查缓存，查看是否逻辑过期，未过期直接返回；已过期则获取互斥锁，开启独立线程（异步线程）重建缓存。其他线程无需等待，直接返回逻辑过期的数据
    -   优点：1）线程无需等待，性能较好
    -   缺点：1）不保证一致性，缓存重建期间可能会拿到脏数据；2）有额外内存消耗，因为除了缓存值，还要缓存逻辑过期时间；3）实现复杂；4）需要缓存预热

### **互斥锁**

在缓存失效时，通过加锁机制保证只有一个线程能访问数据库并更新缓存，其他线程等待该线程完成后再读取缓存。

核心重点 ：只有一个线程访问数据库和建立缓存

**实现步骤：**

1.  当缓存失效时，尝试获取一个分布式锁。
2.  获取锁的线程去数据库查询数据并更新缓存。
3.  其他未获取锁的线程等待锁释放后，再次尝试读取缓存。

可以采用try Lock方法 + double check来解决这样的问题

```java
public String getValue(String key) {
    String value = redis.get(key);
    if (value == null) {
        // 尝试获取锁
        boolean lockAcquired = redis.setnx("lock:" + key, "1");
        if (lockAcquired) {
            try {
                // 双重检查锁，防止重复查询数据库
                value = redis.get(key);
                if (value == null) {
                    value = database.query(key);
                    redis.set(key, value, 3600);  // 1小时过期
                }
            } finally {
                // 释放锁
                redis.del("lock:" + key);
            }
        } else {
            // 等待锁释放，再次尝试获取缓存
            while ((value = redis.get(key)) == null) {
                try {
                    Thread.sleep(100);  // 等待100毫秒
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }
    return value;
}
```

**注意：**锁的实现要确保高效和可靠，避免死锁和性能瓶颈。可以设置锁的过期时间，防止因异常情况导致锁无法释放

### **逻辑过期**

给热点key缓存永不过期，而是设置逻辑过期。每次请求查缓存，查看是否逻辑过期，未过期直接返回；已过期则获取互斥锁，开启独立线程（异步线程）重建缓存。其他线程无需等待，直接返回逻辑过期的数据。

这种方案可以彻底防止请求打到数据库，不过就是造成了代码实现过于复杂，因为你需要尽可能的保持二者的一致。

**实现步骤**：

1.  在缓存中存储数据时，附带一个逻辑过期时间。
2.  读取缓存时，检查逻辑过期时间是否到达。
3.  如果逻辑过期时间到达，异步线程去数据库查询新数据并更新缓存，但仍返回旧数据给用户，避免缓存失效时大量请求直接访问数据库。

```java
class CacheEntry {
    private String value;
    private long expireTime;

    public CacheEntry(String value, long expireTime) {
        this.value = value;
        this.expireTime = expireTime;
    }

    public String getValue() {
        return value;
    }

    public boolean isExpired() {
        return System.currentTimeMillis() > expireTime;
    }
}

public String getValue(String key) {
    CacheEntry cacheEntry = redis.get(key);
    if (cacheEntry == null || cacheEntry.isExpired()) {
        // 异步更新缓存
        executorService.submit(() -> {
            String newValue = database.query(key);
            redis.set(key, new CacheEntry(newValue, System.currentTimeMillis() + 3600 * 1000));  // 1小时逻辑过期
        });
    }
    return cacheEntry != null ? cacheEntry.getValue() : null;
}
```


