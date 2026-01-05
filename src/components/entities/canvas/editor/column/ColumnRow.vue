<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from "vue";
import type { ColumnRowEntity } from "@/types/CanvasType";

import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";

import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import ColumnRowContent from "@/components/entities/canvas/shared/ColumnRowContent.vue";
import ColumnRowEditorPopover from "./ColumnRowEditorPopover.vue";

const props = defineProps<{
  data: ColumnRowEntity;
  columnId: string;
}>();

console.log("ColumnRow props:", props.data, props.columnId);
type SidebarItem = { id: string; icon: any; bg: string; title: string };

const emit = defineEmits<{
  (e: "reorder", payload: {
    sourceRowId: string;
    sourceColumnId: string;
    targetRowId?: string;
    targetColumnId: string;
    edge: "top" | "bottom";
  }): void;
  (e: "insert", payload: {
    targetRowId?: string;
    targetColumnId: string;
    edge: "top" | "bottom";
    item: SidebarItem;
  }): void;
  (e: "edit-state", payload: { isEditing: boolean }): void;
  (e: "duplicate", payload: { rowId: string; columnId: string }): void;
  (e: "delete", payload: { rowId: string; columnId: string }): void;
}>();

const el = ref<HTMLElement | null>(null);
const isOver = ref(false);
const edge = ref<"top" | "bottom" | null>(null);
const isEditing = ref(false);
const localText = ref(props.data.props?.text ?? "");

const componentType = computed(() => {
  return (props.data.component ?? "").toLowerCase();
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

const alignStyle = computed(() => ({
  textAlign: (props.data.props?.align ?? "left") as
    | "left"
    | "center"
    | "right",
}));

const applyTextUpdates = () => {
  if (!props.data.props) props.data.props = {};
  props.data.props.text = localText.value;
};

const inlineButtonEditing = ref(false);
const inlineButtonText = ref(props.data.props?.text ?? "Button");

const applyInlineButtonText = (value: string) => {
  inlineButtonText.value = value;
  if (!props.data.props) props.data.props = {};
  props.data.props.text = value;
};

const startInlineButtonEdit = () => {
  inlineButtonText.value = props.data.props?.text ?? "Button";
  inlineButtonEditing.value = true;
};

const finishInlineButtonEdit = () => {
  inlineButtonEditing.value = false;
};

const onTextInput = (event: Event) => {
  localText.value = (event.target as HTMLElement).innerText;
  applyTextUpdates();
};

watch(
  () => props.data.props?.text,
  (value) => {
    if (typeof value === "string") {
      localText.value = value;
      inlineButtonText.value = value;
    }
  }
);

watch(isEditing, (value) => {
  emit("edit-state", { isEditing: value });
  if (!value) {
    focusField.value = null;
  }
});

const focusField = ref<string | null>(null);

const handleDoubleClick = () => {
  if (componentType.value === "button") {
    focusField.value = "buttonText";
    startInlineButtonEdit();
  } else {
    focusField.value = null;
  }
  isEditing.value = true;
};

let cleanup: (() => void) | null = null;

onMounted(() => {
  if (!el.value) return;

  cleanup = combine(
    draggable({
      element: el.value,
      getInitialData: () => ({
        type: "column_row",
        rowId: props.data.id,
        columnId: props.columnId,
      }),
    }),

    dropTargetForElements({
      element: el.value,

      canDrop: ({ source }) =>
        source.data?.type === "column_row" || source.data?.type === "sidebar_item",

      getData: ({ input }) => {
        // attach "top/bottom" based on pointer position inside this row element
        return attachClosestEdge(
          { type: "column_row_target", rowId: props.data.id, columnId: props.columnId },
          { element: el.value!, input, allowedEdges: ["top", "bottom"] }
        );
      },

      onDragEnter: ({ self, source }) => {
        // don’t show indicator when hovering on itself
        if (source.data?.type === "column_row" && source.data?.rowId === props.data.id) return;
        isOver.value = true;
        edge.value = extractClosestEdge(self.data) as "top" | "bottom" | null;
      },

      onDrag: ({ self, source }) => {
        if (source.data?.type === "column_row" && source.data?.rowId === props.data.id) return;
        edge.value = extractClosestEdge(self.data) as "top" | "bottom" | null;
      },

      onDragLeave: () => {
        isOver.value = false;
        edge.value = null;
      },

      onDrop: ({ source, self }) => {
        isOver.value = false;

        const closest = extractClosestEdge(self.data) as "top" | "bottom" | null;
        edge.value = null;

        if (!closest) return;

        const targetRowId = self.data?.rowId as string | undefined;
        const targetColumnId = self.data?.columnId as string | undefined;
        if (!targetColumnId) return;

        if (source.data?.type === "column_row") {
          const sourceRowId = source.data?.rowId as string | undefined;
          const sourceColumnId = source.data?.columnId as string | undefined;

          if (!sourceRowId || !sourceColumnId) return;
          if (sourceRowId === targetRowId && sourceColumnId === targetColumnId) return;

          emit("reorder", {
            sourceRowId,
            sourceColumnId,
            targetRowId,
            targetColumnId,
            edge: closest,
          });
          return;
        }

        if (source.data?.type === "sidebar_item") {
          const item = source.data?.item as SidebarItem | undefined;
          if (!item) return;

          emit("insert", {
            targetRowId,
            targetColumnId,
            edge: closest,
            item,
          });
        }
      },
    })
  );
});

onBeforeUnmount(() => {
  cleanup?.();
  cleanup = null;
});
</script>

<template>
  <div ref="el" class="relative flex flex-col min-w-0 whitespace-normal break-all py-2 text-black dark:text-slate-200">
    <div
      v-if="isOver && edge === 'top'"
      class="absolute left-0 right-0 -top-px h-0.5 bg-blue-500"
    />
    <div
      v-if="isOver && edge === 'bottom'"
      class="absolute left-0 right-0 -bottom-px h-0.5 bg-blue-500"
    />
    <ColumnRowEditorPopover
      v-model:open="isEditing"
      :type="componentType"
      :data="data"
      :focus-field="focusField"
      @duplicate="emit('duplicate', { rowId: data.id, columnId: props.columnId })"
      @delete="emit('delete', { rowId: data.id, columnId: props.columnId })"
    >
      <div
        v-if="componentType === 'text'"
        class="cursor-text"
        contenteditable="true"
        spellcheck="false"
        :style="{ ...textStyle, ...alignStyle }"
        @click.stop="isEditing = true"
        @focus="isEditing = true"
        @input="onTextInput"
      >
        {{ localText }}
      </div>
        <div
          v-else
          class="cursor-pointer"
          role="button"
          tabindex="0"
          :aria-label="`Edit ${componentType || 'component'}`"
          @click.stop="isEditing = true"
          @dblclick.stop="handleDoubleClick"
          @keydown.enter.prevent="isEditing = true"
          @keydown.space.prevent="isEditing = true"
        >
          <ColumnRowContent
            :data="data"
            :inline-button-editing="inlineButtonEditing"
            :inline-button-text="inlineButtonText"
            @update:inline-button-text="applyInlineButtonText"
            @finish:inline-button-edit="finishInlineButtonEdit"
          />
        </div>
    </ColumnRowEditorPopover>
  </div>
</template>
