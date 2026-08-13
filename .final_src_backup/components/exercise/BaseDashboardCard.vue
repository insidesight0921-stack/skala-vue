<script setup>
// 제목만 props로 받고, 본문은 슬롯으로 주입받음
defineProps({
  title: String,
})
</script>

<template>
  <div class="dashboard-card">
    <h3 v-if="title" class="card-title">{{ title }}</h3>
    <!-- 부모가 이 자리에 검색바 또는 날씨목록을 끼워 넣음 -->
    <slot></slot>
  </div>
</template>

<style scoped>
.dashboard-card {
  background: var(--surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: var(--space-3);
  margin: var(--space-2) 0;
}
.card-title {
  margin: 0 0 var(--space-2);
  font-size: 16px;
  font-weight: 600;
  color: var(--text-heading);
}
.stat-row {
  display: flex;
  gap: 12px;
}
.stat-item {
  flex: 1;
  text-align: center;
  padding: 14px 8px;
  background: var(--bg-muted);
  border-radius: var(--radius-chip);
}
.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0 0 6px;
}
.stat-value {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}
</style>