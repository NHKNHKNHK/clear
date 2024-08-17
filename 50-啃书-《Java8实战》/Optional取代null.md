# 1 Optional类的引入

## 1.1 Java8之前对缺失值的处理

演示：

```java
public class Person {   // 用户
    private Car car;
    public Car getCar() { return car; } // 获取车
}

public class Car {
    private Insurance insurance;
    public Insurance getInsurance() { return insurance; }  // 获取保险公司
}

public class Insurance {  // 保险
    private String name;
    public String getName() { return name; }  // 获取保险公司名称
}
```

-   未null检查之前

```java
/**
 * @return 返回车保险公司名称
 */
public String getCarInsuranceName(Person person){
    return person.getCar().getInsurance().getName();
}
```

​	上面这段代码的问题，没有进行缺失值检查，如果我们调用 erson.getCar() 时返回null，当我们调用 getInsurance() 时，就会导致运行时出现`NullPointerException`，如果getCar()返回值不为null，getInsurance()返回值为null，当调用 getName()时也会出现 `NullPointerException`

-   **采用防御式检查减少NullPointerException**

方式一：深度嵌套检查

```java
public String getCarInsuranceName(Person person){
    if (person != null){
        Car car = person.getCar();
        if (car != null){
            Insurance insurance = car.getInsurance();
            if (insurance != null){
                // 每个保险公司必然有其名字，不用在检查
                return insurance.getName();
            }
        }
    }   
    return "Unknown";
}
```

​	上面这段代码的问题，每次不确定变量是否未null时，就需要添加 if 进行嵌套，增大了代码缩进层数，也降低了代码的可读性。

方式二：使用多个退出语句的方式

```java
public String getCarInsuranceName(Person person){
    if (person ==null){     // 每个null检查都会新增一个退出点
        return "Unknown";
    }
    Car car = person.getCar();
    if (car == null){
        return "Unknown";
    }
    Insurance insurance = car.getInsurance();
    if (insurance == null){
        return "Unknown";   
    }
    return insurance.getName();
}
```

​	这种方式避免了深度递归的 if语句块

​	上面这段代码的问题，每个null检查都会新增一个退出点，我们无法确定是那个变量缺失值导致方法调用的失败，不易于代码的维护。



## 1.2 null带来的问题

-   null是错误之源
    -   NullPointerException是目前Java程序开发中最典型的异常
-   null会使得代码膨胀
    -   它会让我们的代码充斥着深度嵌套的null检查，降低代码的可读性
-   null自身是毫无意义的
    -   null自身没有任何的语义，尤其是，它代表的是静态类型语言中以一种错误的方式对缺失变量值的建模
-   null破坏了Java的哲学
    -   Java一直试图避免让程序员意识到指针的存在，唯一的例外是：null指针
-   null在Java的类型系统上开了一个口子
    -   null并不属于任何类型，这意味着它可以被赋值给任意引用类型的变量。这会导致问题，原因是当这个变量被传递到系统中的另一个部分后，我们将无法获知这个null变量最初赋值到底是什么类型

## 1.3 Optional类源码

