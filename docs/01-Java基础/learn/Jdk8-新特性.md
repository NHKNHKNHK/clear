---
permalink: /java/jdk8-new-features
---

# Java8新特性

## Java8新特性—接口新特性

### 接口中默认方法修饰为普通方法

在jdk8之前，`interface`之中可以定义变量和方法，**变量必须是`public static final`的**，**方法必须是`public abstract`的**，由于这些修饰符都是默认的，所以在书写的时候可以省略不写。

- 接口定义方法：`public 返回类型 方法名(参数列表)` 需要子类实现

- 接口定义变量：`public static final 变量名` （记住，接口中的变量必须初始化）

:::warning
准确的来说，接口中定义的变量应该叫做常量，而不是变量。
:::

在JDK 1.8开始 支持使用`static`和`default` 修饰 可以写方法体，不需要子类重写。

方法区别：

- 普通方法 可以有方法体
- 抽象方法 没有方法体**需要子类实现 重写**。

演示

```java
public interface MyInterface {
    // public final static int age=18;
    int age = 18;  // 接口中的变量 必须初始化

    //public abstract void doSomething(String input);
    void doSomething(String input);  // 接口中的抽象方法 不必声明方法体

    /**
     * 默认方法 可以写方法体
     */
    default void getDefaultOrder() {
        System.out.println("我是默认方法 我可以写方法体");
    }

    /**
     * 静态方法 可以写方法体
     */
    static void getStaticOrder() {
        System.out.println("我是静态的方法 可以写方法体");
    }
}


public class MyInterfaceImpl implements MyInterface{

    // 接口中的抽象方法 必须重写
    @Override
    public void doSomething(String input) {

    }

    // 默认方法可以重写，但没必要
    @Override
    public void getDefaultOrder() {

    }
}

```

## Java8新特性—Lambda表达式

Java中使用Lambda表达式（Lambda expression）是为了**简化匿名内部类的代码形式**

Lambda表达式**适用于单接口匿名类**(**接口中只有一个抽象方法的匿名内部类**)

以下是Lambda表达式简化匿名内部类的格式

```java
(匿名内部类被重写方法的形参列表) -> {
    被重写方法的方法体（Lambda体）
}

lambda形参列表 -> lambda体
 
// -> 是语法形式，无实际意义
```

:::warning
Lamdba表达式只能简化**函数式接口的匿名内部类**的写法形式
:::

**函数式接口**（jdk8新特性）

-   必须是接口
-   接口中只有一个抽象方法（接口中可以有多个static方法、default方法，但只能有一个抽象方法）
-   一般可以加上`@FunctionalInterface`注解，来声明这是函数式接口

### 为什么要使用Lambda

Lambda表达式基本作用？

-   简化函数式接口的匿名内部类的写法

Lambda表达式使用要注意什么？

-   必须是接口的单接口匿名内部类

Lambda表达式该何时使用？

-   需要作为接口的实现类对象时使用

Lambda表达式的好处

-    Lambda是一个匿名函数，我们可以把Lambda表达式理解为是一段可以传递的代码，它可以写出更简洁、更灵活的代码，同时使代码风格更加紧凑，**使Java语言表达能力得到了提升**

:::tip

**Lambda表达式的本质：**

-   一方面，Lambda表达式作为接口的实现类对象。
-   另一方面，Lambda表达式是一个匿名函数

:::

### Lambda的使用

 Lambda 是一个**匿名函数**，我们可以把 Lambda 表达式理解为是**一段可以传递的代码**（将代码像数据一样进行传递）。使用它可以写出更简洁、更灵活的代码。作为一种更紧凑的代码风格，使 Java 的语言表达能力得到了提升。 

演示

```java
import org.junit.Test;

import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.function.Consumer;

public class LambdaTest2 {
    /**
     * 语法格式一：无参 无返回值
     */
    @Test
    public void test1() {
        Runnable r1 = new Runnable() {
            @Override
            public void run() {
                System.out.println("runnable ...");
            }
        };
        r1.run();

        System.out.println("-----------------");
        // Lambda表达式写法
        Runnable r2 = () -> System.out.println("runnable ...");
        r2.run();
    }

    /**
     * 语法格式二：Lambda需要一个参数，无返回值
     */
    @Test
    public void test2() {
        Consumer<String> con = new Consumer<String>() {
            @Override
            public void accept(String s) {
                System.out.println(s);
            }
        };
        con.accept("谎言和誓言的区别");

        System.out.println("-----------------");
        // Lambda表达式写法
        Consumer<String> con2 = (String s) -> {
            System.out.println(s);
        };
        con2.accept("一个是说的人当真，一个是听的人当真");

        // 当Lambda体中只有一条语句时，大括号可以省略，同时分号也要去掉
        Consumer<String> con3 = (String s) -> System.out.println(s);
        con3.accept("一个是说的人当真，一个是听的人当真");
    }

    /**
     * 语法格式三：数据类型可以省略，因为可由编译器推断得出，称为”类型推断“
     */
    @Test
    public void test3() {
        Consumer<String> con = new Consumer<String>() {
            @Override
            public void accept(String s) {
                System.out.println(s);
            }
        };
        con.accept("如果大学可以重来，你最想做的是啥？");

        System.out.println("-----------------");
        // Lambda表达式写法
        Consumer<String> con2 = (s) -> System.out.println(s);
        con2.accept("大一就来尚硅谷");
    }

    /**
     * 类型推断
     */
    @Test
    public void test3_1() {
        int[] arr = {1, 2, 3, 4};  // 类型推断

        HashMap<String, Integer> map = new HashMap<>();  // 类型推断

        Set<Map.Entry<String, Integer>> entries = map.entrySet();
        // var = map.entrySet(); // jdk10及之后的类型推断
    }

    /**
     * 语法格式四：Lambda若只有一个参数时，参数的小括号可以省略（但是没有参数时，小括号不可以省略）
     */
    @Test
    public void test4() {
        Consumer<String> con = new Consumer<String>() {
            @Override
            public void accept(String s) {
                System.out.println(s);
            }
        };
        con.accept("世界那么大，我想去看看");

        System.out.println("-----------------");
        // Lambda表达式写法
        Consumer<String> con2 = s -> System.out.println(s);
        con2.accept("世界那么大，我想去看看");
    }

    /**
     * 语法格式五：Lambda 需要两个或以上参数时，多条执行语句，并且可以有返回值
     */
    @Test
    public void test5() {
        Comparator<Integer> com1 = new Comparator<Integer>() {
            @Override
            public int compare(Integer o1, Integer o2) {
                System.out.println(o1);
                System.out.println(o2);
                return Integer.compare(o1, o2);
            }
        };
        int compare1 = com1.compare(12, 13);
        System.out.println(compare1);

        System.out.println("-----------------");
        // Lambda表达式写法
        Comparator<Integer> com2 = (o1, o2) -> {
            System.out.println(o1);
            System.out.println(o2);
            return Integer.compare(o1, o2);
        };
        System.out.println(com2.compare(13, 12));
    }

    /**
     * 语法格式五：当Lambda体只有一条语句时， 若有return和大括号，都可以省略
     */
    @Test
    public void test6() {
        Comparator<Integer> com1 = new Comparator<Integer>() {
            @Override
            public int compare(Integer o1, Integer o2) {
                return Integer.compare(o1, o2);
            }
        };
        int compare1 = com1.compare(12, 13);
        System.out.println(compare1);

        System.out.println("-----------------");
        // Lambda表达式写法
        // 当Lambda体中只有一条语句时，大括号可以省略，同时分号也要去掉（如果这条语句是return语句，则必须省略return）
        Comparator<Integer> com2 = (o1, o2) -> Integer.compare(o1, o2);
        System.out.println(com2.compare(13, 12));
    }

}

```

