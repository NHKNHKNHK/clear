# 1 引入

前面说过的行为参数化传递代码有助于应对不变变化的需求。但是我们前面使用匿名类的方式来表示不同的行为，代码比较繁琐，我们可以引入Lambda表达式来改变这一现状。

Lambda表达式——可以**简洁的表示行为或传递代码**。

Lambda表达式，可以看作匿名功能，简单理解为没有声明方法名称的方法，与匿名类一样也可以作为参数传递给一个方法

**Lambda表达式还可以与方法引用结合在一起使用，进一步简化代码。**

# 2 Lambda入门

可以把**Lambda表达式理解为表示可传递的匿名函数的一种方式**：它没有名称，但有参数列表、函数体、返回类型，可能还有一个可以抛出去的异常列表。

Lambda基本形式：

```java
(形参列表) -> {
    Lambda体
}

// 或
lambda形参列表 -> lambda体
```

Lambda特点：

-   匿名——它没有方法声明
-   函数——我们说它为函数，是因为它区别于方法，不隶属于某个特定的类。但和方法一样，它有参数列表、函数体、返回值，可能还有可以抛出去的异常。
-   传递——Lambda表达式可以作为参数传递到方法中或存储在变量中
-   简洁——无需像匿名类一样写很多模板代码

理论上来说，Java8之前做不了的事情，在java8也做不了。Java8引入的**Lambda表达式主要是为了简化用匿名类写的那些笨拙的代码**，**可以为函数式接口提供实例**，可以使得代码更清晰、灵活。

例如：

使用Lambda表达式定义一个Comparator对象

```java
(Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight());
```

说明：

**一个Lambda表达式由参数列表、箭头和Lambda体三部分组成**

完整表示：

Java8之前：

```java
Comparator<Apple> byWeight = new Comparator<Apple>() {
    @Override
    public int compare(Apple a1, Apple a2) {
        return a1.getWeight().compareTo(a2.getWeight());
    }
};
```

java8开始：使用Lambda简化匿名内部类

```java
Comparator<Apple> byWeight = (Apple a1, Apple a2) ->
    	a1.getWeight().compareTo(a2.getWeight());
```

# 3 Lambda表达式在哪里以及如何使用

我们只能在函数式接口上使用Lambda表达式。

例如在行为参数化中的一个例子：

```shell
List<Apple> greenApples = filter(inventory, (Apple 1) -> "green".equals(a.getColor()));
```

在这个例子中，我们将Lambda表达式作为第二个参数传递给filter方法，为什么能将Lambda传递给这个参数呢？

因为这个参数需要实现`Pridicate<T>`接口，而且这是一个函数式接口。

## 3.1 函数式接口

所谓**函数式接口**，我们可以简单理解为**只有一个抽象方法（Single Abstract Method，简称 SAM）的接口**。

Lambda表达式允许我们直接以内联的形式为函数式接口的抽象方法提供实现，并把整个Lambda表达式作为函数式接口的实例。

例如，下面是Java API中的一些函数式接口

```java
package java.util;
@FunctionalInterface
public interface Comparator<T> {
    int compare(T o1, T o2);
}

package java.lang;
@FunctionalInterface
public interface Runnable {
    public abstract void run();
}

package java.util.concurrent;
@FunctionalInterface
public interface Callable<V> {
    V call() throws Exception;
}
```

说明：

​	**从JDK8开始**，接口中引入了**默认方法**（即在类没有对方法进行实现，其主体为方法提供默认实现的方法）。虽然有很多方法，但是只要接口只定义了一个抽象方法，它就依然是函数式接口。

### 3.1.2 函数式接口错误实例

下面是一些函数式接口的错误示例：

```java
public interface Adder{  // 函数式接口
    int add(int a, int b);
}

public interface SmartAdder extends Adder{  // 非函数式接口，因为他有两个add抽象方法（其中一个继承自父接口）
    int add(int a, int b);
}

public interface Nothing{  // 非函数式接口，没有声明抽象方法
}
```

### 3.1.3 函数式接口的应用

使用Lambda表达式以内联的形式为函数式接口的抽象方法提供实现。

演示：

```java
public class FunctionalInterfaceDemo {
    public static void main(String[] args) {
        // 使用匿名类提供函数式接口实例
        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("hello world");
            }
        },"t1");
        t1.start();

        // 使用Lambda表达式提供函数式接口实例
        Thread t2 = new Thread(() -> System.out.println("hello world"),"t2");
        t2.start();
    }
}
```

