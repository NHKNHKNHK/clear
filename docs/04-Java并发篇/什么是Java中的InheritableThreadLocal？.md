# 什么是Java中的InheritableThreadLocal？

>   InheritableThreadLocal的核心目标是实现父子线程数据传递。父传子

**ThreadLocal**：每个线程拥有独立的变量副本，线程之间无法直接共享数据。

**InheritableThreadLocal**：除了为每个线程提供独立的变量副本外，还允许子线程继承父线程的变量值。

>   **注意**：
>
>   子线程只能继承父线程的初始值，后续父线程对变量的修改不会影响子线程的值。
>
>   这也是Alibaba为什么要自己搞一个`TransmittableThreadLocal`的原因，他解决了线程池复用的问题

**工作原理**

当一个线程创建子线程时，`InheritableThreadLocal` 会将父线程的变量值复制一份给子线程。具体流程如下：

1.  父线程设置 `InheritableThreadLocal` 的值。
2.  父线程创建子线程时，子线程会从父线程中复制 `InheritableThreadLocal` 的值。
3.  子线程可以访问该值，并且对该值的修改不会影响父线程或其他子线程。

 **使用场景**

-   **父子线程间的数据传递**：例如，传递用户身份信息、事务上下文等。
-   **日志跟踪**：在分布式系统中，通过 `InheritableThreadLocal` 传递请求 ID 或 Trace ID。

**注意事项**

1.  **性能开销**：`InheritableThreadLocal` 的实现比普通 `ThreadLocal` 更复杂，可能会带来一定的性能开销。
2.  **内存泄漏风险**：如果线程池复用线程，可能导致旧的 `InheritableThreadLocal` 数据未被清理，从而引发内存泄漏。因此，在使用线程池时需特别小心。
3.  **线程安全**：虽然 `InheritableThreadLocal` 提供了父子线程间的值传递，但仍然需要确保数据的安全性和一致性。

