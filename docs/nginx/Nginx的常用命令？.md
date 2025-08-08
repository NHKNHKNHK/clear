# Nginx的常用命令？


-   查看版本

```
./nginx -v
```

-   **检查配置文件正确性**

```
./nginx -t
```

-   启动nginx命令

```
./nginx
```

-   停止

```shell
./nginx -s stop
```

示例：

```shell
[root@nhk sbin]# ./nginx 	
[root@nhk sbin]# ps -ef | grep nginx	# 查看相关进程
root       6020      1  0 02:07 ?        00:00:00 nginx: master process ./nginx
nobody     6021   6020  0 02:07 ?        00:00:00 nginx: worker process
root       6023   5890  0 02:08 pts/0    00:00:00 grep --color=auto nginx
[root@nhk sbin]# ./nginx -s stop
[root@nhk sbin]# ps -ef | grep nginx
root       6036   5890  0 02:08 pts/0    00:00:00 grep --color=auto nginx
```

-   **重新加载配置文件**

```shell
./nginx -s reload
```

