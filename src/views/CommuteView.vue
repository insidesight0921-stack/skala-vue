<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getForecast,
  getWeatherByCity,
  getWeatherByCoord,
  getPlaceNameKo,
} from '../api/weatherApi.js'
import { getRouteDomestic, sampleAlong, isDomestic } from '../api/routeApi.js'
import { resolveCityQuery, koreanNameFor } from '../data/weatherData.js'
import { useCommuteStore } from '../stores/commuteStore.js'
import { useTemperature } from '../composables/useTemperature.js'
import AppCard from '../components/AppCard.vue'

const commute = useCommuteStore()
const { convert, symbol } = useTemperature()

const home = ref(commute.homeCity)
const work = ref(commute.workCity)
const depart = ref(commute.departHour)
const ret = ref(commute.returnHour)

const loading = ref(false)
const loaded = ref(false)
const hours24 = Array.from({ length: 24 }, (_, i) => i)

const route = ref(null)
const routePoints = ref([])
const routeNote = ref('')
const homeFc = ref([])
const workFc = ref([])

const iconUrl = (i) => `https://openweathermap.org/img/wn/${i}.png`
const isRainy = (s) => /비|눈|소나기|뇌우|우박|이슬비|진눈깨비/.test(s || '')

// 표시명(display)과 조회어(query)를 분리해서 실행
async function runSearch(homeQ, workQ, homeDisplay, workDisplay) {
  loading.value = true
  routeNote.value = ''
  route.value = null
  routePoints.value = []
  try {
    commute.setRoute(homeDisplay, workDisplay, homeQ, workQ)
    commute.setTimes(depart.value, ret.value)

    const [homeW, workW, hFc, wFc] = await Promise.all([
      getWeatherByCity(homeQ),
      getWeatherByCity(workQ),
      getForecast(homeQ),
      getForecast(workQ),
    ])
    homeFc.value = hFc
    workFc.value = wFc
    homeW.label = homeDisplay
    workW.label = workDisplay
    loaded.value = true

    const from = { lat: homeW.lat, lon: homeW.lon }
    const to = { lat: workW.lat, lon: workW.lon }

    if (isDomestic(from, to)) {
      try {
        const r = await getRouteDomestic(from, to)
        route.value = { distanceKm: r.distanceKm, durationMin: r.durationMin }
        const samples = sampleAlong(r.coords, 4)
        const [mids, koNames] = await Promise.all([
          Promise.all(samples.map((s) => getWeatherByCoord(s.lat, s.lon))),
          Promise.all(samples.map((s) => getPlaceNameKo(s.lat, s.lon))),
        ])
        mids.forEach((p, i) => {
          p.label = koNames[i] || koreanNameFor(p.name) || p.name
        })
        mids[0].label = homeDisplay
        mids[mids.length - 1].label = workDisplay
        routePoints.value = mids
      } catch (re) {
        routeNote.value = '경로 서버 응답이 없어 출발/도착 지점 기준으로 안내합니다.'
        routePoints.value = [homeW, workW]
        console.error(re)
      }
    } else {
      routeNote.value = '⚠️ 통근 최적 경로는 국내 지역만 지원합니다. 해외 구간은 출발·도착 지점 날씨로 안내합니다.'
      routePoints.value = [homeW, workW]
    }
  } catch (e) {
    ElMessage.error('도시를 찾을 수 없습니다. 다른 표기로 시도해 보세요.')
    console.error(e)
  } finally {
    loading.value = false
  }
}

// 입력창으로 조회 (한글 입력 → 조회어 변환)
function searchManual() {
  const hd = home.value.trim()
  const wd = work.value.trim()
  if (!hd || !wd) return
  runSearch(resolveCityQuery(hd), resolveCityQuery(wd), hd, wd)
}

// 진입 시(지도에서 넘어온 경우 포함) 저장된 표시명/조회어로 자동 조회
onMounted(() => {
  home.value = commute.homeCity
  work.value = commute.workCity
  depart.value = commute.departHour
  ret.value = commute.returnHour
  runSearch(commute.homeQuery, commute.workQuery, commute.homeCity, commute.workCity)
})

