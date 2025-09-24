# Interface 接口

​	接口就是一种公共的规则标准，只要符合标准，大家都能使用。

​	Java不支持多继承，单继承使得Java易于管理，也避免了像C++那样的菱形继承。为了克服单继承的缺点，Java引入了接口。

​	在 Java 中，**接口**（Interface）是一种抽象类型，它定义了一组方法的签名（方法名、参数列表和返回类型），但**没有具体的实现**。**接口可以被类实现（implements），一个类可以实现多个接口**。

​	Java中的接口更多的体现在对于行为的抽象。

## 接口的定义

​	接口的定义，它与定义类方式相似，但是使用 *interface* 关键字。它也会被编译成.class 文件，但一定要明确它并不是类，而是另外一种引用数据类型。 

引用数据类型：数组，类，枚举，接口，注解

### 接口的声明

基本语法

```java
[public] interface 接口名 {  // 接口声明
    // 接口体，如下：
  
    // 公共的全局静态常量
    // 公共的抽象方法
		
    // 公共的默认方法（JDK1.8 以上）
    // 公共的静态方法（JDK1.8 以上）
    // 私有方法（JDK1.9 以上）  
}
```

接口体

​	接口中的方法默认是公共的（public），并且不能包含实例变量。接口可以包含常量（使用 `final` 和 `static` 修饰的变量），以及默认方法（（jdk8）使用 `default` 关键字修饰的方法）和静态方法（（jdk8）使用 `static` 关键字修饰的方法）。

​	在JDK8之前，接口只能声明抽象方法，修饰为 public abstract

```java
intercafe Printable{
    // 全局常量    public static final 可省略
	public static final int MIN_SPEED = 0;  // 等价于 int MIN_SPEED = 0; 
    
    // 抽象方法		public abstract 可省略
    public abstract void fly();		// 等价于 void fly();	
}
```

###  接口的成员说明  

**在 JDK8.0 之前**，接口中只允许出现： 

-   公共的静态的常量：其中 `public static final`可以省略 
-   公共的抽象的方法：其中 `public abstract 可以省略 

理解：接口是从多个相似类中抽象出来的规范，不需要提供具体实现 

**在 JDK8.0 时**，接口中允许声明 **默认方法** 和 **静态方法** ： 

-   公共的默认的方法：其中 **public 可以省略**，建议保留，但是 **default 不能省略** 
-   公共的静态的方法：其中 **public 可以省略**，建议保留，但是 **static 不能省略** 

**在 JDK9.0 时**，接口又增加了私有方法 

除此之外，接口中没有构造器，没有初始化块，因为接口中没有成员变量需要动态初始化



## 接口的使用规则

### 1）类实现接口（implements） 

​	接口**不能创建对象**，但是可以被类实现（implements ，类似于被继承）。 

​	类与接口的关系为实现关系，即**类实现接口**，该类可以称为接口的实现类。实现的动作类似继承，格式相仿，只是关键字不同，**实现使用 implements** 关键字。 

```java
[修饰符] class 实现类 implements 接口{
    // 重写接口中抽象方法（必须），当然如果实现类是抽象类，那么可以不重写
    // 重写接口中默认方法（可选）
}

[修饰符] class 实现类 extends 父类 implements 接口{
 	// 重写接口中抽象方法（必须），当然如果实现类是抽象类，那么可以不重写
    // 重写接口中默认方法（可选）
}
```

注意： 

-   如果接口的实现类是**非抽象类**，那么**必须重写接口中所有抽象方法**。
-   默认方法可以选择保留，也可以重写。 
-   重写时，default 单词就不要再写了，它只用于在接口中表示默认方法，到类中就没有默认方法的概念了 
-   接口中的 静态方法 不能被继承也不能被重写 

举例：

```java
interface USB {
    void start();

    void stop();
}

class Computer {
    public static void show(USB usb) {
        usb.start();
        System.out.println("=========== USB 设备工作 ========");
        usb.stop();
    }
}

