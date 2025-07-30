## 什么是单体应用架构？

早期应用程序的数量规模都比较小，项目所有的功能模块儿都放在同一个工程中，编码、编译、打包并部署在一个Tomcat容器中。这种架构模式就是单体应用架构。

这样的架构既简单实用，便于维护，成本又低，成为那个时代的主流架构方式。

**优点**

-   **高效开发**，项目开发前期节奏快，团队成员少的时候能够快速的迭代
-   **架构简单**，采用MVC的架构，只需要借助于IDE开发调试即可。
-   **易于测试**，只需要通过单元测试或者浏览器测试就可以完成。
-   **易于部署**，我们可以打成单一可执行的jar包，或者打成war包放到容器内启动即可。

单体架构的应用比较容易部署和测试，在项目的初期，单体应用可以很好的运行，然而随着需求的不断增加，越来越多的人开始加入到开发团队，代码库也在飞速的膨胀，慢慢的单体应用架构变得越来越臃肿。可维护性、灵活性也逐渐的降低，维护成本越来越高。

**缺点：**

-   可靠性差，某个应用程序出现了Bug，例如死循环、内存溢出等，可能会导致整个应用的崩溃
-   复杂性高，以一个百万行级别的单体应用为例，整个项目包含的模块很多，模块之间的边界模糊，依赖关系不清晰，代码质量参差不齐，混乱的堆写在一起，使得整个应用程序非常的复杂
-   扩展能力受限，单体应用只能作为一个整体进行扩展，无法根据业务模块的需要进行扩展。
    -   例如，应用中有些模块是计算密集型的，需要强劲的CPU；有些是IO密集型的，需要更大的内存，由于这些模块部署在了一起，不得不在硬件的选择上做出妥协。
    -   为了满足业务量上涨的需求，单体应用进一步丰富变化，比如应用集群部署，使用Nginx进行负载均衡，增加缓存服务器、增加文件服务器、增加数据库集群，并作读写分离操作。

通过以上措施增强高并发的能力，应对一定的复杂业务场景处理的能力，但它依然属于单体应用架构



## 什么是垂直应用架构？

为了避免单体应用架构带来的问题，我们可以做项目的模块儿垂直划分

**垂直划分的原则**

基于项目的现有业务逻辑特性来做

**核心目标**

-   1、为了业务逻辑之间互不影响。

-   2、在研发团队不断壮大之后，为了提高效率，减少组件之间的依赖
    -   以一个求职网站为例，我们可以将项目通过垂直架构划分为单点登录、主站、简历管理、职位管理、Admin系统、公司入驻等不同的模块。采用的技术呢，我们可以通过ES集群、Redis集群、MYSQL集群、文件集群等这样的技术。

**优点**

-   1、系统拆分实现了流量分担，解决了并发问题
-   2、可以针对不同模块儿进行优化

-   3、方便水平扩展、负载均衡、容错率提高
-   4、系统间相互调用，互不影响，新的业务逻辑迭代时更加的高效

**缺点**

-   1、服务之间相互调用，如果某个服务的端口或者IP发生改变，调用的系统需手动改变
-   2、搭建集群之后，实现负载均衡，比较复杂，如内网负载。在迁移机器时，会影响调用方的路由，导致线上故障

-   3、服务之间调用方式不统一，基于HttpClient、WebService**接口协议不统一**
-   4**、服务监控不到位**除了依靠端口进程的监控，调用的成功率、失败率、总耗时等这些监控指标是没有的



## 什么是SOA应用架构？

项目在做垂直架构划分后会带来一些问题，常见的有模块随之增多，维护的成本也在变高，一些通用的业务和模块重复的越来越多的。

为了解决垂直应用架构带来的**接口协议不统一**，**服务无法监控**，**服务的负载均衡**的问题，我们可以引入阿里巴巴开源的Dubbo框架

Dubbo是一款高性能轻量级的开源Java RPC框架，可以和spring框架无缝集成。

Dubbo提供了三大核心功能，分别是：

-   面向接口的远程方法调用
-   智能容错和负载均衡，
-   服务的自动注册和发现。

SOA即Service-Oriented-Architecture，表示“面向服务的架构”。SOA是一个组件模型，它将应用程序的不同功能单元进行拆分，并通过这些服务之间定义好的接口和协议联系起来。接口是采用中立的方式进行定义的，它采用独立于实现服务的硬件平台、操作系统和编程语言，这使得构建在各种各样的系统中的服务，可以以一种统一和通用的方式进行交互。主要使用WebService、Dubbo等技术进行通信。

以一个求职招聘系统为例，采用SOA架构设计该系统，可分为展示层、业务服务层、基础业务层、基础服务层、存储层，我们可以使用Dubbo、Zookeeper这样的技术在项目当中

**SOA优点**

分布式、松耦合、扩展灵活、可重用

**SOA缺点**

服务抽取力度较大、服务调用方和提供方耦合度较高



## 什么是微服务？你是怎么理解微服务的？

微服务最初是由Martin Fower于2014年发表的论文《MicroServices》中提出的名词，它一经提出就成为技术圈的热门话题。

微服务架构是一种系统架构设计风格，与传统的单体架构不同，微服务架构倡导将一个单一的应用程序拆分成多个小型的服务，这些小型服务都在各自独立的进程当中运行。服务之间使用轻量级的通信机制进行通信（通常是HTTP协议上的RESTful API）。

通常情况下，这些小型服务都是围绕着某个特定的业务进行构建的，**每一个服务只专注于完成一项任务并把它做好**。即专业的人做好专业的事。每个服务都能够独立的部署到各种环境中，比如开发环境、测试环境和生产环境等，每个服务都能够独立的启动或销毁。而不会对其他服务造成影响。这些服务之间的交互是使用标准的通讯技术进行的，因此不同的服务可以使用不同的数据存储技术，甚至可以使用不同的编程语言。

微服务架构可以说是**SOA架构的一种扩展**，这种架构模式下，它拆分的力度更小，服务更加的独立，把应用拆分成一个个微小的服务。不同的服务可以使用不同的开发语言和存储技术。服务之间往往使用Restful的方式进行轻量级的通信。

微服务架构**关键**在于**微小独立轻量级通信**。微服务是在SOA上所做的升华，它的拆分力度更加的细致。服务架构强调的一个重点是业务需要彻底的组件化和服务化。

**微服务架构优点**

