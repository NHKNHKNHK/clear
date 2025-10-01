# Object 类  

:::tip
`Object`：所有类的超类
:::

## 如何理解根父类

- 类 `java.lang.Object` 是类层次结构的根类，即**它是所有其它类的父类。每个类都使用 *Object* 作为超类**。

- 在Java中声明的类，如果没有显式的声明其父类时，则**默认继承**于 `java.lang.Object`。
  - 其实我们也没有必要显示的声明，例如 public class Person，因为没有声明默认Object就是它的超类

- Object 类型的变量与除 Object 以外的任意引用数据类型的对象都存在**多态引用**

```java
method(Object obj){…}  // 可以接收任何类作为其参数

Person o = new Person(); 

method(o);
```

- 在Java中只有基本数据类型不是对象，此外所有对象（包括数组）都实现这个类的方法。 
- 所有的数组类型，不管是对象数组，还是基本类型数据都扩展了Object类。
- 如果一个类没有特别指定父类，那么默认则继承自 Object 类。例如： 

```java
public class Person {
...
}

// 等价于：
public class Person extends Object {
...
}
```

:::warning
在Java中，所有类都继承（或间接继承）自`Object`类，这意味着每个类都继承了 Object 类的方法。

不过，基本数据类型除外
:::

## Object 类的方法

-   任何一个Java类，都会直接 或 间接 继承 `Object`类。
-   因为Object类称为Java类的根父类，Object类中声明的结构（属性、方法等）就具有通用性。
    -   Object类中没有声明属性
    -   Object类中提供了一个空参构造器

根据 JDK 源代码及 Object 类的 API 文档，Object 类当中包含的方法有 11 个。

### 1 (重点)equals(Object obj)

```java
// 用于比较两个对象是否相等
public boolean equals(Object obj) {
        return (this == obj);	// Object中的equlas方法默认比较的是 引用地址
}
```

**= =：** 

-   **基本类型比较值**:只要两个变量的值相等，即为 true。 

    -   ```java
        int a=5;
        if(a==6){…}
        ```

-   **引用类型比较引用**(是否指向同一个对象)：只有指向同一个对象时，==才返回 true。 

    -   ```java
        Person p1=new Person(); 
        Person p2=new Person();
        if (p1==p2){…}
        ```

        用“==”进行比较时，符号两边的*数据类型必须兼容*(可自动转换的基本数据类型除外)，否则编译出错 

**equals()：**所有类都继承了 Object，也就获得了 equals()方法。还可以重写。 

-   只能比较引用类型，**Object 类源码中 equals()的作用与“==”相同：比较是否指向同一个对象。**  
-   格式:obj1.equals(obj2)

-   特例：当用 equals()方法进行比较时，对**类 File、String、Date 及包装类（Wrapper Class）来说，是比较类型及内容而不考虑引用的是否是同一个对象；** 
    -   **原因：在这些类中重写了 Object 类的 equals()方法**。 

例如：

```java
public class EqualsDemo {
    public static void main(String[] args) {
        String str1 = "Hello";
        String str2 = "Hello";
        // 比较引用类型，因为String类重写了equals方法，比较的是内容
        boolean isEqual = str1.equals(str2);
        System.out.println(isEqual);  // true
        // 比较自定义类
        User user1 = new User("张三", 18);
        User user2 = new User("张三", 18);
        System.out.println(user1.equals(user2));  // false
        // todo 自定义的类在没有重写Object类中equals()方法的情况下，默认调用Object中声明了equals()方法，所有比较的是两个对象的引用地址

    }
}

class User {
    private String name;
    private int age;

    public User() {
    }

    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

-   当自定义使用 equals()时，可以重写。用于比较两个对象的“内容”是否都相等 

-   Java语言重写 equals()方法的原则 
    -   **对称性**：对于任何引用 x 和 y，如果 x.equals(y)返回是“true”，那么 y.equals(x)也应该返回是“true”。 
    -   **自反性**：对于任何非空引用。x.equals(x)必须返回是“true”。 
    -   **传递性**：对于任何引用x、y、z，如果 x.equals(y)返回是“true”，而且 y.equals(z)返回是“true”，那么 z.equals(x)也应该返回是“true”。 
    -   **一致性**：如果 x.equals(y)返回是“true”，只要 x 和 y 内容一直不变，不管你重复 x.equals(y)多少次，返回都是“true”。 
    -   任何情况下，x.equals(null)，永远返回是“false”；	x.equals(和 x 不同类型的对象)永远返回是“false”。 

提示：

​	对于数组类型的域，可以使用静态方法 Arrays.equals 方法判断两个数组中的元素是否相等。

**解析String类中重写的equals方法**

```java
public boolean equals(Object anObject) {
    if (this == anObject) { // 先检查是否是自己跟自己比较，如果是，直接返回true
        return true;
    }
    if (anObject instanceof String) {  // 先判断是否是同类型对象，如果不是，直接返回false
        String anotherString = (String)anObject;  // 类型强制转换
        int n = value.length;
        if (n == anotherString.value.length) {	// 比较长度，长度不一致，直接flase
            char v1[] = value;
            char v2[] = anotherString.value;
            int i = 0;	
            while (n-- != 0) {		// 通过循环，一一对比，如果有不同的字符，直接false
                if (v1[i] != v2[i])
                    return false;
                i++;
            }
            return true;
        }
    }
    return false;
}
```

**自定义类重写equals方法**

```java
// 重写equals方法
@Override
public boolean equals(Object obj) {
    if (this == obj) {
        return true;
    }
    if (obj instanceof User) {
        User that = (User) obj;
        return this.age == that.age && this.name.equals(that.name);
    }
    return false;
}

