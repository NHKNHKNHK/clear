# String、StringBuffer、StringBuilder

## 1 String（JDK8为例）

### 1.1 类的声明

```java
 public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence 
```

-   final：String类不可被继承
-   Serializable：可序列化的接口。凡是实现该接口的类的对象就可以通过网络或本地流进行数据的传输
-   Comparable：凡是实现此接口的方法，其对象都可以比较大小。

### 1.2 内部声明的属性

**jdk8：**

```java
private final char value[];  // 存储字符串数据的容器

// private 意味着外面无法直接获取字符数组，而且 String 没有提供 value 的 get 和 set 方法。 
// final：指明此value数组一旦初始化，其地址就不可变了
// final 意味着字符数组的引用不可改变，而且 String 也没有提供方法来修改 value 数组某个元素值 
```

​	因此字符串的字符数组内容也不可变的，即 String 代表着不可变的字符序列。即，**一旦对字符串进行修改，就会产生新对象。** 

**jdk9：**为了节省内存空间，做了优化

```java
private final byte[] value;  // 存储字符串数据的容器

//官方说明：... that most String objects contain only Latin-1 characters. Such characters require only one byte of storage, hence half of the space in the internal char arrays of such String objects is going unused.
//细节：... The new String class will store characters encoded either as ISO-8859-1/Latin-1 (one byte per character), or as UTF-16 (two bytes per character), based upon the contents of the string. The encoding flag will indicate which encoding is used.
```

Java 语言提供对字符串串联符号（"+"）以及将其他对象转换为字符串的特殊支持 （toString()方法）。 

###  1.3 **String 的特性** 

-   *java.lang.String* 类代表字符串。Java 程序中所有的字符串文字（例如 *"hello"* ）都可以看作是实现此类的实例。 
-   字符串是常量，用**双引号**引起来表示。它们的值在创建之后**不能更改**。 
-   字符串 String 类型本身是 final 声明的，意味着我们不能继承 String。 
-   String 对象的字符内容是**存储在一个字符数组 value[]中的**。*"abc"* 等效于 *char[]  data={'h','e','l','l','o'}*。

### 1.4 字符串常量的存储位置

-   字符串常量都存储在字符串常量池（StringTable）中
-   字符串常量池不允许存放两个相同的字符串常量

```java
String s1 = "hello";  // 字面量的定义方式
String s2 = "hello";

System.out.println(s1 == s2);  // true
// 内存中只有 "hello" 对象被创建，同时被 s1 s2 共享
```

-   因为字符串对象设计为不可变，那么所以字符串有常量池来保存很多常量对象。 
-   **JDK6** 中，字符串常量池在**方法区**。**JDK7 开始**，就移到**堆空间**，直到目前 JDK17 版本。 

### 1.5 String不可变性的理解

-   当对字符串变量重新赋值时，需要重新定义一个字符串常量的位置进行赋值，不能在原有的位置进行修改
-   当对现有的字符串进行拼接操作时，需要重新开辟空间保存拼接以后的字符串，不能在原有的位置进行修改
-   当调用字符串的某个方法时（replace()），需要重新开辟空间保存修改以后的字符串，不能在原有的位置进行修改

### 1.6 String实例化的方式

第一种方式：

```java
String s1 = "hello";
```

第二种方式：

```java
String s2 = new String("hello");
```

:::tip 面试题

String s2 = new String("hello"); 在内存中创建了几个对象？

​	一个是堆空间new的对象。另一个是字符串常量池中生成的字面量
:::

### 1.7 字符串的拼接操作：+

```java
String s1 = "hello";  
String s2 = "world";

String s3 = "helloworld";
String s4 = "hello" + "world"; // 常量+常量 结果在常量池中，因为编译期间就可以确定结果
String s5 = s1 + "world";  // s5 字符串内容也 helloworld，s1是变量，"world"常量，变量 + 常量的结果在堆中
// 通过查看字节码文件发现调用了StringBuilder的toString() -->new String()
String s6 = "hello" + s2;
String s7 = s1 + s2;  // s7 字符串内容也 helloworld，s1 和 s2 都是变量，变量 + 变量的结果在堆中

System.out.println(s3 == s4);  // true
System.out.println(s3 == s5);  // false
System.out.println(s3 == s6);  // false
System.out.println(s3 == s7);  // false
System.out.println(s5 == s6);  // false
System.out.println(s5 == s7);  // false

String s8 = s5.intern();  // intern()：把拼接的结果放到常量池中，返回的是字符串常量池中字面量的地址
System.out.println(s3 == s8);  // true
```

