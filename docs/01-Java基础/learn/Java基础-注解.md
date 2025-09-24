# 注解(Annotation)  

## 注解概述 

### 什么是注解  

注解（Annotation）是从 `JDK5.0` 开始引入，以 `@注解名`在代码中存在。例如： 

```java
@Override 
@Deprecated 
@SuppressWarnings(value=”unchecked”) 
```

Annotation 可以像修饰符一样被使用，可用于修饰包、类、构造器、方法、成员变量、参数、局部变量的声明。还可以添加一些参数值，这些信息被保存在 Annotation 的 “name=value” 对中。 

注解可以在类编译、运行时进行加载，体现不同的功能。 

### 注解与注释

**注解也可以看做是一种注释，通过使用 Annotation**，程序员可以在不改变原有逻辑的情况下，在源文件中嵌入一些补充信息。但是，注解，不同于单行注释和多行注释。 

-   对于单行注释和多行注释是给程序员看的。 

-   而**注解是可以被编译器或其他程序读取的**。程序还可以根据注解的不同，做出相应的处理。

### 注解的重要性  

在 JavaSE 中，注解的使用目的比较简单，例如标记过时的功能，忽略警告等。 在 JavaEE/Android 中注解占据了更重要的角色，例如用来配置应用程序的任何切面，**代替** JavaEE 旧版中所遗留的**繁冗代码**和 **XML 配置**等。 

未来的开发模式都是基于注解的，JPA 是基于注解的，Spring2.5 以上都是基于注解的，Hibernate3.x 以后也是基于注解的，Struts2 有一部分也是基于注解的了。**注解是一种趋势**，一定程度上可以说：**框架 = 注解 + 反射 +设计模式。** 

## 常见的 Annotation 作用

**示例 1：生成文档相关的注解** 

```java
@author 标明开发该类模块的作者，多个作者之间使用,分割 
@version 标明该类模块的版本 
@see 参考转向，也就是相关主题 
@since 从哪个版本开始增加的 
@param 对方法中某参数的说明，如果没有参数就不能写 
@return 对方法返回值的说明，如果方法的返回值类型是 void 就不能写 
@exception 对方法可能抛出的异常进行说明 ，如果方法没有用 throws 显式抛出的异常就不能写 

package com.annotation.javadoc; 

public class JavadocTest { 

    /*
	* 程序的主方法，程序的入口 
	* @param args String[] 命令行参数 
	**/
    public static void main(String[] args) { 

    }

    /* 
    * 求圆面积的方法
    * @param radius double 半径值
    * @*return double 圆的面积
    **/
    public static double getArea(double radius){ 
        return Math.PI * radius * radius; 
    } 
}     
```

**示例 2：在编译时进行格式检查(JDK 内置的三个基本注解)** 

@Override: 限定重写父类方法，该注解只能用于方法 

@Deprecated: 用于表示所修饰的元素(类，方法等)已过时。通常是因为所修饰的结构危险或存在更好的选择 

@SuppressWarnings: 抑制编译器警告 

```java
package com.annotation.javadoc; 

public class AnnotationTest{ 

	public static void main(String[] args) { 
		@SuppressWarnings("unused") 	// 如果不加这个注解，Idea会对变量a发出警告，因为这个变量没有被使用
        int a = 10; 
	} 

	@Deprecated 
    public void print(){ 
		System.out.println("过时的方法"); 
    } 

	@Override 
    public String toString() { 
        return "重写的 toString 方法()"; 
    } 
} 
```

**示例 3：跟踪代码依赖性，实现替代配置文件功能** 

Servlet3.0 提供了注解(annotation)，使得不再需要在 web.xml 文件中进行 Servlet 的部署。 

```java
@WebServlet("/login") 
public class LoginServlet extends HttpServlet { 
    private static final long serialVersionUID = 1L; 
    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
    } 

    protected void doPost(HttpServletRequest request, HttpServletResponse response) { 
        doGet(request, response); 
    }  
} 
```

Servlet3.0之前的写法，是使用xml的方式

```xml
<servlet> 
    <servlet-name>LoginServlet</servlet-name> 
    <servlet-class>com.servlet.LoginServlet</servlet-class> 
</servlet> 
<servlet-mapping> 
    <servlet-name>LoginServlet</servlet-name> 
    <url-pattern>/login</url-pattern> 
</servlet-mapping> 
```

-   Spring 框架中关于“事务”的管理 

```java
@Transactional(propagation=Propagation.REQUIRES_NEW,isolation=Isolation.READ_COMMITTED,readOnly=false,timeout=3) 
public void buyBook(String username, String isbn) { 
	//1.查询书的单价
    int price = bookShopDao.findBookPriceByIsbn(isbn); 
    //2.更新库存
    bookShopDao.updateBookStock(isbn); 
    //3.更新用户的余额 
    bookShopDao.updateUserAccount(username, price); 
} 
```

```xml
<!-- 配置事务属性 --> 
<tx:advice transaction-manager="dataSourceTransactionManager" id="txAdvice"> 
    <tx:attributes> 
        <!-- 配置每个方法使用的事务属性 --> 
        <tx:method name="buyBook" propagation="REQUIRES_NEW" isolation="READ_COMMITTED" read-only="false" timeout="3" /> 
    </tx:attributes> 
</tx:advice>
```



