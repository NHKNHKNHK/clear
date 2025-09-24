# 自动装箱

## 1 包装类

### 为什么要引入包装类

引入包装类（Wrapper Class）有以下几个主要的原因：

-   **提供基本数据类型的对象化表示**： Java是一种面向对象的编程语言，但**基本数据类型（如int、double、boolean等）不是对象**。为了能够在面向对象的环境中使用基本数据类型，**Java引入了包装类来提供基本数据类型的对象化表示**。通过包装类，可以将基本数据类型转换为对象，从而可以使用对象的特性，如调用方法、使用泛型等。
-   **提供基本数据类型和引用类型之间的转换**： 包装类提供了一些方法来进行基本数据类型和包装类之间的转换。
-   **支持泛型和集合框架**： 泛型和集合框架是Java中非常重要的特性，它们要求使用对象而不是基本数据类型。通过包装类，可以将基本数据类型作为泛型参数或集合元素，从而在泛型和集合框架中使用基本数据类型。
-   **提供额外的功能和方法**： 包装类除了提供基本数据类型的对象化表示和转换功能外，还提供了一些额外的功能和方法。例如，Integer类提供了一些静态方法用于数学运算、比较和转换，Boolean类提供了一些方法用于逻辑运算等。

总的来说，引入包装类使得基本数据类型能够在面向对象的环境中使用，并提供了基本数据类型和引用类型之间的转换功能，同时还提供了额外的功能和方法。这样可以更方便地进行编程，并且能够充分利用Java的面向对象特性和其他功能特性。

### 获取包装类对象：以 Integer对象为例

在JDK5以前，获取 Integer对象的方式主要为：

-   通过构造器获取Integer对象
-   通过静态方法 valueOf 获取Integer对象

常用构造器：

```java
public Integer(int value)
public Integer(String s) throws NumberFormatException 
```

常用方法：

```java
public static Integer valueOf(int i) 
public static Integer valueOf(String s) throws NumberFormatException  
public static Integer valueOf(String s, int radix) throws NumberFormatException 
// radix 表示进制
```

演示：

```java
// 利用构造器获取Integer对象（JDK5以前）
Integer i1 = new Integer(1);
Integer i2= new Integer("2");
// Integer i3 = new Integer("2a");  // NumberFormatException

// 利用静态方法获取Integer对象（JDK5以前）
Integer i4 = Integer.valueOf(123);
Integer i5 = Integer.valueOf("123");
// Integer i6 = Integer.valueOf("123abc");   // NumberFormatException
Integer i7 =Integer.valueOf("123",8);  // 将八进制数“123” 转换为 十进制 83
```

#### new Integer() 与 Integer.valueOf 的区别

```java
// 通过new关键字得到了每次都是一个新的对象，这个很好理解
Integer i5 = new Integer(127);
Integer i6 = new Integer(127);
System.out.println(i5 == i6);  // false

Integer i7 = new Integer(128);
Integer i8 = new Integer(128);
System.out.println(i7 == i8);  // false


Integer i1 = Integer.valueOf(127);
Integer i2 = Integer.valueOf(127);
System.out.println(i1 == i2);  // true    这是true是因为源码中存在小整数池的概念

Integer i3 = Integer.valueOf(128);
Integer i4 = Integer.valueOf(128);
System.out.println(i3 == i4);  // false
```

valueOf部分源码如下：

```java
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high) // 只要我们给的数在这个范围，就不会通过new的方式创建Integer对象
        return IntegerCache.cache[i + (-IntegerCache.low)]; // 直接返回小整数池中的值（提取创建好的）
    return new Integer(i);
}

// 其中
static final int low = -128;
static final int high = 127;
```



### 包装类的计算

#### JDK5之前

这样的代码很笨拙，我们现在是不会怎么写代码的

```java
// JDK5之前的计算操作
public static void main(String[] args) {
    // JDK5之前获取包装类的方式，如下两种方式：
    Integer i1 = new Integer(1);
    Integer i2 = Integer.valueOf(2);

    // todo 对象是不能直接进行相加的
    //  所以我们需要将对象拆箱，得到基本数据类型，进过计算后，再进行装箱，得到包装类对象
    int result = i1.intValue()+i2.intValue();
    Integer i3 = Integer.valueOf(result);
    System.out.println(i3);
}
```

