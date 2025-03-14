# 十股文

#### 介绍
十股文涵盖Java常见面试题、实际应用场景题解及基础前端知识，配以示例代码，旨在全面助力技术面试准备。关于为什么叫十股文，那是因为我要比我的偶像鸡哥多一股（手动狗头）

# TODO

Spring的事务隔离级别？

Spring的事务传播行为？

Spring事务的失效原因？

Spring多线程事务能否保证事务的一致性？

Spring Aop 与 AspectJ AOP 有什么区别？

SpringAOP通知和执行顺序？

什么情况下，Aop会失效？怎么解决？

JDK动态代理和CGLIB的区别？

SpringAOP的底层实现？


Spring自动装配bean有哪些方式？

Spring框架中的单例bean是线程安全的吗？

Spring是如何解决Bean的循环依赖？

Spring中bean的生命周期？

Spring中bean的加载流程

@autowered和@resource、@qualifier的区别？




谈谈你对Spring的理解？

Spring有哪些缺点？

SpringMVC的拦截器和过滤器有什么区别？执行顺序？

SpringMVC执行流程

Spring 和SpringMVC为什么需要父子容器？

Spring框架用到了哪些设计模式？

Spring事件监听的核心机制是什么？


## Java

ThreadLocal内存泄漏问题是怎么导致的？

线程、进程、协程的区别？

协程上下文切换过程？

线程上下文保存了什么，协程上下文保存了什么？




trycatchflinally都是刚杀？try中有return，执行流程？

线程池原理？

解释CAS？


## mysql

数据量过大的情况下，怎么处理？分库分表的设计规范？

数据库优化的理解

## JVM


堆里的分区怎么划分？

JVM内存模型和垃圾回收？

什么东西可以做GCRoot，跨代引用怎么办？

OOM问题如何排查和姐姐？


堆内存溢出的时候会看哪些指标


信号量张开说说？

## MQ
消息队列消息没有消费成功怎么办？

Kafka如何保证消息不丢、重发了怎么办？


## redis
redis实现分布式锁，需要考虑哪些问题？


rdb 与aof的区别？

redis默认的持久化方式？


讲讲redis的部署模式

## 微服务
解释skywalking，以及为什么重要

skywalking中的数据是如何收集和传输的

使用 Oauth2时，如何存储和传输敏感信息，例如用户名、密码

Oauth2的四种授权模式？

使用oauth2的优缺点

如何处理oauth2的刷新令牌

什么是限流算法，网关如何实现限流？

在微服务架构中，网关的作用

什么情况下需要使用分布式事务


说说seata的执行流程

什么是seata？它是怎么工作（工作原理）的？谈谈理解

Seata和hystrix的区别？

如果seata的异常处理规则不满足需求，应该怎么办？

什么是熔断降低？为什么要熔断

谈谈ribbon和fegin的区别

## 

单点登录SSO的设计与实现？

如果外部接口的RT无法保证，如何处理？

你在项目遇到内存泄露有什么排查方式


对接第三方接口需要考虑什么？

## 
在输入url到页面展示到底发生了什么


## linux
linux你输入一个命令，背后发生了什么？

## 操作系统


cpu时间片多大？

cpu时间片是怎么淘汰的。不同线程获取cpu时间片的竞争1过程展开说说？

线程切换要多久、协程切换要多久？进程切换多久