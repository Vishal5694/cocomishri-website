"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Panel } from "./Panel";
import { Container } from "./Container";
import { BrandImage } from "@/components/ui/BrandImage";
import { col } from "@/lib/navigation";
import { getSuggestions } from "@/lib/search/getSuggestions";
import { useMediaQuery } from "@/lib/ui/useMediaQuery";
import type { ImageKey } from "@/lib/images";

const popularChips = [
  col("Naming ceremony", "naming-ceremony"),
  col("First birthday", "first-birthday"),
  col("Festive", "festive"),
  col("Sets", "baby-girls-sets"),
  col("Dresses", "girls-dresses"),
  col("Nightwear", "nightwear"),
  col("Sibling matching", "sibling-matching"),
];

const categoryTiles: {
  label: string;
  imageKey: ImageKey;
  href: string;
}[] = [
  {
    label: "New in",
    imageKey: "occasion-naming-ceremony",
    href: "/collections/baby-new-in",
  },
  {
    label: "Baby + Toddler",
    imageKey: "product-1",
    href: "/collections/baby-toddler",
  },
  {
    label: "Girls",
    imageKey: "product-6",
    href: "/collections/girls",
  },
  {
    label: "Boys",
    imageKey: "occasion-everyday-comfort",
    href: "/collections/boys",
  },
  {
    label: "Festive",
    imageKey: "occasion-festive",
    href: "/collections/festive",
  },
  {
    label: "Gift shop",
    imageKey: "gifting",
    href: "/gifting",
  },
];

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null> | HTMLElement | null;
}

export function SearchPanel({ isOpen, onClose, triggerRef }: SearchPanelProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isSmUp = useMediaQuery("(min-width: 640px)", true);
  const placeholder = isSmUp
    ? "Search for a product or category…"
    : "Search…";

  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setQuery("");
    }
  }

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      onClose();
    }
  };

  const handleReset = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const trimmedQuery = query.trim();
  const suggestions = getSuggestions(query);

  return (
    <Panel
      isOpen={isOpen}
      onClose={onClose}
      titleId="search-panel-heading"
      side="top"
      triggerRef={triggerRef}
      className="fixed inset-x-0 top-16 lg:top-[72px] bottom-0 lg:bottom-auto lg:max-h-[85vh] w-full bg-cream-50 border-b border-sand-300 shadow-xl overflow-y-auto"
    >
      <Container className="py-6 lg:py-8 space-y-8">
        <h2 id="search-panel-heading" className="sr-only">
          Search
        </h2>

        {/* Row 1: Full-width input (56px tall, bottom border cocoa-900, 18px text), Reset, Close X */}
        <div className="space-y-2">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-b border-cocoa-900"
          >
            <label htmlFor="header-search-input" className="sr-only">
              Search
            </label>
            <input
              ref={inputRef}
              id="header-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              suppressHydrationWarning
              className="flex-1 h-14 bg-transparent rounded-none text-[18px] text-cocoa-900 placeholder:text-cocoa-500 focus:outline-none"
            />

            {query.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="min-h-[44px] px-2 text-sm font-semibold text-cocoa-700 hover:text-cocoa-900 underline underline-offset-4 shrink-0"
              >
                Reset
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="size-11 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-100 transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </form>

          {/* While typing */}
          {trimmedQuery.length > 0 && (
            <div className="pt-2">
              {suggestions.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {suggestions.map((item) => (
                    <Link
                      key={item.id}
                      href={`/collections/${item.slug}`}
                      onClick={onClose}
                      className="min-h-[44px] flex items-center px-3 py-2 rounded-card bg-sand-100 text-cocoa-900 hover:bg-sand-300/50 transition-colors text-sm font-medium"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-cocoa-700">
                  Press Enter to search for &ldquo;{trimmedQuery}&rdquo;.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Row 2: POPULAR SEARCHES */}
        <div className="space-y-3">
          <span className="eyebrow block">POPULAR SEARCHES</span>
          <div className="flex flex-wrap items-center gap-2">
            {popularChips.map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                onClick={onClose}
                className="min-h-[44px] lg:min-h-[40px] px-4 rounded-pill border border-sand-300 text-cocoa-900 hover:border-cocoa-900 hover:bg-sand-100 inline-flex items-center text-sm font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Row 3: SHOP BY CATEGORY (3 per row desktop, 2 per row mobile, 4:3, no gap desktop / 4px mobile) */}
        <div className="space-y-3">
          <span className="eyebrow block">SHOP BY CATEGORY</span>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-0">
            {categoryTiles.map((tile) => (
              <Link
                key={tile.href}
                href={tile.href}
                onClick={onClose}
                className="group relative block overflow-hidden focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
              >
                <BrandImage
                  imageKey={tile.imageKey}
                  ratioOverride="4/3"
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="w-full rounded-none transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-cocoa-900/45 pointer-events-none"
                />
                <span className="absolute inset-0 z-10 flex items-center justify-center px-3 text-center font-body text-sm font-semibold uppercase tracking-[0.1em] text-cream-50">
                  {tile.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </Panel>
  );
}
