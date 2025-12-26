<script setup lang="ts">
const options = [
  { value: 1, bars: 1, hasSub: false },
  { value: 2, bars: 2, hasSub: true },
  { value: 3, bars: 3, hasSub: true },
  { value: 4, bars: 4, hasSub: true },
  { value: 5, bars: 5, hasSub: false },
  { value: 6, bars: 6, hasSub: false },
] as const;

const emit = defineEmits<{ (e: "columnLayoutChange", number: number): void }>();

</script>

<template>
  <div class="flex justify-center items-center w-55 h-8">
    <template v-for="opt in options" :key="opt.value">
      <LayoutOption 
        :number="opt.value" 
        :active="false" 
        :bars="opt.bars"
        @click="emit('columnLayoutChange', opt.value)"
      />
    </template>
  </div>
</template>
