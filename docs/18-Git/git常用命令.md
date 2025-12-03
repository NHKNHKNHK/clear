# Git常用命令

| 命令                                 | 作用           |
| ------------------------------------ | -------------- |
| git config --global user.name 用户名 | 设置用户签名   |
| git config --global user.email 邮箱  | 设置用户签名   |
| git init                             | 初始化本地库   |
| git status                           | 查看本地库状态 |
| git add 文件名                       | 添加到暂存区   |
| git commit -m "日志信息"  文件名     | 提交到本地库   |
| git reflog                           | 查看历史记录   |
| git reset --hard 版本号              | 版本穿梭       |

## 设置用户签名

基本语法

```shell
# 项目级别/仓库级别：仅在当前本地库范围内有效
# 信息保存位置：./.git/config 文件
git config user.name 用户名
git config user.email 邮箱

# 系统用户级别：登录当前操作系统的用户范围
# 信息保存位置：~/.gitconfig 文件
git config --global user.name 用户名
git config --global user.email 邮箱
```

 **级别优先级**

- 就近原则：项目级别优先于系统用户级别，二者都有时采用项目级别的签名
- 如果只有系统用户级别的签名，就以系统用户级别的签名为准
- 二者都没有不允许

说明：

- 签名的作用：区分不同开发人员的身份。用户的签名信息在每一个版本的提交信息中能够看到，以此确定本次提交是谁做的
- ​**Git首次安装必须设置用户签名，否则无法提交代码**，需要知道的是，这里的用户名和邮箱可以是虚拟的，git不会验证它的真实性

​> 辨析：这里设置的签名和登录远程库(代码托管中心)的账号、密码没有任何关系。

演示：

```shell
没事我很好@YOU MINGW64 /d/桌面		
$ git config --global user.name ninghongkang	# 配置用户名

没事我很好@YOU MINGW64 /d/桌面
$ git config --global user.email 13605975424@163.com	# 配置邮箱（邮箱可以是不存在的，git不会去检验它）

没事我很好@YOU MINGW64 /d/桌面
$ cat ~/.gitconfig		# 查看执行上述命令后写入的信息
[user]
        name = ninghongkang
        email = 13605975424@163.com
```

## 初始化本地库 init

基本语法

```shell
git init
```

演示：

​	在我们的D盘有的 git-space 目录，我们在这个目录中创建 git-demo 目录，进入git-demo 目录，右击选择 Open git Bush here 进入git命令终端 

```shell
没事我很好@YOU MINGW64 /d/git-space/git-demo
$ git init
Initialized empty Git repository in D:/git-space/git-demo/.git/

没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ ll -a		# 查看初始化本地库以后生成的文件
total 4
drwxr-xr-x 1 没事我很好 197121 0 Aug 10 19:36 ./
drwxr-xr-x 1 没事我很好 197121 0 Aug 10 19:35 ../
drwxr-xr-x 1 没事我很好 197121 0 Aug 10 19:36 .git/	# .git 初始化的效果，生成了.git

```

注意：

- **.git 目录中存放的是本地库相关的子目录和文件，不要删除，也不要胡乱修改**

## 查看状态 status

基本语法

```shell
# 查看工作区、暂存区状态
git status	
```

演示：

### 首次查看（工作区没有任何文件）

```shell
没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git status
On branch master	# 表示当前的分支

No commits yet		# 表示当前没有东西需要提交

nothing to commit (create/copy files and use "git add" to track)
```

### 再次查看（检测到未追踪的文件）

```shell
# 我们先创建一个文件，然后再次查看本地库状态
没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ vim hello.txt

没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ cat hello.txt
hello git!

没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git status
On branch master

No commits yet

Untracked files:		# 未追踪的文件，可以使用 git add 命令追踪
  (use "git add <file>..." to include in what will be committed)
        hello.txt

nothing added to commit but untracked files present (use "git add" to track)
```

## 添加暂存区 add

基本语法

```shell
# 添加工作区一个或多个文件的修改到暂存区
git add [file name]
git add 单个文件名|通配符

# 将所有修改加入暂存区	
git add .
```

演示：

```shell
没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git add hello.txt
warning: in the working copy of 'hello.txt', LF will be replaced by CRLF the next time Git touches it
# 警告的意思：将 CRLF 的换行符转换为了 LF（Window换行符是CRLF，Linux换行符是LF）

没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git status			# 再次查看状态
On branch master

No commits yet

Changes to be committed:	# git追踪到了文件，此时文件处于暂存区
  (use "git rm --cached <file>..." to unstage)	# 可以使用 git rm --cached <file>...删除暂存区文件（只是删除暂存区的，工作区的文件还在）
        new file:   hello.txt
```

