# @Transactional 注解失效场景

>   参考：https://juejin.cn/post/7003949263281455112?searchId=202503072108394D5311941DDE7910231C#heading-4

@Transactional 注解虽然用起来简单，但这货总是能在一些你意想不到的情况下失效，防不胜防！

我把这些事务问题归结成了三类：`不必要`、`不生效`、`不回滚`，接下用一些demo演示下各自的场景。

## 不必要

### 1、**无需事务的业务**

在没有事务操作的业务方法上使用 @Transactional 注解，比如：用在仅有查询或者一些 HTTP 请求的方法，虽然加上影响不大，但从编码规范的角度来看还是不够严谨，建议去掉。

```java
// 反例：查询不需要事务
@Transactional
public String testQuery() {
    standardBak2Service.getById(1L);
    return "testB";
}
```

### 2、 **事务范围过大**

为了省事直接将 @Transactional 注解加在了类上或者抽象类上，这样做导致的问题就是**类内的方法或抽象类的实现类中所有方法全部都被事务管理**。增加了不必要的性能开销或复杂性，建议按需使用，只在有事务逻辑的方法上加@Transactional

```java
// 反例
@Transactional
public abstract class BaseService {
}

@Slf4j
@Service
public class TestMergeService extends BaseService{

    private final TestAService testAService;

    public String testMerge() {

        testAService.testA();

        return "ok";
    }
}
```

如果在类中的方法上添加 @Transactional 注解，它将覆盖类级别的事务配置。例如，类级别上配置了只读事务，方法级别上的 @Transactional 注解也会覆盖该配置，从而启用读写事务。

```java
@Transactional(readOnly = true)
public class TestMergeService {

    private final TestBService testBService;

    private final TestAService testAService;

    @Transactional
    public String testMerge() {

        testAService.testA();

        testBService.testB();
        return "ok";
    }
}    
```

## 不生效

### 3、**方法权限问题**

**不要把 @Transactional注解加在 private 级别的方法上！**

我们知道 @Transactional 注解依赖于Spring AOP切面来增强事务行为，这个 AOP 是通过代理来实现的，而 private 方法恰恰不能被代理的，所以 AOP 对 private 方法的增强是无效的，@Transactional也就不会生效

```java
@Transactional
private String testMerge() {

    testAService.testA();

    testBService.testB();

    return "ok";
}
```

那如果我在 testMerge() 方法内调用 private 的方法事务会生效吗？

答案：事务会生效

```java
@Transactional
public String testMerge() throws Exception {

    ccc();
    
    return "ok";
}

private void ccc() {
    testAService.testA();

    testBService.testB();
}
```

### 4、**被用 final 、static 修饰方法**

和上边的原因类似，被用 `final` 、`static` 修饰的方法上加 @Transactional 也不会生效。

-   static 静态方法属于类本身的而非实例，因此代理机制是无法对静态方法进行代理或拦截的
-   final 修饰的方法不能被子类重写，事务相关的逻辑无法插入到 final 方法中，代理机制无法对 final 方法进行拦截或增强。

这些都是java基础概念了，使用时要注意。

```java
// 反例
@Transactional
public static void b() {
}

@Transactional
public final void b() {
}
```

### 5、**同类内部方法调用问题**

**注意了**，这种情况经常发生啊！

同类内部方法间的调用是 @Transactional 注解失效的重灾区，网上你总能看到方法内部调用另一个同类的方法时，**这种调用是不会经过代理的**，因此事务管理不会生效。但这说法比较片面，要分具体情况。

比如：如果 testMerge() 方法未开启事务，并且在同类中调用了非事务方法 a() 和事务方法 b()，当 b() 抛出异常时，a() 和 b() 的事务都不会生效。因为这种调用直接通过 `this` 对象进行，未经过代理，因此事务管理无法生效。这经常出问题的！

