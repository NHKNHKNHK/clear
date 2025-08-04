# 常见的运行时异常（非受检异常）UnChecked Exceptions？

非受检异常是指那些在**运行时**才发生的异常，编译器不会强制要求程序员处理这些异常。它们**通常是由于程序中的逻辑错误引起的**。

特点

-   无需处理：编译器不要求必须捕获或声明这些异常，但可以选择性地处理。

-   常见类型：`NullPointerException`、`ArrayIndexOutOfBoundsException`、`IllegalArgumentException`、`ArithmeticException` 、`ClassCastException`等。

`ArrayIndexOutOfBoundsException`

```java
    @Test
    public void test1() {
        int[] arr = {1, 2, 3};
        System.out.println(arr[3]);  // ArrayIndexOutOfBoundsException 数组角标越界异常
        // 在开发中，数组的越界异常是不能出现的，一旦出现了，就必须要修改我们编写的代码
    }
```

`NullPointerException`

```java
@Test
public void test2() {
    String srt = null;
    System.out.println(srt.equals("hello"));  // NullPointerException 空指针异常
}
```

`ClassCastException`

```java
@Test
public void test3() {
    Object n = 15;
    String str = (String) n;  // ClassCastException
}
```

`NumberFormatException`

```java
@Test
public void test4() {
    String s = "12ab";
    Integer.parseInt(s);  // NumberFormatException
}
```

`InputMismatchException`

```java
@Test
public void test5() {
    Scanner sc = new Scanner(System.in);
    System.out.print("请输入一个整数:");
    int n = sc.nextInt();// 我们输入一个非整数，让程序报错 InputMismatchException
    sc.close();
}
```

`ArithmeticException`算术异常

```java
@Test
public void test6() {
    System.out.println(10 / 0);  // ArithmeticException
}
```