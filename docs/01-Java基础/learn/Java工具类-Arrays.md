#  Arrays 工具类的使用  

java.util.Arrays 类即为操作数组的工具类，包含了用来操作数组（比如排序和搜索）的各种方法。 比如： 

## **toString数组元素拼接** 

```java
public static String toString(int[] a)  // 字符串表示形式由数组的元素列表组成，括在方括号（"[]"）中。相邻元素用字符 ", "（逗号加空格）分隔。形式为： [元素 1，元素 2，元素 3。。。] 
    
public static String toString(Object[] a)  // 字符串表示形式由数组的元素列表组成，括在方括号（"[]"）中。相邻元素用字符 ", "（逗号加空格）分隔。元素将自动调用自己从 Object 继承的 toString 方法将对象转为字符串进行拼接，如果没有重写，则返回类型@hash 值，如果重写则按重写返回的字符串进行拼接。 
```

例如：

```java
@Test
public void test() {
    int[] arr1 = {3, 6, 5, 4, 8, 32};
    int[] arr2 = {};
    int[] arr3 = null;
    System.out.println(Arrays.toString(arr1));  // [3, 6, 5, 4, 8, 32]
    System.out.println(Arrays.toString(arr2));  // []
    System.out.println(Arrays.toString(arr3));  // null
}

// 自定义toString类打印数组内容
public static String myToString(int[] arr) {
    if (arr == null)
        return "null";
    int len = arr.length;
    if (len == 0)
        return "[]";
    StringBuilder sb = new StringBuilder("[");
    for (int i = 0; i < len; i++) {
        // 如果遍历到数组的最后一个，则不加 ,
        sb.append(i == len - 1 ? arr[i] : arr[i] + ", ");
    }
    return sb.append("]").toString();
}

// 测试自定义myToString方法
@Test
public void test1() {
    int[] arr1 = {3, 6, 5, 4, 8, 32};
    int[] arr2 = {};
    int[] arr3 = null;
    System.out.println(myToString(arr1));  // [3, 6, 5, 4, 8, 32]
    System.out.println(myToString(arr2));  // []
    System.out.println(myToString(arr3));  // null
}
```

## sort数组排序 

```java
public static void sort(int[] a)  // 将 a 数组按照从小到大进行排序 
public static void sort(int[] a, int fromIndex, int toIndex)  // 将 a 数组的[fromIndex,  toIndex)部分按照升序排列  

public static void sort(Object[] a)  // 根据元素的自然顺序对指定对象数组按升序进行排序。
    
public static <T> void sort(T[] a, Comparator<? super T> c  // 根据指定比较器产生的顺序对指定对象数组进行排序。 
// 强调：想要使用指定比较器排序的数组的类型必须为 引用类型                             
```

例如：

```java
@Test
public void test2() {
    int[] arr1 = {3, 6, 5, 4, 8, 32};
    int[] arr2 = {};
    int[] arr3 = null;
    Arrays.sort(arr1);
    Arrays.sort(arr2);
    // Arrays.sort(arr3);  // NullPointerException
    System.out.println("排序后：" + Arrays.toString(arr1));  // 排序后：[3, 4, 5, 6, 8, 32]
    System.out.println("排序后：" + Arrays.toString(arr2));  // 排序后：[]
    int[] arr4 = {1, 2, 3, 5, 4, 7, 6, 8};
    Arrays.sort(arr4, 4, 8);  // 前闭后开
    System.out.println("arr1数组部分排序后：" + Arrays.toString(arr4));  // arr1数组部分排序后：[1, 2, 3, 5, 4, 6, 7, 8]
    Integer[] arr5 = {1, 2, 3, 4, 5};
    // 将数组按照指定排序规则排序：我们以倒序排序为例
    Arrays.sort(arr5, (o1, o2) -> -Integer.compare(o1, o2));
    System.out.println("arr5倒序排序：" + Arrays.toString(arr5));  // arr5倒序排序：[5, 4, 3, 2, 1]
}
```



