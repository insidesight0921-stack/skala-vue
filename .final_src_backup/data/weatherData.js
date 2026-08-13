// src/data/weatherData.js
export const weatherList = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 55, wind: 2.5 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 80, wind: 3.1 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 60, wind: 4.0 },
  { id: 'city_04', name: '대구', temp: 31, status: '폭염', humidity: 45, wind: 1.8 },
  { id: 'city_05', name: '강릉', temp: 22, status: '흐림', humidity: 70, wind: 2.2 },
]

// API 조회용 도시 메타 정보 (id, 한글이름, API 조회 키워드)
export const cityMetaList = [
  { id: 'city_01', name: '서울', query: 'Seoul,KR' },
  { id: 'city_02', name: '수원', query: 'Suwon,KR' },
  { id: 'city_03', name: '부산', query: 'Busan,KR' },
  { id: 'city_04', name: '대구', query: 'Daegu,KR' },
  { id: 'city_05', name: '강릉', query: 'Gangneung,KR' },
]

// 초기 화면에 보여줄 대표 도시 (이름만)
export const defaultCities = ['Seoul', 'Busan', 'Incheon', 'Tokyo', 'New York']