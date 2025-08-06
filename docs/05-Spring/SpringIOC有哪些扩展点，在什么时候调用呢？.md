# SpringIOC有哪些扩展点，在什么时候调用呢？

Spring IOC 容器提供了丰富的扩展点，允许开发者在容器初始化、Bean 创建和管理过程中插入自定义逻辑。以下是 Spring IOC 的主要扩展点及其调用时机：

## **BeanFactoryPostProcessor**

-   **描述**：用于修改 Bean 定义（`BeanDefinition`）的扩展点。
-   调用时机：
    -   在所有 Bean 实例化之前调用。
    -   允许开发者动态修改 Bean 的属性或配置。
-   典型用途：
    -   修改 Bean 的属性值。
    -   动态注册新的 Bean 定义。

```java
@Component
public class MyBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        System.out.println("1. 调用 BeanFactoryPostProcessor 修改 Bean 定义");
    }
}
```



## **BeanPostProcessor**

-   **描述**：用于在 Bean 初始化前后进行处理的扩展点。
-   调用时机：
    -   `postProcessBeforeInitialization(Object bean, String beanName)`：在 Bean 初始化之前调用。
    -   `postProcessAfterInitialization(Object bean, String beanName)`：在 Bean 初始化之后调用。
-   典型用途：
    -   在 Bean 初始化前后执行额外逻辑。
    -   动态代理 Bean。

```java 
@Component
public class MyBeanPostProcessor implements BeanPostProcessor {
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("2. 调用 BeanPostProcessor 在初始化之前");
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("3. 调用 BeanPostProcessor 在初始化之后");
        return bean;
    }
}
```

## **ApplicationContextInitializer**

-   **描述**：用于在 `ApplicationContext` 初始化之前执行逻辑的扩展点。
-   调用时机：
    -   在 `ApplicationContext` 加载之前调用。
-   典型用途：
    -   修改环境变量。
    -   动态加载配置文件

```java
public class MyApplicationContextInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {
    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        System.out.println("4. 调用 ApplicationContextInitializer 在上下文初始化之前");
    }
}
```

## **SmartLifecycle**

-   **描述**：用于在应用启动和关闭时执行逻辑的扩展点。
-   调用时机：
    -   `start()`：在容器启动后调用。
    -   `stop()`：在容器关闭前调用。
-   典型用途：
    -   启动后台任务。
    -   关闭资源。

```java
@Component
public class MySmartLifecycle implements SmartLifecycle {
    private boolean running = false;

    @Override
    public void start() {
        System.out.println("5. 调用 SmartLifecycle 在容器启动后");
        running = true;
    }

    @Override
    public void stop() {
        System.out.println("6. 调用 SmartLifecycle 在容器关闭前");
        running = false;
    }

    @Override
    public boolean isRunning() {
        return running;
    }
}
```

## **ApplicationListener**

-   **描述**：用于监听 Spring 应用事件的扩展点。
-   调用时机：
    -   当特定事件发生时调用。
-   典型用途：
    -   监听应用启动、关闭等事件。
    -   执行与事件相关的逻辑。

```java
@Component
public class MyApplicationListener implements ApplicationListener<ApplicationReadyEvent> {
    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        System.out.println("7. 调用 ApplicationListener 在应用启动完成后");
    }
}
```

## **FactoryBean**

-   **描述**：用于自定义 Bean 创建逻辑的扩展点。
-   调用时机：
    -   在 Bean 实例化时调用。
-   典型用途：
    -   创建复杂的对象。
    -   动态生成 Bean。

```java
@Component
public class MyFactoryBean implements FactoryBean<MyObject> {
    @Override
    public MyObject getObject() throws Exception {
        System.out.println("8. 调用 FactoryBean 创建自定义对象");
        return new MyObject();
    }

    @Override
    public Class<?> getObjectType() {
        return MyObject.class;
    }

    @Override
    public boolean isSingleton() {
        return true;
    }
}
```



## **BeanDefinitionRegistryPostProcessor**

-   **描述**：类似于 `BeanFactoryPostProcessor`，是其子类，但可以访问 `BeanDefinitionRegistry` 接口。
-   调用时机：
    -   在所有 Bean 定义加载之后，但在 Bean 实例化之前调用。
-   典型用途：
    -   动态注册新的 Bean 定义。
    -   修改已有的 Bean 定义

```java
@Component
public class MyBeanDefinitionRegistryPostProcessor implements BeanDefinitionRegistryPostProcessor {
    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
        System.out.println("9.  调用 BeanDefinitionRegistryPostProcessor 修改或注册 Bean 定义");
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        // 可选实现
    }
}
```

## **ImportSelector 和 ImportBeanDefinitionRegistrar**

-   描述：
    -   `ImportSelector`：用于动态选择需要导入的配置类。
    -   `ImportBeanDefinitionRegistrar`：用于动态注册 Bean 定义。
-   调用时机：
    -   在解析 `@Import` 注解时调用。
-   典型用途：
    -   动态导入配置类。
    -   动态注册 Bean。

```java
public class MyImportSelector implements ImportSelector {
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        System.out.println("10. 调用 ImportSelector 动态选择配置类");
        return new String[]{"com.example.MyConfig"};
    }
}
```


## 总结



| 扩展点名称                          | 调用时机                    | 典型用途                 |
| :---------------------------------- | :-------------------------- | :----------------------- |
| BeanFactoryPostProcessor            | Bean 实例化之前             | 修改 Bean 定义           |
| BeanPostProcessor                   | Bean 初始化前后             | 自定义初始化逻辑         |
| ApplicationContextInitializer       | ApplicationContext 加载之前 | 修改上下文配置           |
| SmartLifecycle                      | 容器启动/关闭时             | 启动/关闭后台任务        |
| ApplicationListener                 | 特定事件发生时              | 监听应用事件             |
| FactoryBean                         | Bean 实例化时               | 自定义对象创建逻辑       |
| BeanDefinitionRegistryPostProcessor | Bean 定义加载之后           | 动态注册或修改 Bean 定义 |
| ImportSelector                      | 解析 @Import 注解时         | 动态选择配置类           |
| ImportBeanDefinitionRegistrar       | 解析 @Import 注解时         | 动态注册 Bean            |


