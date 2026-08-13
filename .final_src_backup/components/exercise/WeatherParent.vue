<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import BaseModal from './BaseModal.vue'

// ===== 1. 반응형 상태 (원본은 전부 부모가 소유) =====
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '대구', temp: 31, status: '폭염' },
  { id: 'city_05', name: '강릉', temp: 22, status: '흐림' },
])
const filterMode = ref('all')

const isModalOpen = ref(false) // 모달 열림 여부
const selectedCity = ref(null) // 선택된 도시 객체

// ===== 2. computed =====
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
const hasNoResult = computed(() => resultCount.value === 0)

// 통계용 computed (원본 weatherList 기준)
const avgTemp = computed(() => {
  const list = weatherList.value
  if (list.length === 0) return 0
  const sum = list.reduce((acc, c) => acc + c.temp, 0)
  return Math.round(sum / list.length)
})

const hottestCity = computed(() => {
  // 온도가 가장 높은 도시 하나
  return weatherList.value.reduce((max, c) => (c.temp > max.temp ? c : max))
})

const coldestCity = computed(() => {
  return weatherList.value.reduce((min, c) => (c.temp < min.temp ? c : min))
})

// ===== 이벤트 핸들러 (자식들의 emit을 받는 곳) =====
// SearchBar의 update-query 수신 → 원본 검색어 갱신
const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}
// WeatherCard의 select-card 수신
const handleSelectCard = (cityName) => {
  selectedCityInfo.value = `${cityName}이(가) 선택되었습니다.`
}
// WeatherCard의 click-detail 수신
const handleClickDetail = (cityName) => {
  // 이름으로 도시 객체를 찾아 저장하고 모달 열기
  selectedCity.value = weatherList.value.find((c) => c.name === cityName)
  isModalOpen.value = true
}

// ===== 3. 감시 =====
watch(selectedCityInfo, (newVal) => {
  console.log(`👁️‍🗨️ [watch] 상태 바 문구 업데이트 -> "${newVal}"`)
})
watchEffect(() => {
  console.log(`🤖 [watchEffect] 검색어 '${searchQuery.value}' 필터링`)
})
watch(resultCount, (newCount, oldCount) => {
  console.log(`📊 [watch] 검색 건수: ${oldCount} → ${newCount}`)
})
</script>

<template>
  <div class="weather-parent">
    <!-- 검색 카드: BaseDashboardCard 껍데기 + SearchBar 주입 -->
    <BaseDashboardCard title="🔍 도시 검색 (한글 즉시 동기화)">
      <SearchBar :search-query="searchQuery" @update-query="handleUpdateQuery" />
    </BaseDashboardCard>

    <!-- 현황 카드: BaseDashboardCard 껍데기 + 목록 주입 -->
    <BaseDashboardCard title="🗺️ 지역별 날씨 현황">
      <div class="filter-bar">
        <label><input type="radio" value="all" v-model="filterMode" /> 전체</label>
        <label><input type="radio" value="hot" v-model="filterMode" /> 더움(28↑)</label>
        <label><input type="radio" value="cool" v-model="filterMode" /> 선선함(28↓)</label>
      </div>

      <p class="result-info">
        검색 건수: <strong>{{ resultCount }}</strong
        >건
      </p>

      <p v-if="hasNoResult" class="no-result">검색 결과가 일치하는 도시가 없습니다. 😢</p>

      <template v-else>
        <p class="result-info">
          {{ isSearchEmpty ? '전체 도시를 표시합니다.' : `'${searchQuery}' 검색 결과입니다.` }}
        </p>

        <!-- WeatherCard 반복 주입 + 이벤트 연결 -->
        <WeatherCard
          v-for="city in displayList"
          :key="city.id"
          :city="city"
          @select-card="handleSelectCard"
          @click-detail="handleClickDetail"
        />
      </template>
    </BaseDashboardCard>
    <BaseDashboardCard title="📊 날씨 통계">
      <div class="stat-row">
        <div class="stat-item">
          <p class="stat-label">평균 기온</p>
          <p class="stat-value">{{ avgTemp }}°C</p>
        </div>
        <div class="stat-item">
          <p class="stat-label">최고 기온</p>
          <p class="stat-value">{{ hottestCity.name }} {{ hottestCity.temp }}°C</p>
        </div>
        <div class="stat-item">
          <p class="stat-label">최저 기온</p>
          <p class="stat-value">{{ coldestCity.name }} {{ coldestCity.temp }}°C</p>
        </div>
      </div>
    </BaseDashboardCard>
    <p class="status-bar">{{ selectedCityInfo }}</p>
    <BaseModal v-if="isModalOpen" @close="isModalOpen = false">
      <h3>{{ selectedCity.name }} 상세 정보</h3>
      <p>날씨: {{ selectedCity.status }}</p>
      <p>현재 기온: {{ selectedCity.temp }}°C</p>
    </BaseModal>
  </div>
</template>

<style scoped>
.weather-parent {
  max-width: 480px;
}
.filter-bar {
  margin: 8px 0;
  display: flex;
  gap: 14px;
}
.result-info {
  color: #6b7a88;
  font-size: 14px;
  margin: 6px 0;
}
.no-result {
  padding: 20px;
  text-align: center;
  color: #e74c3c;
  font-weight: bold;
}
.status-bar {
  margin-top: 12px;
  padding: 10px;
  background-color: #eafaf1;
  border-radius: 6px;
  text-align: center;
  color: #1c7a4f;
  font-weight: bold;
}
.stat-row {
  display: flex;
  gap: 12px;
}
.stat-item {
  flex: 1;
  text-align: center;
  padding: 8px;
  background: #f7f9fa;
  border-radius: 8px;
}
.stat-label {
  font-size: 12px;
  color: #6b7a88;
  margin: 0 0 4px;
}
.stat-value {
  font-size: 15px;
  font-weight: bold;
  color: #35495e;
  margin: 0;
}
</style>
