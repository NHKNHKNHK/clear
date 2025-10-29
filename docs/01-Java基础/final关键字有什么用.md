# final关键字有什么用

final 关键字可用修饰类、成员变量、方法、局部变量

-   final修饰类：被 final 修饰的类**不能被继承**，即该类为**最终类**。
-   final修饰方法：被 final 修饰的方法**不能被子类重写**，即该方法为最终方法。
-   final修饰变量：被 final 修饰的变量为**常量**，**一旦被赋值后就不能再次修改**。
    -   修饰静态变量：常量
    -   修饰实例变量：很少使用
    -   变量类型为基本类型：被final修饰后**数据值不能发生改变**。
    -   变量类型为引用类型：被final修饰后**地址值不能改变，但地址里的内容可以改变**。
    -   需要注意的是，**final修饰的变量必须在声明时或者构造函数中初始化，否则会编译错误**。
-   final 修饰 局部变量
    -   变量类型为基本类型：被final修饰后**数据值不能发生改变**。
    -   变量类型为引用类型：被final修饰后**地址值不能改变，但地址里的内容可以改变**。

## **final修饰类**

当一个类被声明为final时，它**不能被继承**。这对于创建不可变类（immutable class）或确保类的实现不被改变是非常有用的。

例如，String类就是一个不可变类

## **final修饰变量**

当一个变量被声明为final时，它的值在初始化之后就不能被改变。final变量必须在声明时或通过构造函数进行初始化

-   变量是**基本类型**：final修饰指的是基本类型的**数据值不能发生改变**。

-   变量是**引用类型**：final修饰指的是引用类型的**地址值不能改变，但地址里的内容可以改变**。

```java
public class Example {
    final int finalVar = 10; // 声明时初始化

    final int anotherFinalVar;

    public Example(int value) {
        anotherFinalVar = value; // 通过构造函数初始化
    }

    public void changeValue() {
        // finalVar = 20; // 编译错误，final变量的值不能被改变
    }
}
```

## **final修饰方法**

当一个方法被声明为final时，它不能被子类重写（override）。这可以用来防止子类改变父类中关键的方法实现。

## **final修饰局部变量**

final也可以用于局部变量，尤其是在匿名类或lambda表达式中使用时。被声明为final的局部变量在方法执行期间不能被修改。

-   变量是**基本类型**：final修饰指的是基本类型的**数据值不能发生改变**。

-   变量是**引用类型**：final修饰指的是引用类型的**地址值不能改变，但地址里的内容可以改变**。

```java
public class Example {
    public void method() {
        final int localVar = 10;

        // localVar = 20; // 编译错误，无法修改final局部变量

        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                System.out.println(localVar); // 可以在匿名类中访问final局部变量
            }
        };

        runnable.run();
    }
}
```

## **final和不可变对象**

final关键字在创建不可变对象时非常有用。不可变对象的状态在创建之后不能被改变，这在多线程环境中尤其重要，因为它们是线程安全的

```java
public final class ImmutableClass {
    private final int value;

    public ImmutableClass(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
```
