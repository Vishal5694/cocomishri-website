import {
  DEFAULT_CAMPAIGN_CONFIG,
  validateCampaignConfig,
  type CampaignBannersConfig,
} from "@/lib/campaign-banners-config";
import type { Section } from "./types";

export const campaignBannersSection: Section<CampaignBannersConfig> = {
  id: "campaign-banners",
  title: "Campaign banners",
  defaults: DEFAULT_CAMPAIGN_CONFIG,
  validate: validateCampaignConfig,
  options: [
    // Layout
    {
      kind: "choice",
      key: "height",
      label: "Banner height",
      group: "Layout",
      choices: [
        { value: "full", label: "Full screen (100svh)" },
        { value: "85", label: "85% height" },
        { value: "70", label: "70% height" },
      ],
    },
    {
      kind: "choice",
      key: "mediaType",
      label: "Media",
      group: "Layout",
      choices: [
        { value: "photo", label: "Photos" },
        { value: "video", label: "Video (with photo fallback)" },
      ],
    },
    {
      kind: "choice",
      key: "gapPx",
      label: "Gap between banners",
      group: "Layout",
      choices: [
        { value: "0", label: "0px" },
        { value: "4", label: "4px" },
        { value: "8", label: "8px" },
        { value: "16", label: "16px" },
      ],
    },
    {
      kind: "toggle",
      key: "gapTop",
      label: "Gap above first banner",
      group: "Layout",
    },

    // Text
    {
      kind: "choice",
      key: "textPosition",
      label: "Text position",
      group: "Text",
      choices: [
        { value: "centre", label: "Centre" },
        { value: "bottom-centre", label: "Bottom centre" },
        { value: "bottom-left", label: "Bottom left" },
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
      min: 24,
      max: 48,
      step: 2,
      unit: "px",
    },
    {
      kind: "range",
      key: "textOffsetY",
      label: "Text vertical offset",
      group: "Text",
      min: -20,
      max: 20,
      step: 2,
      unit: "%",
    },

    // Button
    {
      kind: "choice",
      key: "buttonStyle",
      label: "Button style",
      group: "Button",
      choices: [
        { value: "outline", label: "Outline cream" },
        { value: "solid", label: "Solid cream" },
        { value: "link", label: "Underlined link" },
      ],
    },

    // Overlays
    {
      kind: "range",
      key: "bottomGradient",
      label: "Bottom gradient strength",
      group: "Overlays",
      min: 0,
      max: 80,
      step: 5,
      unit: "%",
    },
    {
      kind: "range",
      key: "centreGlow",
      label: "Centre glow strength",
      group: "Overlays",
      min: 0,
      max: 60,
      step: 5,
      unit: "%",
    },
  ],
};

export const customizerSections = [campaignBannersSection] as const;
export type SectionId = (typeof customizerSections)[number]["id"];