#### JDK5开始：自动拆箱、装箱

```java
// JDK5开始的计算操作
public static void main(String[] args) {
    // JDK5开始：引入了自动装箱、自动装箱
    // 自动装箱：把基本数据类型自动变成对应的包装类
    // 自动拆箱：把包装类对象自动变成基本数据类型

    // todo 自动装箱：无需我们手动干预
    // 在底层，程序会自动调用valueOf方法得到Integer包装类对象
    Integer i1 = 10;  // 底层相对于 Integer.valueOf(10)

    Integer i2 = new Integer(10);
    // todo 自动拆箱：无需我们手动干预
    int i3 = i2;

    // 在JDK5开始，int 和 Integer 可以看做是同一个东西，内部会自动进行转换
}
```



### 包装类常用方法

```java
// 把整数转成二进制
public static String toBinaryString(int i)
// 把整数转成八进制    
public static String toOctalString(int i)
// 把整数转成十六进制
public static String toHexString(int i)
    
// 将字符串解析为对应的基本数据类型    
public static int parseInt(String s) throws NumberFormatException     
```

演示：

```java
public static void main(String[] args) {
    // 把整数转成二进制
    String str1 = Integer.toBinaryString(100);
    System.out.println(str1);

    // 把整数转成八进制
    String str2 = Integer.toOctalString(100);
    System.out.println(str2);

    // 把整数转成十六进制
    String str3 = Integer.toHexString(100);
    System.out.println(str3);
}
```

#### parseXxx 和 valueOf

在包装类中，有两个常用的方法用于将字符串转换为对应的包装类对象，它们分别是`parseXxx`和`valueOf`。

-   `parseXxx`方法： `parseXxx`方法是包装类提供的静态方法，用于**将字符串解析为对应的基本数据类型**。

注意：

​	八种包装类型中，除了Character，其余都有parseXxx的方法

-   `valueOf`方法： `valueOf`方法也是包装类提供的静态方法，用于**将字符串转换为对应的包装类对象**。

区别：

-   `parseXxx`方法返回基本数据类型，而`valueOf`方法返回包装类对象。
-   `parseXxx`方法在解析失败时会抛出异常，而`valueOf`方法在解析失败时会返回null或抛出异常（取决于具体的实现）。

推荐使用：

-   如果你需要处理可能解析失败的情况，并且希望得到null值或者自己处理异常，可以使用`valueOf`方法。
-   如果你确定字符串可以成功解析为对应的基本数据类型，并且不需要处理解析失败的情况，可以使用`parseXxx`方法。

演示：

```java
public static void main(String[] args) {
    String str1 = "123";
    String str2 = "123ab";
    // ValueOf：将字符串转换为对应的包装类对象
    Integer i1 = Integer.valueOf(str1);
    Integer i2 = Integer.valueOf(str2);  // NumberFormatException: For input string: "123ab"

    // ParseXxx：将字符串解析为对应的基本数据类型
    int i3 = Integer.parseInt(str1);
    int i4 = Integer.parseInt(str2);  // NumberFormatException: For input string: "123ab"
}
```



## 2 自动装箱、拆箱

JDK5引入的

### 为什么Java需要引入自动装箱、拆箱

Java类型要么是引用类型（比如Byte、Integer、Object、List），要么是原始类型（比如int、double、byte、char）。

但是**泛型（比如`Consumer<T>`中的T）只能绑定到引用类型**。这是由泛型内部的实现方式造成的。

因此，在Java里有一个将**原始类型转换为对应的引用类型的机制**。这个机制叫作**装箱（boxing）**。相反的操作，也就是将**引用类型转换为对应的原始类型，叫作拆箱**（unboxing）。

Java还有一个自动装箱机制来帮助程序员执行这一任务：**装箱和拆箱操作是自动完成的**。

### 自动装箱示例

例如，这就是为什么下面的代码是有效的（一个int被装箱成为Integer）：

