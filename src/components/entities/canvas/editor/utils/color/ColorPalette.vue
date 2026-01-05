<script setup lang="ts">
import { computed, ref, watch } from "vue";
import AlphaSlider from "./AlphaSlider.vue";
type Mode = "light" | "dark";
type Model = { light: string; dark: string; mode?: Mode };
const colorVal = ref("#00C16A");
const props = withDefaults(
  defineProps<{
    modelValue: Model;
    groups?: Record<string, string[]>;
  }>(),
  {
    groups: () => ({
      Neutrals: [
        "#FFFFFF",
        "#F3F4F6",
        "#E5E7EB",
        "#9CA3AF",
        "#374151",
        "#111827",
        "#000000",
      ],
      Blues: ["#EFF6FF", "#DBEAFE", "#93C5FD", "#3B82F6", "#1D4ED8", "#0B2F6B"],
      Greens: [
        "#ECFDF5",
        "#D1FAE5",
        "#6EE7B7",
        "#10B981",
        "#047857",
        "#064E3B",
      ],
    }),
  }
);

const emit = defineEmits<{ (e: "update:modelValue", v: Model): void }>();

/** ---------- color utils ---------- */
type RGBA = { r: number; g: number; b: number; a: number };
type HSVA = { h: number; s: number; v: number; a: number };

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

