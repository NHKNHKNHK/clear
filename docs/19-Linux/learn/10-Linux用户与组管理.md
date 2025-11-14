# Linux用户与组管理

## 权限介绍

Linux一般将文件可存/取访问的身份分为3个类别：owner（文件所有者）、group（与文件所有者同组的用户）、others（其他人），且三种身份各有 read、write、execute权限。

Linux中的权限：读、写、执行

**1）作用到文件**

-   读：能否读取、查看文件，例如：vim、head、tail等
-   写：能否修改编辑文件，但是**不代表可以删除该文件**，删除一个文件的前提是对该文件所在目录具有可写（w）权限才能删除该文件。
-   执行：可执行，可以被系统执行	

**2）作用到目录**

-   读：ls能否查看目录内容（类似于Windows中能否打开文件夹）
-   写：能否修改目录，例如：**目录内创建、删除、移动、重命名目录**
-   执行：**可以进入该目录**

## GID、UID

-   在Linux中，任意一个文件或程序都归属于特定的“用户”。任意一个用户都有一个唯一的身份标识UID。任意一个用户至少属于一个“用户分组”GID。用户可以同时在多个用户分组下。
-   root用户的UID为0；系统用户的UID为1~999；普通用户的UID在不指定的情况下从1000开始。创建用户账号时会默认创建一个与用户名相同的组，该组是用户的主组。普通用户的GID默认也是从1000开始

## 1 用户文件与组文件

### 1.1 用户账户文件 /etc/passwd

​	/etc/passwd文件 主要作用是校验用户的登录名、加密口令数据项、用户ID（UID）、默认用户分组ID（GID）、用户信息、用户登录子目录、登陆后使用的shell

**注：存放了出密码外的信息，密码放置在影子文件（shadow）**

```shell
[root@redhat01 ~]# cat /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
games:x:12:100:games:/usr/games:/sbin/nologin
ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin
nobody:x:99:99:Nobody:/:/sbin/nologin
systemd-network:x:192:192:systemd Network Management:/:/sbin/nologin
dbus:x:81:81:System message bus:/:/sbin/nologin
polkitd:x:999:998:User for polkitd:/:/sbin/nologin
...
nhk:x:1000:1000:nhk:/home/nhk:/bin/bash

# 说明
nhk 	表示登录名
x		表示加密的口令
1000    表示UID   其中，root用户UID为0、系统用户UID1~999、普通用户除非管理员指定，默认从1000开始
1000	表示GID
nhk		表示用户信息
/home/nhk       表示HOME目录（用户主目录）
/bin/bash       表示登录后执行的shell
```

演示

```shell
# 新建用户bobby、user1、user2，将user1和user2加入bobby群组
useradd bobby
useradd user1
useradd user2
usermod -G bobby user1
usermod -G bobby user2

# 查看用户账户
cat /etc/passwd

内容格式如下：
bobby:x:1000:1000::/home/bobby:/bin/bash
user1:x:1001:1001::/home/user1:/bin/bash
user2:x:1002:1002::/home/user2:/bin/bash

```

### 1.2 用户影子文件 shadow

由于所有用户对/etc/passwd文件均有读取权限，为了增强系统安全性，Linux广泛采用shadow（影子）文件机制，将**加密的口令转移到/etc/passwd 文件里**，该文件**只有root用户可读**。同时，/etc/passwd中密文域显示一个 x

```shell
[root@redhat01 ~]# cat /etc/shadow
root:$6$LLOgOMouv/.wf1HH$OzemgaaNSJqGbzbGYThPdKlmllSuzKj3.Zki9wADol3TPo/4njFtBIx5FGPnOT4UD.91rSarqmsyKVBSFLkVE1::0:99999:7:::
bin:*:16925:0:99999:7:::
daemon:*:16925:0:99999:7:::
adm:*:16925:0:99999:7:::
lp:*:16925:0:99999:7:::
sync:*:16925:0:99999:7:::
shutdown:*:16925:0:99999:7:::
。。。。

postfix:!!:19426::::::
ntp:!!:19426::::::
tcpdump:!!:19426::::::
nhk:$6$WdxgNgeMOLedLvzE$G/ztFCjNEW09ba4XdMc1Itq.40O7CT16s/KeZgtJdwB6xII63kwBm6xSy8GoNz2Msw6/Gp2VuYJReke5fcxIO0::0:99999:7:::

```

/etc/shadow文件的每一行有9个数据项，每个数据项采用冒号隔开，格式如下：

