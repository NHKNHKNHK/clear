# Java的线程优先级是什么？有什么用？

在Java中，每个线程都有一个优先级，优先级决定了线程调度器对线程的调度顺序。线程的优先级是一个整数值，范围在1到10之间。

Java 中的线程优先级用于指示线程调度器（Thread Scheduler）在分配 CPU 时间时对不同线程的重视程度。线程优先级是一个整数值，范围从 1 到 10，默认情况下所有线程的优先级为 5（即 NORM_PRIORITY）。优先级越高，线程越有可能被优先执行。

## **优先级常量**

Java 提供了三个静态常量来表示常见的优先级：

-   MIN_PRIORITY：最低优先级，值为 1。

-   NORM_PRIORITY：默认优先级，值为 5。
-   MAX_PRIORITY：最高优先级，值为 10。

## **线程优先级的作用**

口语化：线程优先级是对线程调度器的一种建议，调度器会根据优先级来决定哪个线程应该优先执行。然而，线程优先级并不能保证线程一定会按照优先级顺序执行，具体的调度行为依赖于操作系统的线程调度策略。

-   **影响调度顺序**：优先级较高的线程更有可能被调度器选中执行。然而，这并不意味着高优先级线程一定会立即执行，具体行为取决于操作系统的调度策略。
-   **资源分配**：在某些操作系统上，线程优先级可以影响 CPU 时间片的分配。高优先级线程可能会获得更多的 CPU 时间片，从而更快完成任务。
-   **提高响应性**：对于需要快速响应的任务（如用户界面事件处理），可以适当提高其优先级以确保及时处理。
-   **避免饥饿**：如果某些线程的优先级过低，可能会导致它们长时间得不到执行机会（即“饥饿”现象）。合理设置优先级可以避免这种情况。

## **设置线程优先级**

可以通过`setPriority(int newPriority)`方法来设置线程的优先级。需要注意的是，设置的优先级必须在1到10之间，否则会抛出`IllegalArgumentException`

```java
public class ThreadPriorityExample {
    public static void main(String[] args) {
        Thread lowPriorityThread = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                System.out.println("Low priority thread running");
            }
        });
        lowPriorityThread.setPriority(Thread.MIN_PRIORITY);

        Thread highPriorityThread = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                System.out.println("High priority thread running");
            }
        });
        highPriorityThread.setPriority(Thread.MAX_PRIORITY);

        lowPriorityThread.start();
        highPriorityThread.start();
    }
}
```

我们创建了两个线程，一个设置为最低优先级，一个设置为最高优先级。通常情况下，系统会优先调度高优先级的线程执行，但这并不是绝对的，具体行为依赖于操作系统的调度策略。

## **注意事项**

-   **不可过度依赖优先级**：线程优先级只是一个提示，具体的调度行为仍然由操作系统决定。不要完全依赖优先级来控制程序的行为，尤其是在跨平台应用中，不同操作系统的调度策略可能有所不同。

-   **避免频繁调整优先级**：频繁调整线程优先级可能会导致性能问题，并且难以预测实际效果。通常只在必要时进行调整。应该更多地通过设计合理的并发控制机制（如锁、信号量、条件变量等）来管理线程。

-   **主调用栈限制**：Java 规范要求主线程（main thread）的优先级不能低于其他线程。因此，设置线程优先级时需要注意这一点。

-   **守护线程不受影响**：守护线程（Daemon Thread）的优先级设置与普通线程相同，但它们不会影响 JVM 的退出行为。
