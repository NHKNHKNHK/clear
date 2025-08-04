# 怎么理解Java中的线程中断（interrupt）？

## **口语化**

首先，一个线程不应该由其他线程来强制中断或停止，而是**应该由线程自己自行停止**，自己来决定自己的命运。所以，`Thread.stop`、`Thread.suspend`、`Thread.resume`这几个方法都被废弃了。

其次，Java中没有办法立即停止一个线程，然而停止线程是一个非常重要的操作，例如取消一个耗时操作。

因此，Java提供了一种用于停止线程的**协商机制**——中断，也即中断标识协商机制。

**中断只是一个协作协商机制，Java没有给中断增加任何语法，中断的过程完全需要我们自己手动实现。**

若要中断一个线程，我们需要手动调用线程的interrupt方法，该方法也仅仅是将线程对象的中断标识设为为true

接着你需要手写代码不断地检测当前线程的标识位，如果为true，表示别的线程请求这个线程中断，此时究竟该做什么也需要我们自己手写代码实现。



每个线程对象都有一个中断标识位，用于表示线程是否被中断；该标识为为true表示中断，为false表示未中断；

通过调用线程对象的interrupt方法可以将该线程的标识为设置为true；可以在别的线程中调用，也可以在自己的线程中调用。



Java中的线程中断是一种协作机制，用于请求线程停止其所执行的任务。**线程中断并不强制终止线程**，而是通过设置线程的中断标志来通知一个正在运行的线程应该停止当前的任务并进行清理或终止。线程可以选择如何响应这个中断请求，通常是在合适的时机优雅地终止任务。



## **线程中断的核心概念**

-   **中断状态**：每个线程都有一个中断状态（interrupted status），初始值为 false。当调用 `线程.interrupt()` 方法时，该线程的中断状态被设置为 true。
-   **检查中断状态**：
    -   `线程.isInterrupted()`：检查当前线程的中断状态，但不会重置中断标志。
    -   `Thread.interrupted()`：1、检查当前线程的中断状态 2、并重置中断标志为 false
-   **响应中断**：线程可以选择如何响应中断。通常的做法是在适当的地方检查中断状态，并根据需要执行清理操作或终止线程（手写代码实现）

## **中断线程三大API**

| 方法                                | 描述                                                         |
| ----------------------------------- | ------------------------------------------------------------ |
| public void interrupt()             | 实例方法。设置线程的中断状态为true，发起一个协商而不会立即停止线程<br>// Just to set the interrupt flag |
| public static boolean interrupted() | 静态方法。判断线程是否被中断并清除当前中断状态。<br>这个方法做了两件事情：<br>    1、返回当前线程的中断状态<br>    2、将当前的中断状态清零并重设为false，清理线程的中断状态 |
| public boolean isInterrupted()      | 实例方法。判断当前线程是否已被中断                           |

注意：

​	以下阻塞方法（如Thread.sleep()、Object.wait()、BlockingQueue.take()等）会在检测到中断标志时抛出`InterruptedException`异常，并重置中断状态

​	说人话就是，如果某个线程中使用了这些方法，且这些方法正在运行，此时线程的标志位为true时，就会抛出`InterruptedException`异常

## **线程中断的行为（即中断标志位为true时）**

-   **阻塞方法**：如果线程正在执行阻塞方法（如 `Thread.sleep()`、`Object.wait()`、`BlockingQueue.take()` 等），此时线程标志位被设置为true，会抛出 `InterruptedException`，并在捕获到中断时清除中断状态（即中断状态会被设置为false，因此建议手动重新设置中断状态为true）。

-   **非阻塞代码**：对于非阻塞代码，线程需要定期检查中断状态，并根据需要处理中断请求。

```java
public class ThreadInterruptionExample {
    public static void main(String[] args) throws InterruptedException {
        // 创建并启动一个新线程
        Thread worker = new Thread(() -> {
            while (!Thread.currentThread().isInterrupted()) {
                System.out.println("Working...");
                try {
                    // 模拟长时间运行的任务
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    // 捕获中断异常并设置中断状态
                    System.out.println("Thread was interrupted, stopping...");
                    Thread.currentThread().interrupt(); // 重新设置中断状态为true
                    return;
                }
            }
            System.out.println("Thread is stopping gracefully...");
        });

        worker.start();

        // 主线程等待一段时间后中断工作线程
        Thread.sleep(2000);
        System.out.println("Main thread is interrupting the worker thread...");
        worker.interrupt();
        
        // 等待工作线程结束
        worker.join();
        System.out.println("Worker thread has finished.");
    }
}
```

在这个例子中，创建了一个worker线程，在其whele循环中不断处理任务，直到检测到线程中断状态为true。

主线程会在2s后通过worker.interrupt()方法设置worker线程的中断状态为true。worker线程内部捕获到`InterruptedException`异常，会重新设置中断状态。因此需要在catch语句中设置状态状态为true



## **线程中断的最佳实践**

-   礼貌中断：不要强制终止线程，而是通过中断机制让线程有机会进行清理和资源释放。
-   定期检查中断状态：在线程的长时间运行任务中，应定期检查中断状态，以确保能够及时响应中断请求。
-   处理阻塞方法：对于可能会抛出 InterruptedException 的阻塞方法，务必捕获异常并适当地处理。
-   重设中断状态：**在捕获 InterruptedException 后，可以考虑重新设置中断状态**，以便其他代码段也能感知到中断请求。
-   避免忽略中断：不要简单地忽略中断请求，应该根据业务逻辑合理处理。


