# 常识

## i++与++i

i++ 与 ++i 的**区别**

-   i++：后置递增，先返回当前值，再自增
-   ++i：前置递增，先自增，再返回新值

**示例：**

```java
public static void main(String[] args){
    int i = 1;

    System.out.println("i: "  +   i);	// 1
    System.out.println("++i: "+   ++i); // 2
    System.out.println("i++: "+   i++); // 2
    System.out.println("i: "  +     i); // 3
    System.out.println("--i: "+   --i); // 2
    System.out.println("i--: "+   i--); // 2
    System.out.println("i: "  +   i);   // 1
}
```

## 服务可用性几个9的含义

服务可用性用“几个9”来表示是一种常见的衡量标准，用来描述系统在一定时间内的可靠性。每个“9”代表系统不可用时间的比例减少了一个数量级。下面是不同数量的“9”所代表的服务可用性水平：

|                                  | **通俗叫法** | **可用性级别** | **年度宕机时间** |
| -------------------------------- | ------------ | -------------- | ---------------- |
| **基本可用**                     | **2个9**     | **99%**        | **87.6小时**     |
| **较高可用**                     | **3个9**     | **99.9%**      | **8.8小时**      |
| **具有故障自动恢复能力的可用性** | 4个9         | 99.99%         | 53分钟           |
| **极高可用性**                   | 5个9         | 99.999%        | 5分钟            |
| **容错可用性**                   | 6个9         | 99.9999%       | 31秒             |

```
1年 = 365天 = 8760小时
99.9 = 8760*0.1%= 8760*0.001 = 8.76小时
99.99 = 8760*0.01%= 8760*0.0001 = 0.876小时 = 0.876*60 = 52.6分钟
99.999 = 8760*0.001%= 8760*0.00001 = 0.0876小时 = 0.0876*60 = 5.26分钟
```

-   较高可用：通常被认为是基本的商业级可用性标准
-   具有故障自动恢复能力的可用性：这通常被认为是较高的可用性标准，适用于大多数企业级应用
-   在设计高可用系统时，通常会采取多种措施来提高服务的可用性，如负载均衡、冗余架构、故障切换等

## JDK、JRE、JVM的关系？

- JDK（Java Development Kit）：Java开发工具包，它包含了JRE和一系列Java开发工具。
- JRE（Java Runtime Environment）：JRE是运行Java应用程序所需的环境，它包含了JVM和Java核心类库。JRE只能用来运行Java应用程序，不能用来开发编译，它是JDK的子集。
- JVM（Java Virtual Machine）：Java虚拟机。Java程序必须在JVM中。


## Java中能不能使用中文当作标识符？

可以，因为Java支持Unicode字符集，而Unicode包括了中文。但是，为了代码的可读性和维护性，通常建议使用英文作为标识符。

```java
public class 测试 {
    public static void main(String[] arags) {
        String 姓名 = "张三";
        System.out.println("姓名：" + 姓名);
    }
}
```

## 简述Java标识符的命名规则？

- 标识符可以包含字母、数字、下划线（_）和美元符号（$）
- 标识符不能以数字开头
- 标识符不能使用关键字、保留字（goto、const、_）、特殊值（true、false、null）
- 标识符区分大小写
- 标识符不能包含空格，否则会被识别为是两个标识符


## 为什么在编写Java代码会遇到乱码问题？

## Java中的常量与变量

- 有什么区别？
  - 常量，final修饰的变量，一旦赋值后，就不能被修改
  - 变量，可以重新赋值
- Java中的常量有几种？
  - 局部变量 + final，一般直接初始化
  - 实例变量 + final，一般通过构造器初始化
  - 静态变量 + final，建议大写，一般直接初始化
```java
class Test {
    static final int MAX_COUNT = 10; // 静态常量
    private final int a = 1; // 实例变量
    private final int b;
    private final int c;

    public Test(int b, int c) {
        this.b = b;
        this.c = c;
    }

    public static void main(String[] args) {
        final int d = 10; // 局部变量

    }

}
```



## Java中的基本数据类型有那些？
Java中的基本数据类型包括8种，分别是：

