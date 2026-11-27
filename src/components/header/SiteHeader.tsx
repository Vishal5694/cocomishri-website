"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, User, ShoppingBag } from "lucide-react";
import { useCartCount } from "@/lib/cart/useCartCount";
import { usePanel } from "@/lib/ui/PanelContext";
import { Container } from "@/components/layout/Container";
import { SearchPanel } from "@/components/layout/SearchPanel";
import { AccountPanel } from "@/components/layout/AccountPanel";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { HEADER_CONFIG } from "@/lib/header-config";
import { getBrandHex } from "@/lib/brand-colors";
import { CountrySelector } from "./CountrySelector";
import { MenuDrawer } from "./MenuDrawer";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const cartCount = useCartCount();
  const { activePanel, open, close } = usePanel();
  const cfg = HEADER_CONFIG;

  const [hasHeroFlag, setHasHeroFlag] = React.useState(false);
  const [scrollY, setScrollY] = React.useState(0);
  const [isHidden, setIsHidden] = React.useState(false);
  const lastScrollY = React.useRef(0);

  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const accountButtonRef = React.useRef<HTMLButtonElement>(null);

  const isOverlayOpen = activePanel !== null;

  // Detect [data-transparent-header] on the current page
  React.useEffect(() => {
    const check = () => {
      const el = document.querySelector("[data-transparent-header]");
      setHasHeroFlag(Boolean(el));
    };
    check();
    const raf = window.requestAnimationFrame(check);
    return () => window.cancelAnimationFrame(raf);
  }, [pathname]);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollY(currentY);

      if (isOverlayOpen || cfg.scrollMode !== "hide-show") {
        setIsHidden(false);
        lastScrollY.current = currentY;
        return;
      }

      if (currentY <= 120) {
        setIsHidden(false);
      } else if (currentY > lastScrollY.current + 8) {
        setIsHidden(true);
      } else if (currentY < lastScrollY.current) {
        setIsHidden(false);
      }

      lastScrollY.current = currentY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOverlayOpen, cfg.scrollMode]);

  // Never hide while drawer, account panel, or search panel is open
  React.useEffect(() => {
    if (isOverlayOpen) {
      setIsHidden(false);
    }
  }, [isOverlayOpen]);

  const isTransparent =
    cfg.transparentOnHero &&
    hasHeroFlag &&
    scrollY < cfg.solidAfterPx &&
    !isOverlayOpen;

  const topBarOffset = cfg.topBarOn ? cfg.topBarHeight : 0;
  const topOffset =
    cfg.scrollMode === "scrolls-away"
      ? topBarOffset
      : Math.max(0, topBarOffset - scrollY);

  const activeIconColor = isTransparent
    ? getBrandHex(cfg.iconColorOverHero)
    : getBrandHex(cfg.iconColor);
  const activeLogoColor = isTransparent
    ? cfg.sameLogoColor
      ? cfg.logoColor
      : cfg.logoColorOverHero
    : cfg.logoColor;
  const showLabels = cfg.iconLabels === "icons+labels";

  const iconBtnClass = cn(
    "relative flex items-center justify-center rounded-pill text-inherit transition-colors duration-300 ease-soft motion-reduce:transition-none shrink-0",
    showLabels ? "flex-col gap-0.5 min-w-[44px] h-11 px-1.5" : "size-11",
    isTransparent
      ? "hover:bg-cream-50/15 focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-2"
      : "hover:bg-sand-100 focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
  );

  const iconSize = showLabels ? 18 : 22;

  const renderMenuGraphic = () => {
    if (cfg.menuIcon === "menu-text") {
      return (
        <span className="text-[12px] font-semibold uppercase tracking-[0.06em] px-1.5">
          Menu
        </span>
      );
    }
    if (cfg.menuIcon === "2-lines") {
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="4" y1="9" x2="20" y2="9" />
          <line x1="4" y1="15" x2="20" y2="15" />
        </svg>
      );
    }
    return <Menu size={iconSize} strokeWidth={1.5} />;
  };

  const menuButton = (
    <button
      ref={menuButtonRef}
      type="button"
      onClick={() => open("mobile-menu", menuButtonRef.current)}
      aria-label="Open menu"
      aria-expanded={activePanel === "mobile-menu"}
      className={cn(
        iconBtnClass,
        cfg.menuIcon === "menu-text" && !showLabels && "w-auto px-2.5",
        cfg.menuIconCircle && "ring-1 ring-current/30 bg-current/5"
      )}
    >
      {renderMenuGraphic()}
      {showLabels && cfg.menuIcon !== "menu-text" && (
        <span className="text-[10px] font-medium leading-none">Menu</span>
      )}
    </button>
  );

  const searchButton = (
    <button
      ref={searchButtonRef}
      type="button"
      onClick={() => open("search", searchButtonRef.current)}
      aria-label="Search"
      aria-expanded={activePanel === "search"}
      className={iconBtnClass}
    >
      <Search size={iconSize} strokeWidth={1.5} />
      {showLabels && (
        <span className="text-[10px] font-medium leading-none">Search</span>
      )}
    </button>
  );

  const logoElement = (
    <BrandLogo
      variant={cfg.logoVariant}
      color={activeLogoColor}
      heightMobile={cfg.logoHeightMobile}
      heightDesktop={cfg.logoHeightDesktop}
      focusClassName={
        isTransparent
          ? "focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-2"
          : "focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
      }
    />
  );

  return (
    <>
      <header
        style={
          {
            top: `${topOffset}px`,
            "--cm-hdr-h-m": `${cfg.headerHeightMobile}px`,
            "--cm-hdr-h-d": `${cfg.headerHeightDesktop}px`,
            color: activeIconColor,
            backgroundColor: isTransparent
              ? undefined
              : getBrandHex(cfg.headerBg),
            borderBottom:
              !isTransparent && cfg.borderBottom
                ? `1px solid ${getBrandHex(cfg.borderColor)}`
                : undefined,
          } as React.CSSProperties
        }
        className={cn(
          cfg.scrollMode === "scrolls-away" ? "absolute" : "fixed",
          "left-0 right-0 z-40 h-[var(--cm-hdr-h-m)] lg:h-[var(--cm-hdr-h-d)] transition-[transform,background-color,color] duration-300 ease-soft motion-reduce:transition-none",
          isHidden && cfg.scrollMode === "hide-show"
            ? "-translate-y-full pointer-events-none"
            : "translate-y-0",
          isTransparent && "bg-gradient-to-b from-cocoa-900/55 to-transparent"
        )}
      >
        <Container
          className={cn(
            "h-full items-center gap-2",
            cfg.logoPosition === "centre"
              ? "grid grid-cols-[1fr_auto_1fr]"
              : "flex justify-between"
          )}
        >
          {cfg.logoPosition === "centre" ? (
            <>
              {/* LEFT: Menu + Search */}
              <div className="flex items-center justify-self-start gap-0.5 sm:gap-1">
                {menuButton}
                {searchButton}
              </div>

              {/* CENTRE: Logo */}
              <div className="flex items-center justify-self-center">
                {logoElement}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              {menuButton}
              {logoElement}
            </div>
          )}

          {/* RIGHT: (Search if logo left) + CountrySelector (desktop) + Account + Bag link (/bag) */}
          <div
            className={cn(
              "flex items-center gap-0.5 sm:gap-1",
              cfg.logoPosition === "centre" && "justify-self-end"
            )}
          >
            {cfg.logoPosition === "left" && searchButton}

            <CountrySelector transparent={isTransparent} />

            {cfg.accountOn && (
              <button
                ref={accountButtonRef}
                type="button"
                onClick={() => open("account", accountButtonRef.current)}
                aria-label="Account"
                aria-expanded={activePanel === "account"}
                className={iconBtnClass}
              >
                <User size={iconSize} strokeWidth={1.5} />
                {showLabels && (
                  <span className="text-[10px] font-medium leading-none">
                    Account
                  </span>
                )}
              </button>
            )}

            <Link
              href="/bag"
              aria-label="Shopping bag"
              className={iconBtnClass}
            >
              <ShoppingBag size={iconSize} strokeWidth={1.5} />
              {showLabels && (
                <span className="text-[10px] font-medium leading-none">
                  Bag
                </span>
              )}
              {cartCount > 0 && (
                <span
                  style={{ backgroundColor: getBrandHex(cfg.bagBadgeColor) }}
                  className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-pill text-cream-50 text-[10px] font-bold flex items-center justify-center leading-none"
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </Container>
      </header>

      {/* Panels */}
      <SearchPanel
        isOpen={activePanel === "search"}
        onClose={close}
        triggerRef={searchButtonRef}
      />

      <AccountPanel
        isOpen={activePanel === "account"}
        onClose={close}
        triggerRef={accountButtonRef}
      />

      <MenuDrawer
        isOpen={activePanel === "mobile-menu"}
        onClose={close}
        onOpenSearch={() => open("search", searchButtonRef.current)}
        onOpenAccount={() => open("account", accountButtonRef.current)}
        triggerRef={menuButtonRef}
      />
    </>
  );
}
