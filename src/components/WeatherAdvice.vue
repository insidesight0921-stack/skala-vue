<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getForecast } from '../api/weatherApi.js'

const props = defineProps({
  city: { type: String, required: true },
})

const forecast = ref([])
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    forecast.value = await getForecast(props.city)
  } catch (e) {
    error.value = '예보를 불러오지 못했습니다.'
    console.error(e)
  } finally {
    loading.value = false
  }
}
onMounted(load)
watch(() => props.city, load)

const toKoHour = (h) =>
  h === 0 ? '자정' : h === 12 ? '정오' : h < 12 ? `오전 ${h}시` : `오후 ${h - 12}시`

const next24h = computed(() => forecast.value.slice(0, 8))

const items = computed(() => {
  const day = next24h.value
  if (!day.length) return []
  const list = []

  // 우산
  const rainy = day.find((f) => f.pop >= 0.5 || f.rain > 0)
  list.push(
    rainy
      ? { icon: '☔', text: `${toKoHour(rainy.hour)}부터 비 예상 (강수확률 ${Math.round(rainy.pop * 100)}%). 우산 챙기세요.` }
      : { icon: '🌤️', text: '당분간 비 소식은 없어요.' },
  )

  // 외출
  const good = day.filter((f) => f.pop < 0.3 && f.temp >= 16 && f.temp <= 26)
  list.push(
    good.length
      ? { icon: '🚶', text: `산책하기 좋은 시간: ${toKoHour(good[0].hour)} 무렵` }
      : { icon: '🚶', text: '외출하기 딱 좋은 시간대가 마땅치 않아요.' },
  )

  // 빨래
  const willRain = day.some((f) => f.pop >= 0.4 || f.rain > 0)
  const avgHum = day.reduce((s, f) => s + f.humidity, 0) / day.length
  list.push({
    icon: '🧺',
    text: willRain
      ? '오늘 빨래는 비추천 (비 예보 있음).'
      : avgHum < 65
        ? '빨래 널기 좋아요! (건조하고 비 없음)'
        : '빨래는 가능하나 습도가 높아 잘 안 마를 수 있어요.',
  })

  // 옷차림
  const t = day[0].feelsLike
  const cloth =
    t >= 28 ? '매우 더워요. 반팔·반바지, 수분 섭취를 챙기세요.'
    : t >= 23 ? '반팔이 적당해요.'
    : t >= 17 ? '얇은 겉옷을 챙기세요.'
    : t >= 12 ? '자켓이나 가디건이 필요해요.'
    : t >= 6 ? '코트를 입으세요.'
    : '두꺼운 패딩과 목도리를 챙기세요.'
  list.push({ icon: '👕', text: `체감 ${t}°C, ${cloth}` })

  return list
})
</script>

<template>
  <div>
    <p v-if="loading" class="muted">브리핑 분석 중…</p>
    <p v-else-if="error" class="muted">{{ error }}</p>
    <ul v-else class="advice">
      <li v-for="(a, i) in items" :key="i" class="advice__item">
        <span class="advice__icon">{{ a.icon }}</span>
        <span>{{ a.text }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.advice {
  list-style: none;
  margin: 0;
  padding: 0;
}
.advice__item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 11px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}
.advice__item:last-child {
  border-bottom: none;
}
.advice__icon {
  font-size: 17px;
  line-height: 1.4;
}
</style>
