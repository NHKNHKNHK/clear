---
permalink: /25/8/6/spring/beanDefinition
---


# 什么是BeanDefinition？

`BeanDefinition` 是 Spring 框架中的一个核心接口，用于描述和定义一个 Spring Bean 的元信息

它主要包含了以下内容：

-   **类信息**：Bean 所对应的类。
-   **作用域**：如单例（singleton）或原型（prototype）等。
-   **构造函数参数**：如果需要通过构造函数注入依赖。
-   **属性值**：通过 setter 方法注入的属性值。
-   **初始化方法** 和 **销毁方法**：定义 Bean 生命周期中的回调方法。
-   **其他配置**：如是否是抽象 Bean、是否延迟加载等

在 Spring 容器启动时，在解析配置（如 XML、Java 配置类、注解等）后，Spring 会将每个 Bean 的定义信息（如类名、依赖关系、作用域等）注册到 `BeanDefinitionRegistry` 中（实际是存储在beanDefinitionMap）。这是容器内部的一个注册表，用于存储所有 Bean 的定义信息