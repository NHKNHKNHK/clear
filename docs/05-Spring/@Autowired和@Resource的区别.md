# @Autowired和@Resource的区别

**口语化**

Autowired 和 Resource 都是依赖注入注解。

但是它们的来源不一样，一个是 Spring 框架提供的，一个是 JavaEE 提供的，在`javax.annotation`包下。

第二就是它们的装配方式不一样，Resource 默认是按照名称注入，名称找不到的话，会按照类型进行注入。

Autowired 主要是类型注入。如果该类型有多个实现，就会按照名称注入，如果按照名称注入找不到就会报错。

如果该类型有多个实现，建议可以配合Qualifier 来进行使用。

>   注意：
>
>    在使用Autowired时，如果该类型有多个实现，就会按照名称注入，如果按照名称注入找不到就会报错。
>
>   这一点很多人都不知道或者是不清楚

一般在实际工作中比较常用 Resource。



## **@Autowired**

@Autowrited：自动注入，按照类型自动装配，如果有多个同类型的bean，则需要通过 @Qualifier 指定具体的bean（也就是实现按名称注入）

-   **用法**：可以用于字段、构造器、Setter 方法或其他任意方法。

-   **处理机制**：Spring 的AutowiredAnnotationBeanPostProcessor处理@Autowired注解。

## **@Resource**

@Resource：由 Java EE 提供（ JSR-250 定义），默认按名称注入，如果按名称找不到，则按类型注入。

-   **用法**：可以用于字段或 Setter 方法。

-   **属性**：可以指定name和type属性。

-   **处理机制**：Spring 的CommonAnnotationBeanPostProcessor处理@Resource注解。



## **详细比较**

**注入方式**：

@Autowired：默认按类型注入。如果需要按名称注入，可以结合@Qualifier注解使用。

@Resource：默认按名称注入。如果名称匹配失败，则按类型注入。

**属性**：

@Autowired：没有name和type属性，但可以使用@Qualifier指定名称。

@Resource：有name和type属性，可以明确指定要注入的 Bean 名称或类型。

**兼容性**：

@Autowired：是 Spring 框架特有的注解。

@Resource：是 Java 标准注解，兼容性更广，适用于任何支持 JSR-250 的容器。

## **使用场景**

@Autowired：在 Spring 应用中更为常见，尤其是在需要按类型注入的场景中。

@Resource：在需要兼容标准 Java EE 规范的应用中更为常见，或者在需要明确指定 Bean 名称时使用。

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


@Service
public class Clear implements IClear{
}


@Service
public class Clear1 implements IClear{
}
```

### **Resource**

```java
@Component
public class Demo implements CommandLineRunner {

    @Resource
    private IClear clear;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("-----" + clear); // -----com.clear.service.Clear@69aa7d76
    }
}
```

Resource，默认会按照名称注入，如果想要按照类型 或者 指定名称也使用name 或 type属性指定，如下：

```java
@Component
public class Demo implements CommandLineRunner {

    @Resource(name = "clear1")
    private IClear clear;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("-----" + clear); // -----com.clear.service.Clear1@1280682
    }
}
```

### Autowired

```java
@Component
public class Demo implements CommandLineRunner {

    @Autowired
    private IClear clear;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("-----" + clear); // -----com.clear.service.Clear@41ccb3b9
    }
}
```

Autowired默认是按照类型进入注入的，当然如果你指定一个合法（存在）的bean名称，也是可以按照名称注入的。

**！！！前提是该类型有多个实现**

```java
@Component
public class Demo implements CommandLineRunner {

    @Autowired
    private IClear clear1; // 指定bean名称 clear1

    @Override
    public void run(String... args) throws Exception {
        System.out.println("-----" + clear1); // -----com.clear.service.Clear1@3b42121d
    }
}
```

如果你指定一个不存在的bean名称，就会报错，即使你配合了Qualifier注解也是一样的报错

```java
@Component
public class Demo implements CommandLineRunner {

    @Autowired
    @Qualifier("clear2") 
    private IClear clear2; // 指定bean名称 clear2 

    @Override
    public void run(String... args) throws Exception {
        System.out.println("-----" + clear2); // 报错
    }
}
```

