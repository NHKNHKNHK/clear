# volatile关键字的作用？ 

volatile 是 Java 中的一个关键字，用于修饰变量，以确保变量的**可见性**和**有序性**，它强制线程每次读写时都直接从主内存中获取最新值

volatile保证线程的可见性和有序性，依靠的是**内存屏障**

**volatile的特性**

-   **可见性**

volatile关键字确保一个线程对变量的修改会立即被其他线程可见。

也就是说，当一个线程修改了volatile变量的值，新值会立即刷新到主内存中，并且其他线程读取这个变量时会直接从主内存中读取最新的值，而不是从线程的本地缓存（工作内存）中读取。

-   **有序性**

有序性指的是程序执行的顺序按照代码的顺序来执行。

在多线程环境下，由于编译器优化和CPU指令**重排**，代码的执行顺序可能与编写顺序不同。指令重排可能导致线程看到不一致的执行顺序。

>   重排序是指编译器和处理器为了优化程序性能而对指令序列进行重新排序的手段，有时候可能会改变程序语句的先后顺序。
>
>   不存在数据依赖关系，可以重排序；否则，禁止重排序
>
>   例如：
>
>   ​	int x = 1; int y =  x + 3;  // 禁止重排序，因为存在数据依赖
>
>   特别注意！！！重排序后的指令不能改变原有的串行语义！这一点在并发设计中必须重点考虑。

**写屏障（Store Barrier）**：在写入 `volatile` 变量之后插入，确保在写入 `volatile` 变量之前的所有写操作都已经完成（所有在缓存中的数据同步到主内存中），并且这些写操作的结果对其他线程可见。

**读屏障（Load Barrier）**：在读取 `volatile` 变量之前插入，确保在读取 `volatile` 变量之后的所有读操作都从主内存中获取最新的值。



**volatile的用法**

volatile关键字通常用于修饰那些在多个线程之间共享的变量，确保这些变量的修改能够及时被其他线程看到。

volatile实现了Java内存模型中的**可见性和有序性**（禁重排），但**不保证原子性**。

```java
public class VolatileExample {
    
    private volatile boolean flag = false;

    public void writer() {
        flag = true;
    }

    public void reader() {
        if (flag) {
            // 读取到最新的flag值
            System.out.println("Flag is true");
        }
    }

    public static void main(String[] args) {
        VolatileExample example = new VolatileExample();

        Thread writerThread = new Thread(() -> {
            example.writer();
        });

        Thread readerThread = new Thread(() -> {
            example.reader();
        });

        writerThread.start();
        readerThread.start();
    }
}
```

在上述代码中，flag变量被声明为volatile，确保writer()方法对flag的修改能够被reader()方法及时看到



**使用volatile的场景**

适用场景

-   **单一赋值操作**
-   例如：volatile int a = 10;    volatile boolean flag = false;
-   **状态标志**：如布尔型标志，用于控制线程的启动和停止。
    -   例如：volatile static boolean flag = false;
-   DCL双端锁的发布、**单例模式**：在双重检查锁定（Double-Checked Locking）的单例模式中，使用volatile修饰实例变量，确保实例变量的可见性和有序性。
-   **AtomicReferenceFieldUpdater**，在高并发场景中，想要线程安全的更新某个对象中的某个字段，而又不像锁整个对象，此时可以使用 AtomicReferenceFieldUpdater + volatile修饰字段
-   **开销较低的读写锁（读远多于写）**策略，例如：

```java
/**
* 适用于 读远多于写，使用volatile减少同步的开销
*/
public class VolatileCounter {
    // 使用 volatile 修饰变量 i，确保每个线程读取的值是最新的
    private volatile int i = 0;

    // 读取 i 的方法，利用volatile保证读操作的可见性
    public int read() {
        return i;
    }

    // 写入 i 的方法，使用 synchronized 确保写操作的原子性
    public synchronized void increment() {
        i++;
    }
}
```

不适用场景

-   **复合操作**：如自增操作（i++）、累加操作等。这些操作不是原子的，使用volatile不能保证线程安全。此时应使用同步块或原子类。

-   **依赖于前后操作顺序的场景**：如需要严格的操作顺序控制，应使用同步块或锁



**volatile的局限性**

volatile只能保证对单个volatile变量的读/写操作是可见的和有序的，但不能保证复合操作（如i++）的原子性。

volatile不能替代锁，不能保证多个操作的原子性和完整性。如果需要更复杂的同步机制，仍需使用同步块或锁。




