# Jdk新特性

## JDK8（LTS）

JDK 8 是 Java 历史上的里程碑版本，引入大量函数式编程特性，彻底改变 Java 代码风格

**正式特性**

-   Lambda
-   函数式接口
-   Stream API
-   方法引用
-   接口默认方法和静态方法
-   Optional
-   新的日期时间 API
-   重复注解
-   类型注解

**其他特性**

-   Nashorn Javascript引擎
-   并行数组操作
-   Base64编码解码操作
-   紧凑配置文件

### Lambda 表达式

简化匿名内部类的编写，将 “行为” 作为参数传递（函数式编程基础），语法为 `(参数) -> 表达式/代码块`。

```java
import java.util.Arrays;
import java.util.List;

public class LambdaDemo {
    public static void main(String[] args) {
        List<String> list = Arrays.asList("apple", "banana", "cherry");
        
        // 传统匿名内部类（排序）
        list.sort((String a, String b) -> a.length() - b.length());
        
        // 简化 Lambda（编译器推断参数类型）
        list.sort((a, b) -> a.length() - b.length());
        
        System.out.println(list); // 输出：[apple, banana, cherry]（按长度排序）
    }
}
```

:::tip
Scala 早于 Java 支持 匿名函数 和 函数作为一等公民（如 `(a: String, b: String) => a.length - b.length`），Lambda 表达式的设计直接参考了 Scala 的函数语法。
:::

### 方法引用（Method References）

方法引用和构造器引用是为了简化Lambda表达式的。

例如：MybatisPlus

```java
LambdaQueryWrapper<User> lambdaQueryWrapper = new LambdaQueryWrapper<>();
lambdaQueryWrapper.eq(User::getId, 1);
```

### Stream API

简化集合 / 数组的批量操作（过滤、映射、聚合等），支持 链式调用 和 并行处理，避免手动迭代（“for 循环”）。

```java
import java.util.Arrays;
import java.util.List;

public class StreamDemo {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);
        
        // 串行流：筛选偶数 → 求和
        int sum = numbers.stream()
                        .filter(n -> n % 2 == 0) // 过滤偶数
                        .mapToInt(Integer::intValue) // 转换为 int 流
                        .sum(); // 求和
        
        System.out.println(sum); // 输出：12（2+4+6）
        
        // 并行流（仅需将 stream() 改为 parallelStream()）
        int parallelSum = numbers.parallelStream() // 底层使用Fork/Join实现并行处理
                                .filter(n -> n % 2 == 0)
                                .mapToInt(Integer::intValue)
                                .sum();

        System.out.println(parallelSum); // 输出：12
    }
}
```

:::tip
Scala 的 `Collection API`（如 `filter`、`map`、`reduce`）是 Stream API 的重要参考，Scala 早在 2003 年就支持类似的链式集合操作，且原生支持并行集合（`par` 方法）。

优势：比 Scala 更易上手：Java 开发者无需学习 Scala 的 “伴生对象、隐式转换” 等复杂概念，直接基于现有语法扩展
:::

### 接口默认方法和静态方法

接口允许定义带实现的方法（用 default 修饰），解决接口升级时 “子类必须实现新方法” 的兼容问题

接口允许定义静态方法，

```java
public interface MyInterface {
    // 抽象方法（必须由子类实现）
    void abstractMethod();
    
    // 默认方法（自带实现，子类可重写）
    default void defaultMethod() {
        System.out.println("接口的默认方法");
    }
}

class MyImpl implements MyInterface {
    @Override
    public void abstractMethod() {
        System.out.println("实现抽象方法");
    }
}

public class DefaultMethodDemo {
    public static void main(String[] args) {
        MyInterface obj = new MyImpl();
        obj.abstractMethod(); // 输出：实现抽象方法
        obj.defaultMethod();  // 输出：接口的默认方法
    }
}
```

### Optional 类

封装 “可能为 null 的值”，避免直接操作 null 导致的 `NullPointerException`（NPE），提供 `ifPresent`、`orElse`等安全方法。

```java
import java.util.Optional;

public class OptionalDemo {
    public static void main(String[] args) {
        // 创建 Optional（不能为 null）
        Optional<String> nonNullOpt = Optional.of("Hello");
        // 创建 Optional（允许 null 值）
        Optional<String> nullOpt = Optional.ofNullable(null);
        
        // 安全获取值：存在则打印，不存在则忽略
        nonNullOpt.ifPresent(System.out::println); // 输出：Hello
        nullOpt.ifPresent(System.out::println);    // 无输出
        
        // 不存在时返回默认值
        String value = nullOpt.orElse("Default Value");
        System.out.println(value); // 输出：Default Value
    }
}
```

### 日期时间 API（java.time）

替代旧的 Date/Calendar（线程不安全、API 混乱），提供 线程安全、不可变 的日期时间类（如 LocalDate、LocalTime、Instant）。

