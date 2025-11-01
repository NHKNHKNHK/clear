# Java集合框架概述

## 数组

**数组存储的特点：**

-   数组一旦初始化，其长度就确定了

-   数组中的多个元素是依次紧密排列的，有序的，可重复的

-   数组一旦初始化，其元素的类型就确定了。不是此类型的元素，就不能添加到此数组中。

    -   ```java
        int[] arr = new int[10];
        arr[0] = 1;
        arr[1] = "hello";  // 编译报错
        ```

-   元素的类型既可以是基本数据类型，也可以是引用类型
-   数组中查找操作性能很好

**数组存储的弊端：**

-   数组一旦初始化，其长度就不可变了
-   数组中存储数据的类型是单一的。对于无序的、不可重复的场景就无能为力了。
-   数组中可用的方法，属性很少。具体的需求，都需要自己来实现。
-   数组对于数组中元素插入、删除操作，较差

## Java集合框架体系（java.util）

Java 集合可分为 `Collection` 和 `Map` 两大体系： 

-   `Collection` 接口：用于存储一个一个的数据，也称*单列数据集合*。 
    -   `List` 子接口：用来存储有序的、可以重复的数据（主要用来替换数组，**"动态"数组**） 
        -   实现类：`ArrayList`(主要实现类)、`LinkedList`、`Vector` 
    -   `Set` 子接口：用来存储无序的、不可重复的数据（类似于高中讲的"集合"） 
        -   实现类：`HashSet`(主要实现类)、`LinkedHashSet`、`TreeSet` 

-   `Map` 接口：用于存储具有映射关系“key-value 对”的集合，即一对一对的数据，也称双列数据集合。(类似于高中的函数、映射。(x1,y1),(x2,y2) ---> y = f(x) ) 
    -   `HashMap`(主要实现类)、`LinkedHashMap`、`TreeMap`、`Hashtable`、`Properties`

## 3 Collection接口

-   JDK 不提供此接口的任何直接实现，而是提供更具体的子接口（如：Set 和 List）去实现。 
-    **Collection 接口是 List 和 Set 接口的父接口**，该接口里定义的方法既可用于操作 Set 集合，也可用于操作 List 集合。

源码如下：

```java
package java.util;

public interface Collection<E> extends Iterable<E> {
    int size();
    boolean isEmpty();
    boolean contains(Object o);
    // 实现类Iterable接口的类，可以使用增强for循环
    Iterator<E> iterator();
    Object[] toArray();
    <T> T[] toArray(T[] a);
    boolean add(E e);
    boolean remove(Object o);
    boolean containsAll(Collection<?> c);
    boolean addAll(Collection<? extends E> c);
    boolean removeAll(Collection<?> c);
    boolean retainAll(Collection<?> c);
    void clear();
    boolean equals(Object o);
    int hashCode();
    ...
}
```

### 2.1 Collection接口的15个抽象方法

#### 2.1.1 添加类

```java
boolean add(E e)  // 添加元素对象到当前集合中
boolean addAll(Collection<? extends E> c)  // 添加 other 集合中的所有元素对象到当前集合中，即 this = this ∪ other
```

例如：

```java
@Test
public void test1() {
    // 集合和泛型不支持基本数据类型，只能支持引用数据类型，所以集合存储的元素都认为是对象
    // ArrayList<int> list = new ArrayList<>();  错误写法
    // ArrayList 是 Collection 的子接口 List 的实现类之一
    Collection coll = new ArrayList();

    // add
    coll.add("hello");
    coll.add(123);  // 自动装箱
    coll.add(new Person("张三",18));
    System.out.println(coll);  // [hello, 123, Person{name='张三', age=18}]
    // addall
    Collection coll2 = new ArrayList();
    coll2.add("world");
    coll2.add(456);
    //coll.addAll(coll2);
    System.out.println(coll);  // [hello, 123, Person{name='张三', age=18}, world, 456]
    coll.add(coll2);
    System.out.println(coll);  // [hello, 123, Person{name='张三', age=18}, [world, 456]]
}
```

#### 2.1.2 判断类

```java
int size()  // 获取当前集合中实际存储的元素个数
    
boolean isEmpty()  // 判断当前集合是否为空集合
    
boolean contains(Object obj)  // 判断当前集合中是否存在一个与 obj 对象 equals 返回 true 的元素
boolean containsAll(Collection coll)  // 判断 coll 集合中的元素是否在当前集合中都存在。 即 coll 集合是否是当前集合的“子集” 

boolean equals(Object obj)  // 判断当前集合与 obj 是否相等
```

例如：

```java
@Test
public void test2() {
    // ArrayList 是 Collection 的子接口 List 的实现类之一
    Collection coll = new ArrayList();

    // add
    coll.add("hello");
    coll.add(123);  // 自动装箱
    coll.add(new Person("张三",18));
    System.out.println(coll);  // [hello, 123, Person{name='张三', age=18}]

    // size
    System.out.println(coll.size());  // 3
    // isEmpty
    System.out.println(coll.isEmpty());  // false

    // contains
    System.out.println(coll.contains("hello"));  // true
    System.out.println(coll.contains(new String("hello")));  // true
    System.out.println(coll.contains(new Person("张三",18)));  // true 因为我们重写了equals方法

    // containsAll
    Collection coll2 = new ArrayList();
    coll.add("hello");
    coll.add(123);
    System.out.println(coll.containsAll(coll2));  // true

    // equals：该方法一般很少使用
    System.out.println(coll.equals(coll2));  // false
}
```

#### 2.1.3 删除类

```java
void clear()  // 清空集合元素
    
boolean remove(Object obj)  // 从当前集合中删除第一个找到的与 obj 对象 equals 返回 true 的元素
boolean removeAll(Collection coll)  // 从当前集合中删除所有与 coll 集合中相同的元素。即 this = this - this ∩ coll 

boolean retainAll(Collection coll)  // 从当前集合中删除两个集合中不同的元素，使得当前集合仅保留与 coll 集合中的元素相同的元素，即当前集合中仅保留两个集合的交集，即 this = this ∩ coll；
```

```java
// 在 JDK8.0 时，Collection 接口有了 removeIf 方法，即可以根据条件删除
default boolean removeIf(Predicate<? super E> filter) 
```

 例如：

```java
@Test
public void test3() {
    Collection coll = new ArrayList();

    // add
    coll.add("hello");
    coll.add("hello");
    coll.add(123);  // 自动装箱
    coll.add(123);  // 自动装箱
    coll.add(new Person("张三",18));
    System.out.println(coll);  // [hello, hello, 123, 123, Person{name='张三', age=18}]

    // clear
    //coll.clear();
    //System.out.println(coll.size());

    // remove
    coll.remove("hello");
    System.out.println(coll);  // [hello, 123, 123, Person{name='张三', age=18}]
    coll.remove(new Person("张三",18));
    System.out.println(coll);  // [hello, 123, 123]

    // removeAll
    Collection coll2 = new ArrayList();
    coll2.add(123);
    coll.removeAll(coll2);
    System.out.println(coll);  // [hello]
}
```

#### 2.1.4 其它方法

```java
Object[] toArray()  // 返回包含当前集合中所有元素的数组  集合 ==> 数组
<T> T[] toArray(T[] a)
    
int hashCode()  // 获取集合对象的哈希值  
    
Iterator<E> iterator()  // 返回迭代器对象，用于集合遍历，实现了该接口可以使用增强for
```