### Lambda语法规则

**Lambda 表达式语法格式**

​	在 Java 8 语言中引入的一种新的语法元素和操作符。这个操作符为 “*->*” ， 该操作符被称为 Lambda操作符或箭头操作符。它将 Lambda 分为两个部分： 

-   左侧：指定了 Lambda 表达式需要的参数列表 （对应着要重写的接口中的抽象方法的形参列表）

-   右侧：指定了 Lambda 体，是抽象方法的实现逻辑，也即 Lambda 表达式要执行的（对应着接口的实现类要重写的方法的方法体）

    

**Lamdba表达式语法的省略规则**

-   **参数类型可以不写**（因为编译器可以根据上下文推断出来）
-   如果只有**一个参数**，参数类型可以省略，**小括号()也可以省略**
-   如果Lambda表达式的方法体**代码只有一行，可以省略大括号{}，同时必须省略分号;**
-   如果Lambda表达式的方法体代码**只有一行，并且这行代码是retrun语句，可以省略retrun，同时省略大括号{}，分号;**



### 关于类型推断

在语法格式三 **Lambda 表达式中的参数类型都是由编译器推断得出的**。 **Lambda 表达式中无需指定类型**，程序依然可以编译，这是因为 **javac 根据程序的上下文，在后台推断出了参数的类型**。Lambda 表达式的类型依赖于上下文环境，是由编译器推断出来的。这就是所谓的**类型推断**。 

演示如下

```java
/**
     * 语法格式三：数据类型可以省略，因为可由编译器推断得出，称为”类型推断“
     */
    @Test
    public void test3() {
        Consumer<String> con = new Consumer<String>() {
            @Override
            public void accept(String s) {
                System.out.println(s);
            }
        };
        con.accept("如果大学可以重来，你最想做的是啥？");

        System.out.println("-----------------");
        // Lambda表达式写法
        Consumer<String> con2 = (s) -> System.out.println(s);
        con2.accept("大一就来尚硅谷");
    }

    /**
     * 类型推断
     */
    @Test
    public void test3_1() {
        int[] arr = {1, 2, 3, 4};  // 类型推断

        HashMap<String, Integer> map = new HashMap<>();  // 类型推断

        Set<Map.Entry<String, Integer>> entries = map.entrySet();
        // var = map.entrySet(); // jdk10及之后的类型推断
    }
```



## Java8新特性—函数式(Functional)接口

### 什么是函数式接口

-   **接口中只声明一个抽象方法**（Single Abstract Method，简称 SAM）的接口，称为函数式接口。当然该接口可以包含其他非抽象方法（例如，可以有static方法、default方法）。 
-   你**可以通过 Lambda 表达式来创建该接口的对象**。（若 Lambda 表达式抛出一个受检异常(即非运行时异常)，那么该异常需要在目标接口的抽象方法上进行声明）。  
-   我们**可以在一个接口上使用 @FunctionalInterface 注解**，这样做**可以检查它是否是一个函数式接口**。同时 javadoc 也会包含一条声明，说明这个接口是一个函数式接口。  
-   在 java.util.function 包下定义了 Java 8 的丰富的函数式接口

例如

下面这个接口使用了 @FunctionalInterface，因此只能包含一个抽象方法

```java
@FunctionalInterface
public interface MyInterface {
    // public final static int age=18;
    int age = 18;  // 接口中的变量 必须初始化


    void doSomething(String input);  // 接口中的抽象方法 不必声明方法体
    // 以下声明的这个抽象方法会报错，因为该接口使用了 @FunctionalInterface 注解声明
    //void doSomething2(String input);


    /**
     * 默认方法 可以写方法体
     */
    default void getDefaultOrder() {
        System.out.println("我是默认方法 我可以写方法体");
    }

    /**
     * 静态方法 可以写方法体
     */
    static void getStaticOrder() {
        System.out.println("我是静态的方法 可以写方法体");
    }
}
```

### 对函数式接口的理解

-   Java 从诞生日起就是一直倡导**一切皆对象**，在 Java 里面面向对象(OOP)编程是一切。但是随着 python、scala 等语言的兴起和新技术的挑战，Java 不得不做出调整以便支持更加广泛的技术要求，即 Java 不但可以支持 OOP 还可以支持 OOF（面向函数编程）
    -    Java8 引入了 Lambda 表达式之后，Java 也开始支持函数式编程。
    -   Lambda 表达式不是 Java 最早使用的。目前 C++，C#，Python，Scala 等
        均支持 Lambda 表达式。

-   面向对象的思想：
    -   做一件事情，找一个能解决这个事情的对象，调用对象的方法，完成事情。
-   函数式编程思想：
    -    只要能获取到结果，谁去做的，怎么做的都不重要，重视的是结果，不重视过程。
-   在函数式编程语言当中，函数被当做一等公民对待。在将函数作为一等公民的编程语言中，Lambda 表达式的类型是函数。但是在 Java8 中，有所不同。在 Java8 中，Lambda 表达式是对象，而不是函数，它们必须依附于一类特别的对象类型——函数式接口。
-   简单的说，**在 Java8 中，Lambda 表达式就是一个函数式接口的实例。**这就是 Lambda表达式和函数式接口的关系。也就是说，**只要一个对象是函数式接口的实例，那么该对象就可以用 Lambda 表达式来表示。**

例如

```java
// java.lang.Runnable
@FunctionalInterface
public interface Runnable {
    public abstract void run();
}

// 函数式接口中未使用泛型
@FunctionalInterface
public interface eatInterface {
    void eat();
}

// 函数式接口中使用泛型
@FunctionalInterface
public interface eatInterface<T> {
    T eat(T t);
}

```

### Java内置函数式接口

#### JDK8之前的函数式接口

```java
// JDK1.0
@FunctionalInterface
public interface Runnable {
    public abstract void run();
}

// Since 1.5 
public interface Iterable<T> {
    Iterator<T> iterator();
}

// since 1.2
public interface Comparable<T> {
    public int compareTo(T o);
}

// Since 1.2
@FunctionalInterface
public interface Comparator<T> {
    int compare(T o1, T o2);
}
```



#### JDK8中引入的四大核心函数式接口

