# 泛型

## **1. 泛型概述**  

### 1.1 泛型的引入

​	在泛型之前，程序员必须使用Object编写适用于多种类型的代码，这很繁琐，也很不安全。随着泛型的引入，Java有了一个表述能力很强的类型系统。

在 Java 中，我们在声明方法时，当在完成方法功能时如果有未知的数据需要参与，这些未知的数据需要在调用法时才能确定，那么我们把这样的数据通过形参表示。在方法体中，用这个形参名来代表那个未知的数据，而调用者在调用时，对应的传入实参就可以了。 

受以上启发，**JDK1.5** 设计了泛型的概念。**泛型即为类型参数**，这个类型参数在声明它的类、接口或方法中，代表未知的某种通用类型。 

**举例 1：**

集合类在设计阶段/声明阶段不能确定这个容器到底实际存的是什么类型的对象，所以**在 JDK5.0 之前只能把元素类型设计为 Object，JDK5.0 时 Java 引入了 “参数化类型（Parameterized type）”的概念，允许我们在创建集合时指定集合元素的类型**。比如：`List<String>`，这表明该 List 只能保存字符串类型的对象。 

使用集合存储数据时，除了元素的类型不确定，其他部分是确定的（例如关于这个元素如何保存，如何管理等）。 

**举例 2：** 

`java.lang.Comparable` 接口和 `java.util.Comparator` 接口，是用于比较对象大小的接口。这两个接口只是限定了当一个对象大于另一个对象时返回正整数，小于返回负整数，等于返回 0，但是并不确定是什么类型的对象比较大 小。JDK5.0 之前只能用 Object 类型表示，使用时既麻烦又不安全，因此 JDK5.0 给它们增加了泛型。其中`<T>`就是类型参数，即泛型。所谓泛型，就是允许在定义类、接口时通过一个标识表示类中某个属 性的类型或者是某个方法的返回值或参数的类型。这个类型参数将在使用时（例如，继承或实现这个接口、创建对象或调用方法时）确定（即传入实际的类型参数，也称为类型实参）。 

### 1.2 为什么要设计泛型

**类型参数的好处**

以ArrayList为例：

​	在Java引入泛型前，泛型程序设计是使用继承来实现的。ArrayList类只维护一个Object引用的数组：

```java
public class ArrayLsit // 在泛型类之前
{
    private Object[] elementData;
    ...
        
    public Object get(int i){...}    
    public void add(Object o){...}    
}
```

这种做法存在两个问题：

当获取值时必须进行强制类型转换。

```java
ArrayList list = new ArrayList();
...
String str = (String) list.get(0);    
```

此外，这里没有进行错误检查。我们可以向数组列表（ArrayList）中添加任何类型地元素。

```java
list.add(6);
```

对于这种添加方式，编译和运行都不会报错，不过但我们要进行强制类型转换为 String时，就可能会报错`ClassCastException`

泛型的出现，提供了更好的解决方案：类型参数（type parameter）。可以指定ArrayList类只能有一种类型，提高了代码的阅读性：

```java
ArrayList<String> list = new ArrayList()<String>;  // 这样一眼就知道当前集合只能存储String类型的数据

ArrayList<String> list = new ArrayList()<>;  // jdk7的菱形语法，可省略右边的类型，由编译器自动推断 
```

有了泛型之后，编译器可以推断出数据的类型，但我们调用 get方法时，不再需要强制类型转换：

```java
String str = list.get(0);  
```

并且，编译器也会进行语法检查，防止插入错误的数据类型：

```java
list.add(6);  // 编译错误
```

参数类型的魅力所在：

​	主要目的是为了**提高代码的重用性和类型安全性**。它可以让我们在编译时检查类型的一致性，并在编译时捕获一些类型错误，从而减少运行时错误

## **2 使用泛型举例**  

​	自从 **JDK5.0 引入泛型**的概念之后，对之前核心类库中的 API 做了很大的修改，例如：**JDK5.0 改写了集合框架中的全部接口和类、java.lang.Comparable 接口、java.util.Comparator 接口、Class 类等**。为这些接口、类增加了泛型支持，从而可以在声明变量、创建对象时传入类型实参。 

### **2.1 集合中使用泛型** 

**2.1.1 举例**  

**集合中没有使用泛型时：** 

