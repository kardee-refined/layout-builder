<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue";
import type { ColumnRowEntity } from "@/types/CanvasType";
import { ButtonPopOverProps } from "./column-row/ButtonPopoverProps.vue";

const props = defineProps<{
  type: string;
  data: ColumnRowEntity;
  open: boolean;
  focusField?: string | null;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "duplicate"): void;
  (e: "delete"): void;
}>();

const open = computed({
  get: () => props.open,
  set: (value: boolean) => emit("update:open", value),
});

const localColor = ref(props.data.props?.color ?? "#000000");
const localSize = ref<number>(props.data.props?.fontSize ?? 16);

const localImageSrc = ref(props.data.props?.src ?? "");
const localImageAlt = ref(props.data.props?.alt ?? "");
const localImageWidth = ref<number>(props.data.props?.width ?? 320);
const localImageHeight = ref<number>(props.data.props?.height ?? 180);
const localImageRadius = ref<number>(props.data.props?.radius ?? 12);
const localImageFit = ref<string>(props.data.props?.fit ?? "cover");

const localVideoSrc = ref(props.data.props?.src ?? "");
const localVideoWidth = ref<number>(props.data.props?.width ?? 480);
const localVideoHeight = ref<number>(props.data.props?.height ?? 270);

const localButtonText = ref(props.data.props?.text ?? "Button");
const localButtonUrl = ref(props.data.props?.href ?? "");
const localButtonBg = ref(props.data.props?.bg ?? "#2563EB");
const localButtonColor = ref(props.data.props?.color ?? "#FFFFFF");
const localButtonRadius = ref<number>(props.data.props?.radius ?? 8);
const buttonTextInput = ref<HTMLInputElement | null>(null);

const localSpacerHeight = ref<number>(props.data.props?.height ?? 24);

const localDividerColor = ref(props.data.props?.color ?? "#E5E7EB");
const localDividerThickness = ref<number>(props.data.props?.thickness ?? 1);

const localIconName = ref(props.data.props?.name ?? "lucide:star");
const localIconSize = ref<number>(props.data.props?.size ?? 24);
const localIconColor = ref(props.data.props?.color ?? "#111827");
const localAlign = ref(props.data.props?.align ?? "left");

const localGalleryImages = ref((props.data.props?.images || []).join(", "));
const localCarouselImages = ref((props.data.props?.images || []).join(", "));

const localCardTitle = ref(props.data.props?.title ?? "Card title");
const localCardBody = ref(
  props.data.props?.body ?? "Card description goes here."
);
const localCardButtonText = ref(props.data.props?.buttonText ?? "Learn more");
const localCardButtonUrl = ref(props.data.props?.buttonUrl ?? "");

const localSocialPlatform = ref(props.data.props?.platform ?? "LinkedIn");
const localSocialUrl = ref(props.data.props?.url ?? "");

const localEmbedHtml = ref(props.data.props?.html ?? "<div>Embed code</div>");

const localIframeSrc = ref(props.data.props?.src ?? "");
const localIframeWidth = ref<number>(props.data.props?.width ?? 560);
const localIframeHeight = ref<number>(props.data.props?.height ?? 315);

const localHeroTitle = ref(props.data.props?.title ?? "Hero headline");
const localHeroSubtitle = ref(
  props.data.props?.subtitle ?? "Short supporting line goes here."
);
const localHeroButton = ref(props.data.props?.buttonText ?? "Get Started");
const localHeroButtonUrl = ref(props.data.props?.buttonUrl ?? "");
const localHeroImage = ref(props.data.props?.imageSrc ?? "");
const localHeroBg = ref(props.data.props?.background ?? "#0F172A");

const ensureProps = () => {
  if (!props.data.props) props.data.props = {};
};

const applyTextUpdates = () => {
  ensureProps();
  props.data.props.color = localColor.value;
  props.data.props.fontSize = localSize.value;
};

const applyAlignUpdates = () => {
  ensureProps();
  props.data.props.align = localAlign.value;
};

const cycleAlign = () => {
  localAlign.value =
    localAlign.value === "left"
      ? "center"
      : localAlign.value === "center"
      ? "right"
      : "left";
  applyAlignUpdates();
};

const alignIcon = computed(() => {
  return localAlign.value === "left"
    ? "lucide:align-left"
    : localAlign.value === "center"
    ? "lucide:align-center"
    : "lucide:align-right";
});

const toggleStyle = (key: "bold" | "italic" | "underline") => {
  ensureProps();
  props.data.props[key] = !props.data.props[key];
};

