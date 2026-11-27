import { images, type ImageKey } from "./images";
import type { DepartmentId } from "./navigation";

export const CAMPAIGN_LINK_OPTIONS = [
  { value: "/collections/baby-toddler", label: "Baby + Toddler (/collections/baby-toddler)" },
  { value: "/collections/everyday-comfort", label: "Everyday comfort (/collections/everyday-comfort)" },
  { value: "/collections/girls", label: "Girls (/collections/girls)" },
  { value: "/collections/boys", label: "Boys (/collections/boys)" },
  { value: "/gifting", label: "Gifting (/gifting)" },
  { value: "/collections/sibling-matching", label: "Sibling matching (/collections/sibling-matching)" },
  { value: "/collections/baby-new-in", label: "New in (/collections/baby-new-in)" },
  { value: "/collections/naming-ceremony", label: "Naming ceremony (/collections/naming-ceremony)" },
  { value: "/collections/festive", label: "Festive (/collections/festive)" },
  { value: "/collections/first-birthday", label: "First birthday (/collections/first-birthday)" },
  { value: "/shop", label: "Shop all (/shop)" },
] as const;

export const CAMPAIGN_IMAGE_OPTIONS: { value: ImageKey; label: string }[] = (
  Object.keys(images) as ImageKey[]
).map((key) => ({ value: key, label: key }));

const ALLOWED_LINKS: readonly string[] = CAMPAIGN_LINK_OPTIONS.map((o) => o.value);
const ALLOWED_IMAGES: readonly string[] = Object.keys(images);

export interface CampaignBannerItem {
  id: string;
  title: string;
  buttonText: string;
  href: string;
  imageKey: ImageKey;
  phoneImageKey: ImageKey;
  focusX: number;
  focusY: number;
  phoneFocusX: number;
  phoneFocusY: number;
  videoSrc: string;
}

export interface CampaignBannersConfig {
  height: "full" | "85" | "70";
  mediaType: "photo" | "video";
  titleSizeDesktop: number;
  titleSizeMobile: number;
  textPosition: "centre" | "bottom-centre" | "bottom-left";
  textOffsetY: number;
  buttonStyle: "outline" | "solid" | "link";
  bottomGradient: number;
  centreGlow: number;
  gapPx: 0 | 4 | 8 | 16;
  gapTop: boolean;
  departments: Record<DepartmentId, [CampaignBannerItem, CampaignBannerItem]>;
}

const SIBLING_BANNER: CampaignBannerItem = {
  id: "sib",
  title: "Little matches, big hugs",
  buttonText: "Shop sibling matching",
  href: "/collections/sibling-matching",
  imageKey: "banner-siblings",
  phoneImageKey: "banner-siblings-phone",
  focusX: 45,
  focusY: 40,
  phoneFocusX: 40,
  phoneFocusY: 40,
  videoSrc: "",
};

