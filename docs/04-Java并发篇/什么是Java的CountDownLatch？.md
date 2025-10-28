# 什么是Java的CountDownLatch？

CountDownLatch是`java.util.concurrent` 包下的一个同步辅助类，它允许一个或多个线程等待，直到在其他线程中执行的一组操作完成。

`CountDownLatch` 通过一个计数器来实现，计数器的初始值由构造方法传入。每当一个线程完成工作后，计数器会递减。当计数器到达零时，所有等待的线程会被唤醒并继续执行。

`CountDownLatch`通常用于在并发编程中协调多个线程的[执行顺序](#控制t1、t2、t3顺序执行)。

## 主要功能

- 等待事件完成：通过 await() 方法，线程可以等待其他线程完成某些操作。
- 递减计数器：其他线程在完成各自的任务后，通过调用 countDown() 方法将计数器减 1。
- 线程同步：当计数器变为 0 时，所有调用了 await() 的线程将被唤醒并继续执行。

## 常用方法

- `CountDownLatch(int count)`：构造一个 CountDownLatch，初始计数器为 count。之后调用CountDownLatch对象的`countDown`方法会对计数器减一，直到减到0的时候，当前调用`await`方法的线程继续执行

- `await() throws InterruptedException`：调用该方法的线程等到构造方法传入的计数器减到0的时候，才能继续往下执行；
- `await(long timeout, TimeUnit unit)`：与上面的await方法功能一致，只不过这里有了时间限制，调用该方法的线程等到指定的timeout时间后，不管计数器是否减至为0，都会继续往下执行；
- `countDown()`：计数器减一
- `long getCount()`：获取当前CountDownLatch维护的值

## 应用场景

- **主线程等待子线程完成**：例如，主线程需要等待多个子线程完成初始化或加载数据。
- **多个线程起点同步**：例如，多个线程需要在同一时间点开始执行任务。
- **多个线程顺序执行**：例如，多个线程需要按照顺序执行任务。

## 演示

### 多个线程起点同步

```java
public class CountDownLatchDemo {
    private static CountDownLatch startSignal = new CountDownLatch(1);
    //用来表示裁判员需要维护的是6个运动员
    private static CountDownLatch endSignal = new CountDownLatch(6);

    public static void main(String[] args) throws InterruptedException {
        ExecutorService executorService = Executors.newFixedThreadPool(6);
        for (int i = 0; i < 6; i++) {
            executorService.execute(() -> {
                try {
                    System.out.println(Thread.currentThread().getName() + " 运动员等待裁判员响哨！！！");
                    startSignal.await();
                    System.out.println(Thread.currentThread().getName() + "正在全力冲刺");
                    endSignal.countDown();
                    System.out.println(Thread.currentThread().getName() + "  到达终点");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });
        }
        System.out.println("裁判员发号施令啦！！！");
        startSignal.countDown();
        endSignal.await();
        System.out.println("所有运动员到达终点，比赛结束！");
        executorService.shutdown();
    }
}
```

[示例来源](https://github.com/NHKNHKNHK/Java-concurrency/blob/master/25.%E5%A4%A7%E7%99%BD%E8%AF%9D%E8%AF%B4java%E5%B9%B6%E5%8F%91%E5%B7%A5%E5%85%B7%E7%B1%BB-CountDownLatch%EF%BC%8CCyclicBarrier/%E5%A4%A7%E7%99%BD%E8%AF%9D%E8%AF%B4java%E5%B9%B6%E5%8F%91%E5%B7%A5%E5%85%B7%E7%B1%BB-CountDownLatch%EF%BC%8CCyclicBarrier.md)

### 控制t1、t2、t3顺序执行

```java
public class Main {
    public static void main(String[] args) {
        CountDownLatch latch1 = new CountDownLatch(1);
        CountDownLatch latch2 = new CountDownLatch(1);

        Thread t1 = new Thread(() -> {
            System.out.println("Thread 1 is running");
            latch1.countDown(); // 线程t1执行完毕，计数器减1，通知t2线程开始执行
        });
        Thread t2 = new Thread(() -> {
            try {
                latch1.await(); // 等待t1线程执行完毕
                System.out.println("Thread 2 is running");
                latch2.countDown(); // 线程t2执行完毕，计数器减1，通知t3线程开始执行
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        });
        Thread t3 = new Thread(() -> {
            try {
                latch2.await(); // 等待t2线程执行完毕
                System.out.println("Thread 3 is running");
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        });

        t1.start();
        t2.start();
        t3.start();
    }
}
```

> 查看更多控制线程执行顺序的方法：[怎么让3个线程按顺序执行？](./怎么让3个线程按顺序执行？.md)



## 注意

由于 `CountDownLatch` 无法重用，它适合用于一次性的任务完成同步。如果需要重复使用，需要使用 CyclicBarrier 或其他机制。

> [CountDownLatch与CyclicBarrier的区别](./CountDownLatch与CyclicBarrier的区别.md)

## 扩展

### 内部实现原理

`CountDownLatch` 的内部使用 `AbstractQueuedSynchronizer`（AQS）实现。计数器的递减操作本质上是通过 AQS 来实现同步机制的。

- 当调用 `countDown()` 时，内部的 `state` 值减少，并在 `await()` 中通过检查 `state` 是否为 0 来决定是否唤醒等待线程。
