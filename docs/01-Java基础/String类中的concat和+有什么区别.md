# String类中的concat和+有什么区别？

如果是两个""字符串（字面量字符串）拼接，concat会产生新对象，而+操作符会在编译时直接合并为一个字符串

```java
String s1 = "helloworld";
String s2 = "hello" + "world";			// 存在编译器优化
System.out.println(s1 == s2); // true

String s1 = "helloworld";
String s2 = "hello".concat("world");
System.out.println(s1 == s2); // false
```

**实现方式不同**

-   concat方法
    -   是String类中的实例方法，用于将一个字符串追加到当前字符串的末尾。
    -   返回一个新的 `String` 对象，包含连接后的结果
    -   不会修改原始字符串（因为 `String` 是不可变的）
-   **+ 操作符**
    -   在编译时会被转换为 `StringBuilder` 或 `StringBuffer` 的 `append()` 方法调用。
    -   同样返回一个新的 `String` 对象，包含连接后的结果。
    -   适用于多个字符串连接操作，特别是在循环中更高效（通过 `StringBuilder` 优化）。

**性能**

-   concat方法
    -   每次调用都会创建一个新的`String`对象，适合少量字符串连接。
    -   如果频繁调用，可能会导致大量的临时对象创建，影响性能。

-   **+ 操作符**
    -   在编译时会优化为 `StringBuilder` 或 `StringBuffer` 的 `append()` 方法调用。
    -   对于多个字符串连接或在循环中连接字符串时，性能更好，因为它避免了频繁创建新的 `String` 对象

**灵活性**

-   concat方法：只能连接两个字符串，不能直接连接其他类型的数据（如数字、布尔值等），需要先将它们转换为字符串。

```java
String result = "Value is: ".concat(Integer.toString(42)); // 需要显式转换
```

-   **+ 操作符**：更灵活，可以直接连接不同类型的对象。Java 会**自动调用**这些对象的 `toString()` 方法进行转换

```java
String result = "Value is: " + 42; // 自动转换为字符串
```

**空字符串处理**

-   concat方法：如果传入`null`，会抛出`NullPointerException`

```java
String result = "Hello".concat(null);
```

-   **+ 操作符**：如果传入 `null`，会将其视为字符串 `"null"`

```java
String result = "Hello" + null; // "Hellonull"
```

**总结**

-   **concat() 方法**：适合简单的字符串连接操作，特别是当你只需要连接两个字符串且不需要处理 `null` 值时。
-   **+ 操作符**：更灵活，适合多种数据类型的连接，并且在编译时会被优化为更高效的代码，特别是在循环中连接多个字符串时表现更好。

