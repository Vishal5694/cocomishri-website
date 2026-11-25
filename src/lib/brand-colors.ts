export const brandColors = [
  { key: "cocoa-900", hex: "#452104" },
  { key: "cocoa-700", hex: "#6B4A35" },
  { key: "cocoa-500", hex: "#8C6B55" },
  { key: "blush-700", hex: "#9A4F45" },
  { key: "blush-500", hex: "#D4917F" },
  { key: "blush-100", hex: "#F8E6DF" },
  { key: "caramel-700", hex: "#94521F" },
  { key: "caramel-500", hex: "#D18F5A" },
  { key: "caramel-100", hex: "#F7E8D8" },
  { key: "sage-700", hex: "#56633A" },
  { key: "sage-500", hex: "#98A865" },
  { key: "sage-100", hex: "#EEF0DF" },
  { key: "cream-50", hex: "#FCF8F2" },
  { key: "sand-100", hex: "#F4EADD" },
  { key: "sand-300", hex: "#E3CFB6" },
  { key: "amber-500", hex: "#D27821" },
] as const;

export type BrandColorKey = (typeof brandColors)[number]["key"];
export type LogoColorKey = BrandColorKey | "original" | "original-light";

const HEX_MAP = new Map<string, string>(
  brandColors.map((c) => [c.key, c.hex])
);

export function isBrandColorKey(val: unknown): val is BrandColorKey {
  return typeof val === "string" && HEX_MAP.has(val);
}

export function getBrandHex(key: BrandColorKey): string {
  return HEX_MAP.get(key) ?? "#452104";
}

function relativeLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return (
    0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
  );
}

export function contrastRatio(hexA: string, hexB: string): number {
  const l1 = relativeLuminance(hexA);
  const l2 = relativeLuminance(hexB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
