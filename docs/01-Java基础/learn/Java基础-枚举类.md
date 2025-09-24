# 枚举类

## 概述

-   JDK 1.5 引入了一种新的数据类型——枚举类型，Java使用关键字 `enum `声明枚举类型。

-   基本格式如下：

    ```java
enum 枚举名{
    	常量列表  // 建议大写
    }
    ```
    
-   枚举类型的作用是：为了**作为信息的标志和信息分类，提高了代码的可读性**。入参约束严谨，是最好的信息分类技术，推荐使用。

-   枚举类型本质上也是一种类，只不过是这个类的对象是有限的、固定的几个，不能让用户随意创建。 

-   枚举类的例子举不胜举： 

​	星期：Monday(星期一)......Sunday(星期天) 

​	性别：Man(男)、Woman(女) 

​	月份：January(1 月)......December(12 月) 

​	 季节：Spring(春节)......Winter(冬天) 

​	三原色：red(红色)、green(绿色)、blue(蓝色) 

​	支付方式：Cash（现金）、WeChatPay（微信）、Alipay(支付宝)、BankCard(银行卡)、CreditCard(信用卡) 

​	就职状态：Busy(忙碌)、Free(空闲)、Vocation(休假)、Dimission(离职) 

​	订单状态：Nonpayment（未付款）、Paid（已付款）、Fulfilled（已配货）、Delivered（已发货）、Checked（已确认收货）、Return（退货）、Exchange（换货）、Cancel（取消） 

​	线程状态：创建、就绪、运行、阻塞、死亡  

-   若枚举只有一个对象, 则可以作为一种单例模式的实现方式。 

-   枚举类的实现： 
    -   在 JDK5.0 之前，需要程序员自定义枚举类型。 
    -   在 JDK5.0 之后，Java 支持 `enum` 关键字来快速定义枚举类型。 

## 定义枚举类（JDK5.0 之前）

在 JDK5.0 之前如何声明枚举类呢？ 

-   **私有化类的构造器**，保证不能在类的外部创建其对象 
-   在类的内部创建枚举类的实例。声明为：**public static final** ，对外暴露这些**常量**对象 
-   对象如果有实例变量，应该声明为 *private final*（建议，不是必须），并在构造器中初始化 

例如： 

```java
// JDK 1.5 以前自定义的枚举类
public class Season {
    private final String SEASONNAME;  // 季节的名称
    private final String SEASONDESC;  // 季节的描述

    // todo 私有构造器
    private Season(String seasonName, String seasonDesc) {
        this.SEASONNAME = seasonName;
        this.SEASONDESC = seasonDesc;
    }

    public static final Season SPRING = new Season("春天", "春暖花开");
    public static final Season SUMMER = new Season("夏天", "夏日炎炎");
    public static final Season AUTUMN = new Season("秋天", "秋高气爽");
    public static final Season WINTER = new Season("冬天", "白雪皑皑");

    @Override
    public String toString() {
        return "Season{" +
                "SEASONNAME='" + SEASONNAME + '\'' +
                ", SEASONDESC='" + SEASONDESC + '\'' +
                '}';
    }
}

class SeasonTest {
    public static void main(String[] args) {
        System.out.println(Season.AUTUMN);
    }
}
```

## 定义枚举类（JDK5.0 之后）

### enum 关键字声明枚举

```java
[修饰符] enum 枚举类名{
    常量对象列表  // 建议大写
}

[修饰符] enum 枚举类名{
    常量对象列表;

    对象的实例变量列表;
}
```

例如：

```java
public enum Week {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY;
    // 常量用 , 分隔  ; 可省略
}

class TestEnum {
    public static void main(String[] args) {
        Week monday = Week.MONDAY;
        System.out.println(monday);  //
    }
}
```

### enum 方式定义的要求和特点  

-   枚举类的**常量对象列表必须在枚举类的首行**，因为是常量，所以**建议大写**。
-   列出的实例系统会自动添加 **public static final** 修饰。 
-   如果**常量对象列表后面没有其他代码，那么“；”可以省略**，否则不可以省略“；”。 
-   编译器给枚举类**默认提供的是 private 的无参构造**，如果枚举类需要的是无参构造，就不需要声明，写常量对象列表时也不用加参数 
-   如果枚举类需要的是有参构造，需要手动定义，有参构造的 private 可以省略，调用有参构造的方法就是在常量对象名后面加(实参列表)就可以。 
-   **枚举类默认继承的是 java.lang.Enum 类**，因此不能再继承其他的类型。 
-    JDK5.0 之后 switch，提供支持枚举类型，case 后面可以写枚举常量名，无需添加枚举类作为限定。 

例如：

```java
public enum SeasonEnum {
    SPRING("春天", "春风又绿江南岸"),
    SUMMER("夏天", "映日荷花别样红"),
    AUTUMN("秋天", "秋水共长天一色"),
    WINTER("冬天", "窗含西岭千秋雪");
    private final String seasonName;
    private final String seasonDesc;

    private SeasonEnum(String seasonName, String seasonDesc) {
        this.seasonName = seasonName;
        this.seasonDesc = seasonDesc;
    }

    public String getSeasonName() {
        return seasonName;
    }

    public String getSeasonDesc() {
        return seasonDesc;
    }
}
```

经验之谈：

​	开发中，当需要定义一组常量时，强烈建议使用枚举类。

## enum 中常用方法

注意：

​	所有的枚举类都默认继承了 java.lang.Enum 类

```java
public String toString()  //  默认返回的是常量名（对象名），可以继续手动重写该方法！ 
```

**static 枚举类型[] values()**：**返回枚举类型的对象数组**。该方法可以很方便地遍历所有的枚举值，是一个静态方法 

