# SpringCloud与SpringBoot之间的区别（关系）？

SpringCloud与SpringBoot都是Spring大家族中的一员，它们在微服务开发中都扮演者十分重要的角色，两者之间即存在区别，也存在联系

-   1、SpringBoot与SpringCloud的**分工不同**
    -   SpringBoot是一个基于Spring的快速开发框架，它能够帮助开发者迅速的去搭建Web工程。在微服务开发中，SpringBoot专注于快速方便的开发单个微服务应用程序
    -   SpringCloud是微服务架构下的一站式解决方案，Cloud专注于全局微服务协调和治理工作。
        -   换句话说，SpringCloud相当于是微服务的大玩家，负责将SpringBoot开发的一个个微服务管理起来，并为他们提供一些服务。比如说配置管理、服务发现、断路器、路由、微代理、事件总线、角色竞选以及分布式会话等这些服务

-   2、**SpringCloud是基于SpringBoot实现的**
    -   与SpringBoot类似，SpringCloud也提供了一系列的starter，这些starter是springCloud使用SpringBoot思想，对各个微服务架构进行再封装的产物，它屏蔽掉了这些微服务架构中复杂的配置和实现原理，使开发人员能够快速方便的使用SpringCloud来搭建一套分布式微服务系统

-   3、SpringBoot与SpringCloud**依赖项数量不同**
    -   SpringBoot属于一种轻量级的框架，构建SpringBoot工程所需的依赖项较少
    -   SpringCloud是一系列微服务框架技术的结合体，它的每个组件儿都需要一个独立的依赖项，因此想要构建一整套完整的SpringCloud工程，往往需要大量的依赖项
