<script setup>
import { useTemperature } from '../composables/useTemperature.js'
import FavoriteButton from './FavoriteButton.vue'

defineProps({
  city: { type: Object, required: true },
  hero: { type: Boolean, default: false },
})
const emit = defineEmits(['select', 'detail'])

const { format } = useTemperature()

const iconUrl = (icon) =>
  icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : ''
</script>

<template>
  <article class="wcard" :class="{ 'wcard--hero': hero }" @click="emit('select', city)">
    <div class="wcard__top">
      <div class="wcard__meta">
        <div class="wcard__name-row">
          <h4 class="wcard__name">{{ city.name }}</h4>
          <FavoriteButton :city="{ id: city.id, name: city.name, q: city.q || city.name }" />
        </div>
        <p class="wcard__status">{{ city.status }}</p>
      </div>
      <img v-if="city.icon" class="wcard__icon" :src="iconUrl(city.icon)" :alt="city.status" />
    </div>

    <p class="wcard__temp">{{ format(city.temp) }}</p>

    <div class="wcard__foot">
      <span class="chip" :class="city.temp >= 28 ? 'chip-warm' : 'chip-cool'">
        {{ city.temp >= 28 ? '🔥 더움' : '❄️ 선선함' }}
      </span>
      <button class="wcard__detail" @click.stop="emit('detail', city)">상세 →</button>
    </div>
  </article>
</template>

<style scoped>
.wcard {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
  padding: 18px;
  cursor: pointer;
  height: 100%;
  transition: transform 0.14s, box-shadow 0.14s, border-color 0.14s;
}
.wcard:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
  border-color: var(--accent);
}
.wcard__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.wcard__name-row {
  display: flex;
  align-items: center;
  gap: 4px;
}
.wcard__name {
  font-size: 16px;
  font-weight: 700;
}
.wcard--hero .wcard__name {
  font-size: 20px;
}
.wcard__status {
  margin: 2px 0 0;
  font-size: 13px;
  color: var(--text-muted);
}
.wcard__icon {
  width: 52px;
  height: 52px;
  margin: -8px -8px 0 0;
}
.wcard--hero .wcard__icon {
  width: 76px;
  height: 76px;
}
.wcard__temp {
  margin: 6px 0 0;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
}
.wcard--hero .wcard__temp {
  font-size: 56px;
}
.wcard__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
}
.wcard__detail {
  background: transparent;
  color: var(--text-muted);
  padding: 6px 10px;
  font-size: 13px;
}
.wcard__detail:hover {
  color: var(--accent);
}
</style>
