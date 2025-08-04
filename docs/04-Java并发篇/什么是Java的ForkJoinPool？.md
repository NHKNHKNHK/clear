# 什么是Java的ForkJoinPool？

Java的ForkJoinPool是JDK 7引入的一个专门用于并行执行任务的**线程池**，它采用”**分而治之**“算法来解决大规模的并行问题。

核心机制：

​	1、**Fork（分解）**：任务被递归分解为更小的子任务，直到达到不可再分的程序

​	2、**Join（合并）**：子任务执行完毕后，将结果合并，形成最终的解决方案

**工作窃取算法**：ForkJoinPool使用了一种称为工作窃取的调度算法。空闲的工作线程会从其他繁忙线程的工作队列中”窃取“未完成的任务以保持资源高效利用

关键类：

-   `ForkJoinPool`：表示Fork/Join框架中的线程池。

-   `ForkJoinTask`：任务的基础抽象类，子类有：`RecursiveTask`、`Recursivection`，分别用于有返回值和无返回值任务



**ForkJoinPool与普通线程池的区别**

-   **任务分解与合并**：穿透的线程池一般处理相对独立的任务，而ForkJoinPool则擅长处理可以分解的任务，最终将结果进行合并
-   **线程调度策略**：ForkJoinPool中的每个工作线程都维护着自己的双端队列，并通过工作窃取来平衡任务，而普通线程池通常由中央队列来管理任务



**ForkJoinPool与并行流的关系**

Java 8中的并行流（Parallel Streams）底层正是基于ForkJoinPool实现的，通过`paralleStream()`方法，可以轻松的利用ForkJoinPool来实现并行操作，从而提高处理效率。

