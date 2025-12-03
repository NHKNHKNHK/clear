# git分支操作

在版本控制过程中，使用多条线同时推进多个任务

几乎所有的版本控制系统都以某种形式支持分支。 使用分支意味着你可以把你的工作从开发主线上分离开来进行重大的Bug修改、开发新的功能，以免影响开发主线

分支的好处

- 同时并行推进多个功能开发，提高开发效率  

- 各个分支在开发过程中，如果某一个分支开发失败，不会对其他分支有任何影响。失败的分支删除重新开始即可。

## 分支的操作

| 分支名称            | 作用                         |
| ------------------- | ---------------------------- |
| git branch 分支名   | 创建分支                     |
| git branch -v       | 查看分支                     |
| git checkout 分支名 | 切换分支                     |
| git merge 分支名    | 把指定的分支合并到当前分支上 |

### 查看分支

```shell
# 查看分支
git branch -v

# 查看本地分支 
git branch
```

演示：

```shell
没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git branch
* master

没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git branch -v
* master 533c739 second commit
```

### 创建分支

```shell
git branch 分支名
```

演示：

```shell
# 创建 hot-fix 分支
没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git branch hot-fix

没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git branch -v
  hot-fix 533c739 second commit
* master  533c739 second commit
```

### 切换分支

```shell
git checkout 分支名
```

```shell
# 切换到一个不存在的分支（创建并切换）
git checkout -b 分支名
```

演示：

```shell
没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git checkout hot-fix
Switched to branch 'hot-fix'

没事我很好@YOU MINGW64 /d/git-space/git-demo (hot-fix)
$ git branch -v
* hot-fix 533c739 second commit		# 查看分支，发现*已经执行 hot-fix 分支了
  master  533c739 second commit
```

### 修改分支

```shell
# 修改分支
没事我很好@YOU MINGW64 /d/git-space/git-demo (hot-fix)
$ vim hello.txt
l
没事我很好@YOU MINGW64 /d/git-space/git-demo (hot-fix)
$ vim hello.txt

没事我很好@YOU MINGW64 /d/git-space/git-demo (hot-fix)
$ cat hello.txt
hello git!
hello world!
hot-fix

没事我很好@YOU MINGW64 /d/git-space/git-demo (hot-fix)
$ git status	
On branch hot-fix
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   hello.txt

no changes added to commit (use "git add" and/or "git commit -a")

没事我很好@YOU MINGW64 /d/git-space/git-demo (hot-fix)
$ git add hello.txt				# 将修改后的文件加入暂存区

没事我很好@YOU MINGW64 /d/git-space/git-demo (hot-fix)
$ git status
On branch hot-fix
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   hello.txt


没事我很好@YOU MINGW64 /d/git-space/git-demo (hot-fix)
$ git commit -m "hots-fix commit" hello.txt
[hot-fix 8d7b08a] hots-fix commit		# 将暂存区的文件提交到本地库
 1 file changed, 1 insertion(+)
```

### 合并分支

```shell
# 一个分支上的提交可以合并到另一个分支
git merge 分支名称
```

合并分支的步骤：

- 1）切换到接受修改的分支（被合并，增加新内容）上
  - git checkout 被合并分支名
- 2）执行 merge 命令
  - git merge 有新内容分支名

合并说明：

​	**合并只会修改当前合并的分支，并不会修改合并过来的分支**。例如说，我们有两个分支a、b，现在要将b分支合并到a分支中，最终只会修改a分支，b分支还是原来的样子，不会改变

#### 正常合并

演示：

```shell
# 切换回master分支
没事我很好@YOU MINGW64 /d/git-space/git-demo (hot-fix)
$ git checkout master
Switched to branch 'master'

# 将  hot-fix 分支合并到 master 分支
没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git merge hot-fix
Updating 533c739..8d7b08a
Fast-forward
 hello.txt | 1 +
 1 file changed, 1 insertion(+)
```

#### 产生冲突

演示：

