#  JDK1.8中HashMap的实现？

在 JDK 8中，HashMap的实现进行了显著的优化，特别是在处理哈希冲突方面，引入了红黑树数据结构。这些改进旨在提高在高冲突情况下的性能。

## 1、**数据结构**

HashMap的底层结构仍然是基于**数组和链表**的组合，但在Java 8中，当链表长度超过一定阈值（默认为8）时，会将链表转换为**红黑树**，以提高操作效率。

## 2、**存储过程**

-   **计算哈希值**：首先，通过键的hashCode方法计算**哈希值**，然后对该哈希值进行**扰动**，以减少冲突。扰动的目的是为了使哈希值更加均匀地分布在数组中。

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
// 说明：这个扰动函数相比于jdk7进行了简化，因为jdk8引入了更好的哈希算法，以及对于哈希冲突的处理方式有所改进
```

-   **确定数组索引**：通过哈希值与数组长度的减一值进行按位与运算，计算出数组的索引位置。

```java
static int indexFor(int h, int length) {
    return h & (length - 1);  
}
// 说明：length-1是为了取代 （h % length） 的取模操作，优化效率
```

-   **插入节点**：

    -   如果数组索引位置为空，直接插入新的节点。
    -   如果不为空，则需要处理哈希冲突。

## 3、**处理哈希冲突**

在Java 8中，处理哈希冲突的方法有了显著改进：

1.  **链表**：如果冲突的节点数较少（链表长度小于等于8），则使用链表存储。链表的**插入操作在链表尾部**进行，以保持插入顺序。
2.  **红黑树**：如果链表长度超过8，HashMap会将链表转换为红黑树。红黑树是一种自平衡的二叉搜索树，其查找、插入和删除操作的时间复杂度为O(log n)，相比链表的O(n)更高效。

```java
if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
    treeifyBin(tab, hash);
```

## 4、**取值过程**

在取值时，HashMap会先计算哈希值，然后找到对应的数组位置。如果该位置存储的是链表，则遍历链表查找；如果是红黑树，则在树中查找。

## 5、**扩容**

当HashMap中的元素数量超过一定阈值（通常是数组长度的0.75倍）时，会进行扩容。扩容时，HashMap会创建一个新的、更大的数组，并将旧数组中的所有元素重新哈希并放入新数组中。

```java
void resize(int newCapacity) {
    Node<K,V>[] oldTable = table;
    int oldCapacity = oldTable.length;
    Node<K,V>[] newTable = (Node<K,V>[])new Node[newCapacity];
    // Rehashing elements to new table
    for (int j = 0; j < oldCapacity; ++j) {
        Node<K,V> e;
        if ((e = oldTable[j]) != null) {
            oldTable[j] = null;
            if (e.next == null)
                newTable[e.hash & (newCapacity - 1)] = e;
            else if (e instanceof TreeNode)
                ((TreeNode<K,V>)e).split(this, newTable, j, oldCapacity);
            else { // preserve order
                Node<K,V> loHead = null, loTail = null;
                Node<K,V> hiHead = null, hiTail = null;
                Node<K,V> next;
                do {
                    next = e.next;
                    if ((e.hash & oldCapacity) == 0) {
                        if (loTail == null)
                            loHead = e;
                        else
                            loTail.next = e;
                        loTail = e;
                    }
                    else {
                        if (hiTail == null)
                            hiHead = e;
                        else
                            hiTail.next = e;
                        hiTail = e;
                    }
                } while ((e = next) != null);
                if (loTail != null) {
                    loTail.next = null;
                    newTable[j] = loHead;
                }
                if (hiTail != null) {
                    hiTail.next = null;
                    newTable[j + oldCapacity] = hiHead;
                }
            }
        }
    }
    table = newTable;
}
```

## **小结**

​	JDK8中的HashMap通过引入红黑树来优化哈希冲突的处理。当链表长度超过一定阈值（默认为8）时转换为红黑树，从而在极端情况下提高查找和插入的效率。

​	JDK8在中链表中插入元素由头插法变为了**尾插法**