```java
// 在引入泛型之前
@Test
public void test0() {
    // 我们创建一个ArrayList，并且打算在里面存放Integer类型的数据
    ArrayList list = new ArrayList();	// 向下兼容。jdk5.0之前集合是没有声明泛型的
    list.add(56); // 自动装箱
    list.add(76);
    list.add(88);
    list.add(89);

    // 当添加非 Integer 类型数据时，编译通过
    list.add("Tom");
    Iterator iterator = list.iterator();
    // 遍历List
    while (iterator.hasNext()) {
        // 需要强制类型转换
        Integer score = (Integer) iterator.next();  // 运行时报错 ClassCastException: java.lang.String cannot be cast to java.lang.Integer
        System.out.println(score);
    }
}
```

**集合中使用泛型时：**

​	Java 泛型可以保证如果程序在编译时没有发出警告，运行时就不会产生 ClassCastException 异常。即，**把不安全的因素在编译期间就排除了**，而不是运行期；既然通过了编译，那么类型一定是符合要求的， 就避免了类型转换。同时，**代码更加简洁、健壮**。 

**把一个集合中的内容限制为一个特定的数据类型，这就是 generic 背后的核心思想。** 

```java
// 泛型在List中的使用
@Test
public void test1() {
    // 标准写法：
    //ArrayList<Integer> list = new ArrayList<Integer>();
    //jdk7 的新特性：类型推断(菱形语法)
    ArrayList<Integer> list = new ArrayList<>();	
    list.add(56); // 自动装箱
    list.add(76);
    list.add(88);
    list.add(89);

    // 当添加非 Integer 类型数据时，编译不通过
    // list.add("Tom"); //编译报错
    Iterator<Integer> iterator = list.iterator();
    while (iterator.hasNext()) {
        // 不需要强转，直接可以获取添加时的元素的数据类型
        Integer score = iterator.next();
        System.out.println(score);
    }
}

//泛型在 Map 中的使用
@Test
public void test2() {
    HashMap<String, Integer> map = new HashMap<>();
    map.put("Tom", 67);
    map.put("Jim", 56);
    map.put("Rose", 88);
    //编译不通过
    // map.put(67,"Jack");

    //遍历 key 集
    Set<String> keySet = map.keySet();
    for (String str : keySet) {
        System.out.println(str);
    }

    //遍历 value 集
    Collection<Integer> values = map.values();
    Iterator<Integer> iterator = values.iterator();
    while (iterator.hasNext()) {
        Integer value = iterator.next();
        System.out.println(value);
    }

    //遍历 entry 集
    Set<Map.Entry<String, Integer>> entrySet = map.entrySet();
    Iterator<Map.Entry<String, Integer>> iterator1 = entrySet.iterator();
    while (iterator1.hasNext()) {
        Map.Entry<String, Integer> entry = iterator1.next();
        String key = entry.getKey();
        Integer value = entry.getValue();
        System.out.println(key + ":" + value);
    }
}
```



### 2.2 比较器中使用泛型

```java
class Circle {
    private double radius;
    public Circle(double radius) {
        super();
        this.radius = radius;
    }

    public double getRadius() {
        return radius;
    }

    public void setRadius(double radius) {
        this.radius = radius;
    }

    @Override
    public String toString() {
        return "Circle [radius=" + radius + "]";
    }
}
```

使用泛型之前： 

```java
class CircleComparator implements Comparator {

    @Override
    public int compare(Object o1, Object o2) {
        //强制类型转换
        Circle c1 = (Circle) o1;
        Circle c2 = (Circle) o2;
        return Double.compare(c1.getRadius(), c2.getRadius());
    }
}
```

测试：

```java
@Test
public void test1() {
    CircleComparator com = new CircleComparator();
    System.out.println(com.compare(new Circle(1), new Circle(2)));

    System.out.println(com.compare("圆 1", "圆 2"));  //运行时异常：ClassCastException
}
```

使用泛型之后： 

```java
// 使用了泛型
class CircleComparator1 implements Comparator<Circle> {
    @Override
    public int compare(Circle o1, Circle o2) {
        //不再需要强制类型转换，代码更简洁
        return Double.compare(o1.getRadius(), o2.getRadius());
    }
}
```

测试：

```java
@Test
public void test2() {
    CircleComparator1 com = new CircleComparator1();

    System.out.println(com.compare(new Circle(1), new Circle(2)));
    //System.out.println(com.compare("圆 1", "圆 2"));
    //编译错误，因为"圆 1", "圆 2"不是 Circle 类型，是 String 类型，编译器提前报错，而不是冒着风险在运行时再报错。
    // 将错误提前到编译时，提高代码健壮性
}
```


