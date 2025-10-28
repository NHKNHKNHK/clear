# CountDownLatch与CyclicBarrier的区别

`CountDownLatch`与`CyclicBarrier`都是用于控制并发的工具类，都可以理解成维护的就是一个计数器，但是这两者还是各有不同侧重点的：

- `CountDownLatch`一般用于某个线程A等待若干个其他线程执行完任务之后，它才执行；而`CyclicBarrier`一般用于一组线程互相等待至某个状态，然后这一组线程再同时执行；`CountDownLatch`强调一个线程等多个线程完成某件事情。`CyclicBarrier`是多个线程互等，等大家都完成，再携手共进。
- 调用`CountDownLatch`的`countDown`方法后，当前线程并不会阻塞，会继续往下执行；而调用`CyclicBarrier`的`await`方法，会阻塞当前线程，直到`CyclicBarrier`指定的线程全部都到达了指定点的时候，才能继续往下执行；
- `CountDownLatch`方法比较少，操作比较简单，而`CyclicBarrier`提供的方法更多，比如能够通过getNumberWaiting()，isBroken()这些方法获取当前多个线程的状态，**并且`CyclicBarrier`的构造方法可以传入barrierAction**，指定当所有线程都到达（屏障）时执行的业务功能；
- `CountDownLatch`是不能复用的，而CyclicLatch是可以复用的。
