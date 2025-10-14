const basePath = '/07-SpringBoot/'

export default [
  {
    text: '基础',
    collapsed: false,
    items: [
      { text: 'SpringBoot', link: '/07-SpringBoot/' },
      { text: '什么是SpringBoot？', link: '/07-SpringBoot/什么是SpringBoot？' },
      { text: 'SpringBoot的核心特性？', link: '/07-SpringBoot/SpringBoot的核心特性？' },
      { text: 'SpringBoot1.x、2.x、3.x版本有哪些改进与区别？', link: '/07-SpringBoot/SpringBoot1.x、2.x、3.x版本有哪些改进与区别？' },
      { text: '什么是Spring Initializr？', link: '/07-SpringBoot/什么是Spring Initializr？' },
      { text: 'SpringBoot启动过程？', link: '/07-SpringBoot/SpringBoot启动过程？' },
    ]
  },
  {
    text: '原理',
    collapsed: true,
    items: [
      // 自动配置
      // 配置文件加载顺序
    ]
  },
  {
    text: '注解',
    collapsed: true,
    items: [
    ]
  },
  {
    text: '实战',
    collapsed: true,
    items: [
      // 配置一个属性
      // 多环境加载不同配置文件
      // 整合slf4j
      // 扩展SpringMVC
      // 热部署
      // 整合redis
      // 如何jar包启动
    ]
  },
  {
    text: 'SpringBoot',
    items: [


      { text: '你在使用SpringBoot时如何固定版本的？', link: '/07-SpringBoot/你在使用SpringBoot时如何固定版本的？' },
      { text: 'SpringBoot是如何通过main方法启动web项目的？', link: '/07-SpringBoot/SpringBoot是如何通过main方法启动web项目的？' },
      { text: 'SpringBoot有哪些核心注解？', link: '/07-SpringBoot/SpringBoot有哪些核心注解？' },
      { text: '@SpringBootApplication注解', link: '/07-SpringBoot/@SpringBootApplication注解' },
      { text: '@ConfigurationProperties注解的作用？', link: '/07-SpringBoot/@ConfigurationProperties注解的作用？' },
      { text: 'SpringBoot支持嵌入哪些Web容器？', link: '/07-SpringBoot/SpringBoot支持嵌入哪些Web容器？' },
      { text: 'SpringBoot中application.properties、application.yaml、application.yml的区别？', link: '/07-SpringBoot/SpringBoot中application.properties、application.yaml、application.yml的区别？' },
      { text: '如何在SpringBoot在定义和读取自定义配置？', link: '/07-SpringBoot/如何在SpringBoot在定义和读取自定义配置？' },
      { text: 'SpringBoot配置文件加载优先级？', link: '/07-SpringBoot/SpringBoot配置文件加载优先级？' },
      { text: 'SpringBoot自动配置原理？', link: '/07-SpringBoot/SpringBoot自动配置原理？' },
      { text: 'SpringBoot内置Tomcat启动原理？', link: '/07-SpringBoot/SpringBoot内置Tomcat启动原理？' },
      { text: 'SpringBoot外部Tomcat启动原理？', link: '/07-SpringBoot/SpringBoot外部Tomcat启动原理？' },
      { text: 'SpringBoot打成的jar包与普通jar的区别？', link: '/07-SpringBoot/SpringBoot打成的jar包与普通jar的区别？' },
      { text: 'SpringBoot是否可以使用xml配置？', link: '/07-SpringBoot/SpringBoot是否可以使用xml配置？' },
      { text: '如何处理SpringBoot中的全局异常？', link: '/07-SpringBoot/如何处理SpringBoot中的全局异常？' },
      { text: 'SpringBoot默认同时可以处理的最大连接数？', link: '/07-SpringBoot/SpringBoot默认同时可以处理的最大连接数？' },
      { text: '如何理解SpringBoot中的starter？', link: '/07-SpringBoot/如何理解SpringBoot中的starter？' },
      { text: '如何自定义SpringBoot中的starter？', link: '/07-SpringBoot/如何自定义SpringBoot中的starter？' },
      { text: 'SpringBoot中6种自定义starter开发方法', link: '/07-SpringBoot/SpringBoot中6种自定义starter开发方法' },
      { text: 'SpringBoot处理处理跨域请求（CORS）？', link: '/07-SpringBoot/SpringBoot处理处理跨域请求（CORS）？' },
      { text: '在SpringBoot中你是怎么使用拦截器的？', link: '/07-SpringBoot/在SpringBoot中你是怎么使用拦截器的？' },
      { text: 'SpringBoot中如何实现定时任务？', link: '/07-SpringBoot/SpringBoot中如何实现定时任务？' },
      { text: 'SpringBoot中如何实现异步处理？', link: '/07-SpringBoot/SpringBoot中如何实现异步处理？' },
      { text: '如何在SpringBoot应用中实现国际化（i18n）？', link: '/07-SpringBoot/如何在SpringBoot应用中实现国际化（i18n）？' },
      { text: '什么是Spring Actuator？它有什么优势？', link: '/07-SpringBoot/什么是Spring Actuator？它有什么优势？' },
      { text: 'SpringBoot中的条件注解@Conditional有什么用？', link: '/07-SpringBoot/SpringBoot中的条件注解@Conditional有什么用？' },
      { text: '说说你对SpringBoot事件机制的理解？', link: '/07-SpringBoot/说说你对SpringBoot事件机制的理解？' },
      { text: '在SpringBoot中如何实现多数据源配置？', link: '/07-SpringBoot/在SpringBoot中如何实现多数据源配置？' },
      { text: '如何在SpringBoot启动时执行特定代码？有哪些方式？', link: '/07-SpringBoot/如何在SpringBoot启动时执行特定代码？有哪些方式？' },
      { text: 'SpringBoot中为什么不推荐使用@Autowrited', link: '/07-SpringBoot/SpringBoot中为什么不推荐使用@Autowrited' },
      { text: 'SpringBoot的自动配置？', link: '/07-SpringBoot/SpringBoot的自动配置？' },
      { text: '@AutoConfiguration注解', link: '/07-SpringBoot/@AutoConfiguration注解' },
      { text: 'SpringBoot自动装配原理？', link: '/07-SpringBoot/SpringBoot自动装配原理？' },
      { text: 'SpringBoot读取配置有哪些方式？', link: '/07-SpringBoot/SpringBoot读取配置有哪些方式？' },
      { text: 'SpringBoot项目内部配置文件加载顺序？', link: '/07-SpringBoot/SpringBoot项目内部配置文件加载顺序？' },
      { text: 'SpringBoot外部配置文件加载顺序？', link: '/07-SpringBoot/SpringBoot外部配置文件加载顺序？' },
      { text: 'SpringBoot加载配置application.yml的过程与原理', link: '/07-SpringBoot/SpringBoot加载配置application.yml的过程与原理' },
      { text: '@Value和@ConfigurationProperties比较', link: '/07-SpringBoot/@Value和@ConfigurationProperties比较' },
      { text: '如何对SpringBoot配置文件敏感信息加密？', link: '/07-SpringBoot/如何对SpringBoot配置文件敏感信息加密？' },
      { text: '谈谈你对SpringBoot约定优于配置的理解？', link: '/07-SpringBoot/谈谈你对SpringBoot约定优于配置的理解？' },
    ]
  }

]