<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { weatherList as data } from '../data/weatherData.js'
import BaseDashboardCard from '../components/BaseDashboardCard.vue'
import SearchBar from '../components/SearchBar.vue'
import WeatherCard from '../components/WeatherCard.vue'
const router = useRouter()
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const weatherList = ref(data)
const filtered = computed(() => weatherList.value.filter((c) => c.name.includes(searchQuery.value)))
const onSelect = (name) => (selectedCityInfo.value = `${name} 선택됨`)
const onDetail = (name) => {
  const c = weatherList.value.find((x) => x.name === name)
  router.push('/weather/' + c.id)
}
</script>
<template>
  <div>
    <BaseDashboardCard title="🔍 도시 검색">
      <SearchBar :search-query="searchQuery" @update-query="(q) => (searchQuery = q)" />
    </BaseDashboardCard>
    <BaseDashboardCard title="🌤️ 지역별 날씨 현황">
      <WeatherCard v-for="c in filtered" :key="c.id" :city="c" @select-card="onSelect" @click-detail="onDetail" />
    </BaseDashboardCard>
    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>
