# git commit规范

commit 规范是指在使用版本控制系统（如 Git）时，为了保持提交信息的一致性和可读性而遵循的一套约定或标准。

良好的 Commit 规范可以帮助团队成员更容易地理解每次提交的目的和作用，从而提高代码审查和维护的效率。



一个好的commit应该：有意义、完整、独立

>   -   有意义：指的是本次commit真的是完成了一件事，而不是说中午下班出去吃个饭而commit存个档、下班了存个档。
>       -   下班存个档，应该使用`git stash`
>   -   完整：意味着不能让项目坏掉，即测试不会挂掉，代码能够跑通
>   -   独立：是指本次commit应该专注与一件事。例如：在重构时就不要修bug，修bug就不要添加新功能

好的commit可以让未来的你一眼明白为什么要有这次commit，这次commit又改动了什么。

一个好的commit message会包含如下：

```shell
类型 作用域 主题 正文
```

例如：

```shell
fix(login): 修复登录页面加载失败的问题

因为API返回的数据结构变化，导致解析失败，这里调整了解析逻辑。
```



小结：

​	通过采用 Git Commit 规范，团队可以更容易地维护项目的变更历史，同时也能提升代码审查的效率

**提交的类型**

-   **feat**：新增一个功能（feature）
    -   建议：在新增功能之前，pull最新远程库的master分支。避免代码合并时候的冲突
-   **fix**：修复一个Bug
-   **refactor**：代码重构，不增加功能，也不修改bug
-   docs：文档变更，比如 README，CHANGELOG、CONTIRIBUTE等到
-   style：代码格式（风格），如修改了空格、格式缩进、逗号等等，不改变代码逻辑，不影响功能
-   perf：优化相关，比如提示性能、体验
-   test：增加测试、改测试
-   build：更变项目构建或外部依赖，例如scopes:webpack、gulp、npm等
-   ci：CI配置，脚本文件等更新
-   chore：杂项，改变构建流程、或者增加依赖库、工具等，如 .gitignore、构建脚本等
-   **revert**：代码回退，回滚某个提交
-   config：配置文件修改



## **扩展相关**

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

