# Java异常体系

## 什么是异常

### **异常** 

指的是程序在执行过程中，出现的非正常情况，如果不处理最终会导致 JVM 的非正常停止。 

异常指的并不是语法错误和逻辑错误。语法错了，编译不通过，不会 产生字节码文件，根本不能运行。 

代码逻辑错误，只是没有得到想要的结果，例如：求 a 与 b 的和，你 写成了 a-b

###  异常的抛出机制

Java 中是如何表示不同的异常情况，又是如何让程序员得知，并处理异常的呢？ 

Java 中把不同的异常用不同的类表示，一旦发生某种异常，就*创建该异常类型的* *对象*，并且抛出（throw）。然后程序员可以捕获(catch)到这个异常对象，并处理；如果没有捕获(catch)这个异常对象，那么这个异常对象将会导致程序终止 。

## Java异常的体系结构

### Throwable

`Throwable`是Java中所有错误和异常的基类。它是一个类层次结构的根，包括`Error`和`Exception`两个子类。

`Throwable`类有两个主要的子类：

-   `Error`：表示严重的错误，通常是由于系统级问题导致的，例如`OutOfMemoryError`、`StackOverflowError`等。`Error`通常是不可恢复的，程序无法处理它们。
-   `Exception`：表示可恢复的异常，通常是由于程序逻辑错误或外部条件导致的。`Exception`可以进一步分为两种类型：
    -   **受检异常（Checked Exception）**：这些异常在**编译时必须被捕获或声明抛出，否则编译器会报错**。例如`IOException`、`SQLException`等。
    -   **非受检异常（Unchecked Exception）**：这些异常不需要在编译时捕获或声明抛出，编译器不会强制要求处理它们。通常是由于编程错误导致的，例如`NullPointerException`、`ArrayIndexOutOfBoundsException`等。

**Throwable中的常用方法**

```java
/**
* 获取发生异常的原因（获取异常的详细描述信息）
*/
public String getMessage() {
	return detailMessage;
}

/**
* 打印异常的详细信息（打印异常的堆栈跟踪信息）
* 包含了异常的类型、异常的原因、异常出现的位置、在开发和调试阶段都得使用printStackTrace。
*/
public void printStackTrace() {
	printStackTrace(System.err);
}

/*
* 获取导致当前异常的原因（如果有的话）
**/
public synchronized Throwable getCause() {
        return (cause==this ? null : cause);
}
```

​	在Java中，异常处理是通过`try-catch-finally`语句块来实现的。可以使用`try`块来包含可能抛出异常的代码，然后使用`catch`块来捕获并处理异常，最后可以使用`finally`块来执行清理操作。

### Error和Exception

Throwable 可分为两类：Error 和 Exception。分别对应着 *java.lang.Error* 与 *java.lang.Exception* 两个类。 

```java
java.lang.Throwable:异常体系的根父类
	|---java.lang.Error:错误。Java虚拟机无法解决的严重问题。如JVM系统内部错误，资源耗尽等严重情况
							一般不编写针对性代码进行处理
		|----StackOverflowError、OutOfMemroyError
	
	// 常见异常
	|---java.lang.Exception:异常。我们可以编写针对性代码进行处理。
		|----编译时异常：（受检异常、checked异常）在执行javac.exe命令时，出现的异常
			|----ClassNotFoundException
			|----FileNotFoundException
			|----IOException
			|---- ParseException（解析异常）
		|----运行时异常：（非受检异常、unchecked异常）在执行java.exe命令时，出现的异常
			|----ArrayIndexOutOfBoundsException（数组索引越界）
			|----NullPointerException（空指针异常）
			|----ClassCastException（类型转换异常）
			|----NumberFormatException（数字格式化异常）
			|----InputMismatchException
			|----ArithmeticException（算数异常）
			|----IllegalArgumentException（参数错误，比如方法入参类型错误）
```

### 常见的Error

最常见的就是 VirtualMachineError，它有两个经典的子类：

​	StackOverflowError、OutOfMemoryError

```java
public class ErrorTest {

    @Test
    public void testStackOverError() {
        recursion();  // StackOverflowError（栈内存溢出）
    }

    // 没有出口的递归
    public void recursion() {
        recursion();
    }

    @Test
    public void testOutOfMemoryError01() {
        // OutOfMemoryError
        // 方式一  
        int[] arr = new int[Integer.MAX_VALUE];
    }

    @Test
    public void testOutOfMemoryError02() {
        // 方式一
        StringBuilder s = new StringBuilder();
        while (true) {
            s.append("hello");
        }
    }
}
```

