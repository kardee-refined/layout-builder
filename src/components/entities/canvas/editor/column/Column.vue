<script setup lang="ts">
import type { ColumnEntity } from "@/types/CanvasType";
import ColumnRow from "./ColumnRow.vue";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps<{
  colData: ColumnEntity;
  rowHover: boolean;
}>();

type SidebarItem = { id: string; icon: any; bg: string; title: string };

const emit = defineEmits<{
  (
    e: "reorder",
    payload: {
      sourceRowId: string;
      sourceColumnId: string;
      targetRowId?: string;
      targetColumnId: string;
      edge: "top" | "bottom";
    }
  ): void;
  (
    e: "insert",
    payload: {
      targetRowId?: string;
      targetColumnId: string;
      edge: "top" | "bottom";
      item: SidebarItem;
    }
  ): void;
  (e: "edit-state", payload: { isEditing: boolean }): void;
}>();

const el = ref<HTMLElement | null>(null);
const isOver = ref(false);
const edge = ref<"top" | "bottom" | null>(null);

let cleanup: (() => void) | null = null;

onMounted(() => {
  if (!el.value) return;

  cleanup = dropTargetForElements({
    element: el.value,

    canDrop: ({ source }) =>
      source.data?.type === "column_row" || source.data?.type === "sidebar_item",

    getData: ({ input }) => {
      // attach "top/bottom" based on pointer position inside this row element
      return attachClosestEdge(
        {
          type: "column_target",
          columnId: props.colData.id,
        },
        { element: el.value!, input, allowedEdges: ["top", "bottom"] }
      );
    },

    onDragEnter: ({ self }) => {
      isOver.value = true;
      edge.value = extractClosestEdge(self.data) as "top" | "bottom" | null;
    },

    onDrag: ({ self }) => {
      edge.value = extractClosestEdge(self.data) as "top" | "bottom" | null;
    },

    onDragLeave: () => {
      isOver.value = false;
      edge.value = null;
    },

    onDrop: ({ source, self }) => {
      isOver.value = false;

      const targetColumnId = self.data?.columnId as string | undefined;

      const closest = extractClosestEdge(self.data) as "top" | "bottom" | null;
      edge.value = null;

      if (!targetColumnId || !closest) return;

      if (source.data?.type === "column_row") {
        const sourceRowId = source.data?.rowId as string | undefined;
        const sourceColumnId = source.data?.columnId as string | undefined;
        if (!sourceRowId || !sourceColumnId) return;

        emit("reorder", {
          sourceRowId,
          sourceColumnId,
          targetColumnId,
          edge: closest,
        });
        return;
      }

      if (source.data?.type === "sidebar_item") {
        const item = source.data?.item as SidebarItem | undefined;
        if (!item) return;

        emit("insert", {
          targetColumnId,
          edge: closest,
          item,
        });
      }
    },
  });
});

onBeforeUnmount(() => {
  cleanup?.();
  cleanup = null;
});
</script>

<template>
  <div
    ref="el"
    class="relative flex flex-col w-full min-w-0"
    :style="{ outline: rowHover ? '1px dotted var(--border)' : 'none' }"
  >
    <div
      v-if="isOver && colData.children.length === 0"
      class="absolute inset-0 rounded-md bg-blue-500/10"
    />
    <div
      v-if="isOver && edge === 'top'"
      class="absolute left-0 right-0 -top-px h-0.5 bg-blue-500"
    />
    <div
      v-if="isOver && edge === 'bottom'"
      class="absolute left-0 right-0 -bottom-px h-0.5 bg-blue-500"
    />
    <ColumnRow
      v-for="row in colData.children"
      :key="row.id"
      :data="row"
      :columnId="colData.id"
      @reorder="emit('reorder', $event)"
      @insert="emit('insert', $event)"
      @edit-state="emit('edit-state', $event)"
    />
  </div>
</template>
