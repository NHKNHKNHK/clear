# Flume事务

​	Flume事务包括Put事务和Take事务。Flume事务保证了数据在Source - Channel，以及Channel - Sink，这两个阶段传世时不会丢失，需要注意的是，Take事务可能导致数据重复。

## Put事务

​	首先 Source 会采集一批数据，封装为event，**缓存达到 batch data 的最大容量时**（batch data的大小取决于配置参数batch size的值），**Flume开启事务：**

-   doPut()：**将这批event写入到临时缓冲区 putList**，putList是一个LinkedBlockingDeque，大小取决于配置Channel 的参数 **transaction capacity** 的大小。

-   doCommit()：**检查channel内存队列是否足够合并**，内存队列的大小由 Channel 的 **capacity** 参数控制， Channel的容量内存队列足够的时候，提交event成功。

-   doRollback()： **channel内存队列空间不够时，回滚**，这里会将整个putList中的数据都扔掉，然后给Source返回一个ChannelException 异常，告诉Source数据没有采集上。Source会重新采集这批数据，然后开启新的事务。
    

## Take事务

-   doTake()：**sink将数据剪切取到临时缓冲区takeList**，takeList 也是一个LinkedBlockingDeque，
    大小取决于配置 Channel的 参数 **transaction capacity** 的大小，同时也拷贝一份放入写往HDFS的IO流中。
-   doCommit()：**如果event全部发送成功，就清除takeList。**

-   doRollback()：**如果发送过程中出现异常，回滚，将takeList中的全部 event 归还给Channel**。这个操作可能导致数据重复,如果已经写入一半的event到了HDFS，但是回滚时会向channel归还整个takeList中的event，后续再次开启事务向HDFS写入这批event时候，就出现了数据重复。


​	

​	Flume的事务仅能保证两个传输阶段的数据不丢，但是如果channel选用的是memory channel，那么由于memory channel将数据存储在内存中，一旦channel发生异常，数据仍然可能丢失，但采用File channel时，数据传输到channel时会落盘，再结合事务，会保证整体上数据不会丢失，但是仍然可能会在take事务阶段发生数据重复。
