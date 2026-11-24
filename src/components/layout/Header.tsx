"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, User, ShoppingBag, ChevronDown } from "lucide-react";
import { asset } from "@/lib/asset";
import { mainNav, NavItem } from "@/lib/navigation";
import { useCartCount } from "@/lib/cart/useCartCount";
import { usePanel } from "@/lib/ui/PanelContext";
import { MobileMenu } from "./MobileMenu";
import { SearchPanel } from "./SearchPanel";
import { AccountPanel } from "./AccountPanel";
import { BagPanel } from "./BagPanel";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname() || "/";
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalizedPath =
    basePath && pathname.startsWith(basePath)
      ? pathname.slice(basePath.length) || "/"
      : pathname;
  const isHome = normalizedPath === "/";

  const cartCount = useCartCount();
  const { activePanel, open, close } = usePanel();
  const [isScrolledPast80, setIsScrolledPast80] = React.useState(false);
  const [isHidden, setIsHidden] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const [prevPathname, setPrevPathname] = React.useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (openDropdown !== null) {
      setOpenDropdown(null);
    }
  }

  const lastScrollY = React.useRef(0);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const accountButtonRef = React.useRef<HTMLButtonElement>(null);
  const bagButtonRef = React.useRef<HTMLButtonElement>(null);
  const headerRef = React.useRef<HTMLElement>(null);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const triggerRefs = React.useRef<Record<string, HTMLButtonElement | null>>(
    {}
  );

  React.useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolledPast80(currentY > 80);

      if (currentY <= 80) {
        setIsHidden(false);
      } else if (currentY > lastScrollY.current + 6) {
        setIsHidden(true);
        setOpenDropdown(null);
      } else if (currentY < lastScrollY.current - 6) {
        setIsHidden(false);
      }
      lastScrollY.current = currentY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openDropdown) {
        const current = openDropdown;
        setOpenDropdown(null);
        triggerRefs.current[current]?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openDropdown]);

  const handleMouseEnter = (label: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(label);
    }, 120);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const toggleDropdown = (label: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  // Transparent ONLY on home ("/") at top (<=80px) when no desktop dropdown is open
  const isTransparent = isHome && !isScrolledPast80 && !openDropdown;

  const iconBtnClass = cn(
    "size-11 relative flex items-center justify-center rounded-pill transition-colors duration-300 ease-soft motion-reduce:transition-none shrink-0",
    isTransparent
      ? "text-cream-50 hover:bg-cream-50/15 focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-2"
      : "text-cocoa-900 hover:bg-sand-100 focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
  );

  const navItemClass = (isOpen?: boolean) =>
    cn(
      "min-h-[44px] px-3.5 inline-flex items-center gap-1.5 text-[15px] font-semibold rounded-pill transition-colors select-none",
      isTransparent
        ? "text-cream-50 hover:bg-cream-50/15 focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-2"
        : "text-cocoa-900 hover:text-cocoa-700 hover:bg-sand-100/50 focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2",
      isOpen && !isTransparent && "text-cocoa-700 bg-sand-100/50"
    );

  const activeNavItem = mainNav.find((item) => item.label === openDropdown);

  return (
    <>
      {/* Skip to main content accessible link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cocoa-900 focus:text-cream-50 focus:rounded-pill focus:shadow-lg focus:outline-2 focus-visible:outline-blush-700 focus:outline-offset-2"
      >
        Skip to content
      </a>

      {/* Spacer for fixed TopBar (+ fixed Header on non-home pages) */}
      <div className={isHome ? "h-8" : "h-24 lg:h-28"} aria-hidden="true" />

      <header
        ref={headerRef}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "fixed top-8 left-0 right-0 z-30 h-16 lg:h-20 transition-all duration-300 ease-soft motion-reduce:transition-none",
          isHidden ? "-translate-y-full pointer-events-none" : "translate-y-0",
          isTransparent
            ? "bg-gradient-to-b from-cocoa-900/55 to-transparent text-cream-50"
            : "bg-cream-50 text-cocoa-900 border-b border-sand-300"
        )}
      >
        <Container className="h-full grid grid-cols-[1fr_auto_1fr] lg:flex items-center lg:justify-between gap-2">
          {/* MOBILE (<1024px): Left = Menu + Search */}
          <div className="flex lg:hidden items-center justify-self-start gap-0.5">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => {
                setOpenDropdown(null);
                open("mobile-menu", menuButtonRef.current);
              }}
              aria-label="Open menu"
              className={iconBtnClass}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                setOpenDropdown(null);
                open("search", e.currentTarget);
              }}
              aria-label="Search"
              className={iconBtnClass}
            >
              <Search size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Wordmark: Centred on mobile (28px), Left on desktop (40px) */}
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
                className="h-7 lg:h-10 w-auto object-contain"
                loading="lazy"
              />
            </Link>
          </div>

          {/* DESKTOP (>=1024px): Center Nav Items */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 flex-1 px-6 xl:px-8"
          >
            {mainNav.map((item: NavItem) => {
              const hasGroups = item.groups && item.groups.length > 0;
              const isOpen = openDropdown === item.label;

              if (hasGroups) {
                return (
                  <button
                    key={item.label}
                    ref={(el) => {
                      triggerRefs.current[item.label] = el;
                    }}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`dropdown-${item.label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                    onClick={() => toggleDropdown(item.label)}
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    className={navItemClass(isOpen)}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={14}
                      strokeWidth={1.5}
                      className={cn(
                        "transition-transform duration-300 ease-soft shrink-0",
                        isTransparent ? "text-cream-50/80" : "text-cocoa-500",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => {
                    if (hoverTimeoutRef.current)
                      clearTimeout(hoverTimeoutRef.current);
                    setOpenDropdown(null);
                  }}
                  className={navItemClass(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Account + Bag on mobile; Search + Account + Bag on desktop */}
          <div className="flex items-center justify-self-end gap-0.5 sm:gap-1">
            <button
              ref={searchButtonRef}
              type="button"
              onClick={() => {
                setOpenDropdown(null);
                open("search", searchButtonRef.current);
              }}
              aria-label="Search"
              className={cn(iconBtnClass, "hidden lg:flex")}
            >
              <Search size={22} strokeWidth={1.5} />
            </button>

            <button
              ref={accountButtonRef}
              type="button"
              onClick={() => {
                setOpenDropdown(null);
                open("account", accountButtonRef.current);
              }}
              aria-label="Account"
              className={iconBtnClass}
            >
              <User size={22} strokeWidth={1.5} />
            </button>

            <button
              ref={bagButtonRef}
              type="button"
              onClick={() => {
                setOpenDropdown(null);
                open("bag", bagButtonRef.current);
              }}
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
        </Container>

        {/* Desktop Mega-Menu Dropdowns */}
        {activeNavItem && (
          <div
            id={`dropdown-${activeNavItem.label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
            role="region"
            aria-label={`${activeNavItem.label} submenu`}
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
            className="hidden lg:block absolute top-full left-0 w-full bg-cream-50 text-cocoa-900 border-t border-b border-sand-300 shadow-lg z-50"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
              <div className="flex flex-wrap lg:flex-nowrap gap-16 justify-center">
                {activeNavItem.groups?.map((group) => (
                  <div
                    key={group.title}
                    className="flex flex-col min-w-[160px]"
                  >
                    <span className="eyebrow block mb-3">{group.title}</span>
                    <ul className="flex flex-col">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setOpenDropdown(null)}
                            className="text-[15px] leading-[1.4] font-normal text-cocoa-700 hover:text-cocoa-900 hover:underline min-h-[32px] inline-flex items-center transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Header Panels: Search, Account, Bag */}
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

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={activePanel === "mobile-menu"}
        onClose={close}
        triggerRef={menuButtonRef}
      />
    </>
  );
}
