## 为什么要使用多线程？



## 串行、并行和并发有什么区别？





## 进程、线程、管程、协程区别？

**进程（Process）**

进程是操作系统分配资源的基本单位。每个进程都有自己的内存空间、文件描述符、堆栈等资源。

-   **进程的特点**
    -   **独立性**：进程之间是独立的，互不干扰。一个进程的崩溃不会影响其他进程。
    -   **资源丰富**：每个进程拥有独立的资源，包括内存、文件句柄等。
    -   **开销大**：创建和销毁进程的开销较大，进程间通信（IPC）也相对复杂。
    -   **上下文切换**：进程的上下文切换开销较大，因为需要切换内存空间和资源。

-   **使用场景**
    -   适用于需要强隔离和独立资源的场景，如独立的服务、应用程序等

**线程 (Thread)**

线程是进程内的执行单元，一个进程可以包含多个线程。线程共享进程的资源（如内存空间、文件描述符）。

-   **线程的特点**
    -   **共享资源**：同一进程内的线程共享内存和资源，通信方便。
    -   **轻量级**：线程的创建和销毁开销较小，上下文切换较快。
    -   **并发执行**：多线程可以并发执行，提高程序的响应速度和资源利用率。
    -   **同步问题**：由于共享资源，线程间需要同步机制（如锁）来避免资源竞争和数据不一致。

-   **使用场景**
    -   适用于需要并发执行的任务，如多任务处理、并行计算等。

 **管程 (Monitor)** 

管程是一种高级的同步机制，用于管理共享资源的并发访问。它将共享资源和访问资源的代码封装在一起，通过条件变量和互斥锁来实现同步。

-   **管程特点** 
    -   封装性：将共享资源和同步代码封装在一起，提供更高层次的抽象。
    -   互斥访问：通过互斥锁确保同一时刻只有一个线程可以访问共享资源。
    -   条件同步：使用条件变量来协调线程间的执行顺序。

-   **使用场景** 
    -   适用于需要对共享资源进行复杂同步操作的场景，如操作系统内核、并发数据结构等。

 **协程 (Coroutine)** 

协程是一种比线程更轻量级的并发执行单元。协程由程序自身调度，而不是由操作系统内核调度。协程可以在执行过程中主动让出控制权，以便其他协程运行。

-   **协程特点** 
    -   **轻量级**：协程的创建和切换开销极小，通常在用户态完成。
    -   **主动让出**：协程通过显式的调用（如yield）让出控制权，实现合作式多任务。
    -   **非抢占式**：协程之间的切换是合作式的，不存在抢占问题。
    -   **栈独立**：每个协程有自己的栈，避免了线程间共享栈带来的同步问题。

-   **使用场景** 
    -   适用于需要大量并发任务且切换频繁的场景，如高并发网络服务器、异步编程等。

**虚拟线程 (Virtual Thread)** 

虚拟线程是一个新概念，特别是在 Java 的 Project Loom 中引入。虚拟线程是一种轻量级线程，由 JVM 管理，旨在简化并发编程并提高并发性能。

-   **特点** 
    -   **轻量级**：虚拟线程的创建和销毁开销极小，可以高效地管理数百万个线程。
    -   **自动管理**：由 JVM 自动调度和管理，不需要开发者显式地管理线程池。
    -   **兼容性**：与传统的 Java 线程 API 兼容，开发者可以用熟悉的线程模型编写高并发程序。
    -   **阻塞操作**：虚拟线程可以在阻塞操作（如 I/O 操作）时高效地让出 CPU，而不会浪费资源。

-   **使用场景** 
    -   适用于高并发应用程序，如高性能服务器、Web 应用等。

  

## 用户线程与守护线程区别?

**用户线程**

用户线程是应用程序创建的普通线程，也称为非守护线程。当所有用户线程都结束时，Java 虚拟机 (JVM) 也会退出。

**特点**

-   **生命周期**：用户线程的生命周期由应用程序控制。只要有一个用户线程在运行，JVM 就会继续运行。

- **重要性**：用户线程通常用于执行应用程序的主要任务，例如处理业务逻辑、执行计算等。

-   **关闭 JVM**：JVM 只有在所有用户线程都结束后才会退出，即使还有守护线程在运行。

**使用场景**

-   适用于需要执行重要任务且不能中途被终止的线程。例如：处理用户请求的线程，执行关键业务逻辑的线程



**守护线程 (Daemon Thread)**

守护线程是为其他线程提供服务和支持的线程。当所有非守护线程（用户线程）都结束时，JVM 会自动退出，即使守护线程还在运行。

**特点**

-   **生命周期**：守护线程的生命周期依赖于用户线程。当所有用户线程结束时，守护线程也会自动终止。

-   **后台任务**：守护线程通常用于执行后台任务，如垃圾回收、日志记录等。

-   **低优先级**：守护线程通常优先级较低，因为它们主要为用户线程提供支持。

