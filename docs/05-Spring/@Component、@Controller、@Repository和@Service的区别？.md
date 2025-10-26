---
permalink: /spring/component-controller-repository-service
---

# @Component、@Controller、@Repository和@Service的区别？

## 口语化

本质上都是`@Component`，`@Controller`、`@Repository`和`@Service`都是`@Component`注解的语义化封装（特化形式）。

语义化的核心是为了更好的分层管理，提高代码的可读性和可维护性。

所有它们**本质上是没什么区别**的，但是又有一点点区别。

- `@Component`注解标记的类为通用组件，可以用于任何Spring管理的组件，常用于标记工具类、公共Bean等

- `@Controller`注解专门标记控制层（Web层），处理Http请求，返回Web页面或Json等。他也是MVC中的C

- `@Service`注解专门标记业务逻辑层（Service层），业务处理的逻辑都封装在该类标记的方法中。

- `@Repository`注解专门标记数据访问层（Dao层），负责与数据库交互的逻辑都封装在该类标记的方法中。


它们的一小点区别。因为Spring对不同的注解有**特殊处理**。

区别1：如果控制层只标记了`@Component`注解，而没有加`@Controller`或`RequestMapping`注解，那么测试接口请求比如404，
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

## 扩展

### @Component和@Service能不能互换

能

`@Service`注解通常用于标注业务层组件，而`@Component`注解则可以用于标注任何Spring管理的组件。

虽然本质上`@Service`也是`@Component`的特化形式，但`@Service`这个注解表示该类属于服务层，这样子做更好的分层管理，提高代码的可读性和可维护性。

## @Controller和@Component能不能互换
<a id="custom-anchor"></a>

不能

参考区别1，如果控制层使用`@Component`注解又不加`@Controller`或`RequestMapping`注解，那么Spring不会把它识别为能接收请求的handler
