# 线程的基本方法（Thread类的方法）

## `start()`

start()方法用于启动线程。线程创建以后，并不会自动运行，需要我们**调用start()**，将线程的状态设为**就绪状态**，但不一定马上就被运行，得等到CPU分配时间片以后，才会运行

```java
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Thread is running");
    }
}

public class Main {
    public static void main(String[] args) {
        MyThread t1 = new MyThread();
        t1.start();  // 启动新线程
    }
}
```

**注意**：直接调用run()方法不会启动新线程，而是在当前线程中执行run()方法。



## `run()`

run()方法包含线程执行的代码。它是Thread类和Runnable接口的核心方法

```java
class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Thread is running");
    }
}

public class Main {
    public static void main(String[] args) {
        Thread t1 = new Thread(new MyRunnable());
        t1.start();  // 启动新线程，实际调用的仍是 run() 方法
    }
}
```



## `sleep(long millis)`

sleep(long millis)方法使当前线程休眠指定的毫秒数。它会抛出`InterruptedException`，因此需要处理该异常。

```java
try {
    System.out.println("Thread is sleeping");
    Thread.sleep(1000);  // 休眠1秒
    System.out.println("Thread woke up");
} catch (InterruptedException e) {
    e.printStackTrace();
}
```



## `join()`

join()方法**等待线程终止**。调用该方法的线程会等待被调用线程执行完毕后再继续执行。

```java
public class Main {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            try {
                Thread.sleep(1000);  // 模拟工作
                System.out.println("Thread finished");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        t1.start();
        
        try {
            t1.join();  // 等待 t1 线程结束
            System.out.println("Main thread continues");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```



## `currentThread()`

currentThread()方法用于获取当前正在执行的线程（线程对象的引用）

```java
public class Main {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            Thread currentThread = Thread.currentThread();
            System.out.println("Current thread: " + currentThread.getName());
        });
        t1.start();
    }
}
```



## `interrupt() isInterrupted() interrupted()`

`interrupt()`

​	interrupt()方法用于**设置线程中断状态为true**。

`线程.isInterrupted()`

​	isInterrupted()方法用于**检查线程是否被中断**，但不会重置中断标志。它返回一个布尔值

`Thread.interrupted()`

​	检查当前线程的中断状态，并重置中断标志为 false。

具体来说，当一个线程调用interrupt()方法时：

-   如果一个线程处理正常活动状态，那么会将该线程的中断标志设为为true，仅此而已。被设置中断标志的线程将继续运行，不受影响。
    -   所以，interrupt()方法并不能真正的中断线程，需要被调用的线程自己进行配合才行
-   源码叙述：interrupt()方法中断一个不活动的线程不会产生任何影响。
-   如果线程处于被阻塞状态（例如处于sleep、wait、join等），在别的线程中调用当前线程对象的interrupt()方法，那么线程将立即退出被阻塞状态，并抛出`InterruptedException`异常

**方法区分**

| 方法                                | 描述                                                         |
| ----------------------------------- | ------------------------------------------------------------ |
| public void interrupt()             | 实例方法。设置线程的中断状态为true，发起一个协商而不会立即停止线程<br/>// Just to set the interrupt flag |
| public static boolean interrupted() | 静态方法。判断线程是否被中断并清除当前中断状态。<br>这个方法做了两件事情：<br>    1、返回当前线程的中断状态<br>    2、将当前的中断状态清零并重设为false，清理线程的中断状态 |
| public boolean isInterrupted()      | 实例方法。判断当前线程是否已被中断                           |

示例：

```java
public class Main {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            try {
                while (!Thread.currentThread().isInterrupted()) { // 判断线程是否被中断
                    System.out.println("Thread is running");
                    Thread.sleep(500);
                }
            } catch (InterruptedException e) {
                System.out.println("Thread was interrupted");
            }
        });
        t1.start();
        
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        t1.interrupt();  // 中断 t1 线程
    }
}
```



## `setPriority(int newPriority)`

setPriority(int newPriority)方法用于**设置线程的优先级**。

优先级范围从Thread.MIN_PRIORITY(1) 到 Thread.MAX_PRIORITY(10)，默认优先级为Thread.NORM_PRIORITY(5)。

## `getPriority()`

getPriority()方法用于获取线程的优先级

```java
public class Main {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            System.out.println("Thread is running with priority: " + Thread.currentThread().getPriority());
        });
        t1.setPriority(Thread.MAX_PRIORITY);
        t1.start();
    }
}
```



## `setName(String name)`

setName(String name)方法用于**设置线程的名称**

## `getName()`

getName()方法用于**获取线程的名称**

```java
public class Main {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            System.out.println("Thread name: " + Thread.currentThread().getName());
        });
        t1.setName("MyThread");
        t1.start();
    }
}
```



## `yield()`

yield()方法它使得当前线程从运行状态（Running）进入到就绪状态（Runnable），给其他具有相同优先级的等待线程以执行的机会。

-   不确定性：调用 yield 不一定会导致当前线程停止执行，因为调度器可能会再次选择该线程继续运行。
-   使用场景：通常在希望多个同优先级的线程能够更加“公平”地获得 CPU 时间时使用，但实际效果依赖于 JVM 和底层操作系统的线程调度策略。

```java
class YieldExample {
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
}
```

## 其他

此外，还有如下这些方法

```java
public final native boolean isAlive()  // 判断线程是否还活着
    
// @since 1.5
public State getState()  // 得到这一线程的状态
    
    
// 将指定线程设置为守护线程
public final void setDaemon(boolean on)  
// 必须在线程启动start()之前设置，否则会报 IllegalThreadStateException 异常。
    
// 判断线程是否是守护线程
public final boolean isDaemon()
    
    
// 以下三个方法已过时，不建议使用
    
public final void stop()  // 强行结束一个线程的执行，直接进入死亡状态。run()即刻停止，可能会导致一些清理性的工作得不到完成，如文件，数据库等的关闭。同时，会立即释放该线程所持有的所有的锁，导致数据得不到同步的处理，出现数据不一致的问题。
    
// 二者必须成对出现，否则非常容易发生死锁。
public final void suspend() // 会导致线程暂停，但不会释放任何锁资源，导致其它线程都无法访问被它占用的锁，直到调用 resume()
public final void resume()  // 恢复线程。该方法仅用于调用suspend()之后调用
```

