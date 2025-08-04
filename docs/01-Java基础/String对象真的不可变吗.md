# String对象真的不可变吗？

除非利用**反射**操作获取字符串对象内部的**字符数组的引用**，然后修改数组元素，否则字符串对象不可变。

```java
String s1 = "helloworld";
Class<? extends String> clazz = s1.getClass();
Field valueField = clazz.getDeclaredField("value"); // 获取字符数组
valueField.setAccessible(true);
char[] value = (char[]) valueField.get(s1);
value[0] = 'H';
System.out.println(s1);
```