class Flash implements USB {
    @Override
    public void start() {  // 重写方法
        System.out.println("U 盘开始工作。");
    }

    @Override
    public void stop() { // 重写方法
        System.out.println("U 盘停止工作。");
    }
}

class Print implements USB {
    @Override
    public void start() { // 重写方法
        System.out.println("打印机开始工作。");
    }

    @Override
    public void stop() { // 重写方法
        System.out.println("打印机停止工作。");
    }
};

public class InterfaceDemo {
    public static void main(String args[]) {
        Computer.show(new Flash());
        Computer.show(new Print());
        Computer.show(new USB() {
            public void start() {
                System.out.println("移动硬盘开始运行");
            }

            public void stop() {
                System.out.println("移动硬盘停止运行");
            }
        });
    }
}
```

### 2）接口的多实现（implements） 

在继承体系中，一个类只能继承一个父类。而对于接口而言，**一个类是可以实现多个接口的**，这叫做接口的**多实现**。并且，**一个类能继承一个父类，同时实现多个接口**

实现格式：

```java
[修饰符] class 实现类 implements 接口 1，接口 2，接口 3。。。{
    // 重写接口中所有抽象方法（必须），当然如果实现类是抽象类，那么可以不重写
    // 重写接口中默认方法（可选）
}
[修饰符] class 实现类 extends 父类 implements 接口 1，接口 2，接口3{
   	// 重写接口中所有抽象方法（必须），当然如果实现类是抽象类，那么可以不重写
    // 重写接口中默认方法（可选）
}
```

接口中，有多个抽象方法时，实现类必须重写所有抽象方法。**如果抽象方法有重名的，只需要重写一次**。

定义多个接口：

```java
package com.interface1;

public interface A {
    void showA();
}

package com.interface1;

public interface B {
    void showB();
}
```

定义实现类：

```java
package com.interface1;

public class C implements A, B {
    @Override
    public void showA() {
        System.out.println("showA");
    }

    @Override
    public void showB() {
        System.out.println("showB");
    }
}
```

测试类：

```java
package com.interface1;

public class TestC {
    public static void main(String[] args) {
        C c = new C();
        c.showA();
        c.showB();
    }
}
```

### 3）接口的多继承(extends)

一个接口能继承另一个或者多个接口，**接口的继承也使用 `extends`** 关键字，子接口继承父接口的方法。 

定义父接口： 

```java
package com.interface1;

public interface Chargeable {
    void charge();
    void in();
    void out();
}

```

定义子接口：

```java
package com.interface1;

public interface UsbC extends Chargeable{  // 子接口 继承 父接口
    void reverse();
}
```

定义子接口的实现类：

```java
package com.interface1;

public class TypeCConverter implements UsbC {
    @Override
    public void charge() {
        System.out.println("可充电");
    }

    @Override
    public void in() {
        System.out.println("接收数据");
    }

    @Override
    public void out() {
        System.out.println("输出数据");
    }


    @Override
    public void reverse() {
        System.out.println("正反面都支持");
    }
}
```

对于实现类：

​	所有父接口的抽象方法都有重写。 

​	方法签名相同的抽象方法只需要实现一次



### 4）接口与实现类对象构成多态引用

​	实现类实现接口，类似于子类继承父类，因此，接口类型的变量与实现类的对象之间，也可以构成多态引用。通过接口类型的变量调用方法，最终执行的是你 new 的实现类对象实现的方法体

定义接口：

```java
package com.interface1;

public interface USB3 {
    void in();
    void out();
}
```

接口的不同实现类：

```java
package com.interface1;

public class Mouse implements USB3 {
    @Override
    public void out() {
        System.out.println("发送脉冲信号");
    }

    @Override
    public void in() {
        System.out.println("不接收信号");
    }
}

package com.interface1;

public class KeyBoard implements USB3 {
    @Override
    public void in() {
        System.out.println("不接收信号");
    }

