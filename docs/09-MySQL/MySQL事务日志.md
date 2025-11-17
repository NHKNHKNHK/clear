# MySQL事务日志

事务有4种特性：原子性、一致性、隔离性和持久性。那么事务的四种特性到底是基于什么机制实现呢？

- 事务的`隔离性`由`锁机制`实现。
- 而事务的`原子性`、`一致性`和`持久性`由事务的redo log和undo log来保证。
  - REDO LOG 称为`重做日志`，提供再写入操作，恢复提交事务修改的页操作，用来保证事务的持久性。
  - UNDO LOG 称为`回滚日志`，回滚行记录到某个特定版本，用来保证事务的原子性、一致性。

有的 DBA 或许会认为 UNDO 是 REDO 的逆过程，其实不然。REDO 和 UNDO 都可以视为是一种`恢复操作`，但是：

- redo log：是存储引擎层 (innodb) 生成的日志，记录的是 `物理级别` 上的页修改操作，比如页号 xxx、偏移量 yyy 写入了 'zzz' 数据。主要为了保证数据的可靠性；
- undo log：是存储引擎层 (innodb) 生成的日志，记录的是 `逻辑操作` 日志，比如对某一行数据进行了 INSERT 语句操作，那么 undo log 就记录一条与之相反的 DELETE 操作。主要用于`事务的回滚`(undo log 记录的是每个修改操作的`逆操作`) 和`一致性非锁定读`(undo log在一致性非锁定读中的作用：回滚行记录到某种特定的版本 ---**MVCC**，即多版本并发控制)。

## redo日志

InnoDB 存储引擎是以`页为单位`来管理存储空间的。在真正访问页面之前，需要把在`磁盘`上的页缓存到内存中的`Buffer Pool`之后才可以访问。所有的变更都必须`先更新缓冲池`中的数据，然后缓冲池中的`脏页`会以一定的频率被刷入磁盘（`checkPoint 机制`），通过缓冲池来优化 CPU 和磁盘之间的鸿沟，这样就可以保证整体的性能不会下降太快。

### 为什么需要redo日志

一方面，缓冲池可以帮助我们消除CPU和磁盘之间的鸿沟，checkpoint机制可以保证数据的最终落盘，然而由于checkpoint`并不是每次变更的时候就触发`的，而是master线程隔一段时间去处理的。所以最坏的情况就是事务提交后，刚写完缓冲池，数据库宕机了，那么这段数据就是丢失的，无法恢复。

另一方面，事务包含`持久性`的特性，就是说对于一个已经提交的事务，在事务提交后即使系统发生了崩溃，这个事务对数据库中所做的更改也不能丢失。

**那么如何保证这个持久性呢？**

`一个简单的做法`：在事务提交完成之前把该事务所修改的所有页面都刷新到磁盘，但是这个简单粗暴的做法有些问题

- **修改量与刷新磁盘工作量严重不成比例**
  - 有时候我们仅仅修改了某个页面中的一个字节，但是我们知道在 InnoDB 中是以页为单位来进行磁盘 IO 的，也就是说我们在该事务提交时不得不将一个完整的页面从内存中刷新到磁盘，我们又知道一个页面默认是 16KB 大小，只修改一个字节就要刷新 16KB 的数据到磁盘上显然是太小题大做了。
  - 比如：我们只是想修改某一个员工的薪资，却要修改一个数据页
- **随机 IO 刷新较慢**
  - 一个事务可能包含很多语句，即使是一条语句也可能修改许多页面，假如该事务修改的这些页面可能并不相邻，这就意味着在将某个事务修改的 Buffer Pool 中的页面**刷新到磁盘**时，需要进行很多的**随机 IO**，随机 IO 比顺序 IO 要慢，尤其对于传统的机械硬盘来说。 
  - 比如：我们想修改某一批员工的薪资，员工信息可能保存在若干个数据页中，就要去修改多个数据页

`另一个解决的思路`：我们只是想让已经提交了的事务对数据库中数据所做的修改永久生效，即使后来系统崩溃，在重启后也能把这种修改恢复出来。所以我们其实没有必要在每次事务提交时就把该事务在内存中修改过的全部页面刷新到磁盘，只需要把`修改`了哪些东西`记录一下`就好。比如，某个事务将系统表空间中`第10号`页面中偏移量为`100`处的那个字节的值`1`改成`2`。我们只需要记录一下：将第0号表空间的10号页面的偏移量为100处的值更新为 2 。

InnoDB 引擎的事务采用了 WAL 技术（`Write-Ahead Logging`），这种技术的思想就是`先写日志`，再写磁盘，只有日志写入成功，才算事务提交成功，这里的日志就是 redo log。当发生宕机且数据未刷到磁盘的时候，可以通过 redo log 来恢复，保证 ACID 中的 D，这就是 redo log 的作用。