-   常量 + 常量：结果仍然在字符串常量池。且常量池中不会存在相同内容的常量。 
    -   注意：常量可能是字面量，也可能是final修饰的常量
-   常量 + 变量 或 变量 + 变量：都会通过new的方式创建一个新的字符串。返回堆空间此字符付出的地址 
-   拼接后调用 intern 方法：返回的是字符串常量池中字面量的地址

```java
final String s1 = "hello";  // final修饰的常量
final String s2 = "world";
String s3 = "helloworld";

String s4 = s1 + "world";  // s4 字符串内容也 helloworld，s1 是常量，"world"常量，常量+常量结果在常量池中
String s5 = s1 + s2;  // s5 字符串内容也 helloworld，s1 和 s2 都是常量，常量+ 常量 结果在常量池中
String s6 = "hello" + "world";// 常量 + 常量 结果在常量池中，因为编译期间就可以确定结果

System.out.println(s3 == s4);  // true
System.out.println(s3 == s5);  // true
System.out.println(s3 == s6);  // true
```

-   常量 + 常量：结果仍然在字符串常量池。且常量池中不会存在相同内容的常量。 
    -   注意：常量可能是字面量，也可能是final修饰的常量

```java
String s1 = "hello";
String s2 = "world";

String s3 = s1.concat(s2);
String s4 = "hello".concat("world");
String s5 = s1.concat("world");

System.out.println(s3 == s4);  // false
System.out.println(s3 == s5);  // false
System.out.println(s4 == s5);  // false
```

-   不管是常量调用concat 方法，还是变量调用，同样不管参数是常量还是变量，总之，调用完concat() 方法都会返回一个新new的对象
-   concat 方法拼接，哪怕是两个常量对象拼接，结果也是在堆

### 1.8 String构造器

```java
public String()  // 初始化新创建的 String 对象，以使其表示空字符序列。 

public String(String original) // 初始化一个新创建的 String 对象，使其表示一个与参数相同的字符序列；换句话说，新创建的字符串是该参数字符串的副本。 

public String(char[] value) // 通过当前参数中的字符数组来构造新的String。 

public String(char[] value,int offset, int count)  // 通过字符数组的一部分来构造新的 String 

public String(byte[] bytes)  // 通过使用平台的默认字符集解码当前参数中的 字节数组来构造新的String 

public String(byte[] bytes,String charsetName)  // 通过使用指定的字符集解码当前参数中的字节数组来构造新的 String。 
    
// String类给出了一系列构造器，但是推荐下面的方式创建 String 对象
// ep.
    String str1 = "hello world";
```

### 1.9 String与其他结构的相互转换

#### 字符串 --> 基本数据类型、包装类

-   Integer 包装类的 public static int parseInt(String s)：可以将由 “数字” 字符组成的字符串转换为整型。 
-   类似地，使用 java.lang 包中的 Byte、Short、Long、Float、Double 类调相应的类方法（例如：parseXxx()）可以将由“数字”字符组成的字符串，转化为相应的基本数据类型。 

#### 基本数据类型、包装类 --> 字符串

-   调用 String 类的 public String valueOf(int n)可将 int 型转换为字符串 
-   相应的 valueOf(byte b)、valueOf(long l)、valueOf(float f)、valueOf(double d)、 valueOf(boolean b)可由参数的相应类型到字符串的转换。 

#### 字符数组 --> 字符串

-   String 类的构造器：String(char[]) 和 String(char[]，int offset，int length) 分别用字符数组中的全部字符和部分字符创建字符串对象。 

#### 字符串 --> 字符数组

```java
public char[] toCharArray()  // 将字符串中的全部字符存放在一个字符数组中的方法。 
```

```java
public void getChars(int srcBegin, int srcEnd, char[] dst, int dstBegin)  // 提供了将指定索引范围内的字符串存放到数组中的方法。
```