| 数据类型               | 字节 | 值范围                       | 默认值    | 对应包装类 |
| ---------------------- | ---- | ---------------------------- | --------- | ---------- |
| byte                   | 1    | -128 ~ 127                   | 0         | Byte       |
| short（短整型）        | 2    | -32768 ~ 32767               | 0         | Short      |
| int                    | 4    | -2^31 ~ 2^31-1               | 0         | Integer    |
| long                   | 8    | -2^63 ~ 2^63-1               | 0         | Long       |
| double（单精度浮点型） | 4    |                              | 0.0F      | Double     |
| float（双精度浮点型）  | 8    |                              | 0.0D      | Float      |
| char                   | 2    | 0 ~ 65535，采用Unicode字符集 | \`\u0000` | Character  |
| boolean                | 1bit | true 与 false                | false     | Boolean    |

>   问：boolean类型的字节宽度是多少？
>
>   答：boolean类型的变量用于存储真（true）或假（false）的值。JVM规范中并没有规定boolean类型的具体位数，这取决于JVM的实现。通常情况下，为了考虑效率，boolean很可能会被实现为8位（1字节），但这不是固定的，也可能占用更少或更多位。



## 如何理解自动类型提升？

自动类型提升是指当我们在**计算时**，将`取值范围小的类型`自动提升为`取值范围大的类型`。自动类型提升规则如图所示：

![1739699406807](./assets/数据类型自动提升.png)

（1）当把存储范围**小**的值（字面量、变量值、表达式计算的结果值）赋值给存储范围**大**的变量时

（2）当存储范围小的数据类型与存储范围大的数据类型一起**混合**运算时，会按照大的类型运算

（3）当**btye、short、char**数据类型进行**算术**或**位**运算时，按照**int**类型处理

>   问：自动类型提升就一定是安全的吗？
>
>   答：不是，也可能存在精度丢失

```java
int i = 'A'; // char自动升级为int
double j = 19; // int自动升级为double
System.out.println(i); // 65
System.out.println(i); // 19.0

int a = 1;
char b = 'A';
long c = 1L;
flaot d = 1.0F;
System.out.println(a + b + c + d); // 升级为float  68.0
```



## 如何理解强制类型转换？

强制类型转换是指，将`取值范围大的类型`强制转换为`取值范围小的类型`。或有时候也可以将`取值范围小的类型`强制提升为`取值范围大的类型`

![1739699406807](D:/video/workspace/easy-interview/01-Java%E5%9F%BA%E7%A1%80/assets/%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B%E8%87%AA%E5%8A%A8%E6%8F%90%E5%8D%87.png)

（1）当把存储范围**大**的值（字面量、变量值、表达式计算的结果值）赋值给存储范围**小**的变量时，需要强制转换，提示：有风险，可能会损失精度

```java
int i = 200;
byte b = (byte)i; // 溢出

double a = 1.2;
int j = (int)a; // 损失精度
```

（2）当某个值想要提升数据类型时，也可以使用强制类型转换

```java
int x = 1;
int y = 2;
double z = (double)x/y;
```



## short s1 = 1; s1 = s1 + 1;有错吗?short s1 = 1; s1 += 1;有错吗？

本题考点为：自动类型提升、隐式转换

```java
short s1 = 1;
s1 = s1 + 1;
```

在这个代码片段中，s1 = s1 + 1;会产生编译错误。s1是short类型的变量，1是int类型的变量。其中short、byte、char类型在进行位运算、算术运算时，会**自动提升**为int类型，因此 s1 + 1 的结果是int类型的值，尝试将int类型的结果赋值给short类型的变量s1时，编译器会报错，因为这是一个潜在的精度丢失，需要显式的类型转换。

```
Type mismatch: cannot convert from int to short
```

要修复这个错误，可以进行显式的类型转换：

```java
short s1 = 1;
s1 = (short) (s1 + 1);
```



```java
short s1 = 1;
s1 += 1;
```

这个代码片段是正确的。因为s1 += 1是一个复合赋值运算符，等价于 s1 = (short) (s1 + 1)。在复合赋值运算符中，存在**隐式类型转换**，所以不会出现类型不匹配的问题。



