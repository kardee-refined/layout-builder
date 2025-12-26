<script setup lang="ts">
import { computed } from "vue";
import type { ColumnEntity, RowEntity } from "@/types/CanvasType";
import Column from "./Column.vue";

const props = defineProps<{
  rowdata: RowEntity;
}>();

const columns = computed<ColumnEntity[]>(() => {
  const maxColumns =
    props.rowdata.settings?.numOfColumns ?? props.rowdata.children.length;
  return props.rowdata.children.filter(
    (_col: ColumnEntity, index: number) => index < maxColumns
  );
});

const columnGap = computed(() => props.rowdata.settings?.gap ?? 0);
</script>

<template>
  <div
    class="relative w-full h-full min-h-50 flex"
    :style="{ gap: `${columnGap}px` }"
  >
    <div v-for="column in columns" :key="column.id" class="flex flex-1 min-w-0">
      <Column :colData="column" />
    </div>
  </div>
</template>
