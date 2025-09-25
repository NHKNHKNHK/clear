# 为什么不推荐使用@Autowired

:::tip
大多数人想到第一反应是`@Resource`注解是由JavaEE提供的，而`@Autowired`是由Spring提供的。

我们可以换一个角度思考，Spring官方推荐的依赖注入方式，是使用`构造函数注入`，而不是使用字段注入。
:::

## 口语化

`@Autowired`注解实现依赖注入使用简单，但是它也存在一些问题。

开发中应该优先使用构造函数注入。它能够在项目启动时暴露循环依赖问题，可以避免空指针异常，并且使得代码很容易的进行单元测试，也更加遵循单一职责设计原则。

在开发中，我们常常会结合Lombok的`@RequiredArgsConstructor`注解，来简化构造函数的编写。


## 容易触发空指针NullPointerException

```java
@Component
public class Jingdianlaoge {

    @Autowired
    private ClearService clearService;

    private String clearName;

    public Jingdianlaoge() {
        this.clearName = clearService.getName();
    }
}
```

这段代码中在构造函数中调用一个`@Autowired`注入的bean，这里存在一个空指针异常。因为在对象的生命周期中，构造方法永远优先于依赖注入，构造函数在执行的时候，Spring还没来得及把clearService注入。

## 与IOC容器强耦合，单元测试不方便

用注入注解的类，想脱离Spring环境做单元测试的时候很麻烦，没办法new出来，因为依赖都是空的，只能启动整个Spring容器或使用反射工具往里面硬塞。

当然也可以使用Mockito等工具

而构造器注入就不存在这个问题，直接new一个对象，把mock对象传进去即可。做到了高内聚，低耦合。

## 字段注入容易掩盖循环依赖问题

Spring为了解决字段注入存在的循环依赖问题，引入了三级缓存。让项目可以正常启动，运行时可以会遇到一些莫名其妙的错误。

如果使用构造器注入，在项目启动时就会抛出异常，在开发阶段就能发现问题，快速失败。


## 容易违背单一职责设计原则，不利于代码重构

字段注入使用方便，一个bean的依赖项可能逐步增多，违背了单一职责设计原则。不利于代码重构。

