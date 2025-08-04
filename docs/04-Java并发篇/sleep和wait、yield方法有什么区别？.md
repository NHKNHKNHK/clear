# sleep和wait、yield方法有什么区别？

## **Thread.sleep**

sleep是Thead类中的静态方法，用于让当前线程睡眠，进入阻塞状态。

-   作用：使当前正在执行的线程暂停执行指定的时间（以毫秒为单位），**让出 CPU** 给其他线程。

-   特点：
    -   **不释放锁**（即如果当前线程持有某个对象的同步锁，在睡眠期间不会释放该锁）。
    -   必须捕获 InterruptedException 异常，因为当另一个线程中断了正在睡眠的线程时会抛出此异常。

-   适用场景：用于实现定时任务或需要线程暂停一段时间后再继续执行的情况。

```java
try {
    Thread.sleep(1000); // 线程暂停1秒
} catch (InterruptedException e) {
    e.printStackTrace();
}
```

## **Object.wait**

wait是Object类中的实例方法，**必须由同步锁对象调用**（这一点是与其他方法最大的不同），用于让当前线程睡眠，进入阻塞状态。

-   作用：使当前线程等待，直到另一个线程调用同一个对象上的 notify() 或 notifyAll() 方法唤醒它。
-   特点：
    -   必须在同步代码块中调用（即必须获取对象的锁后才能调用 wait 方法），并且**会释放锁（对象锁）**。
    -   可以指定等待时间，超时后自动唤醒；如果不指定时间，则一直等待直到被唤醒。
    -   同样需要处理 InterruptedException 异常。
-   适用场景：通常用于线程间通信，比如生产者-消费者模式。

```java
public class WaitNotifyExample {
    private static final Object lock = new Object();

    public static void main(String[] args) {
        Thread waitingThread = new Thread(() -> {
            synchronized (lock) {
                try {
                    System.out.println("Thread is waiting");
                    lock.wait(); // 进入等待状态，并释放锁
                    System.out.println("Thread is resumed");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        Thread notifyingThread = new Thread(() -> {
            synchronized (lock) {
                try {
                    Thread.sleep(2000); // 休眠2秒
                    System.out.println("Thread is going to notify");
                    lock.notify(); // 唤醒等待线程
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        waitingThread.start();
        notifyingThread.start();
    }
}
```

## **Thread.yield**

yield是Thead类中的静态方法，用于让当前线程暂停执行，让出CPU，进入就绪状态。

-   作用：提示当前线程**让出 CPU** 占用时间，给其他同优先级的线程以执行的机会。
-   特点：
    -   不保证当前线程会立即让出 CPU，也不保证其他线程会立即得到执行机会。
    -   不会抛出异常，也不需要在同步上下文中使用。
    -   **不释放任何锁资源**。
-   适用场景：用于希望多个同优先级的线程能够更加“公平”地获得 CPU 时间，但实际效果依赖于 JVM 和操作系统的线程调度策略。

```java
public static void main(String[] args) {
    Thread t1 = new Thread(() -> {
        for (int i = 0; i < 5; i++) {
            System.out.println("Thread 1: " + i);
            if (i == 2) Thread.yield(); // 尝试让出CPU
        }
    });

    Thread t2 = new Thread(() -> {
        for (int i = 0; i < 5; i++) {
            System.out.println("Thread 2: " + i);
        }
    });

    t1.start();
    t2.start();
}
```

|        | Thread.sleep                                                 | object.wait                                                  | Thread.yield                                                 |
| ------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 定义   | Thread.sleep(long millis)是一个静态方法                      | wait()是一个实例方法，属于Object类                           | Thread.yield()是一个静态方法                                 |
| 作用   | 使当前线程进入**休眠**状态，暂停执行一段时间（以毫秒为单位） | **使当前线程等待**，直到另一个线程调用该对象的notify()或notifyAll()方法来唤醒它。 | 提示当前线程**让出 CPU** 占用时间，**给其他同优先级的线程以执行的机会**。 |
| 锁状态 | **不释放锁**：当前线程在睡眠期间仍然持有它所获取的任何锁     | **释放锁**：必须在同步代码块或方法中调用 wait()，并且会立即释放对象的锁。等待被唤醒后重新竞争锁 | **不释放锁**：让出 CPU 时不释放任何锁资源。                  |
| 唤醒   | 自动唤醒：指定的时间到了之后自动恢复执行，无需其他线程干预   | 需要显式唤醒：<br/>可以通过调用同一个对象上的 notify() 或 notifyAll() 方法来唤醒等待中的线程。<br/>如果指定了超时时间（如 wait(long timeout)），则超时后也会自动唤醒。<br/>Thr | 无唤醒机制：只是一个提示，线程调度器可能会选择其他线程运行，但没有明确的唤醒机制。 |
| 异常   | 抛出 InterruptedException：如果在睡眠期间线程被中断，则会抛出此异常。因此，调用 sleep 的代码通常需要捕获并处理这个异常 | 抛出 InterruptedException：同样地，如果在等待期间线程被中断，则会抛出此异常。此外，wait 必须在同步上下文中使用，否则会抛出 IllegalMonitorStateException。 | 不抛出异常：不会抛出任何异常，也不需要特别的异常处理         |
| 场景   | 定时任务：适用于需要线程暂停一段时间后再继续执行的情况，例如模拟延迟、实现定时器等。<br/>避免忙等待：用于减少不必要的 CPU 占用，比如在轮询机制中引入适当的休眠时间。 | **线程间通信**：适用于生产者-消费者模式、多线程协作等场景，其中一个线程需要等待另一个线程完成某些工作。<br/>**条件变量**：用于实现更复杂的线程同步逻辑，确保某个条件满足时再继续执行。 | 同优先级线程调度：适用于希望多个同优先级的线程能够更加“公平”地获得 CPU 时间的情况，但实际效果依赖于 JVM 和操作系统的线程调度策略。<br/>提示性调度：由于其不可靠性，一般不建议作为主要的线程控制手段，更多是作为一种优化提示。 |



