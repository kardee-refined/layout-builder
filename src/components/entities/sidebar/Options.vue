<script setup lang="ts">
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from "vue";

const cardRefs = ref<Array<HTMLDivElement | null>>([]);

const props = defineProps<{
  options:
    | {
        id: string;
        icon: any;
        bg: string;
        title: string;
        type?: string;
        props?: Record<string, any>;
        variants?: Array<{
          id: string;
          title: string;
          type: string;
          props?: Record<string, any>;
        }>;
      }
    | null;
}>();

const emit = defineEmits<{
  dragStart: [];
}>();

let cleanupFns: Array<() => void> = [];

const items = computed(() => {
  if (!props.options) return [];
  if (props.options.variants?.length) return props.options.variants;
  return [
    {
      id: props.options.id,
      title: props.options.title,
      type: props.options.type ?? props.options.title.toLowerCase(),
      props: props.options.props,
    },
  ];
});

const hasVariants = computed(() => !!props.options?.variants?.length);

const setupDraggables = async () => {
  cleanupFns.forEach((fn) => fn());
  cleanupFns = [];
  if (!props.options) return;
  await nextTick();

  cardRefs.value.forEach((el, index) => {
    const item = items.value[index];
    if (!el || !item) return;
    cleanupFns.push(
      draggable({
        element: el,
        getInitialData() {
          return {
            type: "sidebar_item",
            item,
          };
        },
        onDragStart() {
          emit("dragStart");
        },
      })
    );
  });
};

const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
  if (!cardRefs.value) {
    cardRefs.value = [];
  }
  cardRefs.value[index] = el;
};

onMounted(() => {
  setupDraggables();
});

watch(
  () => props.options,
  () => {
    cardRefs.value = [];
    setupDraggables();
  }
);

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn());
  cleanupFns = [];
});
</script>

<template>
  <div class="flex-1 p-4">
    <div v-if="hasVariants" class="space-y-3">
      <div class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Button presets
      </div>
      <div class="flex flex-col gap-2">
        <button
          v-for="(item, index) in items"
          :key="item.id"
          :ref="setCardRef(index)"
          class="px-4 py-2 rounded-md text-sm font-semibold transition-shadow shadow-sm border border-transparent"
          :style="{
            backgroundColor: item.props?.bg ?? '#0f172a',
            color: item.props?.color ?? '#ffffff',
            borderColor: item.props?.border ?? 'transparent',
          }"
        >
          {{ item.props?.text || item.title }}
        </button>
      </div>
    </div>
    <div v-else class="grid gap-3">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        :ref="setCardRef(index)"
        class="p-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
      >
        <h2 class="text-sm font-semibold mb-2 text-slate-900 dark:text-slate-100">
          {{ item.title }}
        </h2>
        <div v-if="item.type === 'button'" class="flex">
          <button
            class="px-3 py-2 text-sm font-semibold"
            :style="{ backgroundColor: item.props?.bg, color: item.props?.color, borderRadius: `${item.props?.radius ?? 8}px` }"
          >
            {{ item.props?.text || "Button" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
