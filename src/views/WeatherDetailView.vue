<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getWeatherById, getForecast } from '../api/weatherApi.js'
import AppCard from '../components/AppCard.vue'
import HeroWeather from '../components/HeroWeather.vue'
import WeatherAdvice from '../components/WeatherAdvice.vue'
import HourlyChart from '../components/HourlyChart.vue'

const route = useRoute()
const router = useRouter()

const city = ref(null)
const hours = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    city.value = await getWeatherById(route.params.cityId)
    const fc = await getForecast(city.value.name)
    hours.value = fc.slice(0, 8)
  } catch (e) {
    error.value = '상세 정보를 불러오지 못했습니다.'
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <el-button class="back" @click="router.push('/dashboard')">← 대시보드로</el-button>

    <el-skeleton v-if="loading" :rows="5" animated class="skel" />
    <el-empty v-else-if="!city" :description="error || '도시 정보를 찾을 수 없습니다.'" />

    <template v-else>
      <HeroWeather :city="city" :hours="hours" />
      <AppCard v-if="hours.length" title="시간별 기온" eyebrow="Hourly">
        <HourlyChart :hours="hours" />
      </AppCard>
      <AppCard title="오늘의 브리핑" eyebrow="Briefing">
        <WeatherAdvice :city="city.name" />
      </AppCard>
    </template>
  </div>
</template>

<style scoped>
.back {
  margin-bottom: var(--sp-2);
}
.skel {
  padding: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
}
</style>
