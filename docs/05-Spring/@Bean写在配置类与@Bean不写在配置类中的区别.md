# @Bean写在配置类与@Bean不写在配置类中的区别

`@Bean`写在配置类与`@Bean`不写在配置类中

这个问题主要是想考察`@Bean`写在`@Configuration`类里面与不写在`@Configuration`类里面的区别

首先我们要知道`@Configuration`也是一个`@Component`，这一点在他的注解声明中可以看到：

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Configuration {
    // ...
}
```

所以，问题就转变为了`@Bean`写在`@Configuration`类里面与写在`@Component`类里面的区别

## @Bean写在@Component类中

`@Bean`写在`@Component`标记的类中也能够正常的配置对应的bean，如下：

```java
@Component
public class MainConfig {
    @Bean
    public UserService userService() {
        RoleService roleService = roleService();
        RoleService roleService2 = roleService();
        return new UserService(roleService2);
    }
    
    @Bean
    public RoleService roleService() {
        return new RoleService(());
    }
}
```

**实际上，当我们在一个@Bean方法在调用另一个@Bean方法时，它并不会直接去调用这个方法，而是先去Spring容器中查看有没有对应的bean，有则返回，从而保证了bean的单例性。**（前提是`@Bean`方法都声明在`@Configuration`类中）

但是在上面例子中：

​	userService方法中调用了roleService()，正常情况会先去Spring容器中查看有没有roleService这个bean，有就返回。

​	然而，上面的userService方法没有写在`@Configuration`类中，不会走查询Spring容器的过程，因此调用userService方法都会创建两个roleService bean，打破了Spring bean的单例原则。

## @Bean写在@Configuration类中

下面的例子中，userService方法中依然调用了两次roleService()，但是只会创建一个bean

那么它是如何做到的呢？

Spring在解析配置类时，实际上会为配置类创建一个CGLIB动态代理，这个动态代理的作用就是，当你去调用本类方法的时候（例如：roleService()），它会先去执行动态代理增强的代码，增强的代码就是去Spring容器中查询对应的bean，找到了就返回，从而保证了单例性

```java
@Configuration
public class MainConfig {
    @Bean
    public UserService userService() {
        RoleService roleService = roleService();
        RoleService roleService2 = roleService();
        return new UserService(roleService2);
    }
    
    @Bean
    public RoleService roleService() {
        return new RoleService(());
    }
}
```

:::tip
`@Configuration`是特殊注解，标识一个类为 “配置类”，用于定义 Bean 的创建逻辑（类似传统 XML 配置中的 `<beans>`）。Spring 会为其创建一个代理对象（CGLIB 代理），确保配置类中定义的 Bean 是单例且被正确引用
:::

## **总结**

`@Bean`写在`@Component`类里面

每次调用该 `@Bean` 方法，都会创建一个新对象（相当于普通方法调用）

- **无编译时代理**：当 `@Bean` 方法定义在 `@Component` 类中时，Spring 不会创建代理对象。如果多次调用同一个 `@Bean` 方法，可能会创建多个实例（违反单例模式）。
- **单例作用域可能被破坏**：由于没有代理机制，`@Bean` 方法的调用行为可能不符合预期，尤其是在方法被多次调用时

`@Bean`写在`@Configuration`类里面

由于配置类被代理，调用 `@Bean` 方法时，会先检查容器中是否已有该 bean，若有则直接返回容器中的实例（保证单例）。

- **支持编译时代理**：当 `@Bean` 方法定义在 `@Configuration` 类中时，Spring 会通过 CGLIB 创建代理对象来确保方法调用的一致性（例如，单例作用域的行为）。
- **单例作用域默认行为**：即使多次调用同一个 `@Bean` 方法，Spring 也会确保返回的是同一个实例（单例模式）。


## 扩展

### 为什么`@Configuration`标记的类会被CGLIB代理

在 Spring 源码中，`@Configuration` 类的代理特性（CGLIB 代理）主要通过 `ConfigurationClassPostProcessor` 和 `ConfigurationClassEnhancer` 两个核心类实现，核心逻辑集中在对配置类的**增强处理**上

以下从源码角度具体说明：

1、`@Configuration` 注解的定义：隐含被代理的 “开关”

首先，`@Configuration` 注解本身被 `@Component` 标注（因此能被 Spring 扫描），他还额外添加了一个关键属性 `proxyBeanMethods`（默认 true）：

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Configuration {

    // ...

    boolean proxyBeanMethods() default true; // 代理@Bean方法（默认true，即开启CGLIB代理）

}

```

