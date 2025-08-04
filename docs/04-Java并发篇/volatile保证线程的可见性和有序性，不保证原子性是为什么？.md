# volatile保证线程的可见性和有序性，不保证原子性是为什么？

**保证线程的可见性**

**可见性原理**

在多线程环境中，每个线程都有自己的工作内存（缓存），从主存中读取变量复制到工作内存中进行操作，操作完成后再写回主存。

普通变量的修改在一个线程中进行后，其他线程并不一定能立即看到，因为这个修改可能只存在于工作内存中，尚未刷新到主存。（变量副本写回主存的时机是不确定的）

volatile关键字通过一套内存屏障（Memory Barrier）机制来保证变量的可见性。具体来说，当一个变量被声明为volatile时：

-   **写操作**：在写入volatile变量时，会在写操作之后插入一个写屏障（Store Barrier）。这确保了在写入volatile变量之前，对共享变量的修改会被同步到主存中。

-   **读操作**：在读取volatile变量时，会在读操作之前插入一个读屏障（Load Barrier）。这确保了在读取volatile变量之后，能从主存中获取最新的值。

>   简单点来说，volatile关键字之所以能够保证可见性，是因为它强制线程每次读写时都直接从主内存中获取最新值

```java
public class VolatileVisibilityDemo {

    // static boolean flag = false;
    volatile static boolean flag = false;

    public static void main(String[] args) {

        new Thread(() -> {
            System.out.println(Thread.currentThread().getName() + "\tcome in");
            while (!flag) {
                // Busy-wait
            }
        }, "t1").start();

        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        flag = true;
        System.out.println(Thread.currentThread().getName() + "修改flag：" + flag);
    }
}
```

在这个例子中，主线程将flag被设置为true，并且这个修改会立即被刷新到主存中。而t1线程会从主存中读取flag的最新值，从而跳出循环。

如果flag变量不加volatile修饰，t1线程有可能会看不到main线程对flag的修改，为什么？

可能原因：

1）main线程修改了flag的值，但是没有将其刷新到主内存中，所以t1线程看不到

2）main线程将flag最新值刷新到了主内存中，但t1线程一直在读取自己工作内存的flag值，没有去主内存中获取最新值（典型的自娱自乐）

解决方案：使用volatile修饰flag变量，强制线程每次读写flag变量时都从主内存中获取



**保证有序性**

**有序性原理** 

在 Java 内存模型中，编译器和处理器为了优化性能，可能会对指令进行重排序。重排序不会影响单线程程序的正确性，但在多线程环境下可能会导致不可预期的问题。

volatile关键字通过**内存屏障**来防止指令重排，从而保证有序性。

-   **写操作**：在写入volatile变量时，会在写操作之前插入一个写屏障。这确保了在写入volatile变量之前的所有写操作都不会被重排序到写屏障之后。

-   **读操作**：在读取volatile变量时，会在读操作之后插入一个读屏障。这确保了在读取volatile变量之后的所有读操作都不会被重排序到读屏障之前。

```java
public class VolatileOrderingExample {
    private volatile int a = 0;
    private int b = 0;

    public void writer() {
        a = 1; // Write to volatile variable
        b = 2; // Write to non-volatile variable
    }

    public void reader() {
        if (a == 1) {
            // If this condition is true, it guarantees that b == 2 due to the happens-before relationship
            System.out.println("b = " + b);
        }
    }
}
```

由于a是volatile变量，写入a之前的所有写操作（包括写入b）在写入a之后对其他线程都是可见的。因此，如果a == 1，那么b必然已经被写入2。



**为什么不保证原子性**

**原子性原理**

原子性指的是一个操作是不可分割的，即操作要么全部执行完毕，要么完全不执行。

volatile保证了对变量的单次读/写操作是原子的，但无法保证复合操作（如自增、自减）的原子性。

```java
class MyNumber {
    // int count;
    volatile int count;

    public void add() {
        count++;
    }
}

public class VolatileNotAtomicityDemo {

    public static void main(String[] args) {
        MyNumber number = new MyNumber();
        CountDownLatch downLatch = new CountDownLatch(10);
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    number.add();
                }
                downLatch.countDown();
            }).start();
        }
        try {
            downLatch.await(2, TimeUnit.SECONDS);
            System.out.println(number.count);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
```

在这个例子中，count++实际上包含了三个步骤：

1、读取count的值

2、将count的值加 1

3、将新值写回count

这些步骤并不是一个原子操作，可能会被其他线程打断。例如，两个线程同时执行add()方法时，可能会发生竞态条件，导致count的值不如预期。例如：

-   线程 A 读取count的值为 0
-   线程 B 读取count的值为 0
-   线程 A 将count的值加 1 并写回（count变为 1）
-   线程 B 将count的值加 1 并写回（count变为 1）

最终count的值是 1 而不是 2



**扩展**

**既然volatile不能保证（复合操作的）原子性？那怎么才能保证原子性呢？**

-   使用**同步块**或**锁**（如ReentrantLock）来确保操作的原子性。

-   使用**原子类**（如AtomicInteger、AtomicLong等）来处理基本类型的原子操作


