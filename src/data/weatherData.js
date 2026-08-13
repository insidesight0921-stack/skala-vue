// 대시보드에 고정으로 표시할 한국 대표 도시 (ko=표시명, q=API 조회어)
export const defaultCities = [
  { ko: '서울', q: 'Seoul' },
  { ko: '부산', q: 'Busan' },
  { ko: '인천', q: 'Incheon' },
  { ko: '대구', q: 'Daegu' },
  { ko: '대전', q: 'Daejeon' },
  { ko: '광주', q: 'Gwangju' },
  { ko: '울산', q: 'Ulsan' },
  { ko: '제주', q: 'Jeju' },
]

// 지도 마커용 (ko=팝업 표시, name=API 조회어, 좌표)
export const mapCities = [
  { ko: '서울', name: 'Seoul', lat: 37.57, lon: 126.98 },
  { ko: '부산', name: 'Busan', lat: 35.18, lon: 129.08 },
  { ko: '인천', name: 'Incheon', lat: 37.46, lon: 126.71 },
  { ko: '대구', name: 'Daegu', lat: 35.87, lon: 128.6 },
  { ko: '광주', name: 'Gwangju', lat: 35.16, lon: 126.85 },
  { ko: '대전', name: 'Daejeon', lat: 36.35, lon: 127.38 },
  { ko: '제주', name: 'Jeju', lat: 33.5, lon: 126.53 },
]

// 한글 도시명 → 영어 조회어 사전 (국내 + 해외 주요 도시)
export const cityAliases = {
  // 국내
  서울: 'Seoul', 부산: 'Busan', 인천: 'Incheon', 대구: 'Daegu', 대전: 'Daejeon',
  광주: 'Gwangju', 울산: 'Ulsan', 세종: 'Sejong', 수원: 'Suwon', 성남: 'Seongnam',
  고양: 'Goyang', 용인: 'Yongin', 창원: 'Changwon', 청주: 'Cheongju', 전주: 'Jeonju',
  천안: 'Cheonan', 안산: 'Ansan', 안양: 'Anyang', 포항: 'Pohang', 김해: 'Gimhae',
  제주: 'Jeju', 강릉: 'Gangneung', 춘천: 'Chuncheon', 원주: 'Wonju', 경주: 'Gyeongju',
  여수: 'Yeosu', 목포: 'Mokpo', 군산: 'Gunsan', 진주: 'Jinju', 속초: 'Sokcho',
  // 아시아
  도쿄: 'Tokyo', 오사카: 'Osaka', 교토: 'Kyoto', 삿포로: 'Sapporo', 후쿠오카: 'Fukuoka',
  나고야: 'Nagoya', 요코하마: 'Yokohama', 베이징: 'Beijing', 상하이: 'Shanghai',
  광저우: 'Guangzhou', 선전: 'Shenzhen', 홍콩: 'Hong Kong', 타이베이: 'Taipei',
  방콕: 'Bangkok', 싱가포르: 'Singapore', 쿠알라룸푸르: 'Kuala Lumpur', 자카르타: 'Jakarta',
  마닐라: 'Manila', 하노이: 'Hanoi', 호치민: 'Ho Chi Minh City', 델리: 'Delhi',
  뭄바이: 'Mumbai', 두바이: 'Dubai', 이스탄불: 'Istanbul',
  // 유럽
  런던: 'London', 파리: 'Paris', 베를린: 'Berlin', 뮌헨: 'Munich', 프랑크푸르트: 'Frankfurt',
  로마: 'Rome', 밀라노: 'Milan', 마드리드: 'Madrid', 바르셀로나: 'Barcelona', 리스본: 'Lisbon',
  암스테르담: 'Amsterdam', 브뤼셀: 'Brussels', 취리히: 'Zurich', 비엔나: 'Vienna', 빈: 'Vienna',
  프라하: 'Prague', 부다페스트: 'Budapest', 바르샤바: 'Warsaw', 아테네: 'Athens',
  스톡홀름: 'Stockholm', 코펜하겐: 'Copenhagen', 오슬로: 'Oslo', 헬싱키: 'Helsinki',
  모스크바: 'Moscow',
  // 아메리카 / 오세아니아
  뉴욕: 'New York', 로스앤젤레스: 'Los Angeles', 엘에이: 'Los Angeles', 샌프란시스코: 'San Francisco',
  시카고: 'Chicago', 시애틀: 'Seattle', 라스베이거스: 'Las Vegas', 워싱턴: 'Washington',
  보스턴: 'Boston', 마이애미: 'Miami', 토론토: 'Toronto', 밴쿠버: 'Vancouver',
  멕시코시티: 'Mexico City', 상파울루: 'Sao Paulo', 리우데자네이루: 'Rio de Janeiro',
  부에노스아이레스: 'Buenos Aires', 시드니: 'Sydney', 멜버른: 'Melbourne', 오클랜드: 'Auckland',
  카이로: 'Cairo',
}

/** 한글 입력을 API 조회어로 변환 (사전에 없으면 원문 그대로) */
export function resolveCityQuery(input) {
  const t = (input || '').trim()
  return cityAliases[t] || t
}

// 영문 도시명 → 한글 (사전 역변환). 지도 클릭 등에서 한글 표시용.
const englishToKorean = Object.fromEntries(
  Object.entries(cityAliases).map(([ko, en]) => [en, ko]),
)
/** 영문(또는 로컬) 도시명을 한글로. 사전에 없으면 원문 그대로 */
export function koreanNameFor(name) {
  return englishToKorean[(name || '').trim()] || name
}
