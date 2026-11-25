import {
  isBrandColorKey,
  type BrandColorKey,
  type LogoColorKey,
} from "./brand-colors";
import { siteConfig } from "./site-config";

export type LogoVariant = "wordmark" | "full" | "mascot" | "mascot-left";
export type LogoPosition = "centre" | "left";
export type IconLabelsMode = "icons" | "icons+labels";
export type MenuIconStyle = "3-lines" | "2-lines" | "menu-text";
export type HeaderScrollMode = "hide-show" | "always-visible" | "scrolls-away";
export type CountryStyle = "globe+text" | "globe-only";
export type DrawerTabStyle = "underline" | "pill";

export interface TopBarMessageSetting {
  id: number;
  enabled: boolean;
}

export interface HeaderConfig {
  // Top bar
  topBarOn: boolean;
  topBarMessages: TopBarMessageSetting[];
  rotateSec: number;
  topBarArrows: boolean;
  topBarBg: BrandColorKey;
  topBarText: BrandColorKey;
  topBarHeight: 28 | 32 | 36;

  // Logo
  logoVariant: LogoVariant;
  logoColor: LogoColorKey;
  logoColorOverHero: LogoColorKey;
  logoHeightDesktop: number;
  logoHeightMobile: number;
  logoPosition: LogoPosition;

  // Header bar
  headerHeightDesktop: number;
  headerHeightMobile: number;
  headerBg: BrandColorKey;
  iconColor: BrandColorKey;
  borderBottom: boolean;
  borderColor: BrandColorKey;
  iconLabels: IconLabelsMode;
  menuIcon: MenuIconStyle;
  menuIconCircle: boolean;

  // Over the home hero
  transparentOnHero: boolean;
  iconColorOverHero: BrandColorKey;
  solidAfterPx: number;

  // Scrolling
  scrollMode: HeaderScrollMode;

  // Right side
  countryOn: boolean;
  countryStyle: CountryStyle;
  accountOn: boolean;
  bagBadgeColor: BrandColorKey;
  whatsappOn: boolean;

  // Drawer
  drawerWidth: 360 | 400 | 480;
  drawerBg: BrandColorKey;
  tabStyle: DrawerTabStyle;
  highlightColor: BrandColorKey;
  showRecentlyViewed: boolean;
  showNewsletter: boolean;
  showCountryInDrawer: boolean;
}

