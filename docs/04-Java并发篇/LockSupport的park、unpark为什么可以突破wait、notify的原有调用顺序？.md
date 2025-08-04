# LockSupport的park/unpark为什么可以突破wait/notify的原有调用顺序？

因为unpark获取了一个凭证，之后再调用park方法，就可以名正言顺的凭证消费，故而不会阻塞。

可以理解为高速收费站的ETC

