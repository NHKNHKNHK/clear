# 函数式编程

​	在之前Java课程的学习中，我们一直学习的就是面向对象编程，所以解决问题都是按照面向对象的方式来处理的。比如用户登陆等业务功能，但是接下来，我们会学习函数式编程，采用函数式编程的思路来解决问题。scala编程语言将函数式编程和面向对象编程完美地融合在一起了。

1）面向对象编程

​	解决问题，分解对象，行为，属性，然后通过对象的关系以及行为的调用来解决问题

-   **Scala语言是一个完全面对对象的编程语言。万物皆对象**
-   **对象的本质：对数据和行为的一个封装**

2）函数式编程

​	解决问题是，将问题分解成一个一个的步骤，将每个步骤进行封装（函数），通过调用这些封装好的功能按照指定的步骤，解决问题。

## 基础函数编程

### 1）基本语法

```scala
[修饰符] def 函数名 ( 参数列表 ) [:返回值类型] = {
    函数体
}
```

```scala
private def test( s : String ) : Unit = {
    println(s)
}
```

### 2）函数&方法

在Java中，方法和函数之间没有任何区别，只是叫法不同。

但是在scala 中存在方法与函数两个不同的概念，二者在语义上的区别很小。

scala 中的方法跟 Java 的类似，方法是组成类的一部分。scala 中的函数则是一个完整的对象。

主要区别如下：

-   scala 方法是类的一部分（即方法隶属于类或者对象），而**函数是一个对象，可以赋值给一个变量**。换句话来说在类中定义的函数即是方法。

-   函数是一个对象，继承自FunctionN，函数对象有apply、curried、toString、typled这些方法，而方法没有
-   在scala中，在运行时，**方法是加载到JVM的方法区中，函数是加载到JVM的堆内存中**
-   类中的**方法是有重载和重写的**。而**函数可就没有重载和重写的概念**了，但是函数可以嵌套声明使用，方法就没有这个能力了，千万记得哟。

结论：在Scala中，函数是对象，而方法隶属于对象。所以可以理解为：方法归属于函数

Scala中的方法和函数从语法概念上来讲，一般不好区分，所以简单的理解就是：方法也是函数。只不过类中声明的函数称之为方法，其他场合声明的就是函数了

-   **为完成某一功能的程序语句的集合，称为函数。类中的函数称之为方法**。

```scala
object FunctionAndMethod {
  def main(args: Array[String]): Unit = {
    // 定义函数
    def sayHi(name: String): Unit = {
      println("hi," + name)
    }
    // 函数调用
    sayHi("宁化")

    // 那如何调用到对象的方法呢？
    // 如果我们没有定义函数 sayHi，那么直接  sayHi("宁化") 即可调用方法，因为它是可见的
    
    // 否则需要使用对象来调用  FunctionAndMethod.sayHi("宁化")
    // 调用对象的方法
    FunctionAndMethod.sayHi("清流")
  }

  // 方法：定义在类中，给对象调用
  def sayHi(name: String): Unit = {
    println("hi," + name)
  }
}
```

-   类中的**方法是有重载和重写的**。而**函数可就没有重载和重写的概念**了

```scala
object FunctionAndMethod2 {
  def main(args: Array[String]): Unit = {
    // 定义函数
    def sayHi(name: String): Unit = {
      println("hi," + name)
    }

    def sayHi(name: String, name2: String): Unit = { // 非法，函数不可重载
      println("hi," + name)
    }
  }

  // 方法
  def sayHi(name: String): Unit = {
    println("hi," + name)
  }

  // 方法重载：合法，方法可重载
  def sayHi(name: String, name2: String): Unit = {
    println("hi," + name)
  }
}
```

### 3）函数定义

1)	无参，无返回值

```scala
object ScalaFunction {
  def main(args: Array[String]): Unit = {
    // 定义函数
    def fun1(): Unit = {
      println("函数体")
    }
    // 函数调用
    val res = fun1()
    println(res)  // 返回值 空 ()
  }
}
```

2)	无参，有返回值