```java
List<Integer> list = new ArrayList<>(); 
for (int i = 300; i < 400; i++){ 
    list.add(i);	// 这里会将插入到List中的数据自动装箱成Integer包装类对象
}
// 当我们手动获取List集合中的数据时，我们得到的是int类型（内部会帮我们将Integer转为int，无需手动干预）
```

但这在性能方面是要付出代价的。**装箱后的值本质上就是把原始类型包裹起来，并保存在堆里**。因此，装箱后的值需要更多的内存，并需要额外的内存搜索来获取被包裹的原始值。 

### Java8为中的特例

​	Java 8 函数式接口带来了一个专门的版本，以便在**输入和输出都是原始类型时避免自动装箱的操作。**

比如，在下面的代码中，使用IntPredicate就避免了对值1000进行装箱操作，但要是用`Predicate<Integer>`就会把参数1000装箱到一个Integer对象中：

```java
public interface IntPredicate{ 
 boolean test(int t); 
} 

IntPredicate evenNumbers = (int i) -> i % 2 == 0; 
evenNumbers.test(1000); 
Predicate<Integer> oddNumbers = (Integer i) -> i % 2 == 1;
oddNumbers.test(1000);
```

### 基本类型自动装箱为包装类

```java
/**
 * 基本类型包装类
 */
public class IntegerDemo {
    public static void main(String[] args) {
        // 将基本类型自动装箱为包装类
        int a = 11;
        Integer A = a;  // 自动装箱
        System.out.println(A);

        Integer b = 11;
        int b2 = b;  // 自动拆箱
        System.out.println(b);
        System.out.println("=======================");
        // 包装类可以把基本数据类型转为字符串形式（鸡肋语法）
        // 可以与 + "" 运算替代
        Double i2 = 99.1;
        String rs = i2.toString();  // 转为了字符串形式
        System.out.println(rs + 1);

        String rs2 = Double.toString(i2); // 转为了字符串形式
        System.out.println(rs2+1);

        // 直接用 + 连接成字符串
        System.out.println(i2 + "");

        // 解析字符串成整数、浮点数
        Integer.parseInt("222");
        //Integer.parseInt("222.4");  // NumberFormatException

        Double.parseDouble("222.4");
        //Double.parseDouble("222.4sss");  // NumberFormatException

        // 上述的  Integer.parseInt("222");   Double.parseDouble("222.4"); 也可以用valueOf()代替
        Integer.valueOf("2222");
        Double.valueOf("222.4");
    }
}
```

### 基本数据类型存入集合中进行的自动装箱

```java
public class Test1 {
    // 说明：集合中不能存储基本数据类型：存入基本数据类型会自动装箱
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();

        list.add(3); // 自动装箱，等价于   list.add(Integer.valueOf(3));
        //list.add(Integer.valueOf(3));

        System.out.println(list.get(0));  // 自动拆箱，等价于   list.get(0).intValue();
        //list.get(0).intValue();
    }
}
```

泛型中不能放入基本数据类型

```java
public class Test2 {
    public static void main(String[] args) {
        // 编译错误，类型参数（泛型）不能为基本数据类型
        List<int> list = new ArrayList<>();
    }
}
```



### 理解数据类型不能自动装箱

数据值可以自动装箱

```java
int i = 5;
Integer j = i;  // 自动装箱：数据值可以自动装箱
```

数据类型不能自动装箱

```java
Integer.class
int.class
// 显然不是同一个类，不能装箱
```

例如：

```java
List<Integer> list = new ArrayList<>();
List<int> list2 = new ArrayList<>();	// 编译错误，数据类型不能自动装箱
```



## 3 开发经验

JDK5开始引入自动装箱、自动拆箱，我们使用包装类时，不需要new，也不需要调用valueOf方法，直接赋值即可

反例：

```java
Integer i1 = new Integer(10);  // new的方式得到包装类对象，不建议
Integer i2 = Integer.valueOf(10);  // 静态方法的方式得到包装类对象，不建议
```

正例：

```java
Integer i3 = 10;  // 自动装箱
int i4 = i3;  // 自动拆箱
```

