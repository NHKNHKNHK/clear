
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