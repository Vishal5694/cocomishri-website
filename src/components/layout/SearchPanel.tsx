"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Panel } from "./Panel";
import { col } from "@/lib/navigation";
import { getSuggestions } from "@/lib/search/getSuggestions";
import { useMediaQuery } from "@/lib/ui/useMediaQuery";

const quickChips = [
  col("Baby girls", "baby-girls"),
  col("Baby boys", "baby-boys"),
  col("Girls", "girls"),
  col("Boys", "boys"),
  col("Naming ceremony", "naming-ceremony"),
  col("Festive", "festive"),
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
  const placeholder = isSmUp ? "Search for dresses, sets, occasions…" : "Search…";

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

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const suggestions = getSuggestions(query);

  return (
    <Panel
      isOpen={isOpen}
      onClose={onClose}
      titleId="search-panel-heading"
      side="top"
      triggerRef={triggerRef}
      className="fixed inset-x-0 top-16 lg:top-20 bottom-0 lg:bottom-auto w-full bg-cream-50 border-b border-sand-300 shadow-xl overflow-y-auto"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 relative">
        <h2 id="search-panel-heading" className="sr-only">
          Search
        </h2>

        {/* Close Button on Desktop & Mobile */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="size-11 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-100 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2 absolute top-3 right-3 lg:top-4 lg:right-4 z-10"
        >
          <X size={22} strokeWidth={1.5} />
        </button>

        {/* Centred Search Input Container (max-width 560px) */}
        <div className="max-w-[560px] mx-auto w-full pt-12 lg:pt-0 space-y-6">
          <form onSubmit={handleSubmit} className="relative flex items-center w-full">
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
              className="w-full h-12 pl-5 pr-24 rounded-pill bg-sand-100 border border-cocoa-500 text-cocoa-900 placeholder:text-cocoa-500 text-base focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2 transition-colors"
            />

            <div className="absolute right-1 flex items-center gap-0.5">
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear search"
                  className="size-10 flex items-center justify-center rounded-pill text-cocoa-700 hover:text-cocoa-900 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              )}
              <button
                type="submit"
                aria-label="Submit search"
                className="size-11 shrink-0 flex items-center justify-center rounded-pill text-cocoa-900 hover:text-blush-700 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
            </div>
          </form>

          {/* Quick-link chips */}
          <div className="space-y-2 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {quickChips.map((chip) => (
                <Link
                  key={chip.href}
                  href={chip.href}
                  onClick={onClose}
                  className="min-h-[44px] px-4 rounded-pill border border-sand-300 text-cocoa-700 hover:text-cocoa-900 hover:border-cocoa-700 inline-flex items-center text-sm font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Product suggestions section: render ONLY when array is not empty */}
          {suggestions.length > 0 && (
            <div className="pt-4 border-t border-sand-300 space-y-3">
              <span className="eyebrow block">Product suggestions</span>
              <ul className="space-y-2">
                {suggestions.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/collections/${item.slug}`}
                      onClick={onClose}
                      className="min-h-[44px] flex items-center px-3 py-2 rounded-card text-cocoa-900 hover:bg-sand-100 transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
