<script setup lang="ts">
import { computed, ref } from "vue";
import type {
  ColumnEntity,
  ColumnRowEntity,
  RowEntity,
} from "@/types/CanvasType";
import { STRUCTURE_ENTITY } from "@/types/CanvasType";
import { nanoid } from "nanoid";
import Column from "@/components/entities/canvas/editor/column/Column.vue";
import RowLeftPanel from "./RowLeftPanel.vue";
import ColumnResizer from "@/components/entities/canvas/editor/column/ColumnResizer.vue";
import LayoutPicker from "@/components/entities/canvas/editor/row/columnSelection/LayoutPicker.vue";

const isHover = ref(false);
const isEditing = ref(false);
const isPointerInside = ref(false);
const columnSpacing = ref(0);

let closeTimer: number | null = null;

const open = () => {
  if (closeTimer) window.clearTimeout(closeTimer);
  closeTimer = null;
  isHover.value = true;
};

const scheduleClose = () => {
  if (closeTimer) window.clearTimeout(closeTimer);
  closeTimer = window.setTimeout(() => {
    if (!isEditing.value && !isPointerInside.value) {
      isHover.value = false;
    }
    closeTimer = null;
  }, 120);
};

const props = defineProps<{
  rowdata: RowEntity;
}>();

const columnsToShow = ref<number>(props.rowdata.children.length);

const handlePointerDown = (event: PointerEvent) => {
  event.preventDefault();
  const startX = event.clientX;
  const startSpacing = columnSpacing.value;
  (event.target as HTMLElement).setPointerCapture(event.pointerId);

  const handlePointerMove = (moveEvent: PointerEvent) => {
    const deltaX = moveEvent.clientX - startX;
    let next = startSpacing + Math.round(deltaX / 5) * 5;
    next = Math.max(0, Math.min(100, next));

    if (next !== columnSpacing.value) {
      columnSpacing.value = next;
    }
  };

  const handlePointerUp = () => {
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
  };

  document.addEventListener("pointermove", handlePointerMove);
  document.addEventListener("pointerup", handlePointerUp);
};

type SidebarItem = { id: string; icon: any; bg: string; title: string };

function findColumnById(row: RowEntity, columnId: string) {
  return row.children.find((col) => col.id === columnId) ?? null;
}

function moveColumnRow(
  row: RowEntity,
  payload: {
    sourceRowId: string;
    sourceColumnId: string;
    targetRowId?: string;
    targetColumnId: string;
    edge: "top" | "bottom";
  }
) {
  const sourceCol = findColumnById(row, payload.sourceColumnId);
  const targetCol = findColumnById(row, payload.targetColumnId);
  if (!sourceCol || !targetCol) return;

  const sourceIndex = sourceCol.children.findIndex(
    (r: any) => r.id === payload.sourceRowId
  );
  if (sourceIndex < 0) return;

  let insertAt = 0;
  if (payload.targetRowId) {
    const targetIndexRaw = targetCol.children.findIndex(
      (r: any) => r.id === payload.targetRowId
    );
    if (targetIndexRaw < 0) return;

    insertAt = payload.edge === "bottom" ? targetIndexRaw + 1 : targetIndexRaw;
  } else {
    insertAt = payload.edge === "top" ? 0 : targetCol.children.length;
  }

  if (sourceCol === targetCol && sourceIndex < insertAt) {
    insertAt -= 1;
  }

  if (sourceCol === targetCol && sourceIndex === insertAt) return;

  const [moved] = sourceCol.children.splice(sourceIndex, 1);
  targetCol.children.splice(insertAt, 0, moved);
}

