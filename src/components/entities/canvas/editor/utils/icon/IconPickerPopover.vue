<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { LUCIDE_ICONS } from "../lucide-icons";

type Position = "leading" | "trailing";

const props = withDefaults(
  defineProps<{
    modelValue: string | null;
    position?: Position;
    icons?: string[];
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    position: "leading",
    placeholder: "Search icons…",
    disabled: false,
    icons: () => LUCIDE_ICONS,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", v: string | null): void;
  (e: "update:position", v: Position): void;
}>();

const open = ref(false);
const q = ref("");

watch(open, (v) => {
  if (v) q.value = "";
});

/**
 * PERF:
 * - If no query: show only first N
 * - If query: filter and cap to avoid rendering 1000+ icons
 */
const filtered = computed(() => {
  const query = q.value.trim().toLowerCase();

  if (!query) return props.icons.slice(0, 240);

  return props.icons
    .filter((i) => i.toLowerCase().includes(query))
    .slice(0, 600);
});

function pick(icon: string) {
  emit("update:modelValue", icon);
  open.value = false;
}

function clear() {
  emit("update:modelValue", null);
}
</script>

<template>
  <div class="w-[320px] max-h-[70vh] overflow-hidden">
    <!-- header -->
    <div class="p-3 border-b border-gray-200 flex items-center gap-2">
      <UInput
        v-model="q"
        size="sm"
        color="neutral"
        variant="outline"
        :placeholder="placeholder"
        class="flex-1"
      />
      <UButton
        v-if="modelValue"
        size="sm"
        color="neutral"
        variant="ghost"
        icon="lucide:x"
        @click="clear"
      />
    </div>

    <!-- position toggle -->
    <div class="px-3 pt-3">
      <UFieldGroup>
        <UButton
          label="Left"
          size="sm"
          variant="ghost"
          :class="position === 'leading' ? 'ring-1 ring-blue-500' : ''"
          @click="emit('update:position', 'leading')"
        />
        <UButton
          label="Right"
          size="sm"
          variant="ghost"
          :class="position === 'trailing' ? 'ring-1 ring-blue-500' : ''"
          @click="emit('update:position', 'trailing')"
        />
      </UFieldGroup>
    </div>

    <!-- grid -->
    <div class="p-3 pt-3">
      <div
        v-if="filtered.length === 0"
        class="text-sm text-gray-500 py-6 text-center"
      >
        No icons found
      </div>

      <!-- scroll container -->
      <div
        v-else
        class="max-h-64 overflow-y-auto pr-1 overscroll-contain"
      >
        <div class="grid grid-cols-8 gap-2">
          <UButton
            v-for="icon in filtered"
            :key="icon"
            type="button"
            variant="ghost"
            size="sm"
            class="flex items-center justify-center"
            :class="icon === modelValue ? 'ring-2 ring-blue-500' : ''"
            @click="pick(icon)"
            :title="icon"
            :icon="icon"
          />
        </div>
      </div>

      <!-- optional: hint when capped -->
      <div
        v-if="q.trim() === '' && props.icons.length > 240"
        class="mt-2 text-xs text-gray-500"
      >
        Showing first 240 icons. Search to find more.
      </div>
    </div>
  </div>
</template>
