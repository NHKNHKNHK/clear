# Java内存模型（JMM）？

Java内存模型（Java Memory Model）是Java虚拟机（JVM）定义的一种规范（**抽象概念**，并不真实存在），用于描述多线程程序中变量（包括实例字段、静态字段和数组元素）如何在内存中存储和传递。规范了线程何时会从主内存中读取数据、何时会把数据写回主内存。

>   JMM能干嘛？
>
>   1、通过JMM来实现**线程和主内存之间的抽象关系**
>
>   2、**屏蔽各个硬件平台和操作系统的内存访问差异**，以实现让Java程序在各种平台下都能达到一致的内存访问效果。

JMM的核心目标是确保多线程环境下的原子性、可见性和有序性，从而避免硬件和编译器优化带来的不一致问题

-   **可见性**：确保一个线程对变量的修改，能及时被其他线程看到。
    -   关键字`volatile`就是用来保证可见性的，它强制线程每次读写时都直接从主内存中获取最新值
-   **有序性**：指线程执行操作的顺序。JMM允许某些指令重排以提高性能，但会保证线程会的操作顺序不会被破坏，并通过`happens-before`关系保证跨线程的有序性。
-   **原子性**：是指操作不可分割，线程不会在执行过程中被中断。
    -   例如，`synchronized`关键字能确保方法或代码块的原子性
    -   JMM 保证了基本数据类型的读写操作的原子性，但对于复合操作（如 i++）则不保证



**关键概念**

**线程与主内存**：

每个线程都有自己的工作内存（也称为本地内存），工作内存保存了该线程使用到的变量的副本。主内存是共享内存区域，所有线程都可以访问主内存中的变量

>   注意！！！
>
>   ​	这里说的本地内存也是一种抽象的概念，实际上可能指的是寄存器、CPU缓存等



**内存模型中的同步机制**

**volatile关键字**

-   volatile变量保证了对该变量的读写操作的可见性和有序性。

-   读volatile变量时，总是从主内存中读取最新的值。

-   写volatile变量时，总是将最新的值写回主内存。

**synchronized关键字**

-   synchronized块或方法保证了进入临界区的线程对共享变量的独占访问。

-   退出synchronized块时，会将工作内存中的变量更新到主内存。

-   进入synchronized块时，会从主内存中读取最新的变量值。

**final关键字**

-   final变量在构造器中初始化后，其他线程可以立即看到初始化后的值。

-   final变量的引用不会被修改，因此可以确保其可见性。



可见性问题示例

```java
public class VisibilityExample {
    private static boolean stop = false;

    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            while (!stop) {
                // busy-wait
            }
        });
        thread.start();

        Thread.sleep(1000);
        stop = true; // 另一个线程可能不会立即看到这个修改
    }
}
```

主线程修改了stop变量，但另一个线程可能不会立即看到修改，导致循环无法终止。可以使用volatile关键字解决这个问题：

```java
public class VisibilityExample {
    private static volatile boolean stop = false;

    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            while (!stop) {
                // busy-wait
            }
        });
        thread.start();

        Thread.sleep(1000);
        stop = true; // 另一个线程会立即看到这个修改
    }
}
```

