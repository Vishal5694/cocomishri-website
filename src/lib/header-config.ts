import type { BrandColorKey } from "./brand-colors";

export interface HeaderConfig {
  topBarOn: boolean;
  topBarMessages: readonly { readonly id: number; readonly enabled: boolean }[];
  rotateSec: number;
  topBarArrows: boolean;
  topBarBg: BrandColorKey;
  topBarText: BrandColorKey;
  topBarHeight: 28 | 32 | 36;
  logoVariant: "wordmark" | "full" | "mascot" | "mascot-left";
  sameLogoColor: boolean;
  logoColor: BrandColorKey | "original";
  logoColorOverHero: BrandColorKey | "original";
  logoHeightDesktop: number;
  logoHeightMobile: number;
  logoPosition: "centre" | "left";
  headerHeightDesktop: number;
  headerHeightMobile: number;
  headerBg: BrandColorKey;
  iconColor: BrandColorKey;
  borderBottom: boolean;
  borderColor: BrandColorKey;
  iconLabels: "icons" | "icons+labels";
  menuIcon: "3-lines" | "2-lines" | "menu-text";
  menuIconCircle: boolean;
  transparentOnHero: boolean;
  iconColorOverHero: BrandColorKey;
  solidAfterPx: number;
  scrollMode: "hide-show" | "always-visible" | "scrolls-away";
  countryOn: boolean;
  countryStyle: "globe+text" | "globe-only";
  accountOn: boolean;
  bagBadgeColor: BrandColorKey;
  whatsappOn: boolean;
  drawerWidth: 360 | 400 | 480;
  drawerBg: BrandColorKey;
  tabStyle: "underline" | "pill";
  highlightColor: BrandColorKey;
  showRecentlyViewed: boolean;
  showNewsletter: boolean;
  showCountryInDrawer: boolean;
}

// LOCKED by owner on 2026-11-28. Do not change without written approval.
export const HEADER_CONFIG: Readonly<HeaderConfig> = Object.freeze({
  topBarOn: true,
  topBarMessages: Object.freeze([
    Object.freeze({ id: 0, enabled: true }),
    Object.freeze({ id: 1, enabled: true }),
    Object.freeze({ id: 2, enabled: true }),
    Object.freeze({ id: 3, enabled: true }),
    Object.freeze({ id: 4, enabled: false }),
  ]),
  rotateSec: 5,
  topBarArrows: true,
  topBarBg: "sand-300",
  topBarText: "cocoa-900",
  topBarHeight: 32,
  logoVariant: "wordmark",
  sameLogoColor: true,
  logoColor: "original",
  logoColorOverHero: "cream-50",
  logoHeightDesktop: 40,
  logoHeightMobile: 32,
  logoPosition: "centre",
  headerHeightDesktop: 72,
  headerHeightMobile: 64,
  headerBg: "cream-50",
  iconColor: "cocoa-900",
  borderBottom: true,
  borderColor: "sand-300",
  iconLabels: "icons",
  menuIcon: "3-lines",
  menuIconCircle: false,
  transparentOnHero: true,
  iconColorOverHero: "cream-50",
  solidAfterPx: 80,
  scrollMode: "hide-show",
  countryOn: true,
  countryStyle: "globe+text",
  accountOn: true,
  bagBadgeColor: "blush-700",
  whatsappOn: true,
  drawerWidth: 400,
  drawerBg: "cream-50",
  tabStyle: "underline",
  highlightColor: "blush-700",
  showRecentlyViewed: true,
  showNewsletter: true,
  showCountryInDrawer: true,
});
