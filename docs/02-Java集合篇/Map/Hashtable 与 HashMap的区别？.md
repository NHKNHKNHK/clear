# Hashtable 与 HashMap的区别？

**数据结构**

-   HashMap：底层是一个哈希表（jdk7:数组+链表; jdk8:数组+链表+红黑树，是一个线程不安全的集合，执行效率高 
-   Hashtable：底层也是一个哈希表（数组+链表），是一个线程安全的集合，执行效率低 

**键值能否存储null**

-   **HashMap集合，可以存储一个 null 的键、多个 null 的值** 
-   **Hashtable 集合，不能存储 null 的键、null 的值** 

**历史**

-   Hashtable 和 Vector 集合一样,在 jdk1.2 版本之后被更先进的集合(HashMap、ArrayList)取代了。所以 HashMap 是 Map 的主要实现类，Hashtable 是 Map 的古老实现类。 
-   Hashtable 的子类 Properties（配置文件）依然活跃在历史舞台 
-   **Properties 集合是一个唯一和 IO 流相结合的集合** 


## 精简对比


|                    | Hashtable        | HashMap                    |
| ------------------ | ---------------- | -------------------------- |
| 引入时间           | JDK1.0（最古老） | JDK1.2                     |
| 线程安全           | 安全             | 不安全                     |
| key和value支持null | 不支持           | 支持一个null键和多个null值 |


:::warning
在Java中，很多类都是采用大驼峰命名的，但`Hashtable`是一个古老的类（`@since JDK1.0`），千万不要以为是我写错了，而把它记忆为`HashTable`

源码如下：
```java
public class Hashtable<K,V>
    extends Dictionary<K,V>
    implements Map<K,V>, Cloneable, java.io.Serializable
```
:::

