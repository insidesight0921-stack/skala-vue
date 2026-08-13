import { defineStore } from 'pinia'

// 'config'라는 이름의 중앙 저장소를 정의
export const useConfigStore = defineStore('config', {
  state: () => ({
    unit: 'celsius',
    theme: 'light',
  }),
  getters: {
    unitSymbol: (state) => (state.unit === 'celsius' ? '°C' : '°F'),
    isDark: (state) => state.theme === 'dark',
  },
  actions: {
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },
  },
})