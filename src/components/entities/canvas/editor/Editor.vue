<script setup lang="ts">
import { ref, watch } from "vue";
import Section from "./section/Section.vue";
import { generateRow, generateSection } from "@/utils/sampleData";
import type { CanvasEntity } from "@/types/CanvasType";

const props = defineProps<{
  canvas: CanvasEntity;
}>();

const sections = ref(props.canvas.children);

watch(
  () => props.canvas,
  (value) => {
    sections.value = value.children;
  }
);

const addSection = () => {
  sections.value.push(generateSection());
};

const addRow = (payload: { sectionId: string }) => {
  const section = sections.value.find((item) => item.id === payload.sectionId);
  if (!section) return;
  section.children.push(generateRow());
};
</script>

<template>
  <div class="w-full h-full flex flex-col p-2">
    <Section
      v-for="section in sections"
      :key="section.id"
      :section="section"
      @add-section="addSection"
      @add-row="addRow"
    />
  </div>
</template>

<style scoped></style>
