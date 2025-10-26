---
permalink: /spring/aop
---

# 什么是AOP？

:::tip 核心

AOP是面向切面编程，是对面向对象编程的补充，不是替代

AOP底层依靠代理机制织入逻辑，不同框架的织入时机不太一样

Spring AOP是运行时动态代理（JDK或CGLIB），AspectJ是编译器静态织入
:::

## 口语化

AOP是Spring框架的核心，即**面向切面编程**，它是在不改变业务逻辑代码的前提下，把一些**通用逻辑抽取**出来统一处理或操作的一种思想。比如
日志记录、事务管理、接口限流、安全校验等，这些都与业务没太大关系，但是又得需要，如果需要的地方都去书写一遍，这样子很呆瓜。

AOP的核心思想是使用代理，在方法执行之前，执行之后，或者异常的时候，自动插入一些逻辑（代码）。

例如：我们有一个Controller中有很多个接口，需要记录它的入参、出参日志，就可以使用AOP，不需要每个接口都手写一遍日志打印。Spring
 AOP会在方法的外部包裹一层代理，实际上访问接口时走的是代理方法，如下是一个伪代码：

```java
class UserController {
    User addUser(User user){
        // ...
    } 
}

// 经过AOP代理过后
UserController代理对象 {
    log() {
        println 入参
        User addUser(User user){
            // ...
        } 
        println 出参
    }
}
```
:::warning 注意
此处代码语法必然不正确，关心逻辑即可
:::

AOP有五大核心概念，切面、通知、连接点、切入点、织入。

1. 切面是功能模块，封装想要抽取的功能逻辑。比如日志切面
2. 通知是执行时机，比如Before方法执行之前执行、After方法执行之后执行
3. 连接点是程序里所有能够“插刀”的地方，比如方法执行、异常抛出
4. 切入点是我们选中要“插刀”的地方，比如拦截service包下所有的方法
5. 织入就是把这段逻辑插入的过程。

最后强调，Spring AOP用的是动态代理，底层使用JDK或CGLIB，在运行时织入逻辑。

还有一个AspectJ是静态织入，是在编译器或类加载期织入。

## 什么是AOP

AOP（面向切面编程，Aspect-Oriented Programming）是一种编程范式，它旨在通过分离**横切关注点**（如日志记录、事务管理、安全性等）
来提高代码的**模块化**。 AOP在传统的面向对象编程（OOP）基础上，提供了一种处理系统级关注点的机制，而这些关注点通常会散布在多个模块中。

AOP允许我们在不修改现有代码的情况下，将特定的行为（切面）动态地应用到程序中的多个方法或类上

## AOP的核心概念

-   **Aspect（切面）**：切面是横切关注点的**模块化**，它定义了我们希望插入到程序中的额外行为。 
一个切面通常可以包含多个 advice（通知）和 pointcut（切入点）。
-   **Pointcut（切入点）**：切入点定义了通知应该应用到哪些连接点上。

>   切入点是一个表达式，定义了哪些连接点会被切面所影响。切入点表达式用于匹配连接点，从而决定切面应该应用到哪些方法上。常见的切入点表达式语言包括 AspectJ 的表达式语言。

-   **Advice（通知）**：通知是切面在特定的切入点执行的动作。通知有几种类型：
    -   **前置通知（Before Advice）**：方法执行之前执行。
    -   **后置通知（After Advice）**：方法执行之后执行。
    -   **环绕通知（Around Advice）**：在方法执行前后都可以执行，且可以决定是否执行目标方法。
    -   **异常通知（Throws Advice）**：方法抛出异常时执行。
    -   **返回通知（After Returning Advice）**：方法正常返回后执行。

-   **Join Point（连接点）**：程序执行的特定点，例如方法调用或异常抛出。

-   **Weaving（织入）**：织入是将切面应用到目标对象创建代理对象的过程。织入可以在编译时、类加载时、运行时进行。

>   织入是将切面应用到目标对象并创建 AOP 代理对象的过程。织入可以在以下几个时机进行：
>
>   -   **编译时（Compile-time Weaving）**：在编译阶段将切面织入到目标类中。
>   -   **类加载时（Load-time Weaving）**：在类加载阶段使用类加载器将切面织入到目标类中。
>   -   **运行时（Runtime Weaving）**：在运行时通过动态代理将切面织入到目标对象中。



