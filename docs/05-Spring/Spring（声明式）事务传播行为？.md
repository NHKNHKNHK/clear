# Spring（声明式）事务传播行为？

>   Spring的事务信息是存储在ThreadLocal中的，所以**一个线程永远只能有一个事务**
>
>   -   融入：当事务行为是融入外部事务则拿到ThreadLocal中的Connection、共享一个数据库连接，共同提交、回滚
>   -   创建新事物：当传播行为是创建新事务，会将嵌套新事物存入ThreadLocal、再将外部事务暂存起来；当嵌套事务提交、回滚后，会将暂存的事务信息恢复到ThreadLocal中

## **口语化**

spring的事物传播行为本质上，事物是由数据库进行管理的，而spring通过事物管理器间接控制事物的开启、提交以及回滚，本质上还是对JDBC的二次封装。

在单一的事务当中，整个处理过程相对来说比较简单，首先开启事务，执行完成进行提交，遇到异常进行回滚。

但如果你在spring当中使用了声明式事务，所有的调用过程都是由spring通过AOP生成代理替我们完成，很多初学者可能对此没有什么强烈的感觉。

在日常开发中，我们可能会遇到一些特殊情况，比如说方法A和方法B都被声明的事物，但是在A方法当中调用了方法B，此时B方法的事物就被传播到了A方法的事物当中，产生了**传播行为**，这个很好理解。

在spring当中，我们的声明式事物通常是在service层。

但是一般情况下，我们不建议service层之间的方法互相调用，但是特殊情况一定需要特殊的处理方案，Spring作为一个通用框架，各种各样的特殊情况，它一定需要全盘的去考量。

当B方法的事物传播到A方法的事物当中的时候，我们需要对B方法做一些特殊处理，从而满足相应的业务需求，达到相应的目的。

Spring给事物的传播行为提供了7个可选项

`@Transactional`注解有个关键的参数`propagation`，它控制着事务的**传播行为**，有时事务传播参数配置错误也会导致事务的不回滚。

propagation 支持 7 种事务传播特性：

-   `REQUIRED`：**默认的传播行为**，如果当前没有事务，则创建一个新事务；如果存在事务，则加入当前事务。
-   `REQUIRES_NEW`：无论当前是否存在事务，都会创建一个新事务，原有事务被挂起。
-   `MANDATORY`：支持当前事务，如果不存在则抛出异常
-   `NEVER`：非事务性执行，如果存在事务，则抛出异常
-   `NESTED`：嵌套事务，被调用方法在一个嵌套的事务中运行，这个事务依赖于当前的事务。
-   `SUPPORTS`：如果当前存在事务，则加入；如果没有，就以非事务方式执行。
-   `NOT_SUPPORTED`：以非事务方式执行，如果当前存在事务，将其挂起。


## 事务传播特性

::: info
为了加深印象，我用案例来模拟下每种特性的使用场景。
:::

### **REQUIRED（需要）**

:::tip
有事务，就加入，没有就自己开一个
:::

REQUIRED 是**默认**的事务传播行为。

如果 testMerge() 方法开启了事务，那么其内部调用的 testA() 和 testB() 方法也将加入这个事务。

如果 testMerge() 没有开启事务，而 testA() 和 testB() 方法上使用了 @Transactional 注解，这些方法将各自创建新的事务，只控制自身的回滚。

```java
@Component
@RequiredArgsConstructor
@Slf4j
@Service
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

@Transactional
public String testA() {
    log.info("testA");
    DeepzeroStandardBak entity = buildEntity();
    standardBakService.save(entity);
    return "ok";
}

@Transactional
public String testB() {
    log.info("testB");
    DeepzeroStandardBak2 entity2 = buildEntity2();
    standardBak2Service.save(entity2);
    throw new RuntimeException("testB");
}
```

### **MANDATORY**

MANDATORY 传播特性简单来说就是只能被开启事务的上层方法调用，调用者不支持事务则抛出异常，支持则加入当前事务

例如 testMerge() 方法未开启事务调用 testB() 方法，那么将抛出异常；

testMerge() 开启事务调用 testB() 方法，则加入当前事务。

```java
@Component
@RequiredArgsConstructor
@Slf4j
@Service
public class TestMergeService {

    private final TestBService testBService;

    private final TestAService testAService;

    public String testMerge() {

        testAService.testA();

        testBService.testB();

        return "ok";
    }
}

@Transactional
public String testA() {
    log.info("testA");
    DeepzeroStandardBak entity = buildEntity();
    standardBakService.save(entity);
    return "ok";
}

@Transactional(propagation = Propagation.MANDATORY)
public String testB() {
    log.info("testB");
    DeepzeroStandardBak2 entity2 = buildEntity2();
    standardBak2Service.save(entity2);
    throw new RuntimeException("testB");
}
```

抛出的异常信息

>   org.springframework.transaction.IllegalTransactionStateException: No existing transaction found for transaction marked with propagation 'mandatory'

### **NEVER**

NEVER 传播特性是强制你的方法只能以非事务方式运行，如果方法存在事务操作会抛出异常，我实在是没想到有什么使用场景。

```java
@Transactional(propagation = Propagation.NEVER)
public String testB() {
    log.info("testB");
    DeepzeroStandardBak2 entity2 = buildEntity2();
    standardBak2Service.save(entity2);
//        throw new RuntimeException("testB");
    return "ok";
}
```

抛出的异常信息

>   org.springframework.transaction.IllegalTransactionStateException: Existing transaction found for transaction marked with propagation 'never'

### **REQUIRES_NEW**

