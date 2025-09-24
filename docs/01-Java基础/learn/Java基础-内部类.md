# 内部类

​	内部类是类的五大成分之一（成员变量、方法、代码块、构造器、内部类），如果一个类定义在另一个类的内部，那么这个类就是内部类。

## 内部类的分类

​	在Java中，**内部类是定义在另一个类内部的类**。**内部类可以访问外部类的成员变量和方法，而外部类不能访问内部类的成员变量和方法。**内部类可以分为四种类型：

1.  **成员内部类**（Member Inner Class）：定义在外部类的成员位置，可以访问外部类的成员变量和方法。
2.  **局部内部类**（Local Inner Class）：定义在方法内部的类，只能在该方法内部使用。
3.  **匿名内部类**（Anonymous Inner Class）：没有类名的内部类，通常用于创建实现某个接口或继承某个类的对象。
4.  **静态内部类**（Static Inner Class）：定义在外部类的静态成员位置，可以访问外部类的静态成员变量和方法。

内部类的优点：

1.  内部类可以访问外部类的私有成员变量和方法，增强了封装性。
2.  内部类可以实现多重继承，一个类可以继承多个接口。
3.  内部类可以隐藏实现细节，使代码更加简洁。
4.  内部类可以实现回调函数，提高程序的灵活性。

需要注意的是，内部类不能有静态成员变量和方法，因为内部类的实例必须依赖于外部类的实例。同时，内部类的实例不能在外部类的静态方法中创建，因为静态方法没有this指针。

注意：

​	Java编译器生成的内部类的字节码文件的名字与普通类不同，内部类对应的字节码文件的名字格式 **外部类名$内部类名**

​	只有内部类才可能使用 static 修饰，**非内部类不可以使用 static 修饰**

## 成员内部类

成员内部类，类似于普通的成员变量、成员方法

**访问特点：**

-   成员内部类中的实例方法中，可以直接访问外部类的实例成员、静态成员（还包括私有成员）
-   可以在成员内部类的实例方法中，可以通过 外**部类名.this** 拿到外部类对象

基本格式：

```java
public class Outer {
    // 成员内部类
    public class Inner {
     
    }
}
```

创建成员内部类对象基本格式：

```java
// 外部类名.内部类名 对象名 = new 外部类(...).new 内部类(...)
Outer.Inner inner = new Outer().new Inner();
```

注意：

​	JDK16之前，成员内部类中不能定义静态成员，**JDK16开始也可以定义静态成员**了

例如：

```java
public class Outer {
    public int age = 99;
    private static String a;

    // 成员内部类
    public class Inner {
        private String name;
        public int age = 88;
        // private static String schcoolName;  // JDK16开始才支持定义静态成员(包括静态成员变量、静态成员方法)
        // public static void hello(){}

        public void test() {
            // 在成员内部类中访问外部类的成员变量
            System.out.println(a);  // 内部类可以访问外部类的成员（包括私有成员）

            int age = 66;
            System.out.println(age);  // 66
            System.out.println(this.age);  // 88
            System.out.println(Outer.this.age);  // 99
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
```

测试

```java
public class Test {
    public static void main(String[] args) {
        Outer.Inner inner = new Outer().new Inner();
        inner.test();
    }
}
```

## 静态内部类

有 static 修饰的内部类，它属于外部类持有。

静态内部类与普通的类没有什么区别，只是它所处的位置比较特殊（定义在外部类的静态成员位置）。它属于外部类持有。

普通的外部类拥有的成分，静态内部类都可以拥有

**访问特点**：

-   静态内部类可以直接访问外部类的静态成员变量和方法。
-   但是静态内部类不能直接访问外部类的实例成员，可以通过创建对象的方式访问

基本格式：

```java
public class Outer {
    // 静态内部类
    public static class Inner {

    }
}
```

创建静态内部类对象基本格式：

```java
// 外部类名.内部类名 对象名 = new 外部类.内部类(...)
Outer.Inner inner = new Outer.Inner();
```

例如：

```java
public class Outer {
    private static int age;  // 静态成员
    public static void hello() {
    }
    public String schoolName;  // 实例成员


    // 静态内部类：普通类有的静态内部类都可以拥有
    public static class Inner {
        private String name;
        public static int a;

        public void test() {
            System.out.println(age);  // 静态内部类，访问外部类的静态成员变量
            hello();  // 静态内部类，访问外部类的静态成员方法
            // System.out.println(schoolName);  // 静态内部类，访问外部类的实例成员，报错
            System.out.println(new Outer().schoolName);  // 但是可以通过创建对象的方式访问外部类实例成员
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
```

