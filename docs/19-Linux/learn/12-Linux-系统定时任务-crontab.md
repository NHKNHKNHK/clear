# crontab 系统定时任务

## 服务管理 crontab

重启 crond 服务

```shell
[root@basenode ~]# systemctl restart crond
```

## 定时任务设置 crontab

基本语法

```shell
crontab [选项]
```

| 选项 | 说明                            |
| ---- | ------------------------------- |
| -e   | 编辑 crontab 定时任务           |
| -l   | 查询 crontab 任务               |
| -r   | 删除当前用户所有的 crontab 任务 |

```shell
crontab -e      # 进入 crontab 编辑页面
```

\* * * * * * 执行的任务

| 项目     | 含义                 | 范围                        |
| -------- | -------------------- | --------------------------- |
| 第一个 * | 一小时当中的第几分钟 | 0~59                        |
| 第二个 * | 一天当中的第几小时   | 0~23                        |
| 第三个 * | 一个月当中的第几天   | 1~31                        |
| 第四个 * | 一年当中的第几个月   | 1-12                        |
| 第五个 * | 一周当中的星期几     | 0-7 （0 和 7 都代表星期日） |

特殊符号

| 特殊符号 | 含义                                                         |
| -------- | ------------------------------------------------------------ |
| *        | 代表任何时间。比如第一个 * 就代表一小时中的每一分钟都执行    |
| ,        | 代表不连续的时间。比如 "0 8,12,16 * * * 命令"，就代表每天8点0分、12点0分、16点0分都执行一次命令 |
| -        | 代表连续的时间范围。比如 ”0 5 * * 1-6 命令“，代表周一到周二的凌晨5点0分执行 |
| */n      | 代表每隔多久执行一次。比如 ”*/10 * * * * 命令“，代表每隔10分钟就执行一遍命令 |

演示

每个 1分钟在 /opt/test.txt 文件下追加一句 “hello world”

```shell
[root@basenode ~]# crontab -e
```

文件内容如下

```shell
*/1 * * * * echo "hello world" >> /opt/test.txt                                                
```

查看当前用户的定时任务

```shell
[root@basenode opt]# crontab -l
*/1 * * * * echo "hello world" >> /opt/test.txt
```

等待两分钟后执行

```shell
[root@basenode opt]# cat test.txt 
hello world
hello world
```

删除当前用户的定时任务

```shell
[root@basenode opt]# crontab -r
[root@basenode opt]# crontab -l   # 再次查看定时任务
no crontab for root
```

