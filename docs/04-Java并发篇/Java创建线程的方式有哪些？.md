# Java创建线程的方式有哪些？

Java语言的JVM允许程序运行多个线程，使用`java.lang.Thread`类代表**线程**，所有的线程对象都必须是Thread类或其子类的实例。

## **Thread类的特性**

-   每个线程都是通过某个特定Thread对象的run()方法来完成操作的，因此把**run()方法体称为线程执行体**。
-   通过该Thread对象的**start()方法来启动这个线程**，而非直接调用run()（如果使用Thread方法直接调用run方法，相当于main线程在执行该方法）
-   要想实现多线程，必须在主线程中创建新的线程对象

在学习线程的创建方式之前需要明白：下面的方式都只是创建线程的方式，==本质上线程的创建方式只有一种，那就是Thread.start()==

-   继承Thread类
-   实现Runnable接口
-   实现Callable接口
-   使用线程池

## **方式1：继承Thread类**

通过继承`java.lang.Thread`类并重写其run方法来创建线程：

1.  定义**Thread类的子类**，并**重写**该类的**run()方法**，该run()方法的方法体就代表了线程需要完成的任务
2.  创建Thread子类的实例，即创建了线程对象
3.  调用线程对象的**start()方法**来**启动该线程**

```java
public class EvenNumberDemo {
    public static void main(String[] args) {
        EvenNumberThread evenNumberThread = new EvenNumberThread();
        evenNumberThread.start();  // 启动子线程

        // 主方法的逻辑
        for (int i = 1; i < 100; i++) {
            if (i % 2 == 0) {
                System.out.println(Thread.currentThread().getName() + ":" + i);
            }
        }
    }
}

// 为了方便，我们直接在这里定义一个类
class EvenNumberThread extends Thread {
    @Override
    public void run() {
        for (int i = 1; i < 100; i++) {  // 遍历1-100内的偶数
            if (i % 2 == 0) {
                System.out.println(Thread.currentThread().getName() + ":" + i);
            }
        }
    }
}
```

注意：

-   如果自己手动调用run()方法，那么就只是普通方法，没有启动多线程模式。
-   run()方法由JVM调用，什么时候调用，执行的过程控制都由操作系统的CPU调度决定。
-   想要启动多线程，必须调用start方法。
-   **一个线程对象只能调用一次start()方法**启动线程，如果重复调用了，则将抛出以上的异常`IllegalThreadStateException`



## **方式2：实现Runnable接口**

通过实现`java.lang.Runnable`接口并将其传递给Thread对象来创建线程

**Java有单继承的限制，当我们无法继承Thread类时**，那么该如何做呢？在核心类库中提供了Runnable接口，我们**可以实现Runnable接口，重写run()方法**，然后再通过Thread类的对象代理启动和执行我们的线程体run()方法

步骤如下：

1.  定义Runnable接口的实现类，并**重写该接口的run()方法**，该run()方法的方法体同样是该线程的线程执行体。
2.  **创建Runnable**实现类的**实例**，并以此**实例作为Thread的target参数来创建Thread对象**，该Thread对象才是真正的线程对象。
3.  调用线程对象的start()方法，启动线程。调用Runnable接口实现类的run方法

```java
public class OddNumberDemo {
    public static void main(String[] args) {
        //创建自定义类对象 线程任务对象
        OddNumberRunnable oddNumberRunnable = new OddNumberRunnable();
        //创建线程对象,并启动线程
        new Thread(oddNumberRunnable).start();

        // 主方法的逻辑
        for (int i = 0; i < 100; i++) {  // 打印1-100以内的奇数
            if (i % 2 == 1) {
                System.out.println(Thread.currentThread().getName() + ":" + i);
            }
        }
    }
}

class OddNumberRunnable implements Runnable {

    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {  // 打印1-100以内的奇数
            if (i % 2 == 1) {
                System.out.println(Thread.currentThread().getName() + ":" + i);
            }
        }
    }
}
```

注意：

-   通过实现Runnable接口，使得该类有了多线程类的特征。所有的分线程要执行的代码都在run方法里面。
-   在启动的多线程的时候，需要先通过Thread类的构造方法Thread(Runnable target) 构造出对象，然后调用Thread对象的start()方法来运行多线程代码。
-   实际上，**所有的多线程代码都是通过运行Thread的start()方法来运行**的。因此，不管是继承Thread类还是实现 Runnable接口来实现多线程，最终还是通过Thread的对象的API来控制线程的，熟悉Thread类的API是进行多线程编程的基础。
-   说明：Runnable对象仅仅作为Thread对象的target，Runnable实现类里包含的run()方法仅作为线程执行体。 而实际的线程对象依然是Thread实例，只是该Thread线程负责执行其target的run()方法。



