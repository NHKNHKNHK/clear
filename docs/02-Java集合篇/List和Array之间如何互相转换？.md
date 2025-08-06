# List和Array之间如何互相转换？

-   List -> Array 可以通过集合的toArray方法完成
-   Array -> List 可以通过Arrays.asList方法或Collections.addAll方法完成
    -   注意：Arrays.asList方法得到的ArrayList是一个内部类，并非`java.util`包下的ArrayList

```java
String arr = {"hello", "world"};
List<String> list = Arrays.asList(arr); // 此时得到的集合不能增删等操作，是一个只读集合
List<String> lists = new ArrayList<>(list); 


String arr = {"hello", "world"};
ArrayList<String> lists = new ArrayList<>();
Collections.addAll(lists, arr);
```
