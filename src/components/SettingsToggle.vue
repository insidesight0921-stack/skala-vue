<script setup>
import { useConfigStore } from '../stores/configStore.js'
const config = useConfigStore()
</script>

<template>
  <div class="settings">
    <button class="settings__btn" @click="config.toggleUnit" :title="'단위 전환'">
      {{ config.unit === 'celsius' ? '°C' : '°F' }}
    </button>
    <button class="settings__btn" @click="config.toggleTheme" :title="'테마 전환'">
      {{ config.isDark ? '☀️' : '🌙' }}
    </button>
  </div>
</template>

<style scoped>
.settings {
  display: flex;
  gap: 6px;
}
.settings__btn {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 14px;
  font-weight: 700;
}
.settings__btn:hover {
  background: var(--accent-weak);
  border-color: var(--accent);
}
</style>
