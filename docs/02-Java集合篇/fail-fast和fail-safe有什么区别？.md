# fail-fast和fail-safe有什么区别？

fail-fast 和 fail-safe 是两种不同的处理集合（如列表、集合等）在**多线程**或**迭代**过程中发生修改时的策略。它们的区别如下：

**fail-fast**（快速失败）

- 定义：当检测到集合在**迭代过程中被修改**（除了通过迭代器自身的 remove() 或 add() 方法），立即**抛出** `ConcurrentModificationException` 异常。
- 检测机制：fail-fast集合在迭代器中维护一个**expectedModCount**变量，记录集合的修改次数。
- 检查：每次调用迭代器的next()或remove()方法时，都会检查 expectedModCount 是否与集合的 modCount 相等。不相等则抛出异常。
- 特点：
  - 尽早发现问题，避免潜在的不一致状态。
  - 适用于单线程环境或严格控制的多线程环境。
- 示例：ArrayList、LinkedList、HashSet、HashMap 等集合类的迭代器是 fail-fast 的。

**fail-safe**（副本机制）

- 定义：通过创建集合的副本进行迭代，因此即使原集合在**迭代过程中被修改**，也不会影响迭代过程，**也不会抛出异常。**
- 副本机制：fail-safe集合在迭代时，遍历的是**副本**
- 独立性：遍历操作和修改操作是独立的，遍历操作不会受到修改操作的影响。
- 特点：
  - 不会抛出 ConcurrentModificationException。
  - 可能导致读取到旧数据或新数据，具体取决于实现方式。
  - 适用于多线程环境，但可能会有性能开销，因为需要复制集合。
- 示例：CopyOnWriteArrayList、ConcurrentHashMap 的键/值集合视图是 fail-safe 的。

总结来说，fail-fast 旨在尽早发现问题并抛出异常，而 fail-safe 则通过复制数据来避免异常，确保迭代的安全性
