

## git commit规范

commit 规范是指在使用版本控制系统（如 Git）时，为了保持提交信息的一致性和可读性而遵循的一套约定或标准。良好的 Commit 规范可以帮助团队成员更容易地理解每次提交的目的和作用，从而提高代码审查和维护的效率。

AngularJS 团队提出的 Commit 规范非常流行，它定义了一个结构化的 Commit 消息格式：

```shell
<type>(<scope>): <subject>
```

Conventional Commits 是一种更为灵活且被广泛采纳的规范，它扩展了 AngularJS 的规范，支持更多的类型，并且可以通过添加 `BREAKING CHANGE` 标记来表示破坏性变更：

```shell
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

-   `<type>`: 提交的类型，例如 `feat` (新功能)、`fix` (修复 bug)、`docs` (文档)、`style` (代码格式)、`refactor` (重构) 等。
-   `<scope>`: 提交影响的范围，例如某个模块或文件名。
-   `<subject>`: 简短描述本次提交的主要内容（不超过50个字符）
-   `<body>`: 更详细的描述，可以有多个段落。
-   `<footer>`: 关闭的 issue 号或者其他重要信息

小结：

​	通过采用 Git Commit 规范，团队可以更容易地维护项目的变更历史，同时也能提升代码审查的效率

**提交的类型**

-   **feat**：新增一个功能（feature）
    -   建议：在新增功能之前，pull最新远程库的master分支。避免代码合并时候的冲突
-   **fix**：修复一个Bug
-   **docs**：文档变更，比如 README，CHANGELOG、CONTIRIBUTE等到
-   style：代码格式，如修改了空格、格式缩进、逗号等等，不改变代码逻辑
-   refactor：代码重构
-   perf：优化相关，比如提示性能、体验
-   test：增加测试
-   build：更变项目构建或外部依赖例如scopes:webpack、gulp、npm等
-   ci：CI配置，脚本文件等更新
-   chore：改变构建流程、或者增加依赖库、工具等
-   **revert**：代码回退
-   config：配置文件修改



## 工作区、暂存区和版本库之间的关系

在 Git 中，工作区、暂存区和版本库是三个核心概念，它们在文件的管理和版本控制流程中各自扮演着重要角色，相互协作实现对代码的高效管理。下面为你详细介绍它们之间的关系。

**工作区（Working Directory）**

工作区是你在本地计算机上实际进行文件编辑和操作的目录。当你克隆一个远程仓库到本地，或者创建一个新的 Git 仓库时，其中的文件和文件夹就构成了工作区。你可以自由地在工作区中添加、修改或删除文件，这些操作不会立即影响到 Git 的版本控制系统。

**暂存区（Staging Area）**

暂存区也被称为索引（Index），它是一个中间区域，用于临时存放你想要提交到版本库的文件更改。

一般存放在 `.git` 目录下的 index 文件（.git/index）中，所以我们把暂存区有时也叫作索引（index）

当你在工作区对文件进行了修改后，可以使用 git add 命令将这些更改添加到暂存区。

暂存区的作用是让你可以选择哪些更改要包含在接下来的提交中，你可以分批次地将不同的更改添加到暂存区，而不是一次性提交所有的更改。

**版本库（Repository）**

版本库是 Git 存储项目历史版本的地方，它包含了所有的提交记录、分支信息等。

工作区有一个隐藏目录 `.git`，这个不算工作区，而是 Git 的版本库（本地版本库）

当你使用 git commit 命令时，暂存区中的更改会被永久保存到版本库中，形成一个新的提交记录。

版本库可以分为**本地版本库**和**远程版本库**，本地版本库存储在你的本地计算机上，而远程版本库通常存储在远程服务器（如 GitHub、GitLab 等）上。



**三者之间的关系和操作流程**

1、工作区 -> 暂存区

使用 git add 命令将工作区中的修改添加到暂存区。

例如，要将工作区中的 example.txt 文件添加到暂存区，可以执行以下命令：

```shell
git add example.txt
```

2、暂存区 -> 版本库

使用 git commit 命令将暂存区中的修改提交到版本库。

例如，将暂存区中的更改提交到本地版本库，并添加提交说明：

```shell
git commit -m "feat: 新增example.txt"
```

3、版本库 -> 远程仓库

使用 git push 命令将本地版本库的提交推送到远程仓库。

例如，将本地的 master 分支推送到远程仓库的 master 分支：

```shell
git push origin master
```

4、远程仓库 -> 本地版本库

使用 git pull 或 git fetch 命令从远程仓库获取更新。

```shell
git pull origin master

