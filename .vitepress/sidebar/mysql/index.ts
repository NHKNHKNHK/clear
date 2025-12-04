
const basePath = '/09-MySQL/'

export default [
    {
        text: '《MySQL简明教程》',
        collapsed: false,
        items: [
            {
                text: '基础',
                collapsed: false,
                items: [
                    // todo
                    { text: '多表查询', link: basePath + '多表查询' },
                    { text: '单行函数与聚合函数', link: basePath + '单行函数与聚合函数' },
                    { text: '子查询', link: basePath + '子查询' },

                    { text: 'MySQL数据类型', link: basePath + 'MySQL数据类型' },
                    { text: 'MySQL约束', link: basePath + 'MySQL约束' },
                    // todo
                    { text: 'MySQL视图', link: basePath + 'MySQL视图' },
                    { text: '存储过程与存储函数', link: basePath + '存储过程与存储函数' },
                    { text: '变量、流程控制与游标', link: basePath + '变量、流程控制与游标' },
                    { text: '触发器', link: basePath + '触发器' },
                    { text: 'MySQL8新特性', link: basePath + 'MySQL8新特性' },
                    { text: 'MySQL窗口函数', link: basePath + 'MySQL窗口函数' },
                    { text: 'MySQL公用表表达式', link: basePath + 'MySQL公用表表达式' },

                ]
            },
            {
                text: '进阶',
                collapsed: false,
                items: [
                    // todo
                    { text: 'MySQL数据目录', link: basePath + 'MySQL数据目录' },
                    { text: '用户与权限管理', link: basePath + '用户与权限管理' },

                    { text: 'MySQL逻辑架构', link: basePath + 'MySQL逻辑架构' },
                    { text: 'MySQL中的SQL执行流程', link: basePath + 'MySQL中的SQL执行流程' },
                    { text: 'MySQL书写顺序与执行顺序', link: basePath + 'MySQL书写顺序与执行顺序' },
                    { text: '数据库缓冲池（buffer pool）', link: basePath + '数据库缓冲池（buffer pool）' },
                    { text: 'MySQL存储引擎', link: basePath + 'MySQL存储引擎' },
                    {
                        text: '索引',
                        collapsed: false,
                        items: [
                            { text: '索引的数据结构', link: basePath + '索引的数据结构' },
                            { text: 'MySQL聚簇索引与非聚簇索引', link: basePath + 'MySQL聚簇索引与非聚簇索引' },
                            { text: 'InnoDB的B+树索引的注意事项', link: basePath + 'InnoDB的B+树索引的注意事项' },
                            { text: 'MyIASM中的索引方案', link: basePath + 'MyIASM中的索引方案' },
                            { text: 'MySQL数据结构选择的合理性', link: basePath + 'MySQL数据结构选择的合理性' },

                            { text: 'MySQL有哪些索引类型？（索引分类）', link: basePath + 'MySQL有哪些索引类型？（索引分类）' },
                            { text: '创建、查看、删除索引', link: basePath + '创建、查看、删除索引' },
                            { text: 'MySQL8.0索引新特性', link: basePath + 'MySQL8.0索引新特性' },
                            { text: '索引设计原则', link: basePath + '索引设计原则', },
                            { text: '哪些情况适合创建索引', link: basePath + '哪些情况适合创建索引' },
                            { text: '哪些情况不适合创建索引', link: basePath + '哪些情况不适合创建索引' },
                            { text: '索引设计原则', link: basePath + '索引设计原则' },
                            { text: '哪些情况适合创建索引', link: basePath + '哪些情况适合创建索引' },
                            { text: '哪些情况不适合创建索引', link: basePath + '哪些情况不适合创建索引' },
                        ],
                    },

                    // todo
                    { text: 'InnoDB数据页结构', link: basePath + 'InnoDB数据页结构' },

                    { text: '性能分析工具的使用', link: basePath + '性能分析工具的使用' },
                    { text: '索引优化与查询优化', link: basePath + '索引优化与查询优化' },
                    { text: '主键如何设计', link: basePath + '主键如何设计' },
                    { text: '数据库的设计规范', link: basePath + '数据库的设计规范' },
                    { text: '数据库其他调优策略', link: basePath + '数据库其他调优策略' },
                    { text: '事务基础', link: basePath + '事务基础' },
                    { text: 'MySQL事务日志', link: basePath + 'MySQL事务日志' },
                    { text: 'MySQL锁', link: basePath + 'MySQL锁' },
                    { text: 'MVCC', link: basePath + 'MVCC' },
                ]
            },
            {
                text: '运维',
                collapsed: false,
                items: [
                    { text: '数据库日志', link: basePath + '数据库日志' },
                    // todo
                    { text: '备份与恢复', link: basePath + '备份与恢复' },
                    { text: '主从复制', link: basePath + '主从复制' },
                ]
            }
        ]
    },
    {
        text: '基础',
        collapsed: false,
        items: [
            { text: 'MySQL', link: basePath + '' },

            { text: 'MySQL使用规范你觉得都有什么？', link: basePath + 'MySQL使用规范你觉得都有什么？' },
            { text: '创建数据库表要注意什么？', link: basePath + '创建数据库表要注意什么？' },
            { text: '数据库的三大范式是什么？', link: basePath + '数据库的三大范式是什么？' },
            { text: '什么是反三范式？', link: basePath + '什么是反三范式？' },

            { text: 'MySQL中主键自增（auto_increment）列到达最大值时会发生什么？你会怎么调整', link: basePath + 'MySQL中主键自增（auto_increment）列到达最大值时会发生什么？你会怎么调整' },
            { text: 'drop、delete与truncate的区别？', link: basePath + 'drop、delete与truncate的区别？' },
            { text: 'MySQL中exists和in的区别？', link: basePath + 'MySQL中exists和in的区别？' },
            { text: '多表查询分类', link: basePath + '多表查询分类' },
            { text: 'MySQL在inner join、left join、right join的区别是什么？', link: basePath + 'MySQL在inner join、left join、right join的区别是什么？' },
            { text: '为什么SQL语句不建议过多使用多表join', link: basePath + '为什么SQL语句不建议过多使用多表join' },
            { text: 'MySQL的Hash Join是什么？', link: basePath + 'MySQL的Hash Join是什么？' },
            { text: 'on和where的区别', link: basePath + 'on和where的区别' },
            { text: 'MySQL中数据排序的实现原理是什么？', link: basePath + 'MySQL中数据排序的实现原理是什么？' },
            { text: 'MySQL中一条查询语句是如何执行的？', link: basePath + 'MySQL中一条查询语句是如何执行的？' },
            { text: 'MySQL中一条更新语句是如何执行的？', link: basePath + 'MySQL中一条更新语句是如何执行的？' },
            { text: 'union和union all区别？', link: basePath + 'union和union all区别？' },


            { text: 'Mysql语句都有哪些种类？', link: basePath + 'Mysql语句都有哪些种类？' },
            { text: 'Mysql查询优化建议？', link: basePath + 'Mysql查询优化建议？' },
            { text: 'SQL中PK、UK、CK、FK、DF是什么意思？', link: basePath + 'SQL中PK、UK、CK、FK、DF是什么意思？' },


        ]
    },
    {
        text: '进阶',
        collapsed: false,
        items: [

            { text: '什么是buffer pool', link: basePath + '什么是bufferpool' },
            { text: 'buffer pool的读写流程', link: basePath + 'bufferpool的读写流程' },
            { text: '多个buffer pool实例是否引发并发问题', link: basePath + '多个bufferpool实例是否引发并发问题' },
            { text: 'buffer pool与query cache的区别', link: basePath + 'bufferpool与querycache的区别' },
            { text: 'MySQL为什么会有存储碎片？有什么危害？', link: basePath + 'MySQL为什么会有存储碎片？有什么危害？' },
        ],
    },
    {
        text: '数据类型与函数',
        collapsed: false,
        items: [
            { text: 'MySQL的常用数据类型', link: basePath + 'MySQL的常用数据类型' },
            { text: 'char和varchar的区别', link: basePath + 'char和varchar的区别' },
            { text: 'MySQL中varchar(100)和varchar(10)的区别？', link: basePath + 'MySQL中varchar(100)和varchar(10)的区别？' },
            { text: 'MySQL中text类型最大可以存储多长的文本？', link: basePath + 'MySQL中text类型最大可以存储多长的文本？' },
            { text: 'mysql的blob和text有什么区别', link: basePath + 'mysql的blob和text有什么区别' },
            { text: 'MySQL中int(1)和int(11)的区别', link: basePath + 'MySQL中int(1)和int(11)的区别' },
            { text: 'MySQL中tinyint的默认位数', link: basePath + 'MySQL中tinyint的默认位数' },
            { text: 'Mysql的常用函数有哪些？', link: basePath + 'Mysql的常用函数有哪些？' },
            { text: 'MySQL中count(*)、count(1)和count(字段名)有什么区别？', link: basePath + 'MySQL中countx、count1和count字段名有什么区别？' },
            { text: 'MySQL中datetime和timestamp类型的区别？', link: basePath + 'MySQL中datetime和timestamp类型的区别？' },
            { text: '在MySQL中，你使用过哪些函数？常用函数？', link: basePath + '在MySQL中，你使用过哪些函数？常用函数？' },
            { text: '在MySQL存储金额数据，应该使用什么数据类型？', link: basePath + '在MySQL存储金额数据，应该使用什么数据类型？' },

        ]
    },
    {
        text: '索引',
        collapsed: false,
        items: [
            // 聚集索引
            // 非聚集索引
            // 回表查询
            // 覆盖索引
            // 前缀索引
            // 复合索引
            // 索引下推
            { text: '什么是索引？有什么用？', link: basePath + '什么是索引？有什么用？' },

            { text: 'InnoDB的数据页和B+树的关系', link: basePath + 'InnoDB的数据页和B+树的关系' },
            { text: '什么是InnoDB的页分裂和页合并', link: basePath + '什么是InnoDB的页分裂和页合并' },
            { text: '什么是回表查询，怎么减少回表次数？', link: basePath + '什么是回表查询，怎么减少回表次数？' },

            { text: '为什么聚集索引，不要选择频繁更新的列？', link: basePath + '为什么聚集索引，不要选择频繁更新的列？' },

            { text: 'InnoDB中的索引类型？', link: basePath + 'InnoDB中的索引类型？' },
            { text: '在不同存储引擎中索引的落地方式？', link: basePath + '在不同存储引擎中索引的落地方式？' },
            { text: '什么情况下应不建或少建索引？', link: basePath + '什么情况下应不建或少建索引？' },
            { text: '在建立索引的时，需要考虑哪些因素？', link: basePath + '在建立索引的时，需要考虑哪些因素？' },

            { text: 'MySQL中建立索引需要注意什么？', link: basePath + 'MySQL中建立索引需要注意什么？' },
            { text: 'MySQL常见索引失效的情况？', link: basePath + 'MySQL常见索引失效的情况？' },
            { text: 'MySQL在使用索引一定有效吗？如何排查索引效果？', link: basePath + 'MySQL在使用索引一定有效吗？如何排查索引效果？' },
            { text: 'MySQL中索引数量是否越多越好？为什么？', link: basePath + 'MySQL中索引数量是否越多越好？为什么？' },
            { text: '在什么情况下，不推荐为数据库建立索引？', link: basePath + '在什么情况下，不推荐为数据库建立索引？' },

            { text: 'MySQL索引最左前缀匹配原则？', link: basePath + 'MySQL索引最左前缀匹配原则？' },
            { text: 'MySQL索引一定遵循最左前缀匹配吗？', link: basePath + 'MySQL索引一定遵循最左前缀匹配吗？' },

            { text: 'MySQL的主键一定是自增的吗？', link: basePath + 'MySQL的主键一定是自增的吗？' },
            { text: 'InnoDB为什么使用B+树实现索引？', link: basePath + 'InnoDB为什么使用B+树实现索引？' },

            { text: '什么是Hash索引', link: basePath + '什么是hash索引？' },
            { text: 'Hash索引和B+树索引的区别', link: basePath + 'Hash索引和B+树索引的区别' },
            { text: 'InnoDB到底支不支持哈希索引呢？', link: basePath + 'InnoDB到底支不支持哈希索引呢？' },
            { text: '什么是自适应Hash索引', link: basePath + '什么是自适应Hash索引' },

            { text: '什么是唯一索引？', link: basePath + '什么是唯一索引？' },
            { text: '唯一索引和主键索引的区别？', link: basePath + '唯一索引和主键索引的区别？' },
            { text: 'MySQL是如何保证唯一性索引的唯一性的？', link: basePath + 'MySQL是如何保证唯一性索引的唯一性的？' },
            { text: '唯一索引比普通索引快吗？', link: basePath + '唯一索引比普通索引快吗？' },

            { text: '什么是mysql的三星索引？', link: basePath + '什么是mysql的三星索引？' },

            { text: 'MySQL的explain有哪些字段？哪些是主要的？', link: basePath + 'MySQL的explain有哪些字段？哪些是主要的？' },
            { text: '如何使用MySQL中的explain语句进行查询分析？', link: basePath + '如何使用MySQL中的explain语句进行查询分析？' },
            { text: '用explain分析举一个具体的例子？', link: basePath + '用explain分析举一个具体的例子？' },

            { text: '什么是联合索引（复合索引）？', link: basePath + '什么是联合索引（复合索引）？' },
            { text: 'MySQL的覆盖索引？', link: basePath + 'MySQL的覆盖索引？' },
            { text: '什么是前缀索引？', link: basePath + '什么是前缀索引？' },
            { text: '什么是索引下推？', link: basePath + '什么是索引下推？' },
            { text: 'A,B,C三个字段组成联合索引，AB,AC,BC三种情况下查询是否能命中索引？', link: basePath + 'A,B,C三个字段组成联合索引，AB,AC,BC三种情况下查询是否能命中索引？' },
            { text: 'where条件的顺序影响使用索引吗？', link: basePath + 'where条件的顺序影响使用索引吗？' },

            { text: 'B+树索引和哈希索引的区别？', link: basePath + 'B+树索引和哈希索引的区别？' },
            { text: '哈希索引的优势及不适用的场景？', link: basePath + '哈希索引的优势及不适用的场景？' },
            { text: 'B树和B+树的区别', link: basePath + 'B树和B+树的区别' },
            { text: '为什么说B+比B树更适合实际应用中作为数据库索引？', link: basePath + '为什么说B+比B树更适合实际应用中作为数据库索引？' },
            { text: 'b树和b+简述MySQL的b+树查询数据的全过程？', link: basePath + '简述MySQL的b+树查询数据的全过程？' },
            { text: '为什么MySQL选择使用B+树作为索引结构？', link: basePath + '为什么MySQL选择使用B+树作为索引结构？' },

            { text: '索引跳跃扫描', link: basePath + '索引跳跃扫描' },
            { text: '什么是索引合并', link: basePath + '什么是索引合并' },


        ]
    },

    {
        text: '存储引擎',
        collapsed: true,
        items: [


            { text: 'MySQL的存储引擎有哪些？有什么区别？', link: basePath + 'MySQL的存储引擎有哪些？有什么区别？' },
            { text: 'MySQL的InnoDB和MyISAM的区别', link: basePath + 'MySQL的InnoDB和MyISAM的区别' },
            { text: 'MySQL中InnoDB和MyISAM的如何选择', link: basePath + 'MySQL中InnoDB和MyISAM的如何选择' },
            { text: '存储引擎应该如何选择？', link: basePath + '存储引擎应该如何选择？' },
            { text: 'InnoDB引擎的4大特性？', link: basePath + 'InnoDB引擎的4大特性？' },
            { text: 'InnoDB 的双写缓冲是什么？', link: basePath + 'InnoDB 的双写缓冲是什么？' },
            { text: 'MyISAM Static 和 MyISAM Dynamic 有什么区别？', link: basePath + 'MyISAM Static 和 MyISAM Dynamic 有什么区别？' },
            { text: 'InnoDB的一次更新事务是怎么实现的？', link: basePath + 'InnoDB的一次更新事务是怎么实现的？' },

        ]
    },
    {
        text: '事务',
        collapsed: false,
        items: [
            { text: 'MySQL事务的四大特性', link: basePath + 'MySQL事务的四大特性' },
            { text: '什么是脏读、幻读、不可重复读？', link: basePath + '什么是脏读、幻读、不可重复读？' },
            { text: '不可重复读和幻读有什么区别', link: basePath + '不可重复读和幻读有什么区别' },
            { text: 'innoDB如何解决幻读？', link: basePath + 'innoDB如何解决幻读？' },
            { text: 'MySQL的事务隔离级别？', link: basePath + 'MySQL的事务隔离级别？' },
            { text: 'MySQL默认事务隔离级别是什么？为什么选这个级别？', link: basePath + 'MySQL默认事务隔离级别是什么？为什么选这个级别？' },
            { text: '你们生产环境的MySQL中使用了什么事务隔离级别？为什么？', link: basePath + '你们生产环境的MySQL中使用了什么事务隔离级别？为什么？' },

            { text: 'MySQL中SELECT会用到事务吗', link: basePath + 'MySQL中SELECT会用到事务吗' },
            { text: '为什么默认RR，大厂要改成RC', link: basePath + '为什么默认RR，大厂要改成RC' },

            { text: 'MySQL是如何实现事务的？', link: basePath + 'MySQL是如何实现事务的？' },
            { text: 'MySQL中大事务会有哪些影响？', link: basePath + 'MySQL中大事务会有哪些影响？' },
            { text: 'MySQL中长事务可能会导致哪些问题？', link: basePath + 'MySQL中长事务可能会导致哪些问题？' },

        ]
    },
    {
        text: '场景',
        collapsed: false,
        items: [
            // 冷热分离怎么做
            // 索引失效场景？
            { text: '怎么做数据冷热分离？', link: basePath + '怎么做数据冷热分离？' },
            { text: 'MySQL数据库的性能优化方法有哪些？', link: basePath + 'MySQL数据库的性能优化方法有哪些？' },
            { text: 'MySQL如何进行SQL调优？', link: basePath + 'MySQL如何进行SQL调优？' },
            { text: '相比Oracle，MySQL的优势有哪些？', link: basePath + '相比Oracle，MySQL的优势有哪些？' },
            { text: '慢SQL优化思路？', link: basePath + '慢SQL优化思路？' },
            { text: '如何在MySQL中监控和优化慢SQL？', link: basePath + '如何在MySQL中监控和优化慢SQL？' },
            { text: 'MySQL中`limit 1000000,10`和`limit 10`的执行速度是否相同？', link: basePath + 'MySQL中`limit 1000000,10`和`limit 10`的执行速度是否相同？' },
            { text: 'MySQL中如何解决数据深度分页的问题？', link: basePath + 'MySQL中如何解决数据深度分页的问题？' },
            { text: '单个索引的大小会对B+树造成什么影响？', link: basePath + '单个索引的大小会对B+树造成什么影响？' },
            { text: 'MySQL是否支持存储emoji', link: basePath + 'MySQL是否支持存储emoji' },

            { text: 'MySQL用了函数一定会索引失效吗', link: basePath + 'MySQL用了函数一定会索引失效吗' },
            { text: 'a,b两个索引，where条件中同时使用a和b会选择哪个索引？', link: basePath + 'a,b两个索引，where条件中同时使用a和b会选择哪个索引？' },
            { text: 'MySQL为什么会选错索引，如何解决？', link: basePath + 'MySQL为什么会选错索引，如何解决？' },
            { text: '索引失效的问题是如何排查的，有那些种情况？', link: basePath + '索引失效的问题是如何排查的，有那些种情况？' },

            { text: 'MySQL为什么会有存储碎片？有什么危害？', link: basePath + 'MySQL为什么会有存储碎片？有什么危害？' }
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

            { text: 'MySQL中有哪些锁类型？', link: basePath + 'MySQL中有哪些锁类型？' },
            { text: 'MySQL的乐观锁和悲观锁？如何实现', link: basePath + 'MySQL的乐观锁和悲观锁？如何实现' },
            { text: 'mysql的行锁和表锁是什么？分别在哪些情况下会出现 ？', link: basePath + 'mysql的行锁和表锁是什么？分别在哪些情况下会出现 ？' },
            { text: 'InnoDB中的表级锁、页级锁、行级锁？', link: basePath + 'InnoDB中的表级锁、页级锁、行级锁？' },
            { text: '行锁的原理及算法？', link: basePath + '行锁的原理及算法？' },
            { text: 'MySQL的行级锁到底锁的是什么东西', link: basePath + 'MySQL的行级锁到底锁的是什么东西' },
            { text: 'mysql什么情况下会产生死锁？', link: basePath + 'mysql什么情况下会产生死锁？' },
            { text: 'MySQL中如果发生死锁如何解决？', link: basePath + 'MySQL中如果发生死锁如何解决？' },
            { text: 'Mysql死锁常见解决方案？', link: basePath + 'Mysql死锁常见解决方案？' },
            { text: 'MySQL的锁，表级锁是哪一层的锁？', link: basePath + 'MySQL的锁，表级锁是哪一层的锁？' },
            { text: '为什么MyISAM不支持行锁，而InnoDB支持？', link: basePath + '为什么MyISAM不支持行锁，而InnoDB支持？' },


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
        text: '其他',
        collapsed: true,
        items: [

            { text: 'MySQL的数据目录', link: basePath + 'MySQL的数据目录' },
            { text: 'MySQL 有关权限的表都有哪几个？', link: basePath + 'MySQL 有关权限的表都有哪几个？' },

            { text: 'MySQL的查询优化器如何选择执行计划？', link: basePath + 'MySQL的查询优化器如何选择执行计划？' },
            { text: '如何实现数据库的不停服迁移？', link: basePath + '如何实现数据库的不停服迁移？' },
            { text: '什么是数据库逻辑删除？与物理删除有啥区别？', link: basePath + '什么是数据库逻辑删除？与物理删除有啥区别？' },
            { text: '什么是数据库逻辑外键？和物理外键有啥区别？', link: basePath + '什么是数据库逻辑外键？和物理外键有啥区别？' },
            { text: '什么是存储过程？有哪些优缺点？', link: basePath + '什么是存储过程？有哪些优缺点？' },
            { text: '为什么阿里手册不推荐使用存储过程？', link: basePath + '为什么阿里手册不推荐使用存储过程？' },
            { text: '什么是视图？为什么要使用视图？', link: basePath + '什么是视图？为什么要使用视图？' },
            { text: '什么是游标？', link: basePath + '什么是游标？' },

            { text: 'MySQL在如何解决数据深度分页的问题？', link: basePath + 'MySQL在如何解决数据深度分页的问题？' },
            { text: '什么是数据库脏页？', link: basePath + '什么是数据库脏页？' },
            { text: 'mysql的binlog是什么？', link: basePath + 'mysql的binlog是什么？' },
            { text: 'mysql的redolog是什么？', link: basePath + 'mysql的redolog是什么？' },
            { text: 'mysql的除了binlog和redolog，还有其他的什么log吗', link: basePath + 'mysql的除了binlog和redolog，还有其他的什么log吗' },
            { text: 'binlog、redolog和undolog区别', link: basePath + 'binlog、redolog和undolog区别' },
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
    {
        text: '优化',
        collapsed: false,
        items: [


        ]
    }
]