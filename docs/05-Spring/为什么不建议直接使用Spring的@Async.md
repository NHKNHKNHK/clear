---
permalink: /25/10/22/spring/async
---

# 为什么不建议直接使用Spring的@Async

在 Spring 中使用`@Async`可以便捷地实现异步方法调用，但不建议直接随意使用，主要原因在于其
默认配置存在一些隐藏问题，若使用不当可能导致业务异常或性能风险。分析如下：

## 使用@Async，默认配置隐藏的问题

### **默认线程池配置不合理**（核心原因）

`@Async`默认使用的线程池是`SimpleAsyncTaskExecutor`，其行为存在明显缺陷。
他并不是真的线程池，它是不会重用线程的，每次调用都会创建一个新的线程，也没有最大线程数设置
- **无上限创建线程**：该线程池不会复用线程，默认情况下每次调用都会创建新线程。若异步任务并发量高（如大量请求触发异步操作），会导致 JVM 创建大量线程，引发OOM（内存溢出）或线程调度开销激增，严重影响系统稳定性。
- **无队列缓冲**：缺乏任务队列缓冲机制，无法应对突发流量，任务直接通过新建线程执行，极端情况下会压垮系统。

建议：定义自定义线程池来配合`@Async`使用，而不是直接就用默认的

::::details 源码级分析    
在`AsyncExecutionInterceptor`中，在这个类中有一个`getDefaultExecutor`方法，当我们没有做过自定义线程池的时候，
就会用`SimpleAsyncTaskExecutor`这个线程池。

```java
@Nullable
protected Executor getDefaultExecutor(@Nullable BeanFactory beanFactory) {
    Executor defaultExecutor = super.getDefaultExecutor(beanFactory);
    return (Executor)(defaultExecutor != null ? defaultExecutor : new SimpleAsyncTaskExecutor());
}
```

:::warning 注意
这里不是无脑的的直接创建一个新的线程池
:::

在`getDefaultExecutor`的实现中，并不是一上来就直接`new SimpleAsyncTaskExecutor()`的，而是先尝试着获取默认的执行器。

`super.getDefaultExecutor(beanFactory)`代码如下：

```java
// 注意：以下代码删除了日志打印，只保留了核心逻辑
protected Executor getDefaultExecutor(@Nullable BeanFactory beanFactory) {
    if (beanFactory != null) {
        try {
            return (Executor)beanFactory.getBean(TaskExecutor.class); // [!code focus]
        } catch (NoUniqueBeanDefinitionException var6) {
            this.logger.debug();

            try {
                return (Executor)beanFactory.getBean("taskExecutor", Executor.class); // [!code focus]
            } catch (NoSuchBeanDefinitionException var4) {
                if (this.logger.isInfoEnabled()) {
                    this.logger.info();
                }
            }
        } catch (NoSuchBeanDefinitionException var7) {
            this.logger.debug();

            try {
                return (Executor)beanFactory.getBean("taskExecutor", Executor.class); // [!code focus]
            } catch (NoSuchBeanDefinitionException var5) {
                this.logger.info(); 
            }
        }
    }

    return null;
}
```

简单总结一下，此方法的逻辑就是会先尝试获取`TaskExecutor`的实现类，这里如果能且仅能找到唯一一个，那么就用这个，
如果找不到，或者找到了多个，那么就会走到`catch (NoUniqueBeanDefinitionException ex) `和
`catch (NoSuchBeanDefinitionException ex)`的分支中，这里就是获取beanName为taskExecutor的Bean

如果此方法没有查询到可用的线程池，那么就会`new SimpleAsyncTaskExecutor()`创建执行器

所以也就是说，只要我们仅定义了一个自定义线程池，那么他就会使用我们定义的这个线程池，如果定义的线程池不唯一，那么就会使用
`SimpleAsyncTaskExecutor`，它是Spring为我们提供的一个兜底机制

但是呢它的性能又不太行，所以建议我们手动实现自定义线程池。

:::tip

有时候，我们定义了线程池，使用了`@Async`注解，但是没有指定线程池，它也能能用。正是因为`super.getDefaultExecutor(beanFactory)`
方法的存在，如果项目全局只要一个线程池，那么就会使用这个线程池

但是这样不靠谱，如果我们在项目中又定义了新的线程池，那么`@Async`将会使用`new SimpleAsyncTaskExecutor()`创建的执行器了

因此建议，使用`@Async`注解时手动指定线程池，如：`@Async("customExecutor")`
:::

**总结**
- 生产中，我们应该自定义线程池来配合`@Async`使用，而不是直接就用默认的

::::

### **异常处理机制不明确**

异步方法的异常默认不会主动抛出，若未妥善处理，可能导致业务逻辑异常被隐藏：

- 当异步方法返回`void`时，异常会被`AsyncUncaughtExceptionHandler`处理（默认仅打印日志，不影响主线程），但开发者可能因未感知异常而忽略错误。
- 若返回`Future`或`CompletableFuture`，需显式调用`get()`或处理回调才能捕获异常，否则异常会被静默丢弃，增加问题排查难度。

### **线程池管理混乱**

若项目中多个`@Async`方法未指定自定义线程池，可能导致：
- 所有异步任务共用默认线程池，不同业务的任务相互干扰（如耗时任务阻塞短任务）。
- 线程池参数（如核心线程数、最大线程数、队列长度）无法根据业务场景定制，难以优化性能。

### **事务与异步的冲突**

`@Async`与`@Transactional`结合使用时，可能出现事务失效或数据不一致：

- 异步方法默认在新线程中执行，若其内部调用的方法依赖当前线程的事务上下文（如`@Transactional`标注的方法），可能因线程隔离导致事务无法正确传播。
- 若异步任务依赖主线程的事务提交结果（如主线程保存数据后，异步任务读取该数据），可能因事务未提交而读取到旧数据。

### **任务超时与资源释放问题**

默认配置下，`@Async`任务无超时控制：

- 若异步任务执行时间过长（如网络阻塞、死循环），会长期占用线程资源，导致线程池耗尽，后续任务无法执行。
- 缺乏任务取消机制，难以在系统 shutdown 时优雅地终止未完成的异步任务，可能导致资源泄露。


## 正确使用方式：自定义线程池

若需使用@Async，建议配合自定义线程池，并做好异常与资源管理：

1、自定义线程池：通过`ThreadPoolTaskExecutor`配置合理的线程参数（核心线程数、最大线程数、队列容量、拒绝策略等），避免线程无限制创建。

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

2、指定线程池：在`@Async`中显式指定自定义线程池，避免使用默认线程池

```java
@Async("customExecutor")
public void asyncMethod() {
    // 业务逻辑
}
```

3、完善异常处理：

- 对于返回`void`的方法，实现`AsyncConfigurer`自定义`AsyncUncaughtExceptionHandler`。
- 对于返回`Future/CompletableFuture`的方法，通过`exceptionally()`或`get()`捕获异常。

4、控制任务超时：结合`CompletableFuture`的超时机制（如`orTimeout()`），避免任务长期阻塞

