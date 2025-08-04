# 线程池相关的常用API？

​	JDK5.0 之前，我们必须手动自定义线程池。**从 JDK5.0 开始，Java 内置线程池相关的API**。在 `java.util.concurrent` 包下提供了线程池相关 API：`ExecutorService`接口 和 `Executors`工厂类。 

-   ExecutorService：真正的线程池接口。常见子类 **ThreadPoolExecutor** 
    -   `void execute(Runnable command)`：执行任务/命令，没有返回值，一般用来执行 Runnable
    -   `<T> Future<T> submit(Callable<T> task)`：执行任务，有返回值，一般又来执行 Callable 
    -   `void shutdown()` ：关闭连接池 
-   Executors：一个**线程池的工厂类**，通过此类的**静态工厂方法**可以创建多种类型的线程池对象。 
    -   `Executors.newCachedThreadPool()`：创建一个可根据需要创建新线程的线程池
    -   `Executors.newFixedThreadPool(int nThreads)`：创建一个可重用固定线程数的线程池 
    -   `Executors.newSingleThreadExecutor()` ：创建一个只有一个线程的线程池 
    -   `Executors.newScheduledThreadPool(int corePoolSize)`：创建一个线程池，它可安排在给定延迟后运行命令或者定期地执行。 

下面是java.util.concurrent包下 ThreadPoolExecutor 类中参数最多的一个构造器

```java
public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory,
                              RejectedExecutionHandler handler)
    	

// corePoolSize：线程池的核心线程数。在没有任务执行时，线程池会保持这些核心线程的数量。
// 即使这些线程处于空闲状态，它们也不会被销毁。当有新的任务提交时，线程池会优先使用核心线程来执行任务。

// maximumPoolSize：线程池的最大线程数。线程池中允许创建的最大线程数，包括核心线程和非核心线程。
// 当任务提交的数量超过核心线程数，并且任务队列已满时，线程池会创建新的非核心线程来执行任务，直到达到最大线程数。

// keepAliveTime：非核心线程的空闲时间。当线程池中的线程数量超过核心线程数时，空闲的非核心线程会在指定的时间内保持存活状态。如果在这段时间内没有新的任务提交，这些线程将被销毁。

// unit：空闲时间的时间单位。指定 keepAliveTime 参数的时间单位，例如 TimeUnit.SECONDS 表示秒。

// workQueue：任务队列。用于存储待执行的任务的阻塞队列。当线程池中的线程都在执行任务时，新的任务会被放入任务队列中等待执行。

// threadFactory：线程工厂。用于创建新线程的工厂对象。可以自定义线程的创建逻辑，例如设置线程的名称、优先级等。
- SynchronousQueue：直接提交队列
- ArrayBlockingQueue：有界队列，可以指定容量
- LinkedBlockingQueue：有界|无界队列
- PriorityBlockingQueue：优先任务队列，可以根据任务的优先级顺序执行
- DelayQueue：延迟任务

// handler：拒绝策略。当线程池已经达到最大线程数，并且任务队列已满时，新的任务无法提交时，会触发拒绝策略来处理这些被拒绝的任务。
// 可以使用预定义的拒绝策略，如 ThreadPoolExecutor.AbortPolicy、ThreadPoolExecutor.DiscardPolicy、ThreadPoolExecutor.DiscardOldestPolicy 或自定义的拒绝策略。 
```