-   1、服务按照业务来划分，每个服务通常只专注于某一个特定的业务所需代码量小，复杂度低，易于维护
-   2、每个服务都可以独立开发，易于部署和运行，且代码量较小，因此启动和运行速度非常快
-   3、每个服务从设计、开发、测试到维护所需要的团队规模较小。一般8~10人即可，团队管理成本非常的小
-   4、采用单体架构的应用程序，只要有任何修改，就需要重新部署整个应用程序才能生效。而微服务则完美的解决了这个问题。在微服务架构中，整个服务修改后，我们只需要重新部署这个服务即可，而不需要重新部署整个应用程序
-   5、在微服务架构中，开发人员可以结合项目、业务及团队的特点。合理的选择编程语言和工具进行开发和部署，不同的微服务可以使用不同的语言和工具。
-   6、微服务具有良好的可扩展性，随着业务的不断增加，微服务的体积和代码量都会急剧膨胀。此时，我们可以根据业务逻辑将微服务再次进行拆分。
    -   除此之外，当用户量和并发量增加时，我们还可以将微服务进行集群化部署。从而增加系统的负载均衡能力
-   7、微服务能够与容器配合使用，实现快速迭代、快速构建、快速部署。
-   8、微服务具有良好的故障隔离能力，当应用程序中的某个微服务发生故障时，该故障会被隔离在当前服务中，而不会涉及到其他服务，造成整个系统的瘫痪
-   9、微服务系统具有链路追踪的能力

**微服务架构缺点**

-   1、微服务架构下分布式链路追踪比较困难

-   2、微服务架构下分布式复杂难以管理。当服务数量不断增加时，管理也将越来越复杂



## 单体应用、SOA、微服务架构有什么区别？



## 什么是SpringCloud？

Spring cloud是一系列框架的有序集合，它利用SpringBoot开发的便捷性，巧妙的简化了分布式系统基础设施的开发，如服务发现与注册、配置中心、消息总线、负载均衡、断路器、数据监控等都可以用SpringBoot的开发风格做到一键启动和部署。

说白了，Spring Cloud就是基于 Spring Boot 提供了一套**一站式微服务解决方案**

Spring cloud并没有重复的去造轮子，它只是将目前各家公司开发的比较成熟，经得起实际考验的服务框架组合起来，通过spring风格进行再封装，屏蔽掉了复杂的配置和实现原理，最终给开发者留出了一套简单易懂、易部署和易维护的分布式系统开发工具包。

这里我们需要注意的是，Spring cloud其实是一套规范，是一套**用于构建微服务架构的规范**。而不是一个可以拿来开箱即用的框架。所谓的规范就是应该具有哪一些功能组件儿，然后组件之间怎么配合，共同完成什么样的事情。

**Spring cloud能解决什么问题呢？**

Spring cloud的规范及实现意图要解决的问题，其实就是微服务架构实施过程中的一些问题，比如微服务架构中的服务注册发现问题、网络问题、统一认证、安全授权问题、负载均衡问题、链路追踪等问题，当然它还提供像分布式配置、智能路由服务、调用熔断器、选举锁、选举集成、状态管理、分布式消息传递等这些功能。



## SpringCloud的组成（架构）？

Spring cloud是一个微服务相关的规范，这个规范的意图为搭建微服务架构提供一站式服务，采用组件化的机制定义一系列组件，各类组件针对性的处理微服务中的特定问题，这些组件共同构成了spring cloud的技术栈。

Cloud有哪些核心的组件？Spring cloud生态圈中的组件，我们可以按照发展分为：

-   第一代主要以Netflix为主，SpringCloud Netflix
-   第二代主要以阿里巴巴为主，SpringCloud Alibaba



## 微服务架构中有哪些核心概念？

-   **服务注册与服务发现**
    -   服务注册表示服务提供者将所提供的服务，比如服务的IP、端口、访问协议等信息注册登记到服务注册中心中
    -   服务发现表示服务消费者能够从注册中心中获取到较为实时的服务列表，然后根据一定的策略选择一个服务进行访问

-   **负载均衡**
    -   负载均衡即将请求的压力分配到多个服务器上，如应用程序服务器、数据库服务器等，以此来提高应用程序的性能和可靠性

-   **熔断**
    -   熔断即断路保护，微服务架构中，如果下游因访问压力过大，响应速度变慢或失败，上游服务为了保护系统的整体可用性，可以暂时切断对下游服务的调用。那这种牺牲局部保护整体的措施称作为熔断

-   **链路追踪**
    -   微服务架构中，一个项目往往拆分成很多个服务，那么一次请求就需要涉及到很多个服务。不同的微服务可能是由不同的团队所开发，甚至可能使用不同的编程语言实现，整个项目也有可能部署在多台服务器上，横跨多个不同的数据中心。所谓链路追踪就是对一次请求涉及到很多个服务链路进行日志记录、性能监控

-   **API网关**

    -   微服务架构下，不同的微服务往往会有不同的访问地址、客户端可能需要调用多个服务的接口才能完成一个业务的需求。如果让客户端直接与每个微服务进行通信，可能会出现以下的问题

        -   客户端需要调用不同的URL地址，增加了维护调用的难度
        -   每个微服务都需要进行单独的身份验证，在一定的场景下也存在跨域请求的问题。
        - 那么API网关就可以较好的统一处理上述所有的问题。API请求调用统一接入API网关层，由网关进行转发和请求。API网关更加的专注在安全、路由、流量等问题的处理上

    - API网关它的主要功能有统一接入、长短链路支持、流量管控、容错能力、协调设备、黑白名单、安全防护等



## SpringCloud有哪些核心组件？

按照发展可以为第一代spring cloud组件（以netfli公司出品的技术为主）和第二代spring cloud组件（以阿里巴巴出品的技术栈为主）

**Spring Cloud Netflix**

-   服务注册与发现中心：Eureka
-   负载均衡：Ribbon
-   熔断器：Hystrix
-   网关：Zuul
    -   但是Zuul性能一般，已经退出了spring cloud的生态圈
-   分布式配置中心：Config
-   服务调用：Feign
-    消息驱动：Stream流
-   分布式链路追踪：Sleuth+Zipkin

随着第一代微服务核心组件大部分已经停更，那么Netflix公司所推出的技术栈也将逐渐的会退出历史的舞台

**Spring Cloud Alibaba**

-   服务注册与发现中心：Nacos
-   负载均衡：Loadbalancer
-   熔断器：Sentinel
-   网关：Higress（下一代云原生网关）
    -   也可以使用Cloud官方的Spring Cloud Gateway