![](./assets/redo-1.png)



### redo日志的好处、特点

**好处**

- **redo日志降低了刷盘频率**
- **redo日志占用的空间非常小**

存储表空间 ID、页号、偏移量以及需要更新的值，所需的存储空间是很小的，刷盘快。

**特点**

- **redo日志是顺序写入磁盘的**

在执行事务的过程中，每执行一条语句，就可能产生若干条 redo 日志，这些日志是按照`产生的顺序写入磁盘的`，也就是使用顺序 IO，效率比随机 IO 快。

- **事务执行过程中，redo log不断记录**

>   这里先简单说一下redo log 与 bin log 的区别：
>
>   - redo log 是`存储引擎层`产生的，而 bin log 是`数据库层`产生的。
>   - 假设一个事务，对表做 10 万行的记录插入，在这个过程中，一直不断的往 redo log 顺序记录，而 bin log 不会记录，直到这个事务提交，才会一次写入到 bin log 文件中。



### redo的组成

Redo log可以简单分为以下两个部分：

- `重做日志的缓冲 (redo log buffer) `，保存在内存中，是易失的。

在服务器启动时就向操作系统申请了一大片称之为 redo log buffer 的`连续内存`空间，翻译成中文就是 redo 日志缓冲区。这片内存空间被划分成若干个连续的`redo log block`。一个 redo log block 占用`512 字节`大小。


![](./assets/redo-log-buffer-示例图.png)

**参数设置：innodb_log_buffer_size：**

redo log buffer 大小，默认`16M`，最大值是4096M，最小值为1M。

```sql
mysql> show variables like '%innodb_log_buffer_size%';
+------------------------+----------+
| Variable_name          | Value    |
+------------------------+----------+
| innodb_log_buffer_size | 16777216 |
+------------------------+----------+
```

- `重做日志文件 (redo log file)`，保存在硬盘中，是持久的。

redo日志文件默认存储在MySQL的数据目录（`/var/lib/mysql/`）中，其中的 `ib_logfile0` 和 `ib_logfile1` 即为 REDO 日志。



### redo的整体流程

以一个更新的事务为例，redo log流转过程，如下图所示：

![](./assets/redo-整体流程.png)

第1步：先将原始数据从磁盘中读入内存中来，修改数据的内存拷贝 

第2步：生成一条重做日志并写入redo log buffer，记录的是数据被修改后的值 

第3步：当事务commit时，将redo log buffer中的内容刷新到 redo log file，对 redo log file采用追加写的方式 

第4步：定期将内存中修改的数据刷新到磁盘中

> 体会：
>
> Write-Ahead Log(预先日志持久化)：在持久化一个数据页之前，先将内存中相应的日志页持久化。



了解了redo的整体流程之后，我们特别关系`redo log buffer -> redo log file`的数据流转过程，只是数据真正刷盘，才能保证数据不丢。下面就来看一下redo log buffer的刷盘过程

### redo log的刷盘策略

redo log的写入并不是直接写入磁盘的，InnoDB引擎会在写redo log的时候先写redo log buffer，之后以`一定的频率`刷入到真正的 redo log file 中。

那么**这里的一定频率怎么看待呢？**这就是我们要说的刷盘策略。

![alt text](./assets/redo-log-buffer-刷盘策略.png)

特别注意！！！redo log buffer刷盘到redo log file的过程并不是真正的刷到磁盘中去，只是刷入到`文件系统缓存`（page cache）中去（这是现代操作系统为了提高文件写入效率做的一个优化），真正的写入会交给系统自己来决定（比如page cache足够大了）。

那么对于InnoDB来说就存在一个问题，如果交给系统来同步，同样如果系统宕机，那么数据也丢失了（虽然整个系统宕机的概率还是比较小的）。

针对这种情况，InnoDB给出`innodb_flush_log_at_trx_commit`参数，该参数控制 commit提交事务时，如何将 redo log buffer 中的日志刷新到 redo log file 中。它支持三种策略：

- `设置为0`：表示每次事务提交时不进行刷盘操作。（系统默认master thread每隔1s进行一次重做日志的同步）
- `设置为1`：表示每次事务提交时都将进行同步，刷盘操作（`默认值`） 
- `设置为2`：表示每次事务提交时都只把 redo log buffer 内容写入 page cache，不进行同步。由os自己决定什么时候同步到磁盘文件。

```sql
mysql> show variables like 'innodb_flush_log_at_trx_commit';
+--------------------------------+-------+
| Variable_name                  | Value |
+--------------------------------+-------+
| innodb_flush_log_at_trx_commit | 1     |
+--------------------------------+-------+
```

另外，InnoDB 存储引擎有一个后台线程，每隔 `1 秒`，就会把 `redo log buffer` 中的内容写到文件系统缓存（`page cache`），然后调用刷盘操作。如下：

