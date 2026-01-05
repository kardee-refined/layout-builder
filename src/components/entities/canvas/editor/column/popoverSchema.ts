export type FieldKind =
  | "text"
  | "number"
  | "color"
  | "select"
  | "textarea"
  | "toggle";

export type FieldDef = {
  key: string;
  label: string;
  kind: FieldKind;
  default?: any;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  help?: string;
  validate?: (value: any) => string | null;
};

export const SCHEMAS: Record<string, FieldDef[]> = {
  button: [
    {
      key: "text",
      label: "Button text",
      kind: "text",
      default: "Button",
      required: true,
    },
    {
      key: "href",
      label: "URL",
      kind: "text",
      default: "",
      placeholder: "https://...",
    },
    { key: "bg", label: "Background", kind: "color", default: "#2563EB" },
    { key: "color", label: "Text color", kind: "color", default: "#FFFFFF" },
    { key: "radius", label: "Radius", kind: "number", default: 8 },
  ],
  //   image: [
  //     {
  //       key: "src",
  //       label: "Image URL",
  //       kind: "text",
  //       default: "",
  //       required: true,
  //     },
  //     {
  //       key: "alt",
  //       label: "Alt text",
  //       kind: "text",
  //       default: "",
  //       help: "Important for SEO & accessibility",
  //     },
  //     { key: "width", label: "Width", kind: "number", default: 320 },
  //     { key: "height", label: "Height", kind: "number", default: 180 },
  //     {
  //       key: "fit",
  //       label: "Fit",
  //       kind: "select",
  //       default: "cover",
  //       options: ["cover", "contain", "fill", "none", "scale-down"],
  //     },
  //     { key: "radius", label: "Radius", kind: "number", default: 12 },
  //   ],
  // ...
};
