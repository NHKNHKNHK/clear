# Windows上安装ES

## 1 Windows上安装ES

安装路径：https://www.elastic.co/cn/downloads/past-releases/elasticsearch-7-8-0

官方文档：https://www.elastic.co/guide/index.html

官网首页：https://www.elastic.co/cn/

ES在Windows上部署比较简单，解压即用

## 2 ES目录结构

Windows 版的 Elasticsearch 压缩包，**解压即安装完毕**，解压后的 Elasticsearch 的目录结构如下 ：

-   bin	可执行脚本目录
-   config	配置目录
-   jdk	内置 JDK 目录
-   lib	类库
-   logs	日志目录
-   modules	模块目录
-   plugins		插件目录

## 3 ES启动前的准备

-   Elasticsearch 使用 Java语言开发的，我们的 Elasticsearch 7.8  版本需要JDK 1.8以上，ES默认自己带有JDK环境

-   如果系统配置了 JAVA_HOME ，那么使用系统默认的 JDK；如果没有配置则会使用ES自带的JDK。

-   建议使用系统配置的JDK

-   如果启动ES后窗口闪退。有可能是“空间不足”，可以修改 config/jvm.options 文件

    -   例如

        ```shell
        # 设置JVM初始内存为1G。此值可以设置为与 -Xmx相同，以避免每次垃圾回收完成后JVM重新分配内存
        # Xms represents the initial size of total heap space
        # 设置JVM最大可用内存为1G
        # Xmx represents the maximum size of total heap space
        
        -Xms1g
        -Xmx1g
        ```

## 4 启动ES

进入 bin 文件目录，点击 `elasticsearch.bat` 文件启动 ES 服务 。

注意： 

​	**9300** 端口为 Elasticsearch **集群间组件的通信端口**， **9200** 端口为浏览器访问的 **http协议 RESTful 端口**。

打开浏览器，输入地址： `http://localhost:9200`，测试返回结果，返回结果如下：

```json
{
  "name" : "YOU",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "j6kWNr7FT7SxGNTxgZ4rvA",
  "version" : {
    "number" : "7.8.0",
    "build_flavor" : "default",
    "build_type" : "zip",
    "build_hash" : "757314695644ea9a1dc2fecd26d1a43856725e65",
    "build_date" : "2020-06-14T19:35:50.234439Z",
    "build_snapshot" : false,
    "lucene_version" : "8.5.1",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```
