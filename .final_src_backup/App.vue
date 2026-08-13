<script setup>
import { useConfigStore } from './stores/configStore.js'
import UnitToggler from './components/exercise/UnitToggler.vue'

const configStore = useConfigStore()
</script>

<template>
  <div class="app-container" :class="{ dark: configStore.isDark }">
    <header class="app-header">
      <h1>Weather<span class="caret">^</span></h1>
      <UnitToggler class="unit-slot" />
    </header>

    <!-- 내비게이션 바: RouterLink로 페이지 이동 -->
    <nav class="nav-bar">
      <RouterLink to="/">🌤️ 대시보드</RouterLink>
      <RouterLink to="/map">🗺️ 지도</RouterLink>
      <RouterLink to="/commute">🚇 통근</RouterLink>
      <RouterLink to="/about">ℹ️ 소개</RouterLink>
    </nav>

    <!-- 주소에 맞는 뷰가 이 자리에 그려짐 -->
    <RouterView />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
}
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-bottom: var(--space-3);
}
.app-header h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-heading);
}
.app-header h1 .caret {
  color: var(--warm);
  margin-left: 1px;
  font-weight: 700;
}
.nav-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  margin-bottom: var(--space-3);
  background: var(--surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  overflow-x: auto;
}
.nav-bar a {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 14px;
  padding: 8px 14px;
  border-radius: var(--radius-btn);
  white-space: nowrap;
  transition: background-color 0.15s, color 0.15s;
}
.nav-bar a:hover {
  background: var(--bg-muted);
}
/* 현재 활성화된 링크: 잉크 채움 pill */
.nav-bar a.router-link-active {
  color: var(--btn-fg);
  background: var(--btn-bg);
}
.nav-bar a.router-link-active:hover {
  background: var(--btn-bg);
}
.unit-slot {
  flex-shrink: 0;
}

/* ===== 다크모드 =====
   토큰 변수를 통째로 재정의 → 모든 자식 컴포넌트가 자동 반영 */
.app-container.dark {
  --bg-panel: #17181a;
  --bg-canvas: #1e1f1c;
  --bg-muted: #2b2c27;
  --surface: #232420;
  --text-primary: #ecebe4;
  --text-heading: #f6f4ee;
  --text-secondary: #a6a192;
  --text-placeholder: #6e6a60;
  --border: #35362f;

  --accent: #ecebe4; /* 다크에선 밝은 잉크가 강조색 */
  --accent-soft: #2f302a;
  --btn-bg: #ecebe4; /* 밝은 버튼 */
  --btn-fg: #1b1c19; /* 어두운 글자 */
  --warm: #e0895a; /* 다크용으로 밝힌 클레이 */
  --warm-soft: #3a2b22;
  --cool: #93b6c2;
  --cool-soft: #24312f;

  --shadow-card: 0 0 0 1px var(--border), 0 2px 8px rgba(0, 0, 0, 0.28);

  background-color: var(--bg-panel);
  color: var(--text-primary);
}
</style>