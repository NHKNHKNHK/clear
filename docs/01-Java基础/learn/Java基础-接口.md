# 接口

## 什么是接口

接口是一种**公共的规范标准**，只要符合标准，大家都可以使用

Java中的接口更多的体现在对**行为的抽象**

接口是比抽象类更彻底的抽象，接口中全部都是抽象方法（在JDK8之前），**接口同样不能创建对象**

接口的体现是规范思想，实现接口的子类必须重写完接口中的全部抽象方法

## 接口的定义

```java
修饰符 interface 接口名称{
    // 抽象方法
}

// 修饰符：public|缺省
// 接口的声明：interface
// 接口名称：首字母大写，满足”驼峰命名“
```

## 接口成分的特点

在JDK8之前，接口中的成分包含：抽象方法、常量

- 抽象方法的一定是 `public abstract`修饰，允许省略public、abstract修饰符；
- 常量一定是`public static final`修饰 ，允许省略public、final、static修饰符，因为接口中不会存在变量
  - 常量的一般修饰符是：`public static final`缺一不可
  - 常量的变量名称一般建议全部大写，例如：SCHOOL_NAME

### 抽象方法

接口中的抽象方法可以省略 `public abstract`不写，默认会加上

```java
// 如下三种写法是等价的
public abstract void jump();

public void jump();

abstract void jump();
```

### 常量

```java
// 如下写法是等价的
public final static String SCHOOL_NAME = "哈哈哈";

public final String SCHOOL_NAME = "哈哈哈";
public static String SCHOOL_NAME = "哈哈哈";
final static String SCHOOL_NAME = "哈哈哈";

public String SCHOOL_NAME = "哈哈哈";
static String SCHOOL_NAME = "哈哈哈";
final String SCHOOL_NAME = "哈哈哈";

String SCHOOL_NAME = "哈哈哈";
```

### JDK8之后新增的接口方法

从JDK8开始之后，接口不再纯洁了，接口中不再只是抽象方法，新增如下：

#### 默认方法

- **默认方法**（defalut 也就是实例方法）
  - 必须使用`default`修饰，默认为 `public default`，public可省略
  - 该默认方法与普通的实例方法相比只是使用了`default`修饰
  - **只能使用接口的实现类的对象来调用**

ep：

```java
public class Demo {
    public static void main(String[] args) {
        Student student = new Student();
        student.eat();  // 实现类调用接口中的默认方法
    }
}

interface People {
    default void eat() {	// 默认方法，其实就是我们之前写的实例方法
        System.out.println("人都会吃饭");
    }
}

class Student implements People{
    
}
```

#### 静态方法

- **静态方法**
  - 使用`static`修饰，默认为 `public static`，public可省略
  - 接口的静态方法只能用接口的类名称调用（类不拥有接口中的static方法，需要接口名调用）
    - 1）区别与类继承父类，然后用子类名调用父类的静态成员（共享）
    - 2）比如说：某一个实现类，实现了多个接口，如果多个接口中存在相同的静态方法，如果可以使用实现类调用，那么将不知道调用的是哪个接口中的静态方法
    - 3）即使某个子接口继承了某个父接口，也不能使用子接口名调用父接口中的静态方法，必须使用父接口名调用

```java
public class InterfaceDemo2 {
    public static void main(String[] args) {
        BasketBall basketBall = new BasketBall();
//        basketBall.test();	// 报错，不能使用实现类调用接口静态方法
//        SportMan.test();		// 报错，SportMan接口中没有静态方法test
        LaW.test();				// 正确，LaW,Go都分别存在静态方法test。分别使用接口名调用
        Go.test();

    }
}

class BasketBall implements SportMan{	// 实现类，实现接口
    @Override
    public void run() {
    }
}

interface SportMan extends LaW,Go{
    void run();
}
interface LaW{
    static void test(){
        System.out.println("LaW test");
    }
}
interface Go{
    static void test(){
        System.out.println("Go test");
    }
}
```

#### 私有方法