```shell
# 先修改master分支，并提交到本地库
没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ vim hello.txt

没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ cat hello.txt
hello git!
hello world! mster-test
hot-fix

没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git add hello.txt

没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git commit -m "master test" hello.txt
[master 4fef875] master test
 1 file changed, 1 insertion(+), 1 deletion(-)

# 再修改hot-fix分支
没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git checkout hot-fix
Switched to branch 'hot-fix'

没事我很好@YOU MINGW64 /d/git-space/git-demo (hot-fix)
$ vim hello.txt

没事我很好@YOU MINGW64 /d/git-space/git-demo (hot-fix)
$ cat hello.txt
hello git!
hello world!
hot-fix hot-fix test

没事我很好@YOU MINGW64 /d/git-space/git-demo (hot-fix)
$ git add hello.txt

没事我很好@YOU MINGW64 /d/git-space/git-demo (hot-fix)
$ git commit -m "hot-fix test" hello.txt
[hot-fix 77788e9] hot-fix test
 1 file changed, 3 insertions(+), 3 deletions(-)

# 再次切换回 master分支进行合并
没事我很好@YOU MINGW64 /d/git-space/git-demo (hot-fix)
$ git checkout master
Switched to branch 'master'

没事我很好@YOU MINGW64 /d/git-space/git-demo (master)
$ git merge hot-fix
Auto-merging hello.txt
CONFLICT (content): Merge conflict in hello.txt		# 显示发送冲突的文件
Automatic merge failed; fix conflicts and then commit the result.	# 显示合并失败

没事我很好@YOU MINGW64 /d/git-space/git-demo (master|MERGING)	# 出现了MERGING，表示还在合并

# 查看合并状态
没事我很好@YOU MINGW64 /d/git-space/git-demo (master|MERGING)
$ git status
On branch master
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   hello.txt

no changes added to commit (use "git add" and/or "git commit -a")

```

冲突产生的原因：

​	合并分支时，两个分支在**同一个文件的同一位置有两套不同的修改**。Git无法替我们决定使用哪一个。必须人为决定新代码的内容	

### 解决冲突

演示：

```shell
# 手动打开发生冲突的文件

# 内容如下
<<<<<<< HEAD
hello git!
hello world! mster-test
hot-fix
=======
hello git!
hello world!
hot-fix hot-fix test
>>>>>>> hot-fix

# 解决冲突
# 1.手动删除自己不需要的行，保留自己要的行
# 手动修改过的文件如下
hello git!
hello world! mster-test
hot-fix hot-fix test

# 2.手动将修改后的文件加入到暂存区
没事我很好@YOU MINGW64 /d/git-space/git-demo (master|MERGING)
$ git add hello.txt

# 3.提交本地库（注意：此时 git commit 命令不能带上文件名）


没事我很好@YOU MINGW64 /d/git-space/git-demo (master|MERGING)
$ git commit -m "merge test"
[master 4f1a276] merge test

没事我很好@YOU MINGW64 /d/git-space/git-demo (master)	# MERGING 消失，变为正常了
```

解决冲突的总结：

- 当两个分支上对文件的修改可能会存在冲突，例如同时修改了同一个文件的同一行，这时就需要手动解决冲突，解决冲突步骤如下：
  - 1）处理文件中冲突的地方
  - 2）将解决完冲突的文件加入暂存区(add)
  - 3）提交到仓库(commit)

### 删除分支

```shell
# 删除分支时，需要做各种检查
git branch -d b1
# 不做任何检查，强制删除
git branch -D b1 
```

注意：

​	**不能删除当前分支，只能删除其他分支**

## **开发中分支使用原则与流程**

几乎所有的版本控制系统都以某种形式支持分支。 使用分支意味着你可以把你的工作从开发主线上分离

开来进行重大的Bug修改、开发新的功能，以免影响开发主线。

在开发中，一般有如下分支使用原则与流程：

- master （生产） 分支

线上分支，主分支，中小规模项目作为线上运行的应用对应的分支；

- develop（开发）分支

是从master创建的分支，一般作为开发部门的主要开发分支，如果没有其他并行开发不同期上线要求，都可以在此版本进行开发，阶段开发完成后，需要是合并到master分支,准备上线。

- feature/xxxx分支

从develop创建的分支，一般是同期并行开发，但不同期上线时创建的分支，分支上的研发任务完成后合并到develop分支。

- hotfix/xxxx分支

从master派生的分支，一般作为线上bug修复使用，修复完成后需要合并到master、test、 develop分支。

- 还有一些其他分支，在此不再详述，例如test分支（用于代码测试）、pre分支（预上线分支）等等
