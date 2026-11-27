import type { ImageKey } from "./images";

export interface HeroV2SlideSetting {
  readonly id: string;
  readonly enabled: boolean;
  readonly title: string;
  readonly imageKey: ImageKey;
  readonly link1Text: string;
  readonly link1Href: string;
  readonly link2Text: string;
  readonly link2Href: string;
  readonly focusX: number;
  readonly focusY: number;
  readonly previewVideoUrl: string;
}

export interface HeroV2Controls {
  readonly arrows: boolean;
  readonly dots: boolean;
  readonly pause: boolean;
  readonly progress: boolean;
  readonly counter: boolean;
  readonly swipe: boolean;
}

export interface HeroV2Config {
  readonly height: "full" | "85" | "70";
  readonly mediaType: "photo" | "video";
  readonly slides: readonly HeroV2SlideSetting[];
  readonly textPosition: "bottom-centre" | "centre" | "bottom-left" | "left-middle";
  readonly titleSizeDesktop: number;
  readonly titleSizeMobile: number;
  readonly headingText: string;
  readonly headingVisible: boolean;
  readonly linkStyle: "link" | "outline" | "solid";
  readonly autoplay: boolean;
  readonly intervalSec: number;
  readonly transition: "fade" | "slide";
  readonly controls: HeroV2Controls;
  readonly scrimPercent: number;
  readonly placeholderMode: "sample" | "colour";
}

// LOCKED by owner on 2026-11-28. Do not change without written approval.
export const HERO_CONFIG: Readonly<HeroV2Config> = Object.freeze({
  height: "full",
  mediaType: "video",
  slides: Object.freeze([
    Object.freeze({
      id: "slide-1",
      enabled: true,
      title: "Sweet like Mishri. Soft like a hug.",
      imageKey: "hero-sweet",
      link1Text: "New arrivals",
      link1Href: "/collections/baby-new-in",
      link2Text: "",
      link2Href: "",
      focusX: 50,
      focusY: 50,
      previewVideoUrl: "",
    }),
    Object.freeze({
      id: "slide-2",
      enabled: true,
      title: "Made for little moments. Loved for a lifetime.",
      imageKey: "hero-moments",
      link1Text: "SHOP FIT+",
      link1Href: "/shop",
      link2Text: "",
      link2Href: "",
      focusX: 50,
      focusY: 50,
      previewVideoUrl: "",
    }),
    Object.freeze({
      id: "slide-3",
      enabled: true,
      title: "Where little dreams wear love",
      imageKey: "hero-dreams",
      link1Text: "SHOP COCO CORE",
      link1Href: "/shop",
      link2Text: "",
      link2Href: "",
      focusX: 50,
      focusY: 50,
      previewVideoUrl: "",
    }),
    Object.freeze({
      id: "slide-4",
      enabled: true,
      title: "Love in Every Little Thread.",
      imageKey: "hero-thread",
      link1Text: "Discover the collection",
      link1Href: "/shop",
      link2Text: "",
      link2Href: "",
      focusX: 70,
      focusY: 45,
      previewVideoUrl: "",
    }),
  ]),
  textPosition: "bottom-centre",
  titleSizeDesktop: 48,
  titleSizeMobile: 32,
  headingText: "Sweet like Mishri. Soft like a hug.",
  headingVisible: false,
  linkStyle: "link",
  autoplay: true,
  intervalSec: 5,
  transition: "fade",
  controls: Object.freeze({
    arrows: true,
    dots: true,
    pause: false,
    progress: false,
    counter: false,
    swipe: true,
  }),
  scrimPercent: 60,
  placeholderMode: "sample",
});