```java
// Optional 类是 Java 8 引入的一个类，用于处理可能为空的值。它提供了一种优雅的方式来处理可能存在或不存在的值，以避免空指针异常。
package java.util;

import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

/**
 * @since 1.8
 */
public final class Optional<T> {
    private static final Optional<?> EMPTY = new Optional<>();

    private final T value;

    private Optional() {
        this.value = null;
    }

 	// 创建一个空的 Optional 对象
    public static<T> Optional<T> empty() {
        @SuppressWarnings("unchecked")
        Optional<T> t = (Optional<T>) EMPTY;
        return t;
    }

    private Optional(T value) {
        this.value = Objects.requireNonNull(value);
    }

    // 创建一个包含指定非空值的 Optional 对象。传入的值为 null，则会抛出 NullPointerException
    public static <T> Optional<T> of(T value) {
        return new Optional<>(value);
    }

 	// 创建一个包含指定值的 Optional 对象。如果传入的值为 null，则会创建一个空的 Optional 对象
    public static <T> Optional<T> ofNullable(T value) {
        return value == null ? empty() : of(value);
    }

    // 获取 Optional 对象中的值。如果 Optional 对象为空，则会抛出 NoSuchElementException
    public T get() {
        if (value == null) {
            throw new NoSuchElementException("No value present");
        }
        return value;
    }

    // 判断 Optional 对象是否包含非空值
    public boolean isPresent() {
        return value != null;
    }
	
    // 如果值存在，则执行传入的函数，否则什么也不做
    public void ifPresent(Consumer<? super T> consumer) {
        if (value != null)
            consumer.accept(value);
    }

    // 如果值存在并且满足提供的谓词，就返回包含该值的 Optional 对象，否则返回一个空的Optional对象
    public Optional<T> filter(Predicate<? super T> predicate) {
        Objects.requireNonNull(predicate);
        if (!isPresent())
            return this;
        else
            return predicate.test(value) ? this : empty();
    }
    
    // 如果值存在，就调用该值执行提供的函数
    public<U> Optional<U> map(Function<? super T, ? extends U> mapper) {
        Objects.requireNonNull(mapper);
        if (!isPresent())
            return empty();
        else {
            return Optional.ofNullable(mapper.apply(value));
        }
    }
	
    // 如果值存在，就调用该值执行提供的函数，返回一个Optional类型的值，否则返回空Optional对象
    public<U> Optional<U> flatMap(Function<? super T, Optional<U>> mapper) {
        Objects.requireNonNull(mapper);
        if (!isPresent())
            return empty();
        else {
            return Objects.requireNonNull(mapper.apply(value));
        }
    }

    // 获取 Optional 对象中的值，如果 Optional 对象为空，则返回指定的默认值
    public T orElse(T other) {
        return value != null ? value : other;
    }

    // 获取 Optional 对象中的值，如果 Optional 对象为空，则通过指定的供应函数生成一个默认值
    public T orElseGet(Supplier<? extends T> other) {
        return value != null ? value : other.get();
    }

    // 获取 Optional 对象中的值，如果 Optional 对象为空，则抛出指定的异常
    public <X extends Throwable> T orElseThrow(Supplier<? extends X> exceptionSupplier) throws X {
        if (value != null) {
            return value;
        } else {
            throw exceptionSupplier.get();
        }
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }

        if (!(obj instanceof Optional)) {
            return false;
        }

        Optional<?> other = (Optional<?>) obj;
        return Objects.equals(value, other.value);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(value);
    }
    
    @Override
    public String toString() {
        return value != null
            ? String.format("Optional[%s]", value)
            : "Optional.empty";
    }
}
```

# 2 Optional入门

java8提供了`java.util.Optional<T>`用于取代null

汲取Haskell和Scala的灵感，Java8引入了Optional类。

举例，一个人可能有也可能没有车，那么Person类中的car变量不应该声明为Car，而应该声明为Optional\<Car>

```java
private Car car;
// 转换为
private Optional<Car> car;
```

变量存在时，Optional类只是对类简单的封装；变量不存在时，缺失值会被建模成一个"空"的Optional对象，由方法`Optional.empty`返回。

接下来，我们重新定义Person、Car、Insurance类

```java
import java.util.Optional;

public class Person {   // 用户
    // 因为人可能有车，也可能没车，所以该字段声明为Optional
    private Optional<Car> car;

    public Optional<Car> getCar() {   // 获取车
        return car;
    }
}

public class Car {
    // 因为车可能买了保险，也可能没有买保险，所以该字段声明为Optional
    private Optional<Insurance> insurance;

    public Optional<Insurance> getInsurance() {   // 获取保险公司
        return insurance;
    }
}

public class Insurance {  // 保险
    // 保险公司肯定有名字，不必声明为Optional
    private String name;

    public String getName() {  // 获取保险公司名称
        return name;
    }
}
```

**null 与 Optional.empty 有本质的区别吗**？

-   从语义上，我们可以简单的当作一回事
-   但实际中差别非常大，当我们尝试解引用一个null，会触发NullPoinerException；我们使用Optional.empty 就不会有这个问题
-   Optional类是一个有效对象，很多场景都能用，并且非常有用

# 3 应用 Optional 的几种应用模式

## 3.1 创建 Optional 对象

-   **声明一个空的Optional**

通过静态工厂方法`Optional.empty`创建一个Optional对象。`Optional.empty`方法返回Optional类的特定单一实例。

