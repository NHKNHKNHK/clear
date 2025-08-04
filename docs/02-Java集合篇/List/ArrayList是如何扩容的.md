# ArrayList是如何扩容的？

1.  **初始容量和扩容因子**:

    当创建一个新的ArrayList对象时，它通常会分配一个初始容量，这个初始容量默认为10。

    -   当使用无参数构造函数创建 `ArrayList` 时，其内部使用的数组 `elementData` 会被初始为空数组 `DEFAULTCAPACITY_EMPTY_ELEMENTDATA`。
    -   第一次添加元素时，`ArrayList` 会将其容量扩展至默认容量 `DEFAULT_CAPACITY`，这个值通常是10

    ```java
    /**
     * Default initial capacity.
     */
    private static final int DEFAULT_CAPACITY = 10;
    ```

2.  **扩容规则**:

    -   当 `ArrayList` 的实际元素数量超过其当前容量时，`ArrayList` 会自动进行扩容。

    -   扩容时，新的容量通常是当前容量的1.5倍。

        ```java
        newCapacity = oldCapacity + (oldCapacity >> 1)
        ```

    -   例如，如果当前容量为10，那么扩容后的容量将是15；如果当前容量为15，则扩容后的容量将是22

3.  **扩容过程**:

    -   扩容时，`ArrayList` 会创建一个新的数组，并将原有数组中的元素复制到新数组中。
    -   新数组的大小是原数组大小的1.5倍，向上取整得到一个整数。
    -   原有数组会被释放，从而减少内存占用。

4.  **扩容示例**:

    -   假设 `ArrayList` 的当前容量为10，且已经满了。
    -   当尝试添加第11个元素时，`ArrayList` 会创建一个新的数组，大小为15（10 * 1.5 = 15）。
    -   然后将旧数组中的所有元素复制到新数组中，并将新元素添加到新数组的末尾。
    -   最后，旧数组被垃圾回收机制回收。

5.  **扩容阈值**:

    -   `ArrayList` 在每次添加元素前都会检查是否需要扩容。这个检查是通过比较元素的数量（`size`）与当前容量（`elementData.length`）来完成的。
    -   如果 `size` 大于等于 `elementData.length`，则触发扩容操作。

6.  **扩容方法、源码**:

    -   扩容的具体逻辑通常封装在 `ensureCapacityInternal` 或者 `grow` 方法中。

    ```java
    private void grow(int minCapacity) {
        // overflow-conscious code
        int oldCapacity = elementData.length;
        int newCapacity = oldCapacity + (oldCapacity >> 1);	// 位运算指定新数组的容量
        if (newCapacity - minCapacity < 0)
            newCapacity = minCapacity;
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            newCapacity = hugeCapacity(minCapacity);
        // minCapacity is usually close to size, so this is a win:
        elementData = Arrays.copyOf(elementData, newCapacity);
    }
    ```

7.  **注意事项**:

    -   `ArrayList` 没有缩容机制。即使删除了大量元素，`ArrayList` 的容量也不会减小，除非显式调用 `trimToSize` 方法。
    -   `trimToSize` 方法会将 `ArrayList` 的容量调整为其实际大小，从而避免不必要的内存浪费。