# 或者
git fetch origin branch-name
git merge origin/branch-name
```



## git常用命令

**查看分支**

```shell
# 查看本地分支
git branch
# 查看远程分支
git branch -r
# 查看所有分支（包括本地和远程） 
git branch -a
```

**拉取最新的远程分支信息**

```shell
git fetch
```

**切换新分支**，避免直接在 main 或 master 分支上进行开发

例如，切换到远程 vue3 分支（创建并切换到跟踪远程 vue3 分支的本地分支）

```shell
git checkout -b vue3 origin/vue3
```

-   其中：
    -   -b 选项用于创建一个新的本地分支。
    -   vue3 是新创建的本地分支名称。
    -   origin/vue3 是远程仓库中的 vue3 分支

**切换分支**

```shell
git checkout vue3
```

**删除本地分支** 

>   ！！！注意，删除分支前，需要先切换到其他分支

```shell
# 删除本地分支
git branch -d test-branch
# 强制删除本地分支
git branch -D test-branch
# 删除远程分支
git push <远程仓库名> --delete <远程分支名>
git push origin --delete remote-test-branch
```



## 本地新建的分支关联一个远程分支

### 情况一：新建本地分支时同时关联远程分支

如果你在创建本地分支时就想关联到远程分支，可以使用 git checkout -b 命令结合 --track 选项（在较新版本的 Git 中，-b 命令默认会尝试跟踪远程同名分支）。

假设你要创建一个名为 my-vue3 的本地分支并关联到远程仓库 origin 的 origin/vue3 分支，可使用如下命令：

```shell
git checkout -b my-vue3 origin/vue3
```

此命令会创建一个新的本地分支 my-vue3，并且将其设置为跟踪远程仓库 origin 的 origin/vue3 分支。

### 情况二：已存在的本地分支关联远程分支

若本地分支已经创建好了，你可以使用 git branch --set-upstream-to 命令来关联远程分支。

例如，你已经有了一个本地分支 my-vue3，现在要将它关联到远程仓库 origin 的 origin/vue3 分支，可执行以下命令：

```shell
# 切换到 my-vue3 分支
git checkout my-vue3
# 将 my-vue3 分支关联到远程的 vue3 分支
git branch --set-upstream-to=origin/vue3 my-vue3

# 验证关联
git branch -vv
该命令会显示本地分支和对应的远程跟踪分支信息。如果关联成功，my-vue3 分支后面会显示关联的远程分支 origin/vue3 以及最后一次同步的提交信息。
```

执行该命令后，本地的 my-vue3 分支就会与远程仓库 origin 的 origin/vue3 分支建立关联。之后，你使用 git pull 和 git push 命令时，Git 就会知道与哪个远程分支进行交互。

>   如果执行上述命令后仍然无法关联，你可以尝试先拉取远程分支的最新信息，再进行关联操作
>   git fetch origin
>   git branch --set-upstream-to=origin/vue3 my-vue3

### 情况三：推送本地分支到远程并关联

如果你本地新建的分支在远程还不存在，你可以使用 git push 命令将本地分支推送到远程并建立关联。

例如，你有一个本地分支 my-vue3，远程仓库中没有该分支，使用以下命令推送并关联：

```shell
# 提前存在的一个本地分支（如果不存在则执行命令，创建一个本地分支my-vue3，关联远程分支origin/master）
git checkout -b my-vue3 master


# 推送 my-vue3 分支到远程仓库
git push -u origin my-vue3
```

这里的 -u 选项等同于 --set-upstream，它会在推送本地分支到远程的同时，将本地分支与远程分支进行关联。之后，你就可以直接使用 git pull 和 git push 命令，而无需每次都指定远程分支名。



## git pull与git fetch的区别

git pull 和 git fetch 都是用于从远程仓库获取最新代码的 Git 命令，但它们在功能和使用场景上存在明显的区别

**功能差异**

-   git fetch：该命令的作用是从远程仓库下载所有分支的更新信息，这些更新信息包含了新的提交记录、分支信息等。
    -   不过，它仅仅是将这些信息下载到本地的版本库，并不会自动将这些更新合并到当前的本地分支。
    -   也就是说，执行 git fetch 后，你可以查看远程仓库有哪些新的提交，但本地的工作目录和当前分支的状态不会发生改变。
-   git pull：git pull 实际上是 git fetch 和 git merge 这两个命令的组合。它首先会像 git fetch 一样从远程仓库下载最新的更新信息，然后自动将这些更新合并到当前的本地分支。这意味着执行 git pull 后，本地的工作目录和当前分支会直接更新到与远程分支同步的状态。

**使用场景差异**

-   git fetch：当你想要查看远程仓库有哪些新的提交，但又不想立刻将这些更新合并到本地分支时，适合使用 git fetch。
    -   例如，你在进行一项重要的开发任务，不想因为合并远程更新而引入潜在的冲突，那么可以先使用 git fetch 查看远程的更新情况，在合适的时候再手动进行合并操作。
-   git pull：如果你希望本地分支能够快速地与远程分支保持同步，并且确定合并操作不会带来冲突或者你有能力处理可能出现的冲突，那么使用 git pull 会更加方便快捷。
    -   比如，在日常的开发中，你经常需要获取团队成员最新的提交，就可以直接使用 git pull 命令。

**示例**

使用 git fetch

```shell
# 从远程仓库获取最新更新信息
git fetch origin
# 查看本地分支和远程分支的差异
git log master..origin/master
# 手动将远程分支的更新合并到本地分支
git merge origin/master
```

使用 git pull

```shell
# 从远程仓库获取最新更新并合并到当前分支
git pull origin master
```

**总结**

git fetch 侧重于获取远程仓库的更新信息，让你有更多的控制权来决定何时以及如何合并这些更新；而 git pull 则更注重快速地将远程更新合并到本地分支，提供了一种更便捷的同步方式。在实际使用中，你可以根据具体的需求和场景选择合适的命令。