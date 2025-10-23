---
permalink: /25/8/17/scala/scala-oop
---

# 面向对象编程

​	Scala是一门完全面向对象的语言，摒弃了Java中很多不是面向对象的语法。

​	虽然如此，但其面向对象思想和 Java的面向对象思想还是一致的

## Scala包

1）基本语法

Scala中基本的package包语法和 Java 完全一致

例如：

```scala
package com.clear.bigdata.scala
```

2）Scala包的三大作用（和Java一样）

-   区分相同名字的类
-   当类很多时，可以很好的管理类
-   控制访问范围

3）包的命名规则

​	只能包含数字、字母、下划线、小圆点，但是不能以数字开头，也不要使用关键字

​	命令规范：一般是小写字母 + 小圆点

### 扩展语法

Java中package包的语法比较单一，Scala对此进行扩展

Scala有两种包的管理风格，一种和Java的包管理风格相同，每个源文件一个包（包名和源文件所在路径不要求必须一致），包名用”.“进行分隔以表示包的层级关系，如：

```scala
com.clear.scala
```

另一种风格，通过嵌套的风格表示层级关系：

-   Scala中的包和类的物理路径没有关系
-   package关键字可以嵌套声明使用
-   一个源文件中可以声明多个package

```scala
package com
package clear {
    package bigdata {
        package scala {
            object ScalaPackage {
                def test(): Unit = {
                    println("test...")
                }
            }
        }
    }
}
```

-   同一个源码文件中**子包可以直接访问父包**中的内容，而无需import，但是父包访问子包需要import

```scala
// 用嵌套风格定义包
package com {
    import com.clear.scala.Inner
    
    // 在外层包中定义单例对象
    object Outer {
        val out: String = "out"
        def main(args: Array[String]): Unit = {     
            println(Inner.in)  //  父包访问子包需要import
        }
    }
    package clear {
        package scala{
            // 内存包中定义单例对象
            object Inner{
                val in: String = "in"
                def main(args: Array[String]): Unit = {
                    Outer.out = "outer"  // 子包中直接访问父包中的内容
                	println(Outer.out)
                }
                
            }
        } 
    }
}
```

-   
    Scala中package也可以看作对象（即**包对象**），并声明属性和函数

```scala
package com
package object clear {  // 在 com.clear 包下创建的 clear包对象
    val name : String = "zhangsan"
    def test(): Unit = {
        println( name )
    }
}
package com {
    package clear {
        package scala {  // 在 com.clear.scala 在访问包对象
            object ScalaPackage {
                def test(): Unit = {
                }
            }
        }
    }
}
```

### 包对象

​	在Scala中可以为每个包定义一个同名的包对象，定义在包对象中的成员，**作为其对应包下所有的 class 和 object 的共享变量，可以直接被访问**

说明：

若使用java的包管理风格，则包对象一般定义在其对应的package.scala文件中，**包对象名与保持一致。**

```scala
package com.clear	


// 默认包对象的名称必须和 包名一致，全局只有一份
// 使用 package修饰
package object oop {			// 我们在 com.clear.oop包下创建了一个包对象
  // 定义当前包共享的属性和方法
  val commonValue =  "中国"

  def commonMethod(): Unit = {
    println(s"你好， ${commonValue}")
  }
}
```

```scala
package com.clear.oop

object Test {  // 在 com.clear.oop 包下创建了一个Test单例对象，去访问包对象定义的属性和方法
  def main(args: Array[String]): Unit = {
    commonMethod()		 
  }
}
```



### 导包说明

-   **通配符导入**：Scala中基本的import导入语法和 Java完全一致

```scala
import java.util.List
import java.util._  // Scala中使用下划线代替Java中的星号
```

Java中 import 导入的语法比较单一，Scala对此进行扩展

-   **局部导入**：Scala中的 **import 语法可以在任意位置使用**（这一点在python中也可以）

```java
object ScalaImport{
    def main(args: Array[String]): Unit = {
        import java.util.ArrayList
            new  ArrayList()   
    }
}
```

-   Scala中可以导包，而不是导类

```scala
object ScalaImport{
    def main(args: Array[String]): Unit = {
        import java.util
        new util.ArrayList()
    }
}
```

-   **导入相同包的多个类**：Scala中可以在同一行中导入相同包中的多个类，简化代码（这一点在python中也可以）

```scala
import java.util.{List, ArrayList}
```

-   **屏蔽类**：Scala中可以屏蔽某个包中的类

```scala
import java.util._
import java.sql.{ Date=>_, Array=>_, _ }  // 屏蔽Date、Array类
```

-   **给类起别名**：Scala中**可以给类起别名**，简化使用（这一点在python中也可以）

```scala
import java.util.{ArrayList=>AList}

object ScalaImport{
    def main(args: Array[String]): Unit = {
        new AList()
    }
}
```

-   **导入包的绝对路径**：Scala中可以使用类的绝对路径而不是相对路径

```java
new _root_.java.util.ArrayList
```

-   默认情况下，Scala中会导入如下包和对象

