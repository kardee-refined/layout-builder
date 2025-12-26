<script setup lang="ts">
import Logo from "@/assets/Logo.vue";
import { computed } from "vue";
import PresetsModal from "../canvas/editor/presets/PresetsModal.vue";
import { emailPresets } from "../canvas/editor/presets/emailPresets";

const overlay = useOverlay();

const modal = overlay.create(PresetsModal);

async function open() {
  console.log("Open Presets Modal");
  try {
      const instance = modal.open({
    presets: emailPresets,
    onSelect: (presetId: string) => {
      console.log("Selected Preset:", presetId);
    },
  });

  const shouldIncrement = await instance.result;

  console.log("Modal closed", shouldIncrement);
  if (shouldIncrement) {
    console.log("User selected a preset and confirmed.");
  } else {
    console.log("User closed the modal without selecting a preset.");
  }
  } catch (error) {
    console.error("Error opening modal:", error);
  }

}

const props = defineProps<{
  isPublished: boolean;
  showPresets?: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle-publish"): void;
  (e: "open-presets"): void;
}>();

const publishLabel = computed(() => (props.isPublished ? "Edit" : "Publish"));
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
      <UButton icon="lucide:undo-2" variant="ghost" color="neutral" size="md" />
      <UButton icon="lucide:redo-2" variant="ghost" color="neutral" size="md" />
      <USeparator orientation="vertical" class="h-8" />

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
