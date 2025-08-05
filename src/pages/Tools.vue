<template>
  <div class="tools-page">
    <h1>工具页</h1>
    <p>这里是工具页面，可以放置各种实用工具。</p>
    <van-button type="primary" @click="goToCalculator">出口值计算器</van-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToCalculator = () => {
  router.push('/tools/calculator');
};
</script>

<style scoped>
.tools-page {
  text-align: center;
}
</style>