> username:passwd:lastchg:min:max:warn:inactive:expire:flag
>
> 其中：
>
> username           用户登录名
>
> passwd                加密的用户口令
>
> lastchg                 表示从1970年1月1日起到上次修改口令所经过的天数
>
> min                       表示两次修改口令之间至少经过的天数
>
> max                      表示口令还会有效的最大天数，如果是99999则表示永不过期
>
> warn					 表示口令失效前多少天内系统向用户发出警告
>
> inactive 				表示禁止登录前用户名还有效的天数
>
> expire                    表示用户被禁止登录的时间
>
> flag                  	   保留域，展未使用                                            

演示

```shell
# 当前用户为root用户，可用看到文件
[root@basenode ~]# vim /etc/shadow

# 切换用户至user1，发现使用上述命令打开的是一个空文件
[root@basenode ~]# su user1
[user1@basenode root]$ cat /etc/shadow
cat: /etc/shadow: Permission denied

```

### /etc/login.defs文件

建立用户账户时会根据/etc/login.defs文件的配置设置用户账户的某些选项。该配置文件的有效设置内容如下：

```shell
MAIL_DIR        /var/spool/mail   #用户邮箱目录

MAIL_FILE      .mail
PASS_MAX_DAYS   99999	#账户密码最长 有效天数
PASS_MIN_DAYS   0		#账户密码最短 有效天数
PASS_MIN_LEN    5		#账户密码的最小长度
PASS_WARN_AGE   7		#账户密码过期前提警告的天数

UID_MIN                  1000	#用useradd命令创建账户时自动产生的最小UID
UID_MAX                 60000
SYS_UID_MIN               201
SYS_UID_MAX               999
GID_MIN                  1000   #用groupadd命令创建组时自动产生的最小GID
GID_MAX                 60000

CREATE_HOME     yes		#创建用户账户时是否为用户创建主目录
```



### 1.3 用户组账号文件 /etc/group

​	每个用户都有一个组，系统可以对一个用户组中所有用户进行集中管理。不同Linux系统对用户组管理稍有不同，如：

Linux下用户属于与它同名的组，这个用户组在创建用户时同时创建。

用户组的管理涉及用户组的添加、删除和修改。组的增加、删除和修改实际上就是对/etc/group 文件的更新。

**组账号**的信息存放在**/etc/group**文件中，而关于**组管理的信息**（组口令、组管理员等）则存放在**/etc/gshadow**文件中。

```shell
[root@redhat01 ~]# cat /etc/group
root:x:0:	# root用户GID为0
bin:x:1:
daemon:x:2:
sys:x:3:
。。。。

ntp:x:38:
stapusr:x:156:
stapsys:x:157:
stapdev:x:158:
tcpdump:x:72:
nhk:x:1000:nhk

```

> 下面以一个例子说明其中含义：
>
> ```
> bin:x:1:root,bin,daemon
> ```
>
> 其中
>
> bin						表示用户分组名
>
> x                            表示加密过的用户分组口令
>
> 1                            表示用户分组ID（GID）
>
> root,bin,daemon  以逗号分割的成员用户名单

演示

```shell
[root@basenode ~]# cat /etc/group

postdrop:x:90:
postfix:x:89:
bobby:x:1000:user1,user2
user1:x:1001:
user2:x:1002:

# 在/etc/group文件中，用户的主组并不把该用户作为成员列出，只有用户的附属组才会把该用户作为成员列出

# 用户bobby的主组是bobby，但/etc/group文件中组bobby的成员列表只有user1、user2，并没有bobby
```



### 1.3、组账号文件 /etc/gshadow

/etc/gshadow 文件用于**存储组的加密口令、组管理员等信息**，该**文件只有root用户可以读取**。每个组账号在gshadow文件中占一行，并以":"分隔为4个域：

```
组名称:加密后的组口令(没有就!):组管理员:组成员列表
```

组账号文件的主要功能是加强组口令的安全性。所采取的安全机制是，将组口令与组的其他信息相分离

```
[root@redhat01 ~]# cat /etc/gshadow
root:::
bin:::
daemon:::
sys:::
。。。。

ntp:!::
stapusr:!::
stapsys:!::
stapdev:!::
tcpdump:!::
nhk:!!::nhk
```

> 其中
>
> ```
> nhk:!!::nhk
> ```
>
> nhk          表示用户组名
>
> !!               表示加密的口令
>
> nhk           :: 后面的表示组成员列表

