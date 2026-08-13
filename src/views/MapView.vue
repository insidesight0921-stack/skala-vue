<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
// Vite 번들에서 Leaflet 기본 마커 아이콘이 깨지는 문제 방지
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})
import { getWeatherByCity, getWeatherByCoord, getPlaceNameKo } from '../api/weatherApi.js'
import { mapCities, koreanNameFor } from '../data/weatherData.js'
import { useTemperature } from '../composables/useTemperature.js'
import { useCommuteStore } from '../stores/commuteStore.js'
import AppCard from '../components/AppCard.vue'

const router = useRouter()
const commute = useCommuteStore()
const { format } = useTemperature()
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

// ── 통근 경로 선택 모드 ──
const commuteMode = ref(false)
const picks = ref([]) // [{ name }]
const pickMarkers = []
const commuteHint = computed(() =>
  picks.value.length === 0 ? '🏠 지도에서 집 위치를 클릭하세요' : '🏢 이제 근무지를 클릭하세요',
)
function toggleCommuteMode() {
  commuteMode.value = !commuteMode.value
  picks.value = []
  pickMarkers.forEach((m) => map.removeLayer(m))
  pickMarkers.length = 0
}
async function addCommutePick(lat, lon, city) {
  const label = picks.value.length === 0 ? '🏠 집' : '🏢 근무지'
  const marker = L.marker([lat, lon]).addTo(map).bindPopup(label).openPopup()
  pickMarkers.push(marker)

  let display, q
  if (city) {
    // 도시 마커: 한글 표시 + 영문 조회어
    display = city.ko
    q = city.name
  } else {
    // 임의 지점: 날씨명(조회어) + 역지오코딩 한글 표시
    const w = await getWeatherByCoord(lat, lon)
    q = w.name
    display = (await getPlaceNameKo(lat, lon)) || koreanNameFor(w.name) || w.name
  }
  picks.value.push({ display, q })

  if (picks.value.length === 2) {
    commute.setRoute(
      picks.value[0].display,
      picks.value[1].display,
      picks.value[0].q,
      picks.value[1].q,
    )
    router.push('/commute')
  }
}

const layers = [
  { key: 'clouds_new', label: '구름' },
  { key: 'precipitation_new', label: '강수' },
  { key: 'temp_new', label: '기온' },
  { key: 'wind_new', label: '바람' },
]
const legends = {
  clouds_new: { grad: 'linear-gradient(90deg, rgba(255,255,255,0), #cfcfcf, #7a7a7a)', min: '맑음', max: '구름 많음' },
  precipitation_new: { grad: 'linear-gradient(90deg, rgba(120,180,255,0), #6aa9e1, #3a5fd0, #7b2fd0)', min: '약함', max: '강함' },
  temp_new: { grad: 'linear-gradient(90deg, #3a5fd0, #4ea9e1, #7bc86c, #f5d742, #ee853c, #d0342c)', min: '-40°', max: '40°' },
  wind_new: { grad: 'linear-gradient(90deg, #e8e8e8, #9fd18c, #f5d742, #ee853c, #d0342c)', min: '0 m/s', max: '강풍' },
}

const currentLayer = ref(null)
const currentLegend = computed(() => (currentLayer.value ? legends[currentLayer.value] : null))
const selected = ref(null)

let map = null
let weatherTile = null
let clickMarker = null

function drawLayer(key) {
  if (weatherTile) map.removeLayer(weatherTile)
  weatherTile = null
  if (!key) return
  weatherTile = L.tileLayer(
    `https://tile.openweathermap.org/map/${key}/{z}/{x}/{y}.png?appid=${API_KEY}`,
    { opacity: 0.9 },
  ).addTo(map)
}
const toggleLayer = (key) => (currentLayer.value = currentLayer.value === key ? null : key)
watch(currentLayer, drawLayer)

