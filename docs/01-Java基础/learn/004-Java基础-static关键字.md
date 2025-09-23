# static 关键字

Java在是通过有无 static 修饰，来区分是属于对象还是属于类的

在Java中，`static`是一个关键字，用于修饰类、方法和成员变量。

1.  修饰类：当一个类被声明为`static`时，它被称为**静态内部类**。静态内部类可以访问外部类的静态成员，但不能访问外部类的非静态成员（可以通过创建对象的方式访问）。
2.  修饰方法：当一个方法被声明为`static`时，它被称为**静态方法**。静态方法可以直接通过类名调用，而不需要创建类的实例。静态方法只能访问静态成员变量和静态方法，不能访问非静态成员变量和非静态方法。
3.  修饰变量：当一个变量被声明为`static`时，它被称为**静态变量或类变量**。静态变量属于类，而**不属于类的任何实例**。静态变量可以通过类名直接访问，也可以通过实例名访问。**静态变量只有一份，被所有实例共享**。

使用`static`关键字可以提高程序的性能和效率，但也需要注意静态成员的使用方式和作用域。



## static 修饰成员变量

成员变量根据有无static修饰分为：

-   类变量、静态变量：**有 static 修饰**
    
    -   属于类（属于类本身），在计算机中只有一份，被所有的类的全部对象所共享
    -   直接通过类名访问即可
    -   类变量的调用方式
    
    ```java
    对象.类变量
    类名.类变量  // 推荐的调用方式
    ```
    
-   实例变量：无 static 修饰
    
    -   属于每一个对象，即每一个对象都有自己独立的一份

例如：

```java
public class A {
    private static String name;  // 类变量(属于类)
    private int age;  // 实例变量(属于对象)

    public static void main(String[] args) {
        A.name = "张三"; // 对象.类变量   类变量的调用
        new A().name = "李四";  // 类名.类变量(不推荐的调用方式)

        // A.age = 18;  // 非法，实例变量需要通过对象访问  Non-static field 'age' cannot be referenced from a static context
        new A().age = 18;  // (通过对象访问实例变量)实例变量的调用
        
        //static String hello = "hello";  // 非法，局部变量不能使用static修饰 Modifier 'static' not allowed here
    }
}
```

### 特点

-   类变量（静态变量）

    调用方式：推荐使用   **类名.类变量**

    **==属于类，与类一起加载一次（加载到方法区），在内存中只有一份，会被类的所有对象共享。==**

    **访问自己类中的类变量时，可以省略 类名 不写**，但是如果其他类访问必须加 类名

    类变量似乎破坏了封装性，其实不然，当对象调用实例方法时，该方法中的类变量也是该对象的变量，只不过是和所有的其他对象共享而已。

    在同一个类中，静态成员变量的访问可以省略类名

-   实例变量（对象变量）

    调用方式：必须使用  对象名.实例变量

    属于对象，每个对象中都有一份

### static 修饰成员变量的应用场景

-   在开发中，如果每个数据只需要一份，且希望能够被共享（访问、修改），则该数据可以定义为类变量

例如：

```java
// 记录某个类被创建了几个对象
public class A {
    public static void main(String[] args) {
        User u1 = new User();
        User u2 = new User();
        User u3 = new User();

        System.out.println(User.class.getSimpleName() + "类被创建了 " + User.count + " 次");
    }
}

class User {
    // 类变量
    public static int count;

    public User() {
        // User.count++;
        // 可以省略  User.  但是必须在同一个类中，才可以省略 User.
        count++;
    }
}
```

结果

```
User类被创建了 3 次
```

## static 修饰成员方法

成员方法根据有无static修饰分为：

-   **类方法（静态方法）：有static 修饰**

    -   属于类

    -   调用方式

        ```java
        类名.类方法  //（推荐）
        对象名.类方法  // （不推荐）	
        ```

-   实例方法（对象方法）：无static 修饰

    -   属于对象

    -   调用方式

        ```java
        对象.实例方法
        ```

例如：

