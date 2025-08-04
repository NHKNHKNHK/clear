# join方法有什么用？什么原理？

join方法是Thread类中一个非常重要的方法，用于**控制线程的顺序执行**。

**`join` 方法的作用**

-   **等待线程完成**：
    -   当一个线程调用另一个线程的 `join` 方法时，当前线程会被阻塞，直到被调用的线程执行完毕。
    -   这在需要确保某些操作顺序执行的情况下非常有用。

-   **控制程序执行顺序**：
    -   通过使用 `join` 方法，可以确保某些线程在其他线程完成之前不会继续执行，从而实现对程序执行顺序的控制。

**`join` 方法的原理**

join方法的原理是通过调用 wait 方法来实现的。

-   **线程同步机制**：
    -   `join` 方法本质上是一种线程同步机制，它通过让当前线程进入等待状态来实现线程间的协调。
    -   当一个线程调用另一个线程的 `join` 方法时，它会检查目标线程的状态（通过`isAlive()`方法）。如果目标线程已经完成，则立即返回；否则，当前线程会被阻塞，直到目标线程完成。

-   **超时机制**：
    -   `join` 方法还支持设置超时时间。例如，`thread.join(timeout)`，其中 `timeout` 是一个以秒为单位的时间值。
    -   如果在指定的时间内目标线程没有完成，当前线程会自动恢复执行，而不必一直等待。

源码如下：

```java
public final synchronized void join(long millis)
    throws InterruptedException {
    long base = System.currentTimeMillis();
    long now = 0;

    if (millis < 0) {
        throw new IllegalArgumentException("timeout value is negative");
    }

    if (millis == 0) {
        while (isAlive()) {
            wait(0);
        }
    } else {
        while (isAlive()) {
            long delay = millis - now;
            if (delay <= 0) {
                break;
            }
            wait(delay);
            now = System.currentTimeMillis() - base;
        }
    }
}
```
