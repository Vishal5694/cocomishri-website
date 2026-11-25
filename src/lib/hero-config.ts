import { availableHeroSlides, parseFocusPercent } from "./hero";

export interface SlideSetting {
  id: string;
  enabled: boolean;
  title: string;
  line: string;
  buttonText: string;
  focusX: number;
  focusY: number;
  previewVideoUrl: string;
}

export interface HeroControls {
  dots: boolean;
  arrows: boolean;
  progress: boolean;
  counter: boolean;
  pause: boolean;
  swipe: boolean;
}

export interface HeroConfig {
  mediaType: "video" | "photo";
  slides: SlideSetting[];
  textMode: "none" | "title-button" | "title-line-button";
  textPosition: "centre" | "bottom-centre" | "bottom-left" | "left-middle";
  headingText: string;
  headingVisible: boolean;
  height: "full" | "85" | "70";
  autoplay: boolean;
  intervalSec: number;
  transition: "fade" | "slide";
  controls: HeroControls;
  buttonStyle: "outline" | "solid" | "link";
  scrimPercent: number;
  placeholderMode: "sample" | "colour";
}

function buildDefaultSlides(): SlideSetting[] {
  return availableHeroSlides.map((slide) => {
    const { x, y } = parseFocusPercent(slide.focus);
    return {
      id: slide.id,
      enabled: slide.defaultEnabled !== false,
      title: slide.title,
      line: "",
      buttonText: slide.defaultButtonText || "Shop now",
      focusX: x,
      focusY: y,
      previewVideoUrl: "",
    };
  });
}

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  mediaType: "video",
  slides: buildDefaultSlides(),
  textMode: "title-button",
  textPosition: "centre",
  headingText: "Sweet like Mishri. Soft like a hug.",
  headingVisible: false,
  height: "full",
  autoplay: true,
  intervalSec: 7,
  transition: "fade",
  controls: {
    dots: true,
    arrows: false,
    progress: false,
    counter: false,
    pause: true,
    swipe: true,
  },
  buttonStyle: "outline",
  scrimPercent: 35,
  placeholderMode: "sample",
};

function clampInt(val: unknown, min: number, max: number, fallback: number): number {
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

export function validateHeroConfig(raw: unknown): HeroConfig {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return DEFAULT_HERO_CONFIG;
  }

  const obj = raw as Record<string, unknown>;
  const defaults = DEFAULT_HERO_CONFIG;
  const defaultSlideMap = new Map(defaults.slides.map((s) => [s.id, s]));

  // Validate slides list: preserve valid order, drop unknown IDs, append missing defaults
  const validatedSlides: SlideSetting[] = [];
  const seenIds = new Set<string>();

  if (Array.isArray(obj.slides)) {
    for (const item of obj.slides) {
      if (!item || typeof item !== "object" || Array.isArray(item)) continue;
      const s = item as Record<string, unknown>;
      if (typeof s.id !== "string" || seenIds.has(s.id)) continue;
      const def = defaultSlideMap.get(s.id);
      if (!def) continue;

      seenIds.add(s.id);
      validatedSlides.push({
        id: def.id,
        enabled: pickBool(s.enabled, def.enabled),
        title: clampText(s.title, def.title, 80),
        line: clampText(s.line, def.line, 80),
        buttonText: clampText(s.buttonText, def.buttonText, 80),
        focusX: clampInt(s.focusX, 0, 100, def.focusX),
        focusY: clampInt(s.focusY, 0, 100, def.focusY),
        previewVideoUrl: sanitizeVideoUrl(s.previewVideoUrl),
      });
    }
  }

  for (const def of defaults.slides) {
    if (!seenIds.has(def.id)) {
      validatedSlides.push({ ...def });
    }
  }

  // Ensure at least one slide is enabled
  if (!validatedSlides.some((s) => s.enabled)) {
    validatedSlides[0].enabled = true;
  }

  const rawControls =
    obj.controls && typeof obj.controls === "object" && !Array.isArray(obj.controls)
      ? (obj.controls as Record<string, unknown>)
      : {};

  return {
    mediaType: pickChoice(obj.mediaType, ["video", "photo"] as const, defaults.mediaType),
    slides: validatedSlides,
    textMode: pickChoice(
      obj.textMode,
      ["none", "title-button", "title-line-button"] as const,
      defaults.textMode
    ),
    textPosition: pickChoice(
      obj.textPosition,
      ["centre", "bottom-centre", "bottom-left", "left-middle"] as const,
      defaults.textPosition
    ),
    headingText: clampText(obj.headingText, defaults.headingText, 80),
    headingVisible: pickBool(obj.headingVisible, defaults.headingVisible),
    height: pickChoice(obj.height, ["full", "85", "70"] as const, defaults.height),
    autoplay: pickBool(obj.autoplay, defaults.autoplay),
    intervalSec: clampInt(obj.intervalSec, 3, 10, defaults.intervalSec),
    transition: pickChoice(obj.transition, ["fade", "slide"] as const, defaults.transition),
    controls: {
      dots: pickBool(rawControls.dots, defaults.controls.dots),
      arrows: pickBool(rawControls.arrows, defaults.controls.arrows),
      progress: pickBool(rawControls.progress, defaults.controls.progress),
      counter: pickBool(rawControls.counter, defaults.controls.counter),
      pause: pickBool(rawControls.pause, defaults.controls.pause),
      swipe: pickBool(rawControls.swipe, defaults.controls.swipe),
    },
    buttonStyle: pickChoice(
      obj.buttonStyle,
      ["outline", "solid", "link"] as const,
      defaults.buttonStyle
    ),
    scrimPercent: clampInt(obj.scrimPercent, 15, 60, defaults.scrimPercent),
    placeholderMode: pickChoice(
      obj.placeholderMode,
      ["sample", "colour"] as const,
      defaults.placeholderMode
    ),
  };
}
