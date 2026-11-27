"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { CampaignTitle } from "./CampaignTitle";
import { TextLink } from "./TextLink";
import { HERO_CONFIG, type HeroV2Config } from "@/lib/hero-v2-config";
import { images, type ImageEntry, type ImageKey } from "@/lib/images";
import imageLoader from "@/lib/image-loader";
import { cn } from "@/lib/utils";

const REFERENCE_V2_CONFIG: HeroV2Config = {
  ...HERO_CONFIG,
  mediaType: "photo",
  headingVisible: false,
  intervalSec: 6,
  controls: {
    arrows: true,
    dots: true,
    pause: false,
    progress: false,
    counter: false,
    swipe: true,
  },
  scrimPercent: 55,
};

const COLOUR_BG_CLASSES = [
  "bg-sand-100",
  "bg-blush-100",
  "bg-caramel-100",
  "bg-sage-100",
] as const;

function resolveImageUrl(key: ImageKey): string | undefined {
  const entry = images[key] as ImageEntry | undefined;
  if (!entry) return undefined;
  const isDev = process.env.NODE_ENV !== "production";
  const showSample =
    isDev || process.env.NEXT_PUBLIC_SHOW_SAMPLE_IMAGES === "true";
  const raw = entry.src || (showSample ? entry.sampleSrc : null);
  if (!raw) return undefined;
  return imageLoader({ src: raw, width: 1600, quality: 75 });
}

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
  videoUrl?: string;
}

