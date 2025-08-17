# HBase Shell

说明：Hbase是由Java语言开发的，hbase shell 中的命令都会转变为Java API再去执行

## 基本操作

**1）进入HBase客户端命令行**（如下是正常进入hbase shell显示的一些信息）

```shell
[nhk@kk01 ~]$ hbase shell
2023-04-06 07:54:50,135 WARN  [main] util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applic
ableHBase Shell
Use "help" to get list of supported commands.
Use "exit" to quit this interactive shell.
For Reference, please visit: http://hbase.apache.org/2.0/book.html#shell
Version 2.3.4, rafd5e4fc3cd259257229df3422f2857ed35da4cc, Thu Jan 14 21:32:25 UTC 2021
Took 0.0010 seconds                                                                                                                                          
hbase(main):001:0> 
```

**2）查看帮助**

​	展示Hbase中所有能使用的命令，主要使用的命令有namespace命名空间相关、DDL创建修改表格、DML写入读取数据

```shell
hbase(main):002:0> help
```

## namespace

### **1）查看当前HBase中有哪些namespace**

```shell
hbase(main):003:0> list_namespace
NAMESPACE                                                                                 default                                                                                   hbase                                                                                     2 row(s)
Took 0.5280 seconds             

# 其中有以下两个系统创建的namespace
default(创建表时未指定命名空间的话默认在default下)                                             hbase(系统使用的，用来存放系统相关的元数据信息等，勿随便操作)
```

### **2）创建命名空间**

```shell
hbase(main):004:0> create_namespace 'bigdata'  # 创建命名空间
Took 0.1992 seconds       
# 或者
hbase(main):005:0> create_namespace "bigdata", {"author"=>"wyh", "create_time"=>"2023-04-06 08:08:08"}
```

### **3）查看namespace**

```shell
hbase(main):023:0> describe_namespace 'bigdata'
DESCRIPTION                                                                                                                                                  
{NAME => 'bigdata'}                                                                                                                                          
Quota is disabled
Took 0.0543 seconds        	
```

### **4）修改namespace的信息（添加或者修改属性）**

```shell
hbase(main):025:0> alter_namespace 'bigdata',{METHOD => 'set', 'author' => 'weiyunhui'}
Took 0.1735 seconds      
```

添加或者修改属性

```shell
hbase(main):027:0> alter_namespace 'bigdata', {METHOD => 'set', 'PROPERTY_NAME' => 'PROPERTY_VALUE'}
Took 0.1364 seconds      
```

删除属性    

```shell
hbase(main):028:0> alter_namespace 'bigdata', {METHOD => 'unset', NAME => ' PROPERTY_NAME '} 
Took 0.1297 seconds    
```

### **5）删除namespace**

```shell
hbase(main):037:1' drop namespace 'bigdata'
```

注意: 要删除的namespace必须是空的，其下没有表。

## DDL	

### **查看当前数据库有哪些表**

```shell
hbase(main):001:0> list  		# 查看数据库中的表
TABLE                                                                                     0 row(s)
Took 0.5210 seconds                                                                       => []
```

### **1）创建表**

在创建表时，若**不指定命名空间，则默认namespace=default**

```shell
# 不指定namespace，默认namespace=default
create 't1', 'f1'  	# 创建表t1，列族 f1

create 'ns1:t1', {NAME => 'f1', VERSIONS => 5}   # 在指定namespace ns1中创建表 t1

create 't1', {NAME => 'f1'}, {NAME => 'f2'}, {NAME => 'f3'}  # 创建表t1，列族 f1、f2、f3
```

```shell
hbase(main):012:0* create 'bigdata:person', {NAME => 'info', VERSIONS => 5}, {NAME => 'msg', VERSIONS => 5}
Created table bigdata:person
Took 1.2765 seconds                                                                       => Hbase::Table - bigdata:person

hbase(main):020:0> list      # 查看是否创建成功
TABLE                                                                                     bigdata:person                                                                           1 row(s)
Took 0.0116 seconds                                                                       => ["bigdata:person"]
```

### **2）查看表结构**

```shell
describe 't1'			# 不指定nemespace，默认查看default中的 t1表	
describe 'ns1:t1'

desc 't1'		
desc 'ns1:t1'
```

