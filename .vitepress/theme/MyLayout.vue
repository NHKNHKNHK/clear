<!--.vitepress/theme/MyLayout.vue-->
<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import NotFound from "./components/NotFound.vue";
import AsideTop from "./components/AsideTop.vue";
import GiscusDiscussionsWrapper from "./components/GiscusDiscussionsWrapper.vue"
import { useData } from "vitepress";
import { nextTick, provide } from "vue";

// 结构出Layout组件
const { Layout } = DefaultTheme;
const { isDark } = useData();

// https://vitejs.cn/vitepress/guide/extending-default-theme#on-appearance-toggle
const enableTransitions = () =>
  "startViewTransition" in document &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

provide("toggle-appearance", async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    return;
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`,
  ];

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  }).ready;

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: "ease-in",
      pseudoElement: `::view-transition-${isDark.value ? "old" : "new"}(root)`,
    }
  );
});
</script>

<template>
  <Layout>
    <!-- 当 layout: 'doc' (默认) 在 frontmatter 中被启用时 -->
    <!-- <template #doc-top>doc-top-文章最顶部</template> -->
    <!-- <template #doc-bottom>doc-bottom-文章最底部</template> -->
    <!-- <template #doc-footer-before>doc-footer-before</template> -->
    <!-- <template #doc-before>doc-before</template> -->
    <template #doc-after>
      <!-- doc-after -->
      <GiscusDiscussionsWrapper />
    </template>
    <!-- <template #sidebar-nav-before>sidebar-nav-before</template> -->
    <!-- <template #sidebar-nav-after>sidebar-nav-after</template> -->
    <template #aside-top>
      <!-- sidebar top -->
      <AsideTop />
    </template>
    <!-- <template #aside-bottom>sidebar bottom</template> -->
    <!-- <template #aside-outline-before>aside-outline-before</template> -->
    <!-- <template #aside-outline-after>aside-outline-after</template> -->
    <!-- <template #aside-ads-before>aside-ads-before</template> -->
    <!-- <template #aside-ads-after>aside-ads-after</template> -->

    <!-- 当 layout: 'home' 在 frontmatter 中被启用时 -->
    <!-- <template #home-hero-before>home-hero-before</template> -->
    <!-- <template #home-hero-info-before>home-hero-info-before</template> -->
    <!-- <template #home-hero-info>home-hero-info-可替换title等等三行文字</template> -->
    <!-- <template #home-hero-info-after>home-hero-info-after</template> -->
    <!-- <template #home-hero-actions-after>home-hero-actions-after</template> -->
    <template #home-hero-image>
      <!-- home-hero-image -->
      <img src="https://unocss.nodejs.cn/logo.svg" alt="logo" />
    </template>
    <!-- <template #home-hero-after>home-hero-after</template> -->
    <!-- <template #home-features-before>home-features-before</template> -->
    <!-- <template #home-features-after>home-features-after</template> -->

    <!-- 当 layout: 'page' 在 frontmatter 中被启用时 -->
    <!-- <template #page-top>page-top</template> -->
    <!-- <template #page-bottom>page-bottom</template> -->

    <!-- 当未找到页面 (404) 时 404 -->
    <template #not-found>
      <NotFound />
    </template>

    <!-- 总是启用 -->
    <!-- <template #layout-top>layout-top-可以插入广告</template> -->
    <!-- <template #layout-bottom>layout-bottom</template> -->
    <!-- <template #nav-bar-title-before>nav-bar-title-before</template> -->
    <!-- <template #nav-bar-title-after>nav-bar-title-after</template> -->
    <!-- <template #nav-bar-content-before>nav-bar-content-before</template> -->
    <!-- <template #nav-bar-content-after>nav-bar-content-after</template> -->
    <!-- 窄屏幕右侧菜单插槽   -->
    <!-- <template #nav-screen-content-before>nav-screen-content-before</template> -->
    <!-- <template #nav-screen-content-after>nav-screen-content-after</template> -->
  </Layout>
</template>

<style scoped lang="scss">
// 关于外观切换
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

/* 恢复原始开关按钮 */
.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}

/* 修正因视图过渡导致的按钮图标偏移 */
.VPSwitchAppearance .check .icon {
  top: -2px;
}
</style>
