---
permalink: /25/10/24/mysql/hash-join
---

# MySQL的Hash Join是什么？

hash join 是 MySQL 8.0.18版本中新推出的一种多表join的算法

在这之前，MySQL是使用了嵌套循环（Nested-Loop Join）的方式来实现关联查询的，而嵌套循环的算法其实性能是比较差的，而Hash Join的出现就是要优化Nested-Loop Join的。

