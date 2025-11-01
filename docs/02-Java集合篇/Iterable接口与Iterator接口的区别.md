# Iterable接口与Iterator接口的区别

-   Collection从JDK1.5开始继承了Iterable接口；Map并没有继承Iterable接口

-   JDK1.5引入了`java.lang.Iterable`接口，包含抽象方法：`Iterator<T> iterator()`。任何实现了 `Iterable` 接口的类都可以直接用在`增强型for` 循环中。

-   foreach循环是一种语法糖
    -   对于数组，编译后转化为普通for循环遍历元素
    -   对于集合，编译后使用Iterator迭代器遍历元素
-   JDK1.2引入`java.util.Iterator<E>`迭代器，它的目的是用于代替`Enumeration`迭代器
-   Iterator迭代器包含2个抽象方法用于遍历元素
    -   `boolean hasNext()`: 如果迭代器中仍有更多元素，则返回true。
    -   `E next()`: 返回迭代器中的下一个元素。

## 扩展

### Enumeration和Iterator接口的区别？

> [Enumeration和Iterator接口的区别？](./Enumeration和Iterator接口的区别？.md)