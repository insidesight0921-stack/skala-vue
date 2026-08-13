<script setup>
import { ref } from 'vue'

// 날씨 데이터 배열 (본인 데이터 추가 포함)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '대구', temp: 31, status: '폭염' },
  { id: 'city_05', name: '강릉', temp: 22, status: '흐림' },
])

const searchText = ref('')
const statusMessage = ref('카드를 클릭하거나 검색해 보세요.')

const selectCity = (cityName) => {
  statusMessage.value = `${cityName}이(가) 선택되었습니다.`
}
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="weather-app">
    <h2>🔍 도시 검색</h2>
    <input
      type="text"
      :value="searchText"
      @input="searchText = $event.target.value"
      placeholder="도시명을 입력하세요."
    />
    <p>검색 중인 도시: <strong>{{ searchText }}</strong></p>

    <h2>🌤️ 지역별 날씨 현황</h2>
    <div
      v-for="city in weatherList"
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

    <p class="status-bar">{{ statusMessage }}</p>
  </div>
</template>

<style scoped>
.card { border: 1px solid #ddd; border-radius: 8px; padding: 12px 16px; margin: 8px 0; cursor: pointer; }
.city-name { font-weight: bold; font-size: 16px; }
.label { display: inline-block; padding: 3px 10px; border-radius: 5px; font-size: 13px; font-weight: bold; color: #fff; }
.hot { background-color: #e74c3c; }
.cool { background-color: #3498db; }
button { margin-top: 8px; padding: 4px 10px; cursor: pointer; }
.status-bar { margin-top: 12px; padding: 10px; background: #eafaf1; border-radius: 6px; text-align: center; color: #1c7a4f; font-weight: bold; }
input { width: 100%; padding: 8px; }
</style>
