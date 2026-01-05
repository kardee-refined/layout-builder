<template>
  <div class="flex items-center gap-px">
    <UTooltip text="Button Shape">
      <UButton
        variant="ghost"
        size="sm"
        :icon="buttonBorderRadiusIcon"
        @click="onButtonRadiusChange"
      />
    </UTooltip>

    <USeparator orientation="vertical" class="h-6 mx-1" />

    <UTooltip text="Button Sizes">
      <UFieldGroup>
        <UButton
          label="S"
          variant="ghost"
          size="sm"
          data-size="S"
          @click="onSizeButtonClicked"
        />
        <UButton
          label="M"
          variant="ghost"
          size="sm"
          data-size="M"
          @click="onSizeButtonClicked"
        />
        <UButton
          label="L"
          variant="ghost"
          size="sm"
          data-size="L"
          @click="onSizeButtonClicked"
        />
      </UFieldGroup>
    </UTooltip>

    <USeparator orientation="vertical" class="h-6 mx-1" />

    <UTooltip text="Minimum width">
      <UFieldGroup>
        <UInput
          color="neutral"
          variant="outline"
          placeholder="auto"
          class="max-w-12"
        />
        <UButton
          color="neutral"
          variant="subtle"
          icon="lucide:move-horizontal"
        />
      </UFieldGroup>
    </UTooltip>

    <UTooltip text="Alignment">
      <UButton
        :icon="alignIcon"
        variant="ghost"
        size="sm"
        @click="onAligmentChange"
      />
    </UTooltip>

    <USeparator orientation="vertical" class="h-6 mx-1" />

    <UPopover>
      <UTooltip text="Colours">
        <UButton icon="lucide:paint-bucket" variant="ghost" size="sm" />
      </UTooltip>
      <template #content>
        <ColorPalette v-model="colors" />
      </template>
    </UPopover>

    <UTooltip text="Icons">
      <UPopover>
        <UButton icon="lucide:smile" variant="ghost" size="sm" />
        <template #content>
          <IconPickerPopover v-model="buttonIcon" v-model:position="iconPos" />
        </template>
      </UPopover>
    </UTooltip>

    <UTooltip text="Links and Actions">
      <UButton icon="lucide:link" variant="ghost" size="sm" />
    </UTooltip>

    <USeparator orientation="vertical" class="h-6 mx-1" />

    <PopoverActions @duplicate="emit('duplicate')" @delete="emit('delete')" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type {
  ButtonPopOverProps,
  ComponentAlignment,
} from "../../../../../../types/ComponentType";
import IconPickerPopover from "../../utils/icon/IconPickerPopover.vue";
import PopoverActions from "../../utils/PopoverActions.vue";

const buttonColors = ref<ButtonPopOverProps["colors"]>({
  normal: {
    backgroundColor: {
      light: "",
      dark: "",
    },
    labelColor: {
      light: "",
      dark: "",
    },
    outlineColor: {
      light: "",
      dark: "",
    },
  },
  hover: {
    backgroundColor: {
      light: "",
      dark: "",
    },
    labelColor: {
      light: "",
      dark: "",
    },
    outlineColor: {
      light: "",
      dark: "",
    },
  },
});

const colors = ref({
  light: "",
  dark: "",
});

const currentProps = ref<ButtonPopOverProps>({
  class: "rounded-full",
  alignment: "left",
  size: "md",
  variant: "solid",
  colors: buttonColors.value,
  icon: {
    name: "",
    front: true,
  },
  link: {
    href: "",
    newTab: false,
  },
});

const buttonBorderRadiusIcon = ref<string>("lucide:circle");
const buttonRowAligmentIcon = ref<string>("lucide:align-left");
const defaultAlignment = ref<ComponentAlignment>("left");
const buttonIcon = ref<string | null>(currentProps.value.icon.name || null);
const iconPos = ref<"leading" | "trailing">(
  currentProps.value.icon.front ? "leading" : "trailing"
);

watch(buttonIcon, (v) => {
  currentProps.value.icon.name = v ?? "";
  emit("updated-button-props", currentProps.value);
});

watch(iconPos, (p) => {
  currentProps.value.icon.front = p === "leading";
  emit("updated-button-props", currentProps.value);
});

const alignIcon = computed(() => {
  return defaultAlignment.value === "left"
    ? "lucide:align-left"
    : defaultAlignment.value === "center"
    ? "lucide:align-center"
    : "lucide:align-right";
});

function onButtonRadiusChange() {
  if (buttonBorderRadiusIcon.value === "lucide:circle") {
    buttonBorderRadiusIcon.value = "lucide:squircle";
    currentProps.value.class = "rounded-md";
  } else if (buttonBorderRadiusIcon.value === "lucide:squircle") {
    buttonBorderRadiusIcon.value = "lucide:square";
    currentProps.value.class = "rounded-none";
  } else {
    buttonBorderRadiusIcon.value = "lucide:circle";
    currentProps.value.class = "rounded-full";
  }
  emit("updated-button-props", currentProps.value);
}

function onSizeButtonClicked(e: MouseEvent) {
  const size = (e.currentTarget as HTMLElement).dataset.size as "S" | "M" | "L";
  if (size === "S") {
    currentProps.value.size = "sm";
  } else if (size === "M") {
    currentProps.value.size = "md";
  } else {
    currentProps.value.size = "xl";
  }
  emit("updated-button-props", currentProps.value);
}

function onAligmentChange() {
  if (buttonRowAligmentIcon.value === "lucide:align-left") {
    buttonRowAligmentIcon.value = "lucide:align-center";
    currentProps.value.alignment = "center";
  } else if (buttonRowAligmentIcon.value === "lucide:align-center") {
    buttonRowAligmentIcon.value = "lucide:align-right";
    currentProps.value.alignment = "right";
  } else {
    buttonRowAligmentIcon.value = "lucide:align-left";
    currentProps.value.alignment = "left";
  }
  emit("updated-button-props", currentProps.value);
}

const emit = defineEmits<{
  (e: "updated-button-props", payload: ButtonPopOverProps): void;
  (e: "duplicate"): void;
  (e: "delete"): void;
}>();
</script>
