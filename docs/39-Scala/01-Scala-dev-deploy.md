# Scala开发环境搭建（Windows）

## Scala简介

从英语角度来看，Scala即Scalable Language单词的缩写，表示可伸缩语言的意思。

从计算机角度来看，Scala是一名静态编程语言，那么Scalable Language就表示Scala是一门可伸缩的软件编程语言。

> 可伸缩，是因为这门语言体现了面向对象，函数式编程等多种不同的语言范式，且融合了不同语言新的特性

Scala语言是基于Java开发的，所以其编译后的文件也是字节码文件，并可以运行在JVM中

## Scala与Java的关系

​	Martin Odersky是狂热的编译器爱好者，长时间的编程后，希望开发一种语言，能够让写程序的过程变得简单，高效，所以当接触到Java语言后，感受到了这门语言的魅力，决定将函数式编程语言的特性融合到Java语言中，由此产生了2门语言（Pizza & Scala）,这两种语言极大地推动了Java语言的发展

-   JDK1.5的泛型，增强for循环，自动类型转换等都是从Pizza语言引入的新特性
-   JDK1.8的类型推断，λ（lambda）表达式是从Scala语言引入的新特性

由上可知，**Scala语言是基于Java开发的，所以其编译后的文件也是字节码文件，并可以运行在JVM中**。

## Scala环境安装

**1）安装JDK1.8**

省略

**2）安装Scala 2.13**

- 解压文件：scala-2.13.11.zip（解压目录要求无中文空格）
- 配置环境变量
  - SCALA_HOME   ===> 安装目录
  - PATH  ===> %SCALA_HOME%\bin

**3）环境测试**

打开cmd，输入scala，显示版本信息则说明scala环境安装成功，如下

```shell
C:\Users\没事我很好>scala
Welcome to Scala 2.13.11 (Java HotSpot(TM) 64-Bit Server VM, Java 1.8.0_131).
Type in expressions for evaluation. Or try :help.

scala>
```

**4）Hello World**

```shell
scala> println("hello world")
hello world
```

## IDEA配置Scala环境

### 1）Scala插件安装

默认情况下IDEA不支持Scala的开发，需要**安装Scala插件**。

如果下载慢的，请访问网址：https://plugins.jetbrains.com/plugin/1347-scala/versions

### 2）Hello World案例

**1）创建 Maven项目**

我们创建一个名为 `scala-demo` 的模块

**2）增加Scala框架支持**

默认情况，IDEA中创建项目时不支持Scala的开发，需要添加Scala框架的支持。

**右击模块名称scala-demo，选择Add Frameworks Support，勾选Sacla，点击OK**

**3）IDEA中关联Scala源码**

方法一：直接在IDEA中下载

方法二：将我们下载的Scala源码包关联

-   将我们下载的scala-2.13.11.tar.gz 压缩包拷贝至 D:\software\scala-2.13.11\lib 目录下
-   解压scala-2.13.11.tar.gz 压缩包，重命名为 scala-source-2.13.11
-   在IDEA中，点击 Choose Sources，选择 scala-source-2.13.11 文件夹所在目录（即 D:\software\scala-2.13.11\lib\scala-source-2.13.11）

至此，在IDEA中关联Scala源代码完成

**3）创建类**

在main文件目录中创建scala目录，在目录中创建com.clear.HelloScala类

```scala
package com.clear

object HelloScala {
  def main(args: Array[String]): Unit = {
    println("hello world")
  }
}

// object：关键字，声明一个单例对象（伴生对象）
// main 方法：从外部可以直接调用执行的方法
//	  def 方法名称(参数名称: 参数类型): 返回值类型 = {方法体}
```

注意：

​	`Array[String]` 这里的 **[] 表示的是泛型**

​	如果只是通过代码来进行语法的解析，并不能了解其真正的实现原理。scala语言是基于Java语言开发的，所以也会编译为class文件，那么我们可以通过反编译指令javap

```
javap -c -l 类名
```

```shell
PS D:\code\hadoop\scala-demo\target\classes\com\clear> javap -l -c '.\HelloScala$.class'
Compiled from "HelloScala.scala"
public final class com.clear.HelloScala$ {
  public static final com.clear.HelloScala$ MODULE$;

  public static {};
    Code:
       0: new           #2                  // class com/clear/HelloScala$
       3: dup
       4: invokespecial #12                 // Method "<init>":()V
       7: putstatic     #14                 // Field MODULE$:Lcom/clear/HelloScala$;
      10: return
    LineNumberTable:
      line 3: 0

  public void main(java.lang.String[]);
    Code:
       0: getstatic     #22                 // Field scala/Predef$.MODULE$:Lscala/Predef$;
       3: ldc           #24                 // String hello world
       5: invokevirtual #28                 // Method scala/Predef$.println:(Ljava/lang/Object;)V
       8: return
    LineNumberTable:
      line 5: 0
    LocalVariableTable:
      Start  Length  Slot  Name   Signature
          0       9     0  this   Lcom/clear/HelloScala$;
          0       9     1  args   [Ljava/lang/String;
}
PS D:\code\hadoop\scala-demo\target\classes\com\clear>
```

或反编译工具jd-gui.exe查看scala编译后的代码。

```scala
package com.clear;

import scala.Predef.;

public final class HelloScala$
{
  public static final  MODULE$ = new ();

  public void main(String[] args) { Predef..MODULE$.println("hello world"); }

}
```
