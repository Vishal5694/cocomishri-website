import {
  DEFAULT_HERO_CONFIG,
  validateHeroConfig,
  type HeroConfig,
} from "@/lib/hero-config";
import type { Section } from "./types";

export const homeHeroSection: Section<HeroConfig> = {
  id: "home-hero",
  title: "Home hero",
  defaults: DEFAULT_HERO_CONFIG,
  validate: validateHeroConfig,
  options: [
    {
      kind: "choice",
      key: "height",
      label: "1. Hero height",
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
      label: "2. Media type",
      group: "Layout",
      choices: [
        { value: "video", label: "Video (photo fallback)" },
        { value: "photo", label: "Photo only" },
      ],
    },
    {
      kind: "choice",
      key: "textMode",
      label: "3. Text layout",
      group: "Text",
      choices: [
        { value: "title-button", label: "Title + Button" },
        { value: "title-line-button", label: "Title + Line + Button" },
        { value: "none", label: "None (whole slide clickable)" },
      ],
    },
    {
      kind: "choice",
      key: "textPosition",
      label: "4. Text position",
      group: "Text",
      choices: [
        { value: "centre", label: "Centre" },
        { value: "bottom-centre", label: "Bottom centre" },
        { value: "bottom-left", label: "Bottom left" },
        { value: "left-middle", label: "Left middle" },
      ],
    },
    {
      kind: "text",
      key: "headingText",
      label: "5. Main heading (H1)",
      group: "Text",
      placeholder: "Sweet like Mishri. Soft like a hug.",
      maxLength: 80,
    },
    {
      kind: "toggle",
      key: "headingVisible",
      label: "6. Show main heading on screen",
      group: "Text",
    },
    {
      kind: "toggle",
      key: "autoplay",
      label: "7. Autoplay slides",
      group: "Motion & controls",
    },
    {
      kind: "range",
      key: "intervalSec",
      label: "8. Slide interval",
      group: "Motion & controls",
      min: 3,
      max: 10,
      step: 1,
      unit: "s",
    },
    {
      kind: "choice",
      key: "transition",
      label: "9. Transition",
      group: "Motion & controls",
      choices: [
        { value: "fade", label: "Fade" },
        { value: "slide", label: "Slide" },
      ],
    },
    {
      kind: "multi",
      key: "controls",
      label: "10. Controls",
      group: "Motion & controls",
      choices: [
        { value: "dots", label: "Dots" },
        { value: "arrows", label: "Arrows" },
        { value: "progress", label: "Progress bars" },
        { value: "counter", label: "Counter" },
        { value: "pause", label: "Pause / Play" },
        { value: "swipe", label: "Touch swipe" },
      ],
    },
    {
      kind: "choice",
      key: "buttonStyle",
      label: "11. Button style",
      group: "Button",
      choices: [
        { value: "outline", label: "Outline" },
        { value: "solid", label: "Solid cream" },
        { value: "link", label: "Text link" },
      ],
    },
    {
      kind: "range",
      key: "scrimPercent",
      label: "12. Scrim darkness",
      group: "Photos",
      min: 15,
      max: 60,
      step: 5,
      unit: "%",
    },
    {
      kind: "choice",
      key: "placeholderMode",
      label: "13. Placeholder mode",
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