**使用场景**

-   适用于执行后台任务或辅助任务的线程，这些任务不需要在 JVM 退出时完成。例如：JVM 的垃圾回收线程，日志记录线程，监控和统计线程

示例

```java
public class ThreadExample {
    public static void main(String[] args) {
        Thread userThread = new Thread(() -> {
            try {
                Thread.sleep(5000);
                System.out.println("User thread finished");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        Thread daemonThread = new Thread(() -> {
            while (true) {
                try {
                    Thread.sleep(1000);
                    System.out.println("Daemon thread running");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        daemonThread.setDaemon(true);

        userThread.start();
        daemonThread.start();

        System.out.println("Main thread finished");
    }
}
```

在这个例子中：

userThread是一个用户线程，它会运行 5 秒钟。daemonThread是一个守护线程，它会每秒钟打印一次消息。

当userThread结束后，JVM 会退出，即使daemonThread还在运行



## Java创建线程的方式有哪些？

Java语言的JVM允许程序运行多个线程，使用`java.lang.Thread`类代表**线程**，所有的线程对象都必须是Thread类或其子类的实例。

**Thread类的特性**

-   每个线程都是通过某个特定Thread对象的run()方法来完成操作的，因此把**run()方法体称为线程执行体**。
-   通过该Thread对象的**start()方法来启动这个线程**，而非直接调用run()（如果使用Thread方法直接调用run方法，相当于main线程在执行该方法）
-   要想实现多线程，必须在主线程中创建新的线程对象

在学习线程的创建方式之前需要明白：下面的方式都只是创建线程的方式，==本质上线程的创建方式只有一种，那就是Thread.start()==

**方式1：继承Thread类**

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



 **方式2：实现Runnable接口**

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



**方式二：使用Lambda表达式简化Runnable接口的实现**

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



**方式三：实现Callable接口**（JDK5.0增加）

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



**方式四：使用线程池**

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

**通过 Executors 工厂类使用线程池（阿里规约曰禁止使用）**

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



## Java创建线程的几种方式有什么区别？

**继承Thread类**

-   实现方式：通过继承 `java.lang.Thread` 类并重写 `run()` 方法。

-   特点：
    -   简单直接，适合简单的场景。
    -   **受限于 Java 的单继承机制**，如果类已经继承了其他类，则不能使用这种方式。
    -   **不支持返回值**：任务执行完毕后无法返回结果。

-   适用场景：非常基础的并发需求，代码量较少且不需要复杂功能。不适合复杂的线程管理和资源共享场景

**实现Runnable接口**

-   实现方式：通过实现 `java.lang.Runnable` 接口并重写 `run()` 方法，然后将 Runnable 实例传递给 Thread 类的构造函数。
-   特点：
    -   **避免了单继承限制**，灵活性更高（因为类可以实现多个接口）。
    -   **资源共享**：多个线程可以共享同一个 Runnable 实例，便于资源共享。
    -   **不支持返回值**：任务执行完毕后无法返回结果
-   适用场景：大多数并发编程场景，尤其是需要多个线程执行相同任务时。

**实现Callable接口和使用FutureTask**

-   实现方式：通过实现 `java.util.concurrent.Callable` 接口并重写 `call()` 方法。与 Runnable 不同，Callable **可以返回结果**并且**可以抛出异常**。但实现和使用稍微复杂一些。

-   特点：
    -   **支持返回值和异常处理**，适用于需要返回结果的任务。
    -   通常与 Future 和 ExecutorService 一起使用，便于管理和获取任务结果。（使用FutureTask来管理和返回结果）

-   适用场景：需要任务返回结果或处理异常的场景。

**使用线程池**

-   实现方式：通过 `java.util.concurrent.ExecutorService` 来管理线程的创建和执行。ExecutorService 提供了线程池管理功能，如固定大小的线程池、缓存线程池、定时线程池等。

-   特点
    -   **线程池管理**：通过线程池复用线程，减少频繁创建和销毁线程的开销。
    -   **任务调度**：支持异步任务提交和结果获取。
    -   **灵活配置**：可以根据任务量动态调整线程池大小。可以根据需求选择不同类型的线程池（如固定大小、缓存、定时等）。
    -   **简化开发**：隐藏了线程管理的复杂性，使代码更加简洁和易于维护。

-   适用场景：需要高效管理和复用线程的场景，特别是高并发环境。



## 为什么不建议使用Executors来创建线程池？（阿里规约）

`Executors`：一个**线程池的工厂类**，通过此类的**静态工厂方法**可以创建多种类型的线程池对象。 

Executors提供了4个常用方法来创建内置的线程池

1、**newFixedThreadPool**

Executors.newFixedThreadPool(int nThreads)：创建一个可重用**固定线程数**的线程池 

```java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  new LinkedBlockingQueue<Runnable>());
}
```

