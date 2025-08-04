# Java中为什么需要使用ThreadLocal？ThreadLocal原理

>   引言：
>
>   ​	在多线程情况下，操作同一资源为了避免数据错误，会搞一个 synchronized 或者是 lock，那么如果我既不想加锁，又想保证数据安全，要怎么办呢？
>
>   这种既要又要的场景——可以使用TreadLocal



>   ThreadLocal源码翻译：
>
>   TreadLocal提供线程局部变量。这些变量与正常的变量不同，因为每个线程在访问ThreadLocal实例时（通过get、set方法）**都有自己的、独立初始化的变量副本**。ThreadLocal 实例通常是类中私有静态字段，使用它的目的是希望将状态（例如，用户id或事务id）与线程关联起来。



**！！！ThreadLocal，不应该理解为本地线程，而应该理解为【线程本地变量】**

 

ThreadLocal的实现依赖于每个线程内部维护的一个ThreadLocalMap对象。

每个线程都有自己的ThreadLocalMap，而ThreadLocalMap中存储了所有ThreadLocal变量及其对应的值。

换句话说，就是每个线程都有一个自己专属的本地变量副本，不与其他线程共享。

主要作用：解决了让每个线程绑定自己的值，通过使用get、set方法，获取默认值或将其值更改为当前线程所存的副本的值从而避免了线程安全问题。



**主要组成部分**

-   **ThreadLocal 类**：提供了set()、get()、remove()等方法，用于操作线程局部变量。

-   **ThreadLocalMap 类**：是ThreadLocal的内部静态类，用于存储ThreadLocal变量及其值。

-   **Thread 类**：每个线程内部都有一个ThreadLocalMap实例。

**工作机制**

-   **创建ThreadLocal变量**：当创建一个ThreadLocal变量时，实际上并没有分配存储空间。

-   **获取值 (get()方法)**：当调用get()方法时，当前线程会通过自己的ThreadLocalMap获取ThreadLocal变量的值。
    -   如果不存在，则调用initialValue()方法获取初始值。

-   **设置值 (set()方法)**：当调用set()方法时，当前线程会通过自己的ThreadLocalMap设置ThreadLocal变量的值。

-   **删除值 (remove()方法)**：当调用remove()方法时，当前线程会通过自己的ThreadLocalMap删除ThreadLocal变量的值。
-   初始化值：initialValue、withInitial（静态方法）。推荐使用withInitial进行初始化，因为支持lambda表达式，优雅

**使用场景**

-   **数据库连接**：在多线程环境中，每个线程可以使用自己的数据库连接，避免连接共享带来的问题。
-   **用户会话（上下文传递）**：在 Web 应用中，每个线程可以维护自己的用户会话信息。
-   **事务管理**：在分布式系统中，每个线程可以维护自己的事务上下文，确保事务的一致性。
-   **线程安全的工具类**：例如SimpleDateFormat，它不是线程安全的，可以使用ThreadLocal让每个线程都有自己的实例。

