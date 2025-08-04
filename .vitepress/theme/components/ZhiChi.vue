<template>
  <div class="container">
    <div class="img-wrap vx">
      <img src="/wx-pay.jpg" alt="微信收款码" />
    </div>
    <div class="img-wrap">
      <img src="/zfb-pay.jpg" alt="支付宝收款码" />
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: space-between;
  column-gap: 10px;

  > div.img-wrap {
    flex: 1;
    height: 50vh;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
