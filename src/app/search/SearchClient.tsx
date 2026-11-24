"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui";
import { col } from "@/lib/navigation";
import { useMediaQuery } from "@/lib/ui/useMediaQuery";

const quickChips = [
  col("Baby girls", "baby-girls"),
  col("Baby boys", "baby-boys"),
  col("Girls", "girls"),
  col("Boys", "boys"),
  col("Naming ceremony", "naming-ceremony"),
  col("Festive", "festive"),
];

export function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = React.useState(initialQuery);
  const isSmUp = useMediaQuery("(min-width: 640px)", true);
  const placeholder = isSmUp ? "Search for dresses, sets, occasions…" : "Search…";

  const [prevInitial, setPrevInitial] = React.useState(initialQuery);
  if (prevInitial !== initialQuery) {
    setPrevInitial(initialQuery);
    setQuery(initialQuery);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/search");
    }
  };

  const handleClear = () => {
    setQuery("");
  };

  const hasQuery = Boolean(initialQuery.trim());

  if (hasQuery) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center space-y-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium text-cocoa-900">
          Results for &ldquo;{initialQuery.trim()}&rdquo;
        </h1>
        <p className="text-base lg:text-lg text-cocoa-700 max-w-xl mx-auto">
          Search opens soon. Until then, browse by age or occasion.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/collections/baby-toddler">
            <Button variant="secondary" size="lg">
              Shop Baby + Toddler
            </Button>
          </Link>
          <Link href="/collections/occasions">
            <Button variant="secondary" size="lg">
              Shop occasions
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center space-y-8">
      <span className="eyebrow">Search</span>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium text-cocoa-900">
        Search
      </h1>

      <div className="max-w-[560px] mx-auto w-full space-y-6 pt-2">
        <form onSubmit={handleSubmit} className="relative flex items-center w-full">
          <label htmlFor="search-page-input" className="sr-only">
            Search
          </label>
          <input
            id="search-page-input"
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
                className="min-h-[44px] px-4 rounded-pill border border-sand-300 text-cocoa-700 hover:text-cocoa-900 hover:border-cocoa-700 inline-flex items-center text-sm font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