## binarySearch数组元素的二分查找

```java
public static int binarySearch(int[] a, int key)  // 要求数组有序，在数组中查找 key 是否存在，如果存在返回第一次找到的下标，不存在返回负数。
    
public static int binarySearch(Object[] a, Object key)    
```

例如：

```java
@Test
public void test3() {
    int[] arr1 = {1, 2, 3, 4, 5};
    System.out.println("arr1中元素 3 的索引为：" + Arrays.binarySearch(arr1,3));  // arr1中元素 3 的索引为：2
    System.out.println("arr1中元素 8 的索引为：" + Arrays.binarySearch(arr1,8));  // arr1中元素 8 的索引为：-6
    int[] arr2 = {3, 6, 5, 4, 8, 32};
    System.out.println(Arrays.binarySearch(arr2,6));  // -5 这个结果显然是错误的
    // todo 使用二分查找的前提是数组有序
    Arrays.sort(arr2);  // 排序后的数组 [3, 4, 5, 6, 8, 32]
    System.out.println(Arrays.binarySearch(arr2,6));  // 3
}
```



## copyOf数组的复制 

```java
public static int[] copyOf(int[] original, int newLength)  // 根据 original 原数组复制一个长度为 newLength 的新数组，并返回新数组 
public static <T> T[] copyOf(T[] original, int newLength)  // 根据 original 原数组复制一个长度为 newLength 的新数组，并返回新数组 
    
public static int[] copyOfRange(int[] original, int from, int to)  // 复制 original 原数组的[from,to)构成新数组，并返回新数组
public static <T> T[] copyOfRange(T[] original, int from, int to)  // 复制 original 原数组的[from,to)构成新数组，并返回新数组      
```

注意：

​	copy 与 copyOfRange 底层就是调用System类中的arraycopy方法，如下

```java
public static native void arraycopy(Object src,  int  srcPos,
                                        Object dest, int destPos,
                                        int length)
```

例如：

```java
@Test
public void test4() {
    int[] arr1 = {0, 1, 2, 3, 4, 5};
    int[] arr2 = Arrays.copyOf(arr1, 3);
    System.out.println("arr2: " + Arrays.toString(arr2));  // arr2: [0, 1, 2]
    int[] arr3 = Arrays.copyOf(arr1, 8);  // 如果原始数组的长度小于指定的长度，将使用默认值填充新数组的剩余部分
    System.out.println("arr3: " + Arrays.toString(arr3));  // arr3: [0, 1, 2, 3, 4, 5, 0, 0]


    int[] arr4 = Arrays.copyOfRange(arr1, 2, 4);
    System.out.println("arr4: " + Arrays.toString(arr4));  // arr4: [2, 3]
    int[] arr5 = Arrays.copyOfRange(arr1, 2, 6); 
    System.out.println("arr5: " + Arrays.toString(arr5));  // arr5: [2, 3, 4, 5]
}
```



## equals比较两个数组是否相等 

```java
// 比较两个数组的长度、元素是否完全相同
// 数组中元素类型可以为 Object、int、long、short、char、byte、boolean、float、double
public static boolean equals(int[] a, int[] a2)  
public static boolean equals(Object[] a, Object[] a2)
```

例如

```java
@Test
public void test5() {
    int[] arr1 = {0, 1, 2, 3, 4, 5};
    int[] arr2 = {0, 1, 2, 3, 4, 5};
    int[] arr3 = {0, 1, 2, 3};
    int[] arr4 = {};
    int[] arr5 = {};
    int[] arr6 = null;
    int[] arr7 = null;
    System.out.println(Arrays.equals(arr1, arr2));  // true
    System.out.println(Arrays.equals(arr1, arr3));  // false
    System.out.println(Arrays.equals(arr4, arr5));  // true
    System.out.println(Arrays.equals(arr4, arr6));  // false
    System.out.println(Arrays.equals(arr6, arr7));  // true
    Integer[] arr8 = {1, 2, null};
    Integer[] arr9 = {1, 2, null};
    System.out.println(Arrays.equals(arr8, arr9));  // true
}
```

