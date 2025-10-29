# 常见的Error

最常见的就是 `VirtualMachineError`，它有两个经典的子类：`StackOverflowError`、`OutOfMemoryError`

```java
public class ErrorTest {

    @Test
    public void testStackOverError() {
        recursion();  // StackOverflowError（栈内存溢出）
    }

    // 没有出口的递归
    public void recursion() {
        recursion();
    }

    
    @Test
    public void testOutOfMemoryError01() {
        // OutOfMemoryError
        // 方式一  
        int[] arr = new int[Integer.MAX_VALUE];
    }

    @Test
    public void testOutOfMemoryError02() {
        // 方式一
        StringBuilder s = new StringBuilder();
        while (true) {
            s.append("hello");
        }
    }
}
```
