# Java中能不能使用中文当作标识符？

可以，因为Java支持Unicode字符集，而Unicode包括了中文。但是，为了代码的可读性和维护性，通常建议使用英文作为标识符。

```java
public class 测试 {
    public static void main(String[] arags) {
        String 姓名 = "张三";
        System.out.println("姓名：" + 姓名);
    }
}
```