<script setup>
import { useConfigStore } from '../../stores/configStore.js'
defineProps({ searchQuery: String })
const emit = defineEmits(['update-query', 'search'])   // search 추가

const onInput = (e) => emit('update-query', e.target.value)
const onEnter = (e) => emit('search', e.target.value)   // 엔터 시 검색
const configStore = useConfigStore()
</script>

<template>
  <div class="search-bar" :class="{ dark: configStore.isDark }">
    <div class="search-row">
      <input
        type="text"
        :value="searchQuery"
        @input="onInput"
        @keyup.enter="onEnter"
        placeholder="도시명 입력 후 Enter (영어 권장)"
      />
      <button class="search-btn" @click="onEnter">검색</button>
    </div>
    <p class="search-hint">검색 중인 도시: <strong>{{ searchQuery || '—' }}</strong></p>
  </div>
</template>

<style scoped>
.search-row {
  display: flex;
  gap: 8px;
}
.search-row input {
  flex: 1;
}
.search-btn {
  background: var(--btn-bg);
  color: var(--btn-fg);
  padding: 11px 18px;
  white-space: nowrap;
}
.search-btn:hover {
  opacity: 0.88;
}
.search-hint {
  margin: 10px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}
.search-hint strong {
  color: var(--accent);
}
.search-bar.dark .search-hint {
  color: var(--dk-text-sec);
}
</style>