- **私有方法**（包含私有实例方法、私有静态方法）从**JDK9**开始
  - 其实就是私有的实例方法，必须使用`private`修饰
  - 私有的实例方法，只能在本接口中调用
  - 私有方法**通常是给私有方法或默认方法调用的**

ep：

```java
interface People {
    default void eat() {
        // todo 私有的实例方法，只能在本接口中调用
        //  私有方法通常是给私有方法或默认方法调用的
        respiration();  
        System.out.println("人都会吃饭");

    }

    
    private void respiration(){
        System.out.println("人都会呼吸");
    }
}
```



## 接口的基本实现

接口的基本实现语法

```java
修饰符 class 实现类名称 implements 接口1,接口2,... {	// 这个就是接口的 实现类
    
    // 实现接口中的全部抽象方法
}
```

- 一个类实现了某个接口，这个类称为这个接口的实现类

- 接口是用来被类实现的，实现关键字``，接口可以多实现

- 一个类实现接口必须重写完接口中所有的抽象方法，否则这个类要定义为抽象类

  - ```java
        /**
         * 接口的多实现
         *
         * 类与类是单继承关系
         * 类与接口是多实现关系
         */
        public class InterfaceDemo {
            public static void main(String[] args) {
                // 创建实现类对象调用重写的方法执行！！
                BasketBall basketBall = new BasketBall();
                basketBall.run();
            }
        }
        
        class BasketBall implements SportMan,LaW{
        
            @Override
            public void run() {
            }
        
            @Override
            public void competition() {
            }
        
            @Override
            public void rule() {
            }
        }
        
        interface SportMan{
            void run();
            void competition();
        }
        interface LaW{
            void rule();
        }
        ```

## 接口与接口的多继承

```java
/**
 * 接口的多继承
 * 引入：
 *      类与类是单继承关系：一个类只能继承一个直接父类
 *      类与接口是多实现关系：一个类可以同时实现多个接口
 *      接口与接口是多继承关系：一个接口可以同时继承多个接口
 *              用于一个接口合并多个接口，在实现类只需要实现一个接口即可
 */
public class InterfaceDemo2 {

}

class BasketBall implements SportMan{  
    // todo 我们只实现类一个接口，却要实现接口内的所有抽象方法
    //  包括接口继承的抽象方法

    @Override
    public void run() {
    }

    @Override
    public void competition() {
    }

    @Override
    public void rule() {
    }

    @Override
    public void abroad() {
    }
}
interface SportMan extends LaW,Go{
    void run();
    void competition();
}
interface LaW{
    void rule();
}
interface Go{
    void abroad();
}
```



## 实现多接口的注意事项

- 实现多个接口，多个接口中存在同名的静态方法并不会冲突
  - 原因是只能通过各自接口的接口名访问各自的静态方法

- 当一个类，即继承了一个父类，又实现了若干个接口时
  - 父类中的成员方法与接口中的默认方法重名时，子类就近选择执行父类的成员方法

```java
public class Demo {
    public static void main(String[] args) {
        Cat cat = new Cat();
        cat.run();	// 父类 run
    }
}

class Cat extends Animal implements A1{
}
class Animal{
    public void run(){
        System.out.println("父类 run");
    }
}

interface A1{
    default void run(){
        System.out.println("接口 run");
    }
}
```

- 当一个类实现多个接口时，多个接口中存在同名的默认方法
  - 实现类必须重写这个方法

```java
class C1 implements A1,A2{
    @Override
    public void run() { // 必须重写接口中冲突的默认方法
        
    }
}
interface A1{
    default void run(){
        System.out.println("A1 run");
    }
}
interface A2{
    default void run(){
        System.out.println("A2 run");
    }
}
```

- 接口中，没有构造器，不能创建对象
  - 接口是更彻底的抽象，连构造器都没有，自然不能创建对象

## 抽象类与接口的区别

设计理念的区别：

- 抽象类：对类的抽象（包括属性、行为）
- 接口：对行为的抽象（主要是行为）

成员区别：

- 抽象类：变量、常量、有构造方法（给子类用的）、有抽象方法、有非抽象方法

- 接口：常量、抽象方法、JDK8开始：静态方法、默认方法、私有方法（JDK9）
