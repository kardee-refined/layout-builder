<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{ h: number }>()
const emit = defineEmits<{ (e: 'update:h', v: number): void }>()

const SL = { w: 280, h: 14 }
const hueRef = ref<SVGSVGElement | null>(null)

const x = computed(() => (props.h / 360) * SL.w)

function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)) }

function svgPoint(evt: PointerEvent, el: SVGElement) {
  const rect = el.getBoundingClientRect()
  const xx = clamp(evt.clientX - rect.left, 0, rect.width)
  const vb = el.viewBox.baseVal
  return { x: (xx / rect.width) * vb.width }
}

function updateFromEvent(e: PointerEvent) {
  if (!hueRef.value) return
  const p = svgPoint(e, hueRef.value)
  emit('update:h', (p.x / SL.w) * 360)
}

function onDown(e: PointerEvent) {
  if (!hueRef.value) return
  hueRef.value.setPointerCapture(e.pointerId)
  updateFromEvent(e)
}
function onMove(e: PointerEvent) {
  if (!hueRef.value || (e.buttons !== 1 && e.pressure === 0)) return
  updateFromEvent(e)
}
</script>

<template>
  <svg
    ref="hueRef"
    :viewBox="`0 0 ${SL.w} ${SL.h}`"
    class="w-full rounded-md overflow-hidden touch-none"
    @pointerdown="onDown"
    @pointermove="onMove"
  >
    <defs>
      <linearGradient id="hue" x1="0" y1="0" :x2="SL.w" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#FF0000" />
        <stop offset="16.6%" stop-color="#FFFF00" />
        <stop offset="33.3%" stop-color="#00FF00" />
        <stop offset="50%" stop-color="#00FFFF" />
        <stop offset="66.6%" stop-color="#0000FF" />
        <stop offset="83.3%" stop-color="#FF00FF" />
        <stop offset="100%" stop-color="#FF0000" />
      </linearGradient>
    </defs>

    <rect x="0" y="0" :width="SL.w" :height="SL.h" fill="url(#hue)" />
    <rect :x="x - 3" y="0" width="6" :height="SL.h" fill="white" opacity="0.9" />
  </svg>
</template>