-   分布式配置中心：Nacos
-   服务调用：Dubbo RPC
    -   也可以使用Cloud官方的Spring Cloud OpenFeign

-   分布式链路追踪：Skywalking

-   分布式事务：Seata



## SpringCloud Alibaba的组成？

Spring Cloud Alibaba吸收了Spring Cloud Netflix的核心架构思想，并进行了高性能的改进，自Spring Cloud Netflix停止更新维护后，Spring Cloud Alibaba逐渐成为了主流的微服务开发框架，他也是国内首个进入Spring社区的开源项目

**Spring Cloud Alibaba**

-   服务注册与发现中心：Nacos
-   负载均衡：Loadbalancer
-   熔断器：Sentinel
-   网关：Higress（下一代云原生网关）
    -   也可以使用Cloud官方的Spring Cloud Gateway

-   分布式配置中心：Nacos
-   服务调用：Dubbo RPC
    -   也可以使用Cloud官方的Spring Cloud OpenFeign

-   分布式链路追踪：Skywalking、Artchas（基于Java字节码增强技术实现，功能极为强悍）

-   分布式事务：Seata
-   分布式消息系统：RokcetMQ



**Cloud Alibaba商业化组件**

-   覆盖全球的短信服务：Alibaba Cloud SMS

-   分布式任务调度：Alibaba Cloud SchedulerX

-   阿里云对象存储服务：Alibaba Cloud OSS



## SpringCloud的优缺点？



## SpringCloud与SpringBoot之间的区别（关系）？

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



## Spring、SpringBoot、SpringCloud之间的关系？





## SpringCloud版本该如何选择？

SpringCloud包含了许多子项目，这些子项目呢，都是独立进行内容更新和迭代的，各自都维护着自己的发布版本号。为了避免SpringCloud的版本与其子项目的版本混淆掉，Cloud没有采用常见的数字版本号。而是通过以下的方式来定义版本的信息

```xml
{version.name}.{version.number}
```

说明：

​	version.name表示的是版本号，采用的是英国伦敦地铁的地铁站名来进行命名的，并按照字母的顺序A到Z来对应SpringCloud的版本发布的顺序

​	version.number表示的是版本号，每一个版本的SpringCloud在更新内容积累到一定的量级，或有重大的bug修复时，它就会发布一个叫service releases版本（简称SRX版本），其中这个X是一个递增的数字。



在使用SpringBoot与SpringCloud进行微服务项目开发时，我们需要**根据**项目中的**SpringBoot的版本来决定SpringCloud的版本**，否则会出现许多意想不到的错误。那我们可以通过访问SpringCloud的官方这个网址，来查看SpringCloud与SpringBoot对应的版本信息

https://spring.io/projects/spring-cloud

官网还为我们提供了另外一个访问接口，来获取SpringCloud与SpringBoot对应版本信息，但是它返回的是Json格式的数据：

https://start.spring.io/actuator/info



阿里云脚手架：https://start.aliyun.com/



## 微服务能解决哪些问题呢？







## 什么是Nacos？

nacos的英文全称是Dynamic Naming and Configuration Service, 它是由阿里巴巴团队使用Java语言开发的一个开源的项目。

**Nacos是什么呢？**

官网给的介绍是说，Nacos是一个更易于构建云原生应用的动态服务，发现配置管理和服务管理的平台。



**Nacos的名称组成部分？**

Nacos命名由三部分组成

-   na，na就是Naming的简写，它是服务注册中心，相当于与Spring Cloud EureKa的功能类似
-   co，co是Configuration的简写，即表示配置中心，与Spring cloud Config + Spring cloud Bus的功能类似
-   s，s 是service的简写，即表示服务，它是表示Nacos的服务注册中心与服务配置中心。都是以服务为核心的

因此我们可以把Nacos理解为是服务注册中心和服务配置中心的组合体。它可以替代EureKa作为服务的注册中心，实现服务的注册与发现，它也可以替代Spring cloud Config作为配置中心，从而来实现配置的自动刷新，这是它的功能。

最后我们可以得出这样的一个公式

>   Nacos = EureKa + Config + Bus



Nacos作为服务注册中心，在阿里经历了十余年的双11流量洪峰考验，它具有简单应用、稳定可靠、性能卓越的优点，可以帮助用户更敏捷、更容易的去构建和管理微服务应用。服务可以说是Nacos世界的“一等公民”。



**Nacos支持哪些主流类型的服务？**

Nacos支持几乎所有主流类型的服务的发现、配置和管理。

例如，K8s服务、gRPC服务、Dubbo RPC服务、Spring Cloud RESTful类型服务



## Nacos有哪些特性？

**服务发现**：Nacos支持基于DNS和RPC的服务发现，当服务提供者使用原生SDK或Open API 或者一个独立的Agent向Nacos注册服务时，服务的消费者可以在Nacos上通过DNS或HTTP去发现和寻找服务

**服务健康监测**：Nacos提供对服务的实时健康检查，能够阻止不健康的服务发送到主机和服务实例上。Nacos还提供了一个健康检查的仪表盘，能够帮助我们根据健康的状态去管理服务的可用性以及服务的流量。

**动态配置服务**：可以让我们以中心化、外部化和动态化的方式管理所有应用的应用配置和服务配置，Nacos提供了一个简单应用的UI界面儿，这个UI界面儿上呢，我们就可以去对所有的服务和应用进行配置管理

**动态DNS服务**：Nacos还为我们提供了动态的DNS服务，它能够让我们更加容易轻松的去实现负载均衡、流量控制以及以数据为中心的内网简单DNS的解析服务，而且那个还为我们提供了一些简单的DNS API，可以帮助我们去管理服务关联的域名和可用的IP列表。

**服务及其元数据的管理**：Nacos可以管理数据中心所有的服务以及元数据。比如说它包括服务的描述、服务的生命周期、服务的静态依赖、服务的健康状态、服务的流量管理、路由、安全策略等等，它也可以做一些统计工作，比如说SLA，还有metrics统计数据分析数据等这样的一些功能

 

## Nacos两大组件分别是什么？

Nacos有两大核心组件，这一点跟Eureka非常的相似，采用的也是C/S类型的架构

**Nacos Server**：

-   Nacos 服务端，这是Nacos的核心部分，由阿里巴巴团队使用Java语言开发。
-   Nacos Server 提供了一个**服务注册中心**的功能，它支持服务的注册与发现，能够帮助客户端实现服务之间的相互发现和调用。
-   除了服务发现，Nacos Server 还提供了**配置管理**的功能，允许以中心化的方式存储和管理微服务架构中的配置信息。
-   用户需要自行下载并部署Nacos Server，以便为客户端提供服务注册、发现以及配置管理等功能。
    -   而Eureka Server需要自己去开发这个服务端

