# 什么是LockSupport类？Park和unPark的使用

LockSupport 是用来创建锁和其他同步类的基本线程阻塞原语。

LockSupport 是 Java 并发包 (java.util.concurrent) 中的一个**工具类**，所有的方法都是静态方法，可以让线程在任意位置阻塞，阻塞之后也有对应的唤醒方法。

归根结底，LockSupport 调用的是 Unsafe 中的native 代码

LockSupport 提供 park 和 unpark 方法实现阻塞线程和解除线程阻塞的过程。

LockSupport 和每个使用它的线程都有一个许可（permit）关联

**每个线程**都有一个相关的permit，**permit最多只有一个**，重复调用unpark也不会积累凭证。



>   **形象的理解**
>
>   线程阻塞需要消耗凭证（permit），这个凭证最多只有一个
>
>   当调用park方法时
>
>   -   如果有凭证，则直接消耗掉这个凭证，然后正常退出
>   -   如果无凭证，就必须阻塞等待凭证可用
>
>   而unpark则相反，它会增加一个凭证，但凭证最多只能有1个，累加无效



LockSupport 的主要功能和特点：

-   阻塞线程：通过 LockSupport.park() 方法可以让当前线程阻塞。

-   唤醒线程：通过 LockSupport.unpark(Thread thread) 方法可以唤醒指定的线程。 

-   轻量级：相比 Object.wait() 和 Object.notify()，LockSupport 提供了更灵活和细粒度的控制。 

-   **许可证机制**：每个线程都有一个与之关联的“许可证”（permit）。
    -   当调用`park()`时，如果当前线程已经有许可证，则直接消耗许可证并继续执行；如果没有许可证，则线程会被阻塞，直到获得许可证。
    -   调用`unpark()`会为线程提供一个许可证（如果有多个未处理的`unpark()`调用，只会消耗一个）。



示例：

```java
public static void main(String[] args) {
    Thread t1 = new Thread(() -> {
        System.out.println(Thread.currentThread().getName() + "\t ---come in");
        LockSupport.park();
        System.out.println(Thread.currentThread().getName() + "\t ---被唤醒");
    }, "t1");
    t1.start();
    
    try {
        TimeUnit.SECONDS.sleep(2L);
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }
    
    new Thread(() -> {
        LockSupport.unpark(t1);
        System.out.println(Thread.currentThread().getName() + "\t ---发出通知");
    }, "t2").start();
}
```



**补充**

>   3种线程等待与唤醒的方法

**1、Object类中的wait与notify方法**

-   wait和notify方法必要要在同步块或方法中使用，否则运行时抛出`IllegalMonitorStateException`
-   且wait顺序和notify顺序不能弄反
-   最好是成对出现使用
    

**2、Condition接口中的await与signal方法**

-   Condition中的线程等待和唤醒，需要先获取锁，否则运行时抛出`IllegalMonitorStateException`
-   且await顺序和signal顺序不能弄反

-   最好是成对出现使用
    

**Object和Condition使用的限制条件**

-   线程先要获得并持有锁，必须在锁块（synchronized 或 lock）在调用

-   必须要先等待后唤醒，线程才能够被唤醒，否则线程将一致被阻塞
    -   （即wait与notify、await与signal方法必须成双成对出现）
        

**3、LockSupport类中的park与unpark方法**

-   LockSupport是用来创建锁和其他同步类的基本线程阻塞原语

-   LockSupport类使用了一种名为Permit（许可）的概念来做到**阻塞和唤醒线程**的功能，每个线程都有一个Permit（许可）

-   但与 Semaphore 不同的是，**许可的累加上限制是1**