演示

```shell
# 可以查看到信息
[root@basenode ~]# cat /etc/gshadow

# 切换用户
[root@basenode ~]# su user1
[user1@basenode root]$ cat /etc/gshadow
cat: /etc/gshadow: Permission denied  
```



### 1.5、验证用户和组文件 pwck grpck

## 2、用户和组管理

用户账户管理包括新建用户、设置用户账户口令、用户账户维护等

### 2.1、添加用户 useradd

新建用户可以使用**useradd或adduser**

格式如下：

```shell
useradd [-c comment][-d dir][-e expire][-g group][-G group1,group2...][-m][-k skel_dir][-u uid][-s shell][-r role1,role2...] username
```

| 参数                | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |
| -c comment          | 提供有关login参数指定的用户的一般信息（用户的注释性信息）。  |
| -d dir              | **指定用户的主目录** dir参数是完整路径名                     |
| -e expire           | 标识用户账号的截止日期（禁用账户的日期，格式 YYYY-MM-DD）。缺省值为0 |
| -g group            | **标识用户的主组**（添加用户到某个组）                       |
| -G group1,group2... | 标识用户所属组                                               |
| -f inactive_days    | 设置账户过期多少天后用户账户被禁用。如果为0，账户过期立即被禁用；如果为-1，账户过期后，将不被禁用 |
| -m                  | 如果用户主目录不存在，则自动创建一个。缺省情况下不建立主目录 |
| -M                  | 不要创建用户主目录                                           |
| -n                  | 不要为用户创建用户私人组                                     |
| -p passwd           | 加密的口令                                                   |
| -k skel_dir         | 将缺省文件从skel_dir复制到用户的主目录下。                   |
| -u uid              | 指定用户标识                                                 |
| -s shell            | 定义会话初始化时用户的运行程序（指定用户的登录shell，默认为/bin/bash）。shell参数是完整路径名 |
| -r role1,role2...   | 列出该用户的管理角色。                                       |

注意：

​	**所有创建的普通用户，都会在/home目录下创建自己的主目录**

演示

```shell
# 新建用户user3，UID为1010，指定其所属私有组group1(group1组标识为1010),用户主目录为/home/user3,
# 用户的shell为/bin/bash，用户密码为12345678，账户永不过期
[root@basenode ~]# groupadd -g 1010 group1

[root@basenode ~]# useradd -u 1010 -d /home/user3 -s /bin/bash -p 12345678 -f -1 user3
[root@basenode ~]# tail -1 /etc/passwd   	# 查看/etc/passwd最后一行数据
user3:x:1010:1011::/home/user3:/bin/bash

[root@basenode ~]# grep user3 /etc/shadow   # 查询/etc/shadow 符合字符串‘user3’的内容
user3:12345678:19449:0:99999:7:::           # 该查询方式下生成的密码是明文，即12345678


# 如果用户存在
[root@basenode ~]# adduser user3
adduser: user 'user3' already exists
```



### 设置用户账户口令 passwd

passwd命令**指定和修改用户账户口令**，超级用户可以为自己和其他用户设置口令，普通用户只能为自己设置口令

格式如下：

```
passwd [选项] 用户名
```

| 选项 | 描述                                                         |
| ---- | ------------------------------------------------------------ |
| -l   | 锁定（停用）用户账户                                         |
| -u   | 口令解锁                                                     |
| -d   | **将用户口令设置为空**。与未设置口令不同，未设置口令的账户无法登录系统，而口令为空的可以 |
| -f   | 强迫用户下次登陆时必须修改口令                               |
| -n   | 指定口令的最短存活期                                         |
| -x   | 指定口令的最长存活期                                         |
| -w   | 口令要到期前提前警告的天数                                   |
| -i   | 口令过期后多少天停用账户                                     |
| -s   | 显示账户口令的简短信息状态                                   |

演示

```shell
[root@basenode ~]# passwd	# root用户为自己修改口令
Changing password for user root.
New password: 
BAD PASSWORD: The password is shorter than 8 characters  # 提示密码长度小于8
Retype new password:       
passwd: all authentication tokens updated successfully.   # 再次输入密码即成功修改
[root@basenode ~]# passwd user1
Changing password for user user1.
New password: 
BAD PASSWORD: The password is shorter than 8 characters
Retype new password: 
passwd: all authentication tokens updated successfully.

```

注：