| 函数式接口      | 称谓       | 参数类型 | 用途                                                       | 抽象方法          |
| --------------- | ---------- | -------- | ---------------------------------------------------------- | ----------------- |
| Consumer\<T>    | 消费型接口 | T        | 对类型为T的对象应用操作                                    | void accept(T t)  |
| Supplier\<T>    | 供给型接口 | 无       | 返回类型为T的对象                                          | T get();          |
| Function\<T, R> | 函数型接口 | T        | 对类型为T的对象应用操作，并返回结果。<br>结果是R类型的对象 | R apply(T t)      |
| Predicate\<T>   | 判断型接口 | T        | 确认类型为T的对象是否满足某约束条件，并返回boolean值       | boolean test(T t) |

#### 其他接口

##### 类型1：消费型接口

消费型接口的抽象方法特点：**有形参，但是返回值类型为void**

| 接口名               | 抽象方法                       | 描述                       |
| -------------------- | ------------------------------ | -------------------------- |
| `BiConsumer<T, U>`     | void accept(T t, U u)          | 接收两个对象用于完成功能   |
| `DoubleConsumer`       | void accept(double value)      | 接收一个double值           |
| `IntConsumer`          | void accept(int value)         | 接收一个int值              |
| `LongConsumer`         | void accept(long value)        | 接收一个long值             |
| `ObjDoubleConsumer<T>` | void accept(T t, double value) | 接收一个对象和一个double值 |
| `ObjIntConsumer<T>`    | void accept(T t, int value)    | 接收一个对象和一个int值    |
| `ObjLongConsumer<T>`   | void accept(T t, long value)   | 接收一个对象和一个long值   |



##### 类型2：供给型接口

供给型接口的抽象方法特点：**无形参，但是有返回值**

| 接口名          | 抽象方法               | 描述                |
| --------------- | ---------------------- | ------------------- |
| BooleanSupplier | boolean getAsBoolean() | 返回一个 boolean 值 |
| DoubleSupplier  | double getAsDouble()   | 返回一个 double 值  |
| IntSupplier     | int getAsInt()         | 返回一个 int 值     |
| LongSupplier    | long getAsLong();      | 返回一个 long 值    |



##### 类型3：函数型接口

函数型接口的抽象方法特点：**既有参数又有返回值**

| 接口名                  | 抽象方法                                        | 描述                                                 |
| ----------------------- | ----------------------------------------------- | ---------------------------------------------------- |
| `UnaryOperator`           | T apply(T t)                                    | 接收一个T类型对象，返回一个T类型对象结果             |
| `DoubleFunction<R>`       | R apply(double value)                           | 接收一个double值，返回一个R类型对象                  |
| `IntFunction<R>`          | R apply(int value)                              | 接收一个int值，返回一个R类型对象                     |
| `LongFunction<R>`         | R apply(long value)                             | 接收一个long值，返回一个R类型对象                    |
| `ToDoubleFunction<T>`     | double applyAsDouble(T value)                   | 接收一个T类型对象，返回一个double                    |
| `ToIntFunction<T>`        | int applyAsInt(T value)                         | 接收一个T类型对象，返回一个int                       |
| `ToLongFunction<T>`       | long applyAsLong(T value)                       | 接收一个T类型对象，返回一个long                      |
| `DoubleToIntFunction`     | int applyAsInt(double value)                    | 接收一个double值，返回一个int结果                    |
| `DoubleToLongFunction`    | long applyAsLong(double value)                  | 接收一个double值，返回一个long结果                   |
| `IntToDoubleFunction`     | double applyAsDouble(int value)                 | 接收一个int值，返回一个double结果                    |
| `IntToLongFunction`       | long applyAsLong(int value)                     | 接收一个int值，返回一个long结果                      |
| `LongToDoubleFunction`    | double applyAsDouble(long value)                | 接收一个long值，返回一个double结果                   |
| `LongToIntFunction`       | int applyAsInt(long value)                      | 接收一个long值，返回一个int结果                      |
| `DoubleUnaryOperator`     | double applyAsDouble(double operand)            | 接收一个double值，返回一个double                     |
| `IntUnaryOperator`        | int applyAsInt(int operand)                     | 接收一个int值，返回一个int                           |
| `LongUnaryOperator`       | long applyAsLong(long operand)                  | 接收一个long值，返回一个long                         |
| `BiFunction<T,U,R>`       | R apply(T t, U u)                               | 接收一个T类型和一个U类型对象， 返回一个R类型对象结果 |
| `BinaryOperator`          | T apply(T t, T u)                               | 接收两个T类型对象， 返回一个T类型对象结果            |
| `ToDoubleBiFunction<T,U>` | double applyAsDouble(T t, U u)                  | 接收一个T类型和一个U类型对象， 返回一个double        |
| `ToIntBiFunction<T,U>`    | int applyAsInt(T t, U u)                        | 接收一个T类型和一个U类型对象， 返回一个int           |
| `ToLongBiFunction<T,U>`   | long applyAsLong(T t, U u)                      | 接收一个T类型和一个U类型对象， 返回一个long          |
| `DoubleBinaryOperator`    | double applyAsDouble(double left, double right) | 接收两个 double 值，返回一个double值                 |
| `IntBinaryOperator`       | int applyAsInt(int left, int right)             | 接收两个 int 值，返回一个int 值                      |
| `LongBinaryOperator`      | long applyAsLong(long left, long right)         | 接收两个 long 值，返回一个long值                     |



##### **类型4：判断型接口**

判断型接口的抽象方法特点：**有形参，但是返回值类型是 boolean** 

| 接口名              | 抽象方法                   | 描述               |
| ------------------- | -------------------------- | ------------------ |
| `BiPredicate<T, U>` | boolean test(T t, U u)     | 接收两个对象       |
| `DoublePredicate`   | boolean test(double value) | 接收一个 double 值 |
| `IntPredicate`      | boolean test(int value)    | 接收一个 int 值    |
| `LongPredicate`     | boolean test(long value)   | 接收一个 long 值   |



## Java8新特性—方法引用、构造器引用

Lambda表达式是可以简化函数式接口的变量或形参赋值的语法。而**方法引用和构造器引用是为了简化Lambda表达式的。**

### 方法引用

当要传递给 Lambda 体的操作，已经有实现的方法了，可以使用方法引用！**方法引用可以看做是 Lambda 表达式深层次的表达**。换句话说，方法引用就是 Lambda 表达式，也就是函数式接口的一个实例，通过方法的名字来指向一个方法，可以认为是 Lambda 表达式的一个语法糖。 

**语法糖**（Syntactic sugar），也译为糖衣语法，是由英国计算机科学家 彼得·约翰·兰达（Peter J. Landin）发明的一个术语，指计算机语言中添加的某种语法，这种语法对语言的功能并没有影响，但是更方便程序员使用。通常来说使用语法糖能够增加程序的可读性，从而减少程序代码出错的机会。 

简单来说：