export const DEFAULT_HEADER_CONFIG: HeaderConfig = {
  // Top bar
  topBarOn: true,
  topBarMessages: siteConfig.topBarMessages.map((_, idx) => ({
    id: idx,
    enabled: true,
  })),
  rotateSec: 5,
  topBarArrows: true,
  topBarBg: "caramel-100",
  topBarText: "cocoa-900",
  topBarHeight: 32,

  // Logo
  logoVariant: "wordmark",
  logoColor: "original",
  logoColorOverHero: "cream-50",
  logoHeightDesktop: 40,
  logoHeightMobile: 32,
  logoPosition: "centre",

  // Header bar
  headerHeightDesktop: 72,
  headerHeightMobile: 64,
  headerBg: "cream-50",
  iconColor: "cocoa-900",
  borderBottom: true,
  borderColor: "sand-300",
  iconLabels: "icons",
  menuIcon: "3-lines",
  menuIconCircle: false,

  // Over the home hero
  transparentOnHero: true,
  iconColorOverHero: "cream-50",
  solidAfterPx: 80,

  // Scrolling
  scrollMode: "hide-show",

  // Right side
  countryOn: true,
  countryStyle: "globe+text",
  accountOn: true,
  bagBadgeColor: "blush-700",
  whatsappOn: true,

  // Drawer
  drawerWidth: 400,
  drawerBg: "cream-50",
  tabStyle: "underline",
  highlightColor: "blush-700",
  showRecentlyViewed: true,
  showNewsletter: true,
  showCountryInDrawer: true,
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

function pickColor(val: unknown, fallback: BrandColorKey): BrandColorKey {
  return isBrandColorKey(val) ? val : fallback;
}

function pickLogoColor(val: unknown, fallback: LogoColorKey): LogoColorKey {
  if (val === "original") return "original";
  return isBrandColorKey(val) ? val : fallback;
}

export function validateHeaderConfig(raw: unknown): HeaderConfig {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return DEFAULT_HEADER_CONFIG;
  }

  const obj = raw as Record<string, unknown>;
  const def = DEFAULT_HEADER_CONFIG;
  const totalMsgs = siteConfig.topBarMessages.length;

  const validatedMsgs: TopBarMessageSetting[] = [];
  const seenMsgIds = new Set<number>();

  if (Array.isArray(obj.topBarMessages)) {
    for (const item of obj.topBarMessages) {
      if (!item || typeof item !== "object" || Array.isArray(item)) continue;
      const m = item as Record<string, unknown>;
      if (
        typeof m.id !== "number" ||
        !Number.isInteger(m.id) ||
        m.id < 0 ||
        m.id >= totalMsgs ||
        seenMsgIds.has(m.id)
      ) {
        continue;
      }
      seenMsgIds.add(m.id);
      validatedMsgs.push({
        id: m.id,
        enabled: pickBool(m.enabled, true),
      });
    }
  }

  for (let i = 0; i < totalMsgs; i++) {
    if (!seenMsgIds.has(i)) {
      validatedMsgs.push({ id: i, enabled: true });
    }
  }

  if (!validatedMsgs.some((m) => m.enabled) && validatedMsgs.length > 0) {
    validatedMsgs[0].enabled = true;
  }

  return {
    topBarOn: pickBool(obj.topBarOn, def.topBarOn),
    topBarMessages: validatedMsgs,
    rotateSec: clampInt(obj.rotateSec, 3, 10, def.rotateSec),
    topBarArrows: pickBool(obj.topBarArrows, def.topBarArrows),
    topBarBg: pickColor(obj.topBarBg, def.topBarBg),
    topBarText: pickColor(obj.topBarText, def.topBarText),
    topBarHeight: pickChoice(obj.topBarHeight, [28, 32, 36] as const, def.topBarHeight),

    logoVariant: pickChoice(
      obj.logoVariant,
      ["wordmark", "full", "mascot", "mascot-left"] as const,
      def.logoVariant
    ),
    logoColor: pickLogoColor(obj.logoColor, def.logoColor),
    logoColorOverHero: pickLogoColor(
      obj.logoColorOverHero,
      def.logoColorOverHero
    ),
    logoHeightDesktop: clampInt(
      obj.logoHeightDesktop,
      20,
      64,
      def.logoHeightDesktop
    ),
    logoHeightMobile: clampInt(
      obj.logoHeightMobile,
      18,
      48,
      def.logoHeightMobile
    ),
    logoPosition: pickChoice(
      obj.logoPosition,
      ["centre", "left"] as const,
      def.logoPosition
    ),

    headerHeightDesktop: clampInt(
      obj.headerHeightDesktop,
      56,
      96,
      def.headerHeightDesktop
    ),
    headerHeightMobile: clampInt(
      obj.headerHeightMobile,
      52,
      80,
      def.headerHeightMobile
    ),
    headerBg: pickColor(obj.headerBg, def.headerBg),
    iconColor: pickColor(obj.iconColor, def.iconColor),
    borderBottom: pickBool(obj.borderBottom, def.borderBottom),
    borderColor: pickColor(obj.borderColor, def.borderColor),
    iconLabels: pickChoice(
      obj.iconLabels,
      ["icons", "icons+labels"] as const,
      def.iconLabels
    ),
    menuIcon: pickChoice(
      obj.menuIcon,
      ["3-lines", "2-lines", "menu-text"] as const,
      def.menuIcon
    ),
    menuIconCircle: pickBool(obj.menuIconCircle, def.menuIconCircle),

    transparentOnHero: pickBool(obj.transparentOnHero, def.transparentOnHero),
    iconColorOverHero: pickColor(obj.iconColorOverHero, def.iconColorOverHero),
    solidAfterPx: clampInt(obj.solidAfterPx, 0, 300, def.solidAfterPx),

    scrollMode: pickChoice(
      obj.scrollMode,
      ["hide-show", "always-visible", "scrolls-away"] as const,
      def.scrollMode
    ),

    countryOn: pickBool(obj.countryOn, def.countryOn),
    countryStyle: pickChoice(
      obj.countryStyle,
      ["globe+text", "globe-only"] as const,
      def.countryStyle
    ),
    accountOn: pickBool(obj.accountOn, def.accountOn),
    bagBadgeColor: pickColor(obj.bagBadgeColor, def.bagBadgeColor),
    whatsappOn: pickBool(obj.whatsappOn, def.whatsappOn),

    drawerWidth: pickChoice(
      obj.drawerWidth,
      [360, 400, 480] as const,
      def.drawerWidth
    ),
    drawerBg: pickColor(obj.drawerBg, def.drawerBg),
    tabStyle: pickChoice(obj.tabStyle, ["underline", "pill"] as const, def.tabStyle),
    highlightColor: pickColor(obj.highlightColor, def.highlightColor),
    showRecentlyViewed: pickBool(
      obj.showRecentlyViewed,
      def.showRecentlyViewed
    ),
    showNewsletter: pickBool(obj.showNewsletter, def.showNewsletter),
    showCountryInDrawer: pickBool(
      obj.showCountryInDrawer,
      def.showCountryInDrawer
    ),
  };
}