## hashCode

```java
// 对于数组类型的域，可以使用静态方法 Arrays.hashCode 方法计算哈希值，这个散列值由数组元素的散列码组成
// 数组中元素类型可以为 Object、int、long、short、char、byte、boolean、float、double
public static int hashCode(int a[])
public static int hashCode(int a[])
```





## fill填充数组： 

```java
public static void fill(int[] a, int val)  // 用 val 值填充整个 a 数组
public static void fill(Object[] a,Object val)
    
public static void fill(int[] a, int fromIndex, int toIndex, int val)  // 将 a 数组 [fromIndex,toIndex)部分填充为 val 值 
public static void fill(Object[] a, int fromIndex, int toIndex, Object val)  // 将 a 数组 [fromIndex,toIndex)部分填充为 val 对象 
```

例如：

```java
@Test
public void test6() {
    int[] arr1 = new int[8];
    int[] arr2 = {0, 1, 2, 3, 4, 5};
    System.out.println("arr1数组的默认填充值: " + Arrays.toString(arr1));  // arr1数组的默认填充值: [0, 0, 0, 0, 0, 0, 0, 0]
    Arrays.fill(arr1,6);
    System.out.println("arr1数组的填充以后: " + Arrays.toString(arr1));  // arr1数组的填充以后: [6, 6, 6, 6, 6, 6, 6, 6]
    Arrays.fill(arr2,1,3,5);  // 使用 5 填充 arr2的[1,3)
    System.out.println("arr2数组的填充以后: " + Arrays.toString(arr2));  // arr2数组的填充以后: [0, 5, 5, 3, 4, 5]
}
```

## 将数组转换为 List

```java
public static <T> List<T> asList(T... a)  // 用于将数组转换为 List。
// 准确的来说，该方法也可以将字符串变为List，例如：
    List<String> topics = Arrays.asList("kafka_spark");

记住：可变参数的底层就是数组
```

例如：

```java
@Test
public void test7() {
    String[] array = {"apple", "banana", "orange"};
    List<String> list = Arrays.asList(array);
    System.out.println(list); // [apple, banana, orange]

    // 修改 List
    list.set(0, "grape");
    System.out.println(list); // [grape, banana, orange]
    // 原始数组也被修改
    System.out.println(Arrays.toString(array)); // [grape, banana, orange]
    // 添加元素
    // list.add("grape");  // UnsupportedOperationException  List不支持添加删除

    // 由于返回的 List 是一个固定大小的 List，因此不能进行添加或删除元素的操作。
    // 如果需要对 List 进行修改操作，可以使用 ArrayList 类来创建一个可变大小的 List
    List<String> list2 = new ArrayList<>(Arrays.asList(array));

    list2.add("grape");
    System.out.println(list2); // [apple, banana, orange, grape]
}
```

避坑指南：

```java
@Test
public void test7_1(){
    Integer[] arr = new Integer[]{1,2,3};
    List list = Arrays.asList(arr);
    System.out.println(list.size());  // 3
    System.out.println(list);  // [1, 2, 3]

    int[] arr2 = new int[]{1,2,3};
    List list2 = Arrays.asList(arr2);
    System.out.println(list2.size());  // 1
    System.out.println(list2);  // [[I@22927a81]
}
```



## 将数组转换为 Stream

```java
public static IntStream stream(int[] array)  // 将数组转换为流（Stream）
public static <T> Stream<T> stream(T[] array)   
```

例如：

```java
@Test
public void test8() {
    int[] array = {1, 2, 3, 4, 5};
    // 将数组转换为流
    IntStream stream = Arrays.stream(array);
    // 对流进行操作
    stream.filter(n -> n % 2 == 0) // 过滤偶数
        .map(n -> n * n) // 平方
        .forEach(System.out::println); // 4 16
}
```

