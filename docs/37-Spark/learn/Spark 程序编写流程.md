# Spark 程序编写流程

-   **创建 SparkConf 对象**（Spark程序必须做的第一件事是创建一个（JavaSparkContext）/SparkContext对象，它告诉Spark如何访问集群。要创建SparkContext，首先需要构建一个包含应用程序信息的SparkConf对象。）
    -   **设置`SparkConf`参数**，如appName、master等 （**appName参数是应用程序在集群UI上显示的名称**。master是一个Spark、Mesos或YARN集群的URL，或者一个在本地模式下运行的特殊的`local`字符串。在实践中，当在集群上运行时，您不希望在程序中硬编码master，而是希望使用spark-submit启动应用程序并在那里接收它。然而，对于本地测试和单元测试，您可以通过`local`来运行进程中的Spark。）
-   **基于`SparkConf` 对象 创建 `SparkContext` 对象**
-   **基于 `SparkContext` 即上下文环境对象创建RDD**
-   使用**转换算子Transformation对RDD进行转换**，得到新的RDD
-   使用缓存算子将需要重用的RDD进行缓存（可选）
-   **使用 行动算子Action类触发一次并行运算（Spark会对计算进行优化后再执行）**
-   **关闭 `SparkContext`**