```java
public String testMerge() {

    a();

    b();

    return "ok";
}

public void a() {
    standardBakService.save(testAService.buildEntity());
}

@Transactional
public void b() {
    standardBak2Service.save(testBService.buildEntity2());
    throw new RuntimeException("b error");
}
```

#### 5.1、**独立的 Service 类**

要想 b() 方法的事务生效也容易，最简单的方法将它剥离放在独立的Service类注入使用，交给spring管理就行了。不过，这种方式会创建很多类。

```java
@Slf4j
@Service
public class TestBService {

      @Transactional
      public void b() {
          standardBak2Service.save(testBService.buildEntity2());
          throw new RuntimeException("b error");
      }
}
```

#### 5.2、**自注入方式**

或者通过自己注入自己的方式解决，尽管解决了问题，逻辑看起来很奇怪，它破坏了依赖注入的原则，虽然 spring 支持我们这样用，还是要注意下循环依赖的问题。

```java
@Slf4j
@Service
public class TestMergeService {
      @Autowired
      private TestMergeService testMergeService;

      public String testMerge() {

          a();

          testMergeService.b();

          return "ok";
      }

      public void a() {
          standardBakService.save(testAService.buildEntity());
      }

      @Transactional
      public void b() {
          standardBak2Service.save(testBService.buildEntity2());
          throw new RuntimeException("b error");
      }
}
```

#### 5.3、**手动获取代理对象**

b() 方法它不是没被代理嘛，那我们手动获取代理对象调用 b() 方法也可以。通过 `AopContext.currentProxy()` 方法返回当前的代理对象实例，这样调用代理的方法时，就会经过 AOP 的切面，@Transactional注解就会生效了。

```java
@Slf4j
@Service
public class TestMergeService {

      public String testMerge() {

          a();

         ((TestMergeService) AopContext.currentProxy()).b();

          return "ok";
      }

      public void a() {
          standardBakService.save(testAService.buildEntity());
      }

      @Transactional
      public void b() {
          standardBak2Service.save(testBService.buildEntity2());
          throw new RuntimeException("b error");
      }
}
```

### 6、**Bean 未被 spring 管理**

上边我们知道 @Transactional 注解通过 AOP 来管理事务，而 AOP 依赖于代理机制。因此，**Bean 必须由Spring管理实例！** 要确保为类加上如 `@Controller`、`@Service` 或 `@Component`注解，让其被Spring所管理，这很容易忽视。

```java
@Service
public class TestBService {

    @Transactional
    public String testB() {
        standardBak2Service.save(entity2);
        return "testB";
    }
}
```

### 7、**异步线程调用**

如果我们在 testMerge() 方法中使用异步线程执行事务操作，通常也是无法成功回滚的，来个具体的例子。

testMerge() 方法在事务中调用了 testA()，testA() 方法中开启了事务。接着，在 testMerge() 方法中，我们通过一个新线程调用了 testB()，testB() 中也开启了事务，并且在 testB() 中抛出了异常。

此时的回滚情况是怎样的呢？

```java
@Transactional
public String testMerge() {

    testAService.testA();

    new Thread(() -> {
        try {
            testBService.testB();
        } catch (Exception e) {
//                e.printStackTrace();
            throw new RuntimeException();
        }
    }).start();

    return "ok";
}

@Transactional
public String testB() {
    DeepzeroStandardBak2 entity2 = buildEntity2();

    dataImportJob2Service.save(entity2);

    throw new RuntimeException("test2");
}

@Transactional
public String testA() {
    DeepzeroStandardBak entity = buildEntity();
    standardBakService.save(entity);
    return "ok";
}
```

答案是：testA() 和 testB() 中的事务都不会回滚。

testA() 无法回滚是因为没有捕获到新线程中 testB()抛出的异常；testB()方法无法回滚，是因为事务管理器只对当前线程中的事务有效，因此在新线程中执行的事务不会回滚。