export function HeroSliderV2({
  slides: propSlides,
  headingText = "Cocomishri — soft, comfortable kidswear for little moments",
  useCustomizerConfig = false,
}: {
  slides: HeroSlideData[];
  headingText?: string;
  useCustomizerConfig?: boolean;
}) {
  const cfg = useCustomizerConfig ? HERO_CONFIG : REFERENCE_V2_CONFIG;

  const slides = React.useMemo<HeroSlideData[]>(() => {
    if (!useCustomizerConfig) return propSlides;

    const activeList = cfg.slides
      .filter((s) => s.enabled)
      .map((s): HeroSlideData => {
        const links: { label: string; href: string }[] = [
          {
            label: s.link1Text || "Shop now",
            href: s.link1Href || "/shop",
          },
        ];
        if (s.link2Text && s.link2Href) {
          links.push({ label: s.link2Text, href: s.link2Href });
        }

        const focusStr = `${s.focusX}% ${s.focusY}%`;
        const entry = images[s.imageKey] as ImageEntry;

        return {
          id: s.id,
          title: s.title,
          links,
          fallbackSrc: resolveImageUrl(s.imageKey),
          alt: entry?.alt || s.title,
          desktopPosition: focusStr,
          shot: entry?.shot,
          videoUrl: s.previewVideoUrl || undefined,
        };
      });

    return activeList.length > 0 ? activeList : propSlides;
  }, [useCustomizerConfig, cfg.slides, propSlides]);

  const [imageIndex, setImageIndex] = React.useState(0);
  const [textIndex, setTextIndex] = React.useState(0);
  const [textVisible, setTextVisible] = React.useState(true);
  const [idleReady, setIdleReady] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [userPaused, setUserPaused] = React.useState(false);
  const [isTabHidden, setIsTabHidden] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [loadedMap, setLoadedMap] = React.useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    propSlides.forEach((s, i) => {
      if (!s.fallbackSrc) init[i] = true;
    });
    return init;
  });
  const [pendingIndex, setPendingIndex] = React.useState<number | null>(null);

  const imgRefs = React.useRef<Record<number, HTMLImageElement | null>>({});
  const fadeTimerRef = React.useRef<number | null>(null);
  const touchStartX = React.useRef<number | null>(null);

  const safeImageIndex =
    slides.length > 0 ? imageIndex % slides.length : 0;
  const safeTextIndex = slides.length > 0 ? textIndex % slides.length : 0;

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  React.useEffect(() => {
    const handleVisibility = () => {
      setIsTabHidden(document.visibilityState === "hidden");
    };
    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Load slides 2 and 3 right after the page is idle
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

  // Sync any already-cached images
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

      // Crossfade images (600ms) while current text fades OUT completely (200ms),
      // then next text fades IN (300ms).
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
      if (slides.length === 0) return;
      const normalized = (index + slides.length) % slides.length;
      if (normalized === safeImageIndex && pendingIndex === null) return;

      if (!idleReady) {
        setIdleReady(true);
      }

      if (loadedMap[normalized] || !slides[normalized]?.fallbackSrc) {
        setPendingIndex(null);
        startTransition(normalized);
      } else {
        setPendingIndex(normalized);
      }
    },
    [slides, safeImageIndex, pendingIndex, idleReady, loadedMap, startTransition]
  );

  // Trigger pending transition as soon as the target image finishes loading
  React.useEffect(() => {
    if (pendingIndex !== null && loadedMap[pendingIndex]) {
      const target = pendingIndex;
      setPendingIndex(null);
      startTransition(target);
    }
  }, [pendingIndex, loadedMap, startTransition]);

  const isAutoplayPaused =
    reducedMotion ||
    !cfg.autoplay ||
    isPaused ||
    userPaused ||
    isTabHidden ||
    slides.length <= 1;
  const intervalMs = cfg.intervalSec * 1000;

  // Autoplay (disabled with reduced motion or pause)
  React.useEffect(() => {
    if (isAutoplayPaused) return;
    const timer = window.setInterval(() => {
      const next = (safeImageIndex + 1) % slides.length;
      if (loadedMap[next] || !slides[next]?.fallbackSrc) {
        startTransition(next);
      }
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [isAutoplayPaused, slides, safeImageIndex, loadedMap, startTransition, intervalMs]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!cfg.controls.swipe) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!cfg.controls.swipe || touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(diff) > 40) {
      if (diff < 0) goTo(safeImageIndex + 1);
      else goTo(safeImageIndex - 1);
    }
  };

  const activeTextSlide = slides[safeTextIndex] || slides[0];
  const isColourMode = cfg.placeholderMode === "colour";
  const resolvedHeading = useCustomizerConfig ? cfg.headingText : headingText;
  const isDuplicateHeading =
    activeTextSlide.title.trim().toLowerCase() ===
    resolvedHeading.trim().toLowerCase();
  const heightClass =
    cfg.height === "85"
      ? "h-[85svh] min-h-[480px]"
      : cfg.height === "70"
        ? "h-[70svh] min-h-[420px]"
        : "h-[calc(100svh-2rem)] min-h-[540px]";

  const textWrapperPosClass =
    cfg.textPosition === "centre"
      ? "inset-0 items-center justify-center px-4 sm:px-6 text-center"
      : cfg.textPosition === "bottom-left"
        ? "inset-x-0 bottom-14 sm:bottom-16 px-6 sm:px-12 lg:px-16 items-start text-left"
        : cfg.textPosition === "left-middle"
          ? "inset-0 px-6 sm:px-12 lg:px-16 items-start justify-center text-left"
          : "inset-x-0 bottom-14 sm:bottom-16 px-4 sm:px-6 items-center text-center";

  const scrimAlpha = cfg.scrimPercent / 100;
  const isDefaultScrim =
    cfg.scrimPercent === 55 &&
    (cfg.textPosition === "bottom-centre" || cfg.textPosition === "bottom-left");

  return (
    <section
      data-transparent-header={isColourMode ? undefined : true}
      aria-label="Featured campaigns"
      aria-roledescription="carousel"
      className={cn(
        "relative w-full overflow-hidden select-none",
        heightClass,
        isColourMode ? "bg-sand-100" : "bg-caramel-100"
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {!cfg.headingVisible && <h1 className="sr-only">{resolvedHeading}</h1>}
      {/* Background Images / Video / Colour (crossfade 600ms, instant with reduced motion) */}
      {slides.map((slide, idx) => {
        const isCurrentImg = idx === safeImageIndex;
        const shouldRenderImg = idx === 0 || idleReady;

        const transitionClass =
          cfg.transition === "slide"
            ? cn(
                "transition-transform duration-[600ms] ease-soft motion-reduce:transition-none",
                isCurrentImg
                  ? "translate-x-0 z-[1]"
                  : idx < safeImageIndex
                    ? "-translate-x-full z-0 pointer-events-none"
                    : "translate-x-full z-0 pointer-events-none"
              )
            : cn(
                "transition-opacity duration-[600ms] ease-soft motion-reduce:transition-none",
                isCurrentImg ? "opacity-100 z-[1]" : "opacity-0 z-0 pointer-events-none"
              );

        return (
          <div
            key={slide.id}
            aria-hidden={!isCurrentImg}
            inert={!isCurrentImg}
            className={cn("absolute inset-0 w-full h-full", transitionClass)}
          >
            {isColourMode ? (
              <div
                aria-hidden="true"
                className={cn(
                  "w-full h-full",
                  COLOUR_BG_CLASSES[idx % COLOUR_BG_CLASSES.length]
                )}
              />
            ) : (
              <>
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

                {cfg.mediaType === "video" &&
                  !reducedMotion &&
                  slide.videoUrl && (
                    <video
                      src={slide.videoUrl}
                      poster={slide.fallbackSrc}
                      muted
                      loop
                      playsInline
                      autoPlay={isCurrentImg}
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        objectPosition: slide.desktopPosition || "center",
                      }}
                    />
                  )}
              </>
            )}
          </div>
        );
      })}

      {/* Contrast Scrim */}
      {!isColourMode &&
        (isDefaultScrim ? (
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[2] bg-gradient-to-t from-cocoa-900/55 via-cocoa-900/20 to-transparent pointer-events-none"
          />
        ) : cfg.textPosition === "bottom-centre" ||
          cfg.textPosition === "bottom-left" ? (
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[2] pointer-events-none"
            style={{
              background: `linear-gradient(to top, rgba(69, 33, 4, ${scrimAlpha}) 0%, rgba(69, 33, 4, ${(scrimAlpha * 0.36).toFixed(2)}) 45%, transparent 100%)`,
            }}
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[2] pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, rgba(69, 33, 4, ${scrimAlpha}) 0%, rgba(69, 33, 4, ${(scrimAlpha * 0.35).toFixed(2)}) 50%, transparent 80%)`,
            }}
          />
        ))}

      {/* Single Non-Overlapping Text Overlay (200ms fade out, 300ms fade in) */}
      <div
        className={cn(
          "absolute z-10 flex flex-col",
          textWrapperPosClass,
          "transition-opacity ease-soft motion-reduce:transition-none",
          textVisible
            ? "opacity-100 duration-300"
            : "opacity-0 duration-200 pointer-events-none"
        )}
      >
        <div className="max-w-3xl space-y-4">
          {cfg.headingVisible && (
            <h1
              className={cn(
                isDuplicateHeading
                  ? "sr-only"
                  : cn(
                      "font-body font-semibold text-[13px] uppercase tracking-[0.12em]",
                      isColourMode ? "text-cocoa-700" : "text-cream-50"
                    )
              )}
            >
              {resolvedHeading}
            </h1>
          )}
          {useCustomizerConfig &&
          (cfg.titleSizeDesktop !== 48 || cfg.titleSizeMobile !== 32) ? (
            <h2
              style={
                {
                  "--hero-t-m": `${cfg.titleSizeMobile}px`,
                  "--hero-t-d": `${cfg.titleSizeDesktop}px`,
                } as React.CSSProperties
              }
              className={cn(
                "font-heading font-medium normal-case tracking-normal text-[length:var(--hero-t-m)] lg:text-[length:var(--hero-t-d)] leading-[1.15] [font-variation-settings:'SOFT'_75]",
                isColourMode ? "text-cocoa-900" : "text-cream-50"
              )}
            >
              {activeTextSlide.title}
            </h2>
          ) : (
            <CampaignTitle
              as="h2"
              className={isColourMode ? "text-cocoa-900" : "text-cream-50"}
            >
              {activeTextSlide.title}
            </CampaignTitle>
          )}
          <div
            className={cn(
              "flex flex-wrap items-center gap-4 sm:gap-6",
              cfg.textPosition === "bottom-left" ||
                cfg.textPosition === "left-middle"
                ? "justify-start"
                : "justify-center"
            )}
          >
            {activeTextSlide.links.map((link, lIdx) =>
              cfg.linkStyle === "link" ? (
                <TextLink
                  key={`${link.href}-${lIdx}`}
                  href={link.href}
                  variant={isColourMode ? "dark" : "cream"}
                >
                  {link.label}
                </TextLink>
              ) : (
                <Link
                  key={`${link.href}-${lIdx}`}
                  href={link.href}
                  className={cn(
                    "min-h-[48px] px-8 rounded-pill font-body font-semibold uppercase text-[13px] tracking-[0.12em] inline-flex items-center justify-center transition-colors duration-300 ease-soft",
                    cfg.linkStyle === "solid"
                      ? isColourMode
                        ? "bg-cocoa-900 text-cream-50 hover:bg-cocoa-700"
                        : "bg-cream-50 text-cocoa-900 hover:bg-sand-100"
                      : isColourMode
                        ? "border border-cocoa-900 text-cocoa-900 hover:bg-cocoa-900 hover:text-cream-50"
                        : "border border-cream-50 text-cream-50 hover:bg-cream-50 hover:text-cocoa-900"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      {/* Prev / Next Arrows (44x44) */}
      {cfg.controls.arrows && slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(safeImageIndex - 1)}
            aria-label="Previous slide"
            className="hidden sm:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 size-11 items-center justify-center rounded-pill bg-cocoa-900/35 text-cream-50 hover:bg-cocoa-900/55 transition-colors focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-2"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={() => goTo(safeImageIndex + 1)}
            aria-label="Next slide"
            className="hidden sm:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 size-11 items-center justify-center rounded-pill bg-cocoa-900/35 text-cream-50 hover:bg-cocoa-900/55 transition-colors focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-2"
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </>
      )}

      {/* Dots / Counter / Pause */}
      {(cfg.controls.dots || cfg.controls.counter || cfg.controls.pause) &&
        slides.length > 1 && (
          <div className="absolute bottom-4 inset-x-0 z-20 flex items-center justify-center gap-1">
            {cfg.controls.dots &&
              slides.map((slide, idx) => {
                const active = idx === safeImageIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goTo(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    aria-current={active ? "true" : undefined}
                    className="size-11 flex items-center justify-center rounded-pill focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-1"
                  >
                    <span
                      className={cn(
                        "block h-1.5 rounded-pill transition-all duration-300 ease-soft motion-reduce:transition-none",
                        active
                          ? isColourMode
                            ? "w-5 bg-cocoa-900"
                            : "w-5 bg-cream-50"
                          : isColourMode
                            ? "w-1.5 bg-cocoa-900/40"
                            : "w-1.5 bg-cream-50/60"
                      )}
                    />
                  </button>
                );
              })}

            {cfg.controls.counter && (
              <span
                className={cn(
                  "font-body text-[13px] font-medium tabular-nums px-2",
                  isColourMode ? "text-cocoa-900" : "text-cream-50"
                )}
              >
                {safeImageIndex + 1} / {slides.length}
              </span>
            )}

            {cfg.controls.pause && (
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
                className={cn(
                  "size-11 flex items-center justify-center rounded-pill transition-colors focus-visible:outline-2 focus-visible:outline-offset-1",
                  isColourMode
                    ? "text-cocoa-900 hover:bg-cocoa-900/10 focus-visible:outline-cocoa-900"
                    : "text-cream-50 hover:bg-cream-50/15 focus-visible:outline-cream-50"
                )}
              >
                {userPaused ? (
                  <Play size={16} strokeWidth={1.75} />
                ) : (
                  <Pause size={16} strokeWidth={1.75} />
                )}
              </button>
            )}
          </div>
        )}

      {/* Progress Bars */}
      {cfg.controls.progress && slides.length > 1 && (
        <div
          aria-hidden="true"
          className="absolute bottom-2 inset-x-4 sm:inset-x-8 z-20 flex items-center gap-1.5"
        >
          {slides.map((slide, idx) => {
            const isPast = idx < safeImageIndex;
            const isActive = idx === safeImageIndex;
            return (
              <div
                key={slide.id}
                className={cn(
                  "h-0.5 flex-1 rounded-pill overflow-hidden",
                  isColourMode ? "bg-cocoa-900/20" : "bg-cream-50/30"
                )}
              >
                <div
                  key={
                    isActive
                      ? `active-${safeImageIndex}-${isAutoplayPaused}`
                      : "idle"
                  }
                  className={cn(
                    "h-full",
                    isColourMode ? "bg-cocoa-900" : "bg-cream-50"
                  )}
                  style={{
                    width: isPast
                      ? "100%"
                      : isActive && isAutoplayPaused
                        ? "100%"
                        : "0%",
                    animation:
                      isActive && !isAutoplayPaused
                        ? `cm-hero-v2-progress ${cfg.intervalSec}s linear forwards`
                        : undefined,
                  }}
                />
              </div>
            );
          })}
          <style>{`
            @keyframes cm-hero-v2-progress {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}</style>
        </div>
      )}
    </section>
  );
}
