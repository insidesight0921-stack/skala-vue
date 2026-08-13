<script setup>
defineProps({ searchQuery: String })
const emit = defineEmits(['update-query'])
</script>
<template>
  <div>
    <input :value="searchQuery" @input="emit('update-query', $event.target.value)" placeholder="도시명" />
    <p>검색 중인 도시: <strong>{{ searchQuery }}</strong></p>
  </div>
</template>