![](./assets/redo-log-buffer-page-cache.png)

也就是说，一个没有提交的事务的`redo log`记录，也可能会刷盘。因为在事务执行过程中，redo log记录是会写入到`redo log buffer`中的，这些redo log记录会被`后台线程`刷盘。

![](./assets/redo-log-buffer-page-cache-2.png)

除了后台线程每秒 `1 次` 的轮询操作，还有一种情况，当 `redo log buffer` 占用的空间即将达到 `innodb_log_buffer_size`（这个参数默认是 16M）的一半的时候，后台线程会主动刷盘。






### 不同刷盘策略演示

#### **流程图**

![](./assets/redo-log-buffer-刷盘1.png)

`innodb_flush_log_at_trx_commit=1`

- 为 1 时，只要事务提交成功，redo log 记录就一定在硬盘里，不会有任何数据丢失。
- 如果事务执行期间 MySQL 挂了或宕机，这部分日志丢了，但是事务并没有提交，所以日志丢了也不会有损失。可以保证 ACID 的 D，数据绝对不会丢失，但是效率最差的。
- 建议使用默认值，虽然操作系统宕机的概率理论小于数据库宕机的概率，但是一般既然使用了事务，那么数据的安全相对来说更重要些。

![](./assets/redo-log-buffer-刷盘2.png)

`innodb_flush_log_at_trx_commit=2`

- 为 2 时，只要事务提交成功，redo log buffer 中的内容只写入文件系统缓存（page cache）。
- 如果仅仅只是 MySQL 挂了不会有任何数据丢失，但是操作系统宕机可能会有 1 秒数据的丢失，这种情况下无法满足 ACID 中的 D。但是数值 2 肯定是效率最高的。

![](./assets/redo-log-buffer-刷盘3.png)

`innodb_flush_log_at_trx_commit=0`

- 为 0 时，master thread 中每 1 秒进行一次重做日志的 fsync 操作，因此实例 crash 最多丢失 1 秒钟内的事务。（master thread 是负责将缓冲池中的数据异步刷新到磁盘，保证数据的一致性）
- 数值 0 的话，是一种折中的做法，它的 IO 效率理论是高于 1 的，低于 2 的，这种策略也有丢失数据的风险，也无法保证 D。

#### 举例

比较 `innodb_flush_log_at_trx_commit` 设置不同值对事务的影响。

1、创建表

```sql
CREATE TABLE test_load(a INT,b CHAR(80))ENGINE=INNODB;
```

2、创建存储过程，用于向 test_load 中添加数据

```sql
DELIMITER //
CREATE PROCEDURE p_load(COUNT INT UNSIGNED)
BEGIN
    DECLARE s INT UNSIGNED DEFAULT 1;
    DECLARE c CHAR(80) DEFAULT REPEAT('a',80);
    WHILE s<=COUNT DO
    INSERT INTO test_load SELECT NULL,c;
    COMMIT;
    SET s=s+1;
    END WHILE;
END
//DELIMITER;
```

存储过程代码中，每插入一条数据就进行一次显式的 COMMIT 操作。

在默认的设置下，即参数 `innodb_flush_log_at_trx_commit` 为 1 的情况下，InnoDB 存储引擎会将重做日志缓冲中的日志写入文件，并调用一次 fsync 操作。

执行命令 CALL p_load（30000），向表中插入 3 万行的记录，并执行 3 万次的 fsync 操作。在默认情况下所需的时间：

```sql
mysql>CALL p_load(30000);
Query OK,0 rows affected(1 min 23 sec)
```

`1 min 23 sec`的时间显然是不能接受的。而造成时间比较长的原因就在于 fsync 操作所需的时间。

下面修改参数 `innodb_flush_log_at_trx_commit`，分别设置为 0、2：

```sql
TRUNCATE TABLE test_load

-- 设置并查看：innodb_flush_log_at_trx_commit
set GLOBAL innodb_flush_log_at_trx_commit = 1;

SHOW VARIABLES LIKE 'innodb_flush_log_at_trx_commit';


-- 调用存储过程
CALL p_load (30000);  
```

最终执行时间如下表格：

| innodb_flush_log_at_trx_commit | 执行所用的时间 |
| ------------------------------ | -------------- |
| 0                              | 38.709 秒      |
| 1                              | 1 分 23 秒     |
| 2                              | 46.016 秒      |

而针对上述存储过程，为了提高事务的提交性能，应该在将 3 万行记录插入表后进行一次的 COMMIT 操作，而不是每插入一条记录后进行一次 COMMIT 操作。这样做的好处是可以使事务方法在 rollback 时回滚到事务最开始的确定状态。