// ── 경로 종합 브리핑 ──
const routeBriefing = computed(() => {
  const pts = routePoints.value
  if (!pts.length) return []
  const temps = pts.map((p) => p.temp)
  const min = Math.min(...temps)
  const max = Math.max(...temps)
  const feels = Math.round(pts.reduce((s, p) => s + p.feelsLike, 0) / pts.length)
  const rainy = pts.filter((p) => isRainy(p.status))
  const lines = []

  if (rainy.length) {
    const names = [...new Set(rainy.map((p) => p.label))].join(', ')
    lines.push({ icon: '☔', text: `경로 중 ${names} 부근에 비/눈 — 우산 필수` })
  } else {
    lines.push({ icon: '🌤️', text: '경로 전 구간 강수 없음 — 우산 없이 이동 OK' })
  }
  lines.push({
    icon: '🌡️',
    text: min === max ? `경로 기온 약 ${convert(min)}${symbol.value}` : `경로 기온 ${convert(min)}~${convert(max)}${symbol.value} (구간 편차 ${max - min}°)`,
  })
  const cloth =
    feels >= 28 ? '매우 더워요. 반팔·수분 섭취'
    : feels >= 23 ? '반팔이 적당'
    : feels >= 17 ? '얇은 겉옷 챙기기'
    : feels >= 12 ? '자켓·가디건 필요'
    : feels >= 6 ? '코트 착용'
    : '두꺼운 패딩'
  lines.push({ icon: '👕', text: `경로 평균 체감 ${convert(feels)}${symbol.value} — ${cloth}` })
  lines.push({
    icon: '🧭',
    text: (rainy.length ? '☂️ 우산 챙기고 ' : '☀️ 우산 없이 ') + `${cloth} 차림으로 출발하세요.`,
  })
  return lines
})

// ── 출/퇴근 시간대 (양 끝점 예보) ──
const pick = (list, hour) => {
  if (!list.length) return null
  const today = list[0].date
  const pool = list.filter((f) => f.date === today)
  const arr = pool.length ? pool : list
  return arr.reduce((b, f) => (Math.abs(f.hour - hour) < Math.abs(b.hour - hour) ? f : b))
}
const desc = (f) => {
  if (!f) return '정보 없음'
  const rainy = f.pop >= 0.5 || f.rain > 0
  return `${rainy ? '☔' : '🌤️'} ${f.status}, ${convert(f.temp)}${symbol.value}${rainy ? ` (비 ${Math.round(f.pop * 100)}%)` : ''}`
}
const morning = computed(() => ({
  home: desc(pick(homeFc.value, commute.departHour)),
  work: desc(pick(workFc.value, commute.departHour)),
}))
const evening = computed(() => ({
  work: desc(pick(workFc.value, commute.returnHour)),
  home: desc(pick(homeFc.value, commute.returnHour)),
}))
</script>

