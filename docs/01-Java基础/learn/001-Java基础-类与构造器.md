# 面向对象

面向对象基本思想：

-   用代码去高度模拟现实世界，以便为人类的业务服务。
-   Java是一种面向对象的高级编程语言
-   高级编程语言：代码风格很像人类语言

## 三大特征

面向对象三大特征：封装、继承、多态

### 封装

-   1）封装的作用

    -   可以提高代码的安全性
    -   可以实现代码的组件化
    -   封装的体现：基本思想是属性与方法的归属

-   2）封装的规范

    -   **建议**成员变量都私有：用private修饰
        -   private修饰的成员方法、成员变量、构造器等只能在本类被直接访问
    -   提供成套的getter\setter方法暴露成员变量的取值和赋值。
        -   public修饰，是公开的

- 3）小结
  -     封装的核心思想：合理隐藏，合理暴露
-     封装已成为Java代码的风格，即使代码毫无意义，还是需要按照封装的规范来写代码
        -     成员变量私有，提供getter\setter方法

### 继承（extends）

继承是Java中一般到特殊的关系，是一种子类到父类的关系，是 ”is a“的关系。

​	例如：学生类继承了人类。猫类继承了动物类。   

```
父类		子类
超类		子类
基类		派生类
```

继承的特点：使子类直接具有父类的属性和方法，还可以在子类中重写、追加属性和方法。（因此在Java中，子类一般都比父类强大）

#### **继承的好处**

-   提高代码的复用性（多个类相同的成员可以定义在同一个父类中）
-   提高代码的可维护性（如果方法需要修改，修改一处即可）

格式：

```java
修饰符 子类 extends 父类{

}
```



#### **继承后子类不能继承的成员**

-   子类不能继承父类的**构造器**：子类有属于自己的构造器（这一点无可争议）
-   子类不能继承父类中的**私有成员**（private修饰的，包括私有成员，私有方法）
    -   诡辩：我认为子类是可以继承父类的私有成员的，只是不能直接访问而已
        -   可以暴力反射去访问继承自父类的私有成员
-   子类不能继承父类中的**静态成员**
    -   但是子类可以直接通过子类类名访问父类中的静态成员。
        -   静态成员只属于父类，只不过子类与父类建立了关系，父类只是将静态成员共享给子类使用了
        -   ==共享并非继承，只是给子类用而已==



#### **继承中成员变量的访问特点**

子类局部找	==>	子类成员找	==>	父类成员找	==>	报错（不考虑父类的父类....）

①子类局部找

```java
public class TestDemo {
    public static void main(String[] args) {
        Cat cat = new Cat();
        cat.show();
    }
}
class Animal {
    public String name = "动物名称";
}

class Cat extends Animal {
    public String name = "子类名称";
    public void show() {
        String name = "局部名称";
        System.out.println(name);   // 局部名称
    }
}
```

②子类成员找	

```java
public class TestDemo {
    public static void main(String[] args) {
        Cat cat = new Cat();
        cat.show();
    }
}
class Animal {
    public String name = "动物名称";
}

class Cat extends Animal {
    public String name = "子类名称";
    public void show() {
        System.out.println(name);   // 子类名称
    }
}
```

③父类成员找

```java
public class TestDemo {
    public static void main(String[] args) {
        Cat cat = new Cat();
        cat.show();
    }
}
class Animal {
    public String name = "动物名称";
}

class Cat extends Animal {
    public void show() {
        System.out.println(name);   // 动物名称
    }
}
```

想要访问子类名称	/	想要访问父类名称

```java
public class TestDemo {
    public static void main(String[] args) {
        Cat cat = new Cat();
        cat.show();
    }
}
class Animal {
    public String name = "动物名称";
}

class Cat extends Animal {
    public String name = "子类名称";
    public void show() {
        String name = "局部名称";
        System.out.println(name);   // 局部名称
        System.out.println(this.name);   // 子类名称
        System.out.println(super.name);   // 动物名称
    }
}
```



#### **继承中成员方法的访问特点**

子类成员	==>	父类成员	==>	报错（不考虑父类的父类....）

#### 继承中构造器的访问特点

-   子类中所有的构造器都会默认访问父类中的无参构造器
    -   子类构造器一定会默认先访问父类无参构造器，再执行子类自己的构造器

```java
class Animal {
    private String name;
    public Animal(String name){
        this.name = name;
    }
}

class Cat extends Animal {	// 编译错误：因为父类没有提供无参构造器

}
```

-   因为子类会继承父类中的数据（属性和行为），所有子类初始化之前一定要完成父类的初始化
    -   ==每一个子类构造器的第一条语句默认都是（super();）==
        -   经验：因此我们可以将子类中都需要的共性功能都写在父类中，

