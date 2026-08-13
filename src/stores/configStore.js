import { defineStore } from 'pinia'
export const useConfigStore = defineStore('config', {
  state: () => ({ unit: 'celsius' }),
  getters: { unitSymbol: (s) => (s.unit === 'celsius' ? '°C' : '°F') },
  actions: {
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },
  },
})