## 3.2 函数描述符

函数式接口的抽象方法的签名基本上就是Lambda表达式的签名。我们将这种抽象方法称之为函数描述符。

例如，Runnable接口可以看作一个什么也不接受什么也不返回（void）的函数的签名，因为它只有一个叫作run的抽象方法，这个方法什么也不接受，什么也不返回（void）。

现在，只要知道**Lambda表达式可以被赋给一个变量或传递给一个接受函数式接口作为参数的方法**就好了，当然这个Lambda表达式的签名要和函数式接口的抽象方法一样。

## 3.3 @FunctionalInterface注解

**`@FunctionalInterface`注解**在很多函数式接口的Java API源码中都出现过，简单来说它就是**标记一个接口为函数式接口，如果接口不为函数式接口，编译器将返回一个提示原因的错误。**

我们**可以在一个接口上使用 `@FunctionalInterface` 注解**，这样做**可以检查它是否是一个函数式接口**。同时 javadoc 也会包含一条声明，说明这个接口是一个函数式接口。

注意：

​	对于设计接口而言，我们不加入`@FunctionalInterface`注解也可以，但它是一个好的做法。就像我们在重写一个方法时加上@Override注解一样。

# 4 把Lambda付诸实践：环绕执行模式

下面通过举例来看看在实践中如何**利用Lambda 和 行为参数化 来让代码更为灵活，更为简洁**。

资源处理（例如处理文件或数据库）时一个常见的模式就是打开一个资源，做一些处理，然后关闭资源。这个设置和清理阶段总是很类似，并且会围绕着执行处理的那些重要代码。这就是所谓的环绕执行（execute around）模式。

例如：

```java
public static String processFile() throws IOException{
    // Java7中引入的try-with-resources语句来自动关闭资源
    try(BufferedReader br = new BufferedReader(new FileReader("data.txt"))){
        return br.readLine();
    }
}
```

## 4.1 第一步：记得行为参数化

现在上面这段代码很局限。只能读取文件的第一行。如果我们想要读取文件的前两行，甚至是文件中出现的最多次数的词，怎么办呢？在理想情况下，我们要重用执行设置和清理的代码，并告诉processFile方法对文件执行不同的操作。这就是需要把行为进行参数化。我们需要把一种方法的行为传递给processFile方法，以便利用BufferedReader 执行不同的行为。

传递行为真是Lambda表达式所擅长的。下面我们来用Lambda表达式完成读取文件前两行内容：

```java
String result = processFile((BufferedReader br) ->
            br.readLine() + br.readLine());
```



## 4.2 第2步：使用函数式接口来传递行为

前面解释过，**Lambda仅可用于上下文是函数式接口的情况**。我们需要创建一个能匹配BufferedReader -> String，还可以抛出 IOException 异常的接口。

例如：

```java
@FunctionalInterface
public interface BufferedReaderProcessor {
    String process(BufferedReader br) throws IOException;
}
```

现在我们就可以将这个函数式接口作为新的processFile方法的参数了：

```java
public static String processFile(BufferedReaderProcessor p) throws IOException {
    ...
}
```

## 4.3 第3步：执行一个行为

现在，任何一个BufferedReader -> String 形式的Lambda都可以作为参数来传递，因为它们符合BufferedReaderProcessor 接口中定义的process 方法的签名。

现在我们只需要一种方法在processFile主体内执行Lambda表达式所代表的代码。

记住，**Lambda表达式允许我们直接关联，为函数式接口的抽象方法提供实现，并且将整个表达式作为函数式接口的一个实例。**

因此，我们可以在processFile主体内，对得到的BufferedReaderProcessor 对象调用 process方法执行处理：

```java
public static String processFile(BufferedReaderProcessor p) throws IOException {
    try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
        return p.process(br);	// 处理 BufferedReader对象
    }
}
```

## 4.4 第4步：传递Lambda

现在，我们就可以通过传递不同的Lambda重用processFile方法，并以不同的方式处理文件了。

例如：

处理一行

```java
String oneLine = 
    processFile((BufferedReader br) -> br.readLine());
```

处理两行

```java
String twoLine =
    processFile((BufferedReader br) -> br.readLine() + br.readLine());
```



# 4 使用函数式接口