-   如果父类中没有无参构造器，只有带参构造器怎么办？

    -   可以通过super关键字显式去调用父类的带参构造器。如下：

    -   ```java
        class Animal {
            private String name;
            public Animal(String name){
                this.name = name;
            }
        }
        
        class Cat extends Animal {	// 编译正常
            public Cat(String name){
                super(name);	// 会根据参数匹配到父类的构造器完成初始化
            }
        }
        ```

    -   在父类中自己手工提供一个无参构造器（推荐方式）



#### 方法重写

方法重写是指子类继承了父类，子类就得到了父类的某个方法。但是子类觉得父类的这个方法不好用或者是不满足自己的需求，子类就可以对这个方法进行重写。

重写的要点：

-   子类重写的方法 **形参列表** 与 **方法名** 与父类中的一致
    -   JDK1.5之后，允许重写的方法的返回值类型是父类方法的类型的子类型（即返回值类型不必完全一致）
-   子类重写的方法不能降低访问权限（即访问修饰符必须大于等于父类方法）
    -   public > protected > default > private
-   子类重写发方法抛出的异常要比父类抛出的异常相同或更小
-   父类中的静态方法、私有方法不能被重写
-   建议在重写的方法上加上 `@Override` 注解，帮助检查重写方法的方法声明的正确性

ep：

```java
class Animal {
    public String eat(){
        return "eat...";
    }
}
class Cat extends Animal {
    @Override
    public String eat() {	// 成功重写
        return "Cat eat...";
    }
}
```

```java
class Animal {
    public Object eat(){
        return "eat...";
    }
}
class Cat extends Animal {
    @Override
    public String eat() {	// 成功重写，String是Object的子类
        return "Cat eat...";
    }
}
```

```java
class Animal {
    Object eat() {
        return "eat...";
    }
}

class Cat extends Animal {
    @Override
    protected String eat() {	// 成功重写，protected > defunct
        return "Cat eat...";
    }
}
```

```java
class Animal {
    Object eat() throws IOException {
        return "eat...";
    }
}

class Cat extends Animal {
    @Override
    protected String eat() throws FileNotFoundException {
        							// 成功重写，IOException > FileNotFoundException
        return "Cat eat...";
    }
}
```

建议：

-   在开发中，一般我们都是**方法签名**会与父类一致，只是重写方法体

#### 继承的特点

-   单继承：一个类只能直接继承一个父类

-   多层继承：一个类可以间接继承多个类
-   一个类可以有多个子类
-   Java中所有的类都直接或间接继承自Object类

单继承反证示例：

```java
class A{
    public void test(){
        System.out.println("A");
    }
}
class B{
    public void test(){
        System.out.println("B");
    }
}
class C extends A,B{
    public static void main(String[] args) {
        C c = new C();
        c.test();   // 出现了类的二义性！因此Java不支持多继承
    }
}
```



#### 继承的弊端

继承让类与类之间产生了关系，类的耦合增强了，当父类发生变化时，子类实现也不得不发生变化，削弱了子类的独立性



面向对象最重要的两个概念：类和对象

-   类：是描述相同事物的共同特征的抽象

-   对象：是具体存在的实例。	

类是对象的抽象，对象是类的实例。（实例 == 对象）

在代码层面上：必须现有类，才能创建出对象。

## 类

定义类的格式：

```java
修饰符 class 类名{

}
// 注意：
//	类名的首字母应该大写，满足”驼峰命名“
//	一个Java文件中，可以定义多个类。但是只能有一个类为public修饰
//								public修饰的类名必须成为代码的文件名称
```

### 类中的成分研究

类的组成：属于 与 行为

​	属性：在类中通过 **成员变量** 来体现

​	行为：在类中通过 **成员方法** 来体现 （与普通方法相比，去掉了static关键字）

-   类中有且仅有五大成分

```java
修饰符 class 类名{
	// 1.成员变量（Field：描述类 和 对象的属性信息的）：存储在堆内存中
    // 2.成员方法（Method：描述类 或者 对象的行为信息的）
    // 3.构造器（Constructor：初始化一个类的对象并返回引用）
    // 4.代码块
    // 5.内部类
    
    // 注意：只要不是以上五大成分，直接放在类下就会报错
}
```

下面是一个反例：

```java
public class ClassDemo1 {
    // 编译报错，因为下面这种写法不是类的五大成分
    System.out.println("hello");
    
    // 类中只能放 类的五大成分
}
```

##  构造器

作用：初始化一个类的对象并返回引用

```java
// 格式
修饰符 类名(形参){
    
}

// 构造器初始化对象的格式
类名 对象名称 = new 构造器;

// 	对象名称：在方法栈内存中，存储的是对象在堆内存中的引用地址
//	对象：存储在堆内存中
```

-   构造器的创建：一个类默认会自带一个无参构造器，即使不写也存在。
    -   但是如果一个类它写了一个或多个构造器，那么默认的无参构造器就被覆盖了！！！

-   构造器的**重载**：构造器可以看作是没有类型的方法，可以被重载
-   建议：无论是否需要无参构造器，都**建议手工书写无参构造器。**