发现创建的队列为LinkedBlockingQueue，是一个无界阻塞队列，如果使用改线程池执行任务，如果任务过多就会不断的添加到队列中，任务越多占用的内存就越多，最终可能耗尽内存，导致OOM

2、**SingleThreadExecutor**

Executors.newSingleThreadExecutor() ：创建一个只有**一个线程**的线程池 

```java
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
        (new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>()));
}
```

发现创建的队列为LinkedBlockingQueue，是一个无界阻塞队列，如果使用改线程池执行任务，如果任务过多就会不断的添加到队列中，任务越多占用的内存就越多，最终可能耗尽内存，导致OOM

3、**CachedThreadPool**

Executors.newCachedThreadPool()：创建一个可根据需要创建新线程的线程池

```java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>());
}
```

它的特点是线程数不受限制，可以根据需要创建新线程。虽然这对于短时间的任务非常有用，但如果任务执行时间较长或任务量较大，可能会导致大量线程堆积，从而消耗过多系统资源，最终导致OOM

4、**ScheduledThreadPool**

Executors.newScheduledThreadPool(int corePoolSize)：创建一个线程池，它可安排在给定延迟后运行命令或者定期地执行。 

```java
public ScheduledThreadPoolExecutor(int corePoolSize) {
    super(corePoolSize, Integer.MAX_VALUE, 0, NANOSECONDS,
          new DelayedWorkQueue());
}
```

**阿里规约**

![1725368123975](D:/video/workspace/easy-interview/04-Java%E5%B9%B6%E5%8F%91%E7%AF%87/assets/1725368123975.png)



## 线程池相关的常用API？

​	JDK5.0 之前，我们必须手动自定义线程池。**从 JDK5.0 开始，Java 内置线程池相关的API**。在 `java.util.concurrent` 包下提供了线程池相关 API：`ExecutorService`接口 和 `Executors`工厂类。 

-   ExecutorService：真正的线程池接口。常见子类 **ThreadPoolExecutor** 
    -   `void execute(Runnable command)`：执行任务/命令，没有返回值，一般用来执行 Runnable
    -   `<T> Future<T> submit(Callable<T> task)`：执行任务，有返回值，一般又来执行 Callable 
    -   `void shutdown()` ：关闭连接池 
-   Executors：一个**线程池的工厂类**，通过此类的**静态工厂方法**可以创建多种类型的线程池对象。 
    -   `Executors.newCachedThreadPool()`：创建一个可根据需要创建新线程的线程池
    -   `Executors.newFixedThreadPool(int nThreads)`：创建一个可重用固定线程数的线程池 
    -   `Executors.newSingleThreadExecutor()` ：创建一个只有一个线程的线程池 
    -   `Executors.newScheduledThreadPool(int corePoolSize)`：创建一个线程池，它可安排在给定延迟后运行命令或者定期地执行。 

下面是java.util.concurrent包下 ThreadPoolExecutor 类中参数最多的一个构造器

```java
public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory,
                              RejectedExecutionHandler handler)
    	

// corePoolSize：线程池的核心线程数。在没有任务执行时，线程池会保持这些核心线程的数量。
// 即使这些线程处于空闲状态，它们也不会被销毁。当有新的任务提交时，线程池会优先使用核心线程来执行任务。

// maximumPoolSize：线程池的最大线程数。线程池中允许创建的最大线程数，包括核心线程和非核心线程。
// 当任务提交的数量超过核心线程数，并且任务队列已满时，线程池会创建新的非核心线程来执行任务，直到达到最大线程数。

// keepAliveTime：非核心线程的空闲时间。当线程池中的线程数量超过核心线程数时，空闲的非核心线程会在指定的时间内保持存活状态。如果在这段时间内没有新的任务提交，这些线程将被销毁。

// unit：空闲时间的时间单位。指定 keepAliveTime 参数的时间单位，例如 TimeUnit.SECONDS 表示秒。

// workQueue：任务队列。用于存储待执行的任务的阻塞队列。当线程池中的线程都在执行任务时，新的任务会被放入任务队列中等待执行。

// threadFactory：线程工厂。用于创建新线程的工厂对象。可以自定义线程的创建逻辑，例如设置线程的名称、优先级等。
- SynchronousQueue：直接提交队列
- ArrayBlockingQueue：有界队列，可以指定容量
- LinkedBlockingQueue：无界队列
- PriorityBlockingQueue：优先任务队列，可以根据任务的优先级顺序执行
- DelayQueue：延迟任务

// handler：拒绝策略。当线程池已经达到最大线程数，并且任务队列已满时，新的任务无法提交时，会触发拒绝策略来处理这些被拒绝的任务。
// 可以使用预定义的拒绝策略，如 ThreadPoolExecutor.AbortPolicy、ThreadPoolExecutor.DiscardPolicy、ThreadPoolExecutor.DiscardOldestPolicy 或自定义的拒绝策略。 
```



## **终止线程的四种方式**



