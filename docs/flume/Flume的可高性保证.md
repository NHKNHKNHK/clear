# Flume的可高性保证

Flume的一些组件（如 Spooling Directory Source、File Channel）能保证 Agent出问题后数据不丢失。

## 负载均衡

​	Source 里的 Event 流经 Channel，进入 Sink组，在Sink组内部根据负载均衡算法（round_robin、random）选择sink，后续可以选择不同机器上的Agent实现负载均衡。



## 故障转移

​	配置一组Sink，这组Sink组成一个Sink故障转移处理器，当有一个Sink处理失败，Flume将这个Sink放到一个地方，设定冷却时间，待其可以正常处理Event时再取回。

​	Event 通过一个 Channel 流向一个Sink组，在Sink组内部根据优先级选择具体的Sink，失败后再转向另一个Sink。
