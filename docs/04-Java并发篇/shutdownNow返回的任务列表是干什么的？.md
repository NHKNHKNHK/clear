# shutdownNow返回的任务列表是干什么的？

它其实是将哪些还没执行完的任务退还给你的，你可以进行进一步的处理。例如，可以打日志、落盘到数据库、甚至丢到其他线程池中进行执行等

**源码**

```java
public List<Runnable> shutdownNow() {
    List<Runnable> tasks;
    final ReentrantLock mainLock = this.mainLock;
    mainLock.lock();
    try {
        checkShutdownAccess();
        advanceRunState(STOP);
        interruptWorkers();
        tasks = drainQueue();
    } finally {
        mainLock.unlock();
    }
    tryTerminate();
    return tasks;
}
```