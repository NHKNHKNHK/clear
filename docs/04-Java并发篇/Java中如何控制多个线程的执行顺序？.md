# Java中如何控制多个线程的执行顺序？

CompletableFuture，例如thenRun，假设t1、t2、t3任务要按顺序执行，就可以使用thenRun方法

synchronized + wait/notify，通过对象锁和线程间通信机制来控制线程的执行顺序

ReentrantLock + condition

Thread类的join方法，通过调用这个方法，可以使得一个线程等待另一个线程执行完毕后再继续执行

CountDownLatch，使一个或线程等待其他线程完成各自工作后再继续执行

CyclicBarrier，是多个线程互相等待，直到所有线程都到达某个共同点后再继续执行

Semaphore，控制线程的执行顺序，适用于需要限制同时访问资源的线程数量的场景

线程池，单个线程的线程池，按序的将任务提交到线程池即可