<script setup>
</script>

<template>
  <div class="notfound-view">
    <div class="notfound-card">
      <p class="emoji">🌤️ ❓</p>
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p class="desc">요청하신 주소가 존재하지 않거나,<br />아직 개발되지 않았습니다.</p>
      <RouterLink to="/" class="home-btn">날씨 메인으로 이동</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.notfound-card {
  text-align: center;
  padding: 48px 24px;
  background: var(--surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}
.emoji { font-size: 44px; margin: 0; }
.notfound-card h2 { margin: 14px 0; font-weight: 700; }
.desc { color: var(--text-secondary); font-size: 14px; }
.home-btn {
  display: inline-block;
  margin-top: var(--space-2);
  padding: 13px 24px;
  background: var(--btn-bg);
  color: var(--btn-fg);
  border-radius: var(--radius-btn);
  text-decoration: none;
  font-weight: 600;
}
</style>