### 2.3 相关使用说明

在创建集合对象的时候，可以指明泛型的类型。 

具体格式为：

```java
List<...> list = new ArrayList<...>(); 
```

JDK7.0 时，有新特性，可以简写为： 

```java
List<...> list = new ArrayList<>();  // 类型推断 
```

**泛型，也称为泛型参数，即参数的类型**，**只能使用引用数据类型进行赋值**。（不能使用基本数据类型，可以使用包装类替换） 

集合声明时，声明泛型参数。在使用集合时，可以具体指明泛型的类型。一旦指明，类或接口内部，凡是使用泛型参数的位置，都指定为具体的参数类型。如果没有指明的话，看做是 Object 类型。 

## 3 自定义泛型结构 

### **3.1 泛型的基础说明** 

**1、`<类型>`这种语法形式就叫泛型。** 

-   `<类型>` 的形式我们称为**类型参数**，这里的"类型"习惯上使用 T 表示，是 Type 的缩写。即：。 
-   ：代表未知的数据类型，我们可以指定为，，等。 
    -   类比方法的参数的概念，我们把，称为类型形参，将称为类型实参，有助于我们理解泛型 
-   这里的 T，可以替换成 K，V 等任意字母。 


**2、在哪里可以声明类型变量`<T>`** 

-   **声明类或接口时**，在类名或接口名后面声明泛型类型，我们把这样的类或接口称为泛型类或泛型接口。 

```java
[修饰符] class 类名<类型变量列表> [extends 父类] [implements 接口们]{
	// 声明了类、接口的泛型参数以后，就可以在类的内部使用该泛型参数
}    
```

```java
[修饰符] interface 接口名<类型变量列表> [implements 接口们]{ 

} 
```

 例如：

```java
public class ArrayList<E> 
public interface Map<K,V>{
 ....
}
```

-   **声明方法时**，在【修饰符】与返回值类型之间声明类型变量，我们把声明了类型变量的方法，称为泛型方法。 

```java
[修饰符] <类型变量列表> 返回值类型 方法名([形参列表]) [throws 异常列表]{ 
	//...
} 
```

建议：

​	声明泛型时，常见做法时将**类型变量使用大写字母**，并且简短。

​	Java库使用**变量E** 表示**集合的元素类型**。

​	**K 和 V** 分别表示**键 和 值**的类型。

​	**T** 表示**任意类型**。（必要时还可以使用T相连的字母 U 和 S）

### 3.2 自定义泛型类\泛型接口

​	当我们在类或接口中定义某个成员时，该成员的相关类型是不确定的，而这个类型需要在使用这个类或接口时才可以确定，那么我们可以使用泛型类、泛型接口。 

简单来说，**泛型类（generic class）就是有一个或多个类型变量的类**。

**说明**  

1）我们在声明完自定义泛型类以后，可以在类的内部（比如：属性、方法、构造器中）使用类的泛型。

2）我们在创建自定义泛型类的对象时，可以指明泛型参数类型。**一旦指明，内部凡是使用类的泛型参数的位置，都具体化为指定的类的泛型类型。** 

3）如果在创建自定义泛型类的对象时**，没有指明泛型参数类型，那么泛型将被擦除，泛型对应的类型均按照 Object 处理，但不等价于 Object**。 

经验：

​	泛型要使用一路都用。要不用，一路都不要用。 

4）**泛型的指定中必须使用引用数据类型**。不能使用基本数据类型，此时只能使用包装类替换。 

5）除创建泛型类对象外，**子类继承泛型类时、实现类实现泛型接口时，也可以确定泛型结构中的泛型参数**。 

如果我们在给泛型类提供子类时，**子类也不确定泛型的类型，则可以继续使用泛型参数**。 

**我们还可以在现有的父类的泛型参数的基础上，新增泛型参数**。 

**注意**  

1）**泛型类可能有多个参数**，此时应将多个参数一起放在尖括号内。

​	比如： <E1,E2,E3> 

2）JDK7.0 开始，泛型的简化操作：ArrayList flist = new ArrayList<>(); 

3）如果泛型结构是一个接口或抽象类，则不可创建泛型类的对象。 

4）不能使用 new E[]。但是可以：E[] elements = (E[])new Object[capacity];

