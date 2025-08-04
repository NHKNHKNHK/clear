# final、finally、finalize的区别？

**final**

final 是一个修饰符，可以用于类、方法和变量。

-   修饰类：被 final 修饰的类不能被继承。

-   修饰方法：被 final 修饰的方法不能被子类重写（override）。

-   修饰变量：被 final 修饰的变量只能赋值一次，一旦赋值后就不能再修改。对于基本数据类型，这意味着它的值不能改变；对于引用类型，这意味着引用不能指向其他对象，但对象本身的内容可以修改。

**finally**

finally 是一个块，通常与 try-catch 结构一起使用。

finally 块中的代码无论是否发生异常都会执行。它通常用于确保某些关键操作（如资源释放）总是被执行

**finalize**

finalize 是 Object 类中的一个方法，可以在对象被垃圾回收之前调用。

finalize 方法允许对象在被垃圾回收之前执行一些清理工作。然而，**由于其不可预测的行为和性能问题**，现代 Java 编程中已经**很少使用 finalize**，取而代之的是更可靠的资源管理方式，如 try-with-resources 或显式的关闭方法。

注意，从 Java 9 开始，finalize 方法已经被标记为不推荐使用（deprecated），并且在未来的版本中可能会被移除。

| 特性     | final                                     | finally              | finalize                            |
| -------- | ----------------------------------------- | -------------------- | ----------------------------------- |
| 定义     | 修饰符                                    | 异常处理块           | Object 类中的方法                   |
| 作用     | 防止继承、重写或重新赋值                  | 确保关键代码总是执行 | 对象被垃圾回收前执行清理操作        |
| 使用场景 | 类、方法、变量                            | 资源释放等关键操作   | 不推荐使用，已废弃                  |
| 示例     | final class、final method、final variable | try-catch-finally    | @Override protected void finalize() |

 