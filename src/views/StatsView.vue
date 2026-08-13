<script setup>
import { computed } from 'vue'
import { weatherList } from '../data/weatherData.js'
const avg = computed(() => Math.round(weatherList.reduce((s, c) => s + c.temp, 0) / weatherList.length))
const hottest = computed(() => weatherList.reduce((m, c) => (c.temp > m.temp ? c : m)))
</script>
<template>
  <div>
    <div class="card">
      <h2>📊 날씨 통계</h2>
      <p>평균 기온: <strong>{{ avg }}°C</strong></p>
      <p>최고 기온 도시: <strong>{{ hottest.name }} {{ hottest.temp }}°C</strong></p>
    </div>
    <RouterLink to="/">대시보드로 돌아가기</RouterLink>
  </div>
</template>
