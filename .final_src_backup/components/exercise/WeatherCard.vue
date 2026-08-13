<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore.js'

const props = defineProps({
  city: { type: Object, required: true },
})
const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()

// 단위에 따라 변환된 온도
const displayTemp = computed(() => {
  const rawTemp = props.city.temp          // 원본은 섭씨
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)  // 화씨 변환
  }
  return rawTemp                            // 섭씨는 그대로
})

const onSelect = () => emit('select-card', props.city.name)
const onDetail = () => emit('click-detail', props.city.name)
</script>

<template>
  <div class="card" @click="onSelect">
    <div class="card-head">
      <div>
        <p class="city-name">{{ city.name }}</p>
        <p class="status">{{ city.status }}</p>
      </div>
      <p class="temp">{{ displayTemp }}<span class="unit">{{ configStore.unitSymbol }}</span></p>
    </div>

    <div class="card-foot">
      <span v-if="city.temp >= 28" class="chip hot">🔥 더움</span>
      <span v-else class="chip cool">❄️ 선선함</span>
      <button class="detail-btn" @click.stop="onDetail">상세보기 →</button>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: var(--surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: 18px 20px;
  cursor: pointer;
  transition: transform 0.12s, box-shadow 0.12s;
  height: 100%;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 0 1px var(--text-secondary), 0 6px 16px rgba(27, 28, 25, 0.06);
}
.card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.city-name {
  font-weight: 700;
  font-size: 17px;
  color: var(--text-heading);
  margin: 0;
  white-space: nowrap;
}
.card-head > div {
  min-width: 0;
}
.card-head {
  gap: 12px;
}
.status {
  margin: 2px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}
.temp {
  margin: 0;
  font-size: 34px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}
.temp .unit {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-left: 2px;
}
.card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
}
.chip {
  display: inline-block;
  padding: 5px 12px;
  border-radius: var(--radius-chip);
  font-size: 13px;
  font-weight: 600;
}
.hot {
  background: var(--warm-soft);
  color: var(--warm);
}
.cool {
  background: var(--cool-soft);
  color: var(--cool);
}
.detail-btn {
  background: var(--bg-muted);
  color: var(--text-secondary);
  padding: 7px 14px;
  font-size: 13px;
}
.detail-btn:hover {
  background: var(--btn-bg);
  color: var(--btn-fg);
}
</style>