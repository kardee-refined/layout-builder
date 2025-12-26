<script setup lang="ts">
import { computed, ref } from "vue";
import Header from "@/components/entities/header/Header.vue";
import Sidebar from "@/components/entities/sidebar/Sidebar.vue";
import Editor from "@/components/entities/canvas/editor/Editor.vue";
import Renderer from "@/components/entities/canvas/renderer/Renderer.vue";
import { generateAppData } from "@/utils/sampleData";

const isPublished = ref(true);
const canvas = ref(generateAppData());

const onTogglePublish = () => {
  isPublished.value = !isPublished.value;
};

const showSidebar = computed(() => !isPublished.value);

function onSelect(tool: any) {
  console.log("clicked", tool);
}
</script>

<template>
  <div class="bg-background">
    <Header
      :isPublished="isPublished"
      :showPresets="!isPublished"
      @toggle-publish="onTogglePublish"
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
