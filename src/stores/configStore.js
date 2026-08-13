import { defineStore } from 'pinia'

/** 앱 전역 설정: 온도 단위 + 테마 */
export const useConfigStore = defineStore('config', {
  state: () => ({
    unit: 'celsius', // 'celsius' | 'fahrenheit'
    theme: 'light', // 'light' | 'dark'
  }),
  getters: {
    unitSymbol: (s) => (s.unit === 'celsius' ? '°C' : '°F'),
    isDark: (s) => s.theme === 'dark',
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
