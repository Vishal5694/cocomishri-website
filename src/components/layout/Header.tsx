"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingBag, Menu, ChevronDown } from "lucide-react";
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
  const pathname = usePathname();
  const cartCount = useCartCount();
  const { activePanel, open, close } = usePanel();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [openPanel, setOpenPanel] = React.useState<string | null>(null);
  const [prevPathname, setPrevPathname] = React.useState(pathname);

  // Close dropdown immediately when pathname changes
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (openPanel !== null) {
      setOpenPanel(null);
    }
  }

  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const accountButtonRef = React.useRef<HTMLButtonElement>(null);
  const bagButtonRef = React.useRef<HTMLButtonElement>(null);
  const headerRef = React.useRef<HTMLElement>(null);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const triggerRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  // Scroll listener (> 8px)
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenPanel(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation: Escape key closes panel and returns focus
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openPanel) {
        const currentPanel = openPanel;
        setOpenPanel(null);
        triggerRefs.current[currentPanel]?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openPanel]);

  const handleMouseEnter = (label: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenPanel(label);
    }, 120);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenPanel(null);
    }, 150);
  };

  const togglePanel = (label: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setOpenPanel((prev) => (prev === label ? null : label));
  };

  const activeNavItem = mainNav.find((item) => item.label === openPanel);

  return (
    <>
      {/* Skip to main content accessible link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cocoa-900 focus:text-cream-50 focus:rounded-pill focus:shadow-lg focus:outline-2 focus:outline-blush-700 focus:outline-offset-2"
      >
        Skip to content
      </a>

      <header
        ref={headerRef}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "w-full bg-cream-50 transition-[border-color,box-shadow] duration-300 ease-soft relative z-40",
          isScrolled && "border-b border-sand-300 shadow-[0_2px_12px_rgba(69,33,4,0.04)]"
        )}
      >
        {/* Main header row: 3-column grid on mobile (<1024px), flex on desktop (>=1024px) */}
        <Container className="h-16 lg:h-20 grid grid-cols-[1fr_auto_1fr] lg:flex items-center lg:justify-between">
          {/* MOBILE (<1024px): Left Menu Hamburger Button (justify-self-start) */}
          <div className="flex lg:hidden items-center justify-self-start">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => {
                setOpenPanel(null);
                open("mobile-menu", menuButtonRef.current);
              }}
              aria-label="Open menu"
              className="size-11 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-100 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Centre cell on mobile, Left on desktop */}
          <div className="flex items-center justify-self-center">
            <Link
              href="/"
              className="flex items-center min-h-[44px] focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
            >
              <Image
                src="/brand/wordmark.svg"
                alt="Cocomishri"
                width={573}
                height={137}
                className="h-8 lg:h-10 w-auto object-contain"
                priority
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
              const isOpen = openPanel === item.label;

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
                    onClick={() => togglePanel(item.label)}
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    className={cn(
                      "min-h-[44px] px-3.5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-cocoa-900 rounded-pill hover:text-cocoa-700 hover:bg-sand-100/50 transition-colors select-none",
                      "focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2",
                      isOpen && "text-cocoa-700 bg-sand-100/50"
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={14}
                      strokeWidth={1.5}
                      className={cn(
                        "text-cocoa-500 transition-transform duration-300 ease-soft shrink-0",
                        isOpen && "rotate-180 text-cocoa-900"
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
                    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                    setOpenPanel(null);
                  }}
                  className="min-h-[44px] px-3.5 inline-flex items-center text-[15px] font-semibold text-cocoa-900 rounded-pill hover:text-cocoa-700 hover:bg-sand-100/50 transition-colors select-none focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: search + bag on mobile (justify-self-end), search + account + bag on desktop */}
          <div className="flex items-center gap-1 sm:gap-2 justify-self-end">
            <button
              ref={searchButtonRef}
              type="button"
              onClick={() => {
                setOpenPanel(null);
                open("search", searchButtonRef.current);
              }}
              aria-label="Search"
              className="size-11 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-100 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
            >
              <Search size={22} strokeWidth={1.5} />
            </button>

            <button
              ref={accountButtonRef}
              type="button"
              onClick={() => {
                setOpenPanel(null);
                open("account", accountButtonRef.current);
              }}
              aria-label="Account"
              className="hidden lg:flex size-11 items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-100 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
            >
              <User size={22} strokeWidth={1.5} />
            </button>

            <button
              ref={bagButtonRef}
              type="button"
              onClick={() => {
                setOpenPanel(null);
                open("bag", bagButtonRef.current);
              }}
              aria-label="Shopping bag"
              className="size-11 relative flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-100 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
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

        {/* Dropdown Panels (Desktop): 32px top / 40px bottom padding, 64px gap, centred columns */}
        {activeNavItem && (
          <div
            id={`dropdown-${activeNavItem.label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
            role="region"
            aria-label={`${activeNavItem.label} submenu`}
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
            className={cn(
              "hidden lg:block absolute top-full left-0 w-full bg-cream-50 border-t border-b border-sand-300 shadow-lg z-50",
              "animate-in fade-in slide-in-from-top-2 duration-300 ease-soft motion-reduce:animate-none"
            )}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
              <div className="flex flex-wrap lg:flex-nowrap gap-16 justify-center">
                {activeNavItem.groups?.map((group) => (
                  <div key={group.title} className="flex flex-col min-w-[160px]">
                    <span className="eyebrow block mb-3">{group.title}</span>
                    <ul className="flex flex-col">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setOpenPanel(null)}
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
