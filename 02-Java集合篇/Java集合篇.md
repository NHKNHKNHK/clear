## 请你介绍以下常见的List实现类？

首先，List是一个接口，它属于Collection的一部分。`List`接口有几个常用的实现类有：

-   ArrayList
-   LinkedList
-   Vector（古老的遗留类）

### **ArrayList**

ArrayList 是 List 接口的主要实现类。线程不安全，内部是通过**数组**实现的，继承了AbstractList，实现了List。

优点：它允许对元素进行快速随机访问。

缺点：每个元素之间不能有间隔，当数组大小不足时，会触发扩容操作（开销较大）

从 ArrayList 的中间位置插入或者删除元素时，需要对数组进行复制、移动、代价比较高。

因此，它适合随机查找和遍历，不适合插入和删除。

本质上，ArrayList 是对象引用的一个**”变长”数组** 

ArrayList扩容公式：newCapacity = oldCapacity + (oldCapacity >> 1)，这实际上是将原容量增加50%（即乘以1.5）

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



## ArrayList 与 Vector 的区别

-   **数据结构相同**ArrayList 和 Vector它们的底层物理结构都是数组，我们称为**动态数组**。

-   **线程安全不同**
    -   ArrayList 是新版的动态数组，**线程不安全**，效率高
    -   Vector 是旧版的动态数组，**线程安全**，效率低。 
-   **动态数组的扩容机制不同**
    -   ArrayList 默认扩容为原来的 1.5 倍
    -   Vector 默认扩容增加为原来的 2 倍。
-   **数组的初始化容量不同**
    -   如果在构建 ArrayList 与 Vector 的集合对象时，没有显式指定初始化容量，那么 Vector 的内部数组的初始容量默认为 10，而 ArrayList 在 JDK 6.0 及之前的版本也是 10，JDK8.0 之后的版本 ArrayList 初始化为长度为 0 的空数组，之后在添加第一个元素时，再创建长度为 10 的数组。
    -   原因： 用的时候，再创建数组，避免浪费。因为很多方法的返回值是 ArrayList 类型，需要返回一个 ArrayList 的对象，例如：后期从数据库查询对象的方法，返回值很多就是 ArrayList。有可能你要查询的数据不存在，要么返回null，要么返回一个没有元素的 ArrayList 对象。 



## ArrayList初始容量是多少？

ArrayList 有一个默认的初始容量，这个容量是在你创建 ArrayList 实例时如果没有明确指定容量参数时所使用的。

在 Java 的 ArrayList 实现中，默认的初始容量是 10。这意味着当你创建一个新的 ArrayList 而不指定其容量时，它会以一个内部数组长度为 10 的数组来开始。当添加的元素数量超过这个初始容量时，ArrayList 的内部数组会进行扩容，通常是增长为原来的 1.5 倍。

例如：

```java
ArrayList<String> list = new ArrayList<>(); // 默认的初始容量是 10
```

但是，如果你可以预算到将要在 ArrayList 中存储多少元素，那么最好在创建时指定一个初始容量，这样可以减少由于扩容而导致的重新分配数组和复制元素的操作，从而提高性能。

```java
ArrayList<String> list = new ArrayList<>(50); // 初始容量设置为 50
```

自从JDK1.7之后，Arraylist初始化的时候为一个空数组。

```java
private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};

// 这是new一个ArrayList时，不指定初始容量的构造器
public ArrayList() {
    this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}
```

但是当你去放入第一个元素的时候，会触发他的懒加载机制（在懒加载之前是0），使得数量变为10。

```java
private static int calculateCapacity(Object[] elementData, int minCapacity) {
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        return Math.max(DEFAULT_CAPACITY, minCapacity);        
    }        
    return minCapacity;    
}
```

所以我们的Arraylist初始容量的确是10。只不过jdk8变为懒加载来节省内存。进行了一点优化

总结：

​	在JDK7后，对于无参数构造函数创建的 `ArrayList`，初始容量默认为0，但在首次添加元素时会扩展到至少10个元素的容量。对于带有初始容量参数的构造函数，初始容量就是你指定的值。

## ArrayList是如何扩容的？

