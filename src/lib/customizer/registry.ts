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
    { kind: "text", key: "eyebrow", label: "Eyebrow", group: "Copy", maxLength: 40 },
    { kind: "text", key: "headingLine1", label: "Heading line 1", group: "Copy", maxLength: 40 },
    { kind: "text", key: "headingLine2", label: "Heading line 2", group: "Copy", maxLength: 40 },
    { kind: "text", key: "lead", label: "Lead line", group: "Copy", maxLength: 120 },
    { kind: "text", key: "body1", label: "Body paragraph 1", group: "Copy", maxLength: 280 },
    { kind: "text", key: "body2", label: "Body paragraph 2", group: "Copy", maxLength: 280 },
    { kind: "text", key: "body3", label: "Body paragraph 3", group: "Copy", maxLength: 280 },
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
      key: "headingSizeDesktop",
      label: "Heading size (desktop)",
      group: "Typography & layout",
      min: 28,
      max: 56,
      step: 2,
      unit: "px",
    },
    {
      kind: "range",
      key: "headingSizeMobile",
      label: "Heading size (phone)",
      group: "Typography & layout",
      min: 22,
      max: 40,
      step: 2,
      unit: "px",
    },
    {
      kind: "range",
      key: "bodySize",
      label: "Body size",
      group: "Typography & layout",
      min: 14,
      max: 18,
      step: 1,
      unit: "px",
    },
    {
      kind: "choice",
      key: "background",
      label: "Background",
      group: "Typography & layout",
      choices: [
        { value: "cream-50", label: "Cream (#FCF8F2)" },
        { value: "sand-100", label: "Sand (#F4EADD)" },
        { value: "blush-100", label: "Blush (#F8E6DF)" },
        { value: "caramel-100", label: "Caramel (#F7E8D8)" },
      ],
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

    // Mascot
    { kind: "toggle", key: "mascotOn", label: "Show mascot", group: "Mascot" },
    {
      kind: "range",
      key: "mascotWidth",
      label: "Mascot width (desktop)",
      group: "Mascot",
      min: 80,
      max: 200,
      step: 4,
      unit: "px",
    },
    {
      kind: "choice",
      key: "mascotPosition",
      label: "Mascot position",
      group: "Mascot",
      choices: [
        { value: "below", label: "Below closing" },
        { value: "above", label: "Above eyebrow" },
      ],
    },
    { kind: "toggle", key: "mascotBreathing", label: "Mascot breathing", group: "Mascot" },
  ],
};

export const customizerSections = [worldOfCocomishriSection] as const;
export type SectionId = (typeof customizerSections)[number]["id"];
