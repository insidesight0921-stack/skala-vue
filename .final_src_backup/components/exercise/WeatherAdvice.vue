<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchForecast } from '../../api/weatherApi.js'

const props = defineProps({
  cityName: { type: String, required: true },
})

const forecast = ref([])
const isLoading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  try {
    forecast.value = await fetchForecast(props.cityName)
  } catch (e) {
    errorMsg.value = '예보 정보를 불러오지 못했습니다.'
    console.error(e)
  } finally {
    isLoading.value = false
  }
})

// 시간을 '오전/오후 N시' 형태로
const toKoHour = (h) => {
  if (h === 0) return '자정'
  if (h === 12) return '정오'
  return h < 12 ? `오전 ${h}시` : `오후 ${h - 12}시`
}

// 앞쪽 8개 = 약 24시간 예보
const next24h = computed(() => forecast.value.slice(0, 8))

// ① 우산 브리핑: 24시간 내 첫 비 시점
const umbrellaAdvice = computed(() => {
  const rainy = next24h.value.find((f) => f.pop >= 0.5 || f.rain > 0)
  if (rainy) {
    return `☔ ${toKoHour(rainy.hour)}부터 비 예상 (강수확률 ${Math.round(rainy.pop * 100)}%). 우산 챙기세요.`
  }
  return '🌤️ 당분간 비 소식 없어요.'
})

// ② 외출 최적 시간: 비 없고 쾌적한(16~26도) 구간
const outingAdvice = computed(() => {
  const good = next24h.value.filter((f) => f.pop < 0.3 && f.temp >= 16 && f.temp <= 26)
  if (good.length === 0) return '🚶 외출하기 딱 좋은 시간대가 마땅치 않아요.'
  return `🚶 산책하기 좋은 시간: ${toKoHour(good[0].hour)} 무렵`
})

// ③ 빨래·환기 지수: 비 없음 + 습도 낮음
const laundryAdvice = computed(() => {
  const day = next24h.value
  if (day.length === 0) return ''
  const willRain = day.some((f) => f.pop >= 0.4 || f.rain > 0)
  const avgHumidity = day.reduce((s, f) => s + f.humidity, 0) / day.length
  if (willRain) return '🧺 오늘 빨래는 비추천 (비 예보 있음).'
  if (avgHumidity < 65) return '🧺 빨래 널기 좋아요! (건조하고 비 없음)'
  return '🧺 빨래는 가능하나 습도가 높아 잘 안 마를 수 있어요.'
})

// ④ 옷차림: 현재(예보 첫 시점) 체감온도 기준
const clothingAdvice = computed(() => {
  const now = forecast.value[0]
  if (!now) return ''
  const t = now.feelsLike
  if (t >= 28) return `👕 체감 ${t}°C, 매우 더워요. 반팔·반바지, 수분 섭취 잊지 마세요.`
  if (t >= 23) return `👕 체감 ${t}°C, 반팔이 적당해요.`
  if (t >= 17) return `🧥 체감 ${t}°C, 얇은 겉옷을 챙기세요.`
  if (t >= 12) return `🧥 체감 ${t}°C, 자켓이나 가디건이 필요해요.`
  if (t >= 6) return `🧥 체감 ${t}°C, 코트를 입으세요.`
  return `🧥 체감 ${t}°C, 두꺼운 패딩과 목도리를 챙기세요.`
})
</script>

<template>
  <div class="advice-panel">
    <h3>🧭 오늘의 브리핑 — {{ cityName }}</h3>

    <p v-if="isLoading" class="advice-loading">분석 중...</p>
    <p v-else-if="errorMsg" class="advice-error">{{ errorMsg }}</p>

    <ul v-else class="advice-list">
      <li>{{ umbrellaAdvice }}</li>
      <li>{{ outingAdvice }}</li>
      <li>{{ laundryAdvice }}</li>
      <li>{{ clothingAdvice }}</li>
    </ul>
  </div>
</template>

<style scoped>
.advice-panel {
  background: var(--surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: var(--space-3);
  margin-bottom: var(--space-2);
  border-left: 4px solid var(--accent);
}
.advice-panel h3 {
  margin: 0 0 var(--space-2);
  font-size: 16px;
  font-weight: 600;
  color: var(--text-heading);
}
.advice-list {
  margin: 0;
  padding-left: 0;
  list-style: none;
}
.advice-list li {
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-primary);
}
.advice-list li:last-child {
  border-bottom: none;
}
.advice-loading,
.advice-error {
  color: var(--text-secondary);
  font-size: 14px;
}
</style>
