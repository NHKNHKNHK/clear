# Mybatis都有哪些Executor执行器？它们之间的区别是什么？

主要用三种执行器 SimpleExecutor，ReuseExecutor，BatchExecutor。SimpleExecutor 是默认的执行器，每次执行都会创建新的Statement对象，适用于简单的场景。ReuseExecutor 会重用Statement对象，适用于大量相同或类似 SQL 语句的场景。BatchExecutor 用于批量执行 SQL 语句，适用于批量更新操作的场景。

## **SimpleExecutor**

-   SimpleExecutor是 MyBatis 的**默认执行器**。每次执行更新或查询操作时，都会开启一个新的Statement对象。适用于简单的、对性能要求不高的场景

-   **工作原理**：每次执行 SQL 操作时，SimpleExecutor都会创建一个新的Statement对象并执行 SQL 语句。执行完毕后，Statement对象会被关闭和销毁
-   特点
    -   每次执行 SQL 都会重新创建 PreparedStatement。
    -   不支持批量操作。
    -   不使用二级缓存

## **ReuseExecutor**

-   ReuseExecutor 相比SimpleExecutor会重用Statement对象，以减少Statement对象的创建和销毁开销。适用于需要执行大量相同或类似 SQL 语句的场景。

-   **工作原理**：ReuseExecutor会缓存已经创建的Statement对象。当再次执行相同的 SQL 语句时，会重用缓存中的Statement对象，而不是重新创建一个新的对象。执行完毕后，Statement对象不会立即关闭，而是保存在缓存中，等待下次使用。
-   特点
    -   在同一个 SqlSession 内重用 PreparedStatement。
    -   支持批量操作。
    -   不使用二级缓存。

## **BatchExecutor**

-   BatchExecutor会将多条 SQL 语句累积在一起，批量执行，以减少数据库的交互次数。适用于需要执行大量批量更新操作的场景，如批量插入、更新或删除

-   **工作原理**：BatchExecutor会将多条 SQL 语句添加到一个批处理中，直到调用commit或flushStatements方法时，才会将这些 SQL 语句一次性发送到数据库执行。这种方式可以显著减少数据库的交互次数，提高性能
-   特点
    -   支持批量操作，可以显著减少与数据库的交互次数。
    -   需要显式调用 `flushStatements()` 或 `commit()` 来提交批处理。
    -   不使用二级缓存

**配置方式**

可以在 MyBatis 全局配置文件（mybatis-config.xml）中通过defaultExecutorType属性来指定默认的执行器类型：

```xml
<settings>
    <setting name="defaultExecutorType" value="SIMPLE"/>
    <!-- 或者 -->
    <setting name="defaultExecutorType" value="REUSE"/>
    <!-- 或者 -->
    <setting name="defaultExecutorType" value="BATCH"/>
</settings>
```

也可以在代码中通过SqlSessionFactory来指定执行器类型：

```java
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(reader);
SqlSession sqlSession = sqlSessionFactory.openSession(ExecutorType.BATCH);
```

## **CachingExecutor**

-   包装其他 Executor，添加二级缓存功能。它会在执行 SQL 之前先检查缓存，如果命中则直接返回缓存结果，否则执行实际的 SQL 并将结果存入缓存。
-   **适用场景**：适用于需要启用二级缓存的场景，可以减少数据库查询次数，提高查询性能。
-   特点
    -   包装其他 Executor（如 SimpleExecutor、ReuseExecutor 或 BatchExecutor）。
    -   支持二级缓存。
    -   缓存命中时可以直接返回结果，不执行 SQL。

| Executor        | 特点                                       | 适用场景                     |
| :-------------- | :----------------------------------------- | :--------------------------- |
| SimpleExecutor  | 每次查询创建新的 PreparedStatement，不缓存 | 简单查询，不需要缓存         |
| ReuseExecutor   | 同一 SqlSession 内重用 PreparedStatement   | 频繁执行相同 SQL             |
| BatchExecutor   | 批量处理 SQL，减少与数据库交互次数         | 批量插入、更新或删除大量数据 |
| CachingExecutor | 包装其他 Executor，添加二级缓存功能        | 需要启用二级缓存的场景       |

