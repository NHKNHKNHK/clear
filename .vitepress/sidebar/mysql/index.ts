
const basePath = '/09-MySQL/'

export default [
    {
        text: 'SQL基本语法',
        collapsed: true,
        items: [
            { text: 'MySQL', link: basePath + '' },

            { text: 'MySQL使用规范你觉得都有什么？', link: basePath + 'MySQL使用规范你觉得都有什么？' },
            { text: '创建数据库表要注意什么？', link: basePath + '创建数据库表要注意什么？' },
            { text: '数据库的三大范式是什么？', link: basePath + '数据库的三大范式是什么？' },
            { text: '什么是反三范式？', link: basePath + '什么是反三范式？' },

            { text: 'MySQL中主键自增（auto_increment）列到达最大值时会发生什么？你会怎么调整', link: basePath + 'MySQL中主键自增（auto_increment）列到达最大值时会发生什么？你会怎么调整' },

            { text: 'MySQL中exists和in的区别？', link: basePath + 'MySQL中exists和in的区别？' },
            { text: 'MySQL在inner join、left join、right join的区别是什么？', link: basePath + 'MySQL在inner join、left join、right join的区别是什么？' },
            { text: '为什么SQL语句不要过多的使用join？', link: basePath + '为什么SQL语句不要过多的使用join？' },
            { text: 'MySQL的Hash Join是什么？', link: basePath + 'MySQL的Hash Join是什么？' },
            { text: 'MySQL中数据排序的实现原理是什么？', link: basePath + 'MySQL中数据排序的实现原理是什么？' },
            { text: 'MySQL书写顺序与执行顺序', link: basePath + 'MySQL书写顺序与执行顺序' },
            { text: '简述一条SQL在MySQL中的执行过程？', link: basePath + '简述一条SQL在MySQL中的执行过程？' },
            { text: 'MySQL中一条查询语句是如何执行的？', link: basePath + 'MySQL中一条查询语句是如何执行的？' },
            { text: 'MySQL中一条更新语句是如何执行的？', link: basePath + 'MySQL中一条更新语句是如何执行的？' },
            { text: 'union和union all区别？', link: basePath + 'union和union all区别？' },

            { text: '多表查询分类', link: basePath + '多表查询分类' },
        ]
    },
    {
        text: '事务',
        collapsed: true,
        items: [
            { text: 'MySQL事务的四大特性', link: basePath + 'MySQL事务的四大特性' },
            { text: '什么是脏读、幻读、不可重复读？', link: basePath + '什么是脏读、幻读、不可重复读？' },
            { text: '不可重复读和幻读有什么区别', link: basePath + '不可重复读和幻读有什么区别' },
            { text: 'innoDB如何解决幻读？', link: basePath + 'innoDB如何解决幻读？' },
            { text: 'MySQL的事务隔离级别？', link: basePath + 'MySQL的事务隔离级别？' },
            { text: 'MySQL默认事务隔离级别是什么？为什么选这个级别？', link: basePath + 'MySQL默认事务隔离级别是什么？为什么选这个级别？' },
            { text: '你们生产环境的MySQL中使用了什么事务隔离级别？为什么？', link: basePath + '你们生产环境的MySQL中使用了什么事务隔离级别？为什么？' },


            { text: 'MySQL是如何实现事务的？', link: basePath + 'MySQL是如何实现事务的？' },
            { text: 'MySQL中大事务会有哪些影响？', link: basePath + 'MySQL中大事务会有哪些影响？' },
            { text: 'MySQL中长事务可能会导致哪些问题？', link: basePath + 'MySQL中长事务可能会导致哪些问题？' },

        ]
    },

    {
        text: '索引',
        collapsed: true,
        items: [
            // 聚集索引
            // 非聚集索引
            // 回表查询
            // 覆盖索引
            // 前缀索引
            // 复合索引
            // 索引下推
            { text: 'MySQL的索引类型有哪些？', link: basePath + 'MySQL的索引类型有哪些？' },
            { text: 'MySQL常见索引失效的情况？', link: basePath + 'MySQL常见索引失效的情况？' },
            { text: '什么情况下应不建或少建索引？', link: basePath + '什么情况下应不建或少建索引？' },
            { text: '在建立索引的时，需要考虑哪些因素？', link: basePath + '在建立索引的时，需要考虑哪些因素？' },
            { text: 'MySQL中建立索引需要注意什么？', link: basePath + 'MySQL中建立索引需要注意什么？' },
            { text: 'MySQL在使用索引一定有效吗？如何排查索引效果？', link: basePath + 'MySQL在使用索引一定有效吗？如何排查索引效果？' },
            { text: 'MySQL中索引数量是否越多越好？为什么？', link: basePath + 'MySQL中索引数量是否越多越好？为什么？' },
            { text: '在什么情况下，不推荐为数据库建立索引？', link: basePath + '在什么情况下，不推荐为数据库建立索引？' },
            { text: 'MySQL InnoDB引擎中的聚簇索引和非聚簇索引有什么区别？', link: basePath + 'MySQL InnoDB引擎中的聚簇索引和非聚簇索引有什么区别？' },
            { text: 'MySQL中的回表是什么？', link: basePath + 'MySQL中的回表是什么？' },
            { text: 'MySQL索引最左前缀匹配原则？', link: basePath + 'MySQL索引最左前缀匹配原则？' },

            { text: '什么是自适应hash索引？', link: basePath + '什么是自适应hash索引？' },

            { text: '什么是索引？有什么用？', link: basePath + '什么是索引？有什么用？' },
            { text: '索引的本质？', link: basePath + '索引的本质？' },
            { text: '索引底层的数据结构？', link: basePath + '索引底层的数据结构？' },
            { text: '索引的创建和使用规则？', link: basePath + '索引的创建和使用规则？' },
            { text: '在不同存储引擎中索引的落地方式？', link: basePath + '在不同存储引擎中索引的落地方式？' },
            { text: '什么是hash索引？', link: basePath + '什么是hash索引？' },
            { text: 'InnoDB到底支不支持哈希索引呢？', link: basePath + 'InnoDB到底支不支持哈希索引呢？' },
            { text: '什么是唯一索引？', link: basePath + '什么是唯一索引？' },
            { text: '唯一索引比普通索引快吗？', link: basePath + '唯一索引比普通索引快吗？' },
            { text: '什么是mysql的三星索引？', link: basePath + '什么是mysql的三星索引？' },
            { text: 'MySQL的explain有哪些字段？哪些是主要的？', link: basePath + 'MySQL的explain有哪些字段？哪些是主要的？' },
            { text: '如何使用MySQL中的explain语句进行查询分析？', link: basePath + '如何使用MySQL中的explain语句进行查询分析？' },
            { text: '用explain分析举一个具体的例子？', link: basePath + '用explain分析举一个具体的例子？' },
            { text: 'Mysql语句都有哪些种类？', link: basePath + 'Mysql语句都有哪些种类？' },
            { text: 'Mysql查询优化建议？', link: basePath + 'Mysql查询优化建议？' },
            { text: 'Mysql聚集索引是什么？', link: basePath + 'Mysql聚集索引是什么？' },
            { text: '为什么聚集索引，不要选择频繁更新的列？', link: basePath + '为什么聚集索引，不要选择频繁更新的列？' },
            { text: 'Mysql的非聚集索引是什么？', link: basePath + 'Mysql的非聚集索引是什么？' },
            { text: '什么是前缀索引？', link: basePath + '什么是前缀索引？' },
            { text: '什么是联合索引（复合索引）？', link: basePath + '什么是联合索引（复合索引）？' },
            { text: 'MySQL的覆盖索引？', link: basePath + 'MySQL的覆盖索引？' },
            { text: 'A,B,C三个字段组成联合索引，AB,AC,BC三种情况下查询是否能命中索引？', link: basePath + 'A,B,C三个字段组成联合索引，AB,AC,BC三种情况下查询是否能命中索引？' },
            { text: '什么是索引下推？', link: basePath + '什么是索引下推？' },
            { text: 'Mysql的回表查询是什么？', link: basePath + 'Mysql的回表查询是什么？' },
            { text: 'mysql的覆盖索引是什么？', link: basePath + 'mysql的覆盖索引是什么？' },
            { text: 'B+树索引和哈希索引的区别？', link: basePath + 'B+树索引和哈希索引的区别？' },
            { text: '哈希索引的优势及不适用的场景？', link: basePath + '哈希索引的优势及不适用的场景？' },
            { text: 'B树和B+树的区别', link: basePath + 'B树和B+树的区别' },
            { text: 'b树和b+树的理解？', link: basePath + 'b树和b+树的理解？' },
            { text: '为什么说B+比B树更适合实际应用中作为数据库索引？', link: basePath + '为什么说B+比B树更适合实际应用中作为数据库索引？' },
            { text: 'b树和b+简述MySQL的b+树查询数据的全过程？', link: basePath + '简述MySQL的b+树查询数据的全过程？' },
            { text: '为什么MySQL选择使用B+树作为索引结构？', link: basePath + '为什么MySQL选择使用B+树作为索引结构？' },
            { text: '单个索引的大小会对B+树造成什么影响？', link: basePath + '单个索引的大小会对B+树造成什么影响？' },

        ]
    },
    {
        text: '数据类型与函数',
        collapsed: true,
        items: [
            { text: 'MySQL的常用数据类型', link: basePath + 'MySQL的常用数据类型' },
            { text: 'Mysql的char和varchar的区别？', link: basePath + 'Mysql的char和varchar的区别？' },
            { text: 'MySQL中varchar(100)和varchar(10)的区别？', link: basePath + 'MySQL中varchar(100)和varchar(10)的区别？' },
            { text: 'MySQL中text类型最大可以存储多长的文本？', link: basePath + 'MySQL中text类型最大可以存储多长的文本？' },
            { text: 'mysql的blob和text有什么区别', link: basePath + 'mysql的blob和text有什么区别' },
            { text: 'MySQL中int(1)和int(10)的区别？', link: basePath + 'MySQL中int(1)和int(10)的区别？' },
            { text: 'MySQL中int(11)的11表示什么？', link: basePath + 'MySQL中int(11)的11表示什么？' },
            { text: 'MySQL中tinyint的默认位数', link: basePath + 'MySQL中tinyint的默认位数' },
            { text: 'Mysql的常用函数有哪些？', link: basePath + 'Mysql的常用函数有哪些？' },
            { text: 'MySQL中count(*)、count(1)和count(字段名)有什么区别？', link: basePath + 'MySQL中countx、count1和count字段名有什么区别？' },
            { text: 'drop、delete与truncate的区别？', link: basePath + 'drop、delete与truncate的区别？' },
            { text: 'MySQL中`limit 1000000,10`和`limit 10`的执行速度是否相同？', link: basePath + 'MySQL中`limit 1000000,10`和`limit 10`的执行速度是否相同？' },
            { text: 'MySQL中datetime和timestamp类型的区别？', link: basePath + 'MySQL中datetime和timestamp类型的区别？' },
            { text: '在MySQL中，你使用过哪些函数？常用函数？', link: basePath + '在MySQL中，你使用过哪些函数？常用函数？' },
            { text: '在MySQL存储金额数据，应该使用什么数据类型？', link: basePath + '在MySQL存储金额数据，应该使用什么数据类型？' },

        ]
    },
    {
        text: '存储引擎',
        collapsed: true,
        items: [

            { text: 'MySQL的存储引擎有哪些？有什么区别？', link: basePath + 'MySQL的存储引擎有哪些？有什么区别？' },
            { text: 'MySQL中InnoDB和MyISAM的区别？', link: basePath + 'MySQL中InnoDB和MyISAM的区别？' },
            { text: '存储引擎应该如何选择？', link: basePath + '存储引擎应该如何选择？' },
            { text: 'InnoDB引擎的4大特性？', link: basePath + 'InnoDB引擎的4大特性？' },
            { text: 'InnoDB 的双写缓冲是什么？', link: basePath + 'InnoDB 的双写缓冲是什么？' },
            { text: 'MyISAM Static 和 MyISAM Dynamic 有什么区别？', link: basePath + 'MyISAM Static 和 MyISAM Dynamic 有什么区别？' },
            { text: 'MySQL的innodb和myisam索引的区别', link: basePath + 'MySQL的innodb和myisam索引的区别' },

        ]
    },
    {
        text: '场景',
        collapsed: true,
        items: [
            // 冷热分离怎么做
            // 索引失效场景？
            { text: '怎么做数据冷热分离？', link: basePath + '怎么做数据冷热分离？' },
            { text: 'MySQL数据库的性能优化方法有哪些？', link: basePath + 'MySQL数据库的性能优化方法有哪些？' },
            { text: 'MySQL如何进行SQL调优？', link: basePath + 'MySQL如何进行SQL调优？' },
            { text: '相比Oracle，MySQL的优势有哪些？', link: basePath + '相比Oracle，MySQL的优势有哪些？' },
            { text: '慢SQL优化思路？', link: basePath + '慢SQL优化思路？' },
            { text: '如何在MySQL中监控和优化慢SQL？', link: basePath + '如何在MySQL中监控和优化慢SQL？' },
            { text: 'MySQL中如何解决数据深度分页的问题？', link: basePath + 'MySQL中如何解决数据深度分页的问题？' },

        ]
    },
    {
        text: '分库分表',
        collapsed: true,
        items: [
            // 概念
            // 垂直拆分or水平拆分
            // 分表路由
            // 跨库join
            // 分布式id问题
            // 扩容方案

            { text: 'Mysql中什么是表分区？', link: basePath + 'Mysql中什么是表分区？' },
            { text: 'Mysql如何做分库分表？', link: basePath + 'Mysql如何做分库分表？' },
            { text: '表分区与分表的区别？', link: basePath + '表分区与分表的区别？' },
            { text: '什么是分库分表？分库分表有哪些策略？如何实现？', link: basePath + '什么是分库分表？分库分表有哪些策略？如何实现？' },
            { text: '如何在MySQL中实施分库分表策略？', link: basePath + '如何在MySQL中实施分库分表策略？' },
            { text: '对数据库实施分库分表可能会引发哪些问题？', link: basePath + '对数据库实施分库分表可能会引发哪些问题？' },
            { text: '单表数据量多少需要分表？', link: basePath + '单表数据量多少需要分表？' },
            { text: '数据量过大的情况下，怎么处理？分库分表的设计规范是什么？', link: basePath + '数据量过大的情况下，怎么处理？分库分表的设计规范是什么？' },

            { text: 'MySQL如何实现读写分离？Java代码中如何实现？', link: basePath + 'MySQL如何实现读写分离？Java代码中如何实现？' },

        ]
    },
    {
        text: '集群',
        collapsed: true,
        items: [
            // 主从复制原理
            // 数据同步的一致性
            // 故障切换，数据补偿
            // 多主 vs 单主
            // 脑裂问题

            { text: 'mysql的全复制、半复制、异步复制都是什么？', link: basePath + 'mysql的全复制、半复制、异步复制都是什么？' },
            { text: 'mysql半同步复制的特点', link: basePath + 'mysql半同步复制的特点' },
            { text: 'mysql主从同步原理？', link: basePath + 'mysql主从同步原理？' },
            { text: 'MySQL的主从同步机制？它是如何实现的？', link: basePath + 'MySQL的主从同步机制？它是如何实现的？' },
            { text: 'mysql主从同步延迟的原因和解决办法？', link: basePath + 'mysql主从同步延迟的原因和解决办法？' },
            { text: 'MySQL中如何避免单点故障？', link: basePath + 'MySQL中如何避免单点故障？' },

        ]
    },
    {
        text: 'MVCC',
        collapsed: true,
        items: [
            // 概念
            // 事务id 回滚指针 行id
            // undo log
            // read view
            // 版本链
            // RR和RC
            { text: 'MySQL中MVCC是什么？', link: basePath + 'MySQL中MVCC是什么？' },
            { text: 'MVCC解决了什么问题？', link: basePath + 'MVCC解决了什么问题？' },
            { text: '如果MySQL没有MVCC，会有什么影响？', link: basePath + '如果MySQL没有MVCC，会有什么影响？' },
            { text: '什么是当前读与快照读（一致性读）？', link: basePath + '什么是当前读与快照读（一致性读）？' },

        ]
    },
    {
        text: '锁',
        collapsed: true,
        items: [
            // MySQL中有哪些类型的锁？
            // 行级锁
            // 共享锁（S）与排他锁（X）的区别？
            // 什么是意向锁
            // 记录锁 间隙锁 临键锁
            // MySQL中如何实现乐观锁
            // 行级锁什么情况下会升级为表级锁
            // 自增锁

            { text: 'MySQL中有哪些锁类型？|MySQL中有哪几种锁？', link: basePath + 'MySQL中有哪些锁类型？' },
            { text: 'MySQL的乐观锁和悲观锁有什么区别？', link: basePath + 'MySQL的乐观锁和悲观锁有什么区别？' },
            { text: 'mysql的行锁和表锁是什么？分别在哪些情况下会出现 ？', link: basePath + 'mysql的行锁和表锁是什么？分别在哪些情况下会出现 ？' },
            { text: '行锁的原理及算法？', link: basePath + '行锁的原理及算法？' },
            { text: 'MySQL的行级锁到底锁的是什么东西？', link: basePath + 'MySQL的行级锁到底锁的是什么东西？' },
            { text: 'mysql什么情况下会产生死锁？', link: basePath + 'mysql什么情况下会产生死锁？' },
            { text: 'MySQL中如果发生死锁如何解决？', link: basePath + 'MySQL中如果发生死锁如何解决？' },
            { text: 'Mysql死锁常见解决方案？', link: basePath + 'Mysql死锁常见解决方案？' },
            { text: 'MySQL的锁，表级锁是哪一层的锁？', link: basePath + 'MySQL的锁，表级锁是哪一层的锁？' },
            { text: '为什么MyISAM不支持行锁，而InnoDB支持？', link: basePath + '为什么MyISAM不支持行锁，而InnoDB支持？' },


        ]
    },
    {
        text: '其他',
        collapsed: true,
        items: [

            { text: 'MySQL 有关权限的表都有哪几个？', link: basePath + 'MySQL 有关权限的表都有哪几个？' },

            { text: 'MySQL的查询优化器如何选择执行计划？', link: basePath + 'MySQL的查询优化器如何选择执行计划？' },
            { text: '如何实现数据库的不停服迁移？', link: basePath + '如何实现数据库的不停服迁移？' },
            { text: '什么是数据库逻辑删除？与物理删除有啥区别？', link: basePath + '什么是数据库逻辑删除？与物理删除有啥区别？' },
            { text: '什么是数据库逻辑外键？和物理外键有啥区别？', link: basePath + '什么是数据库逻辑外键？和物理外键有啥区别？' },
            { text: '什么是存储过程？有哪些优缺点？', link: basePath + '什么是存储过程？有哪些优缺点？' },
            { text: '为什么阿里手册不推荐使用存储过程？', link: basePath + '为什么阿里手册不推荐使用存储过程？' },
            { text: '什么是视图？为什么要使用视图？', link: basePath + '什么是视图？为什么要使用视图？' },
            { text: '什么是游标？', link: basePath + '什么是游标？' },


            { text: 'MySQL的存储引擎都有哪些？', link: basePath + 'MySQL的存储引擎都有哪些？' },

            { text: 'MySQL在如何解决数据深度分页的问题？', link: basePath + 'MySQL在如何解决数据深度分页的问题？' },
            { text: '什么是数据库脏页？', link: basePath + '什么是数据库脏页？' },
            { text: 'mysql的redolog是什么？', link: basePath + 'mysql的redolog是什么？' },
            { text: 'mysql的binlog是什么？', link: basePath + 'mysql的binlog是什么？' },
            { text: 'mysql的除了binlog和redolog，还有其他的什么log吗', link: basePath + 'mysql的除了binlog和redolog，还有其他的什么log吗' },
            { text: 'Mysql的binlog有哪几种格式？', link: basePath + 'Mysql的binlog有哪几种格式？' },
            { text: 'mysql的持久性是如何保证的(Redolog)？', link: basePath + 'mysql的持久性是如何保证的(Redolog)？' },
            { text: 'InnoDB存储引擎的架构？', link: basePath + 'InnoDB存储引擎的架构？' },
            { text: '从MySQL中获取数据，是从磁盘读取的吗？', link: basePath + '从MySQL中获取数据，是从磁盘读取的吗？' },
            { text: '什么是Write-Ahead-Logging（WAL）技术？它有啥优点？MySQL中是否用到了？', link: basePath + '什么是Write-Ahead-Logging（WAL）技术？它有啥优点？MySQL中是否用到了？' },
            { text: '为什么不推荐在MySQL中直接存储图片、音频、视频等大容量内容？', link: basePath + '为什么不推荐在MySQL中直接存储图片、音频、视频等大容量内容？' },
            { text: 'MySQL的Doublewriter Buffer是什么？有什么用？', link: basePath + 'MySQL的Doublewriter Buffer是什么？有什么用？' },
            { text: 'MySQL的Long Buffer是什么？有什么用？', link: basePath + 'MySQL的Long Buffer是什么？有什么用？' },
        ]
    },
]