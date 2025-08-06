# Spring不能解决的循环依赖有哪些？

:::tip
Spring本身只能解决单实例存在的循环引用问题
:::

有以下情况Spring不能自动处理循环依赖，需要我们手动控制：

-   多实例（**Prototype**）的Setter注入导致的循环依赖问题，需要把bean改为单例
-   构造器注入导致的循环依赖问题，可以通过@Lazy注解
-   @DependsOn导致的循环依赖，找到注解循环依赖的地方，迫使它不循环依赖

-   单例的代理对象Setter注入导致的循环依赖
    -   可以使用@Lazy注解
    -   或使用@DependsOn注解指定加载先后关系。

## **多实例(Prototype) Bean 的循环依赖**

```java
// BeanA.java
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@Component
public class BeanA {
    @Autowired private BeanB b;
}

// BeanB.java
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@Component
public class BeanB {
    @Autowired private BeanA a;
}
```

**原因**：

-   Prototype Bean 不缓存初始化中的对象
-   每次请求都生成新实例，无法通过三级缓存解决

**解决方案**

```java
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON) // 改为单例模式
@Component
public class BeanA { ... }
```



## **构造器注入循环依赖**

```java
// BeanC.java
@Component
public class BeanC {
    private final BeanD d;
    
    @Autowired
    public BeanC(BeanD d) { // 构造器注入
        this.d = d;
    }
}

// BeanD.java
@Component
public class BeanD {
    private final BeanC c;
    
    @Autowired
    public BeanD(BeanC c) { // 构造器注入
        this.c = c;
    }
}
```

**原因**：

-   构造器注入必须在实例化阶段完成依赖注入
-   无法通过提前暴露半成品对象解决

**解决方案**：

```java
// 在其中一个构造参数添加@Lazy
public BeanD(@Lazy BeanC c) {
    this.c = c;
}
```



## **@DependsOn 强制依赖顺序导致的循环**

```java
// BeanE.java
@Component
@DependsOn("beanF")
public class BeanE { ... }

// BeanF.java
@Component
@DependsOn("beanE")
public class BeanF { ... }
```

**原因**：

-   @DependsOn 显式指定了循环加载顺序
-   Spring 无法处理这种硬编码的循环依赖

**解决方案**：

```java
// 重构设计，移除循环依赖
public interface CommonService {}
@Service
public class BeanE implements CommonService { ... }

@Service
public class BeanF {
    @Autowired
    private CommonService service; // 面向接口编程
}
```



## **AOP 代理对象的循环依赖**

```java
// BeanG.java
@Service
public class BeanG {
    @Autowired private BeanH h;
    
    @Async // 会生成代理对象
    public void asyncMethod() { ... }
}

// BeanH.java
@Service
public class BeanH {
    @Autowired private BeanG g;
}
```

**原因**：

-   代理对象创建顺序影响依赖注入
-   代理对象可能破坏三级缓存机制

**解决方案**：

```java
// 方案1：使用@Lazy延迟加载
public BeanH(@Lazy BeanG g) {
    this.g = g;
}

// 方案2：调整代理方式
@EnableAspectJAutoProxy(proxyTargetClass = true) // 强制使用CGLIB代理
```