## 三个最基本的注解

### @Override  

-   用于**检测**被标记的方法为**有效的重写方法**，如果不是，则报编译错误！ 

-   只能标记在方法上。 

-   它会被编译器程序读取。 


### @Deprecated

-   用于表示被标记的数据**已经过时，不推荐使用**。 

-   可以用于修饰 属性、方法、构造、类、包、局部变量、参数。 

-   它会被编译器程序读取。 


### @SuppressWarnings

-   **抑制编译警告**。当我们不希望看到警告信息的时候，可以使用 SuppressWarnings 注解来抑制警告信息 

-   可以用于修饰类、属性、方法、构造、局部变量、参数 

-   它会被编译器程序读取。 

-    可以指定的警告类型有（了解） 
    -   all，抑制所有警告 
    -   unchecked，抑制与未检查的作业相关的警告 
    -   unused，抑制与未用的程式码及停用的程式码相关的警告 
    -   deprecation，抑制与淘汰的相关警告 
    -   nls，抑制与非 nls 字串文字相关的警告 
    -   null，抑制与空值分析相关的警告 
    -   rawtypes，抑制与使用 raw 类型相关的警告 
    -   static-access，抑制与静态存取不正确相关的警告 
    -   static-method，抑制与可能宣告为 static 的方法相关的警告– 
    -   super，抑制与置换方法相关但不含 super 呼叫的警告 
    -   ... 

例如：

```java
public class AnnotationTest {
    public static void main(String[] args) {
        Person p1 = new Student();
        p1.eat();

        // todo @Deprecated 表示已经过时，不推荐使用，但是还可以使用
        Person p2 = new Person("张三");

        // 该变量定义了，但是还未使用，就会出现警告，可以使用 todo @SuppressWarnings 标记来屏蔽警告
        @SuppressWarnings("unused") int num = 10;

    }
}

class Person {
    String name;
    int age;

    public Person(){
    }

    @Deprecated
    public Person(String name){
        this.name = name;
    }

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void eat(){
        System.out.println(" Person eat");
    }
}

class Student extends Person{
    @Override  // 加上这个注解会显式的去校验是否是重写方法，如果不是会报错
    public void eat(){
        System.out.println("Student eat");
    }
}
```

## 元注解

JDK1.5 在 java.lang.annotation 包定义了 4 个标准的 meta-annotation 类型，它们被用来提供对其它 annotation 类型作说明。 

元注解：对现在的注解进行解释性说明（即元注解是注解的注解） 

（1）**@Target：**用于**描述注解的使用范围** （即说明它描述的注解的使用范围）

-   可以通过枚举类型 ElementType 的 10 个常量对象来指定 
-   TYPE，METHOD，CONSTRUCTOR，PACKAGE..... 

（2）**@Retention：**用于**描述注解的生命周期** 

-   可以通过枚举类型 RetentionPolicy 的 3 个常量对象来指定 
    -   SOURCE（源代码）、CLASS（字节码）、RUNTIME（运行时） 

-   唯有 RUNTIME 阶段才能被反射读取到。 

（3）**@Documented**：表明这个注解应该被 javadoc 工具记录。 

（4）**@Inherited：**允许子类继承父类中的注解 



## 自定义注解的使用 

一个完整的注解应该包含三个部分： 

1）声明 

2）使用 

3）读取 

### 声明自定义注解  

```java
[元注解] 
[修饰符] @interface 注解名{ 
	[成员列表] 
} 
```

-   自定义注解可以通过四个元注解**@Retention,  @Target，@Inherited, @Documented**，分别说明它的声明周期，使用位置，是否被继承，是否被生成到 API 文档中。 

-   Annotation 的成员在 Annotation 定义中以无参数有返回值的抽象方法的形式来声明，我们又称为配置参数。返回值类型只能是八种基本数据类型、String 类型、Class类型、enum 类型、Annotation 类型、以上所有类型的数组 

-   可以使用 **default** 关键字为抽象方法**指定默认返回值**
-   如果定义的注解含有抽象方法，那么使用时必须指定返回值，除非它有默认值。格式是“方法名 = 返回值”，如果只有一个抽象方法需要赋值，且方法名为 value，可以省略“value=”，所以如果注解只有一个抽象方法成员，建议使用方法名 value。 

```java
public @interface MyBook {
    String name() default "Java从入门到入土";

    String[] authors() default "宁洪康";

    double price() default 999;
}
```

### 使用自定义注解

```java
@MyBook(authors = {"黑马","白马"}, price = 199)  // name 未指定，使用默认值
public class AnnotationDemo1 {

    @MyBook(name = "《精通JavaSE1》",authors = {"黑马","白马"}, price = 199)
    private AnnotationDemo1(){

    }

    @MyBook(name = "《精通JavaSE2》",authors = {"黑马","白马"}, price = 199)
    public static void main(String[] args) {

    }
}
```



### 读取和处理自定义注解

自定义注解必须配上注解的信息处理流程才有意义。 

我们自己定义的注解，只能使用反射的代码读取，所以自定义注解的声明周期必须是RetentionPolicy.RUNTIME。 