```scala
object ScalaFunction2 {
  def main(args: Array[String]): Unit = {
    // 定义函数
    def fun1(): Int = {
      return 666  // return 可省略
    }

    // 函数调用
    val res = fun1()
    println(res) // 返回值 666
  }
}
```

3)	有参，无返回值

```scala
object ScalaFunction3 {
  def main(args: Array[String]): Unit = {
    // 定义函数
    def fun1(name: String): Unit = {
      name
    }

    // 函数调用
    val res = fun1("你好")
    println(res) // 返回值  ()
  }
}
```

4)	有参，有返回值

```scala
object ScalaFunction4 {
  def main(args: Array[String]): Unit = {
    // 定义函数
    def fun1(name: String): String = {
      name
    }

    // 函数调用
    val res = fun1("你好")
    println(res) // 返回值 你好
  }
}
```

5)	多参，无返回值

```scala
object ScalaFunction5 {
  def main(args: Array[String]): Unit = {
    // 定义函数
    def fun1(name: String, province: String): Unit = {
      println(name + province)
    }

    // 函数调用
    val res = fun1("你好", "福建")
    println(res) // 返回值 ()
  }
}
```

6)	多参，有返回值

```scala
object ScalaFunction6 {
  def main(args: Array[String]): Unit = {
    // 定义函数
    def fun1(name: String, province: String): String = {
      name + province
    }

    // 函数调用
    val res = fun1("你好", "福建")
    println(res) // 返回值 你好福建
  }
}
```

### 4）函数参数

Scala中的函数参数比较灵活，支持以下几种类型：

-   可变参数（变长参数）
-   默认参数
-   带名参数

#### **1)	可变参数/变长参数**

Java中的可变参数是使用 ... 来表示，底层使用的是数组来接收参数

```java
public void fun(String name, String... s) {

}
```

Scala中的可变参数是使用 * 来表示

```scala
object ScalaFunction7 {
  def main(args: Array[String]): Unit = {
    def fun1(names: String*): Unit = {
      println(names)
    }
	
    fun1()  // List()
    fun1("你好")  // ArraySeq(你好)
    fun1("你好", "福建")  // ArraySeq(你好, 福建)
  }
}
```

注意：

​	如果参数列表有多个参数，**可变参数**不能放置在参数列表的前面，**一般放置在参数列表的最后**

​	一个函数最多只能有一个可变参数

```scala
oobject ScalaFunction7 {
    def main(args: Array[String]): Unit = {
        
        def fun77(names:String*, name:String): Unit = {  // 非法的定义方式
        }
        //	如果参数列表有多个参数，可变参数一般放置在最后
    	def fun777( name:String, names:String* ): Unit = {  // 合法
        	println( name )
        	println( names )
    	}
    }
}
```

#### **2)	默认参数**

默认参数：在定义函数时，给参数一个默认值。Java中是不行的

```scala
object ScalaFunction8 {
  def main(args: Array[String]): Unit = {
    def fun8(name: String, password: String = "000000"): Unit = {  // 给参数指定了默认值
      println(name + "," + password)
    }

    fun8("福建", "123123")  // 福建,123123
    fun8("福建")  // 福建,000000  没有给password参数传参，因此使用默认值
   }
}
```

#### **3)	带名参数**

带名参数：**通过参数名来指定传递给函数的参数值**，可以不按照顺序传递参数。带名参数可以提高代码的可读性，并且可以跳过某些参数

```scala
object ScalaFunction9 {
  def main(args: Array[String]): Unit = {
    def fun9(password: String = "000000", name: String): Unit = {
      println(name + "," + password)
    }

    fun9("123123", "福建")
    fun9(name = "福建", password = "123123")  // 使用带名参数，类似于python中的关键字参数
    fun9(name = "福建")
  }
}
```

### 5）函数至简原则

​	所谓的至简原则，其实就是Scala的作者为了开发人员能够大幅度提高开发效率。通过编译器的动态判定功能，帮助我们将函数声明中能简化的地方全部都进行了简化。也就是说将函数声明中那些能省的地方全部都省掉。所以这里的至简原则，简单来说就是：**能省则省**。