function insertColumnRow(
  row: RowEntity,
  payload: {
    targetRowId?: string;
    targetColumnId: string;
    edge: "top" | "bottom";
    item: SidebarItem;
  }
) {
  const targetCol = findColumnById(row, payload.targetColumnId);
  if (!targetCol) return;

  const componentType = (payload.item.type ?? payload.item.title).toLowerCase();
  const baseProps =
    componentType === "text"
      ? {
          title: payload.item.title,
          text: payload.item.title,
          icon: payload.item.icon,
          bg: payload.item.bg,
          color: "#000000",
          fontSize: 16,
          bold: false,
          italic: false,
          underline: false,
          align: "left",
        }
      : componentType === "image"
      ? {
          title: payload.item.title,
          src: "",
          alt: "Image",
          width: 320,
          height: 180,
          radius: 12,
          fit: "cover",
          align: "left",
        }
      : componentType === "video"
      ? {
          title: payload.item.title,
          src: "",
          width: 480,
          height: 270,
          align: "left",
        }
      : componentType === "button"
      ? {
          title: payload.item.title,
          text: "Button",
          href: "#",
          bg: "#2563EB",
          color: "#FFFFFF",
          radius: 8,
          align: "left",
        }
      : componentType === "spacer"
      ? {
          title: payload.item.title,
          height: 24,
          align: "left",
        }
      : componentType === "divider"
      ? {
          title: payload.item.title,
          color: "#E5E7EB",
          thickness: 1,
          align: "left",
        }
      : componentType === "icon"
      ? {
          title: payload.item.title,
          name: "lucide:star",
          size: 24,
          color: "#111827",
          align: "left",
        }
      : componentType === "hero"
      ? {
          title: "Hero headline",
          subtitle: "Short supporting line goes here.",
          buttonText: "Get Started",
          buttonUrl: "#",
          imageSrc: "",
          background: "#0F172A",
          align: "left",
        }
      : componentType === "gallery"
      ? {
          title: "Gallery",
          images: [],
          align: "left",
        }
      : componentType === "carousel"
      ? {
          title: "Carousel",
          images: [],
          align: "left",
        }
      : componentType === "card"
      ? {
          title: "Card title",
          body: "Card description goes here.",
          buttonText: "Learn more",
          buttonUrl: "#",
          align: "left",
        }
      : componentType === "social"
      ? {
          title: "Social",
          platform: "LinkedIn",
          url: "https://linkedin.com",
          align: "left",
        }
      : componentType === "embed"
      ? {
          title: "Embed",
          html: "<div>Embed code</div>",
          align: "left",
        }
      : componentType === "iframe"
      ? {
          title: "Iframe",
          src: "https://example.com",
          width: 560,
          height: 315,
          align: "left",
        }
      : {
          title: payload.item.title,
          text: payload.item.title,
          icon: payload.item.icon,
          bg: payload.item.bg,
          color: "#000000",
          fontSize: 16,
          bold: false,
          italic: false,
          underline: false,
          align: "left",
        };

  const newRow: ColumnRowEntity = {
    id: nanoid(),
    type: STRUCTURE_ENTITY.COLUMN_ROW,
    component: componentType,
    props: {
      ...baseProps,
      ...(payload.item.props ?? {}),
    },
  };

  let insertAt = 0;
  if (payload.targetRowId) {
    const targetIndexRaw = targetCol.children.findIndex(
      (r: any) => r.id === payload.targetRowId
    );
    if (targetIndexRaw < 0) return;
    insertAt = payload.edge === "bottom" ? targetIndexRaw + 1 : targetIndexRaw;
  } else {
    insertAt = payload.edge === "top" ? 0 : targetCol.children.length;
  }

  targetCol.children.splice(insertAt, 0, newRow);
}

function duplicateColumnRow(
  row: RowEntity,
  payload: { rowId: string; columnId: string }
) {
  const column = findColumnById(row, payload.columnId);
  if (!column) return;
  const index = column.children.findIndex((child) => child.id === payload.rowId);
  if (index < 0) return;

  const source = column.children[index];
  const clone = JSON.parse(JSON.stringify(source)) as ColumnRowEntity;
  clone.id = nanoid();

  column.children.splice(index + 1, 0, clone);
}

function deleteColumnRow(row: RowEntity, payload: { rowId: string; columnId: string }) {
  const column = findColumnById(row, payload.columnId);
  if (!column) return;
  const index = column.children.findIndex((child) => child.id === payload.rowId);
  if (index < 0) return;
  column.children.splice(index, 1);
}

const handleColumnLayoutChange = (numColumns: number) => {
  console.log("handleColumnShange =>", numColumns);
  columnsToShow.value = numColumns;
  
};

const columns = computed<ColumnEntity[]>(() => {
  const columns = props.rowdata.children.filter(
    (_col: ColumnEntity, index: number) => index < columnsToShow.value
  );
  console.log(columns);

  return columns;
});

const rowPanelClick = (type: string) => {
  console.log("Row panel clicked:", type);
};

const handleMouseEnter = () => {
  isPointerInside.value = true;
  open();
};

const handleMouseLeave = () => {
  isPointerInside.value = false;
  scheduleClose();
};

const handleEditState = (payload: { isEditing: boolean }) => {
  isEditing.value = payload.isEditing;
  if (payload.isEditing) {
    isHover.value = false;
    return;
  }
  if (!isPointerInside.value) {
    isHover.value = false;
  }
};
</script>

<template>
  <UPopover
    v-model:open="isHover"
    :dismissible="false"
    :content="{ side: 'top' }"
  >
    <template #anchor>
      <div
        class="relative w-full h-full min-h-50 flex"
        :class="{
          'p-2 border-2 border-blue-400': isHover,
          'p-2.5': !isHover,
        }"
        :style="{ gap: `${columnSpacing / 2}px` }"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <RowLeftPanel
          v-if="isHover"
          class="absolute -top-9 -left-0.5"
          @click="rowPanelClick"
        />
        <template v-for="(column, index) in columns" :key="column.id">
          <div class="flex flex-1 min-w-0">
            <Column
              :colData="column"
              :rowHover="isHover"
              @reorder="(p) => moveColumnRow(rowdata, p)"
              @insert="(p) => insertColumnRow(rowdata, p)"
              @edit-state="handleEditState"
              @duplicate="(p) => duplicateColumnRow(rowdata, p)"
              @delete="(p) => deleteColumnRow(rowdata, p)"
            />
          </div>
          <div
            v-if="index < columns.length - 1"
            class="flex justify-center items-center relative"
          >
            <ColumnResizer
              class="absolute"
              :visible="isHover"
              @pointerdown="handlePointerDown"
            />
          </div>
        </template>
      </div>
    </template>

    <template #content>
      <div @mouseenter="open" @mouseleave="scheduleClose">
        <LayoutPicker @columnLayoutChange="handleColumnLayoutChange" />
      </div>
    </template>
  </UPopover>
</template>