```java
public class A {
    private static String name;
    private int age = 18;

    public void test1() {  // 实例方法可以访问 类变量、类方法、实例变量、实例方法
        name = "张三";
        age = 19;
        test2();
    }

    public static void test2() {
        name = "李四";  // 类方法访问 类变量
        test3();  // 类方法访问 类方法
        // age = 19;  // 非法，类方法不能直接访问实例成员
        // test1();
        A a = new A();
        a.age = 19;  // 类方法通过创建对象的方式访问实例成员
        a.test1();
    }

    public static void test3(){
    }

    public static void main(String[] args) {

    }
}
```

### 特点

-   静态成员方法只能访问静态成员（静态成员变量、静态成员方法），当然也可以通过创建对象的方式访问实例成员
-   类方法在类的字节码加载到内存的视乎就分配了入口地址，因此Java可以通过 类名.类方法名 调用，并且也推荐这种方式

### main方法

例如：

```java
public class Test {
    public static void main(String[] args) {
    
    }
}
```

说明：

-   main() 方法其实也是类方法
-   main()方法能运行是因为，当我们执行 java Test 时，**JVM会使用 Test.main() 执行main方法**
-   main(String[] args) 方法中 String[] args 表示的是我们执行main方法时可以传入参数给main方法
-   我们可以通过 **java Test [参数列表]** 的方式给main方法传参

### static 修饰成员方法的应用场景

-   **类方法最常见的应用场景是做工具类**。比如 java.lang包中的Math方法便是JDK为我们提供的工具类

使用工具类的**好处**：

-   提高了代码的复用性
-   方便调用，提高开发效率

例如：

下面是一个生成验证码的工具类

```java
public class MyUtil {
    // 工具类建议私有构造器
    private MyUtil() {
    }

    /**
     * 生成 n 位验证码的方法
     * @param n
     * @return
     */
    public static String createCode(int n) {
        StringBuilder code = new StringBuilder();
        String data = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

        Random random = new Random();
        for (int i = 0; i < n; i++) {
            int index = random.nextInt(data.length());
            code.append(data.charAt(index));
        }
        return code.toString();
    }
}
```

测试

```java
public class Test {
    public static void main(String[] args) {
        System.out.println(MyUtil.createCode(4));
    }
}
```

结果

```
p4FA
```

为什么工具类建议使用类方法，而不是实例方法？

因为实例方法需要创建对象来调用，会浪费内存

工具类的建议？

工具类不需要创建对象即可直接通过 类名.类方法名 调用，因此**推荐工具类的构造器进行私有化**

### 使用类方法、实例方法的注意事项

-   类方法可以直接访问类的成员，不可以直接访问实例成员。
-   实例方法既可以直接访问类成员，也可以直接访问实例成员
-   实例方法中可以出现的 this 关键字，类方法中不能出现 this关键字

```java
public class Student {
    static String schoolName;  // 类变量
    double score;  // 实例成员

    // 1.类方法可以直接访问类的成员，不可以直接访问实例成员。
    public static void printHelloWorld() {
        schoolName = "理想";  // 在同一个类中，访问类成员，可以省略类名不写
        printHelloWorld2();

        // score = 100;  // 非法，类方法不可以直接访问实例成员。
        // printPass();

        // System.out.println(this);  // 类方法中不能出现 this关键字
    }

    // 类方法
    public static void printHelloWorld2() {

    }

    // 实例方法
    // 2.实例方法既可以直接访问类成员，也可以直接访问实例成员
    // 3.实例方法中可以出现的 this 关键字，类方法中不能出现 this关键字
    public void printPass() {
        schoolName = "水茜";  // 实例方法访问 类变量
        printHelloWorld2();  // 实例方法访问 类方法
        score = 100;  // 实例方法访问 实例变量
        this.printPass2();  // 实例方法访问 实例方法
        // this 可省略
        printPass2();
    }

    // 实例方法
    public void printPass2() {
    }
}
```



## static 代码块

代码块是类的五大成分之一（成员变量、成员方法、代码块、构造器、内部类）

### 代码块的分类

代码块分为两种：

-   静态代码块

格式 	static {}

特点：类加载时自动执行，由于类之后加载一次，所以**静态代码块也只会执行一次。**