**函数式接口定义且只定义了一个抽象方法**。函数式接口很有用，因为抽象方法的签名可以描述Lambda表达式的签名。**函数式接口的抽象方法的签名称为函数描述符**。所以为了应用不同的Lambda表达式，我们需要一套能够描述常见函数描述符的函数式接口。 

Java API中已经有了几个函数式接口，比如我们签名使用过的Comparable、Runnable和 Callable等。

Java 8的库设计师帮我们在`java.util.function`包中引入了几个新的函数式接口。

## 4.1 Predicate 判断型接口

`java.util.function.Predicate<T>`接口定义了一个名叫test的抽象方法，它接受泛型 T对象，并返回一个boolean。如下：

```java
package java.util.function;

@FunctionalInterface
public interface Predicate<T> {
    boolean test(T t);
}
```

演示：

```java
// 把函数式接口作为方法的参数
public static  <T> List<T> filter(List<T> list, Predicate<T> p){
    List<T> results = new ArrayList<>();
    for (T s: list){
        if(p.test(s)){
            results.add(s);
        }
    }
    return results;
}

// 把Lambda表达式赋值给一个变量
// 这里的Lambda表达式即是Pridicate接口中test的实现。
Predicate<String> nonEmptyStringPredicate = (String s) -> !s.isEmpty();
// 将函数式接口的实例传递给方法
List<String> nonEmpty = filter(listOfStrings, nonEmptyStringPredicate);
```

## 4.2 Consumer 消费型接口

`java.util.function.Consumer<T>`定义了一个名叫accept的抽象方法，它接受泛型T 的对象，没有返回（void），如下：

```java
package java.util.function;

@FunctionalInterface
public interface Consumer<T> {
    void accept(T t);
}
```

演示：

```java
public static <T> void forEach(List<T> list, Consumer<T> c) {
    for (T i : list) {
        c.accept(i);
    }
}

@Test
public void test() {
    forEach(Arrays.asList(1, 2, 3, 4, 5),
            // 这里的Lambda表达式即是Consumer接口中accept的实现。
            ((Integer i) -> System.out.println(i)));
}
```

## 4.3 Function 函数型接口

`java.util.function.Function<T, R>`接口定义了一个叫作apply的方法，它接受一个泛型T的对象，并返回一个泛型R的对象。如下：

```java
package java.util.function;

@FunctionalInterface
public interface Function<T, R> {
    R apply(T t);
}
```

演示：

```java
public static <T, R> List<R> map(List<T> list, Function<T, R> f) {
    List<R> results = new ArrayList<>();
    for (T s : list) {
        results.add(f.apply(s));
    }
    return results;
}

@Test
public void test2() {
    List<Integer> l = map(Arrays.asList("hello", "world", "java"),
                          // 这里的Lambda表达式是Function接口的apply方法的实现
                          (String s) -> s.length()
                         );
}
```

## 4.4 JDK8之前的函数式接口

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

## 4.5 JDK8 引入的四大核心函数式接口

| 函数式接口      | 称谓       | 参数类型 | 用途                                                       | 抽象方法          |
| --------------- | ---------- | -------- | ---------------------------------------------------------- | ----------------- |
| Consumer\<T>    | 消费型接口 | T        | 对类型为T的对象应用操作                                    | void accept(T t)  |
| Supplier\<T>    | 供给型接口 | 无       | 返回类型为T的对象                                          | T get();          |
| Function\<T, R> | 函数型接口 | T        | 对类型为T的对象应用操作，并返回结果。<br>结果是R类型的对象 | R apply(T t)      |
| Predicate\<T>   | 判断型接口 | T        | 确认类型为T的对象是否满足某约束条件，并返回boolean值       | boolean test(T t) |

## 4.6 JDK8中引入的所有函数式接口

### 类型1：消费型接口

消费型接口的抽象方法特点：**有形参，但是返回值类型为void**

| 接口名               | 抽象方法                       | 描述                       |
| -------------------- | ------------------------------ | -------------------------- |
| BiConsumer<T, U>     | void accept(T t, U u)          | 接收两个对象用于完成功能   |
| DoubleConsumer       | void accept(double value)      | 接收一个double值           |
| IntConsumer          | void accept(int value)         | 接收一个int值              |
| LongConsumer         | void accept(long value)        | 接收一个long值             |
| ObjDoubleConsumer<T> | void accept(T t, double value) | 接收一个对象和一个double值 |
| ObjIntConsumer<T>    | void accept(T t, int value)    | 接收一个对象和一个int值    |
| ObjLongConsumer<T>   | void accept(T t, long value)   | 接收一个对象和一个long值   |

