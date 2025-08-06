# Java中Map有那些常见实现类？

## 口语化

Map接口的常见实现类：HashMap(主要实现类)、LinkedHashMap、TreeMap、Hashtable、Properties

```txt
java.util.Map
	HashMap：（主要实现类）线程不安全，效率高；可以添加null的key和value
				底层：数组+单向链表+红黑树存储结构（JDK8）
		LinkedHashMap：是HashMap的子类；在HashMap的数据结构基础上，增加了一对双向链表，用于记录添加的元素的先后顺序，进而在我们遍历时，就可以按照添加的顺序显示
        开发中，需要频繁遍历建议使用此类
        
	Hashtable：古老实现类；线程安全，效率低；不可以添加null的key和value
				底层：数组+单向链表存储结构（JDK8）
		Properties：是Hashtable的子类，其key-value都是String类型，常用于读取属性文件
		
	TreeMap：底层使用红黑树存储；可以按照添加的key-value中的key元素指定的属性的大小进行遍历。
			需要考虑使用 	自然排序、定制排序
```

-   **Map接口 与 Collection接口 并列存在**。用于保存具有*映射关系*的数据：key-value 
-   **Collection** 集合称为**单列集合**，元素是孤立存在的（理解为单身）。 
-   **Map** 集合称为**双列集合**，元素是成对存在的(理解为夫妻)。 
-   Map 中的 key 和 value 都可以是任何引用类型的数据。但常用 String 类作为 Map的“键”。 

:::danger 注意

- HashMap：可以添加null的key和value（key最多一个为null、value可以有多个为null）
- Hashtable：不可以添加null的key和value
:::

```java
public class MapTest {
    @Test
    // HashMap的 key-value 可以存储 null
    public void test1(){
        Map map = new HashMap();
        map.put(null,null);
        System.out.println(map);
    }

    @Test
    // Hashtable的 key-value 都不可以存储 null
    public void test2(){
        Map map = new Hashtable();
        map.put(null,123);  // 报错 NullPointerException
        System.out.println(map);
    }
}
```

## Map 中 key-value 特点 

-   这里主要以 HashMap 为例说明。HashMap 中存储的 key、value 的特点如下：
-   Map 中的 **key用Set来存放，不允许重复**（所有的key构成一个Set集合），即同一个 Map 对象所对应的类，**须重写 hashCode()和 equals()**方法 
    -   **key所在的类要重写 hashCode()和 equals()方法** 
-   key 和 value 之间存在单向一对一关系，即通过指定的 key 总能找到唯一的、确定的 value，不同 key 对应的 **value 可以重复**。
    -   所有的value构成一个Collection集合，**value 所在的类要重写 equals()方法。** 
-   **key 和 value 构成一个 entry**。所有的 **entry** 彼此之间是**无序的、不可重复的**。 

## HashMap

HashMap 是 Map 接口使用频率最高的实现类。

-   HashMap 是**线程不安全**的。如果多个线程同时访问一个HashMap并且至少有一个线程修改了它，则必须手动同步。
-   **允许添加 一个null 键和 多个null 值**。 
-   存储数据采用的**哈希表结构**，底层使用**一维数组+单向链表+红黑树**（JDK8）进行 key-value数据的存储。
    -   与 HashSet 一样不保证映射的顺序，元素的存取顺序不能保证一致。 
-   HashMap **判断两个 key 相等的标准**是：**两个 key 的 hashCode 值相等，通过 equals() 方法返回 true**。 
-   HashMap **判断两个 value 相等的标准**是：**两个 value 通过 equals() 方法返回true**。 
-   HashMap提供了 O(1) 时间复杂度的基本操作（如 get 和 put），前提是哈希函数的分布良好且冲突较少

HashMap的**特点**包括：

-   键值对的存储是无序的。
-   允许添加 一个null 键和 多个null 值
-   不支持同一个键对应多个值的情况

### **内部工作原理** 

HashMap使用哈希表来存储数据。哈希表是基于（数组+链表）的组合结构。

-   1、**哈希函数**：HashMap使用键的hashCode()方法来计算哈希值，然后将哈希值映射到数组的索引位置。
-   2、**数组和链表**：HashMap使用一个数组来存储链表或树结构（Java 8 及以后）。每个数组位置被称为一个“桶”，每个桶存储链表或树。

