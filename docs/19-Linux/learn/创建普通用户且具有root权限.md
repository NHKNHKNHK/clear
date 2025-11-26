### **创建普通用户，并让其具有root权限**

配置nhk用户具有root权限，**方便后期加sudo执行root权限的命令**（如果使用root用户可以忽略该步骤）

```shell
# 创建用户 （如果安装Linux时已经创建了，这一步骤可以忽略）
useradd nhk
passwd 123456

# 配置普通用户(nhk)具有root权限，方便后期加sudo执行root权限的命令
vim /etc/sudoers

# 在%wheel这行下面添加一行 (大概是在100行左右位置)

## Allow root to run any commands anywhere 
root    ALL=(ALL)       ALL 

## Allows members of the 'sys' group to run networking, software, 
## service management apps and more.
# %sys ALL = NETWORKING, SOFTWARE, SERVICES, STORAGE, DELEGATING, PROCESSES, LOCATE, DRIVERS

## Allows people in group wheel to run all commands
%wheel  ALL=(ALL)       ALL 

## Same thing without a password
# %wheel        ALL=(ALL)       NOPASSWD: ALL
nhk ALL=(ALL) NOPASSWD: ALL 
```

注意：

​`nhk ALL=(ALL) NOPASSWD: ALL` 这一行不要直接放到root行下面，因为所有用户都属于wheel组，你先配置了nhk具有免密功能，但是程序执行到%wheel行时，该功能又被覆盖回需要密码。所以nhk要放到%wheel这行下面。