## Java中有哪些访问修饰符？





## Java中的I/O流是什么？



## 什么是Java中的网络编程？



# OOP

## 什么是Java的封装特性？





## Java中一个类可以继承多个类吗？



## Java为什么不支持多继承？



## Java中的序列化与反序列化？



## 什么是Java的迭代器？



## compare与





## 怎么判断一个链条是不是环形链表？





## 什么是接口？



## 什么是抽象类？



## 接口和抽象类有什么区别？



## Java中的参数传递是按值还是按引用？



## 可变类与不可变类？



## 什么是Java中的不可变类？



## 简述Java中Exception异常体系？



## Java中的Exception和Error的区别？



## Java运行时异常和编译时异常的区别是什么？







## 方法重写与方法重载的区别？



## 父类的静态方法能否被子类重写?

静态方法即被static所修饰的成员方法。被static修饰的方法或属性只于类本身有关，被类的所有对象所共享。

静态方法是通过类名调用的，而不是通过实例调用的，所以它们不能表现出多态性。

因此父类的静态方法**不能**被子类重写（override）。

不过，子类可以定义一个与父类静态方法同名的方法，这种情况称为方法隐藏（method hiding），而不是方法重写。



## 什么是内部类？与普通的区别？有什么用？



## JDK8的新特性？

### Lambda



### Stream



### 方法引用



### 接口的默认方法



### Option



### HashMap底层数据结构的改变



### 日期类



### CompletableFuture



## Java中包装类与基础类型的区别？





## 什么是自动装箱和拆箱？





## 静态（类）变量和实例变量的区别？



## 静态（类）方法和实例方法的区别？



## hashCode和equal方法是什么？

equals方法用于比较两个对象是否相等，hashCode方法用于返回对象的哈希值，这两个方法必须一起重写，而且选择的属性必须一致，因为：

hashCode方法必须遵循：

（1）如果进行equals比较时所用的信息没有被修改，那么同一个对象多次调用hashCode方法时，必须结果一致

（2）如果两个对象equals为true，那么它们的hashCode值也必须相同

（3）如果两个对象equals为false，那么它们的hashCode值相同或不同都可以。当然不同可以提升哈希表的性能

另外，equals方法必须遵循：

（1）自反性：x不为null，那么x.equals(x)必须为true

（2）对称性：x、y不为null，那么x.equals(y)与y.equals(x)结果必须相同

（3）传递性：x、y、z不为null，如果x.equals(y)为true，y.equals(z)为true，那么x.equals(z)结果必须一致

（4）一致性：x、y不为null，且x和y用于equals比较的属性值也没有修改，那么多次调用x.equals(y)结果必须一致

（5）如果x不为null，x.eqauls(null)必须返回false

>   问：两个对象的equals方法相等，hashCode方法也会相等吗？
>
>   答：对
>
>   问：两个对象的hashCode方法相等，equals方法也会相等吗？
>
>   答：不对
>
>   问：为什么重写equals就要重写hashCode？
>
>   答：因为hashCode必须遵循上述3条常规协定，这些规定是为`HashMap`、`HashSet`等基于哈希的集合类型提供正确行为的基础。如果不遵守这个约定，对象在使用这些集合类型时可能会表现出不可预测的行为



## 重写 hashCode() 方法的基本原则？

-   在程序运行时，同一个对象多次调用 hashCode() 方法应该返回相同的值。 
-   当两个对象的 equals() 方法比较返回 true 时，这两个对象的 hashCode() 方法的返回值也应相等。 
-   对象中用作 equals() 方法比较的 Field，都应该用来计算 hashCode 值。

### 重写 equals()方法的基本原则？

-   重写 equals 方法的时候一般都需要同时复写 hashCode 方法。通常参与计算hashCode 的对象的属性也应该参与到 equals()中进行计算。 
-   推荐：开发中直接调用 Eclipse/IDEA 里的快捷键自动重写 equals()和 hashCode()方法即可。 

为什么用 Eclipse/IDEA 复写 hashCode 方法，有 31 这个数字？ 

