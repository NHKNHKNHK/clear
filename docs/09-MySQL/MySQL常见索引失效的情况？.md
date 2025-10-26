---
permalink: /mysql/index-invalid
---

# MySQL常见索引失效的情况？ :star:

:::tip
索引失效的本质是MySQL优化器认为使用索引的成本高于全表扫描
:::

:::details 测试表
```sql
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    age INT,
    email VARCHAR(100),
    created_time DATETIME,
    INDEX idx_name (name),
    INDEX idx_age (age),
    INDEX idx_created_time (created_time)
);
```
:::

## 对索引列使用函数或表达式

在索引列上使用函数或表达式（如`UPPER(column)`、`column + 1`）会导致索引失效

```sql
EXPLAIN SELECT * FROM user WHERE DATE(created_time) = '2025-10-22';

--正确做法：使用范围查询替代函数操作
EXPLAIN SELECT * FROM user WHERE created_time >= '2025-10-22 00:00:00'
AND created_time < '2025-10-23 00:00:00';

EXPLAIN SELECT * FROM user WHERE UPPER(name) = 'zs';
```

函数操作破坏索引有序性，所以导致索引失效

- 索引是按照列值的原始顺序存储的
- 对列使用函数后，MySQL无法利用索引的有序性
- 必须扫描所有索引项，计算函数值后再比较


## 隐式类型转换

当查询条件中的数据类型与索引列的数据类型不匹配时，MySQL 可能会进行隐式类型转换，从而导致索引失效

```sql
EXPLAIN SELECT * FROM user WHERE name = 123;  -- name是字符串类型，但错误的使用了数字
```

## OR条件使用不当

如果OR条件中的列没有索引或无法同时使用索引，也会导致索引失效。

```sql
-- age有索引，email无索引，导致索引失效
EXPLAIN SELECT * FROM table WHERE age = 18 OR email = '123@163.com';

-- 正确写法：使用UNION优化OR查询
EXPLAIN SELECT * FROM table WHERE age = 18
UNION
SELECT * FROM table WHERE email = '123@163.com';
```

## 前导模糊查询

在 LIKE 查询中，如果模式以通配符（如%）开头，索引将失效

```sql
EXPLAIN SELECT * FROM user WHERE name LIKE '%三';

-- 正确写法：非前导模糊查询，可以使用索引
EXPLAIN SELECT * FROM user WHERE name LIKE '张%';
```

## 不等于操作

使用不等于操作符（如`!=`或`<>`）通常会导致索引失效

```sql
EXPLAIN SELECT * FROM user WHERE name != 'zs';
```

## 范围条件后再使用等值条件

复合索引中，如果使用了范围条件（如`<`、`>`、`BETWEEN`），后面的等值条件可能无法使用索引。

```sql
EXPLAIN SELECT * FROM table WHERE id > 10 AND age = 18; 
```

## 不满足最左前缀原则

对于复合索引，查询条件必须满足最左前缀原则，否则索引将失效

```sql
-- 假设存在复合索引(column1, column2) 
SELECT * FROM table WHERE column2 = 'value';  -- 不能使用索引
```

## 查询条件中包含负向查询

例如`NOT IN`、`NOT LIKE`等负向查询条件会导致索引失效。

```sql
EXPLAIN SELECT * FROM user WHERE name NOT IN ('zs', 'ls');
```

:::tip
IS NULL可以使用索引，IS NOT NULL无法使用索引
:::

## 数据分布不均匀

即使有索引，如果数据分布非常不均匀，MySQL 优化器可能会选择全表扫描而不是使用索引。



