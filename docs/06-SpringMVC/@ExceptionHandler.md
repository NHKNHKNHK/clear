# @ExceptionHandler 注解

## 什么是 @ExceptionHandler 注解

`@ExceptionHandler` 注解用于处理控制器方法抛出的异常。当控制器方法抛出一个指定异常时，Spring MVC 将自动调用 `@ExceptionHandler` 注解的方法来处理该异常。

## 如何使用 @ExceptionHandler 注解

在 Spring MVC 中，`@ExceptionHandler` 注解用于定义全局异常处理器。它允许你在一个地方集中处理应用程序中的异常，而不是在每个控制器方法中都编写重复的代码。

### **创建全局异常处理器**

1.创建一个类并使用 `@ControllerAdvice` 注解，这使得该类可以处理所有控制器中抛出的异常。
2.在该类的方法上使用 `@ExceptionHandler` 注解，指定要捕获的异常类型。

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    // 捕获特定类型的异常
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse("NOT_FOUND", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // 捕获所有未处理的异常
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex) {
        ErrorResponse error = new ErrorResponse("INTERNAL_SERVER_ERROR", "An unexpected error occurred");
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

```

### **局部异常处理**

如果只想为某个特定的控制器处理异常，则不需要使用 `@ControllerAdvice`，而是在该控制器内部定义带有 `@ExceptionHandler` 的方法。

```java
@Controller
public class MyController {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ModelAndView handleResourceNotFoundException(ResourceNotFoundException ex) {
        ModelAndView modelAndView = new ModelAndView("errorPage");
        modelAndView.addObject("errorMessage", ex.getMessage());
        return modelAndView;
    }
}
```

- 返回自定义错误响应

可以根据需求返回不同的视图或 REST API 响应。上述示例展示了如何返回一个 `ResponseEntity` 对象，其中包含状态码和自定义的错误信息。

