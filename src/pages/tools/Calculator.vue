<template>
  <div class="calculator-page">
    <van-nav-bar
      title="出口值计算器"
      left-text="返回"
      left-arrow 

      @click-left="goBack"
      fixed
      placeholder
    />

    <van-tabs v-model:active="activeTab" sticky>
      <van-tab title="小时值计算">
        <div class="tab-content">
          <van-notice-bar
            left-icon="info-o"
            text="根据当前时间自动计算已流逝点数，并以此进行最大剩余瞬时值计算。"
            wrapable
          />
          <van-form @submit="onHourSubmit">
            <van-cell-group inset title="小时窗口参数">
              <van-field
                v-model="hourParams.Lh"
                name="Lh"
                label="小时限值 (L)"
                placeholder="请输入小时限值"
                type="number"
                :rules="[{ required: true, message: '请输入' }]"
              />
              <van-field
                v-model="hourParams.mu"
                name="mu_h"
                label="当前均值 (μ)"
                placeholder="请输入当前小时的平均值"
                type="number"
                :rules="[{ required: true, message: '请输入' }]"
              />
            </van-cell-group>
            <div class="submit-button-wrapper">
              <van-button round block type="primary" native-type="submit" :loading="hourLoading">
                计算小时值
              </van-button>
            </div>
          </van-form>
          <van-divider>计算结果</van-divider>
          <div v-if="hourResult" class="results-container">
            <van-cell-group inset>
              <van-cell title="本小时已流逝点数 (n_valid)" :value="hourResult.nh" />
              <van-cell title="最大剩余瞬时值 (xmax)" :value="hourResult.x_max_h" />
            </van-cell-group>
            
            <!-- 调试模块 -->
            <div data-test-id="calculation-details" style="margin-top: 16px;">
              <van-collapse v-model="activeCollapse_h">
                <van-collapse-item title="计算过程（调试用）" name="1">
                  <van-cell-group inset>
                    <van-cell title="限值 (L)" :value="hourResult.details.L" />
                    <van-cell title="窗口总点数 (N)" :value="hourResult.details.N" />
                    <van-cell title="当前均值 (μ)" :value="hourResult.details.mu" />
                    <van-cell title="有效点数 (n_valid)" :value="hourResult.details.n_valid" />
                    <van-cell title="已花费总量 (S_valid)" :value="hourResult.details.S_valid" />
                    <van-cell title="剩余点数 (N_rem)" :value="hourResult.details.N_rem" />
                    <van-cell title="分子 (L*N - S_valid)" :value="hourResult.details.numerator" />
                    <van-cell title="分母 (N_rem)" :value="hourResult.details.denominator" />
                  </van-cell-group>
                </van-collapse-item>
              </van-collapse>
            </div>

          </div>
          <van-empty v-else description="暂无计算结果" />
        </div>
      </van-tab>

      <van-tab title="8小时值计算">
        <div class="tab-content">
          <van-notice-bar
            left-icon="info-o"
            :text="`当前处于 ${current8hWindow.name} 窗口，将自动计算已流逝点数并以此为基础进行计算。`"
            wrapable
          />
          <van-form @submit="onEightHourSubmit">
            <van-cell-group inset title="八小时窗口参数">
              <van-field
                v-model="eightHourParams.L8"
                name="L8"
                label="8小时限值 (L)"
                placeholder="请输入8小时限值"
                type="number"
                :rules="[{ required: true, message: '请输入' }]"
              />
               <van-field
                v-model="eightHourParams.mu"
                name="mu_8"
                label="当前均值 (μ)"
                placeholder="请输入当前8小时的平均值"
                type="number"
                :rules="[{ required: true, message: '请输入' }]"
              />
            </van-cell-group>
            <div class="submit-button-wrapper">
              <van-button round block type="success" native-type="submit" :loading="eightHourLoading">
                计算8小时值
              </van-button>
            </div>
          </van-form>
          <van-divider>计算结果</van-divider>
          <div v-if="eightHourResult" class="results-container">
            <van-cell-group inset>
              <van-cell title="8小时窗口已流逝点数 (n_valid)" :value="eightHourResult.n8" />
              <van-cell title="最大剩余瞬时值 (xmax)" :value="eightHourResult.x_max_8" />
            </van-cell-group>

             <!-- 调试模块 -->
            <div data-test-id="calculation-details" style="margin-top: 16px;">
              <van-collapse v-model="activeCollapse_8h">
                <van-collapse-item title="计算过程（调试用）" name="1">
                  <van-cell-group inset>
                    <van-cell title="限值 (L)" :value="eightHourResult.details.L" />
                    <van-cell title="窗口总点数 (N)" :value="eightHourResult.details.N" />
                    <van-cell title="当前均值 (μ)" :value="eightHourResult.details.mu" />
                    <van-cell title="有效点数 (n_valid)" :value="eightHourResult.details.n_valid" />
                    <van-cell title="已花费总量 (S_valid)" :value="eightHourResult.details.S_valid" />
                    <van-cell title="剩余点数 (N_rem)" :value="eightHourResult.details.N_rem" />
                    <van-cell title="分子 (L*N - S_valid)" :value="eightHourResult.details.numerator" />
                    <van-cell title="分母 (N_rem)" :value="eightHourResult.details.denominator" />
                  </van-cell-group>
                </van-collapse-item>
              </van-collapse>
            </div>

          </div>
          <van-empty v-else description="暂无计算结果" />
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { showNotify } from 'vant';

