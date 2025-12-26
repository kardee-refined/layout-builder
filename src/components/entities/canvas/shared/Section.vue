<script setup lang="ts">
import type { SectionEntity } from "@/types/CanvasType";
import Row from "./Row.vue";

const props = defineProps<{
  section: SectionEntity;
}>();
</script>

<template>
  <section class="py-6 bg-secondary text-white rounded-lg">
    <div class="h-20"></div>
    <Row v-for="row in props.section.children" :key="row.id" :rowdata="row" />
    <div class="h-20"></div>
  </section>
</template>
