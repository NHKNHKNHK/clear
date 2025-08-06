# 如何控制Spring Bean的创建顺序？

需求：我们有serviceA、serviceB，希望在serviceA中拿到serviceB的名称，但是这个名称是在serviceB创建完在初始化完成后才赋值的。现在需要在serviceA中获取的serviceB的name，因为serviceA可能会在serviceB之前创建，serviceB还没创建，此时拿到的name为null。这种场景下就要去控制Bean的创建顺序

如下：

```java
@Component
public class ServiceA {
    private String name;
    
    @PostConstruct
    public void init() {
        name = ServiceB.getName();
        // 拿到这个name去做后续的事情
        Sysytem.out.println("----" + name);
    }
}
```

```java
@Component
public class ServiceB {
    private String name;
    
    @PostConstruct
    public void init() {
        name = "BBB";
    }
    public static String getName(){ return name }
}
```

现在，需要serviceA在serviceB创建之后在创建，因此存在依赖关系，有两种常见方式：

-   在serviceA的类上使用注解`@DependsOn`

```java
@Component
@DependsOn("servieB")
public class ServiceA {
```

这种方式，可以确保创建serviceA时，serviceB已经被创建

但是这种方式只适用于一对一的情况

-   `BeanDefinitionRegisterPostProcessor`接口的**postProcessBeanDefinitionRegisty**钩子方法
    -   在spring中，对象的创建都是基于`beanDefinitionMap`的，这个Map中元素是顺序决定了Bean创建的顺序，因此可以手动控制ServiceA、ServiceB放入到Map中的顺序

```java
@Component
public class ServiceOrderConfig implements BeanDefinitionRegistryPostProcessor, PriorityOrdered {

    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) {
        // 首先注册 ServiceB
        GenericBeanDefinition serviceBDefinition = new GenericBeanDefinition();
        serviceBDefinition.setBeanClass(ServiceB.class);
        registry.registerBeanDefinition("serviceB", serviceBDefinition);

        // 然后注册 ServiceA，并注入 ServiceB
        BeanDefinitionBuilder serviceABuilder = BeanDefinitionBuilder.genericBeanDefinition(ServiceA.class);
        serviceABuilder.addConstructorArgReference("serviceB");
        BeanDefinition serviceADefinition = serviceABuilder.getBeanDefinition();
        registry.registerBeanDefinition("serviceA", serviceADefinition);
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) {
        // 不需要实现
    }

    @Override
    public int getOrder() {
        // 设置优先级，确保该处理器尽早执行
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
```