测试

```java
public class Test {
    public static void main(String[] args) {
        Outer.Inner inner = new Outer.Inner();
        // 调用静态内部类中的方法
        inner.setName("xiaoming");
        inner.test();
    }
}
```



## 局部内部类

局部内部类，是定义在方法内部、代码块内部、构造器内部等执行体中的类，只能在这些执行体的局部使用。

注意：

​	**局部内部类不能使用 public  private protected修饰**

例如：

```java
public class Test {
    public Test() {
        class A {  // 在构造器中的局部内部类

        }
    }

    {
        class A {  // 在代码块中的局部内部类

        }
    }
    static {
        class A{  // 在静态代码块中的局部内部类

        }
    }

    public static void main(String[] args) {

    }
    public static void go() {
        class A { // 定义在方法内部的局部内部类

        }
        abstract class B {

        }
        interface C {
            void doSomething();
        }
    }
}
```

## 匿名内部类

匿名内部类是一种特殊的局部内部类。

所谓匿名，指的是该类不需要指定具体的名称。

匿名内部类的作用，通常用于创建实现某个接口或继承某个类的对象。

匿名内部类**特点**：

-   匿名内部类的本质就是一个子类，并会立即创建出一个子类对象

使用匿名内部类的**好处**:

-   用于更方便的创建子类对象

注意：

​	匿名内部类可以继承父类的方法，也可以重写父类的方法。一般情况下我们都会重写父类的方法

​	匿名内部类的类体中，不能声明 static 成员(变量、方法)。因为匿名内部类是一种特殊的局部内部类

基本格式：

```java
new 类或接口(参数列表){
	类体(一般是重写的方法)
}
```

接下来分别使用传统方式和匿名内部类的方式，感受一下匿名内部类的强大

```java
public class Test {
    public static void main(String[] args) {
        Animal animal = new Cat();
        animal.cry();
    }
}

// 传统实现抽象类的方法
class Cat extends Animal{
    @Override
    public void cry() {
        System.out.println("喵~~~~");
    }
}

abstract class Animal{
    public abstract void cry();
}
```

```java
public class Test {
    public static void main(String[] args) {
        // 使用匿名内部类的方式实现
        // 编译器会把这个匿名内部类编译成一个子类，然后立即创建这个子类的对象出来
        Animal animal = new Animal() {
            @Override
            public void cry() {
                System.out.println("喵~~`");
            }
        };
        animal.cry();
    }
}

abstract class Animal{
    public abstract void cry();
}
```

​	**编译器会把这个匿名内部类编译成一个子类，然后立即创建这个子类的对象出来**，对于这句话的解释，我们可以看到编译后生成的字节码文件，生成了三个字节码文件，分别为：

-   Animal.class
-   Test.class
-   Test$1.class

通过idea的反编译功能，可以看到 Test$1.class 字节码文件，如下

```java
package com.clear;

final class Test$1 extends Animal {
    Test$1() {
    }

    public void cry() {
        System.out.println("喵~~`");
    }
}
```

编译器确实将将这个匿名内部类编译成了一个子类，并且为这个子类自动赋予了名字，所以我们不需要为匿名内部类手动指定名称

### 匿名内部类开发中使用场景

-   **通常作为一个参数传递给一个方法**

```java
public class Test {
    public static void main(String[] args) {
        Swimming dog = new Swimming() {
            @Override
            public void swim() {
                System.out.println("狗刨式游泳");
            }
        };
        go(dog);

        // 匿名内部类通常作为一个参数传递给一个方法
        go(new Swimming() {
            @Override
            public void swim() {
                System.out.println("猫也会游泳");
            }
        });

        // 单接口匿名内部类还可以简化为
        go(() -> System.out.println("猫也会游泳"));
    }

    // 设计一个方法，可以接受Swimming接口的一切实现类对象来参加游泳比赛
    public static void go(Swimming s) {
        System.out.println("开始~~~~~~~~~~");
        s.swim();
    }
}

// 如果猫和狗都需要参加游泳比赛
interface Swimming {
    void swim();
}
```