```scala
import java.lang._
import scala._
import scala.Predef._  // println就是在该类
```


## 类

面向对象编程中类可以看成一个模板，而对象可以看成是根据模板所创建的具体事物

### 定义类

1)	基本语法

```scala
// 声明类：访问权限 class 类名 { 类主体内容 } 
[修饰符] class User {  
    // 类的主体内容
}
// 对象：new 类名(参数列表)
new User()
```

说明：

​	在Scala中，**类class 默认就是public全局公有可见的**，但是类并不声明为public

​	Scala中**一个源文件中可以声明多个公共类**（这一点是Java所不具有的）

```scala
package com.clear.oop

import scala.beans.BeanProperty

object Test2 {
  def main(args: Array[String]): Unit = {
    val student = new Student()
    // student.name // 编译错误，不能直接访问 private属性
    student.sex = "男"
    println(student.sex)
  }
}

// 定义一个类
//public class Stu {  // 报错
//
//}

class Student {  // 对于Scala的底层，它其实是会将属性包装成private，然后提供了get、set，从而避免了想Java一样有很多像get、set这样的冗余代码
  // 定义属性
  //public var name: String = "张三"    // 编译报错，默认就是public，无须修饰

  private var name: String = "张三"
  @BeanProperty  // 显式地实现像Java一样的提供属性的get、set方法
  var age: Int = 18
  var sex: String = _  // _ 表示初始值为空（注意：这种情况必须使用 var）
}
```

如下就是Student类，反编译的源码：

```java
package com.clear.oop;

import scala.reflect.ScalaSignature;

@ScalaSignature(bytes="\006\005I3A!\....0\t")

public class Student
{
  private String name = "张三";

  private int age = 18;
  private String sex;

  private String name(){ 
    return this.name; 
  } 
  private void name_$eq(String x$1) {
  	this.name = x$1; 
  } 
  public int age() {
    return this.age;
  } 
  public void age_$eq(int x$1) {
      this.age = x$1; 
  } 
  public String sex() {
      return this.sex; 
  } 
  public void sex_$eq(String x$1) {
      this.sex = x$1; 
  }

  public int getAge()
  {
    return age(); 
  } 
  public void setAge(int x$1) { 
      age_$eq(x$1);
  }
}
```

### 属性

1)	基本语法

```scala
class User {
    var name : String = _  // 类属性其实就是类变量
    var age : Int = _  // 下划线表示类的属性默认初始化
}
```

2)	扩展语法

Scala中的**属性其实在编译后也会生成方法**

```scala
class User {
    var name : String = _
    val age : Int = 30
    private var email : String = _  // 一般情况下，不建议声明private，Scala的属性默认底层就是private
    @BeanProperty var address : String = _  // @BeanProperty 会显式的生成get、set方法
}
```

User类反编译后，如下

```scala
import scala.reflect.ScalaSignature;

@ScalaSignature(bytes="\006\0...\001")
public class User
{
  private String name;
  private final int age = 30;
  private String email;
  private String address;

  public String name()
   {
    return this.name; } 
  public void name_$eq(String x$1) { this.name = x$1; } 
  public int age() { return this.age; } 
  private String email() { return this.email; } 
  private void email_$eq(String x$1) { this.email = x$1; } 
  public String address() { return this.address; } 
  public void address_$eq(String x$1) { this.address = x$1; } 
  public String getAddress() { return address(); } 
  public void setAddress(String x$1) { address_$eq(x$1); }
}
```



## 面向对象三大特性

### 封装

​	封装就是把抽象出的**数据和对数据的操作**封装在一起，数据被保护在内部，程序的其它部分只有通过被授权的操作（成员方法），才能对数据进行访问。Java封装操作如下：

-   1)	将属性进行私有化
-   2)	提供一个公共的 set 方法，用于对属性赋值
-   3)	提供一个公共的 get 方法，用于获取属性的值

Scala中的 **public** （==不声明默认就是==）属性，底层实际就是 **private**，并通过 get 方法（obj.field()）和 set方法（obj.field_=(value) ）对其进行操作。所以 Scala并**不推荐**我们将**属性设置为 private**，再为其设置 public的get 和 set 方法。但是由于很多Java框架都利用反射调用 getXXX 和 setXXX 方法，有时候为了兼容这些框架，也会为Scala的属性设置 ==@BeanProperty== 注解（以显式实现 getXXX 和 setXXX 方法）

#### 访问权限

在Java中，访问权限分为：public、private、protected 和 默认。在Scala中，你可以通过类似的修饰符到达同样的效果。

但是使用上有所区别：

-   Scala 中的属性和方法的**默认**访问权限为**public公有访问权限**，但Scala中无 public 关键字，所以不能显式的声明。
-   `private` 为私有权限，**只在类的内部和伴生对象中可用**
-   `protected` 为受保护权限，**Scala中受保护权限比Java中还严格，同类、子类可以访问，同包不能访问**。
    - 再次强调，Scala中`protected`修饰的成员在同包不能访问
-   `private[包名]` 增加了 **包访问权限**，**包名下的其他类也可用使用**