```java
public static<T> Optional<T> empty() {
    @SuppressWarnings("unchecked")
    Optional<T> t = (Optional<T>) EMPTY;
    return t;
}
```

演示：

```java
// 声明一个空的Optional
@Test
public void test(){
    Optional<Car> optionalCar = Optional.empty();
    System.out.println(optionalCar);  // Optional.empty
}
```

-   **依据非空值创建一个Optional**

通过静态工厂方法`Optional.of`依据一个非空值创建一个Optional对象

```java
public static <T> Optional<T> of(T value) {
    return new Optional<>(value);
}
```

演示：

```java
// 依据非空值创建一个Optional
@Test
public void test2(){
    Optional<String> optionalStr = Optional.of("hello");
    System.out.println(optionalStr);  // Optional[hello]

    String[] strs = null;
    Optional<String[]> optionalStrs = Optional.of(strs);
    // 如果strs是一个null，则这段代码会抛出 NullPointerException
    // 而不是等到我们试图去访问strs时才会抛出异常
    System.out.println(optionalStrs);  // NullPointerException
}
```

-   **可以接受null的Optional**

通过静态工厂方法`Optional.ofNullable`创建一个允许null值的Optional对象

```java
public static <T> Optional<T> ofNullable(T value) {
    // 入参为null，创建空对象
    return value == null ? empty() : of(value);
}
```

演示：

```java
// 可以接受null的Optional
@Test
public void test3(){
    Car car = null;
    // 如果car为null，ofNullable方法会创建一个空对象
    Optional optionalCar = Optional.ofNullable(car);
    System.out.println(optionalCar);  // Optional.empty
}
```

## 3.2 使用 map 从 Optional 对象中提取和转换值

从一个对象中提取信息是比较常见的模式。为了支持这种模式，Optional提供了一个map方法

```java
// 该方法的入参是一个Function函数式接口
public<U> Optional<U> map(Function<? super T, ? extends U> mapper)
```

演示：

```java
Insurance insurance = new Insurance();
// 直接检查null
String name = null;
if (insurance != null){
    name = insurance.getName();
}
// Optional的方式
Optional<Insurance> optInsurance = Optional.ofNullable(insurance);
Optional<String> name = optInsurance.map(Insurance::getName);
System.out.println(name);
```

## 3.3 使用 flatMap 链接 Optional 对象

flatMap方法接收一个Function函数式接口，返回值是另一个流

这个方法的应用的每一个流，最终都会形成一个新的流的流。但是flatMap会用流的内容替换每一个新生成的流。

换句话说，由方法生成的各个流会被合并或者扁平化为一个单一的流。

```java
public<U> Optional<U> flatMap(Function<? super T, Optional<U>> mapper)
```

演示：

1）使用Optional获取car的保险公司名称

```java
/**
     * @return 返回车的保险公司名称
     */
public String getCarInsuranceName(Optional<Person> person){
    return person.flatMap(Person::getCar) // 类::实例方法 
        .flatMap(Car::getInsurance) 
        .map(Insurance::getName) 
        .orElse("Unknown");  // 如果Optional的结果为null，则返回默认值
}
```

2）使用Optional解引用串解的Person、Car、Insurance对象

​	从 Optional\<Person> 入手，调用flatMap\<Person::getCar> 得到  Optional\<Car> ，接着  Optional\<Car> 调用 flatMap\<Car::getInsurance> 得到 Optional\<Insurance>，最后 map(Insurance::getName) 得到 String类型的数据。

其中，返回的Optional 可能有两种情况，如果调用链上的任何一个方法返回空的Optional，那么结果就为空，否则返回的就是期望值。

## 3.4 默认行为及解引用 Optional 对象

我们可以使用osElse方法读取Optional对象中包装的值，如果Optional对象不为空则返回值，为空则返回默认值

Optional类中提供了很多读取Optional实例中变量值的方法

```java
// 这是获取Optional实例中变量值最简单但又最不安全的方法
public T get()  // 如果变量不存在，则返回 NoSuchElementException
// 除非确定变量存在，否则不建议使用该方法
// 因为这个方法相比于直接使用嵌套if检查null也未体现出多大的改进    
```

```java
// 如果变量值不存在，返回默认值 
public T orElse(T other)
```

