<template>
  <div class="container">
    <div v-if="shouldRender">
      <GiscusDiscussions />
    </div>
    <div v-else>
      <div class="study" @click="() => (shouldRender = true)">
        <div class="btn">交流学习</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref } from "vue";
import GiscusDiscussions from "./GiscusDiscussions.vue";
import { useRoute } from "vitepress"

const route = useRoute();
const shouldRender = ref(false);

// 监听路由变化
watch(
  () => route.path,
  () => {
    shouldRender.value = false;
  }
);
</script>

<style scoped lang="scss">
.container {
  border: 1px solid blue;
}

.study {
  text-align: right;
  padding-top: 2rem;

  .btn {
    display: inline-block;
    color: var(--vp-c-brand-1);
    padding: 11px 16px;
    border: 1px solid var(--vp-c-brand-1);
    border-radius: 8px;
    cursor: pointer;

    &:hover {
      color: white;
      background-color: var(--vp-c-brand-2);
    }
    &:active {
      color: white;
      background-color: var(--vp-c-brand-3);
    }
  }
}
</style>