### 类型2：供给型接口

供给型接口的抽象方法特点：**无形参，但是有返回值**

| 接口名          | 抽象方法               | 描述                |
| --------------- | ---------------------- | ------------------- |
| BooleanSupplier | boolean getAsBoolean() | 返回一个 boolean 值 |
| DoubleSupplier  | double getAsDouble()   | 返回一个 double 值  |
| IntSupplier     | int getAsInt()         | 返回一个 int 值     |
| LongSupplier    | long getAsLong();      | 返回一个 long 值    |

### 类型3：函数型接口

函数型接口的抽象方法特点：**既有参数又有返回值**

| 接口名                  | 抽象方法                                        | 描述                                                 |
| ----------------------- | ----------------------------------------------- | ---------------------------------------------------- |
| UnaryOperator           | T apply(T t)                                    | 接收一个T类型对象，返回一个T类型对象结果             |
| DoubleFunction<R>       | R apply(double value)                           | 接收一个double值，返回一个R类型对象                  |
| IntFunction<R>          | R apply(int value)                              | 接收一个int值，返回一个R类型对象                     |
| LongFunction<R>         | R apply(long value)                             | 接收一个long值，返回一个R类型对象                    |
| ToDoubleFunction<T>     | double applyAsDouble(T value)                   | 接收一个T类型对象，返回一个double                    |
| ToIntFunction<T>        | int applyAsInt(T value)                         | 接收一个T类型对象，返回一个int                       |
| ToLongFunction<T>       | long applyAsLong(T value)                       | 接收一个T类型对象，返回一个long                      |
| DoubleToIntFunction     | int applyAsInt(double value)                    | 接收一个double值，返回一个int结果                    |
| DoubleToLongFunction    | long applyAsLong(double value)                  | 接收一个double值，返回一个long结果                   |
| IntToDoubleFunction     | double applyAsDouble(int value)                 | 接收一个int值，返回一个double结果                    |
| IntToLongFunction       | long applyAsLong(int value)                     | 接收一个int值，返回一个long结果                      |
| LongToDoubleFunction    | double applyAsDouble(long value)                | 接收一个long值，返回一个double结果                   |
| LongToIntFunction       | int applyAsInt(long value)                      | 接收一个long值，返回一个int结果                      |
| DoubleUnaryOperator     | double applyAsDouble(double operand)            | 接收一个double值，返回一个double                     |
| IntUnaryOperator        | int applyAsInt(int operand)                     | 接收一个int值，返回一个int                           |
| LongUnaryOperator       | long applyAsLong(long operand)                  | 接收一个long值，返回一个long                         |
| BiFunction<T,U,R>       | R apply(T t, U u)                               | 接收一个T类型和一个U类型对象， 返回一个R类型对象结果 |
| BinaryOperator          | T apply(T t, T u)                               | 接收两个T类型对象， 返回一个T类型对象结果            |
| ToDoubleBiFunction<T,U> | double applyAsDouble(T t, U u)                  | 接收一个T类型和一个U类型对象， 返回一个double        |
| ToIntBiFunction<T,U>    | int applyAsInt(T t, U u)                        | 接收一个T类型和一个U类型对象， 返回一个int           |
| ToLongBiFunction<T,U>   | long applyAsLong(T t, U u)                      | 接收一个T类型和一个U类型对象， 返回一个long          |
| DoubleBinaryOperator    | double applyAsDouble(double left, double right) | 接收两个 double 值，返回一个double值                 |
| IntBinaryOperator       | int applyAsInt(int left, int right)             | 接收两个 int 值，返回一个int 值                      |
| LongBinaryOperator      | long applyAsLong(long left, long right)         | 接收两个 long 值，返回一个long值                     |

### **类型4：判断型接口**

判断型接口的抽象方法特点：**有形参，但是返回值类型是 boolean** 

| 接口名           | 抽象方法                   | 描述               |
| ---------------- | -------------------------- | ------------------ |
| BiPredicate<T, U | boolean test(T t, U u)     | 接收两个对象       |
| DoublePredicate  | boolean test(double value) | 接收一个 double 值 |
| IntPredicate     | boolean test(int value)    | 接收一个 int 值    |
| LongPredicate    | boolean test(long value)   | 接收一个 long 值   |

