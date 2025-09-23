# JavaBean

**JavaBean 是一种 Java 语言写成的可重用组件。** 

​	好比你做了一个扳手，这个扳手会在很多地方被拿去用。这个扳手也提供 多种功能(你可以拿这个扳手扳、锤、撬等等)，而这个扳手就是一个组件。 

## 标准JavaBean

**所谓 JavaBean，是指符合如下标准的 Java 类：** 

1）类是公共的 

2）只是提供两个构造器

-   有一个无参的公共的构造器 （即需要显式的将无参构造器书写出来）
-   还需要一个满参数构造器

3）成员变量使用 **priavte** 修饰

3）属性有对应的 getter、setter 方法 

-   用户可以使用 JavaBean 将功能、处理、值、数据库访问和其他任何可以用 Java 代码创造的对象进行打包，并且其他的开发者可以通过内部的 JSP 页面、Servlet、其他JavaBean、applet 程序或者应用来使用这些对象。用户可以认为 JavaBean 提供了一种随时随地的复制和粘贴的功能，而不用关心任何改变。 
-   《Think in Java》中提到，JavaBean 最初是为 Java GUI 的可视化编程实现的。你拖动 IDE 构建工具创建一个 GUI 组件（如多选框），其实是工具给你创建 Java 类，并提供将类的属性暴露出来给你修改调整，将事件监听器暴露出来。 

## 演示

演示：

```java
public class JavaBean {
    private String name;  // 最好是private修饰
    private int age;
    public JavaBean(){}

    public String getName(){
        return this.name;  // this 可省略
    }
    public void setName(String name){
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```



## JavaBean的一些注意事项

**JavaBean中要求给当前类提供一个公共的空参的构造器**，有什么用？

-   作用一：子类对象在实例化时，**子类构造器的首行默认调用父类空参构造器**。否则会报错

```java
// 父类
public class Animal {
    private String name;

    public Animal(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

// 子类
public class Cat extends Animal{
    // 报错：'com.clear.Animal'中没有可用的默认构造函数。
}


// 解决方法：创建匹配父类的构造函数
public class Cat extends Animal{
    public Cat(String name) {
        super(name);
    }
}
```

-   作用二：在反射中，经常用来创建运行时类的对象。那么我们要求各个运行时类都提供一个空参构造器，便与我们编写同用的创建运行时类对象的代码。


```java
public class JavaBean {
    private String name;  // 最好是private修饰
    private int age;
    public JavaBean(){}

    public String getName(){
        return this.name;  // this 可省略
    }
    public void setName(String name){
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}


public class Main {
    public static void main(String[] args) {
        Class<Animal> clazz = Animal.class;

        try {
            // 注意：
            //	要想对象创建成功，需满足以下条件
            //		要求运行时类中必须提供空参构造器
            //		要求提供的空参构造器的权限要足够，否则报错 IllegalAccessException
            Animal animal = clazz.newInstance();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }

    }
}

// 解决方法：为JavaBean类手动添加上一个public修饰的无参构造器，即可通过newInstance()创建实例
```

## 开发经验

为什么可以使用IDEA生成对应的getter、setter、toString方法

我们也可以使用 IDEA 插件 PTG 一键生成JavaBean

还可以使用 lombok 注解生成 对应的 getter、setter、toString、构造器、equal、hashCode等方法