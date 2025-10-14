const basePath = '/06-SpringMVC/'

export default [

  {
    text: '基础',
    collapsed: true,
    items: [
      { text: '导航', link: '/06-SpringMVC/index' },
      { text: 'Spring MVC 与 Spring Boot 有什么区别？', link: '/06-SpringMVC/Spring MVC 与 Spring Boot 有什么区别？' },
      { text: '说说你对SpringMVC的理解？', link: '/06-SpringMVC/说说你对SpringMVC的理解？' },

      { text: 'SpringMVC父子容器是什么？', link: '/06-SpringMVC/SpringMVC父子容器是什么？' },
      { text: 'SpringMVC中的Controller是什么？如何定义应该Controller？', link: '/06-SpringMVC/SpringMVC中的Controller是什么？如何定义应该Controller？' },
      { text: '简述请求是如何找到对应Controller的？', link: '/06-SpringMVC/简述请求是如何找到对应Controller的？' },


    ]

  },
  {
    text: '核心',
    collapsed: true,
    items: [
      { text: '导航', link: '/06-SpringMVC/index' },
      // dispatcherservlet 
      // handlermapping
      // handleradapter
      // viewresolver
      // modelandview
      { text: '简述SpringMVC核心组件？', link: '/06-SpringMVC/简述SpringMVC核心组件？' },

      { text: '什么是DispatcherServlet？', link: '/06-SpringMVC/什么是DispatcherServlet？' },
      { text: '如何在 Spring MVC 中配置DispatcherServlet？', link: '/06-SpringMVC/如何在 Spring MVC 中配置DispatcherServlet？' },
      { text: '什么是 Handler Mapping？', link: '/06-SpringMVC/什么是 Handler Mapping？' },
      { text: '什么是 Handler Adapter？', link: '/06-SpringMVC/什么是 Handler Adapter？' },
      { text: '什么是 View Resolver？', link: '/06-SpringMVC/什么是 View Resolver？' },
      { text: 'SpringMVC中的视图解析器有什么用？', link: '/06-SpringMVC/SpringMVC中的视图解析器有什么用？' },
      { text: '什么是 ModelAndView？', link: '/06-SpringMVC/什么是 ModelAndView？' },
    ]
  },
  {
    text: '注解',
    collapsed: true,
    items: [
      { text: '导航', link: '/06-SpringMVC/index' },
      // @Controller
      // @RequestMapping
      // @RestController
      // @RequestParam
      // @PathVariable
      // @RequestBody
      // @ModelAttribute
      // @EnableWebMvc
      // @ExceptionHandler
      // @RequestHeader
      // @CookieValue
      { text: '@Controller', link: '/06-SpringMVC/@Controller' },
      { text: '@RequestMapping', link: '/06-SpringMVC/@RequestMapping' },
      { text: '@RestController', link: '/06-SpringMVC/@RestController' },
      { text: '@RequestParam', link: '/06-SpringMVC/@RequestParam' },
      { text: '@PathVariable', link: '/06-SpringMVC/@PathVariable' },
      { text: '@RequestBody', link: '/06-SpringMVC/@RequestBody' },
      { text: '@RequestBody、@RequestParam、@PathVariable的区别', link: '/06-SpringMVC/@RequestBody、@RequestParam、@PathVariable的区别' },
      { text: '@RequestBody和@ResponseBody注解的作用？', link: '/06-SpringMVC/@RequestBody和@ResponseBody注解的作用？' },
      { text: '@ModelAttribute', link: '/06-SpringMVC/@ModelAttribute' },
      { text: '@RequestParam 与 @ModelAttribute 的区别？', link: '/06-SpringMVC/@RequestParam 与 @ModelAttribute 的区别？' },
      { text: '@EnableWebMvc', link: '/06-SpringMVC/@EnableWebMvc' },

      { text: '@ExceptionHandler', link: '/06-SpringMVC/@ExceptionHandler' },

      { text: '@RequestHeader和@CookieValue注解的作用？', link: '/06-SpringMVC/@RequestHeader和@CookieValue注解的作用？' },
    ]
  },
  {
    text: '实践',
    collapsed: true,
    items: [
      { text: '导航', link: '/06-SpringMVC/index' },
      // 国际化
      // 统一异常处理怎么做
      // 如何配置拦截器
      // 跨域
      { text: '如何处理 Spring MVC 中的表单数据？', link: '/06-SpringMVC/如何处理 Spring MVC 中的表单数据？' },
      { text: '如何在 Spring MVC 中进行表单验证？', link: '/06-SpringMVC/如何在 Spring MVC 中进行表单验证？' },

      { text: '如何处理 Spring MVC 中的文件上传？', link: '/06-SpringMVC/如何处理 Spring MVC 中的文件上传？' },

      { text: 'SpringMVC中的拦截器是什么？', link: '/06-SpringMVC/SpringMVC中的拦截器是什么？' },
      { text: '如何在 Spring MVC 中配置拦截器？|如何定义一个拦截器？', link: '/06-SpringMVC/如何定义一个拦截器？' },
      { text: '拦截器和过滤器的区别？', link: '/06-SpringMVC/拦截器和过滤器的区别？' },
      { text: 'SpringMVC中如何处理异常（异常处理机制）？', link: '/06-SpringMVC/SpringMVC中如何处理异常？' },

      { text: 'SpringMVC中的国际化（i18n）支持是如何实现的？', link: '/06-SpringMVC/SpringMVC中的国际化（i18n）支持是如何实现的？' },
      { text: '什么是Restful风格？', link: '/06-SpringMVC/什么是Restful风格？' },
      { text: '什么是Spring MVC的REST支持？', link: '/06-SpringMVC/什么是Spring MVC的REST支持？' },
      { text: '如何在SpringMVC中处理JSON数据？', link: '/06-SpringMVC/如何在SpringMVC中处理JSON数据？' },
      { text: '如何在 Spring MVC 中实现跨域资源共享（CORS）', link: '/06-SpringMVC/如何在 Spring MVC 中实现跨域资源共享（CORS）' },
      { text: '如何在 Spring MVC 中使用模板引擎（如 Thymeleaf）？', link: '/06-SpringMVC/如何在 Spring MVC 中使用模板引擎（如 Thymeleaf）？' },
      { text: '如何在 Spring MVC 中配置静态资源？', link: '/06-SpringMVC/如何在 Spring MVC 中配置静态资源？' },
    ]
  },
  {
    text: '原理',
    collapsed: true,
    items: [
      { text: '导航', link: '/06-SpringMVC/index' },
      // mvc原理、执行流程
      // 拦截器原理
      // 生命周期

      { text: 'SpringMVC具体的工作原理和执行流程？', link: '/06-SpringMVC/SpringMVC具体的工作原理和执行流程？' },
      { text: '解释 Spring MVC 的工作原理？', link: '/06-SpringMVC/解释 Spring MVC 的工作原理？' },
      { text: 'Spring MVC 的生命周期？', link: '/06-SpringMVC/Spring MVC 的生命周期？' },

    ]
  },


]