```scala
package com.clear.oop

object PackagingTest {
}

// 定义一个父类
class Person {
  private var idCard: String = "2445"  // 只有本类和伴生对象可以使用
    
  protected var name: String = "张三"	 // 只有本类和子类可以访问
    
  var sex: String = "男"	 // 无修饰符，在Scala中默认为public公有
    
  private[oop] var age: Int = 18  // 包访问权限，同包下都可以访问

  def printInfo(): Unit = {
    println(s"Person: $idCard $name $sex $age")
  }
}
```

```scala
package com.clear.oop

// 定义一个子类
class Worker extends Person {
  override def printInfo(): Unit = {
    // println(idCard)  // 报错，私有属性即使是子类也访问不到
    name = "李四"  //  protected修饰，只能在当前类 或 子类访问
    age = 20	// 包访问权限，可访问
    sex = "女"  // 无修饰符，可访问
    println(s"Worker: $name $sex $age")
  }
}

object PackagingAccess {
  def main(args: Array[String]): Unit = {
    // 创建对象
    val person: Person = new Person
    // person.idCard  // 父类私有属性，无法访问
    // person.name  // 报错， protected修饰，其他类不能访问
      
    println(person.age)   // 包访问权限，在同一个包下可以访问
    println(person.sex)
    person.printInfo()  // Person: 2445 张三 男 18

    val worker: Worker = new Worker()
  }
}
```

#### 方法

基本语法

```scala
def 方法名(参数列表)[: 返回值类型] = {
	// 方法体
}
```

说明：

​	在Scala中，如果方法的返回值是 Unit，这样的方法称之为 **过程（procedure）**

​	过程 的等号= 可以省略不写，例如：

```scala
def sayHello() = println("hello world")
// 等价于

def sayHello() { println("hello world") }  // {} 不可以省略
```



#### 创建对象

Scala中的对象和 Java 是类似的

```scala
val | var 对象名 [：类型]  = new 类型()
var user : User = new User()
```

#### 构造器

和 Java 一样，Scala中构造对象也需要调用类的构造方法来创建。并且一个类中可以有任意多个不相同的构造方法（即重载）。

这些构造方法可以分为2大类：**主构造函数**和**辅助构造函数**。

基本语法

```scala
class 类名(形参列表) {  // 主构造器
	// 类体
	
	def this(形参列表) {  // 辅助构造函数，使用this关键字声明
						// 辅助构造函数应该直接或间接调用主构造函数
	}
	def this(形参列表) {  // 辅助构造器可以有多个（可重载）
						 // 构造器调用其他另外的构造器，要求被调用构造器必须提前声明
	}
} 
```

说明：

-   **辅助构造器**，函数的名称必须为 **this**，可以有多个，编译器通过参数的个数及类型来区分。
-   **辅助构造方法不能直接构造对象**，必须直接或简介调用主构造方法
-   **构造器调用其他另外的构造器，要求被调用构造器必须提前声明**

例如：

```scala
package com.clear.oop

object Constructor {
  def main(args: Array[String]): Unit = {
    // val s1 = new Student()  // ()可省略
    val s1 = new Student
    s1.student()

    val s2 = new Student("张三")
    val s3 = new Student("张三",18)
  }
}

// 定义一个类
class Student() { // 如果主构造器没有参数列表，()可省略
  // 定义属性
  var name: String = _
  var age: Int = _

  println("1 主构造方法被调用")

  // 声明辅助构造方法
  def this(name: String) {
    // 辅助构造方法应该直接或间接调用主构造方法
    this() // 直接调用主构造器
    println("2 辅助构造方法一被调用")
    this.name = name
    println(s"name:  $name age:  $age")
  }

  def this(name: String, age: Int) {
    this(name) // 间接调用主构造器
    println("3 辅助构造方法二被起调用")
    this.age = age
    println(s"name:  $name age:  $age")
  }

  def student(): Unit = { // 定义一个与类名一样的方法，但是它只是一个普通方法
    println("普通方法被调用")
  }
}
```

#### 构造器参数

Scala类的主构造器函数的形参包括三种类型：未用任何修饰、var修饰、val修饰

-   **未用任何修饰符修饰**，这个参数就是一个**局部变量**
-   **var修饰参数**：作为类的**成员属性**使用，可以修改
-   **val修饰参数**：作为类**只读属性**使用，不能修改

例如：

```scala
object ConstructorParams {
  def main(args: Array[String]): Unit = {
    val s1 = new Student2
    println(s"s1 name: ${s1.name} ${s1.age}")
    val s2 = new Student3("张三", 18)
    println(s"s1 name: ${s2.name} ${s2.age}")
  }
}

// 定义一个类
class Student2 { // 无参构造器
  // 单独定义属性
  var name: String = _
  var age: Int = _
}

// 上面定义等价于这种方式
class Student3(var name: String, var age: Int) // var修饰参数：作为类的成员属性使用，可以修改


class Student4(_name: String, _age: Int) { // 主构造器参数无修饰，这些参数就是一个局部变量
  var name = name   // 这种属于鸡肋语法，受Java毒害太深了，Scala不推荐这种方式
  var age = age

}
class Student5(val name: String, val age: Int) // var修饰参数：作为类的成员属性使用，可以修改
```

