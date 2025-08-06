# LinkedHashMap为什么能用来做LRUCache？

LinkedHashMap能用来做 LRU（Least Recently Used，最近最少使用）缓存的关键原因在于它可以维护访问顺序，并且通过重写removeEldestEntry方法，可以轻松实现缓存的自动清理。

## **关键特性**

-   1、**访问顺序**：LinkedHashMap提供了一个构造方法，可以指定是否按照访问顺序来维护键值对的顺序。当accessOrder参数设置为true时，LinkedHashMap将根据每次访问（get或put操作）来调整顺序，把最近访问的键值对移到链表的末尾。

```java
public LinkedHashMap(int initialCapacity,
                     float loadFactor,
                     boolean accessOrder) {
    super(initialCapacity, loadFactor);
    this.accessOrder = accessOrder;  // true 根据每次访问（get或put操作）来调整顺序，把最近访问的键值对移到链表的末尾。
}
```

-   2、**自动清理**：通过重写removeEldestEntry方法，可以在插入新键值对时自动移除最老的键值对（即链表头部的键值对），从而实现缓存的自动清理。

## **实现 LRU 缓存的步骤**

1.  创建一个LinkedHashMap实例，并将accessOrder参数设置为true。
2.  重写removeEldestEntry方法，以便在缓存大小超过预定义的最大容量时自动移除最老的键值对。


## 示例代码

以下是一个简单的 LRU 缓存实现示例：

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int maxCapacity;

    // 构造函数，初始化最大容量和访问顺序
    public LRUCache(int maxCapacity) {
        super(maxCapacity, 0.75f, true);
        this.maxCapacity = maxCapacity;
    }

    // 重写removeEldestEntry方法，当大小超过最大容量时移除最老的键值对
    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > maxCapacity;
    }

    public static void main(String[] args) {
        // 创建一个容量为3的LRU缓存
        LRUCache<String, Integer> cache = new LRUCache<>(3);

        // 插入键值对
        cache.put("A", 1);
        cache.put("B", 2);
        cache.put("C", 3);

        // 访问键"A"（使其成为最近使用的）
        cache.get("A");

        // 插入新键值对"D"，导致最老的键值对"B"被移除
        cache.put("D", 4);

        // 打印缓存内容
        System.out.println(cache); // 输出: {C=3, A=1, D=4}
    }
}
```