-   return关键字可以省略，Scala会使用函数体的最后一行代码作为返回值
-   如果函数体只有一行代码，可以省略花括号
-   返回值类型如果能够推断处理，那么可以省略（: 和花括号一起省略）
-   如果有return，则不能省略返回值类型，必须指定
-   如果函数明确声明Unit，那么即使函数体中使用了 return 关键字也不起作用
-   Scala如果期望是无返回值类型，那么可以省略等号
-   如果函数无参，但是声明了参数列表，那么调用函数时，可以省略小括号()
-   如果函数没有参数列表，那么小括号可以省略，调用函数时必须省略
-   如果不关心名称，只关心逻辑处理，那么函数名（def）可以省略

**1)	省略return关键字**

```scala
object ScalaFunction {
    def main(args: Array[String]): Unit = {
        def fun1(): String = {
            return "福建"
        }
        def fun11(): String = { 
        	"福建"  // return关键字可以省略，Scala会使用函数体的最后一行代码作为返回值
        }
    }
}
```

**2)	省略花括号**

这种用法在Java中也可以

```scala
object ScalaFunction {
    def main(args: Array[String]): Unit = {
        def fun2(): String = 
        	"福建"
        
        def fun22(): String = "福建"  // 如果函数体只有一行代码，可以省略花括号
    }
}s
```

**3)	省略返回值类型**

```scala
object ScalaFunction {
    def main(args: Array[String]): Unit = {
        def fun3(): String = "福建"
        
        def fun33() = "福建"  // 返回值类型如果能够推断处理，那么可以省略（: 和花括号一起省略）
    }
}
```

**4）如果有return，则不能省略返回值类型，必须指定**

```scala
object ScalaFunction {
    def main(args: Array[String]): Unit = {
        def fun4(): String = {  // 如果有return，则不能省略返回值类型，必须指定
        	return "福建"
        }
    }
}
```

**5）return关键字不起作用**

```scala
object ScalaFunction {
    def main(args: Array[String]): Unit = {
        def fun5(): Unit= {  
        	return "福建"  // 如果函数明确声明Unit，那么即使函数体中使用了 return 关键字也不起作用
        }
    }
}
```

**6)	省略等号**

如果函数体返回值类型声明为 Unit, 但是又想省略，那么此时就必须连同等号一起省略

```scala
object ScalaFunction {
    def main(args: Array[String]): Unit = {
        def fun6(){  // Scala如果期望是无返回值类型，那么可以省略等号
            println("福建")
        }
    }
}
```

**7）省略小括号**

```scala
object ScalaFunction {
    def main(args: Array[String]): Unit = {
        def fun7(){ 
            println("福建")
        }
        // 函数调用
        fun7()
        fun7 // 如果函数无参，但是声明了参数列表，那么调用函数时，可以省略小括号()
    }
}
```

**8）省略参数列表**

```scala
object ScalaFunction {
    def main(args: Array[String]): Unit = {
        def fun8 = "福建"
        fun8 // 函数调用
        fun8() // 非法， 如果函数没有参数列表，那么小括号可以省略，调用函数时必须省略
    }
}
```

**9)	省略名称和def关键字**

```scala
object ScalaFunction {
    def main(args: Array[String]): Unit = {
        () => {  // 匿名函数 Lambda
            println("福建")  // 如果不关心名称，只关心逻辑处理，那么函数名（def）可以省略
        }
    }
}
```



## 高阶函数编程

​	所谓的高阶函数，其实就是将函数当成一个类型来使用，而不是当成特定的语法结构。

### 1）匿名函数

​	在Scala中，可以使用匿名函数（Anonymous Functions）来定义没有名称的函数。匿名函数也被称为函数字面量（Function Literals）或Lambda表达式。

基本语法

```scala
val functionName = (参数列表) => { 函数体 }
```

匿名函数至简原则