- 普通用户修改口令时，passwd命令会先询问原来的口令，只有通过认证才可以修改
- **root用户指定口令时，不需要知道原来的口令直接修改即可**

- 系统密码默认会选择字母、数字和特殊符合组成的密码，长度至少为8，**修改时密码过于简单，系统会提示，再次输入即可修改成功**

### 修改账户和密码有效期 chage

格式

```shell
chage [选项] username
```

chang 命令可以修改账户和密码有效期

> 选择
>
> -l			列出账户口令属性的各个数值
>
> -I (哎)	口令过期多少天停用用户
>
> -n		指定口令的最短存活期
>
> -M		指定口令的最长存活期
>
> -E		用户账户到期作废日期
>
> -d		设置口令上一次修改的日期
>
> -W		口令要到期前提前警告的天数

演示

```shell
# 设置user1用户最短口令存活期6天，最长口令存活期为60天，口令到期前5天提醒
[root@basenode ~]# chage -m 6 -M 60 -W 5 user1
[root@basenode ~]# chage -l user1
Last password change					: Apr 02, 2023
Password expires					: Jun 01, 2023
Password inactive					: never
Account expires						: never
Minimum number of days between password change		: 6
Maximum number of days between password change		: 60
Number of days of warning before password expires	: 5

# 说明
Last password change 最近一次密码修改时间
Password expires	密码过期时间
Password inactive	密码失效时间
Account expires		账户过期时间
Minimum number of days between password change	两次改变密码之间相距的最小天数
Maximum number of days between password change	两次改变密码之间相距的最大天数
Number of days of warning before password expires	在密码过期之前警告的天数
```

### 查看用户是否存在 id

格式

```
id 用户名
```

演示

```shell
[root@basenode ~]# id nhk
id: nhk: no such user
[root@basenode ~]# id root
uid=0(root) gid=0(root) groups=0(root)
```



### 2.2、修改用户信息 usermod

usermod命令用户修改用户的属性

格式如下：

```
usermod 选项 用户名
```

- Linux一切皆文件，因此创建用户也就是修改配置文件的过程。用户的信息保存在/etc/passwd中，可以直接用文本编辑器来修改其中的用户参数项目，也可以使用usermod命令修改已经创建的用户的信息

该命令的参数与useradd一致，列出几个常用的：

| 选项  | 说明                                                         |
| ----- | ------------------------------------------------------------ |
| -c    | 填写用户账户的备注信息                                       |
| -d -m | 参数-d和-m连用，可重新指定用户的家目录并自动把旧的数据迁移过去 |
| -e    | 账户的到期时间，格式 YYYY-MM-DD                              |
| -g    | **变更所属用户组**  （例如：usermod -g meifa nhk 即将nhk用户加入 meifa组） |
| -G    | 变更扩展用户组                                               |
| -L    | 锁定用户，禁止其登录系统                                     |
| -U    | 解锁当前用户，允许其登录系统                                 |
| -s    | 变更默认终端                                                 |
| -u    | 修改用户的UID                                                |

演示

```shell
# 查看用户账户user1的默认信息
[root@basenode ~]# id user1
uid=1001(user1) gid=1001(user1) groups=1001(user1),1000(bobby)

# 将用户user1加入root用户组，(扩展组列表会出现root用户组字样，基本组不会受到影响)
[root@basenode ~]# usermod -G root user1
[root@basenode ~]# id user1
uid=1001(user1) gid=1001(user1) groups=1001(user1),0(root)

# -u 修改user1的UID，-g可以改变用户基本组ID，-G可以改变用户扩展组ID
[root@basenode ~]# usermod -u 8888 user1
[root@basenode ~]# id user1
uid=8888(user1) gid=1001(user1) groups=1001(user1),0(root)

# 修改user1主目录/var/user1 把启动shell修改为/bin/tcsh，完成后恢复带初始状态
[root@basenode ~]# usermod -d /var/user1 -s /bin/tcsh user1
[root@basenode ~]# tail -3 /etc/passwd
user1:x:8888:1001::/var/user1:/bin/tcsh
user2:x:1002:1002::/home/user2:/bin/bash
user3:x:1010:1011::/home/user3:/bin/bash
[root@basenode ~]# usermod -d /var/user1 -s /bin/bash user1

```

### 禁用和恢复用户账号

- 有时需要临时禁用一个账号而不是删除它。
- 禁用用户账号可以用passwd 或 usermod命令实现
- 也可以直接修改/etc/passwd或/etc/shadow文件

演示

