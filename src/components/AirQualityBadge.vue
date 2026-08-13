<script setup>
import { ref, watch } from 'vue'
import { getAirQuality } from '../api/weatherApi.js'

const props = defineProps({
  lat: { type: Number, default: null },
  lon: { type: Number, default: null },
})

const air = ref(null)
const loading = ref(false)

async function load() {
  if (props.lat == null || props.lon == null) return
  loading.value = true
  try {
    air.value = await getAirQuality(props.lat, props.lon)
  } catch {
    air.value = null
  } finally {
    loading.value = false
  }
}

watch(() => [props.lat, props.lon], load, { immediate: true })
</script>

<template>
  <div v-if="air" class="aqi">
    <span class="aqi__dot" :style="{ background: air.color }"></span>
    <span class="aqi__label">대기질 {{ air.label }}</span>
    <span class="aqi__pm">초미세 {{ air.pm25 }} · 미세 {{ air.pm10 }} ㎍/㎥</span>
  </div>
</template>

<style scoped>
.aqi {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  font-size: 12.5px;
  color: #fff;
  backdrop-filter: blur(4px);
}
.aqi__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25);
}
.aqi__label {
  font-weight: 700;
}
.aqi__pm {
  opacity: 0.85;
}
</style>