```java
java.util.Arrays

// Arrays工具类中有个方法 可以将 数组 转为 List   数组 ==> 集合List
public static <T> List<T> asList(T... a)
```

例如：

```java
public static void main(String[] args) {
        // ArrayList 有序、可重复、有索引
        Collection<String> list1 = new ArrayList<>(); // 多态写法，不能调用子类特有方法

        // 添加元素，添加成功返回true
        list1.add("Java");
        list1.add("Java");
        list1.add("HTML");
        list1.add("MySql");
        list1.add("Java");
        // list1.add(23);  // 错误写法，泛型规定了只能添加String类型
       
        // 把集合转换成数组
        Object[] arr = list1.toArray();  // 转为object类型是为了避免暴力反射往集合中添加元素而产生错误
        System.out.println(Arrays.toString(arr));  
}
```

```java
/**
 * 迭代器遍历：就是把容器里的元素全部访问一遍
 * 迭代器是集合的专用遍历形式
 */
public class CollectionTraversal_1 {
    public static void main(String[] args) {
        Collection<String> lists = new ArrayList<>();
        lists.add("宋老狗");
        lists.add("高衙内");
        lists.add("月全食");
        lists.add("夹子");
        System.out.println(lists);

        // 1.得到集合的迭代器对象
        // 返回迭代器对象，迭代器对象的默认指向集合的 -1 索引
        Iterator<String> it = lists.iterator();

        // 2.定义while循环
        // boolean hasNext() 询问当前位置是否有元素，存在返回true
        // E next() 获取当前位置元素，并将迭代器对象移向下一位置
        while (it.hasNext()) {
            String ele = it.next();
            System.out.println(ele);
        }
    }
}
```

### 2.2 Collection中元素的要求

**向Collection中添加的元素要求重写 `equals`方法**，因为Collection中的相关方法（例如：contains()/ remove()）调用时，需要使用元素所在类的`equals`方法

## 3 Iterator(迭代器)接口

### 3.1 Iterator 接口

​	在程序开发中，经常需要遍历集合中的所有元素。针对这种需求，JDK 专门提供了一个接口 `java.util.Iterator`。**Iterator 接口也是 Java 集合中的一员，但它与Collection*、*Map接口有所不同**。 

-   Collection 接口与 Map 接口主要用于存储元素 
-   Iterator，被称为迭代器接口，本身并不提供存储对象的能力，主要用于遍历 Collection 中的元素

​	Collection 接口继承了 `java.lang.Iterable` 接口，该接口有一个 iterator()方法，那么所有实现了 Collection 接口的集合类都有一个 iterator()方法，用以返回一个实现了 Iterator类型的对象（迭代器对象）。 

```java
public Iterator iterator()  // 获取集合对应的迭代器，用来遍历集合中的元素的。 
```

集合对象每次调用 iterator()方法都得到一个全新的迭代器对象，默认游标都在集合的第一个元素之前。 

**迭代器使用格式**

```java
Iterator<T> it = lists.iterator();

while (it.hasNext()) {
    T ele = it.next();
    System.out.println(ele);
}
```

Iterator 接口的包含如下四个方法: 

```java
package java.util;

public interface Iterator<E> {
   
    boolean hasNext();

    E next();

    default void remove()

    default void forEachRemaining(Consumer<? super E> action)
   
}
```

```java
public E next()  // 通过反复调用next()方法，可以逐个遍历集合中的每个元素
```

注意：

​	在调用 it.next()方法之前必须要调用 it.hasNext()进行检测。若不调用，且下一条记录无效，直接调用 it.next()会抛出 `NoSuchElementException` 异常，因此在调用next()方法之前，需要先调用hasNext()方法。

```java
public boolean hasNext()  // 如果仍有元素可以迭代，则返回 true。 
```

```java
// 使用 Iterator 迭代器删除元素：java.util.Iterator 迭代器中有一个方法
void remove() 
```

注意： 

​	Iterator 可以删除集合的元素，但是遍历过程中通过迭代器对象的 remove 方法，不是集合对象的 remove 方法。 

​	如果还未调用 next()或在上一次调用 next() 方法之后已经调用了 remove() 方法，再调用 remove()都会报 

`IllegalStateException`。 

### 3.2 Iterator的 remove()

 	Collection 已经有 remove(xx)方法了，为什么 Iterator 迭代器还要提供删除方法呢？因为迭代器的 remove()可以按指定的条件进行删除。



```java
// 在 JDK8.0 时，Collection 接口有了 removeIf 方法，即可以根据条件删除
default boolean removeIf(Predicate<? super E> filter) 
```

### 3.3 foreach 循环

foreach 循环（也称增强 for 循环）是 **JDK5.0** 中定义的一个高级 for 循环，专门用来 **遍历数组和集合** 的。 

foreach 循环的语法格式：

```java
for(元素的数据类型 局部变量 : Collection集合 或 数组){
	// 操作局部变量的输出操作
}
// 这里局部变量就是一个临时变量，自己命名就可以
```

说明：

​	针对集合来说，**编译器简单地将 foreach循环 转换为带有迭代器的循环**。（即foreach的底层是迭代器）

​	**foreach循环，可以处理任何实现了  `Iterable<T>` 接口的对象**，这个接口只包含了一个抽象方法：

```java
package java.lang;

public interface Iterable<T> {

    Iterator<T> iterator();
}
```

​	**Collection接口继承了 Iterable 接口。因此，对于标准库中的任何集合都可以使用foreach循环。**当然，也可以不使用循环，而使用 forEachRemaining(Consumer<? super E> action) 方法，并提供一个Lambda表达式以达到遍历的效果，如：

```java
iterator.forEachRemaining(element -> 略)
```

​	增强for循环的执行过程中，是将集合或数组中的元素依次赋值给临时的变量。**注意，循环体中对临时变量的修改，可能不会导致原有数组或集合中元素的修改。**例如，如下就是一个修改不成功的案例：

```java
@Test
public void test22(){
    String[] arr = new String[]{"AA","BB","CC"};
    System.out.println(Arrays.toString(arr));  // [AA, BB, CC]
    for (String s :arr){
        s ="c";
    }
    System.out.println(Arrays.toString(arr));  // [AA, BB, CC]
}
```

## 4 Collection 子接口 ：List  

### **4.1 List 接口特点**

-   鉴于 Java 中数组用来存储数据的局限性，我们通常使用 `java.util.List` 替代数组 
-   List 集合类中元素**有序、且可重复**，集合中的每个元素都有其对应的顺序索引。 
-   JDK API 中 List 接口的实现类常用的有：*ArrayList*、*LinkedList* 和 *Vector*。 

### 4.2 关于 ListIterator接口

 ListIterator接口扩展了 List的 Iterator。通过扩展的previous()、hasPrevious()方法使得可以从前向后遍历。

```java
public interface ListIterator<E> extends Iterator<E>
```

### List 接口方法

List 除了从 Collection 集合继承的方法外，List 集合里添加了一些根据索引来操作集合元素的方法。 

**插入元素** 

```java
void add(int index, E element)  // 在 index 位置插入 element 元素 

boolean addAll(int index, Collection<? extends E> c)  // 从 index 位置开始将 c 中的所有元素添加进来 
```

**获取元素** 

```java
E get(int index)  // 获取指定 index 位置的元素 
    
List<E> subList(int fromIndex, int toIndex)  // 返回从 fromIndex 到 toIndex 位置的子集合 
```

**获取元素索引** 