暂时禁用和恢复user3账户，可以使用如下三种方式

1）使用passwd命令（被锁定用户的密码必须是使用passwd命令生成的）

使用passwd命令禁用user1账户，利用grep命令查看，可以看到禁用和恢复用户账号

- 有时需要临时禁用一个账号而不是删除它。
- **禁用用户账号可以用passwd** 或 **usermod**命令实现
- 也可以**直接修改/etc/passwd或/etc/shadow文件**

演示

暂时禁用和恢复user3账户，可以使用如下三种方式

#### 1）使用passwd命令

（被锁定用户的密码必须是使用passwd命令生成的）

使用**passwd命令禁用**user1账户，利用grep命令查看，可以看到被锁定的**账户密码栏前面会加上“!!”**

```shell
# 修改用户密码
[root@basenode ~]# passwd user1
Changing password for user user1.
New password: 
BAD PASSWORD: The password is shorter than 8 characters
Retype new password: 
passwd: all authentication tokens updated successfully.

# 查看用户user1的口令文件
[root@basenode ~]# grep user1 /etc/shadow
user1:$6$EegjG2tf$6.63AWImvNXpTlh/TTXlcF9myEvQtj1gaxLWvXW8JhmGOeCRl.fGk9D4znojtAy.N499lgglYrejG9/sZBLcF1:19449:6:60:5:::
[root@basenode ~]# passwd -l user1  	# 锁定用户user1
Locking password for user user1.
passwd: Success

[root@basenode ~]# grep user1 /etc/shadow    # 查看用户user1的口令文件，注意口令前面的 !!
user1:!!$6$EegjG2tf$6.63AWImvNXpTlh/TTXlcF9myEvQtj1gaxLWvXW8JhmGOeCRl.fGk9D4znojtAy.N499lgglYrejG9/sZBLcF1:19449:6:60:5:::

[root@basenode ~]# passwd -u user1  	# 解锁user1账户锁定，重新启用user1账户
Unlocking password for user user1.
passwd: Success

```

#### 2）使用usermod命令

**使用usermod命令禁用**user1账户，利用grep命令查看，可以看到被锁定的**账户密码栏前面会加上“!”**

```shell
# 查看用户user1被锁定前的口令文件
[root@basenode ~]# grep user1 /etc/shadow
user1:$6$EegjG2tf$6.63AWImvNXpTlh/TTXlcF9myEvQtj1gaxLWvXW8JhmGOeCRl.fGk9D4znojtAy.N499lgglYrejG9/sZBLcF1:19449:6:60:5:::
# 禁用用户user1
[root@basenode ~]# usermod -L user1
# 查看用户user1被锁定后的口令文件
[root@basenode ~]# grep user1 /etc/shadow
user1:!$6$EegjG2tf$6.63AWImvNXpTlh/TTXlcF9myEvQtj1gaxLWvXW8JhmGOeCRl.fGk9D4znojtAy.N499lgglYrejG9/sZBLcF1:19449:6:60:5:::
# 解除用户user1
[root@basenode ~]# usermod -U user1

```

#### 3）直接修改用户账户配置文件

可将**/etc/passwd文件或/etc/shadow**文件中关于user1用户的**passwd域的第一个字符前面加上一个“*”**，达到禁用账户的目的，在需要恢复的时候只需要删除字符“*“即可。

如果至少禁用用户账户登录系统，可以将其启动shell的设置为/bin/false或者/bin/null即可

```shell
[root@basenode ~]# grep user1 /etc/shadow
user1:$6$EegjG2tf$6.63AWImvNXpTlh/TTXlcF9myEvQtj1gaxLWvXW8JhmGOeCRl.fGk9D4znojtAy.N499lgglYrejG9/sZBLcF1:19449:6:60:5:::
[root@basenode ~]# vim /etc/shadow
[root@basenode ~]# grep user1 /etc/shadow
user1:*$6$EegjG2tf$6.63AWImvNXpTlh/TTXlcF9myEvQtj1gaxLWvXW8JhmGOeCRl.fGk9D4znojtAy.N499lgglYrejG9/sZBLcF1:19449:6:60:5:::

# 将其启动shell的设置为/bin/false或者/bin/null即可
vim /etc/passwd

[root@basenode ~]# su user1  
[root@basenode ~]# whoami     
root    # 用户切换失败，证明禁用成功

```



### 2.3、删除用户 userdel

删除账户，可以**直接删除/etc/passwd和/etc/shadow文件中想要删除的用户所对应的行**即可，或者**使用userdel命令删除**

