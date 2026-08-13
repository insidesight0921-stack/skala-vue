import { useConfigStore } from '../stores/configStore.js'

// OpenWeather 아이콘 코드(예: '01d','10n') 기준 컨디션별 하늘 그라데이션.
// Apple Weather 감성: 맑음=하늘색, 흐림/비=슬레이트, 밤=남색.
const RAMPS = {
  clear: { day: ['#4a90e2', '#8ec5f5'], night: ['#1b2440', '#2f3d68'] },
  clouds: { day: ['#5f7089', '#8fa0b8'], night: ['#28324c', '#3d4a6b'] },
  cloudsFew: { day: ['#5385c4', '#9fc0e4'], night: ['#24304d', '#39466a'] },
  rain: { day: ['#3a4a63', '#61738f'], night: ['#1e273c', '#38455f'] },
  snow: { day: ['#7c93b5', '#c2d0e2'], night: ['#2c3856', '#4a587a'] },
  mist: { day: ['#6b7688', '#9aa5b5'], night: ['#2a3245', '#454f63'] },
  default: { day: ['#4a90e2', '#8ec5f5'], night: ['#1b2440', '#2f3d68'] },
}

function rampFor(icon) {
  const code = (icon || '01d').slice(0, 2)
  const map = {
    '01': 'clear',
    '02': 'cloudsFew',
    '03': 'clouds',
    '04': 'clouds',
    '09': 'rain',
    '10': 'rain',
    '11': 'rain',
    '13': 'snow',
    '50': 'mist',
  }
  return RAMPS[map[code]] || RAMPS.default
}

/**
 * icon 코드로 하늘 그라데이션 CSS와 야간 여부를 반환.
 * 다크 테마에서는 명도를 낮춘다.
 */
export function skyGradient(icon) {
  const config = useConfigStore()
  const isNight = (icon || '01d').endsWith('n')
  const ramp = rampFor(icon)
  let [a, b] = isNight ? ramp.night : ramp.day
  if (config.isDark && !isNight) {
    // 라이트 컨디션도 다크 테마에선 한 단계 어둡게
    ;[a, b] = ramp.night
  }
  return {
    gradient: `linear-gradient(150deg, ${a} 0%, ${b} 100%)`,
    isNight,
  }
}