## 启动一个线程用start还是run？



## **线程的基本方法**



## **Java多线程的生命周期是什么**



## **创建线程的底层原理**？



## 怎么理解线程分组？



## 线程的状态有哪几种？



## Java的线程优先级是什么？有什么用？

在Java中，每个线程都有一个优先级，优先级决定了线程调度器对线程的调度顺序。线程的优先级是一个整数值，范围在1到10之间。

Java 中的线程优先级用于指示线程调度器（Thread Scheduler）在分配 CPU 时间时对不同线程的重视程度。线程优先级是一个整数值，范围从 1 到 10，默认情况下所有线程的优先级为 5（即 NORM_PRIORITY）。优先级越高，线程越有可能被优先执行。

**优先级常量**

Java 提供了三个静态常量来表示常见的优先级：

-   MIN_PRIORITY：最低优先级，值为 1。

-   NORM_PRIORITY：默认优先级，值为 5。
-   MAX_PRIORITY：最高优先级，值为 10。

**线程优先级的作用**

口语化：线程优先级是对线程调度器的一种建议，调度器会根据优先级来决定哪个线程应该优先执行。然而，线程优先级并不能保证线程一定会按照优先级顺序执行，具体的调度行为依赖于操作系统的线程调度策略。

-   **影响调度顺序**：优先级较高的线程更有可能被调度器选中执行。然而，这并不意味着高优先级线程一定会立即执行，具体行为取决于操作系统的调度策略。
-   **资源分配**：在某些操作系统上，线程优先级可以影响 CPU 时间片的分配。高优先级线程可能会获得更多的 CPU 时间片，从而更快完成任务。
-   **提高响应性**：对于需要快速响应的任务（如用户界面事件处理），可以适当提高其优先级以确保及时处理。
-   **避免饥饿**：如果某些线程的优先级过低，可能会导致它们长时间得不到执行机会（即“饥饿”现象）。合理设置优先级可以避免这种情况。

**设置线程优先级**

可以通过`setPriority(int newPriority)`方法来设置线程的优先级。需要注意的是，设置的优先级必须在1到10之间，否则会抛出`IllegalArgumentException`

```java
public class ThreadPriorityExample {
    public static void main(String[] args) {
        Thread lowPriorityThread = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                System.out.println("Low priority thread running");
            }
        });
        lowPriorityThread.setPriority(Thread.MIN_PRIORITY);

        Thread highPriorityThread = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                System.out.println("High priority thread running");
            }
        });
        highPriorityThread.setPriority(Thread.MAX_PRIORITY);

        lowPriorityThread.start();
        highPriorityThread.start();
    }
}
```

我们创建了两个线程，一个设置为最低优先级，一个设置为最高优先级。通常情况下，系统会优先调度高优先级的线程执行，但这并不是绝对的，具体行为依赖于操作系统的调度策略。

**注意事项**

-   **不可过度依赖优先级**：线程优先级只是一个提示，具体的调度行为仍然由操作系统决定。不要完全依赖优先级来控制程序的行为，尤其是在跨平台应用中，不同操作系统的调度策略可能有所不同。

-   **避免频繁调整优先级**：频繁调整线程优先级可能会导致性能问题，并且难以预测实际效果。通常只在必要时进行调整。应该更多地通过设计合理的并发控制机制（如锁、信号量、条件变量等）来管理线程。

-   **主调用栈限制**：Java 规范要求主线程（main thread）的优先级不能低于其他线程。因此，设置线程优先级时需要注意这一点。

-   **守护线程不受影响**：守护线程（Daemon Thread）的优先级设置与普通线程相同，但它们不会影响 JVM 的退出行为。



## **线程的安全三大特性**



## 怎么让3个线程按顺序执行？



## 线程间的通信方式？



## 为什么说线程的上下文切换效率不高



## **线程什么时候主动放弃CPU**



## **引起CPU进行上下文切换的原因**



## **JVM的线程调度是什么？**



## join方法有什么用？什么原理？



## sleep和wait、yield方法有什么区别？



## 怎么理解Java中的线程中断？



## 如何优雅的终止一个线程？



## synchronized同步锁有哪几种方法？



## **wait和notifiy的虚假唤醒的产生原因及如何解决**



## 怎么理解wait、notify、notifyAll方法？



## 死锁的发生原因？怎么避免？



## 什么是协程？Java支持协程吗？

## 什么是Java中的线程同步？



## 什么是Java中的ABA问题？



## volatile关键字的作用？



## 什么是Java中的指令重排？



## 为什么指令重排能够提高性能？



## volatile如何防止指令重排？



## volatile保证线程的可见性和有序性，不保证原子性是为什么？



## 什么是内存屏障？



## 什么是Java的happens-before规则？



## final关键字能否保证变量的可见性？



## Java内存模型（JMM）？



## 什么是Java中的原子性、可见性、有序性？



