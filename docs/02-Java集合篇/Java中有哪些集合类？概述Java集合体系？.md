# Java中有哪些集合类？概述Java集合体系？

## 口语化

从数据结构的角度来讲，Java的整个集合框架中，主要分为`List`、`Set`、`Queue`、`Stack`、`Map`等五种数据结构。其中，前四种数据结构都是单一元素的集合，而最后的Map则是以k-v对的形式使用。

从继承关系上讲，`List`、`Set`、`Queue`都是`Collection`的子接口，Collection又继承了`Iterable`接口，说明这几种集合都是可以遍历的。

从功能上讲，`List`代表一个容器，可以是**先进先出**，也可以是**先进后出*。而`Set`相对于List来说，是**无序**的，同时也是一个去重的列表，既然会去重，就一定会通过`equals`、`compareTo`、`hashCode`等方法进行比较。Map则是k-v的映射，也会涉及到Key值的查询等能力。

从实现上讲，`List`可以有链表实现或者数组实现，两者各有优劣，链表增删快，数组查询快。Queue则可以分为优先队列，双端队列等等。Map则可以分为普通的HashMap和可以排序的TreeMap等等。

## Java集合框架体系（java.util）

Java 集合可分为 `Collection` 和 `Map` 两大体系：

-   `Collection` 接口：用于存储一个一个的数据，也称*单列数据集合*。 
    -   `List` 子接口：用来存储有序的、可以重复的数据（主要用来替换数组，**"动态"数组**） 
        -   实现类：`ArrayList`(主要实现类)、`LinkedList`、`Vector` 
    -   `Set` 子接口：用来存储无序的、不可重复的数据（类似于高中讲的"集合"） 
        -   实现类：`HashSet`(主要实现类)、`LinkedHashSet`、`TreeSet` 

-   `Map` 接口：用于存储具有映射关系“key-value 对”的集合，即一对一对的数据，也称双列数据集合。(类似于高中的函数、映射。(x1,y1),(x2,y2) ---> y = f(x) ) 
    -   `HashMap`(主要实现类)、`LinkedHashMap`、`TreeMap`、`Hashtable`、`Properties`

## 扩展

### Java中的Collection集合如何遍历迭代？

- **传统的for循环遍历，基于计数器的**：遍历者自己在集合外部维护一个计数器，然后依次读取每一个位置的元素，当读取到最后一个元素后，停止。主要就是需要按元素的位置来读取元素。
- **迭代器遍历，Iterator**：每一个具体实现的数据集合，一般都需要提供相应的Iterator。相比于传统for循环，Iterator取缔了显式的遍历计数器。所以基于顺序存储集合的Iterator可以直接按位置访问数据。而基于链式存储集合的Iterator，正常的实现，都是需要保存当前遍历的位置。然后根据当前位置来向前或者向后移动指针。
- **foreach循环遍历**：根据反编译的字节码可以发现，foreach内部也是采用了Iterator的方式实现，只不过Java编译器帮我们生成了这些代码。
- **迭代器遍历：Enumeration**：Enumeration 接口是Iterator迭代器的“古老版本”，从JDK 1.0开始，Enumeration接口就已经存在了（Iterator从JDK 1.2才出现）
- **Stream**：JDK 1.8中新增Stream，使用一种类似用 SQL 语句从数据库查询数据的直观方式来提供一种对 Java 集合运算和表达的高阶抽象。Stream API可以极大提高Java程序员的生产力，让程序员写出高效率、干净、简洁的代码。

### Iterable和Iterator如何使用?

`Iterator`和`Iterable`是两个接口，前者代表的是迭代的方式，如`next`、`hasNext`方法就是需要在该接口中实现。后者代表的是是否可以迭代，如果可以迭代，会返回Iterator接口，即返回迭代方式

常见的使用方式一般是集合实现Iterable表明该集合可以遍历，同时选择Iterator或者自定义一个Iterator的实现类去选择遍历方式，如：

```java
class AbstractList<E> implements Iterable<E> {
    public Iterator<E> iterator() {
        return new Itr();
    }

    private class Itr implements Iterator<E> {}
}
```

> [Java基础-Iterator与Iterable](../01-Java基础/learn/Java基础-Iterator与Iterable.md)
>
> [Iterable接口与Iterator接口的区别](./Iterable接口与Iterator接口的区别.md)

### 为什么不把Iterable和Iterator合成一个使用

> [为什么不把Iterable和Iterator合成一个使用](./为什么不把Iterable和Iterator合成一个使用.md)
