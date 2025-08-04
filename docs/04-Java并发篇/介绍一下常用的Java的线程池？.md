# 介绍一下常用的Java的线程池？

**FixedThreadPool（固定大小线程池）**

特点：

-   创建一个固定大小的线程池。
-   每次提交任务时，如果线程池中有空闲线程，则立即执行；如果没有空闲线程，则将任务放入队列中等待。
-   适用于**负载较重、任务数量较多**且持续有新任务到来的场景。

```java
ExecutorService fixedThreadPool = Executors.newFixedThreadPool(5);
```

**CachedThreadPool（缓存线程池）**

线程池中线程数量不固定，可以根据需要自动创建新线程。当提交新任务时，如果没有空闲线程，则会创建新线程。

特点

-   创建一个根据需要创建新线程的线程池，但在之前构造的线程可用时将重用它们。
-   适用于**执行大量短生命周期的任务**，线程池会根据需要动态调整线程数量。
-   如果线程在60秒内未被使用，则会被终止并从缓存中移除。

```java
ExecutorService cachedThreadPool = Executors.newCachedThreadPool();
```

**SingleThreadExecutor（单线程池）**

特点

-   创建一个只有一个线程的线程池。
-   保证所有任务按照提交顺序依次执行（FIFO）。
-   适用于需要**串行**执行任务的场景，确保任务不会并发执行

```java
ExecutorService singleThreadExecutor = Executors.newSingleThreadExecutor();
```

**ScheduledThreadPool（定时线程池）**

特点：

-   创建一个支持定时及周期性任务执行的线程池。

-   可以安排命令在给定的延迟后运行，或者定期执行（类似于Timer类，但更灵活且功能更强大）。

-   适用于需要**定时**或**周期**性执行任务的场景

```java
ScheduledExecutorService scheduledThreadPool = Executors.newScheduledThreadPool(4);

// 安排任务在指定延迟后执行
scheduledThreadPool.schedule(() -> System.out.println("Delayed Task"), 5, TimeUnit.SECONDS);

// 安排任务周期性执行
scheduledThreadPool.scheduleAtFixedRate(() -> System.out.println("Periodic Task"), 0, 2, TimeUnit.SECONDS);
```

**WorkStealingPool（工作窃取线程池）**

使用多个工作队列减少竞争，适用于并行计算。线程池中的线程数量是`Runtime.getRuntime().availableProcessors()`的返回值。适用于需要大量并行任务的场景。

特点：

-   创建一个工作窃取线程池，使用 ForkJoinPool 实现。
-   线程池中的线程可以“窃取”其他线程的任务来执行，从而提高 CPU 利用率。
-   适用于处理大量细粒度的任务，特别适合**并行计算任务**。

```java
ExecutorService workStealingPool = Executors.newWorkStealingPool();
```

**自定义线程池**

除了上述预定义的线程池外，还可以使用 `ThreadPoolExecutor` 类来自定义线程池，以满足特定需求。例如，可以通过设置核心线程数、最大线程数、队列类型等参数来创建更灵活的线程池。

```java
import java.util.concurrent.*;

public class CustomThreadPoolExample {
    public static void main(String[] args) {
        ThreadPoolExecutor customThreadPool = new ThreadPoolExecutor(
            2, // 核心线程数
            4, // 最大线程数
            60L, TimeUnit.SECONDS, // 线程空闲时间
            new LinkedBlockingQueue<Runnable>(), // 任务队列
            new ThreadPoolExecutor.CallerRunsPolicy() // 拒绝策略
        );

        // 提交任务
        for (int i = 0; i < 10; i++) {
            customThreadPool.execute(() -> System.out.println("Task " + Thread.currentThread().getName()));
        }

        // 关闭线程池
        customThreadPool.shutdown();
    }
}
```

