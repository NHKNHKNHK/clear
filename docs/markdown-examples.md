# Markdown Extension Examples

This page demonstrates some of the built-in markdown extensions provided by VitePress.

> 这是引用

# 代码组

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

## Syntax Highlighting

VitePress provides Syntax Highlighting powered by [Shiki](https://github.com/shikijs/shiki), with additional features like line-highlighting:

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

## Custom Containers

**Input**

```md
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

::: details
This is a details block.
:::
```

**Output**

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

::: details
This is a details block.
:::

## More

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).
