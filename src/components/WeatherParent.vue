<script setup>
import { ref, computed } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])
const filtered = computed(() => weatherList.value.filter((c) => c.name.includes(searchQuery.value)))
const onQuery = (q) => (searchQuery.value = q)
const onSelect = (name) => (selectedCityInfo.value = `${name}이(가) 선택되었습니다.`)
const onDetail = (name) => window.alert(`${name} 상세보기`)
</script>
<template>
  <div>
    <BaseDashboardCard title="🔍 도시 검색">
      <SearchBar :search-query="searchQuery" @update-query="onQuery" />
    </BaseDashboardCard>
    <BaseDashboardCard title="🌤️ 지역별 날씨 현황">
      <WeatherCard v-for="c in filtered" :key="c.id" :city="c" @select-card="onSelect" @click-detail="onDetail" />
    </BaseDashboardCard>
    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>
