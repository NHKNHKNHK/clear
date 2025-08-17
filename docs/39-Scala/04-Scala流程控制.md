# 流程控制

Scala程序代码和所有编程语言代码一样，都会有特定的执行流程顺序，默认情况下是顺序执行，上一条逻辑执行完成后才会执行下一条逻辑，执行期间也可以根据某些条件执行不同的分支逻辑代码。

## 分支控制

让程序有选择的的执行，分支控制有三种：单分支、双分支、多分支

### 单分支

`IF...ELSE` 语句是通过一条或多条语句的执行结果（true或者false）来决定执行的代码块

```scala
if(布尔表达式) {
   // 如果布尔表达式为 true 则执行该语句块
}
```

​	如果布尔表达式为 true 则执行大括号内的语句块，否则跳过大括号内的语句块，执行大括号之后的语句块

```scala
object ScalaBranch {
    def main(args: Array[String]): Unit = {
        val b = true
        if ( b ) {
            println("true")
        }
    }
}
```

### 双分支

```scala
if(布尔表达式) {
   // 如果布尔表达式为 true 则执行该语句块
} else {
   // 如果布尔表达式为 false 则执行该语句块
}
```

​	如果布尔表达式为 true 则执行接着的大括号内的语句块，否则执行else后的大括号内的语句块。

```scala
object ScalaBranch {
    def main(args: Array[String]): Unit = {
        val b = true
        if ( b ) {
          println("true")
        } else {
            println("false")
        }
    }
}
```

### 多分支

```scala
if(布尔表达式1) {
   // 如果布尔表达式1为 true，则执行该语句块
} else if ( 布尔表达式2 ) {
   // 如果布尔表达式2为 true，则执行该语句块
}...
else {
   // 上面条件都不满足的场合，则执行该语句块
}
```

​	实现一个小功能：输入年龄，如果年龄小于18岁，则输出“童年”。如果年龄大于等于18且小于等于30，则输出“青年”，如果年龄大于30小于等于50，则输出”中年”，否则，输出“老年”。

```scala
import scala.io.StdIn

object ScalaBranch {
  def main(args: Array[String]): Unit = {
    val age = StdIn.readInt()
    if (age < 18) {
      println("童年")
    } else if (age <= 30) {
      println("青年")
    }
    else if (age <= 50) {
      println("中年")
    }
    else {
      println("老年")
    }
  }
}
```

实际上，**Scala中的表达式都是有返回值的，它的返回值便是语句块中最后一行语句**，所以上面的小功能还有其他的实现方式

```scala
object ScalaBranch {
  def main(args: Array[String]): Unit = {
    val age = StdIn.readInt()
    val result: Unit = if (age < 18) {
      "童年"  // 这个其实就是返回值
    } else if (age <= 30) {
      "青年" // 这个其实就是返回值
    } else if (age <= 50) {
      "中年" // 这个其实就是返回值
    } else {
      "老年" // 这个其实就是返回值
    }
    println(result)
  }
}
```

:::tip 说明
需要说明的是，如果是多分支语句，如果它的每个分支的返回值类型不同，那么返回值需要声明为它们的**公共父类**

例如，下面这个例子中`Any`就是`String`和`Int`的公共父类
:::

```scala
object ScalaBranch2 {
  def main(args: Array[String]): Unit = {
    val age = 18
    val result: Any = if (age < 18) { // 这里的返回值Any，便是 String、Int的公共父类
      "童年" // 这个其实就是返回值
    } else {
      age
    }
    println(result) // ()
  }
}
```

### 三元运算符

**Scala语言中没有三元运算符的**，使用if分支判断来代替三元运算符，因为三元运算符可读性不高

::: code-group

```java [Java三元运算符]
// Java中的三元运算符    a ? b : c; 
final int age = 18;
String result = age > 18 ? "成年" : "童年";
```

