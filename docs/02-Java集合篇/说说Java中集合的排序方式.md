# 说说Java中集合的排序方式

`Java.util`包中的`List`接口继承自`Collection`接口，用来存放对象集合，所以对这些对象进行排序的时候，要么让对象类自己实现同类对象的比较，要么借助比较器进行比较排序。

举例：学生实体类，包含姓名和年龄属性，比较时先按姓名升序排序，如果姓名相同则按年龄升序排序。

## 实现Comparable

实体类自己实现Comparable接口比较

```java
public class Student implements Comparable<Student>{ 
    private String name; 
    private int age; 
    @Override 
    public int compareTo(Student o) {
        int flag = this.name.compareTo(o.name); 
        if(flag == 0) { 
            flag = this.age - o.age; 
        } 
        return flag; 
    } 
}

Collections.sort(students);
```

## 借助Comparator

借助比较器进行排序

```java
public class Student { 
    private String name; 
    private int age; 
}

Collections.sort(students, (o1, o2) -> {
    int flag = o1.getName().compareTo(o2.getName()); 
    if(flag == 0) { 
        flag = o1.getAge() - o2.getAge(); 
    } 
    return flag; 
}); 
```

也可以直接优化成：

```java
Collections.sort(students, Comparator.comparing(Student::getName).thenComparingInt(Student::getAge));
```

## 通过Stream

借助Stream进行排序，借助Stream的API，底层还是通过Comparable实现的。

```java
public class Student { 
    private String name; 
  private int age; 
}

// 如果Student实现了Comparable
students.stream().sorted().collect(Collectors.toList());
// 如果Student没有实现Comparable

students.stream().sorted((o1, o2) -> {
    int flag = o1.getName().compareTo(o2.getName()); 
    if(flag == 0) { 
        flag = o1.getAge() - o2.getAge(); 
    } 
    return flag; 
}).collect(Collectors.toList());
```

## 扩展

### Comparable和Comparator的区别

> [Comparable和Comparator的区别](./Comparable和Comparator的区别.md)

### 有了Comparable为什么还需要Comparator

> [有了Comparable为什么还需要Comparator](./有了Comparable为什么还需要Comparator.md)

### compareTo和equals的使用场景有何区别?

compareTo常用于排序和BigDecimal等数值的比较

equals则是常用于业务语义中两个对象是否相同，如String常常通过equals来比较是否字面意义相同

### 既然Set是无序的，还怎么排序

这里说的是两个语境的不同，Set的无序，指的是插入顺序是无序的。虽然Set的插入顺序是无序的，Set也可以基于SortedSet要求对象实现Comparable来对Set中的元素进行排序。

### Set真的是插入无序的吗

并不是，Set有一个实现类是LinkedHashSet，它引用了LinkedHashMap，通过双向链表记录了每个node的插入顺序和查询顺序（可选），以此来达到Set的插入有序性。

:::warning 注意

这里指的无序性，不是随机性，与随机性有本质区别，具体查看：[Java-集合框架-Set 主要实现类：HashSet](../01-Java基础/learn/Java-集合框架#set-anchor)

:::
