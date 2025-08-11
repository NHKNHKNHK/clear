# Java中Set有哪些常见实现类？

-   Set 接口是 Collection 的子接口，**Set 接口相较于 Collection 接口没有提供额外的方法** （依然还是Collection中的15个抽象方法）	
-   Set集合用于存储**无序**（无序是指存入和取出的顺序不一定相同）、**不重复**的元素
-   Set 集合不允许包含相同的元素，如果试把两个相同的元素加入同一个 Set 集合中，则添加操作失败。 
-   Set 集合支持的遍历方式和 Collection 集合一样：foreach 和 Iterator。 
-   Set 的常用实现类有：HashSet、TreeSet、LinkedHashSet（HashSet的子类）

## Set集合的特点

**无序性**

-   无序性 != 随机性
-   添加元素的顺序和遍历元素的顺序不一致，这是不是无须性呢？NO
-   到底什么是无序性？与添加的元素的位置有关，不像ArrayList一样是紧密排序的。
-   这里是根据添加元素的Hash值，计算其在数组中的存储位置。此位置不是依次紧密排序的，表现为无序性。

**HashSet、LinkedHashSet中元素不可重复性**

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

## HashSet

-   HashSet是Set接口的一个实现类，它**基于哈希表实现（底层使用的是HashMap（HashMap底层在JDK8及之后是数组+链表（长度>8 红黑树）））**  （主要是应用场景是用于过滤数据）

-   HashSet 按 Hash 算法来存储集合中的元素，因此具有很好的存储、查找、删除性能。 
-   HashSet 具有以下特点：
    -   **哈希表结构**：HashSet 内部使用哈希表来存储元素，每个元素被存储在哈希表的一个桶中。通过哈希函数将元素映射到桶的位置，从而实现快速的插入、删除和查找操作。
    -   **不保证元素顺序**：HashSet 不保证元素的顺序，**元素的存储顺序可能与插入顺序不同**。
    -   **不允许重复元素**：HashSet **不允许存储重复的元素**，如果尝试插入重复元素，插入操作将被忽略。
    -   **允许存储 null 元素**：HashSet 允许存储 null 元素，但**只能存储一个 null 元素**。（遵循HashMap）
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

## LinkedHashSet

-   LinkedHashSet是**HashSet的子类**，同时也实现了 Set 接口。与 HashSet 不同，**LinkedHashSet 保持了元素的插入顺序，并且不允许重复元素**

-   它基于哈希表和双向链表实现，继承于 HashSet、又基于 LinkedHashMap 来实现的。 根据元素的 hashCode 值来决定元素的存储位置，但它同时**使用双向链表维护元素的次序**，这**使得元素看起来是以添加顺序保存的。** **相比于 HashSet 增加了顺序性**。

-   LinkedHashSet 插入性能略低于 HashSet，但在将元素按照插入的顺序进行迭代迭代访问 Set 里的全部元素时有很好的性能。同时继承了HashSet的所有特性。

-   LinkedHashSet 的特点包括：
    -   **哈希表结构**：LinkedHashSet 内部使用哈希表来存储元素，每个元素被存储在哈希表的一个桶中。通过哈希函数将元素映射到桶的位置，从而实现快速的插入、删除和查找操作。
    -   **保持插入顺序**：LinkedHashSet 会维护元素的插入顺序，即元素被添加到集合中的顺序将被保留。
    -   **不允许重复元素**：LinkedHashSet 不允许存储重复的元素，如果尝试插入重复元素，插入操作将被忽略。
    -   **允许存储 null 元素**：LinkedHashSet 允许存储 null 元素，**但只能存储一个 null 元素**。

## TreeSet

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

### 扩展

-   TreeSet 两种排序方法：**自然排序**和**定制排序**。默认情况下，TreeSet 采用自然排序。 
    -   自然排序：TreeSet 会调用集合元素的 compareTo(Object obj) 方法来比较元素之间的大小关系，然后将集合元素按升序(默认情况)排列。  
        -   如果试图把**一个对象添加到 TreeSet 时，则该对象的类必须实现 Comparable 接口**。 
        -   实现 Comparable 的类必须实现 compareTo(Object obj) 方法，两个对象即通过 compareTo(Object obj) 方法的返回值来比较大小。 
    -   定制排序：**如果元素所属的类没有实现 Comparable 接口**，或不希望按照升序(默认情况)的方式排列元素或希望按照其它属性大小进行排序，则考虑使用定制排序。定制排序，**通过 Comparator 接口来实现**。需要重写 compare(T o1,T o2)方法。 
        -   利用 int compare(T o1,T o2)方法，比较 o1 和 o2 的大小：如果方法返回正整数，则表示 o1 大于 o2；如果返回 0，表示相等；返回负整数，表示 o1 小于 o2。 
        -   要实现定制排序，需要将实现 Comparator 接口的实例作为形参传递给 TreeSet 的构造器。 

## 适用场景

-   `HashSet`：适用于需要快速查找的场景，不保证元素的顺序。
-   `LinkedHashSet`：适用于需要保持元素插入顺序的场景。
-   `TreeSet`：适用于需要元素排序的场景。


