# 为什么Java需要引入自动装箱、拆箱

Java类型要么是引用类型（比如Byte、Integer、Object、List），要么是原始类型（比如int、double、byte、char）。

但是**泛型（比如`Consumer<T>`中的T）只能绑定到引用类型**。这是由泛型内部的实现方式造成的。

因此，在Java里有一个将**原始类型转换为对应的引用类型的机制**。这个机制叫作**装箱（boxing）**。相反的操作，也就是将**引用类型转换为对应的原始类型，叫作拆箱**（unboxing）。

Java还有一个自动装箱机制来帮助程序员执行这一任务：**装箱和拆箱操作是自动完成的**。

## 自动装箱示例

例如，这就是为什么下面的代码是有效的（一个int被装箱成为Integer）：

```java
List<Integer> list = new ArrayList<>(); 
for (int i = 300; i < 400; i++){ 
    list.add(i); 
}
```

但这在性能方面是要付出代价的。**装箱后的值本质上就是把原始类型包裹起来，并保存在堆里**。因此，装箱后的值需要更多的内存，并需要额外的内存搜索来获取被包裹的原始值。 

## Java8为中的特例

​	Java 8 函数式接口带来了一个专门的版本，以便在**输入和输出都是原始类型时避免自动装箱的操作。**

比如，在下面的代码中，使用IntPredicate就避免了对值1000进行装箱操作，但要是用`Predicate<Integer>`就会把参数1000装箱到一个Integer对象中：

```java
public interface IntPredicate{ 
 boolean test(int t); 
} 

IntPredicate evenNumbers = (int i) -> i % 2 == 0; 
evenNumbers.test(1000); 
Predicate<Integer> oddNumbers = (Integer i) -> i % 2 == 1;
oddNumbers.test(1000);
```

## 基本类型自动装箱为包装类

```java
/**
 * 基本类型包装类
 */
public class IntegerDemo {
    public static void main(String[] args) {
        // 将基本类型自动装箱为包装类
        int a = 11;
        Integer A = a;  // 自动装箱
        System.out.println(A);

        Integer b = 11;
        int b2 = b;  // 自动拆箱
        System.out.println(b);
        System.out.println("=======================");
        // 包装类可以把基本数据类型转为字符串形式（鸡肋语法）
        // 可以与 + "" 运算替代
        Double i2 = 99.1;
        String rs = i2.toString();  // 转为了字符串形式
        System.out.println(rs + 1);

        String rs2 = Double.toString(i2); // 转为了字符串形式
        System.out.println(rs2+1);

        // 直接用 + 连接成字符串
        System.out.println(i2 + "");

        // 解析字符串成整数、浮点数
        Integer.parseInt("222");
        //Integer.parseInt("222.4");  // NumberFormatException

        Double.parseDouble("222.4");
        //Double.parseDouble("222.4sss");  // NumberFormatException

        // 上述的  Integer.parseInt("222");   Double.parseDouble("222.4"); 也可以用valueOf()代替
        Integer.valueOf("2222");
        Double.valueOf("222.4");
    }
}
```

## 基本数据类型存入集合中进行的自动装箱

```java
public class Test1 {
    // 说明：集合中不能存储基本数据类型：存入基本数据类型会自动装箱
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();

        list.add(3); // 自动装箱，等价于   list.add(Integer.valueOf(3));
        //list.add(Integer.valueOf(3));

        System.out.println(list.get(0));  // 自动拆箱，等价于   list.get(0).intValue();
        //list.get(0).intValue();
    }
}
```

## 泛型中不能放入基本数据类型

```java
public class Test2 {
    public static void main(String[] args) {
        // 编译错误，类型参数（泛型）不能为基本数据类型
        List<int> list = new ArrayList<>();
    }
}
```

## 理解数据类型不能自动装箱

数据值可以自动装箱

```java
int i = 5;
Integer j = i;  // 自动装箱
```

数据类型不能自动装箱

例如

```java
Integer.class
int.class
// 显然不是同一个类，不能装箱
```
