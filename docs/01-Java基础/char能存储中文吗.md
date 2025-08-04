# char能存储中文吗？

在 Java 中，`char` 类型用于表示单个字符。它使用的是 Unicode 编码，理论上可以存储任何 Unicode 字符，包括中文字符。然而，`char` 类型的大小是固定的 16 位（2 字节），这意味着它可以表示的最大 Unicode 码点是 `0xFFFF`，即基本多文种平面（BMP）中的字符。

示例：

```java
char ch = '龗';
System.out.println(ch); // 输出：龗
```

**关键点**

1.  **Unicode 编码**：
    -   Java 的 `char` 类型基于 Unicode 编码，支持 BMP 中的所有字符。
    -   BMP 包含了大部分常用的字符，包括常见的中日韩（CJK）字符。
2.  **BMP 和 补充平面**：
    -   BMP（Basic Multilingual Plane）：包含码点从 `U+0000` 到 `U+FFFF` 的字符。
    -   补充平面（Supplementary Planes）：包含码点从 `U+10000` 到 `U+10FFFF` 的字符，例如一些不常用的汉字、表情符号等。
3.  **char 和 补充字符**：
    -   `char` 类型只能表示 BMP 中的字符。
    -   对于补充字符（如某些罕见的汉字或表情符号），Java 使用两个 `char` 来表示一个字符，称为代理对（surrogate pair）

**处理补充字符**

对于不在 BMP 中的字符（如某些罕见的汉字或表情符号），需要使用 `String` 或 `Character.toCodePoint` 方法来处理：

```java
public class Main {
    public static void main(String[] args) {
        String emoji = "\ud83d\ude00"; // 表情符号 😊
        System.out.println("字符串: " + emoji);
        int codePoint = emoji.codePointAt(0);
        System.out.println("字符的 Unicode 码点: " + codePoint); // 输出 Unicode 码点
    }
}


字符串: 😊
字符的 Unicode 码点: 128512
```

在这个例子中，表情符号 `😊` 不在 BMP 中，因此使用了两个 `char` 来表示它。通过 `codePointAt` 方法可以获取完整的 Unicode 码点

**总结**

-   **char 可以存储中文字符**，因为这些字符大多位于 BMP 中。
-   **对于补充字符**（如某些罕见的汉字或表情符号），`char` 无法直接表示，需要使用 `String` 或其他方法来处理。
-   **最佳实践**：如果你需要处理所有 Unicode 字符（包括补充字符），建议使用 `String` 类型，因为它可以正确处理代理对和补充字符