const applyImageUpdates = () => {
  ensureProps();
  props.data.props.src = localImageSrc.value;
  props.data.props.alt = localImageAlt.value;
  props.data.props.width = localImageWidth.value;
  props.data.props.height = localImageHeight.value;
  props.data.props.radius = localImageRadius.value;
  props.data.props.fit = localImageFit.value;
};

const applyVideoUpdates = () => {
  ensureProps();
  props.data.props.src = localVideoSrc.value;
  props.data.props.width = localVideoWidth.value;
  props.data.props.height = localVideoHeight.value;
};

const applyButtonUpdates = (payload: ButtonPopOverProps) => {
  ensureProps();
  console.log("payload =>", payload);
  //right now only the border radius is set in the class
  props.data.props.class = payload.class;
  props.data.props.href = payload.link.href;
  props.data.props.align = payload.alignment;
  // props.data.props.color = payload.colors.light;
  props.data.props.size = payload.size;
  props.data.props.variant = payload.variant;
};

const applyButtonLabel = () => {
  ensureProps();
  props.data.props.text = localButtonText.value;
};

const applyButtonLink = () => {
  ensureProps();
  props.data.props.href = localButtonUrl.value;
};

const applyButtonAppearanceUpdates = () => {
  ensureProps();
  props.data.props.bg = localButtonBg.value;
  props.data.props.color = localButtonColor.value;
  props.data.props.radius = localButtonRadius.value;
};

const applySpacerUpdates = () => {
  ensureProps();
  props.data.props.height = localSpacerHeight.value;
};

const applyDividerUpdates = () => {
  ensureProps();
  props.data.props.color = localDividerColor.value;
  props.data.props.thickness = localDividerThickness.value;
};

const applyIconUpdates = () => {
  ensureProps();
  props.data.props.name = localIconName.value;
  props.data.props.size = localIconSize.value;
  props.data.props.color = localIconColor.value;
};

