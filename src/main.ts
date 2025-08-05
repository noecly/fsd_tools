import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router'; // 引入路由
import { createPinia } from 'pinia'; // 引入 Pinia

// 完整引入 Vant 组件
import Vant from 'vant';
import 'vant/lib/index.css'; // 引入 Vant 样式

const app = createApp(App);
const pinia = createPinia(); // 创建 Pinia 实例

app.use(router); // 注册路由
app.use(pinia); // 注册 Pinia
app.use(Vant); // 全局注册 Vant

app.mount('#app');
