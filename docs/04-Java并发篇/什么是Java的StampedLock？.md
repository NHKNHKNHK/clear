# 什么是Java的StampedLock？

Java 中的 `StampedLock` 是 JDK1.8 引入的一个读写锁，适用于**读多写少**的并发场景。它结合了乐观读锁、悲观读锁和写锁的特性，还有邮戳（stamp）的概念，旨在提供比 JDK1.5 中的读写锁`ReentrantReadWriteLock` 更高的吞吐量

>   StampedLock是一个读写锁，还有种说法是邮戳锁，也叫票据锁。



**核心特性（三种访问模式）**

1.  **写锁（Write Lock）**
    -   独占锁，与任何其他锁互斥。
    -   通过 `long stamp = stampedLock.writeLock()` 获取，返回一个标记（stamp）。
    -   通过 `stampedLock.unlockWrite(stamp)` 释放。

>   功能与`ReentrantReadWriteLock`的写锁类似 

1.  **悲观读锁（Read Lock）**
    -   共享锁，允许多个线程同时获取，但与写锁互斥。（也就是写操作需要等待）
    -   通过 `long stamp = stampedLock.readLock()` 获取。
    -   通过 `stampedLock.unlockRead(stamp)` 释放。

>   功能与`ReentrantReadWriteLock`的读锁类似 

1.  **乐观读（Optimistic Read）**
    -   无锁机制，不阻塞其他线程的读写操作。
    -   通过 `long stamp = stampedLock.tryOptimisticRead()` 尝试获取乐观读标记。
    -   当检测到有写操作发生时，才会回退到悲观读锁或重试。
        -   可以调用 `stampedLock.validate(stamp)` 验证数据是否被修改。若失败，需升级为悲观读锁。



**stamp**

stamp（戳记、long类型）：代表了锁的状态。当stamp返回0时，表示线程获取锁失败。并且，当释放锁或者转换锁的时候，都要传入最初获取的stamp值



**核心方法**

```java
// 写锁
long writeStamp = stampedLock.writeLock();
try {
    // 写操作
} finally {
    stampedLock.unlockWrite(writeStamp);
}

// 悲观读锁
long readStamp = stampedLock.readLock();
try {
    // 读操作
} finally {
    stampedLock.unlockRead(readStamp);
}

// 乐观读
long optimisticStamp = stampedLock.tryOptimisticRead();
if (!stampedLock.validate(optimisticStamp)) { // 检查乐观读锁是否被其他写操作干扰
    // 乐观读失败，升级为悲观读锁
    long readStamp = stampedLock.readLock();
    try {
        // 重新读取数据
    } finally {
        stampedLock.unlockRead(readStamp);
    }
}
```



**优缺点**

优点

-   **乐观读的高性能**：乐观读模式下不阻塞写操作，适合读多写少的场景。
-   **锁升级/降级**：支持从读锁升级为写锁（但可能导致死锁），或从写锁降级为读锁。

缺点：

-   **不可重入**：同一个线程重复获取锁会导致死锁（与 `ReentrantReadWriteLock` 不同）。
-   **无条件变量**：`StampedLock` 不直接支持条件变量（需借助其他机制）。
-   **读锁饥饿**：在高写入负载的场景下，悲观读锁可能会被长期阻塞，导致读操作饥饿。

-   **CPU飙高风险**：如果线程使用`writeLock()`或`readLock()`获取锁之后，线程还没执行完就被`interrupt()`的话，会导致CPU飙升。需要用`readLockInterruptibly()`或`writeLockInterruptibly()`

>   [【Bug:StampedLock的中断问题导致CPU爆满 】](http://ifeve.com/stampedlock-bug-cpu/)



**内部原理**

-   StampedLock通过一个long类型值来管理状态，低位用于表示锁的类型（写锁、读锁），高位用于表示锁的计数。当乐观锁被获取时，生成一个邮戳（stamp），并在后续验证时判断是否有写操作发生。

-   `validate(stamp)`方法可以有效判断在持有乐观读锁的情况下，是否有其他写操作干扰（被修改了），从而决定是否要变为悲观读锁。



**使用场景**

-   **读操作远多于写操作**：乐观读减少锁竞争。
-   **短期写操作**：写锁会阻塞其他所有操作，需快速执行。
-   **需要高性能并发控制**：例如缓存、计数器等场景。

**注意事项**

-   **避免死锁**：不可重入，需确保锁的获取和释放严格匹配。
-   **验证乐观读**：乐观读后必须调用 `validate()` 检查数据一致性。
-   **慎用锁升级**：`tryConvertToWriteLock()` 可能失败，需处理重试逻辑。



**与 ReentrantReadWriteLock 对比**

| 特性     | StampedLock          | ReentrantReadWriteLock |
| :------- | :------------------- | :--------------------- |
| 锁类型   | 支持乐观读           | 仅悲观锁               |
| 重入性   | 不可重入             | 可重入                 |
| 条件变量 | 不支持               | 支持                   |
| 性能     | 更高（读多写少场景） | 较低                   |





