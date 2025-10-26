const basePath = '/07-SpringBoot/'

export default [
  {
    text: '基础',
    collapsed: false,
    items: [
      { text: 'SpringBoot', link: basePath + '' },
      { text: '什么是SpringBoot？', link: basePath + '什么是SpringBoot？' },
      { text: 'SpringBoot与Spring的区别？', link: basePath + 'SpringBoot与Spring的区别？' },
      { text: 'SpringBoot的核心特性？', link: basePath + 'SpringBoot的核心特性？' },
      { text: 'SpringBoot1.x、2.x、3.x版本有哪些改进与区别？', link: basePath + 'SpringBoot1.x、2.x、3.x版本有哪些改进与区别？' },
      { text: '什么是Spring Initializr？', link: basePath + '什么是Spring Initializr？' },
      { text: 'SpringBoot启动过程？', link: basePath + 'SpringBoot启动过程？' },
      { text: 'SpringBoot是如何通过main方法启动web项目的？', link: basePath + 'SpringBoot是如何通过main方法启动web项目的？' },
      { text: '你在使用SpringBoot时如何固定版本的？', link: basePath + '你在使用SpringBoot时如何固定版本的？' },

    ]
  },
  {
    text: '原理',
    collapsed: true,
    items: [
      // 自动配置
      // 配置文件加载顺序
      { text: 'SpringBoot的自动配置？', link: basePath + 'SpringBoot的自动配置？' },
      { text: 'SpringBoot自动装配原理？', link: basePath + 'SpringBoot自动装配原理？' },
      { text: 'SpringBoot中application.properties、application.yaml、application.yml的区别？', link: basePath + 'SpringBoot中application.properties、application.yaml、application.yml的区别？' },
      { text: '如何在SpringBoot在定义和读取自定义配置？', link: basePath + '如何在SpringBoot在定义和读取自定义配置？' },
      { text: 'SpringBoot配置文件加载优先级？', link: basePath + 'SpringBoot配置文件加载优先级？' },
    ]
  },
  {
    text: '注解',
    collapsed: true,
    items: [
      { text: 'SpringBoot有哪些核心注解？', link: basePath + 'SpringBoot有哪些核心注解？' },
      { text: '@SpringBootApplication', link: basePath + '@SpringBootApplication' },
      { text: '@ConfigurationProperties注解的作用？', link: basePath + '@ConfigurationProperties注解的作用？' },
      { text: '@AutoConfiguration', link: basePath + '@AutoConfiguration' },
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
      { text: 'SpringBoot处理处理跨域请求（CORS）？', link: basePath + 'SpringBoot处理处理跨域请求（CORS）？' },
      { text: '在SpringBoot中你是怎么使用拦截器的？', link: basePath + '在SpringBoot中你是怎么使用拦截器的？' },
      { text: 'SpringBoot中如何实现定时任务？', link: basePath + 'SpringBoot中如何实现定时任务？' },
      { text: 'SpringBoot中如何实现异步处理？', link: basePath + 'SpringBoot中如何实现异步处理？' },
      { text: '如何在SpringBoot应用中实现国际化（i18n）？', link: basePath + '如何在SpringBoot应用中实现国际化（i18n）？' },
      { text: 'SpringBoot如何做优雅停机？', link: basePath + 'SpringBoot如何做优雅停机？' },

    ]
  },
  {
    text: 'SpringBoot',
    items: [

      { text: 'SpringBoot支持嵌入哪些Web容器？', link: basePath + 'SpringBoot支持嵌入哪些Web容器？' },


      { text: 'SpringBoot内置Tomcat启动原理？', link: basePath + 'SpringBoot内置Tomcat启动原理？' },
      { text: 'SpringBoot外部Tomcat启动原理？', link: basePath + 'SpringBoot外部Tomcat启动原理？' },
      { text: 'SpringBoot打成的jar包与普通jar的区别？', link: basePath + 'SpringBoot打成的jar包与普通jar的区别？' },
      { text: 'SpringBoot是否可以使用xml配置？', link: basePath + 'SpringBoot是否可以使用xml配置？' },
      { text: '如何处理SpringBoot中的全局异常？', link: basePath + '如何处理SpringBoot中的全局异常？' },
      { text: 'SpringBoot默认同时可以处理的最大连接数？', link: basePath + 'SpringBoot默认同时可以处理的最大连接数？' },
      { text: '如何理解SpringBoot中的starter？', link: basePath + '如何理解SpringBoot中的starter？' },
      { text: '如何自定义SpringBoot中的starter？', link: basePath + '如何自定义SpringBoot中的starter？' },
      { text: 'SpringBoot中6种自定义starter开发方法', link: basePath + 'SpringBoot中6种自定义starter开发方法' },


      { text: '什么是Spring Actuator？它有什么优势？', link: basePath + '什么是Spring Actuator？它有什么优势？' },
      { text: 'SpringBoot中的条件注解@Conditional有什么用？', link: basePath + 'SpringBoot中的条件注解@Conditional有什么用？' },
      { text: '说说你对SpringBoot事件机制的理解？', link: basePath + '说说你对SpringBoot事件机制的理解？' },
      { text: '在SpringBoot中如何实现多数据源配置？', link: basePath + '在SpringBoot中如何实现多数据源配置？' },
      { text: '如何在SpringBoot启动时执行特定代码？有哪些方式？', link: basePath + '如何在SpringBoot启动时执行特定代码？有哪些方式？' },
      { text: 'SpringBoot中为什么不推荐使用@Autowrited', link: basePath + 'SpringBoot中为什么不推荐使用@Autowrited' },

      { text: 'SpringBoot读取配置有哪些方式？', link: basePath + 'SpringBoot读取配置有哪些方式？' },
      { text: 'SpringBoot项目内部配置文件加载顺序？', link: basePath + 'SpringBoot项目内部配置文件加载顺序？' },
      { text: 'SpringBoot外部配置文件加载顺序？', link: basePath + 'SpringBoot外部配置文件加载顺序？' },
      { text: 'SpringBoot加载配置application.yml的过程与原理', link: basePath + 'SpringBoot加载配置application.yml的过程与原理' },
      { text: '@Value和@ConfigurationProperties比较', link: basePath + '@Value和@ConfigurationProperties比较' },
      { text: '如何对SpringBoot配置文件敏感信息加密？', link: basePath + '如何对SpringBoot配置文件敏感信息加密？' },
      { text: '谈谈你对SpringBoot约定优于配置的理解？', link: basePath + '谈谈你对SpringBoot约定优于配置的理解？' },
    ]
  }

]