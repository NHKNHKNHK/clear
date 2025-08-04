# 两次调用start方法会怎么样？

第一次调用start方法时，线程可能处于终止或其他非NEW状态，再次调用start()方法会让正在运行的线程重新运行一遍。

不管是从线程安全的角度来看 ，还是从线程本身的执行逻辑来看 ，他都是不合理的。因此为了避免这种问题的出现，Java中会先判断线程的运行状态。

可调用如下方法确定当前线程的状态

```java
public State getState()		// 得到线程的当前状态 	
    						// NEW,RUNNABLE,BLOCKED,WAITING,TIMED_WAITING,TERMINATED;
```



>   注意：
>
>   ​	程序只能对新建状态（NEW）的线程调用 start()，并且只能调用一次，如果对非新建状态的线程，如已启动的线程或已死亡的线程调用 start()都会报错 `IllegalThreadStateException` 异常。

这个问题的**关键点**在于：

​	只能对新建状态（NEW）的线程调用 start()
