<template>
  <div style="margin-top: 24px">
    <!-- https://giscus.app/zh-CN -->
    <!-- 重点关注 repo, repo-id, category, category-id -->
    <!-- 
      input-position 控制评论框的位置，可选值有 top 和 bottom
    -->
    <!-- 可以在嵌入的页面中使用 .giscus 和 .giscus-frame 选择器来自定义容器布局 -->
    <Giscus
      :key="page.filePath"
      repo="NHKNHKNHK/clear-blog-comment"
      repo-id="R_kgDOPZyKWA"
      category="Announcements"
      category-id="DIC_kwDOPZyKWM4Ct4yk"
      mapping="pathname"
      strict="0"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="top"
      lang="zh-CN"
      loading="lazy"
      crossorigin="anonymous"
      :theme="isDark ? 'dark' : 'light'"
    />
  </div>
</template>

<script lang="ts" setup>
import Giscus from "@giscus/vue";
import { watch } from "vue";
import { inBrowser, useData } from "vitepress";

const { isDark, page } = useData();

console.log(page);

watch(isDark, (dark) => {
  if (!inBrowser) return;

  const iframe = document
    .querySelector("giscus-widget")
    ?.shadowRoot?.querySelector("iframe");

  iframe?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: dark ? "dark" : "light" } } },
    "https://giscus.app"
  );
});
</script>

<style scoped>
</style>