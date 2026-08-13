<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchWeatherById } from '../api/weatherApi.js'
import { useConfigStore } from '../stores/configStore.js'
import WeatherAdvice from '../components/exercise/WeatherAdvice.vue'

const route = useRoute()
const configStore = useConfigStore()

const city = ref(null)
const isLoading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  try {
    const cityId = route.params.cityId       // 주소에서 id 꺼냄
    city.value = await fetchWeatherById(cityId)
  } catch (e) {
    errorMsg.value = '상세 정보를 불러오지 못했습니다.'
    console.error(e)
  } finally {
    isLoading.value = false
  }
})

// 단위 변환 (섭씨/화씨)
const displayTemp = computed(() => {
  if (!city.value) return 0
  const rawTemp = city.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
</script>

<template>
  <div class="detail-view">
    <p v-if="isLoading" class="info-msg">⏳ 불러오는 중...</p>
    <div v-else-if="city" class="detail-card">
      <h2>📈 지역별 상세 기상 관측 정보</h2>
      <hr />
      <p>📍 지정 지역: <strong>{{ city.name }}</strong></p>
      <p>실시간 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
      <p>기상 현황: {{ city.status }}</p>
      <p>대기 습도: {{ city.humidity }}%</p>
      <p>현재 풍속: {{ city.wind }}m/s</p>
    </div>
    <div v-else class="detail-card">
      <p>{{ errorMsg || '해당 도시 정보를 찾을 수 없습니다.' }}</p>
    </div>

    <!-- 예보 기반 오늘의 브리핑 (우산/외출/빨래/옷차림) -->
    <WeatherAdvice v-if="city" :city-name="city.name" />

    <RouterLink to="/" class="back-link">← 메인 대시보드로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.detail-card {
  background: var(--surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: var(--space-3);
  margin-bottom: var(--space-2);
}
.detail-card h2 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
}
.detail-card hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 12px 0;
}
.detail-card p {
  margin: 8px 0;
  color: var(--text-secondary);
  font-size: 14px;
}
.detail-card strong {
  color: var(--text-primary);
}
.info-msg {
  color: var(--text-secondary);
  text-align: center;
  padding: 24px;
}
.back-link {
  display: inline-block;
  padding: 11px 18px;
  background: var(--btn-bg);
  color: var(--btn-fg);
  border-radius: var(--radius-btn);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}
</style>