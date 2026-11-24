"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronDown, Mail, User } from "lucide-react";
import { asset } from "@/lib/asset";
import { mainNav, NavItem, supportLinks } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export function MobileMenu({ isOpen, onClose, triggerRef }: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const drawerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        );
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-cocoa-900/40 backdrop-blur-[2px] transition-opacity duration-300 ease-soft motion-reduce:transition-none"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="relative z-10 w-full max-w-[380px] h-full bg-cream-50 text-cocoa-900 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Top bar */}
        <div className="h-16 px-6 border-b border-sand-300 flex items-center justify-between shrink-0">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center min-h-[44px] focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
          >
            <Image
              src={asset("/brand/wordmark.svg")}
              alt="Cocomishri"
              width={573}
              height={137}
              className="h-8 w-auto object-contain"
              loading="lazy"
            />
          </Link>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="size-11 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-100 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav list */}
        <nav
          aria-label="Mobile navigation"
          className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-sand-300"
        >
          {mainNav.map((item: NavItem) => {
            const hasGroups = item.groups && item.groups.length > 0;
            const isExpanded = expandedItem === item.label;

            if (!hasGroups) {
              return (
                <div key={item.label} className="py-1">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center min-h-[48px] text-base font-semibold text-cocoa-900 hover:text-blush-700 transition-colors"
                  >
                    {item.label}
                  </Link>
                </div>
              );
            }

            return (
              <div key={item.label} className="py-1">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedItem(isExpanded ? null : item.label)
                  }
                  aria-expanded={isExpanded}
                  className="w-full flex items-center justify-between min-h-[48px] text-base font-semibold text-cocoa-900 hover:text-blush-700 transition-colors text-left"
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    size={18}
                    strokeWidth={1.5}
                    className={cn(
                      "text-cocoa-500 transition-transform duration-300 ease-soft motion-reduce:transition-none",
                      isExpanded && "rotate-180 text-cocoa-900"
                    )}
                  />
                </button>

                {isExpanded && (
                  <div className="pb-4 pl-2 space-y-4">
                    {item.groups?.map((group) => (
                      <div key={group.title} className="space-y-1">
                        <span className="eyebrow block pt-2 pb-1">
                          {group.title}
                        </span>
                        <ul className="space-y-0.5">
                          {group.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                onClick={onClose}
                                className="min-h-[44px] flex items-center text-[15px] text-cocoa-700 hover:text-cocoa-900 hover:underline"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Support section */}
          <div className="pt-4 pb-2 space-y-1">
            <span className="eyebrow block pb-1">Support</span>
            <ul className="space-y-0.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="min-h-[44px] flex items-center text-[15px] text-cocoa-700 hover:text-cocoa-900 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Bottom links */}
        <div className="px-6 py-4 border-t border-sand-300 bg-sand-100/60 flex items-center justify-between shrink-0">
          <Link
            href="/account"
            onClick={onClose}
            className="min-h-[44px] inline-flex items-center gap-2 text-sm font-semibold text-cocoa-900 hover:text-blush-700"
          >
            <User size={18} strokeWidth={1.5} />
            <span>Account</span>
          </Link>
          <a
            href={`mailto:${siteConfig.email}`}
            className="min-h-[44px] inline-flex items-center gap-2 text-sm font-semibold text-cocoa-900 hover:text-blush-700"
          >
            <Mail size={18} strokeWidth={1.5} />
            <span>{siteConfig.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
