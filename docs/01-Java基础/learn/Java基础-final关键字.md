# final 关键字

final 关键字可用修饰类、成员变量、方法、局部变量

-   final修饰类：被 final 修饰的类**不能被继承**，即该类为**最终类**。
-   final修饰方法：被 final 修饰的方法**不能被子类重写**，即该方法为最终方法。
-   final修饰变量：被 final 修饰的变量为**常量**，**一旦被赋值后就不能再次修改**。
    -   修饰静态变量：常量
    -   修饰实例变量：很少使用

## final关键字的作用

1.  提高程序的安全性：final修饰的类、方法和变量**不能被修改**，可以避免程序中的错误修改。
2.  提高程序的效率：final修饰的变量在**编译时就已经确定了值**，可以直接使用，避免了运行时的计算。
3.  保护重要的数据：final修饰的变量可以保护重要的数据不被修改。

需要注意的是，**final修饰的变量必须在声明时或者构造函数中初始化，否则会编译错误**。

## final 类

​使用 final 修饰类。**final类不能被继承**，即不能有子类

例如：

我们定义了一个类A

```java
public final class A {
}
```

​A类使用final修饰，其不允许任何类继承A类，有时处于安全考虑，我们可以将一个类使用 final 修饰，比如是String类就是一个 fianl类

我们又定义了一个类B，令其继承自A

```java
public class B extends A{  // idea直接就提示了 Cannot inherit from final 'com.clear.A
    					   // 编译时异常（受检异常）
    public static void main(String[] args) {
    }
}
```

我们强行运行这个类，报错如下

```
java: 无法从最终com.clear.A进行继承
```

## final 方法

使用final 修饰父类中的一个方法，那么这个**方法不能被重写**。

例如：

我们定义了一个类A，在类中定义了一个 final修饰的方法a

```java
public class A {
    public final void a(){
    }
}
```

我们又定义了一个类B，令其继承自A，重写父类A的方法a

```java
public class B extends A{
    @Override
    public void a() {  // idea直接就提示了 'a()' cannot override 'a()' in 'com.clear.A'; overridden method is final
        			  // 编译时异常（受检异常）
    }
}
```

我们为B类添加一个mian方法，强行运行B类，报错如下

```
java: com.clear.B中的a()无法覆盖com.clear.A中的a()
  被覆盖的方法为final
```

## final 变量

​	使用 final 修饰 成员变量 或 局部变量，那就称为 **常量**。常量在声明时没有默认值，所以声明常量时，必须赋予初值，且赋值以后，不能改变。

例如：

```java
public class A {
    // 成员变量
    //final double P;  // 非法，常量必须赋予初值
                      // idea直接就提示了 Variable 'PI' might not have been initialized
                      // 编译时异常（受检异常）
    final double PI = 3.1415926;
    public  void a(final double r){
        r = 2.5;    // 非法，常量不能改变
                    // idea直接就提示了 Cannot assign a value to final variable 'r'
        // 编译时异常（受检异常）
    }
}
```

建议：

​	常量建议使用英文字母大写，多个单词之间使用_下划线相连

### final 修饰 局部变量

变量是**基本类型**：final修饰指的是基本类型的**数据值不能发生改变**。

变量是**引用类型**：final修饰指的是引用类型的**地址值不能改变，但地址里的内容可以改变**。

例如：

```java
public class A {
    public void a() {
        final double r = 1.0;  // 修饰基本数据类型
        // r = 2.0;    // 值不能修改，否则报错 Cannot assign a value to final variable 'r'
        final Person p = new Person("lisi", 18);  // 修饰引用类型
        //p = new Person("zhangsan",19);  // 引用类型地址不能修改，否则报错 Cannot assign a value to final variable 'p'

        // 但是可以修改引用类型里面的内容
        p.setName("zhangsan");
    }
}

class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
	// 省略了getXxx setXxx 方法
}
```