​	参考：ArrayList 源码中声明：Object[] elementData，而非泛型参数类型数组。 

5）在类/接口上声明的泛型，在本类或本接口中即代表某种类型，但**不可以在静态方法中使用类的泛型。** ，但是在静态方法中可以声明泛型。

6）**异常类不能是带泛型的。** （例如：不能在try-catch语句中使用泛型）

例1：

```java
// 泛型类可以引入一个或多个类型变量
public class Person<T> {
    // 使用 T 类型定义变量
    private T info;

    // 使用 T 类型定义构造器
    public Person() {
    }

    public Person(T info) {
        this.info = info;
    }

    // 使用 T 类型定义一般方法
    public T getInfo() {
        return info;
    }

    public void setInfo(T info) {
        this.info = info;
    }


    // fixme static 的方法中不能声明泛型
    public static void show(T t) {	// 编译错误

    }

    // fixme 不能在 try-catch 中使用泛型定义
    public void test() {
        try {

        } catch (MyException<T> ex) {	// 编译错误

        }
    }
}
```

例2：

```java
public class Father<T1, T2> {  // 泛型类引入两个类型变量
}

// 子类不保留父类的泛型
// 1)没有类型 擦除
class Son1 extends Father {	// 继承时没有声明泛型，即默认为Object
    						// Son1 没有泛型，不是泛型类
    // 等价于 class Son1 extends Father<Object,Object>{}
}

// 2)具体类型
class Son2 extends Father<Integer, String> {
}

// 子类保留父类的泛型
// 1)全部保留
class Son3<T1, T2> extends Father<T1, T2> {	 //	延续父类的泛型
}

// 2)部分保留
class Son4<T2> extends Father<Integer, T2> {
}

// 1)全部保留，并且在现有的父类的泛型参数的基础上，新增泛型参数
class Son5<T1, T2, A, B> extends Father<T1, T2> {	
}
// 2)部分保留，并且在现有的父类的泛型参数的基础上，新增泛型参数
class Son6<T2, A, B> extends Father<Integer, T2> {
}
```



### 3.3 自定义泛型方法

​	如果我们定义类、接口时没有使用`<泛型参数>`，但是**某个方法形参类型不确定时，这个方法可以单独定义`<泛型参数>`。** 

说明

-   泛型方法的格式： 

```java
[访问权限] <泛型> 返回值类型 方法名([泛型标识 参数名称]) [抛出的异常]{ 
  	// 通常在形参列表或返回值类型的位置会出现泛型参数（类型参数）
}

public <E> E method(E e){
      
}
```

-   方法，也可以被泛型化，与其所在的类是否是泛型类没有关系。 
-   泛型方法中的泛型参数在方法被调用时确定。 
    -   **在调用一个泛型方法时，需要在方法名前的尖括号 `<>` 中放入具体的类型**
    -   在大多数情况下，方法名前的尖括号 `<>` 可以省略。编译器有足够的信息能够推断所调用的方法。
    -   在Lambda中使用泛型方法时，注意需要在方法名前的尖括号 `<>` 中放入具体的类型
-   泛型方法**可以**根据需要，**声明为 static 的。** 

注意：

​	**==泛型方法可以定义在普通类中，也可以定义在泛型类中==**

​	**类型变量一般放在 修饰符之后，返回值类型之前**

例1：

```java
// 在普通类中声明泛型方法
public class DAO {
    // 泛型方法
    public <E> E get(int id, E e) {
        E result = null;
        return result;
    }
}
```

测试

```java
class Test {
    public static void main(String[] args) {
        // 调用泛型方法
        DAO dao = new DAO();
        // 调用泛型方法时，可以把具体的类型声明在 <> 中，放置在方法名前面
        dao.<String>get(10086,"666");
    }
}
```

例2：

```java
// 在静态方法中声明泛型
public static <T> void fromArrayToCollection(T[] a, Collection<T> c) {
    for (T o : a) {
        c.add(o);
    }
}

public static void main(String[] args) {
    Object[] ao = new Object[100];
    Collection<Object> co = new ArrayList<>();
    fromArrayToCollection(ao, co);
    String[] sa = new String[20];
    Collection<String> cs = new ArrayList<>();
    fromArrayToCollection(sa, cs);
    Collection<Double> cd = new ArrayList<>();
    // 下面代码中 T 是 Double 类，但 sa 是 String 类型，编译错误。
    //fromArrayToCollection(sa, cd);
    // 下面代码中 T 是 Object 类型，sa 是 String 类型，可以赋值成功。
    fromArrayToCollection(sa, co);
}
```