### 继承与多态

#### 继承

和 Java一样，Scala中的继承也是**单继承**，且使用**extends**关键字。

子类继承父类的属性和方法

**继承的调用顺序：父类构造器 > 子类构造器** 

基本语法

```
class 子类名 extends 父类名 { 类体 }
```

例如·：

```scala
package com.clear.oop

object Inherit {
  def main(args: Array[String]): Unit = {
    val son1 = new Son("张三",18)
    println("--------------------------")
    val son2 = new Son("张三",18,"666")
  }
}

// 定义一个父类
class Father() {
  var name: String = _
  var age: Int = _

  println("1 父类主构造器被调用")

  def this(name: String, age: Int) {
    this() // 直接调用主构造器
    println("2 父类辅助构造器被调用")
    this.name = name
    this.age = age
  }

  def printInfo(): Unit = {
    println(s"Father: $name $age")
  }
}

class Son(name: String, age: Int) extends Father { // 这里会调用父类主构造器
  var idCard: String = _
  println("3 子类主构造器被调用")

  def this(name: String, age: Int, idCard: String) {
    this(name, age)
    println("4 子类辅助构造器被调用")
    this.idCard = idCard
  }

  override def printInfo(): Unit ={
    println(s"Son: $name $age $idCard")
  }
}
```

结果：

```java
1 父类主构造器被调用
3 子类主构造器被调用     	// 调用子类构造器前先调用父类构造器
--------------------------
1 父类主构造器被调用
3 子类主构造器被调用
4 子类辅助构造器被调用
```

#### 多态

​	在 Scala 中，多态（Polymorphism）可以通过两种方式实现：**子类型多态**（Subtype Polymorphism）和**参数多态**（Parametric Polymorphism）。

**子类型多态**（Subtype Polymorphism）： 子类型多态是指在父类的引用变量中可以存储子类的对象（**即父类引用指向子类对象**），并且可以通过父类的引用变量调用子类的方法。在 Scala 中，子类型多态可以通过继承和方法重写来实现。

```scala
class Animal {
  def sound(): Unit = {
    println("Animal makes a sound")
  }
}

class Dog extends Animal {
  override def sound(): Unit = {
    println("Dog barks")
  }
}

class Cat extends Animal {
  override def sound(): Unit = {
    println("Cat meows")
  }
}
object PolymorphismTest{
  def main(args: Array[String]): Unit = {
    val animal: Animal = new Dog ()  // 父类引用指向子类对象
    animal.sound ()  // 编译看左边，执行看右边，实际上都是调用子类的实现，所以输出： Dog barks

    val anotherAnimal: Animal = new Cat ()
    anotherAnimal.sound ()   // Cat meows
  }
}
```

**参数多态**（Parametric Polymorphism）： 参数多态是指在函数或类中使用泛型类型参数，使其可以适用于多种类型。在 Scala 中，参数多态可以通过类型参数和高阶函数来实现。

```scala
object PolymorphismTest{
  def main(args: Array[String]): Unit = {
    def printList[A](list: List[A]): Unit = {  // printList 函数使用了类型参数 A，使其可以接受不同类型的 List
      list.foreach(println)                   // 函数定义中使用类型参数，实现了参数多态
    }

    val intList: List[Int] = List(1, 2, 3, 4, 5)
    val stringList: List[String] = List("apple", "banana", "orange")

    printList(intList)  // 输出：1 2 3 4 5
    printList(stringList)  // 输出：apple banana orange
  }
}
```

## 抽象类

### 抽象属性与抽象方法

1）基本语法

-   **定义抽象类**

Scala将一个不完整的类称之为抽象类。

```scala
abstract class Person {  // 通过abstract关键字标记抽象类
}
```

-   **定义抽象属性**

Scala中如果**一个属性只有声明没有初始化，那么是抽象属性**，因为它不完整。

```scala
abstract class Person {
    var|val name:String  // 该属性没有初始化，就是抽象属性
    // 只有在抽象类中才可以
}
```

-   **定义抽象方法**

Scala中如果一个方法只有声明而没有实现，那么是抽象方法，因为它不完整。

```scala
abstract class Person {
    def test():Unit  // 只声明而没有实现的方法，就是抽象方法
}
```

注意：

​	只要出现了抽象属性或抽象方法，那么该类一定是抽象类

​	抽象类在也可以有普通属性、普通方法

2）继承与重写

-   通过父类为抽象类，那么子类需要将抽象的属性和方法实现，否则子类也需要声明为抽象类

```scala
abstract class Person {
    var name:String
}
class User extends Person {
    var name : String = "zhangsan"  // 实现父类的抽象属性、方法，否则子类也需要声明为抽象类
}
```

