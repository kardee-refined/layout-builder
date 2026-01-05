<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import type { ColumnRowEntity } from "@/types/CanvasType";

const props = defineProps<{
  data: ColumnRowEntity;
  inlineButtonEditing?: boolean;
  inlineButtonText?: string;
}>();

const emit = defineEmits<{
  (e: "update:inline-button-text", value: string): void;
  (e: "finish:inline-button-edit"): void;
}>();

const textValue = computed(() => {
  return (
    props.data.props?.text ??
    props.data.props?.title ??
    props.data.component ??
    props.data.type
  );
});

const textStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.data.props?.color) style.color = props.data.props.color;
  if (props.data.props?.fontSize)
    style.fontSize = `${props.data.props.fontSize}px`;
  if (props.data.props?.bold) style.fontWeight = "700";
  if (props.data.props?.italic) style.fontStyle = "italic";
  if (props.data.props?.underline) style.textDecoration = "underline";
  return style;
});

const componentType = computed(() => {
  return (props.data.component ?? "").toLowerCase();
});

const isImage = computed(() => componentType.value === "image");
const isVideo = computed(() => componentType.value === "video");
const isButton = computed(() => componentType.value === "button");
const isSpacer = computed(() => componentType.value === "spacer");
const isDivider = computed(() => componentType.value === "divider");
const isIcon = computed(() => componentType.value === "icon");
const isHero = computed(() => componentType.value === "hero");
const isGallery = computed(() => componentType.value === "gallery");
const isCarousel = computed(() => componentType.value === "carousel");
const isCard = computed(() => componentType.value === "card");
const isSocial = computed(() => componentType.value === "social");
const isEmbed = computed(() => componentType.value === "embed");
const isIframe = computed(() => componentType.value === "iframe");

const imageStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.data.props?.width) style.width = `${props.data.props.width}px`;
  if (props.data.props?.height) style.height = `${props.data.props.height}px`;
  style.maxWidth = "100%";
  if (props.data.props?.radius)
    style.borderRadius = `${props.data.props.radius}px`;
  if (props.data.props?.fit) style.objectFit = props.data.props.fit;
  return style;
});

const videoStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.data.props?.width) style.width = `${props.data.props.width}px`;
  if (props.data.props?.height) style.height = `${props.data.props.height}px`;
  style.maxWidth = "100%";
  return style;
});

const buttonStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.data.props?.bg) style.backgroundColor = props.data.props.bg;
  if (props.data.props?.color) style.color = props.data.props.color;
  if (props.data.props?.radius)
    style.borderRadius = `${props.data.props.radius}px`;
  if (props.data.props?.borderColor)
    style.borderColor = props.data.props.borderColor;
  if (props.data.props?.borderWidth)
    style.borderWidth = `${props.data.props.borderWidth}px`;
  if (props.data.props?.padding) style.padding = props.data.props.padding;
  return style;
});

const buttonVariant = computed(() => props.data.props?.variant ?? "solid");
const buttonSize = computed(() => props.data.props?.size ?? "md");
const buttonLabel = computed(() => props.data.props?.text || "Button");
const buttonHref = computed(() => props.data.props?.href || "#");

const spacerStyle = computed(() => {
  const style: Record<string, string> = {};
  style.height = `${props.data.props?.height ?? 24}px`;
  return style;
});

const dividerStyle = computed(() => {
  const style: Record<string, string> = {};
  style.borderTopWidth = `${props.data.props?.thickness ?? 1}px`;
  style.borderTopColor = props.data.props?.color ?? "#E5E7EB";
  style.borderTopStyle = "solid";
  return style;
});

const iconStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.data.props?.size) style.fontSize = `${props.data.props.size}px`;
  if (props.data.props?.color) style.color = props.data.props.color;
  return style;
});

const heroStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.data.props?.background)
    style.backgroundColor = props.data.props.background;
  return style;
});

const inlineButtonLocal = ref(props.inlineButtonText ?? buttonLabel.value);
const inlineInputRef = ref<HTMLInputElement | null>(null);

watch(
  () => props.inlineButtonText,
  (value) => {
    if (typeof value === "string") {
      inlineButtonLocal.value = value;
    }
  }
);

watch(
  () => buttonLabel.value,
  (value) => {
    if (!props.inlineButtonEditing) {
      inlineButtonLocal.value = value;
    }
  }
);

watch(
  () => props.inlineButtonEditing,
  (value) => {
    if (value) {
      nextTick(() => {
        inlineInputRef.value?.focus();
        inlineInputRef.value?.select();
      });
    }
  }
);

const handleInlineInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  inlineButtonLocal.value = target.value;
  emit("update:inline-button-text", target.value);
};

const finishInlineEdit = () => {
  emit("finish:inline-button-edit");
};

const alignValue = computed(() => props.data.props?.align ?? "left");

const alignStyle = computed(() => ({
  textAlign: alignValue.value as "left" | "center" | "right",
}));

const alignFlexStyle = computed(() => {
  const justify =
    alignValue.value === "center"
      ? "center"
      : alignValue.value === "right"
      ? "flex-end"
      : "flex-start";
  return {
    display: "flex",
    justifyContent: justify,
  };
});
</script>