## 4.7 异常、Lambda，还有函数式接口的关系

请注意，**任何函数式接口都不允许抛出受检异常**（checked exception）。

如果你需要Lambda表达式来抛出异常，有两种办法：

-   定义一个自己的函数式接口，并声明受检异常
-   或者把Lambda包在一个try/catch块中。 

演示1：定义一个自己的函数式接口，并声明受检异常

我们定义的一个函数式接口BufferedReaderProcessor，它显式声明了一个IOException：

```java
@FunctionalInterface  
public interface BufferedReaderProcessor {  
    // 在抽象方法中显示抛出一个异常
    String process(BufferedReader b) throws IOException;  
}  

BufferedReaderProcessor p = (BufferedReader br) -> br.readLine();  
```

但是如果我们使用的是Java源码中所提供的函数式接口，我们无法修改它的源代码，这样情况下我们可以显示捕捉受检异常

演示2：把Lambda包在一个try/catch块中

```java
Function<BufferedReader, String> f = (BufferedReader b) -> {
    // 将Lambda表达式包装在try-catch语句中，显示捕获异常
    try {  
        return b.readLine();  
    }  
    catch(IOException e) {  
        throw new RuntimeException(e);  
    }  
}; 
```

# 5 类型检查、类型推断、以及限制

前面我们说过，**Lambda表达式可以为函数式接口提供实例**。然而，Lambda表达式本身并不包含它在实现哪个函数式接口的信息。为了全面了解Lambda表达式，我们应该知道Lambda的实际类型是什么。

## 5.1 类型检查

**Lambda的类型是从使用Lambda的上下文推断出来的**。上下文（比如，接受它传递的方法的参数，或接受它的值的局部变量）中Lambda表达式需要的类型称为目标类型。

从下面这个例子来说明以下使用Lambda表达式时背后发生了什么：

```java
List<Apple> heavierThan150g = 
 			filter(inventory, (Apple a) -> a.getWeight() > 150);
```

类型检查过程可以分解为如下所示 

-   首先，你要找出filter方法的声明——filter(List<Apple> inventory, Predicate<Apple> p)。 
-   第二，要求它是 Predicate<Apple>（目标类型）对象的第二个正式参数。 
-   第三，Predicate<Apple>是一个函数式接口，定义了一个叫作test的抽象方法。 
-   第四，test方法描述了一个函数描述符，它可以接受一个Apple，并返回一个boolean。 
-   最后，filter的任何实际参数都必须匹配这个要求。 

这段代码是有效的，因为我们所传递的Lambda表达式也同样接受Apple为参数，并返回一个 boolean。请注意，如果Lambda表达式抛出一个异常，那么抽象方法所声明的throws语句也必须与之匹配。

## 5.2 同样的Lambda，不同的函数式接口

有了目标类型的概念，**同一个Lambda表达式就可以与不同的函数式接口联系起来**，只要它们的抽象方法签名能够兼容。

例如：

```java
// Lambda表达式都是一样的，但是函数式接口不一样
Comparator<Apple> c1 = 
    (Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight()); 

ToIntBiFunction<Apple, Apple> c2 = 
    (Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight()); 

BiFunction<Apple, Apple, Integer> c3 = 
    (Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight());
```

### 菱形运算符 

**Java 7中已经引入了菱形运算符（<>）**，利用泛型推断从上下文推断类型的思想（这一思想甚至可以追溯到更早的泛型方法）。一个类实例表达式可以出现在两个或更多不同的上下文中，并会像下面这样推断出适当的类型参数： 

```java
List<String> listOfStrings = new ArrayList<>();  

List<Integer> listOfIntegers = new ArrayList<>();  
```

### 特殊的void兼容规则 

如果一个Lambda的主体是一个语句表达式，它就和一个返回void的函数描述符兼容（当然需要参数列表也兼容）。例如，以下两行都是合法的，尽管List的add方法返回了一个 boolean，而不是Consumer上下文（T -> void）所要求的void

```java
// Predicate返回了一个boolean  
Predicate<String> p = s -> list.add(s);  

// Consumer返回了一个void  
Consumer<String> b = s -> list.add(s);  
```

## 5.3 类型推断