### 常见编译时异常

```java
/**
    编译时异常（受检异常），不是RuntimeException或其子类的异常
    编译阶段就会报错，必须处理，或者代码不通过
 */
public class CompileExceptionDemo  {
    public static void main(String[] args) throws ParseException{
        String data = " 2020-04-10 14:25:25";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date d = simpleDateFormat.parse(data);  // RuntimeException 日期解析异常，必须将其抛出
        System.out.println(d);
    }
}
```



```java
public class CompilationException {
    @Test
    public void test1() {
        try {
            Thread.sleep(1000);  // InterruptedException
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void test2() {
        try {
            Class.forName("java.lang.String");  // ClassNotFoundException
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void test3() {
        try {
            // FileNotFoundException
            FileInputStream fis = new FileInputStream("hello.txt");
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void test4() {
        try {
            DriverManager.getConnection("...");  // SQLException
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }

    @Test
    public void test5() {
        try {
            FileInputStream fis = new FileInputStream("hello.txt");  // FileNotFoundException
            fis.read();  // IOException
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

```





### 常见运行时异常

```java
public class RunTimeExceptionTest {

    @Test
    public void test1() {
        int[] arr = {1, 2, 3};
        System.out.println(arr[3]);  // ArrayIndexOutOfBoundsException 数组角标越界异常
        // 在开发中，数组的越界异常是不能出现的，一旦出现了，就必须要修改我们编写的代码
    }

    @Test
    public void test2() {
        String srt = null;
        System.out.println(srt.equals("hello"));  // nullPointerException 空指针异常
    }

    @Test
    public void test3() {
        Object n = 15;
        String str = (String) n;  // ClassCastException
    }

    @Test
    public void test4() {
        String s = "12ab";
        Integer.parseInt(s);  // NumberFormatException
    }

    @Test
    public void test5() {
        Scanner sc = new Scanner(System.in);
        System.out.print("请输入一个整数:");
        int n = sc.nextInt();// 我们输入一个非整数，让程序报错 InputMismatchException
        sc.close();
    }

    @Test
    public void test6() {
        System.out.println(10 / 0);  // ArithmeticException
    }
}
```

## 异常的处理

​	在编写程序时，经常要在可能出现错误的地方加上检测的代码，如进行 x/y 运算时，要检测分母为0，数据为空，输入的不是数据而是字符等。过多的 if-else 分支会导致程序的代码加长*、*臃肿，可读性差，程序员需要花很大的精力“堵漏洞”。因此采用异常处理机制。

**Java异常处理**

​	Java 采用的异常处理机制，是**将异常处理的程序代码集中在一起**，与正常的程序代码分开，使得程序简洁、优雅，并易于维护。

**Java异常处理方式**

-   方式一：**try-catch-finally**
-   方式二：**throws+异常处理**

### 方式 1：捕获异常（try-catch-finally）

-   Java 程序的执行过程中如出现异常，会生成一个异常类对象，该异常对象 将被提交给 Java 运行时系统，这个过程称为*抛出**(throw)**异常*。 
-   如果一个方法内抛出异常，该异常对象会被抛给调用者方法中处理。如果异常没有在调用者方法中处理，它继续被抛给这个调用方法的上层方法。这个过程将一直继续下去，直到异常被处理。这一过程称为*捕获**(catch)**异常*。 
-   如果一个异常回到 main()方法，并且 main()也不处理，则程序运行终止。 

Java 提供了异常处理的**抓抛模型**。 

过程一：“抛”

​	程序在执行的过程中，一旦出现异常，就会在出现异常的代码处，生成对应的异常类对象，并将此对象抛出，**一旦抛出，此程序就不执行其后的代码了**

过程二：“抓”

​	针对与过程一中抛出的异常对象，进行捕获处理。此捕获处理的过程，就被陈为抓，**一旦将异常进行了处理，代码就可以继续执行。**

**基本结构**

