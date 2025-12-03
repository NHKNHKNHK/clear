# abstract抽象类与方法

## 什么是抽象类、抽象方法

**什么是抽象类**？

- 父类知道子类一定要完成某些功能，但是子类完成的情况是不一样的
- 子类以后也只会用自己重写的功能，那么父类的该方法就可以定义成抽象方法，子类重写调用子类自己的方法

**什么是抽象方法**？

- 抽象方法只有方法签名，**没有方法体，必须用abstract修饰**

- 拥有抽象方法的类必须是抽象类

**小结**：

- 抽象类：拥有抽象方法的类必须定义为抽象类，抽象类必须用abstract修饰
- 抽象方法：只有方法签名，**没有方法体，必须用abstract修饰**

---

示例：

```java
public abstract class Animal {

    private String name;
    private int age;

    public Animal() {
    }

    public Animal(String name, int age) {
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

    /**
     * 抽象方法
     */
    public abstract void eat(); // 只有方法签名，没有方法体
}
```

```java
public class Dog extends Animal {
    public Dog() {
    }

    public Dog(String name, int age) {
        super(name, age);
    }

    /**
     * 子类重写（实现）父类的抽象方法
     */
    @Override
    public void eat() {
        System.out.println("狗吃骨头");
    }
}
```

```java
public class Cat extends Animal{

    public  Cat() {
    }

    public Cat(String name, int age) {
        super(name, age);
    }

    /**
     * 子类重写（实现）父类的抽象方法
     */
    @Override
    public void eat() {
        System.out.println("猫吃鱼");
    }

}
```

```java
/*
    测试类
 */
public class AnimalDemo {
    public static void main(String[] args) {
        //创建对象，以多态的方式
        Animal a = new Cat();
        a.setName("加菲");
        a.setAge(5);
        System.out.println(a.getName()+","+a.getAge());
        a.eat();

        System.out.println("----------");

        a = new Cat("劫匪",5);
        System.out.println(a.getName()+","+a.getAge());
        a.eat();

        //创建对象，以多态形式
        Animal d = new Dog();
        d.setName("多态");
        d.setAge(2);
        System.out.println(d.getName()+","+d.getAge());
        d.eat();

        System.out.println("----------");

        d = new Dog("多态",2);
        System.out.println(d.getName()+","+d.getAge());
        d.eat();
    }
}
```

## 抽象类的作用

抽象类的作用：为了被子类继承

抽象类是为了被子类继承，约束子类要重写抽象方法

注意：

​- 一个类继承了抽象类，必须重写完抽象类中的全部抽象方法，否则这个类也必须定义为抽象类



## 抽象类的特征

抽象类的特征总结起来可以说是**有得有失**

有得：抽象类得到了拥有抽象方法的能力

有失：抽象类失去了创建对象的能力（**抽象类有构造器，但是不能用于创建对象**）

其他成员（构造器、实例方法、静态方法等）抽象类都是具备的

---

**面试题：**

### 抽象类是否有构造器？

答：抽象类作用类一定是有构造器，而且抽象类必须有构造器

​		提供给子类创建对象调用父类构造器使用的

### 抽象类是否可以创建对象？

答：抽象类虽然有构造器但是抽象类不能创建对象。

​		反证法：假如抽象类可以创建对象

```java
Animal a = new Animal();
a.run();	// 抽象方法不能执行，因为没有方法体		所有抽象类不能创建对象！！没有意义
```

**小结：**

- 抽象类不能创建对象，抽象类可以包含抽象方法
- 除此之外，普通类中包含的类的成分抽象类都具备（抽象类中可以定义private成员变量、方法）

## 抽象类存在的意义

抽象类存在的意义有两点：

- 抽象类的核心意义就是为了被子类继承（就是为了派生子类），否则抽象类毫无意义！（基本准则）
- 抽象类体现的是模板思想：部分实现，部分抽象，可以设计模板设计模式！



## abstract特点

- 抽象类和抽象方法必须使用 `abstract` 关键字修饰

  -   ```java
        public abstract class 类名{}
        
        public abstract 返回值类型 方法名(形参列表);	// 没有方法体
        ```

- 抽象类中不一定要有抽象方法，但是有抽象方法的一定是抽象类

- 抽象类不能实例化，应参照多态的方式通过子类实例化对象（**抽象类多态**）

  - 抽象类的构造器不能创建对象，否则编译报错（即不能new），是用于给子类创建对象时子类构造器调用的
  - 理解：假设创建了抽象类的对象，调用了抽象方法，而抽象方法没有具体的实现，毫无意义！！

- 抽象类的子类

  - 要么重写抽象类中所有的抽象方法
  - 要么也是抽象类

- 抽象类成员特点：
  - 成员变量：
    - 可以是变量（可以使用private、public、protected、default修饰）
    - 也可以是常量（final修饰）
  - 构造器：有构造器，但是不能用于实例化（**用于子类访问父类构造器，以便数据初始化**）
  - 成员方法：
    - 可以有抽象方法（限定子类必须完成某些动作）
      - **抽象类中抽象方法的abstract关键字不能省略，接口中可以省略**
    - 也可以是非抽象方法（提高代码的复用性）


不允许使用 `final` 和 `abstract` 修饰同一个方法，因为final修饰的方法表示最终方法，不能被重写，abstract修饰的方法表示抽象方法，一定要重写，这样子前后矛盾了

不允许使用 `private` 和 `abstract` 修饰同一个方法，因为private修饰的方法表示私有方法，子类不能继承与重写，但是abstract修饰的方法表示抽象方法，一定要重写，这样子前后矛盾了

不允许使用 `static` 和 `abstract` 修饰同一个方法



## 抽象类设计模板模式

模板设计模式的作用：

​	优化代码架构，提高代码的复用性，相同功能的重复代码无需反复书写！

​	可以做到部分实现，部分抽象，抽象的东西交给使用模板的人重写实现！

例如：

```java
标题固定的：《我的爸爸》

第一段固定：请介绍一下你的爸爸，说说你的爸爸有多好，说说有多牛逼。

正文部分：	抽象出来。

结尾部分：我爸爸真棒，有这样的爸爸简直太爽了，下辈子还要做他儿子。
```

模板类

```java
// 1.设计一个模板类
public abstract class Template {
    private String title = "\t\t\t\t\t\t\t\t\t《我的爸爸》";
    private String one = "\t\t请介绍一下你的爸爸，说说你的爸爸有多好，说说有多牛逼。";
    private String last = "\t\t我爸爸真棒，有这样的爸爸简直太爽了，下辈子还要做他儿子。";

    // 2.提供写作文的功能
    public void write(){
        System.out.println(title);
        System.out.println(one);
        // 3.写正文部分
        // todo 正文部分模板不能确定，需要交给具体的子类来写
        System.out.println(content());
        System.out.println(last);
    }

    // 4.定义抽象方法
    abstract String content();
}
```

具体子类

```java
public class Student extends Template{
    @Override
    String content() {
        return "我叫小明。我把是区长！！！";
    }
}
```

测试

```java
public class Main {
    public static void main(String[] args) {
        Student student = new Student();
        student.write();
    }
}
```

结果：

```java
									《我的爸爸》
		请介绍一下你的爸爸，说说你的爸爸有多好，说说有多牛逼。
我叫小明。我把是区长！！！
		我爸爸真棒，有这样的爸爸简直太爽了，下辈子还要做他儿子。
```

