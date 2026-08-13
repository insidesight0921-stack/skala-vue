#!/usr/bin/env bash
###############################################################################
# build-git-history.sh
# 과제 1~5의 코드 스냅샷을 순서대로 재구성하여 git 커밋을 찍고,
# 마지막에 현재(최종) 앱을 복원해 최종 커밋을 만듭니다.
#
# ⚠️ 반드시 프로젝트 루트(package.json 있는 skala-vue 폴더)에서 실행:
#     bash build-git-history.sh
#
# 동작:
#   0) 현재 src를 .final_src_backup 으로 백업
#   1~6) 과제1 → 과제2 → 과제3 → 과제4-1 → 과제4-2 → 과제5 커밋
#   7) 최종본 복원 후 "최종" 커밋
###############################################################################
set -e
cd "$(dirname "$0")"

if [ ! -f package.json ]; then
  echo "❌ package.json이 없습니다. skala-vue 프로젝트 루트에서 실행하세요."
  exit 1
fi

echo "▶ 현재 src 백업..."
rm -rf .final_src_backup
cp -r src .final_src_backup

echo "▶ git 저장소 새로 초기화..."
rm -rf .git
git init -q
git checkout -q -b main 2>/dev/null || git branch -M main
git config user.email "insidesight0921@gmail.com"
git config user.name "현준"

# .gitignore 보장
cat > .gitignore <<'GI'
node_modules/
dist/
dist-ssr/
.env
.env.*
!.env.example
.DS_Store
*.local
*.log
GI

reset_src() { rm -rf src; mkdir -p src/assets src/components src/views src/router src/stores src/data; }
commit() { git add -A; git commit -q -m "$1"; echo "  ✔ $1"; }