由于在多线程环境下，Spring 的事务管理器不会跨线程传播事务，事务的状态（如事务是否已开启）是存储在线程本地的 `ThreadLocal` 来存储和管理事务上下文信息。这意味着每个线程都有一个独立的事务上下文，事务信息在不同线程之间不会共享。

### 8、**不支持事务的引擎**

不支持事务的数据库引擎不在此次 `Review` 范围内，只做了解就好。我们通常使用的关系型数据库，如 MySQL，默认使用支持事务的 `InnoDB` 引擎，而非事务的 `MyISAM` 引擎则使用较少。

以前开启启用 MyISAM 引擎是为了提高查询效率。不过，现在非关系型数据库如 `Redis`、`MongoDB` 和 `Elasticsearch` 等中间件提供了更高性价比的解决方案

## 不回滚

### 9、**用错传播属性**

`@Transactional`注解有个关键的参数`propagation`，它控制着事务的传播行为，有时事务传播参数配置错误也会导致事务的不回滚。

propagation 支持 7 种事务传播特性：

-   `REQUIRED`：**默认的传播行为**，如果当前没有事务，则创建一个新事务；如果存在事务，则加入当前事务。
-   `MANDATORY`：支持当前事务，如果不存在则抛出异常
-   `NEVER`：非事务性执行，如果存在事务，则抛出异常
-   `REQUIRES_NEW`：无论当前是否存在事务，都会创建一个新事务，原有事务被挂起。
-   `NESTED`：嵌套事务，被调用方法在一个嵌套的事务中运行，这个事务依赖于当前的事务。
-   `SUPPORTS`：如果当前存在事务，则加入；如果没有，就以非事务方式执行。
-   `NOT_SUPPORTED`：以非事务方式执行，如果当前存在事务，将其挂起。

