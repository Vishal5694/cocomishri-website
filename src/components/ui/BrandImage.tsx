import * as React from "react";
import Image from "next/image";
import { Sparkle } from "@/components/ui/sparkle";
import { images, type ImageKey, type ImageEntry } from "@/lib/images";
import { cn } from "@/lib/utils";

export interface BrandImageProps extends React.HTMLAttributes<HTMLDivElement> {
  imageKey?: ImageKey | null;
  sizes?: string;
  priority?: boolean;
  className?: string;
  ratioOverride?: string;
  altOverride?: string;
  captionOverride?: string;
}

export function BrandImage({
  imageKey,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  className,
  ratioOverride,
  altOverride,
  captionOverride,
  style,
  ...props
}: BrandImageProps) {
  const entry: ImageEntry | null = imageKey ? (images[imageKey] as ImageEntry) : null;
  const ratio = ratioOverride || entry?.ratio || "4/5";
  const alt = altOverride || entry?.alt || "Cocomishri";
  const shot = captionOverride || (entry?.shot ? `Photo: ${entry.shot}` : null);
  const src = entry?.src || null;
  const sampleSrc = entry?.sampleSrc || null;

  const isDev = process.env.NODE_ENV !== "production";
  const showSample =
    isDev || process.env.NEXT_PUBLIC_SHOW_SAMPLE_IMAGES === "true";

  const effectiveSrc = src || (showSample ? sampleSrc : null);
  const isSample = !src && showSample && Boolean(sampleSrc);

  if (effectiveSrc) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-[24px] bg-caramel-100",
          className
        )}
        style={{ aspectRatio: ratio, ...style }}
        {...props}
      >
        <Image
          src={effectiveSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{ objectPosition: entry?.position || "center" }}
        />
        {isSample && isDev && (
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
      aria-label={alt}
      className={cn(
        "relative overflow-hidden rounded-[24px] bg-caramel-100 flex flex-col items-center justify-center text-center p-4 select-none",
        className
      )}
      style={{ aspectRatio: ratio, ...style }}
      {...props}
    >
      <Sparkle size={16} className="text-cocoa-700 shrink-0" />
      {isDev && shot && (
        <span className="mt-2 text-[13px] text-cocoa-700 font-sans line-clamp-2 px-2 leading-tight">
          {shot}
        </span>
      )}
    </div>
  );
}
