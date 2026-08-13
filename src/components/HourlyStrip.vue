<script setup>
import { useTemperature } from '../composables/useTemperature.js'

defineProps({
  hours: { type: Array, default: () => [] }, // [{ hour, temp, icon }]
})
const { convert, symbol } = useTemperature()

const label = (h) => (h === 0 ? '자정' : h === 12 ? '정오' : h < 12 ? `${h}시` : `${h - 12}시`)
const iconUrl = (i) => `https://openweathermap.org/img/wn/${i}.png`
</script>

<template>
  <div class="strip">
    <div v-for="(h, i) in hours" :key="i" class="strip__item">
      <span class="strip__time">{{ i === 0 ? '지금' : label(h.hour) }}</span>
      <img class="strip__icon" :src="iconUrl(h.icon)" alt="" />
      <span class="strip__temp">{{ convert(h.temp) }}{{ symbol }}</span>
    </div>
  </div>
</template>

<style scoped>
.strip {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 4px 2px 2px;
  scrollbar-width: none;
}
.strip::-webkit-scrollbar {
  display: none;
}
.strip__item {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 52px;
  padding: 8px 4px;
  border-radius: var(--r-md);
}
.strip__time {
  font-size: 12px;
  opacity: 0.85;
}
.strip__icon {
  width: 34px;
  height: 34px;
}
.strip__temp {
  font-size: 14px;
  font-weight: 700;
}
</style>
