# 安装 VSCode

导入 Microsoft GPG 密钥：

```shell
[nhk@kk01 ~]$ sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
```

创建一个名为 `vscode.repo` 的新仓库文件：

```shell
[nhk@kk01 ~]$ sudo vi /etc/yum.repos.d/vscode.repo
```

添加如下内容

```shell
[code]
name=Visual Studio Code
baseurl=https://packages.microsoft.com/yumrepos/vscode
enabled=1
gpgcheck=1
gpgkey=https://packages.microsoft.com/keys/microsoft.asc
```

安装 VSCode：

```shell
[nhk@kk01 ~]$ sudo yum install code
```

安装完成后，你可以在应用程序菜单中找到 Visual Studio Code

快捷打开命令：

```shell
[nhk@kk01 ~]$ code
```