export const DEFAULT_CAMPAIGN_CONFIG: CampaignBannersConfig = {
  height: "full",
  mediaType: "photo",
  titleSizeDesktop: 48,
  titleSizeMobile: 32,
  textPosition: "centre",
  textOffsetY: 0,
  buttonStyle: "outline",
  bottomGradient: 60,
  centreGlow: 35,
  gapPx: 8,
  gapTop: true,
  departments: {
    "baby-toddler": [
      {
        id: "bt-1",
        title: "Soft enough for their very first days",
        buttonText: "Shop Baby + Toddler",
        href: "/collections/baby-toddler",
        imageKey: "banner-baby-toddler",
        phoneImageKey: "banner-baby-toddler-phone",
        focusX: 50,
        focusY: 45,
        phoneFocusX: 50,
        phoneFocusY: 45,
        videoSrc: "",
      },
      {
        id: "bt-2",
        title: "Made for crawling, napping and exploring",
        buttonText: "Shop everyday comfort",
        href: "/collections/everyday-comfort",
        imageKey: "banner-everyday",
        phoneImageKey: "banner-everyday-phone",
        focusX: 40,
        focusY: 50,
        phoneFocusX: 35,
        phoneFocusY: 50,
        videoSrc: "",
      },
    ],
    girls: [
      {
        id: "g-1",
        title: "Made to feel as good as they look",
        buttonText: "Shop girls",
        href: "/collections/girls",
        imageKey: "banner-girls",
        phoneImageKey: "banner-girls-phone",
        focusX: 40,
        focusY: 50,
        phoneFocusX: 25,
        phoneFocusY: 50,
        videoSrc: "",
      },
      { ...SIBLING_BANNER },
    ],
    boys: [
      {
        id: "b-1",
        title: "Made for little adventures",
        buttonText: "Shop boys",
        href: "/collections/boys",
        imageKey: "banner-boys",
        phoneImageKey: "banner-boys-phone",
        focusX: 50,
        focusY: 60,
        phoneFocusX: 50,
        phoneFocusY: 60,
        videoSrc: "",
      },
      { ...SIBLING_BANNER },
    ],
    gifting: [
      {
        id: "gf-1",
        title: "A soft first gift for a new little one",
        buttonText: "Shop gifts",
        href: "/gifting",
        imageKey: "banner-gift-baby",
        phoneImageKey: "banner-gift-baby-phone",
        focusX: 65,
        focusY: 50,
        phoneFocusX: 65,
        phoneFocusY: 50,
        videoSrc: "",
      },
      { ...SIBLING_BANNER },
    ],
  },
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

function clampText(val: unknown, fallback: string, maxLen: number): string {
  if (typeof val !== "string") return fallback;
  return val.slice(0, maxLen);
}

function pickChoice<T extends string | number>(
  val: unknown,
  allowed: readonly T[],
  fallback: T
): T {
  return (allowed as readonly unknown[]).includes(val)
    ? (val as T)
    : fallback;
}

function pickBool(val: unknown, fallback: boolean): boolean {
  return typeof val === "boolean" ? val : fallback;
}

function sanitizeVideoUrl(val: unknown): string {
  if (typeof val !== "string") return "";
  const trimmed = val.trim().slice(0, 120);
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

function validateBannerItem(
  raw: unknown,
  def: CampaignBannerItem
): CampaignBannerItem {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return def;
  const s = raw as Record<string, unknown>;
  return {
    id: def.id,
    title: clampText(s.title, def.title, 80),
    buttonText: clampText(s.buttonText, def.buttonText, 30),
    href: pickChoice(s.href, ALLOWED_LINKS, def.href),
    imageKey: pickChoice(s.imageKey, ALLOWED_IMAGES, def.imageKey) as ImageKey,
    phoneImageKey: pickChoice(
      s.phoneImageKey,
      ALLOWED_IMAGES,
      def.phoneImageKey
    ) as ImageKey,
    focusX: clampInt(s.focusX, 0, 100, def.focusX),
    focusY: clampInt(s.focusY, 0, 100, def.focusY),
    phoneFocusX: clampInt(s.phoneFocusX, 0, 100, def.phoneFocusX),
    phoneFocusY: clampInt(s.phoneFocusY, 0, 100, def.phoneFocusY),
    videoSrc: sanitizeVideoUrl(s.videoSrc),
  };
}

export function validateCampaignConfig(raw: unknown): CampaignBannersConfig {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return DEFAULT_CAMPAIGN_CONFIG;
  }
  const obj = raw as Record<string, unknown>;
  const def = DEFAULT_CAMPAIGN_CONFIG;
  const rawDepts =
    obj.departments &&
    typeof obj.departments === "object" &&
    !Array.isArray(obj.departments)
      ? (obj.departments as Record<string, unknown>)
      : {};

  const deptKeys: DepartmentId[] = ["baby-toddler", "girls", "boys", "gifting"];
  const departments = {} as Record<
    DepartmentId,
    [CampaignBannerItem, CampaignBannerItem]
  >;

  for (const dept of deptKeys) {
    const defPair = def.departments[dept];
    const rawPair = Array.isArray(rawDepts[dept])
      ? (rawDepts[dept] as unknown[])
      : [];
    departments[dept] = [
      validateBannerItem(rawPair[0], defPair[0]),
      validateBannerItem(rawPair[1], defPair[1]),
    ];
  }

  return {
    height: pickChoice(obj.height, ["full", "85", "70"] as const, def.height),
    mediaType: pickChoice(obj.mediaType, ["photo", "video"] as const, def.mediaType),
    titleSizeDesktop: clampInt(obj.titleSizeDesktop, 32, 72, def.titleSizeDesktop),
    titleSizeMobile: clampInt(obj.titleSizeMobile, 24, 48, def.titleSizeMobile),
    textPosition: pickChoice(
      obj.textPosition,
      ["centre", "bottom-centre", "bottom-left"] as const,
      def.textPosition
    ),
    textOffsetY: clampInt(obj.textOffsetY, -20, 20, def.textOffsetY),
    buttonStyle: pickChoice(
      obj.buttonStyle,
      ["outline", "solid", "link"] as const,
      def.buttonStyle
    ),
    bottomGradient: clampInt(obj.bottomGradient, 0, 80, def.bottomGradient),
    centreGlow: clampInt(obj.centreGlow, 0, 60, def.centreGlow),
    gapPx: pickChoice(obj.gapPx, [0, 4, 8, 16] as const, def.gapPx),
    gapTop: pickBool(obj.gapTop, def.gapTop),
    departments,
  };
}
