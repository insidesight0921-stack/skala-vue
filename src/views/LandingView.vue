<script setup>
const features = [
  { to: '/dashboard', icon: '🏠', title: '날씨 대시보드', desc: '대표 도시의 실시간 날씨와 오늘의 브리핑을 한눈에.' },
  { to: '/map', icon: '🗺️', title: '날씨 지도', desc: '구름·강수·기온·바람 레이어. 마커 두 개로 통근 경로도 설정.' },
  { to: '/commute', icon: '🚇', title: '통근 경로', desc: '집·회사 출퇴근 시간대 날씨를 비교하고 우산 여부를 확인.' },
  { to: '/about', icon: 'ℹ️', title: '서비스 소개', desc: '기능과 기술 스택을 확인하세요.' },
]
</script>

<template>
  <div class="landing">
    <section class="hero">
      <p class="eyebrow">Weatherly</p>
      <h1 class="hero__title">날씨를 넘어,<br />오늘 하루의 계획까지</h1>
      <p class="hero__sub muted">
        실시간 날씨 · 지도 오버레이 · 통근 브리핑을 한 곳에서.
      </p>
      <div class="hero__cta">
        <RouterLink to="/dashboard" class="btn-primary big">대시보드 시작하기 →</RouterLink>
        <RouterLink to="/map" class="btn big">지도 둘러보기</RouterLink>
      </div>
    </section>

    <section class="feat">
      <RouterLink v-for="f in features" :key="f.to" :to="f.to" class="feat__card">
        <span class="feat__icon">{{ f.icon }}</span>
        <h3 class="feat__title">{{ f.title }}</h3>
        <p class="feat__desc muted">{{ f.desc }}</p>
        <span class="feat__go">바로가기 →</span>
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 40px 0 32px;
}
.hero__title {
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 8px 0 16px;
}
.hero__sub {
  max-width: 520px;
  margin: 0 auto 28px;
  font-size: 15px;
}
.hero__cta {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}
.big {
  padding: 13px 24px;
  font-size: 15px;
}
.feat {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 8px;
}
.feat__card {
  display: block;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
  padding: 22px;
  transition: transform 0.14s, box-shadow 0.14s, border-color 0.14s;
}
.feat__card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow);
  border-color: var(--accent);
}
.feat__icon {
  font-size: 26px;
}
.feat__title {
  font-size: 17px;
  font-weight: 700;
  margin: 10px 0 6px;
}
.feat__desc {
  font-size: 13.5px;
  margin: 0 0 12px;
}
.feat__go {
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
}
@media (max-width: 560px) {
  .hero__title {
    font-size: 30px;
  }
  .feat {
    grid-template-columns: 1fr;
  }
}
</style>
