<script setup lang="ts">
import type { ColumnEntity } from "@/types/CanvasType";
import ColumnRow from "./ColumnRow.vue";

const props = defineProps<{
  colData: ColumnEntity;
}>();
</script>

<template>
  <div class="flex flex-col w-full min-w-0">
    <ColumnRow v-for="row in props.colData.children" :key="row.id" :data="row" />
  </div>
</template>
