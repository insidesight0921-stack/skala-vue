<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { weatherList } from '../data/weatherData.js'
import { useConfigStore } from '../stores/configStore.js'
const route = useRoute()
const configStore = useConfigStore()
const city = ref(null)
onMounted(() => (city.value = weatherList.find((c) => c.id === route.params.cityId)))
const displayTemp = computed(() => {
  if (!city.value) return 0
  const t = city.value.temp
  return configStore.unit === 'fahrenheit' ? Math.round((t * 9) / 5 + 32) : t
})
</script>
<template>
  <div>
    <div v-if="city" class="card">
      <h2>📈 지역별 상세 기상 관측 정보</h2>
      <p>📍 지정 지역: <strong>{{ city.name }}</strong></p>
      <p>실시간 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
      <p>기상 현황: {{ city.status }}</p>
      <p>대기 습도: {{ city.humidity }}%</p>
      <p>현재 풍속: {{ city.wind }}m/s</p>
    </div>
    <div v-else class="card">해당 도시 정보를 찾을 수 없습니다.</div>
    <RouterLink to="/">← 메인 대시보드로 돌아가기</RouterLink>
  </div>
</template>
