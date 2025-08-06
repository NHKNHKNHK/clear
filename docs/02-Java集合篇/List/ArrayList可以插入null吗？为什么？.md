#  ArrayList可以插入null吗？为什么？

可以。ArrayList可以存储任何类型的对象，包括null值。

## **ArrayList可以插入null值？**

ArrayList底层是动态数组，其内部维护了一个 Object 数组。

ArrayList的add方法将元素添加到数组中，而`null` 是一个合法的值，表示“没有对象”或“空引用”。在Java中也是一个合法的引用。

源码如下：

```java
transient Object[] elementData;


public boolean add(E e) {
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    elementData[size++] = e;
    return true;
}
```

其中 ensureCapacityInternal 方法是确保数组容量足够，不够的话会触发扩容机制。elementData[size++] = e; 则是将元素插入到数组中。

## **注意事项**

`ArrayList` 内部使用一个对象数组来存储元素。在 Java 中，对象数组可以包含 `null` 值。但开发中不建议存储null值，因为null可能会带来以下潜在问题：

-   **空指针异常**：如果处理ArrayList元素时忘记对null值进行判空处理，可能会导致NullPointerException
-   **代码可读性**：null值无意义，会增强代码的复杂性和可读性
-   **业务逻辑混淆**：null值的存在可能会使得业务逻辑变得混乱
