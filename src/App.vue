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
