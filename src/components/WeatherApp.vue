<script setup>
import { ref } from 'vue'
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '대구', temp: 31, status: '폭염' },
  { id: 'city_05', name: '강릉', temp: 22, status: '흐림' },
])
const searchText = ref('')
const statusMessage = ref('카드를 클릭하거나 검색해 보세요.')
const selectCity = (name) => (statusMessage.value = `${name}이(가) 선택되었습니다.`)
const showDetail = (name, status) => window.alert(`${name}의 현재 날씨는 [${status}] 상태입니다.`)
</script>
<template>
  <div>
    <h2>🔍 도시 검색</h2>
    <input :value="searchText" @input="searchText = $event.target.value" placeholder="도시명을 입력하세요." />
    <p>검색 중인 도시: <strong>{{ searchText }}</strong></p>
    <h2>🌤️ 지역별 날씨 현황</h2>
    <div v-for="city in weatherList" :key="city.id" class="card" @click="selectCity(city.name)">
      <p><strong>{{ city.name }} ({{ city.status }})</strong></p>
      <p>현재 기온: {{ city.temp }}°C</p>
      <span v-if="city.temp >= 28" class="label hot">🔥 더움 (28도 이상)</span>
      <span v-else class="label cool">❄️ 선선함 (28도 미만)</span>
      <button @click.stop="showDetail(city.name, city.status)">상세보기</button>
    </div>
    <p class="status-bar">{{ statusMessage }}</p>
  </div>
</template>
