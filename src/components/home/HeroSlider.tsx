"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CampaignTitle, TextLink } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface HeroSlideData {
  id: string;
  title: string;
  links: { label: string; href: string }[];
  desktopSrcSet?: string;
  mobileSrcSet?: string;
  fallbackSrc?: string;
  alt: string;
  desktopPosition?: string;
  mobilePosition?: string;
  shot?: string;
}

export function HeroSlider({ slides }: { slides: HeroSlideData[] }) {
  const [imageIndex, setImageIndex] = React.useState(0);
  const [textIndex, setTextIndex] = React.useState(0);
  const [textVisible, setTextVisible] = React.useState(true);
  const [idleReady, setIdleReady] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [loadedMap, setLoadedMap] = React.useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    slides.forEach((s, i) => {
      if (!s.fallbackSrc) init[i] = true;
    });
    return init;
  });
  const [pendingIndex, setPendingIndex] = React.useState<number | null>(null);

  const imgRefs = React.useRef<Record<number, HTMLImageElement | null>>({});
  const fadeTimerRef = React.useRef<number | null>(null);
  const touchStartX = React.useRef<number | null>(null);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  React.useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setIdleReady(true), {
        timeout: 1000,
      });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setIdleReady(true), 200);
    return () => clearTimeout(id);
  }, []);

  React.useEffect(() => {
    slides.forEach((_, idx) => {
      const el = imgRefs.current[idx];
      if (el && el.complete && el.naturalWidth > 0) {
        setLoadedMap((prev) => (prev[idx] ? prev : { ...prev, [idx]: true }));
      }
    });
  }, [idleReady, slides]);

  const startTransition = React.useCallback(
    (targetIdx: number) => {
      if (fadeTimerRef.current !== null) {
        window.clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }

      if (reducedMotion) {
        setImageIndex(targetIdx);
        setTextIndex(targetIdx);
        setTextVisible(true);
        return;
      }

      setImageIndex(targetIdx);
      setTextVisible(false);
      fadeTimerRef.current = window.setTimeout(() => {
        setTextIndex(targetIdx);
        setTextVisible(true);
        fadeTimerRef.current = null;
      }, 200);
    },
    [reducedMotion]
  );

  React.useEffect(() => {
    return () => {
      if (fadeTimerRef.current !== null) {
        window.clearTimeout(fadeTimerRef.current);
      }
    };
  }, []);

  const goTo = React.useCallback(
    (index: number) => {
      const normalized = (index + slides.length) % slides.length;
      if (normalized === imageIndex && pendingIndex === null) return;

      if (!idleReady) {
        setIdleReady(true);
      }

      if (loadedMap[normalized]) {
        setPendingIndex(null);
        startTransition(normalized);
      } else {
        setPendingIndex(normalized);
      }
    },
    [slides.length, imageIndex, pendingIndex, idleReady, loadedMap, startTransition]
  );

  React.useEffect(() => {
    if (pendingIndex !== null && loadedMap[pendingIndex]) {
      const target = pendingIndex;
      setPendingIndex(null);
      startTransition(target);
    }
  }, [pendingIndex, loadedMap, startTransition]);

  React.useEffect(() => {
    if (reducedMotion || isPaused || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      const next = (imageIndex + 1) % slides.length;
      if (loadedMap[next]) {
        startTransition(next);
      }
    }, 6000);
    return () => window.clearInterval(timer);
  }, [reducedMotion, isPaused, slides.length, imageIndex, loadedMap, startTransition]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(diff) > 40) {
      if (diff < 0) goTo(imageIndex + 1);
      else goTo(imageIndex - 1);
    }
  };

  const activeTextSlide = slides[textIndex] || slides[0];

  return (
    <section
      aria-label="Featured campaigns"
      aria-roledescription="carousel"
      className="relative w-full h-[calc(100svh-2rem)] min-h-[540px] overflow-hidden bg-caramel-100 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <h1 className="sr-only">
        Cocomishri — soft, comfortable kidswear for little moments
      </h1>

      {/* Background Images (crossfade 600ms, instant with reduced motion) */}
      {slides.map((slide, idx) => {
        const isCurrentImg = idx === imageIndex;
        const shouldRenderImg = idx === 0 || idleReady;

        return (
          <div
            key={slide.id}
            aria-hidden={!isCurrentImg}
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-[600ms] ease-soft motion-reduce:transition-none",
              isCurrentImg ? "opacity-100 z-[1]" : "opacity-0 z-0 pointer-events-none"
            )}
          >
            {slide.fallbackSrc && shouldRenderImg ? (
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
                  ref={(el) => {
                    imgRefs.current[idx] = el;
                  }}
                  src={slide.fallbackSrc}
                  alt={slide.alt}
                  sizes="100vw"
                  loading="eager"
                  fetchPriority={idx === 0 ? "high" : "low"}
                  decoding="async"
                  onLoad={() =>
                    setLoadedMap((prev) =>
                      prev[idx] ? prev : { ...prev, [idx]: true }
                    )
                  }
                  onError={() =>
                    setLoadedMap((prev) =>
                      prev[idx] ? prev : { ...prev, [idx]: true }
                    )
                  }
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
          </div>
        );
      })}

      {/* Contrast Scrim (cocoa-900 0 -> 55% at bottom) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] bg-gradient-to-t from-cocoa-900/55 via-cocoa-900/20 to-transparent pointer-events-none"
      />

      {/* Single Non-Overlapping Text Overlay (200ms fade out, 300ms fade in) */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-14 sm:bottom-16 z-10 px-4 sm:px-6 text-center flex flex-col items-center",
          "transition-opacity ease-soft motion-reduce:transition-none",
          textVisible
            ? "opacity-100 duration-300"
            : "opacity-0 duration-200 pointer-events-none"
        )}
      >
        <div className="max-w-3xl space-y-4">
          <CampaignTitle as="h2" className="text-cream-50">
            {activeTextSlide.title}
          </CampaignTitle>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {activeTextSlide.links.map((link) => (
              <TextLink key={link.href} href={link.href} variant="cream">
                {link.label}
              </TextLink>
            ))}
          </div>
        </div>
      </div>

      {/* Prev / Next Arrows (44x44) */}
      <button
        type="button"
        onClick={() => goTo(imageIndex - 1)}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 size-11 items-center justify-center rounded-pill bg-cocoa-900/35 text-cream-50 hover:bg-cocoa-900/55 transition-colors focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-2"
      >
        <ChevronLeft size={22} strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={() => goTo(imageIndex + 1)}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 size-11 items-center justify-center rounded-pill bg-cocoa-900/35 text-cream-50 hover:bg-cocoa-900/55 transition-colors focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-2"
      >
        <ChevronRight size={22} strokeWidth={1.5} />
      </button>

      {/* Dots (24x24 tap areas) */}
      <div className="absolute bottom-4 inset-x-0 z-20 flex items-center justify-center gap-1">
        {slides.map((slide, idx) => {
          const active = idx === imageIndex;
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
