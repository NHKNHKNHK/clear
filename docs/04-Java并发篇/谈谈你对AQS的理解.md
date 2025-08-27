# 谈谈你对AQS的理解？AbstractQueuedSynchronizer

>   补充说明：
>
>   想要对AQS有更好的理解，需要先掌握如下前置知识：
>
>   -   公平锁与非公平锁
>   -   可重入锁
>   -   自旋思想
>   -   LockSupport
>   -   数据结构之双向链表
>   -   设计模式之模板设计模式

## 口语化

简单来说，AQS是**线程同步器**，它是juc包中多个组件（lock）的底层实现，比如ReentrantLock、CountDownLatch、Semaphore等，底层都使用了AQS。

AQS它起到了一个**抽象、封装**的作用，把一些排队、入队、加锁、中断等方法提供（抽象）出来，便于其他相关JUC锁的使用，具体的加锁时机、入队时机等都需要实现类自己来控制。

它主要通过维护一个**共享状态（state）**和一个**先进先出（FIFO）**的等待队列，来管理线程对共享资源的访问。

`state`使用 `volatile` 修饰，表示当前资源的状态。例如，在独占锁中，`state` 为 `0` 表示锁未被占用，为 `1` 表示已被占用。

当一个线程尝试获取资源失败时，会被加入到AQS的等待队列中。这个队列是一个变体的CLH队列，采用双向链表结构，节点包含线程的引用、等待状态以及前驱和后继节点的指针，

从本质上来说，AQS提供了两种锁的机制，分别是**排它锁**和**共享锁**。

-   排它锁也称为独占锁，就是当存在多个线程竞争时，同一共享资源同一时刻只允许一个线程访问。比如说Lock中的ReentrantLock的重入锁实现就使用了AQS的排它锁功能。
-   共享锁也称为读锁，同一时刻允许多个线程同时获得锁资源。比如说CountDownLatch、Semaphore都用到了AQS的共享锁功能。



## **AQS的核心概念**

-   **状态（state）**：AQS通过一个整型变量state来表示同步状态。不同的同步器可以根据自己的需求定义state的含义，例如对于独占锁，state可以表示锁的持有状态；对于共享锁，state可以表示可用资源的数量。

-   **独占模式（Exclusive Mode）**：独占模式下，只有一个线程能获取同步状态，其他线程必须等待。例如，ReentrantLock就是基于独占模式实现的。

-   **共享模式（Shared Mode）**：共享模式下，多个线程可以同时获取同步状态。例如，Semaphore和CountDownLatch就是基于共享模式实现的。

-   **等待队列（Wait Queue）**：AQS内部维护一个FIFO等待队列，用于管理被阻塞的线程。当线程获取同步状态失败时，会被加入到等待队列中，等待其他线程释放同步状态后被唤醒。

每个节点（Node）代表一个等待的线程，节点之间通过 next 和 prev 指针链接。

```java
static final class Node {
    static final Node SHARED = new Node();
    static final Node EXCLUSIVE = null;
    ...
    volatile int waitStatus;
    volatile Node prev;
    volatile Node next;
    volatile Thread thread; // 保存等待的线程
    Node nextWaiter;
    ...
}
```

## **AQS的工作原理**

AQS通过以下几个核心方法来实现同步器的功能：

1.  **acquire(int arg)**：以独占模式获取同步状态，如果获取失败，则将当前线程加入等待队列，并阻塞直到同步状态可用。
2.  **release(int arg)**：以独占模式释放同步状态，唤醒等待队列中的下一个线程（如果有）。
3.  **acquireShared(int arg)**：以共享模式获取同步状态，如果获取失败，则将当前线程加入等待队列，并阻塞直到同步状态可用。
4.  **releaseShared(int arg)**：以共享模式释放同步状态，唤醒等待队列中的所有线程（如果有）。
5.  **tryAcquire(int arg)**：尝试以独占模式获取同步状态，返回true表示获取成功，返回false表示获取失败。需要由具体的同步器实现。
6.  **tryRelease(int arg)**：尝试以独占模式释放同步状态，返回true表示释放成功，返回false表示释放失败。需要由具体的同步器实现。
7.  **tryAcquireShared(int arg)**：尝试以共享模式获取同步状态，返回大于等于0的值表示获取成功，返回负值表示获取失败。需要由具体的同步器实现。
8.  **tryReleaseShared(int arg)**：尝试以共享模式释放同步状态，返回true表示释放成功，返回false表示释放失败。需要由具体的同步器实现。

## AQS的简单实现


AQS实现一个简单的独占锁

```java
import java.util.concurrent.locks.AbstractQueuedSynchronizer;

public class SimpleLock {
    private final Sync sync = new Sync();

    private static class Sync extends AbstractQueuedSynchronizer {
        @Override
        protected boolean tryAcquire(int arg) {
            if (compareAndSetState(0, 1)) {
                setExclusiveOwnerThread(Thread.currentThread());
                return true;
            }
            return false;
        }

        @Override
        protected boolean tryRelease(int arg) {
            if (getState() == 0) {
                throw new IllegalMonitorStateException();
            }
            setExclusiveOwnerThread(null);
            setState(0);
            return true;
        }

        @Override
        protected boolean isHeldExclusively() {
            return getState() == 1;
        }
    }

    public void lock() {
        sync.acquire(1);
    }

    public void unlock() {
        sync.release(1);
    }

    public boolean isLocked() {
        return sync.isHeldExclusively();
    }
}
```

-   tryAcquire(int arg)方法尝试获取锁，通过CAS操作将state从0设置为1。
-   tryRelease(int arg)方法释放锁，通过将state设置为0并清除当前线程的持有状态。
-   lock()方法通过调用acquire(1)获取锁。
-   unlock()方法通过调用release(1)释放锁。
-   isLocked()方法检查当前锁是否被持有。

 
