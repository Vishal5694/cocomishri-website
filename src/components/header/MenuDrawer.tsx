"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Search,
  User,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
  Globe,
  Check,
  Heart,
  Package,
  Mail,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import {
  departments,
  drawerNav,
  drawerMore,
  drawerFooterLinks,
  type DepartmentId,
  type DrawerSubMenu,
} from "@/lib/navigation";
import { useDepartment } from "@/lib/department/DepartmentContext";
import { useCartCount } from "@/lib/cart/useCartCount";
import { useRecentlyViewed } from "@/lib/storage/useRecentlyViewed";
import { siteConfig } from "@/lib/site-config";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export function MenuDrawer({
  isOpen,
  onClose,
  onOpenSearch,
  onOpenAccount,
  triggerRef,
}: MenuDrawerProps) {
  const pathname = usePathname();
  const prevPathnameRef = React.useRef(pathname);
  const isOpenRef = React.useRef(isOpen);
  const onCloseRef = React.useRef(onClose);
  isOpenRef.current = isOpen;
  onCloseRef.current = onClose;

  const { department, setDepartment } = useDepartment();
  const cartCount = useCartCount();
  const { recentlyViewed } = useRecentlyViewed();

  const [activeTab, setActiveTab] = React.useState<DepartmentId>(department);
  const [openAccordions, setOpenAccordions] = React.useState<
    Record<string, boolean>
  >({});
  const [activeSubMenu, setActiveSubMenu] = React.useState<
    DrawerSubMenu["id"] | null
  >(null);
  const [showGlobalNote, setShowGlobalNote] = React.useState(false);

  // Newsletter form state
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const drawerRef = React.useRef<HTMLDivElement>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);
  const backBtnRef = React.useRef<HTMLButtonElement>(null);
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const subMenuTriggerRefs = React.useRef<
    Record<string, HTMLButtonElement | null>
  >({});
  const lastOpenedSubMenuRef = React.useRef<DrawerSubMenu["id"] | null>(null);

  // Sync active tab when drawer opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(department);
      setActiveSubMenu(null);
    }
  }, [isOpen, department]);

  // Close on PATHNAME change only (not search-param change)
  React.useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      if (isOpenRef.current) {
        onCloseRef.current();
      }
    }
  }, [pathname]);

  // Move focus to Back button when a sub-menu opens
  React.useEffect(() => {
    if (isOpen && activeSubMenu !== null) {
      const raf = window.requestAnimationFrame(() => {
        backBtnRef.current?.focus();
      });
      return () => window.cancelAnimationFrame(raf);
    }
  }, [isOpen, activeSubMenu]);

  // Focus trap, scroll lock, Escape
  React.useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusable = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.closest("[inert]"));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef?.current?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  const handleTabSelect = (id: DepartmentId) => {
    setActiveTab(id);
    setOpenAccordions({});
    setActiveSubMenu(null);
    setDepartment(id);
  };

  const handleTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    let nextIdx = idx;
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % departments.length;
    else if (e.key === "ArrowLeft")
      nextIdx = (idx - 1 + departments.length) % departments.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = departments.length - 1;
    else return;

    e.preventDefault();
    const target = departments[nextIdx];
    handleTabSelect(target.id);
    tabRefs.current[target.id]?.focus();
  };

  const handleOpenSubMenu = (id: DrawerSubMenu["id"]) => {
    lastOpenedSubMenuRef.current = id;
    setActiveSubMenu(id);
  };

  const handleCloseSubMenu = () => {
    const returnId = lastOpenedSubMenuRef.current;
    setActiveSubMenu(null);
    if (returnId) {
      window.requestAnimationFrame(() => {
        subMenuTriggerRefs.current[returnId]?.focus();
      });
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setIsSubscribed(true);
    setEmail("");
  };

  if (!isOpen) return null;

  const currentDeptContent = drawerNav[activeTab];
  const currentSubMenuObj = drawerMore.find((m) => m.id === activeSubMenu);
  const isSubMenuOpen = activeSubMenu !== null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-cocoa-900/40 backdrop-blur-[2px] transition-opacity duration-300 ease-soft motion-reduce:transition-none"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer (LEFT, 400px desktop / 100% mobile) */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="relative z-10 w-full sm:w-[400px] max-w-full h-full bg-cream-50 text-cocoa-900 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Top Row: Close left; Search, Account, Bag right */}
        <div className="h-16 px-4 border-b border-sand-300 flex items-center justify-between shrink-0">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="size-11 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-100 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
          >
            <X size={22} strokeWidth={1.5} />
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              aria-label="Search"
              className="size-11 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-100 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
            >
              <Search size={22} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAccount();
              }}
              aria-label="Account"
              className="size-11 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-100 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
            >
              <User size={22} strokeWidth={1.5} />
            </button>

            <Link
              href="/bag"
              onClick={onClose}
              aria-label="Shopping bag"
              className="size-11 relative flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-100 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-pill bg-blush-700 text-cream-50 text-[10px] font-bold flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Scrollable body with slide-in sub-menu support */}
        <div className="relative flex-1 overflow-hidden">
          {/* Main Drawer View */}
          <div
            aria-hidden={isSubMenuOpen}
            inert={isSubMenuOpen}
            className={cn(
              "h-full overflow-y-auto transition-transform duration-300 ease-soft motion-reduce:transition-none",
              isSubMenuOpen
                ? "-translate-x-full pointer-events-none"
                : "translate-x-0"
            )}
          >
            {/* Department TABS row (role="tablist") */}
            <div
              role="tablist"
              aria-label="Departments"
              className="flex items-center justify-between px-4 border-b border-sand-300 bg-cream-50 overflow-x-auto"
            >
              {departments.map((dept, idx) => {
                const isSelected = activeTab === dept.id;
                return (
                  <button
                    key={dept.id}
                    ref={(el) => {
                      tabRefs.current[dept.id] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`dept-tab-${dept.id}`}
                    aria-selected={isSelected}
                    aria-controls={`dept-panel-${dept.id}`}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => handleTabSelect(dept.id)}
                    onKeyDown={(e) => handleTabKeyDown(e, idx)}
                    className={cn(
                      "min-h-[48px] px-2 py-2 font-body font-semibold uppercase text-[13px] tracking-[0.04em] whitespace-nowrap border-b-2 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-[-2px]",
                      isSelected
                        ? "border-cocoa-900 text-cocoa-900"
                        : "border-transparent text-cocoa-700 hover:text-cocoa-900"
                    )}
                  >
                    {dept.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Panel Content */}
            <div
              role="tabpanel"
              id={`dept-panel-${activeTab}`}
              aria-labelledby={`dept-tab-${activeTab}`}
              className="divide-y divide-sand-300 px-5"
            >
              {/* 1. Highlight link */}
              <div>
                <Link
                  href={currentDeptContent.highlight.href}
                  onClick={onClose}
                  className="min-h-[48px] flex items-center text-[15px] font-semibold text-blush-700 hover:underline"
                >
                  {currentDeptContent.highlight.label}
                </Link>
              </div>

              {/* 2. Accordions */}
              {currentDeptContent.accordions.map((group) => {
                const accKey = `${activeTab}-${group.title}`;
                const isExpanded = !!openAccordions[accKey];
                return (
                  <div key={group.title}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenAccordions((prev) => ({
                          ...prev,
                          [accKey]: !prev[accKey],
                        }))
                      }
                      aria-expanded={isExpanded}
                      className="w-full min-h-[48px] flex items-center justify-between text-[15px] font-medium text-cocoa-900 hover:text-blush-700 text-left"
                    >
                      <span>{group.title}</span>
                      <span
                        aria-hidden="true"
                        className="text-lg font-normal text-cocoa-700 leading-none px-1"
                      >
                        {isExpanded ? "–" : "+"}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="mb-3 bg-sand-100 rounded-[12px] px-3 py-1.5 divide-y divide-sand-300/60">
                        {group.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className="min-h-[44px] flex items-center text-[14px] text-cocoa-700 hover:text-cocoa-900 hover:underline"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* 3. Quick links */}
              {currentDeptContent.quickLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="min-h-[48px] flex items-center text-[15px] font-medium text-cocoa-900 hover:text-blush-700 hover:underline"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>

            {/* Grey Section (bg sand-100): Occasions, Our Story, Recently viewed */}
            <div className="bg-sand-100 px-5 divide-y divide-sand-300 border-t border-b border-sand-300">
              {drawerMore.map((item) => (
                <button
                  key={item.id}
                  ref={(el) => {
                    subMenuTriggerRefs.current[item.id] = el;
                  }}
                  type="button"
                  onClick={() => handleOpenSubMenu(item.id)}
                  className="w-full min-h-[48px] flex items-center justify-between text-[13px] font-semibold uppercase tracking-[0.06em] text-cocoa-900 hover:text-blush-700 text-left"
                >
                  <span>{item.label}</span>
                  <ChevronRight size={16} strokeWidth={1.5} />
                </button>
              ))}
            </div>

            {/* Links Section: Sign in, Wishlist, Track order, Contact, India | Global, Instagram */}
            <div className="px-5 py-2 divide-y divide-sand-300">
              {drawerFooterLinks.map((item) => {
                const icon =
                  item.label === "Sign in" ? (
                    <User size={18} strokeWidth={1.5} />
                  ) : item.label === "Wishlist" ? (
                    <Heart size={18} strokeWidth={1.5} />
                  ) : item.label === "Track order" ? (
                    <Package size={18} strokeWidth={1.5} />
                  ) : (
                    <Mail size={18} strokeWidth={1.5} />
                  );

                if (item.action === "account") {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenAccount();
                      }}
                      className="w-full min-h-[48px] flex items-center gap-3 text-[15px] font-medium text-cocoa-900 hover:text-blush-700 text-left"
                    >
                      {icon}
                      <span>{item.label}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href || "/"}
                    onClick={onClose}
                    className="min-h-[48px] flex items-center gap-3 text-[15px] font-medium text-cocoa-900 hover:text-blush-700 hover:underline"
                  >
                    {icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* India | Global + Instagram row */}
              <div className="py-2 space-y-2">
                <div className="min-h-[44px] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-cocoa-900">
                    <Globe size={18} strokeWidth={1.5} />
                    <button
                      type="button"
                      onClick={() => setShowGlobalNote(false)}
                      className={cn(
                        "min-h-[44px] px-1 inline-flex items-center gap-1",
                        !showGlobalNote
                          ? "font-semibold underline underline-offset-4"
                          : "text-cocoa-700"
                      )}
                    >
                      <span>{siteConfig.countries.current}</span>
                      {!showGlobalNote && (
                        <Check size={14} strokeWidth={2} className="text-blush-700" />
                      )}
                    </button>
                    <span className="text-cocoa-500">|</span>
                    <button
                      type="button"
                      onClick={() => setShowGlobalNote(true)}
                      className={cn(
                        "min-h-[44px] px-1 inline-flex items-center",
                        showGlobalNote
                          ? "font-semibold underline underline-offset-4"
                          : "text-cocoa-700 hover:text-cocoa-900"
                      )}
                    >
                      Global
                    </button>
                  </div>

                  <a
                    href={siteConfig.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Cocomishri on Instagram"
                    className="size-11 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-100 transition-colors"
                  >
                    <InstagramIcon size={20} strokeWidth={1.5} />
                  </a>
                </div>

                {showGlobalNote && (
                  <div className="p-3 rounded-[12px] bg-sand-100 text-xs text-cocoa-700 leading-relaxed space-y-1">
                    <p>{siteConfig.countries.global.note}</p>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="inline-block font-semibold text-blush-700 underline underline-offset-2"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Newsletter Box (bg sand-100) */}
            <div className="bg-sand-100 px-5 py-6 border-t border-sand-300 space-y-3">
              <p className="font-heading text-[20px] font-medium text-cocoa-900">
                Join our little world
              </p>

              {isSubscribed ? (
                <p className="text-sm text-cocoa-900 bg-cream-50 border border-sand-300 rounded-[12px] p-3">
                  Thank you for joining our little world. We&apos;ll be in touch
                  soon.
                </p>
              ) : (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="space-y-2"
                  noValidate
                >
                  <Input
                    type="email"
                    label="Email address"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    error={emailError}
                    className="bg-cream-50"
                  />
                  <button
                    type="submit"
                    className="min-h-[44px] inline-flex items-center text-sm font-semibold text-cocoa-900 hover:text-blush-700 underline underline-offset-4"
                  >
                    Sign me up
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Slide-In Sub-Menu View */}
          <div
            aria-hidden={!isSubMenuOpen}
            inert={!isSubMenuOpen}
            className={cn(
              "absolute inset-0 bg-cream-50 flex flex-col overflow-y-auto transition-transform duration-300 ease-soft motion-reduce:transition-none",
              isSubMenuOpen
                ? "translate-x-0"
                : "translate-x-full pointer-events-none"
            )}
          >
            {currentSubMenuObj && (
              <>
                <button
                  ref={backBtnRef}
                  type="button"
                  onClick={handleCloseSubMenu}
                  aria-label="Back"
                  className="w-full min-h-[48px] px-4 border-b border-sand-300 bg-sand-100 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-cocoa-900 hover:text-blush-700 text-left shrink-0"
                >
                  <ChevronLeft size={16} strokeWidth={1.5} />
                  <span>{currentSubMenuObj.label}</span>
                </button>

                {activeSubMenu === "recently-viewed" ? (
                  <div className="p-5">
                    {recentlyViewed.length === 0 ? (
                      <p className="text-sm text-cocoa-700">
                        Pieces you look at will appear here.
                      </p>
                    ) : (
                      <ul className="divide-y divide-sand-300">
                        {recentlyViewed.map((id) => (
                          <li key={id}>
                            <Link
                              href={`/products/${id}`}
                              onClick={onClose}
                              className="min-h-[48px] flex items-center text-[15px] font-medium text-cocoa-900 hover:text-blush-700 hover:underline"
                            >
                              {id}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <ul className="px-5 divide-y divide-sand-300">
                    {currentSubMenuObj.links?.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={onClose}
                          className="min-h-[48px] flex items-center text-[15px] font-medium text-cocoa-900 hover:text-blush-700 hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
