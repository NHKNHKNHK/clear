# Linux安装Git

```shell
# 安装git
# 安装第三方包
yum install -y https://repo.ius.io/ius-release-el7.rpm 
yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
# 安装git操作
yum install -y git236
# 查看版本
git --version
```

## Git安装

```shell
[nhk@clear_king opt]$ yum list git
Loaded plugins: fastestmirror
Determining fastest mirrors
base                                                                                                                                  | 3.6 kB  00:00:00     
epel                                                                                                                                  | 4.3 kB  00:00:00     
extras                                                                                                                                | 2.9 kB  00:00:00 
...


[nhk@clear_king opt]$ git --version
git version 1.8.3.1
```

## 使用Git克隆项目

```shell
[nhk@clear_king opt]$ cd /opt/data/
[nhk@clear_king data]$ git clone https://gitee.com/ninghongkang/reggie-takeout.git
[nhk@clear_king data]$ ll
total 4
drwxrwxr-x 6 nhk nhk 4096 May 17 18:23 reggie-takeout
```

