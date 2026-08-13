<script setup>
import { ref } from 'vue'

// 날씨 데이터 배열
const weatherList = ref([
    { id: 'city_01', name: '서울', temp: 26, status: '비'},
    { id: 'city_02', name: '부산', temp: 24, status: '구름'},
    { id: 'city_03', name: '울산', temp: 28, status: '맑음'},
    { id: 'city_04', name: '대구', temp: 31, status: '폭염' },
    { id: 'city_05', name: '강릉', temp: 22, status: '흐림' },
])

const searchText = ref('')

// 상태바 메시지
const statusMessage = ref('카드를 클릭하거나 검색해 보세요.')

// ① 카드 클릭 → 상태바 갱신
const selectCity = (cityName) => {
    statusMessage.value = `${cityName}이 선택되었습니다.`
}

// ② 상세보기 버튼 → alert
const showDetail = (cityName, status) => {
    window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
    <div class="Weather-Data">
        <h3>🔍 도시 검색</h3>
        <input type="text" :value="searchText" @input="searchText = $event.target.value" placeholder="도시명을 입력하세요." />
        <p>검색 중인 도시: <strong>{{ searchText }}</strong></p>
        <h2>🌤️ 지역별 날씨 현황</h2>
        
        <!-- v-for로 카드 반복. :key에 고유 id 필수! -->
        <div v-for="city in weatherList" :key="city.id" class="card" @click="selectCity(city.name)">
            <p class="city-name">{{ city.name }} ({{ city.status }})</p>
            <p>현재 기온: {{ city.temp }}°C</p>

            <!-- 조건부 렌더링: 28도 기준으로 라벨 분기 -->
            <span v-if="city.temp >=28" class="label hot">🔥 더움 (28도 이상)</span>
            <span v-else class="label cool">❄️ 선선함 (28도 미만)</span>

            <!-- 상세보기 버튼: 버블링 방지가 핵심 -->
            <button @click.stop="showDetail(city.name, city.status)">상세보기</button>
        </div>
    </div>
    <p class="status-bar">{{ statusMessage }}</p>
</template>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 8px 0;
}
.city-name {
  font-weight: bold;
  font-size: 16px;
}
.label {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 5px;
  font-size: 13px;
  font-weight: bold;
  color: white;
}
.hot {
  background-color: #e74c3c; /* 빨강 */
}
.cool {
  background-color: #3498db; /* 파랑 */
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
button {
  margin-top: 8px;
  padding: 4px 10px;
  cursor: pointer;
}
</style>