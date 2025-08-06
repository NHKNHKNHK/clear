# Cglib的Enhancer类实现动态代理？

>   CGLIB是一种强大的代码生成库，能够在运行时生成代理类。
>
>   与 JDK 动态代理不同的是，CGLIB 不需要接口，可以直接代理具体类。CGLIB 通过创建目标类的子类并覆盖其中的方法来实现代理。
>
>   基于 CGLIB 的动态代理需要使用 `net.sf.cglib.proxy.Enhancer` 类和 `net.sf.cglib.proxy.MethodInterceptor` 接口

## **口语化**

cglib 代理相比 jdk 动态代理不同的就是不需要被代理的类实现接口。

假设我们现在有一个MyService，其中有一个方法是performTask，我们只需要定义一个新的类，实现MethodInterceptor 接口，然后再里面的 intercept 方法实现需要增强的方法。最终通过 cglib 的Enhancer类，先设置父类，父类就是我们要增强的类，再设置 callback 也就是我们要增强的功能。最后使用 create 就生成了 cglib 的一个代理类



## **实现步骤**

-   1、**引入CGLIB依赖**：确保在项目中添加 CGLIB 依赖。

-   2、**创建目标类**：定义需要代理的具体类。

-   **3、创建方法拦截器**：实现MethodInterceptor接口，并在intercept方法中定义代理逻辑。

-   **4、创建代理对象**：通过Enhancer类创建代理对象



示例

假设我们有一个简单的服务类MyService，通过 CGLIB 动态代理为MyService创建一个代理对象，并在方法调用前后添加日志。

1）引入CGLIB依赖

```xml
<dependency>
    <groupId>cglib</groupId>
    <artifactId>cglib</artifactId>
    <version>3.3.0</version>
</dependency>
```

2）创建目标类

创建一个被代理类，定义需要被代理的方法

```java
public class MyService {
    public void performTask() {
        System.out.println("Performing task");
    }
}
```

3）创建方法拦截器

创建一个方法拦截器类，实现 `MethodInterceptor` 接口

```java
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

public class LoggingMethodInterceptor implements MethodInterceptor {
    @Override
    public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) throws Throwable {
        System.out.println("Logging before method execution: " + method.getName());
        
        Object result = proxy.invokeSuper(obj, args);
        
        System.out.println("Logging after method execution: " + method.getName());
        return result;
    }
}
```

在这个代理类中，我们实现了 `MethodInterceptor` 接口。在 `intercept` 方法中，我们可以对被代理对象的方法进行增强，并在方法调用前后输出日志

4）创建代理对象并使用

在使用代理类时，创建被代理类的对象和代理类的对象，并使用 `Enhancer.create` 方法生成代理对象

```java
import net.sf.cglib.proxy.Enhancer;

public class MainApp {
    public static void main(String[] args) {
        // 创建 Enhancer 对象
        Enhancer enhancer = new Enhancer();
        
        // 设置目标类为代理类的父类
        enhancer.setSuperclass(MyService.class);
        
        // 设置方法拦截器
        enhancer.setCallback(new LoggingMethodInterceptor());

        // 创建代理对象
        MyService proxyInstance = (MyService) enhancer.create();
        
        // 调用代理对象的方法
        proxyInstance.performTask();
    }
}
```

## **总结**

​	在实际应用中，基于 CGLIB 的动态代理可以代理任意类，但是**生成的代理类比较重量级**。**如果被代理类是一个接口，建议使用基于 JDK 的动态代理来实现**，这也是spring的做法；如果被代理类没有实现接口或者需要代理的方法是 final 方法，建议使用基于 CGLIB 的动态代理来实现

