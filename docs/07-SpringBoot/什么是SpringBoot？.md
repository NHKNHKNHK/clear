# 什么是SpringBoot？

SpringBoot是由Pivotal团队提供的全新框架，其设计的目的是用来**简化Spring应用的初始搭建以及开发过程**

## **Spring程序的缺点**

-   依赖设置繁琐（还可能会遇到依赖冲突，SpringBoot中维护着一套自己的依赖版本）
-   配置繁琐（SpringBoot中存在大量的默认配置）

## **SpringBoot程序的优点**

-   **起步依赖**（简化依赖配置，它帮我们同一管理了依赖的版本）
-   **自动配置**（简化常用工程相关配置）
-   **辅助功能**（内置服务器，.......）
-   

## SpringBoot优点的体现

### parent

-   开发SpringBoot程序要继承spring-boot-starter-parent
-   spring-boot-starter-parent中定义了若干个依赖管理（简单来说就是所有依赖的version）
-   继承parent模块可以**避免**多个依赖使用相同技术时出现**依赖版本冲突**
-   继承parent的形式也可以采用引入依赖的形式实现效果
    -   采用阿里云的SpringBoot模板创建就是引入依赖 spring-boot-starter-parent 来实现的

### starter

-   开发SpringBoot程序需要导入坐标时通常导入对应的starter
-   每个不同的starter根据功能不同，通常包含多个依赖坐标
-   使用starter可以实现快速配置的效果，达到**简化配置**的目的

**辨析 starter 与 parent**

-   starter
    -   SpringBoot中常见项目名称，定义了当前项目使用的所有依赖坐标，以达到**减少依赖配置**的目的
-   parent
    -   所有SpringBoot项目要继承的项目，定义了若干个坐标版本号（依赖管理，而非依赖），以达到**减少依赖冲突** 的目的spring-boot-starter-parent各版本间存在着诸多坐标版本不同
-   实际开发
    -   使用任意坐标时，仅书写GAV中的G和A，V由SpringBoot提供，除非SpringBoot未提供对应版本V
    -   如发生坐标错误，再指定Version（要小心版本冲突）

### 内嵌tomcat

-   内嵌Tomcat服务器是SpringBoot辅助功能之一
-   内嵌Tomcat工作原理是将Tomcat服务器作为对象运行，并将该对象交给Spring容器管理
-   变更内嵌服务器思想是去除现有服务器，添加全新的服务器

如何更改SpringBoot程序的服务器，举例如下：

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <!-- web起步依赖环境中，排除tomcat起步依赖-->
        <exclusions>
            <exclusion>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-tomcat</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
    <!-- 添加Jetty起步依赖，版本由SpringBoot的starter控制 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-jetty</artifactId>
    </dependency>
</dependencies>
```

说明： Jetty比Tomcat更轻量级，可扩展性更强（相较于Tomcat），谷歌应用引擎（GAE）已经全面切换为Jetty SpringBoot内置服务器

-   Tomcat（默认）
    -   apache出品，粉丝多，应用面广，负载了若干较重的组件
-   Jetty
    -   **更轻量级**，负载性能远不及tomcat
-   undertow
    -   负载性能勉强跑赢tomcat



## SpringBoot特点

-   遵 `约定优于配置` 的原则，只需要很少的配置或使用默认的配置。
-   能够使用内嵌的Tomcat、Jetty等服务器，不需要部署war文件。
-   提供定制化的启动器Starters，简化Maven配置，开箱即用。
-   纯Java配置，没有代码生成，也不需要XML配置。
-   提供了生产级的服务监控方案，如安全监控、应用监控、健康检测等
