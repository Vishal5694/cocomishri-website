import * as React from "react";
import { getImageProps } from "next/image";
import { images } from "@/lib/images";
import { Sparkle } from "@/components/ui/sparkle";
import { cn } from "@/lib/utils";

export function HeroImage({ className }: { className?: string }) {
  const desktopEntry = images["hero-desktop"];
  const mobileEntry = images["hero-mobile"];

  const isDev = process.env.NODE_ENV !== "production";
  const showSample =
    isDev || process.env.NEXT_PUBLIC_SHOW_SAMPLE_IMAGES === "true";

  const desktopSrc =
    desktopEntry.src || (showSample ? desktopEntry.sampleSrc : null);
  const mobileSrc =
    mobileEntry.src || (showSample ? mobileEntry.sampleSrc : null);

  if (desktopSrc && mobileSrc) {
    const {
      props: { srcSet: desktopSrcSet },
    } = getImageProps({
      src: desktopSrc,
      alt: desktopEntry.alt,
      fill: true,
      priority: true,
      sizes: "100vw",
    });

    const {
      props: { srcSet: mobileSrcSet, ...mobileProps },
    } = getImageProps({
      src: mobileSrc,
      alt: mobileEntry.alt,
      fill: true,
      priority: true,
      sizes: "100vw",
    });

    return (
      <div
        className={cn(
          "relative w-full h-[min(56vh,125vw)] lg:h-[78vh] lg:min-h-[560px] overflow-hidden bg-caramel-100",
          className
        )}
      >
        <picture className="w-full h-full block">
          <source media="(min-width: 1024px)" srcSet={desktopSrcSet} />
          <source media="(max-width: 1023px)" srcSet={mobileSrcSet} />
          <img
            {...mobileProps}
            fetchPriority="high"
            alt={desktopEntry.alt}
            className="w-full h-full object-cover [object-position:center_25%] lg:[object-position:center_30%]"
            style={{
              ...mobileProps.style,
              objectFit: "cover",
            }}
          />
        </picture>
        {showSample && isDev && (
          <span className="absolute bottom-2 right-2 z-10 text-[12px] leading-none text-cream-50 bg-cocoa-900/70 rounded-pill px-2 py-1 select-none pointer-events-none">
            Sample photo
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={desktopEntry.alt}
      className={cn(
        "relative w-full h-[min(56vh,125vw)] lg:h-[78vh] lg:min-h-[560px] overflow-hidden bg-caramel-100 flex flex-col items-center justify-center text-center p-4 select-none",
        className
      )}
    >
      <Sparkle size={16} className="text-cocoa-700 shrink-0" />
      {isDev && desktopEntry.shot && (
        <span className="mt-2 text-[13px] text-cocoa-700 font-sans line-clamp-2 px-2 leading-tight">
          Photo: {desktopEntry.shot}
        </span>
      )}
    </div>
  );
}
