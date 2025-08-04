# sleep和wait的主要区别？

sleep和wait都是可以让线程暂停执行，但他们有明显的区别

**使用方式不同**

-   wait方法必须在**synchronize同步块或同步方法内调用**，否则会抛出`IlleageMonitorStateException`异常。
    -   这是因为wait依赖于对象锁来管理线程的等待和唤醒机制。
-   sleep方法可以**在任何上下文中调用，不需要获取对象锁**。调用后，线程会进入休眠状态

**锁状态不同**

-   wait方法调用后，当前线程**会释放**掉它所持有的**对象锁**，并进入等待状态
-   sleep方法调用后，线程会进入休眠状态，但**不会释放它所持有的任何锁**

**方法所属类不同**

-   wait方法属于Object类
-   sleep方法属于Thread类，是静态方法

**恢复方式不同**

-   wait方法：需要被其他线程调用notify或notifyAll 显示唤醒，或被wait(long time)的超时时间参数唤醒
-   sleep方法：在指定的时间后，自行恢复运行，或通过抛出`InterruptedException`恢复

**用途不同**

-   wait方法：通常用于线程间通信，配合notify或notifyAll 来实现线程的协调工作
-   sleep方法：用于让线程暂停执行一段时间，通常用于控制线程的执行频率或模拟延时、定时器等



## **扩展**——常见错误

-   **误用sleep**：有时候开发者会错误使用sleep进行线程间通信，但是sleep不释放锁，可能会导致其他线程无法进入同步块，造成线程饥饿或死锁
-   **忽略中断**：sleep可能会抛出`InterruptedException`（即线程中断状态标志位为true时），如果不正确处理中断信号，可能会导致线程提前退出或错误行为。
    -   原因：当中断状态为true时，sleep会抛出`InterruptedException`，中断状态会被清除为false，因此需要显式的在catch中重新设置中断状态为true