-   参数的类型可以省略，会根据形参进行自动的推断
-   类型省略后，如果只有一个参数，则圆括号() 也可以省略；其他情况：没有参数和参数超过1的情况不能省略
-   匿名函数如果只有一行，则大括号{} 也可以省略
-   如果参数只出现一次，则参数省略且后面参数可以使用 _ 代替
-   如果可以推断出，当前传入的println是一个函数体，而不是调用语句，可以直接省略下划线

```scala
object ScalaFunction {
    def main(args: Array[String]): Unit = {
        // 定义匿名函数
        val fun = (name: String) => {println(name)}
        // 调用匿名函数
        fun("你好")
        
        val addNumbers = (a: Int, b: Int) => a + b
        val res = addNumber(3,5)
        println(res)  // 8
        
        // 定义一个函数，以函数作为参数输入
        def fun4( f:Int => Int ): Int = {
            f(10)
        }
        println(fun4((x:Int) => {x * 20}))
        // 参数的类型可以省略，会根据形参进行自动的推断
        println(fun4((x) => {x * 20}))
        // 如果只有一个参数，则圆括号() 也可以省略；其他情况：没有参数和参数超过1的情况不能省略
      	println(fun4(x => {x * 20}))
        // 匿名函数如果只有一行，则大括号{} 也可以省略
        println(fun4(x =>x * 20))
        // 如果参数只出现一次，则参数省略且后面参数可以使用 _ 代替
        println(fun4(_ * 20))
    }
}
```

### 2）函数作为值

函数可以作为值传递

```scala
object ScalaFunction {
    def main(args: Array[String]): Unit = {
    	def fun1(n: Int): Int = {
      		"fun1被调用"
      		n + 1
    	}

    	// 函数调用
        val a = fun1(10)

        // 函数可以作为值传递
        val b = fun1 _
        // 或
        val c: Int => Int = fun1

        println(a) // 11
        println(b) // com.clear.functions.ScalaFunction$$$Lambda$1/2093631819@71e7a66b
        println(b(10)) // 11
        println(c) // com.clear.functions.ScalaFunction$$$Lambda$1/2093631819@71e7a66b
        println(c(11)) // 12

        def fun2(): Int = {
          println("fun2被调用")
          1
        }

        fun2()
        fun2
        // val f3 = fun2
        val f3: () => Int = fun2
        val f4 = fun2 _
  }
}
```

练习：

定义一个匿名函数，并将它作为值赋值给变量fun。函数有三个参数，类型分别为 Int、String、Char。返回值类型为Boolean。

要求调用 fun(0,"0",'0')得到返回值为 false，其他情况均返回true。

```scala
object case1 {
  def main(args: Array[String]): Unit = {
    val fun = (a: Int, b: String, c: Char) =>
      if (a == 0 && b == "0" && c == '0') false else true  // 在Scala中，== 与 equals效果一样

    println(fun(0, "0", '0')) // false
    println(fun(0, "", '0')) // true
  }
}
```



### 3）函数作为参数

函数可以作为参数传递

```scala
object ScalaFunction {
  def main(args: Array[String]): Unit = {
    // 定义二元计算函数
    def dualEval(op: (Int, Int) => Int, a: Int, b: Int): Int = {
      op(a, b)
    }

    def add(a: Int, b: Int): Int = {
      a + b
    }
    // 函数可以作为参数传递
    println(dualEval(add, 3, 4))  // 7
    // 直接传入匿名函数也可以
    println(dualEval((a, b) => a + b, 3, 4))  // 7
  }
}
```

```scala
object ScalaFunction {
  def main(args: Array[String]): Unit = {
    val arr: Array[Int] = Array(1, 3, 5, 7)

    // 对数组进行处理，将操作抽象出来，处理完毕之后的结果返回一个新的数组
    def arrayOperation(array: Array[Int], op: Int => Int): Array[Int] = {
      for (elem <- array) yield op(elem)
    }

    // 定义一个加一的操作
    def addOne(elem: Int): Int = {
      elem + 1
    }

    // todo 调用函数
    val newArray: Array[Int] = arrayOperation(arr, addOne) // 这里其实还可以传入匿名函数
    println(newArray.mkString(",")) // 2,4,6,8

    // 传入匿名函数的方式
    val newArray2: Array[Int] = arrayOperation(arr, _ * 2)
    println(newArray2.mkString(",")) // 2,6,10,14
  }
}
```

