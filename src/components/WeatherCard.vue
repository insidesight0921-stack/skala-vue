<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../stores/configStore.js'
const props = defineProps({ city: { type: Object, required: true } })
const emit = defineEmits(['select-card', 'click-detail'])
const configStore = useConfigStore()
const displayTemp = computed(() => {
  const t = props.city.temp
  return configStore.unit === 'fahrenheit' ? Math.round((t * 9) / 5 + 32) : t
})
</script>
<template>
  <div class="card" @click="emit('select-card', props.city.name)">
    <p><strong>{{ city.name }} ({{ city.status }})</strong> — {{ displayTemp }}{{ configStore.unitSymbol }}</p>
    <span v-if="city.temp >= 28" class="label hot">🔥 더움</span>
    <span v-else class="label cool">❄️ 선선함</span>
    <button @click.stop="emit('click-detail', props.city.name)">상세보기</button>
  </div>
</template>
