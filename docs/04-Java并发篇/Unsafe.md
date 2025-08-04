# Unsafe

Unsafe是CAS的核心类，由于Java方法无法直接访问底层操作系统，需要通过本地（native）方法来访问，Unsafe相当于一个后门，基于该类可以直接操作特定内存的数据。

Unsafe类存在于`sum.misc`包中，其内部方法操作可以像C语言的指针一样直接操作内存，因为Java中CAS操作的执行依赖于Unsafe类的方法。

>   注意：Unsafe类中的所有方法都是native修饰的，也就是Unsafe类中的方法都直接调用操作系统底层资源执行相应任务。



AtomicInteger类是CAS的典型实现，其内部使用的是Unsafe类

```java
/**
 * Atomically increments by one the current value.
 *
 * @return the previous value
 */
public final int getAndIncrement() {
    return unsafe.getAndAddInt(this, valueOffset, 1);
}
```

说明：

​	变量valueOffset，表示该变量值在内存中的**偏移地址**，因为Unsafe就是根据内存偏移地址获取数据的。

```java
// AtomicInteger类
private volatile int value;
```

说明：

​	变量value用volatile修饰，保证了多线程之间的内存可见性。



CAS并发原语体现在Java语言中就是`sum.misc.Unsafe`类中的各个方法。调用Unsafe类中的CAS方法，JVM会帮我们实现CAS汇编指令。这是一种完全依赖于**硬件**的功能，通过它实现了原子操作。

再次调用，CAS是一种**系统原语**。

>   原语属于操作系统用语范畴，是由若干条指令组成的，用于完成某个功能的一个过程，并且原语的执行必须是连续的，在执行过程中不允许被中断，也就是说CAS是一条CPU的原子指令，不会造成所谓的数据不一致问题。

