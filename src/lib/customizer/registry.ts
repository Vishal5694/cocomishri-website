import {
  DEFAULT_HERO_V2_CONFIG,
  validateHeroV2Config,
  type HeroV2Config,
} from "@/lib/hero-v2-config";
import type { Section } from "./types";

export const homeHeroSection: Section<HeroV2Config> = {
  id: "home-hero",
  title: "Home hero",
  defaults: DEFAULT_HERO_V2_CONFIG,
  validate: validateHeroV2Config,
  options: [
    {
      kind: "choice",
      key: "height",
      label: "Hero height",
      group: "Layout",
      choices: [
        { value: "full", label: "Full screen" },
        { value: "85", label: "85% height" },
        { value: "70", label: "70% height" },
      ],
    },
    {
      kind: "choice",
      key: "mediaType",
      label: "Media type",
      group: "Layout",
      choices: [
        { value: "photo", label: "Photos" },
        { value: "video", label: "Video (with photo fallback)" },
      ],
    },
    {
      kind: "choice",
      key: "textPosition",
      label: "Text position",
      group: "Text",
      choices: [
        { value: "bottom-centre", label: "Bottom centre" },
        { value: "centre", label: "Centre" },
        { value: "bottom-left", label: "Bottom left" },
        { value: "left-middle", label: "Left middle" },
      ],
    },
    {
      kind: "range",
      key: "titleSizeDesktop",
      label: "Title size (desktop)",
      group: "Text",
      min: 32,
      max: 72,
      step: 2,
      unit: "px",
    },
    {
      kind: "range",
      key: "titleSizeMobile",
      label: "Title size (phone)",
      group: "Text",
      min: 28,
      max: 48,
      step: 2,
      unit: "px",
    },
    {
      kind: "text",
      key: "headingText",
      label: "Page heading (h1)",
      group: "Text",
      placeholder: "Sweet like Mishri. Soft like a hug.",
      maxLength: 80,
    },
    {
      kind: "toggle",
      key: "headingVisible",
      label: "Show h1 eyebrow above title",
      group: "Text",
    },
    {
      kind: "choice",
      key: "linkStyle",
      label: "Link style",
      group: "Links",
      choices: [
        { value: "link", label: "Underlined text links" },
        { value: "outline", label: "Outline button" },
        { value: "solid", label: "Solid cream button" },
      ],
    },
    {
      kind: "toggle",
      key: "autoplay",
      label: "Auto-advance slides",
      group: "Motion",
    },
    {
      kind: "range",
      key: "intervalSec",
      label: "Seconds per slide",
      group: "Motion",
      min: 3,
      max: 10,
      step: 1,
      unit: "s",
    },
    {
      kind: "choice",
      key: "transition",
      label: "Transition",
      group: "Motion",
      choices: [
        { value: "fade", label: "Crossfade" },
        { value: "slide", label: "Slide" },
      ],
    },
    {
      kind: "multi",
      key: "controls",
      label: "Visible controls",
      group: "Controls",
      choices: [
        { value: "arrows", label: "Arrows" },
        { value: "dots", label: "Dots" },
        { value: "pause", label: "Pause button" },
        { value: "progress", label: "Progress bars" },
        { value: "counter", label: "Slide counter" },
        { value: "swipe", label: "Touch swipe" },
      ],
    },
    {
      kind: "range",
      key: "scrimPercent",
      label: "Scrim strength",
      group: "Photos",
      min: 15,
      max: 60,
      step: 5,
      unit: "%",
    },
    {
      kind: "choice",
      key: "placeholderMode",
      label: "Photo mode",
      group: "Photos",
      choices: [
        { value: "sample", label: "Sample photos" },
        { value: "colour", label: "Plain colour blocks" },
      ],
    },
  ],
};

export const customizerSections = [homeHeroSection] as const;
export type SectionId = (typeof customizerSections)[number]["id"];
