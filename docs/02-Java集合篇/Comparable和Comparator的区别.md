# Comparable 和 Comparator 的区别?

在Java中经常会涉及到对象数组的排序问题，那么就涉及到对象之间的比较问题

比如：加入到TreeSet集合的元素，加入到TreeMap集合的key等都需要进行比较以得知排序规则

​			对象数组中的对象也需要使用比较器来进行排序等

Java 实现对象排序的方式有两种： 

-   **自然排序：java.lang.Comparable** 
-   **定制排序：java.util.Comparator**

​	`Comparable`接口是一个泛型接口，它定义了一个`compareTo`方法，用于比较当前对象与另一个对象的顺序。实现`Comparable`接口的类可以通过实现`compareTo`方法来定义对象之间的自然排序。例如，`String`类实现了`Comparable`接口，因此可以使用`compareTo`方法对字符串进行比较。

​	`Comparator`接口也是一个泛型接口，它定义了一个`compare`方法，用于比较两个对象的顺序。与`Comparable`不同的是，`Comparator`接口是一个独立的比较器，它可以用于对任意类的对象进行比较，而不需要修改类的源代码。通过实现`Comparator`接口，可以定义多种不同的比较规则。例如，可以创建一个`Comparator`来按照对象的某个属性进行排序，而不是使用对象的自然排序。

​	总结来说，`Comparable`接口用于定义对象的自然排序，而`Comparator`接口用于定义对象的其他比较规则。`Comparable`接口的`compareTo`方法是对象自身的方法，而`Comparator`接口的`compare`方法是独立于对象的方法。


## Comparable接口：自然排序

1、**Comparable接口：自然排序：java.lang.Comparable**

```java
package java.lang;

// Since:1.2
public interface Comparable<T> {
  
    public int compareTo(T o);
}
```

-   Comparable 接口强行对实现它的每个类的对象进行整体排序。这种排序被称为类的 **自然排序**。 
-   实现 Comparable 的类必须实现 `compareTo(Object obj)` 方法，两个对象即通过 compareTo(Object obj) 方法的返回值来比较大小。
    -   如果当前对象 this **大于**形参对象 obj，则返回**正整数**
    -   如果当前对象 this **小于**形参对象 obj，则返回**负整数**
    -   如果当前对象 this **等于**形参对象 obj，则返回**零**

-   实现 Comparable 接口的对象列表（或数组）可以通过 **Collections.sort** 或 **Arrays.sort** 进行自动排序。实现此接口的对象可以用作有序映射中的键或有序集合中的元素，无需指定比较器。 	
-   对于类 C 的每一个 e1 和 e2 来说，当且仅当 e1.compareTo(e2) == 0 与 e1.equals(e2) 具有相同的 boolean 值时，类 C 的自然排序才叫做与 equals 一致。建议（虽然不是必需的）*最好使自然排序与* *equals* *一致*。 
-   Comparable 的典型实现：(**默认都是从小到大排列的**) 
    -   String：按照字符串中字符的 Unicode 值进行比较 
    -   Character：按照字符的 Unicode 值来进行比较 
    -   数值类型对应的包装类以及 BigInteger、BigDecimal：按照它们对应的数值大小进行比较 
    -   Boolean：true 对应的包装类实例大于 false 对应的包装类实例 
    -   Date、Time 等：后面的日期时间比前面的日期时间大


### **实现 Comparable  接口的方式**

-   具体的类A实现 Comparable  接口
-   重写 Comparable 接口的抽象方法 compareTo(T o)，在此方法中指明比较类A的对象的大小标准
-   创建类A的实例，进行大小比较或排序

示例：

```java
public class Student implements Comparable<Student> {
    private String username;
    private int age;

    public Student(String username, int age) {
        this.username = username;
        this.age = age;
    }
	
	// 省略了get set 和 toString 方法

    /**
     * 指定排序规则：按照Student类的age从小到大排序
     * 如果返回值是正数，this更大
     * 如果返回值是负数，o更大
     * 如果返回值是0，一样大
     *
     * @param o
     * @return
     */
    @Override
    public int compareTo(Student o) {
        if (o == this) {
            return 0;
        }
        if (o instanceof Student) {
            return Integer.compare(this.getAge(), o.getAge());
        }
        // 手动抛出一个异常类的对象
        throw new RuntimeException("类型不匹配");
    }
}
```

测试

