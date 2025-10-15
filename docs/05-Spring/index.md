# 导读

脑图

```markmap
# 前端面试
## HTML
- 语义化标签
- SEO 优化
## CSS
- Flex 布局
- Grid 布局
## JavaScript
- 闭包
- 事件循环
```


流程图

```mermaid
sequenceDiagram
    participant U as 用户
    participant S as 服务器
    U->>S: 请求登录
    S-->>U: 返回 Token
    U->>S: 携带 Token 请求数据
    S-->>U: 返回用户数据
```

## drawio

```mermaid

graph LR
    A[菜单栏] -->|文件操作| B(文件菜单)
    A -->|编辑功能| C(编辑菜单)
    A -->|视图选项| D(视图菜单)
    E[工具栏] -->|保存操作| F[保存按钮]
    E -->|撤销重做| G[撤销重做按钮]
    H[绘图区域] -->|添加图形| I[图形库]
    J[侧边栏] -->|图形管理| K[页面控制]
    J -->|自定义图形| L[自定义图形选项]
    I -.->|拖放| H
    K -.->|页面切换| H
    L -.->|图形使用| H

```

### 引入的方式

```
<!-- 基础用法 -->
![](./demo.drawio)

<!-- 带参数的进阶用法 -->
![](.demo/hmr.drawio){edit=_blank transparent=true nav=true}

```

![](./demo.drawio){edit=_blank transparent=true nav=true}