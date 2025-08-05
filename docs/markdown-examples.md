---
title: Markdown 扩展语法
lang: en-US
---

# Markdown 扩展语法



This page demonstrates some of the built-in markdown extensions provided by VitePress.

> 这是引用


## 标题锚点{#my-anchor .text-center}

- 标题会自动应用锚点。可以使用 markdown.anchor 选项配置锚点的渲染
- 这里还可以配合TailwindCSS等框架进行样式控制

<style>
  .text-center {
    text-align: center;
  }
</style>


## frontmatter（markdown的元数据）

YAML 格式的 frontmatter 开箱即用

```yaml
---
title: Blogging Like a Hacker
lang: en-US
---
```

此处定义的数据将可用于页面的其余部分，以及所有自定义和主题组件

使用frontmatter定义的数据，可以使用 `$frontmatter` 访问

```md
{{ $frontmatter.title }}
```

## GitHub 风格的表格（Typora也支持）

**输入**


```
| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |
```

**输出**

| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |

::: tip

说明：

- `:-----------:` 表示单元格内容居中对齐
- `----:` 表示单元格内容靠右对齐
- `:----` 表示单元格内容靠左对齐

:::

## Emoji:star:（Typora也支持）


**输入**


```
:tada: 
:100:
:smile:
:star:
:star_struck:
```

**输出**

:tada: 
:100:
:smile:
:star:
:star_struck:


> [所有支持的 emoji 列表](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.mjs){target="_blank"}


## 目录表[TOC]

根据当前文档的目录结构生成目录表

**输入**

```
[[toc]]
```

**输出**

[[toc]]


## 自定义容器

自定义容器可以通过它们的类型、标题和内容来定义。

### 默认标题

**输入**

````md
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details 详情
```javascript
console.log('人生苦短')
```
:::
````


**输出**

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning 警告
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details 详情
```javascript
console.log('人生苦短')
```
:::

### 自定义标题

可以通过在容器的 "type" 之后附加文本来设置自定义标题

> 当然也可以全局配置 


**输入**

````md
::: danger STOP
危险区域，请勿继续
:::

::: tip 温馨提示
这是一个提示
:::


::: details 点我查看代码
```js
console.log('Hello, VitePress!')
```
:::
````

**输出**

::: danger STOP
危险区域，请勿继续
:::

::: tip 温馨提示
这是一个提示
:::

::: details 点我查看代码
```js
console.log('Hello, VitePress!')
```
:::

#### 全局配置

可以通过在站点配置中添加以下内容来全局设置自定义标题

```ts
// config.ts
export default defineConfig({
  // ...
  markdown: {
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    }
  }
  // ...
})
```

### raw

这是一个特殊的容器，可以用来防止与 VitePress 的样式和路由冲突。这在记录组件库时特别有用。可能还想查看 whyframe 以获得更好的隔离。

::: raw
<div class="vp-raw">这是一个div {{1 + 1}}</div>
<p>这是一个p</p>
<input type="text" value="这是一个输入框" />
:::

::: warning
个人目前是不太理解这个容器有何作用，如果你知道，你可以告诉我
:::


## GitHub 风格的警报

VitePress 同样支持以标注的方式渲染 GitHub 风格的警报。它们和【自定义容器】的渲染方式相同

```md
> [!NOTE]
> 强调用户在快速浏览文档时也不应忽略的重要信息。

> [!TIP]
> 有助于用户更顺利达成目标的建议性信息。

> [!IMPORTANT]
> 对用户达成目标至关重要的信息。

> [!WARNING]
> 因为可能存在风险，所以需要用户立即关注的关键内容。

> [!CAUTION]
> 行为可能带来的负面影响。
```

> [!NOTE]
> 强调用户在快速浏览文档时也不应忽略的重要信息。

> [!TIP]
> 有助于用户更顺利达成目标的建议性信息。

> [!IMPORTANT]
> 对用户达成目标至关重要的信息。

> [!WARNING]
> 因为可能存在风险，所以需要用户立即关注的关键内容。

> [!CAUTION]
> 行为可能带来的负面影响。


