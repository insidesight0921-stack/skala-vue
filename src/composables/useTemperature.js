import { computed } from 'vue'
import { useConfigStore } from '../stores/configStore.js'

/**
 * 온도 단위 변환 Composable.
 * 메인/상세/지도 어디서든 재사용 → 변환 코드 중복 제거.
 */
export function useTemperature() {
  const config = useConfigStore()

  // 섭씨 원본 → 현재 단위로 변환
  const convert = (celsius) =>
    config.unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius

  // 값을 기호까지 붙여 반환 (예: "28°C")
  const format = (celsius) => `${convert(celsius)}${config.unitSymbol}`

  const symbol = computed(() => config.unitSymbol)

  return { convert, format, symbol }
}