例3：

```java
public class GenericityDemo {
    public static void main(String[] args) {
        String[] names = {"早上", "晚上", "白天"};
        printArray(names);
        String[] name = null;
        printArray(name);
        Integer[] ages = {12, 24, 69};
        printArray(ages);
        int[] nums = {1,2,3,4};
        // printArray(nums);  // 编译错误，因为 int[]不是对象数组
    }

    // 泛型方法
    public static <T> void printArray(T[] arr) {
        if (arr == null) {
            System.out.println(arr);
            return;
        }
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < arr.length; i++) {
            sb.append(arr[i]).append(i == arr.length - 1 ? "" : ",");
        }
        sb.append("]");
        System.out.println(sb.toString());
    }
}
```

## 4  泛型在继承上的体现

如果 B 是 A 的一个子类型（子类或者子接口），而 G 是具有泛型声明的类或接口，G 并不是 G 的子类型！ 

比如：String 是 Object 的子类，但是 List 并不是 List 的子类。

```java
public void testGenericAndSubClass() {
    Person[] persons = null;
    Man[] mans = null;
    //Person[] 是 Man[] 的父类
    persons = mans;
    Person p = mans[0];
    // 在泛型的集合上
    List<Person> personList = null;
    List<Man> manList = null;
    //personList = manList;(报错)
}
```

**思考：对比如下两段代码有何不同：** 

片段 1： 

```java
public void printCollection(Collection c) {
    Iterator i = c.iterator();
    for (int k = 0; k < c.size(); k++) {
        System.out.println(i.next());
    }
}
```

片段 2： 

```JAVA
public void printCollection(Collection<Object> c) {
    for (Object e : c) {
        System.out.println(e);
    }
}
```

类SuperA是类A的父类，则 `G<SuperA>` 与 `G<A>` 的关系：

`G<SuperA>` 与 `G<A>`是并列的两个类，没有任何父子关系，例如：

```java
ArrayList<Object> ArrayList<String> 就没有关系
```

类SuperA是类A的父类或接口，则 `SuperA<G>` 与 `A<G>` 的关系：

`SuperA<G>` 与 `A<G>` 有继承或实现的关系。即`A<G>`的实例可以赋值给 `SuperA<G>` 类型的引用（或变量）

例如：

```java
List<String> list1 = null;
ArrayList<String> list2 = null;
list1 = list2;	// 父子关系
```



## 5. 通配符的使用 

当我们声明一个变量/形参时，这个变量/形参的类型是一个泛型类或泛型接口

例如：Comparator 类型，但是我们仍然无法确定这个泛型类或泛型接口的类型变量的具体类型，此时我们考虑使用**类型通配符 `?`** 。 

### **5.1 通配符的理解** 

使用类型通配符：`?`

比如：

```java
List<?>，Map<?,?> 
// List<?>是 List<String>、List<Object>等各种泛型 List 的父类。 
```

### **5.2 通配符的读与写** 

**写操作：** 

将任意元素加入到其中不是类型安全的： 

```java
Collection<?> c = new ArrayList<String>();
c.add(new Object()); // 编译时错误
// 特例：可以将null写入，但是这样没有意义
c.add(null);

// 不允许写入
```

因为我们不知道 c 的元素类型，我们不能向其中添加对象。add 方法有类型参数 E 作为集合的元素类型。我们传给 add 的任何参数都必须是一个未知类型的子类。因为我们不知道那是什么类型，所以**我们无法传任何东西进去。** 

**唯一可以插入的元素是 null，因为它是所有引用类型的默认值。** 

**读操作：**

另一方面，**读取 List<?>的对象 list 中的元素时，永远是安全的**，因为不管 list 的真实类型是什么，它包含的都是 Object。 

举例 1： 

```java
public class TestWildcard {
    public static void m4(Collection<?> coll){
        for (Object o : coll) {
            System.out.println(o);
        }
    }
}
```

举例 2： 

```java
public static void main(String[] args) {
    List<?> list = null;
    list = new ArrayList<String>();
    list = new ArrayList<Double>();
    // list.add(3);//编译不通过
    list.add(null);
    List<String> l1 = new ArrayList<String>();
    List<Integer> l2 = new ArrayList<Integer>();
    l1.add("迪丽热巴");
    l2.add(15);
    read(l1);
    read(l2);
}
public static void read(List<?> list) {
    for (Object o : list) {
        System.out.println(o);
    }
}
```

