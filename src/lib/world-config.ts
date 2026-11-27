export type WorldBg = "fabric" | "cream-50" | "sand-100";
export type WorldSpeed = "slow" | "normal" | "fast";

export interface WorldConfig {
  title: string;
  subtitle: string;
  paragraph: string;
  highlightWords: string;
  closing: string;
  eyebrowSizeDesktop: number;
  eyebrowSizeMobile: number;
  logoWidthDesktop: number;
  logoWidthMobile: number;
  bodySize: number;
  paragraphMaxWidthRem: number;
  background: WorldBg;
  weaveStrength: number;
  grainStrength: number;
  sectionPadding: number;
  watermarkOn: boolean;
  watermarkOpacity: number;
  watermarkSize: number;
  watermarkOffsetY: number;
  animationOn: boolean;
  speed: WorldSpeed;
  inkOn: boolean;
  stitchOn: boolean;
  crystalsOn: boolean;
  mascotOn: boolean;
  mascotWidth: number;
  mascotBreathing: boolean;
}

export const DEFAULT_WORLD_CONFIG: WorldConfig = {
  title: "THE WORLD OF",
  subtitle: "Little Ones. Thoughtfully Dressed.",
  paragraph:
    "At Cocomishri, we believe childhood deserves a little extra thought. Inspired by life's little moments, we create comfortable, timeless clothing with carefully chosen fabrics, considered details, and playful designs. Because childhood isn't about dressing up. It's about feeling free to explore, play, dream, and grow.",
  highlightWords: "explore, play, dream, grow",
  closing: "Made with care. Created for little adventures.",
  eyebrowSizeDesktop: 30,
  eyebrowSizeMobile: 18,
  logoWidthDesktop: 560,
  logoWidthMobile: 315,
  bodySize: 17,
  paragraphMaxWidthRem: 54,
  background: "fabric",
  weaveStrength: 100,
  grainStrength: 100,
  sectionPadding: 112,
  watermarkOn: true,
  watermarkOpacity: 0.08,
  watermarkSize: 720,
  watermarkOffsetY: 0,
  animationOn: true,
  speed: "normal",
  inkOn: true,
  stitchOn: true,
  crystalsOn: true,
  mascotOn: false,
  mascotWidth: 128,
  mascotBreathing: true,
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

function clampFloat(
  val: unknown,
  min: number,
  max: number,
  fallback: number
): number {
  if (typeof val !== "number" || !Number.isFinite(val)) return fallback;
  return Math.max(min, Math.min(max, Math.round(val * 100) / 100));
}

function clampText(val: unknown, fallback: string, maxLen: number): string {
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

export function validateWorldConfig(raw: unknown): WorldConfig {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return DEFAULT_WORLD_CONFIG;
  }
  const obj = raw as Record<string, unknown>;
  const def = DEFAULT_WORLD_CONFIG;

  return {
    title: clampText(obj.title, def.title, 80),
    subtitle: clampText(obj.subtitle, def.subtitle, 100),
    paragraph: clampText(obj.paragraph, def.paragraph, 500),
    highlightWords: clampText(obj.highlightWords, def.highlightWords, 120),
    closing: clampText(obj.closing, def.closing, 80),
    eyebrowSizeDesktop: clampInt(obj.eyebrowSizeDesktop, 20, 40, def.eyebrowSizeDesktop),
    eyebrowSizeMobile: clampInt(obj.eyebrowSizeMobile, 14, 24, def.eyebrowSizeMobile),
    logoWidthDesktop: clampInt(obj.logoWidthDesktop, 360, 720, def.logoWidthDesktop),
    logoWidthMobile: clampInt(obj.logoWidthMobile, 220, 360, def.logoWidthMobile),
    bodySize: clampInt(obj.bodySize, 14, 18, def.bodySize),
    paragraphMaxWidthRem: clampInt(
      obj.paragraphMaxWidthRem,
      40,
      64,
      def.paragraphMaxWidthRem
    ),
    background: pickChoice(
      obj.background,
      ["fabric", "cream-50", "sand-100"] as const,
      def.background
    ),
    weaveStrength: clampInt(obj.weaveStrength, 0, 100, def.weaveStrength),
    grainStrength: clampInt(obj.grainStrength, 0, 100, def.grainStrength),
    sectionPadding: clampInt(obj.sectionPadding, 48, 144, def.sectionPadding),
    watermarkOn: pickBool(obj.watermarkOn, def.watermarkOn),
    watermarkOpacity: clampFloat(
      obj.watermarkOpacity,
      0.03,
      0.12,
      def.watermarkOpacity
    ),
    watermarkSize: clampInt(obj.watermarkSize, 300, 800, def.watermarkSize),
    watermarkOffsetY: clampInt(obj.watermarkOffsetY, -30, 30, def.watermarkOffsetY),
    animationOn: pickBool(obj.animationOn, def.animationOn),
    speed: pickChoice(obj.speed, ["slow", "normal", "fast"] as const, def.speed),
    inkOn: pickBool(obj.inkOn, def.inkOn),
    stitchOn: pickBool(obj.stitchOn, def.stitchOn),
    crystalsOn: pickBool(obj.crystalsOn, def.crystalsOn),
    mascotOn: pickBool(obj.mascotOn, def.mascotOn),
    mascotWidth: clampInt(obj.mascotWidth, 80, 200, def.mascotWidth),
    mascotBreathing: pickBool(obj.mascotBreathing, def.mascotBreathing),
  };
}
