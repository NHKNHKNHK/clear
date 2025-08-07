# SpringCloud Alibaba的组成？

Spring Cloud Alibaba吸收了Spring Cloud Netflix的核心架构思想，并进行了高性能的改进，自Spring Cloud Netflix停止更新维护后，Spring Cloud Alibaba逐渐成为了主流的微服务开发框架，他也是国内首个进入Spring社区的开源项目

## **Spring Cloud Alibaba**

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



## **Cloud Alibaba商业化组件**

-   覆盖全球的短信服务：Alibaba Cloud SMS

-   分布式任务调度：Alibaba Cloud SchedulerX

-   阿里云对象存储服务：Alibaba Cloud OSS
