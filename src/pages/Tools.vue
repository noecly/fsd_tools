<template>
  <div class="tools-container">
    <van-grid :column-num="1" :gutter="16" :border="false">
      <van-grid-item
        v-for="tool in tools"
        :key="tool.name"
        @click="navigateTo(tool.path)"
        class="tool-grid-item"
      >
        <div class="tool-card-content" :style="{ background: tool.color }">
          <div class="tool-icon-wrapper">
            <van-icon :name="tool.icon" class="tool-icon" />
          </div>
          <div class="tool-text-wrapper">
            <h3 class="tool-name">{{ tool.name }}</h3>
            <p class="tool-description">{{ tool.description }}</p>
          </div>
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
    description: '根据参数计算出口商品的最终价值。',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // 紫色渐变
  },
  {
    name: '敬请期待',
    icon: 'add-o',
    path: '#',
    description: '更多实用工具正在开发中，即将上线。',
    color: 'linear-gradient(135deg, #d3d3d3 0%, #a9a9a9 100%)', // 灰色渐变
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
  padding: 16px;
  background-color: #f4f6f8;
  min-height: 100vh;
}

/* 移除 grid-item 的默认背景和内边距 */
:deep(.tool-grid-item .van-grid-item__content) {
  padding: 0;
  background-color: transparent;
  border-radius: 12px; /* 确保点击效果能覆盖整个卡片 */
}

.tool-card-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 24px 20px;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
  color: #ffffff;
  overflow: hidden; /* 确保子元素不会溢出圆角 */
}

.tool-card-content:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.tool-icon-wrapper {
  margin-right: 20px;
}

.tool-icon {
  font-size: 32px;
  opacity: 0.9;
}

.tool-text-wrapper {
  flex: 1;
  text-align: left;
}

.tool-name {
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 6px 0;
}

.tool-description {
  font-size: 13px;
  margin: 0;
  opacity: 0.85;
  line-height: 1.4;
}
</style>