-   重写非抽象方法需要用 **override** 修饰，**重写抽象方法则可以不加override**
-   子类中调用父类的方法，需要使用 super 关键字
-   子类对抽象属性进行实现，**父类抽象属性可以用 var 修饰**
-   子类**对非抽象属性重写**，父类**非抽象属性只支持 val 类型**，不支持 var
    -   因为 var 修饰的为可变变量，子类继承之后就可以直接使用，没有必要重写

```scala
package com.clear.oop

object AbstractCass {
  def main(args: Array[String]): Unit = {

  }
}

// 定义抽象类
abstract class Person2 {
  // 非抽象属性
  val name: String = "person"
  var idCard = "666"  // var修饰的
  // 抽象属性（未初始化值）
  var age: Int

  // 非抽象方法
  def eat(): Unit = {
    println("person eat")
  }

  // 抽象方法（没有书写方法体）
  def sleep(): Unit
}

// 定义子类
class User2 extends Person2 {
  // todo 子类实现抽象属性、抽象方法
  var age = 18

  override def sleep(): Unit = { // 重写抽象方法 override 可以省略
    println("user sleep")
  }

  // todo 子类重写非抽象属性、方法
  override val name: String = "user"
  override def eat(): Unit = {
    println("user eat")
  }
  // todo 重写 var 修饰的非抽象属性
  // override var idCard = "777"  // 报错，idea中没有提示，但是编译报错
}
```

### 匿名子类

和 Java一样，可以通过包含带有定义或重写的代码块的方式创建一个匿名的子类

在Scala中，可以使用匿名子类来创建一个没有命名的子类。匿名子类可以用于实现接口、扩展类或重写方法。

基本格式

```scala
val 变量名: 父类或接口的类型 = new 父类或接口的类型 {
  // 子类的实现代码
}
```

例1：

```scala
package com.clear.oop

object AnonymousClass {
  def main(args: Array[String]): Unit = {
    val dog : Animal2 = new Animal2 {  // 抽象类，不能直接实例化，我们可以创建一个他的一个匿名子类
      override var name: String = "dog"

      override def play(): Unit = {
        println("汪汪汪")
      }
    }
    // 直接调用
    println(dog.name)
    println(dog.play())
  }
}

// 定义抽象类
abstract class Animal2 {
  var name: String  // 抽象属性

  def play(): Unit  // 抽象方法
}
```

例2：

```scala
object AnonymousClass2 {
  def main(args: Array[String]): Unit = {
    // 创建匿名子类，实现了特质，重写了抽象方法
    val animal: Animal3 = new Animal3 {
      override def sound(): String = "Animal makes sound"
    }

    println(animal.sound()) //  Animal makes sound
  }
}

// 定义一个特质（类似于Java的接口）
trait Animal3 {
  // 抽象方法
  def sound(): String
}
```


## 单例对象（伴生对象）

所谓的**单例对象**，就是在程序运行过程中，指定类的对象只能创建一个，而不能创建多个。这样的对象可以由特殊的设计方式获得，也可以由语言本身设计得到，比如 `object 伴生对象`

Scala 语言是完全面向对象的语言，所以并没有静态的操作（即在**Scala中没有静态的概念**）。

但是为了能够 和Java 语言交互（因为Java中有静态概念），就产生了一种特殊的对象来模拟类对象，该对象为单例对象。

若**单例对象名与类名一致**，则称该单例对象这个类的**伴生对象**，这个类的所有“静态”内容都可以放置在它的伴生对象中声明，然后通过伴生对象名称直接调用

**如果类名和 伴生对象名称保持一致**，那么这个类称之为**伴生类**。**Scala编译器可以通过伴生对象的 `apply` 方法创建伴生类对象。apply方法可以重载**，并传递参数，且**可由Scala编译器自动识别。所以在使用时，其实是可以省略的。**

在Scala中，可以使用**单例对象（Singleton Object）来创建一个只有一个实例的类**。单例对象在Scala中非常常见，**用于实现全局共享的状态、提供工具方法、作为应用程序的入口点等**

要使用单例对象，只需通过`对象名.xxx`的方式访问其中的属性或方法，就像调用普通类的静态方法一样（与java类似）

单例对象的特点是在程序运行期间只有一个实例存在，因此可以在不同的地方共享状态和数据。此外，单例对象还可以实现接口、扩展类、混入特质等，具有与普通类相同的灵活性

单例对象不能被实例化，因为它们已经是单例。因此，不能使用`new`关键字来创建单例对象的实例

:::tip
Scala中没有`static`关键字，但是可以通过单例对象模拟出静态的概念，单例对象中所有的成员变量和成员方法都是静态的
:::

```scala
// 一个类：也是伴生类
class Student private(val name: String, val age: Int) {
  def printInfo(): Unit = {
    println(s"student [name=$name, age=$age, school= ${Student.school}]")
    // 其中 Student.school 是直接通过 伴生对象名.属性 方式访问的
  }
}

// 一个单例对象，名称与类一致，也称伴生对象
object Student {
  val school: String = "xs"

  // todo 在伴生对象中，可以直接访问private
  // 定义一个方法，实例化对象
  def apply(name: String, age: Int): Student = new Student(name, age)  // 构造伴生类实例
}

object TestMain {
  def main(args: Array[String]): Unit = {
    // 实例化Student类
    //val student = new Student("张三",18)  // 编译错误，private类不能被外部访问
    // 通过 伴生对象名.属性 方式实例化类
    val student = Student.apply("张三",18) // 通过伴生对象的apply方法构造伴生类实例
    student.printInfo()
    // todo scala编译器省略apply方法，自动完成调用
    val student2 = Student("李四",19) 
    student2.printInfo()
  }
}
```

