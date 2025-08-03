---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Clear的个人博客"
  text: "包含前后端的技术栈"
  tagline: My great project tagline
  actions:
    - theme: brand
      text: Clear的Gitee（给个star吧）
      link: https://gitee.com/ninghongkang
    - theme: alt
      text: API Examples
      link: /api-examples
    - theme: alt
      text: 面试题库
      link: /api-examples

features:
  - title: Feature A
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
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