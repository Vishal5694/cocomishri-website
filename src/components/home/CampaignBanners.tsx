"use client";

import * as React from "react";
import Link from "next/link";
import { useDepartment } from "@/lib/department/DepartmentContext";
import { useSectionConfig } from "@/lib/customizer/CustomizerContext";
import {
  DEFAULT_CAMPAIGN_CONFIG,
  type CampaignBannerItem,
  type CampaignBannersConfig,
} from "@/lib/campaign-banners-config";
import { images, type ImageEntry, type ImageKey } from "@/lib/images";
import imageLoader from "@/lib/image-loader";
import { cn } from "@/lib/utils";

function resolveBannerImage(key: ImageKey): {
  src?: string;
  srcSet?: string;
  alt: string;
  shot: string;
} {
  const entry = images[key] as ImageEntry | undefined;
  if (!entry) {
    return { alt: "", shot: "" };
  }
  const isDev = process.env.NODE_ENV !== "production";
  const showSample =
    isDev || process.env.NEXT_PUBLIC_SHOW_SAMPLE_IMAGES === "true";
  const raw = entry.src || (showSample ? entry.sampleSrc : null);
  if (!raw) {
    return { alt: entry.alt, shot: entry.shot };
  }
  const widths = [640, 1080, 1600];
  const srcSet = widths
    .map((w) => `${imageLoader({ src: raw, width: w, quality: 75 })} ${w}w`)
    .join(", ");
  return {
    src: imageLoader({ src: raw, width: 1280, quality: 75 }),
    srcSet,
    alt: entry.alt,
    shot: entry.shot,
  };
}

