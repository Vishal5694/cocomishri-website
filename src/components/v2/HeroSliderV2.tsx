"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CampaignTitle } from "./CampaignTitle";
import { TextLink } from "./TextLink";
import { cn } from "@/lib/utils";

export interface HeroSlideData {
  id: string;
  title: string;
  isPrimaryHeading?: boolean;
  links: { label: string; href: string }[];
  desktopSrcSet?: string;
  mobileSrcSet?: string;
  fallbackSrc?: string;
  alt: string;
  desktopPosition?: string;
  mobilePosition?: string;
  shot?: string;
  isSample?: boolean;
}

export function HeroSliderV2({ slides }: { slides: HeroSlideData[] }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const touchStartX = React.useRef<number | null>(null);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  React.useEffect(() => {
    if (reducedMotion || isPaused || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [reducedMotion, isPaused, slides.length]);

  const goTo = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(diff) > 40) {
      if (diff < 0) goTo(activeIndex + 1);
      else goTo(activeIndex - 1);
    }
  };

  return (
    <section
      aria-label="Featured campaigns"
      aria-roledescription="carousel"
      className="relative w-full h-[calc(100svh-2rem)] min-h-[540px] mt-8 overflow-hidden bg-caramel-100 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, idx) => {
        const isActive = idx === activeIndex;
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-500 ease-soft motion-reduce:transition-none",
              isActive
                ? "opacity-100 z-10 pointer-events-auto"
                : "opacity-0 z-0 pointer-events-none"
            )}
          >
            {slide.fallbackSrc ? (
              <picture className="w-full h-full block">
                {slide.desktopSrcSet && (
                  <source
                    media="(min-width: 1024px)"
                    srcSet={slide.desktopSrcSet}
                  />
                )}
                {slide.mobileSrcSet && (
                  <source
                    media="(max-width: 1023px)"
                    srcSet={slide.mobileSrcSet}
                  />
                )}
                <img
                  src={slide.fallbackSrc}
                  alt={slide.alt}
                  sizes="100vw"
                  loading={idx === 0 ? "eager" : "lazy"}
                  fetchPriority={idx === 0 ? "high" : undefined}
                  decoding="async"
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: slide.desktopPosition || "center",
                  }}
                />
              </picture>
            ) : (
              <div
                role="img"
                aria-label={slide.alt}
                className="w-full h-full bg-caramel-100 flex items-center justify-center p-6 text-cocoa-700 text-sm"
              >
                {slide.shot && <span>Photo: {slide.shot}</span>}
              </div>
            )}

            {/* Contrast Scrim (cocoa-900 0 -> 55% at bottom) */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-cocoa-900/55 via-cocoa-900/20 to-transparent pointer-events-none"
            />

            {/* Centred Title + Links near the bottom */}
            <div className="absolute inset-x-0 bottom-14 sm:bottom-16 z-10 px-4 sm:px-6 text-center flex flex-col items-center">
              <div className="max-w-3xl space-y-4">
                <CampaignTitle
                  as={slide.isPrimaryHeading ? "h1" : "h2"}
                  className="text-cream-50"
                >
                  {slide.title}
                </CampaignTitle>
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                  {slide.links.map((link) => (
                    <TextLink
                      key={link.href}
                      href={link.href}
                      variant="cream"
                      className={isActive ? undefined : "pointer-events-none"}
                    >
                      {link.label}
                    </TextLink>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Prev / Next Arrows (44x44) */}
      <button
        type="button"
        onClick={() => goTo(activeIndex - 1)}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 size-11 items-center justify-center rounded-pill bg-cocoa-900/35 text-cream-50 hover:bg-cocoa-900/55 transition-colors focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-2"
      >
        <ChevronLeft size={22} strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={() => goTo(activeIndex + 1)}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 size-11 items-center justify-center rounded-pill bg-cocoa-900/35 text-cream-50 hover:bg-cocoa-900/55 transition-colors focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-2"
      >
        <ChevronRight size={22} strokeWidth={1.5} />
      </button>

      {/* Dots (24x24 tap areas) */}
      <div className="absolute bottom-4 inset-x-0 z-20 flex items-center justify-center gap-1">
        {slides.map((slide, idx) => {
          const active = idx === activeIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={active ? "true" : undefined}
              className="size-6 flex items-center justify-center rounded-pill focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-1"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-pill transition-all duration-300 ease-soft motion-reduce:transition-none",
                  active ? "w-5 bg-cream-50" : "w-1.5 bg-cream-50/60"
                )}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
