# wget命令

wget命令是一个在Linux和Unix系统中常用的命令行工具，用于**从网络上下载文件**。它支持HTTP、HTTPS和FTP等协议，并提供了丰富的选项和功能。

基本语法

```shell
wget [options] [URL]
```

常用options

| 选项                          | 说明                              |
| ----------------------------- | --------------------------------- |
| -O, --output-document=FILE    | 指定保存的文件名                  |
| -P, --directory-prefix=PREFIX | 指定保存文件的目录                |
| -c, --continue                | 继续下载中断的文件                |
| -r, --recursive               | 递归下载，下载指定URL中的所有链接 |
| -np, --no-parent              | 不下载上级目录的文件              |
| -nH, --no-host-directories    | 不创建主机目录                    |
| -nd, --no-directories         | 不创建目录结构                    |
| -t, --tries=NUMBER            | 设置重试次数                      |
| -q, --quiet                   | 静默模式，不显示下载进度          |
| -h, --help                    | 显示帮助信息                      |

例如：

下载zookeeper并存放到指定目录

```shell
# wget -P /opt/software http://archive.apache.org/dist/zookeeper/zookeeper-3.6.0/apache-zookeeper-3.6.0-bin.tar.gz --no-check-certificate

# --no-check-certificate 来禁用SSL证书验证，强制wget继续下载文件
```