## 提交本地库 commit

基本语法

```shell
# 提交暂存区内容到本地仓库的当前分支
git commit -m "commit message(注释内容)" [file name]
git commit -m '注释内容'
```

注意：

- 提交到本地库的内容就不能再删除了，只能继续迭代版本

演示：

```shell
没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git commit -m "this is hello world!" hello.txt
# 警告：装换了换行符
warning: in the working copy of 'hello.txt', LF will be replaced by CRLF the next time Git touches it
[master (root-commit) e6f4510] this is hello world!		#  e6f4510 为版本号
 1 file changed, 1 insertion(+)	# 1个文件被改变，1行内容被插入
 create mode 100644 hello.txt
```



## 修改文件再提交

演示：

```shell
# 修改hello.txt
没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ echo "hello world!" >> ./hello.txt

没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ cat hello.txt
hello git!
hello world!

# 查看本地库，发现修改的文件爆红了
没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   hello.txt		# 红色

no changes added to commit (use "git add" and/or "git commit -a")

# 将修改后的文件添加到暂存区
没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git add hello.txt
warning: in the working copy of 'hello.txt', LF will be replaced by CRLF the next time Git touches it

# 提交本地库
没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git commit -m "second commit" hello.txt
warning: in the working copy of 'hello.txt', LF will be replaced by CRLF the next time Git touches it
[master 533c739] second commit
 1 file changed, 1 insertion(+)	
```

## **查看历史记录** log/reflog

基本语法

```shell
git log	[option]	# 查看版本详细信息

# options
--all 					显示所有分支
--pretty=oneline 		将提交信息显示为一行
--abbrev-commit			使得输出的commitId更简短
--graph 				以图的形式显示

git reflog	# 查看版本信息                                     
```

说明：

​	多屏显示控制方式： 

​	空格向下翻页 

​	b 向上翻页 

​	q 退出

演示：

```shell
# 查看版本信息 
没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git reflog
533c739 (HEAD -> master) HEAD@{0}: commit: second commit
e6f4510 HEAD@{1}: commit (initial): this is hello world!


# 查看版本详细信息
没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git log
commit 533c739f2fe0e3be47ba96a8a5c2d9699560199a (HEAD -> master)
Author: ninghongkang <13605975424@163.com>
Date:   Thu Aug 10 20:05:26 2023 +0800

    second commit

commit e6f4510bd0816c14c5f49763267f18f0eba92173
Author: ninghongkang <13605975424@163.com>
Date:   Thu Aug 10 19:53:45 2023 +0800

    this is hello world!
```

## 版本穿梭 reset

```shell
# 基于索引值操作（推荐） 
git reset --hard [局部索引值] 

例如：
git reset --hard a6ace91 
```

```shell
# 使用^符号：只能后退 
git reset --hard HEAD^ 
```

说明：

​	一个^表示后退一步，n 个表示后退 n 步 

```shell
# 使用~符号：只能后退 		表示后退 n 步
git reset --hard HEAD~n 
```

演示：

```shell
# 查看版本信息
没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git reflog
533c739 (HEAD -> master) HEAD@{0}: commit: second commit
e6f4510 HEAD@{1}: commit (initial): this is hello world!

# 切换版本
没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git reset --hard e6f4510
HEAD is now at e6f4510 this is hello world!

# 查看版本信息                                     
没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git reflog
e6f4510 (HEAD -> master) HEAD@{0}: reset: moving to e6f4510
533c739 HEAD@{1}: commit: second commit
e6f4510 (HEAD -> master) HEAD@{2}: commit (initial): this is hello world!
```

**reset** **命令的三个参数对比**

- `--soft` 参数 
    - 仅仅在本地库移动 HEAD 指针

- `--mixed` 参数 
    - 在本地库移动 HEAD 指针 

    - 重置暂存区

- `--hard` 参数 
    - 在本地库移动 HEAD 指针 
    - 重置暂存区 
    - 重置工作区



## **删除文件并找回** 

前提：删除前，文件存在时的状态提交到了本地库。 

基本命令

```shell
# 删除操作已经提交到本地库：指针位置指向历史记录  
# 删除操作尚未提交到本地库：指针位置使用 HEAD
git reset --hard [指针位置] 
```



## 比较文件差异

基本命令

```shell
# 将工作区中的文件和暂存区进行比较 
git diff [文件名] 

# 将工作区中的文件和本地库历史记录比较 
git diff [本地库中历史版本] [文件名] 
```