onMounted(() => {
  map = L.map('map', { zoomControl: true }).setView([36.4, 127.8], 7)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap © CARTO',
    subdomains: 'abcd',
  }).addTo(map)

  mapCities.forEach((c) => {
    const m = L.marker([c.lat, c.lon]).addTo(map).bindPopup(c.ko)
    m.on('click', async () => {
      if (commuteMode.value) {
        addCommutePick(c.lat, c.lon, c)
        return
      }
      selected.value = await getWeatherByCity(c.name)
      selected.value.name = c.ko
    })
  })

  map.on('click', async (e) => {
    const { lat, lng } = e.latlng
    if (commuteMode.value) {
      addCommutePick(lat, lng, null)
      return
    }
    if (clickMarker) map.removeLayer(clickMarker)
    clickMarker = L.marker([lat, lng]).addTo(map)
    selected.value = await getWeatherByCoord(lat, lng)
    selected.value.name = koreanNameFor(selected.value.name)
  })
})

onUnmounted(() => map && map.remove())

const goDetail = () => selected.value?.id && router.push('/weather/' + selected.value.id)
</script>

<template>
  <div>
    <AppCard title="지도로 보는 날씨" eyebrow="Map">
      <p class="muted hint">마커나 지도 아무 곳이나 클릭하면 날씨가 표시됩니다. 레이어 버튼으로 기상 오버레이를 켜고 끌 수 있어요.</p>

      <div class="layers">
        <button
          v-for="l in layers"
          :key="l.key"
          class="layers__btn"
          :class="{ on: currentLayer === l.key }"
          @click="toggleLayer(l.key)"
        >
          {{ l.label }}
        </button>
        <button
          class="layers__btn commute-toggle"
          :class="{ on: commuteMode }"
          @click="toggleCommuteMode"
        >
          🚇 통근 경로 만들기
        </button>
      </div>

      <div v-if="commuteMode" class="commute-banner">{{ commuteHint }}</div>

      <div id="map"></div>

      <div v-if="currentLegend" class="legend">
        <span>{{ currentLegend.min }}</span>
        <span class="legend__bar" :style="{ background: currentLegend.grad }"></span>
        <span>{{ currentLegend.max }}</span>
      </div>
    </AppCard>

    <AppCard v-if="selected" :title="selected.name" eyebrow="Selected">
      <template #action>
        <button v-if="selected.id" class="btn-primary sm" @click="goDetail">상세 →</button>
      </template>
      <p class="sel">
        {{ selected.status }} · <strong>{{ format(selected.temp) }}</strong>
        <span class="muted"> · 습도 {{ selected.humidity }}% · 풍속 {{ selected.wind }}m/s</span>
      </p>
    </AppCard>
    <AppCard v-else>
      <p class="muted center">지도의 마커 또는 아무 지점이나 클릭해 보세요.</p>
    </AppCard>
  </div>
</template>

<style scoped>
.hint {
  margin: 0 0 12px;
  font-size: 13px;
}
.layers {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.layers__btn {
  padding: 7px 14px;
  font-size: 13px;
  background: var(--surface-2);
  color: var(--text-muted);
  border: 1px solid var(--border);
}
.layers__btn.on {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
.commute-toggle {
  margin-left: auto;
}
.commute-toggle.on {
  background: var(--warm);
  border-color: var(--warm);
  color: #fff;
}
.commute-banner {
  margin-bottom: 12px;
  padding: 10px 14px;
  border-radius: var(--r-md);
  background: var(--warm-weak);
  color: var(--warm);
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}
#map {
  width: 100%;
  height: 420px;
  border-radius: var(--r-md);
  overflow: hidden;
  border: 1px solid var(--border);
}
.legend {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 11px;
  color: var(--text-muted);
}
.legend__bar {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  border: 1px solid var(--border);
}
.sel {
  margin: 0;
  font-size: 15px;
}
.sm {
  padding: 7px 14px;
  font-size: 13px;
}
.center {
  text-align: center;
  padding: 8px 0;
}
</style>
