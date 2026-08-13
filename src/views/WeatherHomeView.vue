<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getWeatherByCity, getForecast } from '../api/weatherApi.js'
import { defaultCities, cityAliases, resolveCityQuery } from '../data/weatherData.js'
import { useFavoritesStore } from '../stores/favoritesStore.js'
import AppCard from '../components/AppCard.vue'
import SearchBar from '../components/SearchBar.vue'
import WeatherCard from '../components/WeatherCard.vue'
import WeatherAdvice from '../components/WeatherAdvice.vue'
import HeroWeather from '../components/HeroWeather.vue'
import HourlyChart from '../components/HourlyChart.vue'

const router = useRouter()
const favs = useFavoritesStore()

// 즐겨찾기 도시 날씨 (id → weather)
const favWeatherMap = ref({})
async function loadFavorites() {
  for (const c of favs.cities) {
    if (favWeatherMap.value[c.id]) continue
    try {
      const w = await getWeatherByCity(c.q)
      w.q = c.q
      w.name = c.name
      favWeatherMap.value[w.id] = w
    } catch {
      /* 개별 실패는 무시 */
    }
  }
}
const favList = computed(() => favs.cities.map((c) => favWeatherMap.value[c.id]).filter(Boolean))

const query = ref('')
const cities = ref([]) // 각 항목에 .q(조회어) 부착
const heroHours = ref([])
const loading = ref(true)
const error = ref('')
const filterMode = ref('all')

const hero = computed(() => cities.value[0] || null)
const heroQuery = computed(() => hero.value?.q || hero.value?.name || defaultCities[0].q)
const heroCity = computed(() => hero.value?.name || defaultCities[0].ko)

const gridList = computed(() => {
  let list = cities.value.slice(1)
  if (filterMode.value === 'hot') list = list.filter((c) => c.temp >= 28)
  if (filterMode.value === 'cool') list = list.filter((c) => c.temp < 28)
  return list
})

async function loadHours(q) {
  if (!q) return
  try {
    heroHours.value = (await getForecast(q)).slice(0, 8)
  } catch {
    heroHours.value = []
  }
}

onMounted(async () => {
  try {
    const results = await Promise.all(defaultCities.map((c) => getWeatherByCity(c.q)))
    results.forEach((r, i) => {
      r.name = defaultCities[i].ko // 한글 표시명
      r.q = defaultCities[i].q // 조회어 보존
    })
    cities.value = results
    await loadHours(heroQuery.value)
    await loadFavorites()
  } catch (e) {
    error.value = !import.meta.env.VITE_WEATHER_API_KEY
      ? 'API 키가 앱에 주입되지 않았습니다. Vercel 환경변수 VITE_WEATHER_API_KEY 를 Production에 추가한 뒤 재배포하세요.'
      : '날씨 정보를 불러오지 못했습니다. (API 키 값/활성화·네트워크 확인)'
    console.error(e)
  } finally {
    loading.value = false
  }
})

// 히어로 도시가 바뀌면(검색 등) 시간대 예보 갱신
watch(() => hero.value?.id, () => hero.value && loadHours(heroQuery.value))

// 즐겨찾기 추가 시 해당 도시 날씨 로드
watch(() => favs.cities.length, loadFavorites)

async function onSearch(text) {
  const t = (text || '').trim()
  if (!t) return
  const q = resolveCityQuery(t)
  loading.value = true
  error.value = ''
  try {
    const result = await getWeatherByCity(q)
    result.q = q
    if (cityAliases[t]) result.name = t // 한글로 입력한 도시는 한글로 표시
    const idx = cities.value.findIndex((c) => c.id === result.id)
    if (idx >= 0) cities.value.splice(idx, 1)
    cities.value.unshift(result)
  } catch (e) {
    ElMessage.error(`'${t}' 도시를 찾을 수 없습니다. 다른 표기로 시도해 보세요.`)
    console.error(e)
  } finally {
    loading.value = false
  }
}

const goDetail = (city) => router.push('/weather/' + city.id)
</script>

<template>
  <div>
    <div class="head">
      <p class="eyebrow">Weather Dashboard</p>
      <h1 class="head__title">오늘의 날씨를 한눈에</h1>
    </div>

    <el-skeleton v-if="loading && !hero" :rows="5" animated class="hero-skel" />
    <el-alert v-else-if="error && !hero" :title="error" type="error" :closable="false" show-icon />

    <HeroWeather v-if="hero" :city="hero" :hours="heroHours" @click="goDetail(hero)" />

    <AppCard v-if="heroHours.length" title="시간별 기온" :eyebrow="heroCity">
      <HourlyChart :hours="heroHours" />
    </AppCard>

    <AppCard>
      <SearchBar v-model="query" @search="onSearch" placeholder="도시명을 입력하세요 (예: 서울, 도쿄, 파리)" />
    </AppCard>

    <AppCard v-if="favList.length" title="즐겨찾기" eyebrow="Favorites">
      <div class="grid">
        <WeatherCard v-for="c in favList" :key="'fav-' + c.id" :city="c" @select="goDetail" @detail="goDetail" />
      </div>
    </AppCard>

    <AppCard title="한국 주요 도시" eyebrow="Korea">
      <template #action>
        <div class="filters">
          <button
            v-for="f in [{ k: 'all', l: '전체' }, { k: 'hot', l: '더움' }, { k: 'cool', l: '선선함' }]"
            :key="f.k"
            class="filters__btn"
            :class="{ on: filterMode === f.k }"
            @click="filterMode = f.k"
          >
            {{ f.l }}
          </button>
        </div>
      </template>

      <div v-if="gridList.length" class="grid">
        <WeatherCard v-for="c in gridList" :key="c.id" :city="c" @select="goDetail" @detail="goDetail" />
      </div>
      <el-empty v-else description="해당 조건의 도시가 없습니다." :image-size="72" />
    </AppCard>

    <AppCard title="오늘의 브리핑" :eyebrow="heroCity">
      <WeatherAdvice :city="heroQuery" />
    </AppCard>
  </div>
</template>

<style scoped>
.head {
  margin-bottom: var(--sp-3);
}
.head__title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-top: 4px;
}
.filters {
  display: flex;
  gap: 4px;
}
.filters__btn {
  padding: 6px 12px;
  font-size: 13px;
  background: var(--surface-2);
  color: var(--text-muted);
  border: 1px solid var(--border);
}
.filters__btn.on {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.center {
  text-align: center;
  padding: 20px 0;
}
.hero-skel {
  padding: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
  margin-bottom: var(--sp-2);
}
@media (max-width: 560px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