> 需要说明的是，虽然用户可以通过设置参数 innodb_flush_log_at_trx_commit 为 0 或 2 来提高事务提交的性能，但需清楚，这种设置方法丧失了事务的 ACID 特性。


### 写入redo log buffer过程

#### 1.补充概念：Mini-Transaction

MySQL 把对底层页面中的一次原子访问的过程称之为一个 `Mini-Transaction`，简称 `mtr`，比如，向某个索引对应的 B+树中插入一条记录的过程就是一个 `Mini-Transaction`。一个所谓的 mtr 可以包含一组 redo 日志，在进行崩溃恢复时这一组 redo 日志作为一个不可分割的整体。

> 因为插入一条记录，可能会涉及到页分裂，所以一个 mtr 可以包含多个 redo 日志。也就是一组 redo 日志

一个事务可以包含若干条语句，每一条语句其实是由若干个`mtr`组成，每一个`mtr`又可以包含若干条redo日志，画个图表示它们的关系就是这样：

![](./assets/redo-log-mtr.png)

#### 2.日志写入log buffer

向 `log buffer` 中写入 redo 日志的过程是顺序的，也就是先往前边的 block 中写，当该 block 的空闲空间用完之后再往下一个 block 中写。当我们想往 log buffer 中写入 redo 日志时，第一个遇到的问题就是应该写在哪个 `block` 的哪个偏移量处，所以 InnoDB 的设计者特意提供了一个称之为 `buf_free` 的全局变量，该变量指明后续写入的 redo 日志应该写入到 log buffer 中的哪个位置，如图所示：

![](./assets/redo-log写入redo-buffer.png)

一个 mtr 执行过程中可能产生若干条 redo 日志，`这些 redo 日志是一个不可分割的组`，所以其实并不是每生成一条 redo 日志，就将其插入到 log buffer 中，而是每个 mtr 运行过程中产生的日志先暂时存到一个地方，当该 mtr 结束的时候，将过程中产生的一组 redo 日志再全部复制到 log buffer 中。我们现在假设有两个名为 `T1`、`T2` 的事务，每个事务都包含 2 个 mtr，我们给这几个 mtr 命名一下：

- 事务 `T1` 的两个 `mtr` 分别称为 `mtr_T1_1` 和 `mtr_T1_2`。
- 事务 `T2` 的两个 `mtr` 分别称为 `mtr_T2_1` 和 `mtr_T2_2`。

每个 mtr 都会产生一组 redo 日志，用示意图来描述一下这些 mtr 产生的日志情况：

![](./assets/redo-log-mtr-2.png)

不同的事务可能是`并发`执行的，所以`事务T1`、`事务T2`之间的`mtr`可能是`交替执行`的。

每当一个 mtr 执行完成时，伴随该 mtr 生成的一组 redo 日志就需要被复制到 log buffer 中，也就是说不同事务的 mtr 可能是交替写入 log buffer 的，我们画个示意图（为了美观，我们把一个 mtr 中产生的所有的 redo 日志当作一个整体来画）：

![](./assets/redo-log-mtr-3.png)

有的 mtr 产生的 redo 日志量非常大，比如 mtr_t1_2 产生的 redo 日志占用空间比较大，占用了 3 个 block 来存储。

#### 3.redo log block的结构图

一个 redo log block 是由`日志头`、`日志体`、`日志尾`组成。日志头占用 12 字节，日志尾占用 8 字节，所以一个 block 真正能存储的数据就是 512-12-8=492 字节。

![](./assets/redo-log-block结构图-1.png)

:::tip

**为什么一个 block 设计成 512 字节？**

这个和磁盘的扇区有关，机械磁盘默认的扇区就是 512 字节，如果你要写入的数据大于 512 字节，那么要写入的扇区肯定不止一个，这时就要涉及到盘片的转动，找到下一个扇区。

假设现在需要写入两个扇区 A 和 B，如果扇区 A 写入成功，而扇区 B 写入失败，那么就会出现`非原子性`的写入，而如果每次只写入和扇区的大小一样的 512 字节，那么每次的写入都是原子性的。

:::

真正的 redo 日志都是存储到占用 `496` 字节大小的 `log block body` 中，图中的 `log block header`和 `log block trailer` 存储的是一些管理信息。我们来看看这些所谓的`管理信息`都有什么。如下图：

![](./assets/redo-log-block结构图-2.png)

`log block header` 中的属性如下：

