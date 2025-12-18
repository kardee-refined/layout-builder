<script setup lang="ts">
import type { ColumnRowEntity } from "@/types/CanvasType";

defineProps<{
  data: ColumnRowEntity;
}>();
</script>

<template>
<div class="flex flex-col min-w-0">
  <span class="wrap-break-word">
    {{ data.type }}
  </span>
</div></template>