#### 字符串 --> 字节数组（编码）

```java
public byte[] getBytes() // 使用平台的默认字符集将此 String 编码为 byte 序列，并将结果存储到一个新的 byte 数组中。 
```

```java
 public byte[] getBytes(String charsetName)  // 使用指定的字符集将此 String 编码到 byte 序列，并将结果存储到新的 byte 数组。 
```

注意：

-   在utf-8字符集中，一个汉字占用3个字节，一个字母占用一个字节
-   在gbk字符集中，一个汉字占用2个字节，一个字母占用一个字节
-   utf-8 与 gbk 都向下兼容了ascii 码 

#### 字节数组 --> 字符串（解码）

```java
String(byte[])  // 通过使用平台的默认字符集解码指定的 byte 数组，构造一个新的 String。 
```

```java
String(byte[]，int offset，int length)  // 用指定的字节数组的一部分，即从数组起始位置 offset 开始取 length 个字节构造一个字符串对象。 
```

```java
String(byte[], String charsetName ) 
new String(byte[], int, int,String  charsetName )  // 解码，按照指定的编码方式进行解码。
```

```java
@Test
public void test01() throws Exception {
	String str = "中国";
 	System.out.println(str.getBytes("ISO8859-1").length);  // 2
 	// ISO8859-1 把所有的字符都当做一个 byte 处理，处理不了多个字节
 	System.out.println(str.getBytes("GBK").length);  // 4   每一个中文都是对应 2 个字节
	System.out.println(str.getBytes("UTF-8").length);  // 6  常规的中文都是 3 个字
 
    /*
     * 不乱码：（1）保证编码与解码的字符集名称一样（2）不缺字节
    */
    System.out.println(new String(str.getBytes("ISO8859-1"), "ISO8859
    -1"));// 乱码
    System.out.println(new String(str.getBytes("GBK"), "GBK"));  // 中国
     System.out.println(new String(str.getBytes("UTF-8"), "UTF-8")); // 中国
}
```

### 1.10 String常用API

#### 系列1：常用方法

-   boolean isEmpty()：字符串是否为空（禁止使用null调用该方法，避免NullPointerException）
-   int length()：返回字符串的长度（即char[]的长度）
-   String concat(xx)：拼接 
-   boolean equals(Object obj)：比较字符串是否相等，区分大小写 
-   boolean equalsIgnoreCase(Object obj)：比较字 符串是否相等，**不区分大小写** 
-   int compareTo(String other)：**比较字符串大小**（重写了Comparable接口），区分大小写，按照 Unicode 编码值比较大小 
-   int  compareToIgnoreCase(String other)：比较字符串大小，不区分大小写 
-   String toLowerCase()：将字符串中大写字母转为小写 
-   String  toUpperCase()：将字符串中小写字母转为大写 
-   String trim()：去掉字符串前后空白符 
-   public String intern()：结果在常量池中共享

####  **系列 2：查找** 

-   boolean contains(xx)：是否包含 xx 
-   int indexOf(xx)：从前往后找当前字符串中 xx，即如果有返回第一次出现的下标，要是**没有返回-1** 
-   int indexOf(String str, int fromIndex)：返回指定子字符串在此字符串中第一次出现处的索引，从指定的索引开始 
-   int lastIndexOf(xx)：从后往前找当前字符串中 xx，即如果有返回最后一次出现的下标，要是**没有返回-1** 
-   int lastIndexOf(String str, int fromIndex)：返回指定子字符串在此字符串中最后一次出现处的索引，从指定的索引开始反向搜索。 

#### 系列 3：字符串截取

-   String substring(int beginIndex) ：返回一个新的字符串，它是此字符串的从 beginIndex 开始截取到最后的一个子字符串。 
-   String substring(int  beginIndex, int endIndex) ：返回一个新字符串，它是此字符串从 beginIndex 开始截取到 endIndex(不包含)的一个子字符串

注意：

​	**左闭右开**

####  **系列 4：和字符/字符数组相关**  