## 代码块中的语法高亮

VitePress 使用 Shiki 在 Markdown 代码块中使用彩色文本实现语法高亮。Shiki 支持多种编程语言。需要做的就是将有效的语言别名附加到代码块的开头：

**如下js、html代码都能够正常显示高亮**

````md
```js
export default {
  name: 'MyComponent'
  // ...
}
```
````

````md
```html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```
````

**输出**

```js
export default {
  name: 'MyComponent'
  // ...
}
```

```html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

**错误示例**

```mysql
select * from user;
```

:::tip 温馨提示
在 Shiki 的代码仓库中，可以找到合法的[编程语言列表](https://shiki.style/languages)。

对于不合法的语言，Shiki 会将语言名映射为 `txt`。

如mysql、jsp等，不存在高亮样式，会默认为txt，项目会警告

```txt
The language 'jsp' is not loaded, falling back to 'txt' for syntax highlighting.
The language 'mysql' is not loaded, falling back to 'txt' for syntax highlighting.
```
:::


## 在代码块中实现行高亮

**Input**

````md
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
````

**Output**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

### 多行高亮

除了单行之外，还可以指定多个单行、多行，或两者均指定：
- 多行：例如 `{5-8}`、`{3-10}`、`{10-17}`
- 多个单行：例如 `{4,7,9}`
- 多行与单行：例如 `{4,7-13,16,23-27,40}`


````md
```js{1,4,6-8}
export default { // Highlighted
  data () {
    return {
      msg: `Highlighted!
      This line isn't highlighted,
      but this and the next 2 are.`,
      motd: 'VitePress is awesome',
      lorem: 'ipsum'
    }
  }
}
```
````

**输出**

```js{1,4,6-8}
export default { // Highlighted
  data () {
    return {
      msg: `Highlighted!
      This line isn't highlighted,
      but this and the next 2 are.`,
      motd: 'VitePress is awesome',
      lorem: 'ipsum'
    }
  }
}
```

## 代码块中聚焦

在某一行上添加 `// [!code focus]` 注释将聚焦它并模糊代码的其他部分。

此外，可以使用 `// [!code focus:<lines>]` 定义要聚焦的行数

**输入**

````md
```js
export default {
  // 聚焦3-7行
  data () {  // [!code focus:5]
    return {
      msg: 'Focused!' 
    }
  }
}
```
````

**输出**

```js
export default {
  // 聚焦3-7行
  data () {  // [!code focus:5]
    return {
      msg: 'Focused!' 
    }
  }
}
```

## 代码块中的颜色差异

在某一行添加 `// [!code --]` 或 `// [!code ++]` 注释将会为该行创建 diff，同时保留代码块的颜色。

就类似git提交的diff一样

**输入**

````md
```js
export default {
  data () {
    return {
      msg: 'Removed' // [!code --]
      msg: 'Added' // [!code ++]
    }
  }
}
```
````


**输出**


```js
export default {
  data () {
    return {
      msg: 'Removed' // [!code --]
      msg: 'Added' // [!code ++]
    }
  }
}
```

## 高亮“错误”和“警告”

在某一行添加 `// [!code warning]` 或 // `[!code error]` 注释将会为该行相应的着色。

**输入**

````md
```js
export default {
  data () {
    return {
      msg: 'Error',  // [!code error]
      msg: 'Warning' // [!code warning]
    }
  }
}
```
````


**输出**

```js
export default {
  data () {
    return {
      msg: 'Error',  // [!code error]
      msg: 'Warning' // [!code warning]
    }
  }
}
```

## 代码块行号

可以通过以下配置为每个代码块启用行号：

```js
export default {
  markdown: {
    lineNumbers: true
  }
}
```

可以在代码块中添加 `:line-numbers` / `:no-line-numbers` 标记来覆盖在配置中的设置。
- `:line-numbers` 启用行号
  - `:line-numbers`之后添加了`=`，如`:line-numbers=2`  表示代码块中的行号从 2 开始。  
- `:no-line-numbers` 禁用行号，一般是用来禁用掉局部代码块的行号（覆盖全局配置）


