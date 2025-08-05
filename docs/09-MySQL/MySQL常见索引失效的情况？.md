# MySQL常见索引失效的情况?:star:

**使用函数或表达式**

在索引列上使用函数或表达式（如UPPER(column)、column + 1）会导致索引失效

```sql
SELECT * FROM table WHERE UPPER(column) = 'VALUE';
```

**隐式类型转换**

当查询条件中的数据类型与索引列的数据类型不匹配时，MySQL 可能会进行隐式类型转换，从而导致索引失效

```sql
SELECT * FROM table WHERE varchar_column = 123;  -- varchar_column 是字符串类型
```

**使用OR条件**

如果OR条件中的列没有索引或无法同时使用索引，也会导致索引失效。

```sql
SELECT * FROM table WHERE column1 = 'value1' OR column2 = 'value2';
```

**前导模糊查询**

在 LIKE 查询中，如果模式以通配符（如%）开头，索引将失效

```sql
SELECT * FROM table WHERE column LIKE '%value';
```

**不等于操作**

使用不等于操作符（如!=或<>）通常会导致索引失效

```sql
SELECT * FROM table WHERE column != 'value';
```

**范围条件后再使用等值条件**

复合索引中，如果使用了范围条件（如<、>、BETWEEN），后面的等值条件可能无法使用索引。

```sql
SELECT * FROM table WHERE column1 > 10 AND column2 = 'value';
```

**不满足最左前缀原则**

对于复合索引，查询条件必须满足最左前缀原则，否则索引将失效

```sql
SELECT * FROM table WHERE column2 = 'value';  -- 不能使用索引
```

**查询条件中包含负向查询**

例如NOT IN、NOT LIKE等负向查询条件会导致索引失效。

```sql
SELECT * FROM table WHERE column NOT IN ('value1', 'value2');
```

**数据分布不均匀**

即使有索引，如果数据分布非常不均匀，MySQL 优化器可能会选择全表扫描而不是使用索引。