```java
public class TestComparable {
    public static void main(String[] args) {
        Student[] students = new Student[5];
        students[0] = new Student("张三", 18);
        students[1] = new Student("李四", 19);
        students[2] = new Student("王五", 20);
        students[3] = new Student("赵六", 15);
        students[4] = new Student("枸杞", 21);
        // 排序
        Arrays.sort(students);
        // 排序后
        for (Student s : students) {
            System.out.println(s);
        }

        Student s1 = students[0];
        Student s2 = students[1];
        // 比较大小
        System.out.println(s1.compareTo(s2));
    }
}
```

结果

```
Student{username='赵六', age=15}
Student{username='张三', age=18}
Student{username='李四', age=19}
Student{username='王五', age=20}
Student{username='枸杞', age=21}
-1
```

## Comparator接口：定制排序

2、**Comparator接口：定制排序：java.util.Comparator**

```java
package java.util;
    
// Since:1.2
@FunctionalInterface
public interface Comparator<T> {

    public int compareTo(T o);
    
    boolean equals(Object obj);

 
    // since 1.8
    default Comparator<T> reversed() {
        return Collections.reverseOrder(this);
    }
}

```

-   思考  
    -   当元素的类型没有实现 java.lang.Comparable 接口而又不方便修改代码 （例如：一些第三方的类，你只有.class 文件，没有源文件） 
    -   如果一个类，实现了 Comparable 接口，也指定了两个对象的比较大小的规则，但是此时此刻我不想按照它预定义的方法比较大小，但是我又不能随意修改，因为会影响其他地方的使用，怎么办？ 

-   JDK 在设计类库之初，也考虑到这种情况，所以又增加了一个 **java.util.Comparator** 接口。强行**对多个对象进行整体排序的比较**。 
    -   重写 compare(Object o1,Object o2)方法，比较 o1 和 o2 的大小：如果方法返回正整数，则表示 o1 大于 o2；如果返回 0，表示相等；返回负整数，表示 o1 小于 o2。 
    -   可以将 Comparator 传递给 sort 方法（如 Collections.sort 或 Arrays.sort），从而允许在排序顺序上实现精确控制。 

### **实现 Comparator  接口的方式**

-   创建一个实现了 Comparable  接口的实现类A
-   实现类A要求**重写 Comparable 接口的抽象方法 compare(T o1, T o2)**，在此方法中指明比较类A的对象的大小标准
-   创建此实现类A的实例，并将此对象传入相关方法的参数位置即可。（例如，Arrays.sort(...,类A的实例）

示例：

```java
import java.util.Arrays;
import java.util.Comparator;

public class TestComparator {
    public static void main(String[] args) {
        Student[] students = new Student[5];
        students[0] = new Student("张三", 18);
        students[1] = new Student("李四", 19);
        students[2] = new Student("王五", 20);
        students[3] = new Student("赵六", 15);
        students[4] = new Student("枸杞", 21);

        // 排序：Student类实现了 Comparable 接口，如果直接排序的话，那就只能自然排序了
        // 我们现在想要根据 age 倒序排序
        // 那么就需要实现 Comparator 接口，实现类对象
        Arrays.sort(students, new Comparator<Student>() {
            @Override
            public int compare(Student o1, Student o2) {
                //按照 age 倒序排序
                if (o1 instanceof Student && o2 instanceof Student) {
                    return -Integer.compare(o1.getAge(), o2.getAge());
                }
                throw new RuntimeException("类型不匹配");
            }
        });
        // 排序后
        for (Student s : students) {
            System.out.println(s);
        }
    }
}
```

结果

```
Student{username='枸杞', age=21}
Student{username='王五', age=20}
Student{username='李四', age=19}
Student{username='张三', age=18}
Student{username='赵六', age=15}
```


## **主要区别**

-   **接口实现位置**：
    -   Comparable：对象类自身实现Comparable接口，定义其**自然排序**顺序。
    -   Comparator：单独的类或匿名类实现Comparator接口，定义**自定义排序**顺序。

-  **方法名称**：
    - Comparable：实现compareTo方法。
    - Comparator：实现compare方法。

-   **排序标准**：
    - Comparable：只能有一个排序标准（自然顺序）。
    - Comparator：可以有多个排序标准，可以根据需要定义不同的Comparator实现。

-   **使用场景**：
    -   Comparable：适用于单一的自然排序顺序，例如字典顺序、数字顺序等。
    -   Comparator：适用于需要多个排序标准的场景，例如按名字排序、按年龄排序等。

通过上述说明和示例代码，你可以清楚地了解Comparable和Comparator的区别及其使用方法
