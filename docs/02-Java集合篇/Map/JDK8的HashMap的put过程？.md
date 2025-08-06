# JDK8的HashMap的put过程？

## 1、  **put方法的实现**

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}
```

put方法调用了putVal方法。这里的hash(key)是计算键的哈希值。

## 2、**计算哈希值**

hash方法用于计算键的哈希值并进行扰动处理，以减少冲突。

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

## 3、**putVal方法的实现**

putVal方法是HashMap中实际执行插入操作的核心方法。

```java
/**
     * 实现Map.put及相关方法的核心逻辑
     *
     * @param hash 键的哈希值
     * @param key 键
     * @param value 值
     * @param onlyIfAbsent 如果为true，表示只有当键不存在时才插入值
     * @param evict 如果为false，表示当前表处于创建模式
     * @return 键原有的值，或者如果不存在则返回null
     */
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    // 确保哈希表已初始化
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    // 计算键的索引位置
    if ((p = tab[i = (n - 1) & hash]) == null)
        // 如果该位置为空，直接插入新节点
        tab[i] = newNode(hash, key, value, null);
    else {
        Node<K,V> e; K k;
        // 检查当前位置的节点是否与当前键相等或哈希值相同
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            e = p;
        else if (p instanceof TreeNode)
            // 如果节点是一个红黑树节点，则调用红黑树的put方法
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        else {
            // 遍历链表，查找相等的键或插入新节点
            for (int binCount = 0; ; ++binCount) {
                if ((e = p.next) == null) {
                    // 未找到相等的键，插入新节点到链表末尾
                    p.next = newNode(hash, key, value, null);
                    // 如果链表太长，转换为红黑树
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        treeifyBin(tab, hash);
                    break;
                }
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    // 找到相等的键，更新节点e
                    break;
                p = e;
            }
        }
        // 如果找到现有映射
        if (e != null) {
            V oldValue = e.value;
            // 根据onlyIfAbsent参数决定是否更新值
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            // 访问节点e后执行的操作
            afterNodeAccess(e);
            return oldValue;
        }
    }
    // 更新修改计数器和大小，如果需要则进行扩容
    ++modCount;
    if (++size > threshold)
        resize();
    // 插入节点后执行的操作
    afterNodeInsertion(evict);
    return null;
}
```

## 详细步骤解析

1、**初始化表**：如果哈希表还没有初始化或长度为0，则进行初始化（扩容）

```java
if ((tab = table) == null || (n = tab.length) == 0)
    n = (tab = resize()).length;
```

2、**计算索引**：通过哈希值和数组长度计算出索引位置

```java
if ((p = tab[i = (n - 1) & hash]) == null)
    tab[i] = newNode(hash, key, value, null);
```

3、**插入新节点**：如果索引位置为空，直接插入新节点。

4、**处理哈希冲突**：如果索引位置不为空，需要处理冲突。

- **检查是否存在相同的键**：如果找到相同的键，替换其值。

- **红黑树处理**：如果当前节点是红黑树节点，则调用putTreeVal方法插入。

- **链表处理**：如果当前节点是链表节点，遍历链表插入新节点。

5、**转换为红黑树**：如果链表长度超过阈值（8），则将链表转换为红黑树。

```java
if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
    treeifyBin(tab, hash);
```

6、**更新节点值**：如果存在相同的键，更新其值。

```java
if (e != null) { // existing mapping for key
    VoldValue= e.value;
    if (!onlyIfAbsent || oldValue == null)
        e.value = value;
    afterNodeAccess(e);
    return oldValue;
}
```

7、**调整大小**：插入新节点后，增加元素数量。如果超过阈值，则进行扩容。

```java
++modCount;if (++size > threshold)
    resize();
```

8、**插入后的处理**：进行一些插入后的处理操作

```java
afterNodeInsertion(evict);
```

