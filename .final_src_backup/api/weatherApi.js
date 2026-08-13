import axios from 'axios'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

// 도시명(한글/영어)으로 실시간 날씨 조회 → 우리 형식으로 변환
export async function fetchWeather(cityName) {
  const response = await axios.get(BASE_URL, {
    params: {
      q: cityName,
      units: 'metric',
      lang: 'kr',
      appid: API_KEY,
    },
  })
  const d = response.data
  return {
    id: String(d.id),              // API가 주는 도시 고유 id 사용
    name: d.name,                  // API가 주는 도시 이름
    temp: Math.round(d.main.temp),
    feelsLike: Math.round(d.main.feels_like),
    status: d.weather[0].description,
    humidity: d.main.humidity,
    wind: d.wind.speed,
  }
}

// 도시 id로 상세 날씨 조회
export async function fetchWeatherById(cityId) {
  const response = await axios.get(BASE_URL, {
    params: {
      id: cityId,       // 이름(q) 대신 id로 조회
      units: 'metric',
      lang: 'kr',
      appid: API_KEY,
    },
  })
  const d = response.data
  return {
    id: String(d.id),
    name: d.name,
    temp: Math.round(d.main.temp),
    feelsLike: Math.round(d.main.feels_like),
    status: d.weather[0].description,
    humidity: d.main.humidity,
    wind: d.wind.speed,
  }
}

// 위·경도로 날씨 조회 (지도 클릭용)
export async function fetchWeatherByCoord(lat, lon) {
  const response = await axios.get(BASE_URL, {
    params: { lat, lon, units: 'metric', lang: 'kr', appid: API_KEY },
  })
  const d = response.data
  return {
    id: String(d.id),
    name: d.name || '선택 지점',
    temp: Math.round(d.main.temp),
    status: d.weather[0].description,
    humidity: d.main.humidity,
    wind: d.wind.speed,
  }
}

// 5일/3시간 예보 조회 (분석용으로 단순화)
export async function fetchForecast(cityName) {
  const res = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
    params: { q: cityName, units: 'metric', lang: 'kr', appid: API_KEY },
  })
  return res.data.list.map((item) => ({
    date: item.dt_txt.slice(0, 10),          // '2026-08-12'
    hour: new Date(item.dt * 1000).getHours(), // 0~23
    temp: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    wind: item.wind.speed,
    pop: item.pop,                            // 강수확률 0~1
    rain: item.rain?.['3h'] ?? 0,             // 강수량 mm
    status: item.weather[0].description,
  }))
}