作用：完成类的初始化。例如，对类变量的初始化赋值。在Socker类中就是这么做的

-   实例代码块

格式  {}

特点：**每次**创建对象时，执行实例代码块，并且**在构造器前执行**

作用：和构造器一样，都是用来完成对象的初始化的。例如：对实例变量进行初始化赋值。（不推荐这种方式为赋值方式）

实例代码块的一种应用是：将多个构造器中重复的一些代码放在实例代码块中，减少代码冗余

### 静态代码块

例如：

```java
public class Student {
   static int num = 80;
   static String schoolName;

   // 静态代码块：在类加载时自动执行一次
    static {
       System.out.println("静态代码块执行~~~");
       schoolName = "理想";  // 在静态代码块中为类变量赋值
   }
}
```

测试

```java
public class Test {
    public static void main(String[] args) {
        // 我们调用了两次Student类，但是静态代码块中的代码只会执行一次
        System.out.println(Student.num);
        System.out.println(Student.schoolName);
    }
}
```

结果

```
静态代码块执行~~~
80
理想
```

### 实例代码块（开发中比较少）

例如：

```java
public class Student {
    int age;
   // 实例代码块
    {
        System.out.println("实例代码块执行~~~~");
        age = 18;  // 为实例变量赋值，开发中不推荐这种做法
    }

    public Student() {
        System.out.println("无参构造器执行~~~~");
    }

    public Student(String name) {
        System.out.println("有参构造器执行~~~~");
    }
}
```

测试

```java
public class Test {
    public static void main(String[] args) {
        // 我们每次创建对象时，都会执行实例代码块
        Student s1 = new Student();
        Student s2 = new Student("张三");
        System.out.println(s1.age);
        System.out.println(s2.age);
    }
}
```

结果

```
实例代码块执行~~~~
无参构造器执行~~~~
实例代码块执行~~~~
有参构造器执行~~~~
18
18
```

## static 修饰内部类

​	当一个类被声明为`static`时，它被称为**静态内部类**。静态内部类可以访问外部类的静态成员，但不能访问外部类的非静态成员（可以通过创建对象的方式访问）。

**有 static 修饰的内部类，它属于外部类持有。**

静态内部类与普通的类没有什么区别，只是它所处的位置比较特殊（定义在外部类的静态成员位置）。它属于外部类持有。

**普通的外部类拥有的成分，静态内部类都可以拥有**

### **访问特点**

-   **静态内部类可以直接访问外部类的静态成员变量和方法。**
-   但是静态内部类不能直接访问外部类的实例成员，可以通过创建对象的方式访问

基本格式：

```java
public class Outer {
    // 静态内部类
    public static class Inner {

    }
}
```

创建静态内部类对象基本格式：

```java
// 外部类名.内部类名 对象名 = new 外部类.内部类(...)
Outer.Inner inner = new Outer.Inner();
```

例如：

```java
public class Outer {
    private static int age;  // 静态成员
    public static void hello() {
    }
    public String schoolName;  // 实例成员


    // 静态内部类：普通类有的静态内部类都可以拥有
    public static class Inner {
        private String name;
        public static int a;

        public void test() {
            System.out.println(age);  // 静态内部类，访问外部类的静态成员变量
            hello();  // 静态内部类，访问外部类的静态成员方法
            // System.out.println(schoolName);  // 静态内部类，访问外部类的实例成员，报错
            System.out.println(new Outer().schoolName);  // 但是可以通过创建对象的方式访问外部类实例成员
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
```

测试

```java
public class Test {
    public static void main(String[] args) {
        Outer.Inner inner = new Outer.Inner();
        // 调用静态内部类中的方法
        inner.setName("xiaoming");
        inner.test();
    }
}
```



## 扩展

-   实例成员可以访问实例成员，也可以访问静态成员
    -   实例方法可以既能对类变量操作，也能对实例变量操作。
    -   一个类中方法可以互相调用，实例方法可以调用该类中的其他方法（实例、静态方法皆可）

-   静态成员不可以直接访问实例成员
    -   类变量只能对类变量进行操作。
    -   类中的静态方法只能调用该类的静态方法，不能调用实例方法。





