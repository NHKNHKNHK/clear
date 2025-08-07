# SpringCloud有哪些核心组件？

按照发展可以为第一代spring cloud组件（以netflix公司出品的技术为主）和第二代spring cloud组件（以阿里巴巴出品的技术栈为主）

## **Spring Cloud Netflix**

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

## **Spring Cloud Alibaba**

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