## 什么是Java的CAS（）操作？



## Java中Thread.sleep(0)的作用是什么？



## 什么是Java中的TransmittableThreadLocal？



## Java中父子线程如何传递数据？



## Java中为什么需要使用ThreadLocal？



## **ThreadLocal原理**



## ThreadLocal的缺点？



## **ThreadLocal的内存泄漏问题**

## **如何避免ThreadLocal的内存泄漏？**



## 使用ThreadLocal是需要用弱引用来防止内存泄露？



## ThreadLocal是如何实现线程资源隔离的？



## **ThreadLocal的用法**



## **ThreadLocal慎用的场景**



## ThreadLocal最佳实践？



## 为什么Netty不适用ThreadLocal而是自定义FastThreadLocal？



## Java中线程安全是什么意思？



## 你是怎么理解线程安全问题的？



## Java中线程之间是如何通信的？



## 如何在Java中控制多个线程的执行顺序？



## 线程的生命周期在Java中是如何定义的？



## 谈谈你对AQS的理解？（抽象的队列同步器）



## 谈谈你对CAS的理解？



## **什么是自旋锁**？



## **自旋锁的优缺点**



## **自旋锁时间阈值**







## 什么是可重入锁及使用场景？



## **可重入锁实现原理**



## **锁升级机制是怎样的**



## **常用的锁都有哪些，适用的场景**



## Lock常用的实现类？



## Locak的实现方法？



## **ReentrantLock的实现**



## **Semaphore信号量的使用**



## Java中的synchronized是怎么实现的？（底层实现）



## **synchronized是可重入锁吗**



## **synchronized能否被打断，什么情况下打断**



## **synchronized的不同作用范围有什么区别**



## **为什么wait和notify必须要在synchronized代码块使用？**



## Java中的synchronized轻量级锁是否会进行自旋？



## Java中的synchronizeds升级到重量级锁时，会发生什么？



## 什么是Java中的锁自适应自旋？



## lock和synchronized的区别？



## ReentrantLock和synchronized的区别？



## **线程池的异步任务执行完后，如何回调**



## 你理解Java线程池原理吗？



## 如何设置Java线程池的线程数？



## Java线程池有哪些拒绝策略？



## 如何优化Java中的锁？



## 线程池如何知道一个线程的任务已经执行完毕了？（小米）





## Java并发库中提供了哪些线程池实现？它们有什么区别？



## Java中的Delay和ScheduledThreadPool有什么区别？



## 什么是Java的Timer？



## 什么叫做阻塞队列的有界和无解？





## 讲一下wait和notify为什么要在synchronized代码块中？





## **为什么多线程执行时，需要catch Interrupt异常，catch里面写啥**



## **interrupt的标志位是否会回归到原有标记**





## **Park和unPark的使用**



## **ReadWriteLock的整体实现**



## **Lock的公平锁与非公平锁**



## **AtomicInteger的实现方式及场景**



## 你了解时间轮（Time Wheel）吗？他在Java中有哪些应用场景？



## 你使用过哪些Java并发工具？



## 你使用过Java中哪些阻塞队列？



## 你使用过Java中哪些原子类？



## 你使用过Java中的累加器吗？



## 什么是守护线程？他有什么特点？



## reentrantLock是如何实现公平锁和非公平锁？



## reentrantLock的实现原理？



## 你了解Java中的读写锁吗？



## 如何优化Java中的锁？



## 什么是Java的Semaphore？



## 什么是Java的CycliBarrier？



## 什么是Java的CountDownLatch？**countdownLatch用法**



## 什么是Java的CyclicBarrier？CyclicBarrier用法？







## 什么是Java的StampedLock？



## 什么是Java的CompletableFuture？





## 什么是Java的ForkJoinPool？





## 程序、进程、线程？

**程序（program）**

为完成特定任务，用某种语言编写的一组指令的集合。即指一段静态的代码，静态对象。

**进程（process）**

程序的一次执行过程，或是正在内存中运行的应用程序。如：运行中的 QQ，运行中的网易音乐播放器。

-   每个进程都有一个独立的内存空间，系统运行一个程序即是一个进程从创建、运行到消亡的过程。（生命周期）
-   程序是静态的，进程是动态的
-   **进程作为操作系统调度和分配资源的最小单位**（亦是系统运行程序的基本单位），系统在运行时会为每个进程分配不同的内存区域。
-   现代的操作系统，大都是支持多进程的，支持同时运行多个程序。比如：现在我们上课一边使用编辑器，一边使用录屏软件，同时还开着画图板，dos 窗口等软件。

**线程（thread）**

进程可进一步细化为线程，是程序内部的一条执行路径。一个进程中至少有一个线程。

