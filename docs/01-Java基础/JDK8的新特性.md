# JDK8的新特性

## Java8新增了哪些新特性？

-   接口的默认方法和静态方法
    -   默认方法：接口中可以定义默认方法，子类可以选择性地重写这些方法。
    -   静态方法：接口中可以定义静态方法，可以直接通过接口调用。
-   新的日期和时间API：java8引入了`java.time`包，提供了更丰富的日期和时间处理功能。
-   Option类：Option类用于表示可能为null的值，避免空指针异常。
-   函数式接口：函数式接口是只有一个抽象方法的接口，可以用`@FunctionalInterface`注解标记。函数式接口的变量可以采用Lambda表达式进行赋值。
-   Lambda表达式：Lambda表达式允许你将函数作为参数传递。
-   方法引用：方法引用允许你直接引用已有的方法或构造器，而无需显式地创建Lambda表达式。
-   移除PermGen空间：Java8移除了PermGen（永久代）空间，取而代之的是Metaspace（元空间）

## 接口中的默认方法和静态方法

在jdk8之前，interface之中可以定义变量和方法，**变量必须是`public`、`static`、`final`的**，**方法必须是`public`、`abstract`的**，由于这些修饰符都是默认的，所以在书写的时候可以省略不写。

-   接口定义方法：public  abstract —— 需要子类实现

-   接口定义变量：public、static、final （记住，接口中的变量必须初始化）

在JDK 1.8开始 支持使用`static`和`default` 修饰 可以写方法体，不需要子类重写（可以选择性的重写）。

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



## Option



## HashMap底层数据结构的改变



## 日期类



## CompletableFuture



## Lambda

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

注意：

​	Lamdba表达式只能简化**函数式接口的匿名内部类**的写法形式（换句话说，Lambda是实现函数式接口的一种语法糖）

**函数式接口**（jdk8新特性）

-   必须是接口
-   接口中只有一个抽象方法（接口中可以有多个static方法、default方法，但只能有一个抽象方法）
-   一般可以加上**@FunctionalInterface**注解，来声明这是函数式接口

>   Lambda表达式基本作用？
>
>   -   简化函数式接口的匿名内部类的写法
>
>   Lambda表达式使用要注意什么？
>
>   -   必须是接口的单接口匿名内部类
>
>   Lambda表达式该何时使用？
>
>   -   需要作为接口的实现类对象时使用
>
>   Lambda表达式的好处
>
>   -   Lambda是一个匿名函数，我们可以把Lambda表达式理解为是一段可以传递的代码（即，**Lambda表达式可以被用作参数传递或返回值**），它可以写出更简洁、更灵活的代码，同时使代码风格更加紧凑，**使Java语言表达能力得到了提升**
>
>   **Lambda表达式的本质：**
>
>   -   一方面，Lambda表达式作为接口的实现类对象。
>   -   另一方面，Lambda表达式是一个匿名函数



## 函数式接口

**什么是函数式接口**

-   **接口中只声明一个抽象方法**（Single Abstract Method，简称 SAM）的接口，称为函数式接口。
    -   当然该接口可以包含其他非抽象方法（例如，可以有static方法、default方法）。 
-   你**可以通过 Lambda 表达式来创建该接口的对象**。（若 Lambda 表达式抛出一个受检异常(即非运行时异常)，那么该异常需要在目标接口的抽象方法上进行声明）。  
-   我们**可以在一个接口上使用 `@FunctionalInterface` 注解**，这样做**可以检查它是否是一个函数式接口**。同时 javadoc 也会包含一条声明，说明这个接口是一个函数式接口。  
-   在 `java.util.function` 包下定义了 Java 8 的丰富的函数式接口

**对函数式接口的理解**

-   Java 从诞生日起就是一直倡导**一切皆对象**，在 Java 里面面向对象(OOP)编程是一切。但是随着 python、scala 等语言的兴起和新技术的挑战，Java 不得不做出调整以便支持更加广泛的技术要求，即 Java 不但可以支持 OOP 还可以支持 OOF（面向函数编程）
    -   Java8 引入了 Lambda 表达式之后，Java 也开始支持函数式编程。
    -   Lambda 表达式不是 Java 最早使用的。目前 C++，C#，Python，Scala 等
        均支持 Lambda 表达式。
-   面向对象的思想：
    -   做一件事情，找一个能解决这个事情的对象，调用对象的方法，完成事情。