首先，选择系数的时候要选择尽量大的系数。因为如果计算出来的 hash 地址越大，所谓的“冲突”就越少，查找起来效率也会提高。（减少冲突） 

其次，31 只占用 5bits,相乘造成数据溢出的概率较小。 

再次，31 可以 由 i*31== (i<<5)-1 来表示,现在很多虚拟机里面都有做相关优化。（提高算法效率） 

最后，31 是一个素数，素数作用就是如果我用一个数字来乘以这个素数，那么最终出来的结果只能被素数本身和被乘数还有 1 来整除！(减少冲突) 



## equal与==的区别？

  吧  

## 为什么重写equals时也需要重写hashCode？



## for循环与foreach循环的区别？



## 为什么是动态代理？



## JDK动态代理与CGLib动态代理的区别？



## 什么是Java中的注解？



## 什么是反射？你是怎么用的？



## 什么是Java中的SPI（service provide interface）机制？



## 什么是泛型？泛型有什么用？



## 泛型擦除？



## Java中泛型的上下界限定符？



## Java中深拷贝和浅拷贝的区别？



## 什么是Java中的Integer缓存池？



## 简述Java的类加载过程？



## 什么是BigDecimal？何时使用？



## new String("abc")会创建几个对象？



## Java中final、finally、finalize的区别？



## 为什么JDK9中将String的char数组改为了byte数组?



## 一个线程在Java中被两次调用start()方法会发生什么？



## 栈和队列在Java中的区别？



## Java的Optional类是什么？有什么用？



## 



# 字符串

## String类可以被继承吗？

-   **String 类是 final 修饰的**，不能被继承，这是为了确保其不可变性和安全性。
-   **替代方案**：可以通过组合、静态工具类或包装类的方式来扩展 `String` 类的功能，而不破坏其设计初衷。

>   问：你还知道其他final修饰的类吗？
>
>   答：System、Math、包装类等
>
>   问：它们为什么是final修饰的？
>
>   答：因为它们非常的重要，太基础了，是整个Java的基石，所有设计者将它们设计为不可变的



## String、StringBuffer、StringBuilder、StringJoiner的区别？

String、StringBuffer、StringBuilder是用于表示一串字符，即字符序列。StringJoiner是JDK8引入的一个String拼接工具。

**String**

-   引入版本：JDK1.0

-   不可变的字符序列；底层使用 char[]（JDK8之前），底层使用byte[]（JDK9及其之后）
-   线程安全
-   拼接方式：使用 + 或 concat

**StringBuffer**

-   引入版本：JDK1.0

-   可变的字符序列，默认缓冲区大小16；**JDK1.0声明，线程安全的，效率低；**

-   底层使用 char[]（JDK8之前），底层使用byte[]（JDK9及其之后）
-   拼接方式：append

**StringBuilder**

-   引入版本：JDK1.5

-   可变的字符序列，默认缓冲区大小16；**JDK5.0声明，线程不安全的，效率高；**

-   底层使用 char[]（JDK8之前），底层使用byte[]（JDK9及其之后）
-   拼接方式：append

**源码启示**

-   如果开发中需要频繁的针对字符串进行增、删、改操作，建议使用StringBuilder或StringBuffer替换String，因为String效率低
-   如果开发中，不涉及线程安全问题，建议使用StringBuilder替换StringBuffer。因为使用StringBuilder效率高。
-   如果开发中，大体知道确定要操作的字符的个数，建议使用带int capacity 的构造器。可以避免因为底层频繁扩容导致的性能下降

>   String和StringBuffer为什么是线程安全的？
>
>   String对象是不可变对象。凡是修改都会得到新对象，不同线程的修改会各自得到一个新对象
>
>   StringBuffer的操作方法是同步方法，所以是线程安全的。



## String对象真的不可变吗？

除非利用**反射**操作获取字符串对象内部的**字符数组的引用**，然后修改数组元素，否则字符串对象不可变。

```java
String s1 = "helloworld";
Class<? extends String> clazz = s1.getClass();
Field valueField = clazz.getDeclaredField("value"); // 获取字符数组
valueField.setAccessible(true);
char[] value = (char[]) valueField.get(s1);
value[0] = 'H';
System.out.println(s1);
```



