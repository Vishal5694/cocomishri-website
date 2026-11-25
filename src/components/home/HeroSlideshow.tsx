"use client";

import * as React from "react";
import Link from "next/link";
import { Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { BrandImage } from "@/components/ui/BrandImage";
import { availableHeroSlides } from "@/lib/hero";
import { useSectionConfig } from "@/lib/customizer/CustomizerContext";
import { images, type ImageEntry } from "@/lib/images";
import imageLoader from "@/lib/image-loader";
import { cn } from "@/lib/utils";

const COLOUR_BG_CLASSES = [
  "bg-sand-100",
  "bg-blush-100",
  "bg-caramel-100",
  "bg-sage-100",
] as const;

function getPosterUrl(imageKey: keyof typeof images): string | undefined {
  const entry = images[imageKey] as ImageEntry | undefined;
  if (!entry) return undefined;
  const isDev = process.env.NODE_ENV !== "production";
  const showSample =
    isDev || process.env.NEXT_PUBLIC_SHOW_SAMPLE_IMAGES === "true";
  const raw = entry.src || (showSample ? entry.sampleSrc : null);
  if (!raw) return undefined;
  return imageLoader({ src: raw, width: 1280, quality: 70 });
}

export function HeroSlideshow() {
  const config = useSectionConfig("home-hero");

  const slideMetaMap = React.useMemo(
    () => new Map(availableHeroSlides.map((s) => [s.id, s])),
    []
  );

  const enabledSlides = React.useMemo(() => {
    const list = config.slides
      .filter((s) => s.enabled)
      .map((setting) => {
        const meta = slideMetaMap.get(setting.id);
        return meta ? { setting, meta } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    if (list.length === 0 && availableHeroSlides[0]) {
      return [
        {
          setting: config.slides[0],
          meta: availableHeroSlides[0],
        },
      ];
    }
    return list;
  }, [config.slides, slideMetaMap]);

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [userPaused, setUserPaused] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocusedWithin, setIsFocusedWithin] = React.useState(false);
  const [isTabHidden, setIsTabHidden] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [preloadNextIndex, setPreloadNextIndex] = React.useState<number | null>(
    null
  );
  const [videoFailed, setVideoFailed] = React.useState<Record<string, boolean>>(
    {}
  );

  const videoRefs = React.useRef<Record<string, HTMLVideoElement | null>>({});
  const touchStart = React.useRef<{ x: number; y: number } | null>(null);

  const safeIndex =
    enabledSlides.length > 0 ? activeIndex % enabledSlides.length : 0;
  const isSingleHero = enabledSlides.length <= 1;

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

  const isAutoplayPaused =
    reducedMotion ||
    !config.autoplay ||
    userPaused ||
    isHovered ||
    isFocusedWithin ||
    isTabHidden ||
    isSingleHero;

  const intervalMs = config.intervalSec * 1000;

  React.useEffect(() => {
    if (isAutoplayPaused) {
      setPreloadNextIndex(null);
      return;
    }

    const nextIdx = (safeIndex + 1) % enabledSlides.length;
    const preloadDelay = Math.max(0, intervalMs - 1000);

    const preloadTimer = window.setTimeout(() => {
      setPreloadNextIndex(nextIdx);
    }, preloadDelay);

    const advanceTimer = window.setTimeout(() => {
      setActiveIndex(nextIdx);
      setPreloadNextIndex(null);
    }, intervalMs);

    return () => {
      window.clearTimeout(preloadTimer);
      window.clearTimeout(advanceTimer);
    };
  }, [isAutoplayPaused, safeIndex, enabledSlides.length, intervalMs]);

  React.useEffect(() => {
    enabledSlides.forEach(({ setting, meta }, idx) => {
      const video = videoRefs.current[meta.id];
      if (!video) return;
      const videoUrl = setting.previewVideoUrl || meta.videoSrc;

      if (
        !reducedMotion &&
        config.mediaType === "video" &&
        config.placeholderMode === "sample" &&
        videoUrl &&
        idx === safeIndex &&
        !videoFailed[meta.id]
      ) {
        video.play()?.catch(() => {
          // Ignore autoplay promise rejections
        });
      } else {
        video.pause();
      }
    });
  }, [
    enabledSlides,
    safeIndex,
    reducedMotion,
    config.mediaType,
    config.placeholderMode,
    videoFailed,
  ]);

  const goTo = (index: number) => {
    if (enabledSlides.length === 0) return;
    setActiveIndex((index + enabledSlides.length) % enabledSlides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!config.controls.swipe || isSingleHero) return;
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!config.controls.swipe || isSingleHero || !touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goTo(safeIndex + 1);
      else goTo(safeIndex - 1);
    }
  };

  const heightClass =
    config.height === "85"
      ? "h-[85svh] min-h-[480px]"
      : config.height === "70"
        ? "h-[70svh] min-h-[420px]"
        : "h-[calc(100svh-32px)] min-h-[540px]";

  const isColourMode = config.placeholderMode === "colour";

  const textPosClass =
    config.textPosition === "bottom-centre"
      ? "items-center justify-end pb-24 text-center"
      : config.textPosition === "bottom-left"
        ? "items-start justify-end pb-24 text-left px-6 sm:px-12 lg:px-16"
        : config.textPosition === "left-middle"
          ? "items-start justify-center text-left px-6 sm:px-12 lg:px-16"
          : "items-center justify-center text-center";

  const getButtonClass = () => {
    if (config.buttonStyle === "solid") {
      return cn(
        "min-h-[48px] px-8 rounded-pill font-body font-semibold uppercase text-[13px] tracking-[0.12em] inline-flex items-center justify-center transition-colors duration-300 ease-soft",
        isColourMode
          ? "bg-cocoa-900 text-cream-50 hover:bg-cocoa-700 focus-visible:outline-2 focus-visible:outline-cocoa-900 focus-visible:outline-offset-4"
          : "bg-cream-50 text-cocoa-900 hover:bg-sand-100 focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-4"
      );
    }
    if (config.buttonStyle === "link") {
      return cn(
        "min-h-[44px] font-body font-semibold uppercase text-[13px] tracking-[0.12em] underline underline-offset-4 inline-flex items-center gap-1.5 transition-opacity duration-300 ease-soft hover:opacity-80",
        isColourMode
          ? "text-cocoa-900 focus-visible:outline-2 focus-visible:outline-cocoa-900 focus-visible:outline-offset-4"
          : "text-cream-50 focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-4"
      );
    }
    return cn(
      "min-h-[48px] px-8 rounded-pill border bg-transparent font-body font-semibold uppercase text-[13px] tracking-[0.12em] inline-flex items-center justify-center transition-colors duration-300 ease-soft",
      isColourMode
        ? "border-cocoa-900 text-cocoa-900 hover:bg-cocoa-900 hover:text-cream-50 focus-visible:bg-cocoa-900 focus-visible:text-cream-50 focus-visible:outline-2 focus-visible:outline-cocoa-900 focus-visible:outline-offset-4"
        : "border-cream-50 text-cream-50 hover:bg-cream-50 hover:text-cocoa-900 focus-visible:bg-cream-50 focus-visible:text-cocoa-900 focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-4"
    );
  };

  const scrimAlpha = config.scrimPercent / 100;
  const controlTextClass = isColourMode ? "text-cocoa-900" : "text-cream-50";

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      data-transparent-header={isColourMode ? undefined : true}
      className={cn(
        "relative w-full overflow-hidden select-none",
        heightClass,
        isColourMode ? "bg-sand-100" : "bg-cocoa-900"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocusedWithin(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsFocusedWithin(false);
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {!config.headingVisible && (
        <h1 className="sr-only">{config.headingText}</h1>
      )}

      {enabledSlides.map(({ setting, meta }, idx) => {
        const isActive = idx === safeIndex;
        const focusStr = `${setting.focusX}% ${setting.focusY}%`;
        const videoUrl = setting.previewVideoUrl || meta.videoSrc;
        const shouldShowVideo =
          !isColourMode &&
          !reducedMotion &&
          config.mediaType === "video" &&
          Boolean(videoUrl) &&
          !videoFailed[meta.id];
        const shouldPreloadVideo = isActive || preloadNextIndex === idx;
        const posterUrl = shouldShowVideo
          ? getPosterUrl(meta.imageKey)
          : undefined;

        const slideTransitionClass =
          config.transition === "slide"
            ? cn(
                "transition-transform duration-700 ease-soft motion-reduce:transition-none",
                isActive
                  ? "translate-x-0 z-10"
                  : idx < safeIndex
                    ? "-translate-x-full z-0 pointer-events-none"
                    : "translate-x-full z-0 pointer-events-none"
              )
            : cn(
                "transition-opacity duration-700 ease-soft motion-reduce:transition-none",
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              );

        return (
          <div
            key={meta.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${idx + 1} of ${enabledSlides.length}`}
            aria-hidden={!isActive}
            inert={!isActive}
            className={cn("absolute inset-0 w-full h-full", slideTransitionClass)}
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
                <BrandImage
                  imageKey={meta.imageKey}
                  priority={idx === 0}
                  sizes="100vw"
                  ratioOverride="auto"
                  className="w-full h-full rounded-none [&_img]:[object-position:var(--slide-focus)]"
                  style={
                    {
                      aspectRatio: "auto",
                      height: "100%",
                      width: "100%",
                      "--slide-focus": focusStr,
                    } as React.CSSProperties
                  }
                />

                {shouldShowVideo && (
                  <video
                    ref={(el) => {
                      videoRefs.current[meta.id] = el;
                    }}
                    src={videoUrl}
                    poster={posterUrl}
                    muted
                    loop
                    playsInline
                    autoPlay={isActive}
                    preload={shouldPreloadVideo ? "auto" : "none"}
                    aria-hidden="true"
                    onError={() =>
                      setVideoFailed((prev) => ({ ...prev, [meta.id]: true }))
                    }
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: focusStr }}
                  />
                )}

                {/* Scrim: cocoa-900 configurable + soft radial behind text */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none"
                  style={{ backgroundColor: `rgba(69, 33, 4, ${scrimAlpha})` }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(69, 33, 4, 0.55) 0%, rgba(69, 33, 4, 0.15) 45%, transparent 70%)",
                  }}
                />
              </>
            )}

            {/* Text Block or Full-Slide Link when textMode === 'none' */}
            {config.textMode === "none" ? (
              <Link
                href={meta.href}
                aria-label={setting.title || meta.title}
                className="absolute inset-0 z-10 block focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-[-4px]"
              />
            ) : (
              <div
                className={cn(
                  "absolute inset-0 z-10 flex flex-col px-6 gap-6",
                  textPosClass
                )}
              >
                <div className="space-y-3 max-w-3xl">
                  {config.headingVisible && idx === safeIndex && (
                    <h1
                      className={cn(
                        "font-body text-xs uppercase tracking-[0.12em] font-semibold",
                        isColourMode ? "text-cocoa-700" : "text-cream-50/90"
                      )}
                    >
                      {config.headingText}
                    </h1>
                  )}
                  <h2
                    className={cn(
                      "font-heading [font-variation-settings:'SOFT'_75] font-medium normal-case text-[40px] lg:text-[64px] leading-[1.1]",
                      isColourMode ? "text-cocoa-900" : "text-cream-50"
                    )}
                  >
                    {setting.title}
                  </h2>

                  {config.textMode === "title-line-button" && setting.line && (
                    <p
                      className={cn(
                        "text-base lg:text-lg leading-relaxed",
                        isColourMode ? "text-cocoa-700" : "text-cream-50/90"
                      )}
                    >
                      {setting.line}
                    </p>
                  )}
                </div>

                <Link href={meta.href} className={getButtonClass()}>
                  <span>{setting.buttonText || "Shop now"}</span>
                  {config.buttonStyle === "link" && (
                    <span aria-hidden="true">&rarr;</span>
                  )}
                </Link>
              </div>
            )}
          </div>
        );
      })}

      {/* Prev / Next Arrows */}
      {!isSingleHero && config.controls.arrows && (
        <>
          <button
            type="button"
            onClick={() => goTo(safeIndex - 1)}
            aria-label="Previous slide"
            className={cn(
              "absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 size-11 rounded-pill flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
              isColourMode
                ? "bg-cocoa-900/10 text-cocoa-900 hover:bg-cocoa-900/20 focus-visible:outline-cocoa-900"
                : "bg-cocoa-900/35 text-cream-50 hover:bg-cocoa-900/55 focus-visible:outline-cream-50"
            )}
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={() => goTo(safeIndex + 1)}
            aria-label="Next slide"
            className={cn(
              "absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 size-11 rounded-pill flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
              isColourMode
                ? "bg-cocoa-900/10 text-cocoa-900 hover:bg-cocoa-900/20 focus-visible:outline-cocoa-900"
                : "bg-cocoa-900/35 text-cream-50 hover:bg-cocoa-900/55 focus-visible:outline-cream-50"
            )}
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </>
      )}

      {/* Bottom Controls: Dots, Counter, Pause/Play */}
      {!isSingleHero &&
        (config.controls.dots ||
          config.controls.counter ||
          config.controls.pause) && (
          <div className="absolute bottom-8 inset-x-0 z-20 flex items-center justify-center gap-2 px-4">
            {config.controls.dots && (
              <div className="flex items-center">
                {enabledSlides.map(({ setting, meta }, idx) => {
                  const isActive = idx === safeIndex;
                  return (
                    <button
                      key={meta.id}
                      type="button"
                      onClick={() => goTo(idx)}
                      aria-label={`Show slide ${idx + 1} of ${enabledSlides.length}: ${setting.title}`}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "size-11 flex items-center justify-center rounded-pill focus-visible:outline-2 focus-visible:outline-offset-2",
                        isColourMode
                          ? "focus-visible:outline-cocoa-900"
                          : "focus-visible:outline-cream-50"
                      )}
                    >
                      <span
                        className={cn(
                          "block h-2 rounded-pill transition-all duration-300 ease-soft motion-reduce:transition-none",
                          isActive
                            ? isColourMode
                              ? "w-6 bg-cocoa-900"
                              : "w-6 bg-cream-50"
                            : isColourMode
                              ? "w-2 bg-cocoa-900/40"
                              : "w-2 bg-cream-50/50"
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {config.controls.counter && (
              <span
                className={cn(
                  "font-body text-[13px] font-medium tabular-nums px-1",
                  controlTextClass
                )}
              >
                {safeIndex + 1} / {enabledSlides.length}
              </span>
            )}

            {config.controls.pause && (
              <button
                type="button"
                onClick={() => setUserPaused((prev) => !prev)}
                aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
                className={cn(
                  "size-11 flex items-center justify-center rounded-pill transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
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
      {!isSingleHero && config.controls.progress && (
        <div
          aria-hidden="true"
          className="absolute bottom-2 inset-x-4 sm:inset-x-8 z-20 flex items-center gap-1.5"
        >
          {enabledSlides.map(({ meta }, idx) => {
            const isPast = idx < safeIndex;
            const isActive = idx === safeIndex;
            return (
              <div
                key={meta.id}
                className={cn(
                  "h-0.5 flex-1 rounded-pill overflow-hidden",
                  isColourMode ? "bg-cocoa-900/20" : "bg-cream-50/30"
                )}
              >
                <div
                  key={isActive ? `active-${safeIndex}-${isAutoplayPaused}` : "idle"}
                  className={cn(
                    "h-full",
                    isColourMode ? "bg-cocoa-900" : "bg-cream-50"
                  )}
                  style={{
                    width: isPast ? "100%" : isActive && isAutoplayPaused ? "100%" : "0%",
                    animation:
                      isActive && !isAutoplayPaused
                        ? `cm-hero-progress ${config.intervalSec}s linear forwards`
                        : undefined,
                  }}
                />
              </div>
            );
          })}
          <style>{`
            @keyframes cm-hero-progress {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}</style>
        </div>
      )}
    </section>
  );
}
