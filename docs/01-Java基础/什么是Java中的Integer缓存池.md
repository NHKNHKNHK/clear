# 什么是Java中的Integer缓存池

Java的Integer缓存池是为了提升性能和节省内存。根据实战发现大部分的数据操作都集中在值比较小的范围，因此缓存这些对象可以减少内存分配和垃圾回收的负担，提升性能。

## **原理**：

-   Java中自动装箱时，对于`-128` 到 `127` 直接的 `int` 类型，会直接返回一个已缓存的`Integer`对象，而不是创建新的对象。（**通过 Integer.valueOf() 实现**）
-   实现原理是int类型在自动装箱时会调用`Integer.valueOf()`，进而用到了IntegerCache
-   IntegerCache中的数据是在static静态块中通过遍历的方式生成的

## **缓存池的使用场景**

-   **自动装箱**：当基本类型int转换为包装类Integer时，若数值在缓存范围内，返回缓存对象
-   **值比较**：由于相同范围内的整数使用同一个缓存对象，使用`==`可以正确比较它们的引用，而不需要使用`equals`。但是超过缓存池范围内的Integer对象，`==`比较的是对象引用，而不是数值。要比较数值，应使用`equals`方法
    -   因此，**阿里规约强制包装类之间的比较应使用`equals`方法**



## **扩展**

在Java8及之后，可以通过JVM参数`-xx:AutoBoxCacheMax=size`来调整缓存池上限

```java
java --xx:AutoBoxCacheMax=500 // 表示将缓存池扩展到 -128到500
```

其他包装类的缓存机制

-   Long、Short、Byte包装类的缓存池范围是 -128到127
-   Float 和 Double 没有缓存池，因为是小数，太多了
-   Character缓存池范围是`\u0000`到`\u007F`（即0到127，代表ASCII字符集）
-   Boolean只有两个缓存值，true和false
