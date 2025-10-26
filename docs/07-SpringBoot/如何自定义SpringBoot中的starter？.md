# 如何自定义SpringBoot中的starter？


>   参考：https://juejin.cn/post/7371720794977615913
>
>   

## **核心步骤**

1、创建一个新的 Maven 项目作为 Starter 项目，主要是一些业务实现类

2、创建一个或多个配置类，使用 @Configuration 注解

3、创建 spring.factories 文件，位置：src/main/resources/META-INF/spring.factories ，在文件中添加对自动配置类的引用

4、使用 @ConfigurationProperties 注解创建一个属性类，以支持从 application.properties 或 application.yml 文件中读取配置。（可选）

5、将 Starter 项目打包并可能发布到 Maven 中央仓库或私有仓库

6、引用和使用


todo ✅如何自定义一个starter？