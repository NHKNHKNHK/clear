# 谈谈你对CAS的理解？Compare-And-Swap

**口语化**

CAS是Java中Unsafe类里面的一个方法，全称是Compare-And-Swap，**比较并交换**的意思。 它的主要功能是保证在多线程的环境下对共享变量修改的原子性。用于**实现无锁并发**。

CAS避免了传统锁机制带来的上下文切换开销。

CAS是一种**硬件级别的原子操作**，它比较内存中的某个值是否为 预期值，如果是，则更新为新值，否则不做修改

>   相关说明：
>
>   ​	CAS的原子性由操作系统保证，但系统层面也是读取和更新两个操作，如果是在多核CPU的情况下，操作系统会为其添加lock指令对缓存或总线加锁，以确保原子性

CAS主要是应用在一些高并发的场景中，有两个常用场景。

一：JUC中的Atomic包里的原子类实现，AtomicInteger、AtomicLong等

二：多线程对共享资源竞争的互斥性质，例如AQS、ConcurrentHashMap、ConcurrentLinkedQueue

以上



**CAS的工作原理**

CAS操作涉及三个操作数：

-   **内存位置（V）**：需要操作的变量的内存地址。

-   **预期值（E）**：期望变量的当前值。

-   **新值（N）**：希望将变量更新为的新值。

CAS操作的步骤如下：

-   读取变量的当前值。

-   **比较（Compare）**：比较变量的当前值与预期值（E）。

-   **交换（Swap）**：如果当前值等于预期值，则将变量更新为新值（N），并返回true，表示更新成功。

-   失败重试：如果当前值不等于预期值，说明有其他线程已经修改了该值，CAS操作失败，一般会利用重试（自旋），直到成功。

**CAS的优点**

-   **无锁操作**：CAS是无锁操作，不需要加锁，从而避免了锁带来的开销和潜在的死锁问题。

-   **高性能**：在高并发环境中，CAS操作的性能通常优于加锁机制，因为它减少了线程的阻塞和上下文切换。

-   **原子性**：CAS操作是原子的，即使在多线程环境中，也能确保操作的正确性。

**CAS的缺点**

-   **ABA问题**：CAS操作可能会遇到ABA问题，即变量在检查和更新之间被其他线程多次修改，但最终值看起来没有变化。可以通过增加版本号或使用AtomicStampedReference来解决。

-   **自旋等待**：CAS操作在失败时通常会自旋重试，这可能会导致CPU资源的浪费，尤其是在高冲突场景下。

-   **单变量限制**：CAS操作仅适用于单个变量的更新，不适用于涉及多个变量的复杂操作



**CAS在Java中的应用**

Java提供了一些基于CAS操作的并发类，例如AtomicInteger、AtomicBoolean、AtomicReference等。它们使用CAS操作来实现原子性更新，避免了显式加锁。

```java
import java.util.concurrent.atomic.AtomicInteger;
//AtomicInteger类使用CAS操作来实现原子性递增操作，确保在多线程环境下操作的正确性。
public class CASExample {
    private AtomicInteger atomicInteger = new AtomicInteger(0);

    public void increment() {
        int oldValue, newValue;
        do {
            oldValue = atomicInteger.get();
            newValue = oldValue + 1;
        } while (!atomicInteger.compareAndSet(oldValue, newValue));
    }

    public int getValue() {
        return atomicInteger.get();
    }

    public static void main(String[] args) {
        CASExample example = new CASExample();
        example.increment();
        System.out.println("Value: " + example.getValue());
    }
}
```



下面使用CAS优化的案例

```java
public class Example {
    private int state = 0;
    
    public void doSomething() {
        if(state == 0) { // 多线程环境下存在原子性问题
            state = 1;
            // ...
        }
    }
}
```

这个方法的逻辑在单线程的环境下没有问题，但是在多线程的环境下会存在原子性问题。这是一个典型的READ-Wtiter的操作。一般情况下，我们会在方法上加上synchronized关键字来解决原子性问题，但是加同步锁一定会带来性能上的损耗，所以对于性能要求较高的场景，我们可以使用CAS机制来进行优化。

优化后

```java
public class Example {
    private volatile int state = 0;
    
    private static final Unsafe unsafe = Unsafe.getUnsafe();
    private static final long stateOffset;
    
    static {
        try {
            stateOffset = unsafe.objectFieldOffset(Example.class.getDeclaredField("state"))
        } catch (Exception e){
            ...
        }
    }
    
    public void doSomething() {
        if(unsafe.compareAndSwapInt(this, stateOffset, 0, 1)) {
            // ...
        }
    }
}
```
