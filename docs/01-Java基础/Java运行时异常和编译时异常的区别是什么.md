# Java运行时异常和编译时异常的区别是什么？

>   首先明确
>
>   ​	运行时异常 == 非受检异常 
>
>   ​	非运行异常 == 受检异常 == 编译时异常

在 Java 中，异常分为两大类：受检异常（Checked Exceptions） 和 非受检异常（Unchecked Exceptions）
-   **受检异常（Checked Exception）**：这些异常在**编译时必须被捕获或声明抛出，否则编译器会报错**。例如`IOException`、`SQLException`等。
-   **非受检异常（Unchecked Exception）**：这些异常不需要在编译时捕获或声明抛出，编译器不会强制要求处理它们。通常是由于编程错误导致的，例如`NullPointerException`、`ArrayIndexOutOfBoundsException`等。

**受检异常（Checked Exception）**

受检异常是指那些在**编译阶段**就必须处理的异常。编译器会强制要求程序员处理这些异常，否则代码无法通过编译。

特点

-   必须处理：如果方法中抛出了编译时异常，调用者**必须通过 try-catch 块捕获异常或通过 throws 关键字声明**该方法可能抛出此异常。
-   常见类型：`IOException`、`SQLException`、`ClassNotFoundException` 、`FileNotFoundException`等。

**非受检异常（Unchecked Exception）**

非受检异常是指那些在**运行时**才发生的异常，编译器不会强制要求程序员处理这些异常。它们**通常是由于程序中的逻辑错误引起的**。

特点

-   无需处理：编译器不要求必须捕获或声明这些异常，但可以选择性地处理。

-   常见类型：`NullPointerException`、`ArrayIndexOutOfBoundsException`、`IllegalArgumentException`、`ArithmeticException` 、`ClassCastException`等。
-   继承自 RuntimeException：所有运行时异常都是 RuntimeException 类及其子类的实例。

| 特性       | 受检异常（Checked Exceptions）                    | 非受检异常（Unchecked Exceptions）                           |
| ---------- | ------------------------------------------------- | ------------------------------------------------------------ |
| 别名       | 编译时异常、非运行时异常                          | 运行时异常                                                   |
| 定义       | 必须在编译时处理的异常                            | 运行时才发生的异常                                           |
| 编译器要求 | 必须捕获或声明                                    | 不需要捕获或声明                                             |
| 常见类型   | IOException, SQLException, ClassNotFoundException | NullPointerException, ArrayIndexOutOfBoundsException, IllegalArgumentException |
| 继承自     | Exception 类及其子类                              | RuntimeException 类及其子类                                  |
| 使用场景   | 外部环境导致的异常，如文件读写、网络连接等        | 程序逻辑错误，如空指针、数组越界、类转换异常等               |
| 处理方式   | 使用 try-catch 或 throws                          | 可以选择性地使用 try-catch                                   |

