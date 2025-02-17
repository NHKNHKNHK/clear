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



## String、StringBuffer和StringBuilder的区别？

-   **String**

不可变的字符序列；底层使用 char[]（JDK8之前），底层使用byte[]（JDK9及其之后）

-   **StringBuffer**

可变的字符序列；**JDK1.0声明，线程安全的，效率低；**

底层使用 char[]（JDK8之前），底层使用byte[]（JDK9及其之后）

-   **StringBuilder**

可变的字符序列；**JDK5.0声明，线程不安全的，效率高；**

底层使用 char[]（JDK8之前），底层使用byte[]（JDK9及其之后）

**源码启示**

-   如果开发中需要频繁的针对字符串进行增、删、改操作，建议使用StringBuilder或StringBuffer替换String，因为String效率低
-   如果开发中，不涉及线程安全问题，建议使用StringBuilder替换StringBuffer。因为使用StringBuilder效率高。
-   如果开发中，大体知道确定要操作的字符的个数，建议使用带int capacity 的构造器。可以避免因为底层频繁扩容导致的性能下降



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



# 番外

## 如何在Java中调用外部可执行程序或系统命令？