这个 `proxyBeanMethods = true` 是触发代理的核心开关，源码中会根据这个属性决定是否对配置类进行 CGLIB 增强。

2、`ConfigurationClassPostProcessor` 识别和扫描配置类

Spring 在启动时，会通过 `ConfigurationClassPostProcessor`（一个 `BeanFactoryPostProcessor`）处理所有标注了 `@Configuration` 的类。其核心逻辑是：

- 扫描并识别 `@Configuration` 类
- 对 `proxyBeanMethods = true` 的配置类，通过 CGLIB 生成代理对象

关键代码在 ConfigurationClassPostProcessor 的 enhanceConfigurationClasses 方法中，如下对方法进行了部分省略：

```java
public void enhanceConfigurationClasses(ConfigurableListableBeanFactory beanFactory) {
    StartupStep enhanceConfigClasses = this.applicationStartup.start("spring.context.config-classes.enhance");
    // 收集所有标注了@Configuration的Bean定义
    Map<String, AbstractBeanDefinition> configBeanDefs = new LinkedHashMap();
    String[] var4 = beanFactory.getBeanDefinitionNames();
    int var5 = var4.length;

    for(int var6 = 0; var6 < var5; ++var6) {
        String beanName = var4[var6];
        BeanDefinition beanDef = beanFactory.getBeanDefinition(beanName);
        Object configClassAttr = beanDef.getAttribute(ConfigurationClassUtils.CONFIGURATION_CLASS_ATTRIBUTE);
        AnnotationMetadata annotationMetadata = null;
        MethodMetadata methodMetadata = null;
        if (beanDef instanceof AnnotatedBeanDefinition annotatedBeanDefinition) {
            annotationMetadata = annotatedBeanDefinition.getMetadata();
            methodMetadata = annotatedBeanDefinition.getFactoryMethodMetadata();
        }

        if ((configClassAttr != null || methodMetadata != null) && beanDef instanceof AbstractBeanDefinition abd) {
            if (!abd.hasBeanClass()) {
                boolean liteConfigurationCandidateWithoutBeanMethods = "lite".equals(configClassAttr) && annotationMetadata != null && !ConfigurationClassUtils.hasBeanMethods(annotationMetadata);
                if (!liteConfigurationCandidateWithoutBeanMethods) {
                    try {
                        abd.resolveBeanClass(this.beanClassLoader);
                    } catch (Throwable var15) {
                        throw new IllegalStateException("Cannot load configuration class: " + beanDef.getBeanClassName(), var15);
                    }
                }
            }
        }

        if ("full".equals(configClassAttr)) {
            if (!(beanDef instanceof AbstractBeanDefinition)) {
                throw new BeanDefinitionStoreException("Cannot enhance @Configuration bean definition '" + beanName + "' since it is not stored in an AbstractBeanDefinition subclass");
            }

            abd = (AbstractBeanDefinition)beanDef;
            if (beanFactory.containsSingleton(beanName)) {
                if (this.logger.isWarnEnabled()) {
                    this.logger.warn("Cannot enhance @Configuration bean definition '" + beanName + "' since its singleton instance has been created too early. The typical cause is a non-static @Bean method with a BeanDefinitionRegistryPostProcessor return type: Consider declaring such methods as 'static' and/or marking the containing configuration class as 'proxyBeanMethods=false'.");
                }
            } else {
                configBeanDefs.put(beanName, abd);
            }
        }
    }

    if (configBeanDefs.isEmpty()) {
        enhanceConfigClasses.end();
    } else {
        // 通过ConfigurationClassEnhancer创建CGLIB代理
        ConfigurationClassEnhancer enhancer = new ConfigurationClassEnhancer();
        Iterator var17 = configBeanDefs.entrySet().iterator();

        while(var17.hasNext()) {
            Map.Entry<String, AbstractBeanDefinition> entry = (Map.Entry)var17.next();
            AbstractBeanDefinition beanDef = (AbstractBeanDefinition)entry.getValue();
            beanDef.setAttribute(AutoProxyUtils.PRESERVE_TARGET_CLASS_ATTRIBUTE, Boolean.TRUE);
            Class<?> configClass = beanDef.getBeanClass();
            Class<?> enhancedClass = enhancer.enhance(configClass, this.beanClassLoader);
            if (configClass != enhancedClass) {
                if (this.logger.isTraceEnabled()) {
                    this.logger.trace(String.format("Replacing bean definition '%s' existing class '%s' with enhanced class '%s'", entry.getKey(), configClass.getName(), enhancedClass.getName()));
                }

                // 设置Bean的类型为代理后的类型
                beanDef.setBeanClass(enhancedClass);
            }
        }

        enhanceConfigClasses.tag("classCount", () -> {
            return String.valueOf(configBeanDefs.keySet().size());
        }).end();
    }
}
```

