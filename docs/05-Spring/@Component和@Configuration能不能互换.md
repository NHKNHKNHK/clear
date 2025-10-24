# @Component和@Configuration能不能互换

:::tip
首先亮明观点：

`@Component`注解标记的组件可以被`Configuration`注解替换，但是不建议这么做

`@Configuration`注解标记的配置类不能被`Component`注解替换，因为多次调用`@Bean`方法会创建多个实例，破坏单例bean

类似的问题还包括：[@Controller和@Component能不能互换](./@Component、@Controller、@Repository和@Service的区别?#@Controller和@Component能不能互换)
:::

## 口语化

`@Configuration`注解是`@Component`注解的语义化封装（特化形式）。

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Configuration {

}
```

本质上，它们都是用来标记一个类是否可以被Spring扫描

但是`@Configuration`注解又有点有点特殊，主要在其可以被代理增强

在Spring源码中，存在一个`ConfigurationClassPostProcessor` 这个后置处理器会对标注了 `@Configuration` 的类进行增强，生成代理对象。

生成代理对象的目的，是为了保证多次调用`@Bean`方法创建的bean是同一个。原因是代理类拦截了所有的`@Bean`方，每次调用`@Bean`方法时，不直接执行原方法创建实例，而是会先查询Spring容器中是否存在同名bean，如果存在就直接返回该bean实例。如果不存在就执行原方法创建实例，并存入Spring容器中。

## @Component和@Configuration互换说明

@Component和@Configuration能不能互换，取决于你的使用场景

如果把 `@Configuration` 换成 `@Component`

配置类中的 `@Bean` 方法会失去代理特性，多次调用会创建多个实例，破坏Spring中的单例bean，可能导致依赖注入的对象不一致。

如果把 `@Component` 换成 `@Component`

普通组件会被 Spring 当作配置类处理（生成代理），但它的核心功能是业务逻辑而非定义 Bean，这种用法不符合设计意图，且可能引入不必要的代理开销。

## 总结

- `@Configuration` 注解是 `@Component` 注解的语义化封装（特化形式），两者都能被Spring扫描到
- 两者的核心差异差异在于对`@Bean`方法的处理
  - `@Configuration` 注解的类中的 `@Bean` 方法会被 Spring 处理为代理，能够保证bean单例和依赖一致性
  - `@Component` 注解的类中的 `@Bean` 方法不会被 Spring 处理为代理，多次调用会创建多个实例，会打破Spring中的单例bean
- 普通组件不应该使用 `@Configuration` 注解标记，因为它可能会引入不必要的代理开销，且不符合Spring团队的设计意图

:::tip
`@Configuration` 注解的类中的 `@Bean` 方法为什么会被 Spring 处理为代理？

核心是因为`ConfigurationClassPostProcessor` 这个后置处理器会对标注了 `@Configuration` 的类进行增强，生成代理对象。

具体查看：[@Bean写在配置类与@Bean不写在配置类中的区别](./@Bean写在配置类与@Bean不写在配置类中的区别.md)
:::