```java
int indexOf(Object obj)  // 返回 obj 在集合中首次出现的位置 
    
int lastIndexOf(Object o)  // 返回 obj 在当前集合中末次出现的位置 
```

 **删除和替换元素** 

```java
E remove(int index)  // 移除指定 index 位置的元素，并返回此元素 
boolean remove(Object o)  // 移除指定元素
    
E set(int index, E element)   // 设置指定 index 位置的元素为 ele 
```

```java
public class ArrayListDemo1 {
    public static void main(String[] args) {
        // 创建一个ArrayList集合对象
        List<String> list = new ArrayList<>();  // List 有序 可重复 有索引

        list.add("Java");
        list.add("Java");
        list.add("MySQL");
        list.add("MySQL");

        // 插入：在某个索引处添加元素
        list.add(2,"HTML");
        System.out.println(list);

        // 移除指定索引处元素
        list.remove(2);
        System.out.println(list);

        // 获取指定索引处元素
        System.out.println(list.get(2));

        // 修改指定索引处的值(返回值为修改前的数据)
        System.out.println(list.set(1, "高斯林"));
        System.out.println(list);

        // 跟size()方法一起用来遍历的
        for(int i = 0;i<list.size();i++){
            System.out.println(list.get(i));
        }

        // 还可以使用增强 for 
        for (String string : list) {
            System.out.println(string);
        }
    }
}
```

:::warning

​在 JavaSE 中 List 名称的类型有两个，一个是 `java.util.List` 集合接口，一个是 `java.awt.List` 图形界面的组件，别导错包了。

:::


### List 接口主要实现类：ArrayList

ArrayList 是 List 接口的主要实现类

本质上，ArrayList 是对象引用的一个**”变长”数组** 

 Arrays.asList(…) 方法返回的 List 集合，既不是 ArrayList 实例，也不是 Vector 实例。 Arrays.asList(…) 返回值是一个固定长度的 List 集合 

```java
java.util.Arrays

public static <T> List<T> asList(T... a)
```


### List 的实现类之二：LinkedList 

​	LinkedList 是 Java 中的一个双向链表实现的数据结构，它实现了 List 接口和 Deque 接口。与 ArrayList 不同，LinkedList 不是基于数组实现的，而是通过链表连接节点来存储和访问元素。

LinkedList 的特点包括：

-   **链表结构**：LinkedList 内部使用双向链表来存储元素，每个节点包含一个指向前一个节点和后一个节点的引用。这使得在插入和删除元素时具有较好的性能，但在**随机访问元素时性能较差**。
-   **可以在任意位置插入和删除元素**：由于 LinkedList 是基于链表实现的，因此可以在任意位置插入和删除元素，而不需要像数组那样进行元素的移动。（增删性能高）
-   **不支持随机访问**：由于 LinkedList 不是基于数组实现的，因此无法通过索引直接访问元素，而是需要从头节点或尾节点开始遍历链表来查找元素。
-   **支持双向遍历**：LinkedList 实现了**双向链表**，可以从头到尾或从尾到头遍历链表。

**特有方法**： 

```java
public void addFirst(E e)  // 在链表头部添加元素
public void push(E e)  // 就是addFirst(E e)的包装
```

```java
public void addLast(E e)  // 在链表末尾添加元素
```

```java
public E getFirst()
```

```java
public E getLast() 
```

```java
public E removeFirst()  // 移除并返回链表的第一个元素
public E pop()  // 就是removeFirst()的包装
```

```java
public E removeLast()  // 移除并返回链表的最后一个元素
```

例如：

```java
public class LinkedListDemo1 {
    public static void main(String[] args) {
        // 创建一个LinkedList集合对象

        // 栈
        LinkedList<String> stack = new LinkedList<>();

        // 入栈
        stack.addFirst("java1");
        stack.addFirst("java2");
        stack.addFirst("java3");
       /* public void push(E e) {
            addFirst(e);
        }*/
        // push 底层使用的就是 addFirst(e)
        stack.push("java4");
        System.out.println(stack);

        // 出栈
        System.out.println(stack.removeFirst());
        /*public E pop() {
            return removeFirst();
        }*/
        // pop 底层使用的就是  removeFirst
        System.out.println(stack.pop());
        System.out.println(stack);

        // 队列
        LinkedList<String> queue = new LinkedList<>();

        // 入队
        queue.addLast("mysql1");
        queue.addLast("mysql2");
        queue.addLast("mysql3");

        stack.offerLast("mysql4");
        System.out.println(queue);

        // 出队
        System.out.println(queue.removeFirst());
        System.out.println(queue);
    }
}
```

### List 的实现类之三：Vector 

 Vector 是一个古老的集合，JDK1.0 就有了。Vector 是 Java 中的一个动态数组实现的数据结构，它实现了 List 接口。与 ArrayList 类似，Vector 也是基于数组实现的，但它是线程安全的，支持同步访问。

在各种 List 中，最好把 ArrayList 作为默认选择。当插入、删除频繁时，使用LinkedList；Vector 总是比ArrayList 慢，所以尽量避免使用。 

Vector 的特点包括：

-   **动态数组**：Vector 内部使用数组来存储元素，可以根据需要自动调整数组的大小。当元素数量超过当前数组容量时，Vector 会自动增加数组的大小。
-   **线程安全**：Vector 是线程安全的，支持多线程环境下的并发访问。它的方法都使用了 synchronized 关键字来保证线程安全，但这也导致了一定的性能损失。
-   **支持随机访问**：由于 Vector 是基于数组实现的，因此可以通过索引直接访问元素，具有较好的随机访问性能。
-   **可以在任意位置插入和删除元素**：与 ArrayList 类似，Vector 也可以在任意位置插入和删除元素。但由于需要调整数组的大小，插入和删除元素的性能较差。

**特有方法：** 

```java
public synchronized void addElement(E obj)  // 在 Vector 的末尾添加元素
```

```java
public synchronized void insertElementAt(E obj, int index)  // 在指定位置插入元素
```

```java
public synchronized void setElementAt(E obj, int index)
```

```java
public synchronized boolean removeElement(Object obj)   // 移除指定元素
```

```java
public synchronized void removeAllElements()
```

例如：

```java
public class VectorDemo {
    public static void main(String[] args) {
        Vector<String> vector = new Vector<>();
        // 添加元素
        vector.addElement("Apple");
        vector.addElement("Banana");
        vector.addElement("Orange");
        System.out.println(vector);  // [Apple, Banana, Orange]

        // 在指定位置插入元素
        vector.insertElementAt("Grapes", 1);
        System.out.println(vector);  // [Apple, Grapes, Banana, Orange]
        // 获取指定位置的元素
        String element = vector.get(2);
        System.out.println("Element at index 2: " + element);

        // 移除指定元素
        vector.removeElement("Apple");
        System.out.println(vector);  // [Grapes, Banana, Orange]
        // 移除指定位置的元素
        vector.remove(1);
        System.out.println(vector);  // [Grapes, Orange]

        // 遍历 Vector
        for (String fruit : vector) {
            System.out.println(fruit);
        }
    }
}
```

## Collection 子接口 ：Set  

-   Set 接口是 Collection 的子接口，**Set 接口相较于 Collection 接口没有提供额外的方法** （依然还是Collection中的15个抽象方法）	

-   Set 集合不允许包含相同的元素，如果试把两个相同的元素加入同一个 Set 集合中，则添加操作失败。 

-   Set 集合支持的遍历方式和 Collection 集合一样：foreach 和 Iterator。 