**输入**

````md
```ts:no-line-numbers {1}
// 默认禁用行号，但是如果全局开启了行号，可以在局部通过 :no-line-numbers 禁用行号
const line2 = 'This is line 2'
const line3 = 'This is line 3'
```

```ts:line-numbers {1}
// 启用行号
const line2 = 'This is line 2'
const line3 = 'This is line 3'
```

```ts:line-numbers=2 {1}
// 行号已启用，并从 2 开始
const line3 = 'This is line 3'
const line4 = 'This is line 4'
```
````

**输出**

```ts:no-line-numbers {1}
// 默认禁用行号，但是如果全局开启了行号，可以在局部通过 :no-line-numbers 禁用行号
const line2 = 'This is line 2'
const line3 = 'This is line 3'
```

```ts:line-numbers {1}
// 启用行号
const line2 = 'This is line 2'
const line3 = 'This is line 3'
```

```ts:line-numbers=2 {1}
// 行号已启用，并从 2 开始
const line3 = 'This is line 3'
const line4 = 'This is line 4'
```

## 导入代码片段

可以通过下面的语法来从现有文件中导入代码片段：

```md
<<< @/filepath
```

此语法同时支持行高亮：

```md
<<< @/filepath{highlightLines}
```

**输入**

```md
<<< @/codeSnippets/snippet.js {2}
```

**输出**

<<< @/codeSnippets/snippet.js {2}

:::tip
`@`的值对应于源代码根目录，默认情况下是 VitePress 项目根目录，除非配置了 srcDir。或者也可以从相对路径导入：

```md
<<< ../snippets/snippet.js
```
:::


### 引入代码的一部分

也可以使用 VS Code region 来只包含代码文件的相应部分。
- 1、在代码中通过 `// #region` 和 `// #endregion` 注释来定义区域（自定义的区域名）
- 2、通过`#`符号指定自定义的区域名


**输入**

> 如下代码的意图是，引入`snippet-with-region.js` 中 `snippet` 区域的代码片段，并高亮显式第一行
```md
<<< @/codeSnippets/snippet-with-region.js#snippet {1}
```

**输出**

<<< @/codeSnippets/snippet-with-region.js#snippet {1}

### 导入代码片段时同时指定语言

```md
<<< @/snippets/snippet.cs{c#}

<!-- 带行高亮: -->

<<< @/snippets/snippet.cs{1,2,4-6 c#}

<!-- 带行号: -->

<<< @/snippets/snippet.cs{1,2,4-6 c#:line-numbers}

```

:::tip
对于vitepress markdown扩展所支持高亮的语言，一般会进行源语言推断（根据后缀名），如js

如果无法从文件扩展名推测出源语言，这将会很有帮助
:::


## 代码组

````md
::: code-group

```sh [pnpm]
pnpm -v
```

```sh [yarn]
yarn -v
```

```sh [bun]
bun -v
```
:::
````

::: code-group

```sh [pnpm]
pnpm -v
```

```sh [yarn]
yarn -v
```

```sh [bun]
bun -v
```

:::

::: code-group

```ts[demo1.ts]
console.log("I'm TypeScript");
```

```js [demo2.js]
console.log("I'm JavaScript");
```

```md []
Markdown 图标演示
```

```css []
h1 {
  background: red;
}
```

```py [python.py]
h1 {
  background: red;
}
```

```java 
System.out.println("I'm Java");
```

```scala [demo.scala] 
System.out.println("I'm Java");
```

``` vue
<template>
  <div>Hello Vue</div>
</template>
```

:::