## **方式二：使用Lambda表达式简化Runnable接口的实现**

通过Lambda表达式简化Runnable接口的实现

```java
public class OddNumberDemo {
    public static void main(String[] args) {
        //创建线程对象,并启动线程
        new Thread(()->{  for (int i = 0; i < 100; i++) {
            if (i % 2 == 1) {  // 遍历100以内的奇数
                System.out.println(Thread.currentThread().getName() + ":" + i);

            }
        }},"老六线程").start();

        // 主方法的逻辑
        for (int i = 0; i < 100; i++) {  // 打印1-100以内的奇数
            if (i % 2 == 1) {
                System.out.println(Thread.currentThread().getName() + ":" + i);
            }
        }
    }
}
```



## **方式三：实现Callable接口**（JDK5.0增加）

通过实现`java.util.concurrent.Callable`接口来创建线程，并使用FutureTask来管理返回结果。

-   与使用 Runnable 相比， Callable 功能更强大些 
    -   相比 run()方法，**可以有返回值** 
    -   call()方法**可以抛出异常**
    -   **支持泛型的返回值**（需要借助 FutureTask 类，获取返回结果） 
-   Future 接口
    -   可以对具体 Runnable、Callable 任务的执行结果进行取消、查询是否完成、获取结果等。 
    -   FutureTask 是 Futrue 接口的唯一的实现类 
    -   FutureTask 同时实现了 `Runnable`,`Future 接口。它既可以作为 Runnable 被线程执行，又可以作为 Future 得到 Callable 的返回值 
-   缺点：在获取分线程执行结果的时候（即调用get方法），当前线程（或是主线程）受阻塞，效率较低。 

```java
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

// jdk5.0新增的创建线程的方式：实现Callable

// 1.创建一个类实现 Callable
class NumThread implements Callable {
    // 2.实现 call 方法，将此线程要执行的操作声明在方法内
    @Override
    public Object call() throws Exception {
         // 执行任务逻辑，返回结果
        int sum = 0;
        for (int i = 1; i <= 100; i++) {
            if (i % 2 == 0) {
                System.out.println(i);
                sum += i;
            }
        }
        return sum;
    }
}