-   一个进程同一时间若并行执行多个线程，就是支持多线程的。
-   **线程作为 CPU 调度和执行的最小单位。**
-   **一个进程中的多个线程共享相同的内存单元**，它们从同一个堆中分配对象，可以访问相同的变量和对象。这就使得线程间通信更简便、高效。但多个线程操作共享的系统资源可能就会带来安全的隐患。
-   与进程相比，线程更加”轻量级“，创建、撤销一个线程比启动新进程的开销小得多



##  线程调度?

线程调度是操作系统的一项核心功能，它负责管理和分配处理器时间给多个线程。在多线程环境中，线程调度确保各个线程能够公平地获得CPU时间，并且在必要时能够进行上下文切换。以下是关于线程调度的一些基本概念和常见策略。

-   **分时调度**

所有**线程轮流**使用cpu的使用权，并且平均分配每个线程的使用时间

-   **抢占式调度**

让**优先级高**的线程以**较大的概率**优先使用 CPU。如果线程的优先级相同，那么会随机选择一个(线程随机性)，**Java使用的为抢占式调度。**



## 并发与并行

**并发（concurrency）**：指**两个或多个事件在同一个时间段内发生**。即在一段时间内，有多条指令在单个CPU上快速轮换、交替执行，使得在宏观上具有多个进程同时执行的效果。（微观上分时交替执行，宏观上同时进行）    

比如：

​	小渣有五个女朋友，在某一天的上午7点到12点需要与五个女朋友约会，在7-8点他与女友A约会，8-9点他与女友B约会，9-10点他与女友C约会，10-11点他与女友D约会，11-12点他与女友E约会，他在一上午与5个女朋友约会了，在宏观上他就是在8-12点这段时间内与五个女朋友一起约会了。

**并行（parallel）**：指两个或多个事件在同一时刻发生（同时发生）。指在同一时刻，有多条指令在多个CPU上同时执行。

比如：

​	小渣有五个女朋友，在某一天的上午7点到12点需要与五个女朋友约会，意思就是在7-12点这段时间（假设这是一个时刻）内要与五个女朋友一起约会，这就叫并行。（但是这在现实生活中肯定是不肯的，除非有五个小渣）



## JDK1.5之前线程的五种状态

线程的生命周期有五种状态：新建（New）、就绪（Runnable）、运行 （Running）、阻塞（Blocked）、死亡（Dead）。CPU 需要在多条线程之间切换，于是线程状态会多次在运行、阻塞、就绪之间切换。

![1724855964756](assets/jdk1.5之前线程的五种状态.png)

-   **新建（New）**

当一个 Thread 类或其子类的对象被声明并创建时，新生的线程对象处于新建状态。

此时它和其他 Java 对象一样，仅仅由 JVM 为其分配了内存，并初始化了实例变量的值。

此时的线程对象并**没有任何线程的动态特征**，程序也不会执行它的线程体 run()。

-   **就绪（Runnable）**

但是当线程对象调用了 **start()**方法之后，就不一样了，线程就从新建状态转为**就绪状态**。JVM 会为其创建方法调用栈和程序计数器，当然，处于这个状态中的线程并没有开始运行，只是表示已**具备了运行的条件**，随时可以被调度。至于什么时候被调度，取决于 JVM 里线程调度器的调度。

>   注意：
>
>   ​	程序只能对新建状态（NEW）的线程调用 start()，并且只能调用一次，如果对非新建状态的线程，如已启动的线程或已死亡的线程调用 start()都会报错 `IllegalThreadStateException` 异常。

-   **运行 （Running）**

如果处于就绪状态的线程获得了**CPU资源**时，开始执行 run()方法的线程体代码，则该线程处于运行状态。如果计算机只有一个 CPU 核心，在任何时刻只有一个线程处于运行状态，如果计算机有多个核心，将会有多个线程并行 
(Parallel)执行。

当然，美好的时光总是短暂的，而且 CPU 讲究雨露均沾。对于**抢占式策略**的系统而言，系统会给每个可执行的线程一个小时间片来处理任务，当该时间用完，系统会剥夺该线程所占用的资源，让其回到就绪状态等待下一次被调度。

此时其他线程将获得执行机会，而在选择下一个线程时，系统会适当考虑线程的优先级。

-   **阻塞（Blocked）**

当在运行过程中的线程遇到如下情况时，会让出CPU并临时中止自己的执行，进入阻塞状态：

1.  线程调用了 **sleep()**方法，主动放弃所占用的 CPU 资源；
2.  线程试图获取一个同步监视器，但该同步监视器正被其他线程持有；
3.  线程执行过程中，同步监视器调用了 wait()，让它等待某个通知（notify）；
4.  线程执行过程中，同步监视器调用了 wait(time)
5.  线程执行过程中，遇到了其他线程对象的加塞（join）；
6.  线程被调用 suspend 方法被挂起（已过时，因为容易发生死锁）；

当前正在执行的线程被阻塞后，其他线程就有机会执行了。针对如上情况，当发生如下情况时会解除阻塞，让该线程重新进入就绪状态，等待线程调度器再次调度它：