-   Set 的常用实现类有：HashSet、TreeSet、LinkedHashSet（HashSet的子类）

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

-   要求元素所在的类重写两个方法 hashCode() equals() 
-   同时，要求hashCode() 和 equals() 要保持一致性，IDEA自动生成的即可保持一致。

**TreeSet 判断元素使用相同的标准**

-   不再是考虑 hashCode() 和 equals() ，也就意味着添加到TreeSet中的元素所在的类不需要重写hashCode() 和 equals()
-   比较元素大小或是比较元素是否相等的标准就是考虑自然排序或定制排序中，compareTo() 或 compare() 的返回值

-   **如果compareTo() 或 compare() 的返回值为0，则认为两个对象是相等的。**由于TreeSet中不能存放相同的元素，则后一个元素就无法成功添加到 TreeSet中。


### Set 主要实现类：HashSet

-   HashSet 是 Java 中的一个集合实现，它实现了 Set 接口。**HashSet 是基于哈希表实现的（底层使用的是HashMap）**，大多数时候使用 Set 集合时都使用这个实现类。 （主要是应用场景是用于过滤数据）

-   HashSet 按 Hash 算法来存储集合中的元素，因此具有很好的存储、查找、删除性能。 

-   HashSet 具有以下特点：
    -   哈希表结构：HashSet 内部使用哈希表来存储元素，每个元素被存储在哈希表的一个桶中。通过哈希函数将元素映射到桶的位置，从而实现快速的插入、删除和查找操作。
    -   不保证元素顺序：HashSet 不保证元素的顺序，**元素的存储顺序可能与插入顺序不同**。
    -   不允许重复元素：HashSet **不允许存储重复的元素**，如果尝试插入重复元素，插入操作将被忽略。
    -   允许存储 null 元素：HashSet 允许存储 null 元素，但**只能存储一个 null 元素**。
    -   HashSet **不是线程安全的** 

-   HashSet 集合**判断两个元素相等**的标准：两个对象通过 **hashCode()** 方法得到的哈希值相等，并且两个对象的 **equals()方法返回值为 true**。 

-   对于存放在 Set 容器中的对象，**对应的类一定要重写 hashCode()和 equals(Object obj)方法**，以实现对象相等规则。即：“相等的对象必须具有相等的散列码”。 

-   HashSet 集合中元素的**无序性，不等同于随机性**。这里的无序性与元素的添加位置有关。具体来说：我们在添加每一个元素到数组中时，具体的存储位置是由元素的hashCode()调用后返回的 hash 值决定的。导致在数组中每个元素不是依次紧密存放的，表现出一定的无序性。 

```java
public class HashSetDemo2 {
    public static void main(String[] args) {
        // Set集合去重的原因 先判断哈希值 在比较equals()
        Set<Student> hashSet = new HashSet<>(); // 无序、可重复、无索引

        Student s1 = new Student("小明", 18);
        Student s2 = new Student("小明", 18);
        Student s3 = new Student("小华", 18);
        Student s4 = new Student("小红", 18);

        hashSet.add(s1);
        hashSet.add(s2);
        hashSet.add(s3);
        hashSet.add(s4);

        System.out.println(hashSet);  //
    }
}

class Student{
    private String name;
    private int age;

    public Student() {
    }

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 省略 equals、hashCode、toString、get、set
}
```

#### HashSet 中添加元素的过程

第 1 步：当向 HashSet 集合中存入一个元素时，HashSet 会调用该对象的 hashCode() 方法得到该对象的 hashCode 值，然后根据 hashCode 值，通过某个散列函数决定该对象在 HashSet 底层数组中的存储位置。 

第 2 步：如果要在数组中存储的位置上没有元素，则直接添加成功。 

第 3 步：如果要在数组中存储的位置上有元素，则继续比较： 

​	如果两个元素的 hashCode 值不相等，则添加成功； 

​	如果两个元素的 hashCode()值相等，则会继续调用 equals()方法： 

​		如果 equals()方法结果为 false，则添加成功。 

 		如果 equals()方法结果为 true，则添加失败。第 2 步添加成功，元素会保存在底层数组中。 

第 3 步两种添加成功的操作，由于该底层数组的位置已经有元素了，则会通过链表的方式继续链接，存储。 


#### 重写 hashCode() 方法的基本原则

-   在程序运行时，同一个对象多次调用 hashCode() 方法应该返回相同的值。 

-   当两个对象的 equals() 方法比较返回 true 时，这两个对象的 hashCode() 方法的返回值也应相等。 

-   对象中用作 equals() 方法比较的 Field，都应该用来计算 hashCode 值。

注意：

​	**如果两个元素的 equals() 方法返回 true，但它们的hashCode() 返回值不相等，hashSet 将会把它们存储在不同的位置，但依然可以添加成功。** 

### 重写 equals()方法的基本原则

-   重写 equals 方法的时候一般都需要同时复写 hashCode 方法。通常参与计算hashCode 的对象的属性也应该参与到 equals()中进行计算。 

-   推荐：开发中直接调用 Eclipse/IDEA 里的快捷键自动重写 equals()和 hashCode()方法即可。 


为什么用 Eclipse/IDEA 复写 hashCode 方法，有 31 这个数字？ 

首先，选择系数的时候要选择尽量大的系数。因为如果计算出来的 hash 地址越大，所谓的“冲突”就越少，查找起来效率也会提高。（减少冲突） 

其次，31 只占用 5bits,相乘造成数据溢出的概率较小。 

再次，31 可以 由 i*31== (i<<5)-1 来表示,现在很多虚拟机里面都有做相关优化。（提高算法效率） 

最后，31 是一个素数，素数作用就是如果我用一个数字来乘以这个素数，那么最终出来的结果只能被素数本身和被乘数还有 1 来整除！(减少冲突) 


### Set 实现类之二：LinkedHashSet

LinkedHashSet 是 Java 中的一个集合实现，它是 **HashSet 的子类**，同时也实现了 Set 接口。与 HashSet 不同，**LinkedHashSet 保持了元素的插入顺序，并且不允许重复元素**

LinkedHashSet 根据元素的 hashCode 值来决定元素的存储位置，但它同时**使用双向链表维护元素的次序**，这**使得元素看起来是以添加顺序保存的。** 

LinkedHashSet 插入性能略低于 HashSet，但在迭代访访问 Set 里的全部元素时有很好的性能。 

LinkedHashSet 的特点包括：

-   哈希表结构：LinkedHashSet 内部使用哈希表来存储元素，每个元素被存储在哈希表的一个桶中。通过哈希函数将元素映射到桶的位置，从而实现快速的插入、删除和查找操作。
-   **保持插入顺序**：LinkedHashSet 会维护元素的插入顺序，即元素被添加到集合中的顺序将被保留。
-   **不允许重复元素**：LinkedHashSet 不允许存储重复的元素，如果尝试插入重复元素，插入操作将被忽略。
-   允许存储 null 元素：LinkedHashSet 允许存储 null 元素，**但只能存储一个 null 元素**。

LinkedHashSet 的常用方法与 HashSet 相同。

```java
public class LinkedHashSetDemo2 {
    public static void main(String[] args) {
        Set<String> linkedHashSet = new LinkedHashSet<>(); // 有序、可重复、无索引
        linkedHashSet.add("Java");
        linkedHashSet.add("Java");
        linkedHashSet.add("Mybatis");
        linkedHashSet.add("MySQL");
        linkedHashSet.add("MySQL");
        linkedHashSet.add("JS");
        linkedHashSet.add("JS");
        linkedHashSet.add("Apple");


        System.out.println(linkedHashSet);  // [Java, Mybatis, MySQL, JS, Apple]
    }
}
```

