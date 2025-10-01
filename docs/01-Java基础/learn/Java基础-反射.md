# 反射(Reflection)的概念

## 反射的出现背景

​	Java程序中，所有的对象都有两种类型：**编译时类型**和**运行时类型**，而很多时候对象的编译时类型和运行时类型**不一致**。 

​	Object obj = new String("hello"); 

​	obj.getClass()

例如：某些变量或形参的**声明类型是Object类型，但是程序却需要调用该对象运行时类型的方法**，该方法不是Object中的方法，那么如何解决呢？

**解决**这个问题，有两种方案：

​	方案1：在编译和运行时都完全知道类型的具体信息，在这种情况下，我们可以直接先使用**instanceof**运算符进行判断，再利用强制类型转换符将其转换成运行时类型的变量即可。（即**向下转型**）

​	方案2：编译时根本无法预知该对象和类的真实信息，程序只能依靠**运行时信息**来发现该对象和类的真实信息，这就**必须使用反射**。

## 反射概述

​	Reflection（反射）是被视为**动态语言**的关键，反射机制允许程序在**运行期间借助于Reflection API取得任何类的内部信息**，并能直接操作任意对象的内部属性及方法。

​	加载完类之后，在堆内存的方法区中就产生了一个Class类型的对象（一个类只有一个Class对象），这个对象就包含了完整的类的结构信息。我们可以通过这个对象看到类的结构。这个对象就像一面镜子，透过这个镜子看到类的结构，所以，我们形象的称之为：反射。

下面编写一段代码先来简单了解一下反射

```java
public class Person {
    private String name;
    public int age;

    // 构造器
    public Person() {
        System.out.println("Person()~~~~~~");
    }

    public Person(int age) {
        this.age = age;
    }

    // 私有构造器
    private Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 方法
    public void show() {
        System.out.println("是一个Person~~~~");
    }

    // 私有方法
    private String showNation(String nation) {
        return "我的国籍是" + nation;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

```java
public class ReflectionTest {

    /**
     * 使用反射之前可以执行的操作
     */
    @Test
    public void test1() {
        // 1.创建Person类的实例
        // public Person()
        Person person1 = new Person();
        System.out.println(person1);

        // 2.调用属性
        // public int age;
        person1.age = 10;
        System.out.println(person1.age);

        // 3.调用方法
        // public void show()
        person1.show();
    }

    /**
     * 使用反射完成上述操作
     */
    @Test
    public void test2() throws IllegalAccessException, InstantiationException, NoSuchFieldException, NoSuchMethodException, InvocationTargetException {
        // 1.创建Person类的实例
        // public Person()
        Class<Person> aClass = Person.class;
        Person person2 = aClass.newInstance();
        System.out.println(person2);

        // 2.调用属性
        // public int age;
        Field ageField = aClass.getField("age");
        ageField.set(person2, 10);
        System.out.println(ageField.get(person2));

        // 3.调用方法
        // public void show()
        Method showMethod = aClass.getMethod("show");
        showMethod.invoke(person2);
    }

    /**
     * 出了Person类之后，就不能调用Person类中private权限修饰的成员（属性、方法）了，
     * 但是，我们可以通过反射的方式，调用Person类中私有的成员
     */
    @Test
    public void test3() throws IllegalAccessException, InstantiationException, NoSuchFieldException, NoSuchMethodException, InvocationTargetException {
        // 1.调用私有构造器，创建Person类的实例
        //  private Person(String name, int age)
        Class<Person> aClass = Person.class;
        Constructor cons = aClass.getDeclaredConstructor(String.class, int.class);
        // 需要允许访问，否则报错如下
        // IllegalAccessException: Class com.clear.reflection.ReflectionTest can not access a member of class com.clear.reflection.Person with modifiers "private"
        cons.setAccessible(true);  // 设置访问权限
        Person person3 = (Person) cons.newInstance("jack", 12);
        System.out.println(person3);

        // 2.调用私有属性
        // private String name;
        Field nameField = aClass.getDeclaredField("name");
        nameField.setAccessible(true);
        nameField.set(person3, "jerry");
        System.out.println(nameField.get(person3));

        // 3.调用私有方法
        // private String showNation(String nation)
        Method showNationMethod = aClass.getDeclaredMethod("showNation", String.class);
        showNationMethod.setAccessible(true);
        String info = (String)showNationMethod.invoke(person3, "CHINA");
        System.out.println(info);
    }
}
```

##  Java反射机制研究及应用

Java反射机制提供的功能：

-   在运行时判断任意一个对象所属的类
-   在运行时构造任意一个类的对象
-   在运行时判断任意一个类所具有的成员变量和方法

-   在运行时获取泛型信息
-   在运行时调用任意一个对象的成员变量和方法
-   在运行时处理注解
-   生成动态代理

## 反射相关的主要API

**java.lang.Class**：代表一个类

java.lang.reflect.Method：代表类的方法 

java.lang.reflect.Field：代表类的成员变量

java.lang.reflect.Constructor：代表类的构造器 

....

## 反射的优缺点

**优点：**

-   提高了Java程序的灵活性和扩展性，**降低了耦合性**，提高**自适应**能力
-   允许程序创建和控制任何类的对象，无需提前**硬编码**目标类

**缺点：**

-   反射的**性能较低**。
    -   反射机制主要应用在对灵活性和扩展性要求很高的系统框架上
-   反射会**模糊程序内部逻辑，可读性较差**。

反射在平时的开发中，使用并不多。主要是在框架的底层使用。



简单来说，反射就是Java给我们提供的一套API，可以使用这套API我们可以在运行时动态的获取指定对象所属的类，创建运行时类的对象，调用指定结构（属性、方法）等

# 反射的源头 Class	

要想解剖一个类，必须先要获取到该类的 Class 对象。而剖析一个类或用反射解决具体的问题就是使用相关 API: 

-   java.lang.Class 

-   java.lang.reflect.* 


 所以，Class 对象是反射的根源。 

​	在 Java 中，`Class` 类是一个特殊的类，用于表示其他类的元数据。它提供了一种在运行时获取和操作类的方法和属性的机制。**每个类在Java虚拟机中都有一个对应的Class对象**，可以通过该对象获取类的信息。

## 理解Class类

以Java类的加载为说明：

​	针对编写好的 .java 源文件，使用 javac.exe 进行编译，生成一个或多个 .class 字节码文件。接着，使用 java.exe 命令对指定的 .class 文件进行解释执行。在这个过程中，我们需要将  .class 字节码文件加载（使用类加载器）到内存中（存放到方法区）。**加载到内存中的  .class 文件对应的结构即为 Class的一个实例。**

**理论上**  

在 Object 类中定义了以下的方法，此方法将被所有子类继承： 

```java
public final native Class<?> getClass()
```

以上的方法返回值的类型是一个 **Class 类，此类是 Java 反射的源头**，实际上所谓反射从程序的运行结果来看也很好理解，即：**可以通过对象反射求出类的名称**。

例如，对象照镜子后可以得到的信息：某个类的属性、方法和构造器、某个类到底实现了哪些接口。

**对于每个类而言，JRE 都为其保留一个不变的 Class 类型的对象**。一个 Class 对象包含了特定某个结构 (class/interface/enum/annotation/primitive type/void/[])的有关信息。 

-   Class 本身也是一个类 
-   Class 对象只能由系统建立对象 
-   **一个加载的类在 JVM 中只会有一个 Class 实例** 
-   一个 Class 对象对应的是一个加载到 JVM 中的一个.class 文件 
-   每个类的实例都会记得自己是由哪个 Class 实例所生成 
-   通过 Class 可以完整地得到一个类中的所有被加载的结构  
-   Class 类是 Reflection 的根源，针对任何你想动态加载、运行的类，唯有先获得相应的Class 对象

## 获取Class类的实例的四种方式

方式 1：

​	**要求编译期间已知类型前提**：若已知具体的类，**通过类的 class 属性（静态属性）获取**，**该方法最为安全可靠，程序性能最高** 

例如： 

```java
Class clazz = String.class; 	// 类调用静态属性
```

方式 2：

​	**获取对象的运行时类型** 

**前提：已知某个类的实例**，调用该实例的 getClass()方法获取 Class 对象 

```java
public final native Class<?> getClass()	
```

例如：

```java
Class clazz = "hello".getClass(); // 对象.getClass()，因为在方法定义在Object在，任意内都可以使方法
```

 方式 3：

​	**可以获取编译期间未知的类型** 

**前提：已知一个类的全类名**，且该类在类路径下，可通过 Class 类的静态方法forName()获取，可能抛出 `ClassNotFoundException`

```java
public static Class<?> forName(String className)
		throws ClassNotFoundException
