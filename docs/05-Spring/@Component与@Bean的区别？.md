# @Component与@Bean的区别？

## **口语化**

@Component和@Bean 都是非常常用的将类注册到Spring容器中的注解。

@Component需要配合@ComponentScan注解使用，Spring 会自动扫描指定包及其子包中的所有类，找到带有@Component注解的类，并将它们注册为 Bean。

@Bean 标记在方法上，方法所在的类通常需要用@Configuration注解标记。不需要扫描，主动的注入到 spring 容器中。

它的的区别主要是：

1）用法不一样：@Component必须写在类上面，@Bean需要写在方法上面，并且通常写在@Configuration标记的配置类中

>   @Bean方法不写在@Configuration标记的配置类中也可以，具体查看：
>
>   [【@Bean写在配置类与@Bean不写在配置类中的区别】](#@Bean写在配置类与@Bean不写在配置类中的区别)

2）用途不一样：@Bean有两个特殊的用途，一自己控制bean的实例化过程，二@Bean可以配置一些第三方Jar包的bean，；而@Component它是由Spring通过反射的方式默认调用无参构造器来进行实例化



## **用途不同**

-   @Component是一个通用组件，可用于普通的Java类，业务逻辑组件，持久化对象等

-   @Bean通常用于配置类上的方法上面，表示将该方法的返回对象注册到SpringIOC容器中，**用于显示声明**

## **使用方式不同**

-   @Component是一个类级别的注解，Spring通过@ComponentScan注解扫描@Component注解修饰的类，并将该类的实例对象到注册到SpringIOC容器中

-   @Bean用于配置类在的方法上面，用于在配置类中声明和配置Bean

## **控制权不同**

-   @Component修饰的类是由Spring框架通过反射的方式创建和初始化的

-   @Bean允许开发者自定义Bean的创建和配置过程，包括指定Bean的名称、作用域、依赖关系等
    -   所以Bean注解更加的灵活