这段代码的作用是：筛选出所有 `@Configuration` 类，通过 `ConfigurationClassEnhancer` 生成代理类，并将 Bean 定义的类型替换为代理类。

3、CGLIB 代理的核心逻辑：`ConfigurationClassEnhancer`

`ConfigurationClassEnhancer` 是生成配置类代理的核心类，其 `enhance` 方法会创建 CGLIB 代理对象，并重写 `@Bean` 方法的调用逻辑。

**核心原理：拦截 @Bean 方法调用，优先从容器获取实例**

代理类会拦截所有 `@Bean` 方法的调用，当方法被调用时，不会直接执行原方法创建新对象，而是先检查 Spring 容器中是否已存在该 Bean：
- 若已存在，则直接返回容器中的实例（保证单例）；
- 若不存在，则执行原方法创建实例，并注册到容器中。

关键代码在 `ConfigurationClassEnhancer` 的内部类 `BeanMethodInterceptor` 中（拦截器，负责处理方法调用）：

```java
@Nullable
public Object intercept(Object enhancedConfigInstance, Method beanMethod, Object[] beanMethodArgs, MethodProxy cglibMethodProxy) throws Throwable {
    // 获取Spring容器（BeanFactory容器）
    ConfigurableBeanFactory beanFactory = this.getBeanFactory(enhancedConfigInstance);
    // 获取@Bean方法定义的Bean名称（默认是方法名）
    String beanName = BeanAnnotationHelper.determineBeanNameFor(beanMethod);
    if (BeanAnnotationHelper.isScopedProxy(beanMethod)) {
        String scopedBeanName = ScopedProxyCreator.getTargetBeanName(beanName);
        if (beanFactory.isCurrentlyInCreation(scopedBeanName)) {
            beanName = scopedBeanName;
        }
    }

    if (this.factoryContainsBean(beanFactory, "&" + beanName) && this.factoryContainsBean(beanFactory, beanName)) {
        Object factoryBean = beanFactory.getBean("&" + beanName);
        if (!(factoryBean instanceof ScopedProxyFactoryBean)) {
            return this.enhanceFactoryBean(factoryBean, beanMethod.getReturnType(), beanFactory, beanName);
        }
    }

    if (this.isCurrentlyInvokedFactoryMethod(beanMethod)) {
        if (ConfigurationClassEnhancer.logger.isInfoEnabled() && BeanFactoryPostProcessor.class.isAssignableFrom(beanMethod.getReturnType())) {
            ConfigurationClassEnhancer.logger.info(String.format("@Bean method %s.%s is non-static and returns an object assignable to Spring's BeanFactoryPostProcessor interface. This will result in a failure to process annotations such as @Autowired, @Resource and @PostConstruct within the method's declaring @Configuration class. Add the 'static' modifier to this method to avoid these container lifecycle issues; see @Bean javadoc for complete details.", beanMethod.getDeclaringClass().getSimpleName(), beanMethod.getName()));
        }

        return cglibMethodProxy.invokeSuper(enhancedConfigInstance, beanMethodArgs);
    } else {
        return this.resolveBeanReference(beanMethod, beanMethodArgs, beanFactory, beanName);
    }
}
```

这段拦截逻辑确保了：在 `@Configuration` 类中，无论多少次调用 `@Bean` 方法，最终获取的都是 Spring 容器中管理的单例实例（除非显式指定为原型）。

4、验证：`@Configuration` 类的类型是代理类

通过调试可以发现，`@Configuration` 类的实例类型是 CGLIB 生成的代理类（类名会带有 `EnhancerBySpringCGLIB`前缀），而`@Component` 类的实例是原类型。例如：

```java
@Configuration
public class MyConfig { ... }

// 容器中获取的实例类型是：MyConfig$$EnhancerBySpringCGLIB$$xxx
```

