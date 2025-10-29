# Integer类型的数值比较

在 Java 中，Integer 是一个包装类（wrapper class），用于将基本数据类型 int 封装为对象。由于 Integer 是引用类型，因此在进行数值比较时需要注意一些细节，尤其是自动装箱（autoboxing）和缓存机制的影响

先看一个例子：

```java
Integer a = Integer.valueOf(600);
Integer b = Integer.valueOf(600);
int c = 600;
System.out.println(a == b); 			// false
System.out.println(a.equals(b)); 		// true，因为Integer重写了equals方法
System.out.println(a == c); 			// true，==运算符，对于基本类型，比较的是值


Integer x = Integer.valueOf(99);
Integer y = Integer.valueOf(99);
System.out.println(x == y); 			// true，因为存在缓存机制
System.out.println(x.equals(y)); 		// true
```

## **基本数值比较**

1）使用 == 比较 Integer 对象

-   == 比较的是引用：当使用 == 比较两个 Integer 对象时
    -   对于引用类型，== 实际上比较的是它们的引用（即内存地址），而不是它们封装的数值。

例如：即使两个 Integer 对象封装相同的数值，如果它们是不同的对象实例，== 会返回 false。

```java
Integer a = new Integer(100);
Integer b = new Integer(100);
System.out.println(a == b); // 输出: false
```

2）使用 .equals() 方法

-   .equals() 比较的是值（前提是需要equals方法被正确的重写）：Integer 类重写了 Object 类的 equals() 方法，确保它比较的是两个 Integer 对象封装的数值，而不是引用。
-   为了确保正确性，应该使用 equals() 方法来比较 Integer 对象的值。

```java
Integer a = new Integer(100);
Integer b = new Integer(100);
System.out.println(a.equals(b)); // 输出: true
```

小结

​	**推荐使用equals方法来比较两个Integer对象**

## **自动装箱与缓存机制**

Java 为了优化性能，在 -128 到 127 之间的 Integer 对象会被缓存（通过 Integer.valueOf() 实现）。

这意味着在这个范围内的 Integer 对象可能会共享同一个实例，因此使用 == 比较时可能会得到 true 的结果。

```java
Integer x = 100; // 自动装箱
Integer y = 100; // 自动装箱
System.out.println(x == y); // 输出: true (因为 100 在缓存范围内，所以指向同一个引用)

Integer m = 150; // 自动装箱
Integer n = 150; // 自动装箱
System.out.println(m == n); // 输出: false (因为 150 不在缓存范围内)
```

## **总结**

​	为了避免因自动装箱和缓存机制导致的意外行为，==始终使用 .equals() 方法 来比较 Integer 对象的值==。

**阿里规约**

![1740924091123](assets/整数类型包装类比较.png)
