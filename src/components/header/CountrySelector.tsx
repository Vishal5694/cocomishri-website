"use client";

import * as React from "react";
import { Globe, Check } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { HEADER_CONFIG } from "@/lib/header-config";
import { getBrandHex } from "@/lib/brand-colors";

interface CountrySelectorProps {
  transparent?: boolean;
}

export function CountrySelector({ transparent = false }: CountrySelectorProps) {
  const cfg = HEADER_CONFIG;
  const [isOpen, setIsOpen] = React.useState(false);
  const [showGlobalNote, setShowGlobalNote] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setShowGlobalNote(false);
        buttonRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setShowGlobalNote(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!cfg.countryOn) {
    return null;
  }

  const colorHex = transparent
    ? getBrandHex(cfg.iconColorOverHero)
    : getBrandHex(cfg.iconColor);

  return (
    <div ref={containerRef} className="relative hidden lg:flex items-center">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (isOpen) setShowGlobalNote(false);
        }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={
          cfg.countryStyle === "globe-only"
            ? `Select country (${siteConfig.countries.current})`
            : undefined
        }
        style={{ color: colorHex }}
        className={cn(
          "min-h-[44px] px-2.5 inline-flex items-center gap-1.5 rounded-pill text-sm font-medium transition-colors duration-300 ease-soft motion-reduce:transition-none",
          transparent
            ? "hover:bg-cream-50/15 focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-2"
            : "hover:bg-sand-100 focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
        )}
      >
        <Globe size={18} strokeWidth={1.5} />
        {cfg.countryStyle === "globe+text" && (
          <span className="underline underline-offset-4">
            {siteConfig.countries.current}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Select country"
          className="absolute right-0 top-full mt-2 w-64 bg-cream-50 text-cocoa-900 border border-sand-300 rounded-card shadow-xl p-2 z-50"
        >
          <button
            type="button"
            role="menuitemradio"
            aria-checked={!showGlobalNote}
            onClick={() => {
              setShowGlobalNote(false);
              setIsOpen(false);
            }}
            className="w-full min-h-[44px] px-3 rounded-[12px] flex items-center justify-between text-sm font-medium text-cocoa-900 hover:bg-sand-100 transition-colors text-left"
          >
            <span>{siteConfig.countries.current}</span>
            <Check size={16} strokeWidth={1.75} className="text-blush-700" />
          </button>

          <button
            type="button"
            role="menuitemradio"
            aria-checked={showGlobalNote}
            onClick={() => setShowGlobalNote(true)}
            className="w-full min-h-[44px] px-3 rounded-[12px] flex items-center justify-between text-sm font-medium text-cocoa-900 hover:bg-sand-100 transition-colors text-left"
          >
            <span>Global</span>
          </button>

          {showGlobalNote && (
            <div className="mt-2 p-3 rounded-[12px] bg-sand-100 text-xs text-cocoa-700 leading-relaxed space-y-1.5">
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
      )}
    </div>
  );
}
