# Spring、SpringBoot、SpringCloud之间的关系？


SpringCloud包含了许多子项目，这些子项目呢，都是独立进行内容更新和迭代的，各自都维护着自己的发布版本号。为了避免SpringCloud的版本与其子项目的版本混淆掉，Cloud没有采用常见的数字版本号。而是通过以下的方式来定义版本的信息

```xml
{version.name}.{version.number}
```

说明：

​	version.name表示的是版本号，采用的是英国伦敦地铁的地铁站名来进行命名的，并按照字母的顺序A到Z来对应SpringCloud的版本发布的顺序

​	version.number表示的是版本号，每一个版本的SpringCloud在更新内容积累到一定的量级，或有重大的bug修复时，它就会发布一个叫service releases版本（简称SRX版本），其中这个X是一个递增的数字。



在使用SpringBoot与SpringCloud进行微服务项目开发时，我们需要**根据**项目中的**SpringBoot的版本来决定SpringCloud的版本**，否则会出现许多意想不到的错误。那我们可以通过访问SpringCloud的官方这个网址，来查看SpringCloud与SpringBoot对应的版本信息

https://spring.io/projects/spring-cloud

官网还为我们提供了另外一个访问接口，来获取SpringCloud与SpringBoot对应版本信息，但是它返回的是Json格式的数据：

https://start.spring.io/actuator/info



阿里云脚手架：https://start.aliyun.com/