```java
try {
	// 可能产生异常的代码
} catch (异常类型1 e) {s
     //当产生异常类型1 型异常时的处置措施
} catch (异常类型2 e) {
     //当产生异常类型2 型异常时的处置措施
} finally{
	//无论是否发生异常，都无条件执行的语句
}

// 使用细节
1.将可能出现异常的代码声明在try语句中，一旦代码发现异常，就会自动生成对应的异常类对象，并将此对象抛出
2.针对try语句抛出的异常类对象，使用catch语句进行匹配。一旦匹配上，就进入catch语句块进行处理（即捕获），
  一旦处理结束，代码就可继续往下执行。如果匹配不上，那么JVM 将会终止当前方法的执行，并把异常对象“抛”给调用者。如果调用者不处理，程序就挂了。
3.如果声明了多个catch结构，不同的异常类型在不存在子父类关系的情况下，谁声明在上面，谁声明在下面都可以
  如果多个异常类型满足子父类关系，则必须将子类声明在父类结构的上面。否则，报错。
4.catch中异常处理的方式：
	1）自己编写输出的语句
	2） printStackTrace()：打印异常的详细信息。（开发中推荐）
	3）getMessage()：获取发生异常的原因
5.try中声明的变量，作用域只在try结构内部局部有效
6.try-catch结构是可以嵌套使用的
```

**开发经验：**

1）对于运行时异常：

-   开发中，通常就不进行显示处理
-   一旦在程序执行中，出现了运行时异常，那么就根据异常的提示信息修改代码即可（即**运行时异常一般不显示处理**）

2）对于编译时异常：

-   一定要进行处理。否则编译不通过

#### catch的使用

```java
public class ExceptionHandleTest {
    @Test
    public void test1() {
        System.out.println("程序开始运行");
        String friends[] = {"lisa", "rose", "jisoo","jennie"};
        try {
            for (int i = 0; i <= 5; i++) {
                System.out.println(friends[i]);
            }
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("索引越界");
        }
        System.out.println("程序结束");
    }
}
```

```
# 结果如下
程序开始运行
lisa
rose
jisoo
jennie
索引越界
程序结束
```

#### finally的使用

```java
public class FinallyTest {
    @Test
    public void test1() {
        System.out.println("程序开始运行");
        String str = "abc";
        try {
            int i = Integer.parseInt(str);
        } catch (NumberFormatException e) {
            e.printStackTrace();
            System.out.println(10 / 0);  // 在catch存在异常
        }
        System.out.println("程序结束");
    }

    @Test
    public void test2() {
        System.out.println("程序开始运行");
        String str = "abc";
        try {
            int i = Integer.parseInt(str);
        } catch (NumberFormatException e) {
            e.printStackTrace();
            System.out.println(10 / 0);  // 在catch存在异常
        } finally {
            System.out.println("程序结束");
        }
    }
}
```

```
# test1结果

程序开始运行
java.lang.NumberFormatException: For input string: "abc"
	at java.lang.NumberFormatException.forInputString(NumberFormatException.java:65)
	at java.lang.Integer.parseInt(Integer.java:580)
	at java.lang.Integer.parseInt(Integer.java:615)

java.lang.ArithmeticException: / by zero


# test2结果
程序开始运行
java.lang.NumberFormatException: For input string: "abc"
	at java.lang.NumberFormatException.forInputString(NumberFormatException.java:65)
	at java.lang.Integer.parseInt(Integer.java:580)
	at java.lang.Integer.parseInt(Integer.java:615)
	at com.clear.异常处理.FinallyTest.test2(FinallyTest.java:24)
程序结束
java.lang.ArithmeticException: / by zero

```

通过观察发现，当catch语句中存在异常时，接下来的代码将不会执行（这是我们为什么在test1中看不到输出
“程序结束”的原因），无论catch是否存在异常，finally语句中的代码一定会被执行

#### 使用细节

-   深刻理解：无论try中或catch是否存在仍未被处理的异常，无论try中是否存在return语句等，finally中声明的语句都一定要被执行
-   finally语句和catch语句是可选的，但finally语句不能单独使用。

**什么样的代码我们一定需要在finally中声明呢？**

1、在开发中，有一些资源（比如：IO流、数据库连接、Socket连接等资源），在使用完以后，必须显示的进行关闭操作，否则GC不会自动的回收这些资源。进而导致内存的泄露。

2、为了保证这些资源在使用完以后，不管是否出现了未被处理的异常情况下，这些资源都能被关闭。我们必须将这些操作声明在finally中

