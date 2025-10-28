# 什么是Java的Semaphore？

在 Java 中，Semaphore 是 java.util.concurrent 包下的一个同步工具类，用于控制多个线程对共享资源的访问权限，通过 “信号量” 来管理线程的并发数量。它的核心作用是 控制同时访问特定资源的线程数量，常用于实现 “限流” 或 “资源池” 等场景。

## 一、核心概念

计数信号量

Semaphore 维护一个 计数器，表示可用的 “许可” 数量。线程需要先获取许可（acquire）才能访问资源，使用完后释放许可（release）。计数器的值可以是固定的，也可以在初始化时指定。

公平与非公平模式

- 公平模式：线程按照获取许可的顺序排队，先等待的线程优先获取许可（构造方法 Semaphore(int permits, boolean fair) 中 fair 设为 true）。

- 非公平模式（默认）：线程可能直接尝试获取许可，无需排队，可能提高吞吐量但可能导致某些线程饥饿。

## 二、常用方法

- Semaphore(int permits)	初始化信号量，permits 为许可总数（非公平模式）。
- Semaphore(int permits, boolean fair)	初始化信号量，指定公平模式。
- void acquire()	阻塞线程，直到获取一个许可（计数器减 1）；若计数器为 0，线程进入等待队列。
- void acquire(int permits)	阻塞线程，直到获取 permits 个许可（批量获取）。
- void release()	释放一个许可（计数器加 1），唤醒等待队列中的线程。
- void release(int permits)	释放 permits 个许可（批量释放）。
- boolean tryAcquire()	尝试获取一个许可，成功返回 true，失败立即返回 false（非阻塞）。
- boolean tryAcquire(long timeout, TimeUnit unit)	在指定时间内尝试获取许可，超时返回 false。
- int availablePermits()	返回当前可用的许可数量。

## 四、注意事项

- 线程安全：Semaphore 内部通过 CAS 或锁实现线程安全，无需额外同步。
- 异常处理：acquire() 会抛出 InterruptedException，需合理处理线程中断。
- 与 CountDownLatch 的区别：
    - Semaphore 的许可可以重复释放和获取（计数器循环变化），用于控制并发数量。
    - CountDownLatch 的计数器只能递减一次（从初始值到 0），用于等待多个线程完成任务。

## 总结

Semaphore 是并发编程中控制资源访问的重要工具，通过 “许可” 机制实现对线程并发量的精准控制，适用于限流、资源池、管道流量控制等场景。合理使用公平模式和超时机制，可以避免线程饥饿并提升系统稳定性。