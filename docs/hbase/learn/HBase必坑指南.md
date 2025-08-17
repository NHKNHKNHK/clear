# HBase进程死掉

错误：

​	有一次我高高兴兴的开启Hadoop、HBase集群想测试spark保存数据到HBase中，于是我打开了集群，过了一会后发现，HBase相关的进程（HMaster、HRegionServer）都挂掉了

分析：

​	我发现我没有打开Zookeeper集群，而HBase集群是依赖于Zookeeper的

解决：

打开Zookeeper集群，再开启HBase即可

```shell
[nhk@kk01 ~]$ start-hbase.sh 
running master, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-master-kk01.out
kk01: running regionserver, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-regionserver-kk01.out
kk02: running regionserver, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-regionserver-kk02.out
kk03: running regionserver, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-regionserver-kk03.out
kk02: running master, logging to /opt/software/hbase-2.3.4/logs/hbase-nhk-master-kk02.out
[nhk@kk01 ~]$ jpsall 
=========kk01=========
3136 NodeManager
2769 DataNode
3347 JobHistoryServer
5219 HMaster
2629 NameNode
5481 HRegionServer
5963 Jps
4412 Main
3485 HistoryServer
4877 QuorumPeerMain
=========kk02=========
2417 DataNode
2630 ResourceManager
4758 Jps
2760 NodeManager
4347 HMaster
4109 HRegionServer
3982 QuorumPeerMain
=========kk03=========
2512 SecondaryNameNode
3490 HRegionServer
3364 QuorumPeerMain
3838 Jps
2415 DataNode
2655 NodeManager
[nhk@kk01 ~]$ 
```

