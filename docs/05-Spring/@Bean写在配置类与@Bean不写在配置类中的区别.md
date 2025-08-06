# @Bean写在配置类与@Bean不写在配置类中的区别

@Bean写在配置类与@Bean不写在配置类中

这个问题主要是想考察@Bean写在@Configuration类里面与不写在@Configuration类里面的区别

首先我们要知道@Configuration也是一个@Component，这一点在他的注解声明中可以看到

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Configuration {

}
```

所有，问题就转变为了**@Bean写在@Configuration类里面与写在@Component类里面的区别**

@Bean写在@Component中也能够正常的配置对于的bean，如下

```java
@Component
public class MainConfig {
    @Bean
    public UserService userService() {
        RoleService roleService = roleService();
        RoleService roleService2 = roleService();
        return new UserService(roleService2;
    }
    
    @Bean
    public RoleService roleService() {
        return new RoleService(());
    }
}
```

**实际上，当我们在一个@Bean方法在调用另一个@Bean方法时，它并不会直接去调用这个方法，而是先去Spring容器中查看有没有对应的bean，有则返回，从而保证了bean的单例性。**（前提是@Bean方法都声明在@Configuration类中）

上面例子中：

​	userService方法中调用了roleService()，正常情况会先去Spring容器中查看有没有roleService这个bean，有就返回。

​	然而，上面的userService方法没有写在@Configuration类中，不会走查询Spring容器的过程，因此调用userService方法都会创建两个roleService bean，打破了Spring bean的单例原则。

下面的例子中，userService方法中依然调用了两次roleService()，但是只会创建一个bean

那么它是如何做到的呢？

>   Spring在解析配置类时，实际上会为配置类创建一个CGLIB动态代理，这个动态代理的作用就是，当你去调用本类方法的时候（例如：roleService()），它会先去执行动态代理增强的代码，增强的代码就是去Spring容器中查询对应的bean，找到了就返回，从而保证了单例性

```java
@Configuration
public class MainConfig {
    @Bean
    public UserService userService() {
        RoleService roleService = roleService();
        RoleService roleService2 = roleService();
        return new UserService(roleService2;
    }
    
    @Bean
    public RoleService roleService() {
        return new RoleService(());
    }
}
```

## **总结**

@Bean写在@Configuration类里面

-   **支持编译时代理**：当 `@Bean` 方法定义在 `@Configuration` 类中时，Spring 会通过 CGLIB 创建代理对象来确保方法调用的一致性（例如，单例作用域的行为）。
-   **单例作用域默认行为**：即使多次调用同一个 `@Bean` 方法，Spring 也会确保返回的是同一个实例（单例模式）。

@Bean写在@Component类里面

-   **无编译时代理**：当 `@Bean` 方法定义在 `@Component` 类中时，Spring 不会创建代理对象。如果多次调用同一个 `@Bean` 方法，可能会创建多个实例（违反单例模式）。
-   **单例作用域可能被破坏**：由于没有代理机制，`@Bean` 方法的调用行为可能不符合预期，尤其是在方法被多次调用时