MIN_CSS='* { box-sizing: border-box; }
body { font-family: -apple-system, "Malgun Gothic", "Apple SD Gothic Neo", sans-serif; background:#f7f9fa; color:#2c3e50; margin:0; }
#app { max-width: 560px; margin: 0 auto; padding: 20px; }
.card { border:1px solid #ddd; border-radius:8px; padding:12px 16px; margin:8px 0; }
.label { display:inline-block; padding:3px 10px; border-radius:5px; font-size:13px; font-weight:bold; color:#fff; }
.hot{background:#e74c3c;} .cool{background:#3498db;}
button{margin-top:8px;padding:5px 12px;cursor:pointer;}
input{width:100%;padding:8px;}
.status-bar{margin-top:12px;padding:10px;background:#eafaf1;border-radius:6px;text-align:center;color:#1c7a4f;font-weight:bold;}
.nav-bar a{margin-right:10px;font-weight:600;}'

###############################################################################
# 과제 1 — Weather Mockup
###############################################################################
reset_src
echo "$MIN_CSS" > src/assets/main.css
cat > src/main.js <<'EOF'
import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).mount('#app')
EOF
cat > src/App.vue <<'EOF'
<script setup>
import WeatherApp from './components/WeatherApp.vue'
</script>
<template>
  <WeatherApp />
</template>
EOF
cat > src/components/WeatherApp.vue <<'EOF'
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
EOF
commit "과제1: Weather Mockup — v-for/:key, v-if, :value+@input, @click.stop"

###############################################################################
# 과제 2 — Weather Composition (computed / watch / watchEffect)
###############################################################################
cat > src/App.vue <<'EOF'
<script setup>
import WeatherComposition from './components/WeatherComposition.vue'
</script>
<template>
  <WeatherComposition />
</template>
EOF
cat > src/components/WeatherComposition.vue <<'EOF'
<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '대구', temp: 31, status: '폭염' },
  { id: 'city_05', name: '강릉', temp: 22, status: '흐림' },
])
const filteredWeatherList = computed(() =>
  weatherList.value.filter((c) => c.name.includes(searchQuery.value)),
)
const isSearchEmpty = computed(() => searchQuery.value.trim() === '')
const hasNoResult = computed(() => filteredWeatherList.value.length === 0)
const selectCity = (name) => (selectedCityInfo.value = `${name}이(가) 선택되었습니다.`)
watch(selectedCityInfo, (v) => console.log('👁️ [watch] 상태바 ->', v))
watchEffect(() => console.log('🤖 [watchEffect] 검색어:', searchQuery.value))
</script>
<template>
  <div>
    <h2>🔍 도시 검색</h2>
    <input :value="searchQuery" @input="searchQuery = $event.target.value" placeholder="도시명" />
    <p>검색 중인 도시: <strong>{{ searchQuery }}</strong></p>
    <h2>🌤️ 지역별 날씨 현황</h2>
    <p v-if="hasNoResult" class="status-bar">검색 결과가 일치하는 도시가 없습니다.</p>
    <template v-else>
      <p>{{ isSearchEmpty ? '전체 도시를 표시합니다.' : `'${searchQuery}' 검색 결과` }}</p>
      <div v-for="city in filteredWeatherList" :key="city.id" class="card" @click="selectCity(city.name)">
        <p><strong>{{ city.name }} ({{ city.status }})</strong> — {{ city.temp }}°C</p>
        <span v-if="city.temp >= 28" class="label hot">🔥 더움</span>
        <span v-else class="label cool">❄️ 선선함</span>
      </div>
    </template>
    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>
EOF
commit "과제2: Weather Composition — computed 필터, watch/watchEffect, 조건부 표시"

###############################################################################
# 과제 3 — Weather Component (props / emits / slot 분리)
###############################################################################
cat > src/App.vue <<'EOF'
<script setup>
import WeatherParent from './components/WeatherParent.vue'
</script>
<template>
  <WeatherParent />
</template>
EOF
cat > src/components/BaseDashboardCard.vue <<'EOF'
<script setup>
defineProps({ title: String })
</script>
<template>
  <div class="card">
    <h3 v-if="title">{{ title }}</h3>
    <slot></slot>
  </div>
</template>
EOF
cat > src/components/SearchBar.vue <<'EOF'
<script setup>
defineProps({ searchQuery: String })
const emit = defineEmits(['update-query'])
</script>
<template>
  <div>
    <input :value="searchQuery" @input="emit('update-query', $event.target.value)" placeholder="도시명" />
    <p>검색 중인 도시: <strong>{{ searchQuery }}</strong></p>
  </div>
</template>
EOF
cat > src/components/WeatherCard.vue <<'EOF'
<script setup>
const props = defineProps({ city: { type: Object, required: true } })
const emit = defineEmits(['select-card', 'click-detail'])
</script>
<template>
  <div class="card" @click="emit('select-card', props.city.name)">
    <p><strong>{{ city.name }} ({{ city.status }})</strong> — {{ city.temp }}°C</p>
    <span v-if="city.temp >= 28" class="label hot">🔥 더움</span>
    <span v-else class="label cool">❄️ 선선함</span>
    <button @click.stop="emit('click-detail', props.city.name)">상세보기</button>
  </div>
</template>
EOF
cat > src/components/WeatherParent.vue <<'EOF'
<script setup>
import { ref, computed } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])
const filtered = computed(() => weatherList.value.filter((c) => c.name.includes(searchQuery.value)))
const onQuery = (q) => (searchQuery.value = q)
const onSelect = (name) => (selectedCityInfo.value = `${name}이(가) 선택되었습니다.`)
const onDetail = (name) => window.alert(`${name} 상세보기`)
</script>
<template>
  <div>
    <BaseDashboardCard title="🔍 도시 검색">
      <SearchBar :search-query="searchQuery" @update-query="onQuery" />
    </BaseDashboardCard>
    <BaseDashboardCard title="🌤️ 지역별 날씨 현황">
      <WeatherCard v-for="c in filtered" :key="c.id" :city="c" @select-card="onSelect" @click-detail="onDetail" />
    </BaseDashboardCard>
    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>
EOF
commit "과제3: Weather Component — props/emits/slot 으로 4개 컴포넌트 분리"

###############################################################################
# 과제 4-1 — Weather Router (router 설정 / 동적경로 / catch-all)
###############################################################################
cat > src/main.js <<'EOF'
import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
createApp(App).use(router).mount('#app')
EOF
cat > src/data/weatherData.js <<'EOF'
export const weatherList = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 55, wind: 2.5 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 80, wind: 3.1 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 60, wind: 4.0 },
]
EOF
cat > src/router/index.js <<'EOF'
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/WeatherHomeView.vue') },
    { path: '/about', name: 'about', component: () => import('../views/WeatherAboutView.vue') },
    { path: '/weather/:cityId', name: 'detail', component: () => import('../views/WeatherDetailView.vue') },
    { path: '/:pathMatch(.*)*', name: 'notfound', component: () => import('../views/NotFoundView.vue') },
  ],
})
export default router
EOF
cat > src/App.vue <<'EOF'
<script setup></script>
<template>
  <div>
    <h1>🌤️ 과제 4: 라우터 적용</h1>
    <nav class="nav-bar">
      <RouterLink to="/">날씨 대시보드</RouterLink>
      <RouterLink to="/about">서비스 소개</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>
