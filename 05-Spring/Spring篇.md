## 什么是循环依赖？:star:



## Spring如何解决循环依赖？



## 为什么Spring循环依赖需要三级缓存，二级不够吗？



## 看过源码吗？说说Spring由哪些重要的模块组成？



## Spring的优点？



## 什么是SpringIOC？



## SpringIOC容器初始化过程？



## SpringIOC有什么好处？



## Spring中的DI是什么？



## Spring中的BeanFactory是什么？



## Spring中的FactoryBean是什么？



## Spring中的ObjectFactory是什么？



## Spring中的ApplicationContext是什么？



## Spring Bean一共有几种作用域？



## Spring一共有几种注入方式？



## 什么是AOP？



## Spring AOP相关术语有哪些？



## Spring AOP默认用的是什么代理？两者区别？



## 简述Spring拦截链的实现？



## Spring AOP和AspectJ有什么区别？



## Spring Bean的生命周期？



## Spring都用到哪些设计模式？



## Spring事务有几个隔离级别？





## Spring有哪几种事务传播行为？



## Spring事务传播行为有什么用？



## Spring事务在哪几种情况下会失效？为什么？



## Spring通知类型有哪些？



## Spring Bean注册到容器有哪些方式？



## Spring自动装配的方式有哪些？



## @PropertySource注解的作用？



## @Qualifier注解有什么用？



## @ComponentScan注解的作用？



## @Bean和@Component有什么区别？



## @Component、@Controller、@Repository和@Service的区别？



## 说说Spring启动过程？



## Spring单例Bean使用有并发安全问题？



## Spring Bean如何保证并发安全问题？



# 注解篇



## @Component与@Bean的区别？

**用途不同**

-   @Component是一个通用组件，可用于普通的Java类，业务逻辑组件，持久化对象等

-   @Bean通常用于配置类上的方法上面，表示将该方法的返回对象注册到SpringIOC容器中

**使用方式不同**

-   @Component是一个类级别的注解，Spring通过@ComponentScan注解扫描@Component注解修饰的类，并将该类的实例对象到注册到SpringIOC容器中

-   @Bean用于配置类在的方法上面，用于在配置类中声明和配置Bean

**控制权不同**

-   @Component修饰的类是由Spring框架来创建和初始化的

-   @Bean允许开发者自定义Bean的创建和配置过程，包括指定Bean的名称、作用域、依赖关系等
    -   所以Bean注解更加的灵活



## @Autowrited注解的作用？它与@Resource的区别？



## @Scope注解的作用？



## @Primary注解的作用？



## @Value注解的作用？







## @Profile注解的作用？



## @PostConstruct和@PreDestory注解的作用？



## @ExceptionHandler注解的作用？





## @ResponseStatus注解的作用？







## @Validated和@Valid注解的作用？





## @Scheduled注解的作用？





## @Cacheable和@CacheEvict注解的作用？



## @Conditional注解的作用？



## @Lazy注解的作用？



## @PropertySource注解的作用？



## @EventListener注解的作用？



## Spring和SpringMVC的关系？



## Spring中的JPA和Hibernate有什么区别？