- `LOG_BLOCK_HDR_NO`：log buffer 是由 log block 组成，在内部 log buffer 就好似一个数组，因此 LOG_BLOCK_HDR_NO 用来标记这个数组中的位置。其是递增并且循环使用的，占用 4 个字节，但是由于第一位用来判断是否是 flush bit，所以最大的值为 2G。
- `LOG_BLOCK_HDR_DATA_LEN`：表示 block 中已经使用了多少字节，初始值为 12（因为 `log block body` 从第 12 个字节处开始）。随着往 block 中写入的 redo 日志越来越多，本属性值也跟着增长。如果 `log block body` 已经被全部写满，那么本属性的值被设置为 512。
- `LOG_BLOCK_FIRST_REC_GROUP`：一条 redo 日志也可以称之为一条 redo 日志记录（redo log record），一个 mtr 会生产多条 redo 日志记录，这些 redo 日志记录被称之为一个 redo 日志记录组（redo log record group）。LOG_BLOCK_FIRST_REC_GROUP 就代表该 block 中第一个 mtr 生成的 redo 日志记录组的偏移量（其实也就是这个 block 里第一个 mtr 生成的第一条 redo 日志的偏移量）。如果该值的大小和 LOG_BLOCK_HDR_DATA_LEN 相同，则表示当前 log block 不包含新的日志。
- `LOG_BLOCK_CHECKPOINT_NO`：占用 4 字节，表示该 log block 最后被写入时的 `checkpoint`。

`log block trailer`中的属性如下：

- `LOG_BLOCK_CHECKSUM`：表示 block 的校验值，用于正确性校验（其值和 LOG_BLOCK_HDR_NO 相同）

### redo log file

#### 1.相关参数设置

- `innodb_log_group_home_dir`：指定 redo log 文件组所在的路径，默认值为`./`，表示在数据库的数据目录下。MySQL的默认数据目录（`var/lib/mysql`）下默认有两个名为`ib_logfile0`和`ib_logfile1`的文件，**log buffer中的日志默认情况下就是刷新到这两个磁盘文件中**。此redo日志文件位置还可以修改。

- `innodb_log_files_in_group`：指明redo log file的个数，命名方式如：ib_logfile0，ib_logfile1... ib_logfilen。默认2个，最大100个。

```sql
mysql> show variables like 'innodb_log_files_in_group';
+---------------------------+-------+
| Variable_name             | Value |
+---------------------------+-------+
| innodb_log_files_in_group | 2     |
+---------------------------+-------+


#ib_logfile0
#ib_logfile1
```

- `innodb_flush_log_at_trx_commit`：控制 redo log 刷新到磁盘的策略，默认为`1`。 
- `innodb_log_file_size`：单个 redo log 文件设置大小，默认值为 `48M` 。最大值为512G，注意最大值指的是整个 redo log 系列文件之和，即（innodb_log_files_in_group * innodb_log_file_size ）不能大于最大值512G。

```sql
mysql> show variables like 'innodb_log_file_size';
+----------------------+-----------+
| Variable_name        | Value     |
+----------------------+-----------+
| innodb_log_file_size | 50331648  |
+----------------------+-----------+
```

我们可以根据业务修改其大小，以便容纳较大的事务。编辑 my.cnf 文件并重启数据库生效，如下所示：

```shell
# my.cnf

innodb_log_file_size=200M
```

> 在数据库实例更新比较频繁的情况下，我们可以适当加大redo log **组数** 和 **大小**。但也不推荐 redo log设置过大，在MySQL崩溃恢复时会重新执行redo log中的记录。

#### 2.日志文件组

从上边的描述中可以看到，磁盘上的 `redo` 日志文件不只一个，而是以一个`日志文件组`的形式出现的。这些文件以 `ib_logfile [数字]`（数字可以是 `0`、`1`、`2`…）的形式进行命名，每个的 redo 日志文件大小都是一样的。

在将 redo 日志写入日志文件组时，是从 `ib_logfile0` 开始写，如果 `ib_logfile0` 写满了，就接着 `ib_logfile1` 写。同理，`ib_logfile1` 写满了就去写 `ib_logfile2`，依此类推。如果写到最后一个文件该咋办？那就重新转到 `ib_logfile0` 继续写，所以整个过程如下图所示：

![](./assets/redo-log-file-group.png)

总共的 redo 日志文件大小其实就是：`innodb_log_file_size × innodb_log_files_in_group`。

采用循环使用的方式向 redo 日志文件组里写数据的话，会导致后写入的 redo 日志覆盖掉前边写的 redo 日志？当然！所以 InnoDB 的设计者提出了 **checkpoint** 的概念。

#### 3.checkpoint

在整个日志文件组中还有两个重要的属性，分别是 **write pos**、**checkpoint**

- `write pos` 是当前记录的位置，一边写一边后移
- `checkpoint` 是当前要擦除的位置，也是往后推移

每次刷盘 redo log 记录到日志文件组中，write pos 位置就会后移更新。每次 MySQL 加载日志文件组恢复数据时，会清空加载过的 redo log 记录，并把 checkpoint 后移更新。write pos 和 checkpoint 之间的还空着的部分可以用来写入新的 redo log 记录。

![](./assets/redo-log-checkpoint-1.png)