-   函数式编程思想：
    -   只要能获取到结果，谁去做的，怎么做的都不重要，重视的是结果，不重视过程。
-   在函数式编程语言当中，函数被当做一等公民对待。在将函数作为一等公民的编程语言中，Lambda 表达式的类型是函数。但是在 Java8 中，有所不同。在 Java8 中，Lambda 表达式是对象，而不是函数，它们必须依附于一类特别的对象类型——函数式接口。
-   简单的说，**在 Java8 中，Lambda 表达式就是一个函数式接口的实例。**这就是 Lambda表达式和函数式接口的关系。也就是说，**只要一个对象是函数式接口的实例，那么该对象就可以用 Lambda 表达式来表示。**

**核心函数式接口**

| 称谓       | 函数式接口      | 抽象方法                | 抽象方法特点          |
| ---------- | --------------- | ----------------------- | --------------------- |
| 任务型接口 | Runable         | void run()              | 无参无返回值          |
| 消费型接口 | Consumer\<T>    | void accept(T t)        | 有参无返回值          |
| 供给型接口 | Supplier\<T>    | T get()                 | 无参有返回值          |
| 函数型接口 | Function\<T, R> | R apply(T t)            | 有参有返回值          |
| 判断型接口 | Predicate\<T>   | boolean test(T t)       | 有参有返回值，boolean |
| 比较型接口 | Comparator\<T>  | int compare(T t1, T t2) | 有参有返回值，int     |


## 方法引用

方法引用是 Java 8 引入的一种简洁语法，用于直接引用已有方法或构造函数，而无需显式地使用 Lambda 表达式。它使得代码更加简洁和易读。

简单来说：

-   方法引用，可以看做是基于Lambda表达式的进一步刻画。
-   当需要提供一个函数式接口的实例时，我们可以使用lambda表达式提供此实例。
-   **当满足一定的条件的情况下，我们还可以使用方法引用或构造器引用替换lambda表达式**

方法引用的本质：

​	**方法引用作为了函数式接口的实例。** ===> 体现了 ”万物皆对象“



方法引用主要有以下几类：

-   静态方法引用
    -   引用类的静态方法。
    -   格式：ClassName::staticMethodName

-   实例方法引用
    -   引用某个对象的实例方法。
    -   格式：objectReference::instanceMethodName

-   特定类型的任意对象的实例方法引用（类::实例方法）
    -   引用某个类型的所有实例共有的方法（即该类型所有对象都可以调用的方法）。
    -   格式：ClassName::instanceMethodName
-   构造器引用
    -   引用类的构造方法来创建新对象。
    -   格式：ClassName::new

### **静态方法引用**

**要求**

-   函数式接口中的**抽象方法a与其内部实现时调用的对象的某个静态方法b的形参列表和返回值类型都相同（一致）**
-   此时，可以**考虑使用方法b对方法a的替换、覆盖**。此替换或覆盖即为**方法引用**

**注意**

-   此方法b是静态（static修饰）方法，需要类调用

**使用场景**

-   如果某个Lambda表达式里只是调用一个静态方法，并且前后参数的形式一致，就可以使用静态方法引用

```java
public class MethodRefTest {

    /**
     * 类 :: 静态方法（静态方法引用）
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



### **实例方法引用**

**要求**

-   函数式接口中的**抽象方法a与其内部实现时调用的对象的某个方法b的形参列表和返回值类型都相同（一致）**
-   此时，可以**考虑使用方法b对方法a的替换、覆盖**。此替换或覆盖即为**方法引用**

**注意**

-   此方法b是非静态（不含static修饰）方法，需要对象调用

**使用场景**

如果某个Lambda表达式只是想调用一个实例方法，并且前后参数的形式一致，就可以使用实例方法引用

```java
public class MethodRefTest {

