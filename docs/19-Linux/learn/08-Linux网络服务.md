# VMWare的一些问题

## VMWare的网络

VMware一般情况下有一下三种网络模式

-   **桥接模式**

    -   将虚拟机直接连接到外部物理网络，主机起到了网桥的作用

    -   这种模式下，虚拟机可以直接访问外部网络，并且**对外部网络是可见**的 

    -   原理：相当于**PC主机连接了一个虚拟网桥（由本机的网络虚拟出来的），虚拟网桥连接了虚拟交换机，虚拟交换机可能连接了多台虚拟机**，这样所有的虚拟机就可以连接到网络了。本质上，在这种模式下**，本机PC与 虚拟机处于同一局域网**，它们有着同等关系

        -   优点：局域网内访问虚拟机方便

        -   缺点：局域网内都可以访问到虚拟机，可能会存在安全、隐私问题，还可能会存在网络冲突问题

    -   这种模式下，**虚拟机和PC主机必须配置在同一网段，掩码、网关要一致**

-   **NAT模式**

    -   虚拟机和主机构建一个专用网络，并通过虚拟网络地址转换（NAT）设备对IP地址进行转换

    -   **虚拟机通过共享IP可以访问外部网络，但外部网络无法访问虚拟机**

    -   原理：vmware虚拟出路由器（NAT、DHCP服务器），PC主机的网卡与虚拟路由器相连（相当于虚拟路由器接入到外网），虚拟路由器连接了很多虚拟机，然后虚拟路由器可以为虚拟机分配IP地址	

    -   为什么PC主机能访问到虚拟机：VMware在PC主机上虚拟出一块网卡（即 **VMnet 8**），将虚拟网卡连接上虚拟路由器 

    -   为什么虚拟机能连接外网：因为虚拟机连接上了虚拟路由器，虚拟路由连接上了PC主机，并且虚拟路由器具有NAT功能

        ```
        假设 pc主机VMnet8网卡 192.168.188.1
        	虚拟路由器网关	192.168.188.2
        为什么会这样呢？
        	因为虚拟网卡和虚拟机都在同一网段（同一虚拟子网），所有它们的网关都是 192.168.188.2
        ```

-   **仅主机模式**

    -   虚拟机只与主机共享一个专用网络，**与外部网络无法通信**
    -   原理：vmware虚拟出虚拟交换机、虚拟网卡（即 **VMnet 1**），PC主机上的虚拟网卡与虚拟交换机相连，虚拟交换机上连接了多台虚拟机



## 本机和虚拟机ip不在同一网段，如何互相连接

**桥接模式**

​	桥接模式下，必须将虚拟机ip与PC主机配置在同一网段、相同掩码、相同网关，所有不存在不在同一网段的情况

**NAT模式**

​	NAT模式下，只需要保证PC主机上的虚拟网卡（VMnet8）与虚拟路由器网关及 虚拟机处于同一网段即可连接外网

**仅主机模式**

​	仅主机模式下，PC主机上的虚拟网卡（VMnet1）与虚拟交换机相连，虚拟交换机上连接了多台虚拟机，这样虚拟机即可与PC主机互访

# 配置网络IP地址

## 修改网卡

```shell
vim /etc/sysconfig/network-scripts/ifcfg-ens33
```

修改如下参数

```shell
BOOTPROTO=static

ONBOOT=yes
# IP
IPADDR=192.168.188.100 
# 子网掩码c类默认就是24，这条也可以忽略
NETMASK=255.255.255.0  
# 网关
GATEWAY=192.168.188.2  
# 域名服务器（可以填网关，也可填电信服务器114.114.114.114）
DNS1=192.168.188.2    
```

## **重启网络服务**

```shell
service network restart  # centos6
# 或
systemctl restart NetworkManager.service  # centos7
```

## **修改IP地址后的常见问题**

1）物理机能ping通虚拟机，但虚拟机ping不通物理机，一般为物理机防火墙问题，关闭物理机防火墙即可

2）虚拟机能ping通物理机，但虚拟机ping不通外网，一般是DNS设置错误

3）虚拟机ping www.baidu.com，显示域名服务未知，一般查看gateway网卡和dns设置是否正确

4）如果上述设置完还不行，需要关闭NetworkManager服务

```shell
systemctl stop NetworkManager  # 关闭
systemctl disable NetworkManager  # 禁用
```

5）如果发现systemctl status network 有问题，需要检查ifcfg-ens33

**总结**

centos7有两个网络服务，分别是**network和NetWorkManager**，只保留其中一个即可拥有上网服务

```shell
systemctl start NetworkManager  # 启动NetworkManager
systemctl start network    # 启动network
```



## **修改主机名**

```shell
vim /etc/hostname		# 通过这种方式修改需要重启
```

查询一些跟主机名有关的信息

```shell
hostnamectl   # centos7
```

修改主机名（不要重启）**centos7**

```shell
hostnamectl set-hostname 主机名
```

注意：这种方式修改主机名以后，**不需要进行重启即可生效**

## **hosts映射**

添加主机名与IP地址的映射

```shell
vim /etc/hosts
```

注意：

​	域名劫持就是通过修改hosts文件实现的，需要注意hosts文件的使用

### window修改 hosts

我们可以使用cmd（以超级管理员的方式）使用notepad 命令打开hosts文件，然后就可以修改了

