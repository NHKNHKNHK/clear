---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Clear有点意思"
  text: "经典老哥的成长之路"
  tagline: 前端 · 后端 · 大数据
  # 首页右侧logo
  image: {
    src: /favicon.ico,
    alt: logo
  }
  actions:
    - theme: brand
      text: Clear的Gitee（给个star吧）
      link: https://gitee.com/ninghongkang
    - theme: alt
      text: API Examples
      link: /api-examples
      target: _blank
      rel: noopener
    - theme: alt
      text: 面试题库
      link: /api-examples
    - theme: alt
      text: 支持老哥
      link: /zhichi

features:
  - icon:
      dark: /dark-java.svg
      light: /light-java.svg
      width: 40
      height: 40
    title: Feature A
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
    link: /api-examples
    linkText: 查看
  - title: Feature B
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
  - title: Feature C
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
---

<script setup>
// 在使用的地方显式的导入，使它们可以正确地进行代码拆分，并且仅在显示相关页面时才加载
import Confetti from '../.vitepress/theme/components/Confetti.vue'
import HomeUnderline  from '../.vitepress/theme/components/HomeUnderline.vue'
</script>
<!-- 烟火效果 -->
<Confetti/>
<!-- 首页文字下划线效果 -->
<HomeUnderline/>


## 一些额外的内容

You can get started using VitePress right away using `npx`!

```sh
npm init
npx vitepress init
```

<div>
  <p style="color: red;">
    hahah
  </p>
</div>