格式如下：

```
userdel 选项 用户名
```

注意：

​	删除用户时，**默认情况下用户主目录不会被删除**

| 参数 | 说明                               |
| ---- | ---------------------------------- |
| -r   | 删除用户时，连同账号主目录一起删除 |

**删除用户账号时，非用户主目录下的文件不会被删除，管理员可以用find命令搜索删除，命令如下：**

```shell
find / -user 用户名-exec rm {} \
```

### 2.4、创建用户组 groupadd

​	每个用户都有一个组，系统可以对一个用户组中所有用户进行集中管理。不同Linux系统对用户组管理稍有不同，如：

Linux下用户属于与它同名的组，这个用户组在创建用户时同时创建。

用户组的管理涉及用户组的添加、删除和修改。组的增加、删除和修改实际上就是对/etc/group 文件的更新。

**groupadd**命令或者**addgroup**命令可以指定群组名称来建立新的组账号

注：

- 如果删除的组是某个用户的主组，则该组不能被删除。

格式如下：

```shell
groupadd [options] 用户组名
```

常用参数

| 选项          | 说明                                                         |
| ------------- | ------------------------------------------------------------ |
| -g            | 组ID值，GID。除非使用-o，否则该值必须唯一。不可为负数，并且>=500，0~499传统上是保留给系统账号的 |
| -o            | 配合上面-g使用，可以设定不唯一的GID（强制接收更改的组的GID为重复的号码） |
| -r            | 用来建立新的系统账号                                         |
| -n group-name | 更改组名                                                     |
| -f            | 新增一个已存在的账号，系统会出现错误信息并结束该操作。不新增用户组。配合-o可以创建重复用户组 |

演示：

```shell
[root@redhat01 ~]# groupadd -g 5400 testbed
[root@redhat01 ~]# groupadd -g 5401 testbed
groupadd: group 'testbed' already exists
[root@redhat01 ~]# groupadd -g 5401 -f -o testbed
[root@redhat01 ~]# groupadd -g supersun
groupadd: invalid group ID 'supersun'
[root@redhat01 ~]# 
[root@redhat01 ~]# groupadd -g -f supersun
groupadd: invalid group ID '-f'
[root@redhat01 ~]# groupadd -g 5400 -f supersun
[root@redhat01 ~]# groupadd -g 5400 -f -o supersun
[root@redhat01 ~]# 
[root@redhat01 ~]# cat /etc/group
root:x:0:
bin:x:1:
daemon:x:2:
sys:x:3:
adm:x:4:
。。。

nhk:x:1000:nhk
testbed:x:5400:
supersun:x:5401:
[root@redhat01 ~]# 

```

### 为组添加用户

使用useradd命令创建用户不带任何参数时，会同时创建一个和用户账户同名的组，称为主组。当一个组中必须包含多个用户时，则需使用附属组。**在附属组中添加、删除用户都用gpasswd命令**。

格式为：

```
gpasswd [选项] [用户] [组]
```

> 选项
>
> -a	把用户加入组
>
> -d	把用户从组删除
>
> -r	取消组的密码
>
> -A 	给组指派管理员

注：

- 只有root用户和组管理员才有资格使用该命令

演示

```shell
# 要把user1用户加入testgroup组，并指派user1为组管理员
[root@basenode ~]# groupadd testgroup
[root@basenode ~]# gpasswd -a user1 testgroup
Adding user user1 to group testgroup
[root@basenode ~]# gpasswd -A user1 testgroup

```



### 2.5、修改用户组属性 groupmod

格式如下：

```
groupmod 选项 用户组名
```

| 选项          | 描述                                        |
| ------------- | ------------------------------------------- |
| -g            | 组ID值，GID。除非使用-o，否则该值必须唯一。 |
| -o            | 配合上面-g使用，可以设定不唯一的GID         |
| -n group_name | 更改用户组名                                |

演示

```shell
# 修改 testbed组名为 testbed-new
[root@redhat01 ~]# groupmod -n testbed-new testbed
[root@redhat01 ~]# 
# 修改 testbed-new组id为 5404
[root@redhat01 ~]# groupmod -g 5404 testbed-new 
[root@redhat01 ~]# 
[root@redhat01 ~]# groupmod -g 5405 -n testbed-ord testbed-new 
[root@redhat01 ~]# cat /etc/group
root:x:0:
bin:x:1:
daemon:x:2:
....

tcpdump:x:72:
nhk:x:1000:nhk
supersun:x:5401:
testbed-ord:x:5405: 
```

