<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Header from "@/components/entities/header/Header.vue";
import Sidebar from "@/components/entities/sidebar/Sidebar.vue";
import Editor from "@/components/entities/canvas/editor/Editor.vue";
import Renderer from "@/components/entities/canvas/renderer/Renderer.vue";
import { generateAppData } from "@/utils/sampleData";
import { emailPresets } from "./components/entities/canvas/editor/presets/emailPresets";
import type { CanvasEntity } from "@/types/CanvasType";

const isPublished = ref(true);
const canvas = ref(generateAppData());

const undoStack = ref<string[]>([]);
const redoStack = ref<string[]>([]);
const isTimeTraveling = ref(false);
let historyTimer: number | null = null;

const serializeCanvas = (value: CanvasEntity) => JSON.stringify(value);

const resetHistory = () => {
  const snapshot = serializeCanvas(canvas.value);
  undoStack.value = [snapshot];
  redoStack.value = [];
};

const canUndo = computed(() => !isPublished.value && undoStack.value.length > 1);
const canRedo = computed(() => !isPublished.value && redoStack.value.length > 0);

const applySnapshot = (snapshot: string) => {
  isTimeTraveling.value = true;
  canvas.value = JSON.parse(snapshot) as CanvasEntity;
  queueMicrotask(() => {
    isTimeTraveling.value = false;
  });
};

const undo = () => {
  if (!canUndo.value) return;
  const current = undoStack.value.pop();
  if (!current) return;
  redoStack.value.push(current);
  const previous = undoStack.value[undoStack.value.length - 1];
  if (!previous) return;
  applySnapshot(previous);
};

const redo = () => {
  if (!canRedo.value) return;
  const next = redoStack.value.pop();
  if (!next) return;
  undoStack.value.push(serializeCanvas(canvas.value));
  applySnapshot(next);
};

const onTogglePublish = () => {
  isPublished.value = !isPublished.value;
};

const showSidebar = computed(() => !isPublished.value);

function onSelect(tool: any) {
  console.log("clicked", tool);
}

function onPresetSelect(presetId: any) {
  console.log("preset selected", presetId);
  const preset = emailPresets.find((p) => p.id === presetId);
  if (preset) {
    console.log("preset", preset);

    canvas.value = preset.build();
    resetHistory();
  }
}

watch(
  isPublished,
  (published) => {
    if (!published) {
      resetHistory();
    }
  },
  { immediate: true }
);

watch(
  canvas,
  () => {
    if (isPublished.value) return;
    if (isTimeTraveling.value) return;

    if (historyTimer) window.clearTimeout(historyTimer);
    historyTimer = window.setTimeout(() => {
      historyTimer = null;
      const next = serializeCanvas(canvas.value);
      const last = undoStack.value[undoStack.value.length - 1];
      if (next === last) return;
      undoStack.value.push(next);
      redoStack.value = [];
    }, 250);
  },
  { deep: true }
);
</script>

<template>
  <UApp>
    <div class="bg-background">
      <Header
        :isPublished="isPublished"
        :showPresets="!isPublished"
        :canUndo="canUndo"
        :canRedo="canRedo"
        @toggle-publish="onTogglePublish"
        @preset-select="onPresetSelect"
        @undo="undo"
        @redo="redo"
      />
      <div
        class="flex bg-[#f0f0f3] dark:bg-[#212225] h-[calc(100vh-64px)]"
        :class="showSidebar ? 'pl-20' : 'pl-0'"
      >
        <!-- Sidebar sits fixed; you still need to keep main content offset by collapsed width -->
        <Sidebar v-if="showSidebar" @select="onSelect" />

        <!-- main content: keep left padding equal to collapsed width (64px) -->
        <main class="flex-1">
          <Editor v-if="!isPublished" :canvas="canvas" />
          <Renderer v-else :canvas="canvas" />
        </main>
      </div>
    </div>
  </UApp>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