如果 write pos 追上 checkpoint，表示**日志文件组**满了，这时候不能再写入新的 redo log 记录，MySQL 得停下来，清空一些记录，把 checkpoint 推进一下。

![](./assets/redo-log-checkpoint-2.png)

### redo log小结

相信大家都知道 redo log 的作用和它的刷盘时机、存储形式：

**InnoDB 的更新操作采用的是 Write Ahead Log (预先日志持久化) 策略，即先写日志，再写入磁盘。**

![](./assets/redo-log-undo-log.png)


## undo日志

redo log是事务持久性的保证，undo log是事务原子性的保证。在事务中`更新数据`的`前置操作`其实是要先写入一个`undo log`。

> 查询操作不会记录到undo log
>
> undo log记录的是数据修改前的数据。

### 如何理解undo日志

事务需要保证`原子性`，也就是事务中的操作要么全部完成，要么什么也不做。但有时候事务执行到一半会出现一些情况，比如：

- 情况一：事务执行过程中可能遇到各种错误，比如`服务器本身的错误`，`操作系统错误`，甚至是突然`断电`导致的错误。
- 情况二：程序员可以在事务执行过程中手动输入`ROLLBACK`语句结束当前事务的执行。

以上情况出现，我们需要把数据改回原先的样子，这个过程称之为`回滚`，这样就可以造成一个假象：这个事务看起来什么都没做，所以符合`原子性`要求。

每当我们要对一条记录做改动时（这里的改动可以是：`INSERT`、`DELETE`、`UPDATE`），都需要“留一手”，即把回滚时所需要的数据记录下来，比如：

- 你`插入一条记录时`，至少要把这条记录的主键值记下来，之后回滚的时候只需要把这个主键值对应的`记录删掉`就好了。（对于每个 INSERT，InnoDB 存储引擎会完成一个 DELETE）
- 你`删除了一条记录`，至少要把这条记录中的内容都记下来，这样之后回滚时再把由这些内容组成的记录`插入`到表中就好了。（对于每个 DELETE，InnoDB 存储引擎会执行一个 INSERT）
- 你`修改了一条记录`，至少要把修改这条记录前的旧值都记录下来，这样之后回滚时再把这条记录`更新为旧值`就好了。（对于每个 UPDATE，InnoDB 存储引擎会执行一个相反的 UPDATE，将修改前的行放回去）

MySQL 把这些为了回滚而记录的这些内容称之为`撤销日志`或者`回滚日志`（即 `undo log`）。

注意，由于查询操作（`SELECT`）并不会修改任何用户记录，所以在查询操作执行时，并`不需要记录`相应的 undo 日志。

此外，undo log`会产生redo log`，也就是undo log的产生会伴随着redo log的产生，这是因为undo log也需要持久性的保护。

### undo日志的作用

- **作用1：回滚数据**

你可能对 undo 日志可能`有误解`：undo 用于将数据库物理地恢复到执行语句或事务之前的样子。但事实并非如此。

undo 是`逻辑日志`，因此只是**将数据库逻辑地恢复到原来的样子**。所有修改都被逻辑地取消了，但是数据结构和页本身在回滚之后可能大不相同。

这是因为在多用户并发系统中，可能会有数十、数百甚至数千个并发事务。数据库的主要任务就是协调对数据记录的并发访问。比如，一个事务在修改当前一个页中某几条记录，同时还有别的事务在对同一个页中另几条记录进行修改。因此，不能将一个页回滚到事务开始的样子，因为这样会影响其他事务正在进行的工作。

- **作用2：[MVCC](./MVCC.md)**

undo 的另一个作用是 MVCC，即在 InnoDB 存储引擎中 MVCC 的实现是通过 undo 来完成。当用户读取一行记录时，若该记录已经被其他事务占用，当前事务可以通过 undo 读取之前的行版本信息，以此实现非锁定读取。

### undo的存储结构

#### 1.回滚段与undo页

InnoDB对undo log的管理采用段的方式，也就是`回滚段（rollback segment）`。每个回滚段记录了`1024`个`undo log segment`，而在每个undo log segment段中进行`undo页`的申请。

- 在 `InnoDB1.1 版本之前`（不包括 1.1 版本），只有一个 rollback segment，因此支持同时在线的事务限制为`1024`。虽然对绝大多数的应用来说都已经够用。
- 从 `1.1 版本开始` InnoDB 支持最大 `128个 rollback segment`，故其支持同时在线的事务限制提高到了`128*1024`。

可以通过`show variables like 'innodb_undo_logs';`查看rollback segment的个数

```sql
mysql> show variables like 'innodb_undo_logs';
+------------------+-------+
| Variable_name    | Value |
+------------------+-------+
| innodb_undo_logs | 128   |
+------------------+-------+
```