    @Override
    public void out() {
        System.out.println("发送按键信号");
    }
}
```

测试类

```java
package com.interface1;

public class USB3Test3 {
    public static void main(String[] args) {
        // 接口多态
        USB3 mouse = new Mouse();
        mouse.in();
        mouse.out();
        System.out.println("-------------------");
        USB3 keyBoard = new KeyBoard();
        keyBoard.in();
        keyBoard.out();
    }
}
```



### **5）使用接口的静态成员** 

接口不能直接创建对象，但是可以**通过接口名直接调用接口的静态方法和静态常量**

说明：

1）接口中的静态方法是JDK8中引入的

2）静态常量即全局常量

```java
package com.atguigu.interfacetype;
public class TestUSB3 {
 public static void main(String[] args) {
 //通过“接口名.”调用接口的静态方法 (JDK8.0 才能开始使用)
 USB3.show();
 //通过“接口名.”直接使用接口的静态常量
 System.out.println(USB3.MAX_SPEED);
 }
}
```



### **6）使用接口的非静态方法** 

-   对于接口的静态方法，直接使用“接口名.*”进行调用即可 
    -    也只能使用“接口名."进行调用，不能通过实现类的对象进行调用  

-   对于接口的抽象方法、默认方法，只能通过实现类对象才可以调用 
    -   接口不能直接创建对象，只能创建实现类的对象

```java
package com.atguigu.interfacetype;
public class TestMobileHDD {
    public static void main(String[] args) {
        //创建实现类对象
        MobileHDD b = new MobileHDD();
        //通过实现类对象调用重写的抽象方法，以及接口的默认方法，如果实现类
        重写了就执行重写的默认方法，如果没有重写，就执行接口中的默认方法
            b.start();
        b.in();
        b.stop();
        //通过接口名调用接口的静态方法
        // MobileHDD.show();
        // b.show();
        Usb3.show();
    }
}
```





## 接口特点

### 接口特点

接口用 interface 关键字修饰，[publuc] interface 接口名{}

类实现接口用 implement 关键字修饰，[public] class 类名 implement 接口名{}





### 接口成员





## **JDK8 中相关冲突问题** 

### **7.5.1 默认方法冲突问题**  

**（**

#### **1）类优先原则** 

当一个类，既继承一个父类，又实现若干个接口时，父类中的成员方法与接口 

中的抽象方法重名，子类就近选择执行父类的成员方法。代码如下：

定义接口：

```
package com.atguigu.interfacetype;
public interface Friend {
 default void date(){//约会
 System.out.println("吃喝玩乐");
 }
}
```

定义父类：

```java
package com.atguigu.interfacetype;
public class Father {
 public void date(){//约会
 System.out.println("爸爸约吃饭");
 }
}
```

定义子类：

```
package com.atguigu.interfacetype;
public class Son extends Father implements Friend {
 @Override
 public void date() {
 //(1)不重写默认保留父类的
 //(2)调用父类被重写的
// super.date();
 //(3)保留父接口的
// Friend.super.date();
 //(4)完全重写
 System.out.println("跟康师傅学 Java");
 }
}
```

定义测试类：

```
package com.atguigu.interfacetype;
public class TestSon {
 public static void main(String[] args) {
 Son s = new Son();
 s.date();
 }
}
```

**（**

#### **2）接口冲突（左右为难）** 

• 

**当一个类同时实现了多个父接口，而多个父接口中包含方法签名相同的默认方法时，** 

**怎么办呢？** 

无论你多难抉择，最终都是要做出选择的。

1.声明接口：

```
package com.atguigu.interfacetype;
public interface BoyFriend {
 default void date(){//约会
 System.out.println("神秘约会");
 }
}
```

2.选择保留其中一个，通过“*接口名**.super.**方法名*"的方法选择保留哪个接口的默 

认方法

```
package com.atguigu.interfacetype;
public class Girl implements Friend,BoyFriend{
 @Override
 public void date() {
 //(1)保留其中一个父接口的
// Friend.super.date();
// BoyFriend.super.date();
 //(2)完全重写
 System.out.println("跟康师傅学 Java");
 }
}
```



3.测试类

```
package com.atguigu.interfacetype;
public class TestGirl {
 public static void main(String[] args) {
 Girl girl = new Girl();
 girl.date();
 }
}
```

**当一个子接口同时继承了多个接口，而多个父接口中包含方法签名相同的默认方法** 

**时，怎么办呢？** 

1.另一个父接口：

```
package com.atguigu.interfacetype;
public interface USB2 {
 //静态常量
 long MAX_SPEED = 60*1024*1024;//60MB/s
 //抽象方法
 void in();
 void out();
 //默认方法
 public default void start(){
 System.out.println("开始");
 }
 public default void stop(){
 System.out.println("结束");
 }
 //静态方法
 public static void show(){
 System.out.println("USB 2.0 可以高速地进行读写操作");
 }
}
```

2.子接口：

```
package com.atguigu.interfacetype;
public interface USB extends USB2,USB3 {
 @Override
 default void start() {
 System.out.println("Usb.start");
 }
 @Override
 default void stop() {
 System.out.println("Usb.stop");
 }
}
```

小贴士： 

子接口重写默认方法时，default 关键字可以保留。 

子类重写默认方法时，default 关键字不可以保留。

### **7.5.2 常量冲突问题**  

• 

当子类继承父类又实现父接口，而父类中存在与父接口常量同名的成员变量，并且该 

成员变量名在子类中仍然可见。 

• 

当子类同时实现多个接口，而多个接口存在相同同名常量。 

此时在子类中想要引用父类或父接口的同名的常量或成员变量时，就会有冲突 

问题。 

父类和父接口：

```
package com.atguigu.interfacetype;
public class SuperClass {
 int x = 1;
}
package com.atguigu.interfacetype;
public interface SuperInterface {
 int x = 2;
 int y = 2;
}
package com.atguigu.interfacetype;
public interface MotherInterface {
 int x = 3;
}
```

子类：

```
package com.atguigu.interfacetype;
public class SubClass extends SuperClass implements SuperInterface,Mo
therInterface {
 public void method(){
// System.out.println("x = " + x);//模糊不清
 System.out.println("super.x = " + super.x);
 System.out.println("SuperInterface.x = " + SuperInterface.x);
 System.out.println("MotherInterface.x = " + MotherInterface.
x);
 System.out.println("y = " + y);//没有重名问题，可以直接访问
 }
}
```

## **接口的总结与面试题** 

-   接口本身不能创建对象，只能创建接口的实现类对象，**接口类型的变量可以与实现类对象构成`多态引用`**。 

-    声明接口用 interface，接口的成员声明有限制： 
    -   公共的静态常量 (全局常量，使用默认使用 public static final 修饰，可省略)
    -   公共的抽象方法(默认使用 public abstract 修饰，可省略) 
    -   公共的默认方法(默认使用 public default 修饰，public可省略，default不可以省略)（JDK8.0 及以上） 
    -   公共的静态方法(默认使用 public static 修饰，public可省略，static不可以省略)（JDK8.0 及以上） 
    -   私有方法（JDK9.0 及以上） 

-   类可以实现接口，关键字是 implements，而且支持多实现。如果实现类不是抽象类，就必须实现接口中所有的抽象方法。如果实现类既要继承父类又要实现父接口，那么继承（extends）在前，实现（implements）在后。 
-   接口可以继承接口，关键字是 extends，而且支持多继承。 
-   接口的**默认方法可以选择重写或不重写**。如果有冲突问题，另行处理。子类重写父接口的默认方法，要去掉 default，子接口重写父接口的默认方法，不要去掉 default。 
-   接口的静态方法不能被继承，也不能被重写。接口的静态方法只能通过“**接口名.静态方法名**”进行调用。

### **面试题** 

**1、为什么接口中只能声明公共的静态的常量？** 

因为接口是标准规范，那么在规范中需要声明一些底线边界值，当实现者在实 

现这些规范时，不能去随意修改和触碰这些底线，否则就有“危险”。 

例如：USB1.0 规范中规定最大传输速率是 1.5Mbps，最大输出电流是 

5V/500mAUSB3.0 规范中规定最大传输速率是 5Gbps(500MB/s)，最大输出电流是 

5V/900mA 

例如：尚硅谷学生行为规范中规定学员，早上 8:25 之前进班，晚上 21:30 之后 

离开等等



**2、为什么 JDK8.0 之后允许接口定义静态方法和默认方法呢？因为它违反了接** 

**口作为一个抽象标准定义的概念。** 

*静态方法*：因为之前的标准类库设计中，有很多 Collection/Colletions 或者 

Path/Paths 这样成对的接口和类，后面的类中都是静态方法，而这些静态方法 

都是为前面的接口服务的，那么这样设计一对 API，不如把静态方法直接定义 

到接口中使用和维护更方便。 

*默认方法*：（

1）我们要在已有的老版接口中提供新方法时，如果添加抽象方 

法，就会涉及到原来使用这些接口的类就会有问题，那么为了保持与旧版本代 

码的兼容性，只能允许在接口中定义默认方法实现。比如：Java8 中对 

Collection、List、Comparator 等接口提供了丰富的默认方法。（

2）当我们接 

口的某个抽象方法，在很多实现类中的实现代码是一样的，此时将这个抽象方 

法设计为默认方法更为合适，那么实现类就可以选择重写，也可以选择不重 

写。 

**3、为什么 JDK1.9 要允许接口定义私有方法呢？因为我们说接口是规范，规范** 

**是需要公开让大家遵守的。****私有方法**：因为有了默认方法和静态方法这样具有具体实现的方法，那么就可 

能出现多个方法由共同的代码可以抽取，而这些共同的代码抽取出来的方法又 

只希望在接口内部使用，所以就增加了私有方法。 

**7.7 接口与抽象类之间的对比** 

在开发中，常看到一个类不是去继承一个已经实现好的类，而是要么 

继承抽象类，要么实现接口。 

**7.8 练**



## **接口与抽象类之间的对比**

| 区别点       | 抽象类                                   | 接口                                                         |
| ------------ | ---------------------------------------- | ------------------------------------------------------------ |
| 定义         | 可以包含抽象方法的类                     | 主要是抽象方法和全局常量的集合                               |
| 成员组成     | 构造方法、抽象方法、普通方法、常量、变量 | 常量、抽象方法、（jdk8：静态方法、默认方法；jdk9：私有方法） |
| 使用         | 子类继承抽象类（extends）                | 子类实现接口（implement）                                    |
| 常见设计模式 | 模板方法                                 | 简单工厂、工厂方法、代理模式                                 |
| 对象         | 都通过对象的多态性实例化对象             | 都通过对象的多态性实例化对象                                 |
| 局限         | 抽象类有单继承的局限性                   | 接口没有此局限                                               |
| 实际         | 作为一个模板                             | 是作为一个标准或是表示一种能力                               |

接口与抽象类的关系：

-   类与类：类与类是继承关系，只能单继承，不过还可以多层继承
-   类与接口：类与接口是实现关系，可以是单实现，也可以是多实现，还可以在继承一个类的同时实现多个接口
-   接口与接口：接口与接口是继承关系，也可以多继承

说明：

​	选择：如果抽象类和接口都可以使用的话，优先使用接口，因为可以避免继承的局限性	

​	在开发中，常看到一个类不是去继承一个已经实现好的类，而是要么继承抽象类，要么实现接口。





在JDK8之前，接口只能声明抽象方法，修饰为 public abstract

JDK8开始，接口可以声明静态方法、默认方法

JDK9开始，接口可以声明私有方法

