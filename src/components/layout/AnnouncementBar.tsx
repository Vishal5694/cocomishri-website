"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function AnnouncementBar() {
  const announcements = siteConfig.announcements;
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const prefersReducedMotion = React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  React.useEffect(() => {
    if (announcements.length <= 1 || isPaused || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [announcements.length, isPaused, prefersReducedMotion]);

  if (announcements.length === 0) return null;

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const currentMessage = prefersReducedMotion ? announcements[0] : announcements[currentIndex];

  return (
    <div
      role="region"
      aria-label="Announcement"
      tabIndex={0}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className={cn(
        "w-full h-9 bg-blush-100 text-cocoa-900 text-sm flex items-center justify-center select-none relative z-30",
        "focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-[-2px]"
      )}
    >
      <Container className="flex items-center justify-center w-full relative">
        {/* Desktop Previous message button */}
        {announcements.length > 1 && !prefersReducedMotion && (
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous message"
            className="hidden lg:flex absolute left-4 items-center justify-center size-11 text-cocoa-700 hover:text-cocoa-900 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-[-2px] rounded-pill"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>
        )}

        {/* Message */}
        <p
          key={prefersReducedMotion ? 0 : currentIndex}
          className="w-full text-center text-xs sm:text-sm font-medium tracking-normal truncate px-2 lg:px-16 transition-opacity duration-300 ease-soft"
        >
          {currentMessage}
        </p>

        {/* Desktop Next message button */}
        {announcements.length > 1 && !prefersReducedMotion && (
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next message"
            className="hidden lg:flex absolute right-4 items-center justify-center size-11 text-cocoa-700 hover:text-cocoa-900 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-[-2px] rounded-pill"
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
        )}
      </Container>
    </div>
  );
}
