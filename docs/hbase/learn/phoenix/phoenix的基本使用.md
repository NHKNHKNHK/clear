# Phoenix简介

## phoenix简介

phoenix，由 saleforce.com 开源的一个项目，后又捐给了 Apache。它相当于一个Java中间件，帮助开发者，像使用jdbc访问关系型数据库一样，来访问NoSQL数据库HBase。

phoenix，操作的表及数据，存储在HBase上。phoenix只是需要和HBase进行关联起来，然后再用根据进行一些读写操作。

其实，可以把Phoenix只看成是一种代替HBase的语法的工具。虽然可用用Java与jdbc来连接phoenix，然后操作HBase，但是在生成环境中，不可以用在OLTP（在线事务处理中）。在线事务处理的环境中，需要延迟低，而phoenix在查询HBase时，虽然做了一些优化，但延迟还是不小。所有依然是用在OLAP（联机分析处理）中，再将结果返回存储下来。

phoenix是一个HBase的开源SQL引擎。你可以使用标准的JDBC API 代替HBase客户端API来创建，插入数据，查询你的HBase数据。Phoenix是构建在HBase之上的SQL引擎。

## phoenix特点

你也许会有疑问，“phoenix是否会降低HBase的效率”，或者说“phoenix的效率是否很低”。

但事实上，phoenix通过以下的方式实现了和你自己手写的方式相同或者可能是更好的性能（更不用说可以少写了很多代码）：

-   编译SQL查询为原生HBase的scan语句
-   检测scan语句最佳的开始和结束的key
-   精心编排你的scan语句让他们并行执行
-   让计算去接近数据通过
-   推送你的where子句的谓词到服务端过滤器处理
-   执行聚合查询通过服务端钩子（称为协同处理器）

除此之外，phoenix还做了一些有趣的增强功能来更多地优化性能：

-   实现了二级索引来提升非主键字段的查询的性能
-   统计相关数据来提高并行话水平，并帮助选择最佳优化方案
-   跳过扫描过滤器来优化IN，LIKE，OR查询
-   优化主键来均匀分布写压力

**phoenix不能干嘛**

-   不支持事务处理
-   不支持复制的条件

## 为什么要使用Phoenix

​	官方解释：在 Client 和 HBase 之间放一个Phoenix中间层不会减慢速度，因为用户编写的数据代码和 Phoenix编写的没有区别（更不用说你写的垃圾很多），不仅如此 Phoenix 对于用户输入的 SQL 同样会有大量的优化手段。（就像hive自带sql优化器一样）