```java
// 该方法是orElse(T other)的延迟调用版
// Supplier只有Optional对象为空时才会调用
public T orElseGet(Supplier<? extends T> other)
// 如果创建默认值非常耗费时间，建议采用此方法（提供性能）    
// 或者非常确定某个方法仅为Optional为空时才调用，也可以使用该方法    
```

```java
// 该方法与 get()类似
// 不同的是，可以定制希望抛出的异常类型
public <X extends Throwable> T orElseThrow(Supplier<? extends X> exceptionSupplier) throws X 
```

```java
// 可以在变量存在时执行传入的消费型函数Consumer，否则不执行函数
public void ifPresent(Consumer<? super T> consumer)
```

## 3.5 两个 Optional 对象的组合

假设我们有一个方法，它接受一个Person和一个Car对象，并以此为条件对外部提供的服务进行查询，通过一些复杂的业务逻辑，试图找到满足该组合的最便宜的保险公司：

```java
public Insurance findCheapestInsurance(Person person, Car car) {
        // 不同的保险公司提供的查询服务
        // 对比所有数据
        return cheapestCompany;
    }
```

下面是一个null-安全的版本

```java
public Optional<Insurance> nullSafeFindCheapestInsurance(
    Optional<Person> person, Optional<Car> car) {
    // 不同的保险公司提供的查询服务
    // 对比所有数据
    if (person.isPresent() && car.isPresent()) {
        return Optional.of(findCheapestInsurance(person.get(), car.get()));
    } else {
        return Optional.empty();
    }
}
```

这个方法的优势在于，从方法签名能清楚的知道无论是person还是car，它的值都有可能为空

但是它和null检查太相似了

下面是更优雅的版本：

```java
public Optional<Insurance> nullSafeFindCheapestInsurance(
    Optional<Person> person, Optional<Car> car) {
    return person.flatMap(p ->car.map(c -> findCheapestInsurance(p,c)));
	// flatMap方法：如果person包装的值不存在，则不会执行lambda表达式，直接返回空Optional对象
    // map方法：如果car包装的值不存在，Function函数就会返回空Optional对象，那么整个nullSafeFindCheapestInsurance方法也会返回空Optional
    // 如果两个入参都不为空，则两个值都存在，能安全调用 findCheapestInsurance(p,c)
}
```

## 3.6 使用 fliter 剔除特定的值

我们经常需要调用某个对象的方法，查询他的某个属性。比如，检查保险公司的名字是否为 ”Cambridge-Insurance“。为了以一种安全的方式进行操作，首先需要null检查，然后在调用getName方法：

``` java
// JDK8之前
Insurance insurance = ...;
if(insurance != null && "Cambridge-Insurance".equals(insurance.getName())){
    System.ot.println("ok");
}

// JDK8开始，使用Optional对象
Optional<Insurance> optInsurance = ...;
OptInsurance.filter(insurance -> 
                   "Cambridge-Insurance".equals(insurance.getName())
            .ifPresent(x -> System.ot.println("ok"));     
```

filter方法接受一个谓词作为参数。如果Optional对象的值存在，并且它符合谓词的条件，filter方法就返回其值；否则就返回空Optional对象。

# 4 注意

## 4.1 Optional无法序列化

`Optional` 类没有实现 `Serializable` 接口的设计是有意为之的。

这一点，Java语言的架构师Brain Goetz曾经非常明确的陈述过，Optional的设计初衷是用于表示可能存在或不存在的值，并且它的主要目的是解决空指针异常的问题。

由于Optional类设计时就没特别考虑将其作为类的字段使用，所以它也并未实现 `Serializable` 接口。

如果你需要将一个包含 `Optional` 对象的类进行序列化，你可以考虑将 `Optional` 对象转换为可序列化的类型，例如将其转换为一个普通的可序列化对象或使用其他序列化机制来处理。另外，你也可以考虑在序列化之前将 `Optional` 对象转换为其包含的值，以便在反序列化时重新创建 `Optional` 对象。

总之，`Optional` 类没有实现 `Serializable` 接口是出于设计考虑，以确保 `Optional` 类的语义和用途不会被误解或导致意外行为。

如果你一定需要实现序列化的域模型，作为代替方案，如下是一个演示：

```java
public class Person { 
    private Optional<Car> car;

    public Optional<Car> getCarAsOptional() {   
        return Optional.ofNullable(car);
    }
}
```

