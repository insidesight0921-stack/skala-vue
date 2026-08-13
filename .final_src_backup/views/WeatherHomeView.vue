<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchWeather } from '../api/weatherApi.js'
import { defaultCities } from '../data/weatherData.js'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'

const router = useRouter()

// ===== 상태 =====
const weatherList = ref([]) // API로 불러온 날씨 목록
const searchQuery = ref('')
const filterMode = ref('all')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const isLoading = ref(true) // 로딩 상태
const errorMsg = ref('') // 에러 메시지

// ===== 초기 데이터: 대표 도시들을 API로 조회 =====
onMounted(async () => {
  try {
    const results = await Promise.all(defaultCities.map((city) => fetchWeather(city)))
    weatherList.value = results
  } catch (e) {
    errorMsg.value = '날씨 정보를 불러오지 못했습니다. (API 키/네트워크 확인)'
    console.error(e)
  } finally {
    isLoading.value = false
  }
})

// ===== computed =====
const filteredWeatherList = computed(() =>
  weatherList.value.filter((city) => city.name.includes(searchQuery.value)),
)
const displayList = computed(() => {
  if (filterMode.value === 'hot') return filteredWeatherList.value.filter((c) => c.temp >= 28)
  if (filterMode.value === 'cool') return filteredWeatherList.value.filter((c) => c.temp < 28)
  return filteredWeatherList.value
})
const resultCount = computed(() => displayList.value.length)
const isSearchEmpty = computed(() => searchQuery.value.trim() === '')
const hasNoResult = computed(() => !isLoading.value && resultCount.value === 0)

// ===== 핸들러 =====
const handleClickDetail = (cityName) => {
  const city = weatherList.value.find((c) => c.name === cityName)
  if (city) router.push('/weather/' + city.id)
}
const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}
const handleSelectCard = (cityName) => {
  selectedCityInfo.value = `선택된 도시: ${cityName}`
}
// 검색 실행: 입력한 도시를 API로 조회해 목록 맨 앞에 추가
const handleSearch = async (cityName) => {
  const query = cityName.trim()
  if (!query) return

  isLoading.value = true
  errorMsg.value = ''
  try {
    const result = await fetchWeather(query)
    // 이미 있으면 갱신, 없으면 맨 앞에 추가
    const idx = weatherList.value.findIndex((c) => c.id === result.id)
    if (idx >= 0) {
      weatherList.value[idx] = result
    } else {
      weatherList.value.unshift(result)
    }
    selectedCityInfo.value = `'${result.name}' 검색 완료`
  } catch (e) {
    errorMsg.value = `'${query}' 도시를 찾을 수 없습니다.`
    console.error(e)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="weather-home">
    <BaseDashboardCard title="🔍 도시 검색">
      <SearchBar
        :search-query="searchQuery"
        @update-query="handleUpdateQuery"
        @search="handleSearch"
      />
    </BaseDashboardCard>

    <BaseDashboardCard title="🗺️ 지역별 날씨 현황">
      <div class="filter-bar">
        <label><input type="radio" value="all" v-model="filterMode" /> 전체</label>
        <label><input type="radio" value="hot" v-model="filterMode" /> 더움(28↑)</label>
        <label><input type="radio" value="cool" v-model="filterMode" /> 선선함(28↓)</label>
      </div>

      <!-- 로딩 / 에러 / 결과없음 -->
      <p v-if="isLoading" class="info-msg">⏳ 날씨를 불러오는 중...</p>
      <p v-else-if="errorMsg" class="no-result">{{ errorMsg }}</p>
      <p v-else-if="hasNoResult" class="no-result">일치하는 도시가 없습니다. 😢</p>

      <template v-else>
        <p class="result-info">
          검색 건수: <strong>{{ resultCount }}</strong
          >건
        </p>
        <div class="weather-grid">
          <WeatherCard
            v-for="city in displayList"
            :key="city.id"
            :city="city"
            @select-card="handleSelectCard"
            @click-detail="handleClickDetail"
          />
        </div>
      </template>
    </BaseDashboardCard>

    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>

<style scoped>
.weather-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.weather-grid > :first-child {
  grid-column: 1 / -1;
}
/* 첫 카드 = 히어로: 큰 온도 */
.weather-grid > :first-child :deep(.temp) {
  font-size: 52px;
}
.weather-grid > :first-child :deep(.card) {
  padding: 24px;
}
.weather-grid > :first-child :deep(.city-name) {
  font-size: 20px;
}
@media (max-width: 540px) {
  .weather-grid {
    grid-template-columns: 1fr;
  }
  .weather-grid > :first-child {
    grid-column: auto;
  }
}
.filter-bar {
  margin: 8px 0 4px;
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: var(--text-secondary);
}
.filter-bar label {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
.result-info {
  color: var(--text-secondary);
  font-size: 13px;
  margin: 6px 0;
}
.result-info strong {
  color: var(--accent);
}
.info-msg {
  color: var(--text-secondary);
  text-align: center;
  padding: 24px;
}
.no-result {
  padding: 24px;
  text-align: center;
  color: var(--accent);
  font-weight: 600;
}
.status-bar {
  margin-top: var(--space-2);
  padding: 14px;
  background: var(--accent-soft);
  border-radius: var(--radius-chip);
  text-align: center;
  color: var(--accent);
  font-weight: 600;
}
</style>
