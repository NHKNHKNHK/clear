# ArrayList第二次扩容时容量大小？:star:

ArrayList扩容规则：

```java
newCapacity = oldCapacity + (oldCapacity >> 1)
```

先说结论：

​	**在JDK8中，ArrayList第二次扩容时容量为22**

代码如下：

```java
public class ArrayListDemo {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();

        for (int i = 1; i < 17; i++) {
            list.add(i);
        }

        list.forEach(e -> System.out.print(e + " "));
    }
}
```

ArrayList第一次添加元素时，首次进入add方法，可以发现，此时为动态数组容量为0

![1724058604176](assets/ArrayList第一次添加元素之前.png)

ArrayList第一次添加元素时，进入了ensureCapacityInternal方法，会将动态数组容量初始化为10

![1724058423849](assets/ArrayList第一次添加元素时.png)

ArrayList第一次扩容时

![1724058089057](assets/ArrayList第一次扩容.png)

ArrayList第二次扩容时

![1724058227556](assets/ArrayList第二次扩容.png)
