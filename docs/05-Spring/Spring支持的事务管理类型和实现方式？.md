# Spring支持的事务管理类型和实现方式？

Spring支持的事务管理类型主要有两种：**编程式事务管理**和**声明式事务管理**。



## **编程式事务管理（Programmatic Transaction Management）**

编程式事务管理意味着开发人员手动编写代码来管理事务，通常使用Spring的 `PlatformTransactionManager` 接口来管理事务。开发人员需要显式地打开、提交和回滚事务。

-   实现方式：
    -   使用 `TransactionTemplate` 或直接使用 `PlatformTransactionManager` 进行事务管理。
    -   需要在代码中手动控制事务的开启、提交和回滚。

```java
public class MyService {
    @Autowired
    private PlatformTransactionManager transactionManager;

    public void someMethod() {
        DefaultTransactionDefinition def = new DefaultTransactionDefinition();
        TransactionStatus status = transactionManager.getTransaction(def);
        try {
            // 业务逻辑
            transactionManager.commit(status);  // 提交事务
        } catch (Exception e) {
            transactionManager.rollback(status);  // 回滚事务
        }
    }
}
```



## **声明式事务管理（Declarative Transaction Management）**

声明式事务管理是通过配置（通常使用AOP）来实现事务管理，我们不需要在代码中显式地处理事务，而是通过 **注解** 或 **XML**配置来声明事务的行为。Spring AOP（面向切面编程）帮助实现了这种事务管理方式。

>   除了基于 注解 或 XML来声明事务的行为，还可以基于接口声明事务的行为，但这种方式在spring2.0已经不推荐了。了解即可。

-   实现方式：
    -   **注解驱动事务管理**（基于`@Transactional`注解）：通过在方法上使用`@Transactional`注解，Spring自动为该方法或类应用事务。
    -   **基于XML的事务配置**：通过在Spring的配置文件中定义事务相关的Bean和配置。

### 注解驱动事务管理

使用`@Transactional`注解：

```java
@Service
public class MyService {
    @Transactional
    public void someMethod() {
        // 业务逻辑
    }
}

```

### 基于XML配置

```xml
<bean id="transactionManager" class="org.springframework.orm.hibernate5.HibernateTransactionManager">
    <property name="sessionFactory" ref="sessionFactory"/>
</bean>

<tx:advice id="txAdvice" transaction-manager="transactionManager">
    <tx:attributes>
        <tx:method name="someMethod" propagation="REQUIRED"/>
    </tx:attributes>
</tx:advice>

<aop:config>
    <aop:pointcut expression="execution(* com.example.MyService.*(..))" id="txPointcut"/>
    <aop:advisor pointcut-ref="txPointcut" advice-ref="txAdvice"/>
</aop:config>

```



## **事务管理的关键实现类**

-   PlatformTransactionManager：Spring的核心事务管理接口，不同的实现类支持不同的事务技术（如JDBC、Hibernate、JPA等）。
    -   `DataSourceTransactionManager`：针对JDBC的事务管理实现。
    -   `JpaTransactionManager`：针对JPA的事务管理实现。
    -   `HibernateTransactionManager`：针对Hibernate的事务管理实现。


