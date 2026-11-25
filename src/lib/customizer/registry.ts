import {
  DEFAULT_HERO_CONFIG,
  validateHeroConfig,
  type HeroConfig,
} from "@/lib/hero-config";
import {
  DEFAULT_HEADER_CONFIG,
  validateHeaderConfig,
  type HeaderConfig,
} from "@/lib/header-config";
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
