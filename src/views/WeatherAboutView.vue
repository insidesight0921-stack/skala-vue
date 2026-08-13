<script setup>
import AppCard from '../components/AppCard.vue'

const features = [
  { icon: '🔎', title: '실시간 검색', desc: 'OpenWeatherMap API로 전 세계 도시의 현재 날씨를 조회합니다.' },
  { icon: '🧭', title: '오늘의 브리핑', desc: '예보를 분석해 우산·외출·빨래·옷차림을 한 줄로 안내합니다.' },
  { icon: '🗺️', title: '날씨 지도', desc: '구름·강수·기온·바람 레이어를 지도 위에 겹쳐 보고, 아무 지점이나 클릭해 조회합니다.' },
  { icon: '🚇', title: '통근 경로', desc: '집·회사를 등록해 출근·퇴근 시간대 날씨를 비교합니다.' },
]
const stack = ['Vue 3', 'Vue Router', 'Pinia', 'Axios', 'Leaflet', 'Vite']
</script>

<template>
  <div>
    <div class="head">
      <p class="eyebrow">About</p>
      <h1 class="title">Weatherly</h1>
      <p class="muted">Vue 3 학습 내용을 실무 수준으로 재구성한 날씨 대시보드입니다.</p>
    </div>

    <div class="feat">
      <AppCard v-for="f in features" :key="f.title">
        <div class="feat__row">
          <span class="feat__icon">{{ f.icon }}</span>
          <div>
            <h3 class="feat__t">{{ f.title }}</h3>
            <p class="muted feat__d">{{ f.desc }}</p>
          </div>
        </div>
      </AppCard>
    </div>

    <AppCard title="기술 스택" eyebrow="Stack">
      <div class="chips">
        <span v-for="s in stack" :key="s" class="chip chip-cool">{{ s }}</span>
      </div>
    </AppCard>

    <RouterLink to="/dashboard" class="btn-primary home">대시보드로 이동</RouterLink>
  </div>
</template>

<style scoped>
.head {
  margin-bottom: var(--sp-3);
}
.title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 4px 0 6px;
}
.feat {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: var(--sp-2);
}
.feat__row {
  display: flex;
  gap: 12px;
}
.feat__icon {
  font-size: 22px;
}
.feat__t {
  font-size: 15px;
  font-weight: 700;
}
.feat__d {
  margin: 4px 0 0;
  font-size: 13px;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.home {
  display: inline-block;
  margin-top: var(--sp-1);
  padding: 12px 20px;
}
@media (max-width: 560px) {
  .feat {
    grid-template-columns: 1fr;
  }
}
</style>
