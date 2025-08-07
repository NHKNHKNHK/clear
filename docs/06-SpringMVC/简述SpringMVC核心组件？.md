# 简述SpringMVC核心组件？

## **组件**

Spring MVC是一个基于Java的实现了MVC设计模式的**请求驱动**类型的轻量级Web框架，它大量使用了Spring框架中提供的设计模式。Spring MVC框架的核心组件包括：

1.  DispatcherServlet：前端控制器，负责接收请求并根据映射关系调用相应的控制器。
2.  HandlerMapping：负责根据请求的URL到HandlerMapping中找到映射的处理器（Controller）。
3.  HandlerAdapter：负责根据处理器，生成处理器适配器，通过适配器调用实际的处理器。
4.  Controller：处理器，执行相应的业务逻辑操作，并返回ModelAndView对象。
5.  ModelAndView：包含了视图逻辑名和模型数据的对象，是连接控制器和视图的桥梁。
6.  ViewResolver：负责解析视图名到具体视图实现类的映射，根据视图名称找到对应的视图实现类。
7.  View：视图，负责渲染数据并展示给用户。