const router = useRouter();
const goBack = () => router.push('/tools');

// --- 通用状态 ---
const activeTab = ref(0);
const f = 3600; // 采样频率, 1次/秒
const activeCollapse_h = ref([]);
const activeCollapse_8h = ref([]);

// --- 小时值计算 ---
const hourLoading = ref(false);
const hourParams = reactive({ Lh: '', mu: '' });
const hourResult = ref<{ 
  nh: number; 
  x_max_h: string;
  details: Record<string, any>;
} | null>(null);

const onHourSubmit = async () => {
  hourLoading.value = true;
  await new Promise(resolve => setTimeout(resolve, 300));
  try {
    const N = f;
    const L = Number(hourParams.Lh);
    const mu = Number(hourParams.mu);
    const t_now = Math.floor(Date.now() / 1000);
    const t_hour_start = Math.floor(t_now / 3600) * 3600;
    const n_valid = Math.min(t_now - t_hour_start, N);
    const N_rem = N - n_valid;
    const S_valid = mu * n_valid;
    const numerator = (L * N - S_valid);
    const denominator = N_rem;

    let x_max_h = 'N/A';

    if (N_rem <= 0) {
      showNotify({ type: 'warning', message: '当前小时已无剩余采样点' });
    } else if (numerator < 0) {
      showNotify({ type: 'danger', message: '当前均值过高，已超标' });
      x_max_h = '已超标';
    } else {
      x_max_h = (numerator / denominator).toFixed(4);
      showNotify({ type: 'success', message: '小时值计算成功' });
    }
    
    hourResult.value = { 
      nh: n_valid, 
      x_max_h,
      details: { L, N, mu, n_valid, S_valid: S_valid.toFixed(2), N_rem, numerator: numerator.toFixed(2), denominator }
    };

  } catch (e) {
    showNotify({ type: 'danger', message: '计算失败，请检查输入' });
  } finally {
    hourLoading.value = false;
  }
};

// --- 8小时值计算 ---
const eightHourLoading = ref(false);
const eightHourParams = reactive({ L8: '', mu: '' });
const eightHourResult = ref<{ 
  n8: number; 
  x_max_8: string;
  details: Record<string, any>;
} | null>(null);

const get8hWindow = (now: Date) => {
  const h = now.getHours();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (h < 8) return { start: today, name: '00:00-07:59' };
  if (h < 16) { today.setHours(8); return { start: today, name: '08:00-15:59' }; }
  today.setHours(16); return { start: today, name: '16:00-23:59' };
};

const current8hWindow = get8hWindow(new Date());

const onEightHourSubmit = async () => {
  eightHourLoading.value = true;
  await new Promise(resolve => setTimeout(resolve, 300));
  try {
    const N = 8 * f;
    const L = Number(eightHourParams.L8);
    const mu = Number(eightHourParams.mu);
    const t_now = Math.floor(Date.now() / 1000);
    const t8h_start = Math.floor(current8hWindow.start.getTime() / 1000);
    const delta_T8 = Math.min(t_now - t8h_start, 8 * 3600);
    const n_valid = Math.min(Math.floor(delta_T8), N);
    const N_rem = N - n_valid;
    const S_valid = mu * n_valid;
    const numerator = (L * N - S_valid);
    const denominator = N_rem;

    let x_max_8 = 'N/A';

    if (N_rem <= 0) {
      showNotify({ type: 'warning', message: '8小时窗口已无剩余采样点' });
    } else if (numerator < 0) {
      showNotify({ type: 'danger', message: '当前均值过高，已超标' });
      x_max_8 = '已超标';
    } else {
      x_max_8 = (numerator / denominator).toFixed(4);
      showNotify({ type: 'success', message: '8小时值计算成功' });
    }

    eightHourResult.value = { 
      n8: n_valid, 
      x_max_8,
      details: { L, N, mu, n_valid, S_valid: S_valid.toFixed(2), N_rem, numerator: numerator.toFixed(2), denominator }
    };

  } catch (e) {
    showNotify({ type: 'danger', message: '计算失败，请检查输入' });
  } finally {
    eightHourLoading.value = false;
  }
};
</script>

<style scoped>
.calculator-page {
  background-color: #f7f8fa;
}
/* .tab-content {
  padding: 16px;
} */
.submit-button-wrapper {
  margin-top: 24px;
}
.results-container {
  margin-top: 16px;
}
.van-notice-bar {
  margin-bottom: 16px;
  margin-top: 16px;
}

.calculator-page :deep(.van-cell-group--inset) {
  margin-left: 0;
  margin-right: 0;
}
</style>