function BannerSlide({
  banner,
  cfg,
  reducedMotion,
}: {
  banner: CampaignBannerItem;
  cfg: CampaignBannersConfig;
  reducedMotion: boolean;
}) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = React.useState(false);

  React.useEffect(() => {
    setVideoFailed(false);
  }, [banner.videoSrc]);

  React.useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (
      !video ||
      !section ||
      reducedMotion ||
      cfg.mediaType !== "video" ||
      !banner.videoSrc ||
      videoFailed
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play()?.catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [reducedMotion, cfg.mediaType, banner.videoSrc, videoFailed]);

  const desktopImg = resolveBannerImage(banner.imageKey);
  const phoneImg = resolveBannerImage(banner.phoneImageKey);

  const heightClass =
    cfg.height === "85"
      ? "h-[85svh] min-h-[480px]"
      : cfg.height === "70"
        ? "h-[70svh] min-h-[420px]"
        : "h-[100svh] min-h-[540px]";

  const posClass =
    cfg.textPosition === "bottom-centre"
      ? "items-center justify-end pb-14 sm:pb-16 text-center"
      : cfg.textPosition === "bottom-left"
        ? "items-start justify-end pb-14 sm:pb-16 px-6 sm:px-12 lg:px-16 text-left"
        : "items-center justify-center text-center";

  const buttonClass =
    cfg.buttonStyle === "solid"
      ? "mt-6 min-h-[48px] px-8 rounded-pill bg-cream-50 text-cocoa-900 font-body font-semibold text-[13px] uppercase tracking-[0.12em] inline-flex items-center justify-center transition-colors duration-300 ease-soft hover:bg-sand-100 focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-4"
      : cfg.buttonStyle === "link"
        ? "mt-6 min-h-[44px] px-2 font-body font-semibold text-[13px] uppercase tracking-[0.12em] underline underline-offset-4 text-cream-50 inline-flex items-center justify-center transition-opacity duration-300 ease-soft hover:opacity-80 focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-4"
        : "mt-6 min-h-[48px] px-8 rounded-pill border border-cream-50 bg-transparent text-cream-50 font-body font-semibold text-[13px] uppercase tracking-[0.12em] inline-flex items-center justify-center transition-colors duration-300 ease-soft hover:bg-cream-50 hover:text-cocoa-900 focus-visible:bg-cream-50 focus-visible:text-cocoa-900 focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-4";

  const headingId = `campaign-banner-title-${banner.id}`;

  return (
    <section
      ref={sectionRef}
      aria-labelledby={headingId}
      className={cn(
        "relative w-full overflow-hidden rounded-none bg-cocoa-900",
        heightClass
      )}
    >
      {desktopImg.src ? (
        <picture className="w-full h-full block">
          {phoneImg.srcSet && (
            <source media="(max-width: 767px)" srcSet={phoneImg.srcSet} />
          )}
          <img
            src={desktopImg.src}
            srcSet={desktopImg.srcSet}
            sizes="100vw"
            alt={desktopImg.alt}
            loading="lazy"
            decoding="async"
            style={
              {
                "--cb-pos-m": `${banner.phoneFocusX}% ${banner.phoneFocusY}%`,
                "--cb-pos-d": `${banner.focusX}% ${banner.focusY}%`,
              } as React.CSSProperties
            }
            className="w-full h-full object-cover [object-position:var(--cb-pos-m)] md:[object-position:var(--cb-pos-d)]"
          />
        </picture>
      ) : (
        <div
          role="img"
          aria-label={desktopImg.alt}
          className="w-full h-full bg-sand-100 flex items-center justify-center p-6 text-cocoa-700 text-sm"
        >
          {desktopImg.shot && <span>Photo: {desktopImg.shot}</span>}
        </div>
      )}

      {cfg.mediaType === "video" &&
        !reducedMotion &&
        banner.videoSrc &&
        !videoFailed && (
          <video
            ref={videoRef}
            src={banner.videoSrc}
            poster={desktopImg.src}
            muted
            loop
            playsInline
            autoPlay
            preload="none"
            aria-hidden="true"
            onError={() => setVideoFailed(true)}
            style={
              {
                "--cb-pos-m": `${banner.phoneFocusX}% ${banner.phoneFocusY}%`,
                "--cb-pos-d": `${banner.focusX}% ${banner.focusY}%`,
              } as React.CSSProperties
            }
            className="absolute inset-0 w-full h-full object-cover [object-position:var(--cb-pos-m)] md:[object-position:var(--cb-pos-d)]"
          />
        )}

      {/* Overlay (a): Bottom gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to top, rgba(69, 33, 4, ${cfg.bottomGradient / 100}) 0%, transparent 50%)`,
        }}
      />

      {/* Overlay (b): Soft centre glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, rgba(69, 33, 4, ${cfg.centreGlow / 100}) 0%, transparent 65%)`,
        }}
      />

      {/* Text block */}
      <div
        className={cn("absolute inset-0 z-10 flex flex-col px-6", posClass)}
      >
        <div
          style={{ transform: `translateY(${cfg.textOffsetY}%)` }}
          className={cn(
            "flex flex-col",
            cfg.textPosition === "bottom-left" ? "items-start" : "items-center"
          )}
        >
          <h2
            id={headingId}
            style={
              {
                "--cb-t-m": `${cfg.titleSizeMobile}px`,
                "--cb-t-d": `${cfg.titleSizeDesktop}px`,
              } as React.CSSProperties
            }
            className="font-heading [font-variation-settings:'SOFT'_75] font-medium text-cream-50 normal-case max-w-[18ch] leading-[1.15] text-[length:var(--cb-t-m)] lg:text-[length:var(--cb-t-d)]"
          >
            {banner.title}
          </h2>
          <Link href={banner.href} className={buttonClass}>
            {banner.buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function CampaignBanners() {
  const { department } = useDepartment();
  const customCfg =
    useSectionConfig<CampaignBannersConfig>("campaign-banners");
  const cfg = customCfg ?? DEFAULT_CAMPAIGN_CONFIG;

  const [displayedDept, setDisplayedDept] = React.useState(department);
  const [fadingOut, setFadingOut] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const swapTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  React.useEffect(() => {
    if (department === displayedDept) return;
    if (reducedMotion) {
      setDisplayedDept(department);
      setFadingOut(false);
      return;
    }
    if (swapTimerRef.current !== null) {
      window.clearTimeout(swapTimerRef.current);
    }
    setFadingOut(true);
    swapTimerRef.current = window.setTimeout(() => {
      setDisplayedDept(department);
      setFadingOut(false);
      swapTimerRef.current = null;
    }, 150);
  }, [department, displayedDept, reducedMotion]);

  React.useEffect(() => {
    return () => {
      if (swapTimerRef.current !== null) {
        window.clearTimeout(swapTimerRef.current);
      }
    };
  }, []);

  const banners =
    cfg.departments[displayedDept] ?? cfg.departments["baby-toddler"];

  return (
    <div
      className={cn(
        "w-full bg-cream-50 flex flex-col transition-opacity duration-300 ease-soft motion-reduce:transition-none",
        fadingOut ? "opacity-0" : "opacity-100"
      )}
      style={{
        paddingTop: cfg.gapTop ? `${cfg.gapPx}px` : undefined,
        gap: `${cfg.gapPx}px`,
      }}
    >
      {banners.map((banner) => (
        <BannerSlide
          key={`${displayedDept}-${banner.id}`}
          banner={banner}
          cfg={cfg}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}
