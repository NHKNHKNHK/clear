# SpringMVC父子容器是什么？

父容器指的是Spring的根容器，通常指的是Spring应用上下文（`ApplicationContext`），如`ContextLoaderListener`加载的根容器。它的主要作用的是管理应用的全局Bean，如服务层、数据访问层、工具类等等。

子容器指的是SpringMVC的Web容器，通常指的是`DispatcherServlet`，每个`DispatcherServlet`实例都会创建一个子容器，用于管理Web层（如控制层、拦截器）中的Bean
它负责处理Web请求，并调用父容器中的Bean。


## 历史原因

早期Spring、SpringMVC由两个团队分别开发，Spring团队负责核心功能，SpringMVC团队负责MVC功能。