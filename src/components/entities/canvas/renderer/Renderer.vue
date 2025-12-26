<script setup lang="ts">
import { computed } from "vue";
import type { CanvasEntity } from "@/types/CanvasType";
import { generateAppData } from "@/utils/sampleData";
import Section from "@/components/entities/canvas/shared/Section.vue";

const props = defineProps<{
  canvas?: CanvasEntity;
}>();

const data = computed(() => props.canvas ?? generateAppData());
const sections = computed(() => data.value.children ?? []);

console.log("Renderer Canvas Data:", data);
</script>

<template>
  <div class="w-full h-full flex flex-col p-2">
    <Section v-for="section in sections" :key="section.id" :section="section" />
  </div>
</template>
