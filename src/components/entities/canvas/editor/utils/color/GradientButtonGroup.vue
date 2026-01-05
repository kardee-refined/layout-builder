<script setup lang="ts">
import { ref } from "vue";

const buttonGroup = ref([
  {
    tooltipText: "Solid Color",
  },
  {
    tooltipText: "Linear Gradient",
  },
  {
    tooltipText: "Radial Gradient",
  },
  {
    tooltipText: "Conic Gradient",
  },
]);
const emit = defineEmits<{
  (e: "selected-gradient", type: string): void;
}>();
</script>
<template>
  <UFieldGroup class="bg-secondary p-1 w-full flex rounded-md">
    <template v-for="value in buttonGroup">
      <UTooltip :text="value.tooltipText">
        <UButton
          icon="lucide:circle"
          variant="ghost"
          class="flex-1 place-content-center rounded-md"
          size="xs"
          @click="emit('selected-gradient', value.tooltipText)"
        />
      </UTooltip>
    </template>
  </UFieldGroup>
</template>