-   方法引用，可以看做是基于Lambda表达式的进一步刻画。
-   当需要提供一个函数式接口的实例时，我们可以使用lambda表达式提供此实例。
-   **当满足一定的条件的情况下，我们还可以使用方法引用或构造器引用替换lambda表达式**

方法引用的本质：

​	**方法引用作为了函数式接口的实例。** ===> 体现了 ”万物皆对象“

格式

```java
类（或对象）:: 方法名      // 两个:之间不能有空格，而且必须英文状态下半角输入

情况一
	对象 :: 实例方法
	
情况二
	类 :: 静态方法
	
情况三
	类 :: 实例方法
```

#### 方法引用使用前提

**要求 1：**

-   **Lambda 体只有一句语句**，并且是通过调用一个对象的/类现有的方法来完成的

例如：System.out 对象，调用 println()方法来完成 Lambda 体 

​			Math 类，调用 random()静态方法来完成 Lambda 体

**要求 2：** 

-   针对情况 1：函数式接口中的抽象方法a在被重写时使用了某一个对象的方法b。如果方法a的形参列表、返回值类型与方法b的形参列表、返回值类型都相同，则我们可以使用方法b实现对方法a的重写、替换。 

-   针对情况 2：函数式接口中的抽象方法a在被重写时使用了某一个类的静态方法b。如果方法a的形参列表、返回值类型与方法 b 的形参列表、返回值类型都相同，则我们可以使用方法 b 实现对方法 a 的重写、替换。 

-   针对情况 3：函数式接口中的抽象方法 a 在被重写时使用了某一个对象的方法b。如果方法a的返回值类型与方法b的返回值类型相同，同时方法a的形参列表中有n个参数，方法 b 的形参列表有n-1个参数，且方法a的第1个参数作为方法b的调用者，且方法a的后n-1参数与方法 b 的 n-1参数匹配（类型相同或满足多态场景也可以）

例如：t->System.out.println(t) 

​			() -> Math.random() 都是无参



#### 1 实例方法引用

基本格式

```java
对象名 :: 实例方法
```

**要求**

-   函数式接口中的**抽象方法a与其内部实现时调用的对象的某个方法b的形参列表和返回值类型都相同（一致）**
-   此时，可以**考虑使用方法b对方法a的替换、覆盖**。此替换或覆盖即为**方法引用**

**注意**

-   此方法b是非静态（不含static修饰）方法，需要对象调用

**使用场景**

如果某个Lambda表达式只是想调用一个实例方法，并且前后参数的形式一致，就可以使用实例方法引用。

```java
/**
 * 方法引用
 */
public class MethodRefTest {

    /**
     * 情况一：对象 :: 实例方法（实例方法引用）
     */
    @Test
    public void test1() {
        // 1.匿名内部类
        Consumer<String> con = new Consumer<String>() {
            @Override
            public void accept(String s) {
                System.out.println(s);
            }
        };
        con.accept("hello world");

        System.out.println("--------------");
        // 2.Lambda表达式
        Consumer<String> con2 = s -> System.out.println(s);
        con2.accept("hello world");

        System.out.println("--------------");
        // 3.方法引用
//        PrintStream ps = System.out;
//        Consumer<String> con3 = ps::println;
        Consumer<String> con3 = System.out::println;  // 对象名::实例方法
        con3.accept("hello world");
    }

    /**
     * Supplier中的get方法
     * Employee中的String getName方法
     */
    @Test
    public void test2() {
        Employee emp = new Employee(1001, "马化腾", 34, 6000.38);
        // 1.匿名内部类
        Supplier<String> sup1 = new Supplier<String>() {
            @Override
            public String get() {
                return emp.getName();
            }
        };
        System.out.println(sup1.get());

        System.out.println("--------------");
        // 2.Lambda表达式
        Supplier<String> sup2 = ()->emp.getName();
        System.out.println(sup2.get());

        System.out.println("--------------");
        // 3.方法引用
        // Supplier的抽象方法get与emp对象的getName方法的形参列表与返回值类型一致
        // 因此使用getName方法替换get
        Supplier<String> sup3 = emp::getName;
        System.out.println(sup3.get());
    }
}
```



#### 2 静态方法引用

基本格式

```
类 :: 静态方法
```

**要求**

-   函数式接口中的**抽象方法a与其内部实现时调用的对象的某个静态方法b的形参列表和返回值类型都相同（一致）**
-   此时，可以**考虑使用方法b对方法a的替换、覆盖**。此替换或覆盖即为**方法引用**

**注意**

-   此方法b是静态（static修饰）方法，需要类调用

**使用场景**

-   如果某个Lambda表达式里只是调用一个静态方法，并且前后参数的形式一致，就可以使用静态方法引用。

```java
/**
 * 方法引用
 */
public class MethodRefTest2 {

    /**
     * 情况二：类 :: 静态方法（静态方法引用）
     * Comparator中的 int compare(T o1, T o2)
     * Integer中的 int compare(int x, int y)
     */
    @Test
    public void test1() {
        // 1.匿名内部类
        Comparator<Integer> com1 = new Comparator<Integer>() {
            @Override
            public int compare(Integer o1, Integer o2) {
                return Integer.compare(o1, o2);
            }
        };
        System.out.println(com1.compare(12, 21));

        System.out.println("--------------");
        // 2.Lambda表达式简化
        Comparator<Integer> com2 = (o1, o2) -> Integer.compare(o1, o2);
        System.out.println(com2.compare(12, 21))
        ;
        System.out.println("--------------");
        // 3.方法引用简化
        Comparator<Integer> com3 = Integer::compare;  // 类::静态方法
        System.out.println(com3.compare(34, 34));
    }

    /**
     * Function中的 R apply(T t)
     * Math在的 long round(double a)
     */
    @Test
    public void test2() {
        // 1.匿名内部类
        Function<Double, Long> fun1 = new Function<Double, Long>() {
            @Override
            public Long apply(Double aDouble) {
                return Math.round(aDouble);
            }
        };
        System.out.println(fun1.apply(2.0));

        System.out.println("--------------");
        // 2.Lambda表达式
        Function<Double, Long> fun2 = (aDouble) -> Math.round(aDouble);

        System.out.println("--------------");
        // 3.方法引用
        // Function的抽象方法apply与Math类的静态方法round的形参列表与返回值类型一致
        // 因此使用round方法替换apply
        Function<Double, Long> fun3 = Math::round;  // 类::静态方法
    }
}
```

#### 3 类 :: 实例方法 （难点）

**要求**

-   函数式接口中的**抽象方法a与其内部实现时调用的对象的某个方法b的形参列表和返回值类型都相同（一致）**
-   同时，抽象方法a中有n个参数，方法b有n-1个参数，且**抽象方法a**的**第一个参数作为方法b的调用者**，且**抽象方法a的后n-1个参数与方法b的n-1个参数的类型相同（一致）**。
-   则此时，可以**考虑使用方法b对方法a的替换、覆盖**。此替换或覆盖即为**方法引用**

**注意**

