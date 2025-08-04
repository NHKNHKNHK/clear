# ArrayList初始容量是多少？

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