## String有没有长度限制？

有限制。因为字符串内部是字符数组（JDK9 字节），而数组长度是int类型，有大小约束。

Java中数组的最大长度是`Integer.MAX_VALUE - 8`



## String底层实现是怎么样的？

-   JDK9之前，String底层是**char[]**，每个字符占用**2个字节**，采用**UTF16**编码方式。
-   JDK9之前，String底层是**byte[]**，每个字符可能**占用1个或2个字节**。
    -   如果当前字符串所有字符都是Latin1字符集的字符，那么当前字符串每个字符占用1个字节，采用Latin1编码方式。
    -   如果当前字符串有任意一个字符不是Latin1字符集的字符，例如中文、韩文、日文等，那么当前字符串每个字符占用2个字节，采用UTF16编码方式

补充：Latin1字符集，这些字符覆盖了大多数西欧语言，如英语、法语、德语、西班牙语等所需的字母和符号，编码值范围是[0-255]

>   问：Java中一个字符占用几个字节？
>
>   答：如果是char类型的一个字符，无论是什么字符，都是占用2个字节。
>
>   ​		如果是字符串中的一个字符，JDK9之前，每个字符占用1个字节，采用UTF16编码；JDK9之后，每个字符可能占用1个或2个字节，采用Latin1或UTF16编码。
>
>   问：Java中一个汉字占用几个字节？
>
>   答：2个字节



## String如何实现编码和解码？

编码（将字符串转换为字节数组）

1.  **选择字符集**：确定要使用的字符集，例如 UTF-8、ISO-8859-1 等。
2.  **使用 getBytes() 方法**：通过指定字符集将字符串转换为字节数组

```java
import java.nio.charset.StandardCharsets;

public class StringEncodingExample {
    public static void main(String[] args) {
        String originalString = "Hello, World!";
        byte[] encodedBytes = originalString.getBytes(StandardCharsets.UTF_8);
        System.out.println("Encoded bytes: " + new String(encodedBytes));
    }
}
```

解码（将字节数组转换为字符串）

1.  **选择字符集**：确保使用与编码时相同的字符集。
2.  **使用 String(byte[] bytes, Charset charset) 构造函数**：将字节数组转换回字符串。

```java
import java.nio.charset.StandardCharsets;

public class StringDecodingExample {
    public static void main(String[] args) {
        byte[] encodedBytes = "Hello, World!".getBytes(StandardCharsets.UTF_8);
        String decodedString = new String(encodedBytes, StandardCharsets.UTF_8);
        System.out.println("Decoded string: " + decodedString);
    }
}
```

注意：

-   **字符集一致性**：编码和解码时必须使用相同的字符集，否则可能会导致乱码问题。



## String字符串如何进行反转？

方式一：使用 `StringBuilder` 和 `StringBuffer` 提供的**reverse**方法

```java
String original = "Hello, World!";

// 使用 StringBuilder 反转
String reversed = new StringBuilder(original).reverse().toString();

// 使用 StringBuffer 反转
String reversed2 = new StringBuffer(original).reverse().toString();
```

方式二：将字符串转换为**字符数组**，然后通过交换字符位置来实现反转。

```java
String original = "Hello, World!";
char[] charArray = original.toCharArray();

// 数组反转
for(int left=0, right=charArray.length-1; left<right; left++, right--) {
    char temp = charArray[left];
    original[left] = original[right];
    original[right] = temp;
}
String reversed = new String(charArray);
```

方式三：通过递归的方式逐个字符反转字符串

```java
public class StringReverseRecursive {
    public static String reverse(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return reverse(str.substring(1)) + str.charAt(0);
    }

    public static void main(String[] args) {
        String original = "Hello, World!";
        String reversed = reverse(original);
        System.out.println("Reversed string: " + reversed);
    }
}
```

 方式四：使用流（Java 8+）

```java
import java.util.stream.Collectors;

public class StringReverseStream {
    public static void main(String[] args) {
        String original = "Hello, World!";
        String reversed = new StringBuilder(original)
                .chars()
                .mapToObj(c -> String.valueOf((char) c))
                .collect(Collectors.joining())
                .chars()
                .mapToObj(c -> String.valueOf((char) c))
                .collect(Collectors.joining());
        System.out.println("Reversed string: " + reversed);
    }
}
```

