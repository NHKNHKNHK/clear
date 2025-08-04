# 为什么多线程执行时，需要catch InterruptedException异常，catch里面写啥

在多线程编程中，捕获InterruptedException是非常重要的，因为它是线程间通信的一种方式，用于通知线程应该停止当前的工作并尽快退出。

**为什么需要捕获InterruptedException**

-   **线程中断机制**：InterruptedException是 Java 提供的一种机制，用于中断线程的执行。当一个线程被其他线程中断时（通过调用interrupt()方法），如果该线程正在等待、睡眠或尝试获取锁，则会抛出InterruptedException

-   **资源清理**：捕获并处理InterruptedException可以确保在线程被中断时，进行必要的资源清理工作，以避免资源泄漏。

-   **响应中断**：捕获InterruptedException并适当地处理它，可以使线程更好地响应中断请求，遵循良好的线程中断协议。

**在catch块中应该做什么**

-   **恢复中断状态**：如果你不打算立即响应中断，可以在捕获InterruptedException后恢复线程的中断状态，以便上层调用者能够知道线程曾经被中断。

-   **资源清理**：在捕获异常后进行必要的资源清理，比如关闭文件、释放锁等。

-   **退出线程**：如果线程应该响应中断并退出，可以在捕获异常后适当地退出线程。

