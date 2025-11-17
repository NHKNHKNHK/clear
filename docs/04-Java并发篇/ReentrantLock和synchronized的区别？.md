# ReentrantLock和synchronized的区别？

synchronized 是Java的关键字，用于实现基本的同步机制，非公平、不支持超时、不可中断、不支持多条件。

ReentrantLock 是JUC提供的一个类，JDK1.5引入，支持设置超时，可以避免死锁，支持公平锁、可被中断、支持多条件判断。

ReentrantLock 需要手动解锁；而synchronized 不需要，它们都是可重入锁。

>   性能问题：早期的JDK版本中，synchronized 性能不如 ReentrantLock，但现在基本上性能是差不多的

## **锁的获取方式**

-   `synchronized`：
    -   是一种内置的关键字，使用简单，语法上直接加在方法或代码块上。
    -   **自动管理锁的获取和释放**，不需要显式调用。
-   `ReentrantLock`：
    -   是一个显式的锁对象，需要通过`new ReentrantLock()`创建。
    -   需要显式调用`lock()`获取锁和`unlock()`释放锁。

## **公平性**

-   `synchronized`：不支持公平锁，**默认是非公平**的，即不保证等待时间最长的线程优先获取锁。
-   `ReentrantLock`：支持公平锁和非公平锁（默认是非公平的）

```java
ReentrantLock lock = new ReentrantLock();  		// 非公平锁
ReentrantLock lock = new ReentrantLock(true);   // 公平锁
```

## **锁的中断**

-   `synchronized`：**不支持锁中断**，一旦线程进入等待状态，无法通过`Thread.interrupt()`中断。
-   `ReentrantLock`：支持锁中断，可以使用`tryLock(long timeout, TimeUnit unit)`尝试获取锁，并且可以在等待时响应中断，有效避免死锁

## **锁的超时**

-   `synchronized`：不支持超时机制，如果无法获取锁，线程会一直等待。
-   `ReentrantLock`：支持超时机制，可以使用`tryLock(long timeout, TimeUnit unit)`在指定时间内尝试获取锁，超时后返回`false`。

## **性能**

-   `synchronized`：在JDK 6之后进行了大量优化，性能已经接近甚至超过`ReentrantLock`，特别是在争用较少的情况下。
-   `ReentrantLock`：提供了更灵活的控制，但在某些情况下可能会比`synchronized`稍慢，尤其是在争用激烈的情况下。

## 扩展

>   synchronized 性能优化
>
>   synchronized在JDK1.6之后进行了很多性能优化，主要包括如下：
>
>   -   偏向锁：如果一个锁被同一个线程多次获得，JVM会将该锁设置为偏向锁，以减少获取锁的代价
>   -   轻量级锁：如果没有线程竞争，JVM会将锁设置为轻量级锁，使用CAS操作代替互斥同步
>   -   锁粗化（锁膨胀）：JVM会将一些短时间内连续的锁操作合并为一个锁操作，以减少锁操作的开销
>   -   锁消除：JVM在JIT编译时会检测到一些没有竞争的锁，并将这些锁去掉，以减少同步的开销

**锁的状态查询**

-   `synchronized`：没有提供API来查询当前锁的状态。
-   `ReentrantLock`：提供了丰富的API来查询锁的状态，如`isHeldByCurrentThread()`、`getHoldCount()`等。