1.  线程的 sleep()时间到；
2.  线程成功获得了同步监视器；
3.  线程等到了通知(notify)；
4.  线程 wait 的时间到了
5.  加塞的线程结束了；
6.  被挂起的线程又被调用了 resume 恢复方法（已过时，因为容易发生死锁）；

-   **死亡（Dead）**

线程会以以下三种方式之一结束，结束后的线程就处于死亡状态：

1.  run()方法执行完成，线程正常结束
2.  线程执行过程中抛出了一个未捕获的异常（Exception）或错误（Error）
3.  直接调用该线程的 stop()来结束该线程（已过时）

 

## JDK1.5之后线程的五种状态

![1724856202888](assets/jdk1.5之后线程的六种状态.png)

在jdk1.5及之后线程有如下6种状态：

-   **NEW（新建）**

该线程还没开始执行

-   **Runnable（可运行）**

一旦调用**start()**方法，线程将处于**Runnable状态**，一个可运行的线程可能正在运行也可能还未运行，这取决于操作系统给线程提供运行的时间。

一旦一个线程开始运行，它不必始终保持运行。（因为操作系统的时间片轮转机制，目的是让其他线程获得运行的机会）线程调度的细节依赖于操作系统提供的服务。抢占式调度系统给每一个可运行的线程一个时间片来执行任务。时间片完，操作系统将剥夺线程的运行权

>   注意：
>
>   ​	**任何给定时刻，一个可运行的线程可能正在运行也可能没有运行**（这就是为什么将这个状态称为可运行而不是运行）

-   **Blocked（被阻塞）**

    当线程处于被阻塞或等待状态时，它暂不活动。他不允许任何代码且消耗最少的资源。

-   **Waiting（等待）**

-   **Timed waiting（计时等待）**

-   **Terminated（被终止）**线程被终止有如下两种原因：

    -   因为**run方法正常退出**而自然死亡
    -   因为一个没有捕获的**异常终止了run方法**而意外死亡

>   说明：
>
>   ​	当从 WAITING 或 TIMED_WAITING 恢复到 Runnable 状态时，如果发现当前线程没有得到监视器锁，那么会立刻转入 BLOCKED 状态

特点强调，可以调用线程的**stop()方法（已过时）**杀死这个线程，但是该方法会抛出ThreadDeath错误对象，由此杀死线程。部分源码如下：

```java
@Deprecated
public final void stop() {
	SecurityManager security = System.getSecurityManager();
	if (security != null) {
		checkAccess();
		if (this != Thread.currentThread()) {
			security.checkPermission(SecurityConstants.STOP_THREAD_PERMISSION);
		}
	}
	// A zero status value corresponds to "NEW", it can't change to
	// not-NEW because we hold the lock.
	if (threadStatus != 0) {
		resume(); // Wake up thread if it was suspended; no-op otherwise
	}

	// The VM can handle all thread states
	stop0(new ThreadDeath());
}

public class ThreadDeath extends Error {
    private static final long serialVersionUID = -4417128565033088268L;
}
```

可调用如下方法确定当前线程的状态

```java
public State getState()		// 得到线程的当前状态 	
    						// NEW,RUNNABLE,BLOCKED,WAITING,TIMED_WAITING,TERMINATED;
```

在`java.lang.Thread.State` 的枚举类中这样定义：

```java
public enum State {
    /**
         * Thread state for a thread which has not yet started.
         	线程状态为尚未启动的线程。
         */
    NEW,  // NEW（新建）：线程刚被创建，但是并未启动。还没调用 start 方法。

    /**
     线程状态,用于可运行的线程。可运行的线程状态在Java虚拟机中执行,但可能正在等待操作系统的其他资源
	 如处理器。
    */
    RUNNABLE,  // RUNNABLE（可运行）：这里没有区分就绪和运行状态。因为对于 Java 对象来说，只能标记为可运行，至于什么时候运行，不是 JVM 来控制的了，是 OS 来进行调度的，而且时间非常短暂，因此对于 Java 对象的状态来说，无法区分

    // 重点说明，根据 Thread.State 的定义，阻塞状态分为三种：BLOCKED、WAITING、TIMED_WAITING
    BLOCKED,  // BLOCKED（锁阻塞）：在 API 中的介绍为：一个正在阻塞、等待一个监视器锁（锁对象）的线程处于这一状态。只有获得锁对象的线程才能有执行机会。

    WAITING,  // WAITING（无限等待）：在 API 中介绍为：一个正在无限期等待另一个线程执行一个特别的（唤醒）动作的线程处于这一状态。
    // 当前线程执行过程中遇到遇到 Object 类的 wait，Thread 类的join，LockSupport 类的 park 方法，并且在调用这些方法时，没有指定时间，那么当前线程会进入 WAITING 状态，直到被唤醒。
    // 通过 Object 类的 wait 进入 WAITING 状态的要有 Object 的notify/notifyAll 唤醒；
    // 通过 Condition 的 await 进入 WAITING 状态的要有Condition 的 signal 方法唤醒；
    // 通过 LockSupport 类的 park 方法进入 WAITING 状态的要有LockSupport类的 unpark 方法唤醒
    // 通过 Thread 类的 join 进入 WAITING 状态，只有调用join方法的线程对象结束才能让当前线程恢复

    TIMED_WAITING,  // TIMED_WAITING（计时等待）：在 API 中的介绍为：一个正在限时等待另一个线程执行一个（唤醒）动作的线程处于这一状态。
    // 当前线程执行过程中遇到 Thread 类的 sleep 或 join，Object 类的 wait，LockSupport 类的 park 方法，并且在调用这些方法时，设置了时间，那么当前线程会进入 TIMED_WAITING，直到时间到，或被中断

    TERMINATED;  //  Teminated（被终止）：表明此线程已经结束生命周期，终止运行。
}
```



