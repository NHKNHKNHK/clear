# String字符串如何进行反转？

方式一：使用 `StringBuilder` 和 `StringBuffer` 提供的**reverse**方法

```java
String original = "Hello, World!";

// 使用 StringBuilder 反转
String reversed = new StringBuilder(original).reverse().toString();

// 使用 StringBuffer 反转
String reversed2 = new StringBuffer(original).reverse().toString();
```

方式二：将字符串转换为**字符数组**，然后通过交换字符位置来实现反转。

```java
String original = "Hello, World!";
char[] charArray = original.toCharArray();

// 数组反转
for(int left=0, right=charArray.length-1; left<right; left++, right--) {
    char temp = charArray[left];
    original[left] = original[right];
    original[right] = temp;
}
String reversed = new String(charArray);
```

方式三：通过递归的方式逐个字符反转字符串

```java
public class StringReverseRecursive {
    public static String reverse(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return reverse(str.substring(1)) + str.charAt(0);
    }

    public static void main(String[] args) {
        String original = "Hello, World!";
        String reversed = reverse(original);
        System.out.println("Reversed string: " + reversed);
    }
}
```

 方式四：使用流（Java 8+）

```java
import java.util.stream.Collectors;

public class StringReverseStream {
    public static void main(String[] args) {
        String original = "Hello, World!";
        String reversed = new StringBuilder(original)
                .chars()
                .mapToObj(c -> String.valueOf((char) c))
                .collect(Collectors.joining())
                .chars()
                .mapToObj(c -> String.valueOf((char) c))
                .collect(Collectors.joining());
        System.out.println("Reversed string: " + reversed);
    }
}
```