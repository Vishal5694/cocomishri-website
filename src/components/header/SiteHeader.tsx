"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, User, ShoppingBag } from "lucide-react";
import { asset } from "@/lib/asset";
import { useCartCount } from "@/lib/cart/useCartCount";
import { usePanel } from "@/lib/ui/PanelContext";
import { Container } from "@/components/layout/Container";
import { SearchPanel } from "@/components/layout/SearchPanel";
import { AccountPanel } from "@/components/layout/AccountPanel";
import { CountrySelector } from "./CountrySelector";
import { MenuDrawer } from "./MenuDrawer";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const cartCount = useCartCount();
  const { activePanel, open, close } = usePanel();

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

      if (isOverlayOpen) {
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
  }, [isOverlayOpen]);

  // Never hide while drawer, account panel, or search panel is open
  React.useEffect(() => {
    if (isOverlayOpen) {
      setIsHidden(false);
    }
  }, [isOverlayOpen]);

  const isTransparent = hasHeroFlag && scrollY < 80 && !isOverlayOpen;
  const topOffset = Math.max(0, 32 - scrollY);

  const iconBtnClass = cn(
    "size-11 relative flex items-center justify-center rounded-pill transition-colors duration-300 ease-soft motion-reduce:transition-none shrink-0",
    isTransparent
      ? "text-cream-50 hover:bg-cream-50/15 focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-2"
      : "text-cocoa-900 hover:bg-sand-100 focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
  );

  return (
    <>
      <header
        style={{ top: `${topOffset}px` }}
        className={cn(
          "fixed left-0 right-0 z-40 h-16 lg:h-[72px] transition-[transform,background-color,color] duration-300 ease-soft motion-reduce:transition-none",
          isHidden ? "-translate-y-full pointer-events-none" : "translate-y-0",
          isTransparent
            ? "bg-gradient-to-b from-cocoa-900/55 to-transparent text-cream-50"
            : "bg-cream-50 text-cocoa-900 border-b border-sand-300"
        )}
      >
        <Container className="h-full grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          {/* LEFT: Menu + Search */}
          <div className="flex items-center justify-self-start gap-0.5 sm:gap-1">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => open("mobile-menu", menuButtonRef.current)}
              aria-label="Open menu"
              aria-expanded={activePanel === "mobile-menu"}
              className={iconBtnClass}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            <button
              ref={searchButtonRef}
              type="button"
              onClick={() => open("search", searchButtonRef.current)}
              aria-label="Search"
              aria-expanded={activePanel === "search"}
              className={iconBtnClass}
            >
              <Search size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* CENTRE: Wordmark (32px mobile / 40px desktop) */}
          <div className="flex items-center justify-self-center">
            <Link
              href="/"
              className={cn(
                "flex items-center min-h-[44px]",
                isTransparent
                  ? "focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-2"
                  : "focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
              )}
            >
              <Image
                src={asset(
                  isTransparent
                    ? "/brand/wordmark-cream.svg"
                    : "/brand/wordmark.svg"
                )}
                alt="Cocomishri"
                width={573}
                height={137}
                className="h-8 lg:h-10 w-auto object-contain"
                loading="lazy"
              />
            </Link>
          </div>

          {/* RIGHT: CountrySelector (desktop) + Account + Bag link (/bag) */}
          <div className="flex items-center justify-self-end gap-0.5 sm:gap-1">
            <CountrySelector transparent={isTransparent} />

            <button
              ref={accountButtonRef}
              type="button"
              onClick={() => open("account", accountButtonRef.current)}
              aria-label="Account"
              aria-expanded={activePanel === "account"}
              className={iconBtnClass}
            >
              <User size={22} strokeWidth={1.5} />
            </button>

            <Link
              href="/bag"
              aria-label="Shopping bag"
              className={iconBtnClass}
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-pill bg-blush-700 text-cream-50 text-[10px] font-bold flex items-center justify-center leading-none">
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
