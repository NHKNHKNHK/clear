

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

```
git add example.txt
```

2、暂存区 -> 版本库

使用 git commit 命令将暂存区中的修改提交到版本库。

例如，将暂存区中的更改提交到本地版本库，并添加提交说明：

```
git commit -m "feat: 新增example.txt"
```

3、版本库 -> 远程仓库

使用 git push 命令将本地版本库的提交推送到远程仓库。

例如，将本地的 master 分支推送到远程仓库的 master 分支：

```
git push origin master
```

4、远程仓库 -> 本地版本库

使用 git pull 或 git fetch 命令从远程仓库获取更新。

```
git pull origin master

# 或者
git fetch origin branch-name
git merge origin/branch-name
```