```

例如：

```java
Class clazz = Class.forName("java.lang.String"); // Class的静态方法，forName(String className) 推荐使用
```

方式 4：

​	**使用类的加载器方式**（其实我们知道了类的全限名，完成可以使用第三种方式）

前提：可以**用系统类加载对象或自定义加载器对象加载指定路径下的类型** 

例如：

```java
ClassLoader cl = this.getClass().getClassLoader(); 
Class clazz4 = cl.loadClass("类的全类名")
```

如下是一个读取properties 配置文件的方法示例：

```java
public static Properties loadConfig(String fileName) {
    Properties properties = new Properties();
    try {
        // 使用类加载器加载配置文件
        InputStream inputStream = ConfigLoader.class.getClassLoader().getResourceAsStream(fileName);
        properties.load(inputStream);
    } catch (IOException e) {
        e.printStackTrace();
    }
    return properties;
}
```

演示如下：	

```java
package com.clear.reflection.class1;

import org.junit.Test;

// 演示获取Class类实例的四种方式
public class ClassDemo {
    @Test
    public void test1() throws ClassNotFoundException {
        // todo 1 调用运行时类的静态属性
        Class<User> clazz1 = User.class;

        // todo 2 调用运行时类的对象的getClass()方法
        User user = new User();
        Class<? extends User> clazz2 = user.getClass();


        // todo 3 调用Class类的静态方法orName(String className)
        Class<?> clazz3 = Class.forName("com.clear.reflection.class1.User");

        // todo 4 使用类的加载器方式
        Class<?> clazz4 = ClassLoader.getSystemClassLoader().loadClass("com.clear.reflection.class1.User");


        System.out.println(clazz1 == clazz2);  // true
        System.out.println(clazz2 == clazz3);  // true
        System.out.println(clazz1 == clazz4);  // true
        // 验证了：一个加载的类在 JVM 中只会有一个 Class 实例
    }
}
```

## **哪些类型可以有 Class 对象**

Class的实例都可以指向哪些结构呢？

简言之，所有 Java 类型！ 

（1）class：外部类，成员(成员内部类，静态内部类)，局部内部类，匿名内部类

（2）interface：接口 

（3）[]：数组 

（4）enum：枚举 

（5）annotation： 注解@interface

（6）primitive type：基本数据类型

（7）void

例如：

```java
@Test
public void test2() {
    Class c1 = Object.class;
    Class c2 = Comparable.class;
    Class c3 = String[].class;
    Class c4 = int[][].class;
    Class c5 = ElementType.class;
    Class c6 = Override.class;
    Class c7 = int.class;
    Class c8 = void.class;
    Class c9 = Class.class;
    int[] a = new int[10];
    int[] b = new int[100];
    Class c10 = a.getClass();
    Class c11 = b.getClass();
    // 只要元素类型与维度一样，就是同一个 Class
    System.out.println(c10 == c11);  // true
}
```



## Class类 常用方法

```java
public String getName()  // 获取类的完全限定名
```

```java
public String getSimpleName()  // 获取类的简单名称
```

```java
public Package getPackage()  // 获取类所在的包
```

```java
public native Class<? super T> getSuperclass()  // 获取类的父类
```

```java
public Class<?>[] getInterfaces()  // 获取类实现的接口
```

```java
// 获取类的某个成员变量，只能获取public修饰的
public Field getField(String name)
        throws NoSuchFieldException, SecurityException 
// 获取类的所有成员变量，只能获取public修饰的
public Field[] getFields() throws SecurityException 


// 获取类的某个成员变量
public Field getDeclaredField(String name)
        throws NoSuchFieldException, SecurityException  

 // 获取类声明的所有字段
public Field[] getDeclaredFields() throws SecurityException
```

```java
// 获取类的某个构造器：只能拿public修饰的某个构造器对象
public Constructor<T> getConstructor(Class<?>... parameterTypes)
        throws NoSuchMethodException, SecurityException
        
// 获取类的所有构造方法，只能获取public修饰的构造器     
public Constructor<?>[] getConstructors() throws SecurityException

// 获取某个构造器：只要你敢写，就能拿到，无所谓权限是否可及
public Constructor<T> getDeclaredConstructor(Class<?>... parameterTypes)
        throws NoSuchMethodException, SecurityException

	// 如果遇到了私有构造器，可以通过如下方法传入 true 暴力反射(反射会破坏封装性)
     public void setAccessible(boolean flag) throws SecurityException 
     // 权限被打开，可以使用构造器了
     

//获取全部的构造器：只要你敢写，无所谓权限是否可及
public Constructor<?>[] getDeclaredConstructors() throws SecurityException
```

```java
// 获取类中的某个成员方法，只能获取public修饰的
public Method getMethod(String name, Class<?>... parameterTypes)
        throws NoSuchMethodException, SecurityException
        
// 获取类中的所有成员方法，只能获取public修饰的        
public Method[] getMethods() throws SecurityException        


// 获取类中某个成员方法
public Method getDeclaredMethod(String name, Class<?>... parameterTypes)
        throws NoSuchMethodException, SecurityException

// 获取类声明的所有方法
public Method[] getDeclaredMethods() throws SecurityException
```

```java
// 创建类的实例
public T newInstance()
        throws InstantiationException, IllegalAccessException
// 注意：
//	要想对象创建成功，需满足以下条件
//		要求运行时类中必须提供空参构造器
//		要求提供的空参构造器的权限要足够，否则报错 IllegalAccessException

// 从JDK9开始，此方法被标记为 @Deprecated(since="9") 已过时    

// JDK9之后，我们会使用 Constructor 类的 newInstance方法 创建类的实例
```

例如：

```java
package com.clear.reflection.class1;

import java.util.Arrays;

public class MyClass {
    private String name;
    private int age;
    public int id;

    private MyClass() {
    }

    public MyClass(String name, int age) {
        this.name = name;
        this.age = age;
    }

    void test1() {

    }
    private void test2() {

    }
    protected void test3() {

    }

