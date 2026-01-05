<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import Logo from "../../../assets/Logo.vue";
import { emailPresets } from "../canvas/editor/presets/emailPresets";

const PresetsModal = defineAsyncComponent(
  () => import("../canvas/editor/presets/PresetsModal.vue")
);

const overlay = useOverlay();
const modal = overlay.create(PresetsModal);

const props = defineProps<{
  isPublished: boolean;
  showPresets?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle-publish"): void;
  (e: "preset-select", presetId: string): void;
  (e: "undo"): void;
  (e: "redo"): void;
}>();

const publishLabel = computed(() => (props.isPublished ? "Edit" : "Publish"));

function open() {
  try {
    modal.open({
      presets: emailPresets,
      onSelect: (presetId: string) => {
        emit("preset-select", presetId);
        modal.close();
      },
    });
  } catch (error) {
    console.error("Error opening modal:", error);
  }
}
</script>

<template>
  <UHeader>
    <template #title #left>
      <Logo class="h-6 w-auto" />
    </template>

    <template #right>
      <UColorModeButton />
      <USeparator orientation="vertical" class="h-8" />
      <UButton
        icon="lucide:monitor"
        variant="ghost"
        color="neutral"
        size="md"
      />
      <UButton
        v-if="props.showPresets !== false"
        icon="lucide:layout-template"
        variant="ghost"
        color="neutral"
        size="md"
        @click="open"
      />
      <USeparator orientation="vertical" class="h-8" />
      <template v-if="!props.isPublished">
        <UButton
          icon="lucide:undo-2"
          variant="ghost"
          color="neutral"
          size="md"
          :disabled="!props.canUndo"
          @click="emit('undo')"
        />
        <UButton
          icon="lucide:redo-2"
          variant="ghost"
          color="neutral"
          size="md"
          :disabled="!props.canRedo"
          @click="emit('redo')"
        />
        <USeparator orientation="vertical" class="h-8" />
      </template>

      <UButton variant="soft" color="neutral" size="md"> Cancel </UButton>
      <div
        class="inline-flex w-fit -space-x-px rounded-md shadow-xs rtl:space-x-reverse"
      >
        <UButton
          size="md"
          :label="publishLabel"
          class="rounded-none rounded-l-md shadow-none focus-visible:z-10 border-r-2 border-secondary"
          @click="emit('toggle-publish')"
        />
        <UButton
          size="md"
          icon="lucide:heart"
          color="primary"
          variant="solid"
          class="rounded-none bg-primary flex items-center rounded-r-md text-sm font-medium"
        />
      </div>
    </template>
  </UHeader>
</template>
