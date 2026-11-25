import type { ImageKey } from "./images";

export type HeroSlide = {
  id: string;
  title: string;
  href: string;
  imageKey: ImageKey;
  videoSrc?: string;
  focus: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "baby-toddler",
    title: "Baby + Toddler",
    href: "/collections/baby-toddler",
    imageKey: "hero-baby-toddler",
    focus: "50% 30%",
  },
  {
    id: "girls",
    title: "Girls",
    href: "/collections/girls",
    imageKey: "hero-girls",
    focus: "50% 25%",
  },
  {
    id: "boys",
    title: "Boys",
    href: "/collections/boys",
    imageKey: "hero-boys",
    focus: "50% 20%",
  },
  {
    id: "gifting",
    title: "Gifting",
    href: "/gifting",
    imageKey: "hero-gifting",
    focus: "50% 50%",
  },
  {
    id: "everyday",
    title: "Everyday comfort",
    href: "/collections/everyday-comfort",
    imageKey: "hero-everyday",
    focus: "50% 68%",
  },
];
