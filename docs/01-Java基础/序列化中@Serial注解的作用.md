# 序列化中@Serial注解的作用？（JDK16）

在Java16及以上版本中，引入了一个新注解`@Serial`，用于在序列化相关的代码中提供更好的文档化和维护性。`@Serial`注解主要用于标记哪些与序列化相关的特殊方法和字段。使得这些方法和字段在代码审查和维护时更加清晰。

具体来说，`@Serial`注解可以用于以下几种情况：

-   标记SerialVersionUID字段
-   标记  writeObject 和 readObject方法
-   标记 readResolve 和 writeReplace方法

>   个人理解：`@Serial`注解就类似于`        @Override`注解，后者是用于标记哪些方法是重写的方法