1.  **初始容量和扩容因子**:

    当创建一个新的ArrayList对象时，它通常会分配一个初始容量，这个初始容量默认为10。

    -   当使用无参数构造函数创建 `ArrayList` 时，其内部使用的数组 `elementData` 会被初始为空数组 `DEFAULTCAPACITY_EMPTY_ELEMENTDATA`。
    -   第一次添加元素时，`ArrayList` 会将其容量扩展至默认容量 `DEFAULT_CAPACITY`，这个值通常是10

    ```java
    /**
     * Default initial capacity.
     */
    private static final int DEFAULT_CAPACITY = 10;
    ```

2.  **扩容规则**:

    -   当 `ArrayList` 的实际元素数量超过其当前容量时，`ArrayList` 会自动进行扩容。

    -   扩容时，新的容量通常是当前容量的1.5倍。

        ```java
        newCapacity = oldCapacity + (oldCapacity >> 1)
        ```

    -   例如，如果当前容量为10，那么扩容后的容量将是15；如果当前容量为15，则扩容后的容量将是22

3.  **扩容过程**:

    -   扩容时，`ArrayList` 会创建一个新的数组，并将原有数组中的元素复制到新数组中。
    -   新数组的大小是原数组大小的1.5倍，向上取整得到一个整数。
    -   原有数组会被释放，从而减少内存占用。

4.  **扩容示例**:

    -   假设 `ArrayList` 的当前容量为10，且已经满了。
    -   当尝试添加第11个元素时，`ArrayList` 会创建一个新的数组，大小为15（10 * 1.5 = 15）。
    -   然后将旧数组中的所有元素复制到新数组中，并将新元素添加到新数组的末尾。
    -   最后，旧数组被垃圾回收机制回收。

5.  **扩容阈值**:

    -   `ArrayList` 在每次添加元素前都会检查是否需要扩容。这个检查是通过比较元素的数量（`size`）与当前容量（`elementData.length`）来完成的。
    -   如果 `size` 大于等于 `elementData.length`，则触发扩容操作。

6.  **扩容方法、源码**:

    -   扩容的具体逻辑通常封装在 `ensureCapacityInternal` 或者 `grow` 方法中。

    ```java
    private void grow(int minCapacity) {
        // overflow-conscious code
        int oldCapacity = elementData.length;
        int newCapacity = oldCapacity + (oldCapacity >> 1);	// 位运算指定新数组的容量
        if (newCapacity - minCapacity < 0)
            newCapacity = minCapacity;
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            newCapacity = hugeCapacity(minCapacity);
        // minCapacity is usually close to size, so this is a win:
        elementData = Arrays.copyOf(elementData, newCapacity);
    }
    ```

7.  **注意事项**:

    -   `ArrayList` 没有缩容机制。即使删除了大量元素，`ArrayList` 的容量也不会减小，除非显式调用 `trimToSize` 方法。
    -   `trimToSize` 方法会将 `ArrayList` 的容量调整为其实际大小，从而避免不必要的内存浪费。

## ArrayList第二次扩容时容量大小？

ArrayList扩容规则：

```java
newCapacity = oldCapacity + (oldCapacity >> 1)
```

先说结论：

​	**在JDK8中，ArrayList第二次扩容时容量为22**

代码如下：

```java
public class ArrayListDemo {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();

        for (int i = 1; i < 17; i++) {
            list.add(i);
        }

        list.forEach(e -> System.out.print(e + " "));
    }
}
```

ArrayList第一次添加元素时，首次进入add方法，可以发现，此时为动态数组容量为0

![1724058604176](assets/ArrayList第一次添加元素之前.png)

ArrayList第一次添加元素时，进入了ensureCapacityInternal方法，会将动态数组容量初始化为10

![1724058423849](assets/ArrayList第一次添加元素时.png)

ArrayList第一次扩容时

![1724058089057](D:\video\workspace\easy-interview\02-Java集合篇\assets\ArrayList第一次扩容.png)

ArrayList第二次扩容时

![1724058227556](assets/ArrayList第二次扩容.png)



## ArrayList的添加与删除元素为什么慢？

主要原因是由于其内部实现基于数组的特性所导致的。

ArrayList的添加与删除操作慢，主要是因为其内部实现基于数组，而数组在插入和删除元素时需要移动其他元素来保证连续性和顺序性，这个过程需要耗费较多的时间。

相对于基于链表的数据结构（如LinkedList），ArrayList的插入和删除操作的时间复杂度是O(n)级别的，而链表的时间复杂度为O(1)。

**添加元素**

1.  **尾部添加**：