function hexToRgba(hex: string): RGBA {
  const raw = hex.replace("#", "").trim();
  const isShort = raw.length === 3 || raw.length === 4;
  const full = isShort
    ? raw
        .split("")
        .map((c) => c + c)
        .join("")
    : raw;

  const hasAlpha = full.length === 8;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const a = hasAlpha ? parseInt(full.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

function rgbaToHex({ r, g, b, a }: RGBA, includeAlpha = false) {
  const to2 = (x: number) =>
    clamp(Math.round(x), 0, 255).toString(16).padStart(2, "0").toUpperCase();
  const rr = to2(r),
    gg = to2(g),
    bb = to2(b);
  if (!includeAlpha) return `#${rr}${gg}${bb}`;
  const aa = to2(a * 255);
  return `#${rr}${gg}${bb}${aa}`;
}

function rgbToHsva({ r, g, b, a }: RGBA): HSVA {
  const rr = r / 255,
    gg = g / 255,
    bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === rr) h = ((gg - bb) / d) % 6;
    else if (max === gg) h = (bb - rr) / d + 2;
    else h = (rr - gg) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : d / max;
  const v = max;
  return { h, s, v, a };
}

function hsvaToRgb({ h, s, v, a }: HSVA): RGBA {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let rr = 0,
    gg = 0,
    bb = 0;
  if (0 <= h && h < 60) {
    rr = c;
    gg = x;
    bb = 0;
  } else if (60 <= h && h < 120) {
    rr = x;
    gg = c;
    bb = 0;
  } else if (120 <= h && h < 180) {
    rr = 0;
    gg = c;
    bb = x;
  } else if (180 <= h && h < 240) {
    rr = 0;
    gg = x;
    bb = c;
  } else if (240 <= h && h < 300) {
    rr = x;
    gg = 0;
    bb = c;
  } else {
    rr = c;
    gg = 0;
    bb = x;
  }

  return { r: (rr + m) * 255, g: (gg + m) * 255, b: (bb + m) * 255, a };
}

/** ---------- mode + model ---------- */
const tabs = [
  { label: "Light", value: "light", slot: "light" },
  { label: "Dark", value: "dark", slot: "dark" },
];

const activeMode = ref<Mode>(props.modelValue.mode ?? "light");
watch(
  () => props.modelValue.mode,
  (m) => {
    if (m) activeMode.value = m;
  }
);

function getHexForMode(mode: Mode) {
  return mode === "light" ? props.modelValue.light : props.modelValue.dark;
}
function setHexForMode(mode: Mode, hex: string) {
  emit("update:modelValue", {
    ...props.modelValue,
    mode: activeMode.value,
    light: mode === "light" ? hex : props.modelValue.light,
    dark: mode === "dark" ? hex : props.modelValue.dark,
  });
}

/** ---------- picker state ---------- */
const hsva = ref<HSVA>({ h: 210, s: 0.9, v: 0.9, a: 1 });
const hexInput = ref("#1181F8");
const alphaPct = ref(100);

function syncFromModel() {
  const hex = getHexForMode(activeMode.value) || "#1181F8";
  const rgba = hexToRgba(hex);
  hsva.value = rgbToHsva(rgba);
  hexInput.value = rgbaToHex(rgba, false);
  colorVal.value = hexInput.value;
  alphaPct.value = Math.round(hsva.value.a * 100);
}

watch(
  () => props.modelValue.light,
  () => {
    if (activeMode.value === "light") syncFromModel();
  }
);
watch(
  () => props.modelValue.dark,
  () => {
    if (activeMode.value === "dark") syncFromModel();
  }
);
watch(activeMode, () => syncFromModel(), { immediate: true });

function commitHsva() {
  const rgba = hsvaToRgb(hsva.value);
  const hex = rgbaToHex(rgba, hsva.value.a < 1); // include alpha only if needed
  setHexForMode(activeMode.value, hex);
  hexInput.value = rgbaToHex(rgba, false);
  colorVal.value = hexInput.value;
  alphaPct.value = Math.round(hsva.value.a * 100);
}

function setHue(h: number) {
  hsva.value.h = (h + 360) % 360;
  commitHsva();
}
function setSV(s: number, v: number) {
  hsva.value.s = clamp(s, 0, 1);
  hsva.value.v = clamp(v, 0, 1);
  commitHsva();
}
function setAlpha(a: number) {
  hsva.value.a = clamp(a, 0, 1);
  commitHsva();
}

/** ---------- derived colors ---------- */
const hueHex = computed(() =>
  rgbaToHex(hsvaToRgb({ h: hsva.value.h, s: 1, v: 1, a: 1 }), false)
);
const rgbaNow = computed(() => hsvaToRgb(hsva.value));
const solidHexNow = computed(() =>
  rgbaToHex({ ...rgbaNow.value, a: 1 }, false)
);

/** ---------- palettes ---------- */
const groupName = ref(Object.keys(props.groups)[0] ?? "Neutrals");
const groupColors = computed(() => props.groups[groupName.value] ?? []);
const quickSwatches = computed(() => groupColors.value.slice(0, 4));

function pickSwatch(hex: string) {
  const rgba = hexToRgba(hex);
  hsva.value = rgbToHsva(rgba);
  commitHsva();
}

/** ---------- inputs ---------- */
function tryApplyHex(raw: string, commit: boolean) {
  const cleaned = raw.trim();
  const ok = /^#?[0-9A-Fa-f]{3,4}$/.test(cleaned) || /^#?[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(cleaned);
  if (!ok) {
    if (commit) syncFromModel();
    return;
  }

  const hex = cleaned.startsWith("#") ? cleaned : `#${cleaned}`;
  const rgba = hexToRgba(hex);
  hsva.value = rgbToHsva(rgba);
  commitHsva();
}

function onHexTyping(event: Event) {
  const target = event.target as HTMLInputElement | null;
  const next = target?.value ?? colorVal.value;
  console.log('typing->', next)
  tryApplyHex(next, false);
}

function onHexCommit(event?: FocusEvent | KeyboardEvent) {
  const target = event?.target as HTMLInputElement | null;
  const next = (target?.value ?? colorVal.value).trim();
  tryApplyHex(next, true);
}

function onAlphaCommit() {
  alphaPct.value = clamp(alphaPct.value, 0, 100);
  setAlpha(alphaPct.value / 100);
}
</script>

<template>
  <UCard class="w-50" :ui="{ body: 'sm:p-2 p-0' }">
    <template #default>
      <UTabs
        v-model="activeMode"
        size="sm"
        :items="tabs"
        variant="link"
        :ui="{
          list: 'border-b border-gray-200 p-0',
          trigger: 'font-semibold',
          indicator: 'bg-blue-500',
        }"
      >
        <template #light>
          <!-- <GradientButtonGroup @selected-gradient="" /> -->
        </template>
        <template #dark>
          <!-- <GradientButtonGroup @selected-gradient="" /> -->
        </template>
      </UTabs>

      <UColorPicker v-model="colorVal" />

      <!-- <div class="px-1 pt-1">
        <SvSquare
          :hue-hex="hueHex"
          :s="hsva.s"
          :v="hsva.v"
          @update:sv="({ s, v }) => setSV(s, v)"
        />
      </div>

      <div class="px-1 pt-1">
        <HueSlider :h="hsva.h" @update:h="setHue" />
      </div> -->

      <div class="px-1 pt-1">
        <AlphaSlider
          :alpha="hsva.a"
          :solid-hex="solidHexNow"
          @update:alpha="setAlpha"
        />
      </div>

      <div class="flex justify-between pt-2">
        <UInput
          v-model="colorVal"
          size="sm"
          color="neutral"
          variant="outline"
          class="flex-1 mr-2"
          type="text"
          disabled
          @input="onHexTyping"
          @blur="onHexCommit"
          @keydown.enter.prevent="onHexCommit"
        />
        <UInput
          v-model.number="alphaPct"
          type="number"
          trailing-icon="lucide:eye"
          size="sm"
          color="neutral"
          variant="outline"
          class="flex-1"
          @blur="onAlphaCommit"
          @keydown.enter.prevent="onAlphaCommit"
        />
      </div>
    </template>
  </UCard>
</template>
