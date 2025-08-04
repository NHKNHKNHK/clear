# 请你介绍以下常见的List实现类？

首先，List是一个接口，它属于Collection的一部分。`List`接口有几个常用的实现类有：

-   ArrayList
-   LinkedList
-   Vector（古老的遗留类）

### **ArrayList**

ArrayList 是 List 接口的主要实现类。线程不安全，内部是通过**数组**实现的，继承了AbstractList，实现了List。

优点：它允许对元素进行快速随机访问。

缺点：每个元素之间不能有间隔，当数组大小不足时，会触发**扩容**操作（开销较大）

从 ArrayList 的中间位置插入或者删除元素时，需要对数组进行复制、移动、代价比较高。

因此，它适合随机查找和遍历，不适合插入和删除。

本质上，ArrayList 是对象引用的一个**”变长”数组** 

ArrayList扩容公式：`newCapacity = oldCapacity + (oldCapacity >> 1)`，这实际上是将原容量增加50%（即乘以1.5）

```java
private void grow(int minCapacity) {
   	// 。。。
    int newCapacity = oldCapacity + (oldCapacity >> 1);  // 新数组的容量
 	// 。。    
    elementData = Arrays.copyOf(elementData, newCapacity);  // 将旧数组中的数据进行copy
}
```

ArrayList实现了RandomAccess接口，即提供了随机访问功能。RandomAccess是java中用来被List实现，为List提供快速访问功能的。在ArrayList中，我们即可以通过元素的序号快速获取元素对象，这就是快速随机访问。

ArrayList实现java.io.Serializable接口，这意味着ArrayList支持序列化，能通过序列化去传输。

### LinkedList（链表）

LinkedList 是用链表结构存储数据的（基于双向链表实现），它实现了 List 接口和 Deque 接口，存储**有序**的、**可重复**的数据，**线程不安全。**

LinkedList 的特点包括：

-   **链表结构**：LinkedList 内部使用双向链表来存储元素，每个节点包含一个指向前一个节点和后一个节点的引用。这使得在插入和删除元素时具有较好的性能，但在**随机访问元素时性能较差**。
-   **可以在任意位置插入和删除元素**：由于 LinkedList 是基于链表实现的，因此可以在任意位置插入和删除元素，而不需要像数组那样进行元素的移动。（增删性能高）
-   **不支持随机访问**：由于 LinkedList 不是基于数组实现的，因此无法通过索引直接访问元素，而是需要从头节点或尾节点开始遍历链表来查找元素。
-   **支持双向遍历**：LinkedList 实现了**双向链表**，可以从头到尾或从尾到头遍历链表

LinkedList是一个继承于AbstractSequentialList的双向链表。**它也可以被当作堆栈、队列或双端队列进行操作。**

### Vector（数组实现、线程同步）

Vector 是一个古老的集合，JDK1.0 就有了。Vector 是 Java 中的一个动态数组实现的数据结构，它实现了 List 接口，存储**有序**的、**可重复**的数据。**与 ArrayList 类似**，Vector 也是**基于数组**实现的，用法上几乎相同，但它是**线程安全**的，效率低，支持同步访问。

Vector 的特点包括：

-   **动态数组**：Vector 内部使用数组来存储元素，可以根据需要自动调整数组的大小。当元素数量超过当前数组容量时，Vector 会自动增加数组的大小。
-   **线程安全**：Vector 是线程安全的，支持多线程环境下的并发访问。它的方法都使用了 synchronized 关键字来保证线程安全，但这也导致了一定的性能损失。
-   **支持随机访问**：由于 Vector 是基于数组实现的，因此可以通过索引直接访问元素，具有较好的随机访问性能。
-   **可以在任意位置插入和删除元素**：与 ArrayList 类似，Vector 也可以在任意位置插入和删除元素。但由于需要调整数组的大小，插入和删除元素的性能较差。

扩容时，默认扩展一倍容量。

建议：在各种 List 中，最好把 ArrayList 作为默认选择。当插入、删除频繁时，使用LinkedList；Vector 总是比ArrayList 慢，所以尽量避免使用。 
