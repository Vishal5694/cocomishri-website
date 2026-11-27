export type WorldBg = "cream-50" | "sand-100" | "blush-100" | "caramel-100";
export type WorldSpeed = "slow" | "normal" | "fast";
export type MascotPosition = "below" | "above";

export interface WorldConfig {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  lead: string;
  body1: string;
  body2: string;
  body3: string;
  highlightWords: string;
  closing: string;
  headingSizeDesktop: number;
  headingSizeMobile: number;
  bodySize: number;
  background: WorldBg;
  sectionPadding: number;
  animationOn: boolean;
  speed: WorldSpeed;
  inkOn: boolean;
  stitchOn: boolean;
  crystalsOn: boolean;
  mascotOn: boolean;
  mascotWidth: number;
  mascotPosition: MascotPosition;
  mascotBreathing: boolean;
}

export const DEFAULT_WORLD_CONFIG: WorldConfig = {
  eyebrow: "The world of Cocomishri",
  headingLine1: "Little ones.",
  headingLine2: "Thoughtfully dressed.",
  lead: "At Cocomishri, we believe childhood deserves a little extra thought.",
  body1:
    "Inspired by the beauty of little moments and the joy of growing up, we create thoughtfully designed clothing that brings together comfort, quality, and timeless style.",
  body2:
    "From carefully selected fabrics to considered details and playful designs, every piece is made with little ones in mind.",
  body3:
    "Because childhood is not about dressing up. It's about feeling free to explore, play, dream, and grow.",
  highlightWords: "explore, play, dream, grow",
  closing: "Made with care. Created for little adventures.",
  headingSizeDesktop: 40,
  headingSizeMobile: 28,
  bodySize: 16,
  background: "cream-50",
  sectionPadding: 96,
  animationOn: true,
  speed: "normal",
  inkOn: true,
  stitchOn: true,
  crystalsOn: true,
  mascotOn: true,
  mascotWidth: 128,
  mascotPosition: "below",
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
    eyebrow: clampText(obj.eyebrow, def.eyebrow, 40),
    headingLine1: clampText(obj.headingLine1, def.headingLine1, 40),
    headingLine2: clampText(obj.headingLine2, def.headingLine2, 40),
    lead: clampText(obj.lead, def.lead, 120),
    body1: clampText(obj.body1, def.body1, 280),
    body2: clampText(obj.body2, def.body2, 280),
    body3: clampText(obj.body3, def.body3, 280),
    highlightWords: clampText(obj.highlightWords, def.highlightWords, 120),
    closing: clampText(obj.closing, def.closing, 80),
    headingSizeDesktop: clampInt(obj.headingSizeDesktop, 28, 56, def.headingSizeDesktop),
    headingSizeMobile: clampInt(obj.headingSizeMobile, 22, 40, def.headingSizeMobile),
    bodySize: clampInt(obj.bodySize, 14, 18, def.bodySize),
    background: pickChoice(
      obj.background,
      ["cream-50", "sand-100", "blush-100", "caramel-100"] as const,
      def.background
    ),
    sectionPadding: clampInt(obj.sectionPadding, 48, 144, def.sectionPadding),
    animationOn: pickBool(obj.animationOn, def.animationOn),
    speed: pickChoice(obj.speed, ["slow", "normal", "fast"] as const, def.speed),
    inkOn: pickBool(obj.inkOn, def.inkOn),
    stitchOn: pickBool(obj.stitchOn, def.stitchOn),
    crystalsOn: pickBool(obj.crystalsOn, def.crystalsOn),
    mascotOn: pickBool(obj.mascotOn, def.mascotOn),
    mascotWidth: clampInt(obj.mascotWidth, 80, 200, def.mascotWidth),
    mascotPosition: pickChoice(obj.mascotPosition, ["below", "above"] as const, def.mascotPosition),
    mascotBreathing: pickBool(obj.mascotBreathing, def.mascotBreathing),
  };
}