---
详情的每一种特性请参考：[事务传播特性:point_left:](./Spring（声明式）事务传播行为？#事务传播特性)

### 10、**自己吞了异常**

在整个 review 的过程中我发现导致事务不回滚的场景，多数是开发同学在业务代码中手动 try...catch 捕获了异常，然后又没抛出异常....

比如：testMerge() 方法开启了事务，并调用了非事务方法 testA() 和 testB()，同时在 testMerge() 中捕获了异常。如果 testB() 中发生了异常并抛出，但 testMerge() 捕获了这个异常而没有继续抛出，Spring 事务将无法捕获到异常，从而无法进行回滚。

```java
@RequiredArgsConstructor
@Slf4j
@Service
public class TestMergeService {

    private final TestBService testBService;

    private final TestAService testAService;
    @Transactional
    public String testMerge() {

        try {
            testAService.testA();

            testBService.testB();

        } catch (Exception e) {
            log.error("testMerge error:{}", e);
        }
        return "ok";
    }
}

@Service
public class TestAService {

    public String testA() {
        standardBakService.save(entity);
        return "ok";
    }
}

@Service
public class TestBService {

    public String testB() {
        standardBakService.save(entity2);
        
        throw new RuntimeException("test2");
    }
}
```

为了确保 Spring 事务能够正常回滚，需要我们在 catch 块中主动重新抛出它能够处理的 RuntimeException 或者 Error 类型的异常。

```java
@Transactional
public String testMerge() {

    try {
        testAService.testA();

        testBService.testB();

    } catch (Exception e) {
        log.error("testMerge error:{}", e);
        throw new RuntimeException(e);
    }
    return "ok";
}
```

**捕获异常并不意味着一定不会回滚**，这取决于具体情况。

例如，当 testB() 方法上也加上了 @Transactional 注解时，如果在该方法中发生异常，事务会捕获到这个异常。由于事务传播的特性，testB() 的事务会合并到上层方法的事务中。因此，即使在 testMerge() 中捕获了异常而未抛出，事务仍然可以成功回滚。

```java
@Transactional
public String testB() {

    DeepzeroStandardBak2 entity2 = buildEntity2();

    dataImportJob2Service.save(entity2);

    throw new RuntimeException("test2");
    // return "ok";
}
```

>   但这有个提前，必须在 testMerge() 方法上添加 @Transactional 注解以启用事务。如果 testMerge() 方法没有开启事务，不论其内部是否使用 try 块，都只能部分回滚 testB()，而 testA() 将无法回滚。

### 11、**事务无法捕获的异常**

Spring 的事务默认会回滚` RuntimeException` 及其子类，以及 `Error` 类型的异常。

如果抛出的是其他类型的异常，例如 `checked exceptions`（检查型异常），即继承自 Exception 但不继承自 RuntimeException 的异常，比如 `SQLException`、`DuplicateKeyException`，事务将不会回滚。

所以，我们在主动抛出异常时，要确保该异常是事务能够捕获的类型。

```java
@Transactional
public String testMerge() throws Exception {
    try {
        testAService.testA();

        testBService.testB();
    } catch (Exception e) {
        log.error("testMerge error:{}", e);
//            throw new RuntimeException(e);
        throw new Exception(e);
    }
    return "ok";
}
```

如果你非要抛出默认情况下不会导致事务回滚的异常，务必要在 `@Transactional` 注解的 `rollbackFor` 参数中明确指定该异常，这样才能进行回滚。

```java
@Transactional(rollbackFor = Exception.class)
public String testMerge() throws Exception {
    try {
        testAService.testA();

        testBService.testB();
    } catch (Exception e) {
        log.error("testMerge error:{}", e);
//            throw new RuntimeException(e);
        throw new Exception(e);
    }
    return "ok";
}
```

问问你身边的同学，哪些异常属于运行时异常，哪些属于检查型异常，十有八九他们可能无法给出准确的回答！

所以减少出现 bug 的风险，我建议使用 @Transactional 注解时，将 rollbackFor 参数设置为 `Exception` 或 `Throwable`，这样可以扩大事务回滚的范围。

### 12、**自定义异常范围问题**

针对不同业务定制异常类型是比较常见的做法，@Transactional 注解的 rollbackFor 参数支持自定义的异常，但我们往往习惯于将这些自定义异常继承自 RuntimeException。

那么这就出现和上边同样的问题，事务的范围不足，许多异常类型仍然无法触发事务回滚。

```java
@Transactional(rollbackFor = CustomException.class)
public String testMerge() throws Exception {
    try {
        testAService.testA();

        testBService.testB();
    } catch (Exception e) {
        log.error("testMerge error:{}", e);
//            throw new RuntimeException(e);
        throw new Exception(e);
    }
    return "ok";
}
```

想要解决这个问题，可以在 catch 中主动抛出我们自定义的异常。

```java
@Transactional(rollbackFor = CustomException.class)
public String testMerge() throws Exception {
    try {
        testAService.testA();

        testBService.testB();
    } catch (Exception e) {
        log.error("testMerge error:{}", e);
        throw new CustomException(e);
    }
    return "ok";
}
```

13、**嵌套事务问题**

还有一种场景就是嵌套事务问题，比如，我们在 testMerge() 方法中调用了事务方法 testA() 和事务方法 testB()，此时不希望 testB() 抛出异常让整个 testMerge() 都跟着回滚；这就需要单独 try catch 处理 testB() 的异常，不让异常在向上抛。

```java
@RequiredArgsConstructor
@Slf4j
@Service
public class TestMergeService {

    private final TestBService testBService;

    private final TestAService testAService;
    @Transactional
    public String testMerge() {
    
        testAService.testA();

        try {
            testBService.testB();
        } catch (Exception e) {
            log.error("testMerge error:{}", e);
        }
        return "ok";
    }
}

@Service
public class TestAService {

    @Transactional
    public String testA() {
        standardBakService.save(entity);
        return "ok";
    }
}

@Service
public class TestBService {

    @Transactional
    public String testB() {
        standardBakService.save(entity2);
        
        throw new RuntimeException("test2");
    }
}
```