### 4）函数作为返回值

```scala
object ScalaFunction {
  def main(args: Array[String]): Unit = {

    def fun(): Int => Unit = {
      def fun2(a: Int): Unit = {
        a * 2
      }
      fun2
    }

    println(fun)  // com.clear.functions.ScalaFunction$$$Lambda$3/834133664@387c703b
    println(fun()(25))  // ()
    
  }
}
```

练习：

定义一个函数 func，它接收一个Int类型的参数，返回一个函数（f1），它返回的函数f1，接收一个String类型的参数，通过返回一个函数（f2）。函数f2接收一个Char类型的参数，返回一个Boolean的值

要求调用 func(0)("")('0')得到返回值为 false，其他情况均返回true。

```scala
object case2 {
  def main(args: Array[String]): Unit = {

    def func(a: Int): String => (Char => Boolean) = {
      def f1(b: String): Char => Boolean = {
        def f2(c: Char): Boolean = {
          if (a == 0 && b == "0" && c == '0') false else true // 在Scala中，== 与 equals效果一样
        }

        f2
      }

      f1
    }

    println(func(0)("0")('0')) // false
    println(func(0)("1")('0')) // true

    // func的匿名函数简写
    def func2(a: Int): String => (Char => Boolean) = {
      b => c => if (a == 0 && b == "0" && c == '0') false else true // 在Scala中，== 与 equals效果一样

    }
    println(func2(0)("0")('0')) // false
      
    // 柯里化
    def func3(a: Int)(b: String)(c: Char): Boolean= {
        if (a == 0 && b == "0" && c == '0') false else true
    }  
  }
}

```



### 5）闭包

​	在Scala中，闭包（Closure）是指一个函数捕获并绑定了其周围环境中的变量值的能力。换句话说，闭包是一个函数及其相关的引用环境的组合。

简单来说：如果一个函数，访问到了它的外部（局部）变量的值，那么这个函数和它所处的环境，称为闭包

**闭包优缺点：**

​	闭包的优点是它们可以捕获和保持状态，使得函数可以在不同的上下文中使用。这种能力使得闭包非常适合于编写具有记忆性的函数、实现延迟计算和创建回调函数等场景。

​	但是，需要注意闭包可能会导致内存泄漏，因为它们保持了对外部环境的引用，可能导致无法释放内存。因此，在使用闭包时需要小心管理内存。

```scala
object ScalaFunction {
    def main(args: Array[String]): Unit = {
        def multiplyBy(factor: Int): Int => Int = {  // multiplyBy函数接受一个factor参数
  			(x: Int) => x * factor // 内部的函数捕获了外部函数的参数factor的值
		}						// 这样，我们就创建了一个闭包，其中内部函数引用了外部函数的环境。

		val multiplyByTwo = multiplyBy(2)
		println(multiplyByTwo(5))  // 10
    }
}
```

闭包的实现原理：

​	在Scala中万物皆对象，函数也是对象，当我们调用 multiplyBy 函数时，就会在堆内存中创建一个对象，并将闭包所要用到的环境变量保存在堆内存中，当我们在调用内部的函数（例如匿名函数）时，即使multiplyBy 函数已经弹出了栈内存，但是他所创建的对象依然在堆内存中，因此内部的函数可以使用到外部函数对象的变量。这就是闭包的基本原理

```scala
// 闭包
object case3 {
  def main(args: Array[String]): Unit = {
    def add(a: Int, b: Int): Int = {
      a + b
    }

    // 1.考虑固定一个加数的场景
    def addByFour(b: Int): Int = {
      4 + b
    }

    // 2.扩展固定加数改变的情况
    def addByFive(b: Int): Int = {
      5 + b
    }

    // 3.考虑将固定参数作为另一个参数传入，但是是作为”第一层“参数传入
    def addByFour1(): Int => Int = {
      val a = 4

      def addB(b: Int): Int = {
        a + b
      }
      addB
    }

    def addByA(a: Int): Int => Int = {
      def addB(b: Int): Int = { // 闭包
        a + b
      }
      addB
    }

    println(addByA(3)(4)) // 7

    val addByFour2 = addByA(4)
    val addByFive2 = addByA(5)
    println(addByFour2(5)) // 9
    println(addByFive2(6)) // 11

    // Lambda简写闭包
    def addByA1(a: Int): Int => Int = b => a + b
  }
}
```

 思考一个问题: 没有使用外部变量还能称之为闭包吗？ 

