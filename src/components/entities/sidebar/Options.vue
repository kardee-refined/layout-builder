<script setup lang="ts">
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { ref, onMounted, onUnmounted, watch } from "vue";

const elRef = ref<HTMLDivElement | null>(null);

const props = defineProps<{
  options: { id: string; icon: any; bg: string; title: string } | null;
}>();

const emit = defineEmits<{
  dragStart: [];
}>();

let cleanup: (() => void) | null = null;

const setupDraggable = () => {
  cleanup?.();
  cleanup = null;

  if (!elRef.value || !props.options) {
    return;
  }

  cleanup = draggable({
    element: elRef.value,
    getInitialData() {
      return {
        type: "sidebar_item",
        item: props.options,
      };
    },
    onDragStart() {
      console.log("Draggin started");
      emit("dragStart");
    },
    onDrop() {
      console.log("Dropped", props.options);
    },
  });
};

onMounted(() => {
  setupDraggable();
});

watch(
  () => props.options,
  () => {
    setupDraggable();
  }
);

onUnmounted(() => {
  cleanup?.();
});
</script>

<template>
  <div class="flex-1 p-4">
    <div
      ref="elRef"
      class="p-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
    >
      <h2 class="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
        {{ options?.title }}
      </h2>
    </div>
  </div>
</template>