Java编译器会从上下文（目标类型）推断出用什么函数式接口来配合Lambda表达式，这意味着它也可以推断出适合Lambda的签名，因为函数描述符可以通过目标类型来得到。 **Lambda 表达式中无需指定类型**，程序依然可以编译，这是因为 **javac 根据程序的上下文，在后台推断出了参数的类型**。Lambda 表达式的类型依赖于上下文环境，是由编译器推断出来的。这就是所谓的类型推断**。 

换句话说，Java编译器会像下面这样推断Lambda的参数类型

```java
// 参数a没有显示类型
List<Apple> greenApples = 
 		filter(inventory, a -> "green".equals(a.getColor()));
```

Lambda表达式有多个参数，代码可读性的好处就更为明显。例如，你可以这样来创建一个 Comparator对象：

```java
// 没有类型推断
Comparator<Apple> c = 
		 (Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight()); 
// 有类型推断
Comparator<Apple> c = 
		 (a1, a2) -> a1.getWeight().compareTo(a2.getWeight());
```

## 5.4 使用局部变量

我们迄今为止所介绍的所有Lambda表达式都只用到了其主体里面的参数。但**Lambda表达式也允许使用自由变量（不是参数，而是在外层作用域中定义的变量），就像匿名类一样**。 它们被称作**捕获Lambda**。

例如，下面的Lambda捕获了portNumber变量：

```java
int portNumber = 1337; 	
Runnable r = () -> System.out.println(portNumber);
```

**对于变量的限制：**

​	**Lambda可以没有限制地捕获（也就是在其主体中引用）实例变量和静态变量**。但**局部变量必须显式声明为final，或事实上是final**。

​	换句话说，Lambda表达式只能捕获指派给它们的局部变量一次。（注：捕获实例变量可以被看作捕获最终局部变量this。） 

例如：

```java
// 这段代码无法通过编译，因为portNumber 变量被赋值两次
int portNumber = 1337;
Runnable r = () -> System.out.println(portNumber);
portNumber = 31337;
```

**对局部变量的限制 ：**

第一，实例变量和局部变量背后的实现有一个关键不同。实例变量都存储在堆中，而局部变量则保存在栈上。如果Lambda可以直接访问局部变量，而且Lambda是在一个线程中使用的，则使用Lambda的线程，可能会在分配该变量的线程将这个变量收回之后，去访问该变量。因此，Java在访问自由局部变量时，实际上是在访问它的副本，而不是访问原始变量。如果局部变量仅仅赋值一次那就没有什么区别了——因此就有了这个限制。 

第二，这一限制不鼓励你使用改变外部变量的典型命令式编程模式（我们会在以后的各章中 解释，这种模式会阻碍很容易做到的并行处理）

**闭包** 

你可能已经听说过闭包（closure，不要和Clojure编程语言混淆）这个词，你可能会想Lambda是否满足闭包的定义。用科学的说法来说，闭包就是一个函数的实例，且它可以无限制地访问那个函数的非本地变量。例如，闭包可以作为参数传递给另一个函数。它也可以访问和修改其作用域之外的变量。

现在，**Java 8的Lambda和匿名类可以做类似于闭包的事情：它们可以作为参数传递给方法，并且可以访问其作用域之外的变量。**但有一个限制：它们不能修改定义Lambda的方法的局部变量的内容。这些变量必须是隐式最终的。可以认为**Lambda是对值封闭，而不是对变量封闭**。如前所述，这种限制存在的原因在于局部变量保存在栈上，并且隐式表示它们仅限于其所在线程。如果允许捕获可改变的局部变量，就会引发造成线程不安全的新的可能性，而这是我们不想看到的（实例变量可以，因为它们保存在堆中，而堆 是在线程之间共享的）



# 6 方法引用

## 6.1方法引用

Lambda表达式是可以简化函数式接口的变量或形参赋值的语法。而**方法引用和构造器引用是为了简化Lambda表达式的。**

使用方法引用之前：

```java
inventory.sort(Apple a1, Apple a2) ->
    			a1.getWeight().compareTo(a2.getWeight());
```

使用Lambda表达式之后：

```java
// 使用方法引用 和 Java.util.COmparator.comparing
inventory.sort(Comparing(Apple::getWeight));
```

当要传递给 Lambda 体的操作，已经有实现的方法了，可以使用方法引用！**方法引用可以看做是 Lambda 表达式深层次的表达**。换句话说，方法引用就是 Lambda 表达式，也就是函数式接口的一个实例，通过方法的名字来指向一个 方法，可以认为是 Lambda 表达式的一个语法糖。 

