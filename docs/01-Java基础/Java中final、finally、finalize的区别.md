# Java中final、finally、finalize的区别？

**final**：用于修饰类、方法、变量，主要用来涉及不可变类、确保类的安全性、优化性能（编译器优化）

-   类：被final修饰的类不能被继承
-   方法：被final修饰的方法不能被重写
-   变量：被final修饰的变量不可重新赋值，常用于常量

**finally**：与`try-catch`结合使用，用于异常处理，确保某些代码总是会执行，如关闭资源、锁释放等

**finalize**：是Object类在的方法，用于对象被垃圾回收之前的清理操作，但由于不确定性，不推荐依赖finalize方法进行重要的清理工作，因为JVM不保证finalize()会被及时执行

>   **JDK9**之后，finalize()方法已被标记为**废弃**，因为Java提供了更好的替代方案（如实现`AutoCloseable`接口的资源可以使用`try-with-resources`语句自动关闭，该语句是一个语法糖）



## 扩展

### **finally的注意事项**

不推荐在`finally`中使用`return`，这样会覆盖`try`中使用`return`，容易引发难以发现的问题

### **finalize()方法的替代方案**

当JVM检测到对象不可达时，会标记对象，标记后调用finalize()方法进行清理（如果有重写了该方法），之后才会真正的回收对象

**但JVM并不承诺一定会等待finalize()方法运行结束**，因此可能会造成内存泄露或性能问题，所以在开发中，尽量避免使用finalize()方法进行清理操作

Java7引入了`try-with-resources`，他比依赖finalize() 更加安全有效，能够自动关闭实现`AutoCloseable`接口的资源。

或者可以依赖对象的生命管理机制（如spring的`DisposableBean`）来实现更精细化的资源回收

