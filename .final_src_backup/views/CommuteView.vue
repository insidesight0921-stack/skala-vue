<script setup>
import { ref, computed } from 'vue'
import { fetchForecast } from '../api/weatherApi.js'
import { useCommuteStore } from '../stores/commuteStore.js'

const commuteStore = useCommuteStore()

// 입력용 로컬 상태 (스토어 값으로 초기화)
const homeInput = ref(commuteStore.homeCity)
const workInput = ref(commuteStore.workCity)
const departInput = ref(commuteStore.departHour)
const returnInput = ref(commuteStore.returnHour)

const homeForecast = ref([])
const workForecast = ref([])
const isLoading = ref(false)
const errorMsg = ref('')
const loaded = ref(false)

// 조회: 두 도시 예보를 동시에 가져오고 스토어에 등록
const search = async () => {
  const home = homeInput.value.trim()
  const work = workInput.value.trim()
  if (!home || !work) return

  isLoading.value = true
  errorMsg.value = ''
  try {
    commuteStore.setRoute(home, work)
    commuteStore.setTimes(Number(departInput.value), Number(returnInput.value))

    const [h, w] = await Promise.all([fetchForecast(home), fetchForecast(work)])
    homeForecast.value = h
    workForecast.value = w
    loaded.value = true
  } catch (e) {
    errorMsg.value = '도시를 찾을 수 없습니다. (영어 이름 권장)'
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

// 예보 배열에서 오늘 날짜의, 목표 시각에 가장 가까운 시점 선택
const pickByHour = (list, targetHour) => {
  if (!list.length) return null
  const today = list[0].date
  const todayList = list.filter((f) => f.date === today)
  const pool = todayList.length ? todayList : list
  return pool.reduce((best, f) =>
    Math.abs(f.hour - targetHour) < Math.abs(best.hour - targetHour) ? f : best,
  )
}

// 한 시점을 짧은 문구로
const describe = (f) => {
  if (!f) return '정보 없음'
  const rainy = f.pop >= 0.5 || f.rain > 0
  const icon = rainy ? '☔' : '🌤️'
  const rainTxt = rainy ? ` (비 확률 ${Math.round(f.pop * 100)}%)` : ''
  return `${icon} ${f.status}, ${f.temp}°C${rainTxt}`
}

// 출근길: 출근 시각의 집(출발) → 회사(도착)
const morning = computed(() => ({
  home: describe(pickByHour(homeForecast.value, commuteStore.departHour)),
  work: describe(pickByHour(workForecast.value, commuteStore.departHour)),
}))
// 퇴근길: 퇴근 시각의 회사(출발) → 집(도착)
const evening = computed(() => ({
  work: describe(pickByHour(workForecast.value, commuteStore.returnHour)),
  home: describe(pickByHour(homeForecast.value, commuteStore.returnHour)),
}))

// 우산 필요 여부 요약 (출근/퇴근 중 비가 있으면)
const umbrellaSummary = computed(() => {
  const check = (list, hour) => {
    const f = pickByHour(list, hour)
    return f && (f.pop >= 0.5 || f.rain > 0)
  }
  const morningRain =
    check(homeForecast.value, commuteStore.departHour) ||
    check(workForecast.value, commuteStore.departHour)
  const eveningRain =
    check(workForecast.value, commuteStore.returnHour) ||
    check(homeForecast.value, commuteStore.returnHour)
  if (morningRain && eveningRain) return '☔ 하루 종일 우산이 필요해요.'
  if (morningRain) return '☔ 출근길에 우산을 챙기세요.'
  if (eveningRain) return '🌂 퇴근길에 비 예보가 있어요. 우산 챙기세요.'
  return '🌤️ 오늘 출퇴근길은 우산 없이 괜찮아요.'
})
</script>

<template>
  <div class="commute-view">
    <div class="commute-card">
      <h2>🚇 통근 경로 날씨</h2>
      <p class="hint">집과 회사를 등록하면 출근길·퇴근길 날씨를 비교해 드려요. (영어 이름 권장)</p>

      <div class="form-row">
        <label>🏠 집</label>
        <input v-model="homeInput" placeholder="예: Seoul" />
      </div>
      <div class="form-row">
        <label>🏢 회사</label>
        <input v-model="workInput" placeholder="예: Incheon" />
      </div>
      <div class="form-row">
        <label>출근 시각</label>
        <input type="number" v-model="departInput" min="0" max="23" />시
        <label>퇴근 시각</label>
        <input type="number" v-model="returnInput" min="0" max="23" />시
      </div>

      <button class="search-btn" @click="search">경로 날씨 조회</button>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </div>

    <p v-if="isLoading" class="info-msg">⏳ 조회 중...</p>

    <template v-else-if="loaded">
      <div class="summary-card">{{ umbrellaSummary }}</div>

      <div class="commute-card">
        <h3>🌅 출근길 (오전 {{ commuteStore.departHour }}시)</h3>
        <p>🏠 {{ commuteStore.homeCity }}: {{ morning.home }}</p>
        <p>🏢 {{ commuteStore.workCity }}: {{ morning.work }}</p>
      </div>

      <div class="commute-card">
        <h3>🌇 퇴근길 (오후 {{ commuteStore.returnHour - 12 }}시)</h3>
        <p>🏢 {{ commuteStore.workCity }}: {{ evening.work }}</p>
        <p>🏠 {{ commuteStore.homeCity }}: {{ evening.home }}</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.commute-card,
.summary-card {
  background: var(--surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: var(--space-3);
  margin-bottom: var(--space-2);
}
.commute-card h2 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
}
.commute-card h3 {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-heading);
}
.commute-card p {
  margin: 6px 0;
  font-size: 14px;
  color: var(--text-secondary);
}
.hint {
  color: var(--text-secondary);
  font-size: 13px;
}
.form-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0;
  font-size: 14px;
  color: var(--text-secondary);
}
.form-row label {
  min-width: 64px;
}
.form-row input[type='text'],
.form-row input:not([type]) {
  flex: 1;
}
.form-row input[type='number'] {
  width: 64px;
}
.search-btn {
  margin-top: 10px;
  padding: 11px 18px;
  background: var(--btn-bg);
  color: var(--btn-fg);
}
.summary-card {
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 600;
  text-align: center;
}
.info-msg {
  color: var(--text-secondary);
  text-align: center;
  padding: 24px;
}
.error {
  color: var(--accent);
  font-size: 14px;
  margin-top: 8px;
}
</style>