### 2.6、删除用户组 groupdel

格式如下：

```
groupdel 用户组名
```

```shell
[root@redhat01 ~]# groupdel supersun 
[root@redhat01 ~]# groupdel testbed-ord 
[root@redhat01 ~]# cat /etc/group
root:x:0:
bin:x:1:
。。。。

stapdev:x:158:
tcpdump:x:72:
nhk:x:1000:nhk
```

### 切换用户 su

su命令可以切换用户身份，使用户在不退出的情况下切换到其他用户

基本格式

```
su 用户名
```

注意：

-   root用户可以随意切换用户，而不用输入密码
-   普通用户切换用户需要输入密码

### 查看登录用户信息 who 

**who am i** 查看登录当前Linux的用户

**whoami** 查看当前所在会话

演示

```shell
# 当前Linux是采用root用户登录进来的
[nhk@basenode root]$ who am i
root     pts/0        2023-06-11 13:09 (192.168.188.1)
[nhk@basenode root]$ whoami
nhk
```

### 设置普通用户具有root权限 sudo

sudo（substitute user do）命令：即给普通用户临时具有root用户的权限

注意：

​	**需要使用sudo命令的普通用户必须在 /etc/sudoers 文件中指定**

​	sudoer文件只有root用户才有权限去修改

| 参数      | 说明                                                     |
| --------- | -------------------------------------------------------- |
| -l        | 查看当前用户可以执行的命令（列出用户的权限）             |
| -k        | 让sudo命令密码有效的时间戳失效，下次再次执行需要输入密码 |
| -v        | 刷新sudo命令密码有效时间戳，让有效期延长5分钟            |
| -u 用户名 | 指定执行命令的用户                                       |

**修改sudoer文件**（必须root用户修改）

```shell
[root@basenode ~]# vi /etc/sudoers

# 说明：也可以使用 visudo 去编辑该文件，因为该命令自带语法检查
```

修改 /etc/sudoers 文件，找到100行左右，如下所示（演示的是给nhk用户）

```shell
## Allow root to run any commands anywhere
root    ALL=(ALL)       ALL
nhk     ALL=(ALL)       ALL


# 参数说明
第一个 ALL		可以在哪些主机上使用sudo
第二个 ALL		可以以哪些身份去执行命令
第三个 ALL		可以执行哪些命令
```

注意：

​	/etc/sudoers 是readonly文件，默认不支持修改，即使是root用户修改以后，也需要 :wq! 强制退出

如果想要 nhk用户**使用sudo命令时，不需要输入密码**，则在  /etc/sudoers 文件，找到100行左右做出如下修改

```shell
## Allow root to run any commands anywhere
root    ALL=(ALL)     ALL

## Allows people in group wheel to run all commands
%wheel  ALL=(ALL)       ALL
nhk     ALL=(ALL)       NOPASSWD:ALL
```

注意：

​	nhk这一行不要直接放到root行下面，因为**所有用户都属于wheel组，你先配置了nhk具有免密功能，但是程序执行到%wheel行时，该功能又被覆盖回需要密码。所以nhk要放到%wheel这行下面**。



## 3、文件权限

### 3.1、文件属性

​	Linux系统是一种典型的多用户系统，不同的用户处于不同的地位，拥有不同的权限。为了保护系统的安全性，Linux系统对不同的用户访问同一文件（包括目录文件）的权限做了不同的规定。在Linux中我们可以使用 ll 或 ls命令显示一个文件的属性以及文件的所属用户及所属组

```shell
[root@basenode /]# ll
total 16
lrwxrwxrwx.   1 root root    7 Dec  1  2022 bin -> usr/bin
dr-xr-xr-x.   5 root root 4096 Dec  1  2022 boot

# 从左到右
dr-xr-xr-x 表示的是	文件的类型以及权限
1  5 	  表示的是链接数，如果是文件，则表示的是硬链接数  如果是目录，则表示的是子文件夹个数
root root  分别表示的是 文件属主、文件属组
7 4096		表示的是文件的大小
Dec  1  2022 	表示的是文件建立或修改的时间
bin -> usr/bin		表示的是文件名字
```



### 3.2、使用chmod修改文件/目录的访问权限

用户可使用“**chmod**”命令修改文件权限，权限通常有两种表示方法，数字表示法，文字表示法

