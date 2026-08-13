<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fetchWeather, fetchWeatherByCoord } from '../api/weatherApi.js'

const router = useRouter()
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

const cities = [
  { name: 'Seoul', lat: 37.57, lon: 126.98 },
  { name: 'Busan', lat: 35.18, lon: 129.08 },
  { name: 'Daegu', lat: 35.87, lon: 128.6 },
  { name: 'Incheon', lat: 37.46, lon: 126.71 },
  { name: 'Gangneung', lat: 37.75, lon: 128.9 },
]

// ===== 1번: 레이어 전환 상태 =====
const currentLayer = ref(null)   // 현재 날씨 레이어 (초기: 선택 안 함)
const layers = [
  { key: 'clouds_new', label: '구름' },
  { key: 'precipitation_new', label: '강수' },
  { key: 'temp_new', label: '기온' },
  { key: 'wind_new', label: '바람' },
]

// 레이어별 색상 범례 (gradient + 좌/우 라벨)
const legends = {
  clouds_new: {
    gradient: 'linear-gradient(90deg, rgba(255,255,255,0), #d0d0d0, #808080)',
    min: '맑음',
    max: '구름 많음',
  },
  precipitation_new: {
    gradient: 'linear-gradient(90deg, rgba(120,180,255,0), #6aa9e1, #3a5fd0, #7b2fd0)',
    min: '약함',
    max: '강함',
  },
  temp_new: {
    gradient: 'linear-gradient(90deg, #3a5fd0, #4ea9e1, #7bc86c, #f5d742, #ee853c, #d0342c)',
    min: '-40°C',
    max: '40°C',
  },
  wind_new: {
    gradient: 'linear-gradient(90deg, #e8e8e8, #9fd18c, #f5d742, #ee853c, #d0342c)',
    min: '0 m/s',
    max: '강풍',
  },
}
const currentLegend = computed(() => legends[currentLayer.value])

const selectedWeather = ref(null)
let map = null
let weatherTileLayer = null   // 날씨 타일만 따로 참조 (교체용)
let clickMarker = null        // 클릭 위치 임시 마커

// 날씨 레이어를 그리는 함수 (교체 시 재사용)
const drawWeatherLayer = (layerKey) => {
  if (weatherTileLayer) map.removeLayer(weatherTileLayer)   // 기존 것 제거
  weatherTileLayer = null
  if (!layerKey) return   // 선택 해제 상태면 바탕 지도만 표시
  weatherTileLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/${layerKey}/{z}/{x}/{y}.png?appid=${API_KEY}`,
    { opacity: 0.9 },
  ).addTo(map)
}

// 같은 버튼 재클릭 → 해제(null) / 다른 버튼 → 교체 (중복 선택 불가)
const toggleLayer = (key) => {
  currentLayer.value = currentLayer.value === key ? null : key
}

onMounted(() => {
  map = L.map('map').setView([36.5, 127.8], 7)
  // 밝은 회색 바탕지도 → 날씨 색상 레이어가 선명하게 대비됨
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap © CARTO',
    subdomains: 'abcd',
  }).addTo(map)

  drawWeatherLayer(currentLayer.value)   // 초기 날씨 레이어

  // 도시 마커
  cities.forEach((city) => {
    const marker = L.marker([city.lat, city.lon]).addTo(map)
    marker.bindPopup(city.name)
    marker.on('click', async () => {
      selectedWeather.value = await fetchWeather(city.name)
    })
  })

  // ===== 2번: 지도 아무 곳이나 클릭 → 그 좌표 날씨 =====
  map.on('click', async (e) => {
    const { lat, lng } = e.latlng
    if (clickMarker) map.removeLayer(clickMarker)     // 이전 클릭 마커 제거
    clickMarker = L.marker([lat, lng]).addTo(map)
    selectedWeather.value = await fetchWeatherByCoord(lat, lng)
  })
})

// 레이어 버튼을 누르면 currentLayer가 바뀌고 → 지도 레이어 교체
watch(currentLayer, (newKey) => {
  drawWeatherLayer(newKey)
})

onUnmounted(() => {
  if (map) map.remove()
})

const goDetail = (id) => router.push('/weather/' + id)
</script>

<template>
  <div class="map-view">
    <div class="map-card">
      <h2>🗺️ 지도로 보는 날씨</h2>
      <p class="hint">마커나 지도 아무 곳이나 클릭하면 날씨가 표시됩니다.</p>

      <!-- 1번: 레이어 전환 버튼 -->
      <div class="layer-buttons">
        <button
          v-for="layer in layers"
          :key="layer.key"
          :class="{ active: currentLayer === layer.key }"
          @click="toggleLayer(layer.key)"
        >
          {{ layer.label }}
        </button>
      </div>

      <div id="map"></div>

      <!-- 레이어 색상 범례 (선택된 레이어가 있을 때만) -->
      <div v-if="currentLegend" class="legend">
        <span class="legend-min">{{ currentLegend.min }}</span>
        <span class="legend-bar" :style="{ background: currentLegend.gradient }"></span>
        <span class="legend-max">{{ currentLegend.max }}</span>
      </div>
    </div>

    <div v-if="selectedWeather" class="info-card">
      <h3>{{ selectedWeather.name }} ({{ selectedWeather.status }})</h3>
      <p>현재 기온: {{ selectedWeather.temp }}°C</p>
      <p>습도: {{ selectedWeather.humidity }}% / 풍속: {{ selectedWeather.wind }}m/s</p>
      <button v-if="selectedWeather.id" @click="goDetail(selectedWeather.id)">상세보기 →</button>
    </div>
    <div v-else class="info-card empty">마커 또는 지도를 클릭해 보세요.</div>
  </div>
</template>

<style scoped>
.map-card,
.info-card {
  background: var(--surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: var(--space-3);
  margin-bottom: var(--space-2);
}
.map-card h2 {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 700;
}
.hint {
  color: var(--text-secondary);
  font-size: 13px;
  margin: 0 0 12px;
}
.layer-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.layer-buttons button {
  padding: 7px 14px;
  font-size: 13px;
  background: var(--bg-muted);
  color: var(--text-secondary);
}
.layer-buttons button.active {
  background: var(--btn-bg);
  color: var(--btn-fg);
}
#map {
  width: 100%;
  height: 400px;
  border-radius: var(--radius-chip);
  overflow: hidden;
}
.legend {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 11px;
  color: var(--text-secondary);
}
.legend-bar {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  border: 1px solid var(--border);
}
.legend-min,
.legend-max {
  white-space: nowrap;
  font-weight: 600;
}
.info-card h3 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 700;
}
.info-card p {
  margin: 6px 0;
  color: var(--text-secondary);
  font-size: 14px;
}
.info-card.empty {
  color: var(--text-secondary);
  text-align: center;
}
.info-card button {
  margin-top: 10px;
  padding: 10px 16px;
  background: var(--btn-bg);
  color: var(--btn-fg);
}
</style>