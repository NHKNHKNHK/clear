# bean的生命周期回调方法和执行顺序？

在 Spring 容器中，Bean 的生命周期由容器管理，从创建到销毁经历了一系列的方法调用。

bean的生命周期方法主要分为两大类，一种是bean初始化时调用的、一种是bean销毁时调用的

**bean初始化时调用的回调**：

-   通过`@PostConstruct`注解指定的方法
-   通过实现`InitializingBean`接口的`afterPropertiesSet()`方法
-   通过`<bean>`标签的`init-method`属性来指定的方法 或 通过 `@Bean`注解的`initMethod`属性指定的方法

**bean销毁时调用的回调**

-   通过`@PreDestroy`注解指定的方法
-   通过实现`DisposableBean`接口的`destroy()`方法
-   通过`<bean>`标签的`destroy-method`属性指定的销毁方法 或 通过 `@Bean`注解的`destoryMethod`属性指定的方法



**执行顺序**

看完如下示例就豁然开朗了

```java
public class UserService implements InitializingBean, DisposableBean {

    @PostConstruct
    public void init1() {
        System.out.println("初始化1");
    }

    @Override
    public void destroy() throws Exception {
        System.out.println("初始化2");
    }

    public void init3() {
        System.out.println("初始化3");
    }

    @PreDestroy
    public void destroy1() {
        System.out.println("销毁1");
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("销毁2");
    }

    public void destroy3() {
        System.out.println("销毁3");
    }
}


@Configuration
public class MainConfig {

    @Bean(initMethod = "init3", destroyMethod = "destroy3")
    public UserService userService() {
        return new UserService();
    }
}


public class DemoApplication {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext applicationContext = new AnnotationConfigApplicationContext(MainConfig.class);
        UserService bean = applicationContext.getBean(UserService.class);
        applicationContext.close();
    }
}
```

输入结果：

```
初始化1
销毁2
初始化3
销毁1
初始化2
销毁3
```



todo SpringBean的生命周期是怎么样的？