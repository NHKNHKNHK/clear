export default [
  {
    text: '线程基础',
    collapsed: false,
    items: [
      { text: '为什么要使用多线程？', link: '/04-Java并发篇/index' },
      { text: '串行、并行和并发', link: '/04-Java并发篇/串行、并行和并发' },
      { text: '程序、进程、线程？', link: '/04-Java并发篇/程序、进程、线程？' },
      { text: '进程、线程、管程、协程、虚拟线程区别？', link: '/04-Java并发篇/进程、线程、管程、协程、虚拟线程区别？' },
      { text: '什么是协程？Java支持协程吗？', link: '/04-Java并发篇/什么是协程？Java支持协程吗？' },
      { text: '线程调度？', link: '/04-Java并发篇/线程调度？' },
      { text: '用户线程与守护线程', link: '/04-Java并发篇/用户线程与守护线程' },
      { text: '线程的基本方法（Thread类的方法）', link: '/04-Java并发篇/线程的基本方法（Thread类的方法）' },
      { text: 'Thread类的特性？', link: '/04-Java并发篇/Thread类的特性？' },
      { text: 'Java创建线程的方式有哪些？', link: '/04-Java并发篇/Java创建线程的方式有哪些？' },
      { text: 'Java创建线程的几种方式有什么区别？', link: '/04-Java并发篇/Java创建线程的几种方式有什么区别？' },

      { text: '终止线程的四种方式', link: '/04-Java并发篇/终止线程的四种方式' },
      { text: '启动一个线程用start还是run？', link: '/04-Java并发篇/启动一个线程用start还是run？' },
      { text: '为什么启动线程不直接调用run()，而调用start()？', link: '/04-Java并发篇/为什么启动线程不直接调用run()，而调用start()？' },
      { text: '两次调用start方法会怎么样？', link: '/04-Java并发篇/两次调用start方法会怎么样？' },
      { text: '如何优雅的终止一个线程？', link: '/04-Java并发篇/如何优雅的终止一个线程？' },
      { text: 'Java多线程的生命周期是什么', link: '/04-Java并发篇/Java多线程的生命周期是什么' },
      { text: '创建线程的底层原理？', link: '/04-Java并发篇/创建线程的底层原理？' },
      { text: '怎么理解线程分组？编程实现一个线程分组的例子？', link: '/04-Java并发篇/怎么理解线程分组？编程实现一个线程分组的例子？' },
      { text: '线程的状态有哪几种？', link: '/04-Java并发篇/线程的状态有哪几种？' },
      { text: 'JDK1.5之前线程的五种状态', link: '/04-Java并发篇/JDK1.5之前线程的五种状态' },
      { text: 'JDK1.5之后线程的五种状态', link: '/04-Java并发篇/JDK1.5之后线程的五种状态' },
      { text: '线程的生命周期在Java中是如何定义的？', link: '/04-Java并发篇/线程的生命周期在Java中是如何定义的？' },
      { text: 'Java的线程的优先级是什么？有什么用？', link: '/04-Java并发篇/Java的线程的优先级是什么？有什么用？' },
      { text: 'join方法有什么用？什么原理？', link: '/04-Java并发篇/join方法有什么用？什么原理？' },

      { text: 'sleep和wait的主要区别？', link: '/04-Java并发篇/sleep和wait的主要区别？' },
      { text: 'sleep和wait、yield方法有什么区别？', link: '/04-Java并发篇/sleep和wait、yield方法有什么区别？' },
      { text: 'Thread.sleep(0)有意义吗？有什么用？', link: '/04-Java并发篇/Thread.sleep(0)有意义吗？有什么用？' },
      { text: '怎么理解Java中的线程中断（interrupt）？', link: '/04-Java并发篇/怎么理解Java中的线程中断（interrupt）？' },
      { text: '为什么多线程执行时，需要catch InterruptedException异常，catch里面写啥', link: '/04-Java并发篇/为什么多线程执行时，需要catch InterruptedException异常，catch里面写啥' },
      { text: 'interrupt的标志位是否会回归到原有标记', link: '/04-Java并发篇/interrupt的标志位是否会回归到原有标记' },
      { text: 'interrupt和stop有什么区别？', link: '/04-Java并发篇/interrupt和stop有什么区别？' },
      { text: '为什么推荐使用 interrupt() 而不是 stop()？', link: '/04-Java并发篇/为什么推荐使用 interrupt() 而不是 stop()？' },
      { text: '如何判断代码是不是有线程安全问题？如何解决', link: '/04-Java并发篇/如何判断代码是不是有线程安全问题？如何解决' },
      { text: 'wait和notify的虚假唤醒的产生原因及如何解决', link: '/04-Java并发篇/wait和notify的虚假唤醒的产生原因及如何解决' },
      { text: '怎么理解wait、notify、notifyAll方法？', link: '/04-Java并发篇/怎么理解wait、notify、notifyAll方法？' },

      {
        text: '三大特性',
        collapsed: false,
        items: [
          { text: 'Java内存模型（JMM）？', link: '/04-Java并发篇/Java内存模型（JMM）？' },
          { text: '线程的安全三大特性', link: '/04-Java并发篇/线程的安全三大特性' },
          { text: 'JMM规范下，三大特性？ ', link: '/04-Java并发篇/JMM规范下，三大特性？ ' },
          { text: '并发编程中的原子性与数据库ACID的原子性是一样的吗', link: '/04-Java并发篇/并发编程中的原子性与数据库ACID的原子性是一样的吗' },
          { text: '什么是Java的happens-before规则？（JMM规范）', link: '/04-Java并发篇/什么是Java的happens-before规则？（JMM规范）' },
          { text: 'volatile关键字的作用？', link: '/04-Java并发篇/volatile关键字的作用？' },
          { text: '什么是Java中的指令重排？', link: '/04-Java并发篇/什么是Java中的指令重排？' },
          { text: '为什么指令重排能够提高性能？', link: '/04-Java并发篇/为什么指令重排能够提高性能？' },
          { text: 'volatile如何防止指令重排？', link: '/04-Java并发篇/volatile如何防止指令重排？' },
          { text: 'volatile保证线程的可见性和有序性，不保证原子性是为什么？', link: '/04-Java并发篇/volatile保证线程的可见性和有序性，不保证原子性是为什么？' },
          { text: '什么是内存屏障？', link: '/04-Java并发篇/什么是内存屏障' },
          { text: 'final关键字能否保证变量的可见性？', link: '/04-Java并发篇/final关键字能否保证变量的可见性？' },
        ]
      },

      { text: '线程间的通信方式？', link: '/04-Java并发篇/线程间的通信方式？' },
      { text: 'JVM的线程调度是什么？', link: '/04-Java并发篇/JVM的线程调度是什么？' },
      { text: '引起CPU进行上下文切换的原因', link: '/04-Java并发篇/引起CPU进行上下文切换的原因' },
      { text: '线程什么时候主动放弃CPU', link: '/04-Java并发篇/线程什么时候主动放弃CPU' },


      { text: '死锁的发生原因？怎么避免？', link: '/04-Java并发篇/死锁的发生原因？怎么避免？' },
      { text: '排除死锁的方式有哪些？', link: '/04-Java并发篇/排除死锁的方式有哪些？' },

      { text: '什么是Java中的线程同步？', link: '/04-Java并发篇/什么是Java中的线程同步？' },
      { text: '什么是Java中的ABA问题？', link: '/04-Java并发篇/什么是Java中的ABA问题？' },


      { text: 'Java中线程安全是什么意思？', link: '/04-Java并发篇/Java中线程安全是什么意思？' },
      { text: '你是怎么理解线程安全问题的？', link: '/04-Java并发篇/你是怎么理解线程安全问题的？' },
      { text: 'Java中线程之间是如何通信的？', link: '/04-Java并发篇/Java中线程之间是如何通信的？' },
      { text: '谈谈你对AQS的理解？', link: '/04-Java并发篇/谈谈你对AQS的理解' },
      { text: '谈谈你对CAS的理解？Compare-And-Swap', link: '/04-Java并发篇/谈谈你对CAS的理解？Compare-And-Swap' },
      { text: 'Unsafe', link: '/04-Java并发篇/Unsafe' },
      { text: 'CAS的缺点？', link: '/04-Java并发篇/CAS的缺点？' },

      { text: '你了解时间轮（Time Wheel）吗？他在Java中有哪些应用场景？', link: '/04-Java并发篇/你了解时间轮（Time Wheel）吗？他在Java中有哪些应用场景？' },

      { text: '什么是Java的ForkJoinPool？', link: '/04-Java并发篇/什么是Java的ForkJoinPool？' },
    ]
  },
  {
    text: '线程池',
    collapsed: false,
    items: [
      { text: '为什么不建议使用Executors来创建线程池？', link: '/04-Java并发篇/为什么不建议使用Executors来创建线程池？' },
      { text: '线程池相关的常用API？', link: '/04-Java并发篇/线程池相关的常用API？' },
      { text: 'BlockingQueue是什么？', link: '/04-Java并发篇/BlockingQueue是什么？' },
      { text: 'ArrayBlockingQueue 与 LinkedBlockingQueue区别', link: '/04-Java并发篇/ArrayBlockingQueue与LinkedBlockingQueue区别' },
      { text: '介绍一下常用的Java的线程池？', link: '/04-Java并发篇/介绍一下常用的Java的线程池？' },
      { text: 'Java线程池的原理', link: '/04-Java并发篇/Java线程池的原理' },
      { text: '使用线程池的好处', link: '/04-Java并发篇/使用线程池的好处' },
      { text: '线程池的生命周期', link: '/04-Java并发篇/线程池的生命周期' },
      { text: '线程池的核心构造参数有哪些？', link: '/04-Java并发篇/线程池的核心构造参数有哪些？' },
      { text: '如何重构一个线程工厂', link: '/04-Java并发篇/如何重构一个线程工厂' },
      { text: '线程池的拒绝策略有哪些？', link: '/04-Java并发篇/线程池的拒绝策略有哪些？' },
      { text: '重写线程组的意义', link: '/04-Java并发篇/重写线程组的意义' },
      { text: '线程池的shutDown和shutDownNow的区别', link: '/04-Java并发篇/线程池的shutDown和shutDownNow的区别' },
      { text: 'shutdownNow返回的任务列表是干什么的？', link: '/04-Java并发篇/shutdownNow返回的任务列表是干什么的？' },
      { text: '多次调用shutDown或shutDownNow 会怎么样？', link: '/04-Java并发篇/多次调用shutDown或shutDownNow 会怎么样？' },
      { text: '利用线程池批量删除数据，数据量突然增大怎么办？', link: '/04-Java并发篇/利用线程池批量删除数据，数据量突然增大怎么办？' },
      { text: 'Java中有哪些队列？', link: '/04-Java并发篇/Java中有哪些队列？' },
      { text: '阻塞队列原理？', link: '/04-Java并发篇/阻塞队列原理？' },
      { text: '线程池的异步任务执行完后，如何回调', link: '/04-Java并发篇/线程池的异步任务执行完后，如何回调' },
      { text: '你理解Java线程池原理吗？', link: '/04-Java并发篇/你理解Java线程池原理吗？' },
      { text: '你的项目中是如何使用线程池的？', link: '/04-Java并发篇/你的项目中是如何使用线程池的？' },
      { text: '如何设置Java线程池的线程数（实际工作中）？', link: '/04-Java并发篇/如何设置Java线程池的线程数（实际工作中）？' },

      { text: '线程池如何知道一个线程的任务已经执行完毕了？（小米）', link: '/04-Java并发篇/线程池如何知道一个线程的任务已经执行完毕了？（小米）' },
      { text: 'Java并发库中提供了哪些线程池实现？它们有什么区别？', link: '/04-Java并发篇/Java并发库中提供了哪些线程池实现？它们有什么区别？' },
      { text: 'Java中的Delay和ScheduledThreadPool有什么区别？', link: '/04-Java并发篇/Java中的Delay和ScheduledThreadPool有什么区别？' },
      { text: '什么是Java的Timer？', link: '/04-Java并发篇/什么是Java的Timer？' },
      { text: '什么叫做阻塞队列的有界和无解？', link: '/04-Java并发篇/什么叫做阻塞队列的有界和无解？' },


    ]
  },
  {
    text: '锁',
    collapsed: false,
    items: [
      { text: '一道题搞懂所有锁', link: '/04-Java并发篇/一道题搞懂所有锁' },
      { text: '如何优化Java中的锁？', link: '/04-Java并发篇/如何优化Java中的锁？' },
      { text: 'reentrantLock是如何实现公平锁和非公平锁？', link: '/04-Java并发篇/reentrantLock是如何实现公平锁和非公平锁？' },
      { text: 'reentrantLock的实现原理？', link: '/04-Java并发篇/reentrantLock的实现原理？' },
      { text: '你了解Java中的读写锁吗？', link: '/04-Java并发篇/你了解Java中的读写锁吗？' },
      { text: '乐观锁如果通过数据库实现，并发情况下，数据库如何保证一致', link: '/04-Java并发篇/乐观锁如果通过数据库实现，并发情况下，数据库如何保证一致' },
      { text: '什么是自旋锁', link: '/04-Java并发篇/什么是自旋锁' },
      { text: '自旋锁时间阈值', link: '/04-Java并发篇/自旋锁时间阈值' },
      { text: '什么是可重入锁（递归锁）？', link: '/04-Java并发篇/什么是可重入锁（递归锁）？' },
      { text: 'ReentrantLock和synchronized的区别？', link: '/04-Java并发篇/ReentrantLock和synchronized的区别？' },
      { text: '什么是可重入锁及使用场景？', link: '/04-Java并发篇/什么是可重入锁及使用场景？' },
      { text: '可重入锁实现原理', link: '/04-Java并发篇/可重入锁实现原理' },
      { text: '锁升级机制是怎样的', link: '/04-Java并发篇/锁升级机制是怎样的' },
      { text: '常用的锁都有哪些，适用的场景', link: '/04-Java并发篇/常用的锁都有哪些，适用的场景' },
      { text: 'Lock常用的实现类？', link: '/04-Java并发篇/Lock常用的实现类？' },
      { text: 'Locak的实现方法？', link: '/04-Java并发篇/Locak的实现方法？' },
      { text: 'ReentrantLock的实现', link: '/04-Java并发篇/ReentrantLock的实现' },
      { text: 'ReadWriteLock的整体实现', link: '/04-Java并发篇/ReadWriteLock的整体实现' },
      { text: 'synchronized同步锁有哪几种方法？', link: '/04-Java并发篇/synchronized同步锁有哪几种方法？' },
      { text: '如何选择同步锁对象？如何设定同步代码访问？', link: '/04-Java并发篇/如何选择同步锁对象？如何设定同步代码访问？' },
      { text: 'Java中的synchronized是怎么实现的？（底层原理）', link: '/04-Java并发篇/Java中的synchronized是怎么实现的？（底层原理）' },
      { text: 'synchronized是可重入锁吗？它的重入实现原理？', link: '/04-Java并发篇/synchronized是可重入锁吗？它的重入实现原理？' },
      { text: 'synchronized能否被打断，什么情况下打断', link: '/04-Java并发篇/synchronized能否被打断，什么情况下打断' },
      { text: 'synchronized的不同作用范围有什么区别', link: '/04-Java并发篇/synchronized的不同作用范围有什么区别' },
      { text: '为什么wait和notify必须要在synchronized代码块使用？', link: '/04-Java并发篇/为什么wait和notify必须要在synchronized代码块使用？' },
      { text: 'Java中的synchronized轻量级锁是否会进行自旋？', link: '/04-Java并发篇/Java中的synchronized轻量级锁是否会进行自旋？' },
      { text: 'Java中的synchronized升级到重量级锁时，会发生什么？', link: '/04-Java并发篇/Java中的synchronizeds升级到重量级锁时，会发生什么？' },
      { text: '什么是Java中的锁自适应自旋？', link: '/04-Java并发篇/什么是Java中的锁自适应自旋？' },
      { text: 'lock和synchronized的区别？', link: '/04-Java并发篇/lock和synchronized的区别？' },
      { text: 'Lock的公平锁与非公平锁', link: '/04-Java并发篇/Lock的公平锁与非公平锁' },
      { text: '为什么会有公平锁与非公平锁的设计？为什么要默认非公平？', link: '/04-Java并发篇/为什么会有公平锁与非公平锁的设计？为什么要默认非公平？' },
      { text: '什么时候用公平锁？什么时候用非公平锁？', link: '/04-Java并发篇/什么时候用公平锁？什么时候用非公平锁？' },

      { text: '什么是LockSupport类？Park和unPark的使用', link: '/04-Java并发篇/什么是LockSupport类？Park和unPark的使用' },
      { text: 'LockSupport的park/unpark为什么可以突破wait/notify的原有调用顺序？', link: '/04-Java并发篇/LockSupport的park、unpark为什么可以突破wait、notify的原有调用顺序？' },
      { text: 'LockSupport的park/unpark为什么唤醒两次后阻塞两次，但最终结果还是会阻塞线程？', link: '/04-Java并发篇/LockSupport的park、unpark为什么唤醒两次后阻塞两次，但最终结果还是会阻塞线程？' },

    ]
  },
  {
    text: '原子类',
    collapsed: false,
    items: [
      { text: '说说Java中的原子类？', link: '/04-Java并发篇/说说Java中的原子类？' },
      { text: '说说JUC中的累加器？', link: '/04-Java并发篇/说说JUC中的累加器？' },


      { text: '你使用过Java中哪些原子类？', link: '/04-Java并发篇/你使用过Java中哪些原子类？' },
      { text: 'AtomicInteger的实现方式及场景', link: '/04-Java并发篇/AtomicInteger的实现方式及场景' },
      { text: '你使用过Java中的累加器吗？', link: '/04-Java并发篇/你使用过Java中的累加器吗？' },
    ]
  },
  {
    text: '并发工具',
    collapsed: false,
    items: [
      { text: '什么是Java的CountDownLatch？', link: '/04-Java并发篇/什么是Java的CountDownLatch？' },
      { text: '什么是Java的CyclicBarrier？', link: '/04-Java并发篇/什么是Java的CyclicBarrier？' },
      { text: 'CountDownLatch与CyclicBarrier的区别', link: '/04-Java并发篇/CountDownLatch与CyclicBarrier的区别' },
      { text: '什么是Java的Semaphore？', link: '/04-Java并发篇/什么是Java的Semaphore？' },
      { text: '什么是Java的Exchanger？', link: '/04-Java并发篇/什么是Java的Exchanger？' },
      { text: '什么是Java的StampedLock？', link: '/04-Java并发篇/什么是Java的StampedLock？' },
      { text: '什么是FutureTask？', link: '/04-Java并发篇/什么是FutureTask？' },
      { text: '什么是Java的CompletableFuture？', link: '/04-Java并发篇/什么是Java的CompletableFuture？' },

    ]
  },
  {
    text: '并发容器',
    collapsed: false,
    items: [
      { text: 'Java中为什么需要使用ThreadLocal？ThreadLocal原理', link: '/04-Java并发篇/Java中为什么需要使用ThreadLocal？ThreadLocal原理' },
      { text: 'ThreadLocal有哪些使用场景？', link: '/04-Java并发篇/ThreadLocal有哪些使用场景？' },
      { text: 'ThreadLocal慎用的场景', link: '/04-Java并发篇/ThreadLocal慎用的场景' },
      { text: 'ThreadLocal最佳实践？', link: '/04-Java并发篇/ThreadLocal最佳实践？' },
      { text: 'ThreadLocal的内存泄漏问题', link: '/04-Java并发篇/ThreadLocal的内存泄漏问题' },
      { text: '如何避免ThreadLocal的内存泄漏？', link: '/04-Java并发篇/如何避免ThreadLocal的内存泄漏？' },
      { text: '使用ThreadLocal是需要用弱引用来防止内存泄露？', link: '/04-Java并发篇/使用ThreadLocal是需要用弱引用来防止内存泄露？' },
      { text: 'ThreadLocal是如何实现线程资源隔离的？', link: '/04-Java并发篇/ThreadLocal是如何实现线程资源隔离的？' },
      { text: 'Java中父子线程的共享（传递）？', link: '/04-Java并发篇/Java中父子线程的共享（传递）？' },
      { text: '什么是Java中的InheritableThreadLocal？', link: '/04-Java并发篇/什么是Java中的InheritableThreadLocal？' },
      { text: '什么是Java中的TransmittableThreadLocal？', link: '/04-Java并发篇/什么是Java中的TransmittableThreadLocal？' },
      { text: '为什么Netty不适用ThreadLocal而是自定义FastThreadLocal？', link: '/04-Java并发篇/为什么Netty不适用ThreadLocal而是自定义FastThreadLocal？' },
    ]

  },

  {
    text: '实战',
    collapsed: false,
    items: [
      { text: '怎么让3个线程按顺序执行？', link: '/04-Java并发篇/怎么让3个线程按顺序执行？' },
      { text: '如何控制同时只有两个线程访问', link: '/04-Java并发篇/如何控制同时只有两个线程访问' },
    ]
  },
  {
    text: '参考',
    collapsed: false,
    items: [
      { text: 'Java-concurrency', link: 'https://github.com/NHKNHKNHK/Java-concurrency/blob/master' },
    
    ]
  }
]