```java
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class DateTimeDemo {
    public static void main(String[] args) {
        // 获取当前日期
        LocalDate today = LocalDate.now();
        System.out.println("今天：" + today); // 输出：今天：2024-xx-xx（动态日期）
        
        // 格式化日期
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy年MM月dd日");
        String formattedDate = today.format(formatter);
        System.out.println("格式化后：" + formattedDate); // 输出：格式化后：2024年xx月xx日
        
        // 计算3天后的日期
        LocalDate next3Days = today.plusDays(3);
        System.out.println("3天后：" + next3Days.format(formatter)); // 输出：3天后：2024年xx月xx日
    }
}
```

## JDK9

模块化（解决 “Jar 地狱”），同时增强接口和集合 API

**正式特性**

-   模块化
-   集合工厂方法
-   Jshell
-   HTML5 Javadoc
-   Javadoc 搜索
-   紧凑字符串
-   Stack-Walk API
-   并发更新

### 模块化

代码按 “模块” 划分，明确模块间的依赖关系和访问权限（控制哪些类可以被外部访问），解决大型项目依赖混乱问题

1.定义模块（创建 module-info.java 文件）

```java 
// 模块名：com.example.user
module com.example.user {
    // 导出 com.example.user 包（外部可访问）
    exports com.example.user;
    // 依赖其他模块（如 java.base 是默认依赖，无需显式声明）
    requires com.example.common;
}
```

2.模块内的类（com.example.user.User.java）

```java
package com.example.user;
public class User {
    private String name;
    // getter/setter/toString
}
```

:::warning
现代开发中，大多数情况下我们都会使用构建工具（如 Maven、Gradle）来管理依赖，而不是手动操作模块化。
:::

### JShell

交互式编程环境，允许直接在命令行中编写和执行 Java 代码片段。

```bash
jshell> System.out.println("Hello, JShell!");
|  欢迎使用 JShell! 对于帮助，请键入: help 或 /?
|  输入表达式、声明或语句并按下 Enter 查看结果...

Hello, JShell!
|  已定义一个新变量 /1 => Hello, JShell!
```

### 私有接口方法（Private Interface Methods）

接口允许定义 private 方法，供接口内部的 `default` 方法或 `static` 方法复用（避免代码冗余）

```java
public interface MathInterface {
    default int addAndMultiply(int a, int b, int c) {
        // 调用接口私有方法
        int sum = add(a, b);
        return multiply(sum, c);
    }
    
    // 接口私有实例方法（仅接口内部可调用）
    private int add(int x, int y) {
        return x + y;
    }
    
    // 接口私有静态方法
    private static int multiply(int x, int y) {
        return x * y;
    }
}

class MathImpl implements MathInterface {}

public class PrivateMethodDemo {
    public static void main(String[] args) {
        MathInterface obj = new MathImpl();
        System.out.println(obj.addAndMultiply(2, 3, 4)); // 输出：20（(2+3)*4）
    }
}
```

### var 关键字

核心解释：简化本地变量的声明，编译器自动推断类型。

```java
import java.util.ArrayList;
import java.util.HashMap;

public class VarDemo {
    public static void main(String[] args) {
        // 推断为 ArrayList<String>
        var list = new ArrayList<String>();
        list.add("apple");
        
        // 推断为 HashMap<String, Integer>
        var map = new HashMap<String, Integer>();
        map.put("count", 10);
        
        // 推断为 int（for 循环变量）
        for (var i = 0; i < 3; i++) {
            System.out.println(list.get(i)); // 输出：apple（仅1个元素，后续循环会抛异常，此处仅演示 var）
        }
    }
}
```

### 集合静态工厂方法（List.of ()/Set.of ()/Map.of ()）

快速创建 不可变集合（替代 Collections.unmodifiableList()），语法简洁，且性能更优。

```java
import java.util.List;
import java.util.Map;
import java.util.Set;

public class CollectionFactoryDemo {
    public static void main(String[] args) {
        // 创建不可变 List
        List<String> list = List.of("a", "b", "c");
        // list.add("d"); // 抛出 UnsupportedOperationException（不可修改）
        
        // 创建不可变 Set
        Set<Integer> set = Set.of(1, 2, 3);
        
        // 创建不可变 Map（最多支持 10 个键值对，超过用 Map.ofEntries()）
        Map<String, Integer> map = Map.of("one", 1, "two", 2);
        
        System.out.println(list); // 输出：[a, b, c]
        System.out.println(set);  // 输出：[1, 2, 3]
        System.out.println(map);  // 输出：{one=1, two=2}
    }
}
```

### 改进 try-with-resources

```java

```

## JDK 10（2018）

局部变量类型推断（var 关键字）
核心解释：局部变量无需显式声明类型，编译器根据赋值语句自动推断类型（如` var list = new ArrayList<String>()` 推断为 `ArrayList<String>`），简化代码。
限制：仅支持 局部变量（方法内、for 循环变量等），不支持成员变量、方法参数、返回值。

