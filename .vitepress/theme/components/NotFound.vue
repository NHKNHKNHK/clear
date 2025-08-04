<template>
  <div class="not-fount-404" id="J_404"></div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  let script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://volunteer.cdn-go.cn/404/latest/404.js";
  script.setAttribute("rendertarget", "J_404");

  document.getElementsByTagName("head")[0].appendChild(script);
});
</script>

<style scoped lang="scss">
.not-fount-404 {
  overflow-y: hidden;
}

/* >= 768px */
@media screen and (min-width: 768px) {
  .not-fount-404 {
    width: 70vw;
    margin: 0 auto;
    padding-top: var(--vp-nav-height);
  }
}
</style>
