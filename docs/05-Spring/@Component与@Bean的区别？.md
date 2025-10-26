---
permalink: /spring/component-bean
---

# @Component与@Bean的区别？

## 口语化

`@Component`和`@Bean` 都是非常常用的将类注册到Spring容器中的注解。

`@Component`标记在类上，需要配合`@ComponentScan`注解使用，Spring 会自动扫描指定包及其子包中的所有类，找到带有`@Component`注解的类，并将它们注册为 Bean。

`@Bean`标记在方法上，方法所在的类通常需要用`@Configuration`注解标记。不需要扫描，主动的注入到 spring 容器中。

它的的区别主要是：

1）用法不一样：`@Component`必须写在类上面；`@Bean`需要写在方法上面，并且通常写在`@Configuration`标记的配置类中

2）用途不一样：`@Bean`有两个特殊的用途，一：自己控制bean的实例化过程；二：`@Bean`可以配置一些第三方Jar包的bean注入到Spring容器中；而`@Component`它是由Spring通过反射的方式默认调用无参构造器来进行实例化

:::info 思考
`@Bean`注解为什么需要写在`@Configuration`标记的配置类中？

`@Bean`方法不写在`@Configuration`标记的配置类中也可以，具体查看： [【@Bean写在配置类与@Bean不写在配置类中的区别】](./@Bean写在配置类与@Bean不写在配置类中的区别)

:::

## 区别

### **用途不同**

- `@Component`是一个通用组件，可用于普通的Java类、业务逻辑组件、持久化对象、工具类等

- `@Bean`通常用于配置类上的方法上面，表示将该方法的返回对象注册到SpringIOC容器中，通常**用于显示声明**，而不是通过类路径扫描

### **使用方式不同**

- `@Component`是一个类级别的注解，Spring通过`@ComponentScan`注解扫描`@Component`注解修饰的类，并将该类的实例对象到注册到SpringIOC容器中

- `@Bean`用于配置类在的方法上面，用于在配置类中声明和配置Bean

### **控制权不同**

- `@Component`修饰的类是由Spring框架通过反射的方式创建和初始化的

- `@Bean`允许开发者自定义Bean的创建和配置过程，包括指定Bean的名称、作用域、依赖关系等
  - 所以Bean注解更加的灵活

## 扩展

- 一般情况下我们是不需要手动书写`@ComponentScan`注解的，因为Spring程序的启动类上的`@SpringBootApplication`注解是一个组合注解，包含了`@ComponentScan`注解

- 通常情况下，包扫描路径也是不需要配置的。默认情况下，Spring会扫描启动类所在的包及其子包下的所有类，并自动将符合条件的类注册为Bean。
  - 如果需要指定扫描的包路径，可以使用如下方式：

```java
@SpringBootApplication(scanBasePackages = {"com.clear.xxx"})
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}


// 或

// 可以同时使用@ComponentScan注解和@SpringBootApplication注解，但是不建议，idea直接提示不建议
@ComponentScan(basePackages = {"com.clear.xxx"})
@SpringBootApplication
public class Application { 
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```