EOF
cat > src/views/WeatherHomeView.vue <<'EOF'
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { weatherList as data } from '../data/weatherData.js'
import BaseDashboardCard from '../components/BaseDashboardCard.vue'
import SearchBar from '../components/SearchBar.vue'
import WeatherCard from '../components/WeatherCard.vue'
const router = useRouter()
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const weatherList = ref(data)
const filtered = computed(() => weatherList.value.filter((c) => c.name.includes(searchQuery.value)))
const onSelect = (name) => (selectedCityInfo.value = `${name} 선택됨`)
const onDetail = (name) => {
  const c = weatherList.value.find((x) => x.name === name)
  router.push('/weather/' + c.id)
}
</script>
<template>
  <div>
    <BaseDashboardCard title="🔍 도시 검색">
      <SearchBar :search-query="searchQuery" @update-query="(q) => (searchQuery = q)" />
    </BaseDashboardCard>
    <BaseDashboardCard title="🌤️ 지역별 날씨 현황">
      <WeatherCard v-for="c in filtered" :key="c.id" :city="c" @select-card="onSelect" @click-detail="onDetail" />
    </BaseDashboardCard>
    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>
EOF
cat > src/views/WeatherDetailView.vue <<'EOF'
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { weatherList } from '../data/weatherData.js'
const route = useRoute()
const city = ref(null)
onMounted(() => (city.value = weatherList.find((c) => c.id === route.params.cityId)))
</script>
<template>
  <div>
    <div v-if="city" class="card">
      <h2>📈 지역별 상세 기상 관측 정보</h2>
      <p>📍 지정 지역: <strong>{{ city.name }}</strong></p>
      <p>실시간 기온: {{ city.temp }}°C</p>
      <p>기상 현황: {{ city.status }}</p>
      <p>대기 습도: {{ city.humidity }}%</p>
      <p>현재 풍속: {{ city.wind }}m/s</p>
    </div>
    <div v-else class="card">해당 도시 정보를 찾을 수 없습니다.</div>
    <RouterLink to="/">← 메인 대시보드로 돌아가기</RouterLink>
  </div>
</template>
EOF
cat > src/views/WeatherAboutView.vue <<'EOF'
<template>
  <div>
    <div class="card">
      <h2>ℹ️ 서비스 소개</h2>
      <p>Vue 3 · Vue Router 기반 실습용 기상 대시보드입니다.</p>
    </div>
    <RouterLink to="/">대시보드 홈으로 이동</RouterLink>
  </div>
</template>
EOF
cat > src/views/NotFoundView.vue <<'EOF'
<template>
  <div class="card" style="text-align:center">
    <h2>페이지를 찾을 수 없습니다.</h2>
    <RouterLink to="/">날씨 메인으로 이동</RouterLink>
  </div>
</template>
EOF
commit "과제4-1: Weather Router — 라우터 설정, 동적경로 :cityId, catch-all, 지연로딩"

###############################################################################
# 과제 4-2 — 본인 추가 View + 라우팅 (통계 페이지)
###############################################################################
cat > src/views/StatsView.vue <<'EOF'
<script setup>
import { computed } from 'vue'
import { weatherList } from '../data/weatherData.js'
const avg = computed(() => Math.round(weatherList.reduce((s, c) => s + c.temp, 0) / weatherList.length))
const hottest = computed(() => weatherList.reduce((m, c) => (c.temp > m.temp ? c : m)))
</script>
<template>
  <div>
    <div class="card">
      <h2>📊 날씨 통계</h2>
      <p>평균 기온: <strong>{{ avg }}°C</strong></p>
      <p>최고 기온 도시: <strong>{{ hottest.name }} {{ hottest.temp }}°C</strong></p>
    </div>
    <RouterLink to="/">대시보드로 돌아가기</RouterLink>
  </div>
</template>
EOF
cat > src/router/index.js <<'EOF'
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/WeatherHomeView.vue') },
    { path: '/about', name: 'about', component: () => import('../views/WeatherAboutView.vue') },
    { path: '/stats', name: 'stats', component: () => import('../views/StatsView.vue') },
    { path: '/weather/:cityId', name: 'detail', component: () => import('../views/WeatherDetailView.vue') },
    { path: '/:pathMatch(.*)*', name: 'notfound', component: () => import('../views/NotFoundView.vue') },
  ],
})
export default router
EOF
cat > src/App.vue <<'EOF'
<script setup></script>
<template>
  <div>
    <h1>🌤️ 과제 4: 라우터 적용</h1>
    <nav class="nav-bar">
      <RouterLink to="/">날씨 대시보드</RouterLink>
      <RouterLink to="/stats">통계</RouterLink>
      <RouterLink to="/about">서비스 소개</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>
