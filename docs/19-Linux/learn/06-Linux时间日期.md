# 日期时间

## date

基本格式

```shell
date [option]... [+format]
```

选项说明

| 选项           | 说明                                           |
| -------------- | ---------------------------------------------- |
| -d<时间字符串> | 显示指定的 时间字符串 的时间，而**非当前时间** |
| -s<日期时间>   | 设置系统日期时间                               |

参数说明

| 参数            | 说明                     |
| --------------- | ------------------------ |
| <+日期时间格式> | 指定显示时使用的时间格式 |

### 显示当前时间  

演示

```shell
[root@basenode ~]# date		#显示当前时间
Sat Jun 10 15:59:33 CST 2023	
[root@basenode ~]# date +%Y		# 显示当前年份
2023
[root@basenode ~]# date +%m		# 显示当前月份
06
[root@basenode ~]# date +%d		# 显示当前是那一天
10
[root@basenode ~]# date +%Y-%m-%d%H:%M:%S	# 显示当前年月日时分秒
2023-06-1016:00:21
```

### 显示非当前时间 

演示

```shell
[root@basenode ~]# date -d "1 days ago"		# 显示昨天的时间
Fri Jun  9 16:04:32 CST 2023
[root@basenode ~]# date -d "-1 days ago"	# 显示明天的时间
Sun Jun 11 16:04:35 CST 2023
```

### 设置当前系统时间

演示

```shell
[root@basenode ~]# date -s "2002-06-25 11:30:30"
Tue Jun 25 11:30:30 CST 2002
[root@basenode ~]# date
Tue Jun 25 11:30:32 CST 2002
```



## 查看日历 cal

基本格式

```shell
cal [option]		# 默认不加参数显示本月日历
```



## ntpdate

### 恢复当前时间

如果没有ntpdate，则使用下面命令按照

```shell
yum -y install ntpdate
```

演示

```shell
[root@basenode ~]# ntpdate ntp5.aliyum.com
```

## 从硬件获取时间和日期 clock

clock 命令用于从计算机的硬件获得日期和时间

演示

```shell
[root@basenode ~]# clock
Mon 12 Jun 2023 07:23:33 AM EDT  -0.757681 seconds
```

## timedatectl 

timedatectl  命令来源于 rhel/centos7。

timedatectl 命令作为 systemd 系统和服务管理器的一部分，**代替了**以前的 sysviinit 守护进程的 **date命令。**

timedatectl 命令可以**查询和更改系统时钟和设置**


### 显示系统的当前时间、日期、时区等信息

```shell
[root@basenode ~]# timedatectl status		# status可以省略
      Local time: Mon 2023-06-12 07:29:21 EDT
  Universal time: Mon 2023-06-12 11:29:21 UTC
        RTC time: Mon 2023-06-12 11:29:21	# RTC即实时时钟，也称 硬件时钟
       Time zone: America/New_York (EDT, -0400)
     NTP enabled: yes
NTP synchronized: yes
 RTC in local TZ: no
      DST active: yes
 Last DST change: DST began at
                  Sun 2023-03-12 01:59:59 EST
                  Sun 2023-03-12 03:00:00 EDT
 Next DST change: DST ends (the clock jumps one hour backwards) at
                  Sun 2023-11-05 01:59:59 EDT
                  Sun 2023-11-05 01:00:00 EST
```

### 查看当前时区

```shell
[root@basenode ~]# timedatectl | grep Time
       Time zone: America/New_York (EDT, -0400)
```

### 查询所有可用时区

```shell
[root@basenode ~]# timedatectl list-timezones 
Africa/Abidjan
Africa/Accra
Africa/Addis_Ababa
Africa/Algiers
Africa/Asmara
Africa/Bamako
Africa/Bangui
Africa/Banjul
....
```

### 修改当前时区

```shell
[root@basenode ~]# timedatectl set-timezone Asia/Shanghai 	# 设置当前时区为亚洲/上海
```

### 设置时间和日期

```shell
[root@basenode ~]# timedatectl set-time "2023-11-11 10:10:10"
Failed to set time: Automatic time synchronization is enabled  # 报错是因为开启了时间同步

[root@basenode ~]# timedatectl set-ntp no	# 关闭时间同步
[root@basenode ~]# timedatectl set-time 10:10:10	# 设置时间
[root@basenode ~]#
[root@basenode ~]# timedatectl set-time 2023-11-11 	# 设置日期
[root@basenode ~]# timedatectl
      Local time: Sat 2023-11-11 00:00:02 CST
  Universal time: Fri 2023-11-10 16:00:02 UTC
        RTC time: Fri 2023-11-10 16:00:03
       Time zone: Asia/Shanghai (CST, +0800)
     NTP enabled: no
NTP synchronized: no
 RTC in local TZ: no
      DST active: n/a
[root@basenode ~]# timedatectl set-time "2023-11-11 10:10:10" 	# 设置日期时间
[root@basenode ~]# timedatectl
      Local time: Sat 2023-11-11 10:10:16 CST
  Universal time: Sat 2023-11-11 02:10:16 UTC
        RTC time: Sat 2023-11-11 02:10:16
       Time zone: Asia/Shanghai (CST, +0800)
     NTP enabled: no
NTP synchronized: no
 RTC in local TZ: no
      DST active: n/a
```

注意：

​	**只有root用户才能修改系统的日期和时间**

