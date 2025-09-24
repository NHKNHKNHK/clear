# super关键字

super：代表了父类引用

子类中想要使用被子类隐藏的成员变量或方法，可以使用super关键字

-   子类不能继承父类的构造器。因此子类想要使用父类的构造器，必须在子类构造器的第一行中使用super关键字
    -   所有子类构造器默认第一行都是 **super()**，无论写与不写
    -   如果子类想调用父类中有参构造器，则一定要在构造器第一行加上 super(....)，这里会根据参数的个数匹配到父类的构造器完成初始化



ep：

```java
class People {
    public void run() {
        System.out.println("人会跑...");
    }
}

class SpotMan extends People {
    @Override
    public void run() {
        System.out.println("运动员会跑...");
    }
    public void go(){
        super.run();    // 子类中的方法调用父类中的方法
        run();
    }
}
```

```java
class Animal {
    public Animal(){
        
    }
}

class Cat extends Animal {
    public Cat() {
        super();    // 子类构造器中调用父类的构造器
    }
}
```



## this关键字与super关键字

super关键字的用法与this关键字的用法很相似

this：代表本类的对象的引用

super：代表父类存储空间的标识（可以理解为父类对象的引用）

|              | this                                                   | super                                    |
| ------------ | ------------------------------------------------------ | ---------------------------------------- |
| 访问成员变量 | this.成员变量<br/>访问本类成员变量                     | super.成员变量<br>访问父类成员变量       |
| 访问构造器   | this() / this(...)<br>访问本类构造器（访问兄弟构造器） | super()) / super(...)<br/>访问父类构造器 |
| 访问成员方法 | this.成员方法(...)     this可省略<br>访问本类成员方法  | super.成员方法(...)<br>访问父类成员方法  |

注意：

-   this(...) 借用本类中的其他构造器

-   super(...) 借用父类的构造器

-   **this(...) 和 super(...) 必须放在构造器的第一行，否则编译错误**
-   **this(...) 和 super(...)  不能同时出现在构造器中！！**

