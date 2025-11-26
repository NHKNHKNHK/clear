# MapReduce并行度机制

## 1 MapTask并行度机制

-   MapTask的并行度是指**map阶段有多少个并行的task共同处理任务**
-   map阶段的任务处理并行度势必会影响到整个job的处理速度

### 1.1 逻辑规划

-   MapTask并行度的决定机制叫做**逻辑规划**。
-   **客户端提交job之前会对待处理的数据进行逻辑切片，形成逻辑规划文件**。
-   逻辑规划机制由FileInputFormat类的**getSplits**方法完成
-   逻辑规划结果写入规划文件(job.split)，在客户端提交Job之前，把规划文件提交到任务准备区，供后续使用。
-   每个逻辑切片最终对应启动一个maptask

默认是一个逻辑切片 对应一个maptask

### 1.2 逻辑切片规则

-   逐个遍历待处理目录下的文件，以切片大小形成规则
-   默认情况下，split size = block size，而默认情况下，block size = 128M

例如：

```shell
#比如待处理数据有两个文件
file1.txt 320M
file2.txt 10M

#经过FileInputFormat的切片机制运算后，形成的切片信息如下：
file1.txt.split1  0~128M
file1.txt.split2  128M~256M
file1.txt.split3  256M~320M
file2.txt.split1  0~10M
```

### 1.3 逻辑切片相关参数

-   在FileInputFormat中，计算切片大小的逻辑：

```java
Math.max(minSize, Math.min(maxSize, blockSize));
// minsize：默认值1（"mapreduce.input.fileinputformat.split.minsize"）
// maxsize：默认值Long.MAXValue（"mapreduce.input.fileinputformat.split.maxsize"）
// block 默认值是128M
```

下面是源码片段

```java
 protected long computeSplitSize(long blockSize, long minSize, long maxSize) {
        return Math.max(minSize, Math.min(maxSize, blockSize));
}
```

-   因此，默认情况下split size = block size = 128M
-   注意，当**bytesRemaining / splitSize > 1.1 不满足的话，那么最后所有剩余的会作为一个切片**



## 2 ReduceTask并行度机制

-   ReduceTask并行度同样影响整个job的执行并发度和并发率，与maptask的并发数由切片数决定不同，**ReduceTask的数量是可以直接手动设置**的。

```java
job.setNumReduceTasks(N);
```

-   注意ReduceTask的数量并不是任意设置的，还要考虑业务逻辑要求，有些情况下，需要计算全局汇总结果，就只能有一个ReduceTask
-   如果数据分布不均匀，有可能会在reduce阶段产生数据倾斜

## 3 MapTask工作机制

### **整体概述**

1.  输入文件被逻辑分为多个split文件，通过LineRecordReader按行读取内容给map（用户自己实现）进行处理
2.  数据被map处理接收之后交给OutputCollector收集器，对其结果key进行分区（HashPartitioner），然后写入内存缓冲区，当缓冲区快满的时候（80%）需要将缓冲区的数据以临时文件的方式spill溢出到磁盘。
3.  最后再对磁盘上产生的所有临时文件做合并，生成最终的正式输出文件，然后等待reduce task来拉取数据

**step1:**

-   读取数据组件InputFormat（默认TextInputFormat）会通过getSplits方法对输入目录中文件进行逻辑规划得到splits，有多少个split就对应启动多少个MapTask。split与block的对应关系默认是一对一
-   逻辑规划后，由RecordReader对象（默认是LineRecordReader）进行读取数据，以回车换行符作为分隔符，读取一行数据，返回<key, value>

​	其中key表示每行首字符偏移量，value表示这一行的内容

-   读取split返回<key, value>，进入用户自己继承的Mapper类中，执行用户重写的map方法。

    **RecordReader读取一行数据，这里就调用一次map方法**进程处理

step2：

-   map处理完之后，将map的每条结果通过context.write进行Collect数据收集。再Collect中，会先对其进行分区处理，默认会使用HashPartitioner

MapReduce提供了Partitioner接口，它的作业就是决定当前的这对输出结果最终应该交由哪个reducetask处理

默认对key hash之后再以reducetask数量取模。如果用户自己对Partitioner有需求，可以定制并在job上设置。

源代码片段如下：

```Java
public int getPartition(K key, V value, int numReduceTasks) {
    return (key.hashCode() & 2147483647) % numReduceTasks;
}
```

-   分区计算后，会将数据写入内存，内存中这片区域叫做**环形缓冲区**，缓冲区的作用是批量收集map结果，减少磁盘IO的影响

key/value对以及Partition的结果都会被写入缓冲区。当然写入之前，key与value值都会被序列化成**字节数组**。

### **环形缓冲区**

