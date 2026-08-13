<script setup>
import { computed } from 'vue'
import { useTemperature } from '../composables/useTemperature.js'

const props = defineProps({
  hours: { type: Array, default: () => [] }, // [{ hour, temp, pop }]
})
const { convert, symbol } = useTemperature()

const W = 640
const H = 150
const padX = 26
const padTop = 34
const padBottom = 40

const label = (h) => (h === 0 ? '자정' : h === 12 ? '정오' : h < 12 ? `${h}시` : `${h - 12}시`)

const model = computed(() => {
  const hs = props.hours
  if (hs.length < 2) return null
  const temps = hs.map((h) => convert(h.temp))
  const min = Math.min(...temps)
  const max = Math.max(...temps)
  const span = max - min || 1
  const stepX = (W - padX * 2) / (hs.length - 1)
  const plotH = H - padTop - padBottom

  const pts = hs.map((h, i) => {
    const t = convert(h.temp)
    const x = padX + stepX * i
    const y = padTop + (1 - (t - min) / span) * plotH
    return { x, y, t, pop: Math.round((h.pop || 0) * 100), label: i === 0 ? '지금' : label(h.hour) }
  })

  const line = pts.map((p) => `${p.x},${p.y}`).join(' ')
  const area = `${padX},${H - padBottom} ${line} ${pts[pts.length - 1].x},${H - padBottom}`
  return { pts, line, area, baseY: H - padBottom }
})
</script>

<template>
  <div v-if="model" class="chart">
    <svg :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="xMidYMid meet" class="chart__svg">
      <defs>
        <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="var(--accent)" stop-opacity="0.35" />
          <stop offset="1" stop-color="var(--accent)" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- 강수확률 막대 -->
      <g>
        <rect
          v-for="(p, i) in model.pts"
          :key="'b' + i"
          :x="p.x - 8"
          :y="model.baseY - (p.pop / 100) * 24"
          width="16"
          :height="(p.pop / 100) * 24"
          rx="3"
          fill="var(--accent)"
          opacity="0.25"
        />
      </g>

      <!-- 기온 면적 + 라인 -->
      <polygon :points="model.area" fill="url(#tempFill)" />
      <polyline
        :points="model.line"
        fill="none"
        stroke="var(--accent)"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- 포인트 · 값 · 시간 -->
      <g v-for="(p, i) in model.pts" :key="'p' + i">
        <circle :cx="p.x" :cy="p.y" r="3.5" fill="var(--surface)" stroke="var(--accent)" stroke-width="2" />
        <text :x="p.x" :y="p.y - 10" text-anchor="middle" class="chart__val">{{ p.t }}{{ symbol }}</text>
        <text v-if="p.pop > 0" :x="p.x" :y="model.baseY + 16" text-anchor="middle" class="chart__pop">
          {{ p.pop }}%
        </text>
        <text :x="p.x" :y="H - 8" text-anchor="middle" class="chart__time">{{ p.label }}</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.chart {
  width: 100%;
  overflow-x: auto;
}
.chart__svg {
  width: 100%;
  min-width: 520px;
  height: auto;
  display: block;
}
.chart__val {
  font-size: 12px;
  font-weight: 700;
  fill: var(--text);
}
.chart__pop {
  font-size: 10px;
  fill: #3b82f6;
  font-weight: 600;
}
.chart__time {
  font-size: 11px;
  fill: var(--text-muted);
}
</style>
