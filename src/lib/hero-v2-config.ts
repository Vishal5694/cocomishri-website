import type { ImageKey } from "./images";

export const HERO_V2_LINK_OPTIONS = [
  { value: "/collections/baby-new-in", label: "New in (/collections/baby-new-in)" },
  { value: "/our-story", label: "Our story (/our-story)" },
  { value: "/collections/naming-ceremony", label: "Naming ceremony (/collections/naming-ceremony)" },
  { value: "/collections/festive", label: "Festive (/collections/festive)" },
  { value: "/collections/baby-toddler", label: "Baby + Toddler (/collections/baby-toddler)" },
  { value: "/collections/girls", label: "Girls (/collections/girls)" },
  { value: "/collections/boys", label: "Boys (/collections/boys)" },
  { value: "/gifting", label: "Gifting (/gifting)" },
  { value: "/collections/everyday-comfort", label: "Everyday comfort (/collections/everyday-comfort)" },
  { value: "/collections/first-birthday", label: "First birthday (/collections/first-birthday)" },
  { value: "/shop", label: "Shop all (/shop)" },
] as const;

export const HERO_V2_OPTIONAL_LINK_OPTIONS = [
  { value: "", label: "None" },
  ...HERO_V2_LINK_OPTIONS,
] as const;

export const HERO_V2_IMAGE_OPTIONS: { value: ImageKey; label: string }[] = [
  { value: "hero-sweet", label: "Hero: Sweet (sea at sunset)" },
  { value: "hero-moments", label: "Hero: Moments (wildflowers)" },
  { value: "hero-dreams", label: "Hero: Dreams (flower basket)" },
  { value: "hero-thread", label: "Hero: Thread (newborn knit)" },
  { value: "hero-desktop", label: "v2 Slide 1 (mother & baby)" },
  { value: "v2-slide-2", label: "v2 Slide 2 (window daylight)" },
  { value: "v2-slide-3", label: "v2 Slide 3 (smiling baby)" },
  { value: "hero-baby-toddler", label: "Baby + Toddler" },
  { value: "hero-girls", label: "Girls" },
  { value: "hero-boys", label: "Boys" },
  { value: "hero-gifting", label: "Gifting" },
  { value: "hero-everyday", label: "Everyday comfort" },
  { value: "occasion-naming-ceremony", label: "Naming Ceremony Edit" },
  { value: "product-1", label: "New in" },
  { value: "occasion-festive", label: "Festive" },
  { value: "occasion-first-birthday", label: "First birthday" },
  { value: "story-hero", label: "Our story" },
];

const ALLOWED_IMAGE_KEYS: readonly string[] = HERO_V2_IMAGE_OPTIONS.map((o) => o.value);

const ALLOWED_HREFS: readonly string[] = HERO_V2_LINK_OPTIONS.map((o) => o.value);
const ALLOWED_OPTIONAL_HREFS: readonly string[] = HERO_V2_OPTIONAL_LINK_OPTIONS.map((o) => o.value);

export interface HeroV2SlideMeta {
  id: string;
  title: string;
  imageKey: ImageKey;
  mobileImageKey?: ImageKey;
  defaultEnabled: boolean;
  link1Text: string;
  link1Href: string;
  link2Text?: string;
  link2Href?: string;
  focusX: number;
  focusY: number;
}

