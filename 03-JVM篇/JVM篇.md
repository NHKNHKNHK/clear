## Java是如何实现跨平台的？



## 什么是JVM垃圾回收的concurrent mode failure？产生它的真正原因是什么？



## JVM的TLAB是什么？



## 编译执行和解释执行的区别是什么？JVM使用哪种方式？



## JVM的内存区域是如何划分的？







## JVM的内存结构？



## Java中的堆和栈的区别是什么？



## 堆里的分区怎么划分？



## 什么是Java中的直接内存？



## 什么是Java中的常量池？



## 怎么分析OOM内存溢出？



## 你了解Java中的类加载器吗？



## 什么是Java中的JIT（Just-In-Time）？





## 什么是Java中的AOT（Ahead-Of-Time）？



## 你了解Java中的逃逸分析吗？



## Java中场景的垃圾收集器有哪些？







## 如何判断对象的存活？解释强引用、软引用、弱引用和虚引用？

在 Java 中，对象的存活可以通过引用类型来判断。Java 提供了四种不同的引用类型：强引用、软引用、弱引用和虚引用。

**强引用（Strong Reference）**

最常见的引用类型，Java默认的引用实现

特点：

-   只要强引用存在，垃圾回收器永远不会回收被引用的对象。
-   当内存不足时，JVM宁愿抛出 `OutOfMemoryError` 错误，也不会回收强引用的对象。

```java
Object obj = new Object(); // 强引用
System.gc();
System.out.println(obj); // java.lang.Object@1540e19d
```

**软引用（Soft Reference）**

通过 `SoftReference` 类创建的对象引用。只有内存不足才会回收

特点:

-   软引用所引用的对象，在 JVM 内存不足时会被回收。
-   通常用于实现内存敏感的缓存。

```java
Object obj = new Object();
SoftReference<Object> softRef = new SoftReference<>(obj); // 软引用
obj = null; // 原始强引用置空
System.gc();
System.out.println(softRef.get()); // 当内存不足时，softRef.get() 可能返回 null
```

**弱引用（Weak Reference）**

通过 `WeakReference` 类创建的对象引用。不管内存足够与否，只要发生回收，都会回收

特点:

-   弱引用所引用的对象，在下一次垃圾回收时一定会被回收，无论内存是否充足。
-   常用于关联对象的映射表（如 `WeakHashMap`）。

```java
import java.lang.ref.WeakReference;

Object obj = new Object();
WeakReference<Object> weakRef = new WeakReference<>(obj); // 弱引用
obj = null; // 原始强引用置空
System.gc();
System.out.println(weakRef.get());// GC 后，weakRef.get() 返回 null
```

**虚引用（Phantom Reference）**

通过 `PhantomReference` 类创建的对象引用。 可以理解为不是引用，与对象的回收没有关系。

主要作用是跟踪对象被回收的过程

特点:

-   虚引用不会影响对象的生命周期。
-   虚引用必须和引用队列（`ReferenceQueue`）联合使用。
-   主要用于跟踪对象被垃圾回收的状态，通常用于资源清理

```java
Object obj = new Object();
ReferenceQueue<Object> referenceQueue = new ReferenceQueue<>();
PhantomReference phantomRef = new PhantomReference(obj, referenceQueue);
obj = null; // 原始强引用置空
System.gc();
System.out.println(phantomRef.get()); // null

// 对象被回收后，phantomRef 会被加入到 queue 中
// while ture是因为gc与当前不在同一个线程
while (true) {
    Object a;
    if ((a = referenceQueue.poll()) != null) {
        System.out.println(a); // java.lang.ref.PhantomReference@677327b6
        break;
    }
}
```

| 引用类型 | 是否会被回收 | 回收条件               |
| :------- | :----------- | :--------------------- |
| 强引用   | 不会         | 永远不会被回收         |
| 软引用   | 会           | 内存不足时             |
| 弱引用   | 会           | 下一次垃圾回收时       |
| 虚引用   | 不直接决定   | 仅用于跟踪对象回收状态 |



## 什么是双亲委派？



## 什么是指令重排？



