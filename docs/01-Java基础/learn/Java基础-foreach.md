# foreach循环

## foreach 循环 

foreach 循环（也称增强 for 循环）是 **JDK5.0** 中定义的一个高级 for 循环，专门用来 **遍历数组和集合** 的。 

foreach 循环的语法格式：

```java
for(元素的数据类型 局部变量 : collection){//collection必须为数组或实现了Iterable接口的类对象  
	// 操作局部变量的输出操作
}
// 这里局部变量就是一个临时变量，自己命名就可以
```

说明：

- 针对集合来说，**编译器简单地将 foreach循环 转换为带有迭代器的循环**。（即**foreach的底层是迭代器**）

- **foreach循环，可以处理任何实现了  `Iterable<T>` 接口的对象**，这个接口只包含了一个抽象方法：

```java
package java.lang;

public interface Iterable<T> {

    Iterator<T> iterator();
}
```

​**Collection接口继承了 Iterable 接口。因此，对于标准库中的任何集合都可以使用foreach循环**。当然，也可以不使用循环，而使用 forEachRemaining(Consumer<? super E> action) 方法，并提供一个Lambda表达式以达到遍历的效果，如：

```java
iterator.forEachRemaining(element -> 略)
```

​	增强for循环的执行过程中，是将集合或数组中的元素依次赋值给临时的变量。**注意，循环体中对临时变量的修改，可能不会导致原有数组或集合中元素的修改。**例如，如下就是一个修改不成功的案例：

```java
@Test
public void test22(){
    String[] arr = new String[]{"AA","BB","CC"};
    System.out.println(Arrays.toString(arr));  // [AA, BB, CC]
    for (String s :arr){
        s ="c";
    }
    System.out.println(Arrays.toString(arr));  // [AA, BB, CC]
}
```