-   -   当在ArrayList的尾部添加元素时，如果当前数组的容量还未达到最大值，只需要将新元素添加到数组的末尾即可，此时时间复杂度为**O(1)**。
    -   但是，当数组容量已满时，会触发**扩容**操作。扩容操作通常会将数组的容量增加到当前容量的1.5倍或2倍，并将原数组中的所有元素复制到新的更大的数组中。这一过程的时间复杂度为**O(n)**，其中n为当前数组中的元素数量。

1.  **指定位置插入**：

-   -   当在ArrayList的指定位置（非尾部）插入元素时，需要将目标位置之后的所有元素向后移动一个位置，然后将新元素插入到指定位置。这个过程涉及到移动元素的操作，时间复杂度为**O(n)**，在最坏情况下，如头部插入，需要移动所有的元素。

**删除元素**

1.  **尾部删除**：

-   -   当删除的元素位于列表末尾时，只需要将末尾元素移除即可，时间复杂度为**O(1)**。

1.  **指定位置删除**：

-   -   当在ArrayList的指定位置（非尾部）删除元素时，需要将删除点之后的所有元素向前移动一个位置，以填补被删除元素的位置。这个过程同样涉及到移动元素的操作，时间复杂度为**O(n)**，在最坏情况下，如头部删除，需要移动除了被删除元素之外的所有元素。



## ArrayList是线程安全的吗？

ArrayList是**线程不安全**的。在多线程环境下，如果多个线程同时对ArrayList进行操作，可能会出现数据不一致的情况。

当多个线程同时对ArrayList进行添加、删除等操作时，可能会导致数组大小的变化，从而引发数据不一致的问题。例如，当一个线程在对ArrayList进行添加元素的操作时（这通常分为两步：先在指定位置存放元素，然后增加size的值），另一个线程可能同时进行删除或其他操作，导致数据的不一致或错误。



比如下面的这个代码，就是实际上ArrayList 放入元素的代码：

```java
elementData[size] = e;
size = size + 1;
```

1.  elementData[size] = e; 这一行代码是将新的元素 e 放置在 ArrayList 的内部数组 elementData 的当前大小 size 的位置上。这里假设 elementData 数组已经足够大，可以容纳新添加的元素（实际上 ArrayList 在必要时会增长数组的大小）。
2.  size = size + 1; 这一行代码是更新 ArrayList 的大小，使其包含新添加的元素。

如果两个线程同时尝试向同一个 ArrayList 实例中添加元素，那么可能会发生以下情况：

-   线程 A 执行 elementData[size] = eA;（假设当前 size 是 0）
-   线程 B 执行 elementData[size] = eB;（由于线程 A 尚未更新 size，线程 B 看到的 size 仍然是 0）
-   此时，elementData[0] 被线程 B 的 eB 覆盖，线程 A 的 eA 丢失
-   线程 A 更新 size = 1;
-   线程 B 更新 size = 1;（现在 size 仍然是 1，但是应该是 2，因为有两个元素被添加）



为了解决ArrayList的线程安全问题，可以采取以下几种方式：

-   1、使用Collections类的synchronizedList方法：**将ArrayList转换为线程安全的List**。这种方式通过在对ArrayList进行操作时加锁来保证线程安全，但可能会带来一定的性能损耗。
-   2、使用**CopyOnWriteArrayList**类：它是Java并发包中提供的线程安全的List实现。CopyOnWriteArrayList在对集合进行修改时，会创建一个新的数组来保存修改后的数据，这样就不会影响到其他线程对原数组的访问。因此，它**适合在读操作远远多于写操作的场景**下使用。
-   3、使用并发包中的锁机制：如Lock或Semaphore等，显式地使用锁来保护对ArrayList的操作，可以确保在多线程环境下数据的一致性。但这种方式需要开发人员自行管理锁的获取和释放，容易出现死锁等问题。
-   还可以考虑使用其他线程安全的集合类，如Vector或ConcurrentLinkedQueue等，它们本身就是线程安全的，可以直接在多线程环境下使用。



## ArrayList如何保证线程安全？

为了保证 ArrayList 的线程安全，一般有以下几种方式：

-   1、借助**锁**、手动同步

可以通过在访问 ArrayList 的代码块上使用 synchronized 关键字来手动同步对 ArrayList 的访问。这要求所有访问 ArrayList 的代码都知道并使用相同的锁。

