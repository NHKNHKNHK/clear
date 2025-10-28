# 什么是Java的Semaphore？

在 Java 中，Semaphore（信号量） 是 `java.util.concurrent` 包下的一个同步工具类，用于控制多个线程对共享资源的访问权限，通过 “信号量” 来管理线程的并发数量。它的核心作用是 **控制同时访问特定资源的线程数量**，常用于实现 “限流” 或 “资源池” 等场景。比如数据库连接，假设有多个数据库连接，那么就可以使用 Semaphore 来控制并发数量，避免数据库连接被消耗殆尽。

## 核心概念

Semaphore 维护一个 **计数器**，表示可用的 “许可” 数量。线程需要先获取许可（`acquire`）才能访问资源，使用完后释放许可（`release`）。计数器的值可以是固定的，也可以在初始化时指定。

- **许可（permits）**：表示可以访问资源的线程数量。`Semaphore` 对象内部维护了一个许可计数器，线程在访问资源前需要先获取许可，访问完毕后释放许可。
- **获取许可（acquire）**：线程通过`acquire()` 方法尝试获取许可，如果没有足够的许可，线程将阻塞等待，直到有许可可用。

- **释放许可（release）**：线程在完成对共享资源的访问后，调用 `release()` 方法释放许可，将计数器加 1，使得其他等待的线程可以获取许可。

### 公平与非公平模式

Semaphore有两种模式：

- 公平模式：线程按照获取许可的顺序排队，先等待的线程优先获取许可（构造方法 `Semaphore(int permits, boolean fair) `中 fair 设为 true），防止线程饥饿。
  - 但是公平模式可能会导致性能下降

- 非公平模式（默认）：线程不保证按照获取许可的顺序获取许可，线程可能直接尝试获取许可，无需排队，可能提高吞吐量但可能导致某些线程饥饿。

## 常用方法

- `Semaphore(int permits)`	初始化信号量，permits 为许可总数（非公平模式）。
- `Semaphore(int permits, boolean fair)`	初始化信号量，fair参数可以指定公平模式。

- `void acquire()`	阻塞线程，直到获取一个许可（计数器减 1）；若计数器为 0，线程进入等待队列。
- `void acquire(int permits)`	阻塞线程，直到获取 permits 个许可（批量获取）。
- `void release()`	释放一个许可（计数器加 1），唤醒等待队列中的线程。
- `void release(int permits)`	释放 permits 个许可（批量释放）。
- `boolean tryAcquire()`	尝试获取一个许可，成功返回 true，失败立即返回 false（非阻塞）。
- `boolean tryAcquire(long timeout, TimeUnit unit)`	在指定时间内尝试获取许可，超时返回 false。
- `int availablePermits()`	返回当前可用的许可数量。
- `int getQueueLength()`  返回正在等待获取许可证的线程数
- `boolean hasQueuedThreads()`  是否有线程正在等待获取许可证
- `Collection<Thread> getQueuedThreads()`  获取所有正在等待许可的线程集合


## 演示

### 控制并发执行|限制访问数量

```java
public class Main {
    public static void main(String[] args) {
        Semaphore semaphore = new Semaphore(5);

        ExecutorService threadPool = Executors.newFixedThreadPool(10);
        for (int i = 0; i < 10; i++) {
            threadPool.execute(() -> {
                try {
                    System.out.println(Thread.currentThread().getName() + ":开始执行");
                    semaphore.acquire();
                    System.out.println(Thread.currentThread().getName() + ":获取到资源");
                    // 模拟耗时
                    TimeUnit.SECONDS.sleep(5);
                    semaphore.release();
                    System.out.println(Thread.currentThread().getName() + ":执行完毕");
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            });
        }
        threadPool.shutdown();
    }
}
```

### 控制t1、t2、t3顺序执行

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Semaphore semaphore = new Semaphore(1);

        Thread t1 = new Thread(() -> {
            try {
                System.out.println("Thread 1 is running");
            } finally {
                // 释放许可证，表示完成一个线程
                semaphore.release();
            }
        });

        Thread t2 = new Thread(() -> {
            try {
                System.out.println("Thread 2 is running");
            } finally {
                // 释放许可证，表示完成一个线程
                semaphore.release();
            }
        });

        Thread t3 = new Thread(() -> {
            try {
                System.out.println("Thread 3 is running");
            } finally {
                // 释放许可证，表示完成一个线程
                semaphore.release();
            }
        });

        // 等待线程t1执行完
        semaphore.acquire();
        t1.start();

        // 等待线程t2执行完
        semaphore.acquire();
        t2.start();

        // 等待线程t3执行完
        semaphore.acquire();
        t3.start();
    }
}
```

> 查看更多控制线程执行顺序的方法：[怎么让3个线程按顺序执行？](./怎么让3个线程按顺序执行？.md)

## 注意事项

- 线程安全：`Semaphore` 内部通过 CAS 或锁实现线程安全，无需额外同步。
- 异常处理：`acquire()` 会抛出 `InterruptedException`，需合理处理线程中断。
- 与 `CountDownLatch` 的区别：
  - `Semaphore` 的许可可以重复释放和获取（计数器循环变化），用于控制并发数量。
  - `CountDownLatch` 的计数器只能递减一次（从初始值到 0），用于等待多个线程完成任务。

## 总结

Semaphore 是并发编程中控制资源访问的重要工具，通过 “许可” 机制实现对线程并发量的精准控制，适用于限流、资源池、管道流量控制等场景。合理使用公平模式和超时机制，可以避免线程饥饿并提升系统稳定性。