import lucide from "@iconify-json/lucide/icons.json";

export const LUCIDE_ICONS = Object.keys(lucide.icons).map(
  (name) => `lucide:${name}`
);