const applyGalleryUpdates = () => {
  ensureProps();
  props.data.props.images = localGalleryImages.value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const applyCarouselUpdates = () => {
  ensureProps();
  props.data.props.images = localCarouselImages.value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const applyCardUpdates = () => {
  ensureProps();
  props.data.props.title = localCardTitle.value;
  props.data.props.body = localCardBody.value;
  props.data.props.buttonText = localCardButtonText.value;
  props.data.props.buttonUrl = localCardButtonUrl.value;
};

const applySocialUpdates = () => {
  ensureProps();
  props.data.props.platform = localSocialPlatform.value;
  props.data.props.url = localSocialUrl.value;
};

const applyEmbedUpdates = () => {
  ensureProps();
  props.data.props.html = localEmbedHtml.value;
};

const applyIframeUpdates = () => {
  ensureProps();
  props.data.props.src = localIframeSrc.value;
  props.data.props.width = localIframeWidth.value;
  props.data.props.height = localIframeHeight.value;
};

const applyHeroUpdates = () => {
  ensureProps();
  props.data.props.title = localHeroTitle.value;
  props.data.props.subtitle = localHeroSubtitle.value;
  props.data.props.buttonText = localHeroButton.value;
  props.data.props.buttonUrl = localHeroButtonUrl.value;
  props.data.props.imageSrc = localHeroImage.value;
  props.data.props.background = localHeroBg.value;
};

watch(
  () => props.data.props,
  (value) => {
    if (!value) return;
    if (typeof value.color === "string") localColor.value = value.color;
    if (typeof value.fontSize === "number") localSize.value = value.fontSize;
    if (typeof value.align === "string") localAlign.value = value.align;
    if (typeof value.src === "string") {
      localImageSrc.value = value.src;
      localVideoSrc.value = value.src;
      localIframeSrc.value = value.src;
    }
    if (typeof value.alt === "string") localImageAlt.value = value.alt;
    if (typeof value.width === "number") {
      localImageWidth.value = value.width;
      localVideoWidth.value = value.width;
      localIframeWidth.value = value.width;
    }
    if (typeof value.height === "number") {
      localImageHeight.value = value.height;
      localVideoHeight.value = value.height;
      localSpacerHeight.value = value.height;
      localIframeHeight.value = value.height;
    }
    if (typeof value.radius === "number") localImageRadius.value = value.radius;
    if (typeof value.fit === "string") localImageFit.value = value.fit;
    if (typeof value.text === "string") localButtonText.value = value.text;
    if (typeof value.href === "string") localButtonUrl.value = value.href;
    if (typeof value.bg === "string") localButtonBg.value = value.bg;
    if (typeof value.name === "string") localIconName.value = value.name;
    if (typeof value.size === "number") localIconSize.value = value.size;
    if (Array.isArray(value.images)) {
      localGalleryImages.value = value.images.join(", ");
      localCarouselImages.value = value.images.join(", ");
    }
    if (typeof value.body === "string") localCardBody.value = value.body;
    if (typeof value.buttonText === "string")
      localCardButtonText.value = value.buttonText;
    if (typeof value.buttonUrl === "string")
      localCardButtonUrl.value = value.buttonUrl;
    if (typeof value.platform === "string")
      localSocialPlatform.value = value.platform;
    if (typeof value.url === "string") localSocialUrl.value = value.url;
    if (typeof value.html === "string") localEmbedHtml.value = value.html;
    if (typeof value.title === "string") localHeroTitle.value = value.title;
    if (typeof value.subtitle === "string")
      localHeroSubtitle.value = value.subtitle;
    if (typeof value.buttonText === "string")
      localHeroButton.value = value.buttonText;
    if (typeof value.buttonUrl === "string")
      localHeroButtonUrl.value = value.buttonUrl;
    if (typeof value.imageSrc === "string")
      localHeroImage.value = value.imageSrc;
    if (typeof value.background === "string")
      localHeroBg.value = value.background;
  },
  { deep: true }
);

watch(
  () => props.focusField,
  (value) => {
    if (value === "buttonText") {
      nextTick(() => {
        if (open.value) {
          buttonTextInput.value?.focus();
        }
      });
    }
  }
);
</script>

<template>
  <UPopover v-model:open="open" :content="{ side: 'top' }">
    <template #anchor>
      <slot />
    </template>
    <template #content>
      <div class="flex flex-col gap-2 p-2 min-w-max">
        <template v-if="type === 'text'">
          <div class="flex items-center gap-2">
            <UButton
              size="xs"
              variant="ghost"
              color="neutral"
              :class="data.props?.bold ? 'bg-black/10 dark:bg-white/10' : ''"
              label="B"
              @click="toggleStyle('bold')"
            />
            <UButton
              size="xs"
              variant="soft"
              color="neutral"
              :class="data.props?.italic ? 'bg-black/10 dark:bg-white/10' : ''"
              label="I"
              @click="toggleStyle('italic')"
            />
            <UButton
              size="xs"
              variant="soft"
              color="neutral"
              :class="
                data.props?.underline ? 'bg-black/10 dark:bg-white/10' : ''
              "
              label="U"
              @click="toggleStyle('underline')"
            />
            <UInput
              v-model="localColor"
              type="color"
              size="xs"
              class="w-16"
              @change="applyTextUpdates"
            />
            <UInput
              v-model.number="localSize"
              type="number"
              size="xs"
              class="w-20"
              @change="applyTextUpdates"
            />
          </div>
        </template>

        <template v-else-if="type === 'image'">
          <UInput
            v-model="localImageSrc"
            size="xs"
            placeholder="Image URL"
            aria-label="Image URL"
            @change="applyImageUpdates"
          />
          <UInput
            v-model="localImageAlt"
            size="xs"
            placeholder="Alt text"
            aria-label="Alt text"
            @change="applyImageUpdates"
          />
          <div class="flex items-center gap-2">
            <UInput
              v-model.number="localImageWidth"
              type="number"
              size="xs"
              class="w-24"
              placeholder="Width"
              @change="applyImageUpdates"
            />
            <UInput
              v-model.number="localImageHeight"
              type="number"
              size="xs"
              class="w-24"
              placeholder="Height"
              @change="applyImageUpdates"
            />
          </div>
          <div class="flex items-center gap-2">
            <UInput
              v-model.number="localImageRadius"
              type="number"
              size="xs"
              class="w-24"
              placeholder="Radius"
              @change="applyImageUpdates"
            />
            <USelect
              v-model="localImageFit"
              size="xs"
              :options="['cover', 'contain', 'fill', 'none', 'scale-down']"
              @change="applyImageUpdates"
            />
          </div>
        </template>

        <template v-else-if="type === 'video'">
          <UInput
            v-model="localVideoSrc"
            size="xs"
            placeholder="Video URL"
            @change="applyVideoUpdates"
          />
          <div class="flex items-center gap-2">
            <UInput
              v-model.number="localVideoWidth"
              type="number"
              size="xs"
              class="w-24"
              placeholder="Width"
              @change="applyVideoUpdates"
            />
            <UInput
              v-model.number="localVideoHeight"
              type="number"
              size="xs"
              class="w-24"
              placeholder="Height"
              @change="applyVideoUpdates"
            />
          </div>
        </template>

        <template v-else-if="type === 'button'">
          <ButtonPopoverProps
            @updated-button-props="applyButtonUpdates"
            @duplicate="emit('duplicate')"
            @delete="emit('delete')"
          />
        </template>

        <template v-else-if="type === 'spacer'">
          <UInput
            v-model.number="localSpacerHeight"
            type="number"
            size="xs"
            placeholder="Height"
            @change="applySpacerUpdates"
          />
        </template>

        <template v-else-if="type === 'divider'">
          <div class="flex items-center gap-2">
            <UInput
              v-model="localDividerColor"
              type="color"
              size="xs"
              class="w-16"
              @change="applyDividerUpdates"
            />
            <UInput
              v-model.number="localDividerThickness"
              type="number"
              size="xs"
              class="w-20"
              placeholder="Thickness"
              @change="applyDividerUpdates"
            />
          </div>
        </template>

        <template v-else-if="type === 'icon'">
          <UInput
            v-model="localIconName"
            size="xs"
            placeholder="Icon name"
            @change="applyIconUpdates"
          />
          <div class="flex items-center gap-2">
            <UInput
              v-model.number="localIconSize"
              type="number"
              size="xs"
              class="w-20"
              placeholder="Size"
              @change="applyIconUpdates"
            />
            <UInput
              v-model="localIconColor"
              type="color"
              size="xs"
              class="w-16"
              @change="applyIconUpdates"
            />
          </div>
        </template>

        <template v-else-if="type === 'gallery'">
          <UInput
            v-model="localGalleryImages"
            size="xs"
            placeholder="Image URLs (comma separated)"
            @change="applyGalleryUpdates"
          />
        </template>

        <template v-else-if="type === 'carousel'">
          <UInput
            v-model="localCarouselImages"
            size="xs"
            placeholder="Image URLs (comma separated)"
            @change="applyCarouselUpdates"
          />
        </template>

        <template v-else-if="type === 'card'">
          <UInput
            v-model="localCardTitle"
            size="xs"
            placeholder="Card title"
            @change="applyCardUpdates"
          />
          <UInput
            v-model="localCardBody"
            size="xs"
            placeholder="Card body"
            @change="applyCardUpdates"
          />
          <UInput
            v-model="localCardButtonText"
            size="xs"
            placeholder="Button text"
            @change="applyCardUpdates"
          />
          <UInput
            v-model="localCardButtonUrl"
            size="xs"
            placeholder="Button URL"
            @change="applyCardUpdates"
          />
        </template>

        <template v-else-if="type === 'social'">
          <UInput
            v-model="localSocialPlatform"
            size="xs"
            placeholder="Platform"
            @change="applySocialUpdates"
          />
          <UInput
            v-model="localSocialUrl"
            size="xs"
            placeholder="URL"
            @change="applySocialUpdates"
          />
        </template>

        <template v-else-if="type === 'embed'">
          <UInput
            v-model="localEmbedHtml"
            size="xs"
            placeholder="Embed HTML"
            @change="applyEmbedUpdates"
          />
        </template>

        <template v-else-if="type === 'iframe'">
          <UInput
            v-model="localIframeSrc"
            size="xs"
            placeholder="Iframe URL"
            @change="applyIframeUpdates"
          />
          <div class="flex items-center gap-2">
            <UInput
              v-model.number="localIframeWidth"
              type="number"
              size="xs"
              class="w-24"
              placeholder="Width"
              @change="applyIframeUpdates"
            />
            <UInput
              v-model.number="localIframeHeight"
              type="number"
              size="xs"
              class="w-24"
              placeholder="Height"
              @change="applyIframeUpdates"
            />
          </div>
        </template>

        <template v-else-if="type === 'hero'">
          <UInput
            v-model="localHeroTitle"
            size="xs"
            placeholder="Headline"
            @change="applyHeroUpdates"
          />
          <UInput
            v-model="localHeroSubtitle"
            size="xs"
            placeholder="Subtitle"
            @change="applyHeroUpdates"
          />
          <UInput
            v-model="localHeroButton"
            size="xs"
            placeholder="Button text"
            @change="applyHeroUpdates"
          />
          <UInput
            v-model="localHeroButtonUrl"
            size="xs"
            placeholder="Button URL"
            @change="applyHeroUpdates"
          />
          <UInput
            v-model="localHeroImage"
            size="xs"
            placeholder="Image URL"
            @change="applyHeroUpdates"
          />
          <UInput
            v-model="localHeroBg"
            type="color"
            size="xs"
            class="w-16"
            @change="applyHeroUpdates"
          />
        </template>
      </div>

      <!-- <div class="flex items-center gap-2">
        <UButton
          size="xs"
          variant="soft"
          color="neutral"
          :icon="alignIcon"
          aria-label="Cycle alignment"
          @click="cycleAlign"
        />
      </div> -->
    </template>
  </UPopover>
</template>
