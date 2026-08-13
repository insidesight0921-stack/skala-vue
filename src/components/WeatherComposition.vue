<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '대구', temp: 31, status: '폭염' },
  { id: 'city_05', name: '강릉', temp: 22, status: '흐림' },
])
const filteredWeatherList = computed(() =>
  weatherList.value.filter((c) => c.name.includes(searchQuery.value)),
)
const isSearchEmpty = computed(() => searchQuery.value.trim() === '')
const hasNoResult = computed(() => filteredWeatherList.value.length === 0)
const selectCity = (name) => (selectedCityInfo.value = `${name}이(가) 선택되었습니다.`)
watch(selectedCityInfo, (v) => console.log('👁️ [watch] 상태바 ->', v))
watchEffect(() => console.log('🤖 [watchEffect] 검색어:', searchQuery.value))
</script>
<template>
  <div>
    <h2>🔍 도시 검색</h2>
    <input :value="searchQuery" @input="searchQuery = $event.target.value" placeholder="도시명" />
    <p>검색 중인 도시: <strong>{{ searchQuery }}</strong></p>
    <h2>🌤️ 지역별 날씨 현황</h2>
    <p v-if="hasNoResult" class="status-bar">검색 결과가 일치하는 도시가 없습니다.</p>
    <template v-else>
      <p>{{ isSearchEmpty ? '전체 도시를 표시합니다.' : `'${searchQuery}' 검색 결과` }}</p>
      <div v-for="city in filteredWeatherList" :key="city.id" class="card" @click="selectCity(city.name)">
        <p><strong>{{ city.name }} ({{ city.status }})</strong> — {{ city.temp }}°C</p>
        <span v-if="city.temp >= 28" class="label hot">🔥 더움</span>
        <span v-else class="label cool">❄️ 선선함</span>
      </div>
    </template>
    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>
