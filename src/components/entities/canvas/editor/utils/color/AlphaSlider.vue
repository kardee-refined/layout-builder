<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  alpha: number
  solidHex: string
}>()

const emit = defineEmits<{ (e: 'update:alpha', v: number): void }>()

const SL = { w: 280, h: 14 }
const alphaRef = ref<SVGSVGElement | null>(null)

const x = computed(() => props.alpha * SL.w)

function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)) }

function svgPoint(evt: PointerEvent, el: SVGElement) {
  const rect = el.getBoundingClientRect()
  const xx = clamp(evt.clientX - rect.left, 0, rect.width)
  const vb = el.viewBox.baseVal
  return { x: (xx / rect.width) * vb.width }
}

function updateFromEvent(e: PointerEvent) {
  if (!alphaRef.value) return
  const p = svgPoint(e, alphaRef.value)
  emit('update:alpha', p.x / SL.w)
}

function onDown(e: PointerEvent) {
  if (!alphaRef.value) return
  alphaRef.value.setPointerCapture(e.pointerId)
  updateFromEvent(e)
}
function onMove(e: PointerEvent) {
  if (!alphaRef.value || (e.buttons !== 1 && e.pressure === 0)) return
  updateFromEvent(e)
}
</script>

<template>
  <svg
    ref="alphaRef"
    :viewBox="`0 0 ${SL.w} ${SL.h}`"
    class="w-full rounded-md overflow-hidden touch-none"
    @pointerdown="onDown"
    @pointermove="onMove"
  >
    <defs>
      <pattern id="checker" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="10" height="10" fill="#E5E7EB" />
        <rect x="0" y="0" width="5" height="5" fill="#F9FAFB" />
        <rect x="5" y="5" width="5" height="5" fill="#F9FAFB" />
      </pattern>

      <linearGradient id="alpha" x1="0" y1="0" :x2="SL.w" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="rgba(0,0,0,0)" />
        <stop offset="1" :stop-color="props.solidHex" />
      </linearGradient>
    </defs>

    <rect x="0" y="0" :width="SL.w" :height="SL.h" fill="url(#checker)" />
    <rect x="0" y="0" :width="SL.w" :height="SL.h" fill="url(#alpha)" />
    <rect :x="x - 3" y="0" width="6" :height="SL.h" fill="white" opacity="0.9" />
  </svg>
</template>
