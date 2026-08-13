import axios from 'axios'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE = 'https://api.openweathermap.org/data/2.5'

const params = (extra) => ({ units: 'metric', lang: 'kr', appid: API_KEY, ...extra })

// API 응답 → 앱 표준 형식으로 변환
const normalize = (d) => ({
  id: String(d.id),
  name: d.name || '선택 지점',
  temp: Math.round(d.main.temp),
  feelsLike: Math.round(d.main.feels_like),
  status: d.weather[0].description,
  icon: d.weather[0].icon,
  humidity: d.main.humidity,
  wind: d.wind.speed,
  lat: d.coord?.lat,
  lon: d.coord?.lon,
})

/** 도시 이름으로 현재 날씨 */
export async function getWeatherByCity(city) {
  const { data } = await axios.get(`${BASE}/weather`, { params: params({ q: city }) })
  return normalize(data)
}

/** 도시 id로 현재 날씨 (상세 페이지) */
export async function getWeatherById(id) {
  const { data } = await axios.get(`${BASE}/weather`, { params: params({ id }) })
  return normalize(data)
}

/** 좌표 → 한글 지명 (역지오코딩, local_names.ko 우선) */
export async function getPlaceNameKo(lat, lon) {
  try {
    const { data } = await axios.get('https://api.openweathermap.org/geo/1.0/reverse', {
      params: { lat, lon, limit: 1, appid: API_KEY },
    })
    const g = data?.[0]
    if (!g) return null
    return g.local_names?.ko || g.name
  } catch {
    return null
  }
}

/** 좌표로 현재 날씨 (지도 클릭) */
export async function getWeatherByCoord(lat, lon) {
  const { data } = await axios.get(`${BASE}/weather`, { params: params({ lat, lon }) })
  return normalize(data)
}

// 대기질 지수(AQI 1~5) → 한글 라벨·색상
const AQI_LEVELS = [
  { label: '좋음', color: '#22c55e' },
  { label: '양호', color: '#84cc16' },
  { label: '보통', color: '#f59e0b' },
  { label: '나쁨', color: '#ef4444' },
  { label: '매우 나쁨', color: '#8b5cf6' },
]

/** 좌표로 대기질(미세먼지) 조회 — OpenWeather Air Pollution API */
export async function getAirQuality(lat, lon) {
  if (lat == null || lon == null) return null
  const { data } = await axios.get('https://api.openweathermap.org/data/2.5/air_pollution', {
    params: { lat, lon, appid: API_KEY },
  })
  const item = data?.list?.[0]
  if (!item) return null
  const aqi = item.main.aqi // 1~5
  const lv = AQI_LEVELS[aqi - 1] || AQI_LEVELS[2]
  return {
    aqi,
    label: lv.label,
    color: lv.color,
    pm25: Math.round(item.components.pm2_5),
    pm10: Math.round(item.components.pm10),
  }
}

/** 여러 도시 동시 조회 */
export function getWeatherMany(cities) {
  return Promise.all(cities.map((c) => getWeatherByCity(c)))
}

/** 5일/3시간 예보 (브리핑·통근용, 분석 편의 형태로 가공) */
export async function getForecast(city) {
  const { data } = await axios.get(`${BASE}/forecast`, { params: params({ q: city }) })
  return data.list.map((it) => ({
    date: it.dt_txt.slice(0, 10),
    hour: new Date(it.dt * 1000).getHours(),
    temp: Math.round(it.main.temp),
    feelsLike: Math.round(it.main.feels_like),
    humidity: it.main.humidity,
    wind: it.wind.speed,
    pop: it.pop, // 강수확률 0~1
    rain: it.rain?.['3h'] ?? 0,
    status: it.weather[0].description,
    icon: it.weather[0].icon,
  }))
}
