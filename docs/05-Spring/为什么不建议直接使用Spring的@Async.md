---
permalink: /25/10/22/spring/async
---

# 为什么不建议直接使用Spring的@Async

在 Spring 中使用@Async可以便捷地实现异步方法调用，但不建议直接随意使用，主要原因在于其默认配置存在一些隐藏问题，若使用不当可能导致业务异常或性能风险。

**默认线程池配置不合理**

`@Async`默认使用的线程池是`SimpleAsyncTaskExecutor`，其行为存在明显缺陷
- **无上限创建线程**：该线程池不会复用线程，默认情况下每次调用都会创建新线程。若异步任务并发量高（如大量请求触发异步操作），会导致 JVM 创建大量线程，引发OOM（内存溢出）或线程调度开销激增，严重影响系统稳定性。
- **无队列缓冲**：缺乏任务队列缓冲机制，无法应对突发流量，任务直接通过新建线程执行，极端情况下会压垮系统。
    
在`AsyncExecutionInterceptor`中，在这个类中有一个`getDefaultExecutor`方法，当我们没有做过自定义线程池的时候，就会用`SimpleAsyncTaskExecutor`这个线程池。

```java
@Override
protected Executor getDefaultExecutor(BeanFactory beanFactory) {
    Executor defaultExecutor = super.getDefaultExecutor(beanFactory);
    return (defaultExecutor != null ? defaultExecutor : new SimpleAsyncTaskExecutor());
}
```
:::warning 注意
这里不是无脑的的直接创建一个新的线程池
:::

SimpleAsyncTaskExecutor这玩意坑很大，其实他并不是真的线程池，它是不会重用线程的，每次调用都会创建一个新的线程，
也没有最大线程数设置。并发大的时候会产生严重的性能问题。

他的doExecute核心逻辑如下：  

```java
/**
 * Template method for the actual execution of a task.
 * <p>The default implementation creates a new Thread and starts it.
 * @param task the Runnable to execute
 * @see #setThreadFactory
 * @see #createThread
 * @see java.lang.Thread#start()
 */
protected void doExecute(Runnable task) {
    Thread thread = (this.threadFactory != null ? this.threadFactory.newThread(task) : createThread(task));
    thread.start();
}
```

所以，我们应该自定义线程池来配合`@Async`使用，而不是直接就用默认的

**异常处理机制不明确**

异步方法的异常默认不会主动抛出，若未妥善处理，可能导致业务逻辑异常被隐藏：

- 当异步方法返回`void`时，异常会被`AsyncUncaughtExceptionHandler`处理（默认仅打印日志，不影响主线程），但开发者可能因未感知异常而忽略错误。
- 若返回`Future`或`CompletableFuture`，需显式调用`get()`或处理回调才能捕获异常，否则异常会被静默丢弃，增加问题排查难度。

**线程池管理混乱**

若项目中多个`@Async`方法未指定自定义线程池，可能导致：
- 所有异步任务共用默认线程池，不同业务的任务相互干扰（如耗时任务阻塞短任务）。
- 线程池参数（如核心线程数、最大线程数、队列长度）无法根据业务场景定制，难以优化性能。

**事务与异步的冲突**

@Async与@Transactional结合使用时，可能出现事务失效或数据不一致：

- 异步方法默认在新线程中执行，若其内部调用的方法依赖当前线程的事务上下文（如@Transactional标注的方法），可能因线程隔离导致事务无法正确传播。
- 若异步任务依赖主线程的事务提交结果（如主线程保存数据后，异步任务读取该数据），可能因事务未提交而读取到旧数据。

**任务超时与资源释放问题**

默认配置下，`@Async`任务无超时控制：

- 若异步任务执行时间过长（如网络阻塞、死循环），会长期占用线程资源，导致线程池耗尽，后续任务无法执行。
- 缺乏任务取消机制，难以在系统 shutdown 时优雅地终止未完成的异步任务，可能导致资源泄露。


## 正确使用方式：自定义线程池

若需使用@Async，建议配合自定义线程池，并做好异常与资源管理：

1、自定义线程池：通过ThreadPoolTaskExecutor配置合理的线程参数（核心线程数、最大线程数、队列容量、拒绝策略等），避免线程无限制创建。

```java
@Configuration
@EnableAsync // 此注解也可以放在启动类
public class AsyncConfig {
    @Bean("customExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10); // 核心线程数
        executor.setMaxPoolSize(20); // 最大线程数
        executor.setQueueCapacity(100); // 队列容量
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy()); // 拒绝策略（如让提交者线程执行）
        executor.setThreadNamePrefix("async-task-");
        executor.initialize();
        return executor;
    }
}
```

2、指定线程池：在@Async中显式指定自定义线程池，避免使用默认线程池

```java
@Async("customExecutor")
public void asyncMethod() {
    // 业务逻辑
}
```

3、完善异常处理：

- 对于返回void的方法，实现AsyncConfigurer自定义AsyncUncaughtExceptionHandler。
- 对于返回Future/CompletableFuture的方法，通过exceptionally()或get()捕获异常。

4、控制任务超时：结合CompletableFuture的超时机制（如orTimeout()），避免任务长期阻塞