### 5.3 使用注意点

注意点 1：编译错误：不能用在泛型方法声明上，返回值类型前面`<>`不能使用 `?`

```java
public static <?> void test(ArrayList<?> list){
}	// 编译错误
```

注意点 2：编译错误：不能用在泛型类的声明上 

```java
class GenericTypeClass<?>{
}
```

注意点 3：编译错误：不能用在创建对象上，右边属于创建集合对象 

```java
ArrayList<?> list2 = new ArrayList<?>();  // 右边不能加 ?
```

### **5.4 有限制的通配符** 

-   **`<?>`** 

 允许所有泛型的引用调用 

-    通配符指定上限：**`<? extends 类/接口>`** 


 使用时指定的类型必须是继承某个类，或者实现某个接口，即 `<=`

-    通配符指定下限：**`<? super 类/接口>`** 


 使用时指定的类型必须是操作的类或接口，或者是操作的类的父类或接口的父接口，即 `>=`

-    说明： 

```java
<? extends Number>  // (无穷小 , Number]
// 只允许泛型为 Number 及 Number 子类的引用调用
    
<? super Number>  // [Number , 无穷大)
// 只允许泛型为 Number 及 Number 父类的引用调用
    
<? extends Comparable>
// 只允许泛型为实现 Comparable 接口的实现类的引用调用
```

例1: 

```java
class Creature{}

class Person extends Creature{}

class Man extends Person{}

class PersonTest {
    public static <T extends Person> void test(T t){
        System.out.println(t);
    }
    public static void main(String[] args) {
        test(new Person());
        test(new Man());
        // The method test(T) in the type PersonTest is not 
        // applicable for the arguments (Creature)
        test(new Creature());
    }
}
```

例2：

```java
public static void main(String[] args) {
    Collection<Integer> list1 = new ArrayList<Integer>();
    Collection<String> list2 = new ArrayList<String>();
    Collection<Number> list3 = new ArrayList<Number>();
    Collection<Object> list4 = new ArrayList<Object>();

    getElement1(list1);
    getElement1(list2);  // 报错
    getElement1(list3);
    getElement1(list4);  // 报错

    getElement2(list1);  // 报错
    getElement2(list2);  // 报错
    getElement2(list3);
    getElement2(list4);

}
// 泛型的上限：此时的泛型?，必须是 Number 类型或者 Number 类型的子类
public static void getElement1(Collection<? extends Number> col
l){}
// 泛型的下限：此时的泛型?，必须是 Number 类型或者 Number 类型的父类
public static void getElement2(Collection<? super Number> coll)
{}
```

例3：

```java
public static void printCollection1(Collection<? extends Person> coll) {
    //Iterator 只能用 Iterator<?>或 Iterator<? extends Person>.why?
    Iterator<?> iterator = coll.iterator();
    while (iterator.hasNext()) {
        Person per = iterator.next();
        System.out.println(per);
    }
}
public static void printCollection2(Collection<? super Person> coll) {
    //Iterator 只能用 Iterator<?>或 Iterator<? super Person>.why?
    Iterator<?> iterator = coll.iterator();
    while (iterator.hasNext()) {
        Object obj = iterator.next();
        System.out.println(obj);
    }
}
```

例4：

```java
@Test
public void test1(){
    //List<Object> list1 = null;
    List<Person> list2 = new ArrayList<Person>();
    //List<Student> list3 = null;
    List<? extends Person> list4 = null;
    list2.add(new Person());
    list4 = list2;
    //读取：可以读
    Person p1 = list4.get(0);
    //写入：除了 null 之外，不能写入
    list4.add(null);
    // list4.add(new Person());
    // list4.add(new Student());
}
@Test
public void test2(){
    //List<Object> list1 = null;
    List<Person> list2 = new ArrayList<Person>();
    //List<Student> list3 = null;
    List<? super Person> list5 = null;
    list2.add(new Person());
    list5 = list2;
    //读取：可以实现
    Object obj = list5.get(0);
    //写入:可以写入 Person 及 Person 子类的对象
    list5.add(new Person());
    list5.add(new Student());
}
```

### **5.5 泛型应用举例** 

#### **举例 1：泛型嵌套** 