export const AVAILABLE_HERO_V2_SLIDES: HeroV2SlideMeta[] = [
  {
    id: "baby-toddler",
    title: "Baby + Toddler",
    imageKey: "hero-baby-toddler",
    defaultEnabled: false,
    link1Text: "Shop now",
    link1Href: "/collections/baby-toddler",
    focusX: 50,
    focusY: 30,
  },
  {
    id: "girls",
    title: "Girls",
    imageKey: "hero-girls",
    defaultEnabled: false,
    link1Text: "Shop now",
    link1Href: "/collections/girls",
    focusX: 50,
    focusY: 25,
  },
  {
    id: "boys",
    title: "Boys",
    imageKey: "hero-boys",
    defaultEnabled: false,
    link1Text: "Shop now",
    link1Href: "/collections/boys",
    focusX: 50,
    focusY: 20,
  },
  {
    id: "gifting",
    title: "Gifting",
    imageKey: "hero-gifting",
    defaultEnabled: false,
    link1Text: "Shop now",
    link1Href: "/gifting",
    focusX: 50,
    focusY: 50,
  },
  {
    id: "everyday",
    title: "Everyday comfort",
    imageKey: "hero-everyday",
    defaultEnabled: false,
    link1Text: "Shop now",
    link1Href: "/collections/everyday-comfort",
    focusX: 50,
    focusY: 68,
  },
  {
    id: "naming-ceremony",
    title: "Naming Ceremony Edit",
    imageKey: "occasion-naming-ceremony",
    defaultEnabled: false,
    link1Text: "Shop now",
    link1Href: "/collections/naming-ceremony",
    focusX: 50,
    focusY: 30,
  },
  {
    id: "new-in",
    title: "New in",
    imageKey: "product-1",
    defaultEnabled: false,
    link1Text: "Shop now",
    link1Href: "/collections/baby-new-in",
    focusX: 50,
    focusY: 35,
  },
  {
    id: "festive",
    title: "Festive",
    imageKey: "occasion-festive",
    defaultEnabled: false,
    link1Text: "Shop now",
    link1Href: "/collections/festive",
    focusX: 75,
    focusY: 50,
  },
  {
    id: "first-birthday",
    title: "First birthday",
    imageKey: "occasion-first-birthday",
    defaultEnabled: false,
    link1Text: "Shop now",
    link1Href: "/collections/first-birthday",
    focusX: 50,
    focusY: 30,
  },
  {
    id: "our-story",
    title: "Our story",
    imageKey: "story-hero",
    defaultEnabled: false,
    link1Text: "Read our story",
    link1Href: "/our-story",
    focusX: 50,
    focusY: 35,
  },
  {
    id: "slide-1",
    title: "Sweet like Mishri. Soft like a hug.",
    imageKey: "hero-sweet",
    defaultEnabled: true,
    link1Text: "New arrivals",
    link1Href: "/collections/baby-new-in",
    focusX: 50,
    focusY: 50,
  },
  {
    id: "slide-2",
    title: "Made for little moments. Loved for a lifetime.",
    imageKey: "hero-moments",
    defaultEnabled: true,
    link1Text: "SHOP FIT+",
    link1Href: "/shop",
    focusX: 50,
    focusY: 50,
  },
  {
    id: "slide-3",
    title: "Where little dreams wear love",
    imageKey: "hero-dreams",
    defaultEnabled: true,
    link1Text: "SHOP COCO CORE",
    link1Href: "/shop",
    focusX: 50,
    focusY: 50,
  },
  {
    id: "slide-4",
    title: "Love in Every Little Thread.",
    imageKey: "hero-thread",
    defaultEnabled: true,
    link1Text: "Discover the collection",
    link1Href: "/shop",
    focusX: 70,
    focusY: 45,
  },
];

export interface HeroV2SlideSetting {
  id: string;
  enabled: boolean;
  title: string;
  imageKey: ImageKey;
  link1Text: string;
  link1Href: string;
  link2Text: string;
  link2Href: string;
  focusX: number;
  focusY: number;
  previewVideoUrl: string;
}

export interface HeroV2Controls {
  arrows: boolean;
  dots: boolean;
  pause: boolean;
  progress: boolean;
  counter: boolean;
  swipe: boolean;
}

export interface HeroV2Config {
  height: "full" | "85" | "70";
  mediaType: "photo" | "video";
  slides: HeroV2SlideSetting[];
  textPosition: "bottom-centre" | "centre" | "bottom-left" | "left-middle";
  titleSizeDesktop: number;
  titleSizeMobile: number;
  headingText: string;
  headingVisible: boolean;
  linkStyle: "link" | "outline" | "solid";
  autoplay: boolean;
  intervalSec: number;
  transition: "fade" | "slide";
  controls: HeroV2Controls;
  scrimPercent: number;
  placeholderMode: "sample" | "colour";
}

function buildDefaultSlides(): HeroV2SlideSetting[] {
  return AVAILABLE_HERO_V2_SLIDES.map((s) => ({
    id: s.id,
    enabled: s.defaultEnabled,
    title: s.title,
    imageKey: s.imageKey,
    link1Text: s.link1Text,
    link1Href: s.link1Href,
    link2Text: s.link2Text || "",
    link2Href: s.link2Href || "",
    focusX: s.focusX,
    focusY: s.focusY,
    previewVideoUrl: "",
  }));
}

export const DEFAULT_HERO_V2_CONFIG: HeroV2Config = {
  height: "full",
  mediaType: "video",
  slides: buildDefaultSlides(),
  textPosition: "bottom-centre",
  titleSizeDesktop: 48,
  titleSizeMobile: 32,
  headingText: "Sweet like Mishri. Soft like a hug.",
  headingVisible: false,
  linkStyle: "link",
  autoplay: true,
  intervalSec: 5,
  transition: "fade",
  controls: {
    arrows: true,
    dots: true,
    pause: false,
    progress: false,
    counter: false,
    swipe: true,
  },
  scrimPercent: 60,
  placeholderMode: "sample",
};

function clampInt(
  val: unknown,
  min: number,
  max: number,
  fallback: number
): number {
  if (typeof val !== "number" || !Number.isFinite(val)) return fallback;
  return Math.max(min, Math.min(max, Math.round(val)));
}

