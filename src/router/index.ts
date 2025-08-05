import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Tools from '../pages/Tools.vue';
import Mine from '../pages/Mine.vue';
import Calculator from '../pages/tools/Calculator.vue'; // 更新路径

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/tools',
    name: 'Tools',
    component: Tools,
  },
  {
    path: '/mine',
    name: 'Mine',
    component: Mine,
  },
  {
    path: '/tools/calculator', // 更新路由路径
    name: 'Calculator',
    component: Calculator,
    meta: { hideTabbar: true }, // 添加 meta 信息
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
