import {
  DEFAULT_HERO_V2_CONFIG,
  validateHeroV2Config,
  type HeroV2Config,
} from "@/lib/hero-v2-config";
import {
  DEFAULT_HEADER_CONFIG,
  validateHeaderConfig,
  type HeaderConfig,
} from "@/lib/header-config";
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

export const siteHeaderSection: Section<HeaderConfig> = {
  id: "site-header",
  title: "Header",
  defaults: DEFAULT_HEADER_CONFIG,
  validate: validateHeaderConfig,
  options: [
    // Top bar
    {
      kind: "toggle",
      key: "topBarOn",
      label: "Show top bar",
      group: "Top bar",
    },
    {
      kind: "range",
      key: "rotateSec",
      label: "Message rotation",
      group: "Top bar",
      min: 3,
      max: 10,
      step: 1,
      unit: "s",
    },
    {
      kind: "toggle",
      key: "topBarArrows",
      label: "Show prev/next arrows",
      group: "Top bar",
    },
    {
      kind: "color",
      key: "topBarBg",
      label: "Top bar background",
      group: "Top bar",
    },
    {
      kind: "color",
      key: "topBarText",
      label: "Top bar text colour",
      group: "Top bar",
    },
    {
      kind: "choice",
      key: "topBarHeight",
      label: "Top bar height",
      group: "Top bar",
      choices: [
        { value: "28", label: "28px" },
        { value: "32", label: "32px" },
        { value: "36", label: "36px" },
      ],
    },

    // Logo
    {
      kind: "choice",
      key: "logoVariant",
      label: "Logo variant",
      group: "Logo",
      choices: [
        { value: "wordmark", label: "Wordmark" },
        { value: "full", label: "Full logo" },
        { value: "mascot", label: "Mascot only" },
        { value: "mascot-left", label: "Mascot + wordmark" },
      ],
    },
    {
      kind: "toggle",
      key: "sameLogoColor",
      label: "Use the same logo colour everywhere",
      group: "Logo",
    },
    {
      kind: "color",
      key: "logoColor",
      label: "Logo colour – cream header (after scrolling)",
      group: "Logo",
      allowOriginal: true,
    },
    {
      kind: "color",
      key: "logoColorOverHero",
      label: "Logo colour – over hero photo (top of home)",
      group: "Logo",
      allowOriginal: true,
    },
    {
      kind: "range",
      key: "logoHeightDesktop",
      label: "Logo height (desktop)",
      group: "Logo",
      min: 28,
      max: 56,
      step: 2,
      unit: "px",
    },
    {
      kind: "range",
      key: "logoHeightMobile",
      label: "Logo height (mobile)",
      group: "Logo",
      min: 24,
      max: 44,
      step: 2,
      unit: "px",
    },
    {
      kind: "choice",
      key: "logoPosition",
      label: "Logo position",
      group: "Logo",
      choices: [
        { value: "centre", label: "Centre" },
        { value: "left", label: "Left" },
      ],
    },

    // Header bar
    {
      kind: "range",
      key: "headerHeightDesktop",
      label: "Header height (desktop)",
      group: "Header bar",
      min: 56,
      max: 88,
      step: 4,
      unit: "px",
    },
    {
      kind: "range",
      key: "headerHeightMobile",
      label: "Header height (mobile)",
      group: "Header bar",
      min: 52,
      max: 72,
      step: 4,
      unit: "px",
    },
    {
      kind: "color",
      key: "headerBg",
      label: "Header background",
      group: "Header bar",
    },
    {
      kind: "color",
      key: "iconColor",
      label: "Icon & link colour",
      group: "Header bar",
    },
    {
      kind: "toggle",
      key: "borderBottom",
      label: "Bottom border",
      group: "Header bar",
    },
    {
      kind: "color",
      key: "borderColor",
      label: "Border colour",
      group: "Header bar",
    },
    {
      kind: "choice",
      key: "iconLabels",
      label: "Icon labels",
      group: "Header bar",
      choices: [
        { value: "icons", label: "Icons only" },
        { value: "icons+labels", label: "Icons + labels" },
      ],
    },
    {
      kind: "choice",
      key: "menuIcon",
      label: "Menu button style",
      group: "Header bar",
      choices: [
        { value: "3-lines", label: "3 lines" },
        { value: "2-lines", label: "2 lines" },
        { value: "menu-text", label: "Menu text" },
      ],
    },
    {
      kind: "toggle",
      key: "menuIconCircle",
      label: "Menu icon circle",
      group: "Header bar",
    },

    // Over the hero
    {
      kind: "toggle",
      key: "transparentOnHero",
      label: "Transparent over hero",
      group: "Over the hero",
    },
    {
      kind: "color",
      key: "iconColorOverHero",
      label: "Icon colour over hero",
      group: "Over the hero",
    },
    {
      kind: "range",
      key: "solidAfterPx",
      label: "Turn solid after scroll",
      group: "Over the hero",
      min: 20,
      max: 160,
      step: 10,
      unit: "px",
    },

    // Scrolling
    {
      kind: "choice",
      key: "scrollMode",
      label: "Scroll behaviour",
      group: "Scrolling",
      choices: [
        { value: "hide-show", label: "Hide on down, show on up" },
        { value: "always-visible", label: "Always sticky" },
        { value: "scrolls-away", label: "Scrolls away" },
      ],
    },

    // Right side
    {
      kind: "toggle",
      key: "countryOn",
      label: "Show country selector",
      group: "Right side",
    },
    {
      kind: "choice",
      key: "countryStyle",
      label: "Country style",
      group: "Right side",
      choices: [
        { value: "globe+text", label: "Globe + India" },
        { value: "globe-only", label: "Globe only" },
      ],
    },
    {
      kind: "toggle",
      key: "accountOn",
      label: "Show account icon",
      group: "Right side",
    },
    {
      kind: "color",
      key: "bagBadgeColor",
      label: "Bag count badge",
      group: "Right side",
    },
    {
      kind: "toggle",
      key: "whatsappOn",
      label: "Show WhatsApp button",
      group: "Right side",
    },

    // Drawer
    {
      kind: "choice",
      key: "drawerWidth",
      label: "Drawer width (desktop)",
      group: "Drawer",
      choices: [
        { value: "360", label: "360px" },
        { value: "400", label: "400px" },
        { value: "480", label: "480px" },
      ],
    },
    {
      kind: "color",
      key: "drawerBg",
      label: "Drawer background",
      group: "Drawer",
    },
    {
      kind: "choice",
      key: "tabStyle",
      label: "Department tab style",
      group: "Drawer",
      choices: [
        { value: "underline", label: "Underline" },
        { value: "pill", label: "Pill" },
      ],
    },
    {
      kind: "color",
      key: "highlightColor",
      label: "Highlight link colour",
      group: "Drawer",
    },
    {
      kind: "toggle",
      key: "showRecentlyViewed",
      label: "Show Recently viewed",
      group: "Drawer",
    },
    {
      kind: "toggle",
      key: "showNewsletter",
      label: "Show newsletter in drawer",
      group: "Drawer",
    },
    {
      kind: "toggle",
      key: "showCountryInDrawer",
      label: "Show country in drawer",
      group: "Drawer",
    },
  ],
};

export const customizerSections = [homeHeroSection, siteHeaderSection] as const;
export type SectionId = (typeof customizerSections)[number]["id"];