说明

- 上面这段代码很轻松的在伴生对象中访问伴生类的私有构造器完成类的实例化，实现了一个单例设计模式 

:::tip

- 单例对象采用 `object` 关键字声明
- 单例对象对应的类称之为伴生类，伴生对象的名称应该与伴生类一致。
- 单例对象的属性和方法都可以通过伴生对象名（类名）直接调用（因为模拟Java中`static`的概念）

:::

### **单例对象与伴生对象的区别？**

-   在Scala中，单例对象（Singleton Object）和伴生对象（Companion Object）是两个不同的概念，但它们经常一起使用。
-   单例对象是一个独立的对象，它在程序运行期间只有一个实例存在。它可以包含方法、字段和其他成员，可以用于实现全局共享的状态、提供工具方法等。单例对象的定义使用`object`关键字。
-   伴生对象是与某个类关联的对象，它与类名相同，并且在同一个源文件中定义。伴生对象和类之间可以相互访问对方的私有成员。伴生对象通常用于定义与类相关的静态成员、工厂方法等。伴生对象的定义使用`object`关键字。

## 特质 trait

Scala将多个类的相同特征从类中剥离出来，形成一个独立的语法结构，称之为“**特质”（特征）**。

这种方式在Java中称之为接口，但是 **Scala中没有接口的概念**。所以 scala 中没有 `interface`关键字，而是采用特殊的关键字 `trait` 来声明特质。

Scala中的 tarit中可以有抽象的属性、方法，**也可以有普通的属性、方法**。

如果一个类符合某一个特征（特质），那么就可以将这个特征（特质）“混入”到类中。这种混入的操作可以在声明类时使用，也可以在创建类对象时动态使用。

Scala引入 trait 特质，第一可以替代Java的接口，第二个也是对单继承机制的一种补充。

**特质可以被类继承，使用`extends`关键字，也可以被其他特质混入，使用`with`关键字。**

特质的特点：

-   多重继承：一个类可以继承多个特质，从而获得多个特质的功能。
-   抽象成员：特质可以定义抽象方法和字段，需要在继承或混入的类中实现。
-   默认实现：特质可以提供方法的默认实现，继承或混入的类可以选择重写或继承默认实现。
-   动态混入：特质可以在对象创建时动态混入，为对象提供额外的功能。

### 基本语法

1)	基本语法

```scala
trait 特质名称{
    // 定义方法、字段、抽象成员
}
		
class 类名 extends 父类（特质1） with 特质2 with 特质3 trait Operator {
				// extends 继承特质 
    			// with 混入特质
}
```

例如：

```scala
// 定义一个特质
trait Young{
  // 声明抽象属性
  val name: String = "young"
  // 声明抽象方法、非抽象方法
  def dating(): Unit
  def play(): Unit = {
    println("young people is playing")
  }
}

// 定义User类，继承Person，混入Young特质
class User extends Person with Young {
  // todo 重写冲突的属性（因为Person、Young中都有）
   val string = "李四"

  // 实现抽象方法
  override def dating(): Unit = {
    println("user...")
  }
}
```

### 特质混入

-   **特质混入**（Trait Mixin）是Scala中一种灵活的**代码组合机制**，通过将特质混入到类中，可以为类提供额外的功能。
-   特质混入使用`with`关键字，将特质添加到类的定义中。一个类可以混入多个特质，**特质的顺序决定了方法的调用顺序**
-   特质混入的顺序很重要，**如果多个特质中有相同的方法名，那么最后一个混入的特质的方法会覆盖之前的方法**
    -   例如，如果`MyClass`类同时混入了两个特质，且两个特质都有一个名为`print()`的方法，那么最后一个混入的特质的`print()`方法会被调用。

-   **特质混入**是Scala中**实现代码复用和组合的重要机制**，可以根据需要选择混入不同的特质，灵活地组合和扩展类的功能。

例：

```scala
trait Printable {
  def print(): Unit
}

trait Loggable {
  def log(message: String): Unit
}

// 混入两个特质
class MyClass extends Printable with Loggable {
  def print(): Unit = {
    println("Printing...")
  }
  
  def log(message: String): Unit = {
    println(s"Logging: $message")
  }
}

val obj = new MyClass()
obj.print() // 输出：Printing...
obj.log("Hello") // 输出：Logging: Hello
```

#### 动态混入

-   动态混入（Dynamic Mixing）是指在运行时为对象添加特质的能力。在Scala中，可以使用`with`关键字将特质动态混入到对象中

例如：