## String类的isEmpty和isBlank的区别？

`String` 类提供了两个方法来检查字符串是否为空或空白：`isEmpty()` 和 `isBlank()`。这两个方法的主要区别在于它们对“空白”的定义不同。

-   `isEmpty()`：检查字符串的长度是否为 0。如果**字符串长度为 0**（即没有任何字符），则返回 `true`；否则返回 `false`。

```java
String str1 = "";
String str2 = "   ";
String str3 = "Hello";

System.out.println(str1.isEmpty()); // true
System.out.println(str2.isEmpty()); // false
System.out.println(str3.isEmpty()); // false
```

-   `isBlank()`：检查字符串是否为空白字符串。空白字符串是指只包含空白字符（如空格、制表符、换行符等）或长度为 0 的字符串。如果**字符串为空或仅包含空白字符**，则返回 `true`；否则返回 `false`。

注意！！！`isBlank()` 方法是在 Java 11 中引入的

```java
String str1 = "";
String str2 = "   ";
String str3 = "Hello";
String str4 = "\t\n"; // 包含制表符和换行符

System.out.println(str1.isBlank()); // true
System.out.println(str2.isBlank()); // true
System.out.println(str3.isBlank()); // false
System.out.println(str4.isBlank()); // true
```

## String类中的concat和+有什么区别？

如果是两个""字符串（字面量字符串）拼接，concat会产生新对象，而+操作符会在编译时直接合并为一个字符串

```java
String s1 = "helloworld";
String s2 = "hello" + "world";			// 存在编译器优化
System.out.println(s1 == s2); // true

String s1 = "helloworld";
String s2 = "hello".concat("world");
System.out.println(s1 == s2); // false
```

**实现方式不同**

-   concat方法
    -   是String类中的实例方法，用于将一个字符串追加到当前字符串的末尾。
    -   返回一个新的 `String` 对象，包含连接后的结果
    -   不会修改原始字符串（因为 `String` 是不可变的）
-   **+ 操作符**
    -   在编译时会被转换为 `StringBuilder` 或 `StringBuffer` 的 `append()` 方法调用。
    -   同样返回一个新的 `String` 对象，包含连接后的结果。
    -   适用于多个字符串连接操作，特别是在循环中更高效（通过 `StringBuilder` 优化）。

**性能**

-   concat方法
    -   每次调用都会创建一个新的`String`对象，适合少量字符串连接。
    -   如果频繁调用，可能会导致大量的临时对象创建，影响性能。

-   **+ 操作符**
    -   在编译时会优化为 `StringBuilder` 或 `StringBuffer` 的 `append()` 方法调用。
    -   对于多个字符串连接或在循环中连接字符串时，性能更好，因为它避免了频繁创建新的 `String` 对象

**灵活性**

-   concat方法：只能连接两个字符串，不能直接连接其他类型的数据（如数字、布尔值等），需要先将它们转换为字符串。

```java
String result = "Value is: ".concat(Integer.toString(42)); // 需要显式转换
```

-   **+ 操作符**：更灵活，可以直接连接不同类型的对象。Java 会**自动调用**这些对象的 `toString()` 方法进行转换

```java
String result = "Value is: " + 42; // 自动转换为字符串
```

**空字符串处理**

-   concat方法：如果传入`null`，会抛出`NullPointerException`

```java
String result = "Hello".concat(null);
```

-   **+ 操作符**：如果传入 `null`，会将其视为字符串 `"null"`

```java
String result = "Hello" + null; // "Hellonull"
```

**总结**

-   **concat() 方法**：适合简单的字符串连接操作，特别是当你只需要连接两个字符串且不需要处理 `null` 值时。
-   **+ 操作符**：更灵活，适合多种数据类型的连接，并且在编译时会被优化为更高效的代码，特别是在循环中连接多个字符串时表现更好。



## 字符串拼接什么时候用+，什么时候不推荐用+？

