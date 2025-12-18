<template>
  <div v-if="visible" class="flex justify-center items-center">
    <div
      class="cursor-col-resize w-1 h-10 bg-blue-500 rounded-sm touch-none select-none"
      @pointerdown="onPointerDown"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "pointerdown", event: PointerEvent): void;
}>();

const onPointerDown = (event: PointerEvent) => {
  emit("pointerdown", event);
};
</script>
