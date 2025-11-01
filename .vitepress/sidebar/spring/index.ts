const basePath = '/05-Spring/'

export default [
  {
    text: '基础',
    collapsed: false,
    items: [
      { text: '导读', link: basePath + 'index' },
      // 优劣势
      // di是什么
      // beanfactory和applicationcontext区别
      // applicationContext实现类

      { text: '谈谈你对Spring的理解？', link: basePath + '谈谈你对Spring的理解？' },
      { text: '看过源码吗？说说Spring由哪些重要的模块组成？', link: basePath + '看过源码吗？说说Spring由哪些重要的模块组成？' },
      { text: 'Spring和SpringMVC的关系？', link: basePath + 'Spring和SpringMVC的关系？' },
      { text: '说说Spring启动过程？', link: basePath + '说说Spring启动过程？' },
      { text: 'Spring中的BeanFactory是什么？', link: basePath + 'Spring中的BeanFactory是什么？' },
      { text: 'Spring中的FactoryBean是什么？', link: basePath + 'Spring中的FactoryBean是什么？' },
      { text: 'BeanFactory 和 FactoryBean 的区别？', link: basePath + 'BeanFactory 和 FactoryBean 的区别？' },
      { text: 'Spring中的ObjectFactory是什么？', link: basePath + 'Spring中的ObjectFactory是什么？' },
      { text: 'Spring中的ApplicationContext是什么？', link: basePath + 'Spring中的ApplicationContext是什么？' },
      { text: 'ApplicationContext的实现类有哪些？', link: basePath + 'ApplicationContext的实现类有哪些？' },
      { text: 'BeanFactory 和 ApplicationContext的区别？', link: basePath + 'BeanFactory 和 ApplicationContext的区别？' },
      { text: '什么是BeanDefinition？', link: basePath + '什么是BeanDefinition？' },

      { text: 'Spring中的JPA和Hibernate有什么区别？', link: basePath + 'Spring中的JPA和Hibernate有什么区别？' },
    ],
  },
  {
    text: 'Spring IOC',
    collapsed: true,
    items: [
      { text: '什么是SpringIOC？', link: basePath + 'why-spring-ioc' },
      { text: '解释一下Spring的IOC控制反转？', link: basePath + '解释一下Spring的IOC控制反转？' },
      { text: 'SpringIOC容器初始化过程？', link: basePath + 'SpringIOC容器初始化过程？' },
      { text: 'SpringIOC有什么好处？', link: basePath + 'SpringIOC有什么好处？' },
      { text: 'Spring中的DI（依赖注入）是什么？', link: basePath + 'Spring中的DI（依赖注入）是什么？' },
      { text: 'Spring一共有几种注入方式？', link: basePath + 'Spring一共有几种注入方式？' },
      { text: '为什么Spring不建议使用基于字段的依赖注入？', link: basePath + '为什么Spring不建议使用基于字段的依赖注入？' },

      { text: 'SpringIOC有哪些扩展点，在什么时候调用呢？', link: basePath + 'SpringIOC有哪些扩展点，在什么时候调用呢？' },
    ],
  },
  {
    text: 'Spring AOP',
    collapsed: true,
    items: [
      { text: '什么是动态代理？', link: basePath + '什么是动态代理？' },
      { text: '动态代理常用的两种方式？', link: basePath + '动态代理常用的两种方式？' },
      { text: 'JDK动态代理如何实现？', link: basePath + 'JDK动态代理如何实现？' },
      { text: 'Cglib的Enhancer类实现动态代理？', link: basePath + 'Cglib的Enhancer类实现动态代理？' },
      { text: '什么是AOP？', link: basePath + '什么是AOP？' },
      { text: 'Spring AOP默认用的是什么代理？两者区别？', link: basePath + 'Spring AOP默认用的是什么代理？两者区别？' },
      { text: 'Spring AOP在什么场景下会失效？', link: basePath + 'Spring AOP在什么场景下会失效？' },
      { text: 'Spring AOP和AspectJ有什么区别？', link: basePath + 'Spring AOP和AspectJ有什么区别？' },
      { text: '简述Spring拦截链的实现？', link: basePath + '简述Spring拦截链的实现？' },
      {
        text: 'Spring事务',
        collapsed: true,
        items: [
          { text: 'Spring通知类型有哪些？', link: basePath + 'Spring通知类型有哪些？' },
          { text: 'Spring事务有几个隔离级别？', link: basePath + 'Spring事务有几个隔离级别？' },
          { text: 'Spring支持的事务管理类型和实现方式？', link: basePath + 'Spring支持的事务管理类型和实现方式？' },
          { text: 'Spring（声明式）事务传播行为？', link: basePath + 'Spring（声明式）事务传播行为？' },
          { text: 'Spring事务传播行为有什么用？', link: basePath + 'Spring事务传播行为有什么用？' },
          { text: 'Spring事务的失效场景？', link: basePath + 'Spring事务的失效场景？' },
          { text: 'Spring的事务在多线程下生效吗？为什么？', link: basePath + 'Spring的事务在多线程下生效吗？为什么？' },
          { text: 'Spring多线程事务能否保证事务的一致性？', link: basePath + 'Spring多线程事务能否保证事务的一致性？' },
          { text: '@Transactional底层实现？', link: basePath + '@Transactional底层实现？' },
          { text: '@Transactional 注解失效场景', link: basePath + '@Transactional 注解失效场景' },
          { text: '为什么有些公司禁止使用@Transactional声明式事务？', link: basePath + '为什么有些公司禁止使用@Transactional声明式事务？' },
          { text: 'Spring中如何开启事务？', link: basePath + 'Spring中如何开启事务？' },
          { text: '同时使用@Transactional与@Async时，事务会不会生效？', link: basePath + '同时使用@Transactional与@Async时，事务会不会生效？' },
        ],
      }
    ],
  },
  {
    text: 'Bean相关',
    collapsed: true,
    items: [
      // bean生命周期 作用范围 bean实例的方式 属性注入的方式 
      // @Autowired @Resource区别
      // @Component @Bean区别

      { text: 'Bean标签的（常用）属性？', link: basePath + 'Bean标签的（常用）属性？' },

      {
        text: '生命周期',
        collapsed: false,
        items: [
          { text: 'Bean的作用范围（域）和生命周期？', link: basePath + 'Bean的作用范围（域）和生命周期？' },
          { text: 'bean的生命周期回调方法和执行顺序？', link: basePath + 'bean的生命周期回调方法和执行顺序？' },
          { text: '@PostConstruct、init-method和afterPropertiesSet执行顺序', link: basePath + '@PostConstruct、init-method和afterPropertiesSet执行顺序' },
          { text: 'Bean的初始化过程', link: basePath + 'Bean的初始化过程' },
        ]
      },

      { text: '单例bean的优势？', link: basePath + '单例bean的优势？' },
      { text: 'Spring的单例bean是线程安全的吗？', link: basePath + 'Spring的单例bean是线程安全的吗？' },
      { text: 'Spring的单例bean如何保证线程安全？', link: basePath + 'Spring的单例bean如何保证线程安全' },
      { text: 'Spring实例化Bean有几种方式？', link: basePath + 'Spring实例化Bean有几种方式？' },
      { text: '如何控制Spring Bean的创建顺序？', link: basePath + '如何控制Spring Bean的创建顺序？' },
      { text: 'Spring在加载过程中bean有几种形态？', link: basePath + 'Spring在加载过程中bean有几种形态？' },

      { text: 'Spring一共有几种注入方式？', link: basePath + 'Spring一共有几种注入方式？' },
      { text: 'Spring的属性注入方式有哪几种？', link: basePath + 'Spring的属性注入方式有哪几种？' },
      { text: '什么是bean装配？什么是bean的自动装配？', link: basePath + '什么是bean装配？什么是bean的自动装配？' },
      { text: 'Spring Bean注册到容器有哪些方式？', link: basePath + 'Spring Bean注册到容器有哪些方式？' },
      { text: '自动装配（注入）有什么限制或者说注意事项？', link: basePath + '自动装配（注入）有什么限制或者说注意事项？' },
      { text: 'Spring自动装配的方式有哪些？', link: basePath + 'Spring自动装配的方式有哪些？' },
      { text: 'Spring使用注解的进行装配的时候，需要什么注解', link: basePath + 'Spring使用注解的进行装配的时候，需要什么注解' },
      { text: 'Bean如何修改', link: basePath + 'Bean如何修改' },

    ],
  },

  {
    text: '进阶',
    collapsed: true,
    items: [
      // 循环依赖 动态代理 设计模式 事务 
      { text: 'Spring循环依赖问题是什么？（什么是循环依赖？）', link: basePath + 'Spring循环依赖问题是什么？' },
      { text: 'Spring如何解决循环依赖？', link: basePath + 'Spring如何解决循环依赖？' },
      { text: 'Spring不能解决的循环依赖有哪些？', link: basePath + 'Spring不能解决的循环依赖有哪些？' },
      { text: '为什么Spring循环依赖需要三级缓存，二级不够吗？', link: basePath + '为什么Spring循环依赖需要三级缓存，二级不够吗？' },
      { text: 'Spring解决循环依赖一定需要三级缓存吗？', link: basePath + 'Spring解决循环依赖一定需要三级缓存吗？' },
      { text: '什么是Spring的三级缓存', link: basePath + '什么是Spring的三级缓存' },
      { text: '@Lazy能解决循环依赖吗？', link: basePath + '@Lazy能解决循环依赖吗？' },
      { text: 'Spring中shutdownhook作用是什么？', link: basePath + 'Spring中shutdownhook作用是什么？' },
      { text: '如何根据配置动态生成Spring的Bean？', link: basePath + '如何根据配置动态生成Spring的Bean？' },


      {
        text: '发布订阅',
        collapsed: true,
        items: [
          { text: 'Spring 提供的事件发布和监听机制？', link: basePath + 'Spring 提供的事件发布和监听机制？' },
          { text: '为什么不建议直接使用Spring的@Async', link: basePath + '为什么不建议直接使用Spring的@Async' },
          { text: 'Spring事件监听什么情况下会失效？', link: basePath + 'Spring事件监听什么情况下会失效？' },
          { text: 'Spring异步发布事件的核心机制？', link: basePath + 'Spring异步发布事件的核心机制？' },
          { text: 'Spring Event和MQ有什么区别？', link: basePath + 'Spring Event和MQ有什么区别？' },
          { text: 'Spring引入外部配置文件的方式', link: basePath + 'Spring引入外部配置文件的方式' },
        ]
      }
    ],
  },
  {
    text: '注解',
    collapsed: true,
    items: [
      { text: '说说Spring常用的注解', link: basePath + '说说Spring常用的注解' },
      { text: '@Component与@Bean的区别？', link: basePath + '@Component与@Bean的区别？' },
      { text: '@Bean写在配置类与@Bean不写在配置类中的区别', link: basePath + '@Bean写在配置类与@Bean不写在配置类中的区别' },
      { text: '@Component和@Configuration能不能互换', link: basePath + '@Component和@Configuration能不能互换' },
      { text: '@Bean为什么要与@Configuration配合使用', link: basePath + '@Bean为什么要与@Configuration配合使用' },
      { text: '@Autowired和@Resource的区别', link: basePath + '@Autowired和@Resource的区别' },
      { text: '@Qualifier注解有什么用？', link: basePath + '@Qualifier注解有什么用？' },
      { text: '为什么不推荐使用@Autowired', link: basePath + '为什么不推荐使用@Autowired' },
      { text: '@Autowired能用在Map上吗？', link: basePath + '@Autowired能用在Map上吗？' },
      { text: '@PropertySource注解的作用？', link: basePath + '@PropertySource注解的作用？' },
      { text: '@ComponentScan注解的作用？', link: basePath + '@ComponentScan注解的作用？' },
      { text: '@Component、@Controller、@Repository和@Service的区别？', link: basePath + '@Component、@Controller、@Repository和@Service的区别？' },
      { text: '@Scope注解的作用？', link: basePath + '@Scope注解的作用？' },
      { text: '@Primary注解的作用？', link: basePath + '@Primary注解的作用？' },
      { text: '@Value注解的作用？', link: basePath + '@Value注解的作用？' },
      { text: '@Profile注解的作用？', link: basePath + '@Profile注解的作用？' },
      { text: '@PostConstruct和@PreDestory注解的作用？', link: basePath + '@PostConstruct和@PreDestory注解的作用？' },
      { text: '@ExceptionHandler注解的作用？', link: basePath + '@ExceptionHandler注解的作用？' },
      { text: '@ResponseStatus注解的作用？', link: basePath + '@ResponseStatus注解的作用？' },
      { text: '@Validated和@Valid注解的作用？区别？', link: basePath + '@Validated和@Valid注解的作用？区别？' },
      { text: '@Scheduled注解的作用？', link: basePath + '@Scheduled注解的作用？' },
      { text: '@Scheduled的用法、实现原理', link: basePath + '@Scheduled的用法、实现原理' },
      { text: '@Cacheable和@CacheEvict注解的作用？', link: basePath + '@Cacheable和@CacheEvict注解的作用？' },
      { text: '@Conditional及相关注解的作用？', link: basePath + 'Conditional及相关注解的作用？' },
      { text: '@Lazy注解的作用？', link: basePath + '@Lazy注解的作用？' },
      { text: '@EventListener注解的作用？', link: basePath + '@EventListener注解的作用？' },

    ],
  },

  {
    text: '扩展机制',
    collapsed: false,
    items: [
      { text: '如何在所有BeanDefinition注册完以后做扩展？', link: basePath + '如何在所有BeanDefinition注册完以后做扩展？' },


    ]
  },
  {
    text: '性能优化',
    collapsed: false,
    items: [
      { text: '如何优化Spring应用的启动时间', link: basePath + '如何优化Spring应用的启动时间' },
      { text: '懒加载的使用场景', link: basePath + '懒加载的使用场景' },


    ]
  },
  {
    text: '故障排查',
    collapsed: false,
    items: [
      { text: '如何排查Bean无法注入', link: basePath + '如何在所有BeanDefinition注册完以后做扩展？' },
      { text: '如何排查声明式事务不生效', link: basePath + '如何在所有BeanDefinition注册完以后做扩展？' },
      { text: '如何排查AOP不生效', link: basePath + '如何在所有BeanDefinition注册完以后做扩展？' },


    ]
  },
  {
    text: '实战',
    collapsed: false,
    items: [
      { text: 'Spring在业务中常见的使用方式', link: basePath + 'Spring在业务中常见的使用方式' },
      { text: 'Spring中的事务事件如何使用？', link: basePath + 'Spring中的事务事件如何使用？' },
      { text: 'Spring中如何实现多环境配置？', link: basePath + 'Spring中如何实现多环境配置？' },
      { text: '如何统计一个Bean中的方法调用次数', link: basePath + '如何统计一个Bean中的方法调用次数' },
      { text: '如何在Spring启动过程中做缓存预热', link: basePath + '如何在Spring启动过程中做缓存预热' },
    ]
  },
  {
    text: '设计模式',
    collapsed: false,
    items: [
      { text: 'Spring都用到哪些设计模式？', link: basePath + 'Spring都用到哪些设计模式？' },

    ]
  }
]