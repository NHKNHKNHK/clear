# this关键字

在Java中，`this` 关键字是一个引用，它指代当前对象的引用。

## 主要作用

-   this代表了当前对象的引用
-   this关键字可以用在实例方法和构造器中（禁止使用在类（静态）方法中）
    -   this用在方法中，谁调用这个方法，this就代表谁
    -   this用在构造器中，代表了构造器正在初始化的那个对象的引用

以下是在Java中使用 `this` 关键字的一些常见用法：

### **访问当前对象的成员变量**

​使用 `this` 关键字可以访问当前对象的成员变量。**当成员变量与方法参数或局部变量同名时**，可以使用 `this` 关键字来明确指示访问的是成员变量而不是方法参数或局部变量。（**解决局部变量隐藏成员变量**）

即：方法的形参如果与成员变量同名，不带 this 修饰的变量指形参，带 this 修饰的变量指成员变量

```java
public class MyClass {
    private int num;

    public void setNum(int num) {
        this.num = num; // 使用 this 关键字访问成员变量
    }
}
```

### **调用当前对象的其他方法**

使用 `this` 关键字可以调用当前对象的其他方法。这在方法内部需要调用其他方法时很有用。

```java
public class MyClass {
    public void method1() {
        // 调用 method2 方法
        this.method2();  // 当然，都是成员方法，this也可以省略不写
    }

    public void method2() {
        // 方法实现
    }
}
```

### **在构造方法中调用其他构造方法**

在一个类中，可以定义多个构造方法。使用 `this` 关键字可以在一个构造方法中调用同一个类的其他构造方法。

**this在构造器中只能在第一行，否则报错**

```java
public class MyClass {
    private int num;

    public MyClass() {
        this(0); // 调用带参数的构造方法
    }

    public MyClass(int num) {
        this.num = num;
    }
}
```

## **什么时候使用this**

​	**解决局部变量隐藏成员变量**，`this` 关键字在Java中用于指代当前对象，可以用于访问成员变量、调用其他方法以及在构造方法中调用其他构造方法。它可以帮助区分成员变量和方法参数/局部变量的命名冲突，并且方便在对象内部进行方法调用。

​	this代表所在类的对象引用，方法被哪个对象调用，this就代表哪个对象（简单来说：随调用我，我就是谁）


:::warning

​`this关键字不能出现在静态方法中`，因为静态方法是属于类而不是对象的，它在类加载时就已经存在，而不需要实例化对象。

​再者，静态方法可以是通过类名访问的
:::

```java
public class MyClass {
    private static int num;

    public static void staticMethod() {
        // 无法使用 this 关键字
        // this.num = 10; // 编译错误

        // 可以直接访问静态成员变量
        num = 10;

        // 无法访问非静态成员变量
        // int x = this.num; // 编译错误

        // 无法调用非静态方法
        // instanceMethod(); // 编译错误
    }

    public void instanceMethod() {
        // 可以使用 this 关键字
        this.num = 20;

        // 可以访问静态成员变量
        num = 20;
    }
}
```

另外，**使用 this 访问属性和方法时，如果在本类中未找到，会从父类中查找**。

