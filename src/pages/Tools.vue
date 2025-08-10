<template>
  <div class="tools-container">
    <h2 class="page-title">工具箱</h2>
    <p class="page-description">选择一个称手的工具，开始你的创造。</p>
    <van-grid :column-num="3" :gutter="24" :border="false" clickable>
      <van-grid-item
        v-for="tool in tools"
        :key="tool.name"
        @click="navigateTo(tool.path)"
        class="tool-grid-item"
      >
        <div class="tool-card-content">
          <div class="tool-icon-background" :style="{ background: tool.color }">
            <van-icon :name="tool.icon" class="tool-icon" />
          </div>
          <span class="tool-name">{{ tool.name }}</span>
        </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const tools = ref([
  {
    name: '出口值计算器',
    icon: 'gold-coin-o',
    path: '/tools/calculator',
    color: 'linear-gradient(135deg, #FFD166, #FF8C42)', // 橙色渐变
  },
  {
    name: '敬请期待',
    icon: 'add-o',
    path: '#',
    color: 'linear-gradient(135deg, #f2f3f5, #e6e7e9)', // 灰色渐变
  },
]);

const navigateTo = (path: string) => {
  if (path && path !== '#') {
    router.push(path);
  }
};
</script>

<style scoped>
.tools-container {
  padding: 20px;
  background-color: #f4f6f8;
  min-height: 100vh;
}

.page-title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.page-description {
  text-align: center;
  color: #999;
  margin-bottom: 32px;
}

/* 重置 van-grid-item 的默认内边距，以便自定义卡片内容 */
:deep(.tool-grid-item .van-grid-item__content) {
  padding: 0;
  background-color: transparent;
  border-radius: 12px;
}

.tool-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 16px 8px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease-in-out;
}

.tool-card-content:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.tool-icon-background {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.tool-icon {
  font-size: 28px;
  color: #ffffff;
}

.tool-name {
  font-size: 13px;
  color: #333;
  font-weight: 500;
  text-align: center;
}
</style>