#### 异常处理体会

-   前面使用的异常都是 **RuntimeException类或是它的子类**，这些类的异常的特点是：即使**没有使用 try 和 catch 捕获，Java 自己也能捕获，并且编译通过** ( 但运行时会发生异常使得程序运行终止 )。所以，对**于这类异常，可以不作处理**，因为这类异常很普遍，若全处理可能会对程序的可读性和运行效率产生影响。 
-   如果抛出的**异常是 IOException 等类型的非运行时异常，则必须捕获，否则编译错误**。也就是说，我们必须处理编译时异常，将异常进行捕捉，转化为运行时异常。 

### 方式2：声明抛出异常类型（throws）

如果在编写方法体的代码时，某句代码可能**发生某个编译时异常**，**不处理编译不通过**，但是在当前方法体中可能不适合处理或无法给出合理的处理方式，则此方法应**显示地声明抛出异常**，表明该方法将不对这些异常进行处理，而**由该方法的调用者负责处理**。

**基本格式**

```java
修饰符 返回值类型 方法名(参数列表) throws 异常类型1,异常类型2....{

}
```

#### 异常抛出机制

举例

```java
import java.io.IOException;

public class ThrowsTest  {
    public static void main(String[] args) throws IOException {
        method1();  //main方法中，仍不处理异常，异常抛给了OS
                    // 若该方法异常，且main中，仍不处理异常，会导致程序终止
    }

    public static void method1() throws IOException{  // 将异常抛给方法调用者
        method2();
    }
    public static void method2() throws IOException{  // 将异常抛给方法调用者
        method3();
    }
    public static void method3() throws IOException{  // 将异常抛给方法调用者

    }
}
```



#### 方法重写中throws的要求

方法重写时，对于方法签名是有严格要求的。

1）父类被重写的方法与子类重写的**方法名和形参列表必须相同**

2）子类重写的方法的权限修饰符**不小于**父类被重写的方法的权限修饰符	

​	注意：**子类不能重写父类中声明为private权限修饰的方法**

3）返回值类型

​	父类被重写的方法返回值类型为**void**，则子类重写的方法的返回值类型**必须为void**

​	父类被重写的方法返回值类型为**基本数据类型**，则子类重写的方法返回值类型**必须与父类一致**

​	父类被重写的方法返回值累心为引用数据类型，则子类重写的方法的返回值类型可以与被重写的方法的返回值类型相同，也可以是被重写的方法的返回值类型的子类

4）子类重写的方法抛出的异常可以与父类被重写的方法抛出的异常类型相同，或是被重写的方法抛出的异常类型的子类



5）方法体：没有要求。但是根据需要，子类重写的方法的方法体必然与父类被重写的方法的方法体不同，要不然就没有重写的必要了

**对于throws异常列表的要求**

如果父类被重写方法的方法签名后面没有 “throws 编译时异常类型”，那么重写方法 时，方法签名后面也不能出现“throws 编译时异常类型”。 

如果父类被重写方法的方法签名后面有 “throws 编译时异常类型”，那么重写方法 时，throws 的编译时异常类型必须 <= 被重写方法 throws 的编译时异常类型，或者不 throws 编译时异常。 

方法重写，对于“throws运行时异常类型”没有要求

例子

```java
import java.io.FileNotFoundException;
import java.io.IOException;

public class OverrideTest {
    public static void main(String[] args) {
        Father f = new Son();  // 多态
        try {
            f.method1();
        } catch (IOException e) {  // 编译看左边，执行看左边，需要捕获编译时异常，因此匹配父类异常
            e.printStackTrace();
        }
    }
}

class Father {
    protected  void method1() throws IOException {

    }
}

class Son extends Father {
    @Override
    // 重写的方法的权限修饰符不小于父类
    public void method1() throws FileNotFoundException { // 重写的方法抛出的IOException异常类型的子类
        
    }
}
```

**trhows的方式是否真正的处理了异常？**

从编译是否能通过的角度来看，看成是给出了异常万一要是发生时候的解决方案。此方案为就是，继续向上抛出（throws）

但是，此throws的方式，仅是将可能出现的异常抛给方法调用者。此调用者仍然需要考虑如何处理相关异常。从该角度上来看，throws的方式不算是真正上处理了异常。（可以简单理解为将编译时异常转为运行时异常）