-   char charAt(index)：返回[index]位置的字符
-   char[]  toCharArray()： 将此字符串转换为一个新的字符数组返回 
-   static String  valueOf(char[] data) ：返回指定数组中表示该字符序列的 String 
-   static String valueOf(char[] data, int offset, int count) ： 返回指定数组中表示该字符序列的 String 
-   static String copyValueOf(char[] data)： 返回指定数组中表示该字符序列的 String 
-   static String copyValueOf(char[] data, int  offset, int count)：返回指定数组中表示该字符序列的 String

####  **系列 5：开头与结尾**  

-   boolean startsWith(xx)：测试此字符串是否以指定的前缀开始
-   boolean startsWith(String prefix, int toffset)：测试此字符串从指定索引开始的子字符串是否以指定前缀开始 
-   boolean endsWith(xx)：测试此字符串是否以指定的后缀结束

#### **系列 6：替换**  

-   String replace(char oldChar, char newChar)：返回一个新的字符串，它是通过用 newChar 替换此字符串中出现的所有 oldChar 得到的。 不支持正则。 
-   String replace(CharSequence target, CharSequence replacement)：使用指定的字面值替换序列替换此字符串
-   所有匹配字面值目标序列的子字符串。
-   String replaceAll(String regex, String replacement)：使用给定的replacement 替换此字符串所有匹配给定的正则表达式的子字符串。
-   String replaceFirst(String regex, String replacement)：使用给定的 replacement  替换此字符串匹配给定的正则表达式的第一个子字符串。

```java
@Test
public void test1(){
     String str1 = "hello244world.java;887";
     // 把其中的非字母去掉
     str1 = str1.replaceAll("[^a-zA-Z]", "");
     System.out.println(str1);
     String str2 = "12hello34world5java7891mysql456";
     // 把字符串中的数字替换成,，如果结果中开头和结尾有，的话去掉
     String string = str2.replaceAll("\\d+", ",").replaceAll("^,|,$","");
     System.out.println(string);
}
```

### 字符串总结

String类为final类，不可被继承，位于`java.lang`包下

字符串特点：

-   字符串不可变，它们值在创建后即不能被改变，但是**可以被共享**
-   字符串效果上相当于字符数组（**char[]**）,但是底层原理是字节数组（byte[]）
    -   JDK8及之前是字符数组，JDK9及之后是字节数组

通过 new 创建的 String 对象，每一次new都会申请一个内存空间。虽然内容相同，但是地址值不同

```java
// ep.
	char[] chs = {'a', 'b', 'c'};
	String s1 = new String(chs);
	String s2 = new String(chs);	// s1 != s2
// 上面的代码，jvm会首先创建一个字符数组，然后每次new的时候都会有一个新地址，只不过 s1、s2 中的字面量是相同的
```

以 "....." 方式给出的字符串，只需要字符序列相同（大小写与顺序），无论在程序中出现了几次，jvm都只有建立一个String对象，并在字符串常量池中维护。

```java
// ep.
	String s1 = "hello";
	String s2 = "hello";	// s1 == s2
```

补充：

使用== 做比较时

-   基本类型：比较数据值
-   引用类型：比较地址值（引用）

String 是对象，是引用类型，它比较值（内容）用 equals() 方法

## 2 StringBuffer

### **String、StringBuffer、StringBuilder的区别**

-   **String**

不可变的字符序列；底层使用 char[]（JDK8之前），底层使用byte[]（JDK9及其之后）

-   **StringBuffer**

可变的字符序列；**JDK1.0声明，线程安全的，效率低；**

底层使用 char[]（JDK8之前），底层使用byte[]（JDK9及其之后）

-   **StringBuilder**

可变的字符序列；**JDK5.0声明，线程不安全的，效率高；**

底层使用 char[]（JDK8之前），底层使用byte[]（JDK9及其之后）

### StringBuilder/StringBuffer的可变性分析

String中

```java
String s1 = new String();  // char[] value = new char[0];
String s2 = new String("abc");  // char[] value = new char[]{'a','b','c'};
```

针对StringBuilder来说

-   内部属性有

```java
char[] value;   // 存储字符序列
int count;  // 实际存储的字符个数
```