虽然 InnoDB1.1 版本支持了 128个 rollback segment，但是这些 rollback segment 都存储于共享表空间 ibdata 中。从 InnoDB1.2 版本开始，可通过参数对 rollback segment 做进一步的设置，这些参数包括：

- `innodb_undo_directory`：设置 rollback segment 文件所在的路径。这意味着 rollback segment 可以存放在共享表空间以外的位置，即可以设置为独立表空间。该参数的默认值为 “./”，表示当前 InnoDB 存储引擎的目录。
- `innodb_undo_logs`：设置 rollback segment 的个数，默认值为 128。在 InnoDB1.2 版本中，该参数用来替换之前版本的参数 innodb_rollback_segments。
- `innodb_undo_tablespaces`：设置构成 rollback segment 文件的数量，这样 rollback segment 可以较为平均地分布在多个文件中。设置该参数后，会在路径 innodb_undo_directory 看到 undo 为前缀的文件，该文件就代表 rollback segment 文件。

> 需要说明的是，undo log 相关参数一般很少改动。

**undo 页的重用**

当我们开启一个事务需要写 undo log 的时候，就得先去 undo log segment 中去找到一个空闲的位置，当有空位的时候，就去申请 undo 页，在这个申请到的 undo 页中进行 undo log 的写入。我们知道 mysql 默认一页的大小是 16k。

但是，为每一个事务分配一个页，是非常浪费的（除非你的事务非常长），假设你的应用的 TPS（每秒处理的事务数目）为 1000，那么 1s 就需要 1000 个页，大概需要 16M 的存储，1 分钟大概需要 1G 的存储。如果照这样下去除非 MySQL 清理的非常勤快，否则随着时间的推移，磁盘空间会增长的非常快，而且很多空间都是浪费的。

于是 `undo 页`就被设计的可以`重用`了，当事务提交时，并不会立刻删除 undo 页。（因为重用，所以这个 undo 页可能混杂着其他事务的 undo log。）undo log 在 commit 后，会被放到一个`链表`中，然后判断 undo 页的使用空间是否`小于3/4`，如果小于3/4的话，则表示当前的 undo 页可以被重用，那么他就不会被回收，其他事务的undo log可以记录在当前 undo 页中的的页面。由于undo log是`离散的`，所以清理对应的磁盘空间时，效率不高。

#### 2.回滚段与事务

下面来介绍回滚段与事务之间的关系：

1. 每个事务只会使用一个回滚段，一个回滚段在同一时刻可能会服务于多个事务。

2. 当一个事务开始的时候，会制定一个回滚段，在事务进行的过程中，当数据被修改时，原始的数据会被复制到回滚段。

3. 在回滚段中，事务会不断填充盘区，直到事务结束或所有的空间被用完。如果当前的盘区不够用，事务会在段中请求扩展下一个盘区，如果所有已分配的盘区都被用完，事务会覆盖最初的盘区或者在回滚段允许的情况下扩展新的盘区来使用。

4. 回滚段存在于undo表空间中，在数据库中可以存在多个undo表空间，但同一时刻只能使用一个undo表空间。

```sql
mysql> show variables like 'innodb_undo_tablespaces';
+---------------------------+-------+
| Variable_name             | Value |
+---------------------------+-------+
| innodb_undo_tablespaces   | 2     |
+---------------------------+-------+
1 row in set (0.01 sec)

-- undo log 的数量，最少为 2. undo log 的 truncate 操作有 purge 协调线程发起。在 truncate 某个 undo log 表空间的过程中，保证有一个可用的 undo log 可用。
```

5. 当事务提交时，InnoDB存储引擎会做以下两件事情：
   - 将undo log放入列表中，以供之后的purge操作
   - 判断undo log所在的页是否可以重用，若可以分配给下个事务使用

#### 3.回滚段中的数据分类

1. `未提交的回滚数据(uncommitted undo information)`：该数据所关联的事务并未提交，用于实现读一致性，所以该数据不能被其他事务的数据覆盖。

2. `已经提交但未过期的回滚数据(committed undo information)`：该数据关联的事务已经提交，但是仍受到 undo retention 参数的保持时间的影响。

3. `事务已经提交并过期的数据(expired undo information)`：事务已经提交，而且数据保存时间已经超过 undo retention 参数指定的时间，属于已经过期的数据。当回滚段满了之后，会优先覆盖 “事务已经提交并过期的数据”。

事务提交后并不能马上删除 undo log 及 undo log 所在的页。这是因为可能还有其他事务需要通过 undo log 来得到行记录之前的版本。故事务提交时将 undo log 放入一个链表中，是否可以最终删除 undo log 及 undo log 所在页由 purge 线程来判断。

### undo的类型

在InnoDB存储引擎中，undo log分为：

- insert undo log