**语法糖**（Syntactic sugar），也译为糖衣语法，是由英国计算机科学家 彼得·约翰·兰达（Peter J. Landin）发明的一个术语，指计算机语言中添加的某种语法，这种语法对语言的功能并没有影响，但是更方便程序员*使用。通常来说使用语法糖能够增加程序的可读性，从而减少程序代码出错的机会。 

简单来说：

-   方法引用，可以看做是基于Lambda表达式的进一步刻画。
-   当需要提供一个函数式接口的实例时，我们可以使用lambda表达式提供此实例。
-   **当满足一定的条件的情况下，我们还可以使用方法引用或构造器引用替换lambda表达式**

**如何构建方法引用**

方法引用主要有三类

-   1）指向静态方法的方法引用
    -   例如：Integer的parseInt方法，写作 Integer::parseInt （类::静态方法）

-   2）指向任意类型实例方法的方法引用
    -   例如：String的 length 方法，写作 String::length	(类::实例方法)

-   3）指向现有对象的实例方法的方法引用
    -   假设我们有一个局部变量expensiveTranscation 用于存放Transaction类型的对象，它支持实例方法getValue，那么你就可以写expensiveTranscription::getValue	(对象::实例方法)



方法引用的本质：

​	**方法引用作为了函数式接口的实例。** ===> 体现了 ”万物皆对象“

格式

```java
类（或对象）:: 方法名      // 两个:之间不能有空格，而且必须英文状态下半角输入

情况一
	对象 :: 实例方法
	
情况二
	类 :: 静态方法
	
情况一
	类 :: 实例方法
```

### 方法引用使用前提

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



### 1 实例方法引用

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



### 2 静态方法引用

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

### 3 类 :: 实例方法 （难点）

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



## 6.2 构造器引用

当 Lambda 表达式是创建一个对象，并且满足 Lambda 表达式形参，正好是给创建这个对象的构造器的实参列表，就可以使用构造器引用

例如：

```java
Supplier<Apple> c1 = Apple::new;	// 构造器引用指向默认的Apple()构造器
Apple a1 = c1.get();

// 等价于
Supplier<Apple> c1 = () -> new Apple();
Apple a1 = c1.get();
```

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



## 6.3 数组引用

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



# 7 Lambda和方法引用的结合

下面演示用不同的排序策略给一个Apple列表排序，最终的结果如下：

```java
inventory.sort(comparing(Apple::getWeight));
```

## 7.1 第一步：传递代码

Java 8 API中的List提供了一个sort方法，方法签名如下：

```java
void sort(Comparator<? super E> c)
```

因此Apple列表排序解决方案如下：

```java
public class AppleComparator implements Comparator<Apple> {
    public int compare(Apple a1, Apple a2){
        return a1.getWeight().compareTo(a2.getWeight());
    }
}

// 传递代码
inventory.sort(new AppleComparator());
```

## 7.2 第二步：使用匿名类

匿名类的解决方案：

```java
// 使用匿名类，我们不需要为只实例化一次的Comparator创建一个类
inventory.sort(new Comparator<Apple> {
    public int compare(Apple a1, Apple a2){
        return a1.getWeight().compareTo(a2.getWeight());
    }
});
```

## 7.3 第三步：使用Lambda表达式

Lambda表达式简化匿名类书写方式的解决方案：

```java
inventory.sort((Apple a1, Apple a2) ->
       a1.getWeight().compareTo(a2.getWeight())
);

// Java编译器会根据Lambda出现的上下文来推断Lambda表达式参数的类型，因此可以改写为：
inventory.sort((a1, a2) ->
       a1.getWeight().compareTo(a2.getWeight())
);
```

## 7.4 第四步：使用方法引用

方法引用（语法糖）简化Lambda表达式书写的解决方案：

```java
// 假设静态导入了java.util.Comparator.comparing
inventory.sort(comparing(Apple:getWeight));
```



# 8 Lambda表达式至简原则

-   **参数类型可以不写**（因为编译器可以根据上下文推断出来）
-   如果只有**一个参数**，参数类型可以省略，**小括号()也可以省略**
-   如果Lambda表达式的方法体**代码只有一行，可以省略大括号{}，同时必须省略分号;**
-   如果Lambda表达式的方法体代码**只有一行，并且这行代码是retrun语句，可以省略retrun，同时省略大括号{}，分号;**



