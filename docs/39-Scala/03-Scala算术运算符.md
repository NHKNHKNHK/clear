---
permalink: /25/8/17/scala/scala-arithmetic-operators
---

# Scala算术运算符

## 运算符

:::tip
**scala运算符的使用和Java运算符的使用基本相同**，只有个别细节上不同。
:::

例如，+、-、*、/、%、==、!=、<、>、<=、>=、&&、||、!、=、+=、-=、/=、%=、>>=、<<= 等都与Java中的运算符一致

:::warning 注意
​Scala中，没有 ++ 、-- 操作符，可以通过+=、-=来实现通用的效果

​Scala中，一般情况下， `==` 与 `equals` 是一样的，都是比较内容【这一点与Java不同，Java中`==`是比较hashCode值】
:::


```scala
val s1: String = "hello"
val s1: String = new String("hello")

println(s1 == s2)  // true 这在Java中返回的是false，因为它们不是同一个对象，但是Scala中的 == 与 equals 效果一致
println(s1.equals(s2))  // true
```



## 运算符本质

在Scala中，+ - * / % 等这些操作符（运算符）和Java中的作用是一样的，但是在Scala中

-   在Scala中其实是没有运算符的，**所有运算符都是方法。**

-   Scala是完全面向对象的语言，所以数字其实也是对象

-   当调用对象的方法时，点`.`可以省略

-   如果函数参数只有一个，或者没有参数，`()`可以省略

```scala
object ScalaOper {
    def main(args: Array[String]): Unit = {
        val i : Int = 10
        val j : Int = i.+(10) // 此处的 . 可以省略； +方法的括号 () 也可以省略
        val k : Int = j +(20)
        val m : Int = k + 30
        println(m)
        
        println(1.34.*(25))
        println(1.34 *(25))
        println(1.34 * 25)
        
        println(7.5.toInt)
        println(7.5 toInt)
    }
}

```

