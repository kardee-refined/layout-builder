<script setup lang="ts">
import { ref } from "vue";
import type { SectionEntity } from "@/types/CanvasType";
import Row from "@/components/entities/canvas/editor/row/Row.vue";

const props = defineProps<{
  section: SectionEntity;
}>();

const emit = defineEmits<{
  (e: "add-section"): void;
  (e: "add-row", payload: { sectionId: string }): void;
}>();

const isHover = ref(false);
const spacerHeight = ref(80);
const isDragging = ref(false);
const dragValue = ref(80);

const handleSpacerPointerDown = (event: PointerEvent) => {
  event.preventDefault();
  const startY = event.clientY;
  const startHeight = spacerHeight.value;
  isDragging.value = true;
  dragValue.value = spacerHeight.value;
  (event.target as HTMLElement).setPointerCapture(event.pointerId);

  const handlePointerMove = (moveEvent: PointerEvent) => {
    const deltaY = moveEvent.clientY - startY;
    let next = startHeight + Math.round(deltaY / 1) * 1;
    next = Math.max(0, Math.min(200, next));

    if (next !== spacerHeight.value) {
      spacerHeight.value = next;
    }
    dragValue.value = next;
  };

  const handlePointerUp = () => {
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
    isDragging.value = false;
  };

  document.addEventListener("pointermove", handlePointerMove);
  document.addEventListener("pointerup", handlePointerUp);
};
</script>

<template>
  <div
    class="relative group border border-transparent hover:border-blue-400 rounded-lg transition-colors duration-200"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <!-- Section Content -->
    <section class="relative py-6 bg-secondary text-white rounded-lg">
      <div
        class="absolute left-0 right-0 top-0 h-2 cursor-row-resize touch-none"
        @pointerdown="handleSpacerPointerDown"
      ></div>
      <div
        v-if="isDragging"
        class="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
        :style="{ top: `${spacerHeight / 2}px` }"
      >
        {{ dragValue }}px
      </div>
      <div
        v-if="isDragging"
        class="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
        :style="{ bottom: `${spacerHeight / 2}px` }"
      >
        {{ dragValue }}px
      </div>
      <div
        class="w-full cursor-row-resize touch-none select-none"
        :style="{ height: `${spacerHeight}px` }"
        @pointerdown="handleSpacerPointerDown"
      ></div>
      <div class="flex flex-col gap-2.5">
        <Row v-for="row in props.section.children" :key="row.id" :rowdata="row" />
      </div>
      <div
        class="w-full cursor-row-resize touch-none select-none"
        :style="{ height: `${spacerHeight}px` }"
        @pointerdown="handleSpacerPointerDown"
      ></div>
      <div
        class="absolute left-0 right-0 bottom-0 h-2 cursor-row-resize touch-none"
        @pointerdown="handleSpacerPointerDown"
      ></div>
      <div
        v-if="isHover"
        class="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 flex items-center justify-center gap-2"
      >
        <UButton
          size="sm"
          variant="soft"
          color="neutral"
          label="Add Row"
          @click="emit('add-row', { sectionId: props.section.id })"
        />
        <UButton
          size="sm"
          variant="soft"
          color="neutral"
          label="Add Section"
          @click="emit('add-section')"
        />
      </div>
    </section>
  </div>
</template>
