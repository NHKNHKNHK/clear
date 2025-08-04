# interrupt和stop有什么区别？

## **interrupt方法**

interrupt方法用于让线程中断，是一种协作机制，用于请求线程停止其所执行的任务。**线程中断并不强制终止线程**，而是通过设置线程的中断标志来通知一个正在运行的线程应该停止当前的任务并进行清理或终止。**线程可以选择如何响应这个中断请求，通常是在合适的时机优雅地终止任务。**

特点

-   非强制性：线程可以选择是否响应中断请求。

-   中断状态：调用 **interrupt()** 会将线程的中断状态设置为 **true**。

-   阻塞方法interrupt()的行为：
    -   如果线程在执行阻塞方法时（如 Thread.sleep()、Object.wait()、BlockingQueue.take() 等）中被中断，这些方法会抛出 InterruptedException 并清除中断状态。
    -   如果线程没有处于阻塞状态，则需要手动检查中断状态并决定如何处理。

```java
Thread thread = new Thread(() -> {
    while (!Thread.currentThread().isInterrupted()) {
        System.out.println("Working...");
        try {
            Thread.sleep(1000); // 模拟阻塞操作
        } catch (InterruptedException e) {
            System.out.println("Thread was interrupted, stopping...");
            return; // 响应中断请求并退出
        }
    }
});
thread.start();
Thread.sleep(2000); // 主线程等待一段时间
thread.interrupt(); // 发送中断请求
thread.join(); // 线程线程结束才会结束主线程
```

## **stop()方法**

stop() 是一种**强制终止线程**的方法，直接停止线程的执行（直接进入**死亡状态**），并**释放线程持有的所有锁**。

特点

-   强制性：调用 stop() 会立即终止线程，无论线程当前正在做什么。

-   危险性：
    -   可能导致**资源泄漏**（如文件未关闭、数据库连接未释放等）。run()即刻停止，可能会导致一些清理性的工作得不到完成，如文件，数据库等的关闭
    -   可能导致**数据不一致**（如线程在更新共享数据时被强制终止）。
    -   可能引发**死锁**问题（因为线程持有的锁会被突然释放）。
-   **已废弃**：由于上述问题，stop() 方法在 Java 早期版本中就被标记为不推荐使用（deprecated）。

```java
Thread thread = new Thread(() -> {
    while (true) {
        System.out.println("Working...");
        try {
            Thread.sleep(1000); // 模拟阻塞操作
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
});
thread.start();
Thread.sleep(2000); // 主线程等待一段时间
thread.stop(); // 强制终止线程
```

>   注意：虽然 stop() 方法仍然可以使用，但它已经被废弃，不应在现代 Java 程序中使用。
>

## **主要区别**

| 特性           | interrupt()                          | stop()                               |
| -------------- | ------------------------------------ | ------------------------------------ |
| 强制性         | 非强制性，线程可以选择是否响应       | 强制终止线程，释放线程持有的所有锁   |
| 安全性         | 安全，允许线程进行清理和资源释放     | 不安全，可能导致资源泄漏或数据不一致 |
| 中断状态       | 设置线程的中断状态为 true            | 无中断状态的概念                     |
| 阻塞方法的行为 | 抛出 InterruptedException 并清除状态 | 直接终止线程                         |
| 推荐使用       | 推荐使用的线程终止方式               | 已废弃，不推荐                       |

