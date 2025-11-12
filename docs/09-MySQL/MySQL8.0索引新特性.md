# MySQL8.0索引新特性

## 降序索引

降序索引以降序存储键值。虽然在语法上，从 MySQL 4 版本开始就已经支持降序索引的语法了，但实际上该 DESC 定义是被忽略的，直到 **MySQL 8.x 版本才开始真正支持降序索引**（仅限于 InnoDB 存储引擎）。

MySQL在**8.0 版本之前创建的仍然是升序索引，使用时进行反向扫描，这大大降低了数据库的效率**。在某些场景下，降序索引意义重大。

例如，如果一个查询，需要对多个列进行排序，且顺序要求不一致，那么使用降序索引将会避免数据库使用额外的文件排序操作，从而提高性能。

**在创建索引时，可以指定索引的顺序，即索引值升序或降序**

可以分别在MySQL5.7、MySQL8.0分别执行如下SQL，在MySQL 5.7中索引依旧是按照升序存储，而在MySQL 8.0中索引则是按照降序存储。

```sql{4}
CREATE TABLE ts1(
    a int,
    b int,
    index idx_a_b(a,b desc)
);
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

在MySQL 5.7版本中查看数据表ts1的执行计划，SQL语句如下：

```sql
EXPLAIN SELECT * FROM ts1 ORDER BY a, b DESC LIMIT 5;
```

从结果可以看出，执行计划中扫描数为799，而且使用了`Using filesort`

:::tip
`Using filesort`是MySQL中一种速度比较慢的外部排序，能避免是最好的。多数情况下，DBA可以通过优化索引来尽量避免出现Using filesort，从而提高数据库执行速度。
:::

在MySQL 8.0版本中查看数据表ts1的执行计划。从结果可以看出，执行计划中扫描数为5，而且没有使用`Using filesort`

:::warning
降序索引只对查询中特定的排序顺序有效，如果使用不当，反而查询效率更低。

例如，上述查询排序条件改为`order by a desc, b desc`，MySQL 5.7的执行计划要明显好于MySQL 8.0
:::

将排序条件修改为`order by a desc, b desc`后，下面来对比不同版本中执行计划的效果。

分别在MySQL 5.7版本、MySQL 8.0版本中查看数据表ts1的执行计划，SQL语句如下：

```sql
EXPLAIN SELECT * FROM ts1 ORDER BY a DESC, b DESC LIMIT 5;
```

从结果可以看出，修改后MySQL 5.7的执行计划要明显好于MySQL 8.0

## 隐藏索引

> 隐藏索引，简单来说就是把索引设置为不可见，这样查询优化器就不会使用这个索引。

在 MySQL 5.7 版本及之前，只能通过显式的方式删除索引。此时，如果发现删除索引后出现错误，又只能通过显式创建索引的方式将删除的索引创建回来。如果数据表中的数据量非常大，或者数据表本身比较大，这种操作就会消耗系统过多的资源，操作成本非常高。

从 MySQL 8.x 开始支持`隐藏索引（invisible indexes）`，只需要将待删除的索引设置为隐藏索引，使查询优化器不再使用这个索引（即使使用 force index（强制使用索引），优化器也不会使用该索引），确认将索引设置为隐藏索引后系统不受任何响应，就可以彻底删除索引。**这种通过先将索引设置为隐藏索引，再删除索引的方式就是软删除**。

同时，如果你想验证某个索引删除之后的`查询性能影响`，就可以暂时先隐藏该索引。

::: warning 注意

主键不能被设置为隐藏索引。当表中没有显式主键时，表中第一个唯一非空索引会成为隐式主键，也不能设置为隐藏索引。

:::

索引默认是可见的，在使用 `CREATE TABLE`、`CREATE INDEX` 或者 `ALTER TABLE` 等语句时可以通过 `VISIBLE` 或者 `INVISIBLE` 关键词设置索引的可见性。

（说明：其实这里设置索引的可行性的语法就是设置索引的语法，只不过在后面添加了 INVISIBLE、VISIBLE 关键字）

### 修改索引可见性（创建表时直接创建）

在 MySQL 中创建隐藏索引通过 SQL 语句 INVISIBLE 来实现，语法形式如下：

```sql
CREATE TABLE tablename(
    propname1 type1[CONSTRAINT1],
    propname2 type2[CONSTRAINT2],
    ......
    propnamen typen,
    INDEX [indexname](propname1 [(length)]) INVISIBLE
);
```

上述语句比普通索引多了一个关键字 INVISIBLE，用来标记索引为不可见索引

示例：在创建班级表 classes 时，在字段 cname 上创建隐藏索引

```sql{5}
CREATE TABLE classes(
    classno INT(4),
    cname VARCHAR(20),
    loc VARCHAR(40),
    INDEX idx_cname(cname) INVISIBLE
);
```

向表中添加数据，并通过 explain 查看发现，优化器并没有使用索引，而是使用的全表扫描

```sql
EXPLAIN SELECT * FROM classes WHERE cname = '高一2班';
```

### 在已经存在的表上创建

可以为已经存在的表设置隐藏索引，其语法形式如下：

```sql
CREATE INDEX indexname
ON tablename(propname[(length)]) INVISIBLE;
```

例如：

```sql
CREATE INDEX index_cname ON classes(cname) INVISIBLE;
```

### 通过 ALTER TABLE 语句创建

语法形式如下：

```sql
ALTER TABLE tablename
ADD INDEX indexname (propname [(length)]) INVISIBLE;
```

例如：

```sql
ALTER TABLE classes ADD INDEX index_cname(cname) INVISIBLE;
```

### 切换索引可见状态

已存在的索引可通过如下语句切换可见状态：

```sql
ALTER TABLE tablename ALTER INDEX index_name INVISIBLE; #切换成隐藏索引
ALTER TABLE tablename ALTER INDEX index_name VISIBLE; #切换成非隐藏索引
```

如果将 index_cname 索引切换成可见状态，通过 explain 查看执行计划，发现优化器选择了 index_cname 索引。

:::warning 注意

当索引被隐藏时，它的内容仍然是和正常索引一样实时更新的。如果一个索引需要长期被隐藏，那么可以将其删除，因为索引的存在会影响插入、更新和删除的性能。

:::

通过设置隐藏索引的可见性可以查看索引对调优的帮助。

### 使隐藏索引对查询优化器可见

在 MySQL 8.x 版本中，为索引提供了一种新的测试方式，可以通过查询优化器的一个开关（`use_invisible_indexes`）来打开某个设置，使隐藏索引对查询优化器可见。

- 如果 `use_invisible_indexes` 设置为 `off (默认)`，优化器会忽略隐藏索引。
- 如果设置为 on，即使隐藏索引不可见，优化器在生成执行计划时仍会考虑使用隐藏索引。

（1）在 MySQL 命令行执行如下命令查看查询优化器的开关设置。

```sql
mysql> select @@optimizer_switch \G
Query OK, 0 rows affected (0.00 sec)
```

在输出的结果信息中找到如下属性配置。

```txt
use_invisible_indexes=off
```

此属性配置值为 off，说明隐藏索引默认对查询优化器不可见。

（2）使隐藏索引对查询优化器可见，需要在 MySQL 命令行执行如下命令：

```sql
mysql> set session optimizer_switch="use_invisible_indexes=on";
Query OK, 0 rows affected (0.00 sec)
```

SQL 语句执行成功，再次查看查询优化器的开关设置。

```sql
mysql> select @@optimizer_switch \G
```

在输出的结果信息中找到如下属性配置。

```txt
use_invisible_indexes=on
```

`use_invisible_indexes`属性值设置为“on”，说明隐藏索引对查询优化器可见。

（3）使用EXPLAIN查看以字段invisible_column作为查询条件的索引使用情况。

```sql
explain select * from test where cname = '高三14班';
```

查询优化器回使用隐藏索引来查询数据

（4）如果需要使隐藏索引对查询优化器不可见，则只需要执行如下命令即可。

```sql
mysql> set session optimizer_switch="use_invisible_indexes=off";
Query OK, 0 rows affected (0.00 sec)
```

再次查看查询优化器的开关设置。

```sql
mysql> select @@optimizer_switch \G
```

此时，`use_invisible_indexes`属性的值已经被设置为 “off”。