### 两种异常处理方式的选择

对于异常，使用相应的处理方式。此时的异常，主要指的是编译时异常。 

如果程序代码中，涉及到资源的调用（流、数据库连接、网络连接等），则必须考使用 try-catch-finally 来处理，保证不出现内存泄漏。 

如果父类被重写的方法没有 throws 异常类型，则子类重写的方法中如果出现异常， 只能考虑使用 try-catch-finally 进行处理，不能 throws。

开发中，方法 a 中依次调用了方法 b,c,d 等方法，方法 b,c,d 之间是递进关系。此时，如果方法 b,c,d 中有异常，我们通常选择使用 throws，而方法 a 中通常选择使用 try-catch-finally。 



## 手动抛出异常对象 trhow

Java 中异常对象的生成有两种方式： 

-   由虚拟机**自动生成**：程序运行过程中，虚拟机检测到程序发生了问题，那么针对当前代码，就会在后台自动创建一个对应异常类的实例对象并抛出。 

-   由开发人员**手动创建**：new 异常类型([实参列表]);，如果创建好的异常对象不抛 出对程序没有任何影响，和创建一个普通对象一样，但是一旦 throw 抛出，就会对程序运行产生影响了


**使用格式** 

```
throw new 异常类名(参数); 
```

-   throw 语句抛出的异常对象，和 JVM 自动创建和抛出的异常对象一样。 
-   如果是编译时异常类型的对象，同样需要使用 throws 或者 try...catch 处理，否则编译 不通过。 
-   如果是运行时异常类型的对象，编译器不提示。（运行时异常，在开发者，不显示处理）
-   可以抛出的异常必须是 Throwable 或其子类的实例。下面的语句在编译时将会产生语法错误： 

```
throw new String("want to throw"); 
```

 **使用注意点：** 

无论是编译时异常类型的对象，还是运行时异常类型的对象，如果没有被try..catch 合理的处理，都会导致程序崩溃。 

throw 语句会导致程序执行流程被改变，throw 语句是明确抛出一个异常对象，因此它*下面的代码将不会执行*。

如果当前方法没有 try...catch 处理这个异常对象，throw 语句就会*代替* return语句提前终止当前方法的执行，并返回一个异常对象给调用者。 

演示

```java
public class ThrowTest {
    public static void main(String[] args) {
        Student s1 = new Student();
        try {
            s1.regist(-10);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

class Student {
    int id;
    public void regist(int id) throws Exception {
        if (id > 0) {
            this.id = id;
        } else {
            // 手动抛出异常类的对象
            throw new Exception("输入的id非法");
        }
    }
}
```

```
# 输出结果
java.lang.Exception: 输入的id非法
	at com.clear.异常处理.Student.regist(ThrowTest.java:25)
	at com.clear.异常处理.ThrowTest.main(ThrowTest.java:7)

```

### **1、为什么需要手动抛出异常？**

在实际的开发过程中。如果出现不满足具体场景的代码问题，我们就有必要手动抛出一个指定类型的异常对象。



### **2、如何理解“自动”vs“手动”抛出异常对象？**

1）过程1：“抛”

​	“自动抛”：程序在执行的过程中，一旦出现异常，就会在出现异常的代码出，自动生成对于异常类的对象，并将此对象抛出。

​	“手动抛”：程序在执行的过程中，不满足指定条件的情况下，我们主动的使用“ **throw + 异常类对象** ”的方式抛出异常对象。

2）过程2：“抓”

​	狭义上讲：try-catch的方式捕获异常，并处理。

​	广义上讲：把“抓”理解为“处理”。则此时对应着异常处理的两种方式。一：try-catch-finally 二：throws



### **3、如何实现手动抛出异常？**

在方法内部，满足指定条件的情况下，使用" throw 异常类对象 "的方式抛出。



### **4、注意点：throw后的代码不能被执行，编译不通过**

```java
public void regist(int id) throws Exception {
    if (id > 0) {
        this.id = id;
    } else {
        // 手动抛出异常类的对象
        throw new Exception("输入的id非法");
        //System.out.println("throw后面的代码编译不通过");
    }
}
```

### **5、面试题：throw和throws的区别？**

-   throws使用于方法声明（方法签名）处，指明将产生的异常向上一层抛出（抛给方法调用者）。