**Nacos Client**：

-   Nacos 客户端，这部分通常是指集成到应用程序中的SDK或客户端库，使得应用程序能够与Nacos Server交互。
-   客户端可以向Nacos Server 注册服务、获取服务列表、监听服务变化以及获取和更新配置信息。
-   Nacos Client 支持多种编程语言，方便不同语言编写的微服务应用接入Nacos生态系统。



## 什么是配置中心？有哪些常见配置中心？





## 什么是Nacos配置中心？



## 什么是Nacos的领域模型？



## 什么是Nacos Server集群？



## Nacos Server集群该如何搭建？



## 什么是服务端负载均衡？



## 什么是客户端负载均衡？





## Nacos配置中心实现原理？



## 为什么需要服务注册发现？



## 为什么需要在微服务中使用链路跟踪？SpringCloud可以选择哪些微服务链路跟踪方案？



## SpringCloud Config是什么？



## 你们的服务是怎么做日志收集的？



## 什么情况下需要使用分布式事务，有哪些解决方案？





## 什么是seata？谈谈你的理解？



## seata支持哪些模式的分布式事务？



## seata的实现原理？



## seata的事务执行流程？



## seata的事务回滚是怎么实现的？



## 微服务带来的挑战？



## 微服务之间的通信方式？微服务之间如何交互？

微服务架构是一种分布式软件设计模式，它将大型应用程序拆分为一组小型服务，每个服务都运行在自己的进程中，并使用轻量级通信机制（如HTTP API）进行通信。

比如一个大型商城项目，我们可以拆分为订单服务、支付服务、购物车服务、商品服务。。。。。

微服务之间的交互通常通过以下几种方式进行：

-   **HTTP REST API**
    -   这是微服务之间最常见的交互方式。每个微服务都暴露一组REST API，供其他微服务调用。
    -   HTTP（HyperText Transfer Protocol）或HTTPS是传输协议的首选，因为它基于开放的标准，可以在多种平台和编程语言中使用。
    -   JSON（JavaScript Object Notation）或XML（eXtensible Markup Language）通常用作数据交换的格式。
-   **gRPC**
    -   gRPC是一个高性能、开源、通用的远程过程调用（RPC）框架，它面向移动和HTTP/2设计。
    -   gRPC使用Protocol Buffers（protobuf）作为接口定义语言（IDL），允许开发者定义服务接口和消息类型，然后可以生成客户端和服务端的代码。
    -   gRPC支持多种编程语言，并且具有比HTTP/REST更低的延迟和更高的吞吐量。
-   **消息队列**（如RabbitMQ, Apache Kafka等）：
    -   消息队列允许微服务之间进行异步通信。生产者将消息发送到队列，消费者从队列中拉取消息并处理。
    -   这种方式特别适用于需要**解耦**、**异步处理**或确保消息**可靠**传递的场景。
    -   消息队列还提供了诸如发布/订阅、消息持久化、负载均衡等高级功能。
-   **服务发现与注册**（如Consul, Eureka等）
    -   在微服务架构中，服务的数量可能是动态的，因此需要一种机制来发现和定位服务实例。
    -   服务注册中心允许服务实例注册自己并提供元数据（如主机名、端口号等）。
    -   客户端使用服务发现机制来查找并连接到所需的服务实例。
-   **API网关**
    -   API网关是微服务架构中的一个重要组件，它位于客户端和微服务之间，负责路由、认证、限流、监控等功能。
    -   客户端通过API网关与服务交互，而无需直接与微服务通信。这降低了客户端的复杂性，并允许引入额外的功能，如统一的身份验证和授权机制。
-   **事件驱动架构 (Event-driven architecture)**
    -   在事件驱动架构中，**微服务通过发布和订阅事件进行通信**。当一个微服务执行某项操作时，它会发布一个事件，其他对该事件感兴趣的微服务会收到通知并执行相应的操作。
    -   这种方式允许微服务之间实现松耦合的通信，并降低了服务之间的依赖关系。
-   使用分布式追踪和监控工具
    -   为了确保微服务之间的交互正常且高效，需要使用分布式追踪和监控工具来跟踪和分析微服务之间的请求和响应。
    -   这些工具可以帮助开发者识别性能瓶颈、故障点和其他潜在问题，并采取相应的措施进行修复和优化。



## 微服务体系如何传递用户信息？

在微服务体系中，用户信息的传递是一个关键的部分，它确保了在多个微服务之间能够正确地识别和处理用户请求。主要有以下几种方式：

**使用令牌（Token）**：

- 当用户登录成功后，服务会生成一个令牌（通常是JWT，即JSON Web Tokens），这个令牌包含了用户的身份信息和有效期等。
- 客户端（如前端应用、移动端应用等）会在后续的请求中，将令牌放入HTTP请求的头部（通常是`Authorization`头，格式为`Bearer <token>`）。
- 微服务之间在调用时，也会将这个令牌作为请求头的一部分传递给下一个服务，从而实现了用户信息的传递。

**通过API网关层处理**：

- API网关是微服务架构中的一个重要组件，它位于客户端和微服务之间，负责请求的路由、认证、限流等功能。
- 客户端的请求会首先到达API网关（如Spring Cloud Gateway），网关会对请求进行验证（如验证令牌的有效性），如果认证成功，会将请求转发给相应的微服务。
- 在请求转发的过程中，API网关可以将用户信息（如用户ID、用户名等）添加到请求头中，或者将用户信息放入请求体中，然后传递给下游的微服务。

**使用分布式追踪系统**：

- 分布式追踪系统（如Zipkin、Jaeger等）可以跟踪微服务之间的调用关系，从而帮助开发者理解用户请求在整个系统中的处理流程。
- 在这个过程中，用户的身份信息也可以被传递和记录，以便在出现问题时能够快速地定位和解决。

**ThreadLocal存储**：

- 在某些情况下，为了在不同的线程之间传递用户信息，可以使用Java中的ThreadLocal类来存储用户信息。
- 当一个请求到达某个微服务时，可以从请求头或请求体中获取用户信息，并将其存储在ThreadLocal中。然后，在这个微服务的后续处理过程中，就可以通过ThreadLocal方便地获取用户信息了。

**服务之间通信机制**：

