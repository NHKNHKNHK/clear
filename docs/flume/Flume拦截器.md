# Flume拦截器

​Flume拦截器负责修改和删除 Event，每个Source 可以配置多个拦截器，形参拦截器链（Interpretor Chain）。

​Flume自带的拦截器主要有时间拦截器（TimeStamp Interceptor）、主机拦截器（Host Intercepor）、静态拦截器（Static Interceptor）

- 时间拦截器主要用于在 Event 的 Header 中加入时间戳
- 主机拦截器主要用于在 Event 的 Header 中加入主机名（或者主机地址）
- 静态拦截器主要用于在 Event 的 Header 中加入固定的 Key 和 Value。

