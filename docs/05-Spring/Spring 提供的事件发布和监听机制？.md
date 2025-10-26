---
permalink: /25/10/22/spring/spring-event
---

# Spring 提供的事件发布和监听机制？

## 口语化

>   Spring事件监听的核心机制：**观察者模式**

Spring提供的事件发布机制一般情况下我们很少使用，我们更多的时候都是在使用Spring提供的IOC、AOP等

它的主要作用是实现**业务解耦**，提高可扩展性、可维护性。

它类似于MQ消息队列，提供了一种**发布订阅**的机制。

Spring的事件监听器主要由三部分组成：事件、监听器、播放器（或者叫事件发布器）。

Spring提供了`ApplicationEventMulticaster`（播放器，可多播或组播）、`ApplicationEvent`、`ApplicationListener`等api，
可以轻松实现简单的实现发布订阅功能。

播放器（发布器）在Spring中有默认的实现，我们只需要调用`publishEvent`方法就可以发布事件了。

>   在`refresh`方法中就初始化了默认的播放器
>
>   ```java
>   this.initApplicationEventMulticaster();
>   ```
>
>   它初始化的是 `SimpleApplicationEventMulticaster`

Spring Event的适用场景：

- 1）一些初始化操作可以使用，这样可以降低业务耦合。（前提是业务比较简单）
- 2）还有就是想要实现事件监听，但又不想引入MQ这种中间件时使用。例如：下单和扣减库存操作，扣减库存就可以适用spring的事件机制，实现业务解耦。（一般大项目都会用到MQ）



虽然我们平时用Spring的事件机制不多，但是底层源码倒是用到挺多的，比如springboot、springcloud等都大量使用了spring事件监听来进行扩展和集成。



## **Spring Event三个组成部分**

-   **事件**（`ApplicationEvent`）：负者对应响应监视器。
    - 表现在代码上，事件是一个普通的Java对象，用于封装关于事件发生的信息。通常，事件类会包含一些数据字段，以便监听器能够获取事件的相关信息。
-   **事件发布器**（`ApplicationEventMulticaster`）：对应于观察者模式中的【被观察者/主题】， 事件发布者是负责触发事件并通知所有注册的监听器的组件。
- **监听器**（`ApplicationListener`）：对应于观察者模式中的【观察者】。监听器是监听特定类型事件的组件，并在内部定义了事件触发后的响应逻辑。
    - 它们实现了一个接口或者使用注解来标识自己是一个事件监听器，并定义了在事件发生时需要执行的逻辑


## **一些Spring内置的事件**

- 1）`ContextRefreshedEvent`：当容器被实例化 或 refreshed时发布，如调用 `refresh()`方法，此处的实例化是指所有的bean都已经加载，后置处理器都被激活，所有单例bean都已经被实例化，所有的容器对象都已经准备好可以使用了。

如果 ApplicationContext实现类支持热重载，则refresh可以被触发多次（XmlWebApplicationContext支持热刷新，而GenericApplication不支持）

- 2）`ContextStartedEvent`：当容器启动时发布，即调用`start()`方法，已启动意味着所有的Lifecycle bean都已经显式的接收到了start信号

- 3）`ContextStoppedEvent`：当容器停止时发布，即调用`stop()`方法，即所有的Lifecycle bean都已经显式的接收到了stop信号，stopped的容器可以通过start()方法重启

- 4）`ContextClosedEvent`：当容器关闭时发布，即调用`close()`方法，关闭意味着所有的单例bean都已被销毁，关闭的容器不能 restart或 refresh

- 5）`RequestHandledEvent`：这只有在使用spring的DispatcherServlet时有效，当一个请求被处理完成时发布



## 实现一个Spring Event

需求：我们在创建Person后打印通过Spring Event打印一条记录

> 说明：真实开发中这个需求属于伪需求，这里关注Spring Event实现即可

首先定义一个Event，需要继承ApplicationEvent类

```java
// 自定义事件
@Getter
public class PersonChangeEvent extends ApplicationEvent {

    private Person person;

    private String operateType;

    public PersonChangeEvent(Person person, String operateType) {
        super(person);
        this.person = person;
        this.operateType = operateType;
    }
}
```

在他的构造方法中，可以定义一个事件相关的内容，如事件类型、数据等等

:::tip
如果Event中包含很多字段，我们可以使用一个类来封装，如下
```java
@Getter
public class PersonChangeEvent extends ApplicationEvent {

    public PersonChangeEvent(PersonInfo personInfo) {
        super(person);
    }
}

// PersonInfo略
```

:::

然后就可以发布事件了：

```java
// 发布事件
@Service
public class PersonEventService {

    @Resource
    private ApplicationEventPublisher applicationEventPublisher;

    public void createPerson(Person person) {
        applicationEventPublisher.publishEvent(new PersonChangeEvent(person, "create"));
    }
}
```

有了事件发布者以后，那么需要定义监听器来监听事件：

监听器的实现方式有两种：
- 一、实现`ApplicationListener`接口
- 二、使用`@EventListener`注解

```java
@Service
@Slf4j
public class PersonEventLister {

    // 监听事件 
    // TransactionalEventListener 是 EventListener 的子接口
    @TransactionalEventListener(fallbackExecution = true)
    public void listenCreateEvent(PersonChangeEvent personChangeEvent) {
        switch (personChangeEvent.getOperateType()) {
            case "create":
                // 这里按需写自己的业务逻辑
                log.info("执行创建事件：{}", JSON.toJSONString(personChangeEvent.getPerson()));
                break;
            default:
                break;
        }
    }
}
```

:::warning 注意
默认情况下，Spring Event的调用时同步调用的。如果想要实现异步调用，也是支持的，最简单的方式就是借助`@Async`注解

修改事件监听器，增加`@Async`注解

```java
@Service
@Slf4j
public class PersonEventLister {

    // 监听事件 
    // TransactionalEventListener 是 EventListener 的子接口
    @TransactionalEventListener(fallbackExecution = true)
    @Async // [!code ++]
    public void listenCreateEvent(PersonChangeEvent personChangeEvent) {
        switch (personChangeEvent.getOperateType()) {
            case "create":
                // 这里按需写自己的业务逻辑
                log.info("执行创建事件：{}", JSON.toJSONString(personChangeEvent.getPerson()));
                break;
            default:
                break;
        }
    }
}
```

最后别忘记了需要开启对异步的支持，需要在启动类上增加`@EnableAsync`注解

但是一般情况下不建议大家直接用`@Async`，最好是自定义线程池来实现异步，如：`@Async("自定义的线程池")`

[为什么不建议直接使用Spring的@Async](./为什么不建议直接使用Spring的@Async)
:::

## 扩展

### **Spring Event带来的好处是什么**

- **代码解耦**：通过使用事件机制，组件之间不需要直接互相依赖，从而减少了代码之间的耦合度。这使得代码更易于维护和扩展。
- **职责单一且清晰**：事件机制有助于将应用程序拆分为更小的模块，每个模块只关心要做的事儿，和关心自己需要监听的事件就行了
- **异步处理**：Spring Event机制支持异步事件处理，这意味着可以将事件的处理分发到不同的线程，提高了系统的响应性。
- **一对多**：Spring Event是观察者模式的一种实现，他的一个事件可以有多个监听者，所以当我们有多个模块之间需要通信时，可以直接发一个事件出去，让监听者各自监听即可