- 微服务之间的通信通常通过RESTful API、gRPC等方式进行。在这些通信机制中，用户信息可以作为请求的一部分进行传递。
- 例如，在RESTful API中，可以将用户信息放入HTTP请求的头部或请求体中；在gRPC中，可以将用户信息放入消息体中进行传递。



## 分布式和微服务的区别？



## 现在流行的微服务框架？



## 微服务架构是如何运行的？



## SpringCloud有哪些注册中心？



## 什么Eureka？



## Eureka的实现原理？



## Eureka的自我保护模式是什么？



## Eureka的高可用是怎么实现的？



## SpringCloud是如何实现服务注册的？



## Eureka和Zookeeper的区别？



## Consul是什么？



## Eureka、Zookeeper、Consul的区别？



## Eureka、Zookeeper、Nacos的区别？

| 特性     | Eureka                         | Zookeeper                       | Nacos                              |
| -------- | ------------------------------ | ------------------------------- | ---------------------------------- |
| 开发公司 | Netflix                        | Apache基金会                    | 阿里巴巴                           |
| CAP      | AP（可用性、分区容忍性）       | CP（一致性、分区容忍性）        | 既支持**CP**、也支持**AP**         |
| 功能     | 服务注册与发现                 | 分布式协调、配置管理、分布式锁  | 服务注册与发现、配置管理、服务管理 |
| 定位     | 适用于构建基于HTTP的微服务架构 | 通用的分布式协调服务框架        | 适用于微服务和云原生应用           |
| 访问协议 | HTTP                           | TCP                             | HTTP 或 DNS                        |
| 自我保护 | 支持                           | -                               | 支持                               |
| 数据存储 | 内嵌数据库、多个实例组成集群   | ACID特性的分布式文件系统ZAB协议 | 内嵌数据库、MySQL等                |
| 健康检查 | Client Base                    | Keep Alive                      | TCP/HTTP/MySQL/Client Base         |
| 特点     | 简单易用、自我保护机制         | 高性能、强一致性                | 动态配置管理、流量管理、灰度发布等 |



## Eureka、Zookeeper、Nacos注册中心的区别？



## Nacos的服务注册表结构是什么样的？



## Nacos中的Namespace是什么？如何使用它来组织和管理微服务？



## 为什么需要负载均衡？



## 在SpringCloud中怎么使用服务的负载均衡？



## 负载均衡的实现方式有哪些？



## 负载均衡有什么策略？



## Ribbon和Nginx的区别？



## Http和RPC的区别？

Http和RPC是两种常见的通信协议。

Http接口：





## Ribbon和Feign调用服务的区别是什么？



## 什么是Feign（Spring Cloud Netflix Feign）？





## 什么是OpenFeign？

OpenFeign由Spring官方推出的一个**声明式**的**HTTP客户端**库，用于简化微服务架构中的服务间通信。它是Spring Cloud生态系统的一部分，旨在提供一种简洁的方式来定义HTTP客户端接口，使得调用远程服务就像调用本地方法一样简单。

**主要特点**

1.  **声明式接口定义**：
    -   开发者只需定义一个接口，并使用注解来描述HTTP请求的细节，如URL、HTTP方法、请求参数等。OpenFeign会自动生成客户端来执行这些请求（动态代理的方式）。
2.  **支持Spring MVC注解**：
    -   OpenFeign不仅支持Feign原有的注解，还支持JAX-RS注解、**Spring MVC注解**，使得定义HTTP客户端更加直观和便捷。
3.  **易于集成Spring Cloud生态系统**：
    -   OpenFeign可以与Spring Cloud的其他组件**无缝集成**，例如Eureka（服务注册中心）、Ribbon（客户端负载均衡器）、loadbalancer（客户端负载均衡器）等，从而实现自动化的负载均衡和服务发现。
4.  **可插拔的编码器和解码器**：
    -   OpenFeign支持多种编码器和解码器，可以通过配置来选择合适的编码器和解码器，以满足不同的数据传输需求
    -   如：如Jackson、Gson、JAXB等
5.  **错误处理**：
    -   OpenFeign可以结合Hystrix或其他容错组件来处理网络故障、超时等问题，增强了系统的健壮性。

**工作原理**

-   当应用程序调用Feign客户端接口时，Feign会在运行时动态地生成一个代理对象。
-   代理对象通过注解来获取远程服务的信息，然后将远程调用转化为HTTP请求，发送给远程服务。
-   远程服务处理请求后，将结果返回给Feign客户端，Feign客户端再将结果转换成Java对象返回给调用者

**应用场景**

-   Feign主要用于微服务架构中，通过HTTP协议调用其他服务的RESTful API。
-   它简化了对RESTful API的调用，使得开发者可以更加专注于业务逻辑的实现，而不是HTTP请求的发送和接收。

**优势**

-   **简化客户端开发**：通过声明式的方式定义HTTP客户端，减少了手写HTTP请求代码的工作量。
-   **提高代码可读性**：使用注解定义接口，使得代码更加清晰易懂。
-   **易于维护**：由于OpenFeign支持服务发现和负载均衡，所以当后端服务发生变更时，客户端代码几乎不需要改动。
-   **强大的社区支持**：作为Spring Cloud的一部分，OpenFeign有着强大的社区支持和丰富的文档资源。

**不足**：

-   Feign的性能相对较差，因为它是基于HTTP协议实现的，每次远程调用都需要建立TCP连接，开销比较大。相比之下，基于RPC协议的远程调用框架（如Dubbo）性能更好

**使用方式**

1.  在项目的pom.xml文件中添加`spring-cloud-starter-feign`依赖。
2.  在启动类上添加@SpringBootApplication和@EnableFeignClients注解，以开启Feign的功能。
3.  创建一个接口并设置@FeignClient注解，使用Feign的注解来定义远程调用的方法。
4.  在需要使用远程服务的地方，注入创建的接口实例，并直接调用其方法。Feign会自动将方法调用转换为HTTP请求，并发送到指定的服务地址

>   补充：
>
>   ​	Fegin是在客户端（消费者端）进行接口的声明，例如微服务a需要调用微服务b中的接口，就在a中进行接口声明

**总结**

​	OpenFeign是一个高效、易用的**声明式服务调用**和**负载均衡**的客户端工具，它通过声明式接口和丰富的注解支持，简化了HTTP客户端的编写，降低了开发难度。

​	可以理解为OpenFeign是Feign（Netflix）的二次封装， 它具有Feign的所有功能，并进行了扩能（例如支持SpringMVC注解），它的出现其实是为了替代停更的Feign（Netflix）

