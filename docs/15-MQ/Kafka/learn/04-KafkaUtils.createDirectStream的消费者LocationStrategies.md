# LocationStrategy

​	大多数情况下，需要使用`LocationStrategies.PreferConsistent`，这会把partition平均分配到可用的executor上。如果executor和kafka的broker在同一台机器上，就要使用PreferBrokers，这样which will prefer to schedule partitions on the Kafka leader for that partition。最后，如果在partition中又严重的倾斜，使用PreferFixed，这样就可以指定某些partition映射到特定主机上(any unspecified partitions will use a consistent location)

## PreferBrokers

```scala
LocationStrategies.PreferBrokers()
```

**只有当你的执行者和你的Kafka代理在同一个节点上时才使用这个方法**。



## PreferConsistent

```java
LocationStrategies.PreferConsistent()
```

**在大多数情况下使用它，它将在所有执行器之间一致地分发分区。**

将Kafka中的数据均与的分配到各个Executor中



## PreferFixed

```
PreferFixed(final Map<TopicPartition, String> hostMap)
```

```
PreferFixed(final scala.collection.Map<TopicPartition, String> hostMap)
```

**如果您的负载不均衡，可以使用此方法在特定主机上放置特定的TopicPartitions。**

**任何未在映射中指定的TopicPartition都将使用一致的位置。**

如果你的负载不均衡，可以通过这两种方式来手动指定分配方式，其他没有在 map 中指定的，均采用 preferConsistent() 的方式分配

