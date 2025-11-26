# MapReduce Combiner规约

每一个map都可能会产生大量的本地输出，Combiner的作用就是对map端的输出先做一次合并，以减少在map和reduce节点之间的数据传输量，以提高网络IO性能，是MapReduce的一种优化手段之一。

-   combiner中文叫做数据规约。数据归约是指在**尽可能保持数据原貌的前提下，最大限度地精简数据量**。
-   combiner是MR程序中Mapper和Reducer之外的一种组件，默认情况下不启用。
-   combiner组件的父类就是Reducer，combiner和reducer的区别在于运行的位置：
    -   combiner是在每一个maptask所在的节点运行
    -   Reducer是接收全局所有Mapper的输出结果

-   combiner的意义就是对每一个maptask的输出进行局部汇总，以减小网络传输量

## MapReduce弊端

-   MapReduce是一种具有两个执行阶段的分布式计算程序，Map阶段和Reduce阶段之间会涉及到跨网络数据传输
-   每一个MapTask都可能会产生大量的本地输出，这就导致跨网络传输数据量大，网络IO性能低

比如：在WordCount单词统计案例中，假如文件有1000个单词，其中999个为hello，这将产生999个<hello,1>的键值对在网络中传输，性能极其低下。

## Combiner组件概念

-   Combiner中文名数据规约，是Map Reduce的一种优化手段
-   Combiner的作用就是对map端的输出先进行一次局部合并，以减少map和reduce节点之间的数据传输量

比如：将map输出阶段产生的999个<hello,1>键值对局部合并成1个<hello,999>，再在网络中传输

## Combiner组件使用

-   Combiner是MapReduce程序中除了Mapper和Reducer之外的一种组件，**默认情况下不启用**

-   **Combiner的本质就是Reducer**，区别在于Combiner和Reducer运行位置不同

    ​	Combiner是早每一个maptask所在的节点本地运行，是局部聚合

    ​	Reducer是对所有的maptask的输出结果进行计算，是全局聚合

-   具体实现步骤：

    自定义一个CustomCombiner类，继承Reducer，重写reduce方法

    job.setCombinerClass(CustomCombiner.class);

如下：

```java
// todo 设置MapReduce程序Combiner类 慎用
// 使用时，经常直接调用Reduece类，因为Combiner的本质就是Reducer
job.setCombinerClass(WordCountReduce.class);  // 这里调用的是WordCount案例的Reduce类
```



## Combiner注意事项

-   Combiner能够应用的前提是不能影响最终的业务逻辑，而且，Combiner的输出kv应该跟reduce的输出kv要相对应

-   下述场景禁用Combiner（因为这样不仅优化了网络传输数据量，还该变量最终的执行结果）

    ​	业务和数据的个数相关的（如：平均数）

    ​	业务和整体排序相关的（如：中位数）

-   Combiner组件不是禁用，而是慎用。**用的好提高程序性能，用不好，会改变程序的结果且不易发现**





