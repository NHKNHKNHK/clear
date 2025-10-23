import javaBaseSidebar from './sidebar/java/base/index'
import javaCollectionSidebar from './sidebar/java/collection/index'
import javaConcurrencySidebar from './sidebar/java/concurrency/index'
import jvmSidebar from './sidebar/java/jvm/index'
import springSidebar from './sidebar/spring/index'
import vueSidebar from './sidebar/vue/index'
import esSidebar from './sidebar/es/index'
import springMvcSidebar from './sidebar/springmvc/index'
import springBootSidebar from './sidebar/springboot/index'
import ormSidebar from './sidebar/orm/index'
import mysqlSidebar from './sidebar/mysql/index'
import designPatternSidebar from "./sidebar/design-pattern";

export default {
  '/01-Java基础/': javaBaseSidebar,
  '/02-Java集合篇/': javaCollectionSidebar,
  '/04-Java并发篇/': javaConcurrencySidebar,
  '/03-JVM篇/': jvmSidebar,
  '/05-Spring/': springSidebar,
  '/06-SpringMVC/': springMvcSidebar,
  '/07-SpringBoot/': springBootSidebar,
  '/08-SpringCloud、微服务/': [
    {
      text: '微服务',
      collapsed: false,
      items: [
        { text: '导读', link: '/08-SpringCloud、微服务/' },
        { text: '什么是单体应用架构？', link: '/08-SpringCloud、微服务/什么是单体应用架构？' },
        { text: '什么是垂直应用架构？', link: '/08-SpringCloud、微服务/什么是垂直应用架构？' },
        { text: '什么是SOA应用架构？', link: '/08-SpringCloud、微服务/什么是SOA应用架构？' },
        { text: '什么是微服务？你是怎么理解微服务的？', link: '/08-SpringCloud、微服务/什么是微服务？你是怎么理解微服务的？' },
        { text: '单体应用、SOA、微服务架构有什么区别？', link: '/08-SpringCloud、微服务/单体应用、SOA、微服务架构有什么区别？' },
        { text: '微服务架构中有哪些核心概念？', link: '/08-SpringCloud、微服务/微服务架构中有哪些核心概念？' },
        { text: '微服务能解决哪些问题呢？', link: '/08-SpringCloud、微服务/微服务能解决哪些问题呢？' },
        { text: '微服务带来的挑战？', link: '/08-SpringCloud、微服务/微服务带来的挑战？' },
        { text: '微服务之间的通信方式？微服务之间如何交互？', link: '/08-SpringCloud、微服务/微服务之间的通信方式？微服务之间如何交互？' },
        { text: '微服务体系如何传递用户信息？', link: '/08-SpringCloud、微服务/微服务体系如何传递用户信息？' },
        { text: '分布式和微服务的区别？', link: '/08-SpringCloud、微服务/分布式和微服务的区别？' },
        { text: '现在流行的微服务框架？', link: '/08-SpringCloud、微服务/现在流行的微服务框架？' },
        { text: '微服务架构是如何运行的？', link: '/08-SpringCloud、微服务/微服务架构是如何运行的？' },
      ]
    },
    {
      text: 'SpringCloud',
      collapsed: false,
      items: [
        { text: 'SpringCloud是什么？', link: '/08-SpringCloud、微服务/SpringCloud是什么？' },
        { text: 'SpringCloud的组成（架构）？', link: '/08-SpringCloud、微服务/SpringCloud的组成（架构）？' },
        { text: 'SpringCloud有哪些核心组件？', link: '/08-SpringCloud、微服务/SpringCloud有哪些核心组件？' },
        { text: 'SpringCloud Alibaba的组成？', link: '/08-SpringCloud、微服务/SpringCloud Alibaba的组成？' },
        { text: 'SpringCloud的优缺点？', link: '/08-SpringCloud、微服务/SpringCloud的优缺点？' },
        { text: 'SpringCloud与SpringBoot之间的区别（关系）？', link: '/08-SpringCloud、微服务/SpringCloud与SpringBoot之间的区别（关系）？' },
        { text: 'Spring、SpringBoot、SpringCloud之间的关系？', link: '/08-SpringCloud、微服务/Spring、SpringBoot、SpringCloud之间的关系？' },
        { text: 'SpringCloud版本该如何选择？', link: '/08-SpringCloud、微服务/SpringCloud版本该如何选择？' },
        { text: '什么是Nacos？', link: '/08-SpringCloud、微服务/什么是Nacos？' },
        { text: 'Nacos有哪些特性？', link: '/08-SpringCloud、微服务/Nacos有哪些特性？' },
        { text: 'Nacos两大组件分别是什么？', link: '/08-SpringCloud、微服务/Nacos两大组件分别是什么？' },
        { text: '什么是配置中心？有哪些常见配置中心？', link: '/08-SpringCloud、微服务/什么是配置中心？有哪些常见配置中心？' },
        { text: '什么是Nacos配置中心？', link: '/08-SpringCloud、微服务/什么是Nacos配置中心？' },
        { text: 'Nacos配置中心实现原理？', link: '/08-SpringCloud、微服务/Nacos配置中心实现原理？' },
        { text: '什么是Nacos的领域模型？', link: '/08-SpringCloud、微服务/什么是Nacos的领域模型？' },
        { text: '什么是Nacos Server集群？', link: '/08-SpringCloud、微服务/什么是Nacos Server集群？' },
        { text: 'Nacos Server集群该如何搭建？', link: '/08-SpringCloud、微服务/Nacos Server集群该如何搭建？' },
        { text: '什么是服务端负载均衡？', link: '/08-SpringCloud、微服务/什么是服务端负载均衡？' },
        { text: '什么是客户端负载均衡？', link: '/08-SpringCloud、微服务/什么是客户端负载均衡？' },
        { text: '为什么需要服务注册发现？', link: '/08-SpringCloud、微服务/为什么需要服务注册发现？' },
        { text: '为什么需要在微服务中使用链路跟踪？SpringCloud可以选择哪些微服务链路跟踪方案？', link: '/08-SpringCloud、微服务/为什么需要在微服务中使用链路跟踪？SpringCloud可以选择哪些微服务链路跟踪方案？' },
        { text: 'SpringCloud Config是什么', link: '/08-SpringCloud、微服务/SpringCloud Config是什么' },
        { text: '你们的服务是怎么做日志收集的？', link: '/08-SpringCloud、微服务/你们的服务是怎么做日志收集的？' },
        { text: '什么情况下需要使用分布式事务，有哪些解决方案？', link: '/08-SpringCloud、微服务/什么情况下需要使用分布式事务，有哪些解决方案？' },
        { text: '什么是seata？谈谈你的理解？', link: '/08-SpringCloud、微服务/什么是seata？谈谈你的理解？' },
        { text: 'seata支持哪些模式的分布式事务？', link: '/08-SpringCloud、微服务/seata支持哪些模式的分布式事务？' },
        { text: 'seata的实现原理？', link: '/08-SpringCloud、微服务/seata的实现原理？' },
        { text: 'SpringCloud有哪些注册中心？', link: '/08-SpringCloud、微服务/SpringCloud有哪些注册中心？' },
        { text: 'seata的事务执行流程？', link: '/08-SpringCloud、微服务/seata的事务执行流程？' },
        { text: 'seata的事务回滚是怎么实现的？', link: '/08-SpringCloud、微服务/seata的事务回滚是怎么实现的？' },
        { text: '什么Eureka？', link: '/08-SpringCloud、微服务/什么Eureka？' },
        { text: 'Eureka的实现原理？', link: '/08-SpringCloud、微服务/Eureka的实现原理？' },
        { text: 'Eureka的自我保护模式是什么？', link: '/08-SpringCloud、微服务/Eureka的自我保护模式是什么？' },
        { text: 'Eureka的高可用是怎么实现的？', link: '/08-SpringCloud、微服务/Eureka的高可用是怎么实现的？' },
        { text: 'SpringCloud是如何实现服务注册的？', link: '/08-SpringCloud、微服务/SpringCloud是如何实现服务注册的？' },
        { text: 'Eureka和Zookeeper的区别？', link: '/08-SpringCloud、微服务/Eureka和Zookeeper的区别？' },
        { text: 'Consul是什么？', link: '/08-SpringCloud、微服务/Consul是什么？' },
        { text: 'Eureka、Zookeeper、Consul的区别？', link: '/08-SpringCloud、微服务/Eureka、Zookeeper、Consul的区别？' },
        { text: 'Nacos的服务注册表结构是什么样的？', link: '/08-SpringCloud、微服务/Nacos的服务注册表结构是什么样的？' },
        { text: 'Nacos中的Namespace是什么？如何使用它来组织和管理微服务？', link: '/08-SpringCloud、微服务/Nacos中的Namespace是什么？如何使用它来组织和管理微服务？' },
        { text: '为什么需要负载均衡？', link: '/08-SpringCloud、微服务/为什么需要负载均衡？' },
        { text: '在SpringCloud中怎么使用服务的负载均衡？', link: '/08-SpringCloud、微服务/在SpringCloud中怎么使用服务的负载均衡？' },
        { text: '负载均衡的实现方式有哪些？', link: '/08-SpringCloud、微服务/负载均衡的实现方式有哪些？' },
        { text: '负载均衡有什么策略？', link: '/08-SpringCloud、微服务/负载均衡有什么策略？' },
        { text: 'Ribbon和Nginx的区别？', link: '/08-SpringCloud、微服务/Ribbon和Nginx的区别？' },
        { text: 'Http和RPC的区别？', link: '/08-SpringCloud、微服务/Http和RPC的区别？' },
        { text: 'Ribbon和Feign调用服务的区别是什么？', link: '/08-SpringCloud、微服务/Ribbon和Feign调用服务的区别是什么？' },
        { text: '什么是Feign（Spring Cloud Netflix Feign）？', link: '/08-SpringCloud、微服务/什么是Feign（Spring Cloud Netflix Feign）？' },
        { text: '什么是OpenFeign？', link: '/08-SpringCloud、微服务/什么是OpenFeign？' },
        { text: '如何配置OpenFeign？', link: '/08-SpringCloud、微服务/如何配置OpenFeign？' },
        { text: 'Feign和OpenFeign的区别？', link: '/08-SpringCloud、微服务/Feign和OpenFeign的区别？' },
        { text: 'Feign和Dubbo的区别？rpc vs http,为什么rpc快？', link: '/08-SpringCloud、微服务/Feign和Dubbo的区别？rpc vs http,为什么rpc快？' },
        { text: 'Feign是如何实现负载均衡的？', link: '/08-SpringCloud、微服务/Feign是如何实现负载均衡的？' },
        { text: '为什么Feign第一次调用耗时很长？', link: '/08-SpringCloud、微服务/为什么Feign第一次调用耗时很长？' },
        { text: '为什么OpenFeign第一次调用耗时很长？', link: '/08-SpringCloud、微服务/为什么OpenFeign第一次调用耗时很长？' },
        { text: 'OpenFeign的拦截器是做什么的？', link: '/08-SpringCloud、微服务/OpenFeign的拦截器是做什么的？' },
        { text: 'OpenFeign最佳实践？', link: '/08-SpringCloud、微服务/OpenFeign最佳实践？' },
        { text: 'RPC层为什么建议防腐？', link: '/08-SpringCloud、微服务/RPC层为什么建议防腐？' },
        { text: '不用OpenFeign还能怎么调用微服务？', link: '/08-SpringCloud、微服务/不用OpenFeign还能怎么调用微服务？' },
        { text: '什么是断路器？为什么需要断路器？', link: '/08-SpringCloud、微服务/什么是断路器？为什么需要断路器？' },
        { text: '什么是Hystrix？', link: '/08-SpringCloud、微服务/什么是Hystrix？' },
        { text: '微服务雪崩是什么？', link: '/08-SpringCloud、微服务/微服务雪崩是什么？' },
        { text: '什么是服务降级？', link: '/08-SpringCloud、微服务/什么是服务降级？' },
        { text: '什么是服务熔断？', link: '/08-SpringCloud、微服务/什么是服务熔断？' },
        { text: '什么是服务限流？', link: '/08-SpringCloud、微服务/什么是服务限流？' },
        { text: '什么是降级熔断？为什么需要熔断降级？', link: '/08-SpringCloud、微服务/什么是降级熔断？为什么需要熔断降级？' },
        { text: '熔断降级有哪些方案？', link: '/08-SpringCloud、微服务/熔断降级有哪些方案？' },
        { text: 'Hystrix是怎么实现服务容错的？', link: '/08-SpringCloud、微服务/Hystrix是怎么实现服务容错的？' },
        { text: '什么是Sentinel？', link: '/08-SpringCloud、微服务/什么是Sentinel？' },
        { text: 'Sentinel中的两个核心概念？', link: '/08-SpringCloud、微服务/Sentinel中的两个核心概念？' },
        { text: 'Sentinel的应用场景？', link: '/08-SpringCloud、微服务/Sentinel的应用场景？' },
        { text: 'Sentinel的熔断策略有哪些？', link: '/08-SpringCloud、微服务/Sentinel的熔断策略有哪些？' },
        { text: 'Sentinel的熔断规则如何定义？', link: '/08-SpringCloud、微服务/Sentinel的熔断规则如何定义？' },
        { text: 'Sentinel的熔断降级状态有哪些？', link: '/08-SpringCloud、微服务/Sentinel的熔断降级状态有哪些？' },
        { text: 'Sentinel是怎么实现限流的？', link: '/08-SpringCloud、微服务/Sentinel是怎么实现限流的？' },
        { text: 'Sentinel如何实现热点参数降流？', link: '/08-SpringCloud、微服务/Sentinel如何实现热点参数降流？' },
        { text: 'Sentinel与Hystrix的区别？', link: '/08-SpringCloud、微服务/Sentinel与Hystrix的区别？' },
        { text: 'Sentinel是怎么实现集群限流的？', link: '/08-SpringCloud、微服务/Sentinel是怎么实现集群限流的？' },
        { text: '什么是服务网络？', link: '/08-SpringCloud、微服务/什么是服务网络？' },
        { text: '什么是灰度发布、金丝雀部署以及蓝绿部署？', link: '/08-SpringCloud、微服务/什么是灰度发布、金丝雀部署以及蓝绿部署？' },
        { text: '说说什么是API网关？它有什么作用？', link: '/08-SpringCloud、微服务/说说什么是API网关？它有什么作用？' },
        { text: '什么是微服务网关？为什么需要服务网关？', link: '/08-SpringCloud、微服务/什么是微服务网关？为什么需要服务网关？' },
        { text: 'SpringCloud可以选择哪些API网关？', link: '/08-SpringCloud、微服务/SpringCloud可以选择哪些API网关？' },
        { text: '什么是SpringCloud Zuul？', link: '/08-SpringCloud、微服务/什么是SpringCloud Zuul？' },
        { text: '什么是SpringCloud Gateway？', link: '/08-SpringCloud、微服务/什么是SpringCloud Gateway？' },
        { text: 'SpringCloud Gateway的工作流程？', link: '/08-SpringCloud、微服务/SpringCloud Gateway的工作流程？' },
        { text: 'SpringCloud Gateway路由如何配置？', link: '/08-SpringCloud、微服务/SpringCloud Gateway路由如何配置？' },
        { text: 'SpringCloud Gateway过滤器如何实现？', link: '/08-SpringCloud、微服务/SpringCloud Gateway过滤器如何实现？' },
        { text: '说说SpringCloud Gateway核心概念？', link: '/08-SpringCloud、微服务/说说SpringCloud Gateway核心概念？' },
        { text: 'SpringCloud Gateway如何整合Sentinel？', link: '/08-SpringCloud、微服务/SpringCloud Gateway如何整合Sentinel？' },
        { text: 'SpringCloud Gateway如何处理跨域请求？', link: '/08-SpringCloud、微服务/SpringCloud Gateway如何处理跨域请求？' },
        { text: '你的项目为什么使用SpringCloud Gateway作为网关？', link: '/08-SpringCloud、微服务/你的项目为什么使用SpringCloud Gateway作为网关？' },
        { text: 'SpringCloud Gateway与Zuul的区别？', link: '/08-SpringCloud、微服务/SpringCloud Gateway与Zuul的区别？' },
        { text: 'SpringCloud Gateway与Dubbo的区别？', link: '/08-SpringCloud、微服务/SpringCloud Gateway与Dubbo的区别？' },
        { text: '什么是令牌桶算法？工作原理是什么？使用它有什么优点和注意事项？', link: '/08-SpringCloud、微服务/什么是令牌桶算法？工作原理是什么？使用它有什么优点和注意事项？' },



        { text: 'Dubbo的负载均衡是如何实现的？服务端挂了怎么避免被调用到？', link: '/08-SpringCloud、微服务/Dubbo的负载均衡是如何实现的？服务端挂了怎么避免被调用到？' },
      ]
    },
  ],
  '/09-MySQL/': [
    ...mysqlSidebar
  ],
  '/10-Redis/': [
    {
      text: '基础',
      collapsed: false,
      items: [
        { text: 'Redis', link: '/10-Redis/' },
        { text: '什么是Redis？', link: '/10-Redis/什么是Redis？' },
        { text: 'Redis相比memcached有哪些优势？', link: '/10-Redis/Redis相比memcached有哪些优势？' },
        { text: 'Redis和memached的区别？', link: '/10-Redis/Redis和memached的区别？' },
        { text: 'Redis为什么那么快？', link: '/10-Redis/Redis为什么那么快？' },
        { text: 'Redis有哪些优点？', link: '/10-Redis/Redis有哪些优点？' },
        { text: 'Redis常见五大数据类型？', link: '/10-Redis/Redis常见五大数据类型？' },
        { text: 'Redis的高级数据类型有哪些？', link: '/10-Redis/Redis的高级数据类型有哪些？' },
        { text: 'Redis的一般使用场景？', link: '/10-Redis/Redis的一般使用场景？' },
        { text: 'Redis常用类型的应用场景？', link: '/10-Redis/Redis常用类型的应用场景？' },
        { text: 'Redis是单线程还是多线程？', link: '/10-Redis/Redis是单线程还是多线程？' },
        { text: 'Redis 为什么单线程还这么快？', link: '/10-Redis/Redis 为什么单线程还这么快？' },
        { text: 'Redis为什么要设计成单线程？6.0不是变成多线程了吗？', link: '/10-Redis/Redis为什么要设计成单线程？6.0不是变成多线程了吗？' },
        { text: 'Redis存在线程安全吗？为什么？', link: '/10-Redis/Redis存在线程安全吗？为什么？' },
        { text: 'Redis的list类型常见的命令？', link: '/10-Redis/Redis的list类型常见的命令？' },
        { text: 'Redis的Geo类型？', link: '/10-Redis/Redis的Geo类型？' },
        { text: 'Redis的Bitmap类型？', link: '/10-Redis/Redis的Bitmap类型？' },
        { text: 'Redis的HyperLogLog类型？', link: '/10-Redis/Redis的HyperLogLog类型？' },

        { text: 'Redis的setnx和setex的区别？', link: '/10-Redis/Redis的setnx和setex的区别？' },
        { text: 'Redis的内存淘汰策略？', link: '/10-Redis/Redis的内存淘汰策略？' },
        { text: 'Redis的过期策略？', link: '/10-Redis/Redis的过期策略？' },
        { text: 'redis key的过期时间和永久有效分别怎么设置？', link: '/10-Redis/redis key的过期时间和永久有效分别怎么设置？' },
        { text: '删除key的命令会阻塞redis吗？', link: '/10-Redis/删除key的命令会阻塞redis吗？' },
        { text: 'Redis什么情况下会变慢？', link: '/10-Redis/Redis什么情况下会变慢？' },
        { text: 'redis常见性能问题和解决方案？', link: '/10-Redis/redis常见性能问题和解决方案？' },
        { text: 'redis回收进程如何工作的？', link: '/10-Redis/redis回收进程如何工作的？' },

      ]
    },
    {
      text: '持久化',
      collapsed: false,
      items: [
        { text: 'Redis的持久化机制？', link: '/10-Redis/Redis的持久化机制？' },
        { text: 'rdb的优势与劣势？', link: '/10-Redis/rdb的优势与劣势？' },
        { text: 'aof的优势和劣势？', link: '/10-Redis/aof的优势和劣势？' },
        { text: 'RDB和AOF的实现原理？以及优缺点？', link: '/10-Redis/RDB和AOF的实现原理？以及优缺点？' },
        { text: 'Redis生成rdb的时候，是如何处理正常请求的？', link: '/10-Redis/Redis生成rdb的时候，是如何处理正常请求的？' },
      ]
    },
    {
      text: '本地缓存',
      collapsed: false,
      items: [
        { text: '本地缓存与分布式缓存的区别？', link: '/10-Redis/本地缓存与分布式缓存的区别？' },
        { text: '如何实现本地缓存？', link: '/10-Redis/local-cache/如何实现本地缓存？' },
        { text: 'Caffeine的缓存驱逐策略（过期策略）', link: '/10-Redis/Caffeine的缓存驱逐策略（过期策略）' },
      ],
    },
    {
      text: '分布式',
      collapsed: false,
      items: [
        { text: '怎么保证Redis的高并发高可用', link: '/10-Redis/怎么保证Redis的高并发高可用' },
        { text: 'Redis的Cluster模式和Sentinel模式的区别是什么？', link: '/10-Redis/Redis的Cluster模式和Sentinel模式的区别是什么？' },
        { text: 'Redis主从有哪几种常见的拓扑结构？', link: '/10-Redis/Redis主从有哪几种常见的拓扑结构？' },
        { text: 'redis主从复制的核心原理？', link: '/10-Redis/redis主从复制的核心原理？' },
        { text: 'redis的同步机制是什么', link: '/10-Redis/redis的同步机制是什么' },
        { text: 'Redis的从服务器的作用？', link: '/10-Redis/Redis的从服务器的作用？' },
        { text: 'Redis的复制延迟有哪些可能的原因？', link: '/10-Redis/Redis的复制延迟有哪些可能的原因？' },
        { text: 'Redis集群脑裂？', link: '/10-Redis/Redis集群脑裂？' },
        { text: 'redis哨兵机制？', link: '/10-Redis/redis哨兵机制？' },
        { text: '部署三主三从redis集群', link: '/10-Redis/docs/docker中部署三主三从redis集群' },
      ]
    },
    {
      text: '场景',
      collapsed: true,
      items: [
        { text: '如果Redis扛不住了怎么办？', link: '/10-Redis/如果Redis扛不住了怎么办？' },
        { text: '什么情况下会出现数据库和缓存不一致的问题？', link: '/10-Redis/什么情况下会出现数据库和缓存不一致的问题？' },
        { text: 'Redis和MySQL如何保证数据一致性？', link: '/10-Redis/Redis和MySQL如何保证数据一致性？' },
        { text: '如何解决Redis和数据库的一致性问题？', link: '/10-Redis/如何解决Redis和数据库的一致性问题？' },
        { text: '为什么需要延迟双删，两次删除的原因是什么？', link: '/10-Redis/为什么需要延迟双删，两次删除的原因是什么？' },
        { text: '有了第二次删除，第一次还有意义吗？', link: '/10-Redis/有了第二次删除，第一次还有意义吗？' },
        { text: '什么是缓存穿透？', link: '/10-Redis/什么是缓存穿透？' },
        { text: '什么是缓存击穿？（热点key）', link: '/10-Redis/什么是缓存击穿？（热点key）' },
        { text: '什么是缓存雪崩？', link: '/10-Redis/什么是缓存雪崩？' },
        { text: '缓存击穿、雪崩、穿透的区别？', link: '/10-Redis/缓存击穿、雪崩、穿透的区别？' },
        { text: '如果有大量的key需要设置同一时间过期，一般需要注意什么？', link: '/10-Redis/如果有大量的key需要设置同一时间过期，一般需要注意什么？' },
        { text: 'Redis key过期了，为什么内存没释放？', link: '/10-Redis/Redis key过期了，为什么内存没释放？' },
        { text: 'redis的内存用完了会发生什么？', link: '/10-Redis/redis的内存用完了会发生什么？' },
        { text: 'Redis生成全局唯一ID', link: '/10-Redis/Redis生成全局唯一IDs' },
        { text: '什么是分布式锁？分布式锁的特点？', link: '/10-Redis/什么是分布式锁？分布式锁的特点？' },
        { text: '如何实现分布式锁？', link: '/10-Redis/如何实现分布式锁？' },
        { text: '为什么Redis实现分布式锁不合适？还是有很多公司在用？', link: '/10-Redis/为什么Redis实现分布式锁不合适？还是有很多公司在用？' },
        { text: 'jedis与redisson对比有什么优缺点？', link: '/10-Redis/jedis与redisson对比有什么优缺点？' },
        { text: 'Redis实现分布式锁有什么问题吗？', link: '/10-Redis/Redis实现分布式锁有什么问题吗？' },
        { text: '看门狗机制的原理是什么？', link: '/10-Redis/看门狗机制的原理是什么？' },
        { text: '分布式锁在未执行完逻辑之前就过期了怎么办？', link: '/10-Redis/分布式锁在未执行完逻辑之前就过期了怎么办？' },
        { text: '看门狗一直续期，那客户端挂了怎么办？', link: '/10-Redis/看门狗一直续期，那客户端挂了怎么办？' },
        { text: '看门狗解锁失败，会不会导致一直续期下去？', link: '/10-Redis/看门狗解锁失败，会不会导致一直续期下去？' },
        { text: 'Redis的red lock？', link: '/10-Redis/Redis的red lock？' },
        { text: 'redlock的分布式锁是什么？', link: '/10-Redis/redlock的分布式锁是什么？' },
        { text: 'Redis如何实现延时队列', link: '/10-Redis/Redis如何实现延时队列' },
        { text: '如何基于Redisson实现一个延迟队列', link: '/10-Redis/如何基于Redisson实现一个延迟队列' },
        { text: '什么是redis bigKey？如何解决？', link: '/10-Redis/什么是redis bigKey？如何解决？' },
        { text: '如何解决热点key？', link: '/10-Redis/如何解决热点key？' },
        { text: '如何快速实现一个布隆过滤器？', link: '/10-Redis/如何快速实现一个布隆过滤器？' },
        { text: '如何快速实现一个排行榜？', link: '/10-Redis/如何快速实现一个排行榜？' },
        { text: '如何用Redis统计海量UV？', link: '/10-Redis/如何用Redis统计海量UV？' },
        { text: '如何使用Redis记录用户连续登录多少天？', link: '/10-Redis/如何使用Redis记录用户连续登录多少天？' },
        { text: '什么情况下redis哨兵模式会产生数据丢失', link: '/10-Redis/什么情况下redis哨兵模式会产生数据丢失' },

      ]
    },
    {
      text: '进阶',
      collapsed: true,
      items: [
        { text: 'RedisKeyValue设计原则有哪些？', link: '/10-Redis/RedisKeyValue设计原则有哪些？' },
        { text: '为什么EMBSTR的阈值是44？为什么以前是39？', link: '/10-Redis/为什么EMBSTR的阈值是44？为什么以前是39？' },
        { text: 'Redis可以实现事务吗？', link: '/10-Redis/Redis可以实现事务吗？' },
        { text: 'Redis 事务三特性？', link: '/10-Redis/Redis 事务三特性？' },
        { text: 'Redis事务保证原子性吗，支持回滚吗？', link: '/10-Redis/Redis事务保证原子性吗，支持回滚吗？' },
        { text: 'Redis的事务和关系型数据库有何不同？', link: '/10-Redis/Redis的事务和关系型数据库有何不同？' },
        { text: 'Redis的lua脚本？', link: '/10-Redis/Redis的lua脚本？' },
        { text: 'Redis中如何实现队列和栈的功能？', link: '/10-Redis/Redis中如何实现队列和栈的功能？' },
        { text: '简述Redis的Ziplist和Quicklist？', link: '/10-Redis/简述Redis的Ziplist和Quicklist？' },
        { text: '什么是Redis的ListPack？', link: '/10-Redis/什么是Redis的ListPack？' },
        { text: 'Redis的内存碎片化是什么？如何解决？', link: '/10-Redis/Redis的内存碎片化是什么？如何解决？' },
        { text: 'Redis字符串的值最大能存多少？', link: '/10-Redis/Redis字符串的值最大能存多少？' },
        { text: 'Redis为什么不复用c语言的字符串？', link: '/10-Redis/Redis为什么不复用c语言的字符串？' },
        { text: '什么是Redis的ListPack？', link: '/10-Redis/什么是Redis的ListPack？' },
        { text: '什么是Redis的ListPack？', link: '/10-Redis/什么是Redis的ListPack？' },
        { text: 'Redis的发布订阅功能？', link: '/10-Redis/Redis的发布订阅功能？' },
        { text: '什么是redis哈希槽的概念？', link: '/10-Redis/什么是redis哈希槽的概念？' },
        { text: '使用Redis集群时，通过key如何定位到对应节点？', link: '/10-Redis/使用Redis集群时，通过key如何定位到对应节点？' },
        { text: '为什么Redis集群的最大槽数是16384个？', link: '/10-Redis/为什么Redis集群的最大槽数是16384个？' },
        { text: 'Redis中的管道有什么用', link: '/10-Redis/Redis中的管道有什么用' },
        { text: 'Redis的pipeline？', link: '/10-Redis/Redis的pipeline？' },
        { text: '原生批处理命令(mset、mget)与Pipeline的区别？', link: '/10-Redis/原生批处理命令(mset、mget)与Pipeline的区别？' },
        { text: '什么是Redis跳表？', link: '/10-Redis/什么是Redis跳表？' },
      ]
    }
  ],
  '/11-ORM/': ormSidebar,
  '/12-分布式/': [
    {
      text: '分布式',
      items: [
        { text: '分布式', link: '/12-分布式/index' },
        { text: '使用分布式调度框架该考虑哪些问题？', link: '/12-分布式/使用分布式调度框架该考虑哪些问题？' },
      ]
    }
  ],
  '/13-Zookeeper/': [
    {
      text: 'Zookeeper简明教程',
      items: [
        { text: 'ZooKeeper快速入门', link: '/13-Zookeeper/learn/01-ZooKeeper快速入门' },
        { text: 'zookeeper节点动态上下线案例', link: '/13-Zookeeper/learn/zookeeper节点动态上下线案例' },
      ]
    },
    {
      text: 'Zookeeper',
      items: [
        { text: 'Zookeeper', link: '/13-Zookeeper/index' },
        { text: '谈谈你对Zookeeper的理解？', link: '/13-Zookeeper/谈谈你对Zookeeper的理解？' },
        { text: 'Zookeeper的Leader选举机制？', link: '/13-Zookeeper/Zookeeper的Leader选举机制？' },
        { text: 'Zookeeper如何实现分布式锁？', link: '/13-Zookeeper/Zookeeper如何实现分布式锁？' },
      ]
    }
  ],
  '/14-ElasticSearch/': esSidebar,
  '/15-MQ/': [
    {
      text: '消息队列',
      items: [
        { text: '导读', link: '/15-MQ/common/index' },
        { text: '消息队列消息没有消费成功怎么办？', link: '/15-MQ/common/消息队列消息没有消费成功怎么办？' },

      ]
    },
    {
      text: 'RocketMQ',
      items: [
        { text: '如何提升RocketMQ顺序消费性能？', link: '/15-MQ/RocketMQ/' },
      ]

    },
    {
      text: 'Kafka',
      items: [
        { text: 'Kafka如何保证消息不丢、重复发了怎么办？', link: '/15-MQ/Kafka/' },
        { text: 'Kafka为什么会出现重复消费？如何解决？', link: '/15-MQ/Kafka/Kafka为什么会出现重复消费？如何解决？' },
        { text: 'Kafka消息重复消费的原因', link: '/15-MQ/Kafka/Kafka消息重复消费的原因' },
        { text: '解决Kafka消息重复消费的方案', link: '/15-MQ/Kafka/解决Kafka消息重复消费的方案' },
      ],
    },
    {
      text: 'Kafka简明教程',
      items: [
        { text: 'Kafka', link: '/15-MQ/Kafka/learn/01-kafka' },
        { text: 'Kafka监控工具', link: '/15-MQ/Kafka/learn/02-Kafka监控工具' },
        { text: 'Kafka 常用API操作', link: '/15-MQ/Kafka/learn/03-Kafka 常用API操作' },
        { text: 'Kafak整合Flume', link: '/15-MQ/Kafka/learn/Kafak整合Flume' },
        { text: '04-KafkaUtils.createDirectStream的消费者LocationStrategies', link: '/15-MQ/Kafka/learn/04-KafkaUtils.createDirectStream的消费者LocationStrategies' },

      ],
    },
    {
      text: 'RabbitMQ',
      items: [
        { text: '导读', link: '/15-MQ/RabbitMQ/' },
      ]
    },
  ],
  '/16-MongoDB/': [
    {
      text: 'MongoDB',
      items: [
        { text: '导读', link: '/16-MongoDB/' },
        { text: '什么是MongoDB', link: '/16-MongoDB/什么是MongoDB' },
        { text: 'RDBMS与MongoDB对比', link: '/16-MongoDB/RDBMS与MongoDB对比' },
        { text: 'MongoDB体系结构（核心概念）', link: '/16-MongoDB/MongoDB体系结构（核心概念）' },
        { text: 'MongoDB数据模型', link: '/16-MongoDB/MongoDB数据模型' },
      ]
    },
  ],
  '/17-backend-what/': [
    {
      text: '常识题',
      collapsed: false,
      items: [
        { text: '导读', link: '/17-backend-what/index' },
        { text: 'QPS、TPS、RT、吞吐量这些高并发性能指标？', link: '/17-backend-what/basic/QPS、TPS、RT、吞吐量这些高并发性能指标？' },
      ]
    },
    {
      text: '问题排除',
      collapsed: false,
      items: [
        { text: 'CPU飙高系统反应慢怎么排查？', link: '/17-backend-what/问题排除/CPU飙高系统反应慢怎么排查？' },
        { text: '怎么分析JVM当前的内存占用情况？OOM后怎么分析？', link: '/17-backend-what/问题排除/怎么分析JVM当前的内存占用情况？OOM后怎么分析？' },
      ]
    },
    {
      text: '场景题',
      collapsed: false,
      items: [
        { text: '如何避免超预期的高并发压力压垮系统？', link: '/17-backend-what/场景题/如何避免超预期的高并发压力压垮系统？' },
      ]
    },
    {
      text: '设计题',
      collapsed: false,
      items: [
        { text: '让你实现一个订单超时取消，怎么设计？', link: '/17-backend-what/design/让你实现一个订单超时取消，怎么设计？' },
        { text: '定时任务扫表的方案有什么缺点？', link: '/17-backend-what/design/定时任务扫表的方案有什么缺点？' },
        { text: '单点登录（SSO）的设计与实现？', link: '/17-backend-what/design/单点登录（SSO）的设计与实现？' },
      ]
    },
    {
      text: '性能优化',
      collapsed: false,
      items: [
        { text: '性能优化', link: '/17-backend-what/性能优化/' },
      ]
    },

  ],
  '/18-Git/': [
    {
      text: 'Git',
      items: [
        { text: '导读', link: '/18-Git/' },
        { text: 'git commit规范', link: '/18-Git/git commit规范' },
      ]
    },
  ],
  '/19-Linux/': [
    {
      text: 'Linux',
      items: [
        { text: '导读', link: '/19-Linux/' },
      ]
    },
    {
      text: '遇到的问题',
      items: [
        { text: '上传文件到Linux文件名乱码', link: '/19-Linux/上传文件到Linux文件名乱码' },
      ]
    }
  ],
  '/20-operating-system/': [
    {
      text: '操作系统',
      items: [
        { text: '导读', link: '/20-operating-system/' },
      ]

    },
  ],
  '/21-computer-network/': [
    {
      text: '计算机网络',
      items: [
        { text: '导读', link: '/21-computer-network/' },
      ]
    },
  ],

  '/22-data-structure/': [
    {
      text: '数据结构',
      items: [
        { text: '导读', link: '/22-data-structure/' },
      ]
    },
    {
      text: '常见算法题',
      items: [
        { text: '常见算法题', link: '/22-data-structure/' },
      ]
    },
  ],


  '/23-设计模式/': designPatternSidebar,
  '/24-前端基础/': [
    {
      text: '前端基础',
      items: [
        { text: '导读', link: '/2-前端基础/' },
      ]
    },

  ],
  '/25-Vue/': vueSidebar,
  '/26-React/': [
    {
      text: 'React简明教程',
      collapsed: false,
      items: [
        { text: '无状态组件与有状态组件', link: '/26-React/learn/react-compoents-status' },
        { text: 'React组件通信', link: '/26-React/learn/component-communication' },
        { text: '错误边界', link: '/26-React/learn/error-boundary' },
        { text: 'Context', link: '/26-React/learn/content' },
        { text: '组件实例的三大核心属性', link: '/26-React/learn/component-props、state、refs' },
      ],
    },
    {
      text: 'React',
      collapsed: false,
      items: [
        { text: '导读', link: '/26-React/' },
        { text: 'React生命周期', link: '/26-React/life-cycle' },
        { text: '你在项目中是如何进行错误监控的', link: '/26-React/你在项目中是如何进行错误监控的' },
        { text: 'react-why-hooks', link: '/26-React/react-why-hooks' },
      ],
    },
  ],
  '/27-JavaScript/': [
    {
      text: 'JavaScript简明教程',
      collapsed: false,
      items: [
        { text: 'es6 class', link: '/27-JavaScript/learn/es6-class' },
      ]
    },
    {
      text: 'JavaScript',
      items: [
        { text: '导读', link: '/27-JavaScript/' },
        { text: 'JavaScript中==与===有什么区别？', link: '/27-JavaScript/JavaScript中==与===有什么区别？' },
        { text: 'JavaScript中for...in和for...of的区别是什么？', link: '/27-JavaScript/JavaScript中for...in和for...of的区别是什么？' },
        { text: 'JavaScript中splice和slice函数会改变原数组吗？', link: '/27-JavaScript/JavaScript中splice和slice函数会改变原数组吗？' },
        { text: '为什么需要将es6转换为es5', link: '/27-JavaScript/为什么需要将es6转换为es5' },
        { text: 'import和export的区别？', link: '/27-JavaScript/import和export的区别？' },
        { text: 'js原型链', link: '/27-JavaScript/js原型链' },
        { text: '对象原型', link: '/27-JavaScript/对象原型' },
      ],
    },
    {
      'DOM API': [
        { text: '不会冒泡的事件有哪些？', link: '/27-JavaScript/不会冒泡的事件有哪些？' },
        { text: '如何判断网页元素是否达到可视区域？', link: '/27-JavaScript/如何判断网页元素是否达到可视区域？' },
        { text: 'mouseEnter 和 mouseOver 有什么区别？', link: '/27-JavaScript/mouseEnter 和 mouseOver 有什么区别？' },
      ],
    }
  ],
  '/29-HTML/': [
    {
      text: 'HTML',
      items: [
        { text: '导读', link: '/29-HTML/' },
      ],
    },
  ],
  '/28-NodeJS/': [
    {
      text: 'NodeJS',
      items: [
        { text: '导读', link: '/28-NodeJS/' },
      ],
    },
  ],
  '/30-CSS/': [
    {
      text: 'CSS',
      items: [
        { text: '导读', link: '/30-CSS/' },
        { text: '如何使用css实现一个三角形？', link: '/30-CSS/如何使用css实现一个三角形？' },
        { text: '常见的css布局单位有哪些？', link: '/30-CSS/常见的css布局单位有哪些？' },
        { text: '说说px、em、rem的区别及其使用场景？', link: '/30-CSS/说说px、em、rem的区别及其使用场景？' },
        { text: '如何实现元素的水平垂直居中？', link: '/30-CSS/如何实现元素的水平垂直居中？' },
        { text: '说说margin和padding的使用场景？', link: '/30-CSS/说说margin和padding的使用场景？' },
        { text: '什么是margin合并、塌陷？', link: '/30-CSS/什么是margin合并、塌陷？' },
        { text: '什么是margin重叠问题？如何解决？', link: '/30-CSS/什么是margin重叠问题？如何解决？' },
        { text: '为什么需要清除浮动？清除的方式有哪些？', link: '/30-CSS/为什么需要清除浮动？清除的方式有哪些？' },
        { text: '使用clear属性清除浮动原理？', link: '/30-CSS/使用clear属性清除浮动原理？' },
        { text: '固定定位的参考点？', link: '/30-CSS/固定定位的参考点？' },
        { text: 'overflow: hidden 、 display: none、visibility: hidden 有什么区别 ？', link: '/30-CSS/overflow hidden 、 display none、visibility hidden 有什么区别 ？' },
      ],
    },
  ],

  '/31-front-what/': [
    {
      text: '常识题',
      collapsed: false,
      items: [
        { text: '导读', link: '/31-front-what/' },
        { text: '如何禁止别人调式前端页面代码？', link: '/31-front-what/如何禁止别人调式前端页面代码？' },
        { text: 'xhr与fetch', link: '/31-front-what/xhr与fetch' },
      ]
    },
    {
      text: '问题排除',
      collapsed: false,
      items: [
        { text: '更新中', link: '/31-front-what/' },
      ]
    },
    {
      text: '场景题',
      collapsed: false,
      items: [
        { text: '更新中', link: '/31-front-what/' },
      ]
    },
    {
      text: '性能优化',
      collapsed: false,
      items: [
        { text: '性能优化', link: '/17-backend-what/性能优化/' },
      ]
    },
  ],
  '/32-small-program/': [
    {
      text: '小程序',
      items: [
        { text: '导读', link: '/32-small-program/' },
      ]
    }
  ],
  '/33-webpack/': [
    {
      text: 'WebPack',
      items: [
        { text: '什么是Webpack', link: '/33-webpack/what-webpack' },
        { text: '为什么需要打包工具', link: '/33-webpack/why-build' },
        { text: 'Webpack 的五大核心概念', link: '/33-webpack/Webpack 的五大核心概念' },
        { text: 'Webpack中Loader和Plugin是什么，有什么区别', link: '/33-webpack/Webpack中Loader和Plugin是什么，有什么区别' },
        { text: 'Webpack常用的插件有哪些', link: '/33-webpack/Webpack常用的插件有哪些' },
        { text: 'Webpack的核心原理是什么', link: '/33-webpack/Webpack的核心原理是什么' },
        { text: 'Vite和Webpack在热更新上有什么区别', link: '/33-webpack/Vite和Webpack在热更新上有什么区别' },
      ]
    }
  ],
  '/nginx/': [
    {
      text: 'Nginx',
      items: [
        { text: '导读', link: '/nginx/' },
        { text: '通过 yum 方式安装 Nginx', link: '/nginx/install-nginx' },
        { text: 'Nginx的常用命令？', link: '/nginx/Nginx的常用命令？' },
        { text: 'Nginx 配置文件解读', link: '/nginx/nginx-config' },
        { text: '单服务器如何部署多个网站？', link: '/nginx/multi-deploy' },
        { text: 'Nginx配置Gzip压缩', link: '/nginx/nginx-gzip' },
        { text: 'Nginx如何实现跨域访问？', link: '/nginx/Nginx如何实现跨域访问？' },
      ]
    }
  ],
  '/34-Hadoop/': [
    {
      text: 'Hadoop',
      items: [
        { text: '什么是Hadoop', link: '/34-Hadoop/什么是Hadoop' },
        { text: 'Hadoop架构', link: '/34-Hadoop/Hadoop架构' },
        { text: 'Hadoop常用端口号、配置', link: '/34-Hadoop/Hadoop常用端口号、配置' },
        { text: 'HDFS文件块大小', link: '/34-Hadoop/HDFS文件块大小' },
        { text: 'HDFS小文件的危害', link: '/34-Hadoop/HDFS小文件的危害' },
        { text: 'HDFS小文件怎么解决', link: '/34-Hadoop/HDFS小文件怎么解决' },
      ]
    }
  ],
  '/hbase/': [
    {
      text: 'HBase',
      items: [
        { text: '导读', link: '/hbase/' },
      ]
    },
    {
      text: 'HBase简明教程',
      items: [
        { text: 'HBase引入简介', link: '/hbase/learn/00-HBase引入简介' },
        { text: 'HBase部署安装', link: '/hbase/learn/01-HBase部署安装' },
        { text: 'HBase参数文件', link: '/hbase/learn/02-HBase参数文件' },
        { text: 'HBase数据模型', link: '/hbase/learn/03-HBase数据模型' },
        { text: 'Hbase Shell', link: '/hbase/learn/04-Hbase Shell' },
        { text: 'HBase Java API操作', link: '/hbase/learn/05-HBase Java API操作' },
        { text: 'HBase Java API演示', link: '/hbase/learn/06-HBase Java API演示' },
        { text: 'HBase必坑指南', link: '/hbase/learn/HBase必坑指南' },
        { text: 'HBase整合Phoenix', link: '/hbase/learn/HBase整合Phoenix' },
      ]
    }
  ],

  '/37-Spark/': [
    {
      text: 'Spark',
      items: [
        { text: '导读', link: '/37-Spark/' },
      ]
    },
    {
      text: 'Spark简明教程',
      collapsed: true,
      items: [
        { text: 'Spark简介', link: '/37-Spark/learn/00-Spark简介' },
        { text: 'Spark环境部署', link: '/37-Spark/learn/01-Spark环境部署' },
        { text: '打包代码与依赖', link: '/37-Spark/learn/02-打包代码与依赖' },
        { text: 'Spark 程序编写流程', link: '/37-Spark/learn/Spark 程序编写流程' },

        { text: '第一个Spark程序WordCount', link: '/37-Spark/learn/03-第一个Spark程序WordCount' },
        { text: '监控页面及圆周率PI运行', link: '/37-Spark/learn/04-监控页面及圆周率PI运行' },
        { text: 'RDD五大特性', link: '/37-Spark/learn/05-RDD五大特性' },
        { text: 'RDD的创建', link: '/37-Spark/learn/06-RDD的创建' },

        { text: '向Spark传递函数', link: '/37-Spark/learn/07-向Spark传递函数' },
        { text: 'Spark常用RDD-Java', link: '/37-Spark/learn/08-Spark常用RDD-Java' },
        { text: 'Spark常用RDD-Scala', link: '/37-Spark/learn/08-Spark常用RDD-Scala' },
        { text: '在不同的RDD类型间转换', link: '/37-Spark/learn/09-在不同的RDD类型间转换' },
        { text: 'SparkRDD比较', link: '/37-Spark/learn/10-SparkRDD比较' },
        { text: 'RDD序列化', link: '/37-Spark/learn/11-RDD序列化' },
        { text: 'RDD的依赖关系', link: '/37-Spark/learn/12-RDD的依赖关系' },
        { text: '数据分区', link: '/37-Spark/learn/13-数据分区' },
        { text: 'RDD持久化(缓存)', link: '/37-Spark/learn/13-RDD持久化(缓存)' },
        { text: '累加器与广播变量', link: '/37-Spark/learn/14-累加器与广播变量' },
        { text: 'Spark内核调度', link: '/37-Spark/learn/14-Spark内核调度' },
        { text: 'Spark提交应用', link: '/37-Spark/learn/15-spark提交应用' },
        { text: 'RDD并行度与分区', link: '/37-Spark/learn/16-分区数与并行度' },
        { text: 'RDD的并行度调优', link: '/37-Spark/learn/17-RDD的并行度调优' },
        { text: '数据的读取与保存', link: '/37-Spark/learn/19-数据的读取与保存' },
        { text: '基于Spark SQL的WordCount', link: '/37-Spark/learn/26-基于Spark SQL的WordCount' },
        { text: 'Dataset 与 DataFrame', link: '/37-Spark/learn/27-Dataset 与 DataFrame' },
        { text: 'SparkSQL电影评分案例', link: '/37-Spark/learn/28-SparkSQL电影评分案例' },
        { text: '自定义UDF函数', link: '/37-Spark/learn/29-自定义UDF函数' },
        { text: 'SparkStreaming', link: '/37-Spark/learn/30-SparkStreaming' },
        { text: '基于Spark Streaming的WordCount', link: '/37-Spark/learn/31-基于Spark Streaming的WordCount' },
        { text: 'Spark Streaming的组件介绍', link: '/37-Spark/learn/32-Spark Streaming的组件介绍' },
        { text: 'DStream', link: '/37-Spark/learn/33-DStream' },
        { text: 'DStream基础输入源', link: '/37-Spark/learn/34-DStream基础输入源' },
        { text: 'SparkStreaming集成Kafka分区', link: '/37-Spark/learn/35-SparkStreaming集成Kafka' },
        { text: 'Anaconda On Linux', link: '/37-Spark/learn/Anaconda On Linux' },
        { text: 'Anaconda与PySpark安装', link: '/37-Spark/learn/Anaconda与PySpark安装' },
        { text: '开发常见问题', link: '/37-Spark/learn/开发常见问题' },
      ]
    },
    {
      text: '案例',
      items: [
        { text: 'spark影评分析案例', link: '/37-Spark/spark影评分析案例' },
      ]
    }
  ],
  '/36-Hive/': [
    {
      text: 'Hive',
      items: [
        { text: '导读', link: '/36-Hive/' },
      ]
    }
  ],

  '/38-Flink/': [
    {
      text: 'Flink',
      items: [
        { text: '导读', link: '/38-Flink/' },
      ]
    }
  ],

  '/39-Scala/': [
    {
      text: 'Scala简明教程',
      collapsed: false,
      items: [
        { text: '导读', link: '/39-Scala/' },
        { text: 'Scala变量与数据类型', link: '/39-Scala/02-Scala变量与数据类型' },
        { text: 'Scala算术运算符', link: '/39-Scala/03-Scala算术运算符' },
        { text: 'Scala流程控制', link: '/39-Scala/04-Scala流程控制' },
        { text: 'Scala函数式编程', link: '/39-Scala/05-Scala函数式编程' },
        { text: 'Scala面向对象', link: '/39-Scala/06-Scala面向对象' },
        { text: 'Scala集合', link: '/39-Scala/07-Scala集合' },
        { text: '模式匹配', link: '/39-Scala/08-模式匹配' },
        { text: '异常体系', link: '/39-Scala/09-异常体系' },
        { text: '隐式转换', link: '/39-Scala/10-隐式转换' },
        { text: '泛型', link: '/39-Scala/11-泛型' },
        { text: '正则表达式', link: '/39-Scala/12-正则表达式' },
      ]
    },
    {
      text: '基础',
      items: [
        { text: 'tuple._1与tuple._1()的区别', link: '/39-Scala/tuple._1与tuple._1()的区别' },
      ]
    },
    {
      text: '其他',
      collapsed: true,
      items: [
        { text: 'Scala环境部署（Windows）', link: '/39-Scala/01-Scala-dev-deploy' },
      ]
    },
  ],

  '/40-data-sync/': [
    {
      text: '数据同步',
      items: [
        { text: '导读', link: '/40-data-sync/' },
      ]
    }
  ],

  '/Docker/': [
    {
      text: 'Docker',
      items: [
        { text: '导读', link: '/Docker/' },
        { text: 'Docker基础', link: '/Docker/01-docker基础' },
        { text: 'Docker network', link: '/Docker/04-docker network' },
        { text: 'Dockerfile', link: '/Docker/02-Dockerfile' },
        { text: 'Dockerfile部署Tomcat', link: '/Docker/03-Dockerfile部署Tomcat' },
        { text: 'Docker中部署redis集群', link: '/Docker/05-docker中部署redis集群' },
        { text: 'Portainer安装', link: '/Docker/05-Portainer安装' },
        { text: 'Docker compose容器编排', link: '/Docker/06-Docker compose容器编排' },
        { text: 'Docker容器监控CIG', link: '/Docker/06-Docker容器监控CIG' },
        { text: 'Docker容器固定IP', link: '/Docker/07-docker容器固定IP' },
        { text: 'Docker搭建Hadoop、spark', link: '/Docker/08-Docker搭建Hadoop、spark' },
        { text: 'Docker上部署hbase', link: '/Docker/09-docker上部署hbase' },
        { text: 'Docker上部署kafka', link: '/Docker/10-docker上部署kafka' },
        { text: 'Docker中部署主从复制MySQL', link: '/Docker/12-docker中部署主从复制MySQL' },
        { text: 'Docker私有仓库', link: '/Docker/14-Docker私有仓库' },
        { text: 'Docker部署ElasticSearch、Kibana', link: '/Docker/15-Docker部署ElasticSearch、Kibana' },
      ]
    }
  ],
  '/Python/': [
    {
      text: 'Python',
      items: [
        { text: '导读', link: '/Python/' },
      ]
    }
  ],

  // ============================
  '/50-啃书-《Java8实战》/': [
    {
      text: '《Java8实战》',
      items: [
        { text: '将函数参数化进行传递', link: '/50-啃书-《Java8实战》/01-将函数参数化进行传递' },
        { text: 'Lambda表达式', link: '/50-啃书-《Java8实战》/02-Lambda表达式' },
        { text: 'Stream流', link: '/50-啃书-《Java8实战》/03-Stream流' },
        { text: 'Optional取代null', link: '/50-啃书-《Java8实战》/Optional取代null' },
      ]
    }
  ],
  '/51-啃书-《effective java》/': [
    {
      text: '《effective java》',
      items: [
        { text: '考虑使用静态方法代替构造方法', link: '/51-啃书-《effective java》/01-考虑使用静态方法代替构造方法' },
      ]
    }
  ],

}