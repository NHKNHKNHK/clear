# 编程实现删除List集合中的元素，有几种方式？

## **使用迭代器（Iterator）删除**

```java
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C", "D"));
Iterator<String> iterator = list.iterator();
while (iterator.hasNext()) {
    String item = iterator.next();
    if (someCondition(item)) { // 根据条件删除元素
        iterator.remove();	// 调用的是迭代器的remove，如果使用集合的remove方法会抛出ConcurrentModificationException
    }
}
```

## **使用foreach**

注意：不建议直接在增强型for循环中使用`remove`方法，因为这会导致 `ConcurrentModificationException` 异常。

但可以先收集要删除的元素，再批量删除。

```java
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C", "D"));
List<String> toRemove = new ArrayList<>();
for (String item : list) {
    if (someCondition(item)) { // 根据条件添加到待删除列表
        toRemove.add(item);
    }
}
list.removeAll(toRemove);
```

## **使用普通 for 循环从后往前删除**

```java
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C", "D"));
for (int i = list.size() - 1; i >= 0; i--) {
    if (someCondition(list.get(i))) { // 根据条件删除元素
        list.remove(i);
    }
}
```

## **使用 Java 8 Stream API 过滤**

```java
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C", "D"));
list = list.stream()
           .filter(item -> !someCondition(item)) // 根据条件过滤
           .collect(Collectors.toList());
```

## **使用 removeIf 方法（Java 8+）**

```java
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C", "D"));
list.removeIf(item -> someCondition(item)); // 根据条件删除
```

## **总结**

- 删除Collection集合中元素的正确操作：
    - 如果目标明确，用集合中的remove(Object)或removeAll(Collection)
    - 如果目标不明确
        - Java8之后，推荐使用集合对象.removeIf(条件)
        - Java8之前，只能在Iterator迭代器遍历集合过程中进行条件判断，调用迭代器的remove()方法
- **切记不要**进行如下操作
    - 在Iterator迭代器遍历过程中，调用集合的remove方法
    - 在foreach循环中，调用集合的remove方法
    - 类似的像add、replaceAll等方法都不可以

