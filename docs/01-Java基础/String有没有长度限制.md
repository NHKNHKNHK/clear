# String有没有长度限制？

有限制。因为字符串内部是字符数组（JDK9 字节），而数组长度是int类型，有大小约束。

Java中数组的最大长度是`Integer.MAX_VALUE - 8`