**static 枚举类型 valueOf(String name)**：可以**把一个字符串转为对应的枚举类对象**。要求字符串必须是枚举类对象的“名字”。如不是，会有运行时异常：IllegalArgumentException。 

 **String name()**：**得到当前枚举常量的名称**。建议优先使用 toString()。 

 **int ordinal()**：**返回当前枚举常量的次序号**，默认从 0 开始 

例如：

```java
package com.enum1;

import java.util.Scanner;

public class TestEnumMethod {
    public static void main(String[] args) {
        // values()  返回枚举类型的对象数组
        Week[] values = Week.values();
        for (int i = 0; i < values.length; i++) {
            // ordinal() 返回当前枚举常量的次序号
            // name() 得到当前枚举常量的名称
            System.out.println((values[i].ordinal() + 1) + "->" + values[i].name());
        }
        System.out.println("------------------------");
        Scanner input = new Scanner(System.in);
        System.out.print("请输入星期值：");
        int weekValue = input.nextInt();
        Week week = values[weekValue - 1];
        //toString() 返回的是常量名
        System.out.println(week);
        System.out.print("请输入星期名：");
        String weekName = input.next();
        //valueOf() 把一个字符串转为对应的枚举类对象
        week = Week.valueOf(weekName);
        System.out.println(week);
        input.close();
    }
}
```

## 实现接口的枚举类

-   和普通 Java 类一样，**枚举类可以实现一个或多个接口** 
-   若每个枚举值在调用实现的接口方法呈现相同的行为方式，则只要统一实现该方法即可。 
-   若需要每个枚举值在调用实现的接口方法呈现出不同的行为方式，则可以让每个枚举值分别来实现该方法 

语法如下：

```java
// 1、枚举类可以像普通的类一样，实现接口，并且可以多个，但要求必须实现里面所有的抽象方法！
enum A implements 接口 1，接口 2{
    //抽象方法的实现
}

// 2、如果枚举类的常量可以继续重写抽象方法!
enum A implements 接口 1，接口 2{
 常量名 1(参数){
 //抽象方法的实现或重写
 },
 常量名 2(参数){
 //抽象方法的实现或重写
 },
 //...
}
```

例如：

```java
package com.enum1;

interface Info {
    void show();
}

//使用 enum 关键字定义枚举类
enum Season1 implements Info {
    //1. 创建枚举类中的对象,声明在 enum 枚举类的首位
    SPRING("春天", "春暖花开") {
        public void show() {
            System.out.println("春天在哪里？");
        }
    },
    SUMMER("夏天", "夏日炎炎") {
        public void show() {
            System.out.println("宁静的夏天");
        }
    },
    AUTUMN("秋天", "秋高气爽") {
        public void show() {
            System.out.println("秋天是用来分手的季节");
        }
    },
    WINTER("冬天", "白雪皑皑") {
        public void show() {
            System.out.println("2002 年的第一场雪");
        }
    };
    //2. 声明每个对象拥有的属性:private final 修饰
    private final String SEASON_NAME;
    private final String SEASON_DESC;

    //3. 私有化类的构造器
    private Season1(String seasonName, String seasonDesc) {
        this.SEASON_NAME = seasonName;
        this.SEASON_DESC = seasonDesc;
    }

    public String getSEASON_NAME() {
        return SEASON_NAME;
    }

    public String getSEASON_DESC() {
        return SEASON_DESC;
    }
}
```

## 枚举类的应用

### 使用枚举替换 if-else

if-else的方式

```java
public class TestMain {
    public static void main(String[] args) {
        eatWhat("Cat");      
    }

    // if-else
    private static void eatWhat(String animalType) {
        if ("Dog".equals(animalType)) {
            System.out.println("吃骨头");
        } else if ("Car".equals(animalType)) {
            System.out.println("我想吃鱼了");
        } else if ("Sheep".equals(animalType)) {
            System.out.println("我吃的是草，挤出来的奶");
        } else {
            System.out.println("没得吃");
        }
    }
}
```

使用枚举消除代码中的if-else

```java
// 首先定义了一个接口
public interface Eat {
    void eat();
}

// 接着定义了一个枚举类，实现了Eat接口
public enum AnimalEnum implements Eat{
    Dog(){
        @Override
        public void eat() {		//每个枚举常量都实现了接口方法，相对于if-else中代码的逻辑
            System.out.println("吃骨头");
        }
    },
    Cat(){
        @Override
        public void eat() {
            System.out.println("我想吃鱼了");
        }
    },
    Sheep(){
        @Override
        public void eat(){
            System.out.println("我吃的是草，挤出来的奶");
        }
    }

}

// 测试
public class TestMain {
    public static void main(String[] args) {
        // valueOf 将String转换为枚举
        AnimalEnum cat = AnimalEnum.valueOf("Cat");
        cat.eat();
    }
}
```



### 使用枚举实现单例设计模式

```java
public class SingletonExample {
    // 私有构造器，避免外部创建实例
    private SingletonExample(){}

    public static SingletonExample getInstance(){
        return Singleton.INSTANCE.instance;
    }
    private enum Singleton{
        INSTANCE;
        private SingletonExample instance;

        // JVM 保证了这个方法绝对只调用一次
        Singleton(){
            instance = new SingletonExample();
        }
        public SingletonExample getInstance(){
            return instance;
        }
    }
}
```

测试

```java
public class TestMain {
    public static void main(String[] args) {
        SingletonExample instance = SingletonExample.getInstance();
        SingletonExample instance2 = SingletonExample.getInstance();
        System.out.println(instance == instance2);  // true
    }
}
```

