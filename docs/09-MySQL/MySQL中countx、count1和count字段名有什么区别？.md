# MySQL中count(*)、count(1)和count(字段名)有什么区别？

在 MySQL 中，COUNT(*)、COUNT(1) 和 COUNT(字段名) 都用于统计行数

**COUNT(*)**

-   定义：统计表中的所有行数，包括包含 NULL 值的行。
-   特点：
    -   最常用的形式，适用于大多数场景。
    -   **不会忽略**任何行，即使所有列都为 **NULL**。

**COUNT(1)**

-   定义：统计表中的所有行数，类似于 COUNT(\*)。
-   特点：
    -   实际上与 COUNT(\*) 没有本质区别，**MySQL 优化器会将 COUNT(\*) 转换为 COUNT(1) 处理**。
    -   有些人认为 COUNT(1) 更直观，因为它明确指定了一个常量值。

**COUNT(字段名)**

-   定义：统计指定字段不为 NULL 的行数。
-   特点：
    -   **忽略NULL**：只统计该字段非 NULL 的行数，如果字段中有 NULL 值，则这些行不会被计入。
    -   对于主键或唯一索引字段（如 id），效果与 COUNT(\*) 相同，因为这些字段不允许 NULL。
    -   对于允许 NULL 的字段，结果可能会小于 COUNT(\*)。

示例：

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100)
);
INSERT INTO users (id, name, email) VALUES
(1, 'Alice', 'alice@example.com'),
(2, 'Bob', NULL),
(3, 'Charlie', 'charlie@example.com');
```

```sql
SELECT COUNT(*), COUNT(1), COUNT(email) FROM users;
```

查询结果如下：

```
+----------+----------+---------------+
| COUNT(*) | COUNT(1) | COUNT(email)  |
+----------+----------+---------------+
|        3 |        3 |             2 |
+----------+----------+---------------+
```



**COUNT(\*) vs COUNT(1)**

-   **性能差异**：没有区别。**MySQL 优化器会将 COUNT(\*) 转换为 COUNT(1) 处理**，因此两者的执行计划和性能是相同的。
    -   MySQL官方解释是没有区别的，MySQL 优化器会将 COUNT(\*) 优化为 COUNT(0)， 
-   选择建议：可以根据个人或团队的习惯选择使用哪一个，两者在功能和性能上没有显著差异。

**COUNT(*) vs COUNT(字段名)**

-   性能差异：
    -   对于带有索引的字段，COUNT(字段名) 可能会稍微快一些，因为它可以直接利用索引来统计非 NULL 的行数。
    -   但对于未索引的字段，COUNT(字段名) 可能需要额外的检查来判断是否为 NULL，这可能会稍微慢一些。
-   选择建议：
    -   如果你需要统计所有行数，无论字段是否为 NULL，应使用 COUNT(\*)。
    -   如果你需要统计某个特定字段非 NULL 的行数，应使用 COUNT(字段名)。

**总结**

-   COUNT(\*)：统计所有行数，包括 NULL 值。
-   COUNT(1)：等价于 COUNT(*)，由 MySQL 优化器转换处理。
-   COUNT(字段名)：只统计指定字段非 NULL 的行数