:::tip
也可以在代码组中导入代码片段，此处不再赘述，[详情参考](https://vitejs.cn/vitepress/guide/markdown#code-groups)
:::

## 包含 markdown 文件

可以在一个 markdown 文件中包含另一个 markdown 文件，甚至是内嵌的

:::tip
也可以使用 `@`，它的值对应于源代码根目录，默认情况下是 VitePress 项目根目录，除非配置了 `srcDir`。
:::

例如，可以这样用相对路径包含 Markdown 文件

**输入**

```md
# Docs

## Basics

<!--@include: ./parts/basics.md-->
```

Part file (`parts/basics.md`)

```md
Some getting started stuff.

### Configuration

Can be created using `.foorc.json`.
```

**等价代码（即最终的md文档）**

```md
# Docs

## Basics

Some getting started stuff.

### Configuration

Can be created using `.foorc.json`.
```

### 引入 markdown 文件片段

**输入**

```md
# Docs

## Basics

<!--@include: ./parts/basics.md{3,}-->
```

Part file (`parts/basics.md`)

```md
Some getting started stuff.

### Configuration

Can be created using `.foorc.json`.
```

**等价代码（即最终的md文档）**

```md
# Docs

## Basics

Some getting started stuff.

### Configuration
```

所选行范围的格式可以是： `{3,}`、 `{,10}`、`{1,10}`

:::warning
如果指定的文件不存在，这将不会产生错误。因此，在使用这个功能的时候请保证内容按预期呈现。
:::


## 数学方程

现在这是可选的。要启用它，需要安装 `markdown-it-mathjax3`，在配置文件中设置`markdown.math` 为 `true`

:::code-group

```sh [npm]
npm add -D markdown-it-mathjax3
```

```sh [pnpm]
pnpm add -D markdown-it-mathjax3
```
:::

```ts
// .vitepress/config.ts
export default {
  markdown: {
    math: true
  }
}
```

**输入**

```md
When $a \ne 0$, there are two solutions to $(ax^2 + bx + c = 0)$ and they are
$$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$

**Maxwell's equations:**

| equation                                                                                                                                                                  | description                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| $\nabla \cdot \vec{\mathbf{B}}  = 0$                                                                                                                                      | divergence of $\vec{\mathbf{B}}$ is zero                                               |
| $\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t}  = \vec{\mathbf{0}}$                                                          | curl of $\vec{\mathbf{E}}$ is proportional to the rate of change of $\vec{\mathbf{B}}$ |
| $\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} = \frac{4\pi}{c}\vec{\mathbf{j}}    \nabla \cdot \vec{\mathbf{E}} = 4 \pi \rho$ | _wha?_                                                                                 |                                                                           |
```

**输出**

When $a \ne 0$, there are two solutions to $(ax^2 + bx + c = 0)$ and they are
$$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$

**Maxwell's equations:**

| equation                                                                                                                                                                  | description                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| $\nabla \cdot \vec{\mathbf{B}}  = 0$                                                                                                                                      | divergence of $\vec{\mathbf{B}}$ is zero                                               |
| $\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t}  = \vec{\mathbf{0}}$                                                          | curl of $\vec{\mathbf{E}}$ is proportional to the rate of change of $\vec{\mathbf{B}}$ |
| $\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} = \frac{4\pi}{c}\vec{\mathbf{j}}    \nabla \cdot \vec{\mathbf{E}} = 4 \pi \rho$ | _wha?_                                                                                 |

## 图片懒加载


通过在配置文件中将 lazyLoading 设置为 true，可以为通过 markdown 添加的每张图片启用懒加载。

```js
export default {
  markdown: {
    image: {
      // 默认禁用图片懒加载
      lazyLoading: true
    }
  }
}
```

## 高级配置

VitePress 使用 `markdown-it` 作为 Markdown 渲染器。上面提到的很多扩展功能都是通过自定义插件实现的。可以使用 `.vitepress/config.js` 中的 markdown 选项来进一步自定义 `markdown-it` 实例。

```js
import { defineConfig } from 'vitepress'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItFoo from 'markdown-it-foo'

export default defineConfig({
  markdown: {
    // markdown-it-anchor 的选项
    // https://github.com/valeriangalliat/markdown-it-anchor#usage
    anchor: {
      permalink: markdownItAnchor.permalink.headerLink()
    },
    // @mdit-vue/plugin-toc 的选项
    // https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-toc#options
    toc: { level: [1, 2] },
    config: (md) => {
      // 使用更多的 Markdown-it 插件！
      md.use(markdownItFoo)
    }
  }
})
```

## More

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).
