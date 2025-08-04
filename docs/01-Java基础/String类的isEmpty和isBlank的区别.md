# String类的isEmpty和isBlank的区别？

`String` 类提供了两个方法来检查字符串是否为空或空白：`isEmpty()` 和 `isBlank()`。这两个方法的主要区别在于它们对“空白”的定义不同。

-   `isEmpty()`：检查字符串的长度是否为 0。如果**字符串长度为 0**（即没有任何字符），则返回 `true`；否则返回 `false`。

```java
String str1 = "";
String str2 = "   ";
String str3 = "Hello";

System.out.println(str1.isEmpty()); // true
System.out.println(str2.isEmpty()); // false
System.out.println(str3.isEmpty()); // false
```

-   `isBlank()`：检查字符串是否为空白字符串。空白字符串是指只包含空白字符（如空格、制表符、换行符等）或长度为 0 的字符串。如果**字符串为空或仅包含空白字符**，则返回 `true`；否则返回 `false`。

注意！！！`isBlank()` 方法是在 Java 11 中引入的

```java
String str1 = "";
String str2 = "   ";
String str3 = "Hello";
String str4 = "\t\n"; // 包含制表符和换行符

System.out.println(str1.isBlank()); // true
System.out.println(str2.isBlank()); // true
System.out.println(str3.isBlank()); // false
System.out.println(str4.isBlank()); // true
```
