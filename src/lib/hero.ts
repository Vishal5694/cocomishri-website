import type { ImageKey } from "./images";

export type HeroSlide = {
  id: string;
  title: string;
  href: string;
  imageKey: ImageKey;
  videoSrc?: string;
  focus: string;
  defaultEnabled?: boolean;
  defaultButtonText?: string;
};

export const availableHeroSlides: HeroSlide[] = [
  {
    id: "baby-toddler",
    title: "Baby + Toddler",
    href: "/collections/baby-toddler",
    imageKey: "hero-baby-toddler",
    focus: "50% 30%",
    defaultEnabled: true,
    defaultButtonText: "Shop now",
  },
  {
    id: "girls",
    title: "Girls",
    href: "/collections/girls",
    imageKey: "hero-girls",
    focus: "50% 25%",
    defaultEnabled: true,
    defaultButtonText: "Shop now",
  },
  {
    id: "boys",
    title: "Boys",
    href: "/collections/boys",
    imageKey: "hero-boys",
    focus: "50% 20%",
    defaultEnabled: true,
    defaultButtonText: "Shop now",
  },
  {
    id: "gifting",
    title: "Gifting",
    href: "/gifting",
    imageKey: "hero-gifting",
    focus: "50% 50%",
    defaultEnabled: true,
    defaultButtonText: "Shop now",
  },
  {
    id: "everyday",
    title: "Everyday comfort",
    href: "/collections/everyday-comfort",
    imageKey: "hero-everyday",
    focus: "50% 68%",
    defaultEnabled: true,
    defaultButtonText: "Shop now",
  },
  {
    id: "naming-ceremony",
    title: "Naming Ceremony Edit",
    href: "/collections/naming-ceremony",
    imageKey: "occasion-naming-ceremony",
    focus: "50% 30%",
    defaultEnabled: false,
    defaultButtonText: "Shop now",
  },
  {
    id: "new-in",
    title: "New in",
    href: "/collections/baby-new-in",
    imageKey: "product-1",
    focus: "50% 35%",
    defaultEnabled: false,
    defaultButtonText: "Shop now",
  },
  {
    id: "festive",
    title: "Festive",
    href: "/collections/festive",
    imageKey: "occasion-festive",
    focus: "75% 50%",
    defaultEnabled: false,
    defaultButtonText: "Shop now",
  },
  {
    id: "first-birthday",
    title: "First birthday",
    href: "/collections/first-birthday",
    imageKey: "occasion-first-birthday",
    focus: "50% 30%",
    defaultEnabled: false,
    defaultButtonText: "Shop now",
  },
  {
    id: "our-story",
    title: "Our story",
    href: "/our-story",
    imageKey: "story-hero",
    focus: "50% 35%",
    defaultEnabled: false,
    defaultButtonText: "Read our story",
  },
];

export const heroSlides: HeroSlide[] = availableHeroSlides.filter(
  (s) => s.defaultEnabled !== false
);

export function parseFocusPercent(focus: string): { x: number; y: number } {
  const parts = focus.trim().split(/\s+/);
  const parse = (val: string | undefined, fallback: number) => {
    if (!val) return fallback;
    const n = parseFloat(val);
    return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : fallback;
  };
  return {
    x: parse(parts[0], 50),
    y: parse(parts[1], 50),
  };
}