## AOP的作用

AOP的主要作用是将横切关注点从核心业务逻辑中分离出来，减少代码重复和提高代码的可维护性。具体作用包括：

1.  **解耦业务逻辑和横切关注点**：例如，日志记录、安全验证、事务处理等不属于业务逻辑的内容，通过AOP可以将其从业务代码中提取出来，减少耦合。
2.  **提高代码复用性**：横切关注点（如日志、事务管理等）往往需要在多个地方使用，通过AOP实现增强，可以避免在每个方法中重复编写相同的代码。
3.  **增强功能灵活性**：AOP允许你在运行时动态地为方法添加横切逻辑，而不需要修改业务逻辑代码。
4.  **简化代码维护**：将横切关注点统一管理，可以避免代码重复和分散的修改，降低了维护成本。

## AOP的优势

1.  **提高模块化**：AOP使得横切关注点可以单独定义和处理，避免了业务逻辑和附加功能（如日志、安全、事务等）之间的紧密耦合，提升了系统的模块化。
2.  **减少代码重复**：通过将横切关注点（直白点：通用功能）提取到切面中，可以避免在多个类中重复编写相同的代码（如日志、权限验证、事务等）。
3.  **灵活的功能增强**：AOP可以通过**动态代理**的方式在运行时对现有代码进行功能增强，而**无需修改原有代码**。这使得在不改变现有代码的情况下，方便地增加新的功能。
4.  **提高代码可维护性**：由于横切关注点被提取到单独的切面中，修改、扩展这些功能时不需要修改业务逻辑代码，从而提高了代码的可维护性。
5.  **增强代码的可测试性**：通过将横切关注点和核心业务逻辑分离，单独的切面可以更容易进行单元测试，减少了对核心业务逻辑的干扰。
6.  **运行时控制**：AOP的织入是动态的，能够在运行时根据需求决定是否执行某个切面，提供了极大的灵活性。

## AOP应用场景

-   **日志记录**：自动记录方法执行情况，如输入参数、返回结果等。
-   **事务管理**：在方法执行之前或之后自动管理事务。在方法抛出异常时回滚事务
-   **安全控制**：控制方法调用权限，确保用户具有相应权限。
-   **性能监控**：监控方法执行时间，进行性能分析。
-   **缓存**：自动缓存方法返回值，提高应用性能。

## 示例：日志AOP

```java
@Aspect
@Component
@Slf4j
@ConditionalOnProperty(name = {"log.aspect.enable"}, havingValue = "true", matchIfMissing = false)
public class LogAspect {

    // execution([修饰符] 返回类型 [类全路径].方法名(参数列表) [异常模式])
    @Pointcut("execution(* com.clear.*.controller.*Controller.*(..)) || " + "execution(* com.clear.*.service.*Service.*(..))")
    public void pointCut() {
    }

    /**
     * 环绕通知使用注意事项
     * <pre>
     *      环绕通知依赖形参ProceedingJoinPoint才能实现对原始方法的调用
     *      环绕通知可以隔离原始方法的调用执行
     *      环绕通知返回值设置为Object类型（如果设置为void，原始方法的返回值会被吞掉，方法返回值为null）
     *      环绕通知中可以对原始方法调用过程中出现的异常进行处理
     * </pre>
     *
     * @param joinPoint
     * @throws Throwable
     */
    @Around(value = "pointCut()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        Object[] args = joinPoint.getArgs();
        String req = new Gson().toJson(args);
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        String methodName = methodSignature.getDeclaringType().getName() + "." + methodSignature.getName();
        log.info("{},req:{}", methodName, req);
        Long startTime = System.currentTimeMillis();
        Object responseObj = joinPoint.proceed(); // 注意！！！这里的异常千万不能捕获，如果捕获了就是将业务方法的异常给捕获了，因此抛出
        String resp = new Gson().toJson(responseObj);
        Long endTime = System.currentTimeMillis();
        log.info("{},response:{},costTime:{}", methodName, resp, endTime - startTime);
        return responseObj;
    }
}
```


todo ✅介绍一下Spring的AOP