insert undo log 是指在 insert 操作中产生的 undo log。因为 insert 操作的记录，只对事务本身可见，对其他事务不可见（这是事务隔离性的要求），故该 undo log 可以在事务提交后直接删除。不需要进行 purge 操作。

- update undo log

update undo log 记录的是对 delete 和 update 操作产生的 undo log。该 undo log 可能需要提供 MVCC 机制，因此不能在事务提交时就进行删除。提交时放入 undo log 链表，等待 purge 线程进行最后的删除。

### undo log的生命周期

#### 1.简要生成过程

以下是 undo + redo 事务的简化过程

假设有 2 个数值，分别为 A=1 和 B=2，然后将 A 修改为 3，B 修改为 4

```
1. start transaction;
2. 记录 A=1 到undo log;
3. update A = 3;
4. 记录 A=3 到redo log;
5. 记录 B=2 到undo log;
6. update B = 4;
7. 记录B = 4 到redo log;
8. 将redo log刷新到磁盘
9. commit
```

- 在 1-8 步骤的任意一步系统宕机，事务未提交，该事务就不会对磁盘上的数据做任何影响。
- 如果在 8-9 之间宕机，恢复之后可以选择回滚，也可以选择继续完成事务提交，因为此时 redo log 已经持久化。
- 若在 9 之后系统宕机，内存映射中变更的数据还来不及刷回磁盘，那么系统恢复之后，可以根据 redo log 把数据刷回磁盘。

**只有Buffer Pool的流程：**

![](./assets/buffer-pool更新数据流程.png)

**有了Redo Log和Undo Log之后：**

![](./assets/buffer-pool更新数据流程-包含redo、undo.png)

在更新 Buffer Pool 中的数据之前，我们需要先将该数据事务开始之前的状态写入 Undo Log 中。假设更新到一半出错了，我们就可以通过 Undo Log 来回滚到事务开始前。

#### 2.详细生成过程

对于 InnoDB 引擎来说，每个行记录除了记录本身的数据之外，还有几个隐藏的列：

- `DB_ROW_ID`：如果没有为表显式的定义主键，并且表中也没有定义唯一索引，那么 InnoDB 会自动为表添加一个 `row_id` 的隐藏列作为**主键**。
- `DB_TRX_ID`：每个事务都会分配一个**事务 ID**，当对某条记录发生变更时，就会将这个事务的事务 ID 写入 trx_id 中。
- `DB_ROLL_PTR`：**回滚指针**，本质上就是指向 undo log 的指针。

![](./assets/undo-log-详细生成-1.png)

**当我们执行INSERT时：**

```sql
begin; 
INSERT INTO user (name) VALUES ("tom");
```

![](./assets/undo-log-详细生成-2.png)

**当我们执行UPDATE时：**

对于更新的操作会产生update undo log，并且会分别更新主键的和不更新主键的，假设现在执行：

```sql
UPDATE user SET name='Sun' WHERE id=1;
```

![](./assets/undo-log-详细生成-3.png)

这时会把老的记录写入新的 undo log，让回滚指针指向新的 undo log，它的 undo no 是 1，并且新的 undo log 会指向老的 undo log（undo no=0）。

假设现在执行：

```sql
UPDATE user SET id=2 WHERE id=1;
```

![](./assets/undo-log-详细生成-4.png)

对于更新主键的操作，会先把原来的数据 deletemark 标识打开，这时并没有真正的删除数据，真正的删除会交给清理线程去判断，然后在后面插入一条新的数据，新的数据也会产生 undo log，并且 undo log 的序号会递增。

可以发现每次对数据的变更都会产生一个 undo log，当一条记录被变更多次时，那么就会产生多条 undo log，undo log 记录的是变更前的日志，并且每个 undo log 的序号是递增的，那么当要回滚的时候，按照序号`依次向前推`，就可以找到我们的原始数据了。

#### 3.undo log是如何回滚的

以上面的例子来说，假设执行rollback，那么对应的流程应该是这样：

1. 通过undo no=3的日志把id=2的数据删除

2. 通过undo no=2的日志把id=1的数据的deletemark还原成0

3. 通过undo no=1的日志把id=1的数据的name还原成Tom

4. 通过undo no=0的日志把id=1的数据删除

#### 4.undo log的删除

- 针对于insert undo log

因为insert操作的记录，只对事务本身可见，对其他事务不可见。故该undo log可以在事务提交后直接删除，不需要进行purge操作。

- 针对于update undo log

该undo log可能需要提供MVCC机制，因此不能在事务提交时就进行删除。提交时放入undo log链表，等待purge线程进行最后的删除。

### 小结

![](./assets/redo-log-undo-log.png)

undo log是`逻辑日志`，对事务回滚时，只是将数据库逻辑地恢复到原来的样子。

redo log是`物理日志`，记录的是数据页的物理变化，**undo log不是redo log的逆过程**。
