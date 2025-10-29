# Java中Exception和Error有什么区别

`Error` 和 `Exception` 都是`Throwable` 类的子类

在Java中，只有继承了Throwable类的实例，才可以被throws抛出或catch捕获

总的来说，`Error`  通常表示系统级的错误，是不可恢复的，程序无法处理它们 ；`Exception` 表示程序运行时可以被捕获和处理的异常

`Exception` 可以分为 **编译时异常（Checked Exceptions）**和**运行时异常（Unchecked Exceptions）**

-   编译时异常（Checked Exceptions）：必须在编译时**显式处理**的异常，必须通过 **try-catch 捕获**异常或通过 **throws 声明**
    -   常见类型：`IOException`、`SQLException`、`ClassNotFoundException`
-   运行时异常（Unchecked Exceptions）：不必在编译时显式处理的异常。
    -   常见类型：`NullPointerException`、`ArrayIndexOutOfBoundsException`、`IllegalArgumentException`、`ArithmeticException` 、`ClassCastException`

`Error`类： 表示严重的系统级错误或资源耗尽等问题    表示严重的错误，通常是由于系统级问题导致的，例如`OutOfMemoryError`、`StackOverflowError`等。

-   特点：通常是由 JVM 抛出，表示程序无法继续执行
-   程序员通常不需要捕获或处理 Error，因为它们通常是不可恢复的。
-   常见类型：`OutOfMemoryError`、`StackOverflowError`、`NoClassDefFoundError`等
 