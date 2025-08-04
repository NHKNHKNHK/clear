# Java中的常量与变量

- 有什么区别？
  - 常量，final修饰的变量，一旦赋值后，就不能被修改
  - 变量，可以重新赋值
- Java中的常量有几种？
  - 局部变量 + final，一般直接初始化
  - 实例变量 + final，一般通过构造器初始化
  - 静态变量 + final，建议大写，一般直接初始化

```java
class Test {
    static final int MAX_COUNT = 10; // 静态常量
    private final int a = 1; // 实例变量
    private final int b;
    private final int c;

    public Test(int b, int c) {
        this.b = b;
        this.c = c;
    }

    public static void main(String[] args) {
        final int d = 10; // 局部变量

    }

}
```