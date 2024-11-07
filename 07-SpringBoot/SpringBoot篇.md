## 什么是SpringBoot？



## SpringBoot的核心特性？



## 什么是Spring Initializr？



## SpringBoot启动过程？

1、引导类初始化：应用从main方法开始，调用SpringApplication.run()方法，创建一个SpringApplication实例

2、环境准备：SpringApplication通过prepareEnvironment()方法加载配置文件（如application.propertire或application.yml），并创建Environment对象，设置系统变量和属性源

3、上下文创建：createApplicationContext()创建应用上下文（如）

4、启动监听器

5、Bean加载与注册

6、嵌入式服务启动

7、运行启动器与命名行运行器

8、启动完成



## SpringBoot是如何通过main方法启动web项目的？



## @SpringBootApplication注解

@SpringBootApplication注解是作用于SpringBoot程序的启动类上

它是@SpringBootConfiguration、@EnableAutoConfiguration、@ComponentScan三个注解的复合注解

-   `@SpringBootConfiguration`：表示当前类是一个配置类。
-   `@EnableAutoConfiguration`：启用 Spring Boot 的自动配置机制，根据类路径中的依赖自动配置 Spring 应用程序。
-   `@ComponentScan`：自动扫描并注册带有 `@Component` 注解的类为 Spring Bean，通常会扫描当前包及其子包下的所有组件



## @ConfigurationProperties注解的作用？





## SpringBoot支持嵌入哪些Web容器？



## SpringBoot中application.properties、application.yaml、application.yml的区别？



## 如何在SpringBoot在定义和读取自定义配置？



## SpringBoot配置文件加载优先级？



## SpringBoot打成的jar包与普通jar的区别？



## SpringBoot是否可以使用xml配置？



## 如何处理SpringBoot中的全局异常？



## SpringBoot默认同时可以处理的最大连接数？



## 如何理解SpringBoot中的starter？



## 如何自定义SpringBoot中的starter？



## SpringBoot处理处理跨域请求（CORS）？



## 在SpringBoot中你是怎么使用拦截器的？





## SpringBoot中如何实现定时任务？



## 如何在SpringBoot应用中实现国际化（i18n）？



## 什么是Spring Actuator？它有什么优势？



## SpringBoot1.x、2.x、3.x版本有哪些改进与区别？



## SpringBoot中的条件注解@Conditional有什么用？



## 说说你对SpringBoot事件机制的理解？



## 在SpringBoot中如何实现多数据源配置？

ruoyi就实现了，可以参考



## SpringBoot中如何实现异步处理？



## 如何在SpringBoot启动时执行特定代码？有哪些方式？



## SpringBoot中为什么不推荐使用@Autowrited



## SpringBoot的自动配置？



SpringBoot

SpringBoot



SpringBoot

SpringBoot



SpringBoot

SpringBoot