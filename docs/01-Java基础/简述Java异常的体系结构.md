# 简述Java异常的体系结构？

Java 的异常体系是基于类层次结构的，所有的异常和错误都继承自 `Throwable `类。Throwable 类有两个主要的子类：`Error` 和 `Exception`。

`Throwable`类

-   定义：所有异常和错误的超类（基类）

-   作用：表示程序中发生的一些严重问题，这些问题是程序本身无法处理的

`Throwable`类有两个主要的子类：

-   `Error`类： 表示严重的系统级错误或资源耗尽等问题    表示严重的错误，通常是由于系统级问题导致的，例如`OutOfMemoryError`、`StackOverflowError`等。`Error`通常是不可恢复的，程序无法处理它们
    -   特点：通常是由 JVM 抛出，表示程序无法继续执行
    -   程序员通常不需要捕获或处理 Error，因为它们通常是不可恢复的。
    -   常见类型：`OutOfMemoryError`、`StackOverflowError`、`NoClassDefFoundError`等
-   `Exception` 类：表示程序运行时可以被捕获和处理的异常。
    -   特点：可以通过 try-catch 块捕获并处理或通过 throws 声明
    -   分为编译时异常（Checked Exceptions）和运行时异常（Unchecked Exceptions）。
        -   编译时异常（Checked Exceptions）
            -   定义：必须在编译时处理的异常。
            -   特点：编译器强制要求程序员处理这些异常。
            -   如果方法中抛出了编译时异常，调用者必须通过 **try-catch 捕获**异常或通过 **throws 声明**该方法可能抛出此异常。
            -   常见类型：`IOException`、`SQLException`、`ClassNotFoundException`
        -   运行时异常（Unchecked Exceptions）
            -   定义：不必在编译时处理的异常。
            -   特点：编译器不要求必须捕获或声明这些异常，但可以选择性地处理。通常由程序逻辑错误引起。
            -   常见类型：`NullPointerException`、`ArrayIndexOutOfBoundsException`、`IllegalArgumentException`、`ArithmeticException` 、`ClassCastException`

异常体系图

```java
java.lang.Throwable:异常体系的根父类
	|---java.lang.Error:错误。Java虚拟机无法解决的严重问题。如JVM系统内部错误，资源耗尽等严重情况
							一般不编写针对性代码进行处理
		|----StackOverflowError、OutOfMemroyError
	
	// 常见异常
	|---java.lang.Exception:异常。我们可以编写针对性代码进行处理。
		|----编译时异常：（受检异常、checked异常）在执行javac.exe命令时，出现的异常
			|----ClassNotFoundException
			|----FileNotFoundException
			|----IOException
			|---- ParseException（解析异常）
		|----运行时异常：（非受检异常、unchecked异常）在执行java.exe命令时，出现的异常
			|----ArrayIndexOutOfBoundsException（数组索引越界）
			|----NullPointerException（空指针异常）
			|----ClassCastException（类型转换异常）
			|----NumberFormatException（数字格式化异常）
			|----InputMismatchException
			|----ArithmeticException（算数异常）
			|----IllegalArgumentException（参数错误，比如方法入参类型错误）
```