-   3、**冲突处理**：当两个键的哈希值相同时，它们会被存储在同一个桶中，形成一个链表（或树）。这种情况称为哈希冲突。

-   4、**再哈希**：当HashMap中的元素数量超过容量的负载因子（默认 0.75）时，HashMap会进行再哈希，将所有元素重新分配到一个更大的数组中。


### **性能注意事项** 

-    **初始容量和负载因子**：可以通过构造函数设置HashMap的初始容量和负载因子，以优化性能。

    -    初始容量越大，减少再哈希的次数；

    -    负载因子越小，减少冲突的概率，但会增加空间开销。

        -   对于源码中的负载因子 0.75，是大佬们设置的，如果你不能确保你设置的更优，请不要随意改变

-    **哈希函数的质量**：哈希函数的质量直接影响HashMap的性能。理想的哈希函数应尽可能均匀地分布键。

 

### **线程安全性** 

HashMap不是线程安全的。如果需要线程安全的映射，可以使用`Collections.synchronizedMap`来包装HashMap

```java
Map<String, Integer> synchronizedMap = Collections.synchronizedMap(newHashMap<>());
```

或者使用ConcurrentHashMap,后者在高并发环境下性能更好。

```java
Map<String, Integer> concurrentMap = newConcurrentHashMap<>();
```



## LinkedHashMap

LinkedHashMap 是 HashMap 的子类

-   存储数据采用的**哈希表结构+链表**结构，在 HashMap 存储结构的基础上，使用了一对 **双向链表**来**记录添加元素的先后顺序**，可以保证遍历元素时，与添加的顺序一致。 

-   通过哈希表结构可以保证键的唯一、不重复，需要键所在类重写 hashCode()方法、 equals()方法。

LinkedHashMap 的**特点**包括

-   具有**哈希表和链表**的双重特性：LinkedHashMap通过哈希表实现快速的键值对查找，同时通过双向链表维护顺序
-   **有序性**：可以保证元素的插入顺序和访问顺序
-   **允许null键和值**：与HashMap一致，LinkedHashMap允许一个null键和多个null值。
-   **线程不安全**：与HashMap一致，LinkedHashMap也是线程不安全的，如果需要在多线程环境中使用，需要通过外部同步机制来保证线程安全。

### **与其他集合类的比较**

-   **LinkedHashMap 与 HashMap**：

-   -   LinkedHashMap基于双写链表保证键值对的顺序（插入顺序或访问顺序），而HashMap不保证顺序。
    -   LinkedHashMap通过维护链表来记录顺序，因此在插入和删除操作上可能略慢于HashMap。

-   **LinkedHashMap 与 TreeMap**：

-   -   LinkedHashMap保证插入顺序或访问顺序，而TreeMap保证键的自然顺序或比较器的顺序。
    -   LinkedHashMap基于哈希表实现，操作的平均时间复杂度为 O(1)，而TreeMap基于红黑树实现，操作的时间复杂度为 O(log n)。

### **适用场景**

LinkedHashMap适用于需要保持键值对的插入顺序或访问顺序的场景，例如：

-   实现 LRU（最近最少使用）缓存。
-   需要按插入顺序遍历键值对。
-   需要在保持顺序的同时快速查找键值对



## TreeMap

-   TreeMap 存储 key-value 对时，需要根据 key-value 对进行排序。TreeMap 可以保证所有的 key-value 对处于**有序状态**。 
-   TreeMap 底层使用**红黑树**结构存储数据 
-   TreeMap 的 Key 的排序： 
    -   **自然排序**：TreeMap 的所有的 Key 必须实现 Comparable 接口，而且所有的 Key 应该是同一个类的对象，否则将会抛出 ClasssCastException 
    -   **定制排序**：创建 TreeMap 时，构造器传入一个 Comparator 对象，该对象负责对 TreeMap 中的所有 key 进行排序。此时不需要 Map 的 Key 实现 Comparable 接口 
-   TreeMap **判断两个key 相等**的标准：**两个 key 通过 compareTo()方法或者 compare()方法返回 0**。 
-   与TreeSet一致，添加进入 TreeMap 的元素必须是同样的类型，否则报错 `ClassCastException`

