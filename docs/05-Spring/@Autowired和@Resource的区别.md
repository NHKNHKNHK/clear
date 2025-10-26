---
permalink: /25/9/25/spring/autowired-resource
---

# @Autowired和@Resource的区别

## 口语化

`@Autowired` 和 `@Resource` 都是依赖注入注解。在Spring环境中，两个注解的功能基本是等价的，他们都可以将bean注入到对应的字段中

但是它们的来源不一样，`@Autowired`是 Spring 框架提供的，`@Resource`是 JavaEE（JSR-250） 提供的，在`javax.annotation`包下。

第二就是它们的装配方式不一样：

- `@Resource` 默认是`按照名称`注入，名称找不到的话，再`按照类型`进行注入，如果找不到，那就为空，不报错（`@Resource`注入的允许bean为 null）

- `@Autowired` 先是`按照类型`注入。如果该类型有多个实现，就会`按照名称`注入，如果按照名称注入找不到就会报错。
  - 如果该类型有多个实现，建议可以配合`@Qualifier` 来进行使用。

:::warning
在使用`@Autowired`时，如果该类型有多个实现，就会按照名称注入，如果按照名称注入找不到就会报错。

这一点很多人都不知道或者是不清楚
:::

一般在实际工作中比较常用 `@Resource`。

## @Autowired

- `@Autowired`：自动注入，获取bean的时候，先是`byType`的方式，再是`byName`的方式
  - 如果有多个同类型的bean，则需要通过 `@Qualifier` 指定具体的bean（也就是实现按名称注入）

- **用法**：可以用于字段、构造器、Setter 方法或其他任意方法。

- **处理机制**：Spring 的`AutowiredAnnotationBeanPostProcessor`处理`@Autowired`注解。

## @Resource

`@Resource`：由 Java EE 提供（ JSR-250 定义），默认`byName`的方式，如果按名称找不到，则是`byType`的方式。（可以通过type指定按照`byType`）

- **用法**：只能用于字段或 Setter 方法。不可以用于构造器

- **属性**：可以指定name和type属性。

- **处理机制**：Spring 的`CommonAnnotationBeanPostProcessor`处理`@Resource`注解。

## 区别

### **注入方式**

- `@Autowired`：默认`按类型`注入。如果需要`按名称`注入，可以结合`@Qualifier`注解使用。
- `@Resource`：默认`按名称`注入。如果名称匹配失败，则按类型注入。

### 作用域不同

- `@Autowired`可以作用在字段、构造器、Setter 方法或其他任意方法上
- `@Resource`只可以使用在字段、Setter 方法上

### **属性**

- `@Autowired`：没有name和type属性，但可以使用`@Qualifier`指定名称。
- `@Resource`：有name和type属性，可以明确指定要注入的 Bean 名称或类型。

### 兼容性 | 适用范围

- `@Autowired`：是 Spring 框架特有的注解。与Spring强相关，如果做容器迁移，是需要修改代码的
- `@Resource`：是 Java 标准注解，兼容性更广，适用于任何支持 JSR-250 的容器。假如系统容器从Spring迁移到其他IOC容器中，是不需要修改代码的

### 默认要求不同

- `@Autowired`注解默认要求要注入的Bean必须存在，如果找不到匹配的Bean会抛出异常。
- `@Resource`注解默认允许注入的Bean可以缺失，如果找不到匹配的Bean会使用默认值null


## 使用场景

`@Autowired`：在 Spring 应用中更为常见，尤其是在需要按类型注入的场景中。

`@Resource`：在需要兼容标准 Java EE 规范的应用中更为常见，或者在需要明确指定 Bean 名称时使用。

| 特性                 | `@Autowired`              | `@Resource`                   |
| :------------------- | :------------------------ | :---------------------------- |
| **来源**             | Spring                    | Java EE (JSR-250)             |
| **默认注入方式**     | 按类型 (`byType`)         | 按名称 (`byName`)，其次按类型 |
| **是否支持名称注入** | 可以配合 `@Qualifier`     | 直接支持                      |
| **适用范围**         | Spring Bean               | Spring Bean 和其他资源        |
| **灵活性**           | 更灵活，支持多种注入方式  | 较简单，优先按名称注入        |
| **错误处理**         | 可设置 `required = false` | 默认行为更倾向于按名称查找    |

## 示例

```java
public interface IClear {
}


@Service("clear1")
public class Clear1 implements IClear{
}


@Service("clear2")
public class Clear2 implements IClear{
}
```

### @Resource

`@Resource` 默认是`按照名称`注入，名称找不到的话，再`按照类型`进行注入。

```java{4-6}
@Component
public class Demo implements CommandLineRunner {

    // 先byName，发现没有找到bean；再byType找到两个bean：clear1、clear2，无法确定注入哪个bean，报错
    @Resource
    private IClear clear;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("-----" + clear);
    }
}
```

正确指定bean名称，就不会报错：

```java{4-6}
@Component
public class Demo implements CommandLineRunner {

    // 先byName，找到了clear1，注入成功
    @Resource
    private IClear clear1;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("-----" + clear1);
    }
}
```

显示通过 type 属性指定，按照`byType`注入：

```java{4-6}
@Component
public class Demo implements CommandLineRunner {

    // 显示指定byType，注入成功
    @Resource(type = Clear1.class)
    private IClear clear;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("-----" + clear);
    }
}
```

显示通过 name 属性指定，找到合适的bean，避免注入失败：

```java{4-6}
@Component
public class Demo implements CommandLineRunner {

    // 指定bean名称 clear1，避免注入失败
    @Resource(name = "clear1") 
    private IClear clear;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("-----" + clear); // -----com.clear.service.Clear1@1280682
    }
}
```

### @Autowired

`@Autowired` 先是`按照类型`注入。如果该类型有多个实现，就会`按照名称`注入，如果按照名称注入找不到就会报错。

```java{4-6}
@Component
public class Demo implements CommandLineRunner {

    // 先byType，找到两个bean：clear1、clear2，无法确定注入哪个bean，再byName，无法匹配，报错
    @Autowired // 默认按类型注入
    private IClear clear;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("-----" + clear);
    }
}
```

`@Autowired` 先是`按照类型`注入。当然如果你指定一个合法（存在）的bean名称，也是可以按照名称注入的。

**！！！前提是该类型有多个实现**

```java{4-6}
@Component
public class Demo implements CommandLineRunner {

    // 先byType，找到两个bean：clear1、clear2，无法确定注入哪个bean，再byName确认最后要注入的bean
    @Autowired
    private IClear clear1; // 指定bean名称 clear1

    @Override
    public void run(String... args) throws Exception {
        System.out.println("-----" + clear1); // -----com.clear.service.Clear1@3b42121d
    }
}
```

`@Autowired`可以配合`@Qualifier`注解，可以指定bean名称，避免注入失败：

```java{4-6}
@Component
public class Demo implements CommandLineRunner {

    @Autowired
    @Qualifier("clear2") // 指定bean名称 clear2
    private IClear clear; 

    @Override
    public void run(String... args) throws Exception {
        System.out.println("-----" + clear2); 
    }
}
```

如果你指定一个不存在的bean名称，就会报错，即使你配合了`@Qualifier`注解也是一样的报错

```java{4-6}
@Component
public class Demo implements CommandLineRunner {

    @Autowired
    @Qualifier("clear3") // 指定bean名称 clear3
    private IClear clear3;  

    @Override
    public void run(String... args) throws Exception {
        System.out.println("-----" + clear3); // 报错
    }
}
```