```java
StringBuilder sb1 = new StringBuilder();  // char[] value = new char[16];
										// 无参构造器初始可容纳16个字符
// 源码如下								 // 通过length()获取实体中存放字符序列的长度
										// 通过capacity()方法获取当前实体的实际容量
/**
* 构造一个没有字符的字符串构造器初始容量为16个字符
*/
public StringBuilder() {
    super(16);
}
/**
* 创建指定容量的AbstractStringBuilder
*/
AbstractStringBuilder(int capacity) {
    value = new char[capacity];
}
```

```java
StringBuilder sb2 = new StringBuilder("abc");  // char[] value = new char[16 + "abc".length];

// 源码如下

public StringBuilder(String str) {
    super(str.length() + 16);
    append(str);
}

AbstractStringBuilder(int capacity) {
    value = new char[capacity];
}

@Override
public StringBuilder append(String str) {
    super.append(str);
    return this;
}
```

```java
// StringBuilder对象的长度
StringBuilder sb2 = new StringBuilder("abc");
        sb2.length();

// 源码如下
@Override
public int length() {
    return count;
}
```

```java
StringBuilder sb2 = new StringBuilder("abc");
sb2.append("a");
sb2.append("b");
// 如果不断追加就会涉及到容量不足的问题，此时就需要扩容
// 一旦 count 超过 value.length 时，就需要扩容：默认扩容为原有容量2倍+2
// 并将原有value数组中的元素复制到新的数组中。
```

### 源码启示

-   如果开发中需要频繁的针对字符串进行增、删、改操作，建议使用StringBuilder或StringBuffer替换String，因为String效率低
-   如果开发中，不涉及线程安全问题，建议使用StringBuilder替换StringBuffer。因为使用StringBuilder效率高。
-   如果开发中，大体知道确定要操作的字符的个数，建议使用带int capacity 的构造器。可以避免因为底层频繁扩容导致的性能下降

### StringBuilder或StringBuffer常用方法

#### 常用 API 

-   StringBuffer append(xx)：提供了很多的 append()方法，用于进行字符串 追加的方式拼接 
-   StringBuffer delete(int start, int end)：删除[start,end)之间字符 
-   StringBuffer deleteCharAt(int index)：删除[index]位置字符
-   StringBuffer replace(int start, int end, String str)：替换[start,end)范围的字符序列为 str 
-   void setCharAt(int index, char c)：替换[index]位置字符 
-   char  charAt(int index)：查找指定 index 位置上的字符
-   StringBuffer insert(int  index, xx)：在[index]位置插入 xx 
-   int length()：返回存储的字符数据的长度 
-   StringBuffer reverse()：反转 

#### **其它 API** 

-   int indexOf(String str)：在当前字符序列中查询 str 的第一次出现下标 
-   int indexOf(String str, int fromIndex)：在当前字符序列[fromIndex,最后]中查询 str 的第一次出现下标
-   int lastIndexOf(String str)：在当前字符序列中查询 str 的最后一次出现下标 
-   int lastIndexOf(String str, int fromIndex)：在当前字符序列[fromIndex,最后]中查询 str 的最后一次出现下标 
-   String  substring(int start)：截取当前字符序列[start,最后]
-   String substring(int  start, int end)：截取当前字符序列[start,end) 
-   String toString()：返回此序列中数据的字符串表示形式 
-   void setLength(int newLength) ：设置当前字符序列长度为 newLength



### demo

例1：

使用StringBuffer手写 toString方法

```java
package com.stringbuilder;

public class StringBufferDemo {
    public static void main(String[] args) {
        Integer[] arr = new Integer[]{};
        System.out.println(toString(arr));  // []
        Integer[] arr2 = null;
        System.out.println(toString(arr2)); // null
        String[] arr3 = {"迪丽热巴", "古力娜扎"};
        System.out.println(toString(arr3));  // [迪丽热巴, 古力娜扎]
    }

    /**
     * 使用StringBuffer 手写 toString方法
     */
    public static <T> String toString(T[] arr) {
        if (arr == null) {
            return "null";
        }
        StringBuffer sb = new StringBuffer("[");
        int len = arr.length;
        if (len != 0) {
            for (int i = 0; i < len; i++) {
                sb.append(arr[i] +( i == len - 1 ? "" : ", "));
            }
        }
        sb.append("]");
        return sb.toString();
    }
}
```