import axios from 'axios'

// OSRM 공개 서버 (OSM 기반, 키 불필요·CORS 허용) — 폴백/해외용
const OSRM = 'https://routing.openstreetmap.de/routed-car/route/v1/driving'

// 대한민국 대략 경계 (제주~강원 포함)
const KR = { latMin: 33.0, latMax: 39.6, lonMin: 124.5, lonMax: 132.0 }
const inKorea = (p) =>
  p && p.lat >= KR.latMin && p.lat <= KR.latMax && p.lon >= KR.lonMin && p.lon <= KR.lonMax

/** 출발·도착이 모두 국내인지 (최적 경로 지원 여부 판단) */
export function isDomestic(from, to) {
  return inKorea(from) && inKorea(to)
}

/** OSRM 경로 */
async function getRouteOSRM(from, to) {
  const url = `${OSRM}/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`
  const { data } = await axios.get(url, { timeout: 12000 })
  const route = data.routes?.[0]
  if (!route) throw new Error('OSRM 경로 없음')
  return {
    distanceKm: +(route.distance / 1000).toFixed(1),
    durationMin: Math.round(route.duration / 60),
    coords: route.geometry.coordinates,
    source: 'OSRM',
  }
}

/** 카카오 정밀 경로 (Vercel 서버리스 프록시 /api/route 경유, 국내 전용) */
async function getRouteKakao(from, to) {
  const p = new URLSearchParams({
    originLat: from.lat,
    originLon: from.lon,
    destLat: to.lat,
    destLon: to.lon,
  })
  const { data } = await axios.get(`/api/route?${p.toString()}`, { timeout: 12000 })
  if (!data.coords?.length) throw new Error('카카오 경로 없음')
  return { ...data, source: 'Kakao' }
}

/**
 * 국내 최적 경로. 카카오(정밀) 우선, 실패 시 OSRM 폴백.
 * ⚠️ 해외 구간은 이 함수를 호출하지 말 것(최적 경로 미지원).
 */
export async function getRouteDomestic(from, to) {
  try {
    return await getRouteKakao(from, to)
  } catch {
    // 프록시 미배포(로컬)·키 미설정 등 → OSRM 폴백
    return await getRouteOSRM(from, to)
  }
}

/** 경로 좌표에서 균등 간격으로 n개 지점 샘플 (시작·끝 포함) */
export function sampleAlong(coords, n = 4) {
  if (!coords || coords.length === 0) return []
  if (coords.length <= n) return coords.map(([lon, lat]) => ({ lat, lon }))
  const out = []
  for (let i = 0; i < n; i++) {
    const idx = Math.round((i * (coords.length - 1)) / (n - 1))
    const [lon, lat] = coords[idx]
    out.push({ lat, lon })
  }
  return out
}