推荐使用+的场景

-   少量字符串拼接

```java
String result = "Hello" + " " + "World";
```

-   编译时常量字符串：如果所有参与拼接的字符串都是编译时常量（即在编译时已知的字符串），Java 编译器会将它们合并为一个常量字符串，不会创建额外的对象。

-   简单表达式：在简单的表达式中，`+` 操作符可以使代码更易读。

```java
String message = "User ID: " + userId;
```

不推荐使用 `+` 的场景

-   **频繁或大量字符串连接**：如果需要频繁或大量连接字符串，特别是在循环中，使用 `+` 会导致大量的临时 `String` 对象被创建，增加垃圾回收的压力，影响性能。

```java
// 不推荐
String result = "";
for (int i = 0; i < 1000; i++) {
    result += "a"; // 每次都会创建新的 String 对象
}

推荐使用StringBuilder 或 StringBuffer：这些类提供了可变的字符序列，避免了频繁创建新对象

// 推荐
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append("a");
}
String result = sb.toString();
```



## :star:String str = new String("hello")创建了几个对象？

一个/两个

1、**如果字符串常量池中有hello这个对象，那么就只创建一个对象**。

原因：因为字符串常量池中有hello对象，直接复用，只会创建一个new String对象

2、**如果字符串常量池中没有hello这个对象，那么就只创建两个对象**。

原因：每次new，必然都会在堆空间上创建一个对象，这里就有一个对象了。字符串常量中没有hello对象，所有会在字符串常量池中创建一个hello对象，这是第二个对象。

```
堆内存:
+-------------------+
|   "hello" (new)   | <- str
+-------------------+
          |
          v
字符串常量池:
+-------------------+
|    "hello"        |
+-------------------+
```



## String类的intern方法有什么用？

1、**查找字符串常量池**

-   `intern()` 方法首先会在字符串常量池中查找是否存在与调用对象内容相同的字符串。
-   如果存在，则返回常量池中该字符串的引用。
-   如果不存在，则将该字符串添加到常量池中，并返回其引用。

2、**确保唯一性**

-   通过 `intern()` 方法，可以确保相同内容的字符串在 JVM 中只有一个副本，从而节省内存并提高比较操作的效率。

```java
String str1 = new String("hello");
String str2 = new String("hello");
String str3 = str1.intern();
String str4 = "hello";

System.out.println(str1 == str2); // false (不同的堆对象)
System.out.println(str1 == str3); // true (str3 引用的是常量池中的 "hello")
System.out.println(str1 == str4); // false (str1 是堆对象，str4 是常量池对象)
System.out.println(str3 == str4); // true (都是常量池中的 "hello")
```

**使用场景**

-   **节省内存**：当应用程序中存在大量重复的字符串时，使用 `intern()` 可以减少内存占用，因为每个唯一的字符串只存储一次
-   **提高字符串比较效率**：使用 `==` 比较两个字符串的引用是否相等比使用 `equals()` 比较内容更高效。如果确保所有字符串都经过 `intern()` 处理，可以使用 `==` 来进行快速比较。

```java
String a = "hello".intern();
String b = "hello".intern();
if (a == b) {
    // 快速比较
}
```

-   **处理用户输入或配置文件**：对于从外部（如用户输入、配置文件）读取的字符串，可以通过 `intern()` 确保它们与程序内部使用的字符串一致，从而避免不必要的重复

注意

1.  **性能开销**：
    -   `intern()` 方法会检查字符串常量池，这可能会带来一定的性能开销，尤其是在处理大量字符串时。因此，应谨慎使用，特别是在性能敏感的应用中。
2.  **JDK 版本差异**：
    -   在 JDK 6 及之前版本中，字符串常量池位于永久代（PermGen），而在 JDK 7 及之后版本中，字符串常量池被移到了堆内存中。这意味着在不同版本的 JDK 中，`intern()` 的行为和性能可能有所不同。
3.  **自动 intern**：
    -   字符串字面量（如 `"hello"`）在编译时会自动被放入字符串常量池，因此不需要显式调用 `intern()`。

# 番外

## 如何在Java中调用外部可执行程序或系统命令？