// IDEA帮我们自动生成的equals方法
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    User user = (User) o;
    return age == user.age && Objects.equals(name, user.name);
}
// 开发中，重写equals方法时，需要同时重写hashCode方法
@Override
public int hashCode() {
    return Objects.hash(name, age);
}
```

**面试题：**

==和 equals 的区别从我面试的反馈，85%的求职者“理直气壮”的回答错误… 

-   == 既可以比较基本类型也可以比较引用类型。对于**基本类型就是比较值**，对于**引用类型就是比较内存地址** 
-   equals 的话，它是属于 java.lang.Object 类里面的方法，如果该方法没有被重写过默认也是==；我们可以看到 String 等类的 equals 方法是被重写过的，而且 String 类在日常开发中用的比较多，久而久之，形成了 equals 是比较值的错误观点。 
-   具体要看自定义类里有没有重写 Object 的 equals 方法来判断。 

通常情况下，重写 equals 方法，会比较类中的相应属性是否都相等。 

**练习 1：** 

```java
@Test
public void test() {
    int it = 65;
    float fl = 65.0f;
    System.out.println(it == fl); // true  存在自动类型转换

    char ch1 = 'A';
    char ch2 = 12;
    System.out.println(it == ch1);  // true  存在自动类型转换
    System.out.println(12 == ch2); // true

    String str1 = new String("hello");
    String str2 = new String("hello");
    System.out.println("str1 和 str2 是否相等？" + (str1 == str2));  // false
    System.out.println("str1 是否 equals str2？" + (str1.equals(str2)));  // true
    System.out.println((new java.util.Date()).equals("hello")); // false
}
```

### 2 (重点)toString()

```java
public String toString() {
    return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
```

1）**默认情况下**（即没有覆写Object类中的toString方法时），toString()返回的是 “**对象的运行时类型 @ 对象的 hashCode 值的十六进制形式**" 

2）**像File、String、Date 及包装类（Wrapper Class）来说，它们都重写了Object类中的toString()，**在调用toString()时，返回当前对象的实体内容。

**在进行 String 与其它类型数据的连接操作时，自动调用 toString()方法** 

特别强调：

​	只要对象与一个字符串通过 + 的方式连接，Java编译就会自动调用toString方法，以便获得对象的字符串描述。

```java
Date now=new Date();
System.out.println(“now=”+now); //相当于（因为 String 与其它类型数据的连接操作时，自动调用 toString()方法）
System.out.println(“now=”+now.toString());

// 在调用 now.toString()的地方可以用 +now 代替
```

3）如果我们直接 **System.out.println(对象)，默认会自动调用这个对象的 toString()** 

因为 Java 的引用数据类型的变量中存储的实际上时对象的内存地址，但是 Java 对程序员隐藏内存地址信息，所以不能直接将内存地址显示出来，所以当你打印对象时，**JVM 帮你调用了对象的 toString()**。 

4）可以根据需要在用户自定义类型中重写 toString()方法 如 String 类重写了toString()方法，返回字符串的值。 

```java
s1="hello";
System.out.println(s1);//相当于 System.out.println(s1.toString());
```

强烈建议：

​	在自己定义的每个类增加toString方法。这样自己会受益，在日志记录中也会更清楚。

自定义类重写equals方法：

```java
public class ToStringDemo {
    public static void main(String[] args) {
        User2 user2 = new User2("张三", 18);
        // 自定义类没有重写toString方法的情况下
        System.out.println(user2.toString());  // com.clear.object1.User2@16e8e0a
        // 自定义类重写toString方法之后
        System.out.println(user2.toString());  // 
    }
}

class User2 {
    private String name;
    private int age;

    public User2() {
    }

    public User2(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 重写 toString方法
    @Override
    public String toString() {
        return "User:{ name = " + name + ", age = " + age + "}";
        // 实际上，User 这个字符串应该写成 getClass().getName()的方式获得类名，减少硬编码
    }
}
```

```java
// 如下是IDEA自动生产的toString方法
@Override
public String toString() {
    return "User2{" + "name='" + name + '\'' + ", age=" + age + '}';
}
```

### 3 clone()

创建并返回当前对象的副本，该方法中**原型设计模式**中会用到

```java
protected native Object clone() throws CloneNotSupportedException // 创建并返回当前对象的副本
```

```java
public class CloneDemo {
    public static void main(String[] args) {
        Animal a1 = new Animal("花花");
        try {
            // 克隆
            Animal a2 = (Animal) a1.clone();
            System.out.println("原始对象：" + a1);  // 原始对象：Animal{name='花花'}
            a2.setName("毛毛");
            System.out.println("clone 之后的对象：" + a2);  // clone 之后的对象：Animal{name='毛毛'}
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
    }
}

class Animal implements Cloneable {  // 注意，如果一个类的实例想要调用clone()方法，则该类必须实现Cloneable接口
    private String name;

    public Animal() {
        super();
    }

    public Animal(String name) {
        super();
        this.name = name;
    }
	// 省略了get、set、toString方法

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

### 4 finalize()  

```java
// 在 JDK 9 中此方法已经被标记为过时的
// 过时的原因是因为，该方法可能会导致循环引用，导致对象不能正常回收
protected void finalize() throws Throwable  // 在对象被垃圾回收之前调用，用于执行清理操作
```

-   当对象被回收时，系统自动调用该对象的 finalize() 方法。（不是垃圾回收器调用的， 是本类对象调用的） 
    -   永远**不要主动调用某个对象的 finalize 方法，应该交给垃圾回收机制调用。**

-   什么时候被回收：当某个对象没有任何引用时，JVM 就认为这个对象是垃圾对象，就会在之后不确定的时间使用垃圾回收机制来销毁该对象，在销毁该对象前，会先调用 finalize()方法。 

-   子类可以重写该方法，目的是在对象被清理之前执行必要的清理操作。比如，在方法内断开相关连接资源。 
    -   如果重写该方法，让一个新的引用变量重新引用该对象，则会重新激活对象。 

例如：

```java
package com.clear.object1;

public class FinalizeDemo {
    public static void main(String[] args) {
        Person p1 = new Person("张三", 18);
        System.out.println(p1);
        p1 = null;  // 此时对象实体就是垃圾对象，等待GC回收。但是时间不确定
        
        System.gc();  // 强制性释放空间
    }

}

class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        super();
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    // 子类重写此方法，可在释放对象前进行某些操作
    // 此方法调用时机：当 GC 要回收此对象时调用
    @Override
    protected void finalize() throws Throwable {
        System.out.println("对象被释放--->" + this);
    }

    @Override
    public String toString() {
        return "Person [name=" + name + ", age=" + age + "]";
    }
}
```

结果：

```
Person [name=张三, age=18]
对象被释放--->Person [name=张三, age=18]
```

面试题

**final、finally、finalize 的区别**

1.  final关键字：
    -   用于修饰类、方法和变量。
    -   修饰类：表示该类不能被继承，即为最终类。
    -   修饰方法：表示该方法不能被子类重写，即为最终方法。
    -   修饰变量：表示该变量的值不能被修改，即为常量。
2.  finally关键字：
    -   用于定义在try-catch语句块中的finally块。
    -   finally块中的代码无论是否发生异常，都会被执行。
    -   通常用于释放资源、关闭连接等必须执行的操作。
3.  finalize方法：
    -   是Object类中的一个方法，用于在对象被垃圾回收之前执行一些清理操作。
    -   finalize方法在对象被垃圾回收器回收之前被调用，但**不能保证一定会被调用**。
    -   可以重写finalize方法来定义对象的清理行为，例如关闭文件、释放资源等。

总结：

-   final关键字用于修饰类、方法和变量，表示最终的、不可改变的。
-   finally关键字用于定义在try-catch语句块中的finally块，无论是否发生异常都会执行。
-   finalize方法是Object类中的方法，用于在对象被垃圾回收之前执行清理操作。



### **5 getClass()**  

```java
public final native Class<?> getClass()  // 获取对象的运行时类型（返回一个对象所属类） 
```

因为 Java 有多态现象，所以一个引用数据类型的变量的编译时类型与 运行时类型可能不一致，因此如果需要查看这个变量实际指向的对象的类型，需要用 getClass()方法 

```java
public static void main(String[] args) { 
    Object obj = new Person(); 
    System.out.println(obj.getClass()); // 运行时类型

} 
```

结果： 

```
class com.clear.Person 
```

### 6 hashCode()  散列码

建议：

​	如果重写了equals方法，就必须重写hashCode方法

```java
// 返回每个对象的 hash 值（是一个整型值）
public native int hashCode()  
```

例如：

```java
public class HashCodeDemo {
    public static void main(String[] args) {
        String str = "Hello";
        int hashCode = str.hashCode();
        System.out.println(hashCode);  // 69609650
    }
}
```

提示：

​	对于数组类型的域，可以使用静态方法 Arrays.hashCode 方法计算哈希值，这个散列值由数组元素的散列码组成

### 7 wait()

```java
// 导致当前线程等待，直到另一个线程调用notify()或notifyAll()方法唤醒该线程
public final void wait() throws InterruptedException  
```

-   该方法导致当前线程等待，直到另一个线程调用notify()或notifyAll()方法唤醒该线程。
-   **调用wait()方法的线程会释放对象的锁**，并进入等待状态。
-   该方法没有参数，表示无限等待。
-   通常与synchronized关键字一起使用

### 8 wait(long timeout)

```java

public final native void wait(long timeout) throws InterruptedException  
```

-   该方法导致当前线程等待，直到另一个线程调用notify()或notifyAll()方法唤醒该线程，或者指定的时间过去。
-   **调用wait(long timeout)方法的线程会释放对象的锁**，并进入等待状态。
-   **参数timeout表示等待的时间**，以毫秒为单位。

### 9 wait(long timeout, int nanos)

```java
public final void wait(long timeout, int nanos) throws InterruptedException
```

-   该方法导致当前线程等待，直到另一个线程调用notify()或notifyAll()方法唤醒该线程，或者指定的时间过去。
-   **调用wait(long timeout, int nanos)方法的线程会释放对象的锁**，并进入等待状态。
-   **参数timeout表示等待的时间，以毫秒为单位；参数nanos表示额外的纳秒时间**。

### 10 notify()

```java
// 唤醒在当前对象上等待的单个线程
public final native void notify()
```

-   该方法唤醒在当前对象上等待的单个线程。
-   如果有多个线程在等待，只会唤醒其中一个线程，具体唤醒哪个线程是不确定的

### 11 notifyAll()

```java
// 唤醒在当前对象上等待的所有线程
public final native void notifyAll()
```

-   该方法唤醒在当前对象上等待的所有线程。
-   如果有多个线程在等待，会唤醒所有线程。


​Object中的wait()、wait(long timeout)、wait(long timeout, int nanos)、 notify()、notifyAll()这些方法通常用于线程之间的协作和同步，通过wait()方法使线程进入等待状态，通过notify()或notifyAll()方法唤醒等待的线程。

在使用这些方法时，需要注意以下几点：

-   wait()、notify()和notifyAll()方法**必须在synchronized块中调用**，否则会抛出IllegalMonitorStateException异常。
-   **wait()方法必须在循环中使用**，以防止虚假唤醒（spurious wakeup）。
-   **notify()和notifyAll()方法只会唤醒等待队列中的一个或全部线程，但不会立即释放锁，需要等到synchronized块执行完毕才会释放锁。**



## Objects类

### equals

```java
// 如果a 和 b 都为null，返回true；如果其中一个返回null，则返回false；否则返回 a.equals(b)
public static boolean equals(Object a, Object b) {
    return (a == b) || (a != null && a.equals(b));
}
```



### hash

```java
// 返回一个散列码，由提供的所有对象的散列码组合而成
public static int hash(Object... values) {	// 可变参数底层是数组，所有接下来直接调用Arrys工具类中的方法
    return Arrays.hashCode(values);
}
```

### hashCode

```java
// 如果 o 为 null 返回 0；否则返回 o.hashCode()
public static int hashCode(Object o) {
    return o != null ? o.hashCode() : 0;
}
```

