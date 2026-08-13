<script setup>
import AppCard from '../components/AppCard.vue'
</script>

<template>
  <AppCard>
    <div class="nf">
      <p class="nf__emoji">🌧️</p>
      <h1 class="nf__title">페이지를 찾을 수 없습니다</h1>
      <p class="muted">요청하신 주소가 존재하지 않거나 아직 준비되지 않았습니다.</p>
      <RouterLink to="/" class="btn-primary nf__btn">메인으로 이동</RouterLink>
    </div>
  </AppCard>
</template>

<style scoped>
.nf {
  text-align: center;
  padding: 40px 16px;
}
.nf__emoji {
  font-size: 44px;
  margin: 0;
}
.nf__title {
  font-size: 22px;
  font-weight: 800;
  margin: 12px 0 6px;
}
.nf__btn {
  display: inline-block;
  margin-top: 18px;
  padding: 12px 22px;
}
</style>
