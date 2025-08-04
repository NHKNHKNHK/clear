# 线程什么时候主动放弃CPU

线程主动放弃 CPU常见的有以下几种方式

1.  调用Thread.yield()方法
2.  调用Thread.sleep(long millis)方法
3.  调用Object.wait()方法
4.  调用Thread.join()方法
5.  调用LockSupport.park()方法



## **Thread.yield()**

Thread.yield()是一个静态方法，通知调度器当前线程愿意放弃 CPU 使用权，让其他同优先级或更高优先级的线程有机会运行。它只是一个提示，操作系统可以选择忽略这个提示。

场景

-   **调试和性能优化**：在某些情况下，yield()可以用于调试和性能优化，帮助识别线程调度问题。

-   **避免资源独占**：在某些高优先级的任务中，使用yield()可以避免线程长时间独占 CPU，稍微改善系统响应时间。

## **Thread.sleep(long millis)**

Thread.sleep(long millis)使当前线程进入休眠状态，暂停执行指定的毫秒数。休眠期间，线程保持 CPU 使用权，但不执行任何代码。

场景

-   **定时任务**：在需要定时执行任务的场景中，sleep()可以用于实现简单的定时等待。
-   **模拟延迟**：在测试和模拟场景中，sleep()可以用于模拟网络延迟或其他等待时间。

## **Object.wait()**

Object.wait()使当前线程等待（阻塞），直到其他线程调用notify()或notifyAll()方法唤醒它。wait()必须在同步块或同步方法中调用。

场景

-   **线程间通信**：在生产者-消费者模型中，wait()和notify()用于协调生产者和消费者线程之间的工作

```java
public class WaitNotifyExample {
    private static final Object lock = new Object();

    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            synchronized (lock) {
                try {
                    System.out.println(Thread.currentThread().getName() + " is waiting");
                    lock.wait();
                    System.out.println(Thread.currentThread().getName() + " is resumed");
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }, "Thread-1");

        Thread t2 = new Thread(() -> {
            synchronized (lock) {
                System.out.println(Thread.currentThread().getName() + " is notifying");
                lock.notify();
            }
        }, "Thread-2");

        t1.start();
        try {
            Thread.sleep(1000); // 确保 t1 先执行
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        t2.start();
    }
}
```

## **Thread.join()**

Thread.join()使当前线程等待，直到另一个线程执行完毕。可以指定等待时间，也可以无限期等待。

场景

-   **线程协调**：在需要确保某些线程在其他线程之前完成时，使用join()来协调线程的执行顺序。

## **LockSupport.park()**

LockSupport.park()使当前线程阻塞，直到被其他线程通过`LockSupport.unpark(thread)`唤醒。park()不会释放线程持有的锁，但可以响应中断。

>   补充：
>
>   调用LockSupport.park()不会阻塞线程的情况，就是调用LockSupport.park()方法进行阻塞之前，其他线程先调用了`LockSupport.unpark(thread)`，为该线程提前颁发了许可凭证

场景

-   **线程控制**：在需要精细控制线程行为的场景中，park()和unpark()提供了更底层和灵活的线程控制机制。

```java
import java.util.concurrent.locks.LockSupport;

public class LockSupportExample {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            System.out.println(Thread.currentThread().getName() + " is going to park.");
            LockSupport.park();
            System.out.println(Thread.currentThread().getName() + " has been unparked.");
        }, "Thread-1");

        t1.start();

        try {
            Thread.sleep(3000); // 让线程运行3秒
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        System.out.println("Unparking Thread-1.");
        LockSupport.unpark(t1); // 唤醒线程
    }
}
```