​	在微服务架构中，OpenFeign是调用RESTful API的优选工具之一。



## 如何配置OpenFeign？

配置 OpenFeign主要涉及以下几个方面：基础配置、自定义配置、日志配置、超时配置、编码器和解码器配置、错误处理配置等。

**1、基础配置**

-   1）添加依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

-   2）启用 Feign 客户端

在主应用程序类上添加 `@EnableFeignClients` 注解，启用 Feign 客户端功能：

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MyApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

### 自定义配置

OpenFeign除了基本的服务远程调用和负载均衡以为，还支持请求和响应数据的压缩、日志增强、超时控制等

#### 编码器和解码器

可以自定义编码器和解码器，来处理请求和响应的序列化和反序列化。

-   **编码器（Encoder）**：编码器负责将Java对象转换为可以在HTTP请求中发送的数据格式。例如，如果你有一个Java对象需要作为请求体发送给远程服务，编码器会将这个对象序列化为JSON或其他格式的数据，然后将其设置为HTTP请求的请求体。
-   **解码器（Decoder）**：解码器则负责将HTTP响应体中的数据转换回Java对象。当远程服务返回一个HTTP响应时，解码器会读取响应体中的数据，并将其反序列化为相应的Java对象

```java
import feign.codec.Encoder;
import feign.codec.Decoder;
import feign.jackson.JacksonEncoder;
import feign.jackson.JacksonDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

    @Bean
    public Encoder feignEncoder() {
        return new JacksonEncoder();
    }

    @Bean
    public Decoder feignDecoder() {
        return new JacksonDecoder();
    }
}
```

在 Feign 客户端接口上引用这个配置：

```java
@FeignClient(name = "remote-service", configuration = FeignConfig.class)
public interface RemoteServiceClient {
    // 方法定义
}
```

#### 请求压缩和响应压缩

OpenFeign支持对请求和响应进行gzip压缩，以减少通信过程中的性能损耗

```yaml
feign:
  compression:
    request:
      enabled: true  # 默认不开启
      mime-types: text/html,application/xml,application/json  # 设置压缩的数据类型
      min-request-size: 2048  # 设置触发压缩的下限值，默认2048
    response:
      enabled: true  # 默认不开启
```

#### 日志增强

OpenFeign提供日志打印功能，可用通过配置调整日志级别，方便开发是了解请求的细节

Feign为每个FeigenClient提供了一个feign.Logger实例，通过它可用对OpenFeign服务绑定接口的调用情况进行监控

```yaml
logging:
  level:
    com.clear: DEBUG	# 知道FeignClient所在包的日志级别
```

>   补充：
>
>   ​	OpenFeign的日志配置可用单独对某个FeignClient设置（局部配置），也可以为对所有FeignClient统一设置（全局配置）
>
>   ​	配置可以基于配置文件配置，也可以基于Bean配置，上述示例就是基于配置文件

#### 超时配置

OpenFeign客户端的默认超时时间为1s，如果服务端处理请求超过1s就会报错。为了避免这种情况，你可以配置 Feign 客户端的连接和读取超时。

```yaml
feign:
  client:
    config:
      default:	# 设置默认的超时时间
        connectTimeout: 2000
        readTimeout: 2000
      微服务名称:	# 设置具体微服务响应超时时间
        connectTimeout: 5000
        readTimeout: 5000
```

####  错误处理

可以自定义错误处理器来处理 Feign 调用中的错误。

```java
import feign.Response;
import feign.codec.ErrorDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignErrorConfig {

    @Bean
    public ErrorDecoder errorDecoder() {
        return new CustomErrorDecoder();
    }

    public class CustomErrorDecoder implements ErrorDecoder {
        @Override
        public Exception decode(String methodKey, Response response) {
            // 自定义错误处理逻辑
            return new RuntimeException("Feign Error: " + response.status());
        }
    }
}
```

在 FeignClient接口上引用这个配置：

```java
@FeignClient(name = "remote-service", configuration = FeignErrorConfig.class)
public interface RemoteServiceClient {
    // 方法定义
}
```

### 高级配置

#### 负载均衡

Feign 可以与 Ribbon 集成，提供客户端负载均衡功能。默认情况下，Feign 会使用 Ribbon 进行负载均衡。可以通过配置 Ribbon 来定制负载均衡策略。

```yaml
ribbon:
  eureka:
    enabled: true
  MaxAutoRetries: 1
  MaxAutoRetriesNextServer: 1
  OkToRetryOnAllOperations: true
  ServerListRefreshInterval: 2000
```

>   补充：
>
>   ​	新版的OpenFeign 支持的是loadbalancer

#### 断路器

Feign 可以与 Hystrix 集成，实现断路器模式。可以通过配置 Hystrix 来定制断路器行为。

```yaml
feign:
  hystrix:
    enabled: true

hystrix:
  command:
    default:
      execution:
        isolation:
          thread:
            timeoutInMilliseconds: 1000
```



## Feign和OpenFeign的区别？

**发展历程**

-   Feign最初是Netflix公司开发的一款声明式HTTP客户端，后来随着Netflix套件的逐渐停止维护，Spring Cloud团队推出了OpenFeign作为替代方案。
-   OpenFeign是在Feign的基础上进行了改进和发展，更好地适应了Spring Cloud生态系统的需求。

OpenFeign 和 Feign 是两种用于微服务架构中服务间通信的工具，它们都提供了**声明式的HTTP客户端**，使得调用HTTP服务像调用本地方法一样简单。

**相同点**

-   Feign和OpenFeign都是Spring Cloud下远程服务调用和负载均衡的组件
-   Feign和OpenFeign作用一致，都是用来实现服务的远程调用的和负载均衡的
-   Feign和OpenFeign都对Ribbon进行了集成，都是利用Ribbon维护了一个可用的服务清单列表，然后通过Ribbon实现了客户端的负载均衡
    -   新版的OpenFeign不再支持Ribbon，而是使用**Loadbalance**
-   Feign和OpenFeign都是在服务者的消费者端定义服务来绑定接口的，也就是说在客户端来定义接口绑定服务，并且是通过注解的方式来进行配置的

**不同点**

-   **依赖包**：
    -   **Feign**：使用的是 `spring-cloud-starter-feign` 依赖包。
    -   **OpenFeign**：使用的是 `spring-cloud-starter-openfeign` 依赖包。