```scala [Scala if分支实现三元运算符]
// Scala中用if分支替换了 三元运算
val age: Int = 18

val result: String = if (age > 18) {
  "成年"
} else {
  "童年"
}

// 可简化为
val result2: String = if (age> 18) "成年" else "童年"  // 当语句块只有一行代码，可省略花括号
```

:::

### 嵌套分支

```scala
object ScalaBranch3 {
  def main(args: Array[String]): Unit = {
    val age = 51
    if (age < 18) {
      println("童年")
    } else {
      if (age <= 35) {
        println("青年")
      } else {
        if (age <= 50) {
          println("中年")
        } else {
          println("老年")
        }
      }
    }
  }
}
```

嵌套分支这种方式不易于阅读，我们一般不太喜欢使用

### Switch分支结构

注意：

​	在Scala中，不存在switch语句，而是靠`match`语句（模式匹配）实现了switch的功能，而且它远比switch语句强大

## 循环控制

Scala也为for循环这一常见的控制结构提供了非常多的特性，这些 for 循环的特性被称为 **for推导式 或 for表达式**

```scala
object ScalaLoop {
    def main(args: Array[String]): Unit = {
        for ( i <- Range(1,5) ) { // 遍历集合
            println("i = " + i )
        }
        for ( i <- 1 to 5 ) { // 包含5
            println("i = " + i )
        }
        for ( i <- 1 until 5 ) { // 不包含5
            println("i = " + i )
        }
    }
}
```

### 范围数据循环（To 包含边界）

```shell
for ( 循环变量 <- 数据集 ) {
	循环体
}
```

​	这里的数据集可以是任意类型的数据集合，如 字符串，集合，数组等

```scala
for ( i <- Range(1,5) ) { // 集合的遍历
	println("i = " + i )
}
```

```scala
object ForLoop {
  def main(args: Array[String]): Unit = {
    // java for语法： for(int i = 0; i <= 10; i++){System.out.println(i + ". hello world")}
    // 在Java中的for循环需要考虑边界问题，Scala就优化了这一点，使程序员不再疑惑边界问题

    // Scala for语法
    // 范围遍历：包含边界
    for (i <- 1 to 10) {
      println(s"$i. hello world")
    }
    // for (i <- 1 to 10) 这里的  1 to 10 中 to 并不是关键字
    // 而是方法调用（我们在前面说运算符的本质是说过的），是 Int型 的 1 调用了 to方法
    //   1.to(10)  ==>  1 to(10)  ==>  1 to 10
    for (i <- 1.to(10)) {  //   1.to(10)
      println(s"$i. hello world")
    }
    for (i <- 1 to(10)) {  //   1.to(10)  ==>  1 to(10)
      println(s"$i. hello world")
    }
    for (i <- 1 to 10) {   //   1 to(10)  ==>  1 to 10
      println(s"$i. hello world")
    }
  }
}
```

**运算符本质**

-   在Scala中其实是没有运算符的，**所有运算符都是方法。**
-   scala是完全面向对象的语言，所以数字其实也是对象
-   当调用对象的方法时，**点`.`可以省略**
-   如果函数参数**只有一个，或者没有参数，`()`可以省略**

### 范围数据循环（Until 不包含边界）

```scala
// 范围遍历：不包含边界
for (i <- 1 until 10) {   // 1 到 9 不包含10
  //  until 也是方法调用
  println(s"$i. hello world")
}
```

### 循环守卫

​	循环守卫，即循环保护式（也称条件判断式，守卫）。保护式为 true则进入循环体内部，为 false则跳过，类似于continue。

循环时可以增加条件来决定是否继续循环体的执行,这里的判断条件我们称之为**循环守卫**

```scala
for ( 循环变量 <- 数据集 if 条件) {
  循环体
}
```

```scala
// 循环守卫
for (i <- 1 to 10) {
    if (i != 5) {
        println(i)
    }
}
// 等价于
for (i <- 1 to 10 if i != 5 ){
    println(i)
}
```

结果

```
1
2
3
4
6
7
8
9
10
```

### 循环步长（by）

