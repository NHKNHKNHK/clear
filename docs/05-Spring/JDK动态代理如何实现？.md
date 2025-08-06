# JDK动态代理如何实现？

:::tip
JDK 动态代理主要依赖于java.lang.reflect.Proxy类和java.lang.reflect.InvocationHandler接口来实现。
:::

## **口语化**

jdk 的动态代理主要是依赖Proxy 和InvocationHandler 接口。jdk 动态代理要求类必须有接口。在进行实现的时候，首先要定义接口，比如MyService，这个接口就是我们的正常功能的实现。但是希望在不更改MyService 的情况下增加，那么我们需要定义一个实现InvocationHandler 接口的实现类，同时在方法实现上面增加额外的逻辑。最后通过 Proxy 的 newProxyInstance 将二者结合到一起。就实现了动态代理。



## **实现步骤**

-   1）**定义接口**：定义需要代理的接口。

-   2）**实现接口**：创建接口的实现类。

-   3）**创建调用处理器**：实现InvocationHandler接口，并在invoke方法中定义代理逻辑。

-   4）**创建代理对象**：通过Proxy.newProxyInstance方法创建代理对象。



示例

假设我们有一个简单的服务接口MyService和它的实现类MyServiceImpl，我们将通过 JDK 动态代理为MyService创建一个代理对象，并在方法调用前后添加日志。

1）定义接口

```java
public interface MyService {
    void performTask();
}
```

2）实现接口

创建一个被代理类，实现这个接口，并在其中定义实现方法

```java
public class MyServiceImpl implements MyService {
    @Override
    public void performTask() {
        System.out.println("Performing task");
    }
}
```

3）创建调用处理器

创建一个代理类，实现 `InvocationHandler` 接口，并在其中定义一个被代理类的对象作为属性

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

public class LoggingInvocationHandler implements InvocationHandler {
    
    private final Object target; // 组合被代理类

    public LoggingInvocationHandler(Object target) {
        this.target = target;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("Logging before method execution: " + method.getName());
        
        Object result = method.invoke(target, args);
        
        System.out.println("Logging after method execution: " + method.getName());
        return result;
    }
}
```

在代理类中，我们实现了 `InvocationHandler` 接口，并在其中定义了一个被代理类的对象作为属性（组合的方式）。在 `invoke` 方法中，我们可以对被代理对象的方法进行增强，并在方法调用前后输出日志。

4）创建代理对象并使用

在使用代理类时，创建被代理类的对象（目标对象）和代理类的对象，并使用 `Proxy.newProxyInstance` 方法生成代理对象

```java
import java.lang.reflect.Proxy;

public class MainApp {
    public static void main(String[] args) {
        // 创建目标对象
        MyService myService = new MyServiceImpl();

        // 创建调用处理器（代理类）
        LoggingInvocationHandler handler = new LoggingInvocationHandler(myService);

        /**
         * 参数一：loader 被代理类的类加载器
         * 参数二：代理类需要实现的接口数组
         * 参数三： invocationHandler
         */
        // 创建代理对象
        MyService proxyInstance = (MyService) Proxy.newProxyInstance(
                myService.getClass().getClassLoader(),
                myService.getClass().getInterfaces(),
                handler
        );

        // 调用代理对象的方法
        proxyInstance.performTask();
    }
}
```