-   **支持的注解不同**：
    -   **Feign**：Feign通过注解来定义接口，支持Feign自身的注解和JAX-RS的注解，但是不支持Spring MVC的注解。
    -   **OpenFeign**：OpenFeign不仅支持Feign原有的注解，还支持JAX-RS、Spring MVC的注解，如`@RequestMapping`、`@GetMapping`、`@PostMapping`等，使得定义接口更加灵活和方便。

-   **@FeignClient**注解：
    -   **Feign**：使用`@FeignClient`注解定义一个Feign客户端，但是它不能解析Spring MVC注解下的接口。
    -   **OpenFeign**：同样使用`@FeignClient`注解，但它可以解析Spring MVC注解下的接口，并通过**动态代理**的方式**产生实现类**，实现类中做负载均衡并调用其他服务。

**特性**：

-   相对于Feign而言，OpenFeign提供了更多高级特性和灵活性，例如支持更丰富的配置选项、更好的集成Spring Boot生态等。

总结

-   如果你正在使用Spring Cloud，并且希望在定义Feign客户端时能够使用Spring MVC的注解，那么OpenFeign是一个更好的选择。
-   如果你的项目已经使用了Feign，并且没有计划迁移到Spring MVC的注解，那么继续使用Feign也是可行的。

总的来说，OpenFeign是对Feign的一种增强版本，它提供了更多的功能和更好的兼容性，特别是对于那些希望在微服务架构中充分利用Spring MVC特性的开发者来说。



## Feign和Dubbo的区别？rpc vs http,为什么rpc快？



## Feign是如何实现负载均衡的？





## 为什么Feign第一次调用耗时很长？



## 为什么OpenFeign第一次调用耗时很长？

OpenFeign第一次调用耗时较长的原因主要包括以下几个方面（抛开业务代码和前端网络通信过程中的缓存初始化来看，单独就OpenFeign本身来说有以下几个方面）：

-   **初始化时间**：Feign在第一次调用时需要进行一系列的初始化工作，这包括**加载配置**信息、创建代理对象、**初始化HTTP客户端**、**解析注解**等。这些初始化步骤都需要消耗一定的时间。

-   **服务发现与负载均衡**：如果Feign客户端配置了与Eureka、Nacos等服务发现组件集成，那么在第一次调用时，Feign需要通过**服务发现**组件**获取**目标服务的具体**实例**信息。这一过程中涉及到的服务发现请求和负载均衡决策也会增加调用时间。
    -   OpenFeign默认使用Ribbon实现客户端的负载均衡，但是它是第一次调用时才会去创建和目标服务相关的一个客户端连接。同时创建Ribbon客户端的时候，需要从注册中心去获取服务的实例列表（也是第一次调用时完成）

-   **线程池初始化**：Feign在进行远程调用时通常会使用线程池来管理线程。如果线程池尚未初始化或需要调整大小，这也可能导致额外的开销。
    -   Ribbon：Ribbon通常是使用连接池来管理各个服务实例的一个连接，连接池的初始化和预热也需要消耗一点的时间

-   **类加载与代理生成**：Feign使用Java的动态代理机制来生成客户端代码，这意味着在第一次调用时需要加载并生成相关的代理类，这也是造成首次调用耗时的一个因素。



**解决方案**

尽量避免第一次调用时来进行初始化配置，具体来说有两种方法

-   **提前初始化**：可以在应用程序启动时，通过配置或编程手段预先触发Feign客户端的初始化，使得这些初始化操作在服务真正开始处理请求之前就已经完成

    -   Ribbon：通过`ribbon.eager-load.enabled=ture` 来开启**饥饿加载模式**，这样就可以在程序启动的时候初始化所有需要的一些客户端连接

-   **服务发现预热**：可以尝试在启动时预热服务发现客户端，使其提前准备好目标服务的信息。

    -   Ribbon：在应用启动以后，主动发起一次预热请求，从而去提前初始化Ribbon客户端以及OpenFeign相关配置初始化

    

## OpenFeign的拦截器是做什么的？

Feign的拦截器主要用于在**请求发送**到远程服务**之前**或**之后**执行一些额外的逻辑。这些逻辑可以包括但不限于：

-   **添加请求头**：可以在请求发送之前添加必要的请求头
    -    比如添加认证信息（如OAuth Token）、用户代理、跟踪ID等。

-   **修改请求参数**：

-   -   可以在请求发送之前修改请求参数，例如对参数进行加密或签名。

-   **修改请求体**：根据业务需求修改请求体的内容。

-   **处理响应**：

-   -   可以在接收到响应之后对响应进行处理，例如检查响应状态码、解析响应体等

-   **日志记录**：记录请求和响应的信息，便于调试和监控。
-   **错误处理**：处理请求过程中的异常情况。
-   **性能监控**：收集请求的耗时等性能指标。

通过使用拦截器，可以灵活地扩展Feign客户端的功能，而无需修改其核心逻辑。这有助于保持代码的整洁，并使功能更容易维护。



**实现 Feign 拦截器**

Feign中提供的一个拦截器接口：`feign.RequestInterceptor`

```java
public interface RequestInterceptor {

    /**
     * Called for every request. 
     * Add data using methods on the supplied {@link RequestTemplate}.
     */
    void apply(RequestTemplate template);
}
```

我们只需要实现这个接口，然后实现apply方法，利用RequestTemplate类来添加请求头

示例：

```java
import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate template) {
                // 添加请求头
                template.header("Authorization", "Bearer " + getAccessToken());

                // 记录请求日志
                System.out.println("Request: " + template.request());
            }

            private String getAccessToken() {
                // 获取访问令牌的逻辑
                return "your-access-token";
            }
        };
    }
}
```

**使用 Feign 拦截器**

要使用自定义的 Feign 拦截器，只需要在 FeignClient配置中引用这个配置类即可。例如：

```java
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "example-client", url = "https://api.example.com", configuration = FeignConfig.class)
public interface ExampleClient {

    @GetMapping("/data")
    String getData(@RequestParam("param") String param);
}
```



## OpenFeign最佳实践？

以黑马商城举例

将来我们要把与下单有关的业务抽取为一个独立微服务:`trade-service`，不过我们先来看一下`hm-service`中原本与下单有关的业务逻辑。

入口在`com.hmall.controller.OrderController`的`createOrder`方法，然后调用了`IOrderService`中的`createOrder`方法。

由于下单时前端提交了商品id，为了计算订单总价，需要查询商品信息：

![](assets/img_6.png)

也就是说，如果拆分了交易微服务（`trade-service`），它也需要远程调用`item-service`中的根据id批量查询商品功能。这个需求与`cart-service`中是一样的。