function clampText(val: unknown, fallback: string, maxLen = 80): string {
  if (typeof val !== "string") return fallback;
  return val.slice(0, maxLen);
}

function pickChoice<T extends string>(
  val: unknown,
  allowed: readonly T[],
  fallback: T
): T {
  return typeof val === "string" && (allowed as readonly string[]).includes(val)
    ? (val as T)
    : fallback;
}

function pickBool(val: unknown, fallback: boolean): boolean {
  return typeof val === "boolean" ? val : fallback;
}

function sanitizeVideoUrl(val: unknown): string {
  if (typeof val !== "string") return "";
  const trimmed = val.trim().slice(0, 80);
  if (!trimmed) return "";
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://")
  ) {
    return trimmed;
  }
  return "";
}

export function validateHeroV2Config(raw: unknown): HeroV2Config {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return DEFAULT_HERO_V2_CONFIG;
  }

  const obj = raw as Record<string, unknown>;
  const def = DEFAULT_HERO_V2_CONFIG;
  const defSlideMap = new Map(def.slides.map((s) => [s.id, s]));

  const validatedSlides: HeroV2SlideSetting[] = [];
  const seenIds = new Set<string>();

  if (Array.isArray(obj.slides)) {
    for (const item of obj.slides) {
      if (!item || typeof item !== "object" || Array.isArray(item)) continue;
      const s = item as Record<string, unknown>;
      if (typeof s.id !== "string" || seenIds.has(s.id)) continue;
      const d = defSlideMap.get(s.id);
      if (!d) continue;
      seenIds.add(s.id);
      validatedSlides.push({
        id: d.id,
        enabled: pickBool(s.enabled, d.enabled),
        title: clampText(s.title, d.title, 80),
        imageKey: pickChoice(
          s.imageKey,
          ALLOWED_IMAGE_KEYS,
          d.imageKey
        ) as ImageKey,
        link1Text: clampText(s.link1Text, d.link1Text, 80),
        link1Href: pickChoice(s.link1Href, ALLOWED_HREFS, d.link1Href),
        link2Text: clampText(s.link2Text, d.link2Text, 80),
        link2Href: pickChoice(s.link2Href, ALLOWED_OPTIONAL_HREFS, d.link2Href),
        focusX: clampInt(s.focusX, 0, 100, d.focusX),
        focusY: clampInt(s.focusY, 0, 100, d.focusY),
        previewVideoUrl: sanitizeVideoUrl(s.previewVideoUrl),
      });
    }
  }

  for (const d of def.slides) {
    if (!seenIds.has(d.id)) {
      validatedSlides.push(d);
    }
  }

  if (!validatedSlides.some((s) => s.enabled) && validatedSlides.length > 0) {
    validatedSlides[0] = { ...validatedSlides[0], enabled: true };
  }

  const rawControls =
    obj.controls && typeof obj.controls === "object" && !Array.isArray(obj.controls)
      ? (obj.controls as Record<string, unknown>)
      : {};

  return {
    height: pickChoice(obj.height, ["full", "85", "70"] as const, def.height),
    mediaType: pickChoice(obj.mediaType, ["photo", "video"] as const, def.mediaType),
    slides: validatedSlides,
    textPosition: pickChoice(
      obj.textPosition,
      ["bottom-centre", "centre", "bottom-left", "left-middle"] as const,
      def.textPosition
    ),
    titleSizeDesktop: clampInt(obj.titleSizeDesktop, 32, 72, def.titleSizeDesktop),
    titleSizeMobile: clampInt(obj.titleSizeMobile, 28, 48, def.titleSizeMobile),
    headingText: clampText(obj.headingText, def.headingText, 80),
    headingVisible: pickBool(obj.headingVisible, def.headingVisible),
    linkStyle: pickChoice(
      obj.linkStyle,
      ["link", "outline", "solid"] as const,
      def.linkStyle
    ),
    autoplay: pickBool(obj.autoplay, def.autoplay),
    intervalSec: clampInt(obj.intervalSec, 3, 10, def.intervalSec),
    transition: pickChoice(obj.transition, ["fade", "slide"] as const, def.transition),
    controls: {
      arrows: pickBool(rawControls.arrows, def.controls.arrows),
      dots: pickBool(rawControls.dots, def.controls.dots),
      pause: pickBool(rawControls.pause, def.controls.pause),
      progress: pickBool(rawControls.progress, def.controls.progress),
      counter: pickBool(rawControls.counter, def.controls.counter),
      swipe: pickBool(rawControls.swipe, def.controls.swipe),
    },
    scrimPercent: clampInt(obj.scrimPercent, 15, 60, def.scrimPercent),
    placeholderMode: pickChoice(
      obj.placeholderMode,
      ["sample", "colour"] as const,
      def.placeholderMode
    ),
  };
}