### Set 实现类之三：TreeSet

-   TreeSet 是 SortedSet 接口的实现类，**TreeSet 可以按照添加的元素的指定的属性的大小顺序进行遍历**。 

-   TreeSet 底层使用**红黑树结构**存储数据 


-   新增的方法如下： (了解)  

    -   ```java
        public Comparator<? super E> comparator()
        ```

    -   ```java
        public E first()
        public E last()   
        ```

    -   ```java
        public E lower(E e) 
        public E higher(E e)    
        ```

    -   ```java
        public SortedSet<E> subSet(E fromElement, E toElement) 
        ```

    -   ```java
        public SortedSet<E> headSet(E toElement)
        ```

    -   ```java
        public SortedSet<E> tailSet(E fromElement)
        ```

-   TreeSet 特点：**不允许重复、实现排序**（自然排序或定制排序） 


-   TreeSet 两种排序方法：**自然排序**和**定制排序**。默认情况下，TreeSet 采用自然排序。 
    -   自然排序：TreeSet 会调用集合元素的 compareTo(Object obj) 方法来比较元素之间的大小关系，然后将集合元素按升序(默认情况)排列。  
        -   如果试图把**一个对象添加到 TreeSet 时，则该对象的类必须实现 Comparable 接口**。 
        -   实现 Comparable 的类必须实现 compareTo(Object obj) 方法，两个对象即通过 compareTo(Object obj) 方法的返回值来比较大小。 
    -   定制排序：**如果元素所属的类没有实现 Comparable 接口**，或不希望按照升序(默认情况)的方式排列元素或希望按照其它属性大小进行排序，则考虑使用定制排序。定制排序，**通过 Comparator 接口来实现**。需要重写 compare(T o1,T o2)方法。 
        -   利用 int compare(T o1,T o2)方法，比较 o1 和 o2 的大小：如果方法返回正整数，则表示 o1 大于 o2；如果返回 0，表示相等；返回负整数，表示 o1 小于 o2。 
        -   要实现定制排序，需要将实现 Comparator 接口的实例作为形参传递给 TreeSet 的构造器。 

-   因为只有相同类的两个实例才会比较大小，所以向 TreeSet 中添加的应该是同一个类的对象。 

**TreeSet 判断元素使用相同的标准**

-   不再是考虑 hashCode() 和 equals() ，也就意味着添加到TreeSet中的元素所在的类不需要重写hashCode() 和 equals()
-   比较元素大小或是比较元素是否相等的标准就是考虑自然排序或定制排序中，compareTo() 或 compare() 的返回值

-   **如果compareTo() 或 compare() 的返回值为0，则认为两个对象是相等的。**由于TreeSet中不能存放相同的元素，则后一个元素就无法成功添加到 TreeSet中。

**要求：添加进入 TreeSet的元素必须是，同样的类型，否则报错 `ClassCastException**`

例如：

默认的自然排序

```java
import java.util.Iterator;
import java.util.TreeSet;

// 演示自然排序，String类实现了Comparable接口
public class TreeSetDemo1 {
    public static void main(String[] args) {
        TreeSet set = new TreeSet();
        set.add("MM");
        set.add("CC");
        set.add("AA");
        set.add("DD");
        set.add("ZZ");
        // set.add(123);  // 报错 ClassCastException，因为对应 TreeSet而言，添加时必须是同样的类型

         
        Iterator iterator = set.iterator();
        while (iterator.hasNext()){
            System.out.println(iterator.next());
        }
    }
}
```

定制的排序

```java
import java.util.*;
// 演示定义排序，使用匿名子类的方式实现 Comparator接口
public class TreeSetDemo2 {
    @Test
    public void test() {
        TreeSet<User> set = new TreeSet(new Comparator() {
            // 定制排序：按照姓名从小到大排序，姓名相同，按照年龄从小到大排序
            @Override
            public int compare(Object o1, Object o2) {
                if (o1 instanceof User && o2 instanceof User){
                    User u1 = (User) o1;
                    User u2 =(User) o2;
                    int value = u1.getName().compareTo(u2.getName());
                    if (value != 0){
                        return value;
                    }
                    return u1.getAge() - u2.getAge();
                }
                throw new RuntimeException("类型不匹配");
            }
        });
        User u1 = new User("Tom", 23);
        User u2 = new User("Jerry", 30);
        User u3 = new User("Rose", 16);
        User u4 = new User("Jack", 18);
        User  u5 = new User("Tony", 18);

        Collections.addAll(set, u1, u2, u3, u4, u5);

        Iterator<User> iterator = set.iterator();
        // 遍历TreeSet集合，因为Collection接口实现了Iterable接口，所有可以使用 forEachRemaining 遍历集合
        iterator.forEachRemaining((user) -> System.out.println(user));
    }
}


class User  {
    private String name;
    private int age;

    public User() {
    }

    public User(String name, int ahe) {
        this.name = name;
        this.age = ahe;
    }

 	// 省略了get、set、toString方法
    // 存入TreeSet集合中的元素所在的类不需要 equals、hashCode方法
}
```



##  Map 接口  

​	现实生活与开发中，我们常会看到这样的一类集合：用户 ID 与账户信息、学生姓名与考试成绩、IP 地址与主机名等，这种一一对应的关系，就称作映射。Java 提供了专门的集合框架用来存储这种映射关系的对象，即 `java.util.Map` 接口。 

### Map 接口概述

Map 接口：用于存储具有映射关系“key-value 对”的集合，即一对一对的数据，也称双列数据集合。(类似于高中的函数、映射。(x1,y1),(x2,y2) ---> y = f(x) ) 

-   HashMap(主要实现类)、LinkedHashMap、TreeMap、Hashtable、Properties

-   ```java
    java.util.Map
    	HashMap：主要实现类；线程不安全，效率高；可以添加null的key和value
    				底层：数组+单向链表+红黑树存储结构（JDK8）
    		LinkedHashMap：是HashMap的子类；在HashMap的数据结构基础上，增加了一对双向链表，用于记录添加的元素的先后顺序，进而在我们遍历时，就可以按照添加的顺序显示
            开发中，需要频繁遍历建议使用此类
            
    	Hashtable：古老实现类；线程安全，效率低；不可以添加null的key和value
    				底层：数组+单向链表存储结构（JDK8）
    		Properties：是Hashtable的子类，其key-value都是String类型，常用于读取属性文件
    		
    	TreeMap：底层使用红黑树存储；可以按照添加的key-value中的key元素指定的属性的大小进行遍历。
    			需要考虑使用 	自然排序、定制排序
    ```
    
-   **Map 与 Collection 并列存在**。用于保存具有*映射关系*的数据：key-value 
-   **Collection** 集合称为**单列集合**，元素是孤立存在的（理解为单身）。 
-   **Map** 集合称为**双列集合**，元素是成对存在的(理解为夫妻)。 
-   Map 中的 key 和 value 都可以是任何引用类型的数据。但常用 String 类作为 Map的“键”。 

**注意：**
::: warning 注意
- `HashMap`：可以添加null的key和value，但是null的key只能有一个，null的value可以有多个。

- ​`Hashtable`：不可以添加null的key和value

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

### Map 中 key-value 特点 