​	如果一个函数没有引用外部变量，那么它不会被认为是一个闭包。在这种情况下，我们可以将其视为一个普通的函数。

### 6） 函数柯里化

函数柯里化：把一个参数列表的多个参数，变成多个参数列表

```scala
object ScalaFunction {
    def main(args: Array[String]): Unit = {
    // 柯里化
    def addCurrying(x: Int)(y: Int): Int = x + y

    println(addCurrying(3)(4))
  	}
}
```

### 7）递归函数

递归：一个函数/方法在函数/方法体内又调用了本身

Java实现

```java
public class Te {
    public static int fibonacci(int n) {
        if (n == 1 || n == 2) {
            return 1;
        } else {
            return fibonacci(n - 1) + fibonacci(n - 2);
        }
    }

    public static void main(String[] args) {
        System.out.println(fibonacci(5));
    }
}
```

Scala实现

```scala
object ScalaFunction {
  def main(args: Array[String]): Unit = {
    // 递归
    // 1) 函数调用自身
    // 2) 函数必须要有跳出的逻辑
    // 3) 函数调用自身是，传递的参数应该有规律
    // 4) todo scala中递归必须声明函数返回值类型
    def fibonacci(n: Int): Int = {
      if (n == 1 || n == 2) 1 else fibonacci(n - 1) + fibonacci(n - 2)
    }

    println(fibonacci(6))
  }
}
```

思考两个问题: 

-   递归常用吗？ 

​	递归在编程中是一种常见的技术，经常用于解决问题。它可以简化代码的实现，使问题的解决变得更加直观和自然。递归在许多算法和数据结构中都有广泛的应用，比如树的遍历、图的搜索、动态规划等。

-   递归会出问题吗？

​	递归也可能导致一些问题。以下是一些可能出现的问题：

1.  栈溢出：递归的一个潜在问题是栈溢出。每次递归调用都会在函数调用栈中创建一个新的栈帧，如果递归的深度过大，栈的空间可能会耗尽，导致栈溢出错误。为了避免这个问题，可以使用尾递归优化或迭代的方式来替代递归。
2.  重复计算：递归函数可能会导致重复计算，即同一个子问题被多次计算。这会浪费计算资源，降低程序的效率。为了避免重复计算，可以使用记忆化技术（Memoization）或动态规划来优化递归函数。
3.  性能问题：递归函数的性能可能不如迭代方式。递归函数需要频繁地进行函数调用和栈操作，这会带来一定的开销。在某些情况下，使用迭代方式可能更加高效。

#### 尾递归优化

​	在Scala中，可以使用尾递归优化（Tail Recursion Optimization）来**解决递归调用导致的栈溢出问题**。尾递归是指递归函数的最后一个操作是递归调用自身，并且没有其他操作依赖于递归调用的结果。

Scala编译器对尾递归进行了优化，**将其转化为迭代的形式，从而避免了创建新的栈帧**。这种优化称为尾递归消除（Tail Call Elimination）。

为了使递归函数能够进行尾递归优化，需要满足以下条件：

-   **递归函数的最后一个操作必须是对自身的递归调用**。
-   **递归调用的结果必须直接返回，不能进行其他操作**。

下面是一个使用尾递归优化的斐波那契数列的示例代码：

```scala
object ScalaFunction {
  def main(args: Array[String]): Unit = {
    // 尾递归优化
    def fibonacciTailRecursive(n: Int): Int = {
      @annotation.tailrec  // 该注解标记该函数使用了尾递归
      def fibHelper(n: Int, a: Int, b: Int): Int = {
        if (n <= 1) {
          a
        } else {
          fibHelper(n - 1, b, a + b)
        }
      }
      fibHelper(n, 0, 1)
    }
    println(fibonacciTailRecursive(5))
  }
}
```



