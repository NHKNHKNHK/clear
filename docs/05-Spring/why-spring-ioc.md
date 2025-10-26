---
permalink: /spring/why-spring-ioc
---

# 什么是SpringIOC？

## 口语化

IOC是一种思想，不是具体的技术。它让对象的创建和管理交给Spring容器来完成（反转的体现），而不是我们自己手动创建对象。容器根据配置或注解来创建对象，并管理对象的依赖关系、生命周期，我们就不需要在代码中手动的new对象了。

IOC的主要实现是依赖注入，也就是DI（Dependency Injection，依赖注入）。我们可以通过setter注入、字段注入、构造器注入等方式，将对象注入到另一个对象的属性中。 这样Spring容器能够自动管理对象的依赖关系，使得应用程序代码更加简洁

:::tip
要点：

- IOC是一种思想，不是具体的技术。
- DI是实现
- 核心是控制对象创建，反转创建动作

目的：解耦和简化管理
:::

Spring IoC（Inversion of Control，控制反转）是Spring框架中的一个核心概念。

## 什么是IOC（控制反转）

在传统的编程模型中，应用程序代码通常直接控制对象的创建和依赖关系。

例如，一个对象需要依赖另一个对象时，通常会在代码中直接创建依赖对象。这种方式使得代码紧密耦合，不利于测试和维护。

控制反转的理念是将这种【控制权】从应用程序代码中移除，转而【交给一个容器来管理】。这个容器就是Spring IoC容器。

通过这种方式，对象的创建和依赖关系的管理被反转了，应用程序代码不再负责这些任务，而是由容器来处理。

举例说明：

没有IOC时，我们这样写代码：

```java
class A {}

class B {
    // B需要将A的实例new出来，也就是我们说的控制
    private A a = new A();

    public void use() {
        System.out.print(a);
    }
        
}
```

有了IOC后，我们这样写代码：

```java
@Component // 说明A自己控制自己，把自己初始化出来，注入给了容器
class A {}

class B {

    // B不需要控制a，直接使用。如果A没有把自己注入给容器，B就不能使用
    @Resource
    private A a;

    public void use() {
        System.out.print(a);
    }
        
}
```

结论，在没有IOC思想之前，对象的控制权在代码中，我们自己手动的new对象；有了IOC后，我们不再在代码中控制对象的创建，而是交由IOC容器统一创建并管理，我们需要使用对象的只时候需要在代码中使用`@Resource`（或XML配置）等注解声明即可即可获取到对象。

:::tip
这里需要在提醒以下，IOC是一种思想，可以有不同的实现方式，比如最常见的依赖注入（DI）就是一种IOC的实现。
:::

## 什么是DI（依赖注入）

依赖注入是实现控制反转的一种方式（或者说主要方式）

它主要有以下几种形式：

- **构造函数注入**：通过构造函数将依赖对象传递给被依赖对象。

```java
public class SystemUserController {

    private final SystemUserService systemUserService;

    public SystemUserController(SystemUserService systemUserService) {
        this.systemUserService = systemUserService;
    }
}
```

:::tip
Spring官方推荐使用构造器来注入依赖对象，这样做的好处是可以将循环依赖问题暴露在开发阶段

开发中构造器注入常常是配合Lombok的`@RequiredArgsConstructor`注解使用，这样可以简化构造函数的书写。

```java
@RequiredArgsConstructor
public class SystemUserController {

    private final SystemUserService systemUserService;

}
```

:::

- **Setter方法注入**：通过Setter方法将依赖对象注入到被依赖对象中。

```java
public class SystemUserController {

    private SystemUserService systemUserService;

    public void setSystemUserService(SystemUserService systemUserService) {
        this.systemUserService = systemUserService;
    }

}
```

- **字段注入**：直接在字段上使用注解进行注入

```java
public class SystemUserController {

    @Autowired
    private SystemUserService systemUserService;

}
```

## Spring IoC 容器

Spring IoC容器负责管理应用程序中对象的生命周期和依赖关系。它的主要职责包括：

- 对象的创建：根据配置文件或注解创建对象。
- 依赖注入：将对象的依赖注入到相应的对象中。
- 对象的销毁：在适当的时候销毁对象，释放资源。

Spring IoC容器可以通过多种方式进行配置

- **XML配置**：通过XML文件定义Bean及其依赖关系

```xml
<beans>
    <bean id="systemUserService" class="com.clear.lease.admin.service.SystemUserService"><"/>
    <bean id="systemUserController" class="com.clear.lease.admin.controller.system.SystemUserController">
        <constructor-arg ref="systemUserService"/>
    </bean>
</beans>
```

- **Java配置**：通过Java类和注解定义Bean及其依赖关系

```java
@Configuration
public class Knife4jConfiguration {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI().info(
                new Info()
                        .title("后台管理系统API")
                        .version("1.0")
                        .description("后台管理系统API"));
    }

    @Bean
    public GroupedOpenApi systemAPI() {
        return GroupedOpenApi.builder().group("系统信息管理").
                pathsToMatch("/admin/system/**")
                .build();
    }

}

```

- **注解配置**：通过注解（如`@Component`、`@Autowired`）自动扫描和注入Bean。

```java
@RestController
@RequestMapping("/admin/system/user")
@RequiredArgsConstructor
public class SystemUserController {

    private final SystemUserService systemUserService;

    ...

}

@Service
@RequiredArgsConstructor
public class SystemUserServiceImpl extends ServiceImpl<SystemUserMapper, SystemUser>
        implements SystemUserService {

    ...

}
```

### IOC的优点|好处

这里列举三点，更多可以查阅：[【SpringIOC有什么好处？】](./SpringIOC有什么好处？)

- **使用者不用关心引用bean的实现细节**

例如，`A a = new A(c,d,e,f);`，我们要使用A，就必须知道A的实现细节，比如它的构造器参数。因此还需要把c，d，e，f多个类熟悉一遍，才能使用A。这显然不合理，也很麻烦。

- **不用创建多个相同的bean导致浪费**

例如，有两个类A和B，它们都需要一个C对象。如果我们直接在代码中创建两个C实例，那么就会浪费内存资源。

但是如果使用IOC容器来管理这些bean，那么只需要创建一个C的实例即可，然后分别注入到A和B中。

- **Bean的修改使用方无需感知**

例如，有一个beanA，它的构造器中有一个参数需要修改，如果没有IOC容器，那么所有需要引用到A的其他bean都需要感知到这个修改，并做出相应的修改。

但是如果使用IOC容器，那么只需要修改A的构造器参数，其他bean不需要感知到这个修改