我们在使用 Propagation.REQUIRES_NEW 传播特性时，无论当前（调用者）是否存在事务，都会创建一个新事务，原有事务被挂起

例如，testMerge() 方法开始一个事务，调用 testB() 方法时，它会暂停 testMerge() 的事务，并启动一个新的事务。

如果 testB() 方法内部发生异常，新事务会回滚，但原先挂起的事务不会受影响。

这意味着，挂起的事务不会因为新事务的回滚而受到影响，也不会因为新事务的失败而回滚。

```java
@Transactional
public String testMerge() {

    testAService.testA();

    testBService.testB();

    return "ok";
}

@Transactional
public String testA() {
    log.info("testA");
    DeepzeroStandardBak entity = buildEntity();
    standardBakService.save(entity);
    return "ok";
}

@Transactional(propagation = Propagation.REQUIRES_NEW)
public String testB() {
    log.info("testB");
    DeepzeroStandardBak2 entity2 = buildEntity2();
    standardBak2Service.save(entity2);
    throw new RuntimeException("testB");
}
```

### **NESTED**

:::

::

方法的传播行为设置为 NESTED，其被调用方法会在内部开启一个新的嵌套事务（子事务）。这个事务依赖于当前的事务。

在没有外部事务的情况下 `NESTED` 与 `REQUIRED` 效果相同；存在外部事务的情况下，一旦外部事务回滚，它会创建一个嵌套事务（子事务）。

也就是说外部事务回滚时，子事务会跟着回滚；但子事务的回滚不会对外部事务和其他同级事务造成影响

```java
@Component
@RequiredArgsConstructor
@Slf4j
@Service
public class TestMergeService {

    private final TestBService testBService;

    private final TestAService testAService;

    @Transactional
    public String testMerge() {

        testAService.testA();

        testBService.testB();

        throw new RuntimeException("testMerge");
        return "ok";
    }
}

@Transactional
public String testA() {
    log.info("testA");
    DeepzeroStandardBak entity = buildEntity();
    standardBakService.save(entity);
    return "ok";
}

@Transactional(propagation = Propagation.NESTED)
public String testB() {
    log.info("testB");
    DeepzeroStandardBak2 entity2 = buildEntity2();
    standardBak2Service.save(entity2);
    throw new RuntimeException("testB");
}
```

### **NOT_SUPPORTED**

`NOT_SUPPORTED` 事务传播特性表示该方法必须以非事务方式运行。

当方法 testMerge() 开启事务并调用事务方法 testA() 和 testB() 时，如果 testA() 和 testB() 的事务传播特性为 NOT_SUPPORTED，那么 testB() 将以非事务方式运行，并**挂起**当前的事务。

默认传播特性的情况下 testB() 异常事务加入会导致 testA() 回滚，而挂起的意思是说，testB() 其内部一旦抛出异常，不会影响 testMerge() 中其他 testA() 方法的回滚。

```java
@Component
@RequiredArgsConstructor
@Slf4j
@Service
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

@Transactional
public String testA() {
    log.info("testA");
    DeepzeroStandardBak entity = buildEntity();
    standardBakService.save(entity);
    return "ok";
}

@Transactional(propagation = Propagation.NOT_SUPPORTED)
public String testB() {
    log.info("testB");
    DeepzeroStandardBak2 entity2 = buildEntity2();
    standardBak2Service.save(entity2);
    throw new RuntimeException("testB");
}
```

### **SUPPORTS**

:::tip
有事务，就跟着，没有就没有事务
:::

如果当前方法的事务传播特性是 `SUPPORTS`，那么只有在调用该方法的上层方法开启了事务的情况下，该方法的事务才会有效。如果上层方法没有开启事务，那么该方法的事务特性将无效。

例如，如果入口方法 testMerge() 没有开启事务，而 testMerge() 调用的方法 testA() 和 testB() 的事务传播特性为 SUPPORTS，那么由于 testMerge() 没有事务，testA() 和 testB() 将以非事务方式执行。即使在这些方法上加上 `@Transactional` 注解，也不会回滚异常。

```java
@Component
@RequiredArgsConstructor
@Slf4j
@Service
public class TestMergeService {

    private final TestBService testBService;

    private final TestAService testAService;

    public String testMerge() {

        testAService.testA();

        testBService.testB();

        return "ok";
    }
}

@Transactional(propagation = Propagation.SUPPORTS)
public String testA() {
    log.info("testA");
    DeepzeroStandardBak entity = buildEntity();
    standardBakService.save(entity);
    return "ok";
}

@Transactional(propagation = Propagation.SUPPORTS)
public String testB() {
    log.info("testB");
    DeepzeroStandardBak2 entity2 = buildEntity2();
    standardBak2Service.save(entity2);
    throw new RuntimeException("testB");
}
```

## 事务传播行为的选择

**REQUIRED**：大多数情况下使用的默认传播行为，适用于大多数需要事务管理的方法。

**REQUIRES_NEW**：适用于需要独立事务的情况，例如记录日志、审计等操作，即使外层事务回滚，这些操作也应该提交。

**SUPPORTS**：适用于可选事务的情况，例如读取操作，可以在事务内或事务外执行。

**NOT_SUPPORTED**：适用于不需要事务的情况，例如调用外部服务。

**MANDATORY**：适用于必须在事务内执行的方法，例如严格依赖事务上下文的操作。

**NEVER**：适用于必须在非事务上下文中执行的方法。

**NESTED**：适用于需要嵌套事务的情况，例如需要在一个事务内执行多个子事务，并且可以单独回滚子事务。


todo Spring的事务传播机制有哪些？