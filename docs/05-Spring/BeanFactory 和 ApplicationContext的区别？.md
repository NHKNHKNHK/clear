---
permalink: /25/8/6/java/beanfactory-applicationcontext
---

# BeanFactory 和 ApplicationContext的区别？

:::tip 

简单容器和复杂容器

:::

## 口语化

BeanFactory 和 ApplicationContext 都是用于管理和获取Bean的容器接口。

BeanFactory功能相对简单。提供了Bean的创建、获取和管理功能。默认采用延迟初始化，只有在第一次访问Bean时才会创建该Bean。因为功能较为基础，BeanFactory通常用于资源受限的环境中，比如移动设备或嵌入式设备。

ApplicationContext是BeanFactory的子接口，提供了更丰富的功能和更多的企业级特性。
默认会在启动时创建并初始化所有单例Bean，支持自动装配Bean，可以根据配置自动注入依赖对象。
有多种实现，如ClassPathXmlApplicationContext、FileSystemXmlApplicationContext、AnnotationConfigApplicationContext等。



## BeanFactory

BeanFactory是Spring框架的核心接口之一，负责管理和配置应用程序中的Bean。它提供了基本的Bean容器功能，但功能相对简单。

-   **基本功能**：BeanFactory提供了Bean的创建、获取和管理功能。它是Spring IoC容器的最基本接口。

-   **延迟加载**：BeanFactory默认采用延迟初始化（lazy loading），即只有在第一次访问Bean时才会创建该Bean。这有助于提升启动性能

-   **轻量级**：因为功能较为基础，BeanFactory通常用于资源受限的环境中，比如移动设备或嵌入式设备


## ApplicationContext

ApplicationContext默认会在启动时创建并初始化所有单例Bean（除非显式配置为延迟初始化）。这有助于在应用启动时尽早发现配置问题。

-   **增强功能**：ApplicationContext是BeanFactory的子接口，提供了更丰富的功能和更多的**企业级特性**。
    -   不仅提供了BeanFactory的所有功能，还提供了更多高级特性，如事件发布、国际化、AOP、自动Bean装配等。

-   **自动刷新**：支持自动刷新配置文件，例如当使用 XML 配置文件时，可以在不重启应用的情况下更新配置。

-   **事件传播**：支持发布/订阅事件机制，允许组件之间进行解耦通信。

-   **国际化支持**：内置对国际化（i18n）的支持，可以轻松实现多语言应用。

- **AOP 支持**：支持面向切面编程（AOP），可以方便地添加横切关注点（如日志、事务管理等）。

-   **资源访问**：简化了对各种资源（如文件、URL 等）的访问。

-   **依赖注入**：支持更复杂的依赖注入方式，如构造器注入、Setter 注入、字段注入等

-   **自动装配**：ApplicationContext支持自动装配Bean，可以根据配置自动注入依赖对象。



## 启动时间和内存占用

-   **BeanFactory**
    -   启动快：由于其轻量级特性，启动速度较快，占用的内存也较少。
    -   适合简单场景：适用于简单的应用程序或嵌入式系统。

-   **ApplicationContext**

    -   启动慢：因为加载了更多的功能模块，启动时间相对较长，内存占用也较大。

    -   适合复杂场景：适用于大型企业级应用，能够更好地处理复杂的业务需求。


## Bean 生命周期管理

-   **BeanFactory**
    -   **手动管理**：需要显式调用 `getBean()` 方法来获取 Bean 实例，并且 Bean 的生命周期管理相对简单。

-   **ApplicationContext**
    -   **自动管理**：不仅支持 `getBean()` 方法，还可以自动管理 Bean 的生命周期，包括初始化后回调（`InitializingBean` 接口）、销毁前回调（`DisposableBean` 接口）等。


## 具体实现类

-   **BeanFactory**
    -   常见实现类：`DefaultListableBeanFactory`、`XmlBeanFactory`（已废弃，推荐使用 `GenericApplicationContext`）

-   **ApplicationContext**
    -   常见实现类：
        -   `ClassPathXmlApplicationContext`：从类路径下的 XML 文件加载配置。
        -   `FileSystemXmlApplicationContext`：从文件系统中的 XML 文件加载配置。
        -   `AnnotationConfigApplicationContext`：基于注解配置的上下文。
        -   `WebApplicationContext`：用于 Web 应用程序，通常由 ContextLoaderListener 初始化。



| 特性           | BeanFactory                                                  | ApplicationContext                                           |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 功能丰富度     | 基本功能（Bean的创建、获取和管理功能）                       | 增强功能（事件、国际化、AOP 等）                             |
| 启动时间和内存 | 启动快，内存占用少                                           | 启动慢，内存占用大                                           |
| Bean 生命周期  | 手动管理（显式调用 `getBean()` 方法）                        | 自动管理                                                     |
| 适用场景       | 资源受限环境、简单应用                                       | 大型企业级应用、复杂业务需求                                 |
| 实现类         | `DefaultListableBeanFactory`、<br/>`XmlBeanFactory`（已废弃，推荐使用 `GenericApplicationContext`） | `ClassPathXmlApplicationContext`、<br/>`AnnotationConfigApplicationContext` |

## 选择建议

-   如果你只需要基本的 IoC 容器功能，并且希望保持轻量级和快速启动，可以选择 BeanFactory。
-   如果你需要更多高级特性（如事件传播、国际化、AOP 等），并且不介意稍微增加启动时间和内存占用，那么 ApplicationContext 是更好的选择。