-   这里主要以 HashMap 为例说明。HashMap 中存储的 key、value 的特点如下：
-   Map 中的 **key用Set来存放，不允许重复**（所有的key构成一个Set集合），即同一个 Map 对象所对应的类，**须重写 hashCode()和 equals()**方法 
    -   **key所在的类要重写 hashCode()和 equals()方法** 
-   key 和 value 之间存在单向一对一关系，即通过指定的 key 总能找到唯一的、确定的 value，不同 key 对应的 **value 可以重复**。
    -   所有的value构成一个Collection集合，**value 所在的类要重写 equals()方法。** 
-   **key 和 value 构成一个 entry**。所有的 **entry** 彼此之间是**无序的、不可重复的**。 



### Map 接口的常用方法

#### 添加、修改操作： 

```java
// 将指定 key-value 添加到(或修改)当前 map 对象中 
V put(K key, V value)

// 注意：
    map集合中键是唯一的，如果对同一个键两次调用put，则第二个值覆盖前一个。并且返回前一个存储的值
    该方法即是插入，也是修改方法
    
// @since 1.8   
default V replace(K key, V value)    // replace底层调用的依然是put方法
```

```java
// 将 m 中的所有 key-value 对存放到当前 map 中
void putAll(Map<? extends K, ? extends V> m)
```

```java
// 只要当键原先存在时才会放入一个值
// @since 1.8
default V putIfAbsent(K key, V value)
```

例如：

```java
// 简单版词频统计
String[] words = {"hello", "world", "hello"};
Map<String, Integer> counts = new HashMap<>();
for (String word : words) {
    // 这种方式第一次counts.get(word)会返回null，所以返回返回 NullPointerException
    // counts.put(word, counts.get(word) + 1);
    // 补救方法
    // counts.put(word,counts.getOrDefault(word,0)+1);
    // 另一种方法
    counts.putIfAbsent(word,0);
    counts.put(word, counts.get(word) + 1);
    // 更优秀的方法
    counts.merge(word,1,Integer::sum);
}
```

#### 删除操作

```java
// 移除指定 key 的 key-value 对，并返回 value 
V remove(Object key)
```

```java
// 清空当前 map 中的所有数据
void clear()
```

####  元素查询的操作

```java
// 获取指定 key 对应的 value，不存在则返回null 
V get(Object key)

// @since 1.8
// 获取指定 key 对应的 vlaue，不存在则返回默认值    
default V getOrDefault(Object key, V defaultValue)     
```

```java
// 是否包含指定的 key 
boolean containsKey(Object key)
    
// 是否包含指定的 value 
boolean containsValue(Object value)
```

```java
// 返回 map 中 key-value 对的个数
int size()
```

```java
// 判断当前 map 是否为空 
boolean isEmpty()
```

```java
// 判断当前 map 和参数对象 obj 是否相等 
boolean equals(Object o)
```



```java
// @since 1.8
// 如果key与一个非null值v关联，将函数应用到v 和 value，将key 与 结果关联，或者如果结果为null，则删除这个键。否则，将key与 value 关联，返回get(key)
default V merge(K key, V value,
            BiFunction<? super V, ? super V, ? extends V> remappingFunction)
    
// @since 1.8
// 将函数应用到key 和get(key)，将key 与 结果关联，或者如果结果为null，则删除这个键。返回get(key)  
default V compute(K key,
            BiFunction<? super K, ? super V, ? extends V> remappingFunction)   
    
// @since 1.8
// 如果key与一个非null值v关联，将函数应用到key 和 v，将key 与 结果关联，或者如果结果为null，则删除这个键。返回get(key) 
default V computeIfPresent(K key,
            BiFunction<? super K, ? super V, ? extends V> remappingFunction)
    
// @since 1.8
//  将函数应用到key 和get(key)，除非key与一个非null值关联。将key 与 结果关联，或者如果结果为null，则删除这个键。返回get(key) 
default V computeIfAbsent(K key,
            Function<? super K, ? extends V> mappingFunction)
    
// @since 1.8
// 将所以映射项应用上函数。将键与一个非null值关联，对于null结果，则将相应的键删除 
default void replaceAll(BiFunction<? super K, ? super V, ? extends V> function)
```

#### 元视图操作的方法

```java
// 返回所有 key 构成的 Set 集合 
// 可以从这个集中删除元素，但是不能增加元素，否则抛出 UnsupportedOperationException
Set<K> keySet()
// 说明：keySet不是HashSet或TreeSet，而是实现类Set接口的某个类的对象    
    
// 返回所有 value 构成的 Collection 集合 
// 可以从这个集中删除元素，但是不能增加元素，否则抛出 UnsupportedOperationException
Collection<V> values()    
```

```java
// 返回所有 key-value 对构成的 Set 集合 
Set<Map.Entry<K, V>> entrySet()
// 可以从这个集中删除元素，但是不能增加元素，否则抛出 UnsupportedOperationException
    
    
interface Entry<K,V> 接口中的常用方法
K getKey();	// 返回键
V getValue();	// 返回值
V setValue(V value);	// 将相关映射中的值改为新值，并返回原来的值
```

例如：

```java
// 这是JDK8以前同时查看键和值的好方式
for(Map.Entry<String, Empoyeel> entry: staff.entrtSet()){
	String k = entry.getKey;
    Employee v = entry.getValue();
    // ...
}
// JDK8开始，我们可以使用forEach方法来实现了
```


#### 遍历

```java
// 要想遍历一个map集合，最简单的方式就是forEach方法
// @since 1.8
default void forEach(BiConsumer<? super K, ? super V> action) 
```

例如：

```java
scores.forEach((k,v) ->
	System.out.println("key=" + k + ", value=" + v));
```


### Map 的主要实现类：HashMap

HashMap 是 Map 接口使用频率最高的实现类。

-   HashMap 是**线程不安全**的。**允许添加 null 键和 null 值**。 

-   存储数据采用的哈希表结构，底层使用**一维数组+单向链表+红黑树**进行 key-value数据的存储。与 HashSet 一样，元素的存取顺序不能保证一致。 

-   HashMap **判断两个 key 相等的标准**是：**两个 key 的 hashCode 值相等，通过 equals() 方法返回 true**。 

-   HashMap **判断两个 value 相等的标准**是：**两个 value 通过 equals() 方法返回true**。 


HashMap的**特点**包括：

-   键值对的存储是无序的。
-   允许使用null作为键和值。
-   不支持同一个键对应多个值的情况

**HashMap常用构造器**

```java
public HashMap()
public HashMap(int initialCapacity)
// 用指定的容量和装填因子（0.0~1.0）构造一个空的hashMap。默认的装填因子为0.75    
public HashMap(int initialCapacity, float loadFactor)    
    
// 装填因子决定了散列表存放数据的百分比，一旦大于则如果扩容。   
```

例如： 

