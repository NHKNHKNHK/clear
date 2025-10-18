---
permalink: /25/10/18/springmvc/springmvc-think
---

# 说说你对SpringMVC的理解？

## 口语化

SpringMVC是Spring对传统MVC模式的实现与扩展

传统MVC分为Model、View、Controller

在SpringMVC中将MVC三层模型进行了进一部分的细化和分工。业务逻辑放在service层，数据访问放在repository层，Web层由Controller层控制。

但这种分层不属于MVC模式的标准定义，但在Spring体系中他已经成为了事实上的架构约定。


SpringMVC专注于web层的实现，它采用了**前端控制器模式**，由一个核心角色`DispatcherServlet`统一接收所有请求，根据请求映射规则分发给具体的后端控制器Controller去处理业务请求。控制器执行完逻辑后会返回一个`ModelAndView`对象，再交给`ViewResolve`去解析视图，比如解析成Jsp、Thymeleaf等页面，最终渲染成HTML返回给浏览器。

这一整套机制，让我们彻底摆脱了过去在Serlvet时代，手动编写多个Servlet，配置URL映射，维护请求参数的繁琐过程。

说白了，SpringMVC是对Servet API的高级封装，它的底层仍然运行在Servlet容器之上，但通过`DispatcherServlet`把请求分发、参数绑定、异常处理、视图渲染等一系列流程全部标准化自动化。


一句话总结，`DispatcherServlet`是灵魂，它统一调度请求、业务与视图，打通Web开发的全链路


:::warning 注意
现代开发中，主流项目往往是前后端分离，Controller不一定返回页面。如果标注了`@ResponseBody`或`@RestController`注解，SpringMVC就会通过`HttpMessageConverter`把对象转换成Json、Xml等格式返回给前端。
:::
 