public class CallableTest {
    public static void main(String[] args) {
        // 3.创建Callable接口的实现类对象
        NumThread numThread = new NumThread();

        // 4.将此Callable接口的实现类对象作为参数传递到FutureTask构造器中，创建FutureTask的对象
        FutureTask futureTask = new FutureTask(numThread);

        // 5.将FutureTask的对象作为参数传递到Thread类的构造器中，创建Thread对象，并调用start()
        Thread t1 = new Thread(futureTask);
        t1.start();

        try {
            // 6.获取Callable中的返回值（执行任务逻辑，返回结果）
            // get()返回值即为FutureTask构造器参数Callable实现类重写的call()的返回值
            Object sum = futureTask.get();  // todo get方法自然会有阻塞，等待t1执行完以后，再取返回值
            System.out.println("sum this is " + sum);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }
}
```



## **方式四：使用线程池**

通过`java.util.concurrent.ExecutorService`接口的实现类创建和管理线程池，避免手动创建和管理线程。

**使用线程池的好处：** 

-   提高响应速度（减少了创建新线程的时间） 
-   降低资源消耗（重复利用线程池中线程，不需要每次都创建） 
-   便于线程管理 
    -   corePoolSize：核心池的大小  
    -   maximumPoolSize：最大线程数 
    -   keepAliveTime：线程没有任务时最多保持多长时间后会终止 

​	在 Java 中，可以使用 `java.util.concurrent` 包中的 `ExecutorService` 接口和 `ThreadPoolExecutor` 类来创建和管理线程池。

线程池核心思想：==用固定的线程去执行不定量的task==

**使用线程池的一般步骤**

-   1）**创建线程池对象**：可以使用 `Executors` 类的静态方法来创建线程池对象

```java
// 例如，可以使用 Executors.newFixedThreadPool(int nThreads) 方法创建一个固定大小的线程池。
ExecutorService executor = Executors.newFixedThreadPool(5);
```

-   2）**提交任务给线程池**：使用 `execute(Runnable command)` 方法或 `submit(Callable<T> task)` 方法将任务提交给线程池。
    -   `execute` 方法用于提交不需要返回结果的任务，而 `submit` 方法用于提交需要返回结果的任务。

```java
executor.execute(new MyRunnable());
executor.submit(new MyCallable());
```

-   3）**定义任务**：任务可以是实现了 `Runnable` 接口的类或实现了 `Callable` 接口的类。`Runnable` 接口的 `run` 方法定义了任务的执行逻辑，`Callable` 接口的 `call` 方法也定义了任务的执行逻辑，并且可以返回一个结果。

```java
class MyRunnable implements Runnable {
    public void run() {
        // 任务的执行逻辑
    }
}

class MyCallable implements Callable<Integer> {
    public Integer call() {
        // 任务的执行逻辑，并返回一个结果
        return 42;
    }
}
```

-   4）**关闭线程池**：在不再需要线程池时，应该调用 `shutdown()` 方法来关闭线程池。这将停止接受新的任务，并等待已提交的任务完成。

```java
executor.shutdown();
```

​	以上是使用线程池的基本步骤。您还可以根据需要设置线程池的参数，如线程池大小、任务队列类型等。可以通过 `ThreadPoolExecutor` 类的构造函数或 `ExecutorService` 接口的其他方法来进行配置

示例：

**通过 ThreadPoolExecutor类的构造器创建线程池**

```java
import java.util.concurrent.*;

// 线程池：JDK5.0增加的线程创建方式
// 使用 execute()方法提交线程任务，无返回值
public class ThreadPoolDemo1 {
    public static void main(String[] args) {
        /**
         public ThreadPoolExecutor(int corePoolSize,    核心线程数量
         int maximumPoolSize,   最大线程池数量
         long keepAliveTime,    非核心线程的空闲时间
         TimeUnit unit,         空闲时间单位
         BlockingQueue<Runnable> workQueue, 任务队列
         ThreadFactory threadFactory,   线程工厂
         RejectedExecutionHandler handler  拒绝策略
         )
         */
        // todo 1.创建线程池对象
        ExecutorService pool = new ThreadPoolExecutor(3, 5, 6,
                TimeUnit.SECONDS, new ArrayBlockingQueue<>(5),
                Executors.defaultThreadFactory(), new ThreadPoolExecutor.AbortPolicy());

        // todo 2.将任务给线程池处理，通过 execute()方法提交
        Runnable target = new MyRunnable();
        pool.execute(target);
        pool.execute(target);
        pool.execute(target);

        // 放入任务队列
        pool.execute(target);
        pool.execute(target);
        pool.execute(target);
        pool.execute(target);
        pool.execute(target);

        // 开始创建临时线程
        pool.execute(target);
        pool.execute(target);

        // 不创建，拒绝策略被触发！！
        pool.execute(target);  // 抛出异常  RejectedExecutionException

        // todo 4.关闭线程池
        //pool.shutdownNow();  // 立即关闭，即使任务没有执行完，会丢失任务
        pool.shutdown();  // 会等待任务执行完毕后才完毕（可以使用）
    }
}


// todo 3.定义任务
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i < 2; i++) {
            System.out.println(Thread.currentThread().getName() + "输出了：HelloWorld ==>" + i);
        }
        try {
            System.out.println("本任务与线程"+ Thread.currentThread().getName()+ "进行绑定，线程进入休眠");
            Thread.sleep(500000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

## **通过 Executors 工厂类使用线程池（阿里规约曰禁止使用）**

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

// 使用 Executors静态工厂方法创建线程池对象
public class ThreadPoolTest {
    public static void main(String[] args) {
        // todo 1.获取一个指定线程数量的线程池
        ExecutorService threadPool = Executors.newFixedThreadPool(5);

        // todo 2.提交任务给线程池，并且使用匿名内部类的方式定义任务
        threadPool.execute(() -> {
            int sum = 0;
            for (int i = 1; i <= 100; i++) {
                if (i % 2 == 0) {
                    sum += i;
                }
            }
            System.out.println("sum this is " + sum);
        });
        threadPool.execute(() -> System.out.println("hello world"));
        threadPool.execute(() -> System.out.println("hello world"));
        threadPool.execute(() -> System.out.println("hello world"));
        threadPool.execute(() -> System.out.println("hello world"));

        // todo 4.关闭线程池
        threadPool.shutdown();
    }
}
```