```java
public class SingerTest1 {
    public static void main(String[] args) {
        //创建一个 HashMap 用于保存歌手和其歌曲集
        HashMap singers = new HashMap();
        //声明一组 key,value
        String singer1 = "周杰伦";
        ArrayList songs1 = new ArrayList();
        songs1.add("双节棍");
        songs1.add("本草纲目");
        songs1.add("夜曲");
        songs1.add("稻香");
        //添加到 map 中
        singers.put(singer1,songs1);
        //声明一组 key,value
        String singer2 = "陈奕迅";
        List songs2 = Arrays.asList("浮夸", "十年", "红玫瑰", "好久不见", "孤勇者");
        //添加到 map 中
        singers.put(singer2,songs2);
        //遍历 map
        Set entrySet = singers.entrySet();
        for(Object obj : entrySet){
            Map.Entry entry = (Map.Entry)obj;
            String singer = (String) entry.getKey();
            List songs = (List) entry.getValue();
            System.out.println("歌手：" + singer);
            System.out.println("歌曲有：" + songs);
        }
    }
}

//方式 2：改为 HashSet 实现
public class SingerTest2 {
    @Test
    public void test1() {
        Singer singer1 = new Singer("周杰伦");
        Singer singer2 = new Singer("陈奕迅");
        Song song1 = new Song("双节棍");
        Song song2 = new Song("本草纲目");
        Song song3 = new Song("夜曲");
        Song song4 = new Song("浮夸");
        Song song5 = new Song("十年");
        Song song6 = new Song("孤勇者");
        HashSet h1 = new HashSet();// 放歌手一的歌曲
        h1.add(song1);
        h1.add(song2);
        h1.add(song3);
        HashSet h2 = new HashSet();// 放歌手二的歌曲
        h2.add(song4);
        h2.add(song5);
        h2.add(song6);
        HashMap hashMap = new HashMap();// 放歌手和他对应的歌曲
        hashMap.put(singer1, h1);
        hashMap.put(singer2, h2);
        for (Object obj : hashMap.keySet()) {
            System.out.println(obj + "=" + hashMap.get(obj));
        }
    }
}
//歌曲
public class Song implements Comparable{
    private String songName;//歌名
    public Song() {
        super();
    }
    public Song(String songName) {
        super();
        this.songName = songName;
    }
    public String getSongName() {
        return songName;
    }
    public void setSongName(String songName) {
        this.songName = songName;
    }
    @Override
    public String toString() {
        return "《" + songName + "》";
    }
    @Override
    public int compareTo(Object o) {
        if(o == this){
            return 0;
        }
        if(o instanceof Song){
            Song song = (Song)o;
            return songName.compareTo(song.getSongName());
        }
        return 0;
    }
}
//歌手
public class Singer implements Comparable{
    private String name;
    private Song song;
    public Singer() {
        super();
    }
    public Singer(String name) {
        super();
        this.name = name;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Song getSong() {
        return song;
    }
    public void setSong(Song song) {
        this.song = song;
    }
    @Override
    public String toString() {
        return name;
    }
    @Override
    public int compareTo(Object o) {
        if(o == this){
            return 0;
        }
        if(o instanceof Singer){
            Singer singer = (Singer)o;
            return name.compareTo(singer.getName());
        }
        return 0;
    }
}
```

例二：

需求：统计字符串中每个字符出现的次数

```java
// char[] arr = str.toCharArray();  // 将字符串转换成字符数组
HashMap hm = new HashMap();  // 创建双列集合存储键和值，键放字符，值放次数
```

```java
public class WordCountTest {
    public static void main(String[] args) {
        String str = "aaaabbbcccccccccc";
        char[] arr = str.toCharArray(); // 将字符串转换成字符数组
        HashMap map = new HashMap(); // 创建双列集合存储键和值
        for (char c : arr) { // 遍历字符数组
            if (!map.containsKey(c)) { // 如果不包含这个键
                map.put(c, 1); // 就将键和值为 1 添加
            } else { // 如果包含这个键
                map.put(c, (int)map.get(c) + 1); // 就将键和值再加 1 添加
                进来
            }
        }
        for (Object key : map.keySet()) { // 遍历双列集合
            System.out.println(key + "=" + map.get(key));
        }
    }
}
```

### Map 实现类之二：LinkedHashMap

LinkedHashMap 是 HashMap 的子类 

存储数据采用的**哈希表结构+链表**结构，在 HashMap 存储结构的基础上，使用了一对 **双向链表**来**记录添加元素的先后顺序**，可以保证遍历元素时，与添加的顺序一致。 

通过哈希表结构可以保证键的唯一、不重复，需要键所在类重写 hashCode()方法、 equals()方法。

```java
public class TestLinkedHashMap {
    {
        LinkedHashMap map = new LinkedHashMap();
        map.put("王五", 13000.0);
        map.put("张三", 10000.0);
        //key 相同，新的 value 会覆盖原来的 value
        //因为 String 重写了 hashCode 和 equals 方法
        map.put("张三", 12000.0);
        map.put("李四", 14000.0);
        //HashMap 支持 key 和 value 为 null 值
        String name = null;
        Double salary = null;
        map.put(name, salary);
        Set entrySet = map.entrySet();
        for (Object obj : entrySet) {
            Map.Entry entry = (Map.Entry)obj;
            System.out.println(entry);
        }
    }
}
```



### Map 实现类之三：TreeMap 

-   TreeMap 存储 key-value 对时，需要根据 key-value 对进行排序。TreeMap 可以保证所有的 key-value 对处于**有序状态**。 
-   TreMap 底层使用**红黑树**结构存储数据 
-   TreeMap 的 Key 的排序： 
    -   **自然排序**：TreeMap 的所有的 Key 必须实现 Comparable 接口，而且所有的 Key 应该是同一个类的对象，否则将会抛出 ClasssCastException 
    -   **定制排序**：创建 TreeMap 时，构造器传入一个 Comparator 对象，该对象负责对 TreeMap 中的所有 key 进行排序。此时不需要 Map 的 Key 实现 Comparable 接口 
-   TreeMap **判断两个key 相等**的标准：**两个 key 通过 compareTo()方法或者 compare()方法返回 0**。 
-   TreeMap不是线程安全的

**TreeMap常用构造器**

```java
// 为实现Comparable接口的键构造一个空的TreeMap
public TreeMap()
// 构造一个TreeMap，并指定一个指定比较器对键进行排序。
public TreeMap(Comparator<? super K> comparator)
// 构造一个TreeMap，并将指定Map集合中的数据加入到这个TreeMap
public TreeMap(Map<? extends K, ? extends V> m)
// 构造一个TreeMap，并将指定SortedMap集合中的数据加入到这个TreeMap
public TreeMap(SortedMap<K, ? extends V> m)
```

**要求：添加进入 TreeSet的元素必须是同样的类型，否则报错 `ClassCastException`**

```java
public class TestTreeMap {
    /*
 * 自然排序举例
 * */
    @Test
    public void test1(){
        TreeMap map = new TreeMap();
        map.put("CC",45);
        map.put("MM",78);
        map.put("DD",56);
        map.put("GG",89);
        map.put("JJ",99);
        Set entrySet = map.entrySet();
        for(Object entry : entrySet){
            System.out.println(entry);
        }
    }
    /*
 * 定制排序
 *
 * */
    @Test
    public void test2(){
        //按照 User 的姓名的从小到大的顺序排列
        TreeMap map = new TreeMap(new Comparator() {
            @Override
            public int compare(Object o1, Object o2) {
                if(o1 instanceof User && o2 instanceof User){
                    User u1 = (User)o1;
                    User u2 = (User)o2;
                    return u1.name.compareTo(u2.name);
                }
                throw new RuntimeException("输入的类型不匹配");
            }
        });
        map.put(new User("Tom",12),67);
        map.put(new User("Rose",23),"87");
        map.put(new User("Jerry",2),88);
        map.put(new User("Eric",18),45);
        map.put(new User("Tommy",44),77);
        map.put(new User("Jim",23),88);
        map.put(new User("Maria",18),34);
        Set entrySet = map.entrySet();
        for(Object entry : entrySet){
            System.out.println(entry);
        }
    }
}
class User implements Comparable{
    String name;
    int age;
    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }
    public User() {
    }
    @Override
    public String toString() {
        return "User{" +
            "name='" + name + '\'' +
            ", age=" + age +
            '}';
    }
    /*
 举例：按照 age 从小到大的顺序排列，如果 age 相同，则按照 name 从大到小的
顺序排列
 * */
    @Override
    public int compareTo(Object o) {
        if(this == o){
            return 0;
        }
        if(o instanceof User){
            User user = (User)o;
            int value = this.age - user.age;
            if(value != 0){
                return value;
            }
            return -this.name.compareTo(user.name);
        }
        throw new RuntimeException("输入的类型不匹配");
    }
}
```

