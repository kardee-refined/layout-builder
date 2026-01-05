import { nanoid } from "nanoid";
import {
  STRUCTURE_ENTITY,
  type ColumnRowEntity,
  type ColumnEntity,
  type RowEntity,
  type SectionEntity,
  type CanvasEntity,
} from "@/types/CanvasType";

/** ---------- helpers ---------- */
type TextVariant = "kicker" | "h1" | "h2" | "body" | "muted";
type Align = "left" | "center" | "right";

const col = (width: number, children: ColumnRowEntity[]): ColumnEntity => ({
  id: nanoid(),
  type: STRUCTURE_ENTITY.COLUMN,
  settings: { width },
  children,
});

const row = (
  children: ColumnEntity[],
  opts?: Partial<RowEntity["settings"]>
): RowEntity => ({
  id: nanoid(),
  type: STRUCTURE_ENTITY.ROW,
  settings: {
    gap: 8,
    layout: [],
    numOfColumns: 12,
    ...opts,
  },
  children,
});

const section = (
  children: RowEntity[],
  settings?: SectionEntity["settings"]
): SectionEntity => ({
  id: nanoid(),
  type: STRUCTURE_ENTITY.SECTION,
  settings: settings ?? { data: "preset:whitepace" },
  children,
});

const text = (
  value: string,
  variant: TextVariant = "body",
  align: Align = "left"
): ColumnRowEntity => ({
  id: nanoid(),
  type: STRUCTURE_ENTITY.COLUMN_ROW,
  component: "text",
  props: {
    text: value,
    variant,
    align,
  },
});

const button = (
  label: string,
  variant: string,
  size: string,
  extra?: Record<string, any>
): ColumnRowEntity => ({
  id: nanoid(),
  type: STRUCTURE_ENTITY.COLUMN_ROW,
  component: "button",
  props: {
    label,
    variant, // e.g. "solid" | "outline" | "ghost"
    size, // e.g. "sm" | "md" | "lg" | "xl" (match your Nuxt UI theme)
    ...extra,
  },
});

const image = (
  src: string,
  alt: string,
  extra?: Record<string, any>
): ColumnRowEntity => ({
  id: nanoid(),
  type: STRUCTURE_ENTITY.COLUMN_ROW,
  component: "image",
  props: {
    src,
    alt,
    ...extra,
  },
});

/** ---------- preset: Whitepace-ish SaaS landing ---------- */
export function generateWhitepaceLandingPreset(): CanvasEntity {
  // SECTION 1: Header
  const header = section(
    [
      row(
        [
          col(3, [text("whitepace", "h2", "left")]),
          col(6, [
            // nav as text placeholders (you can later replace with a "nav" component)
            text(
              "Products    Solutions    Resources    Pricing",
              "body",
              "center"
            ),
          ]),
          col(3, [
            button("Login", "ghost", "sm"),
            button("Try Whitepace free", "solid", "sm", { color: "primary" }),
          ]),
        ],
        { gap: 6, numOfColumns: 12 }
      ),
    ],
    { data: "section:header" }
  );

  // SECTION 2: Hero
  const hero = section(
    [
      row(
        [
          col(6, [
            text("Get More Done with whitepace", "h1", "left"),
            text(
              "Project management software that lets your team collaborate, plan, and deliver work faster.",
              "body",
              "left"
            ),
            // button row (as two separate button nodes stacked; your renderer can lay them inline if you want)
            button("Try Whitepace free", "solid", "xl", {
              color: "primary",
              icon: "lucide:arrow-right",
              trailing: true,
            }),
            button("View demo", "outline", "xl", {
              icon: "lucide:play",
              leading: true,
            }),
            text("No credit card required • Cancel anytime", "muted", "left"),
          ]),
          col(6, [
            image(
              "https://picsum.photos/seed/whitepace-hero/1200/900",
              "App screenshot",
              { radius: "rounded-2xl" }
            ),
          ]),
        ],
        { gap: 10, numOfColumns: 12 }
      ),
    ],
    { data: "section:hero" }
  );

  // SECTION 3: Logos
  const logos = section(
    [
      row(
        [
          col(12, [
            text("Trusted by 10,000+ teams", "muted", "center"),
            text("Apple   Google   Slack   Notion   Dropbox", "body", "center"),
          ]),
        ],
        { gap: 6, numOfColumns: 12 }
      ),
    ],
    { data: "section:logos" }
  );

  // SECTION 4: Features (3 columns)
  const features = section(
    [
      row(
        [
          col(12, [
            text("Project Management", "h2", "center"),
            text(
              "Everything your team needs to plan, track, and ship.",
              "body",
              "center"
            ),
          ]),
        ],
        { gap: 8, numOfColumns: 12 }
      ),
      row(
        [
          col(4, [
            text("Work Together", "h2", "left"),
            text(
              "Collaborate in real time with comments, tasks, and shared timelines.",
              "body",
              "left"
            ),
            button("Learn more", "ghost", "md", {
              icon: "lucide:arrow-right",
              trailing: true,
            }),
          ]),
          col(4, [
            text("Plan & Organize", "h2", "left"),
            text(
              "Keep projects on track with schedules, milestones, and assignments.",
              "body",
              "left"
            ),
            button("Learn more", "ghost", "md", {
              icon: "lucide:arrow-right",
              trailing: true,
            }),
          ]),
          col(4, [
            text("Deliver Faster", "h2", "left"),
            text(
              "Automations and views help you move quickly without losing control.",
              "body",
              "left"
            ),
            button("Learn more", "ghost", "md", {
              icon: "lucide:arrow-right",
              trailing: true,
            }),
          ]),
        ],
        { gap: 10, numOfColumns: 12 }
      ),
    ],
    { data: "section:features" }
  );

  // SECTION 5: CTA band
  const cta = section(
    [
      row(
        [
          col(12, [
            text("Start using Whitepace today", "h2", "center"),
            text(
              "Create your workspace and invite your team in minutes.",
              "body",
              "center"
            ),
            button("Try Whitepace free", "solid", "xl", { color: "primary" }),
          ]),
        ],
        { gap: 8, numOfColumns: 12 }
      ),
    ],
    { data: "section:cta" }
  );

  // SECTION 6: Footer
  const footer = section(
    [
      row(
        [
          col(4, [
            text("whitepace", "h2", "left"),
            text("© 2025 Whitepace. All rights reserved.", "muted", "left"),
          ]),
          col(4, [
            text("Product", "h2", "left"),
            text("Features • Templates • Integrations", "body", "left"),
          ]),
          col(4, [
            text("Company", "h2", "left"),
            text("About • Careers • Contact", "body", "left"),
          ]),
        ],
        { gap: 10, numOfColumns: 12 }
      ),
    ],
    { data: "section:footer" }
  );

  return {
    id: nanoid(),
    type: STRUCTURE_ENTITY.CANVAS,
    children: [header, hero, logos, features, cta, footer],
  };
}
