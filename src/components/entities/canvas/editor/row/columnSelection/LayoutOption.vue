<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  number: number;
  active: boolean;
  bars: 1 | 2 | 3 | 4 | 5 | 6;
}>();

const emit = defineEmits<{ (e: "click", number: number): void }>();

const barClass = computed(() => {
  switch (props.bars) {
    case 1:
      return "w-[16px]";
    case 2:
      return "w-[7px]";
    case 3:
      return "w-[4px]";
    case 4:
      return "w-[3px]";
    case 5:
      return "w-[2px]";
    case 6:
      return "w-[2px]";
  }
});
</script>

<template>
  <UButton
    size="md"
    color="primary"
    variant="ghost"
    class="flex justify-center w-9"
    @click="emit('click', number)"
  >
    <div class="flex items-center gap-px">
      <div
        v-for="bar in props.bars"
        :key="bar"
        :class="['h-4', barClass, props.active ? 'bg-blue-500' : 'bg-gray-400']"
      />
    </div>
  </UButton>
</template>
