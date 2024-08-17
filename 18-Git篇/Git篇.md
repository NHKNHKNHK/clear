

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