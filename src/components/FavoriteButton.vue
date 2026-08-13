<script setup>
import { computed } from 'vue'
import { useFavoritesStore } from '../stores/favoritesStore.js'

const props = defineProps({
  city: { type: Object, required: true }, // { id, name, q }
})

const favs = useFavoritesStore()
const active = computed(() => favs.isFavorite(props.city.id))

function onClick(e) {
  e.stopPropagation() // 카드 클릭(상세 이동)과 분리
  favs.toggle(props.city)
}
</script>

<template>
  <button
    class="fav"
    :class="{ 'fav--on': active }"
    :title="active ? '즐겨찾기 해제' : '즐겨찾기 추가'"
    :aria-label="active ? '즐겨찾기 해제' : '즐겨찾기 추가'"
    @click="onClick"
  >
    {{ active ? '★' : '☆' }}
  </button>
</template>

<style scoped>
.fav {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  color: var(--text-muted);
  padding: 2px 4px;
  border-radius: 8px;
  transition:
    transform 0.12s ease,
    color 0.12s ease;
}
.fav:hover {
  transform: scale(1.15);
}
.fav--on {
  color: #f5b301;
}
</style>
