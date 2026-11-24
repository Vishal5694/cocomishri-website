"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/asset";
import { X, ChevronDown, Mail, MessageCircle, User } from "lucide-react";
import { mainNav, NavItem, supportLinks } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";
import { InstagramIcon } from "@/components/ui";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function MobileMenu({ isOpen, onClose, triggerRef }: MobileMenuProps) {
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const [openAccordions, setOpenAccordions] = React.useState<Record<string, boolean>>({});

  // Lock body scroll and handle focus trap
  React.useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button on open
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        triggerRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

  const toggleAccordion = (label: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const showWhatsApp =
    siteConfig.whatsapp && !siteConfig.whatsapp.startsWith("PLACEHOLDER");

  if (!isOpen) return null;

  const isHelpExpanded = !!openAccordions["Help"];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-cocoa-900/40 transition-opacity duration-300 ease-soft"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          "fixed inset-y-0 left-0 w-[85%] max-w-[360px] bg-cream-50 text-cocoa-900 shadow-2xl flex flex-col z-50",
          "animate-in slide-in-from-left duration-300 ease-soft overflow-hidden"
        )}
      >
        {/* Top bar with wordmark & close button */}
        <div className="h-16 px-4 border-b border-sand-300 flex items-center justify-between shrink-0">
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
            onClick={() => {
              onClose();
              triggerRef.current?.focus();
            }}
            aria-label="Close menu"
            className="size-11 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-100 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto divide-y divide-sand-300">
          {mainNav.map((item: NavItem) => {
            const hasGroups = item.groups && item.groups.length > 0;
            const isExpanded = !!openAccordions[item.label];

            if (!hasGroups) {
              return (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center min-h-[48px] px-5 text-base font-semibold text-cocoa-900 hover:bg-sand-100 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-[-2px]"
                  >
                    {item.label}
                  </Link>
                </div>
              );
            }

            return (
              <div key={item.label} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.label)}
                  aria-expanded={isExpanded}
                  className="w-full flex items-center justify-between min-h-[48px] px-5 text-base font-semibold text-cocoa-900 hover:bg-sand-100 transition-colors text-left focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-[-2px]"
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    size={18}
                    strokeWidth={1.5}
                    className={cn(
                      "text-cocoa-500 transition-transform duration-300 ease-soft shrink-0",
                      isExpanded && "rotate-180 text-cocoa-900"
                    )}
                  />
                </button>

                {isExpanded && (
                  <div className="bg-sand-100/50 px-5 py-3 space-y-4 border-t border-sand-300/60">
                    {item.groups?.map((group) => (
                      <div key={group.title} className="space-y-1.5">
                        <span className="eyebrow block text-xs pt-1">
                          {group.title}
                        </span>
                        <div className="flex flex-col">
                          {group.links.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={onClose}
                              className="flex items-center min-h-[44px] py-1 text-sm text-cocoa-700 hover:text-cocoa-900 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Help Accordion at bottom of Mobile Drawer with Support links from footer */}
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => toggleAccordion("Help")}
              aria-expanded={isHelpExpanded}
              className="w-full flex items-center justify-between min-h-[48px] px-5 text-base font-semibold text-cocoa-900 hover:bg-sand-100 transition-colors text-left focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-[-2px]"
            >
              <span>Help</span>
              <ChevronDown
                size={18}
                strokeWidth={1.5}
                className={cn(
                  "text-cocoa-500 transition-transform duration-300 ease-soft shrink-0",
                  isHelpExpanded && "rotate-180 text-cocoa-900"
                )}
              />
            </button>

            {isHelpExpanded && (
              <div className="bg-sand-100/50 px-5 py-3 space-y-1 border-t border-sand-300/60">
                <span className="eyebrow block text-xs pt-1 mb-1">
                  Support
                </span>
                <div className="flex flex-col">
                  {supportLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center min-h-[44px] py-1 text-sm text-cocoa-700 hover:text-cocoa-900 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Unpinned info block at the end of the scrollable list */}
          <div className="p-5 border-t border-sand-300 bg-sand-100/40 space-y-3">
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-2.5 min-h-[44px] text-sm font-semibold text-cocoa-900 hover:text-blush-700 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
            >
              <User size={18} strokeWidth={1.5} />
              <span>Account</span>
            </Link>

            <a
              href={siteConfig.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 min-h-[44px] text-sm text-cocoa-700 hover:text-cocoa-900 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
            >
              <InstagramIcon size={18} strokeWidth={1.5} />
              <span>{siteConfig.instagram.handle}</span>
            </a>

            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-2.5 min-h-[44px] text-sm text-cocoa-700 hover:text-cocoa-900 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
            >
              <Mail size={18} strokeWidth={1.5} />
              <span>{siteConfig.email}</span>
            </a>

            {showWhatsApp && (
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 min-h-[44px] text-sm text-cocoa-700 hover:text-cocoa-900 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
              >
                <MessageCircle size={18} strokeWidth={1.5} />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
