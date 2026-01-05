<script setup lang="ts">
withDefaults(
  defineProps<{
    showDuplicate?: boolean;
    showDelete?: boolean;
  }>(),
  {
    showDuplicate: true,
    showDelete: true,
  }
);

const emit = defineEmits<{
  (e: "duplicate"): void;
  (e: "delete"): void;
}>();
</script>

<template>
  <div class="flex items-center gap-px">
    <template v-if="showDuplicate">
      <UTooltip text="Duplicate">
        <UButton
          icon="lucide:copy"
          variant="ghost"
          size="sm"
          @click.stop="emit('duplicate')"
        />
      </UTooltip>
    </template>

    <template v-if="showDelete">
      <UTooltip text="Delete">
        <UButton
          icon="lucide:trash"
          variant="ghost"
          size="sm"
          @click.stop="emit('delete')"
        />
      </UTooltip>
    </template>
  </div>
</template>
