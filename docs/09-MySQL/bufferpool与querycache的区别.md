# buffer pool与query cache的区别（缓冲池与查询缓存的区别）

在Innodb中，除了buffer pool，还有一个缓存层是用来做数据缓存，提升查询效率的，很多人搞不清楚他和buffer pool的区别是什么。

首先就是他们目的和作用不同。Buffer Pool用于缓存表和索引的数据页，从而加速读取操作；而Query Cache用于缓存查询结果，减少重复查询的执行时间。

Buffer Pool主要与存储引擎InnoDB相关，而Query Cache也支持其他的引擎，如MyISAM等。所以，Query Cache是位于Server层的优化技术，而Buffer Pool 是位于引擎层的优化技术。

需要注意的是，在MySQL 5.7版本中，Query Cache已经被标记为废弃，并在MySQL 8.0版本中彻底被移除了
