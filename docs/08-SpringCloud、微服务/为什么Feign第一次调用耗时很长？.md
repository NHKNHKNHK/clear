# 为什么Feign第一次调用耗时很长？

ribbon默认是懒加载的，只有第一次调用的时候才会生成ribbon对应的组件，所以会导致首次调用的时候很慢

## 解决方案

Ribbon：通过`ribbon.eager-load.enabled=ture` 来开启**饥饿加载模式**，这样就可以在程序启动的时候初始化所有需要的一些客户端连接