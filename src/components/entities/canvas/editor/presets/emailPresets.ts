import { nanoid } from "nanoid";
import {
  STRUCTURE_ENTITY,
  type CanvasEntity,
  type ColumnEntity,
  type ColumnRowEntity,
  type RowEntity,
  type SectionEntity,
} from "@/types/CanvasType";

export type EmailPreset = {
  id: string;
  name: string;
  description: string;
  build: () => CanvasEntity;
};

const baseTextProps = {
  color: "#111827",
  fontSize: 16,
  bold: false,
  italic: false,
  underline: false,
};

const createTextRow = (
  text: string,
  overrides: Partial<ColumnRowEntity["props"]> = {}
): ColumnRowEntity => ({
  id: nanoid(),
  type: STRUCTURE_ENTITY.COLUMN_ROW,
  component: "text",
  props: {
    title: text,
    text,
    ...baseTextProps,
    ...overrides,
  },
});

const createColumn = (rows: ColumnRowEntity[]): ColumnEntity => ({
  id: nanoid(),
  type: STRUCTURE_ENTITY.COLUMN,
  settings: { width: 100 },
  children: rows,
});

const createRow = (columns: ColumnEntity[]): RowEntity => ({
  id: nanoid(),
  type: STRUCTURE_ENTITY.ROW,
  settings: {
    gap: 10,
    layout: [],
    numOfColumns: columns.length,
  },
  children: columns,
});

const createSection = (rows: RowEntity[]): SectionEntity => ({
  id: nanoid(),
  type: STRUCTURE_ENTITY.SECTION,
  settings: { data: "preset" },
  children: rows,
});

const createCanvas = (sections: SectionEntity[]): CanvasEntity => ({
  id: nanoid(),
  type: STRUCTURE_ENTITY.CANVAS,
  children: sections,
});

export const emailPresets: EmailPreset[] = [
  {
    id: "newsletter",
    name: "Weekly Newsletter",
    description: "Header, hero, and three content highlights.",
    build: () => {
      const header = createTextRow("Your Weekly Update", {
        fontSize: 28,
        bold: true,
      });
      const intro = createTextRow(
        "Catch up on the biggest stories, tips, and product news.",
        { fontSize: 16 }
      );
      const highlight1 = createTextRow("1) Feature Spotlight: New editor tools");
      const highlight2 = createTextRow("2) Case Study: Faster design handoffs");
      const highlight3 = createTextRow("3) Tips: 5 ways to speed up reviews");
      const footer = createTextRow("Thanks for reading. See you next week!", {
        fontSize: 14,
        color: "#6B7280",
      });

      const column = createColumn([
        header,
        intro,
        highlight1,
        highlight2,
        highlight3,
        footer,
      ]);

      return createCanvas([createSection([createRow([column])])]);
    },
  },
  {
    id: "product-launch",
    name: "Product Launch",
    description: "Bold headline with feature list and CTA.",
    build: () => {
      const headline = createTextRow("Introducing Aurora 2.0", {
        fontSize: 30,
        bold: true,
      });
      const sub = createTextRow(
        "Smarter layouts, faster exports, and a brand-new component library."
      );
      const features = createTextRow(
        "Highlights: Smart grids, responsive presets, and inline editing"
      );
      const cta = createTextRow("Try it today →", {
        fontSize: 18,
        bold: true,
        color: "#2563EB",
      });
      const column = createColumn([headline, sub, features, cta]);
      return createCanvas([createSection([createRow([column])])]);
    },
  },
  {
    id: "event-invite",
    name: "Event Invite",
    description: "Invitation with agenda and details.",
    build: () => {
      const title = createTextRow("You’re Invited: Design Jam", {
        fontSize: 26,
        bold: true,
      });
      const details = createTextRow("Thursday, 6 PM · Downtown Studio", {
        color: "#6B7280",
      });
      const agenda = createTextRow(
        "Agenda: Lightning talks, live demos, and networking"
      );
      const rsvp = createTextRow("RSVP now →", {
        fontSize: 18,
        bold: true,
        color: "#16A34A",
      });
      const column = createColumn([title, details, agenda, rsvp]);
      return createCanvas([createSection([createRow([column])])]);
    },
  },
  {
    id: "password-reset",
    name: "Password Reset",
    description: "Simple reset email with clear instructions.",
    build: () => {
      const title = createTextRow("Reset your password", {
        fontSize: 24,
        bold: true,
      });
      const body = createTextRow(
        "We received a request to reset your password. Click below to continue."
      );
      const action = createTextRow("Reset password", {
        fontSize: 18,
        bold: true,
        color: "#DC2626",
      });
      const note = createTextRow(
        "If you didn’t request this, you can safely ignore this email.",
        { fontSize: 14, color: "#6B7280" }
      );
      const column = createColumn([title, body, action, note]);
      return createCanvas([createSection([createRow([column])])]);
    },
  },
  {
    id: "receipt",
    name: "Purchase Receipt",
    description: "Order summary and total amount.",
    build: () => {
      const title = createTextRow("Thanks for your purchase!", {
        fontSize: 24,
        bold: true,
      });
      const order = createTextRow("Order #4921 · June 14, 2024", {
        color: "#6B7280",
      });
      const items = createTextRow("Items: Pro Plan (x1) · Team Pack (x2)");
      const total = createTextRow("Total: $149.00", {
        fontSize: 18,
        bold: true,
      });
      const footer = createTextRow("Need help? Reply to this email.", {
        fontSize: 14,
        color: "#6B7280",
      });
      const column = createColumn([title, order, items, total, footer]);
      return createCanvas([createSection([createRow([column])])]);
    },
  },
];
