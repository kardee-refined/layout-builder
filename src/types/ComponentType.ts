import { ButtonProps } from "@nuxt/ui/.";

export type ComponentAlignment = "left" | "center" | "right";

export type CanvasComponent =
  | "text"
  | "button"
  | "image"
  | "card"
  | "video"
  | "divider"
  | "spacer"
  | "icon"
  | "gallery"
  | "carousel"
  | "iframe"
  | "embed"
  | "hero";

export type ComponentPropsMap = {
  button: ButtonProps;
  [key: string]: any;
  //   image: ImageProps;
  //   card: CardProps;
  //   video: { src?: string; width?: number; height?: number };
  //   divider: { color?: string; thickness?: number };
  //   spacer: { height?: number };
  //   icon: {
  //     name?: string;
  //     size?: number;
  //     color?: string;
  //     align?: "left" | "center" | "right";
  //   };
  //   gallery: { images?: string[] };
  //   carousel: { images?: string[] };
  //   iframe: { src?: string; width?: number; height?: number };
  //   embed: { html?: string };
  //   hero: {
  //     title?: string;
  //     subtitle?: string;
  //     buttonText?: string;
  //     buttonUrl?: string;
  //     imageSrc?: string;
  //     background?: string;
  //   };
};

type ThemePair<T> = { light: T; dark: T };
type ButtonColorKey = "backgroundColor" | "labelColor" | "outlineColor";

export type ButtonColor = {
  [K in ButtonColorKey]: ThemePair<ButtonProps["color"]>;
};

export type ButtonPopOverProps = {
  class: ButtonProps["class"];
  alignment: ComponentAlignment;
  size: ButtonProps["size"];
  variant: ButtonProps["variant"];
  colors: {
    normal: ButtonColor;
    hover: ButtonColor;
  };
  icon: {
    name: ButtonProps["icon"];
    front: ButtonProps["leading"];
  };
  link: {
    href: ButtonProps["href"];
    newTab: boolean;
  };
};