-   环形缓冲区就是内存中的一块区域，底层是字节数组。**缓冲区**是有大小限制的，默认是**100M**
-   当maptask的输出结果很多时，就可能撑爆内存，所以需要在一定的条件下将缓冲区的数据临时写入磁盘，然后重写利用这块缓冲区。整个**从内存往磁盘写入数据的过程叫spill**。中文称**溢写**
-   这个溢写是由单独线程来完成的，不影响往缓冲区写map结果的线程。溢写线程启动时不应该阻止map的结果输出，所以整个缓冲区有个溢写的比例spill.percent。整个比例默认0.8，也就是当缓冲区的数据达到阈值（buffersize*size percent = 100MB * 0.8 = 80MB），溢写线程启动，锁定这80MB的内存，执行溢写过程。MapTask的输出结果还可以往剩下的20MB内存中写，互不影响。

**step3：**

-   当**溢写线程启动后**，需要**对这80MB空间内的key做排序**。排序是MapReduce模型默认的行为，这里的排序也是序列化的字节做的排序。

如果job设置过Combiner，那么现在就是使用Combiner的时候了。将有相同key的key/value对的value加起来，减少溢写到磁盘的数量量。Combiner会优化MapReduce的中间结果，所以它在整个模型中会多次使用。

**step4：**

-   每次溢写会在磁盘上生成一个临时文件，如果map的输出结果真的很大，会多次这样的溢写发生，磁盘上相应的就会有多个临时文件存在。
-   当整个数据处理结束之后开始对磁盘中的临时文件进行merge合并，因为最终的文件只有一个，写入磁盘，并且为这个文件提供了一个索引文件，以记录每个reduce对应数据的偏移量

## 4 ReduceTask工作机制

**整体概述**

1.  Reduce大致分为copy、sort、reduce三个阶段，重点在前两个阶段
2.  copy阶段包含一个eventFetcher来获取已完成的map列表，由Fetcher线程取copy数据，在此过程中会启动两个merge线程，分别为inMemoryMerger和onDiskMerger，分别将内存中的数据merge到磁盘和将磁盘中的数据进行merge
3.  待数据copy完成后，开始进行sort阶段，sort阶段的主要任务是执行finalMerge操作，纯粹的sort阶段
4.  完成之后就是reduce阶段，调用用户定义的reduce方法进行处理

**step1：**

copy阶段，简单拉去数据。Reduce进程启动一些数据copy线程（Fetcher），通过HTTP方式（get）请求mapTask获取属于自己的文件

**Step2:**

-   Copy过来的数据会先放入内存缓冲区中，这里的缓冲区大小要比map端更灵活。
-   merge有三种方式：内存到内存、内存到磁盘、磁盘到磁盘。默认情况下第一种形式不启用。当内存中的数据量达到一定阈值，就启动内存到磁盘的merge。第二种merge方式一直运行，直到没有map端的数据时才结束，然后启动第三种磁盘到磁盘的merger方式生成最终的文件

step3：

把分散的数据合并成一个大数据的文件后，还会再对合并的书数据排序。默认key的字典序排序

step4：

-   对排序后的键值对调用reduce方法，键相等的键值对组成一组，调用一次reduce方法。

所谓分组就是纯粹的前后两个key进行比较，如果相等就继续判断下一个是否和当前相等

-   reduce处理的结果会调用默认输出组件TextOutputFormat写入到指定的目录文件中。

TextOutputFormat默认是一次输出写一行，key value之间以制表符\t分隔



## 5 MapReduce Shuffle机制

-   Shuffle的本意是洗牌、混洗的意思，把一组有规则的数据尽量打成无规则的数据
-   而在MapReduce中，Shuffle更像是洗牌的逆过程，指的是**将map端的无规则输出按指定的规则"打乱"成具有一定规则的数据，以便reduce端接收处理**。
-   Shuffle是MapReduce的核心，它**分布在MapReduce的map阶段和reduce阶段**
-   一般指从**Map产生输出开始到Reduce取得数据作为输入**之前的过程称为Shuffle

### 5.1 Map端shuffle

-   Collect阶段：将MapTask的结果收集输出到默认大小为100M的环形缓冲区，保存之前会对key进行分区的计算，默认Hash分区。
-   Splil阶段：当内存的数据量达到一定的阀值的时候，将会将数据写入本地磁盘，在将数据写入到磁盘之前需要对数据进行一次排序操作，如果配置了Combiner，还会将有相同分区号和key的数据进行排序。
-   Merge阶段：把所有溢出的临时文件进行一次合并操作，以确保一个MapTask最终至产生一个中间数据文件。

### 5.2 Reduce端shuffle

-   Copy阶段：ReduceTask启动Fetcher线程到已经完成MapTask的节点上**复制一份属于自己的数据**。
-   Merge节阶段：在ReduceTask远程复制数据的同时，会在后台开启两个线程对内存到本地的数据进行合并操作。
-   Sort阶段：在对数据进行合并的同时，会进行排序操作，由于MapTask阶段已经对数据进行了局部的排序，ReduceTask只需保证Copy的数据的最终整体有效性即可。

### 5.3 Shuffle弊端

-   Shuffle是MapReduce的核心和精髓。是MapReduce的灵魂所在。
-   Shuffle也是MapReduce被诟病最多的地方所在。MapRudece相比较于Spark、Flink计算引擎慢的原因，跟Shuffle机制有很大的关系。
-   Shuffle中频繁涉及到数据在内存、磁盘直接的多次往复。

