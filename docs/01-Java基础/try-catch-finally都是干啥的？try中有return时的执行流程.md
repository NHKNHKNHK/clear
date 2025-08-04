# try-catch-finally都是干啥的？try中有return时的执行流程？

`try`：用来捕获异常
`catch`：用于处理try中捕获的异常
`finally`：无论是否捕获或处理异常，fianlly块中的代码都会被执行。

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
```

**语法规则**

-   try必须有
-   finally可以无
-   try后面必须跟catch 或者 finally 其中之一
-   try后面可以有0个或者多个catch，只能有0个或者1个finally。
-   若try后面没有catch，则必须有一个finally
-   只要try里面出现异常，无论try里是否含return，出现异常下面的程序都不会再执行了

**使用细节**

-   将可能出现异常的代码声明在try语句中，一旦代码发现异常，就会自动生成对应的异常类对象，并将此对象抛出
-   针对try语句抛出的异常类对象，使用catch语句进行匹配。
    -   一旦匹配上，就进入catch语句块进行处理（即捕获）， 一旦处理结束，代码就可继续往下执行。
    -   如果匹配不上，那么JVM 将会终止当前方法的执行，并把异常对象“抛”给调用者。如果调用者不处理，程序就挂了。
-   如果声明了多个catch结构，不同的异常类型在不存在子父类关系的情况下，谁声明在上面，谁声明在下面都可以
    -   如果多个异常类型满足子父类关系，则必须将子类声明在父类结构的上面。否则，报错。
-   catch中异常处理的方式：
    -   1）自己编写输出的语句
    -   2） printStackTrace()：打印异常的详细信息。
    -   3）getMessage()：获取发生异常的原因
-   try中声明的变量，作用域只在try结构内部局部有效
-   try-catch结构是可以嵌套使用的



**情况1：try{} catch(){}finally{} return;**

```java
try{
    
} catch () {
    
} finally {
    
}
return;
```

程序按顺序执行。

**情况2：try{ return; }catch(){} finally{} return;**

```java
try{
    return;
} catch () {
    
} finally {
    
}
return;
```

程序执行try块中return之前（包括return语句中的表达式运算）代码；再执行finally块，最后执行try中return;

finally块之后的语句return，因为程序在try中已经return所以不再执行。

**情况3：try{ } catch(){return;} finally{} return;**

```java
try{
    
} catch () {
    return;
} finally {
    
}
return;
```

程序先执行try，如果遇到异常执行catch块， 有异常：则执行catch中return之前（包括return语句中的表达式运算）代码，再执行finally语句中全部代码，最后执行catch块中return

finally块之后的语句return不再执行。

无异常：执行完try再finally再return

**情况4：try{ return; }catch(){} finally{return;}**

```java
try{
   	return;
} catch () {
    
} finally {
    return;
}
```

程序执行try块中return之前（包括return语句中的表达式运算）代码；再执行finally块，因为finally块中有return所以**提前退出**。

**！！！因此，开发中，禁止在finally块在使用return，因为它会覆盖try块中正常的reuturn**

**情况5：try{} catch(){return;}finally{return;}**

```java
try{
   	
} catch () {
    return;
} finally {
    return;
}
```

程序执行catch块中return之前（包括return语句中的表达式运算）代码；再执行finally块，因为finally块中有return所以**提前退出**。

**情况6：try{ return;}catch(){return;} finally{return;}**

```java
try{
   return;
} catch () {
    return;
} finally {
    return;
}
```

程序执行try块中return之前（包括return语句中的表达式运算）代码；有异常：执行catch块中return之前（包括return语句中的表达式运算）代码；则再执行finally块，因为finally块中有return所以提前退出。无异常：则再执行finally块，因为finally块中有return所以提前退出。

**结论：**

​    任何执行try 或者catch中的return语句之前，都会先执行finally语句，如果finally存在的话。如果finally中有return语句，那么程序就return了，所以finally中的return是一定会被return的

**！！！因此，开发中，禁止在finally块在使用return，因为它会覆盖try块中正常的reuturn**

