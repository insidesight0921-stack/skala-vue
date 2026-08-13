<script setup>
import { useConfigStore } from '../../stores/configStore.js'

// 중앙 저장소 가져오기
const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler" :class="{ dark: configStore.isDark }">
    <span class="unit-label">
      날씨단위:
      {{ configStore.unit === 'celsius' ? '섭씨' : '화씨' }}({{ configStore.unitSymbol }})
    </span>
    <button @click="configStore.toggleUnit">단위변경</button>
    <button @click="configStore.toggleTheme">
      {{ configStore.isDark ? '☀️ 라이트' : '🌙 다크' }}
    </button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
.unit-label {
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
}
.unit-toggler.dark .unit-label {
  color: var(--dk-text-sec);
}
button {
  padding: 7px 12px;
  background: var(--bg-muted);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
}
button:hover {
  background: var(--accent-soft);
  color: var(--accent);
}
.unit-toggler.dark button {
  background: var(--dk-border);
  color: var(--dk-text);
}
</style>