因此，我们就需要在`trade-service`中再次定义`ItemClient`接口，这不是重复编码吗？ 有什么办法能加避免重复编码呢？

**思路分析**

相信大家都能想到，避免重复编码的办法就是**抽取**。不过这里有两种抽取思路：

-   思路1：抽取到微服务之外的公共module
-   思路2：每个微服务自己抽取一个module

如图：

![](assets/img_7.png)

方案1抽取更加简单，工程结构也比较清晰，但缺点是整个项目耦合度偏高。（适用于聚合模块）

方案2抽取相对麻烦，工程结构相对更复杂，但服务之间耦合度降低。（适用于每个模块都是独立的project。但是比较合理，因为开发这个微服务的开发者必然对这个服务比较熟悉，由他开写rpc也自然是最合适的）



**总结**

OpenFeign使用的<font color="red">**最佳实践方式**</font>是什么？

-   由服务提供者编写独立module，将FeignClient及DTO抽取

其实这里有两种方案。

-   一：在每个微服务都是独立的project前提下，服务提供者编写独立module（子module），将FeignClient及DTO抽取在这个module中，其他微服务需要发起远程调用时，引入这个module
    -   优点：耦合度较低。服务提供者对服务比较熟悉，编写出来的代码不容易出bug
    -   缺点：相对麻烦，工程结构相对更复杂
-   二：在使用maven聚合模块的前提下，抽取出一个公共module，将所有FeignClient及DTO抽取在这个module中
    -   优点：抽取更加简单，工程结构也比较清晰
    -   缺点：整个项目耦合度偏高

将FeignClient抽取为独立module，SpringBootApplication启动类扫描不到时，无法注入Bean
![](D:/video/workspace/easy-interview/08-SpringCloud%E3%80%81%E5%BE%AE%E6%9C%8D%E5%8A%A1/assets/openfeign%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5%E6%89%AB%E4%B8%8D%E5%88%B0FeignClient_Bean.png)
解决方案如下：
![](D:/video/workspace/easy-interview/08-SpringCloud%E3%80%81%E5%BE%AE%E6%9C%8D%E5%8A%A1/assets/openfeign%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5%E6%89%AB%E6%8F%8F%E4%B8%8D%E5%88%B0FeignClient_Bean%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88.png)





## RPC层为什么建议防腐？





## 不用OpenFeign还能怎么调用微服务？

-   **HttpURLConnection**

`HttpURLConnection`是 Java 标准库中的类，用于发送 HTTP 请求和接收响应。虽然它比较底层，但适合简单的 HTTP 请求。

```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class HttpUrlConnectionExample {

    public static void main(String[] args) {
        try {
            URL url = new URL("https://api.example.com/data?param=value");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String inputLine;
                StringBuilder response = new StringBuilder();

                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();

                System.out.println(response.toString());
            } else {
                System.out.println("GET request not worked");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

-    **Apache HttpClient**

Apache HttpClient 是一个功能强大的 HTTP 客户端库，提供了更高级的功能和更好的可扩展性

```java
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class ApacheHttpClientExample {

    public static void main(String[] args) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpGet request = new HttpGet("https://api.example.com/data?param=value");
            HttpResponse response = httpClient.execute(request);

            HttpEntity entity = response.getEntity();
            if (entity != null) {
                String result = EntityUtils.toString(entity);
                System.out.println(result);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

-   **OkHttp**

OkHttp 是一个现代化的 HTTP 客户端，提供了高效的异步和同步请求处理。

```java
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class OkHttpExample {

    public static void main(String[] args) {
        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
                .url("https://api.example.com/data?param=value")
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful()) {
                System.out.println(response.body().string());
            } else {
                System.out.println("GET request not worked");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

-   **Spring RestTemplate**

`RestTemplate`是 Spring 提供的用于访问 RESTful 服务的同步客户端。

```java
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class RestTemplateExample {

    public static void main(String[] args) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://api.example.com/data?param=value";

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        if (response.getStatusCode().is2xxSuccessful()) {
            System.out.println(response.getBody());
        } else {
            System.out.println("GET request not worked");
        }
    }
}
```

- **Spring WebClient**（Reactive响应式）

`WebClient`是 Spring WebFlux 提供的非阻塞式客户端，适用于需要异步处理的场景。

```java
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

public class WebClientExample {

    public static void main(String[] args) {
        WebClient webClient = WebClient.create("https://api.example.com");

        Mono<String> response = webClient.get()
                .uri("/data?param=value")
                .retrieve()
                .bodyToMono(String.class);

        response.subscribe(System.out::println);
    }
}
```





## 什么是断路器？为什么需要断路器？



## 什么是Hystrix？



## 微服务雪崩是什么？



## 什么是服务降级？



## 什么是服务熔断？



## 什么是服务限流？



## 什么是降级熔断？为什么需要熔断降级？



## 熔断降级有哪些方案？



## Hystrix是怎么实现服务容错的？





## 什么是Sentinel？



## Sentinel中的两个核心概念？



资源、规则



## Sentinel的应用场景？



## Sentinel中如何定义一个资源？



## Sentinel的熔断策略有哪些？

## Sentinel的熔断规则如何定义？

控制台定义、代码定义



## Sentinel的熔断降级状态有哪些？





## Sentinel是怎么实现限流的？



## Sentinel如何实现热点参数降流？







## Sentinel与Hystrix的区别？



## Sentinel是怎么实现集群限流的？



## 什么是服务网络？



## 什么是灰度发布、金丝雀部署以及蓝绿部署？



## 说说什么是API网关？它有什么作用？

。



## 什么是微服务网关？为什么需要服务网关？



## SpringCloud可以选择哪些API网关？



## 什么是SpringCloud Zuul？



## 什么是SpringCloud Gateway？



## SpringCloud Gateway的工作流程？





## SpringCloud Gateway路由如何配置？

静态路由、动态路由





## SpringCloud Gateway过滤器如何实现？

。





## 说说SpringCloud Gateway核心概念？



## SpringCloud Gateway如何整合Sentinel？

。



## SpringCloud Gateway如何处理跨域请求？





## 你的项目为什么使用SpringCloud Gateway作为网关？



## SpringCloud Gateway与Zuul的区别？



## SpringCloud Gateway与Dubbo的区别？



## 什么是令牌桶算法？工作原理是什么？使用它有什么优点和注意事项？



# Dubbo篇

## Dubbo的负载均衡是如何实现的？服务端挂了怎么避免被调用到？