```java
List<String> list = new ArrayList<>();
// ... 填充列表 ...

synchronized(list) {
    Iterator<String> it = list.iterator();
    while (it.hasNext()) {
        String element = it.next();
        // 处理元素...
    }
}
```

-   2、使用 **Collections.synchronizedList**

Collections.synchronizedList 方法返回一个线程安全的列表，该列表是通过在每个公共方法（如 add(), get(), iterator() 等）上添加同步来实现的，其中同步是基于里面的同步代码块实现。

但是，和手动同步一样，它也**不能解决在迭代过程中进行结构修改导致的问题**。

```java
List<String> list = Collections.synchronizedList(new ArrayList<>());
```

-   **4、 使用并发集合**：

Java 并发包 java.util.concurrent 提供了一些线程安全的集合类，如 **CopyOnWriteArrayList**。这些类提供了不同的线程安全保证和性能特性。

CopyOnWriteArrayList是一个线程安全的变体，其中所有可变操作（add、set 等等）都是通过对底层数组进行新的复制来实现的。因此，迭代器不会受到并发修改的影响，并且遍历期间不需要额外的同步。但是，当有很多**写操作**时，这种方法可能会**很昂贵**，因为它需要在每次修改时复制整个底层数组。

```java
List<String> list = new CopyOnWriteArrayList<>();List<String> list = new CopyOnWriteArrayList<>();
```

选择解决方案时，需要考虑并发模式、读写比例以及性能需求。如果你的应用主要是读操作并且偶尔有写操作，CopyOnWriteArrayList是一个好选择。如果你的应用有大量的写操作，那么可能需要使用其他并发集合或手动同步策略。



## Arrays.asList() 方法把数组转换成集合

**说明：**

​	使用Arrays.asList() 方法把数组转换成集合后，该集合不能添加、删除元素

**原因：**

​	Arrays.ArrayList类继承自**AbstractList**，实现了List接口。它**重写了add()、remove()**等修改List结构的方法，并将它们**直接抛出UnsupportedOperationException异常**，从而禁止了对List结构的修改。具体来说，Arrays.asList()方法返回的是Arrays类中的一个私有静态内部类ArrayList，它继承自AbstractList类，实现了List接口。

**源码：**

```java
public class Arrays {

    public static <T> List<T> asList(T... a) {
        return new ArrayList<>(a);
    }

    /**
     * @serial include 注意这是个内部类，并不是java.util包下的ArrayList
     */
    private static class ArrayList<E> extends AbstractList<E>
        implements RandomAccess, java.io.Serializable
    {

    }

}
```

**阿里手册：**

![](./assets/5885212.png)

**最佳实践：**

-   如果使用了&nbsp;Arrays.asList()&nbsp;的话，最好不要使用其集合的操作方法

-   如果非要用，可以在外面包一层ArrayList

    -   ```java
        List<Integer> list = new ArrayList<>(Arrays.asList(1,2));
        ```




## 集合遍历时remove或add操作注意事项？





**阿里手册：**

![](./assets/35654323456.png)



## 数组和链表在Java中的区别？





## Java中有哪些集合类？概述Java集合体系？



## Java中List有哪些常见实现类？



## Java中Set有哪些常见实现类？

-   Set 接口是 Collection 的子接口，**Set 接口相较于 Collection 接口没有提供额外的方法** （依然还是Collection中的15个抽象方法）	
-   Set集合用于存储**无序**（无序是指存入和取出的顺序不一定相同）、**不重复**的元素
-   Set 集合不允许包含相同的元素，如果试把两个相同的元素加入同一个 Set 集合中，则添加操作失败。 
-   Set 集合支持的遍历方式和 Collection 集合一样：foreach 和 Iterator。 
-   Set 的常用实现类有：HashSet、TreeSet、LinkedHashSet（HashSet的子类）

### Set集合的特点

**无序性：**

-   无序性 != 随机性
-   添加元素的顺序和遍历元素的顺序不一致，这是不是无须性呢？NO
-   到底什么是无序性？与添加的元素的位置有关，不像ArrayList一样是紧密排序的。
-   这里是根据添加元素的Hash值，计算其在数组中的存储位置。此位置不是依次紧密排序的，表现为无序性。

**HashSet、LinkedHashSet中元素不可重复性：**

-   添加到Set中的元素是不能相同的。
-   比较的标准是hashCode() 得到的哈希值以及 equals() 得到的boolean的结果
-   **哈希值相同且 equals()返回 true，则认为元素相同的**。