TreeMap 的**特点**包括：

-   **有序性**：TreeMap保证了键的有序性
    -   有序性是通过自然顺序（通过Comparable接口）或比较器（Comparator）的通过提供的。
    -   因此插入TreeMap中的key必须实现排序
-   **红黑树**：TreeMap内部使用红黑树数据结构来存储键值对，保证了插入、删除、查找等操作的时间复杂度为 O(log n)
-   **不允许null键**：TreeMap不允许键为null，但允许值为null
-   **线程不安全**：TreeMap不是线程安全的，如果需要在多线程环境中使用，需要通过外部同步机制来保证线程安全

### **与其他集合类的比较**

-   **TreeMap 与 HashMap**：

-   -   TreeMap保证键的有序性，而HashMap不保证顺序。
    -   TreeMap基于红黑树实现，操作的时间复杂度为 O(log n)，而HashMap基于哈希表实现，操作的平均时间复杂度为 O(1)。
    -   TreeMap不允许null键，而HashMap允许一个null键。

-   **TreeMap 与  LinkedHashMap**：

-   -   TreeMap保证键的自然顺序或比较器的顺序，而LinkedHashMap保证插入顺序或访问顺序。
    -   TreeMap的操作时间复杂度为 O(log n)，而LinkedHashMap的操作时间复杂度为 O(1)。

### **适用场景**

TreeMap适用于需要按键排序存储键值对的场景，例如：

-   实现基于范围的查询。
-   需要按顺序遍历键值对。
-   需要快速查找最小或最大键值对。



## Hashtable

-   Hashtable继承自 Dictionary 类，是 Map 接口的**古老实现类**，JDK1.0 就提供了。
-   不同于 HashMap，Hashtable 是**线程安全**的。 并发性不如 ConcurrentHashMap，因为 ConcurrentHashMap 引入了分段锁。
-   Hashtable 实现原理和 HashMap 相同，功能相同。底层都使用哈希表结构（**数组+单向链表**），查询速度快。 
-   与 HashMap 一样，Hashtable 也不能保证其中 Key-Value 对的顺序 
-   Hashtable 判断两个 key 相等、两个 value 相等的标准，与 HashMap 一致。 
-   与 **HashMap 不同，Hashtable 不允许使用 null 作为 key 或 value**。 

**开发建议**：

​	Hashtable 不建议在新代码中使用，不需要线程安全的场合可以用 HashMap 替换，需要线程安全的场合可以用 ConcurrentHashMap 替换。

### **与其他集合类的比较**

-   **Hashtable 与 HashMap**：

-   -   Hashtable是线程安全的，而HashMap不是。
    -   Hashtable不允许键或值为null，而HashMap允许一个null键和多个null值。
    -   在现代 Java 编程中，HashMap更常用，因为它在大多数情况下性能更好，并且可以通过外部同步来实现线程安全。

-   **Hashtable 与 ConcurrentHashMap**：

-   -   ConcurrentHashMap是 Java 5 引入的一种改进的哈希表实现，专为高并发环境设计。
    -   ConcurrentHashMap提供了**更细粒度的锁机**制，允许更高的并发性和更好的性能。


## Properties

-   Properties是 Java 中的一个类（Hashtable 的子类），用于处理属性文件（.properties文件）。属性文件是一种简单的文本文件，用于存储键值对形式的配置信息
-   **由于属性文件里的 key、value 都是字符串类型**，所以 **Properties 中要求 key 和 value 都是字符串类型** 
-   存取数据时，建议使用 setProperty(String key,String value) 方法和 getProperty(String key) 方法 

Properties类的**特点**如下：

-   继承关系：**Properties类是Hashtable类的子类**，因此它具有Hashtable类的所有方法。
-   键值对存储：Properties类用于存储键值对形式的配置信息，其中**键和值都是字符串类型**。
-   加载和保存属性文件：Properties类提供了 load() 和 store() 方法，用于从属性文件中加载配置信息和将配置信息保存到属性文件中。
-   默认值：**Properties类可以设置默认值**，当获取某个键对应的值时，如果该键不存在，则返回默认值。
