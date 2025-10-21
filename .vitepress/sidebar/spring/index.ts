const basePath = '/05-Spring/'

export default [
  {
    text: '基础',
    collapsed: false,
    items: [
      { text: '导读', link: '/05-Spring/index' },
      // 优劣势
      // di是什么
      // beanfactory和applicationcontext区别
      // applicationContext实现类

      { text: '谈谈你对Spring的理解？', link: '/05-Spring/谈谈你对Spring的理解？' },
      { text: '看过源码吗？说说Spring由哪些重要的模块组成？', link: '/05-Spring/看过源码吗？说说Spring由哪些重要的模块组成？' },
      { text: 'Spring和SpringMVC的关系？', link: '/05-Spring/Spring和SpringMVC的关系？' },
      { text: '说说Spring启动过程？', link: '/05-Spring/说说Spring启动过程？' },
      { text: 'Spring中的BeanFactory是什么？', link: '/05-Spring/Spring中的BeanFactory是什么？' },
      { text: 'Spring中的FactoryBean是什么？', link: '/05-Spring/Spring中的FactoryBean是什么？' },
      { text: 'BeanFactory 和 FactoryBean 的区别？', link: '/05-Spring/BeanFactory 和 FactoryBean 的区别？' },
      { text: 'Spring中的ObjectFactory是什么？', link: '/05-Spring/Spring中的ObjectFactory是什么？' },
      { text: 'Spring中的ApplicationContext是什么？', link: '/05-Spring/Spring中的ApplicationContext是什么？' },
      { text: 'ApplicationContext的实现类有哪些？', link: '/05-Spring/ApplicationContext的实现类有哪些？' },
      { text: 'BeanFactory 和 ApplicationContext的区别？', link: '/05-Spring/BeanFactory 和 ApplicationContext的区别？' },
      { text: '什么是BeanDefinition？', link: '/05-Spring/什么是BeanDefinition？' },

      { text: 'Spring中的JPA和Hibernate有什么区别？', link: '/05-Spring/Spring中的JPA和Hibernate有什么区别？' },
    ],
  },
  {
    text: 'Spring IOC',
    collapsed: true,
    items: [
      { text: '什么是SpringIOC？', link: '/05-Spring/why-spring-ioc' },
      { text: '解释一下Spring的IOC控制反转？', link: '/05-Spring/解释一下Spring的IOC控制反转？' },
      { text: 'SpringIOC容器初始化过程？', link: '/05-Spring/SpringIOC容器初始化过程？' },
      { text: 'SpringIOC有什么好处？', link: '/05-Spring/SpringIOC有什么好处？' },
      { text: 'Spring中的DI（依赖注入）是什么？', link: '/05-Spring/Spring中的DI（依赖注入）是什么？' },
      { text: 'Spring一共有几种注入方式？', link: '/05-Spring/Spring一共有几种注入方式？' },

      { text: 'SpringIOC有哪些扩展点，在什么时候调用呢？', link: '/05-Spring/SpringIOC有哪些扩展点，在什么时候调用呢？' },
    ],
  },
  {
    text: 'Spring AOP',
    collapsed: true,
    items: [
      { text: '什么是AOP？', link: '/05-Spring/什么是AOP？' },
      { text: '什么是动态代理？', link: '/05-Spring/什么是动态代理？' },
      { text: '动态代理常用的两种方式？', link: '/05-Spring/动态代理常用的两种方式？' },
      { text: 'JDK动态代理如何实现？', link: '/05-Spring/JDK动态代理如何实现？' },
      { text: 'Cglib的Enhancer类实现动态代理？', link: '/05-Spring/Cglib的Enhancer类实现动态代理？' },
      { text: 'Spring AOP默认用的是什么代理？两者区别？', link: '/05-Spring/Spring AOP默认用的是什么代理？两者区别？' },
      { text: 'Spring AOP在什么场景下会失效？', link: '/05-Spring/Spring AOP在什么场景下会失效？' },
      { text: '简述Spring拦截链的实现？', link: '/05-Spring/简述Spring拦截链的实现？' },
      { text: 'Spring AOP和AspectJ有什么区别？', link: '/05-Spring/Spring AOP和AspectJ有什么区别？' },
      {
        text: 'Spring事务',
        collapsed: true,
        items: [
          { text: 'Spring通知类型有哪些？', link: '/05-Spring/Spring通知类型有哪些？' },
          { text: 'Spring事务有几个隔离级别？', link: '/05-Spring/Spring事务有几个隔离级别？' },
          { text: 'Spring支持的事务管理类型和实现方式？', link: '/05-Spring/Spring支持的事务管理类型和实现方式？' },
          { text: 'Spring（声明式）事务传播行为？', link: '/05-Spring/Spring（声明式）事务传播行为？' },
          { text: 'Spring事务传播行为有什么用？', link: '/05-Spring/Spring事务传播行为有什么用？' },
          { text: 'Spring事务的失效场景？', link: '/05-Spring/Spring事务的失效场景？' },
          { text: 'Spring多线程事务能否保证事务的一致性？', link: '/05-Spring/Spring多线程事务能否保证事务的一致性？' },
          { text: '@Transactional底层实现？', link: '/05-Spring/@Transactional底层实现？' },
          { text: '@Transactional 注解失效场景', link: '/05-Spring/@Transactional 注解失效场景' },
          { text: '为什么有些公司禁止使用@Transactional声明式事务？', link: '/05-Spring/为什么有些公司禁止使用@Transactional声明式事务？' },
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

      { text: 'Bean标签的（常用）属性？', link: '/05-Spring/Bean标签的（常用）属性？' },
      { text: 'Bean的作用范围（域）和生命周期？', link: '/05-Spring/Bean的作用范围（域）和生命周期？' },
      { text: 'bean的生命周期回调方法和执行顺序？', link: '/05-Spring/bean的生命周期回调方法和执行顺序？' },
      { text: '单例bean的优势？', link: '/05-Spring/单例bean的优势？' },
      { text: 'Spring的单例bean是线程安全的吗？', link: '/05-Spring/Spring的单例bean是线程安全的吗？' },
      { text: 'Spring的单例bean如何保证线程安全？', link: '/05-Spring/Spring的单例bean如何保证线程安全' },
      { text: 'Spring实例化Bean有几种方式？', link: '/05-Spring/Spring实例化Bean有几种方式？' },
      { text: '如何控制Spring Bean的创建顺序？', link: '/05-Spring/如何控制Spring Bean的创建顺序？' },
      { text: 'Spring在加载过程中bean有几种形态？', link: '/05-Spring/Spring在加载过程中bean有几种形态？' },

      { text: 'Spring一共有几种注入方式？', link: '/05-Spring/Spring一共有几种注入方式？' },
      { text: 'Spring的属性注入方式有哪几种？', link: '/05-Spring/Spring的属性注入方式有哪几种？' },
      { text: '什么是bean装配？什么是bean的自动装配？', link: '/05-Spring/什么是bean装配？什么是bean的自动装配？' },
      { text: 'Spring Bean注册到容器有哪些方式？', link: '/05-Spring/Spring Bean注册到容器有哪些方式？' },
      { text: '自动装配（注入）有什么限制或者说注意事项？', link: '/05-Spring/自动装配（注入）有什么限制或者说注意事项？' },
      { text: 'Spring自动装配的方式有哪些？', link: '/05-Spring/Spring自动装配的方式有哪些？' },
      { text: 'Spring使用注解的进行装配的时候，需要什么注解', link: '/05-Spring/Spring使用注解的进行装配的时候，需要什么注解' },
    ],
  },

  {
    text: '进阶',
    collapsed: true,
    items: [
      // 循环依赖 动态代理 设计模式 事务 
      { text: 'Spring循环依赖问题是什么？（什么是循环依赖？）', link: '/05-Spring/Spring循环依赖问题是什么？' },
      { text: 'Spring如何解决循环依赖？', link: '/05-Spring/Spring如何解决循环依赖？' },
      { text: '为什么Spring循环依赖需要三级缓存，二级不够吗？', link: '/05-Spring/为什么Spring循环依赖需要三级缓存，二级不够吗？' },
      { text: 'Spring不能解决的循环依赖有哪些？', link: '/05-Spring/Spring不能解决的循环依赖有哪些？' },


      {
        text: '发布订阅',
        collapsed: true,
        items: [
          { text: 'Spring 提供的事件发布和监听机制？', link: '/05-Spring/Spring 提供的事件发布和监听机制？' },
          { text: 'Spring事件监听什么情况下会失效？', link: '/05-Spring/Spring事件监听什么情况下会失效？' },
          { text: 'Spring异步发布事件的核心机制？', link: '/05-Spring/Spring异步发布事件的核心机制？' },
          { text: 'Spring引入外部配置文件的方式', link: '/05-Spring/Spring引入外部配置文件的方式' },
        ]
      }
    ],
  },
  {
    text: '注解',
    collapsed: true,
    items: [
      { text: '说说Spring常用的注解', link: '/05-Spring/说说Spring常用的注解' },
      { text: '@Component与@Bean的区别？', link: '/05-Spring/@Component与@Bean的区别？' },
      { text: '@Component和@Configuration能不能互换', link: '/05-Spring/@Component和@Configuration能不能互换' },
      { text: '@Bean写在配置类与@Bean不写在配置类中的区别', link: '/05-Spring/@Bean写在配置类与@Bean不写在配置类中的区别' },
      { text: '@Autowired和@Resource的区别', link: '/05-Spring/@Autowired和@Resource的区别' },
      { text: '为什么不推荐使用@Autowired', link: '/05-Spring/为什么不推荐使用@Autowired' },
      { text: '@PropertySource注解的作用？', link: '/05-Spring/@PropertySource注解的作用？' },
      { text: '@Qualifier注解有什么用？', link: '/05-Spring/@Qualifier注解有什么用？' },
      { text: '@ComponentScan注解的作用？', link: '/05-Spring/@ComponentScan注解的作用？' },
      { text: '@Component、@Controller、@Repository和@Service的区别？', link: '/05-Spring/@Component、@Controller、@Repository和@Service的区别？' },
      { text: '@Scope注解的作用？', link: '/05-Spring/@Scope注解的作用？' },
      { text: '@Primary注解的作用？', link: '/05-Spring/@Primary注解的作用？' },
      { text: '@Value注解的作用？', link: '/05-Spring/@Value注解的作用？' },
      { text: '@Profile注解的作用？', link: '/05-Spring/@Profile注解的作用？' },
      { text: '@PostConstruct和@PreDestory注解的作用？', link: '/05-Spring/@PostConstruct和@PreDestory注解的作用？' },
      { text: '@ExceptionHandler注解的作用？', link: '/05-Spring/@ExceptionHandler注解的作用？' },
      { text: '@ResponseStatus注解的作用？', link: '/05-Spring/@ResponseStatus注解的作用？' },
      { text: '@Validated和@Valid注解的作用？区别？', link: '/05-Spring/@Validated和@Valid注解的作用？区别？' },
      { text: '@Scheduled注解的作用？', link: '/05-Spring/@Scheduled注解的作用？' },
      { text: '@Cacheable和@CacheEvict注解的作用？', link: '/05-Spring/@Cacheable和@CacheEvict注解的作用？' },
      { text: '@Conditional及相关注解的作用？', link: '/05-Spring/Conditional及相关注解的作用？' },
      { text: '@Lazy注解的作用？', link: '/05-Spring/@Lazy注解的作用？' },
      { text: '@EventListener注解的作用？', link: '/05-Spring/@EventListener注解的作用？' },

    ],
  },

  {
    text: '扩展机制',
    collapsed: false,
    items: [
      { text: '如何在所有BeanDefinition注册完以后做扩展？', link: '/05-Spring/如何在所有BeanDefinition注册完以后做扩展？' },


    ]
  },
  {
    text: '性能优化',
    collapsed: false,
    items: [
      { text: '如何优化Spring应用的启动时间', link: '/05-Spring/如何优化Spring应用的启动时间' },
      { text: '懒加载的使用场景', link: '/05-Spring/懒加载的使用场景' },


    ]
  },
  {
    text: '故障排查',
    collapsed: false,
    items: [
      { text: '如何排查Bean无法注入', link: '/05-Spring/如何在所有BeanDefinition注册完以后做扩展？' },
      { text: '如何排查声明式事务不生效', link: '/05-Spring/如何在所有BeanDefinition注册完以后做扩展？' },
      { text: '如何排查AOP不生效', link: '/05-Spring/如何在所有BeanDefinition注册完以后做扩展？' },


    ]
  },
  {
    text: '设计模式',
    collapsed: false,
    items: [
      { text: 'Spring都用到哪些设计模式？', link: '/05-Spring/Spring都用到哪些设计模式？' },

    ]
  }
]