-   此**方法b是非静态（不含static修饰）方法**，需要对象调用，但**形式上，写成对象a所属的类来调用**

**使用场景**

-   如果某个Lambda表达式里只是想调用一个实例方法，并且前面参数列表的**第一个参数作为方法的主调**，**后面所有的参数都是作为改实例方法的入参**，则就可以使用特定类型的方法引用。

```java
/**
 * 方法引用
 */
public class MethodRefTest3 {

    /**
     * 情况二：类 :: 实例方法（难点）
     *      todo 本质上依然是对象来调用实例方法
     * Comparator中的int compare(T o1, T o2)
     * String中的int t1.compareTo(t2)
     */
    @Test
    public void test1() {
        // 1.匿名内部类
        Comparator<String> com1 = new Comparator<String>() {
            @Override
            public int compare(String o1, String o2) {
                return o1.compareTo(o2);
            }
        };
        System.out.println(com1.compare("abc","abd"));
        System.out.println("--------------");

        // 2.Lambda表达式
        Comparator<String> com2 = (o1,o2)->o1.compareTo(o2);
        System.out.println(com2.compare("abc","abd"));
        System.out.println("--------------");

        // 3.方法引用
        Comparator<String> com3 = String::compareTo;  // 类（特定类型）::实例方法
        System.out.println(com3.compare("abc","abd"));
    }

    /**
     * BiPredicate中的boolean test(T t, U u)
     * String中的boolean s1.equals(s2)
     */
    @Test
    public void test2() {
        // 1.匿名内部类
        BiPredicate<String,String> biPre1 = new BiPredicate<String, String>() {
            @Override
            public boolean test(String s1, String s2) {
                return s1.equals(s2);
            }
        };
        System.out.println("--------------");

        // 2.Lambda表达式
        BiPredicate<String,String> biPre2 = (S1,S2)->S1.equals(S2);
        System.out.println("--------------");

        // 3.方法引用
        // BiPredicate的抽象方法test与String类的实例方法equals的形参列表与返回值类型一致
        // 且抽象方法test第一个参数作为实例方法equals的调用者
        // 因此使用equals方法替换test
        BiPredicate<String,String> biPre3 = String::equals;
        System.out.println(biPre3.test("abc","abd"));
    }


    /**
     * Function中的R apply(T t)
     * Employee中的String getName方法
     */
    @Test
    public void test3() {
        Employee emp = new Employee(1001, "马化腾", 34, 6000.38);
        // 1.匿名内部类
        Function<Employee,String> fun1 = new Function<Employee, String>() {
            @Override
            public String apply(Employee employee) {
                return employee.getName();
            }
        };
        System.out.println(fun1.apply(emp));
        System.out.println("--------------");

        // 2.Lambda表达式
        Function<Employee,String> fun2 = employee-> employee.getName();
        System.out.println("--------------");

        // 3.方法引用
        // Function的抽象方法apply与Employee类的实例方法getName的形参列表与返回值类型一致
        // 且抽象方法apply第一个参数作为实例方法getName的调用者
        // 因此使用getName方法替换apply
        Function<Employee,String> fun3 = Employee::getName;
        System.out.println(fun3.apply(emp));
    }
}
```



### 构造器引用

当 Lambda 表达式是创建一个对象，并且满足 Lambda 表达式形参，正好是给创建这个对象的构造器的实参列表，就可以使用构造器引用

**说明**

-   调用了类名对应的类中的某一个确定的构造器
-   **具体调用的是类中的哪一个构造器这取决于函数式接口的抽象方法的形参列表**

格式

```java
类名 :: new
```

**使用场景**

-   如果某个Lambda表达式里只是在创建对象，并且前后参数情况一致，就可以使用构造器引用。

```java
public class ConstructorRefTest {
    /**
     * 构造器引用
     * Supplier中的T get()
     */
    @Test
    public void test1(){
        // 1.匿名内部类
        Supplier<Employee> sup1 = new Supplier<Employee>() {
            @Override
            public Employee get() {
                return new Employee();
            }
        };
        System.out.println(sup1.get());
        System.out.println("--------------");

        // 2.构造器引用
        Supplier<Employee> sup2 = Employee::new;   // 调用的是Employee类中空参的构造器
        System.out.println(sup2.get());
    }

    /**
     * Function中的R apply(T t)
     */
    @Test
    public void test2(){
        // 1.匿名内部类
        Function<Integer,Employee> fun1 = new Function<Integer, Employee>() {
            @Override
            public Employee apply(Integer id) {
                return new Employee(id);
            }
        };
        System.out.println(fun1.apply(18));
        System.out.println("--------------");

        // 2.构造器引用
        Function<Integer,Employee> fun2 = Employee::new;  // 调用的是Employee类中参数是Integer/int类型的构造器
        System.out.println(fun2.apply(18));
    }

    /**
     * BiFunction中的R apply(T t, U u);
     */
    @Test
    public void test3(){
        // 1.匿名内部类
        BiFunction<Integer,String,Employee> fun1 = new BiFunction<Integer, String, Employee>() {
            @Override
            public Employee apply(Integer id, String name) {
                return new Employee(id,name);
            }
        };
        System.out.println(fun1.apply(18,"kk"));
        System.out.println("--------------");

        // 2.构造器引用
        BiFunction<Integer,String,Employee> fun2 = Employee::new;  // 调用的是Employee类中参数是Integer/int、String类型的构造器
        System.out.println(fun2.apply(18,"kk"));
    }

}
```



### 数组引用

当 Lambda 表达式是创建一个数组对象，并且满足 Lambda 表达式形参，正好是给创建这个数组对象的长度，就可以数组构造引用

格式

```
数组类型名[] :: new
```

```java
/**
     * 数组引用
     * Function中的R apply(T t)
     */
    @Test
    public void test1(){
        // 1.匿名内部类
       Function<Integer,Employee[]> fun1 = new Function<Integer, Employee[]>() {
           @Override
           public Employee[] apply(Integer length) {
               return new Employee[length];
           }
       };
        System.out.println(fun1.apply(10));
        System.out.println("--------------");

        // 2.数组引用
        Function<Integer,Employee[]> fun2 = Employee[]::new;
        System.out.println(fun2.apply(10));

    }
```

## Java8新特性—Stream

Java8中有两个最强的的改变。一个是Lambda表达式，另一个是Stream

Stream API（java.util.stream）把真正的函数式编程风格引入到Java中，是目前为止**对Java类库最好的补充**

Stream是Java8中处理集合的关键抽象概念，它可以对集合的数据进行操作，可以执行非常复杂的查找、过滤和映射数据等操作。使用Stream API对集合进行操作，就类似于使用SQL执行的数据库查询。

:::tip
Scala 早于 Java 支持 匿名函数 和 函数作为一等公民（如 `(a: String, b: String) => a.length - b.length`），Lambda 表达式的设计直接参考了 Scala 的函数语法。
:::

### 什么是流？

Stream 是数据渠道，用于操作数据源（集合、数组等）所生成的元素序列。 

