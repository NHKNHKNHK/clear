# Collections 工具类  

参考操作数组的工具类：Arrays，Collections 是一个**操作 Set、List 和 Map 等集合的工具类**。 

## 常用方法 

`Collections` 是 Java 集合框架中的一个工具类，位于`java.util`包下。

提供了一组静态方法，用于对集合进行各种操作和处理（如：排序、查询和修改等），还提供了对集合对象设置不可变、对集合对象实现同步控制等方法（均为 static 方法）。

### 排序操作

```java
// 反转 List 中元素的顺序 
public static void reverse(List<?> list)
```

```java
// 用于返回一个逆序比较器。该方法返回的比较器可以用于对元素进行逆序排序
public static <T> Comparator<T> reverseOrder() 
// 返回一个基于指定比较器的逆序比较器。该方法返回的比较器可以用于对元素进行逆序排序，但是使用指定的比较器进行比较  
public static <T> Comparator<T> reverseOrder(Comparator<T> cmp) 
```

例如：

```java
List<Integer> numbers = Arrays.asList(3, 1, 4, 1, 5, 9, 2, 6, 5);
Collections.sort(numbers, Collections.reverseOrder());
System.out.println(numbers); // 输出：[9, 6, 5, 5, 4, 3, 2, 1, 1]
```

```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");
Collections.sort(names, Collections.reverseOrder(String.CASE_INSENSITIVE_ORDER));
System.out.println(names); // 输出：[David, Charlie, Bob, Alice]
```

```java
// 对 List 集合元素进行随机排序(打乱) 
public static void shuffle(List<?> list)

// 对 List 集合元素进行随机排序 。使用指定的随机数生成器 rnd 来进行随机排序。(打乱) 
public static void shuffle(List<?> list, Random rnd)
```

例如：

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
Collections.shuffle(numbers, new Random());
System.out.println(numbers); // 输出：[4, 2, 1, 5, 3]
// 通过传入一个新的 Random 对象作为随机数生成器，每次运行结果都会不同
```

注意，`shuffle` 方法会直接修改原始列表，而不是返回一个新的列表。如果需要保留原始列表的顺序，可以先创建一个副本，然后对副本进行随机排序

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
List<Integer> shuffledNumbers = new ArrayList<>(numbers);
Collections.shuffle(shuffledNumbers, new Random());
System.out.println(numbers); // 输出：[1, 2, 3, 4, 5]
System.out.println(shuffledNumbers); // 输出：随机排序后的列表
```



```java
// 根据元素的自然顺序对指定 List 集合元素按升序排序
public static <T extends Comparable<? super T>> void sort(List<T> list)
```

```java
// 根据指定的 Comparator 产生的顺序对 List 集合元素进行排序 
public static <T> void sort(List<T> list, Comparator<? super T> c)
```

```java
// 将指定 list 集合中的 i 处元素和 j 处元素进行交换 
public static void swap(List<?> list, int i, int j)
```

### 查找 

```java
// 根据元素的自然顺序，返回给定集合中的最大元素 
public static <T extends Object & Comparable<? super T>> T max(Collection<? extends T> coll)
// 根据 Comparator 指定的顺序，返回给定集合中的最大元素
public static <T> T max(Collection<? extends T> coll, Comparator<? super T> comp)
```

```java
// 根据元素的自然顺序，返回给定集合中的最小元素 
public static <T extends Object & Comparable<? super T>> T min(Collection<? extends T> coll)
// 根据 Comparator 指定的顺序，返回给定集合中的最小元素 
public static <T> T min(Collection<? extends T> coll, Comparator<? super T> comp)
```

```java
// 在 List 集合中查找某个元素的下标，但是 List 的元素必须是 T 或 T 的子类对象，而且必须是可比较大小的，即支持自然排序的。而且集合也事先必须是有序的，否则结果不确定
public static <T>
    int binarySearch(List<? extends Comparable<? super T>> list, T key)
// 在 List 集合中查找某个元素的下标，但是List 的元素必须是 T 或 T 的子类对象，而且集合也事先必须是按照 c 比较器规则进行排序过的，否则结果不确定
public static <T> int binarySearch(List<? extends T> list, T key, Comparator<? super T> c)    
```

```java
// 返回指定集合中指定元素的出现次数
public static int frequency(Collection<?> c, Object o)
```

### **复制、替换** 

```java
// 将 src 中的内容复制到 dest 中  
public static <T> void copy(List<? super T> dest, List<? extends T> src)
```

```java
// 使用新值替换 List 对象的所有旧值提供了多个 unmodifiableXxx()方法，该方法返回指定 Xxx 的不可修改的视图
public static <T> boolean replaceAll(List<T> list, T oldVal, T newVal)
```

### 添加

```java
// 将所有指定元素添加到指定 collection 中
public static <T> boolean addAll(Collection<? super T> c, T... elements)
```

### 同步 

Collections 类中提供了多个 synchronizedXxx() 方法，该方法可使将指定集合包装成线程同步的集合，从而可以解决多线程并发访问集合时的线程安全问题：

```java
// 返回指定集合的同步（线程安全）视图
public static <T> Collection<T> synchronizedCollection(Collection<T> c)

// 返回指定 List 的同步（线程安全）视图    
public static <T> List<T> synchronizedList(List<T> list)
    
// 返回指定 Map 的同步（线程安全）视图    
public static <K,V> Map<K,V> synchronizedMap(Map<K,V> m)   

public static <K,V> NavigableMap<K,V> synchronizedNavigableMap(NavigableMap<K,V> m)

public static <T> NavigableSet<T> synchronizedNavigableSet(NavigableSet<T> s)   
    
// 返回指定 Set 的同步（线程安全）视图    
public static <T> Set<T> synchronizedSet(Set<T> s)    

public static <K,V> SortedMap<K,V> synchronizedSortedMap(SortedMap<K,V> m)  
    
public static <T> SortedSet<T> synchronizedSortedSet(SortedSet<T> s)    
```