## staic 应用 ——单例模式

### 饿汉式（静态常量）

步骤如下：

1.  构造器私有化
2.  在类的内部创建对象实例
3.  向外部暴露一个静态公有方法（getInstance）

```java
public class Singleton {
    // 1.构造器私有化
    private Singleton(){

    }
    // 2.本类内部创建对象实例
    private final static Singleton instance = new Singleton();

    // 3.提供一个静态方法，返回实例对象
    public static Singleton getInstance() {
        return instance;
    }
}

```

优缺点说明：

优点：

​	这种写法简单，易于实现，就是在类装载的时候就完成了实例化。**避免了线程同步问题**

缺点：

​	在类装载的时候就完成了实例化，没有达到Lazy Loading的效果。如果从始至终都没有使用这个实例，则会造成了内存的浪费

结论：

​	这种单例模式是可用的，但是**可能会造成内存浪费**

### 饿汉式（静态代码块）

优缺点说明：

​	这种方式和上面一种其实类似，只不过将类实例化的过程放在了静态代码块中，也是在类加载的时候，就执行了静态代码块中的代码，初始化类的实例。优缺点与上一种方式一致。

结论：

​	这种单例模式也是可用的，但是可能会造成内存浪费

```java
public class Singleton {
    // 1.构造器私有化，外部不能new
    private Singleton(){
    }
    // 2.本类内部创建对象实例
    private static Singleton instance;

    static {  // 在静态代码块中，创建单例对象
        instance = new Singleton();
    }

    // 3.提供一个静态方法，返回对象实例
    public static Singleton getInstance(){
        return instance;
    }
}

```



### 懒汉式（线程不安全）

优缺点说明：

-   起到了Lazy Loading的效果，但是只能在单线程下使用
-   如果在多线程情况下，一个线程进入 if(instance == null) 判断语句块，还为来得及往下执行，另一个线程也通过了这个判断语句，他同样回去创建一个实例，这时就产生了多个实例。所以**在多线程环境下，不可使用这种方式**

结论：

​	在实际开发中，不要使用这种方式

```java
public class Singleton {
    // 构造器私有化
    private Singleton() {

    }

    private static Singleton instance = null;

    // 提供静态公有方法，当使用该方法时，才去创建instance
    // 懒汉式
    public static Singleton getInstance() {
        if(instance == null){
            instance = new Singleton();
        }
        return instance;
    }
}

```

测试

```java
public class Test {
    static Singleton instance;
    static Singleton instance2;

    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread() {
            @Override
            public void run() {

                instance = Singleton.getInstance();

            }
        };
        Thread t2 = new Thread(() -> { instance2 = Singleton.getInstance(); });

        t1.start();
        t2.start();
        t1.join();  // 等待终止指定的线程
        t2.join();
        
        // 因为t1、t2线程调用了join方法，直到t1、t2线程执行完才执行主线程（如下代码）
        System.out.println(instance);
        System.out.println(instance2);
        System.out.println(instance == instance2);
    }
}

```

测试结果如下

```
com.clear._01_单例._03懒汉式线程不安全.Singleton@6d311334
com.clear._01_单例._03懒汉式线程不安全.Singleton@682a0b20
false
```



### 懒汉式（线程安全，同步方法）

优缺点说明：

-   解决了线程不安全的问题
-   **但是效率太低了，每个线程在想获得类实例的时候，执行getInstance()方法都要进行同步**。而其实这个方法只需要执行一次实例化代码就可以了，后面想要获得类实例，直接return就可以了。方法进行同步效率太低。

结论：

​	在实例开发中，不推荐使用这种方式

```java
// 懒汉式（线程安全，同步方法）
public class Singleton {
    // 构造器私有化
    private Singleton(){
        
    }
    private static Singleton instance;

    // 提供一个静态的公有方法，加入同步处理的代码，解决线程安全问题
    public static synchronized Singleton getInstance() {
        if(instance == null){
            instance = new Singleton();
        }
        return instance;
    }
}

```

此外，单例模式的实现还有如下方式：

-   懒汉式（线程安全，同步代码块）
-   双重检查
-   静态内部类
-   枚举