Stream 和 Collection 集合的区别：**Collection 是一种静态的内存数据结构， 讲的是数据，而 Stream 是有关计算的，讲的是计算。**前者是主要面向内存，存储在内存中，后者主要是面向 CPU，通过 CPU 实现计算

流表面上看来去和集合很类似，都可以让我们转换和获取数据。但是他们之间存在着显著的差距：

-   **Stream 流并不存储数据。**这些元素可能存储在底层的集合中，或者是按需生成的。
-   **Stream 流操作不会修改其数据源。**例如，filter方法不会从流中移除元素，**而是会生成一个新的流**，其中不包含过滤掉的元素。
-   **流的操作是尽可能的惰性执行的。**这意味着直至需要其结果时，操作才会执行（即 一旦执行终止操作，就执行中间操作链，并产生结果。）。例如，如果我们只想查找前5个长单词而不是所以长单词，那么filter方法就会在匹配第5个单词后停止过滤。由此，我们甚至可以操作无限流。
-   Stream 流一旦执行了终止操作，就不能调用其他中间操作或终止操作了



### 操作流的典型流程

1.  **创建一个流** 一个数据源（如：集合、数组），获取一个流

2.  **中间操作**（指定将初始流转换为其他流，可能包含很多步骤，即中间操作的方法 

    返回值仍然是 Stream 类型的对象。因此中间操作可以是个**操作链**，可对数据源 

    的数据进行 n 次处理，但是在终结操作前，并不会真正执行）

3.  **终止操作**。（这个操作会强制执行之前的惰性操作，之后这个流就不能再用了）



### 创建 Stream

演示数据准备

```java
public class Employee {
    private int id;
    private String name;
    private int age;
    private double salary;

  	// 省略无参、满惨、getter、setter、toString方法

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Employee employee = (Employee) o;
        return id == employee.id && age == employee.age && Double.compare(employee.salary, salary) == 0 && Objects.equals(name, employee.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, age, salary);
    }
}

public class EmployeeData {
    public static List<Employee> getEmployees() {
        List<Employee> list = new ArrayList<>();

        list.add(new Employee(1001, "马化腾", 34, 6000.38));
        list.add(new Employee(1002, "马云", 2, 9876.12));
        list.add(new Employee(1003, "刘强东", 33, 3000.82));
        list.add(new Employee(1004, "雷军", 26, 7657.37));
        list.add(new Employee(1005, "李彦宏", 65, 5555.32));
        list.add(new Employee(1006, "比尔盖茨", 42, 9500.43));
        list.add(new Employee(1007, "任正非", 26, 4333.32));
        list.add(new Employee(1008, "扎克伯格", 35, 2500.32));

        return list;
    }
}
```

**方式一：通过集合**

Java8 中的 Collection 接口被扩展，提供了两个获取流的方法：

```java
java.util.Collection 

// 可将任何集合转化为流
default Stream<E> stream()		// 返回一个顺序流

default Stream<E> parallelStream()		// 返回一个并行流
```

```java
// 创建Stream方式一：通过集合
    @Test
    public void test1(){
        List<Employee> list = EmployeeData.getEmployees();
        // default Stream<E> stream() 返回一个顺序流
        Stream<Employee> stream = list.stream();
        // default Stream<E> parallelStream() 返回一个并行流
        Stream<Employee> stream1 = list.parallelStream();

        System.out.println(stream);
        System.out.println(stream1);
    }
```

**方式二：通过数组**

Java8 中的 Arrays 的静态方法 stream() 可以获取数组流：

```java
java.util.Arrays

public static <T> Stream<T> stream(T[] array)
// 产生一个流，它的元素是由数组中指定范围内的元素构成
public static <T> Stream<T> stream(T[] array, int startInclusive, int endExclusive)
    
public static IntStream stream(int[] array) 
public static IntStream stream(int[] array, int startInclusive, int endExclusive) 

public static LongStream stream(long[] array)
public static LongStream stream(long[] array, int startInclusive, int endExclusive)
    
public static DoubleStream stream(double[] array)
public static DoubleStream stream(double[] array, int startInclusive, int endExclusive)

```

```java
// 创建Stream方式二：通过数组
    @Test
    public void test2(){
        Integer[] arr = new Integer[]{1,2,3,4,5};
        // 调用Arrays类的public static <T> Stream<T> stream(T[] array)
        Stream<Integer> stream = Arrays.stream(arr);
        System.out.println(stream);
    }
```

**方式三：通过Stream的of()**

可以调用 Stream 类静态方法 of(), 通过显示值创建一个流。它可以接收任意数量的参数。

```java
java.util.stream.Stream

public static<T> Stream<T> of(T t) 
public static<T> Stream<T> of(T... values)
    
```

```java
// 创建Stream方式三：通过Stream的of()
    @Test
    public void test3(){
        Integer[] arr = new Integer[]{1,2,3,4,5};
        // 调用Stream类的public static<T> Stream<T> of(T... values)
        Stream<Integer> stream = Stream.of(1, 2, 3, 4, 5);
        System.out.println(stream);
    }
```

**方式四：通过Stream的emty()**创建空流

可以调用 Stream 类静态方法 empty(), 创建一个空流（不包含任何元素的流）

```java
java.util.stream.Stream

public static<T> Stream<T> empty()
```

```java
// 创建Stream方式四：通过Stream的 emty()创建空流
    @Test
    public void test4(){
        Stream<Object> stream = Stream.empty();
        System.out.println(stream);
    }
```

**方式五：创建无限流**

Stream接口有两个静态方法用于创建无限流，

```java
java.util.stream.Stream

public static<T> Stream<T> generate(Supplier<T> s)	// 接收一个不包含任何引元的函数（即是一个Supplier<T>接口的对象）

public static<T> Stream<T> iterate(final T seed, final UnaryOperator<T> f)	// 创建一个无限流，它的元素包含种子、在种子上调用产生的值、在前一个元素上调用f产生的值
```

```java
Strem<String> echos = Stream.generate(() -> "Echo");  // 获取一个常量值的流
Strem<Double> randoms = Stream.generate(Math::random);	// 获取一个随机数的流
```

```java
// 创建Stream方式五：创建无限流
    @Test
    public void test5() {
        // 迭代
        // public static<T> Stream<T> iterate(final T seed, final UnaryOperator<T> f)
        Stream<Integer> stream = Stream.iterate(0, x -> x + 2);
        stream.limit(10).forEach(System.out::println);
        // 生成
        // public static<T> Stream<T> generate(Supplier<T> s)
        Stream<Double> stream1 = Stream.generate(Math::random);
        stream1.limit(10).forEach(System.out::println);
    }
```

方式六：创建非常短的流

```

```



### 一些列中间操作

多个中间操作可以连接起来形成一个流水线，除**非流水线上触发终止操作，否则中间操作不会执行任何的处理**！而在终止操作时一次性全部处理，称为**惰性求值**。

#### 1 筛选与切片