**添加到HashSet、LinkedHashSet中元素的要求**

-   要求（建议）元素所在的类重写两个方法 hashCode() equals() ，以确保添加到集合中的对象的唯一性
-   同时，要求hashCode() 和 equals() 要保持一致性，IDEA自动生成的即可保持一致。

**TreeSet 判断元素是否相同的标准**

-   不再是考虑 hashCode() 和 equals() ，也就意味着添加到TreeSet中的元素所在的类不需要重写hashCode() 和 equals()
-   **比较**元素大小或是比较元素是否相等的标准就是考虑自然排序或定制排序中，**compareTo() 或 compare() 的返回值**
-   **如果compareTo() 或 compare() 的返回值为0，则认为两个对象是相等的。**由于TreeSet中不能存放相同的元素，则后一个元素就无法成功添加到 TreeSet中。

### HashSet

-   HashSet是Set接口的一个实现类，它基**基于哈希表实现（底层使用的是HashMap（HashMap底层在JDK8及之后是数组+链表（长度>8 红黑树）））**  （主要是应用场景是用于过滤数据）

-   HashSet 按 Hash 算法来存储集合中的元素，因此具有很好的存储、查找、删除性能。 
-   HashSet 具有以下特点：
    -   **哈希表结构**：HashSet 内部使用哈希表来存储元素，每个元素被存储在哈希表的一个桶中。通过哈希函数将元素映射到桶的位置，从而实现快速的插入、删除和查找操作。
    -   **不保证元素顺序**：HashSet 不保证元素的顺序，**元素的存储顺序可能与插入顺序不同**。
    -   **不允许重复元素**：HashSet **不允许存储重复的元素**，如果尝试插入重复元素，插入操作将被忽略。
    -   **允许存储 null 元素**：HashSet 允许存储 null 元素，但**只能存储一个 null 元素**。
    -   HashSet **不是线程安全的** ，如果多个线程同时访问并修改HashSet，则需要外部同步

-   HashSet 集合**判断两个元素相等**的标准：两个对象通过 **hashCode()** 方法得到的哈希值相等，并且两个对象的 **equals()方法返回值为 true**。 
-   对于存放在 Set 容器中的对象，**对应的类一定要重写 hashCode()和 equals(Object obj)方法**，以实现对象相等规则。即：“相等的对象必须具有相等的散列码”。 
    -   当存储自定义对象时，需要重写对象的`hashCode()`和`equals()`方法，以确保对象的唯一性。
-   HashSet 集合中元素的**无序性，不等同于随机性**。这里的无序性与元素的添加位置有关。
    -   具体来说：我们在添加每一个元素到数组中时，具体的存储位置是由元素的hashCode()调用后返回的 hash 值决定的。导致在数组中每个元素不是依次紧密存放的，表现出一定的无序性。 

注意：

​	**如果两个元素的 equals() 方法返回 true，但它们的hashCode() 返回值不相等，hashSet 将会把它们存储在不同的位置，但依然可以添加成功。** 

实例代码：

