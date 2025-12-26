<script setup lang="ts">
const emit = defineEmits<{ (e: 'click', type: string): void }>();
const tools = [
  { icon: "i-lucide-move-vertical", color: "text-white", type: "move" },
  { icon: "i-lucide-cog", color: "text-white", type: "settings" },
  { icon: "i-lucide-copy", color: "text-white", type: "copy" },
  { icon: "i-lucide-trash-2", color: "text-white", type: "delete" },
];
</script>

<template>
  <div class="bg-primary w-42.5 h-9 shadow-xl flex items-center gap-4">
    <UButton
      v-for="(t, i) in tools"
      :key="i"
      :icon="t.icon"
      size="sm"
      variant="ghost"
      class="text-white"
      @click="emit('click', t.type)"
    />
  </div>
</template>
