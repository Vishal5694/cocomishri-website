"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Search, User, ShoppingBag } from "lucide-react";
import { asset } from "@/lib/asset";
import { useCartCount } from "@/lib/cart/useCartCount";
import { usePanel } from "@/lib/ui/PanelContext";
import { SearchPanel } from "@/components/layout/SearchPanel";
import { AccountPanel } from "@/components/layout/AccountPanel";
import { BagPanel } from "@/components/layout/BagPanel";
import { MenuDrawerV2 } from "./MenuDrawerV2";
import { cn } from "@/lib/utils";

export function HeaderV2() {
  const cartCount = useCartCount();
  const { activePanel, open, close } = usePanel();

  const [isScrolledPast80, setIsScrolledPast80] = React.useState(false);
  const [isHidden, setIsHidden] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const lastScrollY = React.useRef(0);

  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const accountButtonRef = React.useRef<HTMLButtonElement>(null);
  const bagButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolledPast80(currentY > 80);

      if (currentY <= 80) {
        setIsHidden(false);
      } else if (currentY > lastScrollY.current + 6) {
        setIsHidden(true);
      } else if (currentY < lastScrollY.current - 6) {
        setIsHidden(false);
      }
      lastScrollY.current = currentY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const iconBtnClass = cn(
    "size-11 relative flex items-center justify-center rounded-pill transition-colors duration-300 ease-soft motion-reduce:transition-none shrink-0",
    isScrolledPast80
      ? "text-cocoa-900 hover:bg-sand-100 focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
      : "text-cream-50 hover:bg-cream-50/15 focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-2"
  );

  return (
    <>
      {/* Top SAFETY BAR (always visible, 32px, bg caramel-100, cocoa-900 13px, centred) */}
      <div className="fixed top-0 left-0 right-0 z-40 h-8 bg-caramel-100 text-cocoa-900 flex items-center justify-center px-4 text-center">
        <p className="text-[13px] font-medium leading-none truncate">
          Cocomishri will never ask for OTPs or payments over calls.
        </p>
      </div>

      {/* Main Header Row (sits below the 32px safety bar) */}
      <header
        className={cn(
          "fixed top-8 left-0 right-0 z-30 h-16 transition-all duration-300 ease-soft motion-reduce:transition-none",
          isHidden ? "-translate-y-full pointer-events-none" : "translate-y-0",
          isScrolledPast80
            ? "bg-cream-50 text-cocoa-900 border-b border-sand-300"
            : "bg-gradient-to-b from-cocoa-900/55 to-transparent text-cream-50"
        )}
      >
        <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 lg:px-8 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          {/* Left: Menu + Search */}
          <div className="flex items-center justify-self-start gap-0.5 sm:gap-1">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className={iconBtnClass}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            <button
              ref={searchButtonRef}
              type="button"
              onClick={(e) => open("search", e.currentTarget)}
              aria-label="Search"
              className={iconBtnClass}
            >
              <Search size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Centre: Wordmark (28px mobile, 40px desktop) */}
          <div className="flex items-center justify-self-center">
            <Link
              href="/v2"
              className={cn(
                "flex items-center min-h-[44px]",
                isScrolledPast80
                  ? "focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
                  : "focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-2"
              )}
            >
              <Image
                src={asset(
                  isScrolledPast80
                    ? "/brand/wordmark.svg"
                    : "/brand/wordmark-cream.svg"
                )}
                alt="Cocomishri"
                width={573}
                height={137}
                className="h-7 lg:h-10 w-auto object-contain"
                loading="lazy"
              />
            </Link>
          </div>

          {/* Right: Account + Bag */}
          <div className="flex items-center justify-self-end gap-0.5 sm:gap-1">
            <button
              ref={accountButtonRef}
              type="button"
              onClick={(e) => open("account", e.currentTarget)}
              aria-label="Account"
              className={iconBtnClass}
            >
              <User size={22} strokeWidth={1.5} />
            </button>

            <button
              ref={bagButtonRef}
              type="button"
              onClick={(e) => open("bag", e.currentTarget)}
              aria-label="Shopping bag"
              className={iconBtnClass}
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-pill bg-blush-700 text-cream-50 text-[10px] font-bold flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Existing Panels (reused without editing) */}
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
      <BagPanel
        isOpen={activePanel === "bag"}
        onClose={close}
        triggerRef={bagButtonRef}
      />

      {/* v2 Menu Drawer */}
      <MenuDrawerV2
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        triggerRef={menuButtonRef}
      />
    </>
  );
}
