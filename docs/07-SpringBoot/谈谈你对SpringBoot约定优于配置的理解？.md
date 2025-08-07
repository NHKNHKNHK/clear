# 谈谈你对SpringBoot约定优于配置的理解？

>   大白话就是在SpringBoot中通过约定优于配置这个思想，可以让我们少写很多的配置，然后就只需要关注业务代码的编写就行。

首先， 约定优于配置是一种软件设计的范式，它的核心思想是减少软件开发人员对于配置项的维护，从而让开发人员更加聚焦在业务逻辑上

Spring Boot就是约定优于配置这一理念下的产物，它类似于Spring框架下的一个脚手架，通过Spring Boot，我们可以快速开发基于Spring生态下的应用程序。

基于传统的Spring框架开发web应用，我们需要做很多和业务开发无关并且只需要做一次的配置，比如

1.  管理jar包依赖
2.  web.xml维护
3.  Dispatch-Servlet.xml配置项维护
4.  应用部署到Web容器
5.  第三方组件集成到Spring IOC容器中的配置项维护

而在Spring Boot中，我们不需要再去做这些繁琐的配置，Spring Boot已经自动帮我们完成了，这就是约定由于配置思想的体现。

Spring Boot约定优于配置的体现有很多，比如

1.  Spring Boot Starter启动依赖，它能帮我们管理所有jar包版本
2.  如果当前应用依赖了spring mvc相关的jar，那么Spring Boot会自动内置Tomcat容器来运行web应用，我们不需要再去单独做应用部署。
3.  Spring Boot的自动装配机制的实现中，通过扫描约定路径下的spring.factories文件来识别配置类，实现Bean的自动装配。
4.  默认加载的配置文件application.properties、application.yml等等。

总的来说，约定优于配置是一个比较常见的软件设计思想，它的核心本质都是为了更高效以及更便捷的实现软件系统的开发和维护。
