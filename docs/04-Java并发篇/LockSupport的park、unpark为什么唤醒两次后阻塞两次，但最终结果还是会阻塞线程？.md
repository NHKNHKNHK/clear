# LockSupport的park/unpark为什么唤醒两次后阻塞两次，但最终结果还是会阻塞线程？

**口语化**

因为凭证的数量最多为1，不会累加。连续调用两次unpark和调用一次unpark的效果一样，只会增加一个凭证。

而调用两次park却需要消耗两个凭证，凭证不够，不能放行。



**核心原因：许可证机制**

1.  **每个线程有一个许可证**：
    -   每个线程都有一个与之关联的“许可证”。
    -   调用 `LockSupport.unpark(Thread thread)` 会为指定线程提供一个许可证。
    -   调用 `LockSupport.park()` 时，如果当前线程已经有许可证，则直接消耗许可证并继续执行；如果没有许可证，则线程会被阻塞，直到获得许可证。
2.  **许可证是一次性的**：
    -   许可证只能被使用一次。当线程调用 `park()` 并成功获取许可证后，许可证会被消耗掉。
    -   如果多次调用 `unpark()`，只会增加一个许可证（即使多次调用，也只记录一个许可证）。
3.  **为什么最终还会阻塞？**
    -   假设你调用了两次 `unpark`，这相当于为线程准备了一个许可证。
    -   当第一次调用 `park()` 时，线程会消耗这个许可证并继续执行。
    -   第二次调用 `park()` 时，由于许可证已经被消耗完，线程将再次被阻塞。

```java
private static void lockSupportParkUnpark() {
    Thread t1 = new Thread(() -> {
        System.out.println(Thread.currentThread().getName() + "\t ---come in");
        LockSupport.park();
        System.out.println(Thread.currentThread().getName() + "\t ---come in 2");
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
        LockSupport.unpark(t1);
        System.out.println(Thread.currentThread().getName() + "\t ---发出通知");
    }, "t2").start();
}
```

在这个例子中，两次调用了unpark，为t1线程颁发许可，但许可不累加，只有1个。最终t1线程调用了两次park，需要两个许可，但t1只有一个许可，最终导致线程阻塞