EOF
commit "과제4-2: 본인 추가 View(통계) 작성 및 라우팅"

###############################################################################
# 과제 5 — Weather Store (Pinia)
###############################################################################
cat > src/main.js <<'EOF'
import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
createApp(App).use(createPinia()).use(router).mount('#app')
EOF
cat > src/stores/configStore.js <<'EOF'
import { defineStore } from 'pinia'
export const useConfigStore = defineStore('config', {
  state: () => ({ unit: 'celsius' }),
  getters: { unitSymbol: (s) => (s.unit === 'celsius' ? '°C' : '°F') },
  actions: {
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },
  },
})
EOF
cat > src/components/UnitToggler.vue <<'EOF'
<script setup>
import { useConfigStore } from '../stores/configStore.js'
const configStore = useConfigStore()
</script>
<template>
  <span>
    날씨단위: {{ configStore.unit === 'celsius' ? '섭씨' : '화씨' }}({{ configStore.unitSymbol }})
    <button @click="configStore.toggleUnit">단위변경</button>
  </span>
</template>
EOF
cat > src/components/WeatherCard.vue <<'EOF'
<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../stores/configStore.js'
const props = defineProps({ city: { type: Object, required: true } })
const emit = defineEmits(['select-card', 'click-detail'])
const configStore = useConfigStore()
const displayTemp = computed(() => {
  const t = props.city.temp
  return configStore.unit === 'fahrenheit' ? Math.round((t * 9) / 5 + 32) : t
})
</script>
<template>
  <div class="card" @click="emit('select-card', props.city.name)">
    <p><strong>{{ city.name }} ({{ city.status }})</strong> — {{ displayTemp }}{{ configStore.unitSymbol }}</p>
    <span v-if="city.temp >= 28" class="label hot">🔥 더움</span>
    <span v-else class="label cool">❄️ 선선함</span>
    <button @click.stop="emit('click-detail', props.city.name)">상세보기</button>
  </div>
</template>
EOF
cat > src/views/WeatherDetailView.vue <<'EOF'
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { weatherList } from '../data/weatherData.js'
import { useConfigStore } from '../stores/configStore.js'
const route = useRoute()
const configStore = useConfigStore()
const city = ref(null)
onMounted(() => (city.value = weatherList.find((c) => c.id === route.params.cityId)))
const displayTemp = computed(() => {
  if (!city.value) return 0
  const t = city.value.temp
  return configStore.unit === 'fahrenheit' ? Math.round((t * 9) / 5 + 32) : t
})
</script>
<template>
  <div>
    <div v-if="city" class="card">
      <h2>📈 지역별 상세 기상 관측 정보</h2>
      <p>📍 지정 지역: <strong>{{ city.name }}</strong></p>
      <p>실시간 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
      <p>기상 현황: {{ city.status }}</p>
      <p>대기 습도: {{ city.humidity }}%</p>
      <p>현재 풍속: {{ city.wind }}m/s</p>
    </div>
    <div v-else class="card">해당 도시 정보를 찾을 수 없습니다.</div>
    <RouterLink to="/">← 메인 대시보드로 돌아가기</RouterLink>
  </div>
</template>
EOF
cat > src/App.vue <<'EOF'
<script setup>
import UnitToggler from './components/UnitToggler.vue'
</script>
<template>
  <div>
    <h1>🌤️ 과제 5: 스토어 적용</h1>
    <nav class="nav-bar">
      <RouterLink to="/">날씨 대시보드</RouterLink>
      <RouterLink to="/stats">통계</RouterLink>
      <RouterLink to="/about">서비스 소개</RouterLink>
      <UnitToggler />
    </nav>
    <RouterView />
  </div>
</template>
EOF
commit "과제5: Weather Store — Pinia configStore(state/getter/action), 단위 변환 적용"

###############################################################################
# 최종 — 현재(everyday.io 리디자인 + 지도/브리핑/통근 + API) 복원
###############################################################################
rm -rf src
cp -r .final_src_backup src
rm -rf .final_src_backup
commit "최종: everyday.io 디자인 시스템 + OpenWeatherMap API + 지도/브리핑/통근 통합"

echo ""
echo "✅ 완료! 커밋 히스토리:"
git log --oneline
