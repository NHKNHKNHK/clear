# 泛型中的<? extends T>和<? super T>有什么区别？

在Java泛型中，`<? extends T>`和`<? super T>`是两种通配符限制，用于更灵活的处理泛型类型。它们分别表示上界通配符和下界通配符。

**上界通配符`<? extends T>`**

-   含义：表示未知类型，但该类型是`T`或者`T`的子类型。
-   用途：主要用于**读取数据**，让编译器知道该类型是`T`或者`T`的子类型。所以可以从该类型中安全的读取T类型的数据，但不能写入（除了`null`）

示例：假设有一个方法需要从一个列表在读取`Number`类型的数据：

```java
public void readNumbers(List<? extends Number> list) {
    for (Number number : list) {
        // 可以安全的读取数据
        System.out.println(number); 
    }
    
    // 不能写入数据，除非写入null
    // list.add(1); // 编译报错
    list.add(null);
}
```

在这个例子中，`List<? extends Number>`可以接受`List<Number>`、`List<Integer>`、`List<Double>`等类型，但不能向列表中添加新的元素（除了null），因为编译器无法确定具体的类型。



**下界通配符`<? super T>`**

-   含义：表示未知类型，但该类型是`T`或者`T`的父类型。
-   用途：主要用于**写入数据**，让编译器知道该类型是`T`或者`T`的父类型。所以可以安全地向该类型中写入数据，但不能读取（除非读取为`Object`类型）

示例：假设有一个方法需要向一个列表在写入`Integer`类型的数据：

```java
public void writeInteger(List<? extends Integer> list) { 
	// 可以安全的写入数据     注意：只能写入Integer或其子类型数据
    list.add(1); 
    
    // 不能读取数据，除非读取为Object类型
    // Integer number = list.get(1); // 编译报错
    Object number = list.get(1);
}
```

在这个例子中，`List<? super Integer>`可以接受`List<Integer>`、`List<Number>`、`List<Object>`等类型，可以向列表中添加`Integer`类型及其子类型的数据，但不能从列表中读取数据（除非读取为Object类型）

**生产者与消费者的记忆法则**

为了更好地记住 `<? extends T>` 和 `<? super T>` 的使用场景，可以使用以下记忆法则：

-   **PECS**：**P**roducer **E**xtends, **C**onsumer **S**uper

    -   **生产者（Producer）** 使用 `<? extends T>`：当你需要从集合中读取数据时。

    -   ```java
        // 集合工具类Collections
        public static <T extends Object & Comparable<? super T>> T max(Collection<? extends T> coll) 
        ```

    -   **消费者（Consumer）** 使用 `<? super T>`：当你需要向集合中写入数据时。

    -   ```java
        // 集合工具类Collections
        public static <T> boolean addAll(Collection<? super T> c, T... elements)
        public static <T> void copy(List<? super T> dest, List<? extends T> src)    
        public static <T> void fill(List<? super T> list, T obj)
        ```

**总结**

| 通配符          | 含义           | 特点                     | 使用场景             |
| :-------------- | :------------- | :----------------------- | :------------------- |
| `<? extends T>` | 未知类型的上界 | 协变，只能读取，不能写入 | 作为生产者，读取数据 |
| `<? super T>`   | 未知类型的下界 | 逆变，只能写入，不能读取 | 作为消费者，写入数据 |

```java
<? extends Number>  // (无穷小 , Number]
// 只允许泛型为 Number 及 Number 子类的引用调用
    
<? super Number>  // [Number , 无穷大)
// 只允许泛型为 Number 及 Number 父类的引用调用
    
<? extends Comparable>
// 只允许泛型为实现 Comparable 接口的实现类的引用调用
```

通过合理使用 `<? extends T>` 和 `<? super T>`，你可以编写更加灵活和安全的泛型代码，同时确保类型安全性和代码的可维护性


