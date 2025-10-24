---
permalink: /25/10/24/mysql/index-category
---

# MySQL的索引类型有哪些？（索引分类）

MySQL的索引包括普通索引、唯一索引、全文索引、单列索引、多列索引和空间索引等。

- 按照 **功能逻辑** 来说，索引主要有 4 种，分别是普通索引、唯一索引、主键索引、全文索引。
- 按照 **物理实现方式** 来说 ，索引可以分为 2 种：聚簇索引和非聚簇索引。
- 按照 **作用字段个数** 进行划分，分成单列索引和联合索引。

1. 普通索引
2. 唯一索引
3. 主键索引
4. 单列索引
5. 多列(组合、联合)索引
6. 全文索引
7. 补充：空间索引

不同的存储引擎支持的索引类型也不一样

- InnoDB ：支持 B-tree、Full-text 等索引，不支持 Hash索引
- MyISAM ：支持 B-tree、Full-text 等索引，不支持 Hash 索引
- Memory ：支持 B-tree、Hash 等索引，不支持 Full-text 索引
- NDB ：支持 Hash 索引，不支持 B-tree、Full-text 等索引
- Archive ：不支持 B-tree、Hash、Full-text 等索引

## 创建索引的语法

可以在表创建时或者表结构修改时创建索引

下面是在创建表后创建索引

```sql
-- ALTER TABLE创建索引
ALTER TABLE table_name ADD [UNIQUE | FULLTEXT | SPATIAL] [INDEX | KEY]
[index_name] (col_name[length],...) [ASC | DESC]

-- CREATE INDEX创建索引
CREATE [UNIQUE | FULLTEXT | SPATIAL] INDEX index_name
ON table_name (col_name[length],...) [ASC | DESC]

-- 在创建索引时指定索引值降序或升序只在MySQL 8.x 版本生效
```

- `UNIQUE`、`FULLTEXT`和`SPATIAL`为可选参数，分别表示唯一索引、全文索引和空间索引；
- `INDEX`与`KEY`为同义词，两者的作用相同，用来指定创建索引；
- `index_name`指定索引的名称，为可选参数，如果不指定，那么MySQL默认col_name为索引名；
- `col_name`为需要创建索引的字段列，该列必须从数据表中定义的多个列中选择；
- `length`为可选参数，表示索引的长度，只有字符串类型的字段才能指定索引长度；
- `ASC` 或 `DESC` 指定升序或者降序的索引值存储。

删除索引

```sql
ALTER TABLE table_name DROP INDEX index_name

DROP INDEX index_name ON table_name
```

:::tip
删除表中的列时，如果要删除的列为索引的组成部分，则该列也会从索引中删除。如果组成索引的所有列都被删除，则整个索引将被删除
:::

## MySQL 8.0索引新特性

### 降序索引

在创建索引时，可以指定索引的顺序，即索引值升序或降序

可以分别在MySQL5.7、MySQL8.0分别执行如下SQL，在MySQL 5.7中索引依旧是按照升序存储，而在MySQL 8.0中索引则是按照降序存储。

```sql
CREATE TABLE ts1(a int,b int,index idx_a_b(a,b desc));
```

下面可以测试降序索引在执行计划中的表现

分别在MySQL 5.7版本和MySQL 8.0版本的数据表ts1中插入800条随机数据，执行语句如下：

```sql
DELIMITER //
CREATE PROCEDURE ts_insert()
BEGIN
DECLARE i INT DEFAULT 1;
WHILE i < 800
DO
insert into ts1 select rand()*80000,rand()*80000;
SET i = i + 1;
END WHILE;
commit;
END //
DELIMITER ;

# 调用
CALL ts_insert();
```

在MySQL 5.7版本中查看数据表ts1的执行计划，结果如下：

```sql
EXPLAIN SELECT * FROM ts1 ORDER BY a,b DESC LIMIT 5;
```

从结果可以看出，执行计划中扫描数为799，而且使用了Using filesort

:::tip
Using filesort是MySQL中一种速度比较慢的外部排序，能避免是最好的。多数情况下，管理员可以通过优化索引来尽量避免出现Using filesort，从而提高数据库执行速度。
:::

在MySQL 8.0版本中查看数据表ts1的执行计划。从结果可以看出，执行计划中扫描数为5，而且没有使用Using filesort

:::warning
降序索引只对查询中特定的排序顺序有效，如果使用不当，反而查询效率更低。

例如，上述查询排序条件改为order by a desc, b desc，MySQL 5.7的执行计划要明显好于MySQL 8.0
:::

将排序条件修改为order by a desc, b desc后，下面来对比不同版本中执行计划的效果。

在MySQL 5.7版本中查看数据表ts1的执行计划，结果如下：

```sql
EXPLAIN SELECT * FROM ts1 ORDER BY a DESC, b DESC LIMIT 5;
```

在MySQL 8.0版本中查看数据表ts1的执行计划

从结果可以看出，修改后MySQL 5.7的执行计划要明显好于MySQL 8.0

