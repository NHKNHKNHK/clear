# 什么是Nacos？

nacos的英文全称是Dynamic Naming and Configuration Service, 它是由阿里巴巴团队使用Java语言开发的一个开源的项目。

## **Nacos是什么**

官网给的介绍是说，Nacos是一个更易于构建云原生应用的动态服务，发现配置管理和服务管理的平台。



## **Nacos的名称组成部分？**

Nacos命名由三部分组成

-   na，na就是Naming的简写，它是服务注册中心，相当于与Spring Cloud EureKa的功能类似
-   co，co是Configuration的简写，即表示配置中心，与Spring cloud Config + Spring cloud Bus的功能类似
-   s，s 是service的简写，即表示服务，它是表示Nacos的服务注册中心与服务配置中心。都是以服务为核心的

因此我们可以把Nacos理解为是服务注册中心和服务配置中心的组合体。它可以替代EureKa作为服务的注册中心，实现服务的注册与发现，它也可以替代Spring cloud Config作为配置中心，从而来实现配置的自动刷新，这是它的功能。

最后我们可以得出这样的一个公式

>   Nacos = EureKa + Config + Bus



Nacos作为服务注册中心，在阿里经历了十余年的双11流量洪峰考验，它具有简单应用、稳定可靠、性能卓越的优点，可以帮助用户更敏捷、更容易的去构建和管理微服务应用。服务可以说是Nacos世界的“一等公民”。



## **Nacos支持哪些主流类型的服务？**

Nacos支持几乎所有主流类型的服务的发现、配置和管理。

例如，K8s服务、gRPC服务、Dubbo RPC服务、Spring Cloud RESTful类型服务
