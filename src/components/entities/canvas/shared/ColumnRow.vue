<script setup lang="ts">
import type { ColumnRowEntity } from "@/types/CanvasType";
import ColumnRowContent from "@/components/entities/canvas/shared/ColumnRowContent.vue";

const props = defineProps<{
  data: ColumnRowEntity;
}>();
</script>

<template>
  <div class="flex flex-col min-w-0 whitespace-normal break-all py-2 text-black dark:text-slate-200">
    <ColumnRowContent :data="props.data" />
  </div>
</template>