```java
import java.util.ArrayList;
import java.util.HashMap;

public class VarDemo {
    public static void main(String[] args) {
        // 推断为 ArrayList<String>
        var list = new ArrayList<String>();
        list.add("apple");
        
        // 推断为 HashMap<String, Integer>
        var map = new HashMap<String, Integer>();
        map.put("count", 10);
        
        // 推断为 int（for 循环变量）
        for (var i = 0; i < 3; i++) {
            System.out.println(list.get(i)); // 输出：apple（仅1个元素，后续循环会抛异常，此处仅演示 var）
        }
    }
}
```

## JDK 11（2018，LTS）

聚焦 “实用增强”，如 HttpClient、String 方法优化

**正式特性**

-   HttpClient
-   String 增强方法（`isBlank()`、`strip()`、`lines()`）
-   Lambda参数的局部变量语法
-   Unicode 10
-   Fight Recoder
-   启动单文件源代码程序
-   低开销堆分析

-   基于嵌套的访问控制
-   动态类文件常量
-   Epsilon无操作垃圾收集器
-   TLS 1.3

**实验特性**

-   ZGC可扩展低延迟垃圾收集器

### 标准 HttpClient（java.net.http）

替代旧的 HttpURLConnection，支持 同步 / 异步请求、HTTP/2、WebSocket，API 更简洁。

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HttpClientDemo {
    public static void main(String[] args) throws Exception {
        // 创建 HttpClient
        HttpClient client = HttpClient.newHttpClient();
        
        // 创建 GET 请求
        HttpRequest request = HttpRequest.newBuilder()
                                        .uri(URI.create("https://api.github.com/users/octocat"))
                                        .GET()
                                        .build();
        
        // 异步发送请求（非阻塞）
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
              .thenApply(HttpResponse::body) // 处理响应体
              .thenAccept(System.out::println) // 打印响应
              .join(); // 等待异步完成
    }
}
```

### String 增强方法

新增 isBlank()（判断空字符串 / 空白）、strip()（去除前后空白，支持 Unicode）、lines()（按行分割为 Stream）。

```java
public class StringEnhanceDemo {
    public static void main(String[] args) {
        String str1 = "  Hello Java 11  ";
        String str2 = "\t\n  "; // 仅空白字符
        
        // isBlank()：判断是否为空或仅空白
        System.out.println(str1.isBlank()); // 输出：false
        System.out.println(str2.isBlank()); // 输出：true
        
        // strip()：去除前后空白（比 trim() 好，处理 Unicode 空白）
        System.out.println(str1.strip()); // 输出：Hello Java 11
        
        // lines()：按行分割为 Stream
        String multiLine = "Line1\nLine2\nLine3";
        multiLine.lines().forEach(System.out::println); 
        // 输出：
        // Line1
        // Line2
        // Line3
    }
}
```

## JDK 12（2019）

核心是 Switch 表达式预览，以及数字格式化增强

**正式特性**

-   微基准测试套件
-   JVM常量API
-   一个AArch64端口，而不是两个
-   默认CDS归档
-   G1的可中止混合收集
-   从G1及时返回未使用的已提交内存

**预览特性**

-   Switch表达式

**实验特性**

-   Shenandoah：低暂停时间垃圾收集器

### Switch 表达式

Switch 从 “语句” 升级为 “表达式”（可返回值），支持 箭头语法（case A -> 结果），无需手动写 break（避免 fall-through 问题）

```java
public class SwitchExpressionDemo {
    public static void main(String[] args) {
        String day = "MON";
        
        // 传统 Switch 语句（需 break）
        String type1;
        switch (day) {
            case "MON": case "TUE": case "WED": case "THU": case "FRI":
                type1 = "工作日";
                break;
            case "SAT": case "SUN":
                type1 = "周末";
                break;
            default:
                type1 = "无效日期";
        }
        
        // 预览版 Switch 表达式（箭头语法，返回值）
        String type2 = switch (day) {
            case "MON", "TUE", "WED", "THU", "FRI" -> "工作日";
            case "SAT", "SUN" -> "周末";
            default -> "无效日期";
        };
        
        System.out.println(type1); // 输出：工作日
        System.out.println(type2); // 输出：工作日
    }
}
```

### 数字紧凑格式化（CompactNumberFormat）

将大数字格式化为 “紧凑形式”（如 1000 → "1K"，1000000 → "1M"），支持多语言。

```java
import java.text.NumberFormat;
import java.util.Locale;