### 8）控制抽象

控制抽象通常使用高阶函数和匿名函数来实现。下面是一些常见的控制抽象示例：

-   值调用：把计算后的值传递过去

```scala
object ScalaFunction {
  def main(args: Array[String]): Unit = {
    // 传值参数
    def f0(a: Int): Unit = {
      println("a: " + a)
      println("a: " + a)
    }
    f0(18)

    def f1(): Int = {
      println("f1被调用")
      12
    }
    f0(f1())  
  }
}
```

-   名调用：把代码传递过去

​	在Scala中，`=>` 符号表示一个传名参数（by-name parameter）。传名参数是一种特殊的参数类型，它允许我们**将代码块作为参数传递给函数**，并在需要时进行求值。

​	传名参数的特点是，每次在函数体内使用该参数时，都会重新求值。这与传值参数（by-value parameter）不同，传值参数在函数调用时会先求值，然后将结果传递给函数。

```scala
object ScalaFunction {
  def main(args: Array[String]): Unit = {
    def f1(): Int = {
      println("f1被调用")
      12
    }

    // 传名参数：传递的不再是具体的值，而是传递代码块
    def f2(a: => Int): Unit = {
      println("a: " + a)  // 把a替换成相应的代码块
      println("a: " + a)
    }
    f2(23)
    println("====================")
    f2(f1())
      
    f2({
      println("传入了代码块")
      6
    })
  }
}
```

结果

```
a: 23
a: 23
====================
f1被调用
a: 12
f1被调用
a: 12
传入了代码块
a: 6
传入了代码块
a: 6
```

#### 自定义while循环

```scala
object ScalaFunction14 {
  def main(args: Array[String]): Unit = {
    var n = 10

    // 常规while循环
    while (n >= 1) {
      println(n)
      n -= 1
    }

    // todo 自定义函数实现while的功能
    // 用闭包实现一个函数，将代码块作为参数传入
    def myWhile(condition: => Boolean): (=> Unit) => Unit = {
      // 内层函数递归调用,参数就是循环体
      def doLoop(op: => Unit): Unit = {
        if (condition) {
          op
          myWhile(condition)(op)
        }
      }
      doLoop _
    }

    n = 10
    myWhile(n >= 1) {
      println(n)
      n -= 1
    }

    // 用匿名函数实现
    def myWhile2(condition: => Boolean): (=> Unit) => Unit = {
      // 内层函数递归调用,参数就是循环体
      op => {
        if (condition) {
          op
          myWhile2(condition)(op)
        }
      }
    }

    // 用柯里化实现
    def myWhile3(condition: => Boolean)(op: => Unit): Unit = {
      if (condition) {
        op
        myWhile(condition)(op)
      }
    }
  }
}
```



### 9）惰性函数

​	当函数返回值被声明为 `lazy` 时，函数的**执行将被推迟**，直到我们**首次对此取值，该函数才会执行**。这种函数我们称之为惰性函数。

使用 `lazy` 关键字可以带来一些好处：

-   延迟计算：通过延迟计算，可以避免不必要的计算，提高性能。
-   避免循环依赖：当存在循环依赖关系时，使用 `lazy` 可以避免无限循环的问题。
-   控制副作用：通过延迟计算，可以更好地控制副作用的发生时机。

```scala
object ScalaFunction15 {
  def main(args: Array[String]): Unit = { 
    lazy val result: Int = sum(13, 14)  // 声明了lazy，该函数先不执行
    println("1 函数调用")
    println("2 result: " + result)  // 我们这里调用了result的值，先去加载sum，在执行这条语句
  }

  def sum(a: Int, b: Int): Int = {
    println("3 sum被调用")
    a + b
  }
}
```

结果

```
1 函数调用
3 sum被调用
2 result: 27

如果去掉 lazy，结果如下

3 sum被调用
1 函数调用
2 result: 27
```


