## 什么是Restful风格？



## 说说你对SpringMVC的理解？



## 简述SpringMVC核心组件？



## SpringMVC具体的工作原理和执行流程？

Spring MVC是一个基于Java的实现了MVC设计模式的请求驱动类型的轻量级Web框架，它大量使用了Spring框架中提供的设计模式。Spring MVC框架的核心组件包括：

1.  DispatcherServlet：前端控制器，负责接收请求并根据映射关系调用相应的控制器。
2.  HandlerMapping：负责根据请求的URL到HandlerMapping中找到映射的处理器（Controller）。
3.  HandlerAdapter：负责根据处理器，生成处理器适配器，通过适配器调用实际的处理器。
4.  Controller：处理器，执行相应的业务逻辑操作，并返回ModelAndView对象。
5.  ModelAndView：包含了视图逻辑名和模型数据的对象，是连接控制器和视图的桥梁。
6.  ViewResolver：负责解析视图名到具体视图实现类的映射，根据视图名称找到对应的视图实现类。
7.  View：视图，负责渲染数据并展示给用户。



Spring MVC 的**执行流程**大致可以分为以下几个步骤：

-   1、发送请求到DispatcherServlet：用户向服务器发送请求，请求被DispatcherServlet捕获。

-   2、查找Handler：DispatcherServlet根据请求URL到**HandlerMapping中查找映射的处理器**（Controller）
    -   HandlerMapping找到具体的处理器（可以根据xml配置、注解进行查找），生成处理器及处理器拦截器（如果有则生成）一并返回给DispatcherServlet

-   3、调用HandlerAdapter：DispatcherServlet根据处理器，到HandlerAdapter中找到对应的处理器适配器。

-   4、执行Controller：处理器适配器（HandlerAdapter）调用实际的处理器（Controller）执行业务逻辑操作，并返回ModelAndView对象。

-   5、处理ModelAndView：DispatcherServlet根据ModelAndView中的视图名称，到ViewResolver中找到对应的视图实现类。

-   6、渲染视图：视图实现类根据ModelAndView中的数据和视图模板渲染视图。

-   7、返回响应到客户端：DispatcherServlet将渲染后的视图返回给客户端。



## SpringMVC父子容器是什么？





## SpringMVC中的Controller是什么？如何定义应该Controller?



## 简述请求是如何找到对应Controller的？





## SpringMVC中如何处理表单提交？





## SpringMVC中的视图解析器有什么用？





## SpringMVC中的国际化支持是如何实现的？





## SpringMVC中如何处理异常？





## SpringMVC中的拦截器是什么？如何定义一个拦截器？



## 拦截器和过滤器的区别？



## @RequestBody和@ResponseBody注解的作用？



## @PathVariable注解的作用？



## @ModelAttribute注解的作用？



## @RequestHeader和@CookieValue注解的作用？



## @SessionAttribute注解的作用？



## Spring WebFlux是什么？它与Spring MVC有何不同？