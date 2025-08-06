# Spring 提供的事件发布和监听机制？

## 口语化

>   Spring事件监听的核心机制：**观察者模式**

Spring提供的事件发布机制一般情况下我们很少使用，我们更多的时候都是在使用Spring提供的IOC、AOP等

它的主要作用是实现**业务解耦**，提高可扩展性、可维护性。

它类似于MQ消息队列，提供了一种发布订阅的机制。

Spring的事件监听器主要由三部分组成：事件、监听器、播放器（或者叫事件发布器）。

Spring提供了`ApplicationEventMulticaster`（播放器，可多播或组播）、`ApplicationEvent`、`ApplicationListener`等api，可以轻松实现简单的实现发布订阅功能。

播放器在spring中有默认的实现，我们只需要调用publishEvent方法就可以发布事件了。

>   在refresh方法中就初始化了默认的播放器
>
>   ```java
>   this.initApplicationEventMulticaster();
>   ```
>
>   它初始化的是 `SimpleApplicationEventMulticaster`

适用场景：

​	1）一些初始化操作可以使用，这样可以降低业务耦合。（前提是业务比较简单）

​	2）还有就是想要实现事件监听，但又不想引入MQ这种中间件时使用。例如：下单和扣减库存操作，扣减库存就可以适用spring的事件机制，实现业务解耦。（一般大项目都会用到MQ）



虽然我们平时用Spring的事件机制不多，但是底层源码倒是用到挺多的，比如springboot、springcloud等都大量使用了spring事件监听来进行扩展和集成。



## **Spring的事件监听的三个组成部分**

-   **事件**（`ApplicationEvent`）：负者对应响应监视器。事件源发生某事件是特定事件监听器被触发的原因。
-   **监听器**（`ApplicationListener`）：对应于观察者模式中的观察者。监听器监听特定事件，并在内部定义了事件触发后的响应逻辑
-   **事件发布器**（`ApplicationEventMulticaster`）：对应于观察者模式中的被观察者/主题，负者通知观察者对外提供发布事件和增删事件监听器的接口，维护事件和事件监听器的映射问题，并在事件发生时负责通知相关监听器。



## **一些Spring内置的事件**

1）`ContextRefreshedEvent`：当容器被实例化 或 refreshed时发布，如调用 refresh()方法，此处的实例化是指所有的bean都已经加载，后置处理器都被激活，所有单例bean都已经被实例化，所有的容器对象都已经准备好可以使用了。

如果 ApplicationContext实现类支持热重载，则refersh可以被触发多次（XmlWebApplicationContext支持热刷新，而GenericApplication不支持）

2）`ContextStartedEvent`：当容器启动时发布，即调用start()方法，已启动意味着所有的Lifecycle bean都已经显式的接收到了start信号

3）`ContextStoppedEvent`：当容器停止时发布，即调用stop()方法，即所有的Lifecycle bean都已经显式的接收到了stop信号，stopped的容器可以通过start()方法重启

4）`ContextClosedEvent`：当容器关闭时发布，即调用close()方法，关闭意味着所有的单例bean都已被销毁，关闭的容器不能 restart或 refresh

5）`RequestHandledEvent`：这只有在使用spring的DispatcherServlet时有效，当一个请求被处理完成时发布



## **示例**

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

// 发布事件
@Service
public class PersonEventService {

    @Resource
    private ApplicationEventPublisher applicationEventPublisher;

    public void createPerson(Person person) {
        applicationEventPublisher.publishEvent(new PersonChangeEvent(person, "create"));
    }
}


// 监听器的事件方式有两种：一、实现ApplicationListener接口 二、使用@EventListener注解
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

