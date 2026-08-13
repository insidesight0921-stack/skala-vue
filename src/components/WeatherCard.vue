<script setup>
const props = defineProps({ city: { type: Object, required: true } })
const emit = defineEmits(['select-card', 'click-detail'])
</script>
<template>
  <div class="card" @click="emit('select-card', props.city.name)">
    <p><strong>{{ city.name }} ({{ city.status }})</strong> — {{ city.temp }}°C</p>
    <span v-if="city.temp >= 28" class="label hot">🔥 더움</span>
    <span v-else class="label cool">❄️ 선선함</span>
    <button @click.stop="emit('click-detail', props.city.name)">상세보기</button>
  </div>
</template>
