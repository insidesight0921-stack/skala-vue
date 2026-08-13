<script setup>
import { computed } from 'vue'
import { useTemperature } from '../composables/useTemperature.js'
import { skyGradient } from '../composables/useSky.js'
import HourlyStrip from './HourlyStrip.vue'
import AirQualityBadge from './AirQualityBadge.vue'
import FavoriteButton from './FavoriteButton.vue'

const props = defineProps({
  city: { type: Object, required: true }, // 날씨 객체
  hours: { type: Array, default: () => [] },
})

const { format } = useTemperature()
const sky = computed(() => skyGradient(props.city.icon))
const iconUrl = computed(() =>
  props.city.icon ? `https://openweathermap.org/img/wn/${props.city.icon}@2x.png` : '',
)
</script>

<template>
  <section class="hero" :style="{ background: sky.gradient }">
    <div class="hero__top">
      <div class="hero__head">
        <div class="hero__place-row">
          <p class="hero__place">{{ city.name }}</p>
          <FavoriteButton v-if="city.id" :city="{ id: city.id, name: city.name, q: city.q || city.name }" class="hero__fav" />
        </div>
        <p class="hero__status">{{ city.status }}</p>
      </div>
      <img v-if="iconUrl" class="hero__icon" :src="iconUrl" :alt="city.status" />
    </div>

    <p class="hero__temp">{{ format(city.temp) }}</p>
    <p class="hero__feels">체감 {{ format(city.feelsLike) }} · 습도 {{ city.humidity }}% · 풍속 {{ city.wind }}m/s</p>

    <div class="hero__aqi">
      <AirQualityBadge :lat="city.lat" :lon="city.lon" />
    </div>

    <div v-if="hours.length" class="hero__strip">
      <HourlyStrip :hours="hours" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  border-radius: var(--r-xl);
  box-shadow: var(--hero-shadow);
  padding: 26px 26px 18px;
  margin-bottom: var(--sp-2);
  color: #fff;
  overflow: hidden;
}
.hero__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.hero__place {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.hero__status {
  margin: 2px 0 0;
  font-size: 14px;
  opacity: 0.9;
}
.hero__icon {
  width: 88px;
  height: 88px;
  margin: -14px -10px 0 0;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.25));
}
.hero__temp {
  margin: 2px 0 0;
  font-size: 72px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
}
.hero__feels {
  margin: 8px 0 0;
  font-size: 13.5px;
  opacity: 0.9;
}
.hero__head {
  min-width: 0;
}
.hero__place-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.hero__fav {
  color: rgba(255, 255, 255, 0.9) !important;
}
.hero__aqi {
  margin-top: 12px;
}
.hero__strip {
  margin-top: 18px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
}
/* 시간대 스트립 아이템 hover */
.hero__strip :deep(.strip__item:hover) {
  background: rgba(255, 255, 255, 0.14);
}

@media (max-width: 560px) {
  .hero__temp {
    font-size: 60px;
  }
  .hero__icon {
    width: 72px;
    height: 72px;
  }
}
</style>
