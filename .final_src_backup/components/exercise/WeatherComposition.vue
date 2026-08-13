<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// ===== 1. 반응형 상태 (요구사항 1) =====
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '대구', temp: 31, status: '폭염' },
  { id: 'city_05', name: '강릉', temp: 22, status: '흐림' },
])

// ===== 5-① 나만의 상태: 온도 필터 모드 ('all' | 'hot' | 'cool') =====
const filterMode = ref('all')

// ===== 2. 검색 필터 computed (요구사항 2) =====
const filteredWeatherList = computed(() => {
  return weatherList.value.filter((city) =>
    city.name.includes(searchQuery.value)
  )
})

// 검색 + 온도필터 동시 적용 (computed가 computed를 재료로 사용)
const displayList = computed(() => {
  if (filterMode.value === 'hot') {
    return filteredWeatherList.value.filter((c) => c.temp >= 28)
  }
  if (filterMode.value === 'cool') {
    return filteredWeatherList.value.filter((c) => c.temp < 28)
  }
  return filteredWeatherList.value
})

// ===== 5-② 나만의 computed: 검색 건수 =====
const resultCount = computed(() => displayList.value.length)

// 결과 상태 판단용 computed
const isSearchEmpty = computed(() => searchQuery.value.trim() === '')
const hasNoResult = computed(() => resultCount.value === 0)

// ===== 이벤트 핸들러 =====
const selectCity = (cityName) => {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// ===== 3. 감시 (요구사항 3) =====
// selectedCityInfo 감시 → watch (전후 값 비교 가능)
watch(selectedCityInfo, (newVal) => {
  console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구 업데이트됨 -> "${newVal}"`)
})

// searchQuery 감시 → watchEffect (자동 추적 + 초기 1회 실행)
watchEffect(() => {
  console.log(`🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 데이터를 필터링합니다.`)
})

// ===== 5-③ 나만의 watcher: 검색 건수가 바뀔 때 로그 =====
watch(resultCount, (newCount, oldCount) => {
  console.log(`📊 [watch] 검색 건수 변경: ${oldCount}개 → ${newCount}개`)
})
</script>

<template>
  <div class="weather-data">
    <h3>🔍 도시 검색</h3>
    <input
      type="text"
      :value="searchQuery"
      @input="searchQuery = $event.target.value"
      placeholder="도시명을 입력하세요."
    />
    <p>검색 중인 도시: <strong>{{ searchQuery }}</strong></p>

    <h2>🌤️ 지역별 날씨 현황</h2>

    <!-- 5-① 온도 필터 (라디오 = 반응형 상태 filterMode와 양방향 바인딩) -->
    <div class="filter-bar">
      <label><input type="radio" value="all" v-model="filterMode" /> 전체</label>
      <label><input type="radio" value="hot" v-model="filterMode" /> 더움(28↑)</label>
      <label><input type="radio" value="cool" v-model="filterMode" /> 선선함(28↓)</label>
    </div>

    <!-- 5-② 검색 건수 -->
    <p class="result-info">검색 건수: <strong>{{ resultCount }}</strong>건</p>

    <!-- 4. 조건부 결과 표시 (요구사항 4) -->
    <p v-if="hasNoResult" class="no-result">
      검색 결과가 일치하는 도시가 없습니다. 😢
    </p>

    <template v-else>
      <p class="result-info">
        {{ isSearchEmpty ? '전체 도시를 표시합니다.' : `'${searchQuery}' 검색 결과입니다.` }}
      </p>

      <div
        v-for="city in displayList"
        :key="city.id"
        class="card"
        @click="selectCity(city.name)"
      >
        <p class="city-name">{{ city.name }} ({{ city.status }})</p>
        <p>현재 기온: {{ city.temp }}°C</p>

        <span v-if="city.temp >= 28" class="label hot">🔥 더움 (28도 이상)</span>
        <span v-else class="label cool">❄️ 선선함 (28도 미만)</span>

        <button @click.stop="showDetail(city.name, city.status)">상세보기</button>
      </div>
    </template>

    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>

<style scoped>
.weather-data { max-width: 480px; }
.filter-bar { margin: 8px 0; display: flex; gap: 14px; }
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 8px 0;
  cursor: pointer;
}
.city-name { font-weight: bold; font-size: 16px; }
.label {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 5px;
  font-size: 13px;
  font-weight: bold;
  color: white;
}
.hot { background-color: #e74c3c; }
.cool { background-color: #3498db; }
.result-info { color: #6b7a88; font-size: 14px; margin: 6px 0; }
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
button { margin-top: 8px; padding: 4px 10px; cursor: pointer; }
</style>