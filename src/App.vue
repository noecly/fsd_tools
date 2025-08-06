<template>
  <div id="app">
    <main class="main-content">
      <div class="content-wrapper">
        <router-view></router-view>
      </div>
    </main>
    <van-tabbar route v-if="!$route.meta.hideTabbar" safe-area-inset-bottom>
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/tools" icon="apps-o">工具</van-tabbar-item>
      <van-tabbar-item to="/mine" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
// App.vue 逻辑
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center; /* 水平居中内容 */
  padding: 16px;
  overflow-y: auto;
}

.content-wrapper {
  width: 100%;
  max-width: 1024px; /* 在宽屏上设置最大宽度 */
}
</style>