```
原始权限         转为数字  	      数字表示法

rwxrwxrwx       421 421 421	  	777
rwxr-xr-x       421 401 401	  	755
rw-rw-rw-       420 420 420	  	666
rw-r--r--     	420 400 400	   	644
```

#### 数字表示法777

使用chmod改变权限，格式如下

```
chmod xxx 文件名    	其中xxx表示数字

chmod -R xxx 文件名	 修改整个文件夹里所有文件的所有者、所属组、其他用户都统一修改
```

#### 字符表示法rwx

格式如下：

```
chmod [who] [+ / - / = ] [mode] 文件名

who表示四种不同用户：
	u 表示user（用户）
	g 表示group（同组用户）
	o 表示others （其他用户）
	a 表示all （所有用户），系统默认值

[+ / - / = ]
	+表示增加权限
	-表示减少权限
	=表示重新设定权限

[mode] 表示三种权限
	r 可读 	w 可写 	x 可执行
```

下面为将file1权限由 -rw-r--r-- 改为 -rwxrw----

```
chmod u+x,g+w,o-r ./file
或
[root@redhat01 file1]# chmod u=rwx,g=rw ./file1
```

注意：命令中的逗号前后不能加空格，否则命令错误

##### rwx作用的文件和目录的不同解释

**1）作用到文件**

-   r：代表可读，可以读取、查看
-   w：代表可写，可以修改，但是**不代表可以删除该文件**，删除一个文件的前提是对该文件所在目录具有可写（w）权限才能删除该文件。
-   x：代表可执行，可以被系统执行	

**2）作用到目录**

-   r：代表可读，ls查看目录内容
-   w：代表可写，可以修改，**目录内创建、删除、重命名目录**
-   x：代表可执行，**可以进入该目录**

#### 目录权限的修改

目录权限的修改与文件权限的修改类似，只需要再目录后加上 “*”即可

修改file1目录的权限

```shell
[root@redhat01 opt]# chmod u=rwx,g=rw,o=r ./file1/*
或

[root@redhat01 opt]# chmod 764 ./file1/*
```

**如果改文件中还有其他子目录，则需要使用 “-R”参数**

```shell
[root@redhat01 opt]# chmod -R 764 ./file1/*
```



### 3.3、使用chown改变目录/文件所有权

一般文件的创建者便是文件拥有者，可使用root权限修改其拥有者。

命令格式

```
chown 变更后的拥有者:变更后的组 文件

chown 变更后的拥有者 文件
```

| 选项 | 描述     |
| ---- | -------- |
| -R   | 递归操作 |

```shell
[root@redhat01 opt]# chown nhk file1
[root@redhat01 opt]# ll
total 4
drwxr-xr-x. 2 nhk  root  82 Mar 11 03:55 file1
-rw-r--r--. 1 root root   0 Mar 11 02:50 file12
-rw-r--r--. 1 root root   0 Mar 11 02:50 file13
lrwxrwxrwx. 1 root root   7 Mar 10 07:22 file1.ln -> ./file1
-rw-r--r--. 1 root root 440 Mar 11 02:54 file.zip
drwxr-xr-x. 2 root root   6 Mar  9  2015 rh
[root@redhat01 opt]# chown nhk:nhk file1
[root@redhat01 opt]# ll
total 4
drwxr-xr-x. 2 nhk  nhk   82 Mar 11 03:55 file1
-rw-r--r--. 1 root root   0 Mar 11 02:50 file12
-rw-r--r--. 1 root root   0 Mar 11 02:50 file13
lrwxrwxrwx. 1 root root   7 Mar 10 07:22 file1.ln -> ./file1
-rw-r--r--. 1 root root 440 Mar 11 02:54 file.zip
drwxr-xr-x. 2 root root   6 Mar  9  2015 rh

# 说明 
drwxr-xr-x. 2 
-rw-r--r--. 1 
这里的 2、1的意思是：
		表示的是链接数
			如果是文件，则表示的是硬链接数
			如果是目录，则表示的是子文件夹个数
```

### 3.4、修改所属组 chgrp

基本语法

```shell
chgrp [最终用户组] [文件或目录]		# 改变文件或目录的所属组
```

演示

```shell
[root@basenode opt]# ll
drwxr-xr-x 2 nhk  nhk     6 Jun 11 13:53 kk

[root@basenode opt]# chgrp root kk

[root@basenode opt]# ll
drwxr-xr-x 2 nhk  root    6 Jun 11 13:53 kk
```