public class CompactNumberDemo {
    public static void main(String[] args) {
        // 创建英文环境的紧凑格式化器（SHORT 模式：1K/1M；LONG 模式：1 thousand/1 million）
        NumberFormat formatter = NumberFormat.getCompactNumberInstance(Locale.US, NumberFormat.Style.SHORT);
        
        System.out.println(formatter.format(1200));    // 输出：1.2K
        System.out.println(formatter.format(1500000)); // 输出：1.5M
        
        // 中文环境
        NumberFormat chineseFormatter = NumberFormat.getCompactNumberInstance(Locale.CHINA, NumberFormat.Style.SHORT);
        System.out.println(chineseFormatter.format(1200)); // 输出：1.2千
    }
}
```

## JDK 13（2019）

核心是文本块预览，解决多行字符串转义问题

**正式特性**

-   动态CDS归档
-   ZGC取消提交未使用的内存

**预览特性**

-   Switch表达式
-   文本块

**实验特性**

-   Shenandoah：低暂停时间垃圾收集器



### 文本块（Text Blocks，预览）

用 `"""` 包裹多行字符串，无需手动添加 \n 或 \" 转义，适合 SQL、JSON、HTML 等场景。

```java
public class TextBlockDemo {
    public static void main(String[] args) {
        // 传统多行字符串（需转义）
        String json1 = "{\n" +
                       "  \"name\": \"Alice\",\n" +
                       "  \"age\": 25\n" +
                       "}";
        
        // 预览版文本块（无需转义）
        String json2 = """
                       {
                         "name": "Alice",
                         "age": 25
                       }
                       """;
        
        System.out.println(json1);
        System.out.println(json2);
        // 两者输出相同：
        // {
        //   "name": "Alice",
        //   "age": 25
        // }
    }
}
```

### Switch 表达式增强（预览）

补充 yield 关键字，用于在代码块中返回 Switch 表达式的结果（箭头语法适合单行，yield 适合多行逻辑）。

```java
public class SwitchYieldDemo {
    public static void main(String[] args) {
        int num = 3;
        String result = switch (num) {
            case 1, 2 -> "小数字"; // 单行用箭头
            case 3, 4, 5 -> {
                System.out.println("处理中...");
                yield "中数字"; // 多行用 yield 返回
            }
            default -> "大数字";
        };
        System.out.println(result); // 输出：处理中... 中数字
    }
}
```

## JDK 14（2020）

**正式特性**

-   Switch转正
-   G1的NUMA感知内存分配
-   JFR事件流
-   非易失性映射字节缓冲区
-   空指针异常（NPE）增强
-   弃用 Solaris 和 SPARC 端口
-   删除并发标记扫描（CMS）垃圾收集器
-   macOS上的ZGC
-   window上的ZGC
-   删除Pack200工具和API

**预览特性**

-   instanceof的模式匹配
-   Record 

**孵化器特性**

-   打包工具
-   外部内存访问 API

### Record（预览）

自动生成 equals()、hashCode()、toString()、全参构造器和 getter 方法，用于快速定义 “数据载体类”（仅存数据，无复杂逻辑）

```java
// 定义 Record（自动生成 equals、hashCode、toString、构造器、getName()、getAge()）
record Person(String name, int age) {}

public class RecordDemo {
    public static void main(String[] args) {
        Person alice = new Person("Alice", 25);
        Person bob = new Person("Bob", 30);
        
        System.out.println(alice); // 输出：Person[name=Alice, age=25]（自动 toString）
        System.out.println(alice.name()); // 输出：Alice（自动 getter，无 setXxx，Record 不可变）
        System.out.println(alice.equals(bob)); // 输出：false（自动 equals）
    }
}
```

:::tip
Record 直接参考 Scala 的 Case Class。Scala 的 Case Class 会自动生成 equals、hashCode、toString、copy 方法和伴生对象，且支持模式匹配，与 Record 的设计目标完全一致（简化数据类定义）。

优势：Record不会生成伴生对象，避免额外内存开销，且更符合 Java 开发者的 “极简数据载体” 需求（补充：Java中也没有伴生对象的概念）
:::

###  Switch 表达式转正

JDK 12 预览的 Switch 表达式（箭头语法、返回值）正式成为标准特性，无需开启预览模式。

### 空指针异常（NPE）增强

NPE 错误信息更详细，明确指出 “哪个变量为 null”，避免排查困难

```java
public class NpeEnhanceDemo {
    public static void main(String[] args) {
        String str = null;
        // 触发 NPE
        System.out.println(str.length());
        // JDK 14 前错误信息：java.lang.NullPointerException
        // JDK 14 后错误信息：java.lang.NullPointerException: Cannot invoke "String.length()" because "str" is null
    }
}
```


## JDK 15（2020）

文本块转正和密封类预览。

**正式特性**

-   文本块正
-   Edwards曲线数字签名算法（EdDSA）
-   隐藏类
-   删除Nashorn Javascript引擎
-   重新实现传统DatagramSocket API
-   禁用和弃用偏向锁定
-   ZGC可扩展低延迟垃圾收集器
-   Shenandoah低暂停垃圾收集器
-   删除Solairs和SPARC端口
-   弃用RMI激活以供删除

**预览特性**

-   密封类
-   Records（二次预览）
-   instanceof的模式匹配（二次预览）

**孵化器特性**

-   外部内存访问 AP（二次孵化）

### 文本块转正

JDK 13/14 预览的文本块正式成为标准特性，支持 `\s` （自动补全空白）和 `\`（取消换行）。

```java
public class TextBlockFinalDemo {
    public static void main(String[] args) {
        // \s 自动补全空白，\ 取消换行
        String sql = """
                     SELECT id, name \
                     FROM user \
                     WHERE age > 18\s
                     """;
        System.out.println(sql);
        // 输出：
        // SELECT id, name FROM user WHERE age > 18 
    }
}
```

### 密封类（Sealed Classes，预览）

限制类的继承关系，仅允许 指定的子类 继承（避免不可控的子类扩展），用 sealed 修饰类，permits 指定子类。

```java
// 密封类：仅允许 Circle、Square 继承
sealed class Shape permits Circle, Square {}

// 子类必须用 final（不可再继承）或 sealed（继续限制）修饰
final class Circle extends Shape {}
final class Square extends Shape {}

// 错误：不允许其他类继承 Shape
// class Triangle extends Shape {}
```

:::tip
密封类参考 Scala 的 Sealed Trait/Class。Scala 中 sealed 修饰的类 /trait 只能在 同一文件 中被继承，且子类必须是已知的，与 Java 密封类的 “限制继承范围” 设计理念一致。

JDK17密封类优势：

- 比 Scala Sealed Class 更灵活：Scala 密封类要求子类在 同一文件，而 Java 密封类支持子类在不同文件（只需模块导出）
:::

## JDK 16（2021）

核心是 Record 转正、密封类增强和模式匹配预览。

**正式特性**

-   Record 转正
-   instanceof的模式匹配 转正
-   启用C++14语言特性
-   从Mercurial迁移到Git
-   迁移到GitHub
-   ZGC并发线程堆栈处理
-   Unix域套接字通道
-   Alpine Linux端口
-   弹性元空间
-   window/AArch64端口
-   基于值的类的警告
-   打包工具
-   默认强封装JDK内部

**预览特性**

-   密封类（二次预览）

**孵化器特性**

-   外部内存访问 AP（三次孵化）
-   向量API
-   外部链接器API



### Record 转正

核心解释：JDK 14 预览的 Record 正式成为标准特性，支持自定义构造器（需调用全参构造器）。

```java
record Person(String name, int age) {
    // 自定义构造器（必须调用全参构造器）
    public Person {
        if (age < 0) {
            throw new IllegalArgumentException("年龄不能为负");
        }
    }
}

public class RecordFinalDemo {
    public static void main(String[] args) {
        new Person("Alice", -5); // 抛出 IllegalArgumentException
    }
}
```

### Pattern Matching for instanceof（预览）

`instanceof` 检查通过后，自动将对象强转为目标类型，无需手动写 (Type) obj。

```java
public class InstanceofPatternDemo {
    public static void printLength(Object obj) {
        // 传统写法：先检查，再强转
        if (obj instanceof String) {
            String s = (String) obj;
            System.out.println(s.length());
        }
        
        // 预览版模式匹配：检查+强转一步完成
        if (obj instanceof String s) {
            System.out.println(s.length()); // 直接使用 s
        }
    }

    public static void main(String[] args) {
        printLength("Hello JDK 16"); // 输出：12（两次）
    }
}
```

## JDK 17（2021，LTS）

Java 17 是继 JDK 8 后的又一重要 LTS 版本，转正了密封类、模式匹配 instanceof 等关键特性。

**正式特性**

-   密封类 转正
-   强封装JDK内部
-   恢复始终严格的浮点语义
-   增强的伪随机数生成器
-   新的macOS渲染管道
-   macOS/AArch64端口
-   弃用Applet API以供删除
-   删除RMI激活
-   删除实验性AOT和JIT编译器
-   弃用安全管理器以供删除
-   上下文特性的反序列化过滤器

**预览特性**

-   Switch的模式匹配

**孵化器特性**

-   向量API（二次孵化）
-   外部函数和内存 API

### 密封类转正

核心解释：JDK 15/16 预览的密封类正式成为标准特性，支持密封接口，子类可在不同文件（需模块导出）。

```java
// 密封接口：仅允许 Dog、Cat 实现
sealed interface Animal permits Dog, Cat {}

// 子类用 final 修饰（不可再扩展）
final class Dog implements Animal {}
final class Cat implements Animal {}

public class SealedClassFinalDemo {
    public static void main(String[] args) {
        Animal dog = new Dog();
        System.out.println(dog instanceof Dog); // 输出：true
    }
}
```

### Pattern Matching for instanceof 转正

JDK 16 预览的 instanceof 模式匹配正式成为标准特性，无需开启预览模式。

同 JDK 16 的 instanceof 示例，仅需移除预览配置。

### Switch 模式匹配（预览）

Switch 支持 类型模式（如 case String s），可直接匹配对象类型并强转，替代多层 instanceof。

```java
public class SwitchPatternDemo {
    public static void printValue(Object obj) {
        String result = switch (obj) {
            case Integer i -> "整数：" + i;
            case String s -> "字符串：" + s;
            case Double d -> "浮点数：" + d;
            default -> "未知类型";
        };
        System.out.println(result);
    }

    public static void main(String[] args) {
        printValue(100);    // 输出：整数：100
        printValue("Java"); // 输出：字符串：Java
    }
}
```

## JDK 18（2022）

核心是 UTF-8 默认字符集和简单 Web 服务器。

**正式特性**

-   字符集默认为 UTF-8
-   简单 Web 服务器
-   Java API文档中的代码片段
-   使用方法句柄重新实现核心反射
-   互联网地址解析SPI

**预览特性**

-   Switch的模式匹配（二次预览）

**孵化器特性**

-   向量API（三次孵化）
-   外部函数和内存 API（二次孵化）

### UTF-8 作为默认字符集

替代 “平台依赖的默认字符集”（如 Windows 是 GBK，Linux 是 UTF-8），统一跨平台字符处理，避免乱码。

```java
import java.nio.charset.Charset;

public class Utf8DefaultDemo {
    public static void main(String[] args) {
        // 获取默认字符集（JDK 18 前：平台依赖；JDK 18 后：UTF-8）
        Charset defaultCharset = Charset.defaultCharset();
        System.out.println(defaultCharset); // 输出：UTF-8
    }
}
```

### 简单 Web 服务器（Simple Web Server）

轻量级 HTTP 服务器（仅用于测试 / 演示，不适合生产），支持静态文件服务和自定义处理器。

```java
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;

public class SimpleWebServerDemo {
    public static void main(String[] args) throws Exception {
        // 创建服务器，绑定 8080 端口
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        
        // 注册请求处理器（处理 /hello 路径）
        server.createContext("/hello", exchange -> {
            String response = "Hello, JDK 18 Web Server!";
            exchange.sendResponseHeaders(200, response.getBytes().length);
            exchange.getResponseBody().write(response.getBytes());
            exchange.close();
        });
        
        server.start();
        System.out.println("服务器启动：http://localhost:8080/hello");
    }
}
```

## JDK 19（2022）

核心是虚拟线程（轻量级线程）预览，彻底改变 Java 并发编程模型。

**正式特性**

-   Linux/RISC-V 端口

**预览特性**

-   Record 模式匹配
-   Switch的模式匹配（三次预览）
-   虚拟线程
-   外部函数和内存 API

**孵化器特性**

-   向量API（四次孵化）
-   结构化并发


### 虚拟线程（Virtual Threads，预览）

核心解释：轻量级线程（由 JVM 管理，而非 OS 内核），创建成本极低（可创建百万级线程），支持高并发，无需手动维护线程池。

```java
import java.util.concurrent.Executors;

public class VirtualThreadDemo {
    public static void main(String[] args) throws InterruptedException {
        // 创建“每个任务一个虚拟线程”的执行器
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            // 提交 10000 个任务（每个任务一个虚拟线程）
            for (int i = 0; i < 10000; i++) {
                int finalI = i;
                executor.submit(() -> {
                    System.out.println("任务 " + finalI + " 运行中");
                    return finalI;
                });
            }
        } // 执行器关闭时，自动等待所有虚拟线程完成
    }
}
```

:::tip
其他语言并发的优势

- Go Goroutine：基于 M:N 调度（用户态线程映射到内核线程），创建成本仅几 KB 栈空间，支持百万级并发，无需手动管理线程池。
- Python Asyncio：通过协程（Coroutine）实现 “单线程内并发”，避免线程切换开销，但需手动写 `async/await` 语法，且受 GIL 限制（多线程无法利用多核）

Java 虚拟线程

- 核心改进：虚拟线程是 JVM 管理的 “用户态线程”（M:N 调度），创建成本极低（栈空间动态伸缩，初始仅 100+ KB），支持 千万级并发，且完全兼容现有 Java 并发 API（如 Runnable、ExecutorService）

- 优势
  - 比 Go Goroutine 更易迁移：Java 开发者无需学习新的并发模型（如 Go 的 channel），直接将现有 `Runnable` 任务提交到 `Executors.newVirtualThreadPerTaskExecutor()` 即可，迁移成本几乎为 0。
  - 比 Python Asyncio 更强：虚拟线程可利用多核（无 GIL 限制），且无需手动写 `async/await`（避免 “回调地狱”），同步代码即可享受高并发性能。
:::

### Switch 模式匹配增强（预览）

支持 guard 条件（when 关键字），在模式匹配后添加额外判断。

```java
public class SwitchGuardDemo {
    public static void printNumber(Object obj) {
        switch (obj) {
            case Integer i when i > 0 -> System.out.println("正整数：" + i);
            case Integer i when i < 0 -> System.out.println("负整数：" + i);
            case Integer i -> System.out.println("零：" + i);
            default -> System.out.println("非整数");
        }
    }

    public static void main(String[] args) {
        printNumber(10);  // 输出：正整数：10
        printNumber(-5);  // 输出：负整数：-5
        printNumber(0);   // 输出：零：0
    }
}
```

## JDK 20（2023）

核心是虚拟线程二次预览和 Record 模式匹配预览

**预览特性**

-   Record 模式匹配（二次预览）
-   Switch的模式匹配（四次预览）
-   虚拟线程（二次预览）
-   外部函数和内存 API（二次预览）

**孵化器特性**

-   向量API（五次孵化）
-   结构化并发（二次孵化）
-   作用域值


### 虚拟线程（预览，第二次）

修复 JDK 19 预览中的问题，增强与现有 API 的兼容性（如 Thread.sleep() 优化）。

示例代码：同 JDK 19 虚拟线程示例，功能更稳定。

### Record 模式匹配（预览）

支持对 Record 进行 解构模式匹配，直接提取 Record 的字段值，无需调用 getter。

```java
record Point(int x, int y) {}

public class RecordPatternDemo {
    public static void printPoint(Object obj) {
        // 匹配 Record 并解构字段 x 和 y
        if (obj instanceof Point(int x, int y)) {
            System.out.println("Point: x=" + x + ", y=" + y);
        }
    }

    public static void main(String[] args) {
        printPoint(new Point(3, 4)); // 输出：Point: x=3, y=4
    }
}
```

## JDK 21（2023，LTS）

JDK 21 是最新 LTS 版本，转正了虚拟线程、Record 模式匹配等关键特性

**正式特性**

-   有序集合
-   分代ZGC
-   Record 模式匹配 转正
-   Switch 模式匹配 转正
-   虚拟线程 转正
-   弃用window 32位x86端口以供删除
-   准备禁用代理的动态加载
-   密钥封装机制 API

**预览特性**

-   字符串模板
-   Record 模式匹配（二次预览）
-   外部函数和内存 API（三次预览）
-   未命名模式和变量
-   为命名类和实例主方法
-   作用域值
-   结构化并发
-   Switch的模式匹配（四次预览）
-   虚拟线程（二次预览）

**孵化器特性**

-   向量API（六次孵化）

### 虚拟线程转正

核心解释：JDK 19/20 预览的虚拟线程正式成为标准特性，成为 Java 并发编程的默认选择之一。
示例代码：同 JDK 19 虚拟线程示例，无需开启预览模式

### Record 模式匹配转正

核心解释：JDK 20 预览的 Record 模式匹配正式成为标准特性，支持嵌套 Record 解构。

```java
record Point(int x, int y) {}
record Circle(Point center, int radius) {}

public class NestedRecordPatternDemo {
    public static void printCircle(Object obj) {
        // 嵌套 Record 解构：Circle → Point → x/y
        if (obj instanceof Circle(Point(int x, int y), int r)) {
            System.out.println("Circle: center(" + x + "," + y + "), radius=" + r);
        }
    }

    public static void main(String[] args) {
        printCircle(new Circle(new Point(2, 3), 5)); 
        // 输出：Circle: center(2,3), radius=5
    }
}
```

### Switch 模式匹配转正

JDK 17/19 预览的 Switch 模式匹配（类型模式、guard 条件）正式成为标准特性

同 JDK 19 的 Switch 模式匹配示例，无需开启预览模式。

## JDK 22（2024）

核心是字符串模板预览和外部函数内存 API 转正。

**正式特性**

-   G1的区域固定
-   外部函数和内存 API
-   未命名模式和变量
-   启动多文件源代码程序   

**预览特性**

-   字符串模板（二次预览）
-   super(...)之前的语句
-   类文件 API
-   Stream Gatheres
-   结构化并发（二次预览）
-   隐式声明类和实例主方法 （二次预览）
-   作用域值（二次预览）

**孵化器特性**

-   向量API（七次孵化）


### 字符串模板（String Templates，预览）

替代 `String.format()` 和字符串拼接，支持嵌入表达式（如 `STR."Hello \{name}"`），更安全（避免注入攻击）、更灵活。

```java
import static java.lang.StringTemplate.STR;

public class StringTemplateDemo {
    public static void main(String[] args) {
        String name = "Java 22";
        int version = 22;
        
        // 传统字符串拼接
        String str1 = "Hello " + name + ", version: " + version;
        
        // 预览版字符串模板
        String str2 = STR."Hello \{name}, version: \{version}";
        
        System.out.println(str1); // 输出：Hello Java 22, version: 22
        System.out.println(str2); // 输出：Hello Java 22, version: 22
    }
}
```

:::tip
JDK 22 之前，Java处理字符串的方式有很多种，如 `String.format()`、字符串拼接等

`String.format()`：语法繁琐，易出错

字符串拼接：多表达式时可读性差

其他语言的字符串处理优势：

- Python f-string：直接在字符串中嵌入变量 / 表达式（`f"Age: {user.age + 1}"`），语法简洁，执行效率比 str.format() 高。
- Scala 插值：支持多种插值方式（`s"Hello $name"`、`f"Pi: $pi%.2f"`），支持复杂表达式，无需手动拼接。

Java22字符串模板的优势：

- 嵌入表达式，支持变量、方法调用、复杂运算，内置转义，避免注入攻击。

- 比 Python f-string 更安全：Python f-string 直接拼接字符串，易引发 SQL 注入（如 `f"SELECT * FROM user WHERE name = '{name}'"`），而 Java 字符串模板支持 “类型安全的模板处理器”（如 SQL 模板 `SQL."SELECT * FROM user WHERE name = \{name}"`），自动转义特殊字符。

- 比 Scala 插值更灵活：支持自定义模板处理器（如 JSON 模板、XML 模板），而 Scala 插值需手动实现隐式类，复杂度更高

:::

### 外部函数和内存 API（转正）

核心解释：JDK 17-20 孵化器 / 预览的 API 正式转正，支持安全访问 JVM 外的内存（如 native 内存）和调用外部函数（替代 JNI），性能更高、安全性更强。

示例代码（调用 C 语言的 sqrt 函数）：

```java
import java.lang.foreign.*;
import static java.lang.foreign.ValueLayout.JAVA_DOUBLE;

public class ForeignApiDemo {
    public static void main(String[] args) {
        // 加载 libm 库（C 语言数学库）
        try (var scope = Arena.openConfined()) {
            Linker linker = Linker.nativeLinker();
            SymbolLookup lookup = linker.defaultLookup();
            
            // 查找 sqrt 函数（double sqrt(double)）
            MethodHandle sqrt = linker.downcallHandle(
                lookup.find("sqrt").orElseThrow(),
                FunctionDescriptor.of(JAVA_DOUBLE, JAVA_DOUBLE)
            );
            
            // 调用 sqrt 函数
            double result = (double) sqrt.invokeExact(16.0);
            System.out.println(result); // 输出：4.0
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }
}
```

:::tip

JDK 17 之前，Java 与原生代码（C/C++）交互需依赖 JNI（Java Native Interface）—— 语法复杂、易内存泄漏、缺乏类型安全

其他语言：

- C++：直接访问原生内存（无 GC 干预），调用原生函数无需中间层，但内存管理需手动完成（易泄漏）
- Go CGO：用 `import "C"` 直接调用 C 代码，语法简洁，但需处理 Go 与 C 的内存模型差异（如 Go 垃圾回收不管理 C 内存）。

Java22的改进：

- 核心改进：通过 `Arena`（内存区域）安全管理原生内存（自动回收，避免泄漏），用 `Linker` 简洁调用外部函数（无需写 JNI 头文件），且支持编译时类型检查（避免 JNI 的运行时错误）

- 优势：
  - 比 C++ 更安全：C++ 需手动管理内存（如 `malloc/free`），易泄漏；Java 的 `Arena` 会自动回收内存（支持 `try-with-resources`），且内存访问受 JVM 安全检查（避免越界）。
  - 比 Go CGO 更高效：Go CGO 调用 C 函数时会触发 “线程切换”（Go 线程与 C 线程分离），而 Java 外部函数 API 直接与 JVM 线程模型整合，开销更低

:::


## JDK 23（2024）

**正式特性**

-   md文档注释
-   弃用`sun.misc.Unsafe`中的内存访问方法以供删除
-   ZGC默认分代模式

**预览特性**

-   字符串模板（二次预览）
-   类文件 API（二次预览）
-   Stream Gatheres（二次预览）
-   结构化并发（三次预览）
-   隐式声明类和实例主方法 （三次预览）
-   作用域值（三次预览）
-   灵活的构造函数体（二次预览）
-   模块导入声明

**孵化器特性**

-   向量API（八次孵化）


## JDK 24（2025）


**正式特性**

-   类文件 API 转正
-   Stream Gathers 转正
-   永久禁用安全管理器
-   删除window 32位x86端口
-   弃用32位x86端口以供删除
-   ZGC删除非分代模式
-   同步虚拟线程而不固定
-   链接运行时镜像而不使用JMODs
-   量子抗性模块格基密钥封装机制
-   量子抗性模块格基密钥签名算法
-   警告使用`sun.misc.Unsafe`中的内存访问API

**预览特性**

-   结构化并发（四次预览）
-   作用域值（四次预览）
-   简单源文件和实例主方法（四次预览）
-   灵活的构造函数体（二三预览）
-   模块导入声明（二次预览）
-   密钥派生函数

**实验特性**

- 分代Shenaodoah
- 紧凑对象头

**孵化器特性**

-   向量API（九次孵化）