```java
// 接收Lambda,从流中排除某些元素
Stream<T> filter(Predicate<? super T> predicate)
    
// 筛选，通过流所生成元素的 hashCode()和equals()去除重复元素 
Stream<T> distinct()

// 截断流，使其元素不超过给定的数量
Stream<T> limit(long maxSize)

// 跳过元素，返回一个扔掉了前n个元素的流，若流中元素不足n个，则返回空流 
// 与limit互补
Stream<T> skip(long n)
```

```java
// 1.筛选与切片
    @Test
    public void test1(){
        // 查询员工表薪资大于7000的员工信息
        List<Employee> list = EmployeeData.getEmployees();
        Stream<Employee> stream = list.stream();
        // Stream<T> filter(Predicate<? super T> predicate)
        stream.filter(emp -> emp.getSalary()>7000).forEach(System.out::println);
        /**
         * 结果
         * Employee{id=1002, name='马云', age=2, salary=9876.12}
         * Employee{id=1004, name='雷军', age=26, salary=7657.37}
         * Employee{id=1006, name='比尔盖茨', age=42, salary=9500.43}
         */
        // 报错IllegalStateException.因为流已经执行了终止操作 foreach
        // stream.limit(2).forEach(System.out::println);

        // Stream<T> limit(long maxSize)
        list.stream().limit(3).forEach(System.out::println);
        /**
         * 结果
         * Employee{id=1001, name='马化腾', age=34, salary=6000.38}
         * Employee{id=1002, name='马云', age=2, salary=9876.12}
         * Employee{id=1003, name='刘强东', age=33, salary=3000.82}
         */

        // Stream<T> skip(long n)
        list.stream().skip(9).forEach(System.out::println);

        // Stream<T> distinct()
        list.add(new Employee(1009,"马斯克",40,12550.32));
        list.add(new Employee(1009,"马斯克",40,12550.32));
        list.stream().distinct().forEach(System.out::println);
        /**
         * 结果
         * Employee{id=1001, name='马化腾', age=34, salary=6000.38}
         * Employee{id=1002, name='马云', age=2, salary=9876.12}
         * Employee{id=1003, name='刘强东', age=33, salary=3000.82}
         * Employee{id=1004, name='雷军', age=26, salary=7657.37}
         * Employee{id=1005, name='李彦宏', age=65, salary=5555.32}
         * Employee{id=1006, name='比尔盖茨', age=42, salary=9500.43}
         * Employee{id=1007, name='任正非', age=26, salary=4333.32}
         * Employee{id=1008, name='扎克伯格', age=35, salary=2500.32}
         * Employee{id=1009, name='马斯克', age=40, salary=12550.32}
         */
    }
```



#### 2 映射

```java
// 接收一个函数作为参数，该函数会被应用到每个元素上，并将其映射成一个新的元素
<R> Stream<R> map(Function<? super T, ? extends R> mapper)

IntStream mapToInt(ToIntFunction<? super T> mapper)  // 产生一个新的IntStream

LongStream mapToLong(ToLongFunction<? super T> mapper)  // 产生一个新的LongStream

DoubleStream mapToDouble(ToDoubleFunction<? super T> mapper)  // 产生一个新的DoubleStream

// 接收一个函数作为参数，将流中的每个值都换成另一个流，然后把所有流连接成一个流
<R> Stream<R> flatMap(Function<? super T, ? extends Stream<? extends R>> mapper)

IntStream flatMapToInt(Function<? super T, ? extends IntStream> mapper)

LongStream flatMapToLong(Function<? super T, ? extends LongStream> mapper)

DoubleStream flatMapToDouble(Function<? super T, ? extends DoubleStream> mapper)
```

```java
// 2.映射
    @Test
    public void test2() {
        // 小写转大写
        List<String> list = Arrays.asList("aa", "bb", "cc", "dd");
        // 方式一
        list.stream().map(str -> str.toUpperCase()).forEach(System.out::printf);
        // 方式二
        list.stream().map(String::toUpperCase).forEach(System.out::printf);
        /**
         * 结果
         * AABBCCDD
         */

        // 获取员工姓名大于3的员工
        List<Employee> employeeList = EmployeeData.getEmployees();
        employeeList.stream().filter(emp -> emp.getName().length() > 3).forEach(System.out::println);
        /**
         * 结果
         * Employee{id=1006, name='比尔盖茨', age=42, salary=9500.43}
         * Employee{id=1008, name='扎克伯格', age=35, salary=2500.32}
         */

        // 获取员工姓名大于3的员工的姓名
        // 方式一
        employeeList.stream().filter(emp -> emp.getName().length() > 3)
                .map(emp -> emp.getName()).forEach(System.out::println);
        // 方式二
        employeeList.stream().map(emp -> emp.getName()).filter(name -> name.length() > 3)
                .forEach(System.out::println);
        // 方式三
        employeeList.stream().map(Employee::getName).filter(name -> name.length() > 3)
                .forEach(System.out::println);
        /**
         * 结果
         * 比尔盖茨
         * 扎克伯格
         */
    }
```



#### 3 排序

```java
// 产生一个新流，其中按自然顺序排序
Stream<T> sorted()

// 产生一个新流，其中按比较器顺序排序
Stream<T> sorted(Comparator<? super T> comparator)
```

```java
// 3.排序
    @Test
    public void test3() {
        // sorted 自然排序
        Integer[] arr = new Integer[]{10, 6, 7, 5, 4, 8, 3, 2, 1, 9};
        Arrays.stream(arr).sorted().forEach(System.out::println);
        /**
         * 结果
         * 1
         * 2
         * 3
         * 4
         * 5
         * 6
         * 7
         * 8
         * 9
         * 10
         */
        System.out.println(Arrays.toString(arr));
        /**
         * 结果  Stream 流操作不会修改其数据源。
         * [10, 6, 7, 5, 4, 8, 3, 2, 1, 9]
         */

        // 因为Employee没有实现Comparable接口，所以报错 ClassCastException
        // List<Employee> list = EmployeeData.getEmployees();
        // list.stream().sorted().forEach(System.out::println);

        // Stream<T> sorted(Comparator<? super T> comparator)
        // 自定义排序
        List<Employee> list = EmployeeData.getEmployees();
                    // 根据年龄大小升序排序
        list.stream().sorted((o1, o2) -> o1.getAge() - o2.getAge())
        .forEach(System.out::println);

        // 根据字符串大小排序
        String[] arr2 = new String[]{"bb","aa","cc","ff","dd","ee"};
        // 方式一
        Arrays.stream(arr2).sorted((s1,s2)->s1.compareTo(s2)).forEach(System.out::printf);
        // 方式二
        Arrays.stream(arr2).sorted(String::compareTo).forEach(System.out::printf);
        /**
         * 结果
         * aabbccddeeff
         */
    }
```



### 终止操作

终端操作会从流的流水线生成结果。其结果可以是任何不是流的值，例如：List、 Integer，甚至是 void 。 

流进行了终止操作后，不能再次使用。

#### 1 匹配与查找

