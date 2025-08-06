<template>
  <div class="doc-title">{{ page.title }}</div>
</template>

<script setup>
import { useData } from "vitepress";

/**
 * page 页面级元数据
 */
const { page } = useData();

</script>

<style scoped>
.doc-title {
  font-size: 16px;
  color: var(--vp-c-brand-1);
  /* 多行文本溢出显式省略号 */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 这里是限制行数，可根据需要调整 */
  -webkit-box-orient: vertical;
}
</style>