<template>
  <div>
    <AppCard title="통근 경로 날씨" eyebrow="Commute">
      <p class="muted hint">집과 회사를 등록하면 <strong>경로를 따라</strong> 여러 지점의 날씨를 종합해 브리핑해 드려요.</p>
      <p class="domestic-note">🇰🇷 최적 경로 브리핑은 <strong>국내 지역만</strong> 지원합니다. (해외는 출발·도착 지점 날씨로 안내)</p>
      <div class="form">
        <label class="field">
          <span>🏠 집</span>
          <el-input v-model="home" placeholder="예: 서울" clearable @keyup.enter="searchManual" />
        </label>
        <label class="field">
          <span>🏢 회사</span>
          <el-input v-model="work" placeholder="예: 인천" clearable @keyup.enter="searchManual" />
        </label>
        <label class="field sm">
          <span>출근</span>
          <el-select v-model="depart" class="hour">
            <el-option v-for="h in hours24" :key="h" :value="h" :label="`${h}시`" />
          </el-select>
        </label>
        <label class="field sm">
          <span>퇴근</span>
          <el-select v-model="ret" class="hour">
            <el-option v-for="h in hours24" :key="h" :value="h" :label="`${h}시`" />
          </el-select>
        </label>
      </div>
      <el-button type="primary" size="large" :loading="loading" @click="searchManual">
        경로 날씨 조회
      </el-button>
    </AppCard>

    <el-skeleton v-if="loading" :rows="4" animated class="skel" />

    <template v-else-if="loaded">
      <AppCard title="경로 종합 브리핑" eyebrow="Route Briefing">
        <template #action>
          <span v-if="route" class="route-meta">🚗 {{ route.distanceKm }}km · {{ route.durationMin }}분</span>
        </template>

        <div v-if="routePoints.length" class="route-strip">
          <template v-for="(p, i) in routePoints" :key="i">
            <div class="rp">
              <span class="rp__label">{{ p.label }}</span>
              <img class="rp__icon" :src="iconUrl(p.icon)" alt="" />
              <span class="rp__temp">{{ convert(p.temp) }}{{ symbol }}</span>
            </div>
            <span v-if="i < routePoints.length - 1" class="rp__arrow">→</span>
          </template>
        </div>

        <ul class="brief">
          <li v-for="(b, i) in routeBriefing" :key="i">
            <span class="brief__icon">{{ b.icon }}</span><span>{{ b.text }}</span>
          </li>
        </ul>
        <p v-if="routeNote" class="muted note">{{ routeNote }}</p>
      </AppCard>

      <div class="cols">
        <AppCard :title="`출근길 · 오전 ${commute.departHour}시`" eyebrow="Morning">
          <p>🏠 {{ commute.homeCity }}: {{ morning.home }}</p>
          <p>🏢 {{ commute.workCity }}: {{ morning.work }}</p>
        </AppCard>
        <AppCard :title="`퇴근길 · 오후 ${commute.returnHour - 12}시`" eyebrow="Evening">
          <p>🏢 {{ commute.workCity }}: {{ evening.work }}</p>
          <p>🏠 {{ commute.homeCity }}: {{ evening.home }}</p>
        </AppCard>
      </div>
    </template>
  </div>
</template>

<style scoped>
.hint {
  margin: 0 0 6px;
  font-size: 13px;
}
.domestic-note {
  margin: 0 0 14px;
  font-size: 12.5px;
  color: var(--accent);
  background: var(--accent-weak);
  padding: 8px 12px;
  border-radius: var(--r-md);
}
.form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}
.field {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-muted);
}
.field :deep(.el-input),
.field :deep(.el-select) {
  flex: 1;
}
.field.sm {
  flex: 0 0 auto;
}
.hour {
  width: 96px;
}
.field:not(.sm) {
  flex: 1;
  min-width: 200px;
}
.skel {
  padding: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  margin-bottom: var(--sp-2);
}
.route-meta {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
}
.route-strip {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  padding: 4px 0 14px;
  margin-bottom: 6px;
  border-bottom: 1px solid var(--border);
}
.rp {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 68px;
  flex: 0 0 auto;
}
.rp__label {
  font-size: 12px;
  color: var(--text-muted);
  max-width: 88px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rp__icon {
  width: 38px;
  height: 38px;
}
.rp__temp {
  font-size: 15px;
  font-weight: 700;
}
.rp__arrow {
  color: var(--text-faint);
  flex: 0 0 auto;
}
.brief {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
}
.brief li {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 9px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}
.brief li:last-child {
  border-bottom: none;
  font-weight: 600;
}
.brief__icon {
  font-size: 17px;
}
.note {
  margin: 10px 0 0;
  font-size: 12px;
}
.cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.cols p {
  margin: 8px 0;
  font-size: 14px;
}
.center {
  text-align: center;
  padding: 24px 0;
}
@media (max-width: 560px) {
  .cols {
    grid-template-columns: 1fr;
  }
}
</style>
