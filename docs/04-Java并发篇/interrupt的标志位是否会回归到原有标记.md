# interrupt的标志位是否会回归到原有标记

当一个线程被中断时，其中断状态会被设置为true。然而，当InterruptedException被抛出时，中断状态会被清除，即标志位会被重置为false。如果你不显式地重新设置中断状态，其他代码将无法检测到这个中断。

```java
class Worker implements Runnable {
    @Override
    public void run() {
        try {
            // 模拟阻塞操作，如 Thread.sleep 或 wait
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            // 捕获 InterruptedException 后，中断状态会被清除
            System.out.println("Thread was interrupted: " + Thread.currentThread().isInterrupted()); // false
            // 恢复中断状态
            Thread.currentThread().interrupt();
            System.out.println("Thread was interrupted: " + Thread.currentThread().isInterrupted()); // true
        }
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(new Worker());
        thread.start();
        Thread.sleep(1000); // 确保线程已经开始执行
        thread.interrupt(); // 中断线程
    }
}
```

在这个示例中：

1.  Thread.sleep(2000)模拟一个阻塞操作。
2.  当线程被中断时，会抛出InterruptedException，此时中断状态会被清除。
3.  在catch块中，打印中断状态会显示false，因为中断状态已经被清除。
4.  调用Thread.currentThread().interrupt()恢复中断状态。
5.  再次打印中断状态，这次会显示true。



当InterruptedException被抛出时，中断状态会被清除。因此，如果你希望其他代码能够检测到线程曾经被中断，应该在catch块中显式地调用Thread.currentThread().interrupt()来恢复中断状态。这样可以确保线程间的中断通信能够正确进行，保持程序的健壮性和可维护性。


