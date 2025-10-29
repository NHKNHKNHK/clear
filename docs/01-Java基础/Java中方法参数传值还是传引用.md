# Java中方法参数传值还是传引用

>   Java语言总是按值传递的。参考：Java核心技术 4.5方法参数

先总结一下

-   基本数据类型参数的传值：传递数据值

-   引用类型参数的传值：传递地址值

在Java中，参数传递机制可以概括为**传值调用（Pass by Value）**，但其具体表现因传递的是基本数据类型还是引用数据类型而有所不同。

-   **基本数据类型**

当传递基本数据类型（如 int, float, char 等）时，方法接收的是该值的一份拷贝。因此，在方法内部对参数的修改不会影响到原始变量。

概述：传递的是数据值的拷贝

-   **引用数据类型**

对于引用数据类型（如对象、数组等），**传递的是引用的拷贝**（即内存地址的拷贝）。这意味着方法内部和外部共享**同一个对象实例**，因此如果在方法内改变对象的状态（例如修改对象的属性），这种改变会影响到原始对象。

然而，如果在方法内部重新给这个引用赋值（指向一个新的对象），这并不会影响到原始对象，因为这只是改变了该引用拷贝所指向的位置。

```java
public static void main(String[] args) {
    StringBuilder sb = new StringBuilder("Hello");
    reassignReference(sb);
    System.out.println(sb.toString()); // 输出"Hello"
}

public static void reassignReference(StringBuilder str) {
    str = new StringBuilder("World");
}
```

所以，Java中的参数传递是传值调用，但对于引用数据类型，传递的是引用的值（即内存地址），这使得方法可以操作原始对象的内容，但不能更改原始引用本身指向的对象。



demo

```java
public static void changeValue1(int age) {
    age = 10;
}
public static void changeValue2(Person person) {
    person.setPersonName("xxx");
}
public static void changeValue3(String str) {
    str = "xxx";
}

public static void main(String[] args) {
    int age = 20;
    changeValue1(age);
    System.out.println(age); // 20 因为基本类型，传值拷贝，方法内部对参数的修改不会影响到原始变量

    Person person = new Person("abc");
    changeValue2(person);
    System.out.println(person.getPersonName()); // xxx 引用类型，传递引用拷贝，方法内改变对象的状态，会影响到原始对象。

    String str = "abc";
    changeValue3(str);
    System.out.println(str); // abc 因为方法内部重新给这个引用赋值（指向一个新的对象），这并不会影响到原始对象，因为这只是改变了该引用拷贝所指向的位置
}

class Person {
    private Integer id;
    private String personName;

    public Person(String personName) {
        this.personName = personName;
    }

    // getter、setter
} 
```


