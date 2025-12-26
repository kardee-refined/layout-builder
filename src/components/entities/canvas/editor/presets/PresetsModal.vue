<script setup lang="ts">
import type { EmailPreset } from "./emailPresets";

const props = defineProps<{
  presets: EmailPreset[];
  onSelect: (presetId: string) => void;
}>();

const close = () => {
  console.log("Close");
};

const handleSelect = (presetId: string) => {
  props.onSelect(presetId);
  close();
};

const emit = defineEmits<{ close: [boolean] }>();
</script>

<template>
  <UModal :close="{ onClick: () => emit('close', false) }">
    <template #default>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold text-slate-900 dark:text-slate-100"
            >
              Email Presets
            </h3>
            <UButton
              size="xs"
              variant="ghost"
              color="neutral"
              icon="lucide:x"
              @click="close"
            />
          </div>
        </template>
        <div class="grid gap-3 sm:grid-cols-2">
          <UCard
            v-for="preset in props.presets"
            :key="preset.id"
            class="border border-slate-200 dark:border-slate-800"
          >
            <template #header>
              <div
                class="text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                {{ preset.name }}
              </div>
            </template>
            <div class="text-sm text-slate-600 dark:text-slate-300">
              {{ preset.description }}
            </div>
            <template #footer>
              <UButton
                size="sm"
                color="primary"
                variant="soft"
                label="Use preset"
                @click="handleSelect(preset.id)"
              />
            </template>
          </UCard>
        </div>
      </UCard>
    </template>
  </UModal>
</template>
