# 什么是Java的happens-before规则？（JMM规范）

>   在JMM中，如果一个操作的**执行结果**需要对另一个操作可见性 或者 代码重排序，那么这两个操作之间必须存在happens-before（先行发生）原则

happens-before规则是Java内存模型（JMM）中的核心概念，用于定义多线程程序在操作的**可见性和顺序性**。

它通过指定一系列操作之间的关系，确保线程间的操作是有序的，避免了由于重排序或线程间数据不可见导致的并发问题。

通过happens-before关系，我们可以推断出线程之间的内存操作如何相互影响，从而确保线程安全。



**Happens-before原则的定义**

1、如果一个操作A happens-before另一个操作B，那么在多线程环境中，A的结果对B是可见的，并且A在时间上先于B执行。

2、如果两个操作之间存在 happens-before 关系，并不意味着一定要按照 happens-before 原则制定的顺序来执行。如果**重排序**之后的执行结果与按照happens-before关系来执行的**结果一致**，那么这种重排序**并不非法**。

具体来说，happens-before关系确保了两个操作之间的可见性和顺序性。 

**happens-before规则的主要规则**

1）**程序次序规则（Program Order Rule）**：**在一个线程中**，按照程序顺序（按照代码的书写顺序），前面的操作happens-before后面的操作。

2）**监视器锁规则（Monitor Lock Rule）**：对一个锁的解锁（unlock）操作happens-before后续对同一个锁的加锁（lock）操作。也就是说，在释放锁之前的所有修改在加锁后对其他线程可见。

3）**传递性（Transitivity）**：如果操作A happens-before操作B，且操作B happens-before操作C，那么操作A happens-before操作C。

4）**volatile变量规则**：对一个`volatile`变量的写操作 happens-before 后续对这个 `volatile` 变量的读操作。他保证`volatile`变量的可见性，确保一个线程修改`volatile`变量后，其他线程能立即看到最新值。

5）**线程启动规则（Thread Start Rule）**：在一个线程中，对另一个线程的Thread.start()调用happens-before该线程中的任何操作。

6）**线程终止规则（Thread Termination Rule）**：一个线程中的所有操作happens-before另一个线程调用该线程的Thread.join()并成功返回。

7）**线程中断规则（Interrupt Rule）**：对线程的Thread.interrupt()调用happens-before被中断线程检测到中断事件的发生（通过Thread.isInterrupted()或抛出InterruptedException）。

8）**对象构造规则（Object Construction Rule）**：一个对象的构造函数的结束happens-before该对象的finalize()方法的开始。



**Happens-before原则的应用**

**程序次序规则**

```java
int a = 1; // 操作A
int b = 2; // 操作B
```

在同一个线程中，操作A happens-before操作B，确保了操作A的结果对操作B可见。

**监视器锁规则**

```java
synchronized(lock) {
    // 操作A
}
synchronized(lock) {
    // 操作B
}
```

对lock的解锁操作（操作A）happens-before对同一个lock的加锁操作（操作B）

**线程启动规则**

```java
Thread t = new Thread(() -> {
    // 操作B
});
t.start(); // 操作A
```

在主线程中，对Thread t的start()调用（操作A）happens-before新线程中的任何操作（操作B）



**Happens-before原则的意义**

Happens-before原则为开发者提供了一套明确的规则，用于推断多线程程序中操作的执行顺序和内存可见性。这有助于编写正确和高效的并发程序，避免数据竞争和其他并发问题。通过遵循这些规则，开发者可以确保线程间的正确同步，确保程序的正确性和稳定性。