## Thread类的特性？

-   每个线程都是通过某个特定Thread对象的run()方法来完成操作的，因此把**run()方法体称为线程执行体**。
-   通过该Thread对象的**start()方法来启动这个线程**，而非直接调用run()（如果使用Thread方法直接调用run方法，相当于main线程在执行该方法）
-   要想实现多线程，必须在主线程中创建新的线程对象

在学习线程的创建方式之前需要明白：下面的方式都只是创建线程的方式，==本质上线程的创建方式只有一种，那就是Thread.start()==





## 为什么启动线程不直接调用run()，而调用start()？

run()和start()的区别，包括以下4个方面

-   如果自己手动调用run()方法，那么就只是普通方法，没有启动多线程模式
-   run()方法由JVM调用，什么时候调用，执行的过程控制都有操作系统的CPU调度决定。
-   我们创建线程的目的是为了更充分地利用CPU资源，如果直接调用run()方法，就失去了创建线程的意义

-   start()方法是Java线程中约定的内置方法，能够确保代码在新的线程上下文中执行

-   start()方法包含了除创建新线程的特殊代码逻辑。run()方法是我们自己写的代码，显然没有这个能力

-   想要启动多线程，**必须调用start方法**。
-   **一个线程对象只能调用一次start()方法**启动线程，如果重复调用了，则将抛出以上的异常`IllegalThreadStateException`。



## 两次调用start方法会怎么样？

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



## 为什么不建议使用Executors来创建线程池？

Executors：一个**线程池的工厂类**，通过此类的**静态工厂方法**可以创建多种类型的线程池对象。 

Executors提供了4个常用方法来创建内置的线程池

1、**newFixedThreadPool**

Executors.newFixedThreadPool(int nThreads)：创建一个可重用固定线程数的线程池 

```java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  new LinkedBlockingQueue<Runnable>());
}
```

发现创建的队列为LinkedBlockingQueue，是一个无界阻塞队列，如果使用改线程池执行任务，如果任务过多就会不断的添加到队列中，任务越多占用的内存就越多，最终可能耗尽内存，导致OOM

2、**SingleThreadExecutor**

Executors.newSingleThreadExecutor() ：创建一个只有一个线程的线程池 

```java
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
        (new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>()));
}
```

发现创建的队列为LinkedBlockingQueue，是一个无界阻塞队列，如果使用改线程池执行任务，如果任务过多就会不断的添加到队列中，任务越多占用的内存就越多，最终可能耗尽内存，导致OOM

3、**CachedThreadPool**

Executors.newCachedThreadPool()：创建一个可根据需要创建新线程的线程池

```java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>());
}
```

它的特点是线程数不受限制，可以根据需要创建新线程。虽然这对于短时间的任务非常有用，但如果任务执行时间较长或任务量较大，可能会导致大量线程堆积，从而消耗过多系统资源，最终导致OOM

4、**ScheduledThreadPool**

Executors.newScheduledThreadPool(int corePoolSize)：创建一个线程池，它可安排在给定延迟后运行命令或者定期地执行。 

```java
public ScheduledThreadPoolExecutor(int corePoolSize) {
    super(corePoolSize, Integer.MAX_VALUE, 0, NANOSECONDS,
          new DelayedWorkQueue());
}
```

**阿里规约**

![1725368123975](assets/1725368123975.png)





## **乐观锁如果通过数据库实现，并发情况下，数据库如何保证一致**



## **什么是乐观锁？**



## **乐观锁的ABA 问题**



## **什么是悲观锁**





## **悲观锁的常见的实现方式**





## **CAS与Synchronized的使用情景?**



## **介绍一下常用的java的线程池？**



## **Java线程池的原理**



## **使用线程池的好处**



## **线程池的核心构造参数有哪些？**



## **Java 线程池工作过程？**



## **如何重构一个线程工厂**



## **线程池的拒绝策略有哪些？**



## **线程池的shutDown和shutDownNow的区别**