scala的集合也可以设定循环的增长幅度，也就是所谓的步长step

```scala
// 循环步长
for (i <- 1 to 10 by 2){  
  println(i)
}
```

结果

```
1
3
5
7
9
```

```scala
for (i <- 1 to 10 by -2) { // 步长小于0
  println(i) // 这种遍历不成立，没有输出
}

for (i <- 10 to 1 by -2) {
  println(i)
}
// 倒序遍历
for (i <- 10 to 1 by -1) {
  println(i)
}
for (i <- 1 to 10 reverse) {
  println(i)
}

for (i <- 1 to 10 by 0){  // 会报错
  // java.lang.IllegalArgumentException: step cannot be 0.
  println(i)
}
```

```scala
for (i <- 1 to 10 by 0.5){  // 编译时异常
  println(i)
}

for (i <- 1.0 to 10.0 by 0.3){  // 在scala 2.12 能用但是不推荐，可能会存在精度丢失
  println(i) // 在scala 2.13 已经不能使用，必须使用BigDecimal
}
// 浮点数步长推荐使用
scala.math.BigDecimal.double2bigDecimal
```

### 嵌套循环

```java
// Java中的嵌套循环
for (int i = 0; i < 10; i++) {
    for (int j = 0; j <= i; j++) {
                
    }
}
```

注意：

​ 没有关键字，所以范围后面一定要加 `;` ，来隔断逻辑

```scala
// Scala中的嵌套循环
for (i <- 1 to 9) {
    for (j <- 1 to i) {
        
    }
}
// 等价于
for (i <- 1 to 9; j <- 1 to i) {
    
}
```

```scala
// 使用双重for循环打印 9x9乘法表
object MulTable {
  def main(args: Array[String]): Unit = {
    for (i <- 1 to 9) {
      for (j <- 1 to i) {
        print(s"$j * $i = ${i * j}\t")
      }
      println()
    }

    // 等价于
    for (i <- 1 to 9; j <- 1 to i) {
      print(s"$j * $i = ${i * j}\t")
      if (j == i) println()
    }
  }
}
```

结果

```
1 * 1 = 1	
1 * 2 = 2	2 * 2 = 4	
1 * 3 = 3	2 * 3 = 6	3 * 3 = 9	
1 * 4 = 4	2 * 4 = 8	3 * 4 = 12	4 * 4 = 16	
1 * 5 = 5	2 * 5 = 10	3 * 5 = 15	4 * 5 = 20	5 * 5 = 25	
1 * 6 = 6	2 * 6 = 12	3 * 6 = 18	4 * 6 = 24	5 * 6 = 30	6 * 6 = 36	
1 * 7 = 7	2 * 7 = 14	3 * 7 = 21	4 * 7 = 28	5 * 7 = 35	6 * 7 = 42	7 * 7 = 49	
1 * 8 = 8	2 * 8 = 16	3 * 8 = 24	4 * 8 = 32	5 * 8 = 40	6 * 8 = 48	7 * 8 = 56	8 * 8 = 64	
1 * 9 = 9	2 * 9 = 18	3 * 9 = 27	4 * 9 = 36	5 * 9 = 45	6 * 9 = 54	7 * 9 = 63	8 * 9 = 72	9 * 9 = 81	
```

### 引入变量

说明

for 推导式一行中有多个表达式时，需要加上 `;` 来隔断逻辑

for 推导式有一个不成文的约定：当for 推导式仅包含单一表达式时使用圆括号() ，当包含多个表达式时使用花括号 {}

```scala
// 循环引入变量
for (i <- 1 to 10) {
  val j = 10 - i
  println("i = " + i + ", j = " + j)
}

// 等价于
for (i <- 1 to 10; j = 10 - i) { // 写在一行 用圆括号
  println("i = " + i + ", j = " + j)
}

for {  // 写在多行 用花括号
  i <- 1 to 10
  j = 10 - i
} {
  println("i = " + i + ", j = " + j)
}
```