```java
public class HashSetDemo2 {
    public static void main(String[] args) {
        // Set集合去重的原因 先判断哈希值，在比较equals()
        Set<Student> hashSet = new HashSet<>(); // 无序、可重复、无索引

        Student s1 = new Student("小明", 18);
        Student s2 = new Student("小明", 18);
        Student s3 = new Student("小华", 18);
        Student s4 = new Student("小红", 18);

        hashSet.add(s1);
        hashSet.add(s2);
        hashSet.add(s3);
        hashSet.add(s4);

        System.out.println(hashSet);
        // [Student(name=小明, age=18), Student(name=小华, age=18), Student(name=小红, age=18)]
    }
}

@Getter
@Setter
@ToString
@EqualsAndHashCode
class Student{
    private String name;
    private int age;

    public Student() {
    }

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

### LinkedHashSet

-   LinkedHashSet是**HashSet的子类**，同时也实现了 Set 接口。与 HashSet 不同，**LinkedHashSet 保持了元素的插入顺序，并且不允许重复元素**

-   它基于哈希表和双向链表实现，继承于 HashSet、又基于 LinkedHashMap 来实现的。 根据元素的 hashCode 值来决定元素的存储位置，但它同时**使用双向链表维护元素的次序**，这**使得元素看起来是以添加顺序保存的。** **相比于 HashSet 增加了顺序性**。

-   LinkedHashSet 插入性能略低于 HashSet，但在将元素按照插入的顺序进行迭代迭代访问 Set 里的全部元素时有很好的性能。同时继承了HashSet的所有特性。

-   LinkedHashSet 的特点包括：
    -   **哈希表结构**：LinkedHashSet 内部使用哈希表来存储元素，每个元素被存储在哈希表的一个桶中。通过哈希函数将元素映射到桶的位置，从而实现快速的插入、删除和查找操作。
    -   **保持插入顺序**：LinkedHashSet 会维护元素的插入顺序，即元素被添加到集合中的顺序将被保留。
    -   **不允许重复元素**：LinkedHashSet 不允许存储重复的元素，如果尝试插入重复元素，插入操作将被忽略。
    -   **允许存储 null 元素**：LinkedHashSet 允许存储 null 元素，**但只能存储一个 null 元素**。

### TreeSet

-   TreeSet 是 SortedSet 接口（该接口继承于Set接口）的实现类，它基于**红黑树**实现，可以对元素进行自然排序或自定义排序。
-   不允许null元素的存在。TreeSet 同样是**线程不安全**的。
-   TreeSet 特点：
    -   **不允许重复**
    -   **实现排序**（自然排序或定制排序） 
    -   添加到TreeSet集合中的元素必须是同一个类的对象，因为只有相同类的两个实例才会比较大小，否则报错`ClassCastException`
-   当存储自定义对象时，如果想要进行排序，需要实现`Comparable`接口并重写`compareTo()`方法，或提供自定义的`Comparator`对象来进行排序。

**TreeSet 判断元素使用相同的标准**

-   不再是考虑 hashCode() 和 equals() ，也就意味着添加到TreeSet中的元素所在的类不需要重写hashCode() 和 equals()
-   比较元素大小或是比较元素是否相等的标准就是考虑自然排序或定制排序中，compareTo() 或 compare() 的返回值
-   **如果compareTo() 或 compare() 的返回值为0，则认为两个对象是相等的。**

扩展：

-   TreeSet 两种排序方法：**自然排序**和**定制排序**。默认情况下，TreeSet 采用自然排序。 
    -   自然排序：TreeSet 会调用集合元素的 compareTo(Object obj) 方法来比较元素之间的大小关系，然后将集合元素按升序(默认情况)排列。  
        -   如果试图把**一个对象添加到 TreeSet 时，则该对象的类必须实现 Comparable 接口**。 
        -   实现 Comparable 的类必须实现 compareTo(Object obj) 方法，两个对象即通过 compareTo(Object obj) 方法的返回值来比较大小。 
    -   定制排序：**如果元素所属的类没有实现 Comparable 接口**，或不希望按照升序(默认情况)的方式排列元素或希望按照其它属性大小进行排序，则考虑使用定制排序。定制排序，**通过 Comparator 接口来实现**。需要重写 compare(T o1,T o2)方法。 
        -   利用 int compare(T o1,T o2)方法，比较 o1 和 o2 的大小：如果方法返回正整数，则表示 o1 大于 o2；如果返回 0，表示相等；返回负整数，表示 o1 小于 o2。 
        -   要实现定制排序，需要将实现 Comparator 接口的实例作为形参传递给 TreeSet 的构造器。 

### 适用场景

-   `HashSet`：适用于需要快速查找的场景，不保证元素的顺序。
-   `LinkedHashSet`：适用于需要保持元素插入顺序的场景。
-   `TreeSet`：适用于需要元素排序的场景。



## HashSet 中添加元素的过程？

第 1 步：当向 HashSet 集合中存入一个元素时，HashSet 会调用该对象的 hashCode() 方法得到该对象的 hashCode 值，然后根据 hashCode 值，通过某个散列函数决定该对象在 HashSet 底层数组中的存储位置。 

第 2 步：如果要在数组中存储的位置上没有元素，则直接添加成功。 

第 3 步：如果要在数组中存储的位置上有元素，则继续比较： 

​	如果两个元素的 hashCode 值不相等，则添加成功； 

​	如果两个元素的 hashCode()值相等，则会继续调用 equals()方法： 

​		如果 equals()方法结果为 false，则添加成功。 

 		如果 equals()方法结果为 true，则添加失败。第 2 步添加成功，元素会保存在底层数组中。 

第 3 步两种添加成功的操作，由于该底层数组的位置已经有元素了，则会通过链表的方式继续链接，存储。 



## HashSet如何实现线程安全？

HashSet本身不是线程安全的。如果多个线程在没有外部同步的情况下同时访问一个HashSet，并且至少有一个线程修改了集合，那么它必须保持同步。否则，会导致不可预知的行为和数据损坏。变为线程安全，主要有以下几种方式：

-   1、 使用**Collections.synchronizedSet**

Java 提供了一个简单的方法来创建一个同步的集合，通过Collections.synchronizedSet方法。这个方法返回一个线程安全的集合包装器。

```java
Set<String> synchronizedSet = Collections.synchronizedSet(newHashSet<>());
```

使用这个方法后，所有对集合的访问都将是同步的。但是，需要注意的是，对于迭代操作，必须手动同步：

```java
Set<String> synchronizedSet = Collections.synchronizedSet(newHashSet<>());
synchronized (synchronizedSet) {
    Iterator<String> iterator = synchronizedSet.iterator();
    while (iterator.hasNext()) {
        System.out.println(iterator.next());
    }
}
```

-   2、使用**ConcurrentHashMap**

如果需要更高效的并发访问，可以使用ConcurrentHashMap来实现类似HashSet的功能。ConcurrentHashMap提供了更细粒度的锁机制，在高并发环境下性能更好

```java
Set<String> concurrentSet = ConcurrentHashMap.newKeySet();
```

ConcurrentHashMap.newKeySet()返回一个基于ConcurrentHashMap的Set实现，它是线程安全的，并且在高并发环境下性能优越。

-   3、 使用**CopyOnWriteArraySet**

对于**读操作远多于写操作**的场景，可以使用CopyOnWriteArraySet。它的实现基于CopyOnWriteArrayList，在每次修改时都会复制整个底层数组，因此在写操作较少时性能较好。

```java
Set<String> copyOnWriteArraySet = new CopyOnWriteArraySet<>();
```

-   4、手动同步

如果你不想使用上述任何一种方法，也可以手动同步HashSet的访问。可以使用synchronized关键字来保护对HashSet的访问：

```java
Set<String> hashSet = newHashSet<>();
synchronized (hashSet) {
    // 对 hashSet 的操作
}
```

**选择合适的方案**

-   如果你的应用程序是单线程的，或只有少量的线程访问集合，可以使用Collections.synchronizedSet。
-   如果你的应用程序有大量的并发读写操作，可以使用ConcurrentHashMap.newKeySet。
-   如果你的应用程序读操作远多于写操作，可以使用CopyOnWriteArraySet。

下面是一个ConcurrentHashMap实现线程安全Set的示例代码：

```java
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class ConcurrentHashSetExample {
    public static void main(String[] args) {
        Set<String> concurrentSet = ConcurrentHashMap.newKeySet();

        // 多线程环境下的操作示例
        Runnable task = () -> {
            for (int i = 0; i < 1000; i++) {
                concurrentSet.add(Thread.currentThread().getName() + "-" + i);
            }
        };

        Thread thread1 = new Thread(task, "Thread1");
        Thread thread2 = new Thread(task, "Thread2");

        thread1.start();
        thread2.start();

        try {
            thread1.join();
            thread2.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("Set size: " + concurrentSet.size());
    }
}
```



## Java中Map有那些常见实现类？



## 什么是LinkedHashMap？



## 什么是TreeMap？



## 什么是IdentityHashMap？



## 什么是WeakHashMap？







## HashMap的实现原理？

## HashMap和HsahTable的区别？



## HashMap和Hashset的区别？



## HashMap的扩容机制？



## ArrayList的扩容机制？



## 为什么HashMap扩容时采用2^n倍？



## 为什么HashMap的默认负载因子是0.75？







## 为什么JDK8对HashMap进行了红黑树改动？



## HashMap进行了哪些改动，除了红黑树？





## ConcurrentHashMap在JDK7和8之间的区别？





## ConcurrentHashMap的get方法是否需要加锁？



## 为什么ConcurrentHashMap的k-v都不能为null？



## ConcurrentHashMap底层具体实现你知道吗？实现原理？



## 什么是Java中的Copy-On-Write？





## 你遇到过ConrrentModificationException异常吗？

循环删除





## CopyOnWriteArrayList和Collections.synchronization有什么区别？分别有什么优缺点？





## 什么是Hash碰撞？怎么解决？





## 使用HashMap时，有哪些提升性能的技巧？