    public void test4() {

    }
    public static void main(String[] args) {
        try {
            // Class类中的一个静态方法：forName(全限名)
            Class<?> aClass = Class.forName("com.clear.reflection.class1.MyClass");
            // todo 获取全限定名的方式
            // 1 直接写 com.clear.reflection.class1.MyClass
            // 2 类名.class
            Class<MyClass> mcls = MyClass.class;
            System.out.println(mcls);  // class com.clear.reflection.class1.MyClass
            // 3 对象.getClass() 获取对象对应的类的class对象
            MyClass myClas = new MyClass();
            Class<? extends MyClass> mcls2 = myClas.getClass();
            System.out.println(mcls2);   // class com.clear.reflection.class1.MyClass

            // todo 获取类名
            // 获取类的全限定名
            System.out.println(aClass.getName());  // com.clear.reflection.class1.MyClass
            // 获取类的简单名称
            System.out.println(aClass.getSimpleName());  // MyClass
            
            // todo 获取类所在的包名
            System.out.println(aClass.getPackage());  
            // package com.clear.reflection.class1
            
            // todo 获取类的父类
            System.out.println(aClass.getSuperclass());  // class java.lang.Object
            // todo 获取类所实现的接口
            System.out.println(Arrays.toString(aClass.getInterfaces()));  // []
            // todo 获取类的字段
            // 获取类的某个字段，只能获取 public修饰
            //System.out.println(aClass.getField("name")); //报错NoSuchFieldException:name
            System.out.println(aClass.getField("id")); 
            // public int com.clear.reflection.class1.MyClass.id
            // 获取类的所有字段，只能获取public修饰
            System.out.println(Arrays.toString(aClass.getFields()));  
            // [public int com.clear.reflection.class1.MyClass.id]
            
            // 获取类的某个字段，可以是private修饰
            System.out.println(aClass.getDeclaredField("name"));  
            // private java.lang.String com.clear.reflection.class1.MyClass.name
            // 获取类的所有字段，可以是private修饰
            System.out.println(Arrays.toString(aClass.getDeclaredFields()));  
            // [private java.lang.String com.clear.reflection.class1.MyClass.name, private int com.clear.reflection.class1.MyClass.age, public int com.clear.reflection.class1.MyClass.id]

            // todo 获取类的构造器
            // 获取类的某个构造器，只能获取 public修饰
            //System.out.println(aClass.getConstructor());  
            // 获取private修饰的无参构造器 报错 NoSuchMethodException
            
            System.out.println(aClass.getConstructor(String.class, int.class));  
            // public com.clear.reflection.class1.MyClass(java.lang.String,int)
            // 获取类的全部构造器，只能获取 public修饰
            System.out.println(Arrays.toString(aClass.getConstructors()));  
            // [public com.clear.reflection.class1.MyClass(java.lang.String,int)]
            
            // 获取类的某个构造器，可以是private修饰
            System.out.println(aClass.getDeclaredConstructor());  
            // 获取private修饰的无参构造器  private com.clear.reflection.class1.MyClass()
            // 获取类的某个构造器，可以是private修饰
            System.out.println(Arrays.toString(aClass.getDeclaredConstructors()));  
            // [private com.clear.reflection.class1.MyClass(), public com.clear.reflection.class1.MyClass(java.lang.String,int)]

            // todo 获取类的方法
            // 获取类的某个方法，只能获取 public修饰
            //System.out.println(aClass.getMethod("test1"));  // 获取无修饰符的方法 报错 NoSuchMethodException
            //System.out.println(aClass.getMethod("test2"));  // 获取private修饰的方法 报错 NoSuchMethodException
            // System.out.println(aClass.getMethod("test3"));  // 获取protected修饰的方法 报错 NoSuchMethodException
            System.out.println(aClass.getMethod("test4"));  // 获取public修饰的方法  public void com.clear.reflection.class1.MyClass.test4()
            // 获取类的所有方法
            System.out.println(Arrays.toString(aClass.getMethods()));  //

            // 获取类的某个方法，只要你敢写，无所谓权限是否可及
            System.out.println(aClass.getDeclaredMethod("test1"));  
            // void com.clear.reflection.class1.MyClass.test1()
            System.out.println(aClass.getDeclaredMethod("test2"));  
            // private void com.clear.reflection.class1.MyClass.test2()
            System.out.println(aClass.getDeclaredMethod("test3")); 
            // protected void com.clear.reflection.class1.MyClass.test3()
            System.out.println(aClass.getDeclaredMethod("test4"));  
            // public void com.clear.reflection.class1.MyClass.test4()
            // 获取类的所有方法，只要你敢写，无所谓权限是否可及
            System.out.println(Arrays.toString(aClass.getDeclaredMethods()));  

            // todo 获取类的实例
            Object myClass = aClass.newInstance();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```



# **类的加载与 ClassLoader 的理解**  

## 类的生命周期 

类在内存中完整的生命周期：加载-->使用-->卸载。其中加载过程又分为：装载、链接、初始化三个阶段。 

## 类的加载过程

​	当程序主动使用某个类时，如果该类还未被加载到内存中，系统会通过加载、链接、初始化三个步骤来对该类进行初始化。如果没有意外，JVM 将会连续完成这三个步骤，所以有时也把这三个步骤统称为类加载

类的加载又分为三个阶段： 

-   **装载（Loading）** 

将类的 class 文件读入内存，并为之创建一个 java.lang.Class 对象。此过程**由类加载器完成** 

-   **链接（Linking）** 

1）验证 Verify：确保加载的类信息符合 JVM 规范，例如：以 cafebabe 开头，没有安全方面的问题。 

2）准备 Prepare：正式为类变量（static）分配内存并*设置类变量默认初始值*的阶段，这些内存都将在方法区中进行分配。 

3）解析 Resolve：虚拟机常量池内的符号引用（常量名）替换为直接引用（地址）的过程。

-   **初始化（Initialization）** 

执行类构造器 <clinit>()方法的过程。

类构造器<clinit>()方法是由编译期自动收集类中所有类变量的赋值动作和静态代码块中的语句合并产生的（类构造器是构造类信息的，不是构造该类对象的构造器）。 

当初始化一个类的时候，如果发现其父类还没有进行初始化，则需要先触发其父类的初始化。 

虚拟机会保证一个类的 <clinit>()方法在多线程环境中被正确加锁和同步。 

## 类加载器（classloader）

### 类加载器的作用

将 class 文件字节码内容加载到内存中，并将这些静态数据转换成方法区的运行时数据结构，然后在堆中生成一个代表这个类的 java.lang.Class 对象，作为方法区中类数据的访问入口。类缓存：标准的 JavaSE 类加载器可以按要求查找类，但一旦某个类被加载到类 

加载器中，它将维持加载（缓存）一段时间。不过 JVM 垃圾回收机制可以回收这些 Class 对象。 

###  类加载器的分类(JDK8 为例)

JVM 支持两种类型的类加载器，分别为：

-   引导类加载器、启动类加载器（**BootstrapClassLoader**） 
    -   使用C、C++ 编写，不能通过Java代码获取实例
    -   负责加载Java核心库
-   继承于ClassLoader的类加载器
    -   ExtensionClassLoader：扩展类加载器
    -   SystemClassLoader/ApplicationClassLoader：系统类加载器、应用程序类加载器
    -   自定义类加载器
        -   可以实现应用的隔离（同一个类在一个应用程序中可以加载多份）；数据加密 

从概念上来讲，自定义类加载器一般指的是程序中由开发人员自定义的一类类加载器，但是 Java 虚拟机规范却没有这么定义，而是**将所有派生于抽象类 ClassLoader 的类加载器都划分为自定义类加载器**。无论类加载器的类型如何划分，在程序中我们最常见的类加载器结构主要是如下情况：

**（1）启动类加载器（引导类加载器，Bootstrap ClassLoader）** 

-   这个类加载使用 C/C++语言实现的，嵌套在 JVM 内部。获取它的对象时往往返回 null （不能通过Java代码获取实例）
-   它用来加载 Java 的核心库（JAVA_HOME/jre/lib/rt.jar 或 sun.boot.class.path 路径下的内容）。用于提供 JVM 自身需要的类。 
-   并不继承自 java.lang.ClassLoader，没有父加载器。  
-   出于安全考虑，Bootstrap 启动类加载器只加载包名为 java、javax、sun 等开头的类  
-   加载扩展类和应用程序类加载器，并指定为他们的父类加载器。 

**（2）扩展类加载器（Extension ClassLoader）** 

-   Java 语言编写，由 sun.misc.Launcher$ExtClassLoader 实现。 
-   继承于 ClassLoader 类 
-   父类加载器为启动类加载器 
-   从 java.ext.dirs 系统属性所指定的目录中加载类库，或从 JDK 的安装目录的 jre/lib/ext子目录下加载类库。如果用户创建的 JAR 放在此目录下，也会自动由扩展类加载器加载。

**（3）应用程序类加载器（系统类加载器，AppClassLoader）** 

-   java 语言编写，由 sun.misc.Launcher$AppClassLoader 实现 
-   继承于 ClassLoader 类  
-   父类加载器为扩展类加载器 
-   它负责加载环境变量 classpath 或系统属性 java.class.path 指定路径下的类库 
-   应用程序中的类加载器默认是系统类加载器。 
-   它是用户自定义类加载器的默认父加载器 
-   通过 ClassLoader 的 getSystemClassLoader()方法可以获取到该类加载器 

**（4）用户自定义类加载器（了解）** 

-   在 Java 的日常应用程序开发中，类的加载几乎是由上述 3 种类加载器相互配合执行的。在必要时，我们还可以自定义类加载器，来定制类的加载方式。 
-   体现 Java 语言强大生命力和巨大魅力的关键因素之一便是，Java 开发者可以自定义类加载器来实现类库的动态加载，加载源可以是本地的 JAR 包，也可以是网络上的远程资源。 
-   同时，自定义加载器能够实现**应用隔离**，例如 Tomcat，Spring 等中间件和组件框架都在内部实现了自定义的加载器，并通过自定义加载器隔离不同的组件模块。这种机制比 C/C++程序要好太多，想不修改 C/C++程序就能为其新增功能，几乎是不可能的，仅仅一个兼容性便能阻挡住所有美好的设想。 
-   自定义类加载器通常需要继承于 ClassLoader。



### 查看某个类的类加载器对象

（1）获取默认的系统类加载器 

```java
ClassLoader classloader = ClassLoader.getSystemClassLoader(); 
```

（2）查看某个类是哪个类加载器加载的 

```java
ClassLoader classloader = Class.forName("exer2.ClassloaderDemo").getClassLoader();

// 如果是根加载器加载的类，则会得到 null 
ClassLoader classloader1 = Class.forName("java.lang.Object").getClassLoader(); 
```

（3）获取某个类加载器的父加载器 

```java
ClassLoader parentClassloader = classloader.getParent(); 
```

例如：

```java
import org.junit.Test;

public class TestClassLoader {
    @Test
    public void test01() {
        ClassLoader systemClassLoader = ClassLoader.getSystemClassLoader();
        System.out.println("systemClassLoader = " + systemClassLoader);
        // systemClassLoader = sun.misc.Launcher$AppClassLoader@18b4aac2

    }

    @Test
    public void test02() throws Exception {
        ClassLoader c1 = String.class.getClassLoader();
        System.out.println("加载 String 类的类加载器：" + c1);  // 加载 String 类的类加载器：null
        ClassLoader c2 = Class.forName("sun.util.resources.cldr.zh.TimeZoneNames_zh").getClassLoader();
        System.out.println("加载 sun.util.resources.cldr.zh.TimeZoneNames_zh 类的类加载器：" + c2);
        // 加载 sun.util.resources.cldr.zh.TimeZoneNames_zh 类的类加载器：sun.misc.Launcher$ExtClassLoader@27716f4
        ClassLoader c3 = TestClassLoader.class.getClassLoader();
        System.out.println("加载当前类的类加载器：" + c3);
        // 加载当前类的类加载器：sun.misc.Launcher$AppClassLoader@18b4aac2

    }

    @Test

    public void test03() {
        ClassLoader c1 = TestClassLoader.class.getClassLoader();
        System.out.println("加载当前类的类加载器 c1=" + c1);
        ClassLoader c2 = c1.getParent();
        System.out.println("c1.parent = " + c2);
        ClassLoader c3 = c2.getParent();
        System.out.println("c2.parent = " + c3);
    }
}
```

### 使用 ClassLoader 获取流

关于类加载器的一个主要方法：getResourceAsStream(String str):获取类路径下的指定文件的输入流 

```java
InputStream in = null; 
in = this.getClass().getClassLoader().getResourceAsStream("exer2\\test.properties"); 
System.out.println(in); 
```

演示：

​	读取配置文件

```java
public class ClassLoaderTest {
    // 使用 IO流 读取Properties配置文件
    @Test
    public void test1() throws IOException {
        Properties prop = new Properties();
        // 通过IO流读取文件默认路径为：单元测试中是相对于当前module，main方法中是相对于当前工程
        FileInputStream fis = new FileInputStream("src/test.properties");
        prop.load(fis);

        String name = prop.getProperty("name");
        String age = prop.getProperty("age");
        System.out.println(name);  // "zhangsan"
        System.out.println(age);  // 18
    }

    // 通过 ClassLoader 加载指定的配置文件
    @Test
    public void test2() throws IOException{
        Properties prop = new Properties();
        // 通过类的加载器读取的文件的默认路径为：当前module下的src
        InputStream inputStream = ClassLoader.getSystemClassLoader().getResourceAsStream("test.properties");
        prop.load(inputStream);

        String name = prop.getProperty("name");
        String age = prop.getProperty("age");
        System.out.println(name);  // "zhangsan"
        System.out.println(age);  // 18

    }
}
```



# 反射的基本应用

有了 Class 对象，能做什么？ 

## 创建运行时类的对象

这是反射机制应用最多的地方。创建运行时类的对象有两种方式： 

**方式 1：直接调用 Class 对象的 newInstance()方法**（JDK9之前的通用做法）

​	要求： 

​	1）**类必须有一个无参数的构造器**。

​	2）**类的构造器的访问权限需要足够**（一般需要public）

步骤： 

1）获取该类型的 Class 对象

2）调用 Class 对象的 newInstance()方法创建对象 

演示使用方式一，直接调用 Class 对象的 newInstance()方法

```java
package com.clear.reflection.reflect.reflect_constructor;
public class Student {
    private String name;
    private  int age;

    public Student() {  // 公有无参构造器
    }

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
	// 省略了get、set toString方法
}
```

```java
@Test
public void test() throws IllegalAccessException, InstantiationException {
    Class<Student> c = Student.class;
    // 使用直接调用 Class 对象的 newInstance()方法进行实例化对象
    Student student = c.newInstance();
    System.out.println(student);  // Student{name='null', age=0}
}
// 注意：
//	要想对象创建成功，需满足以下条件
//		要求运行时类中必须提供空参构造器
//		要求提供的空参构造器的权限要足够，否则报错 IllegalAccessException
```

**方式 2：通过获取构造器对象来进行实例化** （JDK9及其之后的作用）

步骤：

1）通过 Class 类的 getDeclaredConstructor(Class … parameterTypes)取得本类的指定形参类型的构造器

2）向构造器的形参中传递一个对象数组进去，里面包含了构造器中所需的各个参数。 

3）**通过 Constructor 实例化对象**。 

如果构造器的权限修饰符修饰的范围不可见，也可以调用 **setAccessible(true)** 

演示使用方式二，通过获取构造器对象来进行实例化

```java
package com.clear.reflection.reflect.reflect_constructor;

public class Student {
    private String name;
    private  int age;

    private Student() {  // 私有无参构造器
    }

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
	// 省略了get、set toString方法
}
```

```java
public class TestStudent02 {
    // getDeclaredConstructor
    // 获取某个构造器：只要你敢写，就能拿到，无所谓权限是否可及
    @Test
    public void getDeclaredConstructor() throws Exception {
        // 获取类对象
        Class c = Student.class;
        // 定位单个构造器对象（按照参数定位无参数构造器）
        Constructor cons = c.getDeclaredConstructor();
        System.out.println(cons.getName() + "===>" + cons.getParameterCount());
        // todo 如果遇到了私有构造器，可以暴力反射(反射会破坏封装性)
        cons.setAccessible(true);  // 权限被打开，可以使用构造器了

        // todo 利用反射创建对象
        // 利用 Constructor 对象，来进行实例化
        Student s  = (Student) cons.newInstance();
        System.out.println(s);

        System.out.println("-----------------");
        // 定位某个有参构造器
        Constructor cons1 = c.getDeclaredConstructor(String.class, int.class);
        System.out.println(cons1.getName() + "===>" + cons1.getParameterCount());
        // 利用 Constructor 对象，来进行实例化
        Student s1 = (Student) cons1.newInstance("大傻瓜",100);
        System.out.println(s1);
    }
}
```

## 获取运行时类的完整结构

可以获取：包、修饰符、类型名、父类（包括泛型父类）、父接口（包括泛型父接口	）、成员（属性、构造器、方法）、注解（类上的、方法上的、属性上的）

###  相关 API

```java
public String getName()  // 获取类的完全限定名
```

```java
public String getSimpleName()  // 获取类的简单名称
```

```java
public Package getPackage()  // 获取类所在的包
```

```java
// 获取字段上指定类型的注解 
public <A extends Annotation> A getAnnotation(Class<A> annotationClass)

// 获取字段上声明的所有注解   
public Annotation[] getDeclaredAnnotations() 
```

```java
// 获取带泛型的父类
public Type getGenericSuperclass()
```

```java
public native Class<? super T> getSuperclass()  // 获取类的父类
// 返回表示此 Class 所表示的实体（类、接口、基本类型）的父类的 Class。
```

```java
public Class<?>[] getInterfaces()  // 获取类实现的接口
// 确定此对象所表示的类或实现的接口
```

```java
// 获取类的某个成员变量，只能获取public修饰的
public Field getField(String name)
        throws NoSuchFieldException, SecurityException 
// 获取类的所有成员变量，只能获取public修饰的
public Field[] getFields() throws SecurityException 


// 获取类的某个成员变量
public Field getDeclaredField(String name)
        throws NoSuchFieldException, SecurityException  

 // 获取类声明的所有字段
public Field[] getDeclaredFields() throws SecurityException
```

```java
// Field 类中 

// 获取字段的名称
public String getName()
    
// 获取字段的类型
public Class<?> getType()

// 获取字段的修饰符，返回一个整数值，可以使用Modifier类的方法解析修饰符	
public int getModifiers()
    
// 获取指定对象上该字段的值
public Object get(Object obj)
    	throws IllegalArgumentException, IllegalAccessException
// 设置指定对象上该字段的值
public void set(Object obj, Object value)
        throws IllegalArgumentException, IllegalAccessException

// 获取字段上指定类型的注解 
public <T extends Annotation> T getAnnotation(Class<T> annotationClass)

// 获取字段上声明的所有注解   
public Annotation[] getDeclaredAnnotations() 
```

```java
// 获取类的某个构造器：只能拿public修饰的某个构造器对象
public Constructor<T> getConstructor(Class<?>... parameterTypes)
        throws NoSuchMethodException, SecurityException
        
// 获取类的所有构造方法，只能获取public修饰的构造器     
public Constructor<?>[] getConstructors() throws SecurityException

// 获取某个构造器：只要你敢写，就能拿到，无所谓权限是否可及
public Constructor<T> getDeclaredConstructor(Class<?>... parameterTypes)
        throws NoSuchMethodException, SecurityException
        
	// AccessibleObject类中的方法	
	// 如果遇到了私有构造器，可以通过如下方法传入 true 暴力反射(反射会破坏封装性)
     public void setAccessible(boolean flag) throws SecurityException 
     // 权限被打开，可以使用构造器了
     

//获取类全部的构造器：只要你敢写，无所谓权限是否可及
public Constructor<?>[] getDeclaredConstructors() throws SecurityException
```

```java
// Constructor类中

// 获取构造方法的修饰符，返回一个整数值，可以使用Modifier类的方法解析修饰符
public int getModifiers()
	
// 用于获取构造方法的名称    
public String getName()
    
// 判断构造方法是否是可变参数方法
public boolean isVarArgs()

// 获取构造方法的参数类型数组，返回一个Class对象数组，表示构造方法的参数类型
public Class<?>[] getParameterTypes()
// @since 1.8
// 用于获取构造方法的参数个数。
public int getParameterCount()    
    
// 用于设置构造方法的可访问性。如果构造方法是私有的或受保护的，需要设置为可访问才能调用。
isAccessible() 和 setAccessible(boolean flag)

// 使用构造方法创建一个新的对象实例。传入的参数是构造方法的参数列表    
public T newInstance(Object ... initargs)
        throws InstantiationException, IllegalAccessException,
               IllegalArgumentException, InvocationTargetException    

// 获取声明该构造方法的类的Class对象
public Class<T> getDeclaringClass() 
```

```java
// 获取类中的某个成员方法，只能获取public修饰的
public Method getMethod(String name, Class<?>... parameterTypes)
        throws NoSuchMethodException, SecurityException
        
// 获取类中的所有成员方法，只能获取public修饰的        
public Method[] getMethods() throws SecurityException        


// 获取类中某个成员方法
public Method getDeclaredMethod(String name, Class<?>... parameterTypes)
        throws NoSuchMethodException, SecurityException

// 获取类声明的所有方法
public Method[] getDeclaredMethods() throws SecurityException
```

```java
// Method 类中

// 获取方法的名称
public String getName()
    
// 获取方法的返回类型
public Class<?> getReturnType()

// 获取方法的参数类型    
public Class<?>[] getParameterTypes()
    
// 获取方法的修饰符，返回一个整数值，可以使用Modifier类的方法解析修饰符
public int getModifiers()

// 获取方法声明的异常类型   
public Class<?>[] getExceptionTypes()
    
// 调用方法    
public Object invoke(Object obj, Object... args)
        throws IllegalAccessException, IllegalArgumentException,
           InvocationTargetException 
```

```java
// 创建类的实例
public T newInstance()
        throws InstantiationException, IllegalAccessException
// 注意：
//	要想对象创建成功，需满足以下条件
//		要求运行时类中必须提供空参构造器
//		要求提供的空参构造器的权限要足够，否则报错 IllegalAccessException

// 从JDK9开始，此方法被标记为 @Deprecated(since="9") 已过时    

// JDK9之后，我们会使用 Constructor 类的 newInstance方法 创建类的实例
```

### 获取所有的属性及相关细节

```java
public class Student {
    private String name;
    private  int age;
    public static String schoolName;
    public static final String COUNTTRY = "中国";

    public Student() {
    }

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
	// 省略了get、set、toString方法
}
```

```java
public class FieldDemo01 {
    @Test
    public void setField() throws Exception {
        // 获取类对象
        Class c = Student.class;
        // 根据名称定位某个成员变量
        Field ageF = c.getDeclaredField("age");
        // 获取字段的名称，获取字段的类型
        System.out.println(ageF.getName() + "==>" + ageF.getType());  // age==>int
        // 获取字段的修饰符
        /*
         * 0x 是十六进制
         * PUBLIC = 0x00000001; 1 1
         * PRIVATE = 0x00000002; 2 10
         * PROTECTED = 0x00000004; 4 100
         * STATIC = 0x00000008; 8 1000
         * FINAL = 0x00000010; 1610000
         * ...
         *
         * 设计的理念，就是用二进制的某一位是 1，来代表一种修饰符，整个二进制中只有一位是 1，其余都是 0
         *
         * mod = 17 0x00000011
         * if ((mod & PUBLIC) != 0) 说明修饰符中有 public
         * if ((mod & FINAL) != 0) 说明修饰符中有 final
         */
        System.out.println(ageF.getModifiers() + "==>" + Modifier.toString(ageF.getModifiers()));  // 2==>priv
        ageF.setAccessible(true);  // 暴力反射

        // 赋值
        Student s = new Student();
        ageF.set(s, 18);  // 其实就是类似于 s.setAge(18);
        System.out.println(s);  // Student{name='null', age=18}

        // 取值
        int age = (int) ageF.get(s);
        System.out.println(age);  // 18
    }
}
```

### 获取所有的方法及相关细节

```java
public class Dog {
    private String name;

    public Dog() {
    }

    public Dog(String name) {
        this.name = name;
    }
    // 省略了get、set方法
    public void run(){
        System.out.println("狗跑得贼快");
    }

    private void eat(){
        System.out.println("狗吃骨头");
    }

    private String eat(String name){
        System.out.print("狗吃" + name);
        return ",吃得很开心";
    }

    public static void inAddr(){
        System.out.println("是一只单身狗");
    }
}
```

```java
public class MethodDemo01 {
    // 获取类中所有的成员方法
    // public Method[] getDeclaredMethods()
    @Test
    public void getDeclareMethods() {
        // 1.获取类对象
        Class c = Dog.class;
        // 2.提取全部方法（包括私有）
        Method[] methods = c.getDeclaredMethods();
        // 遍历全部方法
        for (Method method : methods) {
            // 获取方法的名称、返回类型、参数个数
            System.out.println(method.getName() + " 返回类型：" + method.getReturnType()
                    + " 参数个数：" + method.getParameterCount());
            // 获取方法的权限修饰符
            System.out.println(method.getModifiers()+"==>"+ Modifier.toString(method.getModifiers()));
        }
    }


    // 获取类中某个成员方法
    // public Method getDeclaredMethod(String name, Class<?>... parameterTypes)
    @Test
    public void getDeclareMethod() throws Exception {
        // 1.获取类对象
        Class c = Dog.class;
        // 2.提取某个方法（包括私有）
        Method methods = c.getDeclaredMethod("eat");
        System.out.println(methods.getName() + " 返回类型：" + methods.getReturnType()
                + " 参数个数：" + methods.getParameterCount());

        Method methods2 = c.getDeclaredMethod("eat", String.class);
        System.out.println(methods2.getName() + " 返回类型：" + methods2.getReturnType()
                + " 参数个数：" + methods2.getParameterCount());

        // 暴力反射，打开权限
        methods.setAccessible(true);
        methods2.setAccessible(true);

        // 3.触发方法的执行
        Dog d = new Dog();
        methods.invoke(d);

        // 注意：方法如果是没有返回结果的，会返回null
        String result = (String) methods2.invoke(d, "骨头");
        System.out.println(result);
    }
}
```

### 获取其他结构(构造器、父类、接口、包、注解等)

#### 获取类的所有构造器

```java
public class Student {
    private String name;
    private  int age;

    private Student() {
    }

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
	// 省略get、set、toStirng方法
}
```

```java
public class TestStudent01 {
    // 1.getConstructors();
    // 获取全部的构造器：只能获取public修饰的构造器
    //  public Constructor<?>[] getConstructors()  // 方法签名
    @Test
    public void getConstructors() {
        // a.获取类对象
        Class c = Student.class;
        // b.提取类中的全部构造器对象(这里只能拿public修饰的)
        Constructor[] constructors = c.getConstructors();
        // c.遍历构造器
        for (Constructor constructor : constructors) {
            System.out.println(constructor.getName() + "===>" + constructor.getParameterCount());
        }
    }

    // 2.getDeclaredConstructors()
    //获取全部的构造器：只要你敢写，无所谓权限是否可及
    @Test
    public void getDeclaredConstructors() {
        // a.获取类对象
        Class c = Student.class;
        // b.提取类中的全部构造器对象
        Constructor[] constructors = c.getDeclaredConstructors();
        // c.遍历构造器
        for (Constructor constructor : constructors) {
            System.out.println(constructor.getName() + "===>" + constructor.getParameterCount());
        }
    }

    // 3.getConstructor(Class... parameterTypes)
    // public Constructor<T> getConstructor(Class<?>... parameterTypes)
    // 获取某个构造器：只能拿public修饰的某个构造器对象
    @Test
    public void getConstructor() throws Exception {
        // a.获取类对象
        Class c = Student.class;
        // b.定位单个构造器对象（按照参数定位无参数构造器 只能拿public修饰的某个构造器对象）

        // 因为无参构造器私有，调用以下代码会报错
        //Constructor cons = c.getConstructor();
        //System.out.println(cons.getName() + "===>" + cons.getParameterCount());


        // c.定位某个有参构造器
        Constructor cons1 = c.getDeclaredConstructor(String.class, int.class);
        System.out.println(cons1.getName() + "===>" + cons1.getParameterCount());

    }

    // 4.getDeclaredConstructor
    // 获取某个构造器：只要你敢写，就能拿到，无所谓权限是否可及
    @Test
    public void getDeclaredConstructor() throws Exception {
        // a.获取类对象
        Class c = Student.class;
        // b.定位单个构造器对象（按照参数定位无参数构造器）
        Constructor cons = c.getDeclaredConstructor();
        System.out.println(cons.getName() + "===>" + cons.getParameterCount());


        System.out.println("----------");
        // c.定位某个有参构造器
        Constructor cons1 = c.getDeclaredConstructor(String.class, int.class);
        System.out.println(cons1.getName() + "===>" + cons1.getParameterCount());
    }
}
```

#### 获取类的父类、包、所实现的接口、注解等

```java
package com.clear.reflection.reflect.reflect_constructor;

public class TestStudent03 {
    @Test
    public void test() throws ClassNotFoundException {
        Class clazz = Class.forName("com.clear.reflection.reflect.reflect_constructor.Student");
        // 获取运行时类的父类
        Class superclass = clazz.getSuperclass();
        System.out.println(superclass);  // class java.lang.Object

        // 获取运行时类的所在的包
        Package aPackage = clazz.getPackage();
        System.out.println(aPackage);  // package com.clear.reflection.reflect.reflect_constructor

        // 获取运行时类所实现的接口
        Class[] interfaces = clazz.getInterfaces();
        System.out.println(Arrays.toString(interfaces));  // []

        // 获取运行时类的注解
        Annotation[] annotations = clazz.getAnnotations();
        for (Annotation annotation :annotations){
            System.out.println(annotation);
        }
        // 获取运行时类的父类的泛型
        // Type是一个接口，Class实现了这个接口
        Type genericSuperclass = clazz.getGenericSuperclass();
        // 如果父类是带泛型的，则可以强转为 ParameterizedType
        ParameterizedType parameterizedType = (ParameterizedType)genericSuperclass;
        // 调用 getActualTypeArguments() 获取泛型的参数，结果是一个数组，因为可能有多个泛型
        Type[] actualTypeArguments = parameterizedType.getActualTypeArguments();
        for (Type actualTypeArgument : actualTypeArguments) {
            System.out.println(actualTypeArgument);
        }  
    }
}
```

### 获取泛型父类信息

```java
/* Type：
* （1）Class
* （2）ParameterizedType 
* 例如：Father<String,Integer>
* ArrayList<String>
* （3）TypeVariable
* 例如：T，U,E,K,V
* （4）WildcardType
* 例如：
* ArrayList<?>
* ArrayList<? super 下限>
* ArrayList<? extends 上限>
* （5）GenericArrayType
* 例如：T[]
* 
*/
public class TestGeneric {
    public static void main(String[] args) {
        //需求：在运行时，获取 Son 类型的泛型父类的泛型实参<String,Integer>
        //（1）还是先获取 Class 对象
        Class clazz = Son.class;//四种形式任意一种都可以
        //（2）获取泛型父类
        // Class sc = clazz.getSuperclass();
        // System.out.println(sc);
        /*
		 * getSuperclass()只能得到父类名，无法得到父类的泛型实参列表
		 */
        Type type = clazz.getGenericSuperclass();
        // Father<String,Integer>属于 ParameterizedType
        ParameterizedType pt = (ParameterizedType) type;
        //（3）获取泛型父类的泛型实参列表
        Type[] typeArray = pt.getActualTypeArguments();
        for (Type type2 : typeArray) {
            System.out.println(type2);
        }
    }
}
//泛型形参：<T,U>
class Father<T,U>{
}
//泛型实参：<String,Integer>
class Son extends Father<String,Integer>{
}
```

### 获取内部类或外部类信息

public Class<?>[] getClasses()：返回所有公共内部类和内部接口。包括从超类继承的公共类和接口成员以及该类声明的公共类和接口成员。 

public Class<?>[] getDeclaredClasses()：返回 Class 对象的一个数组，这些对象反映声明为此 Class 对象所表示的类的成员的所有类和接口。包括该类所声明的公共、保护、默认（包）访问及私有类和接口，但不包括继承的类和接口。 

public Class<?> getDeclaringClass()：如果此 Class 对象所表示的类或接口是一个内部类或内部接口，则返回它的外部类或外部接口，否则返回 null。 

Class<?> getEnclosingClass() ：返回某个内部类的外部类

```java
@Test
public void test5(){
    Class<?> clazz = Map.class;
    Class<?>[] inners = clazz.getDeclaredClasses();
    for (Class<?> inner : inners) {
        System.out.println(inner);
    }
    Class<?> ec = Map.Entry.class;
    Class<?> outer = ec.getDeclaringClass();
    System.out.println(outer);
}
```

### 小 结  

在实际的操作中，取得类的信息的操作代码，并不会经常开发。 

一定要熟悉 java.lang.reflect 包的作用，反射机制。 

## 调用运行时类的指定结构

### 调用指定的属性

在反射机制中，可以直接通过 Field 类操作类中的属性，**通过 Field 类提供的 set()和 get()方法就可以完成设置和取得属性内容的操作。** 

步骤如下：

**（1）获取该类型的 Class 对象** 

```java
Class clazz = Class.forName("包.类名"); 
或 
Class clazz = 类名.class;
```

**（2）获取属性对象** 

```java
Field field = clazz.getDeclaredField("属性名"); 
```

**（3）如果属性的权限修饰符不是 public，那么需要设置属性可访问**

```java
field.setAccessible(true);
```

**（4）创建实例对象：如果操作的是非静态属性，需要创建实例对象** 

```java
Object obj = clazz.newInstance();	 //有公共的无参构造 

Object obj = 构造器对象.newInstance(实参...);	//通过特定构造器对象创建实例对象 
```

**（4）设置指定对象 obj 上此 Field 的属性内容** 

```java
field.set(obj,"属性值"); 
```

如果操作静态变量，那么实例对象可以省略，用 null 表示 

**（5）取得指定对象 obj 上此 Field 的属性内容** 

```java
Object value = field.get(obj); 
```

注意：

​	如果操作**静态变量，那么实例对象可以省略**，用 null 表示 

```java
public class Student {
    private int id;		// 私有
    private String name;
 	// 省略了get、set、toString方法
}
```

```java
public class TestField {
    public static void main(String[] args)throws Exception {
        // 1、获取 Student 的 Class 对象
        Class clazz = Class.forName("com.clear.reflect.Student");

        // 2、获取属性对象，例如：id 属性
        Field idField = clazz.getDeclaredField("id");
        // 3、如果 id 是私有的等在当前类中不可访问 access 的，我们需要做如下操作
        idField.setAccessible(true);  // 暴力反射

        // 4、创建实例对象，即，创建 Student 对象
        Object stu = clazz.newInstance();
        // 5、获取属性值
        /*
 		* 以前：int 变量= 学生对象.getId()
 		* 现在：Object id 属性对象.get(学生对象)
 		*/
        Object value = idField.get(stu);
        System.out.println("id = "+ value);
        // 6、设置属性值
        /*
 		* 以前：学生对象.setId(值)
    	* 现在：id 属性对象.set(学生对象,值)
    	*/
        idField.set(stu, 2);
        value = idField.get(stu);
        System.out.println("id = "+ value);
    }
}
```

**关于 setAccessible 方法的使用：** 

-   **Method 和 Field、Constructor 对象都有 setAccessible()方法**。 
-   setAccessible 启动和禁用访问安全检查的开关。 

-   参数值为 **true** 则指示反射的对象在使用时应该**取消 Java 语言访问检查**。 
    -   提高反射的效率。如果代码中必须用反射，而该句代码需要频繁的被调用，那么请设置为 true。 
    -   使得原本无法访问的私有成员也可以访问 （暴力反射，设置了以后可以访问私有成员）
-   参数值为 false 则指示反射的对象应该实施 Java 语言访问检查。 


### 调用指定的方法

步骤如下：

**（1）获取该类型的 Class 对象** 

```java
Class clazz = Class.forName("包.类名"); 
或  
Class clazz = 类名.class;
```

**（2）获取方法对象Method method = clazz.getDeclaredMethod("方法名",方法的形参类型列表);** 

**（3）创建实例对象** 

Object obj = clazz.newInstance(); 

**（4）调用方法** 

Object result = method.**invoke**(obj, 方法的实参值列表); 

如果方法的权限修饰符修饰的范围不可见，也可以调用 setAccessible(true) 

说明：

​	通过Method实例调用 public Object invoke(Object obj, Object... args)，即为对Method对应的方法的调用
​    invoke()的返回值即为Method对应方法的返回值
​    如果**Method对应的方法返回值为void，则invoke()的返回值为null**

注意：

​	**如果方法是静态方法，实例对象也可以省略**，用 null 代替 

```java
public class TestMethod {
    @Test
    public void test()throws Exception {
        // 1、获取 Student 的 Class 对象
        Class<?> clazz = Class.forName("com.clear.reflect.Student");
        // 2、获取方法对象
        /*
         * 在一个类中，唯一定位到一个方法，需要：
         *				（1）方法名
         *				（2）形参列表，因为方法可能重载
         *
         * 例如：void setName(String name)
         */
        Method setNameMethod = clazz.getDeclaredMethod("setName", String.class);
        // 3、创建实例对象
        Object stu = clazz.newInstance();
        // 4、调用方法
        /*
         * 以前：学生对象.setName(值)
         * 现在：方法对象.invoke(学生对象，值)
         */
        Object setNameMethodReturnValue = setNameMethod.invoke(stu, "张三");
        System.out.println("stu = " + stu);
        // setName 方法返回值类型 void，没有返回值，所以 setNameMethodReturnValue 为 null
        System.out.println("setNameMethodReturnValue = " + setNameMethodReturnValue);
        Method getNameMethod = clazz.getDeclaredMethod("getName");
        // 通过Method实例调用invoke(Object obj,Object ... objs)，即为对Method对应的方法的调用
        // invoke()的返回值即为Method对应方法的返回值
        // 注意：
        //		如果Method对应的方法返回值为void，则invoke()的返回值为null
        Object getNameMethodReturnValue = getNameMethod.invoke(stu);
        // getName 方法返回值类型 String，有返回值，getNameMethod.invoke的返回值就是 getName 方法的返回值
        System.out.println("getNameMethodReturnValue = " + getNameMethodReturnValue);  // 张三
    }
    @Test
    public void test02()throws Exception{
        Class<?> clazz = Class.forName("com.clear.ext.demo.AtGuiguClass");
        Method printInfoMethod = clazz.getMethod("printInfo", String.class);

        //printInfo 方法是静态方法
        printInfoMethod.invoke(null,"666");
    }
}
```

### 调用指定构造器

```
public class Student {
    private int id;		// 私有
    private String name;
 	// 省略了get、set、toString方法
}
```



```java
public class TestNewInstance {
    @Test
    public void test() throws Exception {
        // 1、获取 Student 的 Class 对象
        Class<?> clazz = Class.forName("com.clear.reflect.Student");
        // 2、获取构造器对象
        // 获取无参构造器
        Constructor<?> constructor = clazz.getDeclaredConstructor();
        // 开启权限
        constructor.setAccessible(true);

        // 3、创建实例对象，调用 Constructor 实例的newInstance()，返回一个运行时类的实例
        Student student = (Student) constructor.newInstance();
        System.out.println(student);
    }
}
```



### demo

读取 user.properties 文件中的数据，通过反射完成 User 类对象的创建及对应方法的调用。

配置文件：user.properties

```java
className:com.clear.reflection.demo.User
methodName:show
```

```java
package com.clear.reflection.demo;

public class User {
    private String name;

    public User() {
    }

    public User(String name) {
        this.name = name;
    }

    public void show() {
        System.out.println("我是一个脉脉平台的用户");
    }
}
```

```java
public class ReflectTest {
    @Test
    public void test() throws Exception {
        // 1.创建 Properties 对象
        Properties prop = new Properties();
        // 2.加载配置文件，转换为一个集合
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();
        InputStream inputStream = classLoader.getResourceAsStream("user.properties");
        prop.load(inputStream);
        // 3.获取配置文件中定义的数据
        String className = prop.getProperty("className");
        String methodName = prop.getProperty("methodName");
        // 4.加载该类进内存
        Class<?> clazz = Class.forName(className);
        // 5.创建对象
        Object instance = clazz.newInstance();
        // 6.获取方法对象
        Method showMethod = clazz.getMethod(methodName);
        //7.执行方法
        showMethod.invoke(instance);
    }
}
```

## 泛型的擦除

​	反射的泛型擦除是指在运行时，由于Java的泛型是在编译时进行类型擦除的，所以在反射中无法获取到泛型的具体类型信息。

​	在Java中，泛型是通过类型擦除来实现的。编译器在编译时会将泛型类型转换为原始类型，并在需要的地方插入强制类型转换。这样做是为了保持与旧版本的Java代码的兼容性。

```java
package com.clear.reflection.reflect.reflect_genericity;

import java.lang.reflect.Method;
import java.util.ArrayList;

public class ReflectDemo {
    public static void main(String[] args) throws Exception {
        // 需求：反射实现泛型擦除后(泛型不在约束)，加入其他类型的元素
        ArrayList<String> lists1 = new ArrayList<>();
        ArrayList<Integer> lists2 = new ArrayList<>();

        System.out.println(lists1.getClass());  // class java.util.ArrayList
        System.out.println(lists2.getClass());  // class java.util.ArrayList

        System.out.println(lists1.getClass() == lists2.getClass());  // true

        System.out.println("-------------------------");

        ArrayList<Integer> lists3 = new ArrayList<>();
        lists3.add(23);
        lists3.add(33);
        //lists3.add("黑马");  // 编译阶段就会报错，可以利用反射跳过编译阶段直接在class对象添加

        Class c = lists3.getClass();  // ArrayList.class ===> public boolean add(E e)
        // 定位c类中的add方法
        Method add = c.getDeclaredMethod("add",Object.class);

        boolean rs1 = (boolean)add.invoke(lists3,"黑马");  // 触发执行
        boolean rs2 = (boolean)add.invoke(lists3,'g');
        System.out.println(rs1);  // true
        System.out.println(rs2);  // true

        System.out.println(lists3);  // [23, 33, 黑马, g]

        // 另外一种不通过反射添加元素的方法
        ArrayList list4 = lists3;
        list4.add("八嘎");
        list4.add(false);
        System.out.println(lists3);  // [23, 33, 黑马, g, 八嘎, false]
    }
}
```



# 读取注解信息

一个完整的注解应该包含三个部分： 

（1）声明 

（2）使用 

（3）读取 

## 声明自定义注解

```java
package com.clear.annotation;

import java.lang.annotation.*;
@Inherited
@Target(ElementType.TYPE)	// 声明该注解只能使用在类上
@Retention(RetentionPolicy.RUNTIME)
public @interface Table {
    String value();
}


package com.clear.annotation;

import java.lang.annotation.*;
@Inherited
@Target(ElementType.FIELD)	// 声明该注解只能使用在属性上
@Retention(RetentionPolicy.RUNTIME)
public @interface Column {
    String columnName();
    String columnType();
}
```

-   自定义注解可以通过**四个元注解**@Retention,@Target，@Inherited,@Documented，分别说明它的**声明周期，使用位置，是否被继承，是否被生成到 API 文档中**。 

-   Annotation 的成员在 Annotation 定义中以无参数有返回值的抽象方法的形式来声明，我们又称为配置参数。返回值类型只能是八种基本数据类型、String 类型、Class类型、enum 类型、Annotation 类型、以上所有类型的数组 

-   可以使用 default 关键字为抽象方法指定默认返回值 

-   如果定义的注解含有抽象方法，那么使用时必须指定返回值，除非它有默认值。格式是“方法名 = 返回值”，如果只有一个抽象方法需要赋值，且方法名为 value，可以省略“value=”，所以如果注解只有一个抽象方法成员，建议使用方法名 value。 


## 使用自定义注解

```java
package com.clear.annotation;

@Table("t_stu")
public class Student {
    @Column(columnName = "sid",columnType = "int")
    private int id;
    @Column(columnName = "sname",columnType = "varchar(20)")
    private String name;
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    @Override
    public String toString() {
        return "Student{" +
            "id=" + id +
            ", name='" + name + '\'' +
            '}';
    }
}
```

## 读取和处理自定义注解

自定义注解必须配上注解的信息处理流程才有意义。 

我们自己定义的注解，只能使用反射的代码读取。所以自定义注解的声明周期 

必须是 RetentionPolicy.RUNTIME。 

```java
package com.clear.annotation;

import java.lang.reflect.Field;
public class TestAnnotation {
    public static void main(String[] args) {
        Class studentClass = Student.class;
        // 获取类声明的注解
        Table tableAnnotation = (Table) studentClass.getAnnotation(Table.class);
        String tableName = "";
        if(tableAnnotation != null){
            tableName = tableAnnotation.value();
        }
        Field[] declaredFields = studentClass.getDeclaredFields();
        String[] columns = new String[declaredFields.length];
        int index = 0;
        for (Field declaredField : declaredFields) {
            // 获取属性声明的注解
            Column column = declaredField.getAnnotation(Column.class);
            if(column!= null) {
                columns[index++] = column.columnName();
            }
        }

        String sql = "select ";
        for (int i=0; i<index; i++) {
            sql += columns[i];
            if(i<index-1){
                sql += ",";
            }
        }
        sql += " from " + tableName;
        System.out.println("sql = " + sql);
    }
}
```



# 体会反射的动态性

**体会 1：** 反射的动态性

```java
public class ReflectionTest {
    // 体会：静态性
    public Person getInstace(){
        return new Person();
    }
    //体会：反射的动态性：动态的创建给定字符串对应的类的对象
    public <T> T getInstance(String className) throws Exception {
        Class clazz = Class.forName(className);
        
        Constructor constructor = clazz.getDeclaredConstructor(); 
        constructor.setAccessible(true);
        return (T) constructor.newInstance();
    }
    
    @Test
    public void test1() throws Exception {
        String className = "com.clear.Person";
        Person p1 = getInstance(className);
        System.out.println(p1);
    }
}
```

**体会 2：** 

```java
public class ReflectionTest {
    //体会：反射的动态性：动态的创建指定字符串对应类的对象，并调用指定的方法
    public Object invoke(String className,String methodName) throws
        Exception {
        Class clazz = Class.forName(className);
        Constructor constructor = clazz.getDeclaredConstructor();
        constructor.setAccessible(true);
        
        //动态的创建指定字符串对应类的对象
        Object obj = constructor.newInstance();
        Method method = clazz.getDeclaredMethod(methodName);
        method.setAccessible(true);
        return method.invoke(obj);
    }
    @Test
    public void test2() throws Exception {
        String info = (String) invoke("com.clear.Person", "show");
        System.out.println("返回值为：" + info);
    }
}
```

**体会 3：** 

```java
public class ReflectionTest {
    @Test
    public void test1() throws Exception {
        //1.加载配置文件，并获取指定的 fruitName 值
        Properties pros = new Properties();
        // 注意：使用类加载时，相对路径是moudle下的src
        InputStream is = ClassLoader.getSystemClassLoader().getResourceAsStream("config.properties");
        pros.load(is);
        String fruitStr = pros.getProperty("fruitName");
        //2.创建指定全类名对应类的实例
        Class clazz = Class.forName(fruitStr);
        Constructor constructor = clazz.getDeclaredConstructor();
        constructor.setAccessible(true);
        Fruit fruit = (Fruit) constructor.newInstance();
        //3. 调用相关方法，进行测试
        Juicer juicer = new Juicer();
        juicer.run(fruit);
    }
}

interface Fruit {
    public void squeeze();
}
class Apple implements Fruit {
    public void squeeze() {
        System.out.println("榨出一杯苹果汁儿");
    }
}
class Orange implements Fruit {
    public void squeeze() {
        System.out.println("榨出一杯桔子汁儿");
    }
}
class Juicer {
    public void run(Fruit f) {
        f.squeeze();
    }
}
```