```shell
hbase(main):014:0> describe 'bigdata:person'	# 查看 bigdata 中的 person 表
Table bigdata:person is ENABLED                                                           bigdata:person                                                                           COLUMN FAMILIES DESCRIPTION                                                                                                                                 
{NAME => 'info', BLOOMFILTER => 'ROW', IN_MEMORY => 'false', VERSIONS => '5', KEEP_DELETED_CELLS => 'FALSE', DATA_BLOCK_ENCODING => 'NONE', COMPRESSION => 'N
ONE', TTL => 'FOREVER', MIN_VERSIONS => '0', BLOCKCACHE => 'true', BLOCKSIZE => '65536', REPLICATION_SCOPE => '0'}                                           

{NAME => 'msg', BLOOMFILTER => 'ROW', IN_MEMORY => 'false', VERSIONS => '5', KEEP_DELETED_CELLS => 'FALSE', DATA_BLOCK_ENCODING => 'NONE', COMPRESSION => 'NO
NE', TTL => 'FOREVER', MIN_VERSIONS => '0', BLOCKCACHE => 'true', BLOCKSIZE => '65536', REPLICATION_SCOPE => '0'}        

# 说明
NAME			表示列族名
BLOOMFILTER		表示为列族级别的类型
IN_MEMORY		表示是否存入内存
VERSIONS		表示版本数
KEEP_DELETED_CELLS	设置被删除的数据，在基于时间的历史数据查询中是否依然可见
DATA_BLOCK_ENCODING	表示数据块的算法
COMPRESSION		表示设置压缩算法
TTL				表示版本存活时间
MIN_VERSIONS	表示最小版本数
BLOCKCACHE		表示是否设置读缓存
BLOCKSIZE		
```

### **3）修改表**

表名创建时写的所有和列族相关的信息，都可以后续通过alter修改，包括增加删除列族

（1）**增加列族和修改信息都会使用覆盖的方法**

```shell
# 修改表
hbase(main):043:0> alter 'bigdata:person', {NAME => 'info', VERSIONS => 3}

# 查看表，查看是否修改成功
hbase(main):022:0> desc 'bigdata:person'        # 查看发现 VERSIONS => '3'，证明修改成功
Table bigdata:person is ENABLED                                                           bigdata:person                                                                           COLUMN FAMILIES DESCRIPTION                                                               {NAME => 'info', BLOOMFILTER => 'ROW', IN_MEMORY => 'false', VERSIONS => '3', KEEP_DELETED_CELLS => 'FALSE', DATA_BLOCK_ENCODING => 'NONE', COMPRESSION => 'N
ONE', TTL => 'FOREVER', MIN_VERSIONS => '0', BLOCKCACHE => 'true', BLOCKSIZE => '65536', REPLICATION_SCOPE => '0'}                                           

{NAME => 'msg', BLOOMFILTER => 'ROW', IN_MEMORY => 'false', VERSIONS => '5', KEEP_DELETED_CELLS => 'FALSE', DATA_BLOCK_ENCODING => 'NONE', COMPRESSION => 'NO
NE', TTL => 'FOREVER', MIN_VERSIONS => '0', BLOCKCACHE => 'true', BLOCKSIZE => '65536', REPLICATION_SCOPE => '0'}        
```

**（2）删除信息使用特殊的语法**

```shell
hbase> alter 'ns1:t1', NAME => 'f1', METHOD => 'delete'
hbase> alter 'ns1:t1', 'delete' => 'f1'
```

```shell
# 删除列族的特殊语法
hbase(main):045:0> alter 'bigdata:person', NAME => 'info',METHOD => 'delete'
hbase(main):047:0> alter 'bigdata:person', 'delete' => 'msg'
```

注意：

​	**表中至少有一个列族**，当删除最后一个列族的时候会报错 org.apache.hadoop.hbase.DoNotRetryIOException	

### **4）删除表**

hbase shell中删除表格，需要先将表格状态设置为不可用

```shell
hbase(main):001:0> disable 'bigdata:person'         # 禁用表                                                                                                 
hbase(main):002:0> drop 'bigdata:person'            # 删除表
```

注意：如果直接drop表，会报错：ERROR:Table student is enabled. Disable it first.

## DML

### **1）写入数据**

​	在HBase中如果想要写入数据，只能添加结构中最底层的cell。可以手动写入时间戳指定cell版本，推荐不写**默认使用当前的系统时间。**

```shell
hbase> put 'ns1:t1', 'r1', 'c1', 'value'   # r1为行键、c1为列族与列名、value为插入的值
hbase> put 't1', 'r1', 'c1', 'value'
hbase> put 't1', 'r1', 'c1', 'value', ts1	# ts1为时间戳，不推荐这种写法
hbase> put 't1', 'r1', 'c1', 'value', {ATTRIBUTES=>{'mykey'=>'myvalue'}} #ATTRIBUTES 属性
hbase> put 't1', 'r1', 'c1', 'value', ts1, {ATTRIBUTES=>{'mykey'=>'myvalue'}}
hbase> put 't1', 'r1', 'c1', 'value', ts1, {VISIBILITY=>'PRIVATE|SECRET'}
```

```shell
hbase(main):006:0> create 'bigdata:student',{NAME => 'info'}	# 创建表
# 写入数据 
hbase(main):010:0> put 'bigdata:student','1001','info:name','zhangsan'                   hbase(main):011:0> put 'bigdata:student','1001','info:name','lisi'
hbase(main):012:0> put 'bigdata:student','1001','info:age','18'
```

注意：

