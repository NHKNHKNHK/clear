<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from "vitepress/theme";
import NotFound from "./components/NotFound.vue";

// 解耦出Layout组件
const { Layout } = DefaultTheme;

</script>

<template>
  <Layout>
    <!-- 404 -->
    <template #not-found>
      <NotFound />
    </template>
  </Layout>
</template>
