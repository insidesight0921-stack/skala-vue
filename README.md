# Weatherly — Vue 3 날씨 대시보드

OpenWeatherMap과 지도·경로 API를 활용해 만든 실시간 날씨 웹 애플리케이션입니다.
검색, 지도 탐색, 통근 경로 기반 날씨 브리핑을 하나의 앱에서 제공합니다.

- **배포 URL**: https://skala-vue-bice-theta.vercel.app/
- **저장소**: https://github.com/insidesight0921-stack/skala-vue

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 실시간 날씨 대시보드 | 한국 주요 도시(서울·부산·인천 등)의 현재 날씨를 카드로 표시 |
| 도시 검색 | 한국어로 입력해 국내는 물론 해외 도시까지 검색 (별칭 사전 + 역지오코딩) |
| 시간대별 예보 | 5일/3시간 예보를 히어로 영역에 시간별로 표시 |
| 오늘의 브리핑 | 예보 데이터를 분석해 우산·기온 변화 등 자연어 조언 제공 |
| 지도 탐색 | Leaflet 지도에서 구름·강수·기온·바람 레이어 토글, 클릭 지점 날씨 조회 |
| 통근 경로 브리핑 | 집·근무지를 지정하면 **경로상 지점들의 날씨**를 종합해 통근 브리핑 (국내 한정) |
| 다크 모드 · 단위 전환 | 라이트/다크 테마, ℃/℉ 단위 토글 (Pinia로 상태 관리) |

## 사용 API

- **OpenWeatherMap**
  - Current Weather (`/data/2.5/weather`) — 실시간 날씨
  - 5 Day / 3 Hour Forecast (`/data/2.5/forecast`) — 예보·브리핑
  - Reverse Geocoding (`/geo/1.0/reverse`) — 좌표 → 한국어 지명
- **지도 / 경로 (기타 외부 API)**
  - Leaflet + OpenStreetMap 타일 — 지도 렌더링
  - OSRM (무료, 키 불필요) — 통근 경로 계산, CORS 지원
  - Kakao Mobility Directions (선택) — 국내 정밀 경로 (`api/route.js` 서버리스 프록시로 키 보호)

## 기술 스택

- **Vue 3** (`<script setup>`, Composition API) · **Vue Router** · **Pinia**
- **Vite** 빌드 · **Axios** 통신
- **Element Plus** UI 라이브러리 (한국어 로케일 + 다크 테마 동기화)
- **Leaflet** 지도
- 코드 품질: **ESLint + Oxlint + Prettier**
- 배포: **Vercel** (SPA rewrite + 서버리스 함수)

---

## 실행 방법

### 1. 설치

```sh
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 만들고 OpenWeatherMap 키를 입력합니다.

```sh
# .env
VITE_WEATHER_API_KEY=발급받은_OpenWeatherMap_API_키
```

> Kakao 정밀 경로를 쓰려면 `KAKAO_REST_KEY`(서버 전용, `VITE_` 접두사 없음)를
> Vercel 환경 변수에 추가합니다. 없으면 자동으로 OSRM으로 폴백됩니다.

### 3. 개발 서버 실행

```sh
npm run dev
```

### 4. 프로덕션 빌드

```sh
npm run build     # 결과물은 dist/ 에 생성
```

### 5. 코드 품질 점검

```sh
npm run lint      # ESLint + Oxlint (Error 0 유지)
npm run format    # Prettier 스타일 정렬
```

---

## 프로젝트 구조

```
skala-vue/
├─ api/
│  └─ route.js            # Kakao 경로 서버리스 프록시 (키를 서버에만 보관)
├─ src/
│  ├─ api/
│  │  ├─ weatherApi.js    # OpenWeather 호출(현재/예보/역지오코딩)
│  │  └─ routeApi.js      # 경로 계산(Kakao 우선 → OSRM 폴백)
│  ├─ components/         # 재사용 컴포넌트(카드·검색·히어로 등)
│  ├─ composables/        # useTemperature, useSky
│  ├─ data/               # 도시 목록·별칭 사전
│  ├─ stores/             # Pinia (config·commute)
│  ├─ views/              # 라우트 화면(대시보드·지도·통근·상세·소개)
│  ├─ router/             # Vue Router 설정
│  └─ assets/             # 전역 CSS·테마 토큰
├─ public/                # favicon 등 정적 파일
└─ vercel.json            # SPA 라우팅 rewrite
```

## 환경 변수 & 보안

- API 키는 소스코드에 하드코딩하지 않고 `.env`의 `VITE_WEATHER_API_KEY`로 주입합니다.
- `.env*` 파일은 `.gitignore`로 Git에 올라가지 않도록 처리했습니다.
- Vite 환경 변수는 **빌드 시점에 주입**되므로, Vercel에서 키를 추가·변경한 뒤에는 **재배포**해야 반영됩니다.