```scala
// 九层妖塔打印
object Pyramid {
  def main(args: Array[String]): Unit = {
    // 九层妖塔
    // 输出格式思考：
    // 第一行一个 *  第九行 2n-1 = 17个 *
    // (17 - (2n-1))/ 2 = 9 - n
    for (i <- 1 to 9; starts = 2 * i - 1; spaces = (9 - i)) {
      println(" " * spaces + "*" * starts)
    }
  }
}
```

结果

```
        *
       ***
      *****
     *******
    *********
   ***********
  *************
 ***************
*****************
```

### 循环返回值

scala所有的**表达式都是有返回值**的。但是这里的返回值并不一定都是有值的哟。

如果希望for循环表达式的返回值有具体的值，需要使用关键字**yield**

将循环遍历的结果返回到一个新 **Vector 集合**中

:::tip
这种方式在开发中很少使用
:::

```scala
// 循环返回值
val res: Unit = for (i <- 1 to 10) {  // 默认情况下，Scala中for循环的返回值是 空()
  println(i)
}
println(res) // ()

val res2 = for (i <- 1 to 10) yield {  // 这里的 yield 与Java中线程没有关系，它仅仅是一个关键字
  i
}
println(res2) // Vector(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

val res3: immutable.IndexedSeq[Int] = for (i <- 1 to 10) yield i * i
println(res3)  // Vector(1, 4, 9, 16, 25, 36, 49, 64, 81, 100)
```

### 倒序打印

```scala
// 倒序遍历
for (i <- 10 to 1 by -1) {
  println(i)
}
for (i <- 1 to 10 reverse) {
  println(i)
}
```



###  while循环

while 和 do while 的使用与Java完全相同

说明：

-   循环条件是返回一个布尔值的表达式
-   while循环是先判断再执行语句
-   与for语句不同，**while语句没有返回值**，即整个 while 语句的结果是 Unit类型
-   因为 while 中没有返回值，所以当要用该语句计算并返回结果时，就避免不了使用变量，而变量需要声明在while循环外部，那么就等同于循环内部对外部的变量造成了影响，所以**不推荐使用while循环，而是推荐使用 for循环。**

**基本语法**

当循环条件表达式返回值为true时，执行循环体代码

```scala
while( 循环条件表达式 ) {
	循环体
}
```

一种特殊的while循环就是，先执行循环体，再判断循环条件是否成立

```scala
do {
	循环体
} while ( 循环条件表达式 )
```

#### **while循环**

```scala
object ScalaLoop {
	def main(args: Array[String]): Unit = {
		var i = 0
		while ( i < 5 ) {
			println(i)
			i += 1
		}
 	}
}
```

#### **do...while循环**

```scala
object ScalaLoop {
	def main(args: Array[String]): Unit = {
		var i = 5
		do {
	    	println(i)
		} while ( i < 5 )
	}
}
```

#### 循环中断

​	scala是完全面向对象的语言，所以**无法使用`break`、`continue`关键字这样的方式来中断**，或继续循环逻辑，而是采用了函数式编程的方式代替了循环语法中的`break`和`continue`

​	Scala内置控制语句，去除了 break、continue关键字，以更符合 函数式编程，

**1）使用抛出异常方式，中断循环**

```scala
object Break {
  def main(args: Array[String]): Unit = {
    // 采用抛出异常的方式，退出循环
    try {
      for (i <- 1 to 5) {
        if (i == 3)
          throw new RuntimeException
        println(i)
      }
    } catch {
      case e: Exception => // 什么都不做，只是退出循环
    }
    println("循环结束")
  }
}
```

2）使用Scala中的Breaks类中的break方法，中断循环

```scala
object Break {
  def main(args: Array[String]): Unit = {
    // 使用Scala中的Breaks类中的break方法，实现异常的抛出和捕捉
    scala.util.control.Breaks.breakable{
      for (i <- 1 to 5) {
        if (i == 3)
          scala.util.control.Breaks.break()
        println(i)
      }
    }
    println("循环结束")
  }
}
```