# 5 Optional 使用实战

## 5.1 用 Optional 封装可能为null的值

现在Java API几乎都是通过返回一个null的方式来表示需要值的缺失，或者由于某些原因计算无法得到该值。比如，如果Map中不含指定的键对应的值，它的get方法会返回一个null。但是现在我们大多情况下都希望返回一个Optional对象，然而我们又无法对Java类库中的源代码进行修改，所以我们可以对源码中方法的返回值进行封装为Optional。

演示：

我们有一个Map\<String, String>，如果调用get方法没有对应的key，则返回null

```java
String value = map.get("key");

// 使用Optional封装map的返回值
Optional<String> value = Optional.ofNullable(map.get("key"));
```

## 5.2 异常与 Optional 的对比

由于某种原因，方法无法返回某个值，此时除了返回null以外，Java API中比较常见的做法是抛出一个异常。例如，使用静态方法Integer.parseInt("123abc")。将String类型转换为int类型。在这里转换异常会抛出NumberFormatException。

以往我们是通过try-catch的方式处理异常，现在我们要加上Optional对象

演示：

将String类型转化为Integer类型，返回一个Optional对象

```java
public static Optional<Integer> stringToInt(String s){
	try{
        // 如果能正常的进行转换，则将结果封装到Optional
        return Optional.of(Integer.parseInt(s));
    } catch (NumberFormatException e){
        // 否则返回一个空Optioanl对象
        return Optional.empty();
    }
}
```

建议

​	可以将多个类型的方法封装到一个工具类中，例如OptionalUtility，之后可以通过OptionalUtility.stringToInt 直接调用

## 5.3 基础类型的 Optional 对象

与Stream一样，Optional也提供了类似的基础类型，例如 OptionsInt、OptionalLong、OptionalDouble

在Stream中，对于大量元素场景下，我们出于性能考虑，可以使用基础类型

但是对于Optional 而言，不建议，业务Optional对象最多包含一个值，并且 Optional 不支持 map、flatMap、filter方法

## 5.4 把所有的内容整合起来

演示：

以命令式编程的方式从属性中读取duration值

```java
public int readDuration(Properties props, String name) {
    String value = props.getProperty(name);
    if (value != null){  // 需要确保属性存在
        try {
            int i = Integer.parseInt(value);
            if (i > 0){
                return i;
            }
        } catch (NumberFormatException e){}
    }
    return 0;  // 不满足条件，返回0
}
```

显然，上面的代码实现复杂且不具备可读性

下面是使用Optional从属性中读取duration

```java
public int readDuration(Properties props, String name) {
    return Optional.ofNullable(props.getProperty(name))
        .flatMap(OptionalUtility::stringToInt)
        .fliter(i -> i > 0)
        .orElse(0);
}
```

## 5.5 工作中使用

```java
public class OptioanlTest {
    public static void main(String[] args) {
        Student student = new Student("张三");
        student = null;

        // 直接null检查，不推荐
        if (student != null) {
            String name = student.getName();
        }
        // 直接判空，代码冗余，不推荐使用
        Optional<Student> student2 = Optional.ofNullable(student);
        if (student2.isPresent()) {  // 判断是否包含非空值
            System.out.println(student2.get().getName());
        }

        // 正确操作 流式操作
        Optional.ofNullable(student).ifPresent(stu -> System.out.println(stu.getName()));
        
    }
}
```

```java
Student student = new Student("张三");
student = null;

if (student != null) {
    if (student.getAddress() != null) {
        Address address = student.getAddress();
        if (address.getCity() != null) {
            System.out.println(address.getCity());
        }
    }
}
throw new RuntimeException("存在空值");


Optional.ofNullable(student)
    .map(Student::getAddress)
    .map(Address::getCity)
    .orElseThrow(() -> new RuntimeException("存在空值"));
```



# 6 总结

-   null引用在历史上被引入到程序设计语言中，目的是为了表示变量值的缺失。（因为null实现简单，很多语言都有引入）

-   Java 8中引入了一个新的类`java.util.Optional<T>`，对存在或缺失的变量值进行建模
-   可以使用静态工厂方法Optional.empty、Optional.of 以及Optioanl.ofNullable 创建 Optioanl 对象
-   使用Optional类，能有效的防止代码中不期而至的空指针异常



