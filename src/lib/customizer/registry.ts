import {
  DEFAULT_WORLD_CONFIG,
  validateWorldConfig,
  type WorldConfig,
} from "@/lib/world-config";
import type { Section } from "./types";

export const worldOfCocomishriSection: Section<WorldConfig> = {
  id: "world-of-cocomishri",
  title: "World of Cocomishri",
  defaults: DEFAULT_WORLD_CONFIG,
  validate: validateWorldConfig,
  options: [
    // Copy
    { kind: "text", key: "title", label: "Title", group: "Copy", maxLength: 80 },
    { kind: "text", key: "subtitle", label: "Subtitle", group: "Copy", maxLength: 100 },
    { kind: "text", key: "paragraph", label: "Paragraph", group: "Copy", maxLength: 500 },
    {
      kind: "text",
      key: "highlightWords",
      label: "Highlight words (comma-separated)",
      group: "Copy",
      maxLength: 120,
    },
    { kind: "text", key: "closing", label: "Closing line", group: "Copy", maxLength: 80 },

    // Typography & layout
    {
      kind: "range",
      key: "titleSizeDesktop",
      label: "Title size (desktop)",
      group: "Typography & layout",
      min: 40,
      max: 80,
      step: 2,
      unit: "px",
    },
    {
      kind: "range",
      key: "titleSizeMobile",
      label: "Title size (phone)",
      group: "Typography & layout",
      min: 28,
      max: 48,
      step: 2,
      unit: "px",
    },
    {
      kind: "range",
      key: "bodySize",
      label: "Paragraph size (desktop)",
      group: "Typography & layout",
      min: 14,
      max: 18,
      step: 1,
      unit: "px",
    },
    {
      kind: "range",
      key: "sectionPadding",
      label: "Section padding (desktop)",
      group: "Typography & layout",
      min: 48,
      max: 144,
      step: 8,
      unit: "px",
    },

    // Fabric & watermark
    {
      kind: "choice",
      key: "background",
      label: "Background",
      group: "Fabric & watermark",
      choices: [
        { value: "fabric", label: "Fabric weave (sand-100)" },
        { value: "cream-50", label: "Plain cream (#FCF8F2)" },
        { value: "sand-100", label: "Plain sand (#F4EADD)" },
      ],
    },
    {
      kind: "range",
      key: "weaveStrength",
      label: "Weave strength",
      group: "Fabric & watermark",
      min: 0,
      max: 100,
      step: 10,
      unit: "%",
    },
    {
      kind: "range",
      key: "grainStrength",
      label: "Grain strength",
      group: "Fabric & watermark",
      min: 0,
      max: 100,
      step: 10,
      unit: "%",
    },
    {
      kind: "toggle",
      key: "watermarkOn",
      label: "Mascot watermark",
      group: "Fabric & watermark",
    },
    {
      kind: "range",
      key: "watermarkOpacity",
      label: "Watermark opacity",
      group: "Fabric & watermark",
      min: 0.03,
      max: 0.12,
      step: 0.01,
    },
    {
      kind: "range",
      key: "watermarkSize",
      label: "Watermark size",
      group: "Fabric & watermark",
      min: 300,
      max: 800,
      step: 20,
      unit: "px",
    },
    {
      kind: "range",
      key: "watermarkOffsetY",
      label: "Watermark vertical offset",
      group: "Fabric & watermark",
      min: -30,
      max: 30,
      step: 5,
      unit: "%",
    },

    // Animation
    { kind: "toggle", key: "animationOn", label: "Animation", group: "Animation" },
    {
      kind: "choice",
      key: "speed",
      label: "Speed",
      group: "Animation",
      choices: [
        { value: "slow", label: "Slow (×1.5)" },
        { value: "normal", label: "Normal" },
        { value: "fast", label: "Fast (×0.7)" },
      ],
    },
    { kind: "toggle", key: "inkOn", label: "Ink-in effect", group: "Animation" },
    { kind: "toggle", key: "stitchOn", label: "Stitch line", group: "Animation" },
    { kind: "toggle", key: "crystalsOn", label: "Floating crystals", group: "Animation" },

    // Bottom mascot
    { kind: "toggle", key: "mascotOn", label: "Show bottom mascot", group: "Bottom mascot" },
    {
      kind: "range",
      key: "mascotWidth",
      label: "Bottom mascot width",
      group: "Bottom mascot",
      min: 80,
      max: 200,
      step: 4,
      unit: "px",
    },
    { kind: "toggle", key: "mascotBreathing", label: "Mascot breathing", group: "Bottom mascot" },
  ],
};

export const customizerSections = [worldOfCocomishriSection] as const;
export type SectionId = (typeof customizerSections)[number]["id"];