## JVM怎么判断一个对象可以被回收？



## 如何判断对象是否是垃圾？不同垃圾回收方法的区别？



## 为什么Java的垃圾收集器将堆分为老年代和新生代？

## 为什么Java8移除了永久代（PermGen）并引入元空间（Metaspace）？





## G1垃圾收集的特点？为什么低延迟？



## G1垃圾回收流程？



## CMS垃圾回收流程？



## 你了解Java的ZGC吗？







## 为什么初始标记和重新标记需要STW（Stop-The-World）？

在垃圾收集的过程中，某些阶段需要“Stop-The-World”（STW）暂停，即暂停所有的应用程序线程，以便垃圾收集器能够安全地执行其任务。初始标记和重新标记阶段之所以需要STW，主要是出于以下原因：

### 初始标记（Initial Marking）

1.  **GC Roots的确定**:
    -   初始标记阶段需要确定所有的GC Roots（如线程栈中的局部变量、静态字段、JNI引用等）。由于GC Roots可能在应用程序运行过程中发生变化，因此需要暂停所有线程以确保GC Roots的准确性。
    -   在应用程序线程暂停的情况下，GC Roots不会改变，这使得垃圾收集器能够准确地识别出哪些对象是可达的，哪些对象是不可达的。
2.  **快速标记**:
    -   初始标记阶段通常是快速的，因为它只需要标记GC Roots直接引用的对象，而不是整个堆。暂停所有线程可以确保这个过程的准确性，避免因线程的并发修改而导致的问题。

### 重新标记（Remark）

1.  **解决并发标记期间的漏标问题**:
    -   在并发标记阶段，由于应用程序线程仍然在运行，可能会出现对象引用的变化，导致垃圾收集器无法完全准确地追踪所有对象的引用关系。这可能导致某些对象被错误地标记为可回收。
    -   重新标记阶段需要修正并发标记期间可能产生的标记错误，特别是那些由于对象引用的变化而未被正确标记的对象。
2.  **减少内存抖动**:
    -   重新标记阶段有助于减少内存抖动（memory churn），即频繁地分配和释放小对象。通过暂停所有线程，垃圾收集器可以更准确地确定哪些对象是暂时的，哪些是长期存活的，从而优化内存分配策略。
3.  **确保一致性**:
    -   重新标记阶段需要确保所有对象的状态一致，避免由于并发操作导致的不一致状态。暂停所有线程可以确保垃圾收集器能够准确地完成标记过程。

总结来说，初始标记和重新标记阶段需要STW的原因主要是为了确保GC Roots的准确性以及避免并发操作导致的标记错误。这两个阶段虽然会带来短暂的应用程序暂停，但由于它们通常很快完成，因此对应用程序性能的影响相对较小。

## 除了GC还有其他场景用安全点吗？



## CMS的垃圾回收过程，为什么需要分四步？



## JVM垃圾回收调优的两个主要目标是什么？



## 如何对Java的垃圾回收进行调优？



## 常用的JVM配置参数有哪些？





## 如何在Java中进行内存泄露分析？



## 你常用哪些工具来分析JVM性能？



## Java中的CMS垃圾收集器的写屏障如何维护卡表和增量更新？



## 什么是Java中的logging write barrier？



## 为什么G1垃圾会收集不维护年轻代到老年代的记忆集？



## CMS和G1垃圾收集器如何维持并发的正确性？



## CMS和G1垃圾收集器在记忆集的维护上有什么不同？



## JVM新生代回收如何避免全堆扫描？



## 为什么Java中某些新生代和老年代的垃圾收集器不能组合使用？比如ParNew和Parallel Old



## 为什么Java中CMS垃圾收集器在发生Concurrent Model Failure是的Full GC是单线程的？



## 什么是Java的PLAB？



## 什么条件会触发Java的yong GC?



## 什么条件会触发Java的Full GC?



## Java中有哪些垃圾回收算法？



## 什么是三色标记算法？



## Java中yong GC、old GC、Full FC、mixed GC的区别？



## 为什么Java新生代被划分为S0、S1、Eden区？