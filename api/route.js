// Vercel Serverless Function — 카카오모빌리티 길찾기 프록시 (국내 전용)
// 키를 서버에만 두어 CORS/키 노출 문제를 피한다.
// 환경변수: KAKAO_REST_KEY (Vercel 프로젝트 설정에 추가)
export default async function handler(req, res) {
  const { originLat, originLon, destLat, destLon } = req.query
  const key = process.env.KAKAO_REST_KEY

  if (!key) {
    res.status(500).json({ error: 'KAKAO_REST_KEY 미설정' })
    return
  }
  if (!originLat || !originLon || !destLat || !destLon) {
    res.status(400).json({ error: '좌표 파라미터 누락' })
    return
  }

  try {
    const url =
      'https://apis-navi.kakaomobility.com/v1/directions' +
      `?origin=${originLon},${originLat}&destination=${destLon},${destLat}` +
      '&priority=RECOMMEND&car_fuel=GASOLINE'

    const r = await fetch(url, { headers: { Authorization: `KakaoAK ${key}` } })
    const data = await r.json()
    const route = data.routes?.[0]

    if (!route || route.result_code !== 0) {
      res.status(502).json({ error: '경로 계산 실패', detail: route?.result_msg || data })
      return
    }

    // vertexes: [lon, lat, lon, lat, ...] → [[lon,lat], ...]
    const coords = []
    route.sections.forEach((s) =>
      s.roads.forEach((road) => {
        for (let i = 0; i < road.vertexes.length; i += 2) {
          coords.push([road.vertexes[i], road.vertexes[i + 1]])
        }
      }),
    )

    res.status(200).json({
      distanceKm: +(route.summary.distance / 1000).toFixed(1),
      durationMin: Math.round(route.summary.duration / 60),
      coords,
    })
  } catch (e) {
    res.status(500).json({ error: '프록시 오류', detail: String(e) })
  }
}
