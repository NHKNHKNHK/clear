# String如何实现编码和解码？

编码（将字符串转换为字节数组）

1.  **选择字符集**：确定要使用的字符集，例如 UTF-8、ISO-8859-1 等。
2.  **使用 getBytes() 方法**：通过指定字符集将字符串转换为字节数组

```java
import java.nio.charset.StandardCharsets;

public class StringEncodingExample {
    public static void main(String[] args) {
        String originalString = "Hello, World!";
        byte[] encodedBytes = originalString.getBytes(StandardCharsets.UTF_8);
        System.out.println("Encoded bytes: " + new String(encodedBytes));
    }
}
```

解码（将字节数组转换为字符串）

1.  **选择字符集**：确保使用与编码时相同的字符集。
2.  **使用 String(byte[] bytes, Charset charset) 构造函数**：将字节数组转换回字符串。

```java
import java.nio.charset.StandardCharsets;

public class StringDecodingExample {
    public static void main(String[] args) {
        byte[] encodedBytes = "Hello, World!".getBytes(StandardCharsets.UTF_8);
        String decodedString = new String(encodedBytes, StandardCharsets.UTF_8);
        System.out.println("Decoded string: " + decodedString);
    }
}
```

注意：

-   **字符集一致性**：编码和解码时必须使用相同的字符集，否则可能会导致乱码问题。