-   trhow使用于方法内部，后面紧跟着的是异常类对象，表示手动抛出指定的异常类对象。
-   throws是用来处理异常对象的
-   throw是用来产生异常对象的

演示

```java
public class ReturnExceptionDemo {

    static void methodA() throws Exception {
        try {
            System.out.println("进入方法A");
            throw new Exception("制作异常");
        } finally {
            System.out.println("用A方法的finally");
        }
    }

    static void methodB() {
        try {
            System.out.println("进入方法B");
            return;
        } finally {
            System.out.println("用B方法的finally");
        }
    }

    public static void main(String[] args) {
        try {
            methodA();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        methodB();
    }
}

```

```
# 输出结果如下
进入方法A
用A方法的finally
制作异常
进入方法B
用B方法的finally
```


## 自定义异常

### 为什么需要自定义异常类 

​	Java 中不同的异常类，分别表示着某一种具体的异常情况。那么**在开发中总是有些异常情况是核心类库中没有定义好的，此时我们需要根据自己业务的异常情况来定义异常类**。例如年龄负数问题，考试成绩负数问题，某员工已在团队中等。

### 如何使用自定义异常类

-   在具体的代码中，满足指定条件的情况下，需要手动的使用“ throw + 自定义异常类的对象 ”方式，将异常对象抛出。

-   如果自定义的异常类是非运行时异常，则必须考虑如何处理此异常类的对象。

    ​	具体做法：try-catch-finally     或    throws

### 自定义异常类常规步骤

-   1）要继承一个现有的异常体系 
    -   自定义一个编译时异常类型：自定义类继承 `java.lang.Exception`。 （一般情况）
    -   自定义一个运行时异常类型：自定义类继承 `java.lang.RuntimeException`。 

-   2）通常提供几个重载的构造器。建议大家提供至少两个构造器，一个是无参构造，一个是(String  message)构造器。 

-   3）提供一个**全局常量**，声明为 `static final long serialVersionUID`

### 注意点

-   自定义的异常只能通过 **throw** 抛出。 
-   **自定义异常最重要的是异常类的名字和 message 属性**。当异常出现时，可以根据名字判断异常类型。
    -   比如：TeamException("成员已满，无法添加");  TeamException("该员工已是某团队成员");
-   **自定义异常对象只能手动抛出**。抛出后由 try..catch 处理，也可以甩锅 throws 给调用者，如果调用者是main，main方法依然 throws，则程序异常终止。

### 演示1：自定义非受检异常

```java

/**
 * ClassName: NoLifeValueException
 * Description:
 *  自定义异常类 NoLifeValueException继承自RuntimeException
 *      提供空参和有参构造器
 *      在有参构造器中，调用父类的有参构造器，把异常信息传入
 */
public class NoLifeValueException extends RuntimeException {  
    // 开发情况下一般是不继承RuntimeException
    
    static final long serialVersionUID = -7034897166939L;

    public NoLifeValueException() {
    }

    public NoLifeValueException(String message) {
        super(message);
    }
}
```

```java
/**
 * ClassName: Person
 * Description:
 *      属性：名称name、生命值lifeValue
 *      提供get、set方法
 *          在setLifeValue方法中，首先判断lifeValue，如果为负数，抛出 NoLifeValueException异常
 *              异常信息为 生命值不能为负数:xx
 *      提供空参和有参构造器（使用set方法给name、lifeValue赋值）
 */
public class Person {
    private String name;
    private int lifeValue;

    public Person() {
    }

    public Person(String name, int lifeValue) {
        setName(name);
        setLifeValue(lifeValue);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getLifeValue() {
        return lifeValue;
    }

    public void setLifeValue(int lifeValue) {
        if (lifeValue < 0) {
            throw new NoLifeValueException("生命值不能为负数:" + lifeValue);
        }
        this.lifeValue = lifeValue;
    }
}
```

```java
/**
 * 测试类
 * 1、使用满参构造器创建Person对象，生命值传入一个负数
 * 2、使用空参构造器创建对象
 *      调用setLifeValue(int lifeValue)方法，传入一个正数
 *      调用setLifeValue(int lifeValue)方法，传入一个负数
 */
public class Exer3 {
    public static void main(String[] args) {
        // 1、使用满参构造器创建Person对象，生命值传入一个负数
        Person s1 = new Person("Tom",-10);
    }
}
```