​	如果重复写入相同的rowKey，相同的列，会写入多个版本的数据进行覆盖

​	可以修改cell的 version，以维护多个版本的数据

### **2）读取数据**

读取数的方法有两个：**get** 和 **scan**

**get最大范围是一行数据**，也可以进行列的过滤，读取数据的结果为多行cell

```shell
hbase> get 'ns1:t1', 'r1'		# 读取某一行键
hbase> get 't1', 'r1'		
hbase> get 't1', 'r1', {TIMERANGE => [ts1, ts2]}	
hbase> get 't1', 'r1', {COLUMN => 'c1'}		#读取某一行键的某几列
hbase> get 't1', 'r1', {COLUMN => ['c1', 'c2', 'c3']}
hbase> get 't1', 'r1', {COLUMN => 'c1', TIMESTAMP => ts1}
hbase> get 't1', 'r1', {COLUMN => 'c1', TIMERANGE => [ts1, ts2], VERSIONS => 4}
hbase> get 't1', 'r1', {COLUMN => 'c1', TIMESTAMP => ts1, VERSIONS => 4}
hbase> get 't1', 'r1', {FILTER => "ValueFilter(=, 'binary:abc')"}
hbase> get 't1', 'r1', 'c1'
hbase> get 't1', 'r1', 'c1', 'c2'
hbase> get 't1', 'r1', ['c1', 'c2']
hbase> get 't1', 'r1', {COLUMN => 'c1', ATTRIBUTES => {'mykey'=>'myvalue'}}
hbase> get 't1', 'r1', {COLUMN => 'c1', AUTHORIZATIONS => ['PRIVATE','SECRET']}
hbase> get 't1', 'r1', {CONSISTENCY => 'TIMELINE'}
hbase> get 't1', 'r1', {CONSISTENCY => 'TIMELINE', REGION_REPLICA_ID => 1}

hbase> get 't1', 'r1', {FORMATTER => 'toString'}
hbase> get 't1', 'r1', {FORMATTER_CLASS => 'org.apache.hadoop.hbase.util.Bytes', FORMATTER => 'toString'}
```

```shell
hbase(main):013:0> get 'bigdata:student','1001'   # 注意观察，上一步写入的 zhangsan 已被覆盖了
COLUMN                                   CELL                                             info:age                                timestamp=2023-04-06T08:27:26.272, value=18        info:name                               timestamp=2023-04-06T08:27:18.713, value=lisi  
```

也可以修改读取cell的版本数，默认读取一个。最多能读取当前列族设置的维护版本数

```shell
hbase(main):019:0> get 'bigdata:student','1001',{COLUMN => 'info:name'}
COLUMN                                   CELL                                              info:name                               timestamp=2023-04-06T08:27:18.713, value=lisi 

# 这里我们想要读取6个版本的数据，但是这个列族只保留一个版本的数据，所有只显示一个cell
hbase(main):020:0> get 'bigdata:student','1001',{COLUMN => 'info:name', VERSIONS => 6}
COLUMN                                   CELL                                             info:name                               timestamp=2023-04-06T08:27:18.713, value=lisi                                        
```

**scan是扫描数据，能够读取多行数据**，不建议扫描过多的数据，推荐使用 startRow 和 stopRow 来控制读取的数据，默认范围**左闭右开**

```shell
hbase(main):047:0> scan 'bigdata:student',{STARTROW => '1001',STOPROW => '1002'}
ROW                                      COLUMN+CELL                                                                                                         
 1001                                    column=info:age, timestamp=2023-06-25T01:05:44.443, value=18                                                        
 1001                                    column=info:name, timestamp=2023-06-25T01:05:37.818, value=lisi   
```

### **3）删除数据**

删除数据的方法有两个：delete 和 deleteall

**delete表示删除一个版本**的数据，即为一个cell，不填写版本**默认删除最新的一个版本**

```shell
hbase(main):030:0* delete 'bigdata:student','1001','info:name'

# 我们删除一个版本的数据以后，zhangsan就出来了
hbase(main):055:0> scan 'bigdata:student',{STARTROW => '1001',STOPROW => '1002'}
ROW                                      COLUMN+CELL                                                                                                         
 1001                                    column=info:age, timestamp=2023-06-25T01:05:44.443, value=18                                                        
 1001                                    column=info:name, timestamp=2023-06-25T01:05:19.183, value=zhangsan    
```

**deleteall表示删除所有版本**的数据，即为当前行当前列的多个cell，（**执行命名会标记数据为删除，不会直接将数据彻底删除，删除数据只在特定时期清理磁盘时进行）**

```shell
hbase(main):056:0> deleteall 'bigdata:student','1001','info:name'
```

### **4）清空表数据**

```shell
hbase(main):065:0* truncate 'bigdata:student'
```

注意：清空表的操作顺序为先disable，然后再truncate。

### **5）统计表数据行数**

```shell
count 't1'
count 'ns1:t1'
```



