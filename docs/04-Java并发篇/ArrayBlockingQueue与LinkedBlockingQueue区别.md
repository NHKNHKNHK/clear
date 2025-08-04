# ArrayBlockingQueue 与 LinkedBlockingQueue区别

ArrayBlockingQueue 与 LinkedBlockingQueue分别是基于数组和链表的有界阻塞队列，后者也至此无界队列

两者的原理都是基于 ReentrantLock 和 Condition

ArrayBlockingQueue 基于数组，内部实现只用了**一把锁**，可以指定公平或非公平

LinkedBlockingQueue 基于链表，内部实现用了**两把锁**，take一把、put一把，所以入队和出队两个操作是可以并行的，从这里看并发度应该比ArrayBlockingQueue 高