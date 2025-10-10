# useTemplateRef <Badge text="Vue3.5+"/>

`useTemplateRef`用于获取模板中元素或组件的引用，而 `useTemplateRef` 通常是一个自定义的组合式 API 钩子，用于简化模板引用的获取和操作逻辑

核心优势

- 封装模板引用的获取逻辑，简化代码（更加符合原生JS获取DOM直觉）
- 提供类型安全（在 TypeScript 中）
- 处理模板引用的响应式更新

## Vue3.5之前

在Vue3.5之前，我们通常是这样获取DOM元素（或组件实例）的：

```vue
<template> 
  <h1 ref="title">Hello Vue3.5</h1>
<template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  const title = ref(null)

  onMounted(() => {
    console.log(title.value)
  })
</script>
```

这样子是可以获取到DOM元素，能够实现功能。

:::warning

但是`template`中`h1`标签的`ref`属性的字符串值要与`script`中的变量名一致，这样写起来很诡异

除了这里之外，Vue中似乎没有这种场景：一个字符串值要与一个变量名一致，这很奇怪

这也不符合直觉

在原生JS中，我们通常是这样获取DOM元素的：

```js
<h1 id="title">Hello Vue3.5</h1>

const h1 = document.querySelector('h1')
```

这里的`h1`标签中`id`属性值与DOM元素的id属性值一致，这样写起来就很自然

:::

还存在一个问题就是：类型丢失，可以通过如下方式解决：

```vue
const title = ref<HTMLElement | null>(null)
```

如果这个类型比较复杂，那么我们又要去查文档，这样就很繁琐。

## useTemplateRef

useTemplateRef是Vue3.5新引入的API，它可以让我们更方便地获取DOM元素（或组件实例）

它的优势：

- 符合直觉
- 类型推断（在无法自动推断的情况下，仍然可以通过泛型参数将模板 ref 转换为显式类型）

```vue
<template> 
  <h1 ref="title">Hello Vue3.5</h1>
<template>

<script setup lang="ts">
  import { useTemplateRef, onMounted } from 'vue'

  const h1 = useTemplateRef('title')

  onMounted(() => {
    console.log(h1.value)
  })
</script>
```

假设获取的DOM元素类型比较复杂，我们可以这样写：

```vue
const h1 = useTemplateRef<HTMLElement>('title')
```
