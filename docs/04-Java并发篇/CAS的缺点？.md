# CAS的缺点？

## **循环时间长开销很大**

```java
// Unsfafe.class
public final int getAndSetInt(Object var1, long var2, int var4) {
    int var5;
    do {
        var5 = this.getIntVolatile(var1, var2);
    } while(!this.compareAndSwapInt(var1, var2, var5, var4));

    return var5;
}
```

我们可以看到 getAndSetInt 方法有个 do-while 逻辑。如果CAS失败，会一直进行尝试。如果CAS长时间不成功，会形成**CPU资源浪费**。



## **ABA问题**

ABA问题是并发编程中的一种常见问题，通常出现在使用乐观锁或无锁算法（如CAS操作）的场景下。它描述了一种潜在的竞争条件，可能导致程序逻辑错误。

在多线程环境中，CAS（Compare-And-Swap）是一种常用的原子操作，用于实现线程安全的操作。其基本逻辑是：

- 比较内存中的值是否等于预期值。
- 如果相等，则将内存中的值替换为新值；否则不进行替换。

然而，CAS操作存在一个隐含的问题：如果某个值从A变为B，再变回A，那么CAS操作可能会误认为该值从未被修改过，从而导致逻辑错误。

示例：

假设有一个共享变量value，初始值为A，多个线程对其操作：

1、线程1读取到value = A，准备执行CAS操作。
2、在线程1执行CAS之前，线程2将value修改为B，然后又改回A。
3、线程1执行CAS时发现value仍然是A，于是成功执行了CAS操作。

尽管CAS操作看似成功，但实际上value可能已经被其他线程修改过多次，这会导致逻辑上的错误

## **解决方案**

1）引入版本号

在数据结构中增加一个版本号字段，每次修改数据时递增版本号。这样即使值从A变回A，版本号也会不同，从而避免误判。

2）使用带有时间戳的CAS

通过记录时间戳或序列号，确保即使值相同，也能区分出不同的修改。

3）使用`AtomicStampedReference`

Java中提供了AtomicStampedReference类，专门用于解决ABA问题。它通过引入一个额外的“标记”（stamp）来区分相同的值。

```java
import java.util.concurrent.atomic.AtomicStampedReference;

public class ABADemo {
    private static AtomicStampedReference<Integer> atomicRef = 
        new AtomicStampedReference<>(1, 0);

    public static void main(String[] args) {
        int[] stampHolder = {atomicRef.getStamp()};

        // 线程1尝试修改值
        new Thread(() -> {
            int stamp = atomicRef.getStamp();
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            boolean success = atomicRef.compareAndSet(1, 2, stamp, stamp + 1);
            if (success) {
                System.out.println("Thread 1: Modified value to 2");
            }

            success = atomicRef.compareAndSet(2, 1, atomicRef.getStamp(), atomicRef.getStamp() + 1);
            if (success) {
                System.out.println("Thread 1: Modified value back to 1");
            }
        }).start();

        // 线程2尝试修改值
        new Thread(() -> {
            boolean success = atomicRef.compareAndSet(1, 3, stampHolder[0], stampHolder[0] + 1);
            if (success) {
                System.out.println("Thread 2: Successfully modified value to 3");
            } else {
                System.out.println("Thread 2: Modification failed due to ABA problem");
            }
        }).start();
    }
}
```

4）使用锁机制

虽然锁会降低性能，但可以完全避免ABA问题，因为锁确保同一时间只有一个线程能修改共享资源。

