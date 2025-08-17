# hbase-env.sh

```sh
export HBASE_DISABLE_HADOOP_CLASSPATH_LOOKUP="true"
```

该参数作用是禁用HBase对Hadoop类路径的查找。

HBase在启动时会尝试自动查找Hadoop的类路径，并将其添加到HBase的类路径中。这样可以确保HBase能够正确地访问和使用Hadoop的相关库和配置。

然而，有时候由于环境配置的原因，HBase可能无法正确地查找Hadoop的类路径，导致启动失败或出现其他问题。在这种情况下，可以通过在`hbase-env.sh`中设置`HBASE_DISABLE_HADOOP_CLASSPATH_LOOKUP`为`true`来禁用HBase对Hadoop类路径的查找。

禁用Hadoop类路径的查找后，HBase将不再尝试自动查找Hadoop的类路径，而是依赖于手动配置的类路径。这样可以解决HBase启动时的类路径问题，但需要确保手动配置的类路径正确无误。

需要注意的是，禁用Hadoop类路径的查找可能会导致HBase无法正常访问和使用Hadoop的相关功能，因此在禁用之前需要确保Hadoop的类路径已经正确配置。

```shell
export HBASE_MANAGES_ZK=false
```

该参数的目的是设置HBase不使用内置的zookeeper，而是使用外部安装的zookeeper集群

