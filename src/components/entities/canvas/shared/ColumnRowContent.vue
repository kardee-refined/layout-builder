<script setup lang="ts">
import { computed } from "vue";
import type { ColumnRowEntity } from "@/types/CanvasType";

const props = defineProps<{
  data: ColumnRowEntity;
}>();

const textValue = computed(() => {
  return (
    props.data.props?.text ??
    props.data.props?.title ??
    props.data.component ??
    props.data.type
  );
});

const textStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.data.props?.color) style.color = props.data.props.color;
  if (props.data.props?.fontSize)
    style.fontSize = `${props.data.props.fontSize}px`;
  if (props.data.props?.bold) style.fontWeight = "700";
  if (props.data.props?.italic) style.fontStyle = "italic";
  if (props.data.props?.underline) style.textDecoration = "underline";
  return style;
});
</script>

<template>
  <div class="text-sm text-slate-900 dark:text-slate-100" :style="textStyle">
    {{ textValue }}
  </div>
</template>
