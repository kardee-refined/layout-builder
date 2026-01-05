<template>
  <div class="relative group">
    <aside
      class="fixed left-4 top-19 z-100 h-[calc(100vh-88px)] overflow-hidden transition-all duration-300 ease-in-out bg-gray-100 dark:bg-gray-950 rounded-2xl shadow-2xl border-r border-white/5 flex"
      :class="hover ? expandedWidth : 'w-16'"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
    >
      <div class="w-52 p-2 flex flex-col border-r border-white h-full">
        <div class="flex-1 flex flex-col gap-3 overflow-y-auto">
          <SidebarToolButton
            v-for="tool in tools"
            :key="tool.title"
            :tool="tool"
            :active="selectedTool?.title === tool.title"
            @mouseenter="selectTool(tool)"
          />
        </div>
      </div>
      <SidebarOptions :options="selectedTool" @drag-start="hover = false" />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import SidebarToolButton from "./Entity.vue";
import SidebarOptions from "./Options.vue";
import { nanoid } from "nanoid";

const hover = ref(false);
const selectedTool = ref<any>(null);
const expandedWidth = computed(() =>
  selectedTool.value?.variants?.length ? "w-[32rem]" : "w-125"
);

const tools = [
  { icon: "lucide:type", bg: "bg-[#111315] text-white", title: "Text" },
  { icon: "lucide:image", bg: "bg-[#111315] text-white", title: "Image" },
  { icon: "lucide:video", bg: "bg-[#111315] text-white", title: "Video" },
  { icon: "lucide:minus", bg: "bg-[#111315] text-white", title: "Divider" },
  { icon: "lucide:space", bg: "bg-[#111315] text-white", title: "Spacer" },
  { icon: "lucide:images", bg: "bg-[#111315] text-white", title: "Gallery" },
  { icon: "lucide:repeat", bg: "bg-[#111315] text-white", title: "Carousel" },
  { icon: "lucide:layout-template", bg: "bg-[#111315] text-white", title: "Hero" },
  { icon: "lucide:star", bg: "bg-[#111315] text-white", title: "Icon" },
  {
    icon: "lucide:rectangle-horizontal",
    bg: "bg-[#111315] text-white",
    title: "Button",
    variants: [
      {
        id: "button-primary",
        title: "Primary Button",
        type: "button",
        props: { text: "Get Started", bg: "#2563EB", color: "#FFFFFF", radius: 8 },
      },
      {
        id: "button-outline",
        title: "Outline Button",
        type: "button",
        props: { text: "Learn More", bg: "#FFFFFF", color: "#2563EB", radius: 8 },
      },
      {
        id: "button-dark",
        title: "Dark Button",
        type: "button",
        props: { text: "Contact", bg: "#0F172A", color: "#FFFFFF", radius: 8 },
      },
    ],
  },
  { icon: "lucide:credit-card", bg: "bg-[#111315] text-white", title: "Card" },
  { icon: "lucide:share-2", bg: "bg-[#111315] text-white", title: "Social" },
  { icon: "lucide:code", bg: "bg-[#111315] text-white", title: "Embed" },
  { icon: "lucide:frame", bg: "bg-[#111315] text-white", title: "Iframe" },
];

function selectTool(tool: { icon: any; bg: string; title: string }) {
  selectedTool.value = { ...tool, id: nanoid() };
}
</script>
