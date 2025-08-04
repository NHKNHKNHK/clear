# equal 与 == 的区别？

-   == 运算符
    -   基本数据类型：比较两个值是否相等。
    -   引用类型（对象）：比较两个引用是否指向同一个对象（即内存地址是否相同）。

-   equals() 方法
    -   **默认**行为：对于所有对象，默认实现是继承自 Object 类的 equals() 方法，它**实际上与 == 相同**，即**比较的是引用**。
    -   **重写后**的行为：许多类（如 String、Integer 等）重写了 equals() 方法以提供更有意义的比较逻辑。例如，String 的 equals() 比较的是字符串**内容**是否相同，而不是引用。

**注意事项**

-   **自动装箱和缓存**：对于基本类型的包装类（如 Integer），当数值在 -128 到 127 之间时，Java会进行缓存，因此在这个范围内使用 == 比较可能会得到 true，但这不是推荐的做法。

```java
Integer i1 = 100;
Integer i2 = 100;
System.out.println(i1 == i2); // true (因为缓存)
```

-   **null 检查**：使用 equals() 时需要注意避免 NullPointerException。可以使用 Objects.equals() 来安全地比较可能为 null 的对象。

总结：

​	== 用于比较基本数据类型或引用是否相同，而 equals() 用于比较对象的内容是否相同（前提是该方法被正确重写）

**equal 与 == 的区别**

|          | ==                                                       | equals                                                 |
| -------- | -------------------------------------------------------- | ------------------------------------------------------ |
| 比较范围 | 可以比较基本类型、引用类型                               | 只能比较引用类型                                       |
| 比较规则 | 基本类型：比较数据值<br>引用类型：比较引用值（内存地址） | 默认：与 == 一致<br>重写后：比较内容（具体看实现方法） |

示例

```java
public class Main {
    public static void main(String[] args) {
        String s1 = new String("abc");
        String s2 = new String("abc");
        System.out.println(s1 == s2);      // false
        System.out.println(s1.equals(s2)); // true 因为String类重写了equals
        Set<String> set1 = new HashSet<>();
        Collections.addAll(set1, s1, s2); 
        System.out.println(set1.size());   // 1 因为String重写了hashCode，内容一致hash值也一致
        System.out.println("===================");

        Person p1 = new Person("abc");
        Person p2 = new Person("abc");
        System.out.println(p1 == p2);     // false
        System.out.println(p1.equals(p2));// false 因为Person类没有重写equals，实际使用的是Object中的equals方法，比较的是引用
        Set<Person> set2 = new HashSet<>();
        Collections.addAll(set2, p1, p2);
        System.out.println(set2.size());  // 2 因为Person类没有重写hashCode，实际使用的是Object中的hashCode方法 
    }
}

// ！！！注意，此类没有重写hashCode和equals方法
class Person {
    private Integer id;
    private String personName;

    public Person(String personName) {
        this.personName = personName;
    }

    // getter、setter
} 
```

