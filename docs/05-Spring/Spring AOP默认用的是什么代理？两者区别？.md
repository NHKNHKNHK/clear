# Spring AOP默认用的是什么代理？两者区别？

## **口语化**

动态代理的方式主要是 jdk 动态代理和 cglib 动态代理，spring 也是使用的这两种，具体选择哪种最主要取决于要被代理的类有没有实现接口，如果类已经实现了接口，就用 jdk 的动态代理即可，如果没有实现接口，就需要用子类的形式，采用 cglib 动态代理。

在 Spring 配置中，可以通过`@EnableAspectJAutoProxy`注解的`proxyTargetClass`属性来强制使用 `CGLIB` 代理。



## **JDK 动态代理** 

-   适用范围：JDK 动态代理仅适用于实现了一个或多个接口的类。Spring AOP默认会使用 **JDK动态代理**。

-   实现原理：JDK 动态代理使用`java.lang.reflect.Proxy`类（反射机制）和相关的`InvocationHandler`接口来创建代理对象。
-   **特点**：
    -   只支持接口方法的代理。
    -   目标对象必须实现接口。

示例

```java
public interface MyService {
    void doSomething();
}

@Service
public class MyServiceImpl implements MyService {
    @Override
    public void doSomething() {
        // 业务逻辑
    }
}
```

在这个例子中，`MyServiceImpl` 实现了接口 `MyService`，所以Spring会使用JDK动态代理。


## **CGLIB 代理** 

-   适用范围：CGLIB 代理适用于没有实现接口的类，或者需要代理类中的所有方法（包括那些没有在接口中定义的方法）。Spring AOP会使用 **CGLIB代理**。
-   实现原理：CGLIB 代理使用字节码生成技术，在运行时生成目标类的子类，并在子类中拦截方法调用。因此被代理的对象不需要实现接口

>   说明：CGLIB是一个字节码生成库，通过生成目标对象的子类来创建代理对象

-   **特点**：
    -   适用于没有实现接口的目标对象。
    -   代理对象是目标对象的子类。
    -   性能较好，但会增加类的继承关系。

示例

```java
@Service
public class MyService {
    public void doSomething() {
        // 业务逻辑
    }
}
```

在这个例子中，由于 `MyService` 没有实现任何接口，Spring会使用CGLIB代理



## **Spring 代理选择策略** 

Spring AOP 默认的代理选择策略如下：

-   如果目标对象实现了至少一个接口，Spring AOP 会优先选择使用JDK 动态代理。
-   如果目标对象没有实现任何接口，Spring AOP 会使用CGLIB 代理。



## **配置代理方式** 

虽然Spring默认会根据目标对象的类型选择代理类型，但我们可以通过配置来强制选择代理类型

在 Spring 配置中，可以通过`@EnableAspectJAutoProxy`注解的`proxyTargetClass`属性来强制使用 CGLIB 代理。

### **使用 JDK 动态代理（默认行为）** 

如果目标对象实现了接口，Spring 默认会使用 JDK 动态代理。

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Configuration
@EnableAspectJAutoProxy
public class AppConfig {
    // 配置 Bean
}
```

### **强制使用 CGLIB 代理**

无论目标对象是否实现了接口，都可以通过设置proxyTargetClass属性为true来强制使用 CGLIB 代理：

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Configuration
@EnableAspectJAutoProxy(proxyTargetClass = true)
public class AppConfig {
    // 配置 Bean
}
```