```
# 1、使用满参构造器创建Person对象，生命值传入一个负数
# 测试结果

Exception in thread "main" com.clear.异常处理.exer3.NoLifeValueException: 生命值不能为负数:-10
	at com.clear.异常处理.exer3.Person.setLifeValue(Person.java:38)
	at com.clear.异常处理.exer3.Person.<init>(Person.java:21)
	at com.clear.异常处理.exer3.Exer3.main(Exer3.java:13)

```

```java
public class Exer3 {
    public static void main(String[] args) {
        //2、使用空参构造器创建对象
        // 调用setLifeValue(int lifeValue)方法，传入一个正数
        Person p1 = new Person();
        p1.setLifeValue(10);

    }
}
```

```java
public class Exer3 {
    public static void main(String[] args) {
        //2、使用空参构造器创建对象
        // 调用setLifeValue(int lifeValue)方法，传入一个负数
        Person p1 = new Person();
        p1.setLifeValue(-10);

    }
}
```

### 演示2：自定义受检异常

```java
public class DivisionDemo {
    public static void main(String[] args) {
        int m = 0;
        int n = 0;
        try {
            m = Integer.parseInt(args[0]);
            n = Integer.parseInt(args[1]);
            int result = divide(m, n);
            System.out.println("输出结果为:" + result);
        } catch (BelowZeroException e) {
            System.out.println(e.getMessage());
        } catch (NumberFormatException e) {  // 下面几个都是运行时异常，开发中不显示处理，但是这是演示
            System.out.println("数据类型不一致");
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("缺少命令行参数");
        } catch (ArithmeticException e) {
            System.out.println("除0错误");
        }


    }

    public static int divide(int m, int n) throws BelowZeroException {
        if (m < 0 || n < 0) {
            throw new BelowZeroException("输入了负数");
        }
        return m / n;
    }
}

```

```java
public class BelowZeroException extends Exception{
    static final long serialVersionUID = -338751699312948L;

    public BelowZeroException(){
    }
    public BelowZeroException(String name){
        super(name);
    }
    public BelowZeroException(String name, Throwable cause){
        super(name,cause);
    }
}
```

### 演示3：自定义受检异常

```java
/**
    自定义的编译时异常：
        年龄非法异常
        1.继承异常：Exception
        2.重写构造器：一般提供几个
        3.提供一个 全局常量，声明为 static final long serialVersionUID
    自定义异常类的使用：
        4.在出现异常的地方加上 throw new 自定义对象抛出
    作用：编译时异常是编译阶段就会报错，提醒很强烈一定要注意处理
 */
public class AgeIllegalException extends Exception{
    
    static final long serialVersionUID = -3387516929948L;
    public AgeIllegalException() {
    }

    public AgeIllegalException(String message) {
        super(message);
    }
}
```

使用：

```java
public class AgeIllegalExceptionDemo {
    public static void main(String[] args) {
        try {
            checkAge(-34);
        } catch (AgeIllegalException e) {
            e.printStackTrace();
        }

        System.out.println("我还没死！！！！");
    }

    public static void checkAge(int age) throws AgeIllegalException {
        if (age < 0 || age > 120) {
            // 抛出去一个异常对象给方法调用者
            // throws 用于方法声明处，抛出方法内部异常
            // throw new 用于方法内部直接创建一个异常对象，并在此处将其抛出
            throw new AgeIllegalException(age + " is illegal!");
        }
        else {
            System.out.println("年龄合法");
        }
    }
}
```

### 演示4：自定义非受检异常

```java
public class AgeIllegalRuntimeException extends RuntimeException{
    static final long serialVersionUID = -70348945766939L;
    public AgeIllegalRuntimeException() {
    }

    public AgeIllegalRuntimeException(String message) {
        super(message);
    }
}
```

使用：

```java
public class AgeIllegalRuntimeExceptionDemo {
    public static void main(String[] args) {
        checkAge(-34);  // 编译阶段不报错，运行时报错
    }

    public static void checkAge(int age) {
        if (age < 0 || age > 120) {
            // 抛出去一个异常对象给调用者
            // throws 用于方法声明处，抛出方法内部异常
            // throw new 用于方法内部直接创建一个异常对象，并在此处将其抛出
            throw new AgeIllegalRuntimeException(age + " is illegal!");
        } else {
            System.out.println("年龄合法");
        }
    }
}
```

