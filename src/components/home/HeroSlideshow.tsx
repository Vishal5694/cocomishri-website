"use client";

import * as React from "react";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { BrandImage } from "@/components/ui/BrandImage";
import { heroSlides } from "@/lib/hero";
import { images, type ImageEntry } from "@/lib/images";
import imageLoader from "@/lib/image-loader";
import { cn } from "@/lib/utils";

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
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [userPaused, setUserPaused] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocusedWithin, setIsFocusedWithin] = React.useState(false);
  const [isTabHidden, setIsTabHidden] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [preloadNextIndex, setPreloadNextIndex] = React.useState<number | null>(
    null
  );
  const [videoFailed, setVideoFailed] = React.useState<Record<number, boolean>>(
    {}
  );

  const videoRefs = React.useRef<Record<number, HTMLVideoElement | null>>({});
  const touchStart = React.useRef<{ x: number; y: number } | null>(null);

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
    userPaused ||
    isHovered ||
    isFocusedWithin ||
    isTabHidden ||
    heroSlides.length <= 1;

  // Autoplay: next slide every 7 seconds; preload next slide's video 1s before
  React.useEffect(() => {
    if (isAutoplayPaused) {
      setPreloadNextIndex(null);
      return;
    }

    const nextIdx = (activeIndex + 1) % heroSlides.length;
    const preloadTimer = window.setTimeout(() => {
      setPreloadNextIndex(nextIdx);
    }, 6000);

    const advanceTimer = window.setTimeout(() => {
      setActiveIndex(nextIdx);
      setPreloadNextIndex(null);
    }, 7000);

    return () => {
      window.clearTimeout(preloadTimer);
      window.clearTimeout(advanceTimer);
    };
  }, [isAutoplayPaused, activeIndex]);

  // Play only the active slide's video; pause others
  React.useEffect(() => {
    heroSlides.forEach((slide, idx) => {
      const video = videoRefs.current[idx];
      if (!video) return;

      if (!reducedMotion && slide.videoSrc && idx === activeIndex && !videoFailed[idx]) {
        video.play()?.catch(() => {
          // Ignore autoplay promise rejections
        });
      } else {
        video.pause();
      }
    });
  }, [activeIndex, reducedMotion, videoFailed]);

  const goTo = (index: number) => {
    setActiveIndex((index + heroSlides.length) % heroSlides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goTo(activeIndex + 1);
      else goTo(activeIndex - 1);
    }
  };

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      data-transparent-header
      className="relative w-full h-[calc(100svh-32px)] min-h-[540px] overflow-hidden bg-cocoa-900 select-none"
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
      <h1 className="sr-only">Sweet like Mishri. Soft like a hug.</h1>

      {heroSlides.map((slide, idx) => {
        const isActive = idx === activeIndex;
        const shouldShowVideo =
          !reducedMotion && Boolean(slide.videoSrc) && !videoFailed[idx];
        const shouldPreloadVideo = isActive || preloadNextIndex === idx;
        const posterUrl = shouldShowVideo
          ? getPosterUrl(slide.imageKey)
          : undefined;

        return (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${idx + 1} of ${heroSlides.length}`}
            aria-hidden={!isActive}
            inert={!isActive}
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-700 ease-soft motion-reduce:transition-none",
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            )}
          >
            {/* Fallback / Poster Image */}
            <BrandImage
              imageKey={slide.imageKey}
              priority={idx === 0}
              sizes="100vw"
              ratioOverride="auto"
              className="w-full h-full rounded-none [&_img]:[object-position:var(--slide-focus)]"
              style={
                {
                  aspectRatio: "auto",
                  height: "100%",
                  width: "100%",
                  "--slide-focus": slide.focus,
                } as React.CSSProperties
              }
            />

            {/* Video layer (when videoSrc is provided and reduced-motion is off) */}
            {shouldShowVideo && (
              <video
                ref={(el) => {
                  videoRefs.current[idx] = el;
                }}
                src={slide.videoSrc}
                poster={posterUrl}
                muted
                loop
                playsInline
                autoPlay={isActive}
                preload={shouldPreloadVideo ? "auto" : "none"}
                aria-hidden="true"
                onError={() =>
                  setVideoFailed((prev) => ({ ...prev, [idx]: true }))
                }
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: slide.focus }}
              />
            )}

            {/* Scrim: cocoa-900 35% + soft radial behind centre text */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-cocoa-900/35 pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(69, 33, 4, 0.55) 0%, rgba(69, 33, 4, 0.15) 45%, transparent 70%)",
              }}
            />

            {/* Centred Title + Outline Cream Button */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center gap-6">
              <h2 className="font-heading [font-variation-settings:'SOFT'_75] font-medium normal-case text-cream-50 text-[40px] lg:text-[64px] leading-[1.1] max-w-3xl">
                {slide.title}
              </h2>

              <Link
                href={slide.href}
                className="min-h-[48px] px-8 rounded-pill border border-cream-50 text-cream-50 bg-transparent font-body font-semibold uppercase text-[13px] tracking-[0.12em] inline-flex items-center justify-center hover:bg-cream-50 hover:text-cocoa-900 focus-visible:bg-cream-50 focus-visible:text-cocoa-900 focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-4 transition-colors duration-300 ease-soft"
              >
                Shop now
              </Link>
            </div>
          </div>
        );
      })}

      {/* Bottom Controls: 5 Dots + Pause/Play (32px above bottom edge) */}
      <div className="absolute bottom-8 inset-x-0 z-20 flex items-center justify-center gap-1 px-4">
        <div className="flex items-center">
          {heroSlides.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`Show slide ${idx + 1} of ${heroSlides.length}: ${slide.title}`}
                aria-current={isActive ? "true" : undefined}
                className="size-11 flex items-center justify-center rounded-pill focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-2"
              >
                <span
                  className={cn(
                    "block h-2 rounded-pill transition-all duration-300 ease-soft motion-reduce:transition-none",
                    isActive ? "w-6 bg-cream-50" : "w-2 bg-cream-50/50"
                  )}
                />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setUserPaused((prev) => !prev)}
          aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
          className="size-11 flex items-center justify-center rounded-pill text-cream-50 hover:bg-cream-50/15 transition-colors focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-2"
        >
          {userPaused ? (
            <Play size={16} strokeWidth={1.75} />
          ) : (
            <Pause size={16} strokeWidth={1.75} />
          )}
        </button>
      </div>
    </section>
  );
}
