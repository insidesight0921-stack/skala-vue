<script setup>
import { Search } from '@element-plus/icons-vue'

defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '도시명을 입력하세요 (예: 서울, 도쿄)' },
})
const emit = defineEmits(['update:modelValue', 'search'])

const onSearch = (val) => emit('search', val ?? '')
</script>

<template>
  <div class="search">
    <el-input
      :model-value="modelValue"
      :placeholder="placeholder"
      size="large"
      clearable
      :prefix-icon="Search"
      @update:model-value="emit('update:modelValue', $event)"
      @keyup.enter="onSearch(modelValue)"
    />
    <el-button type="primary" size="large" @click="onSearch(modelValue)">검색</el-button>
  </div>
</template>

<style scoped>
.search {
  display: flex;
  gap: 8px;
}
.search :deep(.el-input) {
  flex: 1;
}
</style>
