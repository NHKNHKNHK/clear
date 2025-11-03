# MySQL的explain有哪些字段？哪些是主要的？

EXPLAIN命令用于分析 SQL 查询的执行计划工具，帮助优化查询性能。通过 explain 命令获取 select 语句的执行计划，通过 explain 我们可以知道以下信息：

- 表的读取顺序（对应id）

- 数据读取操作的类型（对应select_type）

- 哪些索引可以使用（对应possible_keys）

- 哪些索引实际使用了（对应key）

- 表之间的引用（对应ref）

- 每张表有多少行被优化器查询（对应row）

- ...等信息

>   重点学习 type。

## **id**

查询的标识符。一个查询中的每个子查询或联合查询都会有一个唯一的id。

id相同时，执行顺序由上至下。

如果是子查询，id的序号会递增，id值越大优先级越高，越先被执行。id如果相同，可以认为是一组，从上往下顺序执行；在所有组中，id值越大，优先级越高，越先执行。主要用于区分查询中的不同部分。

## **select_type**

查询的类型，描述 SELECT 的类型。主要用于区分普通查询、联合查询、子查询等复杂的查询。

常见值：

-   SIMPLE：简单的查询，不包括子查询或UNION查询

-   PRIMARY：最外层的 SELECT 查询
-   UNION：UNION 中的第二个或后续的 SELECT 查询。
-   DEPENDENT UNION：UNION 中的第二个或后续的 SELECT 查询，依赖于外部查询。
-   UNION RESULT：UNION 的结果。
-   SUBQUERY：在select或where列表中包含了子查询，就为被标记为SUBQUERY。子查询中的第一个 SELECT
-   DEPENDENT SUBQUERY：子查询，依赖于外部查询。
-   DERIVED：派生表。在from列表中包含的子查询会被标记为DERIVED(衍生)，MySQL会递归执行这些子查询，将结果放在临时表中（子查询的结果作为临时表）。

当通过union来连接多个查询结果时，第二个之后的select其select_type为UNION。

当union作为子查询时，其中第二个union的select_type就是DEPENDENT UNION。第一个子查询的select_type则是DEPENDENT SUBQUERY。

## **table**

这一列表示 explain的这一行正在访问哪个表

1）当 from 子句中有子查询时，如果table列是 `<derivenN>` 格式，则表示当前查询依赖 id=N 的查询，于是先执行 id=N 的查询。

2）当有 union 时，UNION RESULT 的 table 列的值为`<union1,2>`，1和2表示参与 union 的 select 行id。

## **partitions**

如果该查询是基于分区表的查询，partitions字段会显示查询所访问的分区。

## **type**

这一列表示关联类型或访问类型，即，Mysql决定通过哪种方式查找数据表中的数据。

从优到最差分别为：system > const > eq_ref > ref > range > index > ALL

一般来说，至少需要保证查询达到range级别，最好达到ref级别

常见值

-   system：表只有一行记录
-   const：表最多有一行匹配。通常是采用主键或唯一索引访问
-   eq_ref：对于每个来自前一个表的行，最多一行与之匹配，比如一个订单表的对应另一张订单信息扩充表，扩充表的记录和订单表肯定是 1 对 1 的，就是 eq
-   ref：对于每个来自前一个表的行，可能有多行与之匹配，如果上面的例子是一对多，那么就是 ref。通常是非唯一索引扫描
-   range：使用索引查找指定范围的行
-   index：全索引扫描，扫描索引树（遍历整个索引树）
-   ALL：全表扫描，性能最差

## **possible_keys**

**查询中可能使用的索引**

指出MySQL能使用哪个索引在表中找到记录。

查询涉及到的字段上若存在索引，则该索引将被列出，但不一定被查询使用（该查询可以利用的索引，如果没有任何索引显示 null）

## **key**

**实际使用的索引**

key列显示MySQL实际决定使用的键（索引），必然包含在possible_keys中

如果没有选择索引，键是NULL。要想强制MySQL使用或忽视possible_keys列中的索引，在查询中使用FORCE INDEX、USE INDEX或者IGNORE INDEX。

可能出现这种情况，possible_keys有显示列，而key显示NULL的情况，这种情况是因为表中数据不多，Mysql优化器认为查询时走索引对此查询语句帮助不大，从而优化器会选择全表扫描（扫描聚簇索引），而不是走索引来查询。

## **key_len**

表示索引中使用的字节数，可通过该列计算查询中使用的索引的长度。

## **ref**

列与索引的比较，表示上述表的连接匹配条件，即哪些列或常量被用于查找索引列上的值

## **rows**

显示MySQL认为它执行查询时检查的行数。多行之间的同组数据相乘可以估算要处理的行数，不同组的相加

在innodb引擎的表中，是一个估计值，可能并不总是准确。

## **filtered**

该列是一个百分比的值，rows * filtered/100 可以估算出将要和 explain 中前一个表进行连接的行数（前一个表指 explain 中的id值比当前表id值小的表）

## **Extra**

附加信息。

-   常见值：
    -   Using index：查询使用了覆盖索引（索引包含所有需要的数据）
    -   Using where：使用了WHERE子句进行过滤
    -   Using temporary：使用了临时表
    -   Using filesort：使用了文件排序
