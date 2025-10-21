---
permalink: /25/10/21/spring/component-controller-repository-service
---

# @Component、@Controller、@Repository和@Service的区别？

## 口语化

本质上都是`@Component`，`@Controller`、`@Repository`和`@Service`都是`@Component`注解的语义化封装。

语义化的核心是为了更好的分层管理，提高代码的可读性和可维护性。

所有它们**本质上是没什么区别**的，但是又有一点点区别。

- `@Component`注解标记的类为通用组件，写工具类、公共Bean等

- `@Controller`注解专门标记控制层（Web层），处理Http请求，返回Web页面或Json等。他也是MVC中的C

- `@Service`注解专门标记业务逻辑层（Service层），业务处理的逻辑都封装在该类标记的方法中。

- `@Repository`注解专门标记数据访问层（Dao层），负责与数据库交互的逻辑都封装在该类标记的方法中。


它们的一小点区别。因为Spring对不同的注解有**特殊处理**。

区别1：控制层只标记了`@Component`注解，而没有加`@Controller`或`RequestMapping`注解，那么测试接口请求比如404，
因为仅用`@Component`注解标记Spring不会把它识别为能接收请求的handler，源码如下：

```java
@Override
protected boolean isHandler(Class<?> beanType) {
	return (AnnotatedElementUtils.hasAnnotation(beanType, Controller.class) ||
			AnnotatedElementUtils.hasAnnotation(beanType, RequestMapping.class));
}
```

区别2：`@Repository`注解能够自动把底层数据库异常转换为Spring的`DataAccessException`，我们在业务层书写代码时
就不用书写大量的`try-catch`了