```java
// 检测是否至少匹配一个元素
boolean anyMatch(Predicate<? super T> predicate)

// 检测是否匹配所有元素
boolean allMatch(Predicate<? super T> predicate)

// 检查是否没有匹配所有元素
boolean noneMatch(Predicate<? super T> predicate)

// 返回第一个元素
Optional<T> findFirst()
   
// 返回当前流中的任意元素    
Optional<T> findAny()

// 返回流中元素总数    
long count()
    
// 返回流中最大值
Optional<T> max(Comparator<? super T> comparator)
    
// 返回流中最小值  
Optional<T> min(Comparator<? super T> comparator)
    
// 内部迭代(使用 Collection 接口需要用户去做迭代，称为外部迭代。
// 相反，Stream API 使用内部迭代——它帮你把迭代做了   
void forEach(Consumer<? super T> action)

void forEachOrdered(Consumer<? super T> action)
```

```java
// 1.查找与匹配
    @Test
    public void test1() {
        // 是否所有员工的年龄都大于18
        List<Employee> list = EmployeeData.getEmployees();
        // allMatch 检查是否匹配所有元素
        System.out.println(list.stream().allMatch(emp -> emp.getAge() > 18));

        // 是否存在员工的工资大于10000
        // anyMatch 检查是否至少匹配一个元素
        System.out.println(list.stream().anyMatch(emp -> emp.getSalary() > 10000));

        // 返回第一个元素
        System.out.println(list.stream().findFirst().get());

        // 返回流中总元素的个数
        System.out.println(list.stream().count());

        // 返回最高工资的员工
        // Optional<T> max(Comparator<? super T> comparator)
        System.out.println(list.stream().max((e1, e2) -> Double.compare(e1.getSalary(), e2.getSalary())));
        /**
         * 结果
         * Optional[Employee{id=1002, name='马云', age=2, salary=9876.12}]
         */

        // 返回最高的工资
        System.out.println(list.stream().max((e1, e2) -> Double.compare(e1.getSalary(), e2.getSalary()))
        .get().getSalary());
        /**
         * 结果
         * 9876.12
         */

        // 返回流中最小值，（最低工资的员工）
        System.out.println(list.stream().min((e1, e2) -> Double.compare(e1.getSalary(), e2.getSalary())));
        /**
         * 结果
         * Optional[Employee{id=1008, name='扎克伯格', age=35, salary=2500.32}]
         */
        
        // void forEach(Consumer<? super T> action) 内部迭代
        list.stream().forEach(System.out::println);
        
         // 针对集合，jdk8新增的遍历方法
        list.forEach(System.out::println);
    }
```



#### 2 规约



```java
// 可以将流中元素反复结合起来，得到一个值。返回 T
T reduce(T identity, BinaryOperator<T> accumulator)

// 可以将流中元素反复结合起来，得到一个值。返回 Optional
Optional<T> reduce(BinaryOperator<T> accumulator)

<U> U reduce(U identity,
                 BiFunction<U, ? super T, U> accumulator,
                 BinaryOperator<U> combiner)
```

```java
// 2.归约
    @Test
    public void test2() {
        // 计算1-10的自然是的和
        List<Integer> list = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        // T reduce(T identity, BinaryOperator<T> accumulator)
        //      可以将流中数据反复结合（两两结合）起来，得到一个值，返回T
        System.out.println(list.stream().reduce(0, (x1, x2) -> x1 + x2));  // 55
        System.out.println(list.stream().reduce(0, (x1, x2) -> Integer.sum(x1, x2)));
        System.out.println(list.stream().reduce(0, Integer::sum));
        System.out.println(list.stream().reduce(10, (x1, x2) -> x1 + x2));  // 65

        // 计算公司所有员工工资总和
        List<Employee> employees = EmployeeData.getEmployees();
        System.out.println(employees.stream().map(emp -> emp.getSalary())
                .reduce((salary1, salary2) -> Double.sum(salary1, salary2)));  // Optional[48424.08]
    }
```



#### 3 收集

```java
//将流转换为其他形式。接收一个 Collector 接口的实现，
// 用于给 Stream 中元素做汇总的方法
<R, A> R collect(Collector<? super T, A, R> collector)
```

```java
// 3.收集
    @Test
    public void test3() {
        List<Employee> list = EmployeeData.getEmployees();
        // 查询工资大于6000的员工，结果返回一个List或Set
        List<Employee> list1 = list.stream().filter(emp -> emp.getSalary() > 6000).collect(Collectors.toList());
        System.out.println(list1);

        // 按照员工的年龄进行排序，返回到一个新的List中
        List<Employee> list2 = list.stream().sorted((e1, e2) -> Integer.compare(e1.getAge(), e2.getAge()))
                .collect(Collectors.toList());
        System.out.println(list2);
    }
```

另外， Collectors 实用类提供了很多静态方法，可以方便地创建常见收集器实例，具体方法与实例如下

```java
// 把流中元素收集到 List
public static <T> 
	Collector<T, ?, List<T>> toList()
    
// 把流中元素收集到 Set
public static <T>
    Collector<T, ?, Set<T>> toSet()

// 把流中元素收集到创建的集合
public static <T, C extends Collection<T>>
    Collector<T, ?, C> toCollection(Supplier<C> collectionFactory) 
   
// 计算流中元素的个数
public static <T> Collector<T, ?, Long>
    counting() 
    
// 对流中元素的整数属性求和
public static <T> Collector<T, ?, Integer>
    summingInt(ToIntFunction<? super T> mapper)
    
// 计算流中元素 Integer 属性的平均值
public static <T> Collector<T, ?, Double>
    averagingInt(ToIntFunction<? super T> mapper)
   
// 收集流中 Integer 属性的统计值。如：平均值
public static <T>
    Collector<T, ?, IntSummaryStatistics> summarizingInt(ToIntFunction<? super T> mapper)
    

// 连接流中每个字符串
public static Collector<CharSequence, ?, String> joining()
    
// 根据比较器选择最大值
public static <T> Collector<T, ?, Optional<T>>
    maxBy(Comparator<? super T> comparator)

// 根据比较器选择最小值
public static <T> Collector<T, ?, Optional<T>>
    minBy(Comparator<? super T> comparator)
    
// 从一个作为累加器的初始值开始，利用BinaryOperator 与流中元素逐个结合，从而归约成单个值
public static <T> Collector<T, ?, T>
    reducing(T identity, BinaryOperator<T> op)
    
// 包裹另一个收集器，对其结果转换函数
public static<T,A,R,RR> Collector<T,A,RR> collectingAndThen(Collector<T,A,R> downstream,
                                                                Function<R,RR> finisher)
    
// 根据某属性值对流分组，属性为K，结果为 V
 public static <T, K> Collector<T, ?, Map<K, List<T>>>
    groupingBy(Function<? super T, ? extends K> classifier)
    
// 根据 true 或 false 进行分区
public static <T>
    Collector<T, ?, Map<Boolean, List<T>>> partitioningBy(Predicate<? super T> predicate)
```