```scala
// SomeClass是一个类，SomeTrait是一个特质
// 通过使用with关键字，我们可以在创建SomeClass的实例时，动态地将SomeTrait混入到该实例中
val obj = new SomeClass with SomeTrait
```

-   通过动态混入特质，我们可以为对象添加特定的行为，而不需要修改原始类的定义。这种方式可以在不改变类层次结构的情况下，为对象提供额外的功能。
-   需要注意的是，动态混入特质只对当前对象有效，不会影响其他对象或类。每个对象可以根据自己的需要选择要混入的特质，从而实现个性化的行为

### 特质叠加

由于一个类可以混入（mixin）多个trait，且 trait 中可以有多个具体的属性和方法，若混入的特质中有相同的方法（方法名、形参列表、返回值均相同），那必然会导致继承冲突问题。冲突分为两种：

1）一个类（sub）混入的两个trait 中两个相同的具体方法，且两个trait之间没有任何的关系，解决这类冲突，直接在类中重写冲突方法即可

2）一个类（sub）混入的两个trait 中两个相同的具体方法，且两个trait都继承自同一个trait（即钻石问题），解决这类冲突，Scala采用了**特质叠加**的策略。

-   在Scala中，特质叠加（Trait Stacking）是一种特质组合的方式，通过将多个特质叠加在一起，形成一个新的特质，从而将多个特质的功能合并到一个特质中。（特质叠加类似于Java中的接口继承）
-   特质叠加使用`with`关键字，将多个特质按顺序叠加在一起。特质的**叠加顺序是从右往左的**。也就是说，当一个类混入多个特质时，特质的代码会按照从右到左的顺序被叠加到类中。
-   通过合理的特质叠加，可以实现代码的复用和组合，提高代码的灵活性和可维护性

```scala
trait A {
    def foo(): Unit = {
        println("A foo")
    }
}

trait B {
    def foo(): Unit = {
        println("B foo")
    }
}

// 特质C叠加特质A，特质B
trait C extends A with B {
    override def foo(): Unit = {
        super[A].foo() // 调用特质A的foo方法
        super[B].foo() // 调用特质B的foo方法
        println("C foo")
    }
}

class MyClass extends C {
    def bar(): Unit = {
        foo() // 调用特质C的foo方法
    }
}

val obj = new MyClass()
obj.bar() // 当调用MyClass的bar()方法，会按照从右到左的顺序调用特质的方法，即先调用特质B中的foo()方法，然后调用特质A中的foo()方法

// 总结来说，特质的叠加顺序是从右往左的，可以使用super关键字来指定调用特定特质的方法。
```

### 特质混入与特质叠加

特质混入（Trait Mixin）和特质叠加（Trait Stacking）是Scala中**两种不同的特质组合方式**。

特质混入是将**一个或多个特质添加到类**的定义中，通过使用`with`关键字将特质混入到类中。一个类可以混入多个特质，特质的顺序决定了方法的调用顺序。特质混入可以为类提供额外的功能，类可以使用混入的特质中定义的方法和字段。

特质叠加是将**多个特质按顺序叠加在一起，形成一个新的特质**。叠加的顺序决定了方法的调用顺序，从左到右依次调用。特质叠加可以将多个特质的功能组合在一起，形成一个新的特质，提供更丰富的功能。

特质混入和特质叠加**都可以实现代码的复用和组合**，提高代码的灵活性和可维护性。它们在使用方式和效果上有一些区别：

-   特质混入是将特质添加到类的定义中，类可以使用混入的特质中定义的方法和字段。特质混入是一种静态组合方式，特质的功能在编译时就确定了。
-   特质叠加是将多个特质按顺序叠加在一起，形成一个新的特质。特质叠加是一种动态组合方式，特质的功能在运行时才确定。

特质混入和特质叠加可以根据具体的需求选择使用。特质混入适用于在类定义时就确定需要使用的特质，而特质叠加适用于在运行时根据需要动态组合特质的功能。

### 特质自身类型

在Scala中，特质（Trait）可以具有自身类型（Self Type），用于指定特质可以被哪些类型的类混入

自身类型可以实现依赖注入的功能

自身类型可以通过以下方式**定义**：

```scala
trait MyTrait { _: SomeType =>	// 表示特质只能混入到SomeType类中
    // Trait body
}
```

自身类型的作用是限制特质的使用范围，确保特质只能被指定的类型的类混入。这样可以在特质中使用类型`SomeType`的成员，而不需要在特质中重新定义这些成员。

自身类型的使用：

```scala
trait Logger {
    self: Person =>  // 指定自身类型为Person，即只有Person类能够混入该特质

    def log(message: String): Unit = {
        println(s"${self.name}: $message")	// self.name 在特质中访问Person类name属性
        									// this.name 也可以
    }
}

class Person(val name: String) extends Logger {  // 混入Logger特质
    def sayHello(): Unit = {
        log("Hello!")
        println(s"My name is $name.")
    }
}

object Main extends App {
    val person = new Person("Alice")
    person.sayHello()
}
```

结果：

```
Alice: Hello!
My name is Alice.
```

### 特质与抽象类的区别