### Map 实现类之四：Hashtable

-   Hashtable 是 Map 接口的**古老实现类**，JDK1.0 就提供了。不同于 HashMap，Hashtable 是**线程安全**的。 

-   Hashtable 实现原理和 HashMap 相同，功能相同。底层都使用哈希表结构（**数组+单向链表**），查询速度快。 

-   与 HashMap 一样，Hashtable 也不能保证其中 Key-Value 对的顺序 

-   Hashtable 判断两个 key 相等、两个 value 相等的标准，与 HashMap 一致。 

-   与 **HashMap 不同，Hashtable 不允许使用 null 作为 key 或 value**。 



#### **面试题：Hashtable 和 HashMap 的区别** 

-   HashMap：底层是一个哈希表（jdk7:数组+链表; jdk8:数组+链表+红黑树，是一个线程不安全的集合，执行效率高 

-   Hashtable：底层也是一个哈希表（数组+链表），是一个线程安全的集合，执行效率低 

-   **HashMap集合，可以存储 null 的键、null 的值** 
-   **Hashtable 集合，不能存储 null 的键、null 的值** 
-   Hashtable 和 Vector 集合一样,在 jdk1.2 版本之后被更先进的集合(HashMap,ArrayList)取代了。所以 HashMap 是 Map 的主要实现类，Hashtable 是 Map 的古老实现类。 

-   Hashtable 的子类 Properties（配置文件）依然活跃在历史舞台 

-   **Properties 集合是一个唯一和 IO 流相结合的集合** 

### Map 实现类之五：Properties

-   Properties是 Java 中的一个类（Hashtable 的子类），用于处理属性文件（.properties文件）。属性文件是一种简单的文本文件，用于存储键值对形式的配置信息
-   **由于属性文件里的 key、value 都是字符串类型**，所以 **Properties 中要求 key 和 value 都是字符串类型** 
-   存取数据时，建议使用 setProperty(String key,String value) 方法和 getProperty(String key) 方法 

Properties类的**特点**如下：

-   继承关系：**Properties类是Hashtable类的子类**，因此它具有Hashtable类的所有方法。
-   键值对存储：Properties类用于存储键值对形式的配置信息，其中**键和值都是字符串类型**。
-   加载和保存属性文件：Properties类提供了 load() 和 store() 方法，用于从属性文件中加载配置信息和将配置信息保存到属性文件中。
-   默认值：**Properties类可以设置默认值**，当获取某个键对应的值时，如果该键不存在，则返回默认值。

Properties类的**常用方法**

Properties类常用于读取和写入配置文件，例如读取应用程序的配置信息、国际化资源文件等

```java
// 加载属性文件，将属性文件中的键值对加载到Properties对象中
public synchronized void load(InputStream inStream) throws IOException 

public synchronized void load(Reader reader) throws IOException
```

```java
// 获取属性值，根据键获取对应的值
public String getProperty(String key)

// 根据键获取对应的值，如果键不存在，则返回默认值 defaultValue 
public String getProperty(String key, String defaultValue)
```

```java
// 设置属性值，设置键值对
public synchronized Object setProperty(String key, String value)
```

```java
// 遍历属性，获取所有的键，并通过getProperty(key)方法获取对应的值
public Enumeration<?> propertyNames()
    
// 返回一个包含所有键的Set集合，这些键对应的值都是字符串类型。
public Set<String> stringPropertyNames()    
```

```java
// 保存属性文件，将Properties对象中的配置信息保存到属性文件中
public void store(OutputStream out, String comments) 
        throws IOException

public void store(Writer writer, String comments)
        throws IOException
// 说明
// 	参数一：输出流，保存数据的管道
//	参数二：注释
```

注意：

​	**Properties类中Key-Value 必须为String类型**

演示：

```java
public class PropertiesDemo1 {
    public static void main(String[] args) throws Exception{
        // todo 需求：使用 Properties 把键值对信息存入到属性文件中
        Properties properties = new Properties();

        // setProperty方法就是 put方法的包装
        properties.setProperty("username","admin");
        properties.setProperty("password","003197");

        System.out.println(properties);  // {password=003197, username=admin}

        /**
            参数一：保存管道  字符输出流管道
            参数二： 注释
         */
        properties.store(new FileWriter("src/users.properties"),"this is users! ");
    }
}
```

```java
/**
 * 目标：Properties读取属性文件中的键值对信息（读取）
 * Properties方法：
 * -- public Object setProperty(String key, String value) 保存一对属性
 * __ public String getProperty(String key)  使用此属性列表中指定的键搜索属性值
 * -- public Set<String> stringPropertyName() 所有键的名称的集合
 * __ public void store(OutputStream out, String comment)  保存数据到属性文件中去
 * -- public synchronized void load(InputStream inStream) 加载属性文件的数据到属性集对象中去
 * __ public synchronized void load(Reader ft) 加载属性文件的数据到属性集对象中去
 * <p>
 * 小结：
 * 属性集对象可以加载读取属性文件中的数据
 */
public class PropertiesDemo2 {
    public static void main(String[] args) throws Exception {
        // todo 需求：Properties读取属性文件中的键值对信息（读取）
        Properties properties = new Properties();
        System.out.println(properties);  // {}

        // todo 加载属性文件中的键值对数据到属性对象 Properties 中去
        properties.load(new FileReader("src/users.properties"));
        System.out.println(properties);  // {password=003197, username=admin}

        // todo 根据键获取属性值，不存在则返回null
        String rs = properties.getProperty("hei");
        System.out.println(rs);  // null
        String rs2 = properties.getProperty("username");
        System.out.println(rs2);  // admin
        // todo 根据键获取属性值，不存在则返回返回默认值
        String rs3 = properties.getProperty("hei", "不存在");
        System.out.println(rs3);// 不存在
        // todo 设置属性值
        properties.setProperty("password", "123456");

        // todo 遍历属性值
        Enumeration<?> keys = properties.propertyNames();
        while (keys.hasMoreElements()) {
            String key = (String) keys.nextElement();
            String value = properties.getProperty(key);
            System.out.println(key + "=" + value);
        }
        Set<String> keys2 = properties.stringPropertyNames();
        // 注意：Collection接口实现了Iterable，其所有子类都可以使用 foreach循环
        for (String key : keys2) {
            String value = properties.getProperty(key);
            System.out.println(key + "=" + value);
        }

    }
}
```

### SortedMap接口

抽象方法

```java
// 返回对键进行排序的比较器。
// 如果键是用Comparable接口的compareTO方法进行比较的，返回null
Comparator<? super K> comparator()
```

```java
// 返回map中最大元素和最小元素
K firstKey();

K lastKey();
```