```java
public static void main(String[] args) {
    HashMap<String, ArrayList<Citizen>> map = new HashMap<String, Arr
        ayList<Citizen>>();
    ArrayList<Citizen> list = new ArrayList<Citizen>();
    list.add(new Citizen("赵又廷"));
    list.add(new Citizen("高圆圆"));
    list.add(new Citizen("瑞亚"));
    map.put("赵又廷", list);
    Set<Entry<String, ArrayList<Citizen>>> entrySet = map.entrySet();
    Iterator<Entry<String, ArrayList<Citizen>>> iterator = entrySet.i
        terator();
    while (iterator.hasNext()) {
        Entry<String, ArrayList<Citizen>> entry = iterator.next();
        String key = entry.getKey();
        ArrayList<Citizen> value = entry.getValue();
        System.out.println("户主：" + key);
        System.out.println("家庭成员：" + value);
    }
}
```



#### **举例 2：个人信息设计**

用户在设计类的时候往往会使用类的关联关系，例如，一个人中可以定义一个信息的属性，但是一个人可能有各种各样的信息（如联系方式、基本信息 等），所以此信息属性的类型就可以通过泛型进行声明，然后只要设计相应的信息类即可。 

```java
interface Info{ // 只有此接口的子类才是表示人的信息
}
class Contact implements Info{ // 表示联系方式
    private String address ; // 联系地址
    private String telephone ; // 联系方式
    private String zipcode ; // 邮政编码
    public Contact(String address,String telephone,String zipcode){
        this.address = address;
        this.telephone = telephone;
        this.zipcode = zipcode;
    }
    public void setAddress(String address){
        this.address = address ;
    }
    public void setTelephone(String telephone){
        this.telephone = telephone ;
    }
    public void setZipcode(String zipcode){
        this.zipcode = zipcode;
    }
    public String getAddress(){
        return this.address ;
    }
    public String getTelephone(){
        return this.telephone ;
    }
    public String getZipcode(){
        return this.zipcode;
    }
    @Override
    public String toString() {
        return "Contact [address=" + address + ", telephone=" + teleph
            one
            + ", zipcode=" + zipcode + "]";
    }
}
class Introduction implements Info{
    private String name ; // 姓名
    private String sex ; // 性别
    private int age ; // 年龄
    public Introduction(String name,String sex,int age){
        this.name = name;
        this.sex = sex;
        this.age = age;
    }
    public void setName(String name){
        this.name = name ;
    }
    public void setSex(String sex){
        this.sex = sex ;
    }
    public void setAge(int age){
        this.age = age ;
    }
    public String getName(){
        return this.name ;
    }
    public String getSex(){
        return this.sex ;
    }
    public int getAge(){
        return this.age ;
    }
    @Override
    public String toString() {
        return "Introduction [name=" + name + ", sex=" + sex + ", age=
            " + age
            + "]";
    }
}
class Person<T extends Info>{	// 类型变量的限定，限制了要继承该类必须为 Info或Info的子类
    private T info ;
    public Person(T info){ // 通过构造器设置信息属性内容
        this.info = info;
    }
    public void setInfo(T info){
        this.info = info ;
    }
    public T getInfo(){
        return info ;
    }
    @Override
    public String toString() {
        return "Person [info=" + info + "]";
    }
}
public class GenericPerson{
    public static void main(String args[]){
        Person<Contact> per = null ; // 声明 Person 对象
        per = new Person<Contact>(new Contact("北京市","01088888888","102206")) ;
        System.out.println(per);
        Person<Introduction> per2 = null ; // 声明 Person 对象
        per2 = new Person<Introduction>(new Introduction("李雷","男",24));
        System.out.println(per2) ;
    }
}
```



## 6 菱形运算符 

Java 7中已经引入了**菱形运算符**（`<>`），利用泛型推断从上下文推断类型的思想（这一思想甚至可以追溯到更早的泛型方法）。一个类实例表达式可以出现在两个或更多不同的上下文中，并会像下面这样推断出适当的类型参数： 

```java
List<String> listOfStrings = new ArrayList<>();  
List<Integer> listOfIntegers = new ArrayList<>(); 
```



## 7 总结

-   泛型其实就是一个标签：`<数据类型>` 即**类型参数**
-   泛型可以在编译阶段约束只能操作某种数据类型
-   JDK1.7开始，泛型后面的声明可以省略不写
-   泛型和集合都只能支持数据类型，不支持基本数据类型

