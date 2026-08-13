import { defineStore } from 'pinia'

const KEY = 'weatherly:favorites'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

/** 즐겨찾기 도시 목록 — localStorage에 영구 저장 */
export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    // [{ id, name, q }]
    cities: load(),
  }),
  getters: {
    isFavorite: (s) => (id) => s.cities.some((c) => c.id === String(id)),
    count: (s) => s.cities.length,
  },
  actions: {
    persist() {
      localStorage.setItem(KEY, JSON.stringify(this.cities))
    },
    add(city) {
      const id = String(city.id)
      if (this.cities.some((c) => c.id === id)) return
      this.cities.push({ id, name: city.name, q: city.q || city.name })
      this.persist()
    },
    remove(id) {
      this.cities = this.cities.filter((c) => c.id !== String(id))
      this.persist()
    },
    toggle(city) {
      if (this.isFavorite(city.id)) this.remove(city.id)
      else this.add(city)
    },
  },
})
