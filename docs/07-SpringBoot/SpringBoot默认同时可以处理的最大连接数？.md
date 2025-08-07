# SpringBoot默认同时可以处理的最大连接数？

>   参考：[SpringBoot可以同时处理多少请求？一个ip发请求过来，是一个ip对应一个线程吗？对于SpringBoot如何处理 - 掘金](https://juejin.cn/post/7203648441721126972?searchId=202504161500357947E8CE56C09039AC7F)

SpringBoot默认的内嵌容器是Tomcat，所以与其说SpringBoot可以处理多少请求，到不如说Tomcat可以处理多少请求。  

在`spring-boot-autoconfigure`依赖可以看出，Tomcat默认的最大连接数是 8192.