例如：

```
List<String> list = new ArrayList<>();
List<String> synchronizedList = Collections.synchronizedList(list);
```

### 创建

**创建只包含单个元素的集合**。常用方法：

```java
// 创建一个只包含指定元素的不可变列表
public static <T> List<T> singletonList(T o) {
    return new SingletonList<>(o);
}
```

```java
// 创建一个只包含指定元素的不可变集合
public static <T> Set<T> singleton(T o) {
    return new SingletonSet<>(o);
}
```

```java
// 创建一个只包含指定键值对的不可变映射
public static <K,V> Map<K,V> singletonMap(K key, V value) {
    return new SingletonMap<>(key, value);
}
```

这些方法都返回不可变的集合，意味着**它们不支持添加、删除或修改元素的操作**。它们主要用于在需要传递单个元素的集合参数时使用，或者在需要创建只包含一个元素的集合时使用

例如：

```java
// 这是一个释放 FileOutputStream对象资源的片段
// 通过 Collections.singletonList(fos) 方法包装为只包含一个元素的List
// 通过 .get(0) 获取该List中的唯一元素
// 判断获取到的元素是否为 null。如果不为 null，则执行 fos.close() 方法来关闭资源。
// 这段代码的意义：避免在资源为 null 的情况下调用 close() 方法导致空指针异常。
if (Collections.singletonList(fos).get(0) != null) {
    fos.close();
}

// 我们以前写这段代码是这么写的
if (fos != null){
    fos.close();
}
```



**创建空的不可变集合**，常用方法：

```java
public static final <T> List<T> emptyList() {
    return (List<T>) EMPTY_LIST;
}
```

```java
public static final <T> List<T> emptyList() {
    return (List<T>) EMPTY_LIST;
}
```

```java
public static final <K,V> Map<K,V> emptyMap() {
    return (Map<K,V>) EMPTY_MAP;
}
```



### 不可修改操作

```java
// 返回指定集合的不可修改视图·
public static <T> Collection<T> unmodifiableCollection(Collection<? extends T> c)

// 返回指定 List 的不可修改视图    
public static <T> List<T> unmodifiableList(List<? extends T> list)
    
public static <K,V> Map<K,V> unmodifiableMap(Map<? extends K, ? extends V> m)

public static <K,V> NavigableMap<K,V> unmodifiableNavigableMap(NavigableMap<K, ? extends V> m)

public static <T> NavigableSet<T> unmodifiableNavigableSet(NavigableSet<T> s)
    
public static <T> Set<T> unmodifiableSet(Set<? extends T> s)

public static <K,V> SortedMap<K,V> unmodifiableSortedMap(SortedMap<K, ? extends V> m)
    
public static <T> SortedSet<T> unmodifiableSortedSet(SortedSet<T> s)    
```

1.  `synchronizedCollection(Collection<T> c)`：返回指定集合的同步（线程安全）视图。
2.  `synchronizedList(List<T> list)`：返回指定列表的同步（线程安全）视图。
3.  `synchronizedMap(Map<K,V> m)`：返回指定映射的同步（线程安全）视图。
4.  `synchronizedSet(Set<T> s)`：返回指定集合的同步（线程安全）视图。
5.  `synchronizedSortedMap(SortedMap<K,V> m)`：返回指定排序映射的同步（线程安全）视图。
6.  `synchronizedSortedSet(SortedSet<T> s)`：返回指定排序集合的同步（线程安全）视图。
7.  `checkedCollection(Collection<E> c, Class<E> type)`：返回指定集合的类型安全（类型检查）视图。
8.  `checkedMap(Map<K,V> m, Class<K> keyType, Class<V> valueType)`：返回指定映射的类型安全（类型检查）视图。

这些方法返回的是线程安全的视图，而不是真正的同步方法。它们通过在每个方法上添加同步锁来确保线程安全性。


## Collection 与 Collections

`Collection` 和 `Collections` 是 Java 中两个不同的类或接口，它们的作用和用途也不同。

1.  `Collection` 是 Java 集合框架中的一个接口，它是所有集合类的根接口。`Collection` 接口定义了一组通用的方法，用于操作和处理集合中的元素。它是一个抽象的概念，表示一组对象的集合，可以包含重复的元素。

`Collection` 接口的常见实现类包括 `List`、`Set` 和 `Queue` 等。

1.  `Collections` 是 Java 集合框架中的一个工具类，它提供了一组静态方法，用于对集合进行各种操作和处理。`Collections` 类中的方法可以用于对集合进行排序、查找、替换、反转等操作，还可以创建线程安全的集合。

`Collections` 类中的方法都是静态方法，可以直接通过类名调用，而不需要创建 `Collections` 的实例。

总结：

-   `Collection` 是一个接口，表示一组对象的集合，定义了一组通用的方法。
-   `Collections` 是一个工具类，提供了一组静态方法，用于对集合进行各种操作和处理。

需要注意的是，`Collection` 和 `Collections` 是两个不同的概念，它们之间没有直接的继承或关联关系。`Collections` 类中的方法通常用于操作和处理 `Collection` 接口的实现类的对象。

