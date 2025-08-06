# 为什么ConcurrentHashMap的k-v都不能为null？

`ConcurrentHashMap`不允许`key`和`value`为`null`，而`HashMap`可以，这是因为它们的设计目标和使用场景不同。

## **ConcurrentHashMap**

-   **线程安全性**：`ConcurrentHashMap`设计用于并发环境，允许多个线程同时访问。如果允许`null`值，无法区分`get(key)`返回`null`是因为键不存在还是键的值为`null`，这会导致**歧义**。

-   **避免潜在的错误**：禁止`null`值可以避免一些潜在的编程错误，例如误判键的存在性。通过抛出`NullPointerException`，可以强制开发者在使用时处理`null`值，提升代码的健壮性。

## **HashMap**

-   **灵活性**：`HashMap`设计用于非并发环境，允许更大的灵活性。允许`null`作为键或值，方便处理某些特殊场景，如表示缺失值。

-   **简单实现**：在单线程环境中，`HashMap`的操作不需要考虑并发问题，因此可以直接使用`null`来表示键或值的缺失。

## **总结**

`ConcurrentHashMap` 禁止 `null` 键值是为了：

1.  **消除并发场景下的歧义**；
2.  **简化实现逻辑，提高性能**；
3.  **与线程安全类保持一致性**。

这种设计差异反映了两者在使用场景和目标上的不同侧重