<template>
  <div v-if="isImage" class="w-full" :style="alignFlexStyle">
    <img
      v-if="props.data.props?.src"
      :src="props.data.props.src"
      :alt="props.data.props?.alt"
      class="block max-w-full"
      :style="imageStyle"
    />
    <div
      v-else
      class="flex h-40 w-full items-center justify-center rounded-md border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
    >
      Add image URL
    </div>
  </div>
  <div v-else-if="isVideo" class="w-full" :style="alignFlexStyle">
    <video
      v-if="props.data.props?.src"
      :src="props.data.props.src"
      controls
      class="block max-w-full rounded-md"
      :style="videoStyle"
    />
    <div
      v-else
      class="flex h-32 w-full items-center justify-center rounded-md border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
    >
      Add video URL
    </div>
  </div>
  <div v-else-if="isButton" class="w-full" :style="alignFlexStyle">
    <div class="relative inline-flex">
      <UButton v-bind="data.props">
        <span v-if="!props.inlineButtonEditing">
          {{ buttonLabel }}
        </span>

        <span
          v-else
          ref="inlineInputRef"
          contenteditable
          spellcheck="false"
          class="inline-block whitespace-nowrap outline-none focus:outline-none text-center focus:ring-0"
          @keydown="handleInlineInput"
          @blur="finishInlineEdit"
          @keydown.enter.prevent="finishInlineEdit"
          @click.stop
        >
          {{ buttonLabel }}
        </span>
      </UButton>
    </div>
  </div>
  <div v-else-if="isSpacer" :style="spacerStyle" />
  <div v-else-if="isDivider" class="w-full" :style="dividerStyle" />
  <div v-else-if="isIcon" class="w-full" :style="alignFlexStyle">
    <div class="inline-flex items-center" :style="iconStyle">
      <UIcon :name="props.data.props?.name || 'lucide:star'" />
    </div>
  </div>
  <div
    v-else-if="isHero"
    class="w-full rounded-lg p-4 text-white"
    :style="{ ...heroStyle, ...alignStyle }"
  >
    <div class="flex flex-col gap-3">
      <div class="text-xl font-semibold">
        {{ props.data.props?.title || "Hero headline" }}
      </div>
      <div class="text-sm text-white/80">
        {{ props.data.props?.subtitle || "Short supporting line goes here." }}
      </div>
      <a
        :href="props.data.props?.buttonUrl || '#'"
        class="inline-flex w-fit items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900"
      >
        {{ props.data.props?.buttonText || "Get Started" }}
      </a>
      <img
        v-if="props.data.props?.imageSrc"
        :src="props.data.props.imageSrc"
        alt="Hero image"
        class="mt-2 w-full rounded-md object-cover"
      />
    </div>
  </div>
  <div v-else-if="isGallery" class="grid grid-cols-2 gap-2" :style="alignStyle">
    <img
      v-for="(src, index) in props.data.props?.images || []"
      :key="`${src}-${index}`"
      :src="src"
      alt="Gallery image"
      class="h-24 w-full rounded-md object-cover"
    />
    <div
      v-if="!props.data.props?.images?.length"
      class="flex h-24 w-full items-center justify-center rounded-md border border-dashed border-slate-300 text-xs text-slate-500"
    >
      Add gallery images
    </div>
  </div>
  <div
    v-else-if="isCarousel"
    class="flex gap-2 overflow-x-auto"
    :style="alignStyle"
  >
    <img
      v-for="(src, index) in props.data.props?.images || []"
      :key="`${src}-${index}`"
      :src="src"
      alt="Carousel"
      class="h-24 w-40 shrink-0 rounded-md object-cover"
    />
    <div
      v-if="!props.data.props?.images?.length"
      class="flex h-24 w-40 shrink-0 items-center justify-center rounded-md border border-dashed border-slate-300 text-xs text-slate-500"
    >
      Add carousel images
    </div>
  </div>
  <div
    v-else-if="isCard"
    class="rounded-lg border border-slate-200 p-4 shadow-sm"
    :style="alignStyle"
  >
    <div class="text-base font-semibold text-slate-900">
      {{ props.data.props?.title || "Card title" }}
    </div>
    <div class="mt-2 text-sm text-slate-600">
      {{ props.data.props?.body || "Card description goes here." }}
    </div>
    <a
      class="mt-3 inline-flex text-sm font-semibold text-blue-600"
      :href="props.data.props?.buttonUrl || '#'"
    >
      {{ props.data.props?.buttonText || "Learn more" }}
    </a>
  </div>
  <div v-else-if="isSocial" class="w-full" :style="alignFlexStyle">
    <div class="inline-flex items-center gap-2 text-sm text-slate-700">
      <UIcon name="lucide:share-2" />
      <a :href="props.data.props?.url || '#'" class="underline">
        {{ props.data.props?.platform || "Social" }}
      </a>
    </div>
  </div>
  <div
    v-else-if="isEmbed"
    class="rounded-md border border-dashed border-slate-300 p-3 text-xs text-slate-600"
    :style="alignStyle"
  >
    <pre
      class="whitespace-pre-wrap"
    >{{ props.data.props?.html || "<div>Embed code</div>" }}</pre>
  </div>
  <div v-else-if="isIframe" class="w-full" :style="alignFlexStyle">
    <iframe
      v-if="props.data.props?.src"
      :src="props.data.props.src"
      :width="props.data.props?.width || 560"
      :height="props.data.props?.height || 315"
      class="w-full rounded-md border border-slate-200"
      title="Embedded frame"
    />
    <div
      v-else
      class="flex h-32 w-full items-center justify-center rounded-md border border-dashed border-slate-300 text-sm text-slate-500"
    >
      Add iframe URL
    </div>
  </div>
  <div
    v-else
    class="text-sm text-slate-900 dark:text-slate-100"
    :style="{ ...textStyle, ...alignStyle }"
  >
    {{ textValue }}
  </div>
</template>