    /**
     * 对象 :: 实例方法（实例方法引用）
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

### **类 :: 实例方法** （难点）

**要求**

-   函数式接口中的**抽象方法a与其内部实现时调用的对象的某个方法b的形参列表和返回值类型都相同（一致）**
-   同时，抽象方法a中有n个参数，方法b有n-1个参数，且**抽象方法a**的**第一个参数作为方法b的调用者**，且**抽象方法a的后n-1个参数与方法b的n-1个参数的类型相同（一致）**。
-   则此时，可以**考虑使用方法b对方法a的替换、覆盖**。此替换或覆盖即为**方法引用**

**注意**

-   此**方法b是非静态（不含static修饰）方法**，需要对象调用，但**形式上，写成对象a所属的类来调用**

**使用场景**

-   如果某个Lambda表达式里只是想调用一个实例方法，并且前面参数列表的**第一个参数作为方法的主调**，**后面所有的参数都是作为改实例方法的入参**，则就可以使用特定类型的方法引用。

```java
public class MethodRefTest3 {

    /**
     * 类 :: 实例方法（难点）
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

### **构造器引用**

当 Lambda 表达式是创建一个对象，并且满足 Lambda 表达式形参，正好是给创建这个对象的构造器的实参列表，就可以使用构造器引用

**说明**

-   调用了类名对应的类中的某一个确定的构造器
-   **具体调用的是类中的哪一个构造器这取决于函数式接口的抽象方法的形参列表**

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

-   当 Lambda 表达式是创建一个数组对象，并且满足 Lambda 表达式形参，正好是给创建这个数组对象的长度，就可以**数组构造引用**

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



## Stream

**Stream流是什么？**

Stream流是Java8引入的一个强大功能，用于处理数据集合（如集合、数组）。Stream提供了一种高效且易于使用的处理数据的方式，支持顺序和并行处理。Stream不存储数据，而是通过管道操作（如过滤、映射、规约等）对数据进行处理。

Stream的主要特点

-   **懒加载**：Stream的许多操作都是懒加载的，这意味着它们不会立即执行，而是在终止操作（如collect、forEach等）时才会执行。
-   **链式调用**：Stream支持链式调用，可以将多个操作串联起来，形成一个流水线。
-   **函数式编程**：Stream支持函数式编程风格，可以使用Lambda表达式和方法引用来简化代码。
-   **并行处理**：Stream可以很容易地转换为并行流，利用多核处理器进行并行处理，提高性能。



### **Stream 和 Collection 集合的区别**

**Collection 是一种静态的内存数据结构， 讲的是数据，而 Stream 是有关计算的，讲的是计算。**前者是主要面向内存，存储在内存中，后者主要是面向 CPU，通过 CPU 实现计算

流表面上看来去和集合很类似，都可以让我们转换和获取数据。但是他们之间存在着显著的差距：

-   **Stream 流并不存储数据。**这些元素可能存储在底层的集合中，或者是按需生成的。
-   **Stream 流操作不会修改其数据源。**例如，filter方法不会从流中移除元素，**而是会生成一个新的流**，其中不包含过滤掉的元素。
-   **流的操作是尽可能的惰性执行的。**这意味着直至需要其结果时，操作才会执行（即 一旦执行终止操作，就执行中间操作链，并产生结果。）。例如，如果我们只想查找前5个长单词而不是所以长单词，那么filter方法就会在匹配第5个单词后停止过滤。由此，我们甚至可以操作无限流。
-   Stream 流一旦执行了终止操作，就不能调用其他中间操作或终止操作了



### **操作流的典型流程**

1.  **创建一个流** 一个数据源（如：集合、数组），获取一个流

2.  **中间操作**（指定将初始流转换为其他流，可能包含很多步骤，即中间操作的方法 

    返回值仍然是 Stream 类型的对象。因此中间操作可以是个**操作链**，可对数据源 

    的数据进行 n 次处理，但是在终结操作前，并不会真正执行）

3.  **终止操作**。（这个操作会强制执行之前的惰性操作，之后这个流就不能再用了）



### **Stream流分为哪几类？怎么创建？**

​	Stream流在Java8中主要分为两类：顺序流（Sequential Stream）和并行流（Perallel Stream）。这两类流的主要区别在于处理数据的方式和性能表现。

**顺序流（Sequential Stream）**

顺序流按顺序处理数据，每次只处理一个元素。单线程执行。适用于数据量较小或对顺序有要求的场景。代码容易理解和调式

创建方式：

-   使用`Collection`接口的stream()方法

-   使用`Arrays`类的stream()方法

-   使用`Stream`类的静态方法of()、iterate()、generate()等

**并行流（Perallel Stream）**

并行流可以同时处理多个元素，利用多核处理器的并行计算能力。多线程执行。适用于数据量较大且对顺序无严格要求的场景。性能提升明显，但可能会增加代码复杂性和调式难度。

创建方式：

-   使用`Collection`接口的parallerStream()方法

-   使用`Stream`类的parallel()方法将顺序流转化为并行流
