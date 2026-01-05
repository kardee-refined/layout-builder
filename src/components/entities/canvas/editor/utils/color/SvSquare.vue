<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  hueHex: string
  s: number
  v: number
}>()

const emit = defineEmits<{
  (e: 'update:sv', v: { s: number; v: number }): void
}>()

const SV = { w: 280, h: 210 }
const svRef = ref<SVGSVGElement | null>(null)

const cursor = computed(() => ({
  cx: props.s * SV.w,
  cy: (1 - props.v) * SV.h
}))

function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)) }

function svgPoint(evt: PointerEvent, el: SVGElement) {
  const rect = el.getBoundingClientRect()
  const x = clamp(evt.clientX - rect.left, 0, rect.width)
  const y = clamp(evt.clientY - rect.top, 0, rect.height)
  const vb = el.viewBox.baseVal
  return { x: (x / rect.width) * vb.width, y: (y / rect.height) * vb.height }
}

function updateFromEvent(e: PointerEvent) {
  if (!svRef.value) return
  const p = svgPoint(e, svRef.value)
  emit('update:sv', { s: p.x / SV.w, v: 1 - (p.y / SV.h) })
}

function onDown(e: PointerEvent) {
  if (!svRef.value) return
  svRef.value.setPointerCapture(e.pointerId)
  updateFromEvent(e)
}
function onMove(e: PointerEvent) {
  if (!svRef.value || (e.buttons !== 1 && e.pressure === 0)) return
  updateFromEvent(e)
}
</script>

<template>
  <svg
    ref="svRef"
    :viewBox="`0 0 ${SV.w} ${SV.h}`"
    class="w-full rounded-lg overflow-hidden touch-none"
    @pointerdown="onDown"
    @pointermove="onMove"
  >
    <defs>
      <linearGradient id="sv-h" x1="0" y1="0" :x2="SV.w" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FFFFFF" />
        <stop offset="1" :stop-color="props.hueHex" />
      </linearGradient>

      <linearGradient id="sv-v" x1="0" y1="0" x2="0" :y2="SV.h" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="rgba(0,0,0,0)" />
        <stop offset="1" stop-color="#000000" />
      </linearGradient>
    </defs>

    <rect x="0" y="0" :width="SV.w" :height="SV.h" fill="url(#sv-h)" />
    <rect x="0" y="0" :width="SV.w" :height="SV.h" fill="url(#sv-v)" />

    <circle :cx="cursor.cx" :cy="cursor.cy" r="9" fill="none" stroke="white" stroke-width="3" />
    <circle :cx="cursor.cx" :cy="cursor.cy" r="9" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="1" />
  </svg>
</template>