在Scala中，特质（Trait）和抽象类（Abstract Class）都可以用于定义可复用的代码片段和行为。它们有一些相似之处，但也有一些重要的区别。

主要区别：

-   继承关系：**一个类可以继承多个特质，但只能继承一个抽象类**。这是因为Scala支持多重继承特质，但不支持多重继承抽象类。
-   构造函数：**特质不能有构造函数参数，而抽象类可以有构造函数参数**。这是因为特质在被混入到类中时，是作为一个独立的模块存在的，而抽象类是作为一个类的一部分存在的。
-   实例化：**特质不能被实例化，而抽象类可以被实例化**。特质只能被混入到类中使用，而抽象类可以作为独立的类被实例化。
-   默认实现：特质可以提供方法的默认实现，而抽象类可以提供方法的具体实现。特质中的方法可以是抽象的，也可以是具体的，而抽象类中的方法可以有具体的实现。
-   继承顺序：**特质的混入顺序是从左到右，而抽象类的继承顺序是从父类到子类**。当一个类混入多个特质时，特质的方法会按照混入的顺序被调用。
-   使用场景：特质通常用于定义可复用的行为，而抽象类通常用于定义具有共同特征的类的基类。特质更适合用于组合多个行为，而抽象类更适合用于定义类的继承关系。

建议：

​	优先使用特质，一个类扩展多个特质是很方便，但是只有扩展一个抽象类

​	如果需要使用构造器参数，使用抽象类。因为抽象类可以有带参数的构造器，而特质不行。




## 扩展

### 类型检查和转换

（1）`obj.isInstanceOf[T]`：判断 obj 是不是 T 类型

（2）`obj.asInstanceOf[T]`：将 obj 强转为 T 类型

（3）`classOf` 获取对象的类名

Scala提供了两种类型转换的方式：**隐式类型转换**和**类型检查和转换**。

-   隐式类型转换（Implicit Conversion）：隐式类型转换是指在**编译器自动进行的类型转换**，无需显式地调用转换方法。隐式类型转换**通常用于解决类型不匹配的问题**，使得代码更加简洁和易读。例如，将一个整数转换为浮点数：

```scala
val x: Int = 10
val y: Double = x // 隐式类型转换，将Int类型转换为Double类型
```

-   显式类型转换（Explicit Conversion）：显式类型转换是指通过调用转换方法来显式地将一个对象从一种类型转换为另一种类型。显式类型转换使用`asInstanceOf`方法进行转换。例如，将一个Any类型的对象转换为String类型：

```scala
class Person{
}
object Person {
    def main(args: Array[String]): Unit = {
        val person = new Person

        //（1）判断对象是否为某个类型的实例
        val bool: Boolean = person.isInstanceOf[Person]

        if ( bool ) {
            //（2）将对象转换为某个类型的实例（显式类型转换）
            val p1: Person = person.asInstanceOf[Person]
            println(p1)
        }

        //（3）获取类的信息
        val pClass: Class[Person] = classOf[Person]
        println(pClass)
    }
}
```

:::warning 注意
显式类型转换可能会导致类型转换异常（ClassCastException），因此在进行显式类型转换时需要确保对象的实际类型与目标类型是兼容的。
:::

#### 模式匹配可以用于类型转换

另外，Scala还提供了一种特殊的类型转换方式，即**模式匹配**（Pattern Matching）。模式匹配可以根据对象的类型进行匹配，并执行相应的操作。模式匹配可以用于类型转换、条件判断等场景。例如，将一个Any类型的对象转换为String类型并进行处理：

```scala
val x: Any = "Hello"
x match {
  case s: String => println(s) // 如果x是String类型，则打印字符串
  case _ => println("Not a string") // 如果x不是String类型，则打印"Not a string"
}
```

总结来说，Scala中的类型转换可以通过隐式类型转换和显式类型转换来实现，还可以使用模式匹配进行类型判断和转换。在进行类型转换时需要注意类型的兼容性，并避免类型转换异常的发生。

### 枚举类和应用类

枚举类（Enumeration）：可以使用`Enumeration`关键字定义枚举类。

枚举类的每个取值都是该类的实例对象

```scala
// 定义枚举类对象
object Weekday extends Enumeration {
  type Weekday = Value
  val Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday = Value
}
// 可以通过 Weekday.Monday 等方式访问枚举值
```



应用类（Application）：**应用类是一种特殊的类，它可以直接运行，而无需显式地定义`main`方法**。

在Scala中，可以**通过继承`App`特质来定义应用类**。应用类的代码会在程序启动时自动执行

```scala
object MyApp extends App {
  println("Hello, World!")
}
```

注意：

​	**应用类只能有一个，且必须是顶级对象**（即不能是内部类）。应用类的代码会在程序启动时执行，因此通常用于编写简单的脚本或测试代码。

### Type定义新类型

使用type关键字可以定义新的数据数据类型名称，本质上就是类型的一个别名

```scala
type Age = Int
val age: Age = 25

type Name = String
val name: Name = "